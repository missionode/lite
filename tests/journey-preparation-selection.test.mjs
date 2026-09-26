import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const moduleSource = fs.readFileSync('modules/journey-preparation-selection.js', 'utf8');
const appSource = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const elements = new Map();
function checkbox() {
    return { checked: false, listeners: {}, addEventListener(type, handler) { this.listeners[type] = handler; } };
}
const toggles = {
    boxBreathing: checkbox(), hooponopono: checkbox(), dharana: checkbox(), visualization: checkbox(),
    bodyScan: checkbox(), noting: checkbox(), undoUnlearn: checkbox()
};
for (const id of ['dharana-options', 'visualization-options', 'body-scan-options', 'noting-options', 'undo-unlearn-options']) {
    elements.set(id, { hidden: true });
}
const state = {};
const calls = [];
const context = vm.createContext({ window: {} });
context.window.window = context.window;
vm.runInContext(moduleSource, context);
context.window.ChakraJourneyPreparationSelection.bind({
    document: { getElementById: id => elements.get(id) ?? null },
    state,
    toggles,
    clearMusicOnlyMode: () => calls.push('music'),
    clearHighEnergyMode: () => calls.push('high-energy'),
    clearSleepMode: () => calls.push('sleep'),
    clearFocusedExperiences: () => calls.push('focused'),
    clearIntimateService: () => calls.push('care'),
    updateExperienceModeVisibility: () => calls.push('visibility'),
    updateSessionEstimate: () => calls.push('estimate')
});

function change(toggle, checked) {
    toggle.checked = checked;
    toggle.listeners.change({ target: toggle });
}
const competingClear = ['music', 'high-energy', 'sleep', 'focused', 'care'];
change(toggles.boxBreathing, true);
assert.equal(state.boxBreathingExperienceEnabled, true);
assert.equal(state.hooponoponoExperienceEnabled, false);
assert.deepEqual(calls.splice(0), [...competingClear, 'visibility', 'estimate']);
change(toggles.boxBreathing, false);
assert.deepEqual(calls.splice(0), ['visibility', 'estimate'], 'turning a preparation off does not clear other modes');
change(toggles.hooponopono, true);
assert.equal(state.hooponoponoExperienceEnabled, true);
assert.deepEqual(calls.splice(0), [...competingClear, 'visibility', 'estimate']);

for (const [key, id] of [
    ['dharana', 'dharana-options'], ['visualization', 'visualization-options'],
    ['bodyScan', 'body-scan-options'], ['noting', 'noting-options'], ['undoUnlearn', 'undo-unlearn-options']
]) {
    change(toggles[key], true);
    assert.equal(elements.get(id).hidden, false, `${key} options appear when selected`);
    assert.deepEqual(calls.splice(0), [...competingClear, 'visibility', 'estimate']);
    change(toggles[key], false);
    assert.equal(elements.get(id).hidden, true, `${key} options collapse when unselected`);
    assert.deepEqual(calls.splice(0), ['visibility', 'estimate']);
}

const durationListeners = new Map();
const preferenceControl = checkbox();
preferenceControl.value = 'not-a-supported-choice';
const preferenceEvents = [];
const bindingDocument = {
    getElementById(id) {
        if (id === 'visualization-ambience') return preferenceControl;
        if (['visualization-duration', 'body-scan-duration', 'noting-duration', 'undo-unlearn-duration'].includes(id)) {
            return { addEventListener(type, handler) { durationListeners.set(`${id}:${type}`, handler); } };
        }
        return null;
    }
};
let estimateCalls = 0;
context.window.ChakraJourneyPreparationSelection.bindDurationRefresh({ document: bindingDocument, updateSessionEstimate: () => estimateCalls++ });
for (const id of ['visualization-duration', 'body-scan-duration', 'noting-duration', 'undo-unlearn-duration']) {
    durationListeners.get(`${id}:change`)();
}
assert.equal(estimateCalls, 4, 'each preparation duration refreshes the estimate on change');
const preferenceState = {};
const storedPreferences = new Map();
context.window.ChakraJourneyPreparationSelection.bindVisualizationAmbiencePreference({
    document: bindingDocument, state: preferenceState,
    storage: { setItem(key, value) { storedPreferences.set(key, value); } }
});
preferenceControl.listeners.change({ target: preferenceControl });
assert.equal(preferenceState.visualizationAmbience, 'silence', 'unknown ambience values safely normalize to silence');
assert.equal(storedPreferences.get('chakra_visualization_ambience'), 'silence');
preferenceControl.value = 'space-race';
preferenceControl.listeners.change({ target: preferenceControl });
assert.equal(preferenceState.visualizationAmbience, 'space-race');
assert.equal(storedPreferences.get('chakra_visualization_ambience'), 'space-race');

const musicToggle = checkbox();
const highEnergyModeToggle = checkbox();
const modeState = {};
const modeCalls = [];
context.window.ChakraJourneyPreparationSelection.bindPrimaryModeToggles({
    musicOnlyToggle: musicToggle, highEnergyToggle: highEnergyModeToggle, state: modeState,
    enforceMasterToggle: target => modeCalls.push(`master:${target === musicToggle ? 'music' : 'high-energy'}`),
    updateExperienceModeVisibility: () => modeCalls.push('visibility'),
    updateSessionEstimate: () => modeCalls.push('estimate')
});
change(musicToggle, true);
assert.equal(modeState.bgMusicMode, true);
assert.deepEqual(modeCalls.splice(0), ['master:music', 'visibility', 'estimate']);
change(highEnergyModeToggle, true);
assert.equal(modeState.highEnergyEnabled, true);
assert.deepEqual(modeCalls.splice(0), ['master:high-energy', 'visibility', 'estimate']);

assert.doesNotMatch(moduleSource, /chakra-selection|selectedChakras/, 'Preparation selection does not impose a chakra-selection prerequisite.');
assert.match(appSource, /ChakraJourneyPreparationSelection\.bind\([\s\S]*?undoUnlearn: undoUnlearnAddonToggle/);
assert.match(appSource, /ChakraJourneyPreparationSelection\.bindPrimaryModeToggles\(/);
assert.match(appSource, /ChakraJourneyPreparationSelection\.bindDurationRefresh\(/);
assert.match(appSource, /ChakraJourneyPreparationSelection\.bindVisualizationAmbiencePreference\(/);
assert.ok(html.indexOf('modules/journey-preparation-selection.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /modules\/journey-preparation-selection\.js\?v=1\.0/);
console.log('Journey preparation selection passed: standalone stages, nested options, mutual-exclusion clears and updates.');
