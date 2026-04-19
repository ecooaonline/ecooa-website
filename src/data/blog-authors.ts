export interface BlogAuthor {
  name: string;
  slug: string;
  role: string;
  specialty: string;
  unit: 'med' | 'esthetic' | 'working' | 'mind';
  instagram?: string;
}

export const blogAuthors: BlogAuthor[] = [
  {
    name: 'Dr. Gustavo Gehrke',
    slug: 'gustavo-gehrke',
    role: 'Médico Generalista',
    specialty: 'Medicina de Alta Performance',
    unit: 'med',
    instagram: 'gustavo.gehrke',
  },
  {
    name: 'Dra. Larissa Wiebbelling',
    slug: 'larissa-wiebbelling',
    role: 'Médica Tricologista',
    specialty: 'Tricologia e Transplante Capilar',
    unit: 'esthetic',
    instagram: 'dra.larissawiebbelling',
  },
  {
    name: 'Dra. Yale',
    slug: 'yale-schmitz',
    role: 'Médica Dermatologista',
    specialty: 'Saúde Capilar Feminina',
    unit: 'esthetic',
  },
  {
    name: 'Manuela Vanti',
    slug: 'manuela-vanti',
    role: 'Psicóloga Clínica',
    specialty: 'Psicologia Clínica',
    unit: 'mind',
  },
  {
    name: 'Jessica Stein',
    slug: 'jessica-stein',
    role: 'Nutricionista',
    specialty: 'Nutrição Clínica',
    unit: 'working',
  },
  {
    name: 'Maria Luisa Beltran',
    slug: 'maria-luisa-beltran',
    role: 'Nutricionista',
    specialty: 'Nutrição Esportiva',
    unit: 'working',
  },
  {
    name: 'Adriano Lenz',
    slug: 'adriano-lenz',
    role: 'Médico',
    specialty: 'Medicina Ortomolecular',
    unit: 'med',
  },
  {
    name: 'Viviane Fagundes',
    slug: 'viviane-fagundes',
    role: 'Enfermeira Capilar',
    specialty: 'Teste Genético Capilar',
    unit: 'esthetic',
  },
  {
    name: 'Giancarla',
    slug: 'giancarla-rochemback',
    role: 'Nutricionista',
    specialty: 'Nutrição e Bioimpedância',
    unit: 'working',
  },
  {
    name: 'Danusa',
    slug: 'danusa-borba',
    role: 'Enfermeira',
    specialty: 'Soroterapia',
    unit: 'med',
  },
];

export function getAuthorByName(name: string): BlogAuthor | undefined {
  return blogAuthors.find(a => a.name === name);
}

export function getAuthorBySlug(slug: string): BlogAuthor | undefined {
  return blogAuthors.find(a => a.slug === slug);
}
