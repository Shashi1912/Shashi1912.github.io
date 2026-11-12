/* Offline support. Network first, so a new deploy always shows up; the cache is only the fallback when offline.
   Bump CACHE when the file list changes. */
const CACHE = 'sk-portfolio-v5';
const FILES = ['./', 'index.html', 'resume.html', 'base.css', 'design.css', 'features.css', 'resume.css', 'config/site-config.js', 'content.js', 'main.js', 'wingreveal.js', 'arcade.js', 'extras.js', 'ai.js', 'sound.js', 'resume.js',
  'manifest.webmanifest', 'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/original-0.webp', 'assets/original-1.webp', 'assets/Shashikumar_Angajala_Resume.pdf'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
});
