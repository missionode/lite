(function installAudioBackgroundMusicControls(global) {
    "use strict";

    function fadeIn(owner, duration = 4, isDucked = false, state) {
        if (!owner.bgMusicLoop || !owner.ctx) return;
        if (owner.stageFadeWindow) duration = Math.min(duration, owner.stageFadeWindow.limit);
        let factor = 1.0;
        if (isDucked === true) factor = 0.15;
        else if (typeof isDucked === 'number') factor = isDucked;
        const targetVol = state.volMusic * factor;
        const targetEQ = factor < 1.0 ? -3 : 0;
        owner.bgMusicTargetVolume = targetVol;
        owner.bgMusicTargetEQ = targetEQ;
        const now = owner.ctx.currentTime;
        const liveGain = owner.bgMusicGain.gain.value;
        if (owner.bgMusicGain.gain.cancelAndHoldAtTime) owner.bgMusicGain.gain.cancelAndHoldAtTime(now);
        else {
            owner.bgMusicGain.gain.cancelScheduledValues(now);
            owner.bgMusicGain.gain.setValueAtTime(liveGain, now);
        }
        if (targetVol <= 0) {
            owner.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        } else {
            owner.bgMusicGain.gain.linearRampToValueAtTime(targetVol, now + duration);
        }
        owner.bgMusicEQ.gain.cancelScheduledValues(now);
        owner.bgMusicEQ.gain.setValueAtTime(owner.bgMusicEQ.gain.value, now);
        owner.bgMusicEQ.gain.linearRampToValueAtTime(targetEQ, now + duration);
        if (now >= owner.bgMusicEntryEndsAt) owner.bgMusicLoop.setGain(1.0);
        if (owner.bgMusicSuppressedByMantra) return;
        if (owner.bgMusicBusGain) {
            owner.bgMusicBusGain.gain.cancelScheduledValues(now);
            owner.bgMusicBusGain.gain.setValueAtTime(owner.bgMusicBusGain.gain.value, now);
            owner.bgMusicBusGain.gain.linearRampToValueAtTime(1, now + duration);
        }
    }

    function fadeOut(owner, duration = 4) {
        if (!owner.bgMusicLoop) return;
        owner.bgMusicTargetVolume = 0;
        owner.bgMusicTargetEQ = 0;
        const now = owner.ctx.currentTime;
        owner.bgMusicGain.gain.cancelScheduledValues(now);
        owner.bgMusicEQ.gain.cancelScheduledValues(now);
        owner.bgMusicGain.gain.setValueAtTime(owner.bgMusicGain.gain.value, now);
        owner.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        owner.bgMusicEQ.gain.setValueAtTime(owner.bgMusicEQ.gain.value, now);
        owner.bgMusicEQ.gain.linearRampToValueAtTime(0, now + duration);
    }

    function setVolume(owner, level, previousLevel = level) {
        if (!owner.ctx || !owner.bgMusicGain || !owner.bgMusicLoop) return;
        const nextLevel = Number(level);
        const previous = Number(previousLevel);
        const currentTarget = Number(owner.bgMusicTargetVolume);
        if (!Number.isFinite(nextLevel) || !Number.isFinite(previous) || previous <= 0 || !Number.isFinite(currentTarget)) return;
        const roleFactor = Math.max(0, Math.min(1, currentTarget / previous));
        const nextTarget = nextLevel * roleFactor;
        owner.bgMusicTargetVolume = nextTarget;
        if (roleFactor === 0) return;
        const now = owner.ctx.currentTime;
        const currentGain = owner.bgMusicGain.gain.value;
        owner.bgMusicGain.gain.cancelScheduledValues(now);
        owner.bgMusicGain.gain.setValueAtTime(currentGain, now);
        if (currentGain <= 0.0001) return;
        owner.bgMusicGain.gain.linearRampToValueAtTime(nextTarget, now + 0.25);
    }

    function cancelRestore(owner) {
        if (owner.bgMusicRestoreTimer) {
            clearTimeout(owner.bgMusicRestoreTimer);
            owner.bgMusicRestoreTimer = null;
        }
    }

    function setBusGain(owner, value, duration) {
        const now = owner.ctx.currentTime;
        const param = owner.bgMusicBusGain.gain;
        if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(now);
        else {
            param.cancelScheduledValues(now);
            param.setValueAtTime(param.value, now);
        }
        param.linearRampToValueAtTime(value, now + duration);
    }

    function setTailGate(owner, value, duration) {
        if (!owner.musicEchoTailGate) return;
        const param = owner.musicEchoTailGate.gain;
        const now = owner.ctx.currentTime;
        if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(now);
        else {
            param.cancelScheduledValues(now);
            param.setValueAtTime(param.value, now);
        }
        param.linearRampToValueAtTime(value, now + duration);
    }

    function muteForMantra(owner, duration) {
        if (!owner.ctx || !owner.bgMusicBusGain) return;
        cancelRestore(owner);
        owner.bgMusicSuppressedByMantra = true;
        const now = owner.ctx.currentTime;
        const fadeDuration = Math.max(0, duration);
        setBusGain(owner, 0, fadeDuration);
        setTailGate(owner, 0, fadeDuration);
        return { startedAt: now, duration: fadeDuration };
    }

    function restoreAfterMantra(owner, duration) {
        if (!owner.ctx || !owner.bgMusicBusGain) return;
        cancelRestore(owner);
        owner.bgMusicSuppressedByMantra = false;
        const fadeDuration = Math.max(0, duration);
        setBusGain(owner, 1, fadeDuration);
        setTailGate(owner, 1, fadeDuration);
    }

    global.ChakraAudioBackgroundMusicControls = Object.freeze({
        fadeIn, fadeOut, setVolume, cancelRestore, muteForMantra, restoreAfterMantra
    });
})(window);
