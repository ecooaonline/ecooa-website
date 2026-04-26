# Roteiro Tier 5+: Site para Profissional Individual

> Framework replicável baseado na arquitetura ecooa. Score mínimo 91/100 em todos os requisitos absolutos.

---

## Índice

| Fase | Nome | Entregas | Horas |
|------|------|----------|-------|
| F0 | Fundação técnica | Stack, config, layout base, tokens CSS | 8h |
| F1 | Identidade e conteúdo | Tipografia, cores, copy, fotos | 6h |
| F2 | Páginas core | Home, sobre, serviços, contato | 12h |
| F3 | SEO técnico | Schema, sitemap, robots, canonical, OG | 6h |
| F4 | Performance | Fonts, imagens, SW, lazy loading, Web Vitals | 6h |
| F5 | Conversão | Formulários, tracking, funil, WhatsApp | 8h |
| F6 | Compliance | LGPD, cookies, privacidade, security headers | 4h |
| F7 | Conteúdo | Blog, content collections, editorial | 8h |
| F8 | CI/CD | Deploy, Lighthouse gate, notifications | 4h |
| F9 | Hardening | PWA, accessibility audit, testes finais | 4h |

**Total estimado: 66 horas**

---

## F0: Fundação Técnica

### F0.1 Stack

```
Astro 6 (static site generation)
TypeScript strict
@astrojs/sitemap
Zero dependências JS externas
Node >= 22
```

**Justificativa**: Astro gera HTML puro. Zero runtime JS no cliente por padrão. TypeScript strict previne bugs em produção. Sem React, Vue ou Svelte. Cada KB de JS externo custa pontos de performance.

**Arquivos**:
- `astro.config.mjs`: site URL, integrations (sitemap)
- `tsconfig.json`: extends astro/tsconfigs/strict
- `package.json`: apenas astro + sitemap como dependências

### F0.2 Layout Base

Arquivo único `src/layouts/BaseLayout.astro` que centraliza:

**Props obrigatórias**:
- title (string)
- description (string)

**Props opcionais**:
- ogImage, robots, breadcrumbs[], currentPage

**Head (ordem exata)**:
1. charset UTF-8
2. viewport (width=device-width, initial-scale=1.0)
3. title formatado: `{title} | {marca}`
4. meta description
5. CSP via meta http-equiv
6. X-Content-Type-Options: nosniff
7. X-Frame-Options: SAMEORIGIN
8. Permissions-Policy: camera=(), microphone=(), geolocation=()
9. canonical URL (auto-gerado)
10. hreflang pt-BR + x-default
11. OG tags (title, description, url, image, type, locale)
12. Twitter card (summary_large_image)
13. theme-color
14. Font preloads (woff2, crossorigin)
15. RSS/feed links
16. Favicon

**Body**:
1. Skip link (acessibilidade)
2. Nav
3. `<main id="main-content">`
4. Footer
5. CookieConsent
6. WhatsAppFab
7. Scripts (deferred)

### F0.3 Design Tokens

Arquivo `src/styles/tokens.css` com CSS variables:

```css
/* Cores - adaptar por marca */
--color-brand: #______;
--color-brand-light: #______;
--color-brand-text: #______; /* WCAG AA >= 4.5:1 */
--color-ink: #______;        /* texto principal */
--color-warm: #______;       /* fundo da página */

/* Tipografia */
--font-primary: 'NomeFonte', system-ui, sans-serif;
--font-serif: 'NomeSerif', Georgia, serif;

/* Espaçamento (escala 8px) */
--space-xs: 8px;
--space-sm: 14px;
--space-md: 22px;
--space-lg: 36px;
--space-xl: 60px;

/* Easing */
--ease-out: cubic-bezier(.16, 1, .3, 1);
--transition-base: 0.3s;
```

### F0.4 Sistema de Estilos

4 arquivos CSS, importados nesta ordem:

1. `base.css`: @font-face, reset, html/body, img, links, buttons
2. `tokens.css`: variáveis CSS (cores, tipografia, espaçamento)
3. `layout.css`: grids (.g2, .g3, .g4), hero, seções, utilitários
4. `components.css`: botões, cards, nav, footer, blog
5. `responsive.css`: breakpoints mobile-first, --section-px overrides
6. `animations.css`: reveal (.r → .in), delays (.d1, .d2, .d3)

**Regra**: fontes self-hosted em woff2, font-display: swap.

---

## F1: Identidade e Conteúdo

### F1.1 Tipografia

- Escolher 1 sans-serif (corpo) + 1 serif ou display (títulos)
- Máximo 3 pesos por fonte (ex: 300, 400, 500)
- Self-hosted em `/public/fonts/` como woff2
- Preload das fontes críticas no `<head>`

### F1.2 Paleta de Cores

Mínimo 5 tokens:
- brand (cor primária)
- brand-text (contraste WCAG AA sobre fundo claro)
- ink (texto corpo, quase-preto)
- warm (fundo da página, off-white)
- accent (CTAs, destaques)

**Validar contraste**: usar WebAIM Contrast Checker para todos os pares texto/fundo.

### F1.3 Fotografia

- Formato: WebP (principal) + AVIF (otimizado)
- Resolução: máximo 1200px de largura
- Peso: < 200KB por imagem
- Nomenclatura: `nome-descricao.webp` + `nome-descricao.avif`
- Local: `public/photos/` (ou equivalente)

### F1.4 Copy e Tom de Voz

- Definir tom (técnico, acolhedor, autoritário, casual)
- Escrever headline principal (hero)
- Escrever tagline/subtítulo
- Definir CTA primário e secundário
- Labels de navegação

---

## F2: Páginas Core

### F2.1 Home (index.astro)

**Seções obrigatórias (ordem)**:
1. Hero: headline + subtítulo + 2 CTAs (WhatsApp + agendamento)
2. Credenciais: badges de autoridade (registro profissional, anos de experiência)
3. Serviços: 3-4 cards dos principais serviços
4. Depoimentos: 2-3 testimonials reais
5. Blog: 3 posts mais recentes
6. CTA final: seção full-width com chamada para ação

**Schema**: WebSite + Organization/MedicalBusiness/LocalBusiness

### F2.2 Sobre (quem-somos.astro)

- História profissional
- Formação e credenciais
- Filosofia/abordagem
- Fotos do espaço/consultório

### F2.3 Serviços (servicos.astro + servico/[slug].astro)

- Página índice com todos os serviços
- Página individual por serviço com:
  - Descrição detalhada
  - Para quem é indicado
  - Como funciona
  - CTA de agendamento

**Schema**: MedicalProcedure, Service, ou Product conforme o tipo.

### F2.4 Contato (contato.astro)

- Formulário de contato
- WhatsApp direto
- Endereço + mapa
- Horário de atendimento
- Redes sociais

### F2.5 Agendamento (agendamento.astro)

- Formulário dedicado com campos relevantes
- Hidden fields para tracking (source, professional, intent)
- Integração com Google Apps Script

### F2.6 Obrigado (obrigado.astro)

- Confirmação de recebimento
- Próximos passos
- Links para redes sociais
- Eventos de conversão (gtag, fbq)
- robots: noindex,follow

### F2.7 Componentes Reutilizáveis

| Componente | Função |
|------------|--------|
| Nav.astro | Navegação responsiva com hamburger |
| Footer.astro | Links, disclaimer, newsletter |
| CookieConsent.astro | Banner LGPD |
| OptimizedImage.astro | Picture com AVIF/WebP |
| WhatsAppFab.astro | Botão flutuante WhatsApp |
| CtaSection.astro | Seção CTA full-width |
| TestimonialCard.astro | Card de depoimento |

---

## F3: SEO Técnico

### F3.1 Structured Data (JSON-LD)

**Obrigatórios por página**:

| Página | Schema Type |
|--------|-------------|
| Home | WebSite + Organization (ou MedicalBusiness/LocalBusiness) |
| Sobre | AboutPage |
| Serviço | Service/MedicalProcedure |
| Blog post | BlogPosting/Article |
| Contato | ContactPage |
| Todas | BreadcrumbList |

**Campos mínimos do Organization**:
- name, url, logo, phone, email
- address (PostalAddress com coordenadas)
- openingHours
- areaServed
- sameAs (redes sociais)
- founder/employee (se aplicável)

**Para profissionais de saúde**: usar MedicalBusiness, Physician, medicalSpecialty.

### F3.2 Sitemap e Robots

**sitemap**: gerado automaticamente pelo @astrojs/sitemap.

**robots.txt** (template):
```
User-agent: *
Allow: /
Disallow: /agendamento
Disallow: /_astro/

User-agent: Googlebot
Crawl-delay: 0

User-agent: GPTBot
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://www.seudominio.com.br/sitemap-index.xml
```

### F3.3 Canonical e hreflang

```html
<link rel="canonical" href={canonicalURL}>
<link rel="alternate" hreflang="pt-BR" href={canonicalURL} />
<link rel="alternate" hreflang="x-default" href={canonicalURL} />
```

### F3.4 Open Graph e Twitter Cards

```html
<meta property="og:type" content="website">
<meta property="og:title" content={title}>
<meta property="og:description" content={description}>
<meta property="og:url" content={canonicalURL}>
<meta property="og:image" content={ogImage}> <!-- 1200x630px -->
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
```

### F3.5 Feeds

- `rss.xml.ts`: RSS 2.0 para leitores tradicionais
- `feed.json.ts`: JSON Feed 1.1 para apps modernos
- `llms.txt.ts`: conteúdo estruturado para crawlers de IA

---

## F4: Performance

### F4.1 Fontes

- Self-hosted woff2 apenas
- Preload das fontes críticas (acima da dobra)
- font-display: swap em todas as @font-face
- Máximo 4 arquivos de fonte

### F4.2 Imagens

Componente `OptimizedImage.astro`:
```astro
<picture>
  <source srcset={avifSrc} type="image/avif" />
  <img src={webpSrc} alt={alt} width={w} height={h}
    loading={loading} fetchpriority={fp}
    decoding="async" sizes={sizes} class={cls} />
</picture>
```

**Regras**:
- LCP image: `loading="eager"`, `fetchpriority="high"`
- Demais: `loading="lazy"`, `fetchpriority="low"`
- Sempre definir width e height (evita CLS)
- Sempre definir sizes (evita download excessivo)

### F4.3 Service Worker

```javascript
// sw.js
const PRECACHE = ['/', '/fonts/*.woff2', '/favicon.svg'];

// Install: pre-cache críticos
// Activate: limpar caches antigos
// Fetch:
//   HTML → network-first (conteúdo fresco)
//   _astro/* → cache-first (assets hashados)
//   fonts/* → cache-first (imutáveis)
```

### F4.4 Lazy Loading

- IntersectionObserver para animações de reveal
- requestIdleCallback para scripts não-críticos
- Speculation Rules para prerender/prefetch de páginas prováveis

### F4.5 Web Vitals

Script `web-vitals.ts` sem dependências externas:
- PerformanceObserver para LCP, CLS, INP, FCP, TTFB
- Reporta via gtag('event', 'web_vitals')
- Flush no visibilitychange/pagehide

**Thresholds**:
| Métrica | Bom | Precisa melhorar | Ruim |
|---------|-----|-------------------|------|
| LCP | <= 2500ms | <= 4000ms | > 4000ms |
| CLS | <= 0.1 | <= 0.25 | > 0.25 |
| INP | <= 200ms | <= 500ms | > 500ms |
| FCP | <= 1800ms | <= 3000ms | > 3000ms |
| TTFB | <= 800ms | <= 1800ms | > 1800ms |

---

## F5: Conversão

### F5.1 Formulários

**Backend**: Google Apps Script (serverless, gratuito, LGPD-safe).

**form-submit.ts**:
- Intercepta forms com classe `.ecooa-form`
- POST para Google Apps Script
- Retry: 2 tentativas com backoff (1.5s, 3s)
- Timeout: 15s (AbortController)
- Sucesso: redirect para /obrigado ou mensagem in-place
- Erro: mensagem por 4s, botão reabilitado

**Hidden fields para contexto**:
- `_formType`: tipo do formulário
- `_source`: página de origem
- `matchProfessional`: profissional recomendado (se aplicável)

### F5.2 Analytics

**GTM** (consent-gated):
- Carrega apenas após consentimento LGPD
- Deferred: scroll/click/touch/keyboard ou 12s timeout
- Eventos: page_view, form_submit, whatsapp_click, cta_click

**Meta Pixel** (consent-gated):
- Mesma estratégia de carregamento
- Eventos: PageView, Lead, Subscribe, Contact

### F5.3 Funil de Conversão

```
Awareness → Consideration → Decision → Conversion
(page_view)  (view_service)  (cta_click)  (form_submit)
```

### F5.4 Exit Intent

- Desktop: mouseout no topo da página
- Mobile: timeout 45s
- Modal com CTA (WhatsApp + agendamento)
- 1x por sessão
- Focus trap (acessibilidade)

### F5.5 WhatsApp FAB

Botão flutuante fixo com link direto para WhatsApp com mensagem pré-preenchida.

---

## F6: Compliance

### F6.1 LGPD

**CookieConsent.astro**:
- Banner fixo no bottom
- Botões "aceitar" e "rejeitar"
- localStorage: `{marca}_cookie_consent`
- Evento customizado: `{marca}_consent_accepted`
- Link para política de privacidade

**Condicional**:
- GTM: carrega SOMENTE se consent === 'accepted'
- Meta Pixel: carrega SOMENTE se consent === 'accepted'
- Listener no evento de consentimento para ativar scripts

### F6.2 Política de Privacidade

Página `/politica-de-privacidade` com:
- Quais dados são coletados
- Como são usados
- Ferramentas de terceiros (GTM, Pixel, Google Forms)
- Direitos do titular (acesso, correção, exclusão)
- Contato do responsável

### F6.3 Security Headers

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms https://connect.facebook.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https: wss:;
  frame-src https://www.googletagmanager.com https://www.facebook.com;
  form-action 'self' https://script.google.com;
  base-uri 'self'
">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">
```

### F6.4 HSTS

Configurar no Cloudflare (não é possível via HTML):
- Max Age: 12 meses
- Include subdomains
- Preload

---

## F7: Conteúdo

### F7.1 Content Collections

```typescript
// src/content.config.ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    category: z.enum(['categoria1', 'categoria2', ...]),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  })
});
```

### F7.2 Estrutura de Posts

```markdown
---
title: "Título do artigo"
description: "Descrição para SEO"
date: "2026-04-26"
author: "Nome do Autor"
category: "categoria"
tags: ["tag1", "tag2"]
image: "/photos/imagem.webp"
draft: false
---

## Conteúdo em Markdown...
```

### F7.3 Páginas de Blog

- `/blog`: listagem com grid, filtro por categoria
- `/blog/[slug]`: artigo individual com TOC, autor, schema BlogPosting
- `/blog/categoria/[category]`: filtro por categoria

### F7.4 Cadência Editorial

- Meta: 2 posts/semana
- Rotação entre categorias/pilares
- Checklist SEO por post
- Cross-linking com serviços

---

## F8: CI/CD

### F8.1 Deploy (GitHub Pages)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  build:
    steps:
      - npm ci
      - npm run build
      - upload-pages-artifact (dist/)
  deploy:
    needs: build
    steps:
      - deploy-pages
```

### F8.2 Lighthouse Gate

```yaml
# .github/workflows/lighthouse.yml
on:
  pull_request:
    branches: [main]
jobs:
  lighthouse:
    steps:
      - npm ci && npm run build
      - treosh/lighthouse-ci-action@v12
```

**lighthouserc.json**:
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.90 }],
        "categories:accessibility": ["error", { "minScore": 0.90 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
      }
    }
  }
}
```

### F8.3 Content Notification

```yaml
# .github/workflows/content-notify.yml
on:
  push:
    branches: [main]
    paths: ['src/content/blog/**']
```

Detecta novos posts, extrai frontmatter, loga no GitHub Actions Summary.

---

## F9: Hardening

### F9.1 PWA

**manifest.json**:
- name, short_name, description
- start_url: "/"
- display: "standalone"
- icons (180x180 + SVG)
- theme_color, background_color

### F9.2 Accessibility Audit

Checklist final:
- [ ] Skip link funcional
- [ ] Heading hierarchy (h1 > h2 > h3, sem pular)
- [ ] Todos os img com alt descritivo
- [ ] aria-label em botões sem texto visível
- [ ] aria-expanded no hamburger menu
- [ ] Focus visible em todos os interativos
- [ ] Contraste WCAG AA em todos os pares
- [ ] Formulários com labels associados
- [ ] Keyboard navigation completa (Tab, Escape)

### F9.3 Testes Finais

- [ ] Lighthouse: >= 91 em performance, accessibility, best-practices, SEO
- [ ] LCP <= 2500ms
- [ ] CLS <= 0.1
- [ ] TBT <= 300ms
- [ ] Build < 15s
- [ ] Todas as páginas renderizam sem erro
- [ ] Formulários funcionam (submit + redirect)
- [ ] Analytics disparam (GTM + Pixel)
- [ ] Cookie consent funciona (aceitar/rejeitar)
- [ ] Service Worker registra e cacheia
- [ ] Mobile: menu abre/fecha, layout responsivo
- [ ] Schema: validar no Google Rich Results Test

---

## Checklist de Entrega

```
[ ] F0: Stack + layout + tokens configurados
[ ] F1: Fontes + cores + fotos + copy prontos
[ ] F2: Todas as páginas core funcionando
[ ] F3: Schema + sitemap + robots + OG + canonical
[ ] F4: Fonts otimizadas + OptimizedImage + SW + Web Vitals
[ ] F5: Forms + analytics + funil + exit intent + WhatsApp
[ ] F6: LGPD + privacidade + CSP + HSTS
[ ] F7: Blog + content collections + 5 posts iniciais
[ ] F8: Deploy automático + Lighthouse gate
[ ] F9: PWA + accessibility audit + testes passando

Score final: >= 91/100 em todos os requisitos absolutos
```
