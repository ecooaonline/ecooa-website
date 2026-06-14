# COMANDO GENESIS: Reconstruir www.somosecooa.com.br

> Este é o prompt definitivo para instruir uma IA avançada de geração de código a recriar o site ecooa do zero, com fidelidade absoluta à arquitetura, design, conteúdo e integrações originais.

---

## INSTRUÇÃO PRINCIPAL

Construa um site estático completo para a clínica **ecooa** (www.somosecooa.com.br), uma clínica multidisciplinar de saúde, estética e longevidade localizada em Porto Alegre, RS. O site precisa atingir score >= 91/100 em Performance, Accessibility, Best Practices e SEO no Lighthouse. Zero dependências JS externas. Zero runtime frameworks. HTML puro gerado em build time.

---

## STACK OBRIGATÓRIO

```
Framework:       Astro 6 (latest stable, static site generation)
Linguagem:       TypeScript strict
Sitemap:         @astrojs/sitemap
Deploy:          GitHub Pages
Backend forms:   Google Apps Script (serverless)
CDN:             Cloudflare (Free plan)
Analytics:       Google Tag Manager (consent-gated)
Ads:             Meta Pixel (consent-gated)
Fontes:          Self-hosted apenas (Arboria 300/400/500 + Playfair Display italic)
Node:            >= 22
JS externo:      ZERO. Nenhum npm package client-side. Nenhum CDN externo.
```

---

## IDENTIDADE DA MARCA

```
Nome:            ecooa
Domínio:         www.somosecooa.com.br
Slogan:          Sua saúde merece mais do que respostas genéricas.
Tom:             Empático, premium, humanizado, científico. Sem ser frio.
Estilo visual:   Minimalista, tipografia editorial, paleta neutra quente.
Labels de nav:   SEMPRE lowercase (identidade de marca).
Idioma:          pt-BR com acentos obrigatórios (ç, á, é, ã, õ).
Sem em-dash:     Usar ponto ou vírgula, nunca —.

Endereço:        Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS 90430-180
Coordenadas:     -30.0277, -51.2007
Telefone:        (51) 99146-0909
WhatsApp:        https://wa.me/5551991460909
Email admin:     ecooa.adm@gmail.com
Instagram:       @somos.ecooa
Google Maps:     https://www.google.com/maps/place/ecooa
Horário:         Seg-Sex 09:00-20:00
Google Rating:   5.0 (65+ reviews)
Fundadores:      Gustavo Gehrke (médico), Jessica Stein (nutricionista)
```

---

## DESIGN SYSTEM

### Paleta de cores

```css
/* Brand (taupe quente) */
--color-brand: #C4BBB8;
--color-brand-light: #DDD8D5;
--color-brand-mid: #AEA5A2;
--color-brand-deep: #918886;
--color-brand-text: #706662;       /* AA >= 4.5:1 em fundos claros */
--color-brand-accent: #8D8381;

/* Neutros (warm, não cinza frio) */
--color-white: #FFFFFF;
--color-warm: #FAF8F6;             /* Fundo padrão de todo o site */
--color-cream: #F3EEEA;
--color-stone: #E5DDD8;
--color-mist: #EDE8E4;

/* Tinta */
--color-ink: #1C1917;              /* Texto principal */
--color-ink-mid: #3D3835;
--color-ink-soft: #6B6360;
--color-ink-ghost: #6E6865;
--color-black: #100E0D;
```

### Tipografia

```css
--font-primary: 'Arboria', system-ui, sans-serif;  /* Light 300, Regular 400, Medium 500 */
--font-serif: 'Playfair Display', Georgia, serif;    /* Italic only */
```

Padrão de heading: font-serif italic para títulos, font-primary light para corpo. Headings usam `<em>` para a parte em itálico serif.

### Espaçamento

```css
--space-xs: 8px;  --space-sm: 14px;  --space-md: 22px;
--space-lg: 36px; --space-xl: 60px;  --space-2xl: 86px; --space-3xl: 108px;
```

### Animação

```css
--ease-spring: cubic-bezier(.22, .68, 0, 1.2);
--ease-out: cubic-bezier(.16, 1, .3, 1);
```

Reveal animation: elementos com classe `.r` aparecem com `IntersectionObserver` (threshold 0.05), adicionando classe `.in` que aplica `translateY(0) + opacity:1`. Delay incremental com `.d1`, `.d2`, `.d3`, `.d4`.

### Botões

```
.bd  = botão dark (fundo ink, texto white, hover lighten)
.bo  = botão outline (borda ink, fundo transparente)
.ghost = link com seta (sem borda, hover underline)
.btn-primary = fundo ink + texto white
.btn-outline = borda ink + fundo transparente
```

Todos os botões: `border-radius: 2px` (quase reto, estilo editorial premium).

---

## ARQUITETURA DE DADOS

### 1. constants.ts (configuração centralizada)

Todas as constantes do site em um arquivo: WhatsApp base URL, WhatsApp default (com mensagem pré-preenchida), Google Maps URL, Instagram URL, telefone, email, endereço completo, Google Apps Script URL, Meta Pixel ID.

### 2. professionals.ts (30 profissionais)

Interface Professional com campos: slug, name, role, unit ('med'|'esthetic'|'working'|'mind'), photo, ig, description, tags[], isFounder?, personalTouch?, registration?, education?, specialties?, clinicalDifferential?, mainComplaints?, faqPairs?, referralCriteriaFor?, pricing?.

Helpers: `getProfessionalBySlug(slug)`, `getProfessionalsByUnit(unit)`.

**30 profissionais organizados em 4 unidades:**

**ecooa.med (1):** Gustavo Gehrke (fundador, médico generalista, metabolismo/hormônios/emagrecimento)

**ecooa.esthetic (15):** Danusa Pires (enfermeira, tricologia/soroterapia), Viviane Fagundes (biomédica, tricologia), Yale Jeronimo (médica tricologista), Larissa Wiebbelling (médica, transplante capilar FUE/Sapphire), Cris Neumann (fisioterapeuta dermatofuncional), Susan Flach (biomédica, tricologia/pele), Natálie Queiroz (osteopata, adultos/crianças/bebês), Vitória Machado (dermatologista), Renata Bohn (dermatologista), Karine Ellwanger (biomédica, HOF), Leticia de Melo (biomédica, HOF), Jennifer Adam (biomédica, HOF), Jamylle Farias (odontóloga, HOF), Adriana (terapeuta integrativa, biorressonância)

**ecooa.working (12):** Jessica Stein (fundadora, nutricionista, vegana/vegetariana), Maria Luísa Beltran (performance esportiva/crossfit), Adriano Lenz (ortomolecular/nutrigenômica), Giancarla Rochemback (performance), Vitoria Serpa (performance), Lara Caye (performance), Gabrieli Klagenberg (comportamental), Daniel Forster, Marvin Marques, Camila Cadore, Nasser Salem, Verena Cattani

**ecooa.mind (3):** Manuela Vanti (psicóloga, TCC), Augusto Kauer (psicólogo esportivo), Francielle Beria (psicóloga, TCC)

Cada profissional tem `personalTouch` (frase em terceira pessoa sobre sua filosofia de cuidado).

### 3. match-intents.ts (31 intenções curadas)

Interface CuratedIntent: id, label, query (frase expandida para matching), unit, topSlugs[] (profissionais recomendados em ordem).

5 intents med, 17 esthetic (cabelo, pele, HOF, corpo, outros), 7 nutrição, 9 mente.

### 4. specialties.ts (16 especialidades)

Interface Specialty: slug, name, unit, description, keywords[]. 6 med, 4 esthetic, 4 working, 3 mind.

### 5. blog-authors.ts (10 autores)

Interface BlogAuthor: name, slug, role, specialty, unit, instagram?.

### 6. content.config.ts (blog schema)

Astro Content Collections com glob loader para `src/content/blog/**/*.md`. Schema Zod: title, description, date, author, category (enum sem acento: medicina|estetica|nutricao|saude-mental|longevidade|ecooa), tags[], image?, highlight?, lastModified?, draft?.

---

## PÁGINAS (23 total)

### Homepage (index.astro)

Seções em ordem:
1. **Hero**: h1 "Sua saúde merece mais do que respostas genéricas." com `<em>` em itálico serif. CTA "agendar avaliação" + "falar pelo whatsapp →". Badge Google 5.0★. SVG do logo ecooa® em fundo brand com wave pattern.
2. **Marquee**: texto rolante horizontal com especialidades.
3. **Empatia**: 3 perguntas empáticas ("Você já saiu de uma consulta sentindo que não foi ouvido?"), seguidas de resposta revelando o diferencial.
4. **Persona grid**: 4 cards "quero cuidar da minha saúde/estética/mente/nutrição" linkando para landing pages por unidade.
5. **Google Reviews**: 5 depoimentos reais com 5★, iniciais dos pacientes.
6. **Fundadores**: grid 2 colunas com fotos, bio e link para perfil.
7. **Quem somos**: texto sobre a clínica, foto da recepção, atributos (acolhedora, especialista, integradora, transformadora).
8. **Ecossistema**: 4 PillarCards (med, esthetic, working, mind) em grid.
9. **Profissionais destaque**: grid de ProfessionalCards dos principais profissionais.
10. **Match CTA**: "Não sabe por onde começar?" com link para /match.
11. **Blog preview**: 3 posts mais recentes.
12. **CTA final**: seção com foto da clínica, "Conheça a ecooa" + CTAs.

### Landing pages por unidade (4)

Cada uma segue a mesma estrutura: hero escuro com wave pattern, h1 com itálico serif, descrição da unidade, grid de profissionais filtrados por unidade, especialidades, CTA com WhatsApp e agendamento.

- `/ecooa-med`: Medicina de alta performance
- `/ecooa-esthetic`: Estética avançada e saúde capilar
- `/ecooa-working`: Nutrição inteligente
- `/ecooa-mind`: Saúde mental

### Profissionais

- `/profissionais`: grid de todos os 30 profissionais com filtro por unidade (tabs)
- `/profissionais/[slug]`: perfil individual com foto, bio, education, tags, schema Person/Physician, CTAs WhatsApp + agendamento

### Match Engine

- `/match`: hero escuro, input de busca, chips de acesso rápido (12 intents mais buscadas), resultados em cards com foto + bio + tags + score reason + 3 CTAs (ver perfil, agendar via formulário com params, WhatsApp). Schema MedicalWebPage.

### Blog

- `/blog`: listagem em grid com filtro por categoria, posts ordenados por data
- `/blog/[slug]`: post individual com TOC auto-gerado, schema Article/MedicalWebPage, autor com foto e bio
- `/blog/categoria/[category]`: arquivo por categoria

### Formulários

- `/agendamento`: formulário com campos nome, whatsapp, interesse. Hidden fields: matchProfessional, matchIntent (populados via URLSearchParams). Banner "Profissional recomendado via ecooa.match" se `?profissional=` presente.
- `/contato`: formulário simples de contato
- `/obrigado`: thank-you page com match context, dispara `gtag('event', 'conversion')` + `fbq('track', 'Lead')`, robots noindex.

### Outras

- `/quem-somos`: história da clínica, fundadores, valores
- `/mentorias`: página de mentorias
- `/especialidades` + `/especialidade/[specialty]`: diretório de especialidades
- `/politica-de-privacidade`: LGPD compliance
- `/404`: página de erro

### Feeds

- `/rss.xml`: RSS 2.0 com todos os posts
- `/feed.json`: JSON Feed
- `/llms.txt`: instruções para crawlers de IA

---

## COMPONENTES (19)

1. **Nav**: navegação horizontal, logo à esquerda, links lowercase, botão "agendar avaliação" highlight, hamburger mobile com aria-expanded, scroll lock quando aberto, Escape fecha
2. **Footer**: links organizados, contato, redes sociais, copyright
3. **WhatsAppFab**: botão flutuante fixo no canto inferior direito com ícone WhatsApp, link para WA_DEFAULT
4. **CookieConsent**: banner LGPD no bottom, botões aceitar/rejeitar, localStorage `ecooa_cookie_consent`, evento customizado `ecooa_consent_accepted`
5. **ExitIntent**: `<dialog>` modal. Desktop: mouseout no topo. Mobile: timeout 45s. 1x por sessão (sessionStorage). CTAs WhatsApp + agendamento. Focus trap com Escape.
6. **OptimizedImage**: wrapper `<picture>` com `<source type="image/avif">` (extensão trocada para .avif) + `<img>` WebP fallback. Props: src, alt, width, height, loading, fetchpriority, class, style.
7. **PillarCard**: card de serviço/pilar com ícone, título, descrição, link
8. **ProfessionalCard**: card com foto, nome, role, tags, link para perfil
9. **TestimonialCard**: depoimento com quote, estrelas, iniciais do paciente
10. **CtaSection**: seção de call-to-action com imagem de fundo, título, 2 botões
11. **WavePattern**: SVG parametrizado com ondas decorativas
12. **Marquee**: texto rolante horizontal com CSS animation
13. **TableOfContents**: TOC auto-gerado a partir de headings h2/h3 do post
14. **BlogAuthor**: card do autor com foto, nome, role, Instagram
15. **NewsletterCapture**: form inline para newsletter com validação de email
16. **QuizSection**: quiz/assessment interativo
17. **LocationCard**: card com endereço e link Google Maps
18. **B2BBanner**: banner informativo para B2B
19. **DisclaimerMedico**: disclaimer de compliance médico

---

## LAYOUT BASE (BaseLayout.astro)

Props: title, description, ogImage?, robots?, breadcrumbs?, currentPage?.

**Head (ordem exata):**
1. charset UTF-8 + viewport
2. title: `{title} | ecooa`
3. meta description + robots
4. CSP: `default-src 'self'; script-src 'self' 'unsafe-inline' googletagmanager clarity google-analytics facebook; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https: wss:; frame-src googletagmanager facebook; form-action 'self' script.google.com; base-uri 'self'`
5. X-Content-Type-Options, X-Frame-Options, Permissions-Policy
6. canonical + hreflang pt-BR + x-default
7. Open Graph (1200×630) + Twitter Card summary_large_image
8. theme-color #FAF8F6, favicon SVG, manifest.json
9. Preload: arboria-300.woff2, arboria-400.woff2, arboria-500.woff2, playfair-italic.woff2
10. JSON-LD: WebSite (com SearchAction para /match) + MedicalBusiness (endereço, geo, horário, rating 5.0/65, especialidades médicas)
11. JSON-LD: BreadcrumbList (condicional)

**Body:**
1. Skip link "Pular para o conteúdo"
2. Nav com currentPage
3. `<main id="main-content"><slot /></main>`
4. Footer
5. CookieConsent
6. WhatsAppFab
7. ExitIntent
8. Script: IntersectionObserver para reveal (.r → .in)
9. Script: Mobile menu toggle
10. Script: GTM consent-gated (deferred: scroll/click/touch/keydown ou 12s timeout)
11. Script: Meta Pixel consent-gated (mesma estratégia)
12. Script: analytics-events.ts via requestIdleCallback
13. Script: form-submit.ts (import direto)
14. Script: web-vitals.ts via requestIdleCallback
15. Script: Service Worker registration

---

## SCRIPTS CLIENT-SIDE (4)

### form-submit.ts
Intercepta forms `.ecooa-form`. POST via fetch com AbortController (15s timeout). Retry: 2 tentativas com backoff (1.5s, 3s). Conversion forms (agendamento, b2b-medicina, b2b-nutricao) redirect para /obrigado com params. Newsletter fica in-place. Dispara gtag form_submit_success/error + Meta Pixel Lead/Subscribe.

### analytics-events.ts
15 eventos GA4: campaign_landing (UTM capture com sessionStorage), agendar_avaliacao, whatsapp_click (+ Meta Pixel Contact), instagram_click, professional_view, contact_click, outbound_click, phone_click, scroll_depth (25/50/75/100%), engaged_time (30/60/120/300s), funnel steps por página.

### web-vitals.ts
Zero dependências. PerformanceObserver API direta. Métricas: LCP (<=2500ms), CLS (<=0.1), INP (<=200ms), FCP (<=1800ms), TTFB (<=800ms). Reporta via gtag('event', 'web_vitals'). Flush no visibilitychange + pagehide. CLS usa algoritmo de session windows v2.

### match-engine.ts
Motor NLP 3 camadas, 100% client-side:

**Camada 1 - Intent matching:** overlap de tokens com 31 intenções curadas. Score = exact × 0.75 + loose × 0.25.

**Camada 2 - Expansão de sinônimos:** 200+ clusters semânticos pt-BR mapeando linguagem de paciente para vocabulário clínico. Cobertura: emagrecimento, metabolismo, hormônios, cabelo, pele, HOF, corpo, mente, nutrição, dores, bebês, terapia integrativa.

**Camada 3 - TF-IDF fallback:** sobre textos completos dos profissionais (name + role + description + tags + personalTouch).

**Scoring final:** `overlap × 0.5 + min(tfidf, 1) × 0.3 + unitBoost(0.15) + curatedBoost(0.6 - pos × 0.05) + founderBoost(0.03)`

**Utilidades pt-BR:** normalize (NFD + diacríticos), stem (plurais pt-BR: -oes→-ao, -ais→-al, -eis→-el, -ns→-m, -es, -s), tokenize (normalize → split → filter stopwords → stem), expandTokens (sinônimos bidirecionais stemados).

**Canary probe:** query "ecooa match canary v1" retorna hash único para detectar cópias.

---

## GOOGLE APPS SCRIPT (backend)

**Segurança:** rate limiting 10/hora por User-Agent hash (CacheService), campo max 500 chars, max 20 campos, redirect allowlist, input sanitization, validação por tipo.

**4 tipos de formulário:** agendamento (nome, whatsapp), b2b-medicina (nome, whatsapp, email), b2b-nutricao (nome, whatsapp, área), newsletter (email).

**5 abas no Sheet:** agendamento, b2b-medicina, b2b-nutricao, newsletter, followUp.

**Automações:**
- Email notificação HTML estilizado para cada lead (com seção match context se aplicável, botão WhatsApp direto)
- Follow-up: leads de conversão geram entrada em aba `followUp` com prazo de 2h
- `checkFollowUps()`: trigger a cada 2h, envia digest de pendências vencidas
- `generateNewsletterDigest()`: trigger quinzenal, busca RSS, monta draft com 3 últimos posts

---

## SERVICE WORKER

Versão: ecooa-v2. Precache: /, 4 fontes, favicon. Estratégias: HTML → network-first, `/_astro/*` → cache-first (hashados), fonts/favicons → cache-first, imagens → stale-while-revalidate. Só cacheia response.ok.

---

## CI/CD (GitHub Actions)

1. **deploy.yml**: push to main → npm ci → build → GitHub Pages
2. **lighthouse.yml**: PR to main → build → Lighthouse CI (performance >= 0.90, accessibility >= 0.90, SEO >= 0.95, LCP <= 2500, CLS <= 0.1)
3. **auto-merge.yml**: branches claude/** → build + lighthouse → merge automático
4. **content-notify.yml**: mudanças em blog → detecta novos posts, extrai frontmatter, GitHub Summary

---

## PWA

manifest.json: name "ecooa - Saúde, Estética e Longevidade", short_name "ecooa", display standalone, background/theme #FAF8F6, categories health/medical/beauty.

---

## COMPLIANCE

1. **LGPD**: CookieConsent com aceitar/rejeitar, GTM e Pixel só carregam após consentimento
2. **Privacidade**: página /politica-de-privacidade com dados coletados, uso, terceiros, direitos
3. **CSP**: Content-Security-Policy via meta tag
4. **Medical disclaimer**: componente DisclaimerMedico em páginas de serviço
5. **Schema.org**: MedicalBusiness, Person/Physician, Article/MedicalWebPage, FAQPage, BreadcrumbList

---

## COPY E TOM DE VOZ

**Hero principal:**
"Sua saúde merece mais do que respostas genéricas."
"Medicina, nutrição, psicologia e estética trabalhando juntos. Para que você se sinta, de verdade, cuidado."

**Seção empatia (3 perguntas):**
"Você já saiu de uma consulta sentindo que não foi ouvido?"
"Já fez exames e ninguém explicou direito o que significam?"
"Já tentou emagrecer sem entender por que não funciona?"

**Persona cards:**
"quero cuidar da minha saúde" → /ecooa-med
"quero cuidar da minha estética" → /ecooa-esthetic
"quero cuidar da minha mente" → /ecooa-mind
"quero cuidar da minha nutrição" → /ecooa-working

**Atributos da marca:**
acolhedora, especialista, integradora, transformadora

**Depoimentos reais (5):**
- "Fui muito bem recebida desde a recepção. O Dr. Gustavo ouviu tudo com calma e explicou cada detalhe dos meus exames."
- "O ambiente é lindo e acolhedor. Fiz acompanhamento nutricional e médico ao mesmo tempo, e os profissionais conversaram entre si."
- "Depois de passar por vários endocrinologistas sem resultado, encontrei na ecooa o cuidado que eu precisava."
- "A nutricionista e o médico trabalham juntos no meu protocolo."
- "Comecei pela psicóloga e fui encaminhada para a nutrição. Tudo no mesmo lugar."

---

## REQUISITOS DE QUALIDADE

- Lighthouse Performance >= 91
- Lighthouse Accessibility >= 91
- Lighthouse Best Practices >= 91
- Lighthouse SEO >= 95
- LCP <= 2500ms
- CLS <= 0.1
- INP <= 200ms
- Build time < 15s
- Zero erros TypeScript
- 96+ páginas geradas (23 estáticas + 30 profissionais + 29 blog + categorias + especialidades)
- Todas as imagens com width/height definidos (zero CLS por imagens)
- Todas as fontes preloaded (zero FOUT)
- Service Worker registrado
- Formulários funcionais (submit + redirect)
- Analytics disparando (GTM + Pixel, pós consent)
- Schema validável no Google Rich Results Test
- WCAG AA em contraste de cores
- Keyboard navigation completa (Tab, Escape, Enter)
- Skip link funcional
- Heading hierarchy sem pular níveis

---

## EXECUÇÃO

Gere TODOS os arquivos necessários para o projeto funcionar em produção. Isso inclui:
- astro.config.mjs, tsconfig.json, package.json
- Todos os arquivos em src/ (layouts, components, pages, scripts, data, styles, content.config.ts, env.d.ts)
- Todos os arquivos em public/ (robots.txt, manifest.json, sw.js, favicon)
- google-apps-script.js
- .github/workflows/ (deploy, lighthouse, auto-merge, content-notify)
- CLAUDE.md

Não resumir. Não omitir. Não simplificar. Cada arquivo deve estar completo e pronto para produção.
