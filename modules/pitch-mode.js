(function installPitchMode(global) {
    'use strict';

    // Pitch Mode: public, 2-minute "Choose Your Feeling" demo sessions.
    // Voice-guided (no mantra, drone or chakra journey). One very soft
    // background tone per mood plays only when No Frequency Mode is off. The text
    // follows the selected content language, but the voice is FIXED per
    // language and never follows the Settings voice or pace.

    const MOODS = Object.freeze(['calm', 'courage', 'energy', 'focus']);

    // Fixed young male Piper voice for each language (see docs/pitch-mode.md).
    const FIXED_VOICES = Object.freeze({
        en: 'piper:en_US-ryan-medium',
        hi: 'piper:hi_IN-pratham-medium',
        ru: 'piper:ru_RU-dmitri-medium',
        ml: 'piper:ml_IN-arjun-medium',
        ta: 'piper:ta_IN-rasa_male-medium'
    });
    const FIXED_PACE = 1;
    const narrationFeeling = global.ChakraNarrationFeeling || null;

    const SESSION_MS = 120000;
    // The spoken guide ends with room for the invite before the 2-minute mark.
    const INVITE_RESERVE_MS = 12000;
    const MIN_GAP_MS = 2500;
    const MAX_GAP_MS = 14000;

    const MOOD_AURA = Object.freeze({
        calm: 'radial-gradient(circle at center, rgba(79, 209, 197, 0.45), transparent 70%)',
        courage: 'radial-gradient(circle at center, rgba(246, 173, 85, 0.45), transparent 70%)',
        energy: 'radial-gradient(circle at center, rgba(245, 101, 101, 0.42), transparent 70%)',
        focus: 'radial-gradient(circle at center, rgba(127, 156, 245, 0.45), transparent 70%)'
    });

    // One very soft background tone per mood, only when No Frequency Mode is
    // off. Symbolic chakra tones already used in Lite: Calm = Heart 639 Hz,
    // Courage = Root 396 Hz, Energy = Solar Plexus 528 Hz, Focus = Third Eye
    // 852 Hz. A third of the chakra drone level. It follows the Drone Duration
    // setting like the chakra drones: Beginner 4 s, Intermediate 10 s,
    // Advanced 14 s, Expert 20 s from the start, with soft fades inside that time.
    const MOOD_TONES = Object.freeze({ calm: 639, courage: 396, energy: 528, focus: 852 });
    const TONE_LEVEL = 0.02;
    const TONE_DEFAULT_MS = 4000;
    const TONE_FADE_OUT_S = 1.5;

    // Fades take a quarter of the window each (0.5–1.5 s), so a 4 s tone still swells and settles.
    function toneEnvelope(durationMs) {
        const seconds = Math.max(2, Math.min(20, (Number(durationMs) || TONE_DEFAULT_MS) / 1000));
        const fade = Math.min(1.5, Math.max(0.5, seconds * 0.25));
        return { seconds, fade, steadyUntil: seconds - fade };
    }

    function startMoodTone(audio, mood, state, durationMs = TONE_DEFAULT_MS) {
        stopMoodTone(audio, 0.05);
        const frequency = MOOD_TONES[mood];
        if (state?.noFrequencyMode || !frequency || !audio?.ctx || !audio.masterGain) return false;
        const ctx = audio.ctx;
        const now = ctx.currentTime;
        const { seconds, fade, steadyUntil } = toneEnvelope(durationMs);
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(TONE_LEVEL, now + fade);
        gain.gain.setValueAtTime(TONE_LEVEL, now + steadyUntil);
        gain.gain.linearRampToValueAtTime(0, now + seconds);
        oscillator.connect(gain);
        gain.connect(audio.masterGain);
        oscillator.start(now);
        oscillator.stop(now + seconds + 0.05);
        oscillator.onended = () => {
            try { oscillator.disconnect(); gain.disconnect(); } catch (error) { /* already gone */ }
            if (audio.pitchMoodTone?.oscillator === oscillator) audio.pitchMoodTone = null;
        };
        audio.pitchMoodTone = { oscillator, gain, frequency, seconds };
        // Turning No Frequency Mode on mid-session stops it at once.
        audio.stopPitchTone = (fade = 0.3) => stopMoodTone(audio, fade);
        return true;
    }

    function stopMoodTone(audio, fadeSeconds = TONE_FADE_OUT_S) {
        const tone = audio?.pitchMoodTone;
        if (!tone || !audio.ctx) return false;
        audio.pitchMoodTone = null;
        const now = audio.ctx.currentTime;
        try {
            tone.gain.gain.cancelScheduledValues(now);
            tone.gain.gain.setValueAtTime(Math.max(0, tone.gain.gain.value), now);
            tone.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
            tone.oscillator.stop(now + fadeSeconds + 0.05);
        } catch (error) { /* already stopped */ }
        return true;
    }

    function fixedVoiceFor(language) {
        return FIXED_VOICES[language] || FIXED_VOICES.en;
    }

    // Spread the remaining quiet time evenly between the remaining lines.
    function gapBefore({ now, narrationEndsAt, linesLeft }) {
        if (linesLeft <= 0) return 0;
        const share = (narrationEndsAt - now) / linesLeft;
        return Math.max(MIN_GAP_MS, Math.min(MAX_GAP_MS, Math.floor(share)));
    }

    function scriptFor(mood, journeyT) {
        const steps = journeyT(`ui.pitch_${mood}_steps`);
        return [
            journeyT(`ui.pitch_${mood}_opening`),
            ...(Array.isArray(steps) ? steps : []),
            journeyT(`ui.pitch_${mood}_closing`)
        ].filter(line => typeof line === 'string' && line.trim());
    }

    function create() {
        let inviteResolve = null;

        function bindInvite({ document, onJourney, onAgain }) {
            const invite = document.getElementById('pitch-invite');
            const close = choice => {
                invite?.classList.add('hidden');
                if (choice === 'journey') onJourney?.();
                if (choice === 'again') onAgain?.();
                if (inviteResolve) { inviteResolve(choice); inviteResolve = null; }
            };
            document.getElementById('pitch-invite-journey')?.addEventListener('click', () => close('journey'));
            document.getElementById('pitch-invite-again')?.addEventListener('click', () => close('again'));
        }

        function showInvite(document) {
            const invite = document.getElementById('pitch-invite');
            if (!invite) return Promise.resolve(null);
            invite.classList.remove('hidden');
            document.getElementById('pitch-invite-journey')?.focus?.();
            return new Promise(resolve => { inviteResolve = resolve; });
        }

        async function start(owner, mood, deps) {
            const {
                state, document, piperTTS, isPiperVoice, wakeLock, showScreen, meditationScreen,
                setText, journeyT, setVoiceStatus, t, logError, now = () => Date.now(),
                toneDurationMs = () => TONE_DEFAULT_MS
            } = deps;
            if (!MOODS.includes(mood)) return false;
            if (owner.isStarting || owner.isMeditationActive || owner.isShotActive) return false;
            owner.isStarting = true;
            owner.isPitchActive = true;

            // Borrow the fixed voice for this session only; never saved.
            const previous = { voiceName: state.voiceName, voicePace: state.voicePace };
            state.voiceName = fixedVoiceFor(state.language);
            state.voicePace = FIXED_PACE;
            let restored = false;
            const restoreVoice = () => {
                if (restored) return;
                restored = true;
                state.voiceName = previous.voiceName;
                state.voicePace = previous.voicePace;
                if (isPiperVoice(previous.voiceName)) piperTTS.configure(previous.voiceName);
            };

            try {
                await owner.audio.init();
                await owner.audio.startBackgroundMusic();

                if (piperTTS.isSupported() && piperTTS.configure(state.voiceName)) {
                    // First use downloads the fixed voice; the 2-minute clock
                    // starts only once the voice is ready (or falls back).
                    try { await piperTTS.warmup(); }
                    catch (error) { setVoiceStatus(t('ui.piperLoadFailed'), 'error'); }
                }
                try { await wakeLock.request(); } catch (error) { /* optional */ }

                owner.isMeditationActive = true;
                owner.isPaused = false;
                owner.sessionItemRunner?.reset();
                owner.sessionStartedAt = now();
                owner.startSessionCountdown(SESSION_MS);
                document.getElementById('controls')?.classList.remove('hidden');
                setText('pause-meditation', 'II');
                owner.audio.fadeInBackgroundMusic(3);
                startMoodTone(owner.audio, mood, state, toneDurationMs());

                showScreen(meditationScreen);
                owner.visual?.stop?.();
                const aura = document.getElementById('aura-bg');
                if (aura) { aura.style.background = MOOD_AURA[mood]; aura.style.opacity = '1'; }
                setText('mantra-display', journeyT(`ui.pitch_${mood}_title`));
                owner.isStarting = false;

                const lines = scriptFor(mood, journeyT);
                // Each line gets a feeling: warm welcome, settling middle, mood-shaped close.
                const feelings = narrationFeeling ? narrationFeeling.pitchArc(mood, lines.length) : [];
                const narrationEndsAt = owner.sessionStartedAt + SESSION_MS - INVITE_RESERVE_MS;
                for (let index = 0; index < lines.length; index++) {
                    if (!owner.isMeditationActive) break;
                    await owner.narrate(lines[index], false, false, 'normal', 'none', feelings[index] || null);
                    if (!owner.isMeditationActive) break;
                    if (index < lines.length - 1) {
                        await owner.pauseAwareSleep(gapBefore({ now: now(), narrationEndsAt, linesLeft: lines.length - 1 - index }));
                    }
                }

                if (owner.isMeditationActive) {
                    // No completion statistics: a demo is not a journey.
                    stopMoodTone(owner.audio);
                    owner.stop();
                    restoreVoice();
                    await showInvite(document);
                }
                return true;
            } catch (error) {
                logError?.('Pitch Mode failed:', error);
                if (owner.isMeditationActive) owner.stop();
                return false;
            } finally {
                stopMoodTone(owner.audio, 0.3);
                restoreVoice();
                owner.isPitchActive = false;
                owner.isStarting = false;
            }
        }

        return Object.freeze({ start, bindInvite });
    }

    global.ChakraPitchMode = Object.freeze({
        create, MOODS, MOOD_TONES, TONE_LEVEL, toneEnvelope, startMoodTone, stopMoodTone, FIXED_VOICES, FIXED_PACE, SESSION_MS, INVITE_RESERVE_MS, fixedVoiceFor, gapBefore, scriptFor
    });
})(typeof window === 'undefined' ? globalThis : window);
