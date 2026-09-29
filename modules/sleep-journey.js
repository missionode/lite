(function () {
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
            for (const [index, stage] of sleepStages.entries()) {
                if (!owner.isMeditationActive) return;
                setText('mantra-display', journeyT(`ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`));
                await owner.runSessionItem(`Sleep stage ${stage.key}`, async () => {
                    owner.startTimedSleepDrone(stage.frequency, state.timeSleepStage, state.sleepDroneDurationMode);
                    let remaining = stageDurationMs;
                    while (remaining > 0 && owner.isMeditationActive) {
                        const step = Math.min(1000, remaining);
                        await owner.pauseAwareSleep(step);
                        if (!owner.isPaused) remaining -= step;
                    }
                    owner.stopStageDrone();
                });
                if (index < sleepStages.length - 1) await owner.runSessionItem('Sleep interval', () => owner.pauseAwareSleep(3000));
            }

            if (owner.isMeditationActive) {
                owner.audio.fadeOutBackgroundMusic(12);
                await owner.runSessionItem('Sleep ending fade', () => owner.pauseAwareSleep(12000));
                if (owner.isMeditationActive) owner.finish();
            }
        }

        return Object.freeze({ run });
    }

    window.ChakraSleepJourney = Object.freeze({ create });
})();
