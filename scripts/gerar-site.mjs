// Pipeline de geração do site 3.0.
//
// As páginas em src-site-3/ são os originais, com templates que o runtime
// compilaria no navegador com eval. A política de segurança do domínio proíbe
// eval, então aqui a compilação acontece uma vez, no build, e o HTML sai pronto.
//
// Etapas:
//   1. monta uma pasta temporária com os originais + support.js + dados + assets
//   2. abre cada página num navegador headless e grava o DOM já resolvido
//   3. religa o que a pré-renderização congela: links do topo, submenus e mosaico
//
// Uso: node scripts/gerar-site.mjs
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const RAIZ = '/home/user/ecooa-website';
const FONTE = path.join(RAIZ, 'src-site-3');
const DEPLOY = path.join(RAIZ, 'deploy');
const TMP = '/tmp/gerar-site';
const PORTA = 4390;

const PAGINAS = [
  'index.html',
  'sobre.html',
  'especialidades.html',
  'profissionais.html',
  'qual-profissional-procurar.html',
  'blog.html',
  'localizacao.html',
  'mentorias.html',
  'sublocacao.html',
  'politicas.html',
  '404.html',
];

/* 1. pasta temporária: originais com template + runtime + dados atuais */
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
for (const pg of [...PAGINAS, 'Sobrancelha.dc.html', 'Rodape.dc.html']) {
  fs.copyFileSync(path.join(FONTE, pg), path.join(TMP, pg));
}
// O runtime (support.js + React + Babel) vive em src-site-3/runtime/ e so
// existe aqui, no momento da geracao. Ele NAO vai para deploy/: o P06 removeu
// o runtime do site publicado e o build barra o retorno dele.
fs.copyFileSync(path.join(FONTE, 'runtime', 'support.js'), path.join(TMP, 'support.js'));
fs.copyFileSync(path.join(DEPLOY, 'dados-ecooa.js'), path.join(TMP, 'dados-ecooa.js'));
fs.cpSync(path.join(DEPLOY, 'assets'), path.join(TMP, 'assets'), { recursive: true });
fs.cpSync(path.join(FONTE, 'runtime', 'vendor'), path.join(TMP, 'assets', 'vendor'), {
  recursive: true,
});

/* 2. servidor local e pré-renderização */
const servidor = require('child_process').spawn('python3', ['-m', 'http.server', String(PORTA)], {
  cwd: TMP,
  detached: true,
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 2500));

try {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  for (const pg of PAGINAS) {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${PORTA}/${pg}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1600);
    const html = await p.evaluate(() => {
      document.querySelectorAll('x-dc, helmet').forEach((n) => n.remove());
      return '<!doctype html>\n' + document.documentElement.outerHTML;
    });
    fs.writeFileSync(path.join(DEPLOY, pg), html, 'utf8');
    const texto = await p.evaluate(() => document.body.innerText.trim().length);
    console.log(`  ${pg.padEnd(34)} texto: ${texto}`);
    await p.close();
  }
  await b.close();
} finally {
  try {
    process.kill(-servidor.pid);
  } catch {
    /* servidor já encerrado */
  }
}

/* 3. religa o comportamento */
console.log('');
for (const etapa of [
  'nav-links.mjs',
  'menus.mjs',
  'mosaico.mjs',
  'mobile.mjs',
  'conversao.mjs',
  'match.mjs',
  'limpeza.mjs',
  'retoques.mjs',
  'areas.mjs',
  'artigos.mjs',
  'perfis.mjs',
  'estruturados.mjs',
  'acessibilidade.mjs',
  'redirects.mjs',
  'medicao.mjs',
  'personaliza.mjs',
  'sitemap.mjs',
]) {
  const saida = execFileSync('node', [path.join(RAIZ, 'scripts', etapa)], {
    encoding: 'utf8',
  });
  process.stdout.write('  ' + saida.trim() + '\n');
}
console.log('\nsite gerado em deploy/');
