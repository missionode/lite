(function installSecretBodyPartGame(global) {
    'use strict';

    // Hush Hush (internal name Secret Body Part): a dev-mode (Advanced
    // Features) icebreaker game for 2–7 players. Pure luck: no clues. Nothing is saved; the consecutive-game
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

    // Everyday outer body parts you can see or touch. No inner organs and
    // no private parts.
    const PARTS = Object.freeze([
        'hair', 'forehead', 'eyebrow', 'eyelash', 'ear', 'nose', 'cheek', 'chin', 'jaw', 'lips',
        'neck', 'shoulder', 'armpit', 'elbow', 'wrist', 'palm', 'thumb', 'knuckle', 'fingernail',
        'back', 'waist', 'navel', 'lowerStomach',
        'thigh', 'knee', 'calf', 'ankle', 'heel', 'toe'
    ]);

    // 18+ Secret Card words, offered only before every third consecutive game
    // and only after the group agrees. Edit this list to change the Secret
    // Card; add a matching ui.sbpPart_<id> translation in every locale.
    const SECRET_PARTS = Object.freeze(['pubicMound', 'vagina', 'breasts', 'nipples', 'penis']);

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
    // Play rules for the screen (v2.0):
    //  • One person, one job per screen. The player whose part is being
    //    guessed always holds the phone; guessers only speak.
    //  • Every change of hands goes through a hand-off lock: the next
    //    player presses and holds "I am <chakra>" so a stray tap cannot
    //    open someone else's screen.
    //  • Every screen is tinted in the colour of the player who holds the
    //    phone, with that chakra's image, so a turn change is seen at once.
    //  • Every answer shows a full-screen result flash (with a buzz).
    function mount({
        document = global.document, root, t, showScreen, gameScreen, returnScreen, isUnlocked, random = Math.random,
        holdMs = 900, flashMs = 1600, spinMs = 2000, cardHideMs = 10000
    } = {}) {
        if (!document || !root || typeof t !== 'function' || typeof showScreen !== 'function' ||
            !gameScreen || typeof isUnlocked !== 'function') {
            throw new TypeError('Hush Hush needs its screen, translator and dev-mode check');
        }
        const view = document.defaultView || global;
        const engine = createEngine({ random });
        const chakraById = Object.fromEntries(CHAKRAS.map(chakra => [chakra.id, chakra]));
        let setup = { playerCount: 4, rounds: 2 };
        let pendingSecretChoice = true;
        let timers = [];

        const later = (fn, ms) => { const id = view.setTimeout(fn, ms); timers.push(id); return id; };
        const clearTimers = () => { timers.forEach(id => view.clearTimeout(id)); timers = []; };
        const reducedMotion = () => Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

        const el = (tag, options = {}, children = []) => {
            const node = document.createElement(tag);
            if (options.className) node.className = options.className;
            if (options.text !== undefined) node.textContent = options.text;
            if (options.id) node.id = options.id;
            if (options.type) node.type = options.type;
            if (options.style) {
                Object.entries(options.style).forEach(([key, value]) => {
                    if (key.startsWith('--')) node.style.setProperty(key, value);
                    else node.style[key] = value;
                });
            }
            if (options.dataset) Object.assign(node.dataset, options.dataset);
            if (options.attrs) Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
            if (options.onClick) node.addEventListener('click', options.onClick);
            children.forEach(child => child && node.append(child));
            return node;
        };
        const button = (text, onClick, className = 'primary-btn', dataset) => el('button', { type: 'button', className, text, onClick, dataset });
        const partName = id => t(`ui.sbpPart_${id}`);
        const plainName = id => t(chakraById[id].label);
        const chakraName = id => `${chakraById[id].icon} ${plainName(id)}`;
        const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.split(`{{${key}}}`).join(value), template);

        // Chakra symbol image used to mark whose screen this is.
        function chakraImage(id, size = 'md') {
            return el('img', {
                className: `sbp-chakra-img sbp-chakra-img-${size}`,
                attrs: { src: `symbols/${id}.png`, alt: '', 'aria-hidden': 'true', draggable: 'false' },
                style: { '--sbp-color': chakraById[id].color }
            });
        }
        // Small inline name tag: image + name in the chakra colour.
        function nameTag(id) {
            return el('span', { className: 'sbp-name-tag', style: { '--sbp-color': chakraById[id].color } }, [
                chakraImage(id, 'xs'), el('span', { text: plainName(id) })
            ]);
        }

        // Every screen fades in, tinted for the player holding the phone.
        function render({ owner = null, banner = null, step = null, className = '' } = {}, ...children) {
            clearTimers();
            const color = owner ? chakraById[owner].color : '#a78bfa';
            const panel = el('div', { className: `sbp-panel sbp-enter ${className}`.trim(), style: { '--sbp-color': color } }, [
                banner,
                step ? el('span', { className: 'sbp-step-tag', text: fill(t('ui.sbpStep'), { step: String(step[0]), total: String(step[1]) }), dataset: { sbp: 'step' } }) : null,
                ...children
            ]);
            root.replaceChildren(panel);
            root.closest?.('.screen')?.scrollTo?.(0, 0);
            const heading = panel.querySelector('h2, .sbp-banner-name');
            heading?.setAttribute('tabindex', '-1');
            heading?.focus?.({ preventScroll: true });
            return panel;
        }

        // Big top band: "<chakra> — you hold the phone".
        function holderBanner(id) {
            return el('div', { className: 'sbp-banner', dataset: { sbp: 'banner', player: id }, attrs: { role: 'status' } }, [
                chakraImage(id, 'sm'),
                el('div', { className: 'sbp-banner-text' }, [
                    el('strong', { className: 'sbp-banner-name', text: plainName(id).toUpperCase() }),
                    el('span', { text: t('ui.sbpHoldPhone') })
                ])
            ]);
        }

        function buzz(pattern) {
            try { view.navigator?.vibrate?.(pattern); } catch (error) { /* optional */ }
        }
        let audio = null;
        function chime(good) {
            try {
                const Context = view.AudioContext || view.webkitAudioContext;
                if (!Context) return;
                audio = audio || new Context();
                const now = audio.currentTime;
                (good ? [523.25, 783.99] : [311.13, 233.08]).forEach((freq, index) => {
                    const osc = audio.createOscillator();
                    const gain = audio.createGain();
                    osc.type = good ? 'sine' : 'triangle';
                    osc.frequency.value = freq;
                    const start = now + index * 0.14;
                    gain.gain.setValueAtTime(0.0001, start);
                    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
                    osc.connect(gain).connect(audio.destination);
                    osc.start(start);
                    osc.stop(start + 0.35);
                });
            } catch (error) { /* sound is optional */ }
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
                if (testId === 'players') syncPlayerPreview(next);
            };
            return el('div', { className: 'sbp-stepper' }, [
                el('span', { className: 'sbp-stepper-label', text: t(labelKey) }),
                el('button', { type: 'button', className: 'secondary-btn sbp-step', text: '−', onClick: () => change(-1), dataset: { sbp: `${testId}-down` }, attrs: { 'aria-label': `${t(labelKey)} −` } }),
                output,
                el('button', { type: 'button', className: 'secondary-btn sbp-step', text: '+', onClick: () => change(1), dataset: { sbp: `${testId}-up` }, attrs: { 'aria-label': `${t(labelKey)} +` } })
            ]);
        }

        let playerPreview = null;
        function syncPlayerPreview(count) {
            if (!playerPreview) return;
            playerPreview.replaceChildren(...CHAKRAS.slice(0, count).map(chakra => nameTag(chakra.id)));
        }

        function showSetup() {
            if (!guard()) return;
            const secretNext = engine.nextGameHasSecret();
            playerPreview = el('div', { className: 'sbp-player-preview', dataset: { sbp: 'player-preview' } });
            render({},
                el('h2', { className: 'sbp-title', text: t('ui.sbpTitle') }),
                el('p', { className: 'sbp-instruction', text: t('ui.sbpIntro') }),
                stepper('ui.sbpPlayers', setup.playerCount, MIN_PLAYERS, MAX_PLAYERS, value => { setup.playerCount = value; }, 'players'),
                playerPreview,
                stepper('ui.sbpRounds', setup.rounds, MIN_ROUNDS, MAX_ROUNDS, value => { setup.rounds = value; }, 'rounds'),
                el('p', { className: 'sbp-note', text: fill(t('ui.sbpGamesInRow'), { count: String(engine.consecutiveGames) }) }),
                button(t('ui.sbpStart'), () => (secretNext ? showBoldNotice() : startGame(true)), 'primary-btn sbp-big-btn', { sbp: 'start' }),
                button(t('ui.sbpBack'), close, 'link-btn', { sbp: 'back' })
            );
            syncPlayerPreview(setup.playerCount);
        }

        function showBoldNotice() {
            if (!guard()) return;
            render({ className: 'sbp-bold' },
                el('div', { className: 'sbp-bold-badge', text: '18+' }),
                el('h2', { text: t('ui.sbpBoldTitle') }),
                el('p', { className: 'sbp-instruction', text: t('ui.sbpBoldNotice') }),
                button(t('ui.sbpBoldContinue'), () => startGame(true), 'primary-btn sbp-big-btn', { sbp: 'bold-continue' }),
                button(t('ui.sbpBoldSkip'), () => startGame(false), 'secondary-btn', { sbp: 'bold-skip' })
            );
        }

        function startGame(includeSecret) {
            if (!guard()) return;
            pendingSecretChoice = includeSecret;
            engine.start({ ...setup, includeSecret });
            revealQueue(engine.game.players.map(candidate => candidate.id), showSpin);
        }

        // Hand-off lock: the named player must press and hold to continue.
        function handOff(id, { title, note, extra = [] } = {}, onOpen) {
            if (!guard()) return;
            const ring = el('span', { className: 'sbp-hold-ring', attrs: { 'aria-hidden': 'true' } });
            const hold = el('button', {
                type: 'button', className: 'primary-btn sbp-hold-btn', dataset: { sbp: 'gate-hold', player: id },
                style: { '--sbp-hold-ms': `${holdMs}ms` }
            }, [ring, el('span', { text: fill(t('ui.sbpHoldToOpen'), { player: plainName(id) }) })]);
            let timer = null;
            let opened = false;
            const start = event => {
                if (opened || timer) return;
                if (event?.type === 'keydown' && event.key !== ' ' && event.key !== 'Enter') return;
                event?.preventDefault?.();
                hold.classList.add('is-holding');
                timer = view.setTimeout(() => {
                    timer = null;
                    opened = true;
                    hold.classList.remove('is-holding');
                    buzz(30);
                    onOpen();
                }, holdMs);
            };
            const stop = () => {
                if (timer) { view.clearTimeout(timer); timer = null; }
                hold.classList.remove('is-holding');
            };
            hold.addEventListener('pointerdown', start);
            hold.addEventListener('keydown', start);
            ['pointerup', 'pointerleave', 'pointercancel', 'keyup', 'blur'].forEach(name => hold.addEventListener(name, stop));
            hold.addEventListener('contextmenu', event => event.preventDefault());
            render({ owner: id, className: 'sbp-gate' },
                el('span', { className: 'sbp-kicker', text: title || t('ui.sbpPassKicker') }),
                chakraImage(id, 'xl'),
                el('h2', { className: 'sbp-gate-name', text: plainName(id) }),
                note ? el('p', { className: 'sbp-instruction', text: note }) : null,
                ...extra,
                hold,
                el('p', { className: 'sbp-note', text: t('ui.sbpHoldHint') })
            );
        }

        // Pass-the-phone private reveal for each listed player.
        function revealQueue(ids, done) {
            const queue = [...ids];
            const next = () => {
                if (!guard()) return;
                if (!queue.length) { done(); return; }
                const id = queue.shift();
                handOff(id, { note: t('ui.sbpOnlyYou') }, () => showCard(id, next));
            };
            next();
        }

        function showCard(id, next) {
            if (!guard()) return;
            const target = engine.game.players.find(candidate => candidate.id === id);
            const face = el('span', { className: 'sbp-card-face', text: partName(target.part) });
            const card = el('div', {
                className: `sbp-card is-flipped${target.secret ? ' sbp-card-secret' : ''}`, dataset: { sbp: 'card' },
                attrs: { role: 'img', 'aria-label': partName(target.part) }
            }, [
                el('span', { className: 'sbp-card-back-face', text: '?' }),
                el('span', { className: 'sbp-card-front' }, [
                    target.secret ? el('span', { className: 'sbp-card-lock', text: '18+' }) : null,
                    chakraImage(id, 'sm'),
                    face
                ])
            ]);
            const memorised = button(t('ui.sbpMemorised'), next, 'primary-btn sbp-big-btn', { sbp: 'memorised' });
            const hint = el('p', { className: 'sbp-note', text: t('ui.sbpCardHides') });
            render({ owner: id, banner: holderBanner(id), className: 'sbp-reveal-step' },
                el('p', { className: 'sbp-instruction', text: t('ui.sbpYourPart') }),
                card, memorised, hint
            );
            later(() => {
                card.classList.remove('is-flipped');
                card.setAttribute('aria-label', '?');
                hint.textContent = t('ui.sbpCardHidden');
            }, cardHideMs);
        }

        function scoreStrip(activeId = null) {
            return el('ol', { className: 'sbp-score', attrs: { 'aria-label': t('ui.sbpScore') } }, engine.game.players.map(candidate => el('li', {
                className: `${candidate.out ? 'is-out' : ''}${candidate.id === activeId ? ' is-active' : ''}`.trim(),
                style: { '--sbp-color': chakraById[candidate.id].color }
            }, [
                chakraImage(candidate.id, 'xs'),
                el('span', { className: 'sbp-score-name', text: plainName(candidate.id) }),
                el('span', { className: 'sbp-score-count', text: `⭐${candidate.stars} 🛡️${candidate.shields}${candidate.out ? ' ✕' : ''}` })
            ])));
        }

        // A real chakra wheel: one slice per active player, it stops on the called player.
        function wheel(ids) {
            const slice = 360 / ids.length;
            const gradient = ids.map((id, index) => `${chakraById[id].color} ${index * slice}deg ${(index + 1) * slice}deg`).join(', ');
            const disc = el('div', { className: 'sbp-wheel-disc', style: { background: `conic-gradient(${gradient})` } },
                ids.map((id, index) => el('span', {
                    className: 'sbp-wheel-slot',
                    style: { transform: `rotate(${index * slice + slice / 2}deg) translateY(-6.2rem) rotate(${-(index * slice + slice / 2)}deg)` }
                }, [chakraImage(id, 'sm')])));
            return { node: el('div', { className: 'sbp-wheel', dataset: { sbp: 'wheel' } }, [el('span', { className: 'sbp-wheel-pointer', attrs: { 'aria-hidden': 'true' } }), disc]), disc, slice };
        }

        function showSpin() {
            if (!guard()) return;
            if (engine.settle()) { showReveal(); return; }
            const ids = engine.activePlayers().map(candidate => candidate.id);
            const spinner = wheel(ids);
            const spinButton = button(t('ui.sbpSpin'), () => {
                spinButton.disabled = true;
                const result = engine.spin();
                if (!result) { showReveal(); return; }
                const wheelOwner = result.calledId;
                const index = Math.max(0, ids.indexOf(wheelOwner));
                const landing = 360 * 5 + (360 - (index * spinner.slice + spinner.slice / 2));
                const duration = reducedMotion() ? 0 : spinMs;
                spinner.disc.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.2, 1)`;
                spinner.disc.style.transform = `rotate(${landing}deg)`;
                status.textContent = t('ui.sbpSpinning');
                later(() => { buzz([40, 40, 40]); showCalled(result); }, duration + (duration ? 250 : 0));
            }, 'primary-btn sbp-big-btn', { sbp: 'spin' });
            const status = el('p', { className: 'sbp-instruction', text: t('ui.sbpSpinNote'), attrs: { 'aria-live': 'polite' } });
            render({ step: [1, 3] },
                el('h2', { text: fill(t('ui.sbpRound'), { round: String(engine.game.round), total: String(engine.game.totalRounds) }) }),
                scoreStrip(),
                spinner.node,
                status,
                spinButton
            );
        }

        // Announce the called player and any luck card, then hand the phone over.
        function showCalled(result) {
            if (!guard()) return;
            const turn = engine.game.turn;
            const holder = turn.calledId;
            const lines = [
                el('span', { className: 'sbp-kicker', text: t('ui.sbpWheelPicked') }),
                chakraImage(result.calledId, 'xl'),
                el('h2', { className: 'sbp-gate-name', text: fill(t('ui.sbpCalled'), { player: plainName(result.calledId) }) })
            ];
            if (result.card) {
                lines.push(el('div', { className: `sbp-luck sbp-luck-${result.card}`, dataset: { sbp: `luck-${result.card}` } }, [
                    el('span', { className: 'sbp-kicker', text: t('ui.sbpLuckTitle') }),
                    el('strong', { text: t(`ui.sbpLuck_${result.card}`) }),
                    el('p', { text: t(`ui.sbpLuck_${result.card}_note`) })
                ]));
            }
            if (result.reverseTarget) {
                lines.push(el('p', { className: 'sbp-instruction', text: fill(t('ui.sbpReverseNote'), {
                    player: plainName(result.calledId), target: plainName(result.reverseTarget)
                }) }));
            }
            if (result.swap) {
                lines.push(el('p', { className: 'sbp-instruction', dataset: { sbp: 'swap-note' }, text: fill(t('ui.sbpSwapNote'), {
                    first: plainName(result.swap[0]), second: plainName(result.swap[1])
                }) }));
            }
            const proceed = () => {
                if (turn.done) { showTurnResult(); return; }
                const toTurn = () => handOff(holder, { note: t('ui.sbpHolderNote') }, showTurn);
                if (result.swap) revealQueue(result.swap, toTurn);
                else toTurn();
            };
            lines.push(button(t('ui.sbpContinue'), proceed, 'primary-btn sbp-big-btn', { sbp: 'continue' }));
            render({ owner: result.calledId, className: result.card ? 'sbp-called has-luck' : 'sbp-called' }, ...lines);
        }

        function showTurn() {
            if (!guard()) return;
            const turn = engine.game.turn;
            if (!turn || turn.done) { showTurnResult(); return; }
            const holder = turn.calledId;
            const board = engine.boardFor(holder);
            let selectedPart = null;
            let selectedGuesser = engine.currentGuesser();
            const lightning = turn.mode === 'lightning';
            const actions = el('div', { className: 'sbp-verdict', hidden: true, dataset: { sbp: 'verdict' } });
            actions.hidden = true;
            const boardButtons = board.map(part => el('button', {
                type: 'button', className: 'sbp-word', text: partName(part), dataset: { sbp: 'word', part },
                attrs: { 'aria-pressed': 'false' },
                onClick: event => {
                    selectedPart = part;
                    boardButtons.forEach(item => {
                        const on = item === event.currentTarget;
                        item.classList.toggle('is-selected', on);
                        item.setAttribute('aria-pressed', String(on));
                    });
                    syncActions();
                }
            }));
            const guesserButtons = lightning ? engine.activePlayers().filter(candidate => candidate.id !== holder).map(candidate => el('button', {
                type: 'button', className: 'sbp-guesser', dataset: { sbp: 'guesser', player: candidate.id },
                style: { '--sbp-color': chakraById[candidate.id].color }, attrs: { 'aria-pressed': 'false' },
                onClick: event => {
                    selectedGuesser = candidate.id;
                    guesserButtons.forEach(item => {
                        const on = item === event.currentTarget;
                        item.classList.toggle('is-selected', on);
                        item.setAttribute('aria-pressed', String(on));
                    });
                    syncActions();
                }
            }, [chakraImage(candidate.id, 'xs'), el('span', { text: plainName(candidate.id) })])) : [];
            const chosen = el('p', { className: 'sbp-chosen', attrs: { 'aria-live': 'polite' } });
            const right = button(t('ui.sbpRight'), () => submit(true), 'primary-btn sbp-right', { sbp: 'right' });
            const wrong = button(t('ui.sbpWrong'), () => submit(false), 'secondary-btn sbp-wrong', { sbp: 'wrong' });
            actions.append(el('p', { className: 'sbp-instruction', text: t('ui.sbpWasItRight') }), chosen, el('div', { className: 'sbp-actions' }, [right, wrong]), el('p', { className: 'sbp-note', text: t('ui.sbpHonour') }));
            function syncActions() {
                const ready = Boolean(selectedPart && selectedGuesser);
                actions.hidden = !ready;
                if (ready) {
                    chosen.textContent = `“${partName(selectedPart)}”`;
                    stepTag && (stepTag.textContent = fill(t('ui.sbpStep'), { step: '3', total: '3' }));
                    actions.classList.remove('sbp-pop');
                    void actions.offsetWidth;
                    actions.classList.add('sbp-pop');
                    actions.scrollIntoView?.({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
                }
            }
            function submit(claimedRight) {
                if (!guard()) return;
                const guesser = selectedGuesser;
                engine.answer({ guesserId: guesser, guessedPart: selectedPart, claimedRight });
                showFlash({ right: claimedRight, guesser, holder });
            }
            const guesserLine = lightning
                ? el('p', { className: 'sbp-instruction', text: t('ui.sbpLightningPrompt') })
                : el('div', { className: 'sbp-guesser-callout', dataset: { sbp: 'guesser-callout', player: selectedGuesser }, style: { '--sbp-color': chakraById[selectedGuesser].color } }, [
                    chakraImage(selectedGuesser, 'md'),
                    el('div', {}, [
                        el('strong', { text: fill(t('ui.sbpIsGuessing'), { player: plainName(selectedGuesser) }) }),
                        el('span', { text: t('ui.sbpListenNote') })
                    ])
                ]);
            const panel = render({ owner: holder, banner: holderBanner(holder), step: [2, 3] },
                guesserLine,
                lightning ? el('div', { className: 'sbp-guessers' }, guesserButtons) : null,
                el('div', { className: 'sbp-board' }, boardButtons),
                actions,
                lightning ? button(t('ui.sbpNobody'), () => { engine.nobodyGotIt(); showTurnResult(); }, 'link-btn', { sbp: 'nobody' }) : null
            );
            const stepTag = panel.querySelector('[data-sbp="step"]');
        }

        // Full-screen result after every answer, auto-continues.
        function showFlash({ right, guesser, holder }) {
            if (!guard()) return;
            const turn = engine.game.turn;
            const nextGuesser = !turn.done ? engine.currentGuesser() : null;
            buzz(right ? [60, 40, 60] : 160);
            chime(right);
            let headline;
            let sub;
            if (right) {
                headline = fill(t('ui.sbpFlashRight'), { guesser: plainName(guesser) });
                sub = fill(t('ui.sbpOut'), { player: plainName(holder) });
            } else if (nextGuesser) {
                headline = t('ui.sbpFlashWrong');
                sub = nextGuesser === guesser
                    ? fill(t('ui.sbpFlashTryAgain'), { player: plainName(nextGuesser) })
                    : fill(t('ui.sbpFlashNextGuesser'), { player: plainName(nextGuesser) });
            } else {
                headline = t('ui.sbpFlashWrong');
                sub = turn.done ? fill(t('ui.sbpSurvived'), { player: plainName(holder) }) : t('ui.sbpFlashKeepGoing');
            }
            const go = () => (turn.done ? showTurnResult() : showTurn());
            render({ owner: nextGuesser || holder, className: `sbp-flash ${right ? 'is-right' : 'is-wrong'}` },
                el('div', { className: 'sbp-flash-mark', text: right ? '✔' : '✘', attrs: { 'aria-hidden': 'true' } }),
                el('h2', { className: 'sbp-flash-title', text: headline, dataset: { sbp: 'flash' } }),
                nextGuesser ? chakraImage(nextGuesser, 'lg') : null,
                el('p', { className: 'sbp-flash-sub', text: sub }),
                button(t('ui.sbpContinue'), go, 'primary-btn sbp-big-btn', { sbp: 'flash-next' })
            );
            later(go, flashMs);
        }

        function showTurnResult() {
            if (!guard()) return;
            const turn = engine.game.turn;
            const key = turn.mode === 'shield' ? 'ui.sbpShielded' : turn.outcome === 'out' ? 'ui.sbpOut' : 'ui.sbpSurvived';
            render({ owner: turn.calledId, step: [3, 3], className: turn.outcome === 'out' ? 'sbp-result is-out' : 'sbp-result' },
                chakraImage(turn.calledId, 'lg'),
                el('h2', { text: fill(t(key), { player: plainName(turn.calledId) }) }),
                scoreStrip(turn.calledId),
                button(t('ui.sbpNext'), showSpin, 'primary-btn sbp-big-btn', { sbp: 'next' })
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
                    style: { animationDelay: `${index * 0.35}s`, '--sbp-color': chakraById[candidate.id].color },
                    dataset: { sbp: 'reveal', player: candidate.id }
                }, [
                    chakraImage(candidate.id, 'sm'),
                    el('strong', { text: plainName(candidate.id) }),
                    el('span', { className: 'sbp-reveal-part', text: (candidate.secret ? '18+ · ' : '') + partName(candidate.part) }),
                    candidate.faker ? el('em', { text: t('ui.sbpFakerCaught') }) : null
                ]));
            const names = ids => ids.length ? ids.map(plainName).join(', ') : '—';
            render({ className: 'sbp-grand' },
                el('h2', { className: 'sbp-title', text: t('ui.sbpGrandReveal') }),
                el('ol', { className: 'sbp-reveal' }, cards),
                el('p', { className: 'sbp-award', text: `${t('ui.sbpLuckySurvivor')}: ${names(summary.luckySurvivors)}` }),
                el('p', { className: 'sbp-award', text: `${t('ui.sbpSharpGuesser')}: ${names(summary.sharpGuessers)}` }),
                summary.fakers.length ? el('p', { className: 'sbp-award sbp-faker', dataset: { sbp: 'fakers' }, text: `${t('ui.sbpFakerOfNight')}: ${names(summary.fakers)}` }) : null,
                button(t('ui.sbpPlayAgain'), () => { engine.reset(); showSetup(); }, 'primary-btn sbp-big-btn', { sbp: 'again' }),
                button(t('ui.sbpBack'), close, 'link-btn', { sbp: 'back' })
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
            clearTimers();
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
