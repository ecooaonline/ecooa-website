import { professionals } from './professionals';

export interface BlogAuthor {
  name: string;
  slug: string;
  role: string;
  specialty: string;
  unit: 'med' | 'esthetic' | 'working' | 'mind';
  instagram?: string;
}

function toBlogAuthor(prof: (typeof professionals)[0]): BlogAuthor {
  return {
    name: prof.blogAuthor!.name,
    slug: prof.slug,
    role: prof.blogAuthor!.role,
    specialty: prof.blogAuthor!.specialty,
    unit: prof.unit,
    instagram: prof.blogAuthor!.instagram,
  };
}

export function getAuthorByName(name: string): BlogAuthor | undefined {
  const prof = professionals.find((p) => p.blogAuthor?.name === name);
  return prof?.blogAuthor ? toBlogAuthor(prof) : undefined;
}
