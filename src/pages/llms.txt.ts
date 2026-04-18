import type { APIRoute } from 'astro';
import { professionals } from '../data/professionals';
import { getCollection } from 'astro:content';
import { ADDRESS_STREET, ADDRESS_FLOOR, ADDRESS_CITY, ADDRESS_STATE } from '../data/constants';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const unitLabels: Record<string, string> = {
    med: 'ecooa.med (Medicina)',
    esthetic: 'ecooa.esthetic (Estética)',
    working: 'ecooa.working (Nutrição)',
    mind: 'ecooa.mind (Saúde Mental)',
  };

  const profsByUnit = new Map<string, typeof professionals>();
  for (const p of professionals) {
    const list = profsByUnit.get(p.unit) || [];
    list.push(p);
    profsByUnit.set(p.unit, list);
  }

  let md = `# ecooa

> Clínica multidisciplinar de saúde, estética e longevidade em Porto Alegre.

- Site: https://www.somosecooa.com.br
- Endereço: ${ADDRESS_STREET}, ${ADDRESS_FLOOR}, ${ADDRESS_CITY}, ${ADDRESS_STATE}
- WhatsApp: +55 51 99146-0909
- Horário: Seg-Sex 9h-20h
- Fundação: 2021
- Instagram: @somos.ecooa

## Unidades

- **ecooa.med**: Medicina de alta performance, emagrecimento, hormônios, longevidade
- **ecooa.esthetic**: Estética avançada, tricologia, transplante capilar, dermatologia
- **ecooa.mind**: Psicologia clínica, psicologia esportiva, saúde mental integrada
- **ecooa.working**: Nutrição esportiva, clínica, comportamental, ortomolecular

## Profissionais (${professionals.length})

`;

  for (const [unit, profs] of profsByUnit) {
    md += `### ${unitLabels[unit] || unit}\n\n`;
    for (const p of profs) {
      md += `- **${p.name}** - ${p.role.split(' · ').join(', ')}`;
      if (p.isFounder) md += ' (Fundador/a)';
      md += `\n  ${p.description}\n`;
      md += `  Perfil: https://www.somosecooa.com.br/profissionais/${p.slug}\n`;
      if (p.ig) md += `  Instagram: ${p.ig}\n`;
      md += '\n';
    }
  }

  md += `## Blog (${posts.length} artigos)\n\n`;

  for (const post of posts) {
    const date = new Date(post.data.date).toISOString().split('T')[0];
    md += `- [${post.data.title}](https://www.somosecooa.com.br/blog/${post.id}) - ${date} - por ${post.data.author}\n`;
    md += `  ${post.data.description}\n\n`;
  }

  md += `## Páginas principais

- [Home](https://www.somosecooa.com.br/)
- [Quem Somos](https://www.somosecooa.com.br/quem-somos)
- [ecooa.med](https://www.somosecooa.com.br/ecooa-med)
- [ecooa.esthetic](https://www.somosecooa.com.br/ecooa-esthetic)
- [ecooa.mind](https://www.somosecooa.com.br/ecooa-mind)
- [ecooa.working](https://www.somosecooa.com.br/ecooa-working)
- [Profissionais](https://www.somosecooa.com.br/profissionais)
- [Match (triagem inteligente)](https://www.somosecooa.com.br/match)
- [Mentorias](https://www.somosecooa.com.br/mentorias)
- [Blog](https://www.somosecooa.com.br/blog)
- [Contato](https://www.somosecooa.com.br/contato)
- [Agendamento](https://www.somosecooa.com.br/agendamento)

## Feeds

- RSS: https://www.somosecooa.com.br/rss.xml
- JSON Feed: https://www.somosecooa.com.br/feed.json
- Sitemap: https://www.somosecooa.com.br/sitemap-index.xml

## Protocolos Exclusivos (ecooa.med)

- **Método Gehrke 360°**: Método de avaliação metabólica estratificada em três níveis (Reset, Equilíbrio, Performance), individualizando o protocolo por momento clínico do paciente.
- **Protocolo Peso Seguro**: Emagrecimento clínico com acompanhamento médico contínuo, incluindo uso supervisionado de agonistas de GLP-1 quando clinicamente indicados.
- **Protocolo Tricometabólico**: Investigação das causas metabólicas da queda capilar com perfil hormonal, nutrientes e mapeamento genético quando indicado.
- **Bioimplantes Metabólicos**: Implantes subcutâneos bioabsorvíveis de liberação farmacocinética estável para reposição hormonal individualizada.
`;

  return new Response(md, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
