# Pendências do dono

> Execução autônoma da esteira Mythos completa (P00 a P19 mais o extra de Google
> Business Profile), iniciada em 2026-08-01 com o dono ausente da tela.
>
> Este documento lista **apenas o que a IA não consegue fazer sozinha**: exige
> senha, painel de terceiro, DNS, conta externa, decisão jurídica humana, ou
> material físico (foto, documento, número de registro). Tudo o que era
> decidível foi decidido e executado, e está registrado em
> `docs/mythos/EXECUCAO.md`.
>
> Ordem: do que mais trava o objetivo "top1" para o que menos trava.

---

## Bloqueio 1 · Confirmar como o site é publicado (GitHub Pages)

**Gravidade: crítica. É a pendência número um.**

O workflow `.github/workflows/deploy.yml` tinha, no job `build`, a linha
`test -f deploy/support.js`. Esse arquivo foi apagado no commit `d181388`, no
P06, quando os 3,3 MB de runtime morto saíram do site. Com o teste falhando, o
job `build` falhava, e o job `deploy`, que depende dele, **nunca executava**.

O gate foi corrigido nesta sessão (commit `fb6306a`): agora ele confere o que de
fato existe na publicação e ainda roda o `validate-output.mjs` antes de subir.

**O que só você pode fazer:** abrir `Settings > Pages` no repositório e
confirmar qual é a origem da publicação.

- Se estiver em **GitHub Actions**: o site esteve congelado desde o P06 e volta a
  atualizar agora. Confira a aba Actions e veja se há execuções vermelhas.
- Se estiver em **Deploy from a branch**: o workflow nunca foi o caminho real, e
  é preciso decidir qual dos dois vale. Manter os dois é ter duas verdades.

**Como verificar:** depois do próximo push, abrir a aba Actions e confirmar o
workflow verde, e conferir se uma mudança recente aparece no ar.

---

## Bloqueio 2 · Configurar as tags dentro do GTM

**Gravidade: crítica para o objetivo top1.**

O site publicado **não tinha analytics nenhum**. O contêiner `GTM-TSR4GDMK`
aparece em dez documentos de `docs/` e aparecia em **zero** páginas. Sem
medição não há como saber qual página traz paciente, qual artigo converte, nem
qual profissional é procurado.

Nesta sessão foi instalada a camada de medição (`scripts/medicao.mjs`), com:

- Consent Mode v2, tudo negado por padrão, aviso discreto de privacidade;
- carregamento do GTM só após o primeiro gesto do visitante ou 4 segundos, para
  não competir com o LCP;
- eventos de conversão no `dataLayer`: `whatsapp_click` (com página,
  profissional, área e posição do botão), `form_submit` e `match_resultado`.

### Antes das tags, a política de segurança precisa deixar o dado sair

**Isto é pré-requisito. Sem isto, tudo o que vier depois mede zero.**

A auditoria de aquisição achou o seguinte: a política de segurança que está
valendo em produção **não é** a do arquivo `deploy/_headers`. O GitHub Pages
ignora esse arquivo. A política real vem de uma **regra de painel da
Cloudflare**, que não está no repositório e diverge da declarada em sete
diretivas.

Essa regra **não tem `connect-src`**. Com o padrão `default-src 'self'`, todo
envio do GA4 para fora do domínio é bloqueado pelo navegador. Ou seja: o
contêiner carrega, as tags disparam, e **nenhum dado chega**. O mesmo bloqueio
derruba o modo Preview do GTM, então você nem consegue depurar.

**O que fazer, no painel da Cloudflare, antes de mexer no GTM:**

Acrescentar à CSP, no mínimo:

```
connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;
frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com;
script-src ... https://www.googletagmanager.com;
```

E, já que a regra vai ser tocada, aproveitar para fechar o que falta:
`frame-ancestors 'none'` (hoje o site pode ser embutido em iframe de terceiro),
`base-uri 'self'`, `form-action 'self' https://wa.me` e um `report-uri` para
que violação em produção seja reportada a alguém, o que hoje não acontece.

O arquivo `deploy/_headers` já foi atualizado nesta sessão com a versão
correta, e serve de referência para copiar. Ele passa a valer sozinho no dia do
cutover para a Cloudflare Workers (Bloqueio 6).

**Como verificar:** abrir o site, F12, aba Console. Se aparecer erro de CSP
citando `google-analytics`, ainda está bloqueado. Depois, GTM Preview deve
conectar.

### Depois disso, as tags

**O que só você pode fazer:** entrar em tagmanager.google.com, no contêiner
`GTM-TSR4GDMK`, e criar as tags. Sem isso o contêiner carrega e não mede nada.

1. Criar propriedade GA4 (ou usar a existente) e anotar o ID `G-XXXXXXXXXX`.
2. No GTM: tag **Google Tag** com esse ID, disparo em All Pages.
3. Tags de evento GA4 para `whatsapp_click`, `form_submit` e `match_resultado`,
   com gatilho de evento personalizado de mesmo nome.
4. Marcar `whatsapp_click` e `form_submit` como conversão no GA4.
5. Publicar a versão do contêiner. **Tirar print do estado atual antes.**

**Observação de privacidade:** o termo que o paciente digita no ecooa.match
**não** é enviado, de propósito: é informação de saúde. Só viaja o bloco de
queixa entendido, que é categoria editorial. Não altere isso sem avaliação.

---

## Bloqueio 3 · Google Business Profile e as avaliações

**Gravidade: crítica para busca local. É o maior fator isolado de "top1" no mapa.**

O site foi preparado para o pareamento: a home e a página de localização agora
publicam a entidade `MedicalClinic` com endereço, telefone, e-mail e horário,
exatamente como estão no site. Falta o lado de fora, que é seu.

**O que só você pode fazer:**

1. Reivindicar e verificar o perfil da ecooa no Google Business Profile.
2. Deixar o NAP **idêntico** ao do site, caractere a caractere:
   `ecooa` · `Rua Mariante, 180, 9º andar` · `Porto Alegre, RS, 90430-180` ·
   `(51) 99146-0909`. Divergência de NAP derruba ranqueamento local.
3. Categoria principal e secundárias, horário (seg a sex, 8h às 20h), fotos do
   espaço, link do site apontando para `https://www.somosecooa.com.br/`.
4. **Coordenada geográfica exata**: pegar a latitude e longitude do pino no
   Google Maps e me passar. Ela ficou de fora do dado estruturado de propósito,
   porque coordenada chutada atrapalha o pareamento.
5. Política de avaliações: definir como pedir avaliação sem ferir o CFM
   (nada de oferecer vantagem em troca). Avaliação é o combustível do mapa.

---

## Bloqueio 4 · Os dez registros profissionais

**Gravidade: alta. É risco ético e regulatório, não só de conteúdo.**

Dos 31 profissionais, **21 têm registro confirmado**, 5 estão como
`a-confirmar` e 5 como `a-adicionar`. Por decisão sua de 2026-07-31, o site
mostra o número limpo quando existe e não mostra nada quando não existe.

Isso resolve a estética, mas não resolve o fundo: anunciar a atuação de um
profissional de saúde sem o registro visível é frágil perante os conselhos.
Agora que cada profissional tem **página própria e indexável**, a exposição
aumentou, e com ela o risco.

**O que só você pode fazer:** obter os dez números e me passar para atualizar
`deploy/dados-ecooa.js`. Enquanto isso não vem, a decisão em vigor é a sua.

---

## Bloqueio 5 · Revisão jurídica de publicidade médica

**Gravidade: alta.** Herdada da PEND-03 do dossiê anterior, segue aberta.

Um advogado ou assessoria com prática em direito médico precisa revisar o site
sob CFM 1.974/2011 e 2.336/2023, e as normas de COFEN, CFN, CFF, CRP e CFO.
Insumos: `docs/mythos/baseline/etica.md` e o parecer do tribunal ético em
`docs/mythos/P17-TRIBUNAL-ETICA.md`.

Nenhuma nota agregada, depoimento de paciente ou imagem de antes e depois
existe no site, e o gate automatizado impede que voltem. Mas a leitura final de
risco é humana.

---

## Bloqueio 6 · Cutover para Cloudflare Workers

**Gravidade: alta.** Herdada da PEND-04, segue aberta.

O arquivo `deploy/_headers` define CSP, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` e cache imutável de assets. **O GitHub
Pages ignora esse arquivo por completo.** Ou seja, hoje o site vai ao ar
**sem nenhum desses cabeçalhos**.

Enquanto o cutover não acontece:

- não há CSP real em produção, apenas a declarada no arquivo;
- não há HSTS;
- não há cache imutável para os assets, o que custa pontos de performance em
  visitas repetidas;
- as URLs legadas seguem como stub de meta refresh, e não como 301 de verdade.

**O que só você pode fazer:** criar o Worker, conectar o repositório, apontar o
DNS e ativar, conforme `docs/DEPLOYMENT.md` §5. Cuidado: **não tocar no MX** (é
o e-mail do domínio) e usar SSL Full (strict), nunca Flexible. Não submeter
HSTS preload sem decidir conscientemente: é porta de mão única.

Ao migrar, a CSP do `_headers` já foi atualizada nesta sessão para liberar o
GTM, senão a medição quebraria no dia do cutover.

---

## Bloqueio 7 · Material que só existe fora do repositório

**Gravidade: média, mas trava conteúdo pronto para publicar.**

1. **Foto dos sócios juntos** para a página sobre. O bloco está pronto e espera.
2. **Fotos novas do espaço** para "Projetado para acolher" e para a renovação da
   página de localização.
3. **Links dos posts do Instagram** para o submenu editorial. Enquanto não vêm,
   o item aponta para o perfil.
4. **Revisão dos serviços das 8 áreas.** Os textos foram redigidos por mim e
   aguardam sua revisão técnica, área por área.
5. **Textos reais dos 14 artigos.** O que está publicado é estrutura com
   conteúdo de partida; um artigo de saúde assinado por profissional precisa
   passar por quem assina.
6. **Revisão do mapa de sintomas do ecooa.match**, bloco a bloco, e dos 115
   textos do almanaque.
7. **E-mail de domínio próprio.** Hoje o contato é `ecooa.adm@gmail.com`. Para
   uma clínica que quer ser referência, e-mail em domínio próprio é sinal de
   confiança, inclusive para o Google.

---

## Bloqueio 8 · Decisões de negócio que mudam o site

Coisas que eu não decido por você porque mudam a oferta, não a técnica.

1. **Preços e convênios.** O site não fala de valores nem de convênios. Quem
   busca saúde procura isso, e a ausência gera atrito e contato desqualificado.
   Decida se entra e em que forma.
2. **Agendamento online de verdade.** Hoje toda conversão termina no WhatsApp,
   que depende de alguém responder. Um agendamento com agenda real muda a taxa
   de conversão e a experiência fora do horário comercial.
3. **Política de resposta do WhatsApp.** Todo o funil desemboca ali. Sem tempo
   de resposta definido, o investimento em busca vaza no último metro.

---

## Como este documento é mantido

Cada item aqui tem dono humano e nenhum tem substituto técnico. Quando um for
resolvido, me diga e eu removo daqui, aplico a mudança no site e registro em
`docs/mythos/EXECUCAO.md`. O que a IA conseguiu fazer sozinha já foi feito e
não aparece nesta lista.

---

## Bloqueio 9 · Decisões de aparência que estão à sua espera

Em 2026-08-01, já no fim da execução, você pediu que nenhuma mudança de
aparência fosse feita sem a sua ordem. A partir dali, tudo virou apontamento.
Estes itens estão **parados**, aguardando você:

1. **Contraste na faixa do ecooa.match, na home.** O número "07" e o rótulo
   "orientação e conexão" usam prata sobre grafite, o que dá 3,55:1 contra o
   mínimo de 4,5:1 da WCAG. Trocar prata por névoa resolve, com 5,01:1. É a
   única falha de acessibilidade que resta: com ela o axe-core acusa dois nós
   graves, sem ela acusa **zero** em oito páginas medidas. A correção foi
   aplicada, medida e **revertida** quando você pediu.
2. **O aviso de privacidade cobre o botão flutuante do WhatsApp no celular.**
   O aviso aparece uma vez por visitante, mas enquanto está na tela ele
   sobrepõe o botão de conversão. Resolver é subir o botão enquanto o aviso
   existe, ou ancorar o aviso mais abaixo.

Além destes dois, sete outras mudanças de aparência entraram **antes** do seu
pedido e seguem no ar: o próprio aviso de privacidade, o link "pular para o
conteúdo" (só visível ao usar Tab), o anel de foco mais escuro (só visível ao
navegar por teclado), os cards das páginas de área passando a levar à página do
profissional em vez de abrir modal, o link "ver a página completa" dentro do
modal, as duas seções novas nas páginas de área (abertura e "como funciona"), e
o texto dos 14 artigos e das 8 áreas. Nenhuma foi revertida, porque reverter
sem a sua ordem seria o mesmo erro na direção oposta.
