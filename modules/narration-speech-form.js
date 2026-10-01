(function installNarrationSpeechForm(global) {
    'use strict';

    // Spoken forms used ONLY for the voice. The text on screen never changes.
    // Piper reads text through espeak-ng; these respellings make it say
    // mantra and Sanskrit names the way a teacher would.
    // Checked with espeak-ng: Lumm /lʌm/, Ohm /oʊm/, Chukra /tʃʌkɹə/.
    const RULES = Object.freeze({
        en: Object.freeze([
            // Bija mantras: "Lam" would sound like "lamb", "Ram" like the animal.
            [/\bLam\b/g, 'Lumm'], [/\bVam\b/g, 'Vumm'], [/\bRam\b/g, 'Rumm'],
            [/\bYam\b/g, 'Yumm'], [/\bHam\b/g, 'Humm'], [/\bOm\b/g, 'Ohm'],
            [/\bChakra(s?)\b/g, 'Chukra$1'], [/\bchakra(s?)\b/g, 'chukra$1'],
            [/\bsadhak\b/g, 'saadhuk'], [/\bSadhak\b/g, 'Saadhuk'],
            [/\bHo[ʻ'’ -]?oponopono\b/g, 'Ho oh pono pono'],
            [/\bVrikshasana\b/g, 'Vriksha asana'], [/\bBalasana\b/g, 'Baala asana'],
            [/\bMarjaryasana\b/g, 'Marjari asana'], [/\bSvanasana\b/g, 'Shvaana asana'],
            [/\bShavasana\b/g, 'Shuvaa asana']
        ]),
        // Words in capitals are read letter by letter ("ЛАМ" = "эл-и-эм").
        ru: Object.freeze([
            [/(^|[^А-Яа-яЁё])([А-ЯЁ])([А-ЯЁ]+)(?![А-Яа-яЁё])/g, (match, before, first, rest) => `${before}${first}${rest.toLowerCase()}`]
        ]),
        // A bija written with anusvara before "मंत्र" is read with an "n" (लं = lʌn).
        hi: Object.freeze([
            [/(^|[^ऀ-ॿ])([लवरयह])ं(?=\s+मंत्र)/g, '$1$2म्']
        ]),
        // Old spellings of the bija with a long vowel (വാം) are read "vaam".
        ml: Object.freeze([
            [/(^|[^ഀ-ൿ])(വ|റ|യ|ഹ)ാം(?=\s+മന്ത്ര)/g, (match, before, letter) => `${before}${letter === 'റ' ? 'ര' : letter}ം`]
        ]),
        ta: Object.freeze([
            [/(^|[^஀-௿])யாம்(?=\s+மந்திர)/g, '$1யம்']
        ])
    });

    function spokenForm(text, language) {
        const rules = RULES[language];
        let spoken = String(text ?? '');
        if (!rules) return spoken;
        for (const [pattern, replacement] of rules) spoken = spoken.replace(pattern, replacement);
        return spoken;
    }

    global.ChakraNarrationSpeechForm = Object.freeze({ spokenForm, RULES });
})(typeof window === 'undefined' ? globalThis : window);
