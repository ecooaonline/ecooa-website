# AI Handoff — ecooa-website

Documento para sincronizar contexto entre sessões de IA e entre as 9 etapas de recodificação.

## Estado atual do projeto (atualizar a cada etapa concluída)

| Etapa | Assunto                                         | Status          |
| ----- | ----------------------------------------------- | --------------- |
| 1     | Fundação e DX                                   | ✅ Concluída    |
| 2     | Rede de testes (Playwright, axe, snapshot)      | Pendente        |
| 3     | Migração Cloudflare Pages                       | Pendente        |
| 4     | Segurança (CSP nonce, edge proxy FORM_ACTION)   | Pendente        |
| 5     | Performance e imagens (Astro Image nativo, LCP) | ✅ 100 (PR #28) |
| 6     | Acessibilidade WCAG AA+                         | ✅ 100 (PR #29) |
| 7     | PWA completa (ícones, screenshots, SW offline)  | Pendente        |
| 8     | Observabilidade (Sentry, uptime, RUM)           | Pendente        |
| 9     | Gate de qualidade Lighthouse 99+                | Pendente        |

## Segurança — validada em produção

DNS propagado no registro.br, domínio ativo na Cloudflare (proxy laranja), SSL Full
(strict). Headers servidos por Cloudflare Transform Rule + meta-tags no `BaseLayout`.

Validação em produção (`https://www.somosecooa.com.br`):

- **HSTS ativo**: `Strict-Transport-Security: max-age=63072000` (2 anos).
- **Mozilla Observatory**: 80/100, 9 de 10 testes passando.
- **securityheaders.com**: HSTS, CSP, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy presentes.

### PENDÊNCIA REGISTRADA (trazer de volta no gate final, antes de encerrar o projeto)

**Subir Observatory de 80 → 90+ exige CSP nonce-based.** O único teste que falha é o
Content Security Policy, penalizado por `'unsafe-inline'` no `script-src` (necessário hoje
para GTM/analytics enquanto o CSP vive em `<meta>`).

`nonce` não funciona em meta-tag, só em **header HTTP real**. Resolver requer mover o CSP
para a borda (Cloudflare Worker/Transform) gerando nonce dinâmico por requisição e
removendo `unsafe-inline`. Inviável com HTML pré-renderizado do GitHub Pages sem a camada
de edge.

Opcional para A+ no securityheaders.com (não muda o Observatory): adicionar
`includeSubDomains; preload` ao header HSTS na Transform Rule, só após confirmar que todos
os subdomínios servem HTTPS.

## Acessibilidade (WCAG AA) — concluída (PR #40)

4 blocos da auditoria implementados e mergeados:

- **Foco visível**: removido `outline:none` inline dos formulários; `:focus-visible`
  reforçado para `--color-brand-text` (#706662, ≥4,5:1).
- **Live regions**: `aria-live="polite"` nos sucessos, `role="alert"` + `.ecooa-form-error`
  nos erros (populado por `form-submit.ts`).
- **Formulários**: `autocomplete` nos campos, indicação de obrigatórios (`*` + legenda).
- **Ícones**: `aria-hidden` no SVG do Instagram (Nav) e na seta do BlogAuthor.
- **Modal de profissionais**: focus trap Tab/Shift+Tab + `aria-labelledby`.

## Meta do projeto

**99+ em todas as categorias Lighthouse** (Performance, Acessibilidade, Best Practices, SEO) com Core Web Vitals reais em verde. Sem maquiagem de nota — base técnica genuinamente sênior.

## Baseline oficial medido (PageSpeed Insights, produção)

Medido em 2026-05-31 contra `https://www.somosecooa.com.br` (homepage), via API
oficial do PageSpeed Insights. **Meta de 99+ atingida e superada: 100 em tudo.**

| Categoria      | Mobile  | Desktop |
| -------------- | ------- | ------- |
| Performance    | **100** | **100** |
| Accessibility  | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO            | **100** | **100** |

Core Web Vitals (mobile / desktop): LCP 1,2s / 0,3s · FCP 1,1s / 0,3s · TBT 0ms / 0ms · CLS 0 / 0.

O que fechou os 4 pontos que faltavam em Accessibility e Best Practices (PR #29):

- Removida `<meta http-equiv="X-Frame-Options">` (browsers ignoram via meta e logam
  console error → `errors-in-console` passou de 0 para 1).
- 3 correções de contraste WCAG AA (`color-contrast` passou de 0 para 1):
  - Footer disclaimer `rgba(255,255,255,.38)` → `.6`
  - Newsletter footer `rgba(255,255,255,.4)` → `.6`
  - Botão ACEITAR do cookie `color:#fff` → `var(--color-ink)` (1,81:1 → 8,7:1)

> Nota: X-Frame-Options deixa de existir como meta. Quando houver controle de HTTP
> headers (ex: Cloudflare Pages na etapa de migração), reintroduzir como header real.

## Armadilhas conhecidas

### 1. Especialidades sempre retornavam 404

`Astro.props.specialty` é o objeto `Specialty` completo (não a string slug). Chamada `getSpecialtyBySlug(specialty)` com o objeto falhava silenciosamente. **Fix aplicado no PR #25**: `const spec = specialty` direto.

### 2. analytics-funnel.ts tinha import quebrado

`import { gtag } from 'ga'` — pacote `ga` não existe. Arquivo removido na Etapa 1 (zero referências).

### 3. `declare global { interface Window }` duplicado

Scripts em `src/scripts/*.ts` tinham declarações de Window com tipos `any` que conflitavam com `env.d.ts`. Regra: **todas as extensões de Window ficam em `src/env.d.ts`** e nunca em scripts individuais.

### 4. `z` de `astro:content` depreciado no Astro 6

Usar `import { z } from 'zod'` (zod é peer dep do Astro, já disponível).

### 5. `Object.entries` perde a literalidade da chave

`Object.entries(record)` retorna `[string, V][]` mesmo com Record<'med'|..., V>. Fix: cast explícito `as [UnitKey, V][]` no template.

## SEO budget (política anti-regressão, Etapa 6)

Regras para impedir regressão de SEO técnico em qualquer mudança futura:

- Toda página tem `title` único e `description` única (sem genéricos repetidos).
- Quando `currentPage` é passado, o `title` NÃO deve conter ` | ecooa` (o BaseLayout
  já concatena; senão duplica).
- Todo `canonical` sai de `Astro.url + Astro.site` (não hardcodar).
- Toda página indexável entra no sitemap; páginas `noindex` (ex: `/obrigado`) são
  excluídas via `filter` em `astro.config.mjs`.
- Nenhuma página de teste/redirect no sitemap.
- Slugs sempre sem acento e sem caractere especial (regra do projeto). Trocar slug
  exige redirect em `astro.config.mjs`.
- Toda página estratégica tem H1 único e tags de heading semânticas (nunca `<div class="h1">`).
- Nenhuma imagem informativa sem `alt` (OptimizedImage exige `alt`; manter assim).
- **Nenhum schema sem conteúdo visível correspondente.** `FAQPage` só com FAQ real
  visível (`<details>`); `aggregateRating`/`Review` só com avaliações reais e atribuídas
  à fonte na página.
- Nenhum redirect sem documentação aqui.
- Validar sitemap e robots a cada deploy (CI já valida >=100 URLs no sitemap).
- Gate autoritativo de SEO: PSI em produção (não o Lighthouse local).

### Pendência da Etapa 6 (aguarda dados do cliente)

`aggregateRating` (5.0 / 65) está no `MedicalBusiness` global sem reviews visíveis =
self-serving (risco). Decisão aprovada: exibir avaliações REAIS do Google num marquee
premium (CSS, leve) com link para a fonte, legitimando o rating. Bloqueado até o cliente
fornecer: textos das avaliações + URL pública do perfil Google + nota/contagem reais.

## Regras de preservação

- **Identidade visual**: tokens CSS, paleta, tipografia — NÃO ALTERAR sem autorização
- **Copy aprovada**: textos de marketing, CTAs, descrições de profissionais — NÃO ALTERAR
- **Filosofia zero-dep**: nenhum import de npm em scripts client (runtime)
- **Semântica HTML**: landmarks, hierarquia de headings — verificar antes de qualquer refatoração
- **JSON-LD**: estrutura completa já implementada — só acrescentar, nunca remover

## Fluxo de desenvolvimento

```bash
# 1. Criar branch
git checkout main && git pull && git checkout -b claude/<etapa>-<descricao>

# 2. Desenvolver

# 3. Validar (tudo deve passar)
npm run check     # 0 erros TS
npm run lint      # 0 warnings
npm run build     # 102+ páginas

# 4. Commit, push, PR draft
git add <arquivos>
git commit -m "tipo: descrição curta"
git push -u origin claude/<etapa>-<descricao>
# Criar PR draft via mcp__github__create_pull_request
```

## Checklist antes de qualquer PR

- [ ] `npm run check` → 0 erros
- [ ] `npm run lint` → 0 warnings
- [ ] `npm run build` → 102+ páginas sem erro
- [ ] Identidade visual inalterada
- [ ] Conteúdo/copy inalterado
- [ ] JSON-LD não regredido
- [ ] Sem novos imports de npm em scripts client

## Variáveis de ambiente

Ver `ARCHITECTURE.md` e `.env.example` para a lista completa. Fallbacks garantem que o site funciona mesmo sem `.env` configurado.
