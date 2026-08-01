// Religa e evolui a ferramenta ecooa.match (qual-profissional-procurar.html).
//
// Versão 2.0, especificada em entrevista com o dono em 2026-08-01:
//   1. NUNCA sem resposta: dicionário clínico amplo (sintomas, regiões do
//      corpo, procedimentos, sinônimos, texto sem acento); queixa de saúde não
//      mapeada cai em medicina como porta de investigação. A tela de "não
//      entendi" só aparece para texto sem sentido.
//   2. O resultado mostra UMA área, mas o mapa de sintomas define a lista
//      ordenada e pode puxar reforço de outra área (dor no cotovelo: Natálie
//      primeiro, Gustavo segundo).
//   3. Chip do porquê: "entendemos: <frase> → <grupo de sintomas>".
//   4. O campo de busca vive DENTRO do resultado, editável, com refinar.
//   5. Autocompletar local de queixas comuns enquanto digita.
//   6. Caminhos combinados: no resultado do texto, "afinar com as perguntas"
//      mantém a queixa e só refina (tempo, histórico, formato, expectativa).
//   7. Escala de preferência por área definida pelo dono em 2026-07-31.
//   8. Sem detector de urgência, por decisão do dono; o aviso legal permanece.
//
// O mapa SINTOMAS aguarda revisão do dono, grupo a grupo.
//
// Uso: node scripts/match.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = '/home/user/ecooa-website';
const ARQ = path.join(RAIZ, 'deploy', 'qual-profissional-procurar.html');
const MARCA = 'data-match-pronto';

const JS = String.raw`
<script>
/* ecooa.match 2.0, JavaScript comum, sem eval. */
(function () {
  var D = (window.ECOOA || { profissionais: [], especialidades: [] });
  var WA = '5551991460909';

  /* escala de preferencia por area (dono, 2026-07-31) */
  var DESTAQUES = {
    medicina: 'gustavo-gehrke', tricologia: 'danusa-pires', nutricao: 'jessica-stein',
    'estetica-facial': 'tais-de-la-rosa', 'saude-mental': 'francielle-beria',
    'saude-integrativa': 'natalie-queiroz', 'transplante-capilar': 'larissa-wiebbelling',
    'estetica-corporal': 'eduarda-schoenmeier'
  };

  /* ── MAPA DE SINTOMAS (aguarda revisao do dono) ──
     rotulo: aparece no chip do porque.
     area: caminho editorial do resultado.
     pros: lista ordenada; pode puxar reforco de outra area. Sem pros, vale o
     pool da area com o destaque a frente. */
  var SINTOMAS = [
    { id: 'dor-musculo', rotulo: 'dor musculoesquelética', area: 'saude-integrativa',
      pros: ['natalie-queiroz', 'gustavo-gehrke', 'adriana'],
      termos: ['dor', 'dores', 'dolorido', 'doendo', 'doi', 'cotovelo', 'joelho', 'ombro', 'costas', 'coluna', 'lombar', 'lombalgia', 'cervical', 'nuca', 'pescoco', 'punho', 'pulso', 'tornozelo', 'quadril', 'articulacao', 'articulacoes', 'muscular', 'musculo', 'tensao', 'torcicolo', 'lesao', 'tendinite', 'bursite', 'hernia de disco', 'nervo ciatico', 'ciatico', 'ciatica', 'travado', 'travada', 'contratura', 'fibromialgia', 'artrose', 'artrite', 'canelite', 'fascite', 'esporao', 'dormencia', 'formigamento', 'panturrilha', 'escapula', 'costela'] },
    { id: 'postura-movimento', rotulo: 'postura e movimento', area: 'saude-integrativa',
      pros: ['natalie-queiroz', 'gustavo-gehrke'],
      termos: ['postura', 'postural', 'escoliose', 'cifose', 'mobilidade', 'alongamento', 'reabilitacao', 'fisioterapia', 'fisioterapeuta', 'osteopatia', 'osteopata', 'quiropraxia', 'rpg', 'movimento limitado', 'amplitude'] },
    { id: 'bebe', rotulo: 'cuidado com bebês e amamentação', area: 'saude-integrativa',
      leitura: 'Você busca cuidado osteopático e de amamentação para o seu bebê.',
      pros: ['natalie-queiroz', 'jessica-stein'],
      termos: ['osteopatia para bebe', 'osteopatia infantil', 'osteopata para bebe', 'bebe', 'bebes', 'recem nascido', 'recem-nascido', 'amamentacao', 'amamentar', 'pega no peito', 'colica do bebe', 'refluxo do bebe', 'torcicolo congenito', 'assimetria craniana', 'plagiocefalia'] },
    { id: 'integrativa', rotulo: 'terapias integrativas', area: 'saude-integrativa',
      leitura: 'Você busca um cuidado complementar ao que já faz.',
      termos: ['integrativa', 'integrativo', 'holistico', 'holistica', 'biorressonancia', 'terapia complementar', 'acupuntura', 'auriculoterapia', 'reiki', 'aromaterapia', 'enxaqueca', 'dor de cabeca', 'cefaleia'] },
    { id: 'hormonal', rotulo: 'saúde hormonal', area: 'medicina',
      termos: ['hormonio', 'hormonal', 'hormonios', 'reposicao hormonal', 'implante hormonal', 'chip hormonal', 'menopausa', 'climaterio', 'perimenopausa', 'testosterona', 'estradiol', 'progesterona', 'tireoide', 'hipotireoidismo', 'hipertireoidismo', 'sop', 'ovario policistico', 'libido', 'andropausa', 'ciclo menstrual', 'menstruacao', 'tpm'] },
    { id: 'metabolico', rotulo: 'metabolismo e peso', area: 'medicina',
      termos: ['emagrecer', 'emagrecimento', 'perder peso', 'perda de peso', 'obesidade', 'sobrepeso', 'metabolismo', 'metabolico', 'caneta', 'canetas', 'ozempic', 'mounjaro', 'wegovy', 'saxenda', 'tirzepatida', 'semaglutida', 'compulsao por doce', 'efeito sanfona', 'gordura no figado', 'esteatose', 'resistencia a insulina'] },
    { id: 'investigacao', rotulo: 'investigação clínica', area: 'medicina',
      termos: ['exame', 'exames', 'check up', 'checkup', 'sangue', 'laboratorio', 'diagnostico', 'investigar', 'medico', 'medica', 'clinico geral', 'consulta medica', 'segunda opiniao', 'colesterol', 'diabetes', 'glicemia', 'pressao alta', 'hipertensao', 'anemia', 'vitamina', 'vitaminas', 'imunidade', 'infeccao', 'inflamacao', 'longevidade', 'envelhecimento', 'prevencao', 'doenca cronica'] },
    { id: 'energia-sono', rotulo: 'energia, sono e disposição', area: 'medicina',
      termos: ['cansaco', 'cansada', 'cansado', 'fadiga', 'exaustao', 'sem energia', 'disposicao', 'insonia', 'sono ruim', 'dormir mal', 'apneia', 'ronco', 'performance', 'rendimento'] },
    { id: 'pele-rosto', rotulo: 'pele e rosto', area: 'estetica-facial',
      termos: ['pele', 'acne', 'espinha', 'espinhas', 'cravos', 'mancha', 'manchas', 'melasma', 'ruga', 'rugas', 'linhas de expressao', 'botox', 'toxina botulinica', 'preenchimento', 'acido hialuronico', 'harmonizacao facial', 'harmonizacao', 'hof', 'rosto', 'facial', 'face', 'dermatologista', 'dermatologia', 'rejuvenescimento', 'flacidez facial', 'olheira', 'olheiras', 'labios', 'labio', 'skincare', 'poro', 'poros', 'bioestimulador', 'peeling', 'melanose', 'rosacea', 'dermatite', 'cicatriz de acne'] },
    { id: 'corpo-estetica', rotulo: 'contorno corporal', area: 'estetica-corporal',
      termos: ['flacidez na barriga', 'barriga flacida', 'secar a barriga', 'celulite', 'gordura localizada', 'contorno corporal', 'flacidez corporal', 'flacidez', 'bumbum', 'gluteo', 'gluteos', 'abdomen', 'culote', 'medidas', 'estrias', 'drenagem', 'massagem modeladora', 'papada'] },
    { id: 'cabelo', rotulo: 'saúde capilar', area: 'tricologia',
      termos: ['cabelo caindo', 'caindo cabelo', 'cabelo', 'cabelos', 'queda de cabelo', 'queda capilar', 'calvicie', 'alopecia', 'alopecias', 'careca', 'couro cabeludo', 'capilar', 'tricologia', 'tricologista', 'caspa', 'dermatite seborreica', 'seborreia', 'fio', 'fios', 'rarefacao', 'entradas', 'afinamento', 'minoxidil', 'teste genetico capilar', 'coceira na cabeca', 'oleosidade no cabelo'] },
    { id: 'transplante', rotulo: 'transplante capilar', area: 'transplante-capilar',
      termos: ['transplante', 'transplante capilar', 'implante capilar', 'enxerto capilar', 'fue', 'cirurgia capilar', 'transplante de barba', 'transplante de sobrancelha', 'fio longo', 'sem raspagem'] },
    { id: 'alimentacao', rotulo: 'alimentação e nutrição', area: 'nutricao',
      termos: ['nutricao', 'nutricionista', 'dieta', 'alimentacao', 'comer', 'cardapio', 'intestino', 'intestinal', 'constipacao', 'prisao de ventre', 'refluxo', 'gastrite', 'intolerancia', 'lactose', 'gluten', 'suplemento', 'suplementacao', 'ortomolecular', 'endometriose', 'reeducacao alimentar'] },
    { id: 'hipertrofia', rotulo: 'massa muscular e performance', area: 'nutricao',
      pros: ['adriano-lenz', 'jessica-stein'],
      termos: ['hipertrofia', 'massa muscular', 'ganhar massa', 'ganho de massa', 'nutricao esportiva', 'dieta para treino', 'atleta', 'esportiva', 'creatina', 'whey', 'definicao muscular', 'bulking', 'cutting'] },
    { id: 'materno-infantil', rotulo: 'nutrição materno-infantil', area: 'nutricao',
      pros: ['jessica-stein'],
      termos: ['nutricao na gravidez', 'nutricao para gestante', 'nutricao infantil', 'nutricionista infantil', 'gestante', 'gravida', 'gestacao', 'gravidez', 'tentante', 'introducao alimentar', 'crianca', 'criancas', 'infantil', 'seletividade alimentar', 'meu filho nao come'] },
    { id: 'vegetariana', rotulo: 'alimentação vegetariana e vegana', area: 'nutricao',
      pros: ['jessica-stein'],
      termos: ['vegetariano', 'vegetariana', 'vegano', 'vegana', 'veganismo', 'plant based', 'sem carne', 'b12'] },
    { id: 'comportamento-alimentar', rotulo: 'comportamento alimentar', area: 'nutricao',
      termos: ['compulsao alimentar', 'compulsao', 'beliscar', 'ansiedade e comida', 'comer emocional', 'relacao com a comida', 'transtorno alimentar'] },
    { id: 'mente', rotulo: 'saúde mental', area: 'saude-mental',
      termos: ['perdi minha mae', 'perdi meu pai', 'falecimento', 'nao aguento mais', 'nao to conseguindo', 'nao estou conseguindo', 'cansado da cabeca', 'cansada da cabeca', 'esgotado', 'esgotada', 'depressao pos parto', 'depresao', 'anciedade', 'ansiedade', 'ansioso', 'ansiosa', 'depressao', 'deprimido', 'deprimida', 'terapia', 'psicologo', 'psicologa', 'psicologia', 'psicoterapia', 'mente', 'emocional', 'estresse', 'stress', 'burnout', 'esgotamento', 'luto', 'panico', 'sindrome do panico', 'autoestima', 'neuropsicologia', 'tdah', 'tristeza', 'angustia', 'medo', 'fobia', 'relacionamento', 'separacao', 'divorcio', 'autoconhecimento', 'crise'] }
  ];

  /* porta de investigacao: queixa de saude nao mapeada nunca fica sem resposta */
  var FALLBACK = { id: 'geral', rotulo: 'queixa de saúde para investigar', area: 'medicina',
    pros: ['gustavo-gehrke'] };

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
  var SUGESTOES = ['dor nas costas', 'dor no joelho', 'dor de cabeça frequente', 'queda de cabelo', 'caspa e coceira', 'transplante capilar', 'quero emagrecer', 'ganhar massa muscular', 'nutrição na gravidez', 'alimentação vegetariana', 'compulsão alimentar', 'ansiedade', 'burnout e esgotamento', 'terapia', 'manchas na pele', 'botox e preenchimento', 'harmonização facial', 'celulite e flacidez', 'menopausa', 'reposição hormonal', 'cansaço sem explicação', 'insônia', 'check-up com exames', 'osteopatia para bebê', 'má postura'];

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
    SINTOMAS.forEach(function (g) {
      var peso = 0;
      g.termos.forEach(function (k) {
        if (t.indexOf(' ' + k + ' ') >= 0 || t.indexOf(' ' + k) >= 0) peso += k.length * (k.indexOf(' ') >= 0 ? 2 : 1);
      });
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

  function poolDe(grupo, online) {
    var porSlug = {};
    D.profissionais.forEach(function (p) { porSlug[p.slug] = p; });
    var lista = [];
    if (grupo && grupo.pros) {
      grupo.pros.forEach(function (s2) { if (porSlug[s2]) lista.push(porSlug[s2]); });
    }
    var area = grupo ? grupo.area : null;
    var daArea = D.profissionais.filter(function (p) {
      return area && (p.esp || []).indexOf(area) >= 0 && lista.indexOf(p) < 0;
    });
    var primeiro = DESTAQUES[area];
    daArea.sort(function (a, b) { return (a.slug === primeiro ? -1 : 0) - (b.slug === primeiro ? -1 : 0); });
    lista = lista.concat(daArea);
    if (online) {
      var remotos = lista.filter(function (p) { return (p.atendimento || '').indexOf('online') >= 0; });
      if (remotos.length) lista = remotos;
    }
    return lista;
  }

  /* ── estado ── */
  var s = { modo: null, passo: 0, respostas: {}, texto: '', grupo: null, frase: '' };

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

  /* datalist unico para o autocompletar */
  var dl = document.createElement('datalist');
  dl.id = 'ec-sugestoes';
  SUGESTOES.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t;
    dl.appendChild(o);
  });
  document.body.appendChild(dl);

  function campoBusca(valor, aoEnviar) {
    var form = el('form', 'display:flex; flex-wrap:wrap; gap:12px; align-items:center;');
    var campo = document.createElement('input');
    campo.type = 'text';
    campo.id = 'ec-queixa';
    campo.setAttribute('list', 'ec-sugestoes');
    campo.placeholder = 'digite sua queixa, o procedimento que quer conhecer ou uma palavra-chave';
    campo.autocomplete = 'off';
    campo.style.cssText = CAMPO + 'flex:1 1 320px;';
    campo.value = valor || '';
    campo.addEventListener('input', function () { s.texto = campo.value; });
    var enviar = el('button', BTN_CHEIO + 'flex:0 0 auto;', [valor ? 'refinar' : 'ver sugestão']);
    enviar.type = 'submit';
    form.appendChild(campo);
    form.appendChild(enviar);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      aoEnviar(campo.value);
    });
    return form;
  }

  function buscar(frase) {
    s.texto = frase;
    s.frase = frase;
    s.grupo = interpreta(frase);
    s.respostas = {};
    s.modo = 'resultado';
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

  /* ── tela: com as suas palavras ── */
  function renderTexto() {
    var carta = el('div', CARTA);
    var topo = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
    topo.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['com as suas palavras']));
    topo.appendChild(voltarBtn('voltar', function () { s.modo = null; render(); sobe(); }));
    carta.appendChild(topo);
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
    palco.appendChild(el('section', SECAO, [el('div', MIOLO, [carta])]));
  }

  /* ── tela: perguntas ── */
  function renderPergunta(pendentes) {
    var q = pendentes[s.passo];
    var atual = s.respostas[q.campo];
    var carta = el('div', CARTA);
    var topo = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
    topo.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['pergunta ' + (s.passo + 1) + ' de ' + pendentes.length]));
    topo.appendChild(voltarBtn(s.passo > 0 ? 'voltar' : (s.frase ? 'voltar ao resultado' : 'trocar de caminho'), function () {
      if (s.passo > 0) s.passo--;
      else if (s.frase) s.modo = 'resultado';
      else s.modo = null;
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
  function cardResultado(p, area) {
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
    moldura.appendChild(el('span', 'position:absolute; top:10px; right:12px; font-size:8.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.85); background:rgba(43,41,38,.34); padding:4px 8px; border-radius:999px;', [p.marca || '']));
    card.appendChild(moldura);
    var corpo = el('span', 'display:block; padding:20px 22px 26px;');
    corpo.appendChild(el('span', 'display:block; font-family:var(--serif); font-size:21px; line-height:1.14; color:#46443F;', [p.nome]));
    corpo.appendChild(el('span', 'display:block; margin-top:7px; font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#5C5A55;', [p.classe + (registro ? ' · ' + registro : '')]));
    corpo.appendChild(el('span', 'display:block; margin-top:10px; font-size:13.5px; line-height:1.62; color:#66645E;', [p.primeiro + ' atua com ' + p.area + '. ' + bio1]));
    var acoes = el('span', 'display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;');
    var ag = document.createElement('a');
    ag.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Usei o ecooa.match no site e gostaria de agendar uma consulta com ' + p.nome + '. Poderiam me orientar sobre os próximos passos?');
    ag.target = '_blank'; ag.rel = 'noopener noreferrer';
    ag.style.cssText = 'display:inline-flex; align-items:center; min-height:44px; padding:0 22px; border-radius:999px; background:#63615C; color:#F0EEE9; font-size:10.5px; letter-spacing:.14em;';
    ag.textContent = 'agendar com ' + p.primeiro;
    acoes.appendChild(ag);
    if (area) {
      var ver = document.createElement('a');
      ver.href = 'especialidades/' + area + '/';
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
    var resumo = veioDeTexto ? 'Escrevi no site: ' + s.frase
      : respostas.map(function (r) { return r.campo + ': ' + r.valor; }).join('. ');
    var waGeral = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Usei o ecooa.match no site. ' + resumo + '. Qual profissional a equipe me indica para o meu caso?');

    var carta = el('div', CARTA);

    /* campo de busca editavel dentro do resultado, decisao do dono */
    if (veioDeTexto) {
      var topoBusca = el('div', 'display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap;');
      topoBusca.appendChild(el('span', 'font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['a sua busca']));
      topoBusca.appendChild(voltarBtn('recomeçar', function () {
        s.modo = null; s.passo = 0; s.respostas = {}; s.texto = ''; s.grupo = null; s.frase = '';
        render(); sobe();
      }));
      carta.appendChild(topoBusca);
      var busca = el('div', 'margin:18px 0 26px;');
      busca.appendChild(campoBusca(s.frase, buscar));
      carta.appendChild(busca);
    }

    if (!grupo) {
      /* texto sem sentido: pede outra frase, com o campo ja acima */
      carta.appendChild(el('span', 'display:block; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['o que entendemos']));
      carta.appendChild(el('p', 'margin:22px 0 0; max-width:40ch; font-family:var(--serif); font-size:clamp(24px,2.8vw,38px); line-height:1.16; color:#46443F;', ['Não consegui ler a sua frase. Pode tentar de novo?']));
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
    carta.appendChild(el('p', 'margin:22px 0 0; max-width:44ch; font-family:var(--serif); font-size:clamp(24px,2.8vw,38px); line-height:1.16; color:#46443F;', [caminho.leitura]));

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

    carta.appendChild(el('p', 'margin:26px 0 0; max-width:64ch; font-size:15.5px; line-height:1.7; color:#66645E;',
      [caminho.desc + ' Abaixo estão os profissionais indicados para começar, na ordem que a casa sugere. A escolha final é sua.']));

    var acoes = el('div', 'margin-top:30px; display:flex; flex-wrap:wrap; gap:14px;');
    if (veioDeTexto && !respostas.length) {
      var refinar = el('button', BTN_CHEIO, ['afinar com as perguntas']);
      refinar.type = 'button';
      refinar.addEventListener('click', function () {
        s.modo = 'perguntas'; s.passo = 0; s.respostas = {};
        render(); sobe();
      });
      acoes.appendChild(refinar);
    }
    var wa = document.createElement('a');
    wa.href = waGeral; wa.target = '_blank'; wa.rel = 'noopener noreferrer';
    wa.style.cssText = veioDeTexto && !respostas.length ? BTN_SUAVE : BTN_CHEIO;
    wa.textContent = 'falar com a ecooa sobre isso';
    acoes.appendChild(wa);
    if (!veioDeTexto) {
      var refaz = el('button', BTN_SUAVE, ['fazer outra busca']);
      refaz.type = 'button';
      refaz.addEventListener('click', function () {
        s.modo = null; s.passo = 0; s.respostas = {}; s.texto = ''; s.grupo = null; s.frase = '';
        render(); sobe();
      });
      acoes.appendChild(refaz);
    }
    carta.appendChild(acoes);
    palco.appendChild(el('section', 'padding:0 clamp(20px,3.2vw,56px) clamp(40px,5vw,64px); background:#F0EEE9;', [el('div', MIOLO, [carta])]));

    /* profissionais indicados */
    var pool = poolDe(grupo, online);
    if (pool.length) {
      var sec = el('section', 'background:#FAF9F7; padding-bottom:clamp(56px,7vw,100px);');
      var cab = el('div', 'padding:clamp(48px,6vw,96px) clamp(20px,3.2vw,56px) clamp(30px,4vw,48px); max-width:1600px; margin:0 auto;');
      cab.appendChild(el('div', 'display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#5C5A55;', ['caminho sugerido']));
      cab.appendChild(el('h2', 'margin:22px 0 0; max-width:20ch; font-family:var(--serif); font-weight:400; font-size:clamp(28px,3.4vw,48px); line-height:1.04; color:#46443F;', [caminho.titulo]));
      cab.appendChild(el('p', 'margin:18px 0 0; max-width:60ch; font-size:16px; line-height:1.68; color:#66645E;',
        [online ? 'Priorizamos quem atende também no formato online, como você pediu.' : 'Todos visíveis, na ordem indicada pela casa para a sua queixa.']));
      sec.appendChild(cab);
      var lista = el('div', 'display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1px; background:#FAF9F7; border-top:1px solid #DEDCD6; border-bottom:1px solid #DEDCD6; max-width:1600px; margin:0 auto;');
      pool.forEach(function (p) { lista.appendChild(cardResultado(p, grupo.area)); });
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
    s.modo = 'texto'; s.frase = ''; s.grupo = null; s.respostas = {};
    render(); sobe();
  });
  if (botoes[1]) botoes[1].addEventListener('click', function () {
    s.modo = 'perguntas'; s.passo = 0; s.respostas = {}; s.frase = ''; s.grupo = null; s.texto = '';
    render(); sobe();
  });

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
  console.log('ecooa.match 2.0 religado: dicionário clínico, nunca sem resposta, campo editável, porquê, caminhos combinados');
}
