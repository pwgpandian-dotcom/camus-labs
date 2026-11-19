// Minimal service worker: caches the app shell so the screen opens fast. All data always comes live from the server.
const CACHE = 'aurum-pos-v4';
const SHELL = ['/', '/install', '/app.css', '/app.js', '/fonts/fonts.css', '/manifest.webmanifest'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.pathname.startsWith('/api') || u.pathname.startsWith('/socket.io')) return;
  // Network first. If the server is down or answers with an error page, open the saved copy so the
  // "Use laptop server" button still shows.
  const saved = () => caches.match(e.request, { ignoreSearch: true }).then((m) => m || (e.request.mode === 'navigate' ? caches.match('/') : undefined));
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; }
    return saved().then((m) => m || r);
  }).catch(() => saved()));
});
