# Segurança — ecooa-website

Documento operacional de segurança. Cobre o modelo de entrega, os headers HTTP,
a CSP em fases, o orçamento de segurança (anti-regressão) e o checklist de validação.

## Modelo de entrega

```
Visitante  ->  Cloudflare (proxy, free)  ->  GitHub Pages (origem)
                   |                              |
            headers + HSTS + Brotli         build estático Astro
            + cache imutável                (dist/, 102 páginas)
```

O GitHub Pages **não permite emitir HTTP response headers customizados**. Por isso o
Cloudflare entra na frente, em modo proxy, e aplica os headers de segurança na borda.
Nenhuma mudança no build, no deploy ou no código do site é necessária para isso.

Defesa em profundidade: a CSP também é mantida como `<meta http-equiv>` no
`BaseLayout.astro`, então continua valendo mesmo se alguém acessar a origem
`ecooaonline.github.io` diretamente.

## Frente 2 — Configuração do Cloudflare (passo a passo)

> Esta parte é feita no painel do Cloudflare e no registrador de domínio. O agente
> não tem acesso a essas camadas. Siga na ordem.

### 1. Adicionar o domínio

1. Criar conta free no Cloudflare e adicionar `somosecooa.com.br`.
2. Trocar os nameservers no registrador pelos dois que o Cloudflare indicar.
3. Aguardar a propagação (status "Active" no Cloudflare).

### 2. DNS

| Tipo  | Nome | Conteúdo                | Proxy             |
| ----- | ---- | ----------------------- | ----------------- |
| CNAME | www  | `ecooaonline.github.io` | Proxied (laranja) |
| CNAME | @    | `ecooaonline.github.io` | Proxied (laranja) |

> Se o registrador não aceitar CNAME na raiz, o Cloudflare faz CNAME flattening
> automaticamente. O site usa `www` como canônico; manter o redirect raiz -> www.

### 3. SSL/TLS

- Modo de criptografia: **Full (strict)**. NUNCA usar "Flexible" (causa loop de redirect
  com o GitHub Pages, que já serve certificado válido para o domínio).
- Edge Certificates: **Always Use HTTPS** = ON.
- **HSTS** = ON, com:
  - Max Age: `63072000` (2 anos)
  - Include subdomains: ON
  - Preload: ON
  - No-Sniff header: ON
- No GitHub Pages, manter **Enforce HTTPS** ligado.

### 4. Velocidade

- **Brotli** = ON (Speed -> Optimization). Fecha o `uses-text-compression` e melhora
  o LCP. Esta é a alavanca de performance que ficou pendente da Etapa 2.
- **NÃO** ligar Rocket Loader (quebra a ordem dos scripts inline de analytics/consent).

### 5. Transform Rule — Modify Response Header (global)

Rules -> Transform Rules -> Modify Response Header -> Create rule.
Filtro: `Hostname equals www.somosecooa.com.br` (ou "All incoming requests").
Ação: **Set static** para cada header abaixo.

| Header                       | Valor                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload`                 |
| `X-Content-Type-Options`     | `nosniff`                                                      |
| `X-Frame-Options`            | `SAMEORIGIN`                                                   |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                              |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                  |

> NÃO adicionar `Cross-Origin-Embedder-Policy` (quebraria GTM, Meta Pixel e imagens
> cross-origin). NÃO adicionar COEP/CORP sem teste dedicado.

### 6. CSP como header (opcional, recomendado na Fase A)

Adicionar também, na mesma Transform Rule, o header de CSP. É a mesma política do
`<meta>`, com `frame-ancestors 'self'` acrescentado (essa diretiva só funciona como
header, nunca em meta):

```
Content-Security-Policy:
default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms https://*.google-analytics.com https://*.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https: wss:; frame-src https://www.googletagmanager.com https://www.facebook.com; worker-src 'self' blob:; form-action 'self' https://script.google.com; base-uri 'self'; object-src 'none'; frame-ancestors 'self'
```

> Manter sincronizado com o `<meta>` do `BaseLayout.astro`. Se um lado mudar, o outro
> também muda.

### 7. Cache Rules (assets com hash)

Rules -> Caching -> Cache Rules. Criar duas regras com `Cache eligibility: Eligible for cache`
e `Edge TTL` alto, sobrescrevendo o header de origem:

| Quando (URI Path)     | Cache-Control                         |
| --------------------- | ------------------------------------- |
| começa com `/_astro/` | `public, max-age=31536000, immutable` |
| começa com `/fonts/`  | `public, max-age=31536000, immutable` |

HTML permanece com revalidação curta (não cachear agressivo) para deploys refletirem rápido.

## CSP em fases

- **Fase A (atual):** CSP compatível com `'unsafe-inline'`, mais `object-src 'none'`
  (meta) e `frame-ancestors 'self'` (header). Já leva a nota para a faixa alta.
- **Fase B (futura):** remover `'unsafe-inline'` de `script-src` usando nonce por
  request. Exige Cloudflare Workers (a borda injeta o nonce no HTML e no header). Os
  scripts inline de GTM/Pixel/consent passam a usar `nonce=...`.
- **Fase C (futura):** estreitar `connect-src` e `img-src` para a allowlist real
  (Google, Facebook, Clarity, Google Apps Script), com teste ao vivo de analytics,
  pixel e envio de formulário antes de aplicar.

## Security Budget (regras anti-regressão)

Toda contribuição precisa respeitar:

1. **Nova dependência client (runtime):** proibida sem justificativa (filosofia zero-dep).
   DevDeps são permitidas.
2. **Novo script de terceiro:** só consent-gated e interaction-only; adicionar o domínio
   à `script-src` da CSP (meta + header).
3. **Novo iframe/embed:** adicionar o domínio a `frame-src` explicitamente; nunca usar
   curinga.
4. **Nova conexão externa (fetch/beacon):** adicionar o domínio a `connect-src` quando a
   Fase C estiver ativa.
5. **Nova fonte externa:** proibida (fontes são self-hosted). Não adicionar Google Fonts.
6. **Novo arquivo em `public/`:** verificar que não contém dado pessoal, backup, dump,
   credencial ou metadado sensível.
7. **Nova variável de ambiente:** segredos reais nunca no código; usar secrets do
   provedor. Variáveis `PUBLIC_*` são visíveis no browser por design.
8. **Atualização de dependência:** rodar `npm run build` e smoke test antes de mergear.
   Nunca `npm audit fix --force` sem validar (quebra `@astrojs/check`).
9. **Formulário novo:** manter honeypot, time-gate, consent LGPD obrigatório e sanitização
   server-side (padrão do `google-apps-script.js`).

### Revisões periódicas

- Mensal: `npm audit` e revisão de PRs do Dependabot.
- Trimestral: revisar headers no securityheaders.com e a CSP.
- A cada nova página: rodar o checklist abaixo.

## Checklist antes de deploy / nova página

- [ ] `npm run check` -> 0 erros
- [ ] `npm run lint` -> 0 warnings
- [ ] `npm run build` -> 102+ páginas
- [ ] Nenhum segredo novo no código
- [ ] Nenhum `target="_blank"` sem `rel="noopener"` em link externo novo
- [ ] CSP cobre qualquer novo script/iframe/conexão
- [ ] Formulário novo tem honeypot + consent LGPD

## Validação da Etapa 3 (gate)

Após a Frente 2 aplicada no Cloudflare, medir e registrar antes/depois:

- [ ] `securityheaders.com/?q=https://www.somosecooa.com.br` -> alvo **A+**
- [ ] Mozilla Observatory -> alvo **90+**
- [ ] PSI re-rodado -> performance/SEO/a11y sem regressão (devem subir com Brotli)
- [ ] Smoke test: home, agendamento, contato, blog, match, fontes, imagens
- [ ] GTM e Meta Pixel carregam após consentimento
- [ ] Envio de formulário (agendamento/contato/newsletter) funciona ponta a ponta
- [ ] `curl -I https://www.somosecooa.com.br` mostra todos os headers

## Estado atual dos achados (Etapa 3)

| Achado                                  | Severidade | Status                             |
| --------------------------------------- | ---------- | ---------------------------------- |
| Headers só como meta (sem HTTP real)    | Alto       | Resolvido na Frente 2 (Cloudflare) |
| HSTS ausente                            | Alto       | Resolvido na Frente 2              |
| CSP com `'unsafe-inline'` em script-src | Médio      | Fase A ok; Fase B planejada        |
| `connect-src`/`img-src` amplos          | Médio      | Fase C planejada                   |
| `object-src` não definido               | Baixo      | Resolvido (meta)                   |
| Sem `dependabot.yml`                    | Baixo      | Resolvido                          |
| `console.warn` no honeypot              | Observação | Resolvido                          |
| security.txt com email @gmail           | Observação | Aceito (contato público válido)    |

Sem achados críticos. Sem segredos expostos. Prod sem vulnerabilidade de dependência.
