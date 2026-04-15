# ecooa-website

## Idioma

Sempre responder em português brasileiro (pt-BR).

## Stack

- Astro 6 (site estático)
- TypeScript
- GitHub Pages (deploy)
- Formspree (formulários)
- GTM-TSR4GDMK (analytics, interaction-only)

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
