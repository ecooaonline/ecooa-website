# Baseline P11: UX, UI e design system

> Auditoria de estado ATUAL. Somente leitura. Nenhum arquivo de `deploy/`,
> `src-site-3/` ou `scripts/` foi alterado.
>
> Data: 2026-08-01 · Alvo: `http://localhost:4353` servindo `deploy/` com a CSP
> de produção · Fonte da verdade cruzada: `docs/ESTADO-REAL.md`.

**Nota: 44/100**

---

## 1. Método

### 1.1 O que foi medido e como

| Instrumento | Escopo | Saída |
|---|---|---|
| Playwright + Chromium 1194 | 22 páginas × 3 viewports (402×874, 768×1024, 1440×950) = 66 combinações | 132 screenshots, `inv2.json` |
| Análise estática de CSS (Node) | 95 arquivos HTML de `deploy/` | contagem de declarações autoradas |
| axe-core 4.12.1 | 15 páginas × 2 viewports = 30 execuções | regras `color-contrast` e `target-size` |
| Cálculo determinístico WCAG | 9 cores de texto × 9 fundos | matriz de contraste 81 pares |
| Teste empírico de hover | 4 páginas, mouse real posicionado no centro de cada alvo | 89 elementos testados |
| Teste empírico de foco | 7 páginas, `.focus()` elemento a elemento | 348 elementos testados |

Viewports escolhidos conforme a persona primária do P01, que descobre pelo
celular. O mobile é o caso principal, não o reduzido.

### 1.2 Páginas cobertas

9 raiz (`/`, `/sobre`, `/especialidades`, `/profissionais`,
`/qual-profissional-procurar`, `/blog`, `/localizacao`, `/mentorias`,
`/sublocacao`) mais `/politicas`, as 8 áreas de especialidade, 3 artigos e 1
perfil de profissional.

Screenshots em
`/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/baseline-ui/`
(132 arquivos, 73 MB, padrão `<viewport>__<pagina>[__full].png`).

### 1.3 Dois erros de medição que corrigi antes de reportar

Registro para que ninguém repita:

1. **Imagens "quebradas".** A primeira passagem acusou 42 imagens quebradas na
   home. Era falso positivo: `naturalWidth === 0` em imagens `loading="lazy"`
   ainda não disparadas. Após rolagem completa com espera de 2 s, o resultado é
   **0 imagens quebradas** e **0 respostas HTTP 404** de imagem em todo o site.
2. **Logo "deformado".** A heurística `object-fit: fill` + razão divergente
   acusou o wordmark. O SVG tem `viewBox="0 0 236 44"` e
   `preserveAspectRatio` no padrão `xMidYMid meet`, ou seja, o conteúdo é
   centralizado, não esticado. **Não há distorção visual.** O que existe é
   reserva de caixa errada, tratado como achado baixo.

---

## 2. Números medidos

### 2.1 Peso e custo do style inline

O HTML é 100% pré-renderizado com estilo inline. Não existe um único arquivo
`.css` em `deploy/`.

| Medida | Valor |
|---|---|
| Arquivos HTML analisados | 95 |
| Atributos `style="..."` | **17.174** |
| Bytes só em atributos `style` | 1.853.636 B = **1.810 KB** |
| Bytes em blocos `<style>` | 892.870 B = **872 KB** |
| Bytes de HTML entregues | 6.082.161 B = 5.940 KB |
| **Fração do HTML que é atributo `style`** | **30,5%** |
| **Fração do HTML que é CSS (inline + `<style>`)** | **45,2%** |
| Arquivos `.css` externos | **0** |
| Bloco `:root` repetido | **201 vezes**, 188,8 KB |

Por página (atributos `style`): `profissionais.html` 610, `index.html` 584,
`especialidades/nutricao/` 341, `blog.html` 317, artigos 193 cada.

**O inline não é só artefato da pré-renderização.** O template de origem
`src-site-3/index.html` já traz 191 atributos `style` em 46 KB. A
pré-renderização multiplica por 3,1× em contagem e 3,9× em bytes, mas a
autoria já é inline.

Consequência de manutenção, mensurável: trocar uma cor de marca exige editar
95 arquivos ou regerar tudo por `scripts/gerar-site.mjs`. Não há um ponto único
de alteração para nada que não esteja tokenizado, e a maior parte não está.

### 2.2 Tokens: existem, mas cobrem um terço do problema

Existe um sistema de tokens real, definido em `:root`: **25 propriedades
customizadas** (24 úteis mais `--par`, que é contador de índice com 31 valores).

| Categoria | Tokens | Situação |
|---|---|---|
| Cor | 15 (`--elevado`, `--nuvem`, `--alt`, `--fundo`, `--nevoa`, `--stone`, `--prata`, `--aluminio`, `--grafite-claro`, `--grafite`, `--tinta`, `--escuro`, `--muted`, `--legenda`, `--sobre-escuro`) | bem respeitado |
| Sombra | 4 (`--relevo`, `--relevo-carta`, `--relevo-botao`, `--afundado`) | 60,5% contornado |
| Régua | 2 (`--rule`, `--rule-forte`) | ok |
| Fonte | 2 (`--serif`, `--sans`) | ok |
| Filtro | 1 (`--foto`) | ok |
| **Tamanho de fonte** | **0** | inexistente |
| **Espaçamento** | **0** | inexistente |
| **Raio** | **0** | inexistente |
| **Z-index** | **0** | inexistente |
| **Duração / easing** | **0** | inexistente |
| **Breakpoint** | **0** | inexistente |

### 2.3 Tipografia: sem escala

| Medida | Valor |
|---|---|
| `font-size` distintos autorados inline | **73** |
| `font-size` distintos em `<style>` | 14 |
| `font-size` **computados** distintos (união dos 3 viewports) | **78** |
| ... só mobile / tablet / desktop | 40 / 48 / 58 |
| `line-height` computados distintos | **137** |
| `letter-spacing` computados distintos | **72** |
| Famílias tipográficas | **2** (`--serif`, `--sans`, pilhas do sistema) |
| Pesos | **3** (400, 500, 600) |

Os 78 tamanhos computados incluem valores adjacentes sem função semântica:
8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5,
16, 16.5, 17, 17.5. Vinte degraus de meio pixel entre 8px e 17,5px. Isso não é
escala, é acúmulo.

Há ainda inconsistência de notação para o mesmo valor: `.16em` e `0.16em`
coexistem (347 e 244 ocorrências), assim como `.2em`/`0.2em` e `-.02em`/`-0.02em`.
Isso infla a contagem de valores distintos sem produzir diferença visual, e é
sintoma direto de ausência de fonte única.

Positivo: só 2 famílias e 3 pesos. A voz tipográfica é coerente. O problema é
métrico, não de identidade.

### 2.4 Cor: a parte mais saudável do sistema

| Medida | Valor |
|---|---|
| Hex distintos em todo o HTML | **17** |
| ... que são valor de token | 14 |
| ... fora do token | **3** (`#8C8A84`, `#E3E1DB`, `#DAD7D0`), **6 usos** no total |
| `rgb()`/`rgba()` distintos | 61 |
| Cores de texto computadas | 13 |

Seis usos fora do token contra cerca de 4.400 ocorrências de hex é ruído
desprezível. **A paleta é disciplinada.**

#### Contraste (axe-core, 30 execuções)

| Medida | Valor |
|---|---|
| Violações `color-contrast` | **4** (mesmas 4 em mobile e desktop) |
| Violações `target-size` | 0 |
| **Verificações INCONCLUSIVAS** | **1.195** (556 mobile + 639 desktop) |

As 4 violações são `--prata` `#C6C4BF` sobre `--grafite` `#63615C` = **3,55:1**
(mínimo AA para texto normal é 4,5:1), em `/` e `/sublocacao`.

As 1.195 inconclusivas são o achado maior. Motivos na home mobile (82 casos):
41 por imagem de fundo, 31 por sobreposição de elemento, 4 por nó de imagem
dentro do elemento. Ou seja: **o contraste do texto sobre fotografia nunca foi
verificado, nem por ferramenta nem manualmente.** O hero da home, os cartões de
perfil e as faixas de imagem entram todos nessa faixa cega.

#### Matriz determinística de contraste dos tokens

Calculada por fórmula WCAG 2.x sobre os 15 tokens de cor. `!` = abaixo de 4,5.
`!!` = abaixo de 3,0.

| texto \ fundo | elevado | nuvem | alt | fundo | nevoa | stone | escuro | grafite | tinta |
|---|---|---|---|---|---|---|---|---|---|
| `--tinta` | 9,56 | 9,24 | 8,84 | 8,39 | 7,87 | 7,09 | 1,49 !! | 1,57 !! | 1,00 !! |
| `--legenda` | 6,77 | 6,55 | 6,26 | 5,94 | 5,57 | 5,02 | 2,11 !! | 1,11 !! | 1,41 !! |
| `--grafite` | 6,08 | 5,88 | 5,62 | 5,33 | 5,01 | 4,51 | 2,34 !! | 1,00 !! | 1,57 !! |
| `--muted` | 5,81 | 5,62 | 5,38 | 5,10 | 4,79 | **4,31 !** | 2,45 !! | 1,05 !! | 1,64 !! |
| `--grafite-claro` | 5,39 | 5,21 | 4,99 | 4,73 | **4,44 !** | **4,00 !** | 2,65 !! | 1,13 !! | 1,77 !! |
| `--aluminio` | 2,48 !! | 2,40 !! | 2,29 !! | 2,18 !! | 2,04 !! | 1,84 !! | 5,75 | 2,45 !! | 3,86 ! |
| `--prata` | 1,71 !! | 1,66 !! | 1,58 !! | 1,50 !! | 1,41 !! | 1,27 !! | 8,32 | **3,55 !** | 5,58 |
| branco | 1,02 !! | 1,05 !! | 1,10 !! | 1,16 !! | 1,24 !! | 1,37 !! | 14,50 | 6,19 | 9,73 |

Leitura: `--aluminio` e `--prata` são inutilizáveis como texto em qualquer fundo
claro da paleta. Na prática o site respeita isso (`--aluminio` nunca aparece
como `color:`, `--prata` aparece 22 vezes e produz exatamente as 4 violações).
Mas **nada no sistema impede o próximo desenvolvedor de usar**, porque a regra
não está escrita em lugar nenhum.

### 2.5 Sombra e neumorfismo: 60% fora do token

O site adota neumorfismo (par de sombras clara e escura opostas). Há 4 tokens
para isso. A adesão é minoritária.

| Medida | Valor |
|---|---|
| Declarações `box-shadow` | **1.498** |
| Usando `var(--relevo*)` ou `var(--afundado)` | **592 (39,5%)** |
| Valores literais, contornando o token | **906 (60,5%)** |
| Literais distintos | **25** |
| Sombras computadas distintas | **14** |

Detalhamento dos literais mais frequentes:

| Ocorrências | Valor | Observação |
|---|---|---|
| 268 | `rgba(70,68,63,0.14) 0px 26px 60px` | drop shadow plano, não é neumorfismo |
| 93 | `5px 5px 12px rgba(150,147,140,.32)` | metade escura de `--relevo-botao` |
| 91 | `rgba(150,147,140,0.32) 5px 5px 12px` | idêntico ao anterior, outra serialização |
| 67 | `0 26px 60px rgba(70,68,63,.14)` | idêntico ao primeiro, outra notação |
| 67 | `rgba(150,147,140,0.4) 6px 6px 16px, rgba(255,255,255,0.9) -4px -4px 12px` | quinta elevação neumórfica, sem token |
| 66 | `0 18px 40px rgba(70,68,63,.18), inset 0 0 0 1px rgba(255,255,255,.6)` | mistura drop shadow e borda interna |
| 34 | `rgba(43,41,38,.34) 0 40px 90px` | drop shadow plano |
| **33** | cópias literais exatas de valores de token | `--relevo-botao` (29), `--afundado` (3), `--relevo` (1), `--relevo-carta` (1) |

Dois problemas somados:

1. **Duas linguagens de sombra convivem sem regra.** Neumorfismo (par simétrico
   claro/escuro) e drop shadow material (deslocamento só para baixo, muito
   difuso, `0 26px 60px`, `0 40px 90px`). Não há critério documentado de quando
   usar cada uma.
2. **Cinco elevações neumórficas para três tokens.** Existem os pares 3/3/8,
   5/5/12, 6/6/16, 7/7/16 e 8/8/20, com opacidades variando entre .2, .22, .3,
   .32 e .4. Os tokens cobrem 5/5/12, 7/7/16 e 8/8/20. As outras duas são
   invenção local.

### 2.6 Raio

4 valores computados: `999px` (798 usos), `50%` (166), `14px` (1), `16px`.
Sem token. Os dois valores de canto suave aparecem uma vez cada, ou seja, são
exceções não justificadas dentro de um sistema que é pílula ou círculo.

### 2.7 Espaçamento e grid

| Medida | Valor |
|---|---|
| `padding` distintos autorados | **94** |
| `margin` distintos autorados | **36** |
| `gap` distintos autorados | **38** |
| `padding` computados distintos (desktop) | 46 |
| `max-width` distintos autorados | **62** |
| ... larguras de container em px | 16 (340, 420, 460, 520, 540, 560, 620, 640, 760, 820, 900, 1040, 1080, 1180, 1280, 1600) |
| ... medidas de coluna em `ch` | **26** (11ch a 72ch) |
| **Gutters distintos por viewport** | **2** |
| `padding-top` de seção distintos | 8 (mobile) a 12 (desktop) |

Aqui há uma divisão nítida. **O gutter é excelente**: apenas 2 pares
esquerda/direita distintos por viewport, e o alinhamento das bordas esquerdas
no mobile converge para 5 a 7 valores por página, dominado por 20px. A margem
lateral do site é coerente e disciplinada.

**O resto do espaçamento não tem escala.** 94 paddings e 38 gaps autorados, com
26 medidas de coluna diferentes entre 11ch e 72ch. Não existe módulo, nem base
de 4 ou 8, nem progressão.

Quase-alinhamentos detectados (bordas esquerdas separadas por 1 a 6 px, que o
olho lê como erro): `20 vs 24` em todas as páginas mobile, `46 vs 49` em
`/profissionais` desktop, `536/538/539` e `986 vs 991` em `/mentorias` desktop,
`756 vs 757` e `991 vs 994` na home desktop.

### 2.8 Breakpoints: 11 valores, com pares quase idênticos

| Ocorrências | Media query |
|---|---|
| 200 | `(prefers-reduced-motion: reduce)` |
| 168 | `(max-width: 1023px)` |
| 134 | `(max-width: 759px)` |
| 134 | `(max-width: 479px)` |
| 134 | `(max-width: 859px)` |
| 101 | `(max-width: 860px)` |
| 67 | `(max-width: 1079px)` |
| 67 | `(min-width: 1080px)` |
| 67 | `(max-width: 1099px)` |
| 67 | `(max-width: 899px)` |
| 67 | `(forced-colors: active)` |
| 34 | `(min-width: 1024px)` |

**11 breakpoints de largura distintos**: 479, 759, 859, 860, 899, 1023, 1024,
1079, 1080, 1099. Os pares 859/860, 1023/1024 e 1079/1080 são a mesma intenção
escrita de duas maneiras. Entre 859px e 860px o layout muda por dois conjuntos
de regras diferentes, e ninguém sabe qual vence sem inspecionar.

`@container`: **0 usos**. `clamp()`: 152 usos só na home, o que é bom e
sustenta a fluidez, mas sem tokens os `clamp` também são todos distintos.

### 2.9 Estados interativos: hover e active não existem

Este é o achado mais duro da dimensão.

| Estado | Medida |
|---|---|
| `:hover` no CSS | 68 ocorrências em 95 arquivos |
| Páginas principais com **zero** regra `:hover` | **8 de 12** |
| **Teste empírico de hover** | **0 de 89 elementos** mudaram qualquer propriedade |
| `:active` em todo o site | **0 ocorrências** |
| `:focus-visible` | 806 ocorrências |
| Elementos testados com anel de foco | **348 de 348 (100%)** |
| Variantes de anel de foco | 1 a 2 por página, 5 combinações no total |
| `prefers-reduced-motion` | 200 ocorrências |
| `forced-colors: active` | 67 ocorrências |

O teste de hover posicionou o mouse no centro geométrico de cada alvo, esperou
320 ms e comparou `background-color`, `color`, `box-shadow`, `transform`,
`opacity`, `border-color`, `text-decoration-line` e `filter`. Em `/`,
`/profissionais`, `/blog` e `/especialidades/medicina/`, **nenhum dos 89 alvos
alcançáveis respondeu**. Links de navegação, botões, cartões e CTAs são
visualmente inertes ao ponteiro.

Em contrapartida, o **foco é o ponto mais forte do sistema**: cobertura de
100%, anel consistente (`2px solid rgb(70,68,63)`, offset 3px, com variante
clara `rgb(240,238,233)` sobre fundo escuro), mais suporte a
`prefers-reduced-motion` e `forced-colors`. Isso foi feito com cuidado.

### 2.10 Alvos de toque

| Viewport | Alvos < 44×44 px | Alvos < 24×24 px |
|---|---|---|
| Mobile (22 páginas) | **485** | 34 |
| Tablet (22 páginas) | 485 | 34 |
| Desktop (22 páginas) | 705 | **461** |

`axe-core` reporta **0 violações de `target-size`**, porque a regra WCAG 2.2 AA
(2.5.8) aceita alvos menores quando há espaçamento suficiente, e há. Ou seja:
**o site passa no critério normativo**. O que ele não atinge é a recomendação
de 44×44 (WCAG 2.5.5, nível AAA), e isso importa para a persona de 30 a 70 anos
que chega pelo celular.

Casos concretos no mobile: links de navegação com **32px de altura**, link
"políticas" no rodapé com **47,7 × 15 px**. No desktop os links de navegação
têm **16px de altura**, o que explica os 461 alvos abaixo de 24px.

Positivo: os botões do hero têm **52px de altura** em todos os viewports e
passam com folga.

### 2.11 Consistência de componente: o botão está certo

Medição dos dois botões do hero da home, mobile e desktop:

| Propriedade | agendar | encontrar meu profissional | Delta |
|---|---|---|---|
| Altura | 52,0 px | 52,0 px | **0,0** |
| Borda esquerda (mobile) | 20,0 px | 20,0 px | **0,0** |
| `padding` | `0px 34px` | `0px 34px` | igual |
| `font-size` | 11,5px | 11,5px | igual |
| `letter-spacing` | 1,84px | 1,84px | igual |
| `border-radius` | 999px | 999px | igual |

O componente de botão é pixel-consistente. A distinção primário/secundário é
deliberada: o primário usa só a sombra escura, o secundário usa o par
neumórfico completo. Isso está correto.

Ressalva: o botão do cabeçalho tem **44px** e o do hero **52px**. Duas alturas
para o mesmo componente, sem token que explique a diferença.

### 2.12 Layout: nenhuma quebra estrutural

| Medida | Resultado |
|---|---|
| Overflow horizontal (66 combinações página × viewport) | **0** |
| Overflow subpixel (tolerância 0,05 px, desktop) | **0** |
| Imagens quebradas (após rolagem completa) | **0** |
| Respostas HTTP 4xx de imagem | **0** |
| Imagens deformadas | **0** (ver seção 1.3) |
| Elementos sobrepostos indevidamente | nenhum detectado |

Este é um resultado forte e raro. Em 22 páginas por 3 viewports, `scrollWidth`
é exatamente igual a `innerWidth` em todos os casos. Não há vazamento
horizontal em lugar nenhum.

### 2.13 Camadas, âncoras e elementos fixos

Elementos fixos ou sticky em `/profissionais`:

| Elemento | Posição | z-index | Altura |
|---|---|---|---|
| `<header>` | fixed | 80 | 77 px |
| Barra de filtros | sticky, `top: 76px` | 40 | 74 a 172 px |
| FAB de WhatsApp | fixed | 70 | 60 × 60 px |
| Banner de consentimento | fixed | **9998** | 92 a 142 px |

z-index distintos em uso: **2, 40, 70, 80, 9998, 10000**. Números mágicos sem
escala documentada.

**Bug confirmado por teste:** `scroll-padding-top` do `<html>` é `auto` e
nenhuma das 5 a 6 âncoras com `id` tem `scroll-margin-top`. Ao navegar para uma
âncora, o alvo para em `top: 0` enquanto o cabeçalho fixo ocupa até `77px`.
Medição direta: `{alvoTop: 0, headerBottom: 77, escondido: true}`. O topo do
conteúdo alvo fica atrás do cabeçalho.

A barra de filtros, ao contrário, gruda em `top: 76px` e respeita o cabeçalho.
Alguém pensou nisso ali e não generalizou.

### 2.14 Comprimento de página

| Página | Mobile | Tablet | Desktop |
|---|---|---|---|
| `/profissionais` | 22.859 px (**26,2 telas**) | 22.510 px (22,0) | 18.085 px (19,0) |
| `/` | 16.088 px (**18,4 telas**) | 13.030 px (12,7) | 11.377 px (12,0) |
| `/especialidades/medicina/` | 12.779 px (**14,6 telas**) | 7.331 px (7,2) | 6.122 px (6,4) |
| `/blog` | 6.489 px (7,4) | 4.116 px (4,0) | 3.224 px (3,4) |
| `/especialidades` | 4.688 px (5,4) | 3.218 px (3,1) | 2.542 px (2,7) |

`/profissionais` exige **26 telas de rolagem no celular**. Os 31 cartões de
perfil são full-bleed (largura 402px, altura 300px cada, borda esquerda em 0),
o que também os coloca fora do gutter de 20px que o restante do site respeita.
Não há paginação, virtualização nem âncora de retorno.

### 2.15 Densidade editorial: metade dos artigos é casca

Medição de palavras no corpo de cada um dos 14 artigos, mobile:

| Artigo | Palavras | Parágrafos | h2 |
|---|---|---|---|
| equilibrio-hormonal-como-identificar | 1.141 | 22 | 7 |
| longevidade-saudavel | 1.167 | 21 | 7 |
| menopausa-tratamento-hormonal | 1.162 | 22 | 7 |
| queda-de-cabelo-causas | 1.117 | 18 | 7 |
| saude-mental-emagrecimento | 1.180 | 21 | 7 |
| implante-hormonal-subcutaneo | 323 | 10 | 4 |
| canetas-emagrecedoras-nutricao | 283 | 10 | 4 |
| **ansiedade-como-identificar-tratar** | **48** | 3 | 1 |
| **nutricao-esportiva-performance** | **49** | 3 | 1 |
| **saude-capilar-feminina** | **49** | 3 | 1 |
| **transplante-capilar-porto-alegre** | **49** | 3 | 1 |
| **osteopatia-o-que-e-para-quem** | **50** | 3 | 1 |
| **interpretacao-exames-bioquimicos** | **54** | 3 | 1 |
| **rejuvenescimento-facial-porto-alegre** | **54** | 3 | 1 |

**7 dos 14 artigos (50%) têm entre 48 e 54 palavras.** Na tela, isso é: título,
subtítulo, assinatura, caixa de ressalva, cartão do autor, rodapé. O leitor que
clica em "ansiedade: como identificar e tratar" recebe três frases.

Isso é coerente com a pendência 4 de `docs/ESTADO-REAL.md` ("textos reais dos
14 artigos" dependem do dono), mas do ponto de vista de UX o estado atual é
uma promessa quebrada em 7 páginas indexadas.

### 2.16 Texto alternativo

Na home, **31 de 47 imagens visíveis não têm `alt`** (66%). As demais páginas
medidas ficam em 0 a 1. O problema está concentrado no mosaico de retratos.

---

## 3. Design system documentado versus realidade

`docs/DESIGN_SYSTEM.md` existe, tem 4.038 bytes e descreve um sistema completo.
**Nenhuma linha dele descreve o site publicado.** Verificação item a item em
`deploy/`:

| O que o documento afirma | Ocorrências em `deploy/` | Veredito |
|---|---|---|
| Tokens em `src/styles/tokens.css` | arquivo existe, mas serve o Astro que não está no ar | não aplicável |
| Classes de botão `.bd` `.bo` `.bw` `.bow` `.ghost` | **0, 0, 0, 0, 0** | inexistente |
| `--space-xs` a `--space-3xl` | **0** | inexistente |
| `--radius-sm` / `--radius-md` / `--radius-full` | **0** | inexistente |
| `--shadow-sm` / `--shadow-md` / `--shadow-lg` | **0** | inexistente |
| `--z-base` a `--z-cursor` | **0** | inexistente |
| `--font-primary` | **0** | inexistente |
| Fontes Arboria e Playfair | Arboria 3, Playfair **0** | inexistente |
| Breakpoints 480 / 768 / 1024 / 1280 | **0 / 0 / 0 / 1** | inexistente |
| "cantos retos, sem border-radius nos cards" | 798 usos de `999px`, 166 de `50%` | contradito |
| Componentes `PillarCard`, `NewsletterCapture`, `OptimizedImage` etc. | componentes Astro, não publicados | não aplicável |

Os nomes reais dos tokens do site no ar (`--tinta`, `--nuvem`, `--nevoa`,
`--relevo-botao`, `--afundado`) **não aparecem em nenhum documento de `docs/`**.

Isso confirma o aviso de `docs/ESTADO-REAL.md`: os 41 documentos antigos
descrevem o Astro. `DESIGN_SYSTEM.md` é um deles, e é enganoso o suficiente
para que qualquer pessoa que o siga produza código que não integra com o site.
`ESTADO-REAL.md` lista o que ainda vale e cita `BRANDBOOK-ECOOA.md`, mas
**não menciona `DESIGN_SYSTEM.md` na lista de desconsiderações**, o que deixa a
armadilha aberta.

### 3.1 Nenhuma validação de design no pipeline

`.github/workflows/ci.yml` roda: format check, TypeScript check, ESLint, audit
de dependências, build, gate do contrato de páginas, guardião regulatório,
verificação de links internos (não bloqueante) e Lighthouse CI (desktop e
mobile, `accessibility` com `minScore 0.9` em modo **warn**, não bloqueante).

Não existe: stylelint, teste de regressão visual, validação de tokens, lint de
CSS, snapshot de screenshot, verificação de contraste bloqueante. `scripts/` não
tem nenhum arquivo com `visual`, `design`, `token`, `regress` ou `snapshot` no
nome.

**Consequência direta:** as 78 medidas de fonte, os 11 breakpoints e os 906
box-shadows literais não foram detectados por nenhuma ferramenta porque nenhuma
ferramenta olha para isso. A dispersão pode crescer indefinidamente sem alarme.

---

## 4. Achados por severidade

| # | Sev | Achado | Evidência |
|---|---|---|---|
| 1 | **crítico** | `DESIGN_SYSTEM.md` descreve um sistema que não existe no site no ar. 0 de 9 famílias de token documentadas presentes, 0 de 5 classes de botão, 0 de 4 breakpoints | seção 3 |
| 2 | **crítico** | Hover não existe. 0 de 89 elementos interativos respondem ao ponteiro; 8 de 12 páginas sem nenhuma regra `:hover`; `:active` com 0 ocorrências no site inteiro | seção 2.9 |
| 3 | **alto** | Sem escala tipográfica. 78 tamanhos computados distintos, 137 line-heights, 72 letter-spacings, 20 degraus de meio pixel entre 8 e 17,5px | seção 2.3 |
| 4 | **alto** | 60,5% dos `box-shadow` contornam o token (906 de 1.498), com 25 literais distintos, 33 sendo cópia exata de token e duas linguagens de sombra misturadas | seção 2.5 |
| 5 | **alto** | 1.195 verificações de contraste inconclusivas. Todo texto sobre fotografia está sem contraste verificado | seção 2.4 |
| 6 | **alto** | 17.174 atributos `style` inline = 30,5% dos bytes de HTML. `:root` repetido 201 vezes = 188,8 KB. Zero arquivo CSS | seção 2.1 |
| 7 | **alto** | 11 breakpoints distintos com pares quase idênticos (859/860, 1023/1024, 1079/1080) | seção 2.8 |
| 8 | **alto** | 7 dos 14 artigos têm 48 a 54 palavras. Metade do editorial indexado é casca | seção 2.15 |
| 9 | **médio** | Âncoras param sob o cabeçalho fixo. `scroll-padding-top: auto`, 0 âncoras com `scroll-margin-top`, cabeçalho de 77px. Confirmado por teste | seção 2.13 |
| 10 | **médio** | Zero token de espaçamento, raio, z-index, duração e breakpoint. 94 paddings, 38 gaps, 26 medidas em `ch` sem escala | seções 2.2, 2.6, 2.7 |
| 11 | **médio** | 485 alvos de toque abaixo de 44×44 no mobile (nav com 32px, "políticas" com 15px de altura). Passa WCAG 2.5.8 AA, não atinge a recomendação de 44px | seção 2.10 |
| 12 | **médio** | Nenhuma validação de design no CI. Sem stylelint, regressão visual, validação de token ou gate de contraste | seção 3.1 |
| 13 | **médio** | 31 de 47 imagens visíveis da home sem `alt` | seção 2.16 |
| 14 | **médio** | `/profissionais` com 26,2 telas de rolagem no mobile, 31 cartões full-bleed fora do gutter de 20px, sem paginação | seção 2.14 |
| 15 | **médio** | 4 violações reais de contraste: `--prata` sobre `--grafite` = 3,55:1 em `/` e `/sublocacao` | seção 2.4 |
| 16 | **baixo** | z-index sem escala: 2, 40, 70, 80, 9998, 10000 | seção 2.13 |
| 17 | **baixo** | Quase-alinhamentos de 1 a 6px (`46 vs 49`, `536/538/539`, `986 vs 991`, `756 vs 757`) | seção 2.7 |
| 18 | **baixo** | Notação inconsistente para o mesmo valor: `.16em` e `0.16em` coexistem (347 e 244 usos), idem `.2em`/`0.2em` e `-.02em`/`-0.02em` | seção 2.3 |
| 19 | **baixo** | Botão com duas alturas sem token: 44px no cabeçalho, 52px no hero | seção 2.11 |
| 20 | **baixo** | `border-radius` `14px` e `16px` aparecem 1 vez cada dentro de um sistema pílula/círculo | seção 2.6 |
| 21 | **baixo** | Wordmark com `width="236" height="44"` mas `style="width:98px"` sem altura. Sem distorção (o `preserveAspectRatio` protege), mas reserva 44px para um logo de ~18px | seções 1.3, 2.12 |
| 22 | **baixo** | 3 hex fora do token (`#8C8A84`, `#E3E1DB`, `#DAD7D0`), 6 usos | seção 2.4 |
| 23 | **baixo** | Linhas órfãs frequentes. `text-wrap: balance/pretty` aparece 8 vezes em 95 arquivos; 0 usos de `hyphens` | seção 2.7 |

---

## 5. O que está bom, e é medido

Para não haver dúvida de que a nota reflete medição e não impressão, o que o
site acerta:

1. **Zero overflow horizontal** em 66 combinações página × viewport, inclusive
   com tolerância subpixel de 0,05px. Difícil de conseguir, e conseguido.
2. **Zero imagem quebrada e zero 404 de imagem** após rolagem completa.
3. **Foco visível com cobertura de 100%** em 348 elementos testados, anel
   consistente, mais `prefers-reduced-motion` (200 usos) e `forced-colors`
   (67 usos).
4. **Paleta disciplinada**: 3 hex fora do token em cerca de 4.400 ocorrências.
5. **Gutter coerente**: 2 pares distintos por viewport; bordas esquerdas do
   mobile convergindo para 5 a 7 valores, dominadas por 20px.
6. **Componente de botão pixel-consistente**: delta 0,0px em altura e posição
   entre primário e secundário.
7. **Voz tipográfica coerente**: 2 famílias e 3 pesos apenas.
8. **Barra de filtros sticky corretamente compensada** para o cabeçalho fixo
   (`top: 76px` para header de 77px).

O acabamento visual é de bom nível. O que falta é sistema, não gosto.

---

## 6. O que não foi possível medir

1. **O domínio real.** `https://www.somosecooa.com.br` é inalcançável deste
   ambiente (proxy 403). Toda medição usou `localhost:4353` servindo `deploy/`.
   Diferenças introduzidas pela Cloudflare (compressão, transformação de
   imagem, regra de CSP do painel citada em `ESTADO-REAL.md` seção 4) não foram
   observadas.
2. **Rotas sem extensão.** O servidor de laboratório devolve 404 para `/sobre`,
   `/mentorias`, `/politicas`, `/sublocacao`, `/localizacao` e
   `/qual-profissional-procurar`, porque não faz o rewrite para `.html`. O
   sitemap declara essas URLs sem extensão. **Não consegui verificar se a
   produção resolve.** Todas as medições desta auditoria usaram os caminhos
   `.html` equivalentes. Isso precisa ser confirmado contra o domínio real, e
   está fora do escopo de P11.
3. **Contraste sobre fotografia.** As 1.195 verificações inconclusivas do
   axe-core exigem inspeção visual pixel a pixel sobre cada imagem, em cada
   viewport, considerando o ponto mais claro da foto sob o texto. Não executado.
4. **Comportamento real de toque.** `hasTouch: true` do Playwright simula, mas
   não reproduz alvo de dedo, tremor nem uso com uma mão. A avaliação dos 485
   alvos abaixo de 44px é geométrica, não empírica.
5. **Modais e estados JS pendentes.** `ESTADO-REAL.md` seção 2 lista handlers
   ainda não religados (`e.abrir`, `a.abrir`, `r.abrir`, 10 handlers da busca
   por IA). Os estados de interface que eles produziriam não existem no DOM e
   portanto não foram inventariados.
6. **Hover em alvos fora de alcance.** Dos 291 alvos interativos encontrados
   nas 4 páginas testadas, apenas 89 puderam ser posicionados integralmente na
   viewport para o teste. O resultado de 0% é sobre esses 89. Os demais são
   elementos altos demais ou dentro de contêineres ocultos.
7. **Percepção de marca.** Se o neumorfismo comunica "premium e sóbrio" para a
   persona é pergunta de pesquisa com usuários, não de auditoria técnica.

---

## 7. Justificativa da nota: 44/100

A dimensão tem duas metades com desempenhos opostos.

**O acabamento visual pontua alto.** Zero overflow em 66 combinações, zero
imagem quebrada, gutter com 2 valores, botão com delta de 0,0px, foco com 100%
de cobertura, paleta com 6 desvios em 4.400 usos. Isso é trabalho cuidadoso e
está medido.

**O design system quase não existe, e o que existe é contornado.** Há 25
tokens, mas eles cobrem só cor, sombra e fonte. Não há token de espaçamento,
tamanho de fonte, raio, z-index, duração nem breakpoint. Onde o token existe
para sombra, **60,5% das declarações o contornam**, e 33 delas redigitam o valor
do token à mão. O resultado é 78 tamanhos de fonte, 137 line-heights, 94
paddings, 38 gaps e 11 breakpoints com três pares quase idênticos.

**Dois estados interativos simplesmente não foram construídos.** Hover não
responde em nenhum dos 89 alvos testados, e `:active` tem 0 ocorrências em 95
arquivos. Um site cujo canal principal de conversão é o clique em WhatsApp não
dá retorno visual ao ponteiro.

**A documentação é ativamente enganosa.** `DESIGN_SYSTEM.md` descreve tokens,
classes, fontes e breakpoints dos quais **nenhum** existe em `deploy/`, e
afirma "cantos retos, sem border-radius" num site com 798 usos de `999px`.

**Nada disso é medido pelo projeto.** Não há stylelint, regressão visual,
validação de token nem gate de contraste no CI. A regra desta auditoria é
explícita: o que não se mede não tira nota alta.

Somando: acabamento bom o suficiente para não ser reprovado, sistema e
governança de design em estado inicial, dois estados de interface ausentes,
manutenção cara por construção (30,5% dos bytes são `style` inline, `:root`
repetido 201 vezes) e documentação que induz ao erro. **44/100.**

A nota não é sobre o gosto do design, que é bom. É sobre o sistema que deveria
sustentá-lo, que não está lá.
