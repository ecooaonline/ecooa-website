// Converte os gatilhos de submenu do cabeçalho (que na versão pré-renderizada
// são <button> sem destino) em <a> com href, preservando classe, estilo e texto.
// Sem isso, as páginas de especialidades e profissionais ficam inalcançáveis.
// O texto visível e a aparência não mudam.
import fs from 'node:fs';
import path from 'node:path';

const DEPLOY = '/home/user/ecooa-website/deploy';

// rótulo do botão -> destino
const DESTINOS = {
  especialidades: 'especialidades.html',
  profissionais: 'profissionais.html',
};

const paginas = fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'));
let total = 0;

for (const nome of paginas) {
  const arq = path.join(DEPLOY, nome);
  let html = fs.readFileSync(arq, 'utf8');
  const original = html;

  for (const [rotulo, destino] of Object.entries(DESTINOS)) {
    // <button ...>rotulo ...</button>  ->  <a href="destino" ...>rotulo ...</a>
    const re = new RegExp(
      `<button([^>]*?)>(\\s*${rotulo}\\s*(?:<[^>]+>[^<]*</[^>]+>\\s*)?)</button>`,
      'gi'
    );
    html = html.replace(re, (m, attrs, miolo) => {
      if (/href=/.test(attrs)) return m;
      const limpo = attrs
        .replace(/\stype="button"/i, '')
        .replace(/\saria-expanded="[^"]*"/i, '')
        .replace(/\saria-haspopup="[^"]*"/i, '');
      total++;
      return `<a href="${destino}"${limpo}>${miolo}</a>`;
    });
  }

  if (html !== original) fs.writeFileSync(arq, html, 'utf8');
}

console.log(`gatilhos de submenu convertidos em link: ${total}`);
