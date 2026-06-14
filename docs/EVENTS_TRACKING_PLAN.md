# EVENTS_TRACKING_PLAN — Matriz de eventos

> Fase: P04 (MYTHOS). Data: 2026-06-14. Define os eventos; a implementação completa de
> medição (consent, trigger de conversão no GTM) pertence ao P14. Lei: 5 (sucesso real ≠
> tentativa), 19 (medição por fora).
> Fluxo: ver `CONVERSION_GOVERNANCE.md`. Endpoints: ver `INTEGRATIONS.md`.

## 1. Matriz de eventos (estado real do código)

Legenda do tipo: **C** = conversão · **T** = tentativa · **E** = erro · **M** = microconversão.

| Evento | Tipo | Gatilho | Onde dispara | Camada | Consent? |
|---|---|---|---|---|---|
| `form_submit_attempt` | T | submit de form de conversão | `form-submit.ts:89` | dataLayer | gated |
| `form_submit_success` | **C** | chegada em `/obrigado` (server redirect) | `obrigado.astro` | dataLayer + Pixel `Lead` | gated |
| `form_submit_error` | E | falha no fetch da newsletter | `form-submit.ts:159-162` | gtag | gated |
| `newsletter_subscribe` | M | newsletter ok | `form-submit.ts:143` | dataLayer + Pixel `Subscribe` | gated |
| `agendar_avaliacao` | T | clique em link `/agendamento` | `analytics-events.ts:44-48` | gtag | gated |
| `whatsapp_click` | M | clique em `wa.me` | `analytics-events.ts:54-59` | gtag + Pixel `Contact` | gated |
| `phone_click` | M | clique em `tel:` | `analytics-events.ts:101-105` | gtag | gated |
| `contact_click` | M | clique em `/contato` | `analytics-events.ts:84-88` | gtag | gated |
| `instagram_click` | M | clique em `instagram.com` | `analytics-events.ts:65-69` | gtag | gated |
| `professional_view` | M | abertura de card de profissional | `analytics-events.ts:75-79` | gtag | gated |
| `outbound_click` | M | clique externo | `analytics-events.ts:92-97` | gtag | gated |
| `campaign_landing` | M | UTM presente no load | `analytics-events.ts:138-143` | gtag | gated |
| `scroll_depth` | M | 25/50/75/100% | `analytics-events.ts:162-166` | gtag | gated |
| `engaged_time` | M | 30/60/120/300s ativos | `analytics-events.ts:189-195` | gtag | gated |
| `funnel_*` | M | visita a passo do funil | `analytics-events.ts:213-218` | gtag | gated |

"gated" = só dispara quando `gtag`/GTM/Pixel estão carregados, e eles só carregam após
consentimento (interação) ou na `/obrigado` com consentimento aceito.

## 2. Regra de conversão (Lei 5 + 19)

- **Conversão = `form_submit_success`** (sucesso real em `/obrigado`), nunca o clique.
- Tentativa (`form_submit_attempt`) e erro (`form_submit_error`) são **eventos separados**.
- Implementação **por fora** (Lei 19): a instrumentação observa estados (navegação,
  cliques via delegação em `analytics-events.ts`) sem acoplar tracking à lógica de envio
  do formulário. O `form-submit.ts` só empurra `form_submit_attempt` no dataLayer.

## 3. Parâmetros — permitidos × proibidos (allowlist)

**Permitidos:** `form_type`, `transaction_id`, `value`, `currency`, `event_category`,
`event_label` (pathname/handle/nome de profissional), `page_location`, `button_text`,
`professional_specialty`, `utm_*`.

**PROIBIDOS (PII):** nome, e-mail, telefone, mensagem livre, dados de saúde, endereço.
Verificação (P04 Parte IX): nenhum evento envia campo de PII. `event_label` em
`whatsapp_click`/`professional_view` usa **nome de profissional** (dado público da equipe),
não dado do visitante.

## 4. Pendências (PROM → P14)

- **PROM-P04-EV1:** criar no GTM o **trigger/tag de conversão** ligado ao evento de dataLayer
  `form_submit_success` (a página já empurra o evento; falta a tag no painel GTM). Mecanismo:
  trigger de evento personalizado `form_submit_success` → tag de conversão GA4/Ads. Devida a:
  **P14** (e ação de painel do dono). Esta matriz é o anexo.
- **PROM-P04-EV2:** Pixel/Ads `Lead` server-side (CAPI) e Enhanced Conversions = decisão de
  privacidade futura (P14), não implementada.

## 5. Eventos proibidos (não criar)

- Conversão na tentativa ou no clique de envio.
- Qualquer evento com PII nos parâmetros.
