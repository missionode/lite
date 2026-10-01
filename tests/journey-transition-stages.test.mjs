import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('modules/journey-transition-stages.js', 'utf8'), context);
const stages = context.window.ChakraJourneyTransitionStages;
assert.ok(stages);

function element() { return { style: {}, textContent: '' }; }
function fixture() {
    const elements = new Map([['chakra-symbol', element()], ['aura-bg', element()]]);
    const events = [];
    const owner = {
        audio: {}, visual: { stop: () => events.push('visual-stop') },
        isMeditationActive: true, isPaused: false,
        scripts: { closing: { text: 'closing', affirmation: 'affirmation' } },
        stopStageDrone: () => events.push('drone-stop'),
        async pauseAwareSleep(ms) { events.push(`sleep:${ms}`); },
        async narrate(text) { events.push(`narrate:${text}`); },
        async narrateFeeble(text) { events.push(`feeble:${text}`); }
    };
    return { owner, events, elements, document: { getElementById: id => elements.get(id) } };
}

let { owner, events, elements, document } = fixture();
const labels = [];
let waited = 0;
await stages.runInterval(owner, {
    state: { timeInterval: 0.2 }, contentT: key => key, timing: () => 0.3,
    setText: (id, text) => labels.push([id, text]), document,
    withAudioStageFade: (_audio, seconds, narrate) => { events.push(`fade:${seconds}`); return narrate(); },
    wait: async ms => { waited += ms; events.push(`wait:${ms}`); }
});
assert.deepEqual(events, ['drone-stop', 'visual-stop', 'sleep:300', 'fade:0.2', 'feeble:system.breatheInterval', 'wait:100', 'wait:100']);
assert.deepEqual(labels, [['mantra-display', 'system.breathe']]);
assert.equal(elements.get('chakra-symbol').style.opacity, '0.3');

({ owner, events, elements, document } = fixture());
await stages.runSilence(owner, {
    contentT: key => key, timing: () => 2.1, setText: (id, text) => events.push(`label:${id}:${text}`), document
});
assert.deepEqual(events, ['visual-stop', 'label:mantra-display:system.silence', 'drone-stop', 'sleep:1000', 'sleep:1000', 'sleep:1000']);
assert.equal(elements.get('chakra-symbol').style.opacity, '0.2');

({ owner, events, elements, document } = fixture());
await stages.runClosing(owner, {
    localized: (script, section) => section ? script[section] : script.text,
    journeyT: key => key, timing: (_group, key) => key === 'closingFirstPause' ? 0.4 : 0.6,
    setText: (id, text) => events.push(`label:${id}:${text}`), document
});
assert.deepEqual(events, [
    'label:mantra-display:✦', 'narrate:closing', 'sleep:400',
    'label:mantra-display:✦ system.body ✦', 'narrate:affirmation', 'sleep:600'
]);
assert.equal(elements.get('chakra-symbol').style.opacity, '0.4');
assert.equal(elements.get('aura-bg').style.background, 'radial-gradient(circle at center, #8B00FF22, transparent)');

({ owner, events, elements, document } = fixture());
owner.isMeditationActive = false;
await stages.runClosing(owner, {
    localized: (_script, section) => section ? undefined : 'closing', journeyT: key => key,
    timing: () => 0, setText() {}, document
});
assert.deepEqual(events, ['narrate:closing', 'sleep:0', 'sleep:0'], 'closing narration still releases even when no affirmation is available');

const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
assert.match(app, /async handleInterval\(\)\s*\{\s*return this\.runSessionItem\('chakra interval',[\s\S]*?journeyTransitionStages\.runInterval\(this,/);
assert.match(app, /async handleSilence\(\)\s*\{\s*return this\.runSessionItem\('closing silence',[\s\S]*?journeyTransitionStages\.runSilence\(this,/);
assert.match(app, /async runClosing\(\)\s*\{\s*return this\.runSessionItem\('closing guidance',[\s\S]*?journeyTransitionStages\.runClosing\(this,/);
assert.match(html, /modules\/journey-transition-stages\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.23/);
assert.equal((sw.match(/\.\/modules\/journey-transition-stages\.js\?v=1\.0/g) || []).length, 1);
console.log('Journey transition stages passed: interval cadence, quiet period, closing narration/fades and offline wiring.');
