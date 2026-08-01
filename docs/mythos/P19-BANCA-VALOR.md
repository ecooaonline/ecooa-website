# P19 · Banca de valor

> Parecer independente sobre o valor comercial do ativo digital da ecooa.
> Emitido em 2026-08-01, depois da execução autônoma da esteira Mythos.
>
> A banca não executou nem alterou nada em `deploy/`, `src-site-3/` ou
> `scripts/`. Tudo o que está escrito aqui foi medido nesta sessão contra o
> HTML publicado e contra o código, e cada número traz o comando ou o arquivo
> que o sustenta. Onde a documentação da sessão afirma algo que a medição não
> reproduz, o parecer registra a divergência, não a afirmação.
>
> Regra de julgamento: promessa não é ativo. Só entra na conta o que um
> comprador, um sócio ou um auditor conseguiria confirmar abrindo o
> repositório hoje.

---

## 1. Método

Medições feitas contra `deploy/` servido em `http://localhost:4353` com a CSP
de produção, com Lighthouse 13.x, axe-core 4.x e Playwright (Chromium
1194). O domínio real não é alcançável deste ambiente, então nada aqui fala
sobre produção: fala sobre o artefato que produção receberia.

| O que foi medido | Como |
| --- | --- |
| Inventário e profundidade de conteúdo | contagem de palavras dentro de `<main>`, com script próprio, descartando `<script>`, `<style>`, `<svg>` e `<head>` |
| Originalidade das 31 páginas de perfil | quebra por sentença e contagem de repetição entre páginas |
| Dados estruturados | parse de todos os blocos `application/ld+json` das 95 páginas |
| Malha interna | extração de `href` dentro de `<main>`, com `<base href="/">` considerado |
| Performance | Lighthouse desktop em perfil de profissional, Lighthouse móvel na home |
| Acessibilidade | axe-core em 14 páginas, viewport 390x844 |
| Conversão | Playwright com clique real, `dataLayer` inspecionado, `elementFromPoint` sobre o CTA flutuante |
| Prontidão de esteira | execução local de `npm run lint`, `format:check`, `npm audit`, `node scripts/validate-output.mjs` |
| Diferencial ecooa.match | leitura de `scripts/almanaque.mjs` e `scripts/match.mjs` mais busca ponta a ponta no navegador |

---

## 2. O que o ativo é, medido

### 2.1 Inventário

`deploy/` tem 95 arquivos HTML. Desses, **67 são páginas de verdade** e **28
são stubs de redirecionamento** por `meta refresh`, com 8 a 15 palavras cada,
preservando URLs legadas. O `sitemap.xml` declara 62 URLs, que é o conjunto
correto: os stubs ficaram de fora.

```
find deploy -name "*.html" | wc -l   -> 95
grep -c "<loc>" deploy/sitemap.xml   -> 62
```

### 2.2 Profundidade de conteúdo, por tipo de página

Contagem de palavras dentro de `<main>`, que é o que o buscador lê como corpo.

| Tipo | Páginas | Palavras totais | Média | Mínimo | Máximo |
| --- | ---: | ---: | ---: | ---: | ---: |
| Áreas de especialidade | 8 | 12.975 | 1.622 | 1.494 | 1.727 |
| Artigos do editorial | 14 | 16.125 | 1.152 | 360 | 1.360 |
| Perfis de profissional | 31 | 9.014 | 291 | 152 | 770 |
| Institucionais e utilitárias | 11 | 5.508 | 501 | 123 | 1.029 |
| **Total de conteúdo próprio** | **64** | **~43.600** | | | |

Isto é um resultado real e acima da média do setor. Para comparação de
mercado: o site institucional típico de clínica multidisciplinar em capital
brasileira publica de 10 a 25 páginas, com 250 a 600 palavras por página de
serviço, e um blog terceirizado com textos genéricos. Aqui, cada uma das oito
áreas comerciais tem entre 1.494 e 1.727 palavras, com estrutura que atende
intenção comercial de ponta a ponta.

Estrutura verificada em `especialidades/estetica-facial/`:

```
h1  Estética facial com avaliação antes do procedimento.
h2  Para quem é esta área
h2  Serviços e procedimentos   (10 subitens em h3)
h2  Como funciona, do primeiro contato ao acompanhamento   (4 etapas)
h2  Quem atende em estética facial   (links para 9 perfis)
h2  Perguntas frequentes   (9 perguntas, com FAQPage no schema)
h2  Um passo de cada vez. O primeiro é uma conversa.
```

Somadas, as oito áreas nomeiam **107 serviços e procedimentos** em `h3` e
publicam **76 perguntas frequentes** com `FAQPage` válido.

### 2.3 Qualidade editorial dos artigos

Os 14 artigos têm autor nomeado que corresponde a um profissional real da casa,
com classe e registro, `datePublished` e sete `h2` de estrutura. A amostra lida
na íntegra (`blog/queda-de-cabelo-causas/`, 1.219 palavras) é texto de nível
profissional, com raciocínio clínico, sem promessa de resultado, sem
superlativo e sem autodiagnóstico. Não é conteúdo de enchimento.

Duas ressalvas medidas:

- **Nenhum artigo tem `dateModified`.** Zero em 14. Em saúde, o sinal de
  atualização é parte da avaliação de qualidade.
- **Nenhum artigo cita fonte externa.** O único link externo de cada artigo é o
  próprio CTA de WhatsApp. Em conteúdo YMYL, zero referência é uma fragilidade
  de E-E-A-T, não uma escolha neutra.

---

## 3. Os diferenciais, testados um a um

A pergunta do tribunal foi direta: o ecooa.match e as 31 páginas de
profissional são diferenciais defensáveis? A resposta é sim para os dois, com
qualificações que mudam a conta.

### 3.1 ecooa.match

**O que existe, medido em `scripts/almanaque.mjs`:**

| Item | Quantidade |
| --- | ---: |
| Blocos de queixa mapeados | 28 |
| Termos de busca curados | 604, todos únicos |
| Textos "o que este profissional faz nesta queixa" | 115 |
| Palavras nesses textos | 1.936, média de 16,8 por texto |
| Profissionais cobertos por ao menos um bloco | 31 de 31 |
| Blocos com ranking definido pelo dono | 28 |

**Funciona.** Teste ponta a ponta no navegador, viewport 390x844:

```
entrada: "meu cabelo esta caindo muito"
saída:   bloco entendido = saúde capilar
         caminho sugerido = "Tricologia, para investigar antes de tratar."
         5 profissionais indicados, cada um com o texto específico da queixa
         URL gravada: ?q=meu%20cabelo%20esta%20caindo%20muito
         evento no dataLayer: match_resultado
```

**Este é o ativo mais valioso do site, e o motivo não é o software.** O motivo
é a curadoria: 28 blocos, 604 termos e 115 microtextos por profissional, com
ranking definido em entrevista com o dono. Isso não se copia com um prompt.
Um concorrente com mais orçamento reproduz a interface em uma semana e não
reproduz o mapa, porque o mapa é conhecimento de quem opera a clínica. Esse é
o único fosso genuinamente defensável do ativo.

**A ressalva pesa.** O site anuncia "Busca por IA", em texto visível fora de
`<script>`, em **67 das 67 páginas reais** (está no submenu do cabeçalho), mais
`og:title` e `BreadcrumbList` da página do match. A implementação, lida em
`scripts/match.mjs`, é casamento de substring com pontuação por comprimento do
termo:

```js
g.termos.forEach(function (k) {
  if (t.indexOf(' ' + k + ' ') >= 0 || t.indexOf(' ' + k) >= 0) {
    peso += k.length * (k.indexOf(' ') >= 0 ? 2 : 1);
```

Não há modelo, não há embedding, não há chamada externa. O
`scripts/generate-embeddings.mjs` existe no repositório, mas escreve em
`src/data/`, que é o projeto Astro desativado, e não é chamado por
`scripts/gerar-site.mjs`.

Duas consequências, ambas comerciais. Primeiro: em diligência, qualquer
avaliador técnico gasta dez minutos para descobrir isso, e a descoberta
contamina a credibilidade do resto do dossiê. Segundo: "busca por IA" é
afirmação publicitária sobre característica do serviço, e o art. 37 do Código
de Defesa do Consumidor não pede má-fé para caracterizar publicidade enganosa,
pede indução a erro. O produto é honesto se descrito pelo que faz. Descrito
como IA, cria risco desnecessário sobre o melhor ativo da casa.

### 3.2 As 31 páginas de profissional

**Defensáveis, e mais rasas do que a documentação sugere.**

O que a medição confirma:

- as 31 existem, estão no sitemap, têm `Person` e `BreadcrumbList` válidos;
- todas as 31 têm conduta preenchida, com média de 38,6 palavras;
- **78% do texto de `<main>` é único**, no teste de repetição de sentença entre
  as 31 páginas (7.025 de 9.014 palavras aparecem em uma única página);
- média de 8,1 links internos por perfil, ligando área e colegas.

O que a medição também mostra:

- a média é de **291 palavras** em `<main>`, e o perfil mais magro tem **152**.
  A página de Vitória Serpa, lida inteira, tem: identificação, uma frase de
  conduta, um bloco de queixa com uma frase, a lista de seis colegas e o CTA.
  Isso é uma ficha, não uma página de autoridade;
- o bloco "Também procurado como" despeja o vocabulário bruto de busca no texto
  visível, **114 vezes em 31 páginas**, sem acento, contrariando a regra do
  próprio projeto em `CLAUDE.md`. Amostras reais publicadas: *"dor de cabeca,
  cefaleia, migranea"*, *"reposicao hormonal, implante hormonal, chip
  hormonal"*, *"perdi minha mae, perdi meu pai, falecimento, nao aguento
  mais"*. Para uma clínica que se posiciona como alto padrão, isso lê como
  lista de palavras-chave, porque é;
- **10 dos 31 profissionais não têm registro exibido** (5 `a-confirmar`, 5
  `a-adicionar`, confirmado em `deploy/dados-ecooa.js`). Publicar página
  indexável e nominal de profissional de saúde sem registro visível aumenta a
  exposição perante o conselho, exatamente porque a página agora existe.

Veredito sobre o diferencial: as 31 páginas são um ativo real de busca por nome
e por profissão mais bairro. Não são, ainda, ativo de conversão nem de
autoridade. Com 400 a 600 palavras próprias por perfil, formação, foco clínico
e uma pergunta frequente por profissional, passariam a ser.

---

## 4. Prontidão técnica, medida

### 4.1 O que está bom, e é comprovável

| Medição | Resultado |
| --- | --- |
| Lighthouse desktop, `/profissionais/natalie-queiroz/` | performance 99, acessibilidade 100, boas práticas 100, SEO 100, LCP 2,1 s, CLS 0, TBT 0 ms |
| Lighthouse móvel, home | performance 92, acessibilidade 96, SEO 100, CLS 0, TBT 0 ms, peso 457 KiB |
| JSON-LD | 118 blocos em 65 páginas, **zero inválido**, 13 tipos distintos |
| `MedicalClinic` na home | NAP completo, horário, área atendida, 8 serviços ligados às áreas |
| Canonicals | 95 de 95 páginas, todas no domínio canônico |
| Referências de asset quebradas | **zero** em 49 referências únicas |
| Gate local `validate-output.mjs` | passa, 30 invariantes |
| Peso do site | 6,5 MB no total, sem fonte externa, sem CDN, sem biblioteca JS de terceiro |

Os dados estruturados merecem destaque. 118 blocos válidos, com
`MedicalClinic`, `WebSite` com `SearchAction`, `MedicalWebPage` nas oito áreas,
`FAQPage` com 76 perguntas, `Person` nos 31 perfis e `Article` nos 14 textos, é
um nível de instrumentação que a maioria absoluta das clínicas concorrentes não
tem. Isso vale dinheiro em busca local e em citação por IA.

### 4.2 O que a documentação afirma e a medição não reproduz

**O gate não trava a publicação.** `deploy.yml` e `ci.yml` são workflows
independentes, disparados pelo mesmo push. O `deploy.yml` confere seis arquivos
e dois greps, e não chama `validate-output.mjs`. O `ci.yml` chama, mas
`deploy.yml` não depende dele. Resultado: **CI vermelho não impede publicação.**

E o CI está vermelho agora. Execução local dos passos, na ordem do `ci.yml`:

```
npm run format:check          EXIT=1   (12 arquivos de scripts/ fora do padrão)
npm run lint                  EXIT=0
npm audit --audit-level=high  EXIT=1   (1 vulnerabilidade alta, brace-expansion)
```

O `format:check` é o **primeiro** passo do job `quality`. Ele falha, o job para
ali, e nenhum dos gates seguintes roda: nem o `validate:output`, nem o
Lighthouse CI, que depende de `needs: quality`. A frase "cada conquista virou
invariante travado" é verdadeira no laptop e falsa na esteira.

**O Lighthouse CI mede páginas vazias.** `lighthouserc.json` monitora nove URLs.
**Cinco delas são stubs de redirecionamento** com 8 palavras de corpo:
`/ecooa-med/`, `/ecooa-esthetic/`, `/match/`, `/contato/` e `/agendamento/`.
Nenhuma das oito páginas de área, nenhum dos 14 artigos e nenhum dos 30 perfis
restantes está no orçamento de performance. É o mesmo defeito de classe que a
sessão declara ter corrigido no `validate-output.mjs`: um gate medindo coisa
diferente do site.

**A acessibilidade não está em zero.** O `SCORECARD-FINAL.md` publica "0
críticos, 2 graves, 0 moderados, 0 leves". Rodei axe-core em 14 páginas,
390x844, sem exclusão de regra:

| Página | Graves | Moderados | Regras |
| --- | ---: | ---: | --- |
| `/profissionais.html` e `/profissionais/` | 0 | 126 e 127 | `region` |
| `/qual-profissional-procurar.html` | 0 | 8 | `region` |
| `/blog/` | 0 | 4 | `region` |
| `/especialidades/` | 0 | 3 | `region` |
| `/localizacao.html` | 0 | 2 | `region` |
| `/index.html` | 2 | 1 | `color-contrast`, `region` |
| `/sublocacao.html` | 2 | 1 | `color-contrast`, `region` |
| demais medidas | 0 | 1 cada | `region` |

O contraste de 3,54:1 na home está confirmado e bate com o laudo. O que o laudo
não registra: **o mesmo defeito grave existe também em `/sublocacao.html`**, e
há mais de 140 nós moderados de `region` no site, com destaque para os 126 da
listagem de profissionais, onde quase todo o conteúdo vive fora de landmark. A
afirmação "zero moderados" não se reproduz.

---

## 5. O último metro: o que impede tráfego de virar paciente

Esta é a seção que mais afeta o valor. Um ativo de busca vale pelo que entrega
no fim do funil, e é exatamente ali que o site está mais fraco.

### 5.1 O aviso de privacidade bloqueia o CTA principal no celular

Medido com Playwright em 390x844, na home, primeira visita:

```
aviso de privacidade   top 690  left  12  right 378  bottom 832
botão WhatsApp fixo    top 768  left 314  right 374  bottom 828
sobreposição: SIM
document.elementFromPoint(centro do botão)  ->  DIV "Aviso de privacidade"
```

Não é "cobre parcialmente", como registra a pendência 9.2. O
`elementFromPoint` devolve o aviso, não o link. **O botão flutuante de WhatsApp
é fisicamente inclicável para todo visitante de celular na primeira visita**,
até que ele aceite ou recuse. É o CTA mais visível do site, na página que
recebe mais tráfego, bloqueado pelo elemento que a própria sessão instalou.

### 5.2 Não existe clique para ligar

```
grep -rc "tel:" deploy --include=*.html   ->  nenhum resultado
grep -rho "(51)[^<]*" deploy --include=*.html | uniq -c   ->  69 x "(51) 99146-0909"
```

O telefone aparece 69 vezes, como texto, e **nenhuma vez como `tel:`**. Em
clínica local, com maioria de tráfego móvel, ligar é o segundo caminho de
conversão e o primeiro para público acima de 50 anos, que é justamente o
público de menopausa, reposição hormonal, longevidade e cardiometabólico, quatro
dos blocos mais fortes do almanaque.

### 5.3 A captação de e-mail é um `mailto:`

O formulário do editorial existe em 14 páginas. O handler, lido no HTML
publicado:

```js
window.location.href = 'mailto:ecooa.adm@gmail.com?subject=...&body=...';
if (botao) botao.textContent = 'e-mail aberto';
```

Não há lista, não há CRM, não há endpoint. O visitante precisa ter cliente de
e-mail configurado, sair do site e enviar a mensagem por conta própria. Em
celular, boa parte simplesmente não completa. Um canal de captação declarado em
14 páginas que na prática não captura nada é pior do que não ter o campo, porque
consome atenção e devolve zero.

### 5.4 Não há agendamento, nem página de contato

```
/agendamento/  -> meta refresh para /localizacao
/contato/      -> meta refresh para /localizacao
/clinica-moinhos-de-vento/ -> meta refresh para /localizacao
```

As três URLs com maior intenção comercial do site são redirecionamentos para a
página de endereço. Todo o funil, 486 CTAs em 67 páginas, termina em uma única
conversa de WhatsApp que depende de alguém responder. Fora do horário
comercial, e nos fins de semana, o site não tem caminho de conversão.

### 5.5 O silo editorial não conversa com o silo comercial

Malha interna medida dentro de `<main>`:

| Origem | Destino | Situação |
| --- | --- | --- |
| Artigo | outros 3 artigos e índice do blog | existe |
| Artigo | página de área do tema | **ausente nos 14** |
| Artigo | perfil de quem assina o texto | **ausente nos 14** |
| Página de área | perfis dos profissionais | existe, 2 a 13 links |
| Página de área | artigos do tema | **ausente nas 8** |
| Perfil | área e colegas | existe, média 8,1 |

São 16.125 palavras de autoridade tópica que não passam um único link para a
página que vende, nem para o profissional que assina. Quem chega pelo artigo
"Queda de cabelo: o que investigar antes de tratar" só tem uma saída: o
WhatsApp. Não há caminho para `/especialidades/tricologia/` nem para o perfil de
Yale Jerônimo. É a correção de maior retorno por hora de trabalho no ativo
inteiro.

### 5.6 Todo link interno aponta para uma URL que não é a canônica

```
2.085 links internos apontam para  profissionais.html, blog.html,
                                   especialidades.html, localizacao.html,
                                   sublocacao.html, sobre.html, mentorias.html,
                                   qual-profissional-procurar.html
95 canonicals declaram             /profissionais, /blog, /especialidades, ...
```

Além disso, `deploy/profissionais.html` e `deploy/profissionais/index.html`
coexistem, com **conteúdo diferente** (o texto do CTA de WhatsApp diverge), e os
dois declaram o mesmo canonical. O mesmo vale para `blog` e `especialidades`.
Não é fatal, porque o canonical resolve, mas nenhum link interno reforça a URL
que o site quer ranquear, e há três variantes servindo o mesmo conteúdo.

### 5.7 O site não mede nada hoje

A camada existe e funciona. Confirmado no navegador:

```
dataLayer inicial:  consent default, analytics_storage: denied
após aceitar:       GET https://www.googletagmanager.com/gtm.js?id=GTM-TSR4GDMK
clique no WhatsApp: {event:"whatsapp_click", pagina, tipo, rotulo,
                     destino:"recepcao", posicao:"cabecalho"}
busca no match:     {event:"match_resultado"}
```

A engenharia está correta e o desenho de privacidade é o mais conservador
possível. O que isso significa comercialmente:

1. o GTM **só carrega para quem clica em "aceitar"**. Quem ignora o aviso ou
   recusa não é medido, por decisão explícita no código
   (`function podeCarregar() { return lido() === 'aceito'; }`);
2. o contêiner **não tem tag configurada** e depende do dono;
3. a CSP que vale em produção vem de painel Cloudflare fora do repositório e,
   pela apuração da própria sessão, não tem `connect-src`, o que bloquearia o
   envio ao GA4.

Somando: **hoje o site coleta zero dado**, e mesmo depois de o dono resolver os
dois bloqueios, coletará apenas a fração que aceitar. Não existe, e não existirá
tão cedo, base para afirmar taxa de conversão, origem de paciente ou retorno de
canal. Isso não é defeito de execução, é o estado do ativo, e precisa estar no
preço.

---

## 6. Comparação com o padrão de mercado

Referência: clínica multidisciplinar de saúde de alto padrão em capital
brasileira, disputando busca local em bairro nobre.

| Dimensão | ecooa hoje | Padrão do concorrente típico | Quem ganha |
| --- | --- | --- | --- |
| Profundidade das páginas de serviço | 1.622 palavras de média, 107 serviços nomeados, 76 FAQ | 250 a 600 palavras, sem FAQ estruturado | **ecooa, com folga** |
| Editorial | 14 textos assinados por profissional da casa, 1.152 palavras de média | blog terceirizado, genérico, sem autor real | **ecooa** |
| Páginas de profissional | 31 indexáveis, 291 palavras de média | equipe em uma página única, sem URL própria | **ecooa** |
| Dados estruturados | 118 blocos válidos, 13 tipos | Organization e pouco mais, quando existe | **ecooa, com folga** |
| Performance | 99 desktop, 92 móvel, CLS 0 | WordPress com plugins, 40 a 70 móvel | **ecooa, com folga** |
| Ferramenta proprietária | ecooa.match, curadoria de 28 blocos e 604 termos | nenhuma | **ecooa, único** |
| Clique para ligar | ausente | presente na quase totalidade | concorrente |
| Agendamento online | ausente, WhatsApp apenas | agenda real em boa parte | concorrente |
| Preço e convênio | uma linha de FAQ dizendo que varia | política declarada em boa parte | concorrente |
| Avaliações e Perfil da Empresa no Google | não comprovado deste ambiente | dezenas a centenas de avaliações | **concorrente, decisivo** |
| Prova social no site | nenhuma, por vedação do CFM | idem, quando bem assessorado | empate |
| Medição em operação | zero | GA4 e pixel, mal configurados mas coletando | concorrente |

**Leitura honesta.** O site ganha em tudo que é construção e perde em tudo que é
operação. Isso importa mais do que parece, porque busca local não é decidida
principalmente pelo site: o fator isolado de maior peso no pacote de mapas é o
Perfil da Empresa no Google, com NAP consistente, categorias corretas, e volume
e recência de avaliações. Nada disso está no repositório, nada disso foi
comprovado, e nada disso a IA podia resolver sozinha.

Ou seja: o ativo está bem construído para a metade da disputa que ele controla,
e a outra metade continua inteiramente pendente.

---

## 7. Estimativa de valor

### 7.1 O que dá para afirmar e o que não dá

**Não dá para atribuir valor de receita.** Não existe analytics coletando, não
existe Search Console acessível deste ambiente, não existe histórico de
tráfego, de lead ou de paciente originado no site. Qualquer múltiplo de
faturamento aqui seria número inventado, e a banca não inventa número. O que dá
para estimar com lastro é **valor de reposição**: quanto custaria contratar a
produção do que está no repositório, no mercado brasileiro de 2026, com a
qualidade medida.

### 7.2 Valor de reposição, por componente

| Componente | Evidência que sustenta | Faixa |
| --- | --- | --- |
| Site institucional, design próprio, sem dependência de terceiro, 67 páginas | HTML publicado, 6,5 MB, Lighthouse 99/92 | R$ 25.000 a 55.000 |
| 8 páginas de área, 12.975 palavras, 107 serviços, 76 FAQ, em nicho regulado | contagem em `<main>`, estrutura verificada | R$ 8.000 a 20.000 |
| 14 artigos assinados, 16.125 palavras, voz de profissional, conformes | leitura integral de amostra, schema `Article` | R$ 6.000 a 17.000 |
| 31 páginas de perfil, geradas, 78% de texto único | teste de repetição por sentença | R$ 6.000 a 15.000 |
| ecooa.match: 28 blocos, 604 termos, 115 microtextos, interface acessível, compartilhável | `almanaque.mjs`, teste ponta a ponta | R$ 15.000 a 40.000 |
| Camada técnica: 118 JSON-LD, sitemap, canonicals, 28 redirecionamentos, medição com Consent Mode v2 e eventos próprios, pipeline de geração e gate de 30 invariantes | parse completo, execução local do gate | R$ 15.000 a 35.000 |
| **Soma bruta** | | **R$ 75.000 a 182.000** |

### 7.3 Descontos, com prova

| Desconto | Por quê | Efeito |
| --- | --- | --- |
| Conteúdo não revisado por quem assina | os 14 artigos e as 8 áreas foram redigidos por IA e aguardam a revisão técnica do profissional que os assina (registrado no Bloqueio 7.4 e 7.5). Enquanto isso não acontece, é rascunho com risco, não obra pronta | menos 25% a 35% sobre os R$ 14.000 a 37.000 de conteúdo |
| Dívida documental e projeto duplo | 43 documentos em `docs/`, dos quais apenas 4 mencionam `deploy/` e 6 ainda descrevem o Astro desativado. As únicas dependências de produção declaradas em `package.json` são `astro` e `@astrojs/sitemap`, para um site que não usa Astro. Quem herdar paga a confusão | menos R$ 8.000 a 15.000 |
| Esteira que não trava | CI vermelho hoje, `deploy.yml` independente do `ci.yml`, orçamento de performance medindo cinco stubs vazios | menos R$ 5.000 a 10.000 |
| Último metro quebrado | CTA móvel bloqueado, sem `tel:`, sem agendamento, captação de e-mail em `mailto:`, silo editorial desconectado | menos R$ 8.000 a 15.000 |

### 7.4 Faixa defensável

| Cenário | Faixa | O que sustenta |
| --- | --- | --- |
| **Comprovável hoje**, como está, aceitando os defeitos medidos | **R$ 58.000 a 105.000** | tudo nesta seção é verificável abrindo o repositório |
| **Depois da revisão técnica do conteúdo pelos profissionais** e das quatro correções de último metro | R$ 95.000 a 160.000 | depende de trabalho humano da casa, não de código |
| **Como ativo de receita** | **não estimável** | zero dado de tráfego, lead ou paciente atribuído |

Colocado de outro jeito, que é como o dono deve ler: **o ativo hoje vale
aproximadamente o que custaria refazê-lo, e não mais do que isso**, porque não
existe prova de que ele produz paciente. O caminho entre a faixa de hoje e a
faixa de cima não passa por mais código. Passa por três coisas que só a casa
faz: os profissionais assinarem o que assinam, o Perfil da Empresa no Google
existir com avaliações, e alguém responder o WhatsApp em tempo definido.

### 7.5 O que é comprovável hoje versus o que depende do dono

| Comprovável agora, com evidência no repositório | Depende de ação do dono |
| --- | --- |
| 43.600 palavras de conteúdo próprio em 64 páginas | revisão técnica desse conteúdo por quem assina |
| 118 blocos de dado estruturado válidos | coordenada geográfica exata para o pareamento local |
| Lighthouse 99 desktop, 92 móvel, CLS 0 | desempenho de campo real, que exige o domínio no ar |
| ecooa.match funcionando ponta a ponta | revisão dos 28 blocos e dos 115 textos |
| 31 perfis com 78% de texto único | os 10 registros profissionais faltantes |
| Camada de medição instalada e correta | tags no GTM, `connect-src` na CSP do painel, e o dado começar a chegar |
| Zero promessa de resultado, zero avaliação agregada, zero antes e depois | parecer jurídico de publicidade médica |
| 62 URLs no sitemap, canonicais corretos | Perfil da Empresa no Google, categorias, fotos e avaliações |

---

## 8. Achados por severidade

| # | Severidade | Achado | Prova | Corrigível por IA |
| --- | --- | --- | --- | --- |
| 1 | Crítico | O aviso de privacidade bloqueia o botão flutuante de WhatsApp no celular. Não é sobreposição parcial: `elementFromPoint` no centro do botão devolve o aviso | Playwright 390x844 em `/index.html`: aviso 690 a 832, botão 768 a 828, `elementFromPoint` retorna `DIV "Aviso de privacidade"` | sim, mas está travado pelo Bloqueio 9 do dono |
| 2 | Crítico | O site não mede nada e não medirá sem duas ações externas. O GTM só carrega para quem aceita, não há tag no contêiner, e a CSP de produção provavelmente bloqueia o envio | `scripts/medicao.mjs:podeCarregar()`, `PENDENCIAS-DO-DONO.md` Bloqueio 2 | não |
| 3 | Alto | O gate não trava a publicação e está vermelho. `deploy.yml` não depende de `ci.yml`, e o primeiro passo do `ci.yml` falha | `npm run format:check` EXIT=1 (12 arquivos), `npm audit --audit-level=high` EXIT=1, `deploy.yml` sem `needs` para o CI | sim |
| 4 | Alto | Zero link interno dos 14 artigos para a página de área do tema ou para o perfil de quem assina. 16.125 palavras de autoridade que não irrigam nada | extração de `href` em `<main>` dos 14 artigos: só blog e blog | sim |
| 5 | Alto | Nenhum `tel:` no site inteiro, com o telefone exibido 69 vezes como texto | `grep -rc "tel:" deploy --include=*.html` sem resultado | sim |
| 6 | Alto | A captação de e-mail do editorial, presente em 14 páginas, é um `mailto:` que não captura nada | handler no HTML: `window.location.href = 'mailto:ecooa.adm@gmail.com?...'` | parcialmente, o destino final exige decisão do dono |
| 7 | Alto | "Busca por IA" anunciado em 67 de 67 páginas para um casador de substring, sem modelo, sem embedding, sem chamada externa | `scripts/match.mjs` linhas 148 a 160; `generate-embeddings.mjs` aponta para `src/` desativado e não é chamado por `gerar-site.mjs` | sim, é troca de copy |
| 8 | Alto | 10 dos 31 profissionais sem registro exibido, agora com página nominal indexável | `deploy/dados-ecooa.js`: 5 `a-confirmar`, 5 `a-adicionar` | não, exige o número |
| 9 | Médio | O orçamento de performance mede cinco stubs vazios de nove URLs, e nenhuma página de área, artigo ou perfil além de um | `lighthouserc.json` lista `/ecooa-med/`, `/ecooa-esthetic/`, `/match/`, `/contato/`, `/agendamento/`, todos com 8 palavras em `<main>` | sim |
| 10 | Médio | O laudo declara "0 moderados" em acessibilidade. Medição própria acha 140+ nós `region` e um segundo par de contraste grave em `/sublocacao.html` | axe-core em 14 páginas, 390x844: `/profissionais/` 127 moderados, `/sublocacao.html` 2 graves | sim |
| 11 | Médio | Os 2.085 links internos apontam para variantes `.html`, enquanto os 95 canonicais declaram a URL sem extensão. Três variantes servem o mesmo conteúdo em `profissionais`, `blog` e `especialidades`, com corpo divergente entre duas delas | contagem de `href` e diff entre `profissionais.html` e `profissionais/index.html` | sim |
| 12 | Médio | Nenhum dos 14 artigos tem `dateModified` nem cita fonte externa. Em YMYL, os dois são sinais de qualidade | parse de `Article` nos 14; único link externo por artigo é o CTA de WhatsApp | sim |
| 13 | Médio | Perfis rasos: média de 291 palavras em `<main>`, mínimo de 152. Ficha, não página de autoridade | contagem em `<main>` dos 31 | sim |
| 14 | Médio | 107 procedimentos nomeados vivem como `h3` dentro de 8 páginas. Nenhum tem página própria, e são eles que carregam a intenção comercial de maior valor | contagem de `h3` nas 8 áreas | sim |
| 15 | Médio | As três URLs de maior intenção comercial, `/agendamento/`, `/contato/` e `/clinica-moinhos-de-vento/`, são redirecionamentos para a página de endereço | `meta refresh` nos três stubs | não sem decisão do dono sobre agendamento |
| 16 | Baixo | 114 blocos "Também procurado como" despejam vocabulário de busca sem acento no texto visível de 31 páginas, contrariando a regra do próprio `CLAUDE.md` | *"perdi minha mae, perdi meu pai, falecimento, nao aguento mais"* em perfil publicado | sim |
| 17 | Baixo | 28 stubs de redirecionamento são indexáveis, sem `noindex`, com 16 compartilhando o título "Página movida · ecooa" e 12 compartilhando "Página movida" | `grep noindex` acha só `politicas.html` e `404.html` | sim |
| 18 | Baixo | 32 de 95 títulos passam de 60 caracteres, com máximo de 99. Serão truncados na página de resultados | parse de `<title>` das 95 | sim |
| 19 | Baixo | 31 arquivos de asset com espaço ou maiúscula no nome, servidos com escape (`natalie%20pb.webp`, `jessica .webp` com espaço antes da extensão) | listagem de `deploy/assets/retratos/` | sim |
| 20 | Baixo | Dívida documental: 43 documentos em `docs/`, 4 mencionam `deploy/`, 6 ainda descrevem o Astro. `package.json` declara `astro` como dependência de produção de um site que não usa Astro | contagem por `grep -l` e leitura de `package.json` | parcialmente |

Duas notas de justiça, porque a banca também se corrige. Uma verificação
intermediária minha acusou 22 referências quebradas para `assets/vendor/react`.
**Era falso positivo do meu script.** A reexecução confirmou **zero** asset
quebrado em 49 referências, e nenhuma menção a React em `deploy/`. E o
`validate-output.mjs`, rodado localmente, passa limpo nos 30 invariantes: o
problema não é o gate, é o gate não ser executado onde importa.

---

## 9. O que não foi possível verificar

1. **Qualquer coisa sobre produção.** O domínio `www.somosecooa.com.br` não é
   alcançável deste ambiente. Não sei se o site no ar é este artefato, se os
   cabeçalhos da Cloudflare são os que a sessão descreve, nem se a origem de
   publicação em `Settings > Pages` é o workflow.
2. **Desempenho de campo.** CrUX e PageSpeed Insights exigem o domínio. Os
   números aqui são de laboratório, sem compressão e sem `Cache-Control`, o que
   os deixa conservadores em algumas auditorias e otimistas em latência de rede.
3. **Estado dos workflows no GitHub.** A API não é alcançável. A conclusão de
   que o CI está vermelho vem da execução local dos mesmos comandos, não da aba
   Actions.
4. **Concorrência real em Porto Alegre.** Não medi nenhum site concorrente nem
   consultei posição em busca. A seção 6 compara com o padrão típico do setor,
   que é conhecimento de mercado, não medição desta sessão. Trate aquela tabela
   como referência, não como levantamento competitivo.
5. **Perfil da Empresa no Google, avaliações, mapa.** Nada disso está no
   repositório. É provavelmente o maior determinante isolado de busca local para
   esta clínica e está inteiramente fora do meu alcance.
6. **Volume de busca dos 604 termos do almanaque.** Não tenho ferramenta de
   palavra-chave aqui. Não sei se os blocos cobrem a demanda real de Porto
   Alegre, apenas que cobrem 31 profissionais e 28 famílias de queixa.
7. **Precisão clínica do conteúdo.** Li amostras e não encontrei promessa de
   resultado nem superlativo. Não sou, e a banca não substitui, o profissional
   que assina.
8. **Chegada do lead.** Os 486 CTAs apontam para o mesmo número. Se alguém
   responde, em quanto tempo, e o que acontece com quem escreve às 22h de
   sábado, é operação, e não se audita por HTML.
9. **Leitor de tela real.** As medições de acessibilidade são automatizadas.
   NVDA, VoiceOver e TalkBack exigem pessoa.
10. **Preços praticados e ticket médio.** Sem isso, nenhuma estimativa de
    retorno sobre o investimento no ativo é possível, e nenhuma foi feita.

---

## 10. Veredito

**Aprovado com ressalvas, nota 63.**

O que foi construído tem valor real e é, na maior parte, comprovável. As 43.600
palavras de conteúdo próprio, os 118 blocos de dado estruturado válidos, os 99
e 92 de Lighthouse, as 31 páginas de profissional com 78% de texto único e o
ecooa.match funcionando ponta a ponta com 28 blocos e 604 termos curados
colocam este site acima do padrão da concorrência em tudo que diz respeito a
construção. O fosso defensável existe, e não é o software: é a curadoria do
almanaque, que veio de entrevista com quem opera a clínica e que ninguém copia
com orçamento.

A ressalva é que o ativo foi construído até a porta e parou ali. O botão de
conversão mais importante está fisicamente bloqueado no celular, não há clique
para ligar, não há agendamento, a captação de e-mail é um `mailto:` que não
captura, 16.125 palavras de editorial não passam um link para a página que
vende, e a camada de medição, que está tecnicamente correta, coleta zero. Some
a isso que o gate não impede publicação e está vermelho agora, e que o melhor
ativo da casa é anunciado como "IA" em 67 páginas sem sê-lo.

Nada disso é falha de arquitetura. É lista de tarefas, e a maior parte cabe em
alguns dias. Mas enquanto estiver aberta, a frase honesta sobre o ativo é esta:
**vale aproximadamente o que custaria refazê-lo, entre R$ 58.000 e R$ 105.000
de valor de reposição comprovável, e não vale, ainda, um centavo de valor de
receita, porque não existe uma única medição que ligue este site a um
paciente.**

A distância entre as duas coisas não se fecha com mais código. Fecha-se com os
profissionais assinando o que assinam, com um Perfil da Empresa no Google vivo
e avaliado, com um caminho de conversão que funcione às 22h de sábado, e com
alguém respondendo o WhatsApp em tempo combinado. Até lá, o site é uma máquina
bem construída, cara de refazer, e desligada.

### Ordem sugerida, por retorno sobre esforço

1. Desbloquear o CTA de WhatsApp no celular. É uma linha de CSS e é a perda mais
   cara em operação. Está parado esperando a ordem do dono.
2. Ligar os 14 artigos à página de área e ao perfil de quem assina, e as 8 áreas
   aos artigos do tema. Horas de trabalho, efeito composto em busca e em
   conversão.
3. Transformar as 69 aparições do telefone em `tel:`.
4. Trocar "busca por IA" por uma descrição do que a ferramenta faz. Protege o
   melhor ativo da casa.
5. Fazer o `deploy.yml` depender do `ci.yml`, rodar `prettier --write` e
   `npm audit fix`, e trocar os cinco stubs do `lighthouserc.json` por páginas
   de área, artigo e perfil.
6. Resolver os Bloqueios 2 e 3 do dono: tags no GTM com a CSP liberada, e o
   Perfil da Empresa no Google com avaliações. São os dois que mais movem o
   ponteiro de "top1".
