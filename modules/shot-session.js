(function () {
    function create() {
        async function run(owner, type, customFrequency, deps) {
            const { state, alert, t, document, getLanguageConfig, fetch, normalizeSleepStages, shotChakraOrder, wakeLock, showScreen, meditationScreen, setText, journeyT, logError, window } = deps;
            if (!state.advancedFeaturesUnlocked) return;
            if (owner.isStarting || owner.isMeditationActive || owner.isShotActive) return;
            if (state.noFrequencyMode) {
                alert(t('ui.noFrequencyShotsUnavailable'));
                return;
            }
            if (type === 'custom' && (!Number.isFinite(customFrequency) || customFrequency <= 0 || customFrequency > 20000)) {
                alert(t('ui.shotInvalidFrequency'));
                return;
            }
            owner.isShotActive = true;
            const shotToggle = document.getElementById('shots-toggle');
            if (shotToggle) shotToggle.disabled = true;
            document.getElementById('shot-type-select')?.setAttribute('disabled', 'true');
            document.getElementById('shot-frequency-input')?.setAttribute('disabled', 'true');
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) { startBtn.disabled = true; startBtn.style.opacity = '0.5'; }

            try {
                if (!owner.scripts || owner.scriptsLanguage !== state.language) {
                    const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                    const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                    if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                    owner.scripts = await response.json();
                    owner.scriptsLanguage = state.language;
                }
                await owner.audio.init();
                owner.audio.stopBackgroundMusic();
                owner.audio.stopMantraTrack();
                owner.isMeditationActive = true;
                owner.sessionItemRunner?.reset();
                owner.sessionStartedAt = Date.now();
                showScreen(meditationScreen);
                document.getElementById('controls')?.classList.remove('hidden');
                setText('mantra-display', journeyT('ui.shotsMode'));
                // Shots intentionally have no narration, so they must not leave
                // a looping narration marquee on screen.
                owner.visual.startPulsing('#7c3aed');

                let stages;
                if (type === 'meditation') {
                    stages = shotChakraOrder.map(key => ({ key, frequency: Number(owner.scripts[key]?.frequency) }));
                } else if (type === 'sleep') {
                    stages = normalizeSleepStages(owner.scripts);
                } else {
                    const singleFrequencies = {
                        high_energy: Number(owner.scripts.high_energy?.frequency),
                        anesthetic: Number(owner.scripts.sound_shots?.anesthetic?.frequency),
                        mood_relaxation: Number(owner.scripts.sound_shots?.mood_relaxation?.frequency),
                        custom: customFrequency
                    };
                    stages = [{ key: type, frequency: singleFrequencies[type] }];
                }
                if (stages.some(stage => !Number.isFinite(stage.frequency) || stage.frequency <= 0 || stage.frequency > 20000)) {
                    throw new Error('The selected shot has no valid script frequency.');
                }
                const activeMs = (state.timeShot * 1000) / stages.length;
                const intervalMs = type === 'sleep' ? Number(owner.scripts.sleep_mode?.intervalSeconds || 2) * 1000 : 2000;
                owner.startSessionCountdown((state.timeShot * 1000) + Math.max(0, stages.length - 1) * intervalMs);
                for (const [index, stage] of stages.entries()) {
                    if (!owner.isMeditationActive) return;
                    const stageLabelPath = type === 'sleep'
                        ? `ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`
                        : `ui.${stage.key === 'thirdeye' ? 'thirdEye' : stage.key}`;
                    const stageLabel = stage.key === 'high_energy'
                        ? t('ui.highEnergyShot')
                        : stage.key === 'anesthetic'
                            ? t('ui.anestheticShot')
                            : stage.key === 'mood_relaxation'
                                ? t('ui.moodRelaxationShot')
                                : stage.key === 'custom'
                                    ? t('ui.customShot')
                                    : t(stageLabelPath);
                    setText('mantra-display', stageLabel === stageLabelPath ? stage.key : journeyT(stageLabelPath));
                    await owner.runSessionItem(`Shot ${stageLabel}`, async () => {
                        owner.audio.startFrequencyShot(stage.frequency);
                        let remaining = activeMs;
                        while (remaining > 0 && owner.isMeditationActive) {
                            const step = Math.min(100, remaining);
                            await owner.pauseAwareSleep(step);
                            if (!owner.isPaused) remaining -= step;
                        }
                        owner.audio.stopFrequencyShot();
                    });
                    if (index < stages.length - 1) await owner.runSessionItem('Shot interval', () => owner.pauseAwareSleep(intervalMs));
                }
                if (owner.isMeditationActive) finish(owner, deps);
            } catch (error) {
                logError('Shot activation failed:', error);
                alert(t('ui.noticeStartFailed') === 'ui.noticeStartFailed' ? `Shot activation failed: ${error.message}` : t('ui.noticeStartFailed'));
                stop(owner, deps);
            }
        }

        function finish(owner, deps) {
            const { document, wakeLock, showScreen, lobbyScreen, window } = deps;
            // A completed Shot always resets the page. Disable the controls first
            // so the success path cannot leave an active Shot affordance behind
            // while the browser begins the safety reset.
            const shotToggle = document.getElementById('shots-toggle');
            if (shotToggle) shotToggle.disabled = true;
            document.getElementById('shot-type-select')?.setAttribute('disabled', 'true');
            document.getElementById('shot-frequency-input')?.setAttribute('disabled', 'true');
            owner.audio.stopFrequencyShot();
            owner.isMeditationActive = false;
            owner.sessionItemRunner?.reset();
            owner.isShotActive = false;
            owner.sessionStartedAt = null;
            owner.visual.stop();
            owner.audio.stopBackgroundMusic();
            owner.audio.stopVisualizationAmbience(2);
            owner.audio.stopMantraTrack();
            owner.stopSessionCountdown();
            wakeLock.release();
            document.body.classList.remove('sleep-mode-active');
            document.getElementById('controls')?.classList.add('hidden');
            showScreen(lobbyScreen);
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) { startBtn.disabled = false; startBtn.style.opacity = '1'; }
            window.location.reload();
        }

        function stop(owner, deps) {
            if (!owner.isShotActive && !owner.isMeditationActive) return;
            const { document, wakeLock, showScreen, lobbyScreen } = deps;
            owner.audio.stopFrequencyShot();
            owner.isMeditationActive = false;
            owner.sessionItemRunner?.reset();
            owner.isShotActive = false;
            owner.sessionStartedAt = null;
            owner.visual.stop();
            owner.audio.stopBackgroundMusic();
            owner.audio.stopVisualizationAmbience(2);
            owner.audio.stopMantraTrack();
            owner.stopSessionCountdown();
            wakeLock.release();
            document.getElementById('controls')?.classList.add('hidden');
            showScreen(lobbyScreen);
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) { startBtn.disabled = false; startBtn.style.opacity = '1'; }
        }

        return Object.freeze({ run, finish, stop });
    }

    window.ChakraShotSession = Object.freeze({ create });
})();
