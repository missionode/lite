(function installLocaleUiRenderer(global) {
    'use strict';

    const CONTROL_LABELS = Object.freeze({
        'audio-filters-toggle': 'ui.audioFilters',
        'box-breathing-experience-toggle': 'ui.boxBreathingExperience',
        'hooponopono-experience-toggle': 'ui.hooponoponoExperience',
        'no-frequency-mode-toggle': 'ui.noFrequencyMode',
        'no-mantra-mode-toggle': 'ui.noMantraMode',
        'eyes-close-mode-toggle': 'ui.eyesCloseMode',
        'music-only-toggle': 'ui.musicOnlyMode',
        'sleep-mode-toggle': 'ui.sleepMode',
        'corpse-pose-toggle': 'ui.corpsePoseOption',
        'yoga-experience-toggle': 'ui.yogaExperience',
        'bath-session-toggle': 'ui.bathSession',
        'perineal-care-toggle': 'ui.perinealCare',
        'assisted-bathing-toggle': 'ui.assistedBathing',
        'massage-toggle': 'ui.massage',
        'high-energy-toggle': 'ui.highEnergy',
        'returning-journey-toggle': 'ui.returningJourney'
    });

    function render({
        document,
        translate,
        setText,
        testVoiceButton,
        settingsButton,
        consultationButton,
        refreshJourneyRoadmap,
        refreshDroneDurationSummary
    }) {
        if (!document || typeof document.querySelectorAll !== 'function' ||
            typeof document.getElementById !== 'function' || typeof translate !== 'function' ||
            typeof setText !== 'function') {
            throw new TypeError('Locale UI renderer requires document, translation and text services');
        }

        const t = translate;
        document.title = t('ui.chakraMeditation');
        setText('app-title', t('ui.chakraMeditation'));
        const configSubtitle = document.querySelector('#config-screen > .subtitle');
        if (configSubtitle) configSubtitle.textContent = t('ui.settingsSubtitle');
        const languageLabel = document.querySelector('label[for="language-select"]');
        if (languageLabel) languageLabel.textContent = t('ui.meditationLanguage');
        const displayLanguageLabel = document.querySelector('label[for="display-language-select"]');
        if (displayLanguageLabel) displayLanguageLabel.textContent = t('ui.displayLanguage');
        if (testVoiceButton) testVoiceButton.textContent = t('ui.previewVoice');
        if (settingsButton) settingsButton.textContent = t('ui.settings');
        if (consultationButton) consultationButton.textContent = t('ui.beginConsultation');
        setText('lobby-title', t('ui.meditationRoom'));
        setText('completion-title', t('ui.journeyComplete'));
        setText('completion-message', t('ui.meditationCompleted'));
        setText('continue-to-earn', t('ui.continueToEarn'));
        setText('close-completion', t('ui.returnToRoom'));
        setText('returning-journey-label', t('ui.returningJourney'));
        setText('save-config', t('ui.startMeditation'));
        setText('start-meditation', t('ui.beginJourney'));
        const experimentGuidedGroup = document.getElementById('experiment-guided-group');
        const experimentCareGroup = document.getElementById('experiment-care-group');
        if (experimentGuidedGroup) experimentGuidedGroup.label = t('ui.experimentGuidedPractice');
        if (experimentCareGroup) experimentCareGroup.label = t('ui.experimentCare');
        document.querySelectorAll('.stat-lbl').forEach(element => {
            element.textContent = t('ui.sessionTime');
        });
        const intentionInput = document.getElementById('intention-input');
        if (intentionInput) intentionInput.placeholder = t('ui.intentionPlaceholder');
        const pleasureAmbienceUrlInput = document.getElementById('pleasure-ambience-url');
        if (pleasureAmbienceUrlInput) pleasureAmbienceUrlInput.placeholder = t('ui.pleasureAmbienceUrlPlaceholder');
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const path = element.dataset.i18n;
            const translation = path ? t(path) : null;
            // Keep the readable HTML fallback if a deployed locale bundle is stale.
            if (translation && translation !== path) element.textContent = translation;
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const path = element.dataset.i18nAriaLabel;
            if (path) element.setAttribute('aria-label', t(path));
        });

        Object.entries(CONTROL_LABELS).forEach(([inputId, path]) => {
            const input = document.getElementById(inputId);
            const label = input && input.closest('label');
            if (!label) return;
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3 && node.textContent.trim());
            if (textNode) textNode.textContent = ` ${t(path)}`;
        });
        if (typeof refreshJourneyRoadmap === 'function') refreshJourneyRoadmap();
        if (typeof refreshDroneDurationSummary === 'function') refreshDroneDurationSummary();
    }

    global.ChakraLocaleUiRenderer = Object.freeze({ render });
})(typeof window === 'undefined' ? globalThis : window);
