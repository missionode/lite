(function installMixerPreferenceHydration(global) {
    'use strict';

    const CONTROL_STATE = Object.freeze([
        ['vol-voice', 'volVoice'],
        ['vol-drone', 'volDrone'],
        ['vol-bell', 'volBell'],
        ['vol-mantra', 'volMantra'],
        ['vol-music', 'volMusic'],
        ['settings-vol-video', 'volVideo'],
        ['settings-vol-visualization', 'volVisualizationAmbience'],
        ['vol-visualization', 'volVisualizationAmbience'],
        ['visualization-ambience', 'visualizationAmbience'],
        ['voice-clarity', 'voiceClarity'],
        ['voice-warmth', 'voiceWarmth'],
        ['voice-pace', 'voicePace'],
        ['voice-echo', 'voiceEcho'],
        ['music-echo', 'musicEcho'],
        ['settings-vol-voice', 'volVoice'],
        ['settings-vol-drone', 'volDrone'],
        ['settings-vol-bell', 'volBell'],
        ['settings-vol-mantra', 'volMantra'],
        ['settings-vol-music', 'volMusic']
    ]);

    function hydrate({ state, syncValue }) {
        if (!state || typeof syncValue !== 'function') {
            throw new TypeError('Mixer preference hydration requires state and a value-sync service');
        }
        CONTROL_STATE.forEach(([controlId, stateKey]) => syncValue(controlId, state[stateKey]));
    }

    global.ChakraMixerPreferenceHydration = Object.freeze({ hydrate });
})(typeof window === 'undefined' ? globalThis : window);
