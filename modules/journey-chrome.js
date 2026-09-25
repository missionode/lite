(() => {
    class JourneyChromeController {
        constructor() {
            this.fullscreenTarget = document.getElementById('app');
            this.controls = document.getElementById('controls');
            this.revealZone = document.getElementById('fullscreen-controls-reveal-zone');
            this.mixer = document.getElementById('volume-mixer');
            this.fullscreenChromeHideTimer = null;
            this.cursorHideTimer = null;
            this.journeyChromeActive = false;
            this.syncFullscreenJourneyChrome = this.syncFullscreenJourneyChrome.bind(this);
            document.addEventListener('fullscreenchange', this.syncFullscreenJourneyChrome);
            this.chromeObserver = new MutationObserver(this.syncFullscreenJourneyChrome);
            if (this.controls) this.chromeObserver.observe(this.controls, { attributes: true, attributeFilter: ['class'] });
            if (this.mixer) this.chromeObserver.observe(this.mixer, { attributes: true, attributeFilter: ['class'] });
            this.handlePointerMove = event => {
                if (event.pointerType !== 'touch') this.wakeJourneyCursor();
            };
            this.handleKeyDown = () => {
                clearTimeout(this.cursorHideTimer);
                document.body.classList.remove('journey-cursor-hidden');
            };
            this.handleVisibilityChange = () => this.syncFullscreenJourneyChrome();
            document.addEventListener('pointermove', this.handlePointerMove, { passive: true });
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            this.revealZone?.addEventListener('pointerdown', event => {
                if (event.pointerType === 'touch' || event.pointerType === 'pen') {
                    event.preventDefault();
                    this.setFullscreenChromeVisible(true);
                    this.scheduleFullscreenChromeHide(3000);
                }
            });
            this.revealZone?.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') this.setFullscreenChromeVisible(true); });
            this.revealZone?.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') this.scheduleFullscreenChromeHide(); });
            this.controls?.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') this.setFullscreenChromeVisible(true); });
            this.controls?.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') this.scheduleFullscreenChromeHide(); });
            this.controls?.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') this.scheduleFullscreenChromeHide(3000); });
            this.controls?.addEventListener('focusin', () => {
                if (this.controls.querySelector(':focus-visible')) this.setFullscreenChromeVisible(true);
            });
            this.controls?.addEventListener('focusout', () => this.scheduleFullscreenChromeHide());
        }

        syncFullscreenJourneyChrome() {
            const isJourneyFullscreen = document.fullscreenElement === this.fullscreenTarget;
            document.body.classList.toggle('journey-fullscreen-active', isJourneyFullscreen);
            const active = Boolean(this.controls && !this.controls.classList.contains('hidden'));
            const changed = active !== this.journeyChromeActive;
            this.journeyChromeActive = active;
            document.body.classList.toggle('journey-controls-active', active);
            if (!active || document.hidden) {
                clearTimeout(this.cursorHideTimer);
                clearTimeout(this.fullscreenChromeHideTimer);
                document.body.classList.remove('journey-cursor-hidden', 'fullscreen-controls-visible');
                return;
            }
            if (changed) this.setFullscreenChromeVisible(false);
            if (this.mixer && !this.mixer.classList.contains('hidden')) this.setFullscreenChromeVisible(true);
            else this.scheduleFullscreenChromeHide();
            this.wakeJourneyCursor();
        }

        wakeJourneyCursor() {
            if (!this.journeyChromeActive || document.hidden) return;
            document.body.classList.remove('journey-cursor-hidden');
            clearTimeout(this.cursorHideTimer);
            this.cursorHideTimer = setTimeout(() => {
                if (this.journeyChromeActive && !document.hidden &&
                    (!this.mixer || this.mixer.classList.contains('hidden')) &&
                    !this.controls?.querySelector(':focus-visible')) {
                    document.body.classList.add('journey-cursor-hidden');
                }
            }, 3000);
        }

        setFullscreenChromeVisible(isVisible) {
            if (this.fullscreenChromeHideTimer) {
                clearTimeout(this.fullscreenChromeHideTimer);
                this.fullscreenChromeHideTimer = null;
            }
            document.body.classList.toggle('fullscreen-controls-visible', Boolean(isVisible) && this.journeyChromeActive);
        }

        scheduleFullscreenChromeHide(delay = 180) {
            if (this.fullscreenChromeHideTimer) clearTimeout(this.fullscreenChromeHideTimer);
            this.fullscreenChromeHideTimer = setTimeout(() => {
                const controlsHovered = delay < 3000 && this.controls?.matches(':hover');
                const controlsFocused = this.controls?.querySelector(':focus-visible');
                const mixerOpen = this.mixer && !this.mixer.classList.contains('hidden');
                const revealHovered = delay < 3000 && this.revealZone?.matches(':hover');
                if (!controlsHovered && !controlsFocused && !mixerOpen && !revealHovered) this.setFullscreenChromeVisible(false);
            }, delay);
        }
    }

    window.ChakraJourneyChrome = JourneyChromeController;
})();
