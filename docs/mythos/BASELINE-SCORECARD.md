# Baseline Mythos: placar consolidado

> Consolidação das 10 medições independentes feitas em 2026-08-01 contra
> `deploy/` servido em `http://localhost:4353` com a CSP de produção, usando
> Lighthouse 13.4.1, axe-core 4.12.1, Playwright/Chromium 1194 e sharp.
> Objetivo do dono: **ser inevitavelmente top1 em saúde, Porto Alegre.**
> Todo o documento está ordenado por esse objetivo, não por gravidade abstrata.

**Aviso de deriva de medição.** O `deploy/` foi regenerado por outro processo
durante a janela da auditoria (15:14 a 15:41). O sitemap passou de 31 para 62
URLs, 31 páginas de perfil nasceram, o GTM entrou, os 22 títulos duplicados
foram corrigidos no commit 890f1c8 e o schema `MedicalClinic` passou de 0 para
34 arquivos. Quatro dimensões (performance, acessibilidade, SEO técnico e
segurança) mediram o estado anterior; as outras seis mediram o posterior. Onde
um achado foi total ou parcialmente superado pelo rebuild, está marcado com
**[superado no rebuild]**. Nada foi apagado: um defeito que passou pelo build,
pelo `validate-output.mjs` e pelo deploy sem alarme continua sendo um defeito de
governança mesmo depois de corrigido por acidente.

---

## 1. Notas por dimensão, da pior para a melhor

| # | Dimensão | Nota | Justificativa resumida |
| ---: | --- | ---: | --- |
| 1 | Analytics, aquisição e presença (P14 + Google Business Profile) | **26** | A camada existe em 66 de 95 páginas e é bem desenhada (Consent Mode v2 negando tudo, termo de saúde fora do evento), mas entrega zero dado: a CSP de produção não tem `connect-src` e bloqueia todo hit do GA4, `frame-src` bloqueia até o Preview do GTM, não há tag configurada no container, e UTM, gclid e fbclid não são capturados nem viajam para o WhatsApp. Não existe caminho entre real gasto e paciente atendido. O Google Business Profile não está reivindicado: 0 avaliações, 0 geo, 0 link de place. |
| 2 | Conteúdo, copy, autoridade e E-E-A-T (P12) | **33** | 12 dos 14 artigos têm zero parágrafo de corpo e o editorial inteiro soma 495 palavras, enquanto a home anuncia "8 min de leitura" e o índice promete "base científica, atualizado". Zero referências, zero `dateModified`, zero revisão declarada, zero política editorial, zero prova social, zero CNPJ. 39% do corpo do site é repetido entre páginas. 684 palavras-chave despejadas no texto visível, incluindo "perdi minha mae" e "nao aguento mais". |
| 3 | Infraestrutura, CI/CD e DX (P03/P05/P08) | **34** | O pipeline existe e em partes é bom, mas nada dele está no caminho por onde o código passa: 0 de 40 commits vieram por PR e o `ci.yml` só dispara em `pull_request`, então os 7 gates foram pulados 40 vezes. Dois gates estão vermelhos agora. O deploy quebrou duas vezes em 3 dias e ficou 25 commits congelado em silêncio absoluto. O Clone Limpo só roda depois de corrigir caminho absoluto em 23 de 30 scripts. |
| 4 | Segurança técnica (P07) | **42** | O artefato publicado é limpo por medição (0 terceiros, 0 cookie, 0 `eval`, 0 segredo na árvore), mas a limpeza vem de o site não fazer nada. `deploy/_headers` é inerte no GitHub Pages e a CSP real vive numa regra de painel Cloudflare fora do controle de versão, divergindo em 7 diretivas, sem `frame-ancestors`, sem `report-uri` e sem HSTS. A queixa clínica digitada no ecooa.match é embutida numa URL `wa.me` da Meta. |
| 5 | SEO técnico (P10) | **44** | Fundação de rastreabilidade limpa (0 links quebrados, canonical autorreferente em 31/31, profundidade máxima de 2 cliques, Lighthouse SEO 100), mas 24 das 31 URLs dividiam o `<title>` com outra página **[superado no rebuild]**, não havia nenhum schema de negócio local **[superado no rebuild]**, 12 de 14 artigos são cascas com `Article` declarado e 98% dos links internos apontam para a forma `.html`, que não é a canônica declarada. |
| 6 | UX, UI e design system (P11) | **44** | Acabamento visual pontua alto (0 overflow horizontal em 66 combinações, foco visível em 348 de 348 elementos, paleta com 6 desvios em ~4.400 hex), mas o design system quase não existe: 78 tamanhos de fonte computados, 137 line-heights, 11 breakpoints com três pares quase idênticos, 60,5% dos box-shadow contornando o token. Hover não responde em nenhum dos 89 alvos testados e `:active` tem 0 ocorrências. `DESIGN_SYSTEM.md` descreve um sistema que não existe. |
| 7 | Ética e regulatório em saúde (P17) | **46** | A camada de linguagem é excepcional (0 antes e depois, 0 depoimentos, 0 preços, 0 marcas de fármaco, 14 de 14 artigos com autor, registro e aviso). Mas quase todo requisito formal falha: a política está no ar declarando-se rascunho não validado por advogado e retorna 404 em 53 das 62 páginas, 5 profissionais são anunciados sem nenhum registro em 28 aparições, uma médica é chamada de especialista e tricologista sem RQE, e não há CNPJ nem razão social. |
| 8 | Acessibilidade WCAG (P09) | **52** | Base semântica boa e medida (215 de 215 imagens com alt, 1278 elementos interativos sem nome acessível faltando, 0 violações critical do axe, modal com foco preso, reflow a 320px com 0px de overflow). Mas há falhas de nível A sistêmicas: `main` = 0 e skip link = 0 em 31 de 31 páginas, com 14 Tabs de cabeçalho a cada navegação, e o anel de foco global mede 1,45:1 contra os 3:1 exigidos. |
| 9 | Conversão crítica (P04/CRO) | **57** | A arquitetura é boa: 482 links `wa.me` em 62 de 62 páginas, um único telefone correto em 100% das ocorrências, 60 mensagens personalizadas por contexto, ecooa.match em 3 toques. Mas o aviso de consentimento cobre inteiramente o botão flutuante no celular, 21 de 62 páginas não têm CTA textual acima da dobra, os 3 formulários declaram sucesso sem verificar nada, e não existe uma única prova social. |
| 10 | Performance e Core Web Vitals (P06) | **58** | Desktop entrega 100 nas 4 páginas medidas e o CLS é zero absoluto em 100% das páginas por dois métodos independentes. Mas a home falha o próprio teto de LCP mobile por 32% (3301 ms), mais 3 páginas falham, e um leitor que rola a home baixa 3.884 KB para desenhar o equivalente a 143 KB de pixels úteis: 94,4% de desperdício. O gate do CI olha 2 páginas reais de 31 URLs. |
| | **Média simples** | **43,6** | |
| | **Nota global ponderada** | **41,9** | |

---

## 2. Nota global ponderada: 41,9 de 100

### Os pesos e por que são estes

O objetivo não é "ter um bom site". É **ser inevitavelmente top1 em saúde,
Porto Alegre**. Isso muda a hierarquia: uma dimensão só pesa na proporção em
que trava o top1 ou em que derruba o ativo inteiro. Um site com Lighthouse 100
e nenhum artigo escrito não chega a lugar nenhum; um site com conteúdo
excelente e uma representação no CRM sai do ar.

| Dimensão | Peso | Nota | Contribuição | Por que este peso |
| --- | ---: | ---: | ---: | --- |
| SEO técnico (P10) | 15% | 44 | 6,60 | É o canal. Sem título por intenção, sem schema local e sem link canônico consistente, nenhum conteúdo ranqueia, por melhor que seja. |
| Conteúdo, copy e E-E-A-T (P12) | 15% | 33 | 4,95 | É a matéria-prima do top1 em YMYL de saúde. 12 artigos vazios significam que não há o que ranquear. Sem referência, sem revisão e sem política editorial, o Google não tem por que confiar. |
| Analytics, aquisição e GBP (P14) | 13% | 26 | 3,38 | Para clínica de bairro o Google Business Profile pesa mais que o site inteiro na descoberta local, e está zerado. Sem medição não há como saber o que funciona: toda decisão vira chute e todo real de mídia é cego. |
| Conversão crítica (P04) | 12% | 57 | 6,84 | Top1 que não converte é vaidade. O tráfego que chegar hoje encontra o CTA principal coberto por um banner no celular e formulários que mentem sucesso. |
| Ética e regulatório (P17) | 12% | 46 | 5,52 | É o único eixo com poder de veto. Uma representação no CRM, CRN ou CRO, ou uma reclamação na ANPD, tira o ativo do ar e leva a reputação junto. Risco assimétrico: alto impacto, custo de correção baixo. |
| Infra, CI/CD e DX (P03/P05/P08) | 10% | 34 | 3,40 | Quebra o site. 25 commits publicados no vazio em silêncio provam que a esteira não protege nada. Sem isso funcionando, nenhuma correção das outras nove dimensões chega ao ar de forma confiável. |
| Segurança técnica (P07) | 8% | 42 | 3,36 | Quebra o site e vaza dado sensível de saúde. Peso menor que infra porque o artefato publicado é estático e a superfície real de ataque é pequena; o problema é a política morar fora do repositório. |
| Performance e CWV (P06) | 6% | 58 | 3,48 | É desempate de ranqueamento, não porta de entrada. Com 91 a 100 de performance nas páginas reais, o ganho marginal de subir o LCP é menor que o de existir conteúdo. Os 3,88 MB da home ainda custam plano de dados do paciente. |
| Acessibilidade WCAG (P09) | 5% | 52 | 2,60 | Obrigação ética e legal, com efeito indireto em SEO (semântica, landmarks). Não é o que separa a ecooa do top1 hoje. |
| UX, UI e design system (P11) | 4% | 44 | 1,76 | O acabamento visual já entrega a percepção premium. A dívida é de manutenção futura, não de resultado imediato no objetivo. |
| **Total** | **100%** | | **41,9** | |

### Como ler 41,9

A ponderada (41,9) fica **abaixo** da média simples (43,6). Isso não é ruído: é
a conclusão do exercício. As duas dimensões em que a ecooa está melhor,
performance (58) e conversão (57), são as que menos pesam no objetivo; as três
em que está pior, analytics (26), conteúdo (33) e infra (34), são as que mais
pesam. **O esforço técnico investido até aqui foi aplicado onde menos
importa para o top1.**

Leitura em uma frase: o site é bem construído e bem acabado, mas não tem o que
ranquear, não é encontrável localmente, não mede nada e não consegue provar
formalmente nada do que afirma sobre si mesmo.

---

## 3. Todos os achados críticos e altos, deduplicados e ordenados por impacto no top1

94 achados críticos e altos foram reportados pelas 10 auditorias. Depois de
deduplicar sobreposições (os 12 artigos vazios apareceram em 4 dimensões, a CSP
do painel em 4, o gate de CI que mede o site errado em 3, a prova social e o
link `tel:` em 2 cada), restam **73 achados distintos**, numerados de forma
contínua abaixo.

Legenda: **[C]** crítico na dimensão de origem, **[A]** alto. **IA** = corrigível
por IA sem o dono. **Dono** = exige acesso, dado ou decisão que a IA não tem.

### Bloco A. Não existe o que ranquear (o top1 é impossível hoje)

| # | Achado | Arquivo | Quem corrige |
| ---: | --- | --- | --- |
| 1 | **12 dos 14 artigos têm zero parágrafo de corpo.** O editorial inteiro soma 495 palavras, média de 35 por artigo. São 12 URLs indexáveis de saúde YMYL entrando no ar como conteúdo raso, com 72% a 90% do texto duplicado de outras páginas. Causa: `CORPOS = {}` e o campo `corpo` só existe em 2 dos 14 registros. **[C]** | `scripts/corpos-artigos.mjs` (última linha), `deploy/dados-ecooa.js` | IA redige, autor revisa e assina |
| 2 | **O site anuncia "8 min de leitura" e "base científica, atualizado" para páginas sem texto e sem fonte.** Afirmação factualmente falsa na página, exatamente o padrão que o Search Quality Rater trata como enganoso em YMYL. **[C]** | `deploy/index.html`, `deploy/blog.html` | IA |
| 3 | **Zero referências, zero `dateModified` e zero revisão declarada em 14 artigos de saúde.** 0 links externos de citação, 0 `dateModified` em 95 arquivos, 0 `reviewedBy`. `author` no schema traz só `{name, jobTitle}`, sem `url` nem `sameAs`, e o bloco "quem escreve" não linka `/profissionais/<slug>/`, que agora existe. **[A]** | `scripts/artigos.mjs` | IA |
| 4 | **Nenhuma política editorial publicada num site de saúde YMYL.** Não existe página nem seção explicando quem escreve, quem revisa, com que critério, com que frequência e como um erro é corrigido. É o item de Trust que o Google cita nominalmente. **[A]** | ausente em todo o `deploy/` | IA redige, dono aprova |
| 5 | **Palavra-chave comercial ausente do title e do H1 em 6 das 7 consultas cobertas.** Para "nutricionista moinhos de vento", "transplante capilar porto alegre", "harmonização facial porto alegre", "psicólogo porto alegre", "dermatologista porto alegre" e "emagrecimento porto alegre" o termo só aparece na meta description. Botox, preenchimento labial e reposição hormonal não têm página dedicada. **[A]** | `deploy/especialidades/*/index.html` | IA |
| 6 | **Bairro no title em 6 de 67 páginas, e os 14 artigos não têm cidade nem bairro.** Inclui `blog/transplante-capilar-porto-alegre/` e `blog/rejuvenescimento-facial-porto-alegre/`, cujos slugs são geolocalizados e cujos titles não são. São as consultas de maior intenção comercial local do editorial inteiro. **[A]** | `scripts/artigos.mjs` | IA |
| 7 | **24 das 31 URLs do sitemap dividiam o `<title>` com outra página.** 22 subpáginas herdavam literalmente o título do hub. `og:title` era único em 33 de 35, provando que o defeito era do gerador. **[C] [superado no rebuild: 62 títulos únicos em 62 páginas]** O achado permanece porque o defeito atravessou o build, o `validate-output.mjs` e o deploy sem nenhum alarme: **falta gate de unicidade de title e description.** | `scripts/validate-output.mjs` | IA |
| 8 | **Zero dados estruturados de negócio local em todo o site.** 0 `MedicalClinic`, 0 `LocalBusiness`, 0 `BreadcrumbList`; home e `/localizacao` sem nenhum JSON-LD. O gerador existia e nunca havia rodado. **[C] [superado no rebuild: 34 `MedicalClinic`, 53 `BreadcrumbList`]** Permanece o resíduo do item 11. | `scripts/estruturados.mjs` | IA |
| 9 | **98% dos links internos apontam para a forma que o próprio site declara não ser canônica.** 1.411 links `.html` contra 28 sem extensão. Ambas respondem 200, o Google rastreia as duas e a consolidação depende inteiramente do canonical. Quase toda a autoridade interna vai para a URL errada. **[A]** | `deploy/*.html` (todas as páginas reais) | IA |
| 10 | **20 URLs legadas redirecionam para o hub genérico em vez da página específica que existe.** `especialidade/capilar` deveria ir para `/especialidades/tricologia/`, `psicologia` para `/especialidades/saude-mental/`. Redirecionar muitas URLs distintas para uma página genérica é o padrão que o Google trata como soft 404 e descarta o sinal. **[A]** | `deploy/especialidade/*/index.html` (16), `deploy/ecooa-*/index.html` (4) | IA |
| 11 | **NAP divergente dentro do próprio schema: 31 páginas de perfil emitem endereço diferente das 3 canônicas.** 31 ocorrências de `"Rua Mariante, 180"` contra 3 de `"Rua Mariante, 180, 9º andar"`, sem `@id`, sem `postalCode`, sem `telephone`. Divergência de NAP dentro do próprio site é o que derruba ranqueamento local, e aqui ela é gerada pelo build. **[A na origem, elevado aqui]** | `scripts/estruturados.mjs` (bloco `worksFor`) | IA |
| 12 | **28 redirecionamentos são meta refresh sem `noindex`, não 301.** Consomem orçamento de rastreio, não garantem transferência de sinal e podem ser indexados com o título "Página movida". **[A]** | `deploy/*/index.html` (28 pontes) | IA faz o `noindex` e o destino; o 301 real é do dono (painel) |
| 13 | **Dois arquivos duplicados exatos criam duas URLs 200 para `/blog` e `/especialidades`.** Diferem em uma única linha (`<base href="/">`). Ambos órfãos, com 0 links internos: existem por acidente de geração. **[A]** | `deploy/blog/index.html`, `deploy/especialidades/index.html` | IA |

### Bloco B. Não é encontrável nem mensurável (a aquisição é cega)

| # | Achado | Arquivo | Quem corrige |
| ---: | --- | --- | --- |
| 14 | **Google Business Profile não reivindicado, sem avaliações e sem coordenada geográfica em nenhuma página.** Para clínica de bairro o GBP pesa mais que o site inteiro na aquisição local. 0 links `g.page`, `maps/place` ou `?cid=`; 0 `aggregateRating`; 0 `GeoCoordinates`. O único link de mapa é uma URL de busca por texto, que não consolida entidade. **[C]** | fora do repositório | **Dono** |
| 15 | **A CSP de produção não tem `connect-src` e bloqueia todo hit do GA4.** Medido no navegador: `connect-src :: https://www.google-analytics.com/g/collect` e `region1.google-analytics.com`. O `fetch` falha com `TypeError` e o `sendBeacon` retorna `true` mesmo bloqueado, o que remove o sinal de falha. A medição instalada em 66 páginas não mede nada. **[C]** | painel Cloudflare (`deploy/_headers:7` já está correto e é ignorado) | **Dono** |
| 16 | **Nenhuma tag configurada dentro do container GTM-TSR4GDMK.** 0 ocorrências de ID `G-` no HTML, 0 de `googletagmanager.com/gtag/js`. O container carrega e nenhuma tag consome os eventos que o dataLayer empurra. **[C]** | painel `tagmanager.google.com` | **Dono** |
| 17 | **Zero captura de UTM, gclid ou fbclid, e nada de origem viaja para o WhatsApp.** Carregar `/?utm_source=...&gclid=...` não gera push, não persiste em `sessionStorage` nem em `localStorage`. As 484 mensagens de WhatsApp levam contexto humano e nenhum dado de campanha. Não existe caminho, nem parcial, entre um real gasto e um paciente atendido. **[C]** | `scripts/medicao.mjs:93-111` | IA |
| 18 | **`frame-src` ausente bloqueia o Preview do GTM e o Tag Assistant em produção.** O dono configuraria as tags, veria o Preview falhar sem explicação e não teria como descobrir que a causa é a CSP. A mesma trava impede qualquer mapa embutido. **[A]** | painel Cloudflare | **Dono** |
| 19 | **12 dos 15 eventos planejados não existem, e dois documentos de `docs/` descrevem instrumentação que não está no ar.** `EVENTS_TRACKING_PLAN.md` afirma que `form_submit_success` já é empurrado (é falso) e `GTM-DATA-INTENTS.md` manda montar gatilhos sobre `data-intent`, que tem 0 ocorrências. Quem seguir esses documentos monta gatilhos que nunca disparam. **[A]** | `docs/EVENTS_TRACKING_PLAN.md`, `docs/GTM-DATA-INTENTS.md` | IA |
| 20 | **`form_submit` reporta sempre `formulario:newsletter`.** A classificação é `input[type=email] && !input[type=tel]`, e `type="tel"` tem 0 ocorrências no deploy: o ramo "lead" é código morto. Os 3 formulários enviados produziram todos `newsletter`. Qualquer relatório de conversão por tipo de formulário será falso. **[A]** | `scripts/medicao.mjs:131` | IA |
| 21 | **Envio de formulário gera `whatsapp_click` sintético e infla a conversão principal.** A âncora oculta criada por `conversao.mjs` é capturada pela delegação de clique. Se `whatsapp_click` virar conversão no GA4, todo envio contará duas vezes. **[A]** | `scripts/medicao.mjs:114-124` + `scripts/conversao.mjs:95-105` | IA |
| 22 | **Cliques de WhatsApp colidem entre si e o botão flutuante sai sem rótulo.** Home: 6 CTAs em 4 chaves. `/localizacao`: 8 em 6. O canal principal da estratégia sai com rótulo vazio e posição "corpo", indistinguível de qualquer outro CTA. **[A]** | `scripts/medicao.mjs:114-124` | IA |
| 23 | **Dimensão `pagina` fragmentada entre URL com `.html` e URL canônica limpa.** Eventos saem com `mentorias.html`, canonical e sitemap declaram `/mentorias`. Quem chega do Google cai numa, quem navega cai noutra: a mesma página gera dois valores e nenhum relatório fecha. **[A]** | `scripts/medicao.mjs:94` | IA |
| 24 | **As 29 páginas sem medição são justamente as de tráfego legado, e o redirecionamento apaga a origem externa.** 28 pontes e a 404 não têm o bloco de medição. Como o refresh é same-origin, o destino recebe `document.referrer` do próprio domínio, o GA4 descarta a autorreferência e todo backlink antigo vira `direct/none`. **[A]** | `scripts/medicao.mjs:219-223` | IA |
| 25 | **Zero links `tel:` no site inteiro.** O número aparece 40 vezes como texto, sempre embrulhado num link `wa.me`. Quem prefere ligar, quem está sem WhatsApp ou quem é idoso não tem caminho de um toque. Canal invisível e não mensurável. **[A]** | rodapé de `deploy/*.html`, origem em `src-site-3/Rodape.dc.html` | IA |
| 26 | **A medição de conversão depende de opt-in e não é verificável.** Quem ignora o aviso não gera dado utilizável, não há medição de servidor nem de primeira parte, e não existe linha de base histórica de espécie alguma. **[A]** | `scripts/medicao.mjs` | IA mitiga, dono decide política |

### Bloco C. Risco de veto (pode tirar o ativo do ar, independente de posição)

| # | Achado | Arquivo | Quem corrige |
| ---: | --- | --- | --- |
| 27 | **Política de privacidade publicada declarando-se rascunho não validado por advogado.** Primeiro parágrafo visível: "Este texto é um rascunho preparado para revisão jurídica. Ele ainda não foi validado por um advogado e não deve ser publicado como definitivo." É o destino dos três links do rodapé de 62 páginas e do link dentro do banner de consentimento. Qualquer reclamação na ANPD começa com essa frase como prova produzida pelo próprio réu. **[C]** | `deploy/politicas.html` | **Dono (jurídico)** |
| 28 | **O link da política retorna 404 em 53 das 62 páginas.** O rodapé usa `href="politicas.html#privacidade"`, relativo. Em qualquer página aninhada resolve para o diretório da página. Quebra exatamente nas 8 especialidades, nos 31 perfis e nos 14 artigos, que são as páginas de entrada orgânica, e quebra dentro do banner de consentimento. **[C]** | rodapé gerado por `scripts/gerar-site.mjs` a partir de `src-site-3/Rodape.dc.html` | IA |
| 29 | **Cinco profissionais anunciados sem nenhum número de registro, em 28 aparições.** Giancarla Rochemback (14 páginas), Adriana (5), Marvin Marques (3), Gabrieli Klagenberg Ávila (3), Lara Caye (3). Todos com página de perfil própria e CTA de agendamento. A Resolução CFN 599/2018 obriga o CRN em qualquer divulgação de serviço. Adriana é o caso mais grave: "terapeuta integrativa" não é profissão regulamentada e ela é indicada pelo ecooa.match na posição 04 para a queixa "ansiedade", ao lado de três psicólogos com CRP. **[C]** | `deploy/dados-ecooa.js`, `deploy/profissionais/<slug>/index.html` | IA aplica, **dono fornece os registros** |
| 30 | **A ressalva de registro em validação não existe, mas a página de termos afirma ao público que existe.** 0 ocorrências de "ressalva", "em validação" e "registro em validação" nas 62 páginas. Os 5 com estado `a-confirmar` são exibidos como se fosse confirmado, e `/profissionais/vitoria-serpa/` publica JSON-LD com `"identifier":"CRN-2 12000P"` sem ressalva. Uma declaração pública falsa converte um controle interno em informação enganosa. **[C]** | `deploy/politicas.html`, `scripts/perfis.mjs` | IA |
| 31 | **Disclaimer médico ausente nas 39 páginas que descrevem serviço e conduta.** "Não substitui consulta" existe em 15 de 95 arquivos: os 14 artigos e a política. As 8 especialidades (que listam procedimentos e indicações) e os 31 perfis (que descrevem queixa a queixa o que cada um faz, incluindo atendimento de bebês) não têm nenhum. `TONE_OF_VOICE.md` exige explicitamente. **[C]** | `scripts/areas.mjs`, `scripts/perfis.mjs` | IA |
| 32 | **Médica anunciada como "especialista" e "tricologista" com CRM e sem RQE, em 5 páginas.** "Médica tricologista, empreendedora e especialista no diagnóstico e tratamento médico das alopecias", CRM-RS 49.185. Dois vícios: título de especialista sem RQE viola os arts. 115 e 118 do CEM (Resolução CFM 2.217/2018), e "tricologista" não consta da lista de especialidades reconhecidas. As duas dermatologistas da casa exibem RQE corretamente, o que prova que é falha de copy. **[C]** | `deploy/dados-ecooa.js` (bio de `yale-jeronimo`) | IA |
| 33 | **O site chama 31 pessoas de "especialistas" no title indexado, com 2 RQE publicados.** `<title>` de `/profissionais`: "31 especialistas em Moinhos de Vento, Porto Alegre". Meta description da home: "mais de 30 especialistas". Está em title e meta description, ou seja, aparece no resultado de busca, que é onde o conselho fiscaliza. CDC art. 37, par. 1. **[A]** | `deploy/profissionais.html`, `deploy/index.html` | IA |
| 34 | **Biorressonância anunciada com verbo avaliativo e efeito terapêutico, por profissional sem conselho.** 13 ocorrências em 5 páginas: "avalia desequilíbrios do organismo", "trabalha gatilhos e o equilíbrio do organismo nas dores de cabeça recorrentes". Sem disclaimer, sem ressalva de registro, e o JSON-LD a declara `Person` em `worksFor MedicalClinic`. Há mitigação no FAQ ("não tem valor diagnóstico"), que reduz mas não elimina. CEM arts. 112 e 113, Lei 12.842/2013 art. 4, CDC art. 36 parágrafo único. **[A]** | `deploy/profissionais/adriana/index.html`, `deploy/especialidades/saude-integrativa/index.html` | **Dono decide** (IA executa a redação) |
| 35 | **Harmonização orofacial, especialidade odontológica, anunciada por cinco não dentistas.** 37 ocorrências em 12 páginas: 4 biomédicas e 1 farmacêutica anunciam a área contra 1 cirurgiã-dentista. As resoluções CFBM 197/2011 e CFF 573/2013 habilitam procedimentos, nenhuma cria a titulação. Disputa em curso entre CFO, CFBM e CFF com decisões judiciais divergentes. **[A]** | `deploy/dados-ecooa.js` (campo `area` de 5 slugs) | **Dono (jurídico)** |
| 36 | **Sem CNPJ, sem razão social e com um único responsável técnico para 9 classes anunciadas.** O rodapé traz só "RT Gustavo Gehrke · CREMERS 35.822". 0 ocorrências de CNPJ, 0 de razão social, 0 de "responsável técnico" por extenso. O site se apresenta como clínica multidisciplinar em 35 páginas e anuncia 9 classes. Resoluções CFM 2.336/2023, 2.147/2016 e 2.056/2013; CDC art. 31. **[A]** | rodapé de 62 páginas, `src-site-3/Rodape.dc.html` | **Dono (jurídico + conselhos)** |
| 37 | **Categoria de saúde inferida enviada ao GTM antes de qualquer consentimento.** Medido: com o banner ainda na tela, o dataLayer já continha `{"event":"match_resultado","bloco":"saúde mental",...}`. O Consent Mode nega o armazenamento mas não impede a transmissão do hit e do IP ao Google. O link de WhatsApp gerado também carrega a categoria. LGPD arts. 5 II e 11. **[A]** | `scripts/medicao.mjs` (listeners que chamam `carregaGTM` sem checar consentimento) | IA |
| 38 | **Queixa clínica em texto livre é embutida em URL `wa.me` da Meta, contrariando a política publicada no mesmo domínio.** Teste com Playwright: "queda de cabelo, ansiedade e insonia ha 6 meses" vai inteira na query string de um redirecionador da Meta. A política afirma literalmente "Não coletamos dados de saúde por meio deste site". **[C]** | `deploy/qual-profissional-procurar.html:1615` e `:694` | IA (mitiga), dono decide a política |
| 39 | **Sócia fundadora anunciada como médica sem número de CRM.** Scheila Andrzejewski é a única profissional de saúde nomeada no site sem registro. CEM art. 117. **[A]** | `deploy/sobre.html` ("nossa origem") | IA aplica, **dono fornece o CRM** |
| 40 | **Zero prova social em toda a superfície, contra exigência do próprio brandbook.** 0 depoimentos, 0 avaliações, 0 estrelas, 0 `g.page`, 0 contadores. O `BRANDBOOK-ECOOA.md` seção 9 define a estrela 5.0 no Google como "a prova social máxima da marca". Numa decisão de alta confiança, o site pede que a pessoa abra uma conversa sem nenhum sinal de terceiro. **[A]** | todo o `deploy/` | **Dono (GBP)** |
| 41 | **114 blocos com 684 palavras-chave despejadas no texto visível, incluindo termos de luto.** Em `/profissionais/adriana/`, sob "Saúde mental": "Também procurado como: perdi minha mae, perdi meu pai, falecimento, nao aguento mais, nao to conseguindo". Keyword stuffing pela definição da política de spam do Google, expõe termos de sofrimento agudo colados a uma prática sem registro, e responde por boa parte dos 39% de duplicação interna. **[A]** | `scripts/almanaque.mjs` consumido por `scripts/perfis.mjs` | IA |
| 42 | **110 palavras portuguesas sem acento no texto visível, contra regra explícita do projeto.** `nutricao` 22, `nao` 15, `medica` 7, `cabeca` 6, `mae` 5. Concentradas nos blocos do item 41. **[A]** | `scripts/almanaque.mjs` | IA |

### Bloco D. Perde o lead que já chegou

| # | Achado | Arquivo | Quem corrige |
| ---: | --- | --- | --- |
| 43 | **O aviso de consentimento cobre o botão flutuante de WhatsApp no celular.** Home 390x844, primeira visita: o banner `[12,690,378,832]` z-index 9998 contém inteiramente o botão `[314,768,374,828]` z-index 70. `elementFromPoint` no centro do botão retorna o banner. Somado ao item 45, todo visitante de primeira viagem fica sem CTA alcançável até fechar o aviso. **[C]** | `scripts/medicao.mjs` (função `aviso`) | IA |
| 44 | **Os três formulários declaram sucesso sem verificar se algo abriu.** O botão vira "conversa aberta" imediatamente após disparar a navegação. No teste, a aba de destino terminou em `chrome-error://chromewebdata/` e o site declarou sucesso do mesmo jeito. Sem plano B, sem gravação em servidor, sem evento de falha. O lead evapora e a pessoa acredita que enviou. **[C]** | `scripts/conversao.mjs` (`JS_NEWS` 34-61, `jsLead` 65-113) | IA |
| 45 | **21 de 62 páginas sem CTA textual acima da dobra no celular.** Inclui os 14 artigos, que são a porta de entrada orgânica, mais `/sobre`, `/especialidades`, `/profissionais`, `/qual-profissional-procurar`, `/blog`, `/mentorias` e `/sublocacao`. Nessas, o único elemento de conversão visível é o botão flutuante, coberto pelo banner. **[A]** | `deploy/blog/*/index.html` e 7 páginas raiz | IA |
| 46 | **Formulário de newsletter existe em apenas 9 das 62 páginas.** Ausente nas 8 especialidades, nos 31 perfis e nos 14 artigos. São 53 páginas, incluindo todas as portas de entrada orgânicas, sem forma de capturar contato de quem ainda não quer falar no WhatsApp. **[A]** | rodapé sem `<form>` nas subpáginas, `src-site-3/Rodape.dc.html` | IA |
| 47 | **Preço, convênio e formato de atendimento só existem nas FAQs de 8 páginas de área.** Preço em 2 páginas, convênio em 1, reembolso em 1, telemedicina em 1. A home, os 31 perfis e os 14 artigos não respondem nenhuma dessas objeções. O melhor material de objeção do site está preso onde a maioria do tráfego não passa. **[A]** | `deploy/especialidades/*/index.html` | IA |

### Bloco E. A esteira não protege nada (nenhuma correção acima chega ao ar com segurança)

| # | Achado | Arquivo | Quem corrige |
| ---: | --- | --- | --- |
| 48 | **O CI nunca roda no caminho que o código de fato usa: 0 de 40 commits por PR.** `ci.yml` só dispara em `pull_request` e `workflow_dispatch`. `origin/main` aponta para o mesmo SHA de um branch, sem merge nem squash: push direto. `format:check`, `astro check`, `lint`, `npm audit`, `build`, `validate:output` e Lighthouse foram pulados 40 vezes seguidas. **[C]** | `.github/workflows/ci.yml:4-6` | IA |
| 49 | **O CI está vermelho agora.** `npx prettier --check .` sai com 1 (10 arquivos em `scripts/`) e `npm audit --audit-level=high` sai com 1 (`brace-expansion`, GHSA-mh99-v99m-4gvg, CVSS 7.5, correção disponível). Qualquer PR aberto hoje falha. Causa mecânica dos 10 arquivos: `lint-staged['scripts/*.mjs']` roda `eslint --fix` **sem** `prettier --write`. **[C]** | `scripts/*.mjs`, `package-lock.json`, `package.json:26-39` | IA |
| 50 | **O deploy quebrou duas vezes em 3 dias e ficou 25 commits congelado, em silêncio absoluto.** `d181388` apagou `deploy/support.js` sem tocar no gate que o exigia: 22 commits sem publicar. `fb6306a` consertou e introduziu `validate-output.mjs` num job sem `dist/`: mais 3. Entre os 25 estão `79c5ac7` (queixa de saúde vazando na URL) e `890f1c8` (título duplicado em 22 de 31 URLs). Não há notificação, badge, monitor nem smoke test pós-publicação. **[C]** | `.github/workflows/deploy.yml` | IA |
| 51 | **O Teste do Clone Limpo falha: 23 de 30 scripts hardcodam `/home/user/ecooa-website`.** Rodar do clone **sobrescreve o `deploy/` do repositório original**. Mais 5 scripts com `executablePath` fixo em `/opt/pw-browsers/`, sem `postinstall` de `playwright install`. Depois de reapontar a raiz, o build reproduziu `deploy/` byte a byte (157/157 MD5 idênticos): o conteúdo é reprodutível, o procedimento não. **[C]** | `scripts/gerar-site.mjs:20` e mais 22 | IA |
| 52 | **A CSP que chega ao visitante não vem do repositório e diverge dele em 7 diretivas.** `deploy/_headers` é servido como conteúdo público (HTTP 200, 1599 B), prova de que a plataforma não o consome. A política real vive numa regra de painel Cloudflare, sem versionamento, sem revisão, sem teste e sem sinal no repositório quando muda. `git revert` não a alcança. Faltam nela `frame-ancestors` (clickjacking sobre a única conversão do site), `connect-src`, `form-action`, `base-uri` e `report-uri`; sobram 5 origens de script que nenhuma das 95 páginas usa, incluindo o coringa `*.clarity.ms`. Sem HSTS em lugar nenhum. **[C + 4 achados altos consolidados]** | painel Cloudflare vs `deploy/_headers` | **Dono** |
| 53 | **O artefato publicado é validado por 6 `test -f` e 2 `grep`, e o grep cobre 11 de 95 HTML.** `deploy/*.html` não recorre em subdiretórios: as 84 subpáginas ficam fora. O `validate-output.mjs`, com 400 linhas de invariantes reais, não roda no deploy. **[A]** | `.github/workflows/deploy.yml:23-33` | IA |
| 54 | **O gate bloqueante do Lighthouse mede 5 stubs de redirect e ignora 6 das 9 rotas estratégicas.** De 9 URLs, 5 são pontes de 454 a 529 bytes (`/match/` retorna `ERRORED_DOCUMENT_REQUEST`) e 2 não existem em disco. Sobram 2 páginas reais de 31 URLs. Ficaram fora `/sobre`, `/especialidades`, `/qual-profissional-procurar`, `/localizacao`, `/mentorias` e `/sublocacao`. O job mobile ainda tem `continue-on-error: true` com todas as assertivas em `warn`: não pode reprovar nada. **[C+A consolidados de 3 dimensões]** | `lighthouserc.json:5-15`, `lighthouserc.mobile.json`, `ci.yml:86-94` | IA |
| 55 | **O gerador do site publicado não tem script npm e nunca é exercitado pelo pipeline.** `gerar-site.mjs` não aparece em `package.json scripts` nem em nenhum workflow. Mais de 300 KB de `.mjs` que constroem o site real sem cobertura de CI. **[A]** | `package.json:9-24` | IA |
| 56 | **`deploy/` acumula três papéis incompatíveis, sem trava de concorrência.** Saída do build, entrada do mesmo build e artefato versionado, escrito in place por caminho absoluto. Observado ao vivo durante esta auditoria: 11 HTML e 2 scripts modificados por outro processo em 15 minutos. O `deploy.yml` publicaria esse estado intermediário sem detectar nada. **[A]** | `scripts/gerar-site.mjs:47-52` | IA |
| 57 | **O gate de saída está vermelho com 14 violações, duas rotuladas como LGPD pelo próprio código.** "Sem camada de medição" nas 11 páginas da raiz e "Consent Mode sem `analytics_storage` negado por padrão (LGPD)". **[A] [superado no rebuild: GTM e Consent Mode aplicados]** Permanece porque o gate não roda no caminho de publicação. | `scripts/validate-output.mjs:307-316` | IA |
| 58 | **Endpoint do Google Apps Script publicado como "Execute as: Anyone" commitado em claro.** URL completa em dois arquivos versionados. O Web App grava em planilha e dispara e-mail; é escrita anônima. O site publicado não o usa, mas o endpoint segue vivo. **[A]** | `src/data/constants.ts:33`, `docs/_legacy/SKILL-MAXIMA-ECOOA.md:49` | IA rotaciona, **dono revoga no Apps Script** |
| 59 | **Nenhuma varredura de segredos no CI.** 0 acertos para gitleaks, trufflehog, semgrep, codeql e snyk em `.github/`. A árvore atual está limpa, mas nada impede o próximo commit de vazar. `QUALITY_GATES.md` declara CodeQL BLOQUEANTE sem que exista workflow correspondente. **[A]** | `.github/workflows/ci.yml` | IA |
| 60 | **Home entrega 3.884 KB de rede para desenhar o equivalente a 143 KB de pixels úteis.** 52 requisições ao rolar até o rodapé, 3.679 KB só de imagem. Os 33 retratos somam 2,48 MB e são renderizados a 121x152 CSS px; recomprimidos a 224px WebP q75 somam 143 KB. 94,4% de desperdício, 2,34 MB cobrados do plano de dados do paciente por visita. Zero `srcset`, zero `<picture>`, zero AVIF, zero `preload` em todo o site. **[C+A consolidados]** | `deploy/index.html`, `deploy/assets/retratos/*.webp`, `deploy/profissionais.html` | IA |
| 61 | **LCP mobile estoura o teto de 2500 ms do próprio projeto em 4 de 11 páginas.** Home 3301 ms (32% acima, estável em 3 execuções), `/localizacao` 2702, `/profissionais` 2660, `/sublocacao` 2627. As duas páginas de maior valor comercial estão entre as que falham. **[A]** | `deploy/index.html` e 3 páginas | IA |
| 62 | **Nenhuma das 31 páginas tem `<main>` nem skip link.** 0 de 31 em ambos. Sem nenhuma das duas técnicas aceitas para SC 2.4.1 (nível A), o usuário de teclado precisa de 14 Tabs para atravessar o cabeçalho em cada navegação. Produz 451 nós fora de landmark e é a causa única da nota 98 no Lighthouse na maioria das páginas. **[C]** | `deploy/*.html`, origem em `src-site-3/` e `scripts/gerar-site.mjs` | IA |
| 63 | **O autocomplete do ecooa.match não tem rótulo, não tem semântica de combobox e destrói o foco 140 ms após o Tab.** Sem `<label>`, `aria-label`, `role=combobox`, `aria-expanded`, `aria-activedescendant`. `campo.addEventListener('blur', () => setTimeout(fecha, 140))` e `fecha()` faz `painel.innerHTML = ''`: qualquer pausa humana normal entre teclas manda o foco para o `body`. Reprova 4.1.2, 3.3.2 e 2.4.3, todos nível A. **[C]** | `scripts/match.mjs:243-320` | IA |
| 64 | **Anel de foco global a 1,45:1, praticamente invisível em todas as páginas.** `#c6c4bf` sobre `#eceae4`. O SC 1.4.11 exige 3:1. É o token padrão: atinge todo link e botão do cabeçalho, o CTA "agendar", o rodapé e o autocomplete, nas 31 páginas. **[A]** | token `:focus-visible` global | IA |
| 65 | **Zero regiões `aria-live` em todo o site.** 0 elementos com `aria-live`, `role=status` ou `role=alert`. O resultado da busca substitui o conteúdo principal, o foco cai no `body` e nada é anunciado. Reprova SC 4.1.3. **[A]** | `deploy/*.html`, `scripts/match.mjs`, `scripts/conversao.mjs` | IA |
| 66 | **`DESIGN_SYSTEM.md` descreve um sistema que não existe no site publicado.** 0 ocorrências das 5 classes de botão documentadas, 0 dos tokens `--space-*`, `--radius-*`, `--shadow-*`, `--z-*`, 0 de Playfair, 0 dos breakpoints 480/768/1024. Afirma "cantos retos, sem border-radius" num site com 798 usos de `999px`. Quem seguir o documento produz código que não integra. **[C]** | `docs/DESIGN_SYSTEM.md` | IA |
| 67 | **Hover e `:active` não existem como estados de interface.** 0 de 89 alvos testados mudaram qualquer propriedade ao receber o ponteiro. `:active` tem 0 ocorrências em 95 arquivos. O canal principal de conversão não dá retorno visual algum. **[C]** | `deploy/*.html` (8 das 12 páginas principais têm 0 regras `:hover`) | IA |
| 68 | **1.195 verificações de contraste inconclusivas: texto sobre foto nunca foi validado.** O axe marca 30 a 71 nós por página como `incomplete` por `background-image` ou `backdrop-filter`. O hero da home, os cartões de perfil e todas as faixas fotográficas têm texto cujo contraste real nunca foi medido. Maior área cega de acessibilidade visual do site. **[A]** | `deploy/index.html`, `deploy/sobre.html`, `deploy/profissionais.html` | IA mede, humano julga o pior caso |
| 69 | **30,5% dos bytes de HTML são atributo `style` inline; zero arquivo CSS.** 17.174 atributos somando 1.810 KB, mais 872 KB de blocos `<style>`. O bloco `:root` é duplicado 201 vezes (188,8 KB só de tokens repetidos). Trocar uma cor de marca exige editar 95 arquivos. Não é só artefato de pré-render: o fonte já tem 191 atributos e o build multiplica por 3,1x. **[A]** | `deploy/profissionais.html` (610), `deploy/index.html` (584) | IA |
| 70 | **Não existe escala tipográfica: 78 tamanhos de fonte computados distintos**, incluindo 20 degraus de meio pixel entre 8px e 17,5px, mais 137 line-heights, 72 letter-spacings e 11 breakpoints com três pares quase idênticos (859/860, 1023/1024, 1079/1080). 60,5% dos 1.498 `box-shadow` contornam o token, 33 deles redigitando o valor à mão. Nenhum token de espaçamento, raio, z-index ou duração. **[A consolidados]** | `deploy/*.html`, bloco `:root` em 201 cópias | IA |
| 71 | **Nenhum portão automático de qualidade além do que já foi listado.** Sem axe no CI, sem stylelint, sem regressão visual, sem validação de token, sem gate de contraste, sem gate de unicidade de title. A dispersão medida cresceu até aqui porque nenhuma ferramenta olha para ela. **[A consolidados de P09 e P11]** | `.github/workflows/ci.yml` | IA |
| 72 | **`PERFORMANCE_BUDGET.md` descreve um site que não está mais no ar.** Baseline de 2026-05-31, último commit em 2026-06-29, site publicado entrou em 2026-07-29. Declara LCP mobile 1,2 s (medido: 1501 a 3301 ms), performance 100 (medido: 91 a 100), JS 4-40 KB (medido: 58-134 KB), hero AVIF (existem 0 AVIF), 2 famílias de fonte self-hosted (0 fontes web carregadas). Induz qualquer leitor, humano ou IA, a acreditar que a performance está resolvida. **[A]** | `docs/PERFORMANCE_BUDGET.md:6-45` | IA |
| 73 | **Orçamento de JS de 50 KB por página estourado nas 4 páginas medidas**, com `/qual-profissional-procurar` em 133.979 B (2,7x o teto), dos quais um único bloco `<script>` inline de 72.865 B. `dados-ecooa.js` (41,9 KB) é servido em 29 páginas, inclusive onde o Lighthouse marca 23 KiB de `unused-javascript` com score 0. **[A]** | `deploy/qual-profissional-procurar.html`, `deploy/dados-ecooa.js` | IA |

---

## 4. Itens que exigem o dono

29 achados de todas as severidades vieram marcados como `corrigivel_por_ia: false`
ou dependem de dado que só o dono possui. Agrupados pelo tipo de acesso.

### 4.1 Painel Cloudflare (a CSP e os cabeçalhos reais)

A regra de CSP do painel é hoje o único ponto do sistema que **nenhuma pessoa
do repositório controla** e que quebra três dimensões ao mesmo tempo.

1. Adicionar `connect-src` com os endpoints do GA4. Sem isso, toda a medição
   continua entregando zero. (Achado 15)
2. Adicionar `frame-src` com `googletagmanager.com` (Preview do GTM) e
   `google.com` (mapa de `/localizacao`). (Achados 18, e o mapa ausente)
3. Adicionar `frame-ancestors 'none'`. Sem ela não há proteção de clickjacking
   sobre o botão de WhatsApp, que é a única conversão do site. (Achado 52)
4. Adicionar `form-action`, `base-uri` e `report-uri` ou `report-to`. Hoje
   nenhuma violação em produção é reportada a ninguém. (Achado 52)
5. Remover as 5 origens de script que nenhuma página usa, incluindo o coringa
   `*.clarity.ms`. (Achado 52)
6. Ligar HSTS (`Strict-Transport-Security`). 0 ocorrências em todo o repositório.
7. Decidir se a CSP passa a viver no repositório (via Cloudflare Workers, já
   decidido no P03 e com `wrangler.jsonc` pronto) ou se o painel vira parte
   documentada do processo de revisão. Enquanto ficar como está, `git revert`
   não alcança a política de segurança do domínio.
8. Confirmar `Cache-Control` imutável para `/assets/*`. O `deploy/_headers` já
   define, e é ignorado pelo GitHub Pages.

### 4.2 Contas Google (Business Profile, GTM, GA4, Search Console)

9. **Reivindicar e completar o Google Business Profile.** Categorias, NAP
    idêntico ao do site, horário, fotos, serviços. É o maior item isolado de
    aquisição local e está zerado. (Achado 14)
10. **Pedir e responder avaliações.** O `BRANDBOOK-ECOOA.md` exige a estrela 5.0
    com link `g.page` como prova social máxima da marca, e o site tem zero.
    (Achado 40)
11. Fornecer a **coordenada geográfica exata** da sala para o schema. Foi
    deixada de fora de propósito para não chutar, o que foi correto.
12. Criar a **propriedade GA4**, configurar as tags no container GTM-TSR4GDMK,
    ligar os gatilhos de `whatsapp_click`, `form_submit` e `match_resultado`, e
    publicar a versão. (Achado 16)
13. Verificar o domínio na **Search Console** e enviar o sitemap. Sem isso não
    há como saber quantas das 62 URLs estão indexadas nem se as páginas rasas
    já foram desqualificadas.
14. Revogar ou rotacionar o **endpoint do Google Apps Script** commitado em
    claro, que segue aceitando escrita anônima. (Achado 58)

### 4.3 GitHub (configurações que não são arquivo do repositório)

15. Ligar **branch protection** no `main` com required status checks. Hoje 0 de
    40 commits vieram por PR, o que indica que ou não existe proteção ou ela
    não é exigida. Sem isso o desenho de auto-merge do `CI_CD.md` não pode ser
    cumprido.
16. Confirmar se o **repositório é público ou privado**. Isso muda diretamente a
    severidade do endpoint commitado em claro. O remote aponta para um proxy
    local, não para o GitHub.
17. Confirmar se o **CodeQL default setup** está ligado nas settings. O
    `QUALITY_GATES.md` o declara bloqueante e não existe workflow correspondente.
18. Confirmar se **Enforce HTTPS** está ligado no GitHub Pages.
19. Criar `CODEOWNERS` e template de PR (a IA escreve, o dono decide os donos).

### 4.4 Jurídico

20. **Contratar a revisão da política de privacidade e dos termos.** O texto
    está no ar declarando-se rascunho não validado. É o item de maior exposição
    do site. (Achado 27)
21. **Nomear encarregado (DPO)** e publicar identidade e contato, conforme LGPD
    art. 41 par. 1. Hoje o canal de direitos é uma conta Gmail gratuita que
    também recebe a newsletter.
22. Declarar na política o **compartilhamento com Google e Meta** e a
    transferência internacional (LGPD arts. 9 V e 33 a 36).
23. Decidir sobre **"harmonização orofacial" anunciada por 5 não dentistas**.
    Disputa em curso entre CFO, CFBM e CFF com decisões divergentes. (Achado 35)
24. Decidir sobre **biorressonância anunciada contra quadros clínicos
    definidos**, por profissional sem conselho. (Achado 34)
25. Decidir sobre a **bandeira 09** ("Priorizamos e garantimos a excelência"),
    declarada patrimônio intocável no brandbook e que usa o verbo vedado pelo
    próprio `TONE_OF_VOICE.md`.

### 4.5 Conselhos profissionais e dados cadastrais

26. Fornecer os **registros dos 5 profissionais que aparecem sem nenhum**:
    Giancarla Rochemback, Marvin Marques, Gabrieli Klagenberg Ávila, Lara Caye
    (CRN) e definir o status de Adriana, cuja atividade não é regulamentada.
    (Achado 29)
27. Confirmar os **5 registros em estado `a-confirmar`** nos respectivos
    conselhos: Maria Luísa Borges, Vitória Serpa, Camila Cadore (CRN), Taís de
    la Rosa (CRF), Augusto Kauer (CRP).
28. Informar se os 3 médicos sem RQE publicado (Gustavo Gehrke, Larissa
    Wiebbelling, Yale Jerônimo) **possuem RQE registrado**, e qual. Enquanto não
    houver, o anúncio de "especialista" e "tricologista" precisa sair.
    (Achados 32, 33)
29. Informar o **CRM de Scheila Andrzejewski**, citada como médica sócia
    fundadora sem registro. (Achado 39)
30. Informar **CNPJ, razão social e endereço da controladora**, e confirmar
    quais inscrições de pessoa jurídica e quais responsáveis técnicos por classe
    são exigidos para as 9 classes anunciadas. (Achado 36)

### 4.6 Fotos e conteúdo

31. **Revisar e assinar o corpo dos 12 artigos** que a IA escrever. Conteúdo
    médico YMYL exige responsabilidade técnica de quem assina; nenhuma auditoria
    automática substitui isso. (Achado 1)
32. Aprovar a **política editorial** (quem escreve, quem revisa, com que
    critério, com que frequência, como um erro é corrigido). (Achado 4)
33. Fornecer **fotos próprias para `og:image`** por página. Hoje a mesma
    `recepcao-hero.webp` serve as 62 páginas, em WebP, que tem suporte irregular
    a prévia no WhatsApp, o canal principal de conversão do negócio.
34. Decidir sobre um **e-mail no domínio próprio** no lugar de
    `ecooa.adm@gmail.com`, que hoje é o destino da newsletter, do contato geral
    e do exercício de direitos LGPD.
35. Confirmar o **número de profissionais por área** (a página de especialidades
    diz "5 profissionais" no corpo e "1" no menu, na mesma tela).

---

## 5. Os 10 itens de maior alavancagem para o top1

Ordenados por (impacto no objetivo) dividido por (custo). Cada um resolve
vários achados de uma vez.

| # | Item | Achados que resolve | Esforço | Quem |
| ---: | --- | --- | --- | --- |
| 1 | **Reivindicar e completar o Google Business Profile**, com categorias, NAP idêntico ao do site, horário, fotos, serviços, e iniciar o ciclo de pedir e responder avaliações. Depois, ligar o perfil ao schema (`sameAs`, link `g.page`, `GeoCoordinates`). | 14, 40, e o resíduo de 11 | 2 h do dono para abrir e completar, depois 20 min por semana de operação contínua. A parte de código é 1 sessão de IA. | Dono + IA |
| 2 | **Corrigir a CSP no painel Cloudflare** (`connect-src`, `frame-src`, `frame-ancestors`, `form-action`, `base-uri`, `report-uri`, HSTS) e remover as 5 origens não usadas. Destrava a medição inteira, o Preview do GTM, o mapa e a proteção de clickjacking de uma vez. | 15, 18, 52, e o mapa ausente | 30 min do dono no painel. É o maior retorno por minuto do documento inteiro. | **Dono** |
| 3 | **Escrever o corpo real dos 12 artigos vazios**, com referências externas, `dateModified`, revisão declarada, link do autor para `/profissionais/<slug>/`, `author.url` e `sameAs` no schema, mais a página de política editorial. Sem isso não existe o que ranquear. | 1, 2, 3, 4, e o grosso dos 39% de duplicação | 2 a 3 dias de IA para redigir e instrumentar. A revisão e a assinatura de cada autor é o gargalo real: prever 1 semana de ida e volta. | IA redige, **dono/autor revisa e assina** |
| 4 | **Fechar a conformidade regulatória de publicação**: registro de todos os profissionais, ressalva real onde não houver confirmação, remover "especialista" e "tricologista" sem RQE, disclaimer médico nas 39 páginas de serviço e perfil, CNPJ e responsável técnico no rodapé. É o único bloco com poder de veto sobre o ativo inteiro. | 29, 30, 31, 32, 33, 36, 39 | 1 sessão de IA para o código e o texto. O gargalo é o dono levantar os registros faltantes e o jurídico decidir sobre CNPJ e RT por classe. | IA + **dono** |
| 5 | **Publicar a política de privacidade validada por advogado**, corrigir o link relativo que dá 404 em 53 das 62 páginas, nomear o encarregado, declarar o compartilhamento com Google e Meta, e colocar aviso de privacidade nos 3 formulários. | 27, 28, e os itens de consentimento | O link 404 é 1 h de IA e deve ser feito hoje. O texto validado é 1 a 2 semanas de advogado. | IA (link) + **dono (jurídico)** |
| 6 | **Configurar GA4 e as tags do GTM**, marcar as conversões, e no mesmo passo corrigir os defeitos de instrumentação já medidos: `form_submit` sempre newsletter, `whatsapp_click` sintético no envio de formulário, colisão de rótulo, dimensão `pagina` fragmentada, medição nas 29 páginas de tráfego legado. | 16, 19, 20, 21, 22, 23, 24, 26 | 2 h do dono no painel + 1 sessão de IA para o plano de tags e as correções no `medicao.mjs`. Depende do item 2 para entregar qualquer dado. | Dono + IA |
| 7 | **Reescrever titles, H1 e descriptions por intenção comercial local**, com bairro e cidade nas 8 especialidades e nos 14 artigos, e criar as 3 páginas que faltam (botox, preenchimento labial, reposição hormonal em Porto Alegre). Adicionar gate de unicidade de title e description. | 5, 6, 7 | 1 sessão de IA para os titles e o gate. As 3 páginas novas dependem do item 3 (conteúdo com autor). | IA |
| 8 | **Consertar a conversão no celular**: banner de consentimento não pode cobrir o botão flutuante, CTA textual acima da dobra nas 21 páginas que não têm, link `tel:` no rodapé, formulários com verificação real de sucesso e plano B visível, newsletter nas 53 páginas que não têm. | 25, 43, 44, 45, 46 | 1 sessão de IA. Todo o tráfego que os itens 1, 3 e 7 trouxerem passa por aqui. | IA |
| 9 | **Implementar atribuição**: capturar e persistir UTM, gclid e fbclid, injetar a origem na mensagem do WhatsApp e no evento, e adotar `data-intent` único por CTA (os ~90 valores já especificados em `GTM-DATA-INTENTS.md`). Sem isso, nenhum real investido em mídia é rastreável até a consulta. | 17, 22, 19 | 1 sessão de IA. Depende dos itens 2 e 6 para produzir relatório. | IA |
| 10 | **Reativar a esteira**: CI em `push`, `prettier --write` no `lint-staged` de `.mjs`, `npm audit fix`, gate do deploy cobrindo as 95 páginas, Lighthouse nas rotas reais em vez dos 5 stubs, `RAIZ` relativa nos 23 scripts, `gerar-site.mjs` como script npm, e um smoke test pós-publicação. Sem isso, nenhum dos 9 itens acima chega ao ar de forma confiável. | 48, 49, 50, 51, 53, 54, 55, 56, 57, 59, 71 | 1 sessão de IA para o código; branch protection é 10 min do dono no GitHub. | IA + dono |

**Logo abaixo do corte, e por pouco:** (11) recompressão das imagens, que
devolve 2,34 MB por visita na home e tira o LCP mobile de 3301 ms, com `srcset`,
`<picture>` e AVIF; (12) `<main>`, skip link e anel de foco a 3:1, que são
falhas de nível A em 31 de 31 páginas e têm efeito colateral positivo em SEO
semântico; (13) remoção dos 114 blocos de keyword stuffing com termos de luto,
que é risco de penalização por spam e problema de tom numa clínica premium.

---

## 6. O que não foi possível medir, e o que seria preciso

### 6.1 Produção real

**Não medido:** absolutamente nada foi medido em `www.somosecooa.com.br`. Os
dez auditores mediram `deploy/` servido em `http://localhost:4353`.

**Por quê:** o proxy deste ambiente responde 403 para o domínio.

**Consequências concretas:** não se sabe se as 62 URLs sem extensão respondem
200 (o servidor de laboratório é um `SimpleHTTPServer` que devolve 404 para
`/sobre`); não se sabe como o GitHub Pages resolve `/especialidades` existindo
`especialidades.html` e `especialidades/index.html` ao mesmo tempo; não se
conhecem os cabeçalhos reais (`Cache-Control`, `Content-Encoding`, `ETag`,
HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP);
não se sabe o efeito real da compressão, e o laboratório não envia
`Content-Encoding`, o que penaliza todos os LCP mobile medidos (`index.html`
cai de 166.430 para 24.708 B em gzip -9). **Não é possível separar com precisão
quanto dos 3301 ms de LCP da home é artefato de laboratório e quanto é
problema real.**

**Para medir:** um `curl -I` no domínio, um Lighthouse contra a URL real, ou o
PageSpeed Insights de produção. Trinta segundos de quem tiver rede livre.

### 6.2 Dados de campo e de plataforma

**Não medido:** CrUX, PageSpeed Insights de produção, INP real, estado de
indexação, impressões, posição média, cobertura, taxa de conversão, volume de
leads, custo por lead, qualidade de tráfego, presença de bots.

**Por quê:** o site nunca mediu nada. Não existe linha de base histórica de
espécie alguma. O único dado de campo citado no projeto é um PSI de 2026-05-31,
de um site que não está mais publicado. INP não é produzido pelo Lighthouse em
modo navegação; foram usados TBT (0 a 126 ms) e `maxPotentialFID` (16 a 207 ms)
como proxies.

**Para medir:** os itens 2 e 6 da seção 5, nesta ordem. Depois, 30 dias de
coleta antes da primeira leitura útil.

### 6.3 Conteúdo dos painéis de terceiros

**Não medido:** o que existe dentro do container GTM-TSR4GDMK; se há propriedade
GA4 e qual o ID; se o domínio está verificado na Search Console; se o Google
Business Profile existe, está reivindicado, com quais categorias e quantas
avaliações; quem criou a regra de CSP da Cloudflare, quando e com que escopo; se
existem outras regras de cabeçalho ou de WAF; a configuração de TLS do domínio.

**Por quê:** o proxy devolve 403 em `CONNECT www.googletagmanager.com`, e nenhum
painel é acessível a partir do repositório.

**Para medir:** acesso do dono a cada painel, com captura de tela ou export.

### 6.4 Configuração do repositório no GitHub

**Não medido:** se existe branch protection e required status checks no `main`;
se o CodeQL default setup está ligado; se o repositório é público ou privado; se
"Enforce HTTPS" está ligado no Pages; se os workflows rodaram verdes.

**Por quê:** são configurações de repositório, não arquivos versionados, e o
`gh` está indisponível neste ambiente. A cronologia da quebra do deploy foi
reconstruída por `git log` e por reexecução local dos comandos de cada gate, não
por leitura de logs de execução. **A conclusão de que 25 commits não publicaram
é inferência forte** (`test -f` falha deterministicamente com o arquivo ausente),
não observação direta.

**Para medir:** abrir as settings do repositório e a aba Actions.

### 6.5 Verificação profissional e jurídica

**Não medido:** a validade real dos 26 números de registro publicados. Foram
verificados apenas presença e formato, nunca veracidade. Um número pode estar
correto no site e cancelado no conselho. Também não foi verificado se os 3
médicos sem RQE no site possuem RQE registrado, se a pessoa jurídica está
inscrita nos conselhos das 9 classes, se há contrato de operador com Google e
Meta, se há registro de operações de tratamento (LGPD art. 37) e se há relatório
de impacto (art. 38), exigível pelo tratamento de dado sensível de saúde.

**Por quê:** as consultas públicas dos conselhos não são alcançáveis pelo proxy,
e os documentos jurídicos não são verificáveis por código.

**Para medir:** consulta nominal nos portais do CFM, CRN, CRP, CRO, CRF, CRBM,
COREN e CREFITO, e levantamento documental com o contador e o advogado.

### 6.6 Experiência humana real

**Não medido:** leitor de tela real (NVDA, VoiceOver, TalkBack); software de
controle por voz; ampliadores de tela; teste com usuários com deficiência;
percepção do conteúdo por paciente real; contraste dos 1.195 nós que o axe marca
como `incomplete` por estarem sobre fotografia; comportamento real de toque;
se o WhatsApp 5551991460909 é atendido e em quanto tempo.

**Por quê:** nenhum leitor de tela está disponível neste ambiente. Todas as
conclusões sobre o que é ou não anunciado foram inferidas da árvore de
acessibilidade do Chromium e da ausência medida de `aria-live`,
`aria-activedescendant` e roles, **não de escuta**. O roteiro de teste manual da
seção 6 do `ACCESSIBILITY_CHECKLIST.md` continua sendo pendência humana e não há
evidência de que tenha sido executado alguma vez.

**Para medir:** uma sessão de 2 h com NVDA ou VoiceOver seguindo o roteiro que
já existe, e uma inspeção visual pixel a pixel do texto sobre foto em cada
viewport.

### 6.7 Estados interativos não abertos

**Não medido:** os filtros de `/profissionais` e `/blog`, os acordeões
`<details>` das 8 especialidades sob teclado, o fluxo completo de perguntas
guiadas do ecooa.match, os estados de erro e carregamento dos 3 formulários, e
os handlers que o `ESTADO-REAL.md` lista como pendentes de religação.

**Por quê:** varredura de URLs não vê estado. Isso foi provado no próprio
laudo: o estado de resultado da busca revelou 5 violações `serious` de contraste
que a varredura das 31 URLs não via. **É provável que os estados não abertos
escondam mais.**

**Para medir:** um roteiro de interação por Playwright cobrindo cada estado, com
axe rodando depois de cada transição.

### 6.8 A própria janela de medição

**Não medido:** se o `deploy/` permanecerá idêntico ao que foi auditado. Outro
processo rodou o pipeline durante a auditoria (15:14 a 15:41), publicou 31
perfis, adicionou o GTM, corrigiu os títulos duplicados e alterou 11 HTML e 2
scripts sem que nenhuma trava impedisse. **Não há como afirmar que outras
mudanças não entraram junto**, nem comparar com o estado anterior, porque os
números da primeira passada de quatro dimensões descrevem um artefato que já não
existe.

**Para medir:** o item 10 da seção 5, especificamente a trava de concorrência e
o diretório de trabalho isolado do `gerar-site.mjs`.

---

## Procedência

Dez auditorias independentes, 2026-08-01, commit de referência `18ded8a` a
`d132ae6`. Laudos completos em `docs/mythos/baseline/`: `performance.md`,
`acessibilidade.md`, `seo-tecnico.md`, `seguranca.md`, `conversao.md`,
`conteudo.md`, `ux-ui.md`, `infra-dx.md`, `analytics.md`, `etica.md`.
Ferramentas: Lighthouse 13.4.1, axe-core 4.12.1, Playwright/Chromium 1194,
sharp, `npm audit`, `git log`, `curl`. Zero em-dash neste documento.
