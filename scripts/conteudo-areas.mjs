// Conteúdo editorial das 8 páginas de especialidade.
//
// Escrito em 2026-07-31 conforme a entrevista com o dono: estrutura completa
// (hero tipográfico, queixas, serviços, profissionais da área, FAQ, CTA), tom
// claro com a técnica explicada, FAQ com a pergunta de preço respondida sem
// valores, e nenhuma promessa de resultado. As listas de serviços foram
// redigidas a partir das áreas de atuação declaradas dos 31 profissionais e
// AGUARDAM REVISÃO do dono, página a página.

export const AREAS = [
  {
    slug: 'medicina',
    nome: 'Medicina',
    marca: 'ecooa.med',
    titulo: 'Medicina integrada em Porto Alegre.',
    sub: 'Investigação clínica com tempo de consulta de verdade: metabolismo, hormônios, emagrecimento, longevidade e doenças crônicas, com exames lidos e explicados.',
    meta: 'Médicos em Moinhos de Vento, Porto Alegre: medicina metabólica, saúde hormonal, emagrecimento, longevidade, dermatologia e check-up com interpretação de exames. Agende avaliação.',
    queixas: [
      'Cansaço, sono ruim ou queda de energia que os exames de rotina não explicam',
      'Dificuldade para emagrecer mesmo com dieta e treino',
      'Suspeita de desequilíbrio hormonal, menopausa ou andropausa',
      'Exames alterados que ninguém sentou para explicar',
      'Doença crônica que precisa de acompanhamento próximo',
      'Vontade de envelhecer com saúde, prevenindo antes de tratar',
    ],
    servicos: [
      [
        'Consulta de medicina metabólica',
        'Avaliação ampla de metabolismo, composição corporal e histórico para entender a causa antes de definir conduta.',
      ],
      [
        'Saúde hormonal',
        'Investigação de queixas hormonais femininas e masculinas, incluindo tireoide, menopausa e reposição quando houver indicação.',
      ],
      [
        'Emagrecimento com acompanhamento médico',
        'Estratégia individualizada, incluindo avaliação de medicamentos para controle de peso, as chamadas canetas emagrecedoras, quando indicados.',
      ],
      [
        'Longevidade e performance',
        'Plano de prevenção e desempenho físico e cognitivo baseado em exames e rotina real.',
      ],
      [
        'Interpretação detalhada de exames',
        'Leitura explicada de exames laboratoriais, com o porquê de cada marcador.',
      ],
      [
        'Dermatologia clínica e estética',
        'Diagnóstico e tratamento de doenças da pele, com dermatologistas com RQE.',
      ],
      [
        'Acompanhamento de doenças crônicas',
        'Diabetes, colesterol, hipertensão e outras condições que pedem constância e revisão.',
      ],
    ],
    faq: [
      [
        'Quanto custa uma consulta médica na ecooa?',
        'O valor varia conforme o profissional e o tipo de avaliação, e é informado no agendamento pelo WhatsApp. Cada médico da ecooa é autônomo e define a própria agenda e os próprios honorários.',
      ],
      [
        'A primeira consulta inclui pedido de exames?',
        'Na maioria dos casos, sim. A avaliação começa pela sua história e pelo que você já tentou; os exames complementam a investigação e são lidos com você no retorno.',
      ],
      [
        'Vocês atendem por convênio?',
        'O atendimento é particular. A recepção orienta sobre recibo para reembolso junto ao seu plano, quando o seu contrato prevê essa possibilidade.',
      ],
      [
        'Posso ser atendido online?',
        'Vários médicos da casa atendem também por telemedicina. Na indicação do profissional, o formato aparece junto do perfil.',
      ],
    ],
  },
  {
    slug: 'estetica-facial',
    nome: 'Estética facial',
    marca: 'ecooa.esthetic',
    titulo: 'Estética facial com avaliação antes do procedimento.',
    sub: 'Harmonização, toxina botulínica, preenchimento, bioestimuladores e cuidado com a pele, com indicação honesta: às vezes o melhor procedimento é o que não se faz.',
    meta: 'Estética facial em Moinhos de Vento, Porto Alegre: harmonização facial, toxina botulínica, preenchimento, bioestimuladores, skinbooster e protocolos de pele, com avaliação criteriosa.',
    queixas: [
      'Linhas de expressão e rugas que incomodam no espelho ou nas fotos',
      'Perda de contorno ou de volume no rosto com o passar dos anos',
      'Manchas, melasma, acne e cicatrizes de acne',
      'Flacidez facial e perda de viço da pele',
      'Vontade de um resultado natural, sem rosto artificial',
    ],
    servicos: [
      [
        'Avaliação facial completa',
        'Análise da pele, das proporções e do seu objetivo antes de qualquer indicação.',
      ],
      [
        'Toxina botulínica',
        'Suavização de linhas de expressão com dose e pontos planejados para preservar a naturalidade.',
      ],
      [
        'Preenchimento com ácido hialurônico',
        'Reposição de volume e contorno em lábios, olheiras, mento e mandíbula, quando indicado.',
      ],
      [
        'Bioestimuladores de colágeno',
        'Estímulo gradual da produção de colágeno para firmeza e qualidade de pele.',
      ],
      [
        'Skinbooster e protocolos de pele',
        'Hidratação injetável, peelings e tecnologias para textura, poros e manchas.',
      ],
      [
        'Harmonização facial planejada',
        'Combinação de técnicas em etapas, respeitando a anatomia e o tempo de cada rosto.',
      ],
    ],
    faq: [
      [
        'Quanto custam os procedimentos faciais?',
        'Depende da indicação, da quantidade de produto e do profissional. O valor é apresentado na avaliação, sem surpresa e sem pacote fechado antes de te conhecer.',
      ],
      [
        'O resultado fica artificial?',
        'O compromisso da casa é com a naturalidade: dose certa, no lugar certo, na hora certa. Quando o pedido não tem indicação técnica, o profissional explica o porquê e propõe alternativas.',
      ],
      [
        'Dói? Preciso de repouso?',
        'A maioria dos procedimentos injetáveis usa anestésico tópico e permite voltar à rotina no mesmo dia, com orientações simples de cuidado.',
      ],
      [
        'Quem realiza os procedimentos?',
        'Profissionais habilitados de medicina, biomedicina, farmácia e odontologia, cada um respondendo tecnicamente pelo próprio trabalho, com registro de classe exibido no perfil.',
      ],
    ],
  },
  {
    slug: 'estetica-corporal',
    nome: 'Estética corporal',
    marca: 'ecooa.esthetic',
    titulo: 'Estética corporal, planejada em etapas.',
    sub: 'Contorno corporal, gordura localizada, celulite e flacidez, com plano realista e, quando faz sentido, em conjunto com nutrição e medicina.',
    meta: 'Estética corporal em Moinhos de Vento, Porto Alegre: contorno corporal, gordura localizada, celulite, flacidez e protocolos combinados com nutrição. Avaliação criteriosa.',
    queixas: [
      'Gordura localizada que resiste a treino e dieta',
      'Celulite e irregularidades na pele',
      'Flacidez corporal, principalmente após emagrecimento ou gestação',
      'Vontade de tratar o corpo como parte de um plano, não como promessa isolada',
    ],
    servicos: [
      [
        'Avaliação corporal',
        'Análise de composição corporal, pele e objetivo para montar um plano por etapas.',
      ],
      [
        'Protocolos para gordura localizada',
        'Tecnologias e procedimentos escolhidos conforme a região e a resposta do seu corpo.',
      ],
      [
        'Tratamento de celulite e flacidez',
        'Combinação de estímulos para firmeza e qualidade da pele.',
      ],
      [
        'Integração com nutrição e medicina',
        'Quando o objetivo envolve emagrecimento, o plano corporal caminha junto com o acompanhamento clínico.',
      ],
    ],
    faq: [
      [
        'Quanto custa um protocolo corporal?',
        'O valor depende da região tratada, do número de sessões e do profissional. Tudo é apresentado na avaliação, e você decide com calma.',
      ],
      [
        'Em quanto tempo vejo diferença?',
        'Depende do estímulo e da resposta do seu organismo. O que garantimos é honestidade no plano: metas possíveis, revisadas a cada etapa, sem prazo mágico.',
      ],
      [
        'Procedimento corporal substitui emagrecimento?',
        'Não. Estética corporal trata contorno e pele; peso e metabolismo são trabalho de nutrição e medicina. Na ecooa as áreas conversam entre si.',
      ],
    ],
  },
  {
    slug: 'tricologia',
    nome: 'Tricologia',
    marca: 'ecooa.esthetic',
    titulo: 'Tricologia: investigar o cabelo antes de tratar.',
    sub: 'Queda de cabelo, alopecias, afinamento dos fios e saúde do couro cabeludo, do diagnóstico médico à tricologia estética e aos testes genéticos.',
    meta: 'Tricologia em Porto Alegre: diagnóstico de queda de cabelo, alopecia, tratamento capilar médico e estético, teste genético capilar e terapias de fortalecimento dos fios.',
    queixas: [
      'Queda de cabelo acima do normal, aguda ou arrastada',
      'Afinamento dos fios e perda de densidade, com couro cabeludo aparecendo',
      'Falhas, entradas e alopecias em investigação',
      'Caspa, dermatite seborreica e queixas do couro cabeludo',
      'Tratamentos anteriores sem resposta clara',
    ],
    servicos: [
      [
        'Consulta de tricologia médica',
        'Investigação da causa da queda com médica tricologista: exame clínico, tricoscopia e exames laboratoriais quando indicados.',
      ],
      [
        'Diagnóstico e tratamento de alopecias',
        'Alopecia androgenética, areata, eflúvios e alopecias cicatriciais, cada uma com conduta própria.',
      ],
      [
        'Tricologia estética',
        'Protocolos de fortalecimento, densidade e qualidade dos fios, conduzidos sessão a sessão.',
      ],
      [
        'Teste genético capilar',
        'Mapa individual de características que ajudam a direcionar o tratamento com mais precisão, interpretado junto com a avaliação clínica.',
      ],
      [
        'Terapias de reposição de nutrientes',
        'Suporte de vitaminas e minerais quando a investigação mostra deficiência.',
      ],
      [
        'Acompanhamento de minoxidil e medicações',
        'Uso orientado e monitorado, em integração com o médico responsável.',
      ],
    ],
    faq: [
      [
        'Quanto custa um tratamento capilar?',
        'Varia conforme a investigação e o protocolo indicado. O valor é informado na avaliação; nenhum plano é fechado antes de entender a causa da sua queda.',
      ],
      [
        'Toda queda de cabelo tem tratamento?',
        'Toda queda tem investigação. A maioria das causas tem conduta eficaz quando identificada cedo; por isso a avaliação vem antes de qualquer promessa.',
      ],
      [
        'Em quanto tempo o cabelo responde?',
        'O ciclo do fio é lento: a resposta costuma ser avaliada em janelas de três a seis meses, com registro fotográfico e revisão do plano.',
      ],
      [
        'Qual a diferença entre tricologia médica e estética?',
        'A médica diagnostica e trata doenças do cabelo e do couro cabeludo. A estética cuida da força, densidade e qualidade dos fios. Na ecooa as duas trabalham juntas.',
      ],
    ],
  },
  {
    slug: 'transplante-capilar',
    nome: 'Transplante capilar',
    marca: 'ecooa.esthetic',
    titulo: 'Transplante capilar com critério de indicação.',
    sub: 'Avaliação honesta de área doadora e receptora, técnica sem raspagem e com fio longo, transplante de barba e sobrancelha, do planejamento ao pós-operatório.',
    meta: 'Transplante capilar em Porto Alegre: avaliação de indicação, técnica FUE sem raspagem, fio longo, transplante de barba e sobrancelha, com acompanhamento completo.',
    queixas: [
      'Entradas e calvície estabilizada que incomodam',
      'Falhas na barba ou na sobrancelha',
      'Vontade de transplante, mas dúvida se há indicação',
      'Preocupação em preservar a aparência durante o processo',
    ],
    servicos: [
      [
        'Avaliação de indicação',
        'Análise da área doadora, da área receptora, do padrão de queda e da viabilidade real do procedimento para o seu caso.',
      ],
      [
        'Transplante capilar masculino e feminino',
        'Planejamento de linha e densidade compatíveis com a sua idade e com a evolução natural do quadro.',
      ],
      [
        'Técnica sem raspagem e com fio longo',
        'Para quem precisa preservar a aparência dos cabelos durante o processo.',
      ],
      ['Transplante de barba e de sobrancelha', 'Desenho individualizado, fio a fio.'],
      [
        'Pré e pós-operatório acompanhados',
        'Orientação completa antes, e revisões programadas depois, até a avaliação do resultado.',
      ],
    ],
    faq: [
      [
        'Quanto custa um transplante capilar?',
        'O valor depende da extensão da área e da técnica, e é apresentado na avaliação. Desconfie de preço fechado sem avaliação: cada caso tem um planejamento próprio.',
      ],
      [
        'Todo mundo pode fazer transplante?',
        'Não. Há critérios clínicos, e existem quadros em que o tratamento certo é outro. Quando não há indicação, a médica diz, e aponta o caminho clínico adequado.',
      ],
      [
        'Quando o resultado aparece?',
        'Os fios transplantados passam por um ciclo natural de queda e crescimento; a avaliação do resultado costuma acontecer ao longo de doze meses, com acompanhamento programado.',
      ],
    ],
  },
  {
    slug: 'nutricao',
    nome: 'Nutrição',
    marca: 'ecooa.med',
    titulo: 'Nutrição ajustada à sua rotina real.',
    sub: 'Doze nutricionistas com focos diferentes: emagrecimento, hipertrofia, nutrição clínica, esportiva, materno-infantil, vegetariana e comportamental.',
    meta: 'Nutricionista em Moinhos de Vento, Porto Alegre: emagrecimento, hipertrofia, nutrição clínica, esportiva, vegetariana, materno-infantil e comportamental. Presencial e online.',
    queixas: [
      'Emagrecer sem viver de dieta restritiva',
      'Ganhar massa muscular com estratégia',
      'Organizar a alimentação da família, da gestação à infância',
      'Alimentação vegetariana ou vegana bem planejada',
      'Compulsão e relação difícil com a comida',
      'Suporte nutricional a quem usa medicação para emagrecer',
    ],
    servicos: [
      [
        'Nutrição clínica',
        'Avaliação completa com plano possível de sustentar, revisado a cada retorno.',
      ],
      [
        'Emagrecimento',
        'Estratégia individual, incluindo acompanhamento de quem usa canetas emagrecedoras com prescrição médica.',
      ],
      [
        'Hipertrofia e nutrição esportiva',
        'Alimentação e suplementação para ganho de massa e performance.',
      ],
      [
        'Nutrição materno-infantil',
        'Gestantes, tentantes e crianças, com introdução alimentar orientada.',
      ],
      [
        'Nutrição vegetariana e vegana',
        'Planejamento completo de nutrientes, por quem vive a prática há mais de dez anos.',
      ],
      [
        'Nutrição comportamental',
        'Trabalho sobre a relação com a comida, sem terrorismo nutricional.',
      ],
      [
        'Interpretação de exames bioquímicos',
        'Leitura nutricional dos seus exames, integrada ao acompanhamento médico quando houver.',
      ],
    ],
    faq: [
      [
        'Quanto custa a consulta com nutricionista?',
        'Cada nutricionista da casa é autônomo e define os próprios honorários; o valor é informado no agendamento. Há opções de consulta avulsa e de acompanhamento.',
      ],
      [
        'Em quanto tempo vejo resultado?',
        'Depende do objetivo e da constância. O compromisso é com um plano que caiba na sua rotina e seja ajustado nos retornos, não com prazo milagroso.',
      ],
      [
        'Preciso cortar tudo o que gosto?',
        'Não. O plano parte do que você come hoje e do que consegue sustentar. Restrição sem contexto não se mantém, e o que não se mantém não funciona.',
      ],
      [
        'Atendem online?',
        'Sim, boa parte da equipe atende também online, com o mesmo padrão de avaliação e acompanhamento.',
      ],
    ],
  },
  {
    slug: 'saude-mental',
    nome: 'Saúde mental',
    marca: 'ecooa.mind',
    titulo: 'Saúde mental com escuta sem pressa.',
    sub: 'Psicologia clínica para ansiedade, depressão, luto, autoestima e transições de vida, em um espaço pensado para o silêncio e o acolhimento.',
    meta: 'Psicólogos em Moinhos de Vento, Porto Alegre: psicoterapia para ansiedade, depressão, burnout, luto e autoestima. Atendimento presencial e online, com sigilo e acolhimento.',
    queixas: [
      'Ansiedade que atrapalha o dia, o sono e as decisões',
      'Tristeza persistente, desânimo ou suspeita de depressão',
      'Esgotamento e burnout',
      'Luto, separação e transições difíceis',
      'Autoestima e relação com o próprio corpo',
      'Vontade de se entender melhor, mesmo sem uma queixa fechada',
    ],
    servicos: [
      [
        'Psicoterapia individual adulto',
        'Processo conduzido no seu ritmo, com abordagem explicada na primeira conversa.',
      ],
      [
        'Atendimento online',
        'Sessões por vídeo com o mesmo sigilo e a mesma estrutura do presencial.',
      ],
      [
        'Apoio em processos de emagrecimento',
        'A dimensão emocional do peso, junto das equipes de nutrição e medicina quando você quiser.',
      ],
      [
        'Encaminhamento integrado',
        'Quando o caso pede avaliação psiquiátrica ou clínica, a indicação é feita com transparência.',
      ],
    ],
    faq: [
      [
        'Quanto custa a sessão de psicoterapia?',
        'O valor é definido por cada psicóloga e informado no agendamento. A primeira conversa serve também para combinar frequência e formato.',
      ],
      [
        'Como sei se preciso de terapia?',
        'Se alguma questão está ocupando espaço demais na sua vida, já vale uma primeira conversa. Não é preciso ter um diagnóstico para começar.',
      ],
      [
        'O atendimento é sigiloso?',
        'Sim. O sigilo é dever ético da psicologia e compromisso da casa, no presencial e no online.',
      ],
    ],
  },
  {
    slug: 'saude-integrativa',
    nome: 'Saúde integrativa',
    marca: 'ecooa.med',
    titulo: 'Cuidado integrativo, junto do acompanhamento clínico.',
    sub: 'Osteopatia, práticas ortomoleculares, reposição de nutrientes e terapias complementares, sempre em diálogo com o cuidado médico, nunca no lugar dele.',
    meta: 'Saúde integrativa em Porto Alegre: osteopatia adulto e infantil, práticas ortomoleculares, reposição de nutrientes e terapias complementares integradas ao cuidado clínico.',
    queixas: [
      'Dores crônicas, tensões e limitações de movimento',
      'Bebês com desconforto, assimetrias ou dificuldade na amamentação',
      'Queixas que persistem mesmo com exames normais',
      'Vontade de um cuidado complementar ao tratamento que você já faz',
    ],
    servicos: [
      [
        'Osteopatia para adultos',
        'Avaliação do corpo em movimento: dores crônicas, lesões, postura e função, com técnicas manuais e orientação de exercícios.',
      ],
      [
        'Osteopatia infantil',
        'Acompanhamento de bebês em adaptação pós-parto, tensões e dificuldades que interferem na amamentação.',
      ],
      [
        'Práticas ortomoleculares',
        'Avaliação e correção de desequilíbrios de nutrientes, com base em exames.',
      ],
      [
        'Terapias de reposição de nutrientes',
        'Protocolos conduzidos por profissionais habilitados, integrados ao seu acompanhamento clínico.',
      ],
      [
        'Terapias complementares',
        'Práticas integrativas que somam ao tratamento principal, com indicação transparente.',
      ],
    ],
    faq: [
      [
        'Quanto custam as sessões?',
        'O valor varia por terapia e profissional, e é informado no agendamento. Protocolos com mais de uma sessão são apresentados na avaliação.',
      ],
      [
        'Integrativa substitui o médico?',
        'Não. Na ecooa, o cuidado integrativo existe em diálogo com o acompanhamento clínico, e os profissionais se comunicam entre si.',
      ],
      [
        'Osteopatia dói?',
        'As técnicas são manuais e respeitam o limite do seu corpo. O osteopata explica cada passo antes de executar.',
      ],
    ],
  },
];

// Ordem de destaque por área, definida pelo dono em 2026-07-31.
// O primeiro slug abre a lista; os demais seguem na ordem do cadastro.
// Todos os profissionais da área aparecem sempre.
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
