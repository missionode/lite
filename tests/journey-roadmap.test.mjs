import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/journey-roadmap.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const roadmapKeys = [
    'roadmapVideoIntroduction', 'roadmapMusicOnly', 'roadmapPerineal', 'roadmapMassageReverse', 'roadmapAssistedBathing',
    'roadmapCorpse', 'roadmapBath', 'roadmapRestBeforeYoga', 'roadmapYoga', 'roadmapSleep', 'roadmapDrowsiness',
    'roadmapLightSleep', 'roadmapTrueSleep', 'roadmapDeepSleep', 'roadmapRemRest', 'roadmapIntention', 'roadmapHrim',
    'roadmapClosing', 'roadmapBoxBreathing', 'roadmapVisualization', 'roadmapDharana', 'roadmapBodyScan',
    'roadmapNoting', 'roadmapHooponopono', 'roadmapUndoUnlearn', 'roadmapReturning', 'roadmapArrival', 'roadmapChakras'
];
for (const language of ['en', 'ml', 'hi', 'ru']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of roadmapKeys) assert.ok(locale.ui[key], `${language} is missing roadmap.${key}`);
}
assert.match(app, /const journeyRoadmap = window\.ChakraJourneyRoadmap/);
assert.match(app, /function getJourneyRoadmapLabels\(\)\s*\{\s*return journeyRoadmap\.resolveLabels\(/);
assert.match(app, /function updateJourneyRoadmap\(\)\s*\{\s*journeyRoadmap\.render\(/);
assert.match(html, /modules\/journey-roadmap\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.05/);
assert.match(serviceWorker, /chakra-v5\.301[\s\S]*?modules\/journey-roadmap\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const roadmap = context.ChakraJourneyRoadmap;
assert.ok(Object.isFrozen(roadmap));

const resolve = (checks = [], state = {}) => roadmap.resolveLabels({
    state: { selectedChakras: ['root'], returningJourney: false, journeyVideoPreludeEnabled: false, ...state },
    isChecked: id => checks.includes(id),
    translate: key => key.replace(/^ui\./, '')
});
const plain = labels => JSON.parse(JSON.stringify(labels));

assert.deepEqual(plain(resolve(['music-only-toggle'], { journeyVideoPreludeEnabled: true })), ['roadmapVideoIntroduction', 'roadmapMusicOnly']);
assert.deepEqual(plain(resolve(['perineal-care-toggle', 'massage-toggle', 'assisted-bathing-toggle'])), [
    'roadmapPerineal', 'roadmapMassageReverse', 'roadmapAssistedBathing'
]);
assert.deepEqual(plain(resolve(['yoga-experience-toggle', 'corpse-pose-toggle', 'bath-session-toggle'])), [
    'roadmapCorpse', 'roadmapBath', 'roadmapRestBeforeYoga', 'roadmapYoga'
]);
assert.deepEqual(plain(resolve(['sleep-mode-toggle'])), [
    'roadmapSleep', 'roadmapDrowsiness', 'roadmapLightSleep', 'roadmapTrueSleep', 'roadmapDeepSleep', 'roadmapRemRest'
]);
assert.deepEqual(plain(resolve(['high-energy-toggle'])), ['roadmapIntention', 'roadmapHrim', 'roadmapClosing']);
assert.deepEqual(plain(resolve([
    'box-breathing-experience-toggle', 'visualization-addon-toggle', 'dharana-addon-toggle', 'body-scan-addon-toggle',
    'noting-addon-toggle', 'hooponopono-experience-toggle', 'undo-unlearn-addon-toggle'
], { selectedChakras: [], journeyVideoPreludeEnabled: true })), [
    'roadmapVideoIntroduction', 'roadmapBoxBreathing', 'roadmapVisualization', 'roadmapDharana',
    'roadmapBodyScan', 'roadmapNoting', 'roadmapHooponopono', 'roadmapUndoUnlearn'
]);
assert.deepEqual(plain(resolve([
    'box-breathing-experience-toggle', 'visualization-addon-toggle', 'dharana-addon-toggle', 'body-scan-addon-toggle',
    'noting-addon-toggle', 'hooponopono-experience-toggle', 'undo-unlearn-addon-toggle'
], { returningJourney: true, journeyVideoPreludeEnabled: true })), [
    'roadmapVideoIntroduction', 'roadmapBoxBreathing', 'roadmapVisualization', 'roadmapDharana',
    'roadmapBodyScan', 'roadmapNoting', 'roadmapReturning', 'roadmapIntention', 'roadmapChakras',
    'roadmapHooponopono', 'roadmapUndoUnlearn', 'roadmapClosing'
]);
assert.deepEqual(plain(resolve([], { selectedChakras: [] })), [
    'roadmapArrival', 'roadmapIntention', 'roadmapChakras', 'roadmapClosing'
]);

const target = { textContent: '' };
assert.equal(roadmap.render({
    document: { getElementById: id => id === 'journey-roadmap' ? target : null },
    state: { selectedChakras: ['heart'], returningJourney: false, journeyVideoPreludeEnabled: false },
    isChecked: () => false,
    translate: key => key
}), true);
assert.equal(target.textContent, 'ui.roadmapArrival » ui.roadmapIntention » ui.roadmapChakras » ui.roadmapClosing');
assert.equal(roadmap.render({ document: { getElementById: () => null } }), false, 'missing roadmap target remains a no-op');
assert.throws(() => roadmap.resolveLabels({}), /requires state, selection and translation services/);
assert.throws(() => roadmap.render({}), /requires a document/);
console.log('Journey roadmap passed: exclusive, care, Yoga, Sleep, HRIM, standalone, guided/returning paths, video prefix, rendering and offline delivery.');
