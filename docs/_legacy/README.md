# docs/_legacy — material pré-MYTHOS (referência)

Estes documentos são de sprints anteriores (abr–mai/2026, era GitHub Pages / Vercel /
Formspree) e foram **superados pela documentação canônica MYTHOS** em `docs/` (P00–P15).
Ficam aqui por dois motivos:

1. **Histórico** — registro de decisões e estados antigos do projeto.
2. **Garimpo (nuggets)** — alguns guardam conteúdo único ainda não fundido no canon; as
   fases seguintes os drenam (ex.: a matriz de claims YMYL de `CONFORMIDADE-MEDICA-P0.md`
   será fundida no `DATA_GOVERNANCE.md`/compliance no P12; a matriz de CTAs de
   `P1-HIERARQUIA-CTAS.md` no `CONVERSION_GOVERNANCE.md`).

Nada aqui é fonte da verdade. Em conflito, vale o canon em `docs/`. Quando uma fase
fundir o conteúdo único de um arquivo, ele deve ser removido daqui.

| Arquivo | Era | Superado por |
|---|---|---|
| `ARCHITECTURE.md` | GitHub Pages/Vercel | `docs/ARCHITECTURE.md` + `INFRASTRUCTURE.md` |
| `CI_CD.md` | deploy.yml/Pages | `DEPLOYMENT.md` (canon de CI/CD virá no P08) |
| `SECURITY.md` | Pages + Transform Rules | `INFRASTRUCTURE.md` (canon de segurança virá no P07) |
| `ONBOARDING.md` | Formspree/Pages | `docs/DEVELOPMENT.md` + `CLAUDE.md` |
| `AI_HANDOFF.md` | modelo "9 etapas" | `docs/AI_HANDOFF.md` (esteira MYTHOS) |
| `README-OPERACIONAL.md` | Vercel, v1.0 | `docs/DEPLOYMENT.md` + `INFRASTRUCTURE.md` |
| `RELATORIO-TECNICO-IMPLEMENTACAO.md` | sprint abr/2026 | `docs/P00_AUDITORIA.md` |
| `COMANDO-GENESIS-ECOOA.md` | prompt de reconstrução | `STRATEGY`+`INFRASTRUCTURE` |
| `SKILL-MAXIMA-ECOOA.md` | referência 05/2026 | `STRATEGY`/`INTEGRATIONS`/`DATA_GOVERNANCE` |
| `CONFORMIDADE-MEDICA-P0.md` | matriz YMYL | a fundir no compliance (P12) |
| `P1-HIERARQUIA-CTAS.md` | matriz de CTAs | a fundir em `CONVERSION_GOVERNANCE.md` |
