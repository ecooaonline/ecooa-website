# PLANO DE REFORMULAÇÃO B2C · ecooa

> **Status de implementação:** Ondas 1 a 4 implementadas e revisadas (QA multi-agente com 10 achados corrigidos). Google Reviews com URL real (g.page). 25 registros profissionais publicados (validados pelo gestor em 2026-07). Decisões do gestor: "respondemos em minutos" confirmado e mantido; "5 dias úteis" suavizado para "sem lista de espera / agendamento ágil"; bioimpedância publicada sem preço (consultar no WhatsApp). Cris Neumann removida do site (saiu da ecooa, redirect ativo). Eduarda Schoenmeier e Tais de la Rosa adicionadas.
> **Pendências operacionais:** fotos de Eduarda e Tais (cards com silhueta até lá); CRN de Gabrieli, Giancarla, Lara e Marvin (sem registro exibido até obter); re-consentimento de depoimentos; `pricing` em professionals.ts; atualização do container GTM com a nova taxonomia (ver docs/GTM-DATA-INTENTS.md); redeploy do google-apps-script.js no GAS (nomes de profissionais atualizados).

Documento único de implementação. Direção base: "sua história muda de capítulo" (Jornada de Transformação ecooa), enriquecida com os melhores elementos de "Ciência traduzida" e "a vida que ecooa", conforme veredito do painel.

---

## 1. Visão e conceito central

Cada página do site deixa de ser um catálogo da clínica e vira a narrativa da travessia do paciente em cinco atos: o espelho (a dor nomeada em primeira pessoa, clicável), a encruzilhada (ecooa.match indicando o caminho), o guia (o profissional real, com rosto e registro), o mapa (protocolos produtizados com etapas e prazos honestos) e o primeiro passo (uma mensagem de WhatsApp que já sai escrita com a dor da pessoa). A frase de dor é o próprio botão de conversão: atacamos a maior fricção da persona (mulher 30-70, A/B, Porto Alegre), que não é preço nem distância, é o custo emocional de iniciar a conversa. Sobre essa espinha narrativa, aplicamos a disciplina de "Ciência traduzida" (todo termo técnico ganha tradução "em bom português", todo número é verificável, preço ancorado onde possível) e o calor de "a vida que ecooa" (marquee de desejos, respiros editoriais em Playfair itálico). Todo o conteúdo B2B sai do fluxo do paciente e migra para /para-profissionais, com link discreto no footer.

Síntese da promessa, que orienta toda a copy: **"Chegue com o que dói. Saia com um plano."**

---

## 2. Princípios de copy B2C

Regras práticas, válidas para todas as páginas:

1. **A dor antes da marca.** O paciente pensa em problemas (emagrecer, cabelo, pele, ansiedade), não em unidades. Nos textos visíveis usar "medicina", "nutrição", "estética", "saúde mental". As submarcas ecooa.med, ecooa.esthetic, ecooa.working e ecooa.mind aparecem apenas como assinatura pequena no rodapé de cards e seções. A marca aprende o paciente antes de exigir que o paciente aprenda a marca.
2. **Primeira pessoa no espelho, segunda pessoa no resto.** Dores clicáveis sempre em primeira pessoa ("meu cabelo está caindo e ninguém leva a sério"). Copy de seção sempre em segunda pessoa ("você conta sua história uma vez").
3. **Todo jargão ganha tradução colada (padrão "em bom português").** Bioimpedância: "uma balança inteligente que separa músculo, gordura e água". Bioestimulador: "colágeno estimulado aos poucos, para você parecer você, só que descansada". Proibido no texto visível: NADH, anabolismo fisiológico, hormonologia, metabolômica, dermatofuncional sem tradução. Cada tradução deve ser validada pelo profissional da área.
4. **Processo, nunca resultado.** Prometemos investigação, escuta, método e acompanhamento. Nunca prometemos emagrecer X kg, curar, rejuvenescer. Fórmula fixa para expectativa: "o que pacientes costumam relatar".
5. **Um CTA primário por dobra.** Secundários viram link de texto. Redutores de risco sempre colados ao botão como selo visível (nunca microcopy de 11px): "respondemos em minutos", "primeira consulta sem compromisso", "sigilo absoluto" quando aplicável, "seg a sex, 9h às 20h".
6. **Toda frase de dor tem porta neutra.** Em todo bloco de espelho, incluir a saída para quem não sabe nomear: "não sei bem o que sinto, só sei que preciso conversar".
7. **Empatia antes da aspiração em dores agudas.** Em saúde mental, compulsão alimentar e queda de cabelo, a identificação vem antes de qualquer argumento racional ou aspiracional. Regra de ordem de dobras, não de estilo.
8. **Número só se for verificável e mantido.** Nota do Google sempre com contagem de avaliações e link para o perfil real. "Primeira sessão em até 5 dias úteis" e "respondemos em minutos" só permanecem com confirmação operacional da recepção e revisão mensal.
9. **Nomear o que o paciente busca.** "Canetas emagrecedoras (como Ozempic, Mounjaro, semaglutida e tirzepatida)" no texto visível. Titles e meta descriptions mantêm keywords transacionais ("nutricionista Porto Alegre", "transplante capilar Porto Alegre").
10. **Identidade preservada.** Labels de navegação lowercase, sem em-dash, acentos corretos, tom acolhedor e sofisticado. Mais CTAs não pode virar landing agressiva: hierarquia disciplinada protege o minimalismo premium.

---

## 3. Por página

### 3.1 Home (src/pages/index.astro)

**Objetivo:** converter o visitante frio em conversa de WhatsApp qualificada por dor, ou encaminhá-lo para a landing da sua dor. **Persona:** mulher 30-70, A/B, Porto Alegre, frustrada com consultas apressadas, pesquisando por sintoma ou por indicação.

**Hero (copy pronta):**
- Headline: **"Chegue com o que dói. Saia com um plano."**
- Subheadline: "Medicina, nutrição, estética e saúde mental conversando entre si, em Moinhos de Vento. Aqui você conta sua história uma vez, e um time inteiro cuida do resto."
- MatchBar logo abaixo: "conte em uma frase o que você está sentindo", placeholder "ex.: cansada de dietas que não funcionam", botão "encontrar meu especialista". Fallback padrão: deep-link de WhatsApp com a frase digitada.
- Badge: "5.0 no Google · XX avaliações" com link para o perfil real do Google (corrigir a URL genérica atual).

**Wireframe de seções, em ordem:**

1. **Hero + MatchBar** (acima). O marquee sai da primeira dobra.
2. **EspelhoSection "Você se reconhece?"**: seis frases de dor em primeira pessoa, todas clicáveis abrindo WhatsApp pré-preenchido: "cansada de dietas que não funcionam" · "meu cabelo está caindo e ninguém leva a sério" · "me olho no espelho e não me reconheço" · "vivo no automático, ansiosa e sem energia" · "meus exames dizem que está tudo normal, mas eu não estou" · "não sei bem o que sinto, só sei que preciso conversar". Fecho: "Se alguma dessas frases podia ser sua, você chegou ao lugar certo."
3. **ProvaViva**: faixa compacta: "5.0 no Google (XX avaliações)" com link · "cuidando de Porto Alegre desde 2021" · "30+ profissionais que dividem o seu caso" · "consultas com tempo de verdade".
4. **Marquee reescrito como fio de desejos**: "energia · presença · autoestima · paz com a comida · cabelo de volta · mente leve · longevidade" (troca de strings, custo zero).
5. **"Como sua história muda aqui"** (jornada em 3 atos, substitui a metodologia abstrata): Ato 1, "você conta sua história" (pelo WhatsApp, do seu jeito, pode ser áudio); Ato 2, "a gente indica o guia certo" (o ecooa.match cruza sua queixa com mais de 30 especialistas); Ato 3, "seu time monta o plano junto" (médico, nutricionista e psicóloga conversam entre si, você não repete sua história a cada consulta). CtaBand: "começar pela primeira conversa".
6. **Portas de transformação** (substituem os persona cards por unidade): cinco DesireCards por dor: "quero emagrecer de vez, com saúde" (Protocolo Peso Seguro) · "quero meu cabelo de volta" (Jornada Capilar) · "quero me reconhecer no espelho" (estética com resultado natural) · "quero sair do modo sobrevivência" (sessão de acolhimento em até 5 dias úteis) · "quero comer sem culpa" (nutrição comportamental). Submarca só como assinatura no rodapé do card.
7. **Comparativo ético "o cuidado apressado vs o cuidado ecooa"** (resgate da direção 2, versão suavizada e pré-aprovada juridicamente, sem citar ninguém): "consulta de 10 minutos" vs "consulta com tempo de verdade" · "seus exames estão normais, próximo" vs "seus exames explicados um a um" · "cada especialista numa clínica" vs "seu time no mesmo prontuário". Compara modelos de atendimento genéricos, nunca clínicas ou colegas.
8. **CapituloDepoimento**: três depoimentos como capítulos com contexto autorizado. Destaque tipográfico serif itálico para "Depois de passar por vários endocrinologistas sem resultado, aqui em três meses já vi mudanças reais." Tag de jornada ("acompanhamento de emagrecimento, 6 meses") e selo "publicado com autorização". CtaBand ao final.
9. **"Guias, não heróis"**: fundadores contados pela frustração de origem, não pelos cargos: "A ecooa nasceu do cansaço de ver consultas de 10 minutos decidirem a saúde de alguém. Gustavo, médico, e Jessica, nutricionista, criaram um lugar onde escutar vem antes de prescrever." Link discreto "nossa história" para /quem-somos.
10. **Método Gehrke 360° (teaser produtizado)**: card único com as 4 etapas (escuta longa, exames e testes genéticos, protocolo no seu nível, acompanhamento contínuo) e CTA honesto "conhecer o método" para /ecooa-med.
11. **FaqVisivel**: accordion com as 5 perguntas do JSON-LD hoje invisível + "quanto custa a primeira consulta?" + "atendem convênio?" (resposta honesta: particular, com recibo para reembolso). Destaque para "segunda a sexta, das 9h às 20h". Cada resposta termina em link de WhatsApp.
12. **Blog** (3 artigos recentes) com tratamento editorial.
13. **PrimeiroPassoCTA final**: "Seu próximo capítulo começa com uma mensagem." Botão "começar pela primeira conversa" + selos de redução de risco.

**CTAs:** principal "começar pela primeira conversa" → WhatsApp (51) 99146-0909 pré-preenchido pela dor de origem (data-intent), com selos "respondemos em minutos · seg a sex, 9h às 20h". A MatchBar é a variante de baixo atrito do mesmo CTA. Secundário: "agendar avaliação" (/agendamento) como link.

**O que sai e por quê:**
- Bullet "Valor para o profissional" da seção Nosso Espaço e banner "Profissional de saúde?": vazamento B2B no coração do funil, revelam o modelo de salas e falam com outra audiência. Migram para /para-profissionais; resta um link de uma linha no footer.
- Seção "Quem somos" com "ecossistema de crescimento, inovação, networking": jargão de pitch que esfria o paciente. Substituída pelo bloco "Guias, não heróis".
- Persona cards por unidade (quero cuidar da minha "nutrição" → ecooa.working): taxonomia interna imposta. Substituídos pelas portas de transformação por dor.
- Card "Carreiras que ecooam" do grid Instagram: conteúdo B2B numa seção que promete resultados reais. Grid inteiro só volta quando houver thumbnails reais (ver roadmap); até lá, a seção sai.
- FAQ apenas em JSON-LD: promovido a accordion visível.
- Números "9 salas": métrica de infraestrutura que reforça leitura de coworking; substituir pelos números da ProvaViva.

---

### 3.2 Medicina (src/pages/ecooa-med.astro)

**Objetivo:** converter a paciente com queixa metabólica/hormonal em avaliação, produtizando o Método Gehrke 360° e os protocolos. **Persona:** mulher ou homem 35-55 que "já tentou de tudo", ouviu que está tudo normal, considera canetas emagrecedoras ou investigação hormonal.

**Hero (copy pronta, fundo ink mantido):**
- Headline: **"Você sente que algo não está bem. Mesmo quando o exame diz que está tudo normal."**
- Subheadline: "Consultas de 50 minutos, investigação metabólica e hormonal profunda e um plano com começo, meio e acompanhamento. É o Método Gehrke 360°."
- Selos legíveis junto ao botão (fim dos 11px apagados): "respondemos em minutos · agenda de novas avaliações limitada por mês".

**Wireframe:**

1. **Hero + ProvaViva** ("5.0 no Google" · "consultas de 50+ minutos" · "desde 2021").
2. **EspelhoSection por queixa** (evolução do quiz atual, mantendo a mecânica de WhatsApp pré-preenchido que já funciona): "faço tudo certo e a balança não sai do lugar" · "meu cabelo fica no travesseiro toda manhã" · "vivo cansada e nenhum exame explica" · "minha libido sumiu e ninguém pergunta sobre isso" · "entrei na menopausa e não me reconheço" · "não sei o que tenho, só sei que não estou bem".
3. **"Quem vai te guiar"**: Dr. Gustavo Gehrke com foto, CRM e storytelling em primeira pessoa: "Criei o Método 360° depois de anos vendo pacientes saírem de consultas de 10 minutos com uma receita e nenhuma resposta. Acredito que saúde de verdade começa por entender o próprio corpo." Seção escala via getProfessionalsByUnit('med').
4. **"O mapa da sua investigação"** (Método Gehrke 360° como JornadaTimeline, sem promessa de resultado): Semana 1, escuta de 50 minutos e pedido de exames; Semana 3, devolutiva com cada exame explicado em bom português; Mês 1, protocolo no seu nível (Reset, Equilíbrio ou Performance, com tradução: "Reset: quando o corpo pede recomeço. Equilíbrio: constância, sono e disposição. Performance: quando o bom já não basta."); Mês 3, reavaliação com dados comparados. CTA: "descobrir meu nível" (mini-quiz de 5 perguntas que termina no WhatsApp com o nível pré-preenchido).
5. **ProtocoloCards com CTA em todos**: Peso Seguro ("para quem já tentou de tudo; avaliação metabólica, canetas emagrecedoras como semaglutida e tirzepatida quando indicadas, nutrição integrada") · Tricometabólico ("para queda de cabelo com causa de dentro pra fora") · Saúde Hormonal Feminina ("menopausa e ciclos que viraram inimigos") · Saúde Hormonal Masculina ("energia, força e libido em baixa") · Performance ("mais força e recuperação com protocolos seguros e monitorados") · Longevidade · Check-up 360 ("um retrato completo do seu corpo hoje") · Bioimplantes. Estrutura fixa: para quem é / o que inclui / primeiro passo / CTA "quero avaliar meu caso".
6. **CapituloDepoimento** antes do FAQ: "D., Protocolo Peso Seguro, 6 meses de acompanhamento". Destaque principal para o capítulo dos "vários endocrinologistas sem resultado". CtaBand ao final.
7. **"Como funciona sua primeira consulta"**: 3 passos (você conta sua história pelo WhatsApp; agendamos a avaliação de 50 minutos; você sai com pedido de exames e o desenho do seu plano), com o que levar: "traga seus exames antigos, mesmo os que ouviram que estavam normais". Âncora de preço: "consulta de avaliação a partir de R$ X, com recibo para reembolso do seu plano" (depende do campo pricing, ver roadmap).
8. **FaqVisivel** (agora depois do como funciona, ordem corrigida): quanto custa (com faixa real), convênio (particular com recibo), online, "as canetas emagrecedoras são seguras?" com a formulação compliance-safe: "quando há indicação médica, com acompanhamento e exames". A pergunta defensiva do plano alimentar sai, substituída por "como a nutrição entra no meu tratamento" (ponte com a nutrição da casa).
9. **PrimeiroPassoCTA final**: **"Traga seus exames. A gente explica o resto."** Botões "falar pelo whatsapp" e "agendar avaliação".

**CTAs:** principal "quero avaliar meu caso" → WhatsApp pré-preenchido por queixa ou protocolo (data-intent por card). StickyWhatsApp no mobile em toda a rolagem.

**O que sai e por quê:** formulário B2B de médicos (seção 6 atual) e B2BBanner (seção 10 atual) migram para /para-profissionais: dois blocos falando com outra audiência no meio do funil de decisão. Jargão (NADH, anabolismo fisiológico, hormonologia) sai do texto visível. Urgência ilegível de 11px vira selo legível. FAQ antes do como funciona é reordenado.

---

### 3.3 Estética (src/pages/ecooa-esthetic.astro)

**Objetivo:** converter dores de autoestima (cabelo, rosto, pele, corpo) em avaliação, sustentando "referência em Porto Alegre" com rostos e credenciais reais. **Persona:** mulher 30-70 incomodada com o espelho, com medo de resultado artificial; homem 30-50 considerando transplante capilar.

**Hero (copy pronta, fundo brand mantido):**
- Headline: **"Voltar a se reconhecer no espelho. Sem virar outra pessoa."**
- Linha de apoio (resgate da direção 3): "Ninguém vai perceber o que você fez. Todos vão notar como você está."
- Subheadline: "Cabelo, rosto, pele e corpo com médicas dermatologistas, tricologistas e transplante capilar FUE Safira. Resultado natural, decidido junto com você."
- Selos: "respondemos em minutos · retorno incluído em todos os procedimentos".
- O bordão "com muito bom gosto" sai do hero e sobrevive uma única vez, na seção de filosofia.

**Wireframe:**

1. **Hero + ProvaViva** ("5.0 no Google" · "médicas dermatologistas e tricologistas" · "retorno incluído" · "avaliação antes de qualquer procedimento").
2. **EspelhoSection "O que te incomoda quando você se olha?"**: quatro portas de dor que substituem o grid plano de 10 procedimentos: CABELO ("meu cabelo está caindo e já tentei de tudo") · ROSTO ("as linhas chegaram antes do que eu esperava") · PELE ("manchas e acne que nenhum creme resolve") · CORPO ("gordura localizada e flacidez que treino não muda") + porta neutra ("não sei o que preciso, quero uma avaliação"). Cada porta abre bloco com os procedimentos traduzidos em benefício: toxina e bioestimulador viram "suavizar linhas mantendo a expressão; colágeno estimulado aos poucos, para você parecer você, só que descansada"; FUE Safira vira "transplante fio a fio com cicatrização mais rápida". CTA WhatsApp pré-preenchido por porta.
3. **Empatia mantida** ("Você olha no espelho e algo incomoda...") com o CTA que hoje falta no pico emocional: "conte o que te incomoda no whatsapp, sem compromisso".
4. **"Quem cuida de você"** (GuiaCards via getProfessionalsByUnit('esthetic')): Dra. Vitória Machado e Dra. Renata Bohn (dermatologistas, CRM), Dra. Larissa Wiebbelling (transplante FUE e Sapphire, "devolve autoestima com precisão e delicadeza"), Dra. Yale Jeronimo (tricologista) e o time de tricologistas, com registro e CTA individual "começar com a Larissa" (ativar só após alinhar o fluxo da recepção, ver riscos).
5. **Jornadas assinadas** (JornadaTimeline dia 0 > 30 > 90 > 180, expectativa realista, sem antes/depois de paciente): "Jornada Capilar ecooa" (avaliação tricológica, tratamento clínico, PRP e soroterapia e, quando indicado, transplante FUE Safira, com nutrição integrada) · "Jornada Pele Viva" (gerenciamento de pele, peeling e nutrição estética para manchas e acne) · "Jornada Harmonia" (rosto, com naturalidade como regra) · "Jornada Contorno" (corpo). Copy da timeline: "Dia 0: procedimento. Mês 1: o colágeno começa a responder. Mês 3: é quando a maioria percebe a diferença no espelho. Mês 6, no transplante: fase de crescimento visível." Disclaimer: "resultado progressivo e individual". Aqui a promessa "estética como extensão da saúde" é mostrada, não só dita.
6. **CapituloDepoimento** com tag de procedimento: "meus amigos acharam que eu só tinha mudado o corte de cabelo" (J., Jornada Capilar) como capítulo de destaque. CtaBand ao final.
7. **"Como funciona"** com a reversão de risco promovida a manchete: "Avaliação sincera: se um procedimento não for para você, a gente diz. Retorno incluído em todos os protocolos." 4 passos mantidos.
8. **FaqVisivel de objeção real**: "vou ficar com cara de feito?" (resposta: "nosso critério é você se reconhecer no espelho; se não for seguro ou não for para você, a gente diz não") · "dói?" · "quanto tempo de recuperação?" · "quando o resultado aparece?" · "quanto custa a avaliação?" (com faixa e parcelamento). Cada resposta termina no WhatsApp.
9. **PrimeiroPassoCTA final**: **"Seu espelho pode voltar a ser um lugar bom."** + versão compacta do Espelho (4 portas em linha) para quem rolou tudo. Urgência ética específica: "agenda de transplante limitada a X procedimentos por mês, para dedicação integral da equipe".

**CTAs:** principal "contar o que me incomoda" → WhatsApp pré-preenchido pela porta (cabelo, rosto, pele, corpo), repetido no hero, nas portas, nas jornadas e no fechamento.

**O que sai e por quê:** B2BBanner migra para /para-profissionais (falava com outro público na zona de decisão). Grid de 10 procedimentos em peso igual vira as 4 portas (catálogo sem saída de conversão). Osteopatia sai do fluxo estético (quebrava o posicionamento com "cólicas e bebês") e vira bloco discreto "também cuidamos do seu corpo por dentro" no fim da página. "Vagas limitadas" genérico é substituído pela escassez com motivo crível.

---

### 3.4 Saúde mental (src/pages/ecooa-mind.astro)

**Objetivo:** reduzir ao mínimo o custo emocional de pedir ajuda e converter em sessão de acolhimento. **Persona:** adulto 30-70 com ansiedade, esgotamento ou compulsão, adiando a terapia, sensível a julgamento e a burocracia. Regra de ouro desta página: empatia antes de qualquer aspiração ou argumento.

**Hero (copy pronta):**
- Headline: **"Você não precisa dar conta de tudo sozinho."**
- Linha de apoio: "Pedir ajuda não é fraqueza. É o primeiro capítulo."
- Subheadline: "Psicologia presencial em Moinhos de Vento ou online, com sessão de acolhimento em até 5 dias úteis. Sem lista de espera, sem julgamento."
- Selos colados ao botão: "sigilo absoluto · primeira sessão sem compromisso · respondemos em minutos".
- Vocabulário oficial da página inteira: "sessão de acolhimento" (nunca "avaliação").

**Wireframe:**

1. **Hero** (acima).
2. **EspelhoSection** (empatia primeiro, sempre): cinco frases clicáveis em tom suave: "acordo cansada mesmo tendo dormido" · "a ansiedade chega sem avisar" · "estou no automático faz tempo" · "trabalho, entrego, sorrio, e por dentro estou no limite" · "como por ansiedade e depois me culpo" + porta neutra: "não sei nomear o que sinto, só sei que preciso conversar". Fecho: "Pedir ajuda não é fraqueza. É o primeiro capítulo."
3. **"Quem caminha com você"** (GuiaCards via getProfessionalsByUnit('mind')): Manuela Vanti (psicóloga, TCC, CRP visível, "cria espaço seguro para que cada pessoa possa ser vulnerável") · Francielle Beria ("acolhe sem julgamento e ajuda a encontrar clareza emocional") · Augusto Kauer (psicologia esportiva, para atletas e alta cobrança). CTA individual "começar com a Manuela". Triagem leve estilo ecooa.match: "não sabe com quem começar? responda 3 perguntas e indicamos". **Obrigatório antes do go-live:** a promessa de psiquiatria é reescrita em title, FAQ e depoimentos até existir psiquiatra no portfólio: "quando há indicação de avaliação médica, o encaminhamento acontece dentro da ecooa, com seu histórico junto".
4. **"Por que TCC, em bom português"** (resgate da direção 2): "A Terapia Cognitivo-Comportamental é a abordagem mais estudada do mundo para ansiedade. Em bom português: não é só desabafar; você aprende, sessão a sessão, a identificar os padrões que alimentam a ansiedade e a agir sobre eles."
5. **"O caminho, sem pressa"** (JornadaTimeline emocional): Etapa 1, primeira conversa pelo WhatsApp, no seu ritmo, por texto ou áudio; Etapa 2, sessão de acolhimento em até 5 dias úteis, você decide se continua; Etapa 3, acompanhamento com objetivos combinados entre vocês. Bloco de → para conceitual: de "acordar no automático" para "energia para o que importa", com honestidade explícita: "terapia não é mágica, é caminho; nas primeiras semanas, muitos pacientes relatam alívio só por terem onde falar".
6. **CapituloDepoimento** com contexto de tempo ("C., 8 meses de acompanhamento"), iniciais mantidas por sigilo, CRP dos profissionais e nota Google como lastro verificável. O depoimento de integração é reescrito conforme o roster real. CtaBand ao final.
7. **"Mente e corpo juntos"**: a integração vira produto: Protocolo Oxford de Emagrecimento explicado em duas linhas de gente ("para quem come de ansiedade e quer entender o porquê antes de mudar o prato: psicologia + nutrição comportamental com a Gabrieli Klagenberg, dividindo o mesmo caso") e programa "mente e corpo" (acolhimento, plano, revisões conjuntas). Frase de origem assinada: "Criamos a ecooa.mind porque vimos pacientes travarem no emocional o que o corpo já estava pronto para viver. Gustavo e Jessica."
8. **FaqVisivel expandido** (schema já montado, só adicionar itens): valor da sessão ou faixa, duração (50 minutos), frequência, recibo para reembolso do plano, sigilo absoluto, "posso trocar de profissional?" ("pode, sem constrangimento"), online ou presencial, psicólogo vs psiquiatra.
9. **PrimeiroPassoCTA final**: **"O primeiro passo pode ser uma mensagem de uma linha. A gente cuida do resto."** Botão único primário "agendar sessão de acolhimento", com os selos repetidos: "em até 5 dias úteis · sigilo absoluto · você decide se continua".

**CTAs:** principal "agendar sessão de acolhimento" → WhatsApp pré-preenchido pela frase do Espelho ou pelo profissional escolhido, sempre com os três selos de segurança.

**O que sai e por quê:** B2BBanner migra para /para-profissionais (paciente vulnerável não pode encontrar recrutamento na zona de decisão). Headline institucional "Saúde mental integrada ao cuidado completo" sai (exigia entender o ecossistema antes de sentir que era sobre ele). A formulação vaga "dentro do prazo esperado" é substituída em toda a página por "5 dias úteis". Lista de 11 áreas em linguagem de prontuário vira portas clicáveis ou é enxugada. "agendar avaliação" sai desta página.

---

### 3.5 Nutrição (src/pages/ecooa-working.astro)

**Objetivo:** consertar a primeira impressão (hoje o hero fala com nutricionistas) e converter por objetivo, com a bioimpedância como produto isca. **Persona:** mulher 30-70 cansada de dietas, com culpa alimentar, ou usuária de caneta emagrecedora buscando suporte sério; atletas amadores.

**Hero (copy pronta):**
- Headline: **"Fazer as pazes com a comida. E com o espelho."**
- Subheadline: "Nutrição clínica, esportiva e comportamental com 12 nutricionistas que dividem o seu caso com o seu médico, dentro da mesma clínica. Sem dieta da moda, sem julgamento, sem fórmula mágica."
- CTA "agendar minha avaliação" com selos "primeira consulta sem compromisso · respondemos em minutos".
- Meta description reescrita 100% B2C: "Nutricionista em Moinhos de Vento, Porto Alegre: emagrecimento, nutrição esportiva, comportamental e vegana, integrada ao seu médico. Primeira consulta sem compromisso."

**Wireframe:**

1. **Hero B2C + ProvaViva** ("5.0 no Google" · "12 nutricionistas, um só prontuário" · "desde 2021").
2. **EspelhoSection**: seis frases clicáveis: "cansada de dietas que não funcionam" · "sinto culpa quando como fora do plano" · "uso caneta emagrecedora (Ozempic, Mounjaro) e quero fazer isso direito" · "treino, me dedico e não vejo resultado" · "sou vegana e quero segurança de verdade" · "quero energia, pele e cabelo saudáveis de dentro pra fora".
3. **Empatia mantida** ("Você já tentou dieta da moda... sente culpa quando come algo fora do plano") + posicionamento com tradução: "Na ecooa, nutrição é ciência e escuta. Em bom português: a gente mede antes de mudar, e escuta antes de medir." CtaBand: "quero começar diferente".
4. **Bioimpedância como oferta de entrada** (produto isca, resgate da direção 2): card destacado "Avaliação de composição corporal por R$ X. Em bom português: uma balança inteligente que separa músculo, gordura e água, para o plano partir de dados, não de achismo." Agendamento direto. É o único preço que depende da decisão de um sócio só: destrava a ancoragem sem negociar com 30 profissionais.
5. **"Quem caminha com você"** (GuiaCards via getProfessionalsByUnit('working')): destaque para Jessica Stein ("fundadora, referência em nutrição vegana e análise bioquímica; você é atendida por quem ensina outros nutricionistas"), Gabrieli Klagenberg (comportamental, "a relação com a comida começa na mente"), Adriano Lenz (nutrigenômica, "desvenda o que a genética diz para criar um plano só seu") e o time esportivo. CTA individual "agendar com a Jessica". Bloco concierge: "não sabe qual nutri é ideal para você? responda 3 perguntas e o nosso match indica".
6. **Programas com nome e mapa** (ProtocoloCards + JornadaTimeline): "Paz com a Comida" (comportamental: mês 1, entender seus gatilhos; mês 3, comer sem culpa virando hábito) · "Emagrecimento 360" (nutri + médico + bioimpedância trimestral, ancorado no Método Gehrke 360°) · "Suporte às canetas emagrecedoras" (semaglutida e tirzepatida com nutrição para proteger massa magra, caso dividido com o médico) · "Performance" (composição corporal para quem treina de verdade) · "Nutrição Vegana Segura" (com a fundadora) · "Beleza de dentro pra fora" (nutrição estética para pele, cabelo e unhas). Estrutura fixa: para quem é / o que inclui / primeiro passo / CTA.
7. **"Sua nutri e seu médico conversam entre si"**: seção própria para o maior diferencial da casa: "Aqui a nutricionista e o médico dividem exames, protocolo e evolução no mesmo prontuário. Você não carrega exames de um lado para o outro: sua história anda junta." Depoimento de L.D. como prova.
8. **CapituloDepoimento** com contexto ("G., objetivo emagrecimento, 8 meses de acompanhamento"), selo de autorização mantido. CtaBand ao final.
9. **"Como funciona"** (antes do FAQ, ordem corrigida): primeira conversa no WhatsApp; avaliação com bioimpedância; plano que cabe na sua vida real; reavaliações com dados comparados. "Primeira consulta sem compromisso. Você decide se quer continuar." promovido a selo junto ao botão.
10. **FaqVisivel transacional**: "quanto custa a consulta?" (faixa via campo pricing) · "atendem online?" · "aceitam convênio ou reembolso?" (recibo) · "quanto dura a consulta?" · "preciso de pedido médico?" (não) · "atendem veganos?".
11. **PrimeiroPassoCTA final**: **"A sua próxima relação com a comida começa numa conversa."** Urgência ética específica: "cada nutricionista acompanha um número limitado de pacientes ativos, para garantir retorno de verdade".

**CTAs:** principal "agendar minha avaliação" → WhatsApp pré-preenchido pelo objetivo do Espelho ou pela nutricionista escolhida, sempre com o par "primeira consulta sem compromisso · respondemos em minutos".

**O que sai e por quê:** o hero "O espaço que a sua carreira merece", a meta description B2B e toda a seção "Para profissionais" (coworking, Formspree, processo seletivo, grade de infos) migram para **/para-nutricionistas**: hoje o paciente conclui em 3 segundos que caiu na página errada. Resta um link de uma linha no footer: "é nutricionista? conheça a ecooa.working". "Vagas limitadas por nutricionista" (urgência ambígua) é substituída pela versão específica acima.

---

## 4. Ajustes pontuais

### 4.1 /quem-somos
- **Remover Maria Luísa do time fundador e da liderança**: retirar o ProfessionalCard (linha 80) e a menção na narrativa de origem (linha 66). Ela permanece apenas na listagem de profissionais (grid da equipe de nutrição, via professionals.ts).
- Enxugar a seção Liderança para os 2 fundadores, com frase pessoal voltada ao paciente no lugar de cargos ("diretora de ensino" não conversa com paciente). Rafaela sai do grid de liderança.
- Reordenar com lógica de conversão: Hero → "No que acreditamos" (as 4 promessas ao paciente sobem da 8a para a 2a posição) → Carta dos Fundadores **com CtaBand logo abaixo** ("começar pela primeira conversa", aproveitando o pico emocional) → Origem resumida, promovendo a frase enterrada "aqui você não precisa repetir sua história a cada consulta" a headline de seção → Liderança enxuta → Espaço → CTA final.
- Mover a seção "Bandeiras" (employer branding) para /para-profissionais.
- Meta description reescrita com dor + benefício: "Conheça a ecooa: a clínica de Moinhos de Vento onde médico, nutricionista e psicólogo cuidam de você juntos. Emagrecimento, pele, cabelo e saúde mental em um só lugar."

### 4.2 Blog
- Promessa editorial "ciência traduzida: a gente lê os estudos para você não precisar" como subtítulo da listagem.
- Todo artigo termina com PrimeiroPassoCTA contextual por categoria (data-intent da categoria: medicina → Peso Seguro etc.).
- Manter categorias sem acento no frontmatter conforme schema (medicina, estetica, nutricao, saude-mental, longevidade, ecooa).

### 4.3 Mentorias e conteúdo B2B
- Mentorias, carreiras e qualquer conteúdo para profissionais concentrados em **/para-profissionais** (e /para-nutricionistas), que nascem **junto** com a onda 1, nunca depois: absorvem o formulário Formspree de médicos, o B2BBanner, os bullets de locatário, as Bandeiras e o card "Carreiras que ecooam". Link discreto único no footer de todas as páginas B2C: "é profissional de saúde? conheça a ecooa para profissionais".

### 4.4 Contato / agendamento
- /agendamento alinhado ao novo vocabulário: manter "agendar avaliação" como rótulo geral, mas o fluxo vindo do mind usa "sessão de acolhimento".
- Corrigir o link do Google Reviews para a URL real do perfil (hoje aponta para busca genérica) e exibir a contagem de avaliações em todos os pontos que citam o 5.0.
- Confirmar e padronizar em todo o site: "segunda a sexta, das 9h às 20h" e o WhatsApp (51) 99146-0909.

---

## 5. Novos componentes transversais

Todos em src/components/, reutilizados nas 5 páginas:

1. **EspelhoSection**: dores em primeira pessoa, cada frase clicável abrindo WhatsApp pré-preenchido via data-intent; substitui os blocos de empatia estáticos e evolui os QuizSection atuais (a mecânica já existe em QuizSection.astro). Sempre com porta neutra.
2. **MatchBar**: campo de uma linha "conte em uma frase o que você está sentindo" (hero da home, bloco concierge nas landings). Fallback padrão: deep-link de WhatsApp com a frase digitada; o motor NLP de match.astro entra quando estabilizado. A promessa do hero nunca quebra.
3. **GuiaCard**: card "quem cuida de você" alimentado por getProfessionalsByUnit(), com foto (public/team), registro profissional (CRM/CRN/CRP), personalTouch já cadastrado e CTA individual "começar com [nome]". Escala sozinho quando o time cresce.
4. **ProtocoloCard**: protocolo produtizado com estrutura fixa "para quem é / o que inclui / primeiro passo" + CTA WhatsApp com data-intent próprio. Aceita **TranslateNote** embutida.
5. **TranslateNote**: padrão visual "em bom português" que cola uma tradução humana a cada termo técnico. Puro copy + CSS, assinatura verbal da casa.
6. **JornadaTimeline**: linha do tempo ética (semana 1 > mês 1 > mês 3, ou dia 0 > 30 > 90 > 180 na estética) com a fórmula fixa "o que pacientes costumam relatar" e disclaimer de individualidade, aprovada juridicamente uma vez e reusada.
7. **CapituloDepoimento**: depoimento como capítulo, com tag de contexto autorizado ("L., Protocolo Peso Seguro, 6 meses") e selo "publicado com autorização".
8. **ProvaViva**: faixa compacta de prova social pós-hero (5.0 + contagem real com link, desde 2021, 30+ profissionais, consultas com tempo de verdade), com props por unidade.
9. **RiskReversalBadge**: selos de redução de risco padronizados e colados a todo CTA ("respondemos em minutos", "sem compromisso", "sigilo absoluto", "retorno incluído"), promovidos de microcopy a componente visual.
10. **CtaBand**: CTA intermediário compacto ao fim de toda seção de empatia e de depoimentos, matando os desertos de conversão de páginas com 9+ seções.
11. **PrimeiroPassoCTA**: bloco de conversão final com RiskReversalBadges empilhados junto ao botão.
12. **FaqVisivel**: accordion visível com **fonte única de dados** alimentando a UI e o JSON-LD FAQPage (elimina a duplicação atual nas 5 páginas). Sempre inclui preço/faixa e convênio/reembolso; cada resposta termina em link de WhatsApp.
13. **StickyWhatsApp**: evolução do WhatsAppFab com mensagem pré-preenchida pela página e seção de origem (expandir o data-intent existente), visível no mobile em toda a rolagem.
14. **CompareModel**: tabela de 2 colunas "o cuidado apressado vs o cuidado ecooa", genérica, usada só na home após aprovação jurídica.
15. **Página /para-profissionais** (e /para-nutricionistas): destino único de todo o B2B removido. É o componente invisível que viabiliza a direção inteira.

---

## 6. Compliance (CFM, CFN, CFP, LGPD)

**Proibido em qualquer página:**
- Promessa de resultado: nunca "você vai emagrecer", "elimine a ansiedade", "recupere seu cabelo". Sempre processo e trajetória: "o que investigamos", "o que pacientes costumam relatar".
- Antes/depois com fotos de pacientes. Substituto aprovado: JornadaTimeline conceitual com disclaimer fixo "cada organismo responde no seu tempo".
- Desqualificação de colegas ou clínicas. O CompareModel compara modelos de atendimento genéricos, nunca nomes, e passa por revisão jurídica antes de publicar.
- Termos de garantia de cura, superlativo sem lastro ("o melhor", "referência" sem credencial que sustente) e sensacionalismo de escassez falsa.

**Regras operacionais:**
- Canetas emagrecedoras sempre com a formulação responsável: "quando há indicação médica, com acompanhamento e exames". Nunca como produto de prateleira.
- Depoimentos: novas autorizações por escrito com contexto (serviço + tempo) antes de publicar CapituloDepoimento; sem re-consentimento, manter iniciais e compensar com ProvaViva (verificável, não depende de autorização). Sigilo absoluto no mind: sempre iniciais.
- Promessas operacionais ("5 dias úteis", "respondemos em minutos", "retorno incluído", "agenda limitada a X/mês") exigem confirmação da recepção antes do go-live e dono + rotina mensal de revisão. Sem dono, o elemento não é lançado.
- Psiquiatria no mind: enquanto não houver psiquiatra em professionals.ts, remover a palavra do title e do FAQ e usar a copy de encaminhamento integrado.
- Toda TranslateNote validada pelo profissional da área para não prometer mecanismo que o procedimento não entrega.
- Teste de tom da EspelhoSection com 3 a 5 pacientes reais antes do lançamento (risco de soar dramática para parte do público premium).

---

## 7. Roadmap de implementação em ondas

**Onda 0 · Decisões e pipelines (pré-requisito, sem código):**
- Sócios definem: preço da bioimpedância (decisão de um sócio só, destrava tudo), faixa da consulta de avaliação, veracidade operacional de "5 dias úteis", "respondemos em minutos" e "retorno incluído".
- Preencher pricing e registration em professionals.ts.
- Iniciar pipeline de re-consentimento de depoimentos.
- Obter URL real e contagem de avaliações do perfil Google.
- Alinhar fluxo da recepção para CTAs individuais "agendar com [nome]".
- Teste de tom do Espelho com pacientes reais.

**Onda 1 · Fundação técnica + estancar sangrias (maior impacto por hora de trabalho):**
- Criar /para-profissionais e /para-nutricionistas e **migrar todo o B2B das 5 páginas** (a remoção só acontece com o destino no ar, para não perder leads de locação).
- Componentes base: RiskReversalBadge, CtaBand, PrimeiroPassoCTA, FaqVisivel com fonte única, StickyWhatsApp, ProvaViva.
- Corrigir hero e meta description da nutrição (o erro mais grave do site: hero B2B em página B2C).
- Remover Maria Luísa de /quem-somos (card e narrativa).
- Tornar visíveis os FAQs já existentes em JSON-LD.

**Onda 2 · Conversão por dor (o coração da direção):**
- EspelhoSection nas 5 páginas (evolução do QuizSection existente) com portas ampliadas (pele e corpo na estética, canetas na nutrição, porta neutra em todas).
- ProtocoloCard com CTA em todos os protocolos (med e nutrição) + TranslateNote.
- MatchBar no hero da home com fallback de deep-link.
- Novos heros e reordenação de seções das 5 páginas conforme wireframes.

**Onda 3 · Confiança e prova:**
- GuiaCards ("quem cuida de você") nas 4 landings via getProfessionalsByUnit(), com CTA individual só após alinhamento da recepção.
- CapituloDepoimento conforme re-consentimentos chegarem (fallback: iniciais + ProvaViva).
- JornadaTimeline (med, esthetic, working, de → para no mind) após aprovação jurídica do template.
- CompareModel na home após revisão jurídica.
- Bioimpedância como produto isca com preço publicado.

**Onda 4 · Refinamento editorial:**
- Marquee como fio de desejos, respiros editoriais em Playfair itálico, reordenação completa de /quem-somos.
- Grid de Instagram só quando houver thumbnails reais e curadoria B2C (até lá, seção fora).
- Mini-quiz "descobrir meu nível" do Método Gehrke 360°.
- Evolução da MatchBar para o motor NLP quando estável em produção.

Racional das ondas: a onda 1 remove o que destrói conversão hoje (B2B no funil, hero errado da nutrição) com custo baixo; a onda 2 instala o mecanismo central de conversão; a 3 depende dos pipelines humanos da onda 0 e degrada graciosamente se atrasarem; a 4 é polimento que não bloqueia nada.

---

## 8. Métricas de sucesso

Base: GTM-TSR4GDMK, interaction-only, com o atributo data-intent já existente no código. Expandir a taxonomia de data-intent por página + seção + dor (ex.: med-espelho-balanca, esthetic-porta-cabelo, mind-guia-manuela, home-matchbar).

**Métrica norte:** cliques de WhatsApp qualificados (com data-intent de dor) por sessão.

**Acompanhar por página, comparando 30/60/90 dias pré e pós-lançamento:**
- Cliques de WhatsApp total e por data-intent (qual dor converte mais em cada página).
- Uso da MatchBar (envios de frase) vs cliques diretos de WhatsApp no hero da home.
- Cliques em CTA individual "começar com [nome]" nos GuiaCards (valida a aposta nos rostos).
- Aberturas do FaqVisivel e cliques de WhatsApp originados de respostas de FAQ (mede objeções destravadas, especialmente preço).
- Cliques no card de bioimpedância (produto isca).
- Profundidade de rolagem nas 5 páginas (os CtaBands devem reduzir o abandono nos ex-desertos de conversão).
- Navegação home → landings via portas de transformação (data-intent por porta).
- Formulário Formspree em /para-nutricionistas e cliques B2B em /para-profissionais (garantir que o funil de locação não caiu com a migração; se cair mais de 30% em 60 dias, reforçar divulgação do canal próprio, nunca devolver o B2B ao fluxo B2C).
- SEO: posições das keywords transacionais (nutricionista Porto Alegre, transplante capilar Porto Alegre, psicólogo Porto Alegre) monitoradas por 60 dias após cada onda, já que as headlines ficaram emocionais e as keywords vivem em titles, metas e corpo.

**Critério de sucesso do projeto:** crescimento sustentado de cliques de WhatsApp qualificados por dor, sem queda de posições SEO transacionais e sem colapso do funil B2B em /para-profissionais.
