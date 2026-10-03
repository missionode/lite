(function installAudioModeSettingsView(global) {
    'use strict';

    function create({
        document = global.document,
        state,
        storage = global.localStorage,
        meditation,
        audio,
        syncChecked,
        syncPleasureAmbienceControl,
        updateExperienceModeVisibility,
        updateSessionEstimate,
        translate = key => key
    } = {}) {
        if (!document || !state || !storage || !meditation || !audio ||
            typeof syncChecked !== 'function' ||
            typeof syncPleasureAmbienceControl !== 'function' ||
            typeof updateExperienceModeVisibility !== 'function' ||
            typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Audio mode settings require document, state, storage and app services');
        }

        function setNoFrequencyMode(enabled) {
            state.noFrequencyMode = Boolean(enabled);
            storage.setItem('chakra_no_frequency_mode', state.noFrequencyMode);
            syncChecked('no-frequency-mode-toggle', state.noFrequencyMode);
            syncChecked('mixer-no-frequency-mode-toggle', state.noFrequencyMode);
            const moodRelaxationToggle = document.getElementById('mood-relaxation-intention-toggle');
            if (moodRelaxationToggle) moodRelaxationToggle.disabled = state.noFrequencyMode;
            if (state.noFrequencyMode) {
                meditation.cancelDroneTimer();
                audio.stopDrone();
                audio.stopFrequencyShot();
                audio.stopGuidedTransitionTone();
                audio.stopPleasureAmbience();
            } else if (state.moodRelaxationIntentionEnabled && meditation.isMeditationActive && !state.bgMusicMode) {
                void audio.startPleasureAmbience();
            }
            syncPleasureAmbienceControl();
            updateExperienceModeVisibility();
            updateSessionEstimate();
            renderFrequencyReminder();
        }

        // Lobby reminder above Begin: shows whether frequency tones (chakra
        // drones and the 432/528 Hz cues) will play, with a one-tap switch,
        // so No Frequency Mode is never a hidden setting.
        function renderFrequencyReminder() {
            const box = document.getElementById('frequency-reminder');
            if (!box) return;
            const off = Boolean(state.noFrequencyMode);
            box.dataset.state = off ? 'off' : 'on';
            const set = (id, key) => {
                const node = document.getElementById(id);
                if (!node) return;
                node.setAttribute('data-i18n', key);
                node.textContent = translate(key);
            };
            const icon = box.querySelector('.frequency-reminder-icon');
            if (icon) icon.textContent = off ? '🔇' : '🎵';
            set('frequency-reminder-title', off ? 'ui.freqReminderOffTitle' : 'ui.freqReminderOnTitle');
            set('frequency-reminder-note', off ? 'ui.freqReminderOffNote' : 'ui.freqReminderOnNote');
            set('frequency-reminder-toggle', off ? 'ui.freqReminderTurnOn' : 'ui.freqReminderTurnOff');
            document.getElementById('frequency-reminder-toggle')?.setAttribute('aria-pressed', String(!off));
        }

        function bindLobbyReminder() {
            document.getElementById('frequency-reminder-toggle')?.addEventListener('click', () => {
                setNoFrequencyMode(!state.noFrequencyMode);
            });
            renderFrequencyReminder();
        }

        function setNoMantraMode(enabled) {
            state.noMantraMode = Boolean(enabled);
            storage.setItem('chakra_no_mantra_mode', state.noMantraMode);
            syncChecked('no-mantra-mode-toggle', state.noMantraMode);
            syncChecked('mixer-no-mantra-mode-toggle', state.noMantraMode);
            if (state.noMantraMode) {
                meditation.cancelDroneTimer();
                audio.stopDrone();
                audio.stopMantraTrack();
            }
            updateExperienceModeVisibility();
            updateSessionEstimate();
        }

        function bindPrimaryControls() {
            document.getElementById('no-frequency-mode-toggle')?.addEventListener('change', event => {
                setNoFrequencyMode(event.target.checked);
            });
            document.getElementById('no-mantra-mode-toggle')?.addEventListener('change', event => {
                setNoMantraMode(event.target.checked);
            });
        }

        function bindMixerControls() {
            document.getElementById('mixer-no-frequency-mode-toggle')?.addEventListener('change', event => {
                setNoFrequencyMode(event.target.checked);
            });
            document.getElementById('mixer-no-mantra-mode-toggle')?.addEventListener('change', event => {
                setNoMantraMode(event.target.checked);
            });
        }

        return Object.freeze({ bindPrimaryControls, bindMixerControls, bindLobbyReminder, renderFrequencyReminder, setNoFrequencyMode });
    }

    global.ChakraAudioModeSettingsView = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
