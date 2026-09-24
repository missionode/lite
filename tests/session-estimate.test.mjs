import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/session-estimate.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const sessionEstimate = window\.ChakraSessionEstimate/);
assert.match(app, /function updateSessionEstimate\(\)\s*\{[\s\S]*?sessionEstimate\.resolve\([\s\S]*?updateJourneyRoadmap\(\);\s*\}/);
assert.match(html, /modules\/session-estimate\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.81/);
assert.match(serviceWorker, /chakra-v5\.276[\s\S]*?modules\/session-estimate\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const estimate = context.ChakraSessionEstimate;
assert.ok(Object.isFrozen(estimate));

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

console.log('Session estimate contract passed: exclusive priority, every focused route, standard add-ons, Yoga/Sleep/HRIM and demo timing.');
