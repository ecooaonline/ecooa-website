# REQUIREMENTS.md — Requisitos do ecooa-website

> Produzido pelo P01 (2026-06-11). Documento DONO de: requisitos por dimensão e
> restrições. Estratégia/funil: ver [STRATEGY.md](./STRATEGY.md). Escopo/hipóteses:
> ver [SCOPE.md](./SCOPE.md). Metas técnicas: **por referência ao P00, Parte III**
> ([P00_AUDITORIA.md](./P00_AUDITORIA.md)) — nada é redefinido aqui (Lei 13).

## 1. Técnicos

R-T1. Metas do P00/Parte III valem integralmente (Lighthouse ≥99 CAMPO, CLS 0, LCP
mobile <1800ms, JS mínimo, fontes self-hosted, CI bloqueante). Exceções: nenhuma
aprovada. R-T2. Stack congelada: Astro estático + TypeScript strict + npm; zero
dependência JS client externa (filosofia preservada). R-T3. Toda mudança passa por
`npm run validate` verde. R-T4. Pior dispositivo manda (mobile primeiro).

## 2. De negócio

R-N1. Funil Avaliação ecooa (STRATEGY §5) operacional em todas as páginas de entrada.
R-N2. WhatsApp acessível em ≤1 interação a partir de qualquer página (FAB + CTAs).
R-N3. Meta FATO-12 monitorada semanalmente após P14. R-N4. Nenhuma página estratégica
sem CTA de próximo passo.

## 3. De conversão (inegociáveis)

R-C1. **Sucesso real ≠ tentativa**: nenhum evento de conversão dispara sem confirmação
verificável do backend (formulário: chegada em /obrigado via redirect do GAS pós-gravação
— implementado na CP-01; cliques de canal: rotulados como intenção, nunca como lead
confirmado). R-C2. Falha de envio NUNCA pode ser silenciosa: erro visível + fallback
WhatsApp na mesma tela. R-C3. Anti-spam em todo formulário (honeypot + time-gate;
desafio Turnstile no P4/P7). R-C4. /obrigado permanece noindex e fora do sitemap.
R-C5. Teste E2E de produção registrado com data a cada mudança no funil (pendência
atual: teste pós-CP-01 pelo dono — HIP-09). R-C6. Deduplicação de conversão por token
de uso único (implementado).

## 4. De SEO

R-S1. Canonicals/hreflang/sitemap/robots permanecem íntegros (estado APROVADO no P00 EV3).
R-S2. Nenhuma mudança de rota sem 301 e aprovação (P2). R-S3. Schema sempre derivado de
dados reais (`professionals.ts`, `constants.ts`, frontmatter); proibido schema de fatos
fora do Livro de Fatos. R-S4. DEC-05 (aggregateRating) executa no P10. R-S5. Meta
descriptions 50-160 chars (util `clampSeoDescription` aplicado nos templates).

## 5. De segurança

R-SEC1. Zero segredos no repositório (estado: APROVADO P00 EV2; manter). R-SEC2. Headers
reais (CSP com nonce, HSTS, frame-ancestors, Permissions-Policy) após P3, escopo P7;
qualquer endurecimento exige reteste imediato do funil (Anti-padrão 8). R-SEC3.
`npm audit` sem vulns altas como gate de CI (existente). R-SEC4. Validação server-side
preservada no GAS (allowlists, sanitização, escape).

## 6. De acessibilidade

R-A1. WCAG 2.1 AA nos templates principais; foco visível universal; `prefers-reduced-motion`
respeitado (estado atual forte — preservar). R-A2. axe-core no CI (P8) com zero críticos.
R-A3. Contrastes pendentes (ACHADO-24/29 do P00) corrigidos no P9/P11. R-A4. Conteúdo
operável por teclado de ponta a ponta, incluindo modais e match.

## 7. De performance

R-P1. Budgets do PERFORMANCE_BUDGET.md valem (JS ≤50KB/página, CSS ≤50KB, hero ≤150KB,
2 famílias de fonte). R-P2. Lighthouse CI desktop bloqueante (existente); mobile endurece
para `error` após novo baseline de CAMPO (P8). R-P3. Imagem LCP sempre `priority`;
below-the-fold sempre lazy. R-P4. Terceiros: nenhum novo script client sem consent gate
e justificativa (budget: 2 — GTM e Pixel).

## 8. Regulatórios (nicho saúde — CFM/CREMERS, CFN/CRN-2, CFP/CRP, CRBM, CREFITO, COREN, CRO, CRF)

R-R1. **Termos proibidos** (TONE_OF_VOICE.md): "garantido/garantia", "100% eficaz/seguro",
"milagroso", "vagas limitadas", "sem lista de espera", "melhor clínica/profissional/os
melhores", "cura (definitiva)", "resultado permanente/definitivo (como promessa)",
urgência artificial. Nenhuma promessa absoluta de resultado. R-R2. **GATE AUTOMATIZADO
pré-declarado**: o vocabulário proibido será fiscalizado por verificação automática no
pipeline — **P8 cria o gate, P12 calibra a lista** (regra de marca não depende de
memória). R-R3. Títulos/registros profissionais só do Livro de Fatos (FATO-15/17);
registros pendentes de validação não recebem afirmação institucional definitiva.
R-R4. Depoimentos: apenas reais e autorizados (FATO-16); sem antes/depois sem aprovação
expressa do dono e conformidade de conselho. R-R5. DisclaimerMedico nas páginas de
serviço médico/estético (existente) + expansão a mind/working e topo de artigos médicos
(P12, ACHADO-18/19). R-R6. Revisor humano de conteúdo regulado: **Gustavo (CRM/RS
35.822)** — nomeado. R-R7. Publicidade comparativa: proibida.

## 9. De conteúdo

R-CO1. Tom de voz: TONE_OF_VOICE.md é lei editorial. R-CO2. Acentos obrigatórios;
labels de navegação lowercase (identidade). R-CO3. Sem em-dash. R-CO4. Categorias de blog
do enum do `content.config.ts`. R-CO5. Autor de artigo deve mapear para
`professionals.ts` (verificado 14/14). R-CO6. FAQs de objeção real por pilar (P12).

## 10. De manutenção

R-M1. Docs-espelho atualizados em todo PR que mude estado (Lei do Espelho; CLAUDE.md
corrigido — ver §12). R-M2. AI handoff fiel ao código (P13). R-M3. Rotina pós-meta e
SLA definidos no P15, acionados por alertas do P13. R-M4. Dependabot + automerge
preservados.

## 11. De medição (LGPD/consentimento)

R-ME1. GTM/Pixel só após consentimento explícito (consent gate atual preservado — nenhum
tracker antes do aceite). R-ME2. Nenhum dado pessoal em eventos de analytics (somente
metadados: form_type, token). R-ME3. dataLayer como transporte canônico de eventos
(funciona pré-GTM); mapeamento de triggers no container = painel do dono (P14 guia com
print do estado atual — Anti-padrão 5). R-ME4. Métrica sem dono de medição não entra em
relatório (STRATEGY §9). R-ME5. Tráfego de bots excluído da leitura de funil (P14).

## 12. Fronteira de acesso — ações que exigem o DONO

| Ação | Painel | Fase | Status |
|---|---|---|---|
| Habilitar "Allow GitHub Actions to create and approve pull requests" | GitHub Settings | já | pendente (run open-pr falhou 23:39 de 2026-06-11) |
| Teste E2E do formulário em produção (Sheets+e-mail+/obrigado) | navegador + Sheets | já (pós-CP-01) | pendente (HIP-09) |
| Rodar PSI nas 6 URLs e colar números (novo baseline CAMPO) | pagespeed.web.dev | já | pendente |
| Criar conta/zona Cloudflare; executar cutover DNS | Cloudflare/registrador | P3 | a iniciar |
| Confirmar/criar propriedade Search Console | GSC | P10 | HIP-05 |
| Informar ID da conta Google Ads | Ads | P14 | pendente |
| Republicar GAS se divergente do repo | script.google.com | se HIP-04 cair | condicional |
| CRNs faltantes, dados Adriana, fotos/bios Eduarda+Tais, decisão Rafaela | — | P4/P12 | pendências declaradas |

Nota verídica (corrige ACHADO-08 do P00 nos espelhos): o backend de formulários é
**Google Apps Script** (`constants.ts`), não Formspree; a correção do CLAUDE.md ocorre
em fase com fence que permita tocá-lo (P5/P13) — registrado aqui para que nenhuma IA
futura herde o erro.
