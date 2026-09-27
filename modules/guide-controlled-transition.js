(function () {
    function create() {
        async function run(owner, { durationSeconds, title, subtitle, readyText, continueLabel, showTimer = true }, deps) {
            const { document, showScreen, icebreakerScreen, formatClockDuration } = deps;
            const restButton = document.getElementById('guide-controlled-continue');
            const titleEl = document.getElementById('icebreaker-title');
            const subtitleEl = document.getElementById('icebreaker-subtitle');
            const timerEl = document.getElementById('icebreaker-timer');

            if (!restButton || !titleEl || !subtitleEl || !timerEl) return false;

            showScreen(icebreakerScreen);
            restButton.hidden = true;
            restButton.disabled = true;
            titleEl.textContent = title;
            subtitleEl.textContent = subtitle;
            timerEl.hidden = !showTimer;

            for (let remaining = Math.max(0, Math.round(durationSeconds)); remaining > 0; remaining--) {
                if (!owner.isMeditationActive) return false;
                if (showTimer) timerEl.textContent = formatClockDuration(remaining * 1000);
                await owner.pauseAwareSleep(1000);
            }

            if (!owner.isMeditationActive) return false;
            if (showTimer) timerEl.textContent = formatClockDuration(0);
            subtitleEl.textContent = readyText;
            restButton.textContent = continueLabel;
            restButton.disabled = false;
            restButton.hidden = false;
            restButton.focus();

            return new Promise(resolve => {
                const complete = shouldContinue => {
                    restButton.removeEventListener('click', onContinue);
                    restButton.hidden = true;
                    restButton.disabled = true;
                    if (owner.guideControlledResolve === complete) owner.guideControlledResolve = null;
                    resolve(shouldContinue);
                };
                const onContinue = () => {
                    if (owner.isMeditationActive && !owner.isPaused) complete(true);
                };
                owner.guideControlledResolve = complete;
                restButton.addEventListener('click', onContinue);
            });
        }

        return Object.freeze({ run });
    }

    window.ChakraGuideControlledTransition = Object.freeze({ create });
})();
