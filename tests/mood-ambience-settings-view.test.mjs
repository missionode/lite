import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/mood-ambience-settings-view.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const moodAmbienceSettingsView = window\.ChakraMoodAmbienceSettingsView/);
assert.match(app, /function syncPleasureAmbienceControl\(\)\s*\{\s*moodAmbienceSettingsView\.sync\(/);
assert.match(html, /modules\/mood-ambience-settings-view\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.02/);
assert.match(serviceWorker, /chakra-v5\.298[\s\S]*?modules\/mood-ambience-settings-view\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const view = context.ChakraMoodAmbienceSettingsView;
assert.ok(Object.isFrozen(view));

function element({ min = '', max = '', value = '' } = {}) {
    return {
        hidden: false, disabled: false, checked: false, value, textContent: '', min, max,
        style: { color: '', values: {}, setProperty(name, v) { this.values[name] = v; } },
        dataset: {}
    };
}

const ids = [
    'mood-relaxation-ambience-section', 'mood-relaxation-intention-toggle',
    'mood-relaxation-ambience-level-control', 'pleasure-ambience-intensity-control',
    'pleasure-ambience-intensity', 'pleasure-ambience-url-control', 'pleasure-ambience-url',
    'pleasure-ambience-blur-control', 'pleasure-ambience-blur-toggle',
    'pleasure-ambience-blur-level-control', 'pleasure-ambience-blur-level',
    'pleasure-ambience-blur-level-value', 'mood-relaxation-ambience-level',
    'mood-relaxation-ambience-level-value', 'pleasure-ambience-url-status'
];
const elements = Object.fromEntries(ids.map(id => [id, element()]));
elements['pleasure-ambience-blur-level'] = element({ min: '0', max: '100' });
elements['mood-relaxation-ambience-level'] = element({ min: '0', max: '7' });
const document = { getElementById(id) { return elements[id] || null; } };
const state = {
    advancedFeaturesUnlocked: true, noFrequencyMode: true, moodRelaxationIntentionEnabled: true,
    pleasureAmbienceIntensity: 'immersive', pleasureAmbienceUrl: 'https://example.test/ambience.mp3',
    pleasureAmbienceBlur: true, pleasureAmbienceBlurAmount: 0.35, pleasureAmbienceGain: 0.05
};

view.sync({ document, state, audioUnavailable: true, formatLevel: gain => `${(gain * 100).toFixed(1)}%`, unavailableMessage: 'Source unavailable' });
assert.equal(elements['mood-relaxation-ambience-section'].hidden, false, 'Advanced Features unlock shows the Lobby section');
assert.equal(elements['mood-relaxation-ambience-level-control'].hidden, false);
assert.equal(elements['pleasure-ambience-intensity'].value, 'immersive');
assert.equal(elements['pleasure-ambience-url'].value, state.pleasureAmbienceUrl);
assert.equal(elements['pleasure-ambience-blur-toggle'].checked, true);
assert.equal(elements['pleasure-ambience-blur-level'].value, '35');
assert.equal(elements['pleasure-ambience-blur-level'].style.values['--range-fill'], '35.0%');
assert.equal(elements['pleasure-ambience-blur-level-value'].textContent, '35%');
assert.equal(elements['mood-relaxation-ambience-level'].value, '5.0');
assert.equal(elements['mood-relaxation-ambience-level'].style.values['--range-fill'], '71.4%');
assert.equal(elements['mood-relaxation-ambience-level'].disabled, true, 'No Frequency and missing audio disable the gain control');
assert.equal(elements['pleasure-ambience-url-status'].textContent, 'Source unavailable');
assert.equal(elements['pleasure-ambience-url-status'].hidden, false, 'missing local files keep replacement guidance visible');

state.advancedFeaturesUnlocked = false;
state.moodRelaxationIntentionEnabled = false;
state.noFrequencyMode = false;
view.sync({ document, state, audioUnavailable: false, formatLevel: gain => `${Math.round(gain * 100)}%`, unavailableMessage: 'Source unavailable' });
assert.equal(elements['mood-relaxation-ambience-section'].hidden, true);
assert.equal(elements['mood-relaxation-ambience-level-control'].hidden, true);
assert.equal(elements['mood-relaxation-ambience-level'].disabled, false);
assert.equal(elements['pleasure-ambience-url-status'].hidden, true);
assert.equal(elements['pleasure-ambience-url-status'].textContent, '');
assert.equal(elements['pleasure-ambience-url-status'].dataset.availability, undefined);

assert.throws(() => view.sync({}), /requires document/);
console.log('Mood ambience settings view passed: lock/intention gates, no-frequency behavior, ranges and missing-audio recovery.');
