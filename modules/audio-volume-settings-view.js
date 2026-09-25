(function installAudioVolumeSettingsView(global) {
    'use strict';

    function bind({ document = global.document, state, storage = global.localStorage, audio } = {}) {
        if (!document || !state || !storage || !audio) {
            throw new TypeError('Audio volume settings require document, state, storage and audio services');
        }

        function bindVolume(key, ids, apply) {
            const mirrors = ids.map(id => document.getElementById(id)).filter(Boolean);
            mirrors.forEach(element => element.addEventListener('input', event => {
                const previousValue = state[key];
                state[key] = parseFloat(event.target.value);
                storage.setItem(`chakra_${key.replace('vol', 'vol_').toLowerCase()}`, state[key]);
                mirrors.forEach(mirror => { mirror.value = event.target.value; });
                apply?.(previousValue);
            }));
        }

        bindVolume('volVoice', ['vol-voice', 'settings-vol-voice'], () => {
            if (audio.voiceGain && audio.ctx) audio.voiceGain.gain.setValueAtTime(state.volVoice, audio.ctx.currentTime);
        });
        bindVolume('volDrone', ['vol-drone', 'settings-vol-drone'], () => {
            if (audio.masterGain) audio.masterGain.gain.setValueAtTime(state.volDrone, audio.ctx.currentTime);
        });
        bindVolume('volBell', ['vol-bell', 'settings-vol-bell'], () => {
            if (audio.bellGain) audio.bellGain.gain.setValueAtTime(state.volBell, audio.ctx.currentTime);
        });
        bindVolume('volMantra', ['vol-mantra', 'settings-vol-mantra'], () => {
            if (audio.mantraGain && audio.mantraLoop) {
                audio.mantraGain.gain.setValueAtTime(state.volMantra, audio.ctx.currentTime);
            }
        });
        bindVolume('volMusic', ['vol-music', 'settings-vol-music'], previousValue => {
            audio.setBackgroundMusicVolume(state.volMusic, previousValue);
        });
        bindVolume('volVideo', ['settings-vol-video'], () => {
            audio.setJourneyVideoPreludeVolume(state.volVideo);
        });
        bindVolume('volVisualizationAmbience', ['settings-vol-visualization', 'vol-visualization'], () => {
            audio.setVisualizationAmbienceVolume(state.volVisualizationAmbience);
        });
    }

    global.ChakraAudioVolumeSettingsView = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
