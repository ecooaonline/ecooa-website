# Performance Budget — ecooa-website

Orçamento de performance para impedir regressão. Validado pelo Lighthouse CI
(desktop + mobile) em cada PR.

> **Ratificação P06 (MYTHOS, 2026-06-14).** Meta atingida por evidência de **campo**
> (PSI produção 100/100/100/100, Lei 4) e confirmada no estado atual: o gate Lighthouse
> do CI passou verde em todos os merges recentes (P04, faxina P05), inclusive após a
> remoção de assets órfãos e código morto — zero regressão. Doutrina P06 quando já em
> 100: **medir, preservar, blindar — não refazer** (otimização cosmética é anti-padrão).
> **Rito de Regressão ativo**: toda fase que tocar asset/fonte/CSS/JS mede antes×depois
> nas páginas críticas; o gate do CI o automatiza. **PROM→P8**: promover os gates de
> mobile de `warn` para `error` (há folga grande: LCP mobile 1,2s vs teto 2500ms).
> Caminho A (Lighthouse local) disponível: `chromium-browser` presente no ambiente.

## Baseline oficial (PageSpeed Insights, produção, 2026-05-31)

Medido via API oficial do PSI contra `https://www.somosecooa.com.br` (homepage).
**100 em todas as 4 categorias, mobile e desktop.**

| Categoria      | Mobile  | Desktop |
| -------------- | ------- | ------- |
| Performance    | **100** | **100** |
| Accessibility  | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO            | **100** | **100** |

| Métrica medida | Mobile | Desktop |
| -------------- | ------ | ------- |
| LCP            | 1,2 s  | 0,3 s   |
| FCP            | 1,1 s  | 0,3 s   |
| TBT            | 0 ms   | 0 ms    |
| CLS            | 0      | 0       |
| Speed Index    | 2,3 s  | 1,0 s   |

## Core Web Vitals (alvo)

| Métrica | Alvo     | Gate desktop | Gate mobile                |
| ------- | -------- | ------------ | -------------------------- |
| LCP     | ≤ 2500ms | `error` 2500 | `warn` 4000 (até baseline) |
| CLS     | ≤ 0.05   | `error` 0.1  | `warn` 0.1                 |
| INP     | ≤ 200ms  | —            | —                          |
| FCP     | ≤ 2000ms | `warn` 2000  | `warn` 3000                |
| TBT     | ≤ 200ms  | `warn` 300   | `warn` 600                 |

> Os gates de mobile estão em `warn` propositalmente. Com o baseline real agora
> capturado (LCP 1,2s mobile, folga grande contra os 2500ms), podem ser endurecidos
> para `error` numa etapa futura sem risco de flakiness.

## Orçamento de assets (por página)

| Recurso              | Limite  | Atual (medido)                        |
| -------------------- | ------- | ------------------------------------- |
| JS total             | ≤ 50KB  | ~4-40KB por página ✅                 |
| CSS total            | ≤ 50KB  | ~48KB ✅                              |
| Imagem hero (AVIF)   | ≤ 150KB | máx 140KB ✅                          |
| Imagem comum         | ≤ 100KB | ✅                                    |
| Famílias de fonte    | ≤ 2     | 2 (Arboria, Playfair) ✅              |
| Pesos de fonte       | ≤ 5     | 4 ✅                                  |
| Scripts de terceiros | ≤ 2     | 2 (GTM, Meta Pixel), consent-gated ✅ |

## Regras para novas contribuições

1. **Nova dependência client**: proibida sem justificativa (filosofia zero-dep). DevDeps OK.
2. **Nova imagem**: gerar par AVIF + WebP, com `width`/`height` explícitos (anti-CLS).
3. **Imagem LCP above-the-fold**: usar `<OptimizedImage priority />`. Nunca em below-the-fold.
4. **Imagem below-the-fold**: deixar `loading="lazy"` (default do `OptimizedImage`).
5. **Nova animação**: preferir CSS; evitar animar `width/height/top/left` (causa layout shift).
6. **Novo script de terceiro**: só consent-gated e interaction-only (padrão do BaseLayout).
7. **Nova fonte/peso**: questionar necessidade; manter preload só dos críticos above-the-fold.

## Estado do LCP (auditoria Etapa 2)

Constatação importante da auditoria: o **LCP é texto (h1) em praticamente todas as
páginas**. As fontes críticas já são preloaded e usam `font-display: swap`. A única
página com herói raster above-the-fold (perfil do profissional) já usa `priority`.
As imagens de clínica/equipe são **below-the-fold** e corretamente `lazy`.

Portanto o principal lever restante de performance NÃO é código de imagem, e sim a
**camada de entrega** (Brotli + cache imutável + headers), hoje limitada pelo
GitHub Pages. A migração para **Cloudflare Workers Static Assets** já foi decidida no
P03 (DEC-15, `INFRASTRUCTURE.md`); o plano de cache/headers que destrava esse lever é
devido ao **P07** (PROM-04/05). Cutover pendente do dono.

## Como medir

- **CI automático**: cada PR roda Lighthouse desktop (`lighthouserc.json`) e mobile
  (`lighthouserc.mobile.json`). Resultados em `temporary-public-storage`.
- **Produção (campo)**: PageSpeed Insights em `https://www.somosecooa.com.br`.
  Automação via API oficial já validada (chave configurada no projeto Google Cloud,
  cota grátis 25.000 req/dia). Também é possível rodar manualmente em pagespeed.web.dev.
