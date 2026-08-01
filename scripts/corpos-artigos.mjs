// Corpo dos artigos do editorial.
//
// Existe separado de deploy/dados-ecooa.js de propósito: aquele arquivo é
// carregado em TODAS as páginas do site, e catorze textos longos ali fariam o
// site inteiro carregar o conteúdo de uma página só. Aqui os textos vivem
// apenas em tempo de geração, e scripts/artigos.mjs os transforma em HTML
// estático dentro de cada deploy/blog/<slug>/index.html.
//
// Blocos aceitos: 'p' (parágrafo), 'h' (subtítulo) e 'destaque' (frase forte).
//
// Escrito na voz de quem assina cada texto e revisado por um guardião
// regulatório automático (CFM, COFEN, CFN, CFF, CRP, CFO) antes de entrar.
// A revisão final de quem assina segue pendente, conforme
// docs/mythos/PENDENCIAS-DO-DONO.md.

export const CORPOS = {
  "implante-hormonal-subcutaneo": [
    [
      "p",
      "O implante hormonal subcutâneo é uma via de administração, não um tratamento em si. Essa distinção parece técnica, mas muda tudo: a pergunta correta nunca é se o implante funciona, e sim se a reposição hormonal tem indicação para aquela pessoa, naquele momento, com aquele objetivo."
    ],
    [
      "h",
      "O que a via subcutânea muda"
    ],
    [
      "p",
      "O implante libera o hormônio de forma contínua ao longo de meses, o que evita os picos e vales de outras vias. Para algumas pessoas, isso significa mais estabilidade de sintomas. Para outras, a rigidez da via é uma desvantagem, porque ajustar a dose no meio do caminho é mais difícil do que com uma apresentação diária."
    ],
    [
      "destaque",
      "A via de administração se escolhe depois de decidir se há indicação. Nunca antes, e nunca como argumento de venda."
    ],
    [
      "h",
      "Quem tem indicação"
    ],
    [
      "p",
      "A avaliação parte de sintomas, história clínica, exames e objetivo. Andropausa e menopausa com repercussão real na vida da pessoa, quadros de deficiência documentada, e situações em que a via contínua traz vantagem sobre as demais. Não existe indicação por idade isolada, nem por exame isolado."
    ],
    [
      "p",
      "Há também as contraindicações, e elas são levadas a sério. Histórico oncológico hormônio dependente, eventos trombóticos, doença hepática ativa e algumas condições cardiovasculares mudam completamente a conversa."
    ],
    [
      "h",
      "O que se acompanha depois"
    ],
    [
      "p",
      "A colocação é o começo, não o fim. Exames de controle, revisão de sintomas e reavaliação da dose fazem parte do processo. Quem propõe um implante sem combinar o acompanhamento está entregando metade do cuidado."
    ],
    [
      "p",
      "Se você chegou até aqui procurando o procedimento, a consulta vai começar por outro lugar: entender o que está acontecendo com você. Às vezes a resposta é o implante. Às vezes é outra coisa, e dizer isso também faz parte."
    ]
  ],
  "canetas-emagrecedoras-nutricao": [
    [
      "p",
      "Os análogos de GLP-1 mudaram o cenário do emagrecimento nos últimos anos, e é honesto reconhecer isso. Também é honesto dizer o que eles não fazem, porque essa parte quase nunca aparece na conversa."
    ],
    [
      "h",
      "O que a medicação faz"
    ],
    [
      "p",
      "A classe atua sobre saciedade e esvaziamento gástrico. A pessoa come menos porque sente menos fome. É um efeito real e mensurável, prescrito por médico, com indicação, dose e acompanhamento definidos na consulta."
    ],
    [
      "h",
      "O que ela não faz"
    ],
    [
      "p",
      "Comer menos não é o mesmo que comer bem. Com apetite reduzido, o risco de ingestão proteica insuficiente é alto, e a perda de massa magra junto com a gordura é o desfecho mais comum quando ninguém acompanha a alimentação. Perder peso na balança perdendo músculo não é o objetivo de ninguém."
    ],
    [
      "destaque",
      "A pergunta que importa não é quantos quilos saíram. É de onde eles saíram, e o que acontece quando a medicação parar."
    ],
    [
      "p",
      "Também não se resolve sozinha a relação com a comida. Compulsão, alimentação emocional e histórico de dietas restritivas continuam ali, silenciados pelo apetite reduzido, prontos para voltar quando o efeito diminuir."
    ],
    [
      "h",
      "O que a nutrição sustenta"
    ],
    [
      "p",
      "Ingestão proteica adequada para preservar massa magra. Densidade nutricional, porque comer pouco torna cada refeição mais decisiva. Rotina que sobreviva ao fim do tratamento. E acompanhamento da composição corporal, não só do peso."
    ],
    [
      "p",
      "A medicação abre uma janela. O que se constrói dentro dela é o que decide se o resultado permanece."
    ]
  ],
  "queda-de-cabelo-causas": [
    [
      "p",
      "Quem chega ao consultório por queda de cabelo já passou meses observando isso sozinho. Contou fios no ralo, comparou uma foto antiga, trocou de xampu, tomou algum complexo vitamínico que alguém indicou. A dúvida que sobra é sempre a mesma: isso ainda é normal ou já passou do ponto de investigar. Ela não se responde no espelho. O couro cabeludo dá poucos sinais claros a olho nu, e os que dá costumam aparecer tarde."
    ],
    [
      "h",
      "Cair é normal. O que muda é o que volta"
    ],
    [
      "p",
      "Cada fio tem um ciclo próprio, com uma fase longa de crescimento, uma fase curta de repouso e a queda que abre espaço para o fio seguinte. Como esses ciclos são dessincronizados, perder fios todos os dias faz parte do funcionamento. Dois processos diferentes quebram esse equilíbrio. No eflúvio, algum evento empurra muitos folículos para o repouso ao mesmo tempo e a queda aparece em bloco, semanas depois. Na miniaturização, o folículo continua trabalhando, mas cada ciclo devolve um fio um pouco mais fino e mais curto que o anterior."
    ],
    [
      "p",
      "Eles assustam de formas opostas. O eflúvio faz barulho, derruba muito fio em pouco tempo e costuma preservar o folículo. A miniaturização é discreta, quase silenciosa, e costuma avançar sem chamar atenção. Por isso contar fios na escova diz pouco."
    ],
    [
      "destaque",
      "A pergunta clínica não é quantos fios caem por dia, é como voltam os fios que nascem no lugar."
    ],
    [
      "h",
      "A investigação começa pela linha do tempo"
    ],
    [
      "p",
      "Boa parte do raciocínio se decide antes de qualquer exame, na reconstrução dos meses anteriores. Cirurgia, infecção com febre prolongada, parto, dieta restritiva, perda de peso rápida, luto, troca ou suspensão de medicação. O eflúvio tem latência: o gatilho quase sempre está semanas ou poucos meses antes do dia em que a pessoa se assustou, e não no dia do susto. Sem essa reconstrução, a causa fica invisível. Entram também o padrão de rarefação, a velocidade da evolução, o histórico familiar e os sintomas locais. Ardência, coceira persistente ou dor no couro cabeludo mudam o raciocínio clínico, porque podem indicar um processo inflamatório que só a avaliação presencial identifica."
    ],
    [
      "h",
      "O que a tricoscopia acrescenta à avaliação"
    ],
    [
      "p",
      "A tricoscopia amplia o couro cabeludo e mostra o que a inspeção comum não alcança. Não é invasiva, não exige preparo e é feita na própria consulta. Ali se avalia a diversidade de calibre entre os fios de uma mesma área, a densidade, sinais de inflamação, descamação ao redor do folículo e a presença dos óstios foliculares, que são as aberturas por onde o fio emerge."
    ],
    [
      "p",
      "Esse último ponto sustenta a divisão central do diagnóstico capilar: alopecias em que o folículo está preservado e alopecias em que ele está sendo destruído. Onde o óstio desapareceu, não existe folículo para estimular, e o objetivo do tratamento deixa de ser recuperar densidade e passa a ser conter o avanço. Quando a tricoscopia deixa dúvida, ou quando o quadro não se comporta como o esperado, a biópsia do couro cabeludo entra. Não é rotina, é uma pergunta específica feita ao patologista."
    ],
    [
      "destaque",
      "Em alopecia cicatricial, o objetivo é interromper a perda, não recuperar o que já foi perdido."
    ],
    [
      "h",
      "O sangue mostra contexto, não fecha o diagnóstico"
    ],
    [
      "p",
      "Os exames laboratoriais são pedidos a partir da hipótese que a consulta levantou, não como lista fixa igual para todo mundo. Reservas de ferro, função da tireoide, avaliação nutricional, marcadores de perfil androgênico quando o quadro sugere. Eles raramente entregam o diagnóstico sozinhos. O que fazem é explicar por que o ciclo se desestabilizou, ou revelar uma condição que estava correndo em paralelo."
    ],
    [
      "p",
      "A frustração mais comum é a de quem volta com tudo dentro da normalidade e continua perdendo cabelo. Faixa de referência é populacional, não uma medida da demanda de um folículo em atividade, e essa leitura se faz no conjunto, nunca por número isolado. O inverso também acontece: um exame alterado que não é a causa da queda. Corrigir uma deficiência identificada em avaliação faz parte da conduta e ainda assim pode não resolver o que trouxe a pessoa até ali."
    ],
    [
      "h",
      "O que a investigação não resolve"
    ],
    [
      "p",
      "Exame não faz cabelo crescer. A investigação organiza a decisão e evita meses gastos com o alvo errado. Depois dela vem a parte lenta. O ciclo capilar responde em meses, não em semanas, e qualquer leitura séria exige tempo, foto padronizada e tricoscopia repetida nos mesmos pontos. Quem espera resposta em poucas semanas desiste cedo demais. Alguns tratamentos podem passar por uma fase inicial de aumento de queda, e quem não foi avisado abandona no pior momento. Outros agem enquanto são mantidos, porque contêm um processo sem eliminá-lo. Existem respostas parciais, que estabilizam sem devolver o que já se perdeu."
    ],
    [
      "p",
      "Há também os casos em que o caminho é outro. Queda por tração de penteados repetidos pede mudança de hábito antes de qualquer prescrição. O hábito de arrancar os próprios fios se trata com apoio em saúde mental, e insistir só na abordagem capilar não chega perto do problema. Doença sistêmica ativa vem primeiro. Áreas sem folículo viável deslocam a conversa para o campo cirúrgico, que é outra decisão. E existe a chance de a conduta correta ser não tratar nada, porque o quadro é autolimitado."
    ],
    [
      "h",
      "Tratar exige acompanhamento, não só prescrição"
    ],
    [
      "p",
      "Quando existe tratamento, ele precisa ser reavaliado em intervalos definidos, com a mesma metodologia de imagem do início, revisão laboratorial quando alguma deficiência foi corrigida, atenção a efeitos adversos e disposição para ajustar ou suspender diante de ausência de resposta. Adesão entra na conta sem julgamento: rotina complicada demais não se sustenta por anos. Um tratamento sem acompanhamento não pode ser julgado. Sem parâmetro de comparação, a impressão substitui o dado, e a impressão sobre o próprio cabelo é medida ruim: luz diferente, corte novo, fase do ciclo, tudo interfere."
    ],
    [
      "p",
      "Quem chega até aqui costuma carregar duas dúvidas que raramente aparecem em voz alta. A primeira é o medo de ouvir que é genético e que não há nada a fazer. A segunda é a suspeita de já ter perdido tempo demais. Nenhuma das duas se responde por texto. O que dá para dizer é que a origem genética, isolada, não define a conduta, que o prognóstico depende de qual alopecia é e de há quanto tempo ela avança, e que a variação entre casos torna qualquer recomendação genérica pouco útil."
    ],
    [
      "p",
      "Se a queda mudou de padrão, dura meses ou vem acompanhada de sintoma no couro cabeludo, vale procurar avaliação médica presencial, com exame do couro cabeludo. Uma avaliação individual não obriga ninguém a começar tratamento no mesmo dia. Ela serve para você entender o que está acontecendo e decidir com informação o que quer fazer a partir daí."
    ]
  ],
  "menopausa-tratamento-hormonal": [
    [
      "p",
      "Boa parte das mulheres que senta na minha frente para falar de menopausa não começa falando de menopausa. Começa falando do sono que quebra às três da manhã e não volta. Do calor que sobe do nada numa reunião. Do corpo que mudou sem que a rotina mudasse. Alguém disse que era da idade, e parou aí. A dúvida sobre hormônio vem depois, junto de duas informações contraditórias ouvidas de gente em quem ela confia."
    ],
    [
      "h",
      "O que está mudando por dentro"
    ],
    [
      "p",
      "A imagem comum é a de uma queda: os hormônios caem, os sintomas aparecem. É mais bagunçado que isso. Os ovários respondem cada vez menos ao estímulo do cérebro, os ciclos passam a acontecer sem ovulação e a progesterona cai antes. O estradiol não desce em linha reta: oscila, com picos às vezes maiores que antes e quedas em poucos dias. Por isso a perimenopausa costuma incomodar mais que a menopausa já estabelecida. O problema não é só ter pouco hormônio, é o sinal instável que regula temperatura, humor e sono."
    ],
    [
      "p",
      "Os efeitos aparecem onde existe receptor, e isso é quase todo lugar. No centro que regula a temperatura, e daí vêm os fogachos e os despertares que fragmentam a noite. No tecido vaginal e urinário, com ressecamento, dor na relação e infecções que voltam. No osso, com perda mais rápida nos anos em torno da última menstruação. E na composição corporal, com gordura migrando para o abdômen e sensibilidade à insulina piorando. No consultório, esse último item costuma ser lido como falta de disciplina. Nenhum desses sinais, isolado, define o que está acontecendo com quem o tem."
    ],
    [
      "h",
      "Quando o tratamento hormonal faz sentido"
    ],
    [
      "p",
      "A indicação mais sólida é também a mais simples: sintoma que atrapalha a vida. Fogacho e suor noturno que destroem o sono, sintomas geniturinários que doem e limitam. A pergunta não é se a mulher está na menopausa, é quanto essa transição está custando. Sintoma leve e sono preservado não viram indicação de hormônio só porque a idade chegou."
    ],
    [
      "p",
      "A segunda situação tem outra lógica: menopausa precoce e insuficiência ovariana prematura. Ali não se trata de aliviar sintoma, e sim de repor o que o corpo deixou de produzir cedo demais, pelo tempo em que produziria naturalmente, pelo impacto no osso e no sistema cardiovascular ao longo de décadas."
    ],
    [
      "p",
      "Existe ainda a proteção óssea em mulher com risco relevante de fratura, quando a terapia é opção razoável no quadro dela. E existe o fator tempo: quanto mais perto do fim dos ciclos, melhor tende a ser a relação entre benefício e risco. Começar muitos anos depois, com um sistema cardiovascular que já mudou, altera essa conta."
    ],
    [
      "destaque",
      "A pergunta clínica útil não é se a terapia hormonal é boa ou ruim. É se ela é adequada para aquela mulher, naquele momento, com aquela história."
    ],
    [
      "h",
      "Contraindicações, e o território cinzento"
    ],
    [
      "p",
      "Algumas situações fecham a porta com clareza: câncer de mama ou outro tumor dependente de hormônio, sangramento uterino sem causa esclarecida, trombose venosa ou embolia pulmonar, infarto e AVC, doença hepática ativa. Aí a resposta é não, e a conversa vira o que fazer com os sintomas. A ausência dessas condições, por outro lado, não equivale a liberação: ela apenas tira do caminho o que é proibitivo, e o resto continua dependendo de avaliação."
    ],
    [
      "p",
      "O território cinzento é maior. Enxaqueca com aura, pressão alta não controlada, tabagismo, obesidade, risco cardiovascular elevado, trombofilia na família. Nada disso é um não automático, mas muda a conversa e muitas vezes a forma de tratar, porque a via de administração altera o perfil de risco, sobretudo o trombótico, e a presença do útero exige proteger o endométrio. Por isso não publico protocolo: o que é seguro para uma mulher é o que precisa ser evitado na outra."
    ],
    [
      "p",
      "Existe também quem não pode e quem não quer, e as duas coisas são legítimas. Há opções não hormonais com evidência para os sintomas vasomotores, e há tratamento local para os sintomas geniturinários, com lógica de risco diferente da terapia sistêmica. Nenhuma dessas alternativas dispensa avaliação e prescrição."
    ],
    [
      "h",
      "O que a terapia hormonal não resolve"
    ],
    [
      "p",
      "Não é tratamento de obesidade. Digo isso porque é a expectativa que mais chega ao consultório. Ajustar hormônio pode melhorar sono, disposição e capacidade de treinar, e isso ajuda no resto. Mas não substitui comida adequada, treino de força e proteína suficiente. Quem começa esperando emagrecer pela reposição costuma terminar frustrada duas vezes."
    ],
    [
      "p",
      "Também não é protocolo de longevidade, e não trata apneia do sono, hipotireoidismo, anemia, depressão ou uma rotina que não permite dormir. Parte dos sintomas atribuídos à menopausa tem outra origem. Repor hormônio em quem tem apneia não tratada entrega pouco, e a conclusão errada costuma ser a de que o tratamento falhou."
    ],
    [
      "destaque",
      "Hormônio bem indicado pode devolver qualidade de vida. Hormônio usado como atalho para o que exige mudança de rotina só adia a conversa."
    ],
    [
      "h",
      "O que esperar nas primeiras semanas"
    ],
    [
      "p",
      "Fogachos e suor noturno costumam ser os primeiros a responder, em semanas. Os sintomas geniturinários levam mais tempo e exigem tratamento continuado, porque o tecido volta a ressecar quando o estímulo é retirado. Sono e humor costumam melhorar em parte por efeito direto, em parte porque a noite para de ser interrompida."
    ],
    [
      "p",
      "Nem tudo é confortável no início. Sensibilidade nas mamas, inchaço, náusea, dor de cabeça, escapes e sangramentos irregulares conforme o esquema. Boa parte desses efeitos melhora com o tempo ou com ajuste. O que não melhora pede reavaliação, não insistência. Quem não é avisada tende a abandonar o tratamento nas primeiras semanas achando que fez mal."
    ],
    [
      "p",
      "Há um custo de tempo que ninguém gosta de ouvir: a primeira escolha raramente é a definitiva, e existem retornos, reavaliação e rastreamento em dia antes e depois."
    ],
    [
      "h",
      "O que se acompanha depois"
    ],
    [
      "p",
      "O primeiro item é o sintoma que motivou o tratamento. Se ele não mudou, alguma coisa precisa mudar. Junto disso: pressão arterial, peso e circunferência abdominal, perfil metabólico quando faz sentido, e rastreamento ginecológico e mamográfico em dia. Sangramento inesperado nunca é normalizado, sempre é investigado."
    ],
    [
      "p",
      "Não existe data universal para parar. A decisão de continuar é revisitada de tempos em tempos, porque a mulher muda: envelhece, ganha ou perde risco cardiovascular, recebe novos diagnósticos. Continuar por inércia é tão ruim quanto interromper por medo genérico."
    ],
    [
      "p",
      "Se você chegou até aqui com mais dúvida do que começou, o texto cumpriu o papel. A resposta honesta depende da sua história, do seu risco e do que de fato está incomodando. Não tenho como dizer por texto se a terapia hormonal é adequada no seu caso, e nenhum texto tem. O que dá para afirmar é que a decisão merece avaliação individual, com tempo para pesar riscos que são seus, não os de uma média. É esse o trabalho de uma consulta: olhar o seu caso e chegar a um sim ou a um não que faça sentido."
    ]
  ],
  "longevidade-saudavel": [
    [
      "p",
      "Quem chega ao consultório falando de longevidade quase sempre chega com uma lista. Um suplemento visto num podcast, um exame de idade biológica, uma reposição hormonal que alguém jura ter mudado tudo. A pergunta por trás é sempre a mesma: disso tudo, o que muda alguma coisa de verdade? A resposta honesta separa três grupos que o marketing mistura. O que tem sustentação clínica. O que é plausível no mecanismo, mas ainda não demonstrado em pessoas. E o que é só comunicação bem feita."
    ],
    [
      "h",
      "Envelhecer é perder reserva"
    ],
    [
      "p",
      "O envelhecimento não chega como evento. Ele aparece como perda progressiva de reserva: massa e força muscular, capacidade cardiorrespiratória, controle de glicose e de pressão, densidade óssea, sono, cognição. Reserva é a margem entre o que o corpo consegue fazer e o que a vida exige dele. Enquanto sobra margem, envelhecer é invisível. Quando a margem encurta, uma pneumonia ou uma queda podem virar um divisor de águas."
    ],
    [
      "p",
      "A perda não acontece em compartimentos separados, e é aí que as listas erram. Menos músculo significa menos tecido disponível para captar glicose, o que tende a empurrar a insulina para cima. Insulina cronicamente alta favorece gordura visceral, e gordura visceral sustenta inflamação de baixo grau, que piora o perfil vascular e acelera a própria perda muscular. Um circuito que se retroalimenta. Por isso o que funciona raramente ataca um ponto só."
    ],
    [
      "destaque",
      "O que se protege em longevidade não é o número da idade. É a reserva funcional, que pesa no modo como se vivem os últimos anos."
    ],
    [
      "h",
      "O que tem sustentação é pouco fotogênico"
    ],
    [
      "p",
      "A parte mais bem estabelecida decepciona quem esperava novidade. Treino de força mantido por anos, capacidade cardiorrespiratória preservada, sono regular, controle de pressão, glicose e lipídios, não fumar, relação sóbria com álcool, gordura visceral controlada. Nada disso rende manchete. Tudo isso tem décadas de observação em população humana e age sobre aquele circuito em vários pontos."
    ],
    [
      "p",
      "Na simplificação se perde o que mais importa: a dose e o ponto de partida. Treino de força para quem nunca treinou, para quem tem lombalgia crônica e para quem já treina há dez anos não é a mesma coisa, e progressão mal calibrada é causa comum de lesão e de abandono. Esse ajuste fino não sai de artigo nenhum, e costuma ser trabalho conjunto com quem prescreve treino. A intervenção certa no corpo errado deixa de ser proteção."
    ],
    [
      "h",
      "O que ainda é hipótese"
    ],
    [
      "p",
      "Boa parte do que se vende sob a palavra longevidade vive em outro estágio de evidência. Moléculas que prolongam a vida de organismos simples em laboratório, precursores metabólicos, senolíticos, medicamentos usados fora da indicação original. O mecanismo costuma ser plausível, e alguns desses caminhos podem se confirmar. Mas plausibilidade não é demonstração, e nada disso é hoje tratamento consolidado para envelhecimento. Entre funcionar numa cultura de células e mudar a trajetória de uma pessoa por décadas existe uma distância que só o tempo atravessa."
    ],
    [
      "p",
      "A resposta nem sempre é não. Mas ela só se sustenta com produto regularizado, risco explícito na mesa, objetivo definido e clareza sobre o que ainda não se sabe. Quando alguém me traz uma dessas alternativas, minha primeira pergunta não é se funciona. É o que se espera que ela resolva, e se algo com mais sustentação já não daria conta."
    ],
    [
      "h",
      "Idade biológica e a armadilha do número"
    ],
    [
      "p",
      "Os testes que devolvem uma idade biológica atraem porque transformam um processo difuso em número. O problema é que ele depende do método, e métodos diferentes contam histórias diferentes sobre a mesma pessoa. Como estímulo para mudar hábito, pode ter valor. Como bússola isolada para decidir tratamento, não sustenta o peso que recebe."
    ],
    [
      "p",
      "O que acompanho ao longo do tempo é mais prosaico: composição corporal, força, pressão, metabolismo da glicose, perfil lipídico, sono, além do rastreamento adequado à idade e ao histórico familiar. São variáveis que respondem à intervenção. Monitorar demais também cobra: excesso de exame gera achado incidental, que gera investigação, que gera ansiedade."
    ],
    [
      "h",
      "Hormônio não é sinônimo de antienvelhecimento"
    ],
    [
      "p",
      "É o assunto que mais aparece nessa conversa, e o que mais confunde. Vários hormônios declinam com a idade. Esse fato, sozinho, não transforma reposição em estratégia de longevidade. A indicação nasce de outro lugar: deficiência documentada, repercussão clínica real, contraindicações afastadas e um objetivo verificável depois. Menopausa com sintomas que atrapalham a vida, hipotireoidismo, deficiência de testosterona com quadro compatível. Situações concretas, avaliadas caso a caso, não uma faixa etária."
    ],
    [
      "p",
      "Usar hormônio em quem não tem indicação muda a equação de risco e benefício sem entregar o que se prometeu. E, quando há indicação, a prescrição é o começo. Exames de controle, revisão de sintomas, reavaliação periódica da dose e das contraindicações, que mudam com o tempo. Plano hormonal sem acompanhamento combinado é meio tratamento."
    ],
    [
      "p",
      "Existe também o caminho inverso. Cansaço, queda de libido, ganho de peso e névoa mental viram assunto de hormônio quando a origem está em apneia do sono não diagnosticada, depressão, anemia, álcool ou um medicamento em uso. Nenhum desses sintomas aponta sozinho para uma causa, e essa separação se faz em avaliação, não por leitura de lista. Repor sem esse cuidado costuma dar uma melhora curta, que atrasa o diagnóstico certo. Dizer que o caminho é outro faz parte do trabalho."
    ],
    [
      "h",
      "O custo que não aparece no folheto"
    ],
    [
      "p",
      "Longevidade cobra em tempo antes de cobrar em dinheiro. Treino várias vezes por semana durante anos, sono protegido numa rotina que raramente colabora, comida que exige planejamento. E os primeiros meses raramente entregam o resultado visível que a pessoa imaginou. Composição corporal muda devagar, e a balança é um termômetro ruim, porque ganho de músculo e perda de gordura se anulam no número."
    ],
    [
      "p",
      "Vale dizer o que pode dar errado e o que isso não resolve. Progressão apressada machuca. Restrição exagerada custa músculo, o oposto do objetivo. Suplemento sem indicação soma despesa e às vezes interage com medicação em uso. E há um custo psíquico em transformar a vida em protocolo permanente, que costuma aparecer como cansaço de si mesmo. Nada disso reescreve genética, substitui o tratamento de uma doença instalada ou evita acidente. Longevidade funcional também não é a mesma agenda que envelhecimento estético da pele."
    ],
    [
      "destaque",
      "A pergunta útil não é o que acrescentar à lista. É o que você consegue sustentar pelos próximos dez anos."
    ],
    [
      "p",
      "Se você chegou até aqui com a lista ainda na mão, a dúvida provavelmente não diminuiu, só mudou de lugar. Deixou de ser se determinado suplemento funciona e virou onde está a sua maior perda de reserva hoje, e o que cabe na sua vida."
    ],
    [
      "p",
      "Isso não se responde por texto. Uma avaliação individual serve para ordenar: o que muda mais para você, o que pode esperar, o que não tem indicação e o que talvez precise de outro profissional antes de qualquer coisa que eu venha a propor. Se o caminho for mais simples do que o que você leu por aí, essa também é uma resposta."
    ]
  ],
  "equilibrio-hormonal-como-identificar": [
    [
      "p",
      "A pessoa raramente chega dizendo que está doente. Chega dizendo que está diferente. Dorme as mesmas horas e acorda sem descanso. Mantém a rotina de treino e de comida que funcionava há dois anos, e o corpo responde de outro jeito. O humor ficou mais curto. Antes de marcar consulta, ela já testou explicações: o trabalho, a idade, a fase. Às vezes é isso mesmo. Às vezes não é, e a diferença entre as duas hipóteses não se resolve no achismo."
    ],
    [
      "h",
      "Por que o sintoma quase nunca aponta para um hormônio só"
    ],
    [
      "p",
      "Hormônios não funcionam em compartimentos separados. A tireoide dita o ritmo metabólico. O cortisol responde à demanda, ao sono e ao estresse. A insulina governa como o corpo lida com energia. Os hormônios sexuais influenciam humor, massa muscular, libido e distribuição de gordura. Esses sistemas conversam entre si, e alteração em um deles costuma aparecer como ruído em outro."
    ],
    [
      "p",
      "É por isso que cansaço, gordura abdominal que não cede, sono ruim e libido baixa aparecem juntos com frequência. Não por terem causa única, mas por serem via final comum de coisas bem diferentes. O trabalho clínico é o inverso do que o sintoma sugere: em vez de perguntar qual hormônio explica o cansaço, perguntar o que, naquela pessoa, colocou o sistema nessa configuração."
    ],
    [
      "h",
      "O que a rotina explica de verdade"
    ],
    [
      "p",
      "Dívida de sono acumulada, restrição alimentar prolongada, treino sem recuperação proporcional, álcool com frequência, estresse crônico e alguns medicamentos de uso contínuo produzem um quadro muito parecido com o de uma deficiência hormonal. Não por coincidência: esses fatores mexem de fato na produção e no metabolismo dos hormônios."
    ],
    [
      "p",
      "Por isso a primeira parte da consulta é a chata e necessária: reconstruir o que mudou e quando. Em quem dorme cinco horas há meses e treina pesado, a explicação mais provável para o cansaço costuma estar aí, e o primeiro movimento tende a ser dormir, não coletar sangue. Investigar hormônio nesse contexto costuma encontrar números alterados que são consequência, e não causa. Tratar consequência tende a dar resultado curto, que some quando o estímulo original segue de pé."
    ],
    [
      "p",
      "A investigação ganha valor em dois cenários. Quando o óbvio foi corrigido e o quadro permanece. E quando há sinais que a rotina não explica: um ciclo menstrual que mudou de padrão, sintomas de instalação abrupta, achados no exame físico."
    ],
    [
      "destaque",
      "Exame hormonal não é diagnóstico. É informação, e informação só significa alguma coisa dentro da história de quem fez o exame."
    ],
    [
      "h",
      "Por que dois resultados iguais podem ter leituras diferentes"
    ],
    [
      "p",
      "O intervalo de referência de um laboratório descreve uma população, não uma pessoa. Na tireoide, olhar um marcador isolado pode deixar passar situações que já produzem sintoma. Em mulheres, a fase do ciclo em que o sangue foi coletado muda o resultado, e um exame colhido no dia errado responde a uma pergunta que ninguém fez. O cortisol varia ao longo do dia."
    ],
    [
      "p",
      "Um valor na borda da referência em alguém com sintomas consistentes merece leitura diferente do mesmo valor em alguém que está bem. Nada disso autoriza tratar número. Autoriza ler o número com contexto e, com frequência, repetir a coleta em condição adequada antes de concluir. Refazer exame não é insegurança do médico. É o que reduz a chance de iniciar um tratamento a partir de um resultado que era ruído."
    ],
    [
      "h",
      "O que a investigação hormonal não resolve"
    ],
    [
      "p",
      "Cansaço, libido baixa, ganho de peso e irritabilidade também vêm de anemia, apneia do sono, quadros depressivos, efeito de medicamentos em uso e doenças crônicas ainda não diagnosticadas. Em parte dos casos, o achado mais importante não é hormonal, e o caminho passa por outra especialidade. Dizer isso faz parte do trabalho."
    ],
    [
      "p",
      "Hormônio não corrige higiene de sono. Não resolve uma relação com comida construída ao longo de anos. Não substitui o tratamento de um quadro depressivo, e pode mascarar por algumas semanas algo que precisava de outro cuidado. Quando há indicação real e acompanhamento, a intervenção hormonal tem objetivos clínicos definidos, e a resposta de cada pessoa é avaliada ao longo do tempo. Quando é usada para cobrir o que não é hormonal, pode atrasar o tratamento adequado e acrescentar risco sem contrapartida."
    ],
    [
      "h",
      "O que costuma incomodar antes de começar"
    ],
    [
      "p",
      "A primeira é o tempo. É raro que uma consulta feche o assunto. O percurso comum envolve avaliação, exames, retorno para interpretar em conjunto e, às vezes, nova coleta em condição melhor. Semanas, não dias. Quem procura resposta imediata costuma sair frustrado do primeiro encontro, e prefiro dizer isso antes."
    ],
    [
      "p",
      "A segunda é a expectativa sobre o desfecho. Nem toda alteração encontrada termina em reposição hormonal. Em muitos casos a conduta é tratar a tireoide, corrigir uma deficiência nutricional, reorganizar sono e treino e reavaliar meses depois. Isso não é uma resposta menor. Costuma ser a resposta certa."
    ],
    [
      "p",
      "A terceira é o que a pessoa vai sentir se houver tratamento. Existe uma fase de adaptação, nem sempre confortável. Mudanças no sono, oscilação de humor e retenção de líquido são reações possíveis enquanto o organismo recalibra, e costumam se organizar com tempo ou ajuste. Saber disso antes ajuda a evitar dois erros: tomar adaptação por fracasso e abandonar cedo, ou normalizar um sintoma que precisava ser reavaliado logo."
    ],
    [
      "h",
      "Tratamento hormonal exige acompanhamento, não apenas prescrição"
    ],
    [
      "p",
      "Quando existe indicação e o tratamento começa, começa junto um plano de reavaliação. Isso inclui acompanhar a resposta clínica, que é o que a pessoa relata sentir, repetir exames em intervalos definidos caso a caso, monitorar marcadores de segurança apropriados ao perfil de cada pessoa e revisar a conduta com o tempo. A necessidade do corpo muda com idade, peso, sono e outros tratamentos. O que estava adequado no começo pode não estar um ano depois."
    ],
    [
      "p",
      "Por isso, antes de iniciar, faço uma pergunta bem prática: dá para você voltar? Se o momento de vida não permite esse acompanhamento, é mais honesto adiar do que começar algo que vai ficar pela metade."
    ],
    [
      "destaque",
      "Começar é a parte fácil. O que sustenta a segurança de um tratamento hormonal ao longo do tempo é o retorno, e ele não é opcional."
    ],
    [
      "p",
      "Reconhecer o que está descrito acima não significa que seus hormônios estão desregulados. Também não significa que está tudo certo e é só cansaço da rotina. Significa que existe uma pergunta legítima sem resposta, e ela não se responde por texto nem por um exame isolado pedido por conta própria."
    ],
    [
      "p",
      "O que dá para dizer com honestidade é que a investigação vale quando parte de história clínica, exame físico e exames lidos em conjunto, e que pode terminar em tratamento hormonal ou na conclusão de que o caminho é outro. As duas saídas são úteis, porque as duas transformam uma queixa vaga em conduta definida. Se quiser entender o que acontece no seu caso, a avaliação individual existe para isso, sem pressa e sem desfecho definido antes de olhar."
    ]
  ],
  "saude-mental-emagrecimento": [
    [
      "p",
      "Você provavelmente já sabe o que deveria comer. Já teve um plano na mão, talvez vários, e conseguiu seguir por um tempo. O que traz alguém ao consultório não é falta de informação, é a distância entre saber e sustentar. A pessoa emagrece, mantém por alguns meses, e um ano depois está no ponto de partida com a impressão de ter reprovado num teste de caráter. Muitas vezes o que falhou não foi a dieta em si. Foi o que ninguém olhou junto com ela."
    ],
    [
      "h",
      "A balança responde uma pergunta só"
    ],
    [
      "p",
      "O número mede massa corporal total naquele instante. Varia com hidratação, conteúdo intestinal, fase do ciclo menstrual, sal da noite anterior, treino do dia. Não separa músculo de gordura e não informa nada sobre o que aconteceu entre as refeições."
    ],
    [
      "p",
      "Na avaliação clínica, o que diz mais sobre o rumo do caso não é o peso, é o padrão em volta dele. Quantas horas passam entre uma refeição e outra. O que acontece depois que uma regra é quebrada. Se a pessoa pesa todo dia e deixa o humor da manhã depender do resultado. Isso é comportamento: observável e modificável. O peso é consequência, e uma consequência lenta."
    ],
    [
      "h",
      "Por que a dieta isolada costuma falhar"
    ],
    [
      "p",
      "O primeiro mecanismo é o mais direto. Restrição rígida tende a produzir privação, a privação aumenta o valor do alimento proibido, e o alimento proibido uma hora aparece. Quanto mais estrita a regra, mais forte costuma ser a queda quando ela cede. Não é fraqueza, é um efeito comum de como o comportamento se organiza sob restrição."
    ],
    [
      "p",
      "O segundo mecanismo é menos falado e importa mais. Comer costuma cumprir uma função além de nutrir. Encerra o dia, baixa a tensão, dá cinco minutos em que ninguém pede nada. Quando se retira esse recurso sem colocar outro no lugar, sobra um buraco funcional. O plano funciona enquanto a vida coopera. A primeira semana ruim revela a estrutura."
    ],
    [
      "p",
      "O terceiro é o modo de pensar em tudo ou nada. Um desvio vira \"já estraguei o dia\", o dia estragado vira um episódio maior, o episódio vira culpa e a culpa vira mais restrição amanhã. O ciclo se alimenta sozinho. É exatamente nesse ponto que a terapia cognitivo-comportamental tem o que fazer."
    ],
    [
      "destaque",
      "Enquanto comer for a forma mais rápida de encerrar um dia difícil, o cardápio sozinho tende a não dar conta dessa parte."
    ],
    [
      "h",
      "O que a terapia cognitivo-comportamental faz, na prática"
    ],
    [
      "p",
      "O trabalho começa observando, não mudando. Nas primeiras semanas o foco é registrar o que acontece antes, durante e depois dos episódios que incomodam. Não contagem de calorias: contexto, horário, estado emocional, pensamento que passou na hora. Isso frustra quem quer começar na segunda-feira. Sem esse mapa, a intervenção vira palpite."
    ],
    [
      "p",
      "Com o padrão identificado, o trabalho corre em duas frentes ao mesmo tempo. Uma é comportamental: regularidade das refeições, redução das janelas de vulnerabilidade, reaproximação gradual de alimentos que viraram território proibido, sempre dentro do acompanhamento e alinhada com a nutrição quando existe plano alimentar em curso. A outra é cognitiva: testar as regras que a pessoa carrega sobre comida, sobre o corpo e sobre si mesma. \"Não tenho disciplina\" é uma hipótese, não um fato, e costuma não se sustentar quando olhamos as outras áreas da vida dessa pessoa."
    ],
    [
      "p",
      "Isso custa tempo. Em geral sessões semanais no início, tarefas entre as sessões e uma fase em que as mudanças, quando aparecem, aparecem primeiro no comportamento e só depois em alguma medida corporal. É uma fonte comum de desânimo no meio do processo."
    ],
    [
      "h",
      "Não existe protocolo único, porque não é um quadro único"
    ],
    [
      "p",
      "Quem come bem o dia inteiro e perde o controle à noite, depois de onze horas de trabalho, é um caso clínico diferente de quem tem episódios com sensação real de perda de controle. E os dois são diferentes de quem sofre principalmente com a imagem corporal e continuaria sofrendo em qualquer peso. Há ainda situações em que o ganho de peso pode ter componente clínico envolvido, o que só a avaliação médica tem como verificar: uso de certas medicações, alterações hormonais, sono fragmentado, dor que limita movimento."
    ],
    [
      "p",
      "Cada cenário pede uma sequência diferente de intervenção, e às vezes pede outro profissional antes de mim. É para isso que serve a avaliação individual, e é por isso que nenhum texto substitui ela. Se reconhecer numa descrição é começo de conversa, não é diagnóstico."
    ],
    [
      "h",
      "O que a terapia não resolve"
    ],
    [
      "p",
      "Trabalho psicológico não substitui acompanhamento nutricional nem médico. Eu não prescrevo plano alimentar, não conduzo investigação laboratorial e não trato clinicamente obesidade. Quando o caso pede plano alimentar, é com a nutrição. Quando há suspeita de fator clínico, é com a medicina. Essa articulação não é detalhe de organização: na clínica, orientação contraditória vinda de lados diferentes aparece com frequência entre os motivos de abandono de tratamento."
    ],
    [
      "p",
      "Há também situações em que o caminho começa em outro lugar. Restrição importante, comportamentos compensatórios, perda de peso rápida, sinais de risco clínico. Nada disso se conclui pela leitura de um texto, e sim em avaliação com profissional. Nesses casos a psicoterapia continua, mas o acompanhamento médico entra junto e o peso deixa de ser o objetivo do tratamento. E existe uma possibilidade que precisa ser dita: um trabalho bem conduzido pode terminar com uma relação estável com a comida e uma mudança de peso menor do que a esperada. Descobrir que a expectativa inicial era irreal às vezes faz parte do resultado."
    ],
    [
      "destaque",
      "Nem todo tratamento psicológico bem conduzido termina com um número menor. Alguns terminam com um dia que não gira mais em torno da comida."
    ],
    [
      "h",
      "O que precisa ser acompanhado depois"
    ],
    [
      "p",
      "A parte final do trabalho costuma ser a prevenção de recaída: identificar os contextos de maior risco, decidir antes o que fazer neles e espaçar as sessões aos poucos, em vez de encerrar de uma vez. Os sinais de retorno do padrão antigo são comportamentais e costumam aparecer cedo. Pular refeições de novo, voltar a pesar todo dia, compensar depois de um exagero, evitar situações sociais que envolvem comida. Em geral vêm antes de qualquer alteração de peso, o que dá margem para corrigir a rota."
    ],
    [
      "p",
      "Quando existe tratamento medicamentoso para obesidade indicado e conduzido por médico, o trabalho comportamental não perde função. Se o apetite diminui, muda a pressão fisiológica; o repertório aprendido e o que a pessoa faz quando a tensão aparece seguem os mesmos. O momento de ajuste ou de interrupção, que é decisão do médico que acompanha, é justamente quando ter outro repertório conta."
    ],
    [
      "p",
      "Se você leu até aqui, é provável que já tenha tentado mais de uma vez. A pergunta que sobra não é sobre força de vontade. É se existe alguma coisa diferente para olhar dessa vez. Isso eu não tenho como responder por um texto. Uma primeira conversa serve para entender o que está acontecendo no seu caso, o que faz sentido tratar primeiro e, com honestidade, se o caminho é comigo, com outro profissional, ou com mais de um. Dizer isso na primeira sessão também é parte do trabalho."
    ]
  ]
};
