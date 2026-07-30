// Build do site ecooa 3.0.
//
// O site é estático e já vem pronto na pasta deploy/. Este script apenas copia
// deploy/ para dist/, que é o diretório que as plataformas de hospedagem leem
// (Cloudflare Workers via wrangler.jsonc, e qualquer pipeline que rode
// "npm run build"). Assim o site publicado é o mesmo em qualquer caminho.
//
// O projeto Astro anterior continua no repositório e pode ser compilado com
// "npm run build:astro", mas não é mais o que vai ao ar.

import { cp, rm, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origem = path.join(raiz, 'deploy');
const destino = path.join(raiz, 'dist');

if (!existsSync(origem)) {
  console.error('ERRO: pasta deploy/ não encontrada. Nada a publicar.');
  process.exit(1);
}

// Arquivos sem os quais publicar seria pior que não publicar.
// support.js saiu desta lista no P06: o runtime que compilava JSX no navegador
// foi removido do site, e exigir o arquivo quebrava o build do zero.
for (const obrigatorio of ['index.html', 'dados-ecooa.js', 'CNAME', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(path.join(origem, obrigatorio))) {
    console.error(`ERRO: deploy/${obrigatorio} não existe. Publicação abortada.`);
    process.exit(1);
  }
}

// O runtime não pode voltar sem que alguém decida: ele reintroduz eval e 3,3 MB.
for (const proibido of ['support.js', 'assets/vendor/babel-standalone-7.29.0.min.js']) {
  if (existsSync(path.join(origem, proibido))) {
    console.error(
      `ERRO: deploy/${proibido} voltou. Foi removido no P06 por peso e por depender de eval.\n` +
        '      Se o retorno for intencional, ajuste esta lista em scripts/build-site.mjs.'
    );
    process.exit(1);
  }
}

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });
await cp(origem, destino, { recursive: true });

const paginas = (await readdir(destino)).filter((f) => f.endsWith('.html'));
console.log(`site 3.0 publicado em dist/: ${paginas.length} páginas na raiz`);
