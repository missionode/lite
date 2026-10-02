(function () {
    // Sleep wind-down: in the last minutes of the final stage the screen
    // slowly fades to near-black and the music drifts to silence. At the end
    // the session stops by itself with no bright completion screen, and the
    // wake lock is released so the phone can sleep too. A tap brings the
    // controls back for a few seconds.
    const WIND_DOWN_SECONDS = 180;
    const PEEK_SECONDS = 6;

    function startWindDown(owner, deps, seconds) {
        const { document, setText, journeyT, setTimeout: later = globalThis.setTimeout, clearTimeout: cancel = globalThis.clearTimeout } = deps;
        const body = document.body;
        body.style.setProperty('--sleep-wind-down-seconds', `${seconds}s`);
        body.classList.add('sleep-wind-down');
        setText('mantra-display', journeyT('ui.sleepWindDown'));
        owner.audio.fadeOutBackgroundMusic(seconds);
        owner.audio.stopPleasureAmbience?.(seconds);
        let peekTimer = null;
        const peek = () => {
            body.classList.add('sleep-peek');
            if (peekTimer) cancel(peekTimer);
            peekTimer = later(() => body.classList.remove('sleep-peek'), PEEK_SECONDS * 1000);
        };
        const darkTimer = later(() => body.classList.add('sleep-dark'), seconds * 1000);
        document.addEventListener('pointerdown', peek);
        owner.sleepWindDownCleanup = () => {
            document.removeEventListener('pointerdown', peek);
            if (peekTimer) cancel(peekTimer);
            cancel(darkTimer);
            body.classList.remove('sleep-wind-down', 'sleep-peek', 'sleep-dark');
            body.style.removeProperty('--sleep-wind-down-seconds');
            owner.sleepWindDownCleanup = null;
        };
    }

    function create() {
        async function run(owner, deps) {
            const { state, getLanguageConfig, fetch, normalizeSleepStages, document, showScreen, meditationScreen, setText, journeyT } = deps;
            if (!state.advancedFeaturesUnlocked) return;
            if (owner.isStarting || owner.isMeditationActive) return;
            owner.showDndReminderIfNeeded();
            if (!owner.scripts || owner.scriptsLanguage !== state.language) {
                if (state.scriptSource === 'custom' && state.customScript) {
                    owner.scripts = state.customScript;
                } else {
                    const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                    const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                    if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                    owner.scripts = await response.json();
                }
                owner.scriptsLanguage = state.language;
            }
            const sleepStages = normalizeSleepStages(owner.scripts);
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.style.opacity = '0.5';
            }
            owner.isMeditationActive = true;
            owner.sessionItemRunner?.reset();
            owner.isPaused = false;
            owner.isHighEnergy = false;
            owner.isHypnosisJourney = false;
            owner.sessionStartedAt = Date.now();
            showScreen(meditationScreen);
            owner.startSessionCountdown(owner.getSessionDurationMs());

            const controls = document.getElementById('controls');
            if (controls) controls.classList.remove('hidden');
            setText('pause-meditation', 'II');
            setText('mantra-display', journeyT('ui.sleepMode'));
            // Sleep mode has no spoken narration; keep the narration-only ticker
            // hidden while the visual guidance, music, and sleep tones run.
            owner.visual.startPulsing('#355c7d');
            await owner.audio.startBackgroundMusic();
            void owner.audio.startPleasureAmbience();
            owner.audio.fadeInBackgroundMusic(10, 0.32);

            const stageDurationMs = state.timeSleepStage * 60 * 1000;
            const windDownMs = Math.min(WIND_DOWN_SECONDS * 1000, stageDurationMs);
            let windingDown = false;
            for (const [index, stage] of sleepStages.entries()) {
                const isLastStage = index === sleepStages.length - 1;
                if (!owner.isMeditationActive) return;
                setText('mantra-display', journeyT(`ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`));
                await owner.runSessionItem(`Sleep stage ${stage.key}`, async () => {
                    owner.startTimedSleepDrone(stage.frequency, state.timeSleepStage, state.sleepDroneDurationMode);
                    let remaining = stageDurationMs;
                    while (remaining > 0 && owner.isMeditationActive) {
                        if (isLastStage && !windingDown && remaining <= windDownMs) {
                            windingDown = true;
                            startWindDown(owner, deps, Math.max(1, Math.round(remaining / 1000)));
                        }
                        const step = Math.min(1000, remaining);
                        await owner.pauseAwareSleep(step);
                        if (!owner.isPaused) remaining -= step;
                    }
                    owner.stopStageDrone();
                });
                if (index < sleepStages.length - 1) await owner.runSessionItem('Sleep interval', () => owner.pauseAwareSleep(3000));
            }

            if (owner.isMeditationActive) {
                if (!windingDown) owner.audio.fadeOutBackgroundMusic(12);
                await owner.runSessionItem('Sleep ending fade', () => owner.pauseAwareSleep(windingDown ? 4000 : 12000));
                // Quiet finish: no bright completion screen at night.
                if (owner.isMeditationActive) owner.finish({ quiet: true });
            }
        }

        return Object.freeze({ run, startWindDown, WIND_DOWN_SECONDS });
    }

    window.ChakraSleepJourney = Object.freeze({ create });
})();
