import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/journey-opening-stage.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const opening = context.window.ChakraJourneyOpeningStage;
assert.ok(Object.isFrozen(opening));
assert.match(app, /runGratitude\(isHighEnergy = false\) \{\s*return journeyOpeningStage\.run\(this, isHighEnergy/);
assert.ok(html.indexOf('modules/journey-opening-stage.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /chakra-v5.309[\s\S]*?\.\/modules\/journey-opening-stage\.js\?v=1\.0/);

function makeHarness({ highEnergy = false, returning = false, intention = '', active = true } = {}) {
    const events = [];
    const title = { textContent: '' };
    const tutorial = { classList: { remove(value) { events.push(['tutorial-remove', value]); } }, style: {} };
    const aura = { style: {} };
    const document = { getElementById(id) { events.push(['get', id]); return ({ 'breathing-screen': {}, 'breathing-tutorial': tutorial, 'tutorial-title': title, 'aura-bg': aura })[id]; } };
    const owner = {
        isMeditationActive: active,
        scripts: { intro: { moon: { full: 'Moon opening', full_en: 'Moon fallback' }, returning: 'Returning opening' }, high_energy: { intention: 'Activate {{intention}}' } },
        narrate: async (...args) => events.push(['narrate', ...args]),
        narrateIntentionWithFrequency: async (...args) => events.push(['intention-tone', ...args]),
        runArrivalInduction: async () => events.push(['arrival-induction']),
        runArrivalReadiness: async () => events.push(['arrival-readiness']),
        pauseAwareSleep: async ms => events.push(['wait', ms])
    };
    const state = { returningJourney: returning, language: 'en', intention };
    const deps = {
        document,
        showScreen: () => events.push(['screen']),
        journeyT: key => `journey:${key}`,
        contentT: key => key === 'system.intention' ? 'Personal: {{intention}}' : key,
        state,
        getMoonPhase: () => { events.push(['phase']); return 'full'; },
        localized: (value, key) => {
            if (key === 'returning') return owner.scripts.intro.returning;
            if (key === 'gratitude') return 'gratitude';
            if (key === 'intention') return owner.scripts.high_energy.intention;
            return value;
        },
        defaultIntention: () => 'gentle intention',
        timing: (_group, key) => key === 'openingPause' ? 2 : 0
    };
    return { events, owner, deps, title, tutorial, aura };
}

const firstVisit = makeHarness();
await opening.run(firstVisit.owner, false, firstVisit.deps);
assert.deepEqual(firstVisit.events.filter(event => ['screen', 'narrate', 'arrival-induction', 'phase', 'wait', 'arrival-readiness'].includes(event[0])), [
    ['screen'], ['narrate', 'system.prePracticeSafety', false], ['arrival-induction'], ['phase'],
    ['narrate', 'Moon opening', false], ['wait', 2000], ['narrate', 'gratitude', false], ['arrival-readiness']
]);
assert.equal(firstVisit.title.textContent, 'journey:ui.gratitude');
assert.equal(firstVisit.tutorial.style.opacity, '1');
assert.equal(firstVisit.aura.style.opacity, '1');

const returningIntention = makeHarness({ returning: true, intention: 'clarity' });
await opening.run(returningIntention.owner, false, returningIntention.deps);
assert.ok(returningIntention.events.some(event => event[0] === 'narrate' && event[1] === 'Returning opening'));
assert.equal(returningIntention.events.some(event => event[0] === 'narrate' && event[1] === 'Moon opening'), false);
assert.ok(returningIntention.events.some(event => event[0] === 'intention-tone' && event[1] === 'Personal: clarity'));
assert.equal(returningIntention.title.textContent, 'journey:ui.intention');

const hrim = makeHarness({ highEnergy: true, returning: true });
await opening.run(hrim.owner, true, hrim.deps);
assert.equal(hrim.events.some(event => event[0] === 'phase'), false, 'HRIM skips Moon/Returning openings.');
assert.equal(hrim.events.some(event => event[0] === 'arrival-readiness'), false, 'HRIM does not use the ordinary Arrival-readiness cue.');
assert.ok(hrim.events.some(event => event[0] === 'intention-tone' && event[1] === 'Activate gentle intention' && event[2] === 'hrim'));

const cancelled = makeHarness();
cancelled.owner.narrate = async () => { cancelled.owner.isMeditationActive = false; };
await opening.run(cancelled.owner, false, cancelled.deps);
assert.equal(cancelled.events.some(event => event[0] === 'arrival-induction'), false, 'Cancellation after safety guidance exits before Arrival.');

console.log('Journey opening-stage contract passed: safety, Arrival, returning/Moon branch, intention, HRIM path and cancellation order.');
