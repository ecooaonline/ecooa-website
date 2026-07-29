// Injeta nos HTML pré-renderizados os painéis de submenu capturados do runtime
// original, mais um JavaScript comum (sem eval) que os abre e fecha.
// Reproduz o comportamento do esboço aprovado. Nada de design é alterado:
// o markup dos painéis é exatamente o que o runtime desenhava.
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const painies = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src-site-3/menus.json'), 'utf8'));

// rótulo do gatilho -> chave do painel
const GATILHOS = { especialidades: 'especialidades', profissionais: 'profissionais', mais: 'mais' };

const JS = `
<script>
/* Submenus do cabecalho. JavaScript comum, sem eval, compativel com a politica
   de seguranca do dominio. Abre no clique, fecha no clique fora, no Escape e ao
   abrir outro. Mantem aria-expanded sincronizado. */
(function () {
  var gatilhos = Array.prototype.slice.call(document.querySelectorAll('[data-menu]'));
  var painies = Array.prototype.slice.call(document.querySelectorAll('[data-painel]'));
  if (!gatilhos.length) return;

  function fecharTodos(exceto) {
    painies.forEach(function (p) {
      if (p.getAttribute('data-painel') !== exceto) p.hidden = true;
    });
    gatilhos.forEach(function (g) {
      if (g.getAttribute('data-menu') !== exceto) g.setAttribute('aria-expanded', 'false');
    });
  }

  gatilhos.forEach(function (gatilho) {
    var nome = gatilho.getAttribute('data-menu');
    var painel = document.querySelector('[data-painel="' + nome + '"]');
    if (!painel) return;
    gatilho.addEventListener('click', function (e) {
      e.preventDefault();
      var aberto = gatilho.getAttribute('aria-expanded') === 'true';
      fecharTodos(aberto ? null : nome);
      gatilho.setAttribute('aria-expanded', aberto ? 'false' : 'true');
      painel.hidden = aberto;
    });
  });

  document.addEventListener('click', function (e) {
    var dentro = e.target.closest && e.target.closest('[data-painel], [data-menu]');
    if (!dentro) fecharTodos(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharTodos(null);
  });
})();
</script>
`;

const paginas = fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'));
let tocadas = 0;

for (const nome of paginas) {
  const arq = path.join(DEPLOY, nome);
  let html = fs.readFileSync(arq, 'utf8');
  if (html.includes('data-painel=')) continue; // já aplicado

  const original = html;

  // 1. marca os gatilhos: <a href="especialidades.html" ...>especialidades ▾</a>
  for (const [rotulo, chave] of Object.entries(GATILHOS)) {
    const re = new RegExp(
      `<(a|button)([^>]*?)>(\\s*${rotulo}\\s*(?:<[^>]+>[^<]*</[^>]+>\\s*)?)</\\1>`,
      'i'
    );
    html = html.replace(re, (m, tag, attrs, miolo) => {
      if (/data-menu=/.test(attrs)) return m;
      const limpo = attrs.replace(/\shref="[^"]*"/i, '');
      return `<button type="button" data-menu="${chave}" aria-expanded="false"${limpo}>${miolo}</button>`;
    });
  }

  // 2. injeta os painéis logo antes do fim do <header>, escondidos
  const fimHeader = html.indexOf('</header>');
  if (fimHeader > 0) {
    const blocos = Object.entries(painies)
      .map(([chave, markup]) =>
        markup.replace(/^<(\w+)/, `<$1 data-painel="${chave}" hidden`)
      )
      .join('\n');
    html = html.slice(0, fimHeader) + blocos + '\n' + html.slice(fimHeader);
  }

  // 3. o script, antes do </body>
  html = html.replace('</body>', JS + '</body>');

  if (html !== original) {
    fs.writeFileSync(arq, html, 'utf8');
    tocadas++;
  }
}

console.log(`submenus religados em ${tocadas} páginas`);
