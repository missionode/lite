import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/journey-selection-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /journeySelectionHydration\.hydrate\(\{ state, document, syncValue, syncChecked, defaultIntention \}\)/);
const loadPreferences = app.slice(app.indexOf('function loadPreferences()'), app.indexOf('function checkFirstTime()'));
assert.ok(loadPreferences.indexOf("setText('stat-time'") < loadPreferences.indexOf('journeySelectionHydration.hydrate('));
assert.ok(loadPreferences.indexOf('journeySelectionHydration.hydrate(') < loadPreferences.indexOf("syncChecked('mixer-no-frequency-mode-toggle'"));
assert.match(html, /modules\/journey-selection-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.83/);
assert.match(serviceWorker, /chakra-v5\.278[\s\S]*?modules\/journey-selection-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:journey-selection-hydration'], 'node tests/journey-selection-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const hydration = context.ChakraJourneySelectionHydration;
assert.ok(Object.isFrozen(hydration));

function run(intention) {
    const events = [];
    const inputs = ['root', 'sacral', 'solar', 'heart'].map(value => ({ value, checked: false }));
    const state = {
        selectedChakras: ['root', 'heart'], intention,
        returningJourney: true, journeyVideoPreludeEnabled: false, audioFilters: true
    };
    hydration.hydrate({
        state,
        document: { querySelectorAll(selector) { assert.equal(selector, '#chakra-selection input'); return inputs; } },
        syncValue(id, value) { events.push(['value', id, value]); },
        syncChecked(id, value) { events.push(['checked', id, value]); },
        defaultIntention() { events.push(['default-intention']); return 'A steady intention'; }
    });
    return { state, inputs, events };
}

const restored = run('Build calm attention');
assert.deepEqual(restored.inputs.map(input => [input.value, input.checked]), [
    ['root', true], ['sacral', false], ['solar', false], ['heart', true]
]);
assert.equal(restored.state.intention, 'Build calm attention');
assert.deepEqual(restored.events, [
    ['value', 'intention-input', 'Build calm attention'],
    ['checked', 'returning-journey-toggle', true],
    ['checked', 'journey-video-prelude-toggle', false],
    ['checked', 'audio-filters-toggle', true]
]);

const fallback = run('   ');
assert.equal(fallback.state.intention, 'A steady intention');
assert.deepEqual(fallback.events[0], ['default-intention']);
assert.deepEqual(fallback.events[1], ['value', 'intention-input', 'A steady intention']);
assert.throws(() => hydration.hydrate({}), /requires state, document and preference services/);
console.log('Journey selection hydration contract passed: chakra checks, intention fallback, journey/video/audio toggles and ordering.');
