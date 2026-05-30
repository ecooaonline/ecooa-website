export const WA_BASE = 'https://wa.me/5551991460909';
export const WA_DEFAULT = `${WA_BASE}?text=${encodeURIComponent('Olá, gostaria de agendar uma avaliação com a equipe ecooa')}`;
export const GOOGLE_MAPS = 'https://www.google.com/maps/place/ecooa';
export const INSTAGRAM = 'https://instagram.com/somos.ecooa';
export const PHONE = '(51) 99146-0909';
export const EMAIL = 'ecooa.adm@gmail.com';

// Endereço
export const ADDRESS_STREET = 'Rua Mariante, 180';
export const ADDRESS_FLOOR = '9º andar';
export const ADDRESS_NEIGHBORHOOD = 'Moinhos de Vento';
export const ADDRESS_CITY = 'Porto Alegre';
export const ADDRESS_STATE = 'RS';
export const ADDRESS_ZIP = '90430-180';
export const ADDRESS_FULL = `${ADDRESS_STREET} · ${ADDRESS_FLOOR} · ${ADDRESS_NEIGHBORHOOD} · ${ADDRESS_CITY}, ${ADDRESS_STATE}`;

// Google Tag Manager — lido de variável de ambiente; fallback para o ID de produção.
// Para mudar: defina PUBLIC_GTM_ID no .env (ou secrets do GitHub Actions).
export const GTM_ID = import.meta.env.PUBLIC_GTM_ID ?? 'GTM-TSR4GDMK';

// Google Apps Script — URL do formulário.
// Para mudar: defina FORM_ACTION no .env (ou secrets do GitHub Actions).
export const FORM_ACTION =
  import.meta.env.FORM_ACTION ??
  'https://script.google.com/macros/s/AKfycbx3NOzVryn9prCJvKuBH20EFGiHoCENEZdR73zjaeiiUCl9PXk2sKrzGxrcrQ3ahQ-v/exec';

// Meta Pixel (Facebook/Instagram Ads) — lido de variável de ambiente.
export const META_PIXEL_ID = import.meta.env.PUBLIC_META_PIXEL_ID ?? '795926643274151';
