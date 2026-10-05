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
    'roadmapNoting', 'roadmapHooponopono', 'roadmapUndoUnlearn', 'roadmapQuietCourage', 'roadmapConfidenceVisualization',
    'roadmapDeepSecrets', 'roadmapFinalChallenge', 'roadmapReturning', 'roadmapArrival', 'roadmapChakras'
];
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of roadmapKeys) assert.ok(locale.ui[key], `${language} is missing roadmap.${key}`);
}
assert.match(app, /const journeyRoadmap = window\.ChakraJourneyRoadmap/);
assert.match(app, /function getJourneyRoadmapLabels\(\)\s*\{\s*return journeyRoadmap\.resolveLabels\(/);
assert.match(app, /function updateJourneyRoadmap\(\)\s*\{\s*journeyRoadmap\.render\(/);
assert.match(html, /modules\/journey-roadmap\.js\?v=1\.1[\s\S]*?app\.js\?v=4.29/);
assert.match(serviceWorker, /chakra-v5.359[\s\S]*?modules\/journey-roadmap\.js\?v=1\.1/);

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
    'noting-addon-toggle', 'quiet-courage-addon-toggle', 'confidence-visualization-addon-toggle', 'deep-secrets-addon-toggle',
    'final-challenge-addon-toggle', 'hooponopono-experience-toggle', 'undo-unlearn-addon-toggle'
], { selectedChakras: [], journeyVideoPreludeEnabled: true })), [
    'roadmapVideoIntroduction', 'roadmapBoxBreathing', 'roadmapVisualization', 'roadmapDharana',
    'roadmapBodyScan', 'roadmapNoting', 'roadmapQuietCourage', 'roadmapConfidenceVisualization', 'roadmapDeepSecrets',
    'roadmapFinalChallenge', 'roadmapHooponopono', 'roadmapUndoUnlearn'
]);
assert.deepEqual(plain(resolve([
    'box-breathing-experience-toggle', 'visualization-addon-toggle', 'dharana-addon-toggle', 'body-scan-addon-toggle',
    'noting-addon-toggle', 'hooponopono-experience-toggle', 'undo-unlearn-addon-toggle'
], { returningJourney: true, journeyVideoPreludeEnabled: true })), [
    'roadmapVideoIntroduction', 'roadmapReturning', 'roadmapIntention', 'roadmapBoxBreathing', 'roadmapVisualization',
    'roadmapDharana', 'roadmapBodyScan', 'roadmapNoting', 'roadmapChakras',
    'roadmapHooponopono', 'roadmapUndoUnlearn', 'roadmapClosing'
]);
// Dev-mode add-ons with a chakra: they run after Intention and before Chakras, like the other practices.
assert.deepEqual(plain(resolve([
    'quiet-courage-addon-toggle', 'confidence-visualization-addon-toggle', 'deep-secrets-addon-toggle', 'final-challenge-addon-toggle'
])), [
    'roadmapArrival', 'roadmapIntention', 'roadmapQuietCourage', 'roadmapConfidenceVisualization',
    'roadmapDeepSecrets', 'roadmapFinalChallenge', 'roadmapChakras', 'roadmapClosing'
]);
assert.deepEqual(plain(resolve(['reverse-journey-toggle'], { advancedFeaturesUnlocked: true })), [
    'roadmapArrival', 'roadmapIntention', 'reverseJourney', 'roadmapClosing'
], 'dev-mode Reverse Journey names its direction in the roadmap');
assert.deepEqual(plain(resolve(['reverse-journey-toggle'], { advancedFeaturesUnlocked: false })), [
    'roadmapArrival', 'roadmapIntention', 'roadmapChakras', 'roadmapClosing'
], 'a stale Reverse Journey check is ignored while dev mode is locked');
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
