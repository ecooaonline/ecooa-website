// Religa a camada de conversao e de filtros que a pre-renderizacao matou.
//
// O site 3.0 declarava 32 handlers no template (onClick/onSubmit/onChange).
// Pre-renderizar a 1440px gravou apenas o HTML resultante e descartou todos.
// Etapas anteriores religaram o cabecalho, o mosaico e o menu do celular.
// Este script religa o que restava e que vale dinheiro:
//
//   Rodape.dc.html:128   inscrever  -> newsletter, nas 11 paginas
//   mentorias.html:208   enviar     -> lead de mentoria
//   sublocacao.html:215  enviar     -> lead de sublocacao
//   profissionais.html:216 aplicar  -> filtro por grupo
//   blog.html:264        aplicar    -> filtro por area
//
// Antes desta correcao, enviar qualquer um dos tres formularios recarregava a
// pagina como GET, perdia tudo que a pessoa digitou e nao abria WhatsApp nem
// e-mail. Prova em /tmp/.../prova-forms.mjs.
//
// A logica e a mesma do template original, portada para JavaScript comum, sem
// eval, para respeitar a politica de seguranca do dominio.
//
// Uso: node scripts/conversao.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const PORTA = 4392;
const MARCA = 'data-conv-pronto';
const WA = '5551991460909';
const EMAIL = 'ecooa.adm@gmail.com';

/* ── JS do formulario de newsletter (rodape, todas as paginas) ── */
const JS_NEWS = `<script>
/* Rodape: inscricao no editorial. Portado de Rodape.dc.html:128.
   Sem isto o submit recarrega a pagina e o e-mail digitado se perde. */
(function () {
  var campo = document.getElementById('ec-news');
  if (!campo) return;
  var form = campo.closest('form');
  if (!form) return;
  var botao = form.querySelector('button[type=submit]');
  var aviso = document.querySelector('[data-news-aviso]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valor = campo.value ? campo.value.trim() : '';
    if (!valor) { campo.focus(); return; }
    var corpo = 'Gostaria de assinar o editorial da ecooa.\\n\\nE-mail para inscricao: ' + valor;
    window.location.href =
      'mailto:${EMAIL}?subject=' + encodeURIComponent('Inscricao no editorial ecooa') +
      '&body=' + encodeURIComponent(corpo);
    if (botao) botao.textContent = 'e-mail aberto';
    if (aviso) {
      aviso.textContent =
        'Abrimos um e-mail ja preenchido para voce enviar. A inscricao vale quando ele chegar.';
    }
  });
})();
</script>`;

/* ── JS dos formularios de lead (mentorias e sublocacao) ── */
function jsLead(prefixo, cabecalho, rotulos, rotuloFeito, avisoFeito) {
  const campos = rotulos.map(([id, rot]) => `['${prefixo}-${id}', '${rot}']`).join(', ');
  return `<script>
/* Formulario de interesse. Portado do template original: monta o texto e abre
   a conversa no WhatsApp com tudo preenchido. Sem isto o submit recarregava a
   pagina e os cinco campos se perdiam sem abrir nada. */
(function () {
  var primeiro = document.getElementById('${prefixo}-nome');
  if (!primeiro) return;
  var form = primeiro.closest('form');
  if (!form) return;
  var botao = form.querySelector('button[type=submit]');
  var aviso = document.querySelector('[data-lead-aviso]');
  var CAMPOS = [${campos}];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) {
      var c = document.getElementById(id);
      var t = c && c.value ? c.value.trim() : '';
      return t || 'nao informado';
    };
    var texto = '${cabecalho}';
    for (var i = 0; i < CAMPOS.length; i++) {
      texto += (i === 0 ? '\\n\\n' : '\\n') + CAMPOS[i][1] + ': ' + v(CAMPOS[i][0]);
    }
    /* Ancora em vez de window.open: com 'noopener' o window.open retorna null
       por especificacao, o que torna impossivel distinguir sucesso de bloqueio.
       Um clique em ancora dentro do gesto do usuario nao e bloqueado e ja
       carrega o noopener. */
    var a = document.createElement('a');
    a.href = 'https://wa.me/${WA}?text=' + encodeURIComponent(texto);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    /* remover a ancora no mesmo tick cancela a navegacao no Chromium.
       Comprovado em navegador: com removeChild sincrono, nada abre. */
    window.setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 0);

    if (botao) botao.textContent = '${rotuloFeito}';
    if (aviso) aviso.textContent = '${avisoFeito}';
  });
})();
</script>`;
}

/* ── JS dos filtros ── */
const JS_FILTROS = `<script>
/* Filtros por grupo. Portado de profissionais.html:216 e blog.html:264.
   Mostra e esconde as fichas ja presentes na pagina, sem recarregar nada.
   Em duas colunas a alternancia texto/retrato e recalculada sobre a lista
   visivel, senao as fichas ficam desalinhadas ao filtrar. */
(function () {
  var botoes = [].slice.call(document.querySelectorAll('[data-filtro]'));
  var itens = [].slice.call(document.querySelectorAll('[data-item-grupo]'));
  if (!botoes.length || !itens.length) return;

  var ATIVO = { bg: '#63615C', cor: '#F0EEE9' };
  var INATIVO = { bg: '#FAF9F7', cor: '#63615C' };

  function alterna(grupo) {
    botoes.forEach(function (b) {
      var on = b.getAttribute('data-filtro') === grupo;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = on ? ATIVO.bg : INATIVO.bg;
      b.style.color = on ? ATIVO.cor : INATIVO.cor;
    });

    var visiveis = 0;
    itens.forEach(function (el) {
      var grupos = (el.getAttribute('data-item-grupo') || '').split('|');
      var mostra = grupo === 'todos' || grupos.indexOf(grupo) >= 0;
      el.hidden = !mostra;
      /* o par de fichas do desktop vive em dois nos irmaos */
      var irmao = el.getAttribute('data-item-par');
      if (irmao) {
        var outro = document.querySelector('[data-item-idpar="' + irmao + '"]');
        if (outro) outro.hidden = !mostra;
      }
      if (mostra) visiveis++;
    });

    /* alternancia recalculada sobre o que ficou visivel */
    var pares = [].slice.call(document.querySelectorAll('[data-item-grupo]')).filter(function (e) {
      return !e.hidden;
    });
    pares.forEach(function (el, i) {
      var irmao = el.getAttribute('data-item-par');
      if (!irmao) return;
      var outro = document.querySelector('[data-item-idpar="' + irmao + '"]');
      if (!outro) return;
      /* linha par: retrato primeiro. linha impar: texto primeiro. */
      var fotoAntes = i % 2 === 0;
      var foto = el.querySelector('img') ? el : outro;
      var texto = foto === el ? outro : el;
      foto.style.order = fotoAntes ? '1' : '2';
      texto.style.order = fotoAntes ? '2' : '1';
    });

    var contador = document.querySelector('[data-filtro-contador]');
    if (contador) contador.textContent = String(visiveis);
    var vazio = document.querySelector('[data-filtro-vazio]');
    if (vazio) vazio.hidden = visiveis > 0;
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-filtro');
      alterna(g);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', g === 'todos' ? window.location.pathname : '#' + g);
      }
    });
  });

  /* estado inicial pelo hash, como no original */
  var h = (window.location.hash || '').replace('#', '');
  if (h && botoes.some(function (b) { return b.getAttribute('data-filtro') === h; })) alterna(h);
})();
</script>`;

/* ── CSS de apoio ── */
const CSS = `<style>
/* elementos escondidos pelo filtro saem do grid, nao ficam invisiveis ocupando espaco */
[data-item-grupo][hidden], [data-item-idpar][hidden], [data-filtro-vazio][hidden] { display: none !important; }
[data-filtro] { transition: background .18s ease, color .18s ease; }
[data-filtro-vazio] {
  grid-column: 1 / -1; padding: clamp(30px, 4vw, 56px);
  background: #FAF9F7; color: #66645E; font-size: 15px; line-height: 1.6;
}
</style>`;

/* ── servidor local ── */
const servidor = require('child_process').spawn('python3', ['-m', 'http.server', String(PORTA)], {
  cwd: DEPLOY,
  detached: true,
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 2200));

const relatorio = [];
try {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });

  for (const nome of fs.readdirSync(DEPLOY).filter((f) => f.endsWith('.html'))) {
    if (nome.endsWith('.dc.html')) continue;
    const arq = path.join(DEPLOY, nome);
    if (fs.readFileSync(arq, 'utf8').includes(MARCA)) continue;

    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${PORTA}/${nome}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);

    const feito = await p.evaluate(() => {
      const feito = [];

      /* 1. aviso do rodape: o original trocava a frase apos enviar */
      const news = document.getElementById('ec-news');
      if (news) {
        const form = news.closest('form');
        const bloco = form && form.parentElement;
        const aviso = bloco
          ? [...bloco.querySelectorAll('p, span')].find(
              (x) => /Guardamos apenas o seu e-mail/i.test(x.textContent) && !x.children.length
            )
          : null;
        if (aviso) aviso.setAttribute('data-news-aviso', '');
        feito.push('newsletter');
      }

      /* 2. aviso dos formularios de lead */
      const lead = document.getElementById('ec-nome') || document.getElementById('sb-nome');
      if (lead) {
        const form = lead.closest('form');
        const pai = form && form.parentElement;
        const aviso = pai
          ? [...pai.querySelectorAll('p, span')].find(
              (x) =>
                x.children.length === 0 &&
                x.textContent.trim().length > 30 &&
                /whatsapp|resposta|conversa|contato/i.test(x.textContent)
            )
          : null;
        if (aviso) aviso.setAttribute('data-lead-aviso', '');
        feito.push('formulário de lead');
      }

      /* 3. filtros: marca botoes e itens */
      const dados = window.ECOOA || {};
      const botoes = [...document.querySelectorAll('button[aria-pressed]')];
      if (botoes.length >= 3 && dados.grupos) {
        // mapa "nome exibido" -> slug
        const mapa = { todos: 'todos' };
        (dados.grupos || []).forEach((g) => {
          mapa[g.nome] = g.slug;
        });
        let marcados = 0;
        botoes.forEach((b) => {
          const rot =
            b.textContent.trim().split(/\s+/).slice(0, -1).join(' ') || b.textContent.trim();
          const slug = mapa[rot] !== undefined ? mapa[rot] : mapa[b.textContent.trim()];
          if (slug !== undefined) {
            b.setAttribute('data-filtro', slug);
            marcados++;
          }
        });

        // itens: cada retrato tem data-perfil; o par de texto e o irmao
        const porSlug = {};
        (dados.profissionais || []).forEach((x) => {
          porSlug[x.slug] = x;
        });
        const grade = document.querySelector('[data-duas-colunas]');
        if (grade && marcados) {
          const filhos = [...grade.children];
          let n = 0;
          for (let i = 0; i < filhos.length; i += 2) {
            const a = filhos[i];
            const c = filhos[i + 1];
            if (!c) break;
            const bt = a.querySelector('[data-perfil]') || c.querySelector('[data-perfil]');
            if (!bt) continue;
            const pro = porSlug[bt.getAttribute('data-perfil')];
            if (!pro) continue;
            const id = 'par-' + n;
            a.setAttribute('data-item-grupo', pro.grupo);
            a.setAttribute('data-item-par', id);
            c.setAttribute('data-item-idpar', id);
            n++;
          }
          if (n) feito.push(`filtro de profissionais (${marcados} botões, ${n} fichas)`);
        }
      }

      /* 4. filtros do blog: cada ficha e um botao com a area no comeco do texto */
      const filtrosBlog = [...document.querySelectorAll('button[aria-pressed]')];
      if (
        filtrosBlog.length >= 3 &&
        (window.ECOOA || {}).artigos &&
        !document.querySelector('[data-duas-colunas]')
      ) {
        const areas = [...new Set(window.ECOOA.artigos.map((a) => a.area))];
        let marcados = 0;
        filtrosBlog.forEach((b) => {
          const rot = b.textContent.trim();
          if (rot === 'todos') {
            b.setAttribute('data-filtro', 'todos');
            marcados++;
            return;
          }
          if (areas.indexOf(rot) >= 0) {
            b.setAttribute('data-filtro', rot);
            marcados++;
          }
        });
        const porTitulo = {};
        window.ECOOA.artigos.forEach((a) => {
          porTitulo[a.titulo] = a;
        });
        let n = 0;
        // os cards viraram links para as paginas reais dos artigos
        [...document.querySelectorAll('a, button')].forEach((bt) => {
          if (bt.closest('header, footer')) return;
          const t = bt.textContent.replace(/\s+/g, ' ').trim();
          const achado = Object.keys(porTitulo).find((tit) => t.indexOf(tit) >= 0);
          if (!achado) return;
          bt.setAttribute('data-item-grupo', porTitulo[achado].area);
          n++;
        });
        if (n) feito.push(`filtro do editorial (${marcados} botões, ${n} fichas)`);
      }

      return feito;
    });

    let html = await p.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
    const pedacos = [CSS];
    if (feito.some((f) => f === 'newsletter')) pedacos.push(JS_NEWS);
    if (nome === 'mentorias.html') {
      pedacos.push(
        jsLead(
          'ec',
          'Ola, tenho interesse na ecooa.cademy.',
          [
            ['nome', 'Nome'],
            ['mail', 'E-mail'],
            ['classe', 'Formacao'],
            ['prog', 'Interesse'],
            ['msg', 'O que busco'],
          ],
          'conversa aberta',
          'Abrimos a conversa no WhatsApp com o seu texto ja preenchido. Basta enviar.'
        )
      );
    }
    if (nome === 'sublocacao.html') {
      pedacos.push(
        jsLead(
          'sb',
          'Ola, tenho interesse na sublocacao de sala na ecooa.',
          [
            ['nome', 'Nome'],
            ['mail', 'E-mail'],
            ['classe', 'Formacao e registro'],
            ['uso', 'Uso pretendido'],
            ['msg', 'Como trabalho hoje'],
          ],
          'conversa aberta',
          'Abrimos a conversa no WhatsApp com o seu texto ja preenchido. Basta enviar.'
        )
      );
    }
    if (feito.some((f) => f.startsWith('filtro'))) pedacos.push(JS_FILTROS);

    html = html.replace('</head>', pedacos[0] + '\n</head>');
    html = html.replace('</body>', pedacos.slice(1).join('\n') + '\n</body>');
    html = html.replace('<html', `<html ${MARCA}`);
    fs.writeFileSync(arq, html, 'utf8');
    relatorio.push(`${nome.padEnd(34)} ${feito.join(', ') || '-'}`);
    await p.close();
  }
  await b.close();
} finally {
  try {
    process.kill(-servidor.pid);
  } catch {
    /* servidor ja encerrado */
  }
}

console.log('conversão e filtros religados:');
relatorio.forEach((l) => console.log('    ' + l));
