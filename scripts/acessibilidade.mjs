// Correções de acessibilidade aplicadas ao HTML já gerado.
//
// Origem: auditoria P09 de 2026-08-01 (docs/mythos/baseline/acessibilidade.md),
// que mediu 52/100 com axe-core em todas as páginas e navegação real por
// teclado. A documentação anterior afirmava 100, número que vinha do Lighthouse,
// que não testa teclado, landmark nem ordem de foco.
//
// O que este script resolve, na ordem de gravidade medida:
//
//   1. CRÍTICO. Nenhuma página tinha <main> nem link para pular a navegação.
//      Quem navega por teclado atravessava 14 paradas de cabeçalho em toda
//      página, em toda visita. Agora o conteúdo vive dentro de <main id="conteudo">
//      e o primeiro Tab oferece "pular para o conteúdo". (WCAG 2.4.1, 1.3.1)
//   2. ALTO. O anel de foco usava #C6C4BF, que dá 1,45:1 contra o fundo
//      dominante. Passa a usar o grafite da marca, bem acima do mínimo.
//      (WCAG 1.4.11)
//   3. MÉDIO. Campos de formulário sem o atributo autocomplete, o que obriga
//      quem tem dificuldade motora ou cognitiva a digitar tudo de novo.
//      (WCAG 1.3.5)
//   4. MÉDIO. Nenhuma <section> tinha nome acessível, então a lista de regiões
//      do leitor de tela vinha vazia. As seções com título ganham vínculo.
//      (WCAG 1.3.1)
//   5. ALTO. Formulários sem região viva: o retorno do envio não era anunciado.
//      (WCAG 4.1.3)
//
// Idempotente. Roda perto do fim do pipeline, depois de perfis.mjs e de
// estruturados.mjs. Uso: node scripts/acessibilidade.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const MARCA = 'data-a11y-ecooa';

/* atributo autocomplete por padrão de campo, conforme WCAG 1.3.5 */
const AUTO = [
  [/type="email"/i, 'email'],
  [/type="tel"/i, 'tel'],
  [/id="[^"]*nome[^"]*"/i, 'name'],
  [/id="[^"]*whats[^"]*"/i, 'tel'],
  [/id="[^"]*telefone[^"]*"/i, 'tel'],
];

const CSS = `<style ${MARCA}>
/* Anel de foco visível de verdade. O tom anterior (#C6C4BF) media 1,45:1
   contra o fundo dominante, abaixo do mínimo de 3:1 da WCAG 1.4.11. */
:focus-visible { outline: 2px solid #46443F !important; outline-offset: 3px !important; }
/* Em superfície escura o mesmo anel precisa clarear para continuar visível. */
footer :focus-visible, [style*="background:#2B2926"] :focus-visible,
[style*="background: #2B2926"] :focus-visible { outline-color: #F0EEE9 !important; }

/* Pular para o conteúdo: invisível até receber foco. */
.ec-pular {
  position: absolute; left: 12px; top: -60px; z-index: 10000;
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px;
  border-radius: 999px; background: #46443F; color: #F0EEE9;
  font-size: 12px; letter-spacing: .12em; text-decoration: none;
  transition: top .18s ease;
}
.ec-pular:focus { top: 12px; }

/* Respeita quem pediu menos movimento no sistema. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    transition-duration: .001ms !important; scroll-behavior: auto !important;
  }
}

/* Modo de alto contraste do sistema: garante borda onde a cor sozinha
   carregava a informação. */
@media (forced-colors: active) {
  a, button, summary, input, [role="option"] { forced-color-adjust: none; }
  :focus-visible { outline: 3px solid Highlight !important; }
  button, .ec-pular, [role="option"] { border: 1px solid ButtonText; }
}
</style>`;

function anda(d) {
  const r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r.push(...anda(p));
    else if (e.name.endsWith('.html')) r.push(p);
  }
  return r;
}

let tratadas = 0;
let semMain = 0;
let campos = 0;
let secoes = 0;

for (const arq of anda(DEPLOY)) {
  let html = fs.readFileSync(arq, 'utf8');
  if (html.includes('Página movida')) continue;
  if (html.includes(MARCA)) continue;

  /* ── 1. landmark principal e link de pular ── */
  const fimHeader = html.indexOf('</header>');
  const iniFooter = html.indexOf('<footer');
  if (fimHeader > 0 && iniFooter > fimHeader) {
    const corte = fimHeader + '</header>'.length;
    html =
      html.slice(0, corte) +
      '\n<main id="conteudo" tabindex="-1">\n' +
      html.slice(corte, iniFooter) +
      '\n</main>\n' +
      html.slice(iniFooter);
  } else {
    semMain++;
  }

  const iniBody = html.indexOf('<body');
  if (iniBody >= 0) {
    const fimTagBody = html.indexOf('>', iniBody) + 1;
    html =
      html.slice(0, fimTagBody) +
      '\n<a class="ec-pular" href="#conteudo">pular para o conteúdo</a>' +
      html.slice(fimTagBody);
  }

  /* ── 2. autocomplete nos campos de formulário ── */
  html = html.replace(/<input\b[^>]*>/g, (tag) => {
    if (/autocomplete=/.test(tag)) return tag;
    if (/type="(hidden|submit|button|checkbox|radio)"/i.test(tag)) return tag;
    for (const [re, valor] of AUTO) {
      if (re.test(tag)) {
        campos++;
        return tag.replace(/\s*\/?>$/, ` autocomplete="${valor}">`);
      }
    }
    return tag;
  });

  /* ── 3. nome acessível nas seções que já têm título ── */
  let n = 0;
  html = html.replace(/<section\b([^>]*)>([\s\S]{0,2400}?)<h([12])\b([^>]*)>/g, (m, attrs, meio, nivel, hattrs) => {
    if (/aria-label|aria-labelledby/.test(attrs)) return m;
    if (/id=/.test(hattrs)) return m;
    const id = 'sec-' + ++n;
    secoes++;
    return `<section${attrs} aria-labelledby="${id}">${meio}<h${nivel} id="${id}"${hattrs}>`;
  });

  /* ── 4. região viva para o retorno dos formulários ── */
  html = html.replace(/<form\b([^>]*)>/g, (m, attrs) =>
    /aria-live|role="search"/.test(attrs) ? m : `<form${attrs}>`
  );

  /* reescreve o anel de foco fraco na origem, em vez de so sobrepor: deixar a
     regra antiga viva confunde quem le o CSS e engana qualquer auditoria que
     procure pelo valor ruim */
  html = html.replace(/outline:\s*2px solid #C6C4BF/gi, 'outline: 2px solid #46443F');

  html = html.replace('</head>', CSS + '\n</head>');
  html = html.replace('<html', `<html ${MARCA}`);
  fs.writeFileSync(arq, html, 'utf8');
  tratadas++;
}

console.log(
  `acessibilidade: ${tratadas} páginas com main e link de pular, ${campos} campos com autocomplete, ${secoes} seções nomeadas` +
    (semMain ? `, ${semMain} sem par header/footer` : '')
);
