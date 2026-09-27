(function () {
    function create() {
        async function run(owner, text, fadeOut, keepSilence, volumeScale, pacing, transition, deps) {
            const { state, piperTTS, timing, splitNarrationText, piperClipFadeSeconds, mantraFadeSeconds, setVoiceStatus, fallbackMessage, setTimeout } = deps;
            if (!text || (!owner.isMeditationActive && !fadeOut)) return;
            if (!keepSilence) owner.audio.fadeInBackgroundMusic(6, true);
            if (owner.audio.voiceCarveFilter) {
                owner.audio.voiceCarveFilter.gain.cancelScheduledValues(owner.audio.ctx.currentTime);
                owner.audio.voiceCarveFilter.gain.setValueAtTime(owner.audio.voiceCarveFilter.gain.value, owner.audio.ctx.currentTime);
                owner.audio.voiceCarveFilter.gain.linearRampToValueAtTime(
                    state.eyesCloseMode ? 0.75 : 1.0,
                    owner.audio.ctx.currentTime + 1.2
                );
            }
            const leadIn = pacing === 'hrim'
                ? timing('narration', 'hrimLeadIn', timing('narration', 'piperLeadIn'))
                : timing('narration', 'piperLeadIn');
            const sentenceGap = pacing === 'hrim'
                ? timing('narration', 'hrimSentenceGap', timing('narration', 'sentenceGap'))
                : timing('narration', 'sentenceGap');
            await owner.pauseAwareSleep(leadIn * 1000);

            const sentences = splitNarrationText(text);
            const generation = piperTTS.generation;
            const queueSynthesis = sentence => {
                const job = piperTTS.prepare(sentence);
                job.catch(() => {});
                return job;
            };
            let pending = sentences.length ? queueSynthesis(sentences[0]) : null;
            let piperFailed = false;

            for (let i = 0; i < sentences.length; i++) {
                if (!owner.isMeditationActive) break;
                while (owner.isPaused && owner.isMeditationActive) await new Promise(resolve => setTimeout(resolve, 100));
                if (piperFailed) {
                    await owner.narrateBrowser(sentences[i], false, true, pacing, false);
                    continue;
                }

                try {
                    const buffer = await pending;
                    if (!owner.isMeditationActive || generation !== piperTTS.generation) return;
                    while (owner.isPaused && owner.isMeditationActive) await new Promise(resolve => setTimeout(resolve, 100));
                    if (!owner.isMeditationActive || generation !== piperTTS.generation) return;
                    if (i + 1 < sentences.length) {
                        pending = (async () => {
                            await owner.pauseAwareSleep(Math.max(0, buffer.duration - 12) * 1000);
                            if (!owner.isMeditationActive || generation !== piperTTS.generation) throw new Error('Narration cancelled');
                            return queueSynthesis(sentences[i + 1]);
                        })();
                        pending.catch(() => {});
                    }
                    const isFinalClip = i === sentences.length - 1;
                    await piperTTS.playBuffer(buffer, volumeScale, {
                        fadeOutSeconds: isFinalClip && (transition === 'mantra' || fadeOut)
                            ? mantraFadeSeconds
                            : piperClipFadeSeconds
                    });
                } catch (error) {
                    if (!owner.isMeditationActive || generation !== piperTTS.generation) return;
                    piperFailed = true;
                    piperTTS.cancel('sentence failed');
                    setVoiceStatus(fallbackMessage, 'error');
                    await owner.narrateBrowser(sentences[i], false, true, pacing, false);
                }

                if (i < sentences.length - 1) await owner.pauseAwareSleep(sentenceGap * 1000);
            }

            if (fadeOut) {
                await owner.pauseAwareSleep(timing('narration', 'fadeOutPause') * 1000);
                owner.audio.fadeOutBackgroundMusic(4);
            } else if (transition !== 'mantra') {
                await owner.pauseAwareSleep(timing('narration', 'exitGap') * 1000);
            }
            if (owner.audio.voiceCarveFilter) {
                owner.audio.voiceCarveFilter.gain.linearRampToValueAtTime(0, owner.audio.ctx.currentTime + timing('narration', 'fadeOutPause'));
            }
        }

        return Object.freeze({ run });
    }

    window.ChakraPiperNarration = Object.freeze({ create });
})();
