(function installStandardJourneySequence(global) {
    'use strict';

    async function run(owner, { state, isChecked, complete = true }) {
        if (state.bgMusicMode) {
            const music = await owner.runSessionItem('Music Only', () => owner.runBackgroundMusicOnly());
            if (music.skipped && owner.isMeditationActive) owner.finish();
            return;
        }

        for (let index = 0; index < owner.chakraOrder.length; index += 1) {
            const key = owner.chakraOrder[index];
            if (!owner.isMeditationActive) break;

            await owner.meditateOnChakra(owner.scripts[key], key);

            const isLastChakra = index === owner.chakraOrder.length - 1;
            if (!isLastChakra && owner.isMeditationActive) await owner.handleInterval();
        }
        if (!complete) return;
        if (owner.isMeditationActive && isChecked('hooponopono-experience-toggle')) await owner.runSessionItem('Ho’oponopono', () => owner.runHooponopono());
        if (owner.isMeditationActive && isChecked('undo-unlearn-addon-toggle')) await owner.runSessionItem('Undo & Unlearn', () => owner.runUndoUnlearn());
        if (owner.isMeditationActive) await owner.handleSilence();
        if (owner.isMeditationActive) await owner.runClosing();
        if (owner.isMeditationActive) await owner.runEmergence();
        if (owner.isMeditationActive) owner.finish();
    }

    global.ChakraStandardJourneySequence = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
