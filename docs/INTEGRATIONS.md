# INTEGRATIONS — Endpoints, Contratos de Resposta e posse

> Fase: P04 (MYTHOS). Data: 2026-06-14. Lei que preside: 18 (Contrato de Resposta).
> Fluxo crítico: ver `CONVERSION_GOVERNANCE.md`. Eventos: ver `EVENTS_TRACKING_PLAN.md`.

## 1. Integrações existentes

| Integração | Papel | Onde vive (identificador) | Posse / dono operacional |
|---|---|---|---|
| Google Apps Script (GAS) | Backend dos formulários (grava lead, redireciona) | `FORM_ACTION` em `constants.ts:23-25` (env `FORM_ACTION`, fallback público) | DONO (conta Google) |
| Google Tag Manager | Container de tags/analytics | `GTM_ID` em `constants.ts:19` (`GTM-TSR4GDMK`) | DONO (conta GTM) |
| Meta Pixel | Conversões Meta Ads | `META_PIXEL_ID` em `constants.ts:28` | DONO (Meta Business) |
| Google Analytics 4 | Mensuração (via GTM) | dentro do GTM | DONO |

Nenhum segredo no repositório: `FORM_ACTION`, `GTM_ID`, `META_PIXEL_ID` são identificadores
**públicos** (aparecem no HTML servido por natureza). Sobrescrevíveis por env. Ver
`DATA_GOVERNANCE.md` §segredos.

## 2. CONTRATO DE RESPOSTA — Google Apps Script (formulários de conversão)

```
### Contrato: FORM_ACTION (Google Apps Script /exec)
Cliente: POST nativo do <form> (NÃO fetch). Campos: dados do form + _formType +
  _next (URL de /obrigado) + _honeypot + _loadedAt.
Sucesso: o GAS valida (host do _next em allowlist, honeypot, campos), grava o lead e
  responde com REDIRECT HTTP 302 para o _next (/obrigado?type=...&t=...).
  → Chegar em /obrigado é a confirmação REAL e verificável do servidor.
Erros: se a validação falha, o GAS NÃO redireciona para /obrigado. O usuário permanece
  na página de origem; os CTAs de WhatsApp/telefone/e-mail são o fallback humano.
Timeout do cliente: navegação nativa (sem AbortController nos forms de conversão).
Sob falha do endpoint: NUNCA há falso sucesso — sem redirect, sem /obrigado, sem evento
  de conversão. Esta é a garantia central da Lei 5.
```

**Auditoria do cliente contra o contrato (linha a linha):**
- Lê resposta real? **Sim, por construção**: o sucesso é a navegação que só o servidor
  emite. Não há `mode:'no-cors'` nem sucesso por timeout nos forms de conversão
  (`form-submit.ts:66-99`).
- Redireciona antes de confirmar? **Não**: o `_next` é o destino que o *GAS* aciona após
  gravar; o cliente apenas o preenche (`form-submit.ts:79-86`).
- Dispara conversão antes do sucesso? **Não**: `form_submit_attempt` na tentativa
  (`form-submit.ts:89`); `form_submit_success` só em `/obrigado`.

**Fronteira (Lei 6):** o código-fonte do GAS vive na conta Google do DONO, fora do
repositório. O comportamento server-side acima (allowlist do `_next`, dedup, gravação) é o
**contrato esperado**; a confirmação de que o GAS o cumpre na íntegra (e que o lead chega ao
destino) é responsabilidade do dono — ver Protocolo de Teste (CONVERSION_GOVERNANCE §8).

## 3. CONTRATO DE RESPOSTA — Newsletter (captura secundária)

```
### Contrato: FORM_ACTION (newsletter)
Cliente: fetch POST, mode: 'no-cors' (resposta OPACA por design — GAS sem CORS).
Sucesso: assumido otimista após o fetch resolver sem exceção (form-submit.ts:141-145).
Erros: exceção de rede/timeout (15s, 2 retries) → mensagem inline + form_submit_error.
Risco: sucesso não é verificável pelo servidor. ACEITO (DEC) por ser captura de baixo
  impacto que não justifica navegação de página. Conversões críticas NÃO usam este padrão.
```

## 4. CORS / no-cors

- Conversão: **sem CORS** — usa submit nativo (não precisa ler corpo via JS). Correto.
- Newsletter: `no-cors` (opaca), risco aceito acima.
- Técnica de referência (se um dia a newsletter precisar de resposta verificável): POST com
  `Content-Type: text/plain` ao GAS evita preflight e permite ler a resposta. Não
  implementado (não necessário hoje).

## 5. Rate-limit (saída formal — DEC)

**Ausência deliberada (DEC-P04-RL).** Não há rate-limit no cliente além do anti-spam
(honeypot + trava de tempo `MIN_FILL_MS=2000`, `form-submit.ts:58-64`). Justificativa: volume
de leads esperado (~100/mês, P01) não justifica rate-limit; camadas leves bastam. Qualquer
rate-limit real teria de viver no GAS (server-side), território do dono.
**Gatilho de reavaliação:** primeiro incidente de spam relevante, ou > ~50 envios/dia.

## 6. Anti-spam (camadas presentes)

| Camada | Mecanismo | Evidência |
|---|---|---|
| Honeypot | campo `_honeypot` oculto; preenchido = bot | `form-submit.ts:59-60` |
| Trava de tempo | `_loadedAt`; envio < 2000ms = bot | `form-submit.ts:61-62`, `:173-174` |
| Validação server-side | no GAS (dono) | contrato §2 |

Proporcional ao risco (Lei do P04): sem captcha pesado, sem prejuízo de acessibilidade.

## 7. Registro de testes

| Fluxo | Última execução E2E | Resultado | Quem |
|---|---|---|---|
| agendamento | — (pendente produção) | — | dono (HIP-09) |
| contato | — | — | dono |
| b2b-medicina | — | — | dono |
| b2b-nutricao | — | — | dono |
| newsletter | — | — | dono |

Atualizar quando o dono executar o Protocolo (CONVERSION_GOVERNANCE §8).
