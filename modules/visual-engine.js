class VisualEngine {
    constructor(audioEngine) {
        this.container = document.getElementById('chakra-container');
        this.symbolImg = document.getElementById('chakra-symbol');
        this.glow = document.getElementById('glow-effect');
        this.presence = this.container && this.symbolImg && window.CelestialPresence
            ? new window.CelestialPresence(this.container, this.symbolImg) : null;
        this.presence?.setAudio(audioEngine);
    }
    applyImageEffect(color = null) {
        if (!this.container) return;
        const effect = normalizeMeditationVisualEffect(state.visualEffect);
        const active = effect !== 'natural' && !state.eyesCloseMode;
        this.container.classList.remove(
            'visual-effect-natural',
            'visual-effect-aura',
            'visual-effect-holographic',
            'visual-effect-depth',
            'visual-effect-active'
        );
        this.container.classList.add(`visual-effect-${effect}`);
        const breatheActive = !state.eyesCloseMode;
        this.container.classList.toggle('visual-effect-active', active);
        this.container.classList.toggle('image-breathe-active', breatheActive);
        if (breatheActive) {
            const cycleSeconds = 8 + Math.random() * 8;
            this.container.style.setProperty('--image-breathe-duration', `${cycleSeconds.toFixed(2)}s`);
            this.container.style.setProperty('--image-breathe-delay', `${(-Math.random() * cycleSeconds).toFixed(2)}s`);
        }
        if (color) this.container.style.setProperty('--chakra-visual-color', color);
        this.presence?.setActive(effect === 'depth' && active, color);
    }
    startPulsing(color) {
        this.applyImageEffect(color);
        if (state.eyesCloseMode) return; // Absolute Blackout
        this.glow.style.background = `radial-gradient(circle, ${color}66 0%, transparent 70%)`;
    }
    stop() {
        this.presence?.setActive(false);
        if (this.container) this.container.classList.remove('visual-effect-active', 'image-breathe-active');
        if (this.glow) this.glow.style.background = 'transparent';
    }
}

window.VisualEngine = VisualEngine;
