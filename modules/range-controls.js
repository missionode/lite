(function installRangeControls(global) {
    'use strict';

    function formatValue(input, document) {
        const value = Number(input.value);
        if (!Number.isFinite(value)) return input.value;
        if (input.id === 'time-per-chakra') return document.getElementById('shots-toggle')?.checked
            ? `${value.toFixed(0)} secs`
            : `${value.toFixed(1)} mins`;
        if (input.id === 'mood-relaxation-ambience-level') return `${value.toFixed(1)}%`;
        if (input.id === 'pleasure-ambience-blur-level') return `${Math.round(value)}%`;
        if (input.id === 'time-high-energy') return `${value} mins`;
        if (['time-bath', 'time-perineal-care', 'time-assisted-bathing'].includes(input.id)) {
            return `${Math.floor(value / 60)}m`;
        }
        if (input.id.startsWith('time-')) return `${value}s`;
        return input.step && Number(input.step) < 1 ? value.toFixed(2) : String(value);
    }

    function enhance({ document, EventConstructor = global.Event }) {
        if (!document || typeof document.querySelectorAll !== 'function' || typeof document.createElement !== 'function') {
            throw new TypeError('Range controls require a document');
        }
        document.querySelectorAll('input[type="range"]').forEach(input => {
            const container = input.closest('.mixer-row, .time-selector') || input.parentElement;
            if (!container || container.dataset.rangeEnhanced === 'true') return;

            container.dataset.rangeEnhanced = 'true';
            container.classList.add('range-control');

            const existingMeta = container.querySelector(':scope > .range-meta');
            let current = existingMeta?.querySelector('.range-current') || container.querySelector(':scope > span');
            if (!current) {
                current = document.createElement('span');
                container.appendChild(current);
            }
            current.classList.add('range-current');

            const meta = existingMeta || document.createElement('div');
            if (!existingMeta) {
                meta.className = 'range-meta';
                container.appendChild(meta);
            }
            if (current.parentElement !== meta) meta.appendChild(current);

            const createStepButton = (className, label, text) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `range-step ${className}`;
                button.setAttribute('aria-label', label);
                button.textContent = text;
                return button;
            };
            let decrement = meta.querySelector('.range-decrement');
            if (!decrement) {
                decrement = createStepButton('range-decrement', 'Decrease value', '−');
                meta.prepend(decrement);
            }
            let increment = meta.querySelector('.range-increment');
            if (!increment) {
                increment = createStepButton('range-increment', 'Increase value', '+');
                meta.appendChild(increment);
            }
            let minimum = meta.querySelector('.range-min');
            if (!minimum) {
                minimum = document.createElement('span');
                minimum.className = 'range-min';
                meta.insertBefore(minimum, current);
            }
            let maximum = meta.querySelector('.range-max');
            if (!maximum) {
                maximum = document.createElement('span');
                maximum.className = 'range-max';
                meta.insertBefore(maximum, increment);
            }
            const adjust = direction => {
                const step = Number(input.step) || 1;
                const precision = (String(step).split('.')[1] || '').length;
                const next = Math.min(Number(input.max), Math.max(Number(input.min), Number(input.value) + (direction * step)));
                input.value = precision ? next.toFixed(precision) : String(next);
                input.dispatchEvent(new EventConstructor('input', { bubbles: true }));
            };
            decrement.addEventListener('click', () => adjust(-1));
            increment.addEventListener('click', () => adjust(1));

            const update = () => {
                if (!minimum.dataset.i18n) minimum.textContent = input.min;
                if (!maximum.dataset.i18n) maximum.textContent = input.max;
                current.textContent = formatValue(input, document);
                decrement.disabled = Number(input.value) <= Number(input.min);
                increment.disabled = Number(input.value) >= Number(input.max);
            };
            input.addEventListener('input', update);
            update();
        });
    }

    function refresh({ document }) {
        if (!document || typeof document.querySelectorAll !== 'function') {
            throw new TypeError('Range controls require a document');
        }
        document.querySelectorAll('.range-control').forEach(container => {
            const input = container.querySelector('input[type="range"]');
            const current = container.querySelector('.range-current');
            if (input && current) current.textContent = formatValue(input, document);
        });
    }

    global.ChakraRangeControls = Object.freeze({ formatValue, enhance, refresh });
})(typeof window === 'undefined' ? globalThis : window);
