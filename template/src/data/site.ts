export const SITE = {
  name: 'TODO_NOME_MARCA',
  tagline: 'TODO_TAGLINE',
  url: 'https://TODO_DOMINIO.com.br',
  phone: 'TODO_TELEFONE',
  email: 'TODO_EMAIL',
  instagram: '@TODO_INSTAGRAM',
  whatsapp: 'TODO_NUMERO_WHATSAPP',
  address: {
    street: 'TODO_RUA',
    number: 'TODO_NUMERO',
    complement: 'TODO_COMPLEMENTO',
    neighborhood: 'TODO_BAIRRO',
    city: 'TODO_CIDADE',
    state: 'TODO_UF',
    zip: 'TODO_CEP',
    country: 'BR',
  },
  coordinates: {
    lat: -0.0, // TODO_LATITUDE
    lng: -0.0, // TODO_LONGITUDE
  },
  cnpj: 'TODO_CNPJ',
  responsavelTecnico: 'TODO_NOME_RT',
  registroProfissional: 'TODO_CRM_CRN_CRP',
  gtmId: 'TODO_GTM_ID',
  metaPixelId: 'TODO_PIXEL_ID',
  gasUrl: 'TODO_GOOGLE_APPS_SCRIPT_URL',
  mapsUrl: 'TODO_GOOGLE_MAPS_URL',
  foundedYear: 2025,
  employeeCount: 1,
};

export const WA_BASE = `https://wa.me/${SITE.whatsapp}`;
export const WA_DEFAULT = `${WA_BASE}?text=${encodeURIComponent('Olá, gostaria de mais informações')}`;

export const PILLARS = [
  {
    slug: 'pilar-1',
    name: 'TODO_PILAR_1',
    description: 'TODO_DESCRICAO',
    href: '/TODO_ROTA',
  },
  {
    slug: 'pilar-2',
    name: 'TODO_PILAR_2',
    description: 'TODO_DESCRICAO',
    href: '/TODO_ROTA',
  },
  {
    slug: 'pilar-3',
    name: 'TODO_PILAR_3',
    description: 'TODO_DESCRICAO',
    href: '/TODO_ROTA',
  },
];

export const NAV_LINKS = [
  { label: 'inicio', href: '/' },
  { label: 'TODO_PILAR_1', href: '/TODO_ROTA' },
  { label: 'TODO_PILAR_2', href: '/TODO_ROTA' },
  { label: 'TODO_PILAR_3', href: '/TODO_ROTA' },
  { label: 'profissionais', href: '/profissionais' },
  { label: 'blog', href: '/blog' },
  { label: 'sobre', href: '/sobre' },
];
