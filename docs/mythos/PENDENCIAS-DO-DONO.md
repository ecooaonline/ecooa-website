# O que falta, e você é quem faz

Gustavo, este documento existe para você não perder tempo. Ele lista só o que
**eu não consigo fazer sozinho**: coisa que exige senha, painel de terceiro,
conta externa, advogado, ou papel que só você tem.

Tudo o que era decidível eu decidi e executei. Está em `EXECUCAO.md`.

**Como usar:** faça na ordem. Cada item diz quanto tempo leva, o que acontece se
você não fizer, e como conferir que deu certo. Se só tiver uma hora hoje, faça o
**dia 1** e pare. Ele sozinho vale mais que todo o resto somado.

---

## Painel de controle

| | O que é | Tempo seu | Sem isso... |
|---|---|---|---|
| ~~**1**~~ | ~~Segurança na Cloudflare~~ | ~~30 min~~ | **RESOLVIDO. Verificado nota A, nada a fazer** |
| **1** | Resolver as duas publicações concorrentes (o site roda na Vercel, não no GitHub Pages) | 20 min | confusão futura e trabalho perdido |
| **3** | Criar o perfil no Google | 2 h | você não aparece no mapa, e o mapa é onde a busca local acontece |
| **2** | Ligar as tags no GTM (**liberado, a CSP não bloqueia**) | 1 h | você segue sem saber o que traz paciente |
| **5** | Conseguir 10 registros profissionais | variável | 5 perfis ficam fora do Google e há risco com os conselhos |
| **6** | Advogado na política de privacidade | 1 a 2 semanas | o site publica um texto que se declara rascunho |
| **7** | Mudar para Cloudflare Workers | 2 h técnicas | sem HTTPS reforçado, sem cache, sem redirect de verdade |
| **8** | Material que só você tem (fotos, links, revisões) | contínuo | blocos prontos seguem esperando |
| **9** | Decisões de negócio (preço, agenda, resposta) | conversa | o funil termina no WhatsApp e depende de alguém responder |

---

# DIA 1 · As três coisas que mudam o jogo

## 1. Segurança na Cloudflare · RESOLVIDO, nada a fazer

**Verificado em 2026-08-02 pelo dono, no securityheaders.com. Nota A.**

> **Eu estava errado, e o erro era grande.** Eu disse que a CSP do seu domínio
> não tinha `connect-src` e que por isso a medição nunca funcionaria. Parti de
> uma anotação antiga de uma sessão anterior, tratei como fato, e não podia
> verificar porque não alcanço o domínio deste ambiente. A CSP real **tem**
> `connect-src`, e ela é permissiva. **A medição não está bloqueada.**

### O que o site de fato serve hoje

| Cabeçalho | Estado |
|---|---|
| `content-security-policy` | presente, com `connect-src 'self' https: wss:` |
| `strict-transport-security` | **já ligado**, `max-age=63072000; includeSubDomains; preload` |
| `x-frame-options` | `SAMEORIGIN`, mais `frame-ancestors 'self'` na CSP |
| `x-content-type-options` | `nosniff` |
| `referrer-policy` | `strict-origin-when-cross-origin` |
| `permissions-policy` | câmera, microfone, geolocalização e browsing-topics bloqueados |
| `cross-origin-opener-policy` | `same-origin` |
| Compressão | `gzip` ativo |

**Nota A, limitada apenas pelo aviso de `unsafe-inline`**, que é inevitável
enquanto o site tiver estilo e script embutidos no HTML. Isso só se resolve com
uma refatoração grande, e não vale o risco agora.

**Duas correções ao que eu havia escrito antes:**

1. O HSTS **já está ligado, com preload**. Meu aviso de "cuidado, é porta de mão
   única" chegou tarde: a decisão já foi tomada, e está certa.
2. A CSP já libera `googletagmanager` em `script-src` e em `frame-src`, e o
   `connect-src` com `https:` cobre o envio do GA4. **O item 4 está livre para
   ser feito agora.**

### Um detalhe pequeno, para quando você mexer

A CSP tem um erro de digitação: `form-action 'self' https://script.-google.com`.
O hífen antes de `google` não deveria existir; o correto é
`https://script.google.com`. Isso vem do tempo do formulário que enviava para o
Google Apps Script, que o site não usa mais. Não quebra nada hoje, porque os
formulários atuais abrem o WhatsApp por link e não por envio de formulário. Se
um dia você editar essa regra, aproveite e conserte.

---

## 2. Duas publicações concorrentes · 20 minutos

**Descoberta que resolve o mistério.** Os cabeçalhos do seu site trazem
`x-vercel-cache` e `x-vercel-id`. Ou seja: **o site é servido pela Vercel**,
atrás da Cloudflare. Não pelo GitHub Pages.

Isso explica por que o site continuou atualizando mesmo com a verificação do
GitHub Pages quebrada, que eu corrigi ontem. Ela nunca foi o caminho real. A
Vercel publica direto da branch `main`, e é por isso que tudo o que subi
apareceu no ar.

**O problema:** existem hoje dois caminhos de publicação apontando para o mesmo
domínio, e só um está em uso. Manter os dois é ter duas verdades: um dia alguém
mexe no errado e passa horas sem entender por que nada muda.

**O que fazer, 20 minutos:**

1. Entre em `vercel.com`, abra o projeto da ecooa e confirme:
   - qual branch publica (deve ser `main`);
   - qual pasta é publicada (**precisa ser `deploy/`**, e vale a pena conferir);
   - se o domínio `www.somosecooa.com.br` está apontado ali.
2. No GitHub, abra **Settings → Pages** e veja o campo **Source**.
   - Se estiver ativo, **desative**. Ele não serve o domínio e só gera confusão.
3. Me avise o que encontrou. Se a Vercel é o caminho oficial, eu ajusto o
   repositório para refletir isso: hoje o `deploy.yml` e vários documentos
   dizem "GitHub Pages", e isso está errado.

**Uma dúvida que só você resolve:** se a Vercel publica a pasta `deploy/`, tudo
certo. Se ela publica a raiz do repositório, então o site no ar pode não ser o
que penso que é. Confira essa configuração com atenção.

**Como saber que deu certo.** Um projeto de publicação ativo, um só, e a
documentação do repositório dizendo o nome dele.

---

## 3. Criar o perfil da ecooa no Google · 2 horas

**Por que isto primeiro.** Para clínica, o Perfil da Empresa no Google é o maior
fator isolado de aparecer no topo. Nenhuma linha de código substitui.

Eu já preparei o lado do site: a home, a localização e as 8 páginas de
especialidade publicam a ficha da clínica com endereço, telefone e horário, no
formato que o Google lê.

**Passo a passo:**

1. Entre em `business.google.com` e reivindique o perfil da ecooa.
2. **Escreva o endereço exatamente assim**, sem mudar nada:
   - Nome: `ecooa`
   - Endereço: `Rua Mariante, 180, 9º andar, Moinhos de Vento`
   - Cidade: `Porto Alegre` · Estado: `RS` · CEP: `90430-180`
   - Telefone: `(51) 99146-0909`
   - Site: `https://www.somosecooa.com.br/`

   Uma vírgula diferente entre o site e o perfil já atrapalha. É sério.
3. Horário: segunda a sexta, 8h às 20h.
4. Categoria principal: **Clínica médica**. Secundárias sugeridas:
   Nutricionista, Psicólogo, Dermatologista, Clínica de estética,
   Fisioterapeuta.
5. Fotos: fachada, recepção, corredor, uma sala. Sem paciente identificável.
6. **Me mande a latitude e a longitude do pino.** Deixei essa informação de fora
   do site de propósito: coordenada chutada atrapalha o pareamento. Com o número
   certo eu coloco.
7. Avaliações: combine com a equipe como pedir. **Nunca ofereça vantagem em
   troca de avaliação**, isso é vedado pelo CFM. Pedir com naturalidade ao fim
   de um atendimento bem resolvido é o caminho.

**Como saber que deu certo.** Buscar "ecooa Porto Alegre" no Google e ver o
painel lateral com endereço, horário e link do site.

---

# DIA 2 · Ligar a medição

## 4. Criar as tags no GTM · 1 hora

**Nada bloqueia este item.** A CSP do domínio foi verificada em 2026-08-02 e já libera o GTM e o envio do GA4. Pode fazer agora.

**O contexto.** O site nunca teve medição. O contêiner `GTM-TSR4GDMK` aparecia
em dez documentos e em zero páginas. Eu instalei a camada inteira, com respeito
à LGPD, mas ela está **desligada por uma chave**, esperando você.

**Por que desligada.** Duas razões honestas: a segurança da Cloudflare ainda
bloqueia o envio (item 1), e no celular o aviso de privacidade cobria o botão
de WhatsApp, que é o seu único caminho de conversão. Não fazia sentido custar
conversão para não entregar dado.

**Passo a passo:**

1. Em `tagmanager.google.com`, abra o contêiner `GTM-TSR4GDMK`.
2. **Tire um print do estado atual antes de mexer.**
3. Crie ou reaproveite uma propriedade GA4 e anote o ID (`G-XXXXXXXXXX`).
4. No GTM, crie a tag **Google Tag** com esse ID, disparo em **All Pages**.
5. Crie três gatilhos de **evento personalizado**, com estes nomes exatos:
   `whatsapp_click`, `form_submit`, `match_resultado`.
6. Crie uma tag de evento GA4 para cada um.
7. No GA4, marque `whatsapp_click` e `form_submit` como **conversão**.
8. Publique a versão.
9. Me avise, que eu ligo a chave no código e resolvo a sobreposição do aviso com
   o botão de WhatsApp.

**O que você vai passar a saber:** qual página traz paciente, qual artigo
converte, qual profissional é mais procurado, e de que bloco de queixa vem cada
contato.

**Uma coisa que eu decidi e você deve saber:** a frase que o paciente digita na
busca **não é enviada** para lugar nenhum. É dado de saúde. Só viaja a categoria
entendida, tipo "dor musculoesquelética". Não mude isso sem avaliação.

**Como saber que deu certo.** No GA4, em Tempo real, clicar num botão de
WhatsApp do site e ver o evento aparecer.

---

# DIA 3 · Tirar os riscos da mesa

## 5. Os dez registros profissionais · tempo variável

**A situação.** Dos 31 profissionais, 21 têm registro confirmado. Cinco estão
como "a confirmar" e cinco não têm número nenhum.

**O que eu fiz enquanto isso.** Os cinco sem número continuam com página no
site, funcionando normalmente para quem recebe o link, mas **fora do Google**,
até o número chegar. Anunciar atuação em saúde sem registro visível é frágil
perante os conselhos, e agora que cada um tem página própria a exposição é
maior.

São eles: Giancarla Rochemback, Marvin Marques, Gabrieli Avila, Lara Caye e
Adriana.

**O que fazer.** Peça o número do conselho a cada um e me mande. Eu atualizo, a
página volta ao Google sozinha e o site fica em conformidade.

---

## 6. Advogado na política de privacidade · 1 a 2 semanas

**O problema, em uma frase:** a política publicada no site diz, ao próprio
visitante, que é um rascunho não validado por advogado.

Isso pesa mais do que parece. Um paciente que lê aquilo entende que a clínica não
tratou o assunto com seriedade, e um conselho profissional pode ler do mesmo
jeito.

**O que pedir ao advogado:** revisar a política sob a LGPD, definir o encarregado
de dados (obrigatório), e revisar o site sob CFM 1.974/2011 e 2.336/2023, além
das normas de COFEN, CFN, CFF, CRP e CFO.

**O que entregar a ele.** Dois documentos que eu já escrevi:
`docs/mythos/baseline/etica.md` e `docs/mythos/P17-TRIBUNAL-ETICA.md`. O segundo
é um parecer completo, com os dispositivos citados.

**Uma boa notícia para levar junto:** o site não tem nota de avaliação, nem
depoimento de paciente, nem foto de antes e depois. E a verificação automática
impede que voltem por acidente.

---

# DIA 4 · Infraestrutura

## 7. Mudar para Cloudflare Workers · 2 horas técnicas

**O que está acontecendo hoje.** O arquivo `deploy/_headers` define proteções
importantes. O GitHub Pages **ignora esse arquivo por completo**. Então o site
vai ao ar sem HTTPS reforçado, sem cache longo nas imagens, e as URLs antigas
funcionam por um truque, não por redirecionamento de verdade.

**Cuidados que não podem falhar:**
- **Não toque no MX.** É o e-mail do domínio.
- SSL em **Full (strict)**. Nunca Flexible.
- **Não envie HSTS preload** sem decidir conscientemente: é porta de mão única,
  não tem volta fácil.

O passo a passo técnico está em `docs/DEPLOYMENT.md`, seção 5.

**Como saber que deu certo.** Rodar o site em `securityheaders.com` e tirar A ou
A+.

---

# CONTÍNUO · O que só você tem

## 8. Material físico e revisões

| O que | Para quê | Situação |
|---|---|---|
| Foto dos sócios juntos | página sobre | bloco pronto, esperando |
| Fotos novas do espaço | "projetado para acolher" e localização | idem |
| Links dos posts do Instagram | submenu editorial | hoje aponta para o perfil |
| Revisão dos serviços das 8 áreas | conteúdo que eu redigi | precisa do seu aval técnico |
| **Revisão dos 14 artigos por quem assina** | são textos de saúde com nome de profissional | **importante** |
| Revisão do mapa de sintomas do match | 28 blocos, 115 textos | quando puder |
| E-mail no domínio próprio | hoje é `ecooa.adm@gmail.com` | sinal de confiança |

Sobre os artigos: eles foram escritos na voz de cada profissional e passaram por
uma revisão automática que caçou promessa de resultado, dado inventado e desvio
de escopo. Foram 280 correções. Mas quem assina precisa ler antes de considerar
final. É o nome dele no texto.

---

## 9. Decisões que mudam o site, e que eu não tomo por você

1. **Preço e convênio.** O site não fala de nenhum dos dois. Quem procura saúde
   procura isso, e a ausência gera contato desqualificado e desistência
   silenciosa.
2. **Agendamento de verdade.** Hoje tudo termina no WhatsApp, que depende de
   alguém responder. Uma agenda real muda a conversão e atende fora do horário
   comercial.
3. **Tempo de resposta no WhatsApp.** Todo o funil desemboca ali. Sem um
   compromisso de tempo, todo investimento em busca vaza no último metro.

Uma banca independente avaliou o site e resumiu assim: *"foi construído até a
porta e parou ali"*. Estes três itens são a porta.

---

## Duas coisas que eu já resolvi e você deve saber

Não precisam de ação sua, mas mudam o que você vê:

**Aviso de urgência no match.** Quem escrever sofrimento agudo ou ideação
suicida na busca vê, antes de tudo, o telefone do CVV (188), o chat e a
orientação de emergência. Você autorizou. O detector foi calibrado para não
disparar com figura de linguagem: "morrendo de fome" e "morrer de tanta dor de
cabeça" não acionam nada.

**A palavra "especialista"** saiu da bio da Yale. Sem registro de qualificação de
especialista (RQE), o CFM não permite. Ela segue como "médica tricologista, com
atuação no diagnóstico e tratamento das alopecias", que é preciso e permitido.

---

## Quando você resolver algum item

Me diga qual. Eu removo daqui, aplico a mudança que ele destrava no site, e
registro em `EXECUCAO.md`. Vários destes itens destravam trabalho meu que já está
pronto e apenas esperando.
