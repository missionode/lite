const MANTRA_AUDIO_MAP = {
    root:        'audio/LAM.mp3',
    sacral:      'audio/VAM.mp3',
    solar:       'audio/RAM.mp3',
    heart:       'audio/YAM.mp3',
    throat:      'audio/HAM.mp3',
    thirdeye:    'audio/OM.mp3',
    crown:       'audio/OM.mp3',
    high_energy: 'audio/HREEM.mp3'
};

// Audio Engine
class SeamlessLoop {
    constructor(ctx, buffer, destination, targetGain = 1.0, crossfadeDuration = 3) {
        this.ctx = ctx;
        this.buffer = buffer;
        this.destination = destination;
        this.targetGainValue = targetGain;
        this.crossfadeDuration = crossfadeDuration;
        this.activeSources = [];
        this.nextStartTimer = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._playInstance();
    }

    _playInstance() {
        if (!this.isRunning) return;

        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();

        source.buffer = this.buffer;
        source.connect(gain);
        gain.connect(this.destination);

        // Initial Fade In
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.targetGainValue, now + this.crossfadeDuration);

        source.start(now);
        this.activeSources.push({ source, gain });

        // Schedule next instance and current fade out
        const duration = this.buffer.duration;
        const nextStartTime = now + duration - this.crossfadeDuration;

        // Schedule fade out for this instance
        gain.gain.setValueAtTime(this.targetGainValue, nextStartTime);
        gain.gain.linearRampToValueAtTime(0, nextStartTime + this.crossfadeDuration);

        // Remove from tracking and stop after fade out
        setTimeout(() => {
            try { source.stop(); } catch(e) {}
            this.activeSources = this.activeSources.filter(s => s.source !== source);
        }, (duration + 1) * 1000);

        // Recursively schedule next
        const delayMs = (duration - this.crossfadeDuration) * 1000;
        this.nextStartTimer = setTimeout(() => this._playInstance(), delayMs);
    }

    setGain(value) {
        this.targetGainValue = value;
        this.activeSources.forEach(s => {
            const now = this.ctx.currentTime;
            s.gain.gain.cancelScheduledValues(now);
            s.gain.gain.linearRampToValueAtTime(value, now + 2.0);
        });
    }

    stop(fadeTime = 4) {
        this.isRunning = false;
        if (this.nextStartTimer) clearTimeout(this.nextStartTimer);

        const now = this.ctx.currentTime;
        this.activeSources.forEach(s => {
            s.gain.gain.cancelScheduledValues(now);
            s.gain.gain.setValueAtTime(s.gain.gain.value, now);
            s.gain.gain.linearRampToValueAtTime(0, now + fadeTime);
            setTimeout(() => { try { s.source.stop(); } catch(e) {} }, (fadeTime + 1.0) * 1000);
        });
        this.activeSources = [];
    }
}

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.droneOscillators = [];
        this.elementalNodes = [];
        this.binauralNodes = [];
        this.masterGain = null;
        this.reverbNode = null;
        this.reverbWet = null;
        this.pannerNode = null;
        this.isInitialized = false;
        this.mantraLoop = null;
        this.bgMusicLoop = null;
        this.mantraBuffer = {};
        this.bgMusicBuffer = null;
        this.masterCompressor = null;
        this.presenceFilter = null;
        this.lowCutFilter = null;
        this.mantraPresenceLFO = null;
    }

    async init() {
        if (this.isInitialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'playback',
            sampleRate: 48000
        });
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 

        this.exciter = this.ctx.createWaveShaper();
        this.exciter.curve = this.makeWarmthCurve(0.12); 
        
        this.comfortFilter = this.ctx.createBiquadFilter();
        this.comfortFilter.type = 'peaking';
        this.comfortFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.comfortFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
        this.comfortFilter.gain.setValueAtTime(-3.5, this.ctx.currentTime);

        this.voiceCarveFilter = this.ctx.createBiquadFilter();
        this.voiceCarveFilter.type = 'peaking';
        this.voiceCarveFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);
        this.voiceCarveFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
        this.voiceCarveFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.presenceFilter = this.ctx.createBiquadFilter();
        this.presenceFilter.type = 'highshelf';
        this.presenceFilter.frequency.setValueAtTime(8500, this.ctx.currentTime);
        this.presenceFilter.gain.setValueAtTime(-2, this.ctx.currentTime);

        this.warmthFilter = this.ctx.createBiquadFilter();
        this.warmthFilter.type = 'lowshelf';
        this.warmthFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
        this.warmthFilter.gain.setValueAtTime(2.5, this.ctx.currentTime); 

        this.lowCutFilter = this.ctx.createBiquadFilter();
        this.lowCutFilter.type = 'highpass';
        this.lowCutFilter.frequency.setValueAtTime(150, this.ctx.currentTime);
        this.lowCutFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-24, this.ctx.currentTime); 
        this.masterCompressor.ratio.setValueAtTime(3, this.ctx.currentTime); 
        this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime); 
        this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        this.pannerNode = this.ctx.createPanner();
        this.pannerNode.panningModel = 'HRTF';
        this.pannerNode.distanceModel = 'exponential';
        
        const pannerLfoX = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 6; 
        pannerLfoX.frequency.setValueAtTime(0.03, this.ctx.currentTime);
        pannerLfoX.connect(lfoGain);
        lfoGain.connect(this.pannerNode.positionX);
        pannerLfoX.start();

        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = 0.35;
        this.reverbFilter = this.ctx.createBiquadFilter();
        this.reverbFilter.type = 'lowpass';
        this.reverbFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.65;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.42;
        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);

        this.auraGain = this.ctx.createGain();
        this.auraGain.gain.value = 0.06;
        this.auraFilter = this.ctx.createBiquadFilter();
        this.auraFilter.type = 'notch';
        this.auraFilter.Q.setValueAtTime(12, this.ctx.currentTime);
        const auraLfo = this.ctx.createOscillator();
        auraLfo.frequency.setValueAtTime(0.06, this.ctx.currentTime);
        const auraLfoGain = this.ctx.createGain();
        auraLfoGain.gain.value = 2500;
        auraLfo.connect(auraLfoGain);
        auraLfoGain.connect(this.auraFilter.frequency);
        auraLfo.start();

        this.masterGain.connect(this.delayNode);
        this.masterGain.connect(this.pannerNode);
        this.masterGain.connect(this.auraGain); 
        this.auraGain.connect(this.auraFilter);
        this.auraFilter.connect(this.reverbGain); 
        this.delayNode.connect(this.pannerNode);
        this.pannerNode.connect(this.lowCutFilter);
        this.lowCutFilter.connect(this.voiceCarveFilter);
        this.voiceCarveFilter.connect(this.comfortFilter);
        this.comfortFilter.connect(this.warmthFilter);
        this.warmthFilter.connect(this.exciter);
        this.exciter.connect(this.reverbGain);
        this.reverbGain.connect(this.reverbFilter);
        this.reverbFilter.connect(this.presenceFilter);
        this.exciter.connect(this.presenceFilter); 
        this.presenceFilter.connect(this.masterCompressor);
        this.masterCompressor.connect(this.ctx.destination);

        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.ctx.destination);

        this.bgMusicGain = this.ctx.createGain();
        this.bgMusicGain.gain.value = 0;
        this.bgMusicEQ = this.ctx.createBiquadFilter();
        this.bgMusicEQ.type = 'peaking';
        this.bgMusicEQ.frequency.setValueAtTime(2500, this.ctx.currentTime); 
        this.bgMusicGain.connect(this.bgMusicEQ);
        this.bgMusicEQ.connect(this.lowCutFilter);

        this.mantraGain = this.ctx.createGain();
        this.mantraGain.gain.value = 0;
        this.mantraFilter = this.ctx.createBiquadFilter();
        this.mantraFilter.type = 'lowpass';
        this.mantraFilter.frequency.setValueAtTime(5000, this.ctx.currentTime);
        this.mantraGain.connect(this.mantraFilter);
        this.mantraFilter.connect(this.lowCutFilter);

        const preloads = Object.entries(MANTRA_AUDIO_MAP).map(async ([key, path]) => {
            try {
                const response = await fetch(path);
                const arrayBuffer = await response.arrayBuffer();
                this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);
            } catch (e) { console.warn(`Failed to pre-load mantra: ${key}`, e); }
        });
        await Promise.all(preloads);
        this.isInitialized = true;
    }

    makeWarmthCurve(amount) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    createNoiseBuffer() {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
        return buffer;
    }

    startElementalLayer(index) {
        this.elementalNodes.forEach(n => { try { n.src.stop(); } catch(e) {} });
        this.elementalNodes = [];
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = this.createNoiseBuffer();
        noiseSrc.loop = true;
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 5);
        if (index === 0 || index === 1) {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(index === 0 ? 100 : 300, this.ctx.currentTime);
        } else if (index === 2 || index === 3) {
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(index === 2 ? 800 : 1500, this.ctx.currentTime);
            filter.Q.setValueAtTime(2.0, this.ctx.currentTime); 
        } else {
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(4000 + (index * 400), this.ctx.currentTime);
        }
        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noiseSrc.start();
        this.elementalNodes.push({ src: noiseSrc, gain: gain });
    }

    startDrone(baseFreq, index = 0) {
        this.stopDrone();
        this.stopBinaural();
        this.startElementalLayer(index);
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(baseFreq * 0.002, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfo.start();
        this.vibrationLFO = lfo;
        const harmonics = [{ f: 1.0, g: 0.2, type: 'sine' }, { f: 0.5, g: 0.15, type: 'sine' }];
        harmonics.forEach((h) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = h.type;
            osc.frequency.setValueAtTime(baseFreq * h.f, this.ctx.currentTime);
            lfoGain.connect(osc.frequency);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(baseFreq * 1.2, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(h.g, this.ctx.currentTime + 5);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            this.droneOscillators.push({ osc, gain });
        });
        const leftOsc = this.ctx.createOscillator();
        const rightOsc = this.ctx.createOscillator();
        const leftPanner = this.ctx.createStereoPanner();
        const rightPanner = this.ctx.createStereoPanner();
        const binauralGain = this.ctx.createGain();
        leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);
        rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);
        leftOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        rightOsc.frequency.setValueAtTime(baseFreq + 7.83, this.ctx.currentTime);
        binauralGain.gain.setValueAtTime(0, this.ctx.currentTime);
        binauralGain.gain.linearRampToValueAtTime(0.008, this.ctx.currentTime + 10); 
        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);
        leftPanner.connect(binauralGain);
        rightPanner.connect(binauralGain);
        binauralGain.connect(this.masterGain);
        leftOsc.start();
        rightOsc.start();
        this.binauralNodes = [leftOsc, rightOsc, binauralGain];
    }

    stopBinaural() {
        const now = this.ctx.currentTime;
        this.binauralNodes.forEach(node => {
            if (node instanceof AudioParam) return;
            try { 
                if (node.gain) {
                    node.gain.cancelScheduledValues(now);
                    node.gain.setValueAtTime(node.gain.value, now);
                    node.gain.linearRampToValueAtTime(0, now + 5);
                } else { node.stop(now + 5); }
            } catch(e) {}
        });
        this.binauralNodes = [];
    }

    stopDrone() {
        this.stopBinaural();
        const now = this.ctx.currentTime;
        if (this.vibrationLFO) { try { this.vibrationLFO.stop(now + 5); } catch(e) {} this.vibrationLFO = null; }
        this.droneOscillators.forEach(({ osc, gain }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentVal, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
            setTimeout(() => { try { osc.stop(); } catch(e) {} }, 5100);
        });
        this.droneOscillators = [];
        this.elementalNodes.forEach(({ src, gain }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentVal, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
            setTimeout(() => { try { src.stop(); } catch(e) {} }, 5100);
        });
        this.elementalNodes = [];
    }

    async playMantraTrack(key) {
        if (!this.mantraBuffer[key]) return;
        this.stopMantraTrack();
        const source = this.ctx.createBufferSource();
        source.buffer = this.mantraBuffer[key];
        source.loop = true;
        source.connect(this.mantraGain);
        source.start();
        this.mantraSource = source;
        const now = this.ctx.currentTime;
        this.mantraGain.gain.cancelScheduledValues(now);
        this.mantraGain.gain.setValueAtTime(0, now);
        this.mantraGain.gain.linearRampToValueAtTime(state.volMantra, now + 5);
        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(state.volDrone * 0.25, now + 5);
        }
    }

    stopMantraTrack() {
        if (!this.mantraSource) return;
        const now = this.ctx.currentTime;
        this.mantraGain.gain.cancelScheduledValues(now);
        this.mantraGain.gain.setValueAtTime(this.mantraGain.gain.value, now);
        this.mantraGain.gain.linearRampToValueAtTime(0, now + 4);
        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(state.volDrone, now + 4);
        }
        const src = this.mantraSource;
        this.mantraSource = null;
        setTimeout(() => { try { src.stop(); } catch(e) {} }, 4100);
    }

    async startBackgroundMusic() {
        if (!this.bgMusicBuffer) {
            try {
                const response = await fetch('audio/background_music.mp3');
                const arrayBuffer = await response.arrayBuffer();
                this.bgMusicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            } catch (e) { return; }
        }
        if (this.bgMusicLoop) this.bgMusicLoop.stop(0);
        this.bgMusicLoop = new SeamlessLoop(this.ctx, this.bgMusicBuffer, this.bgMusicGain, 1.0, 5.0);
        this.bgMusicLoop.start();
    }

    fadeInBackgroundMusic(duration = 4, ducked = false) {
        if (!this.bgMusicLoop) return;
        const now = this.ctx.currentTime;
        const targetVol = ducked ? state.volMusic * 0.4 : state.volMusic;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(targetVol, now + duration); 
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(ducked ? 3 : 0, now + duration);
        this.bgMusicLoop.setGain(1.0);
    }

    fadeOutBackgroundMusic(duration = 4) {
        if (!this.bgMusicLoop) return;
        const now = this.ctx.currentTime;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        this.bgMusicLoop.setGain(0);
    }

    triggerReverbSwell(duration = 5) {
        if (!this.reverbGain) return;
        const now = this.ctx.currentTime;
        this.reverbGain.gain.cancelScheduledValues(now);
        this.reverbGain.gain.setValueAtTime(this.reverbGain.gain.value, now);
        this.reverbGain.gain.linearRampToValueAtTime(0.7, now + duration / 2);
        this.reverbGain.gain.linearRampToValueAtTime(0.35, now + duration);
    }

    playSingingBowl() {
        const now = this.ctx.currentTime;
        const baseFreq = 180;
        const partials = [1, 2.8, 5.0, 8.1, 12.5];
        partials.forEach((ratio) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq * ratio, now);
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(baseFreq * ratio, now);
            filter.Q.setValueAtTime(50, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.exponentialRampToValueAtTime(state.volBell / partials.length, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 8);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.bellGain);
            osc.start(now);
            osc.stop(now + 8.1);
        });
    }
}

// Visual Engine
class VisualEngine {
    constructor() {
        this.symbolImg = document.getElementById('chakra-symbol');
        this.glow = document.getElementById('glow-effect');
        this.animationId = null;
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starsAnimId = null;
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
        this.generateStars();
        this.animateStars();
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }
    generateStars() {
        this.stars = [];
        for (let i = 0; i < 60; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 0.5 + Math.random() * 1.0,
                baseOpacity: 0.1 + Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.9
            });
        }
    }
    animateStars() {
        const draw = (time) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const t = time * 0.001;
            this.stars.forEach(star => {
                const opacity = star.baseOpacity + (1 - star.baseOpacity) * 0.5 * (1 + Math.sin(t * star.speed + star.phase));
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.fill();
            });
            this.starsAnimId = requestAnimationFrame(draw);
        };
        this.starsAnimId = requestAnimationFrame(draw);
    }
    startPulsing(color) {
        let scale = 1;
        let direction = 1;
        const animate = () => {
            scale += 0.0001 * direction; 
            if (scale > 1.02 || scale < 1.0) direction *= -1;
            this.symbolImg.style.transform = `scale(${scale})`;
            this.glow.style.boxShadow = `0 0 60px 20px ${color}`;
            this.glow.style.background = color;
            this.glow.style.opacity = 0.15 + (scale - 1) * 2;
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    stop() { cancelAnimationFrame(this.animationId); }
}

// Meditation Controller
class MeditationController {
    constructor(audio, visual) {
        this.audio = audio;
        this.visual = visual;
        this.scripts = null;
        this.isMeditationActive = false;
        this.isPaused = false;
        this.isHighEnergy = false;
        this.chakraOrder = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
    }

    async start() {
        if (!this.scripts) {
            const response = await fetch('scripts.json');
            this.scripts = await response.json();
        }
        await this.audio.init();
        if (this.audio.startBackgroundMusic) await this.audio.startBackgroundMusic();
        await wakeLock.request();
        this.isMeditationActive = true;
        this.isPaused = false;
        this.isHighEnergy = document.getElementById('high-energy-toggle').checked;
        document.getElementById('pause-meditation').textContent = 'II';
        document.getElementById('completion-modal').classList.add('hidden');
        window.speechSynthesis.cancel();
        if (this.isMeditationActive) await this.runGratitude();
        if (this.isMeditationActive) await this.runBoxBreathing();
        if (this.isMeditationActive) {
            showScreen(meditationScreen);
            window.speechSynthesis.cancel();
            await new Promise(r => setTimeout(r, 3000));
            if (this.isHighEnergy) {
                await this.meditateOnChakra(this.scripts.high_energy, 'high_energy');
                if (this.isMeditationActive) {
                    await this.handleSilence();
                    if (this.isMeditationActive) await this.runClosing();
                    if (this.isMeditationActive) await this.runHooponopono();
                    this.finish();
                }
            } else { await this.runSequence(); }
        }
    }

    async runGratitude() {
        const screen = document.getElementById('breathing-screen');
        const tutorial = document.getElementById('breathing-tutorial');
        const tutTitle = document.getElementById('tutorial-title');
        const tutText = document.getElementById('tutorial-text');
        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = "1";
        const aura = document.getElementById('aura-bg');
        aura.style.background = `radial-gradient(circle at center, #3e2723aa, transparent)`;
        aura.style.opacity = "1";
        tutTitle.textContent = state.language === 'ml' ? "കൃതജ്ഞത" : "Gratitude";
        const text = this.scripts.intro[`gratitude_${state.language}`];
        tutText.textContent = text;
        await this.narrate(text, false);
        if (this.isMeditationActive) await new Promise(r => setTimeout(r, 2000));
    }

    async runBoxBreathing() {
        const instruction = document.getElementById('breathing-instruction');
        const circle = document.getElementById('breathing-circle');
        const timer = document.getElementById('breathing-timer');
        const tutorial = document.getElementById('breathing-tutorial');
        const tutTitle = document.getElementById('tutorial-title');
        const tutText = document.getElementById('tutorial-text');
        tutTitle.textContent = state.language === 'ml' ? "തയ്യാറെടുക്കാം" : "Preparation";
        const text = state.language === 'ml' ? "സൗകര്യപ്രദമായി ഇരിക്കുക. നമുക്ക് ശാന്തമായി ശ്വസിച്ചു തുടങ്ങാം." : "Sit comfortably. We will start with a centering breath.";
        tutText.textContent = text;
        await this.narrate(text);
        for (let s = 5; s > 0; s--) { if (!this.isMeditationActive) return; await new Promise(r => setTimeout(r, 1000)); }
        tutorial.style.opacity = "0";
        await new Promise(r => setTimeout(r, 1000));
        tutorial.classList.add('hidden');
        const steps = state.language === 'ml' ? [
            { text: "ശ്വാസം ഉള്ളിലേക്ക് എടുക്കുക", scale: 8 },
            { text: "നിർത്തുക", scale: 8 },
            { text: "ശ്വാസം പുറത്തേക്ക് വിടുക", scale: 1 },
            { text: "നിർത്തുക", scale: 1 }
        ] : [
            { text: "Inhale", scale: 8 }, { text: "Hold", scale: 8 }, { text: "Exhale", scale: 1 }, { text: "Hold", scale: 1 }
        ];
        for (let cycle = 0; cycle < 4; cycle++) {
            for (const step of steps) {
                if (!this.isMeditationActive) return;
                instruction.textContent = step.text;
                circle.style.transform = `scale(${step.scale})`;
                this.narrateSoft(step.text);
                for (let s = 4; s > 0; s--) {
                    if (!this.isMeditationActive) return;
                    timer.textContent = s.toString().padStart(2, '0');
                    while (this.isPaused && this.isMeditationActive) await new Promise(r => setTimeout(r, 100));
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
        if (this.isMeditationActive) {
            instruction.textContent = state.language === 'ml' ? "ശ്വാസക്രിയ പൂർത്തിയായി" : "Breathing Complete";
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async runSequence() {
        for (let i = 0; i < this.chakraOrder.length; i++) {
            const key = this.chakraOrder[i];
            if (!this.isMeditationActive) break;
            await this.meditateOnChakra(this.scripts[key], key);
            if (i < this.chakraOrder.length - 1 && this.isMeditationActive) await this.handleInterval();
        }
        if (this.isMeditationActive) await this.handleSilence();
        if (this.isMeditationActive) await this.runClosing();
        if (this.isMeditationActive) await this.runHooponopono();
        if (this.isMeditationActive) this.finish();
    }

    async runClosing() {
        if (!this.isMeditationActive) return;
        document.getElementById('mantra-display').textContent = "✦";
        document.getElementById('chakra-symbol').style.opacity = "0.4";
        const aura = document.getElementById('aura-bg');
        aura.style.background = `radial-gradient(circle at center, #8B00FF22, transparent)`;
        await this.narrate(this.scripts.closing[state.language]);
        if (!this.isMeditationActive) return;
        await new Promise(r => setTimeout(r, 2000));
        const healthAffirmation = this.scripts.closing[`affirmation_${state.language}`];
        if (healthAffirmation && this.isMeditationActive) {
            document.getElementById('mantra-display').textContent = "✦ BODY ✦";
            await this.narrate(healthAffirmation);
        }
        if (this.isMeditationActive) await new Promise(r => setTimeout(r, 3000));
    }

    async runHooponopono() {
        if (!this.isMeditationActive) return;
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(circle at center, #fff9c455, transparent)';
        aura.style.opacity = '1';
        document.getElementById('chakra-symbol').style.opacity = '0.1';
        document.getElementById('mantra-display').textContent = '✦';
        await this.narrate(this.scripts.hooponopono.intro[state.language], false);
        if (!this.isMeditationActive) return;
        await new Promise(r => setTimeout(r, 2000));
        const phrases = this.scripts.hooponopono.phrases[state.language];
        for (let cycle = 0; cycle < 3; cycle++) {
            if (!this.isMeditationActive) break;
            for (const phrase of phrases) {
                if (!this.isMeditationActive) break;
                document.getElementById('narration-text').textContent = phrase;
                await this.narrate(phrase, false);
                if (this.isMeditationActive) await new Promise(r => setTimeout(r, 2000));
            }
        }
        if (!this.isMeditationActive) return;
        document.getElementById('narration-text').textContent = '';
        await this.narrate(this.scripts.hooponopono.closing[state.language], true);
        if (this.isMeditationActive) await new Promise(r => setTimeout(r, 3000));
    }

    async handleInterval() {
        this.audio.stopDrone();
        document.getElementById('mantra-display').textContent = "BREATHE";
        document.getElementById('chakra-symbol').style.opacity = "0.3";
        this.visual.stop();
        await new Promise(r => setTimeout(r, 2000));
        const breatheText = state.language === 'ml' ? "അല്പം വിശ്രമിക്കൂ... ശ്വസിക്കൂ... അടുത്ത ചക്രത്തിനായി തയ്യാറെടുക്കൂ" : "Take a break... breathe and prepare... for the next chakra";
        this.narrateFeeble(breatheText);
        const intervalMs = 9000;
        let elapsed = 0;
        while (elapsed < intervalMs) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                const remaining = Math.max(0, intervalMs - elapsed);
                document.getElementById('timer-display').textContent = `00:${Math.ceil(remaining / 1000).toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    async meditateOnChakra(chakra, key) {
        if (!this.isMeditationActive) return;
        const symbolEl = document.getElementById('chakra-symbol');
        symbolEl.style.opacity = '1';
        symbolEl.src = chakra.symbol;
        document.getElementById('mantra-display').textContent = chakra.mantra;
        document.getElementById('mantra-display').style.color = chakra.color;
        document.body.style.setProperty('--primary-color', chakra.color);
        document.querySelectorAll('.dot').forEach(dot => {
            if (dot.dataset.chakra === key) dot.classList.add('active');
            else if (this.chakraOrder.indexOf(dot.dataset.chakra) < this.chakraOrder.indexOf(key)) {
                dot.classList.add('completed'); dot.classList.remove('active');
            } else dot.classList.remove('active', 'completed');
        });
        const aura = document.getElementById('aura-bg');
        aura.style.background = `radial-gradient(circle at center, ${chakra.color}22, transparent)`;
        aura.style.opacity = "1";
        if (key === 'thirdeye') { this.audio.stopDrone(); } else { this.audio.startDrone(chakra.frequency, this.chakraOrder.indexOf(key)); }
        this.visual.startPulsing(chakra.color);
        await this.narrate(chakra[state.language]);
        if (!this.isMeditationActive) return;
        await this.audio.playMantraTrack(key);
        const chantDurationMs = (state.timePerChakra * 60 * 1000) - 15000;
        let elapsed = 0;
        while (elapsed < chantDurationMs) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                const remaining = Math.max(0, chantDurationMs - elapsed);
                const mins = Math.floor(remaining / 60000);
                const secs = Math.floor((remaining % 60000) / 1000);
                document.getElementById('timer-display').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        document.getElementById('timer-display').textContent = "00:00";
        this.audio.stopMantraTrack();
        if (key === 'thirdeye') { this.audio.startDrone(chakra.frequency, this.chakraOrder.indexOf(key)); await new Promise(r => setTimeout(r, 2000)); } else { await new Promise(r => setTimeout(r, 4000)); }
        if (this.isMeditationActive) await this.narrate(chakra[`affirmation_${state.language}`]);
    }

    async narrateFeeble(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            utterance.rate = 0.8; utterance.pitch = 0.9; utterance.volume = state.volVoice * 0.6;
            utterance.onend = resolve;
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrateSoft(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            utterance.rate = 0.6; utterance.pitch = 0.8; utterance.volume = state.volVoice * 0.4;
            utterance.onend = resolve;
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrate(text, fadeOut = false) {
        if (this.audio.bgMusicLoop) this.audio.fadeInBackgroundMusic(4, true);
        await new Promise(r => setTimeout(r, 1200));
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.cancelScheduledValues(this.audio.ctx.currentTime);
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(-8, this.audio.ctx.currentTime + 1.5);
        }
        const sentences = text.split(/[.!?।]/).filter(s => s.trim().length > 0);
        for (const sentence of sentences) {
            if (!this.isMeditationActive) break;
            while (this.isPaused && this.isMeditationActive) await new Promise(r => setTimeout(r, 100));
            const narrationTextEl = document.getElementById('narration-text');
            if (narrationTextEl) narrationTextEl.textContent = sentence.trim();
            await new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                const selectedVoice = state.voices.find(v => v.name === state.voiceName);
                if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
                utterance.rate = state.sleepMode ? 0.60 : 0.72; utterance.pitch = state.sleepMode ? 0.75 : 0.88;
                utterance.volume = state.sleepMode ? state.volVoice * 0.55 : state.volVoice;
                const safetyTimeout = setTimeout(() => { resolve(); }, (sentence.length * 150) + 3000);
                utterance.onend = () => { clearTimeout(safetyTimeout); resolve(); };
                utterance.onerror = () => { clearTimeout(safetyTimeout); resolve(); };
                window.speechSynthesis.speak(utterance);
            });
            await new Promise(r => setTimeout(r, state.sleepMode ? 2000 : 1500));
        }
        if (this.audio.voiceCarveFilter) { this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(0, this.audio.ctx.currentTime + 3); }
        if (fadeOut) { await new Promise(r => setTimeout(r, 2500)); this.audio.triggerReverbSwell(5); this.audio.fadeOutBackgroundMusic(4); }
    }

    async handleSilence() {
        if (!this.isMeditationActive) return;
        this.visual.stop();
        document.getElementById('mantra-display').textContent = "SILENCE";
        document.getElementById('chakra-symbol').style.opacity = "0.2";
        this.audio.stopDrone();
        let elapsed = 0;
        const silenceTime = 60000;
        while (elapsed < silenceTime) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                document.getElementById('timer-display').textContent = `00:${Math.ceil((silenceTime - elapsed) / 1000).toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pause-meditation').textContent = this.isPaused ? '▶' : 'II';
        if (this.isPaused) { window.speechSynthesis.pause(); if (this.audio.ctx) this.audio.ctx.suspend(); }
        else { window.speechSynthesis.resume(); if (this.audio.ctx) this.audio.ctx.resume(); }
    }

    finish() {
        this.isMeditationActive = false; this.visual.stop(); this.audio.stopDrone(); this.audio.stopMantraTrack(); wakeLock.release();
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        this.audio.playSingingBowl();
        state.stats.journeys += 1; state.stats.time += Math.round((state.timePerChakra * this.chakraOrder.length) + 1);
        localStorage.setItem('chakra_stats_journeys', state.stats.journeys);
        localStorage.setItem('chakra_stats_time', state.stats.time);
        document.getElementById('stat-journeys').textContent = state.stats.journeys;
        document.getElementById('stat-time').textContent = state.stats.time;
        document.getElementById('stat-session-time').textContent = Math.round(state.stats.time) + ' mins';
        document.getElementById('stat-total-journeys').textContent = state.stats.journeys;
        const modal = document.getElementById('completion-modal');
        document.getElementById('completion-title').textContent = state.language === 'ml' ? "യാത്ര പൂർത്തിയായി" : "Journey Complete";
        document.getElementById('completion-message').textContent = state.language === 'ml' ? "ധ്യാനം പൂർത്തിയായി. അനുഗ്രഹിക്കപ്പെടട്ടെ." : "Meditation Completed. Stay Blessed.";
        document.getElementById('close-completion').textContent = state.language === 'ml' ? "തിരികെ പോവുക" : "Return to Room";
        modal.classList.remove('hidden');
    }

    stop() {
        this.isMeditationActive = false; this.audio.stopDrone(); this.audio.stopMantraTrack(); this.visual.stop(); wakeLock.release();
        window.speechSynthesis.cancel();
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        showScreen(lobbyScreen);
    }
}

class WakeLockManager {
    constructor() { this.wakeLock = null; }
    async request() { if ('wakeLock' in navigator) { try { this.wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {} } }
    release() { if (this.wakeLock !== null) { this.wakeLock.release(); this.wakeLock = null; } }
}

const wakeLock = new WakeLockManager();
const audio = new AudioEngine();
const visual = new VisualEngine();
const meditation = new MeditationController(audio, visual);

document.addEventListener('visibilitychange', async () => {
    if (wakeLock.wakeLock !== null && document.visibilityState === 'visible') await wakeLock.request();
});

const state = {
    language: localStorage.getItem('chakra_lang') || 'ml',
    voiceName: localStorage.getItem('chakra_voice') || '',
    timePerChakra: parseFloat(localStorage.getItem('chakra_time')) || 5.0,
    voices: [],
    volVoice: parseFloat(localStorage.getItem('chakra_vol_voice')) || 1.1,
    volDrone: parseFloat(localStorage.getItem('chakra_vol_drone')) || 0.01,
    volBell: parseFloat(localStorage.getItem('chakra_vol_bell')) || 0.05,
    volMantra: parseFloat(localStorage.getItem('chakra_vol_mantra')) || 0.45,
    volMusic: parseFloat(localStorage.getItem('chakra_vol_music')) || 0.30,
    stats: {
        journeys: parseInt(localStorage.getItem('chakra_stats_journeys')) || 0,
        time: parseInt(localStorage.getItem('chakra_stats_time')) || 0
    },
    selectedChakras: JSON.parse(localStorage.getItem('chakra_selected')) || ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']
};

const configScreen = document.getElementById('config-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const meditationScreen = document.getElementById('meditation-screen');
const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');
const testVoiceBtn = document.getElementById('test-voice');
const saveConfigBtn = document.getElementById('save-config');
const timeSlider = document.getElementById('time-per-chakra');
const timeDisplay = document.getElementById('time-display');
const startMeditationBtn = document.getElementById('start-meditation');
const openSettingsBtn = document.getElementById('open-settings');

function init() {
    setupVoices();
    loadPreferences();
    attachEventListeners();
    checkFirstTime();
    registerServiceWorker();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => console.error(err));
        });
    }
}

function setupVoices() {
    const loadVoices = () => {
        state.voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        state.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.name === state.voiceName) option.selected = true;
            voiceSelect.appendChild(option);
        });
        if (!state.voiceName) autoSelectVoice();
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

function autoSelectVoice() {
    let bestVoice = null;
    if (state.language === 'ml') {
        bestVoice = state.voices.find(v => v.lang === 'ml-IN' || v.lang === 'ml_IN') || 
                    state.voices.find(v => v.lang.startsWith('ml')) ||
                    state.voices.find(v => v.name.toLowerCase().includes('malayalam'));
    } else {
        bestVoice = state.voices.find(v => v.lang === 'en-US' || v.lang === 'en_US') || 
                    state.voices.find(v => v.lang.startsWith('en'));
    }
    if (bestVoice) { state.voiceName = bestVoice.name; voiceSelect.value = bestVoice.name; }
}

function testVoice() {
    const utterance = new SpeechSynthesisUtterance("Testing meditation voice. ശാന്തമായി ഇരിക്കുക.");
    const selectedVoice = state.voices.find(v => v.name === voiceSelect.value);
    if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
    window.speechSynthesis.speak(utterance);
}

function loadPreferences() {
    languageSelect.value = state.language;
    timeSlider.value = state.timePerChakra;
    const pctInit = ((timeSlider.value - timeSlider.min) / (timeSlider.max - timeSlider.min) * 100).toFixed(1) + '%';
    timeSlider.style.setProperty('--range-fill', pctInit);
    timeDisplay.textContent = `${state.timePerChakra.toFixed(1)} mins`;
    document.getElementById('vol-voice').value = state.volVoice;
    document.getElementById('vol-drone').value = state.volDrone;
    document.getElementById('vol-bell').value = state.volBell;
    document.getElementById('vol-mantra').value = state.volMantra;
    document.getElementById('stat-journeys').textContent = state.stats.journeys;
    document.getElementById('stat-time').textContent = state.stats.time;
    document.querySelectorAll('#chakra-selection input').forEach(cb => {
        cb.checked = state.selectedChakras.includes(cb.value);
    });
}

function checkFirstTime() {
    if (localStorage.getItem('chakra_configured')) {
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
        aura.style.opacity = '1';
    } else {
        showScreen(configScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)';
        aura.style.opacity = '1';
    }
}

function showScreen(screen) {
    [configScreen, lobbyScreen, meditationScreen, document.getElementById('breathing-screen')].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

function attachEventListeners() {
    languageSelect.addEventListener('change', (e) => { state.language = e.target.value; autoSelectVoice(); });
    voiceSelect.addEventListener('change', (e) => { state.voiceName = e.target.value; });
    testVoiceBtn.addEventListener('click', testVoice);
    saveConfigBtn.addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('#chakra-selection input:checked')).map(cb => cb.value);
        if (checked.length === 0) { alert("Please select at least one chakra."); return; }
        state.selectedChakras = checked;
        localStorage.setItem('chakra_selected', JSON.stringify(state.selectedChakras));
        localStorage.setItem('chakra_lang', state.language);
        localStorage.setItem('chakra_voice', state.voiceName);
        localStorage.setItem('chakra_configured', 'true');
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
        aura.style.opacity = '1';
    });
    function updateSessionEstimate() {
        const isHigh = document.getElementById('high-energy-toggle').checked;
        const estimate = isHigh
            ? Math.round(state.timePerChakra + 9)
            : Math.round(state.selectedChakras.length * (state.timePerChakra + 2) + 12);
        document.getElementById('session-estimate').textContent = `~ ${estimate} min session`;
    }
    timeSlider.addEventListener('input', (e) => {
        state.timePerChakra = parseFloat(e.target.value);
        timeDisplay.textContent = `${state.timePerChakra.toFixed(1)} mins`;
        localStorage.setItem('chakra_time', state.timePerChakra);
        const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
        e.target.style.setProperty('--range-fill', pct);
        updateSessionEstimate();
    });
    document.getElementById('high-energy-toggle').addEventListener('change', updateSessionEstimate);
    openSettingsBtn.addEventListener('click', () => showScreen(configScreen));
    startMeditationBtn.addEventListener('click', () => {
        meditation.chakraOrder = state.selectedChakras;
        meditation.start();
    });
    document.getElementById('pause-meditation').addEventListener('click', () => meditation.togglePause());
    document.getElementById('stop-meditation').addEventListener('click', () => meditation.stop());
    document.getElementById('close-completion').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
        showScreen(lobbyScreen);
    });
    const mixer = document.getElementById('volume-mixer');
    document.getElementById('btn-mixer').addEventListener('click', () => mixer.classList.toggle('hidden'));
    document.getElementById('close-mixer').addEventListener('click', () => mixer.classList.add('hidden'));
    document.getElementById('vol-voice').addEventListener('input', (e) => { state.volVoice = parseFloat(e.target.value); localStorage.setItem('chakra_vol_voice', state.volVoice); });
    document.getElementById('vol-drone').addEventListener('input', (e) => {
        state.volDrone = parseFloat(e.target.value);
        localStorage.setItem('chakra_vol_drone', state.volDrone);
        if (audio.masterGain) audio.masterGain.gain.setValueAtTime(state.volDrone, audio.ctx.currentTime);
    });
    document.getElementById('vol-bell').addEventListener('input', (e) => { state.volBell = parseFloat(e.target.value); localStorage.setItem('chakra_vol_bell', state.volBell); if (audio.bellGain) audio.bellGain.gain.setValueAtTime(state.volBell, audio.ctx.currentTime); });
    document.getElementById('vol-mantra').addEventListener('input', (e) => { state.volMantra = parseFloat(e.target.value); localStorage.setItem('chakra_vol_mantra', state.volMantra); if (audio.mantraGain && audio.mantraSource) audio.mantraGain.gain.setValueAtTime(state.volMantra, audio.ctx.currentTime); });
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: 'Chakra Meditation', artist: 'Mahakatha Vibe', artwork: [{ src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }] });
        navigator.mediaSession.setActionHandler('play', () => { if (meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('pause', () => { if (!meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('stop', () => meditation.stop());
    }
    document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(cb => { cb.addEventListener('change', () => { cb.closest('.checkbox-label').classList.toggle('chip-active', cb.checked); }); if (cb.checked) cb.closest('.checkbox-label').classList.add('chip-active'); });
    updateSessionEstimate();
}

init();
