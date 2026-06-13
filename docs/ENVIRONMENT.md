# ENVIRONMENT.md — Ambientes do ecooa-website

> Produzido pelo P03 (2026-06-12). Estanqueidade (Lei 17): todo mecanismo é nomeado;
> pendências viram PROM ([SCOPE.md](./SCOPE.md) §9).

## 1. Ambientes e URLs

| Ambiente | URL | Branch | Uso |
|---|---|---|---|
| Local | localhost:4321 (dev) / preview Astro | qualquer | desenvolvimento |
| Preview CF | `<branch>-ecooa-website.<conta>.workers.dev` (+ URL por commit, comentadas no PR) | toda branch ≠ main | revisão/QA |
| Produção (pós-cutover) | https://www.somosecooa.com.br | main | público |
| Produção (interina, até o cutover) | GitHub Pages no mesmo domínio | main | público |
| Vercel previews (interino) | *.vercel.app | PRs | será DESATIVADO pós-cutover (DEC-16) |

Staging dedicado: desnecessário (previews por branch cumprem o papel) — decisão desta fase.

## 2. Branches

`main` = produção (deploy automático). `claude/pNN-*` = fases da esteira (preview por
branch). Branch protection do main: pendência do dono, cobrada no P8 (PROM-03 contexto).

## 3. Variáveis públicas (build; nomes apenas)

`PUBLIC_GTM_ID` · `PUBLIC_META_PIXEL_ID` — expostas no HTML por natureza (IDs públicos);
fallbacks de produção em `constants.ts`.

## 4. Variáveis privadas (build; nomes apenas)

`FORM_ACTION` (URL do GAS — identificador público de endpoint, tratado como config) ·
`PUBLIC_SENTRY_DSN` (futuro, P13). Nenhum valor real em docs/repos ✓.

## 5. Secrets

Nenhum secret de runtime existe (site estático). Segredos operacionais (contas, GAS)
vivem nos painéis do dono. GitHub Actions usa apenas `GITHUB_TOKEN` e
`LHCI_GITHUB_APP_TOKEN` (opcional, já configurado).

## 6. Analytics por ambiente (mecanismo)

Hoje: GTM/Pixel carregam em qualquer host após consentimento (previews CONTAMINAM se
visitados com consent). **Mecanismo definido (PROM-02, P14):** gate de host no código de
medição — tags só transmitem em `www.somosecooa.com.br`; flag explícita
(`?ecooa_debug=1`) para teste consciente. Interino: risco baixo aceito (tráfego de
preview ≈ só o dono/IA).

## 7. Formulários por ambiente (mecanismo)

Hoje: POST de preview grava no Sheets de produção (o redirect `_next` falha fora da
allowlist do GAS, mas o lead grava). **Mecanismo definido (PROM-07, P4):** gate de host
no `form-submit.ts` — fora do host canônico, bloquear envio real e exibir aviso
"ambiente de teste" + fallback WhatsApp; alternativa: `_source=preview` para triagem na
planilha. Interino: risco formalmente aceito pelo dono em 2026-06-12 (mesmo
comportamento que os previews Vercel já tinham; HIP-09 também cobre o teste real).

## 8. Indexação por ambiente (mecanismo)

Produção: indexável (Contrato). Previews CF: **PROM-01 (P7)** — `X-Robots-Tag: noindex`
para hosts `*.workers.dev` via `public/_headers` (regra com URL completa) com fallback
worker `run_worker_first`; verificação manual no primeiro preview (smoke §12). Vercel
previews: noindex por padrão da plataforma (HIP-06). Local: não exposto.

## 9. Critérios de promoção a produção

PR com CI verde (incl. Lighthouse desktop bloqueante) + smoke test do preview aprovado +
merge autorizado pelo dono. Cutover inicial: critérios extras em DEPLOYMENT §10.

## 10. Responsáveis e pendências do dono

Criar o Worker conectado ao repo (DEPLOYMENT §5) · cutover (§10, com autorização
literal) · desativar GH Pages e Vercel pós-estabilidade · variáveis de build (opcional).
