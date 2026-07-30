#!/usr/bin/env node
// Gate do output publicado. Roda contra dist/, que e o que o visitante recebe.
//
// Reescrito no P05 (auditoria Mythos). A versao anterior validava o contrato do
// projeto Astro: piso de 95 URLs no sitemap, rotas /quem-somos/ e /match/,
// arquivo sitemap-0.xml. Nada disso existe no site publicado, que e o 3.0
// estatico servido de deploy/. Era um gate medindo outro site, ou seja: passava
// ou falhava por motivo errado.
//
// Alem do contrato de paginas, cada bloco abaixo trava uma regressao que a
// auditoria encontrou de verdade. Nenhum deles e decorativo.
//
// Falha com exit 1.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
let falhas = 0;
const erro = (m) => {
  console.error(`  x  ${m}`);
  falhas++;
};
const ok = (m) => console.log(`  ok ${m}`);

if (!existsSync(DIST)) {
  console.error('dist/ nao existe. Rode npm run build antes.');
  process.exit(1);
}

const paginas = readdirSync(DIST).filter((f) => f.endsWith('.html') && !f.endsWith('.dc.html'));
const html = new Map(paginas.map((f) => [f, readFileSync(join(DIST, f), 'utf8')]));

/* ── 1. contrato de paginas ────────────────────────────────────────── */
const ROTAS = [
  '/',
  '/sobre',
  '/especialidades',
  '/profissionais',
  '/qual-profissional-procurar',
  '/blog',
  '/localizacao',
  '/mentorias',
  '/sublocacao',
];
const FORA_DO_SITEMAP = ['/404', '/politicas'];

console.log('Contrato de paginas:');
if (paginas.length < 11) erro(`so ${paginas.length} paginas em dist/, esperado ao menos 11`);
else ok(`${paginas.length} paginas publicadas`);

if (!existsSync(join(DIST, 'sitemap.xml'))) {
  erro('sitemap.xml ausente');
} else {
  const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(/^https?:\/\/[^/]+/, '') || '/'
  );
  for (const r of ROTAS) if (!locs.includes(r)) erro(`rota estrategica fora do sitemap: ${r}`);
  for (const u of FORA_DO_SITEMAP) {
    if (locs.some((l) => l.startsWith(u))) erro(`pagina noindex dentro do sitemap: ${u}`);
  }
  if (locs.length < ROTAS.length) {
    erro(`sitemap com ${locs.length} URLs, abaixo das ${ROTAS.length} rotas estrategicas`);
  } else {
    ok(`${locs.length} URLs no sitemap, todas as rotas estrategicas presentes`);
  }
}

for (const obrigatorio of ['CNAME', 'robots.txt', 'dados-ecooa.js', '_headers']) {
  if (!existsSync(join(DIST, obrigatorio))) erro(`${obrigatorio} ausente do output`);
}

/* ── 2. o runtime removido no P06 nao pode voltar ──────────────────── */
console.log('Runtime:');
{
  const sujas = [];
  for (const [f, s] of html) {
    if (/support\.js|babel-standalone|react-dom-\d/.test(s)) sujas.push(f);
    if (/<x-dc[\s>]/.test(s)) sujas.push(`${f} (x-dc)`);
  }
  if (sujas.length) erro(`runtime de volta em: ${sujas.slice(0, 4).join(', ')}`);
  else ok('nenhuma pagina carrega support.js, Babel, React ou ReactDOM');
  if (existsSync(join(DIST, 'assets/vendor'))) erro('assets/vendor voltou ao output');
}

/* ── 3. conversao: perder lead calado e o pecado capital ───────────── */
console.log('Conversao:');
{
  const comForm = [...html].filter(([, s]) => s.includes('id="ec-news"'));
  const semHandler = comForm.filter(([, s]) => !/addEventListener\('submit'/.test(s));
  if (comForm.length < 11) erro(`formulario do rodape em ${comForm.length} paginas, esperado 11`);
  if (semHandler.length) {
    erro(`rodape sem handler de envio em: ${semHandler.map(([f]) => f).join(', ')}`);
  } else {
    ok(`newsletter do rodape com handler de envio nas ${comForm.length} paginas`);
  }

  for (const [pg, campo] of [
    ['mentorias.html', 'ec-nome'],
    ['sublocacao.html', 'sb-nome'],
  ]) {
    const s = html.get(pg) || '';
    if (!s.includes(`id="${campo}"`)) erro(`${pg}: formulario de lead desapareceu`);
    else if (!/addEventListener\('submit'/.test(s)) erro(`${pg}: formulario de lead sem handler`);
    else if (!s.includes('wa.me/5551991460909')) erro(`${pg}: destino do WhatsApp ausente`);
    else ok(`${pg}: formulario de lead envia para o WhatsApp`);
  }

  for (const [pg, minimo] of [
    ['profissionais.html', 7],
    ['blog.html', 8],
  ]) {
    const s = html.get(pg) || '';
    const n = (s.match(/data-filtro="/g) || []).length;
    if (n < minimo) erro(`${pg}: ${n} botoes de filtro religados, esperado ${minimo}`);
    else ok(`${pg}: ${n} filtros religados`);
  }
}

/* ── 4. o desenho responsivo do autor ──────────────────────────────── */
console.log('Responsividade:');
{
  const semMenu = [...html].filter(([, s]) => !s.includes('id="mob-btn"'));
  if (semMenu.length) erro(`sem menu de celular em: ${semMenu.map(([f]) => f).join(', ')}`);
  else ok(`menu de celular presente nas ${html.size} paginas`);
  const home = html.get('index.html') || '';
  if (!home.includes('data-mosaico')) erro('mosaico da home sem as colunas responsivas');
  if (!home.includes('data-toque')) erro('instrucao de toque ausente na home');
  if (home.includes('data-mosaico') && home.includes('data-toque')) {
    ok('mosaico responsivo e instrucao de toque na home');
  }
}

/* ── 5. higiene que o Lighthouse cobra e que ja foi resolvida ──────── */
console.log('Higiene tecnica:');
{
  let charsetTarde = 0;
  for (const [f, s] of html) {
    const head = s.slice(s.indexOf('<head'), s.indexOf('</head>'));
    if (head.indexOf('charset') > 1024) {
      erro(`${f}: <meta charset> depois do byte 1024 do head`);
      charsetTarde++;
    }
  }
  if (!charsetTarde) ok('charset dentro dos primeiros 1024 bytes em todas');

  let semDim = 0;
  for (const [, s] of html) {
    for (const tag of s.match(/<img\b[^>]*>/g) || []) {
      if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) semDim++;
    }
  }
  if (semDim) erro(`${semDim} tags de imagem sem width e height`);
  else ok('toda imagem com width e height');

  let canonicalRuim = 0;
  for (const [f, s] of html) {
    const cs = s.match(/<link rel="canonical" href="[^"]*"/g) || [];
    if (cs.length !== 1) {
      erro(`${f}: ${cs.length} canonicals`);
      canonicalRuim++;
    } else if (!cs[0].includes('https://www.somosecooa.com.br')) {
      erro(`${f}: canonical fora do dominio canonico`);
      canonicalRuim++;
    }
  }
  if (!canonicalRuim) ok('um canonical por pagina, no dominio canonico');
}

/* ── 6. publicidade em saude ───────────────────────────────────────── */
console.log('Guardiao regulatorio:');
{
  const PROIBIDOS = [
    /resultados?\s+garantidos?/i,
    /cura\s+garantida/i,
    /satisfa[cç][aã]o\s+garantida/i,
    /100\s*%\s*(de\s+)?(sucesso|eficaz|efic[aá]cia|seguro|garantido)/i,
    /vagas?\s+limitadas?/i,
    /[uú]ltimas?\s+vagas?/i,
    /sem\s+nenhum\s+risco/i,
    /melhor\s+cl[ií]nica/i,
    /milagros[oa]/i,
  ];
  const achados = [];
  for (const [f, s] of html) {
    const texto = s
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    for (const re of PROIBIDOS) {
      const m = texto.match(re);
      if (m) achados.push(`${f}: "${m[0]}"`);
    }
  }
  if (achados.length) achados.forEach((a) => erro(`promessa proibida -> ${a}`));
  else ok(`${html.size} paginas varridas, zero promessa absoluta`);

  /* a ressalva do registro nunca pode ser omitida */
  const dados = readFileSync(join(DIST, 'dados-ecooa.js'), 'utf8');
  const estados = [...dados.matchAll(/estado:'([a-z-]+)'/g)].map((m) => m[1]);
  const validos = ['confirmado', 'a-confirmar', 'a-adicionar'];
  const invalidos = [...new Set(estados.filter((e) => !validos.includes(e)))];
  if (invalidos.length) erro(`estado de registro invalido: ${invalidos.join(', ')}`);
  else ok(`${estados.length} registros, todos com estado valido`);

  const home = html.get('index.html') || '';
  if (estados.includes('a-confirmar') && !home.includes('a confirmar')) {
    erro('ha registro a confirmar, mas o modal nao exibe a ressalva');
  }
  if (estados.includes('a-adicionar') && !home.includes('registro a adicionar')) {
    erro('ha registro a adicionar, mas o modal nao exibe a ressalva');
  }
  const contagem = validos.map((v) => `${estados.filter((e) => e === v).length} ${v}`).join(', ');
  ok(`ressalva de registro no modal (${contagem})`);
}

console.log('');
if (falhas) {
  console.error(`FALHOU: ${falhas} violacao(oes).`);
  process.exit(1);
}
console.log('output validado, nenhuma violacao.');
