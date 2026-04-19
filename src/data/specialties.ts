export interface Specialty {
  slug: string;
  name: string;
  unit: 'med' | 'esthetic' | 'working' | 'mind';
  description: string;
  keywords: string[]; // Para busca e matching
}

export const specialties: Specialty[] = [
  // ── ecooa.med ──
  {
    slug: 'metabolismo',
    name: 'Metabolismo',
    unit: 'med',
    description: 'Diagnóstico metabólico preciso, análise de biomarcadores e protocolos personalizados.',
    keywords: ['metabolismo', 'taxa metabólica', 'queimador de calorias', 'metabolismo lento', 'síndrome metabólica'],
  },
  {
    slug: 'hormonal',
    name: 'Equilíbrio Hormonal',
    unit: 'med',
    description: 'Reposição hormonal, terapia hormonal, equilíbrio de hormônios femininos e masculinos.',
    keywords: ['hormônios', 'terapia hormonal', 'reposição hormonal', 'menopausa', 'andropausa', 'cortisol', 'tireoide'],
  },
  {
    slug: 'emagrecimento',
    name: 'Emagrecimento',
    unit: 'med',
    description: 'Perda de peso saudável e sustentável com medicina humanizada.',
    keywords: ['emagrecimento', 'perda de peso', 'emagrecer', 'dieta', 'obesidade', 'sobrepeso'],
  },
  {
    slug: 'longevidade',
    name: 'Longevidade',
    unit: 'med',
    description: 'Estratégias científicas para viver mais com qualidade de vida.',
    keywords: ['longevidade', 'envelhecimento', 'anti-aging', 'vida longa', 'preventiva'],
  },
  {
    slug: 'performance',
    name: 'Alta Performance',
    unit: 'med',
    description: 'Medicina de alta performance para atletas e executivos.',
    keywords: ['performance', 'alta performance', 'atleta', 'executivo', 'otimização'],
  },
  {
    slug: 'genetics',
    name: 'Teste Genético',
    unit: 'med',
    description: 'Análise genética para nutrição e saúde personalizada.',
    keywords: ['genético', 'teste genético', 'DNA', 'nutrigenômica'],
  },

  // ── ecooa.esthetic ──
  {
    slug: 'rejuvenescimento-facial',
    name: 'Rejuvenescimento Facial',
    unit: 'esthetic',
    description: 'Procedimentos faciais minimamente invasivos para rejuvenescimento natural.',
    keywords: ['rejuvenescimento', 'facial', 'rosto', 'rugas', 'flacidez'],
  },
  {
    slug: 'corpo',
    name: 'Estética Corporal',
    unit: 'esthetic',
    description: 'Tratamentos corporais para contorno, redução de medidas e melhor definição.',
    keywords: ['corpo', 'estética corporal', 'contorno', 'medidas', 'flacidez corporal'],
  },
  {
    slug: 'capilar',
    name: 'Saúde Capilar',
    unit: 'esthetic',
    description: 'Transplante capilar, tratamento de queda de cabelo e saúde dos cabelos.',
    keywords: ['cabelo', 'queda de cabelo', 'alopecia', 'transplante capilar', 'calvície', 'capilar'],
  },
  {
    slug: 'pele',
    name: 'Saúde da Pele',
    unit: 'esthetic',
    description: 'Tratamentos dermatológicos e cuidados com a pele.',
    keywords: ['pele', 'dermatologia', 'acne', 'melanose', 'manchas'],
  },

  // ── ecooa.working ──
  {
    slug: 'nutrição-clínica',
    name: 'Nutrição Clínica',
    unit: 'working',
    description: 'Nutrição personalizada para saúde, recuperação e bem-estar.',
    keywords: ['nutrição', 'nutricional', 'dieta', 'alimentação saudável', 'clínica'],
  },
  {
    slug: 'nutrição-esportiva',
    name: 'Nutrição Esportiva',
    unit: 'working',
    description: 'Performance nutricional para atletas e praticantes de esportes.',
    keywords: ['esportiva', 'atleta', 'performance', 'musculação', 'crossfit'],
  },
  {
    slug: 'nutrição-estética',
    name: 'Nutrição Estética',
    unit: 'working',
    description: 'Nutrição para pele, cabelo e estética corporal.',
    keywords: ['estética', 'pele', 'cabelo', 'aparência'],
  },
  {
    slug: 'vegetarianismo',
    name: 'Nutrição Vegetariana/Vegana',
    unit: 'working',
    description: 'Nutrição balanceada para dietas vegetarianas e veganas.',
    keywords: ['vegetariana', 'vegana', 'vegetariano', 'veganismo'],
  },

  // ── ecooa.mind ──
  {
    slug: 'psicologia',
    name: 'Psicologia',
    unit: 'mind',
    description: 'Psicologia clínica para bem-estar emocional e saúde mental.',
    keywords: ['psicologia', 'psicólogo', 'terapia', 'emocional', 'mental'],
  },
  {
    slug: 'psiquiatria',
    name: 'Psiquiatria',
    unit: 'mind',
    description: 'Psiquiatria para tratamento de transtornos mentais.',
    keywords: ['psiquiatria', 'psiquiatra', 'medicação', 'transtorno', 'ansiedade', 'depressão'],
  },
  {
    slug: 'coaching',
    name: 'Coaching',
    unit: 'mind',
    description: 'Coaching para desenvolvimento pessoal e profissional.',
    keywords: ['coaching', 'desenvolvimento', 'pessoal', 'profissional', 'objetivo'],
  },
];

export function getSpecialtiesByUnit(unit: 'med' | 'esthetic' | 'working' | 'mind'): Specialty[] {
  return specialties.filter(s => s.unit === unit);
}

export function getSpecialtyBySlug(slug: string): Specialty | undefined {
  return specialties.find(s => s.slug === slug);
}

export function searchSpecialties(query: string): Specialty[] {
  const q = query.toLowerCase();
  return specialties.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.keywords.some(k => k.toLowerCase().includes(q))
  );
}
