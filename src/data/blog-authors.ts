export interface BlogAuthor {
  name: string;
  slug: string;
  role: string;
  unit: 'med' | 'esthetic' | 'working' | 'mind';
}

export const blogAuthors: BlogAuthor[] = [
  // ── ecooa.med ──
  {
    name: 'Dr. Gustavo Gehrke',
    slug: 'gustavo-gehrke',
    role: 'Médico Generalista',
    unit: 'med',
  },

  // ── ecooa.esthetic ──
  // (será adicionado conforme especialistas colaborem)

  // ── ecooa.working ──
  {
    name: 'Jessica Stein',
    slug: 'jessica-stein',
    role: 'Nutricionista',
    unit: 'working',
  },

  // ── ecooa.mind ──
  // (será adicionado conforme especialistas colaborem)
];

export function getAuthorByName(name: string): BlogAuthor | undefined {
  return blogAuthors.find(a => a.name.toLowerCase() === name.toLowerCase());
}

export function getAuthorBySlug(slug: string): BlogAuthor | undefined {
  return blogAuthors.find(a => a.slug === slug);
}

export function isValidAuthor(name: string): boolean {
  return blogAuthors.some(a => a.name.toLowerCase() === name.toLowerCase());
}
