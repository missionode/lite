(function installAudioElementalLayer(global) {
    "use strict";

    function start(owner, index, random = Math.random) {
        owner.elementalNodes.forEach(node => {
            try { node.lfo.stop(); } catch (error) {}
            try { node.src.stop(); } catch (error) {}
        });
        owner.elementalNodes = [];

        const noiseSrc = owner.ctx.createBufferSource();
        noiseSrc.buffer = owner.createNoiseBuffer();
        noiseSrc.loop = true;

        const filter = owner.ctx.createBiquadFilter();
        const gain = owner.ctx.createGain();
        gain.gain.setValueAtTime(0, owner.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.012, owner.ctx.currentTime + 5);

        const breezeLfo = owner.ctx.createOscillator();
        breezeLfo.type = 'sine';
        breezeLfo.frequency.setValueAtTime(0.02 + (random() * 0.02), owner.ctx.currentTime);

        const breezeGainMod = owner.ctx.createGain();
        breezeGainMod.gain.setValueAtTime(0.004, owner.ctx.currentTime);

        const breezeFreqMod = owner.ctx.createGain();
        breezeFreqMod.gain.setValueAtTime(index > 3 ? 1200 : 400, owner.ctx.currentTime);

        breezeLfo.connect(breezeGainMod);
        breezeGainMod.connect(gain.gain);
        breezeLfo.connect(breezeFreqMod);
        breezeFreqMod.connect(filter.frequency);
        breezeLfo.start();

        if (index === 0 || index === 1) {
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(index === 0 ? 100 : 250, owner.ctx.currentTime);
            filter.Q.setValueAtTime(0.2, owner.ctx.currentTime);
        } else if (index === 2 || index === 3) {
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(index === 2 ? 700 : 1200, owner.ctx.currentTime);
            filter.Q.setValueAtTime(1.5, owner.ctx.currentTime);
        } else {
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(3500 + (index * 300), owner.ctx.currentTime);
            filter.Q.setValueAtTime(0.4, owner.ctx.currentTime);
        }

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(owner.masterGain);
        noiseSrc.start();

        noiseSrc.onended = () => {
            try { breezeLfo.stop(); } catch (error) {}
            for (const node of [noiseSrc, filter, gain, breezeLfo, breezeGainMod, breezeFreqMod]) node.disconnect();
        };
        owner.elementalNodes.push({ src: noiseSrc, gain, lfo: breezeLfo });
    }

    global.ChakraAudioElementalLayer = Object.freeze({ start });
})(window);
