(function installAppNotice(global) {
    'use strict';

    // Calm in-app message instead of the browser's alert() box. It does not
    // freeze the app, fits the dark theme, speaks to screen readers, and
    // shows one message at a time (later ones wait in a short queue).

    const queue = [];
    let current = null;

    function render(document) {
        if (current || !queue.length || !document?.body) return;
        const { message, okLabel, tone } = queue.shift();
        const box = document.createElement('div');
        box.className = `app-notice app-notice-${tone}`;
        box.setAttribute('role', 'alertdialog');
        box.setAttribute('aria-live', 'assertive');
        const text = document.createElement('p');
        text.className = 'app-notice-text';
        text.textContent = message;
        const ok = document.createElement('button');
        ok.type = 'button';
        ok.className = 'app-notice-ok';
        ok.textContent = okLabel || 'OK';
        ok.addEventListener('click', () => {
            box.remove();
            current = null;
            render(document);
        });
        box.append(text, ok);
        document.body.append(box);
        current = box;
        ok.focus?.({ preventScroll: true });
    }

    function show(message, { okLabel = 'OK', tone = 'info', document = global.document } = {}) {
        const text = String(message ?? '').trim();
        if (!text) return false;
        if (queue.some(item => item.message === text) || current?.querySelector?.('.app-notice-text')?.textContent === text) return true;
        queue.push({ message: text, okLabel, tone });
        render(document);
        return true;
    }

    function dismissAll() {
        queue.length = 0;
        current?.remove?.();
        current = null;
    }

    global.ChakraAppNotice = Object.freeze({ show, dismissAll });
})(typeof window === 'undefined' ? globalThis : window);
