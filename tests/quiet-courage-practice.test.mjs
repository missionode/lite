import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const practiceSource = fs.readFileSync('modules/quiet-courage-practice.js', 'utf8');
const routingSource = fs.readFileSync('modules/journey-routing.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

const context = vm.createContext({});
vm.runInContext(practiceSource, context);
const practice = context.ChakraQuietCouragePractice;
assert.ok(Object.isFrozen(practice));

function make(overrides = {}) {
    const events = [];
    let active = true;
    const args = {
        minutes: 4,
        meditationScreen: { id: 'meditation-screen' },
        opening: 'opening',
        phases: ['notice', 'imagine', 'choose', 'support'],
        title: 'Quiet courage',
        closing: 'closing',
        startSupportTone: () => { events.push('tone:start'); return true; },
        stopSupportTone: () => events.push('tone:stop'),
        showScreen: screen => events.push(`screen:${screen.id}`),
        stopVisual: () => events.push('visual:stop'),
        setTitle: title => events.push(`title:${title}`),
        narrate: async text => events.push(`narrate:${text}`),
        sleep: async ms => events.push(`sleep:${ms}`),
        isActive: () => active,
        ...overrides
    };
    return { args, events, deactivate: () => { active = false; } };
}

const full = make();
await practice.run(full.args);
assert.deepEqual(full.events, [
    'tone:start', 'screen:meditation-screen', 'visual:stop', 'title:Quiet courage', 'narrate:opening',
    'sleep:60000', 'narrate:notice', 'sleep:60000', 'narrate:imagine',
    'sleep:60000', 'narrate:choose', 'sleep:60000', 'narrate:support', 'narrate:closing', 'tone:stop'
], 'the practice must remain private, paced, ordered, and finish with a gentle return');

const cancelled = make({ async narrate(text) {
    cancelled.events.push(`narrate:${text}`);
    if (text === 'opening') cancelled.deactivate();
} });
await practice.run(cancelled.args);
assert.deepEqual(cancelled.events.slice(-2), ['narrate:opening', 'tone:stop'], 'cancellation during the opening stops guidance and fades the support tone');

const failed = make({ async narrate() { throw new Error('narration-failed'); } });
await assert.rejects(practice.run(failed.args), /narration-failed/);
assert.equal(failed.events.at(-1), 'tone:stop', 'narration failure must still cleanly stop the support cue');

const routingContext = vm.createContext({});
vm.runInContext(routingSource, routingContext);
const routing = routingContext.ChakraJourneyRouting;
assert.deepEqual(Array.from(routing.buildPreparationStagePlan({ noting: true, quietCourage: true })), ['noting', 'quietCourage']);
assert.equal(routing.resolveFocusedExperience({ selectedChakraCount: 0, preparationSelected: true }), 'preparation');
assert.equal(routing.validateLobbyStart({ focusedExperience: 'preparation', selectedChakraCount: 0 }).valid, true);

assert.match(html, /id="journey-preparation-addons"[\s\S]*?id="self-exploration-section"[\s\S]*?id="quiet-courage-control"[\s\S]*?id="chakra-selection-panel"/,
    'Self-Exploration must be a separate section below Journey Preparation and above chakra selection');
assert.match(html, /id="self-exploration-section"[^>]* hidden[\s\S]*?id="quiet-courage-addon-toggle"[^>]* disabled[\s\S]*?id="quiet-courage-duration"/,
    'The Advanced Features practice must begin hidden and expose its optional duration only when unlocked');
assert.match(app, /if \(!state\.advancedFeaturesUnlocked && selfExplorationAddonToggles\.some\(toggle => toggle\.checked\)\)[\s\S]*?selfExplorationAddonToggles\.forEach/,
    'stale or directly toggled locked selections must be cleared before launch');
assert.match(app, /async runQuietCourage\(\)[\s\S]*?practiceModuleLoader\.load\('quiet-courage'\)[\s\S]*?quietCouragePhases/);
assert.match(app, /QUIET_COURAGE_SUPPORT_FREQUENCY_HZ = 396/);
assert.match(app, /const supportToneDurationMs = getDroneDurationMs\(minutes, state\.droneDurationMode\)/);
assert.match(app, /startSupportTone: \(\) => state\.noFrequencyMode\s*\? false\s*: this\.audio\.startGuidedTransitionTone\(QUIET_COURAGE_SUPPORT_FREQUENCY_HZ, supportToneDurationMs\)/);
assert.match(app, /stopSupportTone: \(\) => this\.audio\.stopGuidedTransitionTone\(0\.8\)/);
assert.match(serviceWorker, /chakra-v5\.364[\s\S]*?quiet-courage-practice\.js\?v=1\.0/);

for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(fs.readFileSync(`locales/${language}.json`, 'utf8'));
    for (const key of [
        'selfExploration', 'quietCourageAddon', 'quietCourageSubtitle', 'quietCourageDuration', 'quietCourageTitle',
        'quietCourageOpening', 'quietCouragePhases', 'quietCourageClosing', 'roadmapQuietCourage', 'beginQuietCourage'
    ]) assert.ok(locale.ui[key], `${language} must localize ui.${key}`);
    assert.equal(locale.ui.quietCouragePhases.length, 4, `${language} needs four Quiet Courage narration phases`);
    const narration = [locale.ui.quietCourageOpening, ...locale.ui.quietCouragePhases, locale.ui.quietCourageClosing].join(' ');
    assert.doesNotMatch(narration, /\b(he|him|his|she|her|hers|man|woman|boy|girl)\b/i, `${language} narration should not assign a gender`);
}

console.log('Quiet Courage passed: standalone route, ordered preparation, Advanced Features guard, five-language copy, paced narration and cancellation.');
