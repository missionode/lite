import assert from 'node:assert/strict';
import fs from 'node:fs';

import vm from 'node:vm';

const content = fs.readFileSync(new URL('../modules/content-localization.js', import.meta.url), 'utf8');
const localeUi = fs.readFileSync(new URL('../modules/locale-ui-renderer.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(content, context);
vm.runInContext(localeUi, context);
const generated = value => context.ChakraContentLocalization.isGeneratedIntention(value, 'Calm', 'Rise');
const shouldRefresh = (value, previous) => context.ChakraContentLocalization.shouldRefreshLocalizedIntention(
    value, previous, state.language, ['en', 'ml', 'ru', 'hi'], generated
);
const state = { language: 'en', displayLanguage: 'en', intention: 'Calm', highEnergyEnabled: false };
const values = [];
const storage = { setItem: (key, value) => values.push([key, value]) };
let localeRenders = 0;
let voiceSetups = 0;
const languageSelect = { addEventListener: (_type, handler) => { languageSelect.change = handler; } };
context.ChakraLocaleUiRenderer.bindPreferenceControls({
    languageSelect, state, storage, shouldRefreshLocalizedIntention: (value, previous) => shouldRefresh(value, previous),
    hrimDefaultIntention: () => 'Rise', defaultIntention: () => 'ശാന്തി', syncValue: (id, value) => values.push([id, value]),
    setupVoices: () => { voiceSetups++; }, autoSelectVoice() {}, applyLocaleUI: () => { localeRenders++; }
});
languageSelect.change({ target: { value: 'ml' } });
assert.equal(state.intention, 'ശാന്തി');
assert.deepEqual(values.slice(-2), [['intention-input', 'ശാന്തി'], ['chakra_intention', 'ശാന്തി']]);
assert.equal(voiceSetups, 1);
assert.equal(localeRenders, 1);
state.intention = 'my private intention';
languageSelect.change({ target: { value: 'hi' } });
assert.equal(state.intention, 'my private intention', 'user-authored intentions remain unchanged across language changes');
assert.equal(values.filter(([key]) => key === 'chakra_intention').length, 1);

console.log('Language intention contract passed.');
