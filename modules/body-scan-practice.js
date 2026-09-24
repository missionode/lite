(function installBodyScanPractice(global) {
    'use strict';

    async function run({
        minutes,
        body,
        meditationScreen,
        scene,
        regions,
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
            throw new TypeError('Body Scan requires its view, lifecycle and session services');
        }

        const narrationRegions = Array.isArray(regions) ? regions : [];
        showScreen(meditationScreen);
        body.classList.add('body-scan-active');
        stopVisual();
        if (scene) { scene.hidden = false; void scene.offsetWidth; scene.classList.add('is-active'); }
        setTitle(title);

        try {
            await narrate(opening);
            const pauseSeconds = Math.max(2, Math.floor((minutes * 60) / Math.max(1, narrationRegions.length)));
            for (let index = 0; index < narrationRegions.length && isActive(); index++) {
                await narrate(narrationRegions[index]);
                await sleep(pauseSeconds * 1000);
            }
            if (isActive()) await narrate(closing);
        } finally {
            if (scene) {
                scene.classList.remove('is-active');
                await sleep(5000);
                scene.hidden = true;
            }
            body.classList.remove('body-scan-active');
        }
    }

    global.ChakraBodyScanPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
