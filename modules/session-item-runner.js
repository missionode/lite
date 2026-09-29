(function installSessionItemRunner(global) {
    'use strict';
    function create({ onStart, onSkip, onFinish }) {
        if (![onStart, onSkip, onFinish].every(handler => typeof handler === 'function')) throw new TypeError('Session item runner requires start, skip and finish handlers');
        let sequence = 0, generation = 0, current = null;
        async function run(label, task) {
            if (typeof label !== 'string' || !label.trim() || typeof task !== 'function') throw new TypeError('A session item requires a label and task');
            if (current) throw new Error('A session item is already running');
            const item = { id: ++sequence, label, skipped: false, generation };
            current = item; onStart(item);
            let value, error, failed = false;
            try { value = await task(); } catch (caught) { failed = true; error = caught; }
            finally {
                const wasCurrent = current === item;
                if (wasCurrent) current = null;
                onFinish(item, { wasCurrent, stale: item.generation !== generation });
            }
            if (failed) throw error;
            return Object.freeze({ skipped: item.skipped, value });
        }
        function skip() {
            if (!current || current.skipped) return false;
            current.skipped = true; onSkip(current); return true;
        }
        function reset() { generation += 1; current = null; }
        return Object.freeze({ run, skip, reset, get current() { return current; } });
    }
    global.ChakraSessionItemRunner = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
