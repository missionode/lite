(function installMediaLifecycle(global) {
    'use strict';

    const constants = Object.freeze({
        PIPER_CLIP_FADE_SECONDS: 0.05,
        PIPER_CANCEL_FADE_SECONDS: 0.12
    });

    function stageFadeSeconds(durationSeconds) {
        const seconds = Number(durationSeconds);
        return Number.isFinite(seconds) ? Math.min(3, Math.max(0, seconds) * 0.2) : 0;
    }

    async function withAudioStageFade(audioEngine, seconds, action) {
        const previous = audioEngine.stageFadeWindow;
        const stageWindow = { limit: stageFadeSeconds(seconds) };
        audioEngine.stageFadeWindow = stageWindow;
        try {
            return await action();
        } finally {
            if (audioEngine.stageFadeWindow === stageWindow) audioEngine.stageFadeWindow = previous;
        }
    }

    // Bound each inference, including scripts without sentence punctuation.
    function splitNarrationText(text, limit = 180) {
        const chunks = [];
        for (const sentence of String(text).split(/[.!?।]/)) {
            let rest = Array.from(sentence.trim());
            while (rest.length > limit) {
                let cut = rest.slice(0, limit + 1).lastIndexOf(' ');
                if (cut < limit / 2) cut = limit;
                chunks.push(rest.splice(0, cut).join('').trim());
                while (rest[0] === ' ') rest.shift();
            }
            if (rest.length) chunks.push(rest.join(''));
        }
        return chunks;
    }

    class SeamlessLoop {
        static preparedBuffers = new WeakMap();

        constructor(ctx, buffer, destination, targetGain = 1.0, crossfadeDuration = 5) {
            this.ctx = ctx;
            this.buffer = buffer;
            this.destination = destination;
            this.targetGainValue = targetGain;
            this.crossfadeDuration = Math.min(crossfadeDuration, buffer.duration / 2);
            this.output = ctx.createGain();
            this.output.gain.setValueAtTime(targetGain, ctx.currentTime);
            this.output.connect(destination);
            this.activeSources = [];
            this.isRunning = false;
        }

        start(fadeInSeconds = 0) {
            if (this.isRunning) return;
            this.isRunning = true;
            if (fadeInSeconds > 0) {
                this.output.gain.setValueAtTime(0, this.ctx.currentTime);
                this.output.gain.linearRampToValueAtTime(this.targetGainValue, this.ctx.currentTime + fadeInSeconds);
            }
            try {
                this._startSource(this.ctx.currentTime + 0.01);
            } catch (error) {
                this.isRunning = false;
                this.output.disconnect();
                throw error;
            }
        }

        prepareBuffer() {
            const input = this.buffer;
            const overlap = Math.min(Math.floor(input.length / 2), Math.round(this.crossfadeDuration * input.sampleRate));
            if (!overlap) return input;
            let variants = SeamlessLoop.preparedBuffers.get(input);
            if (!variants) {
                variants = new Map();
                SeamlessLoop.preparedBuffers.set(input, variants);
            }
            if (variants.has(overlap)) return variants.get(overlap);
            const length = input.length - overlap;
            const output = this.ctx.createBuffer(input.numberOfChannels, input.length, input.sampleRate);
            // Bake one circular overlap once so the audio thread can repeat
            // indefinitely even when JavaScript timers are throttled.
            for (let channel = 0; channel < input.numberOfChannels; channel++) {
                const source = input.getChannelData(channel);
                const target = output.getChannelData(channel);
                target.set(source);
                for (let index = 0; index < overlap; index++) {
                    const angle = index / overlap * Math.PI / 2;
                    target[length + index] = source[length + index] * Math.cos(angle) + source[index] * Math.sin(angle);
                }
            }
            variants.set(overlap, output);
            return output;
        }

        _startSource(startTime) {
            if (!this.isRunning) return;

            const now = Math.max(startTime, this.ctx.currentTime + 0.01);
            const prepared = this.prepareBuffer();
            const source = this.ctx.createBufferSource();
            const gain = this.ctx.createGain();

            source.buffer = prepared;
            source.loop = true;
            source.loopStart = Math.min(
                Math.floor(this.buffer.length / 2),
                Math.round(this.crossfadeDuration * this.buffer.sampleRate)
            ) / this.buffer.sampleRate;
            source.loopEnd = source.buffer.duration;
            source.connect(gain);
            gain.connect(this.output);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(1, now + Math.min(0.03, this.crossfadeDuration));

            source.start(now);
            this.activeSources.push({ source, gain });

            source.onended = () => {
                source.disconnect();
                gain.disconnect();
                this.activeSources = this.activeSources.filter(active => active.source !== source);
                if (!this.isRunning && !this.activeSources.length) this.output.disconnect();
            };
        }

        setGain(value) {
            this.targetGainValue = value;
            const now = this.ctx.currentTime;
            const param = this.output.gain;
            const current = param.value;
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else {
                param.cancelScheduledValues(now);
                param.setValueAtTime(current, now);
            }
            param.linearRampToValueAtTime(value, now + 2);
        }

        stop(fadeTime = 4) {
            if (!this.isRunning) return;
            this.isRunning = false;

            const now = this.ctx.currentTime;
            const param = this.output.gain;
            const current = param.value;
            if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
            else {
                param.cancelScheduledValues(now);
                param.setValueAtTime(current, now);
            }
            param.linearRampToValueAtTime(0, now + fadeTime);
            this.activeSources.forEach(active => active.source.stop(now + fadeTime + 0.02));
        }
    }

    global.ChakraMediaLifecycle = Object.freeze({
        constants,
        stageFadeSeconds,
        withAudioStageFade,
        splitNarrationText,
        SeamlessLoop
    });
})(typeof window === 'undefined' ? globalThis : window);
