(function installJourneyTransitionStages(global) {
    'use strict';

    async function runInterval(owner, { state, contentT, timing, setText, document, withAudioStageFade, wait }) {
        owner.stopStageDrone();
        setText('mantra-display', contentT('system.breathe'));
        const symbol = document.getElementById('chakra-symbol');
        if (symbol) symbol.style.opacity = '0.3';
        owner.visual.stop();
        await owner.pauseAwareSleep(timing('transitions', 'intervalPreparation') * 1000);
        const narration = withAudioStageFade(owner.audio, state.timeInterval, () => owner.narrateFeeble(contentT('system.breatheInterval')));
        narration.catch(() => {});
        const intervalMs = state.timeInterval * 1000;
        let elapsed = 0;
        while (elapsed < intervalMs) {
            if (!owner.isMeditationActive) break;
            if (!owner.isPaused) elapsed += 100;
            await wait(100);
        }
        await narration;
    }

    async function runSilence(owner, { contentT, timing, setText, document }) {
        owner.visual.stop();
        setText('mantra-display', contentT('system.silence'));
        const symbol = document.getElementById('chakra-symbol');
        if (symbol) symbol.style.opacity = '0.2';
        owner.stopStageDrone();
        const silenceTime = timing('transitions', 'finalSilence') * 1000;
        for (let remaining = Math.ceil(silenceTime / 1000); remaining > 0; remaining--) {
            if (!owner.isMeditationActive) break;
            await owner.pauseAwareSleep(1000);
        }
    }

    async function runClosing(owner, { localized, journeyT, timing, setText, document }) {
        setText('mantra-display', '✦');
        const symbol = document.getElementById('chakra-symbol');
        if (symbol) symbol.style.opacity = '0.4';
        const aura = document.getElementById('aura-bg');
        if (aura) aura.style.background = 'radial-gradient(circle at center, #8B00FF22, transparent)';
        const closing = localized(owner.scripts.closing);
        await owner.narrate(closing);
        await owner.pauseAwareSleep(timing('transitions', 'closingFirstPause') * 1000);
        const affirmation = localized(owner.scripts.closing, 'affirmation');
        if (affirmation && owner.isMeditationActive) {
            setText('mantra-display', `✦ ${journeyT('system.body')} ✦`);
            await owner.narrate(affirmation);
        }
        await owner.pauseAwareSleep(timing('transitions', 'closingSecondPause') * 1000);
    }

    global.ChakraJourneyTransitionStages = Object.freeze({ runInterval, runSilence, runClosing });
})(typeof window === 'undefined' ? globalThis : window);
