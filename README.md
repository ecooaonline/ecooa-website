# Tier 5+ Starter Template

Template de site premium para marcas de saude, baseado na arquitetura ecooa.

## Quick Start

```bash
npm install
npm run dev
```

## Configuracao

1. Edite `src/data/site.ts` — substitua todos os `TODO_*` pelos dados reais
2. Edite `src/data/professionals.ts` — adicione os profissionais
3. Edite `src/content.config.ts` — defina as categorias do blog
4. Adicione fontes em `public/fonts/` e atualize `src/styles/base.css`
5. Adicione favicon em `public/favicon/`
6. Atualize `astro.config.mjs` com o dominio real
7. Atualize `public/robots.txt` e `public/manifest.json`

## Estrutura

```
src/
  layouts/BaseLayout.astro    — layout raiz (SEO, schema, analytics, consent)
  components/                 — componentes reutilizaveis
  pages/                      — paginas do site
  styles/                     — tokens, base, layout, components, responsive
  scripts/                    — form-submit, web-vitals
  data/                       — site config, profissionais
  content/blog/               — posts em Markdown
public/
  fonts/                      — woff2 self-hosted
  team/                       — fotos profissionais (webp + avif)
  favicon/                    — favicons
  sw.js                       — service worker
  manifest.json               — PWA manifest
  robots.txt                  — crawlers
```

## Criar paginas de pilar

1. Duplique `src/pages/pilar-template.astro`
2. Renomeie para o slug do pilar (ex: `ecooa-med.astro`)
3. Substitua os `TODO_*`
4. Adicione a rota em `src/data/site.ts` (PILLARS + NAV_LINKS)

## Adicionar profissional

1. Adicione entrada em `src/data/professionals.ts`
2. Adicione foto em `public/team/` (webp + avif)
3. Build — pagina gerada automaticamente se rota dinamica configurada

## Checklist pre-lancamento

- [ ] Todos os `TODO_*` substituidos
- [ ] Fontes em woff2 adicionadas
- [ ] Fotos otimizadas (webp + avif, < 200KB)
- [ ] GTM e Pixel IDs configurados
- [ ] Google Apps Script URL configurada
- [ ] Lighthouse >= 91 em todas as categorias
- [ ] Schema validado no Google Rich Results Test
- [ ] robots.txt e sitemap corretos
- [ ] HSTS ativado no Cloudflare
- [ ] Cookie consent funcional
- [ ] Formularios testados end-to-end
- [ ] Mobile responsivo verificado

## Stack

- Astro 6
- TypeScript strict
- Zero dependencias JS externas
- CSS modular com tokens
- GitHub Pages + Cloudflare

## Thresholds Lighthouse

| Metrica | Minimo |
|---------|--------|
| Performance | 90 |
| Accessibility | 90 |
| Best Practices | 90 |
| SEO | 95 |
| LCP | <= 2500ms |
| CLS | <= 0.1 |
| TBT | <= 300ms |
