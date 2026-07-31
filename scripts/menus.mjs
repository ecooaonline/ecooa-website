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
const GATILHOS = {
  especialidades: 'especialidades',
  profissionais: 'profissionais',
  editorial: 'editorial',
  mais: 'mais',
};

/* Painel do editorial, pedido pelo dono em 2026-08-01. Os "mais repercutidos"
   sao tres artigos escolhidos; os posts do Instagram ganharao links diretos
   quando o dono os enviar (por ora, o perfil). */
const PAINEL_EDITORIAL = `<div style="background: var(--nuvem); border-bottom: 1px solid var(--rule); box-shadow: rgba(70, 68, 63, 0.14) 0px 26px 60px; animation: 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0s 1 normal both running ec-sobe;">
  <div style="max-width: 1600px; margin: 0px auto; padding: 38px clamp(20px, 3.2vw, 56px) 42px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1px; background: var(--stone);">
    <a href="blog.html" style="background: var(--nuvem); padding: 20px 22px; display: block;"><span style="display: block; font-family: var(--serif); font-size: 20px; color: var(--tinta);">últimas notícias</span><span style="display: block; margin-top: 4px; font-size: 11.5px; color: var(--legenda);">todos os textos do editorial</span></a>
    <a href="https://instagram.com/somos.ecooa" target="_blank" rel="noopener noreferrer" style="background: var(--nuvem); padding: 20px 22px; display: block;"><span style="display: block; font-family: var(--serif); font-size: 20px; color: var(--tinta);">últimas do Instagram</span><span style="display: block; margin-top: 4px; font-size: 11.5px; color: var(--legenda);">@somos.ecooa</span></a>
    <a href="blog/implante-hormonal-subcutaneo/" style="background: var(--nuvem); padding: 20px 22px; display: block;"><span style="display: block; font-size: 9.5px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--legenda);">mais repercutida</span><span style="display: block; margin-top: 8px; font-family: var(--serif); font-size: 16px; line-height: 1.3; color: var(--tinta);">Implante hormonal subcutâneo: o que é e quando tem indicação</span></a>
    <a href="blog/queda-de-cabelo-causas/" style="background: var(--nuvem); padding: 20px 22px; display: block;"><span style="display: block; font-size: 9.5px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--legenda);">mais repercutida</span><span style="display: block; margin-top: 8px; font-family: var(--serif); font-size: 16px; line-height: 1.3; color: var(--tinta);">Queda de cabelo: o que investigar antes de tratar</span></a>
    <a href="blog/canetas-emagrecedoras-nutricao/" style="background: var(--nuvem); padding: 20px 22px; display: block;"><span style="display: block; font-size: 9.5px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--legenda);">mais repercutida</span><span style="display: block; margin-top: 8px; font-family: var(--serif); font-size: 16px; line-height: 1.3; color: var(--tinta);">Canetas emagrecedoras: o que a nutrição precisa sustentar</span></a>
  </div>
</div>`;

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

  /* Pedido do dono em 2026-08-01: no desktop o submenu abre ao passar o mouse,
     sem exigir clique na seta. A palavra continua navegando no clique. No toque
     nada muda: abre pela seta. */
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var relogio = null;
    function abre(nome, gatilho) {
      window.clearTimeout(relogio);
      var painel = document.querySelector('[data-painel="' + nome + '"]');
      if (!painel) return;
      fecharTodos(nome);
      gatilho.setAttribute('aria-expanded', 'true');
      painel.hidden = false;
    }
    function agendaFechar() {
      window.clearTimeout(relogio);
      relogio = window.setTimeout(function () { fecharTodos(null); }, 220);
    }
    gatilhos.forEach(function (gatilho) {
      var nome = gatilho.getAttribute('data-menu');
      /* a zona de hover e o par palavra+seta quando ele existe */
      var zona = gatilho.parentElement && gatilho.parentElement.tagName === 'SPAN'
        ? gatilho.parentElement
        : gatilho;
      zona.addEventListener('mouseenter', function () { abre(nome, gatilho); });
      zona.addEventListener('mouseleave', agendaFechar);
    });
    painies.forEach(function (p) {
      p.addEventListener('mouseenter', function () { window.clearTimeout(relogio); });
      p.addEventListener('mouseleave', agendaFechar);
    });
  }

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

  // 1. gatilhos. Pedido do dono em 2026-07-31: clicar na PALAVRA navega para a
  //    pagina cheia; a seta ao lado abre o submenu. "mais" nao tem pagina, entao
  //    o botao inteiro segue abrindo o painel.
  const DESTINOS = {
    especialidades: 'especialidades.html',
    profissionais: 'profissionais.html',
    editorial: 'blog.html',
  };
  for (const [rotulo, chave] of Object.entries(GATILHOS)) {
    const re = new RegExp(
      `<(a|button)([^>]*?)>(\\s*${rotulo}\\s*(?:<[^>]+>[^<]*</[^>]+>\\s*)?)</\\1>`,
      'i'
    );
    html = html.replace(re, (m, tag, attrs, miolo) => {
      if (/data-menu=/.test(attrs)) return m;
      const limpo = attrs.replace(/\shref="[^"]*"/i, '');
      const destino = DESTINOS[chave];
      if (!destino) {
        return `<button type="button" data-menu="${chave}" aria-expanded="false"${limpo}>${miolo}</button>`;
      }
      // separa o texto da seta
      const soRotulo = miolo.replace(/<span[^>]*>[^<]*<\/span>/i, '').trim();
      return (
        `<span style="display:inline-flex; align-items:center; gap:4px;">` +
        `<a href="${destino}"${limpo}>${soRotulo}</a>` +
        `<button type="button" data-menu="${chave}" aria-expanded="false" aria-label="abrir opções de ${chave}"` +
        ` style="background:none; border:0; cursor:pointer; padding:8px 4px; font-size:8px; opacity:.55; color:inherit;">▼</button>` +
        `</span>`
      );
    });
  }

  // 2. injeta os painéis logo antes do fim do <header>, escondidos
  const fimHeader = html.indexOf('</header>');
  if (fimHeader > 0) {
    const blocos = Object.entries(painies)
      .map(([chave, markup]) =>
        markup
          .replace(/^<(\w+)/, `<$1 data-painel="${chave}" hidden`)
          // paginas reais por area, criadas em 2026-07-31
          .replace(/href="especialidades\.html#([a-z-]+)"/g, 'href="especialidades/$1/"')
      )
      .join('\n') + '\n' + PAINEL_EDITORIAL.replace(/^<div/, '<div data-painel="editorial" hidden');
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
