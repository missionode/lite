(function installCompletionView(global) {
    'use strict';

    function createEarnHandoff({ document = global.document, window = global, getLanguage, delayMs = 3000 } = {}) {
        if (!document || !window || typeof getLanguage !== 'function' || !Number.isFinite(delayMs) || delayMs < 0) {
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
        function canUse() { return getLanguage() !== 'hi'; }
        function schedule() {
            cancel();
            if (!canUse()) return;
            timer = window.setTimeout(() => {
                timer = null;
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
                aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
                aura.style.opacity = '1';
            }
            showScreen(lobbyScreen);
        });
    }

    function finish(owner, deps) {
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
