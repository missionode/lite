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
// This is an interim operator gate, not a replacement for server-backed
// authentication. The value is a SHA-256 digest, never the plaintext phrase.
const ADVANCED_FEATURES_PASSWORD_HASH = '5ba583e9f1bc6e5836e2822f5982c8cafeb4390af1f9ed140926dd3326e515a3';
const SHOT_CHAKRA_ORDER = Object.freeze(['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']);
const MULTI_STAGE_SHOT_TYPES = Object.freeze(['meditation', 'sleep']);
const SPATIAL_MODES = Object.freeze(['off', 'stereo', 'headphones', 'room']);
const DEFAULT_SPATIAL_MODE = 'off';
const BACKGROUND_MUSIC_STOP_FADE_SECONDS = 8;
const BACKGROUND_MUSIC_ENTRY_FADE_SECONDS = 10;
const BACKGROUND_MUSIC_RESTORE_FADE_SECONDS = 8;
// Change this alongside any committed replacement of background_music.mp3.
// The versioned request avoids reviving an earlier track from an installed
// PWA's cache while keeping the filename simple for local contributors.
const BACKGROUND_MUSIC_ASSET_VERSION = '20260831.1';
const BACKGROUND_MUSIC_URL = `audio/background_music.mp3?v=${BACKGROUND_MUSIC_ASSET_VERSION}`;
const VISUALIZATION_AMBIENCE_URL = 'audio/shane-ivers-space-race.mp3';
const VISUALIZATION_AMBIENCE_ENTRY_FADE_SECONDS = 8;
const VISUALIZATION_AMBIENCE_EXIT_FADE_SECONDS = 10;
// A mantra begins only after this extended music fade completes. The fading
// bed is the calm interval between narration and chant; do not replace it
// with an abrupt mute or a separate dead-silence delay.
const MANTRA_MUSIC_FADE_SECONDS = 6;
const MANTRA_FADE_SECONDS = 8;
const mediaLifecycle = window.ChakraMediaLifecycle;
if (!mediaLifecycle) throw new Error('Media lifecycle module is unavailable.');
const piperLifecycle = window.ChakraPiperLifecycle;
if (!piperLifecycle) throw new Error('Piper lifecycle module is unavailable.');
const audioRouteLifecycle = window.ChakraAudioRouteLifecycle;
if (!audioRouteLifecycle) throw new Error('Audio route lifecycle module is unavailable.');
const journeyRouting = window.ChakraJourneyRouting;
const bodyScanPractice = window.ChakraBodyScanPractice;
const guidedNotingPractice = window.ChakraGuidedNotingPractice;
const dharanaPractice = window.ChakraDharanaPractice;
const boxBreathingPractice = window.ChakraBoxBreathingPractice;
const visualizationPractice = window.ChakraVisualizationPractice;
const hooponoponoPractice = window.ChakraHooponoponoPractice;
const undoUnlearnPractice = window.ChakraUndoUnlearnPractice;
const screenNavigationModule = window.ChakraScreenNavigation;
const sessionEstimate = window.ChakraSessionEstimate;
const moodAmbienceSettingsView = window.ChakraMoodAmbienceSettingsView;
const droneDurationSettingsView = window.ChakraDroneDurationSettingsView;
const lobbyExperienceVisibility = window.ChakraLobbyExperienceVisibility;
const yogaExperienceSettings = window.ChakraYogaExperienceSettings;
const rangeControls = window.ChakraRangeControls;
const journeyRoadmap = window.ChakraJourneyRoadmap;
const localeUiRenderer = window.ChakraLocaleUiRenderer;
const timingSettings = window.ChakraTimingSettings;
const journeyVoiceProfile = window.ChakraJourneyVoiceProfile;
const sessionModeHydration = window.ChakraSessionModeHydration;
const mixerPreferenceHydration = window.ChakraMixerPreferenceHydration;
if (!journeyRouting) throw new Error('Journey routing module is unavailable.');
if (!bodyScanPractice) throw new Error('Body Scan practice module is unavailable.');
if (!guidedNotingPractice) throw new Error('Guided Noting practice module is unavailable.');
if (!dharanaPractice) throw new Error('Dharana practice module is unavailable.');
if (!boxBreathingPractice) throw new Error('Box Breathing practice module is unavailable.');
if (!visualizationPractice) throw new Error('Visualization practice module is unavailable.');
if (!hooponoponoPractice) throw new Error('Ho\'oponopono practice module is unavailable.');
if (!undoUnlearnPractice) throw new Error('Undo & Unlearn practice module is unavailable.');
if (!journeyVoiceProfile) throw new Error('Journey voice profile module is unavailable.');
if (!sessionModeHydration) throw new Error('Session mode hydration module is unavailable.');
if (!mixerPreferenceHydration) throw new Error('Mixer preference hydration module is unavailable.');
if (!screenNavigationModule) throw new Error('Screen navigation module is unavailable.');
if (!sessionEstimate) throw new Error('Session estimate module is unavailable.');
if (!moodAmbienceSettingsView) throw new Error('Mood ambience settings view module is unavailable.');
if (!droneDurationSettingsView) throw new Error('Drone duration settings view module is unavailable.');
if (!lobbyExperienceVisibility) throw new Error('Lobby experience visibility module is unavailable.');
if (!yogaExperienceSettings) throw new Error('Yoga experience settings module is unavailable.');
if (!rangeControls) throw new Error('Range controls module is unavailable.');
if (!journeyRoadmap) throw new Error('Journey roadmap module is unavailable.');
if (!localeUiRenderer) throw new Error('Locale UI renderer module is unavailable.');
if (!timingSettings) throw new Error('Timing settings module is unavailable.');

function stageFadeSeconds(durationSeconds) {
    return mediaLifecycle.stageFadeSeconds(durationSeconds);
}

async function withAudioStageFade(audioEngine, seconds, action) {
    return mediaLifecycle.withAudioStageFade(audioEngine, seconds, action);
}
const VOICE_REVERB_TAIL_SECONDS = 5;
const VOICE_REVERB_TAIL_DECAY = 3.8;
const MUSIC_REVERB_TAIL_SECONDS = 5;
const MUSIC_REVERB_TAIL_DECAY = 4.8;
const MANTRA_REVERB_TAIL_SECONDS = 7;
const MANTRA_REVERB_TAIL_DECAY = 2.2;
const MANTRA_REVERB_TAIL_WET = 0.26;
const PIPER_CLIP_FADE_SECONDS = mediaLifecycle.constants.PIPER_CLIP_FADE_SECONDS;
// The final narration sentence receives a longer tail before every mantra.
// This keeps Crown/AUM and all other chakra handoffs unhurried and seamless.
const NARRATION_MANTRA_FADE_SECONDS = 5;
const PIPER_CANCEL_FADE_SECONDS = mediaLifecycle.constants.PIPER_CANCEL_FADE_SECONDS;
const JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS = 2.4;
// The supplied generate.mp4 is only about ten seconds long. Keep nearly the
// entire clip visible and dissolve only across its final 0.25 seconds.
const JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS = 0.25;
const JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS = 1.2;
// Keep the short generated prelude responsive: a few seconds of measured
// reserve is enough to reveal the guide control without waiting for the full
// clip, while playback still pauses and recovers if the connection falls
// behind later.
const JOURNEY_VIDEO_PRELUDE_MEDITATOR_HOLD_SECONDS = 3;
const JOURNEY_VIDEO_PRELUDE_BUFFER_MIN_SECONDS = 4;
const JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS = 8;
const JOURNEY_VIDEO_PRELUDE_BUFFER_STABILITY_MS = 750;
const JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS = 2;
const JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS = 4;
const DND_REMINDER_FALLBACK = "Before we begin: Please ensure 'Do Not Disturb' is enabled on your device to prevent interruptions.";

const CELESTIAL_DEG = Math.PI / 180;
const CELESTIAL_RAD = 180 / Math.PI;
const CELESTIAL_LABEL_KEYS = Object.freeze({
    Sun: 'ui.celestialSun', Mercury: 'ui.celestialMercury', Venus: 'ui.celestialVenus', Earth: 'ui.celestialEarth',
    Mars: 'ui.celestialMars', Jupiter: 'ui.celestialJupiter', Saturn: 'ui.celestialSaturn', Uranus: 'ui.celestialUranus', Neptune: 'ui.celestialNeptune', Moon: 'ui.celestialMoon', Polaris: 'ui.celestialPolaris',
    Sirius: 'ui.celestialSirius', Canopus: 'ui.celestialCanopus', RigilKent: 'ui.celestialRigilKent', Vega: 'ui.celestialVega', Arcturus: 'ui.celestialArcturus',
    Capella: 'ui.celestialCapella', Rigel: 'ui.celestialRigel', Procyon: 'ui.celestialProcyon', Achernar: 'ui.celestialAchernar', Altair: 'ui.celestialAltair',
    Betelgeuse: 'ui.celestialBetelgeuse', Acrux: 'ui.celestialAcrux', Aldebaran: 'ui.celestialAldebaran', Spica: 'ui.celestialSpica', Antares: 'ui.celestialAntares',
    Pollux: 'ui.celestialPollux', Fomalhaut: 'ui.celestialFomalhaut', Deneb: 'ui.celestialDeneb', Regulus: 'ui.celestialRegulus'
});

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
const MEDITATION_VISUAL_EFFECTS = new Set(['natural', 'aura', 'holographic', 'depth']);

function normalizeMeditationVisualEffect(value) {
    return MEDITATION_VISUAL_EFFECTS.has(value) ? value : 'natural';
}

// ── DOM ELEMENTS (Declared First to prevent TDZ Errors) ──────────────────────
const configScreen = document.getElementById('config-screen');
const settingsManagerScreen = document.getElementById('settings-manager-screen');
const experimentScreen = document.getElementById('experiment-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const meditationScreen = document.getElementById('meditation-screen');
const breathingScreen = document.getElementById('breathing-screen');
const icebreakerScreen = document.getElementById('icebreaker-screen');
const newcomerTutorialScreen = document.getElementById('newcomer-tutorial-screen');
const screenNavigation = screenNavigationModule.create({
    body: document.body,
    document,
    window,
    screens: [configScreen, settingsManagerScreen, experimentScreen, lobbyScreen, meditationScreen, breathingScreen, icebreakerScreen, newcomerTutorialScreen],
    lobbyScreen,
    configScreen,
    dispatchDecorationChange: () => document.dispatchEvent(new Event('decorationchange'))
});
const icebreakerTimer = document.getElementById('icebreaker-timer');

const NEWCOMER_MARKER_ANCHORS = Object.freeze({
    crown: [0.5, 0.065], thirdeye: [0.5, 0.123], throat: [0.5, 0.205],
    heart: [0.5, 0.297], solar: [0.5, 0.385], sacral: [0.5, 0.465], root: [0.5, 0.548]
});
let newcomerConnectorFrame = null;
function syncNewcomerMarkerConnectors() {
    newcomerConnectorFrame = null;
    const stage = document.querySelector('.newcomer-body-map-stage');
    const image = stage?.querySelector('img');
    const svg = document.getElementById('newcomer-marker-connectors');
    if (!stage || !image || !svg || !image.complete) return;
    const stageRect = stage.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    if (!stageRect.width || !imageRect.width) return;
    svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
    Object.entries(NEWCOMER_MARKER_ANCHORS).forEach(([marker, [x, y]]) => {
        const label = stage.querySelector(`[data-marker="${marker}"]`);
        const path = svg.querySelector(`path[data-marker="${marker}"]`);
        if (!label || !path) return;
        const labelRect = label.getBoundingClientRect();
        const targetX = imageRect.left - stageRect.left + imageRect.width * x;
        const targetY = imageRect.top - stageRect.top + imageRect.height * y;
        const labelOnLeft = labelRect.left + labelRect.width / 2 < imageRect.left + imageRect.width / 2;
        const startX = (labelOnLeft ? labelRect.right : labelRect.left) - stageRect.left;
        const startY = Math.max(labelRect.top, Math.min(targetY + stageRect.top, labelRect.bottom)) - stageRect.top;
        const bend = (targetX - startX) * 0.42;
        path.setAttribute('d', `M ${startX} ${startY} C ${startX + bend} ${startY}, ${targetX - bend} ${targetY}, ${targetX} ${targetY}`);
    });
}
function scheduleNewcomerMarkerSync() {
    if (newcomerConnectorFrame !== null) return;
    newcomerConnectorFrame = requestAnimationFrame(syncNewcomerMarkerConnectors);
}
const newcomerMapImage = document.querySelector('.newcomer-body-map-stage img');
newcomerMapImage?.addEventListener('load', scheduleNewcomerMarkerSync);
new ResizeObserver(scheduleNewcomerMarkerSync).observe(document.querySelector('.newcomer-body-map-stage'));

const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');
const testVoiceBtn = document.getElementById('test-voice');
const saveConfigBtn = document.getElementById('save-config');
const timeSlider = document.getElementById('time-per-chakra');
const timeDisplay = document.getElementById('time-display');
const startMeditationBtn = document.getElementById('start-meditation');
const openSettingsBtn = document.getElementById('open-settings');
const beginConsultationBtn = document.getElementById('begin-consultation');

const {
    FORMAT: SETTINGS_BACKUP_FORMAT,
    VERSION: SETTINGS_BACKUP_VERSION,
    collectManagedSettings,
    parseSettingsBackup,
    replaceManagedSettings
} = window.ChakraSettingsBackup;

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
const setText = (id, txt) => {
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
    return window.ChakraContentLocalization.getPath(source, path);
}

function hasScriptPath(source, path) {
    return window.ChakraContentLocalization.hasPath(source, path);
}

function hasLocalizedScriptPath(scripts, path, fallbackLanguage = null) {
    return window.ChakraContentLocalization.hasLocalizedPath(scripts, path, fallbackLanguage);
}

function validateScriptBundle(scripts, options = {}) {
    return window.ChakraContentLocalization.validateScriptBundle(scripts, {
        ...options,
        registeredLanguages: languageRegistry.map(language => language.id)
    });
}

const DEMO_SCRIPT_ID = 'stakeholder-client-demo';
const DEMO_CORE_DURATION_SECONDS = 30;
const DEMO_CORE_DURATION_MINUTES = DEMO_CORE_DURATION_SECONDS / 60;
const DEMO_PREVIOUS_CORE_DURATION_STORAGE_KEY = 'chakra_demo_previous_time';

function getDemoCoreDurationMinutes(script) {
    const metadata = script?._demo;
    return metadata?.id === DEMO_SCRIPT_ID &&
        Number(metadata.recommendedCoreDurationSeconds) === DEMO_CORE_DURATION_SECONDS
        ? DEMO_CORE_DURATION_MINUTES
        : null;
}

function getDemoScriptTimingMessage() {
    const key = 'ui.demoScriptTimingApplied';
    const message = t(key);
    // A stale installed language cache must never expose an implementation
    // key to a client during a demonstration.
    return message === key
        ? 'Demo journey ready — 30 seconds per selected chakra.'
        : message;
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

function timing(section, key, fallback = 0) {
    return timingSettings.resolve(timingConfig, section, key, fallback);
}

function timingDefault(key, fallback) {
    return timingSettings.resolveJourneyDefault(timingConfig, key, fallback);
}

function enhanceRangeControls() {
    rangeControls.enhance({ document, EventConstructor: window.Event });
}

function refreshRangeControlDisplays() {
    rangeControls.refresh({ document });
}

async function loadTimingConfig() {
    timingConfig = await timingSettings.loadAndApply({
        initialConfig: timingConfig,
        fetchConfig: path => fetch(path),
        search: window.location.search,
        storage: localStorage,
        state,
        document,
        enhanceRangeControls,
        applyDemoCoreDurationPreset,
        onConfig: config => { timingConfig = config; },
        onProfile: profileName => console.info(`[Timing] Using profile: ${profileName}`),
        onWarning: (message, error) => console.warn(message, error)
    });
}

function getLanguageConfig(language = state.language) {
    return window.ChakraContentLocalization.getLanguageConfig(languageRegistry, language, 'en');
}

function getLocalizedValue(bundle, path) {
    return window.ChakraContentLocalization.getPath(bundle, path);
}

function localized(source, field = null, language = state.language) {
    return window.ChakraContentLocalization.localized(source, field, language);
}

function t(path, language = state.displayLanguage) {
    return window.ChakraContentLocalization.translate(localeBundles, path, language, fallbackLanguageId);
}

// In-session stage labels must follow the narrated Meditation Language. This
// deliberately differs from Settings, which follows Display Language.
function journeyT(path) {
    return t(path, state.language);
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
    droneDurationSettingsView.sync({ document, highEnergy, sleep, activeMode });
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
    return journeyRoadmap.resolveLabels({ state, isChecked: getChecked, translate: t });
}

function updateJourneyRoadmap() {
    journeyRoadmap.render({ document, state, isChecked: getChecked, translate: t });
}

function applyLocaleUI() {
    particleField.updateSkyLocationStatus();
    particleField.celestialLayerKey = null;
    if (particleField.started) particleField.draw(performance.now(), false);
    document.documentElement.lang = getLanguageConfig(state.displayLanguage).locale || state.displayLanguage;
    localeUiRenderer.render({
        document,
        translate: t,
        setText,
        testVoiceButton: testVoiceBtn,
        settingsButton: openSettingsBtn,
        consultationButton: beginConsultationBtn,
        refreshJourneyRoadmap: updateJourneyRoadmap,
        refreshDroneDurationSummary: updateDroneDurationSummary
    });
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

function splitNarrationText(text, limit = 180) {
    return mediaLifecycle.splitNarrationText(text, limit);
}

// Audio Engine
const SeamlessLoop = mediaLifecycle.SeamlessLoop;

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
        this.bgMusicEntryEndsAt = 0;
        this.bgMusicRetirePromise = null;
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
        this.musicEchoTailGate = null;
        this.journeyVideoPreludeMedia = null;
        this.journeyVideoPreludeSource = null;
        this.journeyVideoPreludeGain = null;
        this.pleasureSourceGain = null;
        this.pleasureGain = null;
        this.pleasureEnhancer = null;
        this.pleasureEnhancerGain = null;
        this.bgMusicBusGain = null;
        this.bgMusicTargetVolume = null;
        this.bgMusicTargetEQ = 0;
        this.bgMusicRestoreTimer = null;
        this.bgMusicSuppressedByMantra = false;
        this.visualizationAmbienceBuffer = null;
        this.visualizationAmbienceLoop = null;
        this.visualizationAmbienceGain = null;
        this.visualizationAmbienceDucked = false;
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
        // Fixed pre-delay separates consonants from ambience without pitch
        // modulation when switching presets during a spoken phrase.
        this.voiceEchoDelay.delayTime.setValueAtTime(0.035, this.ctx.currentTime);
        this.voiceEchoLowCut = this.ctx.createBiquadFilter();
        this.voiceEchoLowCut.type = 'highpass';
        this.voiceEchoLowCut.frequency.setValueAtTime(180, this.ctx.currentTime);
        this.voiceEchoLowCut.Q.setValueAtTime(0.707, this.ctx.currentTime);
        this.voiceEchoConvolver = this.ctx.createConvolver();
        this.voiceEchoConvolver.buffer = this.createDiffuseReverbImpulse(
            VOICE_REVERB_TAIL_SECONDS,
            VOICE_REVERB_TAIL_DECAY,
            731
        );
        this.voiceEchoFilter = this.ctx.createBiquadFilter();
        this.voiceEchoFilter.type = 'lowpass';
        this.voiceEchoFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.voiceEchoWetGain = this.ctx.createGain();
        this.voiceEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoSend.connect(this.voiceEchoLowCut);
        this.voiceEchoLowCut.connect(this.voiceEchoDelay);
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
        this.bgMusicEQ.type = 'peaking';
        this.bgMusicEQ.gain.setValueAtTime(0, this.ctx.currentTime);
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
        this.musicEchoConvolver.buffer = this.createDiffuseReverbImpulse(
            MUSIC_REVERB_TAIL_SECONDS,
            MUSIC_REVERB_TAIL_DECAY,
            1777
        );
        this.musicEchoFilter = this.ctx.createBiquadFilter();
        this.musicEchoFilter.type = 'lowpass';
        this.musicEchoFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.musicEchoWetGain = this.ctx.createGain();
        this.musicEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        // Stop new music from entering reverb at a transition while allowing
        // the already-created diffuse tail to settle naturally.
        this.musicEchoTailGate = this.ctx.createGain();
        this.musicEchoTailGate.gain.setValueAtTime(1, this.ctx.currentTime);
        this.musicEchoTailGate.connect(this.musicEchoSend);
        this.musicEchoSend.connect(this.musicEchoDelay);
        this.musicEchoDelay.connect(this.musicEchoConvolver);
        this.musicEchoConvolver.connect(this.musicEchoFilter);
        this.musicEchoFilter.connect(this.musicEchoWetGain);

        // The dry-music and reverb-tail gates are deliberately separate. A
        // mantra handoff ends new music input but preserves its soft decay.
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
        this.bgMusicSmoothGain.connect(this.musicEchoTailGate);
        this.musicEchoWetGain.connect(this.spatialMusicPanner);
        this.bgMusicBusGain.connect(this.spatialMusicPanner);
        this.spatialMusicPanner.connect(this.lowCutFilter);
        this.visualizationAmbienceGain = this.ctx.createGain();
        this.visualizationAmbienceGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.visualizationAmbienceGain.connect(this.spatialMusicPanner);

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
        pannerLfo.frequency.setValueAtTime(0.018, this.ctx.currentTime);
        pannerLfoGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.spatialPanLfoGain = pannerLfoGain;
        pannerLfo.connect(pannerLfoGain);
        pannerLfoGain.connect(this.pannerNode.pan);
        pannerLfo.start();

        // Keep the source buses separate until after their spatial treatment.
        // A PannerNode can render HRTF positioning for headphones; ordinary
        // speakers receive a safe stereo/equal-power fallback.
        this.spatialDronePanner = this.createSpatialPanner();
        this.spatialMantraPanner = this.createSpatialPanner();

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
        
        // One shared output path. Space comes only from the dedicated
        // voice, music and mantra convolution returns, not a filtered duplicate.
        if (this.presenceFilter) {
            this.exciter.connect(this.presenceFilter);
            this.presenceFilter.connect(this.masterCompressor);
        } else {
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
                if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
                else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
                param.linearRampToValueAtTime(position[axis], now + 1.2);
            });
        } else if (node.pan) {
            if (node.pan.cancelAndHoldAtTime) node.pan.cancelAndHoldAtTime(now);
            else { node.pan.cancelScheduledValues(now); node.pan.setValueAtTime(node.pan.value, now); }
            const pan = Math.atan2(position.x, Math.max(0.1, Math.abs(position.z))) / (Math.PI / 2);
            node.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, pan)), now + 1.2);
        } else if (typeof node.setPosition === 'function') {
            node.setPosition(position.x, position.y, position.z);
        }
    }

    schedulePleasureSpatialApproach(fromCurrent = false) {
        if (!this.ctx || !this.spatialPleasurePanner || !this.pleasureSpatialPosition) return;
        const now = this.ctx.currentTime;
        const position = this.pleasureSpatialPosition;
        const isSpatial = this.spatialMode !== 'off';
        const profile = getPleasureAmbienceIntensityProfile();
        const approachSeconds = profile.approachSeconds;

        if (this.spatialPleasurePanner.positionZ) {
            const nearZ = Number(position.nearZ ?? position.z) * profile.nearDistanceMultiplier;
            const param = this.spatialPleasurePanner.positionZ;
            if (fromCurrent && param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(fromCurrent ? param.value : Number(position.z), now); }
            this.spatialPleasurePanner.positionZ.linearRampToValueAtTime(
                isSpatial ? nearZ : -1,
                now + (isSpatial ? approachSeconds : 1.2)
            );
        } else if (this.pleasureSpatialDepthGain) {
            // StereoPanner fallback: approximate distance with a gentle gain
            // approach when true 3D distance positioning is unavailable.
            const target = isSpatial ? profile.fallbackNearGain : 1;
            const param = this.pleasureSpatialDepthGain.gain;
            if (fromCurrent && param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(fromCurrent ? param.value : (isSpatial ? PLEASURE_SPATIAL_FALLBACK_FAR_GAIN : 1), now); }
            this.pleasureSpatialDepthGain.gain.linearRampToValueAtTime(
                target,
                now + (isSpatial ? approachSeconds : 1.2)
            );
        }
    }

    setSpatialMode(mode = DEFAULT_SPATIAL_MODE) {
        const normalized = normalizeSpatialMode(mode);
        this.spatialMode = normalized;
        if (!this.ctx || !this.spatialDronePanner || !this.spatialMusicPanner || !this.spatialMantraPanner || !this.spatialPleasurePanner) return;
        if (this.appliedSpatialMode === normalized) return;
        this.appliedSpatialMode = normalized;

        const configurations = {
            off: {
                model: 'equalpower', lfo: 0,
                drone: { x: 0, y: 0, z: -1 }, music: { x: 0, y: 0, z: -1 }, mantra: { x: 0, y: 0, z: -1 }, pleasure: { x: 0, y: 0, z: -1, nearZ: -1 }
            },
            stereo: {
                model: 'equalpower', lfo: 0.18,
                drone: { x: 0, y: -0.05, z: -1 }, music: { x: -0.28, y: 0, z: -1 }, mantra: { x: 0.28, y: 0, z: -1 }, pleasure: { x: 0, y: 0.15, z: -6, nearZ: -2.4 }
            },
            headphones: {
                model: 'HRTF', lfo: 0.06,
                drone: { x: 0, y: -0.15, z: -1.2 }, music: { x: -0.5, y: 0.08, z: -1 }, mantra: { x: 0.35, y: 0.08, z: -1.1 }, pleasure: { x: 0, y: 0.2, z: -7, nearZ: -2.8 }
            },
            room: {
                model: 'equalpower', lfo: 0.08,
                drone: { x: 0, y: -0.1, z: -1 }, music: { x: -0.18, y: 0, z: -1 }, mantra: { x: 0.18, y: 0.08, z: -1 }, pleasure: { x: 0, y: 0.25, z: -6.5, nearZ: -2.5 }
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
        if (this.pleasureLoops.some(loop => loop.isRunning)) this.schedulePleasureSpatialApproach(true);
        if (this.spatialPanLfoGain) {
            const param = this.spatialPanLfoGain.gain;
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
            this.spatialPanLfoGain.gain.linearRampToValueAtTime(configurations.lfo, now + 1.2);
        }
        // Voice Space is independent; spatial changes never alter its return.
    }

    setVoiceTuning(warmth = 50, clarity = 50) {
        if (!this.ctx || !this.voiceWarmthFilter || !this.voiceClarityFilter) return;
        const now = this.ctx.currentTime;
        const bounded = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(100, Number(value))) : 50;
        const warmthGain = ((bounded(warmth) - 50) / 50) * 3;
        const clarityGain = ((bounded(clarity) - 50) / 50) * 4;
        for (const [param, target] of [[this.voiceWarmthFilter.gain, warmthGain], [this.voiceClarityFilter.gain, clarityGain]]) {
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
            param.linearRampToValueAtTime(target, now + 0.25);
        }
    }

    setConvolverActive(key, input, convolver, output, active, tailSeconds = 0) {
        return audioRouteLifecycle.setConvolverActive(this, key, input, convolver, output, active, tailSeconds);
    }

    setVoicePlaybackActive(active, exitFade = 0) {
        this.voicePlaybackActive = active;
        this.voiceExitFade = exitFade;
        this.setVoiceEcho(state.voiceEcho);
    }

    setVoiceEcho(mode = 'off') {
        if (!this.ctx || !this.voiceEchoSend || !this.voiceEchoDelay || !this.voiceEchoConvolver || !this.voiceEchoWetGain) return;
        const voiceEchoSettings = {
            off: { wet: 0, filter: 3200 },
            light: { wet: 0.12, filter: 3000 },
            spacious: { wet: 0.18, filter: 3600 }
        };
        const requestedMode = Object.prototype.hasOwnProperty.call(voiceEchoSettings, mode) ? mode : 'off';
        const settings = voiceEchoSettings[requestedMode];
        this.setConvolverActive('voice', this.voiceEchoDelay, this.voiceEchoConvolver, this.voiceEchoFilter, settings.wet > 0 && this.voicePlaybackActive === true, VOICE_REVERB_TAIL_SECONDS + (this.voiceExitFade || 0) + 0.3);
        const now = this.ctx.currentTime;
        [this.voiceEchoSend.gain, this.voiceEchoWetGain.gain, this.voiceEchoFilter.frequency].forEach(param => {
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
        });
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
        this.setConvolverActive('music', this.musicEchoDelay, this.musicEchoConvolver, this.musicEchoFilter, settings.wet > 0, MUSIC_REVERB_TAIL_SECONDS + 0.3);
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
        
        noiseSrc.onended = () => {
            try { breezeLfo.stop(); } catch (error) {}
            for (const node of [noiseSrc, filter, gain, breezeLfo, breezeGainMod, breezeFreqMod]) node.disconnect();
        };
        this.elementalNodes.push({ src: noiseSrc, gain: gain, lfo: breezeLfo });
    }

    startDrone(baseFreq, index = 0) {
        this.stopDrone();
        if (state.noFrequencyMode) return;
        if (!this.ctx) return;
        
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
        
        // Keep one restrained main tone. The previous half-frequency lower
        // oscillator was intentionally removed so the drone stays clean.
        const mainOscillator = this.ctx.createOscillator();
        const mainDroneGain = this.ctx.createGain();
        mainOscillator.type = 'sine';
        mainOscillator.frequency.setValueAtTime(droneFreq, this.ctx.currentTime);
        const mainDroneFilter = this.ctx.createBiquadFilter();
        mainDroneFilter.type = 'lowpass';
        mainDroneFilter.frequency.setValueAtTime(Math.min(droneFreq * 4, this.ctx.sampleRate * 0.45), this.ctx.currentTime);
        mainDroneFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);
        mainDroneGain.gain.setValueAtTime(0, this.ctx.currentTime);
        mainDroneGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 6);
        mainOscillator.connect(mainDroneFilter);
        mainDroneFilter.connect(mainDroneGain);
        mainDroneGain.connect(this.masterGain);
        mainOscillator.start();
        mainOscillator.onended = () => {
            mainOscillator.disconnect(); mainDroneFilter.disconnect(); mainDroneGain.disconnect();
        };
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
        let remaining = 2;
        const finishSupport = osc => () => {
            osc.disconnect();
            if (--remaining === 0) { leftPanner.disconnect(); rightPanner.disconnect(); binauralGain.disconnect(); }
        };
        leftOsc.onended = finishSupport(leftOsc);
        rightOsc.onended = finishSupport(rightOsc);
        this.binauralNodes = [leftOsc, rightOsc, binauralGain];
    }

    startSleepDrone(beatFrequency) {
        this.stopDrone();
        if (state.noFrequencyMode) return;
        if (!this.ctx) return;

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
        mainOscillator.onended = () => {
            mainOscillator.disconnect(); mainFilter.disconnect(); mainGain.disconnect();
        };
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
        let remaining = 2;
        const finishSupport = osc => () => {
            osc.disconnect();
            if (--remaining === 0) { leftPanner.disconnect(); rightPanner.disconnect(); binauralGain.disconnect(); }
        };
        leftOsc.onended = finishSupport(leftOsc);
        rightOsc.onended = finishSupport(rightOsc);
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
        gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(0.2, Number(state.volDrone) || 0)), now + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        this.shotOscillator = osc;
        this.shotGain = gain;
    }

    startGuidedTransitionTone(frequency, durationMs) {
        if (state.noFrequencyMode) return false;
        const requested = Number(frequency);
        if (!this.ctx || !Number.isFinite(requested) || requested <= 0 || requested > 20000) return false;

        this.stopGuidedTransitionTone(0.05);
        const now = this.ctx.currentTime;
        if (!Number.isFinite(Number(durationMs)) || Number(durationMs) <= 0) return false;
        const durationSeconds = Math.max(1, Number(durationMs) / 1000);
        const fadeSeconds = Math.min(1.5, Math.max(0.35, durationSeconds * 0.25));
        const steadyUntil = Math.max(now + fadeSeconds, now + durationSeconds - fadeSeconds);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        // This is a brief guided transition cue, not the public Shot path.
        // Keep it below the main drone ceiling even when the user raises that
        // mixer control for ordinary mantra work.
        const peak = Math.min(Math.max(0, (Number(state.volDrone) || 0) * 0.5), 0.025);
        if (peak === 0) return false;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(requested, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + fadeSeconds);
        gain.gain.setValueAtTime(peak, steadyUntil);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + durationSeconds + 0.05);
        osc.onended = () => {
            osc.disconnect(); gain.disconnect();
            if (this.guidedTransitionTone?.osc === osc) this.guidedTransitionTone = null;
        };
        this.guidedTransitionTone = { osc, gain };
        return true;
    }

    stopGuidedTransitionTone(fadeSeconds = 1) {
        if (!this.ctx || !this.guidedTransitionTone) return;
        const { osc, gain } = this.guidedTransitionTone;
        this.guidedTransitionTone = null;
        const now = this.ctx.currentTime;
        try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.05, fadeSeconds));
            osc.stop(now + Math.max(0.1, fadeSeconds) + 0.05);
        } catch (error) {}
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
        
        if (this.vibrationLFO) {
            try { this.vibrationLFO.stop(now + 5); } catch(e) {}
            this.vibrationLFO = null;
        }
        this.droneOscillators.forEach(({ osc, gain }) => {
            const currentVal = gain.gain.value;
            if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now);
            else { gain.gain.cancelScheduledValues(now); gain.gain.setValueAtTime(currentVal, now); }
            gain.gain.linearRampToValueAtTime(0, now + 5);
            try { osc.stop(now + 5.1); } catch(e) {}
        });
        this.droneOscillators = [];

        if (this.groundingAnchor) {
            const currentVal = this.groundingAnchor.gain.gain.value;
            this.groundingAnchor.gain.gain.cancelScheduledValues(now);
            this.groundingAnchor.gain.gain.setValueAtTime(currentVal, now);
            this.groundingAnchor.gain.gain.linearRampToValueAtTime(0, now + 5);
            const anchorOsc = this.groundingAnchor.osc;
            try { anchorOsc.stop(now + 5.1); } catch(e) {}
            this.groundingAnchor = null;
        }

        this.elementalNodes.forEach(({ src, gain, lfo }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentVal, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
            try { src.stop(now + 5.1); } catch(e) {}
            try { lfo.stop(now + 5.1); } catch(e) {}
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
            // gates silence dry music and stop new tail input while allowing
            // the already-created diffuse tail to settle naturally.
            if (requestId !== this.mantraRequestId || state.noMantraMode) return;
            this.muteBackgroundMusicForMantra(MANTRA_MUSIC_FADE_SECONDS);

            // Standardized to 3.0s crossfade
            this.setConvolverActive('mantra', this.mantraFilter, this.mantraTailConvolver, this.mantraTailFilter, true);
            this.mantraTailWetGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.mantraTailWetGain.gain.setValueAtTime(MANTRA_REVERB_TAIL_WET, this.ctx.currentTime);
            this.mantraLoop = new SeamlessLoop(this.ctx, this.mantraBuffer[key], this.mantraGain, 1, 3.0);
            this.mantraLoop.start(MANTRA_MUSIC_FADE_SECONDS);

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
            this.mantraPresenceLFOGain = lfoGain;
            lfo.onended = () => { lfo.disconnect(); lfoGain.disconnect(); };

            const now = this.ctx.currentTime;
            this.mantraGain.gain.cancelScheduledValues(now);
            // Entry belongs to the new loop, never zero the shared bus: an
            // outgoing mantra may still be fading through it.
            this.mantraGain.gain.setValueAtTime(state.volMantra, now);

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

    stopMantraTrack({ restoreMusic = true, invalidate = true, stageWindow = null } = {}) {
        const fadeSeconds = stageWindow === null ? MANTRA_FADE_SECONDS : Math.min(MANTRA_FADE_SECONDS, Math.max(0, Number(stageWindow) || 0) / 2);
        const tailSeconds = stageWindow === null ? MANTRA_REVERB_TAIL_SECONDS : Math.min(MANTRA_REVERB_TAIL_SECONDS, fadeSeconds);
        this.setConvolverActive('mantra', this.mantraFilter, this.mantraTailConvolver, this.mantraTailFilter, false, fadeSeconds + tailSeconds + 0.1);
        if (invalidate) this.mantraRequestId += 1;
        if (!this.mantraLoop) {
            if (restoreMusic) this.restoreBackgroundMusicAfterMantra();
            return;
        }
        const now = this.ctx.currentTime;

        if (stageWindow !== null && this.mantraTailWetGain) {
            const wet = this.mantraTailWetGain.gain;
            if (wet.cancelAndHoldAtTime) wet.cancelAndHoldAtTime(now);
            else { wet.cancelScheduledValues(now); wet.setValueAtTime(wet.value, now); }
            wet.setValueAtTime(wet.value, now + fadeSeconds);
            wet.linearRampToValueAtTime(0, now + fadeSeconds + tailSeconds);
        }

        if (this.mantraPresenceLFO) {
            const modulation = this.mantraPresenceLFOGain?.gain;
            if (modulation) {
                if (modulation.cancelAndHoldAtTime) modulation.cancelAndHoldAtTime(now);
                else { modulation.cancelScheduledValues(now); modulation.setValueAtTime(modulation.value, now); }
                modulation.linearRampToValueAtTime(0, now + fadeSeconds);
            }
            try { this.mantraPresenceLFO.stop(now + fadeSeconds + 0.02); } catch(e) {}
            this.mantraPresenceLFO = null;
            this.mantraPresenceLFOGain = null;
        }

        // The retiring loop owns the exit envelope (no second bus fade).

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

        this.mantraLoop.stop(fadeSeconds);
        this.mantraLoop = null;

        // Bring the bed back during the outgoing mantra, not after silence.
        if (restoreMusic) {
            this.restoreBackgroundMusicAfterMantra(fadeSeconds);
        }
    }

    async startBackgroundMusic() {
        this.setMusicEcho(state.musicEcho);
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

        // Do not overlap a freshly started journey with the previous
        // journey's retiring loop. The prior stop is allowed to finish its
        // own fade before a new slow entry begins.
        if (this.bgMusicRetirePromise) await this.bgMusicRetirePromise;

        // A stopped loop that is still referenced has not entered the normal
        // retirement path yet. Retire it before creating a replacement.
        if (this.bgMusicLoop) {
            this.stopBackgroundMusic(BACKGROUND_MUSIC_STOP_FADE_SECONDS);
            if (this.bgMusicRetirePromise) await this.bgMusicRetirePromise;
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
        if (this.musicEchoTailGate) {
            const now = this.ctx.currentTime;
            this.musicEchoTailGate.gain.cancelScheduledValues(now);
            this.musicEchoTailGate.gain.setValueAtTime(1, now);
        }

        // The bus owns entry fading; the loop duration controls repeats only.
        this.setMusicEcho(state.musicEcho);
        this.bgMusicLoop = new SeamlessLoop(
            this.ctx,
            this.bgMusicBuffer,
            this.bgMusicGain,
            1.0,
            BACKGROUND_MUSIC_ENTRY_FADE_SECONDS
        );
        this.bgMusicLoop.start();
        this.bgMusicEntryEndsAt = this.ctx.currentTime + BACKGROUND_MUSIC_ENTRY_FADE_SECONDS;
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
        this.setConvolverActive('pleasure', this.pleasureBlurFilter, this.pleasureBlurConvolver, this.pleasureBlurWetGain, false, Math.max(0, fadeTime) + 1);
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
        this.setConvolverActive('pleasure', this.pleasureBlurFilter, this.pleasureBlurConvolver, this.pleasureBlurWetGain, blurMix.wet > 0 && this.pleasureLoops.some(loop => loop.isRunning), 2.2);
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
        if (this.stageFadeWindow) duration = Math.min(duration, this.stageFadeWindow.limit);
        
        // Support for boolean (legacy) and numeric (fine-tuned) volume levels
        // Whisper Quality: Keep narration clearly in front of a very quiet
        // atmospheric bed without muting the room completely.
        let factor = 1.0;
        if (isDucked === true) factor = 0.15;
        else if (typeof isDucked === 'number') factor = isDucked;

        const targetVol = state.volMusic * factor;
        const targetEQ = factor < 1.0 ? -3 : 0; // Gentle, effective midrange cut under guidance
        this.bgMusicTargetVolume = targetVol;
        this.bgMusicTargetEQ = targetEQ;
        
        const now = this.ctx.currentTime;
        
        const liveGain = this.bgMusicGain.gain.value;
        if (this.bgMusicGain.gain.cancelAndHoldAtTime) this.bgMusicGain.gain.cancelAndHoldAtTime(now);
        else {
            this.bgMusicGain.gain.cancelScheduledValues(now);
            this.bgMusicGain.gain.setValueAtTime(liveGain, now);
        }
        if (targetVol <= 0) {
            // Zero is a supported user setting. Linear ramps may end at zero,
            // keeping playback muted without aborting the journey.
            this.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        } else {
            // Linear entry avoids spending most of a long fade near silence.
            this.bgMusicGain.gain.linearRampToValueAtTime(targetVol, now + duration);
        }
        
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(targetEQ, now + duration);
        
        // Loop level is independent of the immutable overlap envelopes.
        if (now >= this.bgMusicEntryEndsAt) this.bgMusicLoop.setGain(1.0);

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

    async startVisualizationAmbience(fadeSeconds = VISUALIZATION_AMBIENCE_ENTRY_FADE_SECONDS, force = false) {
        if (!this.ctx || (!force && state.visualizationAmbience !== 'space-race')) return false;
        if (!this.visualizationAmbienceBuffer) {
            const response = await fetch(VISUALIZATION_AMBIENCE_URL, { cache: 'force-cache' });
            if (!response.ok) throw new Error(`Visualization ambience unavailable (${response.status})`);
            this.visualizationAmbienceBuffer = await this.ctx.decodeAudioData(await response.arrayBuffer());
        }
        if (this.visualizationAmbienceLoop?.isRunning) return true;
        this.visualizationAmbienceDucked = false;
        this.visualizationAmbienceGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.visualizationAmbienceGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.visualizationAmbienceLoop = new SeamlessLoop(this.ctx, this.visualizationAmbienceBuffer, this.visualizationAmbienceGain, state.volVisualizationAmbience, fadeSeconds);
        this.visualizationAmbienceLoop.start(fadeSeconds);
        return true;
    }

    setVisualizationAmbienceDucked(ducked, duration = 1) {
        if (!this.ctx || !this.visualizationAmbienceGain || !this.visualizationAmbienceLoop?.isRunning) return;
        this.visualizationAmbienceDucked = ducked;
        const now = this.ctx.currentTime;
        const target = ducked ? 0.32 : 1;
        this.visualizationAmbienceGain.gain.cancelScheduledValues(now);
        this.visualizationAmbienceGain.gain.setValueAtTime(this.visualizationAmbienceGain.gain.value, now);
        this.visualizationAmbienceGain.gain.linearRampToValueAtTime(target, now + duration);
    }

    setVisualizationAmbienceVolume(level) {
        if (!this.visualizationAmbienceLoop?.isRunning) return;
        this.visualizationAmbienceLoop.setGain(clampAudioLevel(Number(level), 0.02, 0.5, 0.10));
    }

    stopVisualizationAmbience(fadeSeconds = VISUALIZATION_AMBIENCE_EXIT_FADE_SECONDS) {
        if (!this.visualizationAmbienceLoop) return;
        this.visualizationAmbienceLoop.stop(fadeSeconds);
        this.visualizationAmbienceLoop = null;
        this.visualizationAmbienceDucked = false;
    }

    async previewVisualizationAmbience() {
        await this.init();
        this.stopVisualizationAmbience(0.4);
        await this.startVisualizationAmbience(1.2, true);
        window.setTimeout(() => this.stopVisualizationAmbience(2), 8000);
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
        if (this.musicEchoTailGate) {
            if (typeof this.musicEchoTailGate.gain.cancelAndHoldAtTime === 'function') {
                this.musicEchoTailGate.gain.cancelAndHoldAtTime(now);
            } else {
                this.musicEchoTailGate.gain.cancelScheduledValues(now);
                this.musicEchoTailGate.gain.setValueAtTime(this.musicEchoTailGate.gain.value, now);
            }
            this.musicEchoTailGate.gain.linearRampToValueAtTime(0, now + fadeDuration);
        }
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
        if (this.musicEchoTailGate) {
            if (typeof this.musicEchoTailGate.gain.cancelAndHoldAtTime === 'function') {
                this.musicEchoTailGate.gain.cancelAndHoldAtTime(now);
            } else {
                this.musicEchoTailGate.gain.cancelScheduledValues(now);
                this.musicEchoTailGate.gain.setValueAtTime(this.musicEchoTailGate.gain.value, now);
            }
            this.musicEchoTailGate.gain.linearRampToValueAtTime(1, now + Math.max(0, duration));
        }
    }

    stopBackgroundMusic(fadeTime = BACKGROUND_MUSIC_STOP_FADE_SECONDS) {
        this.setConvolverActive('music', this.musicEchoDelay, this.musicEchoConvolver, this.musicEchoFilter, false, Math.max(0, fadeTime) + MUSIC_REVERB_TAIL_SECONDS + 0.1);
        this.cancelBackgroundMusicRestore();
        this.bgMusicSuppressedByMantra = false;
        if (this.bgMusicLoop) {
            const retirementSeconds = Math.max(0, fadeTime);
            this.bgMusicLoop.stop(retirementSeconds);
            this.bgMusicLoop = null;
            this.bgMusicEntryEndsAt = 0;
            const retirement = new Promise(resolve => setTimeout(resolve, (retirementSeconds + 0.1) * 1000));
            this.bgMusicRetirePromise = retirement;
            void retirement.then(() => {
                if (this.bgMusicRetirePromise === retirement) this.bgMusicRetirePromise = null;
            });
        }
    }

    prepareJourneyVideoPrelude(media) {
        this.setMusicEcho(state.musicEcho);
        if (!this.ctx || !this.spatialMusicPanner || !media) return false;
        if (this.journeyVideoPreludeMedia === media && this.journeyVideoPreludeSource) return true;
        if (this.journeyVideoPreludeSource) return false;
        try {
            this.journeyVideoPreludeMedia = media;
            this.journeyVideoPreludeSource = this.ctx.createMediaElementSource(media);
            this.journeyVideoPreludeGain = this.ctx.createGain();
            this.journeyVideoPreludeGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.journeyVideoPreludeSource.connect(this.journeyVideoPreludeGain);
            // The prelude follows the guide's Music Space and Spatial Sound
            // choices without entering any narration, drone, or mantra bus.
            this.journeyVideoPreludeGain.connect(this.spatialMusicPanner);
            this.journeyVideoPreludeGain.connect(this.musicEchoSend);
            return true;
        } catch (error) {
            console.warn('Journey prelude audio routing unavailable:', error);
            return false;
        }
    }

    fadeJourneyVideoPrelude(target = 0, duration = 0) {
        if (!this.ctx || !this.journeyVideoPreludeGain) return;
        const now = this.ctx.currentTime;
        const gain = this.journeyVideoPreludeGain.gain;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(Math.max(0, gain.value), now);
        gain.linearRampToValueAtTime(Math.max(0, target), now + Math.max(0, duration));
    }

    setJourneyVideoPreludeVolume(level) {
        this.fadeJourneyVideoPrelude(clampAudioLevel(Number(level), 0.02, 0.5, 0.2), 0.08);
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
            osc.onended = () => {
                osc.disconnect();
                filter.disconnect();
                gain.disconnect();
            };
        });
    }
}

// Lightweight ambient star field. Most stars are tiny and cheap to redraw;
// only the brighter foreground stars receive independent scintillation so the
// sky feels alive without turning the meditation background into a spectacle.
class AmbientParticleField {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas?.getContext('2d', { alpha: true }) || null;
        this.particles = [];
        this.meteors = [];
        this.nextMeteorAt = 0;
        this.sky = new NaturalNightSky();
        this.celestialLayer = document.createElement('canvas');
        this.celestialLayerKey = null;
        this.renderTimer = null;
        this.lastCelestialRefresh = 0;
        this.cachedMoonPhase = null;
        this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.observer = null;
        this.celestialBodies = [];
        this.deepSkyBlackHoleEnabled = false;
        this.moonBuffer = document.createElement('canvas');
        this.moonBuffer.width = 128;
        this.moonBuffer.height = 128;
        this.moonBufferContext = this.moonBuffer.getContext('2d');
        // Populate an approximate sky immediately; a successful location
        // permission replaces this with the real observer position.
        this.setFallbackObserver();
        this.frame = 0;
        this.lastFrameAt = 0;
        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleMotionChange = this.handleMotionChange.bind(this);
        this.layoutFrame = 0;
        this.invalidateSkyLayout = () => {
            this.celestialLayerKey = null;
            if (!this.started || document.hidden || this.layoutFrame) return;
            // One redraw for an actual layout event, never an idle loop.
            this.layoutFrame = requestAnimationFrame(() => {
                this.layoutFrame = 0;
                if (!document.hidden) this.draw(performance.now(), false);
            });
        };
    }

    start() {
        if (!this.canvas || !this.ctx || this.started) return;
        this.started = true;
        window.addEventListener('resize', this.resize, { passive: true });
        document.addEventListener('visibilitychange', this.handleVisibility);
        document.addEventListener('decorationchange', this.handleMotionChange);
        this.motionPreference.addEventListener('change', this.handleMotionChange);
        this.layoutObserver = new MutationObserver(this.invalidateSkyLayout);
        const mantra = document.getElementById('mantra-display');
        if (mantra) this.layoutObserver.observe(mantra, { childList: true, characterData: true, subtree: true });
        for (const element of document.querySelectorAll('.screen, #controls, body')) {
            this.layoutObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
        }
        this.resize();
        this.requestObserverLocation();
        if (!this.motionPreference.matches && !document.hidden) {
            this.frame = requestAnimationFrame(this.render);
        } else {
            this.draw(performance.now(), false);
        }
    }

    setFallbackObserver() {
        this.observer = { latitude: 51.4779, longitude: 0, height: 0, approximate: true };
    }

    requestObserverLocation() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) return;
                this.observer = { latitude: coords.latitude, longitude: coords.longitude, height: Number.isFinite(coords.altitude) ? coords.altitude : 0, approximate: false };
                this.refreshCelestialBodies();
                this.draw(performance.now(), false);
            },
            () => { /* Keep the approximate fallback sky when declined. */ },
            { enableHighAccuracy: false, maximumAge: 900000, timeout: 8000 }
        );
    }

    refreshCelestialBodies(date = new Date()) {
        if (!this.observer) return;
        if (this.skySnapshot && document.body.classList.contains('static-decorations')) return;
        // Bound retries as well as successful updates; a failed engine must
        // never turn into a per-frame calculation/error loop.
        this.lastCelestialRefresh = performance.now();
        try {
            const sky = SkyAstronomy.snapshot(date, this.observer);
            this.skySnapshot = sky;
            this.skyFailed = false;
            this.celestialDaylight = sky.sunAltitude > -6;
            this.celestialNightVisible = !this.celestialDaylight;
            this.celestialBodies = [...sky.stars.filter(star => star.name), ...sky.bodies];
            if (this.sky.width) this.sky.resize(this.sky.width, this.sky.height, this.sky.dpr, sky.stars, sky.sunAltitude);
            this.updateSkyLocationStatus();
        } catch (error) {
            this.celestialBodies = [];
            this.skySnapshot = null;
            this.skyFailed = true;
            this.celestialDaylight = false;
            if (this.sky.width) this.sky.resize(this.sky.width, this.sky.height, this.sky.dpr);
            this.updateSkyLocationStatus();
            console.warn('Sky position calculation unavailable.', error);
        }
    }

    updateSkyLocationStatus() {
        const element = document.getElementById('sky-location-status');
        if (!element || typeof state === 'undefined') return;
        const key = this.skyFailed ? 'ui.skyUnavailable' : this.observer?.approximate ? 'ui.skyReference' : 'ui.skyLocal';
        element.textContent = t(key, state.displayLanguage);
    }

    resize() {
        if (!this.canvas || !this.ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const sizeKey = `${window.innerWidth}:${window.innerHeight}:${dpr}`;
        if (this.sizeKey === sizeKey) return;
        this.sizeKey = sizeKey;
        this.canvas.width = Math.round(window.innerWidth * dpr);
        this.canvas.height = Math.round(window.innerHeight * dpr);
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!this.skySnapshot) this.refreshCelestialBodies();
        this.sky.resize(window.innerWidth, window.innerHeight, dpr, this.skySnapshot?.stars || [], this.skySnapshot?.sunAltitude ?? -18);
        this.particles = this.sky.stars;
        this.draw(performance.now(), false);
    }

    handleMotionChange() {
        clearTimeout(this.renderTimer);
        this.renderTimer = null;
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.meteors = [];
        this.nextMeteorAt = 0;
        this.lastFrameAt = 0;
        if (!document.hidden) {
            if (this.motionPreference.matches || document.body.classList.contains('static-decorations')) this.draw(performance.now(), false);
            else this.frame = requestAnimationFrame(this.render);
        }
    }

    handleVisibility() {
        if (document.hidden) {
            cancelAnimationFrame(this.layoutFrame);
            this.layoutFrame = 0;
            clearTimeout(this.renderTimer);
            this.renderTimer = null;
            cancelAnimationFrame(this.frame);
            this.frame = 0;
            this.meteors = [];
            this.nextMeteorAt = 0;
        } else if (document.body.classList.contains('static-decorations')) {
            this.draw(performance.now(), false);
        } else if (!this.motionPreference.matches && !this.frame && !this.renderTimer) {
            this.lastFrameAt = 0;
            this.frame = requestAnimationFrame(this.render);
        } else if (this.motionPreference.matches) {
            this.refreshCelestialBodies();
            this.draw(performance.now(), false);
        }
    }

    render(timestamp) {
        this.frame = 0;
        if (document.hidden || this.motionPreference.matches || document.body.classList.contains('static-decorations')) { this.frame = 0; return; }
        if (!this.lastFrameAt || timestamp - this.lastFrameAt >= 33) {
            this.draw(timestamp, true);
            this.lastFrameAt = timestamp;
        }
        // Sleep between draws instead of waking on every 60/120 Hz refresh.
        this.renderTimer = setTimeout(() => {
            this.renderTimer = null;
            if (!document.hidden && !this.motionPreference.matches) {
                this.frame = requestAnimationFrame(this.render);
            }
        }, 33);
    }

    draw(timestamp, animate) {
        if (!this.ctx) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (this.observer && !document.body.classList.contains('static-decorations') && timestamp - this.lastCelestialRefresh >= 10000) {
            this.refreshCelestialBodies();
            this.lastCelestialRefresh = timestamp;
        }
        this.ctx.clearRect(0, 0, width, height);
        const time = timestamp * 0.001;
        this.sky.draw(this.ctx, timestamp, animate);
        if (animate) this.drawMeteors(time, width, height);
        this.drawCachedCelestialBodies(width, height);
        this.ctx.shadowBlur = 0;
    }

    drawCachedCelestialBodies(width, height) {
        // Positions refresh at most once per ten seconds while animating.
        // Static journey screens have no timer. Reuse expensive gradients,
        // text measurement and blurred backings between those updates.
        const key = `${this.canvas.width}:${this.canvas.height}:${state.displayLanguage}:${this.deepSkyBlackHoleEnabled}:${document.body.classList.contains('static-decorations')}:${document.fonts?.status}`;
        if (this.celestialLayerKey !== key || this.cachedBodies !== this.celestialBodies) {
            const layer = this.celestialLayer;
            layer.width = this.canvas.width;
            layer.height = this.canvas.height;
            const target = this.ctx;
            const cached = layer.getContext('2d');
            if (!cached) { this.drawCelestialBodies(width, height); return; }
            cached.setTransform(layer.width / width, 0, 0, layer.height / height, 0, 0);
            try {
                this.ctx = cached;
                this.drawCelestialBodies(width, height);
            } finally { this.ctx = target; }
            this.celestialLayerKey = key;
            this.cachedBodies = this.celestialBodies;
        }
        this.ctx.drawImage(this.celestialLayer, 0, 0, width, height);
    }

    drawCelestialBodies(width, height) {
        if (this.celestialDaylight) {
            // Cached once per celestial refresh: a transparent indigo wash
            // keeps the application’s space identity while softening the
            // procedural field beneath the calculated daytime Sun.
            const wash = this.ctx.createLinearGradient(0, 0, 0, height);
            wash.addColorStop(0, 'rgba(35, 48, 124, 0.34)');
            wash.addColorStop(0.5, 'rgba(50, 66, 148, 0.18)');
            wash.addColorStop(1, 'rgba(5, 8, 28, 0.08)');
            this.ctx.fillStyle = wash;
            this.ctx.fillRect(0, 0, width, height);
        }
        this.drawCelestialHorizon(width, height);
        this.drawEarthIllustration(width, height);
        if (this.deepSkyBlackHoleEnabled && !document.body.classList.contains('static-decorations')) {
            this.drawDeepSkyBlackHole(width, height);
        }
        const labelBounds = [];
        this.celestialBodies.forEach((body) => {
            if (body.altitude < 0) return;
            const { x, y } = SkyAstronomy.project(body.azimuth, body.altitude, width, height);
            const moonPixelDiameter = Math.max(8, (height * 0.88 - 20) * (body.angularDiameter || 0.52) / 90);
            const size = body.kind === 'sun'
                ? moonPixelDiameter / 2
                : body.kind === 'moon'
                ? moonPixelDiameter / 2
                : body.kind === 'planet'
                    ? Math.min(1.65, Math.max(0.8, moonPixelDiameter * (body.angularDiameter / 0.52) * 0.4))
                    : Math.max(0.75, 1.65 - body.magnitude * 0.22);
            const [red, green, blue] = body.color;
            this.ctx.save();
            if (body.kind === 'star') this.ctx.globalAlpha = Math.max(0.10, Math.min(1, (2 - this.skySnapshot.sunAltitude) / 20));
            if (body.kind === 'moon') this.drawEarthMoonGuide(x, y, width, height);
            const illumination = body.kind === 'moon' ? body.illumination : 1;
            const haloRadius = body.kind === 'sun' ? size * 6 : body.kind === 'moon' ? size * 3.5 : size * 4;
            const halo = this.ctx.createRadialGradient(x, y, Math.max(0.4, size * 0.35), x, y, haloRadius);
            halo.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${body.kind === 'sun' ? 0.27 : body.kind === 'moon' ? illumination * 0.1 : 0.12})`);
            halo.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
            this.ctx.fillStyle = halo;
            this.ctx.beginPath();
            this.ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = body.kind === 'moon' ? 0 : 3;
            this.ctx.shadowColor = `rgba(${red}, ${green}, ${blue}, ${body.kind === 'moon' ? 0.52 : 0.72})`;
            if (body.kind === 'moon') {
                this.drawMoonWithBooleanMask(x, y, size, body.phase ?? 0.5, body.lightAngle, body.illumination);
            } else if (body.kind === 'sun') {
                this.drawSolarProtectionLayer(x, y, size);
                const sunGradient = this.ctx.createRadialGradient(x - size * 0.28, y - size * 0.28, Math.max(0.5, size * 0.08), x, y, size);
                // A soft, balanced daylight palette: warm enough to feel
                // alive, not white-hot or orange-heavy.
                sunGradient.addColorStop(0, 'rgba(255, 250, 230, 1)');
                sunGradient.addColorStop(0.42, 'rgba(255, 235, 184, 0.96)');
                sunGradient.addColorStop(1, 'rgba(255, 196, 118, 0.82)');
                this.ctx.fillStyle = sunGradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                const planetGradient = this.ctx.createRadialGradient(x - size * 0.35, y - size * 0.35, Math.max(0.25, size * 0.12), x, y, Math.max(0.6, size));
                planetGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
                planetGradient.addColorStop(0.24, `rgba(${red}, ${green}, ${blue}, 0.96)`);
                planetGradient.addColorStop(1, `rgba(${Math.round(red * 0.52)}, ${Math.round(green * 0.52)}, ${Math.round(blue * 0.52)}, 0.82)`);
                this.ctx.fillStyle = planetGradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            const labelKey = CELESTIAL_LABEL_KEYS[body.name];
            const translatedLabel = labelKey ? t(labelKey, state.displayLanguage) : body.name;
            // Never expose an untranslated implementation key such as
            // "ui.celestialEarth" while locale files are loading.
            const label = !translatedLabel || translatedLabel === labelKey || translatedLabel.startsWith('ui.') ? body.name : translatedLabel;
            const shouldShowLabel = body.kind === 'sun' || body.kind === 'planet' || (body.kind === 'star' && body.magnitude < 1);
            if (label && shouldShowLabel) {
                this.ctx.textAlign = 'left';
                // Labels remain compact and deliberately translucent. The
                // light backing only lifts them from busy star fields instead
                // of reading as an interface layer over the night sky.
                this.ctx.font = '500 11px Inter, Manjari, sans-serif';
                const metrics = this.ctx.measureText(label);
                const paddingX = 4;
                const labelWidth = metrics.width + paddingX * 2;
                const placement = this.placeCelestialLabel(x, y, size, labelWidth, width, height, labelBounds);
                const labelLeft = placement.left, labelX = labelLeft + paddingX, labelY = placement.top + 12;
                if (Math.abs(labelY - y - 4) > 8) {
                    // Only labels move. A fine leader retains the exact body
                    // position when several objects are close on mobile.
                    this.ctx.save();
                    this.ctx.shadowBlur = 0;
                    this.ctx.strokeStyle = 'rgba(200, 219, 243, 0.18)';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath(); this.ctx.moveTo(x, y);
                    this.ctx.lineTo(Math.max(labelLeft, Math.min(labelLeft + labelWidth, x)), labelY - 4);
                    this.ctx.stroke(); this.ctx.restore();
                }
                // Soften only the backing; restore before drawing crisp text.
                this.ctx.save();
                this.ctx.shadowBlur = 0;
                this.ctx.filter = 'blur(3px)';
                this.ctx.fillStyle = 'rgba(2, 4, 9, 0.20)';
                this.ctx.fillRect(labelLeft, labelY - 12, labelWidth, 16);
                this.ctx.restore();
                this.ctx.lineWidth = 1.4;
                this.ctx.strokeStyle = 'rgba(2, 4, 9, 0.20)';
                this.ctx.strokeText(label, labelX, labelY);
                this.ctx.fillStyle = `rgba(${Math.max(red, 220)}, ${Math.max(green, 220)}, ${Math.max(blue, 220)}, 0.40)`;
                this.ctx.fillText(label, labelX, labelY);
            }
            this.ctx.restore();
        });
    }

    placeCelestialLabel(x, y, size, labelWidth, width, height, occupied) {
        const right = x + size + 4, left = x - size - labelWidth - 4;
        const sides = x > width * 0.82 ? [left, right] : [right, left];
        let fallback;
        for (const offset of [0, -18, 18, -36, 36, -54, 54, -72, 72, -90, 90]) {
            for (const side of sides) {
                const box = {left: Math.max(4, Math.min(width - labelWidth - 4, side)),
                    top: Math.max(4, Math.min(height * 0.88 - 20, y - 8 + offset)), width: labelWidth, height: 16};
                fallback ||= box;
                if (occupied.some(b => box.left < b.left + b.width + 2 && box.left + box.width + 2 > b.left &&
                    box.top < b.top + b.height + 2 && box.top + box.height + 2 > b.top)) continue;
                occupied.push(box);
                return box;
            }
        }
        occupied.push(fallback);
        return fallback;
    }

    drawEarthIllustration(width, height) {
        // Below the observed horizon: artwork, never a fabricated sky position.
        const key = CELESTIAL_LABEL_KEYS.Earth, name = t(key, state.displayLanguage);
        const label = name && name !== key ? name : 'Earth';
        this.ctx.save();
        this.ctx.font = '500 11px Inter, Manjari, sans-serif';
        const placement = this.earthReferenceLayout(width, height, [], this.ctx.measureText(label).width);
        this.earthReferencePlacement = placement;
        const { x, y, size } = placement;
        this.drawEarthAtmosphericLayers(x, y, size);
        const surface = this.ctx.createRadialGradient(x - size * 0.3, y - size * 0.4, 0, x, y, size);
        surface.addColorStop(0, 'rgba(183, 231, 247, 1)');
        surface.addColorStop(0.5, 'rgba(44, 138, 194, 1)');
        surface.addColorStop(0.85, 'rgba(17, 67, 114, 1)');
        surface.addColorStop(1, 'rgba(6, 23, 49, 0.98)');
        this.ctx.fillStyle = surface;
        this.ctx.beginPath(); this.ctx.arc(x, y, size, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.fillStyle = 'rgba(99, 172, 128, 0.72)';
        this.ctx.beginPath();
        this.ctx.ellipse(x - size * 0.25, y - size * 0.2, size * 0.38, size * 0.22, -0.6, 0, Math.PI * 2);
        this.ctx.ellipse(x + size * 0.26, y + size * 0.2, size * 0.19, size * 0.38, -0.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.filter = 'blur(0.7px)';
        this.ctx.fillStyle = 'rgba(237, 251, 255, 0.32)';
        this.ctx.beginPath();
        this.ctx.ellipse(x - size * 0.13, y - size * 0.39, size * 0.63, size * 0.12, -0.3, 0, Math.PI * 2);
        this.ctx.ellipse(x + size * 0.08, y + size * 0.37, size * 0.60, size * 0.09, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.filter = 'none';
        this.ctx.textAlign = 'left'; this.ctx.fillStyle = 'rgba(225, 242, 255, 0.7)';
        this.ctx.fillText(label, x + size * 1.5, y + 4);
        this.ctx.restore();
    }

    earthReferenceLayout(width, height, obstacles = [], labelWidth = 40) {
        const x = width / 2, top = height * 0.88 + 22, bottom = height - 8;
        const widthKey = Math.round(width);
        if (this.earthReferenceSizeWidth !== widthKey) {
            // Choose one size for this viewport width and retain it while the
            // page scrolls. Mobile browser chrome can also change innerHeight
            // during a scroll, so cap the sizing height by the stable width.
            // Foreground content may move the Earth or hide it, but must not
            // make the globe pulse between fallback sizes.
            const sizingHeight = Math.min(height, width * 2);
            const sizingTop = sizingHeight * 0.88 + 22;
            const sizingBottom = sizingHeight - 8;
            this.earthReferenceSize = [Math.min(14, sizingHeight * 0.016), 10, 8, 6, 4, 3]
                .find(size => sizingTop + size * 2.8 <= sizingBottom - size * 2.8) || 3;
            this.earthReferenceSizeWidth = widthKey;
        }
        const size = this.earthReferenceSize;
        const radius = size * 2.8;
        const minimumY = top + radius;
        const maximumY = Math.max(minimumY, bottom - radius);
        const y = Math.max(minimumY, Math.min(maximumY, height * 0.943));
        const bounds = { left: x - radius, right: x + Math.max(radius, size * 1.5 + labelWidth),
            top: y - radius, bottom: y + radius };
        return { x, y, size, bounds };
    }

    drawEarthMoonGuide(moonX, moonY, width, height) {
        const earth = this.earthReferencePlacement;
        const horizonY = height * 0.88;
        if (!earth || moonY > horizonY) return;
        const startX = earth.x;
        const startY = earth.y - earth.size * 1.05;
        const controlX = startX + (moonX - startX) * 0.52;
        const controlY = Math.min(horizonY - 8, moonY + (horizonY - moonY) * 0.42);
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.strokeStyle = 'rgba(190, 214, 245, 0.14)';
        this.ctx.lineWidth = 0.65;
        this.ctx.setLineDash([2, 6]);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(controlX, controlY, moonX, moonY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.restore();
        this.moonObserverPlacement = { earthX: startX, earthY: startY, moonX, moonY };
    }

    drawEarthAtmosphericLayers(x, y, size) {
        // Owner-retained design: five merged protective atmosphere volumes.
        // The nearest layer uses a cool aqua 26°C comfort palette: artwork,
        // not a measured/simulated temperature or radiation-shielding claim.
        // Keep the visible band outside the opaque disc, even on tiny markers.
        // Preserve this and the Sun shield unless the owner requests removal.
        const layers = [
            [1.50, '112, 232, 244', 0.90], // Troposphere: cool aqua comfort.
            [1.82, '96, 190, 255', 0.58],  // Stratosphere.
            [2.13, '126, 160, 246', 0.38], // Mesosphere.
            [2.47, '102, 212, 235', 0.24], // Thermosphere.
            [2.80, '166, 202, 255', 0.16]  // Exosphere: soft outer dissolve.
        ];
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        layers.forEach(([scale, rgb, alpha]) => {
            const radius = size * scale;
            const gradient = this.ctx.createRadialGradient(x, y, size * 0.98, x, y, radius);
            gradient.addColorStop(0, `rgba(${rgb}, ${alpha})`);
            gradient.addColorStop(0.18, `rgba(${rgb}, ${alpha * 0.92})`);
            gradient.addColorStop(0.60, `rgba(${rgb}, ${alpha * 0.40})`);
            gradient.addColorStop(1, `rgba(${rgb}, 0)`);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - radius * 1.1, y - radius * 1.1, radius * 2.2, radius * 2.2);
        });
        this.ctx.restore();
    }

    drawSolarProtectionLayer(x, y, size) {
        // Owner-retained feature; see AGENTS.md and docs/SKY-ACCURACY.md.
        // Visual-only shield: a soft circular rim inside the diffuse glow.
        // It is not a claim about filtering real radiation or energy transfer.
        const radius = size * 4.2;
        const gradient = this.ctx.createRadialGradient(x, y, size * 0.72, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 248, 214, 0.16)');
        gradient.addColorStop(0.34, 'rgba(255, 224, 149, 0.13)');
        gradient.addColorStop(0.66, 'rgba(255, 190, 112, 0.075)');
        gradient.addColorStop(1, 'rgba(255, 184, 104, 0)');
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        const shield = this.ctx.createRadialGradient(x, y, size * 1.15, x, y, size * 2.8);
        shield.addColorStop(0, 'rgba(255, 241, 190, 0)');
        shield.addColorStop(0.38, 'rgba(255, 236, 177, 0.025)');
        shield.addColorStop(0.56, 'rgba(255, 245, 207, 0.24)');
        shield.addColorStop(0.72, 'rgba(255, 231, 170, 0.04)');
        shield.addColorStop(1, 'rgba(255, 231, 170, 0)');
        this.ctx.fillStyle = shield;
        this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        this.ctx.restore();
    }

    setDeepSkyBlackHoleEnabled(enabled) {
        this.deepSkyBlackHoleEnabled = Boolean(enabled);
        this.celestialLayerKey = null;
        if (!document.hidden) this.draw(performance.now(), false);
    }

    drawDeepSkyBlackHole(width, height) {
        // A deliberately illustrative deep-sky object: fixed, subtle and
        // cached with the celestial layer rather than animated or positioned
        // as an observed astronomical body.
        const x = width * 0.76;
        const y = height * 0.27;
        const radius = Math.max(7, Math.min(14, Math.min(width, height) * 0.014));
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(-0.34);
        const outer = this.ctx.createRadialGradient(0, 0, radius * 0.35, 0, 0, radius * 3.4);
        outer.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
        outer.addColorStop(0.24, 'rgba(8, 8, 18, 0.88)');
        outer.addColorStop(0.35, 'rgba(182, 128, 222, 0.18)');
        outer.addColorStop(0.56, 'rgba(118, 184, 255, 0.11)');
        outer.addColorStop(1, 'rgba(16, 10, 38, 0)');
        this.ctx.fillStyle = outer;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 3.1, radius * 0.82, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(214, 180, 255, 0.34)';
        this.ctx.lineWidth = Math.max(0.55, radius * 0.08);
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 1.75, radius * 0.38, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(0, 0, 4, 0.96)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCelestialHorizon(width, height) {
        // This is the same 0° baseline used by the altitude projection below.
        // Keep it deliberately quiet: it is a spatial reference, not a new
        // landscape layer over the night-sky experience. It is drawn into the
        // cached celestial canvas, so it creates no repeating frame work.
        const horizonY = height * 0.88;
        const glow = this.ctx.createLinearGradient(0, horizonY, width, horizonY);
        glow.addColorStop(0, 'rgba(154, 181, 234, 0)');
        glow.addColorStop(0.2, 'rgba(154, 181, 234, 0.08)');
        glow.addColorStop(0.5, 'rgba(214, 224, 255, 0.18)');
        glow.addColorStop(0.8, 'rgba(154, 181, 234, 0.08)');
        glow.addColorStop(1, 'rgba(154, 181, 234, 0)');
        this.ctx.save();
        this.ctx.strokeStyle = glow;
        this.ctx.lineWidth = 1;
        this.ctx.shadowColor = 'rgba(173, 196, 255, 0.18)';
        this.ctx.shadowBlur = 7;
        this.ctx.beginPath();
        this.ctx.moveTo(0, horizonY);
        this.ctx.lineTo(width, horizonY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.font = '500 10px Inter, Manjari, sans-serif';
        this.ctx.fillStyle = 'rgba(209, 224, 247, 0.48)';
        for (const [az, key] of [[0, 'skyNorth'], [90, 'skyEast'], [180, 'skySouth'], [270, 'skyWest']]) {
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t(`ui.${key}`, state.displayLanguage), SkyAstronomy.project(az, 0, width, height).x, horizonY + 15);
        }
        this.ctx.restore();
    }

    drawMoonWithBooleanMask(x, y, size, phase, lightAngle, fraction = (1 - Math.cos(phase * Math.PI * 2)) / 2) {
        const buffer = this.moonBuffer;
        const bufferContext = this.moonBufferContext;
        if (!bufferContext) return;
        // Cache a lit sphere, including the curved terminator. Pixel alpha is
        // the illumination mask, so the unlit side never paints a dark disc.
        // Surface features are procedural texture, not a surveyed lunar map.
        const phaseKey = `${Math.round(fraction * 10000)}:${phase < 0.5}`;
        if (phaseKey !== this.cachedMoonPhase) {
            const pixels = bufferContext.createImageData(128, 128);
            const lightZ = 2 * fraction - 1;
            const lightX = Math.sqrt(Math.max(0, 1 - lightZ * lightZ)) * (phase < 0.5 ? 1 : -1);
            const maria = [[-0.26,-0.24,0.27,0.32],[0.18,-0.38,0.29,0.18],
                [0.38,-0.02,0.23,0.29],[-0.47,0.08,0.15,0.3],[0.01,0.16,0.2,0.16]];
            const random = this.sky.random(93827);
            const craters = Array.from({length:48}, () => ({x:random()*1.7-0.85,y:random()*1.7-0.85,r:0.016+random()*0.062}));
            for (let py=0;py<128;py++) {
                for (let px=0;px<128;px++) {
                    const nx=(px-63.5)/61, ny=(py-63.5)/61;
                    const squared=nx*nx+ny*ny;
                    if (squared>=1) continue;
                    const nz=Math.sqrt(1-squared);
                    const incidence=nx*lightX+nz*lightZ;
                    if (incidence<=0) continue;
                    let surface=0.84+this.sky.noise(nx*32+8,ny*32+8)*0.14;
                    for (const [mx,my,rx,ry] of maria) {
                        surface-=Math.exp(-((nx-mx)**2/rx**2+(ny-my)**2/ry**2)*1.5)*0.22;
                    }
                    for (const crater of craters) {
                        const distance=Math.hypot(nx-crater.x,ny-crater.y)/crater.r;
                        if (distance<1.3) surface+=distance<0.75?-0.065:0.07;
                    }
                    const lighting=0.24+0.76*Math.pow(incidence,0.42);
                    const value=Math.min(255,Math.max(0,255*surface*lighting));
                    const i=(py*128+px)*4;
                    pixels.data[i]=value;
                    pixels.data[i+1]=value*0.985;
                    pixels.data[i+2]=value*0.95;
                    pixels.data[i+3]=255*Math.min(1,incidence*28)*Math.min(1,(1-squared)*65);
                }
            }
            bufferContext.putImageData(pixels,0,0);
            this.cachedMoonPhase=phaseKey;
        }
        this.ctx.save();
        this.ctx.shadowBlur = 0;
        this.ctx.globalCompositeOperation = 'source-over';
        if (Number.isFinite(lightAngle)) {
            this.ctx.translate(x, y);
            this.ctx.rotate(lightAngle - (phase < 0.5 ? 0 : Math.PI));
            x = 0; y = 0;
        }
        this.ctx.drawImage(buffer, x - size, y - size, size * 2, size * 2);
        this.ctx.restore();
    }

    drawMeteors(time, width, height) {
        if (!this.nextMeteorAt) this.nextMeteorAt = time + 5 + Math.random() * 4;
        if (time >= this.nextMeteorAt && this.meteors.length < 1) {
            // On wide screens use exposed sky beside the central controls.
            const leftSide = Math.random() < 0.5;
            const startX = width > 900
                ? width * (leftSide ? 0.12 : 0.86)
                : width * (0.55 + Math.random() * 0.3);
            const startY = height * (0.05 + Math.random() * 0.12);
            this.meteors.push({
                startX,
                startY,
                angle: Math.PI * (width > 900 && leftSide ? 0.28 + Math.random() * 0.1 : 0.62 + Math.random() * 0.1),
                length: Math.min(width * 0.24, 65 + Math.random() * 65),
                speed: Math.min(width * 0.75, 360 + Math.random() * 160),
                bornAt: time,
                lifetime: 0.75 + Math.random() * 0.3,
                brightness: 0.55 + Math.random() * 0.2
            });
            this.nextMeteorAt = time + 25 + Math.random() * 45;
        }
        // No allocation or drawing at all between these occasional events.
        const meteor = this.meteors[0];
        if (!meteor) return;
        if (!this.meteorSprite) {
            this.meteorSprite = document.createElement('canvas');
            this.meteorSprite.width = 256;
            this.meteorSprite.height = 12;
            const ctx = this.meteorSprite.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 256, 0);
            gradient.addColorStop(0, 'rgba(205,225,255,0)');
            gradient.addColorStop(0.65, 'rgba(220,234,255,0.3)');
            gradient.addColorStop(1, 'rgba(255,255,255,1)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.8;
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(205,225,255,0.5)';
            ctx.beginPath(); ctx.moveTo(0,6); ctx.lineTo(256,6); ctx.stroke();
        }
            const age = time - meteor.bornAt;
            if (age >= meteor.lifetime + 0.18) { this.meteors.length = 0; return; }
            const progress = age / meteor.lifetime;
            const distance = Math.min(age, meteor.lifetime) * meteor.speed;
            const headX = meteor.startX + Math.cos(meteor.angle) * distance;
            const headY = meteor.startY + Math.sin(meteor.angle) * distance;
            const tailLength = Math.min(meteor.length, distance);
            // Quick emergence, restrained peak, then a faint 180 ms residual trail.
            const alpha = Math.min(1, progress / 0.12) * Math.pow(Math.max(0, 1 - age / (meteor.lifetime + 0.18)), 0.65) * meteor.brightness;
            this.ctx.save();
            this.ctx.translate(headX, headY);
            this.ctx.rotate(meteor.angle);
            this.ctx.globalAlpha = alpha;
            this.ctx.drawImage(this.meteorSprite, -tailLength, -6, tailLength, 12);
            this.ctx.restore();
    }
}

// Visual Engine
class VisualEngine {
    constructor(audioEngine) {
        this.container = document.getElementById('chakra-container');
        this.symbolImg = document.getElementById('chakra-symbol');
        this.glow = document.getElementById('glow-effect');
        this.presence = this.container && this.symbolImg && window.CelestialPresence
            ? new window.CelestialPresence(this.container, this.symbolImg) : null;
        this.presence?.setAudio(audioEngine);
    }
    applyImageEffect(color = null) {
        if (!this.container) return;
        const effect = normalizeMeditationVisualEffect(state.visualEffect);
        const active = effect !== 'natural' && !state.eyesCloseMode;
        this.container.classList.remove(
            'visual-effect-natural',
            'visual-effect-aura',
            'visual-effect-holographic',
            'visual-effect-depth',
            'visual-effect-active'
        );
        this.container.classList.add(`visual-effect-${effect}`);
        const breatheActive = !state.eyesCloseMode;
        this.container.classList.toggle('visual-effect-active', active);
        this.container.classList.toggle('image-breathe-active', breatheActive);
        if (breatheActive) {
            const cycleSeconds = 8 + Math.random() * 8;
            this.container.style.setProperty('--image-breathe-duration', `${cycleSeconds.toFixed(2)}s`);
            this.container.style.setProperty('--image-breathe-delay', `${(-Math.random() * cycleSeconds).toFixed(2)}s`);
        }
        if (color) this.container.style.setProperty('--chakra-visual-color', color);
        this.presence?.setActive(effect === 'depth' && active, color);
    }
    startPulsing(color) {
        this.applyImageEffect(color);
        if (state.eyesCloseMode) return; // Absolute Blackout
        this.glow.style.background = `radial-gradient(circle, ${color}66 0%, transparent 70%)`;
    }
    stop() {
        this.presence?.setActive(false);
        if (this.container) this.container.classList.remove('visual-effect-active', 'image-breathe-active');
        if (this.glow) this.glow.style.background = 'transparent';
    }
}

class JourneyVideoPrelude {
    constructor(audioEngine) {
        this.audio = audioEngine;
        this.overlay = document.getElementById('journey-video-prelude');
        this.media = document.getElementById('journey-video-prelude-media');
        this.meditatorImage = this.overlay?.querySelector('.journey-video-prelude-meditator');
        this.playButton = document.getElementById('play-journey-video-prelude');
        this.loadingStatus = document.getElementById('journey-video-prelude-loading');
        this.bufferCountdown = document.getElementById('journey-video-prelude-buffer-countdown');
        this.fullscreenTarget = document.getElementById('app');
        this.controls = document.getElementById('controls');
        this.revealZone = document.getElementById('fullscreen-controls-reveal-zone');
        this.fullscreenChromeHideTimer = null;
        this.cursorHideTimer = null;
        this.journeyChromeActive = false;
        this.mixer = document.getElementById('volume-mixer');
        this.previewTimer = null;
        this.activePlayback = null;
        try { this.media?.load(); } catch (error) {}
        this.syncFullscreenJourneyChrome = this.syncFullscreenJourneyChrome.bind(this);
        document.addEventListener('fullscreenchange', this.syncFullscreenJourneyChrome);
        this.chromeObserver = new MutationObserver(this.syncFullscreenJourneyChrome);
        if (this.controls) this.chromeObserver.observe(this.controls, { attributes: true, attributeFilter: ['class'] });
        if (this.mixer) this.chromeObserver.observe(this.mixer, { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('pointermove', event => {
            if (event.pointerType !== 'touch') this.wakeJourneyCursor();
        }, { passive: true });
        document.addEventListener('keydown', () => {
            clearTimeout(this.cursorHideTimer);
            document.body.classList.remove('journey-cursor-hidden');
        });
        document.addEventListener('visibilitychange', () => this.syncFullscreenJourneyChrome());
        this.revealZone?.addEventListener('pointerdown', event => {
            if (event.pointerType === 'touch' || event.pointerType === 'pen') {
                event.preventDefault();
                this.setFullscreenChromeVisible(true);
                this.scheduleFullscreenChromeHide(3000);
            }
        });
        this.revealZone?.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') this.setFullscreenChromeVisible(true); });
        this.revealZone?.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') this.scheduleFullscreenChromeHide(); });
        this.controls?.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') this.setFullscreenChromeVisible(true); });
        this.controls?.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') this.scheduleFullscreenChromeHide(); });
        this.controls?.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') this.scheduleFullscreenChromeHide(3000); });
        this.controls?.addEventListener('focusin', () => {
            if (this.controls.querySelector(':focus-visible')) this.setFullscreenChromeVisible(true);
        });
        this.controls?.addEventListener('focusout', () => this.scheduleFullscreenChromeHide());
    }

    syncFullscreenJourneyChrome() {
        const isJourneyFullscreen = document.fullscreenElement === this.fullscreenTarget;
        document.body.classList.toggle('journey-fullscreen-active', isJourneyFullscreen);
        const active = Boolean(this.controls && !this.controls.classList.contains('hidden'));
        const changed = active !== this.journeyChromeActive;
        this.journeyChromeActive = active;
        document.body.classList.toggle('journey-controls-active', active);
        if (!active || document.hidden) {
            clearTimeout(this.cursorHideTimer);
            clearTimeout(this.fullscreenChromeHideTimer);
            document.body.classList.remove('journey-cursor-hidden', 'fullscreen-controls-visible');
            return;
        }
        if (changed) this.setFullscreenChromeVisible(false);
        if (this.mixer && !this.mixer.classList.contains('hidden')) this.setFullscreenChromeVisible(true);
        else this.scheduleFullscreenChromeHide();
        this.wakeJourneyCursor();
    }

    wakeJourneyCursor() {
        if (!this.journeyChromeActive || document.hidden) return;
        document.body.classList.remove('journey-cursor-hidden');
        clearTimeout(this.cursorHideTimer);
        this.cursorHideTimer = setTimeout(() => {
            if (this.journeyChromeActive && !document.hidden &&
                (!this.mixer || this.mixer.classList.contains('hidden')) &&
                !this.controls?.querySelector(':focus-visible')) {
                document.body.classList.add('journey-cursor-hidden');
            }
        }, 3000);
    }

    setFullscreenChromeVisible(isVisible) {
        if (this.fullscreenChromeHideTimer) {
            clearTimeout(this.fullscreenChromeHideTimer);
            this.fullscreenChromeHideTimer = null;
        }
        document.body.classList.toggle('fullscreen-controls-visible', Boolean(isVisible) && this.journeyChromeActive);
    }

    scheduleFullscreenChromeHide(delay = 180) {
        if (this.fullscreenChromeHideTimer) clearTimeout(this.fullscreenChromeHideTimer);
        this.fullscreenChromeHideTimer = setTimeout(() => {
            const controlsHovered = delay < 3000 && this.controls?.matches(':hover');
            const controlsFocused = this.controls?.querySelector(':focus-visible');
            const mixerOpen = this.mixer && !this.mixer.classList.contains('hidden');
            const revealHovered = delay < 3000 && this.revealZone?.matches(':hover');
            if (!controlsHovered && !controlsFocused && !mixerOpen && !revealHovered) this.setFullscreenChromeVisible(false);
        }, delay);
    }

    getVideoBufferTargetSeconds() {
        const connection = typeof navigator !== 'undefined' ? navigator.connection : null;
        if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)) {
            return JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS;
        }
        if (Number.isFinite(connection?.downlink)) {
            if (connection.downlink < 3) return 8;
            if (connection.downlink < 8) return 6;
        }
        return JOURNEY_VIDEO_PRELUDE_BUFFER_MIN_SECONDS;
    }

    getBufferedAheadSeconds() {
        if (!this.media) return 0;
        for (let index = 0; index < this.media.buffered.length; index += 1) {
            const start = this.media.buffered.start(index);
            const end = this.media.buffered.end(index);
            if (this.media.currentTime >= start && this.media.currentTime <= end) {
                return Math.max(0, end - this.media.currentTime);
            }
        }
        return 0;
    }

    async bufferVideoToSafePoint() {
        if (!this.media) return false;
        const requiredSeconds = Math.min(
            this.getVideoBufferTargetSeconds(),
            Number.isFinite(this.media.duration) ? Math.max(2, this.media.duration) : JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS
        );
        const hasSafeBuffer = () => {
            if (this.media.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return false;
            return this.getBufferedAheadSeconds() >= requiredSeconds;
        };
        if (hasSafeBuffer()) return true;
        return new Promise(resolve => {
            let settled = false;
            let timeout = null;
            let stableSince = 0;
            const check = () => {
                if (!hasSafeBuffer()) {
                    stableSince = 0;
                    return;
                }
                if (!stableSince) stableSince = performance.now();
                if (performance.now() - stableSince >= JOURNEY_VIDEO_PRELUDE_BUFFER_STABILITY_MS) finish(true);
            };
            const finish = (result) => {
                if (settled) return;
                settled = true;
                if (timeout) clearTimeout(timeout);
                if (interval) clearInterval(interval);
                ['progress', 'canplay', 'canplaythrough', 'loadeddata', 'durationchange'].forEach(event => {
                    this.media.removeEventListener(event, check);
                });
                resolve(result);
            };
            const interval = setInterval(check, 250);
            // Slow first-use delivery is not a media failure. Let the guide
            // continue after the bounded wait; a real media error still uses
            // the dedicated `error` event and safe fallback path.
            timeout = setTimeout(() => finish(true), 90000);
            ['progress', 'canplay', 'canplaythrough', 'loadeddata', 'durationchange'].forEach(event => {
                this.media.addEventListener(event, check);
            });
            try { this.media.load(); } catch (error) { finish(false); }
            check();
        });
    }

    async previewAudio() {
        if (!this.media) return;
        if (!this.audio.isInitialized) await this.audio.init();
        if (!this.audio.prepareJourneyVideoPrelude(this.media)) return;
        if (this.previewTimer) clearTimeout(this.previewTimer);
        this.media.pause();
        try { this.media.currentTime = 0; } catch (error) {}
        this.media.muted = false;
        this.media.volume = 1;
        this.audio.fadeJourneyVideoPrelude(0, 0);
        try {
            await this.media.play();
            this.audio.fadeJourneyVideoPrelude(state.volVideo, 0.25);
            this.previewTimer = setTimeout(() => {
                this.audio.fadeJourneyVideoPrelude(0, 0.8);
                setTimeout(() => { this.media.pause(); try { this.media.currentTime = 0; } catch (error) {} }, 850);
            }, 8000);
        } catch (error) { console.warn('Video audio preview unavailable:', error); }
    }

    async play() {
        if (this.activePlayback) return this.activePlayback;
        if (!this.overlay || !this.media) return 'unavailable';

        // Restart happens from an active journey, so the context is normally
        // ready within the click gesture. Keep the fallback for recovery.
        if (!this.audio.isInitialized) await this.audio.init();
        if (!this.audio.prepareJourneyVideoPrelude(this.media)) return 'unavailable';

        this.activePlayback = new Promise((resolve) => {
            let settled = false;
            let exitPromise = null;
            let hasStarted = false;
            let playDelayTimer = null;
            let isWaitingForBuffer = false;
            let bufferCountdownTimer = null;
            const cleanup = () => {
                this.media.removeEventListener('timeupdate', onTimeUpdate);
                this.media.removeEventListener('progress', onProgress);
                this.media.removeEventListener('canplay', onProgress);
                this.media.removeEventListener('waiting', onWaiting);
                this.media.removeEventListener('stalled', onWaiting);
                this.media.removeEventListener('ended', onEnded);
                this.media.removeEventListener('error', onError);
                this.playButton?.removeEventListener('click', onPlay);
                if (playDelayTimer) clearTimeout(playDelayTimer);
                if (bufferCountdownTimer) clearInterval(bufferCountdownTimer);
            };
            const beginExit = (duration) => {
                if (exitPromise) return exitPromise;
                this.overlay.classList.add('is-leaving');
                this.audio.fadeJourneyVideoPrelude(0, duration);
                exitPromise = new Promise(done => setTimeout(done, Math.max(0, duration) * 1000));
                return exitPromise;
            };
            const complete = async (reason, duration) => {
                if (settled) return;
                settled = true;
                cleanup();
                await beginExit(duration);
                this.media.pause();
                try { this.media.currentTime = 0; } catch (error) {}
                this.overlay.classList.remove('is-visible', 'is-leaving', 'is-playing');
                this.overlay.classList.add('hidden');
                if (this.playButton) this.playButton.hidden = true;
                if (this.loadingStatus) this.loadingStatus.hidden = true;
                resolve(reason);
            };
            const onTimeUpdate = () => {
                if (!hasStarted) return;
                const remaining = this.media.duration - this.media.currentTime;
                if (Number.isFinite(remaining) && remaining <= JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS) {
                    void beginExit(JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS);
                    return;
                }
                // Do not enter recovery during the final rebuffer window. A
                // short clip cannot ever accumulate a four-second reserve
                // when less than two seconds remain, which would otherwise
                // leave the media paused forever near the end.
                if (Number.isFinite(remaining) && remaining <= JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS) return;
                if (!isWaitingForBuffer && this.getBufferedAheadSeconds() < JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS) {
                    isWaitingForBuffer = true;
                    this.media.pause();
                }
            };
            const onEnded = () => { void complete('ended', JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS); };
            const onError = () => { void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS); };
            const onWaiting = () => {
                if (!hasStarted || settled) return;
                const remaining = this.media.duration - this.media.currentTime;
                if (Number.isFinite(remaining) && remaining <= JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS) return;
                isWaitingForBuffer = true;
            };
            const onProgress = () => {
                const resumeTarget = Math.min(
                    JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS,
                    Number.isFinite(this.media.duration)
                        ? Math.max(0.5, this.media.duration - this.media.currentTime)
                        : JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS
                );
                if (!isWaitingForBuffer || this.getBufferedAheadSeconds() < resumeTarget) return;
                isWaitingForBuffer = false;
                void this.media.play().catch(() => { void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS); });
            };
            const onPlay = () => {
                if (hasStarted || settled) return;
                hasStarted = true;
                this.overlay.classList.add('is-playing', 'is-meditator');
                playDelayTimer = setTimeout(() => {
                    this.overlay.classList.remove('is-meditator');
                    this.overlay.classList.add('is-video');
                    const playback = this.media.play();
                    Promise.resolve(playback).then(() => {
                        this.audio.fadeJourneyVideoPrelude(state.volVideo, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS);
                    }).catch(() => { void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS); });
                }, JOURNEY_VIDEO_PRELUDE_MEDITATOR_HOLD_SECONDS * 1000);
            };

            this.media.addEventListener('timeupdate', onTimeUpdate);
            this.media.addEventListener('progress', onProgress);
            this.media.addEventListener('canplay', onProgress);
            this.media.addEventListener('waiting', onWaiting);
            this.media.addEventListener('stalled', onWaiting);
            this.media.addEventListener('ended', onEnded);
            this.media.addEventListener('error', onError);
            this.playButton?.addEventListener('click', onPlay, { once: true });
            this.overlay.classList.remove('hidden', 'is-leaving', 'is-playing', 'is-meditator', 'is-video');
            this.overlay.classList.add('is-meditator');
            if (this.playButton) this.playButton.hidden = true;
            if (this.loadingStatus) this.loadingStatus.hidden = false;
            const updateBufferCountdown = () => {
                if (!this.bufferCountdown) return;
                const target = Math.min(
                    this.getVideoBufferTargetSeconds(),
                    Number.isFinite(this.media.duration) ? Math.max(2, this.media.duration) : JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS
                );
                const remaining = Math.max(0, Math.ceil(target - this.getBufferedAheadSeconds()));
                this.bufferCountdown.textContent = remaining > 0 ? ` (${remaining}s remaining)` : '';
            };
            updateBufferCountdown();
            bufferCountdownTimer = setInterval(updateBufferCountdown, 500);
            requestAnimationFrame(() => this.overlay.classList.add('is-visible'));
            this.media.muted = false;
            this.media.volume = 1;
            this.media.pause();
            try { this.media.currentTime = 0; } catch (error) {}
            this.audio.fadeJourneyVideoPrelude(0, 0);
            void this.bufferVideoToSafePoint().then((isReady) => {
                if (settled) return;
                if (!isReady) {
                    void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS);
                    return;
                }
                if (this.playButton) {
                    this.playButton.hidden = false;
                    this.playButton.focus();
                }
                if (this.loadingStatus) this.loadingStatus.hidden = true;
            });
        }).finally(() => { this.activePlayback = null; });

        return this.activePlayback;
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
        this.isHypnosisJourney = false;
        this.isShotActive = false;
        this.isExperimentActive = false;
        this.experimentDuration = null;
        this.dndReminderAcknowledged = false;
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

    acknowledgeDndReminder() {
        this.dndReminderAcknowledged = true;
    }

    showDndReminderIfNeeded() {
        if (this.dndReminderAcknowledged) {
            this.dndReminderAcknowledged = false;
            return;
        }
        const reminder = t('ui.journeyVideoPreludeReminder');
        alert(reminder === 'ui.journeyVideoPreludeReminder' ? DND_REMINDER_FALLBACK : reminder);
    }

    estimateStandardJourneySeconds() {
        if (!this.scripts || this.isHighEnergy || isDemoScriptSelected()) return null;

        const narration = (text, transition = 'none') => {
            if (!text) return 0;
            return estimateNarrationDurationSeconds(text) + (transition === 'mantra' ? 0 : timing('narration', 'exitGap'));
        };
        const tone = (afterGap) => {
            const sharedDuration = Math.max(1000, Math.round(
                getDroneDurationMs(state.timePerChakra, state.droneDurationMode) / 2
            ));
            const audibleToneSeconds = state.noFrequencyMode ? 0 : (sharedDuration / 1000) + 1.1;
            return timing('transitions', 'arrivalToneLeadGap') + audibleToneSeconds + afterGap;
        };
        const selected = this.chakraOrder.map(key => [key, this.scripts[key]]).filter(([, chakra]) => chakra);
        if (!selected.length) return null;

        const phase = getMoonPhase();
        const opening = state.returningJourney
            ? localized(this.scripts.intro, 'returning')
            : localized(this.scripts.intro?.moon?.[phase]) || this.scripts.intro?.moon?.[`${phase}_${state.language}`];
        const intention = contentT('system.intention').replace('{{intention}}', state.intention?.trim() || defaultIntention(state.language));
        let seconds = state.timeIcebreaker + timing('transitions', 'initialSettle');
        seconds += narration(contentT('system.prePracticeSafety'));
        seconds += narration(this.getJourneySystemNarration('arrivalInduction'));
        seconds += tone(timing('transitions', 'arrivalToneExitGap'));
        seconds += narration(opening) + timing('transitions', 'openingPause');
        seconds += narration(localized(this.scripts.intro, 'gratitude'));
        seconds += narration(intention);
        seconds += narration(this.getJourneySystemNarration('arrivalReadiness'));
        seconds += tone(timing('transitions', 'arrivalReadinessGap'));
        if (getChecked('box-breathing-experience-toggle')) seconds += state.timeBreathing * 16;
        if (getChecked('visualization-addon-toggle')) seconds += Number(document.getElementById('visualization-duration')?.value || 2) * 60;
        if (getChecked('dharana-addon-toggle')) seconds += Number(document.getElementById('dharana-duration')?.value || 2) * 60;
        if (getChecked('body-scan-addon-toggle')) seconds += Number(document.getElementById('body-scan-duration')?.value || 5) * 60;
        if (getChecked('noting-addon-toggle')) seconds += Number(document.getElementById('noting-duration')?.value || 4) * 60;
        seconds += timing('transitions', 'postBreathing');

        selected.forEach(([key, chakra], index) => {
            seconds += narration(localized(chakra, 'meditation'), 'mantra');
            seconds += Math.max(0, state.timePerChakra * 60 - timing('transitions', 'chakraLeadOut'));
            seconds += timing('transitions', 'chakraPostMantra');
            seconds += narration(localized(chakra, 'affirmation'));
            if (index < selected.length - 1) {
                const intervalNarration = narration(contentT('system.breatheInterval'));
                seconds += timing('transitions', 'intervalPreparation') + Math.max(state.timeInterval, intervalNarration);
            }
        });

        if (getChecked('hooponopono-experience-toggle')) seconds += 4 * 60;
        if (getChecked('undo-unlearn-addon-toggle')) seconds += Number(document.getElementById('undo-unlearn-duration')?.value || 8) * 60;

        seconds += timing('transitions', 'finalSilence');
        seconds += narration(localized(this.scripts.closing));
        seconds += timing('transitions', 'closingFirstPause');
        seconds += narration(localized(this.scripts.closing, 'affirmation'));
        seconds += timing('transitions', 'closingSecondPause');
        seconds += timing('transitions', 'emergenceBellSettle');
        seconds += narration(this.getJourneySystemNarration('emergence'));
        seconds += state.timeEmergence + timing('transitions', 'emergenceFinalQuiet');
        return Math.ceil(seconds);
    }

    getSessionDurationMs(focusedExperience = null) {
        if (state.bgMusicMode) return 0;

        if (focusedExperience === 'box') {
            return Math.max(1, state.timeBreathing * 16 + timing('estimate', 'boxBreathingOverhead') * 60) * 1000;
        }
        if (focusedExperience === 'hooponopono') {
            return 4 * 60 * 1000;
        }
        if (focusedExperience === 'preparation') {
            const boxSeconds = getChecked('box-breathing-experience-toggle') ? state.timeBreathing * 16 + timing('estimate', 'boxBreathingOverhead') * 60 : 0;
            const visualizationMinutes = getChecked('visualization-addon-toggle') ? Number(document.getElementById('visualization-duration')?.value || 2) : 0;
            const dharanaMinutes = getChecked('dharana-addon-toggle') ? Number(document.getElementById('dharana-duration')?.value || 2) : 0;
            const bodyScanMinutes = getChecked('body-scan-addon-toggle') ? Number(document.getElementById('body-scan-duration')?.value || 5) : 0;
            const notingMinutes = getChecked('noting-addon-toggle') ? Number(document.getElementById('noting-duration')?.value || 4) : 0;
            const hooponoponoSeconds = getChecked('hooponopono-experience-toggle') ? 4 * 60 : 0;
            const undoSeconds = getChecked('undo-unlearn-addon-toggle') ? Number(document.getElementById('undo-unlearn-duration')?.value || 8) * 60 : 0;
            return Math.max(1, boxSeconds + (visualizationMinutes + dharanaMinutes + bodyScanMinutes + notingMinutes) * 60 + hooponoponoSeconds + undoSeconds) * 1000;
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

        const measuredStandardSeconds = !focusedExperience && !state.sleepMode && !state.bgMusicMode
            ? this.estimateStandardJourneySeconds()
            : null;
        if (Number.isFinite(measuredStandardSeconds)) return measuredStandardSeconds * 1000;

        const hypnosisWrapperMinutes = !this.isHighEnergy && !focusedExperience && !state.sleepMode &&
            !state.bgMusicMode && !isDemoScriptSelected()
            ? (state.timeEmergence / 60) + (timing('estimate', 'hypnosisTransitionToneSeconds') / 60) + (timing('estimate', 'hypnosisNarrationSeconds') / 60)
            : 0;
        const estimateMinutes = this.isHighEnergy
            ? state.timeHighEnergy + (state.timeIcebreaker / 60) + timing('estimate', 'highEnergyExtra')
            : this.chakraOrder.length * (state.timePerChakra + timing('estimate', 'chakraStageOverhead'))
                + (state.timeIcebreaker / 60)
                + timing('estimate', 'baseOverhead')
                + timing('estimate', 'normalExtra')
                + hypnosisWrapperMinutes;
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

    shouldRunHypnosisWrapper() {
        return this.isHypnosisJourney && this.isMeditationActive;
    }

    getJourneySystemNarration(key) {
        // Facilitator custom scripts may optionally provide their own Arrival
        // and Emergence wording. Built-in scripts and incomplete custom bundles
        // keep the app-localized copy, so this is an override, never a second
        // narration block.
        const customText = state.scriptSource === 'custom'
            ? localized(this.scripts?.system, key)
            : undefined;
        return customText || contentT(`system.${key}`);
    }

    async runGuidedTransitionTone(frequency, durationMs, { beforeGap = 0, afterGap = 0 } = {}) {
        if (!this.isMeditationActive) return;
        if (beforeGap > 0) await this.pauseAwareSleep(beforeGap * 1000);
        if (!this.isMeditationActive) return;
        if (state.noFrequencyMode) {
            // Preserve the same quiet breathing space when generated sound is
            // intentionally disabled; only the tone itself is omitted.
            if (afterGap > 0) await this.pauseAwareSleep(afterGap * 1000);
            return;
        }
        // Make a small, explicit space for the tone, then return the music to
        // its normal narration duck before the next spoken section.
        this.audio.fadeInBackgroundMusic(1.2, 0.08);
        const started = this.audio.startGuidedTransitionTone(frequency, durationMs);
        if (!started) return;
        await this.pauseAwareSleep(durationMs);
        this.audio.stopGuidedTransitionTone(1.1);
        await this.pauseAwareSleep(1100);
        if (!this.isMeditationActive) return;
        this.audio.fadeInBackgroundMusic(2.4, true);
        if (afterGap > 0) await this.pauseAwareSleep(afterGap * 1000);
    }

    async runArrivalInduction() {
        if (!this.shouldRunHypnosisWrapper()) return;
        const text = this.getJourneySystemNarration('arrivalInduction');
        if (text) await this.narrate(text, false);
        if (!this.isMeditationActive) return;
        const totalDuration = getDroneDurationMs(state.timePerChakra, state.droneDurationMode);
        const halfDuration = Math.max(1000, Math.round(totalDuration / 2));
        await this.runGuidedTransitionTone(432, halfDuration, {
            beforeGap: timing('transitions', 'arrivalToneLeadGap'),
            afterGap: timing('transitions', 'arrivalToneExitGap')
        });
    }

    async runArrivalReadiness() {
        if (!this.shouldRunHypnosisWrapper()) return;
        const text = this.getJourneySystemNarration('arrivalReadiness');
        if (text) await this.narrate(text, false);
        if (!this.isMeditationActive) return;
        const totalDuration = getDroneDurationMs(state.timePerChakra, state.droneDurationMode);
        const halfDuration = Math.max(1000, Math.round(totalDuration / 2));
        await this.runGuidedTransitionTone(528, halfDuration, {
            beforeGap: timing('transitions', 'arrivalToneLeadGap'),
            afterGap: timing('transitions', 'arrivalReadinessGap')
        });
    }

    async runEmergence() {
        if (!this.shouldRunHypnosisWrapper()) return;
        setText('mantra-display', '✦');
        // No Frequency Mode removes sound generators, while preserving the
        // guide's gentle reorientation narration below.
        if (!state.noFrequencyMode) this.audio.playSingingBowl();
        await this.pauseAwareSleep(timing('transitions', 'emergenceBellSettle') * 1000);
        if (!this.isMeditationActive) return;
        const text = this.getJourneySystemNarration('emergence');
        if (text) await withAudioStageFade(this.audio, state.timeEmergence, () => this.narrate(text, false));
        if (!this.isMeditationActive) return;
        await this.pauseAwareSleep(state.timeEmergence * 1000);
        if (!this.isMeditationActive) return;
        await this.pauseAwareSleep(timing('transitions', 'emergenceFinalQuiet') * 1000);
    }

    async runSleepJourney() {
        if (!state.advancedFeaturesUnlocked) return;
        if (this.isStarting || this.isMeditationActive) return;
        this.showDndReminderIfNeeded();
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
        this.isHypnosisJourney = false;
        this.sessionStartedAt = Date.now();
        showScreen(meditationScreen);
        this.startSessionCountdown(this.getSessionDurationMs());

        const controls = document.getElementById('controls');
        if (controls) controls.classList.remove('hidden');
        setText('pause-meditation', 'II');
        setText('mantra-display', journeyT('ui.sleepMode'));
        // Sleep mode has no spoken narration; keep the narration-only ticker
        // hidden while the visual guidance, music, and sleep tones run.
        this.visual.startPulsing('#355c7d');
        await this.audio.startBackgroundMusic();
        void this.audio.startPleasureAmbience();
        this.audio.fadeInBackgroundMusic(10, 0.32);

        const stageDurationMs = state.timeSleepStage * 60 * 1000;
        for (const [index, stage] of sleepStages.entries()) {
            if (!this.isMeditationActive) return;
            setText('mantra-display', journeyT(`ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`));
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
        if (!state.advancedFeaturesUnlocked) return;
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
            setText('mantra-display', journeyT('ui.shotsMode'));
            // Shots intentionally have no narration, so they must not leave
            // a looping narration marquee on screen.
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
                setText('mantra-display', stageLabel === stageLabelPath ? stage.key : journeyT(stageLabelPath));
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
        this.audio.stopVisualizationAmbience(2);
        this.audio.stopMantraTrack();
        this.stopSessionCountdown();
        wakeLock.release();
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
        this.audio.stopVisualizationAmbience(2);
        this.audio.stopMantraTrack();
        this.stopSessionCountdown();
        wakeLock.release();
        document.getElementById('controls')?.classList.add('hidden');
        showScreen(lobbyScreen);
        const startBtn = document.getElementById('start-meditation');
        if (startBtn) { startBtn.disabled = false; startBtn.style.opacity = '1'; }
    }

    shouldShowNewcomerTutorial() {
        return !state.returningJourney &&
            !getChecked('high-energy-toggle') &&
            !getChecked('music-only-toggle') &&
            !getChecked('sleep-mode-toggle') &&
            !this.getFocusedExperience();
    }

    async runNewcomerGuidedOrientation() {
        const status = document.getElementById('newcomer-guided-status');
        showScreen(newcomerTutorialScreen);
        scheduleNewcomerMarkerSync();
        newcomerTutorialScreen?.classList.add('is-guided');
        if (status) {
            status.hidden = false;
            status.textContent = t('ui.newcomerGuidedStatus');
        }
        // This is spoken guidance, so it must follow Meditation Language rather
        // than the independent Display Language used by the on-screen labels.
        await this.narrate(contentT('ui.newcomerGuidedNarration'), false, true, 'soft');
        if (status) status.hidden = true;
        newcomerTutorialScreen?.classList.remove('is-guided');
        showScreen(icebreakerScreen);
    }

    async start() {
        if (this.isStarting || this.isMeditationActive) return;
        this.isStarting = true;

        try {
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.style.opacity = "0.5";
            }

            const newcomerChoice = this.shouldShowNewcomerTutorial() ? 'guided' : 'skip';

            this.showDndReminderIfNeeded();

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
                hooponopono: getChecked('hooponopono-experience-toggle')
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
            this.isHypnosisJourney = false;
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

            if (newcomerChoice === 'guided') {
                if (piperWarmup) await piperWarmup;
                if (!this.isMeditationActive) return;
                await this.runNewcomerGuidedOrientation();
                if (!this.isMeditationActive) return;
            }

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
                if (focusedExperience === 'yoga') await this.runYogaSession();
                else if (focusedExperience === 'intimate') await this.runIntimateService();
                else if (focusedExperience === 'preparation') {
                    await this.runPreparationStages({ includeBox: true });
                    if (this.isMeditationActive && getChecked('hooponopono-experience-toggle')) await this.runHooponopono();
                    if (this.isMeditationActive && getChecked('undo-unlearn-addon-toggle')) await this.runUndoUnlearn();
                }
                if (this.isMeditationActive) this.finish();
                return;
            }

            // Only the ordinary chakra journey receives the optional Arrival
            // and Emergence wrapper. Focused experiences above return before
            // this point, so their established order remains untouched.
            this.isHypnosisJourney = !this.isHighEnergy && !isDemoScriptSelected();

            // ── ICEBREAKER PHASE (60 Second Music Fade In) ─────────────────────
            // Localize Icebreaker UI
            setText('icebreaker-title', contentT('system.arriving'));
            setText('icebreaker-subtitle', contentT('system.breatheAndSettle'));

            this.audio.fadeInBackgroundMusic(stageFadeSeconds(state.timeIcebreaker));
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
            if (this.isMeditationActive) await this.runPreparationStages({ includeBox: true, highEnergy: this.isHighEnergy });
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
        if (['perineal', 'bath', 'assisted-bath'].includes(activity) && !state.advancedFeaturesUnlocked) return;
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
        window.speechSynthesis.cancel();
        piperTTS.cancel('experiment stopped', { fadeSeconds: 2 });
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

    async runPreparationStages({ includeBox = false, highEnergy = false } = {}) {
        const stages = journeyRouting.buildPreparationStagePlan({
            highEnergy,
            box: includeBox && getChecked('box-breathing-experience-toggle'),
            visualization: getChecked('visualization-addon-toggle'),
            dharana: getChecked('dharana-addon-toggle'),
            bodyScan: getChecked('body-scan-addon-toggle'),
            noting: getChecked('noting-addon-toggle')
        });
        const runners = {
            box: () => this.runBoxBreathing(),
            visualization: () => this.runVisualization(),
            dharana: () => this.runDharana(),
            bodyScan: () => this.runBodyScan(),
            noting: () => this.runNoting()
        };
        await journeyRouting.executePreparationStages(stages, runners, () => this.isMeditationActive);
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
        tutTitle.textContent = journeyT('ui.preparation');
        const prePracticeSafety = contentT('system.prePracticeSafety');
        await this.narrate(prePracticeSafety, false);
        if (!this.isMeditationActive) return;

        await this.runArrivalInduction();
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
                tutTitle.textContent = isReturningVisitor ? journeyT('ui.returning') : journeyT('ui.moon');
                await this.narrate(openingText, false); // Keep music playing
                await this.pauseAwareSleep(timing('transitions', 'openingPause') * 1000);
            }
        }

        // Main gratitude + body scan. HRIM uses its own activation-oriented
        // intention framing while the normal journey keeps the existing text.
        if (!this.isMeditationActive) return;
        tutTitle.textContent = isHighEnergy ? journeyT('ui.intention') : journeyT('ui.gratitude');
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
            tutTitle.textContent = journeyT('ui.intention');
            await this.narrateIntentionWithFrequency(intentionText); // Keep music playing seamlessly into breathing
        } else {
            await this.narrate(text, false); // No intention? Still keep music playing.
        }
        if (!isHighEnergy && this.isMeditationActive) await this.runArrivalReadiness();
    }

    async runDharana() {
        const anchor = document.getElementById('dharana-anchor')?.value || 'indigo-circle';
        const minutes = Number(document.getElementById('dharana-duration')?.value || 2);
        const symbol = document.getElementById('chakra-symbol');
        const focusAnchor = document.getElementById('focus-anchor');
        const focusVeil = document.getElementById('focus-veil');
        const container = document.getElementById('chakra-container');
        await dharanaPractice.run({
            anchor,
            minutes,
            body: document.body,
            meditationScreen,
            symbol,
            focusAnchor,
            focusVeil,
            container,
            guidance: journeyT('ui.dharanaFocusGuidance'),
            title: journeyT('ui.dharanaTitle'),
            closing: journeyT('ui.dharanaClosing'),
            showScreen,
            stopVisual: () => this.visual.stop(),
            setTitle: text => setText('mantra-display', text),
            narrate: text => this.narrate(text, false),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive
        });
    }

    async runBodyScan() {
        const minutes = Number(document.getElementById('body-scan-duration')?.value || 5);
        const scene = document.getElementById('body-scan-scene');
        const regions = journeyT('ui.bodyScanRegions');
        await bodyScanPractice.run({
            minutes,
            body: document.body,
            meditationScreen,
            scene,
            regions,
            opening: journeyT('ui.bodyScanOpening'),
            title: journeyT('ui.bodyScanTitle'),
            closing: journeyT('ui.bodyScanClosing'),
            showScreen,
            stopVisual: () => this.visual.stop(),
            setTitle: text => setText('mantra-display', text),
            narrate: text => this.narrate(text, false),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive
        });
    }

    async runNoting() {
        const minutes = Number(document.getElementById('noting-duration')?.value || 4);
        const scene = document.getElementById('noting-scene');
        const reminders = journeyT('ui.notingReminders');
        await guidedNotingPractice.run({
            minutes,
            body: document.body,
            meditationScreen,
            scene,
            reminders,
            opening: journeyT('ui.notingOpening'),
            title: journeyT('ui.notingTitle'),
            closing: journeyT('ui.notingClosing'),
            showScreen,
            stopVisual: () => this.visual.stop(),
            setTitle: text => setText('mantra-display', text),
            narrate: text => this.narrate(text, false),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive
        });
    }

    async runVisualization() {
        const minutes = Number(document.getElementById('visualization-duration')?.value || 2);
        const blackout = document.getElementById('visualization-blackout');
        await visualizationPractice.run({
            minutes,
            ambience: state.visualizationAmbience,
            body: document.body,
            meditationScreen,
            blackout,
            title: () => setText('mantra-display', journeyT('ui.visualizationTitle')),
            focusPrompt: journeyT('ui.visualizationFocusPrompt'),
            guidance: journeyT('ui.visualizationGuidance'),
            silenceWakePrompt: journeyT('ui.visualizationSilenceWakePrompt'),
            returnPrompt: journeyT('ui.visualizationReturn'),
            showScreen,
            fadeBackgroundMusicOut: seconds => this.audio.fadeOutBackgroundMusic(seconds),
            startAmbience: () => this.audio.startVisualizationAmbience(),
            setAmbienceDucked: (ducked, seconds) => this.audio.setVisualizationAmbienceDucked(ducked, seconds),
            stopAmbience: () => this.audio.stopVisualizationAmbience(),
            fadeBackgroundMusicIn: (seconds, resume) => this.audio.fadeInBackgroundMusic(seconds, resume),
            narrate: (...args) => this.narrate(...args),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive,
            requestFrame: callback => requestAnimationFrame(callback),
            warn: (...args) => console.warn(...args)
        });
    }

    async runBoxBreathing() {
        const breathingStep = this.isExperimentActive && this.experimentDuration != null ? this.experimentDuration : state.timeBreathing;
        const screen = document.getElementById('breathing-screen');
        await boxBreathingPractice.run({
            breathingStep,
            breathingPreparationSeconds: timing('transitions', 'breathingPreparation'),
            tutorialFadeSeconds: timing('transitions', 'breathingTutorialFade'),
            completionSeconds: timing('transitions', 'breathingCompletion'),
            screen,
            tutorial: document.getElementById('breathing-tutorial'),
            titleElement: document.getElementById('tutorial-title'),
            instruction: document.getElementById('breathing-instruction'),
            circle: document.getElementById('breathing-circle'),
            timer: document.getElementById('breathing-timer'),
            title: journeyT('ui.preparation'),
            preparationNarration: contentT('system.centeringBreath'),
            steps: contentT('system.breathingSteps'),
            completionLabel: journeyT('ui.breathingComplete'),
            completionNarration: contentT('system.breathingComplete'),
            prepareLabel: journeyT('ui.prepare'),
            showScreen,
            narrate: (text, keepSilence) => this.narrate(text, false, keepSilence),
            narrateSoft: text => this.narrateSoft(text),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive,
            isPaused: () => this.isPaused,
            fadeMusicOut: seconds => this.audio.fadeOutBackgroundMusic(seconds),
            fadeMusicIn: (seconds, immediate) => this.audio.fadeInBackgroundMusic(seconds, immediate)
        });
    }

    async runCorpsePose() {
        try {
            if (!this.isMeditationActive) return;

            // Use the Icebreaker screen for the clean, minimal aesthetic with a large timer
            showScreen(icebreakerScreen);
            const title = document.getElementById('icebreaker-title');
            const subtitle = document.getElementById('icebreaker-subtitle');
            const timer = document.getElementById('icebreaker-timer');

            title.textContent = journeyT('ui.corpsePose');
            subtitle.textContent = journeyT('ui.corpsePoseSubtitle');

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
            subtitle.textContent = journeyT('ui.prepare');
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
        subtitle.textContent = journeyT('ui.purification');

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
            title: journeyT('ui.guideReadyForNextSession'),
            subtitle: journeyT('ui.guideReadyForNextSessionGuidance'),
            readyText: journeyT('ui.guideReadyForNextSessionGuidance'),
            continueLabel: journeyT('ui.proceedToNextSession')
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

        if (mantraEl) mantraEl.textContent = journeyT('system.musicOnly');
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
                title: journeyT('ui.bathToYogaRestTitle'),
                subtitle: journeyT('ui.bathToYogaRestGuidance'),
                readyText: journeyT('ui.restReadyToContinue'),
                continueLabel: journeyT('ui.beginYogaAfterRest')
            });
            if (!shouldBeginYoga) return;
        }

        // Transition Screen
        showScreen(icebreakerScreen);
        const title = document.getElementById('icebreaker-title');
        const subtitle = document.getElementById('icebreaker-subtitle');
        const timer = document.getElementById('icebreaker-timer');

        title.textContent = journeyT('ui.yoga');
        subtitle.textContent = journeyT('ui.yogaSubtitle');
        
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
        if (!keepSilence) this.audio.fadeInBackgroundMusic(6, true);
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

        const sentences = splitNarrationText(text);
        // One current clip plus one future clip. Generate the next clip only
        // within twelve seconds of the current clip ending, using audio duration.
        const generation = piperTTS.generation;
        const queueSynthesis = (sentence) => {
            const job = piperTTS.prepare(sentence);
            // A Stop action may cancel jobs that have not reached the active
            // await yet. Attach a sink immediately so intentional cancellation
            // cannot create unhandled promise errors.
            job.catch(() => {});
            return job;
        };
        let pending = sentences.length ? queueSynthesis(sentences[0]) : null;
        let piperFailed = false;

        for (let i = 0; i < sentences.length; i++) {
            if (!this.isMeditationActive) break;
            while (this.isPaused && this.isMeditationActive) await new Promise(resolve => setTimeout(resolve, 100));

            if (piperFailed) {
                await this.narrateBrowser(sentences[i], false, true, pacing, false);
                continue;
            }

            try {
                const buffer = await pending;
                if (!this.isMeditationActive || generation !== piperTTS.generation) return;
                while (this.isPaused && this.isMeditationActive) await new Promise(resolve => setTimeout(resolve, 100));
                if (!this.isMeditationActive || generation !== piperTTS.generation) return;
                if (i + 1 < sentences.length) {
                    pending = (async () => {
                        await this.pauseAwareSleep(Math.max(0, buffer.duration - 12) * 1000);
                        if (!this.isMeditationActive || generation !== piperTTS.generation) throw new Error('Narration cancelled');
                        return queueSynthesis(sentences[i + 1]);
                    })();
                    pending.catch(() => {});
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
                if (!this.isMeditationActive || generation !== piperTTS.generation) return;
                piperFailed = true;
                piperTTS.cancel('sentence failed');
                setVoiceStatus(t('ui.piperFallback'), 'error');
                await this.narrateBrowser(sentences[i], false, true, pacing, false);
            }

            if (i < sentences.length - 1) await this.pauseAwareSleep(sentenceGap * 1000);
        }

        if (fadeOut) {
            await this.pauseAwareSleep(timing('narration', 'fadeOutPause') * 1000);
            this.audio.fadeOutBackgroundMusic(4);
        } else if (transition !== 'mantra') {
            // Give the final spoken phrase room to settle before the caller
            // introduces another narration block or visual instruction.
            await this.pauseAwareSleep(timing('narration', 'exitGap') * 1000);
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
        return await this.narrateSoftBrowser(text);
    }

    async narrateSoftBrowser(text) {
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
        this.visual.presence?.setPaused(this.isPaused);
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
        if (this.isMeditationActive && getChecked('hooponopono-experience-toggle')) await this.runHooponopono();
        if (this.isMeditationActive && getChecked('undo-unlearn-addon-toggle')) await this.runUndoUnlearn();
        if (this.isMeditationActive) { await this.handleSilence(); }
        if (this.isMeditationActive) { await this.runClosing(); }
        if (this.isMeditationActive) { await this.runEmergence(); }
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
            setText('mantra-display', `✦ ${journeyT('system.body')} ✦`);
            await this.narrate(healthAffirmation);
        }
        await this.pauseAwareSleep(timing('transitions', 'closingSecondPause') * 1000);
    }

    async runHooponopono() {
        const aura = document.getElementById('aura-bg');
        const symbolEl = document.getElementById('chakra-symbol');
        const phrases = localized(this.scripts.hooponopono.phrases);
        await hooponoponoPractice.run({
            aura,
            symbol: symbolEl,
            intro: localized(this.scripts.hooponopono.intro),
            phrases,
            closing: localized(this.scripts.hooponopono.closing),
            introPauseSeconds: timing('transitions', 'hooponoponoIntroPause'),
            phrasePauseSeconds: timing('transitions', 'hooponoponoPhrasePause'),
            finalRestSeconds: timing('transitions', 'hooponoponoFinalRest'),
            setTitle: text => setText('mantra-display', text),
            narrate: (...args) => this.narrate(...args),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive
        });
    }

    async runUndoUnlearn() {
        const minutes = Number(document.getElementById('undo-unlearn-duration')?.value || 8);
        const scene = document.getElementById('undo-unlearn-scene');
        const phases = journeyT('ui.undoUnlearnPhases');
        await undoUnlearnPractice.run({
            minutes,
            body: document.body,
            meditationScreen,
            scene,
            phases,
            opening: journeyT('ui.undoUnlearnOpening'),
            title: journeyT('ui.undoUnlearnTitle'),
            closing: journeyT('ui.undoUnlearnClosing'),
            showScreen,
            stopVisual: () => this.visual.stop(),
            setTitle: text => setText('mantra-display', text),
            narrate: (...args) => this.narrate(...args),
            sleep: milliseconds => this.pauseAwareSleep(milliseconds),
            isActive: () => this.isMeditationActive
        });
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
        return journeyRouting.resolveFocusedExperience({
            yogaSelected: getChecked('yoga-experience-toggle'),
            intimateSelected: getChecked('perineal-care-toggle') || getChecked('massage-toggle') || getChecked('assisted-bathing-toggle'),
            selectedChakraCount: state.selectedChakras.length,
            preparationSelected: getChecked('box-breathing-experience-toggle') || getChecked('hooponopono-experience-toggle') || getChecked('undo-unlearn-addon-toggle') || getChecked('dharana-addon-toggle') || getChecked('visualization-addon-toggle') || getChecked('body-scan-addon-toggle') || getChecked('noting-addon-toggle')
        });
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
        const narrationPromise = withAudioStageFade(this.audio, state.timeInterval, () => this.narrateFeeble(breatheText));
        narrationPromise.catch(() => {}); // The timer may outlast a failed preparation; await below still reports it.
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
        const transitionSeconds = Math.max(0, timing('transitions', 'chakraPostMantra'));
        this.audio.stopMantraTrack({ stageWindow: transitionSeconds });
        await this.pauseAwareSleep(transitionSeconds * 1000);

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
        return await this.narrateFeebleBrowser(text);
    }

    async narrateFeebleBrowser(text) {
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
        if (this.shouldUsePiper()) {
            try { return await this.narrateWithPiper(text, fadeOut, keepSilence, 1, pacing, transition); }
            catch (error) {
                console.error('[Piper] narration failed:', error);
                if (!this.isMeditationActive) return;
                setVoiceStatus(t('ui.piperFallback'), 'error');
            }
        }
        return await this.narrateBrowser(text, fadeOut, keepSilence, pacing, true, transition);
    }

    async narrateBrowser(text, fadeOut = false, keepSilence = false, pacing = 'normal', _legacyTextFlag = true, transition = 'none') {
        if (!window.speechSynthesis) return;

        // Browser speech is outside the Web Audio graph, so it cannot receive
        // the Piper gain ramp. A normal mantra handoff therefore waits for
        // speechSynthesis.onend; emergency stop/pause paths remain immediate.

        // Cancel any queued speech to prevent buildup on mobile
        window.speechSynthesis.cancel();

        // Ensure background music is active at ducked level
        if (!keepSilence) {
            this.audio.fadeInBackgroundMusic(6, true);
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

            if (i < sentences.length - 1) await this.pauseAwareSleep(sentenceGap * 1000);
        }

        // Release Frequency Carving after narration ends
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(0, this.audio.ctx.currentTime + 3);
        }

        if (fadeOut) {            // Only fade out if explicitly requested (e.g. right before mantra)
            await this.pauseAwareSleep(timing('narration', 'fadeOutPause') * 1000);
            this.audio.fadeOutBackgroundMusic(4);
        } else if (transition !== 'mantra') {
            // Browser TTS cannot use Piper's output fade, but it follows the
            // same shared final breathing space before the next stage.
            await this.pauseAwareSleep(timing('narration', 'exitGap') * 1000);
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
        document.body.classList.remove('visualization-active');
        document.body.classList.remove('body-scan-active');
        document.body.classList.remove('noting-active');
        document.body.classList.remove('undo-unlearn-active');
        const sessionMinutes = Math.max(1, Math.round((Date.now() - (this.sessionStartedAt || Date.now())) / 60000));
        this.isMeditationActive = false; 
        this.isHypnosisJourney = false;
        this.sessionStartedAt = null;
        this.stopSessionCountdown();
        this.visual.stop(); 
        this.stopStageDrone();
        // The completion path must not restore music after the mantra fades.
        // Schedule one coordinated fade for both layers instead.
        this.audio.stopMantraTrack({ restoreMusic: false });
        this.audio.stopGuidedTransitionTone();
        this.audio.bgMusicTargetVolume = 0;
        this.audio.bgMusicTargetEQ = 0;
        this.audio.stopBackgroundMusic(BACKGROUND_MUSIC_STOP_FADE_SECONDS);
        this.audio.stopVisualizationAmbience(VISUALIZATION_AMBIENCE_EXIT_FADE_SECONDS);
        this.audio.stopPleasureAmbience(8);
        wakeLock.release();
        piperTTS.cancel('journey finished', { fadeSeconds: 2 });
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        state.stats.journeys += 1; state.stats.time += sessionMinutes;
        localStorage.setItem('chakra_stats_journeys', state.stats.journeys);
        localStorage.setItem('chakra_stats_time', state.stats.time);
        setText('stat-journeys', state.stats.journeys);
        setText('stat-time', state.stats.time);
        setText('stat-session-time', sessionMinutes + ' mins');
        // Lift sleep mode dimming once session ends
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.setProperty('--app-brightness', '1');
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

    stop({ preserveScreen = false } = {}) {
        document.body.classList.remove('visualization-active');
        document.body.classList.remove('body-scan-active');
        document.body.classList.remove('noting-active');
        document.body.classList.remove('undo-unlearn-active');
        const returnScreen = this.isExperimentActive ? experimentScreen : lobbyScreen;
        this.isMeditationActive = false; this.isShotActive = false; this.isHypnosisJourney = false; this.stopIntentionFrequency(); this.stopStageDrone(); this.audio.stopGuidedTransitionTone(); this.audio.stopMantraTrack({ restoreMusic: false }); this.audio.stopBackgroundMusic(); this.audio.stopVisualizationAmbience(2); this.audio.stopPleasureAmbience(8); this.visual.stop(); wakeLock.release();
        this.stopSessionCountdown();
        this.isExperimentActive = false;
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
        piperTTS.cancel('journey stopped', { fadeSeconds: 2 });
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.setProperty('--app-brightness', '1');
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
        if (!preserveScreen) {
            showScreen(returnScreen);
        }
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
const particleField = new AmbientParticleField();
const visual = new VisualEngine(audio);
const journeyVideoPrelude = new JourneyVideoPrelude(audio);
const piperTTS = piperLifecycle.createPiperTTS(audio, {
    voiceIdFromValue: piperVoiceId,
    getVoiceDefinition: voiceId => piperVoiceRegistry.find(voice => voice.id === voiceId) || null,
    setVoiceStatus,
    translate: t,
    getMeditationSettings: getPiperMeditationSettings,
    getVoiceVolume: () => state.volVoice,
    WorkerConstructor: window.Worker,
    WebAssemblyRuntime: window.WebAssembly,
    clipFadeSeconds: PIPER_CLIP_FADE_SECONDS,
    cancelFadeSeconds: PIPER_CANCEL_FADE_SECONDS
});
const meditation = new MeditationController(audio, visual);

document.addEventListener('visibilitychange', async () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
    if (wakeLock.wakeLock !== null && document.visibilityState === 'visible') await wakeLock.request();
});
document.documentElement.classList.toggle('page-hidden', document.hidden);

const state = window.ChakraAppState.createInitialState({
    storage: localStorage,
    helpers: {
        normalizeDroneDurationMode,
        normalizeHrimDroneDurationMode,
        normalizeSleepDroneDurationMode,
        normalizeSpatialMode,
        clampAudioLevel,
        clampPleasureAmbienceGain,
        normalizePleasureAmbienceUrl,
        clampPleasureAmbienceBlurAmount,
        normalizeMeditationVisualEffect
    },
    constants: {
        PLEASURE_AMBIENCE_GAIN,
        PLEASURE_AMBIENCE_URL_STORAGE_KEY,
        PLEASURE_BLUR_DEFAULT_AMOUNT
    }
});

function isDemoScriptSelected() {
    return state.scriptSource === 'custom' && getDemoCoreDurationMinutes(state.customScript) !== null;
}

function syncCorePracticeDuration(value) {
    const definition = timingConfig.journey?.timePerChakra || { min: 1, max: 7, step: 0.5 };
    const demoDuration = isDemoScriptSelected() ? getDemoCoreDurationMinutes(state.customScript) : null;
    const minimum = demoDuration ?? Number(definition.min);
    const maximum = Number(definition.max);
    const duration = Math.min(maximum, Math.max(minimum, Number(value)));
    state.timePerChakra = duration;
    localStorage.setItem('chakra_time', String(duration));

    if (!getChecked('shots-toggle') && !getChecked('sleep-mode-toggle') && timeSlider) {
        timeSlider.min = String(minimum);
        timeSlider.max = String(maximum);
        timeSlider.step = String(definition.step ?? 0.5);
        timeSlider.value = String(duration);
        const pct = ((duration - minimum) / (maximum - minimum) * 100).toFixed(1) + '%';
        timeSlider.style.setProperty('--range-fill', pct);
        setText('time-display', `${duration.toFixed(1)} mins`);
        refreshRangeControlDisplays();
    }
    updateDroneDurationSummary();
}

function applyDemoCoreDurationPreset() {
    const demoDuration = getDemoCoreDurationMinutes(state.customScript);
    if (!isDemoScriptSelected() || demoDuration === null) return false;
    if (localStorage.getItem(DEMO_PREVIOUS_CORE_DURATION_STORAGE_KEY) === null && state.timePerChakra !== demoDuration) {
        localStorage.setItem(DEMO_PREVIOUS_CORE_DURATION_STORAGE_KEY, String(state.timePerChakra));
    }
    syncCorePracticeDuration(demoDuration);
    return true;
}

function restorePreDemoCoreDuration() {
    if (isDemoScriptSelected()) return false;
    const storedDuration = Number(localStorage.getItem(DEMO_PREVIOUS_CORE_DURATION_STORAGE_KEY));
    localStorage.removeItem(DEMO_PREVIOUS_CORE_DURATION_STORAGE_KEY);
    if (!Number.isFinite(storedDuration)) return false;
    syncCorePracticeDuration(storedDuration);
    return true;
}

function syncPleasureAmbienceControl() {
    moodAmbienceSettingsView.sync({
        document,
        state,
        audioUnavailable: audio.pleasureAudioAvailable === false,
        formatLevel: formatPleasureAmbienceLevel,
        unavailableMessage: t('ui.pleasureAmbienceSourceUnavailable')
    });
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
    particleField.start();
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
    journeyVoiceProfile.apply({
        isHighEnergy,
        isFeminineVoice: !isHighEnergy && isFeminineNarrationVoice(),
        state,
        storage: localStorage,
        syncValue,
        document,
        audio
    });
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
    
    mixerPreferenceHydration.hydrate({ state, syncValue });

    setText('stat-journeys', state.stats.journeys);
    setText('stat-time', state.stats.time);
    document.querySelectorAll('#chakra-selection input').forEach(cb => {
        cb.checked = state.selectedChakras.includes(cb.value);
    });
    if (!state.intention.trim()) state.intention = defaultIntention();
    syncValue('intention-input', state.intention);
    
    syncChecked('returning-journey-toggle', state.returningJourney);
    syncChecked('journey-video-prelude-toggle', state.journeyVideoPreludeEnabled);
    syncChecked('audio-filters-toggle', state.audioFilters);
    syncChecked('mixer-no-frequency-mode-toggle', state.noFrequencyMode);
    syncChecked('mixer-no-mantra-mode-toggle', state.noMantraMode);
    // Experience modes are session-only; retired selection keys are cleared
    // before the persistent practice preferences are restored below.
    sessionModeHydration.resetPreparationSelections({ storage: localStorage, syncChecked });
    syncChecked('no-frequency-mode-toggle', state.noFrequencyMode);
    syncChecked('no-mantra-mode-toggle', state.noMantraMode);
    syncChecked('mood-relaxation-intention-toggle', state.moodRelaxationIntentionEnabled);
    syncPleasureAmbienceControl();
    const moodRelaxationToggle = document.getElementById('mood-relaxation-intention-toggle');
    if (moodRelaxationToggle) moodRelaxationToggle.disabled = state.noFrequencyMode;
    syncChecked('eyes-close-mode-toggle', state.eyesCloseMode);
    sessionModeHydration.resetExclusiveModes({ storage: localStorage, syncChecked });
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
    syncValue('visual-effect-select', state.visualEffect);
    visual.applyImageEffect();

    // Sync Journey Timings Sliders
    syncValue('time-icebreaker', state.timeIcebreaker);
    setText('display-icebreaker', state.timeIcebreaker + 's');
    syncValue('time-emergence', state.timeEmergence);
    setText('display-emergence', state.timeEmergence + 's');
    
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
    document.getElementById('app').style.setProperty('--app-brightness', String(state.brightness));

    // Sync Script Selection
    syncValue('script-source-select', state.scriptSource);
    const customScriptUI = document.getElementById('custom-script-ui');
    if (customScriptUI) {
        customScriptUI.style.display = state.scriptSource === 'custom' ? 'flex' : 'none';
    }
    if (state.customScript) {
        const statusEl = document.getElementById('script-status');
        if (statusEl) {
            statusEl.textContent = isDemoScriptSelected() ? getDemoScriptTimingMessage() : "Custom script loaded and ready.";
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
    screenNavigation.showScreen(screen);
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
        yogaExperienceSettings.persist({ document, state, storage: localStorage });
        const selectedDeity = document.querySelector('input[name="deity-path"]:checked');
        state.deityPath = selectedDeity ? selectedDeity.value : 'none';
        state.visualEffect = normalizeMeditationVisualEffect(document.getElementById('visual-effect-select')?.value);
        
        localStorage.setItem('chakra_audio_filters', state.audioFilters);
        localStorage.removeItem('chakra_box_meditation');
        localStorage.removeItem('chakra_hooponopono');
        localStorage.setItem('chakra_no_frequency_mode', state.noFrequencyMode);
        localStorage.setItem('chakra_deity_path', state.deityPath);
        localStorage.setItem('chakra_visual_effect', state.visualEffect);
        localStorage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
        localStorage.removeItem('chakra_yoga_bridge');
        localStorage.setItem('chakra_script_source', state.scriptSource);

        if (audio.toggleEyesCloseMode) audio.toggleEyesCloseMode(state.eyesCloseMode);
        document.body.classList.toggle('eyes-close-mode', state.eyesCloseMode);
        visual.applyImageEffect();
        localStorage.setItem('chakra_configured', 'true');
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
        aura.style.opacity = '1';
    });

    // Dynamic Setting Visibility
    function updateTimingRowVisibility() {
        yogaExperienceSettings.syncTimingRows({ document, getChecked });
    }

    function persistYogaExperienceSetup() {
        yogaExperienceSettings.persist({ document, state, storage: localStorage });
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
    const dharanaAddonToggle = document.getElementById('dharana-addon-toggle');
    const visualizationAddonToggle = document.getElementById('visualization-addon-toggle');
    const bodyScanAddonToggle = document.getElementById('body-scan-addon-toggle');
    const notingAddonToggle = document.getElementById('noting-addon-toggle');
    const undoUnlearnAddonToggle = document.getElementById('undo-unlearn-addon-toggle');
    const yogaExperienceToggle = document.getElementById('yoga-experience-toggle');
    const corpsePoseToggle = document.getElementById('corpse-pose-toggle');
    const highEnergyToggle = document.getElementById('high-energy-toggle');
    const sleepModeToggle = document.getElementById('sleep-mode-toggle');
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
        if (yogaExperienceToggle && yogaExperienceToggle !== except) yogaExperienceToggle.checked = false;
        if (!except || except !== yogaExperienceToggle) state.yogaExperienceEnabled = false;
    }

    function clearJourneyAddons() {
        if (boxBreathingExperienceToggle) boxBreathingExperienceToggle.checked = false;
        if (hooponoponoExperienceToggle) hooponoponoExperienceToggle.checked = false;
        if (dharanaAddonToggle) dharanaAddonToggle.checked = false;
        if (visualizationAddonToggle) visualizationAddonToggle.checked = false;
        if (bodyScanAddonToggle) bodyScanAddonToggle.checked = false;
        if (notingAddonToggle) notingAddonToggle.checked = false;
        if (undoUnlearnAddonToggle) undoUnlearnAddonToggle.checked = false;
        state.boxBreathingExperienceEnabled = false;
        state.hooponoponoExperienceEnabled = false;
    }

    const advancedPasswordModal = document.getElementById('advanced-password-modal');
    const advancedPasswordForm = document.getElementById('advanced-password-form');
    const advancedPasswordInput = document.getElementById('advanced-password-input');
    const advancedPasswordReveal = document.getElementById('advanced-password-reveal');
    const advancedPasswordCancel = document.getElementById('advanced-password-cancel');
    const advancedPasswordClose = document.getElementById('advanced-password-close');
    let advancedPasswordResolver = null;

    function closeAdvancedPasswordDialog(password = null) {
        if (!advancedPasswordResolver) return;
        const resolve = advancedPasswordResolver;
        advancedPasswordResolver = null;
        advancedPasswordModal?.classList.add('hidden');
        if (advancedPasswordInput) {
            advancedPasswordInput.value = '';
            advancedPasswordInput.type = 'password';
        }
        resolve(password);
    }

    function requestAdvancedPassword() {
        if (!advancedPasswordModal || !advancedPasswordInput) return Promise.resolve(null);
        advancedPasswordInput.value = '';
        advancedPasswordInput.type = 'password';
        advancedPasswordModal.classList.remove('hidden');
        requestAnimationFrame(() => advancedPasswordInput.focus());
        return new Promise(resolve => { advancedPasswordResolver = resolve; });
    }

    function setAdvancedPasswordVisible(visible) {
        if (!advancedPasswordInput || !advancedPasswordReveal) return;
        advancedPasswordInput.type = visible ? 'text' : 'password';
        advancedPasswordReveal.setAttribute('aria-pressed', String(visible));
    }

    advancedPasswordForm?.addEventListener('submit', event => {
        event.preventDefault();
        closeAdvancedPasswordDialog(advancedPasswordInput?.value ?? null);
    });
    advancedPasswordCancel?.addEventListener('click', () => closeAdvancedPasswordDialog());
    advancedPasswordClose?.addEventListener('click', () => closeAdvancedPasswordDialog());
    advancedPasswordReveal?.addEventListener('pointerdown', event => {
        event.preventDefault();
        setAdvancedPasswordVisible(true);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => advancedPasswordReveal?.addEventListener(type, () => setAdvancedPasswordVisible(false)));
    advancedPasswordReveal?.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') setAdvancedPasswordVisible(true);
    });
    advancedPasswordReveal?.addEventListener('keyup', event => {
        if (event.key === 'Enter' || event.key === ' ') setAdvancedPasswordVisible(false);
    });

    const intimateServiceToggles = [
        document.getElementById('perineal-care-toggle'),
        document.getElementById('massage-toggle'),
        document.getElementById('assisted-bathing-toggle')
    ].filter(Boolean);
    const intimateServicePanel = document.getElementById('intimate-service-panel');
    const experimentCareOptions = document.getElementById('experiment-care-group');
    const experimentActivitySelect = document.getElementById('experiment-activity');
    let intimateServiceUnlocked = false;
    let intimateServiceTapCount = 0;
    let intimateServiceLastTap = null;
    let intimateServiceTapTimer = null;
    let unlockToastTimer = null;
    const versionUnlockButton = document.getElementById('app-version-unlock');
    const advancedFeaturesControl = document.getElementById('advanced-features-control');
    const advancedFeaturesToggle = document.getElementById('advanced-features-toggle');
    const unlockToast = document.createElement('div');
    unlockToast.className = 'advanced-unlock-toast';
    unlockToast.setAttribute('role', 'status');
    unlockToast.setAttribute('aria-live', 'polite');
    document.body.appendChild(unlockToast);

    function showUnlockToast(message) {
        clearTimeout(unlockToastTimer);
        unlockToast.textContent = message;
        unlockToastTimer = setTimeout(() => { unlockToast.textContent = ''; unlockToastTimer = null; }, 2500);
    }

    function resetUnlockTaps() {
        clearTimeout(intimateServiceTapTimer);
        intimateServiceTapTimer = null;
        intimateServiceTapCount = 0;
        intimateServiceLastTap = null;
    }

    function clearIntimateService() {
        intimateServiceToggles.forEach(toggle => { toggle.checked = false; });
        state.perinealCareEnabled = false;
        state.massageEnabled = false;
        state.assistedBathingEnabled = false;
        localStorage.setItem('chakra_intimate_perineal_care', 'false');
        localStorage.setItem('chakra_intimate_massage', 'false');
        localStorage.setItem('chakra_intimate_assisted_bathing', 'false');
    }

    function setIntimateServiceLocked(isLocked) {
        intimateServiceUnlocked = !isLocked;
        state.advancedFeaturesUnlocked = !isLocked;
        if (isLocked) {
            state.moodRelaxationIntentionEnabled = false;
            audio.stopPleasureAmbience();
            syncChecked('mood-relaxation-intention-toggle', false);
        }
        particleField.setDeepSkyBlackHoleEnabled(!isLocked);
        document.getElementById('shots-control').hidden = isLocked;
        document.getElementById('sound-healing-title').hidden = isLocked;
        if (shotsToggle) {
            if (isLocked) shotsToggle.checked = false;
            shotsToggle.disabled = isLocked || state.noFrequencyMode;
        }
        const sleepModeControl = document.getElementById('sleep-mode-control');
        if (sleepModeControl) sleepModeControl.hidden = isLocked;
        if (sleepModeToggle) {
            if (isLocked) clearSleepMode();
            sleepModeToggle.disabled = isLocked;
        }
        const yogaModeControl = document.getElementById('yoga-mode-control');
        if (yogaModeControl) yogaModeControl.hidden = isLocked;
        if (yogaExperienceToggle) {
            if (isLocked) {
                yogaExperienceToggle.checked = false;
                state.yogaExperienceEnabled = false;
                if (yogaExperienceSetup) yogaExperienceSetup.hidden = true;
            }
            yogaExperienceToggle.disabled = isLocked;
        }
        if (experimentCareOptions && experimentActivitySelect) {
            experimentCareOptions.disabled = isLocked;
            experimentCareOptions.hidden = isLocked;
            if (isLocked) {
                const resetActivity = ['perineal', 'bath', 'assisted-bath'].includes(experimentActivitySelect.value);
                // Remove from the native picker, including browsers that do
                // not consistently hide optgroups via the hidden attribute.
                experimentCareOptions.remove();
                if (resetActivity) {
                    experimentActivitySelect.value = 'chakra:root';
                    experimentActivitySelect.dispatchEvent(new Event('change'));
                }
            } else {
                experimentCareOptions.label = t('ui.experimentCare');
                experimentCareOptions.querySelectorAll('[data-i18n]').forEach(option => {
                    option.textContent = t(option.dataset.i18n);
                });
                experimentActivitySelect.appendChild(experimentCareOptions);
            }
        }
        if (intimateServicePanel) intimateServicePanel.hidden = isLocked || getChecked('shots-toggle');
        if (advancedFeaturesControl) advancedFeaturesControl.hidden = isLocked;
        if (advancedFeaturesToggle) advancedFeaturesToggle.checked = !isLocked;
        const settingsExportControl = document.getElementById('settings-export-control');
        if (settingsExportControl) settingsExportControl.hidden = isLocked;
        intimateServiceToggles.forEach(toggle => {
            toggle.disabled = isLocked;
            toggle.setAttribute('aria-disabled', String(isLocked));
        });
        syncPleasureAmbienceControl();
    }

    async function verifyAdvancedFeaturesPassword(password) {
        if (typeof password !== 'string' || !globalThis.crypto?.subtle) return false;
        const bytes = new TextEncoder().encode(password);
        const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
        const actual = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        return actual === ADVANCED_FEATURES_PASSWORD_HASH;
    }

    async function handleIntimateServiceUnlockTap() {
        if (intimateServiceUnlocked) return;
        const now = performance.now();
        if (intimateServiceLastTap === null || now - intimateServiceLastTap > 1500) resetUnlockTaps();
        intimateServiceLastTap = now;
        clearTimeout(intimateServiceTapTimer);
        intimateServiceTapCount += 1;
        const remaining = 7 - intimateServiceTapCount;
        if (remaining <= 0) {
            resetUnlockTaps();
            const password = await requestAdvancedPassword();
            if (!await verifyAdvancedFeaturesPassword(password)) {
                showUnlockToast(t('ui.advancedPasswordIncorrect'));
                return;
            }
            setIntimateServiceLocked(false);
            showUnlockToast(t('ui.advancedFeaturesEnabled'));
            prepareRepertoryShotFromUrl();
            return;
        }
        if (intimateServiceTapCount >= 5) showUnlockToast(t('ui.advancedUnlockRemaining').replace('{{remaining}}', String(remaining)));
        intimateServiceTapTimer = setTimeout(() => {
            resetUnlockTaps();
            clearTimeout(unlockToastTimer);
            unlockToast.textContent = '';
        }, 1500);
    }

    // Sensitive Lobby controls are opt-in per page load and cannot be
    // activated by stale localStorage state alone.
    clearIntimateService();
    setIntimateServiceLocked(true);
    versionUnlockButton?.addEventListener('click', handleIntimateServiceUnlockTap);
    // Ignore held-key auto-repeat while keeping deliberate keyboard activation.
    versionUnlockButton?.addEventListener('keydown', event => {
        if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
    });
    saveConfigBtn.addEventListener('click', resetUnlockTaps);
    document.addEventListener('visibilitychange', () => { if (document.hidden) resetUnlockTaps(); });
    advancedFeaturesToggle?.addEventListener('change', () => {
        if (advancedFeaturesToggle.checked) return;
        resetUnlockTaps();
        clearIntimateService();
        setIntimateServiceLocked(true);
        updateExperienceModeVisibility();
        updateSessionEstimate();
        updateJourneyRoadmap();
        showUnlockToast(t('ui.advancedFeaturesDisabled'));
    });

    const settingsManagerButton = document.getElementById('open-settings-manager');
    const settingsManagerStatus = document.getElementById('settings-manager-status');
    const showSettingsManagerStatus = (message) => { if (settingsManagerStatus) settingsManagerStatus.textContent = message; };
    settingsManagerButton?.addEventListener('click', () => {
        showSettingsManagerStatus('');
        showScreen(settingsManagerScreen);
    });
    document.getElementById('close-settings-manager')?.addEventListener('click', () => showScreen(configScreen));
    document.getElementById('export-settings')?.addEventListener('click', () => {
        if (!state.advancedFeaturesUnlocked) return;
        const backup = JSON.stringify({
            format: SETTINGS_BACKUP_FORMAT,
            version: SETTINGS_BACKUP_VERSION,
            exportedAt: new Date().toISOString(),
            settings: collectManagedSettings()
        }, null, 2);
        const url = URL.createObjectURL(new Blob([backup], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chakra-meditation-settings.json';
        link.click();
        URL.revokeObjectURL(url);
        showSettingsManagerStatus(t('ui.settingsExported'));
    });
    document.getElementById('import-settings')?.addEventListener('click', async () => {
        const input = document.getElementById('import-settings-file');
        const file = input?.files?.[0];
        if (!file) { showSettingsManagerStatus(t('ui.settingsImportChooseFile')); return; }
        try {
            const settings = parseSettingsBackup(await file.text());
            if (!window.confirm(t('ui.settingsImportConfirm'))) return;
            replaceManagedSettings(settings);
            showSettingsManagerStatus(t('ui.settingsImported'));
            window.location.reload();
        } catch (error) {
            showSettingsManagerStatus(error.message || t('ui.settingsImportInvalid'));
        }
    });

    function isIntimateServiceToggle(target) {
        return intimateServiceToggles.includes(target);
    }

    function isFocusedExperienceToggle(target) {
        return target === yogaExperienceToggle;
    }

    function enforceMasterToggle(target) {
        if (target === musicOnlyToggle && musicOnlyToggle.checked) {
            // Disable other journey features
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences();
            clearJourneyAddons();
            clearIntimateService();
        } else if (target !== musicOnlyToggle && target.checked) {
            // Disable Music Only if any other journey feature is enabled.
            clearMusicOnlyMode();
        }

        if (target === highEnergyToggle && highEnergyToggle.checked) {
            clearMusicOnlyMode();
            clearSleepMode();
            clearFocusedExperiences();
            clearJourneyAddons();
            clearIntimateService();
        }

        const sleepToggle = document.getElementById('sleep-mode-toggle');
        if (target === sleepToggle && sleepToggle.checked) {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearFocusedExperiences();
            clearJourneyAddons();
            clearIntimateService();
        }

        if (isFocusedExperienceToggle(target) && target.checked) {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences(target);
            clearJourneyAddons();
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
            clearIntimateService();
        }

        if (isIntimateServiceToggle(target) && target.checked) {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences();
            clearJourneyAddons();
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

    [boxBreathingExperienceToggle, hooponoponoExperienceToggle].forEach(toggle => {
        toggle?.addEventListener('change', (event) => {
            state.boxBreathingExperienceEnabled = boxBreathingExperienceToggle?.checked === true;
            state.hooponoponoExperienceEnabled = hooponoponoExperienceToggle?.checked === true;
            if (event.target.checked) { clearMusicOnlyMode(); clearHighEnergyMode(); clearSleepMode(); clearFocusedExperiences(); clearIntimateService(); }
            updateExperienceModeVisibility(); updateSessionEstimate();
        });
    });
    dharanaAddonToggle?.addEventListener('change', event => {
        const options = document.getElementById('dharana-options');
        if (options) options.hidden = !event.target.checked;
        if (event.target.checked) { clearMusicOnlyMode(); clearHighEnergyMode(); clearSleepMode(); clearFocusedExperiences(); clearIntimateService(); }
        updateExperienceModeVisibility(); updateSessionEstimate();
    });
    visualizationAddonToggle?.addEventListener('change', event => {
        const options = document.getElementById('visualization-options');
        if (options) options.hidden = !event.target.checked;
        if (event.target.checked) { clearMusicOnlyMode(); clearHighEnergyMode(); clearSleepMode(); clearFocusedExperiences(); clearIntimateService(); }
        updateExperienceModeVisibility(); updateSessionEstimate();
    });
    bodyScanAddonToggle?.addEventListener('change', event => {
        const options = document.getElementById('body-scan-options');
        if (options) options.hidden = !event.target.checked;
        if (event.target.checked) { clearMusicOnlyMode(); clearHighEnergyMode(); clearSleepMode(); clearFocusedExperiences(); clearIntimateService(); }
        updateExperienceModeVisibility(); updateSessionEstimate();
    });
    notingAddonToggle?.addEventListener('change', event => {
        const options = document.getElementById('noting-options');
        if (options) options.hidden = !event.target.checked;
        if (event.target.checked) { clearMusicOnlyMode(); clearHighEnergyMode(); clearSleepMode(); clearFocusedExperiences(); clearIntimateService(); }
        updateExperienceModeVisibility(); updateSessionEstimate();
    });
    undoUnlearnAddonToggle?.addEventListener('change', event => {
        const options = document.getElementById('undo-unlearn-options');
        if (options) options.hidden = !event.target.checked;
        if (event.target.checked) { clearMusicOnlyMode(); clearHighEnergyMode(); clearSleepMode(); clearFocusedExperiences(); clearIntimateService(); }
        updateExperienceModeVisibility(); updateSessionEstimate();
    });
    document.getElementById('visualization-ambience')?.addEventListener('change', event => {
        state.visualizationAmbience = event.target.value === 'space-race' ? 'space-race' : 'silence';
        localStorage.setItem('chakra_visualization_ambience', state.visualizationAmbience);
    });
    document.getElementById('visualization-duration')?.addEventListener('change', updateSessionEstimate);
    document.getElementById('body-scan-duration')?.addEventListener('change', updateSessionEstimate);
    document.getElementById('noting-duration')?.addEventListener('change', updateSessionEstimate);
    document.getElementById('undo-unlearn-duration')?.addEventListener('change', updateSessionEstimate);
    yogaExperienceToggle?.addEventListener('change', event => {
        if (!state.advancedFeaturesUnlocked) {
            yogaExperienceToggle.checked = false;
            state.yogaExperienceEnabled = false;
            if (yogaExperienceSetup) yogaExperienceSetup.hidden = true;
            updateExperienceModeVisibility();
            updateSessionEstimate();
            return;
        }
        state.yogaExperienceEnabled = yogaExperienceToggle.checked;
        enforceMasterToggle(event.target);
    });

    if (sleepModeToggle) {
        sleepModeToggle.addEventListener('change', (e) => {
            if (!state.advancedFeaturesUnlocked) {
                clearSleepMode();
                updateExperienceModeVisibility();
                updateSessionEstimate();
                return;
            }
            state.sleepExperienceEnabled = e.target.checked;
            enforceMasterToggle(e.target);
            updateExperienceModeVisibility();
        });
    }

    if (shotsToggle) {
        shotsToggle.addEventListener('change', (event) => {
            if (!state.advancedFeaturesUnlocked) {
                event.target.checked = false;
                updateExperienceModeVisibility();
                updateSessionEstimate();
                return;
            }
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
                clearJourneyAddons();
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
        // Keep the handoff pending until the shared, session-only unlock.
        if (!state.advancedFeaturesUnlocked) return;
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
        lobbyExperienceVisibility.sync({
            document,
            state,
            getChecked,
            translate: t,
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
        });
    }

    // Initial call
    updateTimingRowVisibility();
    updateExperienceModeVisibility();
    updateSessionEstimate();
    prepareRepertoryShotFromUrl();
    if (isGeneratedIntention(state.intention)) {
        state.intention = state.highEnergyEnabled
            ? hrimDefaultIntention(state.language)
            : defaultIntention(state.language);
        syncValue('intention-input', state.intention);
        localStorage.setItem('chakra_intention', state.intention);
    }

    function updateSessionEstimate() {
        const estimate = sessionEstimate.resolve({
            isChecked: getChecked,
            state,
            readNumber: (id, fallback) => Number(document.getElementById(id)?.value || fallback),
            countYogaPoses: () => document.querySelectorAll('#yoga-pose-selection input:checked').length,
            timing,
            translate: t,
            isDemoScriptSelected,
            sleepStageCount: SLEEP_STAGE_COUNT
        });
        setText('session-estimate', estimate);
        updateJourneyRoadmap();
    }

    // Timing Sliders Listeners
    document.getElementById('time-icebreaker').addEventListener('input', (e) => {
        state.timeIcebreaker = parseInt(e.target.value);
        setText('display-icebreaker', state.timeIcebreaker + 's');
        localStorage.setItem('chakra_time_icebreaker', state.timeIcebreaker);
        updateSessionEstimate();
    });
    document.getElementById('time-emergence').addEventListener('input', (e) => {
        state.timeEmergence = parseInt(e.target.value);
        setText('display-emergence', state.timeEmergence + 's');
        localStorage.setItem('chakra_time_emergence', state.timeEmergence);
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
            if (isDemoScriptSelected()) applyDemoCoreDurationPreset();
            else restorePreDemoCoreDuration();
            updateSessionEstimate();
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
                    const isDemo = applyDemoCoreDurationPreset();
                    if (!isDemo) restorePreDemoCoreDuration();
                    updateSessionEstimate();
                    if (scriptStatus) {
                        scriptStatus.textContent = isDemo ? getDemoScriptTimingMessage() : "Script uploaded successfully!";
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
                const isDemo = applyDemoCoreDurationPreset();
                if (!isDemo) restorePreDemoCoreDuration();
                updateSessionEstimate();
                if (scriptStatus) {
                    scriptStatus.textContent = isDemo ? getDemoScriptTimingMessage() : "Script loaded from URL successfully!";
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
            audio.stopGuidedTransitionTone();
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
        if (!state.advancedFeaturesUnlocked || state.noFrequencyMode) {
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
            document.getElementById('app').style.setProperty('--app-brightness', String(state.brightness));
        });
    }

    let bypassLobbyVideoPreludeOnce = false;

    function validateLobbyStartBeforePrelude() {
        // The optional cinematic prelude must never delay a basic start
        // validation. A standard journey has no meaningful continuation
        // without a selected chakra, so tell the meditator before video
        // buffering or playback begins.
        const route = journeyRouting.resolveLaunchRoute({
            shotsSelected: getChecked('shots-toggle'),
            backgroundMusicMode: state.bgMusicMode,
            sleepSelected: getChecked('sleep-mode-toggle')
        });
        const validation = journeyRouting.validateLobbyStart({
            route,
            highEnergySelected: getChecked('high-energy-toggle'),
            focusedExperience: meditation.getFocusedExperience(),
            selectedChakraCount: state.selectedChakras.length
        });
        if (!validation.valid) {
            alert("Please select at least one chakra before beginning the journey.");
            return false;
        }
        return true;
    }

    startMeditationBtn.addEventListener('click', async () => {
        if (!validateLobbyStartBeforePrelude()) return;
        if (state.journeyVideoPreludeEnabled && !bypassLobbyVideoPreludeOnce) {
            startMeditationBtn.disabled = true;
            startMeditationBtn.style.opacity = '0.5';
            const preludeResult = await journeyVideoPrelude.play();
            if (preludeResult === 'ended') meditation.acknowledgeDndReminder();
            startMeditationBtn.disabled = false;
            startMeditationBtn.style.opacity = '1';
            // The video either completed or was unavailable. In both cases,
            // continue through the normal dispatcher exactly once.
            bypassLobbyVideoPreludeOnce = true;
            startMeditationBtn.click();
            return;
        }
        bypassLobbyVideoPreludeOnce = false;
        const launchRoute = journeyRouting.resolveLaunchRoute({
            shotsSelected: getChecked('shots-toggle'),
            backgroundMusicMode: state.bgMusicMode,
            sleepSelected: getChecked('sleep-mode-toggle')
        });
        if (launchRoute === 'shot') {
            const shotType = document.getElementById('shot-type-select')?.value || 'meditation';
            const customFrequency = Number(document.getElementById('shot-frequency-input')?.value);
            if (!audio.isInitialized) await audio.init();
            meditation.runShot(shotType, customFrequency);
            return;
        }
        if (getChecked('sleep-mode-toggle') && !state.advancedFeaturesUnlocked) {
            clearSleepMode();
            updateExperienceModeVisibility();
            updateSessionEstimate();
            return;
        }
        if (getChecked('yoga-experience-toggle') && !state.advancedFeaturesUnlocked) {
            syncChecked('yoga-experience-toggle', false);
            state.yogaExperienceEnabled = false;
            updateExperienceModeVisibility();
            updateSessionEstimate();
            return;
        }
        state.sleepMode = getChecked('sleep-mode-toggle');
        // This class is derived from the current selection, never left behind
        // by an earlier Sleep session.
        document.body.classList.toggle('sleep-mode-active', state.sleepMode);
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

        if (launchRoute === 'music') {
            if (state.eyesCloseMode) {
                const app = document.getElementById('app');
                const targetOpacity = Math.min(state.brightness, 0.7);
                if (app) app.style.setProperty('--app-brightness', String(targetOpacity));
            }
            await meditation.runBackgroundMusicOnly();
        } else if (launchRoute === 'sleep') {
            document.body.classList.add('sleep-mode-active');
            meditation.runSleepJourney().catch(err => {
                console.error('Failed to start Sleep Mode:', err);
                alert('Failed to start Sleep Mode. Check console.');
                meditation.stop();
            });
        } else {
            const order = journeyRouting.buildChakraOrder({
                focusedExperience,
                massageSelected: getChecked('massage-toggle'),
                selectedChakras: state.selectedChakras
            });
            const isHighEnergy = getChecked('high-energy-toggle');
            if (!focusedExperience && !isHighEnergy && order.length === 0) {
                alert("Please select at least one chakra before beginning the journey.");
                return;
            }
            meditation.chakraOrder = order;
            // Absolute Grounding: Dim UI for Eyes Closed mode
            if (state.eyesCloseMode) {
                const app = document.getElementById('app');
                const targetOpacity = Math.min(state.brightness, 0.7);
                if (app) app.style.setProperty('--app-brightness', String(targetOpacity));
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
    const journeyVideoPreludeToggle = document.getElementById('journey-video-prelude-toggle');
    if (journeyVideoPreludeToggle) {
        journeyVideoPreludeToggle.addEventListener('change', (e) => {
            state.journeyVideoPreludeEnabled = e.target.checked;
            localStorage.setItem('chakra_journey_video_prelude', String(state.journeyVideoPreludeEnabled));
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
        meditation.stop({ preserveScreen: true });
        // A journey may still be unwinding its async start sequence. Wait for
        // the cancellation to release the start guard before launching again.
        const deadline = Date.now() + 5000;
        while (meditation.isStarting && Date.now() < deadline) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        // Restart is immediate. The Lobby toggle controls whether the next
        // newly started journey includes the optional video introduction.
        bypassLobbyVideoPreludeOnce = true;
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
    const volVideoEls = [document.getElementById('settings-vol-video')].filter(Boolean);
    volVideoEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volVideo', e.target.value, volVideoEls);
        audio.setJourneyVideoPreludeVolume(state.volVideo);
    }));
    const volVisualizationEls = [document.getElementById('settings-vol-visualization'), document.getElementById('vol-visualization')].filter(Boolean);
    volVisualizationEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volVisualizationAmbience', e.target.value, volVisualizationEls);
        audio.setVisualizationAmbienceVolume(state.volVisualizationAmbience);
    }));
    document.getElementById('preview-video-audio')?.addEventListener('click', () => { void journeyVideoPrelude.previewAudio(); });
    document.getElementById('preview-visualization-ambience')?.addEventListener('click', () => { void audio.previewVisualizationAmbience(); });
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
