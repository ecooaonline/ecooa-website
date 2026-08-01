# Baseline P17. Conformidade ética e regulatória em saúde

Auditoria do site publicado da ecooa (`deploy/`), servido em `http://localhost:4353`
com a CSP de produção. Data da medição: 2026-08-01. Auditor em modo somente leitura,
nenhum arquivo de `deploy/`, `src-site-3/` ou `scripts/` foi alterado.

**Nota do estado atual: 46/100.**

Resumo em uma frase: a camada editorial é excepcionalmente disciplinada e não comete
nenhuma das infrações clássicas de publicidade em saúde, mas a camada de conformidade
formal falha em quase todos os requisitos verificáveis, com prova medida, e por isso a
publicação não pode ser considerada eticamente segura no estado atual.

---

## 1. Método

Todas as afirmações abaixo têm número. Nada foi estimado.

1. **Inventário de URLs.** 62 `<loc>` extraídas de `deploy/sitemap.xml`
   (9 raiz, 8 especialidades, 31 profissionais, 14 artigos). Script:
   `scratchpad/extract.mjs`.
2. **Extração de texto.** As 62 páginas tiveram `<script>` e `<style>` removidos e
   as tags convertidas em quebra de linha, gerando 62 arquivos `.txt` e 62 `.html`
   crus. Toda varredura léxica rodou sobre esses 62 arquivos.
3. **Varredura léxica com contexto.** `scratchpad/scan.mjs` percorreu 45 padrões
   regulatórios (superlativos, garantias, mercantilização, antes e depois,
   depoimentos, titulação, equipamentos, marcas comerciais, LGPD) devolvendo
   ocorrências, contextos únicos e número de páginas de cada um.
4. **Dados estruturados.** `deploy/dados-ecooa.js` foi parseado por regex e
   conferido campo a campo: 31 profissionais, `classe`, `registro`, `estado`, `area`.
   Cruzado com o texto renderizado de cada página de perfil.
5. **JSON-LD.** Todos os blocos `application/ld+json` das 62 páginas foram
   inventariados por `@type`.
6. **Navegador real.** Playwright (Chromium 1194), viewport 390x844, contra o
   laboratório com CSP de produção. Foi executado o fluxo completo do ecooa.match
   com a frase `meu cabelo esta caindo muito e tenho ansiedade`, com interceptação
   de `window.dataLayer.push` para capturar o que sai para o GTM, e leitura dos
   `href` de WhatsApp gerados.
7. **Alcance do aviso legal.** `curl` disparado contra a resolução real do link
   `politicas.html` a partir de cada uma das 62 URLs do sitemap.

Ferramentas: Node 22, Playwright, curl, ripgrep. Sem acesso ao domínio real
(proxy 403), sem acesso a painéis de terceiros.

---

## 2. Números medidos

### 2.1 O que NÃO foi encontrado (e isso conta a favor)

| Verificação | Ocorrências em 62 páginas |
|---|---|
| Imagens ou seções de "antes e depois" de paciente | 0 |
| Depoimentos de paciente | 0 |
| `aggregateRating`, `Review`, `ratingValue`, `reviewCount` no JSON-LD | 0 |
| Preços, valores em R$, parcelamento | 0 |
| Promoção, desconto, pacote, oferta, cupom, sorteio, cortesia, "por apenas" | 0 |
| Urgência fabricada ("corra", "aproveite", "últimas vagas") | 0 |
| Marcas comerciais de fármaco ou equipamento (Ozempic, Mounjaro, Sculptra, Ultraformer, gestrinona e outras 11 testadas) | 0 |
| Superlativos de mercado ("líder", "pioneiro", "exclusivo", "de ponta", "revolucionário", "milagre") | 0 |
| `iframe` de terceiro | 0 |
| Domínios externos além de googletagmanager, wa.me, instagram e google.com (link de mapa) | 0 |

Isso é raro em site de clínica e precisa ser dito.

### 2.2 Registro profissional

| Métrica | Valor |
|---|---|
| Profissionais em `dados-ecooa.js` | 31 |
| `estado: confirmado` | 21 |
| `estado: a-confirmar` | 5 |
| `estado: a-adicionar` | 5 |
| Exibem número de registro na própria página de perfil | 26 de 31 |
| Não exibem **nenhum** número de registro | 5 |
| Ocorrências de ressalva sobre registro em validação nas 62 páginas | **0** |
| Médicos no elenco | 5 |
| Médicos com RQE publicado | 2 |
| Profissionais de saúde nomeados no site fora dos 31 e sem registro | 1 (Scheila Andrzejewski, médica, em `/sobre`) |

Os 5 sem registro algum e o número de páginas em que aparecem:

| Nome | Classe | Páginas em que aparece |
|---|---|---|
| Giancarla Rochemback | Nutricionista | 14 |
| Adriana | Terapeuta integrativa | 5 |
| Marvin Marques | Nutricionista | 3 |
| Gabrieli Klagenberg Avila | Nutricionista | 3 |
| Lara Caye | Nutricionista | 3 |

### 2.3 Titulação e especialidade

| Achado | Ocorrências | Páginas |
|---|---|---|
| "especialista no diagnóstico e tratamento médico das alopecias" (Yale Jerônimo, CRM sem RQE) | 5 | 5 |
| "Médica tricologista" | 5 | 5 |
| "31 especialistas" no `<title>` de `/profissionais` | 1 | 1 |
| "mais de 30 especialistas" na meta description da home | 1 | 1 |
| "especialistas autônomos" em `/sobre` | 1 | 1 |
| "harmonização orofacial" anunciada por não dentistas | 5 profissionais (3 biomédicas esteta, 1 biomédica, 1 farmacêutica) | 12 |
| "harmonização orofacial" anunciada por cirurgiã-dentista | 1 profissional | - |
| "práticas ortomoleculares" / "nutrição ortomolecular" | 15 | 6 |
| "metabolômica" | 1 | 1 |
| "biorressonância" | 13 | 5 |

### 2.4 Autoelogio e afirmação sem lastro

| Trecho | Ocorrências | Páginas |
|---|---|---|
| "Priorizamos e **garantimos** a excelência em tudo que fazemos" (bandeira 09, `/sobre`) | 1 | 1 |
| "mesmo padrão de excelência" (rodapé e corpo) | 66 | 62 |
| "mais repercutida" aplicado a 3 artigos, no megamenu | 186 | 62 |
| "espaço de alto padrão, regulamentado" | 1 | 1 |

### 2.5 Identificação legal do estabelecimento

| Item | Estado |
|---|---|
| CNPJ | **ausente em todas as 62 páginas** |
| Razão social | **ausente em todas as 62 páginas** |
| Responsável técnico declarado | `RT Gustavo Gehrke · CREMERS 35.822`, no rodapé de 62 páginas |
| Sigla "RT" explicada em algum lugar do site | não |
| Expressão "diretor técnico" ou "responsável técnico" por extenso | 0 ocorrências |
| Número de inscrição do estabelecimento no CRM | ausente |
| RT das demais classes anunciadas (nutrição, odontologia, psicologia, biomedicina, enfermagem, fisioterapia, farmácia) | ausente |
| Classes profissionais anunciadas no site | 9 |
| Aviso de copyright | `© 2021`, cinco anos desatualizado |
| Páginas-ponte `/especialidade/*` indexáveis sem rodapé, sem RT e sem link de política | 16 |

### 2.6 LGPD, medido no navegador

| Verificação | Resultado |
|---|---|
| Página de políticas existe e cita a Lei 13.709/2018 | sim (`/politicas`, `noindex, follow`) |
| A página de políticas traz aviso, visível ao público, de que é **rascunho não validado por advogado e que não deve ser publicado como definitivo** | **sim** |
| Páginas do sitemap em que o link `politicas.html` do rodapé resolve para 200 | **9 de 62** |
| Páginas em que resolve para **404** | **53 de 62** (8 especialidades, 31 perfis, 14 artigos) |
| O link do próprio banner de consentimento é o mesmo relativo quebrado | sim |
| Banner de consentimento presente, com "aceitar" e "recusar" | sim |
| Consent Mode v2 com tudo negado por padrão | sim (`analytics_storage: denied`) |
| Existe caminho para revogar o consentimento depois da primeira escolha | **não** (só `localStorage`, sem UI de gestão) |
| GTM carrega antes de qualquer decisão do titular | **sim**, medido: `gtm.start` no dataLayer com o banner ainda na tela |
| Categoria de saúde inferida enviada ao dataLayer antes do consentimento | **sim**, medido: `{event: "match_resultado", bloco: "saúde mental", indicados: "Francielle,Manuela,Augusto,Adriana,Gabrieli", total: 5}` |
| Encarregado (DPO) nomeado | **não** |
| Canal de exercício de direitos | `ecooa.adm@gmail.com`, conta gratuita de terceiro |
| Formulários com aviso de privacidade ou checkbox de consentimento no ponto de coleta | **0 de 3** (mentorias, sublocação, newsletter) |
| A newsletter aparece em quantas páginas sem aviso de base legal | 62 |
| Compartilhamento com Google (GTM) e Meta (WhatsApp) declarado na política | **não** |
| Transferência internacional de dados tratada na política | **não** |
| A política afirma "Não coletamos dados de saúde por meio deste site" | sim |
| O site coleta e trafega categoria de saúde | **sim**, medido no ecooa.match e no `wa.me` gerado |

Link de WhatsApp gerado pelo ecooa.match, medido:

```
https://wa.me/5551991460909?text=Olá! Usei o ecooa.match no site.
Busquei por saúde mental. Qual profissional a equipe me indica para o meu caso?
```

Mitigações reais que existem e devem ser registradas: o ecooa.match avisa
"Sua frase não é armazenada. Ela só orienta a sugestão desta tela.", o código
comenta explicitamente que o termo digitado não é enviado ao GTM, e a tela de
resultado traz "Esta sugestão organiza a sua resposta e não é um diagnóstico".

### 2.7 Editorial

| Verificação | Resultado |
|---|---|
| Artigos publicados | 14 |
| Artigos com autor nomeado, classe e número de registro na assinatura | **14 de 14** |
| Artigos com aviso "não substitui consulta, diagnóstico nem tratamento" | **14 de 14** |
| Artigos com promessa de resultado | 0 |
| Conteúdo de saúde mental com telefone de crise (CVV 188, SAMU 192) | **0** |
| Texto explícito recusando promessa: "Não existe prazo garantido, e prometer um seria desonesto" | presente |

---

## 3. Tabela de achados por severidade

| # | Severidade | Achado | Dispositivo | Corrigível por IA |
|---|---|---|---|---|
| 1 | crítico | Política de privacidade publicada com aviso de que é rascunho não validado juridicamente | LGPD art. 6º VI e art. 9º | não |
| 2 | crítico | Link da política retorna 404 em 53 de 62 páginas, inclusive no banner de consentimento | LGPD art. 9º e art. 18 | sim |
| 3 | crítico | 5 profissionais anunciados sem nenhum número de registro, em 28 aparições, sem qualquer ressalva | CEM art. 117; CFN 599/2018; CFP 10/2005 art. 20 | sim |
| 4 | crítico | A política afirma que registros em validação estão sinalizados. Não há uma única sinalização no site | LGPD art. 6º VI; CDC art. 31 | sim |
| 5 | alto | "especialista" e "Médica tricologista" para médica sem RQE, em 5 páginas | CEM arts. 115 e 118; Res. CFM 2.336/2023 | sim |
| 6 | alto | "31 especialistas" no title indexado e "mais de 30 especialistas" na meta da home, com 2 de 31 RQE publicados | CEM art. 115; CDC art. 37 §1º | sim |
| 7 | alto | Biorressonância com alegação terapêutica em 13 trechos, por profissional sem conselho, indicada em rota de saúde mental | CEM arts. 112 e 113; Lei 12.842/2013 art. 4º; CDC art. 36 § único | sim |
| 8 | alto | Ausência de CNPJ, razão social e identificação do diretor técnico por extenso; RT único para 9 classes | Res. CFM 2.336/2023; Res. CFM 2.147/2016; Res. CFM 2.056/2013; CDC art. 31 | não |
| 9 | alto | "harmonização orofacial", especialidade odontológica, anunciada por 5 não dentistas em 12 páginas | Res. CFO 198/2019; Res. CFO 118/2012 arts. 43 a 46 | não |
| 10 | alto | Categoria de saúde enviada ao GTM antes de qualquer consentimento | LGPD art. 7º, art. 11 e art. 11 §1º | sim |
| 11 | alto | Médica sócia fundadora nomeada como médica sem CRM em `/sobre` | CEM art. 117; Res. CFM 2.336/2023 | sim |
| 12 | médio | Encarregado não nomeado; canal de direitos em Gmail gratuito | LGPD art. 41 §1º e art. 46 | não |
| 13 | médio | 3 formulários sem aviso de privacidade e sem base legal no ponto de coleta | LGPD art. 9º e art. 11 | sim |
| 14 | médio | Não há como revogar o consentimento depois da primeira escolha | LGPD art. 8º §5º | sim |
| 15 | médio | Compartilhamento com Google e Meta e transferência internacional não declarados | LGPD arts. 9º V e 33 a 36 | não |
| 16 | médio | "garantimos a excelência" e 66 ocorrências de "padrão de excelência" | CEM art. 112; Res. CFM 2.336/2023; CFN 599/2018; CDC art. 37 | sim |
| 17 | médio | "mais repercutida" em 186 trechos, sem métrica que sustente | CDC art. 36 § único e art. 37 §1º | sim |
| 18 | médio | O site pede que o paciente descreva a queixa pelo WhatsApp, a política pede o oposto | LGPD art. 6º I e VI; art. 11 | sim |
| 19 | baixo | Conteúdo de saúde mental sem referência de crise | Res. CFP 11/2018; Código de Ética do Psicólogo | sim |
| 20 | baixo | "práticas ortomoleculares" e "metabolômica" fora da lista de especialidades reconhecidas | Res. CFM 2.221/2018 e atualizações; CEM art. 113; Res. CFN 600/2018 | sim |
| 21 | baixo | 16 páginas-ponte indexáveis sem rodapé, sem RT e sem link de política | Res. CFM 2.336/2023; LGPD art. 9º | sim |
| 22 | baixo | "RT" não explicado, "CREMERS" divergente de "CRM-RS" usado nos perfis, copyright "© 2021" | Res. CFM 2.147/2016; CDC art. 31 | sim |

---

## 4. Detalhamento dos achados críticos e altos

### 4.1 Política de privacidade em produção declarando-se rascunho

`/politicas` abre com este parágrafo, visível ao público:

> "Este texto é um rascunho preparado para revisão jurídica. Ele ainda não foi
> validado por um advogado e não deve ser publicado como definitivo."

A página está publicada, é o destino dos três links do rodapé de 62 páginas e do
link do banner de consentimento. O aviso é honesto, e é exatamente por isso que
funciona como confissão: o próprio controlador declara que o instrumento que
comunica o tratamento de dados não está pronto. A LGPD exige transparência e
informação clara sobre o tratamento (art. 6º VI e art. 9º). Um documento que se
anuncia como não validado não cumpre isso.

### 4.2 A política é inalcançável em 85% do site

Os links do rodapé são relativos: `href="politicas.html#privacidade"`. Em
`/profissionais/gustavo-gehrke/` isso resolve para
`/profissionais/gustavo-gehrke/politicas.html`, que retorna 404. Medido com curl a
partir das 62 URLs do sitemap: **9 resolvem, 53 quebram**. O mesmo defeito atinge o
link dentro do banner de consentimento, que aparece justamente quando o titular
precisa decidir. Na prática, quem chega por busca orgânica em um perfil ou artigo,
que é a maioria do tráfego previsto, não consegue ler a política nem antes nem
depois de consentir.

### 4.3 Anúncio de atuação sem registro visível

Cinco profissionais aparecem em 28 páginas com classe e área de atuação anunciadas
e sem qualquer número de registro:

- Giancarla Rochemback, "Nutricionista", área "nutrição clínica e esportiva", 14 páginas
- Marvin Marques, "Nutricionista", 3 páginas
- Gabrieli Klagenberg Avila, "Nutricionista", 3 páginas
- Lara Caye, "Nutricionista", 3 páginas
- Adriana, "Terapeuta integrativa", 5 páginas

Para os quatro nutricionistas, o Código de Ética e de Conduta do Nutricionista
(Resolução CFN nº 599/2018) obriga a identificação com o número do CRN em qualquer
divulgação de serviço. Adriana é caso distinto e mais grave: "terapeuta integrativa"
não é profissão regulamentada, não há conselho, e ela aparece indicada pelo
ecooa.match em rota de saúde mental para a queixa "ansiedade", listada na posição
04 ao lado de três psicólogos com CRP. Medido no navegador.

Além dos 31, `/sobre` nomeia "Scheila Andrzejewski, médica" entre os sócios
fundadores, sem CRM. O Código de Ética Médica (Resolução CFM nº 2.217/2018) veda,
no art. 117, deixar de incluir o número de inscrição no CRM em anúncio profissional
de qualquer ordem.

### 4.4 A ressalva prometida não existe

`docs/ESTADO-REAL.md` afirma: "a ressalva aparece no modal sempre que não for
confirmado". E `/politicas`, na seção de termos de uso, afirma ao público: "os
registros em validação estão sinalizados como tal".

Varredura das 62 páginas: **0 ocorrências** de "ressalva", "em validação",
"registro em validação", "registro profissional" ou "conselho de classe". Os 5
"a-confirmar" aparecem com o número exibido como se fosse confirmado, e os 5
"a-adicionar" aparecem sem nada. A afirmação da página de termos é falsa, o que
transforma um controle de qualidade interno em declaração pública incorreta.

### 4.5 Titulação de especialista sem RQE

Em 5 páginas, incluindo a home e `/profissionais`:

> "Yale Jerônimo · Médica · CRM-RS 49.185 · Médica tricologista, empreendedora e
> **especialista** no diagnóstico e tratamento médico das alopecias."

Dois problemas somados. Primeiro, "especialista" é título anunciado, e o art. 115
do Código de Ética Médica veda anunciar especialidade para a qual o médico não
esteja qualificado e registrado no CRM, com o art. 118 obrigando o RQE no anúncio.
Nos dados, o registro dela é `CRM-RS 49.185`, sem RQE; apenas 2 dos 5 médicos
publicam RQE. Segundo, "tricologista" não consta da lista de especialidades e áreas
de atuação reconhecidas pelo CFM (Resolução CFM nº 2.221/2018 e atualizações).

O mesmo vício se repete de forma institucional: o `<title>` de `/profissionais`, que
é conteúdo indexado, diz "31 especialistas em Moinhos de Vento, Porto Alegre", e a
meta description da home diz "mais de 30 especialistas".

### 4.6 Biorressonância com alegação terapêutica

13 trechos em 5 páginas. Exemplos medidos:

> "Com biorressonância e terapias integrativas, Adriana **avalia desequilíbrios do
> organismo** e conduz um cuidado (...)"
> "Com terapia integrativa e biorressonância, Adriana **trabalha o equilíbrio do
> organismo** como cuidado complementar nas dores (...)"
> "Com biorressonância e terapias integrativas, Adriana **trabalha gatilhos** e o
> equilíbrio do organismo nas [dores de cabeça]"

Há mitigação explícita e ela conta: o FAQ responde "Biorressonância diagnostica
alguma coisa? Não. É uma prática complementar, sem valor diagnóstico". Ainda assim,
o verbo "avalia desequilíbrios do organismo" descreve ato avaliativo sobre estado
de saúde, privativo de profissional habilitado (Lei 12.842/2013, art. 4º, para o
diagnóstico nosológico), e a técnica não tem reconhecimento científico de valor
terapêutico. Como o conteúdo é publicado sob o nome da clínica, cujo responsável
técnico declarado é médico, aplicam-se os arts. 112 e 113 do Código de Ética
Médica. Do lado consumerista, o art. 36, parágrafo único, do CDC obriga o
fornecedor a manter os dados fáticos, técnicos e científicos que sustentam a
mensagem publicitária.

### 4.7 Identificação legal do estabelecimento

O rodapé de 62 páginas traz exatamente: `RT Gustavo Gehrke · CREMERS 35.822`.

O que está certo: existe identificação de responsável técnico médico, com nome e
número, no rodapé de todas as páginas. Isso já é mais do que a maioria dos sites de
clínica faz.

O que não é suficiente:

1. A sigla "RT" não aparece explicada em lugar nenhum. A norma do CFM
   (Resolução CFM nº 2.147/2016) trata de **Diretor Técnico Médico**, e a
   Resolução CFM nº 2.336/2023, sucessora da Resolução CFM nº 1.974/2011, cujo
   art. 12 exigia o nome e o CRM do diretor técnico em anúncio de clínica, espera a
   identificação legível, não uma abreviação de duas letras.
2. Não há CNPJ nem razão social em nenhuma das 62 páginas. O site se apresenta como
   "clínica multidisciplinar" em 35 páginas e vende serviço de saúde. O art. 31 do
   CDC exige informação correta, clara e precisa sobre o fornecedor.
3. Não há o número de inscrição do estabelecimento no CRM (Resolução CFM
   nº 2.056/2013).
4. O site anuncia 9 classes profissionais: medicina, nutrição, biomedicina,
   psicologia, odontologia, enfermagem, fisioterapia, farmácia e terapia
   integrativa. Existe um único RT declarado, e ele é médico. Pessoa jurídica que
   presta serviço de nutrição, odontologia, biomedicina ou psicologia costuma exigir
   inscrição no respectivo conselho e responsável técnico da própria classe. Isso é
   decisão jurídica e de conselho, não de código.

### 4.8 Dado de saúde ao GTM antes do consentimento

Medido no navegador, com o banner ainda visível na tela:

```json
[ {"gtm.start": 1785600086342, "event": "gtm.js"},
  {"event": "match_resultado", "pagina": "qual-profissional-procurar.html",
   "tipo": "institucional", "bloco": "saúde mental",
   "indicados": "Francielle,Manuela,Augusto,Adriana,Gabrieli", "total": 5} ]
```

O código carrega o GTM no primeiro gesto do visitante, sem esperar decisão, e o
evento `match_resultado` carrega a categoria de saúde inferida a partir da frase da
pessoa. O Consent Mode v2 nega o armazenamento, o que é boa engenharia e reduz o
dano, mas não impede a transmissão do hit e do IP ao Google. Categoria de saúde é
dado sensível pelo art. 5º, II, da LGPD, e o art. 11 exige consentimento específico
e destacado, ou outra hipótese legal, que aqui não existe nem está declarada. A
política, ao contrário, afirma "Não coletamos dados de saúde por meio deste site".

---

## 5. O que foi feito bem, com prova

Isto não é elogio de cortesia, é resultado de varredura que procurou o oposto e
não encontrou.

- **Zero antes e depois, zero depoimento, zero nota de avaliação.** As três
  infrações mais punidas em publicidade de saúde estão ausentes, inclusive no
  JSON-LD, que não tem `aggregateRating` nem `Review`.
- **Zero mercantilização.** Nenhum preço, desconto, pacote, promoção ou contagem
  regressiva. O site chega a dizer, no rodapé de 62 páginas, "Sem promoção, sem
  urgência".
- **Recusa explícita de promessa.** "Não existe prazo garantido, e prometer um
  seria desonesto." "às vezes o melhor procedimento é o que não se faz."
- **Editorial impecável na forma.** 14 de 14 artigos com autor nomeado, classe,
  número de registro e aviso de que o texto não substitui consulta.
- **Delimitação de escopo entre profissões.** O texto de tricologia diz "cada uma
  dentro do que o conselho da própria profissão autoriza". A psicóloga escreve "Eu
  não prescrevo plano alimentar, não conduzo investigação laboratorial e não trato
  clinicamente obesidade".
- **ecooa.match com trava.** Avisa que não é diagnóstico, que a frase não é
  armazenada, e o código comenta que o termo digitado não vai para o GTM. A frase
  literal realmente não sai, foi verificado no dataLayer.
- **Consent Mode v2 negado por padrão**, com banner de aceitar e recusar e GTM
  carregado tardiamente.

---

## 6. O que não foi possível medir

1. **Validade real dos 26 números de registro publicados.** Não há acesso às
   consultas públicas do CFM, CRN, CRP, CRO, CRF, CRBM, COREN e CREFITO a partir
   deste ambiente. A auditoria verificou apenas presença e formato, não veracidade.
2. **Se existe RQE não publicado.** Os 3 médicos sem RQE nos dados podem tê-lo no
   CRM sem que apareça no site. O achado é sobre a publicação, não sobre a
   qualificação.
3. **Se a pessoa jurídica está inscrita nos conselhos das 9 classes anunciadas.**
   Depende de documento societário e de consulta a cada conselho.
4. **CNPJ e razão social.** Não constam de nenhum arquivo do repositório.
5. **Conteúdo real dos contêineres do GTM-TSR4GDMK.** O painel do Google não é
   acessível. Não dá para saber se há pixel de Meta, remarketing ou envio de
   parâmetros adicionais configurado do lado do contêiner. O que se mediu é apenas
   o que o site empurra para o `dataLayer`.
6. **Comportamento no domínio real.** O proxy bloqueia `www.somosecooa.com.br` com
   403. Tudo foi medido no laboratório local com a CSP de produção. A CSP efetiva em
   produção é injetada por regra no painel da Cloudflare, fora do repositório, e não
   pôde ser verificada.
7. **Publicidade fora do site.** Instagram `@somos.ecooa`, Google Business Profile e
   qualquer mídia paga estão fora do escopo desta medição, embora sejam onde a maior
   parte das infrações de publicidade em saúde costuma acontecer.
8. **Se há contrato de operador com o Google e com a Meta.** Documento jurídico,
   não verificável por código.

---

## 7. Justificativa da nota

**46/100.**

O que sustenta os pontos: a camada de linguagem é a melhor que se vê em site de
clínica. Nenhuma das dez infrações mais comuns de publicidade em saúde aparece, e
isso foi confirmado por varredura ativa, não por leitura seletiva. O editorial tem
autoria identificada e registro em 100% dos artigos. Existe banner de consentimento
funcional com Consent Mode v2 negado por padrão. Existe RT visível no rodapé.

O que derruba a nota: praticamente todo requisito formal verificável falha.
A política de privacidade se declara rascunho e está no ar. Ela é inalcançável em
85% das páginas por um bug de link relativo. Cinco profissionais são anunciados sem
registro em 28 aparições, e a ressalva que os documentos internos afirmam existir
tem zero ocorrências no site, enquanto a página de termos afirma ao público que ela
existe. Uma médica é anunciada como "especialista" e "tricologista" sem RQE em 5
páginas, e o título indexado de `/profissionais` chama 31 pessoas de "especialistas"
com 2 RQE publicados. Uma prática sem validação científica é anunciada com verbo
avaliativo em 13 trechos e entra em rota de saúde mental. Não há CNPJ, não há razão
social, e há um único responsável técnico para 9 classes profissionais. E categoria
de saúde inferida sai para o Google antes de qualquer decisão do titular.

Um tribunal de ética não liberaria a publicação neste estado. Não porque o site
seja predatório, ele não é, mas porque não consegue provar nada do que afirma sobre
si mesmo. A nota reflete essa distância entre o cuidado do texto e o vazio da
conformidade formal.
