(function installAudioVoiceEffects(global) {
    "use strict";

    function setVoiceTuning(owner, warmth = 50, clarity = 50) {
        if (!owner.ctx || !owner.voiceWarmthFilter || !owner.voiceClarityFilter) return;
        const now = owner.ctx.currentTime;
        const bounded = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(100, Number(value))) : 50;
        const warmthGain = ((bounded(warmth) - 50) / 50) * 3;
        const clarityGain = ((bounded(clarity) - 50) / 50) * 4;
        for (const [param, target] of [[owner.voiceWarmthFilter.gain, warmthGain], [owner.voiceClarityFilter.gain, clarityGain]]) {
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
            param.linearRampToValueAtTime(target, now + 0.25);
        }
    }

    function setVoiceEcho(owner, mode = 'off', tailSeconds = 5) {
        if (!owner.ctx || !owner.voiceEchoSend || !owner.voiceEchoDelay || !owner.voiceEchoConvolver || !owner.voiceEchoWetGain) return;
        const voiceEchoSettings = {
            off: { wet: 0, filter: 3200 },
            light: { wet: 0.12, filter: 3000 },
            spacious: { wet: 0.18, filter: 3600 }
        };
        const requestedMode = Object.prototype.hasOwnProperty.call(voiceEchoSettings, mode) ? mode : 'off';
        const settings = voiceEchoSettings[requestedMode];
        owner.setConvolverActive('voice', owner.voiceEchoDelay, owner.voiceEchoConvolver, owner.voiceEchoFilter, settings.wet > 0 && owner.voicePlaybackActive === true, tailSeconds + (owner.voiceExitFade || 0) + 0.3);
        const now = owner.ctx.currentTime;
        [owner.voiceEchoSend.gain, owner.voiceEchoWetGain.gain, owner.voiceEchoFilter.frequency].forEach(param => {
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
        });
        owner.voiceEchoSend.gain.linearRampToValueAtTime(settings.wet > 0 ? 1 : 0, now + 0.25);
        owner.voiceEchoWetGain.gain.linearRampToValueAtTime(settings.wet, now + 0.25);
        owner.voiceEchoFilter.frequency.linearRampToValueAtTime(settings.filter, now + 0.25);
    }

    global.ChakraAudioVoiceEffects = Object.freeze({ setVoiceTuning, setVoiceEcho });
})(window);
