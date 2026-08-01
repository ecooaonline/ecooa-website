// Conteúdo editorial das 8 páginas de especialidade.
//
// Aprofundado em 2026-08-01: cada área saiu de 200 a 315 palavras de conteúdo
// próprio para um texto que de fato ajuda quem chega, com abertura, queixas na
// linguagem do paciente, serviços explicados, o passo a passo do primeiro
// atendimento e uma FAQ que encara as perguntas incômodas.
//
// Escrito e depois submetido a um guardião regulatório automático (CFM 1.974 e
// 2.336, COFEN, CFN, CFF, CRP, CFO), que também confere desvio de escopo
// profissional. A revisão técnica do dono segue pendente, conforme
// docs/mythos/PENDENCIAS-DO-DONO.md.
//
// Campos: intro (parágrafos), queixas (lista), servicos ([título, texto]),
// comoFunciona ([etapa, texto]) e faq ([pergunta, resposta]).

export const AREAS = [
  {
    "slug": "medicina",
    "nome": "Medicina",
    "marca": "ecooa.med",
    "titulo": "Medicina integrada em Porto Alegre.",
    "sub": "Investigação clínica com tempo de consulta de verdade: metabolismo, hormônios, emagrecimento, longevidade e doenças crônicas, com exames lidos e explicados.",
    "meta": "Médicos em Moinhos de Vento, Porto Alegre: medicina metabólica, saúde hormonal, emagrecimento, longevidade, dermatologia e check-up com interpretação de exames. Agende avaliação.",
    "intro": [
      "Nem sempre a procura por um médico começa no primeiro dia do sintoma. Há quem chegue depois de meses convivendo com um cansaço que o café não resolve, com um peso que não desce mesmo comendo direito e treinando, com um sono que virou do avesso, ou com um exame alterado que segue sem explicação. Às vezes a pessoa já ouviu que está tudo normal. O incômodo, no entanto, continua ali, e ele é um dado clínico, não um exagero.",
      "A medicina praticada aqui é clínica e investigativa. A consulta começa pela sua história: quando o quadro mudou, o que você já tentou, como andam o sono, a alimentação, o álcool, o treino, o intestino, o ciclo menstrual, o estresse e os medicamentos que você usa hoje. Depois vem o exame físico e, quando faz sentido, um pedido de exames com propósito definido, orientado pelas hipóteses levantadas ali. Cada marcador tem uma pergunta por trás. No retorno, o resultado é lido com você: o que está dentro do esperado, o que merece atenção e o que muda de fato a conduta.",
      "Na área médica da casa atendem Gustavo Gehrke, médico, CRM-RS 35.822, com foco em metabolismo, emagrecimento e hormônios, e as médicas Larissa Wiebbelling, CRM-RS 55.504, de transplante capilar e tricologia médica, e Yale Jerônimo, CRM-RS 49.185, de tricologia e alopecias. O atendimento é presencial, em Moinhos de Vento, em Porto Alegre. Indicação de tratamento e prescrição dependem de avaliação individual, e há casos que pedem outra especialidade antes de qualquer decisão. Quando for esse o caminho, você vai ouvir isso na consulta, mesmo que signifique sair com um encaminhamento em vez de uma receita."
    ],
    "queixas": [
      "Cansaço que não passa, mesmo dormindo as horas que deveria",
      "Dificuldade para emagrecer mesmo com dieta e treino",
      "Exames alterados que seguem sem explicação",
      "Suspeita de menopausa, andropausa ou problema de tireoide",
      "Insônia, sono picado ou acordar várias vezes na madrugada",
      "Dúvida sobre medicamentos para emagrecer e se existe indicação no seu caso",
      "Pressão, colesterol ou glicose subindo ano após ano",
      "Barriga inchada, azia, refluxo ou dor de barriga que voltam sempre",
      "Queda de cabelo, falhas no couro cabeludo ou entradas que aumentaram",
      "Cólica forte ou ciclo irregular que se repete todo mês",
      "Ferritina ou vitamina D baixas em exames recentes, ou infecções que se repetem",
      "Vontade de fazer um check-up com interpretação dos resultados na consulta"
    ],
    "servicos": [
      [
        "Consulta clínica com avaliação metabólica",
        "Avaliação ampla de metabolismo, composição corporal, hábitos e histórico. Faz sentido para quem convive com cansaço, ganho de peso, glicose ou colesterol alterados e quer entender a causa antes de iniciar qualquer tratamento."
      ],
      [
        "Saúde hormonal feminina e masculina",
        "Investigação de queixas ligadas a hormônios, incluindo tireoide, ciclo menstrual, menopausa, andropausa e libido. A conduta, com ou sem reposição, depende de exames, sintomas e histórico de cada pessoa. Terapia hormonal não é indicada com finalidade estética ou de desempenho."
      ],
      [
        "Emagrecimento com acompanhamento médico",
        "Para quem já tentou sozinho e não sustentou. Envolve entender por que o peso não cede, tratar o que atrapalha e discutir, quando houver indicação clínica, o uso de medicamentos para obesidade, com riscos e contraindicações apresentados antes de qualquer decisão."
      ],
      [
        "Check-up e interpretação de exames",
        "Solicitação guiada pela sua história e leitura explicada no retorno, marcador por marcador. Serve para quem tem resultados antigos que nunca foram interpretados ou quer um panorama do momento atual, com o que merece atenção e o que não merece."
      ],
      [
        "Acompanhamento de doenças crônicas",
        "Pressão alta, colesterol elevado, pré-diabetes, diabetes e gordura no fígado pedem constância. O acompanhamento envolve revisões periódicas, ajuste do que já está em uso e atenção ao estilo de vida."
      ],
      [
        "Longevidade e prevenção",
        "Para quem está bem hoje e quer cuidar do que vem pela frente. Avaliação de risco cardiovascular, metabólico e cognitivo, com atenção a sono, força, alimentação e aos marcadores acompanhados ao longo dos anos."
      ],
      [
        "Tricologia médica e queda de cabelo",
        "Avaliação médica do couro cabeludo e do fio, com exame local, para diferenciar queda temporária de alopecias que pedem tratamento continuado. Atendimento com Yale Jerônimo e Larissa Wiebbelling."
      ],
      [
        "Transplante capilar",
        "Avaliação de indicação cirúrgica para calvície com Larissa Wiebbelling, incluindo o que a técnica alcança, o que ela não corrige, os riscos do procedimento e a necessidade de tratar antes a causa da queda. Nem todo caso tem indicação."
      ],
      [
        "Queixas digestivas e inflamatórias recorrentes",
        "Azia, refluxo, inchaço, intestino irregular e infecções repetidas podem ter causa identificável na investigação. A avaliação define o que é conduta aqui e o que pede encaminhamento para gastroenterologia, ginecologia ou outra especialidade."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você descreve a queixa em poucas linhas e a equipe indica qual profissional faz sentido para o seu caso, com os horários disponíveis e as condições de atendimento daquele médico. Se a ecooa não for o lugar certo, isso é dito ali."
      ],
      [
        "Primeira consulta",
        "Reserve tempo para a conversa. Leve exames anteriores, mesmo antigos, a lista de medicamentos e suplementos que usa e o histórico de tratamentos passados. Ao final, a conduta inicial é explicada, com ou sem pedido de exames."
      ],
      [
        "Retorno com os exames",
        "É no retorno que a investigação costuma se fechar. Os resultados são lidos com você, marcador por marcador, e só então a conduta é definida: o que tratar agora, o que apenas observar e o que não pede intervenção nenhuma."
      ],
      [
        "Acompanhamento",
        "O intervalo entre as consultas depende do quadro. Casos metabólicos, hormonais e capilares costumam pedir revisões ao longo de meses, porque o ajuste é gradual e a resposta varia de pessoa para pessoa. Mudanças de conduta acontecem em consulta."
      ]
    ],
    "faq": [
      [
        "Quanto custa uma consulta médica na ecooa?",
        "Os valores são definidos por cada médico, que atende de forma autônoma na casa, e são informados no agendamento pelo WhatsApp, antes de você reservar horário. O site não publica tabela porque a consulta e o retorno variam conforme o profissional e o tipo de avaliação."
      ],
      [
        "Vocês atendem por convênio?",
        "Isso varia de profissional para profissional, porque cada um define as próprias condições de atendimento. Por isso a confirmação é feita no agendamento: a equipe verifica com o médico que você escolher e responde antes de marcar. Qualquer documento necessário para o seu plano também é combinado nesse contato."
      ],
      [
        "Preciso de encaminhamento para marcar?",
        "Não. Você agenda direto pelo WhatsApp, sem encaminhamento de outro médico. Se já tiver um pedido, um laudo ou exames recentes, leve. Isso encurta o caminho da investigação e evita repetir o que já foi feito há pouco tempo."
      ],
      [
        "Quanto tempo demora para eu ver alguma mudança?",
        "Depende do que estiver por trás da queixa, e não existe prazo que sirva para todo mundo. Alguns ajustes podem se refletir no dia a dia em poucas semanas. Outros, principalmente os metabólicos, hormonais e capilares, só se avaliam ao longo de meses. Prazo prometido antes da avaliação é especulação."
      ],
      [
        "A consulta dói ou tem procedimento?",
        "A consulta clínica é conversa e exame físico, sem procedimento invasivo. Na avaliação capilar pode ser usado o dermatoscópio sobre o couro cabeludo, que é um exame não invasivo. Se houver pedido de exames de sangue, a coleta acontece em laboratório, com orientação dada na consulta. Procedimentos, quando indicados, são explicados e combinados à parte."
      ],
      [
        "Começar um tratamento tem risco?",
        "Todo tratamento tem risco, inclusive o de não tratar. É exatamente por isso que nada é indicado sem avaliação individual. Riscos, efeitos possíveis, contraindicações e alternativas são apresentados na consulta, e a decisão é tomada ali, com você."
      ],
      [
        "Vocês atendem online?",
        "A telemedicina é permitida pelo Conselho Federal de Medicina dentro de regras próprias, e a possibilidade depende do caso e do profissional. Primeira avaliação, exame físico e casos capilares costumam pedir consulta presencial. A equipe informa no agendamento se o seu caso pode ser conduzido a distância."
      ],
      [
        "Posso ir só para tirar dúvida sobre as canetas emagrecedoras?",
        "Pode. A conversa começa por avaliar se existe indicação clínica, quais riscos e contraindicações se aplicam a você e o que precisa acontecer em paralelo, como alimentação, sono e treino. Não há prescrição sem consulta e sem avaliação, e nem todo caso tem indicação."
      ],
      [
        "E se o meu caso não for para vocês?",
        "Acontece, e é dito na hora. Algumas queixas pedem uma especialidade que a casa não cobre, um exame de imagem ou um serviço de urgência. Nesses casos você sai da consulta com orientação e encaminhamento, o que também é cuidado médico."
      ]
    ]
  },
  {
    "slug": "estetica-facial",
    "nome": "Estética facial",
    "marca": "ecooa.esthetic",
    "titulo": "Estética facial com avaliação antes do procedimento.",
    "sub": "Harmonização, toxina botulínica, preenchimento, bioestimuladores e cuidado com a pele, com indicação honesta: às vezes o melhor procedimento é o que não se faz.",
    "meta": "Estética facial em Moinhos de Vento, Porto Alegre: harmonização facial, toxina botulínica, preenchimento, bioestimuladores, skinbooster e protocolos de pele, com avaliação criteriosa.",
    "intro": [
      "Quem marca uma avaliação de estética facial costuma chegar com a mesma dificuldade: alguma coisa mudou no rosto e é difícil nomear o quê. A foto de três anos atrás parece outra pessoa, mas nenhuma ruga isolada explica isso. Às vezes o incômodo é concreto, a mancha que volta todo verão, a acne que não era para existir aos trinta e cinco, o vinco entre as sobrancelhas marcado mesmo com o rosto parado. E junto vem outro receio, o de terminar com um rosto que não é o seu.",
      "A avaliação vem antes do procedimento, e não é formalidade. A queixa de rosto costuma ter duas camadas: a qualidade da pele, que envolve manchas, textura, poros, oleosidade e acne, e a estrutura, que envolve volume, sustentação e proporção. São camadas diferentes, com tratamentos, riscos e tempos diferentes. Tratar estrutura quando o problema é pele frustra, e o inverso também. Melasma, rosácea, dermatites e acne inflamatória pedem diagnóstico médico antes de qualquer decisão estética.",
      "Na estética facial da ecooa, em Moinhos de Vento, Porto Alegre, atendem as médicas dermatologistas Vitória Müller T. Machado, CRM-RS 43.712, RQE 42.218, e Renata Bohn Engel, CRM-RS 48.838, RQE 46.857, a farmacêutica Tais de la Rosa, as biomédicas Letícia Melo, Karine Ellwanger, Jennifer Adam, Eduarda Schoenmeier e Susan Flach, e a cirurgiã-dentista Jamylle Farias. Cada uma atua dentro do que o conselho da própria profissão autoriza. Indicação depende de avaliação individual, e existe caso em que a resposta honesta é adiar, tratar outra coisa antes ou não fazer."
    ],
    "queixas": [
      "Manchas que escurecem no verão e nunca somem de vez",
      "Acne que continuou na vida adulta, com marcas depois",
      "Vinco entre as sobrancelhas marcado mesmo com o rosto parado",
      "Olheira funda ou escura, e todo mundo achando que você dormiu mal",
      "Rosto mais caído ou mais vazio, sem saber apontar onde",
      "Pele oleosa, poros dilatados e maquiagem que não fica",
      "Vermelhidão que vai e volta, com ardência ou descamação",
      "Vontade de fazer toxina pela primeira vez e medo de exagerar",
      "Lábio fino, assimétrico ou canto da boca virado para baixo",
      "Ranger os dentes à noite e acordar com a mandíbula travada"
    ],
    "servicos": [
      [
        "Avaliação facial e de pele",
        "Consulta antes de qualquer procedimento. Análise da pele, das proporções e do histórico, para separar o que é queixa de pele, o que é de estrutura e o que pede médico."
      ],
      [
        "Dermatologia clínica",
        "Atendimento médico para acne, melasma, rosácea, dermatites e lesões que precisam de diagnóstico, com Vitória Müller T. Machado e Renata Bohn Engel. Conduta e prescrição dependem do exame da pele em consulta."
      ],
      [
        "Toxina botulínica",
        "Aplicação nas áreas de expressão, como testa, glabela e região dos olhos, para quem se incomoda com linhas de movimento. O planejamento considera a força do seu músculo e o que você quer preservar."
      ],
      [
        "Preenchimento com ácido hialurônico",
        "Reposição de volume e ajuste de contorno em olheiras, lábios, mento e mandíbula. Indicado depois de avaliar se a queixa é mesmo de volume, porque nem toda olheira melhora com preenchedor."
      ],
      [
        "Bioestimuladores de colágeno",
        "Estímulo do próprio colágeno, para flacidez leve a moderada e qualidade de pele. A resposta é gradual, varia de pessoa para pessoa, se avalia ao longo de meses e costuma pedir mais de uma sessão."
      ],
      [
        "Gerenciamento e rotina de pele",
        "Construção do cuidado diário com Susan Flach e Tais de la Rosa, dentro do que cada conselho autoriza, ajustado ao seu tipo de pele e à rotina que você consegue manter. Na prática da casa, é ela que sustenta o procedimento de consultório."
      ],
      [
        "Procedimentos de consultório",
        "Peelings, limpeza de pele, microagulhamento e hidratação injetável, indicados conforme a queixa: textura, poros, marcas de acne, manchas ou hidratação. Costumam exigir sessões em série e disciplina com o sol."
      ],
      [
        "Harmonização orofacial",
        "Planejamento do rosto em etapas, não de uma região isolada. Com Tais de la Rosa, Letícia Melo, Karine Ellwanger, Jennifer Adam, Jamylle Farias e Eduarda Schoenmeier, cada uma executando apenas o que o conselho da própria profissão autoriza."
      ],
      [
        "Rinomodelação",
        "Ajuste de contorno do nariz com preenchedor, sem cirurgia, para o dorso e a ponta, feito apenas por profissional habilitado e dentro do escopo do seu conselho. Região de risco vascular importante, com limite claro do que a técnica alcança e do que ela não corrige."
      ],
      [
        "Toxina para bruxismo, dor de ATM e hiperidrose",
        "Uso da toxina com finalidade terapêutica, e não estética, para apertamento dentário, dor na musculatura da mastigação e suor excessivo. São indicações conduzidas por medicina e odontologia, cada uma no seu escopo, e dependem de diagnóstico e avaliação antes."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você descreve o que incomoda em poucas linhas e a equipe indica qual profissional faz sentido, com os horários disponíveis e as condições de atendimento. Se a queixa tem cara de causa clínica, o caminho começa pela dermatologia."
      ],
      [
        "Avaliação presencial",
        "Leve a lista do que usa no rosto, medicamentos em uso e o histórico do que já aplicou, com data e região. A proposta é você sair sabendo o que tem indicação, o que não tem e em que ordem."
      ],
      [
        "Procedimento",
        "Quando há indicação, pode ser no mesmo dia ou agendado, conforme a técnica. Antes de sair você recebe as orientações de pós: o que evitar, o que é esperado nas primeiras horas e em quanto tempo o efeito costuma assentar."
      ],
      [
        "Retorno e acompanhamento",
        "O retorno serve para ver como o resultado assentou e ajustar, se for o caso. Toxina e preenchedores têm duração própria, e tratamentos de pele se avaliam ao longo de meses. Nada é reaplicado sem nova avaliação."
      ]
    ],
    "faq": [
      [
        "Quanto custa um procedimento facial?",
        "O valor depende do profissional, da técnica e da quantidade de produto, e é informado no agendamento, pelo WhatsApp, antes de você marcar. Cada profissional da casa é autônomo e define os próprios honorários, então não existe tabela única. Na avaliação isso é confirmado antes de qualquer aplicação."
      ],
      [
        "Vou ficar com cara artificial?",
        "O rosto artificial costuma vir de excesso e de reaplicação sem reavaliação, não da técnica em si. O planejamento parte das suas proporções e do movimento que você quer manter. Quando o pedido não tem indicação técnica, você ouve isso e o motivo."
      ],
      [
        "Dói? Preciso ficar em casa depois?",
        "A maior parte dos injetáveis é feita com anestésico tópico, e a sensação varia de pessoa para pessoa. Inchaço e roxo podem acontecer, principalmente em lábios e olheiras. Costuma ser possível retomar a rotina no mesmo dia, mas não é sensato marcar na véspera de um evento."
      ],
      [
        "Tem risco?",
        "Tem. Todo procedimento injetável tem risco, maior em áreas muito vascularizadas como nariz, olheira e lábios. A avaliação existe para isso: histórico, medicamentos, doenças autoimunes, gestação e o que já foi aplicado mudam a conduta. Riscos e sinais de alerta são explicados antes."
      ],
      [
        "Quanto tempo dura o resultado?",
        "Depende da técnica, da região e de como você responde. Toxina e preenchedores têm duração limitada e voltam a pedir avaliação. Bioestimulador se julga em meses. Tratamento de pele depende também da rotina em casa, e é ela que sustenta o que se faz em consultório."
      ],
      [
        "Preciso de encaminhamento para marcar?",
        "Não. Você agenda direto pelo WhatsApp, sem pedido de outro profissional. Se tiver laudo, biópsia ou registro do que já foi aplicado, leve, inclusive a data e o nome do produto. Isso muda o planejamento e evita repetir o que foi feito recentemente."
      ],
      [
        "Vocês atendem por convênio?",
        "Cada profissional da casa é autônomo e define como trabalha. Por isso essa pergunta é respondida caso a caso no agendamento, com a informação do profissional que você escolher, antes de marcar. A recepção verifica e retorna pelo WhatsApp."
      ],
      [
        "Vocês atendem online?",
        "Nesta área o atendimento é presencial. Avaliação e procedimento dependem do exame do rosto e da aplicação, feitos na clínica, em Porto Alegre. Se você tem dúvida sobre alguma etapa do acompanhamento, a recepção responde pelo WhatsApp antes do agendamento."
      ],
      [
        "Fiz preenchimento antes e não gostei. Dá para resolver?",
        "Dá para avaliar, e é uma queixa que aparece. O caminho depende do produto usado, da região e de quanto tempo faz, porque nem todo material se comporta do mesmo jeito. Leve qualquer registro que tenha. Às vezes a conduta é esperar, às vezes existe alternativa."
      ]
    ]
  },
  {
    "slug": "estetica-corporal",
    "nome": "Estética corporal",
    "marca": "ecooa.esthetic",
    "titulo": "Estética corporal, planejada em etapas.",
    "sub": "Contorno corporal, gordura localizada, celulite e flacidez, com plano realista e, quando faz sentido, em conjunto com nutrição e medicina.",
    "meta": "Estética corporal em Moinhos de Vento, Porto Alegre: contorno corporal, gordura localizada, celulite, flacidez e protocolos combinados com nutrição. Avaliação criteriosa.",
    "intro": [
      "Quem procura estética corporal quase nunca chega por vaidade solta no ar. Chega porque emagreceu e a barriga não firmou, porque o culote continua ali depois de anos de treino, porque a celulite mudou de aspecto e incomoda em qualquer roupa, ou porque a pele ficou solta depois de uma gestação. Há também quem chegue depois de sessões que não trouxeram o que esperava, e chegue desconfiada.",
      "O trabalho começa antes de qualquer procedimento, separando o que você tem, porque queixas parecidas têm causas diferentes. Gordura localizada não é flacidez de pele. Flacidez não é perda de massa muscular. Retenção de líquido não é gordura. Celulite costuma ser mais de uma coisa ao mesmo tempo. A avaliação olha a região, a qualidade da pele, o histórico de peso, a velocidade com que você emagreceu e o que já tentou. Só então vem o plano, em etapas, com data para reavaliar e com o que ele não resolve dito em voz alta.",
      "Na estética corporal, quem tem a harmonização corporal entre as áreas declaradas é Eduarda Schoenmeier, biomédica esteta, CRBM 7243. Jennifer Adam, biomédica esteta, CRBM-5 8600, de rejuvenescimento, e Tais de la Rosa, farmacêutica, CRF-RS 588527, de saúde da pele, atuam em rosto e pele, e entram quando a queixa passa por ali. Cada uma trabalha dentro do que a própria profissão e o próprio registro permitem, e a indicação depende de avaliação individual. O atendimento é presencial, em Moinhos de Vento, Porto Alegre. Quando a queixa é mais de composição corporal do que de contorno, ou quando aparece algo que pede avaliação clínica, o caminho começa por nutrição ou por medicina, e você vai ouvir isso."
    ],
    "queixas": [
      "Barriga que não firma mesmo depois de ter emagrecido",
      "Gordura localizada no culote, no flanco ou no abdômen que resiste a treino e dieta",
      "Celulite nas coxas e no glúteo que piorou nos últimos anos",
      "Pele sobrando nos braços, na barriga ou nas coxas depois da perda de peso",
      "Flacidez que apareceu depois da gestação e não voltou sozinha",
      "Glúteo sem firmeza, com aspecto irregular ou com covinhas",
      "Estrias antigas esbranquiçadas, ou estrias novas ainda avermelhadas",
      "Papada e contorno do queixo que incomodam nas fotos",
      "Pernas pesadas e sensação de inchaço no fim do dia, com dúvida se aquilo é estético ou clínico",
      "Vontade de fazer drenagem ou massagem modeladora e dúvida se aquilo resolve",
      "Já fez sessões antes e não percebeu mudança"
    ],
    "servicos": [
      [
        "Avaliação corporal inicial",
        "Conversa sobre histórico de peso, gestações, rotina e treino, seguida do exame das regiões que incomodam. Serve para separar o que é gordura, flacidez, retenção ou qualidade de pele antes de indicar qualquer coisa."
      ],
      [
        "Plano por etapas, com reavaliação marcada",
        "Definição do que tratar primeiro, em qual região e com qual intervalo, com data marcada para revisar. A conversa sobre manutenção vem depois, quando já dá para ver como o seu corpo respondeu. Faz sentido para quem tem várias queixas juntas e precisa de ordem."
      ],
      [
        "Gordura localizada",
        "Para depósitos que resistem a dieta e treino no abdômen, no flanco e no culote. A avaliação define se existe indicação, quais recursos cabem ao profissional que atende você e a estimativa de sessões."
      ],
      [
        "Flacidez de pele",
        "Para quem perdeu peso, passou por gestação ou percebeu perda de firmeza com o tempo. O estímulo depende do grau de flacidez, e há graus em que a melhora possível é pequena. Isso é dito antes."
      ],
      [
        "Celulite e textura da pele",
        "Celulite reúne gordura, retenção, tração dos septos e qualidade da pele em proporções que variam. A avaliação identifica o que pesa mais no seu caso e define um caminho, quase sempre com mais de uma frente."
      ],
      [
        "Estrias corporais",
        "Estria recente e estria antiga respondem de formas distintas. A avaliação classifica o que você tem e explica o que dá para trabalhar em textura e cor, e o que não desaparece, antes de você decidir."
      ],
      [
        "Cuidado da pele e rotina em casa",
        "Orientação de rotina de cuidado da pele com Tais de la Rosa, farmacêutica, dentro do que a profissão permite, considerando oleosidade, ressecamento e textura. Lesões, manchas ou alterações suspeitas são encaminhadas para avaliação médica."
      ],
      [
        "Corpo depois do emagrecimento",
        "Emagrecer rápido, com ou sem medicação, pode vir acompanhado de pele sobrando e de perda de massa muscular. O plano corporal caminha junto de nutrição e, quando indicado, de avaliação médica, porque procedimento isolado não muda composição corporal."
      ],
      [
        "Papada e contorno do terço inferior",
        "Quando a queixa inclui queixo e pescoço, a avaliação define se predomina gordura, flacidez ou perda de definição do contorno, e o que cabe à harmonização orofacial com Eduarda Schoenmeier."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você descreve a queixa e a região que incomoda. A equipe indica qual profissional atende aquilo, com os horários disponíveis e as condições de atendimento daquela profissional. Se o seu caso for mais de peso e composição corporal do que de contorno, você é direcionado para nutrição ou medicina antes."
      ],
      [
        "Avaliação presencial",
        "Leve o histórico de peso dos últimos anos, os tratamentos estéticos que já fez, medicamentos e suplementos em uso e exames recentes. A avaliação inclui examinar as regiões citadas. Ao final, a conduta é apresentada em etapas, com o que ela não resolve dito junto."
      ],
      [
        "Sessões com registro do percurso",
        "As sessões seguem a ordem definida. Quando você autoriza, fotos padronizadas ficam no seu registro e servem de referência, porque mudança gradual engana a memória. O que você pode sentir durante e depois é explicado antes, não descoberto na hora."
      ],
      [
        "Reavaliação e decisão de seguir",
        "Na data combinada o plano é revisto: o que respondeu, o que não respondeu e se faz sentido continuar. Nem toda etapa prevista é confirmada. Quando a resposta não veio, isso é dito, e a conduta muda, inclusive para interromper."
      ]
    ],
    "faq": [
      [
        "Quanto custa um tratamento corporal aqui?",
        "Os valores são definidos por cada profissional, que atende de forma autônoma na casa, e são informados no agendamento pelo WhatsApp, antes de você reservar horário. O site não publica tabela porque o recurso indicado e a região a tratar mudam de caso para caso. As etapas do plano são apresentadas antes de você decidir."
      ],
      [
        "Quantas sessões eu vou precisar?",
        "Só dá para responder depois da avaliação, porque depende da região, do grau da queixa e do recurso escolhido. Por mensagem, sem examinar a região, não dá para estimar com honestidade. Na avaliação você recebe uma estimativa e a data para revisá-la."
      ],
      [
        "Em quanto tempo eu vejo diferença?",
        "Depende do que está sendo tratado. Estímulos de firmeza dependem da resposta do seu próprio tecido e costumam levar de semanas a meses para se expressar. Outros efeitos podem aparecer antes. Prazo prometido antes da avaliação é especulação."
      ],
      [
        "Dói?",
        "Varia conforme o recurso, a região e a pessoa. O desconforto costuma ser descrito como calor, pressão ou formigamento. O profissional explica antes o que você pode sentir durante e nas horas seguintes, e ajusta a intensidade conforme a sua tolerância."
      ],
      [
        "Tem risco?",
        "Todo procedimento tem. Vermelhidão, inchaço e sensibilidade temporários estão entre as reações esperadas. Reações menos frequentes existem e são explicadas na avaliação. Há também contraindicações, e é por isso que histórico de saúde, medicamentos em uso, gestação e amamentação são perguntados antes."
      ],
      [
        "Preciso de encaminhamento para marcar?",
        "Não. Você agenda direto pelo WhatsApp. Se já tiver exames recentes ou acompanhamento nutricional e médico, leve as informações. Ajuda a distinguir o que é questão de pele e contorno do que é composição corporal ou algo clínico a tratar antes."
      ],
      [
        "Vocês atendem por convênio?",
        "Isso varia de profissional para profissional, porque cada uma define as próprias condições de atendimento. Por isso a confirmação é feita no agendamento: a equipe verifica com quem você escolher e responde antes de marcar. Qualquer documento necessário para o seu plano é combinado nesse mesmo contato."
      ],
      [
        "Vocês atendem online?",
        "Procedimento corporal é presencial, sempre, porque depende de examinar a pele e a região. Dúvidas iniciais e agenda podem ser resolvidas pelo WhatsApp com a equipe, mas indicação e plano de tratamento só saem depois da avaliação em Moinhos de Vento."
      ],
      [
        "Vocês fazem drenagem linfática e massagem modeladora?",
        "A casa não anuncia esses recursos como serviço desta área, e nem sempre eles são o caminho para a queixa descrita. Na avaliação o profissional explica o que executa dentro da própria profissão e, quando o que você precisa está fora disso, indica onde procurar."
      ]
    ]
  },
  {
    "slug": "tricologia",
    "nome": "Tricologia",
    "marca": "ecooa.esthetic",
    "titulo": "Tricologia: investigar o cabelo antes de tratar.",
    "sub": "Queda de cabelo, alopecias, afinamento dos fios e saúde do couro cabeludo, do diagnóstico médico à tricologia estética e aos testes genéticos.",
    "meta": "Tricologia em Porto Alegre: diagnóstico de queda de cabelo, alopecia, tratamento capilar médico e estético, teste genético capilar e terapias de fortalecimento dos fios.",
    "intro": [
      "Quem chega por causa de cabelo costuma vir reparando havia meses. O rabo de cavalo mais fino, a risca abrindo, a quantidade de fio no ralo e na escova, a foto de dois anos atrás com um volume que hoje não existe. No caminho até aqui, é comum ter passado por shampoo indicado por alguém, vitamina comprada por conta própria, produto visto em anúncio. Às vezes melhora um pouco, às vezes nada muda, e o tempo passa sem que a pergunta que importa tenha sido respondida: por que esse cabelo está caindo.",
      "Queda não é diagnóstico, é sintoma. O eflúvio telógeno que vem depois de uma cirurgia, de um parto, de uma dieta agressiva ou de um período de estresse pesado se comporta de um jeito. A alopecia androgenética, que afina o fio e abre a risca de forma progressiva, se comporta de outro. A areata aparece como falha delimitada e tem investigação própria. E existe a queda que é consequência de outra coisa: tireoide, ferro baixo, uma dermatite seborreica mantendo o couro cabeludo inflamado. Distinguir uma coisa da outra é trabalho de avaliação médica, e é isso que define a conduta.",
      "Na ecooa, em Moinhos de Vento, Porto Alegre, o cuidado com o cabelo reúne profissões diferentes, e isso é proposital. Yale Jerônimo, médica, CRM-RS 49.185, atua em tricologia e alopecias. Larissa Wiebbelling, médica, CRM-RS 55.504, atua em tricologia médica e transplante capilar. Viviane Fagundes, biomédica, CRBM 2565, atua em tricologia estética e testes genéticos capilares. Susan Flach, biomédica, CRBM-5 4182, atua em tricologia e gerenciamento da pele. Danusa Pires, enfermeira, COREN-RS 395164, atua em tricologia estética e reposição de nutrientes. Diagnóstico e prescrição são atos médicos, e cada profissional executa apenas o que o conselho da própria profissão autoriza. Diante de suspeita de doença, o caminho começa pela avaliação médica, e o cuidado do fio segue junto."
    ],
    "queixas": [
      "Cabelo caindo demais no banho, na escova e no travesseiro",
      "Rabo de cavalo bem mais fino do que era",
      "Risca do meio abrindo e couro cabeludo aparecendo",
      "Entradas aumentando e topo da cabeça ralo",
      "Falha redonda que apareceu do nada",
      "Queda que começou meses depois do parto",
      "Queda depois de cirurgia, dieta pesada ou fase de estresse",
      "Caspa que sempre volta e coceira no couro cabeludo",
      "Couro cabeludo oleoso, ardido ou com casquinhas",
      "Já usei produto para queda por conta própria e não sei se serve para o meu caso",
      "Calvície na família e vontade de entender como está o meu cabelo"
    ],
    "servicos": [
      [
        "Consulta médica para queda de cabelo",
        "Avaliação com médica para investigar a causa da queda: história clínica, exame do couro cabeludo com ampliação e exames laboratoriais quando fazem sentido. É o ponto de partida diante de suspeita de doença."
      ],
      [
        "Investigação de alopecias",
        "Androgenética, areata, eflúvio telógeno e alopecias cicatriciais têm evolução e conduta próprias. A investigação é médica e define qual quadro está em curso, se há mais de um ao mesmo tempo, e o que já não se recupera."
      ],
      [
        "Tricoscopia e registro fotográfico",
        "Exame do couro cabeludo com ampliação, que mostra detalhes do fio e da pele que não aparecem a olho nu. A leitura diagnóstica é da médica, e o registro, feito com o seu consentimento, serve para comparar meses depois, porque cabelo muda devagar."
      ],
      [
        "Teste genético capilar",
        "Análise laboratorial de características ligadas ao comportamento do fio, conduzida por biomédica e lida junto com o exame clínico. Ajuda quem quer entender a própria predisposição. Não fecha diagnóstico sozinha nem define tratamento."
      ],
      [
        "Tricologia estética e cuidado do couro cabeludo",
        "Sessões voltadas à saúde do couro cabeludo e à qualidade do fio, com limpeza, controle de oleosidade e descamação e estímulo local, cada profissional executando o que o conselho da própria profissão autoriza. Acompanham o tratamento médico, e não substituem o cuidado de uma doença."
      ],
      [
        "Caspa e dermatite seborreica",
        "Coceira, descamação e vermelhidão têm causas diferentes, e o diagnóstico é médico. Confirmado o quadro, o tratamento é conduzido pela médica, e o cuidado do couro cabeludo em sessão e a rotina em casa acompanham essa orientação."
      ],
      [
        "Reposição de nutrientes",
        "Suporte de vitaminas e minerais quando a investigação mostra deficiência, com prescrição médica e aplicação conduzida por enfermeira. Não é etapa padrão, porque nem toda queda tem carência envolvida."
      ],
      [
        "Revisão do que você já usa",
        "Muita gente chega usando algo comprado por conta própria ou indicado em outro lugar. A consulta revisa se aquilo faz sentido para o seu caso. Iniciar, manter ou suspender medicação é decisão médica, tomada na consulta."
      ],
      [
        "Avaliação para transplante capilar",
        "Conversa com médica sobre a possibilidade cirúrgica, com análise da área doadora, do padrão da perda e do momento do quadro. Nem todo caso tem indicação, e queda ativa costuma pedir controle clínico antes."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você conta há quanto tempo o cabelo cai, se apareceu falha e se houve parto, cirurgia, dieta ou estresse pesado nos últimos meses. No agendamento você recebe as informações de horário e valor e escolhe a profissional. Havendo suspeita de doença, o caminho começa pela consulta médica."
      ],
      [
        "A primeira consulta",
        "História clínica somada ao exame do couro cabeludo, presencial, em Moinhos de Vento. Leve exames de sangue recentes, se tiver, a lista de medicamentos, anticoncepcional e suplementos em uso, e fotos antigas do seu cabelo."
      ],
      [
        "O plano sai da causa, não da queixa",
        "Terminada a avaliação, você entende qual é a hipótese, o que falta confirmar por exame e o que dá para fazer agora. Se o caso pede outra profissional ou investigação fora da tricologia, isso é dito ali."
      ],
      [
        "Retorno e leitura do que mudou",
        "O ciclo do fio é lento, e o retorno compara antes e depois pelo registro fotográfico, não pela impressão. O intervalo é definido na consulta, e o plano é mantido, ajustado ou trocado conforme o que se vê."
      ]
    ],
    "faq": [
      [
        "Quanto custa a consulta?",
        "O valor depende da profissional e do tipo de avaliação, e é informado no agendamento, pelo WhatsApp, antes de você marcar. Cada profissional é autônoma e define a própria agenda e os próprios honorários, sem tabela única."
      ],
      [
        "Em quanto tempo o cabelo responde?",
        "O fio tem ciclo próprio, e mudança capilar não aparece em semanas. A leitura é feita em janelas mais longas, com foto comparativa, não pela impressão diante do espelho. Não há prazo fechado nem número a prometer, porque a resposta varia de pessoa para pessoa e depende da causa."
      ],
      [
        "Toda queda de cabelo tem tratamento?",
        "Toda queda tem investigação, e é por aí que se começa. Algumas causas respondem quando identificadas cedo, outras têm controle possível, e existe perda já consolidada que não volta. Saber em que ponto está o seu caso muda o que faz sentido fazer daqui em diante."
      ],
      [
        "Dói?",
        "Depende do que for indicado. Exame do couro cabeludo e tricoscopia não doem. Procedimentos com agulha causam desconforto variável, e isso é conversado antes, junto do que se pode fazer para reduzir. A ideia é que você saiba antes o que esperar."
      ],
      [
        "Tem risco?",
        "Todo procedimento tem. O couro cabeludo pode reagir com vermelhidão, sensibilidade ou descamação nos dias seguintes, e medicações têm efeitos que precisam de acompanhamento de quem prescreveu. Os riscos do seu caso são explicados na consulta."
      ],
      [
        "Preciso de encaminhamento médico para agendar?",
        "Não. O agendamento é direto pelo WhatsApp. Se você já investiga tireoide, ferro ou algum quadro hormonal com outro médico, leve os exames. E se a causa estiver fora da tricologia, isso é dito e encaminhado."
      ],
      [
        "Vocês atendem convênio?",
        "Cada profissional é autônoma e define como trabalha, inclusive formas de pagamento e emissão de recibo. Por isso a pergunta é respondida caso a caso no agendamento, com a informação de quem você escolher. Vale perguntar junto do horário."
      ],
      [
        "Atende online?",
        "A avaliação de cabelo depende de olhar o couro cabeludo de perto, com ampliação, e isso pede presença. O primeiro contato e as dúvidas se resolvem pelo WhatsApp. Retorno a distância, quando cabível, segue as regras do conselho de cada profissão e é combinado com a profissional."
      ],
      [
        "Posso usar por conta própria um remédio para queda?",
        "Quem avalia indicação, forma de uso e acompanhamento de medicamento é a médica, na consulta. Muita gente começa sozinha, não vê efeito e conclui que nada funciona, quando a causa da queda podia ser outra. Leve para a consulta tudo o que você já usa."
      ],
      [
        "Fiz teste genético capilar. Ele diz o que eu tenho?",
        "Não. Ele mostra características e predisposições que ajudam a direcionar escolhas, e é lido junto do exame clínico e dos exames de sangue. Sozinho, não fecha diagnóstico nem define conduta. É uma peça, não a resposta."
      ]
    ]
  },
  {
    "slug": "transplante-capilar",
    "nome": "Transplante capilar",
    "marca": "ecooa.esthetic",
    "titulo": "Transplante capilar com critério de indicação.",
    "sub": "Avaliação honesta de área doadora e receptora, técnica sem raspagem e com fio longo, transplante de barba e sobrancelha, do planejamento ao pós-operatório.",
    "meta": "Transplante capilar em Porto Alegre: avaliação de indicação, técnica FUE sem raspagem, fio longo, transplante de barba e sobrancelha, com acompanhamento completo.",
    "intro": [
      "Quem procura transplante capilar quase nunca chega no primeiro dia da queda. Chega depois de anos vendo a linha subir, de fotos que passaram a ser evitadas, de loção, remédio e laser que seguraram por um tempo e depois não seguraram mais. E com uma pergunta que segue sem resposta: sou caso de cirurgia, ou ainda tem coisa a fazer antes?",
      "Transplante não cria cabelo novo. Ele redistribui o que você ainda tem, retirando folículos da área doadora, em geral nuca e laterais, e reposicionando onde falta. A área doadora é finita e não se repõe, e a cirurgia não interrompe a perda do fio nativo, que segue o próprio curso ao lado do enxerto. Por isso o momento de operar e o controle da causa da queda entram na decisão antes de qualquer técnica.",
      "Antes disso vem o diagnóstico. Nem toda queda é calvície de padrão. Existem alopecias com inflamação e cicatriz que contraindicam cirurgia enquanto ativas, e quedas de causa clínica, hormonal ou nutricional que pedem conduta clínica, não bisturi. Na ecooa, em Moinhos de Vento, Porto Alegre, essa avaliação é feita pelas médicas Larissa Wiebbelling, CRM-RS 55.504, que atua com transplante capilar e tricologia médica, e Yale Jerônimo, CRM-RS 49.185, que atua com tricologia e alopecias. A enfermeira Danusa Pires, COREN-RS 395164, cuida da tricologia estética, e a biomédica Viviane Fagundes, CRBM 2565, conduz os testes genéticos capilares, cada uma dentro do que o conselho da própria profissão autoriza. Existe caso em que a resposta honesta é ainda não, e caso em que é não."
    ],
    "queixas": [
      "Entradas que subiram e agora aparecem em toda foto",
      "Coroa aberta que só descobri quando alguém me fotografou por cima",
      "Dá para ver o couro cabeludo na luz do banheiro",
      "Boné virou item obrigatório para sair de casa",
      "Já usei loção, remédio e laser, e a linha continuou andando",
      "Falha na barba que nunca fechou, mesmo deixando crescer",
      "Sobrancelha rala de tanto tirar quando era mais nova",
      "Meu cabelo afinou e me disseram que mulher não faz transplante",
      "Não sei se ainda tenho cabelo suficiente para transplantar",
      "Medo de raspar a cabeça e todo mundo perceber que fiz",
      "Já fiz transplante antes e não fiquei satisfeito com o desenho da linha",
      "Queda que começou depois de um período difícil e não parou"
    ],
    "servicos": [
      [
        "Avaliação de indicação cirúrgica",
        "Consulta médica antes de agendar cirurgia. Exame do couro cabeludo com tricoscopia e análise da área doadora. Ao final, a indicação, ou a ausência dela, é explicada com o motivo."
      ],
      [
        "Diagnóstico de alopecias",
        "Investigação médica da causa da queda com Yale Jerônimo e Larissa Wiebbelling. Alopecia androgenética, eflúvio, areata e formas cicatriciais pedem condutas diferentes, e algumas contraindicam cirurgia enquanto ativas."
      ],
      [
        "Transplante capilar por FUE",
        "Cirurgia com Larissa Wiebbelling: extração dos folículos um a um da área doadora e implante na região de falha, sem corte linear. Procedimento longo, com anestesia local. Densidade e desenho da linha são definidos antes."
      ],
      [
        "Técnica sem raspagem e fio longo",
        "Alternativa para quem não pode ou não quer raspar a cabeça. Não cabe em todo caso, porque depende do número de folículos necessários e das características do seu fio."
      ],
      [
        "Transplante de barba",
        "Para falhas que nunca fecharam, assimetrias e cicatrizes. Usa a mesma área doadora do couro cabeludo, o que exige planejar junto com a necessidade futura do cabelo. Ângulo e densidade mudam."
      ],
      [
        "Transplante de sobrancelha",
        "Indicado em sobrancelha rala por remoção repetida, cicatriz ou perda definitiva. Os fios seguem o comportamento do couro cabeludo e continuam crescendo, o que significa aparar com frequência."
      ],
      [
        "Transplante capilar feminino",
        "Mulher opera, com critério. A perda costuma ser difusa e a área doadora nem sempre está preservada. A avaliação investiga causas clínicas e hormonais antes de considerar cirurgia."
      ],
      [
        "Tratamento clínico capilar",
        "Condução médica do cabelo que você ainda tem, antes e depois da cirurgia. É a parte que cuida do fio nativo ao redor do enxerto, sob acompanhamento médico. Conduta e prescrição dependem do exame em consulta."
      ],
      [
        "Teste genético capilar",
        "Exame laboratorial conduzido pela biomédica Viviane Fagundes, dentro da atuação da biomedicina. É informação complementar para a decisão médica, não substitui consulta nem define a indicação cirúrgica."
      ],
      [
        "Preparo e pós-operatório do couro cabeludo",
        "Acompanhamento com Danusa Pires, dentro do que a enfermagem realiza: higiene, cuidado das crostas e orientação do dia a dia nas semanas seguintes. Indicação e conduta seguem sendo médicas, e o retorno à médica acontece quando o caso pede."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você conta há quanto tempo perde cabelo, o que já tentou e o que mais incomoda. A equipe indica se o caminho começa pela avaliação cirúrgica ou pela investigação da causa, com os horários disponíveis e as condições de atendimento."
      ],
      [
        "Avaliação presencial",
        "Leve exames recentes, a lista de medicamentos, fotos antigas do seu cabelo e, se já operou, o relatório da cirurgia anterior. A médica examina o couro cabeludo e avalia a área doadora. Ao final, ela explica se existe indicação e em que ordem cada etapa entra."
      ],
      [
        "Planejamento e cirurgia",
        "O desenho da linha e a quantidade de folículos são combinados antes, com você de acordo. A cirurgia leva várias horas, com anestesia local. Orientações de preparo, de acompanhante e de afastamento são passadas antes da data."
      ],
      [
        "Pós-operatório e retornos",
        "Os retornos acompanham cicatrização e crescimento, que se avalia em meses. É esperado que os fios transplantados caiam nas primeiras semanas. O tratamento do cabelo nativo continua, porque a cirurgia não o protege da perda."
      ]
    ],
    "faq": [
      [
        "Quanto custa um transplante capilar?",
        "Os valores são definidos por cada profissional, que atende de forma autônoma na casa, e informados no agendamento pelo WhatsApp, antes de você reservar horário. O site não publica tabela porque a extensão da área e o número de folículos só se definem depois da avaliação."
      ],
      [
        "Todo mundo pode fazer transplante?",
        "Não. Existem critérios clínicos e contraindicações. Área doadora insuficiente, alopecia em atividade inflamatória, perda ainda rápida numa idade precoce e expectativa incompatível com o que a técnica alcança são motivos para não operar agora. A avaliação diz isso antes."
      ],
      [
        "Preciso raspar a cabeça?",
        "Depende do caso. Existe técnica sem raspagem e com fio longo, mas ela não cabe em toda situação, principalmente quando o número de folículos é grande. Na avaliação a médica explica o que é possível no seu caso."
      ],
      [
        "Dói?",
        "A cirurgia é feita com anestesia local, e o desconforto maior costuma ser na hora de anestesiar. Depois o incômodo é mais de posição e de duração, porque são muitas horas. Nos primeiros dias é comum sensibilidade, inchaço e crostas."
      ],
      [
        "Em quanto tempo aparece resultado?",
        "Não é rápido. Os fios transplantados costumam cair nas primeiras semanas, e o crescimento se avalia ao longo de muitos meses, com variação de pessoa para pessoa. Comparação séria se faz com fotografia padronizada, no mesmo ângulo e na mesma luz."
      ],
      [
        "Tem risco?",
        "Tem. É cirurgia, e toda cirurgia tem risco: sangramento, infecção, alteração de cicatrização, foliculite e resultado estético abaixo do planejado. Doenças, medicamentos em uso e tabagismo mudam a conduta. Riscos e sinais de alerta são explicados antes."
      ],
      [
        "Mulher pode fazer transplante capilar?",
        "Pode, com critério. A perda feminina costuma ser mais difusa e às vezes atinge também a região doadora, o que reduz a indicação em parte dos casos. Antes de cogitar cirurgia, a avaliação investiga causas clínicas e hormonais."
      ],
      [
        "Preciso de encaminhamento para marcar?",
        "Não. Você agenda direto pelo WhatsApp, sem pedido de outro profissional. Se tiver exames de sangue recentes, laudo de biópsia do couro cabeludo ou o relatório de uma cirurgia anterior, leve. Isso muda o planejamento e evita repetir investigação."
      ],
      [
        "Vocês atendem por convênio?",
        "Isso varia de profissional para profissional, porque cada um define as próprias condições de atendimento. Por isso a confirmação é feita no agendamento: a equipe verifica com quem você escolher e responde antes de marcar. Vale separar as duas coisas no contato, consulta e cirurgia."
      ],
      [
        "Vocês atendem online?",
        "A avaliação de indicação e a cirurgia são presenciais, porque dependem do exame do couro cabeludo e da área doadora. Parte da orientação pode ocorrer a distância dentro das regras do Conselho Federal de Medicina. A equipe informa no agendamento o que se aplica ao seu caso."
      ]
    ]
  },
  {
    "slug": "nutricao",
    "nome": "Nutrição",
    "marca": "ecooa.working",
    "titulo": "Nutrição ajustada à sua rotina real.",
    "sub": "Doze nutricionistas com focos diferentes: emagrecimento, hipertrofia, nutrição clínica, esportiva, materno-infantil, vegetariana e comportamental.",
    "meta": "Nutricionista em Moinhos de Vento, Porto Alegre: emagrecimento, hipertrofia, nutrição clínica, esportiva, vegetariana, materno-infantil e comportamental. Presencial e online.",
    "intro": [
      "Quase ninguém chega ao nutricionista sem ter tentado alguma coisa antes. A dieta que funcionou por três semanas, o jejum que virou beliscada às onze da noite, o aplicativo de contagem de calorias abandonado no quarto dia, o low carb que durou até a primeira viagem a trabalho. O problema raramente é falta de informação. O que falta é um plano feito para a sua rotina, o seu histórico e o que você consegue sustentar depois que a motivação inicial passa.",
      "Por isso o acompanhamento começa olhando para trás. Como você come nos dias corridos e nos dias ruins, quanto treina de verdade, como andam o sono e o intestino, quais exames existem, quais medicamentos e suplementos você usa, quantas vezes o peso já subiu e desceu. É daí que se decide o que muda primeiro, e é aí que aparece, sem rodeio, quando o caminho passa por outro lugar: uma investigação médica, um acompanhamento em saúde mental, ou o trabalho conjunto com quem prescreve medicação para controle de peso.",
      "Na ecooa, em Moinhos de Vento, Porto Alegre, são doze nutricionistas com focos diferentes, e a diferença importa. Jessica Stein atua em nutrição clínica, alimentação vegetariana, emagrecimento e materno-infantil. Verena Cattani, em nutrição clínica. Marvin Marques, em clínica e emagrecimento. Giancarla Rochemback e Daniel Forster transitam entre a clínica e a esportiva. Maria Luísa Borges, Vitória Serpa e Lara Caye trabalham com esporte, hipertrofia e alta performance, e Nasser Salem, com esportiva e emagrecimento. Gabrieli Avila é da nutrição comportamental, Camila Cadore da funcional e integrativa, e Adriano Flesch Lenz atua com práticas ortomoleculares. Quem quer ganhar massa muscular não precisa do mesmo tipo de conversa de quem chega com uma relação difícil com a comida."
    ],
    "queixas": [
      "Emagrecer sem viver de dieta restritiva",
      "Peso que sobe e desce há anos",
      "Treinar há meses e não ganhar massa muscular",
      "Não saber o que comer antes e depois do treino",
      "Descontrole com a comida à noite depois de um dia comendo pouco",
      "Comer por ansiedade, tédio ou cansaço",
      "Barriga estufada, gases e intestino preso",
      "Virar vegetariano ou vegano sem errar em ferro, proteína e B12",
      "O que muda na alimentação da gestação e da amamentação",
      "Começar a introdução alimentar do bebê sem insegurança",
      "Reorganizar a alimentação depois da cirurgia bariátrica",
      "Dúvida se low carb ou jejum intermitente serve para o seu caso"
    ],
    "servicos": [
      [
        "Nutrição clínica",
        "Avaliação do histórico, dos exames, da rotina e do que você já tentou, com orientação possível de sustentar e revisada a cada retorno. Para quem quer organizar a alimentação com acompanhamento, não seguir uma regra fixa."
      ],
      [
        "Emagrecimento com acompanhamento",
        "Estratégia construída a partir do seu histórico de peso, da fome real ao longo do dia e da rotina de trabalho. Inclui suporte nutricional a quem usa medicação para controle de peso prescrita por médico."
      ],
      [
        "Nutrição esportiva e hipertrofia",
        "Alimentação organizada em torno do treino, com atenção a proteína, energia e recuperação. Para quem treina com objetivo definido, do ganho de massa à competição, e cansou de decidir o que comer no improviso."
      ],
      [
        "Nutrição comportamental",
        "Trabalho sobre a relação com a comida antes do cardápio: episódios de descontrole, beliscar à noite, comer por ansiedade ou por cansaço. Sem discurso de culpa e sem lista de proibições, e junto da saúde mental quando o quadro pede esse acompanhamento."
      ],
      [
        "Nutrição materno-infantil",
        "Acompanhamento de tentantes, gestantes, lactantes e crianças, incluindo introdução alimentar. Junta o que muda em cada fase e o que é possível dentro da rotina de uma casa com criança pequena."
      ],
      [
        "Alimentação vegetariana e vegana",
        "Planejamento de uma dieta sem carne que feche em proteína, ferro, cálcio, ômega 3 e B12, com acompanhamento por exames. Para quem já é vegetariano e para quem pensa em fazer a transição."
      ],
      [
        "Saúde intestinal",
        "Cuidado nutricional para intestino preso, gases, distensão abdominal e desconforto depois das refeições. Investiga padrão alimentar, hidratação e rotina, e encaminha para investigação médica quando o quadro pede, sem substituir esse diagnóstico."
      ],
      [
        "Nutrição funcional e integrativa",
        "Olhar que inclui sono, estresse, rotina e vínculos, além do prato. Abrange também a abordagem ortomolecular de quem atua nessa linha, com suplementação alimentar avaliada caso a caso e sempre depois da consulta, nunca como indicação padrão."
      ],
      [
        "Leitura de exames e composição corporal",
        "Interpretação dos seus exames sob a ótica da nutrição e avaliação da composição corporal, conforme o método de cada profissional. Serve para acompanhar mudança real ao longo do tempo, não só o peso."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você conta em poucas linhas o que procura: emagrecer, hipertrofia, intestino, gestação, relação com a comida. A recepção indica dois ou três nutricionistas cujo foco combina com isso, e informa a disponibilidade e o valor de cada um antes do agendamento."
      ],
      [
        "A primeira consulta",
        "É uma conversa longa de anamnese, presencial em Moinhos de Vento ou online, conforme o profissional. Leve os exames recentes, se tiver, a lista de medicamentos e suplementos em uso e uma ideia honesta de como são os seus dias, inclusive os desorganizados."
      ],
      [
        "A orientação sai dali",
        "Você recebe a orientação por escrito, construída sobre o que já existe na sua rotina, com o porquê de cada escolha explicado. Não é um cardápio padronizado, igual para todo mundo, e nenhuma suplementação é indicada sem que a avaliação justifique."
      ],
      [
        "Retorno e ajuste",
        "O intervalo entre consultas é combinado conforme o objetivo. No retorno se olha fome, sono, intestino, treino, adesão e exames, e a estratégia é ajustada ao que aconteceu de fato. O que costuma sustentar mudança é esse ciclo, não a primeira semana."
      ]
    ],
    "faq": [
      [
        "Quanto custa a consulta com nutricionista?",
        "O valor depende do profissional e do tipo de avaliação, e é informado no agendamento, pelo WhatsApp, antes de você marcar. Cada nutricionista da casa é autônomo e define a própria agenda e os próprios honorários, então não existe tabela única."
      ],
      [
        "Em quanto tempo eu vejo resultado?",
        "Depende do objetivo, do ponto de partida e da constância, e não dá para responder isso com honestidade em uma primeira mensagem. O compromisso é com um plano que caiba na sua rotina e seja ajustado nos retornos, não com prazo fechado nem número prometido."
      ],
      [
        "Preciso de encaminhamento médico para agendar?",
        "Não. O agendamento é direto pelo WhatsApp. Se você já faz acompanhamento médico, leve os exames e o que foi prescrito, porque isso mantém as duas condutas alinhadas. E se na avaliação aparecer algo que pede um médico, isso é dito com clareza."
      ],
      [
        "Vocês atendem por convênio?",
        "Cada nutricionista é autônomo e define como trabalha. Por isso essa pergunta é respondida caso a caso no agendamento, com a informação do profissional que você escolher, antes de marcar. A recepção verifica e retorna pelo WhatsApp."
      ],
      [
        "Atende online ou só presencial?",
        "Boa parte da equipe atende nos dois formatos, e a recepção confirma quem atende online antes do agendamento. A consulta online segue a mesma estrutura de avaliação, orientação e retorno, e costuma ser a escolha de quem mora longe de Porto Alegre ou tem rotina de trabalho difícil de encaixar."
      ],
      [
        "Preciso cortar tudo o que eu gosto?",
        "Não. O ponto de partida é o que você come hoje. Restrição extrema costuma durar pouco e cobrar depois, em desistência ou em descontrole. O que se ajusta primeiro costuma ser quantidade, horário e composição das refeições, não a lista de proibições."
      ],
      [
        "Nutricionista prescreve remédio para emagrecer?",
        "Não. Medicamento é prescrição médica. A suplementação alimentar está dentro do escopo do nutricionista quando a avaliação indica, mas é decidida na consulta, com os seus exames e a sua rotina na mesa, nunca por mensagem antes de conhecer o caso."
      ],
      [
        "Uso caneta emagrecedora. Ainda faz diferença ver nutricionista?",
        "Faz. Perder peso e perder massa muscular não são a mesma coisa, e é justamente a alimentação durante o uso que entra no acompanhamento. O trabalho caminha junto do médico que prescreve, e continua depois, quando o desafio passa a ser manter."
      ],
      [
        "Vocês atendem gestante, criança e quem fez cirurgia bariátrica?",
        "Gestação, amamentação e introdução alimentar são atendidas na nutrição materno-infantil. Para pós-bariátrica e outros casos específicos, a recepção verifica quem da equipe tem esse foco e responde antes do agendamento. Se ninguém tiver, isso também é dito."
      ]
    ]
  },
  {
    "slug": "saude-mental",
    "nome": "Saúde mental",
    "marca": "ecooa.mind",
    "titulo": "Saúde mental com escuta sem pressa.",
    "sub": "Psicologia clínica para ansiedade, depressão, luto, autoestima e transições de vida, em um espaço pensado para o silêncio e o acolhimento.",
    "meta": "Psicólogos em Moinhos de Vento, Porto Alegre: psicoterapia para ansiedade, depressão, burnout, luto e autoestima. Atendimento presencial e online, com sigilo e acolhimento.",
    "intro": [
      "Entre o começo do problema e a primeira sessão costuma passar tempo. Antes vieram meses de achar que ia passar, de dormir mal e culpar o trabalho, de adiar decisões simples porque pensar nelas aperta o peito. A ansiedade que não desliga. A tristeza que se instalou sem aviso. A perda sobre a qual ninguém em volta sabe mais como conversar. Quando a pessoa finalmente escreve, costuma vir com a frase de que talvez esteja exagerando.",
      "Aqui não existe número de sessões definido antes de conhecer o caso. A primeira conversa é longa e sem pressa. Serve para entender o que está acontecendo e o que já foi tentado, e para combinar abordagem e ritmo. Serve também para dizer, quando é o caso, que o caminho passa por outro lugar, como uma avaliação psiquiátrica ou uma investigação clínica, porque cansaço e desânimo nem sempre têm origem apenas emocional. Psicólogo não prescreve medicação nem faz diagnóstico médico, e isso é divisão de competências, não limitação escondida.",
      "Na ecooa, em Moinhos de Vento, Porto Alegre, a área é atendida por três psicólogos com focos distintos, e a diferença muda a escolha. Francielle Machado Beria trabalha com terapia cognitivo-comportamental e neuropsicologia, que inclui avaliação de atenção, memória e funções executivas. Manuela Sinigaglia Vanti trabalha com terapia cognitivo-comportamental. Augusto Kauer da Silveira trabalha com psicologia do esporte, campo de quem lida com pressão de competição, rotina de treino e retorno depois de lesão. Os três atendem presencial e online. Quem chega por luto não precisa da mesma conversa de quem trava no dia da prova."
    ],
    "queixas": [
      "Ansiedade que não desliga, mesmo com tudo em ordem",
      "Falta de ar e coração acelerado em momentos de tensão",
      "Medo de passar mal de novo e deixar de sair por causa disso",
      "Tristeza que já dura meses e tirou a vontade de tudo",
      "Cansaço que dormir não resolve e vontade de largar tudo",
      "Perder alguém e não conseguir retomar a vida",
      "Falta de foco, esquecimento e tarefas que se acumulam",
      "Adiar o que importa e se cobrar depois",
      "Travar para falar em reunião, em aula ou em grupo",
      "Checar, conferir e repetir sem conseguir parar",
      "Não se achar bom o suficiente, por mais que dê certo",
      "Treinar bem e travar no dia da competição"
    ],
    "servicos": [
      [
        "Terapia cognitivo-comportamental",
        "Processo estruturado, com objetivos combinados no início e revisados ao longo do caminho. Trabalha a relação entre pensamento, emoção e comportamento, em geral com exercícios propostos pelo psicólogo entre as sessões. Para quem prefere método explicado."
      ],
      [
        "Psicoterapia para ansiedade e pânico",
        "Para quem convive com preocupação constante, com crises em que falta o ar ou com o medo da próxima. O trabalho envolve entender o que dispara o ciclo, o que o mantém e como a evitação foi estreitando a rotina. Quando os sintomas físicos ainda não foram avaliados, a avaliação médica entra junto."
      ],
      [
        "Acompanhamento em quadros depressivos",
        "Para tristeza persistente, perda de interesse e cansaço que não passa. A psicoterapia atua sobre rotina, pensamento e vínculos, e caminha junto do médico quando há medicação em curso ou avaliação psiquiátrica indicada. Diagnóstico e prescrição, quando entram, são do médico."
      ],
      [
        "Luto e transições difíceis",
        "Morte, separação, perda de trabalho, mudança de cidade. Espaço para atravessar o que dói sem prazo imposto de fora, e para olhar o que ficou em suspenso."
      ],
      [
        "Esgotamento e sobrecarga de trabalho",
        "Para quem acorda sem conseguir começar o dia, no que se costuma chamar de burnout. Olha carga de trabalho, limites e sono, e separa o que pode mudar dentro da pessoa do que depende do ambiente. Havendo sintomas físicos, a avaliação médica entra junto."
      ],
      [
        "Avaliação neuropsicológica",
        "Entrevistas e testes padronizados que descrevem atenção, memória, linguagem e funções executivas. Indicada quando há queixa de foco, esquecimento ou desempenho abaixo do esperado. Resulta em relatório que compõe a investigação conduzida com o médico, e não substitui o diagnóstico médico."
      ],
      [
        "Psicologia do esporte",
        "Para atletas e para quem treina sério e trava na hora de competir. Trabalha atenção, rotina antes da prova, lidar com erro, pressão por resultado e retorno depois de lesão, em diálogo com quem cuida do corpo."
      ],
      [
        "Autoestima, relações e dependência emocional",
        "Para quem se cobra sem trégua, depende da aprovação dos outros ou permanece em relações que fazem mal. Sai da lista de defeitos e vai para os padrões que se repetem nos vínculos."
      ],
      [
        "Atendimento online",
        "Sessões por vídeo, conduzidas pelo mesmo psicólogo e com o mesmo dever de sigilo do atendimento presencial. A escolha entre presencial e online é feita junto com o profissional na primeira conversa. Para quem mora fora de Porto Alegre, viaja a trabalho ou tem rotina difícil de encaixar em horário fixo."
      ],
      [
        "Trabalho conjunto e encaminhamento",
        "Quando o quadro pede avaliação psiquiátrica, investigação clínica ou acompanhamento nutricional, isso é dito com clareza. O contato entre os profissionais que acompanham você acontece com a sua autorização, e serve para manter o cuidado coerente."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você escreve em poucas linhas o que está acontecendo. Não precisa contar tudo por mensagem. A recepção orienta qual profissional atende aquele tipo de demanda e informa a disponibilidade de horários e as condições de atendimento antes de qualquer agendamento."
      ],
      [
        "A primeira sessão",
        "Conversa longa sobre o que trouxe você, o histórico, o que já tentou e como andam sono, trabalho e relações. Não é preciso levar nada. Se houver laudo, exame ou medicação em uso, leve. Ao final, abordagem e frequência são combinadas."
      ],
      [
        "O processo, com objetivos combinados",
        "As sessões costumam ser semanais no início, com frequência ajustada conforme o caso e conforme o que o psicólogo propõe. Na terapia cognitivo-comportamental costuma haver exercícios entre os encontros. O que se trabalha, e por quê, é dito em voz alta."
      ],
      [
        "Revisão, espaçamento e alta",
        "De tempos em tempos se olha para trás e se pergunta o que mudou. Terapia não é assinatura. Espaçar as sessões e encerrar são decisões conversadas, e voltar depois é possível sem recomeçar do zero."
      ]
    ],
    "faq": [
      [
        "Como sei o valor da sessão?",
        "Cada psicólogo da casa é autônomo e define os próprios honorários. A informação vem direto do profissional, pelo WhatsApp, antes de qualquer agendamento. A avaliação neuropsicológica tem estrutura diferente da psicoterapia e é informada à parte."
      ],
      [
        "Quantas sessões eu vou precisar?",
        "Depende da demanda, e isso é combinado na primeira conversa, não antes dela. Uma questão delimitada tende a levar menos tempo do que algo antigo que atravessa várias áreas da vida. Ninguém responde com número fechado sem conhecer o caso."
      ],
      [
        "Em quanto tempo eu vou me sentir melhor?",
        "Não existe prazo garantido, e prometer um seria desonesto. O tempo de resposta varia com a demanda, o histórico e o contexto de vida de cada pessoa. O que se pode combinar é revisar junto, em intervalos definidos, o que está e o que não está funcionando, em vez de esperar em silêncio."
      ],
      [
        "Preciso de encaminhamento médico para agendar?",
        "Não. O agendamento é direto pelo WhatsApp. Se você já faz acompanhamento psiquiátrico ou usa medicação, avise, porque isso ajuda a alinhar o acompanhamento. Se durante o processo aparecer necessidade de avaliação médica, isso é dito com clareza."
      ],
      [
        "Psicólogo pode receitar remédio?",
        "Não. Prescrição de medicamento é ato médico, do psiquiatra ou do clínico. O psicólogo conduz a psicoterapia e a avaliação psicológica. Muita gente faz os dois acompanhamentos em paralelo, e um não substitui o outro."
      ],
      [
        "Vocês atendem por convênio?",
        "Isso não é definido pela clínica. Cada psicólogo é autônomo e define como trabalha, inclusive formas de pagamento. Por isso a pergunta é respondida caso a caso no primeiro contato, com a informação do profissional que você escolher."
      ],
      [
        "Como funciona o atendimento online?",
        "É atendimento por vídeo, previsto na regulamentação da psicologia, e a escolha entre presencial e online é feita junto com o psicólogo na primeira conversa, conforme a demanda. Do seu lado, é preciso um lugar reservado e conexão estável, porque o sigilo depende também do ambiente em que você está. A avaliação neuropsicológica em geral exige encontros na clínica, pela natureza dos testes."
      ],
      [
        "O que eu falar fica entre nós?",
        "Sim. O sigilo é obrigação profissional prevista no código de ética da psicologia, e as exceções são poucas e ligadas a situações de risco. Se for necessário conversar com outro profissional que cuida de você, isso é combinado com você antes."
      ],
      [
        "Não sei se o meu caso é grave o suficiente para terapia.",
        "Não existe gravidade mínima para começar. Se algo ocupa espaço demais na sua cabeça, atrapalha o sono, o trabalho ou as relações, já é motivo. Também procura terapia quem quer se entender melhor sem uma queixa fechada."
      ],
      [
        "Como escolher entre os psicólogos da casa?",
        "Pelo que você procura. Francielle Machado Beria trabalha com terapia cognitivo-comportamental e neuropsicologia. Manuela Sinigaglia Vanti, com terapia cognitivo-comportamental. Augusto Kauer da Silveira, com psicologia do esporte. Na dúvida, descreva a situação no primeiro contato."
      ]
    ]
  },
  {
    "slug": "saude-integrativa",
    "nome": "Saúde integrativa",
    "marca": "ecooa.health",
    "titulo": "Cuidado integrativo, junto do acompanhamento clínico.",
    "sub": "Osteopatia, práticas ortomoleculares, reposição de nutrientes e terapias complementares, sempre em diálogo com o cuidado médico, nunca no lugar dele.",
    "meta": "Saúde integrativa em Porto Alegre: osteopatia adulto e infantil, práticas ortomoleculares, reposição de nutrientes e terapias complementares integradas ao cuidado clínico.",
    "intro": [
      "Dor nas costas que já virou rotina é uma queixa comum de quem procura esta área, e a história costuma se repetir: começou depois de um esforço ou de nada em especial, cedeu com repouso, voltou semanas depois. No caminho apareceu uma ressonância com hérnia de disco ou desgaste, e sobrou a dúvida de por que um exame antigo já mostrava quase a mesma coisa numa época sem dor. Outros chegam pelo joelho que reclama na escada, pelo cotovelo que dói ao segurar peso, por tendinite que voltou, por lombalgia que trava a manhã, por dor que desce pela perna.",
      "A osteopatia parte de uma pergunta diferente. Não é só onde dói, é o que o seu corpo está fazendo para conseguir se mover assim. Um joelho pode doer porque o quadril acima dele perdeu mobilidade. Dor de cabeça frequente pode ter relação com a região cervical e com a mandíbula. Postura que incomoda raramente se resolve com o conselho de sentar direito. A avaliação é do corpo em movimento e serve tanto para orientar o tratamento quanto para dizer quando o caso não é este: dor com febre, perda de força, dormência que avança ou dor noturna que não alivia pede médico antes.",
      "Na ecooa, em Moinhos de Vento, Porto Alegre, quem atende em osteopatia é Natálie Queiroz, osteopata e fisioterapeuta, CREFITO-5 271577-F, com atendimento de adultos e de bebês. Adriana atua como terapeuta integrativa, com terapia integrativa e biorressonância. A distinção importa: terapia integrativa é complementar. Soma ao acompanhamento que você já faz, não substitui consulta médica, não fecha diagnóstico e não é motivo para interromper tratamento em curso."
    ],
    "queixas": [
      "Dor nas costas que vai e volta há meses",
      "Dor lombar que trava na hora de levantar da cama",
      "Dor que desce pela perna e formiga",
      "Dor no joelho ao subir escada ou depois de correr",
      "Dor no cotovelo que piora ao segurar peso",
      "Tendinite que eu já tratei e voltou",
      "Dor de cabeça frequente, com tensão no pescoço e na mandíbula",
      "Postura que me incomoda na foto e no espelho",
      "Bebê inquieto, que chora muito e só sossega no colo",
      "Bebê que pega o peito de um lado só"
    ],
    "servicos": [
      [
        "Osteopatia para adultos",
        "Avaliação do corpo em movimento, com as mãos e testes de mobilidade, seguida de técnicas manuais e de orientação para o intervalo entre sessões. Para dor persistente e limitação já investigadas."
      ],
      [
        "Dor lombar e dor ciática",
        "Lombalgia, dor que desce pela perna e quadros com laudo de hérnia. A avaliação separa o que a imagem mostra do que limita o seu movimento hoje, e orienta o caminho, junto do médico quando o quadro pede."
      ],
      [
        "Dor no joelho, no cotovelo e no ombro",
        "Dores articulares e tendinites que voltam nem sempre têm origem no ponto que dói: sobrecarga, gesto repetido, mobilidade perdida em outra região. A avaliação olha a cadeia inteira."
      ],
      [
        "Dor de cabeça e queixas cervicais",
        "Dor de cabeça com componente cervical ou de mandíbula, inclusive em quem já convive com enxaqueca diagnosticada. O trabalho é sobre mobilidade e tensão dessa região, junto do médico quando as crises são frequentes ou intensas."
      ],
      [
        "Postura, escoliose e movimento",
        "Avaliação postural sem receita pronta. Inclui escoliose já conhecida, hábitos de trabalho e de treino, e exercícios de mobilidade escolhidos para o seu corpo. Escoliose em progressão pede médico junto."
      ],
      [
        "Osteopatia para bebês",
        "Bebês em adaptação depois do parto, com toque suave, sessão curta e no colo de quem acompanha. Procurada por famílias diante de desconforto, irritabilidade e preferência por virar a cabeça sempre para o mesmo lado, sempre somada ao acompanhamento do pediatra."
      ],
      [
        "Apoio à amamentação",
        "Quando a pega no peito é difícil de um lado, ou o bebê se incomoda em certa posição, a avaliação observa mobilidade de pescoço, mandíbula e tronco. Não substitui o pediatra nem a consultoria em amamentação, e caminha junto deles."
      ],
      [
        "Fisioterapia e exercícios",
        "Programa conduzido por fisioterapeuta, com progressão ajustada ao longo das semanas. A proposta é dar continuidade fora da sessão ao que foi trabalhado nela, porque parte do que alimenta a queixa mora em hábito, carga e rotina."
      ],
      [
        "Terapias integrativas e biorressonância",
        "Sessões conduzidas por terapeuta integrativa, com proposta de bem-estar e complemento ao cuidado que você já faz. Não são exame, não fecham diagnóstico e não substituem investigação clínica."
      ]
    ],
    "comoFunciona": [
      [
        "Primeiro contato pelo WhatsApp",
        "Você conta onde dói, há quanto tempo, o que piora e o que já tentou. Se for para bebê, conta a idade e o que acontece na mamada. A recepção informa horários, duração e valores no agendamento, antes de você marcar."
      ],
      [
        "A primeira sessão",
        "Presencial, em Moinhos de Vento. Começa por conversa e histórico, segue para a avaliação do corpo em movimento e testes com as mãos. Leve exames de imagem, roupa confortável e a lista dos medicamentos em uso."
      ],
      [
        "O que sai da avaliação",
        "A ideia é que você saia entendendo a hipótese do que gera a queixa, o que dá para trabalhar em sessão e o que depende de você fora daqui. Se o caso pedir médico, ortopedista ou pediatra, isso é dito ali."
      ],
      [
        "Retorno e acompanhamento",
        "O intervalo entre sessões é definido caso a caso, não por pacote fechado. No retorno se compara movimento, dor e função com a sessão anterior, e o plano continua, muda ou encerra. Alta também é resultado."
      ]
    ],
    "faq": [
      [
        "Quanto custa uma sessão de osteopatia?",
        "O valor depende do profissional e do tipo de avaliação, e é informado no agendamento, pelo WhatsApp, antes de você marcar. Cada profissional da ecooa é autônomo, define a própria agenda e os próprios honorários, então não existe tabela única."
      ],
      [
        "Osteopatia dói?",
        "O tratamento é conduzido conforme a tolerância de cada pessoa, e cada técnica é explicada antes de ser feita. Algumas manobras geram desconforto momentâneo em região já sensível, e é comum sentir o corpo dolorido no dia seguinte, parecido com depois de treino."
      ],
      [
        "Quantas sessões vou precisar?",
        "Não existe número definido antes de avaliar. Depende de há quanto tempo a queixa existe, do que a alimenta e do que você consegue mudar na rotina. A reavaliação acontece ao longo do caminho, e o plano é revisto conforme a resposta de cada sessão."
      ],
      [
        "Tem risco?",
        "Toda terapia manual tem. Dor nos dias seguintes é a reação mais comum. Algumas condições contraindicam certas técnicas, como fratura recente, osteoporose avançada, infecção e quadros neurológicos em evolução. É por isso que histórico, medicamentos e exames são perguntados antes."
      ],
      [
        "Preciso de encaminhamento ou de exame para agendar?",
        "Não. O agendamento é direto pelo WhatsApp. Se você já tem ressonância, raio X ou laudo, leve, porque ajuda a entender o contexto. E se a avaliação encontrar sinal que pede médico, você é encaminhado, mesmo tendo chegado com outra expectativa."
      ],
      [
        "Tenho hérnia de disco. Posso fazer osteopatia?",
        "Depende do quadro, e isso se decide na avaliação, não pelo laudo. Achado de imagem nem sempre explica a dor, e existe hérnia com sinais que pedem médico antes de terapia manual: perda de força, dormência que avança, alteração para urinar."
      ],
      [
        "Vocês atendem convênio?",
        "Cada profissional é autônomo e define como trabalha. Por isso essa pergunta é respondida caso a caso no agendamento, com a informação de quem você escolher atender, antes de marcar. A recepção verifica e retorna pelo WhatsApp."
      ],
      [
        "Atende online?",
        "A osteopatia é feita com as mãos e depende de presença. O primeiro contato e as dúvidas se resolvem pelo WhatsApp. Orientação e acompanhamento a distância, quando cabíveis, seguem as regras do conselho da profissão e são combinados diretamente com a profissional."
      ],
      [
        "Com que idade um bebê pode ser atendido?",
        "Bebês são atendidos ainda nas primeiras semanas de vida, com toque suave, sessão curta e no colo de quem acompanha, e cada passo é comunicado aos pais durante o atendimento. Isso não substitui o pediatra: febre, recusa de mamada e perda de peso pedem médico primeiro."
      ],
      [
        "Biorressonância diagnostica alguma coisa?",
        "Não. É uma prática complementar, sem valor diagnóstico, que não substitui consulta, exame laboratorial nem tratamento em curso. Quem procura busca uma abordagem de bem-estar somada ao cuidado clínico. Se a expectativa for diagnóstico ou cura, esse não é o caminho."
      ]
    ]
  }
];

export const DESTAQUES = {
  medicina: 'gustavo-gehrke',
  tricologia: 'danusa-pires',
  nutricao: 'jessica-stein',
  'estetica-facial': 'tais-de-la-rosa',
  'saude-mental': 'francielle-beria',
  'saude-integrativa': 'natalie-queiroz',
  'transplante-capilar': 'larissa-wiebbelling',
  'estetica-corporal': 'eduarda-schoenmeier',
};
