(function installUndoUnlearnPractice(global) {
    'use strict';

    async function run({
        minutes,
        body,
        meditationScreen,
        scene,
        phases,
        opening,
        title,
        closing,
        showScreen,
        stopVisual,
        setTitle,
        narrate,
        sleep,
        isActive
    }) {
        if (!body || !meditationScreen || typeof showScreen !== 'function' ||
            typeof stopVisual !== 'function' || typeof setTitle !== 'function' ||
            typeof narrate !== 'function' || typeof sleep !== 'function' || typeof isActive !== 'function') {
            throw new TypeError('Undo & Unlearn requires its view, lifecycle and session services');
        }

        const narrations = Array.isArray(phases) ? phases : [];
        showScreen(meditationScreen);
        body.classList.add('undo-unlearn-active');
        stopVisual();
        if (scene) { scene.hidden = false; void scene.offsetWidth; scene.classList.add('is-active'); }
        setTitle(title);

        try {
            await narrate(opening, false);
            const pauseSeconds = Math.max(15, Math.floor((minutes * 60) / Math.max(1, narrations.length)));
            for (const narration of narrations) {
                if (!isActive()) break;
                await narrate(narration, false);
                if (isActive()) await sleep(pauseSeconds * 1000);
            }
            if (isActive()) await narrate(closing, false);
        } finally {
            try {
                if (scene) {
                    scene.classList.remove('is-active');
                    try { await sleep(5000); } finally { scene.hidden = true; }
                }
            } finally {
                body.classList.remove('undo-unlearn-active');
            }
        }
    }

    global.ChakraUndoUnlearnPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
