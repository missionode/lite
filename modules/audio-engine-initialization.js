(function installAudioEngineInitialization(global) {
    "use strict";

    async function initializeAudioEngine(dependencies) {
        const { audioWindow, state, VOICE_REVERB_TAIL_SECONDS, VOICE_REVERB_TAIL_DECAY, MUSIC_REVERB_TAIL_SECONDS, MUSIC_REVERB_TAIL_DECAY, MANTRA_REVERB_TAIL_SECONDS, MANTRA_REVERB_TAIL_DECAY, MANTRA_REVERB_TAIL_WET, PLEASURE_AMBIENCE_HARMONIC_MIX, getPleasureBlurMix } = dependencies;

        if (this.isInitialized) {
            if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
            return;
        }
        
        // Upgrade 1: Optimize context for playback fidelity
        this.ctx = new (audioWindow.AudioContext || audioWindow.webkitAudioContext)({
            latencyHint: 'playback',
            sampleRate: 44100
        });
    
        // Prefer the system default output on mobile so Web Audio follows the
        // loudspeaker route instead of an earpiece-specific route when the
        // browser exposes AudioContext.setSinkId. Unsupported browsers keep
        // their normal platform audio routing and must not block startup.
        if (typeof this.ctx.setSinkId === 'function') {
            try {
                await this.ctx.setSinkId('default');
            } catch (error) {
                console.warn('Default loudspeaker output selection unavailable:', error);
            }
        }
    
        // Crucial for mobile: Resume context on user gesture
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = state.volDrone; 
    
        this.voiceGain = this.ctx.createGain();
        this.voiceGain.gain.value = state.volVoice;
    
        // Upgrade 2: Studio Harmonic Exciter (Soft Clipper)
        // Only enabled in 'Open' mode for crispness. Disabled in 'Closed' for warmth.
        this.exciter = this.ctx.createWaveShaper();
        if (!state.eyesCloseMode) {
            this.exciter.curve = this.makeDistortionCurve(0.002); 
        } else {
            // Straight line curve = no distortion
            this.exciter.curve = new Float32Array([-1, 1]);
        }
        
        // Upgrade 4: Frequency Carving Filter. Keep the nodes in the graph
        // even when disabled so the mixer can safely change the setting live.
        this.voiceCarveFilter = this.ctx.createBiquadFilter();
        this.voiceCarveFilter.type = 'peaking';
        this.voiceCarveFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);
        this.voiceCarveFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
        this.voiceCarveFilter.gain.setValueAtTime(0, this.ctx.currentTime);
    
        this.presenceFilter = this.ctx.createBiquadFilter();
        this.presenceFilter.type = 'highshelf';
        this.presenceFilter.frequency.setValueAtTime(4000, this.ctx.currentTime);
        this.presenceFilter.gain.setValueAtTime(state.audioFilters ? (state.eyesCloseMode ? -6 : -3) : 0, this.ctx.currentTime);
    
        // Voice-only tone controls. These sit before the shared comfort chain
        // so tuning narration does not recolor the background music.
        this.voiceWarmthFilter = this.ctx.createBiquadFilter();
        this.voiceWarmthFilter.type = 'lowshelf';
        this.voiceWarmthFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
        this.voiceWarmthFilter.gain.setValueAtTime(0, this.ctx.currentTime);
    
        this.voiceClarityFilter = this.ctx.createBiquadFilter();
        this.voiceClarityFilter.type = 'peaking';
        this.voiceClarityFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.voiceClarityFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);
        this.voiceClarityFilter.gain.setValueAtTime(0, this.ctx.currentTime);
    
        // Voice Space is a diffuse filtered reverb, not a repeating echo. A
        // deterministic impulse makes the tail consistent on every device.
        this.voiceEchoSend = this.ctx.createGain();
        this.voiceEchoSend.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoDelay = this.ctx.createDelay(0.5);
        // Fixed pre-delay separates consonants from ambience without pitch
        // modulation when switching presets during a spoken phrase.
        this.voiceEchoDelay.delayTime.setValueAtTime(0.035, this.ctx.currentTime);
        this.voiceEchoLowCut = this.ctx.createBiquadFilter();
        this.voiceEchoLowCut.type = 'highpass';
        this.voiceEchoLowCut.frequency.setValueAtTime(180, this.ctx.currentTime);
        this.voiceEchoLowCut.Q.setValueAtTime(0.707, this.ctx.currentTime);
        this.voiceEchoConvolver = this.ctx.createConvolver();
        this.voiceEchoConvolver.buffer = this.createDiffuseReverbImpulse(
            VOICE_REVERB_TAIL_SECONDS,
            VOICE_REVERB_TAIL_DECAY,
            731
        );
        this.voiceEchoFilter = this.ctx.createBiquadFilter();
        this.voiceEchoFilter.type = 'lowpass';
        this.voiceEchoFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.voiceEchoWetGain = this.ctx.createGain();
        this.voiceEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.voiceEchoSend.connect(this.voiceEchoLowCut);
        this.voiceEchoLowCut.connect(this.voiceEchoDelay);
        this.voiceEchoDelay.connect(this.voiceEchoConvolver);
        this.voiceEchoConvolver.connect(this.voiceEchoFilter);
        this.voiceEchoFilter.connect(this.voiceEchoWetGain);
    
        this.lowCutFilter = this.ctx.createBiquadFilter();
        this.lowCutFilter.type = 'highpass';
        // Grounding: Allow deeper frequencies in Closed mode (40Hz vs 80Hz)
        this.lowCutFilter.frequency.setValueAtTime(state.eyesCloseMode ? 40 : 80, this.ctx.currentTime);
        this.lowCutFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);
    
        // Eyes Close Mode Filter
        this.eyesCloseFilter = this.ctx.createBiquadFilter();
        this.eyesCloseFilter.type = 'lowpass';
        // Keep the voice warm without removing Malayalam consonant detail.
        // The previous 2.2kHz ceiling was too dark for neural narration.
        this.eyesCloseFilter.frequency.setValueAtTime(
            state.eyesCloseMode ? 3200 : 5200,
            this.ctx.currentTime
        );
        this.eyesCloseFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
        this.eyesCloseFilter.gain.setValueAtTime(0, this.ctx.currentTime);
    
        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-24, this.ctx.currentTime); 
        this.masterCompressor.knee.setValueAtTime(30, this.ctx.currentTime); 
        this.masterCompressor.ratio.setValueAtTime(3.0, this.ctx.currentTime); 
        this.masterCompressor.attack.setValueAtTime(0.01, this.ctx.currentTime); 
        this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);
    
        // Final safety stage: catch short peaks from narration, bells, and
        // overlapping crossfades without changing the musical compressor.
        this.masterLimiter = this.ctx.createDynamicsCompressor();
        this.masterLimiter.threshold.setValueAtTime(-1.0, this.ctx.currentTime);
        this.masterLimiter.knee.setValueAtTime(0, this.ctx.currentTime);
        this.masterLimiter.ratio.setValueAtTime(20, this.ctx.currentTime);
        this.masterLimiter.attack.setValueAtTime(0.001, this.ctx.currentTime);
        this.masterLimiter.release.setValueAtTime(0.1, this.ctx.currentTime);
    
        this.bgMusicGain = this.ctx.createGain();
        this.bgMusicGain.gain.value = 0;
        
        // Deep Spectrum Carving
        this.bgMusicEQ = this.ctx.createBiquadFilter();
        this.bgMusicEQ.type = 'peaking';
        this.bgMusicEQ.gain.setValueAtTime(0, this.ctx.currentTime);
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
    
        // Background Music Space uses the same non-repeating diffuse design.
        // Its send is placed after the dry music tone shaping below.
        this.musicEchoSend = this.ctx.createGain();
        this.musicEchoSend.gain.setValueAtTime(0, this.ctx.currentTime);
        this.musicEchoDelay = this.ctx.createDelay(0.5);
        this.musicEchoDelay.delayTime.setValueAtTime(0.018, this.ctx.currentTime);
        this.musicEchoConvolver = this.ctx.createConvolver();
        this.musicEchoConvolver.buffer = this.createDiffuseReverbImpulse(
            MUSIC_REVERB_TAIL_SECONDS,
            MUSIC_REVERB_TAIL_DECAY,
            1777
        );
        this.musicEchoFilter = this.ctx.createBiquadFilter();
        this.musicEchoFilter.type = 'lowpass';
        this.musicEchoFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.musicEchoWetGain = this.ctx.createGain();
        this.musicEchoWetGain.gain.setValueAtTime(0, this.ctx.currentTime);
        // Stop new music from entering reverb at a transition while allowing
        // the already-created diffuse tail to settle naturally.
        this.musicEchoTailGate = this.ctx.createGain();
        this.musicEchoTailGate.gain.setValueAtTime(1, this.ctx.currentTime);
        this.musicEchoTailGate.connect(this.musicEchoSend);
        this.musicEchoSend.connect(this.musicEchoDelay);
        this.musicEchoDelay.connect(this.musicEchoConvolver);
        this.musicEchoConvolver.connect(this.musicEchoFilter);
        this.musicEchoFilter.connect(this.musicEchoWetGain);
    
        // The dry-music and reverb-tail gates are deliberately separate. A
        // mantra handoff ends new music input but preserves its soft decay.
        this.bgMusicBusGain = this.ctx.createGain();
        this.bgMusicBusGain.gain.setValueAtTime(1, this.ctx.currentTime);
    
        // Create the spatial buses before any source is connected to them.
        // Some browsers reject AudioNode.connect() when the destination is
        // still null, which would prevent the entire audio context starting.
        this.spatialMusicPanner = this.createSpatialPanner();
    
        this.bgMusicGain.connect(this.bgMusicEQ);
        this.bgMusicEQ.connect(this.bgMusicLPF);
        this.bgMusicLPF.connect(this.bgMusicHumFilter);
        this.bgMusicHumFilter.connect(this.bgMusicSmoothGain);
        this.bgMusicSmoothGain.connect(this.bgMusicBusGain);
        this.bgMusicSmoothGain.connect(this.musicEchoTailGate);
        this.musicEchoWetGain.connect(this.spatialMusicPanner);
        this.bgMusicBusGain.connect(this.spatialMusicPanner);
        this.spatialMusicPanner.connect(this.lowCutFilter);
        this.visualizationAmbienceGain = this.ctx.createGain();
        this.visualizationAmbienceGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.visualizationAmbienceGain.connect(this.spatialMusicPanner);
    
        // The optional pleasure ambience bypasses the background-music bus so
        // mantra muting cannot accidentally cut or reopen it. Keep the source
        // at unity so its parallel harmonic layer can work on the original
        // signal before both paths are reduced to the barely-audible mix level.
        this.pleasureSourceGain = this.ctx.createGain();
        this.pleasureSourceGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.pleasureGain = this.ctx.createGain();
        this.pleasureGain.gain.setValueAtTime(state.pleasureAmbienceGain, this.ctx.currentTime);
    
        // Parallel harmonic enrichment: the original ambience stays clean,
        // while a very quiet oversampled soft-clip path adds gentle presence.
        // This is dedicated to pleasure.mp3 and cannot colour narration,
        // mantras, drones, or background music.
        this.pleasureEnhancer = this.ctx.createWaveShaper();
        this.pleasureEnhancer.curve = this.makeDistortionCurve(0.12);
        this.pleasureEnhancer.oversample = '2x';
        this.pleasureEnhancerGain = this.ctx.createGain();
        this.pleasureEnhancerGain.gain.setValueAtTime(
            state.pleasureAmbienceGain * PLEASURE_AMBIENCE_HARMONIC_MIX,
            this.ctx.currentTime
        );
        this.pleasureBlurFilter = this.ctx.createBiquadFilter();
        this.pleasureBlurFilter.type = 'lowpass';
        this.pleasureBlurFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
        this.pleasureBlurFilter.Q.setValueAtTime(0.35, this.ctx.currentTime);
        this.pleasureBlurConvolver = this.ctx.createConvolver();
        this.pleasureBlurConvolver.buffer = this.createImpulseResponse(0.9, 4.5);
        this.pleasureBlurDryGain = this.ctx.createGain();
        this.pleasureBlurWetGain = this.ctx.createGain();
        const blurMix = getPleasureBlurMix(state.pleasureAmbienceBlur);
        this.pleasureBlurDryGain.gain.setValueAtTime(blurMix.dry, this.ctx.currentTime);
        this.pleasureBlurWetGain.gain.setValueAtTime(blurMix.wet, this.ctx.currentTime);
        this.spatialPleasurePanner = this.createSpatialPanner();
        if ('distanceModel' in this.spatialPleasurePanner) {
            this.spatialPleasurePanner.distanceModel = 'inverse';
            this.spatialPleasurePanner.refDistance = 1;
            this.spatialPleasurePanner.maxDistance = 100;
            this.spatialPleasurePanner.rolloffFactor = 0.55;
        }
        this.pleasureSpatialDepthGain = this.ctx.createGain();
        this.pleasureSpatialDepthGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.pleasureSourceGain.connect(this.pleasureGain);
        this.pleasureSourceGain.connect(this.pleasureEnhancer);
        this.pleasureEnhancer.connect(this.pleasureEnhancerGain);
        this.pleasureGain.connect(this.pleasureBlurDryGain);
        this.pleasureGain.connect(this.pleasureBlurFilter);
        this.pleasureEnhancerGain.connect(this.pleasureBlurDryGain);
        this.pleasureEnhancerGain.connect(this.pleasureBlurFilter);
        this.pleasureBlurFilter.connect(this.pleasureBlurConvolver);
        this.pleasureBlurDryGain.connect(this.pleasureSpatialDepthGain);
        this.pleasureBlurConvolver.connect(this.pleasureBlurWetGain);
        this.pleasureBlurWetGain.connect(this.pleasureSpatialDepthGain);
        this.pleasureSpatialDepthGain.connect(this.spatialPleasurePanner);
        this.spatialPleasurePanner.connect(this.lowCutFilter);
    
        this.bellGain = this.ctx.createGain();
        this.bellGain.gain.value = state.volBell;
        this.bellGain.connect(this.masterLimiter);
    
        this.pannerNode = this.ctx.createStereoPanner();
        
        const pannerLfo = this.ctx.createOscillator();
        const pannerLfoGain = this.ctx.createGain();
        pannerLfo.type = 'sine';
        pannerLfo.frequency.setValueAtTime(0.018, this.ctx.currentTime);
        pannerLfoGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.spatialPanLfoGain = pannerLfoGain;
        pannerLfo.connect(pannerLfoGain);
        pannerLfoGain.connect(this.pannerNode.pan);
        pannerLfo.start();
    
        // Keep the source buses separate until after their spatial treatment.
        // A PannerNode can render HRTF positioning for headphones; ordinary
        // speakers receive a safe stereo/equal-power fallback.
        this.spatialDronePanner = this.createSpatialPanner();
        this.spatialMantraPanner = this.createSpatialPanner();
    
        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.8;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.45;
    
        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
    
        this.masterGain.connect(this.delayNode);
        this.masterGain.connect(this.pannerNode);
        this.delayNode.connect(this.pannerNode);
        this.pannerNode.connect(this.spatialDronePanner);
        this.spatialDronePanner.connect(this.lowCutFilter);
    
        // Local Piper narration enters the same clarity/comfort chain as the
        // existing voice mix without being coupled to the drone gain.
        this.voiceGain.connect(this.voiceWarmthFilter);
        this.voiceWarmthFilter.connect(this.voiceClarityFilter);
        this.voiceClarityFilter.connect(this.lowCutFilter);
        this.voiceClarityFilter.connect(this.voiceEchoSend);
        this.voiceEchoWetGain.connect(this.lowCutFilter);
        
        let lastNode = this.lowCutFilter;
        // Inject Eyes Close Filter
        lastNode.connect(this.eyesCloseFilter);
        lastNode = this.eyesCloseFilter;
    
        if (this.voiceCarveFilter) {
            lastNode.connect(this.voiceCarveFilter);
            lastNode = this.voiceCarveFilter;
        }
        lastNode.connect(this.exciter);
        
        // One shared output path. Space comes only from the dedicated
        // voice, music and mantra convolution returns, not a filtered duplicate.
        if (this.presenceFilter) {
            this.exciter.connect(this.presenceFilter);
            this.presenceFilter.connect(this.masterCompressor);
        } else {
            this.exciter.connect(this.masterCompressor);
        }
        
        this.masterCompressor.connect(this.masterLimiter);
        this.masterLimiter.connect(this.ctx.destination);
    
        // Upgrade: Permanent Absolute Grounding Anchor (Closed Eyes Mode)
        if (state.eyesCloseMode && !state.noFrequencyMode) {
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
        // Mantras receive their own long, filtered tail. It is spatialized
        // with the mantra rather than being sent through narration or music.
        this.mantraTailConvolver = this.ctx.createConvolver();
        this.mantraTailConvolver.buffer = this.createImpulseResponse(
            MANTRA_REVERB_TAIL_SECONDS,
            MANTRA_REVERB_TAIL_DECAY
        );
        this.mantraTailFilter = this.ctx.createBiquadFilter();
        this.mantraTailFilter.type = 'lowpass';
        this.mantraTailFilter.frequency.setValueAtTime(4200, this.ctx.currentTime);
        this.mantraTailWetGain = this.ctx.createGain();
        this.mantraTailWetGain.gain.setValueAtTime(MANTRA_REVERB_TAIL_WET, this.ctx.currentTime);
        this.mantraGain.connect(this.mantraFilter);
        this.mantraFilter.connect(this.spatialMantraPanner);
        this.mantraFilter.connect(this.mantraTailConvolver);
        this.mantraTailConvolver.connect(this.mantraTailFilter);
        this.mantraTailFilter.connect(this.mantraTailWetGain);
        this.mantraTailWetGain.connect(this.spatialMantraPanner);
        this.spatialMantraPanner.connect(this.lowCutFilter);
    
        // Apply initial Eyes Close state
        this.toggleEyesCloseMode(state.eyesCloseMode);
    
        this.isInitialized = true;
        this.setVoiceTuning(state.voiceWarmth, state.voiceClarity);
        this.setVoiceEcho(state.voiceEcho);
        this.setMusicEcho(state.musicEcho);
        this.setSpatialMode(state.spatialMode);
        this.setPleasureAmbienceIntensity(state.pleasureAmbienceIntensity);
    }

    global.ChakraAudioEngineInitialization = Object.freeze({
        initialize(engine, dependencies) {
            return initializeAudioEngine.call(engine, dependencies);
        }
    });
})(typeof window === "undefined" ? globalThis : window);
