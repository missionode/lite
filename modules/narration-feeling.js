(function installNarrationFeeling(global) {
    'use strict';

    // Narration feelings: Piper voices have no emotion switch, so a feeling is
    // a small, bounded preset of pace, liveliness, rhythm, closeness (volume)
    // and the silence after a line. The words on screen never change.
    //
    //   pace        speaking speed multiplier (lower = slower)
    //   liveliness  Piper noise_scale multiplier (lower = calmer, flatter)
    //   rhythm      Piper noise_w multiplier (lower = steadier timing)
    //   closeness   clip volume (lower = softer, more intimate)
    //   pauseAfter  extra silence after the line, in seconds
    //
    // Every value is clamped, so a typo can never make the voice strain.
    const LIMITS = Object.freeze({
        pace: [0.85, 1.08], liveliness: [0.75, 1.12], rhythm: [0.75, 1.1], closeness: [0.8, 1], pauseAfter: [0, 2]
    });

    const PRESETS = Object.freeze({
        warm: Object.freeze({ pace: 1, liveliness: 1.05, rhythm: 1, closeness: 1, pauseAfter: 0 }),
        tender: Object.freeze({ pace: 0.94, liveliness: 0.92, rhythm: 0.9, closeness: 0.9, pauseAfter: 0.8 }),
        grounding: Object.freeze({ pace: 0.95, liveliness: 0.9, rhythm: 0.88, closeness: 0.95, pauseAfter: 0.6 }),
        still: Object.freeze({ pace: 0.9, liveliness: 0.82, rhythm: 0.8, closeness: 0.86, pauseAfter: 1.4 }),
        return: Object.freeze({ pace: 0.97, liveliness: 0.98, rhythm: 0.95, closeness: 0.95, pauseAfter: 0.4 }),
        uplift: Object.freeze({ pace: 1.04, liveliness: 1.1, rhythm: 1.05, closeness: 1, pauseAfter: 0 })
    });
    const NAMES = Object.freeze(Object.keys(PRESETS));

    // 2-Minute Mind Reset: one feeling per line (opening, four steps, closing).
    const PITCH_ARCS = Object.freeze({
        calm: Object.freeze(['warm', 'grounding', 'tender', 'still', 'still', 'return']),
        courage: Object.freeze(['warm', 'grounding', 'grounding', 'warm', 'uplift', 'uplift']),
        energy: Object.freeze(['warm', 'uplift', 'uplift', 'warm', 'uplift', 'uplift']),
        focus: Object.freeze(['warm', 'grounding', 'still', 'still', 'grounding', 'return'])
    });

    const clamp = (value, [low, high]) => Math.max(low, Math.min(high, Number.isFinite(Number(value)) ? Number(value) : 1));

    function preset(name) {
        const raw = PRESETS[String(name || '').toLowerCase()];
        if (!raw) return null;
        const safe = { name: String(name).toLowerCase() };
        for (const [key, range] of Object.entries(LIMITS)) safe[key] = clamp(raw[key], range);
        return Object.freeze(safe);
    }

    // A script line may start with a tag: "[tender] Let your shoulders soften."
    // Only known feelings are removed; the tag is never spoken or shown.
    function parse(text) {
        const value = String(text ?? '');
        const match = /^\s*\[([a-z]+)\]\s*/i.exec(value);
        if (!match || !PRESETS[match[1].toLowerCase()]) return { feeling: null, text: value };
        return { feeling: match[1].toLowerCase(), text: value.slice(match[0].length) };
    }

    // Piper settings for one line. The runtime clamps them again.
    function voiceSettings(base, feeling) {
        const safe = typeof feeling === 'string' ? preset(feeling) : feeling;
        if (!safe) return base;
        const lengthScale = (Number(base?.lengthScale) || 1) / safe.pace;
        return Object.freeze({ ...base, lengthScale, noiseScaleFactor: safe.liveliness, noiseWFactor: safe.rhythm });
    }

    function pitchArc(mood, count) {
        const arc = PITCH_ARCS[mood] || PITCH_ARCS.calm;
        if (count <= 0) return [];
        if (count === arc.length) return [...arc];
        // Keep the first and last feeling; spread the middle ones evenly.
        return Array.from({ length: count }, (_, index) => {
            if (index === 0) return arc[0];
            if (index === count - 1) return arc[arc.length - 1];
            const middle = arc.slice(1, -1);
            return middle[Math.min(middle.length - 1, Math.floor(((index - 1) / Math.max(1, count - 2)) * middle.length))];
        });
    }

    // scripts.json carries a top-level "feelings" block: one feeling per
    // narration field, the same for every language, for example
    //   "root.meditation": "grounding", "hooponopono.phrases.*": "tender".
    // Keys drop the language ("meditation_en" → "meditation", ".en" → gone);
    // "*" matches one list index or chakra name. Text is matched exactly,
    // or by its opening words when a session adds text after it.
    const LANGUAGE = /^(en|ml|hi|ru|ta)$/;
    const PREFIX_LENGTH = 48;
    const indexes = new WeakMap();

    function fieldKey(segments) {
        return segments.filter(segment => !LANGUAGE.test(segment))
            .map(segment => segment.replace(/_(en|ml|hi|ru|ta)$/, ''))
            .join('.');
    }

    function feelingForKey(feelings, key) {
        if (PRESETS[feelings[key]]) return feelings[key];
        const parts = key.split('.');
        for (const [pattern, name] of Object.entries(feelings)) {
            if (!pattern.includes('*') || !PRESETS[name]) continue;
            const wanted = pattern.split('.');
            if (wanted.length === parts.length && wanted.every((part, index) => part === '*' || part === parts[index])) return name;
        }
        return null;
    }

    function indexScripts(scripts) {
        const exact = new Map();
        const prefix = new Map();
        const feelings = scripts && typeof scripts.feelings === 'object' ? scripts.feelings : null;
        if (!feelings) return { exact, prefix };
        const walk = (value, segments) => {
            if (typeof value === 'string') {
                const name = feelingForKey(feelings, fieldKey(segments));
                const text = value.trim();
                if (!name || !text) return;
                exact.set(text, name);
                if (text.length >= PREFIX_LENGTH) prefix.set(text.slice(0, PREFIX_LENGTH), name);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => walk(item, [...segments, String(index)]));
            } else if (value && typeof value === 'object') {
                for (const [key, item] of Object.entries(value)) if (key !== 'feelings') walk(item, [...segments, key]);
            }
        };
        walk(scripts, []);
        return { exact, prefix };
    }

    function fromScripts(scripts, text) {
        if (!scripts || typeof scripts !== 'object') return null;
        if (!indexes.has(scripts)) indexes.set(scripts, indexScripts(scripts));
        const { exact, prefix } = indexes.get(scripts);
        const value = String(text ?? '').trim();
        return exact.get(value) || (value.length >= PREFIX_LENGTH ? prefix.get(value.slice(0, PREFIX_LENGTH)) : null) || null;
    }

    global.ChakraNarrationFeeling = Object.freeze({ LIMITS, PRESETS, NAMES, PITCH_ARCS, preset, parse, voiceSettings, pitchArc, fieldKey, fromScripts });
})(typeof window === 'undefined' ? globalThis : window);
