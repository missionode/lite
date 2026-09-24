(function installGuidedNotingPractice(global) {
    'use strict';

    async function run({
        minutes,
        body,
        meditationScreen,
        scene,
        reminders,
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
        if (!body || !meditationScreen || typeof showScreen !== 'function' || typeof stopVisual !== 'function' ||
            typeof setTitle !== 'function' || typeof narrate !== 'function' || typeof sleep !== 'function' ||
            typeof isActive !== 'function') {
            throw new TypeError('Guided Noting requires its view, lifecycle and session services');
        }

        const prompts = Array.isArray(reminders) ? reminders : [];
        showScreen(meditationScreen);
        body.classList.add('noting-active');
        stopVisual();
        if (scene) { scene.hidden = false; void scene.offsetWidth; scene.classList.add('is-active'); }
        setTitle(title);

        try {
            await narrate(opening);
            const pauseSeconds = Math.max(15, Math.floor((minutes * 60) / Math.max(1, prompts.length)));
            for (const prompt of prompts) {
                if (!isActive()) break;
                await sleep(pauseSeconds * 1000);
                if (isActive()) await narrate(prompt);
            }
            if (isActive()) await narrate(closing);
        } finally {
            try {
                if (scene) {
                    scene.classList.remove('is-active');
                    try { await sleep(5000); } finally { scene.hidden = true; }
                }
            } finally {
                body.classList.remove('noting-active');
            }
        }
    }

    global.ChakraGuidedNotingPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
