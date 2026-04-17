/**
 * Google Analytics 4 Event Tracking
 * Centralized event management for ecooa conversions
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export function initAnalyticsEvents() {
  if (typeof window === 'undefined') return;

  function onGtagReady(callback: () => void) {
    if (window.gtag) { callback(); return; }
    const check = setInterval(() => {
      if (window.gtag) { clearInterval(check); callback(); }
    }, 500);
    setTimeout(() => clearInterval(check), 30000);
  }

  onGtagReady(() => {
    setupTracking();
  });
}

function setupTracking() {
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
      window.fbq?.('track', 'Contact', { content_name: professionalName });
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

  // form_submit tracking moved to form-submit.ts (fires form_submit_success/error)

  // Track page engagement time
  trackEngagement();

  // Track funnel steps
  trackFunnelSteps();
}

function trackUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
  const utmData: Record<string, string> = {};

  utmKeys.forEach(key => {
    const val = params.get(key) || sessionStorage.getItem(`ecooa_${key}`) || '';
    if (val) {
      utmData[key] = val;
      sessionStorage.setItem(`ecooa_${key}`, val);
    }
  });

  if (!sessionStorage.getItem('ecooa_landing')) {
    sessionStorage.setItem('ecooa_landing', document.location.pathname);
  }

  if (utmData.utm_source) {
    window.gtag?.('event', 'campaign_landing', {
      event_category: 'acquisition',
      ...utmData,
      landing_page: sessionStorage.getItem('ecooa_landing') || document.location.pathname,
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

function trackFunnelSteps() {
  const path = document.location.pathname;
  const funnelMap: Record<string, string> = {
    '/': 'funnel_homepage',
    '/ecooa-med': 'funnel_service_med',
    '/ecooa-esthetic': 'funnel_service_esthetic',
    '/ecooa-mind': 'funnel_service_mind',
    '/ecooa-working': 'funnel_service_working',
    '/agendamento': 'funnel_scheduling',
    '/contato': 'funnel_contact',
    '/profissionais': 'funnel_professionals',
  };
  const step = funnelMap[path];
  if (step) {
    window.gtag?.('event', step, {
      event_category: 'funnel',
      page_location: path,
      referrer: document.referrer,
    });
  }
}

// Exported for deferred initialization via dynamic import
