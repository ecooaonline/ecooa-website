# Auditoria Mythos · ecooa · 2026-07-30

P00 (vistoria) seguida de execução de P01, P03, P04, P05 e P06.
Autorização para executar: dada pelo dono no pedido ("execute o máximo de
etapas decidindo tudo"), o que satisfaz a Lei 9 sem parada intermediária.

Ambiente de medição: contêiner efêmero, Node 22.22.2, npm 10.9.7, Chromium
1194. **Sem acesso de rede ao domínio:** a política de rede do ambiente nega
CONNECT para `www.somosecooa.com.br` (403). Portanto **toda medição neste
documento é LABORATÓRIO**, feita sobre a pasta `deploy/` servida localmente,
em parte sob a mesma CSP que a Cloudflare injeta em produção. Nenhum número
de campo (PSI/CrUX) foi obtido. Nenhuma meta pode ser declarada fechada em
produção a partir daqui.

---

## 1. Resumo executivo

O site parecia pronto e não estava. A auditoria encontrou o defeito mais caro
possível num site de clínica: **perda silenciosa de lead em todas as páginas**.

A causa é única e explica quase tudo. Os templates do site 3.0 declaravam
**32 handlers de interação**. A pré-renderização, que existe para eliminar a
dependência de `eval` proibida pela CSP do domínio, congela o DOM num único
instante e descarta todo JavaScript de comportamento. Etapas anteriores
haviam religado 7 handlers. **Vinte e cinco seguiam mortos**, entre eles os
três formulários do site.

Os três maiores riscos encontrados:

1. **CRÍTICO.** Newsletter do rodapé (11 páginas), formulário de mentoria e
   formulário de sublocação recarregavam a página como GET, perdiam tudo que
   a pessoa digitou e não abriam WhatsApp nem e-mail. Corrigido e comprovado.
2. **CRÍTICO.** `npm run build` estava quebrado em clone limpo, porque exigia
   um arquivo que a otimização de performance havia removido. O próximo deploy
   teria falhado. Pego pelo teste do clone limpo. Corrigido.
3. **ALTO.** Os 41 documentos de `docs/` descrevem o projeto Astro, que não
   está publicado. Nenhum menciona a pasta `deploy/`. Documentação que mente
   envenena a próxima IA, e foi exatamente o que aconteceu nas sessões
   anteriores. Corrigido com `docs/ESTADO-REAL.md` e avisos no topo dos
   documentos-espelho.

Recomendação: as correções críticas já estão no ar. O que resta de maior valor
é transformar as visões de detalhe (especialidade, artigo, perfil) em páginas
reais pré-renderizadas, o que resolve de uma vez os 25 handlers restantes,
as 68 URLs órfãs e o SEO de cauda longa.

## 2. Prova mecânica do modo somente leitura (P00)

A fase P00 rodou sem alterar arquivo versionado. `git status --porcelain`
retornou vazio ao final da vistoria, antes de qualquer execução autorizada.
As alterações registradas neste documento pertencem às fases P01/P03/P04/P05/P06,
executadas depois, cada uma com commit próprio.

## 3. Os Seis Exames Vitais

### Exame 1 · Conversão de ponta a ponta — **CRÍTICO**

Nenhum formulário tinha handler no HTML publicado. Prova em navegador, antes:

| formulário | onde | comportamento medido |
|---|---|---|
| newsletter | rodapé, 11 páginas | GET para `/?`, recarrega, e-mail digitado perdido, nenhum cliente de e-mail abre |
| mentoria | `/mentorias` | GET para `?`, recarrega, 5 campos perdidos, WhatsApp nunca abre |
| sublocação | `/sublocacao` | idem |

Não há backend: nada era gravado em servidor, então a perda era total e
invisível. Nenhum registro, nenhum aviso, nenhum log.

Corrigido. Prova depois: **47 verificações, 0 falhas** (destino do WhatsApp,
conteúdo da mensagem campo a campo, ausência de recarga, campos preservados,
rótulo do botão, aviso ao usuário, abertura real de aba nova).

### Exame 2 · Segredos e exposição — **APROVADO**

Varredura por `secret`, `token`, `password`, `api_key`, `bearer`, chaves
privadas e URLs com credencial: nenhuma ocorrência com valor. Nenhum `.env`
versionado; `.env.example` contém só placeholders e explica onde os valores
reais vivem (painel do dono). Nenhum arquivo sensível servido em `deploy/`
além de `LEIA-ME.md`, que é documentação inócua.

### Exame 3 · Indexabilidade — **APROVADO com ressalva**

`robots.txt` permite tudo, bloqueia só `/404` e os dois fragmentos `.dc.html`,
e aponta o sitemap. `sitemap.xml` tem 9 URLs, todas as rotas estratégicas
presentes, `/politicas` e `/404` corretamente fora. Um canonical por página,
todos no domínio canônico. `/politicas` e `/404` com `noindex, follow`.

Ressalva: os canonicals apontam para URL sem extensão (`/sobre`) e os links
internos usam `sobre.html`. Funciona porque a hospedagem resolve as duas
formas, mas é inconsistência a alinhar (pertence a P10).

### Exame 4 · Realidade mobile — **CRÍTICO na entrada, resolvido**

Baseline em 402x874 (métricas do iPhone do dono): cabeçalho com 824 px de
conteúdo numa tela de 402, cinco itens de menu fora da tela e **nenhuma forma
de alcançar as páginas**; mosaico em 8 colunas de 42x52 px com o nome
sobreposto ao rosto; modal de perfil com a foto vazando 385 px por cima do
texto. Causa: os mesmos limites responsivos do autor (`>= 1080`, `1100/760/480`,
`860`, `760`) viviam em JavaScript e foram congelados no estado de 1440 px.

Corrigido antes desta auditoria, na sessão da noite anterior, e reverificado
aqui: 10 de 11 páginas sem rolagem horizontal, sem transbordo, sem imagem
quebrada, nenhum texto abaixo de 11 px.

### Exame 5 · Terceiros, SPOF e raio de explosão — **APROVADO após P06**

Antes: `support.js` (72 KB) + React (12 KB) + ReactDOM (132 KB) baixados em
toda visita, mais Babel Standalone (3,0 MB) no repositório, para sustentar um
`eval` que a CSP do domínio proíbe. Depois: **removidos**. O único script
próprio que resta é `dados-ecooa.js` (41 KB), em 5 das 11 páginas.

Terceiro remanescente: o iframe do Google Maps em `/localizacao`, bloqueado
pela CSP da Cloudflare. É o único ponto de falha externo, e é falha de painel,
não de código.

Posse de contas: GTM `GTM-TSR4GDMK` e o painel Cloudflare são território do
dono. Nada foi tocado neles.

### Exame 6 · Integridade do repositório — **RISCO, resolvido**

Branch `site-3.0`, publicando em `main`. Achados: `dist/` era compartilhado
por dois builds diferentes, e o último a rodar vencia (já causou a publicação
do site errado uma vez). `src-site-3/` carrega 27 MB de PNG originais.
Commits assinados com SSH e autor correto; a verificação local falha por
ausência de `allowedSignersFile`, não por defeito da assinatura.

## 4. Scorecard dos 22 eixos

Notas de 0 a 100. "Antes" é o estado na abertura da auditoria; "depois" é o
estado ao final desta sessão. Ambos em LABORATÓRIO.

| # | Eixo | Antes | Depois | Evidência da nota |
|---|---|---:|---:|---|
| 1 | Estratégia e requisitos | 45 | 80 | não havia documento do site publicado; agora `ESTADO-REAL.md` fixa persona, lead, canais e escopo |
| 2 | Arquitetura de informação | 60 | 65 | 11 páginas coerentes, mas 68 URLs órfãs e detalhes sem página real |
| 3 | Infraestrutura | 55 | 85 | builds isolados, `_headers` com cache e política endurecida; CSP ainda vem do painel |
| 4 | Governança de dados e conversão | 15 | 88 | três formulários perdiam lead calado; hoje 47 verificações passam |
| 5 | Fundação e DX | 40 | 88 | build quebrado em clone limpo; hoje clone→ci→build reproduz `dist/` idêntico |
| 6 | Performance | 62 | 90 | mobile 73/79/85 → 93/97/97; desktop 100 em tudo; teto de LCP registrado |
| 7 | Segurança | 60 | 82 | `unsafe-eval` removido da CSP, runtime com eval eliminado, novos headers |
| 8 | CI/CD e quality gates | 35 | 75 | o gate de output media o site errado; hoje mede o publicado e trava 18 regressões |
| 9 | Acessibilidade | 78 | 95 | Lighthouse 95 → 100; contraste da marca corrigido; teclado e foco no modal e no menu |
| 10 | SEO técnico | 80 | 88 | sitemap, canonicals, robots e noindex corretos; falta detalhe por página |
| 11 | UX/UI | 55 | 85 | mobile era inutilizável; hoje navegável, com o desenho do autor preservado |
| 12 | Design System | 50 | 60 | tokens existem, mas o HTML publicado é estilo inline em cada elemento |
| 13 | Conteúdo e risco regulatório | 70 | 85 | guardião regulatório reescrito, ressalva de registro travada no build |
| 14 | CRO | 20 | 70 | os caminhos de conversão existem e funcionam; sem mensuração ainda |
| 15 | Dados estruturados | 65 | 65 | não tocado nesta sessão |
| 16 | Dados e fonte única | 70 | 80 | `dados-ecooa.js` é fonte única real dos 31 perfis, validada no build |
| 17 | Formulários e conversão | 10 | 88 | ver eixo 4 |
| 18 | PWA e offline | 50 | 50 | `sw.js` autodestrutivo, sem PWA; adequado ao escopo |
| 19 | Observabilidade | 15 | 25 | nenhum evento, nenhum rastreio de erro; trabalho de P13/P14 |
| 20 | Aquisição, analytics e bots | 15 | 15 | não tocado; trabalho de P14 |
| 21 | Manutenção e SLA | 30 | 45 | pipeline documentado e reprodutível; sem rotina formal |
| 22 | Manutenção por IA e veracidade documental | 20 | 85 | 0 de 41 documentos citavam o site publicado; hoje há documento dono e avisos |
| | **Média** | **45,2** | **72,7** | |

## 5. Lighthouse por página

LABORATÓRIO. Sandbox sem rede plena e sem TLS de produção; `cache-insight`
sai penalizado porque o servidor local não manda cabeçalhos de cache, o que
em produção o `_headers` resolve. Mesma pasta, mesmo servidor, antes e depois.

| página | forma | perf antes | perf depois | LCP antes | LCP depois | FCP antes | FCP depois |
|---|---|---:|---:|---:|---:|---:|---:|
| home | mobile | 73 | **93** | 4436 | 3076 | 3253 | **1593** |
| home | desktop | 99 | **100** | 912 | 722 | 690 | 388 |
| profissionais | mobile | 79 | **97** | 4387 | 2426 | 3154 | **1490** |
| profissionais | desktop | 99 | **100** | 856 | 551 | 687 | 362 |
| mentorias | mobile | 85 | **97** | 3635 | 2477 | 2698 | **1241** |
| mentorias | desktop | 100 | **100** | 727 | 541 | 557 | 286 |

Accessibility 95 → **100**. Best Practices 96 → **100**. SEO **100**.
CLS **0** em todas. TBT 179 → **0**. Transferência da home: cerca de 650 KB
→ **434 KB** em 11 requisições.

## 6. Teto técnico registrado

### [TETO-01] LCP mobile da home

Meta: abaixo de 1800 ms. Atingido: 3076 ms.
Decomposição: 450 ms de TTFB e **2625 ms de render delay**.
Origem: o documento tem 154 KB porque a pré-renderização gravou estilo inline
em cada elemento. Com CPU emulada 4x mais lenta, calcular esse estilo custa os
2,6 s. Não é rede: `render-blocking`, `unused-css` e `legacy-javascript` já
pontuam 100.
Custo de superar: extrair os estilos inline para classes, o que toca todo
elemento de um desenho que o dono declarou congelado. Risco de regressão
visual alto.
Alternativas: (a) aceitar 93 no mobile; (b) refatoração de CSS em P11, com
inventário visual antes e depois; (c) reduzir a home, que o dono não quer.
**Decisão pedida ao dono:** aceitar o trade-off ou autorizar a refatoração.

## 7. Achados

### [ACHADO-01] Formulários de lead sem handler
Eixo: conversão · Severidade: **CRÍTICO** · Matriz: I(5) × P(5) = 25
Evidência: `src-site-3/Rodape.dc.html:128`, `mentorias.html:208`,
`sublocacao.html:215` declaram `onSubmit`; o HTML publicado não tinha nenhum.
Prova em navegador: GET para `?`, campos perdidos, nada abre.
Impacto: perda total e invisível de lead nas 11 páginas.
Recomendação: religar em JavaScript comum. **Feito** (`c11ed0a`).
Prompt dono: P04 · Correção prévia: sim

### [ACHADO-02] Build quebrado em clone limpo
Eixo: fundação · Severidade: **CRÍTICO** · Matriz: I(5) × P(4) = 20
Evidência: `scripts/build-site.mjs` exigia `deploy/support.js`, removido no
P06. Clone limpo: "ERRO: deploy/support.js não existe. Publicação abortada."
Impacto: o próximo deploy teria falhado.
Recomendação: remover da lista de obrigatórios e adicionar lista de proibidos.
**Feito** (`a8ed316`).
Prompt dono: P05 · Correção prévia: sim

### [ACHADO-03] Documentação descreve outro site
Eixo: veracidade documental · Severidade: **ALTO** · Matriz: I(4) × P(5) = 20
Evidência: 0 de 41 documentos em `docs/` mencionam `deploy/` ou "site 3.0".
`AI_HANDOFF.md` afirma 103 páginas, fonte única em `src/data/constants.ts`,
conversão em `src/scripts/form-submit.ts` e fontes Arboria/Playfair. Nada
disso é verdade no site publicado, que tem 11 páginas, `dados-ecooa.js`,
WhatsApp e nenhuma fonte web.
Impacto: envenena humanos e IAs futuras. Já causou erro real.
Recomendação: documento dono + avisos. **Feito** (`docs/ESTADO-REAL.md`).
Prompt dono: P05/P13

### [ACHADO-04] `dist/` compartilhado por dois builds
Eixo: infraestrutura · Severidade: **ALTO** · Matriz: I(5) × P(3) = 15
Evidência: `npm run build` e `npm run build:astro` gravavam ambos em `dist/`.
Reproduzido: rodar o segundo substituiu as 13 páginas por 104 do Astro.
Impacto: publicar o site errado. Já aconteceu uma vez neste projeto.
Recomendação: `outDir: './dist-astro'`. **Feito** (`161df59`).
Prompt dono: P03

### [ACHADO-05] Gate de output medindo o site errado
Eixo: CI/CD · Severidade: **ALTO** · Matriz: I(4) × P(4) = 16
Evidência: `scripts/validate-output.mjs` exigia `dist/sitemap-0.xml`, piso de
95 URLs e rotas `/quem-somos/` e `/match/`, todas do projeto Astro.
`npm run validate` falhava por motivo errado.
Recomendação: reescrever contra o publicado e travar as regressões reais.
**Feito** (`161df59`, 18 verificações).
Prompt dono: P08

### [ACHADO-06] `unsafe-eval` na CSP sem necessidade
Eixo: segurança · Severidade: **MÉDIO** · Matriz: I(4) × P(2) = 8
Evidência: `deploy/_headers` permitia `'unsafe-eval'` para o runtime.
Depois do P06 nenhum código publicado usa eval.
Recomendação: remover. **Feito** (`161df59`).
Prompt dono: P07

### [ACHADO-07] Contraste abaixo do mínimo em token da marca
Eixo: acessibilidade · Severidade: **MÉDIO** · Matriz: I(3) × P(4) = 12
Evidência: `--grafite-claro: #83817B` dá 3,36:1 sobre `#F0EEE9`; mínimo 4,5:1.
Também o contador dos filtros (3,05:1) e o olive `#86836f` dos rótulos do
modal (3,30:1).
Recomendação: `#6B6964` (4,73 a 5,39), opacity 0.9, e `#5C5A55`. **Feito**.
Prompt dono: P09

### [ACHADO-08] Formatador apontado para arquivos que não pode tocar
Eixo: DX · Severidade: **MÉDIO** · Matriz: I(3) × P(3) = 9
Evidência: `format:check` acusava 54 arquivos, 36 em `deploy/` (saída de
build) e 13 em `src-site-3/` (templates com `{{ }}`). Formatar quebra o site.
Recomendação: `.prettierignore`. **Feito** (`161df59`).
Prompt dono: P05

### [ACHADO-09] 25 handlers de interação ainda mortos
Eixo: UX · Severidade: **ALTO** · Matriz: I(4) × P(5) = 20
Evidência: varredura template × publicado: 32 declarados, 7 religados antes
desta sessão, 5 religados nesta, 20 pendentes (especialidades, artigo do
blog, busca por IA).
Recomendação: pré-renderizar as visões de detalhe como páginas reais, já que
todas leem `location.hash`. **Não feito**, escopo de P02/P10.
Prompt dono: P02/P10

### [ACHADO-10] 68 URLs órfãs respondendo 404
Eixo: SEO · Severidade: **MÉDIO** · Matriz: I(3) × P(4) = 12
Evidência: diagnóstico de sessão anterior; 28 institucionais já cobertas por
páginas-ponte, 68 de blog e perfil seguem 404.
Recomendação: resolvido pelo mesmo trabalho do ACHADO-09.
Prompt dono: P10

### [ACHADO-11] Sem observabilidade e sem evento de conversão
Eixo: observabilidade · Severidade: **ALTO** · Matriz: I(4) × P(4) = 16
Evidência: nenhum evento disparado nos formulários corrigidos, nenhum
rastreio de erro, nenhum Web Vitals de campo. GTM presente mas
interaction-only.
Impacto: os leads voltaram a funcionar, mas ninguém sabe quantos acontecem.
Recomendação: matriz de eventos em P14, com ganchos já disponíveis nos
handlers novos.
Prompt dono: P14

### [ACHADO-12] 27 MB de PNG originais versionados
Eixo: repositório · Severidade: **BAIXO** · Matriz: I(2) × P(3) = 6
Evidência: `du -sh src-site-3` = 27 MB, contra 5,3 MB de `deploy/`.
Recomendação: mover para armazenamento externo ou Git LFS. Não urgente.
Prompt dono: P05

## 8. Conflitos latentes

### [CONFLITO-01] CSP do painel × `_headers` do repositório
Existe hoje: a CSP que chega ao visitante é injetada por regra no painel da
Cloudflare, não por `deploy/_headers`.
Vai colidir com: P07, porque toda melhoria de cabeçalho feita no repositório
será silenciosamente ignorada em produção.
Tratamento: o dono precisa assumir ou remover a regra do painel antes de P07.

### [CONFLITO-02] Mensuração × ausência de backend
Existe hoje: nenhuma conversão passa por servidor. WhatsApp e mailto saem do
navegador.
Vai colidir com: P14, que precisa de evento de sucesso **real** e não de
tentativa. Com esta arquitetura, só existe tentativa.
Tratamento: decidir em P14 entre aceitar medir intenção, ou introduzir um
endpoint que registre antes de redirecionar.

### [CONFLITO-03] Estilo inline × meta de LCP e design system
Existe hoje: 154 KB de HTML com estilo inline por elemento.
Vai colidir com: P06 (TETO-01) e P11 (tokens).
Tratamento: decisão do dono sobre a refatoração de CSS.

## 9. O que foi feito, com commit

| commit | fase | o que |
|---|---|---|
| `c11ed0a` | P04 | religa 3 formulários de lead e 2 filtros; 47 verificações |
| `d181388` | P06 | remove 3,3 MB de runtime; a11y, BP e SEO em 100 |
| `a8ed316` | P05 | conserta o build em clone limpo |
| `161df59` | P03/P05 | isola builds, endurece headers, reescreve os gates |

## 10. Contadores finais

- Achados: 2 críticos, 5 altos, 4 médios, 1 baixo. Total 12.
- Eixos auditados: 22 de 22.
- Páginas medidas com Lighthouse: 3, em 2 formas = 6 medições, antes e depois.
- Páginas auditadas em 402 px: 11 de 11.
- Verificações automatizadas em navegador: 47 (conversão) + 18 (gate de build).
- Itens de preservação absoluta mantidos: fotos, fontes, logo, paleta (com uma
  correção de contraste declarada), texturas, grids, espaçamentos, animações,
  CTAs, copy, headings, metadados, schema, sitemap, robots, páginas,
  componentes, layouts, links, blog, dados estruturados, tom de voz.
- Perguntas abertas ao dono: 7 (seção 5 de `ESTADO-REAL.md`) + 1 trade-off
  de teto técnico.
