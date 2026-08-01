// Gera as 8 páginas reais de especialidade em deploy/especialidades/<slug>/.
//
// Decisão do dono em 2026-07-31: páginas indexáveis por área, com estrutura
// completa (hero tipográfico, queixas, serviços, profissionais da área com o
// modal de perfil, FAQ com schema FAQPage e CTA de WhatsApp contextual).
//
// Cada página nasce do shell já processado de deploy/especialidades.html, o que
// herda cabeçalho, submenus, menu do celular, rodapé e todos os scripts já
// religados. O modal de perfil é extraído de deploy/profissionais.html.
//
// Roda DEPOIS de limpeza.mjs. Uso: node scripts/areas.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { AREAS, DESTAQUES } from './conteudo-areas.mjs';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const DOMINIO = 'https://www.somosecooa.com.br';
const WA = '5551991460909';

/* dados reais */
global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

/* shell: especialidades.html já processado */
const shell = fs.readFileSync(path.join(DEPLOY, 'especialidades.html'), 'utf8');

/* modal de perfil: extraído da página de profissionais já processada */
const profHtml = fs.readFileSync(path.join(DEPLOY, 'profissionais.html'), 'utf8');
function extrai(re, rotulo) {
  const m = profHtml.match(re);
  if (!m) throw new Error('não achei no shell: ' + rotulo);
  return m[0];
}
const MODAL_CSS = extrai(
  /<style>[^<]*\/\* Mosaico de profissionais[\s\S]*?<\/style>/,
  'css do modal'
);
const MODAL_HTML = extrai(/<div class="pf-ov"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, 'html do modal');
const MODAL_JS = extrai(
  /<script>\s*\/\* Modal de perfil do profissional[\s\S]*?<\/script>/,
  'js do modal'
);

const esc = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* dimensões reais dos retratos */
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

function ordenaPorDestaque(lista, slugArea) {
  const primeiro = DESTAQUES[slugArea];
  return [...lista].sort((a, b) => (a.slug === primeiro ? -1 : b.slug === primeiro ? 1 : 0));
}

/* artes por área: linha fina, uma por tema, herdadas da linguagem das bandeiras */
const ARTES = {
  medicina: "<path d='M10 40 H24 L30 20 L38 52 L44 34 H70' />",
  'estetica-facial': "<circle cx='40' cy='30' r='18'/><path d='M28 26 Q 40 36 52 26'/>",
  'estetica-corporal': "<path d='M40 8 C 26 22 26 38 40 52 C 54 38 54 22 40 8 Z'/>",
  tricologia: "<path d='M24 52 Q 24 20 40 12 M34 52 Q 34 26 46 16 M44 52 Q 44 30 54 22'/>",
  'transplante-capilar': "<path d='M20 46 V30 M30 46 V24 M40 46 V28 M50 46 V22 M14 52 H58'/>",
  nutricao:
    "<path d='M40 52 C 22 44 20 26 34 20 C 40 18 40 24 40 26 C 40 24 42 16 50 18 C 62 22 56 44 40 52 Z M40 20 Q 44 10 52 8'/>",
  'saude-mental': "<circle cx='40' cy='28' r='16'/><path d='M40 44 V52 M32 50 H48'/>",
  'saude-integrativa': "<circle cx='32' cy='30' r='14'/><circle cx='48' cy='30' r='14'/>",
};

/* O card leva à página individual do profissional, não ao modal: a partir de
   2026-08-01 cada profissional tem página própria, com conduta e queixas
   atendidas. Além de ser mais informativo para o visitante, é o que dá ao
   Google um caminho de rastreio para os 31 perfis. */
function cardProfissional(p, area) {
  const registro = p.estado === 'a-adicionar' ? '' : p.registro;
  const convite = `${p.primeiro} atua com ${p.area}. ${String(p.bio || '').split(/(?<=\.)\s/)[0] || ''}`;
  return `
      <a href="profissionais/${p.slug}/" aria-label="Ver o perfil de ${esc(p.nome)}" style="text-align:left; background:var(--nuvem); padding:0; display:flex; flex-direction:column; box-shadow:0 0 0 1px var(--stone);">
        <span style="display:block; position:relative; overflow:hidden; background:var(--nevoa); aspect-ratio:2/3; width:100%;">
          <span style="position:absolute; top:10px; right:12px; z-index:2; font-size:8.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.85); background:rgba(43,41,38,.34); padding:4px 8px; border-radius:999px; backdrop-filter:blur(3px);">${esc(p.marca)}</span>
          <img data-dim="${esc(p.foto)}" src="${esc(p.foto)}" alt="Retrato de ${esc(p.nome)}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; filter:var(--foto);" loading="lazy">
        </span>
        <span style="display:block; padding:20px 22px 26px;">
          <span style="display:block; font-family:var(--serif); font-size:20px; line-height:1.14; color:var(--tinta);">${esc(p.nome)}</span>
          <span style="display:block; margin-top:7px; font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--legenda);">${esc(p.classe)}${registro ? ' · ' + esc(registro) : ''}</span>
          <span style="display:block; margin-top:10px; font-size:13.5px; line-height:1.6; color:var(--muted);">${esc(convite)}</span>
          <span style="display:block; margin-top:12px; font-size:11.5px; letter-spacing:.14em; color:var(--grafite);">ver perfil e agendar →</span>
        </span>
      </a>`;
  void area;
}

function paginaArea(a) {
  const url = `${DOMINIO}/especialidades/${a.slug}/`;
  const pros = ordenaPorDestaque(
    ECOOA.profissionais.filter((p) => (p.esp || []).includes(a.slug)),
    a.slug
  );
  const waArea = `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação em ${a.nome.toLowerCase()}. Qual profissional a equipe me indica para o meu caso?`)}`;

  const faqJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map(([q, r]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: r },
    })),
  });

  const corpo = `
  <section style="padding:clamp(112px,14vh,168px) clamp(20px,3.2vw,56px) clamp(40px,5vw,64px); background:var(--fundo); position:relative; overflow:hidden;">
    <svg viewBox="0 0 80 60" aria-hidden="true" style="position:absolute; right:clamp(12px,6vw,120px); top:clamp(96px,12vh,150px); width:clamp(120px,16vw,230px); opacity:.2;"><g fill="none" stroke="#A5A39D" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ARTES[a.slug] || ''}</g></svg>
    <div style="max-width:1180px; margin:0 auto; position:relative;">
      <nav aria-label="Trilha de navegação" style="font-size:12px; letter-spacing:.06em; color:var(--legenda);"><a href="especialidades.html" style="text-decoration:underline; text-underline-offset:3px;">especialidades</a> · ${esc(a.nome.toLowerCase())}</nav>
      <div style="margin-top:24px; display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--legenda);"><span style="width:20px; height:1px; background:var(--aluminio); display:block;"></span>${esc(a.marca)}</div>
      <h1 style="margin:24px 0 0; max-width:17ch; font-family:var(--serif); font-weight:400; font-size:clamp(34px,5vw,72px); line-height:1; letter-spacing:-.024em; color:var(--tinta); text-wrap:pretty;">${esc(a.titulo)}</h1>
      <p style="margin:24px 0 0; max-width:58ch; font-size:17px; line-height:1.68; color:var(--muted);">${esc(a.sub)}</p>
      <div style="margin-top:30px; display:flex; flex-wrap:wrap; gap:14px;">
        <a href="${waArea}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; min-height:52px; padding:0 32px; border-radius:999px; background:var(--grafite); color:var(--fundo); font-size:11.5px; letter-spacing:.16em; box-shadow:5px 5px 12px rgba(150,147,140,.32);">agendar avaliação</a>
        <a href="#profissionais" style="display:inline-flex; align-items:center; min-height:52px; padding:0 32px; border-radius:999px; background:var(--nuvem); color:var(--grafite); font-size:11.5px; letter-spacing:.16em; box-shadow:var(--relevo-botao);">quem atende nesta área</a>
      </div>
    </div>
  </section>

${
    (a.intro || []).length
      ? `
  <section style="padding:clamp(40px,5vw,72px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:760px; margin:0 auto;">
      ${a.intro.map((t) => `<p style="margin:0 0 20px; font-size:17px; line-height:1.76; color:var(--muted);">${esc(t)}</p>`).join('\n      ')}
    </div>
  </section>`
      : ''
  }

  <section style="padding:clamp(40px,5vw,72px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Para quem é esta área</h2>
      <ul style="margin:26px 0 0; padding:0; list-style:none; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px;">
        ${a.queixas.map((q) => `<li style="padding:18px 22px; background:var(--fundo); box-shadow:var(--relevo-carta); font-size:15px; line-height:1.6; color:var(--tinta);">${esc(q)}</li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Serviços e procedimentos</h2>
      <p style="margin:14px 0 0; max-width:60ch; font-size:14.5px; line-height:1.66; color:var(--legenda);">A indicação de cada serviço depende de avaliação individual, e o profissional explica o que faz sentido para o seu caso.</p>
      <div style="margin-top:30px; display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1px; background:var(--stone); border-top:1px solid var(--stone); border-bottom:1px solid var(--stone);">
        ${a.servicos.map(([t, d]) => `<div style="background:var(--nuvem); padding:clamp(24px,2.6vw,38px);"><h3 style="margin:0; font-family:var(--serif); font-weight:400; font-size:20px; line-height:1.2; color:var(--tinta);">${esc(t)}</h3><p style="margin:12px 0 0; font-size:14.5px; line-height:1.64; color:var(--muted);">${esc(d)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

${
    (a.comoFunciona || []).length
      ? `
  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Como funciona, do primeiro contato ao acompanhamento</h2>
      <ol style="margin:30px 0 0; padding:0; list-style:none; display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px; counter-reset:etapa;">
        ${a.comoFunciona
          .map(
            ([t, d], i) =>
              `<li style="padding:26px 28px; background:var(--fundo); box-shadow:var(--relevo-carta);"><span style="display:block; font-family:var(--serif); font-size:13px; color:var(--legenda);">0${i + 1}</span><h3 style="margin:12px 0 0; font-family:var(--serif); font-weight:400; font-size:19px; line-height:1.2; color:var(--tinta);">${esc(t)}</h3><p style="margin:10px 0 0; font-size:14.5px; line-height:1.66; color:var(--muted);">${esc(d)}</p></li>`
          )
          .join('\n        ')}
      </ol>
    </div>
  </section>`
      : ''
  }

  <section id="profissionais" style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:1180px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Quem atende em ${esc(a.nome.toLowerCase())}</h2>
      <p style="margin:14px 0 0; max-width:60ch; font-size:14.5px; line-height:1.66; color:var(--legenda);">Cada profissional é autônomo e responde tecnicamente pelo próprio trabalho. Toque em um perfil para conhecer e agendar.</p>
      <div style="margin-top:30px; display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:1px; background:var(--nuvem);">
        ${pros.map((p) => cardProfissional(p, a)).join('\n')}
      </div>
    </div>
  </section>

  <section style="padding:clamp(48px,6vw,88px) clamp(20px,3.2vw,56px); background:var(--fundo);">
    <div style="max-width:900px; margin:0 auto;">
      <h2 style="margin:0; font-family:var(--serif); font-weight:400; font-size:clamp(24px,2.8vw,38px); line-height:1.08; color:var(--tinta);">Perguntas frequentes</h2>
      <div style="margin-top:26px; display:grid; gap:1px; background:var(--stone); border-top:1px solid var(--stone); border-bottom:1px solid var(--stone);">
        ${a.faq.map(([q, r]) => `<details style="background:var(--nuvem);"><summary style="cursor:pointer; padding:20px clamp(18px,2.4vw,30px); font-size:15.5px; line-height:1.5; color:var(--tinta); list-style-position:inside;">${esc(q)}</summary><p style="margin:0; padding:0 clamp(18px,2.4vw,30px) 22px; max-width:66ch; font-size:14.5px; line-height:1.7; color:var(--muted);">${esc(r)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section style="padding:clamp(56px,7vw,100px) clamp(20px,3.2vw,56px); background:var(--nuvem);">
    <div style="max-width:1180px; margin:0 auto; display:flex; flex-wrap:wrap; gap:28px; align-items:center; justify-content:space-between;">
      <h2 style="margin:0; flex:1 1 340px; max-width:20ch; font-family:var(--serif); font-weight:400; font-size:clamp(26px,3.2vw,44px); line-height:1.05; color:var(--tinta);">Um passo de cada vez. O primeiro é uma conversa.</h2>
      <a href="${waArea}" target="_blank" rel="noopener noreferrer" style="flex:0 0 auto; display:inline-flex; align-items:center; min-height:54px; padding:0 34px; border-radius:999px; background:var(--grafite); color:var(--fundo); font-size:11.5px; letter-spacing:.16em; box-shadow:5px 5px 12px rgba(150,147,140,.32);">agendar pelo WhatsApp</a>
    </div>
  </section>
  <script type="application/ld+json">${faqJson}</script>`;

  /* monta a partir do shell */
  let html = shell;
  const titulo = `${a.nome} em Porto Alegre · ecooa`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(titulo)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(a.meta)}"`
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
    `<meta property="og:description" content="${esc(a.meta)}"`
  );

  /* base: a página vive dois níveis abaixo, os caminhos do shell são relativos */
  html = html.replace('<head>', '<head>\n<base href="/">');

  /* troca o conteúdo entre o fim do header e o rodapé */
  const iniConteudo = html.indexOf('</header>') + '</header>'.length;
  const iniRodape = html.indexOf('<footer');
  if (iniRodape < 0) throw new Error('rodapé não encontrado no shell');
  html = html.slice(0, iniConteudo) + '\n' + corpo + '\n' + html.slice(iniRodape);

  /* O modal de perfil saiu destas páginas em 2026-08-01: os cards agora levam
     à página individual do profissional, então o modal era código morto
     pesando em oito páginas. Ele segue em profissionais.html, onde é a
     interação principal. */
  void MODAL_CSS;
  void MODAL_HTML;
  void MODAL_JS;
  return html;
}

let geradas = 0;
for (const a of AREAS) {
  let html = paginaArea(a);
  /* dimensões reais nas imagens novas */
  const alvos = [...html.matchAll(/data-dim="([^"]+)"/g)].map((m) => m[1]);
  for (const rel of new Set(alvos)) {
    const d = await dimensao(rel);
    if (d) {
      html = html.replaceAll(
        `data-dim="${rel}" src="${rel}"`,
        `width="${d.w}" height="${d.h}" src="${rel}"`
      );
    } else {
      html = html.replaceAll(`data-dim="${rel}" `, '');
    }
  }
  const dir = path.join(DEPLOY, 'especialidades', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  geradas++;
}

/* A pasta especialidades/ passa a existir e, nas hospedagens que priorizam
   diretório, /especialidades deixaria de servir especialidades.html. O índice
   do diretório recebe uma cópia da listagem com <base>, mantendo o canonical
   /especialidades apontando para o mesmo conteúdo. */
let indice = fs.readFileSync(path.join(DEPLOY, 'especialidades.html'), 'utf8');
indice = indice.replace('<head>', '<head>\n<base href="/">');
fs.writeFileSync(path.join(DEPLOY, 'especialidades', 'index.html'), indice, 'utf8');

console.log(`páginas de área geradas: ${geradas}, mais o índice de /especialidades/`);
