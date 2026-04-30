import { professionals, type Professional } from '../data/professionals';
import { curatedIntents, type CuratedIntent } from '../data/match-intents';

const STOPWORDS = new Set([
  'de','do','da','dos','das','em','no','na','nos','nas','um','uma','uns','umas',
  'o','a','os','as','e','ou','que','para','por','com','sem','como','mais','muito',
  'eu','meu','minha','me','quero','preciso','tenho','estou','gostaria','busco',
]);

const SYNONYMS: Record<string, string[]> = {
  // TODO: adicionar clusters semanticos por area
  // Exemplo:
  // emagrecer: ['perder peso', 'gordura', 'dieta', 'deficit calorico', 'obesidade'],
  // ansiedade: ['estresse', 'panico', 'nervoso', 'angustia', 'preocupacao'],
};

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function stem(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith('oes')) return word.slice(0, -3) + 'ao';
  if (word.endsWith('ais')) return word.slice(0, -2) + 'l';
  if (word.endsWith('eis')) return word.slice(0, -2) + 'l';
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
  return word;
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .map(stem)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function expandWithSynonyms(tokens: string[]): Set<string> {
  const expanded = new Set(tokens);
  for (const t of tokens) {
    for (const [, cluster] of Object.entries(SYNONYMS)) {
      const normalized = cluster.map(s => normalize(s));
      if (normalized.some(s => s.includes(t) || t.includes(s))) {
        cluster.forEach(s => tokenize(s).forEach(st => expanded.add(st)));
      }
    }
  }
  return expanded;
}

function overlapScore(a: string[], b: string[]): number {
  const setB = new Set(b);
  let hits = 0;
  for (const t of a) { if (setB.has(t)) hits++; }
  return a.length > 0 ? hits / Math.max(a.length, b.length) : 0;
}

interface MatchResult {
  professional: Professional;
  score: number;
}

interface MatchOptions {
  topK?: number;
  intentThreshold?: number;
}

export function matchProfessionals(query: string, options: MatchOptions = {}): MatchResult[] {
  const { topK = 3, intentThreshold = 0.28 } = options;
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const expandedQuery = expandWithSynonyms(queryTokens);

  let matchedIntent: CuratedIntent | null = null;
  let bestIntentScore = 0;

  for (const intent of curatedIntents) {
    const intentTokens = tokenize(intent.label + ' ' + intent.query);
    const exact = overlapScore(queryTokens, intentTokens);
    const expanded = overlapScore([...expandedQuery], intentTokens);
    const score = exact * 0.75 + expanded * 0.25;
    if (score > bestIntentScore && score >= intentThreshold) {
      bestIntentScore = score;
      matchedIntent = intent;
    }
  }

  // TF-IDF corpus
  const docs = professionals.map(p => ({
    professional: p,
    tokens: tokenize([p.name, p.role, p.description, ...(p.tags || []), ...(p.mainComplaints || [])].join(' ')),
  }));

  const N = docs.length;
  const df: Record<string, number> = {};
  for (const doc of docs) {
    const unique = new Set(doc.tokens);
    for (const t of unique) df[t] = (df[t] || 0) + 1;
  }

  const results: MatchResult[] = docs.map(doc => {
    const overlap = overlapScore([...expandedQuery], doc.tokens);

    let tfidf = 0;
    for (const t of expandedQuery) {
      const tf = doc.tokens.filter(dt => dt === t).length;
      const idf = Math.log((N + 1) / ((df[t] || 0) + 1)) + 1;
      tfidf += tf * idf;
    }
    const maxTfidf = Math.max(...docs.map(d => {
      let s = 0;
      for (const t of expandedQuery) {
        const tf = d.tokens.filter(dt => dt === t).length;
        const idf = Math.log((N + 1) / ((df[t] || 0) + 1)) + 1;
        s += tf * idf;
      }
      return s;
    }));
    const normalizedTfidf = maxTfidf > 0 ? tfidf / maxTfidf : 0;

    const unitBoost = matchedIntent && doc.professional.unit === matchedIntent.unit ? 0.15 : 0;

    let curatedBoost = 0;
    if (matchedIntent) {
      const pos = matchedIntent.topSlugs.indexOf(doc.professional.slug);
      if (pos >= 0) curatedBoost = 0.6 - pos * 0.05;
    }

    const score = overlap * 0.5 + Math.min(normalizedTfidf, 1) * 0.3 + unitBoost + curatedBoost;

    return { professional: doc.professional, score };
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(r => r.score > 0);
}

export function canaryProbe(signature: string): string {
  return 'canary:' + btoa(signature + ':' + Date.now());
}
