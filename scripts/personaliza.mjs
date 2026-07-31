// Personaliza os CTAs genéricos de WhatsApp pelo contexto da página.
//
// Pedido do dono em 2026-08-01: cada CTA precisa dizer de onde a pessoa veio e
// o que ela quer, inclusive os herdados (botão agendar do cabeçalho, botão
// flutuante e menu do celular), que até aqui levavam a mensagem geral em todas
// as páginas. Nas páginas de área a mensagem pede indicação na área; nas de
// artigo, cita o texto e quem o assina; nas demais, o contexto da própria
// página.
//
// Roda depois de artigos.mjs. Uso: node scripts/personaliza.mjs
import fs from 'node:fs';
import path from 'node:path';
import { AREAS } from './conteudo-areas.mjs';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');

const GERAL =
  'Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação. Poderiam me orientar sobre o melhor caminho?';

global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

/* mensagem por página; quem não está aqui mantém a geral */
const POR_PAGINA = new Map([
  [
    'sobre.html',
    'Olá! Vim pelo site da ecooa, conheci a história da clínica e gostaria de agendar uma avaliação. Poderiam me orientar sobre o melhor caminho?',
  ],
  [
    'especialidades.html',
    'Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação. Poderiam me ajudar a escolher a especialidade certa para o meu caso?',
  ],
  [
    'especialidades/index.html',
    'Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação. Poderiam me ajudar a escolher a especialidade certa para o meu caso?',
  ],
  [
    'profissionais.html',
    'Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação. Qual profissional a equipe me indica para o meu caso?',
  ],
  [
    'qual-profissional-procurar.html',
    'Olá! Vim pelo site da ecooa e gostaria de uma ajuda para encontrar o profissional certo para o meu caso.',
  ],
  [
    'blog.html',
    'Olá! Vim pelo site da ecooa, estava lendo o editorial e gostaria de agendar uma avaliação. Poderiam me orientar sobre o melhor caminho?',
  ],
  [
    'blog/index.html',
    'Olá! Vim pelo site da ecooa, estava lendo o editorial e gostaria de agendar uma avaliação. Poderiam me orientar sobre o melhor caminho?',
  ],
  [
    'localizacao.html',
    'Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação presencial em Moinhos de Vento. Poderiam me orientar sobre o melhor caminho?',
  ],
  [
    'mentorias.html',
    'Olá! Vim pelo site da ecooa e tenho interesse nas mentorias da ecooa.cademy. Poderiam me contar os próximos passos?',
  ],
  [
    'sublocacao.html',
    'Olá! Vim pelo site da ecooa e tenho interesse na sublocação de sala. Poderiam me contar como funciona?',
  ],
]);

for (const a of AREAS) {
  POR_PAGINA.set(
    `especialidades/${a.slug}/index.html`,
    `Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação em ${a.nome.toLowerCase()}. Qual profissional a equipe me indica para o meu caso?`
  );
}
for (const art of ECOOA.artigos) {
  const au = ECOOA.profissionais.find((p) => p.slug === art.autor) || null;
  POR_PAGINA.set(
    `blog/${art.slug}/index.html`,
    au
      ? `Olá! Li o texto "${art.titulo}" no site da ecooa e gostaria de agendar uma consulta com ${au.nome}, que assina o texto. Poderiam me orientar sobre os próximos passos?`
      : `Olá! Li o texto "${art.titulo}" no site da ecooa e gostaria de uma avaliação sobre o tema. Qual profissional a equipe me indica?`
  );
}

function anda(d) {
  const r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r.push(...anda(p));
    else if (e.name.endsWith('.html') && !e.name.endsWith('.dc.html')) r.push(p);
  }
  return r;
}

/* os templates gravaram os links com codificacao estrita (o ponto de
   exclamacao vira %21); o encodeURIComponent do JS o deixa literal.
   Procuramos nas duas formas e gravamos sempre na estrita. */
const encStrito = (t) =>
  encodeURIComponent(t).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const agulhas = [encStrito(GERAL), encodeURIComponent(GERAL)];
let paginas = 0;
let trocas = 0;
for (const arq of anda(DEPLOY)) {
  const rel = path.relative(DEPLOY, arq).split(path.sep).join('/');
  const alvo = POR_PAGINA.get(rel);
  if (!alvo) continue;
  let s = fs.readFileSync(arq, 'utf8');
  let n = 0;
  for (const agulha of agulhas) {
    const k = s.split(agulha).length - 1;
    if (k) {
      s = s.replaceAll(agulha, encStrito(alvo));
      n += k;
    }
  }
  if (!n) continue;
  fs.writeFileSync(arq, s, 'utf8');
  paginas++;
  trocas += n;
}
console.log(`CTAs personalizados: ${trocas} links em ${paginas} páginas; a mensagem geral fica só onde não há contexto`);
