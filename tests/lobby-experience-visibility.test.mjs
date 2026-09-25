import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/lobby-experience-visibility.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const lobbyExperienceVisibility = window\.ChakraLobbyExperienceVisibility/);
assert.match(app, /function updateExperienceModeVisibility\(\)\s*\{\s*lobbyExperienceVisibility\.sync\(/);
assert.match(html, /modules\/lobby-experience-visibility\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.95/);
assert.match(serviceWorker, /chakra-v5\.291[\s\S]*?modules\/lobby-experience-visibility\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const visibility = context.ChakraLobbyExperienceVisibility;
assert.ok(Object.isFrozen(visibility));

const ids = [
    'dharana-options', 'visualization-options', 'body-scan-options', 'noting-options', 'undo-unlearn-options',
    'high-energy-duration-control', 'drone-duration-control', 'time-per-chakra', 'lobby-title',
    'journey-preparation-addons', 'chakra-selection-panel', 'journey-integration-addons', 'intention-config-group',
    'journey-preferences-group', 'experience-mode-group', 'intimate-service-panel', 'open-settings',
    'intimate-service-timings', 'row-perineal-care', 'row-assisted-bathing', 'massage-reverse-journey-note',
    'shot-options', 'custom-shot-frequency', 'shot-frequency-note', 'shot-type-select', 'shots-control'
];

function makeHarness({ checks = [], selectedChakras = [], state: stateOverrides = {}, shotType = 'custom', advancedUnlocked = true, intimateUnlocked = true } = {}) {
    const checked = new Set(checks);
    const style = () => ({ display: '', values: {}, setProperty(name, value) { this.values[name] = value; } });
    const controls = Object.fromEntries(ids.map(id => [id, {
        hidden: false, disabled: false, checked: false, title: '', textContent: '', value: id === 'shot-type-select' ? shotType : '',
        style: style(), classList: { names: new Set(), toggle(name, enabled) { enabled ? this.names.add(name) : this.names.delete(name); } }
    }]));
    const normalDuration = { style: style() };
    const rangeElements = {
        '.range-max': { textContent: '' },
        '.range-increment': { disabled: false },
        '.range-decrement': { disabled: false }
    };
    const timeInput = controls['time-per-chakra'];
    timeInput.min = '1'; timeInput.max = '7'; timeInput.step = '0.5';
    timeInput.closest = selector => selector === '.time-selector' ? normalDuration : ({ querySelector: query => rangeElements[query] || null });
    const shotsToggle = { checked: checked.has('shots-toggle'), disabled: false, title: '' };
    controls['shots-toggle'] = shotsToggle;
    const yogaExperienceSetup = { hidden: false };
    const startMeditationBtn = { textContent: '' };
    const label = { textContent: '' };
    const document = {
        getElementById(id) { return controls[id] || null; },
        querySelector(selector) { return selector === 'label[for="time-per-chakra"]' ? label : null; }
    };
    const state = {
        noFrequencyMode: false, selectedChakras, advancedFeaturesUnlocked: advancedUnlocked,
        timeShot: 7, timeSleepStage: 4, timePerChakra: 3.5, customScript: null, ...stateOverrides
    };
    const callbackCounts = { range: 0, drone: 0, summary: 0 };
    const input = {
        document, state,
        getChecked: id => id === 'shots-toggle' ? shotsToggle.checked : checked.has(id),
        translate: key => key,
        timingConfig: { journey: {
            shotDuration: { min: 1, max: 20, step: 1 },
            sleepStageDuration: { min: 1, max: 10, step: 0.5 },
            timePerChakra: { min: 1, max: 7, step: 0.5 }
        } },
        isDemoScriptSelected: () => false,
        getDemoCoreDurationMinutes: () => 2,
        setText: (id, value) => { if (id === 'time-display') controls[id] = { textContent: value }; },
        shotsToggle, yogaExperienceSetup, intimateServiceUnlocked: intimateUnlocked, startMeditationBtn,
        refreshRangeControlDisplays: () => callbackCounts.range++,
        syncDroneDurationModeControls: () => callbackCounts.drone++,
        updateDroneDurationSummary: () => callbackCounts.summary++
    };
    visibility.sync(input);
    return { controls, normalDuration, rangeElements, shotsToggle, yogaExperienceSetup, startMeditationBtn, label, callbackCounts };
}

let result = makeHarness({ checks: ['box-breathing-experience-toggle'] });
assert.equal(result.startMeditationBtn.textContent, 'ui.beginBoxBreathing', 'Box Breathing remains a valid standalone start');
assert.equal(result.controls['intention-config-group'].hidden, true, 'focused preparation hides unrelated intention settings');
assert.equal(result.controls['journey-preferences-group'].hidden, true);
assert.equal(result.normalDuration.style.display, 'none');
assert.equal(result.controls['journey-preparation-addons'].hidden, false);
assert.equal(result.controls['time-per-chakra'].value, 3.5);
assert.equal(result.controls['time-per-chakra'].style.values['--range-fill'], '41.7%');
assert.equal(result.callbackCounts.range, 1);

result = makeHarness();
assert.equal(result.startMeditationBtn.textContent, 'ui.beginJourney');
assert.equal(result.controls['intention-config-group'].hidden, false);
assert.equal(result.normalDuration.style.display, 'flex');
assert.equal(result.label.textContent, 'ui.corePracticeDuration');

result = makeHarness({ checks: ['sleep-mode-toggle'] });
assert.equal(result.label.textContent, 'ui.sleepStageDuration');
assert.equal(result.controls['time-per-chakra'].value, 4);
assert.equal(result.controls['time-per-chakra'].max, 10);
assert.equal(result.controls['drone-duration-control'].hidden, false);

result = makeHarness({ checks: ['high-energy-toggle'] });
assert.equal(result.controls['high-energy-duration-control'].style.display, 'flex');
assert.equal(result.normalDuration.style.display, 'none');

result = makeHarness({ checks: ['shots-toggle'], shotType: 'custom' });
assert.equal(result.shotsToggle.checked, true);
assert.equal(result.controls['shot-options'].hidden, false);
assert.equal(result.controls['custom-shot-frequency'].hidden, false);
assert.equal(result.controls['chakra-selection-panel'].hidden, true);
assert.equal(result.startMeditationBtn.textContent, 'ui.beginCustomShot');
assert.equal(result.label.textContent, 'ui.shotDuration');

result = makeHarness({ checks: ['shots-toggle'], state: { noFrequencyMode: true } });
assert.equal(result.shotsToggle.checked, false, 'No Frequency clears a directly checked Shot mode');
assert.equal(result.shotsToggle.disabled, true);
assert.equal(result.shotsToggle.title, 'ui.noFrequencyShotsUnavailable');
assert.equal(result.controls['shot-options'].hidden, true);

result = makeHarness({ checks: ['shots-toggle'], advancedUnlocked: false });
assert.equal(result.shotsToggle.checked, false, 'locked Advanced Features clears a directly checked Shot mode');
assert.equal(result.shotsToggle.disabled, true);

result = makeHarness({ checks: ['perineal-care-toggle'] });
assert.equal(result.startMeditationBtn.textContent, 'ui.beginIntimateService');
assert.equal(result.controls['intimate-service-timings'].hidden, false);
assert.equal(result.controls['row-perineal-care'].style.display, '');
assert.equal(result.controls['intention-config-group'].hidden, true);

assert.throws(() => visibility.sync({}), /requires document, state and selection services/);
console.log('Lobby experience visibility passed: standalone practice, chakra defaults, Sleep, HRIM, Shots gates, Intimate Service and range synchronization.');
