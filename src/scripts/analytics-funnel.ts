import { gtag } from 'ga';

// Funnel stages: awareness → consideration → decision → conversion
export interface FunnelEvent {
  stage: 'awareness' | 'consideration' | 'decision' | 'conversion';
  page: string;
  action: string;
  value?: number;
  label?: string;
}

export function trackFunnelEvent(event: FunnelEvent) {
  if (typeof gtag === 'undefined') return;

  const eventMap = {
    awareness: 'page_view',
    consideration: 'view_item',
    decision: 'add_to_cart', // Metaphorically: "added to consideration"
    conversion: 'purchase', // Metaphorically: "purchased" = "agendou"
  };

  gtag('event', eventMap[event.stage], {
    funnel_stage: event.stage,
    page_location: event.page,
    event_label: event.label || event.action,
    value: event.value,
    currency: 'BRL',
  });
}

// Auto-track page views
export function initFunnelTracking() {
  if (typeof window === 'undefined') return;

  const pathname = window.location.pathname;

  // Awareness: any page view
  trackFunnelEvent({
    stage: 'awareness',
    page: pathname,
    action: 'page_view',
  });

  // Consideration: when user clicks specialty/service link
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (link) {
      const href = link.getAttribute('href') || '';

      // Check if clicking on specialty/service
      if (href.includes('/ecooa-') || href.includes('/especialidade/')) {
        trackFunnelEvent({
          stage: 'consideration',
          page: pathname,
          action: 'click_specialty',
          label: href,
        });
      }

      // Check if clicking on professional
      if (href.includes('/profissionais/')) {
        trackFunnelEvent({
          stage: 'decision',
          page: pathname,
          action: 'click_professional',
          label: href,
        });
      }

      // Check if clicking on booking/whatsapp
      if (href.includes('/agendamento') || href.includes('wa.me')) {
        trackFunnelEvent({
          stage: 'decision',
          page: pathname,
          action: 'click_cta',
          label: href,
        });
      }
    }
  });

  // Conversion: form submission
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const formType = form.querySelector('input[name="_formType"]')?.getAttribute('value');

    trackFunnelEvent({
      stage: 'conversion',
      page: pathname,
      action: 'form_submit',
      label: formType || 'unknown',
    });
  });
}

// Track time on page
export function trackPageEngagement() {
  let timeOnPage = 0;
  const interval = setInterval(() => {
    timeOnPage += 10;
  }, 10000); // Every 10 seconds

  window.addEventListener('beforeunload', () => {
    clearInterval(interval);
    if (timeOnPage > 30000) { // More than 30 seconds
      trackFunnelEvent({
        stage: 'consideration',
        page: window.location.pathname,
        action: 'high_engagement',
        value: Math.round(timeOnPage / 1000), // seconds
      });
    }
  });
}

// Initialize on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFunnelTracking();
      trackPageEngagement();
    });
  } else {
    initFunnelTracking();
    trackPageEngagement();
  }
}
