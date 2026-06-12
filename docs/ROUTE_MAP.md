# ROUTE_MAP.md — Mapa de rotas e regras de URL do ecooa-website

> Produzido pelo P02 (2026-06-12). **Deriva da Matriz de Páginas**
> ([INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) §4). Lei 14: rota
> indexada é compromisso público.

## 1. Rotas atuais (24 arquivos em `src/pages/`)

18 rotas estáticas + 4 templates dinâmicos (`blog/[slug]`, `blog/categoria/[category]`,
`profissionais/[slug]`, `especialidade/[specialty]`) + 3 endpoints (`rss.xml.ts`,
`feed.json.ts`, `llms.txt.ts`). Mapeamento completo: Matriz §4.

## 2. Rotas propostas

**Nenhuma nova rota nesta esteira sem aprovação do Pacote de Decisões** (PAC-01 /termos;
PAC-05 landings). Perfis novos (PAC-03) usam o template existente da linha 7.

## 3. Slugs atuais — auditoria

✓ minúsculos, sem acentos (exceto redirects legados, que existem exatamente para isso),
hífen como separador, curtos e descritivos, sem datas, sem termos proibidos, sem
caracteres especiais, únicos (verificado: 30 perfis + 34 artigos + 17 especialidades +
5 categorias sem colisão), coerentes com pt-BR e com a marca (lowercase intencional).

## 4. Slugs problemáticos

**Nenhum.** Observação não-bloqueante: artigos com sufixo `-porto-alegre` (3) são
intencionais (SEO local) e estáveis.

## 5. Slugs que não mudam

**Todos os 100 indexáveis.** Zero mudanças propostas (a melhor arquitetura é a que nunca
precisará de redirect).

## 6. Slugs que podem mudar com redirect

Nenhum candidato. Tabela vazia por mérito, não por omissão.

## 7. Rotas antigas

`/especialidade/nutrição-{clínica,esportiva,estética}` → 301 internos (meta-refresh
noindex) para os slugs limpos, via `astro.config.mjs`. Manter até P10 confirmar
decaimento no GSC.

## 8. Rotas técnicas

`/offline` (SW fallback, noindex) · `/404` · endpoints de feed. Fora do sitemap conforme
SITEMAP_PLAN §5-6.

## 9. Rotas de conversão

`/agendamento` · `/contato` · `/obrigado` (+ formulários B2B embutidos em `/ecooa-med` e
`/ecooa-working`). Regras de conversão: Matriz §10.

## 10. Rotas críticas (quebra = incidente)

`/` · 4 pilares · `/agendamento` · `/obrigado` · `/profissionais` · `/match` · `/blog`.
O futuro gate do Contrato (P8) deve validar a presença de todas no build.

## 11. As 8 regras permanentes de URL

1. Slugs são estáveis (Lei 14). 2. URL indexada não muda sem redirect 301 aprovado.
3. Slug curto e descritivo. 4. Evitar slug genérico. 5. Evitar duplicado. 6. Evitar slug
preso a campanha temporária. 7. Evitar slug com promessa indevida. 8. Evitar termo
regulatório sensível sem revisão humana.
