# Execução autônoma da esteira Mythos

> Sessão iniciada em 2026-08-01, a pedido do dono, com ele ausente da tela.
> Instrução recebida: ler, estudar, usar e revisar as 20 skills Mythos na ordem,
> criar uma arquitetura entre elas, executar tudo decidindo sozinho, listar
> apenas o que for fisicamente impossível sem ele, atualizar o site quando
> necessário e registrar nota antes e depois. Objetivo declarado: ser
> inevitavelmente top1.
>
> Este documento é o diário do que **foi feito**. O que depende do dono está em
> `docs/mythos/PENDENCIAS-DO-DONO.md`. As notas estão em
> `docs/mythos/BASELINE-SCORECARD.md` (antes) e
> `docs/mythos/SCORECARD-FINAL.md` (depois).

---

## Arquitetura adotada

As 20 skills foram lidas na íntegra (9.568 linhas) e reorganizadas em ondas, não
em sequência linear. Motivo: várias etapas escrevem nos mesmos arquivos de
`deploy/` e de `scripts/`, e rodar em série desperdiça tempo enquanto rodar tudo
junto gera conflito de escrita. O agrupamento está em
`docs/MYTHOS-ARQUITETURA.md`.

Princípio que guiou toda a execução: **medir antes, mudar depois, medir de novo,
e travar no gate o que foi conquistado**. Nenhuma correção entrou sem que o
`scripts/validate-output.mjs` ganhasse um invariante que impeça a regressão.

---

## Onda 0 · Achados que precederam qualquer medição

Três defeitos apareceram no reconhecimento inicial, antes de qualquer auditoria
formal. Os três estavam invisíveis porque ninguém tinha cruzado documentação com
realidade.

### 1. A publicação estava travada por um gate quebrado

`.github/workflows/deploy.yml` exigia `deploy/support.js` no job `build`. Esse
arquivo foi apagado no commit `d181388`, no P06, quando os 3,3 MB de runtime
morto saíram. Com o teste falhando, o job `deploy`, que depende de `build`,
**nunca executava**.

Corrigido no commit `fb6306a`. O gate agora confere o que de fato existe
(`index.html`, `dados-ecooa.js`, `CNAME`, `sitemap.xml`, `robots.txt`,
`404.html`), proíbe CDN externo em toda a pasta e impede o retorno do runtime
morto.

**Correção de um erro meu, registrado porque o revisor magno o apontaria de
qualquer forma:** no mesmo commit eu havia acrescentado uma chamada ao
`validate-output.mjs` dentro do job de publicação. Aquele job não tem
`setup-node` e não gera `dist/`, então o passo falharia sempre e o deploy
voltaria a nunca executar, exatamente o defeito que eu acabara de corrigir.
Removido no commit `9426147`. O gate completo roda no `ci.yml`, que tem o
ambiente certo, e que a partir de 2026-08-01 dispara também em push para
`main`, e não só em pull request. Antes disso ele era pulado em todo commit,
porque o trabalho vem sendo entregue por push direto.

Fica uma pergunta que só o dono responde, registrada como Bloqueio 1: qual é a
origem de publicação configurada em `Settings > Pages`.

### 2. Dois fragmentos de template estavam no ar

`deploy/Rodape.dc.html` e `deploy/Sobrancelha.dc.html` eram servidos
publicamente, apontando para o `./support.js` inexistente e expondo o miolo dos
templates. O gerador os usa em pasta temporária, então removê-los de `deploy/`
não os traz de volta. Removidos.

### 3. O site não tinha analytics nenhum

O contêiner `GTM-TSR4GDMK` aparece em dez documentos de `docs/` e aparecia em
**zero** páginas publicadas. Nem GTM, nem GA4, nem dataLayer, nem pixel, nem
Clarity. O projeto acreditava estar medindo e não media nada.

Corrigido na Onda 2, com decisões de privacidade descritas abaixo.

---

## Onda 1 · Baseline

Dez auditores independentes mediram o estado atual, em modo somente leitura, com
Lighthouse 13.4.1, axe-core 4.12.1 e Playwright, contra `deploy/` servido com a
CSP de produção. Cada laudo está em `docs/mythos/baseline/`.

A regra dada aos auditores foi explícita: nota alta só com prova medida, e "não
medido" é resposta melhor do que estimativa.

---

## Onda 2 · O que foi construído

### 31 páginas individuais de profissional (`scripts/perfis.mjs`)

O maior buraco orgânico do site. Quem procura saúde no Google procura por nome
("natálie queiroz osteopata"), por profissão mais bairro ("nutricionista moinhos
de vento") e por queixa mais cidade. Os 31 profissionais viviam apenas dentro de
um modal em `profissionais.html`, invisível para busca.

Cada perfil agora é uma página indexável com conteúdo genuinamente próprio:

- identificação com nome, classe, registro, área e marca;
- **a conduta escrita pelo próprio profissional**, em parágrafos (todos os 31
  têm conduta preenchida);
- **o que a pessoa atende, queixa a queixa**, com o texto preciso do almanaque
  que diz o que ela faz naquela queixa específica, mais o vocabulário real de
  busca daquele bloco;
- os textos que assina no editorial;
- quem mais atende na mesma área, com link (malha interna);
- JSON-LD `Person` e `BreadcrumbList`.

Verificado antes de gerar: os 31 têm conduta e os 31 aparecem em pelo menos um
bloco do almanaque, então nenhuma página nasce magra.

### Fonte única do almanaque (`scripts/almanaque.mjs`)

Os 28 blocos de queixa e os 115 textos por profissional viviam embutidos dentro
do `scripts/match.mjs`. Foram extraídos para um módulo próprio, consumido agora
pelo match e pelas páginas de perfil. Editar em um lugar, valer nos dois.

### Dados estruturados (`scripts/estruturados.mjs`)

A home não tinha **nenhum** dado estruturado. Nem `Organization`, nem
`LocalBusiness`, nem `MedicalClinic`. Para uma clínica local, essa é a entidade
central de busca, e ela não existia.

Passou a existir, com o NAP exatamente como publicado na página de localização,
sem inventar nada: `Rua Mariante, 180, 9º andar`, `Porto Alegre, RS, 90430-180`,
telefone, e-mail, horário de segunda a sexta das 8h às 20h, área atendida,
Instagram e os 8 serviços ligados às páginas de área.

Também entraram `WebSite` com `SearchAction`, `CollectionPage` com `ItemList` em
profissionais e especialidades, `Blog` no editorial, `Service` em mentorias e
sublocação, `MedicalWebPage` nas 8 áreas e `BreadcrumbList` em tudo que tem
profundidade.

Duas decisões deliberadas de omissão:

- **sem coordenada geográfica**: não temos o valor exato, e coordenada chutada
  atrapalha o pareamento com o Perfil da Empresa no Google;
- **sem `aggregateRating` e sem `Review`**: além de não existirem avaliações no
  site, nota agregada em publicidade médica é vedada pelo CFM. O gate agora
  falha se algum dia aparecerem.

### Camada de medição (`scripts/medicao.mjs`)

Quatro decisões tomadas sem o dono, todas defensáveis e reversíveis:

1. **LGPD primeiro.** Consent Mode v2 com todo armazenamento negado por padrão.
   Nenhum cookie de análise antes do aceite. Aviso discreto, recusar tão fácil
   quanto aceitar, escolha guardada em `localStorage`.
2. **Performance preservada.** O GTM só entra depois do primeiro gesto real
   (rolagem, toque, clique, tecla) ou 4 segundos após o load. Nunca disputa
   banda com o LCP. É o "interaction-only" que o projeto documentava e nunca
   teve.
3. **Eventos que importam para esta clínica**, não pageview: `whatsapp_click`
   com página, profissional, área e posição do botão; `form_submit` por tipo;
   `match_resultado` com o bloco de queixa entendido e os indicados.
4. **Nenhum dado de saúde no evento.** O termo que a pessoa digita no
   ecooa.match é informação sensível e **não** é enviado. Viaja apenas o bloco
   de queixa entendido, que é categoria editorial, não declaração sobre a
   pessoa.

A CSP de `deploy/_headers` foi atualizada junto, para o GTM não quebrar no dia
do cutover para a Cloudflare.

### Malha interna

- Os cards de profissional nas 8 páginas de área deixaram de abrir modal e
  passaram a **linkar para a página do profissional**. Isso dá ao Google o
  caminho de rastreio para os 31 perfis novos e leva o visitante a uma página
  mais informativa que o modal.
- O modal de perfil, que era injetado nas 8 páginas de área e virou código
  morto, saiu de lá. Continua em `profissionais.html`, onde é a interação
  principal, e agora traz o link "ver a página completa".
- O `sitemap.xml` passou de 31 para 62 URLs.

### Busca compartilhável no ecooa.match

O match passou a aceitar `?q=` na URL e a gravar a busca feita. Isso torna o
resultado compartilhável, permite linkar direto de uma página de área para uma
busca pronta e alimenta o `SearchAction` do dado estruturado.

---

## Onda 3 · Conteúdo editorial

Diagnóstico: **12 dos 14 artigos não tinham corpo nenhum**. Eram URLs indexadas
com título e linha de apoio, rendendo cerca de 115 palavras de shell. Os outros
dois tinham 285 e 239 palavras. Em saúde, conteúdo raso indexado não é neutro:
ele arrasta a percepção de qualidade do domínio inteiro.

Cada artigo foi escrito na voz do profissional que assina, com o perfil real
dele como âncora, e depois submetido a um guardião regulatório adversarial que
varre CFM 1.974/2011 e 2.336/2023, COFEN, CFN, CFF, CRP e CFO procurando
promessa de resultado, superlativo, sensacionalismo, mercantilização,
prescrição a distância, autodiagnóstico, dado inventado e desvio de escopo
profissional, corrigindo o que encontrar.

**Estes textos continuam precisando da revisão de quem os assina.** Está
registrado como pendência do dono. O que mudou é o ponto de partida: de página
vazia para texto denso e conforme.

---

## Reforços no gate (`scripts/validate-output.mjs`)

Cada conquista virou invariante travado, para não regredir em silêncio:

| Invariante novo | O que impede |
| --- | --- |
| piso de 62 URLs no sitemap | perder os perfis do índice |
| 31 perfis presentes, com `Person` e seções próprias | perfil nascer vazio ou sumir |
| índice de `/profissionais/` presente | diretório esconder a listagem |
| `MedicalClinic` e `WebSite` na home | perder a entidade de busca local |
| zero `aggregateRating` e zero `Review` | violação do CFM entrar por schema |
| todo JSON-LD sintaticamente válido | Google descartar o schema em silêncio |
| medição presente em todas as páginas | voltar a não medir nada |
| `analytics_storage` negado por padrão | quebrar a LGPD |
| GTM sem tag estática | GTM voltar a competir com o LCP |
