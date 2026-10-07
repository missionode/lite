import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const practiceSource = fs.readFileSync('modules/self-exploration-practices.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const routingSource = fs.readFileSync('modules/journey-routing.js', 'utf8');
const routingContext = {};
vm.runInNewContext(routingSource, routingContext);
const routing = routingContext.ChakraJourneyRouting;

const planned = routing.buildPreparationStagePlan({
    noting: true, quietCourage: true, confidenceVisualization: true, deepSecrets: true, finalChallenge: true
});
assert.deepEqual(Array.from(planned), ['noting', 'quietCourage', 'confidenceVisualization', 'deepSecrets'], 'the optional-service offer is no longer a journey stage');
assert.equal(routing.resolveFocusedExperience({ selectedChakraCount: 0, preparationSelected: true }), 'preparation');
assert.match(html, /id="self-exploration-section"[\s\S]*?id="quiet-courage-addon-toggle"[\s\S]*?id="confidence-visualization-addon-toggle"[\s\S]*?id="deep-secrets-addon-toggle"[\s\S]*?id="chakra-selection-panel"/);
assert.doesNotMatch(html, /final-challenge/, 'the Final Challenge journey step and its modal are gone');
assert.match(html, /id="optional-service-info-panel"[^>]*hidden/, 'the optional-service card is a standalone Lobby card, hidden by default');
assert.doesNotMatch(app, /finalChallenge/, 'no journey runner for the optional-service offer');
assert.match(sw, /chakra-v5\.372[\s\S]*?modules\/self-exploration-practices\.js\?v=1\.1/);
assert.doesNotMatch(practiceSource, /getUserMedia|MediaRecorder|localStorage|indexedDB|fetch\(/, 'spoken self-expression must not capture, persist, or upload speech');

for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const ui = JSON.parse(fs.readFileSync(`locales/${language}.json`, 'utf8')).ui;
    for (const key of [
        'confidenceVisualizationAddon', 'confidenceVisualizationOpening', 'confidenceVisualizationSteps', 'confidenceVisualizationClosing',
        'deepSecretsAddon', 'deepSecretsOpening', 'deepSecretsInvitation', 'deepSecretsClosing',
        'optionalServiceTitle', 'optionalServiceNote', 'optionalServiceQuestion', 'optionalServiceYes', 'optionalServiceNo', 'skipForNow',
        'optionalServiceYesFeedback', 'optionalServiceNoFeedback', 'selfExplorationStep',
        'roadmapConfidenceVisualization', 'roadmapDeepSecrets'
    ]) assert.ok(ui[key], `${language} requires ${key}`);
    assert.equal(ui.confidenceVisualizationSteps.length, 3);
}

const context = {};
vm.runInNewContext(practiceSource, context);
const practice = context.ChakraSelfExplorationPractices;
function element() {
    const classes = new Set();
    return {
        listeners: new Map(), textContent: '',
        classList: { add: key => classes.add(key), remove: key => classes.delete(key), contains: key => classes.has(key) },
        addEventListener(type, callback) { this.listeners.set(type, callback); },
        removeEventListener(type, callback) { if (this.listeners.get(type) === callback) this.listeners.delete(type); },
        focus() {}
    };
}

assert.equal(practice.finalChallenge, undefined, 'the practice module no longer offers a Final Challenge');

console.log('Self-Exploration practices pass: ordered/standalone route, five-language copy, no capture/storage; the optional-service offer is a standalone Lobby card, not a journey stage.');
