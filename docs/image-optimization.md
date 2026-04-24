# Otimização de Imagens

## Estado atual (P6.3)

O componente `src/components/OptimizedImage.astro` foi criado como wrapper padronizado para todas as imagens do site. Ele renderiza `<picture>` com `<source>` AVIF (via convenção de nome) e `<img>` WebP de fallback, com suporte completo a:

- `loading` (lazy/eager)
- `fetchpriority` (high/low/auto)
- `decoding` (async/sync/auto)
- `sizes` (para futuro srcset multi-width)
- `width` e `height` explícitos (previne CLS)
- `class` e `style` passthrough

## Decisão de Design

As imagens permanecem em `/public/team/` e `/public/clinic/` em vez de serem migradas para `src/assets/`. Justificativa:

1. Migração massiva (30+ imagens + 96 páginas com referências) tem risco alto de regressão
2. Build time atual (2.6s) está muito abaixo do limite (15s)
3. `OptimizedImage` permite upgrade futuro para srcset multi-width sem quebrar callers

## Migração Incremental Já Realizada

| Arquivo | Status |
|---------|--------|
| `src/components/ProfessionalCard.astro` | ✅ Migrado |
| `src/components/CtaSection.astro` | ✅ Migrado |
| `src/pages/profissionais/[slug].astro` | ✅ Migrado (hero LCP) |

## Pendente (P9 - Melhoria Contínua)

Arquivos que ainda usam `<picture>` direto (não críticos, below-the-fold ou decorativos):

- `src/pages/index.astro`
- `src/pages/match.astro`
- `src/pages/ecooa-med.astro`
- `src/pages/ecooa-esthetic.astro`
- `src/pages/ecooa-mind.astro`
- `src/pages/ecooa-working.astro`
- `src/pages/quem-somos.astro`
- `src/pages/mentorias.astro`
- `src/pages/obrigado.astro`
- `src/pages/especialidade/[specialty].astro`

Migração desses pode ser feita batch a batch, cada batch com `npm run build` para validação.

## Upgrade Futuro (Multi-Width srcset)

Para adicionar responsive srcset real (várias resoluções por imagem), seguir:

1. Gerar versões redimensionadas das imagens em `public/team/` (ex: `gustavo-320w.webp`, `gustavo-640w.webp`, `gustavo-960w.webp`)
2. Atualizar `OptimizedImage.astro` para emitir `srcset` com essas variantes
3. Nenhum caller precisa mudar (API do componente permanece igual)

Script sugerido para gerar variantes: `scripts/generate-image-variants.mjs` usando Sharp (pacote que Astro já traz).

## Padrão de Uso

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
---

<OptimizedImage
  src="/team/gustavo.webp"
  alt="Dr. Gustavo Gehrke"
  width={480}
  height={640}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
  class="u-cover"
/>
```

Para imagens above-the-fold (LCP candidate):

```astro
<OptimizedImage
  src="/team/gustavo.webp"
  alt="Dr. Gustavo Gehrke"
  width={480}
  height={640}
  loading="eager"
  fetchpriority="high"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```
