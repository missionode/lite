import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Owner (2026-10-04): optional time for each chakra, Core Practice Duration
// kept as the base, and autofill from the chakra assessment (1A 2A 3A).
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const context = vm.createContext({ Math, Number, Object, JSON, Array, String });
vm.runInContext(read('modules/chakra-timing.js'), context);
vm.runInContext(read('modules/session-estimate.js'), context);
const T = context.ChakraTiming;
const E = context.ChakraSessionEstimate;

// Defaults: off, every chakra follows the core time.
const store = new Map();
const storage = { getItem: key => (store.has(key) ? store.get(key) : null), setItem: (key, value) => store.set(key, String(value)) };
const loaded = T.load(storage);
assert.equal(loaded.enabled, false, 'the switch is off by default');
assert.ok(Object.values(loaded.times).every(value => value === null), 'every chakra follows the core time by default');

// Values are kept in range and on half-minute steps; unknown chakras are ignored.
assert.deepEqual({ ...T.normalizeTimes({ root: 9, heart: 2.3, crown: 0, sacral: 'x', moon: 3 }) },
    { root: 7, sacral: null, solar: null, heart: 2.5, throat: null, thirdeye: null, crown: 1 });

const state = { timePerChakra: 5, perChakraTimeEnabled: false, perChakraTimes: T.normalizeTimes({ heart: 7, root: 3 }) };
assert.equal(T.minutesFor(state, 'heart'), 5, 'switch off: the core time for every chakra');
state.perChakraTimeEnabled = true;
assert.equal(T.minutesFor(state, 'heart'), 7, 'switch on: the chakra’s own time');
assert.equal(T.minutesFor(state, 'crown'), 5, 'a chakra without its own time follows the core');
state.timePerChakra = 6;
assert.equal(T.minutesFor(state, 'crown'), 6, 'changing the core moves every chakra that follows it');
assert.equal(T.minutesFor(state, 'heart'), 7, '…but not a chakra with its own time');
assert.equal(T.minutesFor(state, 'heart', { demo: true }), 6, 'demo scripts keep the core time');
assert.equal(T.minutesFor(state, 'high_energy'), 6, 'HRIM is not a chakra row');
assert.equal(T.totalMinutes(state, ['root', 'heart', 'crown']), 16);

T.save(storage, state);
const reloaded = T.load(storage);
assert.equal(reloaded.enabled, true);
assert.equal(reloaded.times.heart, 7, 'saved on this device (and so in settings backup, which keeps every chakra_* key)');
assert.match(T.ENABLED_KEY + T.TIMES_KEY, /^chakra_[a-z_]+chakra_[a-z_]+$/);

// Session estimate uses each chakra’s minutes.
assert.equal(E.chakraMinutesTotal(state, ['root', 'heart', 'crown'], false), 16);
assert.equal(E.chakraMinutesTotal(state, ['root', 'heart', 'crown'], true), 18, 'demo: three chakras at the core time');

// Assessment autofill: focus chakras get the core time + 50 %; others follow the core.
const result = {
    focusStatus: 'candidate',
    focusAreas: [{ id: 'heart' }, { id: 'throat' }],
    chakras: ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].map(id => ({ id, evidenceCount: id === 'throat' ? 1 : 3 }))
};
const suggestion = T.suggestFromAssessment(result, 5, 2);
assert.equal(suggestion.status, 'ready');
assert.deepEqual([...suggestion.focus], ['heart'], 'a focus chakra without enough answers is not changed');
assert.equal(suggestion.times.heart, 7, 'core 5 → 7.5 is capped at the 7 min maximum');
assert.equal(T.suggestFromAssessment(result, 3, 2).times.heart, 4.5, 'core 3 → 4.5 min');
assert.equal(suggestion.times.root, null, 'other chakras follow the core');
assert.equal(T.suggestFromAssessment({ focusStatus: 'no-clear-lowest', focusAreas: [], chakras: [] }, 5).status, 'no-clear-focus');
assert.equal(T.suggestFromAssessment(null, 5).status, 'not-enough');

// Wiring.
const html = read('index.html');
const app = read('app.js');
const panel = html.indexOf('id="per-chakra-time-control"');
assert.ok(panel > html.indexOf('id="time-per-chakra"'), 'the panel sits under Core Practice Duration');
assert.ok(html.indexOf('id="time-per-chakra"') > 0, 'Core Practice Duration is kept');
for (const id of ['per-chakra-time-toggle', 'per-chakra-time-rows', 'per-chakra-time-reset', 'per-chakra-time-assessment', 'per-chakra-time-apply']) assert.match(html, new RegExp(`id="${id}"`));
assert.match(html, /id="per-chakra-time-apply"[^>]*hidden/, 'a suggestion is shown first; Apply appears only then');
assert.ok(html.indexOf('modules/chakra-timing.js') < html.indexOf('modules/app-state.js'), 'timing loads before the app state reads it');
assert.match(read('modules/app-state.js'), /perChakraTimeEnabled: get\('chakra_per_chakra_time_enabled'\) === 'true'/);
assert.match(read('modules/chakra-session.js'), /chakraMinutes\(key\)/, 'each chakra runs for its own time');
assert.match(app, /chakraMinutes: getChakraPracticeMinutes/);
assert.match(app, /window\.ChakraTiming\.minutesFor\(state, key, \{ demo: isDemoScriptSelected\(\) \}\)/);
assert.match(read('modules/lobby-experience-visibility.js'), /perChakraTime\.hidden = shots \|\| sleep \|\| highEnergy \|\| musicOnly \|\| focusedExperience \|\| isDemoScriptSelected\(\)/, 'only normal chakra journeys show the panel');
const view = read('modules/chakra-timing-view.js');
assert.match(view, /chakraAssessmentTournamentV1/, 'reads the assessment saved on this device');
assert.match(view, /const shown = timing\.CHAKRA_IDS\.filter\(id => selected\.has\(id\)\);[\s\S]*?for \(const id of shown\)/, 'only chakras chosen in Chakra Journey get a row');
assert.doesNotMatch(view, /is-off/, 'unselected chakras are not shown at all');
assert.match(view, /applyButton\?\.addEventListener\('click', \(\) => \{\s*if \(!pending\) return;/, 'nothing is applied without the Apply tap');
const sw = read('sw.js');
for (const file of ['chakra-timing.js?v=1.0', 'chakra-timing-view.js?v=1.1']) assert.ok(sw.includes(`./modules/${file}`), `${file} works offline`);

const keys = ['perChakraTimeToggle', 'perChakraTimeNote', 'perChakraTimeCore', 'perChakraTimeReset', 'perChakraTimeFromAssessment', 'perChakraTimeApply',
    'perChakraTimeChecking', 'perChakraTimeSuggestion', 'perChakraTimeNoFocus', 'perChakraTimeNoAssessment', 'perChakraTimeApplied', 'perChakraTimeResetDone', 'perChakraTimeNoneSelected'];
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const ui = JSON.parse(read(`locales/${language}.json`)).ui;
    for (const key of keys) assert.ok(ui[key]?.trim(), `${language} has ui.${key}`);
    assert.match(ui.perChakraTimeSuggestion, /\{list\}/, `${language} suggestion keeps its {list} placeholder`);
}
console.log('chakra timing: ok');
