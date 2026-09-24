(function installBoxBreathingPractice(global) {
    'use strict';

    async function run({
        breathingStep,
        breathingPreparationSeconds,
        tutorialFadeSeconds,
        completionSeconds,
        screen,
        tutorial,
        titleElement,
        instruction,
        circle,
        timer,
        title,
        preparationNarration,
        steps,
        completionLabel,
        completionNarration,
        prepareLabel,
        showScreen,
        narrate,
        narrateSoft,
        sleep,
        isActive,
        isPaused,
        fadeMusicOut,
        fadeMusicIn
    }) {
        if (!screen || !tutorial || !instruction || !circle || !timer || typeof showScreen !== 'function' ||
            typeof narrate !== 'function' || typeof narrateSoft !== 'function' || typeof sleep !== 'function' ||
            typeof isActive !== 'function' || typeof isPaused !== 'function' || typeof fadeMusicOut !== 'function' ||
            typeof fadeMusicIn !== 'function') {
            throw new TypeError('Box Breathing requires its view, audio and session services');
        }

        showScreen(screen);
        tutorial.classList.remove('hidden');
        tutorial.style.opacity = '1';
        if (titleElement) titleElement.textContent = title;
        fadeMusicOut(4);
        await narrate(preparationNarration, true);

        for (let second = breathingPreparationSeconds; second > 0; second--) {
            if (!isActive()) return;
            await sleep(1000);
        }

        tutorial.style.opacity = '0';
        await sleep(tutorialFadeSeconds * 1000);
        tutorial.classList.add('hidden');

        for (let cycle = 0; cycle < 4; cycle++) {
            for (const step of steps) {
                if (!isActive()) return;

                instruction.textContent = step.text;
                circle.style.transition = `transform ${breathingStep}s linear`;
                circle.style.transform = `scale(${step.scale})`;
                narrateSoft(step.text);

                for (let remaining = breathingStep; remaining > 0; remaining--) {
                    if (!isActive()) return;
                    timer.textContent = remaining.toString().padStart(2, '0');

                    // Preserve the existing pause contract: elapsed time advances
                    // only while active and unpaused, with responsive 100 ms checks.
                    let elapsed = 0;
                    while (elapsed < 1000) {
                        if (!isActive()) return;
                        if (!isPaused()) elapsed += 100;
                        await sleep(100);
                    }
                }
            }
        }

        if (isActive()) {
            instruction.textContent = completionLabel;
            await narrate(completionNarration, true);
            fadeMusicIn(4, false);
            instruction.textContent = prepareLabel;
            await sleep(completionSeconds * 1000);
        }
    }

    global.ChakraBoxBreathingPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
