(function installQuietCouragePractice(global) {
    'use strict';

    async function run({
        minutes,
        meditationScreen,
        opening,
        phases,
        title,
        closing,
        startSupportTone,
        stopSupportTone,
        showScreen,
        stopVisual,
        setTitle,
        narrate,
        sleep,
        isActive
    }) {
        if (!meditationScreen || typeof showScreen !== 'function' || typeof stopVisual !== 'function' ||
            typeof setTitle !== 'function' || typeof narrate !== 'function' || typeof sleep !== 'function' ||
            typeof isActive !== 'function') {
            throw new TypeError('Quiet Courage requires its view, lifecycle and session services');
        }

        const prompts = Array.isArray(phases) ? phases : [];
        const pauseMs = Math.max(15000, Math.floor((Number(minutes) || 5) * 60000 / Math.max(1, prompts.length)));
        let supportToneActive = false;
        try {
            supportToneActive = typeof startSupportTone === 'function' && Boolean(startSupportTone());
            showScreen(meditationScreen);
            stopVisual();
            setTitle(title);

            await narrate(opening);
            for (const prompt of prompts) {
                if (!isActive()) break;
                await sleep(pauseMs);
                if (isActive()) await narrate(prompt);
            }
            if (isActive()) await narrate(closing);
        } finally {
            if (supportToneActive && typeof stopSupportTone === 'function') stopSupportTone();
        }
    }

    global.ChakraQuietCouragePractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
