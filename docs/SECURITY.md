# SECURITY — ecooa-website

> Fase: P07 (MYTHOS). Data: 2026-06-14. Doc dono de segurança. Substitui o
> `docs/_legacy/SECURITY.md` (era Cloudflare-proxy → GitHub Pages). Plataforma canônica:
> **Cloudflare Workers Static Assets** (P03, `INFRASTRUCTURE.md`); headers via `_headers`.
> **Aplicação e verificação dos headers dependem do cutover (pendência do dono).**

## 1. Estado atual (GitHub Pages, pré-cutover)

O GitHub Pages **não emite response headers customizados**. Hoje a defesa-em-profundidade
vem de `<meta>` no `BaseLayout.astro` (verificado): `Content-Security-Policy`,
`X-Content-Type-Options: nosniff`, `Permissions-Policy`. Headers HTTP reais (HSTS,
frame-ancestors, etc.) **só existirão após o cutover** para Cloudflare.

Higiene já verificada no código:
- Todo `target="_blank"` tem `rel="noopener noreferrer"` (anti-tabnabbing) — grep limpo.
- Sem segredos no repositório: `FORM_ACTION`/`GTM_ID`/`META_PIXEL_ID` são identificadores
  **públicos** por natureza (`constants.ts`). Segredos reais vivem no painel do dono.
- Sem `unsafe-eval`. Formulários com honeypot + time-gate + consent (ver `INTEGRATIONS.md`).

## 2. Headers-alvo (aplicar em `public/_headers` no cutover)

| Header | Valor |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` ¹ |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` (reforço; a regra real é `frame-ancestors` na CSP) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |

¹ **`preload` é porta de mão única** — decisão consciente do dono (não submeter pela IA).
**NÃO** adicionar COEP/CORP sem teste dedicado (quebram GTM/Pixel/imagens cross-origin).

## 3. A Escada de CSP (Lei 24 — subir um degrau por vez, observando antes de impor)

- **Degrau 0** (sem CSP): estado de chegada, nunca de permanência.
- **Degrau 1 (estrutural, seguro por construção):** `frame-ancestors 'self'` +
  `object-src 'none'` + `base-uri 'self'` + `form-action 'self' https://script.google.com`
  + `upgrade-insecure-requests`. Não quebra nada; elimina clickjacking/injeção de objeto/
  form hijacking. **Aplicar direto no cutover.**
- **Degrau 2 (allowlist):** `script-src`/`style-src`/`connect-src`/`img-src`/`font-src`
  com os domínios EXATOS do mapa de recursos (GTM, Google Analytics, Meta Pixel/connect,
  Google Apps Script). Estreia em **Report-Only** → coleta violações → re-teste do funil
  (Protocolo do P04) → enforce.
- **Degrau 3 (strict):** nonce por request (exige Cloudflare Worker injetando o nonce),
  eliminando `'unsafe-inline'` de `script-src`. Mesmo rito: observar → re-testar → impor.

Mapa de recursos (para o Degrau 2): `script-src` = `'self'` + googletagmanager +
google-analytics + connect.facebook.net; `frame-src` = googletagmanager + facebook;
`connect-src` = `'self'` + google-analytics + (GAS via form POST); `img-src` =
`'self' data: https:`; `font-src` = `'self'` (fontes self-hosted); `form-action` =
`'self' https://script.google.com`. Manter o `<meta>` do BaseLayout sincronizado.

## 4. Security Budget (regras anti-regressão)

1. **Nova dependência client (runtime):** proibida sem justificativa (zero-dep). DevDeps OK.
2. **Novo script de terceiro:** só consent-gated + interaction-only; adicionar o domínio à
   `script-src` (meta + header).
3. **Novo iframe/embed:** adicionar o domínio a `frame-src` explicitamente; sem curinga.
4. **Nova conexão externa (fetch/beacon):** adicionar a `connect-src` no Degrau 2/3.
5. **Nova fonte externa:** proibida (fontes self-hosted; sem Google Fonts).
6. **Novo arquivo em `public/`:** sem dado pessoal, backup, dump, credencial ou metadado
   sensível.
7. **Nova variável de ambiente:** segredo real nunca no código; `PUBLIC_*` é visível no
   browser por design.
8. **Atualização de dependência:** `npm run build` + smoke antes de mergear; nunca
   `npm audit fix --force` sem validar (quebra `@astrojs/check`). Vuln dev-only pode ser
   corrigida via `overrides` sem tocar runtime.
9. **Formulário novo:** honeypot + time-gate + consent LGPD + validação server-side (GAS).

## 5. Como reportar vulnerabilidade

Contato: e-mail administrativo (`EMAIL` em `constants.ts`). Sem programa formal de bug
bounty. Não versionar provas com dados pessoais.

## 6. Validação (cutover-gated — pendência do dono)

Após aplicar os headers no cutover, medir antes/depois e colar:
- [ ] `curl -I https://www.somosecooa.com.br` mostra todos os headers.
- [ ] `securityheaders.com` → alvo **A+**; Mozilla Observatory → **90+**.
- [ ] Protocolo de Teste de Conversão (P04) re-executado: form/obrigado/consent intactos.
- [ ] Lighthouse Best Practices + Performance sem regressão (Rito do P06).
- [ ] GTM e Meta Pixel carregam só após consentimento.

## 7. Para o P08 (gates de CI — PROMs)

npm audit bloqueante (high/critical runtime), CodeQL (já ativo no CI), secret scanning,
validação de headers/CSP pós-cutover. Detalhe quando o P08 executar.
