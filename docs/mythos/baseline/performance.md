# Baseline P06: Performance e Core Web Vitals

Auditoria de medição do estado ATUAL. Somente leitura, nenhum arquivo do site foi alterado.

- Data da medição: 2026-08-01
- Alvo: `deploy/` servido em `http://localhost:4353` com a CSP de produção
- Auditor: agente Mythos P06 (baseline)
- Nota atribuída: **58/100**

---

## 1. Método

### Ferramentas e versões

| Ferramenta | Versão | Uso |
| --- | --- | --- |
| Lighthouse CLI | 13.4.1 | 18 execuções (11 mobile reais, 4 desktop, 2 réplicas de variância, 1 stub) |
| Chromium | 1194 (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) | motor do Lighthouse e do Playwright |
| playwright-core | do `node_modules` do projeto | `PerformanceObserver` (LCP real, CLS real), peso de rede, dimensões naturais vs renderizadas |
| sharp | do `node_modules` do projeto | recompressão de controle para quantificar desperdício de imagem |
| gzip -9 | sistema | estimativa do que um host com compressão entregaria |

### Comandos

```
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
node_modules/.bin/lighthouse http://localhost:4353/<pagina> \
  --quiet --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
  --output=json --output-path=<saida>.json [--preset=desktop]
```

Sem `--preset` o Lighthouse aplica o perfil mobile padrão: 412x823 @1.75 DPR,
throttling simulado de 4G lento (1638 kbps, RTT 150 ms) e CPU 4x mais lenta.

Os JSON brutos das 18 execuções ficaram em
`/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/lh/`
e não foram copiados para o repositório (a fase é somente leitura).

### Cobertura

11 páginas reais medidas em mobile (as 9 raízes do sitemap, mais uma de
especialidade e um artigo do blog), 4 delas também em desktop. As 31 URLs do
sitemap se resolvem em 4 arquétipos de página, e todos os 4 foram cobertos.

### Limites do laboratório, declarados de saída

O servidor local é um `SimpleHTTP/0.6 Python/3.11.15`. Ele **não envia
`Content-Encoding` nem `Cache-Control`**. Isso contamina dois sinais do
Lighthouse de forma previsível e mensurável:

- `document-latency-insight` acusa "No compression applied" em todas as páginas.
  Medi o delta: `deploy/index.html` tem 166.430 bytes crus e 24.708 bytes em
  gzip -9, ou seja, 85% de redução. Em 4G lento simulado (1638 kbps) a diferença
  no download do documento é de aproximadamente 810 ms para 120 ms.
- `cache-insight` pontua 0 em todas as páginas, com até 384 KiB sinalizados, pura
  e simplesmente porque o servidor de laboratório não manda TTL nenhum.

**Os números de LCP mobile abaixo carregam essa penalidade.** Onde ela é
relevante, o texto diz explicitamente. O que a compressão **não** explica é o
peso de imagem, que é idêntico comprimido ou não (WebP já é comprimido).

---

## 2. Números medidos

### 2.1 Lighthouse mobile, 11 páginas reais

| Página | perf | a11y | bp | seo | LCP | FCP | TBT | CLS | SI | peso inicial |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `index.html` | **91** | 93 | 100 | 100 | **3301 ms** | 1758 | 4 | 0 | 1758 | 444 KiB |
| `profissionais.html` | **96** | 98 | 100 | 100 | **2660 ms** | 1631 | 42 | 0 | 1631 | 492 KiB |
| `localizacao.html` | **95** | 100 | 100 | 100 | **2702 ms** | 1068 | 126 | 0 | 1068 | 324 KiB |
| `sublocacao.html` | 97 | 94 | 100 | 100 | **2627 ms** | 1217 | 3 | 0 | 1217 | 337 KiB |
| `mentorias.html` | 97 | 98 | 100 | 100 | 2476 ms | 1232 | 0 | 0 | 1232 | 275 KiB |
| `qual-profissional-procurar.html` | 98 | 98 | 100 | 100 | 2251 ms | 1452 | 2 | 0 | 1452 | 214 KiB |
| `blog.html` | 99 | 98 | 100 | 100 | 1950 ms | 1215 | 0 | 0 | 1215 | 166 KiB |
| `especialidades.html` | 100 | 98 | 100 | 100 | 1802 ms | 1011 | 0 | 0 | 1011 | 131 KiB |
| `especialidades/medicina/` | 99 | 98 | 100 | 100 | 1801 ms | 1191 | 0 | 0 | 1191 | 132 KiB |
| `sobre.html` | 100 | 98 | 100 | 100 | 1501 ms | 1278 | 0 | 0 | 1278 | 133 KiB |
| `blog/menopausa-tratamento-hormonal/` | 100 | 98 | 100 | 100 | 1621 ms | 1026 | 0 | 0 | 1026 | 202 KiB |

Em negrito: os 4 LCP que estouram o teto de 2500 ms do próprio
`docs/PERFORMANCE_BUDGET.md`. `mentorias.html` a 2476 ms fica 24 ms abaixo do teto,
dentro da margem de variância.

### 2.2 Lighthouse desktop, 4 páginas

| Página | perf | a11y | bp | seo | LCP | FCP | TBT | CLS | SI |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `index.html` | 100 | 93 | 100 | 100 | 722 ms | 401 | 47 | 0 | 480 |
| `profissionais.html` | 100 | 98 | 100 | 100 | 683 ms | 361 | 0 | 0 | 361 |
| `qual-profissional-procurar.html` | 100 | 98 | 100 | 100 | 458 ms | 320 | 0 | 0 | 320 |
| `blog/menopausa-tratamento-hormonal/` | 100 | 98 | 100 | 100 | 415 ms | 271 | 0 | 0 | 271 |

Desktop está sólido. O problema é mobile.

### 2.3 Variância, 3 execuções de `index.html` mobile

| Execução | perf | LCP | FCP | TBT | SI |
| --- | --- | --- | --- | --- | --- |
| 1 | 91 | 3301 | 1758 | 4 | 1758 |
| 2 | 91 | 3302 | 1727 | 32 | 1727 |
| 3 | 92 | 3227 | 1729 | 0 | 1729 |

Desvio de 75 ms em LCP sobre 3300 ms. O resultado é estável, não é ruído.

### 2.4 Peso real de rede, medido com Playwright a 412px

O Lighthouse mede só a carga inicial, sem rolar a página. Um visitante que lê a
home até o fim baixa muito mais. Medi as duas coisas.

| Página | reqs inicial | peso inicial | reqs total | **peso total (rolagem completa)** | imagens |
| --- | --- | --- | --- | --- | --- |
| `index.html` | 11 | 439 KB | 52 | **3.884 KB** | 49 imgs, 3.679 KB |
| `profissionais.html` | 9 | 488 KB | 37 | **2.625 KB** | 34 imgs, 2.414 KB |
| `sublocacao.html` | 6 | 334 KB | 15 | **1.184 KB** | 13 imgs, 1.103 KB |
| `localizacao.html` | 6 | 321 KB | 10 | **845 KB** | 8 imgs, 777 KB |
| `sobre.html` | 6 | 130 KB | 10 | **463 KB** | 8 imgs, 383 KB |
| `mentorias.html` | 7 | 271 KB | 7 | 271 KB | 5 imgs, 188 KB |
| `qual-profissional-procurar.html` | 6 | 211 KB | 6 | 211 KB | 3 imgs, 29 KB |
| `blog/menopausa-…/` | 6 | 199 KB | 6 | 199 KB | 3 imgs, 93 KB |
| `blog.html` | 6 | 163 KB | 6 | 163 KB | 3 imgs, 29 KB |
| `especialidades.html` | 6 | 128 KB | 6 | 128 KB | 3 imgs, 21 KB |

A home baixa 3,88 MB para um leitor que rola até o rodapé. A pasta
`deploy/assets` inteira tem 4,2 MB. A home puxa praticamente toda a biblioteca
de imagens do site.

### 2.5 Elemento de LCP, medido por `PerformanceObserver`

| Página | elemento de LCP | recurso |
| --- | --- | --- |
| `index.html` | `<p>` do herói (texto) | nenhum |
| `profissionais.html` | `<section>` | `assets/ressonancia/06-trama.webp` (background CSS) |
| `qual-profissional-procurar.html` | `<section>` | `assets/ressonancia/03-resposta.webp` (background CSS) |
| `blog.html` | `<section>` | `assets/ressonancia/04-propagacao.webp` (background CSS) |
| `especialidades.html` | `<section>` | `assets/ressonancia/02-origem.webp` (background CSS) |
| `index.html` desktop | `<section id="topo">` | `assets/ressonancia/01-ressonancia.webp` (background CSS) |
| artigo do blog | `<h1>` (texto) | nenhum |

Em 5 dos 7 casos o LCP é uma **imagem de fundo declarada em CSS inline**. Uma
`background-image` não aceita `fetchpriority="high"` e não é descoberta pelo
preload scanner até o CSS ser aplicado. O `lcp-discovery-insight` do Lighthouse
confirma, pontuando 0 em `profissionais`, `qual` e `index` desktop, com o item
`priorityHinted: false`. Não existe nenhum `<link rel="preload">` nem
`<link rel="preconnect">` em nenhuma página do site (medido: 0 em todas as 12).

### 2.6 Desperdício de imagem, quantificado

Nenhuma imagem do site tem `srcset`, `sizes` ou `<picture>`. Medido: 0 em todas
as páginas. Um único arquivo serve todos os viewports.

Razão entre pixels entregues e pixels realmente renderizados, medida com
`naturalWidth/Height` contra `getBoundingClientRect()` e o DPR do dispositivo:

| Página / viewport | imagens com mais de 2x pixels sobrando | pior caso |
| --- | --- | --- |
| `index.html` mobile 412px | 44 de 47 | `Adriano pb.webp` 1024x1351 renderizado a 121x152: **24,6x** |
| `index.html` desktop | 44 de 47 | mesmo arquivo a 152x190: **47,9x** |
| `profissionais.html` mobile | 31 de 33 | 3,7x |
| artigo do blog desktop | 2 de 3 | `gustavo-gehrke pb.webp` 1024x1270 renderizado a 104x104: **120,2x** |

Recompressão de controle com `sharp`, sem perda visual nos tamanhos que a página
de fato desenha:

| Conjunto | hoje | reamostrado | economia |
| --- | --- | --- | --- |
| 33 retratos a 824px WebP q72 | 2,48 MB | 0,77 MB | 69% |
| 33 retratos a 224px WebP q75 (tamanho real do mosaico da home) | 2,48 MB | **143 KB** | **94,4%** |
| 33 retratos a 224px AVIF q60 | 2,48 MB | 148 KB | 94,0% |
| `recepcao-hero.webp` 1130x821 | 127 KB | 29 KB (824px WebP) / 25 KB (AVIF) | 77% a 80% |

A home entrega 2,48 MB de retratos para desenhar 143 KB de pixels. **2,34 MB por
visita são puro desperdício.**

Não existe um único arquivo AVIF em `deploy/` (medido: `find -iname "*.avif"` = 0),
apesar de o `PERFORMANCE_BUDGET.md` exigir "gerar par AVIF + WebP" para toda
imagem nova e listar "Imagem hero (AVIF) máx 140KB" como estado medido.

### 2.7 CSS, JS e fontes

| Página | HTML total | CSS inline | JS inline | JS externo | JS total |
| --- | --- | --- | --- | --- | --- |
| `index.html` | 166.430 B | 13.833 B (6 blocos, **1.753 B duplicados byte a byte**) | 16.413 B | 41.916 B | **58.329 B** |
| `profissionais.html` | 171.742 B | 13.823 B (6 blocos) | 17.324 B | 41.916 B | **59.240 B** |
| `qual-profissional-procurar.html` | 142.770 B | 9.778 B (5 blocos) | **92.063 B** | 41.916 B | **133.979 B** |
| `blog/menopausa-…/` | 64.961 B | 9.778 B (5 blocos) | 16.460 B | 41.916 B | 58.376 B |

O orçamento do projeto é "JS total ≤ 50KB". As 4 páginas medidas estouram. A
`qual-profissional-procurar.html` estoura em **2,7x**, com um único bloco `<script>`
inline de 72.865 bytes. O Lighthouse marca 23 KiB de JS não usado nessa página.

- CSS: 0 arquivos `.css` no `deploy/`. Tudo inline, cerca de 13,8 KB repetidos em
  cada uma das 63 páginas HTML, sem reaproveitamento de cache entre navegações.
  Fica dentro do teto de 50 KB por página, mas o teto ignora o custo por navegação.
- `unminified-css` pontua 0,5 nas 3 páginas principais, com 2 KiB de sobra estimada.
- Fontes: **0 requisições de fonte, 0 bytes, 0 `@font-face`** em todas as páginas.
  O site usa exclusivamente pilhas do sistema (`Iowan Old Style`, `Helvetica Neue`).
  Isso bate com `docs/ESTADO-REAL.md` e é bom para performance. Contradiz o
  `PERFORMANCE_BUDGET.md`, que declara 2 famílias self-hosted e 4 pesos preloaded.
- `dados-ecooa.js` (41.916 B) é carregado em 29 das 63 páginas HTML, sem `defer`
  nem `async`, mas posicionado a 89,6% do documento, portanto não bloqueia o
  first paint. O `render-blocking-insight` passa em todas as páginas.
- Terceiros: 0 requisições de terceiro no carregamento (GTM e Pixel são
  consent-gated e interaction-only). `third-parties-insight` passa.

### 2.8 CLS

Zero em todas as páginas, por duas medições independentes: Lighthouse
(`cumulative-layout-shift` = 0,000 em 15 execuções) e `PerformanceObserver` de
`layout-shift` via Playwright (0,0000, com contagem de eventos de shift = 0).
Todas as `<img>` têm `width` e `height` explícitos (`unsized-images` passa,
0 imagens sem dimensão em todas as páginas). Este item está genuinamente resolvido.

---

## 3. Confronto com `docs/PERFORMANCE_BUDGET.md`

O documento afirma, no topo: "Meta atingida por evidência de campo (PSI produção
100/100/100/100)" com baseline datado de **2026-05-31**.

O site publicado atual entrou no repositório em **2026-07-29** (`git log --reverse
-- deploy` → commit `165d0f4`, 2026-07-29). O `PERFORMANCE_BUDGET.md` teve seu
último commit em **2026-06-29**, um mês antes de o site atual existir.

**O baseline oficial do documento foi medido em um site que não está mais no ar.**

Confronto item a item entre o documento e o que eu medi:

| Afirmação do documento | Medição de hoje | Veredito |
| --- | --- | --- |
| LCP mobile 1,2 s | 1501 a 3301 ms, mediana 2251 ms | falso para o site atual |
| Performance mobile 100 | 91 a 100, mediana 97 | falso para o site atual |
| "JS total ≤ 50KB, atual ~4-40KB por página" | 58 KB a 134 KB | estourado nas 4 páginas medidas |
| "CSS total ~48KB" | 9,8 KB a 13,8 KB inline | número não corresponde |
| "Imagem hero (AVIF) máx 140KB" | 0 arquivos AVIF no site | falso |
| "Famílias de fonte: 2 (Arboria, Playfair)" | 0 fontes web carregadas | falso |
| "toda imagem nova: par AVIF + WebP" | 0 AVIF, 0 srcset, 0 picture | não cumprido |
| "As imagens de clínica/equipe são below-the-fold e corretamente lazy" | verdadeiro (44 de 47 com `loading="lazy"` na home) | confere |
| "CLS 0" | 0, confirmado por 2 métodos | confere |
| "o gate Lighthouse do CI passou verde em todos os merges recentes" | o gate mede quase nada, ver seção 4 | vazio de significado |

Não existe no documento nenhum orçamento de **peso total de página**. É
exatamente por isso que uma home de 3,88 MB pôde nascer sem disparar alarme.

`docs/ESTADO-REAL.md`, declarado como fonte da verdade sobre o que está
publicado, não contém uma única linha sobre performance. Busca por
`lighthouse|performance|lcp|peso|imagem` retorna zero ocorrências. Não há
registro correto de performance para o site que está no ar.

---

## 4. O gate de performance do CI não mede o site publicado

`.github/workflows/ci.yml` roda `treosh/lighthouse-ci-action@v12` com
`lighthouserc.json` (desktop, bloqueante) e `lighthouserc.mobile.json`
(`continue-on-error: true`). Ambos usam `staticDistDir: ./dist` e a **mesma lista
de 9 URLs**. O `npm run build` (`scripts/build-site.mjs`) só copia `deploy/` para
`dist/`, então `dist` e `deploy` têm o mesmo conteúdo em CI.

Conferi cada uma das 9 URLs contra `deploy/`:

| URL do gate | existe? | tamanho | o que é |
| --- | --- | --- | --- |
| `/index.html` | sim | 166.430 B | **página real** |
| `/blog/index.html` | sim | 93.497 B | **página real** |
| `/ecooa-med/index.html` | sim | 469 B | stub de meta-refresh para `/especialidades` |
| `/ecooa-esthetic/index.html` | sim | 469 B | stub de meta-refresh |
| `/match/index.html` | sim | 529 B | stub de meta-refresh para `/qual-profissional-procurar` |
| `/contato/index.html` | sim | 454 B | stub de meta-refresh |
| `/agendamento/index.html` | sim | 454 B | stub de meta-refresh |
| `/profissionais/index.html` | **não existe** | - | 404 |
| `/profissionais/gustavo-gehrke/index.html` | **não existe** | - | 404 |

Rodei o Lighthouse contra um dos stubs para confirmar o efeito prático:

```
lighthouse http://localhost:4353/match/index.html --preset=desktop
  → finalDisplayedUrl: http://localhost:4353/qual-profissional-procurar
  → runtimeError: ERRORED_DOCUMENT_REQUEST
  → perf=n/a a11y=n/a bp=n/a seo=n/a
```

O stub redireciona via `location.replace` e `meta refresh` para uma URL sem
extensão, que o servidor estático não resolve.

Consequências verificadas:

- **2 das 9 URLs apontam para arquivos que não existem** em `deploy/`. Esses
  caminhos são rotas do projeto Astro, que não está publicado.
- **5 das 9 URLs são stubs de 454 a 529 bytes.** Mesmo no melhor caso, o que eles
  medem é o destino do redirecionamento, nunca o stub. São medições redundantes
  ou erros.
- **Sobram 2 páginas reais no gate**, de 31 URLs no sitemap.
- As duas páginas mais pesadas do site publicado, `profissionais.html` (171.742 B,
  2,63 MB de rede, LCP mobile 2660 ms) e `qual-profissional-procurar.html`
  (142.770 B, 134 KB de JS), **não estão em nenhum gate**.
- O job mobile tem `continue-on-error: true` e **todas as assertivas em `warn`**,
  incluindo `largest-contentful-paint` com teto de 4000 ms e
  `uses-text-compression: "off"`. Ele não pode reprovar nada, por construção.
- O gate desktop tem `largest-contentful-paint` em `error` a 2500 ms. Como
  desktop mede 415 a 722 ms nas páginas reais, esse gate nunca dispara.

O "gate verde em todos os merges recentes" citado no `PERFORMANCE_BUDGET.md` é
verde porque não está olhando para nada relevante.

---

## 5. Entrega e cache

- Produção é **GitHub Pages** (`.github/workflows/deploy.yml` →
  `actions/upload-pages-artifact` + `actions/deploy-pages`, com
  `deploy/CNAME` = `www.somosecooa.com.br`).
- `deploy/_headers` define `Cache-Control: public, max-age=31536000, immutable`
  para `/assets/*`. O próprio comentário no topo do arquivo admite: "a Cloudflare
  os aplica; no GitHub Pages o arquivo é ignorado sem efeito colateral".
- Portanto, **em produção hoje o cache imutável de `/assets/*` não está em vigor**.
  Com 3,68 MB de imagem na home e o TTL padrão do GitHub Pages, cada visita
  revalida ou rebaixa a biblioteca inteira.
- `cache-insight` pontuou 0 em todas as páginas medidas, com 71 a 384 KiB
  sinalizados. Parte disso é artefato do laboratório (o servidor Python não manda
  TTL), mas a conclusão estrutural sobre produção vem do workflow e do próprio
  comentário do `_headers`, não da medição local.
- A migração para Cloudflare Workers, que destravaria Brotli e cache imutável,
  está decidida no P03 mas o cutover segue pendente.

## 6. Higiene de assets

31 dos 55 arquivos em `deploy/assets` têm **espaço no nome**
(`Adriano pb.webp`, `gustavo-gehrke pb.webp`, ...), servidos como `%20` em todas
as URLs. Um deles, `jessica .webp`, tem espaço **antes da extensão**. Dois têm
letra maiúscula (`Adriano`, `Tais`). Não é um problema de performance por si só,
mas é frágil em qualquer CDN que normalize ou trate caminho com case-sensitivity,
e todas essas URLs viajam codificadas dentro de 63 arquivos HTML.

---

## 7. Achados por severidade

| # | Sev | Achado | Evidência |
| --- | --- | --- | --- |
| 1 | crítico | Home entrega 3.884 KB com 94,4% de desperdício de imagem | Playwright: 52 reqs, 3.679 KB de imagem; sharp: 33 retratos = 2,48 MB para desenhar 143 KB |
| 2 | crítico | Gate de performance do CI não mede o site publicado | 2 de 9 URLs são 404, 5 são stubs de ~470 B, sobram 2 páginas reais de 31 |
| 3 | alto | LCP mobile estoura o teto de 2500 ms em 4 de 11 páginas | index 3301 ms, localizacao 2702, profissionais 2660, sublocacao 2627 |
| 4 | alto | Zero `srcset`, zero `<picture>`, zero AVIF em todo o site | 55 imagens, 63 HTML, `find -iname "*.avif"` = 0 |
| 5 | alto | `PERFORMANCE_BUDGET.md` descreve um site que não existe mais | baseline 2026-05-31, site publicado em 2026-07-29 |
| 6 | alto | Orçamento de JS de 50 KB estourado nas 4 páginas medidas | qual-profissional: 134 KB, 2,7x o teto |
| 7 | alto | Gate mobile é inócuo por construção | `continue-on-error: true` + todas as assertivas em `warn` |
| 8 | médio | Cache imutável de `/assets/*` não vale em produção | GitHub Pages ignora `_headers`, dito no próprio arquivo |
| 9 | médio | LCP é `background-image` CSS em 5 de 7 páginas, sem preload possível | `lcp-discovery-insight` = 0, `priorityHinted: false`, 0 `rel=preload` no site |
| 10 | médio | Não existe orçamento de peso total de página | `PERFORMANCE_BUDGET.md` não tem a métrica |
| 11 | médio | `dados-ecooa.js` (41,9 KB) em 29 páginas, 23 KB não usados em uma delas | `unused-javascript` score 0 em qual-profissional |
| 12 | médio | `ESTADO-REAL.md`, a fonte da verdade, não diz nada sobre performance | 0 ocorrências de lighthouse/lcp/peso/imagem |
| 13 | médio | Zero instrumentação de campo. Ninguém sabe o CWV real dos usuários | nenhum RUM no repositório, produção inalcançável daqui |
| 14 | baixo | 1.753 bytes de CSS inline duplicados byte a byte em `index.html` | 2 blocos `<style>` idênticos |
| 15 | baixo | 31 assets com espaço no nome, um com espaço antes da extensão | `jessica .webp` |

---

## 8. O que não foi possível medir

1. **Produção real.** `www.somosecooa.com.br` é inalcançável deste ambiente
   (proxy responde 403). Nenhum número deste laudo vem do domínio real.
2. **Dados de campo (CrUX, PSI produção).** Dependem de rede externa e de conta
   Google. Sem eles, o CWV real dos visitantes é desconhecido.
3. **INP.** O Lighthouse em modo navegação não produz INP. Usei TBT (0 a 126 ms)
   e `maxPotentialFID` (16 a 207 ms) como proxies. INP real exige campo ou um
   roteiro de interação, nenhum dos dois disponível aqui.
4. **Efeito da compressão em produção.** O laboratório não comprime. Estimei o
   delta por `gzip -9` (index.html 166.430 → 24.708 bytes), mas não medi Brotli
   nem o comportamento real do GitHub Pages.
5. **Headers reais de produção.** Deduzidos do `deploy.yml` e do comentário do
   `_headers`, não medidos.
6. **Comportamento do servidor estático do `@lhci/cli`** com URLs sem extensão.
   Provei que os stubs erram no laboratório; se o servidor do LHCI resolve
   `/especialidades` sem `.html`, o efeito seria medição redundante em vez de erro.
   As 2 URLs de `/profissionais/` são 404 em qualquer servidor, isso é inequívoco.
7. **Cache de segunda visita.** Sem `Cache-Control` no laboratório, não dá para
   medir o custo de retorno de um visitante recorrente.

---

## 9. Justificativa da nota: 58/100

O que sustenta a nota para cima, com prova:

- Desktop entrega 100 de performance nas 4 páginas medidas, com LCP de 415 a 722 ms.
- CLS é zero absoluto, confirmado por duas medições independentes, com 100% das
  imagens dimensionadas. Este item está resolvido de verdade.
- TBT fica em 0 ms na maioria das páginas, teto de 126 ms. Zero terceiros no load.
  Zero fontes web. Nada de render-blocking.
- 7 das 11 páginas mobile ficam acima de 97 de performance.

O que puxa a nota para baixo, com prova:

- A página mais importante do site falha o próprio orçamento do projeto por 32%
  (LCP mobile 3301 ms contra teto de 2500 ms), de forma estável em 3 execuções.
  Mais 3 páginas também falham.
- A home baixa 3,88 MB para entregar o equivalente a 143 KB de pixels úteis. Isso
  é dinheiro de plano de dados de paciente, em uma clínica cuja audiência é
  majoritariamente mobile.
- A camada de medição é teatro. O gate do CI olha 2 páginas reais de 31, com 2
  URLs 404 e 5 stubs de meia-página; o gate mobile não pode reprovar nada; o
  documento de orçamento descreve um site que saiu do ar há um mês; a fonte da
  verdade declarada não menciona performance; não há dado de campo.
- Nenhuma das técnicas básicas de entrega de imagem está aplicada: sem srcset,
  sem picture, sem AVIF, sem preload do LCP, com o LCP sendo um background CSS
  que por definição não aceita prioridade.

Um site pode parecer rápido e ainda assim não ter performance sob controle. É o
caso aqui. O resultado renderizado é decente nas páginas leves, mas o que existe
de governança de performance não vigia o que está publicado, e as duas páginas
que mais importam para conversão (home e profissionais) são as duas que falham.
