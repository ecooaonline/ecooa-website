# DEPLOYMENT.md — Operação de build e deploy do ecooa-website

> Produzido pelo P03 (2026-06-12). Plataforma e decisões:
> [INFRASTRUCTURE.md](./INFRASTRUCTURE.md). Ambientes: [ENVIRONMENT.md](./ENVIRONMENT.md).

## 1-3. Instalar, rodar local, buildar

```bash
npm ci          # instala exatamente o lockfile (Node 22.12+, ver .nvmrc)
npm run dev     # dev server Astro
npm run build   # gera ./dist
npm run validate# format:check + astro check + eslint + build (gate local)
```

## 4. Validar o output (Contrato de Páginas — Lei 15)

Build deve produzir **103 páginas Astro** (= Contrato v2: 100 indexáveis no sitemap +
obrigado + offline + 404; +3 HTML de redirect legados). Conferência rápida:
`grep -c "<loc>" dist/sitemap-0.xml` → **100**. Divergência = incidente (Matriz P02).

## 5. Configurar a hospedagem (AÇÃO DO DONO — passo a passo)

> Antes de cada passo de painel, se a interface diferir do descrito, envie um print
> (Anti-padrão 5 do P00).

1. dash.cloudflare.com → **Workers & Pages → Create → Workers → Connect to Git**.
2. Selecionar `ecooaonline/ecooa-website`.
3. Nome do worker: **ecooa-website** (precisa bater com `wrangler.jsonc`).
4. Build command: `npm run build` · Deploy: detectado pelo `wrangler.jsonc`
   (assets `./dist`) · Root: `/`.
5. Build variables (opcionais — o build funciona sem elas pelos fallbacks):
   `PUBLIC_GTM_ID`, `PUBLIC_META_PIXEL_ID`, `FORM_ACTION` (ver `.env.example`).
6. Branch de produção: `main` · habilitar **non-production branch builds** (previews).
7. Salvar. O primeiro deploy ficará em `ecooa-website.<conta>.workers.dev` — isso **não
   afeta produção** (o domínio continua no GitHub Pages até o cutover).

## 6-9. Parâmetros oficiais

Build command `npm run build` · output `./dist` · root `/` · Node `22.12.0` (`.nvmrc`,
engines) · npm com `npm ci` · branch de produção **main** · previews por branch/PR
(workers.dev, comentadas no PR).

## 10. Cutover de produção (SOMENTE com autorização explícita do dono)

Pré-requisitos: smoke test do preview aprovado (checklist §11) + esta pergunta
respondida: **"Você autoriza a migração descrita (cutover do domínio para o Worker)?"**

1. [dono] Worker → Settings → **Domains & Routes → Add → Custom domain** →
   `www.somosecooa.com.br` (a CF substitui o DNS atual automaticamente).
2. [dono] Zona → Redirect Rules: criar apex→www 301 (mecanismo canônico — o
   `_redirects` do Worker NÃO faz apex→www, ver INFRASTRUCTURE §4). Zona → SSL/TLS:
   **Always Use HTTPS** ativo; modo **Full (strict)**.
3. [IA+dono] Validar produção: home 200, /agendamento 200, formulário→/obrigado,
   headers `content-encoding: br` em HTML, sitemap acessível, sem mixed content.
4. [dono] Rodar PSI (6 URLs) — baseline pós-migração.
5. [dono] GitHub → Settings → Pages → desativar (após 24-48h de estabilidade).
6. [dono] Vercel → desconectar projeto (DEC-16). 7. [IA] remover `public/CNAME` e
   workflow `deploy.yml` do GH Pages (PR própria, fase P8), atualizar docs-espelho.

## 11. Checklist pré-deploy (toda mudança)

`npm run validate` verde · sitemap = 100 · diff revisado · PR com CI verde.

## 12. Checklist pós-deploy (smoke test, preview ou produção)

Home/agendamento/obrigado/404 com status corretos · redirect apex→www · HTTPS forçado ·
contagem = Contrato · formulário NÃO gera lead real fora de produção sem marcação
(PROM-07; até lá, risco interino aceito) · preview com noindex (PROM-01; até lá,
verificar manualmente) · assets sem mixed content. Resultados colados no PR/relatório.

## 13. Variáveis por ambiente

Ver [ENVIRONMENT.md](./ENVIRONMENT.md) §3-5. Nunca valores reais em docs.
