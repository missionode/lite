import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('modules/standard-journey-sequence.js', 'utf8'), context);
const sequence = context.window.ChakraStandardJourneySequence;
assert.ok(sequence, 'the standard journey owner registers a public API');

function createOwner({ chakraOrder = ['root', 'heart', 'crown'], active = true } = {}) {
    const events = [];
    const owner = {
        async runSessionItem(_label, task) { return { skipped: false, value: await task() }; },
        chakraOrder,
        scripts: Object.fromEntries(chakraOrder.map(key => [key, `${key}-script`])),
        isMeditationActive: active,
        async runBackgroundMusicOnly() { events.push('music-only'); },
        async meditateOnChakra(script, key) { events.push(`chakra:${key}:${script}`); },
        async handleInterval() { events.push('interval'); },
        async runHooponopono() { events.push('hooponopono'); },
        async runUndoUnlearn() { events.push('undo-unlearn'); },
        async handleSilence() { events.push('silence'); },
        async runClosing() { events.push('closing'); },
        async runEmergence() { events.push('emergence'); },
        finish() { events.push('finish'); }
    };
    return { owner, events };
}

const checked = new Set(['hooponopono-experience-toggle', 'undo-unlearn-addon-toggle']);
const deps = { state: { bgMusicMode: false }, isChecked: id => checked.has(id) };
let fixture = createOwner();
await sequence.run(fixture.owner, deps);
assert.deepEqual(fixture.events, [
    'chakra:root:root-script', 'interval',
    'chakra:heart:heart-script', 'interval',
    'chakra:crown:crown-script', 'hooponopono', 'undo-unlearn',
    'silence', 'closing', 'emergence', 'finish'
], 'standard journey stages, optional practices, and completion stay ordered');

fixture = createOwner();
await sequence.run(fixture.owner, { ...deps, complete: false });
assert.deepEqual(fixture.events, [
    'chakra:root:root-script', 'interval', 'chakra:heart:heart-script', 'interval', 'chakra:crown:crown-script'
], 'partial sequence runs stop after the selected chakra stages');

fixture = createOwner();
fixture.owner.meditateOnChakra = async (_script, key) => {
    fixture.events.push(`chakra:${key}`);
    fixture.owner.isMeditationActive = false;
};
await sequence.run(fixture.owner, deps);
assert.deepEqual(fixture.events, ['chakra:root'], 'Stop during a chakra prevents intervals and all later stages');

fixture = createOwner();
await sequence.run(fixture.owner, { ...deps, state: { bgMusicMode: true } });
assert.deepEqual(fixture.events, ['music-only'], 'Music Only retains its exclusive route');

fixture = createOwner({ chakraOrder: [], active: false });
await sequence.run(fixture.owner, deps);
assert.deepEqual(fixture.events, [], 'an inactive empty journey does not run closing stages');

const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
assert.match(app, /async runSequence\(\{ complete = true \} = \{\}\)\s*\{\s*return standardJourneySequence\.run\(this, \{ state, isChecked: getChecked, complete \}\);/);
assert.match(html, /modules\/standard-journey-sequence\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.33/);
assert.equal((sw.match(/\.\/modules\/standard-journey-sequence\.js\?v=1\.0/g) || []).length, 1,
    'the sequence owner is precached exactly once for offline use');
console.log('Standard journey sequence passed: ordering, optional stages, partial completion, cancellation, Music Only and offline wiring.');
