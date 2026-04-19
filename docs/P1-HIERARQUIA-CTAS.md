# P1.1 — HIERARQUIA DE CTAs

**Status**: Documentação e Otimização

**Data**: 2026-04-30

---

## Funil de Conversão ECOOA

### Topo do Funil (Awareness)
**Objetivo**: Atrair, educar, gerar interesse

| Página | CTA Primária | CTA Secundária | Intent |
|--------|--------------|----------------|--------|
| **Home (Hero)** | "agendar avaliação" | "falar pelo whatsapp" | discovery |
| **Home (Empathy)** | "agendar avaliação" | — | engagement |
| **Home (Persona - 4 cards)** | Link para `/ecooa-med/esthetic/mind/working` | — | education |
| **Home (Cuidado)** | "falar pelo whatsapp" | — | decision |
| **Home (Fim)** | "O primeiro passo começa com uma conversa" | — | conversion |

### Meio do Funil (Consideration)
**Objetivo**: Detalhar serviços, demonstrar expertise

| Página | CTA Primária | CTA Secundária | Intent |
|--------|--------------|----------------|--------|
| **/ecooa-med** | "conhecer a metodologia" ou "agendar" | "falar pelo whatsapp" | conversion |
| **/ecooa-esthetic** | "conhecer a metodologia" | "falar pelo whatsapp" | conversion |
| **/ecooa-mind** | "conhecer a metodologia" | "falar pelo whatsapp" | conversion |
| **/ecooa-working** | "conhecer a metodologia" | "falar pelo whatsapp" | conversion |
| **/quem-somos** | "nossa história" (link) | "Venha conhecer a ecooa" (no final) | engagement |
| **/blog** | [Artigos] | "Quer cuidar da sua saúde?" | conversion |
| **/blog/[slug]** | [Newsletter] | "falar pelo whatsapp" | nurture |
| **/profissionais** | [Cards - perfil individual] | "agendar" via whatsapp | conversion |
| **/profissionais/[slug]** | "agendar com {prof}" | "falar pelo whatsapp" | conversion |

### Fundo do Funil (Conversion)
**Objetivo**: Fechar agendamento

| Página | CTA Primária | CTA Secundária | Intent |
|--------|--------------|----------------|--------|
| **/agendamento** | "quero ser atendido" (form) | "falar pelo whatsapp" | conversion |
| **Qualquer página** | "falar pelo whatsapp" | sempre disponível | escape |

---

## Princípios de CTA

### 1. **Consistência Verbal**
- **Principal**: "agendar avaliação" ou "agendar com {prof}"
- **Alternativa**: "falar pelo whatsapp"
- **Escape**: sempre WhatsApp na sidebar/banner
- Nunca: "clique aqui", "saiba mais" genérico

### 2. **Um CTA por Seção**
- Máximo 2 CTAs por seção (primária + secundária)
- Primária com `class="bd"` (button dark)
- Secundária com `class="ghost"` (transparent)

### 3. **Intent Tracking**
Todos os CTAs deve ter `data-intent="{page}-{section}"` para GTM:

```html
<a href="/agendamento" class="bd" data-intent="home-hero">agendar avaliação</a>
<a href={WA} class="ghost" data-intent="home-hero">falar pelo whatsapp</a>
```

### 4. **Mobile-First**
- Em telas <768px: apenas CTA primária visível (secundária collapsa em menu)
- Stack vertical em mobile
- Padding respeitado

---

## Matriz de CTAs por Página

### Home (/index.astro)
```
1. Hero: [primária: agendar | secundária: whatsapp]
2. Empathy: [primária: agendar] — remover se redundante
3. Persona: [4 cards → rotas de educação]
4. Cuidado: [primária: whatsapp] — antes do footer
5. Fim (CtaSection): [primária: agendar]
```

**Checklist**:
- ✅ Hero tem 2 CTAs com intents diferentes
- ✅ Persona cards linkam para rotas, não agendamento
- ✅ CtaSection no final com copy de urgência
- ✅ Google Analytics tags em todos

### Quem Somos (/quem-somos.astro)
```
1. Hero: [link "nossa história" interno]
2. Liderança: [cards com "ver perfil" → /profissionais/[slug]]
3. Fundadores: [carta narrativa - sem CTA]
4. Bandeiras: [texto educacional - sem CTA]
5. Valores: [texto educacional - sem CTA]
6. Espaço: [sem CTA]
7. CtaSection Fim: [primária: "Venha conhecer"]
```

**Checklist**:
- ✅ Foco em confiança e educação, não hard-sell
- ✅ CTA principal só no final
- ✅ Links internos de profissionais funcionam

### Blog (/blog/index.astro)
```
1. Hero: [sem CTA]
2. Posts: [clique em card → /blog/[slug]]
3. Newsletter: [email → inscrição]
4. CtaSection: [primária: "Quer cuidar?"]
```

**Checklist**:
- ✅ Newsletter com honeypot (campo invisible)
- ✅ Rate-limit em submit (5s)
- ✅ Post cards clicáveis, não linkáveis

### Blog Post (/blog/[slug].astro)
```
1. Hero: [sem CTA]
2. Conteúdo: [toc com âncoras internas]
3. Autor: [card do prof → /profissionais/[slug]]
4. Newsletter: [email → inscrição]
5. Posts Relacionados: [cards clicáveis]
6. CtaSection: [primária: "Falar com especialista"]
```

**Checklist**:
- ✅ Índice de conteúdo clicável
- ✅ Autor é prof da ecooa (link para perfil)
- ✅ Newsletter no fim
- ✅ Related posts = mesma categoria

### Profissionais (/profissionais.astro)
```
1. Hero: [sem CTA]
2. Grid de cards: [clique → /profissionais/[slug]]
3. Filters/Busca: [filtro por unit + especialidade]
4. CtaSection: [primária: "Falar com especialista"]
```

**Checklist**:
- ✅ Cada card é clicável
- ✅ Nenhum agendamento direto aqui (direciona para perfil individual)

### Prof Individual (/profissionais/[slug].astro)
```
1. Hero: [sem CTA]
2. Bio: [texto narrativo]
3. Especialidades: [tags, não clicáveis]
4. FAQ (se houver): [accordion]
5. Agendamento: [CTA primária: "agendar com {prof}"]
6. CtaSection: [primária: whatsapp]
```

**Checklist**:
- ✅ CTA primária = agendamento direto ou whatsapp com pre-filled
- ✅ Instagram do prof (se houver) no card
- ✅ Pricing (se documentado)

### Agendamento (/agendamento.astro)
```
1. Hero: [texto + copy de urgência]
2. Contato: [whatsapp phone + email]
3. Formulário: [form com honeypot + rate-limit + LGPD consent]
4. CtaSection: [motivacional]
```

**Checklist**:
- ✅ Honeypot implementado
- ✅ Rate-limit visual (5s)
- ✅ LGPD consent checkbox
- ✅ Obrigatoriedade de fields
- ✅ Success message após submit

---

## Checklist Final (QA de CTAs)

- ✅ Todos CTAs têm `data-intent` para GTM
- ✅ Links para `/agendamento` funcionam
- ✅ Links para `/profissionais/[slug]` funcionam
- ✅ WhatsApp links pré-preenchidos (opcional: `?text=...`)
- ✅ CTAs responsivos (mobile vs desktop)
- ✅ Cores contrastam (accessibility WCAG AA+)
- ✅ Copy é acionável (não genérico)
- ✅ Nenhuma CTA quebrada (404)
- ✅ Analytics tags disparando corretamente

---

## Próximos Passos

1. **Auditoria de CTAs**: Verificar todas as páginas contra matriz
2. **Otimização de Copy**: "agendar avaliação" vs "marcar consulta" vs "conversar"
3. **A/B Testing**: Testar botão cor, posição, copy em futuro
4. **Tracking**: Implementar funnel no GA4

---

**Status**: 🟢 DOCUMENTAÇÃO COMPLETA
