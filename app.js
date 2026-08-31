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

const DRONE_DURATION_RATIOS = Object.freeze({
    beginner: 0.20,
    intermediate: 0.50,
    advanced: 0.70,
    expert: 1.00
});
// Frequency drones use a fixed exposure window. The core-practice duration
// controls the session, but must never extend a drone's frequency exposure.
const DRONE_REFERENCE_SECONDS = 20;
const DEFAULT_DRONE_DURATION_MODE = 'beginner';
const DEFAULT_HRIM_DRONE_DURATION_MODE = 'intermediate';
const DEFAULT_SLEEP_DRONE_DURATION_MODE = 'intermediate';
const SLEEP_STAGE_COUNT = 5;
const SHOT_CHAKRA_ORDER = Object.freeze(['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']);
const MULTI_STAGE_SHOT_TYPES = Object.freeze(['meditation', 'sleep']);
const SPATIAL_MODES = Object.freeze(['off', 'stereo', 'headphones', 'room']);
const DEFAULT_SPATIAL_MODE = 'off';
const BACKGROUND_MUSIC_STOP_FADE_SECONDS = 5;
const BACKGROUND_MUSIC_ENTRY_FADE_SECONDS = 10;
const BACKGROUND_MUSIC_RESTORE_FADE_SECONDS = 8;
// Change this alongside any committed replacement of background_music.mp3.
// The versioned request avoids reviving an earlier track from an installed
// PWA's cache while keeping the filename simple for local contributors.
const BACKGROUND_MUSIC_ASSET_VERSION = '20260831.1';
const BACKGROUND_MUSIC_URL = `audio/background_music.mp3?v=${BACKGROUND_MUSIC_ASSET_VERSION}`;
const MANTRA_MUSIC_FADE_SECONDS = 4;
const MANTRA_FADE_SECONDS = 4;
const MANTRA_REVERB_TAIL_SECONDS = 3.6;
const MANTRA_REVERB_TAIL_DECAY = 1.8;
const MANTRA_REVERB_TAIL_WET = 0.26;
const PIPER_CLIP_FADE_SECONDS = 0.05;
const NARRATION_MANTRA_FADE_SECONDS = 2;
const PIPER_CANCEL_FADE_SECONDS = 0.12;
// Pleasure ambience is a separate, fixed-level support layer. It is not
// tied to the user music slider or the short frequency-exposure timer.
const PLEASURE_AMBIENCE_GAIN = 0.003;
const PLEASURE_AMBIENCE_MIN_GAIN = 0.002;
const PLEASURE_AMBIENCE_MAX_GAIN = 0.07;
const PLEASURE_AMBIENCE_CONFIRM_THRESHOLD = 0.05;
const PLEASURE_AMBIENCE_URL_STORAGE_KEY = 'chakra_pleasure_ambience_url';
const PLEASURE_AMBIENCE_FADE_SECONDS = 5;
const PLEASURE_AMBIENCE_HARMONIC_MIX = 0.04;
const PLEASURE_AMBIENCE_MANIFEST_URL = 'audio/ambience-manifest.json';
const PLEASURE_SPATIAL_APPROACH_SECONDS = 45;
const PLEASURE_SPATIAL_FALLBACK_FAR_GAIN = 0.35;
const PLEASURE_SPATIAL_FALLBACK_NEAR_GAIN = 0.8;
// Intensity changes texture, clarity, and spatial presence while the explicit
// Ambience Level slider remains the only source-level loudness control.
const PLEASURE_AMBIENCE_INTENSITIES = Object.freeze({
    gentle: { blurMultiplier: 1, blurCutoff: 2400, harmonicMix: PLEASURE_AMBIENCE_HARMONIC_MIX, nearDistanceMultiplier: 0.8, fallbackNearGain: PLEASURE_SPATIAL_FALLBACK_NEAR_GAIN, approachSeconds: PLEASURE_SPATIAL_APPROACH_SECONDS },
    immersive: { blurMultiplier: 0.7, blurCutoff: 4200, harmonicMix: 0.055, nearDistanceMultiplier: 0.58, fallbackNearGain: 0.86, approachSeconds: 35 },
    deep: { blurMultiplier: 0.38, blurCutoff: 6500, harmonicMix: 0.07, nearDistanceMultiplier: 0.42, fallbackNearGain: 0.93, approachSeconds: 22 }
});
// Blur is a restrained parallel effect: the default is noticeably softer
// than the original 12% wet mix, while the dry signal remains present for
// clarity. The Journey Tuning slider controls the wet amount only.
const PLEASURE_BLUR_MIN_AMOUNT = 0.10;
const PLEASURE_BLUR_DEFAULT_AMOUNT = 0.35;
const PLEASURE_BLUR_MAX_AMOUNT = 0.65;
const PLEASURE_BLUR_DRY_MIX = 1 - PLEASURE_BLUR_DEFAULT_AMOUNT;
const PLEASURE_BLUR_WET_MIX = PLEASURE_BLUR_DEFAULT_AMOUNT;

function clampPleasureAmbienceGain(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return PLEASURE_AMBIENCE_GAIN;
    return Math.min(PLEASURE_AMBIENCE_MAX_GAIN, Math.max(PLEASURE_AMBIENCE_MIN_GAIN, numericValue));
}

function clampAudioLevel(value, min, max, fallback) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return fallback;
    return Math.min(max, Math.max(min, numericValue));
}

function normalizePleasureAmbienceUrl(value) {
    const candidate = String(value ?? '').trim();
    if (!candidate) return '';
    try {
        const parsed = new URL(candidate, window.location.href);
        return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch (error) {
        return '';
    }
}

function clampPleasureAmbienceBlurAmount(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return PLEASURE_BLUR_DEFAULT_AMOUNT;
    return Math.min(PLEASURE_BLUR_MAX_AMOUNT, Math.max(PLEASURE_BLUR_MIN_AMOUNT, numericValue));
}

function normalizePleasureAmbienceIntensity(value) {
    return Object.hasOwn(PLEASURE_AMBIENCE_INTENSITIES, value) ? value : 'gentle';
}

function getPleasureAmbienceIntensityProfile() {
    return PLEASURE_AMBIENCE_INTENSITIES[normalizePleasureAmbienceIntensity(state?.pleasureAmbienceIntensity)];
}

function getPleasureBlurMix(enabled) {
    const profile = getPleasureAmbienceIntensityProfile();
    const wet = enabled
        ? clampPleasureAmbienceBlurAmount(state.pleasureAmbienceBlurAmount) * profile.blurMultiplier
        : 0;
    return { dry: 1 - wet, wet };
}

function formatPleasureAmbienceLevel(gain) {
    return `${(clampPleasureAmbienceGain(gain) * 100).toFixed(1)}%`;
}

function getShotDefaultDuration(type, definition = timingConfig.journey?.shotDuration || {}) {
    const isMultiStage = MULTI_STAGE_SHOT_TYPES.includes(type);
    const configured = isMultiStage ? definition.default : definition.singleFrequencyDefault;
    const fallback = isMultiStage ? 7 : 1;
    const duration = Number(configured ?? fallback);
    const minimum = Number(definition.min ?? 1);
    const maximum = Number(definition.max ?? 20);
    return Number.isFinite(duration) ? Math.min(maximum, Math.max(minimum, duration)) : fallback;
}

function normalizeDroneDurationMode(value) {
    return Object.prototype.hasOwnProperty.call(DRONE_DURATION_RATIOS, value) ? value : DEFAULT_DRONE_DURATION_MODE;
}

function normalizeHrimDroneDurationMode(value) {
    const normalized = normalizeDroneDurationMode(value);
    return normalized === 'beginner' ? DEFAULT_HRIM_DRONE_DURATION_MODE : normalized;
}

function normalizeSleepDroneDurationMode(value) {
    return Object.prototype.hasOwnProperty.call(DRONE_DURATION_RATIOS, value)
        ? value
        : DEFAULT_SLEEP_DRONE_DURATION_MODE;
}

function normalizeSpatialMode(value) {
    return SPATIAL_MODES.includes(value) ? value : DEFAULT_SPATIAL_MODE;
}

function getDroneDurationMs(_practiceMinutes, mode = DEFAULT_DRONE_DURATION_MODE) {
    return Math.round(DRONE_REFERENCE_SECONDS * 1000 * DRONE_DURATION_RATIOS[normalizeDroneDurationMode(mode)]);
}

function formatClockDuration(durationMs) {
    const totalSeconds = Math.max(0, Math.round(Number(durationMs) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const SESSION_COUNTDOWN_CIRCUMFERENCE = 276.46;
function setSessionCountdown(remainingMs, totalMs) {
    const countdowns = document.querySelectorAll('[data-session-countdown]');
    const progressNodes = document.querySelectorAll('[data-session-countdown-progress]');
    const total = Number(totalMs);
    const remaining = Number(remainingMs);
    if (!countdowns.length || !progressNodes.length || !Number.isFinite(total) || total <= 0) {
        countdowns.forEach(countdown => { countdown.hidden = true; });
        return;
    }

    const safeRemaining = Math.min(total, Math.max(0, Number.isFinite(remaining) ? remaining : total));
    const ratio = safeRemaining / total;
    countdowns.forEach(countdown => { countdown.hidden = false; });
    progressNodes.forEach(progress => {
        progress.style.strokeDashoffset = String(SESSION_COUNTDOWN_CIRCUMFERENCE * (1 - ratio));
    });
}

function hideSessionCountdown() {
    document.querySelectorAll('[data-session-countdown]').forEach(countdown => {
        countdown.hidden = true;
    });
}

function normalizeSleepStages(scripts) {
    const stages = scripts?.sleep_mode?.stages;
    if (!Array.isArray(stages) || stages.length !== SLEEP_STAGE_COUNT) {
        throw new Error('Sleep Mode requires five script-defined frequency stages.');
    }
    return stages.map((stage, index) => {
        const frequency = Number(stage?.frequency);
        if (!stage?.key || !Number.isFinite(frequency) || frequency <= 0 || frequency > 20000) {
            throw new Error(`Sleep Mode stage ${index + 1} has an invalid frequency.`);
        }
        return { ...stage, frequency };
    });
}

// Journey completion reveals a native Earn link after a quiet closing pause.
// Navigation remains a real user action so an installed PWA can capture it.
const EARN_HANDOFF_DELAY_MS = 3000;
let earnHandoffTimer = null;

// ── DOM ELEMENTS (Declared First to prevent TDZ Errors) ──────────────────────
const configScreen = document.getElementById('config-screen');
const experimentScreen = document.getElementById('experiment-screen');
const lobbyScreen = document.getElementById('lobby-screen');
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
const estimateNarrationDurationSeconds = (txt, pacing = 'normal') => {
    const text = String(txt ?? '').trim();
    if (!text) return 0;

    // Keep the estimate deliberately conservative. Browser speech and Piper
    // have different timing, and Malayalam generally needs more reading time
    // than Latin text. A slower ticker is preferable to outrunning the voice.
    const isMalayalam = /[\u0D00-\u0D7F]/.test(text);
    const charactersPerSecond = isMalayalam ? 5.5 : 7.5;
    const piperPaceMultiplier = isPiperVoice()
        ? getPiperMeditationPaceMultiplier()
        : 1;
    const pacingFactor = pacing === 'hrim' ? 1.1 : pacing === 'soft' ? 0.82 : pacing === 'feeble' ? 0.76 : 1;
    const sentenceCount = text.split(/[.!?।]/).filter(sentence => sentence.trim()).length;
    const sentenceGaps = Math.max(0, sentenceCount - 1) * 1.5;
    return 1.2 + (text.length / (charactersPerSecond * pacingFactor * piperPaceMultiplier)) + sentenceGaps;
};
let narrationTickerAwaitingPlayback = false;
const refreshNarrationTicker = (el) => {
    const container = el?.closest('[data-narration-ticker]');
    if (!el || !container) return;

    el.classList.remove('is-scrolling');
    el.style.removeProperty('--narration-duration');
    if (narrationTickerAwaitingPlayback) {
        el.classList.add('is-awaiting-playback');
        return;
    }
    el.classList.remove('is-awaiting-playback');
    if (!el.textContent.trim() || container.clientWidth === 0) return;

    // Keep the behavior marquee-like even for short prompts. The first word
    // starts near the reader and later words arrive in normal LTR order.
    const textWidth = el.scrollWidth;
    const startOffset = container.clientWidth * 0.68;
    const endOffset = container.clientWidth * 0.5;
    el.style.setProperty('--narration-width', `${textWidth}px`);
    el.style.setProperty('--narration-start', `${startOffset}px`);
    el.style.setProperty('--narration-end', `${endOffset}px`);
    const speechDuration = Number(container.dataset.narrationDurationHint);
    // The voice timing is the only timing authority. Width still determines
    // the geometric travel distance, but never changes the ticker duration;
    // otherwise identical narration drifts on different devices.
    const duration = Number.isFinite(speechDuration)
        ? Math.max(1, speechDuration)
        : Math.max(1, estimateNarrationDurationSeconds(el.textContent));
    el.style.setProperty('--narration-duration', `${duration}s`);
    el.classList.add('is-scrolling');
};
const setNarrationTickerAwaitingPlayback = (awaiting) => {
    narrationTickerAwaitingPlayback = Boolean(awaiting);
    if (narrationTickerAwaitingPlayback) {
        document.querySelectorAll('[data-narration-text]').forEach((el) => {
            el.classList.remove('is-scrolling');
            el.classList.add('is-awaiting-playback');
        });
    }
};
const startNarrationTicker = (durationSeconds) => {
    setNarrationTickerAwaitingPlayback(false);
    document.querySelectorAll('[data-narration-text]').forEach((el) => {
        const container = el.closest('[data-narration-ticker]');
        if (!container || !el.textContent.trim()) return;
        const duration = Number(durationSeconds);
        if (Number.isFinite(duration) && duration > 0) {
            container.dataset.narrationDurationHint = String(duration);
        }
        refreshNarrationTicker(el);
    });
};
const updateNarrationTickerDuration = (durationSeconds) => {
    const duration = Number(durationSeconds);
    if (!Number.isFinite(duration) || duration <= 0) return;

    document.querySelectorAll('[data-narration-text]').forEach((el) => {
        const animation = el.getAnimations?.().find(item => item.animationName === 'narrationTickerReadOrder');
        const currentTime = animation && Number(animation.currentTime);
        const previousDuration = animation?.effect?.getComputedTiming?.().duration;
        const position = Number.isFinite(currentTime) && Number.isFinite(previousDuration) && previousDuration > 0
            ? Math.max(0, Math.min(1, currentTime / previousDuration))
            : null;
        el.style.setProperty('--narration-duration', `${duration}s`);

        // Changing a CSS animation variable can recreate the animation in
        // some browsers. Preserve its visible position so replacing an
        // estimate with Piper's decoded duration never causes a visible jump.
        // The remaining speed may change, but the words already on screen do
        // not move backward or forward when a later clip is measured.
        if (animation && position !== null) {
            const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
            schedule(() => {
                const nextAnimation = el.getAnimations?.().find(item => item.animationName === 'narrationTickerReadOrder');
                if (nextAnimation) nextAnimation.currentTime = position * duration * 1000;
            });
        }
    });
};
const setNarrationText = (txt, narrationDurationSeconds = null) => {
    const text = String(txt ?? '').trim();
    document.querySelectorAll('[data-narration-text]').forEach((el) => {
        const renderId = String(Number(el.dataset.renderId || 0) + 1);
        el.dataset.renderId = renderId;
        el.textContent = text;
        el.classList.remove('is-scrolling', 'is-paused');
        el.classList.toggle('is-awaiting-playback', narrationTickerAwaitingPlayback && Boolean(text));
        el.style.removeProperty('--narration-duration');
        const container = el.closest('[data-narration-ticker]');
        if (container) {
            container.classList.toggle('is-empty', !text);
            if (text && Number.isFinite(Number(narrationDurationSeconds))) {
                container.dataset.narrationDurationHint = String(narrationDurationSeconds);
            } else if (!text) {
                delete container.dataset.narrationDurationHint;
            }
        }
        if (!text || !container) return;

        // Measure after the new narration is painted so every visible screen
        // receives the same responsive LTR reading marquee.
        const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
        schedule(() => {
            if (el.dataset.renderId !== renderId || !container.isConnected) return;
            refreshNarrationTicker(el);
        });
    });
};
const setNarrationTickerPaused = (paused) => {
    document.querySelectorAll('[data-narration-text]').forEach((el) => {
        el.classList.toggle('is-paused', Boolean(paused));
    });
};
let narrationPlaybackGeneration = 0;
const beginNarrationPlayback = () => ++narrationPlaybackGeneration;
const finishNarrationPlayback = (generation) => {
    // A soft reminder can overlap a regular narration. Only the narration
    // that is still current may clear the shared ticker when it finishes.
    if (generation === narrationPlaybackGeneration) setNarrationText('');
};
const cancelNarrationPlayback = () => {
    narrationPlaybackGeneration += 1;
    setNarrationText('');
};
const setText = (id, txt, narrationDurationSeconds = null) => {
    if (id === 'narration-text') {
        setNarrationText(txt, narrationDurationSeconds);
        return;
    }
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
};

function cancelEarnHandoff() {
    if (earnHandoffTimer !== null) {
        window.clearTimeout(earnHandoffTimer);
        earnHandoffTimer = null;
    }
    const earnLink = document.getElementById('continue-to-earn');
    if (earnLink) {
        earnLink.hidden = true;
        earnLink.classList.add('hidden');
    }
}

function canUseEarnHandoff() {
    // Hindi is an intentionally non-commercial, browser-TTS-only experience.
    return state.language !== 'hi';
}

function scheduleEarnHandoff() {
    cancelEarnHandoff();
    if (!canUseEarnHandoff()) return;
    earnHandoffTimer = window.setTimeout(() => {
        earnHandoffTimer = null;
        const earnLink = document.getElementById('continue-to-earn');
        if (!earnLink) return;
        earnLink.hidden = false;
        earnLink.classList.remove('hidden');
        earnLink.focus({ preventScroll: true });
    }, EARN_HANDOFF_DELAY_MS);
}

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

function getScriptPath(source, path) {
    return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source);
}

function hasScriptPath(source, path) {
    return getScriptPath(source, path) != null;
}

function hasLocalizedScriptPath(scripts, path, fallbackLanguage = null) {
    if (hasScriptPath(scripts, path)) return true;
    const parts = path.split('.');
    const final = parts.pop() || '';
    const parentPath = parts.join('.');

    // Canonical chakra narration uses meditation_<language>, while older
    // custom bundles used the section-level <language> field. Closing uses
    // section-level languages, with meditation_<language> accepted as legacy.
    const meditationMatch = final.match(/^meditation_([a-zA-Z-]+)$/);
    if (meditationMatch && hasScriptPath(scripts, `${parentPath}.${meditationMatch[1]}`)) return true;
    if (/^[a-zA-Z-]+$/.test(final) && hasScriptPath(scripts, `${parentPath}.meditation_${final}`)) return true;

    const suffixMatch = final.match(/^(.+)_([a-zA-Z-]+)$/);
    if (!suffixMatch) {
        // Section-level language fields (for example closing.ru) are used by
        // legacy custom bundles as well as newer localized content.
        return Boolean(
            fallbackLanguage && final !== fallbackLanguage &&
            hasLocalizedScriptPath(scripts, parts.concat(fallbackLanguage).join('.'))
        );
    }
    const basePath = parts.concat(suffixMatch[1]).join('.');
    if (hasScriptPath(scripts, `${basePath}.${suffixMatch[2]}`)) return true;
    if (['text', 'content', 'value'].some(field =>
        hasScriptPath(scripts, `${parentPath}.${field}.${suffixMatch[2]}`)
    )) return true;
    // Existing guide-authored uploads commonly contain English/Malayalam only.
    // Runtime localization already falls back to English, so accepting that
    // fallback keeps those bundles usable after a new app language is added.
    return Boolean(
        fallbackLanguage && suffixMatch[2] !== fallbackLanguage &&
        hasLocalizedScriptPath(scripts, `${basePath}_${fallbackLanguage}`)
    );
}

function validateScriptBundle(scripts, options = {}) {
    const languageIds = (options.languages || languageRegistry.map(language => language.id)).length
        ? (options.languages || languageRegistry.map(language => language.id))
        : ['ml', 'en'];
    const localized = (base) => languageIds.map(language => `${base}_${language}`);
    const chakraKeys = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
    const required = [
        ...localized('intro.gratitude'), ...localized('intro.returning'),
        ...['new', 'waxing', 'full', 'waning'].flatMap(phase => localized(`intro.moon.${phase}`)),
        ...languageIds.map(language => `closing.${language}`),
        ...languageIds.map(language => `closing.affirmation_${language}`),
        ...chakraKeys.flatMap(key => [
            ...languageIds.map(language => `${key}.meditation_${language}`),
            ...languageIds.map(language => `${key}.affirmation_${language}`),
            `${key}.mantra`, `${key}.color`, `${key}.symbol`, `${key}.frequency`
        ])
    ];
    if (options.highEnergy) required.push(
        ...languageIds.flatMap(language => [`high_energy.meditation_${language}`, `high_energy.intention_${language}`, `high_energy.affirmation_${language}`]),
        'high_energy.mantra', 'high_energy.color', 'high_energy.symbol', 'high_energy.frequency'
    );
    if (options.corpse) required.push(...languageIds.flatMap(language => [`corpse_pose.intro.${language}`, `corpse_pose.transition.${language}`]));
    if (options.bath) required.push(...languageIds.flatMap(language => [`bath_session.title.${language}`, `bath_session.intro.${language}`, `bath_session.instructions.${language}`, `bath_session.reminder.${language}`]));
    if (options.perinealCare) required.push(...languageIds.flatMap(language => [`perineal_care.title.${language}`, `perineal_care.intro.${language}`, `perineal_care.instructions.${language}`, `perineal_care.reminder.${language}`]));
    if (options.assistedBathing) required.push(...languageIds.flatMap(language => [`assisted_bathing.title.${language}`, `assisted_bathing.intro.${language}`, `assisted_bathing.instructions.${language}`, `assisted_bathing.reminder.${language}`]));
    if (options.massage) required.push(...languageIds.flatMap(language => [`massage.title.${language}`, `massage.intro.${language}`, `massage.instructions.${language}`, `massage.reminder.${language}`]));
    if (options.yoga) required.push(...languageIds.flatMap(language => [`yoga.intro.${language}`, `yoga.preparation.${language}`, `yoga.next_pose_prompt.${language}`, `yoga.session_complete.${language}`]), 'yoga.poses');
    if (options.hooponopono) required.push(...languageIds.flatMap(language => [`hooponopono.intro.${language}`, `hooponopono.phrases.${language}`, `hooponopono.closing.${language}`]));
    const fallbackLanguage = options.allowLanguageFallback ? 'en' : null;
    const missing = required.filter(path => !hasLocalizedScriptPath(scripts, path, fallbackLanguage));
    const frequencyKeys = options.highEnergy ? [...chakraKeys, 'high_energy'] : chakraKeys;
    const invalidFrequencies = frequencyKeys
        .filter(key => hasScriptPath(scripts, `${key}.frequency`))
        .filter(key => {
            const frequency = Number(getScriptPath(scripts, `${key}.frequency`));
            return !Number.isFinite(frequency) || frequency < 1 || frequency > 20000;
        })
        .map(key => `${key}.frequency (must be between 1 and 20000 Hz)`);
    const issues = [...missing, ...invalidFrequencies];
    return { valid: issues.length === 0, missing: issues };
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
    'transitions.bathToYogaRest': 900,
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
    if (input.id === 'time-per-chakra') return document.getElementById('shots-toggle')?.checked
        ? `${value.toFixed(0)} secs`
        : `${value.toFixed(1)} mins`;
    if (input.id === 'mood-relaxation-ambience-level') return `${value.toFixed(1)}%`;
    if (input.id === 'pleasure-ambience-blur-level') return `${Math.round(value)}%`;
    if (input.id === 'time-high-energy') return `${value} mins`;
    if (['time-bath', 'time-perineal-care', 'time-assisted-bathing'].includes(input.id)) {
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

        const existingMeta = container.querySelector(':scope > .range-meta');
        let current = existingMeta?.querySelector('.range-current') || container.querySelector(':scope > span');
        if (!current) {
            current = document.createElement('span');
            container.appendChild(current);
        }
        current.classList.add('range-current');

        const meta = existingMeta || document.createElement('div');
        if (!existingMeta) {
            meta.className = 'range-meta';
            container.appendChild(meta);
        }
        // A generated range starts with its current value beside the input;
        // move it into the metadata row before using it as an insertion anchor.
        if (current.parentElement !== meta) meta.appendChild(current);

        const createStepButton = (className, label, text) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `range-step ${className}`;
            button.setAttribute('aria-label', label);
            button.textContent = text;
            return button;
        };
        let decrement = meta.querySelector('.range-decrement');
        if (!decrement) {
            decrement = createStepButton('range-decrement', 'Decrease value', '−');
            meta.prepend(decrement);
        }
        let increment = meta.querySelector('.range-increment');
        if (!increment) {
            increment = createStepButton('range-increment', 'Increase value', '+');
            meta.appendChild(increment);
        }
        let minimum = meta.querySelector('.range-min');
        if (!minimum) {
            minimum = document.createElement('span');
            minimum.className = 'range-min';
            meta.insertBefore(minimum, current);
        }
        let maximum = meta.querySelector('.range-max');
        if (!maximum) {
            maximum = document.createElement('span');
            maximum.className = 'range-max';
            meta.insertBefore(maximum, increment);
        }
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
            if (!minimum.dataset.i18n) minimum.textContent = input.min;
            if (!maximum.dataset.i18n) maximum.textContent = input.max;
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
        'time-assisted-bathing': 'assistedBathing'
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
            timeSleepStage: ['chakra_time_sleep_stage', 'sleepStageDuration', 5],
            timeShot: ['chakra_time_shot', 'shotDuration', 7],
            timeIcebreaker: ['chakra_time_icebreaker', 'icebreaker', 60],
            timeBreathing: ['chakra_time_breathing', 'breathingStep', 8],
            timeCorpse: ['chakra_time_corpse', 'corpsePose', 300],
            timeInterval: ['chakra_time_interval', 'interval', 10],
            timeYogaPrep: ['chakra_time_yoga_prep', 'yogaPreparation', 60],
            timeYogaPose: ['chakra_time_yoga_pose', 'yogaPose', 60],
            timeBath: ['chakra_time_bath', 'bath', 600],
            timePerinealCare: ['chakra_time_perineal_care', 'perinealCare', 300],
            timeAssistedBathing: ['chakra_time_assisted_bathing', 'assistedBathing', 600]
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

function updateDroneDurationSummary() {
    const summary = document.getElementById('drone-duration-summary');
    if (!summary) return;
    const highEnergy = getChecked('high-energy-toggle');
    const sleep = getChecked('sleep-mode-toggle');
    const practiceMinutes = highEnergy ? state.timeHighEnergy : (sleep ? state.timeSleepStage : state.timePerChakra);
    const mode = highEnergy ? state.hrimDroneDurationMode : (sleep ? state.sleepDroneDurationMode : state.droneDurationMode);
    const duration = formatClockDuration(getDroneDurationMs(practiceMinutes, mode));
    const template = t(highEnergy ? 'ui.droneDurationActiveHrim' : (sleep ? 'ui.droneDurationActiveSleep' : 'ui.droneDurationActive'));
    summary.textContent = template.replace('{duration}', duration);
}

function syncDroneDurationModeControls() {
    const highEnergy = getChecked('high-energy-toggle');
    const sleep = getChecked('sleep-mode-toggle');
    const activeMode = highEnergy ? state.hrimDroneDurationMode : (sleep ? state.sleepDroneDurationMode : state.droneDurationMode);
    document.querySelectorAll('input[name="drone-duration-mode"]').forEach(input => {
        input.disabled = highEnergy && input.value === 'beginner';
        input.checked = input.value === activeMode;
    });
    const hrimNote = document.getElementById('drone-duration-hrim-note');
    if (hrimNote) hrimNote.hidden = !highEnergy;
    const sleepNote = document.getElementById('drone-duration-sleep-note');
    if (sleepNote) sleepNote.hidden = !sleep;
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

function shouldRefreshLocalizedIntention(value, previousLanguage) {
    // Current and earlier releases may have saved either language's generated
    // wording. Recognize both defaults so changing Meditation Language always
    // refreshes app-generated copy, while a guide's own intention stays intact.
    const supportedLanguages = languageRegistry.map(language => language.id);
    const languagesToCheck = [...new Set([previousLanguage, state.language, ...supportedLanguages])];
    return languagesToCheck.some(language => isGeneratedIntention(value, language));
}

function getJourneyRoadmapLabels() {
    if (getChecked('music-only-toggle')) return [t('ui.roadmapMusicOnly')];

    if (getChecked('box-breathing-experience-toggle')) return [t('ui.roadmapBoxBreathing')];

    if (getChecked('hooponopono-experience-toggle')) return [t('ui.roadmapHooponopono')];

    if (getChecked('perineal-care-toggle') || getChecked('massage-toggle') || getChecked('assisted-bathing-toggle')) {
        const labels = [];
        if (getChecked('perineal-care-toggle')) labels.push(t('ui.roadmapPerineal'));
        if (getChecked('massage-toggle')) labels.push(t('ui.roadmapMassageReverse'));
        if (getChecked('assisted-bathing-toggle')) labels.push(t('ui.roadmapAssistedBathing'));
        return labels;
    }

    if (getChecked('yoga-experience-toggle')) {
        const labels = [];
        if (getChecked('corpse-pose-toggle')) labels.push(t('ui.roadmapCorpse'));
        if (getChecked('bath-session-toggle')) {
            labels.push(t('ui.roadmapBath'));
            labels.push(t('ui.roadmapRestBeforeYoga'));
        }
        labels.push(t('ui.roadmapYoga'));
        return labels;
    }

    if (getChecked('sleep-mode-toggle')) {
        return [t('ui.roadmapSleep'), t('ui.roadmapDrowsiness'), t('ui.roadmapLightSleep'), t('ui.roadmapTrueSleep'), t('ui.roadmapDeepSleep'), t('ui.roadmapRemRest')];
    }

    if (getChecked('high-energy-toggle')) {
        return [t('ui.roadmapIntention'), t('ui.roadmapHrim'), t('ui.roadmapClosing')];
    }

    const labels = [
        t(state.returningJourney ? 'ui.roadmapReturning' : 'ui.roadmapArrival'),
        t('ui.roadmapIntention')
    ];
    labels.push(t('ui.roadmapChakras'));

    labels.push(t('ui.roadmapClosing'));
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
    setText('continue-to-earn', t('ui.continueToEarn'));
    setText('close-completion', t('ui.returnToRoom'));
    setText('returning-journey-label', t('ui.returningJourney'));
    setText('save-config', t('ui.startMeditation'));
    setText('start-meditation', t('ui.beginJourney'));
    const experimentGuidedGroup = document.getElementById('experiment-guided-group');
    const experimentCareGroup = document.getElementById('experiment-care-group');
    if (experimentGuidedGroup) experimentGuidedGroup.label = t('ui.experimentGuidedPractice');
    if (experimentCareGroup) experimentCareGroup.label = t('ui.experimentCare');
    document.querySelectorAll('.stat-lbl').forEach((element) => {
        element.textContent = t('ui.sessionTime');
    });
    const intentionInput = document.getElementById('intention-input');
    if (intentionInput) intentionInput.placeholder = t('ui.intentionPlaceholder');
    const pleasureAmbienceUrlInput = document.getElementById('pleasure-ambience-url');
    if (pleasureAmbienceUrlInput) pleasureAmbienceUrlInput.placeholder = t('ui.pleasureAmbienceUrlPlaceholder');
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const path = element.dataset.i18n;
        const translation = path ? t(path) : null;
        // A stale cached language bundle can be temporarily behind a newly
        // deployed interface. Keep the readable HTML fallback in that case
        // instead of replacing it with a raw `ui.*` lookup key.
        if (translation && translation !== path) element.textContent = translation;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        const path = element.dataset.i18nAriaLabel;
        if (path) element.setAttribute('aria-label', t(path));
    });

    const controlLabels = {
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
    };
    Object.entries(controlLabels).forEach(([inputId, path]) => {
        const input = document.getElementById(inputId);
        const label = input && input.closest('label');
        if (!label) return;
        const textNode = Array.from(label.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) textNode.textContent = ` ${t(path)}`;
    });
    updateJourneyRoadmap();
    updateDroneDurationSummary();
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
            { id: 'en', locale: 'en-US', label: 'English', browserPrefixes: ['en'], defaultPiperVoice: 'en_US-lessac-medium' },
            { id: 'ru', locale: 'ru-RU', label: 'Русский', browserPrefixes: ['ru'], defaultPiperVoice: 'ru_RU-irina-medium' },
            { id: 'hi', locale: 'hi-IN', label: 'हिन्दी', browserPrefixes: ['hi'] }
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

function getPiperVoiceDefinition(value = state.voiceName) {
    if (!isPiperVoice(value)) return null;
    return piperVoiceRegistry.find(voice => voice.id === piperVoiceId(value)) || null;
}

function getPiperMeditationPaceMultiplier(value = state.voiceName) {
    const multiplier = Number(getPiperVoiceDefinition(value)?.meditationPaceMultiplier);
    return Number.isFinite(multiplier) && multiplier > 0 && multiplier <= 1.15 ? multiplier : 1;
}

function getEffectivePiperPace(value = state.voiceName) {
    const selectedPace = Number(state.voicePace) || 1;
    const requestedMinimum = Number(getPiperVoiceDefinition(value)?.meditationPaceMin);
    // Standard voices retain the existing 0.70 floor. Only an explicitly
    // registered meditation voice may opt into the lower calm-cadence floor.
    const minimum = Number.isFinite(requestedMinimum)
        ? Math.max(0.6, Math.min(0.7, requestedMinimum))
        : 0.7;
    return Math.max(minimum, Math.min(1.15, selectedPace * getPiperMeditationPaceMultiplier(value)));
}

function getPiperMeditationSettings(value = state.voiceName) {
    const definition = getPiperVoiceDefinition(value) || {};
    return {
        lengthScale: 1 / getEffectivePiperPace(value),
        // The normal runtime ceiling remains conservative. A model may opt in
        // to a modestly longer meditation cadence through its registry entry.
        lengthScaleMax: Number(definition.meditationLengthScaleMax) || 1.35
    };
}

function isFeminineNarrationVoice(value = state.voiceName) {
    const piperVoice = getPiperVoiceDefinition(value);
    if (piperVoice) return String(piperVoice.gender || '').toLowerCase() === 'female';
    // Unknown Piper voices are intentionally neutral until their registry
    // entry declares a gender. This keeps future languages data-driven.
    if (isPiperVoice(value)) return false;

    const selected = getBrowserVoiceForContent();
    const browserGender = String(selected?.gender || selected?.voiceGender || '').toLowerCase();
    if (browserGender) return browserGender === 'female';
    const name = `${selected?.name || ''} ${value || ''}`.toLowerCase();
    // Web Speech has no consistently supported gender field, so keep a
    // language-neutral fallback for browser voices that advertise it by name.
    return /\b(female|woman|samantha|victoria|karen|moira|zira|ava|susan|veena|lekha|meera)\b/i.test(name);
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
        this.currentClipGain = null;
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
            // Keep the user Pace control intact while allowing a voice model
            // to declare a calmer meditation baseline in its registry.
            settings: getPiperMeditationSettings()
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

    async decode(blob) {
        if (!blob) return;
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = await this.audio.ctx.decodeAudioData(arrayBuffer);
        return buffer || null;
    }

    async play(blob, volumeScale = 1, callbacks = {}) {
        const buffer = await this.decode(blob);
        return this.playBuffer(buffer, volumeScale, callbacks);
    }

    async playBuffer(buffer, volumeScale = 1, callbacks = {}) {
        if (!buffer || !this.audio.ctx) return;

        return new Promise((resolve) => {
            const source = this.audio.ctx.createBufferSource();
            const clipGain = this.audio.ctx.createGain();
            source.buffer = buffer;
            source.connect(clipGain);
            clipGain.connect(this.audio.voiceGain || this.audio.ctx.destination);
            this.currentSource = source;
            this.currentClipGain = clipGain;
            this.currentResolve = resolve;
            source.onended = () => {
                if (this.currentSource === source) {
                    this.currentSource = null;
                    this.currentClipGain = null;
                    this.currentResolve = null;
                }
                try {
                    callbacks.onEnd?.({ duration: buffer.duration, endedAt: this.audio.ctx.currentTime });
                } catch (error) {
                    console.warn('[Piper] playback end callback failed:', error);
                }
                resolve({ duration: buffer.duration });
            };
            const now = this.audio.ctx.currentTime;
            const requestedFadeIn = Number(callbacks.fadeInSeconds);
            const requestedFadeOut = Number(callbacks.fadeOutSeconds);
            const fadeInTime = Math.min(
                Number.isFinite(requestedFadeIn) ? Math.max(0, requestedFadeIn) : PIPER_CLIP_FADE_SECONDS,
                buffer.duration / 4
            );
            const fadeOutTime = Math.min(
                Number.isFinite(requestedFadeOut) ? Math.max(0, requestedFadeOut) : PIPER_CLIP_FADE_SECONDS,
                buffer.duration / 4
            );
            const normalizedGain = this.getNormalizationGain(buffer);
            clipGain.gain.setValueAtTime(0, now);
            clipGain.gain.linearRampToValueAtTime(normalizedGain, now + fadeInTime);
            if (buffer.duration > fadeInTime + fadeOutTime) {
                clipGain.gain.setValueAtTime(normalizedGain, now + buffer.duration - fadeOutTime);
                clipGain.gain.linearRampToValueAtTime(0, now + buffer.duration);
            }
            if (this.audio.voiceGain) {
                this.audio.voiceGain.gain.setValueAtTime(state.volVoice * volumeScale, now);
            }
            try {
                callbacks.onStart?.({ duration: buffer.duration, startedAt: now });
            } catch (error) {
                console.warn('[Piper] playback start callback failed:', error);
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

    cancel(reason = 'cancelled', { immediate = false } = {}) {
        this.isCancelling = true;
        if (this.activeJob && this.worker) {
            this.worker.postMessage({ type: 'cancel', requestId: this.activeJob.requestId });
        }
        if (this.currentSource) {
            const source = this.currentSource;
            const clipGain = this.currentClipGain;
            if (!immediate && clipGain && this.audio?.ctx) {
                const now = this.audio.ctx.currentTime;
                const fadeSeconds = PIPER_CANCEL_FADE_SECONDS;
                try {
                    clipGain.gain.cancelScheduledValues(now);
                    clipGain.gain.setValueAtTime(Math.max(0, clipGain.gain.value), now);
                    clipGain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
                    source.stop(now + fadeSeconds + 0.02);
                } catch (error) {
                    try { source.stop(); } catch (stopError) {}
                }
            } else {
                try { source.stop(); } catch (error) {}
            }
            this.currentSource = null;
            this.currentClipGain = null;
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
        this.shotOscillator = null;
        this.shotGain = null;
        this.masterGain = null;
        this.voiceGain = null;
        this.reverbWet = null; // New: Reverb Swell control
        this.pannerNode = null;
        this.spatialPanLfoGain = null;
        this.spatialDronePanner = null;
        this.spatialMusicPanner = null;
        this.spatialMantraPanner = null;
        this.mantraTailConvolver = null;
        this.mantraTailFilter = null;
        this.mantraTailWetGain = null;
        this.spatialPleasurePanner = null;
        this.pleasureSpatialDepthGain = null;
        this.pleasureSpatialPosition = null;
        this.pleasureBlurFilter = null;
        this.pleasureBlurConvolver = null;
        this.pleasureBlurDryGain = null;
        this.pleasureBlurWetGain = null;
        this.isInitialized = false;

        // Looping Managers
        this.mantraLoop = null;
        this.bgMusicLoop = null;
        this.pleasureLoops = [];

        this.mantraBuffer = {};
        this.bgMusicBuffer = null;
        this.pleasureBuffers = new Map();
        this.pleasureManifest = null;
        this.pleasureManifestKey = null;
        this.pleasureGeneration = 0;
        this.pleasureAudioAvailable = null;

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
        this.musicEchoSend = null;
        this.musicEchoDelay = null;
        this.musicEchoConvolver = null;
        this.musicEchoFilter = null;
        this.musicEchoWetGain = null;
        this.pleasureSourceGain = null;
        this.pleasureGain = null;
        this.pleasureEnhancer = null;
        this.pleasureEnhancerGain = null;
        this.bgMusicBusGain = null;
        this.bgMusicTargetVolume = null;
        this.bgMusicTargetEQ = 0;
        this.bgMusicRestoreTimer = null;
        this.bgMusicSuppressedByMantra = false;
        this.lowCutFilter = null;
        this.mantraPresenceLFO = null; // New: Organic Mantra Motion
        this.mantraRequestId = 0;
        this.spatialMode = DEFAULT_SPATIAL_MODE;
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

        // Prefer the system default output on mobile so Web Audio follows the
        // loudspeaker route instead of an earpiece-specific route when the
        // browser exposes AudioContext.setSinkId. Unsupported browsers keep
        // their normal platform audio routing and must not block startup.
        if (typeof this.ctx.setSinkId === 'function') {
            try {
                await this.ctx.setSinkId('default');
            } catch (error) {
                console.warn('Default loudspeaker output selection unavailable:', error);
            }
        }

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

        // Voice Space is a diffuse filtered reverb, not a repeating echo. A
        // deterministic impulse makes the tail consistent on every device.
        this.voiceEchoSend = this.ctx.createGain();
        this.voiceEchoSend.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoDelay = this.ctx.createDelay(0.5);
        this.voiceEchoDelay.delayTime.setValueAtTime(0.025, this.ctx.currentTime);
        this.voiceEchoConvolver = this.ctx.createConvolver();
        this.voiceEchoConvolver.buffer = this.createDiffuseReverbImpulse(2.8, 3.2, 731);
        this.voiceEchoFilter = this.ctx.createBiquadFilter();
        this.voiceEchoFilter.type = 'lowpass';
        this.voiceEchoFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.voiceEchoWetGain = this.ctx.createGain();
        this.voiceEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoSend.connect(this.voiceEchoDelay);
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

        // Background Music Space uses the same non-repeating diffuse design.
        // Its send is placed after the dry music tone shaping below.
        this.musicEchoSend = this.ctx.createGain();
        this.musicEchoSend.gain.setValueAtTime(0, this.ctx.currentTime);
        this.musicEchoDelay = this.ctx.createDelay(0.5);
        this.musicEchoDelay.delayTime.setValueAtTime(0.018, this.ctx.currentTime);
        this.musicEchoConvolver = this.ctx.createConvolver();
        this.musicEchoConvolver.buffer = this.createDiffuseReverbImpulse(1.8, 4.2, 1777);
        this.musicEchoFilter = this.ctx.createBiquadFilter();
        this.musicEchoFilter.type = 'lowpass';
        this.musicEchoFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.musicEchoWetGain = this.ctx.createGain();
        this.musicEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.musicEchoSend.connect(this.musicEchoDelay);
        this.musicEchoDelay.connect(this.musicEchoConvolver);
        this.musicEchoConvolver.connect(this.musicEchoFilter);
        this.musicEchoFilter.connect(this.musicEchoWetGain);

        // One final music-only gate controls both dry music and its echo.
        // This makes mantra muting complete and click-free without touching
        // the drone master gain.
        this.bgMusicBusGain = this.ctx.createGain();
        this.bgMusicBusGain.gain.setValueAtTime(1, this.ctx.currentTime);

        // Create the spatial buses before any source is connected to them.
        // Some browsers reject AudioNode.connect() when the destination is
        // still null, which would prevent the entire audio context starting.
        this.spatialMusicPanner = this.createSpatialPanner();

        this.bgMusicGain.connect(this.bgMusicEQ);
        this.bgMusicEQ.connect(this.bgMusicLPF);
        this.bgMusicLPF.connect(this.bgMusicHumFilter);
        this.bgMusicHumFilter.connect(this.bgMusicSmoothGain);
        this.bgMusicSmoothGain.connect(this.bgMusicBusGain);
        this.bgMusicSmoothGain.connect(this.musicEchoSend);
        this.musicEchoWetGain.connect(this.bgMusicBusGain);
        this.bgMusicBusGain.connect(this.spatialMusicPanner);
        this.spatialMusicPanner.connect(this.lowCutFilter);

        // The optional pleasure ambience bypasses the background-music bus so
        // mantra muting cannot accidentally cut or reopen it. Keep the source
        // at unity so its parallel harmonic layer can work on the original
        // signal before both paths are reduced to the barely-audible mix level.
        this.pleasureSourceGain = this.ctx.createGain();
        this.pleasureSourceGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.pleasureGain = this.ctx.createGain();
        this.pleasureGain.gain.setValueAtTime(state.pleasureAmbienceGain, this.ctx.currentTime);

        // Parallel harmonic enrichment: the original ambience stays clean,
        // while a very quiet oversampled soft-clip path adds gentle presence.
        // This is dedicated to pleasure.mp3 and cannot colour narration,
        // mantras, drones, or background music.
        this.pleasureEnhancer = this.ctx.createWaveShaper();
        this.pleasureEnhancer.curve = this.makeDistortionCurve(0.12);
        this.pleasureEnhancer.oversample = '2x';
        this.pleasureEnhancerGain = this.ctx.createGain();
        this.pleasureEnhancerGain.gain.setValueAtTime(
            state.pleasureAmbienceGain * PLEASURE_AMBIENCE_HARMONIC_MIX,
            this.ctx.currentTime
        );
        this.pleasureBlurFilter = this.ctx.createBiquadFilter();
        this.pleasureBlurFilter.type = 'lowpass';
        this.pleasureBlurFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
        this.pleasureBlurFilter.Q.setValueAtTime(0.35, this.ctx.currentTime);
        this.pleasureBlurConvolver = this.ctx.createConvolver();
        this.pleasureBlurConvolver.buffer = this.createImpulseResponse(0.9, 4.5);
        this.pleasureBlurDryGain = this.ctx.createGain();
        this.pleasureBlurWetGain = this.ctx.createGain();
        const blurMix = getPleasureBlurMix(state.pleasureAmbienceBlur);
        this.pleasureBlurDryGain.gain.setValueAtTime(blurMix.dry, this.ctx.currentTime);
        this.pleasureBlurWetGain.gain.setValueAtTime(blurMix.wet, this.ctx.currentTime);
        this.spatialPleasurePanner = this.createSpatialPanner();
        if ('distanceModel' in this.spatialPleasurePanner) {
            this.spatialPleasurePanner.distanceModel = 'inverse';
            this.spatialPleasurePanner.refDistance = 1;
            this.spatialPleasurePanner.maxDistance = 100;
            this.spatialPleasurePanner.rolloffFactor = 0.55;
        }
        this.pleasureSpatialDepthGain = this.ctx.createGain();
        this.pleasureSpatialDepthGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.pleasureSourceGain.connect(this.pleasureGain);
        this.pleasureSourceGain.connect(this.pleasureEnhancer);
        this.pleasureEnhancer.connect(this.pleasureEnhancerGain);
        this.pleasureGain.connect(this.pleasureBlurDryGain);
        this.pleasureGain.connect(this.pleasureBlurFilter);
        this.pleasureEnhancerGain.connect(this.pleasureBlurDryGain);
        this.pleasureEnhancerGain.connect(this.pleasureBlurFilter);
        this.pleasureBlurFilter.connect(this.pleasureBlurConvolver);
        this.pleasureBlurDryGain.connect(this.pleasureSpatialDepthGain);
        this.pleasureBlurConvolver.connect(this.pleasureBlurWetGain);
        this.pleasureBlurWetGain.connect(this.pleasureSpatialDepthGain);
        this.pleasureSpatialDepthGain.connect(this.spatialPleasurePanner);
        this.spatialPleasurePanner.connect(this.lowCutFilter);

        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.masterLimiter);

        this.pannerNode = this.ctx.createStereoPanner();
        
        const pannerLfo = this.ctx.createOscillator();
        const pannerLfoGain = this.ctx.createGain();
        pannerLfo.type = 'sine';
        pannerLfo.frequency.setValueAtTime(0.03, this.ctx.currentTime);
        pannerLfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.spatialPanLfoGain = pannerLfoGain;
        pannerLfo.connect(pannerLfoGain);
        pannerLfoGain.connect(this.pannerNode.pan);
        pannerLfo.start();

        // Keep the source buses separate until after their spatial treatment.
        // A PannerNode can render HRTF positioning for headphones; ordinary
        // speakers receive a safe stereo/equal-power fallback.
        this.spatialDronePanner = this.createSpatialPanner();
        this.spatialMantraPanner = this.createSpatialPanner();

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
        this.pannerNode.connect(this.spatialDronePanner);
        this.spatialDronePanner.connect(this.lowCutFilter);

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
        if (state.eyesCloseMode && !state.noFrequencyMode) {
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
        // Mantras receive their own long, filtered tail. It is spatialized
        // with the mantra rather than being sent through narration or music.
        this.mantraTailConvolver = this.ctx.createConvolver();
        this.mantraTailConvolver.buffer = this.createImpulseResponse(
            MANTRA_REVERB_TAIL_SECONDS,
            MANTRA_REVERB_TAIL_DECAY
        );
        this.mantraTailFilter = this.ctx.createBiquadFilter();
        this.mantraTailFilter.type = 'lowpass';
        this.mantraTailFilter.frequency.setValueAtTime(4200, this.ctx.currentTime);
        this.mantraTailWetGain = this.ctx.createGain();
        this.mantraTailWetGain.gain.setValueAtTime(MANTRA_REVERB_TAIL_WET, this.ctx.currentTime);
        this.mantraGain.connect(this.mantraFilter);
        this.mantraFilter.connect(this.spatialMantraPanner);
        this.mantraFilter.connect(this.mantraTailConvolver);
        this.mantraTailConvolver.connect(this.mantraTailFilter);
        this.mantraTailFilter.connect(this.mantraTailWetGain);
        this.mantraTailWetGain.connect(this.spatialMantraPanner);
        this.spatialMantraPanner.connect(this.lowCutFilter);

        // Apply initial Eyes Close state
        this.toggleEyesCloseMode(state.eyesCloseMode);

        this.isInitialized = true;
        this.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
        this.setVoiceEcho(state.voiceEcho);
        this.setMusicEcho(state.musicEcho);
        this.setSpatialMode(state.spatialMode);
        this.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
    }

    createSpatialPanner() {
        if (this.ctx?.createPanner) {
            const panner = this.ctx.createPanner();
            panner.distanceModel = 'inverse';
            panner.refDistance = 1;
            panner.maxDistance = 10000;
            panner.rolloffFactor = 0;
            panner.panningModel = 'equalpower';
            if (panner.positionX) {
                panner.positionX.value = 0;
                panner.positionY.value = 0;
                panner.positionZ.value = -1;
            } else if (typeof panner.setPosition === 'function') {
                panner.setPosition(0, 0, -1);
            }
            return panner;
        }
        return this.ctx.createStereoPanner();
    }

    setSpatialPosition(node, position, now) {
        if (!node) return;
        if (node.positionX && node.positionY && node.positionZ) {
            [['x', node.positionX], ['y', node.positionY], ['z', node.positionZ]].forEach(([axis, param]) => {
                param.cancelScheduledValues(now);
                param.setValueAtTime(param.value, now);
                param.linearRampToValueAtTime(position[axis], now + 1.2);
            });
        } else if (node.pan) {
            node.pan.cancelScheduledValues(now);
            node.pan.setValueAtTime(node.pan.value, now);
            node.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, position.x)), now + 1.2);
        } else if (typeof node.setPosition === 'function') {
            node.setPosition(position.x, position.y, position.z);
        }
    }

    schedulePleasureSpatialApproach() {
        if (!this.ctx || !this.spatialPleasurePanner || !this.pleasureSpatialPosition) return;
        const now = this.ctx.currentTime;
        const position = this.pleasureSpatialPosition;
        const isSpatial = this.spatialMode !== 'off';
        const profile = getPleasureAmbienceIntensityProfile();
        const approachSeconds = profile.approachSeconds;

        if (this.spatialPleasurePanner.positionZ) {
            const nearZ = Number(position.nearZ ?? position.z) * profile.nearDistanceMultiplier;
            this.spatialPleasurePanner.positionZ.cancelScheduledValues(now);
            this.spatialPleasurePanner.positionZ.setValueAtTime(Number(position.z), now);
            this.spatialPleasurePanner.positionZ.linearRampToValueAtTime(
                isSpatial ? nearZ : -1,
                now + (isSpatial ? approachSeconds : 0)
            );
        } else if (this.pleasureSpatialDepthGain) {
            // StereoPanner fallback: approximate distance with a gentle gain
            // approach when true 3D distance positioning is unavailable.
            const target = isSpatial ? profile.fallbackNearGain : 1;
            this.pleasureSpatialDepthGain.gain.cancelScheduledValues(now);
            this.pleasureSpatialDepthGain.gain.setValueAtTime(
                isSpatial ? PLEASURE_SPATIAL_FALLBACK_FAR_GAIN : 1,
                now
            );
            this.pleasureSpatialDepthGain.gain.linearRampToValueAtTime(
                target,
                now + (isSpatial ? approachSeconds : 0)
            );
        }
    }

    setSpatialMode(mode = DEFAULT_SPATIAL_MODE) {
        const normalized = normalizeSpatialMode(mode);
        this.spatialMode = normalized;
        if (!this.ctx || !this.spatialDronePanner || !this.spatialMusicPanner || !this.spatialMantraPanner || !this.spatialPleasurePanner) return;

        const configurations = {
            off: {
                model: 'equalpower', lfo: 0.30,
                drone: { x: 0, y: 0, z: -1 }, music: { x: 0, y: 0, z: -1 }, mantra: { x: 0, y: 0, z: -1 }, pleasure: { x: 0, y: 0, z: -1, nearZ: -1 }
            },
            stereo: {
                model: 'equalpower', lfo: 0.38,
                drone: { x: 0, y: -0.05, z: -1 }, music: { x: -0.28, y: 0, z: -1 }, mantra: { x: 0.28, y: 0, z: -1 }, pleasure: { x: 0, y: 0.15, z: -6, nearZ: -2.4 }
            },
            headphones: {
                model: 'HRTF', lfo: 0.08,
                drone: { x: 0, y: -0.45, z: 0.65 }, music: { x: -0.65, y: 0.12, z: -0.75 }, mantra: { x: 0.65, y: 0.16, z: 0.25 }, pleasure: { x: 0, y: 0.2, z: -7, nearZ: -2.8 }
            },
            room: {
                model: 'equalpower', lfo: 0.14,
                drone: { x: 0, y: -0.20, z: 0.35 }, music: { x: -0.22, y: 0, z: -0.85 }, mantra: { x: 0.22, y: 0.16, z: 0.30 }, pleasure: { x: 0, y: 0.25, z: -6.5, nearZ: -2.5 }
            }
        }[normalized];
        const now = this.ctx.currentTime;
        [this.spatialDronePanner, this.spatialMusicPanner, this.spatialMantraPanner, this.spatialPleasurePanner].forEach((panner) => {
            if ('panningModel' in panner) panner.panningModel = configurations.model;
        });
        this.setSpatialPosition(this.spatialDronePanner, configurations.drone, now);
        this.setSpatialPosition(this.spatialMusicPanner, configurations.music, now);
        this.setSpatialPosition(this.spatialMantraPanner, configurations.mantra, now);
        this.pleasureSpatialPosition = configurations.pleasure;
        this.setSpatialPosition(this.spatialPleasurePanner, configurations.pleasure, now);
        if (this.pleasureLoops.some(loop => loop.isRunning)) this.schedulePleasureSpatialApproach();
        if (this.spatialPanLfoGain) {
            this.spatialPanLfoGain.gain.cancelScheduledValues(now);
            this.spatialPanLfoGain.gain.setValueAtTime(this.spatialPanLfoGain.gain.value, now);
            this.spatialPanLfoGain.gain.linearRampToValueAtTime(configurations.lfo, now + 1.2);
        }
        // Spatial sound adds an ethereal presence to narration through the
        // voice-only ambience bus while keeping the dry voice centered.
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
        if (!this.ctx || !this.voiceEchoSend || !this.voiceEchoDelay || !this.voiceEchoConvolver || !this.voiceEchoWetGain) return;
        const voiceEchoSettings = {
            off: { delay: 0.025, wet: 0, filter: 3200 },
            light: { delay: 0.025, wet: 0.14, filter: 3200 },
            spacious: { delay: 0.04, wet: 0.20, filter: 3600 },
            // A stronger, centered heavenly ambience for Spatial Sound. The
            // dry narration remains untouched; only the stereo wet return
            // widens, so the words remain clear at the centre.
            ethereal: { delay: 0.06, wet: 0.24, filter: 4600 }
        };
        const requestedMode = Object.prototype.hasOwnProperty.call(voiceEchoSettings, mode) ? mode : 'off';
        const effectiveMode = this.spatialMode !== 'off' ? 'ethereal' : requestedMode;
        const settings = voiceEchoSettings[effectiveMode];
        const now = this.ctx.currentTime;
        [this.voiceEchoDelay.delayTime, this.voiceEchoSend.gain, this.voiceEchoWetGain.gain, this.voiceEchoFilter.frequency].forEach(param => {
            param.cancelScheduledValues(now);
            param.setValueAtTime(param.value, now);
        });
        this.voiceEchoDelay.delayTime.linearRampToValueAtTime(settings.delay, now + 0.25);
        this.voiceEchoSend.gain.linearRampToValueAtTime(settings.wet > 0 ? 1 : 0, now + 0.25);
        this.voiceEchoWetGain.gain.linearRampToValueAtTime(settings.wet, now + 0.25);
        this.voiceEchoFilter.frequency.linearRampToValueAtTime(settings.filter, now + 0.25);
    }

    setMusicEcho(mode = 'light') {
        if (!this.ctx || !this.musicEchoSend || !this.musicEchoDelay || !this.musicEchoConvolver || !this.musicEchoWetGain) return;
        const settings = {
            off: { delay: 0.018, wet: 0, filter: 2800 },
            light: { delay: 0.018, wet: 0.12, filter: 2800 },
            spacious: { delay: 0.035, wet: 0.18, filter: 3400 }
        }[mode] || { delay: 0.018, wet: 0.12, filter: 2800 };
        const now = this.ctx.currentTime;
        this.musicEchoDelay.delayTime.cancelScheduledValues(now);
        this.musicEchoDelay.delayTime.setValueAtTime(this.musicEchoDelay.delayTime.value, now);
        this.musicEchoDelay.delayTime.linearRampToValueAtTime(settings.delay, now + 0.25);
        this.musicEchoSend.gain.cancelScheduledValues(now);
        this.musicEchoSend.gain.setValueAtTime(this.musicEchoSend.gain.value, now);
        this.musicEchoSend.gain.linearRampToValueAtTime(settings.wet > 0 ? 1 : 0, now + 0.25);
        this.musicEchoWetGain.gain.cancelScheduledValues(now);
        this.musicEchoWetGain.gain.setValueAtTime(this.musicEchoWetGain.gain.value, now);
        this.musicEchoWetGain.gain.linearRampToValueAtTime(settings.wet, now + 0.25);
        this.musicEchoFilter.frequency.cancelScheduledValues(now);
        this.musicEchoFilter.frequency.setValueAtTime(this.musicEchoFilter.frequency.value, now);
        this.musicEchoFilter.frequency.linearRampToValueAtTime(settings.filter, now + 0.25);
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
        // Biquad gain is a signed decibel parameter. Exponential ramps cannot
        // cross zero or target a negative value, so use a linear transition.
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(bgNotchGain, now + 2.5);
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

    createDiffuseReverbImpulse(duration, decay, seed) {
        const sampleRate = this.ctx.sampleRate;
        const length = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = this.ctx.createBuffer(2, length, sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let randomState = (seed + (channel * 104729)) >>> 0;
            for (let i = 0; i < length; i++) {
                // Deterministic decorrelated noise produces a diffuse tail,
                // with no periodic feedback repeats and no session-to-session
                // character change.
                randomState = (1664525 * randomState + 1013904223) >>> 0;
                const noise = (randomState / 4294967296) * 2 - 1;
                const envelope = Math.pow(1 - (i / length), decay);
                data[i] = noise * envelope;
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
        if (state.noFrequencyMode) return;
        
        this.startElementalLayer(index);

        // Reject malformed custom-script values at the audio boundary as a
        // final safeguard.
        const requestedFrequency = Number(baseFreq);
        const safeBaseFrequency = Number.isFinite(requestedFrequency) && requestedFrequency >= 1
            ? Math.min(requestedFrequency, 20000)
            : 110;
        // Preserve the configured chakra/HRIM frequency exactly. Higher
        // frequencies must not be octave-shifted for comfort; the JSON value
        // is the authoritative main-drone pitch.
        const droneFreq = safeBaseFrequency;
        
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.04, this.ctx.currentTime); 
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(droneFreq * 0.001, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfo.start();
        this.vibrationLFO = lfo;

        // Keep one restrained main tone. The previous half-frequency lower
        // oscillator was intentionally removed so the drone stays clean.
        const mainOscillator = this.ctx.createOscillator();
        const mainDroneGain = this.ctx.createGain();
        mainOscillator.type = 'sine';
        mainOscillator.frequency.setValueAtTime(droneFreq, this.ctx.currentTime);
        lfoGain.connect(mainOscillator.frequency);
        const mainDroneFilter = this.ctx.createBiquadFilter();
        mainDroneFilter.type = 'lowpass';
        mainDroneFilter.frequency.setValueAtTime(droneFreq * 1.1, this.ctx.currentTime);
        mainDroneFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);
        mainDroneGain.gain.setValueAtTime(0, this.ctx.currentTime);
        mainDroneGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 6);
        mainOscillator.connect(mainDroneFilter);
        mainDroneFilter.connect(mainDroneGain);
        mainDroneGain.connect(this.masterGain);
        mainOscillator.start();
        this.droneOscillators.push({ osc: mainOscillator, gain: mainDroneGain });

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

    startSleepDrone(beatFrequency) {
        this.stopDrone();
        if (state.noFrequencyMode) return;

        const requestedBeat = Number(beatFrequency);
        const beat = Number.isFinite(requestedBeat) ? Math.min(20000, Math.max(0.1, requestedBeat)) : 6;
        const now = this.ctx.currentTime;
        const carrier = 80;

        // Sleep targets are script-defined and are played directly as the
        // main oscillator, including very low values such as 2 Hz. A gentle
        // stereo 80 Hz support pair remains available for the beat texture.
        const mainOscillator = this.ctx.createOscillator();
        const mainGain = this.ctx.createGain();
        const mainFilter = this.ctx.createBiquadFilter();
        mainOscillator.type = 'sine';
        mainOscillator.frequency.setValueAtTime(beat, now);
        mainFilter.type = 'lowpass';
        mainFilter.frequency.setValueAtTime(220, now);
        mainFilter.Q.setValueAtTime(0.5, now);
        mainGain.gain.setValueAtTime(0, now);
        mainGain.gain.linearRampToValueAtTime(0.06, now + 6);
        mainOscillator.connect(mainFilter);
        mainFilter.connect(mainGain);
        mainGain.connect(this.masterGain);
        mainOscillator.start(now);
        this.droneOscillators.push({ osc: mainOscillator, gain: mainGain });

        const leftOsc = this.ctx.createOscillator();
        const rightOsc = this.ctx.createOscillator();
        const leftPanner = this.ctx.createStereoPanner();
        const rightPanner = this.ctx.createStereoPanner();
        const binauralGain = this.ctx.createGain();
        leftPanner.pan.setValueAtTime(-1, now);
        rightPanner.pan.setValueAtTime(1, now);
        leftOsc.frequency.setValueAtTime(carrier, now);
        rightOsc.frequency.setValueAtTime(carrier + beat, now);
        binauralGain.gain.setValueAtTime(0, now);
        binauralGain.gain.linearRampToValueAtTime(0.002, now + 10);
        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);
        leftPanner.connect(binauralGain);
        rightPanner.connect(binauralGain);
        binauralGain.connect(this.masterGain);
        leftOsc.start(now);
        rightOsc.start(now);
        this.binauralNodes = [leftOsc, rightOsc, binauralGain];
    }

    startFrequencyShot(frequency) {
        this.stopFrequencyShot();
        if (state.noFrequencyMode) {
            throw new Error('No Frequency Mode prevents frequency-only Shots.');
        }
        const requested = Number(frequency);
        if (!this.ctx || !Number.isFinite(requested) || requested <= 0 || requested > 20000) {
            throw new Error('Shot frequency must be between 0 and 20,000 Hz.');
        }
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(requested, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(Math.max(0.001, state.volDrone), now + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        this.shotOscillator = osc;
        this.shotGain = gain;
    }

    stopFrequencyShot() {
        if (!this.ctx || !this.shotOscillator || !this.shotGain) return;
        const now = this.ctx.currentTime;
        const osc = this.shotOscillator;
        const gain = this.shotGain;
        this.shotOscillator = null;
        this.shotGain = null;
        try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(Math.max(0, gain.gain.value), now);
            gain.gain.linearRampToValueAtTime(0, now + 0.08);
            osc.stop(now + 0.1);
        } catch (error) {}
    }

    stopBinaural() {
        if (!this.ctx) {
            this.binauralNodes = [];
            return;
        }
        const now = this.ctx.currentTime;
        this.binauralNodes.forEach(node => {
            if (typeof AudioParam !== 'undefined' && node instanceof AudioParam) return;
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
        if (!this.ctx) {
            this.binauralNodes = [];
            this.droneOscillators = [];
            this.groundingAnchor = null;
            this.elementalNodes = [];
            this.vibrationLFO = null;
            return;
        }
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
        if (state.noMantraMode) return;
        const filePath = MANTRA_AUDIO_MAP[key];
        if (!filePath) return;

        const requestId = ++this.mantraRequestId;
        this.stopMantraTrack({ restoreMusic: false, invalidate: false });

        try {
            if (!this.mantraBuffer[key]) {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to fetch ${filePath}`);
                const arrayBuffer = await response.arrayBuffer();
                this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);
            }

            // Keep the already-ducked music bed alive while a first-use
            // mantra file is loading. Starting this mute before decoding could
            // create an avoidable silent gap on slower devices. The dedicated
            // gate still silences both dry music and its echo tail.
            const musicFade = this.muteBackgroundMusicForMantra(MANTRA_MUSIC_FADE_SECONDS);

            // Cached mantra files can be ready immediately. Keep the same
            // deliberate handoff in that case: music must finish fading before
            // the mantra source starts.
            if (musicFade) {
                const elapsedMs = (this.ctx.currentTime - musicFade.startedAt) * 1000;
                const remainingMs = Math.max(0, musicFade.duration * 1000 - elapsedMs);
                if (remainingMs > 0) await new Promise(resolve => setTimeout(resolve, remainingMs));
            }
            if (requestId !== this.mantraRequestId || state.noMantraMode) return;

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
            if (requestId === this.mantraRequestId) this.restoreBackgroundMusicAfterMantra();
        }
    }

    stopMantraTrack({ restoreMusic = true, invalidate = true } = {}) {
        if (invalidate) this.mantraRequestId += 1;
        if (!this.mantraLoop) {
            if (restoreMusic) this.restoreBackgroundMusicAfterMantra();
            return;
        }
        const now = this.ctx.currentTime;

        if (this.mantraPresenceLFO) {
            try { this.mantraPresenceLFO.stop(); } catch(e) {}
            this.mantraPresenceLFO = null;
        }

        this.mantraGain.gain.cancelScheduledValues(now);
        this.mantraGain.gain.setValueAtTime(this.mantraGain.gain.value, now);
        this.mantraGain.gain.linearRampToValueAtTime(0, now + MANTRA_FADE_SECONDS);

        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(state.volDrone, now + 6);
        }

        // Restore elemental layer subtly after mantra
        this.elementalNodes.forEach(({ gain }) => {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.015, now + 4);
        });

        this.mantraLoop.stop(MANTRA_FADE_SECONDS);
        this.mantraLoop = null;

        // Keep music muted until the mantra fade is complete. Restoring it
        // immediately would create an avoidable overlap at every chakra.
        if (restoreMusic) {
            this.cancelBackgroundMusicRestore();
            this.bgMusicRestoreTimer = setTimeout(() => {
                this.bgMusicRestoreTimer = null;
                this.restoreBackgroundMusicAfterMantra();
            }, MANTRA_FADE_SECONDS * 1000);
        }
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
            const response = await fetch(BACKGROUND_MUSIC_URL, { cache: 'reload' });
            const arrayBuffer = await response.arrayBuffer();
            this.bgMusicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        }

        // Reusing the active loop preserves its timeline and avoids an
        // audible restart when an experience enters another stage.
        if (this.bgMusicLoop?.isRunning) {
            return;
        }

        // A previously stopped loop may still be completing its fade. Let it
        // finish while the new loop fades in instead of cutting it abruptly.
        if (this.bgMusicLoop) {
            this.bgMusicLoop.stop(BACKGROUND_MUSIC_STOP_FADE_SECONDS);
        }

        this.cancelBackgroundMusicRestore();
        this.bgMusicSuppressedByMantra = false;
        // A stopped loop leaves the shared outer gain at its previous target.
        // Reset it before creating the replacement so a restart cannot bypass
        // the deliberate entry fade through stale gain state.
        if (this.bgMusicGain) {
            const now = this.ctx.currentTime;
            this.bgMusicGain.gain.cancelScheduledValues(now);
            this.bgMusicGain.gain.setValueAtTime(0, now);
        }
        if (this.bgMusicBusGain) {
            const now = this.ctx.currentTime;
            this.bgMusicBusGain.gain.cancelScheduledValues(now);
            this.bgMusicBusGain.gain.setValueAtTime(1, now);
        }

        // Match the source-loop startup envelope to the outer music gain.
        // Keeping both at the full entry duration prevents a restarted loop
        // from becoming audible through its inner 3-second fade while the
        // outer gain still carries a previous session's level.
        this.bgMusicLoop = new SeamlessLoop(
            this.ctx,
            this.bgMusicBuffer,
            this.bgMusicGain,
            1.0,
            BACKGROUND_MUSIC_ENTRY_FADE_SECONDS
        );
        this.bgMusicLoop.start();
    }

    async loadPleasureAmbienceBuffers() {
        const customUrl = normalizePleasureAmbienceUrl(state.pleasureAmbienceUrl);
        const manifestKey = customUrl || 'manifest-primary';
        if (this.pleasureManifest && this.pleasureManifestKey === manifestKey) return this.pleasureBuffers;

        const response = await fetch(PLEASURE_AMBIENCE_MANIFEST_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to fetch ${PLEASURE_AMBIENCE_MANIFEST_URL}`);
        const manifest = await response.json();
        const entries = Array.isArray(manifest) ? manifest : manifest?.files;
        if (!Array.isArray(entries)) throw new Error('Pleasure ambience manifest has no files array');

        // The app reads the folder manifest instead of embedding individual
        // filenames. The manifest accepts pleasure.mp3, pleasure-1.ogg,
        // pleasure-2.wav, and any other browser-decodable audio extension.
        const manifestPaths = entries
            .map(entry => typeof entry === 'string' ? entry.trim() : '')
            .map(entry => entry.replace(/^\.\/?/, '').replace(/^audio\//i, ''))
            .filter(entry => /^pleasure(?:-\d+)?\.[^./]+$/i.test(entry))
            .map(entry => `audio/${entry}`);
        const serialPaths = manifestPaths.filter(path => !/^audio\/pleasure\.[^./]+$/i.test(path));
        const paths = customUrl ? [customUrl, ...serialPaths] : manifestPaths;
        this.pleasureManifest = [...new Set(paths)];
        this.pleasureManifestKey = manifestKey;
        if (!this.pleasureManifest.length) throw new Error('Pleasure ambience manifest contains no valid audio files');

        try {
            await Promise.all(this.pleasureManifest.map(async path => {
                if (this.pleasureBuffers.has(path)) return;
                try {
                    const assetResponse = await fetch(path, { cache: 'no-store' });
                    if (!assetResponse.ok) throw new Error(`HTTP ${assetResponse.status}`);
                    const arrayBuffer = await assetResponse.arrayBuffer();
                    const buffer = await this.ctx.decodeAudioData(arrayBuffer);
                    if (buffer) this.pleasureBuffers.set(path, buffer);
                } catch (error) {
                    if (path === customUrl) throw new Error(`Unable to load the pleasure ambience URL (${error.message})`);
                    // Manifest layers are optional local assets. A missing
                    // optional file is normal while a contributor is moving
                    // or replacing the local pleasure source, so do not turn
                    // an expected 404 into console noise. Keep other decode,
                    // network, and format failures visible for diagnosis.
                    if (error?.message !== 'HTTP 404') {
                        console.warn(`[Pleasure Ambience] skipped ${path}:`, error);
                    }
                }
            }));
        } catch (error) {
            // Do not retain a partially decoded custom source. A later retry
            // must fetch and validate the selected URL again.
            this.pleasureManifest = null;
            this.pleasureManifestKey = null;
            this.pleasureBuffers.clear();
            throw error;
        }

        if (!this.pleasureBuffers.size) throw new Error('No pleasure ambience files could be decoded');
        return this.pleasureBuffers;
    }

    async loadPleasureAmbienceUrl(url) {
        const rawUrl = String(url ?? '').trim();
        const normalizedUrl = normalizePleasureAmbienceUrl(rawUrl);
        if (rawUrl && !normalizedUrl) {
            throw new Error('Please enter a valid HTTP or HTTPS audio URL.');
        }

        const previousUrl = state.pleasureAmbienceUrl;
        const previousAmbienceEnabled = state.moodRelaxationIntentionEnabled;
        const shouldRestart = previousAmbienceEnabled && this.ctx && !state.noFrequencyMode;
        this.stopPleasureAmbience();
        this.pleasureManifest = null;
        this.pleasureManifestKey = null;
        this.pleasureBuffers.clear();
        this.pleasureAudioAvailable = null;
        state.pleasureAmbienceUrl = normalizedUrl;

        try {
            // Decode the candidate before persisting it. This keeps a bad URL
            // from becoming the source used by the next journey.
            if (!this.isInitialized) await this.init();
            await this.loadPleasureAmbienceBuffers();
            this.pleasureAudioAvailable = true;
            if (normalizedUrl) localStorage.setItem(PLEASURE_AMBIENCE_URL_STORAGE_KEY, normalizedUrl);
            else localStorage.removeItem(PLEASURE_AMBIENCE_URL_STORAGE_KEY);
            syncPleasureAmbienceControl();
            if (shouldRestart) {
                const started = await this.startPleasureAmbience();
                if (!started) throw new Error('The pleasure ambience could not start. Check the URL and its CORS permissions.');
            }
            return normalizedUrl;
        } catch (error) {
            // Restore the previous preference and, when possible, the active
            // ambience so an unsuccessful edit does not disrupt a journey.
            state.pleasureAmbienceUrl = previousUrl;
            if (previousUrl) localStorage.setItem(PLEASURE_AMBIENCE_URL_STORAGE_KEY, previousUrl);
            else localStorage.removeItem(PLEASURE_AMBIENCE_URL_STORAGE_KEY);
            this.stopPleasureAmbience();
            this.pleasureManifest = null;
            this.pleasureManifestKey = null;
            this.pleasureBuffers.clear();
            this.pleasureAudioAvailable = null;
            state.moodRelaxationIntentionEnabled = previousAmbienceEnabled;
            if (shouldRestart) {
                try {
                    await this.loadPleasureAmbienceBuffers();
                    this.pleasureAudioAvailable = true;
                    await this.startPleasureAmbience();
                } catch (restoreError) {
                    this.pleasureAudioAvailable = false;
                    console.warn('[Pleasure Ambience] previous source could not be restored:', restoreError);
                }
            }
            syncPleasureAmbienceControl();
            throw error;
        }
    }

    async startPleasureAmbience() {
        if (!state.moodRelaxationIntentionEnabled || state.noFrequencyMode || !this.ctx || !this.pleasureGain) return false;
        if (this.pleasureAudioAvailable === false) return false;
        // Reapply the session profile whenever a journey stage asks for the
        // ambience. All manifest layers share this same processing bus, so
        // blur remains consistent for the complete journey and after a
        // stop/restart without touching narration, mantra, or frequencies.
        if (this.pleasureLoops.some(loop => loop.isRunning)) {
            this.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
            return true;
        }

        const generation = ++this.pleasureGeneration;
        try {
            await this.loadPleasureAmbienceBuffers();
            this.pleasureAudioAvailable = true;
            syncPleasureAmbienceControl();
            if (generation !== this.pleasureGeneration || !state.moodRelaxationIntentionEnabled || state.noFrequencyMode) return false;

            this.pleasureLoops = [...this.pleasureBuffers.values()].map(buffer => {
                const loop = new SeamlessLoop(
                    this.ctx,
                    buffer,
                    this.pleasureSourceGain,
                    1.0,
                    PLEASURE_AMBIENCE_FADE_SECONDS
                );
                loop.start();
                return loop;
            });
            this.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
            return this.pleasureLoops.length > 0;
        } catch (error) {
            if (generation === this.pleasureGeneration) {
                this.pleasureAudioAvailable = false;
                syncPleasureAmbienceControl();
                console.warn('[Pleasure Ambience] audio could not start:', error);
            }
            return false;
        }
    }

    stopPleasureAmbience(fadeTime = PLEASURE_AMBIENCE_FADE_SECONDS) {
        this.pleasureGeneration += 1;
        this.pleasureLoops.forEach(loop => loop.stop(Math.max(0, fadeTime)));
        this.pleasureLoops = [];
        // A stopped loop may otherwise leave its decoded AudioBuffer available
        // for the next journey, causing a moved or replaced local file to keep
        // playing until a full page reload.
        this.pleasureManifest = null;
        this.pleasureManifestKey = null;
        this.pleasureBuffers.clear();
    }

    setPleasureAmbienceGain(gain) {
        const level = clampPleasureAmbienceGain(gain);
        if (!this.ctx || !this.pleasureGain || !this.pleasureEnhancerGain) return level;
        const profile = getPleasureAmbienceIntensityProfile();
        const now = this.ctx.currentTime;
        this.pleasureGain.gain.cancelScheduledValues(now);
        this.pleasureGain.gain.setValueAtTime(this.pleasureGain.gain.value, now);
        this.pleasureGain.gain.linearRampToValueAtTime(level, now + 0.5);
        this.pleasureEnhancerGain.gain.cancelScheduledValues(now);
        this.pleasureEnhancerGain.gain.setValueAtTime(this.pleasureEnhancerGain.gain.value, now);
        this.pleasureEnhancerGain.gain.linearRampToValueAtTime(
            level * profile.harmonicMix,
            now + 0.5
        );
        return level;
    }

    setPleasureAmbienceBlur(enabled = true) {
        const blurEnabled = Boolean(enabled);
        if (!this.ctx || !this.pleasureBlurDryGain || !this.pleasureBlurWetGain) return blurEnabled;
        const profile = getPleasureAmbienceIntensityProfile();
        const blurMix = getPleasureBlurMix(blurEnabled);
        const now = this.ctx.currentTime;
        if (this.pleasureBlurFilter) {
            this.pleasureBlurFilter.frequency.cancelScheduledValues(now);
            this.pleasureBlurFilter.frequency.setValueAtTime(this.pleasureBlurFilter.frequency.value, now);
            this.pleasureBlurFilter.frequency.linearRampToValueAtTime(profile.blurCutoff, now + 1.2);
        }
        this.pleasureBlurDryGain.gain.cancelScheduledValues(now);
        this.pleasureBlurDryGain.gain.setValueAtTime(this.pleasureBlurDryGain.gain.value, now);
        this.pleasureBlurDryGain.gain.linearRampToValueAtTime(
            blurMix.dry,
            now + 1.2
        );
        this.pleasureBlurWetGain.gain.cancelScheduledValues(now);
        this.pleasureBlurWetGain.gain.setValueAtTime(this.pleasureBlurWetGain.gain.value, now);
        this.pleasureBlurWetGain.gain.linearRampToValueAtTime(
            blurMix.wet,
            now + 1.2
        );
        return blurEnabled;
    }

    setPleasureAmbienceIntensity(intensity = 'gentle') {
        state.pleasureAmbienceIntensity = normalizePleasureAmbienceIntensity(intensity);
        this.setPleasureAmbienceGain(state.pleasureAmbienceGain);
        this.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
        if (this.pleasureLoops.some(loop => loop.isRunning)) this.schedulePleasureSpatialApproach();
        return state.pleasureAmbienceIntensity;
    }

    fadeInBackgroundMusic(duration = 4, isDucked = false) {
        if (!this.bgMusicLoop || !this.ctx) return;
        
        // Support for boolean (legacy) and numeric (fine-tuned) volume levels
        // Whisper Quality: Keep narration clearly in front of a very quiet
        // atmospheric bed without muting the room completely.
        let factor = 1.0;
        if (isDucked === true) factor = 0.15;
        else if (typeof isDucked === 'number') factor = isDucked;

        const targetVol = state.volMusic * factor;
        const targetEQ = factor < 1.0 ? -12 : 0; // Deeper -12dB cut clears space for voice
        this.bgMusicTargetVolume = targetVol;
        this.bgMusicTargetEQ = targetEQ;
        
        const now = this.ctx.currentTime;
        
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        if (targetVol <= 0) {
            // Zero is a supported user setting. Linear ramps may end at zero,
            // keeping playback muted without aborting the journey.
            this.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        } else {
            const startVol = Math.max(0.0001, this.bgMusicGain.gain.value);
            this.bgMusicGain.gain.setValueAtTime(startVol, now);
            this.bgMusicGain.gain.exponentialRampToValueAtTime(targetVol, now + duration);
        }
        
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(targetEQ, now + duration);
        
        this.bgMusicLoop.setGain(1.0);

        // A narration request during the mantra fade may update the desired
        // level, but must not reopen the music bus until the mantra is done.
        if (this.bgMusicSuppressedByMantra) return;
        if (this.bgMusicBusGain) {
            this.bgMusicBusGain.gain.cancelScheduledValues(now);
            this.bgMusicBusGain.gain.setValueAtTime(this.bgMusicBusGain.gain.value, now);
            this.bgMusicBusGain.gain.linearRampToValueAtTime(1, now + duration);
        }
    }

    fadeOutBackgroundMusic(duration = 4) {
        if (!this.bgMusicLoop) return;
        // A manual volume adjustment must not revive a deliberately silent
        // practice such as Box Breathing. Mark this bus as intentionally
        // muted before the envelope reaches zero.
        this.bgMusicTargetVolume = 0;
        this.bgMusicTargetEQ = 0;
        const now = this.ctx.currentTime;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.cancelScheduledValues(now);

        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(0, now + duration);
    }

    setBackgroundMusicVolume(level, previousLevel = level) {
        if (!this.ctx || !this.bgMusicGain || !this.bgMusicLoop) return;
        const nextLevel = Number(level);
        const previous = Number(previousLevel);
        const currentTarget = Number(this.bgMusicTargetVolume);
        if (!Number.isFinite(nextLevel) || !Number.isFinite(previous) || previous <= 0 || !Number.isFinite(currentTarget)) return;

        // Preserve the current role of music (full bed, narration duck, or
        // intentional silence) instead of replacing the envelope with the
        // slider's full value. A zero target deliberately remains silent.
        const roleFactor = Math.max(0, Math.min(1, currentTarget / previous));
        const nextTarget = nextLevel * roleFactor;
        this.bgMusicTargetVolume = nextTarget;
        if (roleFactor === 0) return;

        const now = this.ctx.currentTime;
        const currentGain = this.bgMusicGain.gain.value;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(currentGain, now);
        // Do not wake a bus that is still intentionally at silence during a
        // fade; the next explicit fade-in remains responsible for that start.
        if (currentGain <= 0.0001) return;
        this.bgMusicGain.gain.linearRampToValueAtTime(nextTarget, now + 0.25);
    }

    cancelBackgroundMusicRestore() {
        if (this.bgMusicRestoreTimer) {
            clearTimeout(this.bgMusicRestoreTimer);
            this.bgMusicRestoreTimer = null;
        }
    }

    muteBackgroundMusicForMantra(duration = MANTRA_MUSIC_FADE_SECONDS) {
        if (!this.ctx || !this.bgMusicBusGain) return;
        this.cancelBackgroundMusicRestore();
        this.bgMusicSuppressedByMantra = true;
        const now = this.ctx.currentTime;
        if (typeof this.bgMusicBusGain.gain.cancelAndHoldAtTime === 'function') {
            this.bgMusicBusGain.gain.cancelAndHoldAtTime(now);
        } else {
            this.bgMusicBusGain.gain.cancelScheduledValues(now);
            this.bgMusicBusGain.gain.setValueAtTime(this.bgMusicBusGain.gain.value, now);
        }
        const fadeDuration = Math.max(0, duration);
        this.bgMusicBusGain.gain.linearRampToValueAtTime(0, now + fadeDuration);
        return { startedAt: now, duration: fadeDuration };
    }

    restoreBackgroundMusicAfterMantra(duration = BACKGROUND_MUSIC_RESTORE_FADE_SECONDS) {
        if (!this.ctx || !this.bgMusicBusGain) return;
        this.cancelBackgroundMusicRestore();
        this.bgMusicSuppressedByMantra = false;
        const now = this.ctx.currentTime;
        if (typeof this.bgMusicBusGain.gain.cancelAndHoldAtTime === 'function') {
            this.bgMusicBusGain.gain.cancelAndHoldAtTime(now);
        } else {
            this.bgMusicBusGain.gain.cancelScheduledValues(now);
            this.bgMusicBusGain.gain.setValueAtTime(this.bgMusicBusGain.gain.value, now);
        }
        this.bgMusicBusGain.gain.linearRampToValueAtTime(1, now + Math.max(0, duration));
    }

    stopBackgroundMusic(fadeTime = BACKGROUND_MUSIC_STOP_FADE_SECONDS) {
        this.cancelBackgroundMusicRestore();
        this.bgMusicSuppressedByMantra = false;
        if (this.bgMusicLoop) {
            this.bgMusicLoop.stop(Math.max(0, fadeTime));
            this.bgMusicLoop = null;
        }
    }

    playSingingBowl() {
        // A muted bell is an intentional setting, not an audio error. Avoid
        // creating oscillators whose exponential envelope would target zero.
        if (!this.ctx || state.noFrequencyMode || state.volBell <= 0) return;
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
            gain.gain.setValueAtTime(0.0001, now);
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
        this.isShotActive = false;
        this.isExperimentActive = false;
        this.experimentDuration = null;
        this.sessionStartedAt = null;
        this.sessionCountdownTotalMs = 0;
        this.sessionCountdownRemainingMs = 0;
        this.sessionCountdownLastTickAt = 0;
        this.sessionCountdownTicker = null;
        this.droneTimerGeneration = 0;
        this.intentionFrequencyGeneration = 0;
        this.guideControlledResolve = null;
        this.chakraOrder = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
    }

    getSessionDurationMs(focusedExperience = null) {
        if (state.bgMusicMode) return 0;

        if (focusedExperience === 'box') {
            return Math.max(1, state.timeBreathing * 16 + timing('estimate', 'boxBreathingOverhead') * 60) * 1000;
        }
        if (focusedExperience === 'hooponopono') {
            return 4 * 60 * 1000;
        }
        if (focusedExperience === 'yoga') {
            const poseCount = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).length;
            let seconds = state.timeYogaPrep + poseCount * (state.timeYogaPose + timing('estimate', 'yogaPoseTransitionEstimate'));
            if (state.corpsePoseEnabled) seconds += state.timeCorpse;
            if (state.bathSessionEnabled) {
                seconds += state.timeBath;
                seconds += timing('transitions', 'bathToYogaRest');
            }
            return Math.max(1, seconds) * 1000;
        }
        if (focusedExperience === 'intimate') {
            let seconds = 0;
            if (state.perinealCareEnabled) seconds += state.timePerinealCare;
            if (state.massageEnabled) {
                const massageChakras = 7;
                seconds += (massageChakras * (state.timePerChakra + timing('estimate', 'chakraStageOverhead'))
                    + (state.timeIcebreaker / 60) + timing('estimate', 'baseOverhead') + timing('estimate', 'normalExtra')) * 60;
            }
            if (state.assistedBathingEnabled) seconds += state.timeAssistedBathing;
            return Math.max(1, Math.round(seconds)) * 1000;
        }
        if (state.sleepMode) {
            const stageSeconds = state.timeSleepStage * SLEEP_STAGE_COUNT * 60;
            const intervalSeconds = Math.max(0, SLEEP_STAGE_COUNT - 1) * Number(this.scripts?.sleep_mode?.intervalSeconds || 3);
            return Math.max(1, stageSeconds + intervalSeconds + 12) * 1000;
        }

        const estimateMinutes = this.isHighEnergy
            ? state.timeHighEnergy + (state.timeIcebreaker / 60) + timing('estimate', 'highEnergyExtra')
            : this.chakraOrder.length * (state.timePerChakra + timing('estimate', 'chakraStageOverhead'))
                + (state.timeIcebreaker / 60)
                + timing('estimate', 'baseOverhead')
                + timing('estimate', 'normalExtra');
        return Math.max(1, Math.round(estimateMinutes)) * 60 * 1000;
    }

    startSessionCountdown(totalMs) {
        this.stopSessionCountdown();
        const total = Number(totalMs);
        if (!Number.isFinite(total) || total <= 0) return;

        this.sessionCountdownTotalMs = total;
        this.sessionCountdownRemainingMs = total;
        this.sessionCountdownLastTickAt = Date.now();
        this.renderSessionCountdown();
        this.sessionCountdownTicker = window.setInterval(() => {
            const now = Date.now();
            if (!this.isMeditationActive || this.isPaused) {
                this.sessionCountdownLastTickAt = now;
                return;
            }
            this.sessionCountdownRemainingMs = Math.max(
                0,
                this.sessionCountdownRemainingMs - Math.max(0, now - this.sessionCountdownLastTickAt)
            );
            this.sessionCountdownLastTickAt = now;
            this.renderSessionCountdown();
        }, 250);
    }

    renderSessionCountdown() {
        setSessionCountdown(this.sessionCountdownRemainingMs, this.sessionCountdownTotalMs);
    }

    stopSessionCountdown() {
        if (this.sessionCountdownTicker !== null) {
            window.clearInterval(this.sessionCountdownTicker);
            this.sessionCountdownTicker = null;
        }
        this.sessionCountdownTotalMs = 0;
        this.sessionCountdownRemainingMs = 0;
        this.sessionCountdownLastTickAt = 0;
        hideSessionCountdown();
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

    cancelDroneTimer() {
        this.droneTimerGeneration += 1;
    }

    async waitForDroneDuration(durationMs, generation) {
        let remaining = durationMs;
        const step = 100;
        while (remaining > 0) {
            if (!this.isMeditationActive || generation !== this.droneTimerGeneration) return false;
            if (!this.isPaused) remaining -= step;
            await new Promise(resolve => setTimeout(resolve, step));
        }
        return this.isMeditationActive && generation === this.droneTimerGeneration;
    }

    async waitForIntentionFrequencyDuration(durationMs, generation) {
        let remaining = durationMs;
        const step = 100;
        while (remaining > 0) {
            if (!this.isMeditationActive || generation !== this.intentionFrequencyGeneration) return false;
            if (!this.isPaused) remaining -= step;
            await new Promise(resolve => setTimeout(resolve, step));
        }
        return this.isMeditationActive && generation === this.intentionFrequencyGeneration;
    }

    startTimedIntentionFrequency() {
        if (!state.moodRelaxationIntentionEnabled || state.noFrequencyMode) return false;
        const frequency = Number(this.scripts?.sound_shots?.mood_relaxation?.frequency);
        if (!Number.isFinite(frequency) || frequency <= 0 || frequency > 20000) return false;

        const practiceMinutes = this.isHighEnergy
            ? state.timeHighEnergy
            : state.sleepMode ? state.timeSleepStage : state.timePerChakra;
        const durationMode = this.isHighEnergy
            ? state.hrimDroneDurationMode
            : state.sleepMode ? state.sleepDroneDurationMode : state.droneDurationMode;
        const durationMs = getDroneDurationMs(practiceMinutes, durationMode);
        this.stopIntentionFrequency();
        try {
            this.audio.startFrequencyShot(frequency);
        } catch (error) {
            console.warn('[Mood & Relaxation] intention tone could not start:', error);
            return false;
        }

        const generation = this.intentionFrequencyGeneration;
        void this.waitForIntentionFrequencyDuration(durationMs, generation).then(shouldStop => {
            if (shouldStop) this.audio.stopFrequencyShot();
        });
        return true;
    }

    stopIntentionFrequency() {
        this.intentionFrequencyGeneration += 1;
        this.audio.stopFrequencyShot();
    }

    async narrateIntentionWithFrequency(text, pacing = 'normal') {
        const toneStarted = this.startTimedIntentionFrequency();
        try {
            return await this.narrate(text, false, false, pacing);
        } finally {
            if (toneStarted) this.stopIntentionFrequency();
        }
    }

    startTimedDrone(baseFrequency, elementalIndex, practiceMinutes, durationMode = state.droneDurationMode) {
        if (state.noFrequencyMode || state.noMantraMode) return;
        this.cancelDroneTimer();
        this.audio.startDrone(baseFrequency, elementalIndex);
        const generation = this.droneTimerGeneration;
        const durationMs = getDroneDurationMs(practiceMinutes, durationMode);
        void this.stopDroneAfterDuration(durationMs, generation);
    }

    startTimedSleepDrone(beatFrequency, practiceMinutes, durationMode = state.sleepDroneDurationMode) {
        this.cancelDroneTimer();
        this.audio.startSleepDrone(beatFrequency);
        const generation = this.droneTimerGeneration;
        const durationMs = getDroneDurationMs(practiceMinutes, durationMode);
        void this.stopDroneAfterDuration(durationMs, generation);
    }

    async stopDroneAfterDuration(durationMs, generation) {
        const completed = await this.waitForDroneDuration(durationMs, generation);
        if (!completed) return;
        this.cancelDroneTimer();
        this.audio.stopDrone();
    }

    stopStageDrone() {
        this.cancelDroneTimer();
        this.audio.stopDrone();
    }

    async runSleepJourney() {
        if (this.isStarting || this.isMeditationActive) return;
        alert("Before we begin: Please ensure 'Do Not Disturb' is enabled on your device to prevent interruptions.");
        if (!this.scripts || this.scriptsLanguage !== state.language) {
            if (state.scriptSource === 'custom' && state.customScript) {
                this.scripts = state.customScript;
            } else {
                const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                this.scripts = await response.json();
            }
            this.scriptsLanguage = state.language;
        }
        const sleepStages = normalizeSleepStages(this.scripts);
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
        }
        this.isMeditationActive = true;
        this.isPaused = false;
        this.isHighEnergy = false;
        this.sessionStartedAt = Date.now();
        showScreen(meditationScreen);
        this.startSessionCountdown(this.getSessionDurationMs());

        const controls = document.getElementById('controls');
        if (controls) controls.classList.remove('hidden');
        setText('pause-meditation', 'II');
        setText('mantra-display', t('ui.sleepMode'));
        // Sleep mode has no spoken narration; keep the narration-only ticker
        // hidden while the visual guidance, music, and sleep tones run.
        setText('narration-text', '');
        this.visual.startPulsing('#355c7d');
        await this.audio.startBackgroundMusic();
        void this.audio.startPleasureAmbience();
        this.audio.fadeInBackgroundMusic(10, 0.32);

        const stageDurationMs = state.timeSleepStage * 60 * 1000;
        for (const [index, stage] of sleepStages.entries()) {
            if (!this.isMeditationActive) return;
            setText('mantra-display', t(`ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`));
            setText('narration-text', '');
            this.startTimedSleepDrone(stage.frequency, state.timeSleepStage, state.sleepDroneDurationMode);

            let remaining = stageDurationMs;
            while (remaining > 0 && this.isMeditationActive) {
                const step = Math.min(1000, remaining);
                await this.pauseAwareSleep(step);
                if (!this.isPaused) {
                    remaining -= step;
                }
            }
            this.stopStageDrone();
            if (index < sleepStages.length - 1) await this.pauseAwareSleep(3000);
        }

        if (this.isMeditationActive) {
            this.audio.fadeOutBackgroundMusic(12);
            await this.pauseAwareSleep(12000);
            if (this.isMeditationActive) this.finish();
        }
    }

    async runShot(type, customFrequency) {
        if (this.isStarting || this.isMeditationActive || this.isShotActive) return;
        if (state.noFrequencyMode) {
            alert(t('ui.noFrequencyShotsUnavailable'));
            return;
        }
        if (type === 'custom' && (!Number.isFinite(customFrequency) || customFrequency <= 0 || customFrequency > 20000)) {
            alert(t('ui.shotInvalidFrequency'));
            return;
        }
        this.isShotActive = true;
        const shotToggle = document.getElementById('shots-toggle');
        if (shotToggle) shotToggle.disabled = true;
        document.getElementById('shot-type-select')?.setAttribute('disabled', 'true');
        document.getElementById('shot-frequency-input')?.setAttribute('disabled', 'true');
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) { startBtn.disabled = true; startBtn.style.opacity = '0.5'; }

        try {
            if (!this.scripts || this.scriptsLanguage !== state.language) {
                const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                this.scripts = await response.json();
                this.scriptsLanguage = state.language;
            }
            await this.audio.init();
            this.audio.stopBackgroundMusic();
            this.audio.stopMantraTrack();
            this.isMeditationActive = true;
            this.sessionStartedAt = Date.now();
            showScreen(meditationScreen);
            document.getElementById('controls')?.classList.remove('hidden');
            setText('mantra-display', t('ui.shotsMode'));
            // Shots intentionally have no narration, so they must not leave
            // a looping narration marquee on screen.
            setText('narration-text', '');
            this.visual.startPulsing('#7c3aed');

            let stages;
            if (type === 'meditation') {
                stages = SHOT_CHAKRA_ORDER.map(key => ({ key, frequency: Number(this.scripts[key]?.frequency) }));
            } else if (type === 'sleep') {
                stages = normalizeSleepStages(this.scripts);
            } else {
                const singleFrequencies = {
                    high_energy: Number(this.scripts.high_energy?.frequency),
                    anesthetic: Number(this.scripts.sound_shots?.anesthetic?.frequency),
                    mood_relaxation: Number(this.scripts.sound_shots?.mood_relaxation?.frequency),
                    custom: customFrequency
                };
                stages = [{ key: type, frequency: singleFrequencies[type] }];
            }
            if (stages.some(stage => !Number.isFinite(stage.frequency) || stage.frequency <= 0 || stage.frequency > 20000)) {
                throw new Error('The selected shot has no valid script frequency.');
            }
            const activeMs = (state.timeShot * 1000) / stages.length;
            const intervalMs = type === 'sleep' ? Number(this.scripts.sleep_mode?.intervalSeconds || 2) * 1000 : 2000;
            this.startSessionCountdown((state.timeShot * 1000) + Math.max(0, stages.length - 1) * intervalMs);
            for (const [index, stage] of stages.entries()) {
                if (!this.isMeditationActive) return;
                const stageLabelPath = type === 'sleep'
                    ? `ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`
                    : `ui.${stage.key === 'thirdeye' ? 'thirdEye' : stage.key}`;
                const stageLabel = stage.key === 'high_energy'
                    ? t('ui.highEnergyShot')
                    : stage.key === 'anesthetic'
                        ? t('ui.anestheticShot')
                        : stage.key === 'mood_relaxation'
                            ? t('ui.moodRelaxationShot')
                            : stage.key === 'custom'
                                ? t('ui.customShot')
                                : t(stageLabelPath);
                setText('mantra-display', stageLabel === stageLabelPath ? stage.key : stageLabel);
                this.audio.startFrequencyShot(stage.frequency);
                let remaining = activeMs;
                while (remaining > 0 && this.isMeditationActive) {
                    const step = Math.min(100, remaining);
                    await this.pauseAwareSleep(step);
                    if (!this.isPaused) {
                        remaining -= step;
                    }
                }
                this.audio.stopFrequencyShot();
                if (index < stages.length - 1) await this.pauseAwareSleep(intervalMs);
            }
            if (this.isMeditationActive) this.finishShot();
        } catch (error) {
            console.error('Shot activation failed:', error);
            alert(`Shot activation failed: ${error.message}`);
            this.stopShot();
        }
    }

    finishShot() {
        // A completed Shot always resets the page. Disable the controls first
        // so the success path cannot leave an active Shot affordance behind
        // while the browser begins the safety reset.
        const shotToggle = document.getElementById('shots-toggle');
        if (shotToggle) shotToggle.disabled = true;
        document.getElementById('shot-type-select')?.setAttribute('disabled', 'true');
        document.getElementById('shot-frequency-input')?.setAttribute('disabled', 'true');
        this.audio.stopFrequencyShot();
        this.isMeditationActive = false;
        this.isShotActive = false;
        this.sessionStartedAt = null;
        this.visual.stop();
        this.audio.stopBackgroundMusic();
        this.audio.stopMantraTrack();
        this.stopSessionCountdown();
        wakeLock.release();
        cancelNarrationPlayback();
        document.body.classList.remove('sleep-mode-active');
        document.getElementById('controls')?.classList.add('hidden');
        showScreen(lobbyScreen);
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) { startBtn.disabled = false; startBtn.style.opacity = '1'; }
        window.location.reload();
    }

    stopShot() {
        if (!this.isShotActive && !this.isMeditationActive) return;
        this.audio.stopFrequencyShot();
        this.isMeditationActive = false;
        this.isShotActive = false;
        this.sessionStartedAt = null;
        this.visual.stop();
        this.audio.stopBackgroundMusic();
        this.audio.stopMantraTrack();
        this.stopSessionCountdown();
        wakeLock.release();
        cancelNarrationPlayback();
        document.getElementById('controls')?.classList.add('hidden');
        showScreen(lobbyScreen);
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) { startBtn.disabled = false; startBtn.style.opacity = '1'; }
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

            const focusedExperience = this.getFocusedExperience();
            const scriptCheck = validateScriptBundle(this.scripts, {
                allowLanguageFallback: state.scriptSource === 'custom',
                highEnergy: getChecked('high-energy-toggle'),
                corpse: focusedExperience === 'yoga' && state.corpsePoseEnabled,
                bath: focusedExperience === 'yoga' && state.bathSessionEnabled,
                perinealCare: focusedExperience === 'intimate' && state.perinealCareEnabled,
                assistedBathing: focusedExperience === 'intimate' && state.assistedBathingEnabled,
                massage: false,
                yoga: focusedExperience === 'yoga',
                hooponopono: focusedExperience === 'hooponopono'
            });
            if (!scriptCheck.valid) {
                throw new Error(`Script has missing or invalid required sections: ${scriptCheck.missing.slice(0, 5).join(', ')}`);
            }

            await this.audio.init();
            // Start background music looping silently immediately
            await this.audio.startBackgroundMusic();
            if (!state.bgMusicMode) void this.audio.startPleasureAmbience();

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
            if (focusedExperience === 'intimate' && state.massageEnabled) {
                // Massage is a full reverse chakra wrapper, never a separately
                // timed care stage. Keep the user's normal selection intact.
                this.chakraOrder = ['crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root'];
            }
            this.sessionStartedAt = Date.now();
            const openingChakra = this.isHighEnergy ? this.scripts.high_energy : this.scripts[this.chakraOrder[0]];
            if (openingChakra?.color) document.body.style.setProperty('--primary-color', openingChakra.color);
            // One continuous estimate spans the complete journey. It is not
            // reset when narration, a chakra, an interval, or silence begins.
            this.startSessionCountdown(this.getSessionDurationMs(focusedExperience));
            
            setText('pause-meditation', 'II');
            const controls = document.getElementById('controls');
            if (controls) controls.classList.remove('hidden');

            // Focused practices are complete, standalone experiences. They
            // deliberately bypass the arrival, gratitude, chakra, and closing
            // stages of a meditation journey.
            if (focusedExperience) {
                // Focused flows bypass the normal icebreaker, which is where
                // Piper normally finishes loading. Wait here so a care stage
                // or Massage's first Crown narration cannot race model setup
                // and appear to advance directly to a mantra.
                if (piperWarmup) await piperWarmup;
                if (!this.isMeditationActive) return;
                this.audio.fadeInBackgroundMusic(BACKGROUND_MUSIC_ENTRY_FADE_SECONDS);
                if (focusedExperience === 'box') await this.runBoxBreathing();
                else if (focusedExperience === 'yoga') await this.runYogaSession();
                else if (focusedExperience === 'intimate') await this.runIntimateService();
                else {
                    showScreen(meditationScreen);
                    await this.runHooponopono();
                }
                if (this.isMeditationActive) this.finish();
                return;
            }

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

    async startExperiment(activity) {
        if (this.isStarting || this.isMeditationActive) return;
        this.isStarting = true;
        try {
            const durationInput = document.getElementById('experiment-core-duration');
            this.experimentDuration = durationInput ? Number(durationInput.value) : null;
            if (!this.scripts || this.scriptsLanguage !== state.language) {
                if (state.scriptSource === 'custom' && state.customScript) this.scripts = state.customScript;
                else {
                    const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                    const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                    if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                    this.scripts = await response.json();
                }
                this.scriptsLanguage = state.language;
            }
            await this.audio.init();
            await this.audio.startBackgroundMusic();
            if (!state.bgMusicMode) void this.audio.startPleasureAmbience();
            this.isMeditationActive = true;
            this.isExperimentActive = true;
            this.isPaused = false;
            this.sessionStartedAt = Date.now();
            const durationUnit = durationInput?.dataset.unit || 'min';
            const experimentDurationMs = durationUnit === 'seconds'
                ? Number(this.experimentDuration) * 1000
                : Number(this.experimentDuration) * 60 * 1000;
            this.startSessionCountdown(experimentDurationMs);
            try { await wakeLock.request(); } catch (error) {}
            document.getElementById('controls')?.classList.remove('hidden');
            setText('pause-meditation', 'II');
            this.audio.fadeInBackgroundMusic(BACKGROUND_MUSIC_ENTRY_FADE_SECONDS);

            if (activity.startsWith('chakra:')) {
                const key = activity.slice('chakra:'.length);
                this.chakraOrder = [key];
                showScreen(meditationScreen);
                await this.meditateOnChakra(this.scripts[key], key);
            } else if (activity === 'hrim') {
                this.chakraOrder = ['high_energy'];
                showScreen(meditationScreen);
                await this.meditateOnChakra(this.scripts.high_energy, 'high_energy');
            } else if (activity === 'box') await this.runBoxBreathing();
            else if (activity === 'hooponopono') { showScreen(meditationScreen); await this.runHooponopono(); }
            else if (activity === 'corpse') await this.runCorpsePose();
            else if (activity === 'perineal') await this.runPerinealCare();
            else if (activity === 'bath') await this.runBathSession();
            else if (activity === 'assisted-bath') await this.runAssistedBathing();

            if (this.isMeditationActive) this.stopExperiment();
        } catch (error) {
            console.error('Experiment activity failed:', error);
            alert(`Experiment activity failed: ${error.message}`);
            this.stopExperiment();
        } finally { this.isStarting = false; }
    }

    stopExperiment() {
        this.isMeditationActive = false;
        this.isExperimentActive = false;
        this.experimentDuration = null;
        cancelNarrationPlayback();
        window.speechSynthesis.cancel();
        piperTTS.cancel('experiment stopped', { immediate: true });
        this.stopIntentionFrequency();
        this.stopStageDrone();
        this.audio.stopMantraTrack();
        this.audio.stopBackgroundMusic();
        this.audio.stopPleasureAmbience();
        this.visual.stop();
        this.stopSessionCountdown();
        wakeLock.release();
        document.getElementById('controls')?.classList.add('hidden');
        showScreen(experimentScreen);
    }

    async runGratitude(isHighEnergy = false) {
        const screen = document.getElementById('breathing-screen');
        const tutorial = document.getElementById('breathing-tutorial');
        const tutTitle = document.getElementById('tutorial-title');

        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = "1";

        const aura = document.getElementById('aura-bg');
        aura.style.background = `radial-gradient(circle at center, #3e2723aa, transparent)`;
        aura.style.opacity = "1";

        // Keep one short, app-owned preparation for every guided path,
        // including custom scripts and HRIM. Activity-specific guidance stays
        // with Yoga, bathing, massage, and assisted-care stages.
        tutTitle.textContent = t('ui.preparation');
        const prePracticeSafety = contentT('system.prePracticeSafety');
        await this.narrate(prePracticeSafety, false);
        if (!this.isMeditationActive) return;

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
            await this.narrateIntentionWithFrequency(intentionText, 'hrim');
        } else if (personalIntention) {
            await this.narrate(text, false); // Still keep music playing for next part
            const intentionText = contentT('system.intention').replace('{{intention}}', state.intention.trim());
            tutTitle.textContent = t('ui.intention');
            await this.narrateIntentionWithFrequency(intentionText); // Keep music playing seamlessly into breathing
        } else {
            await this.narrate(text, false); // No intention? Still keep music playing.
        }

        // Removed redundant pause before breathing - transition is now immediate and musical
    }

    async runBoxBreathing() {
        const screen = document.getElementById('breathing-screen');
        const breathingStep = this.isExperimentActive && this.experimentDuration != null ? this.experimentDuration : state.timeBreathing;
        const tutorial = document.getElementById('breathing-tutorial');
        const instruction = document.getElementById('breathing-instruction');
        const circle = document.getElementById('breathing-circle');
        const timer = document.getElementById('breathing-timer');
        
        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = "1";

        const tutTitle = document.getElementById('tutorial-title');
        tutTitle.textContent = t('ui.preparation');
        const text = contentT('system.centeringBreath');
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
                circle.style.transition = `transform ${breathingStep}s linear`;
                circle.style.transform = `scale(${step.scale})`;
                
                this.narrateSoft(step.text);

                for (let s = breathingStep; s > 0; s--) {
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
            const totalSeconds = this.isExperimentActive && this.experimentDuration != null ? this.experimentDuration : state.timeCorpse;
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

        if (!this.isMeditationActive) return false;
        return this.runGuideControlledTransition({
            durationSeconds: 0,
            showTimer: false,
            title: t('ui.guideReadyForNextSession'),
            subtitle: t('ui.guideReadyForNextSessionGuidance'),
            readyText: t('ui.guideReadyForNextSessionGuidance'),
            continueLabel: t('ui.proceedToNextSession')
        });
    }

    async runBathSession() {
        return this.runBathStage('bath_session', this.isExperimentActive && this.experimentDuration != null ? this.experimentDuration : state.timeBath);
    }

    async runPerinealCare() {
        return this.runBathStage('perineal_care', this.isExperimentActive && this.experimentDuration != null ? this.experimentDuration : state.timePerinealCare);
    }

    async runAssistedBathing() {
        return this.runBathStage('assisted_bathing', this.isExperimentActive && this.experimentDuration != null ? this.experimentDuration : state.timeAssistedBathing);
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

        // This is visible interface copy, so follow Display Language rather
        // than the selected meditation/narration language.
        if (mantraEl) mantraEl.textContent = t('system.musicOnly');
        setText('narration-text', '');
        hideSessionCountdown();
        
        // Start background music loop
        await this.audio.startBackgroundMusic();
        this.audio.fadeInBackgroundMusic(BACKGROUND_MUSIC_ENTRY_FADE_SECONDS, false);
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

    async runGuideControlledTransition({ durationSeconds, title, subtitle, readyText, continueLabel, showTimer = true }) {
        const restButton = document.getElementById('guide-controlled-continue');
        const titleEl = document.getElementById('icebreaker-title');
        const subtitleEl = document.getElementById('icebreaker-subtitle');
        const timerEl = document.getElementById('icebreaker-timer');

        if (!restButton || !titleEl || !subtitleEl || !timerEl) return false;

        showScreen(icebreakerScreen);
        // Icebreaker is also used for guide-controlled waiting. Clear the
        // previous narration so an empty marquee never appears as stale UI.
        setText('narration-text', '');
        restButton.hidden = true;
        restButton.disabled = true;
        titleEl.textContent = title;
        subtitleEl.textContent = subtitle;
        timerEl.hidden = !showTimer;

        for (let remaining = Math.max(0, Math.round(durationSeconds)); remaining > 0; remaining--) {
            if (!this.isMeditationActive) return false;
            if (showTimer) timerEl.textContent = formatClockDuration(remaining * 1000);
            await this.pauseAwareSleep(1000);
        }

        if (!this.isMeditationActive) return false;
        if (showTimer) timerEl.textContent = formatClockDuration(0);
        subtitleEl.textContent = readyText;
        restButton.textContent = continueLabel;
        restButton.disabled = false;
        restButton.hidden = false;
        restButton.focus();

        return new Promise(resolve => {
            const complete = (shouldContinue) => {
                restButton.removeEventListener('click', onContinue);
                restButton.hidden = true;
                restButton.disabled = true;
                if (this.guideControlledResolve === complete) this.guideControlledResolve = null;
                resolve(shouldContinue);
            };
            const onContinue = () => {
                if (this.isMeditationActive && !this.isPaused) complete(true);
            };
            this.guideControlledResolve = complete;
            restButton.addEventListener('click', onContinue);
        });
    }

    async runYogaSession() {
        if (!this.isMeditationActive) return;

        // Yoga keeps its own standard Bath Session and rest-before-yoga stage.
        // Intimate care runs separately from the Lobby.
        if (state.corpsePoseEnabled) await this.runCorpsePose();
        if (state.bathSessionEnabled && this.isMeditationActive) {
            if (!await this.runBathSession()) return;

            const shouldBeginYoga = await this.runGuideControlledTransition({
                durationSeconds: timing('transitions', 'bathToYogaRest'),
                title: t('ui.bathToYogaRestTitle'),
                subtitle: t('ui.bathToYogaRestGuidance'),
                readyText: t('ui.restReadyToContinue'),
                continueLabel: t('ui.beginYogaAfterRest')
            });
            if (!shouldBeginYoga) return;
        }

        // Transition Screen
        showScreen(icebreakerScreen);
        const title = document.getElementById('icebreaker-title');
        const subtitle = document.getElementById('icebreaker-subtitle');
        const timer = document.getElementById('icebreaker-timer');

        title.textContent = t('ui.yoga');
        subtitle.textContent = t('ui.yogaSubtitle');
        
        // Grounding Drone for Yoga (136.1 Hz - OM frequency)
        // Use the shared fixed exposure window; Yoga must not leave a drone
        // running for the length of the entire session.
        this.startTimedDrone(136.1, 3, state.timeYogaPose, state.droneDurationMode);
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

    async narrateWithPiper(text, fadeOut = false, keepSilence = false, volumeScale = 1, pacing = 'normal', transition = 'none') {
        if (!text || !this.isMeditationActive && !fadeOut) return;
        setNarrationTickerAwaitingPlayback(true);
        setText('narration-text', text, estimateNarrationDurationSeconds(text, pacing));
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
        // Keep the first two sentences ready so narration begins promptly,
        // then continue synthesizing one sentence ahead while the current
        // sentence plays. Piper's worker is serial, so waiting for the whole
        // passage here would leave the user with music and silence for a long
        // time before the first voice clip can start.
        const queueSynthesis = (sentence) => {
            const job = piperTTS.synthesize(sentence);
            // A Stop action may cancel jobs that have not reached the active
            // await yet. Attach a sink immediately so intentional cancellation
            // cannot create unhandled promise errors.
            job.catch(() => {});
            return job;
        };
        const pending = sentences.slice(0, 2).map(queueSynthesis);
        // The estimate helper includes a lead-in for a complete narration.
        // The ticker begins at the first audio clip, so remove that lead-in
        // from each sentence estimate before composing the rolling total.
        const estimatedDurations = sentences.map(sentence =>
            Math.max(0.1, estimateNarrationDurationSeconds(sentence, pacing) - timing('narration', 'piperLeadIn'))
        );
        let narrationDuration = estimatedDurations.reduce((total, duration) => total + duration, 0) +
            Math.max(0, sentences.length - 1) * sentenceGap;
        let piperFailed = false;
        let tickerStarted = false;

        for (let i = 0; i < sentences.length; i++) {
            if (!this.isMeditationActive) break;
            while (this.isPaused && this.isMeditationActive) await new Promise(resolve => setTimeout(resolve, 100));

            if (piperFailed) {
                await this.narrateBrowser(sentences[i], false, true, pacing, false);
                continue;
            }

            try {
                const blob = await pending.shift();
                if (i + 2 < sentences.length) pending.push(queueSynthesis(sentences[i + 2]));
                const buffer = await piperTTS.decode(blob);
                if (!buffer) throw new Error('Piper returned an empty audio clip.');
                // Replace the estimate for this clip as soon as its real
                // decoded duration is available. The ticker keeps its current
                // elapsed position while its total timing becomes more exact.
                narrationDuration += buffer.duration - estimatedDurations[i];
                updateNarrationTickerDuration(narrationDuration);
                if (!tickerStarted) {
                    tickerStarted = true;
                    // The complete text is already visible, but the marquee
                    // must wait for real voice playback. The rolling estimate
                    // is progressively replaced by decoded Piper durations.
                    startNarrationTicker(narrationDuration);
                }
                const isFinalClip = i === sentences.length - 1;
                await piperTTS.playBuffer(buffer, volumeScale, {
                    // Ordinary sentence boundaries stay tight. Only a final
                    // clip that hands off to mantra receives the longer,
                    // audible exit fade.
                    fadeOutSeconds: isFinalClip && (transition === 'mantra' || fadeOut)
                        ? NARRATION_MANTRA_FADE_SECONDS
                        : PIPER_CLIP_FADE_SECONDS
                });
            } catch (error) {
                // Stopping a journey intentionally cancels Piper. Do not turn
                // that cancellation into a new browser-speech utterance.
                if (!this.isMeditationActive) return;
                piperFailed = true;
                piperTTS.cancel('sentence failed');
                setVoiceStatus(t('ui.piperFallback'), 'error');
                await this.narrateBrowser(sentences[i], false, true, pacing, false);
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
        const generation = beginNarrationPlayback();
        try {
            if (this.shouldUsePiper()) {
                try { return await this.narrateWithPiper(text, false, false, 1); }
                catch (error) {
                    console.error('[Piper] soft narration failed:', error);
                    if (!this.isMeditationActive) return;
                    setVoiceStatus(t('ui.piperFallback'), 'error');
                }
            }
            return await this.narrateSoftBrowser(text);
        } finally {
            finishNarrationPlayback(generation);
        }
    }

    async narrateSoftBrowser(text) {
        setText('narration-text', text, estimateNarrationDurationSeconds(text, 'soft'));
        setNarrationTickerAwaitingPlayback(false);
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = getBrowserVoiceForContent();
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            
            // Warmth & Comfort: Deeper pitch and slower rate for transitions
            const baseRate = state.sleepMode ? 0.60 : 0.70;
            utterance.rate   = (state.eyesCloseMode ? baseRate * 0.88 : baseRate) * state.voicePace;
            utterance.pitch  = state.eyesCloseMode ? 0.88 : isFeminineNarrationVoice() ? 0.96 : 1.02;
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
        setNarrationTickerPaused(this.isPaused);
        
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

    async runSequence({ complete = true } = {}) {
        if (state.bgMusicMode) {
            await this.runBackgroundMusicOnly();
            return;
        }

        for (let i = 0; i < this.chakraOrder.length; i++) {
            const key = this.chakraOrder[i];
            if (!this.isMeditationActive) break;
            
            await this.meditateOnChakra(this.scripts[key], key);

            const isLastChakra = (i === this.chakraOrder.length - 1);
            if (!isLastChakra && this.isMeditationActive) await this.handleInterval();
        }
        if (!complete) return;
        if (this.isMeditationActive) { await this.handleSilence(); }
        if (this.isMeditationActive) { await this.runClosing(); }
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

    async runIntimateService() {
        if (!this.isMeditationActive) return;
        if (state.perinealCareEnabled && !await this.runPerinealCare()) return;
        if (state.massageEnabled) {
            // Massage is held by a full Crown-to-Root chakra journey. When
            // Assisted Bathing follows, defer closing until it is complete.
            // The chakra narration/ticker belongs to the meditation screen;
            // focused care otherwise still has the Icebreaker stage visible.
            showScreen(meditationScreen);
            await this.runSequence({ complete: !state.assistedBathingEnabled });
            if (!this.isMeditationActive) return;
        }
        if (state.assistedBathingEnabled && !await this.runAssistedBathing()) return;
    }

    getFocusedExperience() {
        if (getChecked('box-breathing-experience-toggle')) return 'box';
        if (getChecked('hooponopono-experience-toggle')) return 'hooponopono';
        if (getChecked('yoga-experience-toggle')) return 'yoga';
        if (getChecked('perineal-care-toggle') || getChecked('massage-toggle') || getChecked('assisted-bathing-toggle')) return 'intimate';
        return null;
    }

    async handleInterval() {
        this.stopStageDrone();
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
        const practiceMinutes = this.isExperimentActive && this.experimentDuration != null && (key === 'high_energy' || this.chakraOrder.length === 1)
            ? this.experimentDuration
            : key === 'high_energy' ? state.timeHighEnergy : state.timePerChakra;
        const durationMode = key === 'high_energy' ? state.hrimDroneDurationMode : state.droneDurationMode;

        if (!state.eyesCloseMode) this.visual.startPulsing(chakra.color);
        await this.narrate(
            localized(chakra, 'meditation') || localized(chakra),
            false,
            false,
            'normal',
            'mantra'
        );
        if (!this.isMeditationActive) return;

        // Start the mantra first. The matching drone must never run under the
        // narration; it begins only after mantra playback is active.
        await this.audio.playMantraTrack(key);
        if (!this.isMeditationActive) return;
        if (!state.noMantraMode && this.audio.mantraLoop) {
            this.startTimedDrone(chakra.frequency, absoluteIndex, practiceMinutes, durationMode);
        }

        const chantDurationMs = Math.max(0, (practiceMinutes * 60 * 1000) - (timing('transitions', 'chakraLeadOut') * 1000));
        let elapsed = 0;

        while (elapsed < chantDurationMs) {
            if (!this.isMeditationActive) break;
            
            // Explicit pause check
            await this.pauseAwareSleep(0);

            if (!this.isPaused) {
                elapsed += 100;
            }
            await new Promise(r => setTimeout(r, 100));
        }

        // Fade out mantra, restore drone before affirmation
        this.audio.stopMantraTrack();
        await this.pauseAwareSleep(timing('transitions', 'chakraPostMantra') * 1000);

        if (this.isMeditationActive) await this.narrate(localized(chakra, 'affirmation'));
    }

    async narrateFeeble(text) {
        const generation = beginNarrationPlayback();
        try {
            if (this.shouldUsePiper()) {
                try { return await this.narrateWithPiper(text, false, false, 0.9); }
                catch (error) {
                    console.error('[Piper] feeble narration failed:', error);
                    if (!this.isMeditationActive) return;
                    setVoiceStatus(t('ui.piperFallback'), 'error');
                }
            }
            return await this.narrateFeebleBrowser(text);
        } finally {
            finishNarrationPlayback(generation);
        }
    }

    async narrateFeebleBrowser(text) {
        setText('narration-text', text, estimateNarrationDurationSeconds(text, 'feeble'));
        setNarrationTickerAwaitingPlayback(false);
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = getBrowserVoiceForContent();
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            
            // Feeble prompts: Extra slow and deep for minimal intrusion
            const baseRate = state.sleepMode ? 0.58 : 0.65;
            utterance.rate   = (state.eyesCloseMode ? baseRate * 0.85 : baseRate) * state.voicePace;
            utterance.pitch  = state.eyesCloseMode ? 0.82 : isFeminineNarrationVoice() ? 0.91 : 0.95;
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

    async narrate(text, fadeOut = false, keepSilence = false, pacing = 'normal', transition = 'none') {
        const generation = beginNarrationPlayback();
        try {
            if (this.shouldUsePiper()) {
                try { return await this.narrateWithPiper(text, fadeOut, keepSilence, 1, pacing, transition); }
                catch (error) {
                    console.error('[Piper] narration failed:', error);
                    if (!this.isMeditationActive) return;
                    setVoiceStatus(t('ui.piperFallback'), 'error');
                }
            }
            return await this.narrateBrowser(text, fadeOut, keepSilence, pacing, true, transition);
        } finally {
            finishNarrationPlayback(generation);
        }
    }

    async narrateBrowser(text, fadeOut = false, keepSilence = false, pacing = 'normal', updateTicker = true, transition = 'none') {
        if (updateTicker) setText('narration-text', text, estimateNarrationDurationSeconds(text, pacing));
        setNarrationTickerAwaitingPlayback(false);
        if (!window.speechSynthesis) return;

        // Browser speech is outside the Web Audio graph, so it cannot receive
        // the Piper gain ramp. A normal mantra handoff therefore waits for
        // speechSynthesis.onend; emergency stop/pause paths remain immediate.

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
                utterance.pitch  = pacing === 'hrim' ? 1.0 : (state.eyesCloseMode ? 0.88 : isFeminineNarrationVoice() ? 0.96 : 1.02);
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
        this.stopStageDrone();
        const silenceTime = timing('transitions', 'finalSilence') * 1000;
        for (let i = Math.ceil(silenceTime / 1000); i > 0; i--) {
            if (!this.isMeditationActive) break;
            await this.pauseAwareSleep(1000);
        }
    }

    finish() {
        const sessionMinutes = Math.max(1, Math.round((Date.now() - (this.sessionStartedAt || Date.now())) / 60000));
        this.isMeditationActive = false; 
        this.sessionStartedAt = null;
        this.stopSessionCountdown();
        this.visual.stop(); 
        this.stopStageDrone();
        // The completion path must not restore music after the mantra fades.
        // Schedule one coordinated fade for both layers instead.
        this.audio.stopMantraTrack({ restoreMusic: false });
        this.audio.fadeOutBackgroundMusic(BACKGROUND_MUSIC_STOP_FADE_SECONDS);
        this.audio.stopBackgroundMusic(BACKGROUND_MUSIC_STOP_FADE_SECONDS);
        this.audio.stopPleasureAmbience();
        cancelNarrationPlayback();
        wakeLock.release();
        piperTTS.cancel('journey finished', { immediate: true });
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        this.audio.playSingingBowl();
        state.stats.journeys += 1; state.stats.time += sessionMinutes;
        localStorage.setItem('chakra_stats_journeys', state.stats.journeys);
        localStorage.setItem('chakra_stats_time', state.stats.time);
        setText('stat-journeys', state.stats.journeys);
        setText('stat-time', state.stats.time);
        setText('stat-session-time', sessionMinutes + ' mins');
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
        const earnLink = document.getElementById('continue-to-earn');
        const btn = document.getElementById('close-completion');
        if (title) title.textContent = t('ui.journeyComplete');
        if (msg) msg.textContent = t('ui.meditationCompleted');
        if (earnLink) earnLink.textContent = t('ui.continueToEarn');
        if (btn) btn.textContent = t('ui.returnToRoom');

        modal.classList.remove('hidden');
        scheduleEarnHandoff();
    }

    stop() {
        const returnScreen = this.isExperimentActive ? experimentScreen : lobbyScreen;
        this.isMeditationActive = false; this.isShotActive = false; this.stopIntentionFrequency(); this.stopStageDrone(); this.audio.stopMantraTrack(); this.audio.stopBackgroundMusic(); this.audio.stopPleasureAmbience(); this.visual.stop(); wakeLock.release();
        this.stopSessionCountdown();
        this.isExperimentActive = false;
        cancelNarrationPlayback();
        if (this.guideControlledResolve) this.guideControlledResolve(false);
        const guideRestButton = document.getElementById('guide-controlled-continue');
        if (guideRestButton) {
            guideRestButton.hidden = true;
            guideRestButton.disabled = true;
        }
        this.sessionStartedAt = null;
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
        }
        window.speechSynthesis.cancel();
        piperTTS.cancel('journey stopped', { immediate: true });
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
        showScreen(returnScreen);
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
    const storedValue = localStorage.getItem(key);
    if (storedValue === null || storedValue === '') return fallback;
    const value = Number(storedValue);
    return Number.isFinite(value) ? value : fallback;
}

function storedBooleanWithLegacy(key, legacyKey) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) return storedValue === 'true';
    return legacyKey ? localStorage.getItem(legacyKey) === 'true' : false;
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
    droneDurationMode: normalizeDroneDurationMode(localStorage.getItem('chakra_drone_duration_mode')),
    hrimDroneDurationMode: normalizeHrimDroneDurationMode(localStorage.getItem('chakra_hrim_drone_duration_mode')),
    voices: [],
    volVoice: clampAudioLevel(storedNumber('chakra_vol_voice', 0.9), 0.2, 2, 0.9),
    volDrone: clampAudioLevel(storedNumber('chakra_vol_drone', 0.05), 0.02, 0.2, 0.05),
    volBell: clampAudioLevel(storedNumber('chakra_vol_bell', 0.05), 0.2, 1, 0.2),
    volMantra: clampAudioLevel(storedNumber('chakra_vol_mantra', 0.35), 0.1, 1, 0.35),
    volMusic: clampAudioLevel(storedNumber('chakra_vol_music', 0.20), 0.02, 0.5, 0.20),
    pleasureAmbienceGain: clampPleasureAmbienceGain(storedNumber('chakra_pleasure_ambience_gain', PLEASURE_AMBIENCE_GAIN)),
    pleasureAmbienceUrl: normalizePleasureAmbienceUrl(localStorage.getItem(PLEASURE_AMBIENCE_URL_STORAGE_KEY)),
    pleasureAmbienceBlurAmount: clampPleasureAmbienceBlurAmount(storedNumber('chakra_pleasure_ambience_blur_amount', PLEASURE_BLUR_DEFAULT_AMOUNT)),
    // Intensity is a session-only character preset. It never changes the
    // saved Ambience Level or the user's base Blur Intensity preference.
    pleasureAmbienceIntensity: 'gentle',
    voiceClarity: parseFloat(localStorage.getItem('chakra_voice_clarity')) || 50,
    voiceWarmth: parseFloat(localStorage.getItem('chakra_voice_warmth')) || 50,
    voicePace: parseFloat(localStorage.getItem('chakra_voice_pace')) || 1,
    voiceEcho: localStorage.getItem('chakra_voice_echo') || 'light',
    musicEcho: localStorage.getItem('chakra_music_echo') || 'light',
    spatialMode: normalizeSpatialMode(localStorage.getItem('chakra_spatial_mode')),
    stats: {
        journeys: parseInt(localStorage.getItem('chakra_stats_journeys')) || 0,
        time: parseInt(localStorage.getItem('chakra_stats_time')) || 0
    },
    selectedChakras: JSON.parse(localStorage.getItem('chakra_selected')) || [],
    intention: localStorage.getItem('chakra_intention') || '',
    sleepMode: false,
    // This preference controls the opening style; stats.journeys remains the
    // historical count of completed journeys.
    returningJourney: (() => {
        const saved = localStorage.getItem('chakra_returning_journey');
        if (saved !== null) return saved === 'true';
        return (parseInt(localStorage.getItem('chakra_stats_journeys')) || 0) > 0;
    })(),
    audioFilters: localStorage.getItem('chakra_audio_filters') === 'true',
    // Reverse order is intentionally derived only for the Massage wrapper.
    // These focused practices are Lobby-only Experience Modes. They are
    // intentionally session-only and must never be added to a chakra journey.
    boxBreathingExperienceEnabled: false,
    hooponoponoExperienceEnabled: false,
    yogaExperienceEnabled: false,
    // Default off: this mode disables intentional frequency generators while
    // preserving narration and background music in a guided journey.
    noFrequencyMode: localStorage.getItem('chakra_no_frequency_mode') === 'true',
    noMantraMode: localStorage.getItem('chakra_no_mantra_mode') === 'true',
    // This ambience choice is intentionally session-only. It must not be
    // restored after a reload or written to localStorage.
    moodRelaxationIntentionEnabled: false,
    pleasureAmbienceBlur: true,
    deityPath: localStorage.getItem('chakra_deity_path') || 'none',
    // Experience Mode selections are intentionally session-only. They should
    // never be restored from or written to localStorage.
    bgMusicMode: false,
    highEnergyEnabled: false,
    sleepExperienceEnabled: false,
    sleepDroneDurationMode: normalizeSleepDroneDurationMode(localStorage.getItem('chakra_sleep_drone_duration_mode')),
    eyesCloseMode: localStorage.getItem('chakra_eyes_close_mode') === 'true',
    corpsePoseEnabled: localStorage.getItem('chakra_corpse_enabled') === 'true',
    brightness: parseFloat(localStorage.getItem('chakra_brightness')) || 1.0,
    bathSessionEnabled: localStorage.getItem('chakra_bath_enabled') === 'true',
    perinealCareEnabled: storedBooleanWithLegacy('chakra_intimate_perineal_care', 'chakra_perineal_care'),
    assistedBathingEnabled: storedBooleanWithLegacy('chakra_intimate_assisted_bathing', 'chakra_assisted_bathing'),
    massageEnabled: storedBooleanWithLegacy('chakra_intimate_massage', 'chakra_massage'),
    selectedYogaPoses: JSON.parse(localStorage.getItem('chakra_yoga_selected')) || ['vrikshasana', 'adho_mukha_svanasana', 'marjaryasana', 'balasana', 'ananda_balasana'],
    // Journey Timings (in seconds)
    timeSleepStage: parseFloat(localStorage.getItem('chakra_time_sleep_stage')) || 5.0,
    timeShot: parseInt(localStorage.getItem('chakra_time_shot')) || 7,
    timeIcebreaker: parseInt(localStorage.getItem('chakra_time_icebreaker')) || 60,
    timeBreathing: parseInt(localStorage.getItem('chakra_time_breathing')) || 8,
    timeCorpse: parseInt(localStorage.getItem('chakra_time_corpse')) || 300,
    timeInterval: parseInt(localStorage.getItem('chakra_time_interval')) || 10,
    timeYogaPrep: parseInt(localStorage.getItem('chakra_time_yoga_prep')) || 60,
    timeYogaPose: parseInt(localStorage.getItem('chakra_time_yoga_pose')) || 60,
    timeBath: parseInt(localStorage.getItem('chakra_time_bath')) || 600,
    timePerinealCare: parseInt(localStorage.getItem('chakra_time_perineal_care')) || 300,
    timeAssistedBathing: parseInt(localStorage.getItem('chakra_time_assisted_bathing')) || 600,
    scriptSource: localStorage.getItem('chakra_script_source') || 'default',
    customScript: JSON.parse(localStorage.getItem('chakra_custom_script')) || null
};

function syncPleasureAmbienceControl() {
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
    const audioUnavailable = audio.pleasureAudioAvailable === false;
    // Optional local ambience files can be absent in a deployed build. Keep
    // this recovery surface visible so a guide can supply a URL; hiding it
    // would make the missing local source impossible to replace on mobile.
    if (section) section.hidden = false;
    if (toggle) toggle.disabled = state.noFrequencyMode;
    if (control) control.hidden = !state.moodRelaxationIntentionEnabled;
    if (intensityControl) intensityControl.hidden = !state.moodRelaxationIntentionEnabled;
    if (intensitySelect) {
        intensitySelect.value = state.pleasureAmbienceIntensity;
        intensitySelect.disabled = state.noFrequencyMode;
    }
    if (urlControl) urlControl.hidden = !state.moodRelaxationIntentionEnabled;
    if (urlInput) {
        urlInput.disabled = state.noFrequencyMode;
        urlInput.value = state.pleasureAmbienceUrl;
    }
    if (blurControl) blurControl.hidden = !state.moodRelaxationIntentionEnabled;
    if (blurToggle) {
        blurToggle.checked = state.pleasureAmbienceBlur;
        blurToggle.disabled = state.noFrequencyMode;
    }
    if (blurLevel) blurLevel.hidden = !state.moodRelaxationIntentionEnabled;
    if (blurLevelInput) {
        blurLevelInput.disabled = state.noFrequencyMode;
        blurLevelInput.value = (state.pleasureAmbienceBlurAmount * 100).toFixed(0);
        const pct = ((Number(blurLevelInput.value) - Number(blurLevelInput.min)) / (Number(blurLevelInput.max) - Number(blurLevelInput.min)) * 100).toFixed(1) + '%';
        blurLevelInput.style.setProperty('--range-fill', pct);
    }
    if (blurLevelOutput) blurLevelOutput.textContent = `${Math.round(state.pleasureAmbienceBlurAmount * 100)}%`;
    if (slider) {
        slider.disabled = state.noFrequencyMode || audioUnavailable;
        slider.value = (state.pleasureAmbienceGain * 100).toFixed(1);
        const pct = ((Number(slider.value) - Number(slider.min)) / (Number(slider.max) - Number(slider.min)) * 100).toFixed(1) + '%';
        slider.style.setProperty('--range-fill', pct);
    }
    if (output) output.textContent = formatPleasureAmbienceLevel(state.pleasureAmbienceGain);
    if (status && audioUnavailable && state.moodRelaxationIntentionEnabled) {
        status.dataset.availability = 'unavailable';
        status.textContent = t('ui.pleasureAmbienceSourceUnavailable');
        status.hidden = false;
        status.style.color = '#fbbf24';
    } else if (status?.dataset.availability === 'unavailable') {
        delete status.dataset.availability;
        status.hidden = true;
        status.textContent = '';
    }
}

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
    // Migrate away from the former persisted ambience selection. The current
    // choice is deliberately session-only; the level itself may remain saved.
    localStorage.removeItem('chakra_mood_relaxation_intention');
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
    const shringaraVoice = !isHighEnergy && isFeminineNarrationVoice();
    const profile = isHighEnergy
        ? { clarity: 50, warmth: 50, pace: 1, echo: 'light' }
        : shringaraVoice
            ? { clarity: 28, warmth: 82, pace: 0.92, echo: 'light' }
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
    syncValue('music-echo', state.musicEcho);
    syncValue('spatial-mode', state.spatialMode);
    syncValue('mixer-spatial-mode', state.spatialMode);
    document.querySelectorAll('[data-voice-preset]').forEach(button => {
        button.classList.toggle('mixer-preset-active', button.dataset.voicePreset === (isHighEnergy ? 'balanced' : shringaraVoice ? 'shringara' : 'soft'));
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
    syncDroneDurationModeControls();
    updateDroneDurationSummary();
    
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
    syncValue('music-echo', state.musicEcho);

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
    syncChecked('mixer-no-frequency-mode-toggle', state.noFrequencyMode);
    syncChecked('mixer-no-mantra-mode-toggle', state.noMantraMode);
    // The former normal-journey reverse preference is retired. Massage now
    // derives its complete Crown-to-Root order without changing this state.
    localStorage.removeItem('chakra_reverse_journey');
    localStorage.removeItem('chakra_box_meditation');
    localStorage.removeItem('chakra_hooponopono');
    syncChecked('box-breathing-experience-toggle', false);
    syncChecked('hooponopono-experience-toggle', false);
    syncChecked('no-frequency-mode-toggle', state.noFrequencyMode);
    syncChecked('no-mantra-mode-toggle', state.noMantraMode);
    syncChecked('mood-relaxation-intention-toggle', state.moodRelaxationIntentionEnabled);
    syncPleasureAmbienceControl();
    const moodRelaxationToggle = document.getElementById('mood-relaxation-intention-toggle');
    if (moodRelaxationToggle) moodRelaxationToggle.disabled = state.noFrequencyMode;
    syncChecked('eyes-close-mode-toggle', state.eyesCloseMode);
    localStorage.removeItem('chakra_bg_music_mode');
    localStorage.removeItem('chakra_high_energy');
    localStorage.removeItem('chakra_sleep_experience');
    syncChecked('music-only-toggle', false);
    syncChecked('high-energy-toggle', false);
    syncChecked('sleep-mode-toggle', false);
    syncChecked('corpse-pose-toggle', state.corpsePoseEnabled);
    if (state.eyesCloseMode) document.body.classList.add('eyes-close-mode');

    // Yoga Experience setup persists, but its Lobby Experience Mode is
    // session-only and never restored.
    localStorage.removeItem('chakra_yoga_bridge');
    syncChecked('yoga-experience-toggle', false);
    syncChecked('bath-session-toggle', state.bathSessionEnabled);
    syncChecked('perineal-care-toggle', state.perinealCareEnabled);
    syncChecked('assisted-bathing-toggle', state.assistedBathingEnabled);
    syncChecked('massage-toggle', state.massageEnabled);
    const yogaSubOptions = document.getElementById('yoga-sub-options');
    if (yogaSubOptions) yogaSubOptions.style.display = 'flex';

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
    [configScreen, experimentScreen, lobbyScreen, meditationScreen, breathingScreen, icebreakerScreen].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    if (screen) {
        screen.classList.remove('hidden');
        // Screen sections can be taller than a desktop viewport. Reset both
        // possible scroll containers so returning to the Lobby never leaves
        // the header and controls above Core Practice Duration out of view.
        screen.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
        if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
        const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
        schedule(() => document.querySelectorAll('[data-narration-text]').forEach(refreshNarrationTicker));
    }
}

function attachEventListeners() {
    // Keep Yoga configuration beside the session-only Yoga Experience rather
    // than among normal chakra-journey Settings.
    const yogaExperienceSetup = document.getElementById('yoga-experience-setup');
    const yogaExperiencePanelHost = document.getElementById('yoga-experience-panel-host');
    if (yogaExperienceSetup && yogaExperiencePanelHost) yogaExperiencePanelHost.append(yogaExperienceSetup);

    languageSelect.addEventListener('change', (e) => {
        const previousLanguage = state.language;
        const shouldUpdateGeneratedIntention = shouldRefreshLocalizedIntention(state.intention, previousLanguage);
        state.language = e.target.value;
        if (shouldUpdateGeneratedIntention) {
            state.intention = state.highEnergyEnabled
                ? hrimDefaultIntention(state.language)
                : defaultIntention(state.language);
            syncValue('intention-input', state.intention);
            localStorage.setItem('chakra_intention', state.intention);
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
    function persistChakraSelection() {
        state.selectedChakras = Array.from(document.querySelectorAll('#chakra-selection input:checked')).map(cb => cb.value);
        localStorage.setItem('chakra_selected', JSON.stringify(state.selectedChakras));
        updateSessionEstimate();
        updateJourneyRoadmap();
    }

    saveConfigBtn.addEventListener('click', () => {
        persistChakraSelection();
        localStorage.setItem('chakra_lang', state.language);
        localStorage.setItem('chakra_display_language', state.displayLanguage);
        state.voiceName = voiceSelect.value;
        localStorage.setItem('chakra_voice', state.voiceName);
        state.audioFilters = getChecked('audio-filters-toggle');
        state.boxBreathingExperienceEnabled = false;
        state.hooponoponoExperienceEnabled = false;
        state.yogaExperienceEnabled = false;
        syncChecked('box-breathing-experience-toggle', false);
        syncChecked('hooponopono-experience-toggle', false);
        syncChecked('yoga-experience-toggle', false);
        state.noFrequencyMode = getChecked('no-frequency-mode-toggle');
        state.eyesCloseMode = getChecked('eyes-close-mode-toggle');
        state.corpsePoseEnabled = getChecked('corpse-pose-toggle');
        state.bathSessionEnabled = getChecked('bath-session-toggle');
        state.selectedYogaPoses = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(cb => cb.value);
        const selectedDeity = document.querySelector('input[name="deity-path"]:checked');
        state.deityPath = selectedDeity ? selectedDeity.value : 'none';
        
        localStorage.setItem('chakra_audio_filters', state.audioFilters);
        localStorage.removeItem('chakra_box_meditation');
        localStorage.removeItem('chakra_hooponopono');
        localStorage.setItem('chakra_no_frequency_mode', state.noFrequencyMode);
        localStorage.setItem('chakra_deity_path', state.deityPath);
        localStorage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
        localStorage.setItem('chakra_corpse_enabled', state.corpsePoseEnabled);
        localStorage.removeItem('chakra_yoga_bridge');
        localStorage.setItem('chakra_bath_enabled', state.bathSessionEnabled);
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
        const corpseEnabled = getChecked('corpse-pose-toggle');
        const bathEnabled = getChecked('bath-session-toggle');

        const toggleDisplay = (id, show) => {
            const el = document.getElementById(id);
            if (!el) return;
            // Let the component's CSS choose its layout when visible. This is
            // important for enhanced range rows, which use grid rather than flex.
            el.style.display = show ? '' : 'none';
        };

        const bathToggle = document.getElementById('bath-session-toggle');
        if (bathToggle) {
            bathToggle.disabled = false;
            bathToggle.setAttribute('aria-disabled', 'false');
        }
        toggleDisplay('row-breathing', false);
        toggleDisplay('row-corpse', corpseEnabled);
        toggleDisplay('row-yoga-prep', true);
        toggleDisplay('row-yoga-pose', true);
        toggleDisplay('row-bath', bathEnabled);
        
        const yogaSubOptions = document.getElementById('yoga-sub-options');
        if (yogaSubOptions) yogaSubOptions.style.display = 'flex';
    }

    function persistYogaExperienceSetup() {
        state.corpsePoseEnabled = getChecked('corpse-pose-toggle');
        state.bathSessionEnabled = getChecked('bath-session-toggle');
        state.selectedYogaPoses = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(input => input.value);
        localStorage.setItem('chakra_corpse_enabled', state.corpsePoseEnabled);
        localStorage.setItem('chakra_bath_enabled', state.bathSessionEnabled);
        localStorage.setItem('chakra_yoga_selected', JSON.stringify(state.selectedYogaPoses));
    }

    function persistIntimateServiceSetup() {
        state.perinealCareEnabled = getChecked('perineal-care-toggle');
        state.assistedBathingEnabled = getChecked('assisted-bathing-toggle');
        state.massageEnabled = getChecked('massage-toggle');
        localStorage.setItem('chakra_intimate_perineal_care', state.perinealCareEnabled);
        localStorage.setItem('chakra_intimate_assisted_bathing', state.assistedBathingEnabled);
        localStorage.setItem('chakra_intimate_massage', state.massageEnabled);
        // Complete the one-time move out of the Yoga/Bath preference namespace.
        localStorage.removeItem('chakra_perineal_care');
        localStorage.removeItem('chakra_assisted_bathing');
        localStorage.removeItem('chakra_massage');
    }

    // Master Toggle Logic
    const musicOnlyToggle = document.getElementById('music-only-toggle');
    const boxBreathingExperienceToggle = document.getElementById('box-breathing-experience-toggle');
    const hooponoponoExperienceToggle = document.getElementById('hooponopono-experience-toggle');
    const yogaExperienceToggle = document.getElementById('yoga-experience-toggle');
    const corpsePoseToggle = document.getElementById('corpse-pose-toggle');
    const highEnergyToggle = document.getElementById('high-energy-toggle');
    const shotsToggle = document.getElementById('shots-toggle');
    const shotTypeSelect = document.getElementById('shot-type-select');

    function resetShotDurationForType(type) {
        state.timeShot = getShotDefaultDuration(type);
        localStorage.setItem('chakra_time_shot', String(state.timeShot));
    }

    function clearHighEnergyMode() {
        if (!highEnergyToggle) return;
        highEnergyToggle.checked = false;
        state.highEnergyEnabled = false;
    }

    function clearMusicOnlyMode() {
        if (!musicOnlyToggle) return;
        musicOnlyToggle.checked = false;
        state.bgMusicMode = false;
    }

    function clearSleepMode() {
        const sleepToggle = document.getElementById('sleep-mode-toggle');
        if (!sleepToggle) return;
        sleepToggle.checked = false;
        state.sleepExperienceEnabled = false;
        state.sleepMode = false;
    }

    function clearFocusedExperiences(except = null) {
        if (boxBreathingExperienceToggle && boxBreathingExperienceToggle !== except) boxBreathingExperienceToggle.checked = false;
        if (hooponoponoExperienceToggle && hooponoponoExperienceToggle !== except) hooponoponoExperienceToggle.checked = false;
        if (yogaExperienceToggle && yogaExperienceToggle !== except) yogaExperienceToggle.checked = false;
        if (!except || except !== boxBreathingExperienceToggle) state.boxBreathingExperienceEnabled = false;
        if (!except || except !== hooponoponoExperienceToggle) state.hooponoponoExperienceEnabled = false;
        if (!except || except !== yogaExperienceToggle) state.yogaExperienceEnabled = false;
    }

    const intimateServiceToggles = [
        document.getElementById('perineal-care-toggle'),
        document.getElementById('massage-toggle'),
        document.getElementById('assisted-bathing-toggle')
    ].filter(Boolean);

    function clearIntimateService() {
        intimateServiceToggles.forEach(toggle => { toggle.checked = false; });
        state.perinealCareEnabled = false;
        state.massageEnabled = false;
        state.assistedBathingEnabled = false;
        localStorage.setItem('chakra_intimate_perineal_care', 'false');
        localStorage.setItem('chakra_intimate_massage', 'false');
        localStorage.setItem('chakra_intimate_assisted_bathing', 'false');
    }

    function isIntimateServiceToggle(target) {
        return intimateServiceToggles.includes(target);
    }

    function isFocusedExperienceToggle(target) {
        return target === boxBreathingExperienceToggle || target === hooponoponoExperienceToggle || target === yogaExperienceToggle;
    }

    function enforceMasterToggle(target) {
        if (target === musicOnlyToggle && musicOnlyToggle.checked) {
            // Disable other journey features
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences();
            clearIntimateService();
        } else if (target !== musicOnlyToggle && target.checked) {
            // Disable Music Only if any other journey feature is enabled.
            clearMusicOnlyMode();
        }

        if (target === highEnergyToggle && highEnergyToggle.checked) {
            clearMusicOnlyMode();
            clearSleepMode();
            clearFocusedExperiences();
            clearIntimateService();
        }

        const sleepToggle = document.getElementById('sleep-mode-toggle');
        if (target === sleepToggle && sleepToggle.checked) {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearFocusedExperiences();
            clearIntimateService();
        }

        if (isFocusedExperienceToggle(target) && target.checked) {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences(target);
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearIntimateService();
        }

        if (isIntimateServiceToggle(target) && target.checked) {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences();
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
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
    ['corpse-pose-toggle', 'bath-session-toggle'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            persistYogaExperienceSetup();
            updateTimingRowVisibility();
            updateSessionEstimate();
        });
    });
    intimateServiceToggles.forEach(toggle => {
        toggle.addEventListener('change', (event) => {
            enforceMasterToggle(event.target);
            persistIntimateServiceSetup();
            updateExperienceModeVisibility();
            updateSessionEstimate();
        });
    });
    document.querySelectorAll('#yoga-pose-selection input').forEach(input => {
        input.addEventListener('change', () => {
            persistYogaExperienceSetup();
            updateSessionEstimate();
        });
    });
    if (musicOnlyToggle) {
        musicOnlyToggle.addEventListener('change', (e) => {
            state.bgMusicMode = e.target.checked;
            enforceMasterToggle(e.target);
            updateExperienceModeVisibility();
            updateSessionEstimate();
        });
    }

    if (highEnergyToggle) {
        highEnergyToggle.addEventListener('change', (e) => {
            state.highEnergyEnabled = e.target.checked;
            enforceMasterToggle(e.target);
            updateExperienceModeVisibility();
        });
    }

    [boxBreathingExperienceToggle, hooponoponoExperienceToggle, yogaExperienceToggle].forEach(toggle => {
        toggle?.addEventListener('change', (event) => {
            state.boxBreathingExperienceEnabled = boxBreathingExperienceToggle?.checked === true;
            state.hooponoponoExperienceEnabled = hooponoponoExperienceToggle?.checked === true;
            state.yogaExperienceEnabled = yogaExperienceToggle?.checked === true;
            enforceMasterToggle(event.target);
        });
    });

    const sleepModeToggle = document.getElementById('sleep-mode-toggle');
    if (sleepModeToggle) {
        sleepModeToggle.addEventListener('change', (e) => {
            state.sleepExperienceEnabled = e.target.checked;
            enforceMasterToggle(e.target);
            updateExperienceModeVisibility();
        });
    }

    if (shotsToggle) {
        shotsToggle.addEventListener('change', (event) => {
            if (event.target.checked) {
                if (state.noFrequencyMode) {
                    event.target.checked = false;
                    alert(t('ui.noFrequencyShotsUnavailable'));
                    updateExperienceModeVisibility();
                    updateSessionEstimate();
                    return;
                }
                if (!window.confirm(t('ui.shotConfirm'))) {
                    event.target.checked = false;
                    updateExperienceModeVisibility();
                    updateSessionEstimate();
                    return;
                }
                clearMusicOnlyMode();
                clearHighEnergyMode();
                clearSleepMode();
                clearFocusedExperiences();
                clearIntimateService();
                resetShotDurationForType(shotTypeSelect?.value || 'meditation');
            }
            updateExperienceModeVisibility();
            updateSessionEstimate();
        });
    }
    shotTypeSelect?.addEventListener('change', (event) => {
        resetShotDurationForType(event.target.value);
        updateExperienceModeVisibility();
        updateSessionEstimate();
    });

    function prepareRepertoryShotFromUrl() {
        const url = new URL(window.location.href);
        const source = url.searchParams.get('shotSource');
        const frequency = Number(url.searchParams.get('shotFrequency'));
        if (source !== 'repertory') return;

        // Consume the handoff before showing the confirmation. A cancel or a
        // later safety reload must not silently prepare the same Shot again.
        url.searchParams.delete('shotSource');
        url.searchParams.delete('shotFrequency');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);

        if (!shotsToggle || !shotTypeSelect || !Number.isFinite(frequency) || frequency <= 0 || frequency > 20000) {
            alert(t('ui.shotInvalidFrequency'));
            return;
        }

        const frequencyInput = document.getElementById('shot-frequency-input');
        shotTypeSelect.value = 'custom';
        if (frequencyInput) frequencyInput.value = String(frequency);
        resetShotDurationForType('custom');

        // Dispatch the normal Shots change event so the existing headset,
        // loudspeaker and short-exposure confirmation remains authoritative.
        shotsToggle.checked = true;
        shotsToggle.dispatchEvent(new Event('change', { bubbles: true }));
        if (!shotsToggle.checked) return;

        showScreen(lobbyScreen);
        updateExperienceModeVisibility();
        updateSessionEstimate();
        window.requestAnimationFrame(() => {
            document.getElementById('shots-control')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            frequencyInput?.focus({ preventScroll: true });
        });
    }

    [corpsePoseToggle].forEach(toggle => {
        if (toggle) toggle.addEventListener('change', (e) => enforceMasterToggle(e.target));
    });
    
    function updateExperienceModeVisibility() {
        const noFrequencyMode = state.noFrequencyMode;
        const highEnergy = getChecked('high-energy-toggle');
        const musicOnly = getChecked('music-only-toggle');
        const sleep = getChecked('sleep-mode-toggle');
        const intimateService = getChecked('perineal-care-toggle') || getChecked('massage-toggle') || getChecked('assisted-bathing-toggle');
        const focusedExperience = getChecked('box-breathing-experience-toggle') || getChecked('hooponopono-experience-toggle') || getChecked('yoga-experience-toggle') || intimateService;
        const yogaExperience = getChecked('yoga-experience-toggle');
        const normalDuration = document.getElementById('time-per-chakra')?.closest('.time-selector');
        const highEnergyDuration = document.getElementById('high-energy-duration-control');
        const droneDuration = document.getElementById('drone-duration-control');
        const durationLabel = document.querySelector('label[for="time-per-chakra"]');
        const timeInput = document.getElementById('time-per-chakra');
        const meditationRoomTitle = document.getElementById('lobby-title');
        if (shotsToggle) {
            if (noFrequencyMode) shotsToggle.checked = false;
            shotsToggle.disabled = noFrequencyMode;
            shotsToggle.title = noFrequencyMode ? t('ui.noFrequencyShotsUnavailable') : '';
        }
        const shots = getChecked('shots-toggle');
        if (meditationRoomTitle) meditationRoomTitle.hidden = shots;
        const hideForShots = ['chakra-selection-panel', 'drone-duration-control', 'intention-config-group', 'journey-preferences-group', 'experience-mode-group', 'intimate-service-panel', 'open-settings'];
        hideForShots.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.hidden = shots;
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
            shotFrequencyNote.textContent = selectedShotType === 'mood_relaxation' ? t('ui.moodRelaxationShotNote') : '';
            shotFrequencyNote.hidden = !shots || noFrequencyMode || selectedShotType !== 'mood_relaxation';
        }
        if (normalDuration) normalDuration.style.display = shots || focusedExperience || !highEnergy ? (focusedExperience ? 'none' : 'flex') : 'none';
        if (highEnergyDuration) highEnergyDuration.style.display = shots || focusedExperience ? 'none' : (highEnergy ? 'flex' : 'none');
        if (droneDuration && !shots) droneDuration.hidden = musicOnly || noFrequencyMode || focusedExperience;
        if (durationLabel) durationLabel.textContent = t(shots ? 'ui.shotDuration' : (sleep ? 'ui.sleepStageDuration' : 'ui.corePracticeDuration'));
        if (timeInput) {
            const definition = shots ? timingConfig.journey?.shotDuration : sleep ? timingConfig.journey?.sleepStageDuration : timingConfig.journey?.timePerChakra;
            timeInput.min = definition?.min ?? (shots ? 1 : 1);
            timeInput.max = definition?.max ?? (shots ? 20 : sleep ? 10 : 7);
            timeInput.step = definition?.step ?? (shots ? 1 : 0.5);
            const activeValue = shots ? state.timeShot : sleep ? state.timeSleepStage : state.timePerChakra;
            timeInput.value = activeValue;
            const pct = ((activeValue - Number(timeInput.min)) / (Number(timeInput.max) - Number(timeInput.min)) * 100).toFixed(1) + '%';
            timeInput.style.setProperty('--range-fill', pct);
            setText('time-display', shots ? `${Number(activeValue).toFixed(0)} secs` : `${Number(activeValue).toFixed(1)} mins`);
            const rangeControl = timeInput.closest('.range-control');
            if (rangeControl) {
                const maximum = rangeControl.querySelector('.range-max');
                if (maximum) maximum.textContent = timeInput.max;
                const increment = rangeControl.querySelector('.range-increment');
                const decrement = rangeControl.querySelector('.range-decrement');
                if (increment) increment.disabled = Number(timeInput.value) >= Number(timeInput.max);
                if (decrement) decrement.disabled = Number(timeInput.value) <= Number(timeInput.min);
            }
        }
        const shotType = document.getElementById('shot-type-select')?.value;
        const shotLabel = { meditation: 'ui.activateMeditationShot', high_energy: 'ui.activateHighEnergyShot', anesthetic: 'ui.activateAnestheticShot', mood_relaxation: 'ui.activateMoodRelaxationShot', sleep: 'ui.activateSleepShot', custom: 'ui.beginCustomShot' }[shotType] || 'ui.beginJourney';
        const focusedLabel = getChecked('box-breathing-experience-toggle')
            ? 'ui.beginBoxBreathing'
            : getChecked('yoga-experience-toggle') ? 'ui.beginYogaExperience'
                : intimateService ? 'ui.beginIntimateService' : 'ui.beginHooponopono';
        if (startMeditationBtn) startMeditationBtn.textContent = t(shots ? shotLabel : (focusedExperience ? focusedLabel : 'ui.beginJourney'));
        document.getElementById('shots-control')?.classList.toggle('shots-active', shots);
        refreshRangeControlDisplays();
        syncDroneDurationModeControls();
        updateDroneDurationSummary();
    }

    // Initial call
    updateTimingRowVisibility();
    updateExperienceModeVisibility();
    prepareRepertoryShotFromUrl();
    if (isGeneratedIntention(state.intention)) {
        state.intention = state.highEnergyEnabled
            ? hrimDefaultIntention(state.language)
            : defaultIntention(state.language);
        syncValue('intention-input', state.intention);
        localStorage.setItem('chakra_intention', state.intention);
    }

    function updateSessionEstimate() {
        if (getChecked('shots-toggle')) {
            setText('session-estimate', `~ ${state.timeShot} sec frequency shot`);
            updateJourneyRoadmap();
            return;
        }
        if (getChecked('music-only-toggle')) {
            setText('session-estimate', 'Music only — stop anytime');
            updateJourneyRoadmap();
            return;
        }
        if (getChecked('box-breathing-experience-toggle')) {
            const seconds = state.timeBreathing * 16;
            setText('session-estimate', `~ ${Math.max(1, Math.ceil(seconds / 60))} min ${t('ui.boxBreathingExperience').toLowerCase()}`);
            updateJourneyRoadmap();
            return;
        }
        if (getChecked('hooponopono-experience-toggle')) {
            setText('session-estimate', `~ 4 min ${t('ui.hooponoponoExperience').toLowerCase()}`);
            updateJourneyRoadmap();
            return;
        }
        if (getChecked('perineal-care-toggle') || getChecked('massage-toggle') || getChecked('assisted-bathing-toggle')) {
            let seconds = 0;
            if (getChecked('perineal-care-toggle')) seconds += state.timePerinealCare;
            if (getChecked('massage-toggle')) {
                seconds += (7 * (state.timePerChakra + timing('estimate', 'chakraStageOverhead'))
                    + (state.timeIcebreaker / 60) + timing('estimate', 'baseOverhead') + timing('estimate', 'normalExtra')) * 60;
            }
            if (getChecked('assisted-bathing-toggle')) seconds += state.timeAssistedBathing;
            setText('session-estimate', `~ ${Math.max(1, Math.ceil(seconds / 60))} min ${t('ui.intimateService').toLowerCase()}`);
            updateJourneyRoadmap();
            return;
        }
        if (getChecked('yoga-experience-toggle')) {
            const poseCount = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).length;
            const bathEnabled = getChecked('bath-session-toggle');
            let seconds = state.timeYogaPrep + poseCount * (state.timeYogaPose + timing('estimate', 'yogaPoseTransitionEstimate'));
            if (getChecked('corpse-pose-toggle')) seconds += state.timeCorpse;
            if (bathEnabled) {
                seconds += state.timeBath;
                seconds += timing('transitions', 'bathToYogaRest');
            }
            setText('session-estimate', `~ ${Math.max(1, Math.ceil(seconds / 60))} min ${t('ui.yogaExperience').toLowerCase()}`);
            updateJourneyRoadmap();
            return;
        }
        if (getChecked('sleep-mode-toggle')) {
            setText('session-estimate', `~ ${Math.round(state.timeSleepStage * SLEEP_STAGE_COUNT)} min sleep journey`);
            updateJourneyRoadmap();
            return;
        }
        const isHigh = getChecked('high-energy-toggle');
        let overhead = timing('estimate', 'baseOverhead');

        const estimate = isHigh
            ? Math.round(state.timeHighEnergy + (state.timeIcebreaker / 60) + timing('estimate', 'highEnergyExtra'))
            : Math.round(state.selectedChakras.length * (state.timePerChakra + timing('estimate', 'chakraStageOverhead')) + (state.timeIcebreaker / 60) + overhead + timing('estimate', 'normalExtra'));
        setText('session-estimate', `~ ${estimate} min session`);
        updateJourneyRoadmap();
    }

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
                        allowLanguageFallback: true,
                        highEnergy: getChecked('high-energy-toggle'),
                        corpse: getChecked('corpse-pose-toggle'),
                        bath: false,
                        perinealCare: false,
                        assistedBathing: false,
                        massage: false,
                        yoga: false
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
                    allowLanguageFallback: true,
                    highEnergy: getChecked('high-energy-toggle'),
                    corpse: getChecked('corpse-pose-toggle'),
                    bath: false,
                    perinealCare: false,
                    assistedBathing: false,
                    massage: false,
                    yoga: false
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

    timeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        if (getChecked('shots-toggle')) {
            state.timeShot = value;
            timeDisplay.textContent = `${state.timeShot.toFixed(0)} secs`;
            localStorage.setItem('chakra_time_shot', state.timeShot);
        } else if (getChecked('sleep-mode-toggle')) {
            state.timeSleepStage = value;
            timeDisplay.textContent = `${state.timeSleepStage.toFixed(1)} mins`;
            localStorage.setItem('chakra_time_sleep_stage', state.timeSleepStage);
        } else {
            state.timePerChakra = value;
            timeDisplay.textContent = `${state.timePerChakra.toFixed(1)} mins`;
            localStorage.setItem('chakra_time', state.timePerChakra);
        }
        const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
        e.target.style.setProperty('--range-fill', pct);
        updateDroneDurationSummary();
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
            updateDroneDurationSummary();
            updateSessionEstimate();
        });
    }

    document.querySelectorAll('input[name="drone-duration-mode"]').forEach(input => {
        input.addEventListener('change', (event) => {
            if (!event.target.checked) return;
            if (getChecked('high-energy-toggle')) {
                state.hrimDroneDurationMode = normalizeHrimDroneDurationMode(event.target.value);
                localStorage.setItem('chakra_hrim_drone_duration_mode', state.hrimDroneDurationMode);
            } else if (getChecked('sleep-mode-toggle')) {
                state.sleepDroneDurationMode = normalizeSleepDroneDurationMode(event.target.value);
                localStorage.setItem('chakra_sleep_drone_duration_mode', state.sleepDroneDurationMode);
            } else {
                state.droneDurationMode = normalizeDroneDurationMode(event.target.value);
                localStorage.setItem('chakra_drone_duration_mode', state.droneDurationMode);
            }
            syncDroneDurationModeControls();
            updateDroneDurationSummary();
        });
    });

    document.getElementById('high-energy-toggle').addEventListener('change', updateSessionEstimate);
    function setNoFrequencyMode(enabled) {
        state.noFrequencyMode = Boolean(enabled);
        localStorage.setItem('chakra_no_frequency_mode', state.noFrequencyMode);
        syncChecked('no-frequency-mode-toggle', state.noFrequencyMode);
        syncChecked('mixer-no-frequency-mode-toggle', state.noFrequencyMode);
        const moodRelaxationToggle = document.getElementById('mood-relaxation-intention-toggle');
        if (moodRelaxationToggle) moodRelaxationToggle.disabled = state.noFrequencyMode;
        if (state.noFrequencyMode) {
            meditation.cancelDroneTimer();
            audio.stopDrone();
            audio.stopFrequencyShot();
            audio.stopPleasureAmbience();
        } else if (state.moodRelaxationIntentionEnabled && meditation.isMeditationActive && !state.bgMusicMode) {
            void audio.startPleasureAmbience();
        }
        syncPleasureAmbienceControl();
        updateExperienceModeVisibility();
        updateSessionEstimate();
    }
    function setNoMantraMode(enabled) {
        state.noMantraMode = Boolean(enabled);
        localStorage.setItem('chakra_no_mantra_mode', state.noMantraMode);
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
    document.getElementById('no-frequency-mode-toggle').addEventListener('change', (e) => setNoFrequencyMode(e.target.checked));
    document.getElementById('no-mantra-mode-toggle')?.addEventListener('change', (e) => setNoMantraMode(e.target.checked));
    document.getElementById('mood-relaxation-intention-toggle')?.addEventListener('change', (e) => {
        if (state.noFrequencyMode) {
            e.target.checked = state.moodRelaxationIntentionEnabled;
            return;
        }
        state.moodRelaxationIntentionEnabled = e.target.checked;
        if (state.moodRelaxationIntentionEnabled) state.pleasureAmbienceBlur = true;
        audio.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
        syncPleasureAmbienceControl();
        if (state.moodRelaxationIntentionEnabled && meditation.isMeditationActive && !state.bgMusicMode) {
            void audio.startPleasureAmbience();
        } else if (!state.moodRelaxationIntentionEnabled) {
            audio.stopPleasureAmbience();
        }
    });
    document.getElementById('pleasure-ambience-intensity')?.addEventListener('change', (event) => {
        state.pleasureAmbienceIntensity = normalizePleasureAmbienceIntensity(event.target.value);
        audio.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
        syncPleasureAmbienceControl();
    });
    document.getElementById('mood-relaxation-ambience-level')?.addEventListener('input', (event) => {
        const requestedGain = clampPleasureAmbienceGain(Number(event.target.value) / 100);
        const previousGain = state.pleasureAmbienceGain;
        if (requestedGain > PLEASURE_AMBIENCE_CONFIRM_THRESHOLD && previousGain <= PLEASURE_AMBIENCE_CONFIRM_THRESHOLD) {
            const confirmed = window.confirm(t('ui.pleasureAmbienceAboveFiveConfirm'));
            if (!confirmed) {
                syncPleasureAmbienceControl();
                return;
            }
        }
        state.pleasureAmbienceGain = requestedGain;
        localStorage.setItem('chakra_pleasure_ambience_gain', state.pleasureAmbienceGain);
        syncPleasureAmbienceControl();
        audio.setPleasureAmbienceGain(state.pleasureAmbienceGain);
    });
    document.getElementById('pleasure-ambience-blur-toggle')?.addEventListener('change', (event) => {
        state.pleasureAmbienceBlur = event.target.checked;
        audio.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
    });
    document.getElementById('pleasure-ambience-blur-level')?.addEventListener('input', (event) => {
        state.pleasureAmbienceBlurAmount = clampPleasureAmbienceBlurAmount(Number(event.target.value) / 100);
        localStorage.setItem('chakra_pleasure_ambience_blur_amount', state.pleasureAmbienceBlurAmount);
        syncPleasureAmbienceControl();
        audio.setPleasureAmbienceBlur(state.pleasureAmbienceBlur);
    });
    const pleasureAmbienceUrlInput = document.getElementById('pleasure-ambience-url');
    const loadPleasureAmbienceUrlButton = document.getElementById('load-pleasure-ambience-url');
    const pleasureAmbienceUrlStatus = document.getElementById('pleasure-ambience-url-status');
    const setPleasureAmbienceUrlStatus = (message, tone = 'neutral') => {
        if (!pleasureAmbienceUrlStatus) return;
        delete pleasureAmbienceUrlStatus.dataset.availability;
        pleasureAmbienceUrlStatus.textContent = message;
        pleasureAmbienceUrlStatus.hidden = false;
        pleasureAmbienceUrlStatus.style.color = tone === 'success'
            ? '#4ade80'
            : tone === 'error'
                ? '#f87171'
                : 'rgba(255, 255, 255, 0.72)';
    };
    loadPleasureAmbienceUrlButton?.addEventListener('click', async () => {
        const url = pleasureAmbienceUrlInput?.value.trim() || '';
        loadPleasureAmbienceUrlButton.disabled = true;
        setPleasureAmbienceUrlStatus(t('ui.pleasureAmbienceUrlLoading'));
        try {
            await audio.loadPleasureAmbienceUrl(url);
            setPleasureAmbienceUrlStatus(
                url ? t('ui.pleasureAmbienceUrlLoaded') : t('ui.pleasureAmbienceUrlCleared'),
                'success'
            );
        } catch (error) {
            const errorMessage = error?.message || String(error);
            setPleasureAmbienceUrlStatus(
                t('ui.pleasureAmbienceUrlError').replace('{error}', errorMessage),
                'error'
            );
            syncPleasureAmbienceControl();
        } finally {
            loadPleasureAmbienceUrlButton.disabled = state.noFrequencyMode;
        }
    });
    document.querySelectorAll('#yoga-pose-selection input').forEach(cb => {
        cb.addEventListener('change', updateSessionEstimate);
    });
    document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', persistChakraSelection);
    });
    openSettingsBtn.addEventListener('click', () => showScreen(configScreen));
    document.getElementById('open-experiment-mode')?.addEventListener('click', () => showScreen(experimentScreen));
    document.getElementById('close-experiment')?.addEventListener('click', () => showScreen(configScreen));
    const experimentActivity = document.getElementById('experiment-activity');
    const experimentDuration = document.getElementById('experiment-core-duration');
    const experimentDurationGroup = document.getElementById('experiment-core-duration-group');
    const syncExperimentDuration = () => {
        const activity = experimentActivity?.value || '';
        const config = activity.startsWith('chakra:') || activity === 'hrim'
            ? { min: 1, max: 7, step: 0.5, value: state.timePerChakra, unit: 'min' }
            : activity === 'box'
                ? { min: 4, max: 16, step: 1, value: state.timeBreathing, unit: 'sec' }
                : activity === 'corpse'
                    ? { min: 60, max: 600, step: 30, value: state.timeCorpse, unit: 'sec' }
                    : activity === 'perineal'
                            ? { min: 30, max: 900, step: 30, value: state.timePerinealCare, unit: 'min' }
                            : activity === 'assisted-bath'
                                ? { min: 60, max: 1800, step: 60, value: state.timeAssistedBathing, unit: 'min' }
                                : activity === 'bath'
                                    ? { min: 60, max: 1800, step: 60, value: state.timeBath, unit: 'min' }
                                    : null;
        if (experimentDurationGroup) experimentDurationGroup.hidden = !config;
        if (experimentDuration) {
            if (config) {
                experimentDuration.min = String(config.min);
                experimentDuration.max = String(config.max);
                experimentDuration.step = String(config.step);
                experimentDuration.value = String(config.value);
                experimentDuration.dataset.unit = config.unit;
            }
            const displayValue = experimentDuration.dataset.unit === 'min' && Number(experimentDuration.value) >= 60
                ? `${Number(experimentDuration.value) / 60} min`
                : `${experimentDuration.value} ${experimentDuration.dataset.unit || 'min'}`;
            setText('experiment-core-duration-value', displayValue);
        }
    };
    experimentActivity?.addEventListener('change', syncExperimentDuration);
    experimentDuration?.addEventListener('input', () => {
        const unit = experimentDuration.dataset.unit || 'min';
        const displayValue = unit === 'min' && Number(experimentDuration.value) >= 60
            ? `${Number(experimentDuration.value) / 60} min`
            : `${experimentDuration.value} ${unit}`;
        setText('experiment-core-duration-value', displayValue);
    });
    syncExperimentDuration();
    document.getElementById('start-experiment')?.addEventListener('click', () => {
        const activity = document.getElementById('experiment-activity')?.value;
        if (activity) meditation.startExperiment(activity);
    });
    beginConsultationBtn?.addEventListener('click', () => {
        window.location.href = './docs/assesment.html';
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

    startMeditationBtn.addEventListener('click', async () => {
        if (getChecked('shots-toggle')) {
            const shotType = document.getElementById('shot-type-select')?.value || 'meditation';
            const customFrequency = Number(document.getElementById('shot-frequency-input')?.value);
            if (!audio.isInitialized) await audio.init();
            meditation.runShot(shotType, customFrequency);
            return;
        }
        state.sleepMode = getChecked('sleep-mode-toggle');
        const focusedExperience = meditation.getFocusedExperience();
        if (focusedExperience === 'yoga' && state.selectedYogaPoses.length === 0) {
            alert('Please select at least one yoga pose in Settings before beginning the Yoga Experience.');
            return;
        }

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
        } else if (state.sleepMode) {
            document.body.classList.add('sleep-mode-active');
            meditation.runSleepJourney().catch(err => {
                console.error('Failed to start Sleep Mode:', err);
                alert('Failed to start Sleep Mode. Check console.');
                meditation.stop();
            });
        } else {
            const intimateMassage = focusedExperience === 'intimate' && getChecked('massage-toggle');
            const order = intimateMassage
                ? ['crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root']
                : [...state.selectedChakras];
            const isHighEnergy = getChecked('high-energy-toggle');
            if (!focusedExperience && !isHighEnergy && order.length === 0) {
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
        cancelEarnHandoff();
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

    const mixer = document.getElementById('volume-mixer');
    const mixerCloseButtons = [document.getElementById('close-mixer'), document.getElementById('close-mixer-bottom')].filter(Boolean);
    document.getElementById('btn-mixer').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!mixer) return;
        mixer.classList.remove('hidden');
        syncChecked('mixer-no-frequency-mode-toggle', state.noFrequencyMode);
        syncChecked('mixer-no-mantra-mode-toggle', state.noMantraMode);
        syncValue('mixer-spatial-mode', state.spatialMode);
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
    document.getElementById('mixer-no-frequency-mode-toggle')?.addEventListener('change', (e) => setNoFrequencyMode(e.target.checked));
    document.getElementById('mixer-no-mantra-mode-toggle')?.addEventListener('change', (e) => setNoMantraMode(e.target.checked));
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
    document.getElementById('music-echo')?.addEventListener('change', (event) => {
        state.musicEcho = event.target.value;
        localStorage.setItem('chakra_music_echo', state.musicEcho);
        if (audio.setMusicEcho) audio.setMusicEcho(state.musicEcho);
    });
    const setSpatialMode = (mode) => {
        state.spatialMode = normalizeSpatialMode(mode);
        localStorage.setItem('chakra_spatial_mode', state.spatialMode);
        syncValue('spatial-mode', state.spatialMode);
        syncValue('mixer-spatial-mode', state.spatialMode);
        if (audio.setSpatialMode) audio.setSpatialMode(state.spatialMode);
    };
    document.getElementById('spatial-mode')?.addEventListener('change', (event) => setSpatialMode(event.target.value));
    document.getElementById('mixer-spatial-mode')?.addEventListener('change', (event) => setSpatialMode(event.target.value));
    const voicePresets = {
        soft: { clarity: 35, warmth: 65, pace: 0.9 },
        shringara: { clarity: 28, warmth: 82, pace: 0.92 },
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
        const previousVolume = state.volMusic;
        syncVolume('volMusic', e.target.value, volMusicEls);
        audio.setBackgroundMusicVolume(state.volMusic, previousVolume);
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
