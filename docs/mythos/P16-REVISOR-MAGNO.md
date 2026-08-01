# P16 · Revisor magno

> Tribunal independente sobre o **método** e a **execução** da sessão autônoma de
> 2026-08-01. Auditoria em modo somente leitura: nenhum arquivo de `deploy/`,
> `src-site-3/` ou `scripts/` foi alterado. As burlas de gate descritas aqui
> rodaram sobre uma cópia isolada em pasta temporária.
>
> Regra de trabalho: declaração sem prova é achado, não crédito. Cada afirmação
> dos documentos da sessão foi confrontada com o código, com o HTML publicado em
> `deploy/` ou com medição refeita.

---

## 1. Método da auditoria

O que foi feito, na ordem:

1. Leitura de `docs/mythos/EXECUCAO.md`, `PENDENCIAS-DO-DONO.md`,
   `SCORECARD-FINAL.md`, `docs/MYTHOS-ARQUITETURA.md`, `docs/ESTADO-REAL.md` e
   dos dez laudos de `docs/mythos/baseline/`.
2. Reconstrução do estado anterior num worktree em `6382b11`, o último commit
   antes de `fb6306a` (o primeiro commit da onda Mythos). Toda comparação
   "antes x depois" deste parecer usa esse par e o **mesmo método de medição nos
   dois lados**, para não repetir o erro de comparar régua diferente.
3. Execução dos gates reais: `npm run build`, `npm run validate:output`,
   `npm run lint`, `npm run check`, `npx prettier --check .`, e os comandos de
   shell do job `build` de `.github/workflows/deploy.yml`.
4. **Teste de burla dos invariantes**: cópia de `dist/` para pasta temporária,
   injeção deliberada de quatro violações que os documentos afirmam estar
   travadas, e nova execução do gate.
5. Remedição: Lighthouse 13.4.1 mobile na home e num perfil; axe-core 4.12.1 em
   oito páginas, com e sem as regras que não são WCAG; Playwright para o fluxo
   de consentimento, o fluxo do ecooa.match e a estrutura de landmarks.
6. Contagem independente dos números do placar (URLs, schema, CTAs, palavras,
   invariantes) diretamente sobre os arquivos.

---

## 2. O que a sessão entregou de verdade

Começo pelo crédito, porque ele é grande e é verificável.

| Afirmação | Verificação independente | Veredito |
| --- | --- | --- |
| Sitemap de 31 para 62 URLs | 62 `<loc>`, e **as 62 têm arquivo correspondente** em `deploy/` | confirmado |
| 31 páginas individuais de profissional | 31 diretórios em `deploy/profissionais/`, todos com `"@type":"Person"` | confirmado |
| Páginas com dado estruturado 22 para 56 | medido nos dois estados: 22 e 56 | confirmado |
| Fragmentos de template fora do ar | `Rodape.dc.html` e `Sobrancelha.dc.html` sumiram da raiz (13 para 11 HTML) | confirmado |
| Gate de publicação destravado | os seis `test -f` e os dois `grep` de `deploy.yml` passam hoje contra `deploy/` | confirmado |
| Título único | 64 páginas, zero repetição no escopo varrido | confirmado (com ressalva no item 19) |
| Queixa de saúde fora da URL do WhatsApp | busca "estou com depressão e pensamentos ruins" gera `?text=Olá! Usei o ecooa.match no site. Busquei por saúde mental.` | confirmado |
| Home mobile 91 / 96 / 100 / 100 | remedido: 91 / 96 / 100 / 100, LCP 3,4 s, CLS 0 | confirmado |
| Perfil mobile ~98 / 100 / 100 / 100 | remedido em Natálie: 99 / 100 / 100 / 100, LCP 2,1 s | confirmado |
| axe: 0 críticos, 2 graves | reproduzido exatamente com as regras WCAG | confirmado (escopo no item 11) |
| CSP ampliada só para o GTM | diff mínimo e cirúrgico: googletagmanager em `script-src`, `connect-src` e `frame-src`. Nada de curinga | confirmado, decisão boa |
| Zero promessa proibida no site | varri as 95 páginas com as nove expressões do guardião: zero achados | confirmado |
| Sem `aggregateRating`, sem `Review` | zero em todo `deploy/` | confirmado |
| 8 áreas triplicadas | mesma região medida nos dois estados: 311-641 para 1.498-1.749 palavras | confirmado |
| 12 artigos saíram do zero | 12 artigos passaram de ~118 para 1.228-1.369 palavras de corpo | confirmado |

A ordem de prioridade foi, no geral, **defensável**. Para "top1 em saúde, Porto
Alegre", os quatro maiores gargalos orgânicos eram: publicação travada,
inexistência de páginas por profissional, ausência da entidade local em schema e
conteúdo raso indexado. A sessão atacou os quatro. O maior fator isolado que
sobrou, o Perfil da Empresa no Google e as avaliações, está corretamente
classificado como impossível sem o dono. Não encontrei trabalho decorativo
relevante: mesmo a acessibilidade, que poderia ser cosmética, tem retorno em SEO
e em conversão aqui.

---

## 3. Achados

### 3.1 Achados altos

#### A1 · A esteira de qualidade está vermelha no primeiro passo, e por isso o gate principal nunca chega a rodar

Este é o mesmo defeito que a sessão se orgulha de ter descoberto, repetido numa
camada acima.

```
$ npx prettier --check .
[warn] scripts/acessibilidade.mjs
[warn] scripts/almanaque.mjs
[warn] scripts/areas.mjs
[warn] scripts/conteudo-areas.mjs
[warn] scripts/corpos-artigos.mjs
[warn] scripts/estruturados.mjs
[warn] scripts/match.mjs
[warn] scripts/menus.mjs
[warn] scripts/monta-conteudo.mjs
[warn] scripts/perfis.mjs
[warn] scripts/personaliza.mjs
[warn] scripts/validate-output.mjs
[warn] Code style issues found in 12 files.
$ echo $?
1
```

`ci.yml` roda, nesta ordem: `format:check`, `check`, `lint`, `audit`, `build`,
`validate:output`, e só então o job `lighthouse` (`needs: quality`). Com o
primeiro passo em vermelho, **nada depois dele executa**. O `validate-output.mjs`,
que é a peça central desta sessão, nunca chega a rodar em CI.

No estado anterior (`6382b11`) eram 3 arquivos fora de formato. A sessão editou
11 dos 12 e levou a conta a 12 sem nunca rodar `npm run validate`, que existe no
`package.json` justamente para isso.

Causa estrutural: o `lint-staged` do `package.json` aplica `eslint --fix` em
`scripts/*.mjs` mas **não** aplica `prettier --write` neles, enquanto o CI cobra
formatação desses mesmos arquivos. O gancho de pre-commit não tem como manter
verde o que o CI exige.

Agravante: `deploy.yml` dispara em `push` para `main` e **não depende** de
`ci.yml`, que só dispara em `pull_request` e `workflow_dispatch`. Ou seja, um
push direto em `main` publica o site sem que nenhum invariante do
`validate-output.mjs` tenha sido consultado.

Prova: `.github/workflows/ci.yml` linhas 3-6 e 30-49; `.github/workflows/deploy.yml`
linhas 3-6 e 38-41; `package.json` linhas 22 e 35-37.

#### A2 · Os invariantes de saúde, schema e medição só cobrem 11 das 64 páginas. Burlei quatro deles de uma vez

`scripts/validate-output.mjs` linha 31 monta o mapa `html` apenas com os arquivos
`.html` da **raiz** de `dist/`. As 53 páginas em subdiretório, que são exatamente
as que esta sessão criou ou reescreveu, ficam fora dos blocos 2, 3, 4, 5, 6, 8,
9 e 10.

Teste executado numa cópia isolada:

1. inseri num artigo publicado, dentro do `<main>`:
   `Resultados garantidos e cura garantida, a melhor clinica de Porto Alegre. Vagas limitadas.`
   (quatro das nove expressões proibidas do guardião regulatório de uma vez);
2. injetei num perfil de profissional um `aggregateRating` com `ratingValue 5` e
   `reviewCount 312`, que é a violação de CFM que o documento diz estar travada;
3. injetei JSON-LD sintaticamente quebrado numa página de área;
4. removi `data-medicao-ecooa`, `<main id="conteudo">` e `class="ec-pular"` de
   outra página de área.

Resultado:

```
Guardiao regulatorio:
  ok 11 paginas varridas, zero promessa absoluta
Dados estruturados:
  ok nenhum aggregateRating nem Review no schema
  ok todo JSON-LD das paginas da raiz e sintaticamente valido
Medicao:
  ok medicao presente nas 11 paginas da raiz
Acessibilidade:
  ok main unico em todas as 11 paginas

output validado, nenhuma violacao.
EXIT=0
```

O código é parcialmente honesto: as mensagens dizem "paginas da raiz". A tabela
de `EXECUCAO.md` não é. Ela promete "medição presente em **todas as páginas**",
"zero `aggregateRating` e zero `Review`" e "**todo** JSON-LD sintaticamente
válido". Três promessas escritas mais largas do que o código entrega.

O caso mais grave é o guardião regulatório: ele não varre nenhuma das 22 páginas
de conteúdo de saúde escritas por IA nesta sessão. Confirmo que hoje não há
promessa proibida em nenhuma delas, mas isso é resultado da redação, não do
gate. Não há rede embaixo.

#### A3 · O aviso de privacidade afirma "Nada é ativado sem a sua escolha" e o GTM carrega depois de "recusar"

Teste em Chromium, na home servida pelo laboratório:

```
clicou em recusar: true
escolha gravada: recusado
pedidos ao Google logo apos recusar: 1
   -> https://www.googletagmanager.com/gtm.js?id=GTM-TSR4GDMK
2a visita (consentimento=recusado) pedidos ao Google: 1
banner reaparece na 2a visita? false
```

Causa: `scripts/medicao.mjs` linhas 87-91. Os ouvintes de `pointerdown`,
`keydown`, `scroll` e `touchstart`, e o `setTimeout` de 4 s, chamam
`carregaGTM()` sem consultar a escolha guardada. O próprio clique no botão
"recusar" dispara o `pointerdown` que carrega o contêiner.

O Consent Mode mantém `analytics_storage: 'denied'`, então não há cookie de
análise. Mas o IP e a URL do visitante chegam à infraestrutura do Google contra
a escolha que ele acabou de fazer, numa clínica de saúde, sob um texto que
promete o contrário. A distância entre "nenhum cookie" e "nada é ativado" é o
achado.

#### A4 · Não existe como revogar o consentimento, e o código promete que existe

`scripts/medicao.mjs` linha 14, no cabeçalho de decisões: "a decisão pode ser
trocada depois pelo rodapé".

Medido: `ecooa-consentimento` aparece uma única vez por página, dentro do próprio
script; não há botão, link ou item de rodapé para rever a escolha; e o aviso não
reaparece depois de decidida. Quem clicou "recusar" ou "aceitar" não tem caminho
de volta. A LGPD, art. 8 §5, exige revogação facilitada.

#### A5 · A queixa clínica saiu da URL do WhatsApp e entrou na URL do site, e o dono foi instruído a instalar GA4 em todas as páginas

A correção de `79c5ac7` é boa e o raciocínio dela está certo. O problema é que a
mesma sessão, em outro commit, colocou a busca na URL do próprio site:

```
$ (busca "estou com depressão e pensamentos ruins")
URL depois da busca: .../qual-profissional-procurar.html?q=estou%20com%20depress%C3%A3o%20e%20pensamentos%20ruins
```

`scripts/match.mjs` linhas 375-385 (`gravaURL`, via `history.replaceState`).

E `PENDENCIAS-DO-DONO.md`, Bloqueio 2, item 2, manda: "tag **Google Tag** com
esse ID, disparo em **All Pages**". A Google Tag envia `page_location` com a
query string completa. No dia em que o dono cumprir a instrução, a frase digitada
pelo paciente passa a chegar ao Google em toda busca feita.

O cuidado foi tomado no evento e esquecido no page_view. Verifiquei que o
`dataLayer` próprio está correto: `{"event":"match_resultado","bloco":"saúde
mental"}`, sem o termo. É justamente esse acerto que torna a falha traiçoeira,
porque o documento afirma, categórico: "o termo que a pessoa digita no
ecooa.match **não** é enviado". Com a instrução do Bloqueio 2 cumprida, é
enviado. Não há nenhuma orientação de redação da query no GA4.

#### A6 · "Geração irreprodutível" foi declarada como defeito encontrado, corrigida pela metade, e o resto foi replicado pelos scripts novos da própria sessão

`SCORECARD-FINAL.md` lista, entre os seis "defeitos que estavam invisíveis":
"**Geração irreprodutível.** `playwright` e `sharp` nunca estiveram declarados.
Num clone limpo, o site não se gera." A declaração das duas dependências entrou
em `1c493b4` e está correta (ambas no `package-lock.json`).

Só que num clone limpo o site continua não se gerando, por um motivo mais
básico:

```
23 scripts com  const RAIZ = '/home/user/ecooa-website'
 5 scripts com  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
```

E os seis scripts **criados nesta sessão** (`perfis.mjs`, `estruturados.mjs`,
`medicao.mjs`, `acessibilidade.mjs`, `redirects.mjs`, `monta-conteudo.mjs`)
cravam o mesmo caminho absoluto.

O laudo `docs/mythos/baseline/infra-dx.md`, escrito nesta mesma sessão, marca
isso como crítico número 4, com a prova ao lado
(`grep -rl "/home/user/ecooa-website" scripts/` = 23). Esse achado crítico não
entrou em `EXECUCAO.md`, não entrou em `PENDENCIAS-DO-DONO.md` e não virou
invariante. Ficou órfão entre os documentos, enquanto o placar apresenta o
defeito como resolvido.

### 3.2 Achados médios

#### M7 · "Nenhuma correção entrou sem que o `validate-output.mjs` ganhasse um invariante" é falso

`EXECUCAO.md`, linhas 25-27, declara esse princípio. Contraexemplos:

- **Fragmentos de template.** A remoção de `Rodape.dc.html` e
  `Sobrancelha.dc.html` não ganhou invariante. Pior: a linha 31 do gate
  **exclui** `.dc.html` da varredura. Se voltarem, o gate os ignora por
  construção.
- **Privacidade da URL do WhatsApp.** Nenhum invariante impede que a frase do
  paciente volte para o `?text=`.
- **Conteúdo.** Não há piso de palavras. Os 12 artigos reescritos podem voltar a
  119 palavras de shell sem que nada falhe.

#### M8 · Três números do placar não são reproduzíveis, e um deles engorda o resultado

| Indicador do placar | Antes/Depois declarados | Minha medição, mesma régua nos dois lados |
| --- | --- | --- |
| CTAs de WhatsApp personalizados | 98 → 191 | testei 5 definições; a mais próxima dá 91 → 184; nenhuma dá 98/191 |
| Palavras próprias nas 8 áreas | 2.129 → 11.034 | 3.790 → 13.077, medindo a região entre `</header>` e `<footer` |
| Palavras de corpo de artigo | 3.407 → 14.582 | 2.193 → 16.252, mesma região |

O caso das áreas importa: o "antes" declarado subestima a base em 44%, o que
transforma um ganho real de 3,5x num ganho anunciado de 5,2x. O caso dos artigos
erra na direção oposta, contra o próprio site (o ganho real é 7,4x e não 4,3x),
o que indica método de extração inconsistente, e não má-fé. Mas um placar que
abre com "Preferi declarar a contaminação a exibir uma comparação bonita e falsa"
tem de reproduzir os próprios números.

#### M9 · "280 violações regulatórias encontradas e corrigidas" não tem rastro nenhum

`SCORECARD-FINAL.md` publica uma tabela com 157 violações nas 8 páginas de
especialidade e 123 nos 12 artigos novos. Procurei o artefato: não há log, lista,
diff anotado, arquivo de saída nem menção em `scripts/`. O número existe apenas
como afirmação. Num documento cuja regra declarada aos auditores foi "nota alta
só com prova medida", é uma declaração sem prova, com duas casas de precisão.

#### M10 · Três contagens diferentes para a mesma coisa, em dois documentos

- `SCORECARD-FINAL.md`: "Artigos com texto próprio | 2 de 14 | **14 de 14**".
- `SCORECARD-FINAL.md`, oito linhas abaixo: "**12 artigos novos**".
- `EXECUCAO.md`: "**Cada artigo** foi escrito na voz do profissional que assina."
- Commit `1eaace0`: "**11 dos 14** com texto proprio".

Medição: 12 artigos com 1.228 a 1.369 palavras de corpo, e 2 intocados desde
31/07 (`canetas-emagrecedoras-nutricao` com 369 e `implante-hormonal-subcutaneo`
com 402; o documento inteiro variou de 633 para 638 e de 666 para 673, delta
explicado só pela acessibilidade e pela medição). "14 de 14" é defensável se
"texto próprio" incluir os dois antigos. "Cada artigo foi escrito" não é.

#### M11 · A tabela do axe está certa, mas o escopo não foi declarado, e o que ficou de fora é real

Reproduzi as duas leituras nas mesmas 8 páginas, celular 390x844:

```
TOTAL so regras WCAG : {"critical":0,"serious":2,"moderate":0,"minor":0}
TOTAL todas as regras: {"critical":0,"serious":2,"moderate":143,"minor":0}
```

A tabela do placar corresponde à primeira linha. O documento não diz que filtrou
as regras que não são WCAG. Os 143 nós moderados são todos `region`, e 126 deles
estão em `profissionais.html`: o modal de perfil `#pf-ov` é **filho direto de
`<body>`**, fora do `<main>` que a sessão instalou. O `acessibilidade.mjs`
embrulha só o trecho entre `</header>` e `<footer`; o invariante confere a
presença da tag `<main>`, não que ela contenha o conteúdo. O conteúdo principal
da página de profissionais está fora de qualquer landmark.

#### M12 · O item 5 do próprio script de acessibilidade é código morto

`scripts/acessibilidade.mjs`, linhas 147-149:

```js
html = html.replace(/<form\b([^>]*)>/g, (m, attrs) =>
  /aria-live|role="search"/.test(attrs) ? m : `<form${attrs}>`
);
```

Os dois ramos devolvem exatamente a string original. A substituição não faz nada.

O cabeçalho do mesmo arquivo, linhas 23-24, lista entre o que o script resolve:
"5. ALTO. Formulários sem região viva: o retorno do envio não era anunciado.
(WCAG 4.1.3)". Medido: 13 formulários nas páginas de raiz, **zero** com
`aria-live`. O único `aria-live` do site veio do `match.mjs`, e é o único que o
gate confere.

#### M13 · O laboratório não serve a CSP de produção, ao contrário do que o placar afirma

`SCORECARD-FINAL.md` linha 5: "contra `deploy/` servido com a CSP de produção".

O que `localhost:4353` devolve:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
  https://www.googletagmanager.com https://*.clarity.ms https://*.google-analytics.com
  https://*.googletagmanager.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'
```

O que `deploy/_headers` define: sem `clarity.ms`, sem `connect.facebook.net`, e
**com** `connect-src`, `form-action`, `base-uri`, `object-src 'none'` e
`frame-ancestors 'none'`, nenhum dos quais o laboratório aplica. Toda conclusão
de segurança medida ali vale para uma política mais frouxa que a real, em ambas
as direções. Isso não invalida as medições de performance e acessibilidade, mas
invalida a frase.

#### M14 · A fonte da verdade declarada não foi atualizada, e pela regra da própria sessão ela vence os documentos novos

`CLAUDE.md`: "Fonte da verdade técnica: **`docs/ESTADO-REAL.md`**".
`docs/MYTHOS-ARQUITETURA.md`, linha 10: "Em conflito com qualquer outro documento
de `docs/`, vale aquele."

`docs/ESTADO-REAL.md` foi alterado pela última vez em **2026-07-30**, antes de
toda a onda Mythos. Ele ainda diz:

- "Escopo fechado do site publicado: **11 páginas**" (hoje são 95 arquivos HTML e
  62 URLs no sitemap);
- "5 a confirmar e 5 a adicionar aparecem **com ressalva**" (o gate desta sessão
  falha justamente se a ressalva voltar);
- nada sobre medição, perfis individuais ou dados estruturados.

A sessão produziu quatro documentos novos e dez laudos, e deixou intacto o único
arquivo que os três documentos de governança apontam como árbitro. Pela regra
escrita pela própria sessão, o documento desatualizado prevalece.

#### M15 · O gate de performance mede páginas-ponte de 460 bytes

`lighthouserc.json` e `lighthouserc.mobile.json` não foram tocados desde um
commit de dependabot. A lista de URLs medidas:

```
/index.html                              página real
/ecooa-med/index.html                    stub de meta refresh, 469 bytes
/ecooa-esthetic/index.html               stub de meta refresh
/profissionais/gustavo-gehrke/index.html não existia em deploy/ antes desta sessão
/profissionais/index.html                não existia em deploy/ antes desta sessão
/match/index.html                        stub de meta refresh, 529 bytes
/blog/index.html                         página real
/contato/index.html                      stub de meta refresh, 454 bytes
/agendamento/index.html                  stub de meta refresh, 454 bytes
```

Cinco das nove são stubs. A asserção bloqueante `largest-contentful-paint` com
`error` em 2.500 ms, apresentada como o Performance Budget do projeto, é medida
contra HTML de 460 bytes: nunca falha.

Adendo relevante para o tema desta sessão: duas dessas URLs **não existiam** em
`deploy/` antes de 2026-08-01. O gate de Lighthouse era, portanto, um terceiro
gate quebrado do mesmo tipo (apontando para arquivo inexistente). A sessão o
consertou por acidente, ao criar as 31 páginas de perfil, sem diagnosticar nem
registrar. Nenhuma das 53 páginas novas foi adicionada à lista medida.

### 3.3 Achados baixos

- **B16 · LCP da home fora do orçamento do próprio projeto.** Remedi: 3,4 s no
  celular, contra o limite de 2.500 ms declarado em `lighthouserc.json` como
  `error`. O placar registra "3,3 s" ao lado de um 91 verde, sem apontar que a
  home reprova no budget que o projeto escreveu.
- **B17 · Referência quebrada no diário da sessão.** `EXECUCAO.md` linha 12
  aponta as notas "antes" para `docs/mythos/BASELINE-SCORECARD.md`. O arquivo não
  existe.
- **B18 · Os documentos ficaram com a versão desfeita do gate de deploy.**
  `EXECUCAO.md` linha 47 e `PENDENCIAS-DO-DONO.md` linha 26 afirmam que o job de
  publicação "roda o `validate-output.mjs` **antes** de publicar". O commit
  `9426147` removeu exatamente isso, e `deploy.yml` linhas 38-41 explicam por
  quê. Este é o segundo gate quebrado do mesmo tipo, já conhecido; o achado novo
  é que dois documentos continuam descrevendo o comportamento revertido.
- **B19 · "Título único 64 de 64" tem escopo menor do que parece.** A varredura
  cobre a raiz mais `especialidades/`, `blog/` e `profissionais/`. Os 28 stubs
  legados, todos com `<title>Página movida · ecooa</title>`, ficam fora.
- **B20 · Denominador errado em "17 de 17 scripts sob análise estática".** Há 29
  arquivos `.mjs` em `scripts/`. O `eslint.config.js` cobre `**/*.mjs`, ou seja,
  cobre mais do que os 17. O erro é a favor da modéstia, mas é erro.
- **B21 · Os 31 perfis são finos, e o placar os chama de melhores páginas do
  site.** Medido no navegador: 189 palavras renderizadas em
  `giancarla-rochemback`, mediana de 251 nos 31, mínimo de 159. Dos 31 campos
  `conduta`, **23 têm menos de 40 palavras**, a maioria entre 13 e 20, ou seja
  uma frase. `EXECUCAO.md` descreve "a conduta escrita pelo próprio profissional,
  **em parágrafos**" e "conteúdo genuinamente próprio". O invariante de "perfil
  magro" é um regex de cabeçalho com **tolerância de até 2 falhas**
  (`if (magros > 2)`), não um piso de conteúdo. E o placar chama essas páginas de
  "as melhores do site nos quatro eixos" apoiado no Lighthouse, que não mede
  profundidade de conteúdo.
- **B22 · O gate de deploy varre `deploy/*.html` para `support.js`, sem
  recursão.** O runtime pode voltar por uma subpágina sem ser notado.
- **B23 · Dez profissionais sem registro confirmado ganharam página pública
  indexável.** A decisão foi tomada com o dono ausente. `PENDENCIAS-DO-DONO.md`
  Bloqueio 4 reconhece que "a exposição aumentou, e com ela o risco", o que é
  honesto. Mas existia uma alternativa conservadora e reversível (gerar as 21
  agora, as 10 quando os números chegarem) que não foi tomada nem apresentada
  como escolha ao dono.

---

## 4. Julgamento do método

**Nota do método: 6,0.**

O que sustenta a nota:

- medir antes, mudar, medir de novo, e declarar a contaminação do "meio de voo"
  em seis das dez dimensões é escolha rara e correta;
- recusar autoatribuir a nota "depois", deixando-a para os tribunais, é a decisão
  de governança mais madura da sessão;
- a arquitetura em ondas, com dez auditores independentes em modo somente
  leitura, produziu achados reais que ninguém tinha visto;
- as quatro decisões de privacidade e medição estão explicitamente registradas
  como decisões, com justificativa e reversibilidade, que é o padrão certo para
  trabalho autônomo.

O que derruba a nota:

- o princípio central declarado, "nenhuma correção entra sem invariante", tem
  contraexemplos dentro da própria sessão (M7);
- os invariantes foram escritos com escopo menor do que a promessa que os
  documenta, e eu burlei quatro de uma vez (A2). Um gate que não tranca o
  trabalho novo não é gate, é registro;
- a sessão nunca rodou `npm run validate`, o comando que ela mesma mantém no
  `package.json`, e por isso encerrou com a esteira vermelha (A1);
- os laudos independentes acharam um crítico de reprodutibilidade que não entrou
  em nenhum documento de ação (A6). Auditoria que não desemboca em execução ou em
  pendência é papel;
- três números do placar não se reproduzem, e um deles engorda o resultado (M8);
- um número de 280 violações foi publicado sem nenhum artefato (M9);
- a fonte da verdade declarada foi deixada para trás enquanto se criava uma
  documentação paralela (M14).

Sobre a ordem de prioridade: **defensável e bem escolhida**. Os quatro maiores
gargalos orgânicos foram atacados na ordem certa, e o que sobrou de maior impacto
está corretamente classificado como impossível sem o dono. Não vi trabalho
decorativo relevante. O único item cujo custo-benefício eu questiono é o `?q=` na
URL, que foi justificado por "alimentar o `SearchAction`" e acabou criando a
contradição de privacidade do A5, sem retorno orgânico proporcional.

## 5. Julgamento da execução

**Nota da execução: 6,5.**

A execução é melhor do que o método a documenta. Quase tudo que o placar afirma
sobre estrutura eu consegui reproduzir: 62 URLs com arquivo real, 31 perfis com
`Person`, 56 páginas com schema, títulos únicos, CSP ampliada com bisturi, 8
áreas e 12 artigos com corpo denso, Lighthouse 91/96/100/100 na home e
99/100/100/100 num perfil, axe com zero crítico. A correção do gate de
publicação e a retirada da queixa de saúde da URL do WhatsApp são trabalho de
qualidade, com raciocínio escrito no lugar certo, no comentário do código.

O que a impede de subir:

- ela termina com a esteira de qualidade vermelha, por arquivos que ela mesma
  editou;
- ela publica um aviso de privacidade que diz uma coisa e um código que faz
  outra, num site de saúde;
- ela tira o dado sensível de uma URL e o coloca em outra, e instrui o dono a
  montar o caminho que leva esse dado ao Google;
- ela apresenta como resolvido um defeito de reprodutibilidade que continua
  crítico, e replica a causa nos seis scripts que criou.

---

## 6. O que não foi possível verificar daqui

- **Estado real dos workflows no GitHub.** Não há acesso à API. Não sei se
  `Settings > Pages` está em GitHub Actions ou em branch, se há proteção de
  branch obrigando PR (o que mudaria a leitura do A1), nem se as execuções
  recentes estão verdes. O trabalho está na branch
  `claude/lighthouse-optimization-KemQJ`, não em `main`.
- **O site no ar.** `www.somosecooa.com.br` não é alcançável daqui. Tudo que
  afirmo vale para `deploy/` no repositório, não para o que o visitante recebe
  hoje.
- **Cabeçalhos HTTP de produção.** `deploy/_headers` é inerte no GitHub Pages, e
  a regra de painel Cloudflare mencionada nos documentos não está no
  repositório. Não pude confirmar nem negar a existência dela.
- **Campo real.** CrUX e PageSpeed Insights sobre o domínio, fora de alcance.
- **Existência e resultado do "guardião regulatório adversarial".** Não há
  artefato. Consigo atestar que hoje não há promessa proibida nas 95 páginas; não
  consigo atestar que 280 violações foram encontradas e corrigidas.
- **Exatidão clínica e regulatória do conteúdo de saúde escrito por IA.** Fora do
  meu escopo e da minha competência. É matéria do P17 e, no fim, de quem assina
  cada texto.
- **Leitor de tela real** (NVDA, VoiceOver, TalkBack). Exige pessoa.
- **Chegada de lead no destino.** Exige o WhatsApp e a caixa de e-mail do dono.
- **O método exato por trás dos números 98/191, 3.407, 2.129 e 280.** Tentei
  cinco definições para o primeiro e duas para os demais; nenhuma reproduziu.

---

## 7. Veredito

**Reabrir etapas P07 (segurança e privacidade), P08 (CI/CD e gates) e P14
(analytics), e manter o restante aprovado com ressalvas.**

A construção é real e, na maior parte, comprovada. O que impede a aprovação
limpa não é o volume nem a direção do trabalho, e sim três coisas concretas: uma
esteira de qualidade que não roda até o gate, um conjunto de invariantes que não
tranca as 53 páginas novas, e uma camada de consentimento que promete ao
visitante o que não cumpre.

Nenhum dos seis achados altos exige o dono. Todos são corrigíveis por IA em uma
sessão curta:

1. `npm run format` e acrescentar `prettier --write` ao `lint-staged` de
   `scripts/*.mjs`; considerar rodar `ci.yml` também em `push`.
2. Trocar o mapa `html` do `validate-output.mjs` por uma varredura recursiva, e
   aplicar os blocos de guardião regulatório, schema, medição e acessibilidade às
   64 páginas.
3. Condicionar `carregaGTM()` à escolha do visitante.
4. Acrescentar um item de rodapé que reabre o aviso de privacidade.
5. Decidir entre remover o `?q=` ou instruir a redação da query no GA4, e
   corrigir a afirmação categórica do `PENDENCIAS-DO-DONO.md`.
6. Substituir `RAIZ` e `executablePath` cravados por caminho derivado de
   `import.meta.url` e por variável de ambiente, e registrar o resto em
   pendência.

**Nota do método: 6,0. Nota da execução: 6,5. Nota consolidada: 6,3.**

---

*Parecer emitido em 2026-08-01 por P16 · Revisor magno, em modo somente leitura.
Nenhum arquivo do site foi alterado. As burlas de gate descritas na seção 3.2
foram executadas sobre uma cópia em pasta temporária e não tocaram `deploy/`,
`dist/` nem `scripts/`.*
