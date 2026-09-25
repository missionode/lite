const CACHE_NAME = 'chakra-v5.310';
const PIPER_CACHE_NAME = 'chakra-piper-v9';
const LANGUAGE_CACHE_NAME = 'chakra-language-v53';
const ASSETS = [
  './',
  './index.html',
  './docs/assesment.html',
  './modules/assessment-tournament.js?v=1.2',
  './modules/assessment-persistence.js?v=1.0',
  './data/assessment-questions.json?v=1.1',
  './docs/repertory.html',
  './data/frequency-repertory.json',
  './timing-config.json',
  './audio/ambience-manifest.json',
  './style.css?v=2.03',
  './app.js?v=4.12',
  './modules/journey-chrome.js?v=1.0',
  './modules/journey-video-prelude.js?v=1.0',
  './modules/ambient-particle-field.js?v=1.0',
  './modules/visual-engine.js?v=1.0',
  './vendor/astronomy.browser.min.js?v=2.1.19',
  './data/sky-stars.js?v=1.0',
  './sky-astronomy.js?v=1.1',
  './night-sky.js?v=1.1',
  './celestial-presence.js?v=1.2',
  './modules/settings-backup.js?v=1.0',
  './modules/settings-manager-view.js?v=1.0',
  './modules/audio-volume-settings-view.js?v=1.0',
  './modules/audio-effects-settings-view.js?v=1.0',
  './modules/journey-preparation-selection.js?v=1.0',
  './modules/app-state.js?v=1.1',
  './modules/content-localization.js?v=1.0',
  './modules/media-lifecycle.js?v=1.0',
  './modules/piper-lifecycle.js?v=1.0',
  './modules/audio-route-lifecycle.js?v=1.0',
  './modules/audio-engine-initialization.js?v=1.0',
  './modules/audio-signal-design.js?v=1.0',
  './modules/audio-spatial-geometry.js?v=1.0',
  './modules/audio-elemental-layer.js?v=1.0',
  './modules/audio-tone-playback.js?v=1.0',
  './modules/audio-drone-start.js?v=1.0',
  './modules/audio-drone-stop.js?v=1.0',
  './modules/audio-mantra-playback.js?v=1.0',
  './modules/audio-background-music-lifecycle.js?v=1.0',
  './modules/audio-background-music-controls.js?v=1.0',
  './modules/audio-music-echo.js?v=1.0',
  './modules/journey-hypnosis-wrapper.js?v=1.0',
  './modules/journey-opening-stage.js?v=1.0',
  './modules/journey-content-loader.js?v=1.0',
  './modules/journey-routing.js?v=1.2',
  './modules/practice-module-loader.js?v=1.0',
  './modules/body-scan-practice.js?v=1.0',
  './modules/guided-noting-practice.js?v=1.0',
  './modules/dharana-practice.js?v=1.0',
  './modules/box-breathing-practice.js?v=1.0',
  './modules/visualization-practice.js?v=1.0',
  './modules/hooponopono-practice.js?v=1.0',
  './modules/undo-unlearn-practice.js?v=1.0',
  './modules/screen-navigation.js?v=1.0',
  './modules/session-estimate.js?v=1.0',
  './modules/session-countdown.js?v=1.0',
  './modules/newcomer-marker-layout.js?v=1.0',
  './modules/mood-ambience-settings-view.js?v=1.0',
  './modules/drone-duration-settings-view.js?v=1.0',
  './modules/lobby-experience-visibility.js?v=1.0',
  './modules/yoga-experience-settings.js?v=1.0',
  './modules/range-controls.js?v=1.0',
  './modules/journey-roadmap.js?v=1.0',
  './modules/locale-ui-renderer.js?v=1.0',
  './modules/timing-settings.js?v=1.0',
  './modules/timing-settings-view.js?v=1.0',
  './modules/journey-voice-profile.js?v=1.0',
  './modules/session-mode-hydration.js?v=1.0',
  './modules/mixer-preference-hydration.js?v=1.0',
  './modules/journey-selection-hydration.js?v=1.0',
  './modules/timing-preference-hydration.js?v=1.0',
  './modules/appearance-preference-hydration.js?v=1.0',
  './modules/script-preference-hydration.js?v=1.0',
  './modules/care-preference-hydration.js?v=1.0',
  './manifest.json',
  './Splash-v2.png',
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
