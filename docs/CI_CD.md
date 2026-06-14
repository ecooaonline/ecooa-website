# CI/CD — ecooa-website

> Fase: P08 (MYTHOS). Data: 2026-06-14. Doc dono de CI/CD. Drena o
> `docs/_legacy/CI_CD.md`. Gates detalhados: `QUALITY_GATES.md`. Deploy: `DEPLOYMENT.md`.

## Workflows (`.github/workflows/`)

| Arquivo | Gatilho | Função |
|---|---|---|
| `ci.yml` | PR → main | Quality Gates + Lighthouse (required check) |
| `auto-merge.yml` | push `claude/**` | Abre PR + habilita auto-merge squash |
| `deploy.yml` | push `main` | Build + deploy GitHub Pages (até o cutover Cloudflare) |
| `dependabot-automerge.yml` | PR do Dependabot | Auto-merge patch/minor após CI |
| `content-notify.yml` | push blog em `main` | Resumo de posts no step summary |

CodeQL (Analyze) roda como check separado (segurança estática).

## Job `quality` (ci.yml) — ordem dos steps

`npm ci` → `format:check` → `check` (astro/TS) → `lint` (0 warnings) →
`audit --audit-level=high` → `build` → **`validate:output`** (Gate do Contrato +
Guardião regulatório) → link check (não-bloqueante).

## Job `lighthouse` (ci.yml)

Desktop (`lighthouserc.json`) com LCP/CLS em **`error`** (bloqueante); mobile
(`lighthouserc.mobile.json`) em **`warn`** (folga grande, promoção a `error` é item
do budget). Nota autoritativa = PSI de produção (campo, Lei 4): 100/100/100/100.

## Scripts locais

`npm run validate` = `format:check && check && lint && build && validate:output`
(gate local completo). Demais: `dev`, `build`, `preview`, `check`, `lint`, `format`,
`audit:deps`. Pre-commit (husky + lint-staged): eslint --fix + prettier nos staged.

## Branch strategy

- `main` — produção. PR + CI required, sem force push (pendência do dono: confirmar
  branch protection no painel).
- `claude/**` — branches de desenvolvimento. Squash merge (histórico limpo).
- Trunk-based simples (sem develop/GitFlow).

## Node e secrets

Node pinado em `.nvmrc` (22.12.0); `packageManager: npm@10.9.7`. Secrets:
`GITHUB_TOKEN` (automático), `LHCI_GITHUB_APP_TOKEN` (opcional), `CONTENT_WEBHOOK_URL`
(opcional). Zero segredo em código.

## CI/CD Budget (anti-regressão)

1. Toda mudança por PR com CI verde. 2. Sem push direto em main ¹. 3. Sem force push.
4. Sem segredo em código. 5. Sem dependência nova sem justificativa. 6. Sem alteração de
workflow sem revisão. 7. Sem deploy manual sem registro. 8. Rollback sempre possível
(`ROLLBACK.md`). 9. Mensal: `npm audit` + Dependabot. 10. Trimestral: thresholds
Lighthouse + segurança.

¹ Exceção operacional vigente: durante o loop MYTHOS autônomo, merges são feitos via
git local após verificação (build/check/lint/gate verdes) + red-team, por decisão do
dono. O gate de CI valida em paralelo no PR.

## Pendências do dono (painel)

- Confirmar branch protection da `main` (required checks: Quality Gates, Lighthouse,
  CodeQL) e "Allow GitHub Actions to create PRs" (para o job `open-pr`).
