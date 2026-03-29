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

// Audio Engine
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.droneOscillators = [];
        this.elementalNodes = [];
        this.masterGain = null;
        this.reverbNode = null;
        this.pannerNode = null;
        this.isInitialized = false;
        this.mantraSource = null;
        this.mantraGain = null;
        this.mantraBuffer = {};
        this.bgMusicSource = null;
        this.bgMusicBuffer = null;
    }

    async init() {
        if (this.isInitialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 

        // Background Music Gain
        this.bgMusicGain = this.ctx.createGain();
        this.bgMusicGain.gain.value = 0;
        this.bgMusicGain.connect(this.ctx.destination);

        // Dedicated Bell Gain (Bypasses master drone gain)
        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.ctx.destination);

        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.value = 0;
        
        const pannerLfo = this.ctx.createOscillator();
        pannerLfo.type = 'sine';
        pannerLfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
        pannerLfo.connect(this.pannerNode.pan);
        pannerLfo.start();

        this.reverbNode = this.ctx.createConvolver();
        this.reverbNode.buffer = this.createImpulseResponse(4, 3);

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.6;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.3;

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);

        this.masterGain.connect(this.delayNode);
        this.masterGain.connect(this.pannerNode);
        this.delayNode.connect(this.pannerNode);
        this.pannerNode.connect(this.reverbNode);
        this.reverbNode.connect(this.ctx.destination);

        this.mantraGain = this.ctx.createGain();
        this.mantraGain.gain.value = 0;
        this.mantraGain.connect(this.reverbNode);

        this.isInitialized = true;
    }

    createImpulseResponse(duration, decay) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.ctx.createBuffer(2, length, sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
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

        if (index === 0 || index === 1) {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(index === 0 ? 100 : 300, this.ctx.currentTime);
        } else if (index === 2 || index === 3) {
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(index === 2 ? 800 : 1500, this.ctx.currentTime);
            filter.Q.setValueAtTime(0.5, this.ctx.currentTime);
        } else {
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(3000 + (index * 500), this.ctx.currentTime);
        }

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noiseSrc.start();
        
        this.elementalNodes.push({ src: noiseSrc, gain: gain });
    }

    startDrone(baseFreq, index = 0) {
        this.stopDrone();
        // Use a static impulse response if already created
        if (!this._staticImpulse) this._staticImpulse = this.createImpulseResponse(4, 3);
        this.reverbNode.buffer = this._staticImpulse;
        
        this.startElementalLayer(index);
        
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(baseFreq * 0.002, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfo.start();
        this.vibrationLFO = lfo;

        // Reduced harmonics to save CPU
        const harmonics = [
            { f: 1.0, g: 0.2, type: 'sine' },
            { f: 0.5, g: 0.15, type: 'sine' }
        ];

        harmonics.forEach((h) => {
            // Reduced detuned oscillators from 3 to 1
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
    }

    stopDrone() {
        if (this.vibrationLFO) {
            try { this.vibrationLFO.stop(this.ctx.currentTime + 5); } catch(e) {}
            this.vibrationLFO = null;
        }
        this.droneOscillators.forEach(({ osc, gain }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(this.ctx.currentTime);
            gain.gain.setValueAtTime(currentVal, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 5);
            setTimeout(() => { try { osc.stop(); } catch(e) {} }, 5100);
        });
        this.droneOscillators = [];

        this.elementalNodes.forEach(({ src, gain }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(this.ctx.currentTime);
            gain.gain.setValueAtTime(currentVal, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 5);
            setTimeout(() => { try { src.stop(); } catch(e) {} }, 5100);
        });
        this.elementalNodes = [];
    }

    async playMantraTrack(key) {
        const filePath = MANTRA_AUDIO_MAP[key];
        if (!filePath) return; // silence (thirdeye / OM)

        this.stopMantraTrack();

        if (!this.mantraBuffer[key]) {
            const response = await fetch(filePath);
            const arrayBuffer = await response.arrayBuffer();
            this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);
        }

        const source = this.ctx.createBufferSource();
        source.buffer = this.mantraBuffer[key];
        source.loop = true;
        source.connect(this.mantraGain);
        source.start();
        this.mantraSource = source;

        // Fade in mantra, fade down drone
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

    async playBackgroundMusic() {
        if (!this.bgMusicBuffer) {
            const response = await fetch('audio/background_music.mp3');
            const arrayBuffer = await response.arrayBuffer();
            this.bgMusicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        }
        
        if (this.bgMusicSource) {
            try { this.bgMusicSource.stop(); } catch(e) {}
        }

        this.bgMusicSource = this.ctx.createBufferSource();
        this.bgMusicSource.buffer = this.bgMusicBuffer;
        this.bgMusicSource.loop = true;
        this.bgMusicSource.connect(this.bgMusicGain);
        this.bgMusicSource.start();

        const now = this.ctx.currentTime;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(0, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(state.volMusic, now + 3); 
    }

    stopBackgroundMusic() {
        if (!this.bgMusicSource) return;
        const now = this.ctx.currentTime;
        this.bgMusicGain.gain.cancelScheduledValues(now);
        this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
        this.bgMusicGain.gain.linearRampToValueAtTime(0, now + 3);
        
        const src = this.bgMusicSource;
        this.bgMusicSource = null;
        setTimeout(() => { try { src.stop(); } catch(e) {} }, 3100);
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
        if (!this.scripts) {
            const response = await fetch('scripts.json');
            this.scripts = await response.json();
        }

        await this.audio.init();
        await wakeLock.request();
        this.isMeditationActive = true;
        this.isPaused = false;
        this.isHighEnergy = document.getElementById('high-energy-toggle').checked;
        
        document.getElementById('pause-meditation').textContent = 'II';
        document.getElementById('completion-modal').classList.add('hidden');

        if (this.isMeditationActive) await this.runGratitude();
        if (this.isMeditationActive) await this.runBoxBreathing();
        
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
            await this.narrate(moonText);
            await new Promise(r => setTimeout(r, 1000));
        }

        // Main gratitude + body scan
        if (!this.isMeditationActive) return;
        tutTitle.textContent = state.language === 'ml' ? "കൃതജ്ഞത" : "Gratitude";
        const text = this.scripts.intro[`gratitude_${state.language}`];
        tutText.textContent = text;
        await this.narrate(text);

        // Intention Seed — woven in after gratitude
        if (this.isMeditationActive && state.intention && state.intention.trim()) {
            const intentionText = state.language === 'ml'
                ? `ഇന്ന് നിങ്ങൾ ക്ഷണിക്കുന്നത്: ${state.intention.trim()}. ഈ ഉദ്ദേശ്യം ഹൃദയത്തിൽ സൂക്ഷിക്കൂ — ഈ യാത്ര മുഴുവൻ അത് ഉള്ളിൽ ജ്വലിക്കട്ടെ.`
                : `You are calling in: ${state.intention.trim()}. Hold this in your heart — let it burn quietly through every moment of this journey.`;
            tutTitle.textContent = state.language === 'ml' ? "ഉദ്ദേശ്യം" : "Intention";
            tutText.textContent = intentionText;
            await this.narrate(intentionText);
        }

        if (this.isMeditationActive) await new Promise(r => setTimeout(r, 2000));
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
        const text = state.language === 'ml' ? "സൗകര്യപ്രദമായി ഇരിക്കുക. നമുക്ക് ശാന്തമായി ശ്വസിച്ചു തുടങ്ങാം." : "Sit comfortably. We will start with a centering breath.";
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
            utterance.onend = resolve;
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
        // Visual: warm gold aura, dim chakra symbol, star marker in mantra display
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(circle at center, #fff9c455, transparent)';
        aura.style.opacity = '1';
        document.getElementById('chakra-symbol').style.opacity = '0.1';
        document.getElementById('mantra-display').textContent = '✦';
        document.getElementById('narration-text').textContent = '';

        // Intro: "Repeat each phrase gently in your heart"
        await this.narrate(this.scripts.hooponopono.intro[state.language]);
        await new Promise(r => setTimeout(r, 2000));

        // 3 cycles of the 4 phrases
        const phrases = this.scripts.hooponopono.phrases[state.language];
        for (let cycle = 0; cycle < 3; cycle++) {
            if (!this.isMeditationActive) return;
            for (const phrase of phrases) {
                if (!this.isMeditationActive) return;
                document.getElementById('narration-text').textContent = phrase;
                await this.narrate(phrase);
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        // Closing breath
        document.getElementById('narration-text').textContent = '';
        await this.narrate(this.scripts.hooponopono.closing[state.language]);
        await new Promise(r => setTimeout(r, 3000));
    }

    async handleInterval() {
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
        this.audio.startDrone(chakra.frequency, index);
        this.visual.startPulsing(chakra.color);
        await this.narrate(chakra[state.language]);
        if (!this.isMeditationActive) return;

        // Start looping mantra audio track (fades in, drone fades down)
        await this.audio.playMantraTrack(key);

        const chantDurationMs = (state.timePerChakra * 60 * 1000) - 15000;
        let elapsed = 0;
        const timerEl = document.getElementById('timer-display');

        // Subliminal whisper — fires 30s into mantra, non-blocking
        const subliminalDelay = Math.min(30000, chantDurationMs * 0.3);
        const subliminalTimer = setTimeout(() => {
            if (this.isMeditationActive && !this.isPaused) {
                this.narrateSubliminal(chakra[`affirmation_${state.language}`]);
            }
        }, subliminalDelay);

        while (elapsed < chantDurationMs) {
            if (!this.isMeditationActive) { clearTimeout(subliminalTimer); break; }
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
        await new Promise(r => setTimeout(r, 4000));

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
            utterance.onend = resolve;
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrate(text) {
        // Start background music
        await this.audio.playBackgroundMusic();
        // 2.5 second gap before narration starts
        await new Promise(r => setTimeout(r, 2500));

        const sentences = text.split(/[.!?।]/).filter(s => s.trim().length > 0);
        for (const sentence of sentences) {
            if (!this.isMeditationActive) break;
            while (this.isPaused && this.isMeditationActive) await new Promise(r => setTimeout(r, 100));
            await new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                const selectedVoice = state.voices.find(v => v.name === state.voiceName);
                if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
                // Authoritative Tuning: Deep pitch, confident rate
                utterance.rate   = state.sleepMode ? 0.55 : 0.68;
                utterance.pitch  = state.sleepMode ? 0.70 : 0.78;
                utterance.volume = state.sleepMode ? state.volVoice * 0.55 : state.volVoice;
                utterance.onend = resolve;
                window.speechSynthesis.speak(utterance);
            });
            // Increased pause between sentences for "Authoritative" weight
            await new Promise(r => setTimeout(r, state.sleepMode ? 2000 : 1500));
        }

        // 2.5 second gap after narration stops
        await new Promise(r => setTimeout(r, 2500));
        // Stop background music
        this.audio.stopBackgroundMusic();
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
        this.isMeditationActive = false; this.visual.stop(); this.audio.stopDrone(); this.audio.stopMantraTrack(); this.audio.stopBackgroundMusic(); wakeLock.release();
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
    volVoice: parseFloat(localStorage.getItem('chakra_vol_voice')) || 1.0,
    volDrone: parseFloat(localStorage.getItem('chakra_vol_drone')) || 0.06,
    volBell: parseFloat(localStorage.getItem('chakra_vol_bell')) || 0.05,
    volMantra: parseFloat(localStorage.getItem('chakra_vol_mantra')) || 0.8,
    volMusic: parseFloat(localStorage.getItem('chakra_vol_music')) || 0.15,
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
    document.getElementById('vol-voice').value = state.volVoice;
    document.getElementById('vol-drone').value = state.volDrone;
    document.getElementById('vol-bell').value = state.volBell;
    document.getElementById('vol-mantra').value = state.volMantra;
    document.getElementById('vol-music').value = state.volMusic;
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
    document.getElementById('vol-voice').addEventListener('input', (e) => {
        state.volVoice = parseFloat(e.target.value);
        localStorage.setItem('chakra_vol_voice', state.volVoice);
    });
    document.getElementById('vol-drone').addEventListener('input', (e) => {
        state.volDrone = parseFloat(e.target.value);
        localStorage.setItem('chakra_vol_drone', state.volDrone);
        if (audio.masterGain) audio.masterGain.gain.setValueAtTime(state.volDrone, audio.ctx.currentTime);
    });
    document.getElementById('vol-bell').addEventListener('input', (e) => {
        state.volBell = parseFloat(e.target.value);
        localStorage.setItem('chakra_vol_bell', state.volBell);
        if (audio.bellGain) {
            audio.bellGain.gain.setValueAtTime(state.volBell, audio.ctx.currentTime);
        }
    });
    document.getElementById('vol-mantra').addEventListener('input', (e) => {
        state.volMantra = parseFloat(e.target.value);
        localStorage.setItem('chakra_vol_mantra', state.volMantra);
        if (audio.mantraGain && audio.mantraSource) {
            audio.mantraGain.gain.setValueAtTime(state.volMantra, audio.ctx.currentTime);
        }
    });
    document.getElementById('vol-music').addEventListener('input', (e) => {
        state.volMusic = parseFloat(e.target.value);
        localStorage.setItem('chakra_vol_music', state.volMusic);
        if (audio.bgMusicGain && audio.bgMusicSource) {
            audio.bgMusicGain.gain.setValueAtTime(state.volMusic, audio.ctx.currentTime);
        }
    });
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
