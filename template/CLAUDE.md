# ARQ-ECOOA Template

## Idioma

Sempre responder em português brasileiro (pt-BR).

## Stack

- Astro 6 (site estático)
- TypeScript strict
- GitHub Pages ou Cloudflare Pages (deploy)
- Google Apps Script (formulários backend)
- Cloudflare (CDN, SSL, HSTS)
- Zero dependências JS externas
- Fontes self-hosted apenas

## Regras do projeto

- Sem em-dash. Usar ponto ou vírgula.
- Fontes self-hosted apenas. Sem Google Fonts externo ou bibliotecas JS externas.
- Acentos em português obrigatórios no conteúdo (ç, á, é, ã, õ, etc.).
- Labels de navegação são lowercase intencionalmente (identidade de marca).
- Valores de `category` no frontmatter dos blogs NÃO podem ter acento: `medicina`, `estetica`, `nutricao`, `saude-mental`, `longevidade`.
- Schema de blog definido em `src/content.config.ts`.
- GTM e Meta Pixel são consent-gated (LGPD). Só carregam após aceite de cookies.
- Todas as imagens usam `<picture>` com AVIF source + WebP fallback.
- Service Worker com cache-first para assets, network-first para HTML.

## Estrutura principal

- `src/pages/` - Páginas Astro
- `src/components/` - Componentes reutilizáveis
- `src/content/blog/` - Artigos do blog (Markdown)
- `src/data/professionals.ts` - Dados centralizados dos profissionais
- `src/data/site.ts` - Configuração centralizada (domínio, contato, redes, GTM, Pixel)
- `src/data/match-intents.ts` - Intenções curadas para o match engine
- `src/scripts/` - Scripts client-side (form, analytics, web-vitals, match)
- `src/styles/` - CSS global (tokens, base, layout, components, responsive)
- `src/layouts/BaseLayout.astro` - Layout base com SEO, schema, analytics

## Placeholders

Todos os valores configuráveis usam prefixo `TODO_`. Buscar e substituir ao iniciar novo projeto:

```bash
grep -r "TODO_" template/src/ --include="*.astro" --include="*.ts"
```

## Padrões

- Componentes Astro usam `<style>` scoped. Para estilizar children de outros componentes, usar `:global()` ou CSS em `styles/components.css`.
- Forms usam `src/scripts/form-submit.ts` com retry e redirect para `/obrigado`.
- Analytics via `src/scripts/analytics-events.ts`, carregado com `requestIdleCallback`.
- Web Vitals reportados via `src/scripts/web-vitals.ts` para GA4.

## Requisitos de qualidade (Tier 5+)

- Lighthouse Performance >= 90
- Lighthouse Accessibility >= 90
- Lighthouse Best Practices >= 90
- Lighthouse SEO >= 95
- LCP <= 2500ms
- CLS <= 0.1
- INP <= 200ms
