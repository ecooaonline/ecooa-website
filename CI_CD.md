# CI/CD — ecooa-website

## Modelo de entrega

```
push claude/**
    └─► auto-merge.yml
           ├─ cria/atualiza PR (base: main)
           └─ habilita auto-merge squash
                  └─► CI roda (ci.yml) ────────────────► PR mergeado em main
                         ├─ format:check                       └─► deploy.yml
                         ├─ typecheck (astro check)                    └─ build + GitHub Pages
                         ├─ lint
                         ├─ audit:deps (bloqueia high/critical)
                         ├─ build
                         ├─ validate sitemap (≥ 100 URLs)
                         ├─ link check (não-bloqueante)
                         ├─ Lighthouse desktop
                         └─ Lighthouse mobile
```

## Workflows

| Arquivo                    | Gatilho           | Função                                     |
| -------------------------- | ----------------- | ------------------------------------------ |
| `ci.yml`                   | PR → main         | Quality gates completos (required check)   |
| `auto-merge.yml`           | push claude/\*\*  | Abre PR + habilita auto-merge squash       |
| `deploy.yml`               | push main         | Build + deploy GitHub Pages                |
| `dependabot-automerge.yml` | PR do Dependabot  | Auto-merge de patch/minor após CI          |
| `content-notify.yml`       | push blog em main | Resumo de posts publicados no step summary |

## Scripts locais

```bash
npm run dev           # servidor local
npm run build         # build de produção (gera dist/)
npm run preview       # preview do build local
npm run check         # TypeScript (astro check)
npm run typecheck     # alias de check
npm run lint          # ESLint (0 warnings tolerados)
npm run lint:fix      # ESLint com auto-fix
npm run format        # Prettier (escreve)
npm run format:check  # Prettier (valida, sem escrever)
npm run audit:deps    # npm audit --audit-level=high
npm run validate      # format:check + check + lint + build (gate local completo)
```

## Branch strategy

- `main` — produção. Protegida: PR obrigatório, CI required, sem force push.
- `claude/**` — branches de desenvolvimento AI. Auto-PR via `auto-merge.yml`.
- Squash merge padrão (histórico limpo em main).
- Sem GitFlow, sem develop: trunk-based simples.

## Node

Versão pinada em `.nvmrc` (`22.12.0`). Todos os workflows usam `node-version-file: .nvmrc`.

## Secrets necessários

| Secret                  | Uso                          | Obrigatório                        |
| ----------------------- | ---------------------------- | ---------------------------------- |
| `GITHUB_TOKEN`          | auto-merge, deploy Pages     | Automático (GitHub)                |
| `LHCI_GITHUB_APP_TOKEN` | comentários Lighthouse em PR | Opcional (sem ele: upload anônimo) |
| `CONTENT_WEBHOOK_URL`   | notificação de blog          | Opcional                           |

## Quality gates

Todos os gates rodam em `ci.yml` antes do merge:

Gates **determinísticos** (bloqueiam o merge):

| Gate                 | Ferramenta  | Bloqueante |
| -------------------- | ----------- | ---------- |
| Format check         | Prettier    | Sim        |
| TypeScript           | astro check | Sim        |
| Lint                 | ESLint      | Sim        |
| Deps (high/critical) | npm audit   | Sim        |
| Build                | astro build | Sim        |
| Sitemap (≥ 100 URLs) | grep + wc   | Sim        |
| Análise estática     | CodeQL      | Sim        |
| Links internos       | linkinator  | Não (warn) |

Gates de **performance/a11y/SEO** (relatório no CI, gate real em produção):

| Métrica                                   | Onde          | Status                       |
| ----------------------------------------- | ------------- | ---------------------------- |
| Performance / A11y / Best Practices / SEO | Lighthouse CI | Relatório (warn)             |
| Performance / A11y / Best Practices / SEO | PSI produção  | **Gate autoritativo (≥ 99)** |

> O Lighthouse roda no CI contra servidor local HTTP, execução única, sem paridade
> com browser real. Por isso é **relatório**, não bloqueio. A nota autoritativa é o
> PSI contra `https://www.somosecooa.com.br` (atual: 100/100/100/100), validado no
> `RELEASE_CHECKLIST.md`. Re-apertar thresholds do LHCI para `error` é tarefa futura,
> após calibrar com runs estáveis (ver AI_HANDOFF, Etapa 4).

## Pre-commit (local)

`husky` + `lint-staged`:

- `*.{ts,tsx,astro}` → eslint --fix + prettier --write
- `*.{json,md,css}` → prettier --write

## Rollback

Ver `ROLLBACK.md`.

## CI/CD Budget (anti-regressão)

1. Toda mudança passa por PR com CI verde.
2. Sem push direto em main.
3. Sem force push.
4. Sem segredo em código.
5. Sem dependência nova sem justificativa.
6. Sem alteração de workflow sem revisão.
7. Sem deploy manual sem registro.
8. Rollback sempre possível e documentado.
9. Revisão mensal: `npm audit` + Dependabot.
10. Revisão trimestral: thresholds Lighthouse + segurança.
