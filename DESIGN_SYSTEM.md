# Design System — ecooa

Referência do sistema de design. Tokens em `src/styles/tokens.css`. Componentes em
`src/components/`. Estilos globais em `src/styles/` (base, layout, components, animations,
responsive).

## Princípios

- **Premium e sóbrio**: cantos retos (sem border-radius nos cards), muito espaço negativo,
  tipografia editorial (Arboria + Playfair italic nos destaques).
- **CSS puro, zero-dep no runtime**: animações em CSS, sem bibliotecas JS de UI.
- **Acessível por padrão**: foco visível, `prefers-reduced-motion`, contraste AA.
- **Mobile-first**: breakpoints 480 / 768 / 1024 / 1280.

## Tokens (`tokens.css`)

### Cores

| Token                                          | Uso                                         |
| ---------------------------------------------- | ------------------------------------------- |
| `--color-brand` … `--color-brand-accent`       | Paleta de marca (taupe)                     |
| `--color-brand-text` (#706662)                 | Texto de marca, AA ≥ 4.5:1 em fundos claros |
| `--color-white / warm / cream / stone / mist`  | Neutros / fundos                            |
| `--color-ink / ink-mid / ink-soft / ink-ghost` | Textos (ink-ghost AA ≥ 4.5:1)               |

Cores de terceiros (não tokenizadas, intencional): `#25d366` (WhatsApp), `#b8975a`
(dourado das avaliações Google).

### Tipografia

- Famílias: `--font-primary` (Arboria 300/400/500), `--font-serif` (Playfair italic 300–400).
- Headings: classes `.h1`/`.h2` (clamp fluido, `letter-spacing: --ls-tight`).
- Corpo: `.body` (14px/1.9). Variantes `.body-lg`, `.body-md`, `.it-d`, etc.
- Line-height: `--lh-tight` 1.1 · `--lh-snug` 1.3 · `--lh-base` 1.6 · `--lh-relaxed` 1.8.
- Letter-spacing: `--ls-tight` -0.02em · `--ls-normal` 0 · `--ls-wide` 0.1em · `--ls-wider` 0.18em.

### Espaçamento

`--space-xs` 8 · `--space-sm` 14 · `--space-md` 22 · `--space-lg` 36 · `--space-xl` 60 ·
`--space-2xl` 86 · `--space-3xl` 108. Seções: `--section-px`, `--section-py`, `--section-py-sm`.

### Radius / Sombra / Z-index

- Radius: `--radius-sm` 4 · `--radius-md` 8 · `--radius-full` 50%.
- Sombra: `--shadow-sm` · `--shadow-md` (hover de card) · `--shadow-lg`.
- Z-index: `--z-base` 1 · `--z-raised` 2 · `--z-nav` 200 · `--z-overlay` 500 ·
  `--z-modal` 600 · `--z-cursor` 9999.

### Movimento

- Duração: `--transition-fast` 0.2s · `--transition-base` 0.3s · `--transition-slow` 0.5s.
- Easing: `--ease-spring`, `--ease-out`.
- Toda animação respeita `@media (prefers-reduced-motion: reduce)`.

## Botões (`components.css`)

| Classe   | Uso                        | Fundo                      |
| -------- | -------------------------- | -------------------------- |
| `.bd`    | Primário (escuro)          | ink → hover transparente   |
| `.bo`    | Secundário (outline)       | transparente, borda brand  |
| `.bw`    | Primário em fundo escuro   | branco                     |
| `.bow`   | Secundário em fundo escuro | transparente, borda branca |
| `.ghost` | Link com seta              | sem fundo                  |

Estados: `:hover`, `:focus-visible` (global), `:active` (press de 1px), `:disabled`/`[disabled]`
(opacidade 0.5, sem ponteiro). O submit dos formulários usa `[disabled]` durante o envio.

## Componentes principais

`Nav`, `Footer`, `CtaSection` (CTA final, em 11/11 páginas), `PillarCard`, `ProfessionalCard`
(+ modal com focus trap), `NewsletterCapture` (3 variantes), `ReviewsMarquee`, `Marquee`,
`LocationCard`, `WhatsAppFab`, `OptimizedImage` (AVIF + WebP, exige `alt`).

## Cards (padrões de padding conhecidos)

Os cards têm cantos retos e borda `1px var(--color-stone)`. Padding varia por contexto
(18–44px); ao criar card novo, reaproveitar um padrão existente em vez de inventar valor.

## Jornada / conversão

Funil: problema → solução → prova → ação. Caminhos: WhatsApp direto, `/agendamento`,
`/match` → agendamento, formulário de contato. FAB de WhatsApp persistente. Toda página
termina com `CtaSection`.
