import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/visualization-practice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const visualizationPractice = window\.ChakraVisualizationPractice/);
assert.match(app, /async runVisualization\(\) \{[\s\S]*?visualizationPractice\.run\(/, 'the controller should delegate Visualization lifecycle');
assert.match(html, /modules\/visualization-practice\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.78/);
assert.match(serviceWorker, /chakra-v5\.273[\s\S]*?modules\/visualization-practice\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const practice = context.ChakraVisualizationPractice;
assert.ok(Object.isFrozen(practice));

function makeInput({ ambience = 'space-race', activeAfterFocus = true, startError = null } = {}) {
    const events = [];
    const bodyClasses = new Set();
    const blackoutClasses = new Set();
    const screen = { style: {} };
    const body = { classList: {
        add(name) { bodyClasses.add(name); events.push(`body:add:${name}`); },
        remove(name) { bodyClasses.delete(name); events.push(`body:remove:${name}`); }
    } };
    const blackout = { hidden: true, offsetWidth: 1, classList: {
        add(name) { blackoutClasses.add(name); events.push(`blackout:add:${name}`); },
        remove(name) { blackoutClasses.delete(name); events.push(`blackout:remove:${name}`); }
    } };
    let active = true;
    const input = {
        minutes: 1, ambience, body, meditationScreen: screen, blackout,
        title() { events.push('title'); },
        focusPrompt: 'focus', guidance: 'guidance', silenceWakePrompt: 'wake', returnPrompt: 'return',
        showScreen(value) { events.push(`screen:${value === screen}`); },
        fadeBackgroundMusicOut(seconds) { events.push(`music:out:${seconds}`); },
        async startAmbience() { events.push('ambience:start'); if (startError) throw startError; },
        setAmbienceDucked(ducked, seconds) { events.push(`duck:${ducked}:${seconds}`); },
        stopAmbience() { events.push('ambience:stop'); },
        fadeBackgroundMusicIn(seconds, resume) { events.push(`music:in:${seconds}:${resume}`); },
        async narrate(text, ...args) { events.push(`narrate:${text}:${args.join(',')}`); if (text === 'focus' && !activeAfterFocus) active = false; },
        async sleep(milliseconds) { events.push(`sleep:${milliseconds}`); },
        isActive() { return active; },
        requestFrame(callback) { events.push('frame'); callback(); },
        warn(...args) { events.push(`warn:${args[0]}`); }
    };
    return { input, events, bodyClasses, blackoutClasses, screen, blackout };
}

const scored = makeInput();
await practice.run(scored.input);
assert.equal(scored.events.filter(event => event === 'sleep:1000').length, 60, 'one-minute visualization holds for the selected active duration');
assert.deepEqual(scored.events.filter(event => event.startsWith('narrate:')), [
    'narrate:focus:false,true', 'narrate:guidance:false,true', 'narrate:return:false,true'
]);
assert.ok(scored.events.indexOf('duck:true:0.8') < scored.events.indexOf('narrate:focus:false,true'));
assert.ok(scored.events.includes('duck:false:2'));
assert.ok(scored.events.includes('music:out:6'));
assert.ok(scored.events.includes('ambience:start'));
assert.ok(scored.events.includes('ambience:stop'));
assert.ok(scored.events.includes('music:in:8:true'));
assert.ok(scored.events.indexOf('blackout:remove:is-active') < scored.events.indexOf('sleep:5000'));
assert.equal(scored.blackout.hidden, true);
assert.equal(scored.blackoutClasses.size, 0);
assert.equal(scored.bodyClasses.size, 0);
assert.equal(scored.screen.style.opacity, '');
assert.equal(scored.screen.style.transition, '');

const silent = makeInput({ ambience: 'silence', startError: new Error('missing audio asset') });
await practice.run(silent.input);
assert.ok(silent.events.includes('warn:Visualization ambience unavailable; continuing in silence.'));
assert.ok(silent.events.includes('narrate:wake:false,true'), 'silence mode gets its gentle wake prompt');
assert.ok(silent.events.includes('sleep:8000'));
assert.ok(silent.events.includes('narrate:return:false,true'));

const cancelled = makeInput({ activeAfterFocus: false });
await practice.run(cancelled.input);
assert.ok(cancelled.events.includes('blackout:remove:is-active'), 'cancellation at the focus guard clears the blackout');
assert.equal(cancelled.blackout.hidden, true);
assert.equal(cancelled.bodyClasses.size, 0);
assert.ok(!cancelled.events.includes('narrate:guidance:false,true'));
assert.ok(!cancelled.events.includes('music:in:8:true'));

console.log('Visualization practice lifecycle, timing, audio handoff, cancellation and integration contracts passed.');
