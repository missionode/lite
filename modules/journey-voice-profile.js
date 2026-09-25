(function installJourneyVoiceProfile(global) {
    'use strict';

    function apply({ isHighEnergy, isFeminineVoice, state, storage, syncValue, document, audio }) {
        if (!state || !storage || typeof storage.setItem !== 'function'
            || typeof syncValue !== 'function' || !document) {
            throw new TypeError('Journey voice profile requires state, storage, UI and document services');
        }

        const shringaraVoice = !isHighEnergy && isFeminineVoice === true;
        const profile = isHighEnergy
            ? { clarity: 50, warmth: 50, pace: 1, echo: 'light' }
            : shringaraVoice
                ? { clarity: 28, warmth: 82, pace: 0.92, echo: 'light' }
                : { clarity: 35, warmth: 65, pace: 0.9, echo: 'spacious' };

        state.voiceClarity = profile.clarity;
        state.voiceWarmth = profile.warmth;
        state.voicePace = profile.pace;
        state.voiceEcho = profile.echo;
        storage.setItem('chakra_voice_clarity', state.voiceClarity);
        storage.setItem('chakra_voice_warmth', state.voiceWarmth);
        storage.setItem('chakra_voice_pace', state.voicePace);
        storage.setItem('chakra_voice_echo', state.voiceEcho);
        syncValue('voice-clarity', state.voiceClarity);
        syncValue('voice-warmth', state.voiceWarmth);
        syncValue('voice-pace', state.voicePace);
        syncValue('voice-echo', state.voiceEcho);
        syncValue('music-echo', state.musicEcho);
        syncValue('spatial-mode', state.spatialMode);
        syncValue('mixer-spatial-mode', state.spatialMode);
        const preset = isHighEnergy ? 'balanced' : shringaraVoice ? 'shringara' : 'soft';
        document.querySelectorAll('[data-voice-preset]').forEach(button => {
            button.classList.toggle('mixer-preset-active', button.dataset.voicePreset === preset);
        });
        if (audio?.setVoiceTuning) audio.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
        if (audio?.setVoiceEcho) audio.setVoiceEcho(state.voiceEcho);
        return profile;
    }

    global.ChakraJourneyVoiceProfile = Object.freeze({ apply });
})(typeof window === 'undefined' ? globalThis : window);
