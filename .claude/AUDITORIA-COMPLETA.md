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

## PRIORIZAÇÃO (P0, P1, P2)

### 🔴 P0 — Crítico (Semana 1)
Impacto: Risco legal, segurança, SEO direto

- [ ] Revisar claims médicos em /ecooa-med vs compliance regulatória
- [ ] Alinhar formulário entre implementação (Apps Script) e política (privacidade)
- [ ] Documentar README operacional (setup, deploy, conteúdo)
- [ ] Fortalecer anti-abuso em formulários (rate-limit, honeypot)

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

## ACHADOS TRANSVERSAIS (Site Inteiro)

### ⚠️ Segurança & Privacidade

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
| Revisar claims médicos | ecooa-med.astro, FAQs | P0 | 4 | Jurídico/Médico |
| Alinhar formulário vs política | constants.ts, politica-de-privacidade.astro | P0 | 2 | Ops/Dev |
| README operacional | README.md | P0 | 3 | Tech Lead |
| Anti-abuso em formulário | agendamento.astro, backend | P0 | 4 | Dev |
| Hierarquia de CTAs | index.astro, quem-somos.astro | P1 | 3 | Product/Dev |
| Páginas de categoria | blog/categoria/[slug].astro | P1 | 4 | Dev |
| Índice de âncoras | ecooa-med.astro | P1 | 2 | Dev |
| Autor por slug | content.config.ts, [slug].astro, markdowns | P1 | 3 | Dev/Editorial |
| Especialidade explícita | professionals.ts, [slug].astro | P1 | 2 | Dev |
| Match: transparência | match.astro | P1 | 1 | Product/Dev |
| Instrumentation | GTM setup | P2 | 2 | Analytics/Dev |
| Página 404 | 404.astro | P2 | 2 | Dev |
| Mentorias: critérios | mentorias.astro | P2 | 2 | Product |
| Contato: routing | contato.astro | P2 | 2 | Dev |

**Total estimado**: ~40 horas (1 sprint de desenvolvimento)

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
