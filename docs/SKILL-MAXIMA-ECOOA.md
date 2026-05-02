# SKILL MÁXIMA: www.somosecooa.com.br

> Documento de referência absoluta do site ecooa. Contém toda a programação, dados, integrações, segredos operacionais e histórico técnico. Classificação: CONFIDENCIAL.
> Última atualização: 2026-05-02

---

## 1. IDENTIDADE

| Campo | Valor |
|-------|-------|
| Domínio | www.somosecooa.com.br |
| Marca | ecooa |
| Tipo | Clínica multidisciplinar de saúde, estética e longevidade |
| Localização | Rua Mariante, 180, 9º andar, Moinhos de Vento, Porto Alegre, RS 90430-180 |
| Coordenadas | -30.0277, -51.2007 |
| Telefone | (51) 99146-0909 |
| Email admin | ecooa.adm@gmail.com |
| Instagram | @somos.ecooa |
| Fundadores | Gustavo Gehrke (médico), Jessica Stein (nutricionista) |
| Horário | Seg-Sex 09:00-20:00 |
| Score GRADE | 85/100, Tier 5 Premium |

---

## 2. STACK TÉCNICO

| Camada | Tecnologia |
|--------|-----------|
| Framework | Astro 6.0.8 (static site generation) |
| Linguagem | TypeScript strict |
| Node | >= 22.12.0 |
| Deploy | GitHub Pages (ecooaonline/ecooa-website) |
| CDN | Cloudflare (pendente configuração completa) |
| Formulários backend | Google Apps Script |
| Analytics | GTM-TSR4GDMK (consent-gated) |
| Ads tracking | Meta Pixel 795926643274151 (consent-gated) |
| Sitemap | @astrojs/sitemap v3.7.1 |
| Fontes | Self-hosted (Arboria 300/400/500 + Playfair Display italic) |
| JS externo | Zero. Nenhuma dependência client-side. |

---

## 3. CREDENCIAIS E ENDPOINTS

```
Google Apps Script URL:
https://script.google.com/macros/s/AKfycbx3NOzVryn9prCJvKuBH20EFGiHoCENEZdR73zjaeiiUCl9PXk2sKrzGxrcrQ3ahQ-v/exec

WhatsApp Base:
https://wa.me/5551991460909

WhatsApp Default (com mensagem):
https://wa.me/5551991460909?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20com%20a%20equipe%20ecooa

Google Maps:
https://www.google.com/maps/place/ecooa

GTM Container: GTM-TSR4GDMK
Meta Pixel: 795926643274151
Consent key (localStorage): ecooa_cookie_consent

Google Sheets: ecooa-formularios
Email notificação: ecooa.adm@gmail.com
RSS: https://www.somosecooa.com.br/rss.xml
JSON Feed: https://www.somosecooa.com.br/feed.json
LLMs.txt: https://www.somosecooa.com.br/llms.txt
```

---

## 4. DESIGN SYSTEM (tokens.css)

### Cores

```css
/* Brand */
--color-brand: #C4BBB8;
--color-brand-light: #DDD8D5;
--color-brand-mid: #AEA5A2;
--color-brand-deep: #918886;
--color-brand-text: #706662;    /* AA >= 4.5:1 em fundos claros */
--color-brand-accent: #8D8381;  /* AA >= 3:1 em texto grande */

/* Neutros */
--color-white: #FFFFFF;
--color-warm: #FAF8F6;          /* Fundo principal */
--color-cream: #F3EEEA;
--color-stone: #E5DDD8;
--color-mist: #EDE8E4;

/* Tinta */
--color-ink: #1C1917;           /* Texto principal */
--color-ink-mid: #3D3835;
--color-ink-soft: #6B6360;
--color-ink-ghost: #6E6865;     /* AA >= 4.5:1 em fundos claros */
--color-black: #100E0D;
```

### Tipografia

```css
--font-primary: 'Arboria', system-ui, sans-serif;  /* Pesos: 300, 400, 500 */
--font-serif: 'Playfair Display', Georgia, serif;    /* Peso: italic */
```

### Espaçamento

```css
--space-xs: 8px;    --space-sm: 14px;   --space-md: 22px;
--space-lg: 36px;   --space-xl: 60px;   --space-2xl: 86px;   --space-3xl: 108px;
--section-px: 60px; --section-py: 108px; --section-py-sm: 76px;
```

### Animação

```css
--ease-spring: cubic-bezier(.22, .68, 0, 1.2);
--ease-out: cubic-bezier(.16, 1, .3, 1);
--transition-fast: 0.2s;  --transition-base: 0.3s;  --transition-slow: 0.5s;
```

---

## 5. ARQUITETURA DE PÁGINAS (23 páginas, 4.549 linhas)

### Páginas principais

| Página | Arquivo | Linhas | Função |
|--------|---------|--------|--------|
| Home | index.astro | 423 | Hero, pilares, profissionais, testimonials |
| Sobre | quem-somos.astro | 172 | História, fundadores, valores |
| Obrigado | obrigado.astro | 132 | Thank-you com match context |
| 404 | 404.astro | 30 | Erro 404 |

### Landing pages por unidade

| Página | Arquivo | Linhas |
|--------|---------|--------|
| ecooa.med | ecooa-med.astro | 324 |
| ecooa.esthetic | ecooa-esthetic.astro | 213 |
| ecooa.working | ecooa-working.astro | 243 |
| ecooa.mind | ecooa-mind.astro | 213 |

### Diretório de profissionais

| Página | Arquivo | Linhas |
|--------|---------|--------|
| Listagem | profissionais.astro | 272 |
| Perfil individual | profissionais/[slug].astro | 450 |

### Blog

| Página | Arquivo | Linhas |
|--------|---------|--------|
| Listagem | blog/index.astro | 93 |
| Post individual | blog/[slug].astro | 309 |
| Categoria | blog/categoria/[category].astro | - |

### Especialidades

| Página | Arquivo | Linhas |
|--------|---------|--------|
| Listagem | especialidades.astro | 74 |
| Individual | especialidade/[specialty].astro | - |

### Match Engine

| Página | Arquivo | Linhas |
|--------|---------|--------|
| Busca inteligente | match.astro | 630 |

### Formulários

| Página | Arquivo | Linhas |
|--------|---------|--------|
| Agendamento | agendamento.astro | 223 |
| Contato | contato.astro | 73 |
| Mentorias | mentorias.astro | 125 |

### Compliance

| Página | Arquivo | Linhas |
|--------|---------|--------|
| Privacidade | politica-de-privacidade.astro | 90 |

### Feeds

| Arquivo | Linhas | Formato |
|---------|--------|---------|
| rss.xml.ts | 64 | RSS 2.0 |
| feed.json.ts | 40 | JSON Feed |
| llms.txt.ts | 98 | LLM crawling instructions |

---

## 6. COMPONENTES (19 componentes, 927 linhas)

| Componente | Linhas | Função |
|-----------|--------|--------|
| Nav.astro | 61 | Navegação com mobile menu (hamburger) |
| Footer.astro | 56 | Rodapé com links |
| EcooaLogo.astro | 13 | Logo SVG |
| LocationCard.astro | 29 | Card de endereço/localização |
| BlogAuthor.astro | 134 | Card de autor do blog |
| ProfessionalCard.astro | 84 | Card de profissional |
| TestimonialCard.astro | 16 | Card de depoimento |
| PillarCard.astro | 18 | Card de pilar de serviço |
| CtaSection.astro | 67 | Seção de call-to-action |
| NewsletterCapture.astro | 77 | Form de newsletter inline |
| QuizSection.astro | 43 | Quiz/assessment interativo |
| OptimizedImage.astro | 58 | `<picture>` com AVIF source + WebP fallback |
| WavePattern.astro | 26 | SVG decorativo ondulado |
| Marquee.astro | 10 | Texto rolante |
| TableOfContents.astro | 114 | TOC automático de posts |
| WhatsAppFab.astro | 44 | Botão flutuante WhatsApp |
| CookieConsent.astro | 39 | Banner LGPD |
| B2BBanner.astro | 18 | Banner B2B |
| DisclaimerMedico.astro | 20 | Disclaimer de compliance médico |

---

## 7. PROFISSIONAIS (30 profissionais, 4 unidades)

### ecooa.med (1 profissional)

| Slug | Nome | Função | IG | Tags | Founder |
|------|------|--------|----|------|---------|
| gustavo-gehrke | Gustavo Gehrke | Médico Generalista | @gustavogehrke | Metabolismo, Hormônios, Emagrecimento, Longevidade, Estilo de Vida | Sim |

### ecooa.esthetic (15 profissionais)

| Slug | Nome | Função | IG | Tags |
|------|------|--------|----|------|
| danusa-pires | Danusa Pires | Enfermeira, Tricologista, Soroterapia | @dradanusapires | Tricologia, Soroterapia, Saúde Capilar |
| viviane-fagundes | Viviane Fagundes | Biomédica, Tricologista | @dravivianefagundes | Tricologia, Queda Capilar, Couro Cabeludo |
| yale-jeronimo | Yale Jeronimo | Médica Tricologista | @dra.yale | Tricologia, Alopécias, Medicina Capilar |
| larissa-wiebbelling | Larissa Wiebbelling | Médica, Implante Capilar | @larissawiebbelling | Transplante Capilar, Implante, FUE, Sapphire |
| cris-neumann | Cris Neumann | Fisioterapeuta Dermatofuncional | @dracrisneumann_ | Fisioterapia, Dermatofuncional, Corporal, Facial |
| susan-flach | Susan Flach | Biomédica, Tricologia e Pele | @dra.susanflach | Tricologia, Gerenciamento de Pele, Rejuvenescimento |
| natalie-queiroz | Natálie Queiroz | Osteopata | @osteonataliequeiroz | Osteopatia, Adultos, Crianças, Bebês |
| vitoria-machado | Vitória Machado | Médica Dermatologista | @vitoriadermato | Dermatologia, Estética Facial, Rejuvenescimento |
| renata-bohn | Renata Bohn | Médica Dermatologista | @renatabohn_dermato | Dermatologia, Estética, Cuidados com a Pele |
| karine-ellwanger | Karine Ellwanger | Biomédica, HOF | @karine.belezainteligente | Biomedicina Estética, HOF, Harmonização |
| leticia-de-melo | Leticia de Melo | Biomédica, HOF | @draleticiademelo | Biomedicina Estética, HOF, Estética Facial |
| jennifer-adam | Jennifer Adam | Biomédica, HOF | @dra.jenniferadam | Biomedicina Estética, HOF, Estética Avançada |
| jamylle-farias | Jamylle Farias | Odontóloga, HOF | @drajamyllefarias | Odontologia, HOF, Estética |
| adriana | Adriana | Terapeuta Integrativa | - | Terapia Integrativa, Biorressonância, Bem-estar |

### ecooa.working (12 profissionais)

| Slug | Nome | Função | IG | Tags | Founder |
|------|------|--------|----|------|---------|
| jessica-stein | Jessica Stein | Nutricionista, Vegana/Vegetariana | @jessicastein.nutri | Nutrição Vegana, Emagrecimento, Análise Bioquímica | Sim |
| maria-luisa-beltran | Maria Luísa Beltran | Nutricionista Esportiva | @marialuisabeltran.nutri | Performance Esportiva, Composição Corporal, Nutrição Vegana |
| adriano-lenz | Adriano Lenz | Nutricionista Ortomolecular | @adrianolenz | Ortomolecular, Metabolômica, Nutrigenômica |
| giancarla-rochemback | Giancarla Rochemback | Nutricionista Performance | @gi_rochemback | Performance Esportiva, Composição Corporal |
| vitoria-serpa | Vitoria Serpa | Nutricionista Performance | @vitoriaserpa | Performance Esportiva, Composição Corporal |
| lara-caye | Lara Caye | Nutricionista Performance | @laracaye | Performance Esportiva, Composição Corporal |
| gabrieli-klagenberg | Gabrieli Klagenberg | Nutricionista Comportamental | @gabrieliklagenberg | Nutrição Comportamental, Hábitos Alimentares |
| daniel-forster | Daniel Forster | Nutricionista | @daniel.nutricionista | Nutrição Clínica, Personalizada |
| marvin-marques | Marvin Marques | Nutricionista | @nutrimarvin | Nutrição, Resultados Sustentáveis |
| camila-cadore | Camila Cadore | Nutricionista | @nutricamilacadore | Nutrição, Personalizada |
| nasser-salem | Nasser Salem | Nutricionista | @nutri.nasser_ | Nutrição, Acompanhamento |
| verena-cattani | Verena Cattani | Nutricionista | @nutriverena | Nutrição, Integrada |

### ecooa.mind (3 profissionais)

| Slug | Nome | Função | IG | Tags |
|------|------|--------|----|------|
| manuela-vanti | Manuela Vanti | Psicóloga Clínica, TCC | @manuelavanti.psi | Psicologia Clínica, TCC, Ansiedade, Depressão |
| augusto-kauer | Augusto Kauer | Psicólogo Esportivo | @rotinadeatleta_psi | Psicologia Esportiva, Performance Mental, Foco |
| francielle-beria | Francielle Beria | Psicóloga Clínica, TCC | @psifrancielleberia | Psicologia Clínica, TCC, Ansiedade, Estresse |

---

## 8. MATCH ENGINE (ecooa.match)

### Arquitetura

3 camadas, 100% client-side, zero chamadas externas:

1. **Intent matching**: overlap de tokens com 31 intenções curadas (rápido, preciso)
2. **Expansão de sinônimos pt-BR**: 200+ clusters semânticos (aumenta recall sem ML)
3. **TF-IDF fallback**: sobre textos completos dos profissionais (cobertura)

### Scoring

```
score = overlap × 0.5 + min(tfidf, 1) × 0.3 + unitBoost(0.15) + curatedBoost(0.6 - pos × 0.05) + founderBoost(0.03)
```

### 31 Intenções Curadas

**ecooa.med (5):**
- emagrecer → gustavo-gehrke, jessica-stein, adriano-lenz
- hormonal → gustavo-gehrke, adriano-lenz
- longevidade → gustavo-gehrke, adriano-lenz
- metabolismo → gustavo-gehrke, adriano-lenz, jessica-stein
- check-up → gustavo-gehrke

**ecooa.esthetic - cabelo (4):**
- queda-cabelo → viviane-fagundes, yale-jeronimo, danusa-pires
- tricologia → yale-jeronimo, viviane-fagundes, susan-flach
- transplante → larissa-wiebbelling
- cabelo-fem → yale-jeronimo, viviane-fagundes, susan-flach

**ecooa.esthetic - pele (4):**
- rejuvenescimento → vitoria-machado, renata-bohn, susan-flach
- derma-clinica → renata-bohn, vitoria-machado
- manchas → renata-bohn, vitoria-machado, susan-flach
- acne → renata-bohn, vitoria-machado

**ecooa.esthetic - HOF (3):**
- hof → karine-ellwanger, leticia-de-melo, jennifer-adam, jamylle-farias
- labios → karine-ellwanger, leticia-de-melo, jennifer-adam
- sorriso → jamylle-farias

**ecooa.esthetic - corpo (2):**
- corporal → cris-neumann
- pos-operatorio → cris-neumann

**ecooa.esthetic - outros (4):**
- soroterapia → danusa-pires
- osteopatia → natalie-queiroz
- osteo-bebe → natalie-queiroz
- biorressonancia → adriana

**ecooa.working (7):**
- vegana → jessica-stein, maria-luisa-beltran
- performance → maria-luisa-beltran, giancarla-rochemback, vitoria-serpa, lara-caye
- crossfit → maria-luisa-beltran, vitoria-serpa, lara-caye
- ortomolecular → adriano-lenz
- comportamental → gabrieli-klagenberg
- nutri-crianca → jessica-stein
- emagrecer-nutri → jessica-stein, adriano-lenz, gabrieli-klagenberg

**ecooa.mind (9):**
- ansiedade → francielle-beria, manuela-vanti
- depressao → manuela-vanti, francielle-beria
- estresse → francielle-beria, manuela-vanti
- tcc → manuela-vanti, francielle-beria
- performance-mental → augusto-kauer
- pressao-competicao → augusto-kauer, francielle-beria
- autoestima → manuela-vanti, francielle-beria
- luto → manuela-vanti, francielle-beria
- relacionamentos → manuela-vanti, francielle-beria

### Clusters de Sinônimos (200+)

Cobrem todo o vocabulário paciente→clínico:
- Emagrecimento, peso, massa muscular, composição corporal
- Metabolismo, cansaço, check-up, pressão, diabetes, colesterol
- Intestino, refluxo, inflamação, imunidade, detox, inchaço
- Hormônios, tireoide, cortisol, testosterona, menopausa, TPM, SOP
- Libido, fertilidade, longevidade
- Vitaminas, minerais, suplementos, soroterapia
- Cabelo, queda, calvície, tricologia, transplante, caspa, PRP
- Pele, acne, manchas, rugas, rejuvenescimento, rosácea, dermatite
- Olheira, estria, peeling, laser, radiofrequência, suor, unha
- HOF, botox, preenchimento, lábios, bichectomia, bioestimulador
- Fios PDO, skinbooster, papada, sobrancelha
- Sorriso, estética dental
- Celulite, flacidez, gordura localizada, drenagem, pós-operatório
- Criolipólise, pilates
- Ansiedade, depressão, estresse, TCC, psiquiatria, medo, TOC
- TDAH, trauma, luto, autoestima, relacionamento
- Maternidade, adolescência, performance mental, competição
- Insônia, raiva, transtorno alimentar
- Nutrição, vegano, performance esportiva, crossfit, ortomolecular
- Nutrição comportamental, introdução alimentar, intolerância, jejum
- Dor, enxaqueca, osteopatia, tontura
- Bebê, cólica, biorressonância

### Proteção anti-cópia

Canary probe: query "ecooa match canary v1" retorna hash único rastreável.

---

## 9. FORMULÁRIOS E BACKEND

### Tipos de formulário

| Tipo | Campos | Redirect | Pixel Event |
|------|--------|----------|-------------|
| agendamento | nome, whatsapp, interesse | /obrigado | Lead |
| b2b-medicina | nome, whatsapp, email | /obrigado | Lead |
| b2b-nutricao | nome, whatsapp, área | /obrigado | Lead |
| newsletter | email | In-place | Subscribe |

### Google Apps Script

**Segurança:**
- Rate limiting: 10 submissões/hora por User-Agent hash
- Campo max: 500 caracteres
- Total max campos: 20
- Redirect allowlist: somosecooa.com.br, www.somosecooa.com.br, ecooaonline.github.io
- Input sanitization em todos os campos
- Validação por tipo (nome >= 2 chars, WhatsApp 10-13 dígitos, email regex)

**Abas do Sheet:**
- `agendamento`: Data/Hora, Nome, WhatsApp, Interesse, Profissional Recomendado, Match Intent, Status
- `b2b-medicina`: Data/Hora, Nome, WhatsApp, E-mail, Status
- `b2b-nutricao`: Data/Hora, Nome, Área de atuação, WhatsApp, Status
- `newsletter`: Data/Hora, E-mail, Origem, Status
- `followUp`: Criado em, Tipo, Nome, WhatsApp, Profissional Recomendado, Intent, Status, Prazo, Notificado em

**Automações:**
- Follow-up: leads de conversão geram entrada em `followUp` com prazo de 2h
- `checkFollowUps()`: trigger a cada 2h, envia email digest de pendências vencidas
- `generateNewsletterDigest()`: trigger quinzenal, busca RSS, monta email draft com 3 últimos posts
- Email notificação: HTML estilizado com seção match context se aplicável

### form-submit.ts (client-side)

- Selector: `.ecooa-form`
- Timeout: 15s (AbortController)
- Retry: 2 tentativas com backoff (1.5s, 3s)
- Conversion forms → redirect `/obrigado?type={formType}&profissional={slug}`
- Newsletter → mensagem in-place
- GTM events: `form_submit_success`, `form_submit_error`
- Meta Pixel: `Lead` (conversion), `Subscribe` (newsletter)

---

## 10. ANALYTICS E TRACKING

### analytics-events.ts

**Eventos rastreados:**
- `campaign_landing`: captura UTM params, persiste em sessionStorage
- `agendar_avaliacao`: clique em CTAs de agendamento
- `whatsapp_click`: clique em links WhatsApp (+ Meta Pixel Contact)
- `instagram_click`: clique em links Instagram
- `professional_view`: abertura de modal de profissional
- `contact_click`: clique em links de contato
- `outbound_click`: clique em links externos
- `phone_click`: clique em links tel:
- `scroll_depth`: 25%, 50%, 75%, 100%
- `engaged_time`: 30s, 60s, 120s, 300s
- `funnel_homepage`, `funnel_service_*`, `funnel_scheduling`, `funnel_contact`, `funnel_professionals`

### web-vitals.ts

Zero dependências externas. PerformanceObserver API direta.

| Métrica | Bom | Precisa melhorar | Ruim |
|---------|-----|-------------------|------|
| LCP | <= 2500ms | <= 4000ms | > 4000ms |
| CLS | <= 0.1 | <= 0.25 | > 0.25 |
| INP | <= 200ms | <= 500ms | > 500ms |
| FCP | <= 1800ms | <= 3000ms | > 3000ms |
| TTFB | <= 800ms | <= 1800ms | > 1800ms |

Reporta via `gtag('event', 'web_vitals', {...})`.
Flush no `visibilitychange` + `pagehide`.

### Carregamento consent-gated

1. GTM carrega SOMENTE após `ecooa_cookie_consent === 'accepted'`
2. Meta Pixel carrega SOMENTE após consent
3. Ambos são deferred: scroll/click/touchstart/keydown ou 12s timeout
4. Analytics events carregam via `requestIdleCallback` com timeout 3s

---

## 11. SEO E STRUCTURED DATA

### BaseLayout.astro

**Head (ordem exata):**
1. charset UTF-8
2. viewport
3. title: `{page} | ecooa`
4. meta description
5. robots
6. CSP + security headers
7. canonical + hreflang (pt-BR + x-default)
8. Open Graph (1200×630)
9. Twitter Card (summary_large_image)
10. theme-color (#FAF8F6)
11. favicon + manifest
12. Font preloads (4 arquivos)
13. JSON-LD: WebSite + MedicalBusiness
14. JSON-LD: BreadcrumbList (condicional)

**Schema.org JSON-LD:**

```json
{
  "@graph": [
    {
      "@type": "WebSite",
      "name": "ecooa",
      "url": "https://www.somosecooa.com.br",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.somosecooa.com.br/match?q={search_term_string}"
      }
    },
    {
      "@type": "MedicalBusiness",
      "name": "ecooa",
      "telephone": "+5551991460909",
      "address": {
        "streetAddress": "Rua Mariante, 180, 9º andar",
        "addressLocality": "Porto Alegre",
        "addressRegion": "RS",
        "postalCode": "90430-180"
      },
      "geo": { "latitude": -30.0277, "longitude": -51.2007 },
      "openingHours": "Mo-Fr 09:00-20:00",
      "founder": "Gustavo Gehrke",
      "aggregateRating": { "ratingValue": 5.0, "reviewCount": 65 },
      "medicalSpecialty": ["Dermatology", "Nutrition", "Psychology", "Psychiatry", "Aesthetic Medicine"]
    }
  ]
}
```

**Security Headers (meta):**
- CSP: `default-src 'self'; script-src 'self' 'unsafe-inline' googletagmanager clarity facebook; ...`
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

---

## 12. SERVICE WORKER (sw.js)

**Versão:** ecooa-v2

**Estratégias:**
- Precache: /, fonts (Arboria 300/400/500, Playfair italic), favicon
- HTML navigation: network-first → RUNTIME_CACHE fallback
- `/_astro/*`: cache-first (STATIC_CACHE, assets hashados)
- Fonts/favicons: cache-first
- Imagens: stale-while-revalidate
- Default: stale-while-revalidate

**Segurança:** só cacheia `response.ok` (evita cachear erros).

---

## 13. BLOG E CONTEÚDO

### Content Collections (content.config.ts)

```typescript
schema: z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string(),
  category: z.enum(['medicina', 'estetica', 'nutricao', 'saude-mental', 'longevidade', 'ecooa']),
  tags: z.array(z.string()),
  image: z.string().optional(),
  highlight: z.boolean().default(false),
  lastModified: z.string().optional(),
  draft: z.boolean().default(false),
})
```

**REGRA:** categorias sem acento (medicina, estetica, nutricao, saude-mental, longevidade, ecooa).

### 10 Autores do blog

| Nome | Slug | Unidade |
|------|------|---------|
| Dr. Gustavo Gehrke | gustavo-gehrke | med |
| Dra. Larissa Wiebbelling | larissa-wiebbelling | esthetic |
| Dra. Yale | yale-schmitz | esthetic |
| Manuela Vanti | manuela-vanti | mind |
| Jessica Stein | jessica-stein | working |
| Maria Luisa Beltran | maria-luisa-beltran | working |
| Adriano Lenz | adriano-lenz | med |
| Viviane Fagundes | viviane-fagundes | esthetic |
| Giancarla | giancarla-rochemback | working |
| Danusa | danusa-borba | med |

### 16 Especialidades

**med (6):** Metabolismo, Equilíbrio Hormonal, Emagrecimento, Longevidade, Alta Performance, Teste Genético

**esthetic (4):** Rejuvenescimento Facial, Estética Corporal, Saúde Capilar, Saúde da Pele

**working (4):** Nutrição Clínica, Nutrição Esportiva, Nutrição Estética, Nutrição Vegetariana/Vegana

**mind (3):** Psicologia, Psiquiatria, Coaching

---

## 14. CI/CD (GitHub Actions)

### deploy.yml
- Trigger: push to main, workflow_dispatch
- Node 22, npm ci → npm run build
- Upload to GitHub Pages, deploy

### lighthouse.yml
- Trigger: PR to main, workflow_dispatch
- Build + Lighthouse CI audit (treosh/lighthouse-ci-action@v12)
- Config em lighthouserc.json

### auto-merge.yml
- Trigger: push em branches `claude/**`
- Build → Lighthouse → merge automático se passes

### content-notify.yml
- Trigger: changes em `src/content/blog/**/*.md`
- Detecta novos/modificados via git diff
- Extrai frontmatter: title, category, author, date, draft
- GitHub Step Summary + webhook opcional

---

## 15. REGRAS DO PROJETO (CLAUDE.md)

1. Idioma: sempre pt-BR
2. Sem em-dash. Usar ponto ou vírgula.
3. Fontes self-hosted apenas. Zero Google Fonts externo. Zero bibliotecas JS externas.
4. Acentos obrigatórios no conteúdo (ç, á, é, ã, õ, etc.)
5. Labels de navegação são lowercase (identidade da marca)
6. Categorias de blog sem acento
7. Schema em `src/content.config.ts`
8. GTM e Pixel consent-gated (LGPD)
9. Imagens com `<picture>` AVIF + WebP
10. Service Worker com cache-first para assets

---

## 16. GAPS CONHECIDOS (auditoria GRADE 2026-04-30)

### Presença Digital Base (95/100)
- [ ] robots.txt e sitemap existem no código mas auditor não encontrou (verificar deploy)
- [ ] MX não configurado (sem email @somosecooa.com.br)
- [ ] HSTS não configurado (precisa Cloudflare)
- [ ] Apenas 2/7 headers de segurança em produção (CSP via meta tag, HSTS precisa header HTTP)

### Instagram (65/100)
- [ ] Bio inconsistente ("estética e saúde POA" vs. "medicina humanizada, longevidade")
- [ ] Ratio seguindo/seguidores desfavorável (1.171/3.439)
- [ ] Sem UTM no link da bio
- [ ] 644 posts → 3.439 seguidores (retorno baixo)

### Google e Descoberta (97/100)
- [ ] localPackSize 0 (não aparece no Local Pack)
- [ ] 48 resultados (modesto para 2 anos de operação)

### Conversão e Fluxo (85/100)
- [ ] Formulário único (match engine resolve parcialmente)
- [ ] Funil no GA4 não configurado (eventos existem, falta visualização)

### Percepção e Posicionamento (95/100)
- [ ] Inconsistência de linguagem IG vs. Site

---

## 17. HISTÓRICO DE DESENVOLVIMENTO

### Fases concluídas

| Fase | Entregas | Status |
|------|----------|--------|
| P0 | Fundação: stack, layout, tokens, segurança, compliance médico | Completo |
| P1 | Documentação, hierarquia CTAs | Completo |
| P2 | Integração: forms, GAS, analytics | Completo |
| P3 | SEO técnico: schema, sitemap, robots, canonical | Completo |
| P4 | Performance: OptimizedImage, SW, web-vitals | Completo |
| P5 | Match engine, NLP, 31 intents, 200+ sinônimos, blog, RSS | Completo |

### Fase pendente

| Fase | Entregas | Status |
|------|----------|--------|
| P6 | Smart routing (match→agendamento), thank-you page, image optimization | Planejado |
| P7 | GAS enhancement, Lighthouse CI, Web Vitals monitoring | Planejado |
| P8 | Workflow editorial, content automation, newsletter digest | Parcial (GAS pronto) |

### ARQ-ECOOA

Repositório privado `ecooaonline/ARQ-ECOOA` contendo template replicável extraído da arquitetura ecooa. 55 arquivos, zero dados específicos (tudo com prefixo `TODO_`). Usado para construir sites Tier 5+ para outros clientes.

---

## 18. ARQUIVOS CRÍTICOS (referência rápida)

```
src/data/constants.ts         — WhatsApp, telefone, email, GAS URL, Pixel ID, endereço
src/data/professionals.ts     — 30 profissionais com todos os dados
src/data/match-intents.ts     — 31 intenções curadas com topSlugs
src/data/specialties.ts       — 16 especialidades com keywords
src/data/blog-authors.ts      — 10 autores
src/content.config.ts         — Schema do blog (Zod)
src/scripts/match-engine.ts   — Motor NLP 3 camadas (434 linhas)
src/scripts/form-submit.ts    — Form handler com retry (110 linhas)
src/scripts/analytics-events.ts — 15 eventos GA4 (216 linhas)
src/scripts/web-vitals.ts     — LCP/CLS/INP/FCP/TTFB (151 linhas)
src/layouts/BaseLayout.astro  — SEO, schema, CSP, analytics (449 linhas)
src/pages/match.astro         — Match engine UI (630 linhas)
src/pages/profissionais/[slug].astro — Perfil individual (450 linhas)
google-apps-script.js         — Backend completo (572 linhas)
src/styles/tokens.css         — Design tokens
public/sw.js                  — Service Worker v2
```

---

*Documento gerado automaticamente. Propriedade intelectual de Gustavo Gehrke / ecooa.*
