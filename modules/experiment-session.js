(function () {
    function create() {
        async function start(owner, activity, deps) {
            const { state, document, fetch, getLanguageConfig, wakeLock, setText, showScreen, meditationScreen, backgroundMusicEntryFadeSeconds, logError, alert } = deps;
            if (['perineal', 'bath', 'assisted-bath'].includes(activity) && !state.advancedFeaturesUnlocked) return;
            if (owner.isStarting || owner.isMeditationActive) return;
            owner.isStarting = true;
            try {
                const durationInput = document.getElementById('experiment-core-duration');
                owner.experimentDuration = durationInput ? Number(durationInput.value) : null;
                if (!owner.scripts || owner.scriptsLanguage !== state.language) {
                    if (state.scriptSource === 'custom' && state.customScript) owner.scripts = state.customScript;
                    else {
                        const contentSource = getLanguageConfig().contentSource || 'scripts.json';
                        const response = await fetch(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                        if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                        owner.scripts = await response.json();
                    }
                    owner.scriptsLanguage = state.language;
                }
                await owner.audio.init();
                await owner.audio.startBackgroundMusic();
                if (!state.bgMusicMode) void owner.audio.startPleasureAmbience();
                owner.isMeditationActive = true;
                owner.sessionItemRunner?.reset();
                owner.isExperimentActive = true;
                owner.isPaused = false;
                owner.sessionStartedAt = Date.now();
                const durationUnit = durationInput?.dataset.unit || 'min';
                const experimentDurationMs = durationUnit === 'seconds'
                    ? Number(owner.experimentDuration) * 1000
                    : Number(owner.experimentDuration) * 60 * 1000;
                owner.startSessionCountdown(experimentDurationMs);
                try { await wakeLock.request(); } catch (error) {}
                document.getElementById('controls')?.classList.remove('hidden');
                setText('pause-meditation', 'II');
                owner.audio.fadeInBackgroundMusic(backgroundMusicEntryFadeSeconds);

                if (activity.startsWith('chakra:')) {
                    const key = activity.slice('chakra:'.length);
                    owner.chakraOrder = [key];
                    showScreen(meditationScreen);
                    await owner.meditateOnChakra(owner.scripts[key], key);
                } else if (activity === 'hrim') {
                    owner.chakraOrder = ['high_energy'];
                    showScreen(meditationScreen);
                    await owner.meditateOnChakra(owner.scripts.high_energy, 'high_energy');
                } else if (activity === 'box') await owner.runSessionItem('Box Breathing', () => owner.runBoxBreathing());
                else if (activity === 'hooponopono') { showScreen(meditationScreen); await owner.runSessionItem('Ho’oponopono', () => owner.runHooponopono()); }
                else if (activity === 'corpse') await owner.runSessionItem('Corpse Pose', () => owner.runCorpsePose());
                else if (activity === 'perineal') await owner.runSessionItem('Perineal Care', () => owner.runPerinealCare());
                else if (activity === 'bath') await owner.runSessionItem('Bath session', () => owner.runBathSession());
                else if (activity === 'assisted-bath') await owner.runSessionItem('Assisted bathing', () => owner.runAssistedBathing());

                if (owner.isMeditationActive) stop(owner, deps);
            } catch (error) {
                logError('Experiment activity failed:', error);
                alert(deps.failureMessage?.() || `Experiment activity failed: ${error.message}`);
                stop(owner, deps);
            } finally { owner.isStarting = false; }
        }

        function stop(owner, deps) {
            const { window, piperTTS, wakeLock, document, showScreen, experimentScreen } = deps;
            owner.isMeditationActive = false;
            owner.sessionItemRunner?.reset();
            owner.isExperimentActive = false;
            owner.experimentDuration = null;
            window.speechSynthesis.cancel();
            piperTTS.cancel('experiment stopped', { fadeSeconds: 2 });
            owner.stopIntentionFrequency();
            owner.stopStageDrone();
            owner.audio.stopMantraTrack();
            owner.audio.stopBackgroundMusic();
            owner.audio.stopPleasureAmbience();
            owner.visual.stop();
            owner.stopSessionCountdown();
            wakeLock.release();
            document.getElementById('controls')?.classList.add('hidden');
            showScreen(experimentScreen);
        }

        return Object.freeze({ start, stop });
    }

    window.ChakraExperimentSession = Object.freeze({ create });
})();
