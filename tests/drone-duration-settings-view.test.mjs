import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/drone-duration-settings-view.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const droneDurationSettingsView = window\.ChakraDroneDurationSettingsView/);
assert.match(app, /function syncDroneDurationModeControls\(\)\s*\{[\s\S]*?droneDurationSettingsView\.sync\(/);
assert.match(html, /modules\/drone-duration-settings-view\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.06/);
assert.match(serviceWorker, /chakra-v5\.302[\s\S]*?modules\/drone-duration-settings-view\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const view = context.ChakraDroneDurationSettingsView;
assert.ok(Object.isFrozen(view));

const options = ['beginner', 'intermediate', 'advanced', 'expert'].map(value => ({ value, checked: false, disabled: false }));
const hrimNote = { hidden: true };
const sleepNote = { hidden: true };
const document = {
    querySelectorAll(selector) {
        assert.equal(selector, 'input[name="drone-duration-mode"]');
        return options;
    },
    getElementById(id) {
        return { 'drone-duration-hrim-note': hrimNote, 'drone-duration-sleep-note': sleepNote }[id] || null;
    }
};

view.sync({ document, highEnergy: false, sleep: false, activeMode: 'beginner' });
assert.deepEqual(options.map(option => [option.checked, option.disabled]), [
    [true, false], [false, false], [false, false], [false, false]
]);
assert.equal(hrimNote.hidden, true);
assert.equal(sleepNote.hidden, true);

view.sync({ document, highEnergy: true, sleep: false, activeMode: 'intermediate' });
assert.deepEqual(options.map(option => [option.checked, option.disabled]), [
    [false, true], [true, false], [false, false], [false, false]
]);
assert.equal(hrimNote.hidden, false);
assert.equal(sleepNote.hidden, true);

view.sync({ document, highEnergy: false, sleep: true, activeMode: 'advanced' });
assert.equal(options[0].disabled, false, 'Sleep retains access to Beginner');
assert.equal(options[2].checked, true);
assert.equal(hrimNote.hidden, true);
assert.equal(sleepNote.hidden, false);

assert.throws(() => view.sync({}), /requires document and active mode/);
console.log('Drone duration settings view passed: active selection, HRIM restriction and contextual notes.');
