// Religa o mosaico de profissionais da home: hover com véu e legenda, modal de
// perfil, foco preso e scroll travado. JavaScript comum, sem eval, compatível
// com a política de segurança do domínio.
//
// O visual já existe no HTML pré-renderizado (31 botões, véu com o degradê
// correto, legenda). O que este script adiciona é o comportamento, mais o
// modal, cujos estilos foram extraídos do runtime original (src-site-3/modal.json)
// para não reinventar o design.
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');

/* ── mapa nome -> slug, lido dos dados reais ── */
const dados = fs.readFileSync(path.join(DEPLOY, 'dados-ecooa.js'), 'utf8');
const porNome = new Map();
for (const m of dados.matchAll(/\{ slug:'([^']+)', nome:'([^']+)'/g)) {
  porNome.set(m[2], m[1]);
}

const CSS = `
<style>
/* Mosaico de profissionais: hover no desktop, legenda sempre visivel no toque. */
@media (min-width: 1024px) {
  [data-perfil]:hover [data-veu],
  [data-perfil]:focus-visible [data-veu] { opacity: 1 !important; }
  [data-perfil]:hover [data-legenda],
  [data-perfil]:focus-visible [data-legenda] {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
}
/* Sem hover em tela de toque: sem isto a secao vira 31 rostos anonimos. */
@media (max-width: 1023px) {
  [data-perfil] [data-veu] { opacity: 1 !important; transition: none !important; }
  [data-perfil] [data-legenda] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
[data-perfil]:focus-visible { outline: 2px solid #5C5A55; outline-offset: 2px; }

/* Modal de perfil */
.pf-ov {
  position: fixed; inset: 0; z-index: 120;
  background: rgba(43, 41, 38, .5); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: clamp(12px, 3vw, 52px);
  opacity: 0; transition: opacity .3s cubic-bezier(.16, 1, .3, 1);
}
.pf-ov[hidden] { display: none; }
.pf-ov.aberto { opacity: 1; }
.pf-pn {
  position: relative; width: 100%; max-width: 1080px; max-height: 92vh;
  overflow-y: auto; background: #fdfdfc;
  box-shadow: rgba(43, 41, 38, .34) 0 40px 90px;
  display: grid; grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
  transform: translateY(16px); transition: transform .3s cubic-bezier(.16, 1, .3, 1);
}
.pf-ov.aberto .pf-pn { transform: translateY(0); }
.pf-pn:focus { outline: none; }
.pf-x {
  position: absolute; top: 22px; right: 22px; z-index: 3;
  width: 44px; height: 44px; border-radius: 999px; border: 0; cursor: pointer;
  background: #f0eee9; color: #2b2926; font-size: 19px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  box-shadow: rgba(43, 41, 38, .16) 0 6px 18px;
}
.pf-x:focus-visible { outline: 2px solid #5C5A55; outline-offset: 2px; }
.pf-foto { position: relative; min-height: 340px; background: #e9e7e2; }
.pf-foto img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center top;
}
.pf-vazia {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: #e9e7e2; color: #5c5a55;
  font-family: var(--serif, Georgia, serif); font-size: 88px;
  box-shadow: inset 0 0 40px rgba(43, 41, 38, .12);
}
.pf-corpo { padding: clamp(30px, 4vw, 58px) clamp(24px, 3.4vw, 56px); }
.pf-marca {
  margin: 0; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #5C5A55;
}
.pf-nome {
  margin: 12px 0 0; font-family: var(--serif, Georgia, serif); font-weight: 400;
  font-size: clamp(29px, 3.3vw, 45px); line-height: 1.06; letter-spacing: -.015em; color: #2b2926;
}
.pf-bio { margin: 20px 0 0; max-width: 46ch; font-size: 15.5px; line-height: 1.68; color: #46443f; }
.pf-blocos {
  margin-top: 30px; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px;
  border-top: 1px solid rgba(134, 131, 111, .24); padding-top: 22px;
}
.pf-bloco dt {
  font-size: 9.5px; letter-spacing: .16em; text-transform: uppercase; color: #5C5A55;
  margin-bottom: 5px;
}
.pf-bloco dd { margin: 0; font-size: 14px; line-height: 1.6; color: #2b2926; }
.pf-rot {
  margin: 30px 0 0; font-size: 9.5px; letter-spacing: .16em;
  text-transform: uppercase; color: #5C5A55;
}
.pf-conduta { margin: 14px 0 0; max-width: 48ch; font-size: 15px; line-height: 1.68; color: #46443f; }
.pf-conduta p { margin: 0; }
.pf-conduta p + p { margin-top: 13px; }
.pf-cta {
  margin-top: 32px; display: inline-flex; align-items: center; min-height: 52px;
  padding: 0 32px; border-radius: 999px; background: #2b2926; color: #f0eee9;
  font-size: 11.5px; letter-spacing: .14em; text-decoration: none;
}
@media (max-width: 860px) {
  .pf-pn { grid-template-columns: 1fr; max-height: 92vh; }
  .pf-foto { aspect-ratio: 4 / 5; min-height: 0; max-height: 44vh; }
}
</style>
`;

const MODAL = `
<div class="pf-ov" id="pf-ov" hidden>
  <div class="pf-pn" id="pf-pn" role="dialog" aria-modal="true" aria-labelledby="pf-nome" tabindex="-1">
    <button type="button" class="pf-x" id="pf-x" aria-label="Fechar perfil">&times;</button>
    <div class="pf-foto" id="pf-foto"></div>
    <div class="pf-corpo">
      <p class="pf-marca" id="pf-marca"></p>
      <h2 class="pf-nome" id="pf-nome"></h2>
      <p class="pf-bio" id="pf-bio"></p>
      <dl class="pf-blocos" id="pf-blocos"></dl>
      <p class="pf-rot">como conduz o cuidado</p>
      <div class="pf-conduta" id="pf-conduta"></div>
      <a class="pf-cta" id="pf-cta" href="#" target="_blank" rel="noopener noreferrer"></a>
    </div>
  </div>
</div>
`;

const JS = `
<script>
/* Modal de perfil do profissional. Dados de window.ECOOA.profissionais. */
(function () {
  var ov = document.getElementById('pf-ov');
  var pn = document.getElementById('pf-pn');
  if (!ov || !pn || !window.ECOOA || !window.ECOOA.profissionais) return;

  var porSlug = {};
  window.ECOOA.profissionais.forEach(function (p) { porSlug[p.slug] = p; });
  var origem = null;

  function textoRegistro(p) {
    /* decisao do dono em 2026-07-31: numero valido aparece limpo; sem numero,
       o bloco inteiro some (bloco() ja descarta valor vazio) */
    return p.estado === 'a-adicionar' ? '' : p.registro;
  }

  function bloco(rotulo, valor) {
    if (!valor) return '';
    var d = document.createElement('div');
    d.className = 'pf-bloco';
    var dt = document.createElement('dt');
    dt.textContent = rotulo;
    var dd = document.createElement('dd');
    dd.textContent = valor;
    d.appendChild(dt); d.appendChild(dd);
    return d;
  }

  function abrir(slug, gatilho) {
    var p = porSlug[slug];
    if (!p) return;
    origem = gatilho;

    var foto = document.getElementById('pf-foto');
    foto.innerHTML = '';
    if (p.foto) {
      var img = document.createElement('img');
      img.src = p.foto;
      img.alt = 'Retrato de ' + p.nome;
      foto.appendChild(img);
    } else {
      var vazia = document.createElement('span');
      vazia.className = 'pf-vazia';
      vazia.textContent = (p.nome || '?').charAt(0);
      foto.appendChild(vazia);
    }

    document.getElementById('pf-marca').textContent = p.marca || '';
    document.getElementById('pf-nome').textContent = p.nome || '';
    document.getElementById('pf-bio').textContent = p.bio || '';
    // A conduta guarda os paragrafos separados por linha em branco.
    // textContent por paragrafo, nunca innerHTML: o dado nunca vira marcacao.
    var cond = document.getElementById('pf-conduta');
    cond.innerHTML = '';
    String(p.conduta || '').split(/\\n\\s*\\n/).forEach(function (trecho) {
      var t = trecho.trim();
      if (!t) return;
      var par = document.createElement('p');
      par.textContent = t;
      cond.appendChild(par);
    });

    var blocos = document.getElementById('pf-blocos');
    blocos.innerHTML = '';
    [['formação', p.classe], ['registro', textoRegistro(p)], ['área', p.area], ['atendimento', p.atendimento]]
      .forEach(function (par) {
        var b = bloco(par[0], par[1]);
        if (b) blocos.appendChild(b);
      });

    var cta = document.getElementById('pf-cta');
    cta.textContent = 'agendar com ' + (p.primeiro || p.nome);
    cta.href =
      'https://wa.me/5551991460909?text=' +
      encodeURIComponent('Olá, gostaria de agendar com ' + p.nome + ' na ecooa.');

    ov.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { ov.classList.add('aberto'); pn.focus(); });
  }

  function fechar() {
    if (ov.hidden) return;
    ov.classList.remove('aberto');
    document.documentElement.style.overflow = '';
    window.setTimeout(function () { ov.hidden = true; }, 300);
    if (origem) { origem.focus(); origem = null; }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-perfil]');
    if (btn) { abrir(btn.getAttribute('data-perfil'), btn); return; }
    if (e.target === ov) fechar();
  });

  document.getElementById('pf-x').addEventListener('click', fechar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { fechar(); return; }
    if (e.key !== 'Tab' || ov.hidden) return;
    var focaveis = pn.querySelectorAll('a[href], button:not([disabled])');
    if (!focaveis.length) return;
    var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });
})();
</script>
`;

/* ── aplica ── */
let tocadas = 0;
for (const nome of fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'))) {
  const arq = path.join(DEPLOY, nome);
  let html = fs.readFileSync(arq, 'utf8');
  if (html.includes('data-perfil=')) continue;
  const original = html;

  // marca cada botão do mosaico com o slug, e as duas camadas internas
  html = html.replace(
    /<button([^>]*?)aria-label="Ver o perfil de ([^,"]+)[^"]*"([^>]*?)>([\s\S]*?)<\/button>/g,
    (m, a1, nomeProf, a2, miolo) => {
      const slug = porNome.get(nomeProf.trim());
      if (!slug) return m;
      let dentro = miolo;
      // 1a span = véu (tem o gradiente), 2a span = legenda (tem padding 12px)
      dentro = dentro.replace(
        /<span([^>]*?)style="([^"]*linear-gradient\(to top[^"]*)"/,
        '<span data-veu$1style="$2"'
      );
      dentro = dentro.replace(
        /<span([^>]*?)style="([^"]*padding: 12px 12px 14px[^"]*)"/,
        '<span data-legenda$1style="$2"'
      );
      tocadas++;
      return `<button${a1}aria-label="Ver o perfil de ${nomeProf}"${a2} data-perfil="${slug}">${dentro}</button>`;
    }
  );

  if (html.includes('data-perfil=')) {
    html = html.replace('</body>', MODAL + JS + '</body>');
    html = html.replace('</head>', CSS + '</head>');
  }

  if (html !== original) fs.writeFileSync(arq, html, 'utf8');
}

console.log(`botões do mosaico religados: ${tocadas}`);
