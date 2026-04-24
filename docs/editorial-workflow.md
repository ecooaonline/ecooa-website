# Workflow Editorial — Blog ecooa

Documento operacional para criação, revisão e publicação de conteúdo no blog. Alvo: **2 posts por semana** com rotação por categoria.

---

## Esquema do post

Cada post é um arquivo `.md` em `src/content/blog/`. O frontmatter é validado em `src/content.config.ts`:

```yaml
---
title: "Título do post"              # obrigatório
description: "Resumo em 1 frase."    # obrigatório, usado em meta + listagens
date: "2026-05-14"                   # obrigatório, formato YYYY-MM-DD
author: "Gustavo Gehrke"             # obrigatório, deve bater com src/data/blog-authors.ts
category: "medicina"                 # obrigatório: medicina | estetica | nutricao | saude-mental | longevidade | ecooa
tags: ["metabolismo", "hormônios"]   # obrigatório, array de strings
image: "/blog/post-slug.webp"        # opcional, OG + hero
highlight: "Frase de destaque."      # opcional, aparece no topo do post
lastModified: "2026-05-20"           # opcional, para sinalizar atualizações
draft: false                         # default false; true = oculto do site
---
```

### Regras não-negociáveis do projeto

- Idioma: português brasileiro sempre (acentos obrigatórios no conteúdo)
- Sem em-dash (—). Usar ponto ou vírgula
- Categoria **sem acento** (`nutricao`, não `nutrição`)
- Labels de navegação lowercase (decisão de marca)
- Valores de `category` do frontmatter devem estar no enum do schema

---

## Autores

Autores estão definidos em `src/data/blog-authors.ts`. O campo `author` do frontmatter precisa bater exatamente com o nome ali. Autores cadastrados atualmente:

- Gustavo Gehrke (médico generalista)
- Jessica Stein (nutricionista, co-fundadora)
- Larissa Wiebbelling
- Yale Jeronimo
- Manuela Vanti
- Maria Luísa Beltran
- Adriano Lenz
- Viviane Fagundes
- Giancarla Rochemback
- Danusa Pires

Se o autor não existir em `blog-authors.ts`, adicioná-lo lá antes de publicar.

---

## Categorias e rotação

Seis categorias, cada uma com objetivo estratégico:

| Categoria | Foco | Autoridade de | Cadência alvo |
|-----------|------|--------------|--------------|
| `medicina` | Metabolismo, hormônios, check-up, longevidade clínica | Gustavo + equipe médica | 1x/semana |
| `estetica` | Pele, cabelo, HOF, corpo | Equipe estética | 1x/2 semanas |
| `nutricao` | Emagrecimento, performance, nutrição comportamental | Jessica + equipe nutricional | 1x/semana |
| `saude-mental` | Ansiedade, burnout, TDAH, relacionamentos | Psicólogos | 1x/2 semanas |
| `longevidade` | Envelhecimento saudável, healthspan | Gustavo + longevidade | 1x/mês |
| `ecooa` | Institucional (cases, bastidores, novidades) | Time | Ocasional |

Balanceamento ideal por mês (8 posts): 3 medicina + 3 nutrição + 1 saúde mental ou estética + 1 longevidade ou ecooa.

---

## Processo de criação

### 1. Ideação

- Ideias surgem de: perguntas de pacientes, sazonalidade (janeiro = metabolismo, outubro = saúde mental), pesquisa de palavra-chave no Google Search Console, conteúdo de concorrentes (inspiração, nunca cópia)
- Registrar no `docs/content-calendar-template.md` na linha do mês correspondente
- Atribuir autor (profissional da área) e prazo

### 2. Redação

- Rascunho inicial pelo autor designado (médico/nutricionista/psicólogo) em Google Docs ou Markdown direto
- Tom: técnico mas acessível, humanizado, baseado em evidência
- Comprimento: 800-1500 palavras (artigos densos), 500-800 palavras (artigos curtos)
- Incluir ao menos 1 referência científica quando fizer claim clínico (PubMed, Cochrane, diretrizes brasileiras)
- Headings estruturados: h2 para seções principais, h3 para subseções

### 3. Revisão de Claims Médicos

Posts em `medicina`, `saude-mental`, `longevidade` passam por checagem de conformidade seguindo o método de auditoria já estabelecido no projeto (P0.1 do relatório técnico). Classificar cada claim:

- **VERDE**: afirmação baseada em diretrizes ou metanálises recentes, pode publicar
- **AMARELO**: afirmação sensível, precisa de citação explícita e moderação de linguagem
- **VERMELHO**: afirmação sem base ou com risco regulatório, remover

Responsável pela checagem: Gustavo (clínica) + Jessica (jurídico/nutrição) para temas nutricionais.

### 4. SEO checklist por post

Antes de marcar `draft: false`:

- [ ] Title de 50-65 caracteres, inclui keyword principal
- [ ] Description de 140-160 caracteres, inclui keyword e benefício
- [ ] Keyword primária no h1 e em pelo menos 1 h2
- [ ] Ao menos 2 links internos para páginas da ecooa (profissionais, especialidades, outros posts)
- [ ] Ao menos 1 link externo para fonte científica confiável
- [ ] Imagem hero otimizada (webp + avif, dimensões declaradas)
- [ ] Alt text descritivo em todas as imagens
- [ ] Slug curto e kebab-case (o nome do arquivo .md vira o slug)
- [ ] Tags relevantes para facetas de navegação

### 5. Publicação

```bash
# Branch nova por post
git checkout -b blog/slug-do-post

# Adicionar arquivo
# src/content/blog/slug-do-post.md

# Build local para validar schema
npm run build

# Se build falhar, ajustar frontmatter conforme mensagem de erro
# Se build passar, commit e push
git add src/content/blog/slug-do-post.md public/blog/slug-do-post.*
git commit -m "blog: adicionar post sobre [tema]"
git push -u origin blog/slug-do-post

# Abrir PR para main
# PR dispara Lighthouse CI automaticamente
# Após approve e merge: deploy automático para GitHub Pages
```

### 6. Pós-publicação

Seguir `docs/distribution-checklist.md` para distribuir o conteúdo.

---

## Estrutura de arquivos

```
src/content/blog/
  metabolismo-e-emagrecimento.md    ← post individual
  por-que-minha-tireoide.md
  ...

src/data/blog-authors.ts            ← metadata dos autores

public/blog/
  metabolismo-e-emagrecimento.webp  ← imagem hero (mesmo nome do slug)
  metabolismo-e-emagrecimento.avif
```

---

## Validação automática

A cada push em main que toca `src/content/blog/`, o workflow `.github/workflows/content-notify.yml` dispara e loga metadados dos novos posts. Isso serve como audit trail e ponto de extensão para notificações futuras (Slack, email).

O Astro valida o schema de frontmatter a cada build. Erros de validação aparecem como mensagem clara no terminal. Build falha se:

- Campo obrigatório ausente
- `category` fora do enum
- `tags` não é array
- `date` não é string

---

## Manutenção

Revisar este workflow a cada 3 meses (trimestral). Atualizar:

- Lista de autores conforme novos profissionais entram/saem
- Balanceamento de categorias conforme métricas de engajamento
- Cadência conforme capacidade operacional real
