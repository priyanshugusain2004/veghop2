// Service Worker for VegHop - Basic offline support
// Include a short timestamp/version so deploys can bump cache name automatically.
const CACHE_NAME = 'veghop-v3-' + (new Date().toISOString().replace(/[:.TZ-]/g, ''));
const urlsToCache = [
  './',
  './index.html',
  './src/main.js',
  './src/App.js',
  './src/context/UserContext.js',
  './src/components/UserSelection.js',
  './src/components/VegetableList.js',
  './src/components/Cart.js',
  './src/components/Checkout.js',
  './src/components/AdminLogin.js',
  './src/components/AdminPanel.js',
  './src/data/vegetables.json',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  // Immediately take control on next load
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      // Take control of uncontrolled clients immediately
      return self.clients.claim();
    })
  );
});
