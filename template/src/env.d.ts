/// <reference types="astro/client" />

interface Window {
  dataLayer: Record<string, unknown>[];
  gtag: (...args: unknown[]) => void;
  fbq: (...args: unknown[]) => void;
  _gtmLoaded?: boolean;
  _fbqLoaded?: boolean;
  _fbqListenersAttached?: boolean;
}
