# P00 · Auditoria MYTHOS — ecooa-website

> Relatório do Prompt Primordial (P00), persistido verbatim conforme a Parte IV do P01.
> Origem: sessão de auditoria de 2026-06-11, modo somente leitura, modelo Fable 5.
> Tag da coleção: #ecooa

---

# RELATÓRIO P00 · MYTHOS — VISTORIA TOTAL ecooa-website

**Modo: somente leitura · Modelo: Fable 5 (`claude-fable-5`) · Data: 2026-06-11 · Tag: #ecooa**

## 1. Resumo executivo

O ecooa-website é um esboço artístico **maduro e em produção**: Astro 6 estático, 103 páginas, zero dependências JS client externas, identidade visual premium e coerente, consent gate correto, schema rico, build limpo em 5,5s e 0 vulnerabilidades. A base já passou hoje por uma rodada de correções (credenciais YMYL, ToV, SEO, a11y, registros profissionais) que está mergeada e no ar. Os **3 maiores riscos**: (1) o formulário envia em `no-cors` com sucesso otimista — rejeição ou queda do Google Apps Script é invisível, e o evento de conversão dispara mesmo assim (pecado capital da Lei 5, mitigado por WhatsApp ser o canal primário); (2) observabilidade inexistente — nenhuma falha de produção gera alerta; (3) a entrega via GitHub Pages limita estruturalmente cache, Brotli e headers de segurança — a migração para Cloudflare (alvo confirmado pelo dono) é o destravamento central da meta 99/100. **Recomendação**: tratar a correção prévia CP-01 (decisão do dono, pergunta na seção 16) e avançar ao Prompt 1 com a sequência adaptada da seção 17.

## 2. Ambiente medido e limitações

- Sandbox Linux, Node **v22.22.2** (`.nvmrc`: 22.12.0 ✓), npm **10.9.7**.
- **Rede restrita por allowlist**: produção (`www.somosecooa.com.br`), PSI/googleapis e download de Chrome **bloqueados** (`host_not_allowed`/403, provas em sessão). Consequências: sem Lighthouse local, sem sondagem de headers de produção, sem PSI ao vivo.
- **Todo número desta auditoria é LABORATÓRIO**, exceto onde marcado CAMPO (única fonte: baseline PSI documentado no repositório, 2026-05-31, anterior às mudanças de hoje).
- Lighthouse roda no CI do GitHub (executado hoje, verde, com gates `error`): é laboratório-CI, ambiente íntegro.

## 3. Inventário (M1 — 41 itens)

Framework **Astro 6.4.4** + `@astrojs/sitemap` 3.7.x (únicas deps de produção) · TypeScript **6.0.3** (strict) · Node engines ≥22.12 · npm + `package-lock.json` íntegro · 14 scripts npm (`validate` = format+check+lint+build) · **24 arquivos de página** (18 rotas estáticas + 4 dinâmicas + rss/feed/llms endpoints) · **20 componentes** · 1 layout (BaseLayout) · **34 artigos** em content collection (schema Zod em `content.config.ts`) · 6 arquivos de dados (`professionals.ts` 30 perfis/25 com registro, `specialties.ts` 17, `match-intents.ts` ~34, `reviews.ts` 39, `constants.ts`, `blog-authors.ts` derivado, `seo.ts`) · **8 scripts client** (~51KB bundled, match 38,7KB) · **104 imagens** (pares AVIF+WebP, maior: 140KB ✓ budget 150KB) · **4 fontes** woff2 self-hosted (10-12KB cada, subset) · cursor customizado (`cursor.ts`, desativa em `pointer:coarse`) · CSS 56KB fonte → 40KB bundle único · SW (`sw.js` v3, offline dedicado) · manifest completo (maskable+screenshots) · sitemap 100 URLs · robots.txt ✓ · security.txt ✓ · `llms.txt`/RSS/JSON-feed ✓ · 5 workflows GH Actions · CNAME `www.somosecooa.com.br` · 19 documentos .md na raiz + 16 em docs/ · `.env.example` sem valores reais ✓ · sem arquivos sensíveis em public/ ✓ · 2 fotos órfãs (`rafaela.webp` usada só em quem-somos; `jessica-mentoria.webp` não usada) · não mapeado em profundidade: `template/` (excluído do tsconfig, legado declarado).

## 4. Build e tooling (M2)

`npm ci` ✓ · `npm run build` ✓ **103 páginas em 5,5s** (wall 7,0s), 0 erros, 0 warnings · output `dist/`: 106 HTML (103 + 3 redirects), 240 arquivos · `npm audit`: **0 vulnerabilidades** (qualquer nível) · scripts presentes: check/lint/format/validate/audit ✓; ausentes: `test` (sem testes) — registro, não criação · `astro check`: 0 erros/0 warnings/23 hints · working tree limpo antes e depois (prova na seção 19).

## 5. Os Seis Exames Vitais

**EV1 · Conversão ponta a ponta — RISCO (componente formulário: CRÍTICO).** WhatsApp (primário): links `wa.me` corretos em 18+ pontos + FAB, eventos de clique rastreados — APROVADO. Formulário (secundário): `form-submit.ts:25-30` usa `mode:'no-cors'` com comentário admitindo resposta opaca; sucesso é otimista; `form_submit_success` e Pixel `Lead` disparam sem confirmação (form-submit.ts:88-104); rejeições server-side (rate-limit GAS de 10/h por UA, validação) são **invisíveis**. Mitigantes reais: honeypot+time-gate client/server, validação client alinhada (pattern 10-13 dígitos), retry+timeout+estado de erro, redirect `/obrigado` noindex/fora do sitemap ✓, fallback WhatsApp visível na página ✓. Destino do lead: Sheets + e-mail `ecooa.adm@gmail.com` (GAS lido linha a linha). Último teste E2E real: **nunca registrado**. → Gate da Parte VII acionado (CP-01, seção 16).

**EV2 · Segredos — APROVADO.** Varredura por padrões: zero segredos. GTM/Pixel/URL GAS em `constants.ts` são identificadores públicos client-side com override por env (documentado). `.env` não versionado; `.env.example` placeholders ✓; public/ limpo; sem suspeita no histórico; segredos reais vivem no GAS/painéis (fora do repo) ✓.

**EV3 · Indexabilidade — APROVADO.** robots.txt sem bloqueio indevido + sitemap declarado ✓; meta robots: noindex somente em obrigado/offline/redirects (provado no dist) ✓; canonicals + hreflang em 100% ✓; sitemap 100 URLs coerente com build (103 − obrigado − offline − redirects + endpoints) ✓; `404.html` presente p/ GH Pages ✓; previews Vercel: noindex por padrão da plataforma (verificar 1× no painel — dono).

**EV4 · Realidade mobile — RISCO (estrutural de entrega, não de página).** LCP real: texto h1 nas páginas principais (fontes preloaded, swap); perfil de profissional: foto com `priority/fetchpriority=high` (dist ✓). CLS: 100% das imagens com width/height; animações transform/opacity → esperado 0. Render-blocking: 1 CSS 40KB (7,9KB gzip). CAMPO (doc, 2026-05-31, home): 100×4 mobile/desktop, LCP 1,2s/0,3s, CLS 0, TBT 0. LAB local: indisponível (seção 2); LAB-CI hoje: verde com LCP≤2500/CLS≤0.1 `error`, 3 runs. Causa estrutural restante: gzip-only + `max-age=600` do GitHub Pages (repeat-view e uses-text-compression) → resolve no P3.

**EV5 · Terceiros e SPOF — RISCO controlado.** Inventário: GTM (consent-gated+interaction-only ✓, nada antes do aceite — provado), Meta Pixel idem (sem CAPI), Google Apps Script (**SPOF do formulário; fallback = WhatsApp visível** ✓), wa.me, Vercel (previews), zero fontes/CDN externas ✓. Conflito futuro: scripts inline + GTM × CSP nonce (P7). Posse: dono declarou **nenhuma conta compartilhada**; recursos do projeto: GTM-TSR4GDMK, Pixel 795926643274151, GAS do formulário, GA4 via GTM, Vercel ecooaonline, Gmail ecooa.adm — nenhum vizinho a proteger.

**EV6 · Integridade do repositório — APROVADO com notas.** Working tree limpo; branch de trabalho `claude/...` com **conteúdo idêntico a origin/main** (squash; `git diff origin/main` vazio — provado); lockfile íntegro; `.gitignore` cobre dist/.astro/.env ✓; nenhum artefato versionado; nota 1: histórico local diverge em SHA do main (esperado pós-squash); nota 2: workflow `auto-merge` falha por política da organização ("Actions is not permitted to create PRs", log citado em sessão) — ACHADO-05.

## 6. Mapa de preservação absoluta (35 itens — todos intactos nesta etapa)

Declarados preservados e com avaliação de qualidade: **fotos** (104, AVIF/WebP, pesos dentro do budget) · **fontes** (Arboria 300/400/500 + Playfair italic, subset, 10-12KB — exemplar) · **cursor** (refinado, desativa em touch) · **logo/símbolos** (EcooaLogo, waves SVG matemáticas) · **paleta/tokens** (tokens.css com contrastes AA documentados) · **texturas** (WavePattern parametrizável) · **margens/proporções/grids/espaçamentos** (mobile-first, breakpoints limpos) · **animações/microinterações** (reveal `.r/.d1-d4` com spring, `prefers-reduced-motion` ✓, marquees CSS puros com pausa) · **CTAs** (hierarquia `.bd/.bo/.bw/.ghost` com focus-visible) · **copy/headings/ToV** (pós-correção: 0 termos proibidos em conteúdo próprio) · **metadados/schema/sitemap/robots** (corretos) · **páginas/componentes/layouts** · **formulários e lógica** (preservados; mudança só via CP-01/P4 autorizada) · **links** · **OG images** · **blog** (34 artigos cautos) · **páginas de profissionais** (32 cards, 25 registros) · **dados estruturados** · **arquitetura de conteúdo** · **intenção artística** (premium/humana/precisa — forte) · **intenção comercial** (WhatsApp-first) · **estratégia SEO** (local POA, E-E-A-T) · **estratégia de conversão** (multi-canal com triagem match).

## 7. Fronteira de acesso e posse

| Território | Operador | Itens deste projeto |
|---|---|---|
| Código/repo/CI | IA (autorização por fase) | tudo em `ecooaonline/ecooa-website` |
| Painéis | **DONO (Gustavo)** | GTM-TSR4GDMK, GA4, Pixel 795926643274151, Search Console, DNS somosecooa.com.br, GAS + Sheets, Gmail ecooa.adm, Vercel, **GitHub Settings** (Actions→create PRs; Pages→Cloudflare na migração), futura conta Cloudflare |
| Decisões | DONO | CP-01, trade-offs de teto, copy regulada, verba |

Contas compartilhadas: **nenhuma** (declaração do dono). Incidentes anteriores: **nenhum**.

## 8. Scorecard — 22 eixos (scores LAB/estimados)

| # | Eixo | Status | Score | Gaps principais | Dono |
|---|---|---|---|---|---|
| 1 | Estratégia e requisitos | Forte | 85 | metas formais por canal ausentes | P1 |
| 2 | Arquitetura de informação | Forte | 88 | hub de FAQ inexistente | P2 |
| 3 | Infraestrutura | **Parcial** | 55 | GH Pages: gzip, cache 600s, sem headers; migração decidida | P3 |
| 4 | Governança de dados e conversão | **Risco** | 58 | no-cors; 3 perfis fora da fonte; GAS names dup | P4 |
| 5 | Fundação e DX | Forte | 90 | CLAUDE.md mente (Formspree) | P5 |
| 6 | Performance | Forte | 92 | srcset ausente; CSS 40KB blocking; entrega | P6 |
| 7 | Segurança | Parcial | 70 | CSP unsafe-inline/meta; Permissions-Policy nula; sem Turnstile | P7 |
| 8 | CI/CD | Parcial | 72 | sem E2E/axe; auto-merge quebrado (org); mobile warn | P8 |
| 9 | Acessibilidade | Forte | 90 | contrastes pontuais (badge 5★, .cf-rt); sem axe-CI | P9 |
| 10 | SEO técnico | Forte | 93 | aggregateRating de reviews Google (política) | P10 |
| 11 | UX/UI | Forte | 88 | objeções não tratadas nas FAQs | P11/P12 |
| 12 | Design System | Forte | 90 | tokens sólidos; pequenos refinamentos | P11 |
| 13 | Conteúdo e risco regulatório | Bom | 80 | disclaimer dedicado só em med/esthetic; 4 "CRN" sem nº | P12 |
| 14 | CRO | Bom | 78 | FAQs reativas; sem posição de CTA nos eventos | P12/P14 |
| 15 | Dados estruturados | Forte | 92 | reviews individuais ausentes (opcional) | P10 |
| 16 | Dados e fonte única | Parcial | 70 | Rafaela/Eduarda/Tais fora; intake 100% vazio | P4/P5 |
| 17 | Formulários e conversão | **Risco** | 55 | EV1; sucesso otimista; sem teste E2E registrado | P4 |
| 18 | PWA e offline | Forte | 90 | CSS do offline não precacheável (herdado, mitigado) | P6 |
| 19 | Observabilidade | **Ausente** | 25 | sem erros JS, uptime, alertas; vitals→GA4 sem threshold | P13 |
| 20 | Aquisição, analytics e bots | Parcial | 65 | conversão otimista; prerender pode inflar; sem valor no Lead | P14 |
| 21 | Manutenção e SLA | Parcial | 60 | rotinas documentadas, sem alertas que as acionem | P15 |
| 22 | Manutenção por IA e veracidade documental | Bom | 75 | CLAUDE.md desatualizado em 2 pontos | P13 |

## 9. Lighthouse por página

LAB local: **não executável** (seção 2). LAB-CI (hoje, PR #52, desktop, 9 URLs, 3 runs, gates LCP 2500/CLS 0.1 em `error`): **verde** — valores numéricos individuais ficam nos artifacts do run (`treosh` upload). CAMPO (PSI produção, home, **2026-05-31**, doc do repo — anterior às mudanças de hoje): Perf/A11y/BP/SEO = **100/100/100/100** mobile e desktop; LCP 1,2s/0,3s; CLS 0; TBT 0; SI 2,3s/1,0s. **Ação P6/dono**: rodar PSI pós-deploy de hoje nas 9 URLs e colar como novo baseline de CAMPO.

## 10. Pontos fortes a preservar (explícitos)

Zero-dependency client · consent gate exemplar · fontes/imagens otimizadas no budget · tokens com AA documentado · cursor/marquees/reveals com reduced-motion · jornada de conversão multi-canal completa · match engine com curadoria pt-BR + anti-scraping · schema dinâmico (MedicalBusiness/Physician/FAQ/Article+reviewedBy) · 25 registros profissionais visíveis (cards + perfis + schema identifier) · GAS com allowlists/sanitização/escape · Dependabot+automerge · docs operacionais extensos · `validate` como gate único local · sitemap/robots/canonicals impecáveis.

## 11. Achados

### [ACHADO-01] Falso sucesso no formulário e evento de conversão otimista
Eixo: 17/4/20 · Severidade: **CRÍTICO** · Matriz: I(5) × P(4) = 20
Evidência: `src/scripts/form-submit.ts:25-30` (`mode:'no-cors'`, comentário admite resposta opaca); `:88-104` (gtag/fbq disparam pós-POST sem ler resposta); `google-apps-script.js:111-118` (rate-limit 10/h devolve recusa que o cliente nunca vê)
Impacto: lead do canal secundário pode ser perdido com confirmação falsa ao paciente; GA4/Pixel inflam conversões; equipe não percebe GAS fora do ar.
Recomendação: resposta verificável (form POST nativo com `_next` allowlisted do próprio GAS, ou proxy Cloudflare Worker com CORS no P3/P4) + evento de sucesso só confirmado. (Modernização: obrigatória)
Prompt dono: P4 (lógica) e P14 (evento) · Correção prévia: **candidata — ver seção 16**

### [ACHADO-02] Entrega GitHub Pages limita meta (compressão/cache/headers)
Eixo: 3 · Severidade: ALTO · Matriz: I(4) × P(4) = 16
Evidência: plataforma documentada (deploy.yml); sondagem direta bloqueada no sandbox; comportamento GH Pages: gzip-only, `Cache-Control: max-age=600` universal, sem headers custom
Impacto: `uses-text-compression`/`efficient-cache-policy` reprovam por design; CSP/HSTS/frame-ancestors impossíveis; repeat-view degradado.
Recomendação: migração Cloudflare Pages com `_headers`/`_redirects` (Modernização: obrigatória — decisão do dono já tomada)
Prompt dono: P3 · Correção prévia: não (é a própria fase 3)

### [ACHADO-03] Observabilidade ausente
Eixo: 19 · Severidade: ALTO · Matriz: I(4) × P(4) = 16
Evidência: zero matches para Sentry/window.onerror no código; `sw register` com catch vazio; GAS loga só em console efêmero (`google-apps-script.js:84`)
Impacto: toda falha de produção (JS, GAS, vitals degradados) é invisível até alguém reclamar.
Recomendação: error tracking (DSN já previsto em `.env.example`), alertas GA4 (form_submit_error, LCP>4s), heartbeat/log sheet no GAS, uptime externo (Modernização: obrigatória)
Prompt dono: P13 · Correção prévia: não

### [ACHADO-04] Sem testes E2E nem axe-core no CI
Eixo: 8/9 · Severidade: ALTO · Matriz: I(4) × P(3) = 12
Evidência: ausência de playwright/axe no repo; `AI_HANDOFF.md:10` marca honestamente "Pendente"
Impacto: regressões de fluxo de conversão/a11y só são percebidas manualmente.
Recomendação: Playwright (match→resultado, formulários mockados, snapshot de páginas) + axe por template (Modernização: alta)
Prompt dono: P8 · Correção prévia: não

### [ACHADO-05] Auto-merge inoperante: organização proíbe Actions criar PRs
Eixo: 8 · Severidade: ALTO · Matriz: I(3) × P(5) = 15
Evidência: run 27380192698 `open-pr` → "GitHub Actions is not permitted to create or approve pull requests" (log citado em sessão)
Impacto: a esteira de branches `claude/**` não abre PR sozinha; risco de mudanças represadas sem deploy.
Recomendação: dono habilitar Settings→Actions→General→"Allow GitHub Actions to create and approve pull requests" (fronteira do dono; IA fornece o passo a passo)
Prompt dono: P8 + ação do dono · Correção prévia: não (contornável manualmente)

### [ACHADO-06] Headers de segurança inefetivos e CSP permissiva
Eixo: 7 · Severidade: ALTO · Matriz: I(4) × P(3) = 12
Evidência: `BaseLayout.astro:53-57` — CSP via meta com `unsafe-inline`, `connect-src https:`; `Permissions-Policy` via meta (sem efeito em browsers); sem `frame-ancestors` possível
Impacto: proteção XSS anulada pela própria CSP; clickjacking não mitigado; exfiltração para qualquer HTTPS permitida.
Recomendação: headers reais + nonce + connect-src allowlist após P3 (Modernização: obrigatória, dependente)
Prompt dono: P7 (depende P3) · Correção prévia: não

### [ACHADO-07] Pessoas fora da fonte única de dados
Eixo: 16 · Severidade: ALTO · Matriz: I(3) × P(4) = 12
Evidência: `quem-somos.astro:171` (Rafaela Teixeira só lá); `profissionais.astro:206-217` (Eduarda/Tais hardcoded, sem slug/foto); `google-apps-script.js:254-285` (PROFESSIONAL_NAMES manual)
Impacto: drift inevitável; Eduarda/Tais sem perfil/schema; manutenção frágil.
Recomendação: incorporar a `professionals.ts` quando o dono enviar fotos/dados; gerar mapa do GAS no build (Modernização: alta)
Prompt dono: P4/P5 · Correção prévia: não (aguarda material do dono)

### [ACHADO-08] Documentação mente para a próxima IA
Eixo: 22 · Severidade: ALTO · Matriz: I(3) × P(4) = 12
Evidência: `CLAUDE.md:12` "Formspree (formulários)" — backend real é Google Apps Script (`constants.ts:23-25`); `CLAUDE.md:29` "30 profissionais" — hoje 30 na fonte + 2 na página + 1 em quem-somos
Impacto: viola a Lei 8; induz a próxima sessão/dev a decisões erradas sobre o backend de conversão.
Recomendação: corrigir no primeiro ato de escrita autorizado (P1 grava este relatório; P5/P13 corrigem espelhos)
Prompt dono: P13 (espelhos), correção pontual já no P1 · Correção prévia: não

### [ACHADO-09] FAQs não enfrentam as objeções de maior fricção
Eixo: 14/13 · Severidade: ALTO · Matriz: I(3) × P(4) = 12
Evidência: `ecooa-med.astro:13-34`, `ecooa-esthetic.astro:23-40`, `ecooa-mind.astro:22-39` — nenhuma trata "e se não funcionar", prazo realista, dor/downtime/cicatriz, "terapia piora no início?"
Impacto: objeção não respondida = lead que não chega ao WhatsApp.
Recomendação: 2-3 FAQs novas por pilar com honestidade clínica + disclaimer (Modernização: alta)
Prompt dono: P12 · Correção prévia: não

### [ACHADO-10] Anti-abuso do formulário sem desafio real
Eixo: 7/4 · Severidade: ALTO · Matriz: I(3) × P(3) = 9 (elevado qualitativamente: canal de lead)
Evidência: `google-apps-script.js:103-108` — rate-limit por hash de User-Agent (o próprio código recomenda Turnstile)
Impacto: spam/flood trivialmente contornável consome cota do GAS e polui Sheets/e-mail.
Recomendação: Cloudflare Turnstile no front + verificação no Worker/GAS (Modernização: alta, casa com P3)
Prompt dono: P4/P7 · Correção prévia: não

**MÉDIOS (formato compacto — mesmos campos):**
- **[ACHADO-11]** Sem srcset multi-width · Eixo 6 · I3×P3=9 · Ev: `OptimizedImage.astro:50` (srcset único) · Impacto: bytes extras mobile, uses-responsive-images · Rec: variantes por naming convention (Modernização: alta) · P6
- **[ACHADO-12]** CSS 40KB render-blocking único, sem critical inline · Eixo 6 · I3×P3=9 · Ev: dist head `link stylesheet` · Rec: inline crítico/split (média) · P6
- **[ACHADO-13]** Prerender (Speculation Rules) pode inflar métricas · Eixo 20 · I3×P3=9 · Ev: `BaseLayout.astro:107-133` · Rec: medir `document.prerendering`, ajustar eagerness (média) · P14
- **[ACHADO-14]** Pixel Lead sem `value`/moeda; GA4 sem valor de lead · Eixo 20 · I3×P3=9 · Ev: `form-submit.ts:104` · Rec: valor médio por formType (média) · P14
- **[ACHADO-15]** `form_submit_error` sem contexto (timeout×rede×validação) · Eixo 19/20 · I3×P3=9 · Ev: `form-submit.ts:138-141` · Rec: `error_type` + alerta GA4 (média) · P13/P14
- **[ACHADO-16]** Campos de intake 100% vazios (education/pricing/mainComplaints/faqPairs) · Eixo 16/14 · I3×P3=9 · Ev: grep 0 ocorrências · Rec: levantamento com a equipe; prioriza mainComplaints (match) e pricing (média) · P12/P4 + dono
- **[ACHADO-17]** specialties × match-intents sem referência cruzada (drift latente) · Eixo 16 · I2×P4=8 · Ev: dados paralelos · Rec: intents referenciarem slugs de specialties (média) · P5
- **[ACHADO-18]** DisclaimerMedico dedicado ausente em ecooa-mind/working (só o global do footer cobre) · Eixo 13 · I3×P3=9 · Ev: grep import/render =0 nos 2; footer `Footer.astro:71-78` presente em 100% · Rec: incluir componente nos 2 pilares (média) · P12 — *rebaixado de CRÍTICO após verificação: cobertura global existe e ToV exige "médico e estético", ambos atendidos*
- **[ACHADO-19]** Disclaimer dos artigos só no fim · Eixo 13 · I2×P4=8 · Ev: `blog/[slug].astro` render no rodapé · Rec: banner curto pós-h1 em categorias médicas (média) · P12
- **[ACHADO-20]** 4 nutricionistas exibem "CRN" sem número + parte dos registros pendente de validação nos conselhos · Eixo 13 · I3×P3=9 · Ev: `professionals.ts:48-52` (comentário) · Rec: dono valida/fornece números; até lá considerar "CRN em validação" (decisão do dono) · P12
- **[ACHADO-21]** aggregateRating alimentado por reviews do Google (política de self-serving reviews) · Eixo 10/15 · I3×P3=9 · Ev: `reviews.ts` → `BaseLayout.astro:216-223` · Rec: decisão do dono: manter (risco de perda do rich result) ou coletar rating próprio (média) · P10
- **[ACHADO-22]** Logs do GAS não persistidos + sem heartbeat/quotas · Eixo 19 · I3×P3=9 · Ev: `google-apps-script.js:84` · Rec: aba "logs" + alerta (média) · P13/P4
- **[ACHADO-23]** Sem hub central de FAQs/preços (caminho órfão de comparação) · Eixo 2 · I2×P3=6 · Rec: avaliar `/faq` por pilar (média) · P2/P12
- **[ACHADO-24]** Contrastes fracos: badge 5★ hero (~10-12px ink-soft) e `.cf-rt` rgba(255,255,255,.45) · Eixo 9 · I2×P3=6 · Ev: `index.astro:199-203`, `CtaSection` · Rec: elevar a ≥4.5:1/3:1 (média) · P9/P11

**BAIXOS:** **[25]** eventos sem posição do CTA (`data-cta-position`) · P14 · **[26]** scroll_depth global em páginas curtas · P14 · **[27]** sem `match_rate_limit`/abandono no funil do match · P14 · **[28]** reviews individuais ausentes do schema (opcional) · P10 · **[29]** touch target `.ir-lk` ~40px em coarse · Ev `responsive.css:197-232` · P9 · **[30]** estilo de `em` no blog-content pouco diferenciado · P11 · **[31]** 2 fotos órfãs em /team · P5 · **[32]** preload de playfair-italic em 100% das páginas · P6 · **[33]** fallback offline depende de CSS hasheado não precacheável (herdado; página standalone mitiga) · P6.

**REFINAMENTOS:** **[34]** grid Instagram mobile perde proporção (`responsive.css:156-163`) · P11 · **[35]** cursor não sincroniza com hover de `.pc` (`cursor.ts:41-43`) · P11 · **[36]** seta do QuizSection sem gap em mobile · P11.

**REFUTADOS na verificação (transparência):** "credencial ausente nos cards" (31 cards com `pc-reg` no dist — provado); "autores de blog sem mapping" (14/14 batem com `professionals.ts`, verificado em sessão); "pc-reg sumiu da produção" (erro de medição `grep -c` linhas×ocorrências — corrigido); "DisclaimerMedico ausente = CRÍTICO" (rebaixado: footer global + med/esthetic dedicados).

## 12. Riscos por dimensão

**Conversão:** ACHADO-01 (única perda invisível possível; WhatsApp não afetado). **SEO:** baixo; único risco de política é o 21. **Acessibilidade:** baixo; pontuais 24/29. **Segurança:** médio até P3+P7 (06/10); sem exposição ativa. **Performance:** baixo nas páginas, médio na entrega (02). **Conteúdo/reputação:** baixo pós-correções; vigiar 18/19/20. **Manutenção:** médio (07/08/16/17). **Infraestrutura:** alto até migração (02). **Aquisição/mensuração:** médio (01-evento/13/14).

## 13. Conflitos latentes + tabela de donos

```
[CONFLITO-01] Scripts inline (GTM/Pixel/Astro) × CSP com nonce
Existe hoje: BaseLayout.astro:330-405 inline + CSP unsafe-inline (53)
Vai colidir com: P7, porque nonce exige refatorar a injeção e os define:vars
Tratamento: P7 planeja nonce + extração; reteste de conversão obrigatório (Anti-padrão 8) · Dono: P7
```
```
[CONFLITO-02] GAS no-cors × evento de conversão de sucesso real
Existe hoje: form-submit.ts:25-30 × matriz de eventos (V13)
Vai colidir com: P14, porque a definição de conversão exige confirmação
Tratamento: resolver canal verificável no P4 antes de fechar matriz no P14 · Dono: P4→P14
```
```
[CONFLITO-03] Migração Cloudflare × DNS/painéis do dono × workflows GH Pages
Existe hoje: deploy.yml + CNAME + integração Vercel de preview
Vai colidir com: P3 (cutover DNS = painel do dono; decidir destino da integração Vercel)
Tratamento: plano de cutover com rollback e janela; dono executa DNS · Dono: P3
```
```
[CONFLITO-04] Prerender Speculation Rules × medição limpa
Existe hoje: BaseLayout.astro:107-133
Vai colidir com: P14 (pageviews/funnel inflados)
Tratamento: flag is_prerendered ou eagerness conservative · Dono: P14
```
```
[CONFLITO-05] Cards fora da fonte (Rafaela/Eduarda/Tais) × fonte única
Existe hoje: quem-somos.astro:171; profissionais.astro:206-217
Vai colidir com: P4/P5 (governança) e P10 (schema de pessoas)
Tratamento: incorporar à fonte quando o dono entregar material · Dono: P4/P5
```
```
[CONFLITO-06] CLAUDE.md "Formspree" × handoff fiel
Existe hoje: CLAUDE.md:12
Vai colidir com: P13 (handoff) e com QUALQUER sessão futura de IA
Tratamento: corrigir junto com a gravação deste relatório no P1 · Dono: P13
```
```
[CONFLITO-07] Auto-merge bloqueado pela organização × cadência da esteira 1-15
Existe hoje: run open-pr falho (política org)
Vai colidir com: P8 e com toda fase que faz push
Tratamento: dono habilita a permissão OU esteira segue com PRs manuais da IA · Dono: P8 + dono
```

**Tabela de donos (anti-deriva):** medição/consent/eventos → **P14** · lógica de formulário/anti-spam → **P4** · headers/CSP → **P7** · fontes/LCP/imagens → **P6** · fonte única de pessoas/contato → **P4/P5** · schema → **P10** · FAQs/disclaimers/copy regulada → **P12** · docs-espelho/observabilidade/handoff → **P13** · plataforma/cutover → **P3** · gates/testes → **P8** · rotina/SLA → **P15**.

## 14. Veracidade documental

Mentiras/defasagens: `CLAUDE.md:12` (Formspree→GAS) e `:29` ("30 profissionais") — ACHADO-08. **Verazes**: AI_HANDOFF (Playwright "Pendente" ✓), PERFORMANCE_BUDGET (gates hoje **batem** com lighthouserc após alinhamento desta manhã ✓; baseline rotulado com data ✓), SECURITY/ROLLBACK/CI_CD coerentes com o código, TONE_OF_VOICE refletido no conteúdo pós-correções.

## 15. Modernizações classificadas (V18)

**Obrigatórias:** Cloudflare Pages+_headers (02) · resposta verificável no formulário (01) · CSP via header+nonce (06) · observabilidade mínima (03). **Altas:** Playwright+axe (04) · Turnstile (10) · srcset (11) · fonte única pessoas+GAS map (07) · FAQs de objeção (09). **Médias:** critical CSS (12) · flag prerender (13) · valor no Lead (14) · intents↔specialties (17) · disclaimers (18/19). **Baixas:** 25-33. **Opcional:** reviews no schema (28) · embeddings no match (payload já preparado). **Não recomendada:** trocar o motor do match por lib externa (viola filosofia zero-dep que funciona).

## 16. Correção prévia recomendada antes do Prompt 1

**CP-01 · Resposta verificável no envio do formulário**
1. **Problema:** sucesso otimista em `no-cors`; rejeições/quedas do GAS invisíveis; evento de conversão dispara sem confirmação. 2. **Evidência:** `form-submit.ts:25-30,88-104`; `google-apps-script.js:111-118`. 3. **Impacto:** perda silenciosa de lead no canal secundário + métricas infladas. 4. **Risco se ignorar:** leads de formulário perdidos sem sinal durante toda a esteira (semanas). 5. **Benefício de corrigir agora:** Lei 5 satisfeita antes de qualquer outra fase tocar no funil. 6. **Escopo mínimo:** trocar fetch por POST nativo com `_next=/obrigado` (o GAS já suporta redirect allowlisted — `google-apps-script.js:73-79`), mantendo honeypot/time-gate; sucesso = navegação confirmada pelo servidor; evento de conversão movido para /obrigado. 7. **Arquivos:** `form-submit.ts`, páginas com formulário, `obrigado.astro` (evento). 8. **Não será tocado:** visual dos formulários, GAS publicado, GTM/Pixel IDs, nada do mapa de preservação. 9. **Validação:** envio real de teste chegando ao Sheets/e-mail + erro simulado visível. 10. **Recomendação objetiva:** como o canal primário é WhatsApp e o volume de falha real tende a ser baixo, é **aceitável adiar para o P4**; minha recomendação técnica, porém, é corrigir antes. 11. **"Você autoriza corrigir esta etapa prévia antes de avançarmos para o Prompt 1?"**

Triagem: CP-01 é a única; ACHADO-05 (permissão do GitHub) é ação de painel do dono, pode ser feita a qualquer momento com o passo a passo da seção 11.

## 17. Índice da sequência final adaptada (Nível 2)

- **P1 Estratégia/requisitos** · Objetivo: gravar este relatório no repo (1º ato) + metas formais por canal e KPIs · Entram: contexto, correção CLAUDE.md:12/29 · Não entram: qualquer refactor · Preservar: tudo · Risco: re-auditar em vez de decidir · Aceite: relatório versionado + metas assinadas · Dono de: visão/metas.
- **P2 Arquitetura de informação** · Avaliar hub FAQ (23), rotas estáveis · Entram: 23 · Risco: mexer em URL sem 301 · Aceite: mapa de IA aprovado.
- **P3 Infra/deploy** · Migração Cloudflare Pages: `_headers`/`_redirects`, Brotli, cache immutable, preview, rollback, plano de cutover DNS (dono executa painel) + destino da integração Vercel · Entram: 02, base p/ 06/10 · Risco: downtime/cache antigo de SW · Aceite: produção servida pela CF com headers provados e PSI ≥ baseline.
- **P4 Governança de dados e conversão crítica** · CP-01 (se adiada), Turnstile (10), fonte única pessoas (07, com material do dono), GAS names build-time, intake (16) · Risco: quebrar funil — reteste E2E obrigatório · Aceite: lead de teste rastreado ponta a ponta com confirmação real.
- **P5 Fundação/DX** · Espelhos de docs (08), intents↔specialties (17), órfãos (31) · Aceite: docs verazes.
- **P6 Performance** · srcset (11), critical CSS (12), preload por página (32), offline asset (33) · Aceite: PSI CAMPO 9 URLs ≥99 mobile.
- **P7 Segurança** · CSP header+nonce, HSTS, frame-ancestors, Permissions-Policy reais (06) · Risco: quebrar GTM/Pixel — reteste (Anti-padrão 8) · Aceite: headers provados + conversão retestada.
- **P8 CI/CD** · Playwright+axe (04), permissão org (05, dono), thresholds mobile→error pós-baseline · Aceite: PR de teste bloqueado por regressão proposital.
- **P9 Acessibilidade** · 24/29 + auditoria axe completa · Aceite: axe 0 críticos + teclado/leitor.
- **P10 SEO técnico** · decisão 21 (dono), reviews schema (28), revalidação rich results · Aceite: GSC sem erros.
- **P11 UX/UI/DS** · 30/34/35/36 + contrastes (24) · Preservar identidade integral · Aceite: aprovação visual do dono.
- **P12 Conteúdo/CRO** · FAQs de objeção (09), disclaimers (18/19), registros pendentes (20, dados do dono), pricing/complaints (16) · Aceite: revisão regulatória ok.
- **P13 QA/Observabilidade/Handoff** · 03/15/22, alertas, handoff fiel · Aceite: alerta de teste disparando.
- **P14 Aquisição/analytics/bots** · matriz de eventos com sucesso real (pós-01), 13/14/25/26/27, UTMs, bots · Aceite: conversão de teste visível no GA4 com valor.
- **P15 Manutenção/SLA** · rotinas+SLA acionadas por alertas do P13 · Aceite: 1 ciclo semanal executado.
- Regra: cada prompt só abre quando o anterior fechar com evidência (Lei 10).

## 18. Backlog pós-meta (Nível 3)

Match com embeddings (payload pronto em `scripts/generate-embeddings.mjs`) · search estático · CAPI do Meta · newsletter automatizada além do digest · área do paciente · i18n · A/B tests · dashboards de funil · conteúdo programático por especialidade.

## 19. Prova mecânica

```
$ git status --porcelain
(saída vazia)
```
Verificado ao final da vistoria. Nenhum arquivo criado/editado/removido; nenhum commit/branch/push/PR/tag; nenhuma dependência alterada (npm ci usou somente o lockfile); nenhum painel tocado.

## 20. Contadores finais

**Achados:** 1 CRÍTICO · 9 ALTOS · 14 MÉDIOS · 9 BAIXOS · 3 REFINAMENTOS = **36** (+4 refutados declarados) · **Eixos auditados:** 22/22 · **Varreduras:** 18/18 + 6 exames + M1/M2 · **Páginas no build:** 103 (sitemap 100) · **Itens preservados:** 35/35 · **Perguntas abertas:** 6.

## 21. Perguntas essenciais ao dono

1. **CP-01:** autoriza a correção prévia do formulário antes do P1, ou adia para o P4? (pergunta literal na seção 16)
2. Pode habilitar **Settings→Actions→General→Allow GitHub Actions to create/approve PRs**? (destrava a esteira)
3. Pós-deploy de hoje: pode rodar **PSI** (pagespeed.web.dev) na home + /profissionais mobile e colar os números? (novo baseline de CAMPO)
4. **Números de CRN** de Gabrieli/Giancarla/Lara/Marvin; formação/nome completo da **Adriana**; **fotos+bio** de Eduarda/Tais; **Rafaela** entra na fonte de dados ou permanece só em quem-somos?
5. Decisão sobre **aggregateRating** (manter reviews do Google no schema × risco de política)?
6. Existe **Google Ads** ativo/planejado (define o peso do P14)?

## 22. Próximo passo recomendado

**Responder a pergunta da CP-01.** Com a resposta, avançar ao **Prompt 1**, cujo primeiro ato é gravar este relatório no repositório sem alteração de conteúdo.

---

1. **"Auditoria concluída em modo somente leitura."**
2. **"Nada foi alterado."** — prova: `git status --porcelain` → saída vazia (seção 19).
3. **"O próximo passo recomendado é: decisão sobre a correção prévia CP-01; em seguida, Prompt 1."**
4. **"Se houver correção prévia recomendada, aguardo autorização para executá-la antes do Prompt 1."** — há uma: CP-01 (seção 16).
5. (condicional não aplicável — existe correção prévia proposta; se preferir adiá-la ao P4, basta dizer e avançamos direto ao Prompt 1.)

**#ecooa**

---

## Adendo pós-relatório (2026-06-11, registrado na persistência do P01)

Fora do conteúdo verbatim acima, para rastreabilidade: as respostas do dono às 6 perguntas da seção 21 foram: (1) CP-01 **autorizada e executada** antes do P1 — PR #53 mergeada (`136175a`), formulários de conversão com submissão nativa verificável e evento em /obrigado; (2) dono habilitará a permissão do Actions (pendente: run `open-pr` ainda falhou às 23:39); (3) dono rodará o PSI pós-deploy (pendente de números); (4) CRNs/Adriana/fotos Eduarda-Tais/Rafaela: **pendências futuras** (P4/P12); (5) aggregateRating: avaliação entregue, decisão proposta = remover do JSON-LD no P10 mantendo o marquee visual; (6) **Google Ads: conta existe**, verba zero por enquanto. O ACHADO-01 está **resolvido** (CP-01); o teste E2E de produção pelo dono permanece pendente (HIP no P01).
