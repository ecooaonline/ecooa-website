// Remove das paginas publicadas o runtime que nao faz mais nada, e arruma duas
// coisas que o Lighthouse cobra.
//
// Depois da pre-renderizacao nao resta nenhum elemento <x-dc> nas paginas, ou
// seja: support.js nao tem o que compilar, e React e ReactDOM nao tem o que
// montar. Ainda assim as tres bibliotecas eram baixadas em toda visita:
//
//   support.js                     72 KB
//   react-dom-18.3.1.min.js       132 KB
//   react-18.3.1.min.js            12 KB
//   babel-standalone-7.29.0.min.js  3,0 MB (buscado por support.js quando compila)
//
// Sao 216 KB baixados sempre, no caminho critico, mais 3 MB em disco. E era o
// suporte a eval que a politica de seguranca do dominio proibia.
//
// dados-ecooa.js FICA: window.ECOOA alimenta o modal de perfil e os filtros.
//
// Tambem:
//   1. remove os <style> do runtime (.sc-placeholder e x-dc), que sao mortos e
//      empurravam o <meta charset> para o byte 8563 do head. O Lighthouse
//      exige charset dentro dos primeiros 1024 bytes.
//   2. move o <meta charset> para a primeira posicao do head.
//
// Uso: node scripts/limpeza.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');

let paginas = 0;
let scriptsFora = 0;
let estilosFora = 0;
let bytesFora = 0;
let charsetMovido = 0;
let dadosMovido = 0;
let imgsDimensionadas = 0;
let contrasteCorrigido = 0;

/* Dimensoes de todas as imagens publicadas, medidas uma vez antes do laco.
   sharp e assincrono, por isso o pre-calculo em vez de consulta sob demanda. */
const cacheDim = new Map();
function anda(dir) {
  const saida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...anda(p));
    else if (/\.(webp|png|jpe?g|avif|svg|gif)$/i.test(e.name)) saida.push(p);
  }
  return saida;
}
for (const arq of anda(path.join(DEPLOY, 'assets'))) {
  const rel = path.relative(DEPLOY, arq).split(path.sep).join('/');
  try {
    if (/\.svg$/i.test(arq)) {
      const t = fs.readFileSync(arq, 'utf8');
      const w = t.match(/\bwidth="([\d.]+)/);
      const h = t.match(/\bheight="([\d.]+)/);
      const vb = t.match(/viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/);
      if (w && h) cacheDim.set(rel, { w: Math.round(+w[1]), h: Math.round(+h[1]) });
      else if (vb) cacheDim.set(rel, { w: Math.round(+vb[1]), h: Math.round(+vb[2]) });
    } else {
      const md = await sharp(arq).metadata();
      if (md.width && md.height) cacheDim.set(rel, { w: md.width, h: md.height });
    }
  } catch {
    /* arquivo ilegivel: fica sem dimensao, a tag nao e alterada */
  }
}

function dimensao(src) {
  const limpo = decodeURIComponent(String(src).split('?')[0]).replace(/^\.?\//, '');
  return cacheDim.get(limpo) || null;
}

for (const nome of fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'))) {
  if (nome.endsWith('.dc.html')) continue;
  const arq = path.join(DEPLOY, nome);
  let html = fs.readFileSync(arq, 'utf8');
  const antes = html.length;

  /* trava: se ainda houver x-dc, o runtime e necessario e nada e removido */
  if (/<x-dc[\s>]/.test(html)) {
    console.log(`  ${nome}: ainda tem <x-dc>, runtime preservado`);
    continue;
  }

  /* 1. fora os tres scripts do runtime */
  for (const alvo of ['support.js', 'react-18.3.1.min.js', 'react-dom-18.3.1.min.js', 'babel-standalone']) {
    const re = new RegExp(
      `\\s*<script[^>]*src="[^"]*${alvo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>\\s*</script>`,
      'g'
    );
    const n = (html.match(re) || []).length;
    if (n) {
      html = html.replace(re, '');
      scriptsFora += n;
    }
  }

  /* 2. fora os <style> mortos do runtime */
  html = html.replace(/\s*<style>[^<]*\.sc-placeholder\{[\s\S]*?<\/style>/g, () => {
    estilosFora++;
    return '';
  });
  html = html.replace(/\s*<style>\s*x-dc\{display:none!important\}\s*<\/style>/g, () => {
    estilosFora++;
    return '';
  });

  /* 3. charset em primeiro lugar no head */
  const mCharset = html.match(/<meta charset="[^"]*">\s*/i);
  if (mCharset) {
    const tag = mCharset[0].trim();
    html = html.replace(mCharset[0], '');
    html = html.replace(/(<head[^>]*>)/i, `$1\n<meta charset="utf-8">`);
    void tag;
    charsetMovido++;
  }

  /* 4. dados-ecooa.js sai do <head>: la ele bloqueia a renderizacao por cerca
        de 300 ms sem necessidade. Vai para o fim do body, antes dos scripts
        que leem window.ECOOA, preservando a ordem de execucao. */
  const mDados = html.match(/\s*<script[^>]*src="dados-ecooa\.js"[^>]*><\/script>/);
  if (mDados && html.indexOf(mDados[0]) < html.indexOf('</head>')) {
    html = html.replace(mDados[0], '');
    const primeiroScriptDoCorpo = html.indexOf('<script', html.indexOf('</head>'));
    const ancora = primeiroScriptDoCorpo >= 0 ? primeiroScriptDoCorpo : html.indexOf('</body>');
    html = html.slice(0, ancora) + '<script src="dados-ecooa.js"></script>\n' + html.slice(ancora);
    dadosMovido++;
  }

  /* 5. width e height em toda imagem: sem isso o navegador nao reserva espaco
        e o layout pode saltar. Dimensoes lidas do arquivo real. */
  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\swidth=/.test(tag) || /\sheight=/.test(tag)) return tag;
    const m = tag.match(/src="([^"]+)"/);
    if (!m) return tag;
    const dim = dimensao(m[1]);
    if (!dim) return tag;
    imgsDimensionadas++;
    return tag.replace(/<img\b/, `<img width="${dim.w}" height="${dim.h}"`);
  });

  /* 6. contraste dos contadores nos botoes de filtro: opacity .6 sobre grafite
        da 3.05:1, abaixo do minimo de 4.5:1 */
  const antesOp = html;
  html = html.replace(/opacity: *0?\.6; *font-size: *11px/g, 'opacity: 0.9; font-size: 11px');
  html = html.replace(/font-size: *11px; *opacity: *0?\.6/g, 'font-size: 11px; opacity: 0.9');
  if (html !== antesOp) contrasteCorrigido++;

  bytesFora += antes - html.length;
  fs.writeFileSync(arq, html, 'utf8');
  paginas++;
}

/* 4. os arquivos em si saem do que e publicado */
const ORFAOS = [
  'support.js',
  'assets/vendor/babel-standalone-7.29.0.min.js',
  'assets/vendor/react-18.3.1.min.js',
  'assets/vendor/react-dom-18.3.1.min.js',
];
let discoLiberado = 0;
for (const rel of ORFAOS) {
  const p = path.join(DEPLOY, rel);
  if (!fs.existsSync(p)) continue;
  // seguranca: so remove se nenhuma pagina publicada ainda o referenciar
  const base = path.basename(rel);
  const aindaUsado = fs
    .readdirSync(DEPLOY)
    .filter((f) => f.endsWith('.html') && !f.endsWith('.dc.html'))
    .some((f) => fs.readFileSync(path.join(DEPLOY, f), 'utf8').includes(base));
  if (aindaUsado) {
    console.log(`  ${base}: ainda referenciado, mantido`);
    continue;
  }
  discoLiberado += fs.statSync(p).size;
  fs.rmSync(p);
}
const vendor = path.join(DEPLOY, 'assets/vendor');
if (fs.existsSync(vendor) && !fs.readdirSync(vendor).length) fs.rmdirSync(vendor);

console.log(
  `limpeza: ${paginas} páginas | ${scriptsFora} scripts e ${estilosFora} estilos mortos fora | ` +
    `charset em 1o lugar em ${charsetMovido} | dados-ecooa.js fora do head em ${dadosMovido} | ` +
    `${imgsDimensionadas} imagens com width/height | contraste do contador em ${contrasteCorrigido} | ` +
    `${(bytesFora / 1024).toFixed(1)} KB de HTML e ${(discoLiberado / 1024 / 1024).toFixed(2)} MB de biblioteca liberados`
);
