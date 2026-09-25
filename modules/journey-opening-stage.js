(function installJourneyOpeningStage(global) {
    "use strict";

    async function run(owner, isHighEnergy, dependencies) {
        const { document, showScreen, journeyT, contentT, state, getMoonPhase, localized, defaultIntention } = dependencies;
        const screen = document.getElementById('breathing-screen');
        const tutorial = document.getElementById('breathing-tutorial');
        const title = document.getElementById('tutorial-title');

        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = '1';
        const aura = document.getElementById('aura-bg');
        aura.style.background = 'radial-gradient(circle at center, #3e2723aa, transparent)';
        aura.style.opacity = '1';
        title.textContent = journeyT('ui.preparation');

        await owner.narrate(contentT('system.prePracticeSafety'), false);
        if (!owner.isMeditationActive) return;
        await owner.runArrivalInduction();
        if (!owner.isMeditationActive) return;

        if (!isHighEnergy) {
            const isReturningVisitor = state.returningJourney;
            const phase = getMoonPhase();
            const moonText = localized(owner.scripts.intro.moon[phase]) ||
                owner.scripts.intro.moon[`${phase}_${state.language}`];
            const openingText = isReturningVisitor
                ? localized(owner.scripts.intro, 'returning')
                : moonText;
            if (openingText && owner.isMeditationActive) {
                title.textContent = isReturningVisitor ? journeyT('ui.returning') : journeyT('ui.moon');
                await owner.narrate(openingText, false);
                await owner.pauseAwareSleep(dependencies.timing('transitions', 'openingPause') * 1000);
            }
        }

        if (!owner.isMeditationActive) return;
        title.textContent = isHighEnergy ? journeyT('ui.intention') : journeyT('ui.gratitude');
        const text = isHighEnergy
            ? localized(owner.scripts.high_energy, 'intention')
            : localized(owner.scripts.intro, 'gratitude');
        const personalIntention = state.intention && state.intention.trim();
        if (isHighEnergy) {
            const intentionText = text.replace('{{intention}}', personalIntention || defaultIntention(state.language));
            await owner.narrateIntentionWithFrequency(intentionText, 'hrim');
        } else if (personalIntention) {
            await owner.narrate(text, false);
            const intentionText = contentT('system.intention').replace('{{intention}}', state.intention.trim());
            title.textContent = journeyT('ui.intention');
            await owner.narrateIntentionWithFrequency(intentionText);
        } else {
            await owner.narrate(text, false);
        }
        if (!isHighEnergy && owner.isMeditationActive) await owner.runArrivalReadiness();
    }

    global.ChakraJourneyOpeningStage = Object.freeze({ run });
})(window);
