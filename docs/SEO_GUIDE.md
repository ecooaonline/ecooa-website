# SEO_GUIDE — ecooa-website

> Fase: P10 (MYTHOS). Data: 2026-06-14. Doc dono de SEO técnico (inclui a auditoria,
> anti-proliferação). Meta: Lighthouse SEO ≥ 99 — estado: **100** (PSI campo). Lei 30:
> schema é juramento público; todo campo deriva da fonte única e há conteúdo visível.

## 1. Indexação

- `robots.txt` (`public/`): não bloqueia o site nem assets; referencia o sitemap.
- Sitemap (`@astrojs/sitemap`): exclui noindex/redirects via `filter` (astro.config).
  Gate do Contrato (P08, `validate:output`) garante rotas estratégicas presentes e
  utilitárias (`/obrigado`, `/404`, `/offline`) fora.
- Canonical: `BaseLayout.astro` emite canonical absoluto no domínio canônico (`www`).
- `/obrigado`: `noindex, follow` (verificado).

## 2. Metadados

Titles e descriptions únicos por página (props do `BaseLayout`); OG/Twitter com imagem
social (`og-image.jpg` fallback + por página). Sem termo proibido nas descriptions
(guardião do P08 cobre o output).

## 3. Schema JSON-LD — Tabela de Rastreabilidade (Lei 30)

| Entidade (onde) | Campo | Fonte | Visível? |
|---|---|---|---|
| Organization/LocalBusiness (`BaseLayout`) | `telephone` | `PHONE_E164` (`constants.ts`) | sim (footer/contato) |
| idem | `address` | `ADDRESS_*` (`constants.ts`) | sim (footer/contato) |
| idem | `url`, `image` | constantes / asset real | sim |
| idem | `aggregateRating.ratingValue` | `REVIEW_RATING='5.0'` (política: todas 5★) | sim (selo + marquee) |
| idem | `ratingCount`/`reviewCount` | `REVIEW_COUNT = reviews.length` (`reviews.ts`) | sim (reviews exibidos) |
| Physician (`profissionais/[slug]`) | `name`, `image`, `jobTitle` | `professionals.ts` | sim (card/perfil) |
| Article/BlogPosting (`blog/[slug]`) | título, data, autor | frontmatter + `blog-authors` | sim |
| FAQPage (`index`, pilares) | perguntas/respostas | conteúdo visível da página | sim |

**Reviews/aggregateRating são REAIS** (`reviews.ts`: "avaliações reais e verificáveis no
Google", fonte pública declarada, curadas como 5★, count derivado). Zero dado inventado.
Robustez: `REVIEW_RATING` é travado em 5.0 por política de curadoria; adicionar avaliação
não-5★ exige recomputar (hoje o `Review` nem tem campo de nota).

## 4. Risco regulatório (→ P12 + jurídico)

**CFM/medicina restringe depoimentos e exibição de notas em publicidade médica.** O site
exibe `aggregateRating` (5.0, N avaliações) e depoimentos com superlativos ("melhor
clínica"). Tecnicamente o schema é verdadeiro e rastreável; a **conveniência regulatória**
de exibir nota/depoimentos numa clínica médica é decisão de **revisão jurídica** (P12).
Registrado em `DATA_GOVERNANCE.md` §6.

## 5. Slugs e redirects

Regra: slug indexado é estável; muda só com 301 (Lei 14). **PROM-06 (→ cutover):** os
slugs legados de nutrição usam meta-refresh (astro.config) hoje; no cutover Cloudflare,
mover para `public/_redirects` como **301 reais** e remover as páginas-redirect do build.
Cutover-gated (dono).

## 6. Para o P14 (keywords)

Termos de busca prováveis por página são HIPÓTESE até dado real do Search Console
(HIP-10). Verificação da propriedade GSC + envio do sitemap = roteiro/pendência do dono.
