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
| **1** | Ajustar a segurança na Cloudflare | 30 min | nenhuma medição funciona, nunca |
| **2** | Conferir como o site publica | 10 min | mudanças podem não chegar ao ar |
| **3** | Criar o perfil no Google | 2 h | você não aparece no mapa, e o mapa é onde a busca local acontece |
| **4** | Ligar as tags no GTM | 1 h | você segue sem saber o que traz paciente |
| **5** | Conseguir 10 registros profissionais | variável | 5 perfis ficam fora do Google e há risco com os conselhos |
| **6** | Advogado na política de privacidade | 1 a 2 semanas | o site publica um texto que se declara rascunho |
| **7** | Mudar para Cloudflare Workers | 2 h técnicas | sem HTTPS reforçado, sem cache, sem redirect de verdade |
| **8** | Material que só você tem (fotos, links, revisões) | contínuo | blocos prontos seguem esperando |
| **9** | Decisões de negócio (preço, agenda, resposta) | conversa | o funil termina no WhatsApp e depende de alguém responder |

---

# DIA 1 · As três coisas que mudam o jogo

## 1. Ajustar a segurança na Cloudflare · 30 minutos

**O que está errado.** A regra de segurança que vale no seu site não está no
repositório: ela vive num painel da Cloudflare. E essa regra não deixa nenhum
dado sair do navegador para o Google. Ou seja, você pode configurar o GTM
perfeitamente e ainda assim **medir zero**, sem nenhuma mensagem de erro.

**Onde ir.** Cloudflare → seu domínio → Rules → a regra que define
`Content-Security-Policy`.

**O que colar.** Acrescente estes três pedaços:

```
connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;
frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com;
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
```

E, já que está lá, acrescente também estes, que fecham buracos de segurança:

```
frame-ancestors 'none';
base-uri 'self';
form-action 'self' https://wa.me;
```

O arquivo `deploy/_headers` já tem a versão completa e correta, pode copiar de
lá.

**Como saber que deu certo.** Abra o site, aperte F12, aba Console. Se não
aparecer erro vermelho falando de `google-analytics`, funcionou.

---

## 2. Conferir como o site publica · 10 minutos

**O que aconteceu.** Uma verificação automática do GitHub exigia um arquivo que
foi apagado há semanas. Ela falhava, e a publicação parava junto. Isso pode ter
deixado o site congelado sem ninguém perceber. Eu já corrigi a verificação.

**O que você precisa fazer.** Abra o repositório no GitHub → **Settings** →
**Pages** → veja o campo **Source**.

- Se estiver **GitHub Actions**: o site esteve parado e voltou a andar agora.
  Abra a aba **Actions** e veja se as últimas execuções estão verdes.
- Se estiver **Deploy from a branch**: então a verificação nunca foi o caminho
  real. Me avise, porque aí temos duas verdades no repositório e uma delas
  precisa sair.

**Como saber que deu certo.** Aba Actions com bolinha verde no último push.

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

**Faça o item 1 antes.** Sem ele, isto aqui não mede nada.

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
