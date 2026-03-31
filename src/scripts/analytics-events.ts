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

  // Track "Agendar Avaliação" button clicks (main CTA)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (!link) return;

    // Schedule appointment CTA
    if (link.href?.includes('/agendamento')) {
      window.gtag?.('event', 'agendar_avaliacao', {
        event_category: 'conversion',
        event_label: 'main_cta',
        button_text: link.textContent?.trim(),
      });
    }

    // WhatsApp clicks
    if (link.href?.includes('wa.me')) {
      const profesionalName = link.getAttribute('data-professional-name') || 'geral';
      window.gtag?.('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: profesionalName,
        whatsapp_phone: '5551991460909',
      });
    }

    // Instagram clicks
    if (link.href?.includes('instagram.com')) {
      const handle = link.href.split('/').pop() || 'somos.ecooa';
      window.gtag?.('event', 'instagram_click', {
        event_category: 'social',
        event_label: handle,
      });
    }

    // Professional card modal (clickable cards)
    if (link.getAttribute('data-modal') === 'professional') {
      const professionalName = link.getAttribute('data-professional-name') || 'unknown';
      window.gtag?.('event', 'professional_modal_open', {
        event_category: 'engagement',
        event_label: professionalName,
        professional_specialty: link.getAttribute('data-specialty'),
      });
    }

    // Contact form or contact page
    if (link.href?.includes('/contato')) {
      window.gtag?.('event', 'contact_page_click', {
        event_category: 'engagement',
      });
    }
  });

  // Track scroll depth
  trackScrollDepth();

  // Track form submissions
  trackFormSubmissions();

  // Track page load time
  trackPageLoadTime();
}

function trackScrollDepth() {
  const thresholds = [0.25, 0.5, 0.75, 1.0];
  const tracked = new Set<number>();

  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        window.gtag?.('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: `${Math.round(threshold * 100)}%`,
          scroll_depth_percent: Math.round(threshold * 100),
        });
      }
    });
  });
}

function trackFormSubmissions() {
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const formId = form.id || form.className || 'unknown';

    window.gtag?.('event', 'form_submit', {
      event_category: 'conversion',
      event_label: formId,
      form_name: form.name,
    });
  });
}

function trackPageLoadTime() {
  if (!window.performance) return;

  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    window.gtag?.('event', 'page_load_time', {
      event_category: 'performance',
      event_label: document.location.pathname,
      page_load_ms: pageLoadTime,
      value: pageLoadTime,
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalyticsEvents);
} else {
  initAnalyticsEvents();
}
