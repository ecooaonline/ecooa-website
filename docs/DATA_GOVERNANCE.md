# DATA_GOVERNANCE — Dados pessoais, consentimento e LGPD técnica

> Fase: P04 (MYTHOS). Data: 2026-06-14. Lei: 6 (Fronteira), 5 (Silêncio dos Leads).
> A validade JURÍDICA dos textos legais não nasce de IA — é pendência nomeada do dono.

## 1. Dados coletados por formulário

| Form | Dados pessoais coletados | Finalidade | Para onde vai |
|---|---|---|---|
| Agendamento | nome, WhatsApp, interesse | contato p/ agendar avaliação | GAS → destino do dono |
| Contato | nome, e-mail, mensagem | responder solicitação | GAS → destino do dono |
| B2B Medicina | nome, WhatsApp, e-mail | contato comercial B2B | GAS → destino do dono |
| B2B Nutrição | nome, área, WhatsApp | contato comercial B2B | GAS → destino do dono |
| Newsletter | e-mail | envio de conteúdo | GAS → destino do dono |

Campos técnicos não-pessoais: `_formType`, `_source`, `_honeypot`, `_loadedAt`, `_next`,
`matchProfessional`, `matchIntent`.

## 2. Princípios aplicados

- **Minimização:** coleta-se só o necessário ao contato. Nenhum dado sensível de saúde é
  pedido nos formulários (o "interesse"/"área" são categorias amplas, não diagnóstico).
- **Sem PII em analytics:** nenhum evento envia nome/e-mail/telefone/mensagem
  (ver `EVENTS_TRACKING_PLAN.md` §3). Verificado por grep (P04 Parte IX).
- **Sem PII em URL:** o `/obrigado` recebe `type`, `t`, `profissional` (slug público) —
  nunca dado do visitante.
- **E-mail ofuscado:** o `mailto:` é reconstruído por JS de `data-u`/`data-d`
  (`BaseLayout.astro`), reduzindo coleta por scrapers.

## 3. Consentimento (estado auditado)

- Mecanismo: `CookieConsent.astro` + `localStorage 'ecooa_cookie_consent'`.
- Analytics (GTM) e Meta Pixel são **interaction-gated**: só carregam após interação do
  usuário (ou timeout) — `BaseLayout.astro`. Em `/obrigado`, a carga é forçada via evento
  `ecooa_force_analytics` **somente se** o consentimento foi aceito (`obrigado.astro`).
- O formulário tem checkbox de consentimento próprio (agendamento, contato).

**Requisito para o P14 (PROM-P04-DG1):** consolidar Consent Mode v2 e garantir que toda tag
respeite as categorias de consentimento de forma granular. Dono do tema: P14.

## 4. Segredos e exposição

- Repositório **sem segredos**: `FORM_ACTION`, `GTM_ID`, `META_PIXEL_ID` são identificadores
  públicos por natureza (servidos no HTML). Sobrescrevíveis por env (`.env`), com fallback
  de produção em `constants.ts`.
- O código-fonte do GAS (que processa os leads) vive na conta do dono — fora do repo.

## 5. Logs

- Cliente: sem log de PII em console (os eventos não carregam PII).
- Server-side (GAS): território do dono; recomenda-se não logar mais que o necessário.

## 6. Pendências humanas / jurídicas (nomeadas)

- **Validação jurídica** dos textos de privacidade/termos/cookies e dos disclaimers do
  nicho regulado (saúde): **revisor a definir pelo dono**, escopo = páginas legais + claims.
  Rascunho pode nascer de IA; validade é do revisor humano. (Detalhar no P12.)
- **Retenção de dados** dos leads no destino (planilha/CRM): definir política — pendência
  do dono.
- **Teste E2E de chegada do lead** (HIP-09): pendência do dono — ver
  `CONVERSION_GOVERNANCE.md` §8.
