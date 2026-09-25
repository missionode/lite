(function installAudioBackgroundMusicLifecycle(global) {
    "use strict";

    async function start(owner, config) {
        const { state, SeamlessLoop, url, entryFadeSeconds, stopFadeSeconds } = config;
        owner.setMusicEcho(state.musicEcho);
        if (!owner.bgMusicBuffer) {
            const response = await fetch(url, { cache: 'reload' });
            const arrayBuffer = await response.arrayBuffer();
            owner.bgMusicBuffer = await owner.ctx.decodeAudioData(arrayBuffer);
        }
        if (owner.bgMusicLoop?.isRunning) return;
        if (owner.bgMusicRetirePromise) await owner.bgMusicRetirePromise;
        if (owner.bgMusicLoop) {
            owner.stopBackgroundMusic(stopFadeSeconds);
            if (owner.bgMusicRetirePromise) await owner.bgMusicRetirePromise;
        }

        owner.cancelBackgroundMusicRestore();
        owner.bgMusicSuppressedByMantra = false;
        if (owner.bgMusicGain) {
            const now = owner.ctx.currentTime;
            owner.bgMusicGain.gain.cancelScheduledValues(now);
            owner.bgMusicGain.gain.setValueAtTime(0, now);
        }
        if (owner.bgMusicBusGain) {
            const now = owner.ctx.currentTime;
            owner.bgMusicBusGain.gain.cancelScheduledValues(now);
            owner.bgMusicBusGain.gain.setValueAtTime(1, now);
        }
        if (owner.musicEchoTailGate) {
            const now = owner.ctx.currentTime;
            owner.musicEchoTailGate.gain.cancelScheduledValues(now);
            owner.musicEchoTailGate.gain.setValueAtTime(1, now);
        }
        owner.setMusicEcho(state.musicEcho);
        owner.bgMusicLoop = new SeamlessLoop(owner.ctx, owner.bgMusicBuffer, owner.bgMusicGain, 1.0, entryFadeSeconds);
        owner.bgMusicLoop.start();
        owner.bgMusicEntryEndsAt = owner.ctx.currentTime + entryFadeSeconds;
    }

    function stop(owner, fadeTime, reverbTailSeconds) {
        owner.setConvolverActive('music', owner.musicEchoDelay, owner.musicEchoConvolver, owner.musicEchoFilter, false, Math.max(0, fadeTime) + reverbTailSeconds + 0.1);
        owner.cancelBackgroundMusicRestore();
        owner.bgMusicSuppressedByMantra = false;
        if (owner.bgMusicLoop) {
            const retirementSeconds = Math.max(0, fadeTime);
            owner.bgMusicLoop.stop(retirementSeconds);
            owner.bgMusicLoop = null;
            owner.bgMusicEntryEndsAt = 0;
            const retirement = new Promise(resolve => setTimeout(resolve, (retirementSeconds + 0.1) * 1000));
            owner.bgMusicRetirePromise = retirement;
            void retirement.then(() => {
                if (owner.bgMusicRetirePromise === retirement) owner.bgMusicRetirePromise = null;
            });
        }
    }

    global.ChakraAudioBackgroundMusicLifecycle = Object.freeze({ start, stop });
})(window);
