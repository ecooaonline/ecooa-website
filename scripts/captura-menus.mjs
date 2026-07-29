// Captura os painéis dos submenus exatamente como o runtime original os desenha,
// e grava em src-site-3/menus.json. Assim a versão pré-renderizada reproduz o
// esboço aprovado sem que ninguém precise redesenhar os menus na mão.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PORTA = process.env.PORTA || 4350;
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
await p.goto(`http://localhost:${PORTA}/index.html`, { waitUntil: 'networkidle' });
await p.waitForTimeout(1800);

const painies = {};

for (const rotulo of ['especialidades', 'profissionais', 'mais']) {
  // fecha qualquer painel aberto
  await p.keyboard.press('Escape').catch(() => {});
  await p.waitForTimeout(300);

  const alturaAntes = await p.evaluate(
    () => document.querySelector('header')?.getBoundingClientRect().height || 0
  );
  await p.locator(`header :text-is("${rotulo}")`).first().click();
  await p.waitForTimeout(800);

  const dados = await p.evaluate((alturaAntes) => {
    const header = document.querySelector('header');
    if (!header) return null;
    if (header.getBoundingClientRect().height <= alturaAntes + 4) return null;
    // o painel é o último bloco que apareceu dentro do header
    const filhos = [...header.children];
    const painel = filhos[filhos.length - 1];
    return painel ? painel.outerHTML : null;
  }, alturaAntes);

  if (dados) {
    painies[rotulo] = dados;
    console.log(`  ${rotulo}: painel capturado, ${dados.length} bytes`);
  } else {
    console.log(`  ${rotulo}: NAO capturado`);
  }
}

fs.writeFileSync(
  '/home/user/ecooa-website/src-site-3/menus.json',
  JSON.stringify(painies, null, 2),
  'utf8'
);
console.log(`\npainéis salvos: ${Object.keys(painies).join(', ')}`);
await b.close();
