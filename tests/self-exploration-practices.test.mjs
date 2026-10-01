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
assert.deepEqual(Array.from(planned), ['noting', 'quietCourage', 'confidenceVisualization', 'deepSecrets', 'finalChallenge']);
assert.equal(routing.resolveFocusedExperience({ selectedChakraCount: 0, preparationSelected: true }), 'preparation');
assert.match(html, /id="self-exploration-section"[\s\S]*?id="quiet-courage-addon-toggle"[\s\S]*?id="confidence-visualization-addon-toggle"[\s\S]*?id="deep-secrets-addon-toggle"[\s\S]*?id="final-challenge-addon-toggle"[\s\S]*?id="chakra-selection-panel"/);
assert.match(html, /id="final-challenge-modal"[^>]*role="dialog"[^>]*aria-modal="true"/);
assert.match(app, /confidenceVisualization: state\.advancedFeaturesUnlocked && getChecked\('confidence-visualization-addon-toggle'\)[\s\S]*?deepSecrets:[\s\S]*?finalChallenge:/);
assert.match(sw, /chakra-v5\.343[\s\S]*?modules\/self-exploration-practices\.js\?v=1\.0/);
assert.doesNotMatch(practiceSource, /getUserMedia|MediaRecorder|localStorage|indexedDB|fetch\(/, 'spoken self-expression must not capture, persist, or upload speech');

for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const ui = JSON.parse(fs.readFileSync(`locales/${language}.json`, 'utf8')).ui;
    for (const key of [
        'confidenceVisualizationAddon', 'confidenceVisualizationOpening', 'confidenceVisualizationSteps', 'confidenceVisualizationClosing',
        'deepSecretsAddon', 'deepSecretsOpening', 'deepSecretsInvitation', 'deepSecretsClosing',
        'finalChallengeQuestion', 'finalChallengeYes', 'finalChallengeNo', 'skipForNow',
        'finalChallengeYesFeedback', 'finalChallengeNoFeedback', 'finalChallengeSkipFeedback', 'selfExplorationStep',
        'roadmapConfidenceVisualization', 'roadmapDeepSecrets', 'roadmapFinalChallenge'
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

const modal = element(), countdown = element(), question = element(), yes = element(), no = element(), skip = element(), feedback = element();
let countdownTicks = 0;
const result = await practice.finalChallenge({
    elements: { modal, countdown, question, yes, no, skip, feedback },
    copy: { yesFeedback: 'after-session-info', noFeedback: 'continue', skipFeedback: 'continue' },
    isActive: () => true,
    sleep: async ms => {
        if (ms === 1000) countdownTicks++;
        if (ms === 200) yes.listeners.get('click')?.();
    }
});
assert.equal(countdownTicks, 5, 'The final question follows the short five-second countdown.');
assert.equal(result, 'yes');
assert.equal(feedback.textContent, 'after-session-info');
assert.equal(modal.classList.contains('hidden'), true, 'The dialog closes after the transient choice.');
assert.equal(yes.listeners.size, 0, 'Choice handlers are removed after the task.');

const cancelElements = { modal: element(), countdown: element(), question: element(), yes: element(), no: element(), skip: element(), feedback: element() };
let active = true, ticks = 0;
const cancelled = practice.finalChallenge({
    elements: cancelElements, copy: {}, isActive: () => active,
    sleep: async () => { if (++ticks === 2) active = false; }
});
assert.equal(await cancelled, null, 'Journey stop/skip cancels the countdown without opening the question.');
assert.equal(cancelElements.modal.classList.contains('hidden'), true, 'Cancellation always closes the popup.');

console.log('Self-Exploration challenges pass: ordered/standalone route, five-language copy, no capture/storage, transient choice and cancellation cleanup.');
