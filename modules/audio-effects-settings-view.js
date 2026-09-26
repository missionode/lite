(function installAudioEffectsSettingsView(global) {
    'use strict';

    function normalizeSpatialMode(value, allowedModes, fallback) {
        return allowedModes.includes(value) ? value : fallback;
    }

    const VOICE_PRESETS = Object.freeze({
        soft: Object.freeze({ clarity: 35, warmth: 65, pace: 0.9 }),
        shringara: Object.freeze({ clarity: 28, warmth: 82, pace: 0.92 }),
        balanced: Object.freeze({ clarity: 50, warmth: 50, pace: 1 }),
        clear: Object.freeze({ clarity: 70, warmth: 40, pace: 1.05 })
    });

    function bind({
        document = global.document,
        state,
        storage = global.localStorage,
        audio,
        normalizeSpatialMode,
        syncValue
    } = {}) {
        if (!document || !state || !storage || !audio || typeof normalizeSpatialMode !== 'function' || typeof syncValue !== 'function') {
            throw new TypeError('Audio effects settings require document, state and audio preference services');
        }

        const clearPresetSelection = () => {
            document.querySelectorAll('[data-voice-preset]').forEach(button => button.classList.remove('mixer-preset-active'));
        };
        const applyVoiceTuning = () => {
            if (audio.setVoiceTuning) audio.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
        };
        const voiceClarity = document.getElementById('voice-clarity');
        const voiceWarmth = document.getElementById('voice-warmth');
        const voicePace = document.getElementById('voice-pace');

        voiceClarity?.addEventListener('input', event => {
            state.voiceClarity = Number(event.target.value);
            storage.setItem('chakra_voice_clarity', state.voiceClarity);
            applyVoiceTuning();
            clearPresetSelection();
        });
        voiceWarmth?.addEventListener('input', event => {
            state.voiceWarmth = Number(event.target.value);
            storage.setItem('chakra_voice_warmth', state.voiceWarmth);
            applyVoiceTuning();
            clearPresetSelection();
        });
        voicePace?.addEventListener('input', event => {
            state.voicePace = Number(event.target.value);
            storage.setItem('chakra_voice_pace', state.voicePace);
        });
        document.getElementById('voice-echo')?.addEventListener('change', event => {
            state.voiceEcho = event.target.value;
            storage.setItem('chakra_voice_echo', state.voiceEcho);
            if (audio.setVoiceEcho) audio.setVoiceEcho(state.voiceEcho);
        });
        document.getElementById('music-echo')?.addEventListener('change', event => {
            state.musicEcho = event.target.value;
            storage.setItem('chakra_music_echo', state.musicEcho);
            if (audio.setMusicEcho) audio.setMusicEcho(state.musicEcho);
        });

        const applySpatialMode = mode => {
            state.spatialMode = normalizeSpatialMode(mode);
            storage.setItem('chakra_spatial_mode', state.spatialMode);
            syncValue('spatial-mode', state.spatialMode);
            syncValue('mixer-spatial-mode', state.spatialMode);
            if (audio.setSpatialMode) audio.setSpatialMode(state.spatialMode);
        };
        document.getElementById('spatial-mode')?.addEventListener('change', event => applySpatialMode(event.target.value));
        document.getElementById('mixer-spatial-mode')?.addEventListener('change', event => applySpatialMode(event.target.value));

        document.querySelectorAll('[data-voice-preset]').forEach(button => {
            button.addEventListener('click', () => {
                const preset = VOICE_PRESETS[button.dataset.voicePreset];
                if (!preset) return;
                state.voiceClarity = preset.clarity;
                state.voiceWarmth = preset.warmth;
                state.voicePace = preset.pace;
                storage.setItem('chakra_voice_clarity', state.voiceClarity);
                storage.setItem('chakra_voice_warmth', state.voiceWarmth);
                storage.setItem('chakra_voice_pace', state.voicePace);
                syncValue('voice-clarity', state.voiceClarity);
                syncValue('voice-warmth', state.voiceWarmth);
                syncValue('voice-pace', state.voicePace);
                applyVoiceTuning();
                document.querySelectorAll('[data-voice-preset]').forEach(item => {
                    item.classList.toggle('mixer-preset-active', item === button);
                });
            });
        });
    }

    global.ChakraAudioEffectsSettingsView = Object.freeze({ bind, normalizeSpatialMode });
})(typeof window === 'undefined' ? globalThis : window);
