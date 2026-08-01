# Navegação agêntica: llms.txt e WebMCP na ecooa

Guia de implementação para a categoria "Navegação agêntica" (`agentic-browsing`)
do Lighthouse 13.4.1, escrito para **este** site: `deploy/` estático, sem
backend, HTML gerado por scripts `.mjs`, conversão por WhatsApp.

Fonte da verdade técnica do repositório: `docs/ESTADO-REAL.md`.
Este documento cobre só a camada agêntica.

Verificações deste guia foram rodadas contra o Lighthouse **instalado no
próprio repositório** (`node_modules/lighthouse`, versão 13.4.1), não contra
memória nem contra documentação.

---

## 1. O que é verdade e o que é incerto

### 1.1 A premissa do pedido está errada, e isso muda o plano

O pedido era "as quatro auditorias implementadas e passando". Duas delas **não
podem passar**, por desenho. Não é limitação nossa.

Verificado no fonte instalado (`node_modules/lighthouse/core/audits/`):

| Auditoria | id | Modo | Pode "passar"? |
|---|---|---|---|
| Detecção de formulários por WebMCP | `webmcp-form-coverage` | `INFORMATIVE` | Não. Sempre `score: 1`, nunca entra na fração |
| Ferramentas registradas do WebMCP | `webmcp-registered-tools` | `INFORMATIVE` | Não. Sempre `score: 1`, nunca entra na fração |
| Os esquemas do WebMCP são válidos | `webmcp-schema-validity` | binário (sem `scoreDisplayMode`) | **Sim** |
| O arquivo llms.txt segue as recomendações | `llms-txt` | binário | **Sim** |

`core/scoring.js` força `member.weight = 0` para `NOT_APPLICABLE`,
`INFORMATIVE` e `MANUAL`. E `report/renderer/report-utils.js` dá `continue`
em auditorias informativas antes de incrementar `numPassableAudits`.

**Consequência prática:** o placar hoje é 2/2. O máximo real da categoria é
**4/4**, composto por `agent-accessibility-tree`, `cumulative-layout-shift`,
`webmcp-schema-validity` e `llms-txt`. As duas informativas nunca viram um
"verde"; no melhor cenário elas apenas deixam de dizer "não aplicável" e passam
a listar dados.

Para `webmcp-form-coverage` o "sucesso" é ainda mais contraintuitivo: ela lista
formulários **sem** anotação. Anotar todos faz ela voltar para "não aplicável".
Não existe estado verde para ela. Isso é o comportamento correto, não um bug.

### 1.2 O bloqueio que não está sob nosso controle

As três auditorias WebMCP dependem de `artifacts.WebMCP.isSupported`, que é
capacidade do **navegador que roda o Lighthouse**, não do site.

```js
// core/gather/gatherers/webmcp.js
try {
  await session.sendCommand('WebMCP.enable');
} catch (err) {
  if (err.message.includes('\'WebMCP.enable\' wasn\'t found')) {
    this._isSupported = false;
    return;
  }
  throw err;
}
```

E depois, no mundo isolado:

```js
() => typeof navigator.modelContext !== 'undefined' ||
      typeof document.modelContext !== 'undefined'
```

O próprio smoke test do Lighthouse roda com
`chromeFlags: '--enable-features=WebMCPTesting,DevToolsWebMCPSupport'`.

**Traduzindo para o dono:** em Chrome padrão, no PageSpeed Insights e no
Lighthouse do DevTools sem flags, as três auditorias WebMCP continuam "não
aplicável" mesmo com o site implementando tudo certo. O ganho que o site
controla sozinho é o `llms.txt`, que leva o placar de 2/2 para 3/3. O 4/4 só
aparece para quem auditar com um Chrome com WebMCP ligado.

Isso não é motivo para não implementar. É motivo para não prometer o número.

### 1.3 Confirmado em fonte primária

- **`document.modelContext` é o local atual.** A especificação declara
  `partial interface Document { [SecureContext, SameObject] readonly attribute
  ModelContext modelContext; }`. O Chromium implementa isso em
  `model_context_supplement.idl`. O pacote de tipos oficial `webmcp-types`
  declara em `Document` e não declara nada em `Navigator`. Os testes WPT usam
  `document.modelContext.registerTool(tool)`.
- **`navigator.modelContext` é o local antigo.** O guia oficial do time do
  Chrome diz literalmente: "Deprecated/Removed: `navigator.modelContext`
  (deprecated in Chromium 150), `unregisterTool()`, `provideContext()`, and
  `clearContext()` are no longer supported."
- **Método de registro:** `registerTool(tool, options)`. Devolve `Promise`.
  Não existe `provideContext`, não existe `unregisterTool`. Para desregistrar,
  a única via é `{ signal: controller.signal }` e `controller.abort()`.
- **Dicionário da ferramenta:** `name` (obrigatório), `title` (opcional),
  `description` (obrigatório), `inputSchema` (opcional, JSON Schema),
  `execute` (obrigatório), `annotations` (opcional, com `readOnlyHint` e
  `untrustedContentHint`). Não existe `handler`, não existe `outputSchema`.
- **Validação do nome** (`model_context.cc`, `IsValidToolName`): não vazio,
  no máximo 128 caracteres, e cada caractere precisa ser ASCII alfanumérico ou
  `_` ou `-` ou `.`. **Nome com acento, espaço ou barra faz o registro
  rejeitar.** Cuidado: o exemplo do explainer usa `toolname="Search flights"`,
  com espaço, que seria inválido por essa regra.
- **`execute` recebe um argumento** (o objeto de input já parseado) e pode
  retornar qualquer coisa. O formato `{ content: [{ type: "text", ... }] }` é
  convenção herdada do MCP de backend, **não é obrigatório**.
- **Os cinco atributos declarativos**, confirmados no arquivo canônico de nomes
  de atributos do Blink (`html_attribute_names.json5`): `toolautosubmit`,
  `tooldescription`, `toolname`, `toolparamdescription`, `tooltitle`. Tudo
  minúsculo, sem hífen, **sem prefixo `data-`**.
- **Regra de qualificação do form** (`html_form_element.cc`): o `<form>` precisa
  de **ambos** `toolname` e `tooldescription`, e precisa estar conectado ao
  documento. `tooltitle` é opcional.
- **Ordem de resolução da descrição do parâmetro** (`form_mcp_schema.cc`,
  `ComputeDescription`): primeiro `toolparamdescription`; na ausência dele, o
  `textContent` do `<label>` associado; em último caso, `aria-description`.
  **O atributo `title` não está nessa lista.**
- **Compatibilidade:** o guia oficial afirma que a API declarativa é segura em
  todos os navegadores, que navegadores sem suporte ignoram os atributos `tool*`
  e o `<form>` continua funcionando, e que não é preciso detecção de recurso.
  Para a API imperativa, ao contrário, detecção é obrigatória.
- **Ambiente:** `[Exposed=Window, SecureContext]`, ou seja só HTTPS. No
  Chromium a feature está com `status: "experimental"`, o que significa que não
  vem ligada por padrão no Chrome estável.

### 1.4 Incerto, e como decidimos apesar disso

| Dúvida | Decisão adotada |
|---|---|
| `navigator.modelContext` ainda funciona como alias? Não há IDL de Navigator no Chromium atual, e o guia oficial lista o símbolo como removido, mas a página oficial estava inacessível. | Escrever código que aceite os dois, com `document` primeiro. Custo zero, cobre as duas hipóteses. |
| Um `<label>` associado, sozinho, evita o WARNING `FormModelContextParameterMissingTitleAndDescription`? O código do Chromium sugere que sim, mas nenhum teste oficial cobre esse caso. | Não depender do label. Escrever `toolparamdescription` explícito em todo campo. Um único WARNING derruba a nota de 1 para 0.5. |
| O origin trial está aberto? Que faixa de versões? Um token no site basta para o Lighthouse enxergar? | Tratar como não disponível. Não colocar `<meta http-equiv="origin-trial">` no site sem confirmar. A leitura do gatherer sugere fortemente que o token sozinho não liga o domínio CDP. |
| Nomes dos eventos de ciclo de vida: `toolactivated`/`toolcanceled` (explainer) ou `toolactivated`/`toolcancel` no `window` (guia do Chrome)? Questão em aberto na própria spec. | **Não usar esses eventos.** Nada nesta implementação depende deles. |
| `execute` tem um segundo parâmetro `agent`? O IDL diz um argumento; um exemplo do explainer mostra dois. | Usar um argumento só. |
| Como cada tipo de campo vira JSON Schema? A própria spec diz "TBD" e "Chromium is implementing a loose version of this". | Usar só `<input type="text">` e `type="email"`. Não depender de `min`, `max`, `step`, `pattern`. |
| O `<form>` com `action` para fora da origem (wa.me) ou `mailto:` se comporta bem no WebMCP declarativo? Todos os exemplos oficiais usam same-origin. | Nossos formulários interceptam o submit por JavaScript e não navegam. Isso já é o padrão recomendado. |
| `executeTool()` e `getTools()` são estáveis? | Não. O `index.bs` ainda tem "TODO: Spec and describe" para os dois. **Não depender.** |

### 1.5 A decisão sobre a API: qual usar e como escrever

**Usar `document.modelContext`, com `navigator.modelContext` como reserva.**

```js
var ctx = (typeof document !== 'undefined' && document.modelContext) ||
          (typeof navigator !== 'undefined' && navigator.modelContext) ||
          null;
if (!ctx || typeof ctx.registerTool !== 'function') return;
```

Por que nessa ordem, e não na inversa:

1. `document` é o local normativo hoje (spec, Chromium, tipos oficiais, WPT).
2. `navigator` está marcado como depreciado desde o Chromium 150. Se ele ainda
   existir como alias, vai emitir aviso de depreciação no console. Testar
   `document` primeiro evita cair no caminho depreciado em navegador novo.
3. O gatherer do Lighthouse aceita **qualquer um dos dois** na detecção, então
   a ordem não afeta a auditoria. Ela afeta o console do visitante.

Como `modelContext` é um `readonly attribute` num `partial interface`, em
navegador sem suporte o acesso devolve `undefined`, sem lançar. A guarda acima
é suficiente e não quebra nada.

---

## 2. llms.txt

### 2.1 O que a auditoria realmente exige

Verificado rodando o audit instalado contra o arquivo real:

```
status 200 -> score=1 notApplicable=false
status 404 -> score=1 notApplicable=true
status 500 -> score=0 notApplicable=false
status 301 -> LANCOU: Status 301 was valid, but content was null
```

Três regras sobre o conteúdo, e nada mais:

```js
const hasH1 = /^\s*#\s+.+/m.test(content);
const hasLink = /\[.+\]\(.+\)/.test(content);
const isTooShort = content.length < 50;
```

Armadilhas reais:
- `## Seção` **não** satisfaz o H1. A regex exige um único `#` seguido de espaço.
- `#Título` sem espaço também não satisfaz.
- BOM no início é tolerado (`\s` cobre em JavaScript).
- Link precisa ser markdown inline `[texto](url)`. URL nua não conta.
- **Não há verificação de Content-Type.** Nem no audit, nem no gatherer, nem no
  fetcher. O `text/plain` que o servidor entrega para `.txt` é irrelevante.
- **Não há tamanho máximo.** Só o piso de 50 caracteres e o timeout de 2000 ms
  do fetcher.
- A URL é sempre `new URL('/llms.txt', finalDisplayedUrl)`, ou seja a **raiz da
  origem final**. Subpasta não é auditada.
- **Redirect é risco.** O fetcher só devolve corpo para 2xx; um 3xx com corpo
  nulo faz o audit **lançar exceção**. O `/llms.txt` precisa responder 200
  direto em `https://www.somosecooa.com.br/llms.txt`, sem passar por
  apex para www nem por http para https naquele ponto.

Hoje a auditoria está "não aplicável" porque status entre 400 e 499 devolve
`notApplicable`. Ou seja: o arquivo existe no repositório e passa em todas as
regras, mas a URL de produção ainda responde 4xx. **O problema é de publicação,
não de conteúdo.**

### 2.2 Os 31 profissionais versus os 26 publicados

O pedido dizia "os 31 profissionais". O arquivo lista **26**, e isso está certo.

Cinco profissionais estão com `estado: 'a-adicionar'` e **sem registro em
conselho** no `dados-ecooa.js`: Giancarla Rochemback, Marvin Marques, Gabrieli
Klagenberg Avila, Lara Caye (nutricionistas) e Adriana (terapeuta integrativa).
O commit `506de9a` ("fix(etica): tira a queixa da URL e retira do indice quem
nao tem registro") colocou `noindex` nos perfis deles, atendendo ao tribunal
ético, porque publicar profissional de saúde sem número de conselho é problema
de publicidade médica, não de SEO.

O `llms.txt` respeita isso: `agentes.mjs` filtra por `indexavel()`. Um arquivo
que serve de mapa para agentes de IA não pode ser a porta dos fundos de uma
decisão de conformidade.

**Defeito aberto:** `deploy/llms-full.txt` **não** aplica o mesmo filtro. Ele
mapeia `ECOOA.profissionais` inteiro e publica os cinco nomes. Verificado:
cada um dos cinco aparece 0 vezes em `llms.txt` e 1 vez em `llms-full.txt`.
Isso precisa ser corrigido no gerador (ver seção 7).

O texto do arquivo continua dizendo "31 profissionais" no resumo, o que é
verdade sobre a clínica. A lista publica os 26 que têm registro divulgável.

### 2.3 Correções de formato aplicadas nesta versão

A versão em produção passa no Lighthouse, mas quebra o parser de referência
oficial (`llms_txt2ctx`). A spec diz que dentro de uma seção H2 **toda** linha
de lista precisa do hyperlink markdown, e o parser chama `.groupdict()` direto
no resultado do `re.search`, então uma linha que não casa estoura
`AttributeError`. Cinco linhas quebravam: uma linha de prosa em "Queixas
atendidas" e as quatro bullets de "Limites que um agente deve respeitar".

Correção adotada, sem perder nenhum conteúdo:
- os limites sobem para o **preâmbulo**, antes do primeiro H2, onde a spec
  autoriza "paragraphs, lists, etc. of any type except headings";
- a linha de prosa sai de dentro do H2;
- `## Optional` fica por último, que é a convenção da spec.

Subir os limites tem um ganho de conteúdo, não só de formato: a seção
`## Optional` é a única com semântica definida, e é a que um agente pode pular
quando precisa de contexto curto. Regra de saúde não pode ficar depois dela.

### 2.4 O arquivo completo

Grava em `deploy/llms.txt`. UTF-8, sem BOM, sem CRLF, LF no fim.

```markdown
# ecooa

> Clínica multidisciplinar de saúde em Moinhos de Vento, Porto Alegre. Reúne 31 profissionais autônomos em oito áreas: medicina, nutrição, saúde mental, saúde integrativa, tricologia, transplante capilar, estética facial e estética corporal. Cada profissional responde tecnicamente pelo próprio trabalho.

Informações práticas que costumam ser perguntadas:

- Endereço: Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS, 90430-180
- Horário: segunda a sexta, das 8h às 20h. A agenda de cada profissional é individual.
- Contato: (51) 99146-0909 (WhatsApp) e ecooa.adm@gmail.com
- Atendimento presencial em Porto Alegre e, com parte dos profissionais, também online
- Responsável técnico: Gustavo Gehrke, CREMERS 35.822
- O site não publica preços. O valor depende do profissional e do tipo de avaliação, e é informado no agendamento.
- Não há agendamento automático no site. Todo agendamento passa pela recepção, pelo WhatsApp.

Limites que um agente deve respeitar:

- Este site não agenda consulta. Não existe endpoint de agendamento, e nenhuma ferramenta desta página cria compromisso.
- Nada aqui substitui avaliação clínica individual. Não use o conteúdo para diagnosticar nem para orientar tratamento.
- A queixa de saúde de quem navega é dado sensível. Não a transmita para terceiros nem a inclua em URL.
- Nenhum formulário deve ser enviado sem que a própria pessoa confirme o envio.
- Em situação de risco à vida no Brasil: CVV 188 (24 horas, gratuito) e SAMU 192.

Para encontrar o profissional certo a partir de uma queixa, a busca ecooa.match aceita a queixa em linguagem natural e devolve a indicação com o que cada profissional faz por aquela queixa: https://www.somosecooa.com.br/qual-profissional-procurar

## Páginas principais

- [Início](https://www.somosecooa.com.br/): as sete portas de entrada da clínica e o caminho de cada uma
- [Sobre](https://www.somosecooa.com.br/sobre): história, as nove bandeiras da casa e como a ecooa se organiza
- [Especialidades](https://www.somosecooa.com.br/especialidades): as oito áreas de atuação
- [Profissionais](https://www.somosecooa.com.br/profissionais): os profissionais da casa, com filtro por área
- [Busca por queixa (ecooa.match)](https://www.somosecooa.com.br/qual-profissional-procurar): descreva a queixa e receba a indicação
- [Localização](https://www.somosecooa.com.br/localizacao): endereço, horário, como chegar e acessibilidade
- [Editorial](https://www.somosecooa.com.br/blog): textos assinados pelos profissionais da casa
- [Mentorias](https://www.somosecooa.com.br/mentorias): formação para profissionais de saúde, ecooa.cademy
- [Sublocação](https://www.somosecooa.com.br/sublocacao): sala para profissionais de saúde em Moinhos de Vento

## Especialidades

- [Medicina](https://www.somosecooa.com.br/especialidades/medicina/): Medicina metabólica, hormônios, longevidade e performance, com tempo de consulta e leitura de exames explicada.
- [Estética facial](https://www.somosecooa.com.br/especialidades/estetica-facial/): Dermatologia, harmonização orofacial e refinamento, com indicação honesta e resultado que preserva a expressão.
- [Estética corporal](https://www.somosecooa.com.br/especialidades/estetica-corporal/): Contorno, firmeza e cuidado corporal, planejados em etapas e integrados ao acompanhamento nutricional e clínico.
- [Tricologia](https://www.somosecooa.com.br/especialidades/tricologia/): Investigação e tratamento da queda de cabelo e das doenças do couro cabeludo, com equipe médica, biomédica e de enfermagem.
- [Transplante capilar](https://www.somosecooa.com.br/especialidades/transplante-capilar/): Cirurgia capilar conduzida por médica, com investigação prévia e critério claro sobre quem tem e quem não tem indicação.
- [Nutrição](https://www.somosecooa.com.br/especialidades/nutricao/): Nutrição clínica, esportiva, comportamental, vegetariana e funcional. Doze profissionais, cada um com um foco, para que a conduta caiba na sua rotina.
- [Saúde mental](https://www.somosecooa.com.br/especialidades/saude-mental/): Psicologia clínica, do esporte e neuropsicologia. Escuta sem pressa, presencial e online.
- [Saúde integrativa](https://www.somosecooa.com.br/especialidades/saude-integrativa/): Cuidado complementar que caminha junto do acompanhamento clínico, nunca no lugar dele.

## Profissionais

- [Gustavo Gehrke](https://www.somosecooa.com.br/profissionais/gustavo-gehrke/): Médico, CRM-RS 35.822. metabolismo, emagrecimento e hormônios.
- [Larissa Wiebbelling](https://www.somosecooa.com.br/profissionais/larissa-wiebbelling/): Médica, CRM-RS 55.504. transplante capilar e tricologia médica.
- [Yale Jerônimo](https://www.somosecooa.com.br/profissionais/yale-jeronimo/): Médica, CRM-RS 49.185. tricologia e alopecias.
- [Vitória Müller T. Machado](https://www.somosecooa.com.br/profissionais/vitoria-machado/): Médica dermatologista, CRM-RS 43.712 · RQE 42.218. dermatologia clínica e estética.
- [Renata Bohn Engel](https://www.somosecooa.com.br/profissionais/renata-bohn-engel/): Médica dermatologista, CRM-RS 48.838 · RQE 46.857. dermatologia clínica e estética.
- [Jessica Stein](https://www.somosecooa.com.br/profissionais/jessica-stein/): Nutricionista, CRN 9495. nutrição clínica, vegetariana e emagrecimento.
- [Adriano Flesch Lenz](https://www.somosecooa.com.br/profissionais/adriano-lenz/): Nutricionista, CRN-2 7844D. nutrição e práticas ortomoleculares.
- [Maria Luísa Serrano Beltran Borges](https://www.somosecooa.com.br/profissionais/maria-luisa-borges/): Nutricionista, CRN-2 12076P. nutrição esportiva e alta performance.
- [Daniel Forster](https://www.somosecooa.com.br/profissionais/daniel-forster/): Nutricionista, CRN2 20541. nutrição clínica e esportiva.
- [Vitória Serpa da Silva](https://www.somosecooa.com.br/profissionais/vitoria-serpa/): Nutricionista, CRN-2 12000P. nutrição esportiva.
- [Nasser Salem](https://www.somosecooa.com.br/profissionais/nasser-salem/): Nutricionista, CRN2 19914D. nutrição esportiva e emagrecimento.
- [Camila Cadore](https://www.somosecooa.com.br/profissionais/camila-cadore/): Nutricionista, CRN/RS 8447. nutrição funcional e integrativa.
- [Verena Cattani](https://www.somosecooa.com.br/profissionais/verena-cattani/): Nutricionista, CRN 2 19692. nutrição clínica.
- [Danusa Pires](https://www.somosecooa.com.br/profissionais/danusa-pires/): Enfermeira, COREN-RS 395164. tricologia estética e reposição de nutrientes.
- [Viviane Fagundes](https://www.somosecooa.com.br/profissionais/viviane-fagundes/): Biomédica, CRBM 2565. tricologia estética e testes genéticos capilares.
- [Natálie Queiroz](https://www.somosecooa.com.br/profissionais/natalie-queiroz/): Osteopata e fisioterapeuta, CREFITO-5 271577-F. osteopatia adulto e infantil.
- [Susan Flach](https://www.somosecooa.com.br/profissionais/susan-flach/): Biomédica, CRBM-5 4182. tricologia e gerenciamento da pele.
- [Letícia Melo](https://www.somosecooa.com.br/profissionais/leticia-melo/): Biomédica, CRBM-RS 627. harmonização orofacial.
- [Eduarda Schoenmeier](https://www.somosecooa.com.br/profissionais/eduarda-schoenmeier/): Biomédica esteta, CRBM 7243. harmonização orofacial e corporal.
- [Tais de la Rosa](https://www.somosecooa.com.br/profissionais/tais-de-la-rosa/): Farmacêutica, CRF-RS 588527. harmonização orofacial e saúde da pele.
- [Karine Ellwanger](https://www.somosecooa.com.br/profissionais/karine-ellwanger/): Biomédica esteta, CRBM-5 7474. harmonização orofacial.
- [Jennifer Adam](https://www.somosecooa.com.br/profissionais/jennifer-adam/): Biomédica esteta, CRBM-5 8600. harmonização orofacial e rejuvenescimento.
- [Jamylle Farias](https://www.somosecooa.com.br/profissionais/jamylle-farias/): Cirurgiã-dentista, CRO-RS 30124. harmonização orofacial.
- [Manuela Sinigaglia Vanti](https://www.somosecooa.com.br/profissionais/manuela-vanti/): Psicóloga, CRP 07/34596. terapia cognitivo-comportamental.
- [Augusto Kauer da Silveira](https://www.somosecooa.com.br/profissionais/augusto-kauer/): Psicólogo, CRP 07/28516. psicologia do esporte.
- [Francielle Machado Beria](https://www.somosecooa.com.br/profissionais/francielle-beria/): Psicóloga, CRP 07/29944. terapia cognitivo-comportamental e neuropsicologia.

## Editorial

- [Implante hormonal subcutâneo: o que é e quando tem indicação](https://www.somosecooa.com.br/blog/implante-hormonal-subcutaneo/): Como funciona a liberação contínua, quais critérios clínicos sustentam a indicação e o que precisa ser acompanhado depois. Assinado por Gustavo Gehrke, médico.
- [Canetas emagrecedoras: o que a nutrição precisa sustentar](https://www.somosecooa.com.br/blog/canetas-emagrecedoras-nutricao/): Os análogos de GLP-1 mudaram o cenário do emagrecimento. O que eles resolvem, o que não resolvem, e por que a alimentação segue sendo decisiva. Assinado por Jessica Stein, nutricionista.
- [Queda de cabelo: o que investigar antes de tratar](https://www.somosecooa.com.br/blog/queda-de-cabelo-causas/): As causas mais comuns, os exames que fazem diferença e por que o tratamento certo depende do diagnóstico. Assinado por Yale Jerônimo, médica.
- [Menopausa e terapia hormonal: o que se sabe hoje](https://www.somosecooa.com.br/blog/menopausa-tratamento-hormonal/): Quando a reposição faz sentido, quais os critérios de indicação e o que precisa ser acompanhado ao longo do tempo. Assinado por Gustavo Gehrke, médico.
- [Longevidade saudável começa nos marcadores certos](https://www.somosecooa.com.br/blog/longevidade-saudavel/): O que medir, com que frequência, e como transformar dado de exame em decisão de rotina. Assinado por Gustavo Gehrke, médico.
- [Equilíbrio hormonal: como identificar que algo mudou](https://www.somosecooa.com.br/blog/equilibrio-hormonal-como-identificar/): Sinais que costumam ser normalizados, o que eles podem indicar e quando vale investigar. Assinado por Gustavo Gehrke, médico.
- [Saúde mental e emagrecimento andam juntos](https://www.somosecooa.com.br/blog/saude-mental-emagrecimento/): Por que o acompanhamento psicológico muda o resultado de um processo de emagrecimento. Assinado por Manuela Sinigaglia Vanti, psicóloga.
- [Nutrição esportiva: o que muda quando o treino é sério](https://www.somosecooa.com.br/blog/nutricao-esportiva-performance/): Periodização alimentar, recuperação e os erros mais comuns de quem treina forte. Assinado por Maria Luísa Serrano Beltran Borges, nutricionista.
- [Transplante capilar: quem tem indicação e quem não tem](https://www.somosecooa.com.br/blog/transplante-capilar-porto-alegre/): Os critérios clínicos, o que o procedimento resolve e o que ele não resolve sozinho. Assinado por Larissa Wiebbelling, médica.
- [Rejuvenescimento facial sem perder a expressão](https://www.somosecooa.com.br/blog/rejuvenescimento-facial-porto-alegre/): O que significa resultado discreto, e por que planejar o rosto inteiro importa mais do que tratar uma região. Assinado por Eduarda Schoenmeier, biomédica esteta.
- [Osteopatia: o que é e para quem faz sentido](https://www.somosecooa.com.br/blog/osteopatia-o-que-e-para-quem/): Como a avaliação do corpo em movimento muda a leitura de uma dor persistente. Assinado por Natálie Queiroz, osteopata e fisioterapeuta.
- [Seu exame não é um diagnóstico](https://www.somosecooa.com.br/blog/interpretacao-exames-bioquimicos/): Por que um número fora da faixa nem sempre é problema, e um dentro da faixa nem sempre é tranquilidade. Assinado por Jessica Stein, nutricionista.
- [Ansiedade: quando deixa de ser só um dia difícil](https://www.somosecooa.com.br/blog/ansiedade-como-identificar-tratar/): Sinais, caminhos de tratamento e o que esperar das primeiras semanas de acompanhamento. Assinado por Francielle Machado Beria, psicóloga.
- [Queda de cabelo em mulheres tem particularidades](https://www.somosecooa.com.br/blog/saude-capilar-feminina/): Hormônios, ferro, ciclo e estresse. O que a investigação precisa cobrir antes de qualquer protocolo. Assinado por Viviane Fagundes, biomédica.

## Queixas atendidas

- [Saúde integrativa](https://www.somosecooa.com.br/especialidades/saude-integrativa/): dor musculoesquelética, postura e movimento, cuidado com bebês e amamentação, terapias integrativas, dor de cabeça e enxaqueca.
- [Medicina](https://www.somosecooa.com.br/especialidades/medicina/): saúde hormonal, metabolismo e peso, saúde cardiometabólica, investigação clínica, imunidade e vitaminas, energia, sono e disposição, digestão e estômago, saúde da mulher, inchaço e retenção de líquido.
- [Estética facial](https://www.somosecooa.com.br/especialidades/estetica-facial/): pele e rosto, harmonização facial, bruxismo e ATM.
- [Estética corporal](https://www.somosecooa.com.br/especialidades/estetica-corporal/): contorno corporal.
- [Tricologia](https://www.somosecooa.com.br/especialidades/tricologia/): saúde capilar.
- [Transplante capilar](https://www.somosecooa.com.br/especialidades/transplante-capilar/): transplante capilar.
- [Nutrição](https://www.somosecooa.com.br/especialidades/nutricao/): alimentação e nutrição, saúde intestinal, massa muscular e performance, nutrição materno-infantil, alimentação vegetariana e vegana, comportamento alimentar.
- [Saúde mental](https://www.somosecooa.com.br/especialidades/saude-mental/): psicologia do esporte, saúde mental.

## Optional

- [Políticas e termos](https://www.somosecooa.com.br/politicas): privacidade, uso do site e tratamento de dados
- [Mapa do site](https://www.somosecooa.com.br/sitemap.xml): todas as URLs indexáveis
```

Esse arquivo tem H1 único, links markdown e muito mais de 50 caracteres.
Passa nas três regras.

---

## 3. Ferramentas WebMCP a expor

### 3.1 Princípio

Um agente pode **descobrir** e pode **preparar**. Quem confirma é a pessoa.
Nenhuma ferramenta agenda, envia, grava ou transmite. Todas são de leitura sobre
dados que **já são públicos** no próprio site.

Todas levam `annotations: { readOnlyHint: true }`. Nenhuma recebe dado de saúde
que saia do navegador.

### 3.2 As seis ferramentas

| Nome | Descrição (o que vai no campo `description`) | `inputSchema` | O que faz |
|---|---|---|---|
| `ecooa_informacoes_da_clinica` | Devolve endereço, bairro, cidade, horário de funcionamento, telefone, e-mail e formas de atendimento da clínica ecooa, em Porto Alegre. Use para responder onde fica, que horas abre e como entrar em contato. Não agenda consulta. | `{ type: "object", properties: {}, required: [] }` | Retorna objeto constante com NAP, horário, responsável técnico e a nota de que não há agendamento automático nem preço publicado. Zero parâmetro, zero risco. |
| `ecooa_listar_especialidades` | Lista as oito áreas de atuação da clínica ecooa, com o resumo de cada uma e o endereço da página. Use para saber o que a clínica atende. | `{ type: "object", properties: {}, required: [] }` | Lê `window.ECOOA.especialidades` e devolve nome, slug, resumo e URL. |
| `ecooa_profissionais_da_area` | Lista os profissionais de uma área da clínica ecooa, com profissão, registro no conselho, foco de atuação e endereço do perfil. Use depois de identificar a área. Não agenda nada. | `{ type: "object", properties: { area: { type: "string", title: "Área de atuação", description: "Um de: medicina, nutricao, saude-mental, saude-integrativa, tricologia, transplante-capilar, estetica-facial, estetica-corporal", enum: [...] } }, required: ["area"] }` | Filtra `window.ECOOA.profissionais` por `esp`. **Omite quem não tem registro divulgável**, igual ao llms.txt. |
| `ecooa_encontrar_profissional_por_queixa` | A partir de uma queixa descrita em linguagem natural, devolve os profissionais da ecooa indicados para ela e o que cada um faz naquela queixa. É sugestão orientativa, não diagnóstico, e não é agendamento. | `{ type: "object", properties: { queixa: { type: "string", title: "Queixa em linguagem natural", description: "Exemplos: dor nas costas que não passa, queda de cabelo, quero emagrecer com acompanhamento, ansiedade" } }, required: ["queixa"] }` | Resolve **inteiramente no navegador** contra o almanaque de sintomas. Devolve nomes, áreas e links de perfil, mais o aviso de que não substitui avaliação e os telefones de urgência. Nunca põe a queixa em URL, nunca manda para analytics, nunca embute a queixa numa mensagem de WhatsApp. |
| `ecooa_listar_artigos` | Lista os textos do editorial da ecooa, assinados pelos profissionais da casa, com título, resumo, autor e endereço. Opcionalmente filtra por área. | `{ type: "object", properties: { area: { type: "string", title: "Área", description: "Filtro opcional pela área do texto" } }, required: [] }` | Lê `window.ECOOA.artigos`. Serve para o agente citar conteúdo próprio em vez de inventar. |
| `ecooa_preparar_contato` | Monta o endereço de WhatsApp da recepção da ecooa com um assunto genérico, para a própria pessoa abrir e enviar. **Não envia mensagem e não abre nada sozinho.** Não inclua queixa de saúde no assunto. | `{ type: "object", properties: { assunto: { type: "string", title: "Assunto genérico", description: "Exemplos: agendar avaliação, saber valores, falar sobre sublocação. Não descreva sintomas nem condição de saúde." } }, required: [] }` | Devolve **a string da URL** `https://wa.me/5551991460909?text=...`. Não navega, não faz `window.open`, não dispara nada. O agente entrega o link, a pessoa clica. |

### 3.3 O que deliberadamente não expomos

- **Nada que agende.** Não existe endpoint de agendamento neste site, e não
  vamos simular um.
- **Nada que envie formulário.** Nenhum `toolautosubmit`, em nenhum form.
- **Nada que grave.** Sem `localStorage`, sem cookie, sem `fetch`.
- **Nada sobre paciente.** Não há base de pacientes no site estático, e não vai
  haver ferramenta que finja consultar uma.
- **Nada de preço.** O site não publica preços por decisão de negócio. A
  ferramenta diz que o valor é informado no agendamento, e para aí.
- **Nada de telefone ou agenda pessoal de profissional** que não esteja já
  publicado no site.

### 3.4 Formulários declarativos

Três formulários recebem `toolname` e `tooldescription`, e **nenhum** recebe
`toolautosubmit`:

| Form | `toolname` | Por que sem autosubmit |
|---|---|---|
| Newsletter do rodapé (14 páginas) | `assinar_editorial_ecooa` | Inscrição em lista é comunicação para pessoa real. O guia oficial manda omitir. |
| Mentorias | `pedir_informacoes_mentoria` | Abre WhatsApp da recepção. "High-Impact User Communication". |
| Sublocação | `pedir_informacoes_sublocacao` | Idem. |

O guia oficial do Chrome dá a regra pronta: usar `toolautosubmit` só em
"Read-Only Operations & Queries" e "Low-Risk, Reversible Actions"; omitir em
"High-Impact User Communication: submitting a final job application, sending
emails/messages to other real users". Os três caem no segundo grupo.

**A busca por queixa é o caso difícil.** Hoje `qual-profissional-procurar.html`
tem dois `<form>` (variante desktop e variante móvel) **sem anotação**, e por
isso `webmcp-form-coverage` vai listar os dois. Como essa auditoria é
informativa e sempre devolve `score: 1`, deixá-los sem anotação **não custa
ponto nenhum**.

Se optarmos por anotar, três cuidados obrigatórios:
1. `toolname` **diferente** em cada um dos dois (`buscar_profissional_por_queixa`
   e `buscar_profissional_por_queixa_movel`). Nome duplicado no mesmo documento
   é `InvalidStateError: Duplicate tool name`.
2. Nunca `toolautosubmit`. A pessoa é quem dispara a busca da própria queixa.
3. Resolver o problema do `name` descrito na seção 5.2 antes.

Recomendação: **anotar, com os três cuidados**, porque isso mantém
`webmcp-form-coverage` em "não aplicável" e é o estado limpo. Mas se houver
qualquer dúvida sobre o item 3, deixar sem anotação é a opção segura e custa
zero no placar.

---

## 4. Código de referência

JavaScript comum, sem dependência externa, sem `eval`, compatível com o CSP
atual (`script-src 'self' 'unsafe-inline'`).

### 4.1 O bloco que vai na página

```html
<script data-webmcp-ecooa>
/* Ferramentas WebMCP da ecooa, só de consulta.
   Nenhuma agenda consulta, envia formulário, grava dado ou executa ação
   irreversível. O agente DESCOBRE e PREPARA; quem confirma é a pessoa. */
(function () {
  'use strict';

  /* ── detecção de suporte ──────────────────────────────────────────
     document.modelContext é o local normativo (spec + Chromium + tipos
     oficiais + WPT). navigator.modelContext é o local antigo, depreciado
     no Chromium 150, mantido aqui só como reserva. Em navegador sem
     suporte os dois são undefined e saímos calados. */
  var ctx = (typeof document !== 'undefined' && document.modelContext) ||
            (typeof navigator !== 'undefined' && navigator.modelContext) ||
            null;
  if (!ctx || typeof ctx.registerTool !== 'function') return;

  var D = window.ECOOA || { profissionais: [], especialidades: [], artigos: [] };
  var BASE = 'https://www.somosecooa.com.br';
  var WA = 'https://wa.me/5551991460909';

  /* Só publicamos quem tem registro em conselho divulgável. Mesma regra do
     llms.txt e do noindex dos perfis. Conformidade não tem porta dos fundos. */
  function publicavel(p) {
    return p.estado !== 'a-adicionar' && !!p.registro;
  }

  function perfil(p) {
    return {
      nome: p.nome,
      profissao: p.classe,
      registro: p.registro,
      atuacao: p.area,
      atendimento: p.atendimento || 'presencial',
      url: BASE + '/profissionais/' + p.slug + '/'
    };
  }

  /* registerTool devolve Promise. Rejeição sem catch vira erro no console
     e derruba a auditoria de erros de console do Lighthouse. */
  function registra(t) {
    t.annotations = t.annotations || { readOnlyHint: true };
    try {
      var r = ctx.registerTool(t);
      if (r && typeof r.catch === 'function') r.catch(function () {});
    } catch (e) { /* superfície ainda em evolução */ }
  }

  /* ── 1. informações da clínica ── */
  registra({
    name: 'ecooa_informacoes_da_clinica',
    title: 'Informações da clínica ecooa',
    description: 'Devolve endereço, bairro, cidade, horário de funcionamento, telefone, e-mail e formas de atendimento da clínica ecooa, em Porto Alegre. Use para responder onde fica, que horas abre e como entrar em contato. Não agenda consulta.',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute: function () {
      return {
        nome: 'ecooa',
        endereco: 'Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS, 90430-180',
        horario: 'Segunda a sexta, das 8h às 20h. A agenda de cada profissional é individual.',
        telefone: '+55 51 99146-0909',
        whatsapp: WA,
        email: 'ecooa.adm@gmail.com',
        atendimento: 'Presencial em Moinhos de Vento e, com parte dos profissionais, também online.',
        responsavelTecnico: 'Gustavo Gehrke, CREMERS 35.822',
        precos: 'Não publicados. O valor depende do profissional e do tipo de avaliação, e é informado no agendamento.',
        agendamento: 'Não há agendamento automático. Todo agendamento passa pela recepção, pelo WhatsApp.',
        url: BASE + '/localizacao'
      };
    }
  });

  /* ── 2. especialidades ── */
  registra({
    name: 'ecooa_listar_especialidades',
    title: 'Áreas de atuação da ecooa',
    description: 'Lista as oito áreas de atuação da clínica ecooa, com o resumo de cada uma e o endereço da página. Use para saber o que a clínica atende.',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute: function () {
      return (D.especialidades || []).map(function (e) {
        return {
          nome: e.nome,
          slug: e.slug,
          resumo: e.resumo || '',
          url: BASE + '/especialidades/' + e.slug + '/'
        };
      });
    }
  });

  /* ── 3. profissionais de uma área ── */
  var AREAS = ['medicina', 'nutricao', 'saude-mental', 'saude-integrativa',
               'tricologia', 'transplante-capilar', 'estetica-facial',
               'estetica-corporal'];

  registra({
    name: 'ecooa_profissionais_da_area',
    title: 'Profissionais por área',
    description: 'Lista os profissionais de uma área da clínica ecooa, com profissão, registro no conselho, foco de atuação e endereço do perfil. Use depois de identificar a área. Não agenda nada.',
    inputSchema: {
      type: 'object',
      properties: {
        area: {
          type: 'string',
          title: 'Área de atuação',
          description: 'Identificador da área de atuação da clínica.',
          enum: AREAS
        }
      },
      required: ['area']
    },
    execute: function (args) {
      var a = (args && args.area) || '';
      return (D.profissionais || [])
        .filter(function (p) { return publicavel(p) && (p.esp || []).indexOf(a) >= 0; })
        .map(perfil);
    }
  });

  /* ── 4. busca por queixa, resolvida no navegador ──────────────────
     A queixa entra, é comparada com o almanaque local e é DESCARTADA.
     Não vai para URL, não vai para analytics, não vai para mensagem. */
  function normaliza(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');  // tira acento
  }

  registra({
    name: 'ecooa_encontrar_profissional_por_queixa',
    title: 'Encontrar profissional por queixa',
    description: 'A partir de uma queixa descrita em linguagem natural, devolve os profissionais da ecooa indicados para ela e a área de cuidado correspondente. É sugestão orientativa, não é diagnóstico e não é agendamento. A queixa é processada apenas no navegador e não é transmitida.',
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
      var q = normaliza(args && args.queixa);
      var grupos = window.ECOOA_SINTOMAS || [];
      var achados = [];

      for (var i = 0; i < grupos.length; i++) {
        var g = grupos[i];
        var bateu = false;
        for (var j = 0; j < (g.termos || []).length; j++) {
          if (q.indexOf(normaliza(g.termos[j])) >= 0) { bateu = true; break; }
        }
        if (!bateu) continue;
        achados.push({
          queixaReconhecida: g.rotulo,
          area: g.area,
          areaUrl: BASE + '/especialidades/' + g.area + '/',
          profissionais: (g.pros || [])
            .map(function (slug) {
              for (var k = 0; k < (D.profissionais || []).length; k++) {
                if (D.profissionais[k].slug === slug) return D.profissionais[k];
              }
              return null;
            })
            .filter(function (p) { return p && publicavel(p); })
            .map(perfil)
        });
      }

      return {
        aviso: 'Sugestão orientativa, não diagnóstico. A indicação depende de avaliação individual com o profissional.',
        urgencia: 'Em situação de risco à vida no Brasil: CVV 188, 24 horas e gratuito, e SAMU 192.',
        resultados: achados,
        semCorrespondencia: achados.length === 0,
        proximoPasso: achados.length
          ? 'Abra o perfil do profissional escolhido. O agendamento é feito pela recepção, no WhatsApp, pela própria pessoa.'
          : 'Não reconhecemos essa queixa no vocabulário do site. Abra ' + BASE + '/qual-profissional-procurar e descreva com outras palavras.'
      };
    }
  });

  /* ── 5. editorial ── */
  registra({
    name: 'ecooa_listar_artigos',
    title: 'Editorial da ecooa',
    description: 'Lista os textos do editorial da ecooa, assinados pelos profissionais da casa, com título, resumo, autor e endereço. Opcionalmente filtra por área.',
    inputSchema: {
      type: 'object',
      properties: {
        area: {
          type: 'string',
          title: 'Área',
          description: 'Filtro opcional pela área do texto.',
          enum: AREAS
        }
      },
      required: []
    },
    execute: function (args) {
      var a = (args && args.area) || '';
      return (D.artigos || [])
        .filter(function (x) { return !a || x.area === a; })
        .map(function (x) {
          var au = null;
          for (var k = 0; k < (D.profissionais || []).length; k++) {
            if (D.profissionais[k].slug === x.autor) { au = D.profissionais[k]; break; }
          }
          return {
            titulo: x.titulo,
            resumo: x.resumo,
            autor: au && publicavel(au) ? au.nome + ', ' + au.classe.toLowerCase() : null,
            url: BASE + '/blog/' + x.slug + '/'
          };
        });
    }
  });

  /* ── 6. preparar contato ──────────────────────────────────────────
     Devolve a URL. NÃO abre, NÃO navega, NÃO envia. */
  registra({
    name: 'ecooa_preparar_contato',
    title: 'Preparar contato com a recepção',
    description: 'Monta o endereço de WhatsApp da recepção da ecooa com um assunto genérico, para a própria pessoa abrir e enviar. Não envia mensagem e não abre nada sozinho. Não inclua queixa de saúde, sintoma nem condição clínica no assunto.',
    inputSchema: {
      type: 'object',
      properties: {
        assunto: {
          type: 'string',
          title: 'Assunto genérico',
          description: 'Exemplos: agendar avaliação, saber valores, falar sobre sublocação. Não descreva sintomas nem condição de saúde.'
        }
      },
      required: []
    },
    execute: function (args) {
      var a = String((args && args.assunto) || 'falar com a recepção').slice(0, 120);
      return {
        url: WA + '?text=' + encodeURIComponent('Olá! Vim pelo site. Assunto: ' + a + '.'),
        instrucao: 'Entregue este endereço para a pessoa abrir. Não abra em nome dela e não envie a mensagem.',
        observacao: 'A recepção responde em horário comercial, de segunda a sexta, das 8h às 20h.'
      };
    }
  });
})();
</script>
```

### 4.2 O gerador `.mjs`

O pós-processador vive em `scripts/agentes.mjs` e já roda no pipeline
(`scripts/gerar-site.mjs`, penúltimo bloco). A forma dele é:

```js
// 1. carrega os dados
global.window = {};
await import(path.join(DEPLOY, 'dados-ecooa.js'));
const ECOOA = global.window.ECOOA;

// 2. gera llms.txt e llms-full.txt (ambos com o MESMO filtro de publicáveis)
// 3. percorre deploy/**/*.html
//    3a. remove o bloco anterior pela marca data-webmcp-ecooa (idempotência)
//    3b. injeta name + toolparamdescription nos campos mapeados
//    3c. injeta toolname + tooldescription no <form> âncora
//    3d. injeta o bloco de ferramentas antes de </body>
```

Dois pontos de atenção do gerador atual:

- **Idempotência já está resolvida** pela marca `data-webmcp-ecooa`, que é
  removida por regex antes de reinjetar. Manter.
- **O almanaque de sintomas não está disponível no navegador.**
  `window.ECOOA.grupos` tem só 6 entradas de `{slug, nome}`, que são os grupos
  de marca, não os 28 grupos de sintoma com `termos`. O almanaque real
  (`scripts/almanaque.mjs`, `SINTOMAS`) é embutido só dentro do IIFE de
  `match.mjs`, na página `qual-profissional-procurar.html`, como variável local.
  Para a ferramenta 4 funcionar em todas as páginas, `agentes.mjs` precisa
  publicar `window.ECOOA_SINTOMAS` com uma projeção **enxuta** do almanaque
  (`id`, `rotulo`, `area`, `pros`, `termos`), ou registrar a ferramenta 4
  apenas na página do match. A segunda opção é mais barata em bytes e é
  legítima: o guia oficial recomenda registrar ferramentas conforme o contexto
  da página.

---

## 5. Riscos em contexto de saúde

### 5.1 A regra que não se negocia

A queixa que o visitante digita é **dado pessoal sensível** (dado referente à
saúde). Ela pode ser processada no navegador dele. Ela não pode:

- entrar na **URL** (query string, fragmento ou caminho);
- ir para **analytics** (GTM, GA4, evento customizado);
- entrar em **mensagem de WhatsApp** montada pela ferramenta;
- entrar em `name`, `description` ou `toolparamdescription` de qualquer tool;
- ser **gravada** em `localStorage`, `sessionStorage` ou cookie.

### 5.2 Regressão aberta: o `name="queixa"` recriou o vazamento que a ética fechou

Achado desta revisão, verificado no HTML gerado.

O commit `506de9a` ("fix(etica): tira a queixa da URL") atendeu a um veto do
tribunal ético. O trabalho de WebMCP, para satisfazer a regra de que todo campo
precisa de `name`, injetou `name="queixa"` no campo de busca:

```html
<input type="text" id="ec-queixa" placeholder="digite sua queixa, o procedimento
que quer conhecer ou uma palavra-chave" ... name="queixa"
title="Queixa ou procedimento procurado, em linguagem natural">
```

E o formulário que o contém não tem `action` nem `method`:

```html
<form style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
```

Um `<form>` sem `action`, com um campo `name`, faz **GET para a própria URL**
num submit nativo. Se o JavaScript ainda não tiver ligado o `preventDefault`,
ou falhar, apertar Enter manda o navegador para
`/qual-profissional-procurar?queixa=<a+queixa+da+pessoa>`. Existe um
`history.replaceState` que limpa `location.search` depois, mas ele roda **após**
a URL já ter existido: ela pode ter ido para o histórico, para o `Referer` da
próxima requisição e para o `page_view` do GTM.

Ou seja: a conformidade com a auditoria reabriu o vazamento que a ética tinha
fechado. Correções possíveis, em ordem de preferência:

1. **`method="dialog"` no form da queixa.** Submit nativo não navega e não
   serializa nada na URL. Uma linha, resolve na raiz.
2. **`<input type="search">` fora de `<form>`**, com o botão como
   `type="button"`. Perde a semântica de form, e o form some do
   `webmcp-form-coverage`.
3. **Manter o `<form>` e remover o `name` do campo da queixa.** Custa um WARNING
   `FormModelContextParameterMissingName` se o form for anotado, o que leva
   `webmcp-schema-validity` de 1 para 0.5. Meio ponto de auditoria experimental
   vale menos que uma queixa de saúde na URL.

Enquanto isso não for decidido, a opção segura é **não anotar** os dois forms da
queixa. Custo real no placar: zero.

### 5.3 Tudo que vai numa tool é público

`webmcp-registered-tools` imprime no relatório o nome, a descrição, a localização
no código e o `inputSchema` de cada ferramenta. Descrições e esquemas são
legíveis por qualquer agente. Não colocar ali: nome de paciente, telefone que
não esteja publicado, valores, margem, regra comercial interna, nome de
profissional em negociação.

### 5.4 Registro em conselho

O filtro `publicavel()` do código de referência não é detalhe. Cinco
profissionais estão sem registro divulgável e com `noindex` no perfil, por
decisão do tribunal ético. Uma ferramenta WebMCP que os listasse entregaria a um
agente exatamente o que o `noindex` tirou do índice. O mesmo filtro precisa valer
em `llms.txt`, `llms-full.txt` e nas tools.

### 5.5 Ação irreversível

Não há checkout nem cancelamento neste site, mas há disparo de mensagem para
pessoa real (recepção). O guia oficial classifica isso como "High-Impact User
Communication", que é lista de **omitir** `toolautosubmit`. Verificado no build
atual: `toolautosubmit` aparece 0 vezes. Manter assim.

### 5.6 Calibragem de expectativa, para dizer ao dono

- Estudo da Ahrefs com 137 mil domínios indica que 97% dos arquivos `llms.txt`
  não receberam nenhuma requisição em maio de 2026. John Mueller disse que
  `llms.txt` "is not done for search"; Gary Illyes confirmou que o Google não
  suporta e não planeja suportar. (Fonte secundária, não pude ler o estudo
  original.) Implementar serve para o placar do Lighthouse e para agentes que
  optem por ler, **não para ranking no Google**.
- No WebMCP, relatos indicam que hoje só o Gemini no Chrome consome tools.
  Exige aba visível, não funciona headless, e a spec mudou de lugar
  recentemente. É aposta de posicionamento antecipado, não canal de tráfego.

Nada disso é motivo para não fazer. É motivo para não vender o que não entrega.

---

## 6. Como verificar sem Chrome 150

Este ambiente tem Chromium 141 (Playwright), abaixo dos 146 exigidos, e sem as
flags. Não dá para rodar a categoria de verdade. Dá para verificar quase tudo.

### 6.1 Rodar a auditoria llms-txt de verdade, offline

O Lighthouse 13.4.1 está instalado no repositório. O audit é uma função pura
sobre um artefato. Dá para chamá-lo direto:

```js
// scratchpad/verifica-llms.mjs
import fs from 'node:fs';
import Audit from '/home/user/ecooa-website/node_modules/lighthouse/core/audits/agentic/llms-txt.js';

const content = fs.readFileSync('/home/user/ecooa-website/deploy/llms.txt', 'utf8');
for (const status of [200, 404, 500, 301]) {
  try {
    const r = Audit.audit({ LlmsTxt: { status, content: status === 301 ? null : content } });
    console.log(`status ${status} -> score=${r.score} notApplicable=${!!r.notApplicable}`);
  } catch (e) {
    console.log(`status ${status} -> LANCOU: ${e.message}`);
  }
}
```

Resultado obtido com o arquivo atual:

```
status 200 -> score=1 notApplicable=false
status 404 -> score=1 notApplicable=true
status 500 -> score=0 notApplicable=false
status 301 -> LANCOU: Status 301 was valid, but content was null
```

Isso é a auditoria real, não uma imitação dela. Prova três coisas: o conteúdo
passa; o "não aplicável" de hoje é 404 e não conteúdo; e redirect quebra.

### 6.2 Conferir as regras contra o fonte instalado

```bash
grep -n "hasH1\|hasLink\|isTooShort" node_modules/lighthouse/core/audits/agentic/llms-txt.js
grep -o "scoreDisplayMode: Audit.SCORING_MODES.[A-Z_]*" \
  node_modules/lighthouse/core/audits/webmcp-*.js
```

Confirmado nesta revisão: `webmcp-form-coverage` e `webmcp-registered-tools` são
`INFORMATIVE`; `webmcp-schema-validity` não declara modo, logo é binário.

### 6.3 Simular a API com um stub no Playwright

O Chromium 141 não tem WebMCP, mas dá para injetar um `document.modelContext`
falso antes do carregamento e conferir que as ferramentas se registram, que os
nomes são válidos e que nada estoura:

```js
await page.addInitScript((alvo) => {
  window.__tools = [];
  const api = { registerTool(t) { window.__tools.push(t); return Promise.resolve(); } };
  if (alvo === 'document') Object.defineProperty(document, 'modelContext', { value: api });
  else navigator.modelContext = api;
}, alvo);
```

Rodar para `alvo = 'document'`, para `alvo = 'navigator'` e **sem stub nenhum**.
Os três precisam terminar sem erro de página. O terceiro é o que garante que
navegador antigo não quebra.

Com as ferramentas capturadas, validar o que o Chromium validaria:

```js
const VALIDO = /^[A-Za-z0-9_.-]{1,128}$/;
for (const t of tools) {
  console.assert(VALIDO.test(t.name), 'nome inválido: ' + t.name);
  console.assert(t.description && t.description.length > 0, 'sem description: ' + t.name);
  console.assert(typeof t.execute === 'function', 'sem execute: ' + t.name);
}
console.assert(new Set(tools.map(t => t.name)).size === tools.length, 'nome duplicado');
```

**Limite honesto:** isso valida a via **imperativa**. A via **declarativa** (os
atributos no `<form>`) é sintetizada pelo Blink, e um stub não reproduz isso.
Os cinco `FormModelContext*` só aparecem num Chrome com WebMCP ligado.

### 6.4 Conferir os atributos declarativos por inspeção estática

```bash
# todo form anotado precisa dos DOIS atributos
grep -rho '<form[^>]*>' deploy --include='*.html' | grep 'toolname' | grep -c 'tooldescription'

# nenhum toolautosubmit
grep -rho 'toolautosubmit' deploy --include='*.html' | wc -l    # tem que dar 0

# cobertura: forms totais vs anotados
grep -rho '<form' deploy --include='*.html' | wc -l
grep -rho 'toolname=' deploy --include='*.html' | wc -l

# todo campo dentro de form anotado precisa de name e toolparamdescription
grep -rho 'toolparamdescription' deploy --include='*.html' | wc -l
```

Estado medido no build atual: 18 forms, 16 anotados (os 2 da queixa fora, por
decisão), `toolautosubmit` = 0 (correto), **`toolparamdescription` = 0
(pendência aberta, ver 7.1)**.

### 6.5 O que só dá para verificar em produção

- **Status HTTP de `https://www.somosecooa.com.br/llms.txt`.** Precisa ser
  **200 direto**, sem redirect. Este ambiente não alcança o domínio.
  ```bash
  curl -sSI https://www.somosecooa.com.br/llms.txt | head -1
  curl -sS -o /dev/null -w '%{num_redirects} redirects, final %{url_effective}\n' \
    -L https://www.somosecooa.com.br/llms.txt
  ```
  Enquanto isso responder 404, a auditoria fica em "não aplicável" e o placar
  não sai de 2/2, por mais correto que o arquivo esteja.
- **A categoria completa**, num Chrome 150+:
  ```bash
  npx lighthouse https://www.somosecooa.com.br/ \
    --only-categories=agentic-browsing \
    --chrome-flags="--enable-features=WebMCPTesting,DevToolsWebMCPSupport" \
    --view
  ```

---

## 7. Pendências abertas

### 7.1 `toolparamdescription` ausente (impede a nota 1,0)

`agentes.mjs` injeta `title="..."` nos campos. **`title` não está na ordem de
resolução do Chromium**, que é `toolparamdescription`, depois `textContent` do
`<label>`, depois `aria-description`. Medido: `toolparamdescription` aparece 0
vezes no build.

Os labels existem, e o `textContent` deles pode salvar (não confirmado em fonte
primária). Mas os labels são curtos e em caixa baixa por identidade da marca
("seu e-mail", "nome"), o que dá uma descrição pobre para um agente. E um único
WARNING leva `webmcp-schema-validity` de 1,0 para 0,5, que **não passa** (o
limiar é 0,9).

Correção: trocar a injeção de `title` por `toolparamdescription`, mantendo os
mesmos textos do mapa `CAMPOS`. Efeito colateral bônus: some o tooltip que o
`title` passou a mostrar no hover dos campos, que ninguém pediu.

### 7.2 `llms-full.txt` publica os cinco sem registro

`llms.txt` filtra por `indexavel()`; `llms-full.txt` mapeia
`ECOOA.profissionais` inteiro. Aplicar o mesmo filtro.

### 7.3 Almanaque de sintomas indisponível fora da página do match

Ver 4.2. Decidir entre publicar `window.ECOOA_SINTOMAS` ou registrar a
ferramenta de queixa só em `qual-profissional-procurar.html`.

### 7.4 Decidir o destino dos dois forms da queixa

Ver 5.2. Enquanto não decidido, deixar sem anotação.

---

## 8. Resumo para quem for executar

| Item | Estado | Ação |
|---|---|---|
| `llms.txt` conteúdo | Passa na auditoria real, rodada offline | Aplicar as correções de formato da seção 2.3 |
| `llms.txt` publicado | Responde 4xx em produção | **Publicar na raiz, 200 sem redirect.** É o único item que muda o placar sozinho |
| `llms-full.txt` | Publica 5 profissionais sem registro | Aplicar filtro `publicavel()` |
| Detecção da API | `document` primeiro, `navigator` reserva | Correto |
| `registerTool` Promise | `.catch()` presente | Correto |
| `toolautosubmit` | 0 ocorrências | Correto, manter |
| Forms anotados | 16 de 18 | Correto por ora |
| `toolparamdescription` | 0 ocorrências | **Corrigir.** Sem isso a nota trava em 0,5 |
| `name="queixa"` na URL | Regressão ética aberta | Decidir entre `method="dialog"` ou remover o `name` |
| Placar realista | 2/2 hoje | 3/3 com o llms.txt publicado. 4/4 só em Chrome com WebMCP ligado |
