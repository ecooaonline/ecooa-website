# ecooa — Arquitetura técnica

## Stack

- **Framework**: Astro 6 (SSG, zero-JS por padrão)
- **Linguagem**: TypeScript strict (`astro/tsconfigs/strict`)
- **Estilo**: CSS puro em 6 camadas (`tokens → base → layout → components → animations → responsive`)
- **Conteúdo**: Markdown em `src/content/blog/` com schema em `src/content.config.ts`
- **Deploy**: GitHub Pages via `actions/deploy-pages`
- **Preview**: Vercel (PRs)
- **CI/CD**: GitHub Actions (auto-merge, Lighthouse, CodeQL, Dependabot)

## Princípio zero-dependência no runtime

O projeto **não usa nenhuma biblioteca JavaScript no browser**. Sem React, Vue, Svelte, Alpine, ou similar. Todo JS em `src/scripts/` é TypeScript puro compilado para ES modules, sem imports de npm.

Exceção intencional: `import '../scripts/cursor'` no BaseLayout usa Astro bundling mas não adiciona deps externas.

**Antes de adicionar qualquer `import` de pacote npm em scripts client, questione se é necessário.**

## Estrutura de pastas

```
src/
  components/       # Componentes Astro reutilizáveis
  content/blog/     # 34 artigos em Markdown
  content.config.ts # Schema Zod dos posts
  data/             # Fonte única de dados
    constants.ts    # Config (GTM_ID, FORM_ACTION, META_PIXEL_ID via import.meta.env)
    professionals.ts # 30 profissionais — fonte de verdade
    blog-authors.ts # View derivada de professionals.ts
    specialties.ts  # 13 especialidades
    match-intents.ts # 38 intenções para o match engine
  env.d.ts          # Declarações globais de Window (gtag, fbq, dataLayer)
  layouts/
    BaseLayout.astro # SEO, JSON-LD Organization+WebSite, GTM, Pixel, scripts core
  pages/            # 22 páginas + rotas dinâmicas
  scripts/          # Scripts client (TS, zero deps externas)
  styles/           # CSS em 6 camadas
public/
  fonts/            # Fontes self-hosted (Arboria, Playfair Display)
  team/             # Fotos dos profissionais (WebP + AVIF)
  clinic/           # Fotos da clínica
  favicon/          # Ícones + og-image
  manifest.json     # PWA manifest
  sw.js             # Service Worker
  robots.txt        # Configuração completa de crawlers
```

## Fluxo de dados

```
professionals.ts ──► blog-authors.ts (view derivada)
                 └──► profissionais/[slug].astro
                 └──► match engine

specialties.ts ──► especialidades.astro
               └──► especialidade/[specialty].astro

constants.ts ──► BaseLayout.astro (GTM, Pixel)
            └──► agendamento.astro, contato.astro, blog/[slug].astro (FORM_ACTION)
```

## Configuração via variáveis de ambiente

Todas as configurações mutáveis são lidas de `import.meta.env` com fallback para os valores de produção:

| Variável               | Arquivo        | Visível no browser?        |
| ---------------------- | -------------- | -------------------------- |
| `PUBLIC_GTM_ID`        | `constants.ts` | Sim (intencional)          |
| `PUBLIC_META_PIXEL_ID` | `constants.ts` | Sim (intencional)          |
| `FORM_ACTION`          | `constants.ts` | Sim (é o `action` do form) |

Para staging, crie um `.env` local. Para CI, use GitHub repository variables/secrets.

## SEO e Structured Data

- **Global** (BaseLayout): `MedicalBusiness` + `WebSite` com `SearchAction`
- **Blog posts**: `Article` ou `MedicalWebPage` conforme a categoria
- **Profissionais**: `Physician` ou `Person` conforme o profissional
- **Especialidades**: `MedicalWebPage` com `specialty` mapeada por unidade

## Performance

- Fontes: preload apenas das 4 críticas above-fold (`arboria-300/400/500`, `playfair-italic`)
- Imagens: `OptimizedImage.astro` entrega `<picture>` com AVIF + WebP
- JS: `requestIdleCallback` para analytics e service worker
- Speculation Rules: prerender/prefetch das rotas mais prováveis
- GTM + Meta Pixel: só carregam após interação do usuário (scroll/click/touch) E consentimento de cookie

## Tooling de DX

```bash
npm run check          # astro check (TypeScript)
npm run lint           # ESLint (zero warnings tolerados)
npm run lint:fix       # ESLint com autofix
npm run format         # Prettier (formata tudo)
npm run format:check   # Prettier (só verifica)
npm run build          # Build de produção
npm run dev            # Dev server
npm run preview        # Preview do build
```

Pre-commit hook (husky + lint-staged): roda lint+format automaticamente nos arquivos staged.
