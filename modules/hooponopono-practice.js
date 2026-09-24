(function installHooponoponoPractice(global) {
    'use strict';

    async function run({
        aura,
        symbol,
        intro,
        phrases,
        closing,
        introPauseSeconds,
        phrasePauseSeconds,
        finalRestSeconds,
        setTitle,
        narrate,
        sleep,
        isActive
    }) {
        if (typeof setTitle !== 'function' || typeof narrate !== 'function' ||
            typeof sleep !== 'function' || typeof isActive !== 'function' || !Array.isArray(phrases)) {
            throw new TypeError('Ho\'oponopono requires localized phrases and narration/session services');
        }

        if (aura) {
            aura.style.background = 'radial-gradient(circle at center, #fff9c455, transparent)';
            aura.style.opacity = '1';
        }
        if (symbol) symbol.style.opacity = '0.1';
        setTitle('✦');

        await narrate(intro, false);
        await sleep(introPauseSeconds * 1000);

        for (let cycle = 0; cycle < 3; cycle++) {
            if (!isActive()) return;
            for (const phrase of phrases) {
                if (!isActive()) return;
                await narrate(phrase, false);
                await sleep(phrasePauseSeconds * 1000);
            }
        }

        await narrate(closing, true);
        await sleep(finalRestSeconds * 1000);
    }

    global.ChakraHooponoponoPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
