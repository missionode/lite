import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/experiment-settings-view.js?v=1.0') < html.indexOf('app.js?v='));
assert.match(worker, /modules\/experiment-settings-view\.js\?v=1\.0/);
const handlers = new Map();
const activity = { value: 'box', addEventListener: (type, fn) => handlers.set(`activity:${type}`, fn) };
const duration = {
    min: '', max: '', step: '', value: '', dataset: {},
    addEventListener: (type, fn) => handlers.set(`duration:${type}`, fn)
};
const group = { hidden: false };
const values = new Map();
const starts = [];
const elements = new Map([
    ['experiment-activity', activity], ['experiment-core-duration', duration], ['experiment-core-duration-group', group],
    ['start-experiment', { addEventListener: (type, fn) => handlers.set(`start:${type}`, fn) }]
]);
const context = { document: { getElementById: id => elements.get(id) || null } };
vm.runInNewContext(readFileSync('modules/experiment-settings-view.js', 'utf8'), context);
const view = context.ChakraExperimentSettingsView.create({
    state: { timePerChakra: 3, timeBreathing: 8, timeCorpse: 180, timePerinealCare: 180, timeAssistedBathing: 300, timeBath: 240 },
    setText: (id, value) => values.set(id, value), startExperiment: activityId => starts.push(activityId)
});
view.bind();
assert.deepEqual([duration.min, duration.max, duration.step, duration.value, duration.dataset.unit], ['4', '16', '1', '8', 'sec']);
assert.equal(group.hidden, false);
activity.value = 'assisted-bath';
handlers.get('activity:change')();
assert.deepEqual([duration.min, duration.max, duration.step, duration.value, duration.dataset.unit], ['60', '1800', '60', '300', 'min']);
assert.equal(values.get('experiment-core-duration-value'), '5 min');
duration.value = '360';
handlers.get('duration:input')();
assert.equal(values.get('experiment-core-duration-value'), '6 min');
activity.value = 'unknown';
handlers.get('activity:change')();
assert.equal(group.hidden, true);
handlers.get('start:click')();
assert.deepEqual(starts, ['unknown']);
activity.value = '';
handlers.get('start:click')();
assert.deepEqual(starts, ['unknown'], 'empty selection does not start an activity');
console.log('Experiment settings view passed: duration branches, labels, visibility and activity start.');
