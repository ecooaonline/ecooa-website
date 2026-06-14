#!/usr/bin/env node
// Gate do Contrato de Páginas (P02/PROM-03) + Guardião regulatório (P01/P08).
// Roda contra o OUTPUT do build (dist/) — o que o usuário realmente vê.
// Falha (exit 1) em: rota estratégica ausente, utilitária noindex no sitemap,
// perda em massa de páginas, ou termo de promessa absoluta no conteúdo.
//
// Calibragem (Lei 26): a lista de termos cobre só promessas inequívocas de voz
// da clínica, hoje AUSENTES (passa agora, bloqueia regressão futura). Termos
// ambíguos/contextuais e depoimentos ficam para a calibragem do P12.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
let failures = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  failures++;
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ── Contrato de Páginas ──────────────────────────────────────────────
const STRATEGIC_ROUTES = [
  '/',
  '/quem-somos/',
  '/profissionais/',
  '/especialidades/',
  '/ecooa-med/',
  '/ecooa-esthetic/',
  '/ecooa-mind/',
  '/ecooa-working/',
  '/contato/',
  '/agendamento/',
  '/blog/',
  '/match/',
];
const FORBIDDEN_IN_SITEMAP = ['/obrigado', '/404', '/offline'];
const SITEMAP_FLOOR = 95; // piso anti-perda-em-massa (blog cresce; sem teto rígido)

console.log('Contrato de Páginas (sitemap):');
let sitemap = '';
try {
  sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
} catch {
  fail('dist/sitemap-0.xml não encontrado (build rodou?)');
}
if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, '')
  );
  const count = locs.length;
  console.log(`  URLs no sitemap: ${count}`);
  if (count < SITEMAP_FLOOR) fail(`sitemap abaixo do piso (${count} < ${SITEMAP_FLOOR})`);

  for (const r of STRATEGIC_ROUTES) {
    if (!locs.includes(r)) fail(`rota estratégica ausente do sitemap: ${r}`);
  }
  for (const u of FORBIDDEN_IN_SITEMAP) {
    if (locs.some((l) => l.startsWith(u))) fail(`utilitária noindex no sitemap: ${u}`);
  }
  if (failures === 0)
    ok(`${STRATEGIC_ROUTES.length} rotas estratégicas presentes; utilitárias fora; piso ok`);
}

// ── Guardião regulatório ─────────────────────────────────────────────
// Promessas absolutas inequívocas (voz da clínica). NÃO inclui termos de
// depoimento ("melhor clínica" em reviews) nem ambíguos ("garantir", "permanente"):
// esses são calibrados com contexto no P12.
const FORBIDDEN_PHRASES = [
  /resultados?\s+garantidos?/i,
  /cura\s+garantida/i,
  /satisfa[çc][ãa]o\s+garantida/i,
  /100\s*%\s*(de\s+)?(sucesso|eficaz|eficácia|seguro|garantido)/i,
  /vagas?\s+limitadas?/i,
  /[úu]ltimas?\s+vagas?/i,
  /sem\s+nenhum\s+risco/i,
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

console.log('Guardião regulatório (termos proibidos no output):');
let htmlFiles = [];
try {
  htmlFiles = walk(DIST);
} catch {
  fail('não consegui varrer dist/');
}
const hits = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const re of FORBIDDEN_PHRASES) {
    const m = html.match(re);
    if (m) hits.push(`${file.replace(DIST + '/', '')}: "${m[0]}"`);
  }
}
if (hits.length) {
  for (const h of hits) fail(`promessa proibida → ${h}`);
} else {
  ok(`${htmlFiles.length} páginas varridas; zero termo proibido`);
}

// ── Veredicto ────────────────────────────────────────────────────────
if (failures > 0) {
  console.error(`\nFALHOU: ${failures} violação(ões).`);
  process.exit(1);
}
console.log('\nOK: Contrato e Guardião verdes.');
