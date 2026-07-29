// Captura o modal de perfil exatamente como o runtime original o desenha, para
// que a reescrita em JavaScript comum reproduza o design sem reinventá-lo.
// Grava em src-site-3/modal.json.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PORTA = process.env.PORTA || 4350;
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(`http://localhost:${PORTA}/index.html`, { waitUntil: 'networkidle' });
await p.waitForTimeout(1800);

// clica no primeiro rosto do mosaico
await p.locator('button[aria-label^="Ver o perfil de"]').first().click();
await p.waitForTimeout(1200);

const dados = await p.evaluate(() => {
  const dlg =
    document.querySelector('[role="dialog"]') ||
    [...document.body.children].reverse().find((n) => {
      const cs = getComputedStyle(n);
      return cs.position === 'fixed' && n.offsetHeight > 300;
    });
  if (!dlg) return null;
  return {
    markup: dlg.outerHTML,
    texto: dlg.innerText.replace(/\s+/g, ' ').slice(0, 400),
    rotulos: [...dlg.querySelectorAll('*')]
      .map((n) => (n.children.length === 0 ? n.innerText.trim() : ''))
      .filter((t) => t && t.length < 40),
  };
});

if (!dados) {
  console.log('modal NAO capturado');
} else {
  fs.writeFileSync(
    '/home/user/ecooa-website/src-site-3/modal.json',
    JSON.stringify(dados, null, 2),
    'utf8'
  );
  console.log('modal capturado:', dados.markup.length, 'bytes');
  console.log('\ntexto do modal:\n ', dados.texto);
  console.log('\nrótulos curtos encontrados:\n ', dados.rotulos.join(' | '));
}
await b.close();
