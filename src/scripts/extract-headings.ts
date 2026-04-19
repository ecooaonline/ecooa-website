export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadingsFromHTML(html: string): Heading[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings: Heading[] = [];

  // Extrai h2 e h3 (h1 é o título da página)
  const elements = doc.querySelectorAll('h2, h3');

  elements.forEach((el) => {
    const level = parseInt(el.tagName[1]);
    const text = el.textContent?.trim() || '';

    if (text) {
      // Gera ID a partir do texto se não houver
      let id = el.id;
      if (!id) {
        id = text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '-') // Espaços viram hífens
          .replace(/-+/g, '-') // Remove hífens duplicados
          .trim();
      }

      headings.push({ id, text, level });
    }
  });

  return headings;
}

export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Espaços viram hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}
