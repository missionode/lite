import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const selectionView = fs.readFileSync(new URL('../modules/chakra-selection-view.js', import.meta.url), 'utf8');
const lobbyVisibility = fs.readFileSync(new URL('../modules/lobby-experience-visibility.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

const configStart = html.indexOf('<section id="config-screen"');
const lobbyStart = html.indexOf('<section id="lobby-screen"');
const selectionStart = html.indexOf('id="chakra-selection-panel"');
assert.ok(configStart >= 0 && lobbyStart > configStart, 'Settings and Lobby screens should remain present');
assert.ok(selectionStart > lobbyStart, 'Chakra selection should belong to the Meditation Room Lobby');
assert.ok(selectionStart < html.indexOf('</section>', lobbyStart), 'Chakra selection should be inside the Lobby');
assert.doesNotMatch(
    html.slice(configStart, lobbyStart),
    /id="chakra-selection-panel"|id="chakra-selection"/,
    'Settings should no longer contain chakra selection controls',
);
for (const chakra of ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']) {
    assert.match(html, new RegExp(`id="chakra-selection"[\\s\\S]*?value="${chakra}"`), `${chakra} should remain selectable`);
}
assert.match(selectionView, /function persist\(\)[\s\S]*?storage\.setItem\('chakra_selected'/, 'Room selection should persist immediately');
assert.match(app, /chakraSelectionView\.bindPersistence\(\)/, 'Room selection should bind persistence on change');
assert.match(app, /chakraSelectionView\.bindChipDisplay\(\)/, 'Room selection should retain its active chip display');
assert.match(lobbyVisibility, /const hideForShots = \[[^\]]*'chakra-selection-panel'/, 'Chakra selection should be hidden when Shots is active');
for (const locale of [en, ml]) {
    assert.ok(locale.ui.chakraJourney?.trim(), 'Chakra Journey label is required');
    assert.ok(locale.ui.chakraSelectionHelp?.trim(), 'Chakra selection guidance is required');
}

console.log('Meditation Room chakra-selection contract passed.');
