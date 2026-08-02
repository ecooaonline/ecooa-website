# Por onde começar

Gustavo, esta pasta tem 20 documentos e cerca de 10 mil linhas. Você não precisa
ler nada disso para o site funcionar. Este arquivo existe para você achar
rápido o que interessa e ignorar o resto com tranquilidade.

---

## Se você tem 10 minutos

Leia só **[PENDENCIAS-DO-DONO.md](PENDENCIAS-DO-DONO.md)**, e só o painel de
controle no topo.

É a lista do que depende de você. Está em ordem de fazer, com tempo estimado,
o que colar em cada painel e como conferir que deu certo. Se você fizer apenas
o **Dia 1**, já terá destravado mais do que todo o resto somado.

---

## Se você tem 1 hora

Nesta ordem:

1. **[PENDENCIAS-DO-DONO.md](PENDENCIAS-DO-DONO.md)** inteiro · 15 min
   O que fazer, na ordem, com passo a passo.

2. **[SCORECARD-FINAL.md](SCORECARD-FINAL.md)** · 10 min
   As notas antes e depois, o que mudou em número, e o que não deu para medir
   daqui. Comece pela tabela do topo.

3. **[P19-BANCA-VALOR.md](P19-BANCA-VALOR.md)**, só a conclusão · 10 min
   Quanto vale o ativo hoje (R$ 58 a 105 mil de reposição) e a frase que resume
   o problema comercial: *"foi construído até a porta e parou ali"*.

4. **[P17-TRIBUNAL-ETICA.md](P17-TRIBUNAL-ETICA.md)**, seções 10 e 11 · 15 min
   O risco regulatório real, com os dispositivos citados. É o documento para
   levar ao advogado.

5. **[EXECUCAO.md](EXECUCAO.md)** · 10 min
   O diário do que foi feito e por quê. Útil se você quiser entender as
   decisões que tomei sem você.

---

## Os 20 documentos, por finalidade

### Para agir

| Documento | Para quê | Linhas |
|---|---|---|
| [PENDENCIAS-DO-DONO.md](PENDENCIAS-DO-DONO.md) | **o que você faz.** Roteiro por dia | 288 |
| [EXTRA-GBP.md](EXTRA-GBP.md) | passo a passo do Perfil da Empresa no Google, com categorias sugeridas | 879 |

### Para entender o estado

| Documento | Para quê | Linhas |
|---|---|---|
| [SCORECARD-FINAL.md](SCORECARD-FINAL.md) | notas antes e depois, números do que mudou | 170 |
| [BASELINE-SCORECARD.md](BASELINE-SCORECARD.md) | o retrato inicial, 10 dimensões, 73 achados | 473 |
| [EXECUCAO.md](EXECUCAO.md) | diário do que foi feito e por quê | 219 |

### Os pareceres independentes

Cinco auditorias feitas por quem **não** participou da execução. É onde estão as
críticas mais duras, inclusive ao meu próprio trabalho.

| Documento | Nota | O que julga |
|---|---:|---|
| [P13-QA-FINAL.md](P13-QA-FINAL.md) | 72 | se o que foi declarado como pronto se sustenta na prova |
| [P19-BANCA-VALOR.md](P19-BANCA-VALOR.md) | 63 | quanto vale o ativo e o que falta para converter |
| [EXTRA-GBP.md](EXTRA-GBP.md) | 61 | prontidão para busca local |
| [P17-TRIBUNAL-ETICA.md](P17-TRIBUNAL-ETICA.md) | 52 | risco perante CFM, COFEN, CFN, CFF, CRP, CFO e LGPD |
| [P16-REVISOR-MAGNO.md](P16-REVISOR-MAGNO.md) | 6,3/10 | qualidade do método e da execução |

### Os laudos técnicos do estado inicial

Leia só se quiser o detalhe de uma dimensão específica. Cada um traz método,
números medidos e tabela de achados.

| Laudo | Nota inicial |
|---|---:|
| [baseline/performance.md](baseline/performance.md) | 58 |
| [baseline/conversao.md](baseline/conversao.md) | 57 |
| [baseline/acessibilidade.md](baseline/acessibilidade.md) | 52 |
| [baseline/etica.md](baseline/etica.md) | 46 |
| [baseline/seo-tecnico.md](baseline/seo-tecnico.md) | 44 |
| [baseline/ux-ui.md](baseline/ux-ui.md) | 44 |
| [baseline/seguranca.md](baseline/seguranca.md) | 42 |
| [baseline/infra-dx.md](baseline/infra-dx.md) | 34 |
| [baseline/conteudo.md](baseline/conteudo.md) | 33 |
| [baseline/analytics.md](baseline/analytics.md) | 26 |

### Técnico, para uma IA futura ou um desenvolvedor

| Documento | Para quê |
|---|---|
| [NAVEGACAO-AGENTICA.md](NAVEGACAO-AGENTICA.md) | como o site fala com agentes de IA: llms.txt e WebMCP, com a spec verificada |
| [../MYTHOS-ARQUITETURA.md](../MYTHOS-ARQUITETURA.md) | como as 20 skills foram organizadas em ondas |
| [../ESTADO-REAL.md](../ESTADO-REAL.md) | **a fonte da verdade técnica.** Leia antes de mexer em qualquer coisa |

---

## O que falta, em uma tela

### Você faz (7 itens)

| # | O que | Tempo | Trava o quê |
|---|---|---|---|
| 1 | Conferir a CSP na Cloudflare (passo 0 leva 30 s) | 30 min | pode estar travando **toda a medição** |
| 2 | Conferir Settings > Pages | 10 min | publicação |
| 3 | Perfil da Empresa no Google | 2 h | **busca local, o maior fator** |
| 4 | Tags no GTM (depois do 1) | 1 h | saber o que traz paciente |
| 5 | 10 registros profissionais | variável | 5 perfis fora do Google |
| 6 | Advogado na política | 1 a 2 semanas | risco regulatório |
| 7 | Cutover Cloudflare Workers | 2 h | HTTPS reforçado, cache, redirects |

### Eu faço, quando você destravar

| Quando você... | Eu faço |
|---|---|
| corrigir a CSP e criar as tags | ligo a medição e resolvo a sobreposição do aviso com o botão de WhatsApp |
| mandar a coordenada do Maps | entra no dado estruturado |
| mandar os 10 registros | os 5 perfis voltam ao Google sozinhos |
| mandar as fotos | entram nos blocos que já estão prontos esperando |
| revisar os textos das áreas e artigos | ajusto o que você marcar |

### Decisões de negócio que só você toma

Preço e convênio no site. Agendamento de verdade em vez de WhatsApp. Tempo de
resposta combinado no WhatsApp. Uma banca independente resumiu: o site *"foi
construído até a porta e parou ali"*. Estes três itens são a porta.

---

## Como proceder, na prática

**Hoje.** Abra `PENDENCIAS-DO-DONO.md` e comece pelo **passo 0 do item 1**: são
30 segundos no `securityheaders.com` para descobrir se existe uma CSP no site.
O resultado decide se você precisa mexer na Cloudflare ou pode pular direto. Em
seguida, o item 2 (10 minutos, GitHub). Os dois juntos destravam a medição e
confirmam que o site publica.

**Esta semana.** Item 3, o Perfil da Empresa no Google. Reserve duas horas
seguidas, sem pressa, e capriche nas fotos. É o que mais move o ponteiro para
aparecer no mapa.

**Depois disso, me chame.** Vários trabalhos meus estão prontos e apenas
esperando: a medição está instalada e desligada por uma chave, os blocos de foto
existem vazios, e os 5 perfis saem do `noindex` no instante em que os registros
chegarem.

**Em paralelo, sem pressa.** Mande a política para um advogado e peça aos
profissionais que leiam os textos que assinam. Nenhum dos dois bloqueia o site,
mas os dois reduzem risco real.

---

## Uma coisa que vale saber antes de ler os pareceres

Os cinco tribunais foram instruídos a procurar defeito, inclusive no meu
trabalho, e acharam. Sete defeitos meus estão documentados, entre eles um em que
corrigi um problema introduzindo outro idêntico no mesmo commit, e um em que uma
correção técnica recriou um risco de privacidade que eu mesmo tinha removido
horas antes.

Todos foram corrigidos e verificados no navegador. Estão registrados de
propósito: um relatório que só mostra acerto não serve para decidir nada.
