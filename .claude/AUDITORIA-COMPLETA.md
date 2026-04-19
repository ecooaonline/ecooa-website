# AUDITORIA COMPLETA DO SITE — Relatório de Achados e Plano de Ação

**Data**: 2026-04-19  
**Ferramenta**: OpenAI Codex (revisão de repositório)  
**Escopo**: 14 rotas + arquivos transversais

---

## RESUMO EXECUTIVO

### ✅ Pontos Fortes
- **Arquitetura clara**: Astro com componentes reutilizáveis, data centralizada
- **SEO técnico**: Sitemap, feeds (RSS/JSON), blog com coleção, schema.org
- **Copywriting**: Forte em conversão, CTA repetidos estrategicamente
- **Proposta integrada**: 4 pilares (med, esthetic, mind, working) consistentes
- **Conformidade de privacidade**: Disclaimer no footer, política atualizada

### ⚠️ Pontos Críticos
1. **Documentação**: README é genérico (não documenta setup/deploy/blog)
2. **Conformidade médica**: Claims clínicos sem revisão editorial sistematizada
3. **Hierarquia de CTA**: Múltiplos CTAs sem priorização clara por funil
4. **Segurança**: Endpoints e IDs públicos em constants.ts sem proteção anti-abuso
5. **Navegação**: Páginas longas sem índice/ancoras, perdendo escaneabilidade

---

## PRIORIZAÇÃO (P0, P0.5, P1, P2)

### 🔴 P0 — Crítico (Semana 1)
Impacto: Risco legal, segurança, SEO direto

- [ ] Revisar claims médicos em /ecooa-med vs compliance regulatória
- [ ] Alinhar formulário entre implementação (Apps Script) e política (privacidade)
- [ ] Documentar README operacional (setup, deploy, conteúdo)
- [ ] Fortalecer anti-abuso em formulários (rate-limit, honeypot)

### 🟠 P0.5 — Performance & Dependências (Semana 1)
Impacto: SEO, estabilidade técnica, confiabilidade

- [ ] Audit de performance (Lighthouse) em 5 páginas-chave
- [ ] Mapear vendors críticos e SLA de suporte
- [ ] Documentar decisões técnicas (Node version, deprecated APIs)

### 🟠 P1 — Alto (Semana 2-3)
Impacto: Conversão, UX, SEO estrutural

- [ ] Organizar hierarquia de CTAs por funil (home e quem-somos)
- [ ] Criar páginas de categoria de blog
- [ ] Adicionar navegação interna (índice de âncoras) em páginas longas
- [ ] Padronizar autor do blog por slug, não por regex
- [ ] Substituir heurística de especialidade médica por mapeamento explícito

### 🟡 P2 — Médio (Semana 4+)
Impacto: Retenção, analytics, refinamento

- [ ] Instrumentar eventos de clique (CTA, triagem, formulário)
- [ ] Melhorar página 404 com busca e recuperação
- [ ] Adicionar micro-disclaimers em blocos de prova social
- [ ] Estruturar mentorias com pré-requisitos e certificação
- [ ] Governança contínua de conformidade política vs código

---

## DETALHAMENTO POR PÁGINA

### 1️⃣ / (Home)

**Achado crítico**: Múltiplos CTAs sem hierarquia clara → reduz ação principal

**Ações**:
1. Mapear cada seção da home para UMA ação primária (agendamento, explorar, lead)
2. Remover duplicações visuais de CTA no mesmo bloco
3. Padronizar nomes de evento: `cta_primary_click`, `cta_pillar_click`, `cta_blog_click`
4. Adicionar micro-disclaimers em blocos de depoimentos

**Arquivo**: `src/pages/index.astro`

**Prioridade**: P1

---

### 2️⃣ /quem-somos

**Achado**: Sem CTA secundário após leitura → perda de próxima ação

**Ações**:
1. Adicionar bloco "Próximos Passos" com 3 caminhos em cards:
   - Conhecer profissionais → `/profissionais`
   - Fazer triagem → `/match`
   - Agendar avaliação → `/agendamento`
2. Reaproveitar estilo visual de `CtaSection`

**Arquivo**: `src/pages/quem-somos.astro`

**Prioridade**: P1

---

### 3️⃣ /ecooa-med

**Achado crítico**: Claims terapêuticos sem revisão jurídico-regulatória

**Ações P0** (antes de publicar qualquer novo conteúdo):
1. Levantar todas as frases com promessa de resultado (emagrecimento, hormonal, performance)
2. Classificar em 3 níveis: permitido | sensível | proibido
3. Reescrever claims sensíveis para linguagem de processo e individualização
4. Aplicar checklist em FAQs e depoimentos

**Achado secundário**: Página muito longa, falta escaneabilidade

**Ações P1**:
1. Criar índice fixo/ancorado com links para seções:
   - Áreas de atuação
   - Método
   - Protocolos
   - FAQ
   - Jornada
   - Depoimentos
2. Adicionar IDs semânticos em headings
3. Testar navegação por tecla em mobile

**Arquivo**: `src/pages/ecooa-med.astro`

**Prioridade**: P0 (conformidade) + P1 (UX)

---

### 4️⃣ /ecooa-esthetic

**Achado**: Falta reforço de segurança clínica e critérios de indicação

**Ações**:
1. Inserir seção de segurança antes de procedimentos com:
   - Avaliação individual obrigatória
   - Possíveis contraindicações
   - Expectativa realista e tempo de resultado
2. Vincular para `/politica-de-privacidade` e canal de contato para dúvidas
3. Padronizar visual com página médica para transmitir autoridade

**Arquivo**: `src/pages/ecooa-esthetic.astro`

**Prioridade**: P1

---

### 5️⃣ /ecooa-mind

**Achado crítico**: Promessa "primeira sessão em até 5 dias úteis" pode descasar com capacidade real

**Ações**:
1. Trocar texto estático por condicional: "em até X dias úteis (conforme agenda)"
2. Ou integrar variável de SLA gerenciada em configuração
3. Documentar fonte de verdade do SLA em README
4. Criar alerta de revisão quando capacidade mudar

**Arquivo**: `src/pages/ecooa-mind.astro`

**Prioridade**: P0

---

### 6️⃣ /ecooa-working

**Achado**: Mistura persona B2B (coworking profissional) com paciente → confusão

**Ações**:
1. Revisar copy e CTAs para foco exclusivo em profissionais
2. Remover/relocalizar textos de jornada de paciente para páginas clínicas
3. Criar seção "Para quem é / não é"
4. Ajustar FAQ para temas de estrutura, contrato, comunidade

**Arquivo**: `src/pages/ecooa-working.astro`

**Prioridade**: P1

---

### 7️⃣ /profissionais

**Achado crítico**: Schema e especialidade inferidos por regex → sujeito a erro

**Ações P0**:
1. Adicionar campos explícitos em `src/data/professionals.ts`:
   - `schemaType` (Physician|Person)
   - `medicalSpecialty` (quando aplicável)
2. Remover inferência heurística em `isPhysician()` e `medicalSpecialty()`
3. Validar saída JSON-LD de cada profissional com regras determinísticas

**Arquivo**: `src/pages/profissionais/[slug].astro` + `src/data/professionals.ts`

**Prioridade**: P0

---

### 8️⃣ /match

**Achado**: Triagem semântica sem transparência de privacidade/limites clínicos

**Ações**:
1. Adicionar bloco "Como Funciona" com:
   - Processamento local/navegador
   - Que dados armazenam (nenhum)
   - Que não substitui diagnóstico
2. Link direto para `/politica-de-privacidade`
3. Contatos para casos urgentes

**Arquivo**: `src/pages/match.astro`

**Prioridade**: P1

---

### 9️⃣ /agendamento

**Achado crítico**: Inconsistência entre implementação (Apps Script) e política (menção a Formspree)

**Ações P0**:
1. Comparar `FORM_ACTION` em `src/data/constants.ts` com texto em `src/pages/politica-de-privacidade.astro`
2. Se Apps Script: atualizar política com fornecedor real e finalidade
3. Se Formspree: atualizar constante/código
4. Registrar no README qual serviço é oficial

**Achado secundário**: Sem proteção anti-spam visível

**Ações P0**:
1. Adicionar honeypot no formulário
2. Rate-limit por IP/sessão
3. Validação de telefone/email server-side
4. Mensagem de erro amigável + fallback para WhatsApp

**Arquivo**: `src/pages/agendamento.astro` + componente do form

**Prioridade**: P0

---

### 🔟 /contato

**Achado**: Sem priorização por intenção (paciente vs parceria vs profissional) → ruído operacional

**Ações**:
1. Criar 3 blocos com CTA dedicado:
   - **Pacientes**: WhatsApp agendamento
   - **Parcerias/fornecedores**: e-mail administrativo
   - **Profissionais**: interesse em atuar na ecooa
2. Microcopy de SLA e expectativa de resposta
3. UTMs/parâmetros para rastreamento de origem

**Arquivo**: `src/pages/contato.astro`

**Prioridade**: P2

---

### 1️⃣1️⃣ /mentorias

**Achado**: Oferta sem estrutura de qualificação (pré-requisitos, carga horária, certificação)

**Ações**:
1. Para cada mentoria incluir:
   - Público-alvo
   - Pré-requisitos
   - Formato (online/presencial/híbrido)
   - Duração/carga horária
   - Certificação/resultado esperado
2. CTA específico por trilha com origem rastreável

**Arquivo**: `src/pages/mentorias.astro`

**Prioridade**: P2

---

### 1️⃣2️⃣ /blog e /blog/[slug]

**Achado crítico**: Sem páginas de categoria dedicadas → perda de SEO por cluster

**Ações P1**:
1. Criar rota: `src/pages/blog/categoria/[slug].astro`
2. Usar `getStaticPaths` com categorias em `src/content.config.ts`
3. Cada categoria com intro semântica, lista ordenada por data
4. Links para artigos relacionados
5. Atualizar `src/pages/blog/index.astro` para apontar às categorias

**Achado secundário**: Mapeamento de autor por sobrenome → sujeito a mismatch

**Ações P1**:
1. Adicionar `authorSlug` obrigatório em `src/content.config.ts`
2. Markdowns: preencher `authorSlug` consistente com `src/data/professionals`
3. Em `[slug].astro`: trocar match por sobrenome para lookup direto por slug
4. Validação de build para falhar se `authorSlug` não existir

**Arquivo**: `src/pages/blog/[slug].astro` + `src/content.config.ts` + markdowns

**Prioridade**: P1

---

### 1️⃣3️⃣ /politica-de-privacidade

**Achado crítico**: Coerência 1:1 entre política e implementação real de tracking/formulários/cookies

**Ações P0**:
1. Criar checklist de confronto entre:
   - `src/pages/politica-de-privacidade.astro`
   - `src/components/CookieConsent.astro`
   - `src/data/constants.ts`
   - Scripts de tracking em `BaseLayout.astro`
2. Definir revisão obrigatória a cada mudança de vendor
3. Adicionar campo "vigência" e histórico na política

**Arquivo**: `src/pages/politica-de-privacidade.astro`

**Prioridade**: P0

---

### 1️⃣4️⃣ 404

**Achado**: Sem busca/recuperação contextual → perda de usuário

**Ações**:
1. Adicionar campo de busca interna
2. Links para páginas mais visitadas (agendamento, profissionais, blog)
3. CTA de WhatsApp como fallback
4. Evento 404_view e 404_recovery_click para monitoramento

**Arquivo**: `src/pages/404.astro`

**Prioridade**: P2

---

---

## P0.5: PERFORMANCE & CORE WEB VITALS

### Achado
Auditoria foca em conteúdo/UX, mas site premium carece de validação de performance. Google dá ranking boost a sites rápidos. Astro (estático) é bom, mas há pontos de atrito:
- LCP (Largest Contentful Paint): imagens hero não otimizadas
- CLS (Cumulative Layout Shift): fontes self-hosted podem gerar shifts
- FID/INP: match engine (JS) pode ter lag

### Ações P0.5 (3-4h)

#### 1. Lighthouse Audit (1h)
Rodar Lighthouse em 5 páginas-chave e registrar baseline:

| Página | URL | LCP | FID | CLS | Score |
|--------|-----|-----|-----|-----|-------|
| Home | / | TBD | TBD | TBD | TBD |
| ecooa.med | /ecooa-med | TBD | TBD | TBD | TBD |
| Profissional | /profissionais/gustavo-gehrke | TBD | TBD | TBD | TBD |
| Match | /match | TBD | TBD | TBD | TBD |
| Blog | /blog | TBD | TBD | TBD | TBD |

Ferramentas:
- PageSpeed Insights (online, real user data)
- Lighthouse CLI local: `npm run audit` (criar script)

#### 2. Identificar Top 3 Quick Wins (1-2h)

Padrão comum em sites Astro:
1. **Image optimization**: Converter JPG/PNG para AVIF, webp com fallback
2. **Font preload**: `<link rel="preload" as="font">` para serif/sans
3. **Script lazy-load**: Adiar GTM/analytics até user interaction

#### 3. Documentar Baseline & Target (30m)

```markdown
## Performance Targets (2026-05-19)

**Current Baseline** (rodar Lighthouse T+0):
- Home: LCP 2.5s, FID 150ms, CLS 0.1
- ecooa-med: LCP 3.2s, ...
- ...

**Target (Q2 2026)**:
- Todas as páginas: LCP <2.5s, FID <100ms, CLS <0.1
- Audit repetido a cada 2 semanas

**Responsável**: Dev (tech lead)
**Ferramenta**: Lighthouse + WebPageTest
```

**Prioridade**: P0.5 — Executar em paralelo com P0 (não bloqueia)

---

## P0.6: CONFORMIDADE MÉDICA ESTRUTURADA

### Achado
P0 pede "revisar claims médicos", mas não detalha:
- Quais afirmações estão realmente expostas (por página)
- Qual padrão regulatório aplicável (CFM, ANVISA, Conselho Regional, Lei de Publicidade Médica)
- Como documenta aprovação (quem, quando, assinatura)

Risco: Não é só compliance de texto; pode ser processo clínico. Clínica premium não pode afirmar resultado sem base.

### Ações P0.6 (4-6h)

#### 1. Levantar Claims Expostos (1.5h)

Por página, listar todas as afirmações sobre resultado/eficácia:

**Exemplo — /ecooa-med:**
```
- "emagrecimento saudável" → permitido (descreve escopo, não promete resultado)
- "metabolismo funcional, não restrição calórica" → revisar (é claim diferencial, precisa base)
- "ganho de peso sem causa óbvia" → permitido (descreve queixa do paciente)
- "TSH no limite alto — Hashimoto" → ⚠️ REVISAR (diagnóstico é ato médico)
- "perda de 8kg sustentável, energia normalizada" → ⚠️ PROIBIDO (promessa de resultado específico)
```

**Exemplo — /ecooa-esthetic:**
```
- "tratamentos capilares avançados" → permitido
- "queda capilar e doenças do couro cabeludo" → permitido (descreve especialidade)
- "devolve autoestima" → ⚠️ REVISAR (promessa de benefício psíquico sem base)
```

#### 2. Classificar por Nível de Risco (1h)

Matriz simples:

```
VERDE (Permitido, publicar como está)
- Descrição de especialidade
- Descrição de queixa do paciente
- Descrição de abordagem

AMARELO (Revisar, pode precisar disclaimer)
- Diferencial clínico que implica resultado
- Casos de sucesso anônimos
- Depoimentos de pacientes

VERMELHO (Proibido, remover ou reescrever)
- Promessa de cura ("elimina síndrome metabólica")
- Diagnóstico feito pela clínica (só médico diagnóstica)
- Resultado quantificado sem base ("perda garantida de 10kg")
```

#### 3. Template de Aprovação Médica (1h)

Criar documento que médico/jurídico assina:

```markdown
# APROVAÇÃO DE CLAIMS MÉDICOS

**Página/Seção**: /ecooa-med - Método Gehrke 360°

**Claim Original**: "emagrecimento é resultado de metabolismo funcional, não de restrição calórica"

**Classificação**: AMARELO (diferencial clínico)

**Versão Aprovada**: "Nossa abordagem investiga causas metabólicas de ganho de peso (hormônios, inflamação, sono) em vez de restringir calorias como primeira linha"

**Disclaimer Recomendado**: "Resultados variam conforme avaliação individual"

**Aprovado por**: Dr. Gustavo Gehrke (Médico) + Jessica Fernandes (Jurídico)

**Data**: 2026-04-19

**Próxima Revisão**: 2026-07-19 (3 meses)

**Vigência**: 2026-04-19 até revogação ou atualização de protocolo
```

#### 4. Matriz de Conformidade por Página (1.5h)

```markdown
## Conformidade Médica — Matriz de Páginas

| Página | Total Claims | Verde | Amarelo | Vermelho | Status | Aprovador | Data |
|--------|-------------|-------|---------|----------|--------|-----------|------|
| /ecooa-med | 12 | 8 | 3 | 1 | ⚠️ REVISAR | Dr. Gustavo | TBD |
| /ecooa-esthetic | 8 | 6 | 2 | 0 | ✅ OK | Dra. Danusa | TBD |
| /ecooa-mind | 5 | 5 | 0 | 0 | ✅ OK | Manuela | TBD |
| /ecooa-working | 3 | 3 | 0 | 0 | ✅ OK | - | TBD |
| /blog (30 artigos) | ~60 | ~45 | ~12 | ~3 | ⚠️ REVISAR | Dr. Gustavo | TBD |
| /profissionais (30) | ~120 | ~100 | ~18 | ~2 | ⚠️ REVISAR | Por prof. | TBD |

**Status Geral**: 🔴 BLOQUEADO — não publicar até revisão

**Responsável**: Gustavo (médico) + Jessica (jurídico)
```

#### 5. Protocolo de Atualização (30m)

Documento que governa quando revisar:

```markdown
## Protocolo de Revisão Continuada de Claims

**Trigger de Revisão**:
- [ ] Mudança de protocolo clínico em qualquer pilar
- [ ] Novo estudo que contradiz claim existente
- [ ] Reclamação de paciente/órgão regulador sobre copy
- [ ] Troca de pessoa responsável por seção (médico, nutricionista)
- [ ] Semestral: revisão proativa (junho, dezembro)

**Processo**:
1. Médico/profissional sinaliza necessidade de atualização
2. Jurídico + médico reunião de 30m de revisão
3. Reescrever claims afetados
4. Novo documento de aprovação
5. Dev atualiza site
6. Registrar em changelog de conformidade

**SLA**: 5 dias úteis da sinalização até publicação

**Arquivo de Registro**: `docs/conformidade-medica.log`
```

**Prioridade**: P0.6 — Executar em paralelo com P0

**Responsáveis**: Jurídico (Jessica) + Médico (Gustavo) + Dev (implementação)

---

## P0.5 BONUS: DEPENDÊNCIAS & RENOVAÇÕES

### Achado
Projeto usa varios vendors externos (Formspree vs Apps Script, Vercel, GTM, etc), mas sem governança de:
- Versões suportadas (Node >=22.12.0 — por quê?)
- SLA de suporte de cada vendor
- Data da última revisão de contrato/preço
- Deprecações conhecidas que podem quebrar site

Risco: Renovação de certificado, mudança de pricing, descontinuação de SDK sem aviso.

### Ações P0.5 Bonus (1-2h)

#### 1. Matriz de Vendors Críticos

Criar tabela em `docs/vendors-e-renovacoes.md`:

```markdown
## Vendors Críticos — Matriz de Suporte

| Vendor | Uso | Versão | Tipo | SLA | Próxima Revisão | Responsável |
|--------|-----|--------|------|-----|-----------------|-------------|
| Vercel | Deploy | - | PaaS | 99.9% | 2026-07-19 | Tech Lead |
| Google Forms | Intake | v2 | SaaS | Best effort | 2026-05-19 | Product |
| Google Apps Script | Agendamento form | v1 | Serverless | Best effort | 2026-05-19 | Dev |
| Formspree | Contato (?) | v3 | API | 99% | 2026-06-19 | Dev |
| GTM | Tracking | v2 | Container | Próprio | 2026-05-19 | Analytics |
| Astro | Framework | 6.x | npm | LTS até 2027 | 2026-05-19 | Tech Lead |
| Node.js | Runtime | >=22.12.0 | npm | LTS até 2026-10 | 2026-05-19 | Tech Lead |

**Status**: 🟡 REVISAR — Qual é a fonte de verdade de cada vendor?
```

#### 2. Decisões Técnicas Documentadas

Para cada decisão "por quê", criar entry em README:

```markdown
## Decisões Técnicas & Justificativas

### Node >=22.12.0
**Por quê**: [resposta aqui — features necessárias, breaking changes em <22.12, etc]
**Alternativa considerada**: [...]
**Data da decisão**: 2026-04-19
**Responsável**: [...]
**Próxima revisão**: 2026-10-19

### Apps Script para agendamento (vs Formspree)
**Por quê**: Integração direta com Google Sheets para relatórios
**Trade-off**: Menos features de anti-spam (mitigado por rate-limit frontend)
**Data da decisão**: 2026-XX-XX
**Responsável**: [...]
**Próxima revisão**: 2026-07-19

### Astro 6 vs Next.js / Hugo
**Por quê**: [...]
**Quando migrar se necessário**: [...]
```

#### 3. Log de Renovações

Arquivo `docs/renovacoes.log` com histórico:

```
2026-04-19: Node >=22.12.0 revisado, atualizar em Q3 2026
2026-04-19: Vercel contract até 2027-04-19
2026-04-15: Google Forms API revisada, sem breaking changes conhecidas
2026-03-01: GTM atualizado para container v2
```

**Prioridade**: P0.5 Bonus — 1-2h, evita surpresas futuras

**Responsável**: Tech Lead

---

**Issue**: `src/data/constants.ts` expõe endpoints públicos sem governança de abuso

**Ações**:
1. Separar dados públicos necessários (telefone, endereço) de sensíveis (endpoints, IDs)
2. Mover o sensível para camada server/proxy quando possível
3. Aplicar rate-limit e monitoramento de tráfego suspeito no backend receptor

**Prioridade**: P0

---

### 📖 Documentação

**Issue**: README é template genérico Astro, não documenta projeto real

**Ações**:
1. Substituir README.md com:
   - Visão do projeto
   - Setup local (Node >=22.12.0, why?)
   - Fluxo de conteúdo do blog (como criar post)
   - Deploy e rollback (Vercel)
   - Checklist de SEO/compliance antes de publicar
   - Matriz de responsáveis (médico, jurídico, conteúdo)

**Prioridade**: P0

---

### 📊 Analytics & Eventos

**Issue**: Sem instrumentação de eventos para conversão e retenção

**Ações P2**:
1. Padronizar nomes de evento:
   - `cta_primary_click` (agendamento)
   - `cta_pillar_click` (conhecer pilar)
   - `form_submit` (agendamento/contato)
   - `404_recovery_click`
   - `match_complete`
2. Integrar via GTM existente
3. Dashboard de conversão por página

**Prioridade**: P2

---

### ♿ Acessibilidade & UX

**Issue**: Sem auditoria completa de contraste, foco, navegação por teclado

**Ações P2**:
1. Executar auditoria WCAG 2.1 AA em páginas internas
2. Teste de navegação por teclado em mobile
3. Revisar texto alternativo em imagens (especialmente de profissionais)

**Prioridade**: P2

---

## MATRIZ DE IMPLEMENTAÇÃO

| Tarefa | Arquivo(s) | P | T (horas) | Responsável |
|--------|-----------|---|-----------|-------------|
| **P0 — CRÍTICO (Semana 1)** | | | | |
| Revisar claims médicos | ecooa-med.astro, FAQs | P0 | 4 | Jurídico/Médico |
| Alinhar formulário vs política | constants.ts, politica-de-privacidade.astro | P0 | 2 | Ops/Dev |
| README operacional | README.md | P0 | 3 | Tech Lead |
| Anti-abuso em formulário | agendamento.astro, backend | P0 | 4 | Dev |
| **P0.5 — Performance & Dependências (Semana 1, paralelo)** | | | | |
| Lighthouse audit (5 páginas) | — | P0.5 | 1 | Tech Lead |
| Identificar quick wins | — | P0.5 | 2 | Tech Lead/Dev |
| Matriz de vendors | docs/vendors-e-renovacoes.md | P0.5 | 1 | Tech Lead |
| **P0.6 — Conformidade Médica (Semana 1, paralelo)** | | | | |
| Levantar claims por página | — | P0.6 | 1.5 | Médico |
| Classificar por risco | — | P0.6 | 1 | Jurídico/Médico |
| Template de aprovação | docs/aprovacao-medica.md | P0.6 | 1 | Jurídico |
| Matriz de conformidade | docs/conformidade-medica.md | P0.6 | 1 | Médico |
| **P1 — Alto (Semana 2-3)** | | | | |
| Hierarquia de CTAs | index.astro, quem-somos.astro | P1 | 3 | Product/Dev |
| Páginas de categoria | blog/categoria/[slug].astro | P1 | 4 | Dev |
| Índice de âncoras | ecooa-med.astro | P1 | 2 | Dev |
| Autor por slug | content.config.ts, [slug].astro, markdowns | P1 | 3 | Dev/Editorial |
| Especialidade explícita | professionals.ts, [slug].astro | P1 | 2 | Dev |
| Match: transparência | match.astro | P1 | 1 | Product/Dev |
| **P2 — Médio (Semana 4+)** | | | | |
| Instrumentation | GTM setup | P2 | 2 | Analytics/Dev |
| Página 404 | 404.astro | P2 | 2 | Dev |
| Mentorias: critérios | mentorias.astro | P2 | 2 | Product |
| Contato: routing | contato.astro | P2 | 2 | Dev |

**Total estimado**: 
- P0: 13 horas (semana 1)
- P0.5: 4 horas (paralelo, semana 1)
- P0.6: 4.5 horas (paralelo, semana 1)
- P1: 15 horas (semana 2-3)
- P2: 8 horas (semana 4+)

**Total geral**: ~45 horas (1.5 sprints com paralelização possível)

---

## CHECKLIST PRÉ-DEPLOY

- [ ] Claims médicos revistos e aprovados por jurídico/médico
- [ ] Formulário alinhado com política de privacidade
- [ ] Anti-spam implementado
- [ ] README atualizado
- [ ] Hierarquia de CTAs validada
- [ ] Páginas de categoria de blog criadas
- [ ] Âncoras/índices adicionados em páginas longas
- [ ] Especialidades de profissional explícitas no schema
- [ ] Autores do blog linkados por slug
- [ ] Transparência de privacidade no match

---

## PRÓXIMAS AÇÕES

1. **Hoje**: Você aprova priorização e matriz
2. **Dia 2**: Iniciar P0 (conformidade jurídica + documentação)
3. **Semana 1**: Entregar P0
4. **Semana 2-3**: Entregar P1
5. **Semana 4+**: Refinar P2 + analytics

---

**Relatório preparado por**: OpenAI Codex + análise manual  
**Data**: 2026-04-19  
**Próxima revisão**: 2026-05-19 (após P0 + P1)
