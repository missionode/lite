(function installAudioComfortEffects(global) {
    "use strict";

    function setEyesCloseMode(owner, enabled, state) {
        if (!owner.ctx) return;
        const now = owner.ctx.currentTime;
        // No added distortion in either mode: clean, smooth sound.
        owner.exciter.curve = new Float32Array([-1, 1]);
        // The voice has its own clean path, so this softens only music,
        // drone and mantra. 1.6 kHz keeps the mantra warm but not muffled.
        owner.eyesCloseFilter.frequency.exponentialRampToValueAtTime(enabled ? 1600 : 20000, now + 2.0);
        if (owner.voiceAirFilter) {
            owner.voiceAirFilter.gain.cancelScheduledValues(now);
            owner.voiceAirFilter.gain.setValueAtTime(owner.voiceAirFilter.gain.value, now);
            owner.voiceAirFilter.gain.linearRampToValueAtTime(enabled ? 1 : 2, now + 1.5);
        }

        const bgSmoothGainTarget = enabled ? 0.6 : 1.0;
        const bgLPFTarget = enabled ? 600 : (state.audioFilters ? 1200 : 20000);
        const bgNotchGain = enabled ? -24 : -12;
        owner.bgMusicEQ.gain.cancelScheduledValues(now);
        owner.bgMusicEQ.gain.setValueAtTime(owner.bgMusicEQ.gain.value, now);
        owner.bgMusicEQ.gain.linearRampToValueAtTime(bgNotchGain, now + 2.5);
        owner.bgMusicEQ.frequency.exponentialRampToValueAtTime(3000, now + 2.5);
        owner.bgMusicEQ.Q.exponentialRampToValueAtTime(enabled ? 0.4 : 1.5, now + 2.0);
        owner.bgMusicHumFilter.gain.linearRampToValueAtTime(enabled ? -15 : 0, now + 2.5);
        owner.bgMusicSmoothGain.gain.exponentialRampToValueAtTime(bgSmoothGainTarget, now + 2.5);
        owner.bgMusicLPF.frequency.exponentialRampToValueAtTime(bgLPFTarget, now + 2.5);
        if (owner.presenceFilter) owner.presenceFilter.gain.linearRampToValueAtTime(enabled ? -6 : -3, now + 2.0);
    }

    function setAudioFilters(owner, enabled, state) {
        if (!owner.ctx) return;
        const now = owner.ctx.currentTime;
        const presenceGain = state.eyesCloseMode ? -6 : -3;
        if (owner.presenceFilter) owner.presenceFilter.gain.linearRampToValueAtTime(enabled ? presenceGain : 0, now + 1.5);
        if (owner.bgMusicLPF) owner.bgMusicLPF.frequency.linearRampToValueAtTime(enabled ? 1200 : 20000, now + 1.5);
        if (owner.mantraFilter) owner.mantraFilter.frequency.linearRampToValueAtTime(enabled ? 2200 : 20000, now + 1.5);
    }

    global.ChakraAudioComfortEffects = Object.freeze({ setEyesCloseMode, setAudioFilters });
})(window);
