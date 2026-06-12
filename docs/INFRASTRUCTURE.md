# INFRASTRUCTURE.md — Infraestrutura oficial do ecooa-website

> Produzido pelo P03 (2026-06-12). Documento DONO de: plataforma, domínio, DNS, CDN,
> SSL, limites e decisões de infraestrutura. Deploy operacional:
> [DEPLOYMENT.md](./DEPLOYMENT.md). Reversão: [ROLLBACK.md](./ROLLBACK.md). Ambientes:
> [ENVIRONMENT.md](./ENVIRONMENT.md). Promessas cruzadas: [SCOPE.md](./SCOPE.md) §9.

## 1. Plataforma oficial (DEC-15)

**Cloudflare Workers com Static Assets + Workers Builds (git)** — worker assets-only,
sem script. Config: `wrangler.jsonc` na raiz.

Motivo: única candidata que entrega TODAS as capacidades exigidas pela meta
(P00/Parte III) com a zona DNS **já na Cloudflare** (FATO do dono, 2026-06-12):
headers reais por arquivo `_headers`, `_redirects` nativo, Brotli na borda, cache
controlável, preview por branch com comentário no PR, rollback por versões, logs e
observabilidade, edge/Workers disponível para necessidades futuras (proxy de
formulário/CAPI/Turnstile), custo zero no tier gratuito.

## 2. Rejeitadas (com motivo)

| Candidata | Motivo da rejeição |
|---|---|
| GitHub Pages (atual) | Veto por capacidade (Lei 16): sem headers custom, sem CSP/HSTS reais, `Cache-Control: max-age=600` fixo, gzip-only, sem preview por PR, sem rollback nativo — bloqueia a meta (P00 ACHADO-02). |
| Cloudflare Pages | Funcional, mas a geração ATUAL recomendada pela Cloudflare é Workers Static Assets (guia oficial de migração Pages→Workers; novidades aterrissam em Workers). Adotar Pages hoje = migrar de novo amanhã. |
| Vercel | Capaz, porém: segunda plataforma fora da zona DNS existente; decisão do dono de desativá-la pós-migração (DEC-16); lock-in maior para edge futuro. |
| Netlify | Capaz, sem vantagem sobre CF aqui; conta inexistente; zona já na CF. |
| Servidor próprio | Custo operacional injustificável para estático. |

## 3. Data da verificação de capacidades (Lei 16)

**2026-06-12**, documentação oficial Cloudflare (developers.cloudflare.com), via busca
na doc: `_headers`/`_redirects` nativos em Workers Static Assets (guia de migração
Pages→Workers); preview URLs por branch/PR (changelog 2025-07-23) com default acoplado
ao toggle workers.dev (changelog 2025-10-23); `not_found_handling: "404-page"`;
`preview_urls` explícito no wrangler. **Previews de Workers NÃO documentam
X-Robots-Tag automático** (diferente do Pages) → PROM-01 com mecanismo explícito.

## 4. Domínio canônico (DEC-17)

**`https://www.somosecooa.com.br`** (www) — já é o canônico em produção (CNAME,
canonicals, sitemap, OG). As 6 regras: ✓ um só canônico · ✓ apex redireciona 301
(regra em `public/_redirects` + opcionalmente Redirect Rule na zona) · ✓ sitemap usa
canônico · ✓ canonicals usam canônico · ✓ OG usa canônico · Search Console deve refletir
www (validar com HIP-05, P10).

## 5. DNS (zona já na Cloudflare — FATO 2026-06-12)

Sem e-mail no domínio (FATO do dono): **sem MX/SPF/DKIM/DMARC a proteger**. Registros
relevantes hoje: `www` → GitHub Pages (CNAME/A); apex → redirecionamento. **Toda mudança
de DNS é do DONO**, no cutover (checklist em [DEPLOYMENT.md](./DEPLOYMENT.md) §10):
adicionar o Custom Domain `www.somosecooa.com.br` ao Worker (a CF ajusta o DNS
automaticamente) e garantir Redirect Rule apex→www. TTL/propagação: irrelevante
(mudança dentro da própria zona proxied).

## 6. CDN/proxy e plano de cache (aplicação: P7 — PROM-04)

CDN global da Cloudflare com Brotli automático na borda. Plano de cache documentado
(aplicar via `_headers` no P7): `/_astro/*` → `public, max-age=31536000, immutable` ·
HTML → `public, max-age=0, must-revalidate` · `sw.js` → `no-cache` · fontes/favicons →
`max-age=604800` (SW já faz cache-first local) · imagens → `max-age=86400, stale-while-revalidate`.
Regras: hash = cache longo; HTML conservador; SW com cuidado redobrado; CDN não pode
quebrar formulário (POST ao GAS não passa pelo cache) nem mascarar deploy (HTML
must-revalidate).

## 7. SSL/TLS

Certificado de borda automático da zona CF (emissão/renovação automáticas). Modo
SSL/TLS da zona: **Full (strict)** ao servir pelo Worker (sem origem externa).
HTTP→HTTPS: "Always Use HTTPS" na zona (painel do dono, item do cutover). TLS mínimo
recomendado: 1.2. HSTS: **somente no P7**, com decisão explícita do dono sobre preload
(porta de mão única).

## 8. Headers possíveis (viabilidade verificada; aplicação: P7 — PROM-05)

Mecanismo: arquivo `public/_headers` (nativo em Workers Static Assets) com suporte a
regras por URL completa (condicionalidade por host — essencial para PROM-01 noindex de
preview). Disponíveis: Cache-Control, CSP (com possibilidade futura de nonce via worker
`run_worker_first`), HSTS, X-Frame-Options/frame-ancestors, Referrer-Policy,
Permissions-Policy, X-Content-Type-Options, COOP/CORP. Headers por meta tag atuais
(BaseLayout) serão substituídos por headers HTTP no P7.

## 9. Edge/serverless — necessidades classificadas

| Necessidade | Classificação |
|---|---|
| Proxy de formulário com CORS/validação (GAS atrás de Worker) | precisa no P4 (avaliar) |
| Desafio anti-bot (Turnstile + verificação) | precisa no P4/P7 |
| Noindex condicional de preview | P7 (PROM-01; via `_headers` ou worker) |
| CAPI/conversões server-side (Meta) | P14/pós-meta |
| CSP nonce dinâmico | P7 (avaliar custo×benefício; site estático prefere hashes) |
| Filtro de bots/analytics edge | P14 |
| Search/match semântico no edge | pós-meta |
| Webhook/CRM/auth/área logada | não recomendado agora (SCOPE) |

## 10. Limitações conhecidas da plataforma escolhida

Preview URLs apenas em workers.dev (custom domain de preview não suportado — beta);
bindings únicos entre produção/preview (sem bindings por ambiente — irrelevante para
assets-only); arquivo de assets ≤25MiB por arquivo (folga enorme); Workers Builds com
limites de minutos do plano (suficiente: build ~5s).

## 11. Decisões pendentes

Nenhuma de plataforma. Cutover de produção: **aguarda autorização explícita do dono**
após smoke test do preview (pergunta literal em [DEPLOYMENT.md](./DEPLOYMENT.md) §10).

## 12. Promessas registradas

PROM-01..08 — registro canônico em [SCOPE.md](./SCOPE.md) §9.
