import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/eye-shooter-game.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const loader = fs.readFileSync(new URL('../modules/practice-module-loader.js', import.meta.url), 'utf8');

const context = vm.createContext({});
vm.runInContext(source, context);
const game = context.ChakraEyeShooterGame;
assert.ok(Object.isFrozen(game), 'frozen API');

// Owner-approved points table: easy spots give fewer points, hard spots more.
const table = Object.fromEntries(Array.from(game.SPOT_TIERS, tier => [tier.points, Array.from(tier.spots)]));
assert.deepEqual(table, {
    1: ['ears', 'back', 'hair'],
    2: ['nose', 'chin', 'shoulders'],
    3: ['lips', 'navel', 'armpits'],
    4: ['breasts'],
    5: ['eyes', 'pubicMound']
});
assert.equal(game.pointsFor('eyes'), 5);
assert.equal(game.pointsFor('ears'), 1);
assert.equal(game.pointsFor('unknown'), 0);
const allSpots = Array.from(game.SPOT_TIERS).flatMap(tier => Array.from(tier.spots));
assert.equal(new Set(allSpots).size, allSpots.length, 'each spot appears once');

// How much to play: a points goal, Medium by default.
assert.deepEqual(Array.from(game.GOALS, goal => [goal.id, goal.points]), [['short', 15], ['medium', 30], ['long', 50]]);
assert.equal(game.DEFAULT_GOAL, 'medium');
assert.equal(game.HOLD_SECONDS, 3, 'look and hold for 3 seconds, then blink');

// Explanation only: no camera, no eye tracking, nothing saved.
assert.doesNotMatch(source, /getUserMedia|localStorage|sessionStorage|indexedDB/, 'no camera and no storage');

// Dev mode only, in the Play Zone, lazy and offline.
assert.match(html, /<div id="secret-body-game-panel"[^>]*hidden>[\s\S]*?<button id="open-eye-shooter"[^>]*disabled/, 'the Eye Shooter card sits in the hidden Play Zone with a disabled button');
assert.match(html, /<section id="eye-shooter-screen" class="screen[^"]*hidden"/);
assert.match(app, /eyeShooterButton\.disabled = isLocked/, 'locking dev mode disables the game');
assert.match(app, /if \(isLocked && eyeShooterGame\) eyeShooterGame\.close\(\)/, 'locking dev mode closes the game');
assert.match(app, /practiceModuleLoader\.load\('eye-shooter'\)/);
assert.match(loader, /'eye-shooter': Object\.freeze\(\{ src: '\.\/modules\/eye-shooter-game\.js\?v=1\.0', globalName: 'ChakraEyeShooterGame' \}\)/);
assert.match(sw, /'\.\/modules\/eye-shooter-game\.js\?v=1\.0'/, 'works offline');

// Five languages.
const keys = ['eyeShooter', 'eyeShooterNote', 'esOpen', 'esTitle', 'esWhat', 'esHowTitle', 'esStep1', 'esStep2', 'esStep3', 'esStep4',
    'esPointsTitle', 'esPointsLabel', 'esGoalTitle', 'esGoalNote', 'esTips', 'esPartner', 'esDone',
    ...Array.from(game.GOALS, goal => `esGoal_${goal.id}`), ...allSpots.map(spot => `esSpot_${spot}`)];
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of keys) assert.ok(locale.ui[key], `${language} is missing ui.${key}`);
    assert.match(locale.ui.esStep2, /\{\{seconds\}\}/, `${language} step 2 shows the hold time`);
    assert.match(locale.ui.esGoalNote, /\{\{points\}\}/, `${language} goal note shows the points`);
}

console.log('Contactless Eye Shooter passed: points table, goals, explanation only, dev-mode Play Zone card and five locales.');
