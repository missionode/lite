(function installPiperLifecycle(global) {
    'use strict';

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

    global.ChakraPiperLifecycle = Object.freeze({ createPiperTTS });
})(typeof window === 'undefined' ? globalThis : window);
