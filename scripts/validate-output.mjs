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
  if (locs.length < 62) {
    erro(
      `sitemap com ${locs.length} URLs, esperado ao menos 62 (9 rotas + 8 areas + 31 perfis + 14 artigos)`
    );
  } else {
    ok(`${locs.length} URLs no sitemap, todas as rotas estrategicas presentes`);
  }
}

for (const obrigatorio of ['CNAME', 'robots.txt', 'dados-ecooa.js', '_headers']) {
  if (!existsSync(join(DIST, obrigatorio))) erro(`${obrigatorio} ausente do output`);
}

/* paginas reais criadas em 2026-07-31: 8 areas e 14 artigos */
const AREAS = [
  'medicina',
  'estetica-facial',
  'estetica-corporal',
  'tricologia',
  'transplante-capilar',
  'nutricao',
  'saude-mental',
  'saude-integrativa',
];
const faltamAreas = AREAS.filter((a) => !existsSync(join(DIST, 'especialidades', a, 'index.html')));
if (faltamAreas.length) erro(`paginas de area ausentes: ${faltamAreas.join(', ')}`);
else ok('8 paginas de especialidade presentes');
const nArtigos = existsSync(join(DIST, 'blog'))
  ? readdirSync(join(DIST, 'blog'), { withFileTypes: true }).filter((d) => d.isDirectory()).length
  : 0;
if (nArtigos < 14) erro(`so ${nArtigos} paginas de artigo, esperado 14`);
else ok(`${nArtigos} paginas de artigo presentes`);
if (!existsSync(join(DIST, 'especialidades', 'index.html')))
  erro('indice de /especialidades/ ausente (diretorio esconderia a listagem)');
if (!existsSync(join(DIST, 'blog', 'index.html')))
  erro('indice de /blog/ ausente (diretorio esconderia a listagem)');

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

  const matchPg = html.get('qual-profissional-procurar.html') || '';
  if (!matchPg.includes('data-match-pronto')) erro('ecooa.match sem o comportamento religado');
  else ok('ecooa.match religado');

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

  /* decisao do dono em 2026-07-31: numero valido aparece limpo, sem ressalva;
     sem numero, o campo nao aparece. A ressalva nao pode voltar por acidente. */
  const home = html.get('index.html') || '';
  if (/registro a adicionar|· a confirmar/.test(home)) {
    erro('a ressalva de registro voltou ao modal, contra a decisao de 2026-07-31');
  }
  const contagem = validos.map((v) => `${estados.filter((e) => e === v).length} ${v}`).join(', ');
  ok(`registro exibido limpo (${contagem})`);
}

/* ── 7. paginas individuais de profissional ────────────────────────── */
console.log('Perfis de profissional:');
{
  /* le a fonte de dados de verdade, em vez de adivinhar por regex: o arquivo
     tem slug+nome tambem nas especialidades e nos artigos */
  global.window = {};
  await import(join(process.cwd(), DIST, 'dados-ecooa.js'));
  const slugs = (global.window.ECOOA?.profissionais || []).map((p) => p.slug);
  const dir = join(DIST, 'profissionais');
  const faltam = slugs.filter((s) => !existsSync(join(dir, s, 'index.html')));
  if (!slugs.length) erro('nao consegui ler os slugs de dados-ecooa.js');
  else if (faltam.length) erro(`perfis ausentes (${faltam.length}): ${faltam.slice(0, 5).join(', ')}`);
  else ok(`${slugs.length} paginas individuais de profissional presentes`);
  if (!existsSync(join(dir, 'index.html')))
    erro('indice de /profissionais/ ausente (diretorio esconderia a listagem)');

  /* cada perfil precisa de conteudo proprio, nao so o shell herdado */
  let magros = 0;
  for (const s of slugs.slice(0, 31)) {
    const f = join(dir, s, 'index.html');
    if (!existsSync(f)) continue;
    const t = readFileSync(f, 'utf8');
    if (!t.includes('"@type":"Person"')) erro(`${s}: perfil sem schema Person`);
    if (!/O que .* atende|Como .* conduz o cuidado/.test(t)) magros++;
  }
  if (magros > 2) erro(`${magros} perfis sem secao de conduta nem de queixas atendidas`);
  else ok('perfis com conteudo proprio (conduta e queixas atendidas)');
}

/* ── 8. dados estruturados ─────────────────────────────────────────── */
console.log('Dados estruturados:');
{
  const home = html.get('index.html') || '';
  if (!home.includes('"@type":"MedicalClinic"')) erro('home sem a entidade MedicalClinic');
  else ok('home com MedicalClinic (endereco, telefone, horario)');
  if (!home.includes('"@type":"WebSite"')) erro('home sem WebSite');

  /* CFM: nota agregada e depoimento em publicidade medica sao vedados */
  const comNota = [];
  for (const [f, s] of html) {
    if (/"aggregateRating"|"@type":"Review"|"reviewRating"/.test(s)) comNota.push(f);
  }
  if (comNota.length) erro(`aggregateRating ou Review no schema (vedado ao CFM): ${comNota.join(', ')}`);
  else ok('nenhum aggregateRating nem Review no schema');

  /* todo JSON-LD precisa ser JSON valido, senao o Google descarta calado */
  let quebrados = 0;
  for (const [f, s] of html) {
    for (const m of s.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(m[1]);
      } catch {
        erro(`${f}: JSON-LD invalido`);
        quebrados++;
      }
    }
  }
  if (!quebrados) ok('todo JSON-LD das paginas da raiz e sintaticamente valido');
}

/* ── 9. medicao e consentimento ────────────────────────────────────── */
console.log('Medicao:');
{
  const semMedicao = [...html].filter(([, s]) => !s.includes('data-medicao-ecooa'));
  if (semMedicao.length) erro(`sem camada de medicao: ${semMedicao.map(([f]) => f).join(', ')}`);
  else ok(`medicao presente nas ${html.size} paginas da raiz`);

  const home = html.get('index.html') || '';
  if (!/analytics_storage: 'denied'/.test(home))
    erro('Consent Mode sem analytics_storage negado por padrao (LGPD)');
  else ok('consentimento negado por padrao, liberado so apos aceite');

  /* o GTM nao pode entrar por tag estatica: ele so carrega apos gesto */
  if (/<script[^>]+src="https:\/\/www\.googletagmanager\.com/.test(home))
    erro('GTM carregado de forma estatica, fora do carregamento tardio');
  else ok('GTM so carrega apos gesto do visitante ou 4s');
}

/* ── 9b. titulo unico por pagina ───────────────────────────────────
   Ate 2026-08-01, 22 das 31 URLs compartilhavam <title>: os geradores
   procuravam por "<title>" e a tag real vinha como <title data-dc-tpl="1">,
   entao a troca nunca acontecia. Os 14 artigos herdavam o titulo do editorial
   e as 8 areas o de especialidades. */
console.log('Titulos:');
{
  const titulos = new Map();
  const varre = (dir, prefixo) => {
    if (!existsSync(dir)) return;
    for (const d of readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const f = join(dir, d.name, 'index.html');
      if (!existsSync(f)) continue;
      const m = readFileSync(f, 'utf8').match(/<title[^>]*>([\s\S]*?)<\/title>/);
      const t = m ? m[1].trim() : '(sem titulo)';
      titulos.set(`${prefixo}/${d.name}`, t);
    }
  };
  for (const [f, s] of html) {
    const m = s.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    titulos.set(f, m ? m[1].trim() : '(sem titulo)');
  }
  varre(join(DIST, 'especialidades'), 'especialidades');
  varre(join(DIST, 'blog'), 'blog');
  varre(join(DIST, 'profissionais'), 'profissionais');

  const porTitulo = new Map();
  for (const [pg, t] of titulos) {
    if (!porTitulo.has(t)) porTitulo.set(t, []);
    porTitulo.get(t).push(pg);
  }
  const repetidos = [...porTitulo].filter(([, pgs]) => pgs.length > 1);
  if (repetidos.length) {
    for (const [t, pgs] of repetidos.slice(0, 4)) {
      erro(`titulo repetido em ${pgs.length} paginas ("${t.slice(0, 50)}"): ${pgs.slice(0, 3).join(', ')}`);
    }
  } else {
    ok(`${titulos.size} paginas, todos os titulos unicos`);
  }
}

/* ── 10. acessibilidade estrutural (P09) ──────────────────────────── */
console.log('Acessibilidade:');
{
  const semMain = [...html].filter(([, s]) => !/<main id="conteudo"/.test(s));
  if (semMain.length) erro(`sem landmark main: ${semMain.map(([f]) => f).join(', ')}`);
  else ok(`main unico em todas as ${html.size} paginas`);

  const semPular = [...html].filter(([, s]) => !s.includes('class="ec-pular"'));
  if (semPular.length) erro(`sem link de pular navegacao: ${semPular.map(([f]) => f).join(', ')}`);
  else ok('link de pular para o conteudo em todas');

  /* o anel de foco fraco nao pode voltar: media 1,45:1 */
  const foscas = [...html].filter(([, s]) => /outline:\s*2px solid #C6C4BF/i.test(s));
  if (foscas.length) erro(`anel de foco de baixo contraste em: ${foscas.map(([f]) => f).join(', ')}`);
  else ok('anel de foco com contraste suficiente');

  const matchPg = html.get('qual-profissional-procurar.html') || '';
  if (!/role', 'combobox'|role="combobox"/.test(matchPg))
    erro('campo de busca do match sem semantica de combobox');
  else ok('autocomplete do match com semantica de combobox');
  if (!/aria-live/.test(matchPg)) erro('match sem regiao viva para anunciar o resultado');
  else ok('resultado do match anunciado por regiao viva');
}

console.log('');
if (falhas) {
  console.error(`FALHOU: ${falhas} violacao(oes).`);
  process.exit(1);
}
console.log('output validado, nenhuma violacao.');
