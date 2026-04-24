// Web Vitals monitoring - self-contained, zero external dependencies.
//
// Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to Google Analytics
// via gtag events. Uses the PerformanceObserver API directly — no web-vitals
// npm package, aligned with the project's zero-library philosophy.
//
// All metrics follow the same rating thresholds used by web.dev:
//   LCP  good ≤2500ms   needs-improvement ≤4000ms  poor >4000ms
//   CLS  good ≤0.1      needs-improvement ≤0.25    poor >0.25
//   INP  good ≤200ms    needs-improvement ≤500ms   poor >500ms
//   FCP  good ≤1800ms   needs-improvement ≤3000ms  poor >3000ms
//   TTFB good ≤800ms    needs-improvement ≤1800ms  poor >1800ms

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type MetricRating = 'good' | 'needs-improvement' | 'poor';

function rate(value: number, good: number, poor: number): MetricRating {
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function report(name: string, value: number, rating: MetricRating): void {
  // Round per web.dev convention: CLS keeps 3 decimals, others are integers.
  const rounded = name === 'CLS' ? Math.round(value * 1000) / 1000 : Math.round(value);
  window.gtag?.('event', 'web_vitals', {
    event_category: 'performance',
    event_label: name,
    metric_name: name,
    metric_value: rounded,
    metric_rating: rating,
    page_location: location.pathname,
    non_interaction: true,
  });
}

function safeObserve(type: string, callback: (entries: PerformanceObserverEntryList) => void): PerformanceObserver | null {
  try {
    const observer = new PerformanceObserver(callback);
    observer.observe({ type, buffered: true });
    return observer;
  } catch {
    return null;
  }
}

// LCP: report the last LCP candidate on page hide / visibility change.
function observeLCP(): void {
  let lastValue = 0;
  const observer = safeObserve('largest-contentful-paint', (list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1] as any;
    if (last) lastValue = last.renderTime || last.loadTime || 0;
  });

  const flush = () => {
    if (lastValue > 0) {
      report('LCP', lastValue, rate(lastValue, 2500, 4000));
      observer?.disconnect();
    }
  };
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); }, { once: true });
  addEventListener('pagehide', flush, { once: true });
}

// CLS: accumulate shifts in session windows (web.dev v2 algorithm).
function observeCLS(): void {
  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: any[] = [];

  safeObserve('layout-shift', (list) => {
    for (const entry of list.getEntries() as any[]) {
      if (entry.hadRecentInput) continue;
      const firstSessionEntry = sessionEntries[0];
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      if (
        sessionValue &&
        entry.startTime - lastSessionEntry.startTime < 1000 &&
        entry.startTime - firstSessionEntry.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      if (sessionValue > clsValue) clsValue = sessionValue;
    }
  });

  const flush = () => report('CLS', clsValue, rate(clsValue, 0.1, 0.25));
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); }, { once: true });
  addEventListener('pagehide', flush, { once: true });
}

// INP: track the worst interaction latency across the page lifetime.
function observeINP(): void {
  let worstDuration = 0;
  safeObserve('event', (list) => {
    for (const entry of list.getEntries() as any[]) {
      if (entry.interactionId && entry.duration > worstDuration) {
        worstDuration = entry.duration;
      }
    }
  });

  const flush = () => {
    if (worstDuration > 0) report('INP', worstDuration, rate(worstDuration, 200, 500));
  };
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); }, { once: true });
  addEventListener('pagehide', flush, { once: true });
}

// FCP: first content paint. Fires once.
function observeFCP(): void {
  safeObserve('paint', (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        report('FCP', entry.startTime, rate(entry.startTime, 1800, 3000));
      }
    }
  });
}

// TTFB: Time To First Byte from navigation timing.
function observeTTFB(): void {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!nav) return;
  const ttfb = nav.responseStart - nav.requestStart;
  if (ttfb > 0) report('TTFB', ttfb, rate(ttfb, 800, 1800));
}

export function initWebVitals(): void {
  if (typeof window === 'undefined') return;
  if (!('PerformanceObserver' in window)) return;

  observeLCP();
  observeCLS();
  observeINP();
  observeFCP();
  observeTTFB();
}
