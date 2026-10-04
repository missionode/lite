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

    global.ChakraNarrationFeeling = Object.freeze({ LIMITS, PRESETS, NAMES, PITCH_ARCS, preset, parse, voiceSettings, pitchArc });
})(typeof window === 'undefined' ? globalThis : window);
