# QUALITY_GATES — ecooa-website

> Fase: P08 (MYTHOS). Data: 2026-06-14. Estado de cada gate pela Lei 26 (Gate Honesto):
> **BLOQUEANTE** (falhou → não mergeia) · **CALIBRAÇÃO** (warn com prazo/gatilho) ·
> **DEC** (ausente por decisão, com gatilho). CI: `CI_CD.md`.

## Tabela de Gates

| Gate | Ferramenta | Estado (Lei 26) | Gatilho / nota |
|---|---|---|---|
| Format | Prettier `--check` | **BLOQUEANTE** | — |
| TypeScript | `astro check` | **BLOQUEANTE** | 0 erros |
| Lint | ESLint `--max-warnings 0` | **BLOQUEANTE** | 0 warnings |
| Dependências | `npm audit --audit-level=high` | **BLOQUEANTE** | high/critical runtime |
| Build | `astro build` | **BLOQUEANTE** | 103 páginas |
| **Contrato de Páginas** | `validate:output` | **BLOQUEANTE** | 12 rotas estratégicas no sitemap, utilitárias fora, piso 95 |
| **Guardião regulatório** | `validate:output` | **BLOQUEANTE** | zero promessa absoluta no output; P12 calibra termos ambíguos |
| Análise estática | CodeQL | **BLOQUEANTE** | — |
| Lighthouse desktop | LHCI | **BLOQUEANTE** (LCP/CLS error) | demais categorias em report |
| Lighthouse mobile | LHCI | **CALIBRAÇÃO** (warn) | promover a error após runs estáveis (folga: LCP 1,2s vs 2500ms) — PROM budget |
| Links internos | linkinator | **DEC** (não-bloqueante) | gatilho: primeiro link interno quebrado em produção |
| Teste E2E de conversão | — | **DEC** (manual, dono) | minimalismo; gatilho: 1º bug de regressão do funil (HIP-09) |
| Acessibilidade automatizada (axe) | — | **DEC** | site já 100 a11y (P09 valida); gatilho: regressão |

## O Gate do Contrato de Páginas (`scripts/validate-output.mjs`)

Detecta regressão estrutural sem travar o crescimento do blog (sem teto rígido de
contagem): exige as 12 rotas estratégicas no `sitemap-0.xml`, proíbe utilitárias noindex
(`/obrigado`, `/404`, `/offline`) no sitemap, e mantém piso anti-perda-em-massa (95).
Mudança estrutural de rotas exige atualizar a lista em `STRATEGIC_ROUTES` + a Matriz (P02).

## O Guardião regulatório (`scripts/validate-output.mjs`)

Varre o **output** (`dist/**/*.html`) por promessas absolutas inequívocas de voz da
clínica (`resultado garantido`, `cura/satisfação garantida`, `100% sucesso/eficaz/seguro`,
`vagas limitadas`, `últimas vagas`, `sem nenhum risco`). Hoje: **zero** ocorrências
(passa; bloqueia regressão). Provado: teste negativo confirma que falha em violação.
**NÃO** inclui termos de depoimento (`melhor clínica` em reviews) nem ambíguos
(`garantir`, `permanente`, `definitivo`) — calibragem de contexto é tarefa do **P12**
(+ revisão jurídica das restrições CFM sobre depoimentos).

## Política de thresholds e exceções

Nenhum threshold é baixado para passar (exceção = teto formal do P06 com aceite). Gate
instável não vira bloqueante sem calibração. Promessas novas ao P-seguinte viram PROM.
