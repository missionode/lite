(function installAudioDroneStop(global) {
    "use strict";

    function stopBinaural(owner) {
        if (!owner.ctx) {
            owner.binauralNodes = [];
            return;
        }
        const now = owner.ctx.currentTime;
        owner.binauralNodes.forEach(node => {
            if (typeof global.AudioParam !== 'undefined' && node instanceof global.AudioParam) return;
            try {
                if (node.gain) {
                    node.gain.cancelScheduledValues(now);
                    node.gain.setValueAtTime(node.gain.value, now);
                    node.gain.linearRampToValueAtTime(0, now + 5);
                } else {
                    node.stop(now + 5);
                }
            } catch (error) {}
        });
        owner.binauralNodes = [];
    }

    function stopDrone(owner) {
        if (!owner.ctx) {
            owner.binauralNodes = [];
            owner.droneOscillators = [];
            owner.groundingAnchor = null;
            owner.elementalNodes = [];
            owner.vibrationLFO = null;
            return;
        }
        owner.stopBinaural();
        const now = owner.ctx.currentTime;

        if (owner.vibrationLFO) {
            try { owner.vibrationLFO.stop(now + 5); } catch (error) {}
            owner.vibrationLFO = null;
        }
        owner.droneOscillators.forEach(({ osc, gain }) => {
            const currentVal = gain.gain.value;
            if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now);
            else { gain.gain.cancelScheduledValues(now); gain.gain.setValueAtTime(currentVal, now); }
            gain.gain.linearRampToValueAtTime(0, now + 5);
            try { osc.stop(now + 5.1); } catch (error) {}
        });
        owner.droneOscillators = [];

        if (owner.groundingAnchor) {
            const currentVal = owner.groundingAnchor.gain.gain.value;
            owner.groundingAnchor.gain.gain.cancelScheduledValues(now);
            owner.groundingAnchor.gain.gain.setValueAtTime(currentVal, now);
            owner.groundingAnchor.gain.gain.linearRampToValueAtTime(0, now + 5);
            const anchorOsc = owner.groundingAnchor.osc;
            try { anchorOsc.stop(now + 5.1); } catch (error) {}
            owner.groundingAnchor = null;
        }

        owner.elementalNodes.forEach(({ src, gain, lfo }) => {
            const currentVal = gain.gain.value;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(currentVal, now);
            gain.gain.linearRampToValueAtTime(0, now + 5);
            try { src.stop(now + 5.1); } catch (error) {}
            try { lfo.stop(now + 5.1); } catch (error) {}
        });
        owner.elementalNodes = [];
    }

    global.ChakraAudioDroneStop = Object.freeze({ stopBinaural, stopDrone });
})(window);
