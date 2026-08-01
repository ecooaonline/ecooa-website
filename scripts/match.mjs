// Religa e evolui a ferramenta ecooa.match (qual-profissional-procurar.html).
//
// Versão 3.0 "almanaque", especificada em entrevista com o dono em 2026-08-01:
//   1. NUNCA sem resposta: dicionário clínico amplo (sintomas, regiões do
//      corpo, procedimentos, sinônimos, texto sem acento); queixa de saúde não
//      mapeada cai em medicina como porta de investigação. A tela de "não
//      entendi" só aparece para texto sem sentido.
//   2. O resultado mostra UMA área, mas cada bloco de queixa tem a sua lista
//      ordenada de profissionais, ranqueada pelo dono bloco a bloco em
//      2026-08-01 (entrevista de cliques, 20 blocos, os 31 cobertos).
//   3. Cards do resultado em formato almanaque: foto pequena focada no rosto
//      (sem cortar a cabeça), nome, profissão e registro, e um texto preciso
//      do que AQUELE profissional faz para AQUELE bloco de queixa.
//   4. Número de indicações limitado (máximo 5 por resultado) para o visitante
//      não se perder; quando a área tem mais gente, um link leva à página da
//      área com todos.
//   5. Chip do porquê, campo editável no resultado, autocompletar e caminhos
//      combinados seguem da versão 2.0.
//   6. Sem detector de urgência, por decisão do dono; o aviso legal permanece.
//   7. Rodada de evolução (dono: "pense em pessoas pesquisando saúde no
//      Google"): 8 blocos novos (digestão, intestino, imunidade e vitaminas,
//      cardiometabólico, saúde da mulher, inchaço, bruxismo/ATM, enxaqueca)
//      e vocabulário ampliado em todos os blocos. No celular o resultado vira
//      lista compacta (rosto redondo, nome, porquê), diferente do desktop.
//   8. A página abre direto na busca por texto (sem tela de escolha); as cinco
//      perguntas viram uma ajuda da IA dentro da tela. Autocompletar próprio:
//      abre a partir de 3 letras em painel de vidro fosco (backdrop blur).
//   9. No resultado, o botão ao lado do campo é "ajuda por IA" e abre as
//      perguntas mantendo a frase (Enter no campo refaz a busca); o antigo
//      "afinar com as perguntas" saiu e "falar com nossa equipe" abre o
//      WhatsApp com o resumo da busca.
//
// Uso: node scripts/match.mjs
import fs from 'node:fs';
import path from 'node:path';
import { SINTOMAS, TEXTOS, FALLBACK } from './almanaque.mjs';

const RAIZ = '/home/user/ecooa-website';
const ARQ = path.join(RAIZ, 'deploy', 'qual-profissional-procurar.html');
const MARCA = 'data-match-pronto';

const JS = String.raw`
<script>
/* ecooa.match 3.0, JavaScript comum, sem eval. */
(function () {
  var D = (window.ECOOA || { profissionais: [], especialidades: [] });
  var WA = '5551991460909';

  /* escala de preferencia por area (dono, 2026-07-31), usada so quando o
     resultado vem das perguntas e nao ha bloco de queixa com lista propria */
  var DESTAQUES = {
    medicina: 'gustavo-gehrke', tricologia: 'danusa-pires', nutricao: 'jessica-stein',
    'estetica-facial': 'tais-de-la-rosa', 'saude-mental': 'francielle-beria',
    'saude-integrativa': 'natalie-queiroz', 'transplante-capilar': 'larissa-wiebbelling',
    'estetica-corporal': 'eduarda-schoenmeier'
  };

  /* ── MAPA DE SINTOMAS (rankings definidos pelo dono em 2026-08-01) ──
     rotulo: aparece no chip do porque.
     area: caminho editorial do resultado.
     pros: a lista ordenada do bloco; o resultado mostra SO ela. */
  var SINTOMAS = ${JSON.stringify(SINTOMAS)};

  /* porta de investigacao: queixa de saude nao mapeada nunca fica sem resposta */
  var FALLBACK = ${JSON.stringify(FALLBACK)};

  /* ── O ALMANAQUE: o que cada profissional faz para cada bloco de queixa.
     Texto por (bloco, profissional), no estilo definido pelo dono. ── */
  var TEXTOS = ${JSON.stringify(TEXTOS)};

  var CAMINHOS = {
    medicina: { titulo: 'Medicina integrada é o ponto de partida.', leitura: 'Você procura entender uma queixa de saúde e merece investigação com tempo.', desc: 'Uma investigação clínica com tempo costuma organizar o que parece disperso. A partir dela, o cuidado pode se estender a outras áreas quando fizer sentido.' },
    'estetica-facial': { titulo: 'Estética e dermatologia, com indicação honesta.', leitura: 'Você quer cuidar da pele e do rosto com critério.', desc: 'A avaliação vem antes do procedimento. Em muitos casos, a rotina de cuidado resolve mais do que uma intervenção isolada.' },
    'estetica-corporal': { titulo: 'Estética corporal, planejada em etapas.', leitura: 'Você busca cuidado com o corpo, com plano e acompanhamento.', desc: 'Quando o objetivo envolve composição corporal, o cuidado caminha junto com nutrição e, quando indicado, com movimento.' },
    tricologia: { titulo: 'Tricologia, para investigar antes de tratar.', leitura: 'Você quer investigar a queda de cabelo antes de tratar.', desc: 'Nem toda queda tem a mesma causa. A investigação define se o caminho é clínico, se envolve procedimento, ou se o transplante capilar tem indicação.' },
    'transplante-capilar': { titulo: 'Transplante capilar, com critério de indicação.', leitura: 'Você considera transplante capilar e quer saber se tem indicação.', desc: 'Existem critérios clínicos, e há casos em que o tratamento adequado é outro. A avaliação define isso antes de qualquer agendamento cirúrgico.' },
    nutricao: { titulo: 'Nutrição, ajustada à sua rotina real.', leitura: 'Você busca alimentação e performance ajustadas à sua rotina.', desc: 'Doze profissionais com focos diferentes. A escolha considera o seu objetivo, o seu histórico e o que você consegue sustentar.' },
    'saude-mental': { titulo: 'Saúde mental, com escuta sem pressa.', leitura: 'Você procura um espaço de escuta e cuidado com a saúde mental.', desc: 'A primeira conversa serve para entender a demanda e combinar como o processo vai funcionar, sem pacote fechado.' },
    'saude-integrativa': { titulo: 'Corpo em movimento, dor sob investigação.', leitura: 'Você quer cuidar de uma dor ou limitação do corpo, com avaliação e acompanhamento.', desc: 'A osteopatia avalia o corpo em movimento e trabalha a causa da dor; quando o caso pede, a medicina entra junto para diagnosticar e pedir exames.' }
  };

  var PERGUNTAS = [
    { campo: 'motivo', titulo: 'O que te trouxe até aqui hoje?', ajuda: 'Escolha o que mais se aproxima. Nada aqui é definitivo, e você pode mudar depois.',
      opcoes: [
        { v: 'saude', r: 'Uma queixa de saúde que não se resolve', nota: 'cansaço, peso, hormônios, exames alterados' },
        { v: 'dor', r: 'Dor ou limitação no corpo', nota: 'costas, articulações, postura, lesões' },
        { v: 'imagem', r: 'Cuidar da pele, do corpo ou do rosto', nota: 'dermatologia, harmonização, estética corporal' },
        { v: 'cabelo', r: 'Queda de cabelo ou saúde capilar', nota: 'tricologia e transplante capilar' },
        { v: 'alimentacao', r: 'Alimentação, peso e performance', nota: 'nutrição clínica, esportiva e comportamental' },
        { v: 'mente', r: 'Saúde mental e emocional', nota: 'psicologia clínica' },
        { v: 'nao-sei', r: 'Ainda não sei dizer', nota: 'tudo bem, seguimos assim mesmo' }
      ] },
    { campo: 'tempo', titulo: 'Há quanto tempo isso está acontecendo?', ajuda: 'O tempo ajuda a entender a urgência e o tipo de investigação.',
      opcoes: [
        { v: 'recente', r: 'Começou há poucas semanas' }, { v: 'meses', r: 'Alguns meses' },
        { v: 'anos', r: 'Anos, e já tentei caminhos diferentes' }, { v: 'preventivo', r: 'Não é um problema, quero prevenir' },
        { v: 'nao-sei', r: 'Não sei precisar' }
      ] },
    { campo: 'historico', titulo: 'Você já buscou ajuda para isso antes?', ajuda: 'Saber o que já foi tentado evita repetir o que não funcionou.',
      opcoes: [
        { v: 'nunca', r: 'É a primeira vez que procuro' }, { v: 'sem-resposta', r: 'Já procurei e não tive resposta clara' },
        { v: 'em-acompanhamento', r: 'Estou em acompanhamento e quero uma segunda opinião' },
        { v: 'parei', r: 'Comecei algo e não consegui manter' }, { v: 'nao-sei', r: 'Prefiro não responder agora' }
      ] },
    { campo: 'preferencia', titulo: 'Como você prefere ser atendido?', ajuda: 'Alguns profissionais atendem nos dois formatos, outros apenas presencialmente.',
      opcoes: [
        { v: 'presencial', r: 'Presencial, em Moinhos de Vento' }, { v: 'online', r: 'Online, de onde eu estiver' },
        { v: 'tanto-faz', r: 'Tanto faz, quero o profissional certo' }, { v: 'nao-sei', r: 'Ainda não decidi' }
      ] },
    { campo: 'ritmo', titulo: 'O que você espera de um primeiro encontro?', ajuda: 'Isso ajuda a escolher quem conduz do jeito que faz sentido para você.',
      opcoes: [
        { v: 'entender', r: 'Entender o que está acontecendo comigo' }, { v: 'plano', r: 'Sair com um plano prático para começar' },
        { v: 'segunda-opiniao', r: 'Revisar o que já me disseram' }, { v: 'escuta', r: 'Ser ouvido sem pressa' },
        { v: 'nao-sei', r: 'Não sei, quero ser orientado' }
      ] }
  ];
  var ROTULOS = { motivo: 'o que te trouxe', tempo: 'há quanto tempo', historico: 'histórico', preferencia: 'atendimento', ritmo: 'expectativa' };
  var POR_MOTIVO = { saude: 'medicina', dor: 'saude-integrativa', imagem: 'estetica-facial', cabelo: 'tricologia', alimentacao: 'nutricao', mente: 'saude-mental', 'nao-sei': 'medicina' };
  var EXEMPLOS = ['dor nas costas que não passa', 'meu cabelo está caindo muito', 'quero emagrecer com acompanhamento', 'preciso de terapia para ansiedade', 'procuro médico para implante hormonal'];
  var SUGESTOES = ['dor nas costas', 'dor no joelho', 'dor de cabeça frequente', 'enxaqueca', 'dor de barriga', 'hérnia de disco', 'má postura', 'osteopatia para bebê', 'queda de cabelo', 'queda de cabelo pós-parto', 'caspa e coceira', 'calvície', 'transplante capilar', 'quero emagrecer', 'canetas de emagrecimento', 'não consigo emagrecer', 'ganhar massa muscular', 'nutrição esportiva', 'nutrição na gravidez', 'alimentação vegetariana', 'compulsão alimentar', 'intestino preso', 'azia e refluxo', 'gastrite', 'check-up com exames', 'pressão alta', 'colesterol alto', 'diabetes', 'gordura no fígado', 'imunidade baixa', 'vitamina D baixa', 'cansaço sem explicação', 'insônia', 'menopausa', 'reposição hormonal', 'tireoide', 'SOP', 'endometriose', 'fertilidade', 'inchaço e retenção', 'manchas na pele', 'melasma', 'acne', 'botox e preenchimento', 'harmonização facial', 'preenchimento labial', 'bruxismo', 'limpeza de pele', 'celulite e flacidez', 'gordura localizada', 'ansiedade', 'depressão', 'burnout e esgotamento', 'crise de pânico', 'TDAH', 'terapia', 'psicologia do esporte', 'luto'];

  /* ── interpretacao ── */
  function semAcento(t) {
    return String(t).normalize ? String(t).normalize('NFD').replace(/[̀-ͯ]/g, '') : String(t);
  }
  function normaliza(t) {
    return (' ' + semAcento(String(t).toLowerCase()) + ' ').replace(/[.,;:!?()"'\/-]/g, ' ').replace(/\s+/g, ' ');
  }
  function ehSemSentido(t) {
    var limpo = semAcento(String(t)).toLowerCase().replace(/[^a-z]/g, '');
    if (limpo.length < 3) return true;
    if (!/[aeiou]/.test(limpo)) return true; /* sem vogal: teclado batido */
    return false;
  }
  function interpreta(frase) {
    var t = normaliza(frase);
    /* Dois estagios. Primeiro a AREA vence pelo placar somado dos seus grupos:
       sem isso, uma area com muitos grupos (medicina) tinha o peso fatiado e
       perdia para um grupo unico mais fraco. Depois, dentro da area vencedora,
       o melhor grupo define chip e ranking; empate vai ao mais especifico. */
    var pesos = [];
    /* "dor" e variantes sao genericos: sozinhos nao podem decidir a area.
       "dor de barriga" nao e musculoesqueletica; a REGIAO decide o caminho.
       Se a frase e "dor de/na <regiao>" e a regiao nao e do aparelho
       locomotor, o grupo de dor nao pontua e a queixa vai para o bloco da
       regiao, ou para a investigacao medica se a regiao nao for mapeada. */
    var GENERICOS = { dor: 1, dores: 1, dolorido: 1, doendo: 1, doi: 1 };
    SINTOMAS.forEach(function (g) {
      var peso = 0, especifico = false, generico = false;
      g.termos.forEach(function (k) {
        if (t.indexOf(' ' + k + ' ') >= 0 || t.indexOf(' ' + k) >= 0) {
          peso += k.length * (k.indexOf(' ') >= 0 ? 2 : 1);
          if (GENERICOS[k]) generico = true; else especifico = true;
        }
      });
      if (g.id === 'dor-musculo' && generico && !especifico && / dor (de|do|da|no|na|nos|nas) /.test(t)) peso = 0;
      pesos.push(peso);
    });
    var porArea = {};
    SINTOMAS.forEach(function (g, i) { porArea[g.area] = (porArea[g.area] || 0) + pesos[i]; });
    var melhorArea = null, melhorTotal = 0;
    Object.keys(porArea).forEach(function (a) {
      if (porArea[a] > melhorTotal) { melhorTotal = porArea[a]; melhorArea = a; }
    });
    var melhor = null, melhorPeso = 0;
    SINTOMAS.forEach(function (g, i) {
      if (g.area !== melhorArea) return;
      if (pesos[i] > melhorPeso || (pesos[i] === melhorPeso && melhor && g.termos.length < melhor.termos.length)) {
        melhorPeso = pesos[i]; melhor = g;
      }
    });
    if (melhor && melhorTotal >= 3) return melhor;
    if (ehSemSentido(frase)) return null;
    return FALLBACK; /* nunca sem resposta: medicina investiga */
  }

  /* limite de indicacoes por resultado, para o visitante nao se perder */
  var LIMITE = 5;

  function poolDe(grupo, online) {
    var porSlug = {};
    D.profissionais.forEach(function (p) { porSlug[p.slug] = p; });
    var lista = [];
    if (grupo && grupo.pros) {
      /* bloco com ranking do dono: o resultado mostra so essa lista */
      grupo.pros.forEach(function (s2) { if (porSlug[s2]) lista.push(porSlug[s2]); });
    } else if (grupo) {
      /* caminho das perguntas, sem bloco: pool da area com o destaque a frente */
      var area = grupo.area;
      lista = D.profissionais.filter(function (p) {
        return (p.esp || []).indexOf(area) >= 0;
      });
      var primeiro = DESTAQUES[area];
      lista.sort(function (a, b) { return (a.slug === primeiro ? -1 : 0) - (b.slug === primeiro ? -1 : 0); });
    }
    if (online) {
      var remotos = lista.filter(function (p) { return (p.atendimento || '').indexOf('online') >= 0; });
      if (remotos.length) lista = remotos;
    }
    return lista;
  }

  /* ── estado ── */
  var s = { modo: null, passo: 0, respostas: {}, texto: '', grupo: null, frase: '' };

  /* no celular a experiencia e outra: linhas compactas com rosto, nome e o
     porque da indicacao, sem os quadros grandes do desktop */
  var mqMovel = window.matchMedia('(max-width:700px)');
  var aoMudarMovel = function () { if (s.modo) render(); };
  if (mqMovel.addEventListener) mqMovel.addEventListener('change', aoMudarMovel);
  else if (mqMovel.addListener) mqMovel.addListener(aoMudarMovel);

  var telaEscolha = document.querySelector('[data-match-escolha]');
  if (!telaEscolha) return;
  var palco = document.createElement('div');
  telaEscolha.parentNode.insertBefore(palco, telaEscolha.nextSibling);

  /* o resultado da busca troca sem recarregar a pagina. Sem uma regiao viva,
     quem usa leitor de tela nao fica sabendo que alguma coisa mudou. */
  var locutor = document.createElement('p');
  locutor.setAttribute('role', 'status');
  locutor.setAttribute('aria-live', 'polite');
  locutor.style.cssText = 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;';
  palco.parentNode.insertBefore(locutor, palco);
  function anuncia(t) { locutor.textContent = t; }

  function el(tag, estilo, filhos) {
    var n = document.createElement(tag);
    if (estilo) n.style.cssText = estilo;
    (filhos || []).forEach(function (f) {
      n.appendChild(typeof f === 'string' ? document.createTextNode(f) : f);
    });
    return n;
  }
  var CARTA = 'background:#FDFDFC; padding:clamp(28px,4vw,64px); box-shadow:8px 8px 20px rgba(150,147,140,.22), -8px -8px 20px rgba(255,255,255,.95);';
  var SECAO = 'padding:0 clamp(20px,3.2vw,56px) clamp(48px,6vw,88px); background:#F0EEE9;';
  var MIOLO = 'max-width:1180px; margin:0 auto;';
  var BTN = 'display:inline-flex; align-items:center; gap:8px; min-height:52px; padding:0 32px; border:0; border-radius:999px; cursor:pointer; font-size:11.5px; letter-spacing:.16em;';
  var BTN_CHEIO = BTN + 'background:#63615C; color:#F0EEE9; box-shadow:5px 5px 12px rgba(150,147,140,.32);';
  var BTN_SUAVE = BTN + 'background:#F0EEE9; color:#63615C; box-shadow:5px 5px 12px rgba(150,147,140,.32), -5px -5px 12px rgba(255,255,255,.98);';
  var CAMPO = 'width:100%; min-height:56px; padding:16px 20px; border:0; background:#F0EEE9; color:#46443F; font-family:var(--sans); font-size:16px; line-height:1.5; box-shadow:inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95);';
  function sobe() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function voltarBtn(rotulo, acao) {
    var b = el('button', 'background:none; border:0; cursor:pointer; padding:0; font-size:12px; letter-spacing:.08em; color:#5C5A55;', ['← ' + rotulo]);
    b.type = 'button';
    b.addEventListener('click', acao);
    return b;
  }

  /* autocompletar proprio: abre a partir de 3 letras, painel de vidro fosco
     (o datalist nativo nao aceita estilo) */
  function campoBusca(valor, aoEnviar, aoGuiar) {
    var form = el('form', 'display:flex; flex-wrap:wrap; gap:12px; align-items:center;');
    var wrap = el('div', 'position:relative; flex:1 1 320px;');
    /* rotulo real, escondido visualmente: leitor de tela precisa saber o que
       o campo pede, e placeholder nao e rotulo (WCAG 3.3.2) */
    var rot = el('label', 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;', ['Descreva a sua queixa ou o procedimento que procura']);
    rot.setAttribute('for', 'ec-queixa');
    wrap.appendChild(rot);
    var campo = document.createElement('input');
    campo.type = 'text';
    campo.id = 'ec-queixa';
    campo.placeholder = 'digite sua queixa, o procedimento que quer conhecer ou uma palavra-chave';
    campo.autocomplete = 'off';
    /* semantica de combobox: sem ela o painel de sugestoes nao existe para
       quem usa leitor de tela (WCAG 4.1.2) */
    campo.setAttribute('role', 'combobox');
    campo.setAttribute('aria-expanded', 'false');
    campo.setAttribute('aria-controls', 'ec-sugestoes-painel');
    campo.setAttribute('aria-autocomplete', 'list');
    campo.setAttribute('aria-haspopup', 'listbox');
    campo.style.cssText = CAMPO;
    campo.value = valor || '';
    wrap.appendChild(campo);
    var painel = el('div', 'position:absolute; left:0; right:0; top:calc(100% + 10px); z-index:60; display:none; padding:8px; border-radius:18px; background:rgba(253,253,252,.86); -webkit-backdrop-filter:blur(18px) saturate(1.5); backdrop-filter:blur(18px) saturate(1.5); box-shadow:0 24px 48px rgba(70,68,63,.18), 0 2px 8px rgba(70,68,63,.08), inset 0 0 0 1px rgba(255,255,255,.6);');
    painel.id = 'ec-sugestoes-painel';
    painel.setAttribute('role', 'listbox');
    painel.setAttribute('aria-label', 'Sugestões de queixa');
    wrap.appendChild(painel);
    /* aviso para leitor de tela: quantas sugestoes apareceram (WCAG 4.1.3) */
    var aviso = el('span', 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;');
    aviso.setAttribute('aria-live', 'polite');
    wrap.appendChild(aviso);
    var itens = [];
    var foco = -1;
    function fecha() {
      painel.style.display = 'none';
      painel.innerHTML = '';
      itens = [];
      foco = -1;
      campo.setAttribute('aria-expanded', 'false');
      campo.removeAttribute('aria-activedescendant');
    }
    function pinta() {
      itens.forEach(function (b, i) {
        var ativo = i === foco;
        /* contraste real do realce: o cinza anterior ficava em 1,2:1 */
        b.style.background = ativo ? '#DAD7D0' : 'transparent';
        b.style.boxShadow = ativo ? 'inset 0 0 0 1px #8C8A84' : 'none';
        b.setAttribute('aria-selected', ativo ? 'true' : 'false');
        if (ativo) campo.setAttribute('aria-activedescendant', b.id);
      });
      if (foco < 0) campo.removeAttribute('aria-activedescendant');
    }
    function abre(lista) {
      painel.innerHTML = '';
      itens = []; foco = -1;
      lista.forEach(function (t, i) {
        var b = el('button', 'display:block; width:100%; text-align:left; border:0; cursor:pointer; padding:11px 14px; border-radius:12px; background:transparent; font-family:var(--sans); font-size:14.5px; line-height:1.4; color:#46443F;', [t]);
        b.type = 'button';
        b.id = 'ec-sug-' + i;
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', 'false');
        b.addEventListener('mousedown', function (e) { e.preventDefault(); });
        b.addEventListener('click', function () {
          campo.value = t; s.texto = t; fecha(); aoEnviar(t);
        });
        b.addEventListener('mouseenter', function () { foco = itens.indexOf(b); pinta(); });
        painel.appendChild(b);
        itens.push(b);
      });
      painel.style.display = lista.length ? 'block' : 'none';
      campo.setAttribute('aria-expanded', lista.length ? 'true' : 'false');
      aviso.textContent = lista.length
        ? lista.length + (lista.length === 1 ? ' sugestão disponível' : ' sugestões disponíveis')
        : '';
    }
    function sugere() {
      var q = normaliza(campo.value).trim();
      if (q.replace(/\s/g, '').length < 3) { fecha(); return; }
      var comeca = [], contem = [];
      SUGESTOES.forEach(function (t) {
        var n = normaliza(t).trim();
        if (n.indexOf(q) === 0) comeca.push(t);
        else if (n.indexOf(q) >= 0) contem.push(t);
      });
      abre(comeca.concat(contem).slice(0, 7));
    }
    campo.addEventListener('input', function () { s.texto = campo.value; sugere(); });
    campo.addEventListener('focus', sugere);
    /* so fecha quando o foco sai de verdade do conjunto campo mais painel:
       o setTimeout anterior derrubava o painel mesmo quando o foco ia para
       uma sugestao, e jogava o teclado de volta ao corpo da pagina */
    wrap.addEventListener('focusout', function (e) {
      if (!wrap.contains(e.relatedTarget)) fecha();
    });
    campo.addEventListener('keydown', function (e) {
      if (painel.style.display === 'none') return;
      if (e.key === 'ArrowDown') { e.preventDefault(); foco = (foco + 1) % itens.length; pinta(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); foco = (foco - 1 + itens.length) % itens.length; pinta(); }
      else if (e.key === 'Enter' && foco >= 0) { e.preventDefault(); itens[foco].click(); }
      else if (e.key === 'Escape') fecha();
    });
    /* no resultado, o botao ao lado do campo abre as perguntas guiadas;
       editar a frase e dar Enter refaz a busca */
    var enviar;
    if (valor && aoGuiar) {
      enviar = el('button', BTN_CHEIO + 'flex:0 0 auto;', ['ajuda por IA']);
      enviar.type = 'button';
      enviar.addEventListener('click', aoGuiar);
    } else {
      enviar = el('button', BTN_CHEIO + 'flex:0 0 auto;', ['ver sugestão']);
      enviar.type = 'submit';
    }
    form.appendChild(wrap);
    form.appendChild(enviar);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      fecha();
      aoEnviar(campo.value);
    });
    return form;
  }

  /* a busca vive na URL: ?q=dor+nas+costas. Isso deixa o resultado
     compartilhavel, permite linkar direto de uma pagina de area e alimenta o
     SearchAction do dado estruturado. */
  function gravaURL(frase) {
    if (!window.history || !window.history.replaceState) return;
    var base = location.pathname;
    var nova = frase ? base + '?q=' + encodeURIComponent(frase) : base;
    if (nova !== location.pathname + location.search) {
      try { window.history.replaceState(null, '', nova); } catch (e) { /* file:// */ }
    }
  }

  function buscar(frase) {
    s.texto = frase;
    s.frase = frase;
    s.grupo = interpreta(frase);
    s.respostas = {};
    s.modo = 'resultado';
    gravaURL(frase);
    render();
    sobe();
  }

  function render() {
    telaEscolha.hidden = s.modo !== null;
    palco.innerHTML = '';
    if (s.modo === 'texto') renderTexto();
    else if (s.modo === 'perguntas') {
      var pendentes = perguntasPendentes();
      if (s.passo < pendentes.length) renderPergunta(pendentes);
      else renderResultado();
    } else if (s.modo === 'resultado') renderResultado();
  }

  /* com frase reconhecida, a pergunta de motivo e pulada: so refina */
  function perguntasPendentes() {
    return s.frase && s.grupo ? PERGUNTAS.slice(1) : PERGUNTAS;
  }

  /* ── tela inicial: com as suas palavras ── */
  function renderTexto() {
    var carta = el('div', CARTA);
    carta.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['com as suas palavras']));
    carta.appendChild(el('h2', 'margin:26px 0 0; max-width:22ch; font-family:var(--serif); font-weight:400; font-size:clamp(25px,3vw,42px); line-height:1.1; color:#46443F;', ['O que você procura?']));
    carta.appendChild(el('p', 'margin:14px 0 0; max-width:56ch; font-size:15px; line-height:1.64; color:#66645E;', ['Escreva com naturalidade. Não precisa saber o nome do procedimento nem da especialidade.']));
    var caixa = el('div', 'margin-top:26px;');
    caixa.appendChild(campoBusca(s.texto, buscar));
    caixa.appendChild(el('p', 'margin:12px 0 0; font-size:12.5px; line-height:1.6; color:#5C5A55;', ['Sua frase não é armazenada. Ela só orienta a sugestão desta tela.']));
    carta.appendChild(caixa);

    var exBloco = el('div', 'margin-top:30px; padding-top:24px; border-top:1px solid rgba(70,68,63,.16);');
    exBloco.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['exemplos']));
    var linha = el('div', 'margin-top:14px; display:flex; flex-wrap:wrap; gap:9px;');
    EXEMPLOS.forEach(function (t) {
      var b = el('button', 'border:0; border-radius:999px; cursor:pointer; min-height:42px; padding:0 20px; font-size:13px; background:#F0EEE9; color:#63615C; box-shadow:5px 5px 12px rgba(150,147,140,.32), -5px -5px 12px rgba(255,255,255,.98);', [t]);
      b.type = 'button';
      b.addEventListener('click', function () { buscar(t); });
      linha.appendChild(b);
    });
    exBloco.appendChild(linha);
    carta.appendChild(exBloco);

    /* as perguntas viram uma ajuda da IA, nao uma bifurcacao */
    var guia = el('div', 'margin-top:30px; padding-top:24px; border-top:1px solid rgba(70,68,63,.16); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px 20px;');
    var guiaTxt = el('div', 'flex:1 1 300px;');
    guiaTxt.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['prefere ser guiado?']));
    guiaTxt.appendChild(el('p', 'margin:8px 0 0; max-width:48ch; font-size:13.5px; line-height:1.6; color:#66645E;', ['A IA também pode te conduzir: cinco perguntas rápidas e a sugestão sai pronta, sem você precisar escrever nada.']));
    guia.appendChild(guiaTxt);
    var gb = el('button', BTN_SUAVE + 'flex:0 0 auto;', ['deixar a IA me guiar']);
    gb.type = 'button';
    gb.addEventListener('click', function () {
      s.modo = 'perguntas'; s.passo = 0; s.respostas = {}; s.frase = ''; s.grupo = null;
      render(); sobe();
    });
    guia.appendChild(gb);
    carta.appendChild(guia);
    palco.appendChild(el('section', SECAO, [el('div', MIOLO, [carta])]));
  }

  /* ── tela: perguntas ── */
  function renderPergunta(pendentes) {
    var q = pendentes[s.passo];
    var atual = s.respostas[q.campo];
    var carta = el('div', CARTA);
    var topo = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
    topo.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['pergunta ' + (s.passo + 1) + ' de ' + pendentes.length]));
    topo.appendChild(voltarBtn(s.passo > 0 ? 'voltar' : (s.frase ? 'voltar ao resultado' : 'voltar à busca'), function () {
      if (s.passo > 0) s.passo--;
      else if (s.frase) s.modo = 'resultado';
      else s.modo = 'texto';
      render();
    }));
    carta.appendChild(topo);
    if (s.frase && s.grupo) {
      carta.appendChild(el('p', 'margin:16px 0 0; font-size:13px; color:#5C5A55;', ['Refinando a busca por: "' + s.frase + '"']));
    }
    var trilho = el('div', 'margin-top:14px; height:3px; background:#E9E7E2; box-shadow:inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95);');
    trilho.appendChild(el('span', 'display:block; width:' + Math.round(((s.passo + 1) / pendentes.length) * 100) + '%; height:3px; background:#6B6964;'));
    carta.appendChild(trilho);
    carta.appendChild(el('h2', 'margin:32px 0 0; max-width:22ch; font-family:var(--serif); font-weight:400; font-size:clamp(25px,3vw,42px); line-height:1.1; color:#46443F;', [q.titulo]));
    carta.appendChild(el('p', 'margin:14px 0 0; max-width:56ch; font-size:15px; line-height:1.64; color:#66645E;', [q.ajuda]));
    var grade = el('div', 'margin-top:32px; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px;');
    q.opcoes.forEach(function (o) {
      var marcada = atual && atual.valor === o.v;
      var b = el('button',
        'text-align:left; border:0; cursor:pointer; color:#46443F; padding:20px 24px; font-size:15.5px; line-height:1.5; background:' +
        (marcada ? '#E9E7E2' : '#F0EEE9') + '; box-shadow:' +
        (marcada ? 'inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95)'
                 : '7px 7px 16px rgba(150,147,140,.2), -7px -7px 16px rgba(255,255,255,.95)') + ';',
        [o.r]);
      b.type = 'button';
      if (o.nota) b.appendChild(el('span', 'display:block; margin-top:7px; font-size:13px; line-height:1.5; color:#66645E;', [o.nota]));
      b.addEventListener('click', function () {
        s.respostas[q.campo] = { valor: o.v, rotulo: o.r };
        s.passo++;
        render();
        sobe();
      });
      grade.appendChild(b);
    });
    carta.appendChild(grade);
    palco.appendChild(el('section', SECAO, [el('div', MIOLO, [carta])]));
  }

  /* ── resultado ── */

  function waCard(p, grupo) {
    var msg = grupo && grupo.rotulo
      ? 'Olá! Usei o ecooa.match no site sobre ' + grupo.rotulo + ' e gostaria de agendar uma consulta com ' + p.nome + '. Poderiam me orientar sobre os próximos passos?'
      : 'Olá! Usei o ecooa.match no site e gostaria de agendar uma consulta com ' + p.nome + '. Poderiam me orientar sobre os próximos passos?';
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }
  function textoDe(p, grupo) {
    var texto = (grupo && grupo.id && TEXTOS[grupo.id] && TEXTOS[grupo.id][p.slug]) || null;
    if (!texto) {
      var bio1 = String(p.bio || '').split(/(?<=\.)\s/)[0] || '';
      texto = p.primeiro + ' atua com ' + p.area + '. ' + bio1;
    }
    return texto;
  }
  function fotoDe(p, tamanho) {
    var moldura = el('span', 'display:block; flex:0 0 ' + tamanho + '; width:' + tamanho + '; aspect-ratio:1; position:relative; overflow:hidden; background:#E9E7E2;');
    if (p.foto) {
      var img = document.createElement('img');
      img.src = p.foto; img.alt = 'Retrato de ' + p.nome; img.loading = 'lazy';
      img.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; filter:var(--foto);';
      moldura.appendChild(img);
    }
    return moldura;
  }

  /* card compacto do celular: rosto redondo, nome e o porque, em linhas */
  function cardMovel(p, grupo, i) {
    var registro = p.estado === 'a-adicionar' ? '' : p.registro;
    var card = el('div', 'padding:18px 0 20px; display:flex; gap:14px; align-items:flex-start; border-top:1px solid #E3E1DB;');
    var moldura = fotoDe(p, '58px');
    moldura.style.borderRadius = '50%';
    card.appendChild(moldura);
    var corpo = el('span', 'display:block; flex:1 1 0; min-width:0;');
    var linhaNome = el('span', 'display:flex; align-items:baseline; gap:8px;');
    linhaNome.appendChild(el('span', 'font-size:10px; letter-spacing:.14em; color:#8C8A84;', ['0' + (i + 1)]));
    linhaNome.appendChild(el('span', 'font-family:var(--serif); font-size:17.5px; line-height:1.18; color:#46443F;', [p.nome]));
    corpo.appendChild(linhaNome);
    corpo.appendChild(el('span', 'display:block; margin-top:4px; font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#5C5A55;', [p.classe + (registro ? ' · ' + registro : '')]));
    corpo.appendChild(el('span', 'display:block; margin-top:8px; font-size:13px; line-height:1.58; color:#66645E;', [textoDe(p, grupo)]));
    var ag = document.createElement('a');
    ag.href = waCard(p, grupo);
    ag.target = '_blank'; ag.rel = 'noopener noreferrer';
    ag.style.cssText = 'display:inline-flex; align-items:center; margin-top:12px; min-height:38px; padding:0 18px; border-radius:999px; background:#63615C; color:#F0EEE9; font-size:10px; letter-spacing:.13em;';
    ag.textContent = 'agendar com ' + p.primeiro;
    corpo.appendChild(ag);
    card.appendChild(corpo);
    return card;
  }

  /* card do almanaque no desktop: foto pequena focada no rosto (object-position
     no topo, para nunca cortar a cabeça), nome, profissão e registro, e o texto
     do que este profissional faz para este bloco de queixa. */
  function cardResultado(p, grupo, i) {
    if (mqMovel.matches) return cardMovel(p, grupo, i);
    var registro = p.estado === 'a-adicionar' ? '' : p.registro;
    var area = grupo ? grupo.area : null;
    var card = el('div', 'background:#FAF9F7; box-shadow:0 0 0 1px #DEDCD6; padding:clamp(18px,2.6vw,30px); display:flex; gap:clamp(14px,2vw,24px); align-items:flex-start;');
    card.appendChild(el('span', 'flex:0 0 auto; padding-top:2px; font-family:var(--serif); font-size:13px; color:#8C8A84;', ['0' + (i + 1)]));
    card.appendChild(fotoDe(p, 'clamp(72px,9vw,96px)'));
    var corpo = el('span', 'display:block; flex:1 1 180px; min-width:0;');
    corpo.appendChild(el('span', 'display:block; font-family:var(--serif); font-size:clamp(19px,2vw,22px); line-height:1.14; color:#46443F;', [p.nome]));
    corpo.appendChild(el('span', 'display:block; margin-top:6px; font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#5C5A55;', [p.classe + (registro ? ' · ' + registro : '') + (p.marca ? ' · ' + p.marca : '')]));
    corpo.appendChild(el('span', 'display:block; margin-top:10px; max-width:64ch; font-size:14px; line-height:1.66; color:#66645E;', [textoDe(p, grupo)]));
    var acoes = el('span', 'display:flex; flex-wrap:wrap; align-items:center; gap:8px 16px; margin-top:14px;');
    var ag = document.createElement('a');
    ag.href = waCard(p, grupo);
    ag.target = '_blank'; ag.rel = 'noopener noreferrer';
    ag.style.cssText = 'display:inline-flex; align-items:center; min-height:42px; padding:0 22px; border-radius:999px; background:#63615C; color:#F0EEE9; font-size:10.5px; letter-spacing:.14em;';
    ag.textContent = 'agendar com ' + p.primeiro;
    acoes.appendChild(ag);
    if (area) {
      var ver = document.createElement('a');
      ver.href = 'especialidades/' + area + '/';
      ver.style.cssText = 'display:inline-flex; align-items:center; min-height:42px; font-size:11px; letter-spacing:.1em; color:#5C5A55; text-decoration:underline; text-underline-offset:4px;';
      ver.textContent = 'entenda esta área';
      acoes.appendChild(ver);
    }
    corpo.appendChild(acoes);
    card.appendChild(corpo);
    return card;
  }

  function renderResultado() {
    var veioDeTexto = !!s.frase;
    var grupo = veioDeTexto ? s.grupo : null;
    if (!grupo && !veioDeTexto) {
      var motivo = (s.respostas.motivo && s.respostas.motivo.valor) || 'nao-sei';
      var area0 = POR_MOTIVO[motivo] || 'medicina';
      grupo = { id: 'perguntas', rotulo: null, area: area0 };
    }
    var caminho = grupo ? CAMINHOS[grupo.area] : null;
    var online = s.respostas.preferencia && s.respostas.preferencia.valor === 'online';

    var respostas = Object.keys(ROTULOS).filter(function (k) { return s.respostas[k]; })
      .map(function (k) { return { campo: ROTULOS[k], valor: s.respostas[k].rotulo }; });
    /* A frase que a pessoa digita é queixa clínica, ou seja, dado sensível de
       saúde. Ela NÃO entra na URL do WhatsApp: uma URL viaja para a Meta, fica
       no histórico do navegador e pode vazar por referenciador, tudo isso
       antes de a pessoa conscientemente enviar a mensagem. E a própria tela
       promete que a frase não é armazenada.
       Vai apenas o bloco de queixa entendido, que é categoria editorial da
       casa, não declaração da pessoa sobre si. Quem quiser detalhar, detalha
       dentro da conversa, que é onde esse dado deve estar. */
    var resumo = veioDeTexto
      ? (grupo && grupo.rotulo ? 'Busquei por ' + grupo.rotulo + '.' : 'Fiz uma busca na ferramenta.')
      : respostas.map(function (r) { return r.campo + ': ' + r.valor; }).join('. ');
    var waGeral = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Usei o ecooa.match no site. ' + resumo + ' Qual profissional a equipe me indica para o meu caso?');

    var carta = el('div', CARTA);

    /* campo de busca editavel dentro do resultado, decisao do dono */
    if (veioDeTexto) {
      var topoBusca = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
      topoBusca.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['a sua busca']));
      topoBusca.appendChild(voltarBtn('recomeçar', function () {
        s.modo = 'texto'; s.passo = 0; s.respostas = {}; s.texto = ''; s.grupo = null; s.frase = '';
        render(); sobe();
      }));
      carta.appendChild(topoBusca);
      var busca = el('div', 'margin:18px 0 26px;');
      busca.appendChild(campoBusca(s.frase, buscar, function () {
        s.modo = 'perguntas'; s.passo = 0; s.respostas = {};
        render(); sobe();
      }));
      carta.appendChild(busca);
    }

    if (!grupo) {
      /* texto sem sentido: pede outra frase, com o campo ja acima */
      carta.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['o que entendemos']));
      carta.appendChild(el('p', 'margin:22px 0 0; max-width:40ch; font-family:var(--serif); font-size:clamp(24px,2.8vw,38px); line-height:1.16; color:#46443F;', ['Não consegui ler a sua frase. Pode tentar de novo?']));
      anuncia('Não consegui ler a sua frase. Tente com outras palavras ou responda as perguntas guiadas.');
      carta.appendChild(el('p', 'margin:22px 0 0; max-width:64ch; font-size:15.5px; line-height:1.7; color:#66645E;', ['Edite o texto acima com outras palavras, escolha um exemplo, ou responda as perguntas guiadas. A recepção também resolve na hora.']));
      var acoes0 = el('div', 'margin-top:28px; display:flex; flex-wrap:wrap; gap:14px;');
      var pg0 = el('button', BTN_CHEIO, ['responder as perguntas']);
      pg0.type = 'button';
      pg0.addEventListener('click', function () {
        s.modo = 'perguntas'; s.passo = 0; s.respostas = {}; s.frase = ''; s.grupo = null;
        render(); sobe();
      });
      acoes0.appendChild(pg0);
      var wa0 = document.createElement('a');
      wa0.href = waGeral; wa0.target = '_blank'; wa0.rel = 'noopener noreferrer';
      wa0.style.cssText = BTN_SUAVE;
      wa0.textContent = 'falar com a recepção';
      acoes0.appendChild(wa0);
      carta.appendChild(acoes0);
      palco.appendChild(el('section', SECAO, [el('div', MIOLO, [carta])]));
      return;
    }

    carta.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['o que entendemos']));

    /* chip do porque, decisao do dono */
    if (veioDeTexto && grupo.rotulo) {
      var chip = el('div', 'margin-top:20px; display:inline-flex; flex-wrap:wrap; align-items:center; gap:8px; padding:10px 16px; background:#F0EEE9; border-radius:999px; box-shadow:inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95); font-size:13px; color:#46443F;');
      chip.appendChild(el('span', 'color:#5C5A55;', ['entendemos:']));
      chip.appendChild(el('strong', 'font-weight:600;', ['"' + s.frase + '"']));
      chip.appendChild(el('span', 'color:#5C5A55;', ['→ ' + grupo.rotulo]));
      carta.appendChild(chip);
    }

    if (respostas.length) {
      var grade = el('div', 'margin-top:26px; display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:12px;');
      respostas.forEach(function (r) {
        var c = el('div', 'padding:18px 20px; background:#F0EEE9; box-shadow:7px 7px 16px rgba(150,147,140,.2), -7px -7px 16px rgba(255,255,255,.95);');
        c.appendChild(el('span', 'display:block; font-size:9.5px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', [r.campo]));
        c.appendChild(el('span', 'display:block; margin-top:8px; font-size:14.5px; line-height:1.5; color:#46443F;', [r.valor]));
        grade.appendChild(c);
      });
      carta.appendChild(grade);
    }

    /* frase unica com o contato da equipe como texto-link sublinhado */
    var par = el('p', 'margin:26px 0 0; max-width:64ch; font-size:15.5px; line-height:1.7; color:#66645E;',
      ['Abaixo estão os profissionais indicados para você. A escolha final é sua, mas nossa equipe está pronta para te ajudar. ']);
    var wa = document.createElement('a');
    wa.href = waGeral; wa.target = '_blank'; wa.rel = 'noopener noreferrer';
    wa.style.cssText = 'color:#46443F; font-weight:600; text-decoration:underline; text-underline-offset:4px;';
    wa.textContent = 'Falar com nossa equipe';
    par.appendChild(wa);
    carta.appendChild(par);
    if (!veioDeTexto) {
      var acoes = el('div', 'margin-top:30px; display:flex; flex-wrap:wrap; gap:14px;');
      var refaz = el('button', BTN_SUAVE, ['fazer outra busca']);
      refaz.type = 'button';
      refaz.addEventListener('click', function () {
        s.modo = 'texto'; s.passo = 0; s.respostas = {}; s.texto = ''; s.grupo = null; s.frase = '';
        render(); sobe();
      });
      acoes.appendChild(refaz);
      carta.appendChild(acoes);
    }
    palco.appendChild(el('section', 'padding:0 clamp(20px,3.2vw,56px) clamp(40px,5vw,64px); background:#F0EEE9;', [el('div', MIOLO, [carta])]));

    /* profissionais indicados, formato almanaque */
    var pool = poolDe(grupo, online);
    var visiveis = pool.slice(0, LIMITE);
    anuncia(
      visiveis.length
        ? 'Resultado pronto: ' + (grupo.rotulo ? grupo.rotulo + '. ' : '') + visiveis.length +
            (visiveis.length === 1 ? ' profissional indicado.' : ' profissionais indicados.')
        : 'Nenhum profissional indicado para esta busca.'
    );
    if (visiveis.length) {
      var sec = el('section', 'background:#FAF9F7; padding-bottom:clamp(56px,7vw,100px);');
      var cab = el('div', 'padding:clamp(48px,6vw,96px) clamp(20px,3.2vw,56px) clamp(30px,4vw,48px); max-width:1600px; margin:0 auto;');
      cab.appendChild(el('div', 'display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['caminho sugerido']));
      cab.appendChild(el('h2', 'margin:22px 0 0; max-width:20ch; font-family:var(--serif); font-weight:400; font-size:clamp(28px,3.4vw,48px); line-height:1.04; color:#46443F;', [caminho.titulo]));
      cab.appendChild(el('p', 'margin:18px 0 0; max-width:60ch; font-size:16px; line-height:1.68; color:#66645E;',
        [online ? 'Priorizamos quem atende também no formato online, como você pediu.' : 'Entenda como cada profissional indicado poderá te ajudar.']));
      sec.appendChild(cab);
      var faixa = el('div', 'padding:0 clamp(20px,3.2vw,56px); max-width:1600px; margin:0 auto;');
      var lista = el('div', mqMovel.matches
        ? 'display:block; border-bottom:1px solid #E3E1DB;'
        : 'display:grid; grid-template-columns:1fr; gap:1px; max-width:1040px; border-top:1px solid #DEDCD6; border-bottom:1px solid #DEDCD6; background:#FAF9F7;');
      visiveis.forEach(function (p, i) { lista.appendChild(cardResultado(p, grupo, i)); });
      faixa.appendChild(lista);
      if (pool.length > LIMITE || (grupo.id === 'perguntas' && grupo.area) || mqMovel.matches) {
        var mais = document.createElement('a');
        mais.href = 'especialidades/' + grupo.area + '/';
        mais.style.cssText = 'display:inline-flex; align-items:center; margin-top:18px; font-size:11.5px; letter-spacing:.1em; color:#5C5A55; text-decoration:underline; text-underline-offset:4px;';
        mais.textContent = 'entenda esta área · todos os profissionais →';
        faixa.appendChild(mais);
      }
      sec.appendChild(faixa);
      var nota = el('div', 'padding:clamp(30px,4vw,52px) clamp(20px,3.2vw,56px) 0; max-width:1600px; margin:0 auto;');
      nota.appendChild(el('p', 'margin:0; max-width:72ch; font-size:13px; line-height:1.68; color:#5C5A55;',
        ['Esta sugestão organiza a sua resposta e não é um diagnóstico. A definição do profissional e da conduta depende de avaliação individual. Se preferir, fale com a recepção e alguém da ecooa conduz a escolha com você.']));
      sec.appendChild(nota);
      palco.appendChild(sec);
    }
  }

  /* ── a pagina abre direto na busca; a tela antiga de escolha fica oculta ── */
  telaEscolha.hidden = true;
  s.modo = 'texto';
  var inicial = '';
  try {
    inicial = (new URLSearchParams(location.search).get('q') || '').slice(0, 120);
  } catch (e) { inicial = ''; }
  if (inicial) buscar(inicial);
  else render();

  /* ── leia mais do aviso legal ── */
  document.querySelectorAll('[data-leia-mais]').forEach(function (b) {
    var resto0 = b.parentElement.querySelector('[data-leia-resto]');
    if (resto0) resto0.hidden = true;
    b.addEventListener('click', function () {
      var resto = b.parentElement.querySelector('[data-leia-resto]');
      var aberto = resto && !resto.hidden;
      if (resto) resto.hidden = aberto;
      b.setAttribute('aria-expanded', aberto ? 'false' : 'true');
      b.textContent = aberto ? 'leia mais' : 'mostrar menos';
    });
  });
})();
</script>
`;

let html = fs.readFileSync(ARQ, 'utf8');
if (html.includes(MARCA)) {
  console.log('ecooa.match já religado');
} else {
  const alvo = html.indexOf('>escrever <span');
  if (alvo < 0) throw new Error('tela de escolha não encontrada');
  const iniSecao = html.lastIndexOf('<section', alvo);
  html = html.slice(0, iniSecao) + html.slice(iniSecao).replace('<section', '<section data-match-escolha', 1);
  html = html.replace('</body>', JS + '\n</body>');
  html = html.replace('<html', `<html ${MARCA}`);
  fs.writeFileSync(ARQ, html, 'utf8');
  console.log('ecooa.match 3.0 religado: almanaque por bloco, rankings do dono, cards com texto por profissional');
}
