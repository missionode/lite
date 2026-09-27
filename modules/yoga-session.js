(function () {
    function create() {
        async function run(owner, deps) {
            const { state, timing, journeyT, showScreen, icebreakerScreen, meditationScreen, document, localized, visual } = deps;
            if (!owner.isMeditationActive) return;

            // Yoga keeps its own standard Bath Session and rest-before-yoga stage.
            // Intimate care runs separately from the Lobby.
            if (state.corpsePoseEnabled) await owner.runCorpsePose();
            if (state.bathSessionEnabled && owner.isMeditationActive) {
                if (!await owner.runBathSession()) return;

                const shouldBeginYoga = await owner.runGuideControlledTransition({
                    durationSeconds: timing('transitions', 'bathToYogaRest'),
                    title: journeyT('ui.bathToYogaRestTitle'),
                    subtitle: journeyT('ui.bathToYogaRestGuidance'),
                    readyText: journeyT('ui.restReadyToContinue'),
                    continueLabel: journeyT('ui.beginYogaAfterRest')
                });
                if (!shouldBeginYoga) return;
            }

            showScreen(icebreakerScreen);
            const title = document.getElementById('icebreaker-title');
            const subtitle = document.getElementById('icebreaker-subtitle');
            const timer = document.getElementById('icebreaker-timer');

            title.textContent = journeyT('ui.yoga');
            subtitle.textContent = journeyT('ui.yogaSubtitle');

            owner.startTimedDrone(136.1, 3, state.timeYogaPose, state.droneDurationMode);
            owner.audio.fadeInBackgroundMusic(8, 0.30);
            await owner.narrate(localized(owner.scripts.yoga.intro), false);
            await owner.narrate(localized(owner.scripts.yoga.preparation), false);

            for (let i = state.timeYogaPrep; i > 0; i--) {
                if (!owner.isMeditationActive) return;
                if (timer) timer.textContent = i;
                await owner.pauseAwareSleep(1000);
            }

            showScreen(meditationScreen);
            const symbolEl = document.getElementById('chakra-symbol');
            const mantraEl = document.getElementById('mantra-display');
            const aura = document.getElementById('aura-bg');
            aura.style.background = 'radial-gradient(circle at center, #FFD70022, transparent)';
            aura.style.opacity = '1';

            const yogaPoses = owner.scripts.yoga.poses.filter(pose => state.selectedYogaPoses.includes(pose.id));
            for (const pose of yogaPoses) {
                if (!owner.isMeditationActive) break;
                mantraEl.textContent = localized(pose, 'name');
                mantraEl.style.color = '#FFD700';

                const imageMap = {
                    balasana: 'symbols/Balasana.png',
                    ananda_balasana: 'symbols/ananda_balasana.png',
                    vrikshasana: 'symbols/Vrikshasana.png',
                    adho_mukha_svanasana: 'symbols/Downward_dog.png',
                    marjaryasana: 'symbols/Marjaryasana.png'
                };
                visual.setSymbolImage(imageMap[pose.id] || 'symbols/root.png', symbolEl);
                symbolEl.style.opacity = '0.9';

                await owner.narrate(localized(pose, 'desc'), false);
                let remaining = state.timeYogaPose;
                while (remaining > 0) {
                    if (!owner.isMeditationActive) break;
                    if (!owner.isPaused) remaining--;
                    await owner.pauseAwareSleep(1000);
                }

                if (owner.isMeditationActive) {
                    owner.narrateSoft(localized(owner.scripts.yoga.next_pose_prompt));
                    await owner.pauseAwareSleep(timing('transitions', 'yogaPoseGap') * 1000);
                }
            }

            if (owner.isMeditationActive) {
                await owner.narrate(localized(owner.scripts.yoga.session_complete), false);
                await owner.pauseAwareSleep(timing('transitions', 'yogaFinalSettle') * 1000);
            }
        }

        return Object.freeze({ run });
    }

    window.ChakraYogaSession = Object.freeze({ create });
})();
