/* GT-Portal Service Worker – Version und Dateiliste setzt bauen.js ein */
const VERSION = '20261116-5a68c3e';
const FILES = ["./","assets/apple-touch-icon.png","assets/icon-192.png","assets/icon-512.png","assets/standard-folien.svg","assets/standard-spiel.svg","assets/standard-zusammenfassung.svg","index.html","inhalte/kupplung/icon.svg","inhalte/kupplung/index.html","inhalte/redline/icon.svg","manifest.webmanifest"];
const CACHE = 'gt-' + VERSION;

self.addEventListener('install', (e) => {
  // 'reload' umgeht den HTTP-Cache des Servers (GitHub Pages cached ca. 10 Minuten), sonst gäbe es beim Update die alte Version
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(FILES.map((f) => fetch(new Request(f, { cache: 'reload' })).then((r) => { if (!r.ok) throw new Error(f + ' ' + r.status); return c.put(f, r); })))));
});
self.addEventListener('message', (e) => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('gt-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
});
