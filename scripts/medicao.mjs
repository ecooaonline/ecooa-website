// Camada de medição do site publicado.
//
// Diagnóstico que originou este script: o site NÃO tinha analytics nenhum. O
// contêiner GTM-TSR4GDMK aparece em dez documentos de docs/ e em zero páginas
// publicadas. Sem medição não há como saber qual página traz paciente, qual
// artigo converte, nem qual profissional é procurado, e sem isso não existe
// caminho para o topo.
//
// Decisões tomadas aqui, com o dono ausente:
//
//  1. LGPD primeiro. Consent Mode v2 com TODO armazenamento negado por padrão.
//     Nenhum cookie de análise antes do aceite. Um aviso discreto pede a
//     escolha, que fica salva em localStorage. Recusar é tão fácil quanto
//     aceitar. Quem recusa não carrega o GTM, ponto: o aviso diz que nada é
//     ativado sem a escolha, e isso precisa ser verdade. Ainda NÃO existe um
//     ponto de troca da decisão depois do aceite, e isso está registrado em
//     docs/mythos/PENDENCIAS-DO-DONO.md porque exige elemento visível novo.
//  2. Performance preservada. O GTM só entra depois do primeiro gesto real
//     (rolagem, toque, clique, tecla) ou 4s após o load, o que vier primeiro.
//     Assim ele nunca disputa banda com o LCP. É o "interaction-only" que o
//     projeto já documentava e nunca teve.
//  3. O dataLayer registra a conversão de verdade desta clínica: clique de
//     WhatsApp com o contexto (página, profissional, área), envio dos três
//     formulários, e o uso do ecooa.match (termo buscado, bloco entendido,
//     área e profissionais indicados). Sem isso o GTM ficaria vendo pageview.
//  4. Nada de dado de saúde no evento. O termo buscado no match É informação
//     sensível, então ele NÃO é enviado; enviamos apenas o bloco de queixa
//     entendido, que é categoria editorial e não declaração sobre a pessoa.
//
// O dono precisa configurar as tags dentro do painel do GTM. Consta em
// docs/mythos/PENDENCIAS-DO-DONO.md.
//
// Roda DEPOIS de estruturados.mjs. Uso: node scripts/medicao.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const GTM = 'GTM-TSR4GDMK';
const MARCA = 'data-medicao-ecooa';

/* ── CHAVE DE LIGAR A MEDIÇÃO ──────────────────────────────────────────
 *
 * Hoje: DESLIGADA. Nada aparece na tela e o GTM não carrega.
 *
 * Por que nasceu desligada, e o que já mudou desde então.
 *
 * Motivo 1, RESOLVIDO em 2026-08-02: no celular o aviso cobria o botão
 * flutuante de WhatsApp, que é o único caminho de conversão do site. A banca de
 * valor chamou de defeito crítico, com razão. Agora, em tela estreita, o aviso
 * sobe acima do botão e deixa a direita livre.
 *
 * Motivo 2, que era FALSO: eu afirmei que a CSP de produção não tinha
 * `connect-src` e por isso bloquearia o GA4. Parti de uma anotação antiga de
 * outra sessão e não podia verificar, porque este ambiente não alcança o
 * domínio. O dono conferiu no securityheaders.com em 2026-08-02: a CSP real tem
 * `connect-src 'self' https: wss:`, libera `googletagmanager` em `script-src` e
 * em `frame-src`, e o site tira nota A. **A medição nunca esteve bloqueada.**
 *
 * O dono também pediu, em 2026-08-01, que nenhuma mudança de aparência fosse
 * feita sem a ordem dele, e por isso a chave segue desligada.
 *
 * Falta só uma coisa para ligar:
 *   1. criar as tags no contêiner GTM-TSR4GDMK (sem elas o contêiner carrega e
 *      não mede nada);
 *   2. trocar a linha abaixo para true e rodar `node scripts/gerar-site.mjs`.
 *
 * O dataLayer e os eventos continuam instalados e funcionando de qualquer
 * forma: o que a chave controla é o aviso na tela e o carregamento do GTM.
 */
const MEDICAO_ATIVA = false;

const JS = String.raw`
<script ${MARCA} data-medicao-ativa="${MEDICAO_ATIVA}">
/* Medição ecooa. JavaScript comum, sem eval, sem dependência externa além do
   próprio GTM, que só carrega depois do consentimento e do primeiro gesto. */
(function () {
  /* chave de ligar, controlada em scripts/medicao.mjs */
  var ATIVA = ${MEDICAO_ATIVA};
  var CHAVE = 'ecooa-consentimento';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.ecooaGtag = gtag;

  /* Consent Mode v2: tudo negado antes de qualquer escolha. */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function lido() {
    try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function grava(v) {
    try { localStorage.setItem(CHAVE, v); } catch (e) { /* modo privado */ }
  }
  function concede() {
    gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
  }
  if (lido() === 'aceito') concede();

  /* ── carregamento tardio do GTM ── */
  var carregado = false;
  function carregaGTM() {
    if (carregado) return;
    carregado = true;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=${GTM}';
    document.head.appendChild(s);
  }
  /* Quem recusou nao carrega o GTM. O aviso diz "nada e ativado sem a sua
     escolha", e carregar o contentor mesmo apos a recusa faria da frase uma
     mentira, ainda que o Consent Mode bloqueasse o armazenamento. */
  function podeCarregar() { return ATIVA && lido() === 'aceito'; }
  function tentaCarregar() { if (podeCarregar()) carregaGTM(); }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, tentaCarregar, { once: true, passive: true });
  });
  if (document.readyState === 'complete') setTimeout(tentaCarregar, 4000);
  else window.addEventListener('load', function () { setTimeout(tentaCarregar, 4000); });

  /* ── contexto da página, para todo evento nascer situado ── */
  var pagina = (location.pathname.replace(/^\/|\/$/g, '') || 'home');
  var perfil = /^profissionais\/(.+)$/.exec(pagina);
  var area = /^especialidades\/(.+)$/.exec(pagina);
  var artigo = /^blog\/(.+)$/.exec(pagina);
  var CTX = {
    pagina: pagina,
    tipo: perfil ? 'perfil' : area ? 'area' : artigo ? 'artigo' : 'institucional',
    profissional: perfil ? perfil[1] : undefined,
    area: area ? area[1] : undefined,
    artigo: artigo ? artigo[1] : undefined
  };
  function evento(nome, extra) {
    var d = { event: nome };
    for (var k in CTX) if (CTX[k]) d[k] = CTX[k];
    for (var j in extra) if (extra[j] !== undefined) d[j] = extra[j];
    window.dataLayer.push(d);
  }
  window.ecooaEvento = evento;

  /* ── conversão: todo clique de WhatsApp, com o contexto ── */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (!a) return;
    var texto = (a.textContent || '').trim().slice(0, 60);
    evento('whatsapp_click', {
      rotulo: texto,
      destino: 'recepcao',
      posicao: a.closest('footer') ? 'rodape' : a.closest('header') ? 'cabecalho' : 'corpo'
    });
    tentaCarregar();
  }, true);

  /* ── conversão: envio dos três formulários ── */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    if (f.querySelector('#ec-queixa')) return; /* busca do match, tratada abaixo */
    var tipo = f.querySelector('input[type=email]') && !f.querySelector('input[type=tel]')
      ? 'newsletter' : 'lead';
    evento('form_submit', { formulario: tipo });
    tentaCarregar();
  }, true);

  /* ── uso do ecooa.match. O termo digitado NÃO é enviado: é dado de saúde.
        Vai apenas o bloco de queixa entendido, que é categoria editorial. ── */
  var ultimoChip = '';
  function observaMatch() {
    var alvo = document.querySelector('[data-match-pronto], body');
    if (!alvo || !window.MutationObserver) return;
    var obs = new MutationObserver(function () {
      var chip = null;
      var divs = document.querySelectorAll('div');
      for (var i = 0; i < divs.length; i++) {
        if (divs[i].textContent.indexOf('entendemos:') === 0 && divs[i].children.length >= 2) { chip = divs[i]; break; }
      }
      if (!chip) return;
      var partes = chip.textContent.split('→');
      var bloco = (partes[1] || '').trim();
      if (!bloco || bloco === ultimoChip) return;
      ultimoChip = bloco;
      var nomes = [];
      var links = document.querySelectorAll('a');
      for (var j = 0; j < links.length; j++) {
        if (/agendar com/.test(links[j].textContent)) nomes.push(links[j].textContent.replace('agendar com ', '').trim());
      }
      evento('match_resultado', { bloco: bloco, indicados: nomes.join(','), total: nomes.length });
      tentaCarregar();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.getElementById('ec-queixa') || /qual-profissional/.test(location.pathname)) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observaMatch);
    else observaMatch();
  }

  /* ── aviso de consentimento, discreto e reversível ── */
  function aviso() {
    if (!ATIVA) return;
    if (lido()) return;
    var caixa = document.createElement('div');
    caixa.setAttribute('role', 'region');
    caixa.setAttribute('aria-label', 'Aviso de privacidade');
    /* No celular o aviso subia por cima do botao flutuante de WhatsApp, que e o
       unico caminho de conversao do site. A banca de valor classificou isso
       como defeito critico, com razao: nao se cobra consentimento cobrindo a
       porta. Em tela estreita o aviso sobe acima do botao e deixa a direita
       livre; em tela larga ele fica onde estava. */
    var estreito = window.matchMedia && window.matchMedia('(max-width:700px)').matches;
    caixa.style.cssText = 'position:fixed; left:12px; z-index:9998; max-width:560px; margin:0 auto; padding:16px 18px; border-radius:16px; background:rgba(253,253,252,.94); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px); box-shadow:0 18px 40px rgba(70,68,63,.18), inset 0 0 0 1px rgba(255,255,255,.6); display:flex; flex-wrap:wrap; gap:10px 14px; align-items:center; font-family:var(--sans, system-ui);' +
      (estreito ? ' right:12px; bottom:96px;' : ' right:12px; bottom:12px;');
    var txt = document.createElement('p');
    txt.style.cssText = 'margin:0; flex:1 1 260px; font-size:13px; line-height:1.55; color:#5C5A55;';
    txt.appendChild(document.createTextNode('Usamos medição de audiência para entender o que ajuda quem chega até aqui. Nada é ativado sem a sua escolha. '));
    var link = document.createElement('a');
    link.href = 'politicas.html';
    link.textContent = 'políticas';
    link.style.cssText = 'color:#46443F; text-decoration:underline; text-underline-offset:3px;';
    txt.appendChild(link);
    txt.appendChild(document.createTextNode('.'));
    caixa.appendChild(txt);
    function botao(rotulo, cheio, acao) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = rotulo;
      b.style.cssText = 'flex:0 0 auto; min-height:40px; padding:0 20px; border:0; border-radius:999px; cursor:pointer; font-size:10.5px; letter-spacing:.14em; ' +
        (cheio ? 'background:#63615C; color:#F0EEE9;' : 'background:#F0EEE9; color:#63615C; box-shadow:3px 3px 8px rgba(150,147,140,.3), -3px -3px 8px rgba(255,255,255,.95);');
      b.addEventListener('click', acao);
      return b;
    }
    caixa.appendChild(botao('recusar', false, function () { grava('recusado'); caixa.remove(); }));
    caixa.appendChild(botao('aceitar', true, function () { grava('aceito'); concede(); carregaGTM(); caixa.remove(); }));
    document.body.appendChild(caixa);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aviso);
  else aviso();
})();
</script>
`;

function anda(d) {
  const r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r.push(...anda(p));
    else if (e.name.endsWith('.html')) r.push(p);
  }
  return r;
}

let aplicadas = 0;
let puladas = 0;
for (const arq of anda(DEPLOY)) {
  let html = fs.readFileSync(arq, 'utf8');
  /* stubs de redirect e a 404 não medem nada */
  if (html.includes('Página movida') || arq.endsWith('404.html')) {
    puladas++;
    continue;
  }
  if (html.includes(MARCA)) {
    html = html.replace(new RegExp(`<script ${MARCA}>[\\s\\S]*?</script>\\n?`), '');
  }
  if (!html.includes('</body>')) {
    puladas++;
    continue;
  }
  /* Política de referenciador no próprio HTML, e não só em deploy/_headers,
     que o GitHub Pages ignora. Sem ela, a busca do ecooa.match, que vive na
     URL como ?q=, viajaria no cabeçalho Referer para qualquer destino externo,
     inclusive o WhatsApp. Queixa de saúde não pode sair daqui de carona. */
  if (!/name="referrer"/.test(html)) {
    html = html.replace(
      /<meta charset="[^"]*">/i,
      (m) => m + '\n<meta name="referrer" content="strict-origin-when-cross-origin">'
    );
  }
  html = html.replace('</body>', JS + '</body>');
  fs.writeFileSync(arq, html, 'utf8');
  aplicadas++;
}

console.log(`medição instalada: ${aplicadas} páginas (${puladas} puladas: redirects e 404)`);
