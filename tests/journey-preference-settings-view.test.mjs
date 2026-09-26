import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/journey-preference-settings-view.js?v=1.0') < html.indexOf('app.js?v='), 'view module must load before the app');
assert.match(worker, /modules\/journey-preference-settings-view\.js\?v=1\.0/, 'view module must be precached offline');

const events = new Map();
const elements = new Map(['returning-journey-toggle', 'journey-video-prelude-toggle'].map(id => [id, {
    addEventListener(type, handler) { events.set(`${id}:${type}`, handler); }
}]));
const writes = [];
let roadmapUpdates = 0;
const state = { returningJourney: false, journeyVideoPreludeEnabled: false };
const context = {
    document: { getElementById: id => elements.get(id) || null },
    localStorage: { setItem: (...args) => writes.push(args) }
};
vm.runInNewContext(readFileSync('modules/journey-preference-settings-view.js', 'utf8'), context);
context.ChakraJourneyPreferenceSettingsView.bind({
    state, updateJourneyRoadmap: () => roadmapUpdates++
});

events.get('returning-journey-toggle:change')({ target: { checked: true } });
events.get('journey-video-prelude-toggle:change')({ target: { checked: true } });
assert.equal(state.returningJourney, true);
assert.equal(state.journeyVideoPreludeEnabled, true);
assert.deepEqual(writes, [
    ['chakra_returning_journey', 'true'],
    ['chakra_journey_video_prelude', 'true']
]);
assert.equal(roadmapUpdates, 2, 'each preference change refreshes the roadmap once');
console.log('Journey preference settings view passed: persisted toggles and roadmap refresh.');
