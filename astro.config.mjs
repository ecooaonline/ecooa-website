// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.somosecooa.com.br',
  // Redirects das URLs antigas de especialidade (slugs com acento → slugs limpos).
  // As URLs antigas eram percent-encoded (nutri%C3%A7%C3%A3o-cl%C3%ADnica); preservamos
  // o acesso para qualquer link externo já existente.
  redirects: {
    '/especialidade/nutrição-clínica': '/especialidade/nutricao-clinica',
    '/especialidade/nutrição-esportiva': '/especialidade/nutricao-esportiva',
    '/especialidade/nutrição-estética': '/especialidade/nutricao-estetica',
  },
  integrations: [
    sitemap({
      // Exclui do sitemap páginas noindex e as páginas de redirect (slugs antigos).
      filter: (page) =>
        !page.includes('/obrigado') &&
        !page.includes('nutri%C3%A7%C3%A3o') &&
        !page.includes('nutrição'),
    }),
  ],
});
