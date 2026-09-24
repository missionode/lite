import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/body-scan-practice.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraBodyScanPractice;
assert.ok(Object.isFrozen(practice), 'Body Scan should expose a stable frozen API');

function createView(events) {
    const classes = new Set();
    return {
        hidden: true,
        offsetWidth: 1,
        classList: {
            add(name) { classes.add(name); events.push(`class:add:${name}`); },
            remove(name) { classes.delete(name); events.push(`class:remove:${name}`); }
        },
        classes
    };
}

function createInput(overrides = {}) {
    const events = [];
    const body = createView(events);
    const scene = createView(events);
    const screen = { id: 'meditation-screen' };
    let active = true;
    const input = {
        minutes: 2,
        body,
        meditationScreen: screen,
        scene,
        regions: Array.from({ length: 8 }, (_, index) => `region-${index + 1}`),
        opening: 'opening',
        title: 'Body Scan',
        closing: 'closing',
        showScreen(value) { events.push(`screen:${value.id}`); },
        stopVisual() { events.push('visual:stop'); },
        setTitle(value) { events.push(`title:${value}`); },
        async narrate(value) { events.push(`narrate:${value}`); },
        async sleep(milliseconds) { events.push(`sleep:${milliseconds}`); },
        isActive() { return active; },
        stop() { active = false; },
        events,
        ...overrides
    };
    return input;
}

const full = createInput();
await practice.run(full);
assert.deepEqual(full.events.slice(0, 6), [
    'screen:meditation-screen',
    'class:add:body-scan-active',
    'visual:stop',
    'class:add:is-active',
    'title:Body Scan',
    'narrate:opening'
]);
assert.deepEqual(
    full.events.filter(event => event.startsWith('sleep:')),
    [...Array(8).fill('sleep:15000'), 'sleep:5000'],
    'two minutes across eight regions keeps the original 15-second pauses and five-second scene fade'
);
assert.deepEqual(
    full.events.filter(event => event.startsWith('narrate:')),
    ['narrate:opening', ...Array.from({ length: 8 }, (_, index) => `narrate:region-${index + 1}`), 'narrate:closing']
);
assert.equal(full.scene.hidden, true);
assert.equal(full.scene.classes.has('is-active'), false);
assert.equal(full.body.classes.has('body-scan-active'), false);

const cancelled = createInput();
cancelled.narrate = async value => {
    cancelled.events.push(`narrate:${value}`);
    if (value === 'region-1') cancelled.stop();
};
await practice.run(cancelled);
assert.deepEqual(
    cancelled.events.filter(event => event.startsWith('narrate:')),
    ['narrate:opening', 'narrate:region-1'],
    'session cancellation stops subsequent regions and skips closing guidance'
);
assert.ok(cancelled.events.includes('sleep:5000'), 'cancellation still fades the black scene before cleanup');
assert.equal(cancelled.body.classes.has('body-scan-active'), false);

const failed = createInput();
failed.narrate = async value => {
    failed.events.push(`narrate:${value}`);
    if (value === 'opening') throw new Error('narration-failed');
};
await assert.rejects(practice.run(failed), /narration-failed/);
assert.equal(failed.scene.hidden, true, 'narration errors still hide the scene after its fade');
assert.equal(failed.body.classes.has('body-scan-active'), false, 'narration errors still release the body state');

const noScene = createInput({ scene: null });
await practice.run(noScene);
assert.equal(noScene.events.includes('sleep:5000'), false, 'without a scene there is no artificial scene-fade delay');

console.log('Body Scan lifecycle passed: ordered narration, proportional intervals, cancellation and error cleanup.');
