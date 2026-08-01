# P17 · Tribunal ético e regulatório

Parecer final de conformidade ético-regulatória sobre o site publicado da ecooa
(`deploy/`), com poder de veto sobre a publicação.

- **Objeto:** as 95 páginas HTML de `deploy/`, das quais 62 estão no `sitemap.xml`.
- **Laboratório:** `http://localhost:4353`, servindo `deploy/` com a CSP de produção.
- **Data:** 2026-08-01.
- **Modo:** somente leitura. Nenhum arquivo de `deploy/`, `src-site-3/` ou
  `scripts/` foi alterado. Único arquivo escrito: este parecer.
- **Nota do estado atual: 52/100.**
- **Parecer ético-regulatório: bloquear publicação.**

Resumo em uma frase: a camada de linguagem melhorou de forma real e mensurável
nesta sessão, e as 27 mil palavras novas não trazem um único dado inventado, mas
a mesma sessão colocou a queixa clínica literal do visitante na barra de
endereço, apagou a frase que prometia o contrário, e multiplicou a exposição
indexada de cinco profissionais anunciados sem registro, de modo que o saldo
ético-regulatório do build é negativo nos pontos que mais importam.

---

## 1. Independência, fronteiras e vigência das normas

**Independência.** Este parecer foi produzido em contexto separado de quem
executou a sessão. Nenhuma conclusão foi aceita de documento: cada afirmação
abaixo tem arquivo, linha ou medição de navegador. Onde os documentos da sessão
ou o laudo de baseline afirmam algo que o HTML não confirma, isso está
registrado como achado, e onde eles afirmam algo que o HTML confirma, isso está
registrado como crédito.

**Este parecer também auditou o laudo anterior.** `docs/mythos/baseline/etica.md`
é um trabalho sério, e a maior parte dos seus achados se confirma. Dois não se
confirmam, e estão listados na seção 8 com a prova da absolvição. Auditoria que
só confirma a auditoria anterior não é auditoria.

**Vigência das normas (Lei da Norma Citável).** Nenhum artigo entrou aqui de
memória sem ressalva. As normas usadas como régua:

| Norma | Uso | Ressalva |
|---|---|---|
| Código de Ética Médica, Resolução CFM nº 2.217/2018 (alterada pelas 2.222/2018 e 2.226/2019) | arts. 112, 113, 115, 117 | vigente até onde alcança este ambiente |
| Resolução CFM nº 2.336/2023 (publicidade médica) | exigência de RQE em anúncio de especialidade | **revogou a Resolução CFM nº 1.974/2011**, citada no briefing desta sessão. Normas de publicidade são as que mais mudam e já sofreram questionamento judicial. Confirmar vigência antes de usar em defesa |
| Resolução CFM nº 2.147/2016 | diretor técnico médico de estabelecimento | vigência não verificável daqui |
| Lei nº 12.842/2013, art. 4º | atos privativos do médico, incluindo diagnóstico nosológico | vigente |
| Lei nº 7.498/1986, art. 11, II, "c", e Decreto nº 94.406/1987 | limites da prescrição pelo enfermeiro | vigente |
| Resoluções COFEN nº 564/2017 (ética) e nº 554/2017 (publicidade) | enfermagem | vigência não verificável daqui |
| Resolução CFN nº 599/2018 | Código de Ética e Conduta do Nutricionista, identificação com CRN em divulgação | vigência não verificável daqui |
| Resolução CFP nº 10/2005 e Resolução CFP nº 11/2018 | ética do psicólogo e serviços por meio de TIC | vigência não verificável daqui |
| Resoluções CFO nº 118/2012 e nº 198/2019 | ética odontológica e harmonização orofacial como especialidade odontológica | matéria com disputa judicial e entre conselhos. Tratada aqui como **risco**, não como violação declarada |
| Resoluções do CFBM e do CFF sobre estética | escopo de biomédico esteta e farmacêutico esteta | não citadas por número. Risco apontado, validação jurídica recomendada |
| LGPD, Lei nº 13.709/2018 | arts. 5º II, 6º VI, 7º, 8º §5º, 9º, 11, 18, 33 a 36, 41 | vigente |
| CDC, Lei nº 8.078/1990 | arts. 31, 36 § único, 37 §1º | vigente |

Onde não foi possível fixar o artigo exato, o achado está classificado como
risco e a recomendação é validação jurídica. Este parecer reduz risco. Não o
elimina, e não substitui advogado com prática em direito médico.

---

## 2. Método, com os números

Nada foi estimado. Todo número abaixo é reprodutível.

1. **Inventário.** Varredura recursiva de `deploy/`: 95 arquivos `.html`, 62
   `<loc>` no `sitemap.xml` (9 raiz, 8 áreas, 31 perfis, 14 artigos). Das 95
   páginas, 67 são páginas reais e 28 são stubs de redirecionamento por
   `meta refresh`, verificado um a um.
2. **Extração de texto.** As 95 páginas tiveram `<script>` e `<style>`
   removidos e as tags convertidas em quebra de linha, gerando 95 arquivos de
   texto. Toda varredura léxica rodou sobre eles.
3. **Varredura léxica com contexto**, 15 famílias de padrão regulatório
   (promessa, superlativo, sensacionalismo, mercantilização, antes e depois,
   titulação, prescrição e dose, marca de fármaco, autodiagnóstico, ato
   diagnóstico, dado sensível, autoelogio, práticas sem reconhecimento,
   harmonização), em duas passadas, com e sem fronteira de palavra. **Cada
   ocorrência foi classificada por contexto antes de ser classificada por
   risco**, e as absolvições estão escritas na seção 8.
4. **Metadados.** Varredura separada de `<title>`, `meta description` e
   `og:description` das 95 páginas, porque o buscador exibe o metadado e a
   fiscalização também o lê. O texto extraído não os alcança.
5. **JSON-LD.** Todos os blocos `application/ld+json` inventariados por `@type`,
   incluindo os nós dentro de `@graph`, e testados por `JSON.parse`.
6. **Dados-fonte.** `deploy/dados-ecooa.js` segmentado por profissional (31
   registros) e cruzado campo a campo com o texto renderizado de cada perfil.
   `scripts/almanaque.mjs` varrido por verbo de ato privativo, filtrado por
   classe profissional.
7. **Navegador real.** Playwright com Chromium 1194, viewport 390x844, contra o
   laboratório. Foram medidos: o fluxo completo do ecooa.match com três frases
   distintas, o `dataLayer` interceptado, as requisições externas, os `href` de
   WhatsApp gerados, o `localStorage`, a URL resultante e a visibilidade real
   dos avisos.
8. **Resolução de links.** As 62 URLs do sitemap abertas em navegador, com o
   link da política resolvido pelo DOM (que honra `<base href="/">`) e testado
   por requisição.

---

## 3. O que o site faz certo, com prova

Isto não é cortesia. É o resultado de uma varredura que procurou o oposto e não
encontrou. Em site de clínica multidisciplinar, este conjunto é raro.

| Verificação | Resultado medido |
|---|---|
| Percentuais, taxas ou proporções em qualquer página | **0**. Zero caractere `%` nas 95 páginas |
| Estudo, pesquisa, meta-análise ou instituição citada como lastro | **0** ocorrências de "estudos mostram", "segundo a", "de acordo com", "OMS", "Ministério da Saúde", "literatura" |
| Dose, posologia, miligrama, mililitro, comprimido, protocolo numerado | **0** ocorrências |
| Marca comercial de fármaco (Ozempic, Mounjaro, Wegovy, Sculptra, Ultraformer, gestrinona, "chip da beleza" e outras 15 testadas) | **0** |
| Imagem ou seção de antes e depois de paciente | **0** |
| Depoimento de paciente | **0** |
| `aggregateRating`, `Review`, `ratingValue`, `reviewCount` no JSON-LD | **0**, e o gate falha se voltarem (`scripts/validate-output.mjs:287`) |
| Preço, desconto, promoção, parcelamento, cupom, sorteio, "por apenas" | **0** |
| Urgência fabricada ("corra", "últimas vagas", "por tempo limitado") | **0** |
| Autodiagnóstico ("descubra se você tem", "faça o teste") | **0** |
| JSON-LD sintaticamente inválido | **0** de 88 blocos |
| Artigos com autor nomeado, classe e número de registro na assinatura | **14 de 14** |
| Artigos com aviso "não substitui consulta, diagnóstico nem tratamento" | **14 de 14** |
| Responsável técnico visível no rodapé | **67 de 67** páginas reais. As 28 sem rodapé são stubs de redirect, verificado um a um |

O risco maior anunciado para texto gerado por IA em saúde, o **dado inventado**,
não se materializou. Foram acrescentadas nesta sessão cerca de 11 mil palavras
nas 8 páginas de área (medido: 1.498 a 1.749 palavras de corpo por página) e
cerca de 15,4 mil palavras nos 14 artigos, e não há um único percentual, ano de
estudo, nome de instituição ou número de eficácia em nenhuma delas. Isso merece
ser dito com todas as letras, porque era o desfecho mais provável e não
aconteceu.

Há também recusa explícita de promessa, escrita no site: *"Não existe prazo
garantido, e prometer um seria desonesto"*, *"às vezes o melhor procedimento é o
que não se faz"*, *"Alta também é resultado"*. E há delimitação de escopo escrita
em três páginas de área: *"cada uma executando apenas o que o conselho da própria
profissão autoriza"*.

**Melhora real desta sessão, medida contra o laudo de baseline:** a
biorressonância, que o baseline registrou em 13 trechos com verbo terapêutico,
hoje aparece 11 vezes, das quais 1 com verbo avaliativo, e a página de área
ganhou a ressalva explícita *"Não são exame, não fecham diagnóstico e não
substituem investigação clínica"*, que não existia. Isso é progresso verificado.

---

## 4. Confronto: o que a sessão afirmou contra o que o HTML mostra

| Afirmação nos documentos da sessão | Verificação | Veredito |
|---|---|---|
| "queixa clínica retirada da URL do WhatsApp" (EXECUCAO.md, commit `79c5ac7`) | Medido: os 7 links `wa.me` da tela de resultado carregam apenas o bloco editorial ("saúde mental") e o nome do profissional. A frase digitada não aparece | **Confirmado** |
| "Busca compartilhável no ecooa.match: o match passou a aceitar `?q=` na URL" (EXECUCAO.md, Onda 2) | Medido: a frase literal digitada pelo visitante passa a compor a URL da página. Testado com "tenho pensamentos suicidas e quero morrer" | **Confirmado, e é o achado ETI-01.** A mesma sessão tirou a queixa de uma URL e a colocou em outra, pior |
| "O termo que a pessoa digita no ecooa.match é informação sensível e não é enviado" (EXECUCAO.md e `scripts/medicao.mjs:26`) | Medido: verdade para o `dataLayer`. Falso para o `page_location`, porque a frase está na própria URL da página | **Parcialmente falso** |
| "Nenhum cookie de análise antes do aceite. Quem recusa não carrega o GTM" | Medido em contexto limpo, `localStorage` vazio, após rolagem e após 4 s: **zero requisições externas**. O GTM só carrega no clique em "aceitar" | **Confirmado.** Corrige o achado 10 do baseline |
| "Consent Mode v2 com todo armazenamento negado por padrão" | Medido: `analytics_storage: denied` no primeiro push do `dataLayer` | **Confirmado** |
| "sem `aggregateRating` e sem `Review`, e o gate falha se aparecerem" | Verificado no HTML (0 ocorrências) e no gate (`validate-output.mjs:287-290`) | **Confirmado** |
| "os 31 têm conduta preenchida, nenhuma página nasce magra" | Verificado nos 31 perfis | **Confirmado** |
| "Artigos com texto próprio: 2 de 14 para 14 de 14" (SCORECARD-FINAL.md) | Medido corpo de `<article>`: 12 artigos entre 1.173 e 1.307 palavras, e **2 artigos com 309 e 350 palavras**. Os dois curtos são justamente `canetas-emagrecedoras` (análogos de GLP-1) e `implante-hormonal-subcutaneo`, os dois temas de maior risco farmacológico do site | **Literalmente verdadeiro, materialmente enganoso.** O briefing desta sessão é mais honesto: "11 dos 14 artigos escritos do zero" |
| "280 violações regulatórias encontradas e corrigidas" (SCORECARD-FINAL.md, 157 nas áreas e 123 nos artigos) | Procurado artefato que sustente o número: log do guardião, relatório antes e depois, diff anotado. **Não existe nenhum** em `docs/`, `docs/mythos/` ou `scripts/` | **Não verificável.** Ver ETI-19 |
| "os registros em validação estão sinalizados como tal" (`deploy/politicas.html`, seção de termos, texto público) | Varredura das 95 páginas: **0** ocorrências de "em validação", "a confirmar", "registro pendente" ou "ressalva". E `scripts/validate-output.mjs:240` **falha o build de propósito se a ressalva voltar** | **Falso, e agora travado em código.** Ver ETI-04 |
| "A política afirma: Não coletamos dados de saúde por meio deste site" | O site coleta frase livre de saúde, exibe na tela, grava na URL e infere categoria clínica | **Falso** |
| Laudo baseline: "link da política retorna 404 em 53 de 62 páginas" | Medido em navegador real nas 62 URLs: as páginas profundas trazem `<base href="/">`, e o link resolve para `/politicas.html` com status 200 em **57 de 57** páginas alcançáveis | **Achado anterior improcedente.** Ver seção 8 |

---

## 5. Tabela de achados

Severidade pelo risco regulatório real, não pela facilidade de correção.
"IA" na última coluna significa que a correção é textual ou de código e não
depende de documento, painel de terceiro ou decisão humana de mérito.

| ID | Sev. | Achado | Evidência | Dispositivo | IA |
|---|---|---|---|---|---|
| ETI-01 | **crítico** | A queixa clínica literal digitada pelo visitante é gravada na URL da página (`?q=`), entra no histórico do navegador, é compartilhável e será o `page_location` enviado ao GA4 | medido em navegador: `qual-profissional-procurar.html?q=tenho pensamentos suicidas e quero morrer`. Origem: `scripts/match.mjs`, feature "busca compartilhável" da Onda 2 | LGPD arts. 5º II, 7º, 11 e 11 §1º; art. 6º VI | sim |
| ETI-02 | **crítico** | Ideação suicida digitada no ecooa.match não aciona nenhuma referência de crise. O aviso "em caso de urgência, procure atendimento médico imediato" existe no DOM mas está **oculto** (`vis:false`) exatamente na tela de resultado. A frase é classificada como "queixa de saúde para investigar" e o visitante é encaminhado ao funil de WhatsApp | medido: `deploy/qual-profissional-procurar.html`, estado de resultado, nó com "urgência" com `offsetParent` nulo e `getClientRects().length === 0`. Zero ocorrências de CVV, 188, SAMU ou 192 em 94 das 95 páginas | Res. CFP nº 11/2018 e Código de Ética do Psicólogo; dever geral de cuidado; CDC art. 31 | sim |
| ETI-03 | **crítico** | A política de privacidade está publicada declarando-se, ao público, rascunho não validado por advogado que "não deve ser publicado como definitivo". É o destino dos três links do rodapé de 67 páginas e do link do banner de consentimento | `deploy/politicas.html`, primeiro parágrafo | LGPD arts. 6º VI e 9º | não |
| ETI-04 | **crítico** | Cinco profissionais são anunciados sem nenhum número de registro, agora em 38 aparições e em 5 URLs próprias e indexadas, enquanto a página de termos afirma ao público que os registros em validação estão sinalizados. **Não há uma única sinalização, e o gate automatizado impede que ela apareça** | `deploy/dados-ecooa.js` (5 com `registro:''`); `deploy/profissionais/{giancarla-rochemback,marvin-marques,gabrieli-avila,lara-caye,adriana}/index.html`, todos no `sitemap.xml`; `deploy/politicas.html` seção de termos; `scripts/validate-output.mjs:238-242` | CEM art. 117 por analogia; Res. CFN nº 599/2018; Res. CFP nº 10/2005; CDC arts. 31 e 37 §1º; LGPD art. 6º VI | sim |
| ETI-05 | **alto** | "especialista no diagnóstico e tratamento médico das alopecias" e "Médica tricologista", para médica com CRM-RS 49.185 e **sem RQE**. Nesta sessão o texto foi amplificado: passou a ocupar `meta description`, `og:description`, a `description` do JSON-LD `Person` e o texto visível da nova página indexada da profissional | 6 ocorrências em 3 páginas; "tricologista" 13 ocorrências em 5 páginas. `deploy/profissionais/yale-jeronimo/index.html`; `deploy/especialidades/tricologia/index.html`; `deploy/especialidades/medicina/index.html` | CEM arts. 115 e 117; Res. CFM nº 2.336/2023; Res. CFM nº 2.221/2018 (tricologia não consta como especialidade nem área de atuação) | sim |
| ETI-06 | **alto** | "31 especialistas" no `<title>` indexado de duas URLs e "mais de 30 especialistas" na `meta description` e no `og:description` da home, quando apenas **2 dos 5 médicos publicam RQE** e 10 dos 31 profissionais têm registro não confirmado ou ausente | `deploy/profissionais.html`, `deploy/profissionais/index.html`, `deploy/index.html` | CEM art. 115; CDC arts. 36 § único e 37 §1º | sim |
| ETI-07 | **alto** | Enfermeira (COREN-RS 395164) anuncia, na própria página indexada, conduzir reposição de nutrientes por soroterapia "com **protocolo definido a partir de avaliação e exames**", inclusive no bloco de **saúde hormonal**, cujo vocabulário de busca associado inclui "reposicao hormonal, implante hormonal, chip hormonal", e em blocos de imunidade, energia e retenção de líquido | `deploy/profissionais/danusa-pires/index.html`; `scripts/almanaque.mjs` | Lei nº 7.498/1986 art. 11, II, "c"; Lei nº 12.842/2013 art. 4º; Res. COFEN nº 564/2017; CDC art. 36 § único | sim |
| ETI-08 | **alto** | O site se contradiz sobre escopo em toxina botulínica terapêutica. A página de área afirma que bruxismo e ATM "são indicações conduzidas por medicina e odontologia, cada uma no seu escopo". As páginas de perfil de uma **biomédica** (CRBM-RS 627) e de uma **farmacêutica** (CRF-RS 588527) anunciam exatamente essa conduta | `deploy/especialidades/estetica-facial/index.html` linha 119 do texto extraído, contra `deploy/profissionais/leticia-melo/index.html` e `deploy/profissionais/tais-de-la-rosa/index.html` | Lei nº 12.842/2013 art. 4º; Res. CFO nº 118/2012; normas do CFBM e do CFF sobre escopo estético; CDC art. 31 | sim |
| ETI-09 | **alto** | "harmonização orofacial", designação de especialidade odontológica, anunciada por **5 não dentistas** (4 biomédicas e 1 farmacêutica) em 44 ocorrências e 14 páginas. A ressalva de escopo existe em 3 páginas de área e **em nenhuma das 5 páginas de perfil**, que são as novas URLs indexadas | `deploy/dados-ecooa.js`; perfis de Letícia Melo, Eduarda Schoenmeier, Karine Ellwanger, Jennifer Adam e Tais de la Rosa | Res. CFO nº 198/2019 e Res. CFO nº 118/2012, com a ressalva de disputa judicial e entre conselhos. **Risco, não violação declarada** | não |
| ETI-10 | **alto** | Ausência total de identificação legal do estabelecimento: **0** ocorrências de CNPJ e de razão social em 95 páginas; **0** ocorrências de "diretor técnico" ou "responsável técnico" por extenso; a sigla "RT" nunca é explicada; não há inscrição do estabelecimento no CRM; e há **um único responsável técnico, médico, para as 9 classes profissionais anunciadas** | rodapé de 67 páginas: `RT Gustavo Gehrke · CREMERS 35.822` | Res. CFM nº 2.147/2016; Res. CFM nº 2.336/2023; CDC art. 31; normas de responsabilidade técnica de CFN, CFO, CFP, CFBM, COFEN, CREFITO e CFF | não |
| ETI-11 | **médio** | O evento `match_resultado`, com a categoria de saúde inferida, é empurrado ao `dataLayer` **antes** de qualquer decisão do titular. O GTM não carrega antes do aceite, o que impede a transmissão imediata, mas ao carregar ele **reprocessa a fila inteira desde o índice 0**. O consentimento, portanto, é retroativo sem que o aviso diga isso | medido: `{event:"match_resultado", bloco:"saúde mental", indicados:"Francielle,Manuela,Augusto,Adriana,Gabrieli", total:5}` presente no `dataLayer` com `localStorage` vazio | LGPD arts. 8º, 9º e 11 | sim |
| ETI-12 | **médio** | Regressão de transparência: a frase "Sua frase não é armazenada. Ela só orienta a sugestão desta tela", registrada como mitigação no laudo de baseline, **não existe mais**. Zero ocorrências de "armazen" em 95 páginas. A garantia sumiu na mesma sessão em que a frase passou a ir para a URL | varredura das 95 páginas | LGPD art. 6º VI | sim |
| ETI-13 | **médio** | A política afirma "Não coletamos dados de saúde por meio deste site, e pedimos que informações clínicas não sejam enviadas". O site pede a queixa em campo livre, exibe, grava na URL, infere categoria clínica e monta a mensagem de WhatsApp com ela | `deploy/politicas.html` contra `deploy/qual-profissional-procurar.html` | LGPD arts. 6º I e VI, 9º e 11 | sim |
| ETI-14 | **médio** | Não existe forma de revogar o consentimento depois da primeira escolha. A decisão fica em `localStorage` sem nenhuma interface de gestão | `scripts/medicao.mjs:15-17` reconhece a lacuna; confirmado no HTML | LGPD art. 8º §5º | sim |
| ETI-15 | **médio** | Autoelogio sem lastro: "Priorizamos e **garantimos** a excelência em tudo que fazemos" (bandeira 09) e "mesmo padrão de excelência" em **69 ocorrências, 67 páginas**. "Espaço de alto padrão, regulamentado" | `deploy/sobre.html`; rodapé de 67 páginas | CEM art. 112; Res. CFM nº 2.336/2023; Res. CFN nº 599/2018; CDC arts. 36 § único e 37 §1º | sim |
| ETI-16 | **médio** | "mais repercutida" aplicado a 3 artigos em **201 ocorrências, 67 páginas**, sem nenhuma métrica que sustente a afirmação | megamenu editorial, todas as páginas reais | CDC arts. 36 § único e 37 §1º | sim |
| ETI-17 | **médio** | As **31 páginas de perfil**, que descrevem conduta clínica queixa a queixa e nasceram nesta sessão, não trazem **nenhum** aviso de que o conteúdo não substitui consulta, diagnóstico ou tratamento. Nos artigos o aviso está em 14 de 14; nas áreas, em 3 de 8 | `deploy/profissionais/*/index.html` | CEM art. 112; CDC art. 31 | sim |
| ETI-18 | **médio** | Médica sócia fundadora nomeada como "médica" sem CRM. Um artigo é assinado com registro de estado `a-confirmar` (CRN-2 12076P). "Método Ascensão Capilar", método proprietário nomeado, anunciado por enfermeira, com "Idealizadora do". "Embasamento científico" afirmado 5 vezes sem fonte | `deploy/sobre.html` ("Scheila Andrzejewski, médica"); `deploy/blog/nutricao-esportiva-performance/`; `deploy/profissionais/danusa-pires/` | CEM art. 117; Res. COFEN nº 554/2017; CDC art. 36 § único | parte |
| ETI-19 | **médio** | O número "280 violações regulatórias encontradas e corrigidas" é publicado no placar oficial do projeto **sem nenhum artefato que o sustente**. Não há log do guardião, relatório antes e depois, nem diff anotado em `docs/`, `docs/mythos/` ou `scripts/`. Número de conformidade sem prova é o mesmo vício que este tribunal julga no site | `docs/mythos/SCORECARD-FINAL.md:113-117` | governança documental. Sem dispositivo externo | não |
| ETI-20 | **baixo** | Terapeuta integrativa sem conselho de classe anuncia que "**avalia** desequilíbrios do organismo" por biorressonância, e aparece na posição 04 da rota de saúde mental ao lado de três psicólogos com CRP | `deploy/profissionais/adriana/index.html`; `scripts/almanaque.mjs`; medido no navegador | CEM arts. 112 e 113; Lei nº 12.842/2013 art. 4º; CDC art. 36 § único | sim |
| ETI-21 | **baixo** | Encarregado (DPO) não nomeado. Canal de exercício de direitos e contato institucional em conta gratuita de terceiro (`ecooa.adm@gmail.com`). Compartilhamento com Google e Meta e transferência internacional não declarados na política | `deploy/politicas.html`; rodapé de 67 páginas | LGPD arts. 9º V, 33 a 36, 41 §1º e 46 | não |
| ETI-22 | **baixo** | Higiene de identificação: "RT" nunca explicado; "**CREMERS** 35.822" no rodapé (67 ocorrências) contra "**CRM-RS** 35.822" nos perfis (21 ocorrências), duas grafias para o mesmo registro; aviso de copyright "© 2021" em 67 páginas, cinco anos desatualizado. Os formulários de newsletter trazem finalidade declarada ("Guardamos apenas o seu e-mail, e só para enviar o editorial") mas nenhum link para a política no ponto de coleta | rodapé de 67 páginas; `deploy/index.html`, `deploy/mentorias.html`, `deploy/sublocacao.html` | CDC art. 31; LGPD art. 9º | sim |

---

## 6. Detalhamento dos críticos

### ETI-01 · A queixa clínica foi para a barra de endereço

Medido, com a frase mais grave que um site de saúde pode receber:

```
http://localhost:4353/qual-profissional-procurar.html?q=tenho pensamentos suicidas e quero morrer
```

O visitante não colou esse link. Ele digitou a frase no campo e apertou Enter, e
a aplicação reescreveu a URL. A partir daí:

1. A declaração de saúde entra no **histórico do navegador**, que é compartilhado
   em computador de casa, de trabalho e de família.
2. Qualquer captura de tela ou link copiado carrega a frase.
3. Quando o GA4 for configurado, e o Bloqueio 2 de `PENDENCIAS-DO-DONO.md`
   instrui o dono a configurá-lo, o parâmetro `page_location` levará a URL
   inteira ao Google, associada a IP e identificador de cliente. Não é categoria
   editorial. É a declaração literal da pessoa sobre a própria saúde.

O que torna este achado grave não é a engenharia, é a **contradição interna**. O
comentário em `scripts/medicao.mjs:26` diz: *"O termo buscado no match É
informação sensível, então ele NÃO é enviado"*. A afirmação é verdadeira para o
`dataLayer` e falsa para a URL. A mesma sessão que removeu a queixa da URL do
WhatsApp, com razão, a introduziu na URL da própria página, e a segunda versão é
pior: no WhatsApp viajava a categoria editorial, aqui viaja a frase inteira.

Categoria de saúde e declaração sobre saúde são dado pessoal sensível pelo
art. 5º, II, da LGPD, e o art. 11 exige consentimento específico e destacado, ou
outra hipótese legal. Nenhuma existe nem está declarada.

**Correção possível sem perder a funcionalidade:** guardar a busca em
`sessionStorage` ou em `history.replaceState` com um identificador opaco em vez
do texto, e manter o `?q=` apenas quando ele vier de fora, nunca escrevê-lo a
partir do que a pessoa digitou.

### ETI-02 · Ideação suicida sem rede de proteção

Medido, com a mesma frase. O resultado:

- classificação: `queixa de saúde para investigar`. A frase nem sequer é
  roteada para saúde mental;
- a frase é ecoada na tela, entre aspas, sob o rótulo "entendemos";
- **nenhuma** referência a CVV 188, SAMU 192, emergência ou serviço de crise, em
  94 das 95 páginas do site;
- o aviso "Ele não faz diagnóstico, não indica tratamento e não substitui uma
  consulta. Em caso de urgência, procure atendimento médico imediato" **existe no
  DOM e está oculto** na tela de resultado. Medido: `offsetParent` nulo e
  `getClientRects().length === 0`;
- o encaminhamento oferecido é agendamento por WhatsApp, que depende de alguém
  responder em horário comercial, conforme o Bloqueio 8 de
  `PENDENCIAS-DO-DONO.md`.

Uma ferramenta que aceita texto livre sobre sofrimento psíquico, exibe esse texto
de volta e não tem tratamento para crise é um risco de dano real, não apenas
regulatório. E o único aviso que existia desaparece exatamente no estado em que
seria necessário. Este é o achado que, sozinho, justifica o veto.

**Correção mínima:** manter o aviso de urgência visível em todos os estados da
ferramenta, e acrescentar um bloco de crise, com CVV 188 e SAMU 192, acionado por
vocabulário de risco e presente de forma permanente nas páginas de saúde mental.

### ETI-03 · A política se declara rascunho, publicada

Primeiro parágrafo de `deploy/politicas.html`, visível ao público:

> "Este texto é um rascunho preparado para revisão jurídica. Ele ainda não foi
> validado por um advogado e não deve ser publicado como definitivo."

A página está no ar e é o destino dos três links do rodapé de 67 páginas e do
link dentro do banner de consentimento, que aparece justamente quando o titular
precisa decidir. O aviso é honesto, e é por isso que funciona como confissão: o
controlador declara, por escrito, que o instrumento que comunica o tratamento de
dados não está pronto. Um documento que se anuncia como não validado não cumpre a
transparência exigida pelos arts. 6º, VI, e 9º da LGPD.

Correção textual depende de validação humana, documental ou jurídica.

### ETI-04 · O registro ausente, a ressalva prometida, e o gate que a proíbe

Cinco profissionais aparecem sem nenhum número de registro, em 38 aparições
(medido: Giancarla Rochemback em 16 páginas, Adriana em 7, Marvin Marques,
Gabrieli Klagenberg Avila e Lara Caye em 5 cada). O baseline contava 28
aparições. **A sessão aumentou a exposição em 36%**, porque cada um ganhou uma
URL própria, indexada no sitemap, com `<title>` que é anúncio de serviço
profissional:

```
<title>Giancarla Rochemback · Nutricionista em Porto Alegre · ecooa</title>
```

e uma `meta description` que termina em "Agende pelo WhatsApp", sem CRN em lugar
nenhum da página. Nas quatro nutricionistas, a Resolução CFN nº 599/2018 obriga a
identificação com o número do CRN em qualquer divulgação de serviço.

O caso de Adriana é distinto e mais grave: "terapeuta integrativa" não é profissão
regulamentada, não há conselho, ela aparece apenas com o primeiro nome, e o
ecooa.match a indica na posição 04 de uma rota de saúde mental, ao lado de três
psicólogos com CRP. Medido no navegador.

O que transforma isto de problema de dados em declaração pública incorreta é o
texto dos termos, em `deploy/politicas.html`:

> "As informações de registro exibidas no site refletem o que foi informado por
> cada profissional, e **os registros em validação estão sinalizados como tal**."

Varredura das 95 páginas: **zero** sinalizações. E não é esquecimento. É regra
travada em código, em `scripts/validate-output.mjs:238-242`:

```js
/* decisao do dono em 2026-07-31: numero valido aparece limpo, sem ressalva;
   sem numero, o campo nao aparece. A ressalva nao pode voltar por acidente. */
if (/registro a adicionar|· a confirmar/.test(home)) {
  erro('a ressalva de registro voltou ao modal, contra a decisao de 2026-07-31');
}
```

O projeto tem um invariante automatizado que **falha o build se a ressalva
aparecer**, enquanto a página de termos afirma ao público que ela existe. Uma
decisão estética legítima do dono virou, sem que ninguém percebesse, uma afirmação
falsa em documento público. Ou o site passa a sinalizar, ou os termos param de
dizer que sinaliza. As duas coisas juntas não podem ficar no ar.

---

## 7. Detalhamento dos altos que nasceram ou cresceram nesta sessão

### ETI-05 e ETI-06 · "Especialista" sem RQE, agora dentro do schema

O texto é antigo, vem de `bio` em `deploy/dados-ecooa.js`. O que a sessão fez foi
**multiplicar as superfícies**. Em `deploy/profissionais/yale-jeronimo/index.html`
a mesma frase ocupa hoje quatro lugares: texto visível, `meta description`,
`og:description` e a `description` do JSON-LD `Person`. O metadado é o que o
buscador exibe e o que a fiscalização lê primeiro, e agora ele é tão ousado
quanto a vitrine.

Nos dados, o registro é `CRM-RS 49.185`, sem RQE. Apenas 2 dos 5 médicos publicam
RQE, e ambos são dermatologistas com a classe corretamente escrita como "Médica
dermatologista". A disciplina existe no elenco, o que prova que o projeto sabe
fazer certo: ela só não foi aplicada aqui. "Tricologia" não consta da lista de
especialidades e áreas de atuação reconhecidas.

A fórmula segura, quando não há RQE, é "atuação em" ou "amplo conhecimento em",
nunca "especialista em". A mesma correção resolve `<title>` de
`/profissionais` ("31 especialistas") e a `meta description` da home ("mais de 30
especialistas"), que são conteúdo indexado.

### ETI-07 e ETI-08 · O site contradiz o próprio limite de escopo

`deploy/especialidades/estetica-facial/index.html` escreve, com clareza exemplar:

> "Uso da toxina com finalidade terapêutica, e não estética, para apertamento
> dentário, dor na musculatura da mastigação e suor excessivo. **São indicações
> conduzidas por medicina e odontologia, cada uma no seu escopo**, e dependem de
> diagnóstico e avaliação antes."

E então, nas páginas de perfil recém-criadas:

> "Na harmonização orofacial, **Letícia** usa toxina para aliviar a tensão do
> aperto e do ranger dos dentes, quando indicado."
> `deploy/profissionais/leticia-melo/index.html` · Biomédica · CRBM-RS 627

> "Na harmonização orofacial, **Tais** avalia a musculatura da face e monta o
> plano de alívio e manutenção."
> `deploy/profissionais/tais-de-la-rosa/index.html` · Farmacêutica · CRF-RS 588527

Bruxismo e disfunção temporomandibular são condições de saúde. A regra escrita
pelo próprio site diz quem as conduz, e as páginas de perfil colocam duas
profissionais fora dessa lista fazendo exatamente isso. Não preciso decidir a
disputa de escopo entre conselhos para condenar: **o site já a decidiu, e depois
se contradisse**.

O mesmo padrão em enfermagem, em `deploy/profissionais/danusa-pires/index.html`:

> "Danusa conduz a reposição de nutrientes por soroterapia, **com protocolo
> definido a partir de avaliação e exames**."

Definir protocolo terapêutico a partir de avaliação e exames não é ato de
enfermagem autônomo. A Lei nº 7.498/1986, art. 11, II, "c", limita a prescrição
pelo enfermeiro a medicamentos estabelecidos em programas de saúde pública e em
rotina aprovada pela instituição de saúde. Agrava o fato de a mesma profissional
aparecer no bloco de **saúde hormonal**, cujo vocabulário de busca associado, em
`scripts/almanaque.mjs`, inclui "reposicao hormonal, implante hormonal, chip
hormonal": quem procura reposição hormonal recebe o cartão de uma enfermeira.

A ressalva "cada uma executando apenas o que o conselho da própria profissão
autoriza" existe em 3 páginas de área e em **nenhuma** das 31 páginas de perfil.
Ela precisa descer para onde a conduta é descrita.

---

## 8. Absolvições com contexto, e dois achados anteriores derrubados

Auditoria que só acusa não é auditoria. O que foi encontrado pela varredura e
**não** é infração:

| Termo achado | Ocorrências | Por que foi absolvido |
|---|---|---|
| "antes e depois" | 5 | **Todas temporais**, nenhuma sobre imagem de paciente: "retornos, reavaliação e rastreamento em dia antes e depois", "o que comer antes e depois do treino", "cuida do fio nativo antes e depois da cirurgia" |
| "o melhor" | 4 | Contexto de negação e de limite: "às vezes **o melhor** procedimento é o que não se faz". É o profissional recusando a promessa, não fazendo uma |
| "referência" | 11 | **Faixa de referência laboratorial** em artigo sobre interpretação de exames. Nenhuma é "somos referência" |
| "garantido", "garantir", "garantia" | 3 | Contexto de recusa: "Não existe prazo **garantido**, e prometer um seria desonesto"; "o que não é o mesmo que **garantir** resultado"; "não uma **garantia** de que ajuda nunca mais será necessária" |
| "definitiva", "definitivo" | 4 | "a primeira escolha raramente é a definitiva"; "nenhuma dessas é sentença definitiva". Nenhuma promete permanência de resultado |
| "promoção" | 14 | **Todas** dentro de "Sem promoção, sem urgência", que é o oposto |
| "cortesia" | 1 | "A reavaliação faz parte do plano, não é cortesia". Negação |
| "preço" | 1 | "Não é coworking com preço como manchete". Negação, e em página B2B |
| "botox", "toxina botulínica" | 7 | Aparecem apenas em listas de **vocabulário de busca** ("Também procurado como: rugas, linhas de expressao, botox"), não como oferta de marca |
| "minoxidil", "testosterona", "estradiol" | 3 | Uso educacional, sem dose, sem marca, sem indicação executável. "Em integração com o médico responsável, acompanha pacientes que utilizam minoxidil" é justamente a delimitação correta de escopo |
| "especialistas" (2 de 4) | 2 | "discussão técnica legítima entre especialistas" e "reunir especialistas autônomos" são uso genérico, não titulação de indivíduo |
| "mestre em Bioquímica" | 3 | Título acadêmico verificável e declarado como tal, não titulação clínica. Fica a observação de que "acadêmico de Medicina" ao lado de atuação em nutrição merece leitura humana |
| "sua queixa" nos formulários | 0 | **Nenhum formulário do site coleta dado de saúde.** Os três são B2B (mentorias, sublocação, newsletter), e os dois de contato declaram no próprio corpo: "O envio abre uma conversa no WhatsApp com o que você escreveu" |

**Falso positivo de substring auditado:** a varredura por "cura" foi descartada
por casar com "pro**cura**", que aparece dezenas de vezes em uso legítimo
("Também **procura**do como"). A busca foi refeita com fronteira de palavra.

### Dois achados do laudo anterior que este tribunal derruba

**Baseline achado 2, crítico: "Link da política retorna 404 em 53 de 62 páginas".
Improcedente.** O laudo resolveu os links relativos com `curl`, que não interpreta
`<base>`. As páginas profundas de `deploy/` trazem `<base href="/">`, verificado
em `profissionais/adriana/index.html`, `blog/queda-de-cabelo-causas/index.html` e
`especialidades/medicina/index.html`. Medido em navegador real, nas 62 URLs do
sitemap: o link resolve para `http://localhost:4353/politicas.html` com status 200
em **57 de 57** páginas alcançáveis. Nenhum 404.

*Observação lateral, fora do escopo deste tribunal:* as 5 URLs restantes do
sitemap (`/sobre`, `/localizacao`, `/mentorias`, `/sublocacao`,
`/qual-profissional-procurar`) retornam 404 no laboratório porque estão
declaradas sem a extensão `.html`. É matéria de SEO técnico (P10), não de ética,
mas convém confirmar o comportamento na hospedagem real.

**Baseline achado 21, baixo: "16 páginas-ponte indexáveis sem rodapé, sem RT e sem
link de política". Improcedente na parte ética.** Foram lidas uma a uma: as 28
páginas sem rodapé são **todas** stubs de `meta refresh` com `canonical` para o
destino, com um parágrafo de aviso e nenhum conteúdo publicitário, nenhum nome de
profissional e nenhuma coleta de dado. Não há anúncio profissional a ser
identificado nem tratamento de dados a ser informado.

---

## 9. O que não foi possível verificar

1. **Veracidade dos 26 números de registro publicados.** As consultas públicas do
   CFM, CRN, CRP, CRO, CRF, CRBM, COREN e CREFITO não são alcançáveis daqui. Foi
   verificada presença e formato, nunca validade.
2. **Se existe RQE não publicado.** Os 3 médicos sem RQE nos dados podem tê-lo
   registrado no CRM. O achado ETI-05 é sobre a **publicação**, não sobre a
   qualificação.
3. **Se a pessoa jurídica está inscrita nos conselhos das 9 classes anunciadas** e
   se há responsável técnico de cada classe. Depende de documento societário e de
   consulta a cada conselho.
4. **CNPJ e razão social.** Não constam de nenhum arquivo do repositório.
5. **Conteúdo do contêiner GTM-TSR4GDMK.** O painel não é acessível. Mediu-se
   apenas o que o site empurra para o `dataLayer` e o que sai pela rede. Se
   houver pixel de Meta ou parâmetros extras configurados do lado do contêiner,
   este parecer não os viu.
6. **Comportamento no domínio real.** `www.somosecooa.com.br` não é alcançável
   deste ambiente. Tudo foi medido no laboratório. A CSP efetiva em produção vem
   de regra no painel da Cloudflare, fora do repositório, e `deploy/_headers` é
   inerte no GitHub Pages.
7. **Publicidade fora do site.** Instagram `@somos.ecooa`, Perfil da Empresa no
   Google e qualquer mídia paga estão fora deste escopo, e é ali que a maior
   parte das infrações de publicidade em saúde costuma acontecer. Anúncio pago é
   publicidade profissional fiscalizável, não "só marketing".
8. **Contrato de operador com Google e com Meta.** Documento jurídico.
9. **As 280 violações declaradas como corrigidas.** Sem artefato, não há o que
   auditar. Ver ETI-19.
10. **Leitura clínica de mérito dos 27 mil caracteres novos.** Este tribunal
    verificou conformidade regulatória, não correção técnica. A revisão de quem
    assina cada texto continua devida e está corretamente registrada no
    Bloqueio 7 de `PENDENCIAS-DO-DONO.md`.

---

## 10. O que precisa sair ou mudar antes de publicar

### Bloqueia a publicação. Nada vai ao ar antes disto.

1. **Parar de escrever a frase do visitante na URL** (ETI-01). Trocar o `?q=`
   escrito pela aplicação por estado interno. Correção de código, horas.
2. **Tratar crise no ecooa.match** (ETI-02). Manter o aviso de urgência visível
   em todos os estados e acrescentar bloco permanente com CVV 188 e SAMU 192 nas
   rotas e páginas de saúde mental. Correção de código e de texto, horas.
3. **Resolver a política de privacidade** (ETI-03). Ou o texto passa por advogado
   e o aviso de rascunho sai, ou a página sai do ar até isso acontecer. Publicar
   um instrumento que se declara não validado é pior do que não publicar. Decisão
   do dono, com advogado.
4. **Encerrar a contradição do registro** (ETI-04). Duas saídas, e só duas: os 10
   registros chegam e são publicados, ou o site passa a sinalizar quem está em
   validação, o que exige remover o invariante de
   `scripts/validate-output.mjs:238-242`. Enquanto nenhuma das duas acontecer, a
   frase "os registros em validação estão sinalizados como tal" precisa sair dos
   termos, hoje. Para Adriana, que não tem conselho, a página indexada deve dizer
   com todas as letras que a atividade não é profissão regulamentada e que a
   prática é complementar.

### Deve ser corrigido antes de qualquer investimento em tráfego

Anúncio pago amplifica o que já está no ar e transforma cada item abaixo em peça
publicitária fiscalizável.

5. Retirar "especialista" e "tricologista" das 3 páginas e das 4 superfícies da
   página de Yale Jerônimo, incluindo `meta`, `og` e JSON-LD. Substituir por
   "atuação em" (ETI-05).
6. Trocar "31 especialistas" e "mais de 30 especialistas" por "31 profissionais"
   no `<title>` e nas `meta description` (ETI-06).
7. Reescrever os textos de soroterapia da enfermeira para que nenhum deles
   descreva definição de protocolo ou indicação a partir de exames, e remover a
   presença dela do bloco de saúde hormonal (ETI-07).
8. Remover a conduta de bruxismo e ATM com toxina das páginas da biomédica e da
   farmacêutica, ou alinhar a página de área ao que se pretende sustentar. As
   duas versões não podem coexistir (ETI-08).
9. Levar a ressalva "cada uma executando apenas o que o conselho da própria
   profissão autoriza" das 3 páginas de área para as 31 páginas de perfil
   (ETI-09).
10. Acrescentar às 31 páginas de perfil o mesmo aviso que os 14 artigos já têm
    (ETI-17).
11. Publicar CNPJ, razão social e o nome do diretor técnico por extenso, com
    número, e resolver a questão do responsável técnico por classe (ETI-10).
    Decisão jurídica e societária.

### Higiene, sem bloqueio

12. Trocar "garantimos a excelência" e reduzir "padrão de excelência" (ETI-15).
13. Substituir "mais repercutida" por rótulo verificável, como "em destaque"
    (ETI-16).
14. Limpar a fila do `dataLayer` antes de carregar o GTM, para que o
    consentimento não seja retroativo (ETI-11).
15. Devolver ao ecooa.match a frase de que a busca não é armazenada, **depois** de
    a afirmação voltar a ser verdadeira (ETI-12).
16. Criar ponto de revogação do consentimento (ETI-14).
17. Alinhar a política ao que o site faz com dado de saúde (ETI-13).
18. Nomear encarregado, migrar o contato para domínio próprio, declarar o
    compartilhamento com Google e Meta e a transferência internacional (ETI-21).
19. Corrigir "© 2021", explicar "RT" e unificar "CREMERS" com "CRM-RS" (ETI-22).
20. Publicar o artefato das 280 violações ou retirar o número do placar (ETI-19).

---

## 11. Justificativa da nota e veredito

**Nota: 52/100.** O baseline media 46.

**O que subiu.** A camada editorial melhorou de forma real e verificável. As 8
páginas de área triplicaram e nasceram com ressalvas de escopo escritas, incluindo
a delimitação da biorressonância que não existia. Os 14 artigos têm autoria,
classe, registro e aviso de não substituição em 100% dos casos. E o risco que este
tribunal foi convocado para caçar, o dado inventado, simplesmente não apareceu:
zero percentuais, zero estudos citados, zero instituições, zero doses, zero marcas
comerciais oferecidas, em cerca de 27 mil palavras novas. Isso é resultado de
disciplina, não de sorte, e vale pontos.

**O que derrubou.** A sessão criou dois defeitos críticos que não existiam. A
frase clínica literal do visitante foi para a barra de endereço, no mesmo dia em
que a frase que prometia o contrário foi apagada da tela, e uma ferramenta que
aceita ideação suicida em texto livre esconde o único aviso de urgência que tem
exatamente na tela do resultado. E a sessão agravou dois defeitos que já existiam:
cinco profissionais sem registro passaram de 28 para 38 aparições e ganharam URL
própria indexada com `Person` no schema, e o "especialista" sem RQE, que vivia em
texto corrido, entrou em `meta`, em `og` e em JSON-LD. Somam-se a isso os
problemas formais herdados e intactos: política de privacidade publicada como
rascunho confesso, ausência total de CNPJ, razão social e diretor técnico por
extenso, e um único responsável técnico médico para nove classes profissionais.

O padrão é consistente e vale registrar como aprendizado da esteira: **a
otimização orgânica aumentou a superfície de exposição mais rápido do que a
conformidade conseguiu acompanhar**. Cada perfil novo é uma vitrine a mais para um
defeito que já existia. Indexar não é neutro em setor regulado.

Este tribunal não considera o site predatório. Ele é, na linguagem, mais honesto
do que a média do setor, e em vários pontos é exemplar. Mas ele ainda não
consegue provar o que afirma sobre si mesmo, e agora coleta na URL exatamente o
tipo de dado que a sua própria política jura não coletar.

**Parecer ético-regulatório: bloquear publicação.**

O veto é sobre este build, não sobre o site inteiro, e é estreito de propósito.
Resolvidos os quatro itens críticos da seção 10, este tribunal reavalia e o
parecer converte para "aprovado com ressalvas", ficando os itens 5 a 11 como
condição para qualquer investimento em tráfego pago. Os quatro críticos são
tratáveis: dois são correção de código de poucas horas, um é uma frase que precisa
sair dos termos hoje, e um é uma decisão do dono com advogado que já está aberta
como Bloqueio 5 em `PENDENCIAS-DO-DONO.md` desde antes desta sessão.

Estética, SEO e conversão não são defesas admissíveis contra nenhum dos quatro.

---

## 12. Devolução à esteira

| Achado | Etapa a reabrir | Dono | Prazo sugerido |
|---|---|---|---|
| ETI-01, ETI-12 | P04 (conversão crítica) e P14 (analytics) | executor técnico | antes do próximo deploy |
| ETI-02, ETI-17 | P12 (conteúdo) e P09 (acessibilidade, visibilidade do aviso) | executor técnico | antes do próximo deploy |
| ETI-03, ETI-21 | P04 (governança de dados) | dono, com advogado | 15 dias |
| ETI-04 | P12 e P05 (o invariante do gate) | dono (os 10 registros) e executor (a frase dos termos) | frase: hoje. Registros: 30 dias |
| ETI-05, ETI-06, ETI-15, ETI-16 | P12 (conteúdo) e P10 (metadados e schema) | executor técnico | antes de tráfego pago |
| ETI-07, ETI-08, ETI-09 | P12, com validação de cada conselho | dono, com cada profissional | 30 dias |
| ETI-10 | P01 (estratégia) e P04 | dono, com advogado e contador | 30 dias |
| ETI-11, ETI-13, ETI-14 | P14 e P07 | executor técnico | 15 dias |
| ETI-19 | P13 (QA e governança documental) | executor técnico | 7 dias |

**Termos novos para o guardião regulatório permanente (P08/P12),** com as exceções
de contexto já documentadas na seção 8: `especialista`, `especializado`,
`tricologista`, `garantimos`, `padrão de excelência`, `mais repercutida`,
`de ponta`, `único`, `exclusivo`, `embasamento científico`, `método` seguido de
nome próprio, `protocolo definido`, `avalia desequilíbrios`. O guardião deve
absolver automaticamente os contextos de negação e as listas de vocabulário de
busca, senão ele vira ruído e será desligado.

**Invariantes novos sugeridos para `scripts/validate-output.mjs`:** falhar se a
aplicação escrever texto livre em `location.search`; falhar se alguma página de
perfil não trouxer o aviso de não substituição; falhar se `politicas.html` contiver
a palavra "rascunho"; falhar se a afirmação sobre registros sinalizados existir nos
termos enquanto o site não sinalizar nenhum.

---

**Prompt 17 concluído. Revisor Ético-Regulatório CFM/CRM/COFEN/COREN finalizou a
auditoria, classificou riscos, indicou bloqueios de publicação quando aplicável e
emitiu parecer final.**
