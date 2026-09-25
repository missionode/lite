(function installJourneyHypnosisWrapper(global) {
    "use strict";

    function shouldRun(owner) {
        return owner.isHypnosisJourney && owner.isMeditationActive;
    }

    async function runGuidedTransitionTone(owner, frequency, durationMs, options = {}, dependencies) {
        const { state } = dependencies;
        const { beforeGap = 0, afterGap = 0 } = options;
        if (!owner.isMeditationActive) return;
        if (beforeGap > 0) await owner.pauseAwareSleep(beforeGap * 1000);
        if (!owner.isMeditationActive) return;
        if (state.noFrequencyMode) {
            if (afterGap > 0) await owner.pauseAwareSleep(afterGap * 1000);
            return;
        }
        owner.audio.fadeInBackgroundMusic(1.2, 0.08);
        const started = owner.audio.startGuidedTransitionTone(frequency, durationMs);
        if (!started) return;
        await owner.pauseAwareSleep(durationMs);
        owner.audio.stopGuidedTransitionTone(1.1);
        await owner.pauseAwareSleep(1100);
        if (!owner.isMeditationActive) return;
        owner.audio.fadeInBackgroundMusic(2.4, true);
        if (afterGap > 0) await owner.pauseAwareSleep(afterGap * 1000);
    }

    async function runArrivalInduction(owner, dependencies) {
        if (!shouldRun(owner)) return;
        const text = owner.getJourneySystemNarration('arrivalInduction');
        if (text) await owner.narrate(text, false);
        if (!owner.isMeditationActive) return;
        const { state, getDroneDurationMs, timing } = dependencies;
        const totalDuration = getDroneDurationMs(state.timePerChakra, state.droneDurationMode);
        const halfDuration = Math.max(1000, Math.round(totalDuration / 2));
        await runGuidedTransitionTone(owner, 432, halfDuration, {
            beforeGap: timing('transitions', 'arrivalToneLeadGap'),
            afterGap: timing('transitions', 'arrivalToneExitGap')
        }, dependencies);
    }

    async function runArrivalReadiness(owner, dependencies) {
        if (!shouldRun(owner)) return;
        const text = owner.getJourneySystemNarration('arrivalReadiness');
        if (text) await owner.narrate(text, false);
        if (!owner.isMeditationActive) return;
        const { state, getDroneDurationMs, timing } = dependencies;
        const totalDuration = getDroneDurationMs(state.timePerChakra, state.droneDurationMode);
        const halfDuration = Math.max(1000, Math.round(totalDuration / 2));
        await runGuidedTransitionTone(owner, 528, halfDuration, {
            beforeGap: timing('transitions', 'arrivalToneLeadGap'),
            afterGap: timing('transitions', 'arrivalReadinessGap')
        }, dependencies);
    }

    async function runEmergence(owner, dependencies) {
        if (!shouldRun(owner)) return;
        const { state, timing, withAudioStageFade, setMantraDisplay } = dependencies;
        setMantraDisplay('✦');
        if (!state.noFrequencyMode) owner.audio.playSingingBowl();
        await owner.pauseAwareSleep(timing('transitions', 'emergenceBellSettle') * 1000);
        if (!owner.isMeditationActive) return;
        const text = owner.getJourneySystemNarration('emergence');
        if (text) await withAudioStageFade(owner.audio, state.timeEmergence, () => owner.narrate(text, false));
        if (!owner.isMeditationActive) return;
        await owner.pauseAwareSleep(state.timeEmergence * 1000);
        if (!owner.isMeditationActive) return;
        await owner.pauseAwareSleep(timing('transitions', 'emergenceFinalQuiet') * 1000);
    }

    global.ChakraJourneyHypnosisWrapper = Object.freeze({
        shouldRun, runGuidedTransitionTone, runArrivalInduction, runArrivalReadiness, runEmergence
    });
})(window);
