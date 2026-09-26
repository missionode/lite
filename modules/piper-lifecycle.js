(function installPiperLifecycle(global) {
    'use strict';

    const voiceProfile = Object.freeze({
        isPiperVoice(value) { return typeof value === 'string' && value.startsWith('piper:'); },
        voiceId(value) { return this.isPiperVoice(value) ? value.slice('piper:'.length) : ''; },
        definition(registry, value) {
            if (!this.isPiperVoice(value)) return null;
            return registry.find(voice => voice.id === this.voiceId(value)) || null;
        },
        paceMultiplier(definition) {
            const multiplier = Number(definition?.meditationPaceMultiplier);
            return Number.isFinite(multiplier) && multiplier > 0 && multiplier <= 1.15 ? multiplier : 1;
        },
        effectivePace(selectedPace, definition) {
            const selected = Number(selectedPace) || 1;
            const requestedMinimum = Number(definition?.meditationPaceMin);
            const minimum = Number.isFinite(requestedMinimum)
                ? Math.max(0.6, Math.min(0.7, requestedMinimum)) : 0.7;
            return Math.max(minimum, Math.min(1.15, selected * this.paceMultiplier(definition)));
        },
        meditationSettings(selectedPace, definition) {
            return {
                lengthScale: 1 / this.effectivePace(selectedPace, definition),
                lengthScaleMax: Number(definition?.meditationLengthScaleMax) || 1.35
            };
        },
        browserVoiceIsFeminine(value, selected) {
            const browserGender = String(selected?.gender || selected?.voiceGender || '').toLowerCase();
            if (browserGender) return browserGender === 'female';
            const name = `${selected?.name || ''} ${value || ''}`.toLowerCase();
            return /\b(female|woman|samantha|victoria|karen|moira|zira|ava|susan|veena|lekha|meera)\b/i.test(name);
        },
        isFeminine(value, definition, getBrowserVoice) {
            if (definition) return String(definition.gender || '').toLowerCase() === 'female';
            if (this.isPiperVoice(value)) return false;
            return this.browserVoiceIsFeminine(value, getBrowserVoice());
        },
        voiceMatchesLanguage(voice, prefixes) {
            if (!voice || !voice.lang) return false;
            const voiceLanguage = voice.lang.toLowerCase();
            return prefixes.some(prefix => voiceLanguage.startsWith(String(prefix).toLowerCase()));
        },
        browserVoice(value, voices, prefixes) {
            const browserName = String(value || '').replace(/^browser:/, '');
            const matches = voice => this.voiceMatchesLanguage(voice, prefixes);
            return voices.find(voice => voice.name === browserName && matches(voice))
                || voices.find(matches) || null;
        },
        selectVoice({ currentValue, registry, language, defaultVoiceId, browserVoices, browserPrefixes }) {
            const currentPiper = registry.find(voice => this.isPiperVoice(currentValue)
                && this.voiceId(currentValue) === voice.id && voice.language === language);
            if (currentPiper) return currentValue;
            const defaultPiper = registry.find(voice => voice.language === language && voice.id === defaultVoiceId)
                || registry.find(voice => voice.language === language);
            if (defaultPiper) return `piper:${defaultPiper.id}`;
            if (!browserVoices?.length) return 'browser:Default';
            const localized = browserVoices.filter(voice => this.voiceMatchesLanguage(voice, browserPrefixes));
            const premiumKeywords = ['premium', 'neural', 'natural', 'enhanced'];
            const selected = localized.find(voice => premiumKeywords.some(keyword => voice.name.toLowerCase().includes(keyword)))
                || localized[0];
            return selected ? `browser:${selected.name}` : null;
        }
    });

    async function loadVoiceRegistry(fetchImpl = global.fetch, logger = global.console) {
        try {
            const response = await fetchImpl('piper-models.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            return Array.isArray(json.voices) ? json.voices : [];
        } catch (error) {
            logger?.warn?.('Piper voice registry unavailable; browser voices remain available.', error);
            return [];
        }
    }

    function bindVoicePicker({ document = global.document, window = global, state, voiceSelect,
        piperVoices = [], voiceMatchesLanguage, autoSelectVoice, SpeechSynthesisUtteranceCtor = global.SpeechSynthesisUtterance } = {}) {
        if (!document || !window || !state || !voiceSelect || typeof voiceMatchesLanguage !== 'function'
            || typeof autoSelectVoice !== 'function') {
            throw new TypeError('Piper voice picker requires document, state, selection and locale services');
        }
        const updateUI = (availableVoices = []) => {
            state.voices = availableVoices;
            const currentValue = state.voiceName || voiceSelect.value;
            voiceSelect.innerHTML = '';
            piperVoices.filter(voice => voice.language === state.language).forEach(voice => {
                const option = document.createElement('option');
                option.value = `piper:${voice.id}`;
                option.textContent = `${voice.label} · local`;
                voiceSelect.appendChild(option);
            });
            const browserGroup = document.createElement('optgroup');
            browserGroup.label = 'Browser fallback voices';
            const defaultOption = document.createElement('option');
            defaultOption.value = 'browser:Default';
            defaultOption.textContent = 'System Default Voice';
            browserGroup.appendChild(defaultOption);
            availableVoices.filter(voice => voiceMatchesLanguage(voice)).forEach(voice => {
                const option = document.createElement('option');
                option.value = `browser:${voice.name}`;
                option.textContent = `${voice.name} (${voice.lang})`;
                browserGroup.appendChild(option);
            });
            voiceSelect.appendChild(browserGroup);
            if (Array.from(voiceSelect.options).some(option => option.value === currentValue)) voiceSelect.value = currentValue;
            else autoSelectVoice();
        };
        updateUI('speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => updateUI(window.speechSynthesis.getVoices());
            try {
                const dummy = new SpeechSynthesisUtteranceCtor('');
                dummy.volume = 0;
                window.speechSynthesis.speak(dummy);
            } catch (error) {}
        }
    }

    function createPiperTTS(audioEngine, dependencies = {}) {
        const deps = {
            voiceIdFromValue: dependencies.voiceIdFromValue || (() => ''),
            getVoiceDefinition: dependencies.getVoiceDefinition || (() => null),
            setVoiceStatus: dependencies.setVoiceStatus || (() => {}),
            translate: dependencies.translate || (key => key),
            getMeditationSettings: dependencies.getMeditationSettings || (() => ({ lengthScale: 1 })),
            getVoiceVolume: dependencies.getVoiceVolume || (() => 1),
            WorkerConstructor: dependencies.WorkerConstructor || global.Worker,
            WebAssemblyRuntime: dependencies.WebAssemblyRuntime || global.WebAssembly,
            workerUrl: dependencies.workerUrl || './piper-worker.js',
            clipFadeSeconds: Number.isFinite(dependencies.clipFadeSeconds) ? dependencies.clipFadeSeconds : 0.05,
            cancelFadeSeconds: Number.isFinite(dependencies.cancelFadeSeconds) ? dependencies.cancelFadeSeconds : 0.12
        };

        return new class PiperTTS {
            constructor(audio) {
                this.audio = audio;
                this.worker = null;
                this.voiceId = null;
                this.voiceDefinition = null;
                this.nextRequestId = 1;
                this.queue = [];
                this.activeJob = null;
                this.currentSource = null;
                this.currentClipGain = null;
                this.currentResolve = null;
                this.isCancelling = false;
                this.paused = false;
                this.generation = 0;
                this.normalizationGains = new WeakMap();
                this.clipCache = new Map();
                this.clipCacheBytes = 0;
            }

            isSupported() {
                return typeof deps.WorkerConstructor !== 'undefined' && typeof deps.WebAssemblyRuntime !== 'undefined' &&
                    !!(this.audio && this.audio.ctx && typeof this.audio.ctx.decodeAudioData === 'function');
            }

            configure(value) {
                const nextVoiceId = deps.voiceIdFromValue(value);
                if (!nextVoiceId) return false;
                if (this.voiceId && this.voiceId !== nextVoiceId) this.cancel('voice changed');
                this.voiceId = nextVoiceId;
                this.voiceDefinition = deps.getVoiceDefinition(nextVoiceId) || null;
                return true;
            }

            ensureWorker() {
                if (!this.worker) {
                    this.worker = new deps.WorkerConstructor(deps.workerUrl, { type: 'module' });
                    this.worker.onmessage = event => this.handleWorkerMessage(event.data || {});
                    this.worker.onerror = event => {
                        const message = event.message || 'Piper worker failed.';
                        deps.setVoiceStatus(deps.translate('ui.piperFallback'), 'error');
                        if (this.activeJob) this.finishActive(new Error(message));
                    };
                }
                return this.worker;
            }

            request(type, payload = {}) {
                if (!this.isSupported()) return Promise.reject(new Error('This browser cannot run Piper locally.'));
                const requestId = `piper-${Date.now()}-${this.nextRequestId++}`;
                return new Promise((resolve, reject) => {
                    this.queue.push({ requestId, type, payload, resolve, reject });
                    this.pump();
                });
            }

            pump() {
                if (this.activeJob || this.isCancelling || this.paused || this.queue.length === 0) return;
                const job = this.queue.shift();
                this.activeJob = job;
                this.ensureWorker().postMessage({
                    type: job.type,
                    requestId: job.requestId,
                    voiceId: this.voiceId,
                    voiceDefinition: this.voiceDefinition,
                    ...job.payload
                });
            }

            finishActive(error, value) {
                const job = this.activeJob;
                this.activeJob = null;
                if (!job) return;
                if (error) job.reject(error);
                else job.resolve(value);
                this.pump();
            }

            handleWorkerMessage(message) {
                if (message.type === 'progress') {
                    const total = Number(message.total) || 0;
                    const loaded = Number(message.loaded) || 0;
                    const percent = total > 0 ? ` ${Math.round((loaded / total) * 100)}%` : '';
                    deps.setVoiceStatus(`${deps.translate('ui.piperPreparing')}${percent}`);
                    return;
                }
                if (!this.activeJob || message.requestId !== this.activeJob.requestId) return;
                if (message.type === 'ready') {
                    deps.setVoiceStatus(deps.translate('ui.piperReady'), 'ready');
                    this.finishActive(null, true);
                } else if (message.type === 'audio') {
                    this.finishActive(null, message.audio);
                } else if (message.type === 'error') {
                    console.error('[Piper] worker error:', message.error || 'Piper synthesis failed.', message);
                    this.finishActive(new Error(message.error || 'Piper synthesis failed.'));
                }
            }

            warmup() {
                deps.setVoiceStatus(deps.translate('ui.piperPreparing'));
                return this.request('warmup');
            }

            synthesize(text) {
                return this.request('synthesize', { text, settings: deps.getMeditationSettings() });
            }

            getNormalizationGain(buffer) {
                if (this.normalizationGains.has(buffer)) return this.normalizationGains.get(buffer);
                let peak = 0;
                let sumSquares = 0;
                let sampleCount = 0;
                for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                    const samples = buffer.getChannelData(channel);
                    for (let index = 0; index < samples.length; index++) {
                        const sample = samples[index];
                        const magnitude = Math.abs(sample);
                        if (magnitude > peak) peak = magnitude;
                        sumSquares += sample * sample;
                        sampleCount++;
                    }
                }
                if (!peak || !sampleCount) return 1;
                const rms = Math.sqrt(sumSquares / sampleCount);
                let gain = rms > 0 ? 0.16 / rms : 1;
                gain = Math.min(gain, 0.85 / peak);
                const normalized = Math.max(0.7, Math.min(1.5, gain));
                this.normalizationGains.set(buffer, normalized);
                return normalized;
            }

            async decode(blob) {
                if (!blob) return;
                const arrayBuffer = await blob.arrayBuffer();
                return await this.audio.ctx.decodeAudioData(arrayBuffer) || null;
            }

            async prepare(text) {
                const generation = this.generation;
                const key = JSON.stringify([this.voiceId, this.voiceDefinition, deps.getMeditationSettings(), text]);
                if (this.clipCache.has(key)) {
                    const hit = this.clipCache.get(key);
                    this.clipCache.delete(key);
                    this.clipCache.set(key, hit);
                    return hit.buffer;
                }
                const blob = await this.synthesize(text);
                if (generation !== this.generation) throw new Error('Narration cancelled');
                const buffer = await this.decode(blob);
                if (generation !== this.generation) throw new Error('Narration cancelled');
                if (!buffer) throw new Error('Piper returned an empty audio clip.');
                this.getNormalizationGain(buffer);
                const bytes = buffer.length * buffer.numberOfChannels * 4;
                const budget = 16 * 1024 * 1024;
                if (bytes <= budget) {
                    while (this.clipCache.size && (this.clipCacheBytes + bytes > budget || this.clipCache.size >= 48)) {
                        const oldest = this.clipCache.keys().next().value;
                        this.clipCacheBytes -= this.clipCache.get(oldest).bytes;
                        this.clipCache.delete(oldest);
                    }
                    this.clipCache.set(key, { buffer, bytes });
                    this.clipCacheBytes += bytes;
                }
                return buffer;
            }

            async play(blob, volumeScale = 1, callbacks = {}) {
                const buffer = await this.decode(blob);
                return this.playBuffer(buffer, volumeScale, callbacks);
            }

            async playBuffer(buffer, volumeScale = 1, callbacks = {}) {
                if (!buffer || !this.audio.ctx) return;
                return new Promise(resolve => {
                    const source = this.audio.ctx.createBufferSource();
                    const clipGain = this.audio.ctx.createGain();
                    source.buffer = buffer;
                    source.connect(clipGain);
                    clipGain.connect(this.audio.voiceGain || this.audio.ctx.destination);
                    this.currentSource = source;
                    this.currentClipGain = clipGain;
                    this.currentResolve = resolve;
                    this.audio.setVoicePlaybackActive?.(true);
                    source.onended = () => {
                        source.disconnect();
                        clipGain.disconnect();
                        if (this.currentSource === source) {
                            this.audio.setVoicePlaybackActive?.(false);
                            this.currentSource = null;
                            this.currentClipGain = null;
                            this.currentResolve = null;
                        }
                        try { callbacks.onEnd?.({ duration: buffer.duration, endedAt: this.audio.ctx.currentTime }); }
                        catch (error) { console.warn('[Piper] playback end callback failed:', error); }
                        resolve({ duration: buffer.duration });
                    };
                    const now = this.audio.ctx.currentTime;
                    const requestedFadeIn = Number(callbacks.fadeInSeconds);
                    const requestedFadeOut = Number(callbacks.fadeOutSeconds);
                    const fadeInTime = Math.min(
                        Number.isFinite(requestedFadeIn) ? Math.max(0, requestedFadeIn) : deps.clipFadeSeconds,
                        buffer.duration / 4
                    );
                    const fadeOutTime = Math.min(
                        Number.isFinite(requestedFadeOut) ? Math.max(0, requestedFadeOut) : deps.clipFadeSeconds,
                        deps.clipFadeSeconds,
                        buffer.duration / 4
                    );
                    const normalizedGain = this.getNormalizationGain(buffer);
                    clipGain.gain.setValueAtTime(0, now);
                    clipGain.gain.linearRampToValueAtTime(normalizedGain, now + fadeInTime);
                    if (buffer.duration > fadeInTime + fadeOutTime) {
                        clipGain.gain.setValueAtTime(normalizedGain, now + buffer.duration - fadeOutTime);
                        clipGain.gain.linearRampToValueAtTime(0, now + buffer.duration);
                    }
                    if (this.audio.voiceGain) this.audio.voiceGain.gain.setValueAtTime(deps.getVoiceVolume() * volumeScale, now);
                    try { callbacks.onStart?.({ duration: buffer.duration, startedAt: now }); }
                    catch (error) { console.warn('[Piper] playback start callback failed:', error); }
                    source.start();
                });
            }

            async preview(text) {
                await this.warmup();
                const blob = await this.synthesize(text);
                await this.play(blob);
                deps.setVoiceStatus(deps.translate('ui.piperReady'), 'ready');
            }

            setPaused(paused) {
                this.paused = paused;
                if (!paused) this.pump();
            }

            cancel(reason = 'cancelled', options = {}) {
                const immediate = options.immediate === true;
                const fadeSeconds = Number.isFinite(options.fadeSeconds) ? options.fadeSeconds : deps.cancelFadeSeconds;
                this.audio.setVoicePlaybackActive?.(false, immediate ? 0 : fadeSeconds);
                this.generation++;
                this.isCancelling = true;
                if (this.activeJob && this.worker) this.worker.postMessage({ type: 'cancel', requestId: this.activeJob.requestId });
                if (this.currentSource) {
                    const source = this.currentSource;
                    const clipGain = this.currentClipGain;
                    if (!immediate && clipGain && this.audio?.ctx) {
                        const now = this.audio.ctx.currentTime;
                        try {
                            const held = Math.max(0, clipGain.gain.value);
                            if (clipGain.gain.cancelAndHoldAtTime) clipGain.gain.cancelAndHoldAtTime(now);
                            else {
                                clipGain.gain.cancelScheduledValues(now);
                                clipGain.gain.setValueAtTime(held, now);
                            }
                            clipGain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
                            source.stop(now + fadeSeconds + 0.02);
                        } catch (error) {
                            try { source.stop(); } catch (stopError) {}
                        }
                    } else {
                        try { source.stop(); } catch (error) {}
                    }
                    this.currentSource = null;
                    this.currentClipGain = null;
                }
                if (this.currentResolve) {
                    this.currentResolve();
                    this.currentResolve = null;
                }
                const error = new Error(`Piper ${reason}`);
                if (this.activeJob) this.finishActive(error);
                this.queue.splice(0).forEach(job => job.reject(error));
                if (this.worker) this.worker.terminate();
                this.worker = null;
                this.activeJob = null;
                this.isCancelling = false;
                this.paused = false;
            }
        }(audioEngine);
    }

    global.ChakraPiperLifecycle = Object.freeze({ createPiperTTS, voiceProfile, loadVoiceRegistry, bindVoicePicker });
})(typeof window === 'undefined' ? globalThis : window);
