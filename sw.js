const CACHE_NAME = 'gym-tracker-v1.3.0';
const ASSETS = ['tracker.html'];

// Install: pre-cache tracker.html
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old caches, claim clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('gym-tracker-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate for HTML, passthrough for version checks
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Version-check requests (cache-bust param) — always go to network
  if (url.searchParams.has('_v')) return;

  // Only handle navigation requests for tracker.html
  if (e.request.mode !== 'navigate') return;

  e.respondWith(
    caches.match('tracker.html').then(cached => {
      // Fetch fresh copy in background and update cache
      const networkUpdate = fetch(e.request)
        .then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME)
              .then(cache => cache.put('tracker.html', response));
          }
          return response.clone();
        })
        .catch(() => null);

      // Return cached immediately if available, otherwise wait for network
      return cached || networkUpdate;
    })
  );
});
