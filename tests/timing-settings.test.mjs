import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/timing-settings.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const defaultConfig = JSON.parse(fs.readFileSync('timing-config.json', 'utf8'));
const context = vm.createContext({ URLSearchParams });
vm.runInContext(source, context);
const service = context.ChakraTimingSettings;
assert.ok(Object.isFrozen(service), 'timing settings should expose an immutable API');

assert.equal(service.resolve({}, 'transitions', 'bathToYogaRest'), 900);
assert.equal(service.resolve({}, 'estimate', 'unknownEstimate', 42), 42);
assert.equal(service.resolve({ estimate: { baseOverhead: 0 } }, 'estimate', 'baseOverhead', 42), 0);
assert.equal(service.resolveJourneyDefault(defaultConfig, 'timePerChakra', 1), 5);
assert.equal(service.resolveJourneyDefault({}, 'timePerChakra', 1), 1);
const merged = service.mergeProfile(defaultConfig, {
    journey: { timePerChakra: { default: 2, max: 3 } },
    transitions: { initialSettle: 0 },
    estimate: { baseOverhead: 1 }
});
assert.equal(merged.journey.timePerChakra.min, undefined, 'profile overlays retain the existing shallow section-merge behavior');
assert.equal(merged.journey.timePerChakra.default, 2);
assert.equal(merged.transitions.initialSettle, 0);
assert.equal(merged.estimate.baseOverhead, 1);
assert.equal(merged.schemaVersion, defaultConfig.schemaVersion);
assert.equal(merged.profiles, undefined, 'profile application does not recursively carry the profile registry');

const attributes = {};
let enhanced = 0;
service.applyControlBounds({
    document: { getElementById: id => id === 'time-per-chakra' ? { setAttribute: (key, value) => { attributes[key] = value; } } : null },
    config: defaultConfig,
    enhanceRangeControls: () => { enhanced++; }
});
assert.deepEqual(attributes, { min: 1, max: 7, step: 0.5 });
assert.equal(enhanced, 1, 'range controls are enhanced after configured bounds are applied');
assert.throws(() => service.applyControlBounds({}), /require a document/);

const preferenceState = { timePerChakra: 8, timeBath: 1800 };
const preferenceValues = new Map([['chakra_time', '8']]);
const preferenceStorage = {
    getItem: key => preferenceValues.has(key) ? preferenceValues.get(key) : null,
    setItem: (key, value) => preferenceValues.set(key, String(value))
};
service.hydratePreferences({ config: defaultConfig, state: preferenceState, storage: preferenceStorage });
assert.equal(preferenceState.timePerChakra, 7, 'persisted values are clamped to the active profile bounds');
assert.equal(preferenceValues.get('chakra_time'), '7', 'clamping writes the existing storage key');
assert.equal(preferenceState.timeBath, 600, 'an absent preference receives the configured default');
assert.equal(preferenceState.timeHighEnergy, 5, 'unconfigured state falls back to the existing built-in default');

const profileState = { timePerChakra: 8 };
const profileStorageValues = new Map([['chakra_time', '8']]);
const controls = {};
const loadOrder = [];
const selectedProfile = {
    schemaVersion: 1,
    journey: {
        timePerChakra: { default: 5, min: 1, max: 7, step: 0.5 },
        bath: { default: 600, min: 60, max: 1800, step: 60 }
    },
    transitions: { initialSettle: 2 },
    narration: {},
    estimate: { baseOverhead: 5 },
    profiles: {
        'fast-test': {
            journey: { timePerChakra: { default: 2, min: 1, max: 3, step: 1 } },
            transitions: { initialSettle: 0 },
            estimate: { baseOverhead: 1 }
        }
    }
};
const loadedConfig = await service.loadAndApply({
    initialConfig: {},
    fetchConfig: async path => {
        assert.equal(path, 'timing-config.json');
        return { ok: true, json: async () => selectedProfile };
    },
    search: '?timingProfile=fast-test',
    storage: {
        getItem: key => profileStorageValues.has(key) ? profileStorageValues.get(key) : null,
        setItem: (key, value) => profileStorageValues.set(key, String(value))
    },
    state: profileState,
    document: { getElementById: id => id === 'time-per-chakra' ? { setAttribute: (key, value) => { controls[key] = value; } } : null },
    enhanceRangeControls: () => loadOrder.push('controls'),
    applyDemoCoreDurationPreset: () => loadOrder.push('demo'),
    onConfig: config => loadOrder.push(config),
    onProfile: name => loadOrder.push(`profile:${name}`),
    onWarning: message => loadOrder.push(`warning:${message}`),
    SearchParams: URLSearchParams
});
assert.equal(loadedConfig.journey.timePerChakra.default, 2);
assert.equal(loadedConfig.journey.timePerChakra.max, 3);
assert.equal(loadedConfig.transitions.initialSettle, 0);
assert.equal(profileState.timePerChakra, 3);
assert.equal(profileStorageValues.get('chakra_time'), '3');
assert.deepEqual(controls, { min: 1, max: 3, step: 1 });
assert.equal(loadOrder[0], 'profile:fast-test');
assert.equal(loadOrder[1], loadedConfig, 'the app receives the selected profile before demo presets run');
assert.deepEqual(loadOrder.slice(2), ['controls', 'demo']);

const fallbackState = {};
const fallbackWarnings = [];
const fallbackConfig = {
    journey: { timePerChakra: { default: 4, min: 1, max: 6, step: 0.5 } },
    transitions: {}, narration: {}, estimate: {}
};
await service.loadAndApply({
    initialConfig: fallbackConfig,
    fetchConfig: async () => ({ ok: false, status: 503 }),
    storage: { getItem: () => null, setItem() {} },
    state: fallbackState,
    document: { getElementById: () => null },
    enhanceRangeControls() {},
    applyDemoCoreDurationPreset() {},
    onConfig: config => assert.equal(config, fallbackConfig),
    onWarning: (message, error) => fallbackWarnings.push([message, error.message]),
    SearchParams: URLSearchParams
});
assert.equal(fallbackState.timePerChakra, 4, 'failed configuration fetch retains the initial safe timing config');
assert.deepEqual(fallbackWarnings, [['Timing configuration unavailable; using built-in timing defaults.', 'HTTP 503']]);

assert.match(app, /const timingSettings = window\.ChakraTimingSettings/);
assert.match(app, /function timing\(section, key, fallback = 0\)\s*\{\s*return timingSettings\.resolve\(/);
assert.match(app, /function loadTimingConfig\(\)\s*\{\s*timingConfig = await timingSettings\.loadAndApply\(/);
assert.match(html, /modules\/timing-settings\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.97/);
assert.match(serviceWorker, /chakra-v5\.293[\s\S]*?modules\/timing-settings\.js\?v=1\.0/);
console.log('Timing settings contract passed: fallbacks, profile overlays, configured bounds, persisted preference clamping, load failure and callback order.');
