export interface ConversionMeta {
  formType: string;
  source: string;
  specialty?: string;
  professional?: string;
  timestamp: number;
}

export function trackConversion(meta: ConversionMeta) {
  // Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'conversion', {
      value: 1,
      currency: 'BRL',
      transaction_id: `conversion_${Date.now()}`,
      form_type: meta.formType,
      source: meta.source,
      specialty: meta.specialty,
      professional: meta.professional,
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('📊 Conversion tracked:', meta);
  }

  // Store in localStorage for later analysis
  const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
  conversions.push(meta);
  localStorage.setItem('conversions', JSON.stringify(conversions.slice(-10))); // Keep last 10
}

export function setupFormConversionTracking() {
  if (typeof document === 'undefined') return;

  // Track all form submissions with conversion data
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const formType = form.querySelector('input[name="_formType"]')?.getAttribute('value');
    const source = form.querySelector('input[name="_source"]')?.getAttribute('value');

    // Extract specialty/professional from URL if available
    const url = new URL(window.location.href);
    const specialty = url.pathname.includes('/especialidade/')
      ? url.pathname.split('/especialidade/')[1]
      : undefined;
    const professional = url.pathname.includes('/profissionais/')
      ? url.pathname.split('/profissionais/')[1]
      : undefined;

    trackConversion({
      formType: formType || 'contact',
      source: source || url.pathname,
      specialty,
      professional,
      timestamp: Date.now(),
    });
  });
}

// Form success messaging
export function setupFormSuccessTracking() {
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const successTarget = form.getAttribute('data-ok-target');
    const successMessage = form.getAttribute('data-success-text') || 'Enviado com sucesso!';

    if (successTarget) {
      const successEl = document.querySelector(successTarget);
      if (successEl) {
        successEl.textContent = successMessage;
        successEl.style.display = 'block';

        // Optional: Hide success message after 5 seconds
        setTimeout(() => {
          successEl.style.display = 'none';
        }, 5000);
      }
    }
  });
}

// Initialize on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupFormConversionTracking();
      setupFormSuccessTracking();
    });
  } else {
    setupFormConversionTracking();
    setupFormSuccessTracking();
  }
}
