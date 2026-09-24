import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/box-breathing-practice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const boxBreathingPractice = window\.ChakraBoxBreathingPractice/);
assert.match(app, /if \(!boxBreathingPractice\) throw new Error\('Box Breathing practice module is unavailable\.'\)/);
assert.match(app, /async runBoxBreathing\(\) \{[\s\S]*?boxBreathingPractice\.run\(/, 'the controller should delegate Box Breathing to its lifecycle owner');
assert.match(html, /modules\/box-breathing-practice\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.72/, 'the module should load before app.js with a refreshed app version');
assert.match(serviceWorker, /chakra-v5\.267[\s\S]*?modules\/box-breathing-practice\.js\?v=1\.0/, 'the offline shell should precache the module');

const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraBoxBreathingPractice;
assert.ok(Object.isFrozen(practice), 'Box Breathing should expose a stable frozen API');

function createElement(events) {
    const classes = new Set();
    return {
        hidden: false,
        textContent: '',
        style: {},
        classes,
        classList: {
            add(name) { classes.add(name); events.push(`class:add:${name}`); },
            remove(name) { classes.delete(name); events.push(`class:remove:${name}`); }
        }
    };
}

function createInput(overrides = {}) {
    const events = [];
    const screen = { id: 'breathing-screen' };
    const tutorial = createElement(events);
    const titleElement = createElement(events);
    const instruction = createElement(events);
    const circle = createElement(events);
    const timer = createElement(events);
    const input = {
        breathingStep: 1,
        breathingPreparationSeconds: 1,
        tutorialFadeSeconds: 1,
        completionSeconds: 1,
        screen,
        tutorial,
        titleElement,
        instruction,
        circle,
        timer,
        title: 'Preparation',
        preparationNarration: 'settle',
        steps: [
            { text: 'Breathe in', scale: 1.5 },
            { text: 'Hold', scale: 1.5 },
            { text: 'Breathe out', scale: 0.8 },
            { text: 'Hold', scale: 0.8 }
        ],
        completionLabel: 'complete',
        completionNarration: 'breath complete',
        prepareLabel: 'Prepare',
        showScreen(value) { events.push(`screen:${value.id}`); },
        async narrate(text, keepSilence) { events.push(`narrate:${text}:${keepSilence}`); },
        narrateSoft(text) { events.push(`soft:${text}`); },
        async sleep(milliseconds) { events.push(`sleep:${milliseconds}`); },
        isActive() { return true; },
        isPaused() { return false; },
        fadeMusicOut(seconds) { events.push(`music:out:${seconds}`); },
        fadeMusicIn(seconds, immediate) { events.push(`music:in:${seconds}:${immediate}`); },
        events,
        ...overrides
    };
    return input;
}

const full = createInput();
await practice.run(full);
assert.deepEqual(full.events.slice(0, 6), [
    'screen:breathing-screen',
    'class:remove:hidden',
    'music:out:4',
    'narrate:settle:true',
    'sleep:1000',
    'sleep:1000'
]);
assert.equal(full.titleElement.textContent, 'Preparation');
assert.equal(full.tutorial.style.opacity, '0');
assert.equal(full.tutorial.classes.has('hidden'), true);
assert.equal(full.events.filter(event => event.startsWith('soft:')).length, 16, 'four full breathing cycles each narrate all four steps');
assert.equal(full.events.filter(event => event.startsWith('timer:')).length, 0);
assert.equal(full.events.filter(event => event === 'sleep:100').length, 160, 'one-second phases preserve responsive 100 ms pause checks');
assert.equal(full.events.filter(event => event.startsWith('narrate:')).length, 2);
assert.ok(full.events.includes('music:in:4:false'));
assert.equal(full.instruction.textContent, 'Prepare');
assert.equal(full.timer.textContent, '01');
assert.equal(full.circle.style.transition, 'transform 1s linear');
assert.equal(full.circle.style.transform, 'scale(0.8)');

let pauseTicks = 2;
let countedWaits = 0;
const paused = createInput({
    breathingPreparationSeconds: 0,
    tutorialFadeSeconds: 0,
    completionSeconds: 0,
    steps: [{ text: 'single', scale: 1 }],
    isPaused() { if (pauseTicks > 0) { pauseTicks--; return true; } return false; },
    async sleep(milliseconds) {
        paused.events.push(`sleep:${milliseconds}`);
        if (milliseconds === 100) countedWaits++;
    }
});
await practice.run(paused);
assert.equal(countedWaits, 4 * 10 + 2, 'paused ticks wait but do not advance the breathing second');

let active = true;
const cancelled = createInput({
    breathingPreparationSeconds: 0,
    tutorialFadeSeconds: 0,
    steps: [{ text: 'single', scale: 1 }],
    async sleep(milliseconds) {
        cancelled.events.push(`sleep:${milliseconds}`);
        if (milliseconds === 100) active = false;
    },
    isActive() { return active; }
});
await practice.run(cancelled);
assert.equal(cancelled.events.filter(event => event.startsWith('soft:')).length, 1);
assert.equal(cancelled.events.some(event => event.startsWith('music:in:')), false, 'a stopped session must not start restoring music');

console.log('Box Breathing lifecycle passed: ordered phases, pause accounting, stop and music handoff.');
