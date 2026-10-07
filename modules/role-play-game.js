(function installRolePlayGame(global) {
    'use strict';

    // Walk in My Shoes: a developer-mode (Advanced Features) role-play acting
    // game for the Play Zone. Players agree to play and finalise their roles;
    // there is no script, they invent the story themselves. A spinner wheel
    // decides how long the role play lasts (nobody picks the time). At zero a
    // soft chime plays and the role play ends. The screen stays awake while it
    // runs. Nothing is saved and nothing is recorded.

    // Three or more players: only the Radha and Krishna scene is offered; the
    // extra players join as their friends.
    const GROUP_SCENE = 'radha-krishna';
    const SCENES = Object.freeze([
        Object.freeze({ id: 'radha-krishna', roles: Object.freeze(['radha', 'krishna']), extraRole: 'friend' }),
        Object.freeze({ id: 'storyteller', roles: Object.freeze(['storyteller', 'listener']) }),
        Object.freeze({ id: 'teacher', roles: Object.freeze(['teacher', 'student']) }),
        Object.freeze({ id: 'guide', roles: Object.freeze(['guide', 'traveller']) }),
        Object.freeze({ id: 'interview', roles: Object.freeze(['interviewer', 'guest']) }),
        Object.freeze({ id: 'old-friends', roles: Object.freeze(['oldFriend', 'returnedFriend']) })
    ]);
    // The wheel's slices. The spinner decides; nobody chooses the time.
    const WHEEL_MINUTES = Object.freeze([5, 10, 15, 20, 30]);
    const WHEEL_COLORS = Object.freeze(['#d94a4a', '#e9892e', '#d9b53a', '#43a96b', '#4a90d9']);
    const SPIN_MS = 4200;
    // Player choices: 2, 3, or 3+ (four or more, set with the stepper).
    const MIN_PLAYERS = 2;
    const MIN_GROUP_PLAYERS = 4;
    const MAX_PLAYERS = 8;
    const CLOSING_PROMPTS = Object.freeze(['rpClosing1', 'rpClosing2', 'rpClosing3']);

    function sceneById(id) {
        return SCENES.find(scene => scene.id === id) || SCENES[0];
    }

    // The roles on offer for a scene and a number of players, in order.
    function roleList(sceneId, playerCount) {
        const scene = sceneById(sceneId);
        const count = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, playerCount));
        const roles = [...scene.roles];
        while (roles.length < count) roles.push(scene.extraRole || scene.roles[roles.length % scene.roles.length]);
        return roles;
    }

    // True when the assigned roles are exactly the roles of the scene.
    function rolesAreComplete(sceneId, assigned) {
        const expected = roleList(sceneId, assigned.length).slice().sort();
        return assigned.length === expected.length && assigned.slice().sort().every((role, index) => role === expected[index]);
    }

    function formatClock(totalSeconds) {
        const seconds = Math.max(0, Math.round(totalSeconds));
        return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }

    // Where the wheel stops so the pointer rests on slice `index` after five turns.
    function landingAngle(index, sliceCount) {
        const slice = 360 / sliceCount;
        return 360 * 5 + (360 - (index * slice + slice / 2));
    }

    // A soft three-note bell made with Web Audio, so no sound file is needed.
    // prime() must run inside the Play tap: phones only allow sound after a tap.
    function createChime({ AudioContextCtor } = {}) {
        let ctx = null;
        function prime() {
            if (ctx || !AudioContextCtor) return;
            try {
                ctx = new AudioContextCtor();
                ctx.resume?.();
            } catch (error) {
                ctx = null;
            }
        }
        function play() {
            if (!ctx) return false;
            try {
                const start = ctx.currentTime;
                [[660, 0], [880, 0.45], [1320, 0.9]].forEach(([frequency, offset]) => {
                    const oscillator = ctx.createOscillator();
                    const gain = ctx.createGain();
                    oscillator.type = 'sine';
                    oscillator.frequency.value = frequency;
                    gain.gain.setValueAtTime(0.0001, start + offset);
                    gain.gain.exponentialRampToValueAtTime(0.22, start + offset + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 2.4);
                    oscillator.connect(gain);
                    gain.connect(ctx.destination);
                    oscillator.start(start + offset);
                    oscillator.stop(start + offset + 2.5);
                });
                return true;
            } catch (error) {
                return false;
            }
        }
        function dispose() {
            if (!ctx) return;
            const closing = ctx;
            ctx = null;
            try { closing.close?.(); } catch (error) { /* already closed */ }
        }
        return Object.freeze({ prime, play, dispose });
    }

    const FIELD_STYLE = 'box-sizing:border-box;width:100%;min-height:2.75rem;padding:.55rem .8rem;color:#fff;background:#0f1826;border:1px solid rgba(255,255,255,.35);border-radius:.8rem;font:inherit;';
    const SLOT_TEXT_STYLE = 'display:block;width:3rem;text-align:center;font-weight:900;font-size:1.15rem;color:#fff;text-shadow:0 1px 4px #000;';

    function mount({
        document = global.document, root, t, showScreen, gameScreen, returnScreen, isUnlocked, wakeLock,
        now = () => Date.now(),
        setInterval: startInterval = (fn, ms) => global.setInterval(fn, ms),
        clearInterval: stopInterval = id => global.clearInterval(id),
        setTimeout: later = (fn, ms) => global.setTimeout(fn, ms),
        clearTimeout: cancelLater = id => global.clearTimeout(id),
        random = () => Math.random(),
        reducedMotion = () => Boolean(global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches),
        AudioContextCtor = global.AudioContext || global.webkitAudioContext,
        vibrate = pattern => global.navigator?.vibrate?.(pattern)
    } = {}) {
        if (!document || !root || typeof t !== 'function' || typeof showScreen !== 'function' ||
            !gameScreen || typeof isUnlocked !== 'function' || !wakeLock || typeof wakeLock.request !== 'function' ||
            typeof wakeLock.release !== 'function') {
            throw new TypeError('Walk in My Shoes needs its screen, translator, dev-mode check and wake lock');
        }
        const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.split(`{{${key}}}`).join(value), template);
        const el = (tag, options = {}, children = []) => {
            const node = document.createElement(tag);
            if (options.className) node.className = options.className;
            if (options.text !== undefined) node.textContent = options.text;
            if (options.type) node.type = options.type;
            if (options.style) node.style.cssText = options.style;
            if (options.dataset) Object.assign(node.dataset, options.dataset);
            if (options.attrs) Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
            if (options.onClick) node.addEventListener('click', options.onClick);
            children.forEach(child => child && node.append(child));
            return node;
        };

        const chime = createChime({ AudioContextCtor });
        let step = 'idle';
        let sceneId = SCENES[0].id;
        let players = [];
        let minutes = null; // set only by the wheel
        let spinTimer = null;
        let timerId = null;
        let endAt = 0;
        let remainingMs = 0;
        let paused = false;
        let clockNode = null;
        let startedRoles = null;

        function resetPlayers(count) {
            const roles = roleList(sceneId, count);
            players = roles.map((role, index) => ({ name: (players[index] && players[index].name) || '', role, agreed: false }));
        }
        function displayName(player, index) {
            return player.name.trim() || `${t('ui.rpPlayer')} ${index + 1}`;
        }
        function focusHeading(panel) {
            const heading = panel.querySelector('h2');
            heading.setAttribute('tabindex', '-1');
            heading.focus?.({ preventScroll: true });
        }
        function show(panel) {
            root.replaceChildren(panel);
            focusHeading(panel);
            root.closest?.('.screen')?.scrollTo?.(0, 0);
        }
        function cancelSpin() {
            if (spinTimer !== null) {
                cancelLater(spinTimer);
                spinTimer = null;
            }
        }
        function roleCards() {
            return el('ul', { className: 'es-steps', dataset: { rp: 'cards' } }, players.map((player, index) => el('li', {}, [
                el('span', { className: 'es-step-num', text: String(index + 1) }),
                el('span', { text: `${displayName(player, index)} — ${t(`ui.rpRole_${player.role}`)}` })
            ])));
        }

        // Players: 2, 3, or 3+ (four or more, with a stepper).
        function countSection() {
            const count = players.length;
            const options = [
                { id: '2', label: '2', on: count === 2, set: () => 2 },
                { id: '3', label: '3', on: count === 3, set: () => 3 },
                { id: '3plus', label: t('ui.rpPlayersMore'), on: count >= MIN_GROUP_PLAYERS, set: () => Math.max(MIN_GROUP_PLAYERS, count) }
            ];
            const buttons = options.map(option => el('button', {
                type: 'button', className: 'es-goal', dataset: { rp: 'count', count: option.id },
                attrs: { 'aria-pressed': String(option.on) },
                onClick: () => {
                    const next = option.set();
                    if (next === players.length) return;
                    sceneId = next > 2 ? GROUP_SCENE : sceneId;
                    resetPlayers(next);
                    renderRoles();
                }
            }, [el('strong', { text: option.label }), el('span', { text: t('ui.rpPlayersWord') })]));
            buttons.forEach((button, index) => button.classList.toggle('is-selected', options[index].on));
            const children = [el('div', { className: 'es-goals', dataset: { rp: 'counts' } }, buttons)];
            if (count >= MIN_GROUP_PLAYERS) {
                const change = delta => () => {
                    const next = Math.min(MAX_PLAYERS, Math.max(MIN_GROUP_PLAYERS, players.length + delta));
                    if (next === players.length) return;
                    resetPlayers(next);
                    renderRoles();
                };
                children.push(el('div', { className: 'es-goals', dataset: { rp: 'stepper' }, style: 'grid-template-columns:3rem 1fr 3rem;align-items:center;' }, [
                    el('button', { type: 'button', className: 'es-goal', text: '−', dataset: { rp: 'fewer' }, attrs: { 'aria-label': t('ui.rpFewer') }, onClick: change(-1) }),
                    el('p', { text: `${count} ${t('ui.rpMorePlayers')}`, dataset: { rp: 'group-count' }, attrs: { 'aria-live': 'polite' }, style: 'margin:0;font-weight:800;' }),
                    el('button', { type: 'button', className: 'es-goal', text: '+', dataset: { rp: 'more' }, attrs: { 'aria-label': t('ui.rpMore') }, onClick: change(1) })
                ]));
            }
            return el('section', { className: 'es-section' }, [el('h3', { text: t('ui.rpPlayersTitle') }), ...children]);
        }

        function sceneSelect() {
            const group = players.length > 2;
            const select = el('select', {
                style: FIELD_STYLE, dataset: { rp: 'scene' }, attrs: { 'aria-label': t('ui.rpSceneTitle') }
            }, (group ? [sceneById(GROUP_SCENE)] : SCENES).map(scene => el('option', {
                text: t(`ui.rpScene_${scene.id}`), attrs: { value: scene.id }
            })));
            select.value = sceneId;
            if (group) select.disabled = true;
            select.addEventListener('change', () => {
                sceneId = select.value;
                resetPlayers(players.length);
                renderRoles();
            });
            return select;
        }

        function playerRow(player, index) {
            const roles = [...new Set(roleList(sceneId, players.length))];
            const nameField = el('input', {
                type: 'text', style: FIELD_STYLE, dataset: { rp: 'name', index: String(index) },
                attrs: { maxlength: '24', autocomplete: 'off', placeholder: `${t('ui.rpPlayer')} ${index + 1}`, 'aria-label': `${t('ui.rpPlayerName')} ${index + 1}` }
            });
            nameField.value = player.name;
            nameField.addEventListener('input', () => { player.name = nameField.value; });
            const roleField = el('select', {
                style: FIELD_STYLE, dataset: { rp: 'role', index: String(index) },
                attrs: { 'aria-label': `${t('ui.rpRoleFor')} ${index + 1}` }
            }, roles.map(role => el('option', { text: t(`ui.rpRole_${role}`), attrs: { value: role } })));
            roleField.value = player.role;
            roleField.addEventListener('change', () => {
                const chosen = roleField.value;
                // Swap with whoever holds the chosen role, so the scene's roles stay complete.
                const holder = players.find((other, otherIndex) => otherIndex !== index && other.role === chosen);
                if (holder) holder.role = player.role;
                player.role = chosen;
                renderRoles();
            });
            const agree = el('input', { type: 'checkbox', dataset: { rp: 'agree', index: String(index) } });
            agree.checked = player.agreed;
            agree.addEventListener('change', () => { player.agreed = agree.checked; syncSet(); });
            return el('div', { className: 'es-section', dataset: { rp: 'player' } }, [
                nameField,
                roleField,
                el('label', { style: 'display:flex;gap:.6rem;align-items:center;justify-content:center;' }, [
                    agree,
                    el('span', { text: t('ui.rpHappy') })
                ])
            ]);
        }

        let setButton = null;
        function rolesReady() {
            return players.length >= MIN_PLAYERS && players.every(player => player.agreed) && rolesAreComplete(sceneId, players.map(player => player.role));
        }
        function syncSet() {
            if (setButton) setButton.disabled = !rolesReady();
        }

        function renderRoles() {
            cancelSpin();
            step = 'roles';
            minutes = null;
            setButton = el('button', {
                type: 'button', className: 'primary-btn es-done', text: t('ui.rpRolesSet'), dataset: { rp: 'roles-set' },
                attrs: { disabled: 'true' }, onClick: renderTimer
            });
            const panel = el('div', { className: 'es-panel', dataset: { rp: 'roles' } }, [
                el('h2', { className: 'es-title', text: t('ui.rpTitle') }),
                el('p', { className: 'es-lead', text: t('ui.rpLead') }),
                el('p', { className: 'es-tip', text: t('ui.rpSafety') }),
                countSection(),
                el('section', { className: 'es-section' }, [
                    el('h3', { text: t('ui.rpSceneTitle') }),
                    sceneSelect(),
                    players.length > 2 ? el('p', { className: 'es-tip', text: t('ui.rpGroupNote') }) : null,
                    el('p', { className: 'es-partner', dataset: { rp: 'own-story' }, text: t('ui.rpOwnStory') })
                ]),
                el('section', { className: 'es-section' }, [el('h3', { text: t('ui.rpRolesTitle') }), ...players.map(playerRow)]),
                setButton,
                el('button', { type: 'button', className: 'link-btn', text: t('ui.sbpBack'), dataset: { rp: 'back' }, onClick: close })
            ]);
            show(panel);
            syncSet();
        }

        // The timer is decided by a spinner wheel, never chosen.
        function timerWheel() {
            const slice = 360 / WHEEL_MINUTES.length;
            const gradient = WHEEL_MINUTES.map((value, index) => `${WHEEL_COLORS[index % WHEEL_COLORS.length]} ${index * slice}deg ${(index + 1) * slice}deg`).join(', ');
            const disc = el('div', {
                className: 'sbp-wheel-disc', style: `background:conic-gradient(${gradient});`, dataset: { rp: 'wheel-disc' }
            }, WHEEL_MINUTES.map((value, index) => {
                const angle = index * slice + slice / 2;
                return el('span', {
                    className: 'sbp-wheel-slot', dataset: { rp: 'slice', minutes: String(value) },
                    style: `transform:rotate(${angle}deg) translateY(-6.2rem) rotate(${-angle}deg);`
                }, [el('span', { text: String(value), style: SLOT_TEXT_STYLE })]);
            }));
            return {
                disc,
                node: el('div', { className: 'sbp-wheel', dataset: { rp: 'wheel' }, attrs: { 'aria-hidden': 'true' } }, [
                    el('span', { className: 'sbp-wheel-pointer', attrs: { 'aria-hidden': 'true' } }), disc
                ])
            };
        }

        function renderTimer() {
            if (!rolesReady()) return renderRoles();
            cancelSpin();
            step = 'timer';
            minutes = null;
            const spinner = timerWheel();
            const status = el('p', { className: 'es-partner', dataset: { rp: 'spin-status' }, text: t('ui.rpSpinNote'), attrs: { 'aria-live': 'polite' } });
            const playButton = el('button', {
                type: 'button', className: 'primary-btn es-done', text: t('ui.rpPlay'), dataset: { rp: 'play' }, onClick: start
            });
            playButton.hidden = true;
            const spinButton = el('button', {
                type: 'button', className: 'primary-btn es-done', text: t('ui.rpSpin'), dataset: { rp: 'spin' },
                onClick: () => {
                    if (minutes !== null || spinTimer !== null) return;
                    spinButton.disabled = true;
                    const index = Math.min(WHEEL_MINUTES.length - 1, Math.floor(random() * WHEEL_MINUTES.length));
                    const duration = reducedMotion() ? 0 : SPIN_MS;
                    spinner.disc.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.2, 1)`;
                    spinner.disc.style.transform = `rotate(${landingAngle(index, WHEEL_MINUTES.length)}deg)`;
                    status.textContent = t('ui.rpSpinning');
                    spinTimer = later(() => {
                        spinTimer = null;
                        minutes = WHEEL_MINUTES[index];
                        status.textContent = fill(t('ui.rpSpunTime'), { n: String(minutes) });
                        spinButton.hidden = true;
                        playButton.hidden = false;
                        vibrate([40, 40, 40]);
                    }, duration + (duration ? 250 : 0));
                }
            });
            show(el('div', { className: 'es-panel', dataset: { rp: 'timer' } }, [
                el('h2', { className: 'es-title', text: t('ui.rpTimerTitle') }),
                el('section', { className: 'es-section' }, [el('h3', { text: t('ui.rpRolesTitle') }), roleCards()]),
                spinner.node,
                status,
                spinButton,
                playButton,
                el('button', { type: 'button', className: 'link-btn', text: t('ui.rpChangeRoles'), dataset: { rp: 'change-roles' }, onClick: renderRoles })
            ]));
        }

        function clearTimer() {
            if (timerId !== null) {
                stopInterval(timerId);
                timerId = null;
            }
        }
        function secondsLeft() {
            return paused ? remainingMs / 1000 : Math.max(0, (endAt - now()) / 1000);
        }
        function tick() {
            const left = secondsLeft();
            if (clockNode) clockNode.textContent = formatClock(Math.ceil(left));
            if (left <= 0) finish();
        }
        function schedule() {
            clearTimer();
            timerId = startInterval(tick, 250);
        }

        async function start() {
            if (!isUnlocked() || step !== 'timer' || minutes === null) return;
            chime.prime();
            remainingMs = minutes * 60 * 1000;
            endAt = now() + remainingMs;
            paused = false;
            startedRoles = players.map(player => player.role);
            step = 'play';
            await wakeLock.request();
            renderPlay();
            schedule();
        }

        function renderPlay() {
            clockNode = el('p', {
                className: 'challenge-countdown', text: formatClock(minutes * 60), dataset: { rp: 'clock' },
                attrs: { role: 'timer', 'aria-live': 'off', 'aria-label': t('ui.rpTimeLeft') }
            });
            const pauseButton = el('button', {
                type: 'button', className: 'secondary-btn', text: t('ui.rpPause'), dataset: { rp: 'pause' },
                onClick: () => {
                    if (paused) {
                        endAt = now() + remainingMs;
                        paused = false;
                        pauseButton.textContent = t('ui.rpPause');
                        schedule();
                    } else {
                        remainingMs = Math.max(0, endAt - now());
                        paused = true;
                        clearTimer();
                        pauseButton.textContent = t('ui.rpResume');
                    }
                }
            });
            show(el('div', { className: 'es-panel', dataset: { rp: 'play' } }, [
                el('h2', { className: 'es-title', text: t(`ui.rpScene_${sceneId}`) }),
                clockNode,
                roleCards(),
                el('p', { className: 'es-partner', text: t('ui.rpOwnStory') }),
                pauseButton,
                el('button', { type: 'button', className: 'link-btn', text: t('ui.rpStop'), dataset: { rp: 'stop' }, onClick: stop })
            ]));
        }

        function endPlay() {
            clearTimer();
            paused = false;
            clockNode = null;
            wakeLock.release();
        }

        function finish() {
            if (step !== 'play') return;
            endPlay();
            step = 'closing';
            chime.play();
            vibrate([200, 100, 200]);
            renderClosing();
        }

        // Anyone may stop at any time; no chime, back to the roles step.
        function stop() {
            if (step !== 'play') return;
            endPlay();
            chime.dispose();
            renderRoles();
        }

        function renderClosing() {
            show(el('div', { className: 'es-panel', dataset: { rp: 'closing' } }, [
                el('h2', { className: 'es-title', text: t('ui.rpTimeUp') }),
                el('p', { className: 'es-lead', attrs: { 'aria-live': 'polite' }, text: t('ui.rpThanks') }),
                el('ol', { className: 'es-steps' }, CLOSING_PROMPTS.map((key, index) => el('li', {}, [
                    el('span', { className: 'es-step-num', text: String(index + 1) }),
                    el('span', { text: t(`ui.${key}`) })
                ]))),
                el('button', { type: 'button', className: 'primary-btn es-done', text: t('ui.rpAgain'), dataset: { rp: 'again' }, onClick: playAgain }),
                el('button', { type: 'button', className: 'link-btn', text: t('ui.rpBackToLobby'), dataset: { rp: 'lobby' }, onClick: close })
            ]));
        }

        // Swap roles: the roles move one place along, then the wheel decides a new time.
        function playAgain() {
            const roles = players.map(player => player.role);
            roles.unshift(roles.pop());
            players.forEach((player, index) => { player.role = roles[index]; });
            chime.dispose();
            renderTimer();
        }

        function open() {
            if (!isUnlocked()) return false;
            sceneId = SCENES[0].id;
            players = [];
            resetPlayers(MIN_PLAYERS);
            minutes = null;
            showScreen(gameScreen);
            renderRoles();
            return true;
        }

        function close() {
            cancelSpin();
            endPlay();
            chime.dispose();
            step = 'idle';
            minutes = null;
            root.replaceChildren();
            if (returnScreen && !gameScreen.classList.contains('hidden')) showScreen(returnScreen);
        }

        return Object.freeze({
            open, close,
            get step() { return step; },
            get sceneId() { return sceneId; },
            get minutes() { return minutes; },
            get roles() { return players.map(player => player.role); },
            get startedRoles() { return startedRoles ? [...startedRoles] : null; }
        });
    }

    global.ChakraRolePlayGame = Object.freeze({
        mount, createChime, roleList, rolesAreComplete, formatClock, landingAngle,
        SCENES, GROUP_SCENE, WHEEL_MINUTES, MIN_PLAYERS, MIN_GROUP_PLAYERS, MAX_PLAYERS
    });
})(typeof window === 'undefined' ? globalThis : window);
