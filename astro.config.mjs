// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.somosecooa.com.br',
  // Redirects de URLs antigas já publicadas:
  // - slugs de especialidade com acento (percent-encoded) → slugs limpos
  // - psiquiatria (especialidade removida até haver psiquiatra no quadro) → ecooa-mind
  // - perfil de profissional que saiu da equipe → roster
  redirects: {
    '/especialidade/nutrição-clínica': '/especialidade/nutricao-clinica',
    '/especialidade/nutrição-esportiva': '/especialidade/nutricao-esportiva',
    '/especialidade/nutrição-estética': '/especialidade/nutricao-estetica',
    '/especialidade/psiquiatria': '/ecooa-mind',
    '/profissionais/cris-neumann': '/profissionais',
  },
  integrations: [
    sitemap({
      // Exclui do sitemap páginas noindex e as páginas de redirect (slugs antigos).
      filter: (page) =>
        !page.includes('/obrigado') &&
        !page.includes('/offline') &&
        !page.includes('nutri%C3%A7%C3%A3o') &&
        !page.includes('nutrição') &&
        !page.includes('/especialidade/psiquiatria') &&
        !page.includes('/profissionais/cris-neumann'),
    }),
  ],
});
