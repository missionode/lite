(function () {
    function create() {
        function stop(owner, { preserveScreen = false } = {}, deps) {
            const { document, window, piperTTS, wakeLock, lobbyScreen, experimentScreen, showScreen } = deps;
            document.body.classList.remove('visualization-active');
            document.body.classList.remove('body-scan-active');
            document.body.classList.remove('noting-active');
            document.body.classList.remove('undo-unlearn-active');
            const returnScreen = owner.isExperimentActive ? experimentScreen : lobbyScreen;
            owner.sessionItemRunner?.reset();
            owner.isMeditationActive = false;
            owner.isShotActive = false;
            owner.isHypnosisJourney = false;
            owner.stopIntentionFrequency();
            owner.stopStageDrone();
            owner.audio.stopGuidedTransitionTone();
            owner.audio.stopMantraTrack({ restoreMusic: false });
            owner.audio.stopBackgroundMusic();
            owner.audio.stopVisualizationAmbience(2);
            owner.audio.stopPleasureAmbience(8);
            owner.visual.stop();
            wakeLock.release();
            owner.stopSessionCountdown();
            owner.isExperimentActive = false;
            if (owner.guideControlledResolve) owner.guideControlledResolve(false);
            const guideRestButton = document.getElementById('guide-controlled-continue');
            if (guideRestButton) {
                guideRestButton.hidden = true;
                guideRestButton.disabled = true;
            }
            owner.sessionStartedAt = null;
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
            }
            window.speechSynthesis.cancel();
            piperTTS.cancel('journey stopped', { fadeSeconds: 2 });
            document.body.classList.remove('sleep-mode-active');
            owner.sleepWindDownCleanup?.();
            const app = document.getElementById('app');
            if (app) app.style.setProperty('--app-brightness', '1');
            const finishAura = document.getElementById('aura-bg');
            if (finishAura) finishAura.style.opacity = '0';
            document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
            const controls = document.getElementById('controls');
            if (controls) controls.classList.add('hidden');
            const mixer = document.getElementById('volume-mixer');
            if (mixer) mixer.classList.add('hidden');
            const aura = document.getElementById('aura-bg');
            if (aura) {
                aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(232,194,126,0.12) 0%, transparent 55%)';
                aura.style.opacity = '1';
            }
            if (!preserveScreen) showScreen(returnScreen);
        }

        return Object.freeze({ stop });
    }

    window.ChakraSessionStop = Object.freeze({ create });
})();
