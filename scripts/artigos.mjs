// Gera as páginas reais dos artigos do editorial em deploy/blog/<slug>/.
//
// Decisão do dono em 2026-07-31: as matérias abrem em página própria, indexável,
// com os textos atuais. Cada página nasce do shell processado de deploy/blog.html
// e herda cabeçalho, menus, rodapé e scripts já religados.
//
// Roda DEPOIS de limpeza.mjs. Uso: node scripts/artigos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { CORPOS } from './corpos-artigos.mjs';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const DOMINIO = 'https://www.somosecooa.com.br';
const WA = '5551991460909';

global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

const shell = fs.readFileSync(path.join(DEPLOY, 'blog.html'), 'utf8');
const esc = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
function dataLonga(iso) {
  const p = String(iso).split('-');
  return `${Number(p[2])} de ${MESES[Number(p[1]) - 1]} de ${p[0]}`;
}

function autorDe(slug) {
  return ECOOA.profissionais.find((p) => p.slug === slug) || null;
}

function paginaArtigo(a) {
  const url = `${DOMINIO}/blog/${a.slug}/`;
  const au = autorDe(a.autor);
  const registro = au ? (au.estado === 'a-adicionar' ? '' : au.registro) : '';
  /* O corpo vive em scripts/corpos-artigos.mjs, que só existe em tempo de
     geração. Antes ele morava em deploy/dados-ecooa.js, arquivo carregado em
     TODA página do site: colocar 14 textos longos ali engordaria o site
     inteiro para servir o texto de uma página só. */
  const blocos = CORPOS[a.slug] || a.corpo || [];
  const corpoHtml = blocos
    .map(([tipo, texto]) => {
      if (tipo === 'h') {
        return `<h2 style="margin:40px 0 0; font-family:var(--serif); font-weight:400; font-size:clamp(22px,2.4vw,32px); line-height:1.16; color:var(--tinta);">${esc(texto)}</h2>`;
      }
      if (tipo === 'destaque') {
        return `<p style="margin:34px 0 6px; padding:22px 26px; background:var(--nuvem); border-left:2px solid var(--aluminio); font-family:var(--serif); font-size:clamp(19px,2vw,24px); line-height:1.42; color:var(--tinta);">${esc(texto)}</p>`;
      }
      return `<p style="margin:20px 0 0; font-size:16.5px; line-height:1.78; color:var(--muted);">${esc(texto)}</p>`;
    })
    .join('\n      ');

  const relacionados = ECOOA.artigos
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => (x.area === a.area ? -1 : 0) - (y.area === a.area ? -1 : 0))
    .slice(0, 3);

  const waArtigo = au
    ? `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Li o texto "${a.titulo}" no site da ecooa e gostaria de agendar uma consulta com ${au.nome}, que assina o texto. Poderiam me orientar sobre os próximos passos?`)}`
    : `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Li o texto "${a.titulo}" no site da ecooa e gostaria de uma avaliação sobre o tema. Qual profissional a equipe me indica?`)}`;

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.titulo,
    description: a.resumo,
    datePublished: a.data,
    inLanguage: 'pt-BR',
    mainEntityOfPage: url,
    author: au
      ? { '@type': 'Person', name: au.nome, jobTitle: au.classe }
      : { '@type': 'Organization', name: 'ecooa' },
    publisher: { '@type': 'Organization', name: 'ecooa', url: DOMINIO },
  });

  const corpo = `
  <article style="padding:clamp(112px,14vh,168px) clamp(20px,3.2vw,56px) clamp(56px,7vw,100px); background:var(--fundo);">
    <div style="max-width:760px; margin:0 auto;">
      <nav aria-label="Trilha de navegação" style="font-size:12px; letter-spacing:.06em; color:var(--legenda);"><a href="blog.html" style="text-decoration:underline; text-underline-offset:3px;">editorial</a> · ${esc(a.area)}</nav>
      <h1 style="margin:26px 0 0; font-family:var(--serif); font-weight:400; font-size:clamp(30px,4.4vw,54px); line-height:1.06; letter-spacing:-.02em; color:var(--tinta); text-wrap:pretty;">${esc(a.titulo)}</h1>
      <p style="margin:18px 0 0; font-size:17px; line-height:1.66; color:var(--muted);">${esc(a.resumo)}</p>
      <p style="margin:22px 0 0; padding-bottom:26px; border-bottom:1px solid var(--rule); font-size:13px; letter-spacing:.04em; color:var(--legenda);">${au ? 'por ' + esc(au.nome) + ' · ' + esc(au.classe) + (registro ? ' · ' + esc(registro) : '') + ' · ' : ''}${esc(dataLonga(a.data))}</p>
      ${corpoHtml}
      <p style="margin:36px 0 0; padding:20px 24px; background:var(--nuvem); box-shadow:var(--relevo-carta); font-size:13.5px; line-height:1.66; color:var(--legenda);">Este texto é informativo e não substitui consulta, diagnóstico nem tratamento. Converse com um profissional habilitado sobre o seu caso.</p>
    </div>
  </article>

  ${
    au
      ? `
  <section style="padding:clamp(40px,5vw,72px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:760px; margin:0 auto; display:flex; flex-wrap:wrap; gap:26px; align-items:center;">
      ${au.foto ? `<span style="flex:0 0 auto; width:104px; aspect-ratio:1; border-radius:999px; overflow:hidden; background:var(--nevoa); position:relative;"><img src="${esc(au.foto)}" alt="Retrato de ${esc(au.nome)}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top;" loading="lazy" width="104" height="104"></span>` : ''}
      <span style="flex:1 1 300px; min-width:0;">
        <span style="display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--legenda);">quem escreve</span>
        <span style="display:block; margin-top:8px; font-family:var(--serif); font-size:22px; color:var(--tinta);">${esc(au.nome)}</span>
        <span style="display:block; margin-top:6px; font-size:13px; color:var(--legenda);">${esc(au.classe)}${registro ? ' · ' + esc(registro) : ''} · ${esc(au.area)}</span>
      </span>
      <a href="${waArtigo}" target="_blank" rel="noopener noreferrer" style="flex:0 0 auto; display:inline-flex; align-items:center; min-height:50px; padding:0 30px; border-radius:999px; background:var(--grafite); color:var(--fundo); font-size:11.5px; letter-spacing:.16em; box-shadow:5px 5px 12px rgba(150,147,140,.32);">agendar com ${esc(au.primeiro)}</a>
    </div>
  </section>`
      : ''
  }

  <section style="padding:clamp(48px,6vw,80px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(22px,2.6vw,32px); color:var(--tinta);">Continue lendo</h2>
      <div style="margin-top:24px; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1px; background:var(--stone); border-top:1px solid var(--stone); border-bottom:1px solid var(--stone);">
        ${relacionados.map((r) => `<a href="blog/${r.slug}/" style="background:var(--nuvem); padding:clamp(24px,2.6vw,36px); display:block;"><span style="display:block; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:var(--legenda);">${esc(r.area)}</span><span style="display:block; margin-top:14px; font-family:var(--serif); font-size:20px; line-height:1.2; color:var(--tinta);">${esc(r.titulo)}</span><span style="display:block; margin-top:14px; font-size:12px; letter-spacing:.04em; color:var(--grafite);">leia mais →</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>
  <script type="application/ld+json">${jsonld}</script>`;

  let html = shell;
  const titulo = `${a.titulo} · editorial ecooa`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(titulo)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(a.resumo)}"`
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
    `<meta property="og:description" content="${esc(a.resumo)}"`
  );
  html = html.replace('<head>', '<head>\n<base href="/">');

  const iniConteudo = html.indexOf('</header>') + '</header>'.length;
  const iniRodape = html.indexOf('<footer');
  if (iniRodape < 0) throw new Error('rodapé não encontrado no shell do blog');
  html = html.slice(0, iniConteudo) + '\n' + corpo + '\n' + html.slice(iniRodape);
  return html;
}

let geradas = 0;
for (const a of ECOOA.artigos) {
  const dir = path.join(DEPLOY, 'blog', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), paginaArtigo(a), 'utf8');
  geradas++;
}

/* /blog passa a ser diretório: o índice recebe a listagem com <base> */
let indice = fs.readFileSync(path.join(DEPLOY, 'blog.html'), 'utf8');
indice = indice.replace('<head>', '<head>\n<base href="/">');
fs.writeFileSync(path.join(DEPLOY, 'blog', 'index.html'), indice, 'utf8');

console.log(`páginas de artigo geradas: ${geradas}, mais o índice de /blog/`);
