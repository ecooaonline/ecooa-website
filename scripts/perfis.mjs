// Gera as 31 páginas individuais de profissional em deploy/profissionais/<slug>/.
//
// Por que existem: quem procura saúde no Google procura por NOME ("natálie
// queiroz osteopata"), por profissão mais bairro ("nutricionista moinhos de
// vento") e por queixa mais cidade. Até aqui os 31 profissionais viviam apenas
// dentro de um modal em profissionais.html, invisível para busca. Cada perfil
// agora é uma página indexável, com conteúdo único de verdade: a conduta
// escrita pelo próprio profissional e os textos do almanaque, que dizem o que
// ele faz para cada queixa específica.
//
// Conteúdo por página, sem repetir boilerplate entre perfis:
//   1. identificação: nome, classe, registro, área, marca, retrato
//   2. como conduz o cuidado (campo conduta, texto próprio)
//   3. o que atende, queixa a queixa, com o texto preciso do almanaque
//   4. formato de atendimento
//   5. textos que assina no editorial
//   6. quem mais atende na mesma área, com link (malha interna)
//   7. JSON-LD Person + BreadcrumbList
//
// Roda DEPOIS de areas.mjs e artigos.mjs. Uso: node scripts/perfis.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { SINTOMAS, TEXTOS } from './almanaque.mjs';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const DOMINIO = 'https://www.somosecooa.com.br';
const WA = '5551991460909';
/* Endereco EXATAMENTE igual ao da home e da pagina de localizacao. Divergencia
   de NAP entre paginas do mesmo dominio derruba ranqueamento local, e o
   parecer de presença local achou justamente isso: uma segunda versao do
   endereco em 31 paginas. O bairro entra DENTRO do endereco postal, porque
   e o que o Google usa para parear com o Perfil da Empresa. */
const ENDERECO = {
  rua: 'Rua Mariante, 180, 9º andar',
  bairro: 'Moinhos de Vento',
  cidade: 'Porto Alegre',
  uf: 'RS',
  cep: '90430-180',
};

global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

const shell = fs.readFileSync(path.join(DEPLOY, 'profissionais.html'), 'utf8');

const esc = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* dimensões reais dos retratos, para não gerar CLS */
const dim = new Map();
async function dimensao(rel) {
  if (dim.has(rel)) return dim.get(rel);
  let r = null;
  try {
    const md = await sharp(path.join(DEPLOY, decodeURIComponent(rel))).metadata();
    r = { w: md.width, h: md.height };
  } catch {
    r = null;
  }
  dim.set(rel, r);
  return r;
}

const NOME_AREA = {};
ECOOA.especialidades.forEach((e) => {
  NOME_AREA[e.slug] = e.nome;
});

/* queixas que cada profissional atende, vindas do almanaque compartilhado.
   Uma entrada por bloco em que ele aparece, com o texto daquele bloco. */
function queixasDe(slug) {
  const r = [];
  for (const g of SINTOMAS) {
    const pos = (g.pros || []).indexOf(slug);
    if (pos < 0) continue;
    const texto = (TEXTOS[g.id] || {})[slug];
    if (!texto) continue;
    r.push({ rotulo: g.rotulo, area: g.area, texto });
  }
  return r;
}

/* termos de busca do bloco, para a lista de queixas atendidas em texto corrido:
   é o vocabulário real que a pessoa digita, sem virar amontoado de palavra-chave */
function exemplosDoBloco(rotulo) {
  const g = SINTOMAS.find((x) => x.rotulo === rotulo);
  if (!g) return [];
  return (g.termos || [])
    .filter((t) => t.length > 4 && !/^[a-z]{1,3}$/.test(t))
    .slice(0, 6);
}

function paginaPerfil(p) {
  const url = `${DOMINIO}/profissionais/${p.slug}/`;
  const registro = p.estado === 'a-adicionar' ? '' : p.registro;
  const queixas = queixasDe(p.slug);
  const artigos = ECOOA.artigos.filter((a) => a.autor === p.slug);
  const areas = (p.esp || []).map((s) => ({ slug: s, nome: NOME_AREA[s] || s })).filter((a) => a.nome);
  const colegas = ECOOA.profissionais
    .filter((o) => o.slug !== p.slug && (o.esp || []).some((s) => (p.esp || []).includes(s)))
    .slice(0, 6);
  const online = String(p.atendimento || '').includes('online');

  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(
    `Olá! Vim pelo site da ecooa, li o perfil de ${p.nome} e gostaria de agendar uma consulta de ${p.area}. Poderiam me orientar sobre os próximos passos?`
  )}`;

  const titulo = `${p.nome} · ${p.classe} em Porto Alegre · ecooa`;
  const meta = `${p.nome}, ${p.classe.toLowerCase()}${registro ? ` (${registro})` : ''} na ecooa, em ${ENDERECO.bairro}, ${ENDERECO.cidade}. ${String(p.bio || '').split(/(?<=\.)\s/)[0] || ''} Agende pelo WhatsApp.`.slice(0, 180);

  const condutaPars = String(p.conduta || '')
    .split(/\n\n+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const pessoaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.nome,
    jobTitle: p.classe,
    description: p.bio || undefined,
    image: `${DOMINIO}/${encodeURI(p.foto)}`,
    url,
    knowsAbout: [p.area, ...areas.map((a) => a.nome)],
    identifier: registro || undefined,
    worksFor: {
      '@type': 'MedicalClinic',
      name: 'ecooa',
      url: DOMINIO + '/',
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${ENDERECO.rua}, ${ENDERECO.bairro}`,
        addressLocality: ENDERECO.cidade,
        addressRegion: ENDERECO.uf,
        postalCode: ENDERECO.cep,
        addressCountry: 'BR',
      },
    },
  });

  const trilhaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: DOMINIO + '/' },
      { '@type': 'ListItem', position: 2, name: 'Profissionais', item: DOMINIO + '/profissionais' },
      { '@type': 'ListItem', position: 3, name: p.nome, item: url },
    ],
  });

  const corpo = `
  <section style="padding:clamp(112px,14vh,168px) clamp(20px,3.2vw,56px) clamp(40px,5vw,64px); background:var(--fundo);">
    <div style="max-width:1180px; margin:0 auto;">
      <nav aria-label="Trilha de navegação" style="font-size:12px; letter-spacing:.06em; color:var(--legenda);"><a href="profissionais.html" style="text-decoration:underline; text-underline-offset:3px;">profissionais</a> · ${esc(p.primeiro.toLowerCase())}</nav>
      <div style="margin-top:30px; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:clamp(28px,4vw,60px); align-items:start;">
        <div>
          <div style="display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--legenda);"><span style="width:20px; height:1px; background:var(--aluminio); display:block;"></span>${esc(p.marca || 'ecooa')}</div>
          <h1 style="margin:20px 0 0; max-width:16ch; font-family:var(--serif); font-weight:400; font-size:clamp(34px,4.6vw,64px); line-height:1.02; letter-spacing:-.024em; color:var(--tinta); text-wrap:pretty;">${esc(p.nome)}</h1>
          <p style="margin:16px 0 0; font-size:11px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--legenda);">${esc(p.classe)}${registro ? ' · ' + esc(registro) : ''}</p>
          <p style="margin:20px 0 0; max-width:52ch; font-size:17px; line-height:1.68; color:var(--muted);">${esc(p.bio || '')}</p>
          <p style="margin:18px 0 0; font-size:14px; line-height:1.6; color:var(--legenda);">Atende ${online ? 'presencialmente em ' + esc(ENDERECO.bairro) + ' e também no formato online' : 'presencialmente na ecooa, em ' + esc(ENDERECO.bairro) + ', ' + esc(ENDERECO.cidade)}.</p>
          <div style="margin-top:28px; display:flex; flex-wrap:wrap; gap:14px;">
            <a href="${wa}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; min-height:52px; padding:0 32px; border-radius:999px; background:var(--grafite); color:var(--fundo); font-size:11.5px; letter-spacing:.16em; box-shadow:5px 5px 12px rgba(150,147,140,.32);">agendar com ${esc(p.primeiro)}</a>
            ${areas.map((a) => `<a href="especialidades/${a.slug}/" style="display:inline-flex; align-items:center; min-height:52px; padding:0 26px; border-radius:999px; background:var(--nuvem); color:var(--grafite); font-size:11.5px; letter-spacing:.16em; box-shadow:var(--relevo-botao);">${esc(a.nome.toLowerCase())}</a>`).join('\n            ')}
          </div>
        </div>
        <div style="position:relative; overflow:hidden; background:var(--nevoa); aspect-ratio:3/4; max-width:420px; width:100%; justify-self:end;">
          <img data-dim="${esc(p.foto)}" src="${esc(p.foto)}" alt="Retrato de ${esc(p.nome)}, ${esc(p.classe.toLowerCase())} na ecooa" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; filter:var(--foto);" loading="eager" fetchpriority="high">
        </div>
      </div>
    </div>
  </section>
${
  condutaPars.length
    ? `
  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:820px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Como ${esc(p.primeiro)} conduz o cuidado</h2>
      ${condutaPars.map((t) => `<p style="margin:22px 0 0; font-size:16.5px; line-height:1.75; color:var(--muted);">${esc(t)}</p>`).join('\n      ')}
    </div>
  </section>`
    : ''
}
${
  queixas.length
    ? `
  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">O que ${esc(p.primeiro)} atende</h2>
      <p style="margin:14px 0 0; max-width:62ch; font-size:14.5px; line-height:1.66; color:var(--legenda);">A indicação depende de avaliação individual. Abaixo, as queixas em que ${esc(p.primeiro)} atua e o que faz em cada uma.</p>
      <div style="margin-top:30px; display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:1px; background:var(--stone); border-top:1px solid var(--stone); border-bottom:1px solid var(--stone);">
        ${queixas
          .map((q) => {
            const ex = exemplosDoBloco(q.rotulo);
            return `<div style="background:var(--nuvem); padding:clamp(24px,2.6vw,34px);"><h3 style="margin:0; font-family:var(--serif); font-weight:400; font-size:19px; line-height:1.2; color:var(--tinta);">${esc(q.rotulo.charAt(0).toUpperCase() + q.rotulo.slice(1))}</h3><p style="margin:12px 0 0; font-size:14.5px; line-height:1.66; color:var(--muted);">${esc(q.texto)}</p>${ex.length ? `<p style="margin:12px 0 0; font-size:12.5px; line-height:1.6; color:var(--legenda);">Também procurado como: ${esc(ex.join(', '))}.</p>` : ''}</div>`;
          })
          .join('\n        ')}
      </div>
    </div>
  </section>`
    : ''
}
${
  artigos.length
    ? `
  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Textos que ${esc(p.primeiro)} assina</h2>
      <div style="margin-top:26px; display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:12px;">
        ${artigos.map((a) => `<a href="blog/${a.slug}/" style="display:block; padding:24px 26px; background:var(--fundo); box-shadow:var(--relevo-carta);"><span style="display:block; font-family:var(--serif); font-size:19px; line-height:1.2; color:var(--tinta);">${esc(a.titulo)}</span><span style="display:block; margin-top:10px; font-size:13.5px; line-height:1.6; color:var(--muted);">${esc(a.resumo || '')}</span><span style="display:block; margin-top:12px; font-size:11.5px; letter-spacing:.14em; color:var(--grafite);">ler o texto →</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>`
    : ''
}
${
  colegas.length
    ? `
  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Quem mais atende ${esc(areas.map((a) => a.nome.toLowerCase()).join(' e '))}</h2>
      <div style="margin-top:26px; display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:12px;">
        ${colegas
          .map((o) => {
            const reg = o.estado === 'a-adicionar' ? '' : o.registro;
            return `<a href="profissionais/${o.slug}/" style="display:flex; gap:12px; align-items:center; padding:14px 16px; background:var(--nuvem); box-shadow:var(--relevo-carta);"><span style="flex:0 0 52px; width:52px; aspect-ratio:1; border-radius:50%; overflow:hidden; position:relative; background:var(--nevoa);"><img data-dim="${esc(o.foto)}" src="${esc(o.foto)}" alt="Retrato de ${esc(o.nome)}" loading="lazy" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; filter:var(--foto);"></span><span style="min-width:0;"><span style="display:block; font-family:var(--serif); font-size:16px; line-height:1.18; color:var(--tinta);">${esc(o.nome)}</span><span style="display:block; margin-top:4px; font-size:9.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--legenda);">${esc(o.classe)}${reg ? ' · ' + esc(reg) : ''}</span></span></a>`;
          })
          .join('\n        ')}
      </div>
    </div>
  </section>`
    : ''
}
  <section style="padding:clamp(56px,7vw,100px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:1180px; margin:0 auto; display:flex; flex-wrap:wrap; gap:28px; align-items:center; justify-content:space-between;">
      <h2 style="margin:0; flex:1 1 340px; max-width:22ch; font-family:var(--serif); font-weight:400; font-size:clamp(26px,3.2vw,44px); line-height:1.05; color:var(--tinta);">Agende com ${esc(p.primeiro)} pelo WhatsApp.</h2>
      <a href="${wa}" target="_blank" rel="noopener noreferrer" style="flex:0 0 auto; display:inline-flex; align-items:center; min-height:54px; padding:0 34px; border-radius:999px; background:var(--grafite); color:var(--fundo); font-size:11.5px; letter-spacing:.16em; box-shadow:5px 5px 12px rgba(150,147,140,.32);">falar com a recepção</a>
    </div>
  </section>
  <script type="application/ld+json">${pessoaJson}</script>
  <script type="application/ld+json">${trilhaJson}</script>`;

  let html = shell;
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/, `<title>${esc(titulo)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(meta)}"`
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${url}"`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${esc(titulo)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${esc(meta)}"`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"/,
    `<meta property="og:image" content="${DOMINIO}/${encodeURI(p.foto)}"`
  );
  /* Cinco profissionais ainda não têm número de registro (estado
     'a-adicionar'). Dar a eles página própria indexada, com schema Person e
     anúncio de atuação, aumenta a exposição de um risco que o tribunal ético
     apontou: anunciar atuação em saúde sem o registro visível é frágil perante
     os conselhos. Até o número chegar, a página existe e funciona para quem
     recebe o link, mas não entra no índice nem no sitemap. Reverte sozinho
     quando o registro for preenchido em deploy/dados-ecooa.js. */
  if (p.estado === 'a-adicionar') {
    html = html.replace(
      '<head>',
      '<head>\n<meta name="robots" content="noindex, follow">'
    );
  }
  html = html.replace('<head>', '<head>\n<base href="/">');

  const iniConteudo = html.indexOf('</header>') + '</header>'.length;
  const iniRodape = html.indexOf('<footer');
  if (iniRodape < 0) throw new Error('rodapé não encontrado no shell');
  html = html.slice(0, iniConteudo) + '\n' + corpo + '\n' + html.slice(iniRodape);
  return html;
}

let geradas = 0;
const semConduta = [];
const semQueixa = [];
for (const p of ECOOA.profissionais) {
  if (!String(p.conduta || '').trim()) semConduta.push(p.slug);
  if (!queixasDe(p.slug).length) semQueixa.push(p.slug);
  let html = paginaPerfil(p);
  const alvos = [...html.matchAll(/data-dim="([^"]+)"/g)].map((m) => m[1]);
  for (const rel of new Set(alvos)) {
    const d = await dimensao(rel);
    if (d) {
      html = html.replaceAll(`data-dim="${rel}" src="${rel}"`, `width="${d.w}" height="${d.h}" src="${rel}"`);
    } else {
      html = html.replaceAll(`data-dim="${rel}" `, '');
    }
  }
  const dir = path.join(DEPLOY, 'profissionais', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  geradas++;
}

/* a pasta profissionais/ passa a existir: o índice do diretório recebe cópia da
   listagem com <base>, para /profissionais continuar servindo a mesma página */
let indice = fs.readFileSync(path.join(DEPLOY, 'profissionais.html'), 'utf8');
indice = indice.replace('<head>', '<head>\n<base href="/">');
fs.writeFileSync(path.join(DEPLOY, 'profissionais', 'index.html'), indice, 'utf8');

console.log(
  `perfis gerados: ${geradas}, mais o índice de /profissionais/` +
    (semConduta.length ? `\n  sem conduta (página fica mais curta): ${semConduta.join(', ')}` : '') +
    (semQueixa.length ? `\n  sem queixa no almanaque: ${semQueixa.join(', ')}` : '')
);
