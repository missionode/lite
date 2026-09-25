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
const audioSignalDesign = window.ChakraAudioSignalDesign;
if (!audioSignalDesign) throw new Error('Audio signal design module is unavailable.');
const audioSpatialGeometry = window.ChakraAudioSpatialGeometry;
if (!audioSpatialGeometry) throw new Error('Audio spatial geometry module is unavailable.');
const audioElementalLayer = window.ChakraAudioElementalLayer;
if (!audioElementalLayer) throw new Error('Audio elemental-layer module is unavailable.');
const audioTonePlayback = window.ChakraAudioTonePlayback;
if (!audioTonePlayback) throw new Error('Audio tone-playback module is unavailable.');
const audioDroneStart = window.ChakraAudioDroneStart;
if (!audioDroneStart) throw new Error('Audio drone-start module is unavailable.');
const audioDroneStop = window.ChakraAudioDroneStop;
if (!audioDroneStop) throw new Error('Audio drone-stop module is unavailable.');
const audioMantraPlayback = window.ChakraAudioMantraPlayback;
if (!audioMantraPlayback) throw new Error('Audio mantra-playback module is unavailable.');
const audioBackgroundMusicLifecycle = window.ChakraAudioBackgroundMusicLifecycle;
if (!audioBackgroundMusicLifecycle) throw new Error('Audio background-music lifecycle module is unavailable.');
const audioBackgroundMusicControls = window.ChakraAudioBackgroundMusicControls;
if (!audioBackgroundMusicControls) throw new Error('Audio background-music controls module is unavailable.');
const audioMusicEcho = window.ChakraAudioMusicEcho;
if (!audioMusicEcho) throw new Error('Audio music-echo module is unavailable.');
const journeyHypnosisWrapper = window.ChakraJourneyHypnosisWrapper;
if (!journeyHypnosisWrapper) throw new Error('Journey hypnosis-wrapper module is unavailable.');
const journeyOpeningStage = window.ChakraJourneyOpeningStage;
if (!journeyOpeningStage) throw new Error('Journey opening-stage module is unavailable.');
const journeyContentLoader = window.ChakraJourneyContentLoader;
if (!journeyContentLoader) throw new Error('Journey content-loader module is unavailable.');
const journeyRouting = window.ChakraJourneyRouting;
const practiceModuleLoader = window.ChakraPracticeModuleLoader;
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
const journeySelectionHydration = window.ChakraJourneySelectionHydration;
const timingPreferenceHydration = window.ChakraTimingPreferenceHydration;
const appearancePreferenceHydration = window.ChakraAppearancePreferenceHydration;
const scriptPreferenceHydration = window.ChakraScriptPreferenceHydration;
const carePreferenceHydration = window.ChakraCarePreferenceHydration;
if (!journeyRouting) throw new Error('Journey routing module is unavailable.');
if (!practiceModuleLoader) throw new Error('Guided practice module loader is unavailable.');
if (!journeyVoiceProfile) throw new Error('Journey voice profile module is unavailable.');
if (!sessionModeHydration) throw new Error('Session mode hydration module is unavailable.');
if (!mixerPreferenceHydration) throw new Error('Mixer preference hydration module is unavailable.');
if (!journeySelectionHydration) throw new Error('Journey selection hydration module is unavailable.');
if (!timingPreferenceHydration) throw new Error('Timing preference hydration module is unavailable.');
if (!appearancePreferenceHydration) throw new Error('Appearance preference hydration module is unavailable.');
if (!scriptPreferenceHydration) throw new Error('Script preference hydration module is unavailable.');
if (!carePreferenceHydration) throw new Error('Care preference hydration module is unavailable.');
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

const newcomerMarkerStage = document.querySelector('.newcomer-body-map-stage');
const newcomerMarkerLayout = new window.ChakraNewcomerMarkerLayout({
    stage: newcomerMarkerStage,
    svg: document.getElementById('newcomer-marker-connectors')
});

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
        return window.ChakraAudioEngineInitialization.initialize(this, {
            audioWindow: window,
            state,
            VOICE_REVERB_TAIL_SECONDS,
            VOICE_REVERB_TAIL_DECAY,
            MUSIC_REVERB_TAIL_SECONDS,
            MUSIC_REVERB_TAIL_DECAY,
            MANTRA_REVERB_TAIL_SECONDS,
            MANTRA_REVERB_TAIL_DECAY,
            MANTRA_REVERB_TAIL_WET,
            PLEASURE_AMBIENCE_HARMONIC_MIX,
            getPleasureBlurMix
        });
    }

    createSpatialPanner() {
        return audioSpatialGeometry.createPanner(this.ctx);
    }

    setSpatialPosition(node, position, now) {
        return audioSpatialGeometry.setPosition(node, position, now);
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
        return audioMusicEcho.setMusicEcho(this, mode, MUSIC_REVERB_TAIL_SECONDS);
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
        return audioSignalDesign.makeDistortionCurve(amount);
    }

    createImpulseResponse(duration, decay) {
        return audioSignalDesign.createImpulseResponse(this.ctx, duration, decay);
    }

    createDiffuseReverbImpulse(duration, decay, seed) {
        return audioSignalDesign.createDiffuseReverbImpulse(this.ctx, duration, decay, seed);
    }

    createNoiseBuffer() {
        if (this._cachedNoise) return this._cachedNoise;
        this._cachedNoise = audioSignalDesign.createNoiseBuffer(this.ctx);
        return this._cachedNoise;
    }

    startElementalLayer(index) {
        return audioElementalLayer.start(this, index);
    }

    startDrone(baseFreq, index = 0) {
        return audioDroneStart.startDrone(this, baseFreq, index, state);
    }

    startSleepDrone(beatFrequency) {
        return audioDroneStart.startSleepDrone(this, beatFrequency, state);
    }

    startFrequencyShot(frequency) {
        return audioTonePlayback.startShot(this, frequency, state);
    }

    startGuidedTransitionTone(frequency, durationMs) {
        return audioTonePlayback.startTransitionTone(this, frequency, durationMs, state);
    }

    stopGuidedTransitionTone(fadeSeconds = 1) {
        return audioTonePlayback.stopTransitionTone(this, fadeSeconds);
    }

    stopFrequencyShot() {
        return audioTonePlayback.stopShot(this);
    }

    stopBinaural() {
        return audioDroneStop.stopBinaural(this);
    }

    stopDrone() {
        return audioDroneStop.stopDrone(this);
    }

    async playMantraTrack(key) {
        return audioMantraPlayback.play(this, key, {
            state,
            mantraAudioMap: MANTRA_AUDIO_MAP,
            SeamlessLoop,
            musicFadeSeconds: MANTRA_MUSIC_FADE_SECONDS,
            tailWet: MANTRA_REVERB_TAIL_WET
        });
    }

    stopMantraTrack({ restoreMusic = true, invalidate = true, stageWindow = null } = {}) {
        return audioMantraPlayback.stop(this, { restoreMusic, invalidate, stageWindow }, {
            state,
            fadeSeconds: MANTRA_FADE_SECONDS,
            tailSeconds: MANTRA_REVERB_TAIL_SECONDS
        });
    }

    async startBackgroundMusic() {
        return audioBackgroundMusicLifecycle.start(this, {
            state,
            SeamlessLoop,
            url: BACKGROUND_MUSIC_URL,
            entryFadeSeconds: BACKGROUND_MUSIC_ENTRY_FADE_SECONDS,
            stopFadeSeconds: BACKGROUND_MUSIC_STOP_FADE_SECONDS
        });
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
        return audioBackgroundMusicControls.fadeIn(this, duration, isDucked, state);
    }

    fadeOutBackgroundMusic(duration = 4) {
        return audioBackgroundMusicControls.fadeOut(this, duration);
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
        return audioBackgroundMusicControls.setVolume(this, level, previousLevel);
    }

    cancelBackgroundMusicRestore() {
        return audioBackgroundMusicControls.cancelRestore(this);
    }

    muteBackgroundMusicForMantra(duration = MANTRA_MUSIC_FADE_SECONDS) {
        return audioBackgroundMusicControls.muteForMantra(this, duration);
    }

    restoreBackgroundMusicAfterMantra(duration = BACKGROUND_MUSIC_RESTORE_FADE_SECONDS) {
        return audioBackgroundMusicControls.restoreAfterMantra(this, duration);
    }

    stopBackgroundMusic(fadeTime = BACKGROUND_MUSIC_STOP_FADE_SECONDS) {
        return audioBackgroundMusicLifecycle.stop(this, fadeTime, MUSIC_REVERB_TAIL_SECONDS);
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
        this.sessionCountdown = new window.ChakraSessionCountdown({
            now: () => Date.now(),
            setIntervalFn: (callback, delay) => window.setInterval(callback, delay),
            clearIntervalFn: timer => window.clearInterval(timer),
            isActive: () => this.isMeditationActive,
            isPaused: () => this.isPaused,
            render: (remainingMs, totalMs) => setSessionCountdown(remainingMs, totalMs),
            hide: () => hideSessionCountdown()
        });
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
        return window.ChakraSessionEstimate.estimateStandardJourneySeconds({
            scripts: this.scripts,
            isHighEnergy: this.isHighEnergy,
            isDemoScriptSelected,
            estimateNarrationDurationSeconds,
            timing,
            getDroneDurationMs,
            state,
            chakraOrder: this.chakraOrder,
            localized,
            contentT,
            getMoonPhase,
            defaultIntention,
            isChecked: getChecked,
            readNumber: (id, fallback) => Number(document.getElementById(id)?.value || fallback),
            getJourneySystemNarration: key => this.getJourneySystemNarration(key)
        });
    }

    getSessionDurationMs(focusedExperience = null) {
        return window.ChakraSessionEstimate.resolveDurationMs({
            focusedExperience,
            state,
            timing,
            sleepStageCount: SLEEP_STAGE_COUNT,
            scripts: this.scripts,
            isHighEnergy: this.isHighEnergy,
            isDemoScriptSelected,
            isChecked: getChecked,
            readNumber: (id, fallback) => Number(document.getElementById(id)?.value || fallback),
            countYogaPoses: () => document.querySelectorAll('#yoga-pose-selection input:checked').length,
            estimateStandardJourneySeconds: () => this.estimateStandardJourneySeconds(),
            chakraCount: this.chakraOrder.length
        });
    }

    startSessionCountdown(totalMs) {
        this.sessionCountdown.start(totalMs);
    }

    renderSessionCountdown() {
        this.sessionCountdown.render();
    }

    stopSessionCountdown() {
        this.sessionCountdown.stop();
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
        return journeyHypnosisWrapper.shouldRun(this);
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
        return journeyHypnosisWrapper.runGuidedTransitionTone(this, frequency, durationMs, { beforeGap, afterGap }, { state });
    }

    async runArrivalInduction() {
        return journeyHypnosisWrapper.runArrivalInduction(this, { state, getDroneDurationMs, timing });
    }

    async runArrivalReadiness() {
        return journeyHypnosisWrapper.runArrivalReadiness(this, { state, getDroneDurationMs, timing });
    }

    async runEmergence() {
        return journeyHypnosisWrapper.runEmergence(this, { state, timing, withAudioStageFade, setMantraDisplay: value => setText('mantra-display', value) });
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
        newcomerMarkerLayout.schedule();
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
            
            // Keep content source selection, validation timing and session-state
            // snapshot aligned with the existing start sequence.
            const loadedContent = await journeyContentLoader.loadAndValidate({
                scripts: this.scripts,
                scriptsLanguage: this.scriptsLanguage,
                language: state.language,
                scriptSource: state.scriptSource,
                customScript: state.customScript,
                getContentSource: () => getLanguageConfig().contentSource || 'scripts.json',
                onResolved: (scripts, language) => {
                    this.scripts = scripts;
                    this.scriptsLanguage = language;
                },
                validate: validateScriptBundle,
                getValidationContext: () => {
                    const focusedExperience = this.getFocusedExperience();
                    return {
                        value: focusedExperience,
                        options: {
                            allowLanguageFallback: state.scriptSource === 'custom',
                            highEnergy: getChecked('high-energy-toggle'),
                            corpse: focusedExperience === 'yoga' && state.corpsePoseEnabled,
                            bath: focusedExperience === 'yoga' && state.bathSessionEnabled,
                            perinealCare: focusedExperience === 'intimate' && state.perinealCareEnabled,
                            assistedBathing: focusedExperience === 'intimate' && state.assistedBathingEnabled,
                            massage: false,
                            yoga: focusedExperience === 'yoga',
                            hooponopono: getChecked('hooponopono-experience-toggle')
                        }
                    };
                }
            });
            const focusedExperience = loadedContent.context;

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
        return journeyOpeningStage.run(this, isHighEnergy, {
            document, showScreen, journeyT, contentT, state, getMoonPhase, localized, defaultIntention, timing
        });
    }

    async runDharana() {
        const dharanaPractice = await practiceModuleLoader.load('dharana');
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
        const bodyScanPractice = await practiceModuleLoader.load('body-scan');
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
        const guidedNotingPractice = await practiceModuleLoader.load('guided-noting');
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
        const visualizationPractice = await practiceModuleLoader.load('visualization');
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
        const boxBreathingPractice = await practiceModuleLoader.load('box-breathing');
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
        const hooponoponoPractice = await practiceModuleLoader.load('hooponopono');
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
        const undoUnlearnPractice = await practiceModuleLoader.load('undo-unlearn');
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
const journeyChrome = new window.ChakraJourneyChrome();
const particleField = new window.AmbientParticleField();
const visual = new window.VisualEngine(audio);
let journeyVideoPrelude = null;
let journeyVideoPreludeLoadPromise = null;
function loadJourneyVideoPrelude() {
    if (journeyVideoPrelude) return Promise.resolve(journeyVideoPrelude);
    if (journeyVideoPreludeLoadPromise) return journeyVideoPreludeLoadPromise;
    const script = document.createElement('script');
    script.async = true;
    script.src = new URL('./modules/journey-video-prelude.js?v=1.0', document.baseURI).href;
    journeyVideoPreludeLoadPromise = new Promise((resolve, reject) => {
        script.onload = () => {
            const Prelude = window.ChakraJourneyVideoPrelude;
            if (typeof Prelude !== 'function') {
                reject(new Error('Journey video introduction module did not register.'));
                return;
            }
            journeyVideoPrelude = new Prelude(audio);
            resolve(journeyVideoPrelude);
        };
        script.onerror = () => reject(new Error('Journey video introduction module failed to load.'));
        document.head.appendChild(script);
    }).catch(error => {
        script.remove();
        journeyVideoPreludeLoadPromise = null;
        throw error;
    });
    return journeyVideoPreludeLoadPromise;
}
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
    
    timingPreferenceHydration.hydrateCore({ state, document, setText });
    syncDroneDurationModeControls();
    updateDroneDurationSummary();
    
    mixerPreferenceHydration.hydrate({ state, syncValue });

    setText('stat-journeys', state.stats.journeys);
    setText('stat-time', state.stats.time);
    journeySelectionHydration.hydrate({ state, document, syncValue, syncChecked, defaultIntention });
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
    carePreferenceHydration.hydrate({ state, syncChecked });
    const yogaSubOptions = document.getElementById('yoga-sub-options');
    if (yogaSubOptions) yogaSubOptions.style.display = 'flex';

    const deityRadios = document.getElementsByName('deity-path');
    setTimeout(() => {
        deityRadios.forEach(r => {
            r.checked = (r.value === state.deityPath);
        });
    }, 0);
    appearancePreferenceHydration.hydrateEffect({ state, syncValue, applyImageEffect: () => visual.applyImageEffect() });

    timingPreferenceHydration.hydrateJourney({ state, syncValue, setText });
    
    appearancePreferenceHydration.hydrateBrightness({ state, syncValue, document });

    scriptPreferenceHydration.hydrate({
        state,
        syncValue,
        document,
        isDemoScriptSelected,
        getDemoScriptTimingMessage
    });

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

    window.ChakraSettingsManagerView.bind({
        document,
        window,
        configScreen,
        settingsManagerScreen,
        showScreen,
        advancedFeaturesUnlocked: () => state.advancedFeaturesUnlocked,
        backup: window.ChakraSettingsBackup,
        t
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

    function selectedPracticeModuleIds() {
        return [
            ['body-scan-addon-toggle', 'body-scan'],
            ['noting-addon-toggle', 'guided-noting'],
            ['dharana-addon-toggle', 'dharana'],
            ['box-breathing-experience-toggle', 'box-breathing'],
            ['visualization-addon-toggle', 'visualization'],
            ['hooponopono-experience-toggle', 'hooponopono'],
            ['undo-unlearn-addon-toggle', 'undo-unlearn']
        ].filter(([toggleId]) => getChecked(toggleId)).map(([, moduleId]) => moduleId);
    }

    startMeditationBtn.addEventListener('click', async () => {
        if (!validateLobbyStartBeforePrelude()) return;
        if (startMeditationBtn.dataset.practiceLoading === 'true') return;
        const selectedModules = selectedPracticeModuleIds();
        if (selectedModules.length) {
            startMeditationBtn.dataset.practiceLoading = 'true';
            startMeditationBtn.disabled = true;
            try {
                await practiceModuleLoader.loadMany(selectedModules);
            } catch (error) {
                console.error('Selected guided practice could not load:', error);
                alert(journeyT('ui.practiceLoadFailed'));
                return;
            } finally {
                delete startMeditationBtn.dataset.practiceLoading;
                startMeditationBtn.disabled = false;
            }
        }
        if (state.journeyVideoPreludeEnabled && !bypassLobbyVideoPreludeOnce) {
            startMeditationBtn.disabled = true;
            startMeditationBtn.style.opacity = '0.5';
            let preludeResult = 'unavailable';
            try {
                const prelude = await loadJourneyVideoPrelude();
                preludeResult = await prelude.play();
            } catch (error) {
                console.warn('Journey video introduction unavailable:', error);
            }
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

    window.ChakraAudioVolumeSettingsView.bind({ document, state, storage: localStorage, audio });
    document.getElementById('preview-video-audio')?.addEventListener('click', () => {
        void loadJourneyVideoPrelude()
            .then(prelude => prelude.previewAudio())
            .catch(error => console.warn('Video audio preview unavailable:', error));
    });
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
