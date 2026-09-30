(function installSecretBodyPartGame(global) {
    'use strict';

    // Secret Body Part: a dev-mode (Advanced Features) party game for 2–7
    // players. Pure luck: no clues. Nothing is saved; the consecutive-game
    // counter lives only in memory for the current page load.

    const CHAKRAS = Object.freeze([
        Object.freeze({ id: 'root', label: 'ui.root', color: '#e5484d', icon: '🔴' }),
        Object.freeze({ id: 'sacral', label: 'ui.sacral', color: '#f76b15', icon: '🟠' }),
        Object.freeze({ id: 'solar', label: 'ui.solar', color: '#ffc53d', icon: '🟡' }),
        Object.freeze({ id: 'heart', label: 'ui.heart', color: '#30a46c', icon: '🟢' }),
        Object.freeze({ id: 'throat', label: 'ui.throat', color: '#0090ff', icon: '🔵' }),
        Object.freeze({ id: 'thirdeye', label: 'ui.thirdEye', color: '#8e4ec6', icon: '🟣' }),
        Object.freeze({ id: 'crown', label: 'ui.crown', color: '#e8e1ff', icon: '⚪' })
    ]);

    // Everyday body parts. Private parts are intentionally absent.
    const PARTS = Object.freeze([
        'forehead', 'eyebrow', 'eyelash', 'ear', 'nose', 'cheek', 'chin', 'jaw', 'lips', 'tongue', 'teeth', 'hair',
        'neck', 'shoulder', 'elbow', 'wrist', 'palm', 'thumb', 'knuckle', 'fingernail',
        'back', 'spine', 'ribs', 'waist', 'bellyButton',
        'knee', 'ankle', 'heel', 'toe', 'calf', 'thigh',
        'heartOrgan', 'lungs', 'brain', 'stomach', 'bones'
    ]);

    // Secret Card words, used only in every third consecutive game.
    // Edit this list to change the Secret Card; add a matching
    // ui.sbpPart_<id> translation in every locale.
    const SECRET_PARTS = Object.freeze(['chest', 'buttocks']);

    const LUCK_CARDS = Object.freeze(['swap', 'double', 'shield', 'reverse', 'lightning']);
    const LUCK_CHANCE = 0.25;
    const BOARD_SIZE = 12;
    const SECRET_EVERY = 3;
    const MIN_PLAYERS = 2;
    const MAX_PLAYERS = 7;
    const MIN_ROUNDS = 1;
    const MAX_ROUNDS = 5;

    function clampInt(value, min, max, fallback) {
        const number = Math.round(Number(value));
        if (!Number.isFinite(number)) return fallback;
        return Math.min(max, Math.max(min, number));
    }

    function shuffle(list, random) {
        const copy = [...list];
        for (let index = copy.length - 1; index > 0; index--) {
            const pick = Math.floor(random() * (index + 1));
            [copy[index], copy[pick]] = [copy[pick], copy[index]];
        }
        return copy;
    }

    function pickOne(list, random) {
        return list[Math.floor(random() * list.length)];
    }

    // ── Pure game engine (no DOM) ─────────────────────────────────────────
    function createEngine({ random = Math.random } = {}) {
        let consecutiveGames = 0;
        let game = null;

        function nextGameHasSecret() {
            return (consecutiveGames + 1) % SECRET_EVERY === 0;
        }

        function start({ playerCount, rounds, includeSecret = true } = {}) {
            const count = clampInt(playerCount, MIN_PLAYERS, MAX_PLAYERS, MIN_PLAYERS);
            const totalRounds = clampInt(rounds, MIN_ROUNDS, MAX_ROUNDS, MIN_ROUNDS);
            const secretGame = nextGameHasSecret();
            consecutiveGames = secretGame ? 0 : consecutiveGames + 1;
            const parts = shuffle(PARTS, random).slice(0, count);
            const players = CHAKRAS.slice(0, count).map((chakra, index) => ({
                id: chakra.id,
                part: parts[index],
                secret: false,
                out: false,
                stars: 0,
                shields: 0,
                faker: false
            }));
            let secretPlayerId = null;
            if (secretGame && includeSecret) {
                const target = pickOne(players, random);
                target.part = pickOne(SECRET_PARTS, random);
                target.secret = true;
                secretPlayerId = target.id;
            }
            game = {
                players,
                totalRounds,
                round: 1,
                calledThisRound: [],
                turn: null,
                guesses: [],
                boards: {},
                finished: false,
                secretGame,
                secretPlayerId,
                lastLuckCard: null
            };
            return game;
        }

        function player(id) {
            return game?.players.find(candidate => candidate.id === id) || null;
        }

        function activePlayers() {
            return game ? game.players.filter(candidate => !candidate.out) : [];
        }

        function boardFor(id) {
            const target = player(id);
            if (!target) return [];
            if (!game.boards[id]) {
                // Secret Card words appear on boards only in a game that dealt one.
                const words = game.secretPlayerId ? [...PARTS, ...SECRET_PARTS] : PARTS;
                const pool = words.filter(part => part !== target.part);
                game.boards[id] = shuffle([target.part, ...shuffle(pool, random).slice(0, BOARD_SIZE - 1)], random);
            }
            return game.boards[id];
        }

        function isOver() {
            if (!game) return true;
            return game.finished || activePlayers().length <= 1;
        }

        function advanceRoundIfNeeded() {
            const waiting = activePlayers().filter(candidate => !game.calledThisRound.includes(candidate.id));
            if (waiting.length) return;
            game.round += 1;
            game.calledThisRound = [];
            if (game.round > game.totalRounds) game.finished = true;
        }

        function buildTurn(calledId, guessers, mode, card) {
            game.turn = { calledId, guessers, guessIndex: 0, mode, card, done: false };
            boardFor(calledId);
            return game.turn;
        }

        // Spin the chakra wheel. Returns { calledId, card, swap? }.
        function spin() {
            if (isOver()) { game && (game.finished = true); return null; }
            advanceRoundIfNeeded();
            if (game.finished) return null;
            const waiting = activePlayers().filter(candidate => !game.calledThisRound.includes(candidate.id));
            const called = pickOne(waiting, random);
            game.calledThisRound.push(called.id);
            const others = activePlayers().filter(candidate => candidate.id !== called.id).map(candidate => candidate.id);
            const card = random() < LUCK_CHANCE ? pickOne(LUCK_CARDS, random) : null;
            game.lastLuckCard = card;
            const result = { calledId: called.id, card };

            if (card === 'shield') {
                called.shields += 1;
                buildTurn(called.id, [], 'shield', card).done = true;
                return result;
            }
            if (card === 'swap' && activePlayers().length >= 2) {
                const [first, second] = shuffle(activePlayers(), random);
                [first.part, second.part] = [second.part, first.part];
                [first.secret, second.secret] = [second.secret, first.secret];
                if (game.secretPlayerId === first.id) game.secretPlayerId = second.id;
                else if (game.secretPlayerId === second.id) game.secretPlayerId = first.id;
                delete game.boards[first.id];
                delete game.boards[second.id];
                result.swap = [first.id, second.id];
                buildTurn(called.id, shuffle(others, random), 'normal', card);
                return result;
            }
            if (card === 'reverse' && others.length) {
                const target = pickOne(others, random);
                result.reverseTarget = target;
                buildTurn(target, [called.id], 'normal', card);
                return result;
            }
            if (card === 'lightning') {
                buildTurn(called.id, others, 'lightning', card);
                return result;
            }
            const order = shuffle(others, random);
            if (card === 'double' && order.length) order.splice(1, 0, order[0]);
            buildTurn(called.id, order, 'normal', card);
            return result;
        }

        function currentGuesser() {
            const turn = game?.turn;
            if (!turn || turn.done || turn.mode !== 'normal') return null;
            return turn.guessers[turn.guessIndex] || null;
        }

        // The called player records a guess on their honour.
        function answer({ guesserId, guessedPart, claimedRight }) {
            const turn = game?.turn;
            if (!turn || turn.done) return null;
            const guesser = turn.mode === 'lightning' ? guesserId : currentGuesser();
            if (!guesser || guesser === turn.calledId || !player(guesser) || player(guesser).out) return null;
            const called = player(turn.calledId);
            game.guesses.push({
                calledId: called.id,
                guesserId: guesser,
                guessedPart,
                actualPart: called.part,
                claimedRight: Boolean(claimedRight)
            });
            if (claimedRight) {
                called.out = true;
                player(guesser).stars += 1;
                turn.done = true;
                turn.outcome = 'out';
                return turn;
            }
            if (turn.mode === 'normal') {
                turn.guessIndex += 1;
                if (turn.guessIndex >= turn.guessers.length) {
                    called.shields += 1;
                    turn.done = true;
                    turn.outcome = 'survived';
                }
            }
            return turn;
        }

        // Lightning: the called player ends the scramble when nobody got it.
        function nobodyGotIt() {
            const turn = game?.turn;
            if (!turn || turn.done) return null;
            player(turn.calledId).shields += 1;
            turn.done = true;
            turn.outcome = 'survived';
            return turn;
        }

        // Grand Reveal: a correct guess that was marked wrong exposes a Faker.
        function finish() {
            if (!game) return null;
            game.finished = true;
            game.players.forEach(candidate => { candidate.faker = false; });
            game.guesses.forEach(entry => {
                if (!entry.claimedRight && entry.guessedPart === entry.actualPart) {
                    const faker = player(entry.calledId);
                    if (faker) faker.faker = true;
                }
            });
            game.players.forEach(candidate => { if (candidate.faker) candidate.shields = 0; });
            const best = key => {
                const top = Math.max(0, ...game.players.map(candidate => candidate[key]));
                return top > 0 ? game.players.filter(candidate => candidate[key] === top).map(candidate => candidate.id) : [];
            };
            return {
                players: game.players.map(candidate => ({ ...candidate })),
                luckySurvivors: best('shields'),
                sharpGuessers: best('stars'),
                fakers: game.players.filter(candidate => candidate.faker).map(candidate => candidate.id),
                secretPlayerId: game.secretPlayerId
            };
        }

        // Close finished rounds before the next spin so the game ends
        // without an extra, empty spin.
        function settle() {
            if (!game) return true;
            if (!game.finished && activePlayers().length > 1) advanceRoundIfNeeded();
            return isOver();
        }

        function reset() {
            game = null;
        }

        return Object.freeze({
            start, spin, answer, nobodyGotIt, finish, reset, settle, boardFor, currentGuesser, activePlayers, isOver,
            nextGameHasSecret,
            get game() { return game; },
            get consecutiveGames() { return consecutiveGames; }
        });
    }

    // ── View (DOM) ────────────────────────────────────────────────────────
    function mount({ document = global.document, root, t, showScreen, gameScreen, returnScreen, isUnlocked, random = Math.random } = {}) {
        if (!document || !root || typeof t !== 'function' || typeof showScreen !== 'function' ||
            !gameScreen || typeof isUnlocked !== 'function') {
            throw new TypeError('Secret Body Part needs its screen, translator and dev-mode check');
        }
        const engine = createEngine({ random });
        const chakraById = Object.fromEntries(CHAKRAS.map(chakra => [chakra.id, chakra]));
        let setup = { playerCount: 4, rounds: 2 };
        let pendingSecretChoice = true;

        const el = (tag, options = {}, children = []) => {
            const node = document.createElement(tag);
            if (options.className) node.className = options.className;
            if (options.text !== undefined) node.textContent = options.text;
            if (options.id) node.id = options.id;
            if (options.type) node.type = options.type;
            if (options.style) Object.assign(node.style, options.style);
            if (options.dataset) Object.assign(node.dataset, options.dataset);
            if (options.onClick) node.addEventListener('click', options.onClick);
            children.forEach(child => child && node.append(child));
            return node;
        };
        const button = (text, onClick, className = 'primary-btn', dataset) => el('button', { type: 'button', className, text, onClick, dataset });
        const partName = id => t(`ui.sbpPart_${id}`);
        const chakraName = id => `${chakraById[id].icon} ${t(chakraById[id].label)}`;
        const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.replace(`{{${key}}}`, value), template);

        function render(...children) {
            root.replaceChildren(el('div', { className: 'sbp-panel' }, children));
        }

        function guard() {
            if (isUnlocked()) return true;
            close();
            return false;
        }

        function stepper(labelKey, value, min, max, onChange, testId) {
            const output = el('span', { className: 'sbp-stepper-value', text: String(value), dataset: { sbp: `${testId}-value` } });
            const change = delta => {
                const next = Math.min(max, Math.max(min, Number(output.textContent) + delta));
                output.textContent = String(next);
                onChange(next);
            };
            return el('div', { className: 'sbp-stepper' }, [
                el('span', { className: 'sbp-stepper-label', text: t(labelKey) }),
                button('−', () => change(-1), 'secondary-btn sbp-step', { sbp: `${testId}-down` }),
                output,
                button('+', () => change(1), 'secondary-btn sbp-step', { sbp: `${testId}-up` })
            ]);
        }

        function showSetup() {
            if (!guard()) return;
            const secretNext = engine.nextGameHasSecret();
            render(
                el('h2', { text: t('ui.sbpTitle') }),
                el('p', { className: 'sbp-note', text: t('ui.sbpIntro') }),
                stepper('ui.sbpPlayers', setup.playerCount, MIN_PLAYERS, MAX_PLAYERS, value => { setup.playerCount = value; }, 'players'),
                stepper('ui.sbpRounds', setup.rounds, MIN_ROUNDS, MAX_ROUNDS, value => { setup.rounds = value; }, 'rounds'),
                el('p', { className: 'sbp-note', text: fill(t('ui.sbpGamesInRow'), { count: String(engine.consecutiveGames) }) }),
                button(t('ui.sbpStart'), () => (secretNext ? showBoldNotice() : startGame(true)), 'primary-btn', { sbp: 'start' }),
                button(t('ui.backToExperiment'), close, 'link-btn', { sbp: 'back' })
            );
        }

        function showBoldNotice() {
            if (!guard()) return;
            render(
                el('div', { className: 'sbp-bold-badge', text: '🔒' }),
                el('h2', { text: t('ui.sbpBoldTitle') }),
                el('p', { className: 'sbp-note', text: t('ui.sbpBoldNotice') }),
                button(t('ui.sbpBoldContinue'), () => startGame(true), 'primary-btn', { sbp: 'bold-continue' }),
                button(t('ui.sbpBoldSkip'), () => startGame(false), 'secondary-btn', { sbp: 'bold-skip' })
            );
        }

        function startGame(includeSecret) {
            if (!guard()) return;
            pendingSecretChoice = includeSecret;
            engine.start({ ...setup, includeSecret });
            revealQueue(engine.game.players.map(candidate => candidate.id), showSpin);
        }

        // Pass-the-phone private reveal for each listed player.
        function revealQueue(ids, done) {
            const queue = [...ids];
            const next = () => {
                if (!guard()) return;
                if (!queue.length) { done(); return; }
                const id = queue.shift();
                const card = el('button', {
                    type: 'button', className: 'sbp-card sbp-card-back', text: '?', dataset: { sbp: 'card' },
                    style: { borderColor: chakraById[id].color }
                });
                const memorised = button(t('ui.sbpMemorised'), next, 'primary-btn', { sbp: 'memorised' });
                memorised.hidden = true;
                card.addEventListener('click', () => {
                    const target = engine.game.players.find(candidate => candidate.id === id);
                    card.classList.remove('sbp-card-back');
                    card.classList.toggle('sbp-card-secret', Boolean(target.secret));
                    card.textContent = (target.secret ? '🔒 ' : '') + partName(target.part);
                    memorised.hidden = false;
                }, { once: true });
                render(
                    el('h2', { text: fill(t('ui.sbpPassTo'), { player: chakraName(id) }) }),
                    el('p', { className: 'sbp-note', text: t('ui.sbpTapCard') }),
                    card,
                    memorised
                );
            };
            next();
        }

        function scoreStrip() {
            return el('ol', { className: 'sbp-score' }, engine.game.players.map(candidate => el('li', {
                className: candidate.out ? 'is-out' : '',
                style: { borderColor: chakraById[candidate.id].color },
                text: `${chakraName(candidate.id)} ⭐${candidate.stars} 🛡️${candidate.shields}${candidate.out ? ' ✕' : ''}`
            })));
        }

        function showSpin() {
            if (!guard()) return;
            if (engine.settle()) { showReveal(); return; }
            render(
                el('h2', { text: fill(t('ui.sbpRound'), { round: String(engine.game.round), total: String(engine.game.totalRounds) }) }),
                scoreStrip(),
                el('div', { className: 'sbp-wheel', text: '🎡' }),
                button(t('ui.sbpSpin'), doSpin, 'primary-btn', { sbp: 'spin' })
            );
        }

        function doSpin() {
            if (!guard()) return;
            const result = engine.spin();
            if (!result) { showReveal(); return; }
            const lines = [el('h2', { text: fill(t('ui.sbpCalled'), { player: chakraName(result.calledId) }) })];
            if (result.card) {
                lines.push(el('div', { className: 'sbp-luck', dataset: { sbp: `luck-${result.card}` } }, [
                    el('strong', { text: t(`ui.sbpLuck_${result.card}`) }),
                    el('p', { text: t(`ui.sbpLuck_${result.card}_note`) })
                ]));
            }
            if (result.reverseTarget) {
                lines.push(el('p', { className: 'sbp-note', text: fill(t('ui.sbpReverseNote'), {
                    player: chakraName(result.calledId), target: chakraName(result.reverseTarget)
                }) }));
            }
            const proceed = () => {
                if (result.swap) revealQueue(result.swap, showTurn);
                else showTurn();
            };
            lines.push(button(t('ui.sbpContinue'), proceed, 'primary-btn', { sbp: 'continue' }));
            render(...lines);
        }

        function showTurn() {
            if (!guard()) return;
            const turn = engine.game.turn;
            if (!turn || turn.done) { showTurnResult(); return; }
            const board = engine.boardFor(turn.calledId);
            let selectedPart = null;
            let selectedGuesser = engine.currentGuesser();
            const lightning = turn.mode === 'lightning';
            const boardButtons = board.map(part => el('button', {
                type: 'button', className: 'sbp-word', text: partName(part), dataset: { sbp: 'word', part },
                onClick: event => {
                    selectedPart = part;
                    boardButtons.forEach(item => item.classList.toggle('is-selected', item === event.currentTarget));
                    syncActions();
                }
            }));
            const guesserButtons = lightning ? engine.activePlayers().filter(candidate => candidate.id !== turn.calledId).map(candidate => el('button', {
                type: 'button', className: 'sbp-guesser', text: chakraName(candidate.id), dataset: { sbp: 'guesser', player: candidate.id },
                style: { borderColor: chakraById[candidate.id].color },
                onClick: event => {
                    selectedGuesser = candidate.id;
                    guesserButtons.forEach(item => item.classList.toggle('is-selected', item === event.currentTarget));
                    syncActions();
                }
            })) : [];
            const right = button(t('ui.sbpRight'), () => submit(true), 'primary-btn', { sbp: 'right' });
            const wrong = button(t('ui.sbpWrong'), () => submit(false), 'secondary-btn', { sbp: 'wrong' });
            function syncActions() {
                const ready = Boolean(selectedPart && selectedGuesser);
                right.disabled = !ready;
                wrong.disabled = !ready;
            }
            function submit(claimedRight) {
                if (!guard()) return;
                engine.answer({ guesserId: selectedGuesser, guessedPart: selectedPart, claimedRight });
                showTurn();
            }
            syncActions();
            const prompt = lightning
                ? t('ui.sbpLightningPrompt')
                : fill(t('ui.sbpGuessPrompt'), { player: chakraName(selectedGuesser) });
            render(
                el('h2', { text: fill(t('ui.sbpCalled'), { player: chakraName(turn.calledId) }) }),
                el('p', { className: 'sbp-note', text: prompt }),
                lightning ? el('div', { className: 'sbp-guessers' }, guesserButtons) : null,
                el('div', { className: 'sbp-board' }, boardButtons),
                el('p', { className: 'sbp-note', text: t('ui.sbpHonour') }),
                el('div', { className: 'sbp-actions' }, [right, wrong]),
                lightning ? button(t('ui.sbpNobody'), () => { engine.nobodyGotIt(); showTurn(); }, 'link-btn', { sbp: 'nobody' }) : null
            );
        }

        function showTurnResult() {
            if (!guard()) return;
            const turn = engine.game.turn;
            const key = turn.mode === 'shield' ? 'ui.sbpShielded' : turn.outcome === 'out' ? 'ui.sbpOut' : 'ui.sbpSurvived';
            render(
                el('h2', { text: fill(t(key), { player: chakraName(turn.calledId) }) }),
                scoreStrip(),
                button(t('ui.sbpNext'), showSpin, 'primary-btn', { sbp: 'next' })
            );
        }

        function showReveal() {
            if (!guard()) return;
            const summary = engine.finish();
            const cards = summary.players
                .slice()
                .sort((first, second) => Number(first.secret) - Number(second.secret))
                .map((candidate, index) => el('li', {
                    className: `sbp-reveal-card${candidate.secret ? ' sbp-card-secret' : ''}${candidate.faker ? ' is-faker' : ''}`,
                    style: { animationDelay: `${index * 0.35}s`, borderColor: chakraById[candidate.id].color },
                    dataset: { sbp: 'reveal', player: candidate.id }
                }, [
                    el('strong', { text: chakraName(candidate.id) }),
                    el('span', { text: (candidate.secret ? '🔒 ' : '') + partName(candidate.part) }),
                    candidate.faker ? el('em', { text: t('ui.sbpFakerCaught') }) : null
                ]));
            const names = ids => ids.length ? ids.map(chakraName).join(', ') : '—';
            render(
                el('h2', { text: t('ui.sbpGrandReveal') }),
                el('ol', { className: 'sbp-reveal' }, cards),
                el('p', { className: 'sbp-award', text: `${t('ui.sbpLuckySurvivor')}: ${names(summary.luckySurvivors)}` }),
                el('p', { className: 'sbp-award', text: `${t('ui.sbpSharpGuesser')}: ${names(summary.sharpGuessers)}` }),
                summary.fakers.length ? el('p', { className: 'sbp-award sbp-faker', dataset: { sbp: 'fakers' }, text: `${t('ui.sbpFakerOfNight')}: ${names(summary.fakers)}` }) : null,
                button(t('ui.sbpPlayAgain'), () => { engine.reset(); showSetup(); }, 'primary-btn', { sbp: 'again' }),
                button(t('ui.backToExperiment'), close, 'link-btn', { sbp: 'back' })
            );
        }

        function open() {
            if (!isUnlocked()) return false;
            engine.reset();
            showScreen(gameScreen);
            showSetup();
            return true;
        }

        function close() {
            engine.reset();
            root.replaceChildren();
            // Only navigate when the game is on screen (a Settings relock must stay put).
            if (returnScreen && !gameScreen.classList.contains('hidden')) showScreen(returnScreen);
        }

        return Object.freeze({ open, close, engine, get includeSecret() { return pendingSecretChoice; } });
    }

    global.ChakraSecretBodyPartGame = Object.freeze({
        createEngine, mount, CHAKRAS, PARTS, SECRET_PARTS, LUCK_CARDS, SECRET_EVERY, MIN_PLAYERS, MAX_PLAYERS, MIN_ROUNDS, MAX_ROUNDS
    });
})(typeof window === 'undefined' ? globalThis : window);
