(function installContentLocalization(global) {
    'use strict';

    function getPath(source, path) {
        return path.split('.').reduce((value, key) => value == null ? undefined : value[key], source);
    }

    function hasPath(source, path) {
        return getPath(source, path) != null;
    }

    function hasLocalizedPath(scripts, path, fallbackLanguage = null) {
        if (hasPath(scripts, path)) return true;
        const parts = path.split('.');
        const final = parts.pop() || '';
        const parentPath = parts.join('.');
        const meditationMatch = final.match(/^meditation_([a-zA-Z-]+)$/);
        if (meditationMatch && hasPath(scripts, `${parentPath}.${meditationMatch[1]}`)) return true;
        if (/^[a-zA-Z-]+$/.test(final) && hasPath(scripts, `${parentPath}.meditation_${final}`)) return true;
        const suffixMatch = final.match(/^(.+)_([a-zA-Z-]+)$/);
        if (!suffixMatch) {
            return Boolean(fallbackLanguage && final !== fallbackLanguage &&
                hasLocalizedPath(scripts, parts.concat(fallbackLanguage).join('.')));
        }
        const basePath = parts.concat(suffixMatch[1]).join('.');
        if (hasPath(scripts, `${basePath}.${suffixMatch[2]}`)) return true;
        if (['text', 'content', 'value'].some(field => hasPath(scripts, `${parentPath}.${field}.${suffixMatch[2]}`))) return true;
        return Boolean(fallbackLanguage && suffixMatch[2] !== fallbackLanguage &&
            hasLocalizedPath(scripts, `${basePath}_${fallbackLanguage}`));
    }

    function validateScriptBundle(scripts, options = {}) {
        const configuredLanguages = options.languages || options.registeredLanguages || [];
        const languageIds = configuredLanguages.length ? configuredLanguages : ['ml', 'en'];
        const localized = base => languageIds.map(language => `${base}_${language}`);
        const chakraKeys = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
        const required = [
            ...localized('intro.gratitude'), ...localized('intro.returning'),
            ...['new', 'waxing', 'full', 'waning'].flatMap(phase => localized(`intro.moon.${phase}`)),
            ...languageIds.map(language => `closing.${language}`),
            ...languageIds.map(language => `closing.affirmation_${language}`),
            ...chakraKeys.flatMap(key => [
                ...languageIds.map(language => `${key}.meditation_${language}`),
                ...languageIds.map(language => `${key}.affirmation_${language}`),
                `${key}.mantra`, `${key}.color`, `${key}.symbol`, `${key}.frequency`
            ])
        ];
        if (options.highEnergy) required.push(
            ...languageIds.flatMap(language => [`high_energy.meditation_${language}`, `high_energy.intention_${language}`, `high_energy.affirmation_${language}`]),
            'high_energy.mantra', 'high_energy.color', 'high_energy.symbol', 'high_energy.frequency'
        );
        if (options.corpse) required.push(...languageIds.flatMap(language => [`corpse_pose.intro.${language}`, `corpse_pose.transition.${language}`]));
        if (options.bath) required.push(...languageIds.flatMap(language => [`bath_session.title.${language}`, `bath_session.intro.${language}`, `bath_session.instructions.${language}`, `bath_session.reminder.${language}`]));
        if (options.perinealCare) required.push(...languageIds.flatMap(language => [`perineal_care.title.${language}`, `perineal_care.intro.${language}`, `perineal_care.instructions.${language}`, `perineal_care.reminder.${language}`]));
        if (options.assistedBathing) required.push(...languageIds.flatMap(language => [`assisted_bathing.title.${language}`, `assisted_bathing.intro.${language}`, `assisted_bathing.instructions.${language}`, `assisted_bathing.reminder.${language}`]));
        if (options.massage) required.push(...languageIds.flatMap(language => [`massage.title.${language}`, `massage.intro.${language}`, `massage.instructions.${language}`, `massage.reminder.${language}`]));
        if (options.yoga) required.push(...languageIds.flatMap(language => [`yoga.intro.${language}`, `yoga.preparation.${language}`, `yoga.next_pose_prompt.${language}`, `yoga.session_complete.${language}`]), 'yoga.poses');
        if (options.hooponopono) required.push(...languageIds.flatMap(language => [`hooponopono.intro.${language}`, `hooponopono.phrases.${language}`, `hooponopono.closing.${language}`]));
        const fallbackLanguage = options.allowLanguageFallback ? 'en' : null;
        const missing = required.filter(path => !hasLocalizedPath(scripts, path, fallbackLanguage));
        const frequencyKeys = options.highEnergy ? [...chakraKeys, 'high_energy'] : chakraKeys;
        const invalidFrequencies = frequencyKeys
            .filter(key => hasPath(scripts, `${key}.frequency`))
            .filter(key => {
                const frequency = Number(getPath(scripts, `${key}.frequency`));
                return !Number.isFinite(frequency) || frequency < 1 || frequency > 20000;
            })
            .map(key => `${key}.frequency (must be between 1 and 20000 Hz)`);
        const issues = [...missing, ...invalidFrequencies];
        return { valid: issues.length === 0, missing: issues };
    }

    function getLanguageConfig(registry, language, fallbackLanguage = 'en') {
        return registry.find(item => item.id === language) ||
            registry.find(item => item.id === fallbackLanguage) ||
            { id: language, locale: language, browserPrefixes: [language] };
    }

    function localized(source, field = null, language = 'en') {
        if (source == null) return undefined;
        const value = field == null ? source : source[field];
        if (value != null && typeof value === 'object' && value[language] != null) return value[language];
        if (field == null) {
            for (const contentField of ['text', 'content', 'value']) {
                if (source[contentField] != null) return localized(source[contentField], null, language);
            }
        }
        if (field && source[`${field}_${language}`] != null) return source[`${field}_${language}`];
        if (field && source[`${field}_en`] != null) return source[`${field}_en`];
        if (field == null && source[language] != null) return source[language];
        if (field == null && source.en != null) return source.en;
        return typeof value === 'string' || Array.isArray(value) ? value : undefined;
    }

    function translate(bundles, path, language, fallbackLanguage = 'en') {
        const value = getPath(bundles[language], path);
        if (value != null) return value;
        const fallback = getPath(bundles[fallbackLanguage], path);
        return fallback == null ? path : fallback;
    }

    function isGeneratedIntention(value, standardDefault, highEnergyDefault) {
        const current = String(value || '').trim();
        return !current || current === standardDefault || current === highEnergyDefault;
    }

    function shouldRefreshLocalizedIntention(value, previousLanguage, currentLanguage, supportedLanguages, isGenerated) {
        if (typeof isGenerated !== 'function') throw new TypeError('Intention localization requires a generated-copy predicate');
        const languages = [...new Set([previousLanguage, currentLanguage, ...supportedLanguages])];
        return languages.some(language => isGenerated(value, language));
    }

    global.ChakraContentLocalization = Object.freeze({
        getPath, hasPath, hasLocalizedPath, validateScriptBundle,
        getLanguageConfig, localized, translate, isGeneratedIntention, shouldRefreshLocalizedIntention
    });
})(typeof window === 'undefined' ? globalThis : window);
