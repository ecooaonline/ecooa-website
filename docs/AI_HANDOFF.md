# AI_HANDOFF — espelho-mestre do ecooa-website

> Fase: P05 (MYTHOS). Data: 2026-06-14. Ponto de entrada para humanos e IA.
> Este é um **espelho**: resume; em conflito, vale o **doc dono** (ver Índice §6).

## 1. Stack e versões

Astro 6 · TypeScript strict · npm 10.9.7 · Node 22.12.0 (`.nvmrc`) · saída estática.
Deploy: GitHub Pages (atual) → Cloudflare Workers Static Assets (P03). Backend de form:
Google Apps Script. Analytics: GTM (`GTM-TSR4GDMK`, interaction-only) + Meta Pixel.

## 2. Comandos

`npm ci` · `npm run dev|build|preview|check|lint|format|validate`. Detalhe em
`DEVELOPMENT.md`. Build = **103 páginas** (Contrato de Páginas, P02).

## 3. Estrutura

Ver `ARCHITECTURE.md`. Chave: `src/data/constants.ts` é a **fonte única** de contato;
`src/scripts/form-submit.ts` + `src/pages/obrigado.astro` são o coração da conversão.

## 4. Preservação absoluta (resumo; dono = `P00_AUDITORIA.md`)

Não alterar sem autorização explícita: **fotos, fontes (Arboria/Playfair), cursor, logo,
paleta, texturas, CTAs (texto e destino), copy aprovada, rotas e slugs**. Identidade de
marca: navegação em lowercase é intencional. Conteúdo regulado (saúde): sem promessa
absoluta / termos proibidos.

## 5. Arquivos sensíveis

- `src/data/constants.ts` — contato + IDs públicos (sem segredos; valores reais são
  públicos por natureza). Segredos verdadeiros vivem no painel do dono (GAS/GTM).
- `google-apps-script.js` (raiz) — cópia de referência do backend de formulários.
- `public/_redirects`, `public/robots.txt`, `public/sw.js`, `public/manifest.json`.

## 6. Índice de Documentação (tema → doc dono → espelhos)

| Tema | Doc dono | Espelhos que resumem |
|---|---|---|
| Estratégia / funil / conversão (negócio) | `STRATEGY.md` | este handoff §8 |
| Requisitos | `REQUIREMENTS.md` | — |
| Escopo / hipóteses / **Promessas** | `SCOPE.md` | este handoff §9 |
| Páginas / rotas / Contrato | `INFORMATION_ARCHITECTURE.md` (Matriz) | `ROUTE_MAP.md`, `SITEMAP_PLAN.md`, README |
| Infra / plataforma / DNS | `INFRASTRUCTURE.md` | README, ARCHITECTURE §2/§8 |
| Deploy / build / ambientes | `DEPLOYMENT.md` + `ENVIRONMENT.md` | README, DEVELOPMENT |
| Rollback / incidentes | `ROLLBACK.md` | — |
| Conversão técnica / contratos | `CONVERSION_GOVERNANCE.md` + `INTEGRATIONS.md` | este handoff §3 |
| Eventos / medição | `EVENTS_TRACKING_PLAN.md` | — |
| Dados pessoais / LGPD | `DATA_GOVERNANCE.md` | — |
| Arquitetura técnica | `ARCHITECTURE.md` | README |
| DX / como rodar | `DEVELOPMENT.md` | README |
| Performance (budget) | `PERFORMANCE_BUDGET.md` | (P06 ratificado) |
| Segurança / headers / CSP | `SECURITY.md` | (aplicação cutover-gated) |
| CI/CD / gates de qualidade | `CI_CD.md` + `QUALITY_GATES.md` | este handoff §8 |
| Acessibilidade | `ACCESSIBILITY_CHECKLIST.md` | — |
| SEO técnico / schema | `SEO_GUIDE.md` | — |
| Design system / tokens | `DESIGN_SYSTEM.md` | (P11 refina) |
| Conteúdo / copy / CRO | `CONTENT_CRO_BUDGET.md` + `TONE_OF_VOICE.md` | (P12 refina) |
| Release / checklist | `RELEASE_CHECKLIST.md` | — |

Regra anti-proliferação: doc novo só se nenhum existente for o dono natural do tema.
Pré-MYTHOS superado vive em `docs/_legacy/` (não é fonte da verdade).

## 7. Tabela de Espelhos + protocolo (Lei 21)

| Espelho | Confere com (dono) |
|---|---|
| `AI_HANDOFF.md` (este) | todos os donos do Índice §6 |
| `README.md` | DEVELOPMENT, ARCHITECTURE, INFORMATION_ARCHITECTURE |
| `ROUTE_MAP.md` / `SITEMAP_PLAN.md` | INFORMATION_ARCHITECTURE (Matriz) |

**Protocolo:** toda fase que alterar um doc dono atualiza os espelhos **na mesma entrega**.
Item de aceite de todas as fases: "espelhos conferidos". O **P13** audita a tabela inteira.

## 8. Estado da esteira MYTHOS

| Fase | Estado |
|---|---|
| P00 Auditoria | ✅ persistida (`P00_AUDITORIA.md`) |
| P01 Estratégia/Requisitos/Escopo | ✅ |
| P02 Arquitetura de informação | ✅ (Matriz + Contrato=103) |
| P03 Infraestrutura/deploy | ✅ (Cloudflare decidido; cutover pendente do dono) |
| P04 Conversão/dados/integrações | ✅ substancial; **gate HIP-09 (teste E2E em produção) pendente do dono** |
| P05 Fundação e DX | ✅ (faxina + reorg de docs + clone limpo) |
| P06 Performance | ✅ ratificado (campo PSI 100/100/100/100; Rito de Regressão ativo) |
| P07 Segurança | ✅ substancial (`SECURITY.md` canon: escada de CSP, headers, budget); **aplicação + verificação cutover-gated (dono)** |
| P08 CI/CD | ✅ Gate do Contrato + Guardião regulatório bloqueantes (`validate:output`); Tabela de Gates (`QUALITY_GATES.md`) |
| P09 Acessibilidade | ✅ tabela de contraste (ratios calculados); corrigiu 4 `outline:none` que matavam o foco; roteiro de leitor de tela = pendência do dono |
| P10 SEO técnico | ✅ schema rastreável à fonte única (zero dado inventado); `SEO_GUIDE.md`; flag CFM de aggregateRating → P12; PROM-06 (301) cutover-gated |
| P11 UX/UI → P15 | ⏳ a executar em loop |

## 9. Promessas e pendências abertas (dono = `SCOPE.md` §9)

- **HIP-09** — teste E2E do formulário em produção com confirmação de chegada do lead
  (gate do P04). **Dono.**
- **PROM-10** — criar trigger `form_submit_success` no GTM. **Dono (painel).**
- **PROM-01/04/05** — noindex de preview, cache, CSP/headers → **P07**.
- **PROM-03** — gate do Contrato de Páginas no CI → **P08**.
- **PROM-06** — slugs legados 301 reais → **P10**.
- **PROM-07/08** — estanqueidade de leads / match em preview CF → após HIP-09 / cutover.
- Pendência: ligar "Allow GitHub Actions to create PRs" (Settings) para o job `open-pr`.

## 10. Matriz de continuidade (P06–P15)

| Fase | Arquivos-foco | Preservar | Pode alterar | Exige autorização |
|---|---|---|---|---|
| P06 Performance | styles/, imagens, fontes, BaseLayout | identidade visual | atributos de img/fonte, CSS crítico | trocar foto/fonte |
| P07 Segurança | `public/_headers`, CSP | funil de conversão | headers, CSP escalonada | quebrar form/analytics |
| P08 CI/CD | `.github/workflows/`, `validate` | gates verdes | thresholds, gates novos | baixar threshold |
| P09 Acessibilidade | componentes, tokens de foco/contraste | paleta macro | aria, semântica, foco | mudar design |
| P10 SEO | head/SEO, schema, sitemap, robots | rotas/slugs | metadados, schema da fonte única | mudar URL sem 301 |
| P11 UX/UI/DS | styles/, componentes | identidade (Lei do Pixel) | bug visual, tokens | redesign |
| P12 Conteúdo/CRO | copy, microcopy, FAQs | voz da marca | termo proibido, microcopy | posicionamento/oferta |
| P13 QA/Handoff | docs/, tudo | — | correções de baixo risco | feature nova |
| P14 Aquisição/Analytics | analytics, GTM, UTMs | conversão real | eventos, tags dormentes | conta/campanha real |
| P15 Manutenção | docs/, rotina | — | SLA, backlog | — |

## 11. Checklist antes de qualquer alteração

1. É item de Preservação Absoluta (§4)? → autorização do dono.
2. Toca contato? → editar **só** `constants.ts`.
3. Toca o funil de formulário? → re-rodar Protocolo de Teste (`CONVERSION_GOVERNANCE.md` §8).
4. Build + `check` + `lint` verdes antes de commitar.
5. Atualizou um doc dono? → conferir espelhos (§7).
6. Sem em-dash; acentos pt-BR; sem termo proibido.
