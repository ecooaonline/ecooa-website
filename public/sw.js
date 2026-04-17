const VERSION = 'ecooa-v2';
const STATIC_CACHE = VERSION + '-static';
const RUNTIME_CACHE = VERSION + '-runtime';
const OFFLINE_URL = '/';

const PRECACHE = [
  OFFLINE_URL,
  '/fonts/arboria-300.woff2',
  '/fonts/arboria-400.woff2',
  '/fonts/arboria-500.woff2',
  '/fonts/playfair-italic.woff2',
  '/favicon/favicon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(cacheName).then((c) => c.put(request, copy));
      }
      return res;
    });
  });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.match(request).then((cached) => {
    const fetching = fetch(request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(cacheName).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() => cached);
    return cached || fetching;
  });
}

function networkFirst(request, cacheName) {
  return fetch(request)
    .then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(cacheName).then((c) => c.put(request, copy));
      }
      return res;
    })
    .catch(() => caches.match(request).then((r) => r || caches.match(OFFLINE_URL)));
}

self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin (analytics, GTM, Pixel, CDN)
  if (url.origin !== self.location.origin) return;

  // HTML navigation: network-first
  if (request.mode === 'navigate') {
    e.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Astro-generated hashed assets: cache-first (safe forever, hash invalidates)
  if (url.pathname.startsWith('/_astro/')) {
    e.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Fonts and favicons: cache-first
  if (
    (url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/favicon/')) &&
    /\.(woff2?|ttf|otf|svg|png|ico)$/i.test(url.pathname)
  ) {
    e.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images: stale-while-revalidate
  if (/\.(webp|avif|jpg|jpeg|png|gif|svg)$/i.test(url.pathname)) {
    e.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // Default: stale-while-revalidate for other same-origin GET
  e.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});
