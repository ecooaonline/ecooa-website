# Baseline P10 · SEO técnico

> Auditoria de estado, não de intenção. Tudo aqui foi medido em `deploy/` e no
> laboratório `http://localhost:4353` em 2026-08-01. Nenhum arquivo do site foi
> alterado. Onde não deu para medir, está escrito que não deu.

**Nota do estado atual: 44/100.**

A fundação de rastreabilidade está limpa e isso é trabalho real: zero link
interno quebrado, canonical absoluto e autorreferente em todas as páginas,
sitemap sem uma única URL fantasma, hierarquia de headings sem salto, FAQ
estruturado batendo com o texto visível. O que reprova a nota são quatro coisas
medidas, todas de primeira ordem: 24 das 31 URLs do sitemap compartilham o
título de outra página, não existe um único dado estruturado de negócio local em
todo o site, 12 dos 14 artigos têm menos de 80 palavras próprias, e nada no site
mede nada.

---

## 1. Método

| O que | Como |
|---|---|
| Extração de metadados | script próprio sobre os 63 arquivos HTML de `deploy/`, parsing de `<title>`, `<meta>`, `<link rel=canonical>`, JSON-LD, headings, `<img>`, `<a>` |
| Grafo de links | normalização de todos os `href` das 63 páginas, resolução com `<base href="/">`, mapa URL lógica → arquivo emulando URL sem extensão do GitHub Pages, BFS de profundidade a partir de `/` |
| Renderização real | Playwright + Chromium 1194 em 12 páginas, com a CSP de produção do laboratório, para confirmar que nada é injetado em runtime |
| Lighthouse | `node_modules/.bin/lighthouse --only-categories=seo` em 3 páginas |
| Schema vs conteúdo | comparação literal de cada `Question`/`Answer` do FAQPage com o texto visível da própria página |
| Conteúdo próprio por artigo | interseção das linhas de texto dos 14 artigos, subtração do cabeçalho e rodapé comuns, contagem do que sobra |
| Intenção de busca | busca normalizada, sem acento, dos termos de 10 consultas comerciais em `title`, `h1`, `description` e corpo das 31 páginas |

Arquivos de trabalho ficaram no scratchpad da sessão (`pages.json`, `links.json`,
relatórios do Lighthouse). Não foram copiados para o repositório.

---

## 2. Contagem de páginas: 63 arquivos, 31 no sitemap

```
63  arquivos .html em deploy/
-28  páginas-ponte de redirecionamento (<title>Página movida</title>)
- 2  páginas com meta robots noindex (404.html, politicas.html)
- 2  duplicatas exatas fora do sitemap (blog/index.html, especialidades/index.html)
= 31  URLs no sitemap.xml   (9 raiz + 8 especialidades + 14 artigos)
```

A conta fecha exata. As 31 URLs do sitemap correspondem a 31 arquivos reais:
**zero URL do sitemap sem arquivo, zero arquivo indexável de fora do sitemap
além das 2 duplicatas.**

### As 28 páginas-ponte

Todas seguem o mesmo molde: `<title>Página movida</title>`, canonical para o
destino, `<meta http-equiv="refresh" content="0">` mais `location.replace()`.
Nenhuma tem `noindex`. Nenhuma está no `robots.txt`. Nenhuma é 301 de verdade,
o que `docs/ESTADO-REAL.md` §5 item 7 já registra como pendência do painel da
Cloudflare.

| Origem | Destino |
|---|---|
| `quem-somos/` | `/sobre` |
| `contato/`, `agendamento/`, `clinica-moinhos-de-vento/` | `/localizacao` |
| `match/` | `/qual-profissional-procurar` |
| `para-nutricionistas/`, `para-profissionais/` | `/sublocacao` |
| `politica-de-privacidade/` | `/politicas` |
| `ecooa-med/`, `ecooa-mind/`, `ecooa-esthetic/`, `ecooa-working/` | `/especialidades` |
| `especialidade/` × 16 slugs (capilar, psicologia, pele, corpo, hormonal, metabolismo, longevidade, genetics, emagrecimento, performance, coaching, nutricao-clinica, nutricao-esportiva, nutricao-estetica, rejuvenescimento-facial, vegetarianismo) | `/especialidades` |

**20 das 28 caem no hub genérico `/especialidades`** mesmo quando existe a página
específica óbvia: `especialidade/capilar` deveria ir para
`/especialidades/tricologia/`, `especialidade/psicologia` para
`/especialidades/saude-mental/`, `especialidade/pele` e
`especialidade/rejuvenescimento-facial` para `/especialidades/estetica-facial/`,
e assim por diante. Redirecionar muitas URLs distintas para uma página genérica
é o padrão que o Google trata como soft 404.

### As 2 duplicatas

`deploy/blog/index.html` e `deploy/especialidades/index.html` são **byte a byte
idênticas** a `blog.html` e `especialidades.html`, com uma única diferença: a
linha `<base href="/">`. Medido com `diff` linha a linha após quebrar as tags.

Consequência: `/blog` e `/blog/` são dois endereços que respondem 200 com o mesmo
conteúdo, e o mesmo vale para `/especialidades`. O canonical das quatro aponta
para a forma sem barra, o que mitiga, mas cria uma ambiguidade que não consegui
resolver aqui (ver §9, não medido).

---

## 3. O achado que domina tudo: título duplicado em 77% do sitemap

Medição direta sobre os 35 arquivos que não são páginas-ponte:

| Título | Quantas páginas o usam |
|---|---|
| `Editorial ecooa · textos sobre saúde, estética, nutrição e longevidade` | **16** (`blog.html`, `blog/index.html` e os 14 artigos) |
| `Especialidades · ecooa · medicina, estética, tricologia, nutrição e saúde mental em Porto Alegre` | **10** (`especialidades.html`, `especialidades/index.html` e as 8 áreas) |
| os outros 9 títulos | 1 cada |

**11 títulos distintos para 35 páginas reais. Entre as 31 URLs do sitemap,
9 títulos distintos.** Ou seja: 24 das 31 URLs indexáveis (77%) dividem o título
com pelo menos outra URL. Dessas, 22 são subpáginas que herdam literalmente o
título do hub: as 14 do editorial e as 8 de especialidade. Nelas o elemento com
maior peso de ranqueamento não diz nada sobre a própria página.

O `og:title` está correto e único em 33 das 35 páginas. O `<title>` não. A
diferença mostra que o problema é do gerador de `<title>`, não da estratégia de
conteúdo: quem escreveu o `og:title` sabia o que a página é.

Confirmado em runtime com Playwright: `document.title` após `networkidle` é
idêntico ao HTML estático em todas as 12 páginas testadas. Nada corrige isso no
navegador.

Exemplos concretos do estrago:

| URL | `<title>` servido | `<h1>` |
|---|---|---|
| `/especialidades/transplante-capilar/` | Especialidades · ecooa · medicina, estética... | Transplante capilar com critério de indicação. |
| `/especialidades/saude-mental/` | Especialidades · ecooa · medicina, estética... | Saúde mental com escuta sem pressa. |
| `/blog/transplante-capilar-porto-alegre/` | Editorial ecooa · textos sobre saúde... | Transplante capilar: quem tem indicação e quem não tem |

O título de 96 caracteres das 10 páginas de especialidade também passa muito do
limite de corte da SERP, então nem o texto genérico aparece inteiro.

---

## 4. Dados estruturados: nada de negócio local existe

Varredura de `"@type"` em todo `deploy/`:

```
28  Question       (dentro dos 8 FAQPage)
28  Answer         (dentro dos 8 FAQPage)
14  Person         (dentro dos 14 Article, como author)
14  Organization   (dentro dos 14 Article, como publisher)
14  Article
 8  FAQPage
```

**Zero `LocalBusiness`. Zero `MedicalClinic`. Zero `Organization` de site.
Zero `Person` autônomo. Zero `BreadcrumbList`. Zero `WebSite`.**

- A home tem **0** blocos JSON-LD (confirmado em runtime).
- `/localizacao`, que é a página de endereço, telefone e horário, tem **0**.
- `/profissionais`, com 31 profissionais e 17 registros de conselho visíveis no
  HTML, tem **0**.

Para uma clínica local em Moinhos de Vento, a entidade `MedicalClinic` com NAP,
horário e área atendida é o sinal central de busca local. Ela não existe.

Existe no repositório um `scripts/estruturados.mjs` (347 linhas, **não
versionado**, `git status` mostra `?? scripts/estruturados.mjs`) que constrói
exatamente essa entidade a partir de `deploy/dados-ecooa.js`. Ele **nunca rodou
sobre este deploy**: o marcador de idempotência `data-ld-ecooa` que ele grava
aparece em **0 dos 63 arquivos**. O código está escrito; o site publicado não o
recebeu.

### Qualidade dos schemas que existem

**FAQPage (8 páginas): aprovado.** Verifiquei literalmente cada par
pergunta/resposta de 3 páginas (10 pares) contra o texto visível: 10 de 10
perguntas e 10 de 10 respostas aparecem na página. Sem invenção, sem
`aggregateRating`, sem `review`. Correto e conforme para nicho de saúde.

**Article (14 páginas): incompleto.** Cada um tem `headline`, `description`,
`datePublished`, `inLanguage`, `mainEntityOfPage`, `author.name` e
`author.jobTitle`, `publisher.name`. Faltam `image`, `dateModified`,
`author.url` (nenhum profissional tem URL própria para apontar) e
`publisher.logo`. E o problema maior está na §5.

**BreadcrumbList: ausente, apesar de a trilha existir na tela.** As 22 subpáginas
têm `<nav aria-label="Trilha de navegação">` com `especialidades · medicina` ou
`editorial · tricologia`. É uma trilha de 2 níveis, sem o nó raiz, sem marcação
estruturada, e o link dela aponta para `especialidades.html`, não para a URL
canônica. As 9 páginas de raiz não têm trilha nenhuma.

---

## 5. Conteúdo: 12 dos 14 artigos são casca

Medi o conteúdo próprio de cada artigo isolando as 70 linhas de texto comuns aos
14 (cabeçalho, submenus, rodapé) e contando o que sobra.

| Artigo | Chars próprios | ~palavras |
|---|---|---|
| implante-hormonal-subcutaneo | 2163 | 361 |
| canetas-emagrecedoras-nutricao | 1819 | 303 |
| interpretacao-exames-bioquimicos | 425 | 71 |
| menopausa-tratamento-hormonal | 422 | 70 |
| ansiedade-como-identificar-tratar | 399 | 67 |
| saude-capilar-feminina | 396 | 66 |
| equilibrio-hormonal-como-identificar | 395 | 66 |
| transplante-capilar-porto-alegre | 377 | 63 |
| saude-mental-emagrecimento | 375 | 63 |
| queda-de-cabelo-causas | 366 | 61 |
| nutricao-esportiva-performance | 365 | 61 |
| rejuvenescimento-facial-porto-alegre | 349 | 58 |
| osteopatia-o-que-e-para-quem | 346 | 58 |
| longevidade-saudavel | 315 | 53 |

Nos 12 artigos abaixo de 80 palavras, ou seja todos exceto
`implante-hormonal-subcutaneo` e `canetas-emagrecedoras-nutricao`, o conteúdo
próprio é: o H1, a linha de resumo, a
assinatura do autor, o aviso de que o texto não substitui consulta, e três cards
de "continue lendo". **Não existe corpo de texto.**

Isso é 12 das 31 URLs do sitemap (39%) declaradas ao Google como `Article`, com
`headline` e `datePublished`, sobre páginas sem artigo. `docs/ESTADO-REAL.md` §5
item 4 já registra "textos reais dos 14 artigos" como pendência do dono, o que
confirma que isso é conhecido. O que a auditoria acrescenta é o custo: essas
páginas estão no sitemap hoje, sendo oferecidas ao rastreio hoje.

Para comparação, as 8 páginas de especialidade têm de 649 a 1051 palavras de
texto renderizado e são as únicas páginas do site com densidade editorial real.

---

## 6. Links internos: 0 quebrados, mas 1411 apontam para a URL errada

**Zero links internos quebrados.** Todos os `href` das 63 páginas foram
normalizados e resolvidos; 100% dos alvos de página e de asset existem em disco.

**Zero páginas do sitemap órfãs.** Todas as 31 recebem link interno.
Profundidade a partir de `/`: nível 1 com 20 páginas, nível 2 com 11. Nenhuma
URL do sitemap a mais de 2 cliques da home.

O problema é a *forma* da URL. Todas as páginas de subdiretório carregam
`<base href="/">` (24 de 63 arquivos), então `href="profissionais.html"` resolve
para `https://www.somosecooa.com.br/profissionais.html`. Mas o canonical e o
sitemap declaram `https://www.somosecooa.com.br/profissionais`.

```
1411  links internos para as 9 rotas de raiz usam a forma .html
  28  links internos usam a forma canônica sem extensão
```

Distribuição: `profissionais.html` 387, `blog.html` 159, `especialidades.html`
149, `localizacao.html` 144, `sublocacao.html` 141,
`qual-profissional-procurar.html` 113, `mentorias.html` 108, `sobre.html` 105,
`politicas.html` 105.

Ou seja: **98% da autoridade interna do site é entregue a URLs que o próprio
site declara não serem as canônicas.** Como os dois endereços respondem 200 no
GitHub Pages, o Google rastreia as duas formas e depende exclusivamente do
canonical para consolidar. É um risco que não precisava existir.

As subpáginas, ao contrário, linkam certo: `blog/queda-de-cabelo-causas/` e
`especialidades/medicina/` com barra final, exatamente como no sitemap.

### Páginas órfãs

31 das 63 páginas não recebem nenhum link interno: as 28 pontes de
redirecionamento, as 2 duplicatas (`blog/index.html`,
`especialidades/index.html`) e o `404.html`. As pontes serem órfãs é esperado e
correto, o ponto delas é atender URL antiga vinda de fora. As 2 duplicatas serem
órfãs confirma que existem por acidente de geração, não por decisão.

---

## 7. Metadados, social e sitemap

### O que está certo

| Item | Medição |
|---|---|
| `<link rel=canonical>` | 31/31, absoluto, autorreferente, um só por página |
| `og:url` = canonical | 31/31 |
| meta description única | 31/31 no sitemap; 33 valores distintos nas 35 páginas reais, os 2 repetidos são as duplicatas |
| tamanho da description | 77 a 215 chars, mediana 162 |
| `lang="pt-BR"` | 31/31 |
| `<meta viewport>` | 31/31 |
| `og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:image` | 31/31 |
| JSON-LD sintaticamente válido | 22/22 blocos parseiam sem erro |
| headings | 1 `<h1>` por página, 0 saltos de nível em 31 páginas |
| Lighthouse SEO | 100/100 em `/`, `/especialidades/medicina/`, `/blog/transplante-capilar-porto-alegre/` |
| `robots.txt` | sintaticamente válido, declara o sitemap, e documenta por escrito por que `/politicas` não é bloqueado |

Sobre o Lighthouse: 100 aqui significa apenas que título existe, descrição
existe, canonical existe, links são rastreáveis e o `robots.txt` é válido. Ele
não olha duplicação de título entre páginas, não olha schema de negócio local,
não olha conteúdo raso e não olha órfã. Os 100 pontos não contradizem nada deste
laudo.

### O que falta

**Twitter Cards incompletos em 31/31.** Só existe `twitter:card:
summary_large_image`. Faltam `twitter:title`, `twitter:description`,
`twitter:image` e `twitter:site` em todas as páginas. Funciona por herança do
`og:`, mas nada está sob controle explícito.

**`og:image` é a mesma foto em 31/31 páginas:**
`assets/fotos/recepcao-hero.webp`, medido com sharp em **1130 × 821, formato
WebP**. Três problemas somados: imagem única para 31 páginas diferentes; sem
`og:image:alt` (0/31) e sem `og:image:width`/`height`; e formato WebP, cujo
suporte a prévia é irregular no WhatsApp, que segundo `docs/ESTADO-REAL.md` §3 é
o canal principal de conversão do negócio.

**`lastmod` do sitemap é decorativo.** `scripts/sitemap.mjs` linha 47 usa
`process.env.SITEMAP_DATA || '2026-07-31'`: uma constante única aplicada às 31
URLs, sem relação com o arquivo. Os 5 arquivos que amostrei (`index.html`,
`sobre.html`, `qual-profissional-procurar.html`,
`especialidades/medicina/index.html`,
`blog/transplante-capilar-porto-alegre/index.html`) têm mtime **2026-08-01**
contra `lastmod` **2026-07-31**. O sitemap declara ao Google uma data anterior à
da última modificação real.

**`robots.txt` com entradas mortas.** `Disallow: /Sobrancelha.dc.html` e
`Disallow: /Rodape.dc.html` referenciam arquivos que não existem em `deploy/`.
E `Disallow: /404` mais `Disallow: /404.html` convivem com o `meta robots
noindex` da própria página, exatamente a contradição que o comentário do arquivo
descreve para justificar não bloquear `/politicas`. A regra foi aplicada em um
caso e não no outro.

**`hreflang`: 0 tags.** Site monolíngue pt-BR, um único mercado. **Não é
achado**, é corretamente inaplicável.

---

## 8. Imagens e higiene de assets

| Medição | Valor |
|---|---|
| `<img>` nas 31 páginas do sitemap | 215 |
| sem atributo `alt` | 0 |
| com `alt=""` | 32 |
| com `alt` de menos de 8 caracteres | 62 (quase todos os dois logos `alt="ecooa"` por página) |
| sem `width`/`height` | 0 de 223 |

O número que importa: **31 dos 32 `alt=""` estão na home e são exatamente os 31
retratos dos profissionais** (confirmado no navegador:
`[...document.images].filter(i => !i.alt).length === 31` em `/index.html`). São
as fotos das pessoas que o negócio vende, sem uma palavra descritiva. As páginas
de especialidade fazem certo: `alt="Retrato de Gustavo Gehrke"`,
`alt="Retrato de Larissa Wiebbelling"`.

**114 referências de imagem têm espaço não codificado no caminho**, apontando
para 31 arquivos com espaço no nome:
`assets/retratos/gustavo-gehrke pb.webp`, `assets/retratos/danusa fp.webp`,
`assets/retratos/jessica .webp` (espaço antes da extensão), `Adriano pb.webp`
com maiúscula. Navegador tolera; rastreador, CDN e cache não têm obrigação de
tolerar da mesma forma.

**10 headings vazios** nas 31 páginas do sitemap (um `<h2>` sem texto no fim da
home e de cada página de especialidade).

---

## 9. Cobertura de intenção de busca

Busca normalizada sem acento dos termos de cada consulta em `title`, `h1`,
`description` e corpo das 31 páginas.

| Consulta | Página que a atende | no `<title>` | no `<h1>` | na description | no corpo |
|---|---|---|---|---|---|
| clínica de saúde porto alegre | `/` | **sim** | não | sim | sim |
| nutricionista moinhos de vento | `/especialidades/nutricao/` | não | não | sim | sim |
| transplante capilar porto alegre | `/especialidades/transplante-capilar/` | não | não | sim | sim |
| harmonização facial porto alegre | `/especialidades/estetica-facial/` | não | não | sim | sim |
| psicólogo porto alegre | `/especialidades/saude-mental/` | não | não | sim | sim |
| dermatologista porto alegre | `/especialidades/medicina/` | não | não | sim | sim |
| emagrecimento porto alegre | `/especialidades/medicina/` e `/nutricao/` | não | não | sim | sim |
| botox porto alegre | nenhuma | não | não | não | só em `/qual-profissional-procurar` |
| preenchimento labial porto alegre | nenhuma | não | não | não | só em `/qual-profissional-procurar` |
| reposição hormonal porto alegre | nenhuma dedicada | não | não | não | espalhado em 21 páginas |

Leitura: **existe uma página certa para 7 das 10 consultas, e em 6 delas a
palavra-chave só aparece na meta description.** O título e o H1, os dois sinais
mais fortes da página, ignoram completamente a consulta. É o mesmo achado da §3
visto do lado do usuário: as páginas existem, o conteúdo existe, e a etiqueta
que o Google lê primeiro está errada em todas.

Três lacunas de cobertura de intenção transacional, sem página nem sinal
dedicado: `botox porto alegre`, `preenchimento labial porto alegre`,
`reposição hormonal porto alegre`. Os dois primeiros aparecem apenas dentro do
vocabulário da busca por IA, que não é conteúdo indexável de página.

Lacuna estrutural adicional: **31 profissionais, 0 URLs de profissional.** Eles
existem só como modal dentro de `/profissionais`. Busca por nome de profissional,
que num negócio de saúde local é volume garantido, não tem onde cair. Também não
há `Person` estruturado para nenhum deles fora do campo `author` dos artigos.

---

## 10. Medição: não existe

| Sinal | Estado |
|---|---|
| tag do GTM em `deploy/` | **0 de 63 arquivos HTML** referenciam `googletagmanager` ou `GTM-` |
| `google-site-verification` | ausente na home |
| Search Console | não verificável deste ambiente |
| relatório de indexação | inexistente |

`CLAUDE.md` declara `GTM-TSR4GDMK (analytics, interaction-only)` como parte do
stack. No site publicado esse contêiner não é carregado em página nenhuma.
Consequência para esta dimensão: não há como saber quantas das 31 URLs estão
indexadas, quantas caem em "Descoberta, não indexada", se as 12 páginas rasas já
foram desqualificadas, nem se os redirecionamentos por meta refresh estão sendo
seguidos. Toda afirmação sobre desempenho orgânico deste site hoje é chute.

---

## 11. Tabela de achados

| # | Sev | Achado | Evidência | Corrigível por IA |
|---|---|---|---|---|
| 1 | crítico | 24 das 31 URLs do sitemap compartilham `<title>` com outra página, 22 delas herdando o título do hub | 16 páginas com o título do editorial, 10 com o de especialidades; 11 títulos distintos em 35 páginas | sim |
| 2 | crítico | Nenhum dado estruturado de negócio local em todo o site | 0 `MedicalClinic`, 0 `LocalBusiness`, 0 `Organization` de site, 0 `BreadcrumbList`; home e `/localizacao` com 0 JSON-LD; marcador `data-ld-ecooa` em 0 de 63 arquivos | sim |
| 3 | crítico | 12 dos 14 artigos têm menos de 80 palavras próprias, com `Article` schema declarado | 315 a 425 chars próprios por artigo após subtrair cabeçalho e rodapé comuns | sim (retirar do sitemap / noindex); o texto em si depende do dono |
| 4 | alto | 98% dos links internos apontam para forma não canônica | 1411 links na forma `.html` contra 28 na forma sem extensão | sim |
| 5 | alto | Palavra-chave comercial ausente de `title` e `h1` em 6 das 7 consultas cobertas | tabela §9 | sim |
| 6 | alto | 20 URLs legadas redirecionam para hub genérico em vez da página específica | `especialidade/capilar` → `/especialidades` existindo `/especialidades/tricologia/`; idem psicologia, pele, corpo, hormonal, metabolismo e mais 14 | sim |
| 7 | alto | 28 redirecionamentos são meta refresh, não 301, e nenhum tem `noindex` | todas as pontes com `<meta http-equiv=refresh>` e `<title>Página movida</title>` | parcial: alvo e `noindex` sim, 301 exige painel Cloudflare |
| 8 | alto | 2 arquivos duplicados exatos criam duas URLs 200 para `/blog` e `/especialidades` | `diff` acusa só a linha `<base href="/">` | sim |
| 9 | médio | 31 retratos de profissionais na home com `alt=""` | `document.images` sem alt = 31 em `/index.html` | sim |
| 10 | médio | 31 profissionais sem URL própria e sem `Person` estruturado | só existem como modal em `/profissionais` | sim |
| 11 | médio | Twitter Cards incompletos e `og:image` único em WebP para as 31 páginas | falta `twitter:title/description/image/site` em 31/31; falta `og:image:alt` em 31/31; imagem única 1130×821 WebP | sim |
| 12 | médio | `lastmod` do sitemap é constante fixa e já está atrasado | `scripts/sitemap.mjs:47` usa `'2026-07-31'`; 5 de 5 arquivos amostrados têm mtime 2026-08-01 | sim |
| 13 | médio | Nenhuma tag de medição no site publicado | 0 de 63 HTML com `googletagmanager`; sem `google-site-verification` | não: exige conta do GTM e propriedade do Search Console |
| 14 | médio | Trilha de navegação visível existe mas sem `BreadcrumbList`, sem nó raiz e apontando para URL não canônica | `<nav aria-label="Trilha de navegação">` em 22 páginas, `href="especialidades.html"` | sim |
| 15 | baixo | 114 referências de imagem com espaço não codificado; 31 arquivos com espaço no nome | `assets/retratos/jessica .webp`, `gustavo-gehrke pb.webp` | sim |
| 16 | baixo | `Article` sem `image`, `dateModified`, `author.url` e `publisher.logo` | JSON-LD dos 14 artigos | sim |
| 17 | baixo | `robots.txt` bloqueia 2 arquivos inexistentes e contradiz a própria regra do `noindex` no `/404` | `Sobrancelha.dc.html` e `Rodape.dc.html` não existem em `deploy/` | sim |
| 18 | baixo | 10 headings vazios nas páginas do sitemap | um `<h2>` sem texto na home e em cada especialidade | sim |

---

## 12. O que não foi possível medir

| O que | Por quê |
|---|---|
| Códigos de status HTTP reais (301, 404, 200) em produção | o laboratório é um `SimpleHTTP` do Python, que não emula URL sem extensão do GitHub Pages nem o `404.html`. Medido: `/sobre` responde 404 local, `/especialidades` responde 301 para `/especialidades/`. O domínio real não é alcançável deste ambiente (proxy 403) |
| Como o GitHub Pages resolve `/especialidades` existindo `especialidades.html` **e** `especialidades/index.html` | depende da precedência do servidor. Se ele redirecionar a URL sem barra para a com barra, o sitemap passa a listar 2 URLs que redirecionam, e o canonical de `/especialidades/` apontaria para uma URL que redireciona de volta. Risco real, não confirmado |
| Estado de indexação, impressões, posição média, cobertura | não há Search Console verificável nem tag de medição; ver §10 |
| Se os redirecionamentos por meta refresh estão preservando sinal | só o Search Console de produção responde |
| Renderização e cache reais atrás da Cloudflare | a CSP e o cache que chegam ao visitante vêm de regra do painel, fora do repositório (`docs/ESTADO-REAL.md` §4) |
| Perfil da Empresa no Google, NAP externo, citações locais | fora do repositório e fora do alcance de rede deste ambiente |
| Validação oficial dos schemas pelo Rich Results Test do Google | exige chamada externa bloqueada. A validação feita aqui é sintática, mais conferência campo a campo contra o conteúdo visível |
| Canibalização real entre `/especialidades/nutricao/` e os artigos de nutrição | exige dado de consulta do Search Console |

---

## 13. Ordem de ataque sugerida

Pela razão entre impacto medido e esforço, não por gosto:

1. **Título único por página** (achado 1). Uma correção, 22 páginas destravadas,
   e é o pré-requisito de qualquer ganho nas consultas da §9.
2. **Rodar o `scripts/estruturados.mjs` que já existe** (achado 2), versionar, e
   acrescentar `BreadcrumbList` (achado 14).
3. **Decidir o destino das 12 páginas rasas** (achado 3): ou sai do sitemap com
   `noindex` até ter texto, ou ganha texto. Manter como está é a única opção que
   não serve.
4. **Padronizar a forma da URL nos links internos** (achado 4) e apagar as 2
   duplicatas (achado 8).
5. **Reapontar as 20 pontes para a página específica** e colocar `noindex` nelas
   (achados 6 e 7).
6. O resto.
