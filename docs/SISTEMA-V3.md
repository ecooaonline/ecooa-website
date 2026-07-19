# Sistema v3 · contrato de reconstrução (referência "home conceitual")

Direção: editorial de luxo silencioso sobre Cloud Dancer. Papel nobre, luz natural, pele, silêncio, precisão. Régua de aprovação: "isso poderia existir em uma suíte de hotel 6 estrelas nas Maldivas?" Se não, refazer.

## Regras invioláveis

- Fundo dominante `var(--color-warm)` (#F0EEE9 Cloud Dancer). Apoio: `--color-cream`, `--color-mist`, branco em superfícies elevadas, `--color-stone` para hairlines.
- Monocromia marfim + grafite-oliva. Acento único `var(--color-gold)` (#86836F, hoje grafite-oliva). PROIBIDO: dourado/caramelo, amarelo, azul médico, verde clínico, cor saturada.
- A única cor viva vem da fotografia. Fotos sempre em moldura galeria (`.lux-frame` + `.lux-frame-img`) ou sangradas com propósito.
- Seções escuras (`var(--color-ink)`) são pontuação: no MÁXIMO 1-2 por página.
- Poucos elementos por dobra. Grandes áreas de respiro (padding vertical 88-128px). Composição assimétrica e calma. Nada de vitrine, nada de excesso de cards/ícones/banners.
- "ecooa" sempre minúscula, NUNCA mascarada/preenchida por imagem. Type masking (`MaskedWordBand`) só com: vida, pele, corpo, mente.
- Sem em-dash. Sem "oferta"/promocional. Sem promessa de resultado (CFM). Sem marcas de medicamentos. Acentos pt-BR corretos.
- Dor antes da submarca nos textos B2C; submarca lidera no institucional/B2B.

## Vocabulário de componentes (usar estes, não inventar variantes)

- `HeroEditorial` (componente): props `title` (HTML com `<br>`/`<em>`; em = itálico metálico oliva), `label?`, `sub?`, `signature?` (linha "o cuidado que ecooa."), `stars?`, `ctaHref/ctaLabel/ctaIntent`, `secondaryHref/secondaryLabel`, `badges?`, `image/imageAlt/imageCaption?`, `vertical?`. Usar em TODAS as páginas principais como abertura.
- `PaperCard`: cartão-papel premium com selo em relevo (`href, title, sub, desc, image?, imageAlt?, delay?`).
- `EspelhoSection`: entradas por dor em primeira pessoa (frases entre aspas, serif itálico).
- `FaqVisivel`, `CtaSection` (heading/subtext/showAgendar?), `GuiaSection` (equipe por unit), `JornadaTimeline`, `DisclaimerMedico`, `OptimizedImage`, `WavePattern` (ondas: traço 1px, stroke `#cac7b8` sobre claro, `white` opacity .05-.15 sobre escuro).
- Botões (já globais, cantos retos): `.bd` noir sólido · `.bo` hairline sobre claro · `.bow` hairline sobre escuro · `.bw` branco sobre escuro · `.ghost` link com seta.
- Tipografia: `.h1/.h2` (Playfair, `em` = itálico oliva metálico), `.lbl` (label lowercase espaçado com filete), `.body`, `.stars-quiet` (★ finas oliva), `.sig-line`, `.gr-grid/.gr-card/.gr-quote/.gr-author` (depoimentos), `.paper-card*`, `.seal`.

## Estrutura de página (molde)

1. `HeroEditorial` com a dor/promessa da página (título itálico gigante, foto emoldurada).
2. 1 seção de entrada por dor OU proposta editorial curta.
3. Conteúdo essencial da página em 2-4 seções calmas (não mais que isso acima do rodapé; consolidar, cortar redundância sem piedade).
4. No máximo 1 pontuação escura (método/CTA intermediário).
5. Prova social discreta quando fizer sentido (2-3 depoimentos `.gr-card`, nunca mais).
6. `FaqVisivel` quando a página tiver FAQ (SEO).
7. `CtaSection` final.

## O que preservar ao reescrever uma página

- Frontmatter: dados, imports usados, coleções, constantes (WA_BASE etc.).
- Formulários completos (`ecooa-form`, honeypot, `_loadedAt`, consent LGPD) e `<script>` de `form-submit`/inicializações. Não alterar names/actions.
- IDs de âncora existentes (`#metodo-gehrke`, `#protocolos`, `#descobrir-meu-nivel`, `#transplante-capilar`, `#procedimentos`, `#como-funciona`, `#bioimpedancia`, `#programas`, `#medicina`, `#estetica`, `#nutricao`, `#saude-mental`).
- `title`/`description`/`breadcrumbs`/`ogImage` do BaseLayout, JSON-LD, `DisclaimerMedico` onde houver.
- A essência do copy aprovado (promessas, espelhos, protocolos, FAQs). Reapresentar, não reescrever do zero; cortar o que for redundante.

## O que eliminar

`Marquee` (faixa rolante) em todas as páginas. Grades densas de 8+ cartões iguais (consolidar em listas editoriais). Repetição de CTAs idênticos. Chips/pills coloridos. Qualquer resíduo de layout SaaS.
