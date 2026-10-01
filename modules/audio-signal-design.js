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

    // Heavenly reverb impulse: soft early reflections, a dense diffuse tail
    // whose highs fade faster than its lows (air, not hiss), a 6 ms fade-in
    // (no click) and an energy match to the older diffuse impulse with the
    // same decay, so existing wet levels keep their loudness. Deterministic
    // per seed, so every device hears the same space. Stereo channels use
    // different seeds for a wide, open image.
    function createHeavenlyImpulse(audioContext, duration, decay, seed) {
        const sampleRate = audioContext.sampleRate;
        const length = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = audioContext.createBuffer(2, length, sampleRate);
        const fadeIn = Math.max(1, Math.floor(sampleRate * 0.006));
        const reflections = [0.011, 0.019, 0.027, 0.037, 0.048, 0.061];
        const targetEnergy = (length / 3) / (2 * decay + 1);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let randomState = (seed + (channel * 104729)) >>> 0;
            let smooth = 0;
            for (let i = 0; i < length; i++) {
                randomState = (1664525 * randomState + 1013904223) >>> 0;
                const noise = (randomState / 4294967296) * 2 - 1;
                const position = i / length;
                const envelope = Math.pow(1 - position, decay) * (i < fadeIn ? i / fadeIn : 1);
                // Darken over time: bright at the start, soft and airy later.
                const darkening = 0.12 + 0.78 * Math.min(1, position * 1.6);
                smooth = smooth * darkening + noise * (1 - darkening);
                data[i] = (smooth / Math.max(0.2, 1 - darkening * 0.85)) * envelope * 0.6;
            }
            reflections.forEach((time, index) => {
                const at = Math.floor(sampleRate * (time + channel * 0.0023));
                if (at < length) data[at] += (index % 2 ? -1 : 1) * 0.5 * Math.pow(0.78, index);
            });
            let energy = 0;
            for (let i = 0; i < length; i++) energy += data[i] * data[i];
            const scale = energy > 0 ? Math.sqrt(targetEnergy / energy) : 1;
            for (let i = 0; i < length; i++) data[i] *= scale;
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
        createHeavenlyImpulse,
        createNoiseBuffer
    });
})(window);
