/// <reference types="astro/client" />

// Global browser extensions used by GTM, Meta Pixel, and analytics scripts.
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    _gtmLoaded?: boolean;
    _gtmListenersAttached?: boolean;
    _fbqLoaded?: boolean;
    _fbqListenersAttached?: boolean;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
  }
}

export {};
