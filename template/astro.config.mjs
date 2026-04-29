import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://TODO_DOMINIO.com.br',
  integrations: [sitemap()],
});
