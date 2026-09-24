import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/hooponopono-practice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const hooponoponoPractice = window\.ChakraHooponoponoPractice/);
assert.match(app, /async runHooponopono\(\) \{[\s\S]*?hooponoponoPractice\.run\(/);
assert.match(html, /modules\/hooponopono-practice\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.69/);
assert.match(serviceWorker, /chakra-v5\.264[\s\S]*?modules\/hooponopono-practice\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraHooponoponoPractice;
assert.ok(Object.isFrozen(practice));

function input(overrides = {}) {
    const events = [];
    const aura = { style: {} };
    const symbol = { style: {} };
    const args = {
        aura,
        symbol,
        intro: 'intro',
        phrases: ['sorry', 'forgive', 'thankful', 'love'],
        closing: 'closing',
        introPauseSeconds: 2,
        phrasePauseSeconds: 3,
        finalRestSeconds: 15,
        setTitle(value) { events.push(`title:${value}`); },
        async narrate(value, finalFade) { events.push(`narrate:${value}:${finalFade}`); },
        async sleep(milliseconds) { events.push(`sleep:${milliseconds}`); },
        isActive() { return true; },
        ...overrides
    };
    return { args, events, aura, symbol };
}

const complete = input();
await practice.run(complete.args);
assert.equal(complete.aura.style.background, 'radial-gradient(circle at center, #fff9c455, transparent)');
assert.equal(complete.aura.style.opacity, '1');
assert.equal(complete.symbol.style.opacity, '0.1');
assert.equal(complete.events[0], 'title:✦');
assert.deepEqual(complete.events.filter(item => item.startsWith('narrate:')), [
    'narrate:intro:false',
    ...Array.from({ length: 3 }, () => ['sorry', 'forgive', 'thankful', 'love']).flat().map(phrase => `narrate:${phrase}:false`),
    'narrate:closing:true'
]);
assert.deepEqual(complete.events.filter(item => item.startsWith('sleep:')), [
    'sleep:2000', ...Array(12).fill('sleep:3000'), 'sleep:15000'
]);

let active = true;
const cancelled = input({
    async narrate(value, finalFade) { cancelled.events.push(`narrate:${value}:${finalFade}`); active = false; },
    isActive() { return active; }
});
await practice.run(cancelled.args);
assert.deepEqual(cancelled.events.filter(item => item.startsWith('narrate:')), ['narrate:intro:false']);
assert.deepEqual(cancelled.events.filter(item => item.startsWith('sleep:')), ['sleep:2000']);

const failed = input({ async narrate() { throw new Error('narration-failed'); } });
await assert.rejects(practice.run(failed.args), /narration-failed/);

console.log('Ho’oponopono lifecycle passed: three phrase cycles, configured pauses, final narration fade and cancellation.');
