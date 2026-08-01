# Baseline P07: Segurança técnica e LGPD

Auditoria de medição do estado ATUAL. Somente leitura, nenhum arquivo de
`deploy/`, `src-site-3/` ou `scripts/` foi alterado.

- Data da medição: 2026-08-01
- Alvo: `deploy/` servido em `http://localhost:4353` com a CSP de produção
- Auditor: agente Mythos P07 (baseline)
- Nota atribuída: **42/100**

A nota é baixa apesar de o artefato publicado ser limpo. O motivo está na
seção 9: o site é seguro por pobreza, não por engenharia. Todo controle
declarado no repositório é inerte, mais fraco do que o documento diz, ou
impossível de verificar de dentro do projeto.

---

## 1. Método

### Ferramentas e versões

| Ferramenta | Versão | Uso |
| --- | --- | --- |
| playwright-core | do `node_modules` do projeto | 50 carregamentos de página com captura de violação de CSP, erro de console, requisição de rede e estado de armazenamento |
| Chromium | 1194 (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) | motor dos carregamentos |
| curl 8.x | sistema | leitura de cabeçalhos HTTP e teste de exposição de arquivos |
| npm 10.9.7 | sistema | `npm audit --json` e `npm outdated --json` |
| Node 22.22.2 | sistema | parsing de `dados-ecooa.js`, contagem de hashes SHA-256 dos scripts inline |
| ripgrep | sistema | varredura de segredos, e-mails, CPF, CNPJ, endpoints |

### Servidores usados

1. `http://localhost:4353` (já em execução, `/tmp/csptest.py`): injeta a CSP
   **real de produção**, a que a regra do painel Cloudflare entrega hoje ao
   visitante. Foi a base de toda a medição de comportamento.
2. `http://localhost:4399` (criado nesta auditoria, derrubado ao fim): injeta a
   CSP **declarada em `deploy/_headers`** mais os quatro cabeçalhos extras do
   arquivo, para medir se a política do repositório quebraria o site caso um
   dia passasse a valer. Script em
   `/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/csp-headers-server.py`.

### Cobertura

- 31 URLs do `sitemap.xml` carregadas sob a CSP de produção. Seis retornaram
  404 no laboratório porque o `SimpleHTTPServer` não faz URL limpa (`/sobre`
  não resolve para `sobre.html`); foram recarregadas com extensão explícita,
  totalizando 39 carregamentos sob CSP de produção.
- 11 carregamentos adicionais sob a CSP do `_headers`.
- 63 arquivos HTML de `deploy/` varridos estaticamente.
- 5 páginas inspecionadas em runtime para cookie, `localStorage`,
  `sessionStorage`, scripts externos e `rel` de links `target="_blank"`.
- 1 teste de interação real no `ecooa.match`, digitando uma queixa clínica.

Saídas brutas em
`/tmp/claude-0/-home-user-ecooa-website/c124791a-4739-57eb-9519-83a1feaf8b01/scratchpad/`
(`csp-scan.json`, `csp-scan-hardened.json`, `audit.json`). Não foram copiadas
para o repositório, a fase é somente leitura.

---

## 2. As duas CSP: a que o repositório declara e a que o visitante recebe

### CSP de produção, medida

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
           https://*.clarity.ms https://*.google-analytics.com
           https://*.googletagmanager.com https://connect.facebook.net;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self'
```

### CSP declarada em `deploy/_headers`

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com
            https://*.analytics.google.com;
frame-src https://www.google.com https://maps.google.com https://www.googletagmanager.com;
form-action 'self' https://wa.me;
base-uri 'self';
object-src 'none';
frame-ancestors 'none'
```

### Diretiva por diretiva

| Diretiva | `_headers` (inerte) | Produção (real) | Consequência medida |
| --- | --- | --- | --- |
| `script-src` | 1 origem externa | **5 origens externas** | 4 origens a mais, nenhuma usada |
| `connect-src` | presente | **ausente**, cai para `'self'` | qualquer beacon de analytics seria bloqueado |
| `frame-src` | 3 origens | **ausente**, cai para `'self'` | nenhum iframe externo carrega |
| `form-action` | `'self' https://wa.me` | **ausente** | sem trava de destino de formulário |
| `base-uri` | `'self'` | **ausente** | injeção de `<base>` não é barrada |
| `object-src` | `'none'` | ausente, cai para `'self'` | equivalente na prática |
| `frame-ancestors` | `'none'` | **ausente** | site pode ser embutido em iframe de terceiro |
| `font-src` | `'self' data:` | `'self'` | irrelevante, o site não usa fonte web |
| `report-uri` / `report-to` | ausente | ausente | **nenhuma violação de CSP em produção é reportada a ninguém** |
| `upgrade-insecure-requests` | ausente | ausente | sem efeito prático, não há recurso `http://` |

### Outros cabeçalhos

`deploy/_headers` declara `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`
e `Cross-Origin-Opener-Policy: same-origin`.

Nenhum desses quatro pôde ser confirmado em produção. Ver seção 10, "o que não
foi possível medir". O que se sabe com certeza:

- O `_headers` é servido como **conteúdo estático**: `curl -o /dev/null -w '%{http_code} %{content_type} %{size_download}'`
  em `/_headers` devolve `200 application/octet-stream 1599`. Um arquivo de
  configuração que a plataforma consome não aparece como recurso público.
- Não existe `deploy/.nojekyll`, e `deploy.yml` publica via
  `actions/upload-pages-artifact` + `actions/deploy-pages`, que sobe a pasta
  como artefato pronto e não executa Jekyll. Ou seja, arquivos iniciados por
  `_` são servidos.
- `_headers` é convenção de Cloudflare Pages e Netlify. O GitHub Pages não tem
  equivalente. O próprio comentário no topo do arquivo admite isso, e
  `docs/ESTADO-REAL.md` seção 4 registra que "a CSP que hoje chega ao visitante
  é injetada por uma regra no painel da Cloudflare e não vem de `_headers`".
- Não há HSTS em lugar nenhum do repositório, nem no `_headers`.

**A política de segurança efetiva do domínio não está versionada, não está
documentada em detalhe e não pode ser revisada, testada nem revertida por
ninguém que trabalhe no repositório.**

### A CSP do `_headers` funcionaria

Medido: 11 páginas carregadas em `localhost:4399` sob a CSP declarada mais os
quatro cabeçalhos extras. **Zero violações de CSP, zero erros de console.** Não
existe obstáculo técnico para tornar o `_headers` efetivo. O bloqueio é
puramente operacional.

---

## 3. Terceiros: o que a CSP autoriza contra o que o site carrega

| Origem autorizada em `script-src` de produção | Aparece em algum HTML de `deploy/`? |
| --- | --- |
| `https://www.googletagmanager.com` | não |
| `https://*.googletagmanager.com` | não |
| `https://*.google-analytics.com` | não |
| `https://*.clarity.ms` | não |
| `https://connect.facebook.net` | não |

Evidências:

- `grep -ril 'GTM-\|gtag(\|clarity\|connect.facebook\|fbq('` em
  `deploy/`, `src-site-3/` e `scripts/`: **1 acerto, e é `scripts/medicao.mjs`**,
  que não foi aplicado ao `deploy/` atual.
- Em runtime, `typeof window.dataLayer` é `"undefined"` nas 5 páginas
  inspecionadas.
- Nos 39 carregamentos sob CSP de produção: **0 requisições para qualquer host
  diferente de `localhost`**. Os únicos hosts externos que aparecem no HTML são
  destinos de link (`https://wa.me`, `https://instagram.com`), não recursos.

Conclusão dupla, e as duas doem:

1. A CSP abre cinco origens de script de terceiros, incluindo o coringa
   `https://*.clarity.ms`, para carregar **nada**. É superfície de ataque pura,
   sem contrapartida.
2. O site **não mede nada**. Zero analytics, zero pixel, zero cookie. Isso é
   ótimo para privacidade e péssimo para o negócio, e está descrito em
   `docs/mythos/PENDENCIAS-DO-DONO.md` bloqueio 2.

### A camada de medição existe no repositório e não está no ar

`scripts/medicao.mjs` (236 linhas, commit `cc12ec3`) implementa Consent Mode v2
com tudo negado por padrão, aviso de consentimento e carregamento do GTM só
após gesto do visitante. Está na lista de pós-processadores de
`scripts/gerar-site.mjs` (linha 105).

Nada disso chegou ao `deploy/`: `grep -c 'data-medicao-ecooa' deploy/*.html`
devolve **0 em todas as 11 páginas**. `deploy/index.html` é de 11:37,
`scripts/medicao.mjs` é de 14:30. O site não foi regerado depois.

---

## 4. LGPD técnica

### O que foi medido, com número

| Item | Medida | Fonte |
| --- | --- | --- |
| Cookies definidos | **0** em 5 páginas, contexto do browser vazio | `storage-scan.mjs` |
| `localStorage` | **0** chaves | idem |
| `sessionStorage` | **0** chaves | idem |
| Banner de consentimento | **ausente** | inspeção do DOM |
| Requisições a terceiros | **0** em 39 carregamentos | `csp-scan.json` |
| Política de privacidade acessível | **sim**, `/politicas#privacidade`, linkada no rodapé das 11 páginas | grep no rodapé |
| Política indexável | **não**, `politicas.html` tem `noindex, follow` e está fora do `sitemap.xml` | grep |
| Encarregado (DPO) nomeado | **não** | leitura integral de `politicas.html` |
| Controladora identificada (razão social, CNPJ, endereço) | **não** na página publicada | idem |
| Canal de exercício de direitos | `ecooa.adm@gmail.com` | idem |

**O GTM não dispara antes do consentimento porque não existe GTM.** A ausência
de banner hoje não é infração: não há cookie nem tratamento por cookie a
consentir. Ela vira infração no minuto em que `medicao.mjs` for aplicado sem o
aviso ativo, e o gate do projeto já sabe disso (ver seção 6).

### O achado grave: queixa clínica embutida em URL de terceiro

O `ecooa.match` (`/qual-profissional-procurar`) tem um campo livre
`#ec-queixa`, com o placeholder "digite sua queixa, o procedimento que quer
conhecer ou uma palavra-chave".

Teste executado com Playwright, digitando
`queda de cabelo, ansiedade e insonia ha 6 meses`. O link de conversão gerado
na tela, decodificado:

```
https://wa.me/5551991460909?text=Olá! Usei o ecooa.match no site.
Escrevi no site: queda de cabelo, ansiedade e insonia ha 6 meses.
Qual profissional a equipe me indica para o meu caso?
```

Código correspondente em `deploy/qual-profissional-procurar.html`, linha 1615:

```js
var resumo = veioDeTexto ? 'Escrevi no site: ' + s.frase : ...
var waGeral = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Usei o ecooa.match no site. ' + resumo + ' ...');
```

E na linha 694, a mesma construção no ramo React pré-renderizado.

Três problemas somados:

1. `wa.me` é um redirecionador da Meta. A queixa de saúde vai na **query
   string** de uma requisição a um servidor da Meta antes de chegar ao
   WhatsApp. Dado pessoal sensível na acepção do art. 5, II da LGPD, tratado
   por terceiro, sem base legal declarada e sem aviso na tela.
2. A política publicada afirma o contrário, com todas as letras: "Não
   coletamos dados de saúde por meio deste site, e pedimos que informações
   clínicas não sejam enviadas por formulário ou por mensagem". O próprio site
   monta a mensagem com a informação clínica dentro.
3. `scripts/medicao.mjs` comentou a decisão certa ("o termo buscado no match É
   informação sensível, então ele NÃO é enviado"), mas essa regra vale para o
   `dataLayer`. Para o `wa.me` a frase segue indo inteira.

Atenuantes honestos: o texto não entra na URL da página (a barra de endereços
permanece limpa, verificado), não é gravado em `localStorage`, e o destinatário
final é a própria clínica. Isso reduz o dano, não o descaracteriza.

### Formulários

| Formulário | Campos | Destino | Dado sensível? |
| --- | --- | --- | --- |
| Newsletter do rodapé (11 páginas) | e-mail | `mailto:ecooa.adm@gmail.com` | não |
| Mentorias | nome, e-mail, classe profissional, mensagem | `wa.me` | não, é B2B |
| Sublocação | nome, e-mail, classe e registro, mensagem | `wa.me` | não, é B2B |
| `ecooa.match` | queixa em texto livre | `wa.me` | **sim** |

Nenhum formulário tem servidor. Nada é gravado. `google-apps-script.js` existe
no repositório com defesas boas (rate limit por IP, honeypot, time gate,
allowlist de tipo e de redirect, limite de 500 caracteres por campo), mas **o
site publicado não o usa**.

---

## 5. Segredos e dados pessoais no repositório

### Varredura de segredos

Padrões procurados em todo o repositório, fora de `node_modules` e `.git`:
`AIza…`, `AKIA…`, `sk-…`, `ghp_…`, `xox[baprs]-…`,
`-----BEGIN … PRIVATE KEY-----`, `Bearer …`.

**Zero acertos.** `.env` está no `.gitignore`; só `.env.example` é versionado,
com placeholders (`GTM-XXXXXXX`, `000000000000000`, `XXXXX`).

### O que ficou exposto assim mesmo

| Item | Onde | Avaliação |
| --- | --- | --- |
| Endpoint do Google Apps Script, em claro | `src/data/constants.ts:33` e `docs/_legacy/SKILL-MAXIMA-ECOOA.md:49` (`.../macros/s/AKfycbx3NOzVryn9prCJvKuBH20EFGiHoCENEZdR73zjaeiiUCl9PXk2sKrzGxrcrQ3ahQ-v`) | Web App publicado como "Execute as: Anyone", grava em planilha e dispara e-mail. Não é usado pelo site no ar, mas segue vivo. Se o repositório for público, é endpoint de escrita anônimo divulgado. |
| `ecooa.adm@gmail.com` | 253 ocorrências no repositório, 2 a 4 por página publicada, em texto claro | colhível por harvester, e é o canal de direitos LGPD |
| `+55 51 99146-0909` | 239 ocorrências em `deploy/` | é o canal comercial, exposição intencional |
| CNPJ `41.592.276/0001-93` | `src/components/Footer.astro:82` e `src/pages/politica-de-privacidade.astro:34` | dado público, e está no projeto Astro que não vai ao ar. A página publicada **não** identifica a controladora. |
| CPF ou RG | **zero acertos** | limpo |

### `deploy/dados-ecooa.js`

41 KB públicos, 31 profissionais. Campos: `slug`, `nome`, `primeiro`, `foto`,
`classe`, `grupo`, `marca`, `papel`, `registro`, `estado`, `area`, `esp`,
`bio`, `conduta`, `atendimento`.

Varredura por `telefone|celular|email|cpf|whats|instagram`: **zero acertos**.
Não há dado pessoal indevido. Número de conselho é dado público por definição.

Observação de risco regulatório, não de segurança: 10 dos 31 registros estão
publicados com estado `a-confirmar` (5) ou `a-adicionar` (5).

### Arquivos internos servidos publicamente

- `/_headers`: HTTP 200. Expõe a política de segurança pretendida e o
  comentário admitindo que ela é ignorada.
- `/LEIA-ME.md`: HTTP 200. Documento operacional interno que declara em texto
  corrido "A página de políticas é rascunho e precisa de revisão jurídica" e
  "Doze registros profissionais aguardam confirmação no conselho". Em nicho de
  saúde regulado, isso é munição pronta contra a clínica, servida no domínio
  dela.
- `/sw.js` e `/CNAME`: HTTP 200, esperado.
- Zero `.map`, zero `.DS_Store`, zero `.bak` em `deploy/` (125 arquivos
  varridos).

---

## 6. Service worker

`deploy/sw.js` (990 bytes) é um service worker de autodestruição: no `activate`
apaga todos os caches, chama `unregister()` e força `navigate()` em cada janela
aberta. O handler de `fetch` é vazio, ou seja, **nada é interceptado e nada é
servido de cache enquanto ele existe**.

Medições:

- Nenhuma página de `deploy/` chama `navigator.serviceWorker.register`.
  `grep -rn 'serviceWorker' deploy/`: zero acertos.
- Em runtime, `navigator.serviceWorker.getRegistrations()` devolve
  `regs=0` nas 39 páginas carregadas.

Risco residual, honesto e pequeno: quem ainda tiver o service worker antigo
instalado só recebe a versão de autodestruição quando o navegador buscar
`/sw.js` de novo. O `_headers` define `Cache-Control: no-cache, no-store` para
esse arquivo, e o `_headers` é inerte. Na prática os navegadores modernos
ignoram o cache HTTP do script do SW quando ele tem mais de 24 horas, então a
janela de exposição é limitada a um dia por visitante, não indefinida.

---

## 7. Dependências e cadeia de suprimentos

### `npm audit --json`

```
total de dependências: 500 (191 prod, 173 dev, 137 opcionais, 30 peer)
critical: 0 | high: 1 | moderate: 0 | low: 0 | info: 0
```

A única: `brace-expansion` 4.0.0 a 5.0.7, GHSA-mh99-v99m-4gvg, CWE-400/CWE-770,
CVSS 3.1 = **7.5**, negação de serviço por expansão sem limite. Transitiva, não
direta, `fixAvailable: true`.

Impacto real no site publicado: **nenhum**. `deploy/` é HTML estático e nenhuma
dependência npm é embarcada no que o visitante recebe. O impacto é sobre a
máquina de build.

Impacto real no processo: **o CI está vermelho**. `npm audit --audit-level=high`
sai com código 1 (verificado), e é passo bloqueante de `ci.yml`. Todo PR falha
nesse passo até a correção subir.

### Desatualizadas

`npm outdated --json`: 4 pacotes, todos de desenvolvimento.

| Pacote | Atual | Última | Distância |
| --- | --- | --- | --- |
| `typescript` | 6.0.3 | 7.0.2 | 1 major |
| `eslint-plugin-astro` | 3.0.1 | 1.7.0 | canal divergente |
| `@astrojs/check` | 0.9.9 | 0.9.10 | 1 patch |
| `lint-staged` | 17.2.0 | 17.3.0 | 1 minor |

Nenhuma delas com CVE aberto no `npm audit`.

### Automação de merge e deploy

- `.github/dependabot.yml`: configurado para npm e para GitHub Actions,
  semanal, com agrupamento. Bom.
- `.github/workflows/dependabot-automerge.yml`: **auto-merge de patch e minor
  sem revisão humana**.
- `.github/workflows/auto-merge.yml`: abre PR e habilita auto-merge para
  qualquer push em `claude/**`, com `contents: write` e
  `pull-requests: write`.
- `.github/workflows/deploy.yml`: publica em todo push para `main`, sem
  depender do job de qualidade.

Somados: código chega a produção sem olho humano. A blast radius é contida
porque o artefato publicado é a pasta `deploy/` versionada, que o npm não
altera, mas o caminho de aprovação automática existe.

Ações presas a **tags móveis**, não a SHA: `actions/checkout@v7`,
`actions/setup-node@v7`, `actions/upload-pages-artifact@v5`,
`actions/deploy-pages@v5`, `treosh/lighthouse-ci-action@v12`,
`dependabot/fetch-metadata@v3`. Duas delas são de terceiros.

### Nenhuma varredura de segredos no CI

`grep -rn 'gitleaks|trufflehog|semgrep|codeql|snyk' .github/`: zero acertos. O
único gate de segurança do pipeline é o `npm audit`.

---

## 8. Superfície de execução no cliente

Medido por varredura estática nos 63 arquivos HTML de `deploy/`:

| Vetor | Contagem | Leitura |
| --- | --- | --- |
| `eval(`, `new Function`, `document.write` | **0** | limpo, e foi o motivo da pré-renderização (P06) |
| Handlers inline `on*=` | **0** | a CSP poderia dispensar `unsafe-inline` para eventos |
| Blocos `<script>` inline | **204**, em **46 hashes SHA-256 distintos** | uma CSP por hash é viável hoje |
| `innerHTML` | 11 usos, **todos `innerHTML = ''`** | não há sink de escrita de HTML |
| `location.hash` como entrada | 5 usos | todos validados contra allowlist (`grupos.indexOf(h) >= 0`, `artigos.some(a => a.slug === h)`) |
| `atributos style=` inline | **3.531** | `style-src 'unsafe-inline'` é estrutural, só sai com reescrita |
| `target="_blank"` | 332 | **0 sem `rel="noopener"`** |
| Scripts com `src` externo | **0** | só `dados-ecooa.js`, local |
| Recursos `http://` | 0 | sem conteúdo misto |

Ou seja: `script-src 'unsafe-inline'` está ligado, mas não há hoje um caminho
conhecido de injeção que o explore. O risco é estrutural, não ativo. E é
removível: 46 hashes resolvem, ou um nonce por resposta quando a origem passar
a ser um Worker.

---

## 9. Tabela de achados por severidade

| # | Severidade | Achado | Evidência |
| --- | --- | --- | --- |
| 1 | crítico | `deploy/_headers` é inerte no GitHub Pages e a CSP efetiva vem de uma regra de painel Cloudflare fora do controle do repositório. As duas divergem em 7 diretivas | `/_headers` servido como conteúdo (200, 1599 B); CSP medida em `localhost:4353` ≠ arquivo; `ESTADO-REAL.md` §4 |
| 2 | crítico | Queixa clínica em texto livre embutida em URL `wa.me` (Meta), contrariando a política publicada, que afirma não coletar dado de saúde | teste Playwright em `/qual-profissional-procurar`; `qual-profissional-procurar.html:694` e `:1615`; `politicas.html` seção "o que não fazemos" |
| 3 | alto | CSP de produção sem `frame-ancestors` e sem `X-Frame-Options`. O site pode ser embutido em iframe de terceiro. A única conversão é um clique de WhatsApp | CSP medida por `curl -D -` |
| 4 | alto | CSP autoriza 5 origens de script de terceiros que nenhuma das 63 páginas usa, incluindo o coringa `https://*.clarity.ms` e `connect.facebook.net` | 0 requisições externas em 39 carregamentos; `window.dataLayer === undefined` |
| 5 | alto | Gate `scripts/validate-output.mjs` falha com 14 violações, duas de LGPD e medição: "sem camada de medicao" nas 11 páginas e "Consent Mode sem analytics_storage negado por padrao" | execução do gate, `EXIT=1` |
| 6 | alto | `deploy.yml` roda `validate-output.mjs`, que exige `dist/`, e o workflow nunca gera `dist/` (é gitignored e não há passo de build). O passo aborta com "dist/ nao existe" antes de avaliar qualquer coisa: a publicação está travada | `deploy.yml` sem passo de build; `validate-output.mjs:18,26-29` |
| 7 | alto | Nenhum `report-uri` nem `report-to` na CSP. Nenhuma violação em produção é reportada a ninguém, em nenhum dos dois arquivos de política | CSP medida e `_headers` |
| 8 | alto | Endpoint do Google Apps Script (Web App "Execute as: Anyone") commitado em claro em 2 arquivos | `src/data/constants.ts:33`, `docs/_legacy/SKILL-MAXIMA-ECOOA.md:49` |
| 9 | alto | Nenhuma varredura de segredos no CI. O único gate de segurança é `npm audit` | `grep` por gitleaks/trufflehog/semgrep/codeql/snyk em `.github/`: zero |
| 10 | médio | `deploy/LEIA-ME.md` servido publicamente, declarando que a página de políticas é rascunho sem revisão jurídica e que registros profissionais aguardam confirmação | `curl` em `/LEIA-ME.md`: HTTP 200 |
| 11 | médio | `deploy/_headers` servido publicamente, expondo a política de segurança pretendida | `curl` em `/_headers`: 200, `application/octet-stream`, 1599 B |
| 12 | médio | Política publicada não identifica a controladora (razão social, CNPJ, endereço) nem nomeia encarregado. O canal de direitos LGPD é um Gmail | leitura integral de `politicas.html` |
| 13 | médio | Política descreve "cookies de medição" que não existem. Zero cookie, zero `localStorage`, zero `sessionStorage` medidos | `storage-scan.mjs` em 5 páginas + `context.cookies()` vazio |
| 14 | médio | `npm audit`: 1 vulnerabilidade high (`brace-expansion`, CVSS 7.5, GHSA-mh99-v99m-4gvg) com correção disponível. `npm audit --audit-level=high` sai 1 e é passo bloqueante do CI | `audit.json` |
| 15 | médio | Auto-merge sem revisão humana para `claude/**` e para patch/minor do Dependabot, com `deploy.yml` publicando em push para `main` | `auto-merge.yml`, `dependabot-automerge.yml`, `deploy.yml` |
| 16 | médio | 6 GitHub Actions presas a tags móveis, 2 delas de terceiros (`treosh/lighthouse-ci-action@v12`, `dependabot/fetch-metadata@v3`) | leitura dos 5 workflows |
| 17 | médio | HSTS ausente do repositório inteiro, inclusive do `_headers` | `grep` por `Strict-Transport-Security`: zero |
| 18 | médio | CSP de produção sem `connect-src`, `form-action` e `base-uri`. Quando a medição entrar, o GTM carrega e nenhum beacon sai | comparação diretiva a diretiva, seção 2 |
| 19 | baixo | `script-src 'unsafe-inline'` sem nonce nem hash, com 204 blocos inline. Sem sink de injeção conhecido hoje (0 `eval`, 0 `document.write`, 0 handler inline, `innerHTML` só vazio, `location.hash` validado) | varredura estática dos 63 HTML |
| 20 | baixo | `img-src ... https:` aceita imagem de qualquer origem HTTPS, vetor de pixel de rastreamento se houver injeção | CSP medida |
| 21 | baixo | `sw.js` de autodestruição correto, mas seu `Cache-Control: no-cache` está no `_headers` inerte. Janela de exposição a versão velha limitada a 24 h por visitante, pelo comportamento padrão dos navegadores | `deploy/sw.js`; `regs=0` em 39 páginas |
| 22 | baixo | Sem `/.well-known/security.txt` | `ls deploy/.well-known`: não existe |

### O que está bom, medido

Não é elogio, é linha de base para não regredir:

- Zero violações de CSP em 50 carregamentos, sob as duas políticas.
- Zero requisições a terceiros. Zero cookie. Zero armazenamento local.
- Zero `eval`, `new Function` ou `document.write` nas 63 páginas.
- 332 links `target="_blank"`, **0** sem `rel="noopener"`.
- Zero segredo de chave, token ou senha no repositório. `.env` ignorado.
- Zero CPF, zero telefone individual, zero e-mail individual em
  `dados-ecooa.js`.
- Uma única vulnerabilidade em 500 dependências, e ela não alcança o visitante.
- Dependabot configurado para npm e para Actions.

---

## 10. O que não foi possível medir, e por quê

| Item | Por quê |
| --- | --- |
| Presença real de `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` e HSTS no domínio | `www.somosecooa.com.br` não é alcançável deste ambiente (proxy 403). O laboratório injeta apenas a CSP. A inferência da seção 2 é forte, mas é inferência: só um `curl -I` no domínio, ou o painel Cloudflare, decide |
| Regra de CSP do painel Cloudflare: quem criou, quando, com que escopo, se há outras regras | fica no painel, território do dono, sem acesso |
| Configuração de TLS, versão mínima, cifras, grade SSL Labs | domínio inalcançável |
| Se o endpoint do Google Apps Script ainda responde e com que permissão efetiva | requer requisição externa, bloqueada pelo proxy |
| Se o repositório `ecooaonline/ecooa-website` é público ou privado | o remote aponta para um proxy local (`http://local_proxy@127.0.0.1:41729/...`), não para o GitHub. Isso muda a severidade do achado 8 |
| Se `main` tem proteção de branch e revisão obrigatória | é configuração de repositório no GitHub, não arquivo |
| Se o GitHub Pages hoje serve com "Enforce HTTPS" e se a Cloudflare aplica HSTS no proxy | painel, sem acesso |
| Histórico do Git em busca de segredo já removido | varredura feita apenas na árvore de trabalho atual; `git log -p` completo não foi processado |
| Comportamento sob CSP real do `frame-src` para o mapa de `/localizacao` | não existe mais iframe nenhum em `deploy/` (`grep -c '<iframe'` devolve 0 em todas as páginas), então a pendência 1 de `ESTADO-REAL.md` §5 perdeu o objeto |

---

## 11. Justificativa da nota: 42/100

O artefato publicado é limpo, e isso foi medido, não suposto: zero terceiros,
zero cookie, zero `eval`, zero segredo, zero link sem `noopener`. Se a
avaliação parasse aí, a nota seria alta.

Ela não para aí, porque essa limpeza é consequência de o site não fazer nada,
não de haver engenharia de segurança. E a camada de engenharia, quando
inspecionada, está inteira no vermelho:

- O único arquivo de segurança do repositório não tem efeito na hospedagem
  atual, e a política que de fato roda é mais fraca em 7 diretivas, mora fora
  do controle de versão e não pode ser auditada de dentro do projeto.
- Não há `frame-ancestors`, não há HSTS, não há relatório de violação de CSP.
  O site não sabe, e não tem como saber, quando a própria política quebra.
- A CSP abre cinco origens de script de terceiros para carregar nada.
- O gate de saída do projeto falha com 14 violações, duas delas rotuladas pelo
  próprio código como LGPD, e o workflow de publicação sequer chega a executá-lo
  por falta de `dist/`.
- O gate de dependência do CI está vermelho por uma vulnerabilidade high com
  correção disponível.
- E o achado que mais pesa em clínica de saúde: a ferramenta de busca embute a
  queixa clínica digitada em uma URL da Meta, enquanto a política publicada no
  mesmo domínio afirma que dado de saúde não é coletado por este site.

Pela regra desta auditoria, um site que não mede, não rastreia e não valida não
tira nota alta. Aqui não se mede violação de CSP, não se rastreia se o
cabeçalho pretendido chegou ao visitante, e não se valida segredo no pipeline.
42 é o que sobra quando se desconta tudo que é declarado e não comprovado.
