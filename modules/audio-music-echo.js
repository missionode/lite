(function installAudioMusicEcho(global) {
    "use strict";

    const PROFILES = Object.freeze({
        off: Object.freeze({ delay: 0.018, wet: 0, filter: 2800 }),
        light: Object.freeze({ delay: 0.018, wet: 0.12, filter: 2800 }),
        spacious: Object.freeze({ delay: 0.035, wet: 0.18, filter: 3400 })
    });
    const FALLBACK = PROFILES.light;

    function setMusicEcho(owner, mode = 'light', tailSeconds = 5) {
        if (!owner.ctx || !owner.musicEchoSend || !owner.musicEchoDelay || !owner.musicEchoConvolver || !owner.musicEchoWetGain) return;
        const settings = PROFILES[mode] || FALLBACK;
        owner.setConvolverActive('music', owner.musicEchoDelay, owner.musicEchoConvolver, owner.musicEchoFilter, settings.wet > 0, tailSeconds + 0.3);
        const now = owner.ctx.currentTime;
        owner.musicEchoDelay.delayTime.cancelScheduledValues(now);
        owner.musicEchoDelay.delayTime.setValueAtTime(owner.musicEchoDelay.delayTime.value, now);
        owner.musicEchoDelay.delayTime.linearRampToValueAtTime(settings.delay, now + 0.25);
        owner.musicEchoSend.gain.cancelScheduledValues(now);
        owner.musicEchoSend.gain.setValueAtTime(owner.musicEchoSend.gain.value, now);
        owner.musicEchoSend.gain.linearRampToValueAtTime(settings.wet > 0 ? 1 : 0, now + 0.25);
        owner.musicEchoWetGain.gain.cancelScheduledValues(now);
        owner.musicEchoWetGain.gain.setValueAtTime(owner.musicEchoWetGain.gain.value, now);
        owner.musicEchoWetGain.gain.linearRampToValueAtTime(settings.wet, now + 0.25);
        owner.musicEchoFilter.frequency.cancelScheduledValues(now);
        owner.musicEchoFilter.frequency.setValueAtTime(owner.musicEchoFilter.frequency.value, now);
        owner.musicEchoFilter.frequency.linearRampToValueAtTime(settings.filter, now + 0.25);
    }

    global.ChakraAudioMusicEcho = Object.freeze({ PROFILES, setMusicEcho });
})(window);
