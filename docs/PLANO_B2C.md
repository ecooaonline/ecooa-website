# PLANO B2C — Reposicionamento ecooa (B2C-first, B2B como hub para profissionais)

> Planejamento (não-execução). Data: 2026-06-14. Decisões do dono: (1) hub B2B único
> fora do menu; (2) redesign da home mais ousado, dentro da marca; (3) plano detalhado
> antes de tocar no código. Preserva toda a fundação técnica (P04-P13): performance
> 100/100, a11y, SEO, gates, fonte única. Nada aqui é executado até sua aprovação.

## 1. Posicionamento

- **Audiência primária = PACIENTE (B2C).** Conversão soberana: **agendar avaliação**.
- **Audiência secundária = PROFISSIONAL (B2B).** Dois interesses: (a) *atender na ecooa*
  (recrutamento), (b) *ecooa.cademy* (mentorias/cursos). Acesso discreto, fora do fluxo
  do paciente.
- Atualiza `STRATEGY.md` (DEC-01 permanece agendamento; registra B2B como conversão
  secundária com canal próprio).

## 2. Situação atual (evidência)

| B2B hoje | Onde |
|---|---|
| Form "atenda na ecooa" (`b2b-medicina`) | dentro de `ecooa-med.astro` (página de paciente) |
| Form "atenda na ecooa" (`b2b-nutricao`) | dentro de `ecooa-working.astro` (idem) |
| `B2BBanner` | `ecooa-med`, `ecooa-esthetic`, `ecooa-mind`, `profissionais` |
| `mentorias` (ecooa.cademy) | item do **menu principal** + página `/mentorias` |
| Copy B2B dispersa | index, contato, obrigado, profissionais |

Problema: a jornada do paciente e o convite ao profissional competem no mesmo espaço.

## 3. Matriz de rotas (antes → depois)

| Rota | Hoje | Depois | Ação |
|---|---|---|---|
| `/` | home B2C + ecossistema | home B2C **redesenhada** (mais ousada) | redesign |
| `/ecooa-med` | paciente + form B2B | **só paciente** | remover form/banner B2B |
| `/ecooa-esthetic` | paciente + B2BBanner | **só paciente** | remover banner |
| `/ecooa-mind` | paciente + B2BBanner | **só paciente** | remover banner |
| `/ecooa-working` | paciente + form B2B | **só paciente** | remover form/banner B2B |
| `/profissionais` | equipe + B2BBanner | **só equipe (paciente)** | remover banner |
| `/para-profissionais` | — | **NOVO hub B2B** | criar |
| `/mentorias` | no menu principal | mantém a página; **sai do menu**, acessada via hub | tirar do Nav |
| `/agendamento` `/contato` `/match` `/quem-somos` `/blog` `/especialidades` | — | inalteradas (B2C) | — |

**Sem remoção de rota indexada** (mentorias permanece) → **zero 301 necessário**. O hub é
rota nova. Os forms B2B mudam de página, mas mantêm `_formType` (`b2b-medicina`/
`b2b-nutricao`) → o backend GAS e a conversão continuam funcionando sem mudança.

## 4. O hub `/para-profissionais` (novo)

Uma página, dois caminhos claros:
1. **Atenda na ecooa** — proposta para o profissional se juntar; os 2 forms de
   recrutamento (medicina + nutrição/demais áreas) migram pra cá, unificados ou lado a
   lado. Copy própria (voz B2B: parceria, estrutura, curadoria).
2. **ecooa.cademy** — bloco que apresenta mentorias/cursos e linka para `/mentorias`
   (mantém o conteúdo rico existente).
- Indexável, no sitemap, entra em `STRATEGIC_ROUTES` do gate do Contrato (P08).
- Schema: `ProfessionalService`/`Organization` (sem inventar dado).

## 5. Acesso ao B2B (discreto, fora do menu)

- **Rodapé:** seção "para profissionais" → link para `/para-profissionais` (e mentorias).
- **1 ponto de entrada sutil** no fim de páginas relevantes (ex.: fim de `/profissionais`
  ou `/quem-somos`): uma linha discreta "é profissional de saúde? conheça a ecooa para
  profissionais" → hub. Nunca compete com o CTA de agendar.
- **Nav principal:** remove `mentorias`; permanece 100% B2C.

## 6. Nav proposto (B2C enxuto)

`quem somos · medicina · estética · saúde mental · nutrição · profissionais · match ·
blog · contato` + CTA **agendar avaliação**. (Remove `mentorias`; B2B vai pro rodapé/hub.)

## 7. Redesign da home (mais ousado, dentro da marca)

Identidade **preservada** (paleta taupe/cream/ink, fontes Arboria/Playfair, cursor,
texturas, botões pílula). O que ganha ousadia é **composição, hierarquia e ritmo**, não a
marca. Fluxo atual → proposto:

| Hoje | Proposto (B2C-first) |
|---|---|
| Hero apresentação | **Hero de promessa ao paciente** — headline de transformação + 1 CTA soberano (agendar) + prova (★ reviews) imediata; visual mais editorial/amplo |
| Empatia | mantém, elevada (dores do paciente) |
| Persona | mantém |
| Reviews Google | **sobe** (prova social mais cedo) |
| Fundadores | mantém |
| Quem somos intro | mantém, condensada |
| Ecossistema (pilares) | **destaque visual** — os 4 pilares como núcleo da oferta |
| Metodologia | mantém |
| (final) CTA | **CTA de fechamento forte** (agendar) + acesso discreto a profissionais no rodapé |

Regras do redesign: Lei do Pixel (inventário visual antes/depois de cada página crítica);
sem quebrar performance (LCP ainda texto/hero; Rito de Regressão), a11y (foco/contraste)
nem SEO (H1/schema). "Ousado" = layout e impacto, com os mesmos tokens.

## 8. Fases de execução (após sua aprovação do plano)

1. **Estratégia** — atualizar `STRATEGY.md`/`INFORMATION_ARCHITECTURE.md` (Matriz nova,
   conversão secundária B2B, Contrato de Páginas atualizado: +/para-profissionais).
2. **Hub + limpeza B2B** — criar `/para-profissionais`; mover forms/banners dos pilares e
   de `/profissionais`; ajustar Nav (remove mentorias) e rodapé (add hub). Gate:
   `STRATEGIC_ROUTES` += hub. Branch + preview.
3. **Redesign da home** — nova composição B2C; inventário visual antes/depois; medir
   perf/a11y (Rito de Regressão). Branch + preview.
4. **Conteúdo/copy** — voz B2C afinada nos pilares; copy própria do hub; guardião
   regulatório verde (sem promessa absoluta); voz da marca preservada (Inventário de Copy).
5. **QA + merge** — gates verdes (Contrato/Guardião/perf/a11y/SEO), red-team, merge.

Cada fase: build/check/lint verdes, preview para você conferir, merge com seu OK.

## 9. Impactos técnicos e riscos

- **Gate do Contrato:** adicionar `/para-profissionais` a `STRATEGIC_ROUTES`
  (`scripts/validate-output.mjs`).
- **Forms B2B:** só mudam de página; `_formType` e destino GAS intactos → sem quebra de
  conversão (mas re-testar o Protocolo do P04 após mover — Lei de Ferro).
- **SEO:** mentorias mantém URL (sem 301); hub é conteúdo novo (sem canibalizar pilares).
- **Redesign da home:** maior risco é regressão de LCP/CLS — mitigado pelo Rito de
  Regressão e por manter o LCP como texto/hero.
- **Preservação:** identidade visual, fotos, reviews reais, dados de profissionais e CTAs
  de agendamento intocados.

## 10. Decisões abertas (para quando executarmos)

- Nome do hub: `/para-profissionais` (claro/SEO) vs `/seja-ecooa` (marca). Recomendo o
  primeiro.
- Forms de recrutamento no hub: **um form unificado** (área como campo) vs dois lado a
  lado. Recomendo unificado.
- `/mentorias`: manter como página dedicada linkada do hub (recomendado) vs fundir tudo
  no hub.
- Ponto de entrada sutil ao B2B nas páginas B2C: em `/profissionais` + rodapé (recomendado)
  vs só rodapé.
