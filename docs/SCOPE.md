# SCOPE.md — Escopo do ecooa-website

> Produzido pelo P01 (2026-06-11). Documento DONO de: escopo incluído/excluído,
> classificações funcionais e de conteúdo, critérios de pronto, Livro de Hipóteses e
> pendências. Estratégia: [STRATEGY.md](./STRATEGY.md). Requisitos:
> [REQUIREMENTS.md](./REQUIREMENTS.md). Auditoria: [P00_AUDITORIA.md](./P00_AUDITORIA.md).

## 1. Escopo incluído (esteira P2-P15)

Site estático Astro de captação/agendamento WhatsApp-first: 4 pilares, 30+ perfis de
profissionais com registros, blog editorial (34 artigos), match de triagem, formulários
verificáveis (CP-01), PWA/offline, migração de entrega para Cloudflare (P3), segurança
por headers (P7), testes E2E+axe (P8), observabilidade (P13), base de aquisição/medição
(P14), rotina pós-meta (P15) — preservando integralmente o mapa do P00 §6.

## 2. Escopo excluído (com motivo)

| Item | Motivo |
|---|---|
| Venda direta/checkout | fora do modelo de negócio (DEC-01) |
| Agendamento self-service em calendário | exige integração/agenda real; avaliar por ROI pós-meta |
| Área logada/portal do paciente | sem demanda definida; custo alto |
| Internacionalização | público local POA (pt-BR) |
| Redesign visual | identidade preservada por doutrina |
| Novas ofertas/landing sem autorização | DEC-04 |
| Automação de WhatsApp (bot) | exige plataforma externa + decisão do dono |

## 3. Funcionalidades (classificação 6.13 — 25 itens)

| # | Funcionalidade | Classificação |
|---|---|---|
| 1 | Formulário (agendamento/contato/B2B) | essencial agora · verificável (CP-01 ✓) |
| 2 | WhatsApp (CTAs+FAB) | essencial agora (canal primário) |
| 3 | Telefone | importante agora |
| 4 | E-mail (ofuscado) | importante agora |
| 5 | Página de agendamento | essencial agora |
| 6 | Blog | importante agora |
| 7 | Busca on-site | não recomendada agora (match cobre) · pós-meta |
| 8 | Match (triagem) | essencial agora |
| 9 | FAQ por pilar | importante agora · expansão no P12 |
| 10 | Página de obrigado | essencial agora (âncora de conversão) |
| 11 | PWA (manifest/ícones) | importante agora (existe) |
| 12 | Service worker/offline | importante agora (existe, v3) |
| 13 | Analytics (GTM/GA4) | essencial agora · consent-gated |
| 14 | Eventos de conversão | essencial agora · matriz fecha no P14 |
| 15 | Consentimento (banner) | essencial agora (existe) |
| 16 | CRM | futuro por ROI · exige dado externo |
| 17 | Webhook (content-notify) | importante agora (existe) |
| 18 | Planilha (Sheets via GAS) | essencial agora (destino do lead) |
| 19 | API própria | não aplicável agora · exige backend/edge (P3 abre porta) |
| 20 | Área logada | não recomendada |
| 21 | Dashboard | pós-meta |
| 22 | Internacionalização | não recomendada |
| 23 | Search estático | pós-meta |
| 24 | Pesquisa semântica (embeddings) | pós-meta (payload pronto em scripts/) |
| 25 | Automação WhatsApp | futuro por ROI · exige autorização + dado externo |

## 4. Conteúdo (classificação 6.14 — 25 tipos)

| # | Conteúdo | Classificação |
|---|---|---|
| 1 | Home | manter |
| 2 | Sobre (quem-somos) | manter · corrigir (Rafaela → fonte única, P4/P5) |
| 3 | Serviços (4 pilares) | manter · expandir FAQs (P12) |
| 4 | Profissionais (listagem+perfis) | manter · expandir (CRNs pendentes, Eduarda/Tais → fonte) |
| 5 | Blog (hub+categorias) | manter |
| 6 | Artigos (34) | manter · disclaimer topo em médicos (P12) |
| 7 | Contato | manter |
| 8 | Agendamento | manter |
| 9 | Obrigado | manter (noindex) |
| 10 | 404 | manter |
| 11 | FAQs | corrigir/expandir (objeções reais, P12) |
| 12 | Política de privacidade | manter |
| 13 | Termos de uso | ausente · avaliar necessidade no P2 (pendência) |
| 14 | Cookies (aviso) | manter (banner+política); granularidade avaliada no P7 |
| 15 | Reviews (marquee) | manter · schema corrige no P10 (DEC-05) |
| 16 | Depoimentos | = reviews (somente reais, FATO-16) |
| 17 | Cases clínicos | inexistente · pós-meta (trava regulatória) |
| 18 | Guias/materiais ricos | pós-meta |
| 19 | Landing pages de campanha | futuras (ao ativar Ads, P14) |
| 20 | Páginas locais (POA) | manter (já otimizadas nos títulos/conteúdo) |
| 21 | Páginas de campanha sazonal | futuras |
| 22 | Conteúdo institucional | manter |
| 23 | Conteúdo técnico (docs/) | consolidar (espelhos, P5/P13) |
| 24 | Conteúdo editorial (mentorias) | manter |
| 25 | llms.txt/RSS/feed | manter |

## 5. Integrações

**Essenciais:** GAS (lead) · GTM/GA4 · Meta Pixel · wa.me · Sheets/Gmail.
**Em transição:** GitHub Pages → Cloudflare (P3); Vercel previews (destino decidido no P3).
**Futuras:** Google Ads (conversões importadas, P14) · Turnstile (P4/P7) · error tracking
(P13) · CAPI Meta (backlog).

## 6. Dependências humanas (responsável · prazo)

| Pendência | Responsável | Prazo |
|---|---|---|
| Permissão Actions criar PRs | Gustavo | antes do P8 (idealmente já) |
| Teste E2E do formulário em produção (HIP-09) | Gustavo | antes do P2 |
| PSI 6 URLs (novo baseline CAMPO) | Gustavo | antes do P6 |
| Conta Cloudflare + cutover DNS | Gustavo | P3 |
| Search Console (HIP-05): print/confirm | Gustavo | P10 |
| ID conta Google Ads | Gustavo | P14 |
| CRNs Gabrieli/Giancarla/Lara/Marvin · dados Adriana · fotos/bios Eduarda+Tais · decisão Rafaela | Gustavo | P4/P12 |
| Valor comercial do lead (HIP-07) | Gustavo | P14 |

## 7. Critérios de pronto (6.16)

**Técnicos:** build sem erro · metas P00/III em CAMPO ou teto aceito formal · sem
regressão mobile/desktop · zero crítico a11y · zero crítico segurança · SEO desbloqueado ·
**zero formulário com falso sucesso (CP-01 ✓, manter)** · sem link crítico quebrado ·
CI verde e bloqueante.
**De negócio:** conversão principal testada ponta a ponta (pendente HIP-09) · secundárias
funcionando · eventos definidos (P14) · páginas estratégicas presentes · jornada/oferta/
CTAs claros · prova de confiança suficiente · gate regulatório ativo (P8/P12) · próximo
passo claro ao visitante.
**Operacionais:** deploy+rollback documentados (existem; P3 atualiza) · observabilidade
ativa (P13) · manutenção/SLA (P15) · AI handoff fiel (P13) · backlog pós-meta definido
(P00 §18) · métricas de aquisição com dono (STRATEGY §9) · pendências humanas com
responsável (§6) · critério de reabertura técnica (P15).

## 8. Livro de Hipóteses

| HIP | Hipótese | Base | Risco se errada | Valida | Prompt | Status |
|---|---|---|---|---|---|---|
| HIP-01 | Público principal: adultos 28-55 A/B, POA+região, saúde integrada/estética/emagrecimento | inferido das páginas/ofertas | copy e personas desalinhadas | dono + GA4 | P12 | aberta |
| HIP-02 | Mobile é o dispositivo dominante (>70%) | padrão do setor + design mobile-first | priorização errada de esforço | GA4 | P14 | aberta |
| HIP-03 | Meta de ≈100 leads/mês é atingível com orgânico+GBP (verba zero) | sem baseline | frustração de meta / pressão por mídia | GA4 + dono | P14 | aberta |
| HIP-04 | GAS publicado == `google-apps-script.js` do repo (redirect `_next` ativo) | código no repo | CP-01 sem efeito em produção (cai no JSON) | teste E2E do dono | P4 | aberta |
| HIP-05 | Search Console existe e está verificado | prática comum | SEO sem telemetria | dono (print) | P10 | aberta |
| HIP-06 | Previews Vercel são noindex por padrão | comportamento da plataforma | conteúdo duplicado indexado | dono (1 verificação) | P10 | aberta |
| HIP-07 | Valor comercial médio do lead (ticket) | sem dado | impossível calcular ROI/ROAS | dono | P14 | aberta |
| HIP-08 | Instagram é canal relevante de chegada | bio/link e uso da marca | esforço de social mal dimensionado | GA4+UTM | P14 | aberta |
| HIP-09 | Funil do formulário pós-CP-01 funciona em produção de ponta a ponta | implementação + código GAS | conversão secundária quebrada sem sinal | dono (teste real) | P2 (gate de entrada) | **aberta — risco interino formalmente ACEITO pelo dono em 2026-06-12 no gate do P02; novo prazo: antes do P4 (que mexe no funil)** |
| HIP-10 | Termos de busca prováveis por página (keywords da Matriz §5) refletem demanda real | inferência editorial, sem dado de GSC | priorização de conteúdo/SEO desalinhada | GSC/dados de campo | P10/P14 | aberta |

Regra (Lei 12): hipótese aberta no prompt validador BLOQUEIA a decisão dependente.

## 9. Pendências de documentação interna

CLAUDE.md:12 ("Formspree") e :29 ("30 profissionais") — correção autorizada para a
primeira fase com fence sobre arquivos de raiz (P5); verdade registrada no
REQUIREMENTS §12 até lá.
