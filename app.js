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
    }

    async init() {
        if (this.isInitialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 

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
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
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
        const reverbDuration = 2 + (index * 0.5);
        const reverbDecay = 1 + (index * 0.5);
        this.reverbNode.buffer = this.createImpulseResponse(reverbDuration, reverbDecay);
        this.startElementalLayer(index);
        
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(baseFreq * 0.002, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfo.start();
        this.vibrationLFO = lfo;

        const harmonics = [
            { f: 1.0, g: 0.2, type: 'sine' },
            { f: 0.5, g: 0.15, type: 'sine' },
            { f: 1.5, g: 0.08, type: 'sine' }
        ];

        harmonics.forEach((h) => {
            [-0.001, 0, 0.001].forEach(offset => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = h.type;
                osc.frequency.setValueAtTime(baseFreq * (h.f + offset), this.ctx.currentTime);
                lfoGain.connect(osc.frequency);
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(baseFreq * 1.2, this.ctx.currentTime);
                filter.Q.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.setValueAtTime(0, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(h.g / 3, this.ctx.currentTime + 5);
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                this.droneOscillators.push({ osc, gain });
            });
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
        this.animationId = null;
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starsAnimId = null;
        this.particleColor = '#ffffff';
        this.isEmitting = false;
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
        this.generateStars();
        this.animateStars();
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.stars && this.stars.length > 0) this.generateStars();
    }
    generateStars() {
        this.stars = [];
        const count = 60;
        for (let i = 0; i < count; i++) {
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
        const ctx = this.ctx;
        const draw = (time) => {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const t = time * 0.001;
            this.stars.forEach(star => {
                const opacity = star.baseOpacity + (1 - star.baseOpacity) * 0.5 * (1 + Math.sin(t * star.speed + star.phase));
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            });
            this.starsAnimId = requestAnimationFrame(draw);
        };
        this.starsAnimId = requestAnimationFrame(draw);
    }
    emitParticles() {
        if (!this.isEmitting) return;
        // Faster emission for a richer feel
        if (Math.random() > 0.6) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: 1.0,
                // Dynamic Radius
                radius: Math.random() * 5 + 2,
                maxRadius: Math.random() * 30 + 10,
                growth: Math.random() * 0.2 + 0.1
            });
        }
    }

    startPulsing(color) {
        this.particleColor = color;
        this.isEmitting = true;
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
    stop() {
        cancelAnimationFrame(this.animationId);
        this.isEmitting = false;
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

        tutTitle.textContent = state.language === 'ml' ? "കൃതജ്ഞത" : "Gratitude";
        const text = this.scripts.intro[`gratitude_${state.language}`];
        tutText.textContent = text;

        await this.narrate(text);
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
        await new Promise(r => setTimeout(r, 4000));

        if (this.isMeditationActive) await this.narrate(chakra[`affirmation_${state.language}`]);
    }

    async narrateFeeble(text) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = state.voices.find(v => v.name === state.voiceName);
            if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
            // Normal calm speed, no longer stretchy
            utterance.rate = 0.8; 
            utterance.pitch = 0.9; 
            utterance.volume = state.volVoice * 0.6;
            utterance.onend = resolve;
            window.speechSynthesis.speak(utterance);
        });
    }

    async narrate(text) {
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
        for (const sentence of sentences) {
            if (!this.isMeditationActive) break;
            while (this.isPaused && this.isMeditationActive) await new Promise(r => setTimeout(r, 100));
            await new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                const selectedVoice = state.voices.find(v => v.name === state.voiceName);
                if (selectedVoice) { utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; }
                utterance.rate = 0.65; utterance.pitch = 0.85; utterance.volume = state.volVoice;
                utterance.onend = resolve;
                window.speechSynthesis.speak(utterance);
            });
            await new Promise(r => setTimeout(r, 500));
        }
    }

    async handleSilence() {
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
        this.isMeditationActive = false; this.visual.stop(); this.audio.stopDrone(); this.audio.stopMantraTrack(); wakeLock.release();
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
        const modal = document.getElementById('completion-modal');
        const title = document.getElementById('completion-title');
        const msg = document.getElementById('completion-message');
        const btn = document.getElementById('close-completion');
        title.textContent = state.language === 'ml' ? "യാത്ര പൂർത്തിയായി" : "Journey Complete";
        msg.textContent = state.language === 'ml' ? "ധ്യാനം പൂർത്തിയായി. അനുഗ്രഹിക്കപ്പെടട്ടെ." : "Meditation Completed. Stay Blessed.";
        btn.textContent = state.language === 'ml' ? "തിരികെ പോവുക" : "Return to Room";
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
    volBell: parseFloat(localStorage.getItem('chakra_vol_bell')) || 0.5,
    volMantra: parseFloat(localStorage.getItem('chakra_vol_mantra')) || 0.8,
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
        // Broad search for Malayalam
        bestVoice = state.voices.find(v => v.lang === 'ml-IN' || v.lang === 'ml_IN') || 
                    state.voices.find(v => v.lang.startsWith('ml')) ||
                    state.voices.find(v => v.name.toLowerCase().includes('malayalam'));
    } else {
        // Standard English selection
        bestVoice = state.voices.find(v => v.lang === 'en-US' || v.lang === 'en_US') || 
                    state.voices.find(v => v.lang.startsWith('en'));
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
