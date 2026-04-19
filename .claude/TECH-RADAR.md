# 🎯 TECH-RADAR — Sistema de Detecção de Tecnologias

**Última atualização**: 2026-04-19  
**Próxima revisão**: 2026-05-17 (mensal)

---

## 📡 MÉTODO DE DETECÇÃO (ZERO OVERHEAD)

### Frequência
- **Semanal** (1 min): Verificar breaking changes em 3 pacotes críticos
- **Mensal** (5 min): Análise consolidada de tendências
- **Anual** (30 min): Revisão arquitetural completa

### Categoria 1: Stack Crítico (Semana)
Scan automático de CVE, breaking changes, major updates:

| Pacote | Versão Atual | Critério Alerta | Check |
|--------|--------------|-----------------|-------|
| Astro | 6.x | Major upgrade (7.0) ou CVE crítico | npm outdated, GitHub releases |
| TypeScript | 5.x | Major upgrade (6.0) ou TS 5.4+ | TypeScript releases |
| Google Apps Script | API | Deprecação de APIs | Google Cloud deprecation tracker |

### Categoria 2: Stack Secundário (Mensal)
Tendências em ecossistema TypeScript/SSG:

**Monitorar**:
- Alternativas a Astro (Remix, SvelteKit, Fresh, Qwik)
- Forma de detecção: CSS-in-JS vs Astro native CSS (existe melhor solução?)
- SSR vs Static (ecooa é static mas adia a necessidade)

**Critério de adoção**:
- Reduz tempo de build >10%
- Melhora SEO ou Core Web Vitals >5%
- Reduz bundle size >15%
- Zero breaking changes com stack atual

### Categoria 3: Conformidade & Médica (Trimestral)
Regulamentações, padrões de acessibilidade:

**Monitorar**:
- WCAG 3.0 (atualmente 2.1 AA)
- Schema.org novas types (MedicalWebPage v2)
- CFM novas diretrizes de publicidade
- LGPD updates (Lei n. 13.709)

**Critério de adoção**:
- Impacto direto em compliance (SIM = adotar)
- Impacto em SEO (>3% CTR = considerar)
- Impacto em UX (<2% overhead = adotar)

### Categoria 4: Analytics & Conversão (Mensal)
Tendências em marketing tech:

**Monitorar**:
- GA4 updates (já usando, acompanhar deprecações)
- Alternatives: Plausible, Fathom, Posthog (comparar privacy vs dados)
- Evento tracking patterns (funnel, cohorts, attribution)

**Critério de adoção**:
- Reduz custo infra >20%
- Melhora tracking acurácia >10%
- Compliance 100% (LGPD, CCPA)

---

## ✅ CHECKLIST SEMANAL (1 min)

```
SEGUNDA (início de sprint):
[ ] npm outdated | grep critical?
[ ] GitHub releases: astro, typescript?
[ ] Google Cloud deprecations?
→ Se SIM em qualquer item: adicionar em TECH-RADAR-LOG.md

SEMANAL (Thursday):
[ ] Astro docs changelog (https://docs.astro.build/)
[ ] TypeScript releases (https://www.typescriptlang.org/docs/handbook/release-notes/)
→ Se major update: avaliar impact
```

---

## 📋 CHECKLIST MENSAL (5 min)

```
DIA 15 DE CADA MÊS:
[ ] Revisar TECH-RADAR-LOG de últimas 4 semanas
[ ] Categoria 2 (alternativas SSG): existem novas?
[ ] Categoria 4 (analytics): Google Analytics mudou?
[ ] Consolidar insights → seção INSIGHTS MENSAIS abaixo
[ ] Atualizar próxima data de revisão
```

---

## 📊 INSIGHTS MENSAIS

### 2026-04-19 (Inicial)

**Categoria 1: Stack Crítico**
- ✅ Astro 6.4.0 (latest stable, sem CVEs)
- ✅ TypeScript 5.4.2 (latest, sem breaking changes planejado até 5.5)
- ✅ Google Apps Script: API estável (último update: Mar 2026)

**Categoria 2: SSG Alternativas**
- Remix: Melhor SSR, pior DX para static
- SvelteKit: Menor bundle, menor comunidade
- Fresh (Deno): Experimental, não production-ready
- Qwik: Promise para performance, ecosystem imaturo
- **Recomendação**: Astro continua melhor para ecooa (static + SEO)

**Categoria 3: Conformidade**
- WCAG 2.1 AA: Current compliance OK
- Schema.org MedicalWebPage: Já implementado (P4-P5)
- CFM: Sem novas diretrizes desde implementation
- LGPD: Lei estável (verificar anualmente)

**Categoria 4: Analytics**
- GA4: Mantém paridade com UA, sem surpresas
- Plausible: Opção mais privacy-friendly, cost ~$29/mês (ecooa: <1K/mês hits, Plausible seria overkill)
- **Recomendação**: GA4 continua adequado

---

## 🔴 ALERTAS CRÍTICOS (Escala de Severidade)

| Nível | Ação | Exemplo |
|-------|------|---------|
| 🔴 **CRITICAL** | Emergência. Patchear em 24h. | CVE em Astro, LGPD enforcement action |
| 🟠 **HIGH** | Sprint próxima. Evaluate impact. | Major update Astro (6→7), CFM guideline change |
| 🟡 **MEDIUM** | Backlog. Monitor. | TypeScript minor, alternativa SSG com mérito |
| 🟢 **LOW** | Nice-to-have. Documenta. | New GA4 feature, WCAG 3.0 draft |

---

## 🛠 TECH-STACK ATUAL (Referência)

```
Produção:
├── Astro 6.x (static build)
├── TypeScript 5.x (strict mode)
├── CSS (self-hosted, zero JS libraries)
├── Google Apps Script (form backend)
├── Google Sheets (data storage)
└── Vercel (CDN + deploys)

Analytics:
├── Google Tag Manager (GTM-TSR4GDMK)
└── Google Analytics 4 (events)

Compliance:
├── LGPD (Brazilian GDPR)
├── CFM (medical advertising)
└── Schema.org (SEO markup)

Segurança:
├── Honeypot (anti-spam)
├── Rate-limit (client + server)
└── HTTPS + CSP headers
```

---

## 📅 PRÓXIMAS REVISÕES AGENDADAS

| Data | Tipo | Checklist | Owner |
|------|------|-----------|-------|
| 2026-04-25 | Semanal (CVE) | npm outdated | Anyone |
| 2026-05-17 | Mensal (Insights) | 5 min checklist | Claude + Jessica |
| 2026-08-19 | Trimestral (Compliance) | WCAG, CFM, LGPD | Gustavo + Jessica |
| 2026-04-19 | Anual (Arquitetura) | Full review | Team sync |

---

## 📝 COMO USAR ESTE DOCUMENTO

1. **Toda segunda-feira**: 1 min scan semanal (critical alerts only)
2. **Dia 15 de cada mês**: 5 min scan mensal (consolidate trends)
3. **Trimestralmente**: Review compliance changes
4. **Anualmente**: Full architectural review

**Se encontrar algo relevante**:
- Adicionar em `TECH-RADAR-LOG.md` (append-only log)
- Classificar por nível (🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW)
- Se 🔴 ou 🟠: avisar Jessica + Gustavo imediatamente
- Se 🟡 ou 🟢: aguardar revisão mensal consolidada

---

**Status**: 🟢 Sistema operacional. Zero overhead. Próxima revisão: 2026-04-25 (semanal CVE check).

