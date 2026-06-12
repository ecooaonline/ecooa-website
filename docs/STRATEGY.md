# STRATEGY.md — Estratégia de negócio do ecooa-website

> Produzido pelo P01 (2026-06-11). Documento DONO de: objetivo, funil, canais, contas,
> métricas de negócio, Registro de Decisões e Livro de Fatos. Metas técnicas pertencem ao
> P00 ([docs/P00_AUDITORIA.md](./P00_AUDITORIA.md), Parte III citada na seção 9) — este
> documento não as redefine (Lei 13). Aprovador único: Gustavo Gehrke.

## 1. Objetivo principal

**Gerar agendamentos de avaliação para a clínica** via captação de leads WhatsApp-first.

- Ação esperada do visitante: iniciar conversa no WhatsApp (primário) ou enviar o
  formulário de agendamento (secundário verificável).
- Resultado de negócio: agenda dos 30+ profissionais alimentada; meta FATO-12.
- Classificação: **tipo 2 (Agendamento), híbrido justificado com tipo 1 (Captação de
  leads)** — a transação final (consulta) fecha fora do site; o site captura e qualifica
  o lead que vira agendamento. Registrado como **DEC-01**.
- O que o site NÃO deve tentar fazer: venda direta/checkout; agendamento self-service em
  calendário (decisão futura por ROI); comunidade; área logada.
- Fracasso estratégico: tráfego crescendo sem leads; lead perdido sem sinal; dano de
  reputação por claim regulado.
- Sucesso estratégico: FATO-12 (≈100 leads/mês) com qualidade, custo por lead saudável
  quando houver mídia, e funil 100% mensurável com sucesso real.

## 2. Objetivos secundários (priorizados)

| # | Objetivo | Prioridade | Métrica | Página/seção | Risco se ignorado | Prompt |
|---|---|---|---|---|---|---|
| 1 | Direcionar para WhatsApp (canal primário) | crítica | whatsapp_click | todas + FAB | funil seca | P14 |
| 2 | Reduzir fricção de contato | crítica | taxa de conversão | agendamento/contato | leads perdidos | P4/P12 |
| 3 | Fortalecer autoridade (E-E-A-T) | alta | impressões/CTR | profissionais/blog | SERP fraca em YMYL | P10/P12 |
| 4 | Melhorar conversão mobile | alta | conversão mobile | todas | maioria do tráfego | P6/P9 |
| 5 | Qualificar leads (triagem) | alta | uso do match→handoff | /match | leads frios | P4/P14 |
| 6 | Educar público | média | leitura blog→CTA | blog | objeções não tratadas | P12 |
| 7 | Apresentar equipe + registros | alta | clique em profissional | /profissionais | confiança/regulatório | P12 |
| 8 | Criar base para anúncios | média (verba zero hoje) | eventos importáveis | landing/Ads | P14 sem matéria-prima | P14 |
| 9 | Melhorar indexação orgânica local | alta | tráfego local POA | páginas locais/blog | dependência de mídia paga | P10 |
| 10 | Capturar eventos de conversão confiáveis | crítica | form_submit_success real | /obrigado | métricas mentirosas | P14 |

## 3. Público-alvo

**Fatos:** nenhum dado demográfico de campo confirmado (GA4 ainda não consultado).
**Hipóteses** (Livro no [SCOPE.md](./SCOPE.md), HIP-01/02/08): público principal — adultos
28-55, classes A/B, Porto Alegre e região, buscando emagrecimento, equilíbrio hormonal,
estética/capilar e saúde mental de forma integrada; consciência de problema média-alta;
chegada via Google local/Instagram/indicação; dispositivo dominante mobile; tom esperado:
premium, humano e preciso (TONE_OF_VOICE.md). Objeções típicas inferidas do conteúdo:
preço, medo de procedimento/dor, ceticismo com promessas, tempo até resultado. Públicos
secundários: profissionais de saúde (B2B ecooa.med/working) e alunos (mentorias).

## 4. Oferta

**Principal:** avaliação multidisciplinar nos 4 pilares (ecooa.med, .esthetic, .working,
.mind). Benefício central: diagnóstico preciso + cuidado integrado entre especialidades.
Diferencial REAL (provado no repositório): 30+ profissionais com registros publicados,
4 unidades integradas, método proprietário (Gehrke 360°), triagem ecooa.match, 39
avaliações 5★ no Google (FATO-16). Limites: sem promessas absolutas (nicho regulado);
preços não publicados (pendência ACHADO-16). CTA: "falar pelo whatsapp" / "agendar
avaliação". Riscos: regulatório (controlado pós-correções), expectativa (FAQ a reforçar
no P12).
**Secundárias:** B2B (parcerias médicas/nutrição) e mentorias — mantidas como estão;
**DEC-04**: nenhuma oferta nova será criada; foco na principal.

## 5. Conversão principal, funil e definição de lead

**Conversão primária (DEC-02): clique qualificado no WhatsApp** (`whatsapp_click`).
Limite declarado: o clique é intenção mensurável no site; a confirmação da conversa vive
no painel do WhatsApp (fronteira do dono). **Conversão verificável co-primária: formulário
→ /obrigado** — pós-CP-01, o servidor (GAS) só redireciona após gravar o lead; o evento
`form_submit_success` dispara em /obrigado com token de uso único. **Sucesso real ≠
tentativa é requisito inegociável** ([REQUIREMENTS.md](./REQUIREMENTS.md) §3).

**Funil nomeado — "Funil Avaliação ecooa":**

```
atração (orgânico local / GBP / Instagram / direto / Ads futuro)
→ entrada (home, pilar, blog, perfil de profissional, /match)
→ CTA ("falar pelo whatsapp" | "agendar avaliação")
→ ação (clique wa.me | envio do formulário)
→ confirmação REAL (conversa aberta no WhatsApp [painel do dono] | redirect GAS→/obrigado)
→ estado de sucesso (chat ativo | /obrigado?type=…&t=…)
→ evento (whatsapp_click [intenção] | form_submit_success [confirmado])
```

**Definição de LEAD (DEC-03):** contato identificável (nome + canal de resposta) originado
do site — conversa iniciada no WhatsApp ou envio confirmado de formulário — excluindo
testes internos, capturas de honeypot/spam e duplicados em janela de 7 dias. Valor
comercial do lead: **sem dado** (HIP-07; dono define até o P14).

## 6. Conversões secundárias

| Conversão | Prioridade | Medição | Consent? | Gancho P4 / Medição P14 |
|---|---|---|---|---|
| Clique telefone (`phone_click`) | média | GA4 | sim | P14 |
| Clique e-mail | baixa | GA4 | sim | P14 |
| Clique Instagram | baixa | GA4 | sim | P14 |
| Uso do match (`ecooa_match`) | alta | GA4 | sim | P14 (qualifica) |
| Handoff match→agendamento | alta | param URL | sim | P4 (existe) / P14 |
| Newsletter (`newsletter_subscribe`) | média | GA4 | sim | P14; envio otimista aceito (DEC-06) |
| Scroll/engaged time | baixa | GA4 | sim | P14 |
| Visualização /obrigado | alta | GA4 | sim | P14 |
| `form_submit_attempt` vs success | alta | GA4 | sim | P14 (taxa de quebra do funil) |
| Erro de formulário | alta | GA4 | sim | P13 (alerta) / P14 |

## 7. Canais de aquisição

| Canal | Papel | Entrada provável | Conversão esperada | UTM | Risco | Prompt |
|---|---|---|---|---|---|---|
| Busca orgânica local | principal | home/pilares/blog/perfis | WhatsApp | n/a | dependência de SERP | P10 |
| Google Business Profile | principal local | home/contato | WhatsApp/telefone | sim (links) | reviews/posse | P14 |
| Instagram (@somos.ecooa) | aquecimento | home/blog | WhatsApp | sim | medição sem UTM | P14 |
| Direto/indicação | relevante | home | WhatsApp | n/a | — | — |
| Google Ads | futuro (conta existe, verba zero — FATO-11/DEC-08) | landing/pilares | form+WhatsApp | sim | rodar sem conversão importada | P14 |
| Meta Ads | futuro | pilares | WhatsApp | sim | idem | P14 |
| Blog/SEO editorial | suporte | artigos | CTA autor→WhatsApp | n/a | conteúdo sem CTA (já tratado) | P12 |
| Bots/crawlers | excluir da medição | — | — | — | poluição GA4 | P14 |

## 8. Inventário de contas, propriedades e posse (6.9)

Declaração do dono (FATO-08): **nenhuma conta compartilhada com outro negócio**; não há
vizinhos a proteger. "Login" é território do dono (fronteira P00 §7).

| Conta/propriedade | Existe? | Compartilhada? | Recurso DESTE projeto | Quem opera |
|---|---|---|---|---|
| GTM | sim | não | container GTM-TSR4GDMK | dono (IA orienta) |
| GA4 | presumido via GTM | não | propriedade ligada ao container | dono · validar no P14 |
| Meta Pixel/Business | sim | não | pixel 795926643274151 | dono |
| Google Ads | **sim (FATO-11)** | não | conta (ID a informar) | dono · P14 |
| Search Console | não confirmado (HIP-05) | não | propriedade somosecooa.com.br | dono · P10 |
| Google Business Profile | sim (reviews ativos) | não | perfil "ecooa" POA | dono |
| GAS + Sheets + Gmail | sim | não | webapp do formulário, planilha, ecooa.adm | dono |
| Vercel | sim | não | projeto ecooa-website (previews) | dono · destino no P3 |
| GitHub org | sim | não | ecooaonline/ecooa-website | dono+IA |
| Cloudflare | **não existe — pendência do dono (P3)** | — | conta+zona a criar | dono |
| Instagram | sim | não | @somos.ecooa | dono |

## 9. Métricas (quatro camadas)

**Técnicas:** ver **P00, Parte III** ([P00_AUDITORIA.md](./P00_AUDITORIA.md)) — Lighthouse
≥99/100 nas 4 categorias em CAMPO, CLS 0, LCP mobile <1800ms etc. Nenhuma exceção
aprovada até aqui. Este documento não as redefine.

**De negócio** (baseline · alvo · quem mede · onde · frequência):

| Métrica | Baseline | Alvo | Dono da medição | Onde | Freq. |
|---|---|---|---|---|---|
| Leads/mês (DEC-03) | sem dado | ≈100 (FATO-12) | dono + GA4 (P14) | GA4 + WhatsApp + Sheets | semanal |
| whatsapp_click | sem dado | a calibrar pós-baseline | GA4 (P14) | GA4 | semanal |
| form_submit_success (real) | sem dado (evento novo, CP-01) | a calibrar | GA4 (P14) | GA4 | semanal |
| Taxa conversão sessão→lead | sem dado | a calibrar | GA4 | GA4 | mensal |
| Conversão mobile vs desktop | sem dado | mobile ≥ desktop | GA4 | GA4 | mensal |
| Origem dos leads | sem dado | mapa por canal | GA4+UTM | GA4 | mensal |
| Custo por lead | n/a (verba zero, DEC-08) | definir ao ativar Ads | dono | Ads | ao ativar |

**De SEO:** impressões, cliques, CTR, posição, cobertura — baseline **sem dado até
HIP-05 (Search Console) ser confirmada**; dono da medição: P10/P14; frequência mensal.

**De manutenção:** uptime, erros de formulário/JS, vulnerabilidades, regressões
Lighthouse/a11y, falhas de build — donos: P13 (alertas) e P15 (rotina); baseline atual:
0 vulns, CI verde, demais sem dado até observabilidade existir.

## 10. Riscos estratégicos

1. Meta de 100 leads/mês sem baseline nem verba de mídia: risco de expectativa (HIP-03).
2. Mensuração dependente de consentimento: parte do funil sempre será invisível (LGPD).
3. SPOF do GAS no canal secundário (mitigado: fallback WhatsApp + CP-01 tornou falha visível).
4. Migração de plataforma (P3) com cutover DNS: janela de risco operada pelo dono.
5. Nicho regulado: um claim errado custa reputação — gate automatizado pré-declarado.

## 11. Critério de sucesso (negócio)

Funil mensurável de ponta a ponta com sucesso real; ≥ alvo de leads/mês sustentado por
2 meses; nenhum lead perdido sem sinal; metas técnicas do P00 em CAMPO; zero incidentes
regulatórios.

## 12. O que NÃO fazer

Checkout/venda direta · promessas absolutas ou termos proibidos · página nova sem
autorização · urgência artificial · publicar preço sem decisão do dono · campanhas pagas
antes de conversões importáveis · redefinir metas técnicas fora do P00.

## 13. Registro de Decisões

| DEC | Decisão | Motivo | Alternativas rejeitadas | Reversível? | Decidiu | Data |
|---|---|---|---|---|---|---|
| DEC-01 | Objetivo: agendamento de avaliações (híbrido c/ captação de leads) | natureza do negócio + canal confirmado | venda direta; institucional puro | sim | Gustavo+IA | 2026-06-11 |
| DEC-02 | Conversão primária = clique WhatsApp; formulário→/obrigado = verificável co-primária | dono definiu canal primário (P00 0.2); CP-01 garantiu verificabilidade do form | form como primária (mais fricção) | sim | Gustavo | 2026-06-11 |
| DEC-03 | Definição de lead (§5) com exclusões de teste/spam/duplicado 7d | base para métricas honestas | contar cliques brutos | sim | Gustavo+IA | 2026-06-11 |
| DEC-04 | Foco na oferta principal; nenhuma oferta nova | evitar canibalização e dispersão | criar ofertas/landing novas | sim | IA (veto do dono aberto) | 2026-06-11 |
| DEC-05 | Remover aggregateRating do JSON-LD no P10, mantendo marquee visual e link GBP | política Google (self-serving/terceiros); benefício ≈0, risco real; estrelas locais vêm do GBP | manter markup; coletar rating próprio (vai p/ backlog) | sim | avaliação IA aprovada p/ proposta; execução P10 salvo veto | 2026-06-11 |
| DEC-06 | Newsletter permanece com envio otimista (no-cors) | baixo impacto; navegação de página não se justifica | POST nativo também na newsletter | sim | IA+dono (CP-01) | 2026-06-11 |
| DEC-07 | PREFIXO_BRANCH=`claude`; uma branch por fase (`claude/pNN-…`); PR em draft; merge é do dono | alinha com automação existente do repo (workflows em claude/**) | prefixo novo (quebraria automação) | sim | IA | 2026-06-11 |
| DEC-08 | Verba de tráfego pago: zero por enquanto; P14 prepara base sem ativar campanhas | resposta do dono | ativar Ads imediatamente | sim | Gustavo | 2026-06-11 |
| DEC-09 | Prazo: sem data-limite; esteira avança por autorização fase a fase | resposta do dono | prazo fixo 30/60d | sim | Gustavo | 2026-06-11 |
| DEC-10 | PAC-01 aprovado: criar `/termos` (rascunho IA + validação jurídica do dono antes de publicar) | lacuna legal leve | não criar | sim | Gustavo | 2026-06-12 |
| DEC-11 | PAC-02: hub `/faq` REJEITADO; FAQs expandem DENTRO dos pilares | conversão contextual + preserva SEO dos pilares | hub dedicado /faq | sim | Gustavo | 2026-06-12 |
| DEC-12 | PAC-03 adiado: perfis de Eduarda e Tais aguardam material do dono (foto+bio) | sem dados na fonte | criar placeholders | sim | Gustavo | 2026-06-12 |
| DEC-13 | PAC-04 aprovado: linkagem das órfãs (hub+17 especialidades) no P12 | 18 páginas sem PageRank interno | manter órfãs | sim | Gustavo | 2026-06-12 |
| DEC-14 | PAC-05 aprovado: landings de campanha nascem noindex, planejadas no P14 ao ativar verba | medição limpa; não canibalizar orgânico | landings indexáveis | sim | Gustavo | 2026-06-12 |
| DEC-15 | Plataforma oficial: Cloudflare Workers Static Assets + Workers Builds (capacidades verificadas na doc oficial em 2026-06-12) | única que entrega headers/_redirects/Brotli/preview/rollback com a zona já na CF | GH Pages (veto por capacidade), CF Pages (geração anterior), Vercel, Netlify (INFRASTRUCTURE §2) | sim (custo de migração) | Gustavo (alvo) + IA (produto) | 2026-06-12 |
| DEC-16 | Integração Vercel será desativada após o cutover estabilizar | um só pipeline de preview/produção | manter duplo preview | sim | Gustavo | 2026-06-12 |
| DEC-17 | Domínio canônico: https://www.somosecooa.com.br (www); apex redireciona 301 | já é o canônico em produção (CNAME/canonicals/sitemap/OG) | apex como canônico (migraria tudo) | com 301s | Gustavo+IA | 2026-06-12 |

## 14. Livro de Fatos Confirmados

Regra: telefone, endereço, registro, horário, e-mail, preço, credencial e afirmação
factual de marketing SÓ entram em página/schema se estiverem aqui.

| FATO | Valor | Fonte | Data | Onde vive |
|---|---|---|---|---|
| FATO-01 | WhatsApp +55 51 99146-0909 | dono (em produção) | 2026-06-11 | `src/data/constants.ts` (fonte única) |
| FATO-02 | Rua Mariante, 180 · 9º andar · Moinhos de Vento · Porto Alegre/RS · 90430-180 | dono | 2026-06-11 | `constants.ts` |
| FATO-03 | E-mail ecooa.adm@gmail.com | dono | 2026-06-11 | `constants.ts` |
| FATO-04 | Domínio canônico www.somosecooa.com.br | CNAME/produção | 2026-06-11 | `public/CNAME`, astro.config |
| FATO-05 | Horário: seg-sex 9h-20h; sáb a consultar | site/schema | 2026-06-11 | BaseLayout schema + agendamento |
| FATO-06 | GTM-TSR4GDMK · Meta Pixel 795926643274151 | dono/repo | 2026-06-11 | `constants.ts` |
| FATO-07 | Canal de lead primário = WhatsApp | dono (P00 0.2) | 2026-06-11 | STRATEGY §5 |
| FATO-08 | Nenhuma conta compartilhada; nenhum incidente anterior | dono (P00 0.2) | 2026-06-11 | STRATEGY §8 |
| FATO-09 | Aprovador único: Gustavo Gehrke | dono (P00 0.2) | 2026-06-11 | docs (todas as fases) |
| FATO-10 | Hospedagem alvo: Cloudflare Pages/Workers | dono (P00 0.2) | 2026-06-11 | P3 |
| FATO-11 | Conta Google Ads existe | dono | 2026-06-11 | STRATEGY §8 (ID pendente) |
| FATO-12 | Meta comercial ≈100 leads/mês | dono (P01 0.2) | 2026-06-11 | STRATEGY §9 |
| FATO-13 | Prazo: sem data-limite | dono (P01 0.2) | 2026-06-11 | DEC-09 |
| FATO-14 | Verba tráfego pago: zero por enquanto | dono (P01 0.2) | 2026-06-11 | DEC-08 |
| FATO-15 | Registros profissionais publicados (25/30) conforme levantamento institucional; parte pendente de validação em conselho | dono (doc jun/2026) | 2026-06-11 | `professionals.ts` + perfis |
| FATO-16 | 39 avaliações 5★ no Google (texto/iniciais reais) | perfil Google (via dono) | 2026-06-11 | `reviews.ts` (visual) |
| FATO-17 | Responsável técnico: Dr. Gustavo Gehrke, CRM/RS 35.822 | dono/site | 2026-06-11 | Footer |
| FATO-18 | Baseline CAMPO (PSI 2026-05-31, home): 100×4 mobile/desktop | doc do repo | 2026-05-31 | PERFORMANCE_BUDGET.md |
