// ── GLOBAL ERROR CATCHER (Mobile Debugging) ──────────────────────────────────
window.onerror = function(msg, url, lineNo, columnNo, error) {
    // Only alert for actual crashes to avoid noise, but ensure we see the "Killer" bugs
    if (msg.toLowerCase().indexOf("script error") > -1) return;
    alert("App Error: " + msg + "\nLine: " + lineNo);
    return false;
};

const MANTRA_AUDIO_MAP = {
    root:        'audio/LAM.mp3',
    sacral:      'audio/VAM.mp3',
    solar:       'audio/RAM.mp3',
    heart:       'audio/YAM.mp3',
    throat:      'audio/HAM.mp3',
    thirdeye:    'audio/OM.mp3',
    crown:       'audio/AUM.mp3',
    high_energy: 'audio/HREEM.mp3'
};

// ── DOM ELEMENTS (Declared First to prevent TDZ Errors) ──────────────────────
const configScreen = document.getElementById('config-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const meditationScreen = document.getElementById('meditation-screen');
const breathingScreen = document.getElementById('breathing-screen');

const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');
const testVoiceBtn = document.getElementById('test-voice');
const saveConfigBtn = document.getElementById('save-config');
const timeSlider = document.getElementById('time-per-chakra');
const timeDisplay = document.getElementById('time-display');
const startMeditationBtn = document.getElementById('start-meditation');
const openSettingsBtn = document.getElementById('open-settings');

// Audio Engine
class SeamlessLoop {
    constructor(ctx, buffer, destination, targetGain = 1.0, crossfadeDuration = 5) {
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
            // Increased to 2.0s for a more organic volume transition
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
        this.binauralNodes = []; // New: Binaural Beat Layer
        this.masterGain = null;
        this.reverbNode = null;
        this.reverbWet = null; // New: Reverb Swell control
        this.pannerNode = null;
        this.isInitialized = false;

        // Looping Managers
        this.mantraLoop = null;
        this.bgMusicLoop = null;

        this.mantraBuffer = {};
        this.bgMusicBuffer = null;

        // Studio Mastering Nodes
        this.masterCompressor = null;
        this.presenceFilter = null;
        this.lowCutFilter = null;
        this.mantraPresenceLFO = null; // New: Organic Mantra Motion
    }

    async init() {
        if (this.isInitialized) {
            if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
            return;
        }
        
        // Upgrade 1: Optimize context for playback fidelity rather than low latency
        this.ctx = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'playback',
            sampleRate: 48000
        });

        // Crucial for mobile: Resume context on user gesture
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 

        // Upgrade 2: Studio Harmonic Exciter (WaveShaper)
        this.exciter = this.ctx.createWaveShaper();
        this.exciter.curve = this.makeDistortionCurve(0.05); 
        
        // Upgrade 4: Frequency Carving Filter (The 'International' Mix Secret)
        // This 'carves' a space for the voice so it sounds crystal clear
        this.voiceCarveFilter = this.ctx.createBiquadFilter();
        this.voiceCarveFilter.type = 'peaking';
        this.voiceCarveFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);
        this.voiceCarveFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
        this.voiceCarveFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.presenceFilter = this.ctx.createBiquadFilter();
        this.presenceFilter.type = 'highshelf';
        this.presenceFilter.frequency.setValueAtTime(10000, this.ctx.currentTime);
        this.presenceFilter.gain.setValueAtTime(-1, this.ctx.currentTime); // Removed the 'edge'

        this.lowCutFilter = this.ctx.createBiquadFilter();
        this.lowCutFilter.type = 'highpass';
        this.lowCutFilter.frequency.setValueAtTime(95, this.ctx.currentTime); // Deeper warmth
        this.lowCutFilter.Q.setValueAtTime(0.4, this.ctx.currentTime);

        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-26, this.ctx.currentTime); 
        this.masterCompressor.knee.setValueAtTime(35, this.ctx.currentTime); 
        this.masterCompressor.ratio.setValueAtTime(2.5, this.ctx.currentTime); // Smoother compression
        this.masterCompressor.attack.setValueAtTime(0.005, this.ctx.currentTime); 
        this.masterCompressor.release.setValueAtTime(0.35, this.ctx.currentTime);

        this.bgMusicGain = this.ctx.createGain();
        this.bgMusicGain.gain.value = 0;
        
        this.bgMusicEQ = this.ctx.createBiquadFilter();
        this.bgMusicEQ.type = 'peaking';
        this.bgMusicEQ.frequency.setValueAtTime(2500, this.ctx.currentTime); 
        this.bgMusicEQ.Q.setValueAtTime(1, this.ctx.currentTime);
        this.bgMusicEQ.gain.setValueAtTime(0, this.ctx.currentTime); 

        this.bgMusicGain.connect(this.bgMusicEQ);
        this.bgMusicEQ.connect(this.lowCutFilter);

        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.ctx.destination);

        // Upgrade 3: High-Resolution 3D Panning (HRTF)
        // Replaces simple StereoPanner with a 3D soundstage
        this.pannerNode = this.ctx.createPanner();
        this.pannerNode.panningModel = 'HRTF';
        this.pannerNode.distanceModel = 'exponential';
        
        // Slow orbital motion
        const pannerLfoX = this.ctx.createOscillator();
        const pannerLfoZ = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 5; // Orbit radius

        pannerLfoX.frequency.setValueAtTime(0.04, this.ctx.currentTime);
        pannerLfoZ.frequency.setValueAtTime(0.04, this.ctx.currentTime);
        
        // Phase shift for circular motion
        pannerLfoX.connect(lfoGain);
        lfoGain.connect(this.pannerNode.positionX);
        
        pannerLfoX.start();
        pannerLfoZ.start();

        // Upgrade 5: High-Efficiency Algorithmic Reverb (CPU/Heat Fix)
        // Replaces power-hungry Convolver with shimmering studio algorithmic reverb
        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = 0.45; // Lush divine aura
        this.reverbWet = this.reverbGain; // Map wet control to gain node
        
        this.reverbFilter = this.ctx.createBiquadFilter();
        this.reverbFilter.type = 'lowpass';
        this.reverbFilter.frequency.setValueAtTime(2600, this.ctx.currentTime); // Darker, smoother reverb

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.65;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.55; // Deeper feedback trails

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);

        this.masterGain.connect(this.delayNode);
        this.masterGain.connect(this.pannerNode);
        this.delayNode.connect(this.pannerNode);
        
        this.pannerNode.connect(this.lowCutFilter);
        
        // Final Studio Chain: Sidechain -> Exciter -> Presence -> Master Compressor
        this.lowCutFilter.connect(this.voiceCarveFilter);
        this.voiceCarveFilter.connect(this.exciter);
        
        // Reverb Routing (Parallel)
        this.exciter.connect(this.reverbGain);
        this.reverbGain.connect(this.reverbFilter);
        this.reverbFilter.connect(this.presenceFilter);
        
        this.exciter.connect(this.presenceFilter); // Dry signal
        
        this.presenceFilter.connect(this.masterCompressor);
        this.masterCompressor.connect(this.ctx.destination);

        this.mantraGain = this.ctx.createGain();
        this.mantraGain.gain.value = 0;
        
        this.mantraFilter = this.ctx.createBiquadFilter();
        this.mantraFilter.type = 'lowpass';
        this.mantraFilter.frequency.setValueAtTime(3600, this.ctx.currentTime); // "Cools" the mantra edge
        this.mantraGain.connect(this.mantraFilter);
        this.mantraFilter.connect(this.lowCutFilter);

        this.isInitialized = true;
    }

    makeDistortionCurve(amount) {
        const k = amount * 100;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    createImpulseResponse(duration, decay) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.ctx.createBuffer(2, length, sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Organic studio decay: Combining noise with a subtle sine-sweep feeling
                const envelope = Math.pow(1 - i / length, decay);
                data[i] = (Math.random() * 2 - 1) * envelope;
            }
        }
        return buffer;
    }

    createNoiseBuffer() {
        if (this._cachedNoise) return this._cachedNoise;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this._cachedNoise = buffer;
        return buffer;
    }

    startElementalLayer(index) {
        this.elementalNodes.forEach(n => {
            try { n.lfo.stop(); } catch(e) {}
            try { n.src.stop(); } catch(e) {}
        });
        this.elementalNodes = [];

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = this.createNoiseBuffer();
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 5);

        // New: Dynamic Breeze Modulation
        const breezeLfo = this.ctx.createOscillator();
        breezeLfo.type = 'sine';
        breezeLfo.frequency.setValueAtTime(0.03 + (Math.random() * 0.02), this.ctx.currentTime); // Natural variance

        const breezeGainMod = this.ctx.createGain();
        breezeGainMod.gain.setValueAtTime(0.006, this.ctx.currentTime); // Subtle volume "waft"
        
        const breezeFreqMod = this.ctx.createGain();
        // High chakras (Air/Ether) get wider, breezier frequency shifts
        breezeFreqMod.gain.setValueAtTime(index > 3 ? 1500 : 500, this.ctx.currentTime); 

        breezeLfo.connect(breezeGainMod);
        breezeGainMod.connect(gain.gain);
        
        breezeLfo.connect(breezeFreqMod);
        breezeFreqMod.connect(filter.frequency);
        breezeLfo.start();

        if (index === 0 || index === 1) {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(index === 0 ? 100 : 300, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.2, this.ctx.currentTime);
        } else if (index === 2 || index === 3) {
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(index === 2 ? 800 : 1500, this.ctx.currentTime);
            filter.Q.setValueAtTime(2.0, this.ctx.currentTime); 
        } else {
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(4000 + (index * 400), this.ctx.currentTime);
            filter.Q.setValueAtTime(0.5, this.ctx.currentTime);
        }

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noiseSrc.start();
        
        this.elementalNodes.push({ src: noiseSrc, gain: gain, lfo: breezeLfo });
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

        // New: Binaural Beat Layer (Deep Alpha/Theta)
        const leftOsc = this.ctx.createOscillator();
        const rightOsc = this.ctx.createOscillator();
        const leftPanner = this.ctx.createStereoPanner();
        const rightPanner = this.ctx.createStereoPanner();
        const binauralGain = this.ctx.createGain();

        leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);
        rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);
        
        // 7.83Hz Schumann Resonance offset
        leftOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        rightOsc.frequency.setValueAtTime(baseFreq + 7.83, this.ctx.currentTime);
        
        binauralGain.gain.setValueAtTime(0, this.ctx.currentTime);
        binauralGain.gain.linearRampToValueAtTime(0.008, this.ctx.currentTime + 10); // Subtle, crisp layer

        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);
        leftPanner.connect(binauralGain);
        rightPanner.connect(binauralGain);
        // Connect to masterGain so it ducks during mantra and respects drone volume
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
                } else {
                    node.stop(now + 5); 
                }
            } catch(e) {}
        });
        this.binauralNodes = [];
    }

    stopDrone() {
        this.stopBinaural();
        const now = this.ctx.currentTime;
        
        // Reset reverb wetness during stop to clear any active swells
        if (this.reverbWet) {
            this.reverbWet.gain.cancelScheduledValues(now);
            this.reverbWet.gain.setValueAtTime(this.reverbWet.gain.value, now);
            this.reverbWet.gain.linearRampToValueAtTime(0.3, now + 4);
        }

        if (this.vibrationLFO) {
            try { this.vibrationLFO.stop(now + 5); } catch(e) {}
            this.vibrationLFO = null;
        }
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
        const filePath = MANTRA_AUDIO_MAP[key];
        if (!filePath) return;

        this.stopMantraTrack();

        if (!this.mantraBuffer[key]) {
            const response = await fetch(filePath);
            const arrayBuffer = await response.arrayBuffer();
            this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);
        }

        // Standardized to 5.0s crossfade
        this.mantraLoop = new SeamlessLoop(this.ctx, this.mantraBuffer[key], this.mantraGain, 0, 5.0);
        this.mantraLoop.start();

        // New: Organic Mantra Motion (LFO Presence) - Reduced for cleaner audio
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // Slower, deeper motion
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // Softer modulation
        lfo.connect(lfoGain);
        lfoGain.connect(this.mantraFilter.frequency);
        lfo.start();
        this.mantraPresenceLFO = lfo;

        const now = this.ctx.currentTime;
        this.mantraGain.gain.cancelScheduledValues(now);
        this.mantraGain.gain.setValueAtTime(0, now);
        // Ghostly 10s fade-in for maximum relaxation
        this.mantraGain.gain.linearRampToValueAtTime(state.volMantra, now + 10);
        this.mantraLoop.setGain(state.volMantra);

        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            // Deeper ducking (to 15%) to create a "cradle" for the voice
            this.masterGain.gain.linearRampToValueAtTime(state.volDrone * 0.15, now + 8);
        }

        // Deep spectral carving on BG music when mantra is active
        if (this.bgMusicEQ) {
            this.bgMusicEQ.gain.cancelScheduledValues(now);
            this.bgMusicEQ.gain.linearRampToValueAtTime(-12, now + 8); // Hollow out space
        }

        // Explicitly fade out any elemental noise during mantra
        this.elementalNodes.forEach(({ gain }) => {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
        });
    }

    stopMantraTrack() {
        if (!this.mantraLoop) return;
        const now = this.ctx.currentTime;

        if (this.mantraPresenceLFO) {
            try { this.mantraPresenceLFO.stop(); } catch(e) {}
            this.mantraPresenceLFO = null;
        }

        this.mantraGain.gain.cancelScheduledValues(now);
        this.mantraGain.gain.setValueAtTime(this.mantraGain.gain.value, now);
        this.mantraGain.gain.linearRampToValueAtTime(0, now + 8); // Gentler exit

        if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(state.volDrone, now + 6);
        }

        if (this.bgMusicEQ) {
            this.bgMusicEQ.gain.cancelScheduledValues(now);
            this.bgMusicEQ.gain.linearRampToValueAtTime(0, now + 6); // Restore spectrum
        }

        // Restore elemental layer subtly after mantra
        this.elementalNodes.forEach(({ gain }) => {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.015, now + 4);
        });

        this.mantraLoop.stop(4);
        this.mantraLoop = null;
    }

    // New: Studio Reverb Swell for Transitions
    triggerReverbSwell(duration = 4) {
        const now = this.ctx.currentTime;
        this.reverbWet.gain.cancelScheduledValues(now);
        this.reverbWet.gain.setValueAtTime(this.reverbWet.gain.value, now);
        
        // Swell up to 0.8 wetness then back down
        this.reverbWet.gain.linearRampToValueAtTime(0.8, now + (duration * 0.5));
        this.reverbWet.gain.linearRampToValueAtTime(0.3, now + duration);
    }

    async startBackgroundMusic() {
        if (!this.bgMusicBuffer) {
            const response = await fetch('audio/background_music.mp3');
            const arrayBuffer = await response.arrayBuffer();
            this.bgMusicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        }
        
        if (this.bgMusicLoop) {
            this.bgMusicLoop.stop(0);
        }

        // Standardized to 3.0s crossfade
        this.bgMusicLoop = new SeamlessLoop(this.ctx, this.bgMusicBuffer, this.bgMusicGain, 1.0, 3.0);
        this.bgMusicLoop.start();
    }

    fadeInBackgroundMusic(duration = 4, isDucked = false) {
        if (!this.bgMusicLoop) return;
        const targetVol = isDucked ? state.volMusic * 0.45 : state.volMusic;
        const targetEQ = isDucked ? -8 : 0; 
        
        const now = this.ctx.currentTime;
        // Studio Trick: We use the dedicated bgMusicGain for the volume fades
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(targetVol, now + duration); 
        
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(targetEQ, now + duration);
        
        // Ensure the loop itself is running at a base gain of 1.0 so the bgMusicGain handles the mix
        this.bgMusicLoop.setGain(1.0);
    }

    fadeOutBackgroundMusic(duration = 4) {
        if (!this.bgMusicLoop) return;
        const now = this.ctx.currentTime;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        
        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(0, now + duration);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(0, now + duration);
        
        this.bgMusicLoop.setGain(0);
    }

    stopBackgroundMusic() {
        if (this.bgMusicLoop) {
            this.bgMusicLoop.stop(2);
            this.bgMusicLoop = null;
        }
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
            gain.connect(this.bellGain); // Use dedicated bell gain
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
    }
    startPulsing(color) {
        this.glow.style.background = `radial-gradient(circle, ${color}66 0%, transparent 70%)`;
    }
    stop() {
        // No loops to stop
    }
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
        try {
            // Immediate visual feedback for mobile
            showScreen(breathingScreen);
            document.getElementById('completion-modal').classList.add('hidden');
            
            if (!this.scripts) {
                const response = await fetch('scripts.json');
                this.scripts = await response.json();
            }

            await this.audio.init();
            // Start background music looping silently immediately
            await this.audio.startBackgroundMusic();

            try { await wakeLock.request(); } catch(e) { console.warn("Wake lock failed", e); }
            
            this.isMeditationActive = true;
            this.isPaused = false;
            this.isHighEnergy = document.getElementById('high-energy-toggle').checked;
            
            document.getElementById('pause-meditation').textContent = 'II';

            // Initial Settle (2 seconds)
            if (this.isMeditationActive) await new Promise(r => setTimeout(r, 2000));

            if (this.isMeditationActive) await this.runGratitude();
            if (this.isMeditationActive) await this.runBoxBreathing();
            
            // Settle after breathing (3 seconds)
            if (this.isMeditationActive) await new Promise(r => setTimeout(r, 3000));

            if (this.isMeditationActive) {
                showScreen(meditationScreen);
                if (this.isHighEnergy) {
                    await this.meditateOnChakra(this.scripts.high_energy, 'high_energy');
                    if (this.isMeditationActive) {
                        await this.handleSilence();
                        if (this.isMeditationActive) await this.runClosing();
                        if (this.isMeditationActive) await this.runHooponopono();
                        this.finish();
                    }
                } else {
                    await this.runSequence();
                }
            }
        } catch (err) {
            console.error("Critical Start Failure:", err);
            alert("Unable to start meditation. Please ensure you have a stable connection and try again.");
            this.stop();
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

        // Moon Phase opening line
        const phase = getMoonPhase();
        const moonText = this.scripts.intro.moon[`${phase}_${state.language}`];
        if (moonText && this.isMeditationActive) {
            tutTitle.textContent = state.language === 'ml' ? "ചന്ദ്രൻ" : "Moon";
            tutText.textContent = moonText;
            await this.narrate(moonText, false); // Keep music playing
            await new Promise(r => setTimeout(r, 1000));
        }

        // Main gratitude + body scan
        if (!this.isMeditationActive) return;
        tutTitle.textContent = state.language === 'ml' ? "കൃതജ്ഞത" : "Gratitude";
        const text = this.scripts.intro[`gratitude_${state.language}`];
        tutText.textContent = text;

        if (state.intention && state.intention.trim()) {
            await this.narrate(text, false); // Still keep music playing for next part
            
            const intentionText = state.language === 'ml'
                ? `ഇന്ന് നിങ്ങൾ ക്ഷണിക്കുന്നത്: ${state.intention.trim()}. ഈ ഉദ്ദേശ്യം ഹൃദയത്തിൽ സൂക്ഷിക്കൂ — ഈ യാത്ര മുഴുവൻ അത് ഉള്ളിൽ ജ്വലിക്കട്ടെ.`
                : `You are calling in: ${state.intention.trim()}. Hold this in your heart — let it burn quietly through every moment of this journey.`;
            tutTitle.textContent = state.language === 'ml' ? "ഉദ്ദേശ്യം" : "Intention";
            tutText.textContent = intentionText;
            await this.narrate(intentionText, false); // Keep music playing seamlessly into breathing
        } else {
            await this.narrate(text, false); // No intention? Still keep music playing.
        }

        // Removed redundant pause before breathing - transition is now immediate and musical
    }

    async runBoxBreathing() {
        const screen = document.getElementById('breathing-screen');
        const tutorial = document.getElementById('breathing-tutorial');
        const instruction = document.getElementById('breathing-instruction');
        const circle = document.getElementById('breathing-circle');
        const timer = document.getElementById('breathing-timer');
        
        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = "1";

        const tutTitle = document.getElementById('tutorial-title');
        const tutText = document.getElementById('tutorial-text');
        tutTitle.textContent = state.language === 'ml' ? "തയ്യാറെടുക്കാം" : "Preparation";
        const text = state.language === 'ml' ? "സൗകര്യപ്രദമായി വിശ്രമിക്കു. ശാന്തമായി ശ്വസിച്ചു തുടങ്ങാം." : "Sit comfortably. We will start with a centering breath.";
        tutText.textContent = text;

        // Narrate the preparation instruction
        await this.narrate(text);

        for (let s = 5; s > 0; s--) {
            if (!this.isMeditationActive) return;
            await new Promise(r => setTimeout(r, 1000));
        }
        
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

        // Intimate Completion
        if (this.isMeditationActive) {
            instruction.textContent = state.language === 'ml' ? "ശ്വാസക്രിയ പൂർത്തിയായി" : "Breathing Complete";
            const completeText = state.language === 'ml' ? "ശ്വാസക്രിയ പൂർത്തിയായിരിക്കുന്നു. അല്പനേരം ശാന്തമായിരിക്കൂ." : "Breathing exercise is complete. Stay still for a moment.";
            await this.narrate(completeText);
            
            // 5 second interval before Chakra Journey starts
            instruction.textContent = state.language === 'ml' ? "തയ്യാറെടുക്കുക" : "Prepare";
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    async narrateSoft(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
            }
            utterance.rate = 0.6;   // Slow
            utterance.pitch = 0.8;  // Calm
            utterance.volume = state.volVoice * 0.4; // Soft volume
            
            let isResolved = false;
            const safetyTimeout = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    resolve();
                }
            }, (text.length * 150) + 2000);

            utterance.onend = () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(safetyTimeout);
                    resolve();
                }
            };
            utterance.onerror = () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(safetyTimeout);
                    resolve();
                }
            };
            window.speechSynthesis.speak(utterance);
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pause-meditation');
        btn.textContent = this.isPaused ? '▶' : 'II';
        
        if (this.isPaused) {
            window.speechSynthesis.pause();
            if (this.audio.ctx) this.audio.ctx.suspend();
        } else {
            window.speechSynthesis.resume();
            if (this.audio.ctx) this.audio.ctx.resume();
        }
    }

    async runSequence() {
        for (let i = 0; i < this.chakraOrder.length; i++) {
            const key = this.chakraOrder[i];
            if (!this.isMeditationActive) break;
            await this.meditateOnChakra(this.scripts[key], key);
            if (i < this.chakraOrder.length - 1 && this.isMeditationActive) await this.handleInterval();
        }
        if (this.isMeditationActive) { await this.handleSilence(); }
        if (this.isMeditationActive) { await this.runClosing(); }
        if (this.isMeditationActive) { await this.runHooponopono(); }
        if (this.isMeditationActive) { this.finish(); }
    }

    async runClosing() {
        document.getElementById('mantra-display').textContent = "✦";
        document.getElementById('chakra-symbol').style.opacity = "0.4";
        const aura = document.getElementById('aura-bg');
        aura.style.background = `radial-gradient(circle at center, #8B00FF22, transparent)`;
        const closingText = this.scripts.closing[state.language];
        await this.narrate(closingText);
        await new Promise(r => setTimeout(r, 2000));
        // Full-body health affirmation — head to toe
        const healthAffirmation = this.scripts.closing[`affirmation_${state.language}`];
        if (healthAffirmation && this.isMeditationActive) {
            document.getElementById('mantra-display').textContent = "✦ BODY ✦";
            await this.narrate(healthAffirmation);
        }
        await new Promise(r => setTimeout(r, 3000));
    }

    async runHooponopono() {
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(circle at center, #fff9c455, transparent)';
        aura.style.opacity = '1';
        document.getElementById('chakra-symbol').style.opacity = '0.1';
        document.getElementById('mantra-display').textContent = '✦';
        document.getElementById('narration-text').textContent = '';

        // Intro: "Repeat each phrase gently in your heart" - Keep music playing
        await this.narrate(this.scripts.hooponopono.intro[state.language], false);
        await new Promise(r => setTimeout(r, 2000));

        // 3 cycles of the 4 phrases
        const phrases = this.scripts.hooponopono.phrases[state.language];
        for (let cycle = 0; cycle < 3; cycle++) {
            if (!this.isMeditationActive) return;
            for (let i = 0; i < phrases.length; i++) {
                if (!this.isMeditationActive) return;
                const phrase = phrases[i];
                document.getElementById('narration-text').textContent = phrase;
                
                // Keep music for all phrases, fade out only on the very last phrase of the last cycle
                const isLast = (cycle === 2 && i === phrases.length - 1);
                await this.narrate(phrase, false); // Keep music for phrases
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        // Closing breath - Final fade out
        document.getElementById('narration-text').textContent = '';
        await this.narrate(this.scripts.hooponopono.closing[state.language], true);

        // Extended rest (8 seconds) to allow the "Divine Aura" and background music 
        // to fade out completely into a peaceful silence.
        await new Promise(r => setTimeout(r, 8000));
        this.finish();

    async handleInterval() {
        this.audio.stopDrone();
        const timerEl = document.getElementById('timer-display');
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
                const secs = Math.ceil(remaining / 1000);
                timerEl.textContent = `00:${secs.toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    async meditateOnChakra(chakra, key) {
        if (!this.isMeditationActive) return;
        const symbolEl = document.getElementById('chakra-symbol');
        symbolEl.style.opacity = '';   // clear any inline opacity
        symbolEl.classList.remove('cosmic-entrance');
        // Force reflow to restart animation
        void symbolEl.offsetWidth;
        symbolEl.classList.add('cosmic-entrance');
        setTimeout(() => symbolEl.classList.remove('cosmic-entrance'), 1200);
        symbolEl.src = chakra.symbol;
        symbolEl.style.opacity = "1";
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
        const index = this.chakraOrder.indexOf(key);

        if (key === 'thirdeye') {
            this.audio.stopDrone();
        } else {
            this.audio.startDrone(chakra.frequency, index);
        }

        this.visual.startPulsing(chakra.color);
        await this.narrate(chakra[state.language]);
        if (!this.isMeditationActive) return;

        // Start looping mantra audio track (fades in, drone fades down)
        await this.audio.playMantraTrack(key);

        const chantDurationMs = (state.timePerChakra * 60 * 1000) - 15000;
        let elapsed = 0;
        const timerEl = document.getElementById('timer-display');

        while (elapsed < chantDurationMs) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                const remaining = Math.max(0, chantDurationMs - elapsed);
                const mins = Math.floor(remaining / 60000);
                const secs = Math.floor((remaining % 60000) / 1000);
                timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        timerEl.textContent = "00:00";

        // Fade out mantra, restore drone before affirmation
        this.audio.stopMantraTrack();
        if (key === 'thirdeye') {
            // Restore drone for Ajna affirmation
            this.audio.startDrone(chakra.frequency, index);
            await new Promise(r => setTimeout(r, 2000));
        } else {
            await new Promise(r => setTimeout(r, 4000));
        }

        if (this.isMeditationActive) await this.narrate(chakra[`affirmation_${state.language}`]);
    }

    async narrateFeeble(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            utterance.rate = 0.72; 
            utterance.pitch = 0.82; 
            utterance.volume = state.volVoice * 0.6;
            
            let isResolved = false;
            const safetyTimeout = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    resolve();
                }
            }, (text.length * 150) + 2000);

            utterance.onend = () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(safetyTimeout);
                    resolve();
                }
            };
            utterance.onerror = () => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(safetyTimeout);
                    resolve();
                }
            };
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrate(text, fadeOut = false) {
        if (!window.speechSynthesis) return;

        // Cancel any queued speech to prevent buildup on mobile
        window.speechSynthesis.cancel();

        // Wait for voices if they haven't loaded yet (mobile browsers load asynchronously)
        let voiceWait = 0;
        while (state.voices.length === 0 && voiceWait < 20) {
            await new Promise(r => setTimeout(r, 100));
            state.voices = window.speechSynthesis.getVoices();
            voiceWait++;
        }
        if (!state.voiceName && state.voices.length > 0) autoSelectVoice();

        // Ensure background music is active at ducked level
        this.audio.fadeInBackgroundMusic(4, true);

        // Studio Timing: 1.2 second gap gives music time to 'duck' but keeps momentum
        await new Promise(r => setTimeout(r, 1200));

        // Activate Frequency Carving (-8dB notch at 2.5kHz) to 'seat' the voice in the mix
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

                // Studio Clarity
                utterance.rate   = state.sleepMode ? 0.60 : 0.72;
                utterance.pitch  = state.sleepMode ? 0.75 : 0.88;
                utterance.volume = state.sleepMode ? state.volVoice * 0.55 : state.volVoice;
                
                // SAFETY: Browser Bug Fix
                // Chrome/Brave sometimes fails to fire 'onend'. 
                // We add a timeout as a fallback so the app never hangs.
                let isResolved = false;
                const safetyTimeout = setTimeout(() => {
                    if (!isResolved) {
                        isResolved = true;
                        resolve();
                    }
                }, (sentence.length * 150) + 2000); // 150ms per char + 2s buffer

                utterance.onend = () => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(safetyTimeout);
                        resolve();
                    }
                };
                utterance.onerror = () => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(safetyTimeout);
                        resolve();
                    }
                };
                window.speechSynthesis.speak(utterance);
            });

            await new Promise(r => setTimeout(r, state.sleepMode ? 2000 : 1500));
        }

        // Release Frequency Carving after narration ends
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(0, this.audio.ctx.currentTime + 3);
        }

        if (fadeOut) {            // Only fade out if explicitly requested (e.g. right before mantra)
            await new Promise(r => setTimeout(r, 2500));
            this.audio.triggerReverbSwell(5);
            this.audio.fadeOutBackgroundMusic(4);
        }
    }

    // Subliminal whisper — plays affirmation at ~5% volume under the mantra drone
    narrateSubliminal(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = state.voices.find(v => v.name === state.voiceName);
        if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
        utterance.rate   = state.sleepMode ? 0.45 : 0.55;
        utterance.pitch  = state.sleepMode ? 0.65 : 0.75;
        utterance.volume = state.volVoice * 0.05;
        window.speechSynthesis.speak(utterance);
    }

    async handleSilence() {
        this.visual.stop();
        document.getElementById('mantra-display').textContent = "SILENCE";
        document.getElementById('chakra-symbol').style.opacity = "0.2";
        this.audio.stopDrone();
        let elapsed = 0;
        const silenceTime = 60000;
        const timerEl = document.getElementById('timer-display');
        while (elapsed < silenceTime) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                const remaining = silenceTime - elapsed;
                const secs = Math.ceil(remaining / 1000);
                timerEl.textContent = `00:${secs.toString().padStart(2, '0')}`;
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    finish() {
        this.isMeditationActive = false; 
        this.visual.stop(); 
        this.audio.stopDrone(); 
        this.audio.stopMantraTrack(); 
        this.audio.fadeOutBackgroundMusic(6); // Final long 6s fade out
        setTimeout(() => this.audio.stopBackgroundMusic(), 6500);
        wakeLock.release();
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        this.audio.playSingingBowl();
        state.stats.journeys += 1; state.stats.time += Math.round((state.timePerChakra * this.chakraOrder.length) + 1);
        localStorage.setItem('chakra_stats_journeys', state.stats.journeys);
        localStorage.setItem('chakra_stats_time', state.stats.time);
        document.getElementById('stat-journeys').textContent = state.stats.journeys;
        document.getElementById('stat-time').textContent = state.stats.time;
        document.getElementById('stat-session-time').textContent =
            Math.round(state.stats.time) + ' mins';
        document.getElementById('stat-total-journeys').textContent =
            state.stats.journeys;
        // Lift sleep mode dimming once session ends
        document.body.classList.remove('sleep-mode-active');

        const modal = document.getElementById('completion-modal');
        const title = document.getElementById('completion-title');
        const msg = document.getElementById('completion-message');
        const btn = document.getElementById('close-completion');
        title.textContent = state.language === 'ml' ? "യാത്ര പൂർത്തിയായി" : "Journey Complete";
        msg.textContent = state.language === 'ml' ? "ധ്യാനം പൂർത്തിയായി. അനുഗ്രഹിക്കപ്പെടട്ടെ." : "Meditation Completed. Stay Blessed.";
        btn.textContent = state.language === 'ml' ? "തിരികെ പോവുക" : "Return to Room";

        // Journal: reset textarea, show last entry date, localise prompt
        document.getElementById('journal-entry').value = '';
        document.getElementById('journal-prompt').textContent = state.language === 'ml'
            ? 'എന്ത് മാറി? ഇന്ന് നിങ്ങൾ എന്ത് ക്ഷണിക്കുന്നു?'
            : 'What shifted? What are you calling in?';
        document.getElementById('save-journal').textContent = state.language === 'ml' ? 'സൂക്ഷിക്കൂ' : 'Save Entry';
        const journalEntries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        const lastInfo = document.getElementById('last-journal-info');
        lastInfo.textContent = journalEntries.length > 0
            ? (state.language === 'ml' ? 'അവസാന നമ്പർ: ' : 'Last entry: ') + journalEntries[0].date
            : '';

        modal.classList.remove('hidden');
    }

    stop() {
        this.isMeditationActive = false; this.audio.stopDrone(); this.audio.stopMantraTrack(); this.audio.stopBackgroundMusic(); this.visual.stop(); wakeLock.release();
        window.speechSynthesis.cancel();
        document.body.classList.remove('sleep-mode-active');
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        showScreen(lobbyScreen);
    }
}

// Wake Lock Manager
class WakeLockManager {
    constructor() { this.wakeLock = null; }
    async request() {
        if ('wakeLock' in navigator) {
            try { this.wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
        }
    }
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
    volMantra: parseFloat(localStorage.getItem('chakra_vol_mantra')) || 0.35,
    volMusic: parseFloat(localStorage.getItem('chakra_vol_music')) || 0.30,
    stats: {
        journeys: parseInt(localStorage.getItem('chakra_stats_journeys')) || 0,
        time: parseInt(localStorage.getItem('chakra_stats_time')) || 0
    },
    selectedChakras: JSON.parse(localStorage.getItem('chakra_selected')) || ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'],
    intention: localStorage.getItem('chakra_intention') || '',
    sleepMode: localStorage.getItem('chakra_sleep_mode') === 'true'
};

// ── Moon Phase Calculator ─────────────────────────────────────────────────────
function getMoonPhase() {
    const knownNewMoon = new Date('2025-01-29T12:35:00Z');
    const lunarCycle  = 29.53058770576;
    const daysSince   = (Date.now() - knownNewMoon.getTime()) / 86400000;
    const pos         = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;
    if (pos < 7.38)  return 'new';
    if (pos < 14.77) return 'waxing';
    if (pos < 22.15) return 'full';
    return 'waning';
}

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
    // Wake up the speech engine immediately (critical for mobile Chrome/Brave/Safari)
    if ('speechSynthesis' in window) {
        try {
            const dummy = new SpeechSynthesisUtterance('');
            dummy.volume = 0;
            window.speechSynthesis.speak(dummy);
        } catch(e) { /* silently ignore — some browsers block speak() before user interaction */ }
    }

    const loadVoices = () => {
        state.voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';

        if (state.voices.length === 0) {
            // Fallback: show System Default so the dropdown is never stuck and voiceName gets a value
            const option = document.createElement('option');
            option.value = 'Default';
            option.textContent = 'System Default Voice';
            voiceSelect.appendChild(option);
            if (!state.voiceName) { state.voiceName = 'Default'; voiceSelect.value = 'Default'; }
            return false;
        }
        state.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.name === state.voiceName) option.selected = true;
            voiceSelect.appendChild(option);
        });
        if (!state.voiceName) autoSelectVoice();
        return true;
    };

    // Strategy 1: standard event
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Strategy 2: immediate attempt, then poll (critical for iOS Safari)
    if (!loadVoices()) {
        let attempts = 0;
        const poll = setInterval(() => {
            const success = loadVoices();
            attempts++;
            if (success || attempts > 30) {
                clearInterval(poll);
                if (!success && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    // iOS requires a user gesture before voices become available
                    const voiceStatus = document.getElementById('voice-status');
                    if (voiceStatus) {
                        voiceStatus.textContent = 'Tap anywhere to enable voice';
                        voiceStatus.style.display = 'block';
                    }
                    document.body.addEventListener('touchstart', function enableVoice() {
                        const dummy = new SpeechSynthesisUtterance('');
                        window.speechSynthesis.speak(dummy);
                        window.speechSynthesis.cancel();
                        loadVoices();
                        document.body.removeEventListener('touchstart', enableVoice);
                        const voiceStatus = document.getElementById('voice-status');
                        if (voiceStatus) voiceStatus.style.display = 'none';
                    }, { once: true });
                }
            }
        }, 200);
    }

    // Strategy 3: pre-warm speech synthesis on first user interaction
    const warmup = () => {
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
        window.speechSynthesis.cancel();
        loadVoices();
        document.removeEventListener('click', warmup);
        document.removeEventListener('touchstart', warmup);
    };
    document.addEventListener('click', warmup);
    document.addEventListener('touchstart', warmup);
}

function autoSelectVoice() {
    let bestVoice = null;
    const premiumKeywords = ['premium', 'neural', 'natural', 'enhanced'];
    
    const findBestInList = (list) => {
        // First try premium voices
        let premium = list.find(v => premiumKeywords.some(kw => v.name.toLowerCase().includes(kw)));
        if (premium) return premium;
        // Then return the first in the list
        return list[0];
    };

    if (state.language === 'ml') {
        const mlVoices = state.voices.filter(v => v.lang.startsWith('ml'));
        if (mlVoices.length > 0) {
            bestVoice = findBestInList(mlVoices);
        } else {
            bestVoice = state.voices.find(v => v.name.toLowerCase().includes('malayalam'));
        }
    } else {
        const enVoices = state.voices.filter(v => v.lang.startsWith('en'));
        if (enVoices.length > 0) {
            bestVoice = findBestInList(enVoices);
        }
    }
    
    if (bestVoice) {
        state.voiceName = bestVoice.name;
        voiceSelect.value = bestVoice.name;
    }
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
    
    // Sync Mixer Sliders
    document.getElementById('vol-voice').value = state.volVoice;
    document.getElementById('vol-drone').value = state.volDrone;
    document.getElementById('vol-bell').value = state.volBell;
    document.getElementById('vol-mantra').value = state.volMantra;
    document.getElementById('vol-music').value = state.volMusic;

    // Sync Settings Sliders
    document.getElementById('settings-vol-voice').value = state.volVoice;
    document.getElementById('settings-vol-drone').value = state.volDrone;
    document.getElementById('settings-vol-bell').value = state.volBell;
    document.getElementById('settings-vol-mantra').value = state.volMantra;
    document.getElementById('settings-vol-music').value = state.volMusic;

    document.getElementById('stat-journeys').textContent = state.stats.journeys;
    document.getElementById('stat-time').textContent = state.stats.time;
    document.querySelectorAll('#chakra-selection input').forEach(cb => {
        cb.checked = state.selectedChakras.includes(cb.value);
    });
    document.getElementById('intention-input').value = state.intention;
    document.getElementById('sleep-mode-toggle').checked = state.sleepMode;
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
        // Accounts for chanting + narration overhead (~2 min/chakra) + fixed overhead + hooponopono (~2 min)
        // Normal: measured 31 min for 1.0 min × 7 chakras (without hooponopono) → 7 × (1.0 + 2) + 12 ≈ 33
        // High energy: single chakra + gratitude/breathing/silence + hooponopono, no intervals or closing
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
        // Apply sleep mode dim class at session start
        if (state.sleepMode) document.body.classList.add('sleep-mode-active');
        meditation.start();
    });
    document.getElementById('pause-meditation').addEventListener('click', () => meditation.togglePause());
    document.getElementById('stop-meditation').addEventListener('click', () => meditation.stop());
    document.getElementById('close-completion').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
        showScreen(lobbyScreen);
    });

    // Intention input
    document.getElementById('intention-input').addEventListener('input', (e) => {
        state.intention = e.target.value;
        localStorage.setItem('chakra_intention', state.intention);
    });

    // Sleep mode toggle
    document.getElementById('sleep-mode-toggle').addEventListener('change', (e) => {
        state.sleepMode = e.target.checked;
        localStorage.setItem('chakra_sleep_mode', state.sleepMode);
    });

    // Journal save
    document.getElementById('save-journal').addEventListener('click', () => {
        const entry = document.getElementById('journal-entry').value.trim();
        if (!entry) return;
        const entries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        entries.unshift({ date: new Date().toLocaleDateString(), text: entry });
        localStorage.setItem('chakra_journal', JSON.stringify(entries.slice(0, 50)));
        document.getElementById('journal-entry').value = '';
        const info = document.getElementById('last-journal-info');
        info.textContent = state.language === 'ml' ? '✓ സൂക്ഷിച്ചു' : '✓ Saved';
        setTimeout(() => {
            const saved = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
            info.textContent = saved.length > 0
                ? (state.language === 'ml' ? 'അവസാന നമ്പർ: ' : 'Last entry: ') + saved[0].date
                : '';
        }, 2000);
    });
    const mixer = document.getElementById('volume-mixer');
    document.getElementById('btn-mixer').addEventListener('click', () => mixer.classList.toggle('hidden'));
    document.getElementById('close-mixer').addEventListener('click', () => mixer.classList.add('hidden'));
    // Unified Volume Handlers
    const syncVolume = (key, value, elements) => {
        state[key] = parseFloat(value);
        localStorage.setItem(`chakra_${key.replace('vol', 'vol_').toLowerCase()}`, state[key]);
        elements.forEach(el => { if (el) el.value = value; });
    };

    // Voice
    const volVoiceEls = [document.getElementById('vol-voice'), document.getElementById('settings-vol-voice')];
    volVoiceEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volVoice', e.target.value, volVoiceEls);
    }));

    // Drone
    const volDroneEls = [document.getElementById('vol-drone'), document.getElementById('settings-vol-drone')];
    volDroneEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volDrone', e.target.value, volDroneEls);
        if (audio.masterGain) audio.masterGain.gain.setValueAtTime(state.volDrone, audio.ctx.currentTime);
    }));

    // Bell
    const volBellEls = [document.getElementById('vol-bell'), document.getElementById('settings-vol-bell')];
    volBellEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volBell', e.target.value, volBellEls);
        if (audio.bellGain) audio.bellGain.gain.setValueAtTime(state.volBell, audio.ctx.currentTime);
    }));

    // Mantra
    const volMantraEls = [document.getElementById('vol-mantra'), document.getElementById('settings-vol-mantra')];
    volMantraEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volMantra', e.target.value, volMantraEls);
        if (audio.mantraGain && audio.mantraLoop) {
            audio.mantraGain.gain.setValueAtTime(state.volMantra, audio.ctx.currentTime);
        }
    }));

    // Music
    const volMusicEls = [document.getElementById('vol-music'), document.getElementById('settings-vol-music')];
    volMusicEls.forEach(el => el.addEventListener('input', (e) => {
        syncVolume('volMusic', e.target.value, volMusicEls);
        if (audio.bgMusicGain && audio.bgMusicLoop) {
            // Note: fadeIn/fadeOut and ducking logic will use the new state.volMusic on their next trigger
            // For immediate feedback during play:
            audio.bgMusicGain.gain.setValueAtTime(state.volMusic, audio.ctx.currentTime);
        }
    }));
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Chakra Meditation', artist: 'Mahakatha Vibe',
            artwork: [
                { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', () => { if (meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('pause', () => { if (!meditation.isPaused) meditation.togglePause(); });
        navigator.mediaSession.setActionHandler('stop', () => meditation.stop());
    }
    document.querySelectorAll('#chakra-selection input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            cb.closest('.checkbox-label').classList.toggle('chip-active', cb.checked);
        });
        // Set initial state
        if (cb.checked) cb.closest('.checkbox-label').classList.add('chip-active');
    });

    // Initial estimate on load
    updateSessionEstimate();
}

init();
