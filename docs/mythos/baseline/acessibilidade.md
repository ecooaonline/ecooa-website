# Baseline de Acessibilidade WCAG (P09) · ecooa-website

> Auditoria do **estado atual** do site publicado (`deploy/`), servido em
> `http://localhost:4353` com a CSP de produção. Data da medição: 2026-08-01.
> Escopo: as **31 URLs do `deploy/sitemap.xml`** (9 raiz + 8 especialidades +
> 14 artigos), mais `/politicas` e `/404` como verificação complementar.
>
> Este documento mede. Não altera nenhum arquivo do site.
>
> **Nota da dimensão: 52/100.**

---

## 1. Método

| Ferramenta | Versão | Como foi usada |
|---|---|---|
| axe-core | 4.12.1 | injetado via Playwright em cada uma das 31 URLs, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`. Rodado duas vezes: desktop 1366x900 e mobile 390x844 |
| Playwright (chromium-1194) | playwright-core 1.62.1 | navegação real por teclado (`Tab`, `Enter`, `Escape`, `ArrowDown`), leitura do DOM computado, `Accessibility.getFullAXTree` via CDP |
| Lighthouse | do repositório (`node_modules/.bin/lighthouse`) | categoria `accessibility` em 7 páginas, para cruzar com a alegação de "100" da documentação |
| sharp | do repositório | amostragem de pixel em capturas de tela para medir o contraste real do anel de foco e do realce do autocomplete, onde o CSS computado não basta |

Scripts da auditoria em
`/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/a11y/`
(`run-axe.mjs`, `manual.mjs`, `keyboard.mjs`, `keyboard2.mjs`, `deep.mjs`,
`focus2.mjs`, `autocomplete.mjs`, `extras.mjs`, `zoom.mjs`, `last.mjs`).

O domínio real não é alcançável deste ambiente. Tudo foi medido no laboratório
local sobre os mesmos bytes que vão para produção.

---

## 2. Números medidos

### 2.1 axe-core nas 31 URLs

Resultado **idêntico** em desktop e mobile.

| Impacto | Nós com violação | Regras distintas |
|---|---|---|
| critical | **0** | 0 |
| serious | **4** | 1 (`color-contrast`) |
| moderate | **481** | 2 (`region`, `landmark-one-main`) |
| minor | **0** | 0 |

- Páginas **sem nenhuma** violação: **0 de 31**.
- `region` (*All page content should be contained by landmarks*): 31 páginas, 451 nós.
- `landmark-one-main`: 30 páginas, 30 nós. `/localizacao` escapou por peculiaridade
  da regra do axe; a checagem direta de DOM mostra `<main>` = 0 também nela.
- `color-contrast`: 2 páginas (`/` e `/sublocacao`), 4 nós, ratio medido **3,54:1**
  contra os 4,5:1 exigidos (`#c6c4bf` sobre `#63615c`, 11px e 13px).
- **`color-contrast` indeciso (`incomplete`): 30 a 71 nós por página.** O axe não
  consegue decidir quando há imagem de fundo ou `backdrop-filter`. Ou seja, boa
  parte da paleta do site **nunca foi verificada por ferramenta automática**.

### 2.2 Estados que a varredura padrão não alcança

A varredura de 31 URLs mede o **estado inicial** de cada página. Testando o
estado de resultado da busca em `/qual-profissional-procurar` (após submeter
"dor nas costas"):

- **+5 nós `color-contrast` serious**, ratio **3,28:1** (`#8c8a84` sobre
  `#faf9f7`, 13px), exigido 4,5:1.

Isso significa que o total real de violações serious do site é maior que 4.
Estados abertos por JavaScript (modal, submenus, resultado de busca, filtros)
não estão cobertos por nenhuma medição recorrente.

### 2.3 Lighthouse (categoria Accessibility)

| Página | Score | Auditorias reprovadas |
|---|---|---|
| `/` | **93** | `color-contrast`, `landmark-one-main` |
| `/sublocacao` | **94** | `color-contrast`, `landmark-one-main` |
| `/profissionais` | **98** | `landmark-one-main`, `label-content-name-mismatch` |
| `/especialidades/medicina/` | **98** | `landmark-one-main`, `label-content-name-mismatch` |
| `/qual-profissional-procurar` | **98** | `landmark-one-main` |
| `/mentorias` | **98** | `landmark-one-main` |
| `/blog/longevidade-saudavel/` | **98** | `landmark-one-main` |

Nenhuma página atinge 100. O Lighthouse ainda deixa **10 itens como "manual"**
(`logical-tab-order`, `focus-traps`, `managed-focus`, `use-landmarks`,
`custom-controls-labels`, `custom-controls-roles`, entre outros) e **45 de 76
auditorias como `notApplicable`**. O score não é evidência de conformidade.

### 2.4 Verificação manual por script, agregada nas 31 páginas

| Item | Medido | Situação |
|---|---|---|
| `lang="pt-BR"` no `<html>` | 31/31 | ok |
| `<h1>` único por página | 31/31 | ok |
| Pulo de nível de heading (h2 → h4) | 0 páginas | ok |
| `<header>` / `<nav>` / `<footer>` | 31/31 | ok |
| **`<main>` ou `role="main"`** | **0 de 31** | **falha** |
| **Skip link** | **0 de 31** | **falha** |
| `<section>` com nome acessível | **0 de 126** | falha (best practice) |
| Imagens com atributo `alt` | 215 de 215 | ok |
| `alt=""` (decorativo) | 32 | correto: retratos dentro de `<button>` com `aria-label` |
| SVGs sem rótulo nem `aria-hidden` | 0 de 141 | ok |
| Interativos visíveis sem nome acessível | **0 de 1278** | ok |
| Campos de formulário sem rótulo acessível | **1 de 20** | falha (`#ec-queixa`) |
| Campos só com placeholder | 1 | falha |
| **Campos sem `autocomplete`** | **15 de 20** | **falha (1.3.5)** |
| `required` sem `aria-required` | 13 | aceitável (nativo já expõe), mas sem reforço |
| **Regiões `aria-live` em todo o site** | **0** | **falha (4.1.3)** |
| `aria-expanded` | 156 | funciona; **125 sem `aria-controls`** |
| `aria-controls` apontando para id inexistente | 0 | ok |
| IDs duplicados | 0 | ok |
| `tabindex` positivo | 0 | ok |
| `target="_blank"` com `rel` | 299 de 299 | ok |
| Erros de console nas 31 páginas | 0 | ok |
| `<iframe>` sem `title` | 0 (não há iframe) | o mapa de `/localizacao` está bloqueado pela CSP, pendência do dono |
| Texto abaixo de 12px (nós folha) | 826 | não é violação WCAG, mas agrava o contraste |

### 2.5 Alvos de toque

| Critério | Resultado |
|---|---|
| Elementos abaixo de 44x44 (excluindo link inline) | **727** somando as 31 páginas |
| Elementos abaixo de 24x24 | **552** |
| **WCAG 2.2 SC 2.5.8 (AA, 24px) com a exceção de espaçamento aplicada** | **0 falhas reais** em 8 páginas testadas |

O site **passa** no critério AA de tamanho de alvo. Os alvos pequenos (setas de
submenu de 16x25, links de rodapé de 33x16) têm folga suficiente de espaçamento
para satisfazer a exceção. Os 44px pedidos são o critério **AAA (2.5.5)**, que o
site não cumpre em nenhuma página.

### 2.6 Reflow, zoom e movimento

| Critério | Medição | Situação |
|---|---|---|
| 1.4.10 Reflow a 320px | overflow horizontal = **0px** em 8 páginas | ok |
| Zoom de página 200% (viewport 683px) | overflow horizontal = **0px** | ok |
| 1.4.4 Texto a 200% | 0px de overflow, mas **31 cards do mosaico cortam 8px** do overlay nome + cargo (`overflow:hidden`, conteúdo 200px em caixa de 192px) | falha leve |
| 1.4.12 Espaçamento de texto | mesmos 31 cards cortam 8px | falha leve |
| `prefers-reduced-motion` | animação `ec-sobe` cai de `0.3s` para `1e-06s`; `scroll-behavior` cai de `smooth` para `auto` | ok, honrado |
| `forced-colors` (alto contraste do Windows) | **nenhuma regra `@media (forced-colors)`** no CSS; 6 elementos dependem de `background-image` | não tratado |

---

## 3. Navegação por teclado

### 3.1 Ordem de foco geral

Medida com `Tab` real a partir do documento, em `/`, `/profissionais` e
`/blog/longevidade-saudavel/`:

- **14 pressionamentos de Tab para sair do cabeçalho**, em todas as páginas.
- Sem skip link e sem `<main>`, esse bloco se repete em cada uma das 31 páginas.
  Um usuário de teclado precisa atravessar 13 links e botões antes de chegar ao
  conteúdo, toda vez.
- A ordem visual acompanha a ordem do DOM. Não há `tabindex` positivo nem
  saltos ilógicos dentro do fluxo linear.

### 3.2 Submenus do cabeçalho

| Verificação | Resultado |
|---|---|
| `aria-expanded` alterna `false` → `true` no Enter | **sim**, medido |
| `Escape` fecha e devolve o foco ao botão | **sim**, medido |
| `aria-controls` no botão | **não** em 4 dos 5 (só o botão de menu mobile tem) |
| Painel com `role` (menu, listbox) ou `aria-labelledby` | **não** |
| Links do painel logo após o gatilho na ordem de foco | **não.** Com o submenu de "especialidades" aberto, os 12 Tabs seguintes percorrem todo o resto do cabeçalho; os links do painel só aparecem a partir do 10º Tab |

O submenu **funciona** por teclado, mas o conteúdo que aparece visualmente
colado ao gatilho está a 9 paradas de distância no foco. É problema de 2.4.3.

### 3.3 Menu mobile (390x844)

Correto. Botão 80x44, `aria-expanded` + `aria-controls="mob-painel"`, `Escape`
fecha, os 8 Tabs seguintes permanecem dentro do painel, itens de 350x52.

### 3.4 Modal de perfil (`/profissionais`, `/`, 8 páginas de especialidade)

Este é o componente mais bem construído do site. Medido em três páginas:

```
<div class="pf-pn" id="pf-pn" role="dialog" aria-modal="true"
     aria-labelledby="pf-nome" tabindex="-1">
```

| Verificação | Resultado |
|---|---|
| Abre por `Enter` a partir do card | sim |
| `role="dialog"` + `aria-modal="true"` + `aria-labelledby` | sim |
| Foco move para o painel ao abrir | sim (`#pf-pn`) |
| **Foco preso**: 12 Tabs consecutivos | **0 vazamentos**, ciclo fechado entre "Fechar perfil" e "agendar com X" |
| `Escape` fecha | sim |
| Foco devolvido ao card que abriu | sim, verificado em `/`, `/profissionais` e `/especialidades/medicina/` |
| Fundo com `inert` ou `aria-hidden` | **não** (`#dc-root` sem nenhum dos dois). Mitigado por `aria-modal="true"`, que leitores de tela modernos respeitam |

### 3.5 Autocomplete de vidro fosco (`/qual-profissional-procurar`)

Componente novo, implementado em `scripts/match.mjs` (função `campoBusca`,
linhas 243 a 320). É o pior ponto de acessibilidade do site.

| Verificação | Resultado medido |
|---|---|
| Rótulo do campo `#ec-queixa` | **nenhum**. Sem `<label for>`, sem `aria-label`, sem `aria-labelledby`, sem `title`. Só `placeholder` |
| `role="combobox"` no input | **não** |
| `aria-expanded` no input | **não** |
| `aria-controls` / `aria-owns` | **não** |
| `aria-autocomplete` | **não** |
| `role="listbox"` no painel | **não** (é um `<div>` sem role) |
| `role="option"` nos itens | **não** (são `<button>` sem role, sem `id`, sem `aria-selected`) |
| `aria-activedescendant` após `ArrowDown` | **não** |
| Região `aria-live` anunciando "3 sugestões" | **não** |
| `ArrowDown` / `ArrowUp` movem a seleção | sim, mas **só mudam a cor de fundo** |
| Contraste do realce de seleção | **1,2:1** medido em pixel (`#fefefc` → `#ebe9e4`). Falha 1.4.11, que exige 3:1 |
| `Enter` sobre item realçado ativa | sim |
| `Escape` fecha o painel | sim |
| Contraste do texto da sugestão sobre o vidro fosco | **9,55:1** medido em pixel. Este ponto está ok |
| **`Tab` do input para as sugestões** | **falha.** O código faz `campo.addEventListener('blur', function () { setTimeout(fecha, 140); })` e `fecha()` executa `painel.innerHTML = ''`. Ao dar Tab, o foco chega ao primeiro botão de sugestão e **140ms depois o elemento é removido do DOM**, jogando o foco no `<body>` |

Prova da última linha, medida:

```
painel antes do Tab: {"paineis":1,"itens":3,"display":"block"}
Tab imediato          -> foco: BUTTON "dor de cabeça frequente"
mesmo Tab, 400ms      -> foco: BODY   << o elemento focado sumiu do DOM
```

Consequência prática: um usuário de teclado que pressione Tab e faça qualquer
pausa humana normal perde o foco inteiro da página e volta ao topo do documento.
Um usuário de leitor de tela não recebe nenhum anúncio de que sugestões
apareceram, porque não há `aria-live`, `role="listbox"` nem
`aria-activedescendant`.

### 3.6 Resultado da busca

Após submeter "dor nas costas" com o botão "ver sugestão":

```
foco: BODY
regiões aria-live: 0
conteúdo do resultado: substitui a área principal
```

O conteúdo muda por completo, o foco cai no `<body>` e nada é anunciado.
Falha de 4.1.3 (Status Messages, AA) e de 2.4.3.

---

## 4. Formulários

`/mentorias` e `/sublocacao`, medidos campo a campo:

| Verificação | Resultado |
|---|---|
| `<label for>` associada a cada campo | **sim**, 5 de 5 em cada formulário, mais o campo de newsletter |
| `aria-required` em campos `required` | não (13 casos no site) |
| **`autocomplete`** em nome, e-mail e telefone | **não em nenhum campo** (15 no total). Falha 1.3.5 |
| `aria-describedby` para dica ou erro | não |
| `fieldset` / `legend` | 0 |
| Região de erro anunciável (`aria-live` / `role="alert"`) | **0 em todo o site** |
| Submeter vazio | validação nativa do navegador; foco vai ao primeiro campo inválido. Comportamento aceitável, mas o balão nativo não persiste e não há mensagem no DOM |

---

## 5. Contraste do indicador de foco

Medido de duas formas: analiticamente sobre os tokens e por amostragem de pixel
após `Tab` real, com varredura da faixa em volta do elemento.

Varredura do link "sobre" no cabeçalho, pixel a pixel da esquerda para a direita:

```
#eceae4 #eceae4 #edeae4 #eceae4 #eceae4 #eceae4 #eceae4 #eceae4 #eceae3
#c6c4bf #c6c4bf   <- o anel de foco
#eceae4 #eceae4 #edeae4   <- o offset de 3px
```

| Par | Ratio | Exigido (1.4.11) | Situação |
|---|---|---|---|
| Anel `#c6c4bf` sobre cabeçalho `#eceae4` | **1,45:1** | 3:1 | **falha** |
| Anel `#c6c4bf` sobre creme `#f0eee9` | **1,50:1** | 3:1 | **falha** |
| Anel `#c6c4bf` sobre claro `#fdfdfc` | **1,71:1** | 3:1 | **falha** |
| Anel do mosaico `#5c5a55` sobre `#faf9f7` | 6,55:1 | 3:1 | ok |
| Anel do mosaico `#5c5a55` sobre foto escura `#6b6660` | 1,21:1 | 3:1 | falha situacional |

O anel `#c6c4bf` é o padrão global: aparece em todos os links e botões do
cabeçalho, no CTA "agendar", nos links do rodapé e nos botões do autocomplete.
Ou seja, **o indicador de foco é praticamente invisível em todas as 31 páginas**.

`docs/ACCESSIBILITY_CHECKLIST.md` registra o problema de forma bem mais branda:
"Nos inputs de seção escura o contorno taupe fica ~2.9:1 (visível; AA 2.1 ok)".
A medição diz outra coisa: no fundo claro, que é o fundo dominante do site, o
anel fica em 1,45:1.

### 5.1 Foco obscurecido (2.4.11)

Em `/profissionais`, tabulando 45 vezes: 4 de 32 elementos fora do cabeçalho
ficam parcialmente atrás do cabeçalho fixo (77px de altura). O pior caso cobre
**4% da altura do alvo**. O SC 2.4.11 (Minimum, AA) exige que o alvo não fique
**totalmente** oculto, então isso **não é falha de AA**. Falha apenas o 2.4.12
(Enhanced, AAA). Registrado como achado baixo.

---

## 6. Governança: o que está sendo medido em CI

| Item | Estado real |
|---|---|
| axe-core ou pa11y no CI | **não existe**. Nenhuma referência em `.github/workflows/`, `package.json` ou `.husky/` |
| Lighthouse a11y no CI | existe, mas com `"categories:accessibility": ["warn", { "minScore": 0.9 }]` em `lighthouserc.json` e `lighthouserc.mobile.json`. **`warn` não bloqueia merge** |
| URLs medidas pelo Lighthouse CI | 9, definidas em `lighthouserc.json` |

Das 9 URLs configuradas:

| URL configurada | Existe em `deploy/`? | O que é |
|---|---|---|
| `/index.html` | sim | página real |
| `/blog/index.html` | sim | página real |
| `/ecooa-med/index.html` | sim | **ponte de 469 bytes** com `meta refresh` |
| `/ecooa-esthetic/index.html` | sim | ponte |
| `/match/index.html` | sim | **ponte de 529 bytes** |
| `/contato/index.html` | sim | **ponte de 454 bytes** |
| `/agendamento/index.html` | sim | **ponte de 454 bytes** |
| `/profissionais/index.html` | **não** | o publicado é `profissionais.html` |
| `/profissionais/gustavo-gehrke/index.html` | **não** | rota do projeto Astro, nunca publicada |

Resumo: o único portão automático de acessibilidade do projeto mede **2 páginas
reais das 31**, cinco stubs de redirecionamento sem conteúdo, duas URLs
inexistentes, e mesmo assim **não bloqueia** nada. As páginas com as piores
notas medidas (`/` com 93 e `/sublocacao` com 94) e a página do componente mais
problemático (`/qual-profissional-procurar`) ou não estão na lista ou passariam
pelo limiar de 0,9 sem alarme.

---

## 7. Comparação com `docs/ACCESSIBILITY_CHECKLIST.md`

O documento é datado de 2026-06-14 e descreve o projeto Astro em `src/`, não o
site publicado. Confrontado com a medição:

| Afirmação do checklist | Medição no site publicado | Veredito |
|---|---|---|
| "Estado: **100 a11y**" | Lighthouse entre **93 e 98** em 7 páginas | **falso** |
| "Landmarks (`header`/`nav`/`main`/`footer`), `main` único" | `<main>` = **0 em 31 páginas** | **falso** |
| "**Skip link:** `.skip-link` presente, aparece no foco" | **0 skip links em 31 páginas** | **falso** |
| "Foco visível universal" com anel taupe | anel existe, mas a **1,45:1** no fundo dominante | parcialmente falso |
| "Nenhum texto/CTA crítico abaixo de AA" | 4 nós a 3,54:1 no estado inicial, mais 5 a 3,28:1 no resultado da busca | **falso** |
| "Imagens: 100% com `alt` válido" | 215 de 215 com `alt` | **verdadeiro** |
| "SVGs decorativos com `aria-hidden` ou nome no pai" | 0 de 141 sem tratamento | **verdadeiro** |
| "Modais com gerência de foco; `Escape` fecha" | confirmado, foco preso e devolvido | **verdadeiro** |
| "Formulários: labels associadas" | verdadeiro em `/mentorias` e `/sublocacao`; **falso** em `#ec-queixa` | parcial |
| "zoom 200% sem overflow horizontal" | 0px de overflow medido | **verdadeiro** |
| "Touch targets adequados" | passa AA (2.5.8) pela exceção de espaçamento; não passa AAA | **verdadeiro para AA** |
| "axe automatizado: **DEC** (site já 100)" | premissa falsa; o gatilho declarado ("primeira regressão") nunca dispararia porque ninguém mede | **inválido** |
| "Roteiro de leitor de tela: pendência do dono" | continua pendente | **verdadeiro** |

O checklist tem seis afirmações centrais desmentidas pela medição. Ele descreve
outro site. Enquanto continuar sendo tratado como fonte de verdade de P09, vai
produzir decisões erradas.

---

## 8. Tabela de achados por severidade

| # | Sev. | Achado | Critério WCAG | Onde | Corrigível por IA |
|---|---|---|---|---|---|
| 1 | crítico | Nenhuma página tem `<main>` nem skip link. 14 Tabs de cabeçalho repetidos em cada página | 2.4.1 (A), 1.3.1 (A) | 31 de 31 páginas | sim |
| 2 | crítico | Autocomplete sem rótulo e sem semântica de combobox; `blur` destrói o painel em 140ms e joga o foco no `<body>` | 4.1.2 (A), 3.3.2 (A), 2.4.3 (A) | `scripts/match.mjs:243-320` | sim |
| 3 | alto | Anel de foco a 1,45:1 no fundo dominante, em todas as páginas | 1.4.11 (AA) | token `#c6c4bf`, global | sim |
| 4 | alto | Zero regiões `aria-live` no site. Resultado da busca e retorno de formulário não são anunciados | 4.1.3 (AA) | 31 páginas, `match.mjs`, `conversao.mjs` | sim |
| 5 | alto | Texto abaixo de AA: 4 nós a 3,54:1 no estado inicial, 5 nós a 3,28:1 no resultado da busca | 1.4.3 (AA) | `/`, `/sublocacao`, resultado de `/qual-profissional-procurar` | sim |
| 6 | alto | Nenhum portão automático de a11y. Lighthouse CI é `warn`, mede 2 páginas reais de 31, com 2 URLs inexistentes | governança | `lighthouserc*.json`, `.github/workflows/ci.yml` | sim |
| 7 | médio | 15 campos de formulário sem `autocomplete` | 1.3.5 (AA) | `/mentorias`, `/sublocacao`, newsletter em 11 páginas | sim |
| 8 | médio | Realce de seleção do autocomplete a 1,2:1 | 1.4.11 (AA) | `scripts/match.mjs`, função `pinta()` | sim |
| 9 | médio | `label-content-name-mismatch`: texto visível "ECOOA.MED · ECOOA.ESTHETIC" contra nome acessível "Ver o perfil de X" | 2.5.3 (A) | 31 cards em `/profissionais` e 8 páginas de especialidade | sim |
| 10 | médio | 451 nós de conteúdo fora de landmark; 0 de 126 `<section>` com nome acessível | 1.3.1 (A), best practice | 31 páginas | sim |
| 11 | médio | Submenu abre, mas seus links ficam a 9 paradas de Tab do gatilho | 2.4.3 (A) | `scripts/menus.mjs`, cabeçalho global | sim |
| 12 | médio | `docs/ACCESSIBILITY_CHECKLIST.md` afirma 100 a11y, `main` único e skip link presente. As três são falsas | governança | `docs/ACCESSIBILITY_CHECKLIST.md` | sim |
| 13 | baixo | 125 de 156 `aria-expanded` sem `aria-controls`; painéis de submenu sem `role` nem `aria-labelledby` | 4.1.2 (A), reforço | cabeçalho global | sim |
| 14 | baixo | Fundo do modal sem `inert` nem `aria-hidden` (mitigado por `aria-modal`) | 1.3.2, 2.4.3 | `scripts/mosaico.mjs` | sim |
| 15 | baixo | 31 cards do mosaico cortam 8px do overlay a 200% de texto e sob 1.4.12 | 1.4.4 (AA), 1.4.12 (AA) | home e `/profissionais` | sim |
| 16 | baixo | 4 de 32 elementos ficam até 4% atrás do cabeçalho fixo ao receber foco | 2.4.12 (AAA) | `/profissionais` | sim |
| 17 | baixo | Nenhuma regra `@media (forced-colors: active)`; 6 elementos dependem de `background-image` | 1.4.1, robustez | CSS global | sim |
| 18 | baixo | 727 alvos abaixo de 44px. Passa 2.5.8 (AA) pela exceção de espaçamento, falha 2.5.5 (AAA) | 2.5.5 (AAA) | 31 páginas | sim |

Nenhum achado exige painel externo, senha, DNS ou decisão jurídica. Todos são
correções de código no repositório.

---

## 9. O que passou, com evidência

Não é um site ruim de acessibilidade em tudo. O que está certo, e está bem
feito, medido:

- `lang="pt-BR"` em 31 de 31.
- `<h1>` único em 31 de 31, **zero** pulos de nível de heading em 31 de 31.
- 215 de 215 imagens com `alt`; os 32 `alt=""` são retratos dentro de `<button>`
  com `aria-label`, que é o uso correto.
- 141 SVGs, **zero** sem `aria-hidden` ou nome no elemento pai.
- **1278 elementos interativos visíveis, zero sem nome acessível** (confirmado
  pela árvore de acessibilidade do próprio Chromium via CDP).
- Zero violações `critical` do axe. Zero IDs duplicados, zero `tabindex`
  positivo, 299 de 299 `target="_blank"` com `rel`.
- Modal de perfil: `role="dialog"` + `aria-modal` + `aria-labelledby`, foco
  movido ao abrir, **0 vazamentos em 12 Tabs**, `Escape` fecha, foco devolvido
  ao card. Verificado em 3 páginas.
- Menu mobile: `aria-expanded` + `aria-controls`, `Escape` fecha, foco contido.
- Reflow a 320px e zoom de página a 200%: **0px** de overflow horizontal.
- `prefers-reduced-motion` honrado de verdade: animação de `0.3s` para `1e-06s`,
  `scroll-behavior` de `smooth` para `auto`.
- WCAG 2.2 SC 2.5.8 (tamanho de alvo, AA): **0 falhas reais** aplicando a
  exceção de espaçamento.
- Zero erros de console nas 31 páginas.

---

## 10. O que não foi possível medir

1. **Leitor de tela real (NVDA, VoiceOver, TalkBack).** Nenhum leitor de tela
   está disponível neste ambiente. Todas as conclusões sobre anúncio são
   inferidas da árvore de acessibilidade e da ausência de `aria-live`, não de
   escuta. O roteiro da seção 6 do `ACCESSIBILITY_CHECKLIST.md` continua sendo
   pendência humana e nunca foi executado.
2. **Contraste de 30 a 71 nós por página** que o axe marca como `incomplete`
   por causa de imagem de fundo ou `backdrop-filter`. Amostrei por pixel os
   casos mais críticos (anel de foco, item do autocomplete), mas não os
   centenas de textos sobre as fotos de hero. Isso exige inspeção visual caso a
   caso ou um amostrador de pixel por elemento, que não coube nesta fase.
3. **Comportamento no domínio real.** O proxy bloqueia
   `www.somosecooa.com.br`. Tudo foi medido no laboratório local. A CSP do
   painel da Cloudflare, que segundo `ESTADO-REAL.md` sobrepõe `_headers`, pode
   alterar o que carrega em produção.
4. **Mapa de `/localizacao`.** Está bloqueado pela CSP, então não há `<iframe>`
   para auditar. Quando o `frame-src` for liberado, o `title` do iframe e a
   navegação por teclado dentro dele precisam ser reavaliados.
5. **Ampliadores de tela e software de controle por voz** (ZoomText, Dragon,
   Voice Control). O achado 9 (2.5.3) é inferido do Lighthouse e da comparação
   texto visível contra nome acessível, não de teste com o software real.
6. **Usuários reais com deficiência.** Nenhuma auditoria automática ou por
   script substitui teste com pessoas. Isso não foi feito e não consta como
   planejado em nenhum documento do repositório.

---

## 11. Justificativa da nota: 52/100

O site tem uma base semântica genuinamente sólida: HTML nativo, 100% de `alt`,
1278 elementos interativos sem um único nome acessível faltando, um modal com
gerência de foco correta, reflow e reduced motion honrados, e zero violações
`critical` do axe. Isso vale pontos e foi medido.

Mas o placar cai por quatro razões objetivas:

1. **Falhas de nível A sistêmicas.** Ausência de `<main>` e de skip link nas 31
   páginas obriga 14 Tabs de cabeçalho a cada navegação. É 2.4.1 e 1.3.1
   reprovados em 100% do site.
2. **O indicador de foco a 1,45:1.** Afeta todo usuário de teclado em todas as
   páginas. Um anel que não se vê é o mesmo que não ter anel.
3. **O componente mais novo é o menos acessível.** O autocomplete de vidro
   fosco não tem rótulo, não tem semântica de combobox, não anuncia nada e
   perde o foco para o `<body>` em 140ms. Foi construído em 2026-08-01 e nasceu
   fora de conformidade.
4. **Nada disso é medido.** Não há axe no CI. O único portão é um `warn` de
   Lighthouse sobre 2 páginas reais de 31, com 2 URLs que nem existem. E a
   documentação oficial de P09 afirma "100 a11y", "`main` único" e "skip link
   presente". Três afirmações que a medição desmente. Um site que não mede não
   pode receber nota alta em acessibilidade, porque não tem como saber se
   regrediu.

52 é a nota de um site que fez o básico semântico bem e parou antes da
conformidade AA, sem instrumento para perceber que parou.
