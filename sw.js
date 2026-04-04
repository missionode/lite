const CACHE_NAME = 'chakra-v1.47';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './scripts.json',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './apple-touch-icon.png',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon.ico',
  './symbols/root.png',
  './symbols/sacral.png',
  './symbols/solar.png',
  './symbols/heart.png',
  './symbols/throat.png',
  './symbols/thirdeye.png',
  './symbols/crown.png',
  './symbols/hreem.png',
  './audio/LAM.mp3',
  './audio/VAM.mp3',
  './audio/RAM.mp3',
  './audio/YAM.mp3',
  './audio/HAM.mp3',
  './audio/AUM.mp3',
  './audio/HREEM.mp3',
  './audio/OM.mp3',
  './audio/background_music.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force update immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control of page immediately
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
