/**
 * Google Analytics 4 Event Tracking
 * Centralized event management for ecooa conversions
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function initAnalyticsEvents() {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Capture UTM parameters on landing
  trackUTMParameters();

  // Track "Agendar Avaliação" button clicks (main CTA)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a') || target.closest('[data-modal="professional"]');

    if (!link) return;

    const anchor = link as HTMLAnchorElement;
    const href = anchor.href || '';

    // Schedule appointment CTA
    if (href.includes('/agendamento')) {
      window.gtag?.('event', 'agendar_avaliacao', {
        event_category: 'conversion',
        event_label: document.location.pathname,
        button_text: anchor.textContent?.trim(),
      });
    }

    // WhatsApp clicks
    if (href.includes('wa.me')) {
      const professionalName = anchor.getAttribute('data-professional-name') || 'geral';
      window.gtag?.('event', 'whatsapp_click', {
        event_category: 'conversion',
        event_label: professionalName,
        page_location: document.location.pathname,
      });
    }

    // Instagram clicks
    if (href.includes('instagram.com')) {
      const handle = href.split('/').filter(Boolean).pop() || 'somos.ecooa';
      window.gtag?.('event', 'instagram_click', {
        event_category: 'social',
        event_label: handle,
        page_location: document.location.pathname,
      });
    }

    // Professional card modal (clickable cards)
    if (link.getAttribute('data-modal') === 'professional') {
      const professionalName = link.getAttribute('data-professional-name') || 'unknown';
      window.gtag?.('event', 'professional_view', {
        event_category: 'engagement',
        event_label: professionalName,
        professional_specialty: link.getAttribute('data-specialty'),
      });
    }

    // Contact page
    if (href.includes('/contato')) {
      window.gtag?.('event', 'contact_click', {
        event_category: 'engagement',
        page_location: document.location.pathname,
      });
    }

    // Outbound links (external)
    if (anchor.hostname && anchor.hostname !== window.location.hostname) {
      window.gtag?.('event', 'outbound_click', {
        event_category: 'outbound',
        event_label: anchor.href,
        page_location: document.location.pathname,
      });
    }

    // Phone clicks
    if (href.startsWith('tel:')) {
      window.gtag?.('event', 'phone_click', {
        event_category: 'conversion',
        event_label: href.replace('tel:', ''),
      });
    }
  });

  // Track scroll depth
  trackScrollDepth();

  // Track form submissions
  trackFormSubmissions();

  // Track page engagement time
  trackEngagement();
}

function trackUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  const utmContent = params.get('utm_content');
  const utmTerm = params.get('utm_term');

  if (utmSource) {
    window.gtag?.('event', 'campaign_landing', {
      event_category: 'acquisition',
      utm_source: utmSource,
      utm_medium: utmMedium || '(not set)',
      utm_campaign: utmCampaign || '(not set)',
      utm_content: utmContent || '(not set)',
      utm_term: utmTerm || '(not set)',
      landing_page: document.location.pathname,
    });
  }
}

function trackScrollDepth() {
  const thresholds = [0.25, 0.5, 0.75, 1.0];
  const tracked = new Set<number>();
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          window.gtag?.('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: `${Math.round(threshold * 100)}%`,
            page_location: document.location.pathname,
          });
        }
      });
      ticking = false;
    });
  }, { passive: true });
}

function trackFormSubmissions() {
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    window.gtag?.('event', 'form_submit', {
      event_category: 'conversion',
      event_label: form.id || form.action || 'unknown',
      page_location: document.location.pathname,
    });
  });
}

function trackEngagement() {
  let engagedTime = 0;
  let isVisible = true;

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  setInterval(() => {
    if (isVisible) engagedTime += 10;

    // Report at 30s, 60s, 120s, 300s
    if ([30, 60, 120, 300].includes(engagedTime)) {
      window.gtag?.('event', 'engaged_time', {
        event_category: 'engagement',
        event_label: `${engagedTime}s`,
        page_location: document.location.pathname,
        value: engagedTime,
      });
    }
  }, 10000);
}

// Exported for deferred initialization via dynamic import
