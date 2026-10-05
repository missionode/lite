(function installChakraTimingView(global) {
    'use strict';

    // Lobby panel under Core Practice Duration: a switch, one row per chakra
    // (− / time / +), Reset all to core, and Fill times from assessment
    // (shows a suggestion first; one tap applies it).
    const LABEL_KEYS = Object.freeze({ root: 'ui.root', sacral: 'ui.sacral', solar: 'ui.solar', heart: 'ui.heart', throat: 'ui.throat', thirdeye: 'ui.thirdEye', crown: 'ui.crown' });
    const ASSESSMENT_STATE_KEY = 'chakraAssessmentTournamentV1';

    function create({ document, state, storage, timing, translate, range, onChange = () => {}, loadAssessment }) {
        if (!document || !state || !timing) throw new TypeError('Chakra timing view requires document, state and ChakraTiming');
        const panel = document.getElementById('per-chakra-time-control');
        const toggle = document.getElementById('per-chakra-time-toggle');
        const rows = document.getElementById('per-chakra-time-rows');
        const actions = document.getElementById('per-chakra-time-actions');
        const status = document.getElementById('per-chakra-time-status');
        const applyButton = document.getElementById('per-chakra-time-apply');
        let pending = null;
        const t = key => (typeof translate === 'function' ? translate(key) : key);
        const minutesText = value => `${Number(value).toFixed(1)} ${t('ui.minutes')}`;

        function setStatus(text, showApply = false) {
            if (status) status.textContent = text || '';
            if (applyButton) applyButton.hidden = !showApply;
        }

        function commit() {
            timing.save(storage, state);
            render();
            onChange();
        }

        function render() {
            if (!panel) return;
            if (toggle) toggle.checked = Boolean(state.perChakraTimeEnabled);
            const enabled = Boolean(state.perChakraTimeEnabled);
            if (rows) rows.hidden = !enabled;
            if (actions) actions.hidden = !enabled;
            if (!enabled) setStatus('');
            if (!rows) return;
            const selected = new Set(state.selectedChakras || []);
            rows.innerHTML = '';
            // Only the chakras chosen in Chakra Journey get a row (Root → Crown order).
            const shown = timing.CHAKRA_IDS.filter(id => selected.has(id));
            if (!shown.length) {
                const empty = document.createElement('p');
                empty.className = 'mixer-note per-chakra-time-empty';
                empty.textContent = t('ui.perChakraTimeNoneSelected');
                rows.append(empty);
            }
            for (const id of shown) {
                const own = state.perChakraTimes?.[id];
                const minutes = timing.minutesFor(state, id);
                const row = document.createElement('div');
                row.className = 'per-chakra-time-row';
                row.dataset.chakra = id;
                const name = document.createElement('span');
                name.className = 'per-chakra-time-name';
                name.textContent = t(LABEL_KEYS[id]);
                const minus = document.createElement('button');
                minus.type = 'button';
                minus.className = 'per-chakra-time-step';
                minus.textContent = '−';
                minus.setAttribute('aria-label', `${t(LABEL_KEYS[id])} −`);
                minus.disabled = minutes <= range.min;
                const value = document.createElement('span');
                value.className = 'per-chakra-time-value';
                value.textContent = own === null || own === undefined ? `${minutesText(minutes)} · ${t('ui.perChakraTimeCore')}` : minutesText(minutes);
                const plus = document.createElement('button');
                plus.type = 'button';
                plus.className = 'per-chakra-time-step';
                plus.textContent = '+';
                plus.setAttribute('aria-label', `${t(LABEL_KEYS[id])} +`);
                plus.disabled = minutes >= range.max;
                const change = delta => {
                    state.perChakraTimes = { ...state.perChakraTimes, [id]: timing.clampMinutes(minutes + delta, range) };
                    pending = null;
                    setStatus('');
                    commit();
                };
                minus.addEventListener('click', () => change(-range.step));
                plus.addEventListener('click', () => change(range.step));
                row.append(name, minus, value, plus);
                rows.append(row);
            }
        }

        async function suggest() {
            pending = null;
            setStatus(t('ui.perChakraTimeChecking'));
            let outcome = { status: 'not-enough', times: {}, focus: [] };
            try {
                const loaded = await loadAssessment();
                if (loaded) outcome = timing.suggestFromAssessment(loaded.result, state.timePerChakra, loaded.minimumEvidence, range);
            } catch (error) { outcome = { status: 'not-enough', times: {}, focus: [] }; }
            if (outcome.status === 'ready') {
                pending = outcome.times;
                const names = outcome.focus.map(id => `${t(LABEL_KEYS[id])} ${minutesText(outcome.times[id])}`).join(', ');
                setStatus(t('ui.perChakraTimeSuggestion').replace('{list}', names), true);
            } else {
                setStatus(t(outcome.status === 'no-clear-focus' ? 'ui.perChakraTimeNoFocus' : 'ui.perChakraTimeNoAssessment'));
            }
        }

        function bind() {
            toggle?.addEventListener('change', () => {
                state.perChakraTimeEnabled = toggle.checked;
                pending = null;
                commit();
            });
            document.getElementById('per-chakra-time-reset')?.addEventListener('click', () => {
                state.perChakraTimes = timing.normalizeTimes({});
                pending = null;
                setStatus(t('ui.perChakraTimeResetDone'));
                commit();
            });
            document.getElementById('per-chakra-time-assessment')?.addEventListener('click', () => { void suggest(); });
            applyButton?.addEventListener('click', () => {
                if (!pending) return;
                state.perChakraTimes = timing.normalizeTimes(pending);
                pending = null;
                setStatus(t('ui.perChakraTimeApplied'));
                commit();
            });
            render();
        }

        return Object.freeze({ bind, render, suggest });
    }

    // Reads the saved assessment on this device and builds its result.
    function assessmentLoader({ storage, fetch, loadScript, engineUrl, bankUrl }) {
        return async function loadAssessment() {
            let raw = null;
            try { raw = storage?.getItem?.(ASSESSMENT_STATE_KEY); } catch (error) { raw = null; }
            if (!raw) return null;
            if (!global.ChakraAssessmentTournament) await loadScript(engineUrl);
            const engine = global.ChakraAssessmentTournament;
            if (!engine) return null;
            const bank = await (await fetch(bankUrl)).json();
            const result = engine.buildResult(bank, JSON.parse(raw));
            return { result, minimumEvidence: Number(bank?.settings?.minimumEvidencePerChakra) || 1 };
        };
    }

    global.ChakraTimingView = Object.freeze({ create, assessmentLoader, ASSESSMENT_STATE_KEY });
})(typeof window === 'undefined' ? globalThis : window);
