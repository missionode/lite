(function installSelfExplorationPractices(global) {
    'use strict';

    function updateProgress(element, template, current, total) {
        if (!element) return;
        element.textContent = String(template || '{{current}} / {{total}}')
            .replace('{{current}}', String(current)).replace('{{total}}', String(total));
        element.classList.remove('hidden');
    }

    async function guided({ minutes, meditationScreen, opening, steps, closing, title, progress, progressTemplate, showScreen, stopVisual, setTitle, narrate, sleep, isActive }) {
        if (!meditationScreen || typeof showScreen !== 'function' || typeof stopVisual !== 'function' ||
            typeof setTitle !== 'function' || typeof narrate !== 'function' || typeof sleep !== 'function' ||
            typeof isActive !== 'function') throw new TypeError('Self-exploration practice requires journey services');
        const prompts = Array.isArray(steps) ? steps : [];
        const pauseMs = Math.max(12000, Math.floor((Number(minutes) || 5) * 60000 / (prompts.length + 1)));
        const total = prompts.length + 2;
        try {
            showScreen(meditationScreen);
            stopVisual();
            setTitle(title);
            updateProgress(progress, progressTemplate, 1, total);
            await narrate(opening);
            for (let index = 0; index < prompts.length; index++) {
                if (!isActive()) return;
                await sleep(pauseMs);
                if (!isActive()) return;
                updateProgress(progress, progressTemplate, index + 2, total);
                await narrate(prompts[index]);
            }
            if (isActive()) {
                updateProgress(progress, progressTemplate, total, total);
                await narrate(closing);
            }
        } finally {
            progress?.classList.add('hidden');
        }
    }

    async function deepSecrets({ minutes, meditationScreen, opening, invitation, closing, title, progress, progressTemplate, showScreen, stopVisual, setTitle, narrate, sleep, isActive }) {
        if (!meditationScreen || typeof showScreen !== 'function' || typeof stopVisual !== 'function' ||
            typeof setTitle !== 'function' || typeof narrate !== 'function' || typeof sleep !== 'function' ||
            typeof isActive !== 'function') throw new TypeError('Deep Secrets requires journey services');
        try {
            showScreen(meditationScreen);
            stopVisual();
            setTitle(title);
            updateProgress(progress, progressTemplate, 1, 3);
            await narrate(opening);
            if (!isActive()) return;
            updateProgress(progress, progressTemplate, 2, 3);
            await narrate(invitation);
            const silenceMs = Math.max(1, Number(minutes) || 4) * 60000;
            const interval = 1000;
            for (let elapsed = 0; elapsed < silenceMs && isActive(); elapsed += interval) await sleep(Math.min(interval, silenceMs - elapsed));
            if (isActive()) {
                updateProgress(progress, progressTemplate, 3, 3);
                await narrate(closing);
            }
        } finally {
            progress?.classList.add('hidden');
        }
    }

    async function finalChallenge({ elements, copy, sleep, isActive }) {
        if (!elements?.modal || !elements?.countdown || !elements?.question || !elements?.yes || !elements?.no || !elements?.skip ||
            !elements?.feedback || typeof sleep !== 'function' || typeof isActive !== 'function') {
            throw new TypeError('Final Challenge requires its localized dialog and journey lifecycle');
        }
        if (!isActive()) return null;
        const { modal, countdown, question, yes, no, skip, feedback } = elements;
        let choice;
        const hide = () => modal.classList.add('hidden');
        const choose = value => { choice = value; };
        const handlers = [[yes, () => choose('yes')], [no, () => choose('no')], [skip, () => choose('skip')]];
        handlers.forEach(([button, handler]) => button.addEventListener('click', handler));
        modal.classList.remove('hidden');
        question.classList.add('hidden');
        feedback.classList.add('hidden');
        try {
            // Short and calm: no sound, flashing, deadline penalty, or blocked exit.
            for (let remaining = 5; remaining > 0; remaining--) {
                countdown.textContent = String(remaining);
                await sleep(1000);
                if (!isActive()) return null;
            }
            countdown.classList.add('hidden');
            question.classList.remove('hidden');
            yes.focus?.();
            while (choice === undefined && isActive()) await sleep(200);
            if (!isActive() || choice === undefined) return null;
            const feedbackKey = choice === 'yes' ? 'yesFeedback' : choice === 'no' ? 'noFeedback' : 'skipFeedback';
            feedback.textContent = copy[feedbackKey];
            feedback.classList.remove('hidden');
            question.classList.add('hidden');
            await sleep(1400);
            return choice;
        } finally {
            handlers.forEach(([button, handler]) => button.removeEventListener('click', handler));
            hide();
            countdown.classList.remove('hidden');
            question.classList.remove('hidden');
            feedback.classList.add('hidden');
        }
    }

    global.ChakraSelfExplorationPractices = Object.freeze({ guided, deepSecrets, finalChallenge });
})(typeof window === 'undefined' ? globalThis : window);
