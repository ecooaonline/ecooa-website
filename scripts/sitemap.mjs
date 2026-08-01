// Regera deploy/sitemap.xml com todas as URLs indexáveis do site publicado:
// as 9 rotas da raiz, as 8 páginas de especialidade e os 14 artigos.
// Roda por último no pipeline. Uso: node scripts/sitemap.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const DOMINIO = 'https://www.somosecooa.com.br';

const urls = [
  '/',
  '/sobre',
  '/especialidades',
  '/profissionais',
  '/qual-profissional-procurar',
  '/blog',
  '/localizacao',
  '/mentorias',
  '/sublocacao',
];

const areasDir = path.join(DEPLOY, 'especialidades');
if (fs.existsSync(areasDir)) {
  for (const d of fs.readdirSync(areasDir, { withFileTypes: true })) {
    if (d.isDirectory() && fs.existsSync(path.join(areasDir, d.name, 'index.html'))) {
      urls.push(`/especialidades/${d.name}/`);
    }
  }
}
const perfisDir = path.join(DEPLOY, 'profissionais');
if (fs.existsSync(perfisDir)) {
  for (const d of fs.readdirSync(perfisDir, { withFileTypes: true })) {
    if (d.isDirectory() && fs.existsSync(path.join(perfisDir, d.name, 'index.html'))) {
      urls.push(`/profissionais/${d.name}/`);
    }
  }
}

const blogDir = path.join(DEPLOY, 'blog');
if (fs.existsSync(blogDir)) {
  for (const d of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (d.isDirectory() && fs.existsSync(path.join(blogDir, d.name, 'index.html'))) {
      urls.push(`/blog/${d.name}/`);
    }
  }
}

const hoje = process.env.SITEMAP_DATA || '2026-07-31';
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${DOMINIO}${u}</loc><lastmod>${hoje}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(DEPLOY, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap: ${urls.length} URLs`);
