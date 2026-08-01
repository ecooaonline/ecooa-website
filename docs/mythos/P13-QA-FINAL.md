# P13 · QA final e observabilidade

> Tribunal independente. Auditoria somente leitura, sem alterar `deploy/`,
> `src-site-3/` nem `scripts/`. Executada em 2026-08-01.
>
> Regra adotada: declaração sem prova é achado, não crédito. Toda afirmação dos
> documentos foi confrontada com o arquivo ou com o navegador. Onde a prova
> confirmou a afirmação, está registrado como confirmado. Onde não confirmou,
> está registrado como achado, com o comando e o trecho que sustentam.

---

## 1. Método

### 1.1 O artefato sob julgamento

O repositório estava sendo escrito **durante** esta auditoria. Às 16h07 e às
16h08 havia processos ativos (`node scripts/gerar-site.mjs`, `scripts/mobile.mjs`,
`monta-conteudo.mjs`) reescrevendo `deploy/`, e `origin/main` avançou três vezes
enquanto eu media. Medir um alvo móvel produz laudo sem valor.

Por isso congelei um snapshot e auditei sobre ele:

- **commit do snapshot: `2709a7b`** (`feat(conteudo): os 14 artigos com texto proprio`)
- 95 arquivos HTML, `deploy/` idêntico a `dist/` (md5 `7945f5f1...` nos dois)
- cópia congelada em `scratchpad/p13/snap/deploy`

Durante a geração, o estado intermediário de `deploy/index.html` regride para o
shell React antigo (166 KB, com `support.js` e `react-18.3.1.min.js`, sem `main`,
sem JSON-LD, sem medição). É transitório e a árvore volta ao correto ao fim da
cadeia, mas significa que **um commit disparado no meio da geração publicaria um
site quebrado**. O gate de `deploy.yml` pegaria o `support.js` nas páginas da
raiz, e só nelas.

### 1.2 O instrumento precisou ser refeito

O laboratório indicado (`localhost:4353`, servido por `/tmp/csptest.py`) declara
no próprio comentário que injeta "a MESMA CSP que a Cloudflare aplica no
domínio". **Não injeta.** Comparado com `deploy/_headers`:

| Diretiva | `deploy/_headers` (produção) | `/tmp/csptest.py` (laboratório) |
| --- | --- | --- |
| `script-src` | `'self' 'unsafe-inline' googletagmanager` | acrescenta `*.clarity.ms`, `*.google-analytics.com`, `*.googletagmanager.com`, `connect.facebook.net` |
| `font-src` | `'self' data:` | `'self'` (sem `data:`) |
| `connect-src` | 4 origens | **ausente** |
| `frame-src` | google, maps, gtm | **ausente** |
| `form-action` | `'self' https://wa.me` | **ausente** |
| `base-uri`, `object-src`, `frame-ancestors` | definidos | **ausentes** |

O laboratório é mais permissivo em script e mais restritivo em conexão e frame.
Um defeito de CSP pode passar nele e quebrar em produção, e vice-versa. Como os
dez laudos de baseline foram medidos nesse instrumento, a evidência de CSP deles
não se sustenta.

Subi então meu próprio servidor (`scratchpad/p13/serv.py`, porta 4399) com a CSP
literal de `deploy/_headers`, os demais cabeçalhos do arquivo e resolução de URL
igual à do GitHub Pages (`/sobre` serve `sobre.html`, diretório serve
`index.html`, ausência serve `404.html` com status 404). Todas as medições
abaixo são desse servidor.

### 1.3 Ferramentas

Playwright com Chromium 1194, axe-core 4.12.1 (WCAG 2.0/2.1/2.2 A e AA),
Lighthouse (perfil celular), verificador de links próprio, e leitura direta dos
arquivos.

### 1.4 Correções de rumo na própria auditoria

Registro por honestidade de método, porque três resultados intermediários meus
estavam errados e teriam virado achado falso:

1. Medi as 11 páginas da raiz sem `main`, sem JSON-LD e sem medição. Era o
   estado intermediário da geração em curso, não o produto.
2. Meu verificador de links acusou 3.688 alvos quebrados. Era eu ignorando o
   `<base href="/">` presente em 56 páginas. Com a correção: **zero quebrados**.
3. Concluí que o modal de perfil abria vazio e sem foco. Eu estava clicando no
   botão errado. Pelo gatilho correto o modal funciona bem. O botão que eu
   cliquei, porém, está mesmo morto, e virou o achado A1.

---

## 2. O que foi verificado e está correto

Estes pontos foram testados e passaram. São crédito com prova.

### 2.1 As 21 rotas exigidas

9 rotas raiz, políticas, 404, 3 áreas, 3 artigos, 3 perfis e o índice de perfis,
todas em celular 390x844, com a CSP de produção:

| Verificação | Resultado |
| --- | --- |
| Status HTTP | 200 em 20 rotas; `404` real na rota inexistente |
| `h1` único | 21 de 21 |
| landmark `main` | 21 de 21 |
| imagens quebradas | **0** em 226 imagens |
| erros de console | **0** (o único registrado foi o 404 esperado da rota inexistente) |
| erros de JavaScript | **0** |
| violações de CSP | **0** |
| JSON-LD sintaticamente válido | 100% |
| `canonical` único e no domínio canônico | 21 de 21 |
| `og:title` | 21 de 21 |
| camada de medição | presente em 20; ausente só na 404 |

A página 404 devolve status 404 de verdade e traz `noindex`. `politicas` traz
`noindex` e está fora do sitemap, com a razão documentada no `robots.txt`.

### 2.2 Os formulários

Os três existem, validam e disparam evento. Testados com dados válidos e
`requestSubmit()` real:

- **mentorias** (`ec-nome`, `ec-mail`, `ec-classe`, `ec-prog`, `ec-msg`): monta
  a URL do WhatsApp com os cinco campos rotulados, troca o botão para "conversa
  aberta", atualiza o aviso e empurra `form_submit` no `dataLayer`.
- **sublocação** (`sb-*`): idem, com o texto próprio de sublocação de sala.
- **newsletter do rodapé** (`ec-news`): abre `mailto:` preenchido, preserva o
  e-mail digitado, atualiza botão e aviso.

Todos os campos têm rótulo associado. Ver a ressalva M1 sobre o destino.

### 2.3 O ecooa.match

Superfície mais bem construída do site.

- semântica de combobox correta: `role=combobox`, `aria-autocomplete=list`,
  `aria-expanded`, `aria-controls=ec-sugestoes-painel`;
- autocomplete responde ("queda de cabelo", "queda de cabelo pós-parto");
- entende a queixa e mostra o bloco ("queda de cabelo" → saúde capilar);
- resultado anunciado em região viva `aria-live=polite`;
- 5 indicados com CTA de WhatsApp personalizado por profissional;
- `?q=` funciona: `/qual-profissional-procurar?q=ansiedade` preenche o campo e
  resolve para saúde mental, e a busca feita entra na URL, tornando o resultado
  compartilhável;
- `match_resultado` entra no `dataLayer`.

**Privacidade confirmada com teste adversarial.** Digitei "dor de cabeca
constante ha tres semanas". A URL gerada contém apenas
`sobre dor de cabeça e enxaqueca`, que é o bloco editorial. A frase digitada
**não** aparece em nenhum dos CTAs. A afirmação do commit `79c5ac7` se sustenta.

### 2.4 Filtros

- `/profissionais`: 7 filtros, contagem batendo com o rótulo em todos
  (todos 31, medicina 5, nutrição 12, estética 9, fisioterapia 1, saúde mental 3,
  terapia integrativa 1) e `aria-pressed` exclusivo, um verdadeiro por vez.
- `/blog`: 8 filtros sobre 14 artigos (medicina 4, nutrição 2, tricologia 3,
  longevidade 1, saúde mental 2, estética 1, integrativa 1, soma 14).

### 2.5 Menu de celular

Abre, fecha, alterna `aria-expanded`, troca o rótulo entre "menu" e "fechar",
fecha no `Escape` e devolve o foco. Testado em 5 tipos de página (raiz, área,
artigo, perfil, listagem): íntegro nos 5, com 9 links no painel.

### 2.6 Modal de perfil, pelo gatilho correto

Pelos 31 botões `[data-perfil]` do mosaico o modal está bem feito:

- `role=dialog`, `aria-modal=true`, `aria-labelledby=pf-nome`;
- preenche nome, marca, bio, conduta, blocos com registro (`CRM-RS 35.822`),
  retrato e CTA de WhatsApp personalizado;
- `#pf-pagina` aponta corretamente para `profissionais/gustavo-gehrke/`;
- **move o foco para dentro do painel**, trava o scroll do documento,
  fecha no `Escape` e no botão `×`, e **devolve o foco ao elemento de origem**.

### 2.7 Links internos e recursos

Varredura sobre os 95 arquivos, 5.595 referências `href`/`src`, honrando o
`<base href="/">`:

- **alvos internos inexistentes: 0**
- âncoras `#id` apontando para id ausente: 0
- domínios externos: apenas `instagram.com`, `wa.me` e `www.google.com`. Nenhum
  CDN de terceiro.

### 2.8 Acessibilidade automatizada

axe-core em 11 páginas, celular: **0 críticas, 2 sérias, 0 moderadas, 0 leves**.
A única regra violada é `color-contrast`, com 2 nós, só na home.

### 2.9 Performance

Lighthouse celular, contra a CSP de produção:

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 99 | 96 | 96 | 100 | 0,9 s | 0 | 100 ms |
| Perfil (natalie-queiroz) | 98 | 100 | 96 | 100 | 2,1 s | 0 | 100 ms |

Melhor que o declarado no `SCORECARD-FINAL.md` (91 e 98). Os 96 em boas práticas
vêm de um único item, `errors-in-console`, cuja causa é
`ERR_TUNNEL_CONNECTION_FAILED` ao buscar `gtm.js`: é a ausência de internet
neste ambiente, não defeito do site.

### 2.10 Conformidade e privacidade

- Consent Mode v2 com `ad_storage`, `ad_user_data`, `ad_personalization` e
  `analytics_storage` em `denied` por padrão, `wait_for_update: 500`.
- Zero tag estática do GTM: o contêiner só entra por JavaScript, após gesto.
- Aviso de privacidade com "recusar" e "aceitar" lado a lado, mesmo peso, e
  escolha gravada em `localStorage` (`ecooa-consentimento=recusado`).
- **Zero `aggregateRating` e zero `Review`** em todo o `deploy/`.
- `MedicalClinic` na home com NAP idêntico ao publicado.

### 2.11 O gate

`npm run build && node scripts/validate-output.mjs` contra `dist/`: **passa,
saída 0, nenhuma violação**, em todas as 30 verificações. Reproduzido duas vezes.

### 2.12 Outras afirmações confirmadas

| Afirmação | Verificação |
| --- | --- |
| sitemap de 31 para 62 URLs | 62 `<loc>`, 62 únicas, sem `politicas` nem `404` |
| 31 páginas de perfil com conteúdo próprio | 31 presentes, mínimo de 437 palavras |
| cards de área linkam para o perfil | medicina 5, nutrição 12, tricologia 5 |
| `playwright` e `sharp` declarados | ambos em `devDependencies` |
| runtime morto não voltou | `support.js`, React e Babel: 0 ocorrências em HTML |
| páginas com `main` e link de pular | 67 cada, como declarado |
| páginas que medem audiência | 66, como declarado |

---

## 3. Achados

### A1 · Os 31 botões "ver perfil" de `/profissionais` não fazem nada

**Severidade: alto.**

O handler do modal, em `deploy/profissionais.html`, escuta só um seletor:

```js
var btn = e.target.closest && e.target.closest('[data-perfil]');
if (btn) { abrir(btn.getAttribute('data-perfil'), btn); return; }
```

Os 31 botões `[data-perfil]` são os retratos do mosaico. Os 31 botões dos cards,
rotulados "ver perfil", são outra coisa:

```html
<button data-dc-tpl="41" type="button" style="...">ver perfil</button>
```

Sem `data-perfil`, sem ancestral com `data-perfil`, sem `onclick`, sem
`aria-label`. Medido no navegador: `verPerfil: 31, ligados: 0`.

Com clique real de mouse, aviso de consentimento já dispensado e 900 ms de
espera: `{"modalAbriu":false,"urlMudou":"/profissionais"}`. O botão mais
explícito da página, aquele que promete pelo texto exatamente o que o visitante
quer, é inerte em 31 cards.

Agrava: as 31 páginas de perfil existem desde esta sessão. Esses botões são o
lugar óbvio para levar até elas, e não levam.

### A2 · O link "pular para o conteúdo" leva à home em 56 das 67 páginas

**Severidade: alto.**

56 páginas trazem `<base href="/">`. Com ele, `href="#conteudo"` deixa de ser
âncora da página e resolve para `https://www.somosecooa.com.br/#conteudo`.

Medido com Tab e Enter, que é exatamente o gesto de quem usa teclado:

```
== /especialidades/medicina/
   1o Tab foca: {"tag":"A","txt":"pular para o conteúdo"}
   URL antes : http://localhost:4399/especialidades/medicina/
   URL depois: http://localhost:4399/#conteudo   *** SAIU DA PAGINA ***
```

Mesmo resultado em `/blog/longevidade-saudavel/` e
`/profissionais/natalie-queiroz/`. Nas 11 páginas da raiz, que não têm `<base>`,
o link funciona.

O recurso de acessibilidade instalado nesta sessão, portanto, **joga o usuário
de teclado para fora da página em 56 das 67 páginas que o carregam**, incluindo
os 31 perfis, os 14 artigos e as 8 áreas.

O `validate-output.mjs` declara "ok link de pular para o conteudo em todas".
Ele confere a presença da string, não o comportamento. axe também não pega: é
um defeito de resolução de URL, não de marcação.

O mesmo `<base>` afeta `href="#profissionais"` nas 8 páginas de área, que
também sai da página. Os 64 `href="#"` remanescentes são inertes porque estão em
markup oculto, e não navegam.

### A3 · Dois documentos afirmam que a publicação roda o gate. Ela não roda

**Severidade: alto.**

`docs/mythos/EXECUCAO.md`, seção "Onda 0 · 1":

> "O gate agora confere o que de fato existe (...) e roda o `validate-output.mjs`
> **antes** de publicar."

`docs/mythos/PENDENCIAS-DO-DONO.md`, Bloqueio 1:

> "agora ele confere o que de fato existe na publicação e ainda roda o
> `validate-output.mjs` antes de subir."

`.github/workflows/deploy.yml` diz o contrário, no próprio comentário do arquivo:

> "O gate completo (scripts/validate-output.mjs) roda em ci.yml (...) Chamá-lo
> aqui, sem setup-node e sem dist/, reproduziria exatamente a falha que este
> arquivo acabou de corrigir."

O job de publicação faz seis `test -f` e dois `grep`. Não há `setup-node`, não
há `npm ci`, não há `validate:output`. A decisão técnica do workflow é
defensável; o problema é que os dois documentos entregues ao dono afirmam uma
rede de segurança que não existe.

Anexo: o `grep` do runtime morto usa `deploy/*.html`, que é glob raso. As 84
páginas em subdiretório (8 áreas, 14 artigos, 31 perfis e índices) ficam fora
dessa verificação.

### A4 · O CI, onde os invariantes moram, não roda no caminho que o código percorre

**Severidade: alto.**

`ci.yml` dispara em `pull_request` para `main` e em `workflow_dispatch`.
Não dispara em `push`.

Os commits desta sessão foram direto para `main`: `origin/main` avançou de
`e42c964` para `2709a7b` e depois `cd263a4` durante a auditoria, sem nenhum
merge commit no período.

Consequência: `format:check`, `astro check`, `lint`, `npm audit`,
`validate:output` e o Lighthouse CI **não executaram** para nenhuma entrega desta
sessão. O `SCORECARD-FINAL.md` credita "Invariantes travados no gate: 18 → 30" e
"Scripts do site sob análise estática: 0 de 17 → 17 de 17". Os invariantes
existem no script e o ESLint cobre os 17 arquivos, mas nada disso bloqueia o
caminho real, porque o gatilho não cobre o push direto.

Um gate que não roda no caminho usado não é gate, é documentação.

### M1 · Nenhum dos três formulários entrega o lead a um servidor

**Severidade: médio.**

Nenhuma referência a `script.google.com` em todo o `deploy/`, embora `CLAUDE.md`
e `docs/` declarem "Google Apps Script (formulários)" na stack.

O que os três fazem:

| Formulário | Destino | Depende de |
| --- | --- | --- |
| newsletter | `mailto:ecooa.adm@gmail.com` | cliente de e-mail configurado |
| mentorias | `https://wa.me/5551991460909?text=...` | app do WhatsApp e envio manual |
| sublocação | idem | idem |

Os três anunciam sucesso antes de qualquer confirmação de entrega: o botão vira
"e-mail aberto" ou "conversa aberta" e o aviso diz "Abrimos a conversa (...)
Basta enviar". Em celular sem app de e-mail o `mailto:` não faz nada visível e o
botão ainda assim diz "e-mail aberto". Se a pessoa fechar o WhatsApp sem enviar,
o lead se perde e nada registra.

É o falso sucesso que o próprio P04 manda eliminar. Não há captura de servidor,
nem log, nem retentativa, nem confirmação. O `dataLayer` registra a intenção
(`form_submit`), não a chegada.

### M2 · O laboratório oficial mede com uma CSP que não é a de produção

**Severidade: médio.** Detalhe completo em §1.2.

O arquivo declara injetar a CSP da Cloudflare e injeta outra, mais permissiva em
`script-src` e sem `connect-src`, `frame-src`, `form-action`, `base-uri`,
`object-src` e `frame-ancestors`. Os dez laudos de baseline usaram esse
instrumento. Refiz as medições com a CSP literal de `_headers` e o site passou
limpo, então o produto não sofre; o que cai é a força probatória dos laudos no
eixo de segurança.

### M3 · O modal morto viaja embarcado nas 31 páginas de perfil

**Severidade: médio.**

`EXECUCAO.md` afirma:

> "O modal de perfil, que era injetado nas 8 páginas de área e virou código
> morto, saiu de lá. Continua em `profissionais.html`."

Metade confirmada, metade não. Contagem sobre os 95 arquivos:

| | shell `#pf-ov` | script do modal | gatilhos `[data-perfil]` |
| --- | ---: | ---: | ---: |
| `index.html` | sim | sim | 31 |
| `profissionais.html` | sim | sim | 31 |
| `profissionais/index.html` | sim | sim | 31 |
| 31 páginas de perfil | sim | sim | **0** |

Saiu das 8 áreas e entrou nos 31 perfis novos. Em cada perfil viajam o HTML do
painel, o CSS e o handler completo, sem um único gatilho, mais dois `href="#"`
inertes.

### M4 · O resultado do ecooa.match não linka para nenhuma página de perfil

**Severidade: médio.**

Medido: 5 indicados, 5 CTAs de WhatsApp, `links para pagina de perfil: 0`.

É a tela de maior intenção do site. A pessoa descreveu a queixa, recebeu nomes,
e a única saída é abrir o WhatsApp. Não há como ler sobre quem foi indicado
antes de falar. Os 31 perfis criados nesta sessão, com conduta e queixas
atendidas, ficam fora justamente do momento em que mais serviriam.

### M5 · Títulos duplicados fora do escopo do gate, e 28 stubs indexáveis

**Severidade: médio.**

O gate declara "64 paginas, todos os titulos unicos" e o scorecard credita
"Páginas com título único: 42 de 64 → 64 de 64". Nos 95 arquivos publicados:

| Título | Ocorrências |
| --- | ---: |
| `Página movida · ecooa` | 16 |
| `Página movida` | 12 |
| `Editorial ecooa · textos sobre saúde...` | 2 (`blog.html`, `blog/index.html`) |
| `Especialidades · ecooa · ...` | 2 |
| `Profissionais · ecooa · 31 especialistas...` | 2 |

Os 28 stubs de redirecionamento têm `canonical` correto para o destino e
`meta refresh` mais `location.replace`, o que mitiga bem. Mas **nenhum tem
`noindex`** (só `politicas.html` e `404.html` têm) e nenhum tem meta description.
Os três pares índice/`.html` canonicalizam para a mesma URL, o que resolve.

O ponto não é catástrofe de SEO, é escopo: o gate mede 64 dos 95 arquivos e a
frase "todos os títulos únicos" descreve o recorte, não a publicação.

Anexo do mesmo tipo: o scorecard declara "Páginas com dado estruturado: 22 → 56".
Medi **65** arquivos com `application/ld+json`. O número entregue não reproduz.

### B1 · Aviso de consentimento sobrepõe elementos clicáveis

**Severidade: baixo.**

`position: fixed`, `z-index: 9998`, `transition: all`. No celular ocupa 366x142
px, **17% da altura da viewport**, e sobrepõe 4 elementos interativos; no
desktop, 3. Só desaparece após escolha, e não há botão de fechar (o que é
defensável em LGPD). O `transition: all` mantém o elemento em movimento
perpétuo para automação, o que travou meus cliques por 30 segundos e sugere
repintura contínua.

O comportamento de consentimento em si está correto e é um acerto.

### B2 · `lastmod` do sitemap congelado em 2026-07-31

**Severidade: baixo.** As 62 URLs trazem o mesmo `lastmod`, `2026-07-31`, embora
todo o conteúdo dos 14 artigos e das 8 áreas tenha sido reescrito em 2026-08-01.
O sinal enviado ao Google contradiz a mudança real.

### B3 · A 404 não mede e não tem descrição

**Severidade: baixo.** É a única das 21 rotas sem a camada de medição e sem
`meta name=description`. O `canonical` dela aponta para `/404`. Como carrega
`noindex`, o impacto é pequeno, mas perde-se a visibilidade sobre quantas
pessoas caem em rota inexistente, que é justamente o que uma 404 deveria contar.

### B4 · Documento citado como insumo não existe

**Severidade: baixo.** `PENDENCIAS-DO-DONO.md`, Bloqueio 5, cita
`docs/mythos/P17-TRIBUNAL-ETICA.md` como insumo para a revisão jurídica. O
arquivo não existe no momento desta auditoria. Única referência quebrada entre
documentos de `docs/mythos/`.

### B5 · O repositório foi reescrito durante o QA final

**Severidade: baixo, mas de governança.** Três processos de geração e três
avanços de `origin/main` durante a auditoria. Um QA final precisa de árvore
congelada; sem isso o laudo mede fantasmas. Contornei com snapshot, e registro
para que o encerramento da esteira tenha um ponto de corte declarado.

---

## 4. Tabela de achados por severidade

| # | Severidade | Achado | Corrigível por IA |
| --- | --- | --- | --- |
| A1 | alto | 31 botões "ver perfil" inertes em `/profissionais` | sim |
| A2 | alto | link de pular sai da página em 56 de 67 páginas | sim |
| A3 | alto | dois documentos afirmam gate na publicação que não existe | sim |
| A4 | alto | `ci.yml` não dispara em push para `main`, onde tudo foi entregue | sim |
| M1 | médio | nenhum formulário entrega lead a servidor; sucesso declarado sem confirmação | parcial |
| M2 | médio | laboratório serve CSP diferente da de produção | sim |
| M3 | médio | modal morto embarcado nas 31 páginas de perfil | sim |
| M4 | médio | resultado do match não linka para os 31 perfis | sim |
| M5 | médio | 30 títulos repetidos fora do escopo do gate; 28 stubs sem `noindex` | sim |
| B1 | baixo | aviso de consentimento sobrepõe elementos clicáveis | sim |
| B2 | baixo | `lastmod` do sitemap congelado em 2026-07-31 | sim |
| B3 | baixo | 404 sem medição e sem descrição | sim |
| B4 | baixo | `P17-TRIBUNAL-ETICA.md` citado e ausente | sim |
| B5 | baixo | repositório reescrito durante o QA final | não (processo) |

Nenhum achado é crítico. Nenhum expõe dado de paciente, nenhum viola CFM por
schema, nenhum quebra a publicação.

---

## 5. O que não foi possível verificar

1. **O domínio real.** `www.somosecooa.com.br` não é alcançável deste ambiente.
   Nada aqui prova o que está no ar, apenas o que o repositório produz.
2. **Cabeçalhos HTTP efetivos em produção.** O GitHub Pages ignora `_headers`.
   A CSP real vem de regra de painel Cloudflare, fora do repositório. Reproduzi a
   CSP declarada no arquivo; não sei se é a aplicada.
3. **Se o deploy de fato rodou.** A API do GitHub não é alcançável. Sei que o
   gatilho existe e que o gate corrigido passaria; não sei o estado das
   execuções, nem qual é a origem em `Settings > Pages`. Segue como Bloqueio 1.
4. **Chegada de lead ao destino.** Exige o WhatsApp e a caixa do dono. Verifiquei
   a montagem da URL e do `mailto:`, não a entrega.
5. **O GTM medindo.** Sem internet, `gtm.js` não carrega. Provei que o
   `dataLayer` recebe `whatsapp_click`, `form_submit` e `match_resultado`, e que
   o consentimento nega por padrão. Não provei que alguma tag dispara: o
   contêiner segue vazio até o Bloqueio 2 ser resolvido.
6. **Leitor de tela real.** axe cobre o automatizável. NVDA, VoiceOver e
   TalkBack exigem pessoa. Reforço que A2 é exatamente o tipo de defeito que só
   aparece no uso, e passou por gate e por axe sem ser notado.
7. **Correção clínica e regulatória do conteúdo.** As 14.582 palavras dos artigos
   e os textos das 8 áreas precisam de revisão de quem assina e de leitura
   jurídica. Fora do meu escopo e da minha competência.
8. **Cache e compressão.** Meu servidor, como o laboratório, não envia
   `Cache-Control` nem compressão. Os números de Lighthouse podem melhorar em
   produção com a Cloudflare, ou piorar sem ela.
9. **Os 31 perfis, um a um.** Testei 3 no navegador e os 31 por análise
   estática. Não abri os 31 em navegador.
10. **Regeneração idempotente.** Vi uma cadeia completa terminar com a árvore
    limpa, o que é bom sinal, mas não rodei o teste do clone limpo.

---

## 6. Veredito

**Aprovado com ressalvas, com reabertura pontual de P08 (CI/CD) e P09
(acessibilidade).**

O produto está bom e a maior parte do que os documentos afirmam se sustenta na
prova. Vinte e uma rotas sem um único erro de console, zero imagem quebrada,
zero link interno quebrado, zero violação de CSP contra a política real, JSON-LD
válido em tudo, axe com 2 nós sérios em 11 páginas, Lighthouse 98 e 99 em
celular, formulários e match e filtros e menu e modal funcionando, privacidade da
queixa clínica confirmada com teste adversarial, e Consent Mode negando por
padrão. Isso é execução séria, e o hábito de declarar a contaminação do método no
próprio scorecard é sinal de honestidade que merece registro.

O que impede aprovação limpa não é a qualidade do site, é a distância entre o
que foi declarado concluído e o que a prova mostra, em quatro pontos concretos:

- um recurso de acessibilidade entregue, certificado pelo gate e **quebrado em 56
  de 67 páginas** (A2);
- 31 botões que prometem exatamente o que o visitante quer e **não fazem nada**,
  numa rota raiz (A1);
- dois documentos afirmando ao dono uma **rede de segurança na publicação que o
  próprio workflow nega por escrito** (A3);
- e a esteira de qualidade inteira **desligada do caminho que o código percorreu**
  (A4), o que torna os "30 invariantes travados" verdadeiros no arquivo e inertes
  na prática.

A2 e A4 são os que mais pesam, por serem do mesmo tipo: o gate confirma a
presença do texto e não o funcionamento, e ninguém rodou o gate no caminho real.
Um QA que aceita "a string existe" como prova de "o recurso funciona" reproduz o
defeito que abriu esta sessão, quando um `test -f` quebrado travou a publicação
por várias etapas sem ninguém perceber.

Recomendo, antes de declarar a esteira concluída:

1. corrigir A2 trocando `href="#conteudo"` por um alvo absoluto por página, ou
   removendo o `<base>`, e **adicionar ao gate um teste que clique no link e
   verifique que a URL não mudou de página**;
2. ligar os 31 botões "ver perfil" à página de perfil correspondente (A1), que é
   melhor destino que o modal e resolve M4 de quebra;
3. corrigir o texto de `EXECUCAO.md` e `PENDENCIAS-DO-DONO.md` (A3);
4. acrescentar `push: branches: [main]` ao gatilho de `ci.yml` (A4);
5. alinhar `/tmp/csptest.py` a `deploy/_headers` (M2) antes de qualquer medição
   futura de segurança.

**Nota: 72 / 100.**

Produto perto de 90; verificação e veracidade documental perto de 55. A nota
final pesa os dois, porque numa esteira cujo princípio declarado é "medir antes,
mudar depois, medir de novo, e travar no gate", a qualidade da medição é parte
do entregável, não acessório dele.
