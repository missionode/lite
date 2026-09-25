(function installAudioMantraPlayback(global) {
    "use strict";

    async function play(owner, key, config) {
        const { state, mantraAudioMap, SeamlessLoop, musicFadeSeconds, tailWet } = config;
        if (state.noMantraMode) return;
        const filePath = mantraAudioMap[key];
        if (!filePath) return;

        const requestId = ++owner.mantraRequestId;
        owner.stopMantraTrack({ restoreMusic: false, invalidate: false });
        try {
            if (!owner.mantraBuffer[key]) {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP ${response.status} - Failed to fetch ${filePath}`);
                owner.mantraBuffer[key] = await owner.ctx.decodeAudioData(await response.arrayBuffer());
            }

            // Keep the ducked music bed alive while a first-use mantra is
            // loading; otherwise a slower decode creates an avoidable silence.
            if (requestId !== owner.mantraRequestId || state.noMantraMode) return;
            owner.muteBackgroundMusicForMantra(musicFadeSeconds);
            owner.setConvolverActive('mantra', owner.mantraFilter, owner.mantraTailConvolver, owner.mantraTailFilter, true);
            owner.mantraTailWetGain.gain.cancelScheduledValues(owner.ctx.currentTime);
            owner.mantraTailWetGain.gain.setValueAtTime(tailWet, owner.ctx.currentTime);
            owner.mantraLoop = new SeamlessLoop(owner.ctx, owner.mantraBuffer[key], owner.mantraGain, 1, 3.0);
            owner.mantraLoop.start(musicFadeSeconds);

            const lfo = owner.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.08, owner.ctx.currentTime);
            const lfoGain = owner.ctx.createGain();
            lfoGain.gain.setValueAtTime(250, owner.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(owner.mantraFilter.frequency);
            lfo.start();
            owner.mantraPresenceLFO = lfo;
            owner.mantraPresenceLFOGain = lfoGain;
            lfo.onended = () => { lfo.disconnect(); lfoGain.disconnect(); };

            const now = owner.ctx.currentTime;
            owner.mantraGain.gain.cancelScheduledValues(now);
            owner.mantraGain.gain.setValueAtTime(state.volMantra, now);
            if (owner.masterGain) {
                owner.masterGain.gain.cancelScheduledValues(now);
                owner.masterGain.gain.setValueAtTime(owner.masterGain.gain.value, now);
                owner.masterGain.gain.linearRampToValueAtTime(state.volDrone * 0.15, now + 8);
            }
            owner.elementalNodes.forEach(({ gain }) => {
                gain.gain.cancelScheduledValues(now);
                gain.gain.setValueAtTime(gain.gain.value, now);
                gain.gain.linearRampToValueAtTime(0, now + 5);
            });
        } catch (error) {
            console.error(`Audio Load Error (${key}):`, error);
            if (requestId === owner.mantraRequestId) owner.restoreBackgroundMusicAfterMantra();
        }
    }

    function stop(owner, options, config) {
        const { state, fadeSeconds: defaultFade, tailSeconds: defaultTail } = config;
        const { restoreMusic = true, invalidate = true, stageWindow = null } = options || {};
        const fadeSeconds = stageWindow === null ? defaultFade : Math.min(defaultFade, Math.max(0, Number(stageWindow) || 0) / 2);
        const tailSeconds = stageWindow === null ? defaultTail : Math.min(defaultTail, fadeSeconds);
        owner.setConvolverActive('mantra', owner.mantraFilter, owner.mantraTailConvolver, owner.mantraTailFilter, false, fadeSeconds + tailSeconds + 0.1);
        if (invalidate) owner.mantraRequestId += 1;
        if (!owner.mantraLoop) {
            if (restoreMusic) owner.restoreBackgroundMusicAfterMantra();
            return;
        }
        const now = owner.ctx.currentTime;
        if (stageWindow !== null && owner.mantraTailWetGain) {
            const wet = owner.mantraTailWetGain.gain;
            if (wet.cancelAndHoldAtTime) wet.cancelAndHoldAtTime(now);
            else { wet.cancelScheduledValues(now); wet.setValueAtTime(wet.value, now); }
            wet.setValueAtTime(wet.value, now + fadeSeconds);
            wet.linearRampToValueAtTime(0, now + fadeSeconds + tailSeconds);
        }
        if (owner.mantraPresenceLFO) {
            const modulation = owner.mantraPresenceLFOGain?.gain;
            if (modulation) {
                if (modulation.cancelAndHoldAtTime) modulation.cancelAndHoldAtTime(now);
                else { modulation.cancelScheduledValues(now); modulation.setValueAtTime(modulation.value, now); }
                modulation.linearRampToValueAtTime(0, now + fadeSeconds);
            }
            try { owner.mantraPresenceLFO.stop(now + fadeSeconds + 0.02); } catch (error) {}
            owner.mantraPresenceLFO = null;
            owner.mantraPresenceLFOGain = null;
        }
        if (owner.masterGain) {
            owner.masterGain.gain.cancelScheduledValues(now);
            owner.masterGain.gain.setValueAtTime(owner.masterGain.gain.value, now);
            owner.masterGain.gain.linearRampToValueAtTime(state.volDrone, now + 6);
        }
        owner.elementalNodes.forEach(({ gain }) => {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.015, now + 4);
        });
        owner.mantraLoop.stop(fadeSeconds);
        owner.mantraLoop = null;
        if (restoreMusic) owner.restoreBackgroundMusicAfterMantra(fadeSeconds);
    }

    global.ChakraAudioMantraPlayback = Object.freeze({ play, stop });
})(window);
