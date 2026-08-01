# Baseline: Infraestrutura, CI/CD e DX

> Auditoria de estado ATUAL. Fase P03/P05/P08 da esteira Mythos.
> Data da medição: 2026-08-01. Commit auditado: `d132ae6` (= `origin/main`).
> Modo: somente leitura sobre o repositório real. Nenhum arquivo de `deploy/`,
> `src-site-3/` ou `scripts/` foi alterado por esta auditoria (verificado por
> manifesto MD5 ao final de cada etapa de medição: 157 arquivos, zero
> diferenças). Um processo concorrente alterou 13 arquivos às 15:39 e 15:41,
> depois de todas as medições; o caso está documentado na seção 10.1.

**Nota: 34/100.**

---

## 1. Método

Tudo abaixo foi medido, não estimado. Comandos e artefatos:

| O que | Como |
|---|---|
| Gates locais | `npx prettier --check .`, `npx eslint . --max-warnings 0`, `npx astro check`, `npm audit --audit-level=high`, `npm run build`, `npm run validate:output` |
| Teste do Clone Limpo | `git clone` para `/tmp/clone-teste`, `npm ci`, `node scripts/gerar-site.mjs`, comparação MD5 arquivo a arquivo |
| Integridade do repo real | manifesto `find deploy -type f -print0 \| sort -z \| xargs -0 md5sum` antes e depois de tudo |
| Workflows | leitura integral dos 5 arquivos de `.github/workflows/` e reexecução local dos comandos de cada gate |
| Histórico de quebras | `git log --diff-filter=D`, `git show <sha>:<arquivo>`, contagem de commits por janela |
| Cobertura do lint-staged | histograma de extensões alteradas nos últimos 40 commits, cruzado com os globs configurados |
| Dívida documental | contagem de docs que afirmam fatos contraditos por `docs/ESTADO-REAL.md`, e data do último commit de cada doc |
| Headers de produção | `curl -sSI http://localhost:4353/` comparado com `deploy/_headers` |

O laboratório em `http://localhost:4353` respondeu 200 em 1,3 ms. O domínio real
não é alcançável deste ambiente e a API do GitHub Actions também não (`gh`
indisponível), o que limita parte da verificação, registrada na seção 7.

---

## 2. Números medidos

| Medida | Valor |
|---|---|
| Workflows em `.github/workflows/` | 5 |
| Commits recentes que passaram por PR | **0 de 40** |
| Gates do `ci.yml` que estão vermelhos agora | **2 de 7** (`format:check`, `npm audit`) |
| Arquivos `scripts/*.mjs` fora do padrão Prettier | **10** |
| Vulnerabilidades altas em `npm audit` | **1** (`brace-expansion`, GHSA-mh99-v99m-4gvg, CVSS 7.5) |
| Commits publicados com o deploy travado | **25** (22 + 3, em duas quebras seguidas) |
| Scripts com caminho absoluto hardcoded | **23 de 30** |
| Scripts com `executablePath` do Chromium hardcoded | **5** |
| Reprodutibilidade de `deploy/` no clone (após correção dos caminhos) | **157/157 arquivos idênticos, 0 diferenças** |
| Tempo de `npm ci` em clone limpo | 11,7 s, exit 0, 390 pacotes |
| URLs medidas pelo Lighthouse que são stubs de redirect | **5 de 9** (454 a 529 bytes) |
| Rotas estratégicas fora da medição do Lighthouse | **6 de 9** |
| Arquivos HTML em `deploy/` cobertos pelo gate anti-runtime do deploy | **11 de 95** |
| Arquivos alterados cobertos pelo lint-staged (últimos 40 commits) | **99 de 454 (22%)** |
| Commits em que o lint-staged não casa nada | **9 de 40** |
| Documentos `.md` em `docs/` | 61 (43 na raiz, 9 em `_legacy`, 9 em `mythos/`) |
| Docs da raiz sem commit desde a chegada do site 3.0 | **39 de 43** |
| Docs que afirmam fatos contraditos pelo `ESTADO-REAL.md` | **16** |

---

## 3. O que cada workflow faz de verdade

### `ci.yml` (Quality Gates + Lighthouse)

Dispara em `pull_request` para `main` e em `workflow_dispatch`. **Não dispara em
push.** Sete passos no job `quality`: `npm ci`, `format:check`, `astro check`,
`lint`, `npm audit --audit-level=high`, `npm run build`, `npm run validate:output`,
mais um link check declaradamente não bloqueante.

Reexecutei cada passo localmente no commit auditado:

| Passo | Resultado local | Efeito no CI |
|---|---|---|
| `format:check` | **exit 1**, 10 arquivos | job morre aqui |
| `astro check` | exit 0 (0 erros, 34 hints) | passaria |
| `lint` | exit 0 | passaria |
| `npm audit --audit-level=high` | **exit 1**, 1 vulnerabilidade alta | mataria o job |
| `npm run build` | exit 0, 11 páginas na raiz | passaria |
| `npm run validate:output` | exit 0, nenhuma violação | passaria |

Ou seja: **qualquer PR aberto hoje falha no segundo passo.** E como o
`auto-merge.yml` só conclui quando os required checks passam, nada entraria por
PR mesmo que alguém tentasse.

O `validate-output.mjs` merece registro separado, porque é a peça boa do
conjunto: 400 linhas, 10 blocos, reescrito no P05 para o site que está no ar em
vez do Astro que não está. Ele valida contrato de páginas, retorno do runtime
removido, handlers de conversão, responsividade, canonical, promessas proibidas,
perfis, JSON-LD, consentimento, títulos únicos e acessibilidade estrutural. É
gate honesto. O problema não é ele, é onde ele roda.

### `deploy.yml` (GitHub Pages)

Dispara em push para `main`. Publica `deploy/` como está. Toda a validação do
artefato publicado são **6 `test -f` e 2 `grep`**. O `validate-output.mjs` não
roda aqui, por decisão registrada em comentário no próprio arquivo (o job não tem
`setup-node` nem `dist/`).

Como `ci.yml` não roda em push e 0 dos últimos 40 commits vieram por PR, a
consequência medida é direta: **o site publicado nos últimos 40 commits nunca
passou por gate de qualidade nenhum.** Passou por 6 testes de existência de
arquivo.

### `auto-merge.yml`

Push em `claude/**` abre PR e liga auto-merge squash. Tolerante a falha (avisa em
vez de quebrar). Na prática não foi exercitado: `origin/main` aponta exatamente
para o mesmo SHA do branch `claude/lighthouse-optimization-KemQJ`, sem commit de
squash e sem `(#NN)` em nenhum dos 40 títulos recentes. O fluxo desenhado foi
contornado por push direto.

### `dependabot-automerge.yml`

Existe `.github/dependabot.yml` bem configurado (npm + github-actions, semanal,
agrupado). O Dependabot funciona: 16 commits de bot no histórico, com `(#NN)`.
O auto-merge em si não pôde ser verificado (seção 7).

### `content-notify.yml`

Observa `src/content/blog/**.md`. Esse caminho pertence ao projeto Astro, que não
está publicado. Os 14 artigos que estão no ar nascem de `scripts/artigos.mjs` e
gravam em `deploy/blog/<slug>/`. **O workflow nunca dispara para o conteúdo
real.** É teatro puro, e ainda por cima aponta o leitor para
`docs/distribution-checklist.md` como próximo passo.

---

## 4. A quebra do deploy: gravidade

O enunciado pede avaliação da gravidade. Ela é maior do que o incidente isolado
sugere, porque **quebrou duas vezes seguidas, no mesmo arquivo, em 3 dias, e
ninguém percebeu.**

Linha do tempo reconstruída por `git log`:

| Quando | Commit | O que aconteceu |
|---|---|---|
| 2026-07-29 | `6532bb9` | `deploy.yml` passa a publicar o site 3.0 e exige `deploy/support.js`. O arquivo existia. Gate válido. |
| 2026-07-30 01:56 | `d181388` | P06 apaga `deploy/support.js` (3,3 MB de runtime morto). **Ninguém ajusta o workflow.** A partir daqui, `test -f deploy/support.js` falha em todo push. |
| 2026-07-30 a 2026-08-01 | 22 commits | Publicação congelada. Nada do que foi commitado chegou ao visitante. |
| 2026-08-01 | `fb6306a` | Primeiro conserto: tira `support.js` da lista, **e adiciona `node scripts/validate-output.mjs`** num job sem `setup-node` e sem `dist/`. O script aborta com "dist/ nao existe". **Quebrado de novo.** |
| 2026-08-01 | 3 commits | Publicação continua congelada. |
| 2026-08-01 | `9426147` | Segundo conserto: remove o passo que dependia de `dist/`. Simulado localmente agora: passa (exit 0). |

Total: **25 commits publicados no vazio**, incluindo correção de privacidade
(`79c5ac7`, queixa de saúde na URL) e correção de SEO (`890f1c8`, título
duplicado em 22 de 31 URLs). Correções de risco real ficaram fora do ar por não
haver aviso de que o deploy estava vermelho.

A causa raiz não é o arquivo `support.js`. É estrutural, e três características a
tornam recorrente:

1. **O gate depende de um fato que outra fase pode apagar sem saber.** O P06
   removeu um arquivo; o gate do P03 quebrou. Nada liga um ao outro.
2. **A falha é silenciosa.** Não há notificação, monitor de deploy, badge, nem
   smoke test pós-publicação. A única forma de descobrir era abrir a aba Actions.
3. **O conserto não foi validado antes de ir.** O `fb6306a` introduziu uma
   segunda quebra do mesmo tipo (passo que depende de artefato inexistente) e foi
   para `main` direto, sem PR e sem CI.

Existem outros gates do mesmo tipo, ainda vivos:

- `scripts/build-site.mjs` mantém a mesma lista de arquivos obrigatórios,
  duplicada à mão em relação ao `deploy.yml`. Duas listas, dois lugares, nenhuma
  fonte única. Divergem no próximo P que mexer em um só.
- O grep anti-runtime do `deploy.yml` varre `deploy/*.html`, ou seja **11 de 95
  arquivos HTML**. As 84 subpáginas (`/blog/<slug>/`, `/profissionais/<slug>/`,
  `/especialidades/<area>/`) ficam fora. Hoje nenhuma delas contém `support.js`
  (verificado: 0 ocorrências), então o buraco é latente, não ativo.
- `docs/QUALITY_GATES.md` declara **CodeQL como BLOQUEANTE**. Não existe workflow
  de CodeQL no repositório. Ou ele está ligado por default setup nas settings
  (não verificável daqui) ou é um gate declarado que não existe.

---

## 5. Teste do Clone Limpo

Executado de verdade, com o `deploy/` real protegido por manifesto MD5.

**Passo 1, `git clone` + `npm ci`:** passa. 11,7 s, exit 0, 390 pacotes, lockfile
íntegro, `husky` instalado pelo `prepare`. Dois avisos: `EBADENGINE` porque
`eslint-plugin-astro@3.0.1` exige `^22.22.3` e o `.nvmrc` fixa `22.12.0`; e
1 vulnerabilidade alta.

**Passo 2, `node scripts/gerar-site.mjs`: falha na forma padrão.** Não por erro de
execução, mas por algo pior. Medido:

```
23 de 30 scripts contêm: const RAIZ = '/home/user/ecooa-website';
```

O gerador não usa o diretório de onde é chamado. Ele escreve num caminho
absoluto. Rodar `node scripts/gerar-site.mjs` a partir de `/tmp/clone-teste`
**não gera o site do clone: sobrescreve o `deploy/` do repositório original.** Em
outra máquina, onde esse caminho não existe, quebra na primeira escrita. Não é
uma inconveniência de portabilidade, é um script que ignora seu próprio contexto.

Somam-se 5 scripts com `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`.
`playwright` e `sharp` **estão** declarados no `package.json` (commit `1c493b4`
corrigiu isso, e a afirmação do enunciado de que Playwright está ausente já não
vale). Mas `npm ci` não baixa navegador: não há `postinstall` com
`playwright install`, e `~/.cache/ms-playwright` não existe neste ambiente
(verificado). O pipeline só funciona porque `/opt/pw-browsers` existe aqui. Num
runner do GitHub, não existe.

**Passo 3, reprodutibilidade (após reapontar `RAIZ` para o clone via `sed` nos 23
arquivos):** este é o resultado bom da auditoria.

```
gerar-site.mjs exit 0
157 arquivos gerados
diff MD5 contra o deploy/ commitado: 0 linhas
git status --porcelain deploy: vazio
```

**O build é byte a byte reprodutível e idempotente**, incluindo as 31 marcas
d'água aplicadas por `sharp` e as 62 URLs do sitemap. Isso é raro e vale
registrar. Depois disso, `npm run build` (exit 0) e `npm run validate:output`
(exit 0, nenhuma violação) rodaram limpos no clone.

**Conclusão do teste:** o conteúdo é reprodutível; o *procedimento* não. Um
desenvolvedor novo que siga o README não consegue regenerar o site, e se tentar
num clone lado a lado, corrompe o outro checkout.

---

## 6. package.json, .nvmrc, husky e lint-staged

**Os scripts npm descrevem dois projetos e não avisam qual é qual:**

| Script | O que faz | Coerente com o site publicado? |
|---|---|---|
| `dev` | `astro dev` | não. Serve o projeto Astro que não está no ar |
| `preview` | `astro preview` | não |
| `check` / `typecheck` | `astro check` | não. Valida 113 arquivos do projeto morto |
| `build` | `node scripts/build-site.mjs` | sim, mas só copia `deploy/` para `dist/` |
| `build:astro` | `astro build` | projeto morto, explicitamente |
| (nenhum) | `node scripts/gerar-site.mjs` | **o gerador do site real não tem script npm** |

Isso significa que o comando mais importante do repositório, o único que
transforma `src-site-3/` em site, não aparece em `npm run`. E `npm run dev`,
o comando que qualquer recém-chegado digita primeiro, abre outro site.

**`.nvmrc` = `22.12.0`.** O `ci.yml` usa `node-version-file: .nvmrc`, ou seja o CI
roda numa versão que `eslint-plugin-astro@3.0.1` declara não suportar
(`^22.22.3 || ^24.16.0 || >=26.3.0`). Localmente rodamos `22.22.2`, que também
está fora. Nenhum dos dois é o valor fixado. A fixação de versão existe no papel
e não é respeitada por nada.

**Husky + lint-staged.** O `pre-commit` roda `npx lint-staged`. A configuração
cobre `*.{ts,tsx}`, `*.astro`, `scripts/*.mjs` e `*.{json,md,css}`. Medido nos
últimos 40 commits:

- **355 de 454 arquivos alterados (78%) não casam com nenhum glob.** O grosso é
  `.html` (329 arquivos, todos em `deploy/`), mais `.js`, `.yml`, `.xml`, `.webp`,
  `.svg`.
- **Em 9 de 40 commits (22,5%) o lint-staged não casa nada.** É exatamente daí
  que vem a mensagem "could not find any staged files matching configured tasks"
  que aparece a cada commit. Ela não é ruído: é o hook informando que não validou
  nada do que mudou.
- `scripts/*.mjs` entrou no lint-staged hoje (commit `cc12ec3`), e entrou só com
  `eslint --fix`, **sem `prettier --write`**. Essa é a causa direta e mecânica dos
  10 arquivos fora de formato que deixam o `format:check` do CI vermelho: o hook
  edita o arquivo com ESLint, ninguém formata, e o CI cobra formatação.

O `.prettierignore` exclui `deploy/` e `src-site-3/` por um motivo legítimo e bem
documentado (os placeholders `{{ }}` quebram se formatados). Mas o efeito líquido
é que o artefato publicado não tem nenhuma verificação de estilo ou sintaxe no
pré-commit.

---

## 7. Infraestrutura: onde a produção não é o repositório

`docs/INFRASTRUCTURE.md` declara Cloudflare Workers como plataforma oficial e
veta o GitHub Pages "por capacidade". `wrangler.jsonc` está pronto apontando para
`./deploy`. Mas o `deploy.yml` publica no GitHub Pages, e `deploy/CNAME` segura o
domínio. **A migração decidida no P03 não aconteceu.**

Consequência medida, e é séria: `deploy/_headers` traz CSP, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, `COOP` e o plano de cache. O próprio
arquivo admite no comentário que "no GitHub Pages o arquivo é ignorado". Comparei
o que o repositório declara com o que a produção serve (via laboratório):

| Diretiva | `deploy/_headers` (repositório) | Servida em produção |
|---|---|---|
| `script-src` | `'self' 'unsafe-inline' googletagmanager` | `'self' 'unsafe-inline' googletagmanager` **+ `*.clarity.ms`, `*.google-analytics.com`, `*.googletagmanager.com`, `connect.facebook.net`** |
| `frame-src` | `google.com`, `maps.google.com`, `googletagmanager` | **ausente** |

São políticas diferentes. A que chega ao visitante é mais permissiva em scripts
(quatro origens que o repositório nunca autorizou) e mais restritiva em frames
(sem `frame-src`, o mapa de `/localizacao` está bloqueado, o que confirma a
pendência 1 do `ESTADO-REAL.md`). Ela vem de uma regra no painel da Cloudflare,
fora do controle de versão, sem revisão, sem teste, e sem ninguém no repositório
sabendo quando muda. Um `git revert` não a alcança. O laboratório reproduz essa
regra, e não o `_headers` do repo.

**Ações do GitHub não são pinadas por SHA:** `actions/checkout@v7`,
`actions/setup-node@v7`, `actions/upload-pages-artifact@v5`,
`actions/deploy-pages@v5`, `treosh/lighthouse-ci-action@v12`,
`dependabot/fetch-metadata@v3`. Tags móveis num repositório que concede
`contents: write`, `pages: write`, `id-token: write` e faz auto-merge automático.
O Dependabot atualiza essas tags semanalmente e o `dependabot-automerge.yml`
mergeia minor/patch sozinho.

**Sem `CODEOWNERS`, sem template de PR.** Branch protection não é verificável
daqui, mas o histórico responde na prática: 0 de 40 commits por PR indica que ou
não existe, ou não é exigida.

---

## 8. Lighthouse: o gate aponta para páginas vazias

`lighthouserc.json` declara LCP e CLS como `error`, portanto bloqueantes. Medi o
que as 9 URLs são de fato em `dist/`:

| URL | Tamanho | É página real? |
|---|---|---|
| `/index.html` | 179.422 B | sim |
| `/profissionais/index.html` | 186.260 B | sim |
| `/blog/index.html` | 105.994 B | sim |
| `/profissionais/gustavo-gehrke/index.html` | 98.453 B | sim |
| `/ecooa-med/index.html` | 469 B | **não, stub "Página movida"** |
| `/ecooa-esthetic/index.html` | 469 B | **não, stub** |
| `/match/index.html` | 529 B | **não, stub** |
| `/contato/index.html` | 454 B | **não, stub** |
| `/agendamento/index.html` | 454 B | **não, stub** |

**5 de 9 slots medem redirects em meta refresh de meio kilobyte.** E as rotas que
importam ficaram de fora: `/sobre`, `/especialidades`,
`/qual-profissional-procurar`, `/localizacao`, `/mentorias`, `/sublocacao`. Seis
das nove rotas estratégicas do contrato não são medidas por nada.

A lista de URLs nunca foi migrada do projeto Astro. `/match/`, `/contato/` e
`/agendamento/` são rotas antigas, exatamente as que o `ESTADO-REAL.md` §6 manda
desconsiderar. O gate sobreviveu à troca de site sem que ninguém olhasse para o
que ele aponta.

---

## 9. Documentação: dívida medida

61 arquivos `.md` em `docs/`. Recorte da raiz (43 arquivos):

- **39 de 43 não recebem commit desde antes de 2026-07-29**, data em que o site
  3.0 passou a ser publicado.
- **16 documentos afirmam fatos que o `ESTADO-REAL.md` desmente**: contagem de
  103/104 páginas, `sitemap-0.xml`, `src/data/constants.ts` como fonte única de
  contato, rotas `/quem-somos/`, `/contato/`, `/agendamento/`, `/match/`.

Nos documentos da minha dimensão, especificamente:

| Documento | O que declara | Realidade medida |
|---|---|---|
| `QUALITY_GATES.md` | Build gate = `astro build`, 103 páginas | `npm run build` copia `deploy/`, 11 páginas na raiz |
| `QUALITY_GATES.md` | Contrato = 12 rotas em `sitemap-0.xml`, piso 95 | script atual: 9 rotas, `sitemap.xml`, piso 62 |
| `QUALITY_GATES.md` / `CI_CD.md` | CodeQL BLOQUEANTE | nenhum workflow de CodeQL no repositório |
| `CI_CD.md` | `ci.yml` é required check | 0 de 40 commits passaram por PR |
| `DEPLOYMENT.md` | `grep -c "<loc>" dist/sitemap-0.xml` → 100 | arquivo não existe; `sitemap.xml` tem 62 |
| `ROLLBACK.md` | 15 cenários de rollback em Cloudflare Workers | produção é GitHub Pages; o runbook não se aplica |
| `ENVIRONMENT.md` | previews por branch em `workers.dev`, Vercel interino | nenhum preview existe; deploy é Pages |
| `README.md` | Astro 6, build de 103 páginas, `npm run dev` em :4321 | Astro 7.1.6 instalado; build de 11; `dev` abre o site morto |
| `CLAUDE.md` | "Astro 6" | Astro 7.1.6 |

O `ROLLBACK.md` é o caso mais perigoso da lista, porque é o documento que alguém
abre sob pressão, durante incidente. Ele instrui a abrir Deployments/Versions no
painel Cloudflare e reverter em segundos. Na plataforma que de fato serve o
domínio, esse caminho não existe.

O `ESTADO-REAL.md` faz o oposto e faz bem: é honesto, datado, explicita que
prevalece sobre os demais e lista o que deve ser desconsiderado. O problema é que
ele é 1 documento contra 39 desatualizados, e nenhum dos 39 tem aviso no topo.

---

## 10. Achados por severidade

| # | Sev. | Achado | Evidência |
|---|---|---|---|
| 1 | crítico | 0 de 40 commits por PR; `ci.yml` só roda em `pull_request`. Todo o pipeline de qualidade foi pulado 40 vezes | `git log -40 --format=%s \| grep -cE '\(#[0-9]+\)$'` = 0; `ci.yml` sem gatilho `push` |
| 2 | crítico | CI está vermelho agora: `format:check` exit 1 (10 arquivos) e `npm audit --audit-level=high` exit 1 | reexecução local dos dois passos |
| 3 | crítico | Deploy quebrou 2x em 3 dias e ficou 25 commits congelado, sem alerta | `d181388` → `fb6306a` (22 commits), `fb6306a` → `9426147` (3 commits) |
| 4 | crítico | Clone Limpo não roda: 23 scripts hardcodam `/home/user/ecooa-website`; rodar de outro diretório sobrescreve o repo original | `grep -rl "/home/user/ecooa-website" scripts/` = 23 |
| 5 | alto | Deploy publica `deploy/` sem `validate:output`; validação = 6 `test -f` + 2 `grep` | `deploy.yml` job `build` |
| 6 | alto | Lighthouse bloqueante mede 5 stubs de redirect de 454 a 529 B; 6 das 9 rotas estratégicas fora | tamanhos em `dist/`, `lighthouserc.json` |
| 7 | alto | CSP de produção não vem do repositório e diverge dele: 4 origens de script a mais, `frame-src` ausente | `curl -sSI localhost:4353` vs `deploy/_headers` |
| 8 | alto | `gerar-site.mjs` não tem script npm, não roda em CI nenhum, nunca é exercitado pelo pipeline | `package.json` scripts; ausência em `ci.yml` e `deploy.yml` |
| 9 | alto | Chromium hardcoded em 5 scripts; `npm ci` não baixa navegador; sem `postinstall` | `~/.cache/ms-playwright` inexistente |
| 10 | alto | lint-staged cobre 22% dos arquivos alterados; `scripts/*.mjs` recebe eslint sem prettier, causa direta do CI vermelho | 99 de 454 arquivos; `lint-staged["scripts/*.mjs"] = ["eslint --fix"]` |
| 11 | médio | Gate anti-runtime do deploy varre 11 de 95 HTML | `deploy/*.html` não recorre em subdiretórios |
| 12 | médio | Lista de arquivos obrigatórios duplicada entre `deploy.yml` e `build-site.mjs`, sem fonte única | leitura dos dois arquivos |
| 13 | médio | `.nvmrc` 22.12.0 abaixo do exigido por `eslint-plugin-astro` (^22.22.3); CI usa `.nvmrc` | `EBADENGINE` no `npm ci` |
| 14 | médio | 6 actions em tags móveis, num repo com `contents: write` e auto-merge | `.github/workflows/*.yml` |
| 15 | médio | 39 de 43 docs da raiz desatualizados; 16 contraditos pelo `ESTADO-REAL.md`; `ROLLBACK.md` descreve plataforma que não é a de produção | contagem por `git log -1 --format=%ad` e grep cruzado |
| 16 | médio | README e CLAUDE.md dizem Astro 6 (é 7.1.6) e build de 103 páginas (é 11); `npm run dev` abre o projeto morto | `require('astro/package.json').version` |
| 17 | baixo | `content-notify.yml` observa `src/content/blog/**.md`, caminho que não gera o blog publicado. Nunca dispara | `on.push.paths` vs `scripts/artigos.mjs` |
| 18 | baixo | CodeQL declarado BLOQUEANTE em `QUALITY_GATES.md` sem workflow correspondente | `ls .github/workflows` |
| 19 | baixo | Sem `CODEOWNERS`, sem template de PR | `find . -name CODEOWNERS` vazio |
| 20 | alto | `deploy/` é ao mesmo tempo saída de build, entrada de build e artefato versionado, sem trava de concorrência. Observado ao vivo: escrita concorrente durante esta auditoria | seção 10.1 |

### 10.1 Escrita concorrente observada durante a auditoria

Registro obrigatório, porque aconteceu enquanto eu media. Às 15:26 o repositório
estava limpo (`git status --porcelain` vazio) e o manifesto MD5 de `deploy/`
batia com o commit. Às 15:41, sem nenhuma escrita minha, o mesmo manifesto
divergia:

```
 M deploy/404.html ... deploy/sublocacao.html   (11 arquivos, 973+ / 3958-)
 M scripts/conteudo-areas.mjs                   (+1094 linhas)
 M scripts/corpos-artigos.mjs                   (+583 linhas)
mtime: 2026-08-01 15:39:54 e 15:41:05
```

Outro processo estava regenerando o site no meio da auditoria. Isso não invalida
as medições desta dimensão (o Teste do Clone Limpo rodou antes, às 15:2x, com o
`deploy/` íntegro nos dois lados, verificado por manifesto), mas expõe um
problema estrutural que nenhuma leitura estática mostraria:

`deploy/` acumula três papéis incompatíveis ao mesmo tempo. É **saída** de
`gerar-site.mjs`, é **entrada** do mesmo script (que lê `deploy/dados-ecooa.js` e
`deploy/assets/` para montar a pasta temporária) e é **artefato versionado** no
git. Não existe lock, não existe diretório de trabalho isolado, e o build escreve
in place por caminho absoluto. Dois processos que rodem etapas do pipeline ao
mesmo tempo se sobrescrevem sem aviso, e o resultado é um `deploy/` que não
corresponde a nenhuma execução completa. O `deploy.yml` publicaria esse estado
intermediário sem detectar nada, porque seus 6 `test -f` continuam passando.

**Contraponto, medido e igualmente registrado:** `deploy/` é reprodutível byte a
byte e idempotente (157/157 arquivos idênticos); `npm ci` é limpo e rápido
(11,7 s); `validate-output.mjs` é um gate real e profundo, alinhado ao site que
está no ar; Dependabot está configurado e funcionando; `ESTADO-REAL.md` é honesto
e atual. A infraestrutura tem peças boas. O que falta é que elas estejam no
caminho por onde o código de fato passa.

---

## 11. O que não foi possível medir

1. **Se os workflows rodaram verdes no GitHub.** `gh` está indisponível e a API do
   Actions não é alcançável deste ambiente. A cronologia da quebra do deploy foi
   reconstruída por `git log` e por reexecução local dos gates, não por logs de
   execução. A conclusão de que 25 commits não publicaram é inferência forte
   (o comando falha deterministicamente com o arquivo ausente), não leitura de log.
2. **Se existe branch protection ou required checks.** É configuração de
   repositório, não arquivo. O indício de 0 PRs em 40 commits sugere ausência,
   mas não prova.
3. **Se o CodeQL default setup está ligado nas settings.** Só o painel responde.
4. **Se o `dependabot-automerge.yml` funciona.** Workflows disparados pelo
   Dependabot recebem `GITHUB_TOKEN` restrito por padrão, o que normalmente
   impede `gh pr merge --auto` sem PAT ou `pull_request_target`. Há 16 commits de
   bot mergeados, mas não dá para distinguir merge automático de merge manual sem
   os logs.
5. **Tempo real de build e de Lighthouse no runner.** Medi apenas localmente.
6. **Se a CSP servida pelo laboratório é literalmente a regra do painel
   Cloudflare.** Assumi conforme o enunciado e conforme `ESTADO-REAL.md` §4. O
   domínio real não é alcançável (proxy 403), então a produção não foi tocada.
7. **Se o deploy do commit `9426147` de fato publicou.** O gate foi simulado
   localmente e passa, mas a publicação em si não foi observada.
