// ── GLOBAL ERROR CATCHER (Mobile Debugging) ──────────────────────────────────
window.onerror = function(msg, url, lineNo, columnNo, error) {
    // Only alert for actual crashes to avoid noise, but ensure we see the "Killer" bugs
    if (msg.toLowerCase().indexOf("script error") > -1) return;
    alert("App Error: " + msg + "\nLine: " + lineNo);
    return false;
};

const MANTRA_AUDIO_MAP = {
    root:        'audio/LAM.mp3',
    sacral:      'audio/VAM.mp3',
    solar:       'audio/RAM.mp3',
    heart:       'audio/YAM.mp3',
    throat:      'audio/HAM.mp3',
    thirdeye:    'audio/OM.mp3',
    crown:       'audio/AUM.mp3',
    high_energy: 'audio/HREEM.mp3'
};

// ── DOM ELEMENTS (Declared First to prevent TDZ Errors) ──────────────────────
const configScreen = document.getElementById('config-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const consultationScreen = document.getElementById('consultation-screen');
const consultationReviewScreen = document.getElementById('consultation-review-screen');
const consultationConsentScreen = document.getElementById('consultation-consent-screen');
const meditationScreen = document.getElementById('meditation-screen');
const breathingScreen = document.getElementById('breathing-screen');
const icebreakerScreen = document.getElementById('icebreaker-screen');
const icebreakerTimer = document.getElementById('icebreaker-timer');

const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');
const testVoiceBtn = document.getElementById('test-voice');
const saveConfigBtn = document.getElementById('save-config');
const timeSlider = document.getElementById('time-per-chakra');
const timeDisplay = document.getElementById('time-display');
const startMeditationBtn = document.getElementById('start-meditation');
const openSettingsBtn = document.getElementById('open-settings');
const beginConsultationBtn = document.getElementById('begin-consultation');

// ── UTILS (Defensive Element Access) ──────────────────────────────────────────
const getChecked = (id) => {
    const el = document.getElementById(id);
    return el ? el.checked : false;
};
const syncChecked = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = val;
};
const syncValue = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
};
const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
};

function setSymbolImage(src, symbolEl = document.getElementById('chakra-symbol')) {
    if (!symbolEl || !src) return;

    symbolEl.style.visibility = 'hidden';
    symbolEl.dataset.pendingSrc = src;
    symbolEl.onload = () => {
        if (symbolEl.dataset.pendingSrc === src) symbolEl.style.visibility = 'visible';
    };
    symbolEl.onerror = () => {
        if (symbolEl.dataset.pendingSrc === src) symbolEl.style.visibility = 'hidden';
    };
    symbolEl.src = src;

    // Cached images may already be complete before the load callback is attached.
    if (symbolEl.complete && symbolEl.naturalWidth > 0) symbolEl.style.visibility = 'visible';
}

function hasScriptPath(source, path) {
    return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source) != null;
}

function hasLocalizedScriptPath(scripts, path) {
    if (hasScriptPath(scripts, path)) return true;
    const parts = path.split('.');
    const final = parts.pop() || '';
    const suffixMatch = final.match(/^(.+)_([a-zA-Z-]+)$/);
    if (!suffixMatch) return false;
    const basePath = parts.concat(suffixMatch[1]).join('.');
    if (hasScriptPath(scripts, `${basePath}.${suffixMatch[2]}`)) return true;
    const parentPath = parts.join('.');
    return ['text', 'content', 'value'].some(field =>
        hasScriptPath(scripts, `${parentPath}.${field}.${suffixMatch[2]}`)
    );
}

function validateScriptBundle(scripts, options = {}) {
    const languageIds = (options.languages || languageRegistry.map(language => language.id)).length
        ? (options.languages || languageRegistry.map(language => language.id))
        : ['ml', 'en'];
    const localized = (base) => languageIds.map(language => `${base}_${language}`);
    const required = [
        ...localized('intro.gratitude'), ...localized('intro.returning'),
        ...['new', 'waxing', 'full', 'waning'].flatMap(phase => localized(`intro.moon.${phase}`)),
        ...languageIds.map(language => `closing.${language}`),
        ...languageIds.map(language => `closing.affirmation_${language}`),
        ...['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].flatMap(key => [
            ...languageIds.map(language => `${key}.${language}`),
            ...languageIds.map(language => `${key}.affirmation_${language}`),
            `${key}.mantra`, `${key}.color`, `${key}.symbol`, `${key}.frequency`
        ])
    ];
    if (options.highEnergy) required.push(...languageIds.flatMap(language => [`high_energy.${language}`, `high_energy.intention_${language}`, `high_energy.affirmation_${language}`]));
    if (options.corpse) required.push(...languageIds.flatMap(language => [`corpse_pose.intro.${language}`, `corpse_pose.transition.${language}`]));
    if (options.bath) required.push(...languageIds.flatMap(language => [`bath_session.title.${language}`, `bath_session.intro.${language}`, `bath_session.instructions.${language}`, `bath_session.reminder.${language}`]));
    if (options.perinealCare) required.push(...languageIds.flatMap(language => [`perineal_care.title.${language}`, `perineal_care.intro.${language}`, `perineal_care.instructions.${language}`, `perineal_care.reminder.${language}`]));
    if (options.assistedBathing) required.push(...languageIds.flatMap(language => [`assisted_bathing.title.${language}`, `assisted_bathing.intro.${language}`, `assisted_bathing.instructions.${language}`, `assisted_bathing.reminder.${language}`]));
    if (options.massage) required.push(...languageIds.flatMap(language => [`massage.title.${language}`, `massage.intro.${language}`, `massage.instructions.${language}`, `massage.reminder.${language}`]));
    if (options.yoga) required.push(...languageIds.flatMap(language => [`yoga.intro.${language}`, `yoga.preparation.${language}`, `yoga.next_pose_prompt.${language}`, `yoga.session_complete.${language}`]), 'yoga.poses');
    if (options.hooponopono) required.push(...languageIds.flatMap(language => [`hooponopono.intro.${language}`, `hooponopono.phrases.${language}`, `hooponopono.closing.${language}`]));
    const missing = required.filter(path => !hasLocalizedScriptPath(scripts, path));
    return { valid: missing.length === 0, missing };
}

let piperVoiceRegistry = [];
let languageRegistry = [];
let localeBundles = {};
let fallbackLanguageId = 'en';
let timingConfig = {
    journey: {},
    transitions: {},
    narration: {},
    estimate: {}
};
const timingFallbacks = {
    'transitions.initialSettle': 2,
    'transitions.openingPause': 1,
    'transitions.postBreathing': 3,
    'transitions.breathingPreparation': 5,
    'transitions.breathingTutorialFade': 1,
    'transitions.breathingCompletion': 5,
    'transitions.corpseTransitionAt': 60,
    'transitions.corpseFinalSettle': 3,
    'transitions.yogaPoseGap': 5,
    'transitions.yogaFinalSettle': 5,
    'transitions.chakraPostMantra': 4,
    'transitions.chakraLeadOut': 15,
    'transitions.intervalPreparation': 2,
    'transitions.closingFirstPause': 2,
    'transitions.closingSecondPause': 3,
    'transitions.hooponoponoIntroPause': 2,
    'transitions.hooponoponoPhrasePause': 2,
    'transitions.hooponoponoFinalRest': 15,
    'transitions.finalSilence': 60,
    'narration.piperLeadIn': 1.2,
    'narration.sentenceGap': 1.5,
    'narration.fadeOutPause': 2.5,
    'narration.browserSafetyPerCharacter': 200,
    'narration.browserSafetyBuffer': 3000,
    'estimate.baseOverhead': 5,
    'estimate.normalExtra': 7,
    'estimate.highEnergyExtra': 3,
    'estimate.boxBreathingOverhead': 4,
    'estimate.hooponoponoOverhead': 3,
    'estimate.chakraStageOverhead': 2,
    'estimate.yogaPoseTransitionEstimate': 15
};

function timing(section, key, fallback = 0) {
    const value = timingConfig[section]?.[key];
    return value == null ? (timingFallbacks[`${section}.${key}`] ?? fallback) : value;
}

function timingDefault(key, fallback) {
    return timingConfig.journey?.[key]?.default ?? fallback;
}

function mergeTimingProfile(base, profile) {
    return ['journey', 'transitions', 'narration', 'estimate'].reduce((merged, section) => {
        merged[section] = { ...(base[section] || {}), ...(profile[section] || {}) };
        return merged;
    }, { schemaVersion: base.schemaVersion });
}

function formatRangeControlValue(input) {
    const value = Number(input.value);
    if (!Number.isFinite(value)) return input.value;
    if (input.id === 'time-per-chakra') return `${value.toFixed(1)} mins`;
    if (input.id === 'time-high-energy') return `${value} mins`;
    if (['time-bath', 'time-perineal-care', 'time-assisted-bathing', 'time-massage'].includes(input.id)) {
        return `${Math.floor(value / 60)}m`;
    }
    if (input.id.startsWith('time-')) return `${value}s`;
    return input.step && Number(input.step) < 1 ? value.toFixed(2) : String(value);
}

function enhanceRangeControls() {
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const container = input.closest('.mixer-row, .time-selector') || input.parentElement;
        if (!container || container.dataset.rangeEnhanced === 'true') return;

        container.dataset.rangeEnhanced = 'true';
        container.classList.add('range-control');

        let current = container.querySelector(':scope > span');
        if (!current) {
            current = document.createElement('span');
            container.appendChild(current);
        }
        current.classList.add('range-current');

        const meta = document.createElement('div');
        meta.className = 'range-meta';
        const decrement = document.createElement('button');
        decrement.type = 'button';
        decrement.className = 'range-step range-decrement';
        decrement.setAttribute('aria-label', 'Decrease value');
        decrement.textContent = '−';
        const minimum = document.createElement('span');
        minimum.className = 'range-min';
        const maximum = document.createElement('span');
        maximum.className = 'range-max';
        const increment = document.createElement('button');
        increment.type = 'button';
        increment.className = 'range-step range-increment';
        increment.setAttribute('aria-label', 'Increase value');
        increment.textContent = '+';
        meta.append(decrement, minimum, current, maximum, increment);
        container.appendChild(meta);

        const adjust = direction => {
            const step = Number(input.step) || 1;
            const precision = (String(step).split('.')[1] || '').length;
            const next = Math.min(Number(input.max), Math.max(Number(input.min), Number(input.value) + (direction * step)));
            input.value = precision ? next.toFixed(precision) : String(next);
            input.dispatchEvent(new Event('input', { bubbles: true }));
        };
        decrement.addEventListener('click', () => adjust(-1));
        increment.addEventListener('click', () => adjust(1));

        const update = () => {
            minimum.textContent = input.min;
            maximum.textContent = input.max;
            current.textContent = formatRangeControlValue(input);
            decrement.disabled = Number(input.value) <= Number(input.min);
            increment.disabled = Number(input.value) >= Number(input.max);
        };
        input.addEventListener('input', update);
        update();
    });
}

function refreshRangeControlDisplays() {
    document.querySelectorAll('.range-control').forEach(container => {
        const input = container.querySelector('input[type="range"]');
        const current = container.querySelector('.range-current');
        if (input && current) current.textContent = formatRangeControlValue(input);
    });
}

function applyTimingControls() {
    const controls = {
        'time-per-chakra': 'timePerChakra',
        'time-high-energy': 'timeHighEnergy',
        'time-icebreaker': 'icebreaker',
        'time-breathing': 'breathingStep',
        'time-corpse': 'corpsePose',
        'time-interval': 'interval',
        'time-yoga-prep': 'yogaPreparation',
        'time-yoga-pose': 'yogaPose',
        'time-bath': 'bath',
        'time-perineal-care': 'perinealCare',
        'time-assisted-bathing': 'assistedBathing',
        'time-massage': 'massage'
    };
    Object.entries(controls).forEach(([id, key]) => {
        const input = document.getElementById(id);
        const definition = timingConfig.journey?.[key];
        if (!input || !definition) return;
        ['min', 'max', 'step'].forEach(attribute => {
            if (definition[attribute] != null) input.setAttribute(attribute, definition[attribute]);
        });
    });
    enhanceRangeControls();
}

async function loadTimingConfig() {
    try {
        const response = await fetch('timing-config.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        timingConfig = await response.json();
        const profileName = new URLSearchParams(window.location.search).get('timingProfile');
        if (profileName && timingConfig.profiles?.[profileName]) {
            timingConfig = mergeTimingProfile(timingConfig, timingConfig.profiles[profileName]);
            console.info(`[Timing] Using profile: ${profileName}`);
        }
    } catch (error) {
        console.warn('Timing configuration unavailable; using built-in timing defaults.', error);
    }
    applyTimingControls();
    if (typeof state !== 'undefined') {
        const persisted = (key) => localStorage.getItem(key) !== null;
        const defaults = {
            timePerChakra: ['chakra_time', 'timePerChakra', 5],
            timeHighEnergy: ['chakra_time_high_energy', 'timeHighEnergy', 5],
            timeIcebreaker: ['chakra_time_icebreaker', 'icebreaker', 60],
            timeBreathing: ['chakra_time_breathing', 'breathingStep', 8],
            timeCorpse: ['chakra_time_corpse', 'corpsePose', 300],
            timeInterval: ['chakra_time_interval', 'interval', 10],
            timeYogaPrep: ['chakra_time_yoga_prep', 'yogaPreparation', 60],
            timeYogaPose: ['chakra_time_yoga_pose', 'yogaPose', 60],
            timeBath: ['chakra_time_bath', 'bath', 600],
            timePerinealCare: ['chakra_time_perineal_care', 'perinealCare', 300],
            timeAssistedBathing: ['chakra_time_assisted_bathing', 'assistedBathing', 600],
            timeMassage: ['chakra_time_massage', 'massage', 600]
        };
        Object.entries(defaults).forEach(([stateKey, [storageKey, configKey, fallback]]) => {
            if (!persisted(storageKey)) state[stateKey] = timingDefault(configKey, fallback);
            const definition = timingConfig.journey?.[configKey];
            if (definition) {
                const minimum = Number(definition.min);
                const maximum = Number(definition.max);
                const bounded = Math.min(maximum, Math.max(minimum, Number(state[stateKey])));
                if (Number.isFinite(bounded) && bounded !== state[stateKey]) {
                    state[stateKey] = bounded;
                    localStorage.setItem(storageKey, String(bounded));
                }
            }
        });
    }
}

function getLanguageConfig(language = state.language) {
    return languageRegistry.find(item => item.id === language) ||
        languageRegistry.find(item => item.id === 'en') || { id: language, locale: language, browserPrefixes: [language] };
}

function getLocalizedValue(bundle, path) {
    return path.split('.').reduce((value, key) => value == null ? undefined : value[key], bundle);
}

function localized(source, field = null, language = state.language) {
    if (source == null) return undefined;
    const value = field == null ? source : source[field];
    if (value != null && typeof value === 'object' && value[language] != null) return value[language];
    if (field == null) {
        for (const contentField of ['text', 'content', 'value']) {
            if (source[contentField] != null) return localized(source[contentField], null, language);
        }
    }
    if (field && source[`${field}_${language}`] != null) return source[`${field}_${language}`];
    if (field && source[`${field}_en`] != null) return source[`${field}_en`];
    if (field == null && source[language] != null) return source[language];
    if (field == null && source.en != null) return source.en;
    return typeof value === 'string' || Array.isArray(value) ? value : undefined;
}

function t(path, language = state.displayLanguage) {
    const value = getLocalizedValue(localeBundles[language], path);
    if (value != null) return value;
    const fallback = getLocalizedValue(localeBundles[fallbackLanguageId], path);
    return fallback == null ? path : fallback;
}

// Narration/system copy follows the selected meditation language, while t()
// is reserved for the language used by the visible interface.
function contentT(path) {
    return t(path, state.language);
}

function defaultIntention(language = state.language) {
    return t('ui.defaultIntention', language);
}

function hrimDefaultIntention(language = state.language) {
    return t('ui.hrimDefaultIntention', language);
}

function isGeneratedIntention(value, language = state.language) {
    const current = (value || '').trim();
    return !current || current === defaultIntention(language) || current === hrimDefaultIntention(language);
}

function getJourneyRoadmapLabels() {
    if (getChecked('music-only-toggle')) return [t('ui.roadmapMusicOnly')];

    if (getChecked('high-energy-toggle')) {
        return [t('ui.roadmapIntention'), t('ui.roadmapHrim'), t('ui.roadmapClosing')];
    }

    const labels = [
        t(state.returningJourney ? 'ui.roadmapReturning' : 'ui.roadmapArrival'),
        t('ui.roadmapIntention')
    ];
    if (getChecked('box-meditation-toggle')) labels.push(t('ui.roadmapBreathing'));
    labels.push(t('ui.roadmapChakras'));

    if (getChecked('yoga-bridge-toggle')) {
        labels.push(t('ui.roadmapYoga'));
        if (getChecked('bath-session-toggle')) {
            if (getChecked('massage-toggle')) labels.push(t('ui.roadmapMassage'));
            if (getChecked('perineal-care-toggle')) labels.push(t('ui.roadmapPerineal'));
            if (getChecked('assisted-bathing-toggle')) labels.push(t('ui.roadmapAssistedBathing'));
            else labels.push(t('ui.roadmapBath'));
        }
    }

    labels.push(t('ui.roadmapClosing'));
    if (getChecked('hooponopono-toggle')) labels.push(t('ui.roadmapHooponopono'));
    if (getChecked('corpse-pose-toggle')) labels.push(t('ui.roadmapCorpse'));
    return labels;
}

function updateJourneyRoadmap() {
    const roadmap = document.getElementById('journey-roadmap');
    if (!roadmap) return;
    roadmap.textContent = getJourneyRoadmapLabels().join(' » ');
}

function applyLocaleUI() {
    document.documentElement.lang = getLanguageConfig(state.displayLanguage).locale || state.displayLanguage;
    document.title = t('ui.chakraMeditation');
    setText('app-title', t('ui.chakraMeditation'));
    const configSubtitle = document.querySelector('#config-screen > .subtitle');
    if (configSubtitle) configSubtitle.textContent = t('ui.settingsSubtitle');
    const languageLabel = document.querySelector('label[for="language-select"]');
    if (languageLabel) languageLabel.textContent = t('ui.meditationLanguage');
    const displayLanguageLabel = document.querySelector('label[for="display-language-select"]');
    if (displayLanguageLabel) displayLanguageLabel.textContent = t('ui.displayLanguage');
    if (testVoiceBtn) testVoiceBtn.textContent = t('ui.previewVoice');
    if (openSettingsBtn) openSettingsBtn.textContent = t('ui.settings');
    if (beginConsultationBtn) beginConsultationBtn.textContent = t('ui.beginConsultation');
    setText('lobby-title', t('ui.meditationRoom'));
    setText('completion-title', t('ui.journeyComplete'));
    setText('completion-message', t('ui.meditationCompleted'));
    setText('close-completion', t('ui.returnToRoom'));
    setText('journal-prompt', t('ui.journalPrompt'));
    setText('save-journal', t('ui.saveEntry'));
    setText('returning-journey-label', t('ui.returningJourney'));
    setText('save-config', t('ui.startMeditation'));
    setText('start-meditation', t('ui.beginJourney'));
    document.querySelectorAll('.stat-lbl').forEach((element, index) => {
        element.textContent = t(index === 0 ? 'ui.sessionTime' : 'ui.totalJourneys');
    });
    const journalEntry = document.getElementById('journal-entry');
    if (journalEntry) journalEntry.placeholder = t('ui.writeFreely');
    const intentionInput = document.getElementById('intention-input');
    if (intentionInput) intentionInput.placeholder = t('ui.intentionPlaceholder');
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const path = element.dataset.i18n;
        if (path) element.textContent = t(path);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        const path = element.dataset.i18nAriaLabel;
        if (path) element.setAttribute('aria-label', t(path));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const path = element.dataset.i18nPlaceholder;
        if (path) element.setAttribute('placeholder', t(path));
    });

    const controlLabels = {
        'audio-filters-toggle': 'ui.audioFilters',
        'reverse-journey-toggle': 'ui.reverseJourney',
        'box-meditation-toggle': 'ui.boxMeditation',
        'hooponopono-toggle': 'ui.hooponopono',
        'frequencies-toggle': 'ui.chakraFrequencies',
        'eyes-close-mode-toggle': 'ui.eyesCloseMode',
        'music-only-toggle': 'ui.musicOnlyMode',
        'corpse-pose-toggle': 'ui.corpsePoseOption',
        'yoga-bridge-toggle': 'ui.yogaBridge',
        'bath-session-toggle': 'ui.bathSession',
        'perineal-care-toggle': 'ui.perinealCare',
        'assisted-bathing-toggle': 'ui.assistedBathing',
        'massage-toggle': 'ui.massage',
        'high-energy-toggle': 'ui.highEnergy',
        'returning-journey-toggle': 'ui.returningJourney'
    };
    Object.entries(controlLabels).forEach(([inputId, path]) => {
        const input = document.getElementById(inputId);
        const label = input && input.closest('label');
        if (!label) return;
        const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) textNode.textContent = ` ${t(path)}`;
    });
    updateJourneyRoadmap();
}

async function loadLanguageManifest() {
    try {
        const response = await fetch('language-manifest.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const manifest = await response.json();
        languageRegistry = Array.isArray(manifest.languages) ? manifest.languages : [];
        fallbackLanguageId = manifest.fallbackLanguage || 'en';
        const requested = localStorage.getItem('chakra_lang');
        const defaultLanguage = manifest.defaultLanguage || languageRegistry[0]?.id || 'en';
        state.language = languageRegistry.some(item => item.id === requested) ? requested : defaultLanguage;
        const requestedDisplayLanguage = localStorage.getItem('chakra_display_language');
        state.displayLanguage = languageRegistry.some(item => item.id === requestedDisplayLanguage)
            ? requestedDisplayLanguage : fallbackLanguageId;
        await Promise.all(languageRegistry.map(async language => {
            const localeResponse = await fetch(language.localeSource);
            if (!localeResponse.ok) throw new Error(`Locale ${language.id} HTTP ${localeResponse.status}`);
            localeBundles[language.id] = await localeResponse.json();
        }));
        populateLanguageSelect();
        applyLocaleUI();
    } catch (error) {
        console.warn('Language manifest unavailable; using built-in language options.', error);
        languageRegistry = [
            { id: 'ml', locale: 'ml-IN', label: 'Malayalam', browserPrefixes: ['ml'], defaultPiperVoice: 'ml_IN-arjun-medium' },
            { id: 'en', locale: 'en-US', label: 'English', browserPrefixes: ['en'], defaultPiperVoice: 'en_US-lessac-medium' }
        ];
    }
}

function populateLanguageSelect() {
    if (!languageSelect || languageRegistry.length === 0) return;
    [languageSelect, document.getElementById('display-language-select')].forEach(select => {
        if (!select) return;
        select.innerHTML = '';
        languageRegistry.forEach(language => {
            const option = document.createElement('option');
            option.value = language.id;
            option.textContent = language.label;
            select.appendChild(option);
        });
    });
    languageSelect.value = state.language;
    const displayLanguageSelect = document.getElementById('display-language-select');
    if (displayLanguageSelect) displayLanguageSelect.value = state.displayLanguage;
}

function isPiperVoice(value) {
    return typeof value === 'string' && value.startsWith('piper:');
}

function piperVoiceId(value) {
    return isPiperVoice(value) ? value.slice('piper:'.length) : '';
}

function setVoiceStatus(message, tone = 'muted') {
    const status = document.getElementById('voice-status');
    if (!status) return;
    status.textContent = message || '';
    status.style.display = message ? 'block' : 'none';
    status.style.color = tone === 'error' ? '#f87171' : tone === 'ready' ? '#4ade80' : '#ffa500';
}

function voiceMatchesLanguage(voice, language = state.language) {
    if (!voice || !voice.lang) return false;
    const prefixes = getLanguageConfig(language).browserPrefixes || [language];
    const voiceLanguage = voice.lang.toLowerCase();
    return prefixes.some(prefix => voiceLanguage.startsWith(String(prefix).toLowerCase()));
}

function getBrowserVoiceForContent() {
    const browserName = String(state.voiceName || '').replace(/^browser:/, '');
    const selected = state.voices.find(voice => voice.name === browserName && voiceMatchesLanguage(voice));
    return selected || state.voices.find(voice => voiceMatchesLanguage(voice)) || null;
}

class PiperTTS {
    constructor(audioEngine) {
        this.audio = audioEngine;
        this.worker = null;
        this.voiceId = null;
        this.voiceDefinition = null;
        this.nextRequestId = 1;
        this.queue = [];
        this.activeJob = null;
        this.currentSource = null;
        this.currentResolve = null;
        this.isCancelling = false;
        this.paused = false;
    }

    isSupported() {
        return typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined' &&
            !!(this.audio && this.audio.ctx && typeof this.audio.ctx.decodeAudioData === 'function');
    }

    configure(value) {
        const nextVoiceId = piperVoiceId(value);
        if (!nextVoiceId) return false;
        if (this.voiceId && this.voiceId !== nextVoiceId) {
            this.cancel('voice changed');
        }
        this.voiceId = nextVoiceId;
        this.voiceDefinition = piperVoiceRegistry.find(voice => voice.id === nextVoiceId) || null;
        return true;
    }

    ensureWorker() {
        if (!this.worker) {
            this.worker = new Worker('./piper-worker.js', { type: 'module' });
            this.worker.onmessage = (event) => this.handleWorkerMessage(event.data || {});
            this.worker.onerror = (event) => {
                const message = event.message || 'Piper worker failed.';
                setVoiceStatus(t('ui.piperFallback'), 'error');
                if (this.activeJob) this.finishActive(new Error(message));
            };
        }
        return this.worker;
    }

    request(type, payload = {}) {
        if (!this.isSupported()) return Promise.reject(new Error('This browser cannot run Piper locally.'));
        const requestId = `piper-${Date.now()}-${this.nextRequestId++}`;
        return new Promise((resolve, reject) => {
            this.queue.push({ requestId, type, payload, resolve, reject });
            this.pump();
        });
    }

    pump() {
        if (this.activeJob || this.isCancelling || this.paused || this.queue.length === 0) return;
        const job = this.queue.shift();
        this.activeJob = job;
        this.ensureWorker().postMessage({
            type: job.type,
            requestId: job.requestId,
            voiceId: this.voiceId,
            voiceDefinition: this.voiceDefinition,
            ...job.payload
        });
    }

    finishActive(error, value) {
        const job = this.activeJob;
        this.activeJob = null;
        if (!job) return;
        if (error) job.reject(error);
        else job.resolve(value);
        this.pump();
    }

    handleWorkerMessage(message) {
        if (message.type === 'progress') {
            const total = Number(message.total) || 0;
            const loaded = Number(message.loaded) || 0;
            const percent = total > 0 ? ` ${Math.round((loaded / total) * 100)}%` : '';
            setVoiceStatus(`${t('ui.piperPreparing')}${percent}`);
            return;
        }
        if (!this.activeJob || message.requestId !== this.activeJob.requestId) return;
        if (message.type === 'ready') {
            setVoiceStatus(t('ui.piperReady'), 'ready');
            this.finishActive(null, true);
        } else if (message.type === 'audio') {
            this.finishActive(null, message.audio);
        } else if (message.type === 'error') {
            console.error('[Piper] worker error:', message.error || 'Piper synthesis failed.', message);
            this.finishActive(new Error(message.error || 'Piper synthesis failed.'));
        }
    }

    warmup() {
        setVoiceStatus(t('ui.piperPreparing'));
        return this.request('warmup');
    }

    synthesize(text) {
        return this.request('synthesize', {
            text,
            settings: { lengthScale: 1 / Math.max(0.85, Math.min(1.15, state.voicePace || 1)) }
        });
    }

    getNormalizationGain(buffer) {
        let peak = 0;
        let sumSquares = 0;
        let sampleCount = 0;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const samples = buffer.getChannelData(channel);
            for (let i = 0; i < samples.length; i++) {
                const sample = samples[i];
                const magnitude = Math.abs(sample);
                if (magnitude > peak) peak = magnitude;
                sumSquares += sample * sample;
                sampleCount++;
            }
        }
        if (!peak || !sampleCount) return 1;

        // Gentle per-clip matching: bring quiet model outputs toward a
        // consistent RMS while keeping headroom for the master limiter.
        const rms = Math.sqrt(sumSquares / sampleCount);
        let gain = rms > 0 ? 0.16 / rms : 1;
        gain = Math.min(gain, 0.85 / peak);
        return Math.max(0.7, Math.min(1.5, gain));
    }

    async play(blob, volumeScale = 1) {
        if (!blob) return;
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = await this.audio.ctx.decodeAudioData(arrayBuffer);
        if (!buffer || !this.audio.ctx) return;

        return new Promise((resolve) => {
            const source = this.audio.ctx.createBufferSource();
            const clipGain = this.audio.ctx.createGain();
            source.buffer = buffer;
            source.connect(clipGain);
            clipGain.connect(this.audio.voiceGain || this.audio.ctx.destination);
            this.currentSource = source;
            this.currentResolve = resolve;
            source.onended = () => {
                if (this.currentSource === source) {
                    this.currentSource = null;
                    this.currentResolve = null;
                }
                resolve();
            };
            const now = this.audio.ctx.currentTime;
            const fadeTime = Math.min(0.05, buffer.duration / 4);
            const normalizedGain = this.getNormalizationGain(buffer);
            clipGain.gain.setValueAtTime(0, now);
            clipGain.gain.linearRampToValueAtTime(normalizedGain, now + fadeTime);
            if (buffer.duration > fadeTime * 2) {
                clipGain.gain.setValueAtTime(normalizedGain, now + buffer.duration - fadeTime);
                clipGain.gain.linearRampToValueAtTime(0, now + buffer.duration);
            }
            if (this.audio.voiceGain) {
                this.audio.voiceGain.gain.setValueAtTime(state.volVoice * volumeScale, now);
            }
            source.start();
        });
    }

    async preview(text) {
        await this.warmup();
        const blob = await this.synthesize(text);
        await this.play(blob);
        setVoiceStatus(t('ui.piperReady'), 'ready');
    }

    setPaused(paused) {
        this.paused = paused;
        if (!paused) this.pump();
    }

    cancel(reason = 'cancelled') {
        this.isCancelling = true;
        if (this.activeJob && this.worker) {
            this.worker.postMessage({ type: 'cancel', requestId: this.activeJob.requestId });
        }
        if (this.currentSource) {
            try { this.currentSource.stop(); } catch (error) {}
            this.currentSource = null;
        }
        if (this.currentResolve) {
            this.currentResolve();
            this.currentResolve = null;
        }
        const error = new Error(`Piper ${reason}`);
        if (this.activeJob) this.finishActive(error);
        this.queue.splice(0).forEach(job => job.reject(error));
        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.activeJob = null;
        this.isCancelling = false;
        this.paused = false;
    }
}

// Audio Engine
class SeamlessLoop {
    constructor(ctx, buffer, destination, targetGain = 1.0, crossfadeDuration = 5) {
        this.ctx = ctx;
        this.buffer = buffer;
        this.destination = destination;
        this.targetGainValue = targetGain;
        this.crossfadeDuration = crossfadeDuration;
        this.activeSources = [];
        this.nextStartTimer = null;
        this.isRunning = false;
        this.scheduleAheadTime = 1.5;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._scheduleInstance(this.ctx.currentTime + 0.01);
    }

    _scheduleInstance(startTime) {
        if (!this.isRunning) return;

        const now = Math.max(startTime, this.ctx.currentTime + 0.01);
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();

        source.buffer = this.buffer;
        source.connect(gain);
        gain.connect(this.destination);

        // Initial Fade In
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.targetGainValue, now + this.crossfadeDuration);

        source.start(now);
        this.activeSources.push({ source, gain });

        // Schedule next instance and current fade out
        const duration = this.buffer.duration;
        const nextStartTime = now + duration - this.crossfadeDuration;

        // Schedule fade out for this instance
        gain.gain.setValueAtTime(this.targetGainValue, nextStartTime);
        gain.gain.linearRampToValueAtTime(0, nextStartTime + this.crossfadeDuration);

        // Remove from tracking and stop after fade out
        setTimeout(() => {
            try { source.stop(); } catch(e) {}
            this.activeSources = this.activeSources.filter(s => s.source !== source);
        }, (duration + 1) * 1000);

        // Use the JavaScript timer only to enqueue the next source early. The
        // actual start time is placed on the AudioContext timeline, so normal
        // mobile timer jitter does not move the crossfade itself.
        const delayMs = Math.max(25, (nextStartTime - this.ctx.currentTime - this.scheduleAheadTime) * 1000);
        this.nextStartTimer = setTimeout(() => {
            this.nextStartTimer = null;
            this._scheduleInstance(nextStartTime);
        }, delayMs);
    }

    setGain(value) {
        this.targetGainValue = value;
        this.activeSources.forEach(s => {
            const now = this.ctx.currentTime;
            s.gain.gain.cancelScheduledValues(now);
            // Increased to 2.0s for a more organic volume transition
            s.gain.gain.linearRampToValueAtTime(value, now + 2.0);
        });
    }

    stop(fadeTime = 4) {
        this.isRunning = false;
        if (this.nextStartTimer) clearTimeout(this.nextStartTimer);

        const now = this.ctx.currentTime;
        this.activeSources.forEach(s => {
            s.gain.gain.cancelScheduledValues(now);
            s.gain.gain.setValueAtTime(s.gain.gain.value, now);
            s.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
            setTimeout(() => { try { s.source.stop(); } catch(e) {} }, (fadeTime + 1.0) * 1000);
        });
        this.activeSources = [];
    }
    }
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.droneOscillators = [];
        this.elementalNodes = [];
        this.binauralNodes = []; // New: Binaural Beat Layer
        this.masterGain = null;
        this.voiceGain = null;
        this.reverbWet = null; // New: Reverb Swell control
        this.pannerNode = null;
        this.isInitialized = false;

        // Looping Managers
        this.mantraLoop = null;
        this.bgMusicLoop = null;

        this.mantraBuffer = {};
        this.bgMusicBuffer = null;

        // Permanent Absolute Grounding Anchor (Closed Eyes Mode)
        this.groundingAnchor = null;

        // Studio Mastering Nodes
        this.masterCompressor = null;
        this.masterLimiter = null;
        this.presenceFilter = null;
        this.voiceWarmthFilter = null;
        this.voiceClarityFilter = null;
        this.voiceEchoSend = null;
        this.voiceEchoDelay = null;
        this.voiceEchoConvolver = null;
        this.voiceEchoFilter = null;
        this.voiceEchoWetGain = null;
        this.lowCutFilter = null;
        this.mantraPresenceLFO = null; // New: Organic Mantra Motion
    }

    async init() {
        if (this.isInitialized) {
            if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
            return;
        }
        
        // Upgrade 1: Optimize context for playback fidelity
        this.ctx = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'playback',
            sampleRate: 44100
        });

        // Crucial for mobile: Resume context on user gesture
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 

        this.voiceGain = this.ctx.createGain();
        this.voiceGain.gain.value = state.volVoice;

        // Upgrade 2: Studio Harmonic Exciter (Soft Clipper)
        // Only enabled in 'Open' mode for crispness. Disabled in 'Closed' for warmth.
        this.exciter = this.ctx.createWaveShaper();
        if (!state.eyesCloseMode) {
            this.exciter.curve = this.makeDistortionCurve(0.002); 
        } else {
            // Straight line curve = no distortion
            this.exciter.curve = new Float32Array([-1, 1]);
        }
        
        // Upgrade 4: Frequency Carving Filter. Keep the nodes in the graph
        // even when disabled so the mixer can safely change the setting live.
        this.voiceCarveFilter = this.ctx.createBiquadFilter();
        this.voiceCarveFilter.type = 'peaking';
        this.voiceCarveFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);
        this.voiceCarveFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
        this.voiceCarveFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.presenceFilter = this.ctx.createBiquadFilter();
        this.presenceFilter.type = 'highshelf';
        this.presenceFilter.frequency.setValueAtTime(4000, this.ctx.currentTime);
        this.presenceFilter.gain.setValueAtTime(state.audioFilters ? (state.eyesCloseMode ? -6 : -3) : 0, this.ctx.currentTime);

        // Voice-only tone controls. These sit before the shared comfort chain
        // so tuning narration does not recolor the background music.
        this.voiceWarmthFilter = this.ctx.createBiquadFilter();
        this.voiceWarmthFilter.type = 'lowshelf';
        this.voiceWarmthFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
        this.voiceWarmthFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.voiceClarityFilter = this.ctx.createBiquadFilter();
        this.voiceClarityFilter.type = 'peaking';
        this.voiceClarityFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.voiceClarityFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);
        this.voiceClarityFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        // Controlled voice-only echo. It is intentionally dry by default;
        // the mixer exposes only safe presets rather than raw feedback knobs.
        this.voiceEchoSend = this.ctx.createGain();
        this.voiceEchoSend.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoDelay = this.ctx.createDelay(0.5);
        this.voiceEchoDelay.delayTime.setValueAtTime(0.04, this.ctx.currentTime);
        this.voiceEchoConvolver = this.ctx.createConvolver();
        this.voiceEchoConvolver.buffer = this.createImpulseResponse(1.1, 3.2);
        this.voiceEchoFilter = this.ctx.createBiquadFilter();
        this.voiceEchoFilter.type = 'lowpass';
        this.voiceEchoFilter.frequency.setValueAtTime(2600, this.ctx.currentTime);
        this.voiceEchoWetGain = this.ctx.createGain();
        this.voiceEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoSend.connect(this.voiceEchoDelay);
        this.voiceEchoDelay.connect(this.voiceEchoFilter);
        this.voiceEchoDelay.disconnect();
        this.voiceEchoDelay.connect(this.voiceEchoConvolver);
        this.voiceEchoConvolver.connect(this.voiceEchoFilter);
        this.voiceEchoFilter.connect(this.voiceEchoWetGain);

        this.lowCutFilter = this.ctx.createBiquadFilter();
        this.lowCutFilter.type = 'highpass';
        // Grounding: Allow deeper frequencies in Closed mode (40Hz vs 80Hz)
        this.lowCutFilter.frequency.setValueAtTime(state.eyesCloseMode ? 40 : 80, this.ctx.currentTime);
        this.lowCutFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

        // Eyes Close Mode Filter
        this.eyesCloseFilter = this.ctx.createBiquadFilter();
        this.eyesCloseFilter.type = 'lowpass';
        // Keep the voice warm without removing Malayalam consonant detail.
        // The previous 2.2kHz ceiling was too dark for neural narration.
        this.eyesCloseFilter.frequency.setValueAtTime(
            state.eyesCloseMode ? 3200 : 5200,
            this.ctx.currentTime
        );
        this.eyesCloseFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
        this.eyesCloseFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-24, this.ctx.currentTime); 
        this.masterCompressor.knee.setValueAtTime(30, this.ctx.currentTime); 
        this.masterCompressor.ratio.setValueAtTime(3.0, this.ctx.currentTime); 
        this.masterCompressor.attack.setValueAtTime(0.01, this.ctx.currentTime); 
        this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        // Final safety stage: catch short peaks from narration, bells, and
        // overlapping crossfades without changing the musical compressor.
        this.masterLimiter = this.ctx.createDynamicsCompressor();
        this.masterLimiter.threshold.setValueAtTime(-1.0, this.ctx.currentTime);
        this.masterLimiter.knee.setValueAtTime(0, this.ctx.currentTime);
        this.masterLimiter.ratio.setValueAtTime(20, this.ctx.currentTime);
        this.masterLimiter.attack.setValueAtTime(0.001, this.ctx.currentTime);
        this.masterLimiter.release.setValueAtTime(0.1, this.ctx.currentTime);

        this.bgMusicGain = this.ctx.createGain();
        this.bgMusicGain.gain.value = 0;
        
        // Deep Spectrum Carving
        this.bgMusicEQ = this.ctx.createBiquadFilter();
        this.bgMusicEQ.type = 'notch';
        this.bgMusicEQ.frequency.setValueAtTime(2500, this.ctx.currentTime); 
        this.bgMusicEQ.Q.setValueAtTime(1.5, this.ctx.currentTime);

        this.bgMusicLPF = this.ctx.createBiquadFilter();
        this.bgMusicLPF.type = 'lowpass';
        this.bgMusicLPF.frequency.setValueAtTime(state.audioFilters ? 1200 : 20000, this.ctx.currentTime);

        // Anti-Hum Filter: Targets the resonant "drone/hum" frequency
        this.bgMusicHumFilter = this.ctx.createBiquadFilter();
        this.bgMusicHumFilter.type = 'peaking'; // Peaking allows us to gently dip specific mid-frequencies
        this.bgMusicHumFilter.frequency.setValueAtTime(450, this.ctx.currentTime); 
        this.bgMusicHumFilter.gain.setValueAtTime(0, this.ctx.currentTime); 

        this.bgMusicSmoothGain = this.ctx.createGain();
        this.bgMusicSmoothGain.gain.value = state.eyesCloseMode ? 0.7 : 1.0;

        this.bgMusicGain.connect(this.bgMusicEQ);
        this.bgMusicEQ.connect(this.bgMusicLPF);
        this.bgMusicLPF.connect(this.bgMusicHumFilter);
        this.bgMusicHumFilter.connect(this.bgMusicSmoothGain);
        this.bgMusicSmoothGain.connect(this.lowCutFilter);

        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.masterLimiter);

        this.pannerNode = this.ctx.createStereoPanner();
        
        const pannerLfo = this.ctx.createOscillator();
        const pannerLfoGain = this.ctx.createGain();
        pannerLfo.type = 'sine';
        pannerLfo.frequency.setValueAtTime(0.03, this.ctx.currentTime);
        pannerLfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        pannerLfo.connect(pannerLfoGain);
        pannerLfoGain.connect(this.pannerNode.pan);
        pannerLfo.start();

        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = 0.35; 
        this.reverbWet = this.reverbGain; 
        
        this.reverbFilter = this.ctx.createBiquadFilter();
        this.reverbFilter.type = 'lowpass';
        this.reverbFilter.frequency.setValueAtTime(state.audioFilters ? 1500 : 20000, this.ctx.currentTime);

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.8;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.45;

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);

        this.masterGain.connect(this.delayNode);
        this.masterGain.connect(this.pannerNode);
        this.delayNode.connect(this.pannerNode);
        
        this.pannerNode.connect(this.lowCutFilter);

        // Local Piper narration enters the same clarity/comfort chain as the
        // existing voice mix without being coupled to the drone gain.
        this.voiceGain.connect(this.voiceWarmthFilter);
        this.voiceWarmthFilter.connect(this.voiceClarityFilter);
        this.voiceClarityFilter.connect(this.lowCutFilter);
        this.voiceClarityFilter.connect(this.voiceEchoSend);
        this.voiceEchoWetGain.connect(this.lowCutFilter);
        
        let lastNode = this.lowCutFilter;
        // Inject Eyes Close Filter
        lastNode.connect(this.eyesCloseFilter);
        lastNode = this.eyesCloseFilter;

        if (this.voiceCarveFilter) {
            lastNode.connect(this.voiceCarveFilter);
            lastNode = this.voiceCarveFilter;
        }
        lastNode.connect(this.exciter);
        
        this.exciter.connect(this.reverbGain);
        this.reverbGain.connect(this.reverbFilter);
        
        if (this.presenceFilter) {
            this.reverbFilter.connect(this.presenceFilter);
            this.exciter.connect(this.presenceFilter);
            this.presenceFilter.connect(this.masterCompressor);
        } else {
            this.reverbFilter.connect(this.masterCompressor);
            this.exciter.connect(this.masterCompressor);
        }
        
        this.masterCompressor.connect(this.masterLimiter);
        this.masterLimiter.connect(this.ctx.destination);

        // Upgrade: Permanent Absolute Grounding Anchor (Closed Eyes Mode)
        if (state.eyesCloseMode) {
            const anchorOsc = this.ctx.createOscillator();
            const anchorGain = this.ctx.createGain();
            anchorOsc.type = 'sine';
            anchorOsc.frequency.setValueAtTime(40, this.ctx.currentTime); // Root-level 40Hz anchor
            anchorGain.gain.setValueAtTime(0, this.ctx.currentTime);
            // Feeble but permanent physical presence
            anchorGain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 10);
            anchorOsc.connect(anchorGain);
            anchorGain.connect(this.masterGain);
            anchorOsc.start();
            this.groundingAnchor = { osc: anchorOsc, gain: anchorGain };
        }

        this.mantraGain = this.ctx.createGain();
        this.mantraGain.gain.value = 0;
        
        this.mantraFilter = this.ctx.createBiquadFilter();
        this.mantraFilter.type = 'lowpass';
        this.mantraFilter.frequency.setValueAtTime(state.audioFilters ? 2200 : 20000, this.ctx.currentTime);
        this.mantraGain.connect(this.mantraFilter);
        this.mantraFilter.connect(this.lowCutFilter);

        // Apply initial Eyes Close state
        this.toggleEyesCloseMode(state.eyesCloseMode);

        this.isInitialized = true;
        this.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
        this.setVoiceEcho(state.voiceEcho);
    }

    setVoiceTuning(warmth = 50, clarity = 50) {
        if (!this.ctx || !this.voiceWarmthFilter || !this.voiceClarityFilter) return;
        const now = this.ctx.currentTime;
        const warmthGain = ((Number(warmth) - 50) / 50) * 3;
        const clarityGain = ((Number(clarity) - 50) / 50) * 4;
        this.voiceWarmthFilter.gain.cancelScheduledValues(now);
        this.voiceWarmthFilter.gain.linearRampToValueAtTime(warmthGain, now + 0.25);
        this.voiceClarityFilter.gain.cancelScheduledValues(now);
        this.voiceClarityFilter.gain.linearRampToValueAtTime(clarityGain, now + 0.25);
    }

    setVoiceEcho(mode = 'off') {
        if (!this.ctx || !this.voiceEchoSend || !this.voiceEchoConvolver || !this.voiceEchoWetGain) return;
        const settings = {
            off: { delay: 0.04, wet: 0 },
            light: { delay: 0.035, wet: 0.14 },
            spacious: { delay: 0.07, wet: 0.20 }
        }[mode] || { delay: 0.04, wet: 0 };
        const now = this.ctx.currentTime;
        this.voiceEchoDelay.delayTime.linearRampToValueAtTime(settings.delay, now + 0.25);
        this.voiceEchoSend.gain.linearRampToValueAtTime(settings.wet > 0 ? 1 : 0, now + 0.25);
        this.voiceEchoWetGain.gain.linearRampToValueAtTime(settings.wet, now + 0.25);
    }

    toggleEyesCloseMode(enabled) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Dynamic Distortion Control: Swap curves to prevent "buzzing" from soft clipping
        if (enabled) {
            this.exciter.curve = new Float32Array([-1, 1]); // Clean
        } else {
            this.exciter.curve = this.makeDistortionCurve(0.002); // Studio Polish
        }

        // Target: Deep Smoothness. Lowered cutoff from 1200Hz to 1000Hz for "Closed" mode.
        const targetFreq = enabled ? 1000 : 20000;
        this.eyesCloseFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + 2.0);

        // Recede Instruments: Reduce BG music gain by 40% (was 30%) and tighten its dedicated LPF
        const bgSmoothGainTarget = enabled ? 0.6 : 1.0;
        const bgLPFTarget = enabled ? 600 : (state.audioFilters ? 1200 : 20000); // 600Hz removes all percussion "bite"
        
        // Anti-Buzz Notch: Widened and deepened to remove the "edge"
        const bgNotchGain = enabled ? -24 : -12; 
        this.bgMusicEQ.gain.exponentialRampToValueAtTime(Math.abs(bgNotchGain) * -1, now + 2.5);
        this.bgMusicEQ.frequency.exponentialRampToValueAtTime(3000, now + 2.5);
        // Widen the notch (lower Q) to catch a broader range of buzzy harmonics
        this.bgMusicEQ.Q.exponentialRampToValueAtTime(enabled ? 0.4 : 1.5, now + 2.0);

        // Anti-Hum smoothing: Target the 450Hz resonant "humming" frequency
        const hummingGain = enabled ? -15 : 0; // -15dB dip for the hum
        this.bgMusicHumFilter.gain.linearRampToValueAtTime(hummingGain, now + 2.5);

        this.bgMusicSmoothGain.gain.exponentialRampToValueAtTime(bgSmoothGainTarget, now + 2.5);
        this.bgMusicLPF.frequency.exponentialRampToValueAtTime(bgLPFTarget, now + 2.5);

        if (this.presenceFilter) {
            const presenceGain = enabled ? -12 : -3; // More aggressive high-shelf cut
            this.presenceFilter.gain.linearRampToValueAtTime(presenceGain, now + 2.0);
        }
    }

    toggleAudioFilters(enabled) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const presenceGain = state.eyesCloseMode ? -6 : -3;
        if (this.presenceFilter) this.presenceFilter.gain.linearRampToValueAtTime(enabled ? presenceGain : 0, now + 1.5);
        if (this.bgMusicLPF) this.bgMusicLPF.frequency.linearRampToValueAtTime(enabled ? 1200 : 20000, now + 1.5);
        if (this.reverbFilter) this.reverbFilter.frequency.linearRampToValueAtTime(enabled ? 1500 : 20000, now + 1.5);
        if (this.mantraFilter) this.mantraFilter.frequency.linearRampToValueAtTime(enabled ? 2200 : 20000, now + 1.5);
    }

    makeDistortionCurve(amount) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            // Standard Sigmoid Soft Clipping
            curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    createImpulseResponse(duration, decay) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.ctx.createBuffer(2, length, sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const envelope = Math.pow(1 - i / length, decay);
                data[i] = (Math.random() * 2 - 1) * envelope;
            }
        }
        return buffer;
    }

    createNoiseBuffer() {
        if (this._cachedNoise) return this._cachedNoise;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this._cachedNoise = buffer;
        return buffer;
    }

    startElementalLayer(index) {
        this.elementalNodes.forEach(n => {
            try { n.lfo.stop(); } catch(e) {}
            try { n.src.stop(); } catch(e) {}
        });
        this.elementalNodes = [];

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = this.createNoiseBuffer();
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.012, this.ctx.currentTime + 5); // Reduced noise floor

        const breezeLfo = this.ctx.createOscillator();
        breezeLfo.type = 'sine';
        breezeLfo.frequency.setValueAtTime(0.02 + (Math.random() * 0.02), this.ctx.currentTime); 

        const breezeGainMod = this.ctx.createGain();
        breezeGainMod.gain.setValueAtTime(0.004, this.ctx.currentTime); 
        
        const breezeFreqMod = this.ctx.createGain();
        breezeFreqMod.gain.setValueAtTime(index > 3 ? 1200 : 400, this.ctx.currentTime); 

        breezeLfo.connect(breezeGainMod);
        breezeGainMod.connect(gain.gain);
        
        breezeLfo.connect(breezeFreqMod);
        breezeFreqMod.connect(filter.frequency);
        breezeLfo.start();

        if (index === 0 || index === 1) {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(index === 0 ? 100 : 250, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.2, this.ctx.currentTime);
        } else if (index === 2 || index === 3) {
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(index === 2 ? 700 : 1200, this.ctx.currentTime);
            filter.Q.setValueAtTime(1.5, this.ctx.currentTime); 
        } else {
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(3500 + (index * 300), this.ctx.currentTime);
            filter.Q.setValueAtTime(0.4, this.ctx.currentTime);
        }

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noiseSrc.start();
        
        this.elementalNodes.push({ src: noiseSrc, gain: gain, lfo: breezeLfo });
    }

    startDrone(baseFreq, index = 0) {
        this.stopDrone();
        this.stopBinaural();
        
        this.startElementalLayer(index);

        // Grounding: If Chakra Frequencies disabled, use a neutral base of 110Hz (A2)
        const activeFreq = state.chakraFrequencies ? baseFreq : 110;

        let droneFreq = activeFreq;
        if (activeFreq > 600) droneFreq = activeFreq / 2; 
        if (activeFreq > 900) droneFreq = activeFreq / 4; 
        
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.04, this.ctx.currentTime); 
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(droneFreq * 0.001, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfo.start();
        this.vibrationLFO = lfo;

        // Drastically reduced gains (0.06 and 0.03) to make the drone "feeble"
        const harmonics = [{ f: 1.0, g: 0.06, type: 'sine' }, { f: 0.5, g: 0.03, type: 'sine' }];
        harmonics.forEach((h) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = h.type;
            osc.frequency.setValueAtTime(droneFreq * h.f, this.ctx.currentTime);
            lfoGain.connect(osc.frequency);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(droneFreq * 1.1, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.5, this.ctx.currentTime); 
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(h.g, this.ctx.currentTime + 6);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            this.droneOscillators.push({ osc, gain });
        });

        // Fixed: Lowered carrier to 80Hz for deep comfort
        const binauralCarrier = Math.min(droneFreq, 80); 

        const leftOsc = this.ctx.createOscillator();
        const rightOsc = this.ctx.createOscillator();
        const leftPanner = this.ctx.createStereoPanner();
        const rightPanner = this.ctx.createStereoPanner();
        const binauralGain = this.ctx.createGain();

        leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);
        rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);
        
        leftOsc.frequency.setValueAtTime(binauralCarrier, this.ctx.currentTime);
        // Grounding: Add 2Hz Delta pulse in Closed mode to relax forehead
        const drift = state.eyesCloseMode ? 2.0 : 0;
        rightOsc.frequency.setValueAtTime(binauralCarrier + drift, this.ctx.currentTime);
        
        binauralGain.gain.setValueAtTime(0, this.ctx.currentTime);
        // Drastically reduced volume (0.002) for a "feeble" background effect
        binauralGain.gain.linearRampToValueAtTime(0.002, this.ctx.currentTime + 10); 

        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);
        leftPanner.connect(binauralGain);
        rightPanner.connect(binauralGain);
        binauralGain.connect(this.masterGain);

        leftOsc.start();
        rightOsc.start();
        this.binauralNodes = [leftOsc, rightOsc, binauralGain];
    }

    stopBinaural() {
        const now = this.ctx.currentTime;
        this.binauralNodes.forEach(node => {
            if (node instanceof AudioParam) return;
            try { 
                if (node.gain) {
                    node.gain.cancelScheduledValues(now);
                    node.gain.setValueAtTime(node.gain.value, now);
                    node.gain.linearRampToValueAtTime(0, now + 5);
                } else {
                    node.stop(now + 5); 
                }
            } catch(e) {}
        });
        this.binauralNodes = [];
    }

    stopDrone() {
        this.stopBinaural();
        const now = this.ctx.currentTime;
        
        // Reset reverb wetness during stop to clear any active swells
        if (this.reverbWet) {
            this.reverbWet.gain.cancelScheduledValues(now);
            this.reverbWet.gain.setValueAtTime(this.reverbWet.gain.value, now);
            this.reverbWet.gain.linearRampToValueAtTime(0.3, now + 4);
        }

        if (this.vibrationLFO) {
            try { this.vibrationLFO.stop(now + 5); } catch(e) {}
            this.vibrationLFO = null;
        }
        this.droneOscillators.forEach(({ osc, gain }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentVal, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
            setTimeout(() => { try { osc.stop(); } catch(e) {} }, 5100);
        });
        this.droneOscillators = [];

        if (this.groundingAnchor) {
            const currentVal = this.groundingAnchor.gain.gain.value;
            this.groundingAnchor.gain.gain.cancelScheduledValues(now);
            this.groundingAnchor.gain.gain.setValueAtTime(currentVal, now);
            this.groundingAnchor.gain.gain.linearRampToValueAtTime(0, now + 5);
            const anchorOsc = this.groundingAnchor.osc;
            setTimeout(() => { try { anchorOsc.stop(); } catch(e) {} }, 5100);
            this.groundingAnchor = null;
        }

        this.elementalNodes.forEach(({ src, gain }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentVal, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
            setTimeout(() => { try { src.stop(); } catch(e) {} }, 5100);
        });
        this.elementalNodes = [];
    }

    async playMantraTrack(key) {
        const filePath = MANTRA_AUDIO_MAP[key];
        if (!filePath) return;

        this.stopMantraTrack();

        try {
            if (!this.mantraBuffer[key]) {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to fetch ${filePath}`);
                const arrayBuffer = await response.arrayBuffer();
                this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);
            }

            // Standardized to 3.0s crossfade
            this.mantraLoop = new SeamlessLoop(this.ctx, this.mantraBuffer[key], this.mantraGain, 0, 3.0);
            this.mantraLoop.start();

            // New: Organic Mantra Motion (LFO Presence) - Reduced for cleaner audio
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // Slower, deeper motion
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // Softer modulation
            lfo.connect(lfoGain);
            lfoGain.connect(this.mantraFilter.frequency);
            lfo.start();
            this.mantraPresenceLFO = lfo;

            const now = this.ctx.currentTime;
            this.mantraGain.gain.cancelScheduledValues(now);
            this.mantraGain.gain.setValueAtTime(0, now);
            // Ghostly 10s fade-in for maximum relaxation
            this.mantraGain.gain.linearRampToValueAtTime(state.volMantra, now + 10);
            this.mantraLoop.setGain(state.volMantra);

            if (this.masterGain) {
                this.masterGain.gain.cancelScheduledValues(now);
                this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
                // Deeper ducking (to 15%) to create a "cradle" for the voice
                this.masterGain.gain.linearRampToValueAtTime(state.volDrone * 0.15, now + 8);
            }

            // Deep spectral carving on BG music when mantra is active
            if (this.bgMusicEQ) {
                this.bgMusicEQ.gain.cancelScheduledValues(now);
                this.bgMusicEQ.gain.linearRampToValueAtTime(-12, now + 8); // Hollow out space
            }

            // Explicitly fade out any elemental noise during mantra
            this.elementalNodes.forEach(({ gain }) => {
                gain.gain.cancelScheduledValues(now);
                gain.gain.setValueAtTime(gain.gain.value, now);
                gain.gain.linearRampToValueAtTime(0, now + 5);
            });
        } catch (e) {
            // SOFT FAIL: Log error but don't crash the journey. 
            // This prevents the "Stable Connection" alert if a specific file fails.
            console.error(`Audio Load Error (${key}):`, e);
        }
    }

    stopMantraTrack() {
        if (!this.mantraLoop) return;
        const now = this.ctx.currentTime;

        if (this.mantraPresenceLFO) {
            try { this.mantraPresenceLFO.stop(); } catch(e) {}
            this.mantraPresenceLFO = null;
        }

        this.mantraGain.gain.cancelScheduledValues(now);
        this.mantraGain.gain.setValueAtTime(this.mantraGain.gain.value, now);
        this.mantraGain.gain.linearRampToValueAtTime(0, now + 8); // Gentler exit

        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(state.volDrone, now + 6);
        }

        if (this.bgMusicEQ) {
            this.bgMusicEQ.gain.cancelScheduledValues(now);
            this.bgMusicEQ.gain.linearRampToValueAtTime(0, now + 6); // Restore spectrum
        }

        // Restore elemental layer subtly after mantra
        this.elementalNodes.forEach(({ gain }) => {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.015, now + 4);
        });

        this.mantraLoop.stop(4);
        this.mantraLoop = null;
    }

    // New: Studio Reverb Swell for Transitions
    triggerReverbSwell(duration = 4) {
        const now = this.ctx.currentTime;
        this.reverbWet.gain.cancelScheduledValues(now);
        this.reverbWet.gain.setValueAtTime(this.reverbWet.gain.value, now);
        
        // Swell up to 0.8 wetness then back down
        this.reverbWet.gain.linearRampToValueAtTime(0.8, now + (duration * 0.5));
        this.reverbWet.gain.linearRampToValueAtTime(0.3, now + duration);
    }

    async startBackgroundMusic() {
        if (!this.bgMusicBuffer) {
            const response = await fetch('audio/background_music.mp3');
            const arrayBuffer = await response.arrayBuffer();
            this.bgMusicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        }
        
        if (this.bgMusicLoop) {
            this.bgMusicLoop.stop(0);
        }

        // Standardized to 3.0s crossfade
        this.bgMusicLoop = new SeamlessLoop(this.ctx, this.bgMusicBuffer, this.bgMusicGain, 1.0, 3.0);
        this.bgMusicLoop.start();
    }

    fadeInBackgroundMusic(duration = 4, isDucked = false) {
        if (!this.bgMusicLoop || !this.ctx) return;
        
        // Support for boolean (legacy) and numeric (fine-tuned) volume levels
        // Whisper Quality: Deeper ducking (0.28 vs 0.45) by default for intimacy
        let factor = 1.0;
        if (isDucked === true) factor = 0.28;
        else if (typeof isDucked === 'number') factor = isDucked;

        const targetVol = state.volMusic * factor;
        const targetEQ = factor < 1.0 ? -12 : 0; // Deeper -12dB cut clears space for voice
        
        const now = this.ctx.currentTime;
        
        // Web Audio API Tip: exponentialRampToValueAtTime cannot start from 0.
        // We anchor the current value, but if it's 0, we jump it to a tiny non-zero value.
        let startVol = this.bgMusicGain.gain.value;
        if (startVol <= 0) startVol = 0.0001;

        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(startVol, now);
        this.bgMusicGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVol), now + duration); 
        
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(targetEQ, now + duration);
        
        this.bgMusicLoop.setGain(1.0);
    }

    fadeOutBackgroundMusic(duration = 4) {
        if (!this.bgMusicLoop) return;
        const now = this.ctx.currentTime;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.cancelScheduledValues(now);

        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(0, now + duration);
    }
    stopBackgroundMusic() {
        if (this.bgMusicLoop) {
            this.bgMusicLoop.stop(2);
            this.bgMusicLoop = null;
        }
    }

    playSingingBowl() {
        const now = this.ctx.currentTime;
        const baseFreq = 180;
        const partials = [1, 2.8, 5.0, 8.1, 12.5];
        partials.forEach((ratio) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq * ratio, now);
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(baseFreq * ratio, now);
            filter.Q.setValueAtTime(50, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.exponentialRampToValueAtTime(state.volBell / partials.length, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 8);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.bellGain); // Use dedicated bell gain
            osc.start(now);
            osc.stop(now + 8.1);
        });
    }
}

// Visual Engine
class VisualEngine {
    constructor() {
        this.symbolImg = document.getElementById('chakra-symbol');
        this.glow = document.getElementById('glow-effect');
    }
    startPulsing(color) {
        if (state.eyesCloseMode) return; // Absolute Blackout
        this.glow.style.background = `radial-gradient(circle, ${color}66 0%, transparent 70%)`;
    }
    stop() {
        if (this.glow) this.glow.style.background = 'transparent';
    }
}

// Meditation Controller
class MeditationController {
    constructor(audio, visual) {
        this.audio = audio;
        this.visual = visual;
        this.scripts = null;
        this.scriptsLanguage = null;
        this.isMeditationActive = false;
        this.isStarting = false;
        this.isPaused = false;
        this.isHighEnergy = false;
        this.sessionStartedAt = null;
        this.chakraOrder = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
    }

    async pauseAwareSleep(ms) {
        let remaining = ms;
        const step = 100;
        while (remaining > 0) {
            if (!this.isMeditationActive) break;
            if (this.isPaused) {
                // Keep waiting while paused
                await new Promise(r => setTimeout(r, step));
            } else {
                remaining -= step;
                await new Promise(r => setTimeout(r, step));
            }
        }
    }

    async start() {
        if (this.isStarting || this.isMeditationActive) return;
        this.isStarting = true;
        
        // DND Reminder
        alert("Before we begin: Please ensure 'Do Not Disturb' is enabled on your device to prevent interruptions.");

        try {
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.style.opacity = "0.5";
            }

            // CRITICAL: Immediate mobile speech unlock on first user gesture
            if ('speechSynthesis' in window) {
                try {
                    const unlock = new SpeechSynthesisUtterance("");
                    unlock.volume = 0;
                    window.speechSynthesis.speak(unlock);
                } catch(e) {}
            }

            // Immediate visual feedback for mobile
            showScreen(icebreakerScreen);
            document.getElementById('completion-modal').classList.add('hidden');
            
            // Script Loading Strategy
            if (!this.scripts || this.scriptsLanguage !== state.language) {
                if (state.scriptSource === 'custom' && state.customScript) {
                    console.log("Loading Custom Script from local storage...");
                    this.scripts = state.customScript;
                } else {
                    const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                    console.log(`Loading Language Content (${state.language}): ${contentSource}...`);
                    const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                    if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                    this.scripts = await response.json();
                }
                this.scriptsLanguage = state.language;
            }

            const scriptCheck = validateScriptBundle(this.scripts, {
                highEnergy: getChecked('high-energy-toggle'),
                corpse: state.corpsePoseEnabled,
                bath: state.yogaBridgeEnabled && state.bathSessionEnabled && !state.assistedBathingEnabled,
                perinealCare: state.yogaBridgeEnabled && state.bathSessionEnabled && state.perinealCareEnabled,
                assistedBathing: state.yogaBridgeEnabled && state.bathSessionEnabled && state.assistedBathingEnabled,
                massage: state.yogaBridgeEnabled && state.bathSessionEnabled && state.massageEnabled,
                yoga: state.yogaBridgeEnabled,
                hooponopono: state.hooponopono
            });
            if (!scriptCheck.valid) {
                throw new Error(`Script is missing required sections: ${scriptCheck.missing.slice(0, 5).join(', ')}`);
            }

            await this.audio.init();
            // Start background music looping silently immediately
            await this.audio.startBackgroundMusic();

            let piperWarmup = null;
            if (isPiperVoice(state.voiceName) && piperTTS.isSupported() && piperTTS.configure(state.voiceName)) {
                // Use the existing icebreaker as the first model-loading window.
                piperWarmup = piperTTS.warmup().catch((error) => {
                    setVoiceStatus(t('ui.piperLoadFailed'), 'error');
                    return false;
                });
            }

            try { await wakeLock.request(); } catch(e) { console.warn("Wake lock failed", e); }
            
            this.isMeditationActive = true;
            this.isPaused = false;
            this.isHighEnergy = getChecked('high-energy-toggle');
            this.sessionStartedAt = Date.now();
            
            setText('pause-meditation', 'II');
            const controls = document.getElementById('controls');
            if (controls) controls.classList.remove('hidden');

            // ── ICEBREAKER PHASE (60 Second Music Fade In) ─────────────────────
            // Localize Icebreaker UI
            setText('icebreaker-title', contentT('system.arriving'));
            setText('icebreaker-subtitle', contentT('system.breatheAndSettle'));

            this.audio.fadeInBackgroundMusic(state.timeIcebreaker); 
            for (let i = state.timeIcebreaker; i > 0; i--) {
                if (!this.isMeditationActive) return;
                await this.pauseAwareSleep(1000);
                if (icebreakerTimer) icebreakerTimer.textContent = i;
            }

            if (piperWarmup) await piperWarmup;

            // Transition to Preparation
            showScreen(breathingScreen);

            if (this.isMeditationActive) await this.pauseAwareSleep(timing('transitions', 'initialSettle') * 1000);

            if (this.isMeditationActive) await this.runGratitude(this.isHighEnergy);
            if (this.isMeditationActive && !this.isHighEnergy && state.boxMeditation) await this.runBoxBreathing();
            // Immediate screen switch to meditation room for better user experience
            if (this.isMeditationActive) showScreen(meditationScreen);            
            if (this.isMeditationActive) await this.pauseAwareSleep(timing('transitions', 'postBreathing') * 1000);

            if (this.isMeditationActive) {
                if (this.isHighEnergy) {
                    await this.meditateOnChakra(this.scripts.high_energy, 'high_energy');
                    if (this.isMeditationActive) {
                        await this.handleSilence();
                        if (this.isMeditationActive) await this.runClosing();
                        // HRIM is a focused activation path; it does not add
                        // Box Breathing, Corpse Pose, or Ho'oponopono.
                        this.finish();
                    }
                } else {
                    await this.runSequence();
                }
            }
        } catch (err) {
            console.error("Critical Start Failure:", err);
            alert("App Error: " + err.message + "\n\nPlease ensure you have a stable connection and try again.");
            this.stop();
        } finally {
            this.isStarting = false;
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = "1";
            }
        }
    }

    async runGratitude(isHighEnergy = false) {
        const screen = document.getElementById('breathing-screen');
        const tutorial = document.getElementById('breathing-tutorial');
        const tutTitle = document.getElementById('tutorial-title');
        const tutText = document.getElementById('tutorial-text');

        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = "1";

        const aura = document.getElementById('aura-bg');
        aura.style.background = `radial-gradient(circle at center, #3e2723aa, transparent)`;
        aura.style.opacity = "1";

        // Moon-phase and returning sea openings belong to the reflective
        // journey. HRIM begins directly with its activation intention.
        if (!isHighEnergy) {
            const isReturningVisitor = state.returningJourney;
            const phase = getMoonPhase();
            const moonText = localized(this.scripts.intro.moon[phase]) ||
                this.scripts.intro.moon[`${phase}_${state.language}`];
            const openingText = isReturningVisitor
                ? localized(this.scripts.intro, 'returning')
                : moonText;
            if (openingText && this.isMeditationActive) {
                tutTitle.textContent = isReturningVisitor ? t('ui.returning') : t('ui.moon');
                tutText.textContent = openingText;
                await this.narrate(openingText, false); // Keep music playing
                await this.pauseAwareSleep(timing('transitions', 'openingPause') * 1000);
            }
        }

        // Main gratitude + body scan. HRIM uses its own activation-oriented
        // intention framing while the normal journey keeps the existing text.
        if (!this.isMeditationActive) return;
        tutTitle.textContent = isHighEnergy ? t('ui.intention') : t('ui.gratitude');
        const text = isHighEnergy
            ? localized(this.scripts.high_energy, 'intention')
            : localized(this.scripts.intro, 'gratitude');
        const personalIntention = state.intention && state.intention.trim();
        if (isHighEnergy) {
            const intentionText = text.replace('{{intention}}', personalIntention || defaultIntention(state.language));
            tutText.textContent = intentionText;
            await this.narrate(intentionText, false, false, 'hrim');
        } else if (personalIntention) {
            tutText.textContent = text;
            await this.narrate(text, false); // Still keep music playing for next part
            const intentionText = contentT('system.intention').replace('{{intention}}', state.intention.trim());
            tutTitle.textContent = t('ui.intention');
            tutText.textContent = intentionText;
            await this.narrate(intentionText, false); // Keep music playing seamlessly into breathing
        } else {
            tutText.textContent = text;
            await this.narrate(text, false); // No intention? Still keep music playing.
        }

        // Removed redundant pause before breathing - transition is now immediate and musical
    }

    async runBoxBreathing() {
        const screen = document.getElementById('breathing-screen');
        const tutorial = document.getElementById('breathing-tutorial');
        const instruction = document.getElementById('breathing-instruction');
        const circle = document.getElementById('breathing-circle');
        const timer = document.getElementById('breathing-timer');
        
        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = "1";

        const tutTitle = document.getElementById('tutorial-title');
        const tutText = document.getElementById('tutorial-text');
        tutTitle.textContent = t('ui.preparation');
        const text = contentT('system.centeringBreath');
        tutText.textContent = text;

        // Fade out music before box meditation
        this.audio.fadeOutBackgroundMusic(4);

        // Narrate the preparation instruction with keepSilence = true
        await this.narrate(text, false, true);

        for (let s = timing('transitions', 'breathingPreparation'); s > 0; s--) {
            if (!this.isMeditationActive) return;
            await this.pauseAwareSleep(1000);
        }
        
        tutorial.style.opacity = "0";
        await this.pauseAwareSleep(timing('transitions', 'breathingTutorialFade') * 1000);
        tutorial.classList.add('hidden');

        const steps = contentT('system.breathingSteps');

        for (let cycle = 0; cycle < 4; cycle++) {
            for (const step of steps) {
                if (!this.isMeditationActive) return;
                
                instruction.textContent = step.text;
                // Sync visual timing with configurable breathing duration
                circle.style.transition = `transform ${state.timeBreathing}s linear`;
                circle.style.transform = `scale(${step.scale})`;
                
                this.narrateSoft(step.text);

                for (let s = state.timeBreathing; s > 0; s--) {
                    if (!this.isMeditationActive) return;
                    timer.textContent = s.toString().padStart(2, '0');
                    
                    // More responsive pause: check every 100ms
                    let elapsed = 0;
                    while (elapsed < 1000) {
                        if (!this.isMeditationActive) return;
                        if (!this.isPaused) {
                            elapsed += 100;
                        }
                        await new Promise(r => setTimeout(r, 100));
                    }
                }
            }
        }

        // Intimate Completion
        if (this.isMeditationActive) {
            instruction.textContent = t('ui.breathingComplete');
            const completeText = contentT('system.breathingComplete');
            await this.narrate(completeText, false, true);
            
            // Fade music back in after box meditation
            this.audio.fadeInBackgroundMusic(4, false);

            instruction.textContent = t('ui.prepare');
            await this.pauseAwareSleep(timing('transitions', 'breathingCompletion') * 1000);
        }
    }

    async runCorpsePose() {
        try {
            if (!this.isMeditationActive) return;

            // Use the Icebreaker screen for the clean, minimal aesthetic with a large timer
            showScreen(icebreakerScreen);
            const title = document.getElementById('icebreaker-title');
            const subtitle = document.getElementById('icebreaker-subtitle');
            const timer = document.getElementById('icebreaker-timer');

            title.textContent = t('ui.corpsePose');
            subtitle.textContent = t('ui.corpsePoseSubtitle');

            // Narration: Intro to the pose
            if (!this.scripts.corpse_pose) {
                console.error("Scripts.corpse_pose is missing!", this.scripts);
                throw new Error("Missing corpse_pose scripts");
            }

            await this.narrate(localized(this.scripts.corpse_pose.intro), false);
            
            // Debug: Log volume change
            console.log("DEBUG: Transitions to Corpse Pose stillness. Reducing volume factor to 0.30");
            
            // Explicitly trigger the 30% volume level with a slow 12s fade
            this.audio.fadeInBackgroundMusic(12, 0.30);

            // Configurable Duration Countdown
            const totalSeconds = state.timeCorpse;
            const transitionSecond = timing('transitions', 'corpseTransitionAt');
            for (let i = totalSeconds; i > 0; i--) {
                if (!this.isMeditationActive) return;
                
                // More responsive pause: check every 100ms
                let elapsed = 0;
                while (elapsed < 1000) {
                    if (!this.isMeditationActive) return;
                    if (!this.isPaused) {
                        elapsed += 100;
                    }
                    await new Promise(r => setTimeout(r, 100));
                }
                
                if (timer) timer.textContent = i;

                // At 1 minute remaining, narrate the transition to hypnagogic state
                if (i === transitionSecond) {
                    await this.narrate(localized(this.scripts.corpse_pose.transition), false);
                    console.log("DEBUG: Restoring Corpse Pose stillness volume factor (0.30)");
                    this.audio.fadeInBackgroundMusic(12, 0.30);
                }

                // The loop above already accounts for one second.
            }

            // Final settle before Chakra Journey
            subtitle.textContent = t('ui.prepare');
            await this.pauseAwareSleep(timing('transitions', 'corpseFinalSettle') * 1000);
        } catch (e) {
            console.error("Error in runCorpsePose:", e);
            throw e; // Rethrow to trigger the main alert in start()
        }
    }

    async runBathStage(scriptKey, durationSeconds) {
        if (!this.isMeditationActive) return;

        showScreen(icebreakerScreen);
        const title = document.getElementById('icebreaker-title');
        const subtitle = document.getElementById('icebreaker-subtitle');
        const timer = document.getElementById('icebreaker-timer');

        const script = this.scripts[scriptKey];
        title.textContent = localized(script.title);
        subtitle.textContent = t('ui.purification');

        await this.narrate(localized(script.intro), false);
        await this.narrate(localized(script.instructions), false);

        let remaining = durationSeconds;
        const reminderSecond = 60;

        while (remaining > 0) {
            if (!this.isMeditationActive) return;
            if (!this.isPaused) {
                if (timer) timer.textContent = Math.floor(remaining / 60) + ":" + (remaining % 60).toString().padStart(2, '0');
                
                if (remaining === reminderSecond) {
                    this.narrateSoft(localized(script.reminder));
                }
                remaining--;
            }
            await this.pauseAwareSleep(1000);
        }
    }

    async runBathSession() {
        return this.runBathStage('bath_session', state.timeBath);
    }

    async runPerinealCare() {
        return this.runBathStage('perineal_care', state.timePerinealCare);
    }

    async runAssistedBathing() {
        return this.runBathStage('assisted_bathing', state.timeAssistedBathing);
    }

    async runMassage() {
        return this.runBathStage('massage', state.timeMassage);
    }

    async runBackgroundMusicOnly() {
        this.isMeditationActive = true;
        this.isPaused = false;
        showScreen(meditationScreen);
        
        // Wait for screen to switch
        await this.pauseAwareSleep(200);
        
        // Setup simple UI
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) {
            setSymbolImage("symbols/background-only.png", symbolEl);
            symbolEl.style.opacity = "0.7";
        }
        
        const mantraEl = document.getElementById('mantra-display');
        const narrationEl = document.getElementById('narration-text');
        const timerEl = document.getElementById('timer-display');

        // This is visible interface copy, so follow Display Language rather
        // than the selected meditation/narration language.
        if (mantraEl) mantraEl.textContent = t('system.musicOnly');
        if (narrationEl) narrationEl.textContent = "";
        if (timerEl) timerEl.textContent = "";
        
        // Start background music loop
        await this.audio.startBackgroundMusic();
        this.audio.fadeInBackgroundMusic(4, false);
        this.visual.startPulsing("#7c3aed"); // Standard meditation pulse
        
        // Reuse the global controls so Music Only has a visible stop/pause path.
        const controls = document.getElementById('controls');
        if (controls) controls.classList.remove('hidden');
        setText('pause-meditation', 'II');
        try { await wakeLock.request(); } catch (e) {}
        
        // Keep running until isMeditationActive is false
        while (this.isMeditationActive) {
            await this.pauseAwareSleep(1000);
        }
    }

    async runYogaSession() {
        if (!this.isMeditationActive) return;

        // Bath is an optional Yoga Bridge stage. Add-ons run in a fixed,
        // respectful order. Massage comes first, Assisted Bathing replaces
        // the standard Bath Session, and Perineal Care precedes either path.
        if (state.bathSessionEnabled) {
            if (state.massageEnabled) await this.runMassage();
            if (state.perinealCareEnabled) await this.runPerinealCare();
            if (state.assistedBathingEnabled) await this.runAssistedBathing();
            else await this.runBathSession();
        }

        // Transition Screen
        showScreen(icebreakerScreen);
        const title = document.getElementById('icebreaker-title');
        const subtitle = document.getElementById('icebreaker-subtitle');
        const timer = document.getElementById('icebreaker-timer');

        title.textContent = t('ui.yoga');
        subtitle.textContent = t('ui.yogaSubtitle');
        
        // Grounding Drone for Yoga (136.1 Hz - OM frequency)
        this.audio.startDrone(136.1, 3); // Using heart-level elemental layer for warmth
        // Keep music at 30% deep smooth level
        this.audio.fadeInBackgroundMusic(8, 0.30);

        // Intro & Preparation
        await this.narrate(localized(this.scripts.yoga.intro), false);
        await this.narrate(localized(this.scripts.yoga.preparation), false);

        // Prep Countdown
        for (let i = state.timeYogaPrep; i > 0; i--) {
            if (!this.isMeditationActive) return;
            if (timer) timer.textContent = i;
            await this.pauseAwareSleep(1000);
        }

        // Switch to main display for poses
        showScreen(meditationScreen);
        const symbolEl = document.getElementById('chakra-symbol');
        const mantraEl = document.getElementById('mantra-display');
        const narrationEl = document.getElementById('narration-text');
        const timerEl = document.getElementById('timer-display');
        
        // Aura for Yoga
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(circle at center, #FFD70022, transparent)';
        aura.style.opacity = '1';

        const yogaPoses = this.scripts.yoga.poses.filter(p => state.selectedYogaPoses.includes(p.id));

        for (const pose of yogaPoses) {
            if (!this.isMeditationActive) break;

            // Display Pose Name
            mantraEl.textContent = localized(pose, 'name');
            mantraEl.style.color = "#FFD700"; // Golden Yoga Color
            
            // Set pose-specific image
            const imageMap = {
                'balasana': 'symbols/Balasana.png',
                'ananda_balasana': 'symbols/ananda_balasana.png',
                'vrikshasana': 'symbols/Vrikshasana.png',
                'adho_mukha_svanasana': 'symbols/Downward_dog.png',
                'marjaryasana': 'symbols/Marjaryasana.png'
            };
            setSymbolImage(imageMap[pose.id] || "symbols/root.png", symbolEl);
            symbolEl.style.opacity = "0.9"; // Clearer visibility for pose instruction

            // Explain Pose
            const desc = localized(pose, 'desc');
            await this.narrate(desc, false);

            // Hold Timer
            let remaining = state.timeYogaPose;
            while (remaining > 0) {
                if (!this.isMeditationActive) break;
                if (!this.isPaused) {
                    timerEl.textContent = `${contentT('system.hold')}: ${remaining}s`;
                    remaining--;
                }
                await this.pauseAwareSleep(1000);
            }
            
            if (this.isMeditationActive) {
                this.narrateSoft(localized(this.scripts.yoga.next_pose_prompt));
                await this.pauseAwareSleep(timing('transitions', 'yogaPoseGap') * 1000);
            }
        }

        // Final Settle
        if (this.isMeditationActive) {
            await this.narrate(localized(this.scripts.yoga.session_complete), false);
            await this.pauseAwareSleep(timing('transitions', 'yogaFinalSettle') * 1000);
        }
    }

    shouldUsePiper() {
        return isPiperVoice(state.voiceName) && piperTTS.isSupported() && piperTTS.configure(state.voiceName);
    }

    async narrateWithPiper(text, fadeOut = false, keepSilence = false, volumeScale = 1, pacing = 'normal') {
        if (!text || !this.isMeditationActive && !fadeOut) return;
        if (!keepSilence) this.audio.fadeInBackgroundMusic(4, true);
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.cancelScheduledValues(this.audio.ctx.currentTime);
            this.audio.voiceCarveFilter.gain.setValueAtTime(this.audio.voiceCarveFilter.gain.value, this.audio.ctx.currentTime);
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(
                state.eyesCloseMode ? 0.75 : 1.0,
                this.audio.ctx.currentTime + 1.2
            );
        }
        const leadIn = pacing === 'hrim'
            ? timing('narration', 'hrimLeadIn', timing('narration', 'piperLeadIn'))
            : timing('narration', 'piperLeadIn');
        const sentenceGap = pacing === 'hrim'
            ? timing('narration', 'hrimSentenceGap', timing('narration', 'sentenceGap'))
            : timing('narration', 'sentenceGap');
        await this.pauseAwareSleep(leadIn * 1000);

        const sentences = String(text).split(/[.!?।]/).map(sentence => sentence.trim()).filter(Boolean);
        const pending = sentences.slice(0, 2).map(sentence => piperTTS.synthesize(sentence));
        let piperFailed = false;

        for (let i = 0; i < sentences.length; i++) {
            if (!this.isMeditationActive) break;
            while (this.isPaused && this.isMeditationActive) await new Promise(resolve => setTimeout(resolve, 100));

            setText('narration-text', sentences[i]);
            if (piperFailed) {
                await this.narrateBrowser(sentences[i], false, true, pacing);
                continue;
            }

            try {
                const blob = await pending.shift();
                if (i + 2 < sentences.length) pending.push(piperTTS.synthesize(sentences[i + 2]));
                await piperTTS.play(blob, volumeScale);
            } catch (error) {
                piperFailed = true;
                pending.forEach(job => job.catch(() => {}));
                piperTTS.cancel('sentence failed');
                setVoiceStatus(t('ui.piperFallback'), 'error');
                await this.narrateBrowser(sentences[i], false, true, pacing);
            }

            if (i < sentences.length - 1) await this.pauseAwareSleep(sentenceGap * 1000);
        }

        if (fadeOut) {
            await this.pauseAwareSleep(timing('narration', 'fadeOutPause') * 1000);
            this.audio.triggerReverbSwell(5);
            this.audio.fadeOutBackgroundMusic(4);
        }
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(0, this.audio.ctx.currentTime + timing('narration', 'fadeOutPause'));
        }
    }

    async narrateSoft(text) {
        if (this.shouldUsePiper()) {
            try { return await this.narrateWithPiper(text, false, false, 1); }
            catch (error) {
                console.error('[Piper] soft narration failed:', error);
                if (!this.isMeditationActive) return;
                setVoiceStatus(t('ui.piperFallback'), 'error');
            }
        }
        return this.narrateSoftBrowser(text);
    }

    async narrateSoftBrowser(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = getBrowserVoiceForContent();
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            
            // Warmth & Comfort: Deeper pitch and slower rate for transitions
            const baseRate = state.sleepMode ? 0.60 : 0.70;
            utterance.rate   = (state.eyesCloseMode ? baseRate * 0.88 : baseRate) * state.voicePace;
            utterance.pitch  = state.eyesCloseMode ? 0.88 : 1.02;
            utterance.volume = state.volVoice; 
            
            let isResolved = false;
            const safetyTimeout = setTimeout(() => {
                if (!isResolved) { isResolved = true; resolve(); }
            }, (text.length * timing('narration', 'browserSafetyPerCharacter')) + timing('narration', 'browserSafetyBuffer'));

            utterance.onend = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            utterance.onerror = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            window.speechSynthesis.speak(utterance);
        });
    }

    togglePause() {
        console.log("DEBUG: togglePause called. Prev state isPaused:", this.isPaused);
        this.isPaused = !this.isPaused;
        console.log("DEBUG: togglePause updated isPaused to:", this.isPaused);
        const btn = document.getElementById('pause-meditation');
        if (btn) btn.textContent = this.isPaused ? '▶' : 'II';
        
        if (this.isPaused) {
            console.log("Action: Pausing session...");
            if (window.speechSynthesis) window.speechSynthesis.cancel(); 
            piperTTS.setPaused(true);
            if (this.audio && this.audio.ctx) this.audio.ctx.suspend();
        } else {
            console.log("Action: Resuming session...");
            piperTTS.setPaused(false);
            if (this.audio && this.audio.ctx) this.audio.ctx.resume();
        }
    }

    async runSequence() {
        if (state.bgMusicMode) {
            await this.runBackgroundMusicOnly();
            return;
        }

        for (let i = 0; i < this.chakraOrder.length; i++) {
            const key = this.chakraOrder[i];
            if (!this.isMeditationActive) break;
            
            await this.meditateOnChakra(this.scripts[key], key);

            // Yoga Bridge
            const isLastChakra = (i === this.chakraOrder.length - 1);
            const nextChakraIsCrown = (!isLastChakra && this.chakraOrder[i+1] === 'crown');

            if (state.yogaBridgeEnabled && nextChakraIsCrown && this.isMeditationActive) {
                await this.runYogaSession();
            }

            if (!isLastChakra && this.isMeditationActive) await this.handleInterval();
        }
        if (this.isMeditationActive) { await this.handleSilence(); }
        if (this.isMeditationActive) { await this.runClosing(); }
        if (this.isMeditationActive && state.hooponopono) { await this.runHooponopono(); }
        if (this.isMeditationActive && state.corpsePoseEnabled) { await this.runCorpsePose(); }
        if (this.isMeditationActive) { this.finish(); }
    }

    async runClosing() {
        setText('mantra-display', "✦");
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = "0.4";
        const aura = document.getElementById('aura-bg');
        if (aura) aura.style.background = `radial-gradient(circle at center, #8B00FF22, transparent)`;
        const closingText = localized(this.scripts.closing);
        await this.narrate(closingText);
        await this.pauseAwareSleep(timing('transitions', 'closingFirstPause') * 1000);
        // Full-body health affirmation — head to toe
        const healthAffirmation = localized(this.scripts.closing, 'affirmation');
        if (healthAffirmation && this.isMeditationActive) {
            setText('mantra-display', "✦ BODY ✦");
            await this.narrate(healthAffirmation);
        }
        await this.pauseAwareSleep(timing('transitions', 'closingSecondPause') * 1000);
    }

    async runHooponopono() {
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(circle at center, #fff9c455, transparent)';
            aura.style.opacity = '1';
        }
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = '0.1';
        
        setText('mantra-display', '✦');
        setText('narration-text', '');

        // Intro: "Repeat each phrase gently in your heart" - Keep music playing
        await this.narrate(localized(this.scripts.hooponopono.intro), false);
        await this.pauseAwareSleep(timing('transitions', 'hooponoponoIntroPause') * 1000);

        // 3 cycles of the 4 phrases
        const phrases = localized(this.scripts.hooponopono.phrases);
        for (let cycle = 0; cycle < 3; cycle++) {
            if (!this.isMeditationActive) return;
            for (let i = 0; i < phrases.length; i++) {
                if (!this.isMeditationActive) return;
                const phrase = phrases[i];
                setText('narration-text', phrase);
                
                // Keep music for all phrases, fade out only on the very last phrase of the last cycle
                const isLast = (cycle === 2 && i === phrases.length - 1);
                await this.narrate(phrase, false); // Keep music for phrases
                await this.pauseAwareSleep(timing('transitions', 'hooponoponoPhrasePause') * 1000);
            }
        }

        // Closing breath - Final fade out
        setText('narration-text', '');
        await this.narrate(localized(this.scripts.hooponopono.closing), true);

        // Extended rest (15 seconds) to allow the "Divine Aura" and background music 
        // to fade out completely into a peaceful silence.
        await this.pauseAwareSleep(timing('transitions', 'hooponoponoFinalRest') * 1000);
    }

    async handleInterval() {
        this.audio.stopDrone();
        const timerEl = document.getElementById('timer-display');
        setText('mantra-display', contentT('system.breathe'));
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = "0.3";
        this.visual.stop();
        await this.pauseAwareSleep(timing('transitions', 'intervalPreparation') * 1000);
        const breatheText = contentT('system.breatheInterval');
        // Keep the minimum interval short for testing, but never advance to the
        // next chakra while the break narration is still speaking.
        const narrationPromise = this.narrateFeeble(breatheText);
        const intervalMs = state.timeInterval * 1000;
        let elapsed = 0;
        while (elapsed < intervalMs) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                const remaining = Math.max(0, intervalMs - elapsed);
                const secs = Math.ceil(remaining / 1000);
                if (timerEl) timerEl.textContent = `00:${secs.toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        await narrationPromise;
    }

    async meditateOnChakra(chakra, key) {
        if (!this.isMeditationActive) return;
        const symbolEl = document.getElementById('chakra-symbol');
        symbolEl.style.opacity = '';   // clear any inline opacity
        symbolEl.classList.remove('cosmic-entrance');
        // Force reflow to restart animation
        void symbolEl.offsetWidth;
        symbolEl.classList.add('cosmic-entrance');
        setTimeout(() => symbolEl.classList.remove('cosmic-entrance'), 1200);
        
        // Deity Image Selection
        if (key !== 'high_energy' && state.deityPath !== 'none' && this.scripts.deities && this.scripts.deities[state.deityPath] && this.scripts.deities[state.deityPath][key]) {
            setSymbolImage(this.scripts.deities[state.deityPath][key], symbolEl);
        } else {
            setSymbolImage(chakra.symbol, symbolEl);
        }

        symbolEl.style.opacity = "1";
        document.getElementById('mantra-display').textContent = chakra.mantra;
        document.getElementById('mantra-display').style.color = chakra.color;
        document.body.style.setProperty('--primary-color', chakra.color);
        document.querySelectorAll('.dot').forEach(dot => {
            if (dot.dataset.chakra === key) dot.classList.add('active');
            else if (this.chakraOrder.includes(dot.dataset.chakra) && this.chakraOrder.indexOf(dot.dataset.chakra) < this.chakraOrder.indexOf(key)) {
                dot.classList.add('completed'); dot.classList.remove('active');
            } else dot.classList.remove('active', 'completed');
        });
        const aura = document.getElementById('aura-bg');
        aura.style.background = state.eyesCloseMode ? 'transparent' : `radial-gradient(circle at center, ${chakra.color}22, transparent)`;
        aura.style.opacity = state.eyesCloseMode ? "0" : "1";
        
        // Define absolute index for correct elemental layers regardless of journey order
        const absoluteIndex = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].indexOf(key);

        this.audio.startDrone(chakra.frequency, absoluteIndex);

        if (!state.eyesCloseMode) this.visual.startPulsing(chakra.color);
        await this.narrate(localized(chakra, 'meditation') || localized(chakra));
        if (!this.isMeditationActive) return;

        // Start looping mantra audio track (fades in, drone fades down)
        await this.audio.playMantraTrack(key);

        const practiceMinutes = key === 'high_energy' ? state.timeHighEnergy : approvedChakraDurationMinutes(key);
        const chantDurationMs = Math.max(0, (practiceMinutes * 60 * 1000) - (timing('transitions', 'chakraLeadOut') * 1000));
        let elapsed = 0;
        const timerEl = document.getElementById('timer-display');

        while (elapsed < chantDurationMs) {
            if (!this.isMeditationActive) break;
            
            // Explicit pause check
            await this.pauseAwareSleep(0);

            if (!this.isPaused) {
                elapsed += 100;
                const remaining = Math.max(0, chantDurationMs - elapsed);
                const mins = Math.floor(remaining / 60000);
                const secs = Math.floor((remaining % 60000) / 1000);
                timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        timerEl.textContent = "00:00";

        // Fade out mantra, restore drone before affirmation
        this.audio.stopMantraTrack();
        await this.pauseAwareSleep(timing('transitions', 'chakraPostMantra') * 1000);

        if (this.isMeditationActive) await this.narrate(localized(chakra, 'affirmation'));
    }

    async narrateFeeble(text) {
        if (this.shouldUsePiper()) {
            try { return await this.narrateWithPiper(text, false, false, 0.9); }
            catch (error) {
                console.error('[Piper] feeble narration failed:', error);
                if (!this.isMeditationActive) return;
                setVoiceStatus(t('ui.piperFallback'), 'error');
            }
        }
        return this.narrateFeebleBrowser(text);
    }

    async narrateFeebleBrowser(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = getBrowserVoiceForContent();
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            
            // Feeble prompts: Extra slow and deep for minimal intrusion
            const baseRate = state.sleepMode ? 0.58 : 0.65;
            utterance.rate   = (state.eyesCloseMode ? baseRate * 0.85 : baseRate) * state.voicePace;
            utterance.pitch  = state.eyesCloseMode ? 0.82 : 0.95; 
            utterance.volume = state.volVoice * 0.9; // Relative to master voice volume
            
            let isResolved = false;
            const safetyTimeout = setTimeout(() => {
                if (!isResolved) { isResolved = true; resolve(); }
            }, (text.length * timing('narration', 'browserSafetyPerCharacter')) + timing('narration', 'browserSafetyBuffer'));

            utterance.onend = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            utterance.onerror = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrate(text, fadeOut = false, keepSilence = false, pacing = 'normal') {
        if (this.shouldUsePiper()) {
            try { return await this.narrateWithPiper(text, fadeOut, keepSilence, 1, pacing); }
            catch (error) {
                console.error('[Piper] narration failed:', error);
                if (!this.isMeditationActive) return;
                setVoiceStatus(t('ui.piperFallback'), 'error');
            }
        }
        return this.narrateBrowser(text, fadeOut, keepSilence, pacing);
    }

    async narrateBrowser(text, fadeOut = false, keepSilence = false, pacing = 'normal') {
        if (!window.speechSynthesis) return;

        // Cancel any queued speech to prevent buildup on mobile
        window.speechSynthesis.cancel();

        // Ensure background music is active at ducked level
        if (!keepSilence) {
            this.audio.fadeInBackgroundMusic(4, true);
        }

        // Studio Timing: 1.2 second gap gives music time to 'duck' but keeps momentum
        const leadIn = pacing === 'hrim'
            ? timing('narration', 'hrimLeadIn', timing('narration', 'piperLeadIn'))
            : timing('narration', 'piperLeadIn');
        const sentenceGap = pacing === 'hrim'
            ? timing('narration', 'hrimSentenceGap', timing('narration', 'sentenceGap'))
            : timing('narration', 'sentenceGap');
        await this.pauseAwareSleep(leadIn * 1000);

        // Activate Frequency Carving: Gentle boost for clarity, or subtle dip for warmth in Closed mode
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.cancelScheduledValues(this.audio.ctx.currentTime);
            // In Eyes Close mode, we slightly dip the frequency to remove "sharpness"
            const targetGain = state.eyesCloseMode ? -1.5 : 2; 
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(targetGain, this.audio.ctx.currentTime + 1.5);
        }

        const sentences = text.split(/[.!?।]/).filter(s => s.trim().length > 0);
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            if (!this.isMeditationActive) break;
            
            // Wait while paused
            while (this.isPaused && this.isMeditationActive) await new Promise(r => setTimeout(r, 100));

            setText('narration-text', sentence.trim());

            await new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                
                // Fallback language identification
                utterance.lang = getLanguageConfig().locale || state.language;

                const selectedVoice = getBrowserVoiceForContent();
                if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }

                // Studio Clarity: Breath-aligned pacing
                const baseRate = pacing === 'hrim'
                    ? (state.sleepMode ? 0.78 : 0.90)
                    : (state.sleepMode ? 0.60 : 0.70);
                utterance.rate   = (state.eyesCloseMode ? baseRate * 0.88 : baseRate) * state.voicePace;
                utterance.pitch  = pacing === 'hrim' ? 1.0 : (state.eyesCloseMode ? 0.88 : 1.02);
                utterance.volume = state.volVoice; 
                
                let isResolved = false;
                
                // Safety: Resolve promise immediately if pause is detected
                const pauseCheck = setInterval(() => {
                    if (this.isPaused || !this.isMeditationActive) {
                        if (!isResolved) {
                            console.log("Narrate: Pause detected, resolving promise.");
                            isResolved = true;
                            clearInterval(pauseCheck);
                            clearTimeout(safetyTimeout);
                            resolve();
                        }
                    }
                }, 100);

                const safetyTimeout = setTimeout(() => {
                    if (!isResolved) {
                        console.warn("Safety Timeout: Speech engine hung.");
                        isResolved = true;
                        clearInterval(pauseCheck);
                        resolve();
                    }
                }, (sentence.length * timing('narration', 'browserSafetyPerCharacter')) + timing('narration', 'browserSafetyBuffer'));

                utterance.onend = () => {
                    if (!isResolved) {
                        isResolved = true;
                        clearInterval(pauseCheck);
                        clearTimeout(safetyTimeout);
                        resolve();
                    }
                };
                utterance.onerror = (e) => {
                    console.error("SpeechSynthesis Error:", e);
                    if (!isResolved) {
                        isResolved = true;
                        clearInterval(pauseCheck);
                        clearTimeout(safetyTimeout);
                        resolve();
                    }
                };
                window.speechSynthesis.speak(utterance);
            });

            // If we were paused during this sentence, it was cancelled by togglePause().
            // We decrement 'i' to replay this sentence once we resume.
            if (this.isPaused && this.isMeditationActive) {
                i--;
                continue;
            }

            await this.pauseAwareSleep(sentenceGap * 1000);
        }

        // Release Frequency Carving after narration ends
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(0, this.audio.ctx.currentTime + 3);
        }

        if (fadeOut) {            // Only fade out if explicitly requested (e.g. right before mantra)
            await this.pauseAwareSleep(timing('narration', 'fadeOutPause') * 1000);
            this.audio.triggerReverbSwell(5);
            this.audio.fadeOutBackgroundMusic(4);
        }
    }

    // Subliminal whisper — plays affirmation at ~5% volume under the mantra drone
    narrateSubliminal(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = getBrowserVoiceForContent();
        if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
        utterance.rate   = state.sleepMode ? 0.45 : 0.55;
        utterance.pitch  = state.sleepMode ? 0.65 : 0.75;
        utterance.volume = state.volVoice * 0.05;
        window.speechSynthesis.speak(utterance);
    }

    async handleSilence() {
        this.visual.stop();
        setText('mantra-display', contentT('system.silence'));
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = "0.2";
        this.audio.stopDrone();
        const silenceTime = timing('transitions', 'finalSilence') * 1000;
        const timerEl = document.getElementById('timer-display');
        for (let i = Math.ceil(silenceTime / 1000); i > 0; i--) {
            if (!this.isMeditationActive) break;
            if (timerEl) timerEl.textContent = `00:${i.toString().padStart(2, '0')}`;
            await this.pauseAwareSleep(1000);
        }
    }

    finish() {
        const sessionMinutes = Math.max(1, Math.round((Date.now() - (this.sessionStartedAt || Date.now())) / 60000));
        this.isMeditationActive = false; 
        this.sessionStartedAt = null;
        this.visual.stop(); 
        this.audio.stopDrone(); 
        this.audio.stopMantraTrack(); 
        this.audio.fadeOutBackgroundMusic(12); // Long 12s final fade out
        setTimeout(() => this.audio.stopBackgroundMusic(), 13000);
        wakeLock.release();
        piperTTS.cancel('journey finished');
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        this.audio.playSingingBowl();
        state.stats.journeys += 1; state.stats.time += sessionMinutes;
        localStorage.setItem('chakra_stats_journeys', state.stats.journeys);
        localStorage.setItem('chakra_stats_time', state.stats.time);
        setText('stat-journeys', state.stats.journeys);
        setText('stat-time', state.stats.time);
        setText('stat-session-time', sessionMinutes + ' mins');
        setText('stat-total-journeys', state.stats.journeys);
        // Lift sleep mode dimming once session ends
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.opacity = "1";
        const controls = document.getElementById('controls');
        if (controls) controls.classList.add('hidden');
        const mixer = document.getElementById('volume-mixer');
        if (mixer) mixer.classList.add('hidden');

        const modal = document.getElementById('completion-modal');
        const title = document.getElementById('completion-title');
        const msg = document.getElementById('completion-message');
        const btn = document.getElementById('close-completion');
        if (title) title.textContent = t('ui.journeyComplete');
        if (msg) msg.textContent = t('ui.meditationCompleted');
        if (btn) btn.textContent = t('ui.returnToRoom');

        // Journal: reset textarea, show last entry date, localise prompt
        syncValue('journal-entry', '');
        setText('journal-prompt', t('ui.journalPrompt'));
        setText('save-journal', t('ui.saveEntry'));
        const journalEntries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        const lastInfo = document.getElementById('last-journal-info');
        lastInfo.textContent = journalEntries.length > 0
            ? t('ui.lastEntry') + journalEntries[0].date
            : '';

        modal.classList.remove('hidden');

        // DND Reminder
        setTimeout(() => {
            alert("Meditation complete. You can now turn off 'Do Not Disturb' if you wish.");
        }, 500);
    }

    stop() {
        this.isMeditationActive = false; this.audio.stopDrone(); this.audio.stopMantraTrack(); this.audio.stopBackgroundMusic(); this.visual.stop(); wakeLock.release();
        this.sessionStartedAt = null;
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
        }
        window.speechSynthesis.cancel();
        piperTTS.cancel('journey stopped');
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.opacity = "1";
        const finishAura = document.getElementById('aura-bg');
        if (finishAura) finishAura.style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        const controls = document.getElementById('controls');
        if (controls) controls.classList.add('hidden');
        const mixer = document.getElementById('volume-mixer');
        if (mixer) mixer.classList.add('hidden');
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
            aura.style.opacity = '1';
        }
        showScreen(lobbyScreen);
    }
}

// Wake Lock Manager
class WakeLockManager {
    constructor() { this.wakeLock = null; }
    async request() {
        if ('wakeLock' in navigator) {
            try { this.wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
        }
    }
    release() { if (this.wakeLock !== null) { this.wakeLock.release(); this.wakeLock = null; } }
}

const wakeLock = new WakeLockManager();
const audio = new AudioEngine();
const visual = new VisualEngine();
const piperTTS = new PiperTTS(audio);
const meditation = new MeditationController(audio, visual);

function storedNumber(key, fallback) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
}

document.addEventListener('visibilitychange', async () => {
    if (wakeLock.wakeLock !== null && document.visibilityState === 'visible') await wakeLock.request();
});

const state = {
    language: localStorage.getItem('chakra_lang') || 'ml',
    // Content/narration language and visible interface language are separate
    // so a facilitator can guide in one language while reading the UI in
    // another. English is the safe default for the visible interface.
    displayLanguage: localStorage.getItem('chakra_display_language') || 'en',
    voiceName: localStorage.getItem('chakra_voice') || 'piper:ml_IN-arjun-medium',
    timePerChakra: parseFloat(localStorage.getItem('chakra_time')) || 5.0,
    timeHighEnergy: parseFloat(localStorage.getItem('chakra_time_high_energy')) || 5.0,
    voices: [],
    volVoice: storedNumber('chakra_vol_voice', 0.9),
    volDrone: storedNumber('chakra_vol_drone', 0.05),
    volBell: storedNumber('chakra_vol_bell', 0.05),
    volMantra: storedNumber('chakra_vol_mantra', 0.35),
    volMusic: storedNumber('chakra_vol_music', 0.20),
    voiceClarity: parseFloat(localStorage.getItem('chakra_voice_clarity')) || 50,
    voiceWarmth: parseFloat(localStorage.getItem('chakra_voice_warmth')) || 50,
    voicePace: parseFloat(localStorage.getItem('chakra_voice_pace')) || 1,
    voiceEcho: localStorage.getItem('chakra_voice_echo') || 'light',
    stats: {
        journeys: parseInt(localStorage.getItem('chakra_stats_journeys')) || 0,
        time: parseInt(localStorage.getItem('chakra_stats_time')) || 0
    },
    selectedChakras: JSON.parse(localStorage.getItem('chakra_selected')) || ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'],
    intention: localStorage.getItem('chakra_intention') || '',
    sleepMode: localStorage.getItem('chakra_sleep_mode') === 'true',
    // This preference controls the opening style; stats.journeys remains the
    // historical count of completed journeys.
    returningJourney: (() => {
        const saved = localStorage.getItem('chakra_returning_journey');
        if (saved !== null) return saved === 'true';
        return (parseInt(localStorage.getItem('chakra_stats_journeys')) || 0) > 0;
    })(),
    audioFilters: localStorage.getItem('chakra_audio_filters') === 'true',
    reverseJourney: localStorage.getItem('chakra_reverse_journey') === 'true',
    boxMeditation: localStorage.getItem('chakra_box_meditation') === 'true',
    hooponopono: localStorage.getItem('chakra_hooponopono') === 'true',
    chakraFrequencies: (() => {
        const saved = localStorage.getItem('chakra_frequencies');
        return saved === null ? true : saved === 'true';
    })(),
    deityPath: localStorage.getItem('chakra_deity_path') || 'none',
    bgMusicMode: localStorage.getItem('chakra_bg_music_mode') === 'true',
    highEnergyEnabled: localStorage.getItem('chakra_high_energy') === 'true',
    eyesCloseMode: localStorage.getItem('chakra_eyes_close_mode') === 'true',
    corpsePoseEnabled: localStorage.getItem('chakra_corpse_enabled') === 'true',
    brightness: parseFloat(localStorage.getItem('chakra_brightness')) || 1.0,
    yogaBridgeEnabled: localStorage.getItem('chakra_yoga_bridge') === 'true',
    // Bath is a child stage of Yoga Bridge and cannot be active by itself.
    bathSessionEnabled: localStorage.getItem('chakra_yoga_bridge') === 'true' &&
        localStorage.getItem('chakra_bath_enabled') === 'true',
    perinealCareEnabled: localStorage.getItem('chakra_yoga_bridge') === 'true' &&
        localStorage.getItem('chakra_bath_enabled') === 'true' &&
        localStorage.getItem('chakra_perineal_care') === 'true',
    assistedBathingEnabled: localStorage.getItem('chakra_yoga_bridge') === 'true' &&
        localStorage.getItem('chakra_bath_enabled') === 'true' &&
        localStorage.getItem('chakra_assisted_bathing') === 'true',
    massageEnabled: localStorage.getItem('chakra_yoga_bridge') === 'true' &&
        localStorage.getItem('chakra_bath_enabled') === 'true' &&
        localStorage.getItem('chakra_massage') === 'true',
    selectedYogaPoses: JSON.parse(localStorage.getItem('chakra_yoga_selected')) || ['vrikshasana', 'adho_mukha_svanasana', 'marjaryasana', 'balasana', 'ananda_balasana'],
    // Journey Timings (in seconds)
    timeIcebreaker: parseInt(localStorage.getItem('chakra_time_icebreaker')) || 60,
    timeBreathing: parseInt(localStorage.getItem('chakra_time_breathing')) || 8,
    timeCorpse: parseInt(localStorage.getItem('chakra_time_corpse')) || 300,
    timeInterval: parseInt(localStorage.getItem('chakra_time_interval')) || 10,
    timeYogaPrep: parseInt(localStorage.getItem('chakra_time_yoga_prep')) || 60,
    timeYogaPose: parseInt(localStorage.getItem('chakra_time_yoga_pose')) || 60,
    timeBath: parseInt(localStorage.getItem('chakra_time_bath')) || 600,
    timePerinealCare: parseInt(localStorage.getItem('chakra_time_perineal_care')) || 300,
    timeAssistedBathing: parseInt(localStorage.getItem('chakra_time_assisted_bathing')) || 600,
    timeMassage: parseInt(localStorage.getItem('chakra_time_massage')) || 600,
    scriptSource: localStorage.getItem('chakra_script_source') || 'default',
    customScript: JSON.parse(localStorage.getItem('chakra_custom_script')) || null
};

// ── Moon Phase Calculator ─────────────────────────────────────────────────────
function getMoonPhase() {
    const knownNewMoon = new Date('2025-01-29T12:35:00Z');
    const lunarCycle  = 29.53058770576;
    const daysSince   = (Date.now() - knownNewMoon.getTime()) / 86400000;
    const pos         = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;
    if (pos < 7.38)  return 'new';
    if (pos < 14.77) return 'waxing';
    if (pos < 22.15) return 'full';
    return 'waning';
}

async function loadPiperVoiceRegistry() {
    try {
        const response = await fetch('piper-models.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        piperVoiceRegistry = Array.isArray(json.voices) ? json.voices : [];
    } catch (error) {
        console.warn('Piper voice registry unavailable; browser voices remain available.', error);
        piperVoiceRegistry = [];
    }
}

async function init() {
    await loadTimingConfig();
    await loadLanguageManifest();
    await loadPiperVoiceRegistry();
    setupVoices();
    loadPreferences();
    attachEventListeners();
    checkFirstTime();
    registerServiceWorker();

    // Hide splash screen after a delay for visual impact
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.classList.add('hidden');
    }, 2500);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => console.error(err));
        });
    }
}

function setupVoices() {
    const updateUI = (availableVoices = []) => {
        state.voices = availableVoices;
        const currentVal = state.voiceName || voiceSelect.value;
        voiceSelect.innerHTML = '';

        const piperVoices = piperVoiceRegistry.filter(voice => voice.language === state.language);
        piperVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = `piper:${voice.id}`;
            option.textContent = `${voice.label} · local`;
            voiceSelect.appendChild(option);
        });

        const browserGroup = document.createElement('optgroup');
        browserGroup.label = 'Browser fallback voices';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = 'browser:Default';
        defaultOpt.textContent = 'System Default Voice';
        browserGroup.appendChild(defaultOpt);
        availableVoices.filter(voice => voiceMatchesLanguage(voice)).forEach(voice => {
            const option = document.createElement('option');
            option.value = `browser:${voice.name}`;
            option.textContent = `${voice.name} (${voice.lang})`;
            browserGroup.appendChild(option);
        });
        voiceSelect.appendChild(browserGroup);

        const currentExists = Array.from(voiceSelect.options).some(option => option.value === currentVal);
        if (currentExists) voiceSelect.value = currentVal;
        else autoSelectVoice();
    };

    updateUI('speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => updateUI(window.speechSynthesis.getVoices());
        try {
            const dummy = new SpeechSynthesisUtterance('');
            dummy.volume = 0;
            window.speechSynthesis.speak(dummy);
        } catch (error) {}
    }
}

function autoSelectVoice() {
    const currentPiper = piperVoiceRegistry.find(voice =>
        isPiperVoice(state.voiceName) && piperVoiceId(state.voiceName) === voice.id && voice.language === state.language);
    if (currentPiper) {
        voiceSelect.value = state.voiceName;
        return;
    }
    const preferredVoiceId = getLanguageConfig().defaultPiperVoice;
    const defaultPiper = piperVoiceRegistry.find(voice =>
        voice.language === state.language && voice.id === preferredVoiceId
    ) || piperVoiceRegistry.find(voice => voice.language === state.language);
    if (defaultPiper) {
        state.voiceName = `piper:${defaultPiper.id}`;
        voiceSelect.value = state.voiceName;
        return;
    }
    if (!state.voices || state.voices.length === 0) {
        state.voiceName = 'browser:Default';
        if (voiceSelect) voiceSelect.value = state.voiceName;
        return;
    }
    
    let bestVoice = null;
    const premiumKeywords = ['premium', 'neural', 'natural', 'enhanced'];
    
    const findBestInList = (list) => {
        // First try premium voices
        let premium = list.find(v => premiumKeywords.some(kw => v.name.toLowerCase().includes(kw)));
        if (premium) return premium;
        // Then return the first in the list
        return list[0];
    };

    bestVoice = findBestInList(state.voices.filter(voice => voiceMatchesLanguage(voice)));
    
    if (bestVoice) {
        state.voiceName = `browser:${bestVoice.name}`;
        voiceSelect.value = state.voiceName;
    }
}

function applyJourneyVoiceProfile(isHighEnergy) {
    const profile = isHighEnergy
        ? { clarity: 50, warmth: 50, pace: 1, echo: 'light' }
        : { clarity: 35, warmth: 65, pace: 0.9, echo: 'spacious' };

    state.voiceClarity = profile.clarity;
    state.voiceWarmth = profile.warmth;
    state.voicePace = profile.pace;
    state.voiceEcho = profile.echo;
    localStorage.setItem('chakra_voice_clarity', state.voiceClarity);
    localStorage.setItem('chakra_voice_warmth', state.voiceWarmth);
    localStorage.setItem('chakra_voice_pace', state.voicePace);
    localStorage.setItem('chakra_voice_echo', state.voiceEcho);
    syncValue('voice-clarity', state.voiceClarity);
    syncValue('voice-warmth', state.voiceWarmth);
    syncValue('voice-pace', state.voicePace);
    syncValue('voice-echo', state.voiceEcho);
    document.querySelectorAll('[data-voice-preset]').forEach(button => {
        button.classList.toggle('mixer-preset-active', button.dataset.voicePreset === (isHighEnergy ? 'balanced' : 'soft'));
    });
    if (audio.setVoiceTuning) audio.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
    if (audio.setVoiceEcho) audio.setVoiceEcho(state.voiceEcho);
}

async function testVoice() {
    const selectedValue = voiceSelect.value || state.voiceName;
    state.voiceName = selectedValue;
    if (isPiperVoice(selectedValue)) {
        try {
            if (!audio.isInitialized) await audio.init();
            piperTTS.configure(selectedValue);
            const sample = getLanguageConfig().preview || contentT('system.centeringBreath');
            await piperTTS.preview(sample);
        } catch (error) {
            console.error('[Piper] preview failed:', error);
            setVoiceStatus(t('ui.piperPreviewFailed'), 'error');
        }
        return;
    }
    const utterance = new SpeechSynthesisUtterance(getLanguageConfig().preview || contentT('system.centeringBreath'));
    const selectedVoice = getBrowserVoiceForContent();
    if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
    
    // Test with new warm settings
    utterance.rate = 0.65 * state.voicePace;
    utterance.pitch = 0.88;
    utterance.volume = state.volVoice;
    
    if ('speechSynthesis' in window) window.speechSynthesis.speak(utterance);
}

function loadPreferences() {
    syncValue('language-select', state.language);
    syncValue('display-language-select', state.displayLanguage);
    
    const timeSlider = document.getElementById('time-per-chakra');
    if (timeSlider) {
        timeSlider.value = state.timePerChakra;
        const pctInit = ((timeSlider.value - timeSlider.min) / (timeSlider.max - timeSlider.min) * 100).toFixed(1) + '%';
        timeSlider.style.setProperty('--range-fill', pctInit);
    }
    
    setText('time-display', `${state.timePerChakra.toFixed(1)} mins`);

    const highEnergyTimeSlider = document.getElementById('time-high-energy');
    if (highEnergyTimeSlider) {
        highEnergyTimeSlider.value = state.timeHighEnergy;
        const pctHigh = ((highEnergyTimeSlider.value - highEnergyTimeSlider.min) / (highEnergyTimeSlider.max - highEnergyTimeSlider.min) * 100).toFixed(1) + '%';
        highEnergyTimeSlider.style.setProperty('--range-fill', pctHigh);
    }
    setText('high-energy-time-display', `${state.timeHighEnergy} mins`);
    
    // Sync Mixer Sliders
    syncValue('vol-voice', state.volVoice);
    syncValue('vol-drone', state.volDrone);
    syncValue('vol-bell', state.volBell);
    syncValue('vol-mantra', state.volMantra);
    syncValue('vol-music', state.volMusic);
    syncValue('voice-clarity', state.voiceClarity);
    syncValue('voice-warmth', state.voiceWarmth);
    syncValue('voice-pace', state.voicePace);
    syncValue('voice-echo', state.voiceEcho);

    // Sync Settings Sliders
    syncValue('settings-vol-voice', state.volVoice);
    syncValue('settings-vol-drone', state.volDrone);
    syncValue('settings-vol-bell', state.volBell);
    syncValue('settings-vol-mantra', state.volMantra);
    syncValue('settings-vol-music', state.volMusic);

    setText('stat-journeys', state.stats.journeys);
    setText('stat-time', state.stats.time);
    document.querySelectorAll('#chakra-selection input').forEach(cb => {
        cb.checked = state.selectedChakras.includes(cb.value);
    });
    if (!state.intention.trim()) state.intention = defaultIntention();
    syncValue('intention-input', state.intention);
    
    syncChecked('returning-journey-toggle', state.returningJourney);
    syncChecked('audio-filters-toggle', state.audioFilters);
    syncChecked('mixer-frequencies-toggle', state.chakraFrequencies);
    syncChecked('reverse-journey-toggle', state.reverseJourney);
    syncChecked('box-meditation-toggle', state.boxMeditation);
    syncChecked('hooponopono-toggle', state.hooponopono);
    syncChecked('frequencies-toggle', state.chakraFrequencies);
    syncChecked('eyes-close-mode-toggle', state.eyesCloseMode);
    syncChecked('music-only-toggle', state.bgMusicMode);
    syncChecked('high-energy-toggle', state.highEnergyEnabled);
    syncChecked('corpse-pose-toggle', state.corpsePoseEnabled);
    if (state.eyesCloseMode) document.body.classList.add('eyes-close-mode');

    // Sync Yoga Settings
    syncChecked('yoga-bridge-toggle', state.yogaBridgeEnabled);
    syncChecked('bath-session-toggle', state.bathSessionEnabled);
    syncChecked('perineal-care-toggle', state.perinealCareEnabled);
    syncChecked('assisted-bathing-toggle', state.assistedBathingEnabled);
    syncChecked('massage-toggle', state.massageEnabled);
    const yogaSubOptions = document.getElementById('yoga-sub-options');
    if (yogaSubOptions) {
        yogaSubOptions.style.display = state.yogaBridgeEnabled ? 'flex' : 'none';
    }

    const deityRadios = document.getElementsByName('deity-path');
    setTimeout(() => {
        deityRadios.forEach(r => {
            r.checked = (r.value === state.deityPath);
        });
    }, 0);

    // Sync Journey Timings Sliders
    syncValue('time-icebreaker', state.timeIcebreaker);
    setText('display-icebreaker', state.timeIcebreaker + 's');
    
    syncValue('time-breathing', state.timeBreathing);
    setText('display-breathing', state.timeBreathing + 's');
    
    syncValue('time-corpse', state.timeCorpse);
    setText('display-corpse', state.timeCorpse + 's');
    
    syncValue('time-interval', state.timeInterval);
    setText('display-interval', state.timeInterval + 's');

    syncValue('time-yoga-prep', state.timeYogaPrep);
    setText('display-yoga-prep', state.timeYogaPrep + 's');

    syncValue('time-yoga-pose', state.timeYogaPose);
    setText('display-yoga-pose', state.timeYogaPose + 's');

    syncValue('time-bath', state.timeBath);
    setText('display-bath', Math.floor(state.timeBath / 60) + 'm');
    syncValue('time-perineal-care', state.timePerinealCare);
    setText('display-perineal-care', Math.floor(state.timePerinealCare / 60) + 'm');
    syncValue('time-assisted-bathing', state.timeAssistedBathing);
    setText('display-assisted-bathing', Math.floor(state.timeAssistedBathing / 60) + 'm');
    syncValue('time-massage', state.timeMassage);
    setText('display-massage', Math.floor(state.timeMassage / 60) + 'm');
    
    syncValue('brightness-slider', state.brightness);
    document.getElementById('app').style.opacity = state.brightness;

    // Sync Script Selection
    syncValue('script-source-select', state.scriptSource);
    const customScriptUI = document.getElementById('custom-script-ui');
    if (customScriptUI) {
        customScriptUI.style.display = state.scriptSource === 'custom' ? 'flex' : 'none';
    }
    if (state.customScript) {
        const statusEl = document.getElementById('script-status');
        if (statusEl) {
            statusEl.textContent = "Custom script loaded and ready.";
            statusEl.style.display = 'block';
            statusEl.style.color = '#4ade80';
        }
    }

    refreshRangeControlDisplays();
    
    // Ensure voice matches the loaded language
    autoSelectVoice();
}

function checkFirstTime() {
    if (localStorage.getItem('chakra_configured')) {
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
            aura.style.opacity = '1';
        }
    } else {
        showScreen(configScreen);
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)';
            aura.style.opacity = '1';
        }
    }
}

function showScreen(screen) {
    [configScreen, lobbyScreen, consultationScreen, consultationReviewScreen, consultationConsentScreen, meditationScreen, breathingScreen, icebreakerScreen].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    if (screen) screen.classList.remove('hidden');
}

let consultationRecorder = null;
let consultationRecordingStream = null;
let consultationRecordingChunks = [];
let consultationRecordingBlob = null;
let consultationCountdownTimer = null;
let consultationCountdownResolve = null;
let consultationCompositeFrame = null;
let consultationCameraPreview = null;
let consultationRecordingStartedAt = null;
let consultationRecordingEndedAt = null;
let consultationRecordingStartTick = 0;
let consultationRecordingPausedAt = 0;
let consultationRecordingPausedDuration = 0;
let consultationLocation = null;
let consultationConsentOpenedAt = null;
let consultationPlanPages = [];
let consultationVideoPlan = null;
let consultationCompositePhase = 'idle';
let consultationPlanPageIndex = 0;
let consultationAudioContext = null;
let consultationAudioGain = null;
let consultationStopTimer = null;
let consultationConsentLogo = null;
let consultationConsentLogoPromise = null;
let consultationPreviewStream = null;
let consentPromptScrollFrame = null;
let consentPromptScrollLastTime = null;
let consentPromptLeadTimer = null;
let consentPromptLeadStartedAt = 0;
let consentPromptLeadRemaining = 0;
let consentScrollSpeed = 14;
let consultationRecordingAttempt = 0;
let consultationAwaitingConsentStart = false;

function consentTiming(name, fallback) {
    const testValue = globalThis.__chakraConsentTestTimings?.[name];
    return Number.isFinite(Number(testValue)) ? Math.max(0, Number(testValue)) : fallback;
}

function waitForConsentAttempt(milliseconds, attemptId) {
    return new Promise(resolve => {
        consultationCountdownResolve = resolve;
        consultationCountdownTimer = setTimeout(() => {
            consultationCountdownTimer = null;
            consultationCountdownResolve = null;
            resolve(attemptId === consultationRecordingAttempt);
        }, milliseconds);
    });
}

function loadConsentLogo() {
    if (consultationConsentLogo?.complete && consultationConsentLogo.naturalWidth > 0) {
        return Promise.resolve(consultationConsentLogo);
    }
    if (consultationConsentLogoPromise) return consultationConsentLogoPromise;
    consultationConsentLogoPromise = new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
            consultationConsentLogo = image;
            resolve(image);
        };
        image.onerror = () => resolve(null);
        image.src = new URL('symbols/logo_453x453.png', document.baseURI).href;
    });
    return consultationConsentLogoPromise;
}

async function prepareConsentCameraPreview() {
    const video = document.getElementById('consent-live-preview');
    if (!video || !navigator.mediaDevices?.getUserMedia || consultationPreviewStream) return;
    try {
        consultationPreviewStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        video.srcObject = consultationPreviewStream;
        await video.play();
        video.classList.add('is-ready');
    } catch (error) {
        video.classList.remove('is-ready');
        console.info('[Consultation] live camera preview unavailable:', error?.name || error);
    }
}

function stopConsentCameraPreview() {
    consultationPreviewStream?.getTracks().forEach(track => track.stop());
    consultationPreviewStream = null;
    const video = document.getElementById('consent-live-preview');
    if (video) {
        video.pause();
        video.srcObject = null;
        video.classList.remove('is-ready');
    }
}

function stopConsentPromptAutoScroll(reset = false) {
    if (consentPromptScrollFrame) clearInterval(consentPromptScrollFrame);
    consentPromptScrollFrame = null;
    consentPromptScrollLastTime = null;
    const prompter = document.querySelector('#consultation-consent-screen .consent-prompter');
    if (reset && prompter) prompter.scrollTop = 0;
}

function stopConsentPromptLead(preserveRemaining = false) {
    if (!consentPromptLeadTimer) return;
    clearTimeout(consentPromptLeadTimer);
    consentPromptLeadTimer = null;
    if (preserveRemaining && consentPromptLeadStartedAt) {
        consentPromptLeadRemaining = Math.max(0, consentPromptLeadRemaining - (performance.now() - consentPromptLeadStartedAt));
    }
    consentPromptLeadStartedAt = 0;
}

function startConsentPromptWithLead(reset = false) {
    if (reset) consentPromptLeadRemaining = consentTiming('readingLeadMs', 7000);
    stopConsentPromptLead();
    if (consentPromptLeadRemaining <= 0) {
        startConsentPromptAutoScroll(reset);
        setConsentRecordingState('recording');
        return;
    }
    if (reset) stopConsentPromptAutoScroll(true);
    consentPromptLeadStartedAt = performance.now();
    consentPromptLeadTimer = setTimeout(() => {
        consentPromptLeadTimer = null;
        consentPromptLeadStartedAt = 0;
        consentPromptLeadRemaining = 0;
        if (consultationRecorder?.state === 'recording') {
            startConsentPromptAutoScroll();
            setConsentRecordingState('recording');
        }
    }, consentPromptLeadRemaining);
    setConsentRecordingState('lead');
}

function showConsentReviewStage() {
    const reviewStage = document.getElementById('consent-review-stage');
    const recordStage = document.getElementById('consent-record-stage');
    const previewStage = document.getElementById('consent-preview-stage');
    const prompter = document.querySelector('#consultation-consent-screen .consent-prompter');
    const reviewLiveStage = document.querySelector('#consent-review-stage .consent-live-stage');
    if (prompter && reviewLiveStage && !reviewStage.contains(prompter)) reviewLiveStage.after(prompter);
    reviewStage?.classList.remove('hidden');
    recordStage?.classList.add('hidden');
    previewStage?.classList.add('hidden');
    consultationConsentScreen?.classList.remove('consent-recording-active', 'consent-teleprompter-mode', 'consent-preview-mode');
    stopConsentPromptAutoScroll(true);
}

function enterConsentTeleprompter() {
    const reviewStage = document.getElementById('consent-review-stage');
    const recordStage = document.getElementById('consent-record-stage');
    const previewStage = document.getElementById('consent-preview-stage');
    const prompter = document.querySelector('#consultation-consent-screen .consent-prompter');
    const copySlot = document.getElementById('teleprompter-copy-slot');
    const camera = document.getElementById('consent-live-preview');
    const cameraLayer = document.querySelector('.teleprompter-camera-layer');
    if (prompter && copySlot) copySlot.append(prompter);
    if (camera && cameraLayer) cameraLayer.append(camera);
    reviewStage?.classList.add('hidden');
    recordStage?.classList.remove('hidden');
    previewStage?.classList.add('hidden');
    consultationConsentScreen?.classList.remove('consent-preview-mode');
    consultationConsentScreen?.classList.add('consent-teleprompter-mode');
    setConsentRecordingState('ready');
    prepareConsentCameraPreview();
}

function showConsentPreviewStage() {
    document.getElementById('consent-review-stage')?.classList.add('hidden');
    document.getElementById('consent-record-stage')?.classList.add('hidden');
    document.getElementById('consent-preview-stage')?.classList.remove('hidden');
    document.getElementById('consent-video-preview')?.classList.remove('hidden');
    consultationConsentScreen?.classList.remove('consent-recording-active', 'consent-teleprompter-mode');
    consultationConsentScreen?.classList.add('consent-preview-mode');
    document.getElementById('consent-retry')?.classList.remove('hidden');
    document.getElementById('consent-submit')?.classList.remove('hidden');
    const planCount = document.getElementById('consent-preview-plan-count');
    if (planCount) planCount.textContent = t('ui.consentPlanPageCount').replace('{count}', String(consultationPlanPages.length));
}

function updateConsentScrollSpeed() {
    const input = document.getElementById('consent-scroll-speed');
    const output = document.getElementById('consent-scroll-speed-value');
    consentScrollSpeed = Number(input?.value) || 14;
    if (output) {
        output.textContent = consentScrollSpeed <= 11
            ? t('ui.consentSpeedSlow')
            : consentScrollSpeed >= 20
                ? t('ui.consentSpeedFast')
                : t('ui.consentSpeedComfortable');
    }
}

function startConsentPromptAutoScroll(reset = false) {
    const prompter = document.querySelector('#consultation-consent-screen .consent-prompter');
    if (!prompter) return;
    if (reset) prompter.scrollTop = 0;
    stopConsentPromptAutoScroll();
    consentPromptScrollLastTime = performance.now();
    const step = () => {
        const maxScroll = Math.max(0, prompter.scrollHeight - prompter.clientHeight);
        if (prompter.scrollTop >= maxScroll - 1) {
            clearInterval(consentPromptScrollFrame);
            consentPromptScrollFrame = null;
            consentPromptScrollLastTime = null;
            const status = document.getElementById('consent-recording-status');
            if (status && consultationRecorder?.state === 'recording') status.textContent = t('ui.consentScriptComplete');
            return;
        }
        const now = performance.now();
        const elapsedSeconds = Math.min(0.15, Math.max(0, now - consentPromptScrollLastTime) / 1000);
        prompter.scrollTop = Math.min(maxScroll, prompter.scrollTop + consentScrollSpeed * elapsedSeconds);
        consentPromptScrollLastTime = now;
    };
    consentPromptScrollFrame = setInterval(step, 50);
}

function formatConsentDateTime(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat([], {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(value);
}

function formatConsentElapsed(milliseconds) {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
}

function getConsentRecordingElapsed() {
    if (!consultationRecordingStartTick) return 0;
    const endTick = consultationRecordingPausedAt || performance.now();
    return Math.max(0, endTick - consultationRecordingStartTick - consultationRecordingPausedDuration);
}

function formatConsentClock(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(value);
}

function getConsentLiveDate() {
    if (consultationRecordingEndedAt) return consultationRecordingEndedAt;
    if (!consultationRecordingStartedAt || !consultationRecordingStartTick) return null;
    return new Date(consultationRecordingStartedAt.getTime() + (performance.now() - consultationRecordingStartTick));
}

function updateConsentMetadataDisplay() {
    const metadata = document.getElementById('consent-recording-metadata');
    if (!metadata) return;
    const locationText = consultationLocation
        ? consultationLocation.latitude + ', ' + consultationLocation.longitude
        : 'unavailable';
    metadata.textContent = 'Start: ' + formatConsentDateTime(consultationRecordingStartedAt)
        + ' · Live time: ' + formatConsentClock(getConsentLiveDate())
        + ' · Location: ' + locationText;
}

function getConsentPlanPages(sessionPlan) {
    const preferences = sessionPlan?.preferences || {};
    const durations = sessionPlan?.durations || {};
    const chakraLabelKeys = { root: 'root', sacral: 'sacral', solar: 'solar', heart: 'heart', throat: 'throat', thirdeye: 'thirdEye', crown: 'crown' };
    const focus = (sessionPlan?.chakraFocus || []).map(key => t(`ui.${chakraLabelKeys[key] || key}`)).join(', ') || t('ui.consultationEvenJourney');
    const yesNo = value => t(value ? 'ui.consultationYes' : 'ui.consultationNo');
    const minutes = value => `${Math.round((Number(value) || 0) / 60)} min`;
    const groups = [
        {
            heading: t('ui.consentPlanOverview'),
            rows: [
                [t('ui.consultationSummaryName'), sessionPlan?.profile?.name || t('ui.client')],
                [t('ui.consultationSummaryGoal'), sessionPlan?.goal || t('ui.sessionGoal')],
                [t('ui.consultationSummaryFocus'), focus],
                [t('ui.consultationSummaryLanguage'), sessionPlan?.language || state.language]
            ]
        },
        {
            heading: t('ui.consultationSummaryPlanDetails'),
            rows: [
                [t('ui.consentPlanServices'), getConsentServiceSummary(sessionPlan)],
                [t('ui.consultationSummaryVoice'), preferences.voiceGender || 'guide'],
                [t('ui.consultationSummaryTone'), preferences.tone || t('ui.consultationNone')],
                [t('ui.consultationSummaryTouch'), preferences.touch || sessionPlan?.safety?.touch || t('ui.consultationNone')],
                [t('ui.consultationSummarySleep'), preferences.sleepMode || t('ui.consultationNone')],
                [t('ui.consultationSummaryReverseJourney'), yesNo(Boolean(sessionPlan?.approvedSettings?.reverseJourney))]
            ]
        },
        {
            heading: t('ui.consentPlanTiming'),
            rows: [
                ...(preferences.yogaBridgeEnabled ? [
                    [t('ui.consultationSummaryYogaPoses'), preferences.selectedYogaPoses?.join(', ') || t('ui.consultationNone')],
                    [t('ui.consultationSummaryYogaTiming'), `${minutes(durations.yogaPrep)} prep · ${minutes(durations.yogaPose)} per pose`]
                ] : []),
                ...(preferences.bathSessionEnabled ? [[t('ui.consultationSummaryCareTiming'), [
                    preferences.assistedBathingEnabled ? `${t('ui.consentServiceAssisted')} ${minutes(durations.assistedBathing)}` : `${t('ui.consentServiceBath')} ${minutes(durations.bath)}`,
                    preferences.massageEnabled ? `${t('ui.consentServiceMassage')} ${minutes(durations.massage)}` : '',
                    preferences.perinealCareEnabled ? `${t('ui.consentServicePerineal')} ${minutes(durations.perinealCare)}` : ''
                ].filter(Boolean).join(' · ')]] : []),
                [t('ui.consultationSummarySavasana'), `${yesNo(Boolean(preferences.corpsePoseEnabled))} · ${minutes(durations.corpse)}`]
            ]
        }
    ];
    const pages = [];
    groups.forEach(group => {
        const rows = group.rows.filter(([, value]) => String(value || '').trim());
        for (let index = 0; index < rows.length; index += 3) {
            pages.push([group.heading, ...rows.slice(index, index + 3).map(([label, value]) => `${label}: ${value}`)]);
        }
    });
    return pages.length ? pages : [[t('ui.consentPlanOverview'), `${t('ui.consultationSummaryGoal')}: ${t('ui.sessionGoal')}`]];
}

function drawConsentRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
}

function wrapConsentCanvasText(context, text, maxWidth) {
    const lines = [];
    const words = String(text || '').split(/\s+/).filter(Boolean);
    let current = '';
    words.forEach(word => {
        const candidate = current ? current + ' ' + word : word;
        if (context.measureText(candidate).width > maxWidth && current) {
            lines.push(current);
            current = word;
        } else current = candidate;
    });
    if (current) lines.push(current);
    return lines.length ? lines : ['—'];
}

function drawConsentPlanRows(context, lines, width, padding, startY, contentBottom) {
    const rowWidth = width - padding * 2;
    const scale = width / 1280;
    const labelFont = Math.max(12, Math.round(14 * scale));
    const valueFont = Math.max(16, Math.round(19 * scale));
    const headingFont = Math.max(18, Math.round(22 * scale));
    const lineHeight = Math.round(valueFont * 1.35);
    let y = startY;
    lines.forEach(line => {
        const separator = line.indexOf(': ');
        if (separator <= 0) {
            context.fillStyle = '#a16207';
            context.font = `700 ${Math.max(13, Math.round(16 * scale))}px Arial, sans-serif`;
            context.fillText('◆', padding, y + headingFont);
            context.fillStyle = '#243247';
            context.font = `700 ${headingFont}px Arial, sans-serif`;
            context.fillText(line, padding + Math.max(22, Math.round(28 * scale)), y + headingFont);
            y += headingFont + Math.max(20, Math.round(24 * scale));
            return;
        }

        const label = line.slice(0, separator).trim();
        const value = line.slice(separator + 2).trim();
        context.font = `700 ${valueFont}px Arial, sans-serif`;
        const horizontalInset = Math.max(32, Math.round(44 * scale));
        const valueLines = wrapConsentCanvasText(context, value, rowWidth - horizontalInset * 1.5);
        const rowHeight = Math.max(Math.round(66 * scale), Math.round(40 * scale) + valueLines.length * lineHeight);
        if (y + rowHeight > contentBottom) return;

        drawConsentRoundedRect(context, padding, y, rowWidth, rowHeight, Math.max(8, Math.round(10 * scale)));
        context.fillStyle = '#ffffff';
        context.fill();
        context.strokeStyle = '#d8dde4';
        context.lineWidth = Math.max(1, Math.round(2 * scale));
        context.stroke();
        context.fillStyle = '#a16207';
        context.beginPath();
        context.arc(padding + horizontalInset * 0.42, y + Math.max(16, Math.round(20 * scale)), Math.max(4, Math.round(5 * scale)), 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#667085';
        context.font = `700 ${labelFont}px Arial, sans-serif`;
        context.fillText(label.toUpperCase(), padding + horizontalInset, y + Math.max(21, Math.round(25 * scale)));
        context.fillStyle = '#20242b';
        context.font = `700 ${valueFont}px Arial, sans-serif`;
        valueLines.forEach((valueLine, index) => context.fillText(valueLine, padding + horizontalInset, y + Math.max(43, Math.round(51 * scale)) + index * lineHeight));
        y += rowHeight + Math.max(9, Math.round(12 * scale));
    });
}

function drawConsentDocumentPaper(context, width, height) {
    context.fillStyle = '#d8d0c2';
    context.fillRect(0, 0, width, height);
    context.save();
    context.shadowColor = 'rgba(56, 43, 27, 0.24)';
    context.shadowBlur = 28;
    context.shadowOffsetY = 10;
    context.fillStyle = '#fffaf0';
    context.fillRect(28, 22, width - 56, height - 44);
    context.restore();
    context.strokeStyle = '#a9823d';
    context.lineWidth = 2;
    context.strokeRect(40, 34, width - 80, height - 68);
    context.strokeStyle = '#d7c49c';
    context.lineWidth = 1;
    context.strokeRect(48, 42, width - 96, height - 84);
}

function drawConsentDocumentField(context, x, y, width, height, index, label, value, fontFamily) {
    context.fillStyle = index % 2 ? '#fffdf8' : '#fbf5e8';
    context.fillRect(x, y, width, height);
    context.strokeStyle = '#d8c59d';
    context.lineWidth = 1.5;
    context.strokeRect(x, y, width, height);
    context.fillStyle = '#a9823d';
    context.fillRect(x, y, width, 5);
    context.font = `700 13px ${fontFamily}`;
    context.fillText(`${String(index + 1).padStart(2, '0')}  ${label.toUpperCase()}`, x + 24, y + 40);
    context.fillStyle = '#2d2923';
    context.font = `600 23px ${fontFamily}`;
    const valueLines = wrapConsentCanvasText(context, value, width - 48);
    const maxLines = Math.max(3, Math.floor((height - 88) / 34));
    const visibleLines = valueLines.slice(0, maxLines);
    if (valueLines.length > maxLines) visibleLines[maxLines - 1] = `${visibleLines[maxLines - 1].replace(/[.,;:]?$/, '')}…`;
    visibleLines.forEach((line, lineIndex) => context.fillText(line, x + 24, y + 86 + lineIndex * 34));
}

function drawConsentPlanFrame(context, width, height) {
    const padding = 68;
    const fontFamily = state.language === 'ml' ? 'Manjari, Arial, sans-serif' : 'Georgia, serif';
    const pageIndex = Math.min(consultationPlanPageIndex, Math.max(0, consultationPlanPages.length - 1));
    const page = consultationPlanPages[pageIndex] || [];
    const heading = page[0] || t('ui.consentPlanOverview');
    const rows = page.slice(1).map(line => {
        const separator = line.indexOf(': ');
        return separator > 0
            ? { label: line.slice(0, separator), value: line.slice(separator + 2) }
            : { label: t('ui.consentPlanDetails'), value: line };
    });
    drawConsentDocumentPaper(context, width, height);

    const logoSize = 54;
    if (consultationConsentLogo?.complete && consultationConsentLogo.naturalWidth > 0) {
        context.drawImage(consultationConsentLogo, padding, 55, logoSize, logoSize);
    }
    context.fillStyle = '#2d2923';
    context.font = `700 29px ${fontFamily}`;
    context.fillText(t('ui.consentPlanVideoTitle'), padding + 72, 79);
    context.fillStyle = '#766a58';
    context.font = `500 15px ${fontFamily}`;
    const clientName = consultationVideoPlan?.profile?.name || t('ui.client');
    context.fillText(`${clientName} · ${t('ui.consentPlanVideoSubtitle')}`, padding + 72, 103);
    context.fillStyle = '#a9823d';
    context.font = `700 14px ${fontFamily}`;
    context.textAlign = 'right';
    context.fillText(`${pageIndex + 1} / ${consultationPlanPages.length}`, width - padding, 83);
    context.textAlign = 'start';
    context.fillRect(padding, 129, width - padding * 2, 2);

    context.fillStyle = '#a9823d';
    context.font = `700 13px ${fontFamily}`;
    context.fillText(t('ui.consentPlanDetails').toUpperCase(), padding, 166);
    context.fillStyle = '#2d2923';
    context.font = `700 33px ${fontFamily}`;
    context.fillText(heading, padding, 204);

    const cardGap = 18;
    const cardCount = Math.max(1, rows.length);
    const cardWidth = (width - padding * 2 - cardGap * (cardCount - 1)) / cardCount;
    rows.forEach((row, index) => drawConsentDocumentField(context, padding + index * (cardWidth + cardGap), 232, cardWidth, 270, index, row.label, row.value, fontFamily));

    context.strokeStyle = '#a9823d';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(width / 2, 557, 39, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = '#a9823d';
    context.font = `700 20px Arial, sans-serif`;
    context.textAlign = 'center';
    context.fillText('✓', width / 2, 565);
    context.fillStyle = '#4d4438';
    context.font = `600 16px ${fontFamily}`;
    context.fillText(t('ui.consentPlanApprovedBanner'), width / 2, 623);
    context.textAlign = 'start';

    context.fillStyle = '#877968';
    context.font = `600 14px ${fontFamily}`;
    context.fillText(t('ui.consentPlanPage').replace('{current}', String(pageIndex + 1)).replace('{total}', String(consultationPlanPages.length)), padding, 670);
    context.textAlign = 'right';
    context.fillText(t('ui.consentEvidenceLabel'), width - padding, 670);
    context.textAlign = 'start';
}

function drawConsentTransitionFrame(context, width, height) {
    const fontFamily = state.language === 'ml' ? 'Manjari, Arial, sans-serif' : 'Georgia, serif';
    drawConsentDocumentPaper(context, width, height);
    if (consultationConsentLogo?.complete && consultationConsentLogo.naturalWidth > 0) {
        context.drawImage(consultationConsentLogo, width / 2 - 42, 104, 84, 84);
    }
    context.fillStyle = '#a9823d';
    context.fillRect(width / 2 - 80, 224, 160, 2);
    context.fillStyle = '#2d2923';
    context.font = `700 47px ${fontFamily}`;
    context.textAlign = 'center';
    context.fillText(t('ui.consentPlanComplete'), width / 2, 310);
    context.fillStyle = '#6f6454';
    context.font = `500 22px ${fontFamily}`;
    const lines = wrapConsentCanvasText(context, t('ui.consentPlanTransition'), 760);
    lines.slice(0, 3).forEach((line, index) => context.fillText(line, width / 2, 370 + index * 34));
    context.strokeStyle = '#a9823d';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(width / 2, 514, 42, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = '#a9823d';
    context.font = `700 20px Arial, sans-serif`;
    context.fillText('✓', width / 2, 522);
    context.fillStyle = '#877968';
    context.font = `600 14px ${fontFamily}`;
    context.fillText(t('ui.consentEvidenceLabel'), width / 2, 650);
    context.textAlign = 'start';
}

function drawConsentCameraThumbnail(context, centerX, centerY, radius) {
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();
    context.fillStyle = '#2b2733';
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    if (consultationCameraPreview?.readyState >= 2 && consultationCameraPreview.videoWidth && consultationCameraPreview.videoHeight) {
        const videoWidth = consultationCameraPreview.videoWidth;
        const videoHeight = consultationCameraPreview.videoHeight;
        const sourceSize = Math.min(videoWidth, videoHeight);
        const sourceX = (videoWidth - sourceSize) / 2;
        const sourceY = (videoHeight - sourceSize) / 2;
        context.translate(centerX * 2, 0);
        context.scale(-1, 1);
        context.drawImage(consultationCameraPreview, sourceX, sourceY, sourceSize, sourceSize, centerX - radius, centerY - radius, radius * 2, radius * 2);
    }
    context.restore();
    context.save();
    context.strokeStyle = '#d4a84f';
    context.lineWidth = Math.max(4, Math.round(radius * 0.055));
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.stroke();
    context.restore();
}

function drawConsentSpokenFrame(context, width, height) {
    const padding = 68;
    const fontFamily = state.language === 'ml' ? 'Manjari, Arial, sans-serif' : 'Georgia, serif';
    const elapsed = getConsentRecordingElapsed();
    const liveClock = formatConsentClock(getConsentLiveDate());
    const recordingClock = document.getElementById('consent-recording-clock');
    if (recordingClock) recordingClock.textContent = formatConsentElapsed(elapsed);
    updateConsentMetadataDisplay();

    drawConsentDocumentPaper(context, width, height);
    const logoSize = 52;
    if (consultationConsentLogo?.complete && consultationConsentLogo.naturalWidth > 0) {
        context.drawImage(consultationConsentLogo, padding, 54, logoSize, logoSize);
    }
    context.fillStyle = '#2d2923';
    context.font = `700 27px ${fontFamily}`;
    context.fillText(t('ui.consentEvidenceLabel'), padding + 70, 78);
    context.fillStyle = '#8a795f';
    context.font = `600 13px ${fontFamily}`;
    context.fillText(t('ui.consentEvidenceOverline').toUpperCase(), padding + 70, 101);

    const tickerWidth = 174;
    const tickerGap = 12;
    const tickerStart = width - padding - tickerWidth * 2 - tickerGap;
    [[t('ui.consentElapsedLabel'), formatConsentElapsed(elapsed)], [t('ui.consentLiveTimeLabel'), liveClock]].forEach((entry, index) => {
        const x = tickerStart + index * (tickerWidth + tickerGap);
        context.strokeStyle = '#c8ae78';
        context.lineWidth = 1.5;
        context.strokeRect(x, 55, tickerWidth, 54);
        context.fillStyle = '#8b7347';
        context.font = `700 11px ${fontFamily}`;
        context.fillText(entry[0].toUpperCase(), x + 14, 74);
        context.fillStyle = '#2d2923';
        context.font = `700 20px Arial, sans-serif`;
        context.fillText(entry[1], x + 14, 99);
    });
    context.fillStyle = '#a9823d';
    context.fillRect(padding, 129, width - padding * 2, 2);

    context.fillStyle = '#a9823d';
    context.font = `700 13px ${fontFamily}`;
    context.fillText(t('ui.consentEvidenceOverline').toUpperCase(), padding, 166);
    context.fillStyle = '#2d2923';
    context.font = `700 35px ${fontFamily}`;
    context.fillText(t('ui.consentTitle'), padding, 205);
    context.fillStyle = '#706656';
    context.font = `500 17px ${fontFamily}`;
    context.fillText(t('ui.consentEvidenceSummary'), padding, 232);

    const clientName = consultationVideoPlan?.profile?.name || t('ui.client');
    const clientGoal = consultationVideoPlan?.goal || t('ui.sessionGoal');
    const leftWidth = 730;
    context.strokeStyle = '#d8c59d';
    context.lineWidth = 1.5;
    context.strokeRect(padding, 260, leftWidth, 70);
    context.fillStyle = '#8b7347';
    context.font = `700 11px ${fontFamily}`;
    context.fillText(t('ui.client').toUpperCase(), padding + 20, 282);
    context.fillText(t('ui.consultationSummaryGoal').toUpperCase(), padding + 280, 282);
    context.fillStyle = '#2d2923';
    context.font = `600 18px ${fontFamily}`;
    context.fillText(clientName, padding + 20, 311);
    const goalLabel = wrapConsentCanvasText(context, clientGoal, leftWidth - 320)[0];
    context.fillText(goalLabel, padding + 280, 311);

    context.fillStyle = '#fbf5e8';
    context.fillRect(padding, 352, leftWidth, 218);
    context.strokeStyle = '#d8c59d';
    context.strokeRect(padding, 352, leftWidth, 218);
    context.fillStyle = '#8b7347';
    context.font = `700 12px ${fontFamily}`;
    context.fillText(t('ui.consentCurrentExcerpt').toUpperCase(), padding + 24, 384);
    context.fillStyle = '#2d2923';
    context.font = `600 23px ${fontFamily}`;
    const lines = wrapConsentCanvasText(context, String(document.getElementById('consent-prompt-text')?.innerText || '').trim(), leftWidth - 48);
    const promptScroller = document.querySelector('#consultation-consent-screen .consent-prompter');
    const domMaxScroll = Math.max(0, (promptScroller?.scrollHeight || 0) - (promptScroller?.clientHeight || 0));
    const scrollRatio = domMaxScroll ? Math.min(1, promptScroller.scrollTop / domMaxScroll) : 0;
    const excerptStart = Math.min(Math.max(0, lines.length - 3), Math.floor(scrollRatio * Math.max(0, lines.length - 3)));
    lines.slice(excerptStart, excerptStart + 3).forEach((line, index) => context.fillText(line, padding + 24, 428 + index * 36));
    context.fillStyle = '#dfd4bf';
    drawConsentRoundedRect(context, padding + 24, 540, leftWidth - 48, 5, 2.5);
    context.fill();
    context.fillStyle = '#a9823d';
    drawConsentRoundedRect(context, padding + 24, 540, Math.max(10, (leftWidth - 48) * scrollRatio), 5, 2.5);
    context.fill();
    context.fillStyle = '#766a58';
    context.font = `500 13px ${fontFamily}`;
    context.fillText(t('ui.consentPlanReference'), padding, 601);

    const portraitCenterX = 1035;
    context.strokeStyle = '#d8c59d';
    context.lineWidth = 1.5;
    context.strokeRect(844, 154, 368, 448);
    context.fillStyle = '#8b7347';
    context.font = `700 12px ${fontFamily}`;
    context.textAlign = 'center';
    context.fillText(t('ui.consentSpokenSection').toUpperCase(), portraitCenterX, 184);
    context.fillStyle = '#a33a34';
    context.font = `700 14px Arial, sans-serif`;
    context.fillText('●  REC', portraitCenterX, 214);
    drawConsentCameraThumbnail(context, portraitCenterX, 354, 125);
    context.fillStyle = '#2d2923';
    context.font = `700 24px ${fontFamily}`;
    context.fillText(clientName, portraitCenterX, 515);
    context.fillStyle = '#4d735f';
    context.font = `700 13px ${fontFamily}`;
    context.fillText(`✓  ${t('ui.consentRecordingVerified')}`, portraitCenterX, 552);
    context.textAlign = 'start';

    const locationText = consultationLocation ? `${consultationLocation.latitude}, ${consultationLocation.longitude}` : t('ui.consentLocationUnavailable');
    context.fillStyle = '#877968';
    context.font = `500 13px ${fontFamily}`;
    context.fillText(`${formatConsentDateTime(consultationRecordingStartedAt)} · ${locationText}`, padding, 670);
    context.textAlign = 'right';
    context.fillText(`${t('ui.consentLiveTimeLabel')}: ${liveClock}`, width - padding, 670);
    context.textAlign = 'start';
}

function requestConsentLocation() {
    return new Promise(resolve => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
            position => resolve({
                latitude: Number(position.coords.latitude.toFixed(6)),
                longitude: Number(position.coords.longitude.toFixed(6))
            }),
            () => resolve(null),
            { enableHighAccuracy: false, timeout: 2500, maximumAge: 300000 }
        );
    });
}

function drawConsentComposite() {
    const canvas = document.getElementById('consent-composite-canvas');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const portrait = height > width;
    const padding = Math.round(width * (portrait ? 0.055 : 0.045));

    canvas.dataset.compositionPhase = consultationCompositePhase;
    canvas.dataset.planPage = String(consultationPlanPageIndex + 1);
    canvas.dataset.planPages = String(consultationPlanPages.length);
    canvas.dataset.planDesign = 'luxury-document';
    canvas.dataset.consentDesign = 'luxury-document-evidence';
    if (consultationCompositePhase === 'plan') {
        drawConsentPlanFrame(context, width, height);
        consultationCompositeFrame = requestAnimationFrame(drawConsentComposite);
        return;
    }
    if (consultationCompositePhase === 'transition') {
        drawConsentTransitionFrame(context, width, height);
        consultationCompositeFrame = requestAnimationFrame(drawConsentComposite);
        return;
    }
    if (consultationCompositePhase === 'consent') {
        drawConsentSpokenFrame(context, width, height);
        consultationCompositeFrame = requestAnimationFrame(drawConsentComposite);
        return;
    }

    context.fillStyle = '#050308';
    context.fillRect(0, 0, width, height);
    if (consultationCameraPreview?.readyState >= 2 && consultationCameraPreview.videoWidth && consultationCameraPreview.videoHeight) {
        const videoWidth = consultationCameraPreview.videoWidth;
        const videoHeight = consultationCameraPreview.videoHeight;
        const sourceRatio = videoWidth / videoHeight;
        const targetRatio = width / height;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = videoWidth;
        let sourceHeight = videoHeight;
        if (sourceRatio > targetRatio) {
            sourceWidth = videoHeight * targetRatio;
            sourceX = (videoWidth - sourceWidth) / 2;
        } else {
            sourceHeight = videoWidth / targetRatio;
            sourceY = (videoHeight - sourceHeight) / 2;
        }
        context.drawImage(consultationCameraPreview, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
    }

    const shade = context.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, 'rgba(3, 2, 8, 0.72)');
    shade.addColorStop(0.28, 'rgba(3, 2, 8, 0.12)');
    shade.addColorStop(0.62, 'rgba(3, 2, 8, 0.2)');
    shade.addColorStop(1, 'rgba(3, 2, 8, 0.88)');
    context.fillStyle = shade;
    context.fillRect(0, 0, width, height);

    const logoSize = Math.round(width * (portrait ? 0.1 : 0.065));
    if (consultationConsentLogo?.complete && consultationConsentLogo.naturalWidth > 0) {
        context.save();
        context.globalAlpha = 0.9;
        context.drawImage(consultationConsentLogo, width - padding - logoSize, padding, logoSize, logoSize);
        context.restore();
    }

    const elapsed = getConsentRecordingElapsed();
    const recordingClock = document.getElementById('consent-recording-clock');
    if (recordingClock) recordingClock.textContent = formatConsentElapsed(elapsed);
    updateConsentMetadataDisplay();

    context.save();
    context.fillStyle = 'rgba(8, 5, 18, 0.62)';
    drawConsentRoundedRect(context, padding, padding, portrait ? 150 : 180, portrait ? 54 : 58, 28);
    context.fill();
    context.fillStyle = '#ef4444';
    context.beginPath();
    context.arc(padding + 24, padding + (portrait ? 27 : 29), 7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#ffffff';
    context.font = `${portrait ? 22 : 24}px Arial, sans-serif`;
    context.fillText(formatConsentElapsed(elapsed), padding + 42, padding + (portrait ? 35 : 38));
    context.restore();

    const panelTop = Math.round(height * (portrait ? 0.16 : 0.19));
    const panelHeight = Math.round(height * (portrait ? 0.48 : 0.56));
    const panelWidth = width - padding * 2;
    context.save();
    context.fillStyle = 'rgba(8, 5, 18, 0.58)';
    context.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    context.lineWidth = 2;
    drawConsentRoundedRect(context, padding, panelTop, panelWidth, panelHeight, portrait ? 24 : 20);
    context.fill();
    context.stroke();

    const textInset = Math.round(panelWidth * 0.045);
    const textWidth = panelWidth - textInset * 2;
    const labelHeight = portrait ? 54 : 46;
    const textTop = panelTop + labelHeight;
    const availableHeight = panelHeight - labelHeight - textInset;
    const fontFamily = state.language === 'ml' ? 'Manjari, Arial, sans-serif' : 'Arial, sans-serif';
    const fontSize = portrait ? 28 : 30;
    const lineHeight = Math.round(fontSize * 1.52);
    context.fillStyle = 'rgba(255, 255, 255, 0.7)';
    context.font = `700 ${portrait ? 16 : 15}px ${fontFamily}`;
    context.fillText(t('ui.consentPromptLabel').toUpperCase(), padding + textInset, panelTop + (portrait ? 35 : 31));
    context.fillStyle = '#ffffff';
    context.font = `600 ${fontSize}px ${fontFamily}`;
    const lines = wrapConsentCanvasText(context, String(document.getElementById('consent-prompt-text')?.innerText || '').trim(), textWidth);
    const promptScroller = document.querySelector('#consultation-consent-screen .consent-prompter');
    const domMaxScroll = Math.max(0, (promptScroller?.scrollHeight || 0) - (promptScroller?.clientHeight || 0));
    const canvasMaxScroll = Math.max(0, lines.length * lineHeight - availableHeight + lineHeight);
    const scrollRatio = domMaxScroll ? Math.min(1, promptScroller.scrollTop / domMaxScroll) : 0;
    const canvasOffset = canvasMaxScroll * scrollRatio;
    context.beginPath();
    context.rect(padding + textInset, textTop, textWidth, availableHeight);
    context.clip();
    lines.forEach((line, index) => context.fillText(line, padding + textInset, textTop + fontSize + index * lineHeight - canvasOffset));
    context.restore();

    context.fillStyle = 'rgba(255, 255, 255, 0.86)';
    context.font = `${portrait ? 18 : 17}px ${fontFamily}`;
    const speedLabel = `${t('ui.consentScrollSpeed')}: ${document.getElementById('consent-scroll-speed-value')?.textContent || ''}`;
    context.fillText(speedLabel, padding, height - padding);
    consultationCompositeFrame = requestAnimationFrame(drawConsentComposite);
}

function stopConsentCompositeFrame() {
    if (consultationCompositeFrame) cancelAnimationFrame(consultationCompositeFrame);
    consultationCompositeFrame = null;
}

function setConsentAudioEnabled(enabled) {
    if (!consultationAudioGain || !consultationAudioContext) return;
    const target = enabled ? 1 : 0;
    consultationAudioGain.gain.cancelScheduledValues(consultationAudioContext.currentTime);
    consultationAudioGain.gain.setTargetAtTime(target, consultationAudioContext.currentTime, enabled ? 0.04 : 0.01);
}

function getConsentServiceSummary(sessionPlan) {
    const preferences = sessionPlan?.preferences || {};
    const durations = sessionPlan?.durations || {};
    const services = [];
    if (preferences.yogaBridgeEnabled) {
        const poses = Array.isArray(preferences.selectedYogaPoses) && preferences.selectedYogaPoses.length
            ? ' (' + preferences.selectedYogaPoses.join(', ') + ')' : '';
        services.push(t('ui.consentServiceYoga') + poses);
    }
    if (preferences.massageEnabled) services.push(t('ui.consentServiceMassage') + ' (' + Math.round((durations.massage || 0) / 60) + ' min)');
    if (preferences.perinealCareEnabled) services.push(t('ui.consentServicePerineal') + ' (' + Math.round((durations.perinealCare || 0) / 60) + ' min)');
    if (preferences.assistedBathingEnabled) services.push(t('ui.consentServiceAssisted') + ' (' + Math.round((durations.assistedBathing || 0) / 60) + ' min)');
    else if (preferences.bathSessionEnabled) services.push(t('ui.consentServiceBath') + ' (' + Math.round((durations.bath || 0) / 60) + ' min)');
    if (preferences.corpsePoseEnabled) services.push(t('ui.consentServiceSavasana') + ' (' + Math.round((durations.corpse || 0) / 60) + ' min)');
    return services.length ? services.join(', ') : t('ui.consentServicesNone');
}

function renderConsentPrompt(sessionPlan) {
    const prompt = document.getElementById('consent-prompt-text');
    if (!prompt) return;
    const clientName = sessionPlan?.profile?.name || t('ui.client');
    const medicationStatus = sessionPlan?.safetyReview?.medication;
    const medicationStatement = medicationStatus && medicationStatus !== 'no'
        ? t('ui.consentMedicationAcknowledgment')
        : t('ui.consentMedicationNone');
    const touchStatement = sessionPlan?.safety?.touch === 'yes'
        ? t('ui.consentTouchYes')
        : t('ui.consentTouchNo');
    prompt.textContent = t('ui.consentScript')
        .replace('{name}', clientName)
        .replace('{goal}', sessionPlan?.goal || t('ui.sessionGoal'))
        .replace('{services}', getConsentServiceSummary(sessionPlan))
        .replace('{touch}', touchStatement)
        .replace('{medication}', medicationStatement);
    consultationConsentOpenedAt = new Date();
    consultationPlanPages = getConsentPlanPages();
    requestConsentLocation().then(location => {
        consultationLocation = location;
        const metadata = document.getElementById('consent-recording-metadata');
        if (metadata) metadata.textContent = location
            ? 'Location ready: ' + location.latitude + ', ' + location.longitude
            : 'Location unavailable';
    });
}

function updateConsultationChakraQuestions() {
    const selected = new Set(Array.from(document.querySelectorAll('input[name="chakraFocus"]:checked')).map(input => input.value));
    document.querySelectorAll('[data-chakra-question]').forEach(panel => {
        panel.classList.toggle('hidden', !selected.has(panel.dataset.chakraQuestion));
    });
}

function buildAdaptiveChakraDurations(selectedChakras, focusChakras, chakraResponses = {}) {
    const selected = selectedChakras.length ? selectedChakras : state.selectedChakras;
    const focus = new Set(focusChakras);
    const totalSeconds = Math.max(60, Math.round(state.timePerChakra * 60 * selected.length));
    const answerWeights = { often: 1.15, sometimes: 1, rarely: 0.9, 'prefer-not': 1 };
    const weights = selected.map(key => {
        const response = chakraResponses[key]?.attention;
        const answers = chakraResponses[key]?.answers || [];
        const answerWeight = answers.length
            ? answers.reduce((sum, answer) => sum + (answerWeights[answer] || 1), 0) / answers.length
            : 1;
        if (response === 'more') return Math.max(1.3, answerWeight);
        if (response === 'support') return Math.max(1.15, answerWeight);
        if (response === 'skip') return 1;
        return focus.has(key) ? Math.max(1.15, answerWeight) : answerWeight;
    });
    const weightTotal = weights.reduce((sum, value) => sum + value, 0) || 1;
    const durations = {};
    selected.forEach((key, index) => {
        durations[key] = Math.max(60, Math.min(600, Math.round(totalSeconds * weights[index] / weightTotal)));
    });
    return durations;
}

function approvedChakraDurationMinutes(key) {
    try {
        const plan = JSON.parse(localStorage.getItem('chakra_consultation_plan') || 'null');
        const seconds = plan?.status === 'consent-recorded' ? plan.chakraDurations?.[key] : null;
        return Number.isFinite(Number(seconds)) ? Number(seconds) / 60 : state.timePerChakra;
    } catch {
        return state.timePerChakra;
    }
}

function updateConsultationCareVisibility() {
    const yogaSelect = document.getElementById('consultation-yoga-enabled');
    const physicalRestricted = document.getElementById('consultation-physical')?.value !== 'no';
    const pregnancyRestricted = document.getElementById('consultation-pregnancy')?.value === 'yes';
    if (physicalRestricted && yogaSelect) yogaSelect.value = 'no';
    const yogaRestricted = physicalRestricted;
    if (yogaSelect) yogaSelect.disabled = yogaRestricted;
    const yogaEnabled = !yogaRestricted && yogaSelect?.value === 'yes';
    const bathEnabled = yogaEnabled && document.getElementById('consultation-bath-enabled')?.value === 'yes';
    document.getElementById('consultation-yoga-restriction-note')?.classList.toggle('hidden', !yogaRestricted);
    document.getElementById('consultation-yoga-pose-restriction-note')?.classList.toggle('hidden', !yogaEnabled || !pregnancyRestricted);
    document.getElementById('consultation-yoga-options')?.classList.toggle('hidden', !yogaEnabled);
    document.getElementById('consultation-bath-options')?.classList.toggle('hidden', !bathEnabled);
    document.querySelectorAll('#consultation-yoga-options input[name="yogaPose"]').forEach(input => {
        input.disabled = yogaRestricted || pregnancyRestricted;
        if (yogaRestricted || pregnancyRestricted) input.checked = false;
    });
    document.querySelectorAll('.consultation-yoga-pose-option').forEach(option => option.classList.toggle('hidden', yogaRestricted || pregnancyRestricted));
    document.querySelectorAll('.consultation-yoga-pose-timing').forEach(option => option.classList.toggle('hidden', yogaRestricted || pregnancyRestricted));
    const bathSelect = document.getElementById('consultation-bath-enabled');
    if (!yogaEnabled && bathSelect) {
        bathSelect.value = 'no';
        bathSelect.disabled = yogaRestricted;
    } else if (bathSelect) {
        bathSelect.disabled = false;
    }
    const touchNo = document.getElementById('consultation-touch')?.value === 'no';
    document.getElementById('consultation-touch-care-options')?.classList.toggle('hidden', touchNo || !bathEnabled);
    document.querySelectorAll('#consultation-touch-care-options input[name="massage"], #consultation-touch-care-options input[name="perinealCare"], #consultation-touch-care-options input[name="assistedBathing"]').forEach(input => {
        input.disabled = touchNo;
        if (touchNo) input.checked = false;
    });
}

function updateConsultationSafetyVisibility() {
    const pairs = [
        ['consultation-physical', 'consultation-physical-details'],
        ['consultation-medication', 'consultation-medication-details'],
        ['consultation-stimulation', 'consultation-stimulation-details']
    ];
    pairs.forEach(([selectId, detailsId]) => {
        const select = document.getElementById(selectId);
        const details = document.getElementById(detailsId);
        const needsDetails = select && select.value !== 'no';
        details?.classList.toggle('hidden', !needsDetails);
        if (details) details.required = Boolean(needsDetails);
    });
    updateConsultationCareVisibility();
}

function updateConsultationCountryPrefix() {
    const country = document.getElementById('consultation-citizenship');
    if (!country) return;
    const dialCode = country.selectedOptions[0]?.dataset.dialCode || '';
    ['consultation-contact', 'consultation-emergency-phone'].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        const current = input.value.trim();
        const previousPrefix = input.dataset.autoCountryPrefix || '';
        const canReplace = !current || input.dataset.userEdited !== 'true' || current === previousPrefix;
        if (canReplace && dialCode) {
            input.value = `${dialCode} `;
            input.dataset.autoCountryPrefix = dialCode;
            input.dataset.userEdited = 'false';
        }
    });
}

function markConsultationPhoneEdited(event) {
    event.currentTarget.dataset.userEdited = 'true';
}

function getConsultationPhoneValue(id) {
    const input = document.getElementById(id);
    const value = String(input?.value || '').trim();
    const autoPrefix = String(input?.dataset.autoCountryPrefix || '').trim();
    return autoPrefix && value === autoPrefix ? '' : value;
}

function validateConsultationContactFields(form) {
    if (!form.reportValidity()) return false;
    const email = String(document.getElementById('consultation-email')?.value || '').trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phonePattern = /^\+?[0-9][0-9\s().-]{6,}$/;
    const contact = getConsultationPhoneValue('consultation-contact');
    const emergency = getConsultationPhoneValue('consultation-emergency-phone');
    if (!emailValid) {
        alert(t('ui.consultationEmailInvalid'));
        document.getElementById('consultation-email')?.focus();
        return false;
    }
    if (!phonePattern.test(contact)) {
        alert(t('ui.consultationPhoneInvalid'));
        document.getElementById('consultation-contact')?.focus();
        return false;
    }
    if (emergency && !phonePattern.test(emergency)) {
        alert(t('ui.consultationPhoneInvalid'));
        document.getElementById('consultation-emergency-phone')?.focus();
        return false;
    }
    return true;
}

function setConsentRecordingState(stateName) {
    const status = document.getElementById('consent-recording-status');
    const record = document.getElementById('consent-record');
    const pause = document.getElementById('consent-pause');
    const stop = document.getElementById('consent-stop');
    const retry = document.getElementById('consent-retry');
    const submit = document.getElementById('consent-submit');
    const pauseIcon = pause?.querySelector('span');
    const recordingClock = document.getElementById('consent-recording-clock');
    consultationConsentScreen?.classList.toggle('consent-recording-active', stateName === 'lead' || stateName === 'recording' || stateName === 'paused');
    const messages = {
        ready: 'ui.consentReady', composing: 'ui.consentPlanPreparing', awaitingConsent: 'ui.consentAwaitingManualStart', lead: 'ui.consentReadingLead', recording: 'ui.consentRecording', paused: 'ui.consentPaused',
        recorded: 'ui.consentRecorded', error: 'ui.consentError'
    };
    if (status && messages[stateName]) status.textContent = t(messages[stateName]);
    record?.classList.toggle('hidden', stateName !== 'ready' && stateName !== 'awaitingConsent');
    pause?.classList.toggle('hidden', stateName !== 'lead' && stateName !== 'recording' && stateName !== 'paused');
    stop?.classList.toggle('hidden', stateName !== 'lead' && stateName !== 'recording' && stateName !== 'paused');
    retry?.classList.toggle('hidden', stateName !== 'recorded' && stateName !== 'error');
    submit?.classList.toggle('hidden', stateName !== 'recorded');
    if (pause) pause.setAttribute('aria-label', t(stateName === 'paused' ? 'ui.resumeRecording' : 'ui.pauseRecording'));
    if (pauseIcon) pauseIcon.textContent = stateName === 'paused' ? '▶' : 'Ⅱ';
    if (record) {
        const recordLabel = t(stateName === 'awaitingConsent' ? 'ui.startConsentRecording' : 'ui.startRecording');
        record.setAttribute('aria-label', recordLabel);
        record.title = recordLabel;
    }
    if (recordingClock && stateName === 'ready') recordingClock.textContent = '00:00';
    if (stateName === 'paused' || stateName === 'recorded' || stateName === 'error' || stateName === 'ready') {
        stopConsentPromptAutoScroll(stateName === 'ready');
    }
}

function stopConsultationStream() {
    consultationRecordingStream?.getTracks().forEach(track => {
        if (track.kind === 'audio' || !consultationPreviewStream?.getTracks().includes(track)) track.stop();
    });
    consultationRecordingStream = null;
    consultationRecorder = null;
}

async function startConsultationRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        setConsentRecordingState('error');
        return;
    }
    const attemptId = ++consultationRecordingAttempt;
    let acquiredAudioStream = null;
    try {
        const recordButton = document.getElementById('consent-record');
        if (recordButton) recordButton.disabled = true;
        const status = document.getElementById('consent-recording-status');
        if (status) status.textContent = t('ui.consentPreparingCamera');
        consultationLocation = await requestConsentLocation();
        if (attemptId !== consultationRecordingAttempt) return;
        acquiredAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const videoTracks = consultationPreviewStream?.getVideoTracks() || [];
        if (!videoTracks.length) {
            const fallbackVideoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            consultationPreviewStream = fallbackVideoStream;
            const preview = document.getElementById('consent-live-preview');
            if (preview) {
                preview.srcObject = fallbackVideoStream;
                await preview.play();
            }
        }
        consultationRecordingStream = new MediaStream([
            ...(consultationPreviewStream?.getVideoTracks() || []),
            ...acquiredAudioStream.getAudioTracks()
        ]);
        consultationCameraPreview = document.createElement('video');
        consultationCameraPreview.muted = true;
        consultationCameraPreview.playsInline = true;
        consultationCameraPreview.srcObject = consultationRecordingStream;
        await consultationCameraPreview.play();
        await loadConsentLogo();
        consultationRecordingChunks = [];
        consultationRecordingBlob = null;
        consultationRecordingEndedAt = null;
        consultationRecordingStartedAt = null;
        consultationRecordingStartTick = 0;
        consultationRecordingPausedAt = 0;
        consultationRecordingPausedDuration = 0;
        const canvas = document.getElementById('consent-composite-canvas');
        canvas.width = 1280;
        canvas.height = 720;
        canvas.dataset.videoFormat = 'landscape-16:9';
        const compositeStream = canvas.captureStream(30);
        const audioTracks = consultationRecordingStream.getAudioTracks();
        if (audioTracks.length) {
            consultationAudioContext = new AudioContext();
            const audioSource = consultationAudioContext.createMediaStreamSource(new MediaStream(audioTracks));
            consultationAudioGain = consultationAudioContext.createGain();
            consultationAudioGain.gain.value = 0;
            const audioDestination = consultationAudioContext.createMediaStreamDestination();
            audioSource.connect(consultationAudioGain).connect(audioDestination);
            audioDestination.stream.getAudioTracks().forEach(track => compositeStream.addTrack(track));
            await consultationAudioContext.resume();
        }
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' : 'video/webm';
        const activeRecorder = new MediaRecorder(compositeStream, { mimeType, videoBitsPerSecond: 600000, audioBitsPerSecond: 64000 });
        consultationRecorder = activeRecorder;
        activeRecorder.ondataavailable = event => {
            if (event.data.size > 0) consultationRecordingChunks.push(event.data);
        };
        activeRecorder.onstop = () => {
            stopConsentCompositeFrame();
            stopConsentPromptAutoScroll();
            if (attemptId !== consultationRecordingAttempt) return;
            consultationRecordingEndedAt = consultationRecordingEndedAt || new Date();
            consultationRecordingBlob = new Blob(consultationRecordingChunks, { type: activeRecorder.mimeType || 'video/webm' });
            const preview = document.getElementById('consent-video-preview');
            if (preview) {
                preview.src = URL.createObjectURL(consultationRecordingBlob);
            }
            updateConsentMetadataDisplay();
            stopConsultationStream();
            stopConsentCameraPreview();
            setConsentRecordingState('recorded');
            showConsentPreviewStage();
        };

        const storedPlan = localStorage.getItem('chakra_consultation_plan');
        const approvedPlan = storedPlan ? JSON.parse(storedPlan) : null;
        consultationVideoPlan = approvedPlan;
        consultationPlanPages = getConsentPlanPages(approvedPlan);
        consultationCompositePhase = 'plan';
        consultationPlanPageIndex = 0;
        setConsentAudioEnabled(false);
        activeRecorder.start();
        drawConsentComposite();
        setConsentRecordingState('composing');
        for (let pageIndex = 0; pageIndex < consultationPlanPages.length; pageIndex += 1) {
            consultationPlanPageIndex = pageIndex;
            if (status) status.textContent = t('ui.consentPlanProgress')
                .replace('{current}', String(pageIndex + 1))
                .replace('{total}', String(consultationPlanPages.length));
            const shouldContinue = await waitForConsentAttempt(consentTiming('planPageMs', 5000), attemptId);
            if (!shouldContinue || attemptId !== consultationRecordingAttempt) return;
        }
        consultationCompositePhase = 'transition';
        if (status) status.textContent = t('ui.consentPlanTransition');
        const shouldTransition = await waitForConsentAttempt(consentTiming('planTransitionMs', 1000), attemptId);
        if (!shouldTransition || attemptId !== consultationRecordingAttempt) return;

        consultationAwaitingConsentStart = true;
        setConsentRecordingState('awaitingConsent');
    } catch (error) {
        acquiredAudioStream?.getTracks().forEach(track => track.stop());
        stopConsultationStream();
        if (attemptId === consultationRecordingAttempt) setConsentRecordingState('error');
        console.warn('[Consultation] recording permission failed:', error);
    } finally {
        const recordButton = document.getElementById('consent-record');
        if (recordButton && attemptId === consultationRecordingAttempt) recordButton.disabled = false;
    }
}

function startSpokenConsentRecording() {
    if (!consultationAwaitingConsentStart || consultationRecorder?.state !== 'recording') return;
    consultationAwaitingConsentStart = false;
    consultationCompositePhase = 'consent';
    consultationRecordingStartedAt = new Date();
    consultationRecordingStartTick = performance.now();
    setConsentAudioEnabled(true);
    startConsentPromptWithLead(true);
}

function handleConsentRecordAction() {
    if (consultationAwaitingConsentStart) startSpokenConsentRecording();
    else startConsultationRecording();
}

function resetConsultationRecording() {
    consultationRecordingAttempt += 1;
    if (consultationCountdownTimer) {
        clearTimeout(consultationCountdownTimer);
        consultationCountdownTimer = null;
    }
    if (consultationCountdownResolve) {
        consultationCountdownResolve(false);
        consultationCountdownResolve = null;
    }
    if (consultationRecorder && consultationRecorder.state !== 'inactive') consultationRecorder.stop();
    stopConsultationStream();
    stopConsentPromptLead();
    stopConsentPromptAutoScroll(true);
    consultationRecordingChunks = [];
    consultationRecordingBlob = null;
    stopConsentCompositeFrame();
    consultationCameraPreview?.pause();
    consultationCameraPreview = null;
    consultationRecordingStartedAt = null;
    consultationRecordingEndedAt = null;
    consultationRecordingStartTick = 0;
    consultationRecordingPausedAt = 0;
    consultationRecordingPausedDuration = 0;
    consultationLocation = null;
    consultationConsentOpenedAt = null;
    consultationPlanPages = [];
    consultationVideoPlan = null;
    consultationCompositePhase = 'idle';
    consultationPlanPageIndex = 0;
    consultationAwaitingConsentStart = false;
    consentPromptLeadRemaining = 0;
    consentPromptLeadStartedAt = 0;
    if (consultationStopTimer) {
        clearTimeout(consultationStopTimer);
        consultationStopTimer = null;
    }
    consultationAudioGain = null;
    if (consultationAudioContext) {
        consultationAudioContext.close().catch(() => {});
        consultationAudioContext = null;
    }
    const preview = document.getElementById('consent-video-preview');
    if (preview) { preview.pause(); preview.removeAttribute('src'); preview.load(); preview.classList.add('hidden'); }
    document.getElementById('consent-countdown')?.classList.add('hidden');
    setConsentRecordingState('ready');
}

function applyApprovedConsultationPlan(sessionPlan) {
    const approvedSettings = sessionPlan.approvedSettings || {};
    state.audioFilters = Boolean(approvedSettings.audioFilters);
    state.hooponopono = Boolean(approvedSettings.hooponopono);
    state.reverseJourney = Boolean(approvedSettings.reverseJourney);
    localStorage.setItem('chakra_audio_filters', String(state.audioFilters));
    localStorage.setItem('chakra_hooponopono', String(state.hooponopono));
    localStorage.setItem('chakra_reverse_journey', String(state.reverseJourney));
    syncChecked('audio-filters-toggle', state.audioFilters);
    syncChecked('hooponopono-toggle', state.hooponopono);
    syncChecked('reverse-journey-toggle', state.reverseJourney);
    const preferences = sessionPlan.preferences || {};
    const durations = sessionPlan.durations || {};
    const approvedLanguage = sessionPlan.language || preferences.meditationLanguage;
    if (approvedLanguage === 'ml' || approvedLanguage === 'en') {
        state.language = approvedLanguage;
        localStorage.setItem('chakra_lang', state.language);
        syncValue('language-select', state.language);
        setupVoices();
        autoSelectVoice();
    }
    if (preferences.voiceGender && preferences.voiceGender !== 'guide') {
        const matchingVoice = piperVoiceRegistry.find(voice => voice.language === state.language && voice.gender === preferences.voiceGender);
        if (matchingVoice) {
            state.voiceName = `piper:${matchingVoice.id}`;
            localStorage.setItem('chakra_voice', state.voiceName);
            if (voiceSelect) {
                setupVoices();
                voiceSelect.value = state.voiceName;
            }
            sessionPlan.approvedSettings.voiceGender = preferences.voiceGender;
        } else {
            sessionPlan.approvedSettings.voiceGender = 'unavailable-fallback';
        }
    }
    state.yogaBridgeEnabled = Boolean(preferences.yogaBridgeEnabled);
    state.corpsePoseEnabled = Boolean(preferences.corpsePoseEnabled);
    state.bathSessionEnabled = state.yogaBridgeEnabled && Boolean(preferences.bathSessionEnabled);
    state.massageEnabled = state.bathSessionEnabled && Boolean(preferences.massageEnabled);
    state.perinealCareEnabled = state.bathSessionEnabled && Boolean(preferences.perinealCareEnabled);
    state.assistedBathingEnabled = state.bathSessionEnabled && Boolean(preferences.assistedBathingEnabled);
    state.selectedYogaPoses = state.yogaBridgeEnabled && Array.isArray(preferences.selectedYogaPoses)
        ? preferences.selectedYogaPoses : [];
    if (Array.isArray(sessionPlan.chakraFocus) && sessionPlan.chakraFocus.length) {
        state.selectedChakras = [...sessionPlan.chakraFocus];
        localStorage.setItem('chakra_selected', JSON.stringify(state.selectedChakras));
        document.querySelectorAll('#chakra-selection input').forEach(input => {
            input.checked = state.selectedChakras.includes(input.value);
        });
    }
    if (state.assistedBathingEnabled) state.bathSessionEnabled = true;
    if (sessionPlan.safety?.touch === 'no') {
        state.massageEnabled = false;
        state.perinealCareEnabled = false;
        state.assistedBathingEnabled = false;
        localStorage.setItem('chakra_massage', 'false');
        localStorage.setItem('chakra_perineal_care', 'false');
        localStorage.setItem('chakra_assisted_bathing', 'false');
        syncChecked('massage-toggle', false);
        syncChecked('perineal-care-toggle', false);
        syncChecked('assisted-bathing-toggle', false);
        sessionPlan.approvedSettings.touchSensitiveStages = 'disabled-by-client';
    }
    if (sessionPlan.safetyReview?.stimulation && sessionPlan.safetyReview.stimulation !== 'no') {
        state.chakraFrequencies = false;
        localStorage.setItem('chakra_frequencies', 'false');
        syncChecked('frequencies-toggle', false);
        syncChecked('mixer-frequencies-toggle', false);
        sessionPlan.approvedSettings.frequencySafety = 'disabled-pending-guide-review';
    }
    state.timeYogaPrep = Number(durations.yogaPrep) || state.timeYogaPrep;
    state.timeYogaPose = Number(durations.yogaPose) || state.timeYogaPose;
    state.timeCorpse = Number(durations.corpse) || state.timeCorpse;
    state.timeBath = Number(durations.bath) || state.timeBath;
    state.timePerinealCare = Number(durations.perinealCare) || state.timePerinealCare;
    state.timeAssistedBathing = Number(durations.assistedBathing) || state.timeAssistedBathing;
    state.timeMassage = Number(durations.massage) || state.timeMassage;
    localStorage.setItem('chakra_yoga_bridge', String(state.yogaBridgeEnabled));
    localStorage.setItem('chakra_corpse_enabled', String(state.corpsePoseEnabled));
    localStorage.setItem('chakra_bath_enabled', String(state.bathSessionEnabled));
    localStorage.setItem('chakra_massage', String(state.massageEnabled));
    localStorage.setItem('chakra_perineal_care', String(state.perinealCareEnabled));
    localStorage.setItem('chakra_assisted_bathing', String(state.assistedBathingEnabled));
    localStorage.setItem('chakra_yoga_selected', JSON.stringify(state.selectedYogaPoses));
    localStorage.setItem('chakra_time_yoga_prep', String(state.timeYogaPrep));
    localStorage.setItem('chakra_time_yoga_pose', String(state.timeYogaPose));
    localStorage.setItem('chakra_time_corpse', String(state.timeCorpse));
    localStorage.setItem('chakra_time_bath', String(state.timeBath));
    localStorage.setItem('chakra_time_perineal_care', String(state.timePerinealCare));
    localStorage.setItem('chakra_time_assisted_bathing', String(state.timeAssistedBathing));
    localStorage.setItem('chakra_time_massage', String(state.timeMassage));
    syncChecked('yoga-bridge-toggle', state.yogaBridgeEnabled);
    syncChecked('corpse-pose-toggle', state.corpsePoseEnabled);
    syncChecked('bath-session-toggle', state.bathSessionEnabled);
    syncChecked('massage-toggle', state.massageEnabled);
    syncChecked('perineal-care-toggle', state.perinealCareEnabled);
    syncChecked('assisted-bathing-toggle', state.assistedBathingEnabled);
    document.querySelectorAll('#yoga-pose-selection input').forEach(input => { input.checked = state.selectedYogaPoses.includes(input.value); });
    syncValue('time-yoga-prep', state.timeYogaPrep); syncValue('time-yoga-pose', state.timeYogaPose); syncValue('time-corpse', state.timeCorpse);
    syncValue('time-bath', state.timeBath); syncValue('time-perineal-care', state.timePerinealCare); syncValue('time-assisted-bathing', state.timeAssistedBathing); syncValue('time-massage', state.timeMassage);
    document.getElementById('yoga-bridge-toggle')?.dispatchEvent(new Event('change'));
    document.getElementById('bath-session-toggle')?.dispatchEvent(new Event('change'));
    globalThis.updateSessionEstimate?.();
}

function renderConsultationReview(sessionPlan) {
    const summary = document.getElementById('consultation-review-summary');
    if (!summary) return;
    const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
    const chakraAnswerLabels = {
        often: 'chakraAnswerOften',
        sometimes: 'chakraAnswerSometimes',
        rarely: 'chakraAnswerRarely',
        'prefer-not': 'chakraAnswerPreferNot'
    };
    const attentionLabels = {
        standard: 'consultationAttentionStandard',
        support: 'consultationAttentionSupport',
        more: 'consultationAttentionMore',
        skip: 'consultationAttentionSkip'
    };
    const chakraLabelKeys = { root: 'root', sacral: 'sacral', solar: 'solar', heart: 'heart', throat: 'throat', thirdeye: 'thirdEye', crown: 'crown' };
    const chakraQuestionKeys = {
        root: ['chakraRootQuestion1', 'chakraRootQuestion2', 'chakraRootQuestion3'],
        sacral: ['chakraSacralQuestion1', 'chakraSacralQuestion2', 'chakraSacralQuestion3'],
        solar: ['chakraSolarQuestion1', 'chakraSolarQuestion2', 'chakraSolarQuestion3'],
        heart: ['chakraHeartQuestion1', 'chakraHeartQuestion2', 'chakraHeartQuestion3'],
        throat: ['chakraThroatQuestion1', 'chakraThroatQuestion2', 'chakraThroatQuestion3'],
        thirdeye: ['chakraThirdEyeQuestion1', 'chakraThirdEyeQuestion2', 'chakraThirdEyeQuestion3'],
        crown: ['chakraCrownQuestion1', 'chakraCrownQuestion2', 'chakraCrownQuestion3']
    };
    const chakraPlanRows = Object.entries(sessionPlan.chakraResponses || {}).map(([key, response]) => {
        const duration = sessionPlan.chakraDurations?.[key];
        const attention = t(`ui.${attentionLabels[response.attention] || 'consultationAttentionStandard'}`);
        const prompts = (response.answers || []).map((answer, index) => {
            const questionKey = chakraQuestionKeys[key]?.[index];
            const question = questionKey ? t(`ui.${questionKey}`) : t('ui.consultationChakraPrompt');
            const answerLabel = t(`ui.${chakraAnswerLabels[answer] || 'chakraAnswerPreferNot'}`);
            return `<div class="consultation-reflection-answer"><span>${escape(question)}</span><strong>${escape(answerLabel)}</strong></div>`;
        }).join('');
        const note = response.note ? `<div class="consultation-reflection-note"><b>${escape(t('ui.consultationChakraGuideNote'))}</b><span>${escape(response.note)}</span></div>` : '';
        return `<div class="consultation-summary-detail"><strong class="consultation-chakra-title">${escape(t(`ui.${chakraLabelKeys[key] || key}`))}</strong><em>${escape(t('ui.consultationChakraAttentionSummary'))}: ${escape(attention)}${duration ? ` · ${Math.round(duration / 60)} min` : ''}</em><div class="consultation-reflection-answers">${prompts}</div>${note}</div>`;
    }).join('');
    const safetyReview = sessionPlan.safetyReview || {};
    const safetyRows = [
        { label: 'consultationSummaryEmergency', value: `${safetyReview.emergencyContact?.name || t('ui.consultationNone')}${safetyReview.emergencyContact?.phone ? ` · ${safetyReview.emergencyContact.phone}` : ''}`, flagged: false },
        { label: 'consultationSummaryPhysical', value: `${safetyReview.physical || t('ui.consultationNone')}${safetyReview.physicalDetails ? ` — ${safetyReview.physicalDetails}` : ''}`, flagged: Boolean(safetyReview.physical && safetyReview.physical !== 'no') },
        { label: 'consultationSummaryMedication', value: `${safetyReview.medication || t('ui.consultationNone')}${safetyReview.medicationDetails ? ` — ${safetyReview.medicationDetails}` : ''}`, flagged: Boolean(safetyReview.medication && safetyReview.medication !== 'no') },
        { label: 'consultationSummaryPregnancy', value: safetyReview.pregnancy || t('ui.consultationNone'), flagged: Boolean(safetyReview.pregnancy && safetyReview.pregnancy !== 'no') },
        { label: 'consultationSummaryStimulation', value: `${safetyReview.stimulation || t('ui.consultationNone')}${safetyReview.stimulationDetails ? ` — ${safetyReview.stimulationDetails}` : ''}`, flagged: Boolean(safetyReview.stimulation && safetyReview.stimulation !== 'no') },
        { label: 'consultationSummarySensitivities', value: sessionPlan.safety?.sensitivityTypes?.length ? sessionPlan.safety.sensitivityTypes.join(', ') : t('ui.consultationNone'), flagged: Boolean(sessionPlan.safety?.sensitivityTypes?.length) },
        { label: 'consultationSummaryPrivateNote', value: sessionPlan.safety?.sensitivities || t('ui.consultationNone'), flagged: Boolean(sessionPlan.safety?.sensitivities) }
    ].map(({ label, value, flagged }) => `<div class="consultation-summary-row${flagged ? ' consultation-safety-flagged' : ''}"><span>${escape(t(`ui.${label}`))}</span><strong>${escape(value)}</strong></div>`).join('');
    const planRows = [
        ['consultationSummaryExperience', sessionPlan.profile?.experience],
        ['consultationSummaryReadiness', sessionPlan.preferences?.readiness],
        ['consultationSummaryYogaPoses', sessionPlan.preferences?.selectedYogaPoses?.length ? sessionPlan.preferences.selectedYogaPoses.join(', ') : t('ui.consultationNone')],
        ['consultationSummaryYogaTiming', `${Math.round((sessionPlan.durations?.yogaPrep || 0) / 60)}m prep · ${Math.round((sessionPlan.durations?.yogaPose || 0) / 60)}m per pose`],
        ['consultationSummaryCareTiming', `Bath ${Math.round((sessionPlan.durations?.bath || 0) / 60)}m · Massage ${Math.round((sessionPlan.durations?.massage || 0) / 60)}m · Perineal ${Math.round((sessionPlan.durations?.perinealCare || 0) / 60)}m · Assisted ${Math.round((sessionPlan.durations?.assistedBathing || 0) / 60)}m`],
        ['consultationSummarySavasana', `${sessionPlan.preferences?.corpsePoseEnabled ? t('ui.consultationYes') : t('ui.consultationNo')} · ${Math.round((sessionPlan.durations?.corpse || 0) / 60)}m`]
    ].map(([label, value]) => `<div class="consultation-summary-row"><span>${escape(t(`ui.${label}`))}</span><strong>${escape(value || t('ui.consultationNone'))}</strong></div>`).join('');
    summary.innerHTML = `
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryName'))}</span><strong>${escape(sessionPlan.profile.name)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryCitizenship'))}</span><strong>${escape(sessionPlan.profile.citizenship)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryContact'))}</span><strong>${escape(sessionPlan.profile.contactNumber)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryEmail'))}</span><strong>${escape(sessionPlan.profile.email)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryGoal'))}</span><strong>${escape(sessionPlan.goal)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryFocus'))}</span><strong>${escape((sessionPlan.chakraFocus?.length ? sessionPlan.chakraFocus.join(', ') : t('ui.consultationEvenJourney')))}</strong></div>
        ${chakraPlanRows ? `<div class="consultation-summary-section"><h3>${escape(t('ui.consultationSummaryChakraPlan'))}</h3>${chakraPlanRows}</div>` : ''}
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryLanguage'))}</span><strong>${escape(sessionPlan.language || state.language)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryVoice'))}</span><strong>${escape(sessionPlan.preferences.voiceGender || 'guide')}</strong></div>
        <div class="consultation-summary-section"><h3>${escape(t('ui.consultationSummaryPlanDetails'))}</h3>${planRows}</div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryYoga'))}</span><strong>${escape(sessionPlan.preferences.yogaBridgeEnabled ? t('ui.consultationYes') : t('ui.consultationNo'))}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryCare'))}</span><strong>${escape(sessionPlan.preferences.careSummary || t('ui.consultationNone'))}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryTone'))}</span><strong>${escape(sessionPlan.preferences.tone)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummaryTouch'))}</span><strong>${escape(sessionPlan.safety.touch)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummarySleep'))}</span><strong>${escape(sessionPlan.preferences.sleepMode)}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummarySensitivities'))}</span><strong>${escape(sessionPlan.safety.sensitivityTypes?.length ? sessionPlan.safety.sensitivityTypes.join(', ') : t('ui.consultationNone'))}</strong></div>
        <div class="consultation-summary-row"><span>${escape(t('ui.consultationSummarySafety'))}</span><strong>${escape(sessionPlan.safetyReview?.requiresGuideReview ? t('ui.consultationGuideReviewRequired') : t('ui.consultationSafetyClear'))}</strong></div>
        <div class="consultation-summary-section"><h3>${escape(t('ui.consultationSummarySafetyDetails'))}</h3>${safetyRows}</div>
    `;
    const reverseJourneySummary = document.createElement('div');
    reverseJourneySummary.className = 'consultation-summary-row';
    reverseJourneySummary.innerHTML = '<span></span><strong></strong>';
    reverseJourneySummary.querySelector('span').textContent = t('ui.consultationSummaryReverseJourney');
    reverseJourneySummary.querySelector('strong').textContent = t('ui.consultationReverseJourney' + (sessionPlan.preferences.reverseJourneyNeed === 'reconnect' ? 'Reconnect' : sessionPlan.preferences.reverseJourneyNeed === 'private' ? 'Private' : 'Grounded'));
    summary.appendChild(reverseJourneySummary);
    syncChecked('review-audio-filters', sessionPlan.preferences.tone === 'soft' || sessionPlan.preferences.tone === 'deep');
    syncChecked('review-hooponopono', sessionPlan.preferences.hooponopono);
    const reverseJourneyRecommended = ['reconnect', 'private'].includes(sessionPlan.preferences.reverseJourneyNeed);
    document.getElementById('review-reverse-journey-row')?.classList.toggle('hidden', !reverseJourneyRecommended);
    syncChecked('review-reverse-journey', sessionPlan.preferences.reverseJourneyNeed === 'reconnect');
    const guideNotes = document.getElementById('review-guide-notes');
    if (guideNotes) guideNotes.value = sessionPlan.guideReview?.notes || '';
    document.getElementById('review-safety-row')?.classList.toggle('hidden', !sessionPlan.safetyReview?.requiresGuideReview);
    syncChecked('review-safety-confirm', false);
    const sensitivityTypes = new Set(sessionPlan.safety?.sensitivityTypes || []);
    const manualOnly = sensitivityTypes.has('audio') || sensitivityTypes.has('wording');
    document.getElementById('review-print')?.classList.remove('hidden');
    document.getElementById('save-manual-plan')?.classList.toggle('hidden', !manualOnly);
    document.getElementById('return-manual-lobby')?.classList.toggle('hidden', !manualOnly);
    const approveButton = document.getElementById('approve-consultation');
    if (approveButton) {
        approveButton.textContent = t('ui.approveConsultation');
        approveButton.classList.toggle('hidden', manualOnly);
    }
    const advice = document.getElementById('consultation-review-advice');
    if (advice) {
        const messages = [];
        const safetyReview = sessionPlan.safetyReview || {};
        if (safetyReview.physical && safetyReview.physical !== 'no') messages.push(t('ui.consultationInjuryReviewAdvice'));
        if (safetyReview.medication && safetyReview.medication !== 'no') messages.push(t('ui.consultationMedicationReviewAdvice'));
        if (safetyReview.pregnancy && safetyReview.pregnancy !== 'no') messages.push(t('ui.consultationPregnancyReviewAdvice'));
        if ([safetyReview.physical, safetyReview.medication, safetyReview.pregnancy, safetyReview.stimulation].includes('private')) messages.push(t('ui.consultationPrivateReviewAdvice'));
        if (sensitivityTypes.has('movement')) messages.push(t('ui.consultationMovementAdvice'));
        if (sensitivityTypes.has('imagery')) messages.push(t('ui.consultationImageryAdvice'));
        if (manualOnly) messages.push(t('ui.consultationManualOnlyAdvice'));
        if (reverseJourneyRecommended) messages.push(t('ui.consultationReverseJourneyReviewAdvice'));
        advice.textContent = messages.join(' ');
        advice.classList.toggle('hidden', messages.length === 0);
    }
    document.getElementById('review-manual-only-row')?.classList.toggle('hidden', !manualOnly);
    syncChecked('review-manual-only', false);
}

function escapeDocumentText(value) {
    const element = document.createElement('span');
    element.textContent = String(value ?? '');
    return element.innerHTML;
}

function buildManualPlanDocument() {
    const summary = document.getElementById('consultation-review-summary');
    const advice = document.getElementById('consultation-review-advice');
    const notes = document.getElementById('review-guide-notes')?.value || '';
    if (!summary) return null;
    const manualOnly = new Set(JSON.parse(localStorage.getItem('chakra_consultation_plan') || '{}')?.safety?.sensitivityTypes || []).has('audio')
        || new Set(JSON.parse(localStorage.getItem('chakra_consultation_plan') || '{}')?.safety?.sensitivityTypes || []).has('wording');
    const printStatus = manualOnly ? 'MANUAL GUIDE ONLY' : 'GUIDE REVIEW COPY';
    const logoUrl = new URL('symbols/logo_453x453.png', document.baseURI).href;
    const adviceMarkup = advice && !advice.classList.contains('hidden')
        ? `<section class="manual-plan-alert"><h2>Guide prompts</h2><p>${escapeDocumentText(advice.textContent)}</p></section>`
        : '';
    return `<!doctype html>
<html><head><meta charset="utf-8"><title></title>
<style>
@page { size: A4 portrait; margin: 16mm 15mm 18mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; color: #202329; font-family: "Arial", "Helvetica Neue", Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { padding: 0; }
.manual-plan { width: 100%; max-width: 180mm; margin: 0 auto; }
.manual-plan-header { border-bottom: 2px solid #1f3a5f; padding-bottom: 11px; margin-bottom: 17px; text-align: center; }
.manual-plan-logo { display: block; width: 34mm; height: 34mm; object-fit: contain; margin: 0 auto 8px; }
.manual-plan-header h1 { margin: 0 0 5px; color: #1f3a5f; font-size: 19pt; font-weight: 700; letter-spacing: .01em; }
.manual-plan-header p { margin: 0; color: #4d5968; font-size: 9pt; }
.manual-plan-header .manual-status { display: inline-block; margin-top: 10px; padding: 4px 9px; border: 1px solid #8a3d32; border-radius: 3px; color: #71342c; background: #fbf3f1; font-size: 8.5pt; font-weight: 700; letter-spacing: .04em; }
.manual-plan-section, .manual-plan-alert, .manual-plan-notes { break-inside: avoid; page-break-inside: avoid; margin: 0 0 14px; padding: 12px 13px; border: 1px solid #bfc6cf; border-radius: 3px; }
.manual-plan-section h2, .manual-plan-alert h2, .manual-plan-notes h2 { margin: 0 0 9px; color: #1f3a5f; font-size: 12pt; border-bottom: 1px solid #d3d8de; padding-bottom: 6px; }
.manual-plan-alert { border-color: #b88732; background: #fffaf0; }
.manual-plan-alert p { margin: 0; }
.manual-plan .consultation-summary-row { display: grid; grid-template-columns: minmax(42%, 0.9fr) minmax(0, 1.1fr); gap: 14px; align-items: start; padding: 8px 9px; border-bottom: 1px solid #e3e7eb; border-radius: 3px; }
.manual-plan .consultation-summary-row:nth-of-type(even) { background: #f8fafc; }
.manual-plan .consultation-summary-row:last-child { border-bottom: 0; }
.manual-plan .consultation-summary-row span { color: #667085; font-size: 8.5pt; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.manual-plan .consultation-summary-row strong { max-width: none; color: #202b3c; text-align: left; overflow-wrap: anywhere; }
.manual-plan .consultation-summary-section { margin-top: 16px; padding-top: 11px; border-top: 2px solid #d3d8de; }
.manual-plan .consultation-summary-section h3 { margin: 0 0 8px; color: #1f3a5f; font-size: 10.5pt; letter-spacing: .04em; }
.manual-plan .consultation-summary-section h3::before { content: '◆'; margin-right: 7px; color: #b88732; font-size: 8pt; }
.manual-plan .consultation-summary-detail { margin: 6px 0; padding: 7px 9px; border-left: 3px solid #667f9e; background: #f5f7fa; }
.manual-plan .consultation-summary-detail strong, .manual-plan .consultation-summary-detail span, .manual-plan .consultation-summary-detail em, .manual-plan .consultation-summary-detail small { display: block; }
.manual-plan .consultation-summary-detail em { color: #4d5968; font-size: 9pt; }
.manual-plan .consultation-summary-detail small { margin-top: 3px; white-space: pre-wrap; }
.manual-plan .consultation-chakra-title { color: #1f3a5f; font-size: 11pt; }
.manual-plan .consultation-reflection-answers { display: grid; gap: 5px; margin-top: 7px; }
.manual-plan .consultation-reflection-answer, .manual-plan .consultation-reflection-note { display: grid; gap: 2px; padding: 6px 8px; border-left: 3px solid #8c9db1; background: #ffffff; }
.manual-plan .consultation-reflection-answer span, .manual-plan .consultation-reflection-note b { color: #4d5968; font-size: 8.5pt; font-weight: 400; }
.manual-plan .consultation-reflection-answer strong, .manual-plan .consultation-reflection-note span { max-width: none; color: #202329; font-size: 9.5pt; text-align: left; }
.manual-plan .consultation-reflection-note { margin-top: 6px; border-left-color: #b88732; background: #fffaf0; }
.manual-plan-notes { min-height: 35mm; }
.manual-plan-notes .notes-content { min-height: 20mm; white-space: pre-wrap; }
.manual-plan-footer { margin-top: 18px; padding-top: 7px; border-top: 1px solid #bfc6cf; color: #596575; font-size: 8pt; }
@media print { .manual-plan-section, .manual-plan-alert, .manual-plan-notes { box-shadow: none; } }
</style></head><body><main class="manual-plan">
<header class="manual-plan-header"><img class="manual-plan-logo" src="${escapeDocumentText(logoUrl)}" alt="Chakra Meditation logo"><span class="manual-status">${printStatus}</span></header>
${adviceMarkup}
<section class="manual-plan-section"><h2>Session review</h2>${summary.innerHTML}</section>
<section class="manual-plan-notes"><h2>Guide notes</h2><div class="notes-content">${escapeDocumentText(notes) || 'No additional guide notes recorded.'}</div></section>
</main></body></html>`;
}

function printManualPlan() {
    const documentMarkup = buildManualPlanDocument();
    if (!documentMarkup) return;
    const printFrame = document.createElement('iframe');
    printFrame.className = 'manual-plan-print-frame';
    // Keep the browser from deriving a visible print header title from the
    // iframe. Native date/time headers are still controlled by print-dialog
    // settings and cannot be removed by page JavaScript.
    printFrame.title = '';
    printFrame.style.position = 'fixed';
    printFrame.style.width = '1px';
    printFrame.style.height = '1px';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.opacity = '0';
    printFrame.style.pointerEvents = 'none';
    let hasPrinted = false;
    const print = () => {
        if (hasPrinted) return;
        hasPrinted = true;
        if (printFrame.contentDocument) printFrame.contentDocument.title = '';
        const previousTitle = document.title;
        document.title = '';
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
            document.title = previousTitle;
            printFrame.remove();
        }, 5000);
    };
    printFrame.onload = print;
    document.body.appendChild(printFrame);
    printFrame.srcdoc = documentMarkup;
    setTimeout(print, 400);
}

function attachEventListeners() {
    languageSelect.addEventListener('change', (e) => {
        const previousDefault = defaultIntention(state.language);
        const previousHrimDefault = hrimDefaultIntention(state.language);
        state.language = e.target.value;
        if (!state.intention.trim() || state.intention === previousDefault || state.intention === previousHrimDefault) {
            state.intention = state.highEnergyEnabled
                ? hrimDefaultIntention(state.language)
                : defaultIntention(state.language);
            syncValue('intention-input', state.intention);
        }
        setupVoices();
        autoSelectVoice();
        applyLocaleUI();
    });
    const displayLanguageSelect = document.getElementById('display-language-select');
    if (displayLanguageSelect) {
        displayLanguageSelect.addEventListener('change', (e) => {
            state.displayLanguage = e.target.value;
            localStorage.setItem('chakra_display_language', state.displayLanguage);
            applyLocaleUI();
        });
    }
    voiceSelect.addEventListener('change', (e) => { state.voiceName = e.target.value; });
    testVoiceBtn.addEventListener('click', testVoice);
    document.getElementById('mixer-voice-preview')?.addEventListener('click', testVoice);
    saveConfigBtn.addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('#chakra-selection input:checked')).map(cb => cb.value);
        if (checked.length === 0) { alert("Please select at least one chakra."); return; }
        state.selectedChakras = checked;
        localStorage.setItem('chakra_selected', JSON.stringify(state.selectedChakras));
        localStorage.setItem('chakra_lang', state.language);
        localStorage.setItem('chakra_display_language', state.displayLanguage);
        state.voiceName = voiceSelect.value;
        localStorage.setItem('chakra_voice', state.voiceName);
        state.audioFilters = getChecked('audio-filters-toggle');
        state.reverseJourney = getChecked('reverse-journey-toggle');
        state.boxMeditation = getChecked('box-meditation-toggle');
        state.hooponopono = getChecked('hooponopono-toggle');
        state.chakraFrequencies = getChecked('frequencies-toggle');
        state.eyesCloseMode = getChecked('eyes-close-mode-toggle');
        state.corpsePoseEnabled = getChecked('corpse-pose-toggle');
        state.yogaBridgeEnabled = getChecked('yoga-bridge-toggle');
        state.bathSessionEnabled = getChecked('bath-session-toggle');
        state.perinealCareEnabled = getChecked('perineal-care-toggle');
        state.assistedBathingEnabled = getChecked('assisted-bathing-toggle');
        state.massageEnabled = getChecked('massage-toggle');
        state.selectedYogaPoses = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(cb => cb.value);
        if (state.yogaBridgeEnabled && state.selectedYogaPoses.length === 0) {
            alert("Please select at least one yoga pose or disable Yoga Bridge.");
            return;
        }
        const selectedDeity = document.querySelector('input[name="deity-path"]:checked');
        state.deityPath = selectedDeity ? selectedDeity.value : 'none';
        
        localStorage.setItem('chakra_audio_filters', state.audioFilters);
        localStorage.setItem('chakra_reverse_journey', state.reverseJourney);
        localStorage.setItem('chakra_box_meditation', state.boxMeditation);
        localStorage.setItem('chakra_hooponopono', state.hooponopono);
        localStorage.setItem('chakra_frequencies', state.chakraFrequencies);
        localStorage.setItem('chakra_deity_path', state.deityPath);
        localStorage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
        localStorage.setItem('chakra_corpse_enabled', state.corpsePoseEnabled);
        localStorage.setItem('chakra_yoga_bridge', state.yogaBridgeEnabled);
        localStorage.setItem('chakra_bath_enabled', state.bathSessionEnabled);
        localStorage.setItem('chakra_perineal_care', state.perinealCareEnabled);
        localStorage.setItem('chakra_assisted_bathing', state.assistedBathingEnabled);
        localStorage.setItem('chakra_massage', state.massageEnabled);
        localStorage.setItem('chakra_yoga_selected', JSON.stringify(state.selectedYogaPoses));
        localStorage.setItem('chakra_script_source', state.scriptSource);

        if (audio.toggleEyesCloseMode) audio.toggleEyesCloseMode(state.eyesCloseMode);
        document.body.classList.toggle('eyes-close-mode', state.eyesCloseMode);
        localStorage.setItem('chakra_configured', 'true');
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
        aura.style.opacity = '1';
    });

    // Dynamic Setting Visibility
    function updateTimingRowVisibility() {
        const boxEnabled = getChecked('box-meditation-toggle');
        const yogaEnabled = getChecked('yoga-bridge-toggle');
        const corpseToggle = document.getElementById('corpse-pose-toggle');
        if (!yogaEnabled && corpseToggle) corpseToggle.checked = false;
        const corpseEnabled = getChecked('corpse-pose-toggle');
        const bathEnabled = getChecked('bath-session-toggle');
        const perinealEnabled = getChecked('perineal-care-toggle');
        const assistedEnabled = getChecked('assisted-bathing-toggle');
        const massageEnabled = getChecked('massage-toggle');

        const toggleDisplay = (id, show) => {
            const el = document.getElementById(id);
            if (!el) return;
            // Let the component's CSS choose its layout when visible. This is
            // important for enhanced range rows, which use grid rather than flex.
            el.style.display = show ? '' : 'none';
        };

        // Bath Session only exists inside the Yoga Bridge. Clear stale state
        // when Yoga Bridge is switched off and make the dependency explicit.
        const bathToggle = document.getElementById('bath-session-toggle');
        if (bathToggle) {
            if (!yogaEnabled) bathToggle.checked = false;
            bathToggle.disabled = !yogaEnabled;
            bathToggle.setAttribute('aria-disabled', String(!yogaEnabled));
        }
        const addonToggles = ['perineal-care-toggle', 'assisted-bathing-toggle', 'massage-toggle'];
        addonToggles.forEach(id => {
            const toggle = document.getElementById(id);
            if (!toggle) return;
            if (!yogaEnabled || !bathEnabled) toggle.checked = false;
            toggle.disabled = !yogaEnabled || !bathEnabled;
            toggle.setAttribute('aria-disabled', String(toggle.disabled));
        });

        toggleDisplay('row-breathing', boxEnabled);
        toggleDisplay('row-corpse', corpseEnabled);
        toggleDisplay('row-yoga-prep', yogaEnabled);
        toggleDisplay('row-yoga-pose', yogaEnabled);
        toggleDisplay('row-bath', yogaEnabled && bathEnabled && !assistedEnabled);
        toggleDisplay('row-perineal-care', yogaEnabled && bathEnabled && perinealEnabled);
        toggleDisplay('row-assisted-bathing', yogaEnabled && bathEnabled && assistedEnabled);
        toggleDisplay('row-massage', yogaEnabled && bathEnabled && massageEnabled);
        
        const yogaSubOptions = document.getElementById('yoga-sub-options');
        if (yogaSubOptions) {
            yogaSubOptions.style.display = yogaEnabled ? 'flex' : 'none';
        }
    }

    // Master Toggle Logic
    const musicOnlyToggle = document.getElementById('music-only-toggle');
    const yogaBridgeToggle = document.getElementById('yoga-bridge-toggle');
    const reverseJourneyToggle = document.getElementById('reverse-journey-toggle');
    const boxMeditationToggle = document.getElementById('box-meditation-toggle');
    const hooponoponoToggle = document.getElementById('hooponopono-toggle');
    const corpsePoseToggle = document.getElementById('corpse-pose-toggle');
    const highEnergyToggle = document.getElementById('high-energy-toggle');

    function clearHighEnergyMode() {
        if (!highEnergyToggle) return;
        highEnergyToggle.checked = false;
        state.highEnergyEnabled = false;
        localStorage.setItem('chakra_high_energy', 'false');
    }

    function clearMusicOnlyMode() {
        if (!musicOnlyToggle) return;
        musicOnlyToggle.checked = false;
        state.bgMusicMode = false;
        localStorage.setItem('chakra_bg_music_mode', 'false');
    }

    function enforceMasterToggle(target) {
        if (target === musicOnlyToggle && musicOnlyToggle.checked) {
            // Disable other journey features
            if (yogaBridgeToggle) yogaBridgeToggle.checked = false;
            if (reverseJourneyToggle) reverseJourneyToggle.checked = false;
            if (boxMeditationToggle) boxMeditationToggle.checked = false;
            if (hooponoponoToggle) hooponoponoToggle.checked = false;
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearHighEnergyMode();
        } else if (target !== musicOnlyToggle && target.checked) {
            // Disable Music Only if any other journey feature is enabled.
            clearMusicOnlyMode();
        }

        // Mutual Exclusivity: Yoga Bridge & Reverse Journey
        if (target === yogaBridgeToggle && yogaBridgeToggle.checked) {
            if (reverseJourneyToggle) reverseJourneyToggle.checked = false;
            clearHighEnergyMode();
        } else if (target === reverseJourneyToggle && reverseJourneyToggle.checked) {
            if (yogaBridgeToggle) yogaBridgeToggle.checked = false;
        }

        if (target === highEnergyToggle && highEnergyToggle.checked) {
            clearMusicOnlyMode();
            if (yogaBridgeToggle) yogaBridgeToggle.checked = false;
        }

        updateTimingRowVisibility();
        updateExperienceModeVisibility();
        if (isGeneratedIntention(state.intention)) {
            state.intention = state.highEnergyEnabled
                ? hrimDefaultIntention(state.language)
                : defaultIntention(state.language);
            syncValue('intention-input', state.intention);
            localStorage.setItem('chakra_intention', state.intention);
        }
        updateSessionEstimate();
    }

    // Event Listeners for Toggles
    document.getElementById('box-meditation-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('corpse-pose-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('yoga-bridge-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('bath-session-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('bath-session-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('perineal-care-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('perineal-care-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('assisted-bathing-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('assisted-bathing-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('massage-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('massage-toggle').addEventListener('change', updateSessionEstimate);
    if (musicOnlyToggle) {
        musicOnlyToggle.addEventListener('change', (e) => {
            state.bgMusicMode = e.target.checked;
            localStorage.setItem('chakra_bg_music_mode', state.bgMusicMode);
            enforceMasterToggle(e.target);
            updateExperienceModeVisibility();
            updateSessionEstimate();
        });
    }

    if (yogaBridgeToggle) {
        yogaBridgeToggle.addEventListener('change', (e) => {
            enforceMasterToggle(e.target);
            const selection = document.getElementById('yoga-pose-selection');
            if (selection) selection.style.display = e.target.checked ? 'flex' : 'none';
        });
    }

    if (highEnergyToggle) {
        highEnergyToggle.addEventListener('change', (e) => {
            state.highEnergyEnabled = e.target.checked;
            localStorage.setItem('chakra_high_energy', state.highEnergyEnabled);
            enforceMasterToggle(e.target);
            updateExperienceModeVisibility();
        });
    }

    [reverseJourneyToggle, boxMeditationToggle, hooponoponoToggle, corpsePoseToggle].forEach(toggle => {
        if (toggle) toggle.addEventListener('change', (e) => enforceMasterToggle(e.target));
    });
    
    function updateExperienceModeVisibility() {
        const highEnergy = getChecked('high-energy-toggle');
        const normalDuration = document.getElementById('time-per-chakra')?.closest('.time-selector');
        const highEnergyDuration = document.getElementById('high-energy-duration-control');
        if (normalDuration) normalDuration.style.display = highEnergy ? 'none' : 'flex';
        if (highEnergyDuration) highEnergyDuration.style.display = highEnergy ? 'flex' : 'none';
    }

    // Initial call
    updateTimingRowVisibility();
    updateExperienceModeVisibility();
    if (isGeneratedIntention(state.intention)) {
        state.intention = state.highEnergyEnabled
            ? hrimDefaultIntention(state.language)
            : defaultIntention(state.language);
        syncValue('intention-input', state.intention);
        localStorage.setItem('chakra_intention', state.intention);
    }

    function updateSessionEstimate() {
        if (getChecked('music-only-toggle')) {
            setText('session-estimate', 'Music only — stop anytime');
            updateJourneyRoadmap();
            return;
        }
        const isHigh = getChecked('high-energy-toggle');
        const hasBox = getChecked('box-meditation-toggle');
        const hasHooponopono = getChecked('hooponopono-toggle');
        const hasYoga = getChecked('yoga-bridge-toggle');
        const hasBath = hasYoga && getChecked('bath-session-toggle');
        const hasPerineal = hasBath && getChecked('perineal-care-toggle');
        const hasAssisted = hasBath && getChecked('assisted-bathing-toggle');
        const hasMassage = hasBath && getChecked('massage-toggle');
        const hasCorpse = getChecked('corpse-pose-toggle');
        
        let overhead = timing('estimate', 'baseOverhead');
        if (hasBox) overhead += timing('estimate', 'boxBreathingOverhead');
        if (hasHooponopono) overhead += timing('estimate', 'hooponoponoOverhead');
        
        const corpseTime = hasCorpse ? (state.timeCorpse / 60) : 0;
        
        if (hasYoga) {
            const yogaSelected = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(cb => cb.value);
            overhead += (state.timeYogaPrep / 60) + (yogaSelected.length * (state.timeYogaPose + timing('estimate', 'yogaPoseTransitionEstimate')) / 60);
            if (hasBath) {
                if (hasMassage) overhead += state.timeMassage / 60;
                if (hasPerineal) overhead += state.timePerinealCare / 60;
                if (hasAssisted) overhead += state.timeAssistedBathing / 60;
                else overhead += state.timeBath / 60;
            }
        }

        const estimate = isHigh
            ? Math.round(state.timeHighEnergy + (state.timeIcebreaker / 60) + timing('estimate', 'highEnergyExtra'))
            : Math.round(state.selectedChakras.length * (state.timePerChakra + timing('estimate', 'chakraStageOverhead')) + (state.timeIcebreaker / 60) + corpseTime + overhead + timing('estimate', 'normalExtra'));
        setText('session-estimate', `~ ${estimate} min session`);
        updateJourneyRoadmap();
    }

    // Consultation approval runs outside attachEventListeners after consent.
    // Publish the estimator so that transition can refresh the Lobby safely.
    globalThis.updateSessionEstimate = updateSessionEstimate;

    // Timing Sliders Listeners
    document.getElementById('time-icebreaker').addEventListener('input', (e) => {
        state.timeIcebreaker = parseInt(e.target.value);
        setText('display-icebreaker', state.timeIcebreaker + 's');
        localStorage.setItem('chakra_time_icebreaker', state.timeIcebreaker);
        updateSessionEstimate();
    });
    document.getElementById('time-breathing').addEventListener('input', (e) => {
        state.timeBreathing = parseInt(e.target.value);
        setText('display-breathing', state.timeBreathing + 's');
        localStorage.setItem('chakra_time_breathing', state.timeBreathing);
        updateSessionEstimate();
    });
    document.getElementById('time-corpse').addEventListener('input', (e) => {
        state.timeCorpse = parseInt(e.target.value);
        setText('display-corpse', state.timeCorpse + 's');
        localStorage.setItem('chakra_time_corpse', state.timeCorpse);
        updateSessionEstimate();
    });
    document.getElementById('time-interval').addEventListener('input', (e) => {
        state.timeInterval = parseInt(e.target.value);
        setText('display-interval', state.timeInterval + 's');
        localStorage.setItem('chakra_time_interval', state.timeInterval);
        updateSessionEstimate();
    });
    document.getElementById('time-yoga-prep').addEventListener('input', (e) => {
        state.timeYogaPrep = parseInt(e.target.value);
        setText('display-yoga-prep', state.timeYogaPrep + 's');
        localStorage.setItem('chakra_time_yoga_prep', state.timeYogaPrep);
        updateSessionEstimate();
    });
    document.getElementById('time-yoga-pose').addEventListener('input', (e) => {
        state.timeYogaPose = parseInt(e.target.value);
        setText('display-yoga-pose', state.timeYogaPose + 's');
        localStorage.setItem('chakra_time_yoga_pose', state.timeYogaPose);
        updateSessionEstimate();
    });

    // Script Selection Event Listeners
    const scriptSourceSelect = document.getElementById('script-source-select');
    const customScriptUI = document.getElementById('custom-script-ui');
    const uploadInput = document.getElementById('upload-script-file');
    const urlInput = document.getElementById('script-url-input');
    const loadUrlBtn = document.getElementById('load-script-url');
    const scriptStatus = document.getElementById('script-status');

    if (scriptSourceSelect) {
        scriptSourceSelect.addEventListener('change', (e) => {
            state.scriptSource = e.target.value;
            if (customScriptUI) customScriptUI.style.display = state.scriptSource === 'custom' ? 'flex' : 'none';
            localStorage.setItem('chakra_script_source', state.scriptSource);
            // Clear cached scripts to force reload if switching
            meditation.scripts = null;
        });
    }

    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    const check = validateScriptBundle(json, {
                        highEnergy: getChecked('high-energy-toggle'),
                        corpse: getChecked('corpse-pose-toggle'),
                        bath: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && !getChecked('assisted-bathing-toggle'),
                        perinealCare: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && getChecked('perineal-care-toggle'),
                        assistedBathing: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && getChecked('assisted-bathing-toggle'),
                        massage: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && getChecked('massage-toggle'),
                        yoga: getChecked('yoga-bridge-toggle'),
                        hooponopono: getChecked('hooponopono-toggle')
                    });
                    if (!check.valid) throw new Error(`Missing required sections: ${check.missing.slice(0, 3).join(', ')}`);
                    state.customScript = json;
                    localStorage.setItem('chakra_custom_script', JSON.stringify(json));
                    if (scriptStatus) {
                        scriptStatus.textContent = "Script uploaded successfully!";
                        scriptStatus.style.display = 'block';
                        scriptStatus.style.background = 'rgba(74, 222, 128, 0.2)';
                        scriptStatus.style.color = '#4ade80';
                    }
                    meditation.scripts = null;
                } catch (err) {
                    if (scriptStatus) {
                        scriptStatus.textContent = "Error: Invalid JSON file.";
                        scriptStatus.style.display = 'block';
                        scriptStatus.style.background = 'rgba(248, 113, 113, 0.2)';
                        scriptStatus.style.color = '#f87171';
                    }
                }
            };
            reader.readAsText(file);
        });
    }

    if (loadUrlBtn) {
        loadUrlBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();
            if (!url) return;

            if (scriptStatus) {
                scriptStatus.textContent = "Loading script from URL...";
                scriptStatus.style.display = 'block';
                scriptStatus.style.background = 'rgba(255, 255, 255, 0.1)';
                scriptStatus.style.color = 'white';
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const json = await response.json();
                const check = validateScriptBundle(json, {
                    highEnergy: getChecked('high-energy-toggle'),
                    corpse: getChecked('corpse-pose-toggle'),
                    bath: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && !getChecked('assisted-bathing-toggle'),
                    perinealCare: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && getChecked('perineal-care-toggle'),
                    assistedBathing: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && getChecked('assisted-bathing-toggle'),
                    massage: getChecked('yoga-bridge-toggle') && getChecked('bath-session-toggle') && getChecked('massage-toggle'),
                    yoga: getChecked('yoga-bridge-toggle'),
                    hooponopono: getChecked('hooponopono-toggle')
                });
                if (!check.valid) throw new Error(`Missing required sections: ${check.missing.slice(0, 3).join(', ')}`);
                state.customScript = json;
                localStorage.setItem('chakra_custom_script', JSON.stringify(json));
                if (scriptStatus) {
                    scriptStatus.textContent = "Script loaded from URL successfully!";
                    scriptStatus.style.background = 'rgba(74, 222, 128, 0.2)';
                    scriptStatus.style.color = '#4ade80';
                }
                meditation.scripts = null;
            } catch (err) {
                if (scriptStatus) {
                    scriptStatus.textContent = `Error: ${err.message}`;
                    scriptStatus.style.background = 'rgba(248, 113, 113, 0.2)';
                    scriptStatus.style.color = '#f87171';
                }
            }
        });
    }

    document.getElementById('time-bath').addEventListener('input', (e) => {
        state.timeBath = parseInt(e.target.value);
        setText('display-bath', Math.floor(state.timeBath / 60) + 'm');
        localStorage.setItem('chakra_time_bath', state.timeBath);
        updateSessionEstimate();
    });

    document.getElementById('time-perineal-care').addEventListener('input', (e) => {
        state.timePerinealCare = parseInt(e.target.value);
        setText('display-perineal-care', Math.floor(state.timePerinealCare / 60) + 'm');
        localStorage.setItem('chakra_time_perineal_care', state.timePerinealCare);
        updateSessionEstimate();
    });

    document.getElementById('time-assisted-bathing').addEventListener('input', (e) => {
        state.timeAssistedBathing = parseInt(e.target.value);
        setText('display-assisted-bathing', Math.floor(state.timeAssistedBathing / 60) + 'm');
        localStorage.setItem('chakra_time_assisted_bathing', state.timeAssistedBathing);
        updateSessionEstimate();
    });

    document.getElementById('time-massage').addEventListener('input', (e) => {
        state.timeMassage = parseInt(e.target.value);
        setText('display-massage', Math.floor(state.timeMassage / 60) + 'm');
        localStorage.setItem('chakra_time_massage', state.timeMassage);
        updateSessionEstimate();
    });

    timeSlider.addEventListener('input', (e) => {
        state.timePerChakra = parseFloat(e.target.value);
        timeDisplay.textContent = `${state.timePerChakra.toFixed(1)} mins`;
        localStorage.setItem('chakra_time', state.timePerChakra);
        const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
        e.target.style.setProperty('--range-fill', pct);
        updateSessionEstimate();
    });

    const highEnergyTimeSlider = document.getElementById('time-high-energy');
    if (highEnergyTimeSlider) {
        highEnergyTimeSlider.addEventListener('input', (e) => {
            state.timeHighEnergy = parseFloat(e.target.value);
            setText('high-energy-time-display', `${state.timeHighEnergy} mins`);
            localStorage.setItem('chakra_time_high_energy', state.timeHighEnergy);
            const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
            e.target.style.setProperty('--range-fill', pct);
            updateSessionEstimate();
        });
    }

    document.getElementById('high-energy-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('box-meditation-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('hooponopono-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('reverse-journey-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('frequencies-toggle').addEventListener('change', (e) => {
        syncChecked('mixer-frequencies-toggle', e.target.checked);
        updateSessionEstimate();
    });
    document.getElementById('yoga-bridge-toggle').addEventListener('change', updateSessionEstimate);
    document.querySelectorAll('#yoga-pose-selection input').forEach(cb => {
        cb.addEventListener('change', updateSessionEstimate);
    });
    document.querySelectorAll('input[name="chakraFocus"]').forEach(cb => {
        cb.addEventListener('change', updateConsultationChakraQuestions);
    });
    updateConsultationChakraQuestions();
    openSettingsBtn.addEventListener('click', () => showScreen(configScreen));
    beginConsultationBtn?.addEventListener('click', () => {
        showScreen(consultationScreen);
        syncValue('consultation-language', state.language);
        document.getElementById('consultation-name')?.focus();
    });
    document.getElementById('cancel-consultation')?.addEventListener('click', () => showScreen(lobbyScreen));
    document.getElementById('edit-consultation')?.addEventListener('click', () => showScreen(consultationScreen));
    document.getElementById('consultation-yoga-enabled')?.addEventListener('change', updateConsultationCareVisibility);
    document.getElementById('consultation-bath-enabled')?.addEventListener('change', updateConsultationCareVisibility);
    document.getElementById('consultation-touch')?.addEventListener('change', updateConsultationCareVisibility);
    document.getElementById('consultation-citizenship')?.addEventListener('change', updateConsultationCountryPrefix);
    document.getElementById('consultation-contact')?.addEventListener('input', markConsultationPhoneEdited);
    document.getElementById('consultation-emergency-phone')?.addEventListener('input', markConsultationPhoneEdited);
    ['consultation-physical', 'consultation-medication', 'consultation-pregnancy', 'consultation-stimulation'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateConsultationSafetyVisibility);
    });
    document.getElementById('consultation-sleep')?.addEventListener('change', (event) => {
        const savasana = document.getElementById('consultation-corpse');
        const duration = document.getElementById('consultation-corpse-time');
        const note = document.getElementById('consultation-savasana-sleep-note');
        if (!savasana || !duration) return;
        if (event.target.value === 'needed') {
            savasana.checked = true;
            duration.value = '3600';
            savasana.dataset.sleepDerived = 'true';
            note?.classList.remove('hidden');
        } else if (savasana.dataset.sleepDerived === 'true') {
            savasana.checked = false;
            duration.value = '300';
            delete savasana.dataset.sleepDerived;
            note?.classList.add('hidden');
        }
    });
    document.getElementById('consultation-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!validateConsultationContactFields(form)) return;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const countryOption = document.getElementById('consultation-citizenship')?.selectedOptions[0];
        const citizenshipName = countryOption?.textContent?.trim() || data.citizenship;
        const focusChakras = formData.getAll('chakraFocus');
        const chakraResponses = Object.fromEntries(focusChakras.map(key => [key, {
            answers: [1, 2, 3].map(index => String(formData.get(`chakraAnswer_${key}_${index}`) || 'prefer-not')),
            attention: String(formData.get(`chakraNeed_${key}`) || 'standard'),
            note: String(formData.get(`chakraNote_${key}`) || '').trim()
        }]));
        const sensitivityTypes = formData.getAll('sensitivityType');
        const pregnancyRestricted = data.pregnancy === 'yes';
        const yogaBridgeEnabled = data.yogaBridge === 'yes';
        const bathSessionEnabled = yogaBridgeEnabled && data.bathSession === 'yes';
        const touchAllowsCare = data.touch !== 'no';
        const assistedBathingEnabled = bathSessionEnabled && touchAllowsCare && data.assistedBathing === 'yes';
        const perinealCareEnabled = bathSessionEnabled && touchAllowsCare && data.perinealCare === 'yes';
        const massageEnabled = bathSessionEnabled && touchAllowsCare && data.massage === 'yes';
        const selectedYogaPoses = yogaBridgeEnabled ? formData.getAll('yogaPose') : [];
        if (yogaBridgeEnabled && selectedYogaPoses.length === 0 && !pregnancyRestricted) {
            alert(t('ui.consultationYogaPoseRequired'));
            document.querySelector('#consultation-yoga-options input[name="yogaPose"]')?.focus();
            return;
        }
        const careSummary = [
            massageEnabled ? t('ui.massage') : '',
            perinealCareEnabled ? t('ui.perinealCare') : '',
            assistedBathingEnabled ? t('ui.assistedBathing') : (bathSessionEnabled ? t('ui.bathSession') : '')
        ].filter(Boolean).join(', ');
        const safetyFlags = ['physical', 'medication', 'pregnancy', 'stimulation']
            .filter(key => data[key] && data[key] !== 'no');
        const sensitivityNote = String(data.sensitivities || '').trim();
        if (sensitivityTypes.length || (sensitivityNote && sensitivityNote.toLowerCase() !== 'none')) safetyFlags.push('sensitivities');
        const sessionPlan = {
            schemaVersion: 1,
            status: 'draft',
            participantCount: 1,
            createdAt: new Date().toISOString(),
            source: 'lobby-consultation',
            profile: { name: data.name, citizenship: citizenshipName, citizenshipCode: data.citizenship, contactNumber: String(data.contactNumber || '').trim(), email: String(data.email || '').trim(), experience: data.experience },
            preferences: {
                tone: data.tone, voiceGender: data.voiceGender || 'guide', readiness: data.readiness, sleepMode: data.sleepMode, hooponopono: data.hooponopono === 'yes',
                reverseJourneyNeed: data.reverseJourneyNeed || 'grounded',
                yogaBridgeEnabled, corpsePoseEnabled: yogaBridgeEnabled && data.corpsePose === 'yes', bathSessionEnabled,
                perinealCareEnabled, assistedBathingEnabled, massageEnabled, selectedYogaPoses, careSummary
            },
            language: data.meditationLanguage || state.language,
            durations: {
                yogaPrep: Number(data.yogaPrep) || state.timeYogaPrep, yogaPose: Number(data.yogaPoseTime) || state.timeYogaPose,
                corpse: Number(data.corpseTime) || state.timeCorpse, bath: Number(data.bathTime) || state.timeBath,
                perinealCare: Number(data.perinealTime) || state.timePerinealCare, assistedBathing: Number(data.assistedTime) || state.timeAssistedBathing,
                massage: Number(data.massageTime) || state.timeMassage
            },
            safety: { sensitivities: data.sensitivities, sensitivityTypes, touch: data.touch },
            safetyReview: {
                emergencyContact: { name: data.emergencyName || '', phone: getConsultationPhoneValue('consultation-emergency-phone') },
                physical: data.physical, physicalDetails: data.physicalDetails || '',
                medication: data.medication, medicationDetails: data.medicationDetails || '',
                pregnancy: data.pregnancy,
                stimulation: data.stimulation, stimulationDetails: data.stimulationDetails || '',
                requiresGuideReview: safetyFlags.length > 0,
                flags: safetyFlags
            },
            goal: data.goal,
            chakraFocus: focusChakras,
            chakraResponses,
            chakraDurations: buildAdaptiveChakraDurations(state.selectedChakras, focusChakras, chakraResponses)
        };
        localStorage.setItem('chakra_consultation_plan', JSON.stringify(sessionPlan));
        renderConsultationReview(sessionPlan);
        showScreen(consultationReviewScreen);
    });
    document.getElementById('approve-consultation')?.addEventListener('click', async () => {
        const stored = localStorage.getItem('chakra_consultation_plan');
        if (!stored) return showScreen(consultationScreen);
        const sessionPlan = JSON.parse(stored);
        if (sessionPlan.safetyReview?.requiresGuideReview && !getChecked('review-safety-confirm')) {
            alert(t('ui.consultationSafetyConfirmRequired'));
            return;
        }
        const sensitivityTypes = new Set(sessionPlan.safety?.sensitivityTypes || []);
        const manualOnly = sensitivityTypes.has('audio') || sensitivityTypes.has('wording');
        if (manualOnly && !getChecked('review-manual-only')) {
            alert(t('ui.consultationManualOnlyRequired'));
            return;
        }
        sessionPlan.guideReview = {
            ...(sessionPlan.guideReview || {}),
            notes: String(document.getElementById('review-guide-notes')?.value || '').trim(),
            reviewedAt: new Date().toISOString()
        };
        sessionPlan.approvedSettings = {
            ...(sessionPlan.approvedSettings || {}),
            audioFilters: getChecked('review-audio-filters'),
            hooponopono: getChecked('review-hooponopono'),
            reverseJourney: getChecked('review-reverse-journey')
        };
        if (sensitivityTypes.has('movement')) {
            sessionPlan.preferences.yogaBridgeEnabled = false;
            sessionPlan.preferences.corpsePoseEnabled = false;
            sessionPlan.preferences.bathSessionEnabled = false;
            sessionPlan.preferences.massageEnabled = false;
            sessionPlan.preferences.perinealCareEnabled = false;
            sessionPlan.preferences.assistedBathingEnabled = false;
            sessionPlan.preferences.selectedYogaPoses = [];
            sessionPlan.approvedSettings.movementStages = 'removed-by-guide-review';
        }
        if (manualOnly) {
            sessionPlan.status = 'manual-guide-required';
            sessionPlan.sessionRoute = 'manual-guide';
            sessionPlan.approvedAt = new Date().toISOString();
            localStorage.setItem('chakra_consultation_plan', JSON.stringify(sessionPlan));
            alert(t('ui.consultationManualOnlySaved'));
            return;
        }
        sessionPlan.status = 'guide-approved';
        sessionPlan.approvedAt = new Date().toISOString();
        localStorage.setItem('chakra_consultation_plan', JSON.stringify(sessionPlan));
        renderConsentPrompt(sessionPlan);
        resetConsultationRecording();
        showScreen(consultationConsentScreen);
        showConsentReviewStage();
        updateConsentScrollSpeed();
        prepareConsentCameraPreview();
    });
    document.getElementById('consent-continue-to-recording')?.addEventListener('click', enterConsentTeleprompter);
    document.getElementById('consent-review-cancel')?.addEventListener('click', () => {
        resetConsultationRecording();
        stopConsentCameraPreview();
        showScreen(lobbyScreen);
    });
    document.getElementById('consent-scroll-speed')?.addEventListener('input', updateConsentScrollSpeed);
    document.getElementById('review-print')?.addEventListener('click', printManualPlan);
    document.getElementById('save-manual-plan')?.addEventListener('click', () => document.getElementById('approve-consultation')?.click());
    document.getElementById('return-manual-lobby')?.addEventListener('click', () => {
        const stored = localStorage.getItem('chakra_consultation_plan');
        const plan = stored ? JSON.parse(stored) : null;
        if (plan?.status !== 'manual-guide-required') {
            alert(t('ui.consultationSaveManualFirst'));
            return;
        }
        showScreen(lobbyScreen);
    });
    document.getElementById('consent-record')?.addEventListener('click', handleConsentRecordAction);
    document.getElementById('consent-pause')?.addEventListener('click', () => {
        if (!consultationRecorder) return;
        if (consultationRecorder.state === 'recording') {
            consultationRecorder.pause();
            consultationRecordingPausedAt = performance.now();
            stopConsentPromptLead(true);
            stopConsentPromptAutoScroll();
            setConsentRecordingState('paused');
        } else if (consultationRecorder.state === 'paused') {
            consultationRecorder.resume();
            if (consultationRecordingPausedAt) {
                consultationRecordingPausedDuration += performance.now() - consultationRecordingPausedAt;
                consultationRecordingPausedAt = 0;
            }
            if (consentPromptLeadRemaining > 0) startConsentPromptWithLead();
            else {
                startConsentPromptAutoScroll();
                setConsentRecordingState('recording');
            }
        }
    });
    document.getElementById('consent-stop')?.addEventListener('click', () => {
        if (consultationRecorder && consultationRecorder.state !== 'inactive') {
            consultationRecordingEndedAt = new Date();
            stopConsentCompositeFrame();
            stopConsentPromptLead();
            stopConsentPromptAutoScroll();
            drawConsentComposite();
            consultationStopTimer = setTimeout(() => {
                consultationStopTimer = null;
                if (consultationRecorder && consultationRecorder.state !== 'inactive') consultationRecorder.stop();
            }, 500);
        }
    });
    document.getElementById('consent-retry')?.addEventListener('click', () => {
        resetConsultationRecording();
        enterConsentTeleprompter();
    });
    document.getElementById('consent-cancel')?.addEventListener('click', () => {
        resetConsultationRecording();
        stopConsentCameraPreview();
        showScreen(lobbyScreen);
    });
    document.getElementById('consent-submit')?.addEventListener('click', () => {
        if (!consultationRecordingBlob) return;
        if (consultationRecordingBlob.size > 25 * 1024 * 1024) {
            alert('This recording is larger than Gmail’s 25 MB attachment limit. Please retry with a shorter recording.');
            return;
        }
        const stored = localStorage.getItem('chakra_consultation_plan');
        if (!stored) return showScreen(consultationScreen);
        const sessionPlan = JSON.parse(stored);
        sessionPlan.status = 'consent-recorded';
        sessionPlan.consent = {
            recordedAt: new Date().toISOString(),
            recordingStartedAt: consultationRecordingStartedAt?.toISOString() || null,
            recordingEndedAt: consultationRecordingEndedAt?.toISOString() || null,
            location: consultationLocation,
            consentVersion: 1,
            recordingType: consultationRecordingBlob.type,
            recordingBytes: consultationRecordingBlob.size,
            composition: 'session-plan-then-spoken-consent-v2',
            planPageCount: consultationPlanPages.length,
            planPageDurationMs: consentTiming('planPageMs', 5000),
            planAudio: 'silent',
            videoFormat: '1280x720-landscape-16:9',
            planDesign: 'luxury-document',
            consentCameraLayout: 'luxury-document-evidence-with-circular-camera',
            consentStartMode: 'manual-after-plan-pages',
            teleprompterLeadMs: consentTiming('readingLeadMs', 7000),
            liveWallClock: true,
            storage: 'memory-only-prototype'
        };
        applyApprovedConsultationPlan(sessionPlan);
        localStorage.setItem('chakra_consultation_plan', JSON.stringify(sessionPlan));
        stopConsentCameraPreview();
        showScreen(lobbyScreen);
    });

    const settingsHelpModal = document.getElementById('settings-help-modal');
    const settingsHelpButton = document.getElementById('settings-help-button');
    const settingsHelpClose = document.getElementById('settings-help-close');
    if (settingsHelpModal && settingsHelpButton && settingsHelpClose) {
        settingsHelpButton.addEventListener('click', () => {
            settingsHelpModal.classList.remove('hidden');
            settingsHelpClose.focus();
        });
        settingsHelpClose.addEventListener('click', () => settingsHelpModal.classList.add('hidden'));
    }

    // Brightness slider
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            state.brightness = parseFloat(e.target.value);
            localStorage.setItem('chakra_brightness', state.brightness);
            document.getElementById('app').style.opacity = state.brightness;
        });
    }

    function chooseSleepModeForJourney() {
        const isEvening = new Date().getHours() >= 18;
        const prompt = document.getElementById('sleep-mode-prompt');
        const enable = document.getElementById('sleep-mode-enable');
        const disable = document.getElementById('sleep-mode-disable');
        const close = document.getElementById('sleep-mode-prompt-close');

        if (!isEvening || !prompt || !enable || !disable || !close) {
            state.sleepMode = false;
            return Promise.resolve(!isEvening ? false : null);
        }

        prompt.classList.remove('hidden');
        enable.focus();
        return new Promise(resolve => {
            const finish = enabled => {
                enable.removeEventListener('click', enableSleep);
                disable.removeEventListener('click', disableSleep);
                close.removeEventListener('click', closePrompt);
                prompt.classList.add('hidden');
                state.sleepMode = enabled === true;
                resolve(enabled);
            };
            const enableSleep = () => finish(true);
            const disableSleep = () => finish(false);
            const closePrompt = () => finish(null);
            enable.addEventListener('click', enableSleep);
            disable.addEventListener('click', disableSleep);
            close.addEventListener('click', closePrompt);
        });
    }

    function isHighEnergyTimeAllowed() {
        const now = new Date();
        const minutes = (now.getHours() * 60) + now.getMinutes();
        return minutes >= (3 * 60 + 30) && minutes < (12 * 60);
    }

    function confirmHighEnergyTime() {
        if (!getChecked('high-energy-toggle') || isHighEnergyTimeAllowed()) return Promise.resolve(true);

        const modal = document.getElementById('hrim-time-block-modal');
        const close = document.getElementById('hrim-time-block-close');
        const lobby = document.getElementById('hrim-time-block-lobby');
        const regular = document.getElementById('hrim-time-block-regular');
        if (!modal || !close || !lobby || !regular) return Promise.resolve(false);

        modal.classList.remove('hidden');
        lobby.focus();
        return new Promise(resolve => {
            const finish = continueJourney => {
                close.removeEventListener('click', returnToLobby);
                lobby.removeEventListener('click', returnToLobby);
                regular.removeEventListener('click', continueRegular);
                modal.classList.add('hidden');
                if (continueJourney) {
                    const highEnergyToggle = document.getElementById('high-energy-toggle');
                    if (highEnergyToggle) highEnergyToggle.checked = false;
                    state.highEnergyEnabled = false;
                    localStorage.setItem('chakra_high_energy', 'false');
                }
                resolve(continueJourney);
            };
            const returnToLobby = () => finish(false);
            const continueRegular = () => finish(true);
            close.addEventListener('click', returnToLobby);
            lobby.addEventListener('click', returnToLobby);
            regular.addEventListener('click', continueRegular);
        });
    }

    startMeditationBtn.addEventListener('click', async () => {
        const consultationPlan = JSON.parse(localStorage.getItem('chakra_consultation_plan') || 'null');
        if (consultationPlan?.status === 'manual-guide-required') {
            alert(t('ui.consultationManualOnlyStartBlocked'));
            return;
        }
        // HRIM is a daytime-only energy practice. Gate it before audio setup.
        if (!await confirmHighEnergyTime()) return;

        // Sleep Mode is a local evening decision for this journey only.
        const sleepChoice = await chooseSleepModeForJourney();
        if (sleepChoice === null) return;

        // Select the intended narration character for this journey type.
        // Users can still fine-tune it after the journey begins.
        applyJourneyVoiceProfile(getChecked('high-energy-toggle'));

        // Initialize Audio Engine early for music-only mode
        if (!audio.isInitialized) await audio.init();

        if (state.bgMusicMode) {
            // Apply sleep mode dim class if needed
            if (state.sleepMode) document.body.classList.add('sleep-mode-active');
            if (state.eyesCloseMode) {
                const app = document.getElementById('app');
                const targetOpacity = Math.min(state.brightness, 0.7);
                if (app) app.style.opacity = targetOpacity;
            }
            await meditation.runBackgroundMusicOnly();
        } else {
            let order = [...state.selectedChakras];
            if (state.reverseJourney) order.reverse();
            const isHighEnergy = getChecked('high-energy-toggle');
            if (!isHighEnergy && order.length === 0) {
                alert("Please select at least one chakra before beginning the journey.");
                return;
            }
            meditation.chakraOrder = order;
            // Apply sleep mode dim class at session start
            if (state.sleepMode) document.body.classList.add('sleep-mode-active');
            // Absolute Grounding: Dim UI for Eyes Closed mode
            if (state.eyesCloseMode) {
                const app = document.getElementById('app');
                const targetOpacity = Math.min(state.brightness, 0.7);
                if (app) app.style.opacity = targetOpacity;
            }
            meditation.start().catch(err => {
                console.error("Failed to start meditation:", err);
                alert("Failed to start meditation. Check console.");
            });
        }
    });

    document.getElementById('pause-meditation').addEventListener('click', (e) => {
        console.log("Pause/Play button clicked");
        e.stopImmediatePropagation();
        meditation.togglePause();
    });

    document.getElementById('stop-meditation').addEventListener('click', (e) => {
        console.log("Stop button clicked");
        e.stopImmediatePropagation();
        meditation.stop();
    });
    const eyesCloseToggle = document.getElementById('eyes-close-mode-toggle');
    if (eyesCloseToggle) eyesCloseToggle.addEventListener('change', (e) => {
        state.eyesCloseMode = e.target.checked;
        localStorage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
        if (audio.toggleEyesCloseMode) audio.toggleEyesCloseMode(state.eyesCloseMode);
        document.body.classList.toggle('eyes-close-mode', state.eyesCloseMode);
    });
    const audioFiltersToggle = document.getElementById('audio-filters-toggle');
    if (audioFiltersToggle) audioFiltersToggle.addEventListener('change', (e) => {
        state.audioFilters = e.target.checked;
        localStorage.setItem('chakra_audio_filters', state.audioFilters);
        if (audio.toggleAudioFilters) audio.toggleAudioFilters(state.audioFilters);
    });
    document.getElementById('close-completion').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
            aura.style.opacity = '1';
        }
        showScreen(lobbyScreen);
    });

    // Toggle text overlay on click of the image area for immersion
    const symbolEl = document.getElementById('chakra-symbol');
    if (symbolEl) {
        symbolEl.addEventListener('click', () => {
            const overlay = document.getElementById('session-overlay');
            if (overlay) overlay.style.display = (overlay.style.display === 'none') ? 'block' : 'none';
        });
    }

    // Intention input
    document.getElementById('intention-input').addEventListener('input', (e) => {
        state.intention = e.target.value;
        localStorage.setItem('chakra_intention', state.intention);
    });

    // Keep this user-controlled opening preference separate from the completed
    // journey counter in state.stats.journeys.
    const returningJourneyToggle = document.getElementById('returning-journey-toggle');
    if (returningJourneyToggle) {
        returningJourneyToggle.addEventListener('change', (e) => {
            state.returningJourney = e.target.checked;
            localStorage.setItem('chakra_returning_journey', String(state.returningJourney));
            updateJourneyRoadmap();
        });
    }

    // Journal save
    document.getElementById('save-journal').addEventListener('click', () => {
        const entryEl = document.getElementById('journal-entry');
        const entry = entryEl ? entryEl.value.trim() : "";
        if (!entry) return;
        const entries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        entries.unshift({ date: new Date().toLocaleDateString(), text: entry });
        localStorage.setItem('chakra_journal', JSON.stringify(entries.slice(0, 50)));
        syncValue('journal-entry', '');
        const info = document.getElementById('last-journal-info');
        if (info) {
            info.textContent = t('ui.saved');
            setTimeout(() => {
                const saved = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
                info.textContent = saved.length > 0
                    ? t('ui.lastEntry') + saved[0].date
                    : '';
            }, 2000);
        }
    });
    const mixer = document.getElementById('volume-mixer');
    const mixerCloseButtons = [document.getElementById('close-mixer'), document.getElementById('close-mixer-bottom')].filter(Boolean);
    document.getElementById('btn-mixer').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!mixer) return;
        mixer.classList.remove('hidden');
        syncChecked('mixer-frequencies-toggle', state.chakraFrequencies);
        const closeButton = document.getElementById('close-mixer');
        if (closeButton) closeButton.focus();
    });
    mixerCloseButtons.forEach(button => button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mixer) mixer.classList.add('hidden');
        document.getElementById('btn-mixer')?.focus();
    }));
    document.getElementById('restart-meditation')?.addEventListener('click', async () => {
        if (!window.confirm(t('ui.restartConfirm'))) return;
        if (mixer) mixer.classList.add('hidden');
        meditation.stop();
        // A journey may still be unwinding its async start sequence. Wait for
        // the cancellation to release the start guard before launching again.
        const deadline = Date.now() + 5000;
        while (meditation.isStarting && Date.now() < deadline) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        startMeditationBtn.click();
    });
    document.getElementById('mixer-frequencies-toggle')?.addEventListener('change', (e) => {
        state.chakraFrequencies = e.target.checked;
        localStorage.setItem('chakra_frequencies', state.chakraFrequencies);
        syncChecked('frequencies-toggle', state.chakraFrequencies);
    });
    // Unified Volume Handlers
    const syncVolume = (key, value, elements) => {
        state[key] = parseFloat(value);
        localStorage.setItem(`chakra_${key.replace('vol', 'vol_').toLowerCase()}`, state[key]);
        elements.forEach(el => { if (el) el.value = value; });
    };

    const voiceClarity = document.getElementById('voice-clarity');
    const voiceWarmth = document.getElementById('voice-warmth');
    const voicePace = document.getElementById('voice-pace');
    const applyVoiceTuning = () => {
        if (audio.setVoiceTuning) audio.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
    };
    voiceClarity?.addEventListener('input', (event) => {
        state.voiceClarity = Number(event.target.value);
        localStorage.setItem('chakra_voice_clarity', state.voiceClarity);
        applyVoiceTuning();
        document.querySelectorAll('[data-voice-preset]').forEach(button => button.classList.remove('mixer-preset-active'));
    });
    voiceWarmth?.addEventListener('input', (event) => {
        state.voiceWarmth = Number(event.target.value);
        localStorage.setItem('chakra_voice_warmth', state.voiceWarmth);
        applyVoiceTuning();
        document.querySelectorAll('[data-voice-preset]').forEach(button => button.classList.remove('mixer-preset-active'));
    });
    voicePace?.addEventListener('input', (event) => {
        state.voicePace = Number(event.target.value);
        localStorage.setItem('chakra_voice_pace', state.voicePace);
    });
    document.getElementById('voice-echo')?.addEventListener('change', (event) => {
        state.voiceEcho = event.target.value;
        localStorage.setItem('chakra_voice_echo', state.voiceEcho);
        if (audio.setVoiceEcho) audio.setVoiceEcho(state.voiceEcho);
    });
    const voicePresets = {
        soft: { clarity: 35, warmth: 65, pace: 0.9 },
        balanced: { clarity: 50, warmth: 50, pace: 1 },
        clear: { clarity: 70, warmth: 40, pace: 1.05 }
    };
    document.querySelectorAll('[data-voice-preset]').forEach(button => {
        button.addEventListener('click', () => {
            const preset = voicePresets[button.dataset.voicePreset];
            if (!preset) return;
            state.voiceClarity = preset.clarity;
            state.voiceWarmth = preset.warmth;
            state.voicePace = preset.pace;
            localStorage.setItem('chakra_voice_clarity', state.voiceClarity);
            localStorage.setItem('chakra_voice_warmth', state.voiceWarmth);
            localStorage.setItem('chakra_voice_pace', state.voicePace);
            syncValue('voice-clarity', state.voiceClarity);
            syncValue('voice-warmth', state.voiceWarmth);
            syncValue('voice-pace', state.voicePace);
            applyVoiceTuning();
            document.querySelectorAll('[data-voice-preset]').forEach(item => item.classList.toggle('mixer-preset-active', item === button));
        });
    });

    // Voice
    const volVoiceEls = [document.getElementById('vol-voice'), document.getElementById('settings-vol-voice')].filter(Boolean);
    volVoiceEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volVoice', e.target.value, volVoiceEls);
        if (audio.voiceGain && audio.ctx) audio.voiceGain.gain.setValueAtTime(state.volVoice, audio.ctx.currentTime);
    }));

    // Drone
    const volDroneEls = [document.getElementById('vol-drone'), document.getElementById('settings-vol-drone')].filter(Boolean);
    volDroneEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volDrone', e.target.value, volDroneEls);
        if (audio.masterGain) audio.masterGain.gain.setValueAtTime(state.volDrone, audio.ctx.currentTime);
    }));

    // Bell
    const volBellEls = [document.getElementById('vol-bell'), document.getElementById('settings-vol-bell')].filter(Boolean);
    volBellEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volBell', e.target.value, volBellEls);
        if (audio.bellGain) audio.bellGain.gain.setValueAtTime(state.volBell, audio.ctx.currentTime);
    }));

    // Mantra
    const volMantraEls = [document.getElementById('vol-mantra'), document.getElementById('settings-vol-mantra')].filter(Boolean);
    volMantraEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volMantra', e.target.value, volMantraEls);
        if (audio.mantraGain && audio.mantraLoop) {
            audio.mantraGain.gain.setValueAtTime(state.volMantra, audio.ctx.currentTime);
        }
    }));

    // Music
    const volMusicEls = [document.getElementById('vol-music'), document.getElementById('settings-vol-music')].filter(Boolean);
    volMusicEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volMusic', e.target.value, volMusicEls);
        if (audio.bgMusicGain && audio.bgMusicLoop) {
            // Note: fadeIn/fadeOut and ducking logic will use the new state.volMusic on their next trigger
            // For immediate feedback during play:
            audio.bgMusicGain.gain.setValueAtTime(state.volMusic, audio.ctx.currentTime);
        }
    }));
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Chakra Meditation', artist: 'Mahakatha Vibe',
            artwork: [
                { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', () => { if (meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('pause', () => { if (!meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('stop', () => meditation.stop());
    }
    document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            cb.closest('.checkbox-label').classList.toggle('chip-active', cb.checked);
        });
        // Set initial state
        if (cb.checked) cb.closest('.checkbox-label').classList.add('chip-active');
    });

    // Initial estimate on load
    updateSessionEstimate();
} // Closes attachEventListeners

init().catch(error => {
    console.error('Application initialization failed:', error);
    setupVoices();
    loadPreferences();
    attachEventListeners();
    checkFirstTime();
});
