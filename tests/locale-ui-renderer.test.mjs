import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/locale-ui-renderer.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const renderer = context.ChakraLocaleUiRenderer;
assert.ok(Object.isFrozen(renderer), 'locale UI renderer API should be immutable');

class Element {
    constructor({ dataset = {}, childNodes = [] } = {}) {
        this.dataset = dataset;
        this.childNodes = childNodes;
        this.attributes = {};
        this.textContent = '';
    }
    setAttribute(name, value) { this.attributes[name] = value; }
}
const translatedText = new Element();
translatedText.dataset = { i18n: 'ui.translated' };
const staleText = new Element();
staleText.dataset = { i18n: 'ui.newKey' };
staleText.textContent = 'Readable fallback';
const ariaElement = new Element();
ariaElement.dataset = { i18nAriaLabel: 'ui.close' };
const controlText = { nodeType: 3, textContent: ' Original label' };
const controlLabel = { childNodes: [controlText] };
const control = { closest: selector => selector === 'label' ? controlLabel : null };
const ids = new Map([
    ['audio-filters-toggle', control],
    ['experiment-guided-group', {}],
    ['experiment-care-group', {}],
    ['intention-input', {}],
    ['pleasure-ambience-url', {}]
]);
const selectors = new Map([
    ['#config-screen > .subtitle', new Element()],
    ['label[for="language-select"]', new Element()],
    ['label[for="display-language-select"]', new Element()]
]);
const stats = [new Element(), new Element()];
const document = {
    title: '',
    getElementById: id => ids.get(id) || null,
    querySelector: selector => selectors.get(selector) || null,
    querySelectorAll(selector) {
        if (selector === '.stat-lbl') return stats;
        if (selector === '[data-i18n]') return [translatedText, staleText];
        if (selector === '[data-i18n-aria-label]') return [ariaElement];
        return [];
    }
};
const writes = [];
const order = [];
const button = () => ({ textContent: '' });
const testVoiceButton = button();
const settingsButton = button();
const consultationButton = button();
const t = key => key === 'ui.newKey' ? key : `L:${key}`;

renderer.render({
    document,
    translate: t,
    setText: (id, text) => writes.push([id, text]),
    testVoiceButton,
    settingsButton,
    consultationButton,
    refreshJourneyRoadmap: () => order.push('roadmap'),
    refreshDroneDurationSummary: () => order.push('drone-summary')
});

assert.equal(document.title, 'L:ui.chakraMeditation');
assert.deepEqual(writes.map(([id]) => id), [
    'app-title', 'lobby-title', 'completion-title', 'completion-message', 'continue-to-earn',
    'close-completion', 'returning-journey-label', 'save-config', 'start-meditation'
]);
assert.equal(selectors.get('#config-screen > .subtitle').textContent, 'L:ui.settingsSubtitle');
assert.equal(selectors.get('label[for="language-select"]').textContent, 'L:ui.meditationLanguage');
assert.equal(selectors.get('label[for="display-language-select"]').textContent, 'L:ui.displayLanguage');
assert.equal(testVoiceButton.textContent, 'L:ui.previewVoice');
assert.equal(settingsButton.textContent, 'L:ui.settings');
assert.equal(consultationButton.textContent, 'L:ui.beginConsultation');
assert.equal(ids.get('experiment-guided-group').label, 'L:ui.experimentGuidedPractice');
assert.equal(ids.get('experiment-care-group').label, 'L:ui.experimentCare');
assert.equal(stats[0].textContent, 'L:ui.sessionTime');
assert.equal(stats[1].textContent, 'L:ui.sessionTime');
assert.equal(ids.get('intention-input').placeholder, 'L:ui.intentionPlaceholder');
assert.equal(ids.get('pleasure-ambience-url').placeholder, 'L:ui.pleasureAmbienceUrlPlaceholder');
assert.equal(translatedText.textContent, 'L:ui.translated');
assert.equal(staleText.textContent, 'Readable fallback', 'stale translation bundles must preserve readable fallback text');
assert.equal(ariaElement.attributes['aria-label'], 'L:ui.close');
assert.equal(controlText.textContent, ' L:ui.audioFilters');
assert.deepEqual(order, ['roadmap', 'drone-summary'], 'adjacent app-owned summaries retain their refresh order');
assert.match(app, /const localeUiRenderer = window\.ChakraLocaleUiRenderer/);
assert.match(app, /function applyLocaleUI\(\)\s*\{[\s\S]*?particleField\.updateSkyLocationStatus\(\)[\s\S]*?localeUiRenderer\.render\([\s\S]*?refreshJourneyRoadmap: updateJourneyRoadmap[\s\S]*?refreshDroneDurationSummary: updateDroneDurationSummary/);
assert.match(html, /modules\/locale-ui-renderer\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.01/);
assert.match(serviceWorker, /chakra-v5\.297[\s\S]*?modules\/locale-ui-renderer\.js\?v=1\.0/);
assert.throws(() => renderer.render({}), /requires document, translation and text services/);
console.log('Locale UI renderer contract passed: display text, stale-bundle fallback, controls, aria labels and refresh ordering.');
