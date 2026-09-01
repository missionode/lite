import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const readText = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const readJson = (path) => JSON.parse(readText(path));

const app = readText('../app.js');
const html = readText('../index.html');
const serviceWorker = readText('../sw.js');
const manifest = readJson('../language-manifest.json');
const voices = readJson('../piper-models.json');
const englishLocale = readJson('../locales/en.json');
const hindiLocale = readJson('../locales/hi.json');
const scripts = readJson('../scripts.json');

const hindi = manifest.languages.find((language) => language.id === 'hi');
assert.deepEqual(hindi && {
    locale: hindi.locale,
    localeSource: hindi.localeSource,
    contentSource: hindi.contentSource,
    browserPrefixes: hindi.browserPrefixes,
    hasDefaultPiperVoice: Object.hasOwn(hindi, 'defaultPiperVoice'),
}, {
    locale: 'hi-IN',
    localeSource: 'locales/hi.json',
    contentSource: 'scripts.json',
    browserPrefixes: ['hi'],
    hasDefaultPiperVoice: false,
}, 'Hindi must be registered as a complete browser-TTS-only content and display language.');

assert.equal(
    voices.voices.some((voice) => voice.language === 'hi' || voice.locale === 'hi-IN'),
    false,
    'Hindi must not have a Piper voice registry entry.',
);
assert.match(
    app,
    /\{ id: 'hi', locale: 'hi-IN', label: 'हिन्दी', browserPrefixes: \['hi'\] \}/,
    'The manifest fallback must retain Hindi without a Piper default.',
);
assert.match(
    app,
    /const piperVoices = piperVoiceRegistry\.filter\(voice => voice\.language === state\.language\)/,
    'Piper choices must remain filtered to the selected language.',
);
assert.match(
    app,
    /availableVoices\.filter\(voice => voiceMatchesLanguage\(voice\)\)/,
    'Hindi browser voices must use the language-prefix filter.',
);

function flattenShape(value, path = '', result = new Map()) {
    if (Array.isArray(value)) {
        result.set(path, `array:${value.length}`);
        value.forEach((item, index) => flattenShape(item, `${path}[${index}]`, result));
        return result;
    }
    if (value && typeof value === 'object') {
        result.set(path, 'object');
        for (const [key, child] of Object.entries(value)) {
            flattenShape(child, path ? `${path}.${key}` : key, result);
        }
        return result;
    }
    result.set(path, typeof value);
    return result;
}

assert.deepEqual(
    [...flattenShape(hindiLocale)],
    [...flattenShape(englishLocale)],
    'Hindi locale must exactly match the English locale shape and value types.',
);

function placeholders(value) {
    return String(value).match(/\{\{[^{}]+\}\}|\{[^{}]+\}/g) || [];
}

function compareLocaleValues(source, candidate, path = '') {
    if (Array.isArray(source)) {
        source.forEach((item, index) => compareLocaleValues(item, candidate[index], `${path}[${index}]`));
        return;
    }
    if (source && typeof source === 'object') {
        for (const [key, child] of Object.entries(source)) {
            compareLocaleValues(child, candidate[key], path ? `${path}.${key}` : key);
        }
        return;
    }
    if (typeof source === 'string') {
        assert.ok(candidate.trim(), `Hindi locale value ${path} must not be empty.`);
        assert.deepEqual(placeholders(candidate), placeholders(source), `Hindi locale placeholders differ at ${path}.`);
    } else {
        assert.equal(candidate, source, `Hindi locale non-text value differs at ${path}.`);
    }
}

compareLocaleValues(englishLocale, hindiLocale);
assert.match(hindiLocale.language, /[\u0900-\u097F]/, 'Hindi locale must identify itself in Devanagari.');
assert.match(hindiLocale.system.prePracticeSafety, /श्वास|सुरक्षित|सहज/, 'Hindi system guidance must retain the pre-practice safety boundary.');

function assertHindiNarrationSiblings(value, path = '') {
    if (Array.isArray(value)) {
        value.forEach((item, index) => assertHindiNarrationSiblings(item, `${path}[${index}]`));
        return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
        const keyPath = path ? `${path}.${key}` : key;
        if (key.endsWith('_en')) {
            const hindiKey = `${key.slice(0, -3)}_hi`;
            assert.ok(Object.hasOwn(value, hindiKey), `Hindi narration is missing ${keyPath}.`);
            assert.deepEqual(placeholders(value[hindiKey]), placeholders(child), `Hindi narration placeholders differ at ${keyPath}.`);
        }
        if (key === 'en') {
            assert.ok(Object.hasOwn(value, 'hi'), `Hindi narration is missing ${path}.hi.`);
            assert.deepEqual(placeholders(value.hi), placeholders(child), `Hindi narration placeholders differ at ${path}.hi.`);
        }
        assertHindiNarrationSiblings(child, keyPath);
    }
}

assertHindiNarrationSiblings(scripts);
assert.deepEqual(
    ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy'].map((key) => scripts[key].mantra),
    ['LAM', 'VAM', 'RAM', 'YAM', 'HAM', 'OM', 'AUM', 'HRIM'],
    'Canonical mantra identifiers and journey order must remain unchanged.',
);
assert.deepEqual(
    scripts.sleep_mode.stages.map(({ key, frequency, band }) => ({ key, frequency, band })),
    [
        { key: 'drowsiness', frequency: 10, band: 'alpha' },
        { key: 'lightSleep', frequency: 6, band: 'theta' },
        { key: 'trueSleep', frequency: 5, band: 'theta' },
        { key: 'deepSleep', frequency: 2, band: 'delta' },
        { key: 'remRest', frequency: 6, band: 'theta' },
    ],
    'Hindi content must not alter the established sleep-stage sequence.',
);
assert.match(scripts.yoga.intro.hi, /दर्द|चक्कर|संतुलन/, 'Hindi Yoga narration must retain stop boundaries.');
assert.match(scripts.assisted_bathing.instructions.hi, /दर्द|परेशानी|चक्कर|असुविधा/, 'Hindi assisted-care narration must retain stop boundaries.');

const validatorStart = app.indexOf('function getScriptPath(');
const validatorEnd = app.indexOf('let piperVoiceRegistry', validatorStart);
assert.ok(validatorStart >= 0 && validatorEnd > validatorStart, 'Script validator source must remain extractable.');
const validatorContext = { result: null };
vm.runInNewContext(
    `let languageRegistry = [{ id: 'hi' }];\n${app.slice(validatorStart, validatorEnd)}\nresult = validateScriptBundle;`,
    validatorContext,
);

const legacyCustomScript = structuredClone(scripts);
function removeHindi(value) {
    if (Array.isArray(value)) return value.forEach(removeHindi);
    if (!value || typeof value !== 'object') return;
    for (const key of Object.keys(value)) {
        if (key === 'hi' || key.endsWith('_hi')) delete value[key];
        else removeHindi(value[key]);
    }
}
removeHindi(legacyCustomScript);
const fullJourneyOptions = {
    languages: ['hi'],
    highEnergy: true,
    corpse: true,
    bath: true,
    perinealCare: true,
    assistedBathing: true,
    massage: true,
    yoga: true,
    hooponopono: true,
};
assert.equal(
    validatorContext.result(legacyCustomScript, { ...fullJourneyOptions, allowLanguageFallback: true }).valid,
    true,
    'Legacy custom scripts without Hindi must retain the English narration fallback.',
);
assert.equal(
    validatorContext.result(legacyCustomScript, fullJourneyOptions).valid,
    false,
    'Shipped production content must remain strict when Hindi fields are absent.',
);
assert.equal(
    validatorContext.result(scripts, fullJourneyOptions).valid,
    true,
    'Shipped production content must pass the complete Hindi narration contract.',
);

const earnStart = app.indexOf('function cancelEarnHandoff()');
const earnEnd = app.indexOf('function setSymbolImage(', earnStart);
assert.ok(earnStart >= 0 && earnEnd > earnStart, 'Earn scheduler source must remain extractable.');
const earnLink = {
    hidden: false,
    classList: { add() {}, remove() {} },
    focus() {},
};
let scheduledCallbacks = 0;
const earnContext = {
    result: null,
    state: { language: 'hi' },
    document: { getElementById: () => earnLink },
    window: {
        clearTimeout() {},
        setTimeout() {
            scheduledCallbacks += 1;
            return 1;
        },
    },
};
vm.runInNewContext(
    `let earnHandoffTimer = null; const EARN_HANDOFF_DELAY_MS = 3000;\n${app.slice(earnStart, earnEnd)}\nresult = scheduleEarnHandoff;`,
    earnContext,
);
earnContext.result();
assert.equal(scheduledCallbacks, 0, 'Hindi must never schedule the delayed Earn handoff.');
assert.equal(earnLink.hidden, true, 'Hindi must keep Continue to Earn hidden.');

assert.match(html, /app\.js\?v=2\.16/, 'The application query version must be rotated for the current language delivery.');
assert.match(serviceWorker, /chakra-v5\.89/, 'The shell cache must be rotated for the current language delivery.');
assert.match(serviceWorker, /chakra-language-v21/, 'The language cache must be rotated for the current language delivery.');

console.log('Hindi language contract passed.');
