(function installAudioSignalDesign(global) {
    "use strict";

    function makeDistortionCurve(amount) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    function createImpulseResponse(audioContext, duration, decay, random = Math.random) {
        const sampleRate = audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = audioContext.createBuffer(2, length, sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const envelope = Math.pow(1 - i / length, decay);
                data[i] = (random() * 2 - 1) * envelope;
            }
        }
        return buffer;
    }

    function createDiffuseReverbImpulse(audioContext, duration, decay, seed) {
        const sampleRate = audioContext.sampleRate;
        const length = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = audioContext.createBuffer(2, length, sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let randomState = (seed + (channel * 104729)) >>> 0;
            for (let i = 0; i < length; i++) {
                randomState = (1664525 * randomState + 1013904223) >>> 0;
                const noise = (randomState / 4294967296) * 2 - 1;
                const envelope = Math.pow(1 - (i / length), decay);
                data[i] = noise * envelope;
            }
        }
        return buffer;
    }

    function createNoiseBuffer(audioContext, random = Math.random) {
        const bufferSize = audioContext.sampleRate * 2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = random() * 2 - 1;
        return buffer;
    }

    global.ChakraAudioSignalDesign = Object.freeze({
        makeDistortionCurve,
        createImpulseResponse,
        createDiffuseReverbImpulse,
        createNoiseBuffer
    });
})(window);
