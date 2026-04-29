type Rating = 'good' | 'needs-improvement' | 'poor';

function rate(value: number, good: number, poor: number): Rating {
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function report(name: string, value: number, rating: Rating) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'web_vitals', {
      event_category: 'performance',
      event_label: name,
      metric_value: Math.round(value),
      metric_rating: rating,
      page_location: window.location.pathname,
      non_interaction: true,
    });
  }
}

function safeObserve(type: string, cb: (entries: PerformanceEntryList) => void, opts?: object) {
  try {
    const obs = new PerformanceObserver((list) => cb(list.getEntries()));
    obs.observe({ type, buffered: true, ...opts });
  } catch {}
}

export function initWebVitals() {
  // LCP
  safeObserve('largest-contentful-paint', (entries) => {
    const last = entries[entries.length - 1] as any;
    if (last) report('LCP', last.startTime, rate(last.startTime, 2500, 4000));
  });

  // CLS
  let clsValue = 0;
  safeObserve('layout-shift', (entries) => {
    for (const entry of entries) {
      if (!(entry as any).hadRecentInput) clsValue += (entry as any).value;
    }
  });

  // INP
  let inpValue = 0;
  safeObserve('event', (entries) => {
    for (const entry of entries) {
      const dur = (entry as any).duration || 0;
      if (dur > inpValue) inpValue = dur;
    }
  }, { durationThreshold: 16 });

  // FCP
  safeObserve('paint', (entries) => {
    const fcp = entries.find(e => e.name === 'first-contentful-paint');
    if (fcp) report('FCP', fcp.startTime, rate(fcp.startTime, 1800, 3000));
  });

  // TTFB
  safeObserve('navigation', (entries) => {
    const nav = entries[0] as any;
    if (nav) report('TTFB', nav.responseStart, rate(nav.responseStart, 800, 1800));
  });

  // Flush on page hide
  const flush = () => {
    if (clsValue > 0) report('CLS', clsValue, rate(clsValue, 0.1, 0.25));
    if (inpValue > 0) report('INP', inpValue, rate(inpValue, 200, 500));
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);
}
