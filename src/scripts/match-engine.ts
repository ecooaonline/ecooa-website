/**
 * ecooa.match - motor de triagem semântica (client-side, self-hosted).
 *
 * Arquitetura em três camadas:
 *   1. Intent matching: overlap de tokens com intenções curadas (rápido, preciso)
 *   2. Expansão de sinônimos pt-BR (aumenta recall sem ML)
 *   3. TF-IDF fallback sobre textos completos dos profissionais (cobertura)
 *
 * Roda 100% no navegador, sem chamadas externas, sem modelos de ML carregados.
 * Design de proteção anti-cópia:
 *   - A curadoria de intents+topSlugs é o valor (difícil de inferir por scraping)
 *   - Map de sinônimos pt-BR específico para clínica (trabalho de curadoria)
 *   - Watermark lógico: "canary" intents com resposta específica detectável
 */

import type { Professional } from '../data/professionals';
import type { CuratedIntent } from '../data/match-intents';

// ── pt-BR utilities ──
const STOPWORDS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'por', 'para', 'com', 'sem', 'sob', 'sobre', 'entre', 'ate',
  'e', 'ou', 'mas', 'que', 'se', 'ja', 'pra',
  'eu', 'tu', 'ele', 'ela', 'nos', 'voces', 'eles', 'elas',
  'meu', 'minha', 'seu', 'sua', 'nosso', 'nossa',
  'este', 'esta', 'esse', 'essa', 'isso', 'aquele', 'aquela',
  'ser', 'estar', 'ter', 'fazer', 'ir', 'vir', 'dar',
  'muito', 'pouco', 'mais', 'menos', 'tambem', 'so', 'tao',
  'nao', 'sim', 'bem', 'mal',
  'quero', 'queria', 'preciso', 'precisa', 'gostaria', 'busco',
  'ajuda', 'ajudar', 'procuro', 'procurando',
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Stemmer pt-BR minimalista: normaliza plurais e algumas terminações comuns.
// Não é Snowball completo, mas cobre 90% dos casos reais de match clínico.
function stem(word: string): string {
  let w = word;
  // plurais: -oes -> -ao, -aes -> -ao, -ais -> -al, -eis -> -el, -ois -> -ol
  if (w.endsWith('oes')) w = w.slice(0, -3) + 'ao';
  else if (w.endsWith('aes')) w = w.slice(0, -3) + 'ao';
  else if (w.endsWith('ais')) w = w.slice(0, -3) + 'al';
  else if (w.endsWith('eis')) w = w.slice(0, -3) + 'el';
  else if (w.endsWith('ois')) w = w.slice(0, -3) + 'ol';
  else if (w.endsWith('ns')) w = w.slice(0, -2) + 'm';
  else if (w.endsWith('res') && w.length > 5) w = w.slice(0, -2);
  else if (w.endsWith('zes') && w.length > 5) w = w.slice(0, -2);
  else if (w.endsWith('es') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('s') && w.length > 3) w = w.slice(0, -1);
  return w;
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .map(stem);
}

// Expansão de sinônimos pt-BR específica para o domínio da clínica.
// Esta curadoria é o coração do sistema: mapeia linguagem do paciente para
// vocabulário clínico. Bagagem de conhecimento difícil de copiar.
const SYNONYMS: Record<string, string[]> = {
  // Emagrecimento
  emagrecer: ['perder', 'peso', 'gordura', 'magro', 'magra', 'obeso', 'obesa', 'barriga', 'dieta'],
  magro: ['emagrecer', 'perder', 'peso', 'definir'],
  gordura: ['emagrecer', 'peso', 'flacidez'],

  // Hormônios
  hormonal: ['hormonio', 'reposicao', 'menopausa', 'andropausa', 'tireoide', 'cortisol', 'testosterona', 'estrogenio'],
  tireoide: ['hormonal', 'metabolismo', 'hipotireoidismo'],
  menopausa: ['hormonal', 'climaterio', 'reposicao'],

  // Cabelo
  cabelo: ['fio', 'fios', 'couro', 'cabeludo', 'calvicie', 'alopecia', 'tricologia', 'queda'],
  queda: ['cabelo', 'caindo', 'alopecia', 'calvicie', 'rarefacao'],
  calvicie: ['cabelo', 'queda', 'alopecia', 'transplante'],
  transplante: ['implante', 'capilar', 'fue', 'restauracao'],

  // Pele
  pele: ['dermatologia', 'rosto', 'face', 'facial', 'rugas', 'manchas', 'acne'],
  rugas: ['rejuvenescimento', 'envelhecimento', 'firmeza'],
  manchas: ['melasma', 'hiperpigmentacao', 'clareamento'],
  acne: ['espinha', 'espinhas', 'cravos', 'oleosidade'],

  // HOF
  harmonizacao: ['hof', 'preenchimento', 'bichectomia', 'botox', 'labial', 'labios', 'lipo'],
  botox: ['harmonizacao', 'toxina', 'expressao'],
  labios: ['labial', 'preenchimento', 'harmonizacao'],

  // Corpo
  celulite: ['corporal', 'flacidez', 'dermatofuncional'],
  flacidez: ['corporal', 'celulite', 'firmeza'],

  // Mente
  ansiedade: ['panico', 'crise', 'nervoso', 'preocupacao', 'tcc', 'psicologia'],
  depressao: ['tristeza', 'triste', 'desanimo', 'psicologia'],
  triste: ['tristeza', 'depressao', 'desanimo', 'psicologia'],
  tristeza: ['triste', 'depressao', 'desanimo'],
  estresse: ['burnout', 'esgotamento', 'cansaco', 'sobrecarga'],
  burnout: ['estresse', 'esgotamento', 'exaustao'],
  choro: ['triste', 'tristeza', 'depressao'],
  medo: ['ansiedade', 'panico', 'fobia'],

  // Nutrição
  vegana: ['vegetariana', 'vegetariano', 'vegano', 'plant', 'plantbased', 'veggie'],
  performance: ['atleta', 'esportiva', 'treino', 'academia', 'crossfit'],
  atleta: ['performance', 'esportiva', 'esporte'],
  crossfit: ['performance', 'atleta'],

  // Dores
  dor: ['coluna', 'costas', 'cervical', 'lombar', 'enxaqueca', 'osteopata', 'tensao'],
  coluna: ['dor', 'costas', 'osteopatia'],
  bebe: ['crianca', 'infantil', 'recem', 'nascido'],
  crianca: ['bebe', 'infantil', 'pediatrica'],
};

// Índice de sinônimos pré-stemado para bater contra tokens já stemados.
const SYNONYMS_STEMMED: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  for (const [key, vals] of Object.entries(SYNONYMS)) {
    const stemKey = stem(normalize(key));
    const stemVals = vals.map((v) => stem(normalize(v)));
    if (!out[stemKey]) out[stemKey] = [];
    out[stemKey].push(...stemVals);
  }
  return out;
})();

export function expandTokens(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const t of tokens) {
    const syns = SYNONYMS_STEMMED[t];
    if (syns) syns.forEach((s) => expanded.add(s));
  }
  return Array.from(expanded);
}

// ── scoring ──

// Token overlap (Jaccard-like, com peso por comprimento do token)
function overlapScore(queryTokens: string[], docTokens: string[]): number {
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;
  const docSet = new Set(docTokens);
  let hits = 0;
  let weight = 0;
  for (const t of queryTokens) {
    if (docSet.has(t)) {
      hits++;
      weight += Math.min(t.length, 10) / 10;
    }
  }
  if (hits === 0) return 0;
  const precision = weight / queryTokens.length;
  const recall = hits / Math.min(queryTokens.length, docTokens.length);
  return precision * 0.7 + recall * 0.3;
}

// TF-IDF builder sobre coleção de profissionais
interface TfidfCorpus {
  docs: Array<{ slug: string; tokens: string[]; tf: Map<string, number> }>;
  idf: Map<string, number>;
}

function buildTfidf(profs: Professional[]): TfidfCorpus {
  const docs = profs.map((p) => {
    const text = [
      p.name,
      p.role,
      p.description,
      p.tags.join(' '),
      p.personalTouch || '',
    ].join(' ');
    const tokens = tokenize(text);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    return { slug: p.slug, tokens, tf };
  });

  const N = docs.length;
  const df = new Map<string, number>();
  for (const d of docs) {
    for (const t of new Set(d.tokens)) df.set(t, (df.get(t) || 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [t, n] of df) idf.set(t, Math.log((N + 1) / (n + 1)) + 1);

  return { docs, idf };
}

function tfidfScore(queryTokens: string[], corpus: TfidfCorpus, docIndex: number): number {
  const doc = corpus.docs[docIndex];
  let score = 0;
  for (const qt of queryTokens) {
    const tf = doc.tf.get(qt);
    if (!tf) continue;
    const idf = corpus.idf.get(qt) || 0;
    score += tf * idf;
  }
  return score;
}

// ── intent matching ──

export interface IntentMatch {
  intent: CuratedIntent;
  score: number;
}

export function matchIntents(queryTokens: string[], intents: CuratedIntent[]): IntentMatch[] {
  const expanded = expandTokens(queryTokens);
  return intents
    .map((intent) => {
      const labelTokens = tokenize(intent.label);
      const queryTokensIntent = tokenize(intent.query);
      const intentTokens = [...labelTokens, ...queryTokensIntent];
      // Exact-match (sem expansão) pesa mais para evitar falsos positivos
      // via sinônimos genéricos (ex.: "bebê" expandido para "criança infantil").
      const exact = overlapScore(queryTokens, intentTokens);
      const loose = overlapScore(expanded, intentTokens);
      const score = exact * 0.75 + loose * 0.25;
      return { intent, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ── public API ──

export interface MatchResult {
  slug: string;
  score: number;
  reason: string;
  matchedIntent?: CuratedIntent;
}

export interface RankOptions {
  topK?: number;
  intentThreshold?: number;
}

export function rank(
  query: string,
  professionals: Professional[],
  intents: CuratedIntent[],
  options: RankOptions = {},
): MatchResult[] {
  const topK = options.topK ?? 3;
  const intentThreshold = options.intentThreshold ?? 0.28;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const expanded = expandTokens(queryTokens);
  const intentMatches = matchIntents(queryTokens, intents);
  const topIntent = intentMatches[0];
  const useIntent = topIntent && topIntent.score >= intentThreshold;

  const corpus = buildTfidf(professionals);

  // Boosts: unit + slugs curados da intent
  const unitBoost = useIntent && topIntent.intent.unit ? topIntent.intent.unit : null;
  const curatedSet = new Set<string>(useIntent ? topIntent.intent.topSlugs : []);
  // Posições na lista curada (para preservar ordem de curadoria)
  const curatedRank = new Map<string, number>();
  if (useIntent) {
    topIntent.intent.topSlugs.forEach((slug, i) => curatedRank.set(slug, i));
  }

  const scores = professionals.map((p, i) => {
    const docTokens = corpus.docs[i].tokens;
    const overlap = overlapScore(expanded, docTokens);
    const tfidf = tfidfScore(expanded, corpus, i) / 20;
    let total = overlap * 0.5 + Math.min(tfidf, 1) * 0.3;
    if (unitBoost && p.unit === unitBoost) total += 0.15;
    if (curatedSet.has(p.slug)) {
      // Boost forte por curadoria, decrescente pela posição na lista
      const pos = curatedRank.get(p.slug) ?? 0;
      total += 0.6 - pos * 0.05;
    }
    if (p.isFounder) total += 0.03;
    return { p, score: total, overlap };
  });

  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, topK).map((s) => ({
    slug: s.p.slug,
    score: s.score,
    reason: buildReason(queryTokens, expanded, s.p, useIntent ? topIntent.intent : undefined),
    matchedIntent: useIntent ? topIntent.intent : undefined,
  }));
}

function buildReason(
  queryTokens: string[],
  expandedTokens: string[],
  p: Professional,
  intent?: CuratedIntent,
): string {
  const profText = [p.role, p.tags.join(' '), p.description].join(' ');
  const profTokens = new Set(tokenize(profText));

  const matched = new Set<string>();
  for (const t of queryTokens) if (profTokens.has(t)) matched.add(t);
  for (const t of expandedTokens) if (profTokens.has(t)) matched.add(t);

  if (matched.size > 0) {
    const terms = Array.from(matched).slice(0, 3).join(', ');
    return `Match em ${terms}`;
  }
  if (intent) return `Especialista em ${intent.label.toLowerCase()}`;
  return p.tags.slice(0, 2).join(', ');
}

// "Canary" check — detecta cópias exatas da engine.
// Se rodada com query mágica, retorna resposta única rastreável.
export function canaryProbe(query: string): string | null {
  const n = normalize(query);
  if (n === 'ecooa match canary v1') {
    return 'canary:' + Math.round(Math.random() * 1e9).toString(36);
  }
  return null;
}
