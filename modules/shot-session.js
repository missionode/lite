(function () {
    const PREP_SECONDS = 5;

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
            const mixedToggle = document.getElementById('mixed-shots-toggle');
            if (mixedToggle) mixedToggle.disabled = true;
            document.querySelectorAll?.('.mixed-shot-checkbox')?.forEach(cb => { cb.disabled = true; });
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
                owner.visual.startPulsing('#e8c27e');

                let stages;
                const isMixed = type === 'mixed' && Array.isArray(customFrequency) && customFrequency.length > 0;
                if (isMixed) {
                    const freqs = customFrequency.map(f => Number(f)).filter(f => Number.isFinite(f) && f > 0 && f <= 20000);
                    if (freqs.length === 0) throw new Error('Mixed Shot requires at least one valid frequency.');
                    stages = [{ key: 'mixed', frequencies: freqs }];
                } else if (type === 'meditation') {
                    stages = shotChakraOrder.map(key => ({ key, frequency: Number(owner.scripts[key]?.frequency) }));
                } else if (type === 'sleep') {
                    stages = normalizeSleepStages(owner.scripts);
                } else if (type === 'golden_ratio') {
                    // 432 Hz, then each tone 1.618 times the one before (the golden ratio).
                    stages = (owner.scripts.sound_shots?.golden_ratio?.frequencies || []).map(frequency => ({ key: 'golden_ratio', frequency: Number(frequency) }));
                } else {
                    const singleFrequencies = {
                        high_energy: Number(owner.scripts.high_energy?.frequency),
                        anesthetic: Number(owner.scripts.sound_shots?.anesthetic?.frequency),
                        deep_focus: Number(owner.scripts.sound_shots?.deep_focus?.frequency),
                        mental_clarity: Number(owner.scripts.sound_shots?.mental_clarity?.frequency),
                        joy_ease: Number(owner.scripts.sound_shots?.joy_ease?.frequency),
                        warm_heart: Number(owner.scripts.sound_shots?.warm_heart?.frequency),
                        sensory_awareness: Number(owner.scripts.sound_shots?.sensory_awareness?.frequency),
                        fresh_perception: Number(owner.scripts.sound_shots?.fresh_perception?.frequency),
                        humming_anchor: Number(owner.scripts.sound_shots?.humming_anchor?.frequency),
                        body_renewal: Number(owner.scripts.sound_shots?.body_renewal?.frequency),
                        earth_grounding: Number(owner.scripts.sound_shots?.earth_grounding?.frequency),
                        mood_relaxation: Number(owner.scripts.sound_shots?.mood_relaxation?.frequency),
                        custom: customFrequency
                    };
                    stages = [{ key: type, frequency: singleFrequencies[type] }];
                }
                if (stages.length === 0 || stages.some(stage => stage.key === 'mixed' ? false : (!Number.isFinite(stage.frequency) || stage.frequency <= 0 || stage.frequency > 20000))) {
                    throw new Error('The selected shot has no valid script frequency.');
                }
                // Get-ready countdown before the first tone, so the person can prepare
                // (hold the phone, settle). Pause-aware; Stop ends it with no tone.
                for (let left = PREP_SECONDS; left > 0; left -= 1) {
                    if (!owner.isMeditationActive) return;
                    setText('mantra-display', journeyT('ui.shotGetReady').replace('{{seconds}}', String(left)));
                    await owner.pauseAwareSleep(1000);
                }
                if (!owner.isMeditationActive) return;
                setText('mantra-display', journeyT('ui.shotsMode'));
                const activeMs = (state.timeShot * 1000) / stages.length;
                const intervalMs = type === 'sleep' ? Number(owner.scripts.sleep_mode?.intervalSeconds || 2) * 1000 : 2000;
                owner.startSessionCountdown((state.timeShot * 1000) + Math.max(0, stages.length - 1) * intervalMs);
                for (const [index, stage] of stages.entries()) {
                    if (!owner.isMeditationActive) return;
                    const stageLabelPath = type === 'sleep'
                        ? `ui.sleepStage${stage.key[0].toUpperCase()}${stage.key.slice(1)}`
                        : `ui.${stage.key === 'thirdeye' ? 'thirdEye' : stage.key}`;
                    const stageLabel = stage.key === 'mixed'
                        ? t('ui.mixedShot')
                        : stage.key === 'high_energy'
                        ? t('ui.highEnergyShot')
                        : stage.key === 'anesthetic'
                            ? t('ui.anestheticShot')
                            : stage.key === 'deep_focus'
                                ? t('ui.deepFocusShot')
                                : stage.key === 'mental_clarity'
                                    ? t('ui.mentalClarityShot')
                                    : stage.key === 'joy_ease'
                                        ? t('ui.joyEaseShot')
                                        : stage.key === 'warm_heart'
                                            ? t('ui.warmHeartShot')
                                            : stage.key === 'sensory_awareness'
                                                ? t('ui.sensoryAwarenessShot')
                                                : stage.key === 'fresh_perception'
                                                    ? t('ui.freshPerceptionShot')
                                                    : stage.key === 'humming_anchor'
                                                        ? t('ui.hummingAnchorShot')
                                                        : stage.key === 'body_renewal'
                                                            ? t('ui.bodyRenewalShot')
                                                            : stage.key === 'earth_grounding'
                                                                ? t('ui.earthGroundingShot')
                                                                : stage.key === 'mood_relaxation'
                                                                    ? t('ui.moodRelaxationShot')
                                                                    : stage.key === 'golden_ratio'
                                                                        ? `${t('ui.goldenRatioShot')} · ${Math.round(stage.frequency)} Hz`
                                                                        : stage.key === 'custom'
                                                                            ? t('ui.customShot')
                                                                            : t(stageLabelPath);
                    setText('mantra-display', stageLabel === stageLabelPath ? stage.key : (stage.key === 'mixed' ? t('ui.mixedShot') : journeyT(stageLabelPath)));
                    await owner.runSessionItem(`Shot ${stageLabel}`, async () => {
                        if (stage.key === 'mixed') {
                            owner.audio.startMixedFrequencyShot ? owner.audio.startMixedFrequencyShot(stage.frequencies) : owner.audio.startFrequencyShot(stage.frequencies[0]);
                        } else {
                            owner.audio.startFrequencyShot(stage.frequency);
                        }
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
            const mixedToggle = document.getElementById('mixed-shots-toggle');
            if (mixedToggle) mixedToggle.disabled = true;
            document.querySelectorAll?.('.mixed-shot-checkbox')?.forEach(cb => { cb.disabled = true; });
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
