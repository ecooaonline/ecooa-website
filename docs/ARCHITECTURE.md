# ARCHITECTURE — ecooa-website

> Fase: P05 (MYTHOS). Data: 2026-06-14. Doc dono da arquitetura técnica.
> Rotas/páginas: `INFORMATION_ARCHITECTURE.md` (Matriz). Infra/deploy: `INFRASTRUCTURE.md`
> + `DEPLOYMENT.md`. Conversão: `CONVERSION_GOVERNANCE.md`.

## 1. Visão geral

Site **estático** gerado por Astro 6 em build (`astro build` → `dist/`, 103 páginas).
Zero runtime server-side próprio; o único backend é o Google Apps Script (formulários),
externo ao repositório. JavaScript client-side é mínimo e carregado sob demanda.

## 2. Framework e build

- **Astro 6**, saída `static`. Config: `astro.config.mjs` (integração de sitemap, etc.).
- **TypeScript** strict (`tsconfig.json`). Checagem: `astro check`.
- Saída `dist/` com assets hasheados (`/_astro/*`).

## 3. Estrutura de pastas

| Pasta | Papel |
|---|---|
| `src/pages/` | Rotas `.astro` + endpoints `.ts` (`llms.txt.ts`, `rss.xml`) + `blog/` dinâmico |
| `src/layouts/` | `BaseLayout.astro` — `<head>`, SEO/OG, JSON-LD, carga de GTM/Pixel, FAB, consent |
| `src/components/` | Componentes (Nav, Footer, ProfessionalCard, NewsletterCapture, WhatsAppFab, CtaSection, ...) |
| `src/content/blog/` | Artigos em Markdown; schema em `src/content.config.ts` |
| `src/data/` | Dados centralizados (ver §4) |
| `src/scripts/` | JS client-side (ver §5) |
| `src/styles/` | `base.css`, `components.css`, `responsive.css`, `tokens.css` |
| `public/` | Estáticos: `fonts/`, `clinic/`, `team/`, `favicon/`, `manifest.json`, `robots.txt`, `sw.js` |
| `scripts/` | `generate-embeddings.mjs` (embeddings do match, build-time/manual) |

## 4. Dados e fonte única

- **`src/data/constants.ts`** — **fonte única** de contato e identificadores públicos:
  `WA_BASE`/`WA_DEFAULT`, `PHONE`/`PHONE_E164`/`PHONE_INTL`, `EMAIL`, `INSTAGRAM`,
  `ADDRESS_*`, `GTM_ID`, `FORM_ACTION`, `META_PIXEL_ID`. Toda página/componente/schema
  consome daqui; **proibido hardcodar** valor de contato (provado por grep, ver
  `CONVERSION_GOVERNANCE.md` §4).
- `professionals.ts` — 30 profissionais (nome, slug, role, registro, unit, blogAuthor...).
- `specialties.ts`, `reviews.ts`, `blog-authors.ts` (deriva de professionals),
  `seo.ts`, `match-intents.ts`.

## 5. Scripts client-side

`form-submit.ts` (conversão por POST nativo + newsletter no-cors), `analytics-events.ts`
(eventos GA4/Pixel por delegação), `match-engine.ts` (busca semântica local),
`web-vitals.ts`, `cursor.ts`, `carousel.ts`, `extract-headings.ts`, `add-heading-ids.ts`.
Todos importados sob demanda; nenhum bloqueia render.

## 6. Rotas e conversão

Rotas e contagem oficial (Contrato de Páginas = 103) vivem na **Matriz** do
`INFORMATION_ARCHITECTURE.md`. O funil crítico (formulário → GAS → `/obrigado`) é
governado por `CONVERSION_GOVERNANCE.md` e `INTEGRATIONS.md` (Contrato de Resposta).

## 7. Integrações externas

Google Apps Script (`FORM_ACTION`), GTM (`GTM_ID`), Meta Pixel (`META_PIXEL_ID`) — todos
identificadores públicos, sobrescrevíveis por env. Detalhe e posse em `INTEGRATIONS.md`.

## 8. Decisões principais (referência)

Registradas como DEC-NN em `STRATEGY.md` (P01) e `INFRASTRUCTURE.md` (P03): plataforma
Cloudflare Workers, conversão verificável pelo servidor (CP-01), fonte única técnica (P04).

## 9. O que não alterar sem autorização

Mapa de Preservação Absoluta do `P00_AUDITORIA.md` (fotos, fontes, cursor, logo, paleta,
texturas, CTAs, copy, rotas, slugs). Resumo operacional em `AI_HANDOFF.md`.
