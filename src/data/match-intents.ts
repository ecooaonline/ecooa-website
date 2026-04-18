/**
 * Intenções curadas para ecooa.match.
 *
 * Cada intenção é embedada em build time e fica disponível como:
 * - botão de acesso rápido (chips no topo do /match)
 * - âncora semântica para expandir queries do usuário (query expansion)
 *
 * `unit` é apenas uma dica; o ranking real usa similaridade de cosseno
 * contra os embeddings dos profissionais.
 */

export interface CuratedIntent {
  id: string;
  label: string;
  query: string;
  unit?: 'med' | 'esthetic' | 'working' | 'mind';
  /** Slugs dos profissionais recomendados em ordem de prioridade. */
  topSlugs: string[];
}

export const curatedIntents: CuratedIntent[] = [
  // ── ecooa.med ──
  { id: 'emagrecer', label: 'Quero emagrecer', query: 'Quero emagrecer de forma saudável, perder peso, reduzir gordura corporal, acelerar metabolismo', unit: 'med', topSlugs: ['gustavo-gehrke', 'jessica-stein', 'adriano-lenz'] },
  { id: 'hormonal', label: 'Equilíbrio hormonal', query: 'Equilíbrio hormonal, desregulação hormonal, reposição hormonal, tireoide, cortisol, testosterona', unit: 'med', topSlugs: ['gustavo-gehrke', 'adriano-lenz'] },
  { id: 'longevidade', label: 'Longevidade e performance', query: 'Longevidade, envelhecimento saudável, medicina preventiva, alta performance, idade biológica', unit: 'med', topSlugs: ['gustavo-gehrke', 'adriano-lenz'] },
  { id: 'metabolismo', label: 'Metabolismo lento', query: 'Metabolismo lento, cansaço crônico, energia baixa, sensibilidade à insulina, exames metabólicos', unit: 'med', topSlugs: ['gustavo-gehrke', 'adriano-lenz', 'jessica-stein'] },
  { id: 'check-up', label: 'Check-up completo', query: 'Check-up preventivo, exames laboratoriais, avaliação médica geral, saúde integral', unit: 'med', topSlugs: ['gustavo-gehrke'] },

  // ── ecooa.esthetic - cabelo ──
  { id: 'queda-cabelo', label: 'Queda de cabelo', query: 'Queda de cabelo intensa, perda capilar, afinamento dos fios, calvície, couro cabeludo', unit: 'esthetic', topSlugs: ['viviane-fagundes', 'yale-jeronimo', 'danusa-pires'] },
  { id: 'tricologia', label: 'Saúde capilar e tricologia', query: 'Tricologia, saúde do couro cabeludo, doenças capilares, alopécia androgenética, alopécia areata', unit: 'esthetic', topSlugs: ['yale-jeronimo', 'viviane-fagundes', 'susan-flach'] },
  { id: 'transplante', label: 'Transplante capilar', query: 'Transplante capilar, implante de cabelo, técnica FUE, Sapphire, restauração capilar cirúrgica', unit: 'esthetic', topSlugs: ['larissa-wiebbelling'] },
  { id: 'cabelo-fem', label: 'Queda capilar feminina', query: 'Queda de cabelo em mulheres, rarefação feminina, cabelo fino, alopécia feminina', unit: 'esthetic', topSlugs: ['yale-jeronimo', 'viviane-fagundes', 'susan-flach'] },

  // ── ecooa.esthetic - pele ──
  { id: 'rejuvenescimento', label: 'Rejuvenescimento facial', query: 'Rejuvenescimento facial, rugas, linhas de expressão, firmeza da pele, pele madura', unit: 'esthetic', topSlugs: ['vitoria-machado', 'renata-bohn', 'susan-flach'] },
  { id: 'derma-clinica', label: 'Dermatologia clínica', query: 'Consulta dermatológica, manchas, acne, rosácea, problemas de pele, avaliação dermatológica', unit: 'esthetic', topSlugs: ['renata-bohn', 'vitoria-machado'] },
  { id: 'manchas', label: 'Manchas na pele', query: 'Manchas no rosto, melasma, hiperpigmentação, clareamento de pele', unit: 'esthetic', topSlugs: ['renata-bohn', 'vitoria-machado', 'susan-flach'] },
  { id: 'acne', label: 'Acne e oleosidade', query: 'Acne adulta, espinhas, oleosidade excessiva, cravos, cicatrizes de acne', unit: 'esthetic', topSlugs: ['renata-bohn', 'vitoria-machado'] },

  // ── ecooa.esthetic - HOF ──
  { id: 'hof', label: 'Harmonização orofacial', query: 'Harmonização orofacial, HOF, preenchimento labial, bichectomia, botox, contorno facial', unit: 'esthetic', topSlugs: ['karine-ellwanger', 'leticia-de-melo', 'jennifer-adam', 'jamylle-farias'] },
  { id: 'labios', label: 'Preenchimento labial', query: 'Preenchimento labial, volumizar lábios, lábios mais definidos, ácido hialurônico', unit: 'esthetic', topSlugs: ['karine-ellwanger', 'leticia-de-melo', 'jennifer-adam'] },
  { id: 'sorriso', label: 'Sorriso e estética dental', query: 'Estética dental, sorriso harmônico, lente de contato, clareamento, design do sorriso', unit: 'esthetic', topSlugs: ['jamylle-farias'] },

  // ── ecooa.esthetic - corpo ──
  { id: 'corporal', label: 'Estética corporal', query: 'Estética corporal, gordura localizada, flacidez, drenagem linfática, celulite, dermatofuncional', unit: 'esthetic', topSlugs: ['cris-neumann'] },
  { id: 'pos-operatorio', label: 'Pós-operatório', query: 'Pós-operatório estético, drenagem pós cirurgia plástica, recuperação cirúrgica, lipoescultura', unit: 'esthetic', topSlugs: ['cris-neumann'] },

  // ── ecooa.esthetic - outros ──
  { id: 'soroterapia', label: 'Soroterapia', query: 'Soroterapia, terapia intravenosa, vitaminas injetáveis, energia imunidade', unit: 'esthetic', topSlugs: ['danusa-pires'] },
  { id: 'osteopatia', label: 'Dores e osteopatia', query: 'Dor nas costas, dor cervical, enxaqueca, osteopatia, terapia manual, tensão muscular', unit: 'esthetic', topSlugs: ['natalie-queiroz'] },
  { id: 'osteo-bebe', label: 'Osteopatia para bebês', query: 'Osteopatia em bebês, cólica do bebê, refluxo, torcicolo congênito, plagiocefalia', unit: 'esthetic', topSlugs: ['natalie-queiroz'] },
  { id: 'biorressonancia', label: 'Biorressonância', query: 'Biorressonância, terapia integrativa, medicina complementar, energia sutil, equilíbrio bioenergético', unit: 'esthetic', topSlugs: ['adriana'] },

  // ── ecooa.working (nutrição) ──
  { id: 'vegana', label: 'Nutrição vegana', query: 'Nutrição vegana, dieta vegetariana, plant-based, substituição proteica, suplementação vegana', unit: 'working', topSlugs: ['jessica-stein', 'maria-luisa-beltran'] },
  { id: 'performance', label: 'Performance esportiva', query: 'Performance esportiva, nutrição esportiva, ganho de massa, composição corporal, atleta', unit: 'working', topSlugs: ['maria-luisa-beltran', 'giancarla-rochemback', 'vitoria-serpa', 'lara-caye'] },
  { id: 'crossfit', label: 'Nutrição para CrossFit', query: 'Nutrição para CrossFit, treinamento de alta intensidade, recuperação, hipertrofia', unit: 'working', topSlugs: ['maria-luisa-beltran', 'vitoria-serpa', 'lara-caye'] },
  { id: 'ortomolecular', label: 'Ortomolecular e nutrigenômica', query: 'Ortomolecular, nutrigenômica, metabolômica, teste genético, suplementação personalizada', unit: 'working', topSlugs: ['adriano-lenz'] },
  { id: 'comportamental', label: 'Nutrição comportamental', query: 'Nutrição comportamental, compulsão alimentar, relação com a comida, emoções e comida', unit: 'working', topSlugs: ['gabrieli-klagenberg'] },
  { id: 'nutri-crianca', label: 'Nutrição infantil', query: 'Nutrição infantil, introdução alimentar, baby led weaning, alimentação de crianças', unit: 'working', topSlugs: ['jessica-stein'] },
  { id: 'emagrecer-nutri', label: 'Emagrecimento com nutri', query: 'Emagrecer com nutricionista, plano alimentar para perder peso, reeducação alimentar', unit: 'working', topSlugs: ['jessica-stein', 'adriano-lenz', 'gabrieli-klagenberg'] },

  // ── ecooa.mind ──
  { id: 'ansiedade', label: 'Ansiedade', query: 'Ansiedade, crises de ansiedade, pânico, preocupação excessiva, tratamento para ansiedade', unit: 'mind', topSlugs: ['francielle-beria', 'manuela-vanti'] },
  { id: 'depressao', label: 'Depressão e tristeza', query: 'Depressão, tristeza profunda, desânimo, anedonia, acompanhamento psicológico', unit: 'mind', topSlugs: ['manuela-vanti', 'francielle-beria'] },
  { id: 'estresse', label: 'Estresse e burnout', query: 'Estresse, burnout, esgotamento, sobrecarga mental, exaustão emocional', unit: 'mind', topSlugs: ['francielle-beria', 'manuela-vanti'] },
  { id: 'tcc', label: 'Terapia cognitivo-comportamental', query: 'TCC, terapia cognitivo comportamental, psicologia clínica, psicoterapia', unit: 'mind', topSlugs: ['manuela-vanti', 'francielle-beria'] },
  { id: 'performance-mental', label: 'Foco e performance mental', query: 'Performance mental, psicologia esportiva, foco, motivação de atleta, competição', unit: 'mind', topSlugs: ['augusto-kauer'] },
  { id: 'pressao-competicao', label: 'Pressão em competições', query: 'Pressão em competição, ansiedade antes de prova, controle emocional no esporte', unit: 'mind', topSlugs: ['augusto-kauer', 'francielle-beria'] },
  { id: 'autoestima', label: 'Autoestima', query: 'Autoestima baixa, autoimagem, confiança, autoconhecimento, bem-estar emocional', unit: 'mind', topSlugs: ['manuela-vanti', 'francielle-beria'] },
  { id: 'luto', label: 'Luto e perdas', query: 'Luto, perda de alguém querido, tristeza prolongada, processo de luto', unit: 'mind', topSlugs: ['manuela-vanti', 'francielle-beria'] },
  { id: 'relacionamentos', label: 'Relacionamentos', query: 'Problemas de relacionamento, dificuldades afetivas, casamento, família, comunicação', unit: 'mind', topSlugs: ['manuela-vanti', 'francielle-beria'] },
];
