(function installLobbyExperienceVisibility(global) {
    'use strict';

    function sync({
        document,
        state,
        getChecked,
        translate,
        timingConfig,
        isDemoScriptSelected,
        getDemoCoreDurationMinutes,
        setText,
        shotsToggle,
        yogaExperienceSetup,
        intimateServiceUnlocked,
        startMeditationBtn,
        refreshRangeControlDisplays,
        syncDroneDurationModeControls,
        updateDroneDurationSummary
    }) {
        if (!document || !state || typeof getChecked !== 'function' || typeof translate !== 'function') {
            throw new TypeError('Lobby experience visibility requires document, state and selection services');
        }

        const noFrequencyMode = state.noFrequencyMode;
        const highEnergy = getChecked('high-energy-toggle');
        const musicOnly = getChecked('music-only-toggle');
        const sleep = getChecked('sleep-mode-toggle');
        const intimateService = getChecked('perineal-care-toggle') || getChecked('massage-toggle') || getChecked('assisted-bathing-toggle');
        const standalonePreparation = state.selectedChakras.length === 0 && ([
            'box-breathing-experience-toggle', 'hooponopono-experience-toggle', 'undo-unlearn-addon-toggle',
            'visualization-addon-toggle', 'dharana-addon-toggle', 'body-scan-addon-toggle', 'noting-addon-toggle'
        ].some(id => getChecked(id)) || state.selectedChakras.length === 0 && state.advancedFeaturesUnlocked && ['quiet-courage-addon-toggle', 'confidence-visualization-addon-toggle', 'deep-secrets-addon-toggle'].some(id => getChecked(id)));
        const focusedExperience = getChecked('yoga-experience-toggle') || intimateService || standalonePreparation;
        const dharanaOptions = document.getElementById('dharana-options');
        if (dharanaOptions) dharanaOptions.hidden = !getChecked('dharana-addon-toggle') || getChecked('shots-toggle');
        const visualizationOptions = document.getElementById('visualization-options');
        if (visualizationOptions) visualizationOptions.hidden = !getChecked('visualization-addon-toggle') || getChecked('shots-toggle');
        const bodyScanOptions = document.getElementById('body-scan-options');
        if (bodyScanOptions) bodyScanOptions.hidden = !getChecked('body-scan-addon-toggle') || getChecked('shots-toggle');
        const notingOptions = document.getElementById('noting-options');
        if (notingOptions) notingOptions.hidden = !getChecked('noting-addon-toggle') || getChecked('shots-toggle');
        const undoUnlearnOptions = document.getElementById('undo-unlearn-options');
        if (undoUnlearnOptions) undoUnlearnOptions.hidden = !getChecked('undo-unlearn-addon-toggle') || getChecked('shots-toggle');
        const quietCourageControl = document.getElementById('quiet-courage-control');
        if (quietCourageControl) quietCourageControl.hidden = getChecked('shots-toggle');
        const selfExplorationSection = document.getElementById('self-exploration-section');
        if (selfExplorationSection) selfExplorationSection.hidden = !state.advancedFeaturesUnlocked || getChecked('shots-toggle');
        const quietCourageToggle = document.getElementById('quiet-courage-addon-toggle');
        if (quietCourageToggle) quietCourageToggle.disabled = !state.advancedFeaturesUnlocked;
        const quietCourageOptions = document.getElementById('quiet-courage-options');
        if (quietCourageOptions) quietCourageOptions.hidden = !getChecked('quiet-courage-addon-toggle') || getChecked('shots-toggle');
        for (const id of ['confidence-visualization-addon-toggle', 'deep-secrets-addon-toggle']) {
            const toggle = document.getElementById(id);
            if (toggle) toggle.disabled = !state.advancedFeaturesUnlocked;
        }
        for (const [toggleId, optionsId] of [
            ['confidence-visualization-addon-toggle', 'confidence-visualization-options'],
            ['deep-secrets-addon-toggle', 'deep-secrets-options']
        ]) {
            const options = document.getElementById(optionsId);
            if (options) options.hidden = !getChecked(toggleId) || getChecked('shots-toggle');
        }
        const yogaExperience = getChecked('yoga-experience-toggle');
        const normalDuration = document.getElementById('time-per-chakra')?.closest('.time-selector');
        const highEnergyDuration = document.getElementById('high-energy-duration-control');
        const droneDuration = document.getElementById('drone-duration-control');
        const durationLabel = document.querySelector('label[for="time-per-chakra"]');
        const timeInput = document.getElementById('time-per-chakra');
        const meditationRoomTitle = document.getElementById('lobby-title');
        if (shotsToggle) {
            if (noFrequencyMode || !state.advancedFeaturesUnlocked) shotsToggle.checked = false;
            shotsToggle.disabled = noFrequencyMode || !state.advancedFeaturesUnlocked;
            shotsToggle.title = noFrequencyMode ? translate('ui.noFrequencyShotsUnavailable') : '';
        }
        const shots = getChecked('shots-toggle');
        if (meditationRoomTitle) meditationRoomTitle.hidden = shots;
        const hideForShots = ['journey-preparation-addons', 'chakra-selection-panel', 'journey-integration-addons', 'drone-duration-control', 'intention-config-group', 'journey-preferences-group', 'experience-mode-group', 'intimate-service-panel', 'open-settings'];
        hideForShots.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.hidden = shots || (id === 'intimate-service-panel' && !intimateServiceUnlocked);
        });
        ['intention-config-group', 'journey-preferences-group'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.hidden = shots || focusedExperience;
        });
        if (yogaExperienceSetup) yogaExperienceSetup.hidden = !yogaExperience || shots;
        const intimateTiming = document.getElementById('intimate-service-timings');
        if (intimateTiming) intimateTiming.hidden = shots || !intimateService;
        const perinealTiming = document.getElementById('row-perineal-care');
        if (perinealTiming) perinealTiming.style.display = getChecked('perineal-care-toggle') ? '' : 'none';
        const assistedBathingTiming = document.getElementById('row-assisted-bathing');
        if (assistedBathingTiming) assistedBathingTiming.style.display = getChecked('assisted-bathing-toggle') ? '' : 'none';
        const massageNote = document.getElementById('massage-reverse-journey-note');
        if (massageNote) massageNote.hidden = shots || !getChecked('massage-toggle');
        const shotOptions = document.getElementById('shot-options');
        if (shotOptions) shotOptions.hidden = !shots || noFrequencyMode;
        const customFrequency = document.getElementById('custom-shot-frequency');
        if (customFrequency) customFrequency.hidden = !shots || noFrequencyMode || document.getElementById('shot-type-select')?.value !== 'custom';
        const shotFrequencyNote = document.getElementById('shot-frequency-note');
        const selectedShotType = document.getElementById('shot-type-select')?.value;
        if (shotFrequencyNote) {
            shotFrequencyNote.textContent = selectedShotType === 'mood_relaxation' ? translate('ui.moodRelaxationShotNote') : '';
            shotFrequencyNote.hidden = !shots || noFrequencyMode || selectedShotType !== 'mood_relaxation';
        }
        if (normalDuration) normalDuration.style.display = shots || focusedExperience || !highEnergy ? (focusedExperience ? 'none' : 'flex') : 'none';
        if (highEnergyDuration) highEnergyDuration.style.display = shots || focusedExperience ? 'none' : (highEnergy ? 'flex' : 'none');
        if (droneDuration && !shots) droneDuration.hidden = musicOnly || noFrequencyMode || focusedExperience;
        // Separate chakra times: only for normal chakra journeys (not Shots, Sleep, HRIM, Music Only, focused experiences or demo scripts).
        const perChakraTime = document.getElementById('per-chakra-time-control');
        if (perChakraTime) perChakraTime.hidden = shots || sleep || highEnergy || musicOnly || focusedExperience || isDemoScriptSelected();
        if (durationLabel) durationLabel.textContent = translate(shots ? 'ui.shotDuration' : (sleep ? 'ui.sleepStageDuration' : 'ui.corePracticeDuration'));
        if (timeInput) {
            const definition = shots ? timingConfig.journey?.shotDuration : sleep ? timingConfig.journey?.sleepStageDuration : timingConfig.journey?.timePerChakra;
            const demoDuration = !shots && !sleep && isDemoScriptSelected() ? getDemoCoreDurationMinutes(state.customScript) : null;
            timeInput.min = demoDuration ?? definition?.min ?? (shots ? 1 : 1);
            timeInput.max = definition?.max ?? (shots ? 20 : sleep ? 10 : 7);
            timeInput.step = definition?.step ?? (shots ? 1 : 0.5);
            const activeValue = shots ? state.timeShot : sleep ? state.timeSleepStage : state.timePerChakra;
            timeInput.value = activeValue;
            const percent = ((activeValue - Number(timeInput.min)) / (Number(timeInput.max) - Number(timeInput.min)) * 100).toFixed(1) + '%';
            timeInput.style.setProperty('--range-fill', percent);
            setText('time-display', shots ? `${Number(activeValue).toFixed(0)} secs` : `${Number(activeValue).toFixed(1)} mins`);
            const rangeControl = timeInput.closest('.range-control');
            if (rangeControl) {
                const maximum = rangeControl.querySelector('.range-max');
                if (maximum) maximum.textContent = timeInput.max;
                const increment = rangeControl.querySelector('.range-increment');
                if (increment) increment.disabled = Number(timeInput.value) >= Number(timeInput.max);
                const decrement = rangeControl.querySelector('.range-decrement');
                if (decrement) decrement.disabled = Number(timeInput.value) <= Number(timeInput.min);
            }
        }
        const shotType = document.getElementById('shot-type-select')?.value;
        const shotLabel = { meditation: 'ui.activateMeditationShot', high_energy: 'ui.activateHighEnergyShot', anesthetic: 'ui.activateAnestheticShot', mood_relaxation: 'ui.activateMoodRelaxationShot', sleep: 'ui.activateSleepShot', custom: 'ui.beginCustomShot' }[shotType] || 'ui.beginJourney';
        const focusedLabel = getChecked('yoga-experience-toggle') ? 'ui.beginYogaExperience'
            : intimateService ? 'ui.beginIntimateService'
                : state.selectedChakras.length === 0 && getChecked('box-breathing-experience-toggle') ? 'ui.beginBoxBreathing'
                : state.selectedChakras.length === 0 && getChecked('hooponopono-experience-toggle') ? 'ui.beginHooponopono'
                : state.advancedFeaturesUnlocked && state.selectedChakras.length === 0 && getChecked('quiet-courage-addon-toggle') ? 'ui.beginQuietCourage'
                        : 'ui.beginJourney';
        if (startMeditationBtn) startMeditationBtn.textContent = translate(shots ? shotLabel : (focusedExperience ? focusedLabel : 'ui.beginJourney'));
        document.getElementById('shots-control')?.classList.toggle('shots-active', shots);
        refreshRangeControlDisplays();
        syncDroneDurationModeControls();
        updateDroneDurationSummary();
    }

    function bindShotTypeChange({ document = global.document, resetDurationForType, updateVisibility, updateSessionEstimate }) {
        if (!document || typeof resetDurationForType !== 'function' || typeof updateVisibility !== 'function'
            || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Shot type binding requires duration and Lobby refresh services');
        }
        document.getElementById('shot-type-select')?.addEventListener('change', event => {
            resetDurationForType(event.target.value);
            updateVisibility();
            updateSessionEstimate();
        });
    }

    function bindSleepModeToggle({ toggle, state, clearSleepMode, enforceMasterToggle, updateVisibility, updateSessionEstimate }) {
        if (!state || typeof clearSleepMode !== 'function' || typeof enforceMasterToggle !== 'function'
            || typeof updateVisibility !== 'function' || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Sleep mode binding requires state and Lobby mode services');
        }
        if (!toggle) return false;
        toggle.addEventListener('change', event => {
            if (!state.advancedFeaturesUnlocked) {
                clearSleepMode();
                updateVisibility();
                updateSessionEstimate();
                return;
            }
            state.sleepExperienceEnabled = event.target.checked;
            enforceMasterToggle(event.target);
            updateVisibility();
        });
        return true;
    }

    function bindShotsToggle({ toggle, state, translate, alert = global.alert, confirm = global.confirm,
        clearMusicOnlyMode, clearHighEnergyMode, clearSleepMode, clearFocusedExperiences, clearJourneyAddons,
        clearIntimateService, resetDurationForType, getShotType, updateVisibility, updateSessionEstimate }) {
        if (!state || typeof translate !== 'function' || typeof clearMusicOnlyMode !== 'function'
            || typeof clearHighEnergyMode !== 'function' || typeof clearSleepMode !== 'function'
            || typeof clearFocusedExperiences !== 'function' || typeof clearJourneyAddons !== 'function'
            || typeof clearIntimateService !== 'function' || typeof resetDurationForType !== 'function'
            || typeof getShotType !== 'function' || typeof updateVisibility !== 'function'
            || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Shots binding requires state and mode services');
        }
        if (!toggle) return false;
        toggle.addEventListener('change', event => {
            if (!state.advancedFeaturesUnlocked) {
                event.target.checked = false;
                updateVisibility();
                updateSessionEstimate();
                return;
            }
            if (event.target.checked) {
                if (state.noFrequencyMode) {
                    event.target.checked = false;
                    alert(translate('ui.noFrequencyShotsUnavailable'));
                    updateVisibility();
                    updateSessionEstimate();
                    return;
                }
                if (!confirm(translate('ui.shotConfirm'))) {
                    event.target.checked = false;
                    updateVisibility();
                    updateSessionEstimate();
                    return;
                }
                clearMusicOnlyMode();
                clearHighEnergyMode();
                clearSleepMode();
                clearFocusedExperiences();
                clearJourneyAddons();
                clearIntimateService();
                resetDurationForType(getShotType() || 'meditation');
            }
            updateVisibility();
            updateSessionEstimate();
        });
        return true;
    }

    global.ChakraLobbyExperienceVisibility = Object.freeze({ sync, bindShotTypeChange, bindSleepModeToggle, bindShotsToggle });
})(typeof window === 'undefined' ? globalThis : window);
