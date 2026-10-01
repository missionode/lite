(function installChakraTouchGame(global) {
    'use strict';

    // Chakra Touch: a dev-mode (Advanced Features) couples touch game based on
    // sensate focus (slow, no-pressure touch). Two partners take turns: the
    // wheel picks a body zone (mapped to a chakra), a card picks how to touch,
    // the receiver keeps eyes closed for a short timer and then rates it.
    // Consent is built in: each partner privately marks every zone Yes, Maybe
    // or No; a No zone is never picked and a Maybe zone asks first. A Pause
    // button is always on screen. Nothing is saved.

    const LEVELS = Object.freeze(['warm', 'close', 'spicy']);
    const LEVEL_RANK = Object.freeze({ warm: 0, close: 1, spicy: 2 });

    const CHAKRAS = Object.freeze({
        crown: Object.freeze({ color: '#e8e1ff' }),
        thirdeye: Object.freeze({ color: '#8e4ec6' }),
        throat: Object.freeze({ color: '#0090ff' }),
        heart: Object.freeze({ color: '#30a46c' }),
        solar: Object.freeze({ color: '#ffc53d' }),
        sacral: Object.freeze({ color: '#f76b15' }),
        root: Object.freeze({ color: '#e5484d' })
    });

    // Touch zones by chakra and the lowest heat level that includes them.
    // Genitals are never a zone, at any level.
    const ZONES = Object.freeze([
        Object.freeze({ id: 'scalp', chakra: 'crown', level: 'warm' }),
        Object.freeze({ id: 'hair', chakra: 'crown', level: 'warm' }),
        Object.freeze({ id: 'forehead', chakra: 'thirdeye', level: 'warm' }),
        Object.freeze({ id: 'temples', chakra: 'thirdeye', level: 'warm' }),
        Object.freeze({ id: 'shoulders', chakra: 'throat', level: 'warm' }),
        Object.freeze({ id: 'ears', chakra: 'throat', level: 'close' }),
        Object.freeze({ id: 'neck', chakra: 'throat', level: 'close' }),
        Object.freeze({ id: 'upperBack', chakra: 'heart', level: 'warm' }),
        Object.freeze({ id: 'hands', chakra: 'heart', level: 'warm' }),
        Object.freeze({ id: 'chest', chakra: 'heart', level: 'close' }),
        Object.freeze({ id: 'breasts', chakra: 'heart', level: 'spicy' }),
        Object.freeze({ id: 'waist', chakra: 'solar', level: 'close' }),
        Object.freeze({ id: 'stomach', chakra: 'solar', level: 'close' }),
        Object.freeze({ id: 'lowerBack', chakra: 'sacral', level: 'close' }),
        Object.freeze({ id: 'hips', chakra: 'sacral', level: 'close' }),
        Object.freeze({ id: 'lowerBelly', chakra: 'sacral', level: 'spicy' }),
        Object.freeze({ id: 'buttocks', chakra: 'sacral', level: 'spicy' }),
        Object.freeze({ id: 'feet', chakra: 'root', level: 'warm' }),
        Object.freeze({ id: 'legs', chakra: 'root', level: 'warm' }),
        Object.freeze({ id: 'thighs', chakra: 'root', level: 'close' }),
        Object.freeze({ id: 'innerThighs', chakra: 'root', level: 'spicy' })
    ]);

    const TOUCHES = Object.freeze([
        Object.freeze({ id: 'feather', level: 'warm' }),
        Object.freeze({ id: 'palm', level: 'warm' }),
        Object.freeze({ id: 'circles', level: 'warm' }),
        Object.freeze({ id: 'letter', level: 'warm' }),
        Object.freeze({ id: 'breath', level: 'warm' }),
        Object.freeze({ id: 'choice', level: 'warm' }),
        Object.freeze({ id: 'kiss', level: 'close' }),
        Object.freeze({ id: 'slowTrail', level: 'spicy' })
    ]);

    const LUCK_CARDS = Object.freeze(['swapGiver', 'doubleTime', 'yourChoice', 'slowMotion']);
    const LUCK_CHANCE = 0.2;
    const SWAP_PROMPTS = Object.freeze(['touchLike', 'askLike', 'favouriteLine', 'reactLike', 'dressUp']);
    const ROUND_OPTIONS = Object.freeze([6, 10, 14]);
    const SECONDS_OPTIONS = Object.freeze([30, 45, 60]);
    const CHECK_IN_EVERY = 3;
    const RATINGS = Object.freeze(['more', 'justRight', 'less']);
    const CONSENT = Object.freeze(['yes', 'maybe', 'no']);
    const LETTERS = 'ACEHILMNOSTUV';

    function pick(list, random) {
        return list[Math.floor(random() * list.length)];
    }

    function zonesForLevel(level) {
        return ZONES.filter(zone => LEVEL_RANK[zone.level] <= LEVEL_RANK[level]);
    }

    function touchesForLevel(level) {
        return TOUCHES.filter(touch => LEVEL_RANK[touch.level] <= LEVEL_RANK[level]);
    }

    // Default map: Warm zones Yes, everything above Warm Maybe.
    function defaultConsent(level) {
        return Object.fromEntries(zonesForLevel(level).map(zone => [zone.id, zone.level === 'warm' ? 'yes' : 'maybe']));
    }

    // ── Pure engine (no DOM) ─────────────────────────────────────────────
    function createEngine({ random = Math.random } = {}) {
        let game = null;

        function start({ level = 'warm', rounds = 10, seconds = 45, swapRoles = false, names = [] } = {}) {
            if (!LEVELS.includes(level)) throw new Error(`Unknown level ${level}`);
            game = {
                level,
                totalRounds: ROUND_OPTIONS.includes(rounds) ? rounds : 10,
                seconds: SECONDS_OPTIONS.includes(seconds) ? seconds : 45,
                swapRoles: Boolean(swapRoles),
                players: [0, 1].map(index => ({
                    index,
                    name: String(names[index] || '').trim().slice(0, 24),
                    consent: defaultConsent(level),
                    ratings: {}
                })),
                round: 0,
                current: null,
                history: [],
                finished: false
            };
            return game;
        }

        function setConsent(playerIndex, zoneId, value) {
            if (!game) return;
            const zone = zonesForLevel(game.level).find(item => item.id === zoneId);
            if (!zone || !CONSENT.includes(value)) return;
            game.players[playerIndex].consent[zoneId] = value;
        }

        function allowedZones(receiverIndex) {
            const consent = game.players[receiverIndex].consent;
            return zonesForLevel(game.level).filter(zone => consent[zone.id] && consent[zone.id] !== 'no');
        }

        // Next round: alternate giver; a luck card may swap the giver.
        function nextRound() {
            if (!game || game.finished) return null;
            if (game.round >= game.totalRounds) { game.finished = true; return null; }
            game.round += 1;
            let giver = (game.round - 1) % 2;
            const luck = random() < LUCK_CHANCE ? pick(LUCK_CARDS, random) : null;
            if (luck === 'swapGiver') giver = 1 - giver;
            const receiver = 1 - giver;
            const zones = allowedZones(receiver);
            const zone = zones.length ? pick(zones, random) : null;
            const touch = pick(touchesForLevel(game.level), random);
            game.current = {
                round: game.round,
                giver,
                receiver,
                luck,
                zone: zone ? zone.id : null,
                touch: touch.id,
                letter: touch.id === 'letter' ? pick(LETTERS, random) : null,
                seconds: game.seconds * (luck === 'doubleTime' ? 2 : 1),
                needsAsk: Boolean(zone) && game.players[receiver].consent[zone.id] === 'maybe',
                swapPrompt: game.swapRoles ? pick(SWAP_PROMPTS, random) : null,
                rating: null,
                skipped: !zone
            };
            return game.current;
        }

        // Receiver said "not this time" to a Maybe zone: pick another zone,
        // never a No zone and never the declined one again this round.
        function declineZone() {
            const current = game?.current;
            if (!current || !current.zone) return null;
            const declined = new Set([...(current.declined || []), current.zone]);
            const options = allowedZones(current.receiver).filter(zone => !declined.has(zone.id));
            const zone = options.length ? pick(options, random) : null;
            current.declined = [...declined];
            current.zone = zone ? zone.id : null;
            current.needsAsk = Boolean(zone) && game.players[current.receiver].consent[zone.id] === 'maybe';
            current.skipped = !zone;
            return current;
        }

        function chooseZone(zoneId) {
            const current = game?.current;
            if (!current) return null;
            const zone = allowedZones(current.receiver).find(item => item.id === zoneId);
            if (!zone) return null;
            current.zone = zone.id;
            current.needsAsk = false; // the receiver chose it
            current.skipped = false;
            return current;
        }

        function rate(value) {
            const current = game?.current;
            if (!current || !RATINGS.includes(value) || !current.zone) return null;
            current.rating = value;
            const ratings = game.players[current.receiver].ratings;
            ratings[current.zone] = ratings[current.zone] || { more: 0, justRight: 0, less: 0 };
            ratings[current.zone][value] += 1;
            game.history.push({ ...current });
            return current;
        }

        function skipRound() {
            const current = game?.current;
            if (!current) return null;
            current.skipped = true;
            game.history.push({ ...current });
            return current;
        }

        function needsCheckIn() {
            return Boolean(game) && game.round > 0 && game.round % CHECK_IN_EVERY === 0 && game.round < game.totalRounds;
        }

        // Lower the heat one step (from the check-in) without losing ratings.
        function lowerLevel() {
            if (!game || game.level === 'warm') return game?.level;
            const next = LEVELS[LEVEL_RANK[game.level] - 1];
            game.level = next;
            game.players.forEach(player => {
                Object.keys(player.consent).forEach(zoneId => {
                    const zone = ZONES.find(item => item.id === zoneId);
                    if (LEVEL_RANK[zone.level] > LEVEL_RANK[next]) delete player.consent[zoneId];
                });
            });
            return next;
        }

        // Private "what we liked": each receiver's zones with most "More".
        function summary() {
            if (!game) return null;
            game.finished = true;
            return game.players.map(player => ({
                index: player.index,
                name: player.name,
                favourites: Object.entries(player.ratings)
                    .filter(([, counts]) => counts.more > 0)
                    .sort((a, b) => b[1].more - a[1].more || a[1].less - b[1].less || a[0].localeCompare(b[0]))
                    .slice(0, 3)
                    .map(([zoneId]) => zoneId)
            }));
        }

        function reset() { game = null; }

        return Object.freeze({
            start, setConsent, allowedZones, nextRound, declineZone, chooseZone, rate, skipRound,
            needsCheckIn, lowerLevel, summary, reset,
            get game() { return game; }
        });
    }

    // ── View (DOM) ────────────────────────────────────────────────────────
    function mount({
        document = global.document, root, t, showScreen, gameScreen, returnScreen, isUnlocked, random = Math.random,
        holdMs = 900, spinMs = 1800
    } = {}) {
        if (!document || !root || typeof t !== 'function' || typeof showScreen !== 'function' ||
            !gameScreen || typeof isUnlocked !== 'function') {
            throw new TypeError('Chakra Touch needs its screen, translator and dev-mode check');
        }
        const view = document.defaultView || global;
        const engine = createEngine({ random });
        const PLAYER_COLORS = ['#ff8a4c', '#a78bfa'];
        let setup = { level: 'warm', rounds: 10, seconds: 45, swapRoles: false, names: ['', ''] };
        let timers = [];
        let tick = null;
        let paused = false;
        let pausedFrom = null;

        const later = (fn, ms) => { const id = view.setTimeout(fn, ms); timers.push(id); return id; };
        const clearTimers = () => {
            timers.forEach(id => view.clearTimeout(id)); timers = [];
            if (tick) { view.clearInterval(tick); tick = null; }
        };
        const reducedMotion = () => Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
        const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.split(`{{${key}}}`).join(value), template);

        const el = (tag, options = {}, children = []) => {
            const node = document.createElement(tag);
            if (options.className) node.className = options.className;
            if (options.text !== undefined) node.textContent = options.text;
            if (options.type) node.type = options.type;
            if (options.style) {
                Object.entries(options.style).forEach(([key, value]) => {
                    if (key.startsWith('--')) node.style.setProperty(key, value); else node.style[key] = value;
                });
            }
            if (options.dataset) Object.assign(node.dataset, options.dataset);
            if (options.attrs) Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
            if (options.onClick) node.addEventListener('click', options.onClick);
            children.forEach(child => child && node.append(child));
            return node;
        };
        const button = (text, onClick, className = 'primary-btn', dataset) => el('button', { type: 'button', className, text, onClick, dataset });
        const name = index => {
            const typed = engine.game?.players[index]?.name || setup.names[index];
            return typed || t(index === 0 ? 'ui.ctPartner1' : 'ui.ctPartner2');
        };
        const zoneName = id => t(`ui.ctZone_${id}`);
        const chakraImage = (chakra, size = 'md') => el('img', {
            className: `ct-chakra-img ct-chakra-img-${size}`,
            attrs: { src: `symbols/${chakra}.png`, alt: '', 'aria-hidden': 'true', draggable: 'false' },
            style: { '--ct-color': CHAKRAS[chakra].color }
        });

        function guard() {
            if (isUnlocked()) return true;
            close();
            return false;
        }

        // Always-visible Pause (safe word) button.
        function pauseButton() {
            return el('button', {
                type: 'button', className: 'ct-pause', text: t('ui.ctPause'), dataset: { ct: 'pause' },
                attrs: { 'aria-label': t('ui.ctPause') },
                onClick: () => showPaused()
            });
        }

        function render({ color = '#ff8a4c', className = '', withPause = true } = {}, ...children) {
            if (tick) { view.clearInterval(tick); tick = null; }
            timers.forEach(id => view.clearTimeout(id)); timers = [];
            const panel = el('div', { className: `ct-panel ct-enter ${className}`.trim(), style: { '--ct-color': color } }, [
                withPause && engine.game ? pauseButton() : null,
                ...children
            ]);
            root.replaceChildren(panel);
            root.closest?.('.screen')?.scrollTo?.(0, 0);
            const heading = panel.querySelector('h2');
            heading?.setAttribute('tabindex', '-1');
            heading?.focus?.({ preventScroll: true });
            return panel;
        }

        function chime() {
            try { view.navigator?.vibrate?.([40, 60, 40]); } catch (error) { /* optional */ }
            try {
                const Context = view.AudioContext || view.webkitAudioContext;
                if (!Context) return;
                const audio = new Context();
                const now = audio.currentTime;
                [659.25, 987.77].forEach((freq, index) => {
                    const osc = audio.createOscillator();
                    const gain = audio.createGain();
                    osc.frequency.value = freq;
                    const start = now + index * 0.18;
                    gain.gain.setValueAtTime(0.0001, start);
                    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.03);
                    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
                    osc.connect(gain).connect(audio.destination);
                    osc.start(start);
                    osc.stop(start + 1);
                });
                later(() => audio.close?.(), 1500);
            } catch (error) { /* sound is optional */ }
        }

        function choiceRow(labelKey, options, current, onPick, testId, labelFor) {
            const buttons = options.map(option => el('button', {
                type: 'button', className: 'ct-choice', text: labelFor(option),
                dataset: { ct: testId, value: String(option) }, attrs: { 'aria-pressed': String(option === current) },
                onClick: () => {
                    onPick(option);
                    buttons.forEach(item => {
                        const on = item.dataset.value === String(option);
                        item.classList.toggle('is-selected', on);
                        item.setAttribute('aria-pressed', String(on));
                    });
                }
            }));
            buttons.forEach(item => item.classList.toggle('is-selected', item.dataset.value === String(current)));
            return el('div', { className: 'ct-row' }, [el('span', { className: 'ct-row-label', text: t(labelKey) }), el('div', { className: 'ct-choices' }, buttons)]);
        }

        // ── Setup ──
        function showSetup() {
            if (!guard()) return;
            engine.reset();
            const nameInputs = [0, 1].map(index => {
                const input = el('input', {
                    className: 'ct-name', type: 'text', dataset: { ct: `name-${index}` },
                    attrs: { maxlength: '24', placeholder: t(index === 0 ? 'ui.ctPartner1' : 'ui.ctPartner2'), 'aria-label': t(index === 0 ? 'ui.ctPartner1' : 'ui.ctPartner2'), autocomplete: 'off' }
                });
                input.value = setup.names[index];
                input.addEventListener('input', () => { setup.names[index] = input.value; });
                return input;
            });
            const swap = el('input', { type: 'checkbox', dataset: { ct: 'swap-roles' } });
            swap.checked = setup.swapRoles;
            swap.addEventListener('change', () => { setup.swapRoles = swap.checked; });
            render({ withPause: false },
                el('h2', { className: 'ct-title', text: t('ui.ctTitle') }),
                el('p', { className: 'ct-lead', text: t('ui.ctIntro') }),
                el('div', { className: 'ct-names' }, nameInputs),
                choiceRow('ui.ctLevel', LEVELS, setup.level, value => { setup.level = value; }, 'level', value => t(`ui.ctLevel_${value}`)),
                choiceRow('ui.ctRounds', ROUND_OPTIONS, setup.rounds, value => { setup.rounds = value; }, 'rounds', value => String(value)),
                choiceRow('ui.ctSeconds', SECONDS_OPTIONS, setup.seconds, value => { setup.seconds = value; }, 'seconds', value => fill(t('ui.ctSecondsValue'), { seconds: String(value) })),
                el('label', { className: 'ct-swap' }, [swap, el('span', {}, [el('strong', { text: t('ui.ctSwapRoles') }), el('small', { text: t('ui.ctSwapRolesNote') })])]),
                el('p', { className: 'ct-note', text: t('ui.ctSafetyNote') }),
                button(t('ui.ctStart'), () => (setup.level === 'spicy' ? showAdultCheck() : beginConsent()), 'primary-btn ct-big', { ct: 'start' }),
                button(t('ui.sbpBack'), close, 'link-btn', { ct: 'back' })
            );
        }

        // Spicy needs both partners to confirm.
        function showAdultCheck() {
            if (!guard()) return;
            const boxes = [0, 1].map(index => {
                const box = el('input', { type: 'checkbox', dataset: { ct: `adult-${index}` } });
                box.addEventListener('change', sync);
                return { box, row: el('label', { className: 'ct-adult' }, [box, el('span', { text: fill(t('ui.ctAdultConfirm'), { name: name(index) }) })]) };
            });
            const go = button(t('ui.ctContinue'), beginConsent, 'primary-btn ct-big', { ct: 'adult-continue' });
            function sync() { go.disabled = !boxes.every(item => item.box.checked); }
            sync();
            render({ color: '#e5484d', withPause: false, className: 'ct-spicy' },
                el('div', { className: 'ct-badge', text: '18+' }),
                el('h2', { text: t('ui.ctAdultTitle') }),
                el('p', { className: 'ct-lead', text: t('ui.ctAdultNote') }),
                ...boxes.map(item => item.row),
                go,
                button(t('ui.ctPlayWarm'), () => { setup.level = 'close'; beginConsent(); }, 'secondary-btn', { ct: 'adult-lower' })
            );
        }

        function beginConsent() {
            if (!guard()) return;
            engine.start({ ...setup });
            consentFor(0, () => consentFor(1, startSwapIntro));
        }

        // Hand-off lock (press and hold), as in Hush Hush.
        function handOff(index, note, onOpen) {
            if (!guard()) return;
            const hold = el('button', {
                type: 'button', className: 'primary-btn ct-hold', dataset: { ct: 'gate-hold' }, style: { '--ct-hold-ms': `${holdMs}ms` }
            }, [el('span', { className: 'ct-hold-fill', attrs: { 'aria-hidden': 'true' } }), el('span', { text: fill(t('ui.ctHoldToOpen'), { name: name(index) }) })]);
            let timer = null;
            const start = event => {
                if (timer) return;
                if (event?.type === 'keydown' && event.key !== ' ' && event.key !== 'Enter') return;
                event?.preventDefault?.();
                hold.classList.add('is-holding');
                timer = view.setTimeout(() => { timer = null; onOpen(); }, holdMs);
            };
            const stop = () => { if (timer) { view.clearTimeout(timer); timer = null; } hold.classList.remove('is-holding'); };
            hold.addEventListener('pointerdown', start);
            hold.addEventListener('keydown', start);
            ['pointerup', 'pointerleave', 'pointercancel', 'keyup', 'blur'].forEach(type => hold.addEventListener(type, stop));
            hold.addEventListener('contextmenu', event => event.preventDefault());
            render({ color: PLAYER_COLORS[index], withPause: false, className: 'ct-gate' },
                el('span', { className: 'ct-kicker', text: t('ui.ctPassKicker') }),
                el('h2', { className: 'ct-gate-name', text: name(index) }),
                el('p', { className: 'ct-lead', text: note }),
                hold,
                el('p', { className: 'ct-note', text: t('ui.ctHoldHint') })
            );
        }

        // Private Yes / Maybe / No map for one partner.
        function consentFor(index, done) {
            handOff(index, t('ui.ctConsentPrivate'), () => {
                const player = engine.game.players[index];
                const rows = zonesForLevel(engine.game.level).map(zone => {
                    const buttons = CONSENT.map(value => el('button', {
                        type: 'button', className: `ct-consent ct-consent-${value}`, text: t(`ui.ctConsent_${value}`),
                        dataset: { ct: 'consent', zone: zone.id, value }, attrs: { 'aria-pressed': String(player.consent[zone.id] === value) },
                        onClick: () => {
                            engine.setConsent(index, zone.id, value);
                            buttons.forEach(item => {
                                const on = item.dataset.value === value;
                                item.classList.toggle('is-selected', on);
                                item.setAttribute('aria-pressed', String(on));
                            });
                        }
                    }));
                    buttons.forEach(item => item.classList.toggle('is-selected', item.dataset.value === player.consent[zone.id]));
                    return el('li', { className: 'ct-consent-row', style: { '--ct-zone': CHAKRAS[zone.chakra].color } }, [
                        chakraImage(zone.chakra, 'xs'),
                        el('span', { className: 'ct-consent-zone', text: zoneName(zone.id) }),
                        el('span', { className: 'ct-consent-buttons' }, buttons)
                    ]);
                });
                render({ color: PLAYER_COLORS[index], withPause: false },
                    el('h2', { text: fill(t('ui.ctConsentTitle'), { name: name(index) }) }),
                    el('p', { className: 'ct-lead', text: t('ui.ctConsentNote') }),
                    el('ul', { className: 'ct-consent-list' }, rows),
                    button(t('ui.ctConsentDone'), done, 'primary-btn ct-big', { ct: 'consent-done' })
                );
            });
        }

        function startSwapIntro() {
            if (!guard()) return;
            if (!engine.game.swapRoles) { showSpin(); return; }
            render({ color: '#a78bfa', className: 'ct-swap-scene' },
                el('div', { className: 'ct-swap-orbs', attrs: { 'aria-hidden': 'true' } }, [
                    el('span', { style: { '--ct-color': PLAYER_COLORS[0] } }), el('span', { style: { '--ct-color': PLAYER_COLORS[1] } })
                ]),
                el('h2', { className: 'ct-title', text: t('ui.ctSwapBegins') }),
                el('p', { className: 'ct-lead', text: fill(t('ui.ctSwapBeginsNote'), { first: name(0), second: name(1) }) }),
                button(t('ui.ctContinue'), showSpin, 'primary-btn ct-big', { ct: 'continue' })
            );
        }

        // ── Rounds ──
        function showSpin() {
            if (!guard()) return;
            const round = engine.nextRound();
            if (!round) { showEnd(); return; }
            const zones = zonesForLevel(engine.game.level);
            const slice = 360 / zones.length;
            const gradient = zones.map((zone, index) => `${CHAKRAS[zone.chakra].color} ${index * slice}deg ${(index + 1) * slice}deg`).join(', ');
            const disc = el('div', { className: 'ct-wheel-disc', style: { background: `conic-gradient(${gradient})` } });
            const wheel = el('div', { className: 'ct-wheel', dataset: { ct: 'wheel' } }, [el('span', { className: 'ct-wheel-pointer', attrs: { 'aria-hidden': 'true' } }), disc]);
            const spin = button(t('ui.ctSpin'), () => {
                spin.disabled = true;
                const target = Math.max(0, zones.findIndex(zone => zone.id === round.zone));
                const duration = reducedMotion() ? 0 : spinMs;
                disc.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.2, 1)`;
                disc.style.transform = `rotate(${360 * 4 + (360 - (target * slice + slice / 2))}deg)`;
                later(showRound, duration + (duration ? 200 : 0));
            }, 'primary-btn ct-big', { ct: 'spin' });
            render({ color: PLAYER_COLORS[round.giver] },
                el('span', { className: 'ct-kicker', text: fill(t('ui.ctRoundOf'), { round: String(round.round), total: String(engine.game.totalRounds) }) }),
                roleBanner(round),
                wheel,
                spin
            );
        }

        function roleBanner(round) {
            return el('div', { className: 'ct-roles', dataset: { ct: 'roles' } }, [
                el('span', { className: 'ct-role', style: { '--ct-color': PLAYER_COLORS[round.giver] } }, [el('small', { text: t('ui.ctGives') }), el('strong', { text: name(round.giver) })]),
                el('span', { className: 'ct-role-arrow', text: '→', attrs: { 'aria-hidden': 'true' } }),
                el('span', { className: 'ct-role', style: { '--ct-color': PLAYER_COLORS[round.receiver] } }, [el('small', { text: t('ui.ctReceives') }), el('strong', { text: name(round.receiver) })])
            ]);
        }

        function showRound() {
            if (!guard()) return;
            const round = engine.game.current;
            if (!round.zone) {
                render({ color: PLAYER_COLORS[round.giver] },
                    el('h2', { text: t('ui.ctNoZone') }),
                    el('p', { className: 'ct-lead', text: t('ui.ctNoZoneNote') }),
                    button(t('ui.ctNext'), () => { engine.skipRound(); afterRound(); }, 'primary-btn ct-big', { ct: 'next' })
                );
                return;
            }
            const zone = ZONES.find(item => item.id === round.zone);
            if (round.luck === 'yourChoice' && !round.choseZone) { showYourChoice(); return; }
            if (round.needsAsk) { showAsk(zone); return; }
            const lines = [
                roleBanner(round),
                round.luck ? el('div', { className: 'ct-luck', dataset: { ct: `luck-${round.luck}` } }, [
                    el('span', { className: 'ct-kicker', text: t('ui.ctLuckTitle') }),
                    el('strong', { text: t(`ui.ctLuck_${round.luck}`) }),
                    el('p', { text: fill(t(`ui.ctLuck_${round.luck}_note`), { giver: name(round.giver), receiver: name(round.receiver) }) })
                ]) : null,
                chakraImage(zone.chakra, 'lg'),
                el('h2', { className: 'ct-zone', text: zoneName(zone.id), dataset: { ct: 'zone' } }),
                el('div', { className: 'ct-touch', dataset: { ct: 'touch', touch: round.touch } }, [
                    el('strong', { text: t(`ui.ctTouch_${round.touch}`) }),
                    el('p', { text: fill(t(`ui.ctTouch_${round.touch}_note`), { letter: round.letter || '' }) })
                ]),
                round.luck === 'slowMotion' ? el('p', { className: 'ct-note', text: t('ui.ctSlowMotionHint') }) : null,
                round.swapPrompt ? el('p', { className: 'ct-swap-prompt', dataset: { ct: 'swap-prompt' }, text: t(`ui.ctSwapPrompt_${round.swapPrompt}`) }) : null,
                el('p', { className: 'ct-lead', text: fill(t('ui.ctEyesClosed'), { receiver: name(round.receiver) }) }),
                button(fill(t('ui.ctStartTimer'), { seconds: String(round.seconds) }), () => showTimer(round.seconds), 'primary-btn ct-big', { ct: 'start-timer' })
            ];
            render({ color: CHAKRAS[zone.chakra].color }, ...lines);
        }

        function showAsk(zone) {
            const round = engine.game.current;
            render({ color: PLAYER_COLORS[round.receiver] },
                el('span', { className: 'ct-kicker', text: t('ui.ctMaybeKicker') }),
                chakraImage(zone.chakra, 'md'),
                el('h2', { text: fill(t('ui.ctMaybeAsk'), { receiver: name(round.receiver), zone: zoneName(zone.id) }) }),
                el('div', { className: 'ct-actions' }, [
                    button(t('ui.ctMaybeYes'), () => { round.needsAsk = false; showRound(); }, 'primary-btn', { ct: 'maybe-yes' }),
                    button(t('ui.ctMaybeNo'), () => { engine.declineZone(); showRound(); }, 'secondary-btn', { ct: 'maybe-no' })
                ])
            );
        }

        function showYourChoice() {
            const round = engine.game.current;
            const options = engine.allowedZones(round.receiver).map(zone => el('button', {
                type: 'button', className: 'ct-choice', text: zoneName(zone.id), dataset: { ct: 'choose-zone', zone: zone.id },
                onClick: () => { engine.chooseZone(zone.id); round.choseZone = true; showRound(); }
            }));
            render({ color: PLAYER_COLORS[round.receiver] },
                el('span', { className: 'ct-kicker', text: t('ui.ctLuckTitle') }),
                el('h2', { text: fill(t('ui.ctYourChoiceTitle'), { receiver: name(round.receiver) }) }),
                el('div', { className: 'ct-choices ct-choices-wrap' }, options)
            );
        }

        function showTimer(seconds, remainingStart = seconds) {
            if (!guard()) return;
            const round = engine.game.current;
            const zone = ZONES.find(item => item.id === round.zone);
            let remaining = remainingStart;
            const value = el('span', { className: 'ct-timer-value', text: String(remaining), attrs: { role: 'timer', 'aria-live': 'off' }, dataset: { ct: 'timer' } });
            const ring = el('div', { className: 'ct-timer', style: { '--ct-progress': String(remaining / seconds) } }, [value]);
            render({ color: CHAKRAS[zone.chakra].color, className: 'ct-timing' },
                el('span', { className: 'ct-kicker', text: zoneName(zone.id) }),
                ring,
                el('p', { className: 'ct-lead', text: t(`ui.ctTouch_${round.touch}`) }),
                button(t('ui.ctFinishEarly'), () => { clearTimers(); showRating(); }, 'link-btn', { ct: 'finish-early' })
            );
            pausedFrom = () => showTimer(seconds, remaining);
            tick = view.setInterval(() => {
                if (paused) return;
                remaining -= 1;
                value.textContent = String(Math.max(0, remaining));
                ring.style.setProperty('--ct-progress', String(Math.max(0, remaining) / seconds));
                if (remaining <= 0) { clearTimers(); chime(); showRating(); }
            }, 1000);
        }

        function showRating() {
            if (!guard()) return;
            pausedFrom = null;
            const round = engine.game.current;
            const zone = ZONES.find(item => item.id === round.zone);
            render({ color: PLAYER_COLORS[round.receiver] },
                el('span', { className: 'ct-kicker', text: zoneName(zone.id) }),
                el('h2', { text: fill(t('ui.ctRateTitle'), { receiver: name(round.receiver) }) }),
                round.touch === 'letter' ? el('p', { className: 'ct-note', dataset: { ct: 'letter-answer' }, text: fill(t('ui.ctLetterReveal'), { letter: round.letter }) }) : null,
                el('div', { className: 'ct-ratings' }, RATINGS.map(value => button(t(`ui.ctRate_${value}`), () => { engine.rate(value); afterRound(); }, `ct-rate ct-rate-${value}`, { ct: `rate-${value}` })))
            );
        }

        function afterRound() {
            if (!guard()) return;
            if (engine.game.round >= engine.game.totalRounds) { showEnd(); return; }
            if (engine.needsCheckIn()) { showCheckIn(); return; }
            const next = (engine.game.round) % 2;
            handOff(next, t('ui.ctNextGiverNote'), showSpin);
        }

        function showCheckIn() {
            render({ color: '#30a46c', withPause: false },
                el('h2', { text: t('ui.ctCheckInTitle') }),
                el('p', { className: 'ct-lead', text: t('ui.ctCheckInNote') }),
                button(t('ui.ctCheckInGood'), () => handOff(engine.game.round % 2, t('ui.ctNextGiverNote'), showSpin), 'primary-btn ct-big', { ct: 'checkin-good' }),
                engine.game.level !== 'warm' ? button(t('ui.ctCheckInLower'), () => { engine.lowerLevel(); handOff(engine.game.round % 2, t('ui.ctNextGiverNote'), showSpin); }, 'secondary-btn', { ct: 'checkin-lower' }) : null,
                button(t('ui.ctCheckInEnd'), showEnd, 'link-btn', { ct: 'checkin-end' })
            );
        }

        // Pause = safe word. Stops the timer; nothing continues without both.
        function showPaused() {
            if (!engine.game) return;
            paused = true;
            const resume = pausedFrom;
            clearTimers();
            render({ color: '#30a46c', withPause: false, className: 'ct-paused' },
                el('h2', { text: t('ui.ctPausedTitle'), dataset: { ct: 'paused' } }),
                el('p', { className: 'ct-lead', text: t('ui.ctPausedNote') }),
                button(t('ui.ctResume'), () => { paused = false; if (resume) resume(); else showSpinOrRating(); }, 'primary-btn ct-big', { ct: 'resume' }),
                button(t('ui.ctSkipRound'), () => { paused = false; pausedFrom = null; engine.skipRound(); afterRound(); }, 'secondary-btn', { ct: 'skip-round' }),
                button(t('ui.ctCheckInEnd'), () => { paused = false; showEnd(); }, 'link-btn', { ct: 'paused-end' })
            );
        }

        function showSpinOrRating() {
            const round = engine.game?.current;
            if (round && !round.rating && !round.skipped && round.zone) showRound();
            else afterRound();
        }

        function showEnd() {
            if (!guard()) return;
            pausedFrom = null;
            const swapRoles = engine.game?.swapRoles;
            const results = engine.summary() || [];
            const cards = results.map(result => el('li', { className: 'ct-end-card', style: { '--ct-color': PLAYER_COLORS[result.index] }, dataset: { ct: 'favourites' } }, [
                el('strong', { text: fill(t('ui.ctLiked'), { name: name(result.index) }) }),
                el('span', { text: result.favourites.length ? result.favourites.map(zoneName).join(', ') : t('ui.ctLikedNone') })
            ]));
            render({ color: '#a78bfa', withPause: false },
                swapRoles ? el('div', { className: 'ct-swap-end', dataset: { ct: 'swap-end' } }, [
                    el('h2', { className: 'ct-title', text: t('ui.ctSwapEnds') }),
                    el('p', { className: 'ct-lead', text: t('ui.ctSwapReflect') })
                ]) : el('h2', { className: 'ct-title', text: t('ui.ctEndTitle') }),
                el('p', { className: 'ct-note', text: t('ui.ctEndNote') }),
                el('ul', { className: 'ct-end' }, cards),
                button(t('ui.ctPlayAgain'), showSetup, 'primary-btn ct-big', { ct: 'again' }),
                button(t('ui.sbpBack'), close, 'link-btn', { ct: 'end-back' })
            );
            engine.reset();
        }

        function open() {
            if (!isUnlocked()) return false;
            paused = false;
            pausedFrom = null;
            setup = { level: 'warm', rounds: 10, seconds: 45, swapRoles: false, names: ['', ''] };
            showScreen(gameScreen);
            showSetup();
            return true;
        }

        function close() {
            clearTimers();
            paused = false;
            pausedFrom = null;
            engine.reset();
            root.replaceChildren();
            if (returnScreen && !gameScreen.classList.contains('hidden')) showScreen(returnScreen);
        }

        return Object.freeze({ open, close, engine });
    }

    global.ChakraTouchGame = Object.freeze({
        createEngine, mount, LEVELS, ZONES, TOUCHES, LUCK_CARDS, SWAP_PROMPTS, ROUND_OPTIONS, SECONDS_OPTIONS,
        CHECK_IN_EVERY, RATINGS, CONSENT, zonesForLevel, touchesForLevel, defaultConsent
    });
})(typeof window === 'undefined' ? globalThis : window);
