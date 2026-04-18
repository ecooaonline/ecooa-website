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
//
// Organização por cluster semântico. A relação é simétrica: adicionar um
// sinônimo em um cluster expande todos os outros termos do mesmo grupo.
// Cobertura: medicina geral, emagrecimento/metabolismo, hormônios, estética
// (pele, cabelo, HOF, corpo), nutrição (esportiva, comportamental, clínica),
// saúde mental (transtornos, performance, relacionamentos), dores/osteopatia,
// nutrição materno-infantil.
const SYNONYM_CLUSTERS: string[][] = [
  // ── emagrecimento / peso / composição ──
  ['emagrecer', 'perder peso', 'gordura', 'magro', 'magra', 'obeso', 'obesa', 'obesidade', 'barriga', 'pancinha', 'abdomen', 'dieta', 'regime', 'restrição', 'deficit', 'calorico'],
  ['peso', 'balanca', 'quilo', 'kilos', 'pesando', 'engordar', 'engordei', 'engordou', 'engordou muito'],
  ['massa muscular', 'hipertrofia', 'musculo', 'musculatura', 'volume muscular', 'bulking', 'ganho massa', 'ganhar musculo'],
  ['composicao corporal', 'bioimpedancia', 'bodyfat', 'percentual gordura', 'inbody', 'DEXA', 'dexa', 'definicao'],

  // ── metabolismo / medicina geral ──
  ['metabolismo', 'metabolico', 'acelerar', 'metabolizar', 'queimar caloria', 'basal'],
  ['cansaco', 'fadiga', 'exausto', 'exausta', 'sem energia', 'cansaca', 'cansada', 'prostrado', 'moleza', 'sono', 'sonolencia'],
  ['check up', 'checkup', 'exame preventivo', 'medicina preventiva', 'avaliacao medica', 'exames laboratoriais', 'exame sangue', 'rotina'],
  ['pressao alta', 'hipertensao', 'hipertenso', 'pressao arterial'],
  ['diabetes', 'glicose', 'acucar alto', 'insulina', 'pre diabetes', 'resistencia insulina', 'a1c', 'hemoglobina glicada'],
  ['colesterol', 'triglicerides', 'ldl', 'hdl', 'lipidograma', 'dislipidemia'],
  ['intestino', 'constipacao', 'prisao de ventre', 'diarreia', 'sibo', 'sii', 'intestino irritavel', 'microbioma', 'probiotico', 'disbiose'],
  ['refluxo', 'gastrite', 'helicobacter', 'azia', 'queimacao', 'estomago'],
  ['inflamacao', 'inflamado', 'pcr', 'marcadores inflamatorios', 'inflamacao cronica'],
  ['imunidade', 'imunidade baixa', 'defesas', 'gripa toda hora', 'adoecendo', 'resfriado frequente'],
  ['detox', 'desintoxicacao', 'limpeza', 'sobrecarga', 'toxinas'],
  ['inchaco', 'retencao', 'retencao liquido', 'edema', 'inchada', 'incha'],

  // ── hormônios / reposição ──
  ['hormonal', 'hormonio', 'endocrino', 'reposicao hormonal', 'reposicao', 'TRH', 'trh'],
  ['tireoide', 'hipotireoidismo', 'hipertireoidismo', 'hashimoto', 'tsh', 't3', 't4', 'nodulo tireoide'],
  ['cortisol', 'stress hormonal', 'fadiga adrenal', 'adrenal'],
  ['testosterona', 'androgenio', 'anabolico', 'baixa testosterona', 'andropausa', 'andropausa masculina'],
  ['estrogenio', 'progesterona', 'estradiol', 'ciclo hormonal'],
  ['menopausa', 'climaterio', 'perimenopausa', 'pos menopausa', 'calorao', 'fogacho', 'suor noturno'],
  ['tpm', 'tensao pre menstrual', 'menstruacao', 'ciclo menstrual', 'colica menstrual', 'sangramento', 'dismenorreia'],
  ['sop', 'ovario policistico', 'ciclo irregular', 'acne hormonal', 'hirsutismo'],
  ['libido', 'desejo sexual', 'baixa libido', 'disfuncao erétil', 'impotencia', 'performance sexual', 'saude sexual'],
  ['fertilidade', 'engravidar', 'tentando engravidar', 'gestacao', 'gravidez', 'pre natal', 'pos parto', 'puerperio'],
  ['longevidade', 'antienvelhecimento', 'anti aging', 'envelhecimento saudavel', 'idade biologica', 'healthspan'],

  // ── vitaminas e minerais ──
  ['vitamina d', 'vitamina d3', 'deficiencia vitamina'],
  ['b12', 'vitamina b12', 'complexo b'],
  ['ferro', 'anemia', 'ferritina', 'ferropenia'],
  ['magnesio', 'zinco', 'selenio', 'mineral'],
  ['omega 3', 'omega tres', 'dha', 'epa'],
  ['suplemento', 'suplementacao', 'whey', 'creatina', 'bcaa', 'colageno', 'glutamina'],
  ['soroterapia', 'terapia intravenosa', 'vitamina injetavel', 'hidratacao endovenosa', 'vitaminico iv'],

  // ── cabelo / tricologia ──
  ['cabelo', 'cabelos', 'fio', 'fios', 'couro cabeludo', 'capilar'],
  ['queda cabelo', 'queda de cabelo', 'cabelo caindo', 'afinamento', 'rarefacao', 'cabelo fino', 'perda capilar', 'cai muito'],
  ['calvicie', 'alopecia', 'alopecia androgenetica', 'alopecia areata', 'calvo', 'careca', 'entradas'],
  ['tricologia', 'tricologista', 'doenca capilar', 'dermatite couro', 'dermatite seborreica', 'seborreia'],
  ['transplante capilar', 'implante capilar', 'fue', 'sapphire', 'restauracao capilar', 'cirurgia capilar'],
  ['caspa', 'oleosidade couro', 'coceira couro'],
  ['prp capilar', 'microinfusao', 'mmp', 'mesoterapia capilar', 'intradermoterapia capilar'],

  // ── pele / dermatologia ──
  ['pele', 'rosto', 'face', 'facial', 'cutis', 'epiderme', 'dermatologia', 'dermatologico'],
  ['acne', 'espinha', 'espinhas', 'cravos', 'oleosidade', 'seborreia', 'pele oleosa', 'cicatriz acne', 'acne adulta', 'acne hormonal'],
  ['manchas', 'melasma', 'hiperpigmentacao', 'clareamento', 'mancha sol', 'mancha gravidez', 'cloasma'],
  ['rugas', 'linhas expressao', 'pe galinha', 'bigode chines', 'codigo de barras', 'testa', 'glabela'],
  ['rejuvenescimento', 'envelhecimento', 'firmeza', 'elasticidade', 'flacidez facial', 'pele flacida'],
  ['rosacea', 'vermelhidao', 'sensibilidade', 'pele sensivel'],
  ['dermatite', 'eczema', 'vitiligo', 'psoriase', 'micose', 'fungo'],
  ['olheira', 'bolsa ocular', 'cansaco facial', 'area periocular'],
  ['estria', 'cicatriz', 'queloide', 'stretch marks'],
  ['peeling', 'peeling quimico', 'limpeza de pele', 'limpeza profunda', 'skincare', 'dermapen', 'microagulhamento'],
  ['laser', 'luz pulsada', 'ipl', 'lavieen', 'fraxel', 'co2'],
  ['radiofrequencia', 'ultraformer', 'hifu', 'ultrassom facial'],
  ['suor', 'hiperidrose', 'suor excessivo', 'axilas', 'maos suadas'],
  ['unha', 'onicomicose', 'fungo unha', 'onicolise'],

  // ── HOF / harmonização orofacial ──
  ['hof', 'harmonizacao', 'harmonizacao orofacial', 'harmonizacao facial', 'desenho facial'],
  ['botox', 'toxina botulinica', 'toxina', 'dysport', 'preencher expressao'],
  ['preenchimento', 'acido hialuronico', 'volumizar'],
  ['labios', 'labial', 'lip flip', 'preenchimento labial', 'boca carnuda', 'volume labial'],
  ['bichectomia', 'maca do rosto', 'definir mandibula', 'jaw'],
  ['bioestimulador', 'sculptra', 'radiesse', 'ellanse', 'poli l lactico', 'bioestimulacao'],
  ['fios pdo', 'fios de sustentacao', 'lifting sem cirurgia'],
  ['skinbooster', 'hidratacao profunda', 'skin booster'],
  ['papada', 'gordura submentoniana', 'duplo queixo', 'deoxicolato', 'belkyra'],
  ['sobrancelha', 'design sobrancelha', 'micropigmentacao', 'designer'],

  // ── odontologia estética ──
  ['sorriso', 'estetica dental', 'dente', 'dentes', 'clareamento dental', 'lente de contato', 'faceta', 'design do sorriso'],

  // ── corpo / dermatofuncional ──
  ['celulite', 'furinhos', 'casca laranja', 'hgg'],
  ['flacidez', 'flacida', 'pele flacida', 'barriga flacida', 'firmeza corporal'],
  ['gordura localizada', 'gordinha', 'pneu', 'culote', 'flanco', 'gordura teimosa'],
  ['drenagem linfatica', 'drenagem', 'massagem modeladora', 'lymphatic'],
  ['pos operatorio', 'pos cirurgia', 'lipo pos operatorio', 'abdominoplastia', 'lipoescultura'],
  ['criolipolise', 'crio', 'manthus', 'ultrassom corporal', 'tecarterapia', 'lipolaser'],
  ['pilates', 'rpg', 'core'],

  // ── mente / psicologia ──
  ['ansiedade', 'ansiedade generalizada', 'tag', 'panico', 'sindrome do panico', 'crise de ansiedade', 'crise', 'nervosismo', 'nervoso', 'preocupacao', 'apreensivo', 'angustia'],
  ['depressao', 'depressao maior', 'triste', 'tristeza', 'desanimo', 'anedonia', 'vazio', 'choro', 'chorando', 'nada da vontade', 'sem animo', 'desmotivado'],
  ['estresse', 'stress', 'sobrecarga', 'esgotamento', 'burnout', 'exaustao', 'workaholic', 'pressao trabalho'],
  ['tcc', 'terapia cognitivo comportamental', 'psicoterapia', 'terapia', 'psicologia', 'psicologa', 'psicologo', 'psi'],
  ['psiquiatria', 'psiquiatra', 'medicacao psiquiatrica', 'antidepressivo'],
  ['medo', 'fobia', 'fobia social', 'agorafobia', 'claustrofobia'],
  ['toc', 'obsessivo compulsivo', 'ritual', 'pensamento intrusivo', 'rumina'],
  ['tdah', 'deficit atencao', 'hiperatividade', 'concentracao', 'distracao', 'procrastinacao', 'executivo'],
  ['trauma', 'tept', 'estresse pos traumatico', 'abuso', 'violencia', 'acidente'],
  ['luto', 'perda', 'morte', 'pesar', 'saudade', 'separacao', 'divorcio'],
  ['autoestima', 'autoimagem', 'autoconfianca', 'autocuidado', 'autoconhecimento', 'identidade'],
  ['relacionamento', 'casal', 'casamento', 'conjugal', 'afetivo', 'conflito familiar', 'familia', 'comunicacao'],
  ['maternidade', 'paternidade', 'puerperal', 'maternagem'],
  ['adolescencia', 'adolescente', 'jovem', 'teenager'],
  ['performance mental', 'psicologia esportiva', 'foco', 'concentracao esportiva', 'motivacao', 'disciplina', 'resiliencia', 'mentalidade', 'mindset'],
  ['competicao', 'prova', 'atleta competitivo', 'pressao competitiva', 'controle emocional esporte'],
  ['insonia', 'sono ruim', 'dormir mal', 'sono leve', 'despertar noturno', 'higiene sono', 'apneia'],
  ['raiva', 'irritabilidade', 'explosao', 'agressividade', 'temperamento'],
  ['transtorno alimentar', 'compulsao', 'bulimia', 'anorexia', 'binge eating', 'comer emocional'],

  // ── nutrição ──
  ['nutricao', 'nutricionista', 'nutri', 'alimentacao', 'plano alimentar', 'dieta personalizada', 'reeducacao alimentar'],
  ['vegano', 'vegana', 'vegetariano', 'vegetariana', 'plant based', 'plantbased', 'veggie', 'flexitariano'],
  ['performance esportiva', 'nutricao esportiva', 'atleta', 'treino', 'academia', 'musculacao', 'corrida', 'running', 'maratona', 'triathlon', 'ciclismo'],
  ['crossfit', 'alta intensidade', 'hit', 'hiit', 'wod', 'treino funcional'],
  ['ortomolecular', 'nutricao ortomolecular', 'nutricao funcional', 'nutrigenomica', 'metabolomica', 'teste genetico', 'nutrigenetica'],
  ['nutricao comportamental', 'comportamento alimentar', 'relacao com comida', 'compulsao alimentar', 'emocional eating', 'mindful eating'],
  ['introducao alimentar', 'blw', 'baby led weaning', 'alimentacao do bebe', 'alimentacao infantil', 'nutricao infantil', 'pediatrica'],
  ['intolerancia', 'alergia alimentar', 'lactose', 'gluten', 'doenca celiaca', 'fodmap'],
  ['jejum intermitente', 'if', 'low carb', 'cetogenica', 'keto', 'paleo', 'mediterranea', 'dash'],

  // ── dores / osteopatia / bebês ──
  ['dor', 'dor cronica', 'tensao muscular', 'dor cervical', 'cervicalgia', 'dor lombar', 'lombalgia', 'dor coluna', 'dor costas', 'dor ombro', 'dor joelho', 'dor pescoco'],
  ['enxaqueca', 'cefaleia', 'dor cabeca', 'migranea'],
  ['osteopatia', 'osteopata', 'terapia manual', 'quiropraxia', 'rpg'],
  ['tontura', 'vertigem', 'labirintite', 'atm', 'disfuncao temporomandibular', 'estalo mandibula'],
  ['bebe', 'recem nascido', 'criança', 'crianca', 'infantil', 'pediatrico'],
  ['colica bebe', 'colica do bebe', 'choro bebe', 'refluxo bebe', 'torcicolo congenito', 'plagiocefalia', 'assimetria craniana'],

  // ── estética integrativa ──
  ['biorressonancia', 'terapia integrativa', 'medicina complementar', 'medicina integrativa', 'energetica', 'reiki holistico', 'holistica'],
];

// Constroi um mapa bidirecional e stemado a partir dos clusters.
// Cada token do cluster vira chave que aponta para todos os outros tokens do grupo.
const SYNONYMS_STEMMED: Map<string, Set<string>> = (() => {
  const map = new Map<string, Set<string>>();
  for (const cluster of SYNONYM_CLUSTERS) {
    // Tokeniza cada frase do cluster e coleta todos os termos stemados
    const members = new Set<string>();
    for (const phrase of cluster) {
      for (const t of tokenize(phrase)) members.add(t);
    }
    // Cada termo aponta para todos os outros do cluster
    for (const term of members) {
      let set = map.get(term);
      if (!set) {
        set = new Set<string>();
        map.set(term, set);
      }
      for (const other of members) {
        if (other !== term) set.add(other);
      }
    }
  }
  return map;
})();

export function expandTokens(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const t of tokens) {
    const syns = SYNONYMS_STEMMED.get(t);
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
