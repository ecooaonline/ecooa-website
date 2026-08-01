# Baseline P14 · Analytics, aquisição e presença

> Auditoria de estado, não de intenção. Tudo aqui foi medido em `deploy/` e no
> laboratório `http://localhost:4353`, que serve a pasta publicada com a CSP real
> de produção, em 2026-08-01. Nenhum arquivo do site foi alterado. Onde não deu
> para medir, está escrito que não deu e por quê.

**Nota do estado atual: 26/100.**

O veredito em uma frase: o site instalou uma camada de medição bem pensada e
hoje ela entrega **zero dado**, porque a CSP que a Cloudflare aplica no domínio
não tem `connect-src` e bloqueia, na origem, todo hit que o GA4 tentaria enviar.
Medido, não deduzido: `connect-src :: https://www.google-analytics.com/g/collect`
e `connect-src :: https://region1.google-analytics.com/g/collect`. Some-se a
isso que nenhuma tag foi criada dentro do contêiner, que não existe uma única
captura de UTM em todo o site, e que o único identificador de origem que viaja
até o WhatsApp é uma frase em português. O resultado é uma clínica que não
consegue responder de onde veio nenhum paciente.

O que impede a nota de ser mais baixa é trabalho real e verificado: a camada
existe em 66 das 95 páginas, tem Consent Mode v2 com tudo negado por padrão, não
carrega nada antes do primeiro gesto, os três eventos que empurra nascem com
contexto de página, perfil e área, o termo de saúde digitado no `ecooa.match`
comprovadamente **não** é enviado, e o NAP em texto é idêntico nas 67 páginas
reais. É uma fundação. Não é medição.

---

## 1. Método

| O que | Como |
|---|---|
| Cobertura da instrumentação | `grep` de `GTM-TSR4GDMK`, `dataLayer`, `data-medicao-ecooa` nos 95 arquivos `.html` de `deploy/` |
| Comportamento em execução | Playwright + Chromium 1194 (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) contra `http://localhost:4353`, com a CSP de produção nos cabeçalhos |
| Eventos realmente empurrados | leitura do `window.dataLayer` antes e depois de cada interação (aceite, recusa, clique de WhatsApp, envio dos 3 formulários, uso do match, rolagem até o fim, clique no Instagram, abertura de perfil) |
| Transporte do GA4 | `fetch` e `navigator.sendBeacon` para `google-analytics.com` e `region1.google-analytics.com` dentro da página, com captura do evento `securitypolicyviolation` |
| Superfície liberada pela CSP | `fetch` para `clarity.ms` e `connect.facebook.net`, `iframe` para `googletagmanager.com` e `google.com`, com captura das violações |
| Atribuição | carregamento de `/?utm_source=instagram&utm_medium=bio&utm_campaign=teste&gclid=XYZ` e inspeção de `dataLayer`, `sessionStorage`, `localStorage` |
| Rótulos de conversão | extração de todos os `a[href*="wa.me"]` de 4 páginas, cálculo da chave `posicao\|rotulo` que o evento produz e contagem de colisões |
| Texto do WhatsApp | decodificação de todos os 484 `wa.me` do deploy e contagem de mensagens distintas |
| Presença local | extração de `title`, `description`, JSON-LD e NAP em texto dos 67 arquivos que não são ponte, com comparação campo a campo |
| Documentos vs realidade | leitura de `docs/EVENTS_TRACKING_PLAN.md`, `docs/GTM-DATA-INTENTS.md` e `docs/mythos/PENDENCIAS-DO-DONO.md` contra o HTML publicado |

Scripts de sondagem ficaram no scratchpad da sessão (`probe.mjs` a `probe7.mjs`).
Não foram copiados para o repositório.

---

## 2. Cobertura: o contêiner está em 66 de 95 páginas

```
95   arquivos .html em deploy/
-28   páginas-ponte de redirecionamento (<title>Página movida</title>)
- 1   404.html
= 66   páginas com GTM-TSR4GDMK e com o bloco <script data-medicao-ecooa>
```

O sitemap declara **62 URLs** (9 raiz + 8 especialidades + 31 perfis + 14 artigos).
As 66 páginas instrumentadas cobrem as 62 do sitemap, mais `politicas.html` e
mais três duplicatas de hub (`blog/index.html`, `especialidades/index.html`,
`profissionais/index.html`).

Registro de divergência: o briefing desta auditoria fala em 31 URLs no sitemap.
Medido hoje: 62. O sitemap cresceu com as 31 páginas de perfil no commit
`18ded8a`. O baseline de SEO técnico, escrito antes, ainda cita 31.

**Uma ocorrência de `GTM-TSR4GDMK` por página.** Nenhum GA4 direto: zero
ocorrências de `G-XXXXXXXXXX`, zero de `googletagmanager.com/gtag/js`.

### Pixels de terceiros: nenhum

| Procurado | Ocorrências no deploy |
|---|---|
| `connect.facebook.net` / `fbq(` | 0 |
| `clarity.ms` / `clarity(` | 0 |
| `google-analytics.com` direto | 0 |
| `utm_` em qualquer link | 0 |
| `data-intent` | 0 |

A CSP de produção libera `https://*.clarity.ms` e `https://connect.facebook.net`
em `script-src`. Não há Clarity nem Pixel instalado. A permissão existe sem uso.

---

## 3. O bloqueio de primeira ordem: a CSP mata o transporte

A CSP que o laboratório serve, idêntica à do painel Cloudflare:

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
           https://*.clarity.ms https://*.google-analytics.com
           https://*.googletagmanager.com https://connect.facebook.net;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self'
```

Ela termina em `font-src`. **Não existe `connect-src`. Não existe `frame-src`.**
Sem essas diretivas, `default-src 'self'` governa as duas.

Violações capturadas dentro da página, no navegador, com a CSP aplicada:

```
connect-src :: https://www.google-analytics.com/g/collect?v=2&tid=G-TEST
connect-src :: https://region1.google-analytics.com/g/collect
connect-src :: https://www.clarity.ms/tag/x
connect-src :: https://connect.facebook.net/en_US/fbevents.js
frame-src  :: https://www.googletagmanager.com
frame-src  :: https://www.google.com
```

Três consequências, todas de primeira ordem:

1. **O GA4 não consegue enviar hit nenhum.** O endpoint `/g/collect` é chamado
   por `fetch` ou `sendBeacon`, e ambos caem em `connect-src`. Medido: o `fetch`
   falha com `TypeError: Failed to fetch`; o `sendBeacon` retorna `true`, o que é
   pior, porque a biblioteca acredita que enviou e não tenta caminho alternativo.
   O dono pode criar todas as tags do mundo dentro do GTM: nada sai do navegador.
2. **O Preview do GTM e o Tag Assistant não funcionam em produção.** Eles montam
   um `iframe` de `googletagmanager.com`, bloqueado por `frame-src`. Ou seja, o
   dono não tem como validar as tags no ambiente real nem descobrir sozinho que
   elas não medem.
3. **Nenhum mapa pode ser embutido.** `frame-src :: https://www.google.com` é a
   mesma trava que a pendência 1 de `ESTADO-REAL.md` descreve.

Detalhe que agrava: `deploy/_headers` **tem** o `connect-src` correto, com
`https://*.google-analytics.com` e `https://*.analytics.google.com`. O arquivo do
repositório está certo e não tem efeito, porque a regra do painel Cloudflare o
sobrepõe. A correção não é de código. É de painel.

---

## 4. Os eventos que existem, medidos um a um

Três eventos, contra os quinze que `docs/EVENTS_TRACKING_PLAN.md` declara.

| Evento | Dispara? | Carga medida |
|---|---|---|
| `whatsapp_click` | sim | `{event, pagina, tipo, rotulo, destino:'recepcao', posicao}` |
| `form_submit` | sim | `{event, pagina, tipo, formulario}` |
| `match_resultado` | sim | `{event, pagina, tipo, bloco, indicados, total}` |

Exemplos literais capturados do `dataLayer`:

```json
{"event":"whatsapp_click","pagina":"home","tipo":"institucional","rotulo":"agendar","destino":"recepcao","posicao":"cabecalho"}
{"event":"form_submit","pagina":"mentorias.html","tipo":"institucional","formulario":"newsletter"}
{"event":"match_resultado","pagina":"qual-profissional-procurar.html","tipo":"institucional","bloco":"saúde capilar","indicados":"Danusa,Yale,Viviane,Susan,Larissa","total":5}
```

O `match_resultado` é o ponto alto da camada: o termo de saúde que a pessoa
digitou não aparece em lugar nenhum do evento, só o bloco de queixa entendido.
A decisão está documentada em `scripts/medicao.mjs:137` e foi confirmada em
execução.

### Eventos ausentes, todos verificados por interação real

| Ação testada no navegador | Eventos novos no `dataLayer` |
|---|---|
| rolar até o fim da home | 0 |
| clicar no link do Instagram do rodapé | 0 |
| abrir a ficha de um profissional | 0 |
| chegar com `?utm_source=...&gclid=...` | 0 |
| clique em telefone | impossível: 0 links `tel:` em todo o deploy |

Da matriz de `EVENTS_TRACKING_PLAN.md`, faltam doze:
`form_submit_attempt`, `form_submit_success`, `form_submit_error`,
`newsletter_subscribe`, `agendar_avaliacao`, `phone_click`, `contact_click`,
`instagram_click`, `professional_view`, `outbound_click`, `campaign_landing`,
`scroll_depth`, `engaged_time` e `funnel_*`. O documento descreve um projeto
Astro que não está no ar, e diz que a implementação está em
`src/scripts/analytics-events.ts`, arquivo que não gera nada do que é publicado.
Como descrição do site real, o documento é **falso**.

`docs/GTM-DATA-INTENTS.md` descreve cerca de 90 valores de `data-intent` e
instrui a montar os gatilhos do GTM sobre esse atributo. **Zero ocorrências de
`data-intent` no deploy.** Qualquer gatilho montado a partir desse documento
nunca dispara.

### Defeito 1: o parâmetro `formulario` está sempre errado

A classificação em `scripts/medicao.mjs:131` é:

```js
var tipo = f.querySelector('input[type=email]') && !f.querySelector('input[type=tel]')
  ? 'newsletter' : 'lead';
```

Medido: **`type="tel"` tem 0 ocorrências em todo o `deploy/`.** O ramo `lead` é
código morto. Os três formulários foram enviados no navegador e os três
produziram o mesmo valor:

| Formulário | `formulario` medido | O que é de verdade |
|---|---|---|
| `/mentorias` (nome, e-mail, formação, interesse, mensagem) | `newsletter` | lead B2B |
| `/sublocacao` (nome, e-mail, classe, uso, mensagem) | `newsletter` | lead B2B |
| rodapé (só e-mail) | `newsletter` | assinatura |

O único parâmetro que diferenciava lead de assinatura não diferencia nada.

### Defeito 2: cada envio de formulário infla o `whatsapp_click`

O handler de `conversao.mjs` cria uma âncora oculta para `wa.me` e clica nela.
A delegação de clique captura essa âncora sintética. Medido em `/mentorias` e em
`/sublocacao`, cada envio produz **dois** eventos:

```json
{"event":"form_submit","pagina":"sublocacao.html","formulario":"newsletter"}
{"event":"whatsapp_click","pagina":"sublocacao.html","rotulo":"","posicao":"corpo"}
```

Se `whatsapp_click` virar conversão no GA4, como `PENDENCIAS-DO-DONO.md` orienta
no passo 4, o envio de formulário conta duas vezes.

### Defeito 3: os cliques de WhatsApp não são distinguíveis entre si

O evento só carrega `posicao` (cabeçalho, rodapé ou corpo) e `rotulo` (60
primeiros caracteres do texto do link). Contagem de colisões da chave
`posicao|rotulo`:

| Página | CTAs `wa.me` | Chaves distintas | Colisões |
|---|---|---|---|
| `/` | 6 | 4 | 2 |
| `/especialidades/medicina/` | 6 | 5 | 1 |
| `/profissionais/gustavo-gehrke/` | 6 | 5 | 1 |
| `/localizacao` | 8 | 6 | 2 |

O botão flutuante, que a estratégia chama de canal principal, sai com
`rotulo: ""` e `posicao: "corpo"`. É indistinguível de qualquer outro CTA sem
texto no corpo. Não dá para responder "o botão flutuante converte mais que o CTA
de fim de página" com o dado que existe.

### Defeito 4: a dimensão `pagina` está fragmentada

O contexto usa `location.pathname`. Medido: os eventos saem com
`pagina: "mentorias.html"` e `pagina: "sublocacao.html"`. Mas o `canonical` e o
sitemap dessas páginas são `/mentorias` e `/sublocacao`, sem extensão. E a
navegação interna da home usa `.html` em 52 dos 71 links internos.

Quem chega do Google cai na URL limpa; quem navega dentro do site cai na URL com
`.html`. A mesma página gera dois valores na mesma dimensão, e nenhum relatório
de "página que mais converte" fecha.

### Defeito 5: quem sai antes de 4 segundos nunca é contado

O GTM só carrega no primeiro gesto (`pointerdown`, `keydown`, `scroll`,
`touchstart`) ou 4 s após o `load`. Medido em visitante passivo:

```
t≈1s  gtm carregado = false
t≈2s  gtm carregado = false
t≈3s  gtm carregado = false
t≈4,2s gtm carregado = true
```

Não há nenhum `page_view` empurrado no `dataLayer` antes disso. Quem abre e
fecha em menos de 4 s sem tocar em nada é invisível. Justamente o tráfego que
mais importa enxergar em mídia paga, o de baixa qualidade, é o que não aparece.

### Defeito 6: as 29 páginas sem medição são exatamente as de tráfego legado

28 páginas-ponte (`/ecooa-med`, `/quem-somos`, `/contato`, `/match`,
`/para-profissionais`, 16 rotas `/especialidade/*`, entre outras) e a `404.html`
não têm o bloco de medição. É onde caem backlinks antigos, o link antigo do
Instagram e o link antigo que o Google Business Profile porventura ainda tenha.

Pior: a ponte é `<meta http-equiv="refresh">` mais `location.replace`, ambos
same-origin. O destino recebe `document.referrer` apontando para o próprio
domínio. O GA4 descarta auto-referência, e a origem externa vira `direct/none`.
Todo o tráfego de URL legada é atribuído a "direto" e some.

---

## 5. Atribuição e ROI: não existe

Medido em `/?utm_source=instagram&utm_medium=bio&utm_campaign=teste&gclid=XYZ`:

```json
{"temUtmNoDL": false, "sessionKeys": [], "localKeys": []}
```

Nenhum push, nenhuma persistência em `sessionStorage`, nenhuma em
`localStorage`. Zero `utm_` em qualquer link do deploy. Nenhum `gclid`, `fbclid`
ou `wbraid` é lido, guardado ou repassado.

E o lead, por definição da própria estratégia, é uma conversa no WhatsApp. Os
484 links `wa.me` do site produzem **64 mensagens distintas**, e elas são boas
como contexto humano:

```
"Olá! Vim pelo site da ecooa, li o perfil de Gustavo Gehrke e gostaria de agendar uma consulta de metabolismo, emagrecimento e hormônios."
"Olá! Li o texto "Menopausa e terapia hormonal: o que se sabe hoje" no site da ecooa e gostaria de agendar uma consulta com Gustavo Gehrke, que assina o texto."
"Olá! Vim pelo site da ecooa e gostaria de agendar uma avaliação em tricologia. Qual profissional a equipe me indica para o meu caso?"
```

A recepcionista consegue inferir a página de origem lendo a frase. Nenhuma
máquina consegue. Não viaja campanha, canal, `gclid`, nem um identificador
opaco de sessão que permitisse casar a conversa com a visita. Uma mensagem vazia
(`text=` sem conteúdo) também existe, no botão flutuante.

**Resumo do funil hoje:**

| Etapa | Medida? |
|---|---|
| impressão / clique no anúncio | não, não há mídia paga instrumentada |
| chegada com campanha | não, UTM não é lido |
| visita | só depois de 4 s ou do primeiro gesto, e só se o transporte existisse |
| intenção (clique de WhatsApp) | evento existe, com colisão de rótulo, e não sai do navegador |
| lead (conversa iniciada) | não medido, o WhatsApp não devolve nada |
| agendamento | não medido |
| comparecimento | não medido |
| receita | não medido |

Não existe caminho, nem parcial, entre um real gasto e um paciente atendido.

---

## 6. Consentimento e LGPD

O que foi medido:

- `dataLayer` nasce com `consent default` e tudo negado, inclusive
  `analytics_storage`. Correto para Consent Mode v2.
- O aviso aparece na primeira visita, com `recusar` e `aceitar` do mesmo peso.
- `aceitar` grava `ecooa-consentimento=aceito` e empurra `consent update` com
  `analytics_storage: granted`. Os três estados de anúncio permanecem negados.
- O termo de saúde do `ecooa.match` não é enviado. Confirmado em execução.
- `<meta name="referrer" content="strict-origin-when-cross-origin">` presente.

Duas ressalvas medidas:

1. **`recusar` carrega o GTM assim mesmo.** Medido:
   `{"consent":"recusado","gtm":true}` com requisição efetiva a
   `googletagmanager.com/gtm.js?id=GTM-TSR4GDMK`. É comportamento previsto pelo
   Consent Mode v2, e defensável, mas o visitante que clicou "recusar" continua
   baixando o contêiner. Vale estar escrito nas políticas, e não está.
2. **Não há como trocar a decisão depois.** O comentário de
   `scripts/medicao.mjs:14` afirma que "a decisão pode ser trocada depois pelo
   rodapé". Medido em `/politicas`: nenhum botão, nenhum link que reabra o aviso.
   A única revogação oferecida é escrever um e-mail. A promessa do código não
   existe na página.

---

## 7. Prontidão para Google Business Profile e busca local

### O que está pronto e foi verificado

| Sinal | Estado medido |
|---|---|
| NAP em texto | idêntico nas 67 páginas reais: `Rua Mariante, 180 · 9º andar`, `Porto Alegre, RS · 90430-180`, `(51) 99146-0909` |
| Horário em texto | `Segunda a sexta, 8h às 20h` nas 67 páginas |
| Página de localização | existe, com endereço, horário, contato, "como chegar" a pé e de carro, acessibilidade e referências de bairro (Rua Padre Chagas, Praça Japão) |
| `MedicalClinic` completo | 3 páginas (`/`, `/sobre`, `/localizacao`) com `address`, `telephone`, `email`, `openingHoursSpecification`, `areaServed`, `sameAs`, `hasMap`, 8 `availableService` |
| `Person` por profissional | 31 páginas, com `identifier` do registro e `worksFor` |
| Cidade no `title` | 47 de 67 |
| Cidade na `description` | 46 de 67 |
| Bairro na `description` | 43 de 67 |

O NAP em texto é o item mais bem resolvido de toda esta dimensão. Está pronto
para o pareamento, desde que o perfil do Google use exatamente essa grafia.

### O que falta, medido

| Lacuna | Número |
|---|---|
| `GeoCoordinates` (latitude/longitude) | 0 páginas |
| `priceRange` | 0 páginas |
| `aggregateRating` ou `review` | 0 páginas |
| mapa embutido (`<iframe>`) | 0 em todo o deploy |
| link para o perfil do Google (`g.page`, `maps/place`, `?cid=`) | 0 |
| depoimento ou avaliação em texto | 0 |
| `google-site-verification` ou equivalente no HTML | 0 |
| bairro no `title` | 6 de 67 |

`/localizacao` oferece apenas "abrir no mapa", que aponta para uma URL de
**busca** (`maps/search/?api=1&query=...`), não para o `place` da ficha. URL de
busca não consolida entidade. E, mesmo que um `iframe` fosse adicionado, a CSP
de produção o bloquearia hoje (`frame-src :: https://www.google.com`, medido).

A ausência de `geo` está declarada como decisão consciente em
`PENDENCIAS-DO-DONO.md` (coordenada chutada atrapalha o pareamento). É uma boa
decisão e continua sendo uma lacuna: sem a coordenada, o schema não ajuda o
pareamento com o pino do mapa.

### NAP divergente dentro do próprio schema

Este é um defeito, não uma lacuna. Valores de `streetAddress` em todo o deploy:

```
31  "streetAddress":"Rua Mariante, 180"
 3  "streetAddress":"Rua Mariante, 180, 9º andar"
```

As 31 páginas de perfil emitem, dentro de `worksFor`, um `MedicalClinic`
**sem `@id`**, sem `postalCode` e sem `telephone`, com o endereço em grafia
diferente da canônica:

```json
{"@type":"MedicalClinic","name":"ecooa","url":"https://www.somosecooa.com.br/",
 "address":{"@type":"PostalAddress","streetAddress":"Rua Mariante, 180",
 "addressLocality":"Porto Alegre","addressRegion":"RS","addressCountry":"BR"}}
```

Sem `@id` apontando para `https://www.somosecooa.com.br/#clinica`, são 31 cópias
soltas da mesma clínica, com endereço parcialmente diferente das 3 canônicas.
Divergência de NAP dentro do próprio site é exatamente o que derruba
ranqueamento local, e aqui ela é gerada pelo próprio build.

### Os dois artigos geolocalizados não citam a cidade no title

`blog/rejuvenescimento-facial-porto-alegre/` e
`blog/transplante-capilar-porto-alegre/` têm a cidade no slug e nenhum dos dois
a tem no `<title>`:

```
Rejuvenescimento facial sem perder a expressão · editorial ecooa
Transplante capilar: quem tem indicação e quem não tem · editorial ecooa
```

Nenhum dos 14 artigos tem cidade ou bairro no `title`. São as consultas de maior
intenção comercial local do editorial inteiro.

---

## 8. Documentos contra a realidade publicada

| Documento | O que afirma | Realidade medida | Veredito |
|---|---|---|---|
| `EVENTS_TRACKING_PLAN.md` | 15 eventos, implementados em `analytics-events.ts` e `form-submit.ts`, conversão em `/obrigado` | 3 eventos, implementados em `scripts/medicao.mjs`; `/obrigado` não existe no deploy | **falso** como descrição do site no ar |
| `EVENTS_TRACKING_PLAN.md` §1 | `form_submit_success` já é empurrado, falta só a tag no GTM | o evento não existe em lugar nenhum do deploy | **falso** |
| `GTM-DATA-INTENTS.md` | ~90 valores de `data-intent`, gatilho do GTM sobre o atributo | 0 ocorrências de `data-intent` no deploy | **falso**, e perigoso: quem seguir o documento monta gatilhos mortos |
| `GTM-DATA-INTENTS.md` | rotas `/ecooa-med`, `/ecooa-mind`, `/ecooa-working`, `/obrigado`, `/para-profissionais` | todas são páginas-ponte de redirecionamento hoje | **obsoleto** |
| `PENDENCIAS-DO-DONO.md` Bloqueio 2 | camada instalada, falta criar as tags no GTM | verdadeiro, e **incompleto**: mesmo com as tags criadas nada sairia, por causa da CSP sem `connect-src` |
| `PENDENCIAS-DO-DONO.md` Bloqueio 3 | site preparado para o pareamento com o GBP | parcialmente verdadeiro: NAP em texto sim, mas 31 páginas emitem NAP divergente no schema |
| `ESTADO-REAL.md` §5 pend. 1 | `frame-src` bloqueia o mapa de `/localizacao` | verdadeiro e confirmado, e o mesmo `frame-src` bloqueia o Preview do GTM |
| `scripts/medicao.mjs:14` | a decisão de consentimento "pode ser trocada depois pelo rodapé" | não existe controle nenhum para trocar | **falso** |

---

## 9. Achados por severidade

| # | Sev. | Achado | Onde | IA resolve? |
|---|---|---|---|---|
| 1 | crítico | CSP de produção sem `connect-src`: todo hit do GA4 é bloqueado. A camada de medição existe e entrega zero dado | painel Cloudflare (`deploy/_headers` já está correto) | não |
| 2 | crítico | Nenhuma tag configurada dentro de `GTM-TSR4GDMK`: nenhum `G-` no HTML, nenhuma propriedade GA4 conhecida | painel do GTM | não |
| 3 | crítico | Zero captura de UTM, `gclid` ou `fbclid`, e nada de origem viaja para o WhatsApp: ROI de aquisição é impossível de calcular | `scripts/medicao.mjs` | sim |
| 4 | crítico | Google Business Profile não reivindicado, sem avaliações, sem coordenada geográfica em nenhuma página | fora do repositório | não |
| 5 | alto | `frame-src` ausente: Preview do GTM e Tag Assistant não funcionam em produção, então o dono não consegue validar nada | painel Cloudflare | não |
| 6 | alto | `form_submit` sempre reporta `formulario: "newsletter"`; `type="tel"` tem 0 ocorrências, o ramo `lead` é código morto | `scripts/medicao.mjs:131` | sim |
| 7 | alto | Envio de formulário gera `whatsapp_click` sintético com `rotulo: ""`, inflando a conversão principal | `scripts/medicao.mjs:114` + `scripts/conversao.mjs:95` | sim |
| 8 | alto | Cliques de WhatsApp colidem: 6 CTAs da home viram 4 chaves; o botão flutuante sai sem rótulo | `scripts/medicao.mjs:118` | sim |
| 9 | alto | Dimensão `pagina` fragmentada: eventos com `mentorias.html`, canonical `/mentorias`, 52 links internos com `.html` | `scripts/medicao.mjs:94` | sim |
| 10 | alto | 12 dos 15 eventos planejados não existem; sem `scroll_depth`, `engaged_time`, `professional_view`, `instagram_click`, `outbound_click` | `scripts/medicao.mjs` | sim |
| 11 | alto | 29 páginas sem medição (28 pontes + 404), justamente as de tráfego legado; o redirecionamento same-origin apaga a origem externa | `scripts/medicao.mjs:220` | sim |
| 12 | alto | Zero links `tel:` no site; telefone só como texto em 69 páginas, sem clique e sem evento em mobile | pós-processadores | sim |
| 13 | médio | NAP divergente no schema: 31 perfis com `Rua Mariante, 180` sem `@id`, sem CEP e sem telefone, contra `Rua Mariante, 180, 9º andar` nas 3 canônicas | `scripts/estruturados.mjs` | sim |
| 14 | médio | Visitante que sai antes de 4 s sem gesto nunca é contado; não há `page_view` no `dataLayer` | `scripts/medicao.mjs:90` | sim |
| 15 | médio | Sem `geo`, sem `priceRange`, sem `aggregateRating`, sem `review` em nenhuma página; `hasMap` aponta para URL de busca, não de `place` | `scripts/estruturados.mjs` | parcial |
| 16 | médio | Nenhum mapa embutido no site (0 `<iframe>` no deploy) | `src-site-3/` + painel Cloudflare | parcial |
| 17 | médio | Bairro no `title` em 6 de 67 páginas; os 14 artigos não têm cidade nem bairro, inclusive os dois com `porto-alegre` no slug | `scripts/artigos.mjs` | sim |
| 18 | médio | `recusar` carrega o GTM assim mesmo, e não há UI para trocar a decisão, ao contrário do que o código promete | `scripts/medicao.mjs:14` | sim |
| 19 | médio | `EVENTS_TRACKING_PLAN.md` e `GTM-DATA-INTENTS.md` descrevem eventos e atributos que não existem; quem seguir monta gatilhos mortos | `docs/` | sim |
| 20 | baixo | CSP libera `*.clarity.ms` e `connect.facebook.net` em `script-src` sem nenhum uso, e os bloquearia em `connect-src` se fossem usados | painel Cloudflare | não |
| 21 | baixo | Nenhuma tag de verificação de propriedade no HTML; se a Search Console está verificada, é por DNS e não dá para conferir daqui | `deploy/` | parcial |
| 22 | baixo | 472 KB agregados de script de medição inline (7.334 B × 66 páginas) entregando zero dado hoje | `scripts/medicao.mjs` | sim |
| 23 | baixo | Sitemap com `lastmod` idêntico (2026-07-31) nas 62 URLs, sem `priority` nem `changefreq` | `scripts/sitemap.mjs` | sim |

---

## 10. O que falta para medir ROI de aquisição

Em ordem de dependência. Nada abaixo do item 3 tem valor enquanto 1 e 2 não
estiverem resolvidos.

1. **Liberar `connect-src` na regra de CSP do painel Cloudflare**, ou assumir o
   `deploy/_headers`, que já está correto. Sem isso, todo o resto é decoração.
   Precisa incluir `https://*.google-analytics.com`, `https://*.analytics.google.com`
   e `https://www.googletagmanager.com`. E `frame-src https://www.googletagmanager.com`
   para o Preview funcionar.
2. **Criar a propriedade GA4 e as tags no contêiner `GTM-TSR4GDMK`**, com
   gatilhos de evento personalizado para `whatsapp_click`, `form_submit` e
   `match_resultado`, e marcar as conversões. Só o dono pode.
3. **Consertar o `formulario`** para distinguir lead de assinatura por um
   identificador estável do formulário, não pela presença de `input[type=tel]`.
4. **Dar identidade a cada CTA de WhatsApp**, com um atributo estável no HTML
   (o `data-intent` que `GTM-DATA-INTENTS.md` já especifica e que não existe),
   para separar botão flutuante, hero, CTA de perfil e CTA de fim de página.
5. **Ler e persistir `utm_*`, `gclid` e `fbclid` na chegada**, gravar em
   `sessionStorage`, empurrar um `campaign_landing` e anexar a origem a todo
   evento de conversão.
6. **Levar um identificador de origem para dentro da conversa do WhatsApp**, por
   exemplo um código curto no fim do texto (`ref: IG-BIO-A3F`), que a recepção
   registre. É o único jeito de fechar a ponte entre a visita e o lead sem
   backend, e depende de combinar o processo com a recepção.
7. **Normalizar a URL** para que a dimensão `pagina` tenha um valor por página,
   resolvendo o conflito entre links internos com `.html` e canonical sem.
8. **Instrumentar as 28 pontes e a 404**, para enxergar quanto tráfego ainda
   chega por URL antiga e de onde.
9. **Definir o que é um lead qualificado** e devolver esse dado ao GA4, por
   importação de conversão offline ou por planilha de recepção. Sem isso, a
   métrica para no clique e nunca chega em paciente.
10. **Reivindicar o Google Business Profile**, com o NAP idêntico ao do site,
    coordenada exata, categorias, fotos e política de avaliação compatível com o
    CFM. É o maior fator isolado de busca local para uma clínica, e hoje está em
    zero.
11. **Verificar o domínio na Search Console** e ligar a integração com o GA4,
    para separar o que é busca orgânica do que é direto.

---

## 11. O que não foi possível medir daqui, e por quê

| O que | Por quê |
|---|---|
| Conteúdo do contêiner `GTM-TSR4GDMK`: quantas tags, quais gatilhos, se está publicado | o proxy do ambiente devolve 403 em `CONNECT www.googletagmanager.com`. Nenhuma requisição externa ao Google completa. `window.google_tag_manager` fica `undefined` no laboratório por esse motivo, não por defeito do site |
| Se existe propriedade GA4 e qual o ID | não há `G-` no HTML e o painel não é acessível |
| Se a Search Console está verificada e com o sitemap enviado | não há tag de verificação no HTML; verificação por DNS não é observável daqui |
| Se o Google Business Profile existe, está reivindicado, com quantas avaliações | fora do repositório e fora do alcance da rede |
| Se `/mentorias` sem extensão responde 200 em produção | o laboratório é um `SimpleHTTPServer` que não resolve URL sem extensão; a ponte `/ecooa-med` redireciona para `/especialidades` e cai em erro no laboratório. Comportamento do GitHub Pages e da Cloudflare não é observável daqui |
| Se o GA4 usaria fallback por imagem quando o `sendBeacon` é bloqueado | `img-src` permite `https:`, então em tese um pixel passaria. Medido: o `sendBeacon` retorna `true` mesmo bloqueado, o que remove o sinal de falha que dispararia o fallback. Sem o container real não dá para confirmar o comportamento fim a fim |
| Volume real de tráfego, origem, taxa de conversão, custo por lead | não existe histórico. O site nunca mediu nada |
| Consistência do NAP em diretórios externos (Doctoralia, Apple Maps, Bing Places) | rede externa bloqueada |

---

## 12. Justificativa da nota

**26/100.**

Uma dimensão que se chama "analytics e aquisição" tem que responder a uma
pergunta: de onde vem paciente. Hoje o site não responde a nenhuma versão dessa
pergunta, nem aproximada. A CSP bloqueia o transporte, medido; o contêiner não
tem tag, documentado pelo próprio projeto; a UTM não é lida, medido; o WhatsApp
não devolve nada, medido; e o Google Business Profile, que para uma clínica de
bairro pesa mais que o site inteiro, não está reivindicado.

Os pontos que a nota reconhece são concretos e foram verificados em execução:
instrumentação presente em 66 de 95 páginas, Consent Mode v2 com tudo negado por
padrão, três eventos com contexto de página, perfil e área, o termo de saúde
comprovadamente fora do evento, e um NAP em texto idêntico nas 67 páginas reais.
Isso é fundação de qualidade, e é o que separa 26 de 5.

O que a nota castiga é a distância entre a fundação e o resultado. Dos três
eventos que existem, um reporta um valor sempre errado, outro colide consigo
mesmo em quatro páginas de quatro testadas, e nenhum dos dois sai do navegador.
Doze dos quinze eventos planejados não existem. Dois documentos de `docs/`
descrevem uma instrumentação que não está no ar e induziriam quem os seguisse a
montar gatilhos que nunca disparam. E o próprio build gera divergência de NAP em
31 das 62 URLs do sitemap, contra a regra que a documentação do projeto define
como inegociável para busca local.
