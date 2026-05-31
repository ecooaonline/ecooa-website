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

## CI/CD — hardening concluído (PR #39)

Dimensão CI/CD elevada de 72 para faixa alta. Documentação operacional em `CI_CD.md`,
`ROLLBACK.md` e `RELEASE_CHECKLIST.md`.

O que mudou:

- **Fluxo seguro**: `auto-merge.yml` deixou de fazer `git push origin main` direto.
  Agora abre PR e habilita auto-merge squash; o merge só ocorre com o CI verde.
- **`main` protegida**: PR obrigatório, `Quality Gates` como required check, branches
  up-to-date, block force push, squash-only.
- **CI unificado** (`ci.yml`, em PR): format:check, astro check, lint, `npm audit
--audit-level=high`, build, validação de sitemap (>=100 URLs), link check
  (não-bloqueante), Lighthouse desktop+mobile.
- **Lighthouse é relatório, não gate** (`continue-on-error`). Roda contra servidor
  HTTP local, sem paridade com browser real, então `is-on-https`, `canonical`,
  `csp-xss` e timing de LCP falham por ruído. O gate autoritativo de
  performance/a11y/SEO é o PSI em produção (100/100/100/100).
- **Reprodutibilidade**: Node pinado em `.nvmrc` (22.12.0), usado por todos os workflows.
- **Scripts novos**: `typecheck`, `audit:deps`, `validate`.

Pendências de calibração futura (não bloqueiam a etapa):

- Re-apertar thresholds do LHCI para `error` após 2-3 runs estáveis.
- 5 vulnerabilidades `moderate` conhecidas (cadeia `yaml` via `@astrojs/check`, apenas
  devDependency, não vai para produção). `audit:deps` usa `--audit-level=high`, então
  não bloqueiam. Resolvem quando `@astrojs/check` atualizar a cadeia.

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
