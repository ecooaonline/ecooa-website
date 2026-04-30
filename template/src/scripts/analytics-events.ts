function track(event: string, params: Record<string, string>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, { ...params, non_interaction: true });
  }
}

function trackClicks(selector: string, event: string, getParams: (el: HTMLElement) => Record<string, string>) {
  document.querySelectorAll<HTMLElement>(selector).forEach(el => {
    el.addEventListener('click', () => track(event, getParams(el)));
  });
}

export function initAnalyticsEvents() {
  trackClicks('a[href*="wa.me"], a[href*="whatsapp"]', 'whatsapp_click', (el) => ({
    page_location: window.location.pathname,
    button_text: el.textContent?.trim() || '',
  }));

  trackClicks('a[href*="instagram.com"]', 'instagram_click', (el) => ({
    handle: el.textContent?.trim() || '',
    page_location: window.location.pathname,
  }));

  trackClicks('a[href="/agendamento"], a[href*="/agendamento?"]', 'agendar_avaliacao', (el) => ({
    page_location: window.location.pathname,
    button_text: el.textContent?.trim() || '',
  }));

  trackClicks('a[href^="/profissionais/"]', 'professional_view', (el) => ({
    page_location: window.location.pathname,
    professional: el.getAttribute('href') || '',
  }));

  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach(el => {
    if (el.hostname !== window.location.hostname) {
      el.addEventListener('click', () => track('outbound_click', {
        event_label: el.href,
        page_location: window.location.pathname,
      }));
    }
  });

  trackClicks('a[href^="tel:"]', 'phone_click', () => ({
    page_location: window.location.pathname,
  }));

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    const val = params.get(key);
    if (val) utm[key] = val;
  });
  if (Object.keys(utm).length > 0) {
    track('utm_captured', utm);
  }
}
