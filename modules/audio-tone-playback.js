(function installAudioTonePlayback(global) {
    "use strict";

    // Shots on one built-in speaker (owner requirement: only the bottom speaker
    // near the mouthpiece). The tone skips the shared moving pan and echo and
    // feeds one output channel straight to the device; the other stays silent.
    // Known limit: which channel is the bottom speaker differs by phone and can
    // flip when the phone is turned, so the person picks it once with a test
    // tone while holding the phone upright.
    function connectShotOutput(owner, source, route, levelValue) {
        if (route !== 'left' && route !== 'right') {
            source.connect(owner.masterGain);
            return [];
        }
        const level = owner.ctx.createGain();
        level.gain.value = Number.isFinite(levelValue) ? levelValue : (Number(owner.masterGain?.gain?.value) || 0);
        const merger = owner.ctx.createChannelMerger(2);
        source.connect(level);
        level.connect(merger, 0, route === 'left' ? 0 : 1);
        merger.connect(owner.ctx.destination);
        return [level, merger];
    }

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
        const route = connectShotOutput(owner, gain, state.shotSpeaker);
        osc.start(now);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); route.forEach(node => node.disconnect()); };
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

    function playSingingBowl(owner, state) {
        // A muted bell is intentional. Do not schedule an exponential ramp to zero.
        if (!owner.ctx || state.noFrequencyMode || state.volBell <= 0) return;
        const now = owner.ctx.currentTime;
        const baseFrequency = 180;
        const partials = [1, 2.8, 5.0, 8.1, 12.5];
        partials.forEach(ratio => {
            const oscillator = owner.ctx.createOscillator();
            const gain = owner.ctx.createGain();
            const filter = owner.ctx.createBiquadFilter();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(baseFrequency * ratio, now);
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(baseFrequency * ratio, now);
            filter.Q.setValueAtTime(50, now);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(state.volBell / partials.length, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 8);
            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(owner.bellGain);
            oscillator.start(now);
            oscillator.stop(now + 8.1);
            oscillator.onended = () => {
                oscillator.disconnect();
                filter.disconnect();
                gain.disconnect();
            };
        });
    }

    // Speaker test: about 5 seconds of ordinary music (the app's own background
    // music, already kept offline), not a frequency tone, on the chosen route.
    function playSpeakerTest(owner, route, buffer) {
        if (!owner.ctx || !buffer) return false;
        const now = owner.ctx.currentTime;
        const source = owner.ctx.createBufferSource();
        const gain = owner.ctx.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.7, now + 0.15);
        gain.gain.setValueAtTime(0.7, now + 4.6);
        gain.gain.linearRampToValueAtTime(0, now + 5);
        source.connect(gain);
        let nodes = [];
        if (route === 'left' || route === 'right') nodes = connectShotOutput(owner, gain, route, 1);
        else gain.connect(owner.ctx.destination);
        const offset = Math.min(8, Math.max(0, (Number(buffer.duration) || 0) - 6));
        source.start(now, offset);
        source.stop(now + 5.05);
        source.onended = () => { source.disconnect(); gain.disconnect(); nodes.forEach(node => node.disconnect()); };
        return true;
    }

    // Phones and tablets (in a browser or as an installed PWA) have built-in
    // speakers worth choosing between; desktops and laptops do not.
    function supportsShotSpeakerChoice(nav) {
        if (!nav) return false;
        if (nav.userAgentData?.mobile === true) return true;
        const userAgent = String(nav.userAgent || '');
        if (/Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)) return true;
        // iPadOS reports a desktop Mac user agent; only the touch screen tells it apart.
        return /Macintosh/.test(userAgent) && Number(nav.maxTouchPoints) > 1;
    }

    global.ChakraAudioTonePlayback = Object.freeze({ startShot, stopShot, playSpeakerTest, supportsShotSpeakerChoice, startTransitionTone, stopTransitionTone, playSingingBowl });
})(window);
