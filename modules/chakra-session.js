(function () {
    function create() {
        async function run(owner, chakra, key, deps) {
            const { state, document, visual, localized, timing, setTimeout, chakraMinutes } = deps;
            if (!owner.isMeditationActive) return;
            const symbolEl = document.getElementById('chakra-symbol');
            symbolEl.style.opacity = '';
            symbolEl.classList.remove('cosmic-entrance');
            void symbolEl.offsetWidth;
            symbolEl.classList.add('cosmic-entrance');
            setTimeout(() => symbolEl.classList.remove('cosmic-entrance'), 1200);

            if (key !== 'high_energy' && state.deityPath !== 'none' && owner.scripts.deities && owner.scripts.deities[state.deityPath] && owner.scripts.deities[state.deityPath][key]) {
                visual.setSymbolImage(owner.scripts.deities[state.deityPath][key], symbolEl);
            } else {
                visual.setSymbolImage(chakra.symbol, symbolEl);
            }

            symbolEl.style.opacity = '1';
            const mantraDisplay = document.getElementById('mantra-display');
            mantraDisplay.textContent = chakra.mantra;
            mantraDisplay.style.color = chakra.color;
            document.body.style.setProperty('--primary-color', chakra.color);
            document.querySelectorAll('.dot').forEach(dot => {
                if (dot.dataset.chakra === key) dot.classList.add('active');
                else if (owner.chakraOrder.includes(dot.dataset.chakra) && owner.chakraOrder.indexOf(dot.dataset.chakra) < owner.chakraOrder.indexOf(key)) {
                    dot.classList.add('completed');
                    dot.classList.remove('active');
                } else dot.classList.remove('active', 'completed');
            });
            const aura = document.getElementById('aura-bg');
            aura.style.background = state.eyesCloseMode ? 'transparent' : `radial-gradient(circle at center, ${chakra.color}22, transparent)`;
            aura.style.opacity = state.eyesCloseMode ? '0' : '1';

            const absoluteIndex = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].indexOf(key);
            const practiceMinutes = owner.isExperimentActive && owner.experimentDuration != null && (key === 'high_energy' || owner.chakraOrder.length === 1)
                ? owner.experimentDuration
                : key === 'high_energy' ? state.timeHighEnergy
                    : (typeof chakraMinutes === 'function' ? chakraMinutes(key) : state.timePerChakra);
            const durationMode = key === 'high_energy' ? state.hrimDroneDurationMode : state.droneDurationMode;

            if (!state.eyesCloseMode) visual.startPulsing(chakra.color);
            await owner.narrate(
                localized(chakra, 'meditation') || localized(chakra),
                false,
                false,
                'normal',
                'mantra'
            );
            if (!owner.isMeditationActive) return;

            // The matching drone remains gated on successful mantra startup.
            await owner.audio.playMantraTrack(key);
            if (!owner.isMeditationActive) return;
            if (!state.noMantraMode && owner.audio.mantraLoop) {
                owner.startTimedDrone(chakra.frequency, absoluteIndex, practiceMinutes, durationMode);
            }

            const transitionSeconds = Math.max(0, timing('transitions', 'chakraPostMantra'));
            // The mantra leaves over a longer window (a slow fade plus its reverb
            // tail) that starts before the chant time ends, so it never drops
            // suddenly and the chakra still takes the same total time.
            const exitSeconds = Math.max(transitionSeconds, Number(timing('transitions', 'chakraMantraExit', transitionSeconds)) || 0);
            const chantDurationMs = Math.max(0, (practiceMinutes * 60 * 1000) - (timing('transitions', 'chakraLeadOut') * 1000)
                - ((exitSeconds - transitionSeconds) * 1000));
            let elapsed = 0;
            while (elapsed < chantDurationMs) {
                if (!owner.isMeditationActive) break;
                await owner.pauseAwareSleep(0);
                if (!owner.isPaused) elapsed += 100;
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            owner.audio.stopMantraTrack({ stageWindow: exitSeconds });
            await owner.pauseAwareSleep(exitSeconds * 1000);
            if (owner.isMeditationActive) await owner.narrate(localized(chakra, 'affirmation'));
        }

        return Object.freeze({ run });
    }

    window.ChakraSession = Object.freeze({ create });
})();
