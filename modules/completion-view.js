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

    global.ChakraCompletionView = Object.freeze({ bind, createEarnHandoff });
})(typeof window === 'undefined' ? globalThis : window);
