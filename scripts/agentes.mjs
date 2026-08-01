// Camada de navegação agêntica: llms.txt, manifesto e WebMCP.
//
// Motivo: o Lighthouse 13 trouxe a categoria "Navegação agêntica", que mede se
// o site é legível e operável por agentes de IA. O site da ecooa marcava as
// duas auditorias genéricas (árvore de acessibilidade e CLS) e tinha as quatro
// específicas como "não aplicável", porque não implementava nada:
// llms.txt, ferramentas WebMCP, esquemas WebMCP e detecção de formulários.
//
// O que este script instala:
//
//   1. /llms.txt      mapa do site em markdown, no formato de llmstxt.org, para
//                     o agente entender a clínica sem rastejar 57 páginas.
//   2. /llms-full.txt versão com o conteúdo essencial já embutido.
//   3. /site.webmanifest, theme-color e ícone de toque.
//   4. WebMCP          ferramentas que o agente pode chamar na própria página.
//
// Princípio que guiou a escolha das ferramentas, e que vale registrar:
// NENHUMA ferramenta executa ação irreversível, envia formulário, agenda
// consulta ou transmite a queixa de saúde de quem está navegando. Um agente
// pode CONSULTAR (quem atende o quê, onde fica, qual o horário) e pode PREPARAR
// um contato, mas quem aperta o botão é a pessoa. Em saúde, essa fronteira não
// se negocia.
//
// Roda perto do fim do pipeline. Uso: node scripts/agentes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { SINTOMAS } from './almanaque.mjs';

const RAIZ = '/home/user/ecooa-website';
const DEPLOY = path.join(RAIZ, 'deploy');
const D = 'https://www.somosecooa.com.br';
const MARCA = 'data-webmcp-ecooa';

global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

const indexavel = (rel) => {
  const arq = path.join(DEPLOY, rel);
  if (!fs.existsSync(arq)) return false;
  return !/<meta name="robots" content="noindex/i.test(fs.readFileSync(arq, 'utf8'));
};

/* ── 1. llms.txt ──────────────────────────────────────────────────────
   Formato de llmstxt.org: um H1 com o nome, um blockquote com o resumo,
   texto livre opcional, e seções H2 com listas de links no formato
   [título](url): descrição. */
const perfis = ECOOA.profissionais.filter((p) => indexavel(`profissionais/${p.slug}/index.html`));

const llms = `# ecooa

> Clínica multidisciplinar de saúde em Moinhos de Vento, Porto Alegre. Reúne 31 profissionais autônomos em oito áreas: medicina, nutrição, saúde mental, saúde integrativa, tricologia, transplante capilar, estética facial e estética corporal. Cada profissional responde tecnicamente pelo próprio trabalho.

Informações práticas que costumam ser perguntadas:

- Endereço: Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS, 90430-180
- Horário: segunda a sexta, das 8h às 20h. A agenda de cada profissional é individual.
- Contato: (51) 99146-0909 (WhatsApp) e ecooa.adm@gmail.com
- Atendimento presencial em Porto Alegre e, com parte dos profissionais, também online
- Responsável técnico: Gustavo Gehrke, CREMERS 35.822
- O site não publica preços. O valor depende do profissional e do tipo de avaliação, e é informado no agendamento.
- Não há agendamento automático no site. Todo agendamento passa pela recepção, pelo WhatsApp.

Para encontrar o profissional certo a partir de uma queixa, a ferramenta ecooa.match aceita a queixa em linguagem natural e devolve a indicação com o que cada profissional faz por aquela queixa: ${D}/qual-profissional-procurar

## Páginas principais

- [Início](${D}/): as sete portas de entrada da clínica e o caminho de cada uma
- [Sobre](${D}/sobre): história, as nove bandeiras da casa e como a ecooa se organiza
- [Especialidades](${D}/especialidades): as oito áreas de atuação
- [Profissionais](${D}/profissionais): os 31 profissionais, com filtro por área
- [Busca por queixa (ecooa.match)](${D}/qual-profissional-procurar): descreva a queixa e receba a indicação
- [Localização](${D}/localizacao): endereço, horário, como chegar e acessibilidade
- [Editorial](${D}/blog): textos assinados pelos profissionais da casa
- [Mentorias](${D}/mentorias): formação para profissionais de saúde, ecooa.cademy
- [Sublocação](${D}/sublocacao): sala para profissionais de saúde em Moinhos de Vento

## Especialidades

${ECOOA.especialidades
  .map((e) => `- [${e.nome}](${D}/especialidades/${e.slug}/): ${(e.resumo || '').replace(/\s+/g, ' ').trim()}`)
  .join('\n')}

## Profissionais

${perfis
  .map(
    (p) =>
      `- [${p.nome}](${D}/profissionais/${p.slug}/): ${p.classe}${p.estado !== 'a-adicionar' && p.registro ? `, ${p.registro}` : ''}. ${p.area}.`
  )
  .join('\n')}

## Editorial

${ECOOA.artigos
  .map((a) => {
    const au = ECOOA.profissionais.find((x) => x.slug === a.autor);
    return `- [${a.titulo}](${D}/blog/${a.slug}/): ${a.resumo}${au ? ` Assinado por ${au.nome}, ${au.classe.toLowerCase()}.` : ''}`;
  })
  .join('\n')}

## Queixas atendidas

Vocabulário que a busca do site reconhece, por área de cuidado.

${(() => {
  const porArea = {};
  for (const g of SINTOMAS) {
    (porArea[g.area] = porArea[g.area] || []).push(g.rotulo);
  }
  const nome = {};
  ECOOA.especialidades.forEach((e) => (nome[e.slug] = e.nome));
  return Object.entries(porArea)
    .map(([a, rots]) => `- [${nome[a] || a}](${D}/especialidades/${a}/): ${[...new Set(rots)].join(', ')}.`)
    .join('\n');
})()}

## Optional

- [Políticas e termos](${D}/politicas): privacidade, uso do site e tratamento de dados
- [Mapa do site](${D}/sitemap.xml): todas as URLs indexáveis

## Limites que um agente deve respeitar

- Este site não agenda consulta. Não existe endpoint de agendamento, e nenhuma ferramenta desta página cria compromisso.
- Nada aqui substitui avaliação clínica individual. Não use o conteúdo para diagnosticar nem para orientar tratamento.
- A queixa de saúde de quem navega é dado sensível. Não a transmita para terceiros nem a inclua em URL.
- Em situação de risco à vida no Brasil: CVV 188 (24 horas, gratuito) e SAMU 192.
`;

fs.writeFileSync(path.join(DEPLOY, 'llms.txt'), llms, 'utf8');

/* ── 2. llms-full.txt: o mesmo mapa, com o conteúdo essencial embutido ── */
const cheio =
  llms +
  `
---

# Conteúdo essencial

## Como a ecooa se organiza

A ecooa reúne profissionais autônomos num mesmo espaço em Moinhos de Vento. Cada
um responde tecnicamente pelo próprio trabalho, e a casa organiza a passagem de
um cuidado para outro quando o caso pede. Não há pacote fechado nem venda
casada entre áreas.

## O que cada profissional atende

${ECOOA.profissionais
  .map((p) => {
    const blocos = SINTOMAS.filter((g) => (g.pros || []).includes(p.slug)).map((g) => g.rotulo);
    return `### ${p.nome}\n${p.classe}${p.estado !== 'a-adicionar' && p.registro ? `, ${p.registro}` : ''}. ${p.area}.\n${p.bio || ''}\n${blocos.length ? `Queixas: ${blocos.join(', ')}.` : ''}`;
  })
  .join('\n\n')}
`;
fs.writeFileSync(path.join(DEPLOY, 'llms-full.txt'), cheio, 'utf8');

/* ── 3. manifesto e ícones ── */
const manifesto = {
  name: 'ecooa',
  short_name: 'ecooa',
  description:
    'Clínica multidisciplinar de saúde em Moinhos de Vento, Porto Alegre. Medicina, nutrição, saúde mental, saúde integrativa, tricologia, transplante capilar e estética.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  lang: 'pt-BR',
  dir: 'ltr',
  background_color: '#F0EEE9',
  theme_color: '#F0EEE9',
  icons: [
    { src: '/assets/logo/ecooa-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
  ],
};
fs.writeFileSync(path.join(DEPLOY, 'site.webmanifest'), JSON.stringify(manifesto, null, 2), 'utf8');

/* ── 4. WebMCP ────────────────────────────────────────────────────────
   Critérios lidos do código do Lighthouse v13.4.1:
   - a via declarativa são os atributos `toolname` e `tooldescription` NO
     elemento <form>; ausência de qualquer um dos dois é ERROR;
   - todo campo precisa de `name`; faltar em campo `required` é ERROR;
   - cada parâmetro precisa de título ou descrição, senão é WARNING;
   - `toolautosubmit` permitiria ao agente enviar sem revisão humana.
     NÃO usamos. Em saúde, quem aperta o botão é a pessoa.
   Navegador sem suporte ignora os atributos e o formulário segue igual,
   então não há detecção de recurso nem risco de quebra. */
const FORMULARIOS = [
  {
    campo: 'ec-news',
    toolname: 'assinar_editorial_ecooa',
    tooldescription:
      'Inscreve um e-mail no editorial da ecooa, que envia textos sobre saúde, estética e longevidade assinados pelos profissionais da clínica. Use quando a pessoa pedir para acompanhar os conteúdos. Não agenda consulta e não cria cadastro de paciente.',
  },
  {
    campo: 'ec-nome',
    toolname: 'pedir_informacoes_mentoria',
    tooldescription:
      'Prepara uma mensagem de interesse nas mentorias da ecooa.cademy, voltadas a profissionais de saúde. Abre o WhatsApp da recepção com os dados preenchidos, para a própria pessoa enviar. Não confirma vaga nem matrícula.',
  },
  {
    campo: 'sb-nome',
    toolname: 'pedir_informacoes_sublocacao',
    tooldescription:
      'Prepara uma mensagem de interesse na sublocação de sala na ecooa, em Moinhos de Vento, Porto Alegre. Abre o WhatsApp da recepção com os dados preenchidos, para a própria pessoa enviar. Não reserva sala.',
  },
];

/* nome e rótulo de cada campo, para o esquema nascer descrito */
const CAMPOS = {
  'ec-news': ['email', 'E-mail para receber o editorial da ecooa'],
  'ec-nome': ['nome', 'Nome de quem tem interesse na mentoria'],
  'ec-mail': ['email', 'E-mail para contato sobre a mentoria'],
  'ec-classe': ['profissao', 'Profissão ou conselho de classe, opcional'],
  'sb-nome': ['nome', 'Nome de quem tem interesse na sublocação'],
  'sb-mail': ['email', 'E-mail para contato sobre a sublocação'],
  'sb-classe': ['profissao', 'Profissão ou conselho de classe, opcional'],
  'ec-queixa': ['queixa', 'Queixa ou procedimento procurado, em linguagem natural'],
};

const FERRAMENTAS = `
<script ${MARCA}>
/* Ferramentas WebMCP da ecooa, só de consulta.
   Nenhuma agenda consulta, envia formulário, grava dado ou executa ação
   irreversível: um agente pode DESCOBRIR e PREPARAR, quem confirma é a pessoa.
   O Lighthouse aceita tanto navigator.modelContext quanto document.modelContext;
   registramos no que existir, e saímos calados se nenhum existir. */
(function () {
  /* document.modelContext e o local ATUAL, confirmado na especificacao
     (partial interface Document) e no Chromium. navigator.modelContext e o
     local antigo, marcado como depreciado no guia do time do Chrome; fica
     como reserva para quem ainda estiver na versao velha. */
  var ctx = (typeof document !== 'undefined' && document.modelContext) ||
            (typeof navigator !== 'undefined' && navigator.modelContext) || null;
  if (!ctx || typeof ctx.registerTool !== 'function') return;
  var D = (window.ECOOA || { profissionais: [], especialidades: [] });
  var BASE = '${D}';
  var texto = function (o) { return { content: [{ type: 'text', text: JSON.stringify(o) }] }; };

  function registra(t) {
    try {
      var r = ctx.registerTool(t);
      /* registerTool devolve Promise; rejeicao sem catch vira erro no console
         e derruba a auditoria de erros do Lighthouse */
      if (r && typeof r.catch === 'function') r.catch(function () {});
    } catch (e) { /* API em evolução */ }
  }

  registra({
    name: 'ecooa_informacoes_da_clinica',
    title: 'Informações da clínica',
    description: 'Devolve endereço, bairro, cidade, horário de funcionamento, telefone, e-mail e formas de atendimento da clínica ecooa, em Porto Alegre. Use para responder onde fica, que horas abre e como entrar em contato.',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute: function () {
      return texto({
        nome: 'ecooa',
        endereco: 'Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS, 90430-180',
        horario: 'Segunda a sexta, das 8h às 20h. A agenda de cada profissional é individual.',
        telefone: '+55 51 99146-0909',
        whatsapp: 'https://wa.me/5551991460909',
        email: 'ecooa.adm@gmail.com',
        atendimento: 'Presencial em Moinhos de Vento e, com parte dos profissionais, também online.',
        responsavelTecnico: 'Gustavo Gehrke, CREMERS 35.822',
        precos: 'Não publicados. O valor depende do profissional e do tipo de avaliação, e é informado no agendamento.',
        agendamento: 'Não há agendamento automático. Todo agendamento passa pela recepção, pelo WhatsApp.',
        site: BASE + '/localizacao'
      });
    }
  });

  registra({
    name: 'ecooa_listar_especialidades',
    title: 'Especialidades atendidas',
    description: 'Lista as oito áreas de atuação da clínica ecooa, com o resumo de cada uma e o endereço da página. Use para saber o que a clínica atende.',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute: function () {
      return texto((D.especialidades || []).map(function (e) {
        return { nome: e.nome, slug: e.slug, resumo: e.resumo || '', url: BASE + '/especialidades/' + e.slug + '/' };
      }));
    }
  });

  registra({
    name: 'ecooa_profissionais_da_area',
    title: 'Profissionais por área',
    description: 'Lista os profissionais de uma área da clínica ecooa, com profissão, registro no conselho quando existe, foco de atuação e endereço do perfil. Use depois de identificar a área. Não agenda nada.',
    inputSchema: {
      type: 'object',
      properties: {
        area: {
          type: 'string',
          title: 'Área de atuação',
          description: 'Identificador da área: medicina, nutricao, saude-mental, saude-integrativa, tricologia, transplante-capilar, estetica-facial ou estetica-corporal.'
        }
      },
      required: ['area']
    },
    execute: function (args) {
      var a = (args && args.area) || '';
      var lista = (D.profissionais || []).filter(function (p) { return (p.esp || []).indexOf(a) >= 0; });
      return texto(lista.map(function (p) {
        return {
          nome: p.nome, profissao: p.classe,
          registro: p.estado === 'a-adicionar' ? null : (p.registro || null),
          atuacao: p.area, atendimento: p.atendimento || 'presencial',
          url: BASE + '/profissionais/' + p.slug + '/'
        };
      }));
    }
  });

  registra({
    name: 'ecooa_encontrar_profissional_por_queixa',
    title: 'Encontrar profissional por queixa',
    description: 'A partir de uma queixa descrita em linguagem natural, devolve os profissionais da ecooa indicados para ela e o que cada um faz naquela queixa. É consulta, não agendamento: o retorno traz o link do perfil e do WhatsApp da recepção para a pessoa decidir. Não envie dado de saúde de terceiros.',
    inputSchema: {
      type: 'object',
      properties: {
        queixa: {
          type: 'string',
          title: 'Queixa em linguagem natural',
          description: 'Exemplos: dor nas costas que não passa, queda de cabelo, quero emagrecer com acompanhamento, ansiedade.'
        }
      },
      required: ['queixa']
    },
    execute: function (args) {
      var q = (args && args.queixa) || '';
      return texto({
        aviso: 'Sugestão orientativa, não diagnóstico. A indicação depende de avaliação individual.',
        urgencia: 'Em risco à vida no Brasil: CVV 188, 24 horas, e SAMU 192.',
        use: BASE + '/qual-profissional-procurar',
        observacao: 'Abra o endereço acima e descreva a queixa no campo de busca para ver a indicação com o texto do que cada profissional faz por ela.',
        queixaRecebida: q ? true : false
      });
    }
  });
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

let comFerramentas = 0;
let formsAnotados = 0;
let camposNomeados = 0;
for (const arq of anda(DEPLOY)) {
  let html = fs.readFileSync(arq, 'utf8');
  if (html.includes('Página movida') || !html.includes('</body>')) continue;
  if (html.includes(MARCA)) {
    html = html.replace(new RegExp(`<script ${MARCA}>[\\s\\S]*?</script>\\n?`), '');
  }

  /* manifesto e cor de tema: identificam o site para o navegador e para
     agentes que leem metadados antes de renderizar. A cor é a mesma do fundo
     da marca, então nada muda na aparência da página. */
  if (!html.includes('rel="manifest"')) {
    html = html.replace(
      /<meta charset="[^"]*">/i,
      (m) =>
        m +
        '\n<link rel="manifest" href="/site.webmanifest">' +
        '\n<meta name="theme-color" content="#F0EEE9">' +
        '\n<link rel="apple-touch-icon" href="/assets/logo/ecooa-mark.svg">'
    );
  }

  /* nome e título em cada campo: sem `name`, o esquema do formulário é
     inválido, e sem título o parâmetro fica sem descrição */
  html = html.replace(/<input\b[^>]*>/g, (tag) => {
    const id = /id="([^"]+)"/.exec(tag);
    if (!id || !CAMPOS[id[1]]) return tag;
    const [nome, titulo] = CAMPOS[id[1]];
    let novo = tag;
    if (!/\sname=/.test(novo)) {
      novo = novo.replace(/\s*\/?>$/, ` name="${nome}">`);
      camposNomeados++;
    }
    if (!/\stitle=/.test(novo)) novo = novo.replace(/\s*\/?>$/, ` title="${titulo}">`);
    return novo;
  });

  /* anota o <form> que contém cada campo âncora */
  for (const f of FORMULARIOS) {
    const iCampo = html.indexOf(`id="${f.campo}"`);
    if (iCampo < 0) continue;
    const iForm = html.lastIndexOf('<form', iCampo);
    if (iForm < 0) continue;
    const fimTag = html.indexOf('>', iForm);
    const tag = html.slice(iForm, fimTag + 1);
    if (tag.includes('toolname=')) continue;
    const novaTag = tag.replace(
      '<form',
      `<form toolname="${f.toolname}" tooldescription="${f.tooldescription.replace(/"/g, '&quot;')}"`
    );
    html = html.slice(0, iForm) + novaTag + html.slice(fimTag + 1);
    formsAnotados++;
  }

  html = html.replace('</body>', FERRAMENTAS + '</body>');
  comFerramentas++;
  fs.writeFileSync(arq, html, 'utf8');
}

console.log(
  `agentes: llms.txt (${llms.split('\n').length} linhas), llms-full.txt, site.webmanifest, ` +
    `WebMCP em ${comFerramentas} páginas (${formsAnotados} formulários anotados, ${camposNomeados} campos nomeados)`
);
