class JourneyVideoPrelude {
    constructor(audioEngine) {
        this.audio = audioEngine;
        this.overlay = document.getElementById('journey-video-prelude');
        this.media = document.getElementById('journey-video-prelude-media');
        this.meditatorImage = this.overlay?.querySelector('.journey-video-prelude-meditator');
        this.playButton = document.getElementById('play-journey-video-prelude');
        this.loadingStatus = document.getElementById('journey-video-prelude-loading');
        this.bufferCountdown = document.getElementById('journey-video-prelude-buffer-countdown');
        this.previewTimer = null;
        this.activePlayback = null;
    }

    getVideoBufferTargetSeconds() {
        const connection = typeof navigator !== 'undefined' ? navigator.connection : null;
        if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)) {
            return JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS;
        }
        if (Number.isFinite(connection?.downlink)) {
            if (connection.downlink < 3) return 8;
            if (connection.downlink < 8) return 6;
        }
        return JOURNEY_VIDEO_PRELUDE_BUFFER_MIN_SECONDS;
    }

    ensureVideoSource() {
        if (!this.media) return false;
        if (this.media.getAttribute('src')) return true;
        const source = this.media.dataset.videoSrc;
        if (!source) return false;
        this.media.src = source;
        return true;
    }

    getBufferedAheadSeconds() {
        if (!this.media) return 0;
        for (let index = 0; index < this.media.buffered.length; index += 1) {
            const start = this.media.buffered.start(index);
            const end = this.media.buffered.end(index);
            if (this.media.currentTime >= start && this.media.currentTime <= end) {
                return Math.max(0, end - this.media.currentTime);
            }
        }
        return 0;
    }

    async bufferVideoToSafePoint() {
        if (!this.ensureVideoSource()) return false;
        const requiredSeconds = Math.min(
            this.getVideoBufferTargetSeconds(),
            Number.isFinite(this.media.duration) ? Math.max(2, this.media.duration) : JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS
        );
        const hasSafeBuffer = () => {
            if (this.media.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return false;
            return this.getBufferedAheadSeconds() >= requiredSeconds;
        };
        if (hasSafeBuffer()) return true;
        return new Promise(resolve => {
            let settled = false;
            let timeout = null;
            let stableSince = 0;
            const check = () => {
                if (!hasSafeBuffer()) {
                    stableSince = 0;
                    return;
                }
                if (!stableSince) stableSince = performance.now();
                if (performance.now() - stableSince >= JOURNEY_VIDEO_PRELUDE_BUFFER_STABILITY_MS) finish(true);
            };
            const finish = (result) => {
                if (settled) return;
                settled = true;
                if (timeout) clearTimeout(timeout);
                if (interval) clearInterval(interval);
                ['progress', 'canplay', 'canplaythrough', 'loadeddata', 'durationchange'].forEach(event => {
                    this.media.removeEventListener(event, check);
                });
                resolve(result);
            };
            const interval = setInterval(check, 250);
            // Slow first-use delivery is not a media failure. Let the guide
            // continue after the bounded wait; a real media error still uses
            // the dedicated `error` event and safe fallback path.
            timeout = setTimeout(() => finish(true), 90000);
            ['progress', 'canplay', 'canplaythrough', 'loadeddata', 'durationchange'].forEach(event => {
                this.media.addEventListener(event, check);
            });
            try { this.media.load(); } catch (error) { finish(false); }
            check();
        });
    }

    async previewAudio() {
        if (!this.ensureVideoSource()) return;
        try { this.media.load(); } catch (error) { return; }
        if (!this.audio.isInitialized) await this.audio.init();
        if (!this.audio.prepareJourneyVideoPrelude(this.media)) return;
        if (this.previewTimer) clearTimeout(this.previewTimer);
        this.media.pause();
        try { this.media.currentTime = 0; } catch (error) {}
        this.media.muted = false;
        this.media.volume = 1;
        this.audio.fadeJourneyVideoPrelude(0, 0);
        try {
            await this.media.play();
            this.audio.fadeJourneyVideoPrelude(state.volVideo, 0.25);
            this.previewTimer = setTimeout(() => {
                this.audio.fadeJourneyVideoPrelude(0, 0.8);
                setTimeout(() => { this.media.pause(); try { this.media.currentTime = 0; } catch (error) {} }, 850);
            }, 8000);
        } catch (error) { console.warn('Video audio preview unavailable:', error); }
    }

    async play() {
        if (this.activePlayback) return this.activePlayback;
        if (!this.overlay || !this.ensureVideoSource()) return 'unavailable';

        // Restart happens from an active journey, so the context is normally
        // ready within the click gesture. Keep the fallback for recovery.
        if (!this.audio.isInitialized) await this.audio.init();
        if (!this.audio.prepareJourneyVideoPrelude(this.media)) return 'unavailable';

        this.activePlayback = new Promise((resolve) => {
            let settled = false;
            let exitPromise = null;
            let hasStarted = false;
            let playDelayTimer = null;
            let isWaitingForBuffer = false;
            let bufferCountdownTimer = null;
            const cleanup = () => {
                this.media.removeEventListener('timeupdate', onTimeUpdate);
                this.media.removeEventListener('progress', onProgress);
                this.media.removeEventListener('canplay', onProgress);
                this.media.removeEventListener('waiting', onWaiting);
                this.media.removeEventListener('stalled', onWaiting);
                this.media.removeEventListener('ended', onEnded);
                this.media.removeEventListener('error', onError);
                this.playButton?.removeEventListener('click', onPlay);
                if (playDelayTimer) clearTimeout(playDelayTimer);
                if (bufferCountdownTimer) clearInterval(bufferCountdownTimer);
            };
            const beginExit = (duration) => {
                if (exitPromise) return exitPromise;
                this.overlay.classList.add('is-leaving');
                this.audio.fadeJourneyVideoPrelude(0, duration);
                exitPromise = new Promise(done => setTimeout(done, Math.max(0, duration) * 1000));
                return exitPromise;
            };
            const complete = async (reason, duration) => {
                if (settled) return;
                settled = true;
                cleanup();
                await beginExit(duration);
                this.media.pause();
                try { this.media.currentTime = 0; } catch (error) {}
                this.overlay.classList.remove('is-visible', 'is-leaving', 'is-playing');
                this.overlay.classList.add('hidden');
                if (this.playButton) this.playButton.hidden = true;
                if (this.loadingStatus) this.loadingStatus.hidden = true;
                resolve(reason);
            };
            const onTimeUpdate = () => {
                if (!hasStarted) return;
                const remaining = this.media.duration - this.media.currentTime;
                if (Number.isFinite(remaining) && remaining <= JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS) {
                    void beginExit(JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS);
                    return;
                }
                // Do not enter recovery during the final rebuffer window. A
                // short clip cannot ever accumulate a four-second reserve
                // when less than two seconds remain, which would otherwise
                // leave the media paused forever near the end.
                if (Number.isFinite(remaining) && remaining <= JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS) return;
                if (!isWaitingForBuffer && this.getBufferedAheadSeconds() < JOURNEY_VIDEO_PRELUDE_REBUFFER_SECONDS) {
                    isWaitingForBuffer = true;
                    this.media.pause();
                }
            };
            const onEnded = () => { void complete('ended', JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS); };
            const onError = () => { void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS); };
            const onWaiting = () => {
                if (!hasStarted || settled) return;
                const remaining = this.media.duration - this.media.currentTime;
                if (Number.isFinite(remaining) && remaining <= JOURNEY_VIDEO_PRELUDE_FADE_OUT_SECONDS) return;
                isWaitingForBuffer = true;
            };
            const onProgress = () => {
                const resumeTarget = Math.min(
                    JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS,
                    Number.isFinite(this.media.duration)
                        ? Math.max(0.5, this.media.duration - this.media.currentTime)
                        : JOURNEY_VIDEO_PRELUDE_RESUME_BUFFER_SECONDS
                );
                if (!isWaitingForBuffer || this.getBufferedAheadSeconds() < resumeTarget) return;
                isWaitingForBuffer = false;
                void this.media.play().catch(() => { void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS); });
            };
            const onPlay = () => {
                if (hasStarted || settled) return;
                hasStarted = true;
                this.overlay.classList.add('is-playing', 'is-meditator');
                playDelayTimer = setTimeout(() => {
                    this.overlay.classList.remove('is-meditator');
                    this.overlay.classList.add('is-video');
                    const playback = this.media.play();
                    Promise.resolve(playback).then(() => {
                        this.audio.fadeJourneyVideoPrelude(state.volVideo, JOURNEY_VIDEO_PRELUDE_FADE_IN_SECONDS);
                    }).catch(() => { void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS); });
                }, JOURNEY_VIDEO_PRELUDE_MEDITATOR_HOLD_SECONDS * 1000);
            };

            this.media.addEventListener('timeupdate', onTimeUpdate);
            this.media.addEventListener('progress', onProgress);
            this.media.addEventListener('canplay', onProgress);
            this.media.addEventListener('waiting', onWaiting);
            this.media.addEventListener('stalled', onWaiting);
            this.media.addEventListener('ended', onEnded);
            this.media.addEventListener('error', onError);
            this.playButton?.addEventListener('click', onPlay, { once: true });
            this.overlay.classList.remove('hidden', 'is-leaving', 'is-playing', 'is-meditator', 'is-video');
            this.overlay.classList.add('is-meditator');
            if (this.playButton) this.playButton.hidden = true;
            if (this.loadingStatus) this.loadingStatus.hidden = false;
            const updateBufferCountdown = () => {
                if (!this.bufferCountdown) return;
                const target = Math.min(
                    this.getVideoBufferTargetSeconds(),
                    Number.isFinite(this.media.duration) ? Math.max(2, this.media.duration) : JOURNEY_VIDEO_PRELUDE_BUFFER_MAX_SECONDS
                );
                const remaining = Math.max(0, Math.ceil(target - this.getBufferedAheadSeconds()));
                this.bufferCountdown.textContent = remaining > 0 ? ` (${remaining}s remaining)` : '';
            };
            updateBufferCountdown();
            bufferCountdownTimer = setInterval(updateBufferCountdown, 500);
            requestAnimationFrame(() => this.overlay.classList.add('is-visible'));
            this.media.muted = false;
            this.media.volume = 1;
            this.media.pause();
            try { this.media.currentTime = 0; } catch (error) {}
            this.audio.fadeJourneyVideoPrelude(0, 0);
            void this.bufferVideoToSafePoint().then((isReady) => {
                if (settled) return;
                if (!isReady) {
                    void complete('unavailable', JOURNEY_VIDEO_PRELUDE_FAILURE_FADE_SECONDS);
                    return;
                }
                if (this.playButton) {
                    this.playButton.hidden = false;
                    this.playButton.focus();
                }
                if (this.loadingStatus) this.loadingStatus.hidden = true;
            });
        }).finally(() => { this.activePlayback = null; });

        return this.activePlayback;
    }
}
window.ChakraJourneyVideoPrelude = JourneyVideoPrelude;
