// Almanaque do ecooa.match: o mapa de queixas e o que cada profissional faz por
// cada bloco. Extraido de scripts/match.mjs em 2026-08-01 para virar fonte unica,
// consumida por scripts/match.mjs (ferramenta de busca) e por scripts/perfis.mjs
// (paginas individuais de profissional). Editar AQUI, nunca nas copias.
//
// SINTOMAS: blocos de queixa com area, ranking de profissionais (definido pelo
// dono em entrevista) e vocabulario de busca.
// TEXTOS: por bloco e por profissional, a frase precisa do que aquele
// profissional faz por aquela queixa.

export const SINTOMAS = [
    { id: 'dor-musculo', rotulo: 'dor musculoesquelética', area: 'saude-integrativa',
      pros: ['natalie-queiroz', 'gustavo-gehrke', 'adriano-lenz', 'adriana', 'augusto-kauer'],
      termos: ['dor', 'dores', 'dolorido', 'doendo', 'doi', 'cotovelo', 'joelho', 'ombro', 'costas', 'coluna', 'lombar', 'lombalgia', 'cervical', 'nuca', 'pescoco', 'punho', 'pulso', 'tornozelo', 'quadril', 'articulacao', 'articulacoes', 'muscular', 'musculo', 'tensao', 'torcicolo', 'lesao', 'tendinite', 'bursite', 'hernia de disco', 'nervo ciatico', 'ciatico', 'ciatica', 'travado', 'travada', 'contratura', 'fibromialgia', 'artrose', 'artrite', 'canelite', 'fascite', 'esporao', 'dormencia', 'formigamento', 'panturrilha', 'escapula', 'costela', 'entorse', 'entorses', 'distensao', 'estiramento', 'luxacao', 'menisco', 'ligamento', 'manguito rotador', 'fascite plantar', 'dor ao correr', 'dor no treino', 'lesao no joelho', 'dor no calcanhar', 'joanete', 'dor no corpo', 'dor generalizada'] },
    { id: 'postura-movimento', rotulo: 'postura e movimento', area: 'saude-integrativa',
      pros: ['natalie-queiroz', 'gustavo-gehrke', 'adriana'],
      termos: ['postura', 'postural', 'escoliose', 'cifose', 'mobilidade', 'alongamento', 'reabilitacao', 'fisioterapia', 'fisioterapeuta', 'osteopatia', 'osteopata', 'quiropraxia', 'rpg', 'movimento limitado', 'amplitude', 'ma postura', 'corcunda', 'ombros caidos', 'diastase'] },
    { id: 'bebe', rotulo: 'cuidado com bebês e amamentação', area: 'saude-integrativa',
      leitura: 'Você busca cuidado osteopático e de amamentação para o seu bebê.',
      pros: ['natalie-queiroz', 'jessica-stein'],
      termos: ['osteopatia para bebe', 'osteopatia infantil', 'osteopata para bebe', 'bebe', 'bebes', 'recem nascido', 'recem-nascido', 'amamentacao', 'amamentar', 'pega no peito', 'colica do bebe', 'refluxo do bebe', 'torcicolo congenito', 'assimetria craniana', 'plagiocefalia', 'meu bebe nao dorme', 'bebe chora muito', 'gases do bebe'] },
    { id: 'integrativa', rotulo: 'terapias integrativas', area: 'saude-integrativa',
      leitura: 'Você busca um cuidado complementar ao que já faz.',
      pros: ['adriana', 'camila-cadore', 'danusa-pires'],
      termos: ['integrativa', 'integrativo', 'holistico', 'holistica', 'biorressonancia', 'terapia complementar', 'acupuntura', 'auriculoterapia', 'reiki', 'aromaterapia', 'soroterapia', 'soro de vitaminas', 'terapias naturais', 'medicina alternativa', 'equilibrio energetico'] },
    { id: 'enxaqueca', rotulo: 'dor de cabeça e enxaqueca', area: 'saude-integrativa',
      leitura: 'Você quer tratar dores de cabeça que voltam sempre.',
      pros: ['adriana', 'natalie-queiroz', 'gustavo-gehrke'],
      termos: ['enxaqueca', 'dor de cabeca', 'cefaleia', 'migranea', 'dor atras dos olhos', 'cabeca latejando'] },
    { id: 'hormonal', rotulo: 'saúde hormonal', area: 'medicina',
      pros: ['gustavo-gehrke', 'adriano-lenz', 'verena-cattani', 'danusa-pires', 'camila-cadore'],
      termos: ['hormonio', 'hormonal', 'hormonios', 'reposicao hormonal', 'implante hormonal', 'chip hormonal', 'menopausa', 'climaterio', 'perimenopausa', 'testosterona', 'estradiol', 'progesterona', 'tireoide', 'hipotireoidismo', 'hipertireoidismo', 'sop', 'ovario policistico', 'libido', 'andropausa', 'ciclo menstrual', 'menstruacao', 'tpm', 'ondas de calor', 'fogachos', 'calorao', 'caloroes', 'testosterona baixa', 'hashimoto', 'nodulo na tireoide', 'menstruacao atrasada'] },
    { id: 'metabolico', rotulo: 'metabolismo e peso', area: 'medicina',
      pros: ['gustavo-gehrke', 'jessica-stein', 'marvin-marques', 'daniel-forster', 'nasser-salem'],
      termos: ['emagrecer', 'emagrecimento', 'perder peso', 'perda de peso', 'obesidade', 'sobrepeso', 'metabolismo', 'metabolico', 'caneta', 'canetas', 'ozempic', 'mounjaro', 'wegovy', 'saxenda', 'tirzepatida', 'semaglutida', 'compulsao por doce', 'efeito sanfona', 'resistencia a insulina', 'nao consigo emagrecer', 'engordando sem motivo', 'metabolismo lento', 'remedio para emagrecer', 'injecao para emagrecer'] },
    { id: 'cardiometabolico', rotulo: 'saúde cardiometabólica', area: 'medicina',
      leitura: 'Você quer cuidar de pressão, colesterol e glicose antes que virem problema maior.',
      pros: ['gustavo-gehrke', 'marvin-marques', 'verena-cattani', 'daniel-forster'],
      termos: ['pressao alta', 'hipertensao', 'colesterol', 'colesterol alto', 'triglicerideos', 'diabetes', 'pre diabetes', 'glicemia', 'glicose alta', 'acido urico', 'gordura no figado', 'esteatose', 'sindrome metabolica'] },
    { id: 'investigacao', rotulo: 'investigação clínica', area: 'medicina',
      pros: ['gustavo-gehrke', 'jessica-stein', 'adriano-lenz', 'maria-luisa-borges', 'verena-cattani'],
      termos: ['exame', 'exames', 'check up', 'checkup', 'sangue', 'laboratorio', 'diagnostico', 'investigar', 'medico', 'medica', 'clinico geral', 'consulta medica', 'segunda opiniao', 'infeccao', 'inflamacao', 'longevidade', 'envelhecimento', 'prevencao', 'doenca cronica', 'check up completo', 'exame de sangue alterado', 'exames alterados', 'hemograma', 'dor no peito', 'dor de garganta', 'dor de ouvido', 'dor ao urinar', 'dor nos rins', 'dor no olho'] },
    { id: 'imunidade', rotulo: 'imunidade e vitaminas', area: 'medicina',
      leitura: 'Você quer entender por que a imunidade anda baixa e repor o que falta.',
      pros: ['gustavo-gehrke', 'adriano-lenz', 'danusa-pires', 'camila-cadore'],
      termos: ['imunidade', 'imunidade baixa', 'gripes de repeticao', 'resfriados de repeticao', 'herpes de repeticao', 'vitamina', 'vitaminas', 'vitamina d', 'ferritina', 'ferritina baixa', 'anemia', 'carencia de vitaminas', 'deficiencia de vitamina'] },
    { id: 'energia-sono', rotulo: 'energia, sono e disposição', area: 'medicina',
      pros: ['gustavo-gehrke', 'danusa-pires', 'adriano-lenz', 'maria-luisa-borges', 'augusto-kauer'],
      termos: ['cansaco', 'cansada', 'cansado', 'fadiga', 'exaustao', 'sem energia', 'disposicao', 'insonia', 'sono ruim', 'dormir mal', 'apneia', 'ronco', 'performance', 'rendimento', 'nao consigo dormir', 'acordo cansado', 'sono picado', 'melatonina', 'sonolencia', 'indisposicao', 'sem disposicao', 'moleza'] },
    { id: 'digestivo', rotulo: 'digestão e estômago', area: 'medicina',
      leitura: 'Você quer resolver uma queixa digestiva que incomoda no dia a dia.',
      pros: ['gustavo-gehrke', 'camila-cadore', 'verena-cattani', 'jessica-stein'],
      termos: ['azia', 'queimacao', 'refluxo', 'gastrite', 'ma digestao', 'digestao', 'estomago', 'dor no estomago', 'dor de estomago', 'dor de barriga', 'dor na barriga', 'dor abdominal', 'dor no abdomen', 'barriga doendo', 'dor depois de comer', 'enjoo', 'nausea', 'empachamento', 'arrotos', 'h pylori'] },
    { id: 'saude-da-mulher', rotulo: 'saúde da mulher', area: 'medicina',
      leitura: 'Você quer cuidar de ciclo, cólica e saúde feminina com investigação de verdade.',
      pros: ['gustavo-gehrke', 'verena-cattani', 'camila-cadore', 'jessica-stein'],
      termos: ['endometriose', 'colica menstrual', 'colicas menstruais', 'menstruacao irregular', 'ciclo irregular', 'candidiase de repeticao', 'fertilidade', 'dificuldade para engravidar', 'mioma', 'dor pelvica'] },
    { id: 'retencao', rotulo: 'inchaço e retenção de líquido', area: 'medicina',
      leitura: 'Você quer entender e reduzir o inchaço que não vai embora.',
      pros: ['gustavo-gehrke', 'camila-cadore', 'verena-cattani', 'danusa-pires'],
      termos: ['inchaco', 'inchaco nas pernas', 'retencao de liquido', 'pernas inchadas', 'pes inchados', 'corpo inchado'] },
    { id: 'pele-clinica', rotulo: 'pele e rosto', area: 'estetica-facial',
      pros: ['vitoria-machado', 'renata-bohn-engel', 'tais-de-la-rosa', 'susan-flach', 'jennifer-adam'],
      termos: ['pele', 'acne', 'espinha', 'espinhas', 'cravos', 'mancha', 'manchas', 'melasma', 'rosto', 'facial', 'face', 'dermatologista', 'dermatologia', 'skincare', 'poro', 'poros', 'peeling', 'melanose', 'rosacea', 'dermatite', 'cicatriz de acne', 'pele oleosa', 'pele seca', 'pele sensivel', 'pinta', 'pintas', 'sinal na pele', 'verruga', 'psoriase', 'vitiligo', 'foliculite', 'alergia na pele', 'coceira na pele', 'limpeza de pele', 'microagulhamento', 'bolinhas no rosto', 'cicatriz'] },
    { id: 'harmonizacao', rotulo: 'harmonização facial', area: 'estetica-facial',
      pros: ['leticia-melo', 'tais-de-la-rosa', 'eduarda-schoenmeier', 'jamylle-farias', 'karine-ellwanger'],
      termos: ['ruga', 'rugas', 'linhas de expressao', 'botox', 'toxina botulinica', 'preenchimento', 'acido hialuronico', 'harmonizacao facial', 'harmonizacao', 'hof', 'rejuvenescimento', 'flacidez facial', 'olheira', 'olheiras', 'labios', 'labio', 'bioestimulador', 'preenchimento labial', 'rinomodelacao', 'skinbooster', 'bigode chines', 'sorriso gengival', 'suor excessivo', 'hiperidrose', 'full face', 'fios de sustentacao', 'botox preventivo'] },
    { id: 'atm-bruxismo', rotulo: 'bruxismo e ATM', area: 'estetica-facial',
      leitura: 'Você quer alívio para o aperto e o desgaste do bruxismo.',
      pros: ['jamylle-farias', 'leticia-melo', 'tais-de-la-rosa'],
      termos: ['bruxismo', 'atm', 'ranger os dentes', 'apertar os dentes', 'dor na mandibula', 'mandibula estalando', 'disfuncao da atm'] },
    { id: 'corpo-estetica', rotulo: 'contorno corporal', area: 'estetica-corporal',
      pros: ['eduarda-schoenmeier', 'jennifer-adam', 'tais-de-la-rosa'],
      termos: ['flacidez na barriga', 'barriga flacida', 'secar a barriga', 'celulite', 'gordura localizada', 'contorno corporal', 'flacidez corporal', 'flacidez', 'bumbum', 'gluteo', 'gluteos', 'abdomen', 'culote', 'medidas', 'estrias', 'drenagem', 'massagem modeladora', 'papada'] },
    { id: 'cabelo', rotulo: 'saúde capilar', area: 'tricologia',
      pros: ['danusa-pires', 'yale-jeronimo', 'viviane-fagundes', 'susan-flach', 'larissa-wiebbelling'],
      termos: ['cabelo caindo', 'caindo cabelo', 'cabelo', 'cabelos', 'queda de cabelo', 'queda capilar', 'calvicie', 'alopecia', 'alopecias', 'careca', 'couro cabeludo', 'capilar', 'tricologia', 'tricologista', 'caspa', 'dermatite seborreica', 'seborreia', 'fio', 'fios', 'rarefacao', 'entradas', 'afinamento', 'minoxidil', 'teste genetico capilar', 'coceira na cabeca', 'oleosidade no cabelo', 'alopecia areata', 'alopecia androgenetica', 'efluvio', 'efluvio telogeno', 'queda de cabelo pos parto', 'queda de cabelo feminina', 'cabelo quebrando', 'cabelo fino', 'cabelo ralo', 'calvicie masculina', 'calvicie feminina', 'coceira no couro cabeludo', 'descamacao', 'cabelo nao cresce'] },
    { id: 'transplante', rotulo: 'transplante capilar', area: 'transplante-capilar',
      pros: ['larissa-wiebbelling', 'yale-jeronimo', 'danusa-pires', 'viviane-fagundes'],
      termos: ['transplante', 'transplante capilar', 'implante capilar', 'enxerto capilar', 'fue', 'cirurgia capilar', 'transplante de barba', 'transplante de sobrancelha', 'fio longo', 'sem raspagem', 'transplante feminino', 'implante de cabelo', 'restauracao capilar'] },
    { id: 'alimentacao', rotulo: 'alimentação e nutrição', area: 'nutricao',
      pros: ['jessica-stein', 'marvin-marques', 'nasser-salem', 'verena-cattani', 'gabrieli-avila'],
      termos: ['nutricao', 'nutricionista', 'dieta', 'alimentacao', 'comer', 'cardapio', 'intolerancia', 'lactose', 'gluten', 'suplemento', 'suplementacao', 'ortomolecular', 'reeducacao alimentar', 'alimentacao saudavel', 'dieta low carb', 'jejum intermitente', 'dieta cetogenica', 'perder barriga', 'pos bariatrica', 'bariatrica', 'plano alimentar', 'alergia alimentar', 'dieta flexivel'] },
    { id: 'intestino', rotulo: 'saúde intestinal', area: 'nutricao',
      leitura: 'Você quer um intestino que funcione sem drama.',
      pros: ['camila-cadore', 'verena-cattani', 'jessica-stein', 'gustavo-gehrke', 'gabrieli-avila'],
      termos: ['intestino', 'intestinal', 'intestino preso', 'constipacao', 'prisao de ventre', 'gases', 'estufamento', 'disbiose', 'sii', 'intestino irritavel', 'probiotico', 'probioticos', 'diarreia', 'barriga inchada'] },
    { id: 'hipertrofia', rotulo: 'massa muscular e performance', area: 'nutricao',
      pros: ['lara-caye', 'maria-luisa-borges', 'vitoria-serpa', 'giancarla-rochemback', 'daniel-forster'],
      termos: ['hipertrofia', 'massa muscular', 'ganhar massa', 'ganho de massa', 'nutricao esportiva', 'dieta para treino', 'atleta', 'esportiva', 'creatina', 'whey', 'definicao muscular', 'bulking', 'cutting', 'ganhar peso', 'engordar com saude', 'dificuldade de engordar', 'muito magro', 'massa magra', 'melhorar no treino'] },
    { id: 'materno-infantil', rotulo: 'nutrição materno-infantil', area: 'nutricao',
      pros: ['jessica-stein', 'natalie-queiroz'],
      termos: ['nutricao na gravidez', 'nutricao para gestante', 'nutricao infantil', 'nutricionista infantil', 'gestante', 'gravida', 'gestacao', 'gravidez', 'tentante', 'introducao alimentar', 'crianca', 'criancas', 'infantil', 'seletividade alimentar', 'meu filho nao come', 'lactacao', 'nutricao para criancas', 'meu filho so come besteira'] },
    { id: 'vegetariana', rotulo: 'alimentação vegetariana e vegana', area: 'nutricao',
      pros: ['jessica-stein', 'camila-cadore', 'verena-cattani', 'gabrieli-avila', 'daniel-forster'],
      termos: ['vegetariano', 'vegetariana', 'vegano', 'vegana', 'veganismo', 'plant based', 'sem carne', 'b12', 'proteina vegetal', 'dieta vegana', 'parar de comer carne'] },
    { id: 'comportamento-alimentar', rotulo: 'comportamento alimentar', area: 'nutricao',
      pros: ['gabrieli-avila', 'francielle-beria', 'manuela-vanti', 'jessica-stein', 'marvin-marques'],
      termos: ['compulsao alimentar', 'compulsao', 'beliscar', 'ansiedade e comida', 'comer emocional', 'relacao com a comida', 'transtorno alimentar', 'comer escondido', 'descontar na comida', 'fome emocional', 'vicio em doce', 'beliscando o dia todo', 'medo de comer'] },
    { id: 'psico-esporte', rotulo: 'psicologia do esporte', area: 'saude-mental',
      leitura: 'Você busca preparo mental para treinar e competir melhor.',
      pros: ['augusto-kauer'],
      termos: ['psicologia do esporte', 'psicologo do esporte', 'psicologa do esporte', 'psicologia esportiva', 'pressao em competicao', 'ansiedade pre competicao', 'mentalidade de atleta', 'desempenho mental', 'medo de competir', 'nervosismo em competicao', 'psicologo esportivo'] },
    { id: 'mente', rotulo: 'saúde mental', area: 'saude-mental',
      pros: ['francielle-beria', 'manuela-vanti', 'augusto-kauer', 'adriana', 'gabrieli-avila'],
      termos: ['perdi minha mae', 'perdi meu pai', 'falecimento', 'nao aguento mais', 'nao to conseguindo', 'nao estou conseguindo', 'cansado da cabeca', 'cansada da cabeca', 'esgotado', 'esgotada', 'depressao pos parto', 'depresao', 'anciedade', 'ansiedade', 'ansioso', 'ansiosa', 'depressao', 'deprimido', 'deprimida', 'terapia', 'psicologo', 'psicologa', 'psicologia', 'psicoterapia', 'mente', 'emocional', 'estresse', 'stress', 'burnout', 'esgotamento', 'luto', 'panico', 'sindrome do panico', 'autoestima', 'neuropsicologia', 'tdah', 'tristeza', 'angustia', 'medo', 'fobia', 'relacionamento', 'separacao', 'divorcio', 'autoconhecimento', 'crise', 'crise de ansiedade', 'ataque de panico', 'transtorno de ansiedade', 'ansiedade generalizada', 'toc', 'fobia social', 'timidez', 'procrastinacao', 'sindrome do impostor', 'dependencia emocional', 'termino de namoro', 'nervosismo', 'desmotivacao', 'apatia', 'solidao', 'insonia por ansiedade', 'mente acelerada', 'pensamentos acelerados', 'preocupacao excessiva', 'cansaco mental', 'saude mental', 'nao quero mais viver', 'nao quero viver', 'vontade de morrer', 'quero morrer', 'me matar', 'suicidio', 'suicida', 'ideacao suicida', 'automutilacao', 'me cortar', 'melhor sem mim', 'sofrimento', 'desesperado', 'desesperada', 'sem saida'] }
];

export const FALLBACK = { id: 'geral', rotulo: 'queixa de saúde para investigar', area: 'medicina',
    pros: ['gustavo-gehrke'] };

export const TEXTOS = {
    'dor-musculo': {
      'natalie-queiroz': 'Através da osteopatia, Natálie trata dores crônicas, entorses e distensões, avaliando o corpo em movimento para encontrar e tratar a causa da dor.',
      'gustavo-gehrke': 'Gustavo diagnostica lesões através da anamnese, do exame físico quando necessário e de exames complementares, para conduzir a sua queixa do diagnóstico ao tratamento.',
      'adriano-lenz': 'Pela nutrição com práticas ortomoleculares, Adriano ajusta alimentação e suplementação para apoiar a recuperação e reduzir a inflamação que alimenta a dor.',
      'adriana': 'Com terapia integrativa e biorressonância, Adriana trabalha o equilíbrio do organismo como cuidado complementar nas dores persistentes.',
      'augusto-kauer': 'Na psicologia do esporte, Augusto trabalha a relação com a dor, o retorno ao treino e a confiança no corpo depois de uma lesão.'
    },
    'postura-movimento': {
      'natalie-queiroz': 'Através da osteopatia, Natálie avalia postura e padrão de movimento e trata as restrições que sobrecarregam músculos e articulações.',
      'gustavo-gehrke': 'Gustavo investiga queixas posturais com anamnese, exame físico quando necessário e exames complementares, afastando causas clínicas antes de definir o caminho.',
      'adriana': 'Com terapia integrativa, Adriana complementa o cuidado do corpo trabalhando a tensão acumulada e o equilíbrio geral do organismo.'
    },
    'bebe': {
      'natalie-queiroz': 'Através da osteopatia infantil, Natálie atende bebês com cólicas, refluxo, torcicolo congênito e dificuldades de pega na amamentação.',
      'jessica-stein': 'Na nutrição materno-infantil, Jessica acompanha amamentação, introdução alimentar e a alimentação da mãe nessa fase.'
    },
    'integrativa': {
      'adriana': 'Com biorressonância e terapias integrativas, Adriana avalia desequilíbrios do organismo e conduz um cuidado complementar, junto ou não de outras áreas.',
      'camila-cadore': 'Na nutrição funcional e integrativa, Camila investiga a alimentação como parte do equilíbrio do corpo, do intestino à energia.',
      'danusa-pires': 'Danusa conduz a reposição de nutrientes por soroterapia, com protocolo definido a partir de avaliação e exames.'
    },
    hormonal: {
      'gustavo-gehrke': 'Gustavo investiga a saúde hormonal com anamnese e exames, e conduz o tratamento de menopausa, tireoide e reposição quando há indicação.',
      'adriano-lenz': 'Pela nutrição ortomolecular, Adriano ajusta alimentação e suplementação para apoiar o equilíbrio hormonal e o metabolismo.',
      'verena-cattani': 'Na nutrição clínica, Verena adapta a alimentação às fases hormonais, da TPM à menopausa, junto do acompanhamento médico.',
      'danusa-pires': 'Danusa realiza a reposição de nutrientes por soroterapia como apoio ao equilíbrio do organismo, a partir de avaliação e exames.',
      'camila-cadore': 'Na nutrição funcional e integrativa, Camila trabalha alimentação e rotina para apoiar o eixo hormonal e o bem-estar.'
    },
    metabolico: {
      'gustavo-gehrke': 'Gustavo conduz o emagrecimento com avaliação médica, exames e, quando há indicação, medicação como as canetas, sempre com acompanhamento.',
      'jessica-stein': 'Na nutrição, Jessica constrói o plano alimentar do emagrecimento, com ou sem medicação, ajustado à sua rotina real.',
      'marvin-marques': 'Na nutrição clínica, Marvin acompanha o emagrecimento com estratégia alimentar e metas possíveis de sustentar.',
      'daniel-forster': 'Na nutrição clínica e esportiva, Daniel une alimentação e treino para emagrecer preservando massa muscular.',
      'nasser-salem': 'Na nutrição esportiva, Nasser estrutura o emagrecimento de quem treina, equilibrando déficit calórico e desempenho.'
    },
    investigacao: {
      'gustavo-gehrke': 'Gustavo conduz o check-up com anamnese, exame físico quando necessário e exames complementares, transformando resultados em um plano claro.',
      'jessica-stein': 'Na nutrição clínica, Jessica traduz os seus exames em ajustes práticos de alimentação e rotina.',
      'adriano-lenz': 'Pela nutrição ortomolecular, Adriano avalia carências de vitaminas e minerais e ajusta a suplementação a partir dos exames.',
      'maria-luisa-borges': 'Na nutrição de alta performance, Maria Luísa usa a avaliação e os exames para otimizar energia, recuperação e rendimento.',
      'verena-cattani': 'Na nutrição clínica, Verena acompanha os marcadores dos exames com um plano alimentar de manutenção e prevenção.'
    },
    'energia-sono': {
      'gustavo-gehrke': 'Gustavo investiga cansaço e sono ruim com anamnese e exames, procurando causas metabólicas e hormonais antes de tratar.',
      'danusa-pires': 'Danusa realiza a reposição de nutrientes por soroterapia, indicada a partir de avaliação e exames, como apoio à disposição.',
      'adriano-lenz': 'Pela nutrição ortomolecular, Adriano corrige carências nutricionais que roubam energia e atrapalham o sono.',
      'maria-luisa-borges': 'Na nutrição de alta performance, Maria Luísa organiza alimentação e rotina para melhorar energia e recuperação.',
      'augusto-kauer': 'Na psicologia, Augusto trabalha rotina, descanso e a carga mental que costuma estar por trás do cansaço.'
    },
    'pele-clinica': {
      'vitoria-machado': 'Na dermatologia, Vitória avalia manchas, acne e outras queixas da pele, definindo o diagnóstico antes de qualquer procedimento.',
      'renata-bohn-engel': 'Na dermatologia clínica e estética, Renata investiga a queixa da pele e conduz o tratamento do diagnóstico à rotina de cuidado.',
      'tais-de-la-rosa': 'Na saúde da pele, Tais monta a rotina de cuidado e os procedimentos de consultório para manchas, acne e textura.',
      'susan-flach': 'No gerenciamento da pele, Susan acompanha a evolução com protocolos seriados de tratamento e manutenção.',
      'jennifer-adam': 'Na estética facial, Jennifer trabalha qualidade da pele e rejuvenescimento com procedimentos escolhidos após avaliação.'
    },
    harmonizacao: {
      'leticia-melo': 'Na harmonização orofacial, Letícia planeja toxina e preenchimento respeitando as proporções naturais do seu rosto.',
      'tais-de-la-rosa': 'Na harmonização orofacial, Tais une procedimentos e saúde da pele, priorizando resultado discreto e bem indicado.',
      'eduarda-schoenmeier': 'Na harmonização orofacial, Eduarda desenha o plano por etapas, do contorno facial aos detalhes.',
      'jamylle-farias': 'Cirurgiã-dentista, Jamylle traz o domínio da anatomia da face para uma harmonização segura e proporcional.',
      'karine-ellwanger': 'Na harmonização orofacial, Karine conduz toxina e preenchimento com avaliação criteriosa de indicação.'
    },
    'corpo-estetica': {
      'eduarda-schoenmeier': 'Na estética corporal, Eduarda trata flacidez, gordura localizada e contorno com plano por etapas e reavaliação.',
      'jennifer-adam': 'Na estética, Jennifer combina tecnologias e bioestimuladores para firmeza e qualidade da pele do corpo.',
      'tais-de-la-rosa': 'Tais avalia a pele do corpo e monta o protocolo de tratamento junto da rotina de cuidado em casa.'
    },
    cabelo: {
      'danusa-pires': 'Na tricologia, Danusa avalia couro cabeludo e fios e conduz protocolos de tratamento com reposição de nutrientes.',
      'yale-jeronimo': 'Médica tricologista, Yale investiga alopecias e queda com diagnóstico clínico e exames antes de definir o tratamento.',
      'viviane-fagundes': 'Na tricologia, Viviane usa avaliação e testes genéticos capilares para entender a causa da queda e personalizar o cuidado.',
      'susan-flach': 'Na tricologia, Susan acompanha couro cabeludo e fios com protocolos seriados de tratamento e manutenção.',
      'larissa-wiebbelling': 'Médica, Larissa avalia se o seu caso é de tratamento clínico ou se há indicação de transplante capilar.'
    },
    transplante: {
      'larissa-wiebbelling': 'Larissa conduz a avaliação do transplante capilar com critério médico: há casos com indicação e casos em que o caminho é outro.',
      'yale-jeronimo': 'Médica tricologista, Yale investiga a causa da queda antes do transplante, garantindo que a cirurgia seja a decisão certa.',
      'danusa-pires': 'Na tricologia, Danusa prepara e acompanha o couro cabeludo antes e depois do procedimento.',
      'viviane-fagundes': 'Viviane complementa a avaliação com testes genéticos capilares, úteis para prever a evolução da queda.'
    },
    alimentacao: {
      'jessica-stein': 'Na nutrição clínica, Jessica conduz o emagrecimento e a reeducação alimentar com um plano ajustado à sua rotina real.',
      'marvin-marques': 'Na nutrição clínica, Marvin estrutura o emagrecimento com estratégia alimentar clara e metas sustentáveis.',
      'nasser-salem': 'Na nutrição esportiva, Nasser organiza a alimentação de quem treina, do emagrecimento à performance.',
      'verena-cattani': 'Na nutrição clínica, Verena trabalha a alimentação do dia a dia, a digestão e hábitos que se sustentam.',
      'gabrieli-avila': 'Na nutrição comportamental, Gabrieli trabalha a relação com a comida para que a mudança não dependa só de força de vontade.'
    },
    hipertrofia: {
      'lara-caye': 'Na nutrição esportiva, Lara monta a estratégia de hipertrofia: superávit calórico, proteína e ajuste fino conforme a resposta do treino.',
      'maria-luisa-borges': 'Na nutrição de alta performance, Maria Luísa periodiza a alimentação junto do treino para ganho de massa e recuperação.',
      'vitoria-serpa': 'Na nutrição esportiva, Vitória ajusta o plano alimentar ao seu treino e à sua agenda, sem dieta impossível.',
      'giancarla-rochemback': 'Na nutrição clínica e esportiva, Giancarla une saúde e desempenho no plano de ganho de massa.',
      'daniel-forster': 'Na nutrição clínica e esportiva, Daniel constrói o plano de hipertrofia com base em avaliação e evolução medida.'
    },
    'materno-infantil': {
      'jessica-stein': 'Na nutrição materno-infantil, Jessica acompanha gestação, amamentação, introdução alimentar e a seletividade das crianças.',
      'natalie-queiroz': 'Referência em lactação pela osteopatia, Natálie atende bebês com dificuldade de pega e tensões que atrapalham a amamentação.'
    },
    vegetariana: {
      'jessica-stein': 'Na nutrição vegetariana, Jessica monta cardápios completos sem carne e acompanha B12, ferro e proteína.',
      'camila-cadore': 'Na nutrição funcional, Camila equilibra o prato vegetariano cuidando de digestão, energia e micronutrientes.',
      'verena-cattani': 'Na nutrição clínica, Verena adapta a alimentação sem carne à sua rotina e aos seus exames.',
      'gabrieli-avila': 'Na nutrição comportamental, Gabrieli acompanha a transição alimentar respeitando o seu ritmo.',
      'daniel-forster': 'Na nutrição esportiva, Daniel ajusta a dieta vegetariana de quem treina, garantindo proteína e recuperação.'
    },
    'comportamento-alimentar': {
      'gabrieli-avila': 'Na nutrição comportamental, Gabrieli trabalha compulsão, beliscos e o comer emocional, reconstruindo a relação com a comida.',
      'francielle-beria': 'Na terapia cognitivo-comportamental, Francielle trata os padrões de pensamento e emoção que sustentam a compulsão.',
      'manuela-vanti': 'Na terapia cognitivo-comportamental, Manuela trabalha gatilhos, ansiedade e o ciclo do comer emocional.',
      'jessica-stein': 'Na nutrição clínica, Jessica organiza a rotina alimentar para reduzir a fome desregulada que alimenta a compulsão.',
      'marvin-marques': 'Na nutrição clínica, Marvin estrutura refeições que dão saciedade e previsibilidade ao dia.'
    },
    'psico-esporte': {
      'augusto-kauer': 'Na psicologia do esporte, Augusto trabalha foco, pressão em competição e a rotina mental de treino, com atletas e amadores.'
    },
    mente: {
      'francielle-beria': 'Na terapia cognitivo-comportamental e na neuropsicologia, Francielle trata ansiedade, depressão e luto com método e escuta.',
      'manuela-vanti': 'Na terapia cognitivo-comportamental, Manuela trabalha ansiedade, estresse e as situações que travam o dia a dia.',
      'augusto-kauer': 'Na psicologia, Augusto atende com foco em pressão, cobrança e desempenho, no esporte e fora dele.',
      'adriana': 'Com terapias integrativas, Adriana oferece um cuidado complementar ao processo terapêutico, trabalhando o equilíbrio do organismo.',
      'gabrieli-avila': 'Na nutrição comportamental, Gabrieli entra quando a ansiedade atravessa a alimentação.'
    },
    enxaqueca: {
      'adriana': 'Com biorressonância e terapias integrativas, Adriana trabalha gatilhos e o equilíbrio do organismo nas dores de cabeça recorrentes.',
      'natalie-queiroz': 'Através da osteopatia, Natálie trata tensões de pescoço e crânio que alimentam dores de cabeça e enxaqueca.',
      'gustavo-gehrke': 'Gustavo investiga a dor de cabeça com anamnese e exames, afastando causas que precisam de tratamento médico.'
    },
    cardiometabolico: {
      'gustavo-gehrke': 'Gustavo acompanha pressão, colesterol e glicose com avaliação médica e exames, tratando antes que vire doença maior.',
      'marvin-marques': 'Na nutrição clínica, Marvin monta o plano alimentar para baixar colesterol e glicose de forma sustentável.',
      'verena-cattani': 'Na nutrição clínica, Verena ajusta a alimentação do dia a dia para proteger coração e metabolismo.',
      'daniel-forster': 'Na nutrição clínica e esportiva, Daniel une alimentação e movimento para melhorar os seus marcadores.'
    },
    imunidade: {
      'gustavo-gehrke': 'Gustavo investiga imunidade baixa e carências de vitaminas com anamnese e exames, e trata a causa.',
      'adriano-lenz': 'Pela nutrição ortomolecular, Adriano repõe vitaminas e minerais em falta com alimentação e suplementação.',
      'danusa-pires': 'Danusa realiza a reposição de nutrientes por soroterapia, indicada a partir de avaliação e exames.',
      'camila-cadore': 'Na nutrição funcional, Camila fortalece a imunidade cuidando de alimentação, intestino e rotina.'
    },
    digestivo: {
      'gustavo-gehrke': 'Gustavo investiga azia, refluxo e queixas do estômago com anamnese e exames, tratando a causa e não só o sintoma.',
      'camila-cadore': 'Na nutrição funcional, Camila ajusta a alimentação para acalmar a digestão, do estômago ao intestino.',
      'verena-cattani': 'Na nutrição clínica, Verena monta um plano alimentar que respeita a sua digestão no dia a dia.',
      'jessica-stein': 'Na nutrição clínica, Jessica adapta refeições e horários para reduzir refluxo e má digestão.'
    },
    'saude-da-mulher': {
      'gustavo-gehrke': 'Gustavo investiga cólica forte, ciclo irregular e endometriose com anamnese e exames, e conduz o tratamento.',
      'verena-cattani': 'Na nutrição clínica, Verena adapta a alimentação aos ciclos e às fases da saúde da mulher.',
      'camila-cadore': 'Na nutrição funcional, Camila trabalha alimentação e rotina como apoio no cuidado de endometriose e ciclos difíceis.',
      'jessica-stein': 'Na nutrição clínica, Jessica acompanha da tentante à gestante, ajustando o plano a cada fase.'
    },
    retencao: {
      'gustavo-gehrke': 'Gustavo investiga o inchaço com anamnese e exames, afastando causas hormonais, renais e circulatórias.',
      'camila-cadore': 'Na nutrição funcional, Camila ajusta sal, hidratação e alimentação para reduzir a retenção.',
      'verena-cattani': 'Na nutrição clínica, Verena organiza o dia a dia alimentar para desinchar de forma consistente.',
      'danusa-pires': 'Danusa complementa o cuidado com reposição de nutrientes por soroterapia, quando indicada por avaliação.'
    },
    intestino: {
      'camila-cadore': 'Na nutrição funcional e integrativa, Camila investiga intestino preso, gases e desconforto, trabalhando a causa pela alimentação.',
      'verena-cattani': 'Na nutrição clínica, Verena organiza fibras, água e rotina para o intestino voltar a funcionar.',
      'jessica-stein': 'Na nutrição clínica, Jessica ajusta o plano alimentar para regularizar o intestino sem radicalismo.',
      'gustavo-gehrke': 'Gustavo entra com anamnese e exames quando o intestino pede avaliação médica.',
      'gabrieli-avila': 'Na nutrição comportamental, Gabrieli trabalha os hábitos que atrapalham a rotina intestinal.'
    },
    'atm-bruxismo': {
      'jamylle-farias': 'Cirurgiã-dentista, Jamylle avalia bruxismo e ATM com domínio da anatomia da face, e conduz o tratamento adequado.',
      'leticia-melo': 'Na harmonização orofacial, Letícia usa toxina para aliviar a tensão do aperto e do ranger dos dentes, quando indicado.',
      'tais-de-la-rosa': 'Na harmonização orofacial, Tais avalia a musculatura da face e monta o plano de alívio e manutenção.'
    },
    geral: {
      'gustavo-gehrke': 'Gustavo investiga a sua queixa através da anamnese, do exame físico quando necessário e de exames complementares, e encaminha dentro da casa quando outra área for o caminho.'
    }
};
