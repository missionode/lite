import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/undo-unlearn-practice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const undoUnlearnPractice = window\.ChakraUndoUnlearnPractice/);
assert.match(app, /async runUndoUnlearn\(\) \{[\s\S]*?undoUnlearnPractice\.run\(/);
assert.match(html, /modules\/undo-unlearn-practice\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.75/);
assert.match(serviceWorker, /chakra-v5\.270[\s\S]*?modules\/undo-unlearn-practice\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraUndoUnlearnPractice;
assert.ok(Object.isFrozen(practice));

function create(overrides = {}) {
    const events = [];
    const classes = new Set();
    const sceneClasses = new Set();
    const body = { classList: {
        add(name) { classes.add(name); events.push(`body:add:${name}`); },
        remove(name) { classes.delete(name); events.push(`body:remove:${name}`); }
    } };
    const scene = { hidden: true, offsetWidth: 1, classList: {
        add(name) { sceneClasses.add(name); events.push(`scene:add:${name}`); },
        remove(name) { sceneClasses.delete(name); events.push(`scene:remove:${name}`); }
    } };
    let active = true;
    const args = {
        minutes: 8, body, meditationScreen: { id: 'meditation-screen' }, scene,
        phases: ['phase-1', 'phase-2', 'phase-3', 'phase-4'],
        opening: 'opening', title: 'Undo & Unlearn', closing: 'closing',
        showScreen(value) { events.push(`screen:${value.id}`); },
        stopVisual() { events.push('visual:stop'); },
        setTitle(value) { events.push(`title:${value}`); },
        async narrate(value, fade) { events.push(`narrate:${value}:${fade}`); },
        async sleep(milliseconds) { events.push(`sleep:${milliseconds}`); },
        isActive() { return active; },
        ...overrides
    };
    return { args, events, bodyClasses: classes, sceneClasses, scene, deactivate() { active = false; } };
}

const full = create();
await practice.run(full.args);
assert.deepEqual(full.events.filter(item => item.startsWith('narrate:')), [
    'narrate:opening:false', 'narrate:phase-1:false', 'narrate:phase-2:false',
    'narrate:phase-3:false', 'narrate:phase-4:false', 'narrate:closing:false'
]);
assert.deepEqual(full.events.filter(item => item.startsWith('sleep:')), ['sleep:120000', 'sleep:120000', 'sleep:120000', 'sleep:120000', 'sleep:5000']);
assert.equal(full.scene.hidden, true);
assert.equal(full.sceneClasses.size, 0);
assert.equal(full.bodyClasses.size, 0);
assert.ok(full.events.indexOf('scene:remove:is-active') < full.events.indexOf('sleep:5000'));

const cancelled = create();
cancelled.args.narrate = async value => {
    cancelled.events.push(`narrate:${value}:false`);
    if (value === 'opening') cancelled.deactivate();
};
await practice.run(cancelled.args);
assert.deepEqual(cancelled.events.filter(item => item.startsWith('narrate:')), ['narrate:opening:false']);
assert.equal(cancelled.scene.hidden, true);
assert.equal(cancelled.bodyClasses.size, 0);

const narrationFailure = create({ async narrate() { throw new Error('narration-failed'); } });
await assert.rejects(practice.run(narrationFailure.args), /narration-failed/);
assert.equal(narrationFailure.scene.hidden, true, 'narration failure still hides the scene after its fade wait');
assert.equal(narrationFailure.bodyClasses.size, 0, 'narration failure clears the active scene state');

const fadeFailure = create({
    async narrate() {},
    async sleep(milliseconds) { if (milliseconds === 5000) throw new Error('fade-wait-failed'); }
});
await assert.rejects(practice.run(fadeFailure.args), /fade-wait-failed/);
assert.equal(fadeFailure.scene.hidden, true, 'a failed fade wait cannot leave the scene exposed');
assert.equal(fadeFailure.sceneClasses.size, 0);
assert.equal(fadeFailure.bodyClasses.size, 0, 'a failed fade wait still releases body mode');

console.log('Undo & Unlearn lifecycle passed: phase order, active timing, cancellation and guaranteed cleanup.');
