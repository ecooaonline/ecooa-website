# DEVELOPMENT — ecooa-website

> Fase: P05 (MYTHOS). Data: 2026-06-14. Como instalar, rodar, validar e contribuir.

## Pré-requisitos

- **Node** 22.12.0+ (`.nvmrc` = 22.12.0; `engines.node >= 22.12.0`). Use `nvm use`.
- **npm** 10.9.7 (`packageManager` fixado). Use `npm ci` para reproduzir o lockfile.

## Instalação e execução

```sh
nvm use            # alinha o Node ao .nvmrc
npm ci             # instala exatamente o lockfile (reprodutível)
npm run dev        # dev server em http://localhost:4321
npm run build      # build de produção → dist/ (103 páginas)
npm run preview    # serve o dist/ localmente
```

## Checagens (rodar antes de commitar)

```sh
npm run check        # astro check (diagnóstico + typecheck)
npm run lint         # eslint --max-warnings 0
npm run format:check # prettier
npm run validate     # validações agregadas
npm run audit:deps   # auditoria de dependências
```

Há hook de pre-commit (lint-staged): ESLint + Prettier rodam nos arquivos staged.

## Teste do Clone Limpo (reprodutibilidade — P05/Lei 20)

Provado em 2026-06-14: `rm -rf node_modules && npm ci && npm run build && npm run check`
→ verde, ~24s total (ci 8s + build 6s), 103 páginas. **Sem passo secreto.** Se você
precisar de um passo extra não documentado aqui, isso é um bug de DX: documente ou corrija.

## Convenções

- **Sem em-dash** (—). Usar ponto ou vírgula.
- **Acentos pt-BR** obrigatórios no conteúdo (ç, á, é, ã, õ...).
- Labels de navegação em **lowercase** (identidade de marca, intencional).
- `category` no frontmatter de blog **sem acento** (`medicina`, `estetica`, `nutricao`,
  `saude-mental`, `longevidade`, `ecooa`).

## Como editar dados

- **Contato** (telefone, WhatsApp, e-mail, endereço, IDs): **só** em
  `src/data/constants.ts`. Nunca hardcodar em página/componente/schema.
- **Profissionais**: `src/data/professionals.ts`.
- **Blog**: novo `.md` em `src/content/blog/` seguindo o schema de `src/content.config.ts`.

## Troubleshooting

- Build falha por tipo: `npm run check` mostra o erro com arquivo/linha.
- `lint` reclama de em-dash/termo proibido: ajustar o texto (regra de marca).
- Imagem nova não aparece: confirme o caminho em `public/` e a referência no `src/`.
- Após mexer no funil de formulário: re-executar o Protocolo de Teste de Conversão
  (`CONVERSION_GOVERNANCE.md` §8) — regra de ferro do P04.
