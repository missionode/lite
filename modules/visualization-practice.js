(function installVisualizationPractice(global) {
    'use strict';

    async function run({
        minutes,
        ambience,
        body,
        meditationScreen,
        blackout,
        title,
        focusPrompt,
        guidance,
        silenceWakePrompt,
        returnPrompt,
        showScreen,
        fadeBackgroundMusicOut,
        startAmbience,
        setAmbienceDucked,
        stopAmbience,
        fadeBackgroundMusicIn,
        narrate,
        sleep,
        isActive,
        requestFrame,
        warn = () => {}
    }) {
        if (!body || !meditationScreen || typeof showScreen !== 'function' ||
            typeof fadeBackgroundMusicOut !== 'function' || typeof startAmbience !== 'function' ||
            typeof setAmbienceDucked !== 'function' || typeof stopAmbience !== 'function' ||
            typeof fadeBackgroundMusicIn !== 'function' || typeof narrate !== 'function' ||
            typeof sleep !== 'function' || typeof isActive !== 'function' || typeof requestFrame !== 'function') {
            throw new TypeError('Visualization requires its view, audio and session services');
        }

        showScreen(meditationScreen);
        body.classList.add('visualization-active');
        if (blackout) { blackout.hidden = false; void blackout.offsetWidth; blackout.classList.add('is-active'); }
        fadeBackgroundMusicOut(6);
        try {
            await startAmbience();
        } catch (error) {
            warn('Visualization ambience unavailable; continuing in silence.', error);
        }
        await sleep(1500);
        setAmbienceDucked(true, 0.8);
        title();
        await narrate(focusPrompt, false, true);
        setAmbienceDucked(false, 2);
        await sleep(12000);
        if (!isActive()) {
            if (blackout) { blackout.classList.remove('is-active'); blackout.hidden = true; }
            body.classList.remove('visualization-active');
            return;
        }
        setAmbienceDucked(true, 0.8);
        await narrate(guidance, false, true);
        setAmbienceDucked(false, 2);
        await sleep(3000);
        for (let remaining = Math.max(1, minutes * 60); remaining > 0 && isActive(); remaining--) {
            await sleep(1000);
        }
        if (!isActive()) return;
        if (ambience === 'silence') {
            await narrate(silenceWakePrompt, false, true);
            await sleep(8000);
        }
        if (!isActive()) return;
        setAmbienceDucked(true, 0.8);
        await narrate(returnPrompt, false, true);
        setAmbienceDucked(false, 1.5);
        meditationScreen.style.transition = 'opacity 10s ease-in';
        meditationScreen.style.opacity = '0.45';
        requestFrame(() => { meditationScreen.style.opacity = '1'; });
        stopAmbience();
        await sleep(6000);
        fadeBackgroundMusicIn(8, true);
        await sleep(4000);
        meditationScreen.style.transition = '';
        meditationScreen.style.opacity = '';
        if (blackout) {
            blackout.classList.remove('is-active');
            await sleep(5000);
            blackout.hidden = true;
        }
        body.classList.remove('visualization-active');
    }

    global.ChakraVisualizationPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
