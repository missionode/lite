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
const icebreakerScreen = document.getElementById('icebreaker-screen');
const icebreakerTimer = document.getElementById('icebreaker-timer');

const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');
const testVoiceBtn = document.getElementById('test-voice');
const saveConfigBtn = document.getElementById('save-config');
const timeSlider = document.getElementById('time-per-chakra');
const timeDisplay = document.getElementById('time-display');
const startMeditationBtn = document.getElementById('start-meditation');
const openSettingsBtn = document.getElementById('open-settings');

// ── UTILS (Defensive Element Access) ──────────────────────────────────────────
const getChecked = (id) => {
    const el = document.getElementById(id);
    return el ? el.checked : false;
};
const syncChecked = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = val;
};
const syncValue = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
};
const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
};

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
        this.reverbWet = null; // New: Reverb Swell control
        this.pannerNode = null;
        this.isInitialized = false;

        // Looping Managers
        this.mantraLoop = null;
        this.bgMusicLoop = null;

        this.mantraBuffer = {};
        this.bgMusicBuffer = null;

        // Permanent Absolute Grounding Anchor (Closed Eyes Mode)
        this.groundingAnchor = null;

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
        
        // Upgrade 1: Optimize context for playback fidelity
        this.ctx = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'playback',
            sampleRate: 44100
        });

        // Crucial for mobile: Resume context on user gesture
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 

        // Upgrade 2: Studio Harmonic Exciter (Soft Clipper)
        // Only enabled in 'Open' mode for crispness. Disabled in 'Closed' for warmth.
        this.exciter = this.ctx.createWaveShaper();
        if (!state.eyesCloseMode) {
            this.exciter.curve = this.makeDistortionCurve(0.002); 
        } else {
            // Straight line curve = no distortion
            this.exciter.curve = new Float32Array([-1, 1]);
        }
        
        // Upgrade 4: Frequency Carving Filter
        if (state.audioFilters) {
            this.voiceCarveFilter = this.ctx.createBiquadFilter();
            this.voiceCarveFilter.type = 'peaking';
            this.voiceCarveFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);
            this.voiceCarveFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
            this.voiceCarveFilter.gain.setValueAtTime(0, this.ctx.currentTime);

            this.presenceFilter = this.ctx.createBiquadFilter();
            this.presenceFilter.type = 'highshelf';
            this.presenceFilter.frequency.setValueAtTime(4000, this.ctx.currentTime);
            this.presenceFilter.gain.setValueAtTime(state.eyesCloseMode ? -6 : -3, this.ctx.currentTime);
        }

        this.lowCutFilter = this.ctx.createBiquadFilter();
        this.lowCutFilter.type = 'highpass';
        // Grounding: Allow deeper frequencies in Closed mode (40Hz vs 80Hz)
        this.lowCutFilter.frequency.setValueAtTime(state.eyesCloseMode ? 40 : 80, this.ctx.currentTime);
        this.lowCutFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

        // Eyes Close Mode Filter
        this.eyesCloseFilter = this.ctx.createBiquadFilter();
        this.eyesCloseFilter.type = 'lowpass';
        this.eyesCloseFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
        this.eyesCloseFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
        this.eyesCloseFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-24, this.ctx.currentTime); 
        this.masterCompressor.knee.setValueAtTime(30, this.ctx.currentTime); 
        this.masterCompressor.ratio.setValueAtTime(3.0, this.ctx.currentTime); 
        this.masterCompressor.attack.setValueAtTime(0.01, this.ctx.currentTime); 
        this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        this.bgMusicGain = this.ctx.createGain();
        this.bgMusicGain.gain.value = 0;
        
        // Deep Spectrum Carving
        this.bgMusicEQ = this.ctx.createBiquadFilter();
        this.bgMusicEQ.type = 'notch';
        this.bgMusicEQ.frequency.setValueAtTime(2500, this.ctx.currentTime); 
        this.bgMusicEQ.Q.setValueAtTime(1.5, this.ctx.currentTime);

        this.bgMusicLPF = this.ctx.createBiquadFilter();
        this.bgMusicLPF.type = 'lowpass';
        this.bgMusicLPF.frequency.setValueAtTime(state.audioFilters ? 1200 : 20000, this.ctx.currentTime);

        // Anti-Hum Filter: Targets the resonant "drone/hum" frequency
        this.bgMusicHumFilter = this.ctx.createBiquadFilter();
        this.bgMusicHumFilter.type = 'peaking'; // Peaking allows us to gently dip specific mid-frequencies
        this.bgMusicHumFilter.frequency.setValueAtTime(450, this.ctx.currentTime); 
        this.bgMusicHumFilter.gain.setValueAtTime(0, this.ctx.currentTime); 

        this.bgMusicSmoothGain = this.ctx.createGain();
        this.bgMusicSmoothGain.gain.value = state.eyesCloseMode ? 0.7 : 1.0;

        this.bgMusicGain.connect(this.bgMusicEQ);
        this.bgMusicEQ.connect(this.bgMusicLPF);
        this.bgMusicLPF.connect(this.bgMusicHumFilter);
        this.bgMusicHumFilter.connect(this.bgMusicSmoothGain);
        this.bgMusicSmoothGain.connect(this.lowCutFilter);

        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.ctx.destination);

        this.pannerNode = this.ctx.createStereoPanner();
        
        const pannerLfo = this.ctx.createOscillator();
        const pannerLfoGain = this.ctx.createGain();
        pannerLfo.type = 'sine';
        pannerLfo.frequency.setValueAtTime(0.03, this.ctx.currentTime);
        pannerLfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        pannerLfo.connect(pannerLfoGain);
        pannerLfoGain.connect(this.pannerNode.pan);
        pannerLfo.start();

        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = 0.35; 
        this.reverbWet = this.reverbGain; 
        
        this.reverbFilter = this.ctx.createBiquadFilter();
        this.reverbFilter.type = 'lowpass';
        this.reverbFilter.frequency.setValueAtTime(state.audioFilters ? 1500 : 20000, this.ctx.currentTime);

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.8;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.45;

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);

        this.masterGain.connect(this.delayNode);
        this.masterGain.connect(this.pannerNode);
        this.delayNode.connect(this.pannerNode);
        
        this.pannerNode.connect(this.lowCutFilter);
        
        let lastNode = this.lowCutFilter;
        // Inject Eyes Close Filter
        lastNode.connect(this.eyesCloseFilter);
        lastNode = this.eyesCloseFilter;

        if (this.voiceCarveFilter) {
            lastNode.connect(this.voiceCarveFilter);
            lastNode = this.voiceCarveFilter;
        }
        lastNode.connect(this.exciter);
        
        this.exciter.connect(this.reverbGain);
        this.reverbGain.connect(this.reverbFilter);
        
        if (this.presenceFilter) {
            this.reverbFilter.connect(this.presenceFilter);
            this.exciter.connect(this.presenceFilter);
            this.presenceFilter.connect(this.masterCompressor);
        } else {
            this.reverbFilter.connect(this.masterCompressor);
            this.exciter.connect(this.masterCompressor);
        }
        
        this.masterCompressor.connect(this.ctx.destination);

        // Upgrade: Permanent Absolute Grounding Anchor (Closed Eyes Mode)
        if (state.eyesCloseMode) {
            const anchorOsc = this.ctx.createOscillator();
            const anchorGain = this.ctx.createGain();
            anchorOsc.type = 'sine';
            anchorOsc.frequency.setValueAtTime(40, this.ctx.currentTime); // Root-level 40Hz anchor
            anchorGain.gain.setValueAtTime(0, this.ctx.currentTime);
            // Feeble but permanent physical presence
            anchorGain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 10);
            anchorOsc.connect(anchorGain);
            anchorGain.connect(this.masterGain);
            anchorOsc.start();
            this.groundingAnchor = { osc: anchorOsc, gain: anchorGain };
        }

        this.mantraGain = this.ctx.createGain();
        this.mantraGain.gain.value = 0;
        
        this.mantraFilter = this.ctx.createBiquadFilter();
        this.mantraFilter.type = 'lowpass';
        this.mantraFilter.frequency.setValueAtTime(state.audioFilters ? 2200 : 20000, this.ctx.currentTime);
        this.mantraGain.connect(this.mantraFilter);
        this.mantraFilter.connect(this.lowCutFilter);

        // Apply initial Eyes Close state
        this.toggleEyesCloseMode(state.eyesCloseMode);

        this.isInitialized = true;
    }

    toggleEyesCloseMode(enabled) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Dynamic Distortion Control: Swap curves to prevent "buzzing" from soft clipping
        if (enabled) {
            this.exciter.curve = new Float32Array([-1, 1]); // Clean
        } else {
            this.exciter.curve = this.makeDistortionCurve(0.002); // Studio Polish
        }

        // Target: Deep Smoothness. Lowered cutoff from 1200Hz to 1000Hz for "Closed" mode.
        const targetFreq = enabled ? 1000 : 20000;
        this.eyesCloseFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + 2.0);

        // Recede Instruments: Reduce BG music gain by 40% (was 30%) and tighten its dedicated LPF
        const bgSmoothGainTarget = enabled ? 0.6 : 1.0;
        const bgLPFTarget = enabled ? 600 : (state.audioFilters ? 1200 : 20000); // 600Hz removes all percussion "bite"
        
        // Anti-Buzz Notch: Widened and deepened to remove the "edge"
        const bgNotchGain = enabled ? -24 : -12; 
        this.bgMusicEQ.gain.exponentialRampToValueAtTime(Math.abs(bgNotchGain) * -1, now + 2.5);
        this.bgMusicEQ.frequency.exponentialRampToValueAtTime(3000, now + 2.5);
        // Widen the notch (lower Q) to catch a broader range of buzzy harmonics
        this.bgMusicEQ.Q.exponentialRampToValueAtTime(enabled ? 0.4 : 1.5, now + 2.0);

        // Anti-Hum smoothing: Target the 450Hz resonant "humming" frequency
        const hummingGain = enabled ? -15 : 0; // -15dB dip for the hum
        this.bgMusicHumFilter.gain.linearRampToValueAtTime(hummingGain, now + 2.5);

        this.bgMusicSmoothGain.gain.exponentialRampToValueAtTime(bgSmoothGainTarget, now + 2.5);
        this.bgMusicLPF.frequency.exponentialRampToValueAtTime(bgLPFTarget, now + 2.5);

        if (this.presenceFilter) {
            const presenceGain = enabled ? -12 : -3; // More aggressive high-shelf cut
            this.presenceFilter.gain.linearRampToValueAtTime(presenceGain, now + 2.0);
        }
    }

    makeDistortionCurve(amount) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            // Standard Sigmoid Soft Clipping
            curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
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
        gain.gain.linearRampToValueAtTime(0.012, this.ctx.currentTime + 5); // Reduced noise floor

        const breezeLfo = this.ctx.createOscillator();
        breezeLfo.type = 'sine';
        breezeLfo.frequency.setValueAtTime(0.02 + (Math.random() * 0.02), this.ctx.currentTime); 

        const breezeGainMod = this.ctx.createGain();
        breezeGainMod.gain.setValueAtTime(0.004, this.ctx.currentTime); 
        
        const breezeFreqMod = this.ctx.createGain();
        breezeFreqMod.gain.setValueAtTime(index > 3 ? 1200 : 400, this.ctx.currentTime); 

        breezeLfo.connect(breezeGainMod);
        breezeGainMod.connect(gain.gain);
        
        breezeLfo.connect(breezeFreqMod);
        breezeFreqMod.connect(filter.frequency);
        breezeLfo.start();

        if (index === 0 || index === 1) {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(index === 0 ? 100 : 250, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.2, this.ctx.currentTime);
        } else if (index === 2 || index === 3) {
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(index === 2 ? 700 : 1200, this.ctx.currentTime);
            filter.Q.setValueAtTime(1.5, this.ctx.currentTime); 
        } else {
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(3500 + (index * 300), this.ctx.currentTime);
            filter.Q.setValueAtTime(0.4, this.ctx.currentTime);
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

        // Grounding: If Chakra Frequencies disabled, use a neutral base of 110Hz (A2)
        const activeFreq = state.chakraFrequencies ? baseFreq : 110;

        let droneFreq = activeFreq;
        if (activeFreq > 600) droneFreq = activeFreq / 2; 
        if (activeFreq > 900) droneFreq = activeFreq / 4; 
        
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.04, this.ctx.currentTime); 
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(droneFreq * 0.001, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfo.start();
        this.vibrationLFO = lfo;

        // Drastically reduced gains (0.06 and 0.03) to make the drone "feeble"
        const harmonics = [{ f: 1.0, g: 0.06, type: 'sine' }, { f: 0.5, g: 0.03, type: 'sine' }];
        harmonics.forEach((h) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = h.type;
            osc.frequency.setValueAtTime(droneFreq * h.f, this.ctx.currentTime);
            lfoGain.connect(osc.frequency);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(droneFreq * 1.1, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.5, this.ctx.currentTime); 
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(h.g, this.ctx.currentTime + 6);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            this.droneOscillators.push({ osc, gain });
        });

        // Fixed: Lowered carrier to 80Hz for deep comfort
        const binauralCarrier = Math.min(droneFreq, 80); 

        const leftOsc = this.ctx.createOscillator();
        const rightOsc = this.ctx.createOscillator();
        const leftPanner = this.ctx.createStereoPanner();
        const rightPanner = this.ctx.createStereoPanner();
        const binauralGain = this.ctx.createGain();

        leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);
        rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);
        
        leftOsc.frequency.setValueAtTime(binauralCarrier, this.ctx.currentTime);
        // Grounding: Add 2Hz Delta pulse in Closed mode to relax forehead
        const drift = state.eyesCloseMode ? 2.0 : 0;
        rightOsc.frequency.setValueAtTime(binauralCarrier + drift, this.ctx.currentTime);
        
        binauralGain.gain.setValueAtTime(0, this.ctx.currentTime);
        // Drastically reduced volume (0.002) for a "feeble" background effect
        binauralGain.gain.linearRampToValueAtTime(0.002, this.ctx.currentTime + 10); 

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

        if (this.groundingAnchor) {
            const currentVal = this.groundingAnchor.gain.gain.value;
            this.groundingAnchor.gain.gain.cancelScheduledValues(now);
            this.groundingAnchor.gain.gain.setValueAtTime(currentVal, now);
            this.groundingAnchor.gain.gain.linearRampToValueAtTime(0, now + 5);
            const anchorOsc = this.groundingAnchor.osc;
            setTimeout(() => { try { anchorOsc.stop(); } catch(e) {} }, 5100);
            this.groundingAnchor = null;
        }

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

        try {
            if (!this.mantraBuffer[key]) {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to fetch ${filePath}`);
                const arrayBuffer = await response.arrayBuffer();
                this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);
            }

            // Standardized to 3.0s crossfade
            this.mantraLoop = new SeamlessLoop(this.ctx, this.mantraBuffer[key], this.mantraGain, 0, 3.0);
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
        } catch (e) {
            // SOFT FAIL: Log error but don't crash the journey. 
            // This prevents the "Stable Connection" alert if a specific file fails.
            console.error(`Audio Load Error (${key}):`, e);
        }
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
        if (!this.bgMusicLoop || !this.ctx) return;
        
        // Support for boolean (legacy) and numeric (fine-tuned) volume levels
        let factor = 1.0;
        if (isDucked === true) factor = 0.45;
        else if (typeof isDucked === 'number') factor = isDucked;

        const targetVol = state.volMusic * factor;
        const targetEQ = factor < 1.0 ? -8 : 0; 
        
        const now = this.ctx.currentTime;
        
        // Web Audio API Tip: exponentialRampToValueAtTime cannot start from 0.
        // We anchor the current value, but if it's 0, we jump it to a tiny non-zero value.
        let startVol = this.bgMusicGain.gain.value;
        if (startVol <= 0) startVol = 0.0001;

        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(startVol, now);
        this.bgMusicGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVol), now + duration); 
        
        this.bgMusicEQ.gain.cancelScheduledValues(now);
        this.bgMusicEQ.gain.setValueAtTime(this.bgMusicEQ.gain.value, now);
        this.bgMusicEQ.gain.linearRampToValueAtTime(targetEQ, now + duration);
        
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
        if (state.eyesCloseMode) return; // Absolute Blackout
        this.glow.style.background = `radial-gradient(circle, ${color}66 0%, transparent 70%)`;
    }
    stop() {
        if (this.glow) this.glow.style.background = 'transparent';
    }
}

// Meditation Controller
class MeditationController {
    constructor(audio, visual) {
        this.audio = audio;
        this.visual = visual;
        this.scripts = null;
        this.isMeditationActive = false;
        this.isStarting = false;
        this.isPaused = false;
        this.isHighEnergy = false;
        this.chakraOrder = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
    }

    async pauseAwareSleep(ms) {
        let remaining = ms;
        const step = 100;
        while (remaining > 0) {
            if (!this.isMeditationActive) break;
            if (this.isPaused) {
                // Keep waiting while paused
                await new Promise(r => setTimeout(r, step));
            } else {
                remaining -= step;
                await new Promise(r => setTimeout(r, step));
            }
        }
    }

    async start() {
        if (this.isStarting || this.isMeditationActive) return;
        this.isStarting = true;
        
        // DND Reminder
        alert("Before we begin: Please ensure 'Do Not Disturb' is enabled on your device to prevent interruptions.");

        try {
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.style.opacity = "0.5";
            }

            // CRITICAL: Immediate mobile speech unlock on first user gesture
            if ('speechSynthesis' in window) {
                try {
                    const unlock = new SpeechSynthesisUtterance("");
                    unlock.volume = 0;
                    window.speechSynthesis.speak(unlock);
                } catch(e) {}
            }

            // Immediate visual feedback for mobile
            showScreen(icebreakerScreen);
            document.getElementById('completion-modal').classList.add('hidden');
            
            if (!this.scripts) {
                const response = await fetch('scripts.json?v=' + Date.now());
                this.scripts = await response.json();
            }

            await this.audio.init();
            // Start background music looping silently immediately
            await this.audio.startBackgroundMusic();

            try { await wakeLock.request(); } catch(e) { console.warn("Wake lock failed", e); }
            
            this.isMeditationActive = true;
            this.isPaused = false;
            this.isHighEnergy = getChecked('high-energy-toggle');
            
            setText('pause-meditation', 'II');
            const controls = document.getElementById('controls');
            if (controls) controls.classList.remove('hidden');

            // ── ICEBREAKER PHASE (60 Second Music Fade In) ─────────────────────
            // Localize Icebreaker UI
            setText('icebreaker-title', state.language === 'ml' ? "ശാന്തമാകുക" : "Arriving");
            setText('icebreaker-subtitle', state.language === 'ml' ? "പതിയെ ശ്വസിക്കൂ... മനസ്സിനെ ഈ ഇടത്തേക്ക് കൊണ്ടുവരൂ" : "Breathe and settle into the space");

            this.audio.fadeInBackgroundMusic(state.timeIcebreaker); 
            for (let i = state.timeIcebreaker; i > 0; i--) {
                if (!this.isMeditationActive) return;
                await this.pauseAwareSleep(1000);
                if (icebreakerTimer) icebreakerTimer.textContent = i;
            }

            // Transition to Preparation
            showScreen(breathingScreen);

            // Initial Settle (2 seconds)
            if (this.isMeditationActive) await this.pauseAwareSleep(2000);

            if (this.isMeditationActive) await this.runGratitude();
            if (this.isMeditationActive && state.boxMeditation) await this.runBoxBreathing();
            if (this.isMeditationActive && state.corpsePoseEnabled) await this.runCorpsePose();

            // Immediate screen switch to meditation room for better user experience
            if (this.isMeditationActive) showScreen(meditationScreen);            
            // Settle after breathing (3 seconds)
            if (this.isMeditationActive) await this.pauseAwareSleep(3000);

            if (this.isMeditationActive) {
                if (this.isHighEnergy) {
                    await this.meditateOnChakra(this.scripts.high_energy, 'high_energy');
                    if (this.isMeditationActive) {
                        await this.handleSilence();
                        if (this.isMeditationActive) await this.runClosing();
                        if (this.isMeditationActive && state.hooponopono) await this.runHooponopono();
                        this.finish();
                    }
                } else {
                    await this.runSequence();
                }
            }
        } catch (err) {
            console.error("Critical Start Failure:", err);
            alert("App Error: " + err.message + "\n\nPlease ensure you have a stable connection and try again.");
            this.stop();
        } finally {
            this.isStarting = false;
            const startBtn = document.getElementById('start-meditation');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = "1";
            }
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
            await this.pauseAwareSleep(1000);
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

        // Fade out music before box meditation
        this.audio.fadeOutBackgroundMusic(4);

        // Narrate the preparation instruction with keepSilence = true
        await this.narrate(text, false, true);

        for (let s = 5; s > 0; s--) {
            if (!this.isMeditationActive) return;
            await new Promise(r => setTimeout(r, 1000));
        }
        
        tutorial.style.opacity = "0";
        await new Promise(r => setTimeout(r, 1000));
        tutorial.classList.add('hidden');

        const steps = state.language === 'ml' ? [
            { text: "ശ്വാസം ഉള്ളിലേക്ക് എടുക്കുക", scale: 8 },
            { text: "", scale: 8 },
            { text: "ശ്വാസം പുറത്തേക്ക് വിടുക", scale: 1 },
            { text: "", scale: 1 }
        ] : [
            { text: "Inhale", scale: 8 }, { text: "Hold", scale: 8 }, { text: "Exhale", scale: 1 }, { text: "Hold", scale: 1 }
        ];

        for (let cycle = 0; cycle < 4; cycle++) {
            for (const step of steps) {
                if (!this.isMeditationActive) return;
                
                instruction.textContent = step.text;
                // Sync visual timing with configurable breathing duration
                circle.style.transition = `transform ${state.timeBreathing}s linear`;
                circle.style.transform = `scale(${step.scale})`;
                
                this.narrateSoft(step.text);

                for (let s = state.timeBreathing; s > 0; s--) {
                    if (!this.isMeditationActive) return;
                    timer.textContent = s.toString().padStart(2, '0');
                    
                    // More responsive pause: check every 100ms
                    let elapsed = 0;
                    while (elapsed < 1000) {
                        if (!this.isMeditationActive) return;
                        if (!this.isPaused) {
                            elapsed += 100;
                        }
                        await new Promise(r => setTimeout(r, 100));
                    }
                }
            }
        }

        // Intimate Completion
        if (this.isMeditationActive) {
            instruction.textContent = state.language === 'ml' ? "ശ്വാസക്രിയ പൂർത്തിയായി" : "Breathing Complete";
            const completeText = state.language === 'ml' ? "ശ്വാസക്രിയ പൂർത്തിയായിരിക്കുന്നു. അല്പനേരം ശാന്തമായിരിക്കൂ. ശ്വാസോശ്വാസം സാധാരണ രീതിയിൽ കൊണ്ട് വരൂ " : "Breathing exercise is complete. Stay still for a moment.";
            await this.narrate(completeText, false, true);
            
            // Fade music back in after box meditation
            this.audio.fadeInBackgroundMusic(4, false);

            // 5 second interval before Chakra Journey starts
            instruction.textContent = state.language === 'ml' ? "തയ്യാറെടുക്കുക" : "Prepare";
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    async runCorpsePose() {
        try {
            if (!this.isMeditationActive) return;

            // Use the Icebreaker screen for the clean, minimal aesthetic with a large timer
            showScreen(icebreakerScreen);
            const title = document.getElementById('icebreaker-title');
            const subtitle = document.getElementById('icebreaker-subtitle');
            const timer = document.getElementById('icebreaker-timer');

            title.textContent = state.language === 'ml' ? "ശവാസനം" : "Corpse Pose";
            subtitle.textContent = state.language === 'ml' ? "ശരീരം പൂർണ്ണമായി ഭൂമിക്ക് വിട്ടു നൽകുക" : "Surrender your body completely to the earth";

            // Narration: Intro to the pose
            if (!this.scripts.corpse_pose) {
                console.error("Scripts.corpse_pose is missing!", this.scripts);
                throw new Error("Missing corpse_pose scripts");
            }

            await this.narrate(this.scripts.corpse_pose.intro[state.language], false);
            
            // Debug: Log volume change
            console.log("DEBUG: Transitions to Corpse Pose stillness. Reducing volume factor to 0.30");
            
            // Explicitly trigger the 30% volume level with a slow 12s fade
            this.audio.fadeInBackgroundMusic(12, 0.30);

            // Configurable Duration Countdown
            const totalSeconds = state.timeCorpse;
            const transitionSecond = 60; // 1 minute remaining mark
            for (let i = totalSeconds; i > 0; i--) {
                if (!this.isMeditationActive) return;
                
                // More responsive pause: check every 100ms
                let elapsed = 0;
                while (elapsed < 1000) {
                    if (!this.isMeditationActive) return;
                    if (!this.isPaused) {
                        elapsed += 100;
                    }
                    await new Promise(r => setTimeout(r, 100));
                }
                
                if (timer) timer.textContent = i;

                // At 1 minute remaining, narrate the transition to hypnagogic state
                if (i === transitionSecond) {
                    await this.narrate(this.scripts.corpse_pose.transition[state.language], false);
                    console.log("DEBUG: Restoring Corpse Pose stillness volume factor (0.30)");
                    this.audio.fadeInBackgroundMusic(12, 0.30);
                }

                await new Promise(r => setTimeout(r, 1000));
            }

            // Final settle before Chakra Journey
            subtitle.textContent = state.language === 'ml' ? "തയ്യാറെടുക്കുക" : "Prepare";
            await new Promise(r => setTimeout(r, 3000));
        } catch (e) {
            console.error("Error in runCorpsePose:", e);
            throw e; // Rethrow to trigger the main alert in start()
        }
    }

    async runBathSession() {
        if (!this.isMeditationActive) return;

        showScreen(icebreakerScreen);
        const title = document.getElementById('icebreaker-title');
        const subtitle = document.getElementById('icebreaker-subtitle');
        const timer = document.getElementById('icebreaker-timer');

        title.textContent = state.language === 'ml' ? this.scripts.bath_session.title.ml : this.scripts.bath_session.title.en;
        subtitle.textContent = state.language === 'ml' ? "ശുദ്ധീകരണം" : "Purification";

        await this.narrate(this.scripts.bath_session.intro[state.language], false);
        await this.narrate(this.scripts.bath_session.instructions[state.language], false);

        let remaining = state.timeBath;
        const reminderSecond = 60;

        while (remaining > 0) {
            if (!this.isMeditationActive) return;
            if (!this.isPaused) {
                if (timer) timer.textContent = Math.floor(remaining / 60) + ":" + (remaining % 60).toString().padStart(2, '0');
                
                if (remaining === reminderSecond) {
                    this.narrateSoft(this.scripts.bath_session.reminder[state.language]);
                }
                remaining--;
            }
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async runBackgroundMusicOnly() {
        this.isMeditationActive = true;
        showScreen(meditationScreen);
        
        // Wait for screen to switch
        await new Promise(r => setTimeout(r, 200));
        
        // Setup simple UI
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) {
            symbolEl.src = "symbols/root.png"; // Using a safe default
            symbolEl.style.opacity = "0.7";
        }
        
        const mantraEl = document.getElementById('mantra-display');
        const narrationEl = document.getElementById('narration-text');
        const timerEl = document.getElementById('timer-display');

        if (mantraEl) mantraEl.textContent = "MUSIC ONLY";
        if (narrationEl) narrationEl.textContent = "";
        if (timerEl) timerEl.textContent = "";
        
        // Start background music loop
        await this.audio.startBackgroundMusic();
        this.audio.fadeInBackgroundMusic(4, false);
        this.visual.startPulsing("#7c3aed"); // Standard meditation pulse
        
        // Setup Stop Button
        const controls = document.getElementById('controls');
        if (controls) {
            const stopBtn = document.createElement('button');
            stopBtn.className = 'icon-btn';
            stopBtn.innerHTML = 'STOP';
            stopBtn.onclick = () => {
                this.isMeditationActive = false;
                this.audio.fadeOutBackgroundMusic(2);
                this.visual.stop();
                showScreen(lobbyScreen);
                stopBtn.remove();
            };
            controls.appendChild(stopBtn);
        }
        
        // Keep running until isMeditationActive is false
        while (this.isMeditationActive) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async runYogaSession() {
        if (!this.isMeditationActive) return;

        // Perform bath first
        await this.runBathSession();

        // Transition Screen
        showScreen(icebreakerScreen);
        const title = document.getElementById('icebreaker-title');
        const subtitle = document.getElementById('icebreaker-subtitle');
        const timer = document.getElementById('icebreaker-timer');

        title.textContent = state.language === 'ml' ? "യോഗ" : "Yoga Bridge";
        subtitle.textContent = state.language === 'ml' ? "ശരീരവും മനസ്സും തമ്മിലുള്ള യോജിപ്പ്" : "Union of body and spirit";
        
        // Grounding Drone for Yoga (136.1 Hz - OM frequency)
        this.audio.startDrone(136.1, 3); // Using heart-level elemental layer for warmth
        // Keep music at 30% deep smooth level
        this.audio.fadeInBackgroundMusic(8, 0.30);

        // Intro & Preparation
        await this.narrate(this.scripts.yoga.intro[state.language], false);
        await this.narrate(this.scripts.yoga.preparation[state.language], false);

        // Prep Countdown
        for (let i = state.timeYogaPrep; i > 0; i--) {
            if (!this.isMeditationActive) return;
            if (timer) timer.textContent = i;
            await this.pauseAwareSleep(1000);
        }

        // Switch to main display for poses
        showScreen(meditationScreen);
        const symbolEl = document.getElementById('chakra-symbol');
        const mantraEl = document.getElementById('mantra-display');
        const narrationEl = document.getElementById('narration-text');
        const timerEl = document.getElementById('timer-display');
        
        // Aura for Yoga
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(circle at center, #FFD70022, transparent)';
        aura.style.opacity = '1';

        const yogaPoses = this.scripts.yoga.poses.filter(p => state.selectedYogaPoses.includes(p.id));

        for (const pose of yogaPoses) {
            if (!this.isMeditationActive) break;

            // Display Pose Name
            mantraEl.textContent = state.language === 'ml' ? pose.name_ml : pose.name_en;
            mantraEl.style.color = "#FFD700"; // Golden Yoga Color
            
            // Set pose-specific image
            const imageMap = {
                'balasana': 'symbols/Balasana.png',
                'paschimottanasana': 'symbols/Paschimottanasana.png',
                'vrikshasana': 'symbols/Vrikshasana.png',
                'adho_mukha_svanasana': 'symbols/Downward_dog.png',
                'marjaryasana': 'symbols/Marjaryasana.png'
            };
            symbolEl.src = imageMap[pose.id] || "symbols/Mahashakti.png";
            symbolEl.style.opacity = "0.9"; // Clearer visibility for pose instruction

            // Explain Pose
            const desc = state.language === 'ml' ? pose.desc_ml : pose.desc_en;
            await this.narrate(desc, false);

            // Hold Timer
            let remaining = state.timeYogaPose;
            while (remaining > 0) {
                if (!this.isMeditationActive) break;
                if (!this.isPaused) {
                    timerEl.textContent = `HOLD: ${remaining}s`;
                    remaining--;
                }
                await new Promise(r => setTimeout(r, 1000));
            }
            
            if (this.isMeditationActive) {
                this.narrateSoft(this.scripts.yoga.next_pose_prompt[state.language]);
                await this.pauseAwareSleep(5000); // 5s transition gap
            }
        }

        // Final Settle
        if (this.isMeditationActive) {
            await this.narrate(this.scripts.yoga.session_complete[state.language], false);
            await this.pauseAwareSleep(5000);
        }
    }

    async narrateSoft(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            utterance.rate = 0.7;   // Breath-aligned flow
            utterance.pitch = 1.05;
            utterance.volume = 1.0; 
            
            let isResolved = false;
            const safetyTimeout = setTimeout(() => {
                if (!isResolved) { isResolved = true; resolve(); }
            }, (text.length * 200) + 3000);

            utterance.onend = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            utterance.onerror = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            window.speechSynthesis.speak(utterance);
        });
    }

    togglePause() {
        console.log("DEBUG: togglePause called. Prev state isPaused:", this.isPaused);
        this.isPaused = !this.isPaused;
        console.log("DEBUG: togglePause updated isPaused to:", this.isPaused);
        const btn = document.getElementById('pause-meditation');
        if (btn) btn.textContent = this.isPaused ? '▶' : 'II';
        
        if (this.isPaused) {
            console.log("Action: Pausing session...");
            if (window.speechSynthesis) window.speechSynthesis.cancel(); 
            if (this.audio && this.audio.ctx) this.audio.ctx.suspend();
        } else {
            console.log("Action: Resuming session...");
            if (this.audio && this.audio.ctx) this.audio.ctx.resume();
        }
    }

    async runSequence() {
        if (state.bgMusicMode) {
            await this.runBackgroundMusicOnly();
            return;
        }

        for (let i = 0; i < this.chakraOrder.length; i++) {
            const key = this.chakraOrder[i];
            if (!this.isMeditationActive) break;
            
            await this.meditateOnChakra(this.scripts[key], key);

            // Yoga Bridge
            const isLastChakra = (i === this.chakraOrder.length - 1);
            const nextChakraIsCrown = (!isLastChakra && this.chakraOrder[i+1] === 'crown');

            if (state.yogaBridgeEnabled && nextChakraIsCrown && this.isMeditationActive) {
                await this.runYogaSession();
            }

            if (!isLastChakra && this.isMeditationActive) await this.handleInterval();
        }
        if (this.isMeditationActive) { await this.handleSilence(); }
        if (this.isMeditationActive) { await this.runClosing(); }
        if (this.isMeditationActive && state.hooponopono) { await this.runHooponopono(); }
        if (this.isMeditationActive) { this.finish(); }
    }

    async runClosing() {
        setText('mantra-display', "✦");
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = "0.4";
        const aura = document.getElementById('aura-bg');
        if (aura) aura.style.background = `radial-gradient(circle at center, #8B00FF22, transparent)`;
        const closingText = this.scripts.closing[state.language];
        await this.narrate(closingText);
        await new Promise(r => setTimeout(r, 2000));
        // Full-body health affirmation — head to toe
        const healthAffirmation = this.scripts.closing[`affirmation_${state.language}`];
        if (healthAffirmation && this.isMeditationActive) {
            setText('mantra-display', "✦ BODY ✦");
            await this.narrate(healthAffirmation);
        }
        await new Promise(r => setTimeout(r, 3000));
    }

    async runHooponopono() {
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(circle at center, #fff9c455, transparent)';
            aura.style.opacity = '1';
        }
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = '0.1';
        
        setText('mantra-display', '✦');
        setText('narration-text', '');

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
                setText('narration-text', phrase);
                
                // Keep music for all phrases, fade out only on the very last phrase of the last cycle
                const isLast = (cycle === 2 && i === phrases.length - 1);
                await this.narrate(phrase, false); // Keep music for phrases
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        // Closing breath - Final fade out
        setText('narration-text', '');
        await this.narrate(this.scripts.hooponopono.closing[state.language], true);

        // Extended rest (15 seconds) to allow the "Divine Aura" and background music 
        // to fade out completely into a peaceful silence.
        await new Promise(r => setTimeout(r, 15000));
    }

    async handleInterval() {
        this.audio.stopDrone();
        const timerEl = document.getElementById('timer-display');
        setText('mantra-display', "BREATHE");
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = "0.3";
        this.visual.stop();
        await this.pauseAwareSleep(2000);
        const breatheText = state.language === 'ml' ? "അല്പം വിശ്രമിക്കൂ... ശ്വസിക്കൂ... അടുത്ത ചക്രത്തിനായി തയ്യാറെടുക്കൂ" : "Take a break... breathe and prepare... for the next chakra";
        this.narrateFeeble(breatheText);
        const intervalMs = state.timeInterval * 1000;
        let elapsed = 0;
        while (elapsed < intervalMs) {
            if (!this.isMeditationActive) break;
            if (!this.isPaused) {
                elapsed += 100;
                const remaining = Math.max(0, intervalMs - elapsed);
                const secs = Math.ceil(remaining / 1000);
                if (timerEl) timerEl.textContent = `00:${secs.toString().padStart(2, '0')}`;
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
        
        // Deity Image Selection
        if (state.deityPath !== 'none' && this.scripts.deities && this.scripts.deities[state.deityPath]) {
            symbolEl.src = this.scripts.deities[state.deityPath][key];
        } else {
            symbolEl.src = chakra.symbol;
        }

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
        aura.style.background = state.eyesCloseMode ? 'transparent' : `radial-gradient(circle at center, ${chakra.color}22, transparent)`;
        aura.style.opacity = state.eyesCloseMode ? "0" : "1";
        
        // Define absolute index for correct elemental layers regardless of journey order
        const absoluteIndex = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].indexOf(key);

        this.audio.startDrone(chakra.frequency, absoluteIndex);

        if (!state.eyesCloseMode) this.visual.startPulsing(chakra.color);
        await this.narrate(chakra[state.language]);
        if (!this.isMeditationActive) return;

        // Start looping mantra audio track (fades in, drone fades down)
        await this.audio.playMantraTrack(key);

        const chantDurationMs = (state.timePerChakra * 60 * 1000) - 15000;
        let elapsed = 0;
        const timerEl = document.getElementById('timer-display');

        while (elapsed < chantDurationMs) {
            if (!this.isMeditationActive) break;
            
            // Explicit pause check
            await this.pauseAwareSleep(0);

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
        await this.pauseAwareSleep(4000);

        if (this.isMeditationActive) await this.narrate(chakra[`affirmation_${state.language}`]);
    }

    async narrateFeeble(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            utterance.rate = 0.7; 
            utterance.pitch = 1.05; 
            utterance.volume = 1.0; 
            
            let isResolved = false;
            const safetyTimeout = setTimeout(() => {
                if (!isResolved) { isResolved = true; resolve(); }
            }, (text.length * 200) + 3000);

            utterance.onend = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            utterance.onerror = () => { if (!isResolved) { isResolved = true; clearTimeout(safetyTimeout); resolve(); } };
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrate(text, fadeOut = false, keepSilence = false) {
        if (!window.speechSynthesis) return;

        // Cancel any queued speech to prevent buildup on mobile
        window.speechSynthesis.cancel();

        // Ensure background music is active at ducked level
        if (!keepSilence) {
            this.audio.fadeInBackgroundMusic(4, true);
        }

        // Studio Timing: 1.2 second gap gives music time to 'duck' but keeps momentum
        await new Promise(r => setTimeout(r, 1200));

        // Activate Frequency Carving (+2dB boost at 2.5kHz) for speech intelligibility
        if (this.audio.voiceCarveFilter) {
            this.audio.voiceCarveFilter.gain.cancelScheduledValues(this.audio.ctx.currentTime);
            this.audio.voiceCarveFilter.gain.linearRampToValueAtTime(2, this.audio.ctx.currentTime + 1.5);
        }

        const sentences = text.split(/[.!?।]/).filter(s => s.trim().length > 0);
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            if (!this.isMeditationActive) break;
            
            // Wait while paused
            while (this.isPaused && this.isMeditationActive) await new Promise(r => setTimeout(r, 100));

            setText('narration-text', sentence.trim());

            await new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                
                // Fallback language identification
                utterance.lang = state.language === 'ml' ? 'ml-IN' : 'en-US';

                const selectedVoice = state.voices.find(v => v.name === state.voiceName);
                if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }

                // Studio Clarity: Breath-aligned pacing
                const baseRate = state.sleepMode ? 0.62 : 0.72;
                utterance.rate   = state.eyesCloseMode ? baseRate * 0.95 : baseRate;
                utterance.pitch  = state.eyesCloseMode ? 0.94 : 1.05; // Balanced 0.94 for comfort
                utterance.volume = 1.0; // Boosted for mobile speakers
                
                let isResolved = false;
                
                // Safety: Resolve promise immediately if pause is detected
                const pauseCheck = setInterval(() => {
                    if (this.isPaused || !this.isMeditationActive) {
                        if (!isResolved) {
                            console.log("Narrate: Pause detected, resolving promise.");
                            isResolved = true;
                            clearInterval(pauseCheck);
                            clearTimeout(safetyTimeout);
                            resolve();
                        }
                    }
                }, 100);

                const safetyTimeout = setTimeout(() => {
                    if (!isResolved) {
                        console.warn("Safety Timeout: Speech engine hung.");
                        isResolved = true;
                        clearInterval(pauseCheck);
                        resolve();
                    }
                }, (sentence.length * 200) + 3000); // More generous buffer

                utterance.onend = () => {
                    if (!isResolved) {
                        isResolved = true;
                        clearInterval(pauseCheck);
                        clearTimeout(safetyTimeout);
                        resolve();
                    }
                };
                utterance.onerror = (e) => {
                    console.error("SpeechSynthesis Error:", e);
                    if (!isResolved) {
                        isResolved = true;
                        clearInterval(pauseCheck);
                        clearTimeout(safetyTimeout);
                        resolve();
                    }
                };
                window.speechSynthesis.speak(utterance);
            });

            // If we were paused during this sentence, it was cancelled by togglePause().
            // We decrement 'i' to replay this sentence once we resume.
            if (this.isPaused && this.isMeditationActive) {
                i--;
                continue;
            }

            // Breath-aligned space (1.5s) between sentences for comfort
            await new Promise(r => setTimeout(r, 1500));
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
        setText('mantra-display', "SILENCE");
        const symbolEl = document.getElementById('chakra-symbol');
        if (symbolEl) symbolEl.style.opacity = "0.2";
        this.audio.stopDrone();
        const silenceTime = 60000;
        const timerEl = document.getElementById('timer-display');
        for (let i = 60; i > 0; i--) {
            if (!this.isMeditationActive) break;
            if (timerEl) timerEl.textContent = `00:${i.toString().padStart(2, '0')}`;
            await this.pauseAwareSleep(1000);
        }
    }

    finish() {
        this.isMeditationActive = false; 
        this.visual.stop(); 
        this.audio.stopDrone(); 
        this.audio.stopMantraTrack(); 
        this.audio.fadeOutBackgroundMusic(12); // Long 12s final fade out
        setTimeout(() => this.audio.stopBackgroundMusic(), 13000);
        wakeLock.release();
        document.getElementById('aura-bg').style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        this.audio.playSingingBowl();
        state.stats.journeys += 1; state.stats.time += Math.round((state.timePerChakra * this.chakraOrder.length) + 1);
        localStorage.setItem('chakra_stats_journeys', state.stats.journeys);
        localStorage.setItem('chakra_stats_time', state.stats.time);
        setText('stat-journeys', state.stats.journeys);
        setText('stat-time', state.stats.time);
        setText('stat-session-time', Math.round(state.stats.time) + ' mins');
        setText('stat-total-journeys', state.stats.journeys);
        // Lift sleep mode dimming once session ends
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.opacity = "1";
        const controls = document.getElementById('controls');
        if (controls) controls.classList.add('hidden');
        const mixer = document.getElementById('volume-mixer');
        if (mixer) mixer.classList.add('hidden');

        const modal = document.getElementById('completion-modal');
        const title = document.getElementById('completion-title');
        const msg = document.getElementById('completion-message');
        const btn = document.getElementById('close-completion');
        if (title) title.textContent = state.language === 'ml' ? "യാത്ര പൂർത്തിയായി" : "Journey Complete";
        if (msg) msg.textContent = state.language === 'ml' ? "ധ്യാനം പൂർത്തിയായി. അനുഗ്രഹിക്കപ്പെടട്ടെ." : "Meditation Completed. Stay Blessed.";
        if (btn) btn.textContent = state.language === 'ml' ? "തിരികെ പോവുക" : "Return to Room";

        // Journal: reset textarea, show last entry date, localise prompt
        syncValue('journal-entry', '');
        setText('journal-prompt', state.language === 'ml'
            ? 'എന്ത് മാറി? ഇന്ന് നിങ്ങൾ എന്ത് ക്ഷണിക്കുന്നു?'
            : 'What shifted? What are you calling in?');
        setText('save-journal', state.language === 'ml' ? 'സൂക്ഷിക്കൂ' : 'Save Entry');
        const journalEntries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        const lastInfo = document.getElementById('last-journal-info');
        lastInfo.textContent = journalEntries.length > 0
            ? (state.language === 'ml' ? 'അവസാന നമ്പർ: ' : 'Last entry: ') + journalEntries[0].date
            : '';

        modal.classList.remove('hidden');

        // DND Reminder
        setTimeout(() => {
            alert("Meditation complete. You can now turn off 'Do Not Disturb' if you wish.");
        }, 500);
    }

    stop() {
        this.isMeditationActive = false; this.audio.stopDrone(); this.audio.stopMantraTrack(); this.audio.stopBackgroundMusic(); this.visual.stop(); wakeLock.release();
        window.speechSynthesis.cancel();
        document.body.classList.remove('sleep-mode-active');
        const app = document.getElementById('app');
        if (app) app.style.opacity = "1";
        const aura = document.getElementById('aura-bg');
        if (aura) aura.style.opacity = "0";
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active', 'completed'));
        const controls = document.getElementById('controls');
        if (controls) controls.classList.add('hidden');
        const mixer = document.getElementById('volume-mixer');
        if (mixer) mixer.classList.add('hidden');
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
    volVoice: parseFloat(localStorage.getItem('chakra_vol_voice')) || 0.9,
    volDrone: parseFloat(localStorage.getItem('chakra_vol_drone')) || 0.05,
    volBell: parseFloat(localStorage.getItem('chakra_vol_bell')) || 0.05,
    volMantra: parseFloat(localStorage.getItem('chakra_vol_mantra')) || 0.35,
    volMusic: parseFloat(localStorage.getItem('chakra_vol_music')) || 0.20,
    stats: {
        journeys: parseInt(localStorage.getItem('chakra_stats_journeys')) || 0,
        time: parseInt(localStorage.getItem('chakra_stats_time')) || 0
    },
    selectedChakras: JSON.parse(localStorage.getItem('chakra_selected')) || ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'],
    intention: localStorage.getItem('chakra_intention') || '',
    sleepMode: localStorage.getItem('chakra_sleep_mode') === 'true',
    audioFilters: localStorage.getItem('chakra_audio_filters') === 'true',
    reverseJourney: localStorage.getItem('chakra_reverse_journey') === 'true',
    boxMeditation: localStorage.getItem('chakra_box_meditation') === 'true',
    hooponopono: localStorage.getItem('chakra_hooponopono') === 'true',
    chakraFrequencies: localStorage.getItem('chakra_frequencies') === 'true',
    deityPath: localStorage.getItem('chakra_deity_path') || 'none',
    bgMusicMode: localStorage.getItem('chakra_bg_music_mode') === 'true',
    eyesCloseMode: localStorage.getItem('chakra_eyes_close_mode') === 'true',
    corpsePoseEnabled: localStorage.getItem('chakra_corpse_enabled') !== 'false', // Default true
    brightness: parseFloat(localStorage.getItem('chakra_brightness')) || 1.0,
    yogaBridgeEnabled: localStorage.getItem('chakra_yoga_bridge') === 'true',
    bathSessionEnabled: localStorage.getItem('chakra_bath_enabled') === 'true',
    selectedYogaPoses: JSON.parse(localStorage.getItem('chakra_yoga_selected')) || ['balasana', 'paschimottanasana', 'vrikshasana', 'adho_mukha_svanasana', 'marjaryasana'],
    // Journey Timings (in seconds)
    timeIcebreaker: parseInt(localStorage.getItem('chakra_time_icebreaker')) || 60,
    timeBreathing: parseInt(localStorage.getItem('chakra_time_breathing')) || 8,
    timeCorpse: parseInt(localStorage.getItem('chakra_time_corpse')) || 300,
    timeInterval: parseInt(localStorage.getItem('chakra_time_interval')) || 9,
    timeYogaPrep: parseInt(localStorage.getItem('chakra_time_yoga_prep')) || 60,
    timeYogaPose: parseInt(localStorage.getItem('chakra_time_yoga_pose')) || 60,
    timeBath: parseInt(localStorage.getItem('chakra_time_bath')) || 600
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

init();

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
    if (!('speechSynthesis' in window)) return;

    // Immediate UI setup with Default option
    const initUI = () => {
        voiceSelect.innerHTML = '';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "Default";
        defaultOpt.textContent = "System Default Voice";
        voiceSelect.appendChild(defaultOpt);
        voiceSelect.value = "Default";
    };
    initUI();

    const updateUI = (availableVoices) => {
        if (!availableVoices || availableVoices.length === 0) return;
        
        // Save current selection
        const currentVal = voiceSelect.value;
        voiceSelect.innerHTML = '';
        
        // Re-add Default
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "Default";
        defaultOpt.textContent = "System Default Voice";
        voiceSelect.appendChild(defaultOpt);

        availableVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });

        // Restore selection if it exists in the new list
        if (state.voiceName && availableVoices.find(v => v.name === state.voiceName)) {
            voiceSelect.value = state.voiceName;
        } else {
            voiceSelect.value = currentVal;
        }
        state.voices = availableVoices;
    };

    // Try to load voices immediately
    let initialVoices = window.speechSynthesis.getVoices();
    if (initialVoices.length > 0) {
        updateUI(initialVoices);
    }

    // Listen for updates in background
    window.speechSynthesis.onvoiceschanged = () => {
        updateUI(window.speechSynthesis.getVoices());
    };

    // One-time "wake up" request
    try {
        const dummy = new SpeechSynthesisUtterance("");
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
    } catch(e) {}
}

function autoSelectVoice() {
    if (!state.voices || state.voices.length === 0) {
        state.voiceName = "Default";
        if (voiceSelect) voiceSelect.value = "Default";
        return;
    }
    
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
    syncValue('language-select', state.language);
    
    const timeSlider = document.getElementById('time-per-chakra');
    if (timeSlider) {
        timeSlider.value = state.timePerChakra;
        const pctInit = ((timeSlider.value - timeSlider.min) / (timeSlider.max - timeSlider.min) * 100).toFixed(1) + '%';
        timeSlider.style.setProperty('--range-fill', pctInit);
    }
    
    setText('time-display', `${state.timePerChakra.toFixed(1)} mins`);
    
    // Sync Mixer Sliders
    syncValue('vol-voice', state.volVoice);
    syncValue('vol-drone', state.volDrone);
    syncValue('vol-bell', state.volBell);
    syncValue('vol-mantra', state.volMantra);
    syncValue('vol-music', state.volMusic);

    // Sync Settings Sliders
    syncValue('settings-vol-voice', state.volVoice);
    syncValue('settings-vol-drone', state.volDrone);
    syncValue('settings-vol-bell', state.volBell);
    syncValue('settings-vol-mantra', state.volMantra);
    syncValue('settings-vol-music', state.volMusic);

    setText('stat-journeys', state.stats.journeys);
    setText('stat-time', state.stats.time);
    document.querySelectorAll('#chakra-selection input').forEach(cb => {
        cb.checked = state.selectedChakras.includes(cb.value);
    });
    syncValue('intention-input', state.intention);
    
    syncChecked('sleep-mode-toggle', state.sleepMode);
    syncChecked('audio-filters-toggle', state.audioFilters);
    syncChecked('reverse-journey-toggle', state.reverseJourney);
    syncChecked('box-meditation-toggle', state.boxMeditation);
    syncChecked('hooponopono-toggle', state.hooponopono);
    syncChecked('frequencies-toggle', state.chakraFrequencies);
    syncChecked('eyes-close-mode-toggle', state.eyesCloseMode);
    syncChecked('bg-music-mode-toggle', state.bgMusicMode);
    if (state.eyesCloseMode) document.body.classList.add('eyes-close-mode');

    // Sync Yoga Settings
    syncChecked('yoga-bridge-toggle', state.yogaBridgeEnabled);
    syncChecked('bath-session-toggle', state.bathSessionEnabled);
    const yogaSubOptions = document.getElementById('yoga-sub-options');
    if (yogaSubOptions) {
        yogaSubOptions.style.display = state.yogaBridgeEnabled ? 'flex' : 'none';
    }

    const deityRadios = document.getElementsByName('deity-path');
    setTimeout(() => {
        deityRadios.forEach(r => {
            r.checked = (r.value === state.deityPath);
        });
    }, 0);

    // Sync Journey Timings Sliders
    syncValue('time-icebreaker', state.timeIcebreaker);
    setText('display-icebreaker', state.timeIcebreaker + 's');
    
    syncValue('time-breathing', state.timeBreathing);
    setText('display-breathing', state.timeBreathing + 's');
    
    syncValue('time-corpse', state.timeCorpse);
    setText('display-corpse', state.timeCorpse + 's');
    
    syncValue('time-interval', state.timeInterval);
    setText('display-interval', state.timeInterval + 's');

    syncValue('time-yoga-prep', state.timeYogaPrep);
    setText('display-yoga-prep', state.timeYogaPrep + 's');

    syncValue('time-yoga-pose', state.timeYogaPose);
    setText('display-yoga-pose', state.timeYogaPose + 's');

    syncValue('time-bath', state.timeBath);
    setText('display-bath', Math.floor(state.timeBath / 60) + 'm');
    
    syncValue('brightness-slider', state.brightness);
    document.getElementById('app').style.opacity = state.brightness;
    
    // Ensure voice matches the loaded language
    autoSelectVoice();
}

function checkFirstTime() {
    if (localStorage.getItem('chakra_configured')) {
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
            aura.style.opacity = '1';
        }
    } else {
        showScreen(configScreen);
        const aura = document.getElementById('aura-bg');
        if (aura) {
            aura.style.background = 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)';
            aura.style.opacity = '1';
        }
    }
}

function showScreen(screen) {
    [configScreen, lobbyScreen, meditationScreen, breathingScreen, icebreakerScreen].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    if (screen) screen.classList.remove('hidden');
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
        state.voiceName = voiceSelect.value;
        localStorage.setItem('chakra_voice', state.voiceName);
        state.audioFilters = getChecked('audio-filters-toggle');
        state.reverseJourney = getChecked('reverse-journey-toggle');
        state.boxMeditation = getChecked('box-meditation-toggle');
        state.hooponopono = getChecked('hooponopono-toggle');
        state.chakraFrequencies = getChecked('frequencies-toggle');
        state.bgMusicMode = getChecked('bg-music-mode-toggle');
        state.eyesCloseMode = getChecked('eyes-close-mode-toggle');
        state.corpsePoseEnabled = getChecked('corpse-pose-toggle');
        state.yogaBridgeEnabled = getChecked('yoga-bridge-toggle');
        state.bathSessionEnabled = getChecked('bath-session-toggle');
        state.selectedYogaPoses = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(cb => cb.value);
        const selectedDeity = document.querySelector('input[name="deity-path"]:checked');
        state.deityPath = selectedDeity ? selectedDeity.value : 'none';
        
        localStorage.setItem('chakra_audio_filters', state.audioFilters);
        localStorage.setItem('chakra_reverse_journey', state.reverseJourney);
        localStorage.setItem('chakra_box_meditation', state.boxMeditation);
        localStorage.setItem('chakra_hooponopono', state.hooponopono);
        localStorage.setItem('chakra_frequencies', state.chakraFrequencies);
        localStorage.setItem('chakra_deity_path', state.deityPath);
        localStorage.setItem('chakra_bg_music_mode', state.bgMusicMode);
        localStorage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
        localStorage.setItem('chakra_corpse_enabled', state.corpsePoseEnabled);
        localStorage.setItem('chakra_yoga_bridge', state.yogaBridgeEnabled);
        localStorage.setItem('chakra_bath_enabled', state.bathSessionEnabled);
        localStorage.setItem('chakra_yoga_selected', JSON.stringify(state.selectedYogaPoses));
        if (audio.toggleEyesCloseMode) audio.toggleEyesCloseMode(state.eyesCloseMode);
        document.body.classList.toggle('eyes-close-mode', state.eyesCloseMode);
        localStorage.setItem('chakra_configured', 'true');
        showScreen(lobbyScreen);
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
        aura.style.opacity = '1';
    });

    // Dynamic Setting Visibility
    function updateTimingRowVisibility() {
        const boxEnabled = getChecked('box-meditation-toggle');
        const corpseEnabled = getChecked('corpse-pose-toggle');
        const yogaEnabled = getChecked('yoga-bridge-toggle');
        const bathEnabled = getChecked('bath-session-toggle');
        const bgMusicMode = getChecked('bg-music-mode-toggle');

        // Hide journey configurations if in music-only mode
        const journeyConfig = document.getElementById('chakra-selection').parentElement;
        if (journeyConfig) journeyConfig.style.display = bgMusicMode ? 'none' : 'block';

        const toggleDisplay = (id, show) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.display = show ? 'flex' : 'none';
        };

        toggleDisplay('row-breathing', boxEnabled && !bgMusicMode);
        toggleDisplay('row-corpse', corpseEnabled && !bgMusicMode);
        toggleDisplay('row-yoga-prep', yogaEnabled && !bgMusicMode);
        toggleDisplay('row-yoga-pose', yogaEnabled && !bgMusicMode);
        toggleDisplay('row-bath', yogaEnabled && bathEnabled && !bgMusicMode);
        
        const yogaSubOptions = document.getElementById('yoga-sub-options');
        if (yogaSubOptions) {
            yogaSubOptions.style.display = (yogaEnabled && !bgMusicMode) ? 'flex' : 'none';
        }
    }

    // Master Toggle Logic
    const bgMusicToggle = document.getElementById('bg-music-mode-toggle');
    const yogaBridgeToggle = document.getElementById('yoga-bridge-toggle');
    const reverseJourneyToggle = document.getElementById('reverse-journey-toggle');
    const boxMeditationToggle = document.getElementById('box-meditation-toggle');
    const hooponoponoToggle = document.getElementById('hooponopono-toggle');
    const corpsePoseToggle = document.getElementById('corpse-pose-toggle');

    function enforceMasterToggle(target) {
        if (target === bgMusicToggle && bgMusicToggle.checked) {
            // Disable other journey features
            if (yogaBridgeToggle) yogaBridgeToggle.checked = false;
            if (reverseJourneyToggle) reverseJourneyToggle.checked = false;
            if (boxMeditationToggle) boxMeditationToggle.checked = false;
            if (hooponoponoToggle) hooponoponoToggle.checked = false;
            if (corpsePoseToggle) corpsePoseToggle.checked = false;
        } else if (target !== bgMusicToggle && target.checked) {
            // Disable BG Music Mode if any other journey feature is enabled
            if (bgMusicToggle) bgMusicToggle.checked = false;
        }

        // Mutual Exclusivity: Yoga Bridge & Reverse Journey
        if (target === yogaBridgeToggle && yogaBridgeToggle.checked) {
            if (reverseJourneyToggle) reverseJourneyToggle.checked = false;
        } else if (target === reverseJourneyToggle && reverseJourneyToggle.checked) {
            if (yogaBridgeToggle) yogaBridgeToggle.checked = false;
        }

        updateTimingRowVisibility();
        updateSessionEstimate();
    }

    // Event Listeners for Toggles
    document.getElementById('box-meditation-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('corpse-pose-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('yoga-bridge-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('bath-session-toggle').addEventListener('change', updateTimingRowVisibility);
    document.getElementById('bg-music-mode-toggle').addEventListener('change', updateTimingRowVisibility);

    if (bgMusicToggle) {
        bgMusicToggle.addEventListener('change', (e) => {
            enforceMasterToggle(e.target);
        });
    }

    if (yogaBridgeToggle) {
        yogaBridgeToggle.addEventListener('change', (e) => {
            enforceMasterToggle(e.target);
            const selection = document.getElementById('yoga-pose-selection');
            if (selection) selection.style.display = e.target.checked ? 'flex' : 'none';
        });
    }

    [reverseJourneyToggle, boxMeditationToggle, hooponoponoToggle, corpsePoseToggle].forEach(toggle => {
        if (toggle) toggle.addEventListener('change', (e) => enforceMasterToggle(e.target));
    });
    
    // Initial call
    updateTimingRowVisibility();

    function updateSessionEstimate() {
        const isHigh = getChecked('high-energy-toggle');
        const hasBox = getChecked('box-meditation-toggle');
        const hasHooponopono = getChecked('hooponopono-toggle');
        const hasYoga = getChecked('yoga-bridge-toggle');
        const hasCorpse = getChecked('corpse-pose-toggle');
        
        let overhead = 5; // base overhead (gratitude, silence, etc)
        if (hasBox) overhead += 4; // box breathing cycles + narration
        if (hasHooponopono) overhead += 3; // 3 cycles + intro/outro
        
        const corpseTime = hasCorpse ? (state.timeCorpse / 60) : 0;
        
        if (hasYoga) {
            const yogaSelected = Array.from(document.querySelectorAll('#yoga-pose-selection input:checked')).map(cb => cb.value);
            overhead += (state.timeYogaPrep / 60) + (yogaSelected.length * (state.timeYogaPose + 15) / 60) + (state.timeBath / 60); // prep + poses + transition gaps + bath
        }

        const estimate = isHigh
            ? Math.round(state.timePerChakra + (state.timeIcebreaker / 60) + corpseTime + overhead + 3) 
            : Math.round(state.selectedChakras.length * (state.timePerChakra + 2) + (state.timeIcebreaker / 60) + corpseTime + overhead + 7);
        setText('session-estimate', `~ ${estimate} min session`);
    }

    // Timing Sliders Listeners
    document.getElementById('time-icebreaker').addEventListener('input', (e) => {
        state.timeIcebreaker = parseInt(e.target.value);
        setText('display-icebreaker', state.timeIcebreaker + 's');
        localStorage.setItem('chakra_time_icebreaker', state.timeIcebreaker);
        updateSessionEstimate();
    });
    document.getElementById('time-breathing').addEventListener('input', (e) => {
        state.timeBreathing = parseInt(e.target.value);
        setText('display-breathing', state.timeBreathing + 's');
        localStorage.setItem('chakra_time_breathing', state.timeBreathing);
        updateSessionEstimate();
    });
    document.getElementById('time-corpse').addEventListener('input', (e) => {
        state.timeCorpse = parseInt(e.target.value);
        setText('display-corpse', state.timeCorpse + 's');
        localStorage.setItem('chakra_time_corpse', state.timeCorpse);
        updateSessionEstimate();
    });
    document.getElementById('time-interval').addEventListener('input', (e) => {
        state.timeInterval = parseInt(e.target.value);
        setText('display-interval', state.timeInterval + 's');
        localStorage.setItem('chakra_time_interval', state.timeInterval);
        updateSessionEstimate();
    });
    document.getElementById('time-yoga-prep').addEventListener('input', (e) => {
        state.timeYogaPrep = parseInt(e.target.value);
        setText('display-yoga-prep', state.timeYogaPrep + 's');
        localStorage.setItem('chakra_time_yoga_prep', state.timeYogaPrep);
        updateSessionEstimate();
    });
    document.getElementById('time-yoga-pose').addEventListener('input', (e) => {
        state.timeYogaPose = parseInt(e.target.value);
        setText('display-yoga-pose', state.timeYogaPose + 's');
        localStorage.setItem('chakra_time_yoga_pose', state.timeYogaPose);
        updateSessionEstimate();
    });
    document.getElementById('time-bath').addEventListener('input', (e) => {
        state.timeBath = parseInt(e.target.value);
        setText('display-bath', Math.floor(state.timeBath / 60) + 'm');
        localStorage.setItem('chakra_time_bath', state.timeBath);
        updateSessionEstimate();
    });

    timeSlider.addEventListener('input', (e) => {
        state.timePerChakra = parseFloat(e.target.value);
        timeDisplay.textContent = `${state.timePerChakra.toFixed(1)} mins`;
        localStorage.setItem('chakra_time', state.timePerChakra);
        const pct = ((e.target.value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1) + '%';
        e.target.style.setProperty('--range-fill', pct);
        updateSessionEstimate();
    });

    document.getElementById('high-energy-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('box-meditation-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('hooponopono-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('reverse-journey-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('frequencies-toggle').addEventListener('change', updateSessionEstimate);
    document.getElementById('yoga-bridge-toggle').addEventListener('change', updateSessionEstimate);
    document.querySelectorAll('#yoga-pose-selection input').forEach(cb => {
        cb.addEventListener('change', updateSessionEstimate);
    });
    openSettingsBtn.addEventListener('click', () => showScreen(configScreen));

    // Brightness slider
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            state.brightness = parseFloat(e.target.value);
            localStorage.setItem('chakra_brightness', state.brightness);
            document.getElementById('app').style.opacity = state.brightness;
        });
    }

    startMeditationBtn.addEventListener('click', async () => {
        // Initialize Audio Engine early for music-only mode
        if (!audio.isInitialized) await audio.init();

        if (state.bgMusicMode) {
            // Apply sleep mode dim class if needed
            if (state.sleepMode) document.body.classList.add('sleep-mode-active');
            if (state.eyesCloseMode) {
                const app = document.getElementById('app');
                const targetOpacity = Math.min(state.brightness, 0.7);
                if (app) app.style.opacity = targetOpacity;
            }
            await meditation.runBackgroundMusicOnly();
        } else {
            let order = [...state.selectedChakras];
            if (state.reverseJourney) order.reverse();
            meditation.chakraOrder = order;
            // Apply sleep mode dim class at session start
            if (state.sleepMode) document.body.classList.add('sleep-mode-active');
            // Absolute Grounding: Dim UI for Eyes Closed mode
            if (state.eyesCloseMode) {
                const app = document.getElementById('app');
                const targetOpacity = Math.min(state.brightness, 0.7);
                if (app) app.style.opacity = targetOpacity;
            }
            meditation.start().catch(err => {
                console.error("Failed to start meditation:", err);
                alert("Failed to start meditation. Check console.");
            });
        }
    });

    document.getElementById('pause-meditation').addEventListener('click', (e) => {
        console.log("Pause/Play button clicked");
        e.stopImmediatePropagation();
        meditation.togglePause();
    });

    document.getElementById('stop-meditation').addEventListener('click', (e) => {
        console.log("Stop button clicked");
        e.stopImmediatePropagation();
        meditation.stop();
    });
    document.getElementById('eyes-close-mode-toggle').addEventListener('change', (e) => {
        state.eyesCloseMode = e.target.checked;
        localStorage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
        if (audio.toggleEyesCloseMode) audio.toggleEyesCloseMode(state.eyesCloseMode);
        document.body.classList.toggle('eyes-close-mode', state.eyesCloseMode);
    });
    document.getElementById('close-completion').addEventListener('click', () => {
        document.getElementById('completion-modal').classList.add('hidden');
        showScreen(lobbyScreen);
    });

    // Toggle text overlay on click of the image area for immersion
    const symbolEl = document.getElementById('chakra-symbol');
    if (symbolEl) {
        symbolEl.addEventListener('click', () => {
            const overlay = document.getElementById('session-overlay');
            if (overlay) overlay.style.display = (overlay.style.display === 'none') ? 'block' : 'none';
        });
    }

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
        const entryEl = document.getElementById('journal-entry');
        const entry = entryEl ? entryEl.value.trim() : "";
        if (!entry) return;
        const entries = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
        entries.unshift({ date: new Date().toLocaleDateString(), text: entry });
        localStorage.setItem('chakra_journal', JSON.stringify(entries.slice(0, 50)));
        syncValue('journal-entry', '');
        const info = document.getElementById('last-journal-info');
        if (info) {
            info.textContent = state.language === 'ml' ? '✓ സൂക്ഷിച്ചു' : '✓ Saved';
            setTimeout(() => {
                const saved = JSON.parse(localStorage.getItem('chakra_journal') || '[]');
                info.textContent = saved.length > 0
                    ? (state.language === 'ml' ? 'അവസാന നമ്പർ: ' : 'Last entry: ') + saved[0].date
                    : '';
            }, 2000);
        }
    });
    const mixer = document.getElementById('volume-mixer');
    document.getElementById('btn-mixer').addEventListener('click', (e) => {
        console.log("Mixer button clicked. Current hidden state:", mixer.classList.contains('hidden'));
        e.stopPropagation();
        const isHidden = mixer.classList.toggle('hidden');
        console.log("Mixer toggled. New hidden state:", isHidden);
    });
    document.getElementById('close-mixer').addEventListener('click', (e) => {
        e.stopPropagation();
        mixer.classList.add('hidden');
    });
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
} // Closes attachEventListeners

init();
