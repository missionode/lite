import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/yoga-experience-settings.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const yogaExperienceSettings = window\.ChakraYogaExperienceSettings/);
assert.match(app, /yogaExperienceSettings\.persist\(\{ document, state, storage: localStorage \}\)/);
assert.match(app, /yogaExperienceSettings\.syncTimingRows\(\{ document, getChecked \}\)/);
assert.match(app, /yogaExperienceSettings\.bindSetupChangeControls\(/);
assert.match(app, /yogaExperienceSettings\.bindAdvancedToggle\(/);
assert.match(html, /modules\/yoga-experience-settings\.js\?v=1\.0[\s\S]*?app\.js\?v=4.12/);
assert.match(serviceWorker, /chakra-v5.310[\s\S]*?modules\/yoga-experience-settings\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const settings = context.ChakraYogaExperienceSettings;
assert.ok(Object.isFrozen(settings));

const rows = Object.fromEntries(['row-breathing', 'row-corpse', 'row-yoga-prep', 'row-yoga-pose', 'row-bath'].map(id => [id, { style: { display: 'unset' } }]));
const corpseToggle = { checked: true };
const bathToggle = { checked: false, disabled: true, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
const subOptions = { style: { display: 'none' } };
const poseInputs = [{ value: 'mountain', checked: true }, { value: 'tree', checked: false }, { value: 'child', checked: true }];
const document = {
    getElementById(id) {
        return {
            'corpse-pose-toggle': corpseToggle,
            'bath-session-toggle': bathToggle,
            'row-breathing': rows['row-breathing'],
            'row-corpse': rows['row-corpse'],
            'row-yoga-prep': rows['row-yoga-prep'],
            'row-yoga-pose': rows['row-yoga-pose'],
            'row-bath': rows['row-bath'],
            'yoga-sub-options': subOptions
        }[id] || null;
    },
    querySelectorAll(selector) {
        assert.equal(selector, '#yoga-pose-selection input:checked');
        return poseInputs.filter(input => input.checked);
    }
};

const selection = settings.read(document);
assert.deepEqual(JSON.parse(JSON.stringify(selection)), {
    corpsePoseEnabled: true,
    bathSessionEnabled: false,
    selectedYogaPoses: ['mountain', 'child']
});

const state = {};
const values = new Map();
const storage = { setItem(key, value) { values.set(key, String(value)); } };
const saved = settings.persist({ document, state, storage });
assert.deepEqual(JSON.parse(JSON.stringify(saved)), JSON.parse(JSON.stringify(selection)));
assert.deepEqual(JSON.parse(JSON.stringify(state)), JSON.parse(JSON.stringify(selection)));
assert.deepEqual([...values.entries()].sort(), [
    ['chakra_bath_enabled', 'false'],
    ['chakra_corpse_enabled', 'true'],
    ['chakra_yoga_selected', '["mountain","child"]']
]);

let checkedValues = new Set(['corpse-pose-toggle']);
const getChecked = id => checkedValues.has(id);
settings.syncTimingRows({ document, getChecked });
assert.equal(rows['row-breathing'].style.display, 'none');
assert.equal(rows['row-corpse'].style.display, '');
assert.equal(rows['row-yoga-prep'].style.display, '');
assert.equal(rows['row-yoga-pose'].style.display, '');
assert.equal(rows['row-bath'].style.display, 'none');
assert.equal(bathToggle.disabled, false);
assert.equal(bathToggle.attributes['aria-disabled'], 'false');
assert.equal(subOptions.style.display, 'flex');

checkedValues = new Set(['bath-session-toggle']);
settings.syncTimingRows({ document, getChecked });
assert.equal(rows['row-corpse'].style.display, 'none');
assert.equal(rows['row-bath'].style.display, '');

const setupCalls = [];
const setupListeners = new Map();
const setupInputs = [
    { value: 'mountain', checked: true, addEventListener(type, fn) { setupListeners.set(`pose:${type}`, fn); } },
    { value: 'tree', checked: false, addEventListener(type, fn) { setupListeners.set(`pose:${type}`, fn); } }
];
const setupDocument = {
    getElementById(id) {
        if (id === 'corpse-pose-toggle') return { checked: true, addEventListener(type, fn) { setupListeners.set(`corpse:${type}`, fn); } };
        if (id === 'bath-session-toggle') return { checked: false, addEventListener(type, fn) { setupListeners.set(`bath:${type}`, fn); } };
        return null;
    },
    querySelectorAll(selector) {
        assert.ok(['#yoga-pose-selection input', '#yoga-pose-selection input:checked'].includes(selector));
        return selector.endsWith(':checked') ? setupInputs.filter(input => input.checked) : setupInputs;
    }
};
settings.bindSetupChangeControls({
    document: setupDocument, state: {}, storage: { setItem() { setupCalls.push('persist'); } },
    syncTimingRows: () => setupCalls.push('rows'), updateSessionEstimate: () => setupCalls.push('estimate')
});
setupListeners.get('corpse:change')();
assert.deepEqual(setupCalls.splice(0), ['persist', 'persist', 'persist', 'rows', 'estimate']);
setupListeners.get('bath:change')();
assert.deepEqual(setupCalls.splice(0), ['persist', 'persist', 'persist', 'rows', 'estimate']);
setupListeners.get('pose:change')();
assert.deepEqual(setupCalls.splice(0), ['persist', 'persist', 'persist', 'estimate']);

const gateCalls = [];
const gateToggle = { checked: true, addEventListener(type, fn) { setupListeners.set(`gate:${type}`, fn); } };
const yogaSetup = { hidden: false };
const gateState = { advancedFeaturesUnlocked: false, yogaExperienceEnabled: true };
settings.bindAdvancedToggle({
    toggle: gateToggle, state: gateState, setup: yogaSetup,
    enforceMasterToggle: () => gateCalls.push('master'),
    updateExperienceModeVisibility: () => gateCalls.push('visibility'),
    updateSessionEstimate: () => gateCalls.push('estimate')
});
setupListeners.get('gate:change')({ target: gateToggle });
assert.equal(gateToggle.checked, false);
assert.equal(gateState.yogaExperienceEnabled, false);
assert.equal(yogaSetup.hidden, true);
assert.deepEqual(gateCalls, ['visibility', 'estimate'], 'locked Yoga cannot turn on and does not run the master-toggle path');
gateState.advancedFeaturesUnlocked = true;
gateToggle.checked = true;
setupListeners.get('gate:change')({ target: gateToggle });
assert.equal(gateState.yogaExperienceEnabled, true);
assert.deepEqual(gateCalls, ['visibility', 'estimate', 'master']);
assert.equal(settings.bindAdvancedToggle({ state: gateState, setup: yogaSetup, enforceMasterToggle() {}, updateExperienceModeVisibility() {}, updateSessionEstimate() {} }), false, 'a missing optional Yoga toggle remains a no-op');

assert.throws(() => settings.read(null), /require a document/);
assert.throws(() => settings.persist({}), /require state and storage services/);
assert.throws(() => settings.syncTimingRows({}), /require document and selection services/);
console.log('Yoga experience settings passed: selection snapshot, local persistence, timing-row visibility, and default bath-toggle enablement.');
