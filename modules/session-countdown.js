(function installSessionCountdown(global) {
    'use strict';

    function formatRemainingTime(remainingMs) {
        const value = Number(remainingMs);
        const seconds = Math.ceil(Math.max(0, Number.isFinite(value) ? value : 0) / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainder = seconds % 60;
        return hours > 0
            ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
    }

    function renderDisplay(document, remainingMs, totalMs) {
        if (!document || typeof document.querySelectorAll !== 'function') throw new TypeError('Countdown display requires a document');
        const countdowns = document.querySelectorAll('[data-session-countdown]');
        const total = Number(totalMs);
        if (!countdowns.length || !Number.isFinite(total) || total <= 0) {
            countdowns.forEach(countdown => { countdown.hidden = true; });
            return;
        }
        const remaining = Number.isFinite(Number(remainingMs)) ? Number(remainingMs) : total;
        countdowns.forEach(countdown => {
            countdown.textContent = formatRemainingTime(remaining);
            countdown.hidden = false;
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
    global.ChakraSessionCountdownDisplay = Object.freeze({ renderDisplay, hideDisplay, formatRemainingTime });
})(typeof window === 'undefined' ? globalThis : window);
