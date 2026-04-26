# Roteiro Tier 5+: Site para Clínica / Empresa de Saúde

> Framework replicável para operações multi-profissional. Score mínimo 91/100 em todos os requisitos absolutos.
> Herda 100% do roteiro profissional individual e adiciona camadas de complexidade.

---

## Índice

| Fase | Nome | Entregas | Horas |
|------|------|----------|-------|
| F0-F9 | Base individual | Tudo do roteiro profissional | 66h |
| C1 | Diretório de profissionais | Data layer, cards, perfis individuais, schema | 12h |
| C2 | Unidades de negócio | Landing pages por vertical, especialidades | 10h |
| C3 | Triagem inteligente | Match engine, intents curados, NLP | 16h |
| C4 | Fluxo de conversão multi-profissional | Routing, agendamento contextual, thank-you | 8h |
| C5 | Conteúdo multi-autor | Blog com autores, categorias por pilar | 6h |
| C6 | Automação operacional | GAS avançado, follow-up, notificações | 8h |
| C7 | Reputação e prova social | Google Business, reviews, testimonials | 4h |
| C8 | Governança e escala | Workflow editorial, onboarding profissional | 4h |

**Total adicional: 68 horas**
**Total completo (individual + clínica): 134 horas**

---

## O que muda de Individual para Clínica

| Aspecto | Individual | Clínica |
|---------|-----------|---------|
| Profissionais | 1 | 5-50+ |
| Schema principal | Person/Physician | MedicalBusiness + Employee[] |
| Navegação | 5-6 links | 8-12 links + mega menu |
| Serviços | Página única | Landing page por unidade |
| Formulário | 1 genérico | Contextual por profissional |
| Blog | 1 autor | Multi-autor com atribuição |
| Triagem | Desnecessária | Match engine obrigatório |
| Analytics | Funil simples | Funil por unidade/profissional |
| Operação | Solo | Workflow + follow-up |

---

## C1: Diretório de Profissionais

### C1.1 Data Layer

Arquivo `src/data/professionals.ts` centraliza todos os dados:

```typescript
interface Professional {
  slug: string;
  name: string;
  role: string;           // "Médico · Endocrinologia"
  unit: 'med' | 'esthetic' | 'working' | 'mind'; // adaptar
  photo?: string;         // "/team/nome.webp"
  bg: string;             // cor fallback se sem foto
  ig?: string;            // "@handle"
  description: string;
  tags: string[];
  registration: string;   // CRM, CRN, CRP, etc.
  education: {
    graduation: string;
    postgrad?: string[];
    residency?: string;
  };
  specialties: string[];
  mainComplaints: string[];  // queixas que atende
}
```

**Helpers obrigatórios**:
- `getProfessionalBySlug(slug: string)`
- `getProfessionalsByUnit(unit: string)`

### C1.2 Componente ProfessionalCard

```
ProfessionalCard.astro
├── Props: name, role, bg, ig?, photo?, description?, tags?, clickable?, slug?
├── Modo simples: card com foto + nome + role + instagram
├── Modo clickable: data-attributes para modal, role="button", tabindex="0"
└── Estilos em components.css global (não scoped, para evitar conflito com OptimizedImage)
```

**Regra crítica**: se o card usa OptimizedImage internamente, os estilos do card devem estar em CSS global ou usar `:global()` para classes aplicadas ao `<img>`.

### C1.3 Página Índice (/profissionais)

- Grid de todos os profissionais agrupados por unidade
- Schema: MedicalOrganization com member[] listando cada profissional
- Filtro visual por unidade (tabs ou seções)

### C1.4 Página Individual (/profissionais/[slug])

Rota dinâmica gerando 1 página por profissional.

**Conteúdo**:
- Foto hero
- Nome, registro profissional, role
- Bio/descrição
- Formação (graduação, pós, residência)
- Especialidades (tags)
- Áreas de atuação
- CTA: WhatsApp + agendar via formulário

**Schema**: Physician (se médico) ou Person, com:
- name, jobTitle, description
- medicalSpecialty (se Physician)
- worksFor: MedicalBusiness
- alumniOf (formação)
- image, telephone, url

### C1.5 Especialidades

**Data**: `src/data/specialties.ts`

```typescript
interface Specialty {
  slug: string;
  name: string;
  unit: string;
  description: string;
  keywords: string[];
}
```

**Páginas**:
- `/especialidades`: índice geral
- `/especialidade/[slug]`: página por especialidade com profissionais relacionados

---

## C2: Unidades de Negócio

### C2.1 Landing Pages por Vertical

Cada unidade de negócio tem sua landing page dedicada:

```
/ecooa-med        → Medicina
/ecooa-esthetic   → Estética
/ecooa-working    → Nutrição
/ecooa-mind       → Saúde Mental
```

Adaptar slugs e nomes conforme a clínica.

**Estrutura de cada landing**:
1. Hero com headline + subtítulo da unidade
2. Abordagem/filosofia da unidade
3. Serviços/procedimentos oferecidos
4. Profissionais da unidade (ProfessionalCard grid)
5. FAQ (com schema FAQPage)
6. CTA de agendamento

**Schema**: FAQPage + MedicalWebPage por landing.

### C2.2 Navegação Multi-Unidade

```
Nav.astro
├── Logo
├── início
├── unidade 1
├── unidade 2
├── unidade 3
├── unidade 4
├── profissionais
├── blog
├── quem somos
├── match (triagem)
└── CTA: agendar (botão destaque)
```

Labels lowercase (identidade de marca).

---

## C3: Triagem Inteligente (Match Engine)

### C3.1 Arquitetura 3 Camadas

```
Input do usuário (texto livre)
        ↓
[Camada 1] Intent Matching
  Token overlap com intents curados (30+)
  Threshold: 0.28
        ↓
[Camada 2] Expansão de Sinônimos
  Clusters semânticos pt-BR (30+ grupos, 500+ termos)
  Peso: 0.75 exato + 0.25 expandido
        ↓
[Camada 3] TF-IDF Fallback
  Corpus: nome + role + description + tags de cada profissional
  IDF suavizado: log((N+1)/(df+1)) + 1
        ↓
Ranking final (top 3 profissionais)
```

### C3.2 Intents Curados

```typescript
// src/data/match-intents.ts
interface CuratedIntent {
  id: string;        // 'emagrecer'
  label: string;     // 'Quero emagrecer'
  query: string;     // texto expandido para NLP
  unit: string;      // hint de unidade
  topSlugs: string[]; // ranking manual de profissionais
}
```

Mínimo 20 intents cobrindo as queixas mais comuns.

### C3.3 Algoritmo de Ranking

```
score =
  overlap * 0.5 +                         // match de tokens
  min(tfidf, 1) * 0.3 +                   // relevância textual
  (unit === intentUnit ? 0.15 : 0) +      // boost de unidade
  (curatedSet.has(slug) ? 0.6 - pos*0.05 : 0) + // ranking curado
  (isFounder ? 0.03 : 0)                  // bonus fundador
```

### C3.4 NLP pt-BR

**Tokenização**:
- NFD decomposition + remoção de diacríticos
- Split em whitespace
- Remoção de stopwords (40+ palavras: de, do, da, para, com, etc.)

**Stemmer mínimo**:
- Plurais: -ões→-ão, -ais→-al, -éis→-el, -s (genérico)
- Não usar stemmer completo (over-stemming prejudica precision)

**Sinônimos**: clusters bidirecionais.
Exemplo: `['emagrecer', 'perder peso', 'gordura', 'dieta', 'deficit calorico']`

### C3.5 Página /match

- Campo de busca com texto livre
- Quick chips: botões com intents populares
- Resultados: 3 cards de profissional rankeados
- Cada resultado: foto, nome, role, score visual, 3 CTAs:
  1. WhatsApp direto
  2. Ver perfil completo
  3. Agendar via formulário (`/agendamento?profissional={slug}&from=match&intent={id}`)

**Schema**: MedicalBusiness (reforça a página como ferramenta médica).

### C3.6 Anti-Cópia

```typescript
function canaryProbe(signature: string): string {
  return 'canary:' + uniqueId;
}
```

Query específica retorna watermark rastreável.

### C3.7 Privacidade

- 100% client-side (zero requests de rede)
- Nenhum dado de busca enviado a servidor
- Nenhum log de pesquisa
- Todo o processamento no JavaScript do navegador

---

## C4: Fluxo de Conversão Multi-Profissional

### C4.1 Smart Routing

```
/match?q=emagrecer
    → resultado: gustavo-gehrke
    → CTA: "agendar via formulário"
    → /agendamento?profissional=gustavo-gehrke&from=match&intent=emagrecer
```

### C4.2 Agendamento Contextual

`/agendamento` lê URL params e adapta:

```html
<input type="hidden" name="matchProfessional" id="match-prof" />
<input type="hidden" name="matchIntent" id="match-intent" />
```

Se `?profissional=` presente:
- Banner: "Profissional recomendado: Dr. Gustavo Gehrke"
- Hidden fields populados automaticamente
- Dados enviados ao Google Sheets junto com o lead

### C4.3 Thank-You Contextual

`/obrigado?type=agendamento&profissional=gustavo-gehrke`:
- Foto + nome do profissional recomendado
- Mensagem personalizada por tipo de formulário
- Eventos de conversão: `gtag('event', 'conversion')` + `fbq('track', 'Lead')`
- Próximos passos: WhatsApp, Instagram, blog

### C4.4 Tracking por Profissional

Cada conversão registra:
- formType (agendamento, b2b, newsletter)
- source (match, perfil, landing, direto)
- professional (slug)
- intent (se veio do match)
- timestamp

---

## C5: Conteúdo Multi-Autor

### C5.1 Autores

```typescript
// src/data/blog-authors.ts
interface BlogAuthor {
  name: string;
  slug: string;
  role: string;
  specialty: string;
  unit: string;
  instagram: string;
}
```

Cross-referência com professionals.ts (mesmo slug).

### C5.2 Schema BlogPosting com Autor

```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "author": {
    "@type": "Person",
    "name": "Dr. Nome",
    "jobTitle": "Médico",
    "worksFor": { "@type": "MedicalBusiness", "name": "clínica" }
  },
  "publisher": { "@type": "MedicalBusiness", "name": "clínica" }
}
```

Para conteúdo médico: usar `@type: "MedicalWebPage"` em vez de `"Article"`.

### C5.3 Categorias por Pilar

6 categorias sem acento (slug-friendly):
```
medicina | estetica | nutricao | saude-mental | longevidade | institucional
```

Cada categoria tem rota: `/blog/categoria/[category]`

### C5.4 Cadência e Rotação

- Meta: 2-4 posts/semana
- Rotação entre pilares para topical authority equilibrada
- Cada autor contribui 1-2 posts/mês
- Cross-linking obrigatório: post → serviço → profissional

---

## C6: Automação Operacional

### C6.1 Google Apps Script Avançado

**Arquivo**: `google-apps-script.js`

**Funções**:

1. `doPost(e)`: recebe form submissions, salva no Google Sheets
2. `sendNotification(data)`: envia email para equipe com dados do lead
3. `sendAutoResponse(formType, data)`: confirmação automática ao lead (b2b)
4. `checkFollowUps()`: trigger a cada 2h, varre leads pendentes, envia lembrete
5. `generateNewsletterDigest()`: trigger semanal, monta draft com posts recentes

### C6.2 Follow-Up Automático

Nova aba `followUp` no Google Sheets:
- timestamp, nome, whatsapp, profissional recomendado
- status: Pendente/Atendido
- due date: timestamp + 2h

Trigger time-driven `checkFollowUps()`:
- Roda a cada 2h em horário comercial
- Varre pendências vencidas
- Envia email lembrete para admin

### C6.3 Context do Match no Email

Se lead veio do match:
```
Triado pelo match. 
Profissional recomendado: Dr. Gustavo Gehrke
Intenção: emagrecer
Link: https://www.dominio.com.br/profissionais/gustavo-gehrke
```

### C6.4 Content Notification (CI/CD)

```yaml
# .github/workflows/content-notify.yml
on:
  push:
    paths: ['src/content/blog/**']
```

Detecta novos posts, extrai frontmatter, loga checklist:
- [ ] Indexar no Google Search Console
- [ ] Post no Instagram
- [ ] WhatsApp Status
- [ ] Incluir na newsletter

---

## C7: Reputação e Prova Social

### C7.1 Google Business Profile

- Fotos profissionais (mínimo 20)
- Posts semanais com link para blog
- Q&A respondidos
- Horário atualizado
- Link para /match como URL de agendamento
- Responder 100% dos reviews

### C7.2 AggregateRating no Schema

```json
{
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "65",
    "bestRating": "5"
  }
}
```

Manter atualizado com reviews reais do Google.

### C7.3 Testimonials no Site

Componente `TestimonialCard.astro`:
- Citação real do paciente
- Nome (com consentimento)
- Procedimento/serviço
- Sem fotos de pacientes (compliance médico)

### C7.4 Badges de Autoridade

Na home, acima da dobra:
- Nota do Google (estrelas + número de reviews)
- Registro profissional do responsável técnico
- Anos de atuação
- Número de profissionais

---

## C8: Governança e Escala

### C8.1 Onboarding de Profissional

Checklist para adicionar novo profissional:

```
1. Adicionar entrada em src/data/professionals.ts
2. Adicionar foto em public/team/ (webp + avif, max 1200px)
3. Página /profissionais/[slug] gerada automaticamente
4. Adicionar em src/data/blog-authors.ts (se vai escrever)
5. Adicionar intents relevantes em match-intents.ts
6. Atualizar count no schema Organization
7. Build + verificar página individual
8. Indexar no Google Search Console
```

### C8.2 Workflow Editorial

```
Pauta → Rascunho (.md com draft: true) → Revisão médica → Publicação (draft: false) → Push → Deploy → Indexação
```

**Checklist por post**:
- [ ] Frontmatter completo (title, description, date, author, category, tags)
- [ ] Description < 160 caracteres
- [ ] H2/H3 hierarchy sem pular
- [ ] Cross-link para serviço/profissional
- [ ] Imagem de capa (se aplicável)
- [ ] Claims médicos revisados por profissional habilitado
- [ ] draft: false

### C8.3 Manutenção Periódica

**Mensal**:
- [ ] Atualizar aggregateRating (reviews do Google)
- [ ] Verificar links quebrados
- [ ] Verificar Lighthouse scores
- [ ] Atualizar fotos/profissionais se necessário

**Trimestral**:
- [ ] Revisar robots.txt e sitemap
- [ ] Auditar Web Vitals em produção (GA4)
- [ ] Atualizar dependências (Astro, sitemap)
- [ ] Revisar CSP headers

**Semestral**:
- [ ] Auditoria completa Gehrke Intelligence
- [ ] Revisar política de privacidade
- [ ] Atualizar schema com novos serviços
- [ ] Avaliar novas funcionalidades

---

## Diferenças Arquiteturais: Profissional vs. Clínica

```
PROFISSIONAL (66h)              CLÍNICA (134h)
─────────────────               ──────────────
1 pessoa                        5-50 profissionais
Person/Physician schema         MedicalBusiness + Employee[]
/sobre (1 página)               /quem-somos + /profissionais/[slug]
/servicos (lista)               /unidade-1, /unidade-2, ... + /especialidade/[slug]
Form genérico                   Form contextual (match → agendamento → obrigado)
Blog 1 autor                    Blog multi-autor com rotação
Sem triagem                     Match engine NLP 3 camadas
Analytics simples               Funil por unidade + profissional
Operação solo                   GAS com follow-up + workflow editorial
```

---

## Checklist de Entrega (Clínica)

```
Fase base (roteiro profissional):
[ ] F0-F9 completos (stack, layout, SEO, performance, compliance, CI/CD)

Camadas clínica:
[ ] C1: Diretório completo (professionals.ts + cards + /profissionais/[slug])
[ ] C2: Landing pages por unidade com FAQ schema
[ ] C3: Match engine funcional (intents + sinônimos + TF-IDF + anti-cópia)
[ ] C4: Fluxo match → agendamento → obrigado com tracking contextual
[ ] C5: Blog multi-autor com categorias por pilar
[ ] C6: GAS com follow-up + content notification
[ ] C7: GBP otimizado + reviews + testimonials
[ ] C8: Onboarding documentado + workflow editorial

Score final: >= 91/100 em todos os requisitos absolutos
Tier: 5+ (Premium Authority Site)
```
