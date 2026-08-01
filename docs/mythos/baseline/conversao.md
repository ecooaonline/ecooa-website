# Baseline de conversão crítica (P04/CRO)

> Auditoria somente leitura do site publicado (`deploy/`), medida em laboratório
> local `http://localhost:4353` com a CSP de produção.
> Data da medição: 2026-08-01, entre 14h56 e 15h25 UTC.
> Nenhum arquivo de `deploy/`, `src-site-3/` ou `scripts/` foi alterado.

**Nota da dimensão: 57/100.**

---

## 0. Aviso sobre alvo móvel

O `deploy/` foi regenerado por outro processo no meio desta auditoria. Entre a
primeira e a segunda passada o site mudou de forma relevante:

| | 14h56 | 15h20 |
|---|---|---|
| URLs no `sitemap.xml` | 31 | 62 |
| Páginas de perfil de profissional | 0 | 31 |
| Analytics no HTML | nenhum | GTM-TSR4GDMK com Consent Mode v2 |
| Links `wa.me` no deploy | 238 | 482 |

**Todos os números deste laudo referem-se ao estado das 15h20**, remedidos após
a estabilização (`md5sum` de `deploy/index.html` estável por 30s). Onde a
primeira passada é citada, está marcado.

---

## 1. Método

Ferramentas e procedimentos usados. Nada aqui é impressão.

1. **Inventário estático**: varredura de todos os `.html` de `deploy/` com Node,
   extraindo cada URL `https://wa.me/...`, decodificando o parâmetro `?text=` e
   agrupando por página. Idem para `mailto:`, `tel:`, `<form>`, JSON-LD.
2. **Navegador real**: `playwright-core` do repositório com o Chromium em
   `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, em dois perfis:
   - mobile 390x844, `isMobile`, `hasTouch`, DPR 3, UA de iPhone
   - desktop 1440x900
3. **Prova de abertura de WhatsApp e de e-mail**: sessão CDP (`Page.enable`)
   escutando `Page.windowOpen` e `Page.frameRequestedNavigation`. É a única
   forma confiável de capturar navegação para `wa.me` em nova aba e para
   `mailto:`, já que nenhuma das duas gera requisição de rede observável e o
   `window.location` do Chromium não pode ser sobrescrito.
4. **Clique real vs. programático**: os formulários de lead foram testados das
   duas formas. `form.requestSubmit()` não dispara a abertura (falta ativação de
   usuário); `elementHandle.click()` no botão dispara. A diferença está
   registrada porque muda a conclusão.
5. **Dobra**: `getBoundingClientRect()` de cada âncora `wa.me` visível
   (`display`, `visibility`, `opacity` e área verificados) contra a altura da
   viewport, sem rolagem.
6. **Sobreposição**: `document.elementFromPoint()` no centro do botão flutuante,
   para saber quem de fato recebe o toque.
7. **Instrumentação**: `window.dataLayer.push` interceptado em runtime para
   registrar os eventos realmente emitidos em um clique de WhatsApp.
8. **Cobertura**: as 62 URLs do `sitemap.xml` percorridas uma a uma, com status
   HTTP conferido.

Scripts de medição em
`/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/`
(`t2-forms.mjs`, `t3-clickreal.mjs`, `t13-jornada.mjs`, `t17-rev.mjs`,
`t18-consent.mjs`, `t19-perfil.mjs`).

---

## 2. Mapa de conversão medido

### 2.1 Volume

| Medida | Valor |
|---|---|
| Arquivos HTML em `deploy/` | 95 |
| Páginas reais (fora as 28 pontes de redirect) | 67 |
| URLs no `sitemap.xml` | 62 (9 raiz + 8 áreas + 31 perfis + 14 artigos) |
| URLs do sitemap que respondem 200 no laboratório | 62 de 62 |
| Links `wa.me` no deploy | 482 |
| Páginas sem nenhum link `wa.me` | 0 |
| Mensagens de WhatsApp distintas | 60 |
| Números de telefone distintos em todo o deploy | 1 |
| Links `mailto:` | 73, todos para `ecooa.adm@gmail.com` |
| Links `tel:` | 0 |
| Formulários funcionais | 3 |

### 2.2 Telefone

`5551991460909` em 100% das 482 ocorrências. Nenhum número divergente, nenhum
número antigo, nenhum DDD errado. Formato de exibição `(51) 99146-0909` em 40
lugares. **Este item está correto.**

Ressalva de governança: o número está **cravado à mão em 28 arquivos-fonte** (8
em `scripts/*.mjs`, 19 em `src-site-3/*.html`, 1 em `src/data/constants.ts`). Não
existe fonte única. Trocar o número exige 28 edições coordenadas mais uma
regeração, e nada no build valida que todas foram feitas.

### 2.3 Personalização das mensagens

`scripts/personaliza.mjs` faz o trabalho e faz bem. Verificado por decodificação
do `?text=` de cada link, por tipo de página:

| Tipo de página | Mensagem |
|---|---|
| home | genérica (`agendar uma avaliação`) |
| `/sobre` | cita a história da clínica |
| `/especialidades` | pede ajuda para escolher a especialidade |
| `/profissionais` | pede indicação de profissional |
| `/qual-profissional-procurar` | pede ajuda para encontrar o profissional |
| `/blog` | cita o editorial |
| `/localizacao` | cita atendimento presencial em Moinhos de Vento |
| `/mentorias` | cita a ecooa.cademy |
| `/sublocacao` | cita sublocação de sala |
| `/404` | cita página inexistente |
| 8 páginas de área | `agendar uma avaliação em <área>` |
| 31 perfis | `li o perfil de <nome> ... consulta de <área>` |
| 14 artigos | `Li o texto "<título>" ... consulta com <autor>, que assina o texto` |

Modal do mosaico e resultado do match também personalizam em runtime
(`agendar com Gustavo`, `agendar com Natálie`). Nada aqui está genérico por
descuido.

### 2.4 Botão flutuante

Presente e visível nas 62 páginas do sitemap. `position: fixed`, 60x60,
`aria-label="Conversar com a ecooa no WhatsApp"`, canto inferior direito.
Mensagem herdada da página, ou seja, também personalizada.

### 2.5 Menu do celular

Botão `menu` de 80x44 no cabeçalho. Abre painel com 8 links de navegação de
350x52 mais um CTA `agendar` de 350x54 apontando para WhatsApp. Funciona.
O cabeçalho mobile em si não tem CTA de WhatsApp visível: mostra logo (98x60),
Instagram (40x40) e o botão `menu`.

---

## 3. Teste ponta a ponta dos três formulários

### 3.1 Newsletter do rodapé

Campo `#ec-news`, `type=email`, **sem `required`**, sem `name`, rotulado por
`<label for>` com texto `seu e-mail`.

Resultado medido (CDP `Page.frameRequestedNavigation`), em `/`, `/blog.html` e
`/mentorias.html`:

```
mailto:ecooa.adm@gmail.com?subject=Inscricao no editorial ecooa
  &body=Gostaria de assinar o editorial da ecooa.

E-mail para inscricao: paciente.teste@exemplo.com
```

O e-mail digitado chega preenchido. A página não recarrega, o campo não é
zerado, o botão passa a `e-mail aberto`. Reenvio funciona (2 navegações em 2
submissões). E-mail inválido é barrado pela validação nativa e o botão continua
`assinar`.

**Onde falha:** o formulário existe em apenas **9 das 62 páginas do sitemap**.
As 8 páginas de área, os 31 perfis e os 14 artigos não têm rodapé com captura de
e-mail. O script de conversão é injetado nas 62 (`document.getElementById('ec-news')`
retorna `null` e ele sai calado), mas o `<form>` não existe. São 53 páginas onde
não há como capturar um contato de quem ainda não quer falar no WhatsApp.

### 3.2 Lead de mentorias (`/mentorias.html`)

Cinco campos: `ec-nome` (obrigatório), `ec-mail` (obrigatório, `type=email`),
`ec-classe`, `ec-prog` (select), `ec-msg` (textarea). Nenhum tem `name`.

Com **clique real** no botão, `Page.windowOpen` capturou:

```
https://wa.me/5551991460909?text=Olá! Vim pelo site da ecooa e tenho interesse
na ecooa.cademy.

Nome: TESTE ec-nome
E-mail: teste@exemplo.com
Formacao: TESTE ec-classe
Interesse: Mentoria em grupo
O que busco: TESTE ec-msg
```

Idêntico em desktop e em mobile. Os cinco campos chegam. Formulário vazio é
barrado (`checkValidity() === false`, nenhuma navegação).

### 3.3 Lead de sublocação (`/sublocacao.html`)

Cinco campos: `sb-nome`, `sb-mail`, `sb-classe`, `sb-uso` (select), `sb-msg`.
Mesmo comportamento, mensagem correta:

```
Olá! Vim pelo site da ecooa e tenho interesse na sublocação de sala.

Nome: ... / E-mail: ... / Formacao e registro: ... / Uso pretendido: Período
fixo / Como trabalho hoje: ...
```

### 3.4 O que os três têm de errado

1. **Sucesso declarado sem verificação.** Nos três, o rótulo do botão vira
   `conversa aberta` ou `e-mail aberto` e o aviso vira "Abrimos a conversa..."
   imediatamente após disparar a navegação, sem checar nada. No meu teste a aba
   aberta terminou em `chrome-error://chromewebdata/` (o laboratório não alcança
   `wa.me`) e o site declarou sucesso do mesmo jeito. Em produção o mesmo
   acontece com quem não tem WhatsApp instalado, com quem não tem cliente de
   e-mail configurado e com quem tem bloqueador de pop-up agressivo. O lead
   evapora e a pessoa acredita que enviou.
2. **Nenhum plano B.** Depois do "sucesso" não há link visível para tentar de
   novo, nem o texto montado para copiar, nem endereço alternativo.
3. **Nada é gravado.** Não há backend, não há e-mail de cópia, não há CRM. Se a
   pessoa abandona no cliente de WhatsApp, não sobra nenhum rastro do que ela
   escreveu.
4. **Sem `name` e sem `action`.** Se o script inline falhar por qualquer motivo,
   o submit vira GET na própria URL, recarrega a página e perde tudo, e como não
   há `name` nem sequer os dados apareceriam na query string.
5. **Sem consentimento LGPD e sem link para políticas junto ao formulário.**
   Verificado nos 3.000 caracteres em torno de cada `<form>`: nenhuma ocorrência
   de checkbox de consentimento, `politicas`, `privacidade` ou `LGPD`.
6. **Acentos quebrados nas cadeias de conversão.** O texto que vai para o
   WhatsApp da clínica e o aviso que a pessoa lê estão sem acento:
   `Formacao`, `Formacao e registro`, `nao informado`,
   `Abrimos a conversa no WhatsApp com o seu texto ja preenchido`,
   `Abrimos um e-mail ja preenchido para voce enviar. A inscricao vale quando ele chegar.`,
   `E-mail para inscricao:`. O bloco morto do template original
   (`<script type="text/x-dc">`, inerte) guarda a versão acentuada correta, o
   que prova que isto é regressão introduzida por `scripts/conversao.mjs`, não
   herança. Viola a regra de acentuação pt-BR do projeto.

---

## 4. CTA acima da dobra

Medido nas 62 URLs do sitemap, viewport 390x844, sem rolagem.

| | Mobile 390x844 | Desktop 1440x900 |
|---|---|---|
| Páginas com CTA **textual** de WhatsApp acima da dobra | 41 de 62 | 62 de 62 |
| Páginas onde o único elemento de conversão acima da dobra é o botão flutuante | **21 de 62** | 0 |

As 21 sem CTA textual no celular:

`/sobre`, `/especialidades`, `/profissionais`, `/qual-profissional-procurar`,
`/blog`, `/mentorias`, `/sublocacao` e **os 14 artigos do blog**.

No desktop o cabeçalho é `position: fixed` e traz `agendar` em `y=16`, o que
resolve. No celular esse botão vive dentro do menu sanfona e exige um toque a
mais para aparecer.

Escala da home no celular: documento de **16.209px** de altura, com apenas dois
CTAs estáticos de WhatsApp, em `y=509` e em `y=14.254`. São 13.700px, cerca de
16 telas, sem nenhum convite a agendar além do botão flutuante.

---

## 5. Achado crítico: o aviso de consentimento cobre o botão flutuante

Medido no navegador, na home, viewport 390x844, primeira visita
(`localStorage` limpo):

```
banner  [12, 690, 378, 832]   z-index 9998
botão   [314, 768, 374, 828]  z-index 70
sobrepõe: true
document.elementFromPoint(344, 798) -> BANNER
```

O aviso de privacidade **contém inteiramente** o botão flutuante de WhatsApp e
recebe o toque no lugar dele. No desktop não há sobreposição
(banner `[440,796,1000,888]`, botão `[1351,811,1411,871]`).

Consequência somada ao item 4: nas 21 páginas em que o botão flutuante é o
**único** ponto de conversão acima da dobra no celular, o visitante de primeira
viagem não consegue tocá-lo até fechar o aviso. Isso inclui os 14 artigos do
blog, que são justamente a porta de entrada orgânica.

---

## 6. Jornadas medidas

### 6.1 Paciente com dor nas costas que chega na home (celular)

| Caminho | Toques | Onde chega |
|---|---|---|
| Botão flutuante | 1 (+1 para fechar o aviso na primeira visita) | WhatsApp com mensagem **genérica**, sem contexto de dor |
| `agendar` do herói (`y=509`, dentro da dobra) | 1 | mesma mensagem genérica |
| `encontrar meu profissional` (`y=575`, dentro da dobra) → atalho pronto `dor nas costas que não passa` → `agendar com Natálie` | **3** | WhatsApp com `Usei o ecooa.match no site sobre dor musculoesquelética e gostaria de agendar uma consulta com Natálie Queiroz` |

Três toques até o profissional certo com mensagem contextualizada é um resultado
bom. O atalho pronto na tela do match elimina a digitação.

Fricção medida: depois do toque no atalho, `scrollY` permanece em 0 e o
resultado é renderizado em `y=914`, abaixo da dobra. **A pessoa não vê a
resposta sem rolar.** Não há rolagem automática nem foco no resultado.

### 6.2 Pessoa que chega direto num artigo do blog (celular)

Medido em `/blog/queda-de-cabelo-causas/`:

- altura do documento: 2.776px
- parágrafos de corpo: **3**
- `agendar com Yale` (autora) em `y=865`, ou seja **21px abaixo da dobra**
- links internos para `especialidades` em `y=1.698` e para `busca por IA` em `y=1.788`
- único elemento de conversão acima da dobra: o botão flutuante, coberto pelo aviso

E o problema maior: **12 dos 14 artigos não têm texto**. Contagem de palavras
dentro de `<article>`, que inclui título, linha fina, assinatura e disclaimer:

```
   61  ansiedade-como-identificar-tratar
  309  canetas-emagrecedoras-nutricao      <- tem corpo
   58  equilibrio-hormonal-como-identificar
  350  implante-hormonal-subcutaneo        <- tem corpo
   63  interpretacao-exames-bioquimicos
   59  longevidade-saudavel
   66  menopausa-tratamento-hormonal
   62  nutricao-esportiva-performance
   62  osteopatia-o-que-e-para-quem
   64  queda-de-cabelo-causas
   63  rejuvenescimento-facial-porto-alegre
   59  saude-capilar-feminina
   58  saude-mental-emagrecimento
   61  transplante-capilar-porto-alegre
```

Os 12 de ~60 palavras são só cabeçalho e aviso legal. Estão no sitemap, têm
JSON-LD de `Article`, têm CTA de agendamento com a autora, e não entregam nada
a quem chega do Google. É a pior taxa de conversão possível: tráfego que sai na
mesma tela.

### 6.3 Perfis de profissional

As 31 páginas criadas na segunda passada estão bem resolvidas para conversão:

| | gustavo-gehrke | natalie-queiroz | adriana |
|---|---|---|---|
| altura mobile | 8.011px | 5.569px | 4.666px |
| palavras | 912 | 549 | 406 |
| `agendar com <nome>` | `y=509` | `y=521` | `y=395` |
| `falar com a recepção` | `y=6.677` | `y=4.235` | `y=3.332` |
| registro profissional no corpo | sim | sim | sim |
| formato de atendimento | sim | sim | sim |
| preço | não | não | não |
| convênio | não | não | não |

CTA personalizado acima da dobra no celular nas três. Este é o melhor pedaço da
camada de conversão do site.

---

## 7. ecooa.match

Funciona. Duas entradas, testadas no navegador.

**Texto livre.** Campo mais cinco atalhos prontos. Digitar
`estou com dor nas costas ha meses` produz o bloco
`Corpo em movimento, dor sob investigação.` com 5 profissionais, cada um com CTA
próprio, mais um `Falar com nossa equipe` que carrega a frase digitada:

```
Olá! Usei o ecooa.match no site. Escrevi no site: estou com dor nas costas ha
meses. Qual profissional a equipe me indica para o meu caso?
```

**Guiado.** 5 perguntas, todas com opção `ainda não sei`. 6 toques do início ao
resultado. O CTA agregado carrega o resumo das respostas.

Defeitos medidos:

1. **Perda de contexto no modo guiado.** Os CTAs individuais saem como
   `Olá! Usei o ecooa.match no site e gostaria de agendar uma consulta com
   Gustavo Gehrke`, sem nenhuma menção à queixa, enquanto no modo texto livre
   saem com `sobre dor musculoesquelética`. Quem chega no WhatsApp pelo guiado
   chega sem história.
2. **Sem estado na URL.** `location.href` não muda em nenhum passo. O resultado
   não é compartilhável, não é favoritável, e o botão voltar do navegador sai da
   página em vez de voltar um passo.
3. **Sem rolagem para o resultado** (item 6.1).
4. **Nenhuma captura.** Quem chega ao resultado e não toca no WhatsApp não deixa
   rastro nenhum, nem e-mail, nem retomada.

---

## 8. Medição

Estado às 15h20 (não existia às 14h56):

- `GTM-TSR4GDMK` presente em 62 páginas, carregado tarde: só depois do primeiro
  `pointerdown`, `keydown`, `scroll` ou `touchstart`, ou 4s após o `load`.
- Consent Mode v2 com tudo negado por padrão. `analytics_storage` só vira
  `granted` se a pessoa tocar em `aceitar` no aviso.
- Eventos capturados de verdade (interceptando `dataLayer.push` e clicando num
  link de WhatsApp):

```json
{"event":"whatsapp_click","pagina":"home","tipo":"institucional",
 "rotulo":"agendar","destino":"recepcao","posicao":"cabecalho"}
```

- Também existem `form_submit` (com `formulario: newsletter|lead`) e
  `match_resultado` (com bloco entendido e nomes indicados), este último por
  `MutationObserver`. O termo digitado no match não é enviado, decisão correta
  para dado de saúde.
- Contexto por tipo de página (`perfil`, `area`, `artigo`, `institucional`) e por
  posição (`cabecalho`, `corpo`, `rodape`).

O que **não** está resolvido:

1. **A medição depende de opt-in.** Com `analytics_storage: denied`, que é o
   estado de quem ignora o aviso, não há dado de conversão utilizável. Não há
   nenhuma medição de servidor, de log ou de primeira parte para compensar.
2. **O contêiner GTM é caixa-preta daqui.** Não é possível provar que existem
   tags e gatilhos de GA4 para `whatsapp_click`, `form_submit` e
   `match_resultado`. Empurrar para o `dataLayer` não é medir.
3. **Nenhum evento para clique em `mailto:`**, que é o canal da newsletter.
4. **Nenhum evento de falha.** Como o site nunca verifica se a janela abriu,
   também nunca registra que não abriu.
5. Zero histórico. O site rodou até hoje sem nenhuma medição de conversão.

---

## 9. O que falta como argumento de conversão

Varredura do texto visível de todos os HTML do deploy.

| Elemento | Estado medido |
|---|---|
| Depoimentos de paciente | **0 ocorrências** |
| Avaliações, notas, estrelas | **0 ocorrências** |
| Google reviews ou selo de reputação | **0 ocorrências** |
| Contadores de prova (pacientes atendidos, anos) | **0 ocorrências** |
| Antes e depois, casos | **0 ocorrências** |
| Preço ou faixa de preço | 2 páginas, sempre "varia, é informado no agendamento" |
| Convênio | **1 página** (FAQ de medicina): "O atendimento é particular" |
| Reembolso e recibo | 1 página |
| Telemedicina | 1 página |
| Horário de funcionamento | rodapé de todas: "Segunda a sexta, 8h às 20h" |
| Horário por profissional | 0 |
| Agendamento online real | **não existe**; `/agendamento` é ponte para `/localizacao` |
| Mapa embutido | **0 iframes**; há link de busca no Google Maps por texto, não por place ID |
| Clique para ligar (`tel:`) | **0 em todo o site** |
| Schema `LocalBusiness` ou `MedicalClinic` | **não existe**; nenhum campo `telephone`, `openingHours` ou `aggregateRating`. O que há: `Article`, `Person`, `Organization`, `FAQPage` |
| E-mail em domínio próprio | não; 73 links para `ecooa.adm@gmail.com` |

As FAQs das páginas de área são o melhor material de objeção que o site tem, e
estão presas em 8 páginas. A home, os 31 perfis e os 14 artigos não respondem
nada sobre preço, convênio, primeira consulta ou formato.

Alvos de toque abaixo de 44px no celular: telefone do rodapé (104x40) e e-mail
do rodapé (147x40).

---

## 10. Tabela de achados

| # | Sev. | Achado | Evidência |
|---|---|---|---|
| 1 | crítico | Aviso de consentimento cobre o botão flutuante de WhatsApp no celular | `elementFromPoint(344,798)` retorna o banner; z-index 9998 vs 70 |
| 2 | crítico | Sucesso declarado sem verificação nos 3 formulários | botão vira `conversa aberta` com a aba em `chrome-error://` |
| 3 | crítico | 12 de 14 artigos sem corpo de texto, indexados e com CTA | 58 a 66 palavras em `<article>` |
| 4 | alto | 21 de 62 páginas sem CTA textual acima da dobra no celular | medição em 390x844 nas 62 URLs |
| 5 | alto | Prova social inexistente | 0 depoimentos, 0 avaliações, 0 casos |
| 6 | alto | Medição de conversão depende de opt-in e não é verificável | `analytics_storage: denied` por padrão; contêiner GTM externo |
| 7 | alto | Newsletter existe em 9 de 62 páginas | `#ec-news` ausente nas 53 restantes |
| 8 | alto | Nenhum `tel:` no site | 0 ocorrências em 95 HTML |
| 9 | alto | Preço, convênio e formato só nas FAQs de 8 páginas de área | 1 a 2 páginas por termo |
| 10 | médio | Acentos quebrados nas cadeias de conversão | `Formacao`, `ja preenchido`, `inscricao`, `voce` |
| 11 | médio | Telefone cravado em 28 arquivos-fonte, sem fonte única | grep em `scripts/`, `src-site-3/`, `src/` |
| 12 | médio | Formulários sem consentimento LGPD e sem link para políticas | nenhuma ocorrência em 3.000 chars ao redor de cada `<form>` |
| 13 | médio | Match não rola até o resultado | `scrollY=0`, resultado em `y=914` |
| 14 | médio | Match guiado perde o contexto nos CTAs individuais | mensagem sem menção à queixa |
| 15 | médio | Match sem estado na URL | `location.href` constante em 6 passos |
| 16 | médio | Campos sem `name` e `<form>` sem `action` | degradação sem JS perde tudo |
| 17 | médio | Sem `LocalBusiness`/`MedicalClinic`, sem `telephone` no schema | 0 ocorrências |
| 18 | baixo | Alvos de toque de 40px no rodapé | telefone 104x40, e-mail 147x40 |
| 19 | baixo | Home de 16.209px no celular com 2 CTAs estáticos | vão de 13.700px sem CTA |
| 20 | baixo | E-mail de conversão em Gmail gratuito | 73 links `ecooa.adm@gmail.com` |

---

## 11. O que não foi possível medir, e por quê

1. **URLs sem extensão em produção.** `/sobre` responde 404 no servidor Python
   do laboratório e 200 apenas com `.html`. GitHub Pages e Cloudflare resolvem
   isso sozinhos, mas o domínio real não é alcançável deste ambiente (proxy 403)
   e **não existe nenhuma verificação automatizada no repositório** que prove
   que as 62 URLs do sitemap respondem 200 em produção.
2. **Se o GTM realmente registra as conversões.** O contêiner `GTM-TSR4GDMK` é
   externo. Não dá para provar que há tag de GA4 disparando em `whatsapp_click`,
   `form_submit` ou `match_resultado`.
3. **Se o `mailto:` abre no aparelho do visitante.** Depende do cliente de
   e-mail configurado. Em celular sem app de e-mail, não abre nada.
4. **Se o WhatsApp é atendido, em quanto tempo e com que taxa de resposta.**
   Fora do código.
5. **Taxa de conversão real, volume de cliques, leads por mês.** Nunca houve
   medição. Não há linha de base histórica de espécie alguma.
6. **Perfil da Empresa no Google, avaliações e se o link de mapa cai no lugar
   certo.** O link é uma busca por texto, não por identificador de lugar.
7. **CSP real do domínio.** A que chega ao visitante é injetada no painel da
   Cloudflare e difere de `deploy/_headers`: a do laboratório não traz
   `form-action` nem `frame-src`. Se a política do painel um dia ganhar
   `form-action` sem `mailto:`, a newsletter para de funcionar em silêncio.
8. **Quantos perfis exibem registro com ressalva.** A varredura acusou 31 de 31
   com número no corpo, mas as seções `Quem mais atende <área>` imprimem
   registros de terceiros na mesma página, o que contamina a contagem. Item de
   P17, não conclusivo aqui.

---

## 12. Justificativa da nota

**57/100.**

O que sustenta a nota acima de 50: a arquitetura de conversão existe, está
presente em 62 de 62 páginas, usa um único telefone correto, e a personalização
por contexto é real e profunda (60 mensagens distintas, 31 perfis com CTA
próprio, artigos citando autor e título). Os três formulários foram testados em
navegador real e os três entregam os dados no destino. O ecooa.match funciona e
leva um paciente com dor nas costas da home ao profissional certo em 3 toques,
com mensagem contextualizada. Isso é bem acima da média de site de clínica.

O que impede a nota de subir: o principal ponto de conversão no celular está
literalmente coberto pelo próprio aviso de consentimento do site, e isso foi
medido, não inferido. Os três formulários mentem sucesso sem verificar nada, que
é exatamente a falha silenciosa que esta dimensão existe para caçar. Doze das
catorze portas de entrada orgânicas são páginas vazias com CTA. Não existe uma
única prova social no site inteiro. E a medição, que nasceu hoje, depende de
opt-in e não pode ser verificada daqui, o que significa que ninguém consegue
provar que um lead sequer chegou. Um site que não mede não tira nota alta neste
quesito, por melhor que seja a engenharia por trás dos botões.
