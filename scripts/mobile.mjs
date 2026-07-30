// Restaura o comportamento responsivo que a pre-renderizacao congelou.
//
// As paginas em src-site-3/ decidiam o layout em JavaScript, lendo
// window.innerWidth. Pre-renderizar a 1440px gravou apenas o estado desktop e
// jogou fora todo o ramo mobile, incluindo o menu do celular. Este script
// reintroduz esse comportamento em CSS, com os mesmos limites que o autor
// escreveu, e o markup original do menu, copiado do template.
//
// Limites do autor, para conferencia:
//   Sobrancelha.dc.html:167  desktop      = largura >= 1080
//   Rodape.dc.html:120       empilhado    = largura <  760
//   index.html:400           semHover     = largura <  1024
//   index.html:419           colsEspaco   = largura >= 900  ? 4 : 2
//   index.html:421           colsMosaico  = largura >= 1100 ? 8 : >= 760 ? 6 : >= 480 ? 4 : 3
//   profissionais.html:206   duasColunas  = largura >= 860
//   sobre.html:210           empilhado    = largura <  860
//
// A manipulacao acontece no DOM real, num navegador headless, e nao por busca e
// troca de texto: as paginas pre-renderizadas sao um bloco unico de HTML com
// estilos inline, onde cirurgia por string erra facil.
//
// Uso: node scripts/mobile.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const PORTA = 4391;
const MARCA = 'data-mob-pronto';

/* ── markup do menu mobile, copiado de src-site-3/Sobrancelha.dc.html ── */
const ACOES_MOBILE = `<div data-mob-acoes style="display:none; align-items:center; gap:10px;">
  <a href="https://instagram.com/somos.ecooa" target="_blank" rel="noopener noreferrer" aria-label="Instagram da ecooa" style="width:40px; height:40px; border-radius:999px; background:var(--fundo); display:inline-flex; align-items:center; justify-content:center; color:var(--grafite); box-shadow:var(--relevo-botao);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.4" cy="6.6" r="1"></circle></svg>
  </a>
  <button type="button" id="mob-btn" aria-expanded="false" aria-controls="mob-painel" style="background:var(--fundo); border:0; border-radius:999px; cursor:pointer; min-height:44px; padding:0 22px; font-size:11.5px; letter-spacing:.16em; color:var(--grafite); box-shadow:var(--relevo-botao);">menu</button>
</div>`;

const PAINEL_MOBILE = `<div data-mob-painel id="mob-painel" hidden style="background:var(--nuvem); border-bottom:1px solid var(--rule); box-shadow:0 26px 60px rgba(70,68,63,.14); max-height:calc(100vh - 76px); overflow-y:auto;">
  <div style="padding:26px clamp(20px,5vw,32px) 30px; display:grid; gap:1px; background:var(--stone);">
    <a href="sobre.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">sobre</a>
    <a href="especialidades.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">especialidades</a>
    <a href="profissionais.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">profissionais</a>
    <a href="qual-profissional-procurar.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">busca por IA</a>
    <a href="blog.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">editorial</a>
    <a href="localizacao.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">localização</a>
    <a href="mentorias.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">mentorias</a>
    <a href="sublocacao.html" style="background:var(--nuvem); padding:16px 6px; font-size:17px; color:var(--tinta);">sublocação</a>
  </div>
  <div style="padding:0 clamp(20px,5vw,32px) 30px;">
    <a href="https://wa.me/5551991460909?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20na%20ecooa" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; min-height:54px; border-radius:999px; background:var(--grafite); color:var(--fundo); font-size:11.5px; letter-spacing:.16em;">agendar</a>
  </div>
</div>`;

const CSS = `<style>
/* Responsividade do desenho original, que a pre-renderizacao congelou no
   estado de 1440px. Os limites sao os mesmos que estavam no JavaScript.
   Os estilos da pagina vem inline, por isso o !important: sem ele a regra
   inline vence. Cada regra vive dentro de uma media query, entao o desktop
   segue exatamente como estava. */

/* cabecalho: abaixo de 1080 o autor troca a barra inteira pelo botao menu */
@media (max-width: 1079px) {
  [data-nav-desktop], [data-acoes-desktop] { display: none !important; }
  [data-mob-acoes] { display: flex !important; }
}
@media (min-width: 1080px) {
  [data-mob-acoes], [data-mob-painel] { display: none !important; }
}
[data-mob-painel][hidden] { display: none !important; }
#mob-btn:focus-visible { outline: 2px solid #5C5A55; outline-offset: 2px; }
[data-mob-painel] a:focus-visible { outline: 2px solid #5C5A55; outline-offset: -2px; }

/* mosaico de profissionais: 8 / 6 / 4 / 3 nos limites 1100 / 760 / 480 */
@media (max-width: 1099px) { [data-mosaico] { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; } }
@media (max-width: 759px)  { [data-mosaico] { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
@media (max-width: 479px)  { [data-mosaico] { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }

/* Legenda do mosaico: no toque ela fica sempre visivel, entao precisa caber no
   azulejo em vez de transbordar por cima do rosto. Sao dois filhos diretos, o
   primeiro e o nome, o segundo e a classe profissional. */
@media (max-width: 1023px) {
  [data-perfil] [data-legenda] { padding: 9px 8px 10px !important; }
  [data-perfil] [data-legenda] > span:first-child {
    font-size: 13px !important; line-height: 1.12 !important;
  }
  [data-perfil] [data-legenda] > span:nth-child(2) {
    font-size: 9px !important; letter-spacing: .04em !important; line-height: 1.3 !important;
  }
}
@media (max-width: 479px) {
  [data-perfil] [data-legenda] { padding: 7px 6px 8px !important; }
  [data-perfil] [data-legenda] > span:first-child { font-size: 12px !important; }
  /* a classe profissional nao cabe em azulejo de 3 colunas: fica so o nome */
  [data-perfil] [data-legenda] > span:nth-child(2) { display: none !important; }
}

/* instrucao de hover nao existe no dedo */
[data-toque] { display: none; }
@media (max-width: 1023px) {
  [data-ponteiro] { display: none; }
  [data-toque] { display: inline; }
}

/* secao do espaco: 4 colunas viram 2 abaixo de 900 */
@media (max-width: 899px) { [data-espaco] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }

/* sobre e profissionais: duas colunas empilham em 860 */
@media (max-width: 859px) {
  [data-duas-colunas] { grid-template-columns: 1fr !important; }
  /* empilhado, o retrato vem antes do texto, como no desenho original */
  [data-ordem-texto] { order: 2 !important; }
  [data-ordem-foto] { order: 1 !important; }
}

/* rodape: contato e links centralizam abaixo de 760 */
@media (max-width: 759px) {
  [data-rodape-links] { justify-items: center !important; }
  [data-rodape-contato] { text-align: center !important; }
}

/* Alvos de toque e legibilidade. Marcados na segunda passada, medindo a
   pagina ja responsiva em 402px, e nao chutando no desktop.
   O dedo tem cerca de 9mm: link de 16px de altura erra. */
@media (max-width: 859px) {
  [data-alvo-curto] { padding-top: 8px !important; padding-bottom: 8px !important; }
  [data-alvo-curto][data-inline] { display: inline-block !important; }
  /* rotulos abaixo de 11px ficam ilegiveis no celular, e a leitora da ecooa
     tem de 30 a 70 anos. 11px e o piso, o desenho nao muda de aparencia. */
  [data-miudo] { font-size: 11px !important; }
}

/* modal de perfil: no celular a foto entra no fluxo. Fora do fluxo ela
   deixava a primeira linha do grid com 0px de altura e vazava por cima do
   texto, escondendo nome, marca e o bloco de formacao. */
@media (max-width: 860px) {
  .pf-foto { aspect-ratio: auto !important; min-height: 0 !important; max-height: none !important; }
  .pf-foto img {
    position: static !important; width: 100% !important; height: 46vh !important;
    object-fit: cover; object-position: center top;
  }
  .pf-vazia { position: static !important; height: 46vh !important; }
}
</style>`;

const JS = `<script>
/* Menu do celular. JavaScript comum, sem eval, para respeitar a politica de
   seguranca do dominio. O painel e o mesmo que o template original abria. */
(function () {
  var btn = document.getElementById('mob-btn');
  var painel = document.getElementById('mob-painel');
  if (!btn || !painel) return;

  function fechar() {
    painel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'menu';
  }
  function abrir() {
    painel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'fechar';
  }

  btn.addEventListener('click', function () {
    if (painel.hidden) abrir(); else fechar();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !painel.hidden) { fechar(); btn.focus(); }
  });

  /* voltar ao desktop com o painel aberto deixaria estado preso */
  var largo = window.matchMedia('(min-width: 1080px)');
  var aoTrocar = function (e) { if (e.matches) fechar(); };
  if (largo.addEventListener) largo.addEventListener('change', aoTrocar);
  else if (largo.addListener) largo.addListener(aoTrocar);
})();
</script>`;

/* ── servidor local sobre deploy/ ── */
const servidor = require('child_process').spawn('python3', ['-m', 'http.server', String(PORTA)], {
  cwd: DEPLOY,
  detached: true,
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 2200));

const relatorio = [];
try {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });

  for (const nome of fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'))) {
    // Sobrancelha.dc.html e Rodape.dc.html sao templates de componente, com
    // placeholders {{ }}. Nao sao paginas: serializar o DOM deles destroi o
    // template.
    if (nome.endsWith('.dc.html')) continue;
    const arq = path.join(DEPLOY, nome);
    if (fs.readFileSync(arq, 'utf8').includes(MARCA)) continue;

    // 1080 de largura: o proprio limite desktop do autor, para nao disparar
    // nenhuma das media queries que estamos injetando durante a montagem
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${PORTA}/${nome}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);

    const feito = await p.evaluate(
      ([acoesMobile, painelMobile]) => {
        const feito = [];

        /* cabecalho */
        const nav = document.querySelector('header nav[aria-label="Navegação principal"]');
        if (nav) {
          nav.setAttribute('data-nav-desktop', '');
          const acoes = nav.nextElementSibling;
          if (acoes && acoes.tagName === 'DIV') {
            acoes.setAttribute('data-acoes-desktop', '');
            acoes.insertAdjacentHTML('afterend', acoesMobile);
          }
          const header = nav.closest('header');
          header.insertAdjacentHTML('beforeend', painelMobile);
          feito.push('cabeçalho mobile');
        }

        /* mosaico e secao do espaco: identificados pelo conteudo, nao pelo texto do estilo */
        // O mosaico e a grade que reune todos os retratos. Em profissionais.html
        // os mesmos botoes aparecem soltos, um por ficha, e nao formam grade.
        const grade = [...document.querySelectorAll('div')].find(
          (d) =>
            getComputedStyle(d).display === 'grid' &&
            d.querySelectorAll(':scope > [data-perfil]').length >= 8
        );
        if (grade) {
          grade.setAttribute('data-mosaico', '');
          feito.push('mosaico 8/6/4/3');
        }
        const espaco = [...document.querySelectorAll('div')].find(
          (d) =>
            d.style.gridTemplateColumns === 'repeat(4, minmax(0px, 1fr))' &&
            d.style.gridAutoFlow === 'dense'
        );
        if (espaco) {
          espaco.setAttribute('data-espaco', '');
          feito.push('espaço 4/2');
        }

        /* Duas colunas de sobre e profissionais. Somente as grades que alternam
           texto e retrato: a grade 1fr 1fr de localizacao.html e fixa no
           original, o autor nunca a fez responsiva, entao fica como esta. */
        const duas = [...document.querySelectorAll('div')].filter((d) => {
          if (d.style.display !== 'grid' || d.style.gridTemplateColumns !== '1fr 1fr') return false;
          const filhos = [...d.children];
          const comFoto = filhos.filter((c) => c.querySelector('img')).length;
          return comFoto > 0 && comFoto < filhos.length;
        });
        duas.forEach((g) => {
          g.setAttribute('data-duas-colunas', '');
          // empilhado, o retrato precisa vir antes do texto em cada par
          const filhos = [...g.children];
          for (let i = 0; i < filhos.length; i += 2) {
            const a = filhos[i];
            const c = filhos[i + 1];
            if (!c) break;
            const aTemFoto = !!a.querySelector('img');
            const cTemFoto = !!c.querySelector('img');
            // so age quando o par e um texto e uma foto, e o texto vem primeiro
            if (!aTemFoto && cTemFoto) {
              a.setAttribute('data-ordem-texto', '');
              c.setAttribute('data-ordem-foto', '');
            }
          }
        });
        if (duas.length) feito.push(`empilha em 860 (${duas.length} grade)`);

        /* rodape */
        const rodapeNav = document.querySelector('nav[aria-label="Navegação do rodapé"]');
        if (rodapeNav) {
          rodapeNav.setAttribute('data-rodape-links', '');
          const contato = [...document.querySelectorAll('footer div, div')].find(
            (d) => d.style.textAlign === 'right'
          );
          if (contato) contato.setAttribute('data-rodape-contato', '');
          feito.push('rodapé centraliza em 760');
        }

        /* instrucao de hover vira instrucao de toque */
        const FRASE = 'Passe o mouse para ver quem é.';
        const alvo = [...document.querySelectorAll('p')].find(
          (x) => x.textContent.includes(FRASE) && !x.querySelector('[data-toque]')
        );
        if (alvo) {
          alvo.innerHTML = alvo.innerHTML.replace(
            FRASE,
            '<span data-ponteiro>' + FRASE + '</span><span data-toque>Toque para ver quem é.</span>'
          );
          feito.push('copy de toque');
        }

        return feito;
      },
      [ACOES_MOBILE, PAINEL_MOBILE]
    );

    let html = await p.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
    html = html.replace('</head>', CSS + '\n</head>');
    html = html.replace('</body>', JS + '\n</body>');
    html = html.replace('<html', `<html ${MARCA}`);
    fs.writeFileSync(arq, html, 'utf8');
    relatorio.push(`${nome.padEnd(34)} ${feito.join(', ') || 'apenas CSS base'}`);
    await p.close();
  }

  /* ── segunda passada: alvos de toque e tamanho de fonte, medidos em 402px,
        que e a largura real do iPhone dos prints do cliente ── */
  for (const nome of fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'))) {
    if (nome.endsWith('.dc.html')) continue;
    const arq = path.join(DEPLOY, nome);
    const p = await b.newPage({
      viewport: { width: 402, height: 874 },
      isMobile: true,
      hasTouch: true,
    });
    await p.goto(`http://localhost:${PORTA}/${nome}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);

    const n = await p.evaluate(() => {
      let curtos = 0;
      let miudos = 0;
      document.querySelectorAll('a, button').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || r.height >= 30) return;
        // o painel do menu mobile e o modal ja tem alvo generoso
        if (el.closest('[data-mob-painel], .pf-pn')) return;
        el.setAttribute('data-alvo-curto', '');
        const d = getComputedStyle(el).display;
        if (d === 'inline') el.setAttribute('data-inline', '');
        curtos++;
      });
      document.querySelectorAll('p, li, span, a, dd, dt, h1, h2, h3, h4').forEach((el) => {
        if (el.children.length) return;
        const t = el.textContent.trim();
        if (t.length < 3) return;
        if (!el.getBoundingClientRect().width) return;
        if (parseFloat(getComputedStyle(el).fontSize) >= 11) return;
        // a legenda do mosaico tem regra propria, por azulejo, logo acima
        if (el.closest('[data-legenda]')) return;
        el.setAttribute('data-miudo', '');
        miudos++;
      });
      return { curtos, miudos };
    });

    const html = await p.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
    fs.writeFileSync(arq, html, 'utf8');
    const i = relatorio.findIndex((l) => l.startsWith(nome.padEnd(34)));
    if (i >= 0) relatorio[i] += `, ${n.curtos} alvos e ${n.miudos} rótulos ajustados`;
    await p.close();
  }
  await b.close();
} finally {
  try {
    process.kill(-servidor.pid);
  } catch {
    /* servidor ja encerrado */
  }
}

console.log('responsividade restaurada:');
relatorio.forEach((l) => console.log('    ' + l));
