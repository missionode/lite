(function installAudioTonePlayback(global) {
    "use strict";

    function startShot(owner, frequency, state) {
        owner.stopFrequencyShot();
        if (state.noFrequencyMode) {
            throw new Error('No Frequency Mode prevents frequency-only Shots.');
        }
        const requested = Number(frequency);
        if (!owner.ctx || !Number.isFinite(requested) || requested <= 0 || requested > 20000) {
            throw new Error('Shot frequency must be between 0 and 20,000 Hz.');
        }
        const now = owner.ctx.currentTime;
        const osc = owner.ctx.createOscillator();
        const gain = owner.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(requested, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(0.2, Number(state.volDrone) || 0)), now + 0.08);
        osc.connect(gain);
        gain.connect(owner.masterGain);
        osc.start(now);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        owner.shotOscillator = osc;
        owner.shotGain = gain;
    }

    function stopShot(owner) {
        if (!owner.ctx || !owner.shotOscillator || !owner.shotGain) return;
        const now = owner.ctx.currentTime;
        const osc = owner.shotOscillator;
        const gain = owner.shotGain;
        owner.shotOscillator = null;
        owner.shotGain = null;
        try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(Math.max(0, gain.gain.value), now);
            gain.gain.linearRampToValueAtTime(0, now + 0.08);
            osc.stop(now + 0.1);
        } catch (error) {}
    }

    function startTransitionTone(owner, frequency, durationMs, state) {
        if (state.noFrequencyMode) return false;
        const requested = Number(frequency);
        if (!owner.ctx || !Number.isFinite(requested) || requested <= 0 || requested > 20000) return false;

        owner.stopGuidedTransitionTone(0.05);
        const now = owner.ctx.currentTime;
        if (!Number.isFinite(Number(durationMs)) || Number(durationMs) <= 0) return false;
        const durationSeconds = Math.max(1, Number(durationMs) / 1000);
        const fadeSeconds = Math.min(1.5, Math.max(0.35, durationSeconds * 0.25));
        const steadyUntil = Math.max(now + fadeSeconds, now + durationSeconds - fadeSeconds);
        const osc = owner.ctx.createOscillator();
        const gain = owner.ctx.createGain();
        const peak = Math.min(Math.max(0, (Number(state.volDrone) || 0) * 0.5), 0.025);
        if (peak === 0) return false;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(requested, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + fadeSeconds);
        gain.gain.setValueAtTime(peak, steadyUntil);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
        osc.connect(gain);
        gain.connect(owner.masterGain);
        osc.start(now);
        osc.stop(now + durationSeconds + 0.05);
        osc.onended = () => {
            osc.disconnect(); gain.disconnect();
            if (owner.guidedTransitionTone?.osc === osc) owner.guidedTransitionTone = null;
        };
        owner.guidedTransitionTone = { osc, gain };
        return true;
    }

    function stopTransitionTone(owner, fadeSeconds = 1) {
        if (!owner.ctx || !owner.guidedTransitionTone) return;
        const { osc, gain } = owner.guidedTransitionTone;
        owner.guidedTransitionTone = null;
        const now = owner.ctx.currentTime;
        try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.05, fadeSeconds));
            osc.stop(now + Math.max(0.1, fadeSeconds) + 0.05);
        } catch (error) {}
    }

    global.ChakraAudioTonePlayback = Object.freeze({ startShot, stopShot, startTransitionTone, stopTransitionTone });
})(window);
