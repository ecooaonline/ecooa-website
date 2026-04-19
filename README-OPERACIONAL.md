# ecooa.website — README OPERACIONAL

**Versão**: 1.0  
**Data**: 2026-04-19  
**Última atualização**: 2026-04-19

---

## VISÃO DO PROJETO

**O quê**: Site premium da ecooa (clínica multidisciplinar de saúde, estética, mente, nutrição).

**Por quê**: 
- Conversão de pacientes através de SEO + match inteligente
- Landing pages individuais para 30 profissionais
- Treinamento de bot de triagem (ecooa.match) via FAQ + case studies

**Para quem**:
- **Pacientes**: Descobrir profissional certo, agendar consulta
- **Profissionais**: Exibir credenciais, atrair pacientes qualificados
- **Operações**: Coletar dados (intake), gerar relatórios

**Como medimos sucesso**:
- Agendamentos via WhatsApp
- Submissões de formulário de contato
- Tempo médio em landing pages de profissional
- Rankings de SEO para keywords de longa cauda

---

## STACK TÉCNICO

### Frontend
- **Framework**: Astro 6.x (gerador estático)
- **Linguagem**: TypeScript (strict mode)
- **CSS**: Vanilla CSS (self-hosted, sem Tailwind/Bootstrap)
- **Fonts**: Self-hosted (nenhuma chamada externa)

### Backend / APIs
- **Formulários**: Google Apps Script (agendamento, contato)
- **Intake Profissional**: Google Forms + Google Sheets integrada
- **Analytics**: Google Tag Manager (GTM-TSR4GDMK) — carregado após user interaction
- **Meta Pixel**: Facebook/Instagram ads (ID: 795926643274151)

### Deployment
- **Host**: Vercel
- **Domain**: https://ecooa-website.vercel.app/ (também somosecooa.com.br)
- **CI/CD**: Vercel automático (push → deploy)

### Banco de Dados
- **Blog**: Content collection (src/content/blog/*.md) — markdown + frontmatter
- **Profissionais**: Dados centralizados (src/data/professionals.ts)
- **Operacional**: Google Sheets (formulários, intake)

---

## SETUP LOCAL

### Requisitos
- **Node.js**: >=22.12.0 (LTS, suporte até out/2026)
- **npm**: ^10.0.0
- **Git**: ^2.40.0

### Por que Node >=22.12.0?
- Suporte nativo a ES modules
- Built-in support para Node polyfills (não precisa webpack plugin)
- Performance de cold start melhorada (7% faster em Astro build)
- Astro 6 recomenda explicitamente essa versão

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/ecooaonline/ecooa-website.git
cd ecooa-website

# 2. Instalar dependências
npm install

# 3. Verificar versão Node
node --version  # deve ser >=22.12.0

# 4. Rodar dev server
npm run dev
# Acessar: http://localhost:3000

# 5. Build para produção
npm run build

# 6. Previsar build local
npm run preview
```

### Variáveis de Ambiente (Opcional)
Criar `.env.local` na raiz do projeto:

```env
# Google Analytics
PUBLIC_GTM_ID=GTM-TSR4GDMK

# Meta Pixel
PUBLIC_META_PIXEL_ID=795926643274151

# Formspree (se usar no futuro)
# PUBLIC_FORMSPREE_ID=xxx
```

**Nota**: A maioria das variáveis está hardcoded em `src/data/constants.ts` (seguro para frontend).

---

## ESTRUTURA DO PROJETO

```
ecooa-website/
├── src/
│   ├── components/          # Componentes reutilizáveis (.astro)
│   ├── content/
│   │   ├── blog/           # Artigos (markdown)
│   │   └── config.ts       # Schema de coleção
│   ├── data/
│   │   ├── professionals.ts  # Array com 30 profissionais
│   │   ├── match-intents.ts  # Intenções de busca (triagem)
│   │   └── constants.ts      # Variáveis globais
│   ├── layouts/
│   │   └── BaseLayout.astro  # Layout padrão (header, footer)
│   ├── pages/
│   │   ├── /                  # Homepage
│   │   ├── /quem-somos        # About
│   │   ├── /ecooa-med         # Pilar medicina
│   │   ├── /ecooa-esthetic    # Pilar estética
│   │   ├── /ecooa-mind        # Pilar saúde mental
│   │   ├── /ecooa-working     # Pilar nutrição
│   │   ├── /profissionais     # Lista + individual [slug]
│   │   ├── /match             # Triagem semântica
│   │   ├── /blog              # Lista + artigo [slug]
│   │   ├── /agendamento       # Formulário
│   │   ├── /contato           # Contato
│   │   ├── /mentorias         # Educação
│   │   ├── /politica-de-privacidade
│   │   ├── /rss.xml.ts        # Feed RSS
│   │   └── /feed.json.ts      # Feed JSON
│   └── styles/               # CSS global (components.css, responsive.css)
├── docs/                     # Documentação operacional
├── scripts/                  # Scripts auxiliares (build, deploy)
├── public/                   # Assets estáticos (imagens, fonts)
├── astro.config.mjs          # Configuração Astro
├── tsconfig.json             # TypeScript config
└── README.md                 # Este arquivo
```

---

## FLUXO DE CONTEÚDO DO BLOG

### Criar Novo Artigo

1. **Criar arquivo markdown**:
   ```bash
   touch src/content/blog/seu-titulo-do-artigo.md
   ```

2. **Preencher frontmatter**:
   ```yaml
   ---
   title: "Seu Título Aqui"
   description: "Resumo de 2-3 linhas para SEO"
   author: "Dr. Nome Sobrenome"  # Deve corresponder a professional.name
   date: 2026-04-19
   category: "medicina"  # SEM ACENTO: medicina, estetica, nutricao, saude-mental, longevidade, ecooa
   draft: false  # true = não publica
   ---
   ```

3. **Escrever conteúdo em markdown**:
   ```markdown
   # Heading 1
   
   Parágrafo introdutório.
   
   ## Heading 2
   
   Mais conteúdo.
   ```

4. **Validações automáticas** (rodar na publicação):
   - [ ] `category` sem acento (configurado em `src/content.config.ts`)
   - [ ] `author` existe em `src/data/professionals.ts`
   - [ ] `title` é único
   - [ ] `description` tem 120-160 caracteres (SEO ideal)

5. **Publicar**:
   ```bash
   git add src/content/blog/seu-titulo-do-artigo.md
   git commit -m "feat(blog): novo artigo - seu título"
   git push origin seu-branch
   ```

### URLs Geradas Automaticamente

- Lista: `/blog` (todas os artigos)
- Individual: `/blog/seu-titulo-do-artigo`
- Por categoria: `/blog/categoria/medicina` (a implementar em P1)

### Imagens no Blog

- Salvar em `public/blog/seu-slug/` 
- Usar path relativo: `![alt text](/blog/seu-slug/imagem.webp)`
- Usar WEBP/AVIF para performance

---

## FLUXO DE PUBLICAÇÃO DE PROFISSIONAL

### 1. Profissional Preenche Intake

**Formulário**: https://forms.gle/ZcUYDzhNcUsr5Hau5

**Campos coletados** (5 seções, 21 campos):
- Básicos: nome, registro, unidade, educação
- Prática clínica: especialidades, diferencial, áreas não servidas
- Landing page: descrição, frase inspiradora
- Match training: 3 queixas, 10 FAQs, critérios, caso clínico
- Preços: entrada, retorno, pacotes

### 2. Respostas Chegam em Google Sheets

Planilha integrada ao Forms com todas as 21 colunas.

### 3. Dev Processa Dados

```bash
# Exportar CSV do Sheets
# Salvar em: scripts/intake-responses.csv

# Rodar parsing
npx ts-node scripts/processIntakeResponses.ts

# Output: atualiza src/data/professionals.ts
```

### 4. Landing Page Atualiza Automaticamente

Arquivo: `src/pages/profissionais/[slug].astro`

Novas seções renderizadas:
- Credenciais & Formação
- Diferencial Clínico
- 10 Dúvidas Frequentes (interativo)
- Caso Clínico
- Valores & Agendamento

### 5. Deploy

```bash
git add src/data/professionals.ts
git commit -m "feat(intake): processar dados de {n} profissionais"
git push origin your-branch
# Vercel auto-deploys
```

---

## DEPLOY & ROLLBACK

### Deploy (Produção)

```bash
# 1. Verificar build local
npm run build  # Deve passar sem erros

# 2. Push para main (ou your-branch se usando)
git push origin main

# 3. Vercel faz auto-deploy
# Monitorar em: https://vercel.com/dashboard/projects

# 4. Verificar em staging/produção
# https://ecooa-website.vercel.app/
```

### Rollback (se algo quebrar)

```bash
# 1. Identificar commit anterior bom
git log --oneline | head -10

# 2. Reverter
git revert <commit-id>  # Cria novo commit de rollback
git push origin main

# 3. Vercel re-deploys com revert

# OU: Usar dashboard Vercel
# Vercel > Deployments > clique no anterior > "Promote to Production"
```

---

## CHECKLIST PRÉ-PUBLICAÇÃO

### SEO & Performance
- [ ] Título da página é único e contém keyword
- [ ] Meta description tem 120-160 caracteres
- [ ] Imagens têm alt text
- [ ] Imagens estão em WEBP/AVIF (< 100KB)
- [ ] Internal links para artigos relacionados
- [ ] Structured data (schema.org) válido

### Conformidade Médica
- [ ] Claims revistos por médico + jurídico
- [ ] Sem promessas de cura ou diagnóstico
- [ ] Disclaimer incluído onde necessário
- [ ] Campos de prova social com consentimento do paciente

### Conformidade LGPD
- [ ] Política de privacidade linkada em formulários
- [ ] Checkbox de consentimento presente
- [ ] Dados sensíveis não estão em constants.ts visível

### Performance
- [ ] Lighthouse score > 90 (rodar `npm run audit` em produção)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Funcionalidade
- [ ] Todos os links funcionam (interno + externo)
- [ ] Formulários submitem corretamente
- [ ] Mobile design validado
- [ ] Navegação por teclado funciona

---

## MATRIZ DE RESPONSÁVEIS

| Área | Responsável | Revisão |
|------|-------------|---------|
| **Conteúdo médico/claims** | Dr. Gustavo | Jessica (jurídico) |
| **Blog editorial** | [Nome] | Gustavo (revisor médico) |
| **Landing pages profissionais** | [Nome] | Jessica (jurídico) |
| **Desenvolvimento** | [Dev 1] | [Dev lead] |
| **Deploy & infraestrutura** | [Dev lead] | [CTO] |
| **Analytics & conversão** | [Marketing] | [Product] |
| **Conformidade LGPD** | Jessica | [DPO] |

---

## DECISÕES TÉCNICAS

### Node >=22.12.0
**Por quê**: Astro 6 + performance de build nativa, ES modules, sem polyfills.  
**Trade-off**: Exclui Node 20. Próxima revisão: out/2026 (quando LTS termina).

### Google Apps Script vs Formspree
**Por quê**: Integração direta com Google Sheets, mais barato, menos dependência externa.  
**Trade-off**: Ecooa fica responsável por compliance LGPD direto (não delegado).

### Astro vs Next.js
**Por quê**: Site estático, build rápido (2.4s), performance máxima, ZERO JavaScript desnecessário.  
**Trade-off**: SSR limitado (apenas em edge functions). Quando migrar: se precisar funções serverless pesadas.

---

## RENOVAÇÕES & MONITORAMENTO

| Item | Vence | Revisão |
|------|-------|---------|
| Node.js LTS | out/2026 | maio/2026 |
| Vercel contract | abr/2027 | abr/2026 |
| Google Forms API | Ongoing | maio/2026 |
| GTM container | Ongoing | maio/2026 |

---

## CONTATOS & ESCALAÇÃO

**Dúvidas sobre desenvolvimento**: [Dev lead email]  
**Dúvidas sobre conformidade**: Jessica (jurídico)  
**Dúvidas sobre conteúdo médico**: Dr. Gustavo (médico)  
**Dúvidas sobre deploy**: [DevOps/Tech lead]  
**Emergência (site fora)**: #tech-emergency no Slack

---

## LINKS ÚTEIS

- **Repositório**: https://github.com/ecooaonline/ecooa-website
- **Dashboard Vercel**: https://vercel.com/dashboard/projects
- **Google Apps Script**: https://script.google.com/...
- **Astro Docs**: https://docs.astro.build
- **TypeScript Config**: `tsconfig.json` (strict mode on)

---

## VERSIONAMENTO

- **README v1.0**: 2026-04-19 — Setup, estrutura, fluxo de blog + profissionais

---

**Próximas atualizações**: Adicionar seção de debugging, troubleshooting, e links para documentação técnica específica de cada módulo.
