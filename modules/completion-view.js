(function installCompletionView(global) {
    'use strict';

    function createEarnHandoff({ document = global.document, window = global, getLanguage, isDeveloperMode = () => false, delayMs = 3000 } = {}) {
        if (!document || !window || typeof getLanguage !== 'function' || typeof isDeveloperMode !== 'function' || !Number.isFinite(delayMs) || delayMs < 0) {
            throw new TypeError('Earn handoff requires document, window, language and delay services');
        }
        let timer = null;
        function cancel() {
            if (timer !== null) {
                window.clearTimeout(timer);
                timer = null;
            }
            const link = document.getElementById('continue-to-earn');
            if (link) {
                link.hidden = true;
                link.classList.add('hidden');
            }
        }
        // Earn is a developer-mode (Advanced Features) handoff; Hindi stays excluded.
        function canUse() { return isDeveloperMode() === true && getLanguage() !== 'hi'; }
        function schedule() {
            cancel();
            if (!canUse()) return;
            timer = window.setTimeout(() => {
                timer = null;
                if (!canUse()) return;
                const link = document.getElementById('continue-to-earn');
                if (!link) return;
                link.hidden = false;
                link.classList.remove('hidden');
                link.focus({ preventScroll: true });
            }, delayMs);
        }
        return Object.freeze({ cancel, canUse, schedule });
    }

    function bind({ document = global.document, cancelEarnHandoff, showScreen, lobbyScreen } = {}) {
        if (!document || typeof cancelEarnHandoff !== 'function' || typeof showScreen !== 'function' || !lobbyScreen) {
            throw new TypeError('Completion view requires its handoff and navigation services');
        }
        document.getElementById('close-completion').addEventListener('click', () => {
            cancelEarnHandoff();
            document.getElementById('completion-modal').classList.add('hidden');
            const aura = document.getElementById('aura-bg');
            if (aura) {
                aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(232,194,126,0.12) 0%, transparent 55%)';
                aura.style.opacity = '1';
            }
            showScreen(lobbyScreen);
        });
        // Sleep goodnight screen: stays dark; the first tap only wakes the
        // text, the button returns to the Meditation Room.
        const goodnight = document.getElementById('sleep-goodnight');
        if (goodnight) {
            goodnight.addEventListener('pointerdown', () => goodnight.classList.add('is-awake'));
            document.getElementById('sleep-goodnight-close')?.addEventListener('click', () => {
                goodnight.classList.add('hidden');
                goodnight.classList.remove('is-awake');
                const aura = document.getElementById('aura-bg');
                if (aura) {
                    aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(232,194,126,0.12) 0%, transparent 55%)';
                    aura.style.opacity = '1';
                }
                showScreen(lobbyScreen);
            });
        }
    }

    function finish(owner, deps, { quiet = false } = {}) {
        const {
            document, window, state, storage, setText, translate, wakeLock, piperTTS,
            backgroundMusicStopFadeSeconds, visualizationAmbienceExitFadeSeconds,
            scheduleEarnHandoff, now = () => Date.now()
        } = deps;
        document.body.classList.remove('visualization-active');
        document.body.classList.remove('body-scan-active');
        document.body.classList.remove('noting-active');
        document.body.classList.remove('undo-unlearn-active');
        const sessionMinutes = Math.max(1, Math.round((now() - (owner.sessionStartedAt || now())) / 60000));
        owner.isMeditationActive = false;
        owner.isHypnosisJourney = false;
        owner.sessionStartedAt = null;
        owner.stopSessionCountdown();
        owner.visual.stop();
        owner.stopStageDrone();
        // Completion never restores music after mantra; both layers receive one coordinated exit.
        owner.audio.stopMantraTrack({ restoreMusic: false });
        owner.audio.stopGuidedTransitionTone();
        owner.audio.bgMusicTargetVolume = 0;
        owner.audio.bgMusicTargetEQ = 0;
        owner.audio.stopBackgroundMusic(backgroundMusicStopFadeSeconds);
        owner.audio.stopVisualizationAmbience(visualizationAmbienceExitFadeSeconds);
        owner.audio.stopPleasureAmbience(8);
        wakeLock.release();
        piperTTS.cancel('journey finished', { fadeSeconds: 2 });
        document.getElementById('aura-bg').style.opacity = '0';
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        owner.sleepWindDownCleanup?.();
        state.stats.journeys += 1;
        state.stats.time += sessionMinutes;
        storage.setItem('chakra_stats_journeys', state.stats.journeys);
        storage.setItem('chakra_stats_time', state.stats.time);
        setText('stat-journeys', state.stats.journeys);
        setText('stat-time', state.stats.time);
        setText('stat-session-time', sessionMinutes + ' mins');
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.setProperty('--app-brightness', '1');
        const controls = document.getElementById('controls');
        if (controls) controls.classList.add('hidden');
        const mixer = document.getElementById('volume-mixer');
        if (mixer) mixer.classList.add('hidden');

        if (quiet) {
            // Sleep: no bright completion modal and no Earn hand-off. A dark
            // goodnight screen; the wake lock is already released above.
            const goodnight = document.getElementById('sleep-goodnight');
            if (goodnight) {
                goodnight.classList.remove('hidden', 'is-awake');
                return;
            }
        }
        const modal = document.getElementById('completion-modal');
        const title = document.getElementById('completion-title');
        const msg = document.getElementById('completion-message');
        const earnLink = document.getElementById('continue-to-earn');
        const btn = document.getElementById('close-completion');
        if (title) title.textContent = translate('ui.journeyComplete');
        if (msg) msg.textContent = translate('ui.meditationCompleted');
        if (earnLink) earnLink.textContent = translate('ui.continueToEarn');
        if (btn) btn.textContent = translate('ui.returnToRoom');
        modal.classList.remove('hidden');
        scheduleEarnHandoff();
    }

    global.ChakraCompletionView = Object.freeze({ bind, createEarnHandoff, finish });
})(typeof window === 'undefined' ? globalThis : window);
