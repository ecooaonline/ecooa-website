# Cloudflare: configuração para sites Tier 5+

## Pré-requisitos

- Domínio registrado (qualquer registrar)
- Conta Cloudflare (plano Free é suficiente)
- Repositório com deploy configurado (GitHub Pages ou Cloudflare Pages)

## 1. Adicionar site ao Cloudflare

1. Acessar [dash.cloudflare.com](https://dash.cloudflare.com)
2. Clicar "Add a Site"
3. Informar o domínio (ex: `meusite.com.br`)
4. Selecionar plano Free
5. Cloudflare exibirá nameservers (ex: `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
6. No registrar do domínio, trocar os nameservers para os fornecidos pelo Cloudflare
7. Aguardar propagação (até 24h, geralmente 1-2h)

## 2. DNS

### GitHub Pages

```
Tipo: CNAME
Nome: @
Conteúdo: <username>.github.io
Proxy: ativado (nuvem laranja)

Tipo: CNAME
Nome: www
Conteúdo: <username>.github.io
Proxy: ativado
```

### Cloudflare Pages

```
Tipo: CNAME
Nome: @
Conteúdo: <projeto>.pages.dev
Proxy: ativado

Tipo: CNAME
Nome: www
Conteúdo: <projeto>.pages.dev
Proxy: ativado
```

### Outros registros comuns

```
Tipo: MX
Nome: @
Conteúdo: (conforme provedor de email)
Proxy: DNS only (nuvem cinza)

Tipo: TXT
Nome: @
Conteúdo: (SPF, DKIM, verificação Google Search Console)
```

## 3. SSL/TLS

- Acessar SSL/TLS > Overview
- Modo: **Full (strict)**
- Edge Certificates > Always Use HTTPS: **ativado**
- Edge Certificates > Minimum TLS Version: **TLS 1.2**
- Edge Certificates > HSTS:
  - Status: **ativado**
  - Max-Age: **12 meses**
  - Include subdomains: **sim**
  - Preload: **sim**
  - No-Sniff: **sim**

## 4. Speed

- Acessar Speed > Optimization
- Auto Minify: **HTML, CSS, JS** (todos ativados)
- Brotli: **ativado**
- Early Hints: **ativado**
- HTTP/2: já ativado por padrão
- HTTP/3 (QUIC): **ativado**

## 5. Caching

- Acessar Caching > Configuration
- Browser Cache TTL: **1 year** (Astro gera hashes nos assets)
- Always Online: **ativado**
- Caching Level: **Standard**

### Page Rules (3 gratuitas)

```
Regra 1: *dominio.com.br/fonts/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month
  Browser Cache TTL: 1 year

Regra 2: *dominio.com.br/_astro/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month
  Browser Cache TTL: 1 year

Regra 3: *dominio.com.br/*.html
  Cache Level: Standard
  Edge Cache TTL: 4 hours
```

## 6. Security

- Acessar Security > Settings
- Security Level: **Medium**
- Challenge Passage: **30 minutes**
- Browser Integrity Check: **ativado**

### WAF (plano gratuito)

- Managed Rules: ativadas por padrão
- Rate Limiting: configurar se necessário (plano Pro+)

## 7. Page Rules para redirect www

Se o site canonical é sem www:

```
Regra: www.dominio.com.br/*
  Forwarding URL (301): https://dominio.com.br/$1
```

## 8. Verificação

Após propagação, verificar:

```bash
# HSTS header
curl -I https://dominio.com.br | grep strict

# HTTP/2
curl -I --http2 https://dominio.com.br | head -1

# Redirect www
curl -I https://www.dominio.com.br | grep location

# SSL grade
# Acessar: ssllabs.com/ssltest
```

## 9. Cloudflare Analytics

- Acessar Analytics & Logs > Web Analytics
- Dados de tráfego, ameaças bloqueadas, cache hit ratio
- Não substitui GA4/GTM. é complementar (server-side vs client-side)

## Checklist final

- [ ] Nameservers apontando para Cloudflare
- [ ] SSL Full (strict) ativado
- [ ] HSTS com preload ativado
- [ ] Brotli + HTTP/3 ativados
- [ ] Page Rules configuradas (fonts, _astro, www redirect)
- [ ] Browser Cache TTL = 1 year
- [ ] Site acessível via HTTPS sem mixed content
- [ ] Lighthouse Performance >= 90 após Cloudflare
