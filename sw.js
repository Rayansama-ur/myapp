const CACHE_NAME = 'raylob-v1';
const urlsToCache = [
  '/myapp/',
  '/myapp/index.html',
  '/myapp/style.css',
  '/myapp/app.js',
  '/myapp/books.js',
  '/myapp/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
