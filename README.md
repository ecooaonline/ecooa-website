# ecooa-website

Site institucional da **ecooa** — clínica multidisciplinar de saúde, estética e
longevidade em Moinhos de Vento, Porto Alegre. Site estático, foco em conversão
(agendamento via formulário + WhatsApp), SEO e performance.

## Stack

- **Astro 6** (saída estática) · **TypeScript** (strict)
- **npm** (lockfile `package-lock.json`) · **Node** fixado em `.nvmrc` (22.12.0)
- Fontes self-hosted (Arboria, Playfair) · CSS com design tokens · JS client-side mínimo
- Backend de formulários: Google Apps Script · Analytics: GTM (interaction-only)
- Deploy: GitHub Pages (atual) → **Cloudflare Workers Static Assets** (migração decidida no P03)

## Comandos

| Comando | Ação |
| :--- | :--- |
| `npm install` / `npm ci` | Instala dependências (use `ci` para reproduzir o lockfile) |
| `npm run dev` | Dev server (`localhost:4321`) |
| `npm run build` | Build de produção → `./dist/` (103 páginas) |
| `npm run preview` | Preview local do build |
| `npm run check` / `typecheck` | Diagnóstico Astro + TypeScript |
| `npm run lint` / `format` | ESLint / Prettier |
| `npm run validate` | Validações agregadas |

## Estrutura

```
src/
  pages/        rotas (.astro) + endpoints (.ts) + blog/
  layouts/      BaseLayout.astro (head, SEO, schema, scripts)
  components/   componentes reutilizáveis
  content/      coleção de blog (Markdown) — schema em content.config.ts
  data/         dados centralizados (constants.ts = fonte única de contato)
  scripts/      JS client-side (form-submit, analytics-events, match-engine, ...)
  styles/       base / components / responsive / tokens (CSS)
public/         estáticos (fontes, imagens, favicon, manifest, robots, sw)
docs/           documentação canônica (ver docs/AI_HANDOFF.md → Índice)
```

## Documentação

A fonte da verdade do projeto vive em `docs/`. Comece por **`docs/AI_HANDOFF.md`**
(visão geral, Índice de Documentação por tema, regras de preservação e estado da esteira).
Para desenvolver: **`docs/DEVELOPMENT.md`**. Arquitetura: **`docs/ARCHITECTURE.md`**.

## Regras inegociáveis (resumo)

- Sem em-dash. Acentos pt-BR obrigatórios no conteúdo.
- Dados de contato só via `src/data/constants.ts` (fonte única).
- Identidade visual, fotos, fontes, cursor, CTAs e rotas: não alterar sem autorização.
- Nada de promessa absoluta / termos proibidos (nicho de saúde regulado).
