// Corpo dos artigos do editorial.
//
// Existe separado de deploy/dados-ecooa.js de propósito: aquele arquivo é
// carregado em TODAS as páginas do site, e catorze textos longos ali fariam o
// site inteiro carregar o conteúdo de uma página só. Aqui os textos vivem
// apenas em tempo de geração, e scripts/artigos.mjs os transforma em HTML
// estático dentro de cada deploy/blog/<slug>/index.html.
//
// Blocos aceitos: 'p' (parágrafo), 'h' (subtítulo) e 'destaque' (frase forte).
//
// Este arquivo é REESCRITO por scripts/monta-conteudo.mjs, que recolhe os
// textos redigidos na voz de quem assina e já revisados pelo guardião
// regulatório automático (CFM, COFEN, CFN, CFF, CRP, CFO). Enquanto um artigo
// não tiver corpo aqui, scripts/artigos.mjs cai no campo `corpo` de
// deploy/dados-ecooa.js, que é o estado anterior.
//
// A revisão final de quem assina cada texto segue pendente, conforme
// docs/mythos/PENDENCIAS-DO-DONO.md.

export const CORPOS = {};
