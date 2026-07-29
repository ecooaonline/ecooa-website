// Converte os PNG pesados de deploy/assets para WebP e reescreve as referências
// nos HTML e no dados-ecooa.js. Não altera enquadramento, corte nem cor: só troca
// o formato do arquivo. Os PNG originais continuam em src-site-3/assets-png/.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const BACKUP = path.join(RAIZ, 'src-site-3', 'assets-png');

const pngs = [];
(function varrer(dir) {
  for (const nome of fs.readdirSync(dir)) {
    const p = path.join(dir, nome);
    if (fs.statSync(p).isDirectory()) varrer(p);
    else if (nome.toLowerCase().endsWith('.png')) pngs.push(p);
  }
})(path.join(DEPLOY, 'assets'));

let antes = 0;
let depois = 0;
const trocas = [];

for (const png of pngs) {
  const rel = path.relative(DEPLOY, png);
  const webp = png.replace(/\.png$/i, '.webp');
  const tamAntes = fs.statSync(png).size;

  // qualidade 82 com esforço máximo: diferença visual imperceptível em foto
  await sharp(png).webp({ quality: 82, effort: 6 }).toFile(webp);
  const tamDepois = fs.statSync(webp).size;

  // guarda o original fora da pasta publicada
  const destino = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(png, destino);
  fs.unlinkSync(png);

  antes += tamAntes;
  depois += tamDepois;
  trocas.push([rel, rel.replace(/\.png$/i, '.webp')]);
  console.log(
    `  ${rel.padEnd(48)} ${(tamAntes / 1048576).toFixed(2)} MB -> ${(tamDepois / 1048576).toFixed(2)} MB`
  );
}

// reescreve as referências
const alvos = fs
  .readdirSync(DEPLOY)
  .filter((f) => f.endsWith('.html') || f.endsWith('.js'))
  .map((f) => path.join(DEPLOY, f));

let arquivosTocados = 0;
for (const alvo of alvos) {
  let txt = fs.readFileSync(alvo, 'utf8');
  const original = txt;
  for (const [de, para] of trocas) txt = txt.split(de).join(para);
  if (txt !== original) {
    fs.writeFileSync(alvo, txt, 'utf8');
    arquivosTocados++;
  }
}

console.log(
  `\n${pngs.length} imagens convertidas · ${(antes / 1048576).toFixed(1)} MB -> ${(depois / 1048576).toFixed(1)} MB ` +
    `(economia de ${(((antes - depois) / antes) * 100).toFixed(0)}%)`
);
console.log(`referências atualizadas em ${arquivosTocados} arquivos`);
