(function installMoodAmbienceSettingsView(global) {
    'use strict';

    function sync({
        document,
        state,
        audioUnavailable,
        formatLevel,
        unavailableMessage
    }) {
        if (!document || !state || typeof formatLevel !== 'function' || typeof unavailableMessage !== 'string') {
            throw new TypeError('Mood ambience settings view requires document, preferences and display services');
        }

        const section = document.getElementById('mood-relaxation-ambience-section');
        const toggle = document.getElementById('mood-relaxation-intention-toggle');
        const control = document.getElementById('mood-relaxation-ambience-level-control');
        const intensityControl = document.getElementById('pleasure-ambience-intensity-control');
        const intensitySelect = document.getElementById('pleasure-ambience-intensity');
        const urlControl = document.getElementById('pleasure-ambience-url-control');
        const urlInput = document.getElementById('pleasure-ambience-url');
        const blurControl = document.getElementById('pleasure-ambience-blur-control');
        const blurToggle = document.getElementById('pleasure-ambience-blur-toggle');
        const blurLevel = document.getElementById('pleasure-ambience-blur-level-control');
        const blurLevelInput = document.getElementById('pleasure-ambience-blur-level');
        const blurLevelOutput = document.getElementById('pleasure-ambience-blur-level-value');
        const slider = document.getElementById('mood-relaxation-ambience-level');
        const output = document.getElementById('mood-relaxation-ambience-level-value');
        const status = document.getElementById('pleasure-ambience-url-status');
        const enabled = state.moodRelaxationIntentionEnabled;
        const noFrequency = state.noFrequencyMode;

        // Missing local assets must leave the URL-replacement controls visible
        // to the operator; otherwise mobile deployments could not recover them.
        if (section) section.hidden = !state.advancedFeaturesUnlocked;
        if (toggle) toggle.disabled = noFrequency;
        if (control) control.hidden = !enabled;
        if (intensityControl) intensityControl.hidden = !enabled;
        if (intensitySelect) {
            intensitySelect.value = state.pleasureAmbienceIntensity;
            intensitySelect.disabled = noFrequency;
        }
        if (urlControl) urlControl.hidden = !enabled;
        if (urlInput) {
            urlInput.disabled = noFrequency;
            urlInput.value = state.pleasureAmbienceUrl;
        }
        if (blurControl) blurControl.hidden = !enabled;
        if (blurToggle) {
            blurToggle.checked = state.pleasureAmbienceBlur;
            blurToggle.disabled = noFrequency;
        }
        if (blurLevel) blurLevel.hidden = !enabled;
        if (blurLevelInput) {
            blurLevelInput.disabled = noFrequency;
            blurLevelInput.value = (state.pleasureAmbienceBlurAmount * 100).toFixed(0);
            const percent = ((Number(blurLevelInput.value) - Number(blurLevelInput.min)) /
                (Number(blurLevelInput.max) - Number(blurLevelInput.min)) * 100).toFixed(1) + '%';
            blurLevelInput.style.setProperty('--range-fill', percent);
        }
        if (blurLevelOutput) blurLevelOutput.textContent = `${Math.round(state.pleasureAmbienceBlurAmount * 100)}%`;
        if (slider) {
            slider.disabled = noFrequency || audioUnavailable;
            slider.value = (state.pleasureAmbienceGain * 100).toFixed(1);
            const percent = ((Number(slider.value) - Number(slider.min)) /
                (Number(slider.max) - Number(slider.min)) * 100).toFixed(1) + '%';
            slider.style.setProperty('--range-fill', percent);
        }
        if (output) output.textContent = formatLevel(state.pleasureAmbienceGain);
        if (status && audioUnavailable && enabled) {
            status.dataset.availability = 'unavailable';
            status.textContent = unavailableMessage;
            status.hidden = false;
            status.style.color = '#fbbf24';
        } else if (status?.dataset.availability === 'unavailable') {
            delete status.dataset.availability;
            status.hidden = true;
            status.textContent = '';
        }
    }

    global.ChakraMoodAmbienceSettingsView = Object.freeze({ sync });
})(typeof window === 'undefined' ? globalThis : window);
