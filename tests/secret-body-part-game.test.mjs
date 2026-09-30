import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/secret-body-part-game.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const loader = fs.readFileSync(new URL('../modules/practice-module-loader.js', import.meta.url), 'utf8');

const context = vm.createContext({ Math });
vm.runInContext(source, context);
const game = context.ChakraSecretBodyPartGame;
assert.ok(Object.isFrozen(game), 'the module exposes a frozen API');

// Players are chakras, in Root → Crown order, up to seven.
assert.deepEqual(Array.from(game.CHAKRAS, chakra => chakra.id), ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']);
assert.equal(game.MAX_PLAYERS, 7);
assert.equal(game.MIN_PLAYERS, 2);

// Everyday card list never contains a Secret Card word.
const secret = new Set(game.SECRET_PARTS);
assert.ok(game.PARTS.length >= 30, 'enough everyday parts for seven players and a 12-word board');
assert.ok(game.PARTS.every(part => !secret.has(part)), 'normal cards exclude Secret Card words');

// Seeded random for repeatable games.
function seeded(seed) {
    let value = seed;
    return () => { value = (value * 1103515245 + 12345) % 2147483648; return value / 2147483648; };
}

// Setup clamps players and rounds, gives unique parts and a board with the answer.
let engine = game.createEngine({ random: seeded(7) });
let state = engine.start({ playerCount: 9, rounds: 0 });
assert.equal(state.players.length, 7, 'player count is capped at seven');
assert.equal(state.totalRounds, 1, 'rounds are at least one');
assert.equal(new Set(state.players.map(player => player.part)).size, 7, 'each player gets a different part');
const board = engine.boardFor('root');
assert.equal(board.length, 12, 'the guess board shows twelve words');
assert.ok(board.includes(state.players[0].part), 'the board always contains the real answer');
assert.equal(new Set(board).size, 12, 'board words are unique');
for (const id of state.players.map(player => player.id)) {
    assert.ok(engine.boardFor(id).every(part => !secret.has(part)), 'normal games never show Secret Card words on the board');
}

// Secret Card: only every third consecutive game, one player, then the count resets.
engine = game.createEngine({ random: seeded(3) });
const secrets = [];
for (let index = 0; index < 6; index++) {
    const started = engine.start({ playerCount: 4, rounds: 1 });
    secrets.push(started.players.filter(player => player.secret).length);
    started.players.filter(player => !player.secret).forEach(player => assert.ok(!secret.has(player.part)));
}
assert.deepEqual(secrets, [0, 0, 1, 0, 0, 1], 'the third game in a row carries exactly one Secret Card');
engine = game.createEngine({ random: seeded(3) });
engine.start({ playerCount: 3 }); engine.start({ playerCount: 3 });
assert.equal(engine.nextGameHasSecret(), true, 'the setup screen can warn before game three');
const skipped = engine.start({ playerCount: 3, includeSecret: false });
assert.ok(skipped.secretGame && !skipped.players.some(player => player.secret), 'the group can play game three without the Secret Card');
assert.equal(engine.consecutiveGames, 0, 'the counter resets after the Secret Card game');

// A full game always ends, marks winners and never loops forever.
for (let seed = 1; seed <= 60; seed++) {
    const run = game.createEngine({ random: seeded(seed) });
    run.start({ playerCount: 2 + (seed % 6), rounds: 1 + (seed % 5) });
    let safety = 0;
    while (!run.settle() && safety++ < 500) {
        const spun = run.spin();
        if (!spun) break;
        const turn = run.game.turn;
        let steps = 0;
        while (!turn.done && steps++ < 20) {
            const others = run.activePlayers().filter(player => player.id !== turn.calledId);
            const guesser = turn.mode === 'lightning' ? others[0].id : run.currentGuesser();
            const truth = run.game.players.find(player => player.id === turn.calledId).part;
            const guessedPart = steps % 3 === 0 ? truth : run.boardFor(turn.calledId).find(part => part !== truth);
            // Honest answers only in this loop.
            run.answer({ guesserId: guesser, guessedPart, claimedRight: guessedPart === truth });
            if (turn.mode === 'lightning' && !turn.done && steps > 3) run.nobodyGotIt();
        }
        assert.ok(turn.done, `turn completes (seed ${seed})`);
    }
    assert.ok(safety < 500, `game ends (seed ${seed})`);
    const summary = run.finish();
    assert.deepEqual(Array.from(summary.fakers), [], `honest games have no Faker (seed ${seed})`);
}

// Faker Catch: a correct guess marked wrong is exposed at the Grand Reveal.
engine = game.createEngine({ random: () => 0.9 });
engine.start({ playerCount: 3, rounds: 1 });
const spun = engine.spin();
assert.equal(spun.card, null, 'no luck card at high random values');
const called = engine.game.players.find(player => player.id === spun.calledId);
const firstGuesser = engine.currentGuesser();
engine.answer({ guesserId: firstGuesser, guessedPart: called.part, claimedRight: false });
assert.equal(called.out, false, 'a fake "wrong" keeps the player in during play');
const summary = engine.finish();
assert.deepEqual(Array.from(summary.fakers), [called.id], 'the Faker is caught at the reveal');
assert.equal(summary.players.find(player => player.id === called.id).shields, 0, 'a Faker loses their shields');

// Correct claim knocks the called player out and rewards the guesser.
engine = game.createEngine({ random: () => 0.9 });
engine.start({ playerCount: 2, rounds: 3 });
const turnInfo = engine.spin();
const guesserId = engine.currentGuesser();
engine.answer({ guesserId, guessedPart: engine.game.players.find(player => player.id === turnInfo.calledId).part, claimedRight: true });
assert.equal(engine.game.players.find(player => player.id === turnInfo.calledId).out, true);
assert.equal(engine.game.players.find(player => player.id === guesserId).stars, 1);
assert.equal(engine.settle(), true, 'the game ends when one player is left');

// Luck cards: shield, double, reverse, lightning and swap all behave.
function withCard(card) {
    // After start(), spin() reads: the called player, the luck roll (< 0.25
    // draws a card), then which card. Later reads fall back to 0.5.
    let queue = [];
    const run = game.createEngine({ random: () => (queue.length ? queue.shift() : 0.5) });
    run.start({ playerCount: 4, rounds: 1 });
    const cards = Array.from(game.LUCK_CARDS);
    queue = [0.1, 0.1, (cards.indexOf(card) + 0.5) / cards.length];
    return { run, result: run.spin() };
}
let luck = withCard('shield');
assert.equal(luck.result.card, 'shield');
assert.ok(luck.run.game.turn.done, 'Shield ends the call safely');
assert.equal(luck.run.game.players.find(player => player.id === luck.result.calledId).shields, 1);
luck = withCard('double');
assert.equal(luck.run.game.turn.guessers[0], luck.run.game.turn.guessers[1], 'Double Guess gives the first guesser two tries');
luck = withCard('reverse');
assert.deepEqual(Array.from(luck.run.game.turn.guessers), [luck.result.calledId], 'Reverse makes the called player the only guesser');
assert.equal(luck.run.game.turn.calledId, luck.result.reverseTarget);
luck = withCard('lightning');
assert.equal(luck.run.game.turn.mode, 'lightning');
assert.equal(luck.run.currentGuesser(), null, 'Lightning lets anyone shout first');
luck = withCard('swap');
assert.equal(luck.result.swap.length, 2, 'Swap names the two players who must look at their new card');

// Dev mode only: hidden and disabled entry point, gated open, lock closes the game.
assert.match(html, /<div id="secret-body-game-panel"[^>]*hidden>[\s\S]*?<button id="open-secret-body-game"[^>]*disabled/, 'the Lobby game panel is hidden and its button disabled by default');
const ambience = html.indexOf('id="mood-relaxation-ambience-section"');
const gamePanel = html.indexOf('id="secret-body-game-panel"');
assert.ok(ambience > 0 && gamePanel > ambience && gamePanel < html.indexOf('id="session-estimate"'), 'the game sits in the Lobby after the Mood & Relaxation Ambience section');
assert.doesNotMatch(html.slice(html.indexOf('id="experiment-screen"'), html.indexOf('id="secret-body-game-screen"')), /open-secret-body-game/, 'the game is no longer inside Experiment Mode');
assert.match(html, /<section id="secret-body-game-screen" class="screen[^"]*hidden"/);
assert.match(app, /secretBodyGamePanel\.hidden = isLocked[\s\S]*?secretBodyGameButton\.disabled = isLocked/, 'the dev-mode lock hides the game panel');
assert.match(app, /returnScreen: lobbyScreen/, 'leaving the game returns to the Lobby');
assert.match(app, /if \(isLocked && secretBodyGame\) secretBodyGame\.close\(\)/, 'locking dev mode closes an open game');
assert.match(app, /isUnlocked: \(\) => state\.advancedFeaturesUnlocked/, 'the game checks dev mode itself');
assert.match(loader, /'secret-body-game': Object\.freeze\(\{ src: '\.\/modules\/secret-body-part-game\.js\?v=1\.1', globalName: 'ChakraSecretBodyPartGame' \}\)/, 'the game module loads lazily');
assert.match(sw, /'\.\/modules\/secret-body-part-game\.js\?v=1\.1'/, 'the game works offline');

// Every locale has every label and part name.
const keys = ['sbpTitle', 'sbpIntro', 'sbpPlayers', 'sbpRounds', 'sbpGamesInRow', 'sbpStart', 'backToExperiment', 'sbpBoldTitle', 'sbpBoldNotice',
    'sbpBoldContinue', 'sbpBoldSkip', 'sbpMemorised', 'sbpPassTo', 'sbpTapCard', 'sbpRound', 'sbpSpin', 'sbpCalled', 'sbpReverseNote',
    'sbpContinue', 'sbpLightningPrompt', 'sbpGuessPrompt', 'sbpHonour', 'sbpRight', 'sbpWrong', 'sbpNobody', 'sbpShielded', 'sbpOut',
    'sbpSurvived', 'sbpNext', 'sbpGrandReveal', 'sbpFakerCaught', 'sbpLuckySurvivor', 'sbpSharpGuesser', 'sbpFakerOfNight', 'sbpPlayAgain', 'sbpBack', 'sbpOpen',
    'secretBodyGame', 'secretBodyGameNote',
    ...Array.from(game.LUCK_CARDS).flatMap(card => [`sbpLuck_${card}`, `sbpLuck_${card}_note`]),
    ...[...game.PARTS, ...game.SECRET_PARTS].map(part => `sbpPart_${part}`)];
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of keys) assert.ok(locale.ui[key], `${language} is missing ui.${key}`);
}

console.log('Secret Body Part passed: chakra players, secret cards, luck cards, Faker Catch, game-three Secret Card, dev-mode gate and five locales.');
