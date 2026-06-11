// Utilitários de SEO compartilhados entre templates.

export const SEO_DESCRIPTION_MAX = 160;

/**
 * Limita uma meta description a 160 caracteres (evita truncamento na SERP).
 * Prioridade: texto + CTA; se não couber, só o texto; se ainda exceder,
 * corta em fronteira de palavra com reticências.
 */
export function clampSeoDescription(text: string, cta = ''): string {
  let out = cta && (text + cta).length <= SEO_DESCRIPTION_MAX ? text + cta : text;
  if (out.length > SEO_DESCRIPTION_MAX) {
    out = out.slice(0, SEO_DESCRIPTION_MAX - 1).replace(/\s+\S*$/u, '') + '…';
  }
  return out;
}
