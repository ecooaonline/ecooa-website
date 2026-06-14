# ACCESSIBILITY_CHECKLIST — ecooa-website

> Fase: P09 (MYTHOS). Data: 2026-06-14. Meta: Lighthouse Accessibility ≥ 99 (alvo 100).
> Estado: **100 a11y** (PSI campo, Lei 4) — doutrina: medir, preservar, blindar, não refazer.
> Score é o piso (Lei 28): inclui verificação manual da IA + roteiro de leitor de tela.

## 1. Tabela de contraste (ratios calculados — Lei 28)

| Elemento | Par (fg / bg) | Ratio | Critério | Passa? |
|---|---|---|---|---|
| Texto corpo | ink `#1c1917` / warm `#faf8f6` | **16.51:1** | 4.5:1 | ✅ AAA |
| Texto secundário | brand-text `#706662` / warm | **5.26:1** | 4.5:1 | ✅ |
| Texto secundário | brand-text `#706662` / cream `#f3eeea` | **4.84:1** | 4.5:1 | ✅ |
| Texto suave | ink-ghost `#6e6865` / warm | **5.17:1** | 4.5:1 | ✅ |
| Texto suave | ink-soft `#6b6360` / warm | **5.54:1** | 4.5:1 | ✅ |
| Acento (texto grande) | brand-accent `#8d8381` / warm | **3.48:1** | 3:1 (grande) | ✅ |
| Botão preenchido | branco `#ffffff` / ink `#1c1917` | **17.49:1** | 4.5:1 | ✅ AAA |

`brand-accent` só passa para **texto grande** (3:1) — é exatamente o uso documentado em
`tokens.css`. Nenhum texto/CTA crítico abaixo de AA.

## 2. Verificação manual da IA (com evidência)

- **Foco visível universal:** `:focus-visible { outline: 2px solid var(--color-brand-text); offset 3px }` em `base.css`. **Correção P09:** 4 elementos focáveis (3 inputs de newsletter no blog + 1 `<summary>` de FAQ) tinham `outline:none` inline que **sobrescrevia** o foco global (inline vence stylesheet) — removidos, restaurando o foco visível (WCAG 2.4.7). Nos inputs de seção escura o contorno taupe fica ~2.9:1 (visível; AA 2.1 ok). Enhance de contraste do anel (anel claro em fundo escuro) registrado como polimento do P11.
- **Skip link:** `.skip-link` presente, aparece no foco (`base.css`).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` zera animações/transições e `scroll-behavior` (`base.css`) — cobre cursor customizado e microinterações.
- **SVGs decorativos:** 50/50 com `aria-hidden` ou nome no pai (auditoria P0/imagens).
- **Imagens:** 100% com `alt` válido; fotos de profissionais com `alt` "Nome, Cargo" (#58).
- **`sr-only`** para conteúdo só-leitor presente.

## 3. Semântica / teclado / ARIA (Lei 29 — nativo primeiro)

- Landmarks (`header`/`nav`/`main`/`footer`), `main` único, H1 por página.
- Interativos nativos (`<a href>`, `<button>`); ARIA só onde o nativo não alcança.
- Modais/menu mobile com gerência de foco; `Escape` fecha; `target="_blank"` com `rel`.
- Formulários: labels associadas, `required`/`aria-required`, erro anunciável; lógica de
  envio governada por `CONVERSION_GOVERNANCE.md`.

## 4. Mobile / touch / zoom

Touch targets adequados; zoom 200% sem overflow horizontal; reflow ok (responsive.css).

## 5. Gate de a11y no CI (Lei 26)

Lighthouse Accessibility roda no CI (desktop bloqueante via LHCI; mobile em report). axe
automatizado: **DEC** (site já 100; gatilho: primeira regressão). Ver `QUALITY_GATES.md`.

## 6. ROTEIRO DE LEITOR DE TELA (pendência do dono — Lei 28)

Verificação que só humano faz. Ferramenta por plataforma (NVDA/VoiceOver/TalkBack). Passos:
1. Abrir a home; ouvir título + landmark principal.
2. Navegar por headings; a hierarquia faz sentido de ouvido?
3. Menu: cada item anunciado com nome e estado?
4. Chegar ao formulário de agendamento por teclado; cada campo anuncia label + obrigatório?
5. Enviar com erro; o erro é anunciado e o foco vai para ele?
6. Completar até `/obrigado`; a confirmação é anunciada?

Prazo: a definir pelo dono. Auditado no P13.
