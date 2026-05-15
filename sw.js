const CACHE_NAME = 'budgetflow-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './298857.jpg',
  './298860.jpg'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // Force l'installation immédiate
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim(); // Force le contrôle immédiat de la page
});

// Stratégie "Network First" : Cherche en ligne d'abord, puis utilise le cache si hors-ligne
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Met à jour le cache en arrière-plan
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => caches.match(e.request)) // Mode hors-ligne
  );
});
