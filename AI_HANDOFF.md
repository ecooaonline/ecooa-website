# AI Handoff — ecooa-website

Documento para sincronizar contexto entre sessões de IA e entre as 9 etapas de recodificação.

## Estado atual do projeto (atualizar a cada etapa concluída)

| Etapa | Assunto                                         | Status       |
| ----- | ----------------------------------------------- | ------------ |
| 1     | Fundação e DX                                   | ✅ Concluída |
| 2     | Rede de testes (Playwright, axe, snapshot)      | Pendente     |
| 3     | Migração Cloudflare Pages                       | Pendente     |
| 4     | Segurança (CSP nonce, edge proxy FORM_ACTION)   | Pendente     |
| 5     | Performance e imagens (Astro Image nativo, LCP) | Pendente     |
| 6     | Acessibilidade WCAG AA+                         | Pendente     |
| 7     | PWA completa (ícones, screenshots, SW offline)  | Pendente     |
| 8     | Observabilidade (Sentry, uptime, RUM)           | Pendente     |
| 9     | Gate de qualidade Lighthouse 99+                | Pendente     |

## Meta do projeto

**99+ em todas as categorias Lighthouse** (Performance, Acessibilidade, Best Practices, SEO) com Core Web Vitals reais em verde. Sem maquiagem de nota — base técnica genuinamente sênior.

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
