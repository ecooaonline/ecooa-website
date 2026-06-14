# CONVERSION_GOVERNANCE — Governança da conversão crítica

> Fase: P04 (MYTHOS). Data: 2026-06-14. Lei que preside: 5 (Silêncio dos Leads),
> 18 (Contrato de Resposta), 19 (Medição por Fora).
> Documento dono do fluxo crítico. Eventos: ver `EVENTS_TRACKING_PLAN.md`.
> Endpoints e contratos: ver `INTEGRATIONS.md`. Dados/LGPD: ver `DATA_GOVERNANCE.md`.

## 1. Conversão principal (referência ao funil do P01)

Conversão primária definida no `STRATEGY.md` (DEC do P01): **envio de formulário de
agendamento/contato** com confirmação real do servidor. Canal secundário: WhatsApp.

Funil nomeado:

```
atração → página (/, /ecooa-med, /ecooa-esthetic, /ecooa-mind, /ecooa-working, /match)
        → CTA "agendar avaliação"
        → /agendamento (ou /contato)
        → preenchimento + consentimento
        → POST nativo ao Google Apps Script (GAS)
        → GAS valida, grava o lead e responde com redirect 302 para /obrigado
        → /obrigado (confirmação REAL do servidor)
        → evento form_submit_success (token anti-duplicação)
```

Regra de ouro (Lei 5): o evento que conta é **`form_submit_success` em `/obrigado`**,
nunca o clique de envio. A tentativa (`form_submit_attempt`) é evento separado.

## 2. Inventário de formulários

| Form | Página | _formType | Tipo | Campos obrigatórios | Consentimento | Handler |
|---|---|---|---|---|---|---|
| Agendamento | `src/pages/agendamento.astro` | `agendamento` | Conversão | name, whatsapp, interest, consent | sim (checkbox) | `bindConversionForm` |
| Contato | `src/pages/contato.astro` | `contato` | Conversão | nome, email, mensagem, consent | sim (checkbox) | `bindConversionForm` |
| B2B Medicina | `src/pages/ecooa-med.astro` | `b2b-medicina` | Conversão | nome, whatsapp, email | — (B2B) | `bindConversionForm` |
| B2B Nutrição | `src/pages/ecooa-working.astro` | `b2b-nutricao` | Conversão | nome, area, whatsapp | — (B2B) | `bindConversionForm` |
| Newsletter (×N) | Footer, blog index/post/categoria | `newsletter` | Captura | email | — | `bindNewsletterForm` |
| Match | `src/pages/match.astro` | — | UI client-side | — (sem POST) | `match-engine.ts` |

Evidência: lista `CONVERSION_FORMS` em `src/scripts/form-submit.ts:21`; roteamento em
`initFormSubmit` (`form-submit.ts:167-182`).

Classificação:
- Conversão (4 forms): **funcionais e verificáveis pelo servidor** (POST nativo + redirect).
- Newsletter: **funcional com risco aceito** (no-cors otimista — ver §6).
- Match: não coleta dado; redireciona para `/agendamento?profissional=&intent=`.

## 3. Estados de UI (por formulário de conversão)

| Estado | Mecanismo | Evidência |
|---|---|---|
| Loading | botão `disabled` + texto "enviando..." | `form-submit.ts:91-95` |
| Sucesso | navegação para `/obrigado` (server-confirmed) | `form-submit.ts:79-86`, `obrigado.astro` |
| Erro de rede/servidor | o GAS não redireciona → usuário permanece; fallback de contato visível na página | `data-error-text` (contato/agendamento) + CTAs WhatsApp na página |
| Spam (bot) | sucesso aparente inline, sem entregar lead | `isSpamSubmission` + `showInlineSuccess` (`form-submit.ts:58-71`) |

Newsletter tem estado próprio (sucesso/erro inline), sem redirect — `form-submit.ts:126-165`.

## 4. CTAs e canais secundários

Todos os CTAs de contato consomem a **Fonte Única** (`src/data/constants.ts`):
`WA_BASE`/`WA_DEFAULT` (WhatsApp), `PHONE`/`PHONE_E164`/`PHONE_INTL` (telefone),
`EMAIL` (e-mail ofuscado), `INSTAGRAM`. FAB do WhatsApp: `WhatsAppFab.astro` (`WA_DEFAULT`).

Prova de não-duplicação (P04 Parte IV): `grep` por `99146-0909`/`991460909` em `src/`
retorna **apenas** `data/constants.ts`. Consolidado em 2026-06-14 (8 hardcodes eliminados:
agendamento, contato, Footer, index FAQ, llms.txt, BaseLayout schema).

## 5. Página de obrigado (os pontos verificados)

`src/pages/obrigado.astro`:
- Alcançada **somente** por redirect do GAS após gravação (não por clique).
- `robots="noindex, follow"` (`obrigado.astro:23`).
- **Fora do sitemap**: o filtro em `astro.config` exclui páginas noindex (`astro.config:16-18`).
- Token `t` (timestamp) + guarda em `sessionStorage` (`ecooa_conv_{token}`) → conversão
  dispara **uma única vez** (anti-duplicação).
- Dispara `form_submit_success` (dataLayer) + `Lead` (Meta Pixel), **apenas** se
  consentimento aceito; força carga de analytics via `ecooa_force_analytics`.
- Oferece próximo passo + WhatsApp; não promete prazo não confirmado pelo dono.

## 6. Risco aceito: newsletter no-cors (DEC)

A newsletter usa `fetch(..., { mode: 'no-cors' })` (`form-submit.ts:109-114`): o POST é
entregue mas a resposta volta opaca (o GAS não envia `Access-Control-Allow-Origin`).
Feedback é otimista (inline). **Risco aceito e documentado** (Lei 5 admite padrão próprio
para captura secundária de baixo impacto): inscrição de newsletter não justifica navegação
de página. Conversões críticas **não** usam no-cors — usam submit nativo verificável.

## 7. Fallbacks (cenários cobertos)

| Cenário | Fallback atual |
|---|---|
| Form de conversão falha (GAS não redireciona) | usuário permanece na página; CTAs de WhatsApp/telefone/e-mail visíveis; `data-error-text` com `${PHONE}` |
| Newsletter falha | mensagem de erro inline + botão reabilitado (`form-submit.ts:146-158`); evento `form_submit_error` |
| JS desativado | POST nativo dos forms de conversão **ainda funciona** (HTML `action`/`method`); newsletter degrada (depende de JS) |
| Bot/spam | sucesso aparente sem entrega |

## 8. Como testar (Protocolo de Teste de Conversão — Parte V do P04)

Para cada fluxo crítico:
1. **Happy path marcado**: enviar com nome "TESTE 2026-06-14"; confirmar redirect a `/obrigado`.
2. **Confirmação de chegada**: **o DONO confirma** que o lead chegou ao destino
   (`DESTINO_LEADS`) — a IA não acessa o destino (Lei da Fronteira). Registrar print/data.
3. **Erro**: simular falha do GAS → sem redirect de sucesso; fallback visível.
4. **Anti-spam**: honeypot preenchido / envio < 2s → sem lead real.
5. **Mobile e desktop**: estados loading/sucesso/erro.
6. **Registro**: anotar data/executor em `INTEGRATIONS.md`.

### Estado do Protocolo (2026-06-14)

**PENDENTE — depende do dono (HIP-09 / PROM).** O teste E2E em produção com confirmação
de chegada do lead ainda não foi executado pelo dono. Itens 1, 3, 4, 5 são verificáveis em
preview pela IA; o item 2 (chegada real) é território do dono. Registrado no Dossiê de
Pendências (`SCOPE.md` / `PENDENCIAS_FINAIS.md` no P13). **Regra de ferro**: qualquer
mudança futura no fluxo re-executa este protocolo.

## 9. Critérios de sucesso

- Conversão principal funcionando e testada de ponta a ponta (pendente item 2 do dono).
- `form_submit_success` disparando só em sucesso real; tentativa/erro separados.
- Zero falso sucesso; zero perda invisível de lead.
- Fonte Única sem duplicação (provado).
