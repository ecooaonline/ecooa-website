# SITEMAP_PLAN.md — Plano de sitemap do ecooa-website

> Produzido pelo P02 (2026-06-12). **Deriva da Matriz de Páginas**
> ([INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) §4) — referencia linhas,
> não copia colunas (Lei 13).

## 1. Sitemap atual (medido em 2026-06-12)

`dist/sitemap-index.xml` → `sitemap-0.xml` com **100 URLs** (gerado por
`@astrojs/sitemap` com filtro em `astro.config.mjs`). Conferido contra o build no diff
triplo do P02: **zero diferenças inexplicadas**.

## 2. Sitemap ideal

**= sitemap atual.** As 100 URLs correspondem exatamente às linhas indexáveis da Matriz
(linhas 1-18, expandidas as linhas-grupo 7/9/10/12). Nenhuma inclusão ou remoção
necessária nesta esteira.

## 3. Obrigatórias (todas presentes ✓)

Linhas 1-6, 8, 11, 13-18 da Matriz + expansões das linhas 7, 9, 10, 12.

## 4. Opcionais incluídas

Categorias (linha 10) e especialidades (linha 12): mantidas — têm conteúdo real e função
comercial; a fraqueza atual é de **linkagem interna** (Matriz §9), não de existência.

## 5. Noindex (corretas hoje ✓)

Linhas 19 (obrigado), 20 (offline), 21 (404), 22 (redirects) — todas com `noindex`
verificado no HTML do build (P00 EV3 + reverificação P02).

## 6. Fora do sitemap (corretas hoje ✓)

As mesmas da seção 5, via filtro do `astro.config.mjs` (obrigado, offline, nutrição-*).

## 7. Futuras (condicionadas ao Pacote de Decisões do P02)

PAC-01 `/termos` (P12) · PAC-03 perfis Eduarda/Tais (automáticos via linha 7 quando os
dados entrarem na fonte — P4) · PAC-05 landings de campanha (P14; **noindex** por padrão
ao nascer). Categoria `ecooa`: passa a existir automaticamente quando houver artigo
(linha 10) — sem ação.

## 8. Pós-meta

Guias/cases (SCOPE §4), páginas de search estático, conteúdo programático — nenhum entra
no sitemap antes de existir com conteúdo real e linha na Matriz.

## 9. Redirects necessários

**Nenhum novo.** Os 3 legados (nutrição-* → slugs sem acento) permanecem; reavaliação de
remoção só após confirmação de decaimento no Search Console (P10, depende HIP-05).

## 10. Pendências humanas

Confirmar propriedade do Search Console (HIP-05) para validar cobertura real do sitemap
em produção (CAMPO) — dono, até o P10.
