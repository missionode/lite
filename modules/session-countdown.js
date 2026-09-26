(function installSessionCountdown(global) {
    'use strict';

    const CIRCUMFERENCE = 276.46;

    function renderProgress(document, remainingMs, totalMs) {
        if (!document || typeof document.querySelectorAll !== 'function') throw new TypeError('Countdown display requires a document');
        const countdowns = document.querySelectorAll('[data-session-countdown]');
        const progressNodes = document.querySelectorAll('[data-session-countdown-progress]');
        const total = Number(totalMs);
        const remaining = Number(remainingMs);
        if (!countdowns.length || !progressNodes.length || !Number.isFinite(total) || total <= 0) {
            countdowns.forEach(countdown => { countdown.hidden = true; });
            return;
        }
        const safeRemaining = Math.min(total, Math.max(0, Number.isFinite(remaining) ? remaining : total));
        const ratio = safeRemaining / total;
        countdowns.forEach(countdown => { countdown.hidden = false; });
        progressNodes.forEach(progress => {
            progress.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - ratio));
        });
    }

    function hideDisplay(document) {
        if (!document || typeof document.querySelectorAll !== 'function') throw new TypeError('Countdown display requires a document');
        document.querySelectorAll('[data-session-countdown]').forEach(countdown => { countdown.hidden = true; });
    }

    class SessionCountdown {
        constructor({ now, setIntervalFn, clearIntervalFn, isActive, isPaused, render, hide }) {
            if (typeof now !== 'function' || typeof setIntervalFn !== 'function' ||
                typeof clearIntervalFn !== 'function' || typeof isActive !== 'function' ||
                typeof isPaused !== 'function' || typeof render !== 'function' || typeof hide !== 'function') {
                throw new TypeError('Session countdown requires clock, timer, session-state and display services');
            }
            this.now = now;
            this.setIntervalFn = setIntervalFn;
            this.clearIntervalFn = clearIntervalFn;
            this.isActive = isActive;
            this.isPaused = isPaused;
            this.renderDisplay = render;
            this.hideDisplay = hide;
            this.totalMs = 0;
            this.remainingMs = 0;
            this.lastTickAt = 0;
            this.ticker = null;
        }

        start(totalMs) {
            this.stop();
            const total = Number(totalMs);
            if (!Number.isFinite(total) || total <= 0) return;

            this.totalMs = total;
            this.remainingMs = total;
            this.lastTickAt = this.now();
            this.render();
            this.ticker = this.setIntervalFn(() => {
                const now = this.now();
                if (!this.isActive() || this.isPaused()) {
                    this.lastTickAt = now;
                    return;
                }
                this.remainingMs = Math.max(
                    0,
                    this.remainingMs - Math.max(0, now - this.lastTickAt)
                );
                this.lastTickAt = now;
                this.render();
            }, 250);
        }

        render() {
            this.renderDisplay(this.remainingMs, this.totalMs);
        }

        stop() {
            if (this.ticker !== null) {
                this.clearIntervalFn(this.ticker);
                this.ticker = null;
            }
            this.totalMs = 0;
            this.remainingMs = 0;
            this.lastTickAt = 0;
            this.hideDisplay();
        }
    }

    global.ChakraSessionCountdown = SessionCountdown;
    global.ChakraSessionCountdownDisplay = Object.freeze({ renderProgress, hideDisplay, circumference: CIRCUMFERENCE });
})(typeof window === 'undefined' ? globalThis : window);
