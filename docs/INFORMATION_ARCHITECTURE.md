# INFORMATION_ARCHITECTURE.md — Arquitetura de informação do ecooa-website

> Produzido pelo P02 (2026-06-12). Documento DONO de: princípios de arquitetura,
> hierarquia, intenções, clusters, **Matriz de Páginas** (fonte única) e **Contrato de
> Páginas**. [SITEMAP_PLAN.md](./SITEMAP_PLAN.md) e [ROUTE_MAP.md](./ROUTE_MAP.md)
> DERIVAM deste documento. Objetivo do site: ver [STRATEGY.md](./STRATEGY.md) §1
> (não copiado — Lei 13). Histórico de alterações de linha: rodapé.

## 1. Visão geral

Arquitetura existente é **sólida e quase completa**: hub-and-spoke com a home
distribuindo para 4 pilares de serviço, dois hubs de entidade (profissionais, blog),
uma ferramenta de triagem (match) e duas páginas de conversão (agendamento, contato).
Nenhuma rota precisa mudar (Lei 14 plenamente satisfeita). O único defeito estrutural
real é o **cluster de especialidades órfão** (18 páginas sem links internos de entrada).

## 2. Princípios de arquitetura

1. Rota indexada é compromisso: zero mudanças de slug nesta esteira.
2. Toda página indexável precisa de ≥1 link interno de entrada (órfã = incidente).
3. Intenção única por página; sobreposições se resolvem com links, não com fusão.
4. Conversão a ≤1 clique de qualquer ponto (WhatsApp FAB global + CTA contextual).
5. Páginas nascem dos dados (`professionals.ts`, content collection, `specialties.ts`);
   página manual fora das fontes é exceção justificada.
6. Sem SEO de fachada: página nova só com conteúdo real e dono nomeado.

## 3. Hierarquia proposta (= atual, com 1 correção de linkagem)

```
/ (home)
├── pilares: /ecooa-med · /ecooa-esthetic · /ecooa-mind · /ecooa-working
│   └── /especialidade/[17] ← receber links dos pilares e perfis (correção)
│       └── hub /especialidades ← receber link de navegação contextual
├── /profissionais → /profissionais/[30]
├── /blog → /blog/[34] · /blog/categoria/[5]
├── conversão: /match · /agendamento · /contato → /obrigado (utilitária)
├── institucional: /quem-somos · /mentorias · /politica-de-privacidade
└── técnicas: /offline · /404 · 3 redirects legados
```

## 4. Matriz de Páginas (fonte única)

**Convenção declarada:** páginas geradas por template têm UMA linha-grupo cuja coluna
"fonte de dados" enumera canonicamente cada página (a lista de slugs vive na fonte, não
é copiada aqui). Colunas: ver legenda abaixo da tabela.

| # | Página | Rota | Tipo | Status | Existir | Index | Sitemap | Link int. | Intenção | Função comercial | CTA 1º | CTA 2º | Fonte de dados | Schema | Risco | Prio | Dono | Decisão |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Home | `/` | hub | ok | sim | sim | sim | todos | navegacional/local | encaminhar conversão | whatsapp | agendamento | constants/reviews/blog | MedicalBusiness+FAQ | baixo | P0 | P11/P12 | manter |
| 2 | ecooa.med | `/ecooa-med` | serviço/pilar | ok | sim | sim | sim | nav/home/footer | comercial | gerar whatsapp_click | whatsapp | form B2B | página+blog(medicina) | FAQPage+MedicalProcedure | baixo | P0 | P12 | manter; expandir FAQ |
| 3 | ecooa.esthetic | `/ecooa-esthetic` | serviço/pilar | ok | sim | sim | sim | nav/home/footer | comercial | whatsapp_click | whatsapp | match | página | FAQPage | baixo | P0 | P12 | manter; expandir FAQ |
| 4 | ecooa.mind | `/ecooa-mind` | serviço/pilar | ok | sim | sim | sim | nav/home/footer | comercial | whatsapp_click | whatsapp | match | página | FAQPage | baixo | P0 | P12 | manter; +disclaimer dedicado |
| 5 | ecooa.working | `/ecooa-working` | serviço/pilar | ok | sim | sim | sim | nav/home/footer | comercial | whatsapp_click | form B2B | whatsapp | página | FAQPage | baixo | P0 | P12 | manter; +disclaimer dedicado |
| 6 | Hub profissionais | `/profissionais` | listagem | ok | sim | sim | sim | nav/home/footer | comercial/autoridade | apresentar equipe→whatsapp | perfil/modal | whatsapp | professionals.ts | MedicalOrganization | baixo | P0 | — | manter |
| 7 | Perfis (×30) | `/profissionais/[slug]` | detalhe | ok | sim | sim | sim | hub/match/blog/related | comercial/autoridade | whatsapp_click | whatsapp | form c/ handoff | **professionals.ts** (canônica) | Physician/Person | baixo | P0 | P12 | manter; linkar especialidades |
| 8 | Hub blog | `/blog` | hub editorial | ok | sim | sim | sim | nav/home/footer | informacional | educar→conversão | artigo | newsletter | content collection | Blog | baixo | P1 | — | manter |
| 9 | Artigos (×34) | `/blog/[slug]` | editorial | ok | sim | sim | sim | hub/categorias/related/pilares | informacional/educacional | educar→whatsapp autor | CTA autor | newsletter | **src/content/blog** (canônica) | Article/MedicalWebPage | baixo | P1 | P12 | manter; disclaimer topo |
| 10 | Categorias (×5) | `/blog/categoria/[cat]` | taxonomia | ok | sim | sim | sim | hub/artigos | informacional | navegação editorial | artigo | newsletter | enum content.config (gera só com artigo; `ecooa` hoje vazio) | CollectionPage | baixo | P2 | — | manter |
| 11 | Hub especialidades | `/especialidades` | listagem | **órfã** | sim | sim | sim | **nenhum** | informacional/comercial | navegação de oferta | especialidade | whatsapp | specialties.ts | — | **alto (órfã)** | P1 | P12 | receber links (ver §9) |
| 12 | Especialidades (×17) | `/especialidade/[slug]` | detalhe oferta | **semi-órfãs** | sim | sim | sim | só hub órfão+entre si | comercial/informacional | qualificar→whatsapp | whatsapp | perfil | **specialties.ts** (canônica) | MedicalWebPage | **alto (sem PageRank interno)** | P1 | P12 | receber links de pilares/perfis |
| 13 | Match | `/match` | ferramenta | ok | sim | sim | sim | nav/home/pilares | transacional | qualificar lead | resultado→whatsapp | form handoff | match-intents+professionals | WebSite/SearchAction(home) | baixo | P0 | P14 | manter |
| 14 | Agendamento | `/agendamento` | conversão | ok | sim | sim | sim | nav global/CTAs | transacional | captar lead (form verificável) | enviar form | whatsapp | constants(FORM_ACTION) | — | baixo (pós-CP-01) | P0 | P4/P14 | manter |
| 15 | Contato | `/contato` | conversão | ok | sim | sim | sim | nav/footer | transacional/local | captar contato | enviar form | whatsapp/mapa | constants | — | baixo | P0 | P4 | manter |
| 16 | Quem somos | `/quem-somos` | institucional | ok | sim | sim | sim | nav/footer | institucional | confiança | agendamento | equipe | página (+Rafaela fora da fonte) | AboutPage(implícito) | médio (dado fora da fonte) | P1 | P4/P5 | manter; Rafaela→fonte |
| 17 | Mentorias | `/mentorias` | institucional/oferta 2ª | ok | sim | sim | sim | nav/footer | comercial 2ª | captar interesse | whatsapp | — | página | — | baixo | P2 | P12 | manter |
| 18 | Privacidade | `/politica-de-privacidade` | legal | ok | sim | sim | sim | footer/banner/forms | institucional | LGPD/confiança | — | contato | página | — | baixo | P1 | P7 | manter |
| 19 | Obrigado | `/obrigado` | conversão (sucesso) | ok | sim | **não** | **não** | só via sucesso real | — | confirmar conversão+próx. passo | whatsapp | instagram/blog | query params+profMap | — | baixo | P0 | P4/P14 | manter (regras §10) |
| 20 | Offline | `/offline` | técnica | ok | sim | **não** | **não** | SW only | — | resiliência | home | — | standalone | — | baixo | P3 | P6 | manter |
| 21 | 404 | `/404` | técnica | ok | sim | **não** | n/a | automático | — | resgatar navegação | home | categorias | página | — | baixo | P2 | — | manter |
| 22 | Redirects legados (×3) | `/especialidade/nutrição-*` | técnica | ok | sim (até decair) | **não** | **não** | nenhum (by design) | — | preservar links externos antigos | — | — | astro.config redirects | — | baixo | P3 | P10 | manter; reavaliar remoção pós-GSC |
| 23 | Endpoints (rss/feed/llms) | `/rss.xml` `/feed.json` `/llms.txt` | feeds | ok | sim | n/a | não | head links | — | distribuição/IA | — | — | content collection | — | baixo | P3 | — | manter |

Legenda: Status=estado atual · Existir=deve existir agora · Prio: P0 conversão-crítica,
P1 SEO/autoridade, P2 suporte, P3 técnica · Dono=prompt responsável por mudanças.

## 5. Tipos de página e intenção (resumo por tipo)

hub navegacional (1,6,8,11) · pilar comercial (2-5) · detalhe de entidade (7,12) ·
editorial informacional (9,10) · ferramenta transacional (13) · conversão (14,15,19) ·
institucional/legal (16,17,18) · técnica (20-23). Termos de busca prováveis por página:
**HIP-10** (sem dado de GSC; validador P10/P14) — nenhum palpite de keyword é tratado
como fato.

## 6. Função comercial e eventos futuros (nomes desde já; implementação P4/P14)

`whatsapp_click` (todas) · `form_submit_attempt`/`form_submit_success` (14,15,B2B em 2,5)
· `ecooa_match` (13) · `newsletter_subscribe` (8,9) · `professional_view` (6,7) ·
`phone_click`/e-mail (15, footer). Risco se página falhar: 14/15 = lead perdido (visível
pós-CP-01); 13 = qualificação perdida; 2-5 = topo do funil.

## 7. Links internos estruturais (propostos, NÃO implementados — execução P12)

| Link | Classe |
|---|---|
| Pilares → especialidades relacionadas da unidade | **essencial** (corrige órfãs) |
| Perfis → especialidades do profissional | **essencial** |
| Hub /especialidades ← footer (coluna serviços) ou home (seção pilares) | **essencial** |
| Especialidade → artigos do tema | recomendado |
| Artigos → especialidade relacionada (além do perfil do autor) | recomendado |
| Categorias ↔ pilares correspondentes | recomendado |
| Obrigado → blog/instagram (existe) | manter |
| 404 → categorias (existe) | manter |
| Home → hub especialidades | opcional (avaliar densidade) |

## 8. Clusters editoriais (34 artigos, 5 categorias ativas)

| Cluster | Artigos | Pilar/página âncora | Estado | Ação (P12) |
|---|---|---|---|---|
| Capilar (queda, transplante, teste genético, pós) | 8 | ecooa-esthetic + /especialidade/capilar | forte | encadear links internos; capilar como pilar-página |
| Metabolismo/emagrecimento/hormônios | 8 | ecooa-med + especialidades correlatas | forte | linkar especialidades |
| Saúde mental | 6 | ecooa-mind | bom | FAQ objeções |
| Nutrição (clínica/esportiva/vegetariana) | 7 | ecooa-working | bom | linkar especialidades |
| Estética facial | 4 | ecooa-esthetic | bom | — |
| Longevidade | 1 | /especialidade/longevidade | **fraco (1 artigo)** | expandir pós-meta ou re-categorizar |
| ecooa (institucional) | 0 | — | vazio (página não gera) | conteúdo institucional pós-meta |

Canibalização avaliada: artigos do cluster capilar têm intenções distintas
(causas=informacional · tratamento=comercial · transplante-POA=local · pós=retenção) —
**manter separados com links em cadeia**. `/especialidade/*` × pilares: intenções
complementares (específica × hub) — manter + links cruzados. Nenhuma consolidação
necessária.

## 9. Órfãs e tratamento

| Página | Situação | Destino designado |
|---|---|---|
| `/especialidades` | órfã total (0 links de entrada) | receber link de footer/home (§7) — P12 |
| `/especialidade/*` ×17 | semi-órfãs (só hub órfão + irmãs) | links de pilares e perfis (§7) — P12 |
| `/offline` | órfã por design (SW) | manter técnica, noindex ✓ |
| Redirects ×3 | sem links by design | manter até GSC confirmar decaimento — P10 |

## 10. Regras de arquitetura de conversão (Lei 5, registradas)

1. `/obrigado`: noindex ✓, fora do sitemap ✓, alcançável só por sucesso real do servidor ✓
   (CP-01; token `t` impede falso disparo em visita direta).
2. Estado de erro de envio: visível com fallback WhatsApp na mesma tela ✓.
3. Toda página de conversão tem evento futuro nomeado (§6); implementação P4/P14.

## 11. Contrato de Páginas

```
CONTRATO DE PÁGINAS v1 (2026-06-12) — dono: P02; gate futuro: P8
Indexáveis e no sitemap: 100
  14 estáticas (linhas 1-6, 8, 11, 13-18) + 30 perfis + 34 artigos
  + 5 categorias + 17 especialidades
Utilitárias (noindex e/ou fora do sitemap): 6
  /obrigado · /offline · /404 · 3 redirects legados (nutrição-*)
Futuras já autorizadas: 0
  (candidatas no Pacote de Decisões: PAC-01 /termos, PAC-03 perfis Eduarda/Tais,
   PAC-05 landings Ads — autorização PENDENTE)
Endpoints não-página: rss.xml, feed.json, llms.txt, sitemap-index/-0.xml
Regra: página no build sem linha na Matriz = incidente (Lei 15).
```

## 12. Riscos

ALTO: cluster especialidades órfão (18 páginas sem autoridade interna). MÉDIO: dado de
pessoa fora da fonte (linha 16; já rastreado ACHADO-07/P00). BAIXO: categoria
`longevidade` rasa (1 artigo); categoria `ecooa` vazia (não gera página — comportamento
correto, registrado).

## 13. Decisões pendentes

Ver **Pacote de Decisões** no relatório do P02 (PAC-01 a PAC-05); aprovados viram DEC-NN
no [STRATEGY.md](./STRATEGY.md) §13.

---
Histórico: v1 2026-06-12 criada pelo P02 (base: build 103 páginas, sitemap 100, diff
triplo limpo).
