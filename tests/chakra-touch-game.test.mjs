import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/chakra-touch-game.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const loader = fs.readFileSync(new URL('../modules/practice-module-loader.js', import.meta.url), 'utf8');
const context = vm.createContext({ Math });
vm.runInContext(source, context);
const game = context.ChakraTouchGame;
assert.ok(Object.isFrozen(game));

function seeded(seed) {
    let value = seed;
    return () => { value = (value * 1103515245 + 12345) % 2147483648; return value / 2147483648; };
}

// Heat levels add places step by step; genitals are never a zone.
assert.deepEqual(Array.from(game.LEVELS), ['warm', 'close', 'spicy']);
const warm = Array.from(game.zonesForLevel('warm'), zone => zone.id);
const close = Array.from(game.zonesForLevel('close'), zone => zone.id);
const spicy = Array.from(game.zonesForLevel('spicy'), zone => zone.id);
assert.ok(warm.length < close.length && close.length < spicy.length);
assert.ok(warm.every(id => close.includes(id)) && close.every(id => spicy.includes(id)));
for (const id of ['breasts', 'buttocks', 'innerThighs', 'lowerBelly']) {
    assert.ok(!close.includes(id) && spicy.includes(id), `${id} is Spicy only`);
}
assert.doesNotMatch(JSON.stringify(Array.from(game.ZONES)), /genital|penis|vagina|vulva/i);
// Every chakra has at least one zone.
assert.deepEqual([...new Set(Array.from(game.ZONES, zone => zone.chakra))].sort(), ['crown', 'heart', 'root', 'sacral', 'solar', 'thirdeye', 'throat']);

// Consent: default Warm = Yes, higher = Maybe. A No zone is never picked.
let engine = game.createEngine({ random: seeded(5) });
engine.start({ level: 'spicy', rounds: 14, seconds: 30, names: ['A', 'B'] });
assert.equal(engine.game.players[0].consent.hair, 'yes');
assert.equal(engine.game.players[0].consent.breasts, 'maybe');
for (const zone of spicy) if (zone !== 'hands') { engine.setConsent(0, zone, 'no'); engine.setConsent(1, zone, 'no'); }
for (let round = 0; round < 14; round += 1) {
    const current = engine.nextRound();
    assert.ok(current, 'rounds run to the chosen total');
    assert.equal(current.zone, 'hands', 'only a non-No zone can be picked');
    assert.notEqual(current.giver, current.receiver);
    engine.rate('more');
}
assert.equal(engine.nextRound(), null, 'the game ends after the chosen number of rounds');

// All zones No: the round is skipped, never forced.
engine = game.createEngine({ random: seeded(2) });
engine.start({ level: 'warm', rounds: 6 });
for (const zone of warm) engine.setConsent(1, zone, 'no');
let current;
do { current = engine.nextRound(); } while (current && current.receiver !== 1);
assert.equal(current.zone, null);
assert.equal(current.skipped, true);

// Maybe asks first; "not this time" picks another zone and never the declined one.
engine = game.createEngine({ random: seeded(9) });
engine.start({ level: 'close', rounds: 6 });
for (const zone of close) { engine.setConsent(0, zone, 'maybe'); engine.setConsent(1, zone, 'maybe'); }
current = engine.nextRound();
assert.equal(current.needsAsk, true, 'a Maybe zone asks the receiver first');
const declined = current.zone;
engine.declineZone();
assert.notEqual(engine.game.current.zone, declined);

// Roles alternate; swap-roles prompts only in Swap Roles mode; ratings feed the summary.
engine = game.createEngine({ random: () => 0.9 });
engine.start({ level: 'warm', rounds: 6, swapRoles: true, names: ['Asha', 'Ravi'] });
const givers = [];
for (let round = 0; round < 6; round += 1) {
    const next = engine.nextRound();
    givers.push(next.giver);
    assert.ok(next.swapPrompt, 'Swap Roles adds a prompt every round');
    engine.rate(round % 2 ? 'less' : 'more');
}
assert.deepEqual(givers, [0, 1, 0, 1, 0, 1], 'without a luck card the giver alternates');
const summary = engine.summary();
assert.equal(summary.length, 2);
assert.ok(summary.some(player => player.favourites.length > 0), 'the private summary lists "More" places');
engine = game.createEngine({ random: () => 0.9 });
engine.start({ level: 'warm', rounds: 6 });
assert.equal(engine.nextRound().swapPrompt, null, 'no swap prompts unless Swap Roles is on');

// Check-in every three rounds; lowering the level removes higher zones.
engine = game.createEngine({ random: () => 0.9 });
engine.start({ level: 'spicy', rounds: 10 });
for (let round = 0; round < 3; round += 1) { engine.nextRound(); engine.rate('justRight'); }
assert.equal(engine.needsCheckIn(), true);
assert.equal(engine.lowerLevel(), 'close');
assert.equal(engine.game.players[0].consent.breasts, undefined, 'lowering the level removes Spicy places');

// UI safety: Pause on every round screen, Spicy needs both partners, hand-off lock, nothing saved.
assert.match(source, /function pauseButton\(\)/);
assert.match(source, /withPause && engine\.game \? pauseButton\(\)/, 'Pause is on every in-game screen');
assert.match(source, /setup\.level === 'spicy' \? showAdultCheck\(\)/);
assert.match(source, /go\.disabled = !boxes\.every\(item => item\.box\.checked\)/, 'both partners must confirm for Spicy');
assert.match(source, /consentFor\(0, \(\) => consentFor\(1, startSwapIntro\)\)/, 'each partner sets a private map');
assert.match(source, /'pointerdown', start/, 'phone hand-offs use press-and-hold');
assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|fetch\(/, 'nothing is saved or sent');
assert.match(source, /ctSwapEnds/, 'role swap ends with "back to yourselves"');

// Dev mode only, in the Play Zone, lazy and offline.
assert.match(html, /<div id="secret-body-game-panel"[^>]*hidden>[\s\S]*?<button id="open-chakra-touch"[^>]*disabled/);
assert.match(html, /<section id="chakra-touch-screen" class="screen[^"]*hidden"/);
assert.match(app, /chakraTouchButton\.disabled = isLocked/);
assert.match(app, /if \(isLocked && chakraTouchGame\) chakraTouchGame\.close\(\)/);
assert.match(loader, /'chakra-touch': Object\.freeze\(\{ src: '\.\/modules\/chakra-touch-game\.js\?v=1\.0', globalName: 'ChakraTouchGame' \}\)/);
assert.match(sw, /'\.\/modules\/chakra-touch-game\.js\?v=1\.0'/);

// Five languages, every key, placeholders kept, and no he/she wording.
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8')).ui;
const keys = Object.keys(en).filter(key => key.startsWith('ct') || key === 'chakraTouch' || key === 'chakraTouchNote');
assert.ok(keys.length >= 120);
for (const zone of game.ZONES) assert.ok(keys.includes(`ctZone_${zone.id}`));
for (const touch of game.TOUCHES) assert.ok(keys.includes(`ctTouch_${touch.id}`) && keys.includes(`ctTouch_${touch.id}_note`));
for (const card of game.LUCK_CARDS) assert.ok(keys.includes(`ctLuck_${card}`));
for (const prompt of game.SWAP_PROMPTS) assert.ok(keys.includes(`ctSwapPrompt_${prompt}`));
const placeholders = value => [...new Set(String(value).match(/\{\{\w+\}\}/g) || [])].sort().join();
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8')).ui;
    for (const key of keys) {
        assert.ok(ui[key]?.trim(), `${language} is missing ui.${key}`);
        assert.equal(placeholders(ui[key]), placeholders(en[key]), `${language} ui.${key} keeps its placeholders`);
    }
}
assert.doesNotMatch(keys.map(key => en[key]).join(' '), /\b(he|she|him|her|his|hers|man|woman)\b/i, 'gender-neutral wording');

console.log('Chakra Touch passed: heat levels, private consent map, Maybe asks, No never picked, Pause, Spicy double confirm, Swap Roles, check-ins, summary and five languages.');
