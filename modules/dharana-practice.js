(function installDharanaPractice(global) {
    'use strict';

    const shapes = Object.freeze({ 'indigo-circle': '●', 'gold-dot': '•', 'violet-triangle': '▲' });
    const colors = Object.freeze({ 'indigo-circle': '#818cf8', 'gold-dot': '#fbbf24', 'violet-triangle': '#c084fc' });

    async function run({
        anchor,
        minutes,
        body,
        meditationScreen,
        symbol,
        focusAnchor,
        focusVeil,
        container,
        guidance,
        title,
        closing,
        showScreen,
        stopVisual,
        setTitle,
        narrate,
        sleep,
        isActive
    }) {
        if (!body || !meditationScreen || typeof showScreen !== 'function' || typeof stopVisual !== 'function' ||
            typeof setTitle !== 'function' || typeof narrate !== 'function' || typeof sleep !== 'function' ||
            typeof isActive !== 'function') {
            throw new TypeError('Dharana requires its view, lifecycle and session services');
        }

        showScreen(meditationScreen);
        body.classList.add('dharana-active');
        stopVisual();
        if (container) container.classList.remove('presence-ready');
        if (symbol) symbol.style.visibility = 'hidden';
        if (focusVeil) { focusVeil.hidden = false; void focusVeil.offsetWidth; focusVeil.classList.add('is-active'); }
        if (focusAnchor) {
            focusAnchor.textContent = shapes[anchor] || shapes['indigo-circle'];
            focusAnchor.style.color = colors[anchor] || colors['indigo-circle'];
            focusAnchor.style.setProperty('--focus-anchor-duration', `${Math.max(1, minutes * 60)}s`);
            focusAnchor.classList.remove('is-focusing');
            focusAnchor.hidden = false;
            void focusAnchor.offsetWidth;
            focusAnchor.classList.add('is-focusing');
        }
        setTitle(title);

        try {
            await narrate(guidance);
            const totalSeconds = Math.max(1, minutes * 60);
            let remaining = totalSeconds;
            while (remaining-- > 0 && isActive()) {
                // Keep the selected anchor shrinking even when reduced-motion
                // mode disables CSS animation; progress follows active session time.
                if (focusAnchor) {
                    const progress = (totalSeconds - remaining) / totalSeconds;
                    focusAnchor.style.transform = `scale(${1 - progress * 0.58})`;
                }
                await sleep(1000);
            }
            if (isActive()) {
                focusAnchor?.classList.add('is-releasing');
                focusVeil?.classList.add('is-releasing');
                await Promise.all([narrate(closing), sleep(4000)]);
            }
        } finally {
            if (focusAnchor) {
                focusAnchor.hidden = true;
                focusAnchor.classList.remove('is-focusing', 'is-releasing');
                focusAnchor.style.transform = '';
            }
            if (focusVeil) {
                focusVeil.classList.remove('is-active', 'is-releasing');
                focusVeil.hidden = true;
            }
            body.classList.remove('dharana-active');
            if (symbol) symbol.style.visibility = '';
        }
    }

    global.ChakraDharanaPractice = Object.freeze({ run });
})(typeof window === 'undefined' ? globalThis : window);
