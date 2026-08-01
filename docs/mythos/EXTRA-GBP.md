# Tribunal Extra · Perfil da Empresa no Google e SEO local

> Auditoria independente, somente leitura. Nenhum arquivo de `deploy/`,
> `src-site-3/` ou `scripts/` foi alterado por este tribunal.
>
> **Estado auditado:** commit `506de9ae22cdd52e77e3c198a74cd40055b1d8de`
> (`fix(etica): tira a queixa da URL e retira do indice quem nao tem registro`),
> de 2026-08-01 16:52 UTC.
> **Laboratório:** `http://localhost:4353`, servindo `deploy/` com a CSP que
> `/tmp/csptest.py` declara reproduzir a regra de painel da Cloudflare.
> **Domínio real:** `www.somosecooa.com.br` não é alcançável deste ambiente.
> Nenhuma afirmação abaixo depende de acesso ao domínio ou ao Google.

---

## 1. Método

Este tribunal julga uma pergunta só: **o site, do jeito que está publicado hoje,
sustenta um Perfil da Empresa no Google que consiga disputar o pacote local de
Moinhos de Vento?**

Não julgo o perfil, que não existe no repositório e não é alcançável daqui.
Julgo o lado que é código, porque é o lado que a IA pode verificar linha a
linha, e monto o passo a passo do lado que é painel.

O que foi feito, em ordem:

1. Leitura integral de `docs/mythos/EXECUCAO.md`,
   `docs/mythos/PENDENCIAS-DO-DONO.md`, `docs/mythos/SCORECARD-FINAL.md`,
   `docs/MYTHOS-ARQUITETURA.md` e dos dez laudos de `docs/mythos/baseline/`.
2. Extração e parse de **todo** o JSON-LD dos 95 arquivos HTML de `deploy/`,
   com contagem por tipo de nó e verificação de sintaxe.
3. Varredura de NAP: toda ocorrência de `Mariante`, `90430-180`, `99146-0909`
   e `Moinhos` em HTML, em JS e nos templates de `src-site-3/`, separando o que
   está dentro de `<script>` do que é texto visível.
4. Inventário de `<title>`, `<h1>`, `meta description`, `canonical` e
   `meta robots` das 95 páginas, cruzado com as 57 URLs do `sitemap.xml`.
5. Contagem de termos locais dentro de `<main>` das 8 páginas de área e dos 14
   artigos, para separar sinal local real de sinal de rodapé.
6. Conferência dos links internos: 2.085 `href` internos terminados em `.html`
   contra canonicals sem extensão.
7. Requisições reais ao laboratório para conferir código de status e cabeçalhos
   servidos.
8. Leitura de `scripts/estruturados.mjs`, `scripts/perfis.mjs`,
   `scripts/sitemap.mjs`, `scripts/validate-output.mjs`, `deploy/_headers`,
   `deploy/robots.txt` e `wrangler.jsonc`.

Regra que segui: **declaração em documento não vale prova.** Cada afirmação de
`EXECUCAO.md` e de `SCORECARD-FINAL.md` que toca busca local foi conferida no
arquivo. Onde bateu, está registrado como crédito. Onde não bateu, virou achado.

---

## 2. O que está certo, e é preciso dizer

Confrontei as declarações da sessão com o HTML. Estas se sustentam:

| Declaração | Verificação | Veredito |
| --- | --- | --- |
| "a home e a página de localização publicam a entidade `MedicalClinic`" | `MedicalClinic` presente em `deploy/index.html`, `deploy/localizacao.html` e também em `deploy/sobre.html` | **confirmado, e melhor que o declarado** |
| "NAP exatamente como publicado, sem inventar nada" | `streetAddress: 'Rua Mariante, 180, 9º andar'`, `postalCode: '90430-180'`, `telephone: '+55-51-99146-0909'`, `openingHoursSpecification` seg a sex 08:00 às 20:00, todos batendo com o rodapé visível | **confirmado para o nó principal** |
| "sem `aggregateRating` e sem `Review`" | zero ocorrências nos 95 arquivos; `scripts/validate-output.mjs` falha se aparecerem | **confirmado** |
| "todo JSON-LD sintaticamente válido" | os 95 arquivos parseados, zero erro de JSON | **confirmado** |
| "`hasMap` e `areaServed` instalados" | presentes nos 3 nós de clínica | **confirmado, com ressalva de qualidade (achado A-04)** |
| rodapé com NAP em todas as páginas | `90430-180` em texto visível, fora de `<script>`, em **67 de 67** páginas reais | **confirmado** |
| página de localização dedicada | `deploy/localizacao.html`, com `<title>` carregando rua, bairro e cidade, `meta description` com o endereço completo, seções de como chegar, estacionamento, acessibilidade e mapa estático linkando para o Maps | **confirmado** |
| cidade nos títulos das páginas que disputam busca | 47 dos 95 `<title>` carregam "Porto Alegre", incluindo as 8 áreas (`Medicina em Porto Alegre · ecooa`) e os 26 perfis indexáveis | **confirmado** |
| `FAQPage` nas 8 áreas | 8 nós, com perguntas de intenção local alta (preço, convênio, encaminhamento, online) | **confirmado, e é ativo real** |
| responsável técnico visível | `RT Gustavo Gehrke · CREMERS 35.822` no rodapé de todas as páginas | **confirmado** |

Isso não é pouco. O laudo de baseline `docs/mythos/baseline/seo-tecnico.md`
registrava, na linha 140, "**Zero `LocalBusiness`. Zero `MedicalClinic`. Zero
`Organization` de site**", e na linha 144 que `/localizacao` tinha zero JSON-LD.
A entidade central de busca local passou de inexistente a existente e correta no
nó principal. É a maior conquista desta sessão no meu eixo, e ela é real.

Também registro como acerto duas decisões que muita agência erraria:

- **Nenhuma nota agregada em schema.** Nota agregada em publicidade médica é
  terreno vedado, e o gate impede a volta. Está certo.
- **A queixa clínica saiu da URL do WhatsApp.** Dado de saúde em querystring é
  vazamento por desenho. Corrigido no commit `506de9a`.

---

## 3. Achados

### A-01 · Trinta e um perfis publicam um segundo endereço da clínica, divergente e incompleto

**Severidade: alta. Corrigível por IA.**

Cada uma das 31 páginas de profissional carrega um nó `Person` com `worksFor`
contendo uma `MedicalClinic` **embutida e diferente** da entidade oficial:

```
scripts/perfis.mjs:32
const ENDERECO = { rua: 'Rua Mariante, 180', bairro: 'Moinhos de Vento', cidade: 'Porto Alegre', uf: 'RS' };

scripts/perfis.mjs:124-135
worksFor: {
  '@type': 'MedicalClinic',
  name: 'ecooa',
  url: DOMINIO + '/',
  address: { '@type': 'PostalAddress', streetAddress: ENDERECO.rua, ... },
}
```

Contra o nó oficial de `scripts/estruturados.mjs:36`:

```
streetAddress: 'Rua Mariante, 180, 9º andar',
postalCode: '90430-180',
```

Medição no HTML publicado: **31 de 31** nós `Person` têm `worksFor` com
`streetAddress` sem o `9º andar`, **sem `postalCode`**, **sem `telephone`** e
**sem `@id`** apontando para `https://www.somosecooa.com.br/#clinica`.

Por que isso importa neste tribunal, e não em outro: consistência de NAP é o
mecanismo pelo qual o Google decide que o site, o perfil e as citações externas
falam da **mesma** entidade. Publicar duas variantes do endereço dentro do
próprio domínio, sem `@id` que as una, é entregar ao Google duas entidades
candidatas. Não é fatal, mas é exatamente o defeito que se paga em pareamento.

O documento `docs/mythos/P13-QA-FINAL.md`, linha 204, afirma "`MedicalClinic` na
home com NAP idêntico ao publicado". A afirmação é verdadeira **para a home** e
falsa para as outras 31 páginas que também publicam uma clínica. A auditoria de
QA olhou o nó certo e não olhou os outros.

**Correção:** trocar o objeto `worksFor` inteiro por
`worksFor: { '@id': 'https://www.somosecooa.com.br/#clinica' }` e definir o nó
`CLINICA` também nessas páginas, ou usar `@graph` com a clínica completa.

---

### A-02 · O bairro não existe dentro do endereço postal, em lugar nenhum

**Severidade: alta. Corrigível por IA.**

"Moinhos de Vento" é o campo de batalha comercial desta clínica, e não está
dentro do endereço. Está em volta dele.

No schema, `PostalAddress` tem `streetAddress`, `addressLocality` (Porto
Alegre), `addressRegion` (RS) e `postalCode`. **O bairro não aparece.**

No rodapé de todas as 67 páginas, o bloco de endereço é:

```
Rua Mariante, 180 · 9º andar
Porto Alegre, RS · 90430-180
Segunda a sexta, 8h às 20h
```

O bairro aparece só como sobrancelha decorativa acima (`ecooa · moinhos de vento
· porto alegre`) e em prosa espalhada. Não faz parte do endereço.

O problema prático: quando o perfil for criado, o Google vai publicar o endereço
com o bairro, porque o padrão brasileiro do Maps inclui. A citação do site
deixa de bater caractere a caractere com a citação do perfil, que é justamente
o critério que `PENDENCIAS-DO-DONO.md` manda seguir no Bloqueio 3, item 2.

**Correção:** `streetAddress: 'Rua Mariante, 180, 9º andar, Moinhos de Vento'` e
o mesmo bloco no rodapé. Custa uma linha em dois arquivos.

---

### A-03 · Nada no schema aponta para o perfil, e não há coordenada

**Severidade: alta. Parcialmente corrigível por IA (depende do pino).**

O nó `MedicalClinic` tem:

- **sem `geo`**. Omissão declarada e justificada em `scripts/estruturados.mjs:14`
  com "não temos o valor exato e chutar coordenada prejudica o pareamento".
  A primeira metade é verdade e a segunda é folclore: coordenada não é o que
  pareia site e perfil, e o efeito de uma coordenada aproximada em `geo` é
  neutro a levemente positivo, nunca punitivo. O correto é pegar a coordenada
  do pino, e isso já está pedido no Bloqueio 3, item 4. Mas a justificativa
  registrada no código está errada e vale corrigir para não virar dogma.
- **`hasMap` é uma URL de busca**, não do lugar:
  `https://www.google.com/maps/search/?api=1&query=ecooa%20Rua%20Mariante%20180%20Moinhos%20de%20Vento%20Porto%20Alegre`.
  Quem clicar cai numa busca. Se houver homônimo, concorrente ou grafia
  diferente, o Maps decide o que mostrar. Depois do perfil criado, isso precisa
  virar a URL do lugar.
- **`sameAs` tem um único item**, o Instagram. Sem o perfil do Google Maps, sem
  Doctoralia, sem LinkedIn, sem Facebook. `sameAs` é o mecanismo canônico de
  desambiguação de entidade, e está com um item só.

Detalhe menor no mesmo bloco: o rodapé linka `https://instagram.com/somos.ecooa`
e o `sameAs` declara `https://www.instagram.com/somos.ecooa/`. Duas strings para
o mesmo perfil.

---

### A-04 · As 8 páginas de área referenciam uma entidade que não existe naquela página

**Severidade: média. Corrigível por IA.**

`deploy/especialidades/medicina/index.html` traz:

```json
{ "@type": "MedicalWebPage",
  "@id": ".../especialidades/medicina/#pagina",
  "about": { "@id": "https://www.somosecooa.com.br/#clinica" } }
```

O nó `#clinica` **não é definido nessa página**. É uma referência pendurada.

JSON-LD permite `@id` entre documentos, mas o Google consolida grafo por página
na esmagadora maioria dos casos. Resultado prático: as 8 páginas que disputam
exatamente as consultas comerciais (`nutricionista em porto alegre`,
`tricologia porto alegre`) não têm entidade de negócio local nenhuma. A home
tem, e a home não é a página que responde a essas consultas.

O laudo `docs/mythos/baseline/seo-tecnico.md`, linha 356, já apontava
`nutricionista moinhos de vento → /especialidades/nutricao/` como consulta alvo.
A página alvo continua sem entidade local própria.

**Correção:** repetir o nó `CLINICA` completo dentro do `@graph` das 8 áreas e
dos 26 perfis indexáveis. É repetição legítima e é o padrão recomendado.

---

### A-05 · A cidade quase não aparece nos H1, e o bairro nunca aparece

**Severidade: média. Corrigível por IA, mas mexe em aparência.**

Medição sobre os 95 arquivos:

| Sinal | Contagem |
| --- | ---: |
| `<title>` com "Porto Alegre" | 47 de 95 |
| `<title>` com "Moinhos de Vento" | **6 de 95** |
| `<h1>` com "Porto Alegre" | **1 de 95** |
| `<h1>` com "Moinhos de Vento" | **0 de 95** |
| `meta description` com "Porto Alegre" | 46 de 95 |
| `meta description` com "Moinhos de Vento" | 43 de 95 |

Os 6 títulos com bairro são home, localização, profissionais (duas cópias),
sobre e sublocação. **Nenhuma das 8 áreas** e **nenhum dos 26 perfis** carrega o
bairro no título. O único H1 com cidade é `Medicina integrada em Porto Alegre.`

Dentro de `<main>`, o sinal local é ralo mas presente: cada área menciona
"Porto Alegre" 1 ou 2 vezes e "Moinhos" 1 ou 2 vezes em 1.500 a 1.750 palavras.
A palavra "bairro" não aparece nenhuma vez nas 8 áreas.

Ressalva honesta: o `CLAUDE.md` do projeto trata a voz de marca como ativo, e o
Bloqueio 9 registra que o dono pediu que nenhuma mudança de aparência aconteça
sem ordem dele. Portanto isto fica como recomendação, não como correção
pendente: o ganho está em levar bairro e cidade para a **linha de apoio abaixo
do H1** e para o primeiro parágrafo, sem tocar no H1 em si.

---

### A-06 · Dois artigos prometem cidade na URL e não entregam cidade em lugar nenhum

**Severidade: média. Corrigível por IA.**

| URL | "Porto Alegre" no title | no H1 | no corpo |
| --- | --- | --- | --- |
| `/blog/rejuvenescimento-facial-porto-alegre/` | não | não | **0 ocorrências em 1.255 palavras** |
| `/blog/transplante-capilar-porto-alegre/` | não | não | **0 ocorrências em 1.297 palavras** |

Os títulos são `Rejuvenescimento facial sem perder a expressão · editorial
ecooa` e `Transplante capilar: quem tem indicação e quem não tem · editorial
ecooa`. Nenhum dos 14 artigos menciona Porto Alegre ou Moinhos de Vento no
corpo.

Slug geolocalizado com página sem geolocalização é o pior dos dois mundos: a URL
sinaliza intenção local ao Google, a página não confirma, e o desalinhamento
entre URL e conteúdo é lido como sinal de baixa qualidade. Ou o conteúdo passa a
falar de onde o cuidado acontece, ou o slug muda e ganha 301.

---

### A-07 · Toda ligação interna aponta para uma URL que os canonicals negam

**Severidade: alta. Corrigível por IA.**

Contagem de `href` internos terminados em `.html` nos 95 arquivos:

```
   368  profissionais.html
   284  blog.html
   277  especialidades.html
   272  localizacao.html
   269  sublocacao.html
   210  qual-profissional-procurar.html
   204  mentorias.html
   201  sobre.html
   ----
  2.085  total
```

E os canonicals e o `sitemap.xml` declaram as versões **sem extensão**:
`https://www.somosecooa.com.br/localizacao`.

Ou seja: o Google chega ao site pelo sitemap na versão sem extensão, e depois
100% da navegação interna o empurra para a versão `.html`, que responde 200 e
tem canonical apontando de volta. Dois endereços rastreáveis para cada página
principal, com toda a força de link interna concentrada na variante que o
próprio site declara não ser a oficial.

Medido no laboratório:

```
$ curl -o /dev/null -w "%{http_code}" http://localhost:4353/localizacao
404
$ curl -o /dev/null -w "%{http_code}" http://localhost:4353/localizacao.html
200
```

O laboratório é um `SimpleHTTP` do Python e não emula o GitHub Pages, então esse
404 não prova o comportamento em produção. Mas prova outra coisa: **a URL que o
site declara como canônica e que ele mesmo publica no sitemap não é servida por
nenhum ambiente verificável deste repositório.** No `wrangler.jsonc`,
`html_handling: "auto-trailing-slash"` resolveria o caso na Cloudflare. No
GitHub Pages de hoje, é fé.

Para busca local isso é caro por um motivo específico: a página de localização é
o destino natural de toda citação externa, do link do perfil e do "como chegar".
Se ela tem duas versões, a autoridade se divide na página que menos pode se dar
ao luxo disso.

---

### A-08 · Lead vindo do perfil é indistinguível de qualquer outro

**Severidade: média. Corrigível por IA.**

Busca por `utm` em `scripts/*.mjs` e em `deploy/*.html`: **zero ocorrências.**

Os 480 CTAs de WhatsApp do site são do formato
`https://wa.me/5551991460909?text=...`, com texto personalizado por página e por
profissional, o que é bom, mas **sem nenhum parâmetro de origem**. O
`scripts/medicao.mjs` dispara `whatsapp_click` com página, profissional, área e
posição do botão, e não com origem de tráfego.

Consequência direta neste tribunal: quando o perfil entrar no ar e começar a
mandar gente, não haverá como responder a pergunta que decide o orçamento do ano
seguinte, que é "quantos pacientes vieram do Perfil da Empresa". O `utm_campaign`
precisa nascer no link do perfil e sobreviver até o texto do WhatsApp, ou pelo
menos até o evento do dataLayer.

---

### A-09 · O NAP está codificado à mão em pelo menos dez lugares, com duas grafias

**Severidade: média. Corrigível por IA.**

`deploy/dados-ecooa.js`, que é a fonte de dados do site, **não contém endereço,
telefone nem horário**. Grep por `Mariante` e por `99146` retornou zero nesse
arquivo.

O NAP vive espalhado:

| Arquivo | O que declara |
| --- | --- |
| `scripts/estruturados.mjs:36` | `Rua Mariante, 180, 9º andar` + CEP |
| `scripts/perfis.mjs:32` | `Rua Mariante, 180` sem andar, com bairro à parte |
| `scripts/perfis.mjs:31` | `const WA = '5551991460909'` |
| `scripts/artigos.mjs:15`, `conversao.mjs:32`, `areas.mjs:22`, `match.mjs:47`, `mobile.mjs:54`, `mosaico.mjs:215` | o mesmo número, seis vezes |
| `src-site-3/Rodape.dc.html:80` | bloco de endereço do rodapé |
| `src-site-3/localizacao.html` | endereço em 6 pontos distintos |

Sem fonte única, a divergência do achado A-01 não foi um descuido, foi uma
consequência estrutural. Qualquer mudança futura de endereço, de sala, de andar
ou de telefone vai vazar por alguma dessas onze frestas. Um invariante no
`validate-output.mjs` que falhe se aparecer literal de endereço fora da fonte
única resolveria de vez.

---

### A-10 · Não existe URL de agendamento para dar ao perfil

**Severidade: média. Corrigível por IA.**

O Perfil da Empresa no Google tem um campo próprio de link de agendamento, que
aparece em botão destacado e converte melhor que o link do site. O que o site
tem para oferecer hoje:

- `deploy/agendamento/index.html` é um stub de `meta refresh` para
  `/localizacao`, sem JSON-LD, sem conteúdo.
- Todo o resto é `wa.me`. Link para mensageiro de terceiro nesse campo costuma
  ser rejeitado ou removido, e não devolve atribuição nenhuma.

Falta uma página `/agendar` real, indexável, com a entidade da clínica, o
horário e o caminho para cada área.

---

### A-11 · A CSP que vale hoje bloqueia mapa embutido

**Severidade: média. Não corrigível por IA (é painel).**

Cabeçalho servido pelo laboratório, que `/tmp/csptest.py` declara reproduzir a
regra de painel da Cloudflare em vigor:

```
default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
https://*.clarity.ms https://*.google-analytics.com https://*.googletagmanager.com
https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
font-src 'self'
```

**Sem `frame-src`.** Com `default-src 'self'`, qualquer `<iframe>` do Google Maps
é bloqueado pelo navegador. O `deploy/_headers` já traz
`frame-src https://www.google.com https://maps.google.com ...`, mas o GitHub
Pages ignora esse arquivo, conforme o Bloqueio 6.

Registro como achado e não como defeito grave por um motivo: a página de
localização usa hoje um **mapa estático** (`assets/mapa-ecooa.webp`, com `alt`
descritivo citando Mostardeiro, Dona Laura e Parcão) linkando para o Maps. É
mais rápido que o iframe, não vaza dado do visitante para o Google antes do
consentimento e não custa LCP. É uma escolha defensável. Só precisa ficar
consciente: **mapa embutido não é uma opção disponível hoje**, e a página não
está perdendo nada relevante por isso.

---

### A-12 · Vinte e oito URLs legadas, incluindo `/clinica-moinhos-de-vento`, só têm `meta refresh`

**Severidade: baixa. Não corrigível por IA no hosting atual.**

Não existe `deploy/_redirects`. As 28 URLs antigas são stubs de
`<meta http-equiv="refresh">` mais `location.replace`.

Duas delas são exatamente os alvos clássicos de citação local:
`/clinica-moinhos-de-vento` e `/contato`. Se houver link antigo, diretório ou
citação apontando para lá, a força passa por um caminho mais lento e menos
confiável que um 301. No GitHub Pages estático não há alternativa. Na Cloudflare
haverá, e o arquivo precisa nascer junto do cutover.

---

### A-13 · Documentos da sessão já não descrevem o estado do repositório

**Severidade: baixa. Corrigível por IA.**

`EXECUCAO.md` afirma "O `sitemap.xml` passou de 31 para 62 URLs" e "31 páginas
individuais de profissional". `SCORECARD-FINAL.md` repete "URLs indexáveis no
sitemap 31 → 62" e "Profissionais com página própria 0 → 31".

Medido no HEAD `506de9a`:

```
sitemap URLs: 57
perfis no sitemap: 26
noindex: 404, politicas, adriana, gabrieli-avila, giancarla-rochemback, lara-caye, marvin-marques
```

O commit `506de9a` tirou do índice os cinco profissionais sem registro, por
decisão ética correta e bem justificada em `scripts/perfis.mjs:264-270`. A
decisão é boa. Os documentos ficaram um commit atrás dela.

Registro como baixo porque a defasagem é de uma hora e a direção da mudança é
para melhor. Mas quem ler o placar amanhã vai contar 62 e encontrar 57.

---

### A-14 · Miudezas que somam em confiança local

**Severidade: baixa. Corrigíveis por IA.**

1. `© 2021 ecooa` no rodapé de **67 de 67** páginas, em 2026. Sinal barato de
   abandono, e o Google não é o único que lê rodapé.
2. `telephone: '+55-51-99146-0909'`. E.164 puro (`+555199146909`) é o formato
   que o Google recomenda e que evita ambiguidade de parse.
3. `areaServed` só Porto Alegre e Rio Grande do Sul, enquanto a própria página
   de localização diz "Atendimento a distância para todo o Brasil". Falta um
   `Country BR` para o serviço online, ou tirar a promessa.
4. Sem `priceRange` no `MedicalClinic`. As FAQs respondem a pergunta de preço em
   prosa, com honestidade, e o schema fica mudo. `priceRange: '$$$'` é
   inofensivo e preenche um campo que o Google usa.
5. Nenhum elemento `<address>` e nenhum `itemprop` no rodapé. JSON-LD basta,
   então isto é apenas um comentário, não uma cobrança.

---

## 4. Tabela consolidada

| # | Severidade | Achado | Prova | IA corrige |
| --- | --- | --- | --- | --- |
| A-01 | **alta** | 31 perfis publicam segunda clínica com endereço divergente, sem CEP, sem telefone e sem `@id` | `scripts/perfis.mjs:124-135`; 31 de 31 nós `Person` medidos no HTML | sim |
| A-02 | **alta** | bairro fora do endereço postal, no schema e no rodapé das 67 páginas | `scripts/estruturados.mjs:34-40`; bloco de rodapé de `deploy/index.html` | sim |
| A-03 | **alta** | sem `geo`, `hasMap` é URL de busca, `sameAs` com um item só | `scripts/estruturados.mjs:14, 69-71` | parcial |
| A-07 | **alta** | 2.085 links internos `.html` contra canonicals sem extensão; `/localizacao` responde 404 no laboratório | contagem nos 95 arquivos; `curl` no laboratório | sim |
| A-04 | média | 8 áreas referenciam `#clinica` sem definir o nó na página | JSON-LD de `deploy/especialidades/medicina/index.html` | sim |
| A-05 | média | 0 de 95 H1 com bairro, 1 de 95 com cidade, 6 de 95 títulos com bairro | inventário das 95 páginas | sim, mexe em aparência |
| A-06 | média | dois artigos com slug `-porto-alegre` e zero menção à cidade | 0 ocorrências em 1.255 e 1.297 palavras de `<main>` | sim |
| A-08 | média | zero UTM no site e nenhum parâmetro de origem nos 480 CTAs de WhatsApp | grep `utm` em `scripts/` e `deploy/` | sim |
| A-09 | média | NAP codificado em 11 pontos, com duas grafias; `dados-ecooa.js` não tem NAP | grep `Mariante` e `99146` em `scripts/` e `src-site-3/` | sim |
| A-10 | média | sem URL de agendamento para o campo do perfil; `/agendamento` é stub | `deploy/agendamento/index.html` | sim |
| A-11 | média | CSP em vigor sem `frame-src` bloqueia mapa embutido | cabeçalho servido em `localhost:4353` | não, é painel |
| A-12 | baixa | 28 URLs legadas com `meta refresh`, sem `_redirects` | ausência de `deploy/_redirects`; 28 stubs | não, no hosting atual |
| A-13 | baixa | documentos dizem 62 URLs e 31 perfis; o repositório tem 57 e 26 | `deploy/sitemap.xml` no HEAD `506de9a` | sim |
| A-14 | baixa | `© 2021` em 67 páginas, telefone fora de E.164, `areaServed` incoerente com o online, sem `priceRange` | rodapé e `scripts/estruturados.mjs` | sim |

---

## 5. Passo a passo do dono no painel do Perfil da Empresa

Nada aqui pode ser feito por IA. Tudo exige a conta, o prédio e a pessoa.

### Fase 0 · Antes de clicar em qualquer coisa

1. **Procurar antes de criar.** No Google Maps, buscar `ecooa`, depois
   `Rua Mariante 180 Porto Alegre`, depois o nome de cada sócio. Se já existir
   ficha da ecooa, mesmo não reivindicada, mesmo com dado errado, **reivindique
   aquela ficha**. Criar uma nova em cima de uma existente gera duplicata, e
   duplicata divide avaliação, divide histórico e é a causa número um de
   suspensão.
2. **Decidir a conta dona.** Uma conta Google da empresa, nunca a pessoal de um
   funcionário. Depois adicione gerentes. Perfil preso à conta de quem saiu da
   empresa é um problema que leva meses para desfazer.
3. **Print de tudo antes de mexer.** O Google não mostra histórico de versões ao
   proprietário.

### Fase 1 · Reivindicar e verificar

4. `business.google.com` → adicionar ou reivindicar. A verificação hoje é quase
   sempre por vídeo, numa gravação única e sem cortes. Prepare o roteiro antes:
   fachada do prédio com a placa da rua visível, entrada, elevador, o número do
   9º andar, a sinalização da ecooa ao sair do elevador, a recepção, e por fim
   algo que prove gestão (agenda aberta, chave, computador logado no painel do
   site). O Bloqueio 7 pede fotos novas do espaço. Aproveite a mesma visita.
5. **Endereço, campo a campo.** Logradouro `Rua Mariante`, número `180`,
   complemento `9º andar`, bairro `Moinhos de Vento`, CEP `90430-180`, cidade
   `Porto Alegre`, estado `RS`. Depois que o achado A-02 for corrigido, isso vai
   bater caractere a caractere com o site.
6. **Arrastar o pino** até a entrada real do prédio, não até o centro do
   quarteirão. Depois abra o lugar no Maps, copie a latitude e a longitude da
   URL e mande. É o insumo do achado A-03.

### Fase 2 · Preencher

7. **Nome: `ecooa`. Só.** Nada de "ecooa Clínica de Nutrição e Estética em
   Moinhos de Vento". Empilhar palavra-chave no nome é a infração mais fácil de
   denunciar, qualquer concorrente pode pedir a correção em dois cliques, e o
   custo é suspensão.

8. **Categoria principal: `Clínica médica`.**

   Razão: é a categoria que casa com a entidade `MedicalClinic` já publicada no
   schema, descreve o que o negócio é (uma casa multidisciplinar, não um
   consultório de especialidade) e é a que disputa `clínica em Moinhos de
   Vento`, `clínica Porto Alegre` e as buscas por sintoma com intenção de
   consulta. A alternativa `Clínica` é mais larga e mais fraca. `Médico` é
   categoria de profissional, errada para a ficha do endereço.

   Aviso de peso: a categoria principal é a alavanca categórica mais forte do
   pacote local e mexer nela depois embaralha o histórico de relevância.
   Escolha uma vez, meça três meses, só troque com motivo escrito.

9. **Categorias secundárias, em ordem de relevância comercial real.** Adicione
   apenas as que correspondem a alguém que de fato atende no 9º andar:

   | Ordem | Categoria sugerida | Por quê |
   | --- | --- | --- |
   | 1 | `Nutricionista` | 12 dos 31 profissionais. É o maior bloco da casa. |
   | 2 | `Clínica de estética` | 9 profissionais entre facial e corporal. |
   | 3 | `Psicólogo` | 3 profissionais em saúde mental. |
   | 4 | `Clínica de transplante capilar` | diferencial de ticket alto, com página própria. |
   | 5 | `Fisioterapeuta` | cobre a osteopatia, que tem perfil e conteúdo próprios. |

   **Três regras que valem mais que a lista acima.** Primeira: os nomes exatos
   das categorias mudam sem aviso e variam por país. Confira no próprio campo
   do painel, digitando as primeiras letras, e escolha o que o Google oferecer.
   Segunda: **não declare categoria de especialidade médica sem que exista
   médico com aquela especialidade registrada atendendo no endereço.** Vale para
   `Dermatologista`, `Endocrinologista`, `Ginecologista` e afins. Isso é
   exatidão perante o Google e é anúncio de especialidade perante o conselho,
   duas exposições ao mesmo tempo, e conversa direto com o Bloqueio 4, que
   registra dez profissionais sem número de registro confirmado. Terceira:
   categoria secundária que não corresponde a serviço prestado dilui a principal.
   Menos e certo bate mais e vago.

10. **Horário:** segunda a sexta, 08:00 às 20:00, igual ao site e ao
    `openingHoursSpecification`. Cadastre **horário especial** para todo feriado
    do ano, de uma vez. Perfil com horário desatualizado em feriado perde
    posição e ganha avaliação ruim de porta fechada.

11. **Telefone:** `(51) 99146-0909` como principal. Se existir fixo, ponha o
    fixo como principal e o celular como secundário: número fixo local ainda é
    lido como sinal de estabelecimento fixo.

12. **Site:**
    `https://www.somosecooa.com.br/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
    O canonical da home protege a indexação, e você ganha a atribuição que o
    achado A-08 mostra que hoje não existe.

13. **Link de agendamento:** enquanto a página do achado A-10 não existir,
    aponte para
    `https://www.somosecooa.com.br/localizacao?utm_source=google&utm_medium=organic&utm_campaign=gbp_agendar`.
    Não use `wa.me` nesse campo.

14. **Descrição (750 caracteres).** Sem preço, sem promessa de resultado, sem
    superlativo, sem "a melhor". Sugestão que já respeita o tom do site e o
    guardião regulatório:

    > A ecooa é uma clínica multidisciplinar em Moinhos de Vento, Porto Alegre.
    > Reúne, em um andar inteiro na Rua Mariante, profissionais autônomos de
    > medicina, nutrição, saúde mental, saúde integrativa, tricologia,
    > transplante capilar e estética, cada um responsável tecnicamente pelo
    > próprio trabalho. O atendimento é individual, com avaliação antes de
    > qualquer conduta, e acontece de segunda a sexta, das 8h às 20h. Parte das
    > agendas oferece também consulta online. Quem não sabe por onde começar
    > pode descrever o que está sentindo na busca do site e receber a indicação
    > do profissional mais adequado.

15. **Serviços.** Este é um dos poucos campos do perfil onde palavra-chave é
    legítima e útil. Crie os 8 serviços que já existem no site, e sob cada um as
    queixas do almanaque (`scripts/almanaque.mjs` tem 28 blocos e 115 textos
    prontos). Cada serviço com descrição curta espelhando a linguagem do site.

16. **Atributos.** Marque o que o site já afirma na página de localização e que
    seja verdade: acessível para cadeira de rodas na entrada, no elevador e no
    banheiro; estacionamento no prédio; atendimento online. Atributo falso é
    denúncia fácil.

17. **Fotos.** Fachada com a rua reconhecível, entrada, hall do elevador,
    recepção, cada sala, equipe. Volume e frequência importam mais que
    perfeição. Publique algumas por mês, para sempre. Geotag em EXIF é lenda,
    o Google remove metadado ao processar. O Bloqueio 7 já pede esse material.

18. **Mensagens do perfil: deixe desligado** enquanto não houver quem responda
    dentro do prazo. O Google mede tempo de resposta e desativa o canal de quem
    demora. Como todo o funil desemboca no WhatsApp e o Bloqueio 8 registra que
    não existe política de tempo de resposta, ligar o canal antes de definir o
    SLA é criar mais um lugar onde o lead morre.

19. **Produtos: pule.** É campo de varejo e não ajuda clínica.

20. **Publicações:** uma por semana, amarrada a um dos 14 artigos do editorial.
    Sem preço, sem promoção, sem promessa. Publicação constante é dos poucos
    sinais de atividade que o perfil expõe.

### Fase 3 · Defender o perfil

21. Ligue as notificações de **alterações sugeridas**. Qualquer usuário, e
    qualquer concorrente, pode sugerir mudança de horário, de categoria e até
    marcar como permanentemente fechado.
22. Abra o perfil uma vez por semana e confira "alterações pendentes".
23. Replique o **mesmo NAP, caractere a caractere**, em Apple Business Connect,
    Bing Places, Waze, Foursquare e nos diretórios de saúde que a clínica
    escolher usar. Citação divergente é o que mais corrói ranqueamento local, e
    hoje não há como saber o que já existe por aí (ver seção 7).
24. Depois de tudo criado, mande a URL do lugar no Maps para entrar em `sameAs`
    e em `hasMap`, fechando o achado A-03.

### Fase 4 · Medir

25. UTM em todos os links do perfil: site, agendamento e cada publicação.
26. No GA4, um segmento e uma exploração para `utm_campaign=gbp`.
27. Acompanhe mensalmente: chamadas, pedidos de rota, cliques no site, e a
    divisão entre buscas de descoberta e buscas pelo nome. Descoberta subindo é
    o único indicador honesto de que o trabalho local está funcionando.

---

## 6. Política de solicitação de avaliação compatível com o CFM

Avaliação é o combustível do mapa, e é também o lugar onde uma clínica de saúde
mais fácil se machuca. A política abaixo é conservadora de propósito.

**Ressalva que precisa ficar registrada:** a posição dos conselhos sobre pedir
avaliação em plataforma de terceiro não é matéria pacificada, e varia entre CFM,
CFN, CFP, COFEN, CFF e CFO. O que segue é leitura defensável e prudente, não
parecer jurídico. O Bloqueio 5 já prevê revisão por advogado com prática em
direito médico, e esta política deve entrar no escopo dessa revisão **antes** de
ser usada.

### Os cinco princípios

1. **Quem tem perfil é a clínica, não o médico.** A ficha é do estabelecimento.
   Avaliação espontânea de usuário em plataforma de terceiro não é peça
   publicitária produzida pelo profissional. O que a norma alcança é o que o
   profissional produz, publica ou induz.
2. **Nunca ofereça vantagem em troca.** Desconto, brinde, sorteio, prioridade de
   agenda, nada. É vedado pela política do próprio Google e configura
   mercantilização perante o conselho. Este é o item que, sozinho, transforma um
   pedido banal em infração.
3. **Nunca escolha a quem pedir.** Pedir só para quem saiu satisfeito é
   *review gating*, viola a política do Google e pode custar a remoção em bloco
   das avaliações. Pede-se a todos, do mesmo jeito, ou não se pede a ninguém.
4. **Nunca sugira o conteúdo.** Não peça para citar diagnóstico, procedimento,
   resultado, nome do medicamento ou "antes e depois". Peça sobre a
   **experiência de atendimento**: acolhimento, pontualidade, clareza da
   explicação, estrutura da casa. Depoimento sobre resultado clínico é o
   território exato que a norma de publicidade médica veda.
5. **Nunca traga a avaliação para dentro do site.** Não reproduzir no site, não
   reproduzir no Instagram como peça, não usar em anúncio, e **jamais** publicar
   `aggregateRating` ou `Review` em schema. O `scripts/validate-output.mjs` já
   falha se isso aparecer. Mantenha esse invariante.

### O procedimento

- **Quem pede:** a recepção. **Nunca o profissional**, e nunca dentro da sala.
  Pedido feito por quem acabou de conduzir a consulta cria constrangimento e
  contamina a relação de cuidado.
- **Quando:** de 24 a 72 horas depois do atendimento.
- **Como:** uma única mensagem pelo mesmo WhatsApp, com o link curto do perfil.
  Sem cobrança, sem segunda mensagem, sem lembrete.
- **Texto sugerido**, neutro e sem indução:

  > Oi, [nome]. Aqui é a recepção da ecooa. Se quiser, você pode contar como foi
  > a sua experiência de atendimento com a gente aqui: [link]. É opcional, leva
  > um minuto e nos ajuda a melhorar. Se preferir falar direto conosco, é só
  > responder por aqui.

- **Ritmo:** contínuo e parelho. Nunca em lote. Vinte avaliações num dia depois
  de seis meses de silêncio é o padrão que aciona os filtros do Google, e as
  avaliações somem.
- **Resposta a avaliação positiva:** agradeça a manifestação sobre o
  atendimento, sem confirmar que a pessoa foi paciente, sem citar profissional,
  sem citar nada clínico. Confirmar vínculo assistencial em resposta pública é
  quebra de sigilo, e é tratamento de dado de saúde exposto ao mundo.
  Resposta padrão sugerida:

  > Obrigada pelo retorno sobre a sua experiência na ecooa. Ficamos felizes que
  > o atendimento tenha sido bom. Estamos por aqui quando precisar.

- **Resposta a avaliação negativa:** uma resposta só, curta, sem discussão, sem
  nenhum detalhe, com convite para conversa privada.

  > Obrigada por escrever. Queremos entender o que aconteceu. Pode falar com a
  > recepção pelo (51) 99146-0909 para tratarmos disso diretamente.

  Depois disso, offline. Nunca responda dizendo "no seu tratamento" ou "no dia
  da sua consulta".
- **Avaliação falsa ou difamatória:** use o fluxo de denúncia do Google, guarde
  print e data, e não responda mais de uma vez.
- **Registro:** a política vira documento de uma página, assinada por cada
  profissional da casa. A responsabilidade perante os conselhos é individual, e
  cada um responde pelo que a clínica publica em nome dele.

### Avaliações dos profissionais individualmente

O Google permite ficha de profissional (*practitioner listing*) para quem atende
o público diretamente e é localizável no endereço. Trinta e uma fichas, cada uma
linkando para a página própria já criada, é uma jogada legítima e forte.

É também a jogada com maior risco de suspensão em massa se for feita errada.
Regras que não podem ser quebradas: uma ficha por pessoa e por endereço, nome
real da pessoa sem palavra-chave, categoria da profissão dela, telefone e link
que levem de fato a ela, e nenhuma ficha para quem não atende presencialmente
naquele endereço. Recomendo fazer depois que a ficha da clínica estiver
verificada e estável, e uma por vez, começando por dois ou três profissionais,
para medir antes de escalar. E só para quem já tem registro confirmado, o que
hoje exclui os cinco do Bloqueio 4.

---

## 7. O que o site ainda precisa para sustentar o perfil

Em ordem do que mais trava para o que menos trava.

1. **Consolidar a entidade.** Um único nó `MedicalClinic` com `@id`, definido
   nas páginas que disputam busca local, e todas as demais referências por
   `@id`. Trocar os 31 `worksFor` embutidos por referência. (A-01, A-04)
2. **Bairro dentro do endereço**, no `streetAddress` e no bloco do rodapé das 67
   páginas. (A-02)
3. **Resolver a canonicalização.** Ou os 2.085 links internos passam a apontar
   para a URL sem extensão, ou os canonicals e o sitemap passam a `.html`. Uma
   das duas, e conferir o código de status real no domínio antes de decidir.
   (A-07)
4. **Fonte única de NAP** em `dados-ecooa.js`, consumida por todos os scripts e
   pelos templates, com invariante no gate que falhe se aparecer literal de
   endereço ou telefone fora dela. (A-09)
5. **Coordenada, `hasMap` do lugar e `sameAs` com o perfil do Maps**, assim que
   o perfil existir. (A-03)
6. **Convenção de UTM** documentada, e propagação da origem até o texto do
   WhatsApp e até o evento `whatsapp_click`. Sem isso não há como saber o
   retorno do perfil. (A-08)
7. **Página `/agendar` real**, indexável, com entidade e horário, para ocupar o
   campo de agendamento do perfil. (A-10)
8. **Bairro e cidade na linha de apoio** das 8 áreas e dos 26 perfis, sem tocar
   nos H1, respeitando o Bloqueio 9. (A-05)
9. **Conteúdo local nos dois artigos com slug geolocalizado**, ou troca de slug
   com 301. (A-06)
10. **`_redirects` com 301 de verdade** para as 28 URLs legadas, no dia do
    cutover, priorizando `/clinica-moinhos-de-vento` e `/contato`. (A-12)
11. **`frame-src` na CSP de painel**, se um dia o mapa embutido for desejado.
    Hoje o mapa estático é a escolha melhor. (A-11)
12. **Promover `Person` para o subtipo certo** (`Physician` para os médicos, com
    `medicalSpecialty`), quando os registros do Bloqueio 4 chegarem.
13. **Miudezas:** `© 2021` para o ano corrente, telefone em E.164,
    `areaServed` coerente com o atendimento online, `priceRange`. (A-14)
14. **Atualizar `EXECUCAO.md` e `SCORECARD-FINAL.md`** para 57 URLs e 26 perfis
    indexáveis. (A-13)

O que **não** recomendo, e registro para que ninguém proponha depois: criar
páginas do tipo `nutricionista-em-moinhos-de-vento`, `psicologo-no-bom-fim` e
assim por diante sem conteúdo genuíno por trás. Página fina geolocalizada é
porta de entrada disfarçada, o Google trata como tal, e numa clínica de saúde o
estrago de percepção de qualidade é maior que o ganho.

---

## 8. O que não foi possível verificar

Registro com a mesma seriedade dos achados, porque metade deste tribunal está
fora do repositório.

1. **O perfil em si.** Se existe, se está reivindicado, se está suspenso, se há
   duplicata, quais categorias tem, quantas avaliações tem e o que dizem. Nem o
   Google nem o domínio são alcançáveis deste ambiente.
2. **Os códigos de status reais em produção.** Se `/localizacao` responde 200 no
   GitHub Pages, se `/localizacao.html` redireciona ou serve 200 duplicado, e o
   que acontece com as 28 URLs legadas. O laboratório é um `SimpleHTTP` do
   Python e não emula o hosting. Isso deixa o achado A-07 dimensionado, mas não
   medido no ambiente que importa.
3. **Se o Google renderiza e consolida a entidade.** Rich Results Test e Search
   Console não são alcançáveis. O JSON-LD foi validado sintaticamente e
   estruturalmente por mim, não pelo Google.
4. **Os nomes exatos das categorias no painel em português.** A lista muda sem
   aviso. As cinco sugestões da seção 5 são de alta confiança, mas precisam ser
   confirmadas digitando no campo.
5. **Citações externas já existentes.** Se a ecooa já aparece em Doctoralia, Boa
   Consulta, Apple Maps, Waze, listas de convênio ou diretórios de bairro, e com
   qual NAP. É a variável que mais pode surpreender: uma citação antiga com
   telefone antigo ou sala diferente sabota o pareamento sem aviso.
6. **A coordenada do pino.** Sem ela não dá para conferir se `geo` bateria com o
   endereço.
7. **Se existe telefone fixo.** A recomendação de usar fixo como principal
   depende de haver um.
8. **A posição escrita e atual dos conselhos sobre solicitação de avaliação.**
   Sem acesso aos sites de CFM, CRM-RS, CFN, CFP, COFEN, CFF e CFO, a seção 6 é
   leitura prudente, não citação verificada de norma vigente.
9. **Se o site publicado no ar é este.** O Bloqueio 1 registra que a origem de
   publicação em `Settings > Pages` nunca foi confirmada, e que o deploy esteve
   travado desde o P06. Auditei o repositório. Não posso afirmar que o
   repositório é o que está no ar.

---

## 9. Veredito

**Aprovado com ressalvas**, com reabertura pontual da camada de dados
estruturados do P10.

O site saiu de "nenhuma entidade de negócio local em todo o domínio", que era o
achado crítico número 2 do baseline de SEO técnico, para uma `MedicalClinic`
correta no nó principal, uma página de localização que sustenta a consulta
local, cidade em 47 títulos, FAQ com as perguntas que o paciente de fato faz e
um invariante de gate que impede a volta da nota agregada vedada. Isso é
fundação de verdade, e é reconhecida aqui sem desconto.

O que impede a aprovação limpa é que a camada foi declarada pronta e não está.
Trinta e uma páginas publicam uma segunda versão do endereço da clínica, sem CEP
e sem `@id`. O bairro que é o campo de batalha comercial não está dentro do
endereço em lugar nenhum. As oito páginas que disputam as consultas que dão
dinheiro apontam para uma entidade que não existe naquelas páginas. E toda a
navegação interna, 2.085 links, empurra o rastreador para uma URL que os
canonicals negam. Nenhum desses quatro é fatal isolado. Juntos, são exatamente a
classe de defeito que faz um perfil bem preenchido ranquear abaixo do que
deveria, e que ninguém consegue diagnosticar depois, porque não aparece em
nenhum relatório do Google.

Do lado de fora, a conclusão é mais dura e mais simples: **o maior fator isolado
de top1 local desta clínica ainda não foi acionado.** O perfil não existe.
Enquanto ele não for reivindicado e verificado, tudo o que foi construído aqui
rende uma fração do que pode. A seção 5 existe para que esse passo não dependa
de mais nenhuma decisão técnica.

**Nota de prontidão do site para busca local: 61 de 100.**

Composição da nota: entidade e página de localização somam bem (23 de 30);
sinais locais em título, descrição e conteúdo somam razoável (17 de 25);
consistência de NAP dentro do próprio domínio perde muito (9 de 20);
canonicalização e rastreio perdem (6 de 15); atribuição e mensuração da origem
local zeram quase tudo (2 de 10). A nota mede o site, não o perfil. Com o perfil
reivindicado, verificado e preenchido conforme a seção 5, e com os achados de
severidade alta corrigidos, esta nota passa de 85 sem esforço extraordinário.

---

*Auditoria independente, sem alteração de arquivos do site. Estado congelado no
commit `506de9ae22cdd52e77e3c198a74cd40055b1d8de`, 2026-08-01.*
