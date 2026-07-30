# ecooa-website

## Idioma

Sempre responder em português brasileiro (pt-BR).

## Stack

- Astro 6 (site estático)
- TypeScript
- GitHub Pages (deploy atual); migração para Cloudflare Workers decidida no P03
- Google Apps Script (formulários)
- GTM-TSR4GDMK (analytics, interaction-only)

Fonte da verdade técnica: **`docs/ESTADO-REAL.md`**.

Atenção: o repositório tem dois projetos. O publicado é o site 3.0 estático, em
`deploy/`, gerado por `node scripts/gerar-site.mjs`. O projeto Astro em `src/`
não está no ar. Os 41 documentos antigos de `docs/` descrevem o Astro e nenhum
menciona `deploy/`; `docs/AI_HANDOFF.md` traz um aviso no topo sobre isso.

## Regras do projeto

- Sem em-dash (—). Usar ponto ou vírgula.
- Fontes self-hosted apenas. Sem Google Fonts externo ou bibliotecas JS externas.
- Acentos em português obrigatórios no conteúdo (ç, á, é, ã, õ, etc.).
- Labels de navegação são lowercase intencionalmente (identidade da marca).
- Valores de `category` no frontmatter dos blogs NÃO podem ter acento: `medicina`, `estetica`, `nutricao`, `saude-mental`, `longevidade`, `ecooa`.
- Schema definido em `src/content.config.ts`.

## Estrutura principal

- `src/pages/` - Páginas Astro
- `src/components/` - Componentes reutilizáveis
- `src/content/blog/` - Artigos do blog (Markdown)
- `src/data/professionals.ts` - Dados centralizados dos 30 profissionais
- `src/styles/` - CSS global (components.css, responsive.css)
