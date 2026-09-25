import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/dharana-practice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const dharanaPractice = await practiceModuleLoader\.load\('dharana'\)/);
assert.match(app, /async runDharana\(\) \{[\s\S]*?dharanaPractice\.run\(/, 'the controller should delegate Dharana lifecycle to its owner');
assert.match(html, /modules\/practice-module-loader\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.06/);
assert.doesNotMatch(html, /modules\/dharana-practice\.js/);
assert.match(serviceWorker, /chakra-v5\.302[\s\S]*?modules\/dharana-practice\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraDharanaPractice;
assert.ok(Object.isFrozen(practice), 'Dharana should expose a stable frozen API');

function createView(events, style = {}) {
    const classes = new Set();
    let transform = '';
    const viewStyle = {
        ...style,
        properties: {},
        setProperty(name, value) { this.properties[name] = value; }
    };
    Object.defineProperty(viewStyle, 'transform', {
        get() { return transform; },
        set(value) { transform = value; events.push(`transform:${value}`); }
    });
    return {
        hidden: true,
        textContent: '',
        offsetWidth: 1,
        classList: {
            add(name) { classes.add(name); events.push(`class:add:${name}`); },
            remove(...names) { for (const name of names) classes.delete(name); events.push(`class:remove:${names.join(',')}`); }
        },
        style: viewStyle,
        classes
    };
}

function createInput(overrides = {}) {
    const events = [];
    const body = createView(events);
    const symbol = createView(events, { visibility: 'visible' });
    const focusAnchor = createView(events);
    const focusVeil = createView(events);
    const container = createView(events);
    const input = {
        anchor: 'gold-dot',
        minutes: 1,
        body,
        meditationScreen: { id: 'meditation-screen' },
        symbol,
        focusAnchor,
        focusVeil,
        container,
        guidance: 'guidance',
        title: 'Focused Attention',
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
assert.deepEqual(full.events.slice(0, 8), [
    'screen:meditation-screen',
    'class:add:dharana-active',
    'visual:stop',
    'class:remove:presence-ready',
    'class:add:is-active',
    'class:remove:is-focusing',
    'class:add:is-focusing',
    'title:Focused Attention'
]);
assert.equal(full.focusAnchor.textContent, '•');
assert.equal(full.focusAnchor.style.color, '#fbbf24');
assert.equal(full.focusAnchor.style.properties['--focus-anchor-duration'], '60s');
assert.equal(full.focusAnchor.style.transform, '', 'the progress scale resets after the session');
assert.equal(full.focusAnchor.hidden, true);
assert.equal(full.focusAnchor.classes.size, 0);
assert.equal(full.focusVeil.hidden, true);
assert.equal(full.focusVeil.classes.size, 0);
assert.equal(full.body.classes.has('dharana-active'), false);
assert.equal(full.symbol.style.visibility, '', 'the chakra symbol is restored after the session');
assert.equal(full.events.filter(event => event === 'sleep:1000').length, 60, 'one minute keeps the one-second session clock');
assert.ok(full.events.indexOf('narrate:closing') < full.events.indexOf('sleep:4000'), 'closing guidance starts with the visual release tail');
assert.ok(full.events.includes('sleep:4000'), 'anchor and veil keep the four-second release tail');
const transforms = full.events.filter(event => event.startsWith('transform:scale('));
assert.equal(transforms.length, 60, 'session progress must update the anchor scale every second');
assert.ok(Math.abs(Number(transforms[0].match(/scale\(([^)]+)\)/)[1]) - (1 - 0.58 / 60)) < 1e-10);
assert.ok(Math.abs(Number(transforms.at(-1).match(/scale\(([^)]+)\)/)[1]) - 0.42) < 1e-10, 'the anchor should reach the same final scale as before');
assert.match(full.focusAnchor.style.transform, /^$/);

let active = true;
const cancelled = createInput({
    async narrate(value) {
        cancelled.events.push(`narrate:${value}`);
        if (value === 'guidance') active = false;
    },
    isActive() { return active; }
});
await practice.run(cancelled);
assert.deepEqual(cancelled.events.filter(event => event.startsWith('narrate:')), ['narrate:guidance']);
assert.equal(cancelled.focusAnchor.hidden, true, 'stop during opening guidance clears the focus layer');
assert.equal(cancelled.body.classes.has('dharana-active'), false);
assert.equal(cancelled.symbol.style.visibility, '');

const failed = createInput({
    async narrate(value) {
        failed.events.push(`narrate:${value}`);
        if (value === 'guidance') throw new Error('narration-failed');
    }
});
await assert.rejects(practice.run(failed), /narration-failed/);
assert.equal(failed.focusAnchor.hidden, true, 'narration failure clears the focus layer');
assert.equal(failed.focusVeil.hidden, true, 'narration failure clears the veil');
assert.equal(failed.body.classes.has('dharana-active'), false);
assert.equal(failed.symbol.style.visibility, '');

const minimal = createInput({ anchor: 'unknown-anchor', focusAnchor: null, focusVeil: null, container: null });
await practice.run(minimal);
assert.equal(minimal.events.includes('class:remove:presence-ready'), false);
assert.ok(minimal.events.includes('narrate:closing'));

console.log('Dharana lifecycle passed: anchor setup/shrink clock, narrated release, cancellation and failure cleanup.');
