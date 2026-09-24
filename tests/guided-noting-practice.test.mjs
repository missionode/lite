import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/guided-noting-practice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const guidedNotingPractice = window\.ChakraGuidedNotingPractice/);
assert.match(app, /if \(!guidedNotingPractice\) throw new Error\('Guided Noting practice module is unavailable\.'\)/);
assert.match(app, /async runNoting\(\) \{[\s\S]*?guidedNotingPractice\.run\(/, 'the existing controller should delegate Guided Noting to its lifecycle owner');
assert.match(html, /modules\/guided-noting-practice\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.78/, 'the module should load before app.js with a refreshed app version');
assert.match(serviceWorker, /chakra-v5\.273[\s\S]*?modules\/guided-noting-practice\.js\?v=1\.0/, 'the offline shell should precache the same module version');
const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraGuidedNotingPractice;
assert.ok(Object.isFrozen(practice), 'Guided Noting should expose a stable frozen API');

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
    const input = {
        minutes: 2,
        body,
        meditationScreen: { id: 'meditation-screen' },
        scene,
        reminders: ['thinking', 'hearing', 'planning', 'itching'],
        opening: 'opening',
        title: 'Guided Noting',
        closing: 'closing',
        showScreen(value) { events.push(`screen:${value.id}`); },
        stopVisual() { events.push('visual:stop'); },
        setTitle(value) { events.push(`title:${value}`); },
        async narrate(value) { events.push(`narrate:${value}`); },
        async sleep(milliseconds) { events.push(`sleep:${milliseconds}`); },
        isActive() { return true; },
        events,
        ...overrides
    };
    return input;
}

const full = createInput();
await practice.run(full);
assert.deepEqual(full.events.slice(0, 6), [
    'screen:meditation-screen',
    'class:add:noting-active',
    'visual:stop',
    'class:add:is-active',
    'title:Guided Noting',
    'narrate:opening'
]);
assert.deepEqual(
    full.events.filter(event => event.startsWith('sleep:')),
    [...Array(4).fill('sleep:30000'), 'sleep:5000'],
    'the four reminders retain evenly spaced pauses and the five-second black-scene fade'
);
assert.deepEqual(
    full.events.filter(event => event.startsWith('narrate:')),
    ['narrate:opening', 'narrate:thinking', 'narrate:hearing', 'narrate:planning', 'narrate:itching', 'narrate:closing']
);
assert.equal(full.scene.hidden, true);
assert.equal(full.scene.classes.has('is-active'), false);
assert.equal(full.body.classes.has('noting-active'), false);

let active = true;
const cancelled = createInput({
    async sleep(milliseconds) {
        cancelled.events.push(`sleep:${milliseconds}`);
        if (milliseconds === 30000) active = false;
    },
    isActive() { return active; }
});
await practice.run(cancelled);
assert.deepEqual(
    cancelled.events.filter(event => event.startsWith('narrate:')),
    ['narrate:opening'],
    'cancellation during a reminder interval skips the prompt and closing guidance'
);
assert.ok(cancelled.events.includes('sleep:5000'), 'cancellation still fades the black scene before cleanup');
assert.equal(cancelled.body.classes.has('noting-active'), false);

const failed = createInput({
    async narrate(value) {
        failed.events.push(`narrate:${value}`);
        if (value === 'opening') throw new Error('narration-failed');
    }
});
await assert.rejects(practice.run(failed), /narration-failed/);
assert.equal(failed.scene.hidden, true, 'narration errors still hide the scene after its fade');
assert.equal(failed.body.classes.has('noting-active'), false, 'narration errors still release the body state');

const failedFade = createInput({
    async sleep(milliseconds) {
        failedFade.events.push(`sleep:${milliseconds}`);
        if (milliseconds === 5000) throw new Error('fade-failed');
    }
});
await assert.rejects(practice.run(failedFade), /fade-failed/);
assert.equal(failedFade.scene.hidden, true, 'fade errors still hide the black scene');
assert.equal(failedFade.body.classes.has('noting-active'), false, 'fade errors still release the body state');

const noScene = createInput({ scene: null, reminders: [] });
await practice.run(noScene);
assert.equal(noScene.events.includes('sleep:5000'), false, 'without a scene there is no artificial scene-fade delay');
assert.equal(noScene.events.includes('sleep:15000'), false, 'empty reminder lists do not create artificial reminder pauses');

console.log('Guided Noting lifecycle passed: prompt order, spacing, cancellation and failure cleanup.');
