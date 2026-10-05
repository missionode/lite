import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const handlers = new Map();
const elements = new Map();
for (const id of ['no-frequency-mode-toggle', 'no-mantra-mode-toggle', 'mixer-no-frequency-mode-toggle', 'mixer-no-mantra-mode-toggle', 'mood-relaxation-intention-toggle']) {
    const element = { checked: false, disabled: false, addEventListener(type, handler) { handlers.set(`${id}:${type}`, handler); } };
    elements.set(id, element);
}
const calls = [];
const state = { noFrequencyMode: false, noMantraMode: false, moodRelaxationIntentionEnabled: true, bgMusicMode: false };
const context = {
    document: { getElementById: id => elements.get(id) || null },
    localStorage: { setItem: (key, value) => calls.push(['store', key, value]) },
    ChakraAudioModeSettingsView: undefined
};
vm.runInNewContext(readFileSync('modules/audio-mode-settings-view.js', 'utf8'), context);
const view = context.ChakraAudioModeSettingsView.create({
    state,
    meditation: { isMeditationActive: false, cancelDroneTimer: () => calls.push('cancel-drone-timer') },
    audio: Object.fromEntries(['stopDrone', 'stopFrequencyShot', 'stopGuidedTransitionTone', 'stopPleasureAmbience', 'startPleasureAmbience', 'stopMantraTrack'].map(name => [name, () => calls.push(name)])),
    syncChecked: (id, value) => { calls.push(['sync', id, value]); const el = elements.get(id); if (el) el.checked = value; },
    syncPleasureAmbienceControl: () => calls.push('sync-ambience'),
    updateExperienceModeVisibility: () => calls.push('visibility'),
    updateSessionEstimate: () => calls.push('estimate')
});

view.bindPrimaryControls();
view.bindMixerControls();
assert.equal(handlers.size, 4, 'both Lobby and mixer controls should be bound');
elements.get('no-frequency-mode-toggle').checked = true;
handlers.get('no-frequency-mode-toggle:change')({ target: elements.get('no-frequency-mode-toggle') });
assert.equal(state.noFrequencyMode, true);
assert.equal(elements.get('mood-relaxation-intention-toggle').disabled, true);
assert.deepEqual(calls.filter(item => typeof item === 'string'), ['cancel-drone-timer', 'stopDrone', 'stopFrequencyShot', 'stopGuidedTransitionTone', 'stopPleasureAmbience', 'sync-ambience', 'visibility', 'estimate']);

calls.length = 0;
elements.get('mixer-no-mantra-mode-toggle').checked = true;
handlers.get('mixer-no-mantra-mode-toggle:change')({ target: elements.get('mixer-no-mantra-mode-toggle') });
assert.equal(state.noMantraMode, true);
assert.deepEqual(calls.filter(item => typeof item === 'string'), ['cancel-drone-timer', 'stopDrone', 'stopMantraTrack', 'visibility', 'estimate']);

calls.length = 0;
state.noFrequencyMode = true;
state.moodRelaxationIntentionEnabled = true;
state.bgMusicMode = false;
// Re-enable only exercises the active-journey ambience branch in isolation.
const activeContext = {
    document: context.document,
    localStorage: context.localStorage,
    ChakraAudioModeSettingsView: context.ChakraAudioModeSettingsView
};
const activeView = activeContext.ChakraAudioModeSettingsView.create({
    state,
    meditation: { isMeditationActive: true, cancelDroneTimer() {} },
    audio: { startPleasureAmbience: () => { calls.push('start-ambience'); return Promise.resolve(); } },
    syncChecked() {}, syncPleasureAmbienceControl() {}, updateExperienceModeVisibility() {}, updateSessionEstimate() {}
});
activeView.bindPrimaryControls();
elements.get('no-frequency-mode-toggle').checked = false;
handlers.get('no-frequency-mode-toggle:change')({ target: elements.get('no-frequency-mode-toggle') });
assert.ok(calls.includes('start-ambience'), 're-enabling frequency during an eligible active journey restores ambience');

console.log('Audio mode settings view passed: mirrored Lobby/mixer controls, persisted guards and audio side effects.');

// Lobby frequency reminder: shows on/off above Begin, with a one-tap switch.
{
    const nodes = new Map();
    const listeners = {};
    const node = id => {
        const el = { id, textContent: '', attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, addEventListener(type, fn) { listeners[`${id}:${type}`] = fn; } };
        nodes.set(id, el);
        return el;
    };
    const box = node('frequency-reminder');
    box.dataset = {};
    const icon = { textContent: '' };
    box.querySelector = selector => selector === '.frequency-reminder-icon' ? icon : null;
    ['frequency-reminder-title', 'frequency-reminder-note', 'frequency-reminder-toggle', 'no-frequency-mode-toggle', 'mixer-no-frequency-mode-toggle'].forEach(node);
    const store = [];
    const reminderState = { noFrequencyMode: true, noMantraMode: false, moodRelaxationIntentionEnabled: false, bgMusicMode: false };
    const reminderContext = { document: { getElementById: id => nodes.get(id) || null }, localStorage: { setItem: (key, value) => store.push([key, String(value)]) } };
    vm.runInNewContext(readFileSync('modules/audio-mode-settings-view.js', 'utf8'), reminderContext);
    const synced = [];
    const reminderView = reminderContext.ChakraAudioModeSettingsView.create({
        state: reminderState,
        meditation: { isMeditationActive: false, cancelDroneTimer() {} },
        audio: { stopDrone() {}, stopFrequencyShot() {}, stopGuidedTransitionTone() {}, stopPleasureAmbience() {} },
        syncChecked: (id, value) => synced.push([id, value]),
        syncPleasureAmbienceControl() {}, updateExperienceModeVisibility() {}, updateSessionEstimate() {},
        translate: key => `T:${key}`
    });
    reminderView.bindLobbyReminder();
    assert.equal(box.dataset.state, 'off', 'No Frequency Mode on shows the "tones are off" reminder');
    assert.equal(icon.textContent, '🔇');
    assert.equal(nodes.get('frequency-reminder-title').textContent, 'T:ui.freqReminderOffTitle');
    assert.equal(nodes.get('frequency-reminder-note').attrs['data-i18n'], 'ui.freqReminderOffNote', 'the text follows later language changes');
    assert.equal(nodes.get('frequency-reminder-toggle').textContent, 'T:ui.freqReminderTurnOn');
    listeners['frequency-reminder-toggle:click']();
    assert.equal(reminderState.noFrequencyMode, false, 'one tap in the Lobby turns tones on');
    assert.deepEqual(store.at(-1), ['chakra_no_frequency_mode', 'false'], 'the choice is saved like the Settings toggle');
    assert.ok(synced.some(([id, value]) => id === 'no-frequency-mode-toggle' && value === false), 'Settings checkbox stays in sync');
    assert.equal(box.dataset.state, 'on');
    assert.equal(icon.textContent, '🎵');
    assert.equal(nodes.get('frequency-reminder-toggle').textContent, 'T:ui.freqReminderTurnOff');
    assert.equal(nodes.get('frequency-reminder-toggle').attrs['aria-pressed'], 'true');
}
const lobbyHtml = readFileSync('index.html', 'utf8');
assert.match(lobbyHtml, /id="frequency-reminder"[\s\S]*?id="frequency-reminder-toggle"[\s\S]*?<div class="lobby-actions[^"]*">\s*<button id="start-meditation"/, 'the reminder sits just above Begin');
const appSource = readFileSync('app.js', 'utf8');
assert.match(appSource, /audioModeSettingsView\.bindLobbyReminder\(\)/);
assert.match(appSource, /state\.noFrequencyMode = getChecked\('no-frequency-mode-toggle'\);\s*audioModeSettingsView\.renderFrequencyReminder\(\);/, 'saving Settings refreshes the reminder');
console.log('Lobby frequency reminder passed: on/off state, icon, translated text, one-tap switch, saved choice and Settings sync.');
