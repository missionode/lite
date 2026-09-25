import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/session-estimate.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const sessionEstimate = window\.ChakraSessionEstimate/);
assert.match(app, /function updateSessionEstimate\(\)\s*\{[\s\S]*?sessionEstimate\.resolve\([\s\S]*?updateJourneyRoadmap\(\);\s*\}/);
assert.match(html, /modules\/session-estimate\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.00/);
assert.match(serviceWorker, /chakra-v5\.296[\s\S]*?modules\/session-estimate\.js\?v=1\.0/);
assert.match(app, /getSessionDurationMs\(focusedExperience = null\)\s*\{\s*return window\.ChakraSessionEstimate\.resolveDurationMs\(/);

const context = vm.createContext({});
vm.runInContext(source, context);
const estimate = context.ChakraSessionEstimate;
assert.ok(Object.isFrozen(estimate));

function makeDuration({ experience = null, checks = [], overrides = {}, scripts = {}, poses = 0, measured = 30, highEnergy = false, demo = false } = {}) {
    const selectedChecks = new Set(checks);
    const state = {
        bgMusicMode: false, sleepMode: false, timeBreathing: 30, timeYogaPrep: 60,
        timeYogaPose: 30, timeCorpse: 30, timeBath: 60, corpsePoseEnabled: false,
        bathSessionEnabled: false, perinealCareEnabled: false, massageEnabled: false,
        assistedBathingEnabled: false, timePerinealCare: 120, timeAssistedBathing: 60,
        timePerChakra: 10, timeIcebreaker: 60, timeEmergence: 120, timeSleepStage: 8,
        timeHighEnergy: 12, ...overrides
    };
    const timingValues = {
        'estimate.boxBreathingOverhead': 1, 'estimate.yogaPoseTransitionEstimate': 10,
        'estimate.chakraStageOverhead': 0, 'estimate.baseOverhead': 0,
        'estimate.normalExtra': 0, 'estimate.hypnosisTransitionToneSeconds': 15,
        'estimate.hypnosisNarrationSeconds': 40, 'estimate.highEnergyExtra': 2,
        'transitions.bathToYogaRest': 20
    };
    return estimate.resolveDurationMs({
        focusedExperience: experience, state, timing: (section, key) => timingValues[`${section}.${key}`] || 0,
        sleepStageCount: 5, scripts, isHighEnergy: highEnergy, isDemoScriptSelected: () => demo,
        isChecked: id => selectedChecks.has(id), readNumber: (id, fallback) => Number(overrides[id] ?? fallback),
        countYogaPoses: () => poses, estimateStandardJourneySeconds: () => highEnergy ? null : measured, chakraCount: 7
    });
}

assert.equal(makeDuration({ overrides: { bgMusicMode: true }, experience: 'preparation' }), 0, 'Music Only keeps no countdown.');
assert.equal(makeDuration({ experience: 'box' }), 540000, 'Focused Box duration includes configured Box overhead.');
assert.equal(makeDuration({ experience: 'hooponopono' }), 240000, 'Focused Ho’oponopono remains four minutes.');
assert.equal(makeDuration({ experience: 'preparation', checks: [
    'box-breathing-experience-toggle', 'visualization-addon-toggle', 'dharana-addon-toggle',
    'body-scan-addon-toggle', 'noting-addon-toggle', 'hooponopono-experience-toggle', 'undo-unlearn-addon-toggle'
], overrides: { 'visualization-duration': 3, 'dharana-duration': 2, 'body-scan-duration': 5, 'noting-duration': 4, 'undo-unlearn-duration': 6 } }),
1980000, 'Combined preparation includes each selected duration and existing Box, Ho’oponopono and Undo & Unlearn values.');
assert.equal(makeDuration({ experience: 'preparation' }), 1000, 'Empty preparation retains the one-second floor.');
assert.equal(makeDuration({ experience: 'yoga', poses: 2, overrides: { corpsePoseEnabled: true, bathSessionEnabled: true } }), 250000,
    'Yoga includes selected poses, transitions, optional Corpse Pose and Bath.');
assert.equal(makeDuration({ experience: 'intimate', overrides: { perinealCareEnabled: true, assistedBathingEnabled: true } }), 180000,
    'Intimate-care stage durations remain additive.');
assert.equal(makeDuration({ experience: 'intimate', overrides: { massageEnabled: true } }), 4260000,
    'Massage duration retains its seven-chakra formula.');
assert.equal(makeDuration({ overrides: { sleepMode: true }, scripts: { sleep_mode: { intervalSeconds: 5 } } }), 2432000,
    'Sleep includes five stages, four configured intervals and its final twelve seconds.');
assert.equal(makeDuration({ measured: 47 }), 47000, 'The measured standard-script duration remains first choice.');
assert.equal(makeDuration({ highEnergy: true }), 900000, 'HRIM fallback retains its selected-duration formula.');
assert.equal(makeDuration({ demo: true, measured: null }), 4260000, 'Demo fallback omits the optional hypnosis wrapper.');
assert.equal(makeDuration({ measured: null }), 4440000, 'Normal fallback includes the configured hypnosis wrapper.');
assert.throws(() => estimate.resolveDurationMs({}), /requires mode, timing/);

function makeStandardJourney({ checks = [], selected = ['root', 'heart'], overrides = {} } = {}) {
    const selectedChecks = new Set(checks);
    const scripts = {
        intro: { moon: { full: 'opening' }, gratitude: 'gratitude' },
        closing: { meditation: 'closing', affirmation: 'closing affirmation' },
        root: { meditation: 'root mantra', affirmation: 'root affirmation' },
        heart: { meditation: 'heart mantra', affirmation: 'heart affirmation' }
    };
    const state = {
        timeIcebreaker: 10, timePerChakra: 2, timeInterval: 20, timeEmergence: 15,
        timeBreathing: 3, droneDurationMode: 'shared', noFrequencyMode: true,
        returningJourney: false, language: 'en', intention: '', ...overrides
    };
    return estimate.estimateStandardJourneySeconds({
        scripts, isHighEnergy: false, isDemoScriptSelected: () => false,
        estimateNarrationDurationSeconds: text => text.length,
        timing: (section, key) => ({
            'transitions.initialSettle': 2, 'transitions.arrivalToneLeadGap': 1,
            'transitions.arrivalToneExitGap': 2, 'transitions.openingPause': 3,
            'transitions.arrivalReadinessGap': 2, 'transitions.postBreathing': 4,
            'transitions.chakraLeadOut': 5, 'transitions.chakraPostMantra': 1,
            'transitions.intervalPreparation': 2, 'transitions.finalSilence': 3,
            'transitions.closingFirstPause': 1, 'transitions.closingSecondPause': 1,
            'transitions.emergenceBellSettle': 2, 'transitions.emergenceFinalQuiet': 2,
            'narration.exitGap': 1
        }[`${section}.${key}`] ?? 0),
        getDroneDurationMs: () => 1000, state,
        chakraOrder: selected,
        localized: (item, key) => typeof item === 'string' ? item : item?.[key] || item?.moon?.full,
        contentT: key => ({
            'system.intention': 'Intention: {{intention}}', 'system.prePracticeSafety': 'safety',
            'system.breatheInterval': 'interval'
        }[key]),
        getMoonPhase: () => 'full', defaultIntention: () => 'calm',
        isChecked: id => selectedChecks.has(id), readNumber: (id, fallback) => Number(overrides[id] ?? fallback),
        getJourneySystemNarration: key => ({ arrivalInduction: 'arrival', arrivalReadiness: 'readiness', emergence: 'emergence' }[key])
    });
}

assert.equal(estimate.estimateStandardJourneySeconds({ scripts: null }), null, 'Missing scripts retain the no-estimate path.');
assert.equal(makeStandardJourney({ selected: [] }), null, 'No selected chakra retains the no-estimate path.');
const standardSeconds = makeStandardJourney();
assert.ok(Number.isInteger(standardSeconds) && standardSeconds > 0, 'A standard journey returns a rounded positive duration.');
assert.equal(makeStandardJourney({ checks: ['box-breathing-experience-toggle'] }) - standardSeconds, 48,
    'Box Breathing adds its configured four-cycle duration.');
assert.equal(makeStandardJourney({ checks: ['visualization-addon-toggle'], overrides: { 'visualization-duration': 3 } }) - standardSeconds, 180,
    'Visualization adds its selected duration.');
assert.equal(makeStandardJourney({ selected: ['root'] }) < standardSeconds, true, 'Only selected chakras are included.');
assert.throws(() => estimate.estimateStandardJourneySeconds({ scripts: {}, isHighEnergy: false, isDemoScriptSelected: () => false }), /requires script, timing/);

function make({ checks = [], numbers = {}, state = {}, poseCount = 0, demo = false } = {}) {
    const checked = new Set(checks);
    return estimate.resolve({
        isChecked: id => checked.has(id),
        state: {
            timeShot: 4, timeBreathing: 30, timePerinealCare: 120, timeAssistedBathing: 60,
            timePerChakra: 10, timeIcebreaker: 60, timeYogaPrep: 60, timeYogaPose: 30,
            timeCorpse: 30, timeBath: 60, timeSleepStage: 8, timeHighEnergy: 12,
            timeEmergence: 0, selectedChakras: [{}, {}, {}], ...state
        },
        readNumber: (id, fallback) => Number(numbers[id] ?? fallback),
        countYogaPoses: () => poseCount,
        timing: (section, key) => ({
            'estimate.chakraStageOverhead': 0, 'estimate.baseOverhead': 0, 'estimate.normalExtra': 0,
            'estimate.hypnosisTransitionToneSeconds': 0, 'estimate.hypnosisNarrationSeconds': 0,
            'estimate.yogaPoseTransitionEstimate': 10, 'estimate.highEnergyExtra': 2,
            'transitions.bathToYogaRest': 20
        }[`${section}.${key}`] ?? 0),
        translate: key => ({
            'ui.boxBreathingExperience': 'Box Breathing', 'ui.hooponoponoExperience': 'Ho’oponopono',
            'ui.undoUnlearnAddon': 'Undo & Unlearn', 'ui.visualizationAddon': 'Visualization',
            'ui.bodyScanAddon': 'Body Scan', 'ui.notingAddon': 'Guided Noting',
            'ui.intimateService': 'Intimate Service', 'ui.yogaExperience': 'Yoga Experience'
        }[key] || key),
        isDemoScriptSelected: () => demo,
        sleepStageCount: 5
    });
}

assert.equal(make({ checks: ['shots-toggle', 'music-only-toggle'] }), '~ 4 sec frequency shot', 'Shots retain first priority');
assert.equal(make({ checks: ['music-only-toggle', 'box-breathing-experience-toggle'] }), 'Music only — stop anytime');
assert.equal(make({ checks: ['box-breathing-experience-toggle'] }), '~ 8 min box breathing');
assert.equal(make({ checks: ['hooponopono-experience-toggle'] }), '~ 4 min ho’oponopono');
assert.equal(make({ checks: ['undo-unlearn-addon-toggle'], numbers: { 'undo-unlearn-duration': 6 } }), '~ 6 min undo & unlearn');
assert.equal(make({ checks: ['visualization-addon-toggle'] }), '~ 2 min visualization');
assert.equal(make({ checks: ['body-scan-addon-toggle'] }), '~ 5 min body scan');
assert.equal(make({ checks: ['noting-addon-toggle'] }), '~ 4 min guided noting');
assert.equal(make({ checks: ['perineal-care-toggle', 'assisted-bathing-toggle'] }), '~ 3 min intimate service');
assert.equal(make({ checks: ['massage-toggle'] }), '~ 71 min intimate service');
assert.equal(make({ checks: ['yoga-experience-toggle', 'corpse-pose-toggle', 'bath-session-toggle'], poseCount: 5 }), '~ 7 min yoga experience');
assert.equal(make({ checks: ['sleep-mode-toggle'] }), '~ 40 min sleep journey');
assert.equal(make({ checks: ['high-energy-toggle'] }), '~ 15 min session');
assert.equal(make({ demo: true }), '~ 31 min session', 'Demo scripts omit the default hypnosis wrapper estimate');
assert.throws(() => estimate.resolve({}), /requires current mode/);

console.log('Session estimate contract passed: display priority, exact focused and fallback durations, selected add-ons, Yoga/Sleep/HRIM, and narration-based standard timing.');
