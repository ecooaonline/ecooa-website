// Troca de posição pares de profissionais no array de dados, que é a fonte da
// ordem do mosaico da home. Recebe os pares na linha de comando.
//
// Uso: node scripts/trocar-ordem.mjs slugA:slugB slugC:slugD
import fs from 'node:fs';

const ARQ = '/home/user/ecooa-website/deploy/dados-ecooa.js';
const pares = process.argv.slice(2).map((p) => p.split(':'));
if (!pares.length) {
  console.error('informe ao menos um par no formato slugA:slugB');
  process.exit(1);
}

const s = fs.readFileSync(ARQ, 'utf8');
const ini = s.indexOf('const profissionais = [');
const fim = s.indexOf('\n  ];', ini);
if (ini < 0 || fim < 0) {
  console.error('array de profissionais não localizado');
  process.exit(1);
}
const cabeca = s.slice(0, ini);
const corpo = s.slice(ini, fim);
const cauda = s.slice(fim);

// separa os blocos de cada profissional preservando o texto exato
const marcas = [...corpo.matchAll(/\n    \{ slug:'([^']+)'/g)];
const blocos = marcas.map((m, i) => ({
  slug: m[1],
  texto: corpo.slice(m.index, i + 1 < marcas.length ? marcas[i + 1].index : corpo.length),
}));

const ordem = blocos.map((b) => b.slug);
for (const [a, b] of pares) {
  const ia = ordem.indexOf(a);
  const ib = ordem.indexOf(b);
  if (ia < 0 || ib < 0) {
    console.error(`slug não encontrado: ${ia < 0 ? a : b}`);
    process.exit(1);
  }
  const bl = blocos.find((x) => x.slug === a);
  const bl2 = blocos.find((x) => x.slug === b);
  const posA = blocos.indexOf(bl);
  const posB = blocos.indexOf(bl2);
  blocos[posA] = bl2;
  blocos[posB] = bl;
  ordem[ia] = b;
  ordem[ib] = a;
  console.log(`  trocados: ${a} (posição ${ia + 1}) <-> ${b} (posição ${ib + 1})`);
}

fs.writeFileSync(
  ARQ,
  cabeca + corpo.slice(0, marcas[0].index) + blocos.map((b) => b.texto).join('') + cauda,
  'utf8'
);
console.log(`\nnova ordem: ${blocos.map((b) => b.slug).join(', ')}`);
