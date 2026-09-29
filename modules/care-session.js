(function () {
    function create() {
        async function runBathStage(owner, scriptKey, durationSeconds, deps) {
            const { journeyT, showScreen, icebreakerScreen, document, localized } = deps;
            if (!owner.isMeditationActive) return;
            showScreen(icebreakerScreen);
            const title = document.getElementById('icebreaker-title');
            const subtitle = document.getElementById('icebreaker-subtitle');
            const timer = document.getElementById('icebreaker-timer');
            const script = owner.scripts[scriptKey];
            title.textContent = localized(script.title);
            subtitle.textContent = journeyT('ui.purification');
            await owner.narrate(localized(script.intro), false);
            await owner.narrate(localized(script.instructions), false);

            let remaining = durationSeconds;
            const reminderSecond = 60;
            while (remaining > 0) {
                if (!owner.isMeditationActive) return;
                if (!owner.isPaused) {
                    if (timer) timer.textContent = Math.floor(remaining / 60) + ':' + (remaining % 60).toString().padStart(2, '0');
                    if (remaining === reminderSecond) owner.narrateSoft(localized(script.reminder));
                    remaining--;
                }
                await owner.pauseAwareSleep(1000);
            }

            if (!owner.isMeditationActive) return false;
            return owner.runGuideControlledTransition({
                durationSeconds: 0,
                showTimer: false,
                title: journeyT('ui.guideReadyForNextSession'),
                subtitle: journeyT('ui.guideReadyForNextSessionGuidance'),
                readyText: journeyT('ui.guideReadyForNextSessionGuidance'),
                continueLabel: journeyT('ui.proceedToNextSession')
            });
        }

        function stageDuration(owner, configuredDuration) {
            return owner.isExperimentActive && owner.experimentDuration != null
                ? owner.experimentDuration
                : configuredDuration;
        }

        function runBathSession(owner, deps) {
            return runBathStage(owner, 'bath_session', stageDuration(owner, deps.state.timeBath), deps);
        }

        function runPerinealCare(owner, deps) {
            return runBathStage(owner, 'perineal_care', stageDuration(owner, deps.state.timePerinealCare), deps);
        }

        function runAssistedBathing(owner, deps) {
            return runBathStage(owner, 'assisted_bathing', stageDuration(owner, deps.state.timeAssistedBathing), deps);
        }

        async function runIntimateService(owner, deps) {
            const { state, showScreen, meditationScreen } = deps;
            if (!owner.isMeditationActive) return;
            if (state.perinealCareEnabled) {
                const care = await owner.runSessionItem('Perineal Care', () => owner.runPerinealCare());
                if (!care.skipped && care.value === false) return;
            }
            if (state.massageEnabled) {
                // Massage is held by a full Crown-to-Root chakra journey. When
                // Assisted Bathing follows, defer closing until it is complete.
                // Focused care otherwise leaves the Icebreaker stage visible.
                showScreen(meditationScreen);
                await owner.runSequence({ complete: !state.assistedBathingEnabled });
                if (!owner.isMeditationActive) return;
            }
            if (state.assistedBathingEnabled) await owner.runSessionItem('Assisted bathing', () => owner.runAssistedBathing());
        }

        return Object.freeze({ runBathStage, runBathSession, runPerinealCare, runAssistedBathing, runIntimateService });
    }

    window.ChakraCareSession = Object.freeze({ create });
})();
