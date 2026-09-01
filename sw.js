const CACHE_NAME = 'chakra-v5.92';
const PIPER_CACHE_NAME = 'chakra-piper-v8';
const LANGUAGE_CACHE_NAME = 'chakra-language-v22';
const ASSETS = [
  './',
  './index.html',
  './docs/assesment.html',
  './docs/repertory.html',
  './data/frequency-repertory.json',
  './timing-config.json',
  './audio/ambience-manifest.json',
  './style.css',
  './app.js',
  './manifest.json',
  './Splash.png',
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
  './symbols/background-only.png',
  './audio/LAM.mp3',
  './audio/VAM.mp3',
  './audio/RAM.mp3',
  './audio/YAM.mp3',
  './audio/HAM.mp3',
  './audio/AUM.mp3',
  './audio/HREEM.mp3',
  './audio/OM.mp3',
  './audio/background_music.mp3?v=20260831.1'
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
                return Promise.all(keys
                    .filter(key => ![CACHE_NAME, PIPER_CACHE_NAME, LANGUAGE_CACHE_NAME].includes(key))
                    .map(key => caches.delete(key)));
            })
        ])
    );
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'piper-clear-cache') {
        event.waitUntil(caches.delete(PIPER_CACHE_NAME));
    }
});

function isPiperRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/piper/') ||
        url.pathname.endsWith('/piper-worker.js') ||
        url.pathname.endsWith('/piper-models.json') ||
        (url.hostname === 'huggingface.co' && url.pathname.includes('/piper-voices/'));
}

function isLanguageRequest(request) {
    const url = new URL(request.url);
    return url.pathname.endsWith('/language-manifest.json') || url.pathname.includes('/locales/');
}

function isPleasureRequest(request) {
    const url = new URL(request.url);
    return url.pathname.endsWith('/audio/ambience-manifest.json') ||
        /\/audio\/pleasure(?:-\d+)?\.[^/]+$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
    if (isPleasureRequest(event.request)) {
        // Pleasure files are optional and may be replaced or moved while the
        // app is being tuned. Do not resurrect an old copy from a cache.
        event.respondWith(fetch(event.request, { cache: 'no-store' }));
        return;
    }

    if (isPiperRequest(event.request)) {
        event.respondWith(caches.open(PIPER_CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(event.request);
            if (cached) return cached;
            const response = await fetch(event.request);
            if (response.ok || response.type === 'opaque') {
                try { await cache.put(event.request, response.clone()); } catch (error) {
                    console.warn('Piper cache write skipped:', error);
                }
            }
            return response;
        }));
        return;
    }

    if (isLanguageRequest(event.request)) {
        event.respondWith(caches.open(LANGUAGE_CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(event.request);
            if (cached) return cached;
            const response = await fetch(event.request);
            if (response.ok) {
                try { await cache.put(event.request, response.clone()); } catch (error) {
                    console.warn('Language cache write skipped:', error);
                }
            }
            return response;
        }));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
    })
  );
});
