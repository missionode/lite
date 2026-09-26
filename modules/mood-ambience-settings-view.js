(function installMoodAmbienceSettingsView(global) {
    'use strict';

    function clampGain(value, { fallback, minimum, maximum }) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? Math.min(maximum, Math.max(minimum, numeric)) : fallback;
    }

    function clampLevel(value, min, max, fallback) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? Math.min(max, Math.max(min, numeric)) : fallback;
    }

    function normalizeUrl(value, baseUrl) {
        const candidate = String(value ?? '').trim();
        if (!candidate) return '';
        try {
            const parsed = new URL(candidate, baseUrl);
            return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
        } catch {
            return '';
        }
    }

    function clampBlurAmount(value, { fallback, minimum, maximum }) {
        return clampLevel(value, minimum, maximum, fallback);
    }

    function normalizeIntensity(value, profiles) {
        return Object.hasOwn(profiles, value) ? value : 'gentle';
    }

    function intensityProfile(value, profiles) {
        return profiles[normalizeIntensity(value, profiles)];
    }

    function blurMix({ enabled, amount, intensity, profiles, clampAmount }) {
        const profile = intensityProfile(intensity, profiles);
        const wet = enabled ? clampAmount(amount) * profile.blurMultiplier : 0;
        return { dry: 1 - wet, wet };
    }

    function formatLevel(gain, config) {
        return `${(clampGain(gain, config) * 100).toFixed(1)}%`;
    }

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

    function bindUrlLoader({ document, state, audio, translate, syncControl }) {
        if (!document || typeof document.getElementById !== 'function') throw new TypeError('Mood ambience URL loader requires a document');
        if (!state) throw new TypeError('Mood ambience URL loader requires app state');
        if (!audio || typeof audio.loadPleasureAmbienceUrl !== 'function') throw new TypeError('Mood ambience URL loader requires the audio engine');
        if (typeof translate !== 'function' || typeof syncControl !== 'function') {
            throw new TypeError('Mood ambience URL loader requires translation and control-sync services');
        }

        const urlInput = document.getElementById('pleasure-ambience-url');
        const loadButton = document.getElementById('load-pleasure-ambience-url');
        const status = document.getElementById('pleasure-ambience-url-status');
        if (!loadButton || typeof loadButton.addEventListener !== 'function') return false;

        function setStatus(message, tone = 'neutral') {
            if (!status) return;
            delete status.dataset.availability;
            status.textContent = message;
            status.hidden = false;
            status.style.color = tone === 'success'
                ? '#4ade80'
                : tone === 'error'
                    ? '#f87171'
                    : 'rgba(255, 255, 255, 0.72)';
        }

        loadButton.addEventListener('click', async () => {
            const url = urlInput?.value.trim() || '';
            loadButton.disabled = true;
            setStatus(translate('ui.pleasureAmbienceUrlLoading'));
            try {
                await audio.loadPleasureAmbienceUrl(url);
                setStatus(
                    translate(url ? 'ui.pleasureAmbienceUrlLoaded' : 'ui.pleasureAmbienceUrlCleared'),
                    'success'
                );
            } catch (error) {
                const errorMessage = error?.message || String(error);
                setStatus(translate('ui.pleasureAmbienceUrlError').replace('{error}', errorMessage), 'error');
                syncControl();
            } finally {
                loadButton.disabled = state.noFrequencyMode;
            }
        });
        return true;
    }

    function bindControls({
        document, state, storage, audio, meditation, window: browserWindow = global,
        translate, syncControl, normalizeIntensity, clampGain, clampBlurAmount, threshold
    }) {
        if (!document || !state || !storage || typeof storage.setItem !== 'function' || !audio || !meditation
            || typeof translate !== 'function' || typeof syncControl !== 'function'
            || typeof normalizeIntensity !== 'function' || typeof clampGain !== 'function' || typeof clampBlurAmount !== 'function'
            || typeof threshold !== 'number') {
            throw new TypeError('Mood ambience controls require state, audio, storage and confirmation services');
        }
        document.getElementById('mood-relaxation-intention-toggle')?.addEventListener('change', event => {
            if (!state.advancedFeaturesUnlocked || state.noFrequencyMode) {
                event.target.checked = state.moodRelaxationIntentionEnabled;
                return;
            }
            state.moodRelaxationIntentionEnabled = event.target.checked;
            if (state.moodRelaxationIntentionEnabled) state.pleasureAmbienceBlur = true;
            audio.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
            syncControl();
            if (state.moodRelaxationIntentionEnabled && meditation.isMeditationActive && !state.bgMusicMode) {
                void audio.startPleasureAmbience();
            } else if (!state.moodRelaxationIntentionEnabled) {
                audio.stopPleasureAmbience();
            }
        });
        document.getElementById('pleasure-ambience-intensity')?.addEventListener('change', event => {
            state.pleasureAmbienceIntensity = normalizeIntensity(event.target.value);
            audio.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
            syncControl();
        });
        document.getElementById('mood-relaxation-ambience-level')?.addEventListener('input', event => {
            const requestedGain = clampGain(Number(event.target.value) / 100);
            const previousGain = state.pleasureAmbienceGain;
            if (requestedGain > threshold && previousGain <= threshold) {
                const confirmed = browserWindow.confirm(translate('ui.pleasureAmbienceAboveFiveConfirm'));
                if (!confirmed) {
                    syncControl();
                    return;
                }
            }
            state.pleasureAmbienceGain = requestedGain;
            storage.setItem('chakra_pleasure_ambience_gain', state.pleasureAmbienceGain);
            syncControl();
            audio.setPleasureAmbienceGain(state.pleasureAmbienceGain);
        });
        document.getElementById('pleasure-ambience-blur-toggle')?.addEventListener('change', event => {
            state.pleasureAmbienceBlur = event.target.checked;
            audio.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
        });
        document.getElementById('pleasure-ambience-blur-level')?.addEventListener('input', event => {
            state.pleasureAmbienceBlurAmount = clampBlurAmount(Number(event.target.value) / 100);
            storage.setItem('chakra_pleasure_ambience_blur_amount', state.pleasureAmbienceBlurAmount);
            syncControl();
            audio.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
        });
    }

    global.ChakraMoodAmbienceSettingsView = Object.freeze({
        sync, bindUrlLoader, bindControls, clampGain, clampLevel, normalizeUrl,
        clampBlurAmount, normalizeIntensity, intensityProfile, blurMix, formatLevel
    });
})(typeof window === 'undefined' ? globalThis : window);
