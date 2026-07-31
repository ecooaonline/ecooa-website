// Religa a ferramenta ecooa.match (qual-profissional-procurar.html).
//
// O template original declarava 10 handlers que a pré-renderização descartou:
// os dois cartões de entrada, o campo de texto, os exemplos, as cinco perguntas
// e o resultado. Este script porta a lógica completa (PERGUNTAS, CAMINHOS,
// CHAVES, interpretação por palavra-chave) para JavaScript comum, sem eval.
//
// Diferenças em relação ao original, todas decididas pelo dono em 2026-07-31:
//   1. o bug do beco sem saída foi corrigido: trocar de caminho limpa a frase
//      e a especialidade anteriores;
//   2. o resultado lista TODOS os profissionais da área, ordenados pela escala
//      de preferência definida pelo dono, cada um com texto convidativo e
//      botão de agendar;
//   3. cada resultado linka a página da área (/especialidades/<slug>/).
//
// A pré-renderização só gravou a tela de escolha; as demais são construídas
// pelo script, com os mesmos estilos do desenho original.
//
// Uso: node scripts/match.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const ARQ = path.join(RAIZ, 'deploy', 'qual-profissional-procurar.html');
const MARCA = 'data-match-pronto';

const JS = String.raw`
<script>
/* ecooa.match, portado do template original para JavaScript comum. */
(function () {
  var D = (window.ECOOA || { profissionais: [], especialidades: [] });
  var WA = '5551991460909';

  /* escala de preferencia por area, definida pelo dono em 2026-07-31 */
  var DESTAQUES = {
    medicina: 'gustavo-gehrke', tricologia: 'danusa-pires', nutricao: 'jessica-stein',
    'estetica-facial': 'tais-de-la-rosa', 'saude-mental': 'francielle-beria',
    'saude-integrativa': 'natalie-queiroz', 'transplante-capilar': 'larissa-wiebbelling',
    'estetica-corporal': 'eduarda-schoenmeier'
  };

  var PERGUNTAS = [
    { campo: 'motivo', titulo: 'O que te trouxe até aqui hoje?', ajuda: 'Escolha o que mais se aproxima. Nada aqui é definitivo, e você pode mudar depois.',
      opcoes: [
        { v: 'saude', r: 'Uma queixa de saúde que não se resolve', nota: 'cansaço, peso, hormônios, exames alterados' },
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

  var CAMINHOS = {
    medicina: { titulo: 'Medicina integrada é o ponto de partida.', leitura: 'Você procura entender uma queixa de saúde que ainda não teve resposta clara.', desc: 'Uma investigação clínica com tempo costuma organizar o que parece disperso. A partir dela, o cuidado pode se estender a outras áreas quando fizer sentido.' },
    'estetica-facial': { titulo: 'Estética e dermatologia, com indicação honesta.', leitura: 'Você quer cuidar da pele e do rosto com critério.', desc: 'A avaliação vem antes do procedimento. Em muitos casos, a rotina de cuidado resolve mais do que uma intervenção isolada.' },
    'estetica-corporal': { titulo: 'Estética corporal, planejada em etapas.', leitura: 'Você busca cuidado com o corpo, com plano e acompanhamento.', desc: 'Quando o objetivo envolve composição corporal, o cuidado caminha junto com nutrição e, quando indicado, com movimento.' },
    tricologia: { titulo: 'Tricologia, para investigar antes de tratar.', leitura: 'Você quer investigar a queda de cabelo antes de tratar.', desc: 'Nem toda queda tem a mesma causa. A investigação define se o caminho é clínico, se envolve procedimento, ou se o transplante capilar tem indicação.' },
    'transplante-capilar': { titulo: 'Transplante capilar, com critério de indicação.', leitura: 'Você considera transplante capilar e quer saber se tem indicação.', desc: 'Existem critérios clínicos, e há casos em que o tratamento adequado é outro. A avaliação define isso antes de qualquer agendamento cirúrgico.' },
    nutricao: { titulo: 'Nutrição, ajustada à sua rotina real.', leitura: 'Você busca alimentação e performance ajustadas à sua rotina.', desc: 'Doze profissionais com focos diferentes. A escolha considera o seu objetivo, o seu histórico e o que você consegue sustentar.' },
    'saude-mental': { titulo: 'Saúde mental, com escuta sem pressa.', leitura: 'Você procura um espaço de escuta e cuidado com a saúde mental.', desc: 'A primeira conversa serve para entender a demanda e combinar como o processo vai funcionar, sem pacote fechado.' },
    'saude-integrativa': { titulo: 'Cuidado integrativo, junto do acompanhamento clínico.', leitura: 'Você busca um cuidado complementar ao que já faz.', desc: 'É um cuidado complementar, que existe em diálogo com o que já acompanha você, e nunca no lugar dele.' }
  };

  var CHAVES = [
    ['medicina', ['hormonio','hormônio','hormonal','hormonios','hormônios','reposicao hormonal','reposição hormonal','implante hormonal','menopausa','climaterio','climatério','testosterona','tireoide','tireóide','metabolismo','metabolico','metabólico','emagrecer','emagrecimento','perder peso','obesidade','longevidade','envelhecimento','check up','checkup','exame','exames','cansaco','cansaço','disposicao','disposição','energia','libido','insonia','insônia','colesterol','diabetes','glicemia','vitamina','medico','médico','clinico','clínico','performance','caneta','canetas','ozempic','mounjaro']],
    ['estetica-facial', ['pele','acne','espinha','mancha','manchas','melasma','ruga','rugas','botox','toxina','preenchimento','acido hialuronico','ácido hialurônico','harmonizacao','harmonização','hof','rosto','facial','face','dermatologista','dermatologia','rejuvenescimento','flacidez facial','olheira','olheiras','skincare','poro','poros','bioestimulador']],
    ['estetica-corporal', ['corpo','corporal','celulite','gordura localizada','contorno corporal','flacidez corporal','bumbum','gluteo','glúteo','abdomen','abdômen','medidas']],
    ['tricologia', ['cabelo','cabelos','queda de cabelo','queda capilar','calvicie','calvície','alopecia','careca','couro cabeludo','capilar','tricologia','tricologista','caspa','dermatite seborreica','fio','fios','rarefacao','rarefação','entradas','minoxidil']],
    ['transplante-capilar', ['transplante','transplante capilar','implante capilar','enxerto capilar','fue','cirurgia capilar','transplante de barba','transplante de sobrancelha']],
    ['nutricao', ['nutricao','nutrição','nutricionista','dieta','alimentacao','alimentação','comer','cardapio','cardápio','hipertrofia','massa muscular','ganhar massa','intestino','intestinal','vegetariano','vegetariana','vegano','comportamental','compulsao','compulsão','esportiva','suplemento','suplementacao','suplementação','endometriose','ortomolecular','gestante','gestacao','gestação','infantil']],
    ['saude-mental', ['ansiedade','ansioso','ansiosa','depressao','depressão','terapia','psicologo','psicólogo','psicologa','psicóloga','psicologia','mente','emocional','estresse','stress','burnout','luto','panico','pânico','autoestima','sono','neuropsicologia','tdah','esgotamento']],
    ['saude-integrativa', ['osteopatia','osteopata','dor nas costas','coluna','integrativa','integrativo','biorressonancia','biorressonância','funcional','holistico','holístico','fisioterapia','fisioterapeuta','postura','enxaqueca','bebe','bebê','amamentacao','amamentação']]
  ];

  var ROTULOS = { motivo: 'o que te trouxe', tempo: 'há quanto tempo', historico: 'histórico', preferencia: 'atendimento', ritmo: 'expectativa' };
  var POR_MOTIVO = { saude: 'medicina', imagem: 'estetica-facial', cabelo: 'tricologia', alimentacao: 'nutricao', mente: 'saude-mental', 'nao-sei': 'medicina' };
  var EXEMPLOS = ['procuro médico para implante hormonal', 'meu cabelo está caindo muito', 'quero emagrecer com acompanhamento', 'preciso de terapia para ansiedade', 'quero cuidar da pele do rosto'];

  function normaliza(t) {
    return (' ' + String(t).toLowerCase() + ' ').replace(/[.,;:!?()"']/g, ' ').replace(/\s+/g, ' ');
  }
  function interpreta(frase) {
    var t = normaliza(frase);
    if (t.trim().length < 3) return null;
    var melhor = null, melhorPeso = 0;
    CHAVES.forEach(function (par) {
      var peso = 0;
      par[1].forEach(function (k) {
        if (t.indexOf(' ' + k) >= 0 || t.indexOf(k + ' ') >= 0) peso += k.length;
      });
      if (peso > melhorPeso) { melhorPeso = peso; melhor = par[0]; }
    });
    return melhorPeso >= 4 ? melhor : null;
  }

  /* ── estado ── */
  var s = { modo: null, passo: 0, respostas: {}, texto: '', esp: null, frase: '' };

  /* ── pontos de montagem ── */
  var telaEscolha = document.querySelector('[data-match-escolha]');
  if (!telaEscolha) return;
  var palco = document.createElement('div');
  telaEscolha.parentNode.insertBefore(palco, telaEscolha.nextSibling);

  function el(tag, estilo, filhos) {
    var n = document.createElement(tag);
    if (estilo) n.style.cssText = estilo;
    (filhos || []).forEach(function (f) {
      n.appendChild(typeof f === 'string' ? document.createTextNode(f) : f);
    });
    return n;
  }
  var CARTA = 'background:#FDFDFC; padding:clamp(28px,4vw,64px); box-shadow:8px 8px 20px rgba(150,147,140,.22), -8px -8px 20px rgba(255,255,255,.95);';
  var SECAO = 'padding:0 clamp(20px,3.2vw,56px) clamp(72px,9vw,130px); background:#F0EEE9;';
  var MIOLO = 'max-width:1180px; margin:0 auto;';
  var BTN = 'display:inline-flex; align-items:center; gap:8px; min-height:52px; padding:0 32px; border:0; border-radius:999px; cursor:pointer; font-size:11.5px; letter-spacing:.16em;';
  var BTN_CHEIO = BTN + 'background:#63615C; color:#F0EEE9; box-shadow:5px 5px 12px rgba(150,147,140,.32);';
  var BTN_SUAVE = BTN + 'background:#F0EEE9; color:#63615C; box-shadow:5px 5px 12px rgba(150,147,140,.32), -5px -5px 12px rgba(255,255,255,.98);';
  var voltarBtn = function (rotulo, acao) {
    var b = el('button', 'background:none; border:0; cursor:pointer; padding:0; font-size:12px; letter-spacing:.08em; color:#5C5A55;', ['← ' + rotulo]);
    b.type = 'button';
    b.addEventListener('click', acao);
    return b;
  };
  function sobe() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function render() {
    telaEscolha.hidden = s.modo !== null;
    palco.innerHTML = '';
    if (s.modo === 'texto') renderTexto();
    else if (s.modo === 'perguntas') {
      if (s.passo < PERGUNTAS.length) renderPergunta();
      else renderResultado();
    } else if (s.modo === 'resultado') renderResultado();
  }

  /* ── tela: com as suas palavras ── */
  function renderTexto() {
    var carta = el('div', CARTA);
    var topo = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
    topo.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['com as suas palavras']));
    topo.appendChild(voltarBtn('voltar', function () { s.modo = null; render(); sobe(); }));
    carta.appendChild(topo);
    carta.appendChild(el('h2', 'margin:26px 0 0; max-width:22ch; font-family:var(--serif); font-weight:400; font-size:clamp(25px,3vw,42px); line-height:1.1; color:#46443F;', ['O que você procura?']));
    carta.appendChild(el('p', 'margin:14px 0 0; max-width:56ch; font-size:15px; line-height:1.64; color:#66645E;', ['Escreva com naturalidade. Não precisa saber o nome do procedimento nem da especialidade.']));

    var form = el('form', 'margin-top:28px;');
    var campo = el('textarea', 'margin-top:12px; width:100%; padding:18px 20px; border:0; background:#F0EEE9; color:#46443F; font-family:var(--sans); font-size:16px; line-height:1.6; box-shadow:inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95); resize:vertical;');
    campo.rows = 3;
    campo.id = 'ec-queixa';
    campo.placeholder = 'digite sua queixa, o procedimento que quer conhecer ou uma palavra-chave';
    campo.value = s.texto;
    campo.addEventListener('input', function () { s.texto = campo.value; });
    var rotulo = el('label', 'display:block; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#5C5A55;', ['sua frase']);
    rotulo.htmlFor = 'ec-queixa';
    form.appendChild(rotulo);
    form.appendChild(campo);
    var rodape = el('div', 'margin-top:20px; display:flex; flex-wrap:wrap; gap:14px; align-items:center; justify-content:space-between;');
    rodape.appendChild(el('span', 'font-size:12.5px; line-height:1.6; color:#5C5A55;', ['Sua frase não é armazenada. Ela só orienta a sugestão desta tela.']));
    var enviar = el('button', BTN_CHEIO, ['ver sugestão']);
    enviar.type = 'submit';
    rodape.appendChild(enviar);
    form.appendChild(rodape);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      s.esp = interpreta(s.texto); s.frase = s.texto; s.respostas = {}; s.modo = 'resultado';
      render(); sobe();
    });
    carta.appendChild(form);

    var exBloco = el('div', 'margin-top:32px; padding-top:26px; border-top:1px solid rgba(70,68,63,.16);');
    exBloco.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['exemplos']));
    var linha = el('div', 'margin-top:16px; display:flex; flex-wrap:wrap; gap:9px;');
    EXEMPLOS.forEach(function (t) {
      var b = el('button', 'border:0; border-radius:999px; cursor:pointer; min-height:42px; padding:0 20px; font-size:13px; background:#F0EEE9; color:#63615C; box-shadow:5px 5px 12px rgba(150,147,140,.32), -5px -5px 12px rgba(255,255,255,.98);', [t]);
      b.type = 'button';
      b.addEventListener('click', function () {
        s.texto = t; s.frase = t; s.esp = interpreta(t); s.respostas = {}; s.modo = 'resultado';
        render(); sobe();
      });
      linha.appendChild(b);
    });
    exBloco.appendChild(linha);
    carta.appendChild(exBloco);

    var sec = el('section', SECAO, [el('div', MIOLO, [carta])]);
    palco.appendChild(sec);
  }

  /* ── tela: perguntas ── */
  function renderPergunta() {
    var q = PERGUNTAS[s.passo];
    var atual = s.respostas[q.campo];
    var carta = el('div', CARTA);
    var topo = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
    topo.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['pergunta ' + (s.passo + 1) + ' de ' + PERGUNTAS.length]));
    topo.appendChild(voltarBtn(s.passo > 0 ? 'voltar' : 'trocar de caminho', function () {
      if (s.passo > 0) s.passo--; else s.modo = null;
      render();
    }));
    carta.appendChild(topo);
    var trilho = el('div', 'margin-top:14px; height:3px; background:#E9E7E2; box-shadow:inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95);');
    trilho.appendChild(el('span', 'display:block; width:' + Math.round(((s.passo + 1) / PERGUNTAS.length) * 100) + '%; height:3px; background:#6B6964;'));
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
        render(); sobe();
      });
      grade.appendChild(b);
    });
    carta.appendChild(grade);
    palco.appendChild(el('section', SECAO, [el('div', MIOLO, [carta])]));
  }

  /* ── tela: resultado ── */
  function cardResultado(p, esp) {
    var registro = p.estado === 'a-adicionar' ? '' : p.registro;
    var bio1 = String(p.bio || '').split(/(?<=\.)\s/)[0] || '';
    var card = el('div', 'background:#FAF9F7; box-shadow:0 0 0 1px #DEDCD6; display:flex; flex-direction:column;');
    var moldura = el('span', 'display:block; position:relative; overflow:hidden; background:#E9E7E2; aspect-ratio:2/3; width:100%;');
    if (p.foto) {
      var img = document.createElement('img');
      img.src = p.foto; img.alt = 'Retrato de ' + p.nome; img.loading = 'lazy';
      img.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; filter:var(--foto);';
      moldura.appendChild(img);
    }
    var selo = el('span', 'position:absolute; top:10px; right:12px; font-size:8.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.85); background:rgba(43,41,38,.34); padding:4px 8px; border-radius:999px;', [p.marca || '']);
    moldura.appendChild(selo);
    card.appendChild(moldura);
    var corpo = el('span', 'display:block; padding:20px 22px 26px;');
    corpo.appendChild(el('span', 'display:block; font-family:var(--serif); font-size:21px; line-height:1.14; color:#46443F;', [p.nome]));
    corpo.appendChild(el('span', 'display:block; margin-top:7px; font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#5C5A55;', [p.classe + (registro ? ' · ' + registro : '')]));
    corpo.appendChild(el('span', 'display:block; margin-top:10px; font-size:13.5px; line-height:1.62; color:#66645E;', [p.primeiro + ' atua com ' + p.area + '. ' + bio1]));
    var acoes = el('span', 'display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;');
    var ag = document.createElement('a');
    ag.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá, usei o ecooa.match e gostaria de agendar com ' + p.nome + ' na ecooa.');
    ag.target = '_blank'; ag.rel = 'noopener noreferrer';
    ag.style.cssText = 'display:inline-flex; align-items:center; min-height:44px; padding:0 22px; border-radius:999px; background:#63615C; color:#F0EEE9; font-size:10.5px; letter-spacing:.14em;';
    ag.textContent = 'agendar com ' + p.primeiro;
    acoes.appendChild(ag);
    if (esp) {
      var ver = document.createElement('a');
      ver.href = 'especialidades/' + esp + '/';
      ver.style.cssText = 'display:inline-flex; align-items:center; min-height:44px; padding:0 18px; border-radius:999px; background:#F0EEE9; color:#63615C; font-size:10.5px; letter-spacing:.14em; box-shadow:5px 5px 12px rgba(150,147,140,.32), -5px -5px 12px rgba(255,255,255,.98);';
      ver.textContent = 'entenda esta área';
      acoes.appendChild(ver);
    }
    corpo.appendChild(acoes);
    card.appendChild(corpo);
    return card;
  }

  function renderResultado() {
    var veioDeTexto = !!s.frase;
    var motivo = (s.respostas.motivo && s.respostas.motivo.valor) || null;
    var esp = veioDeTexto ? s.esp : POR_MOTIVO[motivo || 'nao-sei'];
    var caminho = esp ? CAMINHOS[esp] : null;
    var online = s.respostas.preferencia && s.respostas.preferencia.valor === 'online';

    var respostas = Object.keys(ROTULOS).filter(function (k) { return s.respostas[k]; })
      .map(function (k) { return { campo: ROTULOS[k], valor: s.respostas[k].rotulo }; });
    var resumo = veioDeTexto ? 'Escrevi no site: ' + s.frase
      : respostas.map(function (r) { return r.campo + ': ' + r.valor; }).join('. ');
    var waGeral = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá, usei o ecooa.match no site. ' + resumo + '. Gostaria de orientação sobre o próximo passo.');

    var carta = el('div', CARTA);
    carta.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['o que entendemos']));
    carta.appendChild(el('p', 'margin:22px 0 0; max-width:40ch; font-family:var(--serif); font-size:clamp(24px,2.8vw,38px); line-height:1.16; color:#46443F;',
      [caminho ? caminho.leitura : 'Recebi a sua mensagem, mas prefiro não adivinhar o caminho.']));
    if (veioDeTexto) {
      var eco = el('div', 'margin-top:26px; padding:20px 24px; background:#F0EEE9; box-shadow:inset 3px 3px 7px rgba(150,147,140,.3), inset -3px -3px 7px rgba(255,255,255,.95);');
      eco.appendChild(el('span', 'display:block; font-size:9.5px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['você escreveu']));
      eco.appendChild(el('span', 'display:block; margin-top:10px; font-family:var(--serif); font-size:clamp(17px,1.6vw,21px); line-height:1.4; color:#46443F;', [s.frase]));
      carta.appendChild(eco);
    }
    if (respostas.length) {
      var grade = el('div', 'margin-top:30px; display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:12px;');
      respostas.forEach(function (r) {
        var c = el('div', 'padding:18px 20px; background:#F0EEE9; box-shadow:7px 7px 16px rgba(150,147,140,.2), -7px -7px 16px rgba(255,255,255,.95);');
        c.appendChild(el('span', 'display:block; font-size:9.5px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', [r.campo]));
        c.appendChild(el('span', 'display:block; margin-top:8px; font-size:14.5px; line-height:1.5; color:#46443F;', [r.valor]));
        grade.appendChild(c);
      });
      carta.appendChild(grade);
    }
    carta.appendChild(el('p', 'margin:30px 0 0; max-width:64ch; font-size:15.5px; line-height:1.7; color:#66645E;',
      [caminho
        ? caminho.desc + ' Abaixo estão os profissionais da ecooa que atuam nessa área, na ordem que a casa indica para começar. A escolha final é sua.'
        : 'Sem entender bem o que você precisa, qualquer indicação seria um chute. Prefiro te oferecer as perguntas guiadas ou uma conversa direta com a recepção.']));
    var acoes = el('div', 'margin-top:32px; display:flex; flex-wrap:wrap; gap:14px;');
    var wa = document.createElement('a');
    wa.href = waGeral; wa.target = '_blank'; wa.rel = 'noopener noreferrer';
    wa.style.cssText = BTN_CHEIO;
    wa.textContent = caminho ? 'falar com a ecooa sobre isso' : 'falar com a recepção';
    acoes.appendChild(wa);
    if (!caminho) {
      var pg = el('button', BTN_CHEIO, ['responder as perguntas']);
      pg.type = 'button';
      pg.addEventListener('click', function () {
        /* correcao do beco sem saida: limpar frase e esp ao trocar de caminho */
        s.modo = 'perguntas'; s.passo = 0; s.respostas = {}; s.frase = ''; s.esp = null;
        render(); sobe();
      });
      acoes.appendChild(pg);
    }
    var refaz = el('button', BTN_SUAVE, ['fazer outra busca']);
    refaz.type = 'button';
    refaz.addEventListener('click', function () {
      s.modo = null; s.passo = 0; s.respostas = {}; s.texto = ''; s.esp = null; s.frase = '';
      render(); sobe();
    });
    acoes.appendChild(refaz);
    carta.appendChild(acoes);
    palco.appendChild(el('section', 'padding:0 clamp(20px,3.2vw,56px) clamp(48px,6vw,88px); background:#F0EEE9;', [el('div', MIOLO, [carta])]));

    if (caminho) {
      var pool = D.profissionais.filter(function (p) { return (p.esp || []).indexOf(esp) >= 0; });
      if (online) {
        var remotos = pool.filter(function (p) { return (p.atendimento || '').indexOf('online') >= 0; });
        if (remotos.length) pool = remotos;
      }
      var primeiro = DESTAQUES[esp];
      pool.sort(function (a, b) { return (a.slug === primeiro ? -1 : 0) - (b.slug === primeiro ? -1 : 0); });

      var sec = el('section', 'background:#FAF9F7; padding-bottom:clamp(56px,7vw,100px);');
      var cab = el('div', 'padding:clamp(48px,6vw,96px) clamp(20px,3.2vw,56px) clamp(30px,4vw,48px); max-width:1600px; margin:0 auto;');
      cab.appendChild(el('div', 'display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['caminho sugerido']));
      cab.appendChild(el('h2', 'margin:22px 0 0; max-width:20ch; font-family:var(--serif); font-weight:400; font-size:clamp(28px,3.4vw,48px); line-height:1.04; color:#46443F;', [caminho.titulo]));
      cab.appendChild(el('p', 'margin:18px 0 0; max-width:60ch; font-size:16px; line-height:1.68; color:#66645E;',
        [online ? 'Priorizamos quem atende também no formato online, como você pediu.' : 'Estes são os profissionais da área, todos visíveis, na ordem indicada pela casa.']));
      sec.appendChild(cab);
      var lista = el('div', 'display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1px; background:#FAF9F7; border-top:1px solid #DEDCD6; border-bottom:1px solid #DEDCD6; max-width:1600px; margin:0 auto;');
      pool.forEach(function (p) { lista.appendChild(cardResultado(p, esp)); });
      sec.appendChild(lista);
      var nota = el('div', 'padding:clamp(30px,4vw,52px) clamp(20px,3.2vw,56px) 0; max-width:1600px; margin:0 auto;');
      nota.appendChild(el('p', 'margin:0; max-width:72ch; font-size:13px; line-height:1.68; color:#5C5A55;',
        ['Esta sugestão organiza a sua resposta e não é um diagnóstico. A definição do profissional e da conduta depende de avaliação individual. Se preferir, fale com a recepção e alguém da ecooa conduz a escolha com você.']));
      sec.appendChild(nota);
      palco.appendChild(sec);
    }
  }

  /* ── gatilhos da tela de escolha ── */
  var botoes = telaEscolha.querySelectorAll('button');
  if (botoes[0]) botoes[0].addEventListener('click', function () {
    s.modo = 'texto'; s.frase = ''; s.esp = null; s.respostas = {};
    render(); sobe();
  });
  if (botoes[1]) botoes[1].addEventListener('click', function () {
    /* correcao do beco sem saida: limpa o caminho anterior por inteiro */
    s.modo = 'perguntas'; s.passo = 0; s.respostas = {}; s.frase = ''; s.esp = null; s.texto = '';
    render(); sobe();
  });

  /* ── leia mais do aviso legal ── */
  document.querySelectorAll('[data-leia-mais]').forEach(function (b) {
    /* o runtime de template descarta atributos sem valor na serializacao,
       entao o hidden inicial e aplicado aqui */
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
  /* marca a seção de escolha: é a que contém os dois cartões de entrada */
  const alvo = html.indexOf('>escrever <span');
  if (alvo < 0) throw new Error('tela de escolha não encontrada');
  const iniSecao = html.lastIndexOf('<section', alvo);
  html =
    html.slice(0, iniSecao) +
    html.slice(iniSecao).replace('<section', '<section data-match-escolha', 1);
  html = html.replace('</body>', JS + '\n</body>');
  html = html.replace('<html', `<html ${MARCA}`);
  fs.writeFileSync(ARQ, html, 'utf8');
  console.log('ecooa.match religado: 2 caminhos, 5 perguntas, resultado ranqueado');
}
