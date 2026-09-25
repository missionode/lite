(function installAudioDroneStart(global) {
    "use strict";

    function startDrone(owner, baseFreq, index, state) {
        owner.stopDrone();
        if (state.noFrequencyMode) return;
        if (!owner.ctx) return;

        owner.startElementalLayer(index);
        const requestedFrequency = Number(baseFreq);
        const safeBaseFrequency = Number.isFinite(requestedFrequency) && requestedFrequency >= 1
            ? Math.min(requestedFrequency, 20000)
            : 110;
        const droneFreq = safeBaseFrequency;

        const mainOscillator = owner.ctx.createOscillator();
        const mainDroneGain = owner.ctx.createGain();
        mainOscillator.type = 'sine';
        mainOscillator.frequency.setValueAtTime(droneFreq, owner.ctx.currentTime);
        const mainDroneFilter = owner.ctx.createBiquadFilter();
        mainDroneFilter.type = 'lowpass';
        mainDroneFilter.frequency.setValueAtTime(Math.min(droneFreq * 4, owner.ctx.sampleRate * 0.45), owner.ctx.currentTime);
        mainDroneFilter.Q.setValueAtTime(0.5, owner.ctx.currentTime);
        mainDroneGain.gain.setValueAtTime(0, owner.ctx.currentTime);
        mainDroneGain.gain.linearRampToValueAtTime(0.06, owner.ctx.currentTime + 6);
        mainOscillator.connect(mainDroneFilter);
        mainDroneFilter.connect(mainDroneGain);
        mainDroneGain.connect(owner.masterGain);
        mainOscillator.start();
        mainOscillator.onended = () => {
            mainOscillator.disconnect(); mainDroneFilter.disconnect(); mainDroneGain.disconnect();
        };
        owner.droneOscillators.push({ osc: mainOscillator, gain: mainDroneGain });

        const binauralCarrier = Math.min(droneFreq, 80);
        const leftOsc = owner.ctx.createOscillator();
        const rightOsc = owner.ctx.createOscillator();
        const leftPanner = owner.ctx.createStereoPanner();
        const rightPanner = owner.ctx.createStereoPanner();
        const binauralGain = owner.ctx.createGain();
        leftPanner.pan.setValueAtTime(-1, owner.ctx.currentTime);
        rightPanner.pan.setValueAtTime(1, owner.ctx.currentTime);
        leftOsc.frequency.setValueAtTime(binauralCarrier, owner.ctx.currentTime);
        const drift = state.eyesCloseMode ? 2.0 : 0;
        rightOsc.frequency.setValueAtTime(binauralCarrier + drift, owner.ctx.currentTime);
        binauralGain.gain.setValueAtTime(0, owner.ctx.currentTime);
        binauralGain.gain.linearRampToValueAtTime(0.002, owner.ctx.currentTime + 10);
        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);
        leftPanner.connect(binauralGain);
        rightPanner.connect(binauralGain);
        binauralGain.connect(owner.masterGain);
        leftOsc.start();
        rightOsc.start();
        let remaining = 2;
        const finishSupport = osc => () => {
            osc.disconnect();
            if (--remaining === 0) { leftPanner.disconnect(); rightPanner.disconnect(); binauralGain.disconnect(); }
        };
        leftOsc.onended = finishSupport(leftOsc);
        rightOsc.onended = finishSupport(rightOsc);
        owner.binauralNodes = [leftOsc, rightOsc, binauralGain];
    }

    function startSleepDrone(owner, beatFrequency, state) {
        owner.stopDrone();
        if (state.noFrequencyMode) return;
        if (!owner.ctx) return;

        const requestedBeat = Number(beatFrequency);
        const beat = Number.isFinite(requestedBeat) ? Math.min(20000, Math.max(0.1, requestedBeat)) : 6;
        const now = owner.ctx.currentTime;
        const carrier = 80;
        const mainOscillator = owner.ctx.createOscillator();
        const mainGain = owner.ctx.createGain();
        const mainFilter = owner.ctx.createBiquadFilter();
        mainOscillator.type = 'sine';
        mainOscillator.frequency.setValueAtTime(beat, now);
        mainFilter.type = 'lowpass';
        mainFilter.frequency.setValueAtTime(220, now);
        mainFilter.Q.setValueAtTime(0.5, now);
        mainGain.gain.setValueAtTime(0, now);
        mainGain.gain.linearRampToValueAtTime(0.06, now + 6);
        mainOscillator.connect(mainFilter);
        mainFilter.connect(mainGain);
        mainGain.connect(owner.masterGain);
        mainOscillator.start(now);
        mainOscillator.onended = () => {
            mainOscillator.disconnect(); mainFilter.disconnect(); mainGain.disconnect();
        };
        owner.droneOscillators.push({ osc: mainOscillator, gain: mainGain });

        const leftOsc = owner.ctx.createOscillator();
        const rightOsc = owner.ctx.createOscillator();
        const leftPanner = owner.ctx.createStereoPanner();
        const rightPanner = owner.ctx.createStereoPanner();
        const binauralGain = owner.ctx.createGain();
        leftPanner.pan.setValueAtTime(-1, now);
        rightPanner.pan.setValueAtTime(1, now);
        leftOsc.frequency.setValueAtTime(carrier, now);
        rightOsc.frequency.setValueAtTime(carrier + beat, now);
        binauralGain.gain.setValueAtTime(0, now);
        binauralGain.gain.linearRampToValueAtTime(0.002, now + 10);
        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);
        leftPanner.connect(binauralGain);
        rightPanner.connect(binauralGain);
        binauralGain.connect(owner.masterGain);
        leftOsc.start(now);
        rightOsc.start(now);
        let remaining = 2;
        const finishSupport = osc => () => {
            osc.disconnect();
            if (--remaining === 0) { leftPanner.disconnect(); rightPanner.disconnect(); binauralGain.disconnect(); }
        };
        leftOsc.onended = finishSupport(leftOsc);
        rightOsc.onended = finishSupport(rightOsc);
        owner.binauralNodes = [leftOsc, rightOsc, binauralGain];
    }

    global.ChakraAudioDroneStart = Object.freeze({ startDrone, startSleepDrone });
})(window);
