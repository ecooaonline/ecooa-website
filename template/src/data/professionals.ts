export interface Professional {
  slug: string;
  name: string;
  role: string;
  unit: string;
  photo?: string;
  bg: string;
  ig?: string;
  description: string;
  tags: string[];
  registration?: string;
  education?: {
    graduation: string;
    postgrad?: string[];
    residency?: string;
  };
  specialties?: string[];
  mainComplaints?: string[];
}

export const professionals: Professional[] = [
  {
    slug: 'TODO_SLUG',
    name: 'TODO_NOME',
    role: 'TODO_ESPECIALIDADE',
    unit: 'TODO_UNIDADE',
    photo: '/team/TODO_FOTO.webp',
    bg: '#C4BBB8',
    ig: '@TODO_INSTAGRAM',
    description: 'TODO_BIO',
    tags: ['TODO_TAG_1', 'TODO_TAG_2'],
    registration: 'TODO_REGISTRO',
    education: {
      graduation: 'TODO_GRADUACAO',
      postgrad: ['TODO_POS'],
    },
    specialties: ['TODO_ESPECIALIDADE'],
    mainComplaints: ['TODO_QUEIXA_1', 'TODO_QUEIXA_2'],
  },
];

export function getProfessionalBySlug(slug: string) {
  return professionals.find(p => p.slug === slug);
}

export function getProfessionalsByUnit(unit: string) {
  return professionals.filter(p => p.unit === unit);
}
