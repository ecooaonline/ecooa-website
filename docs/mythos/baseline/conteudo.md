# Baseline P12 · Conteúdo, copy, autoridade e E-E-A-T

> Laudo de auditoria. Somente leitura: nenhum arquivo de `deploy/`, `src-site-3/`
> ou `scripts/` foi alterado.
>
> **Snapshot medido:** 2026-08-01, 15:16 a 15:21 UTC, commit `18ded8a`
> (`feat(site): 31 perfis, dados estruturados, medicao e acessibilidade no ar`),
> `deploy/sitemap.xml` com **62 URLs**.
>
> **Aviso de alvo móvel.** A primeira rodada de medição (15:05 a 15:12) pegou o
> build anterior, de 31 URLs. Durante a auditoria outro agente rodou
> `node scripts/gerar-site.mjs` (processo 18284, iniciado 15:14, encerrado
> 15:15) e publicou 31 páginas de profissional novas, dados estruturados novos e
> a correção de títulos duplicados. **Todos os números deste laudo foram
> remedidos depois do build.** Onde o estado anterior importa para entender um
> achado, ele aparece marcado como "build anterior".
>
> **Nota: 33/100.**

---

## 1. Método

Nenhuma nota aqui vem de leitura de documento. Tudo foi medido no HTML servido
pelo laboratório em `http://localhost:4353`, que serve `deploy/` com a CSP de
produção.

| # | O que foi feito | Ferramenta |
|---|---|---|
| 1 | Renderização das 62 URLs do `sitemap.xml` em Chromium headless, extração de `textContent` do `<body>` com `<script>`, `<style>`, `<noscript>` e `<svg>` removidos | playwright-core + `/opt/pw-browsers/chromium-1194` |
| 2 | Separação de `<header>` + `<footer>` (o "chrome", 235 palavras idênticas em toda página) do corpo real, para não inflar contagem | script próprio |
| 3 | Contagem de palavras por página, por grupo e agregada | idem |
| 4 | Duplicação por shingles de 6-gramas normalizados (minúscula, sem acento, sem pontuação); um 6-grama presente em 2 ou mais páginas conta como repetido | idem |
| 5 | Medição isolada do corpo editorial dos 14 artigos: só os `<p>` internos ao `<article>`, descontando resumo, linha de crédito e disclaimer | idem |
| 6 | Leitura direta da fonte dos textos: `deploy/dados-ecooa.js`, `scripts/corpos-artigos.mjs`, `scripts/conteudo-areas.mjs`, `scripts/almanaque.mjs` | node |
| 7 | Varredura regex de superlativos, promessas e termos vedados em publicidade de saúde sobre os 95 arquivos HTML de `deploy/` | node |
| 8 | Varredura de sinais E-E-A-T: CNPJ, responsável técnico, política editorial, referências, `dateModified`, `reviewedBy`, prova social, ressalva de registro | grep + node |
| 9 | Conferência de tom contra `docs/TONE_OF_VOICE.md` e `docs/BRANDBOOK-ECOOA.md` | leitura cruzada |
| 10 | Teste de interação do modal de perfil para verificar se a ressalva de registro aparece | playwright |

Scripts de medição em
`/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/audit-conteudo/`
(`medir3.mjs`, `dup.mjs`, `corpo-artigo.mjs`).

---

## 2. Números medidos

### 2.1 Volume de conteúdo

Corpo = página inteira menos `<header>` e `<footer>`.

| Grupo | Páginas | Palavras totais | Mínimo | Mediana | Máximo |
|---|---|---|---|---|---|
| Raiz | 9 | 5.081 | 288 | 582 | 1.064 |
| Especialidades | 8 | 3.918 | 329 | 543 | 655 |
| Profissionais | 31 | 9.677 | 186 | 272 | 780 |
| Artigos | 14 | 2.459 | 132 | 138 | 421 |
| **Site inteiro** | **62** | **21.135** | 132 | 329 | 1.064 |

Cabeçalho e rodapé somam 235 palavras idênticas repetidas nas 62 páginas, ou
seja 14.570 palavras de chrome contra 21.135 de corpo.

### 2.2 O editorial está vazio

Medição do corpo real dos 14 artigos (só parágrafos e subtítulos internos ao
`<article>`, sem resumo, sem crédito, sem disclaimer, sem bloco "Continue lendo"):

| slug | palavras de corpo | H2 | parágrafos |
|---|---|---|---|
| implante-hormonal-subcutaneo | 271 | 3 | 10 |
| canetas-emagrecedoras-nutricao | 224 | 3 | 10 |
| ansiedade-como-identificar-tratar | **0** | 0 | 3 |
| equilibrio-hormonal-como-identificar | **0** | 0 | 3 |
| interpretacao-exames-bioquimicos | **0** | 0 | 3 |
| longevidade-saudavel | **0** | 0 | 3 |
| menopausa-tratamento-hormonal | **0** | 0 | 3 |
| nutricao-esportiva-performance | **0** | 0 | 3 |
| osteopatia-o-que-e-para-quem | **0** | 0 | 3 |
| queda-de-cabelo-causas | **0** | 0 | 3 |
| rejuvenescimento-facial-porto-alegre | **0** | 0 | 3 |
| saude-capilar-feminina | **0** | 0 | 3 |
| saude-mental-emagrecimento | **0** | 0 | 3 |
| transplante-capilar-porto-alegre | **0** | 0 | 3 |
| **TOTAL** | **495** | **6** | |

**12 dos 14 artigos têm zero parágrafos de texto.** Os 3 parágrafos que sobram
são o resumo, a linha de crédito e o disclaimer. O editorial inteiro da ecooa
tem 495 palavras, menos que uma única página de especialidade.

Causa na origem, verificada no código:

- `scripts/corpos-artigos.mjs` termina com `export const CORPOS = {};` (vazio).
- `scripts/artigos.mjs` linha ~63 cai no fallback: `const blocos = CORPOS[a.slug] || a.corpo || [];`
- Em `deploy/dados-ecooa.js`, só 2 dos 14 artigos têm o campo `corpo` preenchido
  (285 e 239 palavras na fonte). Os outros 12 têm `corpo` ausente.

### 2.3 Duplicação entre páginas

**39% do corpo do site (8.215 de 20.817 shingles de 6 palavras) aparece em 2 ou
mais páginas.** Distintos: 14.379.

Piores casos, por grupo:

| Página | % do corpo que se repete em outra página |
|---|---|
| /blog/longevidade-saudavel/ | **90%** |
| /blog/menopausa-tratamento-hormonal/ | **87%** |
| /blog/equilibrio-hormonal-como-identificar/ | **87%** |
| /blog/interpretacao-exames-bioquimicos/ | **85%** |
| /blog/rejuvenescimento-facial-porto-alegre/ | 79% |
| /blog.html | 66% |
| /profissionais/vitoria-serpa/ | **66%** |
| /profissionais/vitoria-machado/ | 61% |
| /profissionais/karine-ellwanger/ | 60% |
| /profissionais/giancarla-rochemback/ | 58% |
| /especialidades/saude-integrativa/ | 40% |
| /especialidades/tricologia/ | 38% |

Considerando **só os 14 artigos entre si**, o texto compartilhado vai de 20%
(implante hormonal, que tem corpo) a **73%** (longevidade, que não tem). Ou
seja: quando o artigo não tem corpo, três quartos da página é o mesmo bloco de
"Continue lendo", quem escreve e disclaimer que existe em todos os outros.

Considerando **só as 8 especialidades entre si**, 21% a 35% do texto é
compartilhado, quase todo ele nos cartões de profissional repetidos entre áreas.

### 2.4 Metadados

Medido depois do build de 15:15.

| Sinal | Estado |
|---|---|
| `<title>` únicos | **62 de 62** |
| `<meta description>` únicas | **62 de 62** |
| H1 por página | 1, único, específico em todas |
| JSON-LD | 62 de 62 páginas com schema |
| Tipos | MedicalClinic ×3, MedicalWebPage ×8, FAQPage ×8, Person ×31, BreadcrumbList ×31, Article ×14, Blog, WebSite, CollectionPage ×2, Service ×2, WebApplication, AboutPage |

No build anterior (medido às 15:05) **22 das 31 URLs tinham título duplicado**:
15 páginas repetiam "Editorial ecooa · textos sobre saúde, estética, nutrição e
longevidade" e 9 repetiam o título do índice de especialidades. Corrigido no
commit `890f1c8` durante a janela desta auditoria. Registro aqui porque prova
que o pipeline publicou por semanas um defeito de SEO de conteúdo sem nenhum
gate detectar.

### 2.5 Sinais E-E-A-T, um a um

| Sinal exigido em YMYL de saúde | Presente? | Evidência |
|---|---|---|
| Autor identificado por nome | Sim | 14/14 artigos com "por Nome" |
| Credencial do autor visível | Sim | 13/14 com conselho e número na linha de crédito |
| Página de autor linkada do artigo | **Não** | o bloco "quem escreve" só linka WhatsApp, não `/profissionais/<slug>/` |
| `author` no schema com `url`/`sameAs` | **Não** | só `{"@type":"Person","name","jobTitle"}` |
| Data de publicação | Sim | `datePublished` em 14/14 |
| Data de atualização | **Não** | **0 ocorrências de `dateModified` em todo o `deploy/`** |
| Referências, fontes, bibliografia | **Não** | **0 links externos de citação nos 14 artigos** |
| Revisão por profissional habilitado | **Não** | 0 ocorrências de "revisado por", "revisão técnica" ou `reviewedBy` |
| Política editorial publicada | **Não** | nenhuma página descreve como o conteúdo de saúde é produzido e revisado |
| Prova social (avaliações, depoimentos) | **Não** | **0 ocorrências** de "5.0", "avaliações", "estrelas", "g.page", "depoimento" |
| CNPJ ou razão social | **Não** | **0 ocorrências de "CNPJ"** em 95 arquivos HTML |
| Endereço completo | Sim | rodapé, 62/62: Rua Mariante, 180, 9º andar, 90430-180 |
| Telefone e e-mail | Sim | (51) 99146-0909 e ecooa.adm@gmail.com |
| Responsável técnico | Sim | "RT Gustavo Gehrke · CREMERS 35.822" no rodapé de 62/62 |
| Disclaimer médico | **Parcial** | **15 de 95 arquivos**: os 14 artigos e `politicas.html`. **Nenhuma das 8 especialidades e nenhum dos 31 perfis tem disclaimer** |
| Ressalva de registro não confirmado | **Não** | ver 2.6 |

O `BRANDBOOK-ECOOA.md` seção 9 chama a estrela 5.0 no Google de "prova social
máxima da marca" e manda usá-la "com link para o perfil real (g.page)". O site
não tem nenhuma. Para clínica local, é o sinal de confiança mais forte que
existe e ele está integralmente ausente.

### 2.6 Registros profissionais: a ressalva não existe no ar

`deploy/dados-ecooa.js` classifica os 31 profissionais em `confirmado` (21),
`a-confirmar` (5) e `a-adicionar` (5). O `docs/ESTADO-REAL.md` seção 3 afirma
que "a ressalva aparece no modal sempre que não for `confirmado`".

**Medição: falso.** Nas 10 páginas dos profissionais sem registro confirmado
(`vitoria-serpa`, `maria-luisa-borges`, `camila-cadore`, `tais-de-la-rosa`,
`augusto-kauer`, `adriana`, `giancarla-rochemback`, `marvin-marques`,
`gabrieli-avila`, `lara-caye`), a busca por "a confirmar", "registro a
adicionar" ou "em validação" retorna **NENHUMA** em todas as 10.

O código que geraria a ressalva existe, mas está dentro de
`<script type="text/x-dc">`, o runtime morto que a pré-renderização deixou para
trás. Ele não executa. Consequências medidas:

- `/profissionais/vitoria-serpa/` publica "Nutricionista · CRN-2 12000P" sem
  ressalva, e o JSON-LD publica `"identifier":"CRN-2 12000P"` como se o número
  estivesse verificado.
- `/profissionais/adriana/` publica uma profissional de saúde **sem sobrenome e
  sem nenhum registro de conselho**, com `Person` dentro de
  `worksFor: MedicalClinic`, oferecendo biorressonância para dor
  musculoesquelética, dor de cabeça, enxaqueca e saúde mental.

### 2.7 Palavras-chave despejadas no texto visível

As 31 páginas de profissional carregam **114 blocos "Também procurado como:"**
com **684 termos de busca** impressos no corpo visível da página, não em
metadado. Exemplo literal de `/profissionais/adriana/`, seção "Saúde mental":

> Também procurado como: perdi minha mae, perdi meu pai, falecimento, nao
> aguento mais, nao to conseguindo, nao estou conseguindo.

Isso é keyword stuffing pela definição da própria política de spam do Google
("listas de palavras ou números sem contexto"). Agrava:

- Os termos são de luto e sofrimento agudo, colados a uma prática sem registro
  de conselho e sem evidência.
- **110 ocorrências de palavras portuguesas sem acento no texto visível**
  (`nutricao` 22, `nao` 15, `medica` 7, `cabeca` 6, `mae` 5, `pai` 5,
  `hormonio` 5, `cansaco` 5, `biorressonancia` 3, `holistico` 3...), violando a
  regra explícita do `CLAUDE.md`: "Acentos em português obrigatórios no
  conteúdo".
- Explica boa parte dos 39% de duplicação: as mesmas listas se repetem entre
  perfis da mesma área.

### 2.8 Promessas, superlativos e termos vedados que estão no ar

Varredura sobre os 95 HTML de `deploy/`.

| Termo | Ocorrências | Onde e trecho |
|---|---|---|
| "excelência" | **71** | rodapé de 62/62 ("mesmo padrão de excelência"), home ×2, sobre, mentorias |
| "garantimos" | 2 | `sobre.html`: "09 Priorizamos e **garantimos a excelência** em tudo que fazemos". `especialidades/estetica-corporal/`: "O que **garantimos** é honestidade no plano" |
| "garantindo" | 2 | `profissionais/yale-jeronimo/`: "investiga a causa da queda antes do transplante, **garantindo que a cirurgia seja a decisão certa**". `profissionais/daniel-forster/`: "**garantindo** proteína e recuperação" |
| "especialista" | 2 (públicas) | `profissionais/yale-jeronimo/` e `especialidades/medicina/`: "Médica tricologista, empreendedora e **especialista** no diagnóstico e tratamento médico das alopecias" |
| "Referência em" | 1 | `profissionais/natalie-queiroz/`: "**Referência em lactação pela osteopatia**, Natálie atende bebês com dificuldade de pega" |
| "eficaz" | 1 | `especialidades/tricologia/` FAQ: "A maioria das causas tem **conduta eficaz** quando identificada cedo" |
| "alto padrão" | 1 | `sobre.html` |
| "melhor" | 6 | 3 são uso legítimo ("às vezes o melhor procedimento é o que não se faz"); `sobre.html` traz "com o melhor café" |
| "milagroso" | 1 | uso correto, negando: "não com prazo milagroso" |
| "antes e depois" | 1 | uso clínico, não de imagem: "prepara e acompanha o couro cabeludo antes e depois do procedimento" |
| em-dash (travessão longo U+2014) | **0** | regra do projeto cumprida |
| "promoção", "desconto", "vagas limitadas", "imperdível" | **0** | regra do brandbook cumprida |

Riscos regulatórios concretos, para o guardião de P17 confirmar:

1. **"especialista" sem RQE.** Yale Jerônimo aparece com `CRM-RS 49.185` e
   nenhum RQE, anunciada como "especialista no diagnóstico e tratamento médico
   das alopecias" e como "Médica tricologista". Tricologia não é especialidade
   nem área de atuação reconhecida pelo CFM. As duas dermatologistas da casa,
   por contraste, exibem RQE corretamente (`RQE 42.218` e `RQE 46.857`), o que
   mostra que o dado existe e a falha é de copy.
2. **Médica citada sem CRM.** `sobre.html`: "os sócios fundadores Gustavo
   Gehrke, médico, Jessica Stein, nutricionista, e **Scheila Andrzejewski,
   médica**". Gustavo e Jessica têm registro exibido no fim da seção; Scheila
   não tem em lugar nenhum do site.
3. **"Referência em lactação"** é afirmação de superioridade sobre pares, com
   alegação terapêutica sobre recém-nascidos.
4. **"garantindo que a cirurgia seja a decisão certa"** é garantia de acerto de
   indicação cirúrgica.
5. **Biorressonância** anunciada para dor musculoesquelética, cefaleia,
   enxaqueca e saúde mental, por profissional sem registro exibido, sem
   disclaimer na página e sem qualquer ressalva sobre ausência de evidência.
6. **"garantimos a excelência"** conflita com o próprio `TONE_OF_VOICE.md`
   ("Evitar: garantia / garantido"). Registro do conflito: é a bandeira 05 do
   `BRANDBOOK-ECOOA.md` seção 11, declarada "íntegra intocável". Decisão do dono,
   não da IA.

### 2.9 Afirmações do site que a medição contradiz

| Onde | Afirmação publicada | Fato medido |
|---|---|---|
| `index.html` | "Queda de cabelo: o que investigar antes de tratar · **8 min de leitura**" | 0 palavras de corpo |
| `index.html` | "Implante hormonal subcutâneo · **9 min de leitura**" | 271 palavras, cerca de 1,2 min |
| `index.html` | "Canetas emagrecedoras · **8 min de leitura**" | 224 palavras, cerca de 1 min |
| `blog.html` | "Conteúdo com **base científica**, atualizado e sem promessa" | 0 referências em 14 artigos; 12 sem texto; 0 `dateModified` |
| rodapé 62/62 | "editorial ecooa. Novidades... **sempre atualizadas**" | artigo mais recente é de 2026-07-27; 12 nunca tiveram texto |
| rodapé 62/62 | "**© 2021** ecooa" | data corrente 2026-08-01 |
| `politicas.html` (no ar) | "Este texto é um rascunho preparado para revisão jurídica. Ele ainda não foi validado por um advogado e **não deve ser publicado como definitivo**" | está publicado |
| `especialidades.html` | "saúde integrativa · **5 profissionais**" | o menu do cabeçalho da mesma página diz "terapia integrativa **1**" |

### 2.10 FAQ

28 itens `<details>`, todos nas 8 páginas de especialidade (3 a 4 por página),
com `FAQPage` no schema. **Zero FAQ** nos 14 artigos, nos 31 perfis e nas 9
páginas raiz.

Qualidade das respostas é o ponto mais forte do conteúdo: encaram objeção de
verdade ("Quanto custa", "Vocês atendem por convênio", "Posso ser atendido
online", "Toda queda de cabelo tem tratamento") sem evasão e sem promessa.

### 2.11 Tom contra os documentos de marca

| Regra | Fonte | Estado |
|---|---|---|
| Sem em-dash | TONE_OF_VOICE, CLAUDE.md | **Cumprida**, 0 ocorrências |
| Sem "promoção", "desconto", "imperdível", "aproveite" | BRANDBOOK §1 | **Cumprida**, 0 ocorrências |
| Sem urgência fabricada | BRANDBOOK §10 | **Cumprida** |
| Segunda pessoa, frases curtas, jargão traduzido | BRANDBOOK §10 | **Cumprida**, ex.: "as chamadas canetas emagrecedoras" |
| "Chegue com o que dói. Saia com um plano." como promessa central | BRANDBOOK §1 | **Cumprida**, na home e no CTA final |
| Acentos obrigatórios | CLAUDE.md, TONE_OF_VOICE | **Violada**, 110 ocorrências |
| Evitar "garantia / garantido" | TONE_OF_VOICE | **Violada**, 4 ocorrências |
| "Incluir DisclaimerMedico nas páginas de serviço médico e estético" | TONE_OF_VOICE §Conteúdo regulado item 2 | **Violada**, 0 das 8 especialidades e 0 dos 31 perfis |
| "Não afirmar eficácia sem base (sem 'comprovado' sem referência real)" | TONE_OF_VOICE item 3 | **Violada**, "conduta eficaz" e "Referência em lactação" |
| Labels de navegação lowercase | CLAUDE.md | Cumprida, e é intencional |

O tom, isolado, é bom. Frases como "às vezes o melhor procedimento é o que não
se faz", "Desconfie de preço fechado sem avaliação" e "Nada de promessa de
faturamento" são exatamente o registro premium sem oferta que o brandbook pede.
O problema não é a voz. É que não há texto suficiente para a voz sustentar, e a
camada de conformidade que deveria acompanhar cada afirmação clínica não foi
aplicada nas páginas que mais precisam dela.

---

## 3. Tabela de achados por severidade

| # | Sev | Achado | Onde | Corrigível por IA |
|---|---|---|---|---|
| 1 | Crítico | 12 dos 14 artigos com **zero** palavras de corpo. Editorial inteiro = 495 palavras | `scripts/corpos-artigos.mjs` (`CORPOS = {}`) e `deploy/dados-ecooa.js` | Sim, redigindo. Revisão de quem assina é humana |
| 2 | Crítico | Site anuncia "8 e 9 min de leitura" e "conteúdo com base científica, atualizado" para páginas sem texto e sem fonte | `deploy/index.html`, `deploy/blog.html` | Sim |
| 3 | Crítico | Nenhum dos 10 profissionais sem registro confirmado exibe ressalva; schema publica `identifier` não verificado. `ESTADO-REAL.md` §3 afirma o contrário | 10 páginas em `deploy/profissionais/`, `scripts/perfis.mjs` | Sim (exibir ressalva). Validar registro é humano |
| 4 | Crítico | Disclaimer médico ausente nas 8 especialidades e nos 31 perfis, justo as páginas com afirmação terapêutica queixa a queixa | `scripts/areas.mjs`, `scripts/perfis.mjs` | Sim |
| 5 | Crítico | "especialista" e "Médica tricologista" para médica com CRM e sem RQE, em 2 páginas | `deploy/dados-ecooa.js` campo `bio` de `yale-jeronimo` | Sim (retirar termo). Confirmar RQE é humano |
| 6 | Alto | 114 blocos e 684 termos de busca despejados no texto visível, incluindo "perdi minha mae", "nao aguento mais" | `scripts/almanaque.mjs`, `scripts/perfis.mjs` | Sim |
| 7 | Alto | 110 palavras pt-BR sem acento no texto visível, contra regra explícita do projeto | `scripts/almanaque.mjs` | Sim |
| 8 | Alto | Zero referências, zero `dateModified`, zero revisão declarada em 14 artigos de saúde | todas as páginas de `deploy/blog/` | Sim |
| 9 | Alto | Nenhuma política editorial publicada. Nada explica quem escreve, quem revisa e com que critério | site inteiro | Sim |
| 10 | Alto | Biorressonância anunciada para cefaleia, dor e saúde mental, por profissional sem registro exibido e sem disclaimer | `deploy/profissionais/adriana/index.html`, `deploy/especialidades/saude-integrativa/index.html` | Parcial. Manter ou retirar a oferta é decisão do dono |
| 11 | Alto | `politicas.html` publicada declarando em texto visível que é rascunho não validado por advogado | `deploy/politicas.html` | Não. Exige revisão jurídica humana |
| 12 | Alto | Zero prova social. O brandbook exige a estrela 5.0 no Google com link real e ela não existe | site inteiro | Não. Depende do perfil real e de dado do dono |
| 13 | Alto | Nenhum CNPJ nem razão social em 95 arquivos HTML | rodapé de todas as páginas | Não. Dado do dono |
| 14 | Médio | 39% do corpo do site se repete entre páginas. Perfis chegam a 66%, artigos vazios a 90% | agregado | Sim, ampliando conteúdo próprio |
| 15 | Médio | Profundidade fina: mediana de 272 palavras nos perfis e 543 nas especialidades, para consultas locais YMYL competitivas | `deploy/profissionais/`, `deploy/especialidades/` | Sim |
| 16 | Médio | 4 usos de "garantir" ("garantimos a excelência", "garantindo que a cirurgia seja a decisão certa", "garantindo proteína e recuperação") | `sobre.html`, `yale-jeronimo`, `daniel-forster`, `estetica-corporal` | Parcial. A bandeira 05 é intocável por decisão de marca |
| 17 | Médio | "Referência em lactação pela osteopatia" e "conduta eficaz" sem base citada | `natalie-queiroz`, `especialidades/tricologia/` | Sim |
| 18 | Médio | Sócia fundadora citada como "médica" sem CRM | `deploy/sobre.html` | Sim, se o dono fornecer o número; senão, retirar a titulação |
| 19 | Médio | Artigos não linkam a página do autor, e `author` no schema não tem `url` nem `sameAs`. As 31 páginas de perfil existem e não são aproveitadas | `scripts/artigos.mjs` | Sim |
| 20 | Médio | "© 2021" no rodapé de 62 páginas em 2026 | rodapé | Sim |
| 21 | Baixo | Contagem de profissionais inconsistente: "saúde integrativa 5" no corpo contra "terapia integrativa 1" no menu da mesma página | `deploy/especialidades.html` | Sim |
| 22 | Baixo | FAQ só nas 8 especialidades. Nenhuma nos artigos, perfis ou páginas raiz | `scripts/artigos.mjs`, `scripts/perfis.mjs` | Sim |
| 23 | Baixo | "excelência" 71 vezes e "alto padrão" no institucional. Autoelogio contínuo sem lastro verificável | rodapé, home, sobre, mentorias | Parcial. Colide com marca |
| 24 | Baixo | 22 de 31 URLs saíram ao ar com `<title>` duplicado e nenhum gate pegou. Corrigido em `890f1c8` durante esta auditoria | histórico | Já corrigido. Falta o gate |

---

## 4. O que está bom, com prova

Para não confundir dureza com cegueira, o que a medição sustenta como bom:

- **Metadados únicos:** 62 títulos e 62 descrições distintos em 62 páginas.
- **Dados estruturados completos:** 62/62 páginas com JSON-LD válido, incluindo
  `MedicalClinic`, `MedicalWebPage`, `FAQPage` ×8, `Person` ×31,
  `BreadcrumbList` ×31, `Article` ×14.
- **Crédito com credencial:** 13 dos 14 artigos exibem conselho e número na
  linha de assinatura; os perfis exibem classe e registro no H1 e no schema.
- **FAQ que encara objeção:** 28 itens, incluindo preço, convênio e o que o
  procedimento não resolve.
- **Voz sem oferta:** 0 em-dash, 0 "promoção", 0 "desconto", 0 urgência
  fabricada, 0 "antes e depois" de paciente.
- **Responsável técnico e endereço** no rodapé de todas as 62 páginas.
- **Disclaimer correto** nos 14 artigos e no ecooa.match, com aviso de urgência.

---

## 5. O que não foi possível medir e por quê

| Item | Por quê |
|---|---|
| Desempenho orgânico real (posição, impressão, CTR, tempo na página) | Sem acesso ao Search Console nem ao GA4. É trabalho de P14 |
| Se o conteúdo é percebido como útil por paciente real | Exige teste com usuário, não instrumentação |
| Originalidade contra a web (plágio ou canibalização com concorrentes) | O domínio real e a busca externa não são alcançáveis deste ambiente (proxy 403). A medição de duplicação aqui é **interna ao site**, não contra terceiros |
| Veracidade dos 21 registros marcados como `confirmado` | Exige consulta aos portais de CFM, CRN, COREN, CRBM, CREFITO, CRP, CRF e CRO. Não alcançáveis daqui |
| Se Scheila Andrzejewski segue sócia e qual o CRM dela | Dado do dono |
| Correção clínica dos 495 palavras de corpo que existem | Fora do escopo desta dimensão. Exige revisão de quem assina, registrada como pendência em `docs/mythos/PENDENCIAS-DO-DONO.md` |
| Se a CSP de produção altera a renderização de algum bloco de texto | O laboratório serve com a CSP de produção, mas a regra ativa hoje é injetada no painel da Cloudflare (`ESTADO-REAL.md` §4) e não pôde ser comparada |
| Existência de perfil no Google Business com avaliação 5.0 | Fora do repositório. Depende do dono |

---

## 6. Justificativa da nota: 33/100

O que puxa para cima: metadados, schema, FAQ, crédito com credencial e um tom
de voz que é genuinamente bom e regulatoriamente consciente na maior parte do
texto. Nada disso é pouco.

O que decide a nota é o centro da dimensão. A autoridade de uma clínica de saúde
se constrói com conteúdo que responde e com sinais que provam quem responde.
Aqui, **12 de 14 artigos não têm uma única palavra de corpo**, e o total do
editorial são 495 palavras, enquanto a home vende "8 min de leitura" e o índice
promete "base científica". A camada de confiança que o YMYL exige está ausente
por medição, não por impressão: **0 referências, 0 `dateModified`, 0 revisão
declarada, 0 política editorial, 0 prova social, 0 CNPJ**, e o disclaimer médico
não existe em nenhuma das 39 páginas que descrevem serviço ou conduta. Some a
isso 114 blocos de palavra-chave despejados no texto visível, 110 erros de
acentuação contra regra do próprio projeto, e um punhado de afirmações que
qualquer fiscalização de conselho olharia duas vezes.

Um site que promete conteúdo científico e entrega zero parágrafo em 86% do seu
editorial não pode tirar nota média nesta dimensão.
