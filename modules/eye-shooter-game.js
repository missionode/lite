(function installEyeShooterGame(global) {
    'use strict';

    // Contactless Eye Shooter: a dev-mode (Advanced Features) no-touch gaze
    // practice game for two people, for players who avoid looking at
    // someone. The app only explains the game: there is no eye tracking,
    // no camera and nothing is saved. A shot = look at a spot on the
    // partner, hold focus for 3 seconds, blink once, add its points.

    // Easy spots give fewer points; harder spots give more. For a player who
    // avoids looking, holding eye contact is among the hardest.
    const SPOT_TIERS = Object.freeze([
        Object.freeze({ points: 1, spots: Object.freeze(['ears', 'back', 'hair']) }),
        Object.freeze({ points: 2, spots: Object.freeze(['nose', 'chin', 'shoulders']) }),
        Object.freeze({ points: 3, spots: Object.freeze(['lips', 'navel', 'armpits']) }),
        Object.freeze({ points: 4, spots: Object.freeze(['breasts']) }),
        Object.freeze({ points: 5, spots: Object.freeze(['eyes', 'pubicMound']) })
    ]);

    // How much to play: a points goal.
    const GOALS = Object.freeze([
        Object.freeze({ id: 'short', points: 15 }),
        Object.freeze({ id: 'medium', points: 30 }),
        Object.freeze({ id: 'long', points: 50 })
    ]);
    const DEFAULT_GOAL = 'medium';
    const HOLD_SECONDS = 3;

    function pointsFor(spot) {
        const tier = SPOT_TIERS.find(entry => entry.spots.includes(spot));
        return tier ? tier.points : 0;
    }

    function mount({ document = global.document, root, t, showScreen, gameScreen, returnScreen, isUnlocked } = {}) {
        if (!document || !root || typeof t !== 'function' || typeof showScreen !== 'function' ||
            !gameScreen || typeof isUnlocked !== 'function') {
            throw new TypeError('Contactless Eye Shooter needs its screen, translator and dev-mode check');
        }
        const fill = (template, values) => Object.entries(values).reduce((text, [key, value]) => text.split(`{{${key}}}`).join(value), template);
        const el = (tag, options = {}, children = []) => {
            const node = document.createElement(tag);
            if (options.className) node.className = options.className;
            if (options.text !== undefined) node.textContent = options.text;
            if (options.type) node.type = options.type;
            if (options.dataset) Object.assign(node.dataset, options.dataset);
            if (options.attrs) Object.entries(options.attrs).forEach(([key, value]) => node.setAttribute(key, value));
            if (options.onClick) node.addEventListener('click', options.onClick);
            children.forEach(child => child && node.append(child));
            return node;
        };
        let goal = DEFAULT_GOAL;

        function goalPicker() {
            const note = el('p', { className: 'es-goal-note', dataset: { es: 'goal-note' }, attrs: { 'aria-live': 'polite' } });
            const buttons = GOALS.map(option => el('button', {
                type: 'button', className: 'es-goal', dataset: { es: 'goal', goal: option.id },
                attrs: { 'aria-pressed': String(option.id === goal) },
                onClick: () => { goal = option.id; sync(); }
            }, [
                el('strong', { text: t(`ui.esGoal_${option.id}`) }),
                el('span', { text: `${option.points} ${t('ui.esPointsLabel')}` })
            ]));
            function sync() {
                buttons.forEach(button => {
                    const on = button.dataset.goal === goal;
                    button.classList.toggle('is-selected', on);
                    button.setAttribute('aria-pressed', String(on));
                });
                note.textContent = fill(t('ui.esGoalNote'), { points: String(GOALS.find(option => option.id === goal).points) });
            }
            sync();
            return el('section', { className: 'es-section' }, [
                el('h3', { text: t('ui.esGoalTitle') }),
                el('div', { className: 'es-goals' }, buttons),
                note
            ]);
        }

        function pointsTable() {
            return el('section', { className: 'es-section' }, [
                el('h3', { text: t('ui.esPointsTitle') }),
                el('ol', { className: 'es-tiers', dataset: { es: 'points' } }, SPOT_TIERS.map(tier => el('li', {
                    className: `es-tier es-tier-${tier.points}`, dataset: { es: 'tier', points: String(tier.points) }
                }, [
                    el('span', { className: 'es-tier-points' }, [
                        el('strong', { text: String(tier.points) }),
                        el('small', { text: t('ui.esPointsLabel') })
                    ]),
                    el('span', { className: 'es-tier-spots' }, tier.spots.map(spot => el('span', {
                        className: 'es-spot', text: t(`ui.esSpot_${spot}`), dataset: { es: 'spot', spot }
                    })))
                ])))
            ]);
        }

        function render() {
            const steps = ['esStep1', 'esStep2', 'esStep3', 'esStep4'];
            const panel = el('div', { className: 'es-panel' }, [
                el('div', { className: 'es-target', attrs: { 'aria-hidden': 'true' } }, [el('span'), el('span'), el('span')]),
                el('h2', { className: 'es-title', text: t('ui.esTitle') }),
                el('p', { className: 'es-lead', text: t('ui.esWhat') }),
                el('section', { className: 'es-section' }, [
                    el('h3', { text: t('ui.esHowTitle') }),
                    el('ol', { className: 'es-steps' }, steps.map((key, index) => el('li', {}, [
                        el('span', { className: 'es-step-num', text: String(index + 1) }),
                        el('span', { text: fill(t(`ui.${key}`), { seconds: String(HOLD_SECONDS) }) })
                    ])))
                ]),
                pointsTable(),
                goalPicker(),
                el('p', { className: 'es-tip', text: t('ui.esTips') }),
                el('p', { className: 'es-partner', text: t('ui.esPartner') }),
                el('button', { type: 'button', className: 'primary-btn es-done', text: t('ui.esDone'), dataset: { es: 'done' }, onClick: close }),
                el('button', { type: 'button', className: 'link-btn', text: t('ui.sbpBack'), dataset: { es: 'back' }, onClick: close })
            ]);
            root.replaceChildren(panel);
            const heading = panel.querySelector('h2');
            heading.setAttribute('tabindex', '-1');
            heading.focus?.({ preventScroll: true });
        }

        function open() {
            if (!isUnlocked()) return false;
            goal = DEFAULT_GOAL;
            showScreen(gameScreen);
            render();
            root.closest?.('.screen')?.scrollTo?.(0, 0);
            return true;
        }

        function close() {
            root.replaceChildren();
            if (returnScreen && !gameScreen.classList.contains('hidden')) showScreen(returnScreen);
        }

        return Object.freeze({ open, close, get goal() { return goal; } });
    }

    global.ChakraEyeShooterGame = Object.freeze({ mount, pointsFor, SPOT_TIERS, GOALS, DEFAULT_GOAL, HOLD_SECONDS });
})(typeof window === 'undefined' ? globalThis : window);
