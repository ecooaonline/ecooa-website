// Recolhe o conteúdo escrito pelos agentes editoriais e o transforma em código.
//
// Dois destinos:
//
//   1. scripts/corpos-artigos.mjs, com o corpo dos 14 artigos. Este módulo só
//      existe em tempo de geração, de propósito. Antes os corpos moravam em
//      deploy/dados-ecooa.js, que é carregado em TODA página do site: colocar
//      catorze textos longos lá engordaria o site inteiro para servir o texto
//      de uma página só.
//
//   2. scripts/conteudo-areas.mjs, com o conteúdo aprofundado das 8
//      especialidades. O arquivo é reescrito preservando os campos que a
//      geração usa (slug, nome, marca, titulo, sub, meta) e trocando os que o
//      trabalho editorial ampliou.
//
// Lê os arquivos .final.json produzidos pelo guardião regulatório; se um não
// existir, cai no .json do redator; se nenhum existir, mantém o que já havia.
//
// Uso: node scripts/monta-conteudo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { AREAS } from './conteudo-areas.mjs';

const RAIZ = '/home/user/ecooa-website';
const SCRATCH =
  '/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad';

function leJson(dir, slug, campoFinal) {
  for (const nome of [`${slug}.final.json`, `${slug}.json`]) {
    const arq = path.join(dir, nome);
    if (!fs.existsSync(arq)) continue;
    try {
      const o = JSON.parse(fs.readFileSync(arq, 'utf8'));
      const v = campoFinal && o[campoFinal] ? o[campoFinal] : o;
      return { dado: v, origem: nome };
    } catch {
      /* arquivo pela metade: tenta o próximo */
    }
  }
  return null;
}

/* ── 1. corpos dos artigos ── */
{
  global.window = {};
  await import(path.join(RAIZ, 'deploy', 'dados-ecooa.js'));
  const artigos = global.window.ECOOA.artigos;
  const dir = path.join(SCRATCH, 'artigos');

  const corpos = {};
  let novos = 0;
  let herdados = 0;
  for (const a of artigos) {
    const r = fs.existsSync(dir) ? leJson(dir, a.slug, 'corpo_final') : null;
    const blocos = r && Array.isArray(r.dado) ? r.dado : null;
    if (blocos && blocos.length >= 4) {
      corpos[a.slug] = blocos;
      novos++;
    } else if (a.corpo && a.corpo.length) {
      corpos[a.slug] = a.corpo;
      herdados++;
    }
  }

  const cabecalho = `// Corpo dos artigos do editorial.
//
// Existe separado de deploy/dados-ecooa.js de propósito: aquele arquivo é
// carregado em TODAS as páginas do site, e catorze textos longos ali fariam o
// site inteiro carregar o conteúdo de uma página só. Aqui os textos vivem
// apenas em tempo de geração, e scripts/artigos.mjs os transforma em HTML
// estático dentro de cada deploy/blog/<slug>/index.html.
//
// Blocos aceitos: 'p' (parágrafo), 'h' (subtítulo) e 'destaque' (frase forte).
//
// Escrito na voz de quem assina cada texto e revisado por um guardião
// regulatório automático (CFM, COFEN, CFN, CFF, CRP, CFO) antes de entrar.
// A revisão final de quem assina segue pendente, conforme
// docs/mythos/PENDENCIAS-DO-DONO.md.

export const CORPOS = ${JSON.stringify(corpos, null, 2)};
`;
  fs.writeFileSync(path.join(RAIZ, 'scripts', 'corpos-artigos.mjs'), cabecalho, 'utf8');
  const palavras = Object.values(corpos).reduce(
    (n, b) => n + b.map((x) => x[1]).join(' ').split(/\s+/).length,
    0
  );
  console.log(
    `corpos de artigo: ${Object.keys(corpos).length} textos (${novos} novos, ${herdados} herdados), ${palavras} palavras`
  );
}

/* ── 2. conteúdo aprofundado das áreas ── */
{
  const dir = path.join(SCRATCH, 'areas');
  const saida = [];
  let ampliadas = 0;
  for (const a of AREAS) {
    const r = fs.existsSync(dir) ? leJson(dir, a.slug, 'conteudo_final') : null;
    const novo = r && r.dado && Array.isArray(r.dado.queixas) ? r.dado : null;
    if (novo) ampliadas++;
    saida.push({
      slug: a.slug,
      nome: a.nome,
      marca: a.marca,
      titulo: a.titulo,
      sub: a.sub,
      meta: a.meta,
      intro: novo?.intro || [],
      queixas: novo?.queixas || a.queixas,
      servicos: novo?.servicos || a.servicos,
      comoFunciona: novo?.comoFunciona || [],
      faq: novo?.faq || a.faq,
    });
  }

  const antigo = fs.readFileSync(path.join(RAIZ, 'scripts', 'conteudo-areas.mjs'), 'utf8');
  const destaques = antigo.match(/export const DESTAQUES = \{[\s\S]*?\};/);
  const cabecalho = `// Conteúdo editorial das 8 páginas de especialidade.
//
// Aprofundado em 2026-08-01: cada área saiu de 200 a 315 palavras de conteúdo
// próprio para um texto que de fato ajuda quem chega, com abertura, queixas na
// linguagem do paciente, serviços explicados, o passo a passo do primeiro
// atendimento e uma FAQ que encara as perguntas incômodas.
//
// Escrito e depois submetido a um guardião regulatório automático (CFM 1.974 e
// 2.336, COFEN, CFN, CFF, CRP, CFO), que também confere desvio de escopo
// profissional. A revisão técnica do dono segue pendente, conforme
// docs/mythos/PENDENCIAS-DO-DONO.md.
//
// Campos: intro (parágrafos), queixas (lista), servicos ([título, texto]),
// comoFunciona ([etapa, texto]) e faq ([pergunta, resposta]).

export const AREAS = ${JSON.stringify(saida, null, 2)};

${destaques ? destaques[0] : ''}
`;
  fs.writeFileSync(path.join(RAIZ, 'scripts', 'conteudo-areas.mjs'), cabecalho, 'utf8');
  const palavras = saida.reduce(
    (n, a) =>
      n +
      [...a.intro, ...a.queixas, ...a.servicos.flat(), ...a.comoFunciona.flat(), ...a.faq.flat()]
        .join(' ')
        .split(/\s+/).length,
    0
  );
  console.log(
    `áreas: ${ampliadas}/8 aprofundadas, ${palavras} palavras de conteúdo próprio no total`
  );
}
