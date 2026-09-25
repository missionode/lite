(function installJourneyContentLoader(global) {
    "use strict";

    async function loadAndValidate(options) {
        const {
            scripts,
            scriptsLanguage,
            language,
            scriptSource,
            customScript,
            getContentSource,
            contentSource: configuredContentSource,
            onResolved = () => {},
            getValidationContext,
            validate,
            log = (...args) => global.console?.log(...args)
        } = options || {};
        if (typeof validate !== 'function' || typeof getValidationContext !== 'function') {
            throw new TypeError('Journey content loading requires a validator and validation-context provider');
        }

        let resolvedScripts = scripts;
        if (!resolvedScripts || scriptsLanguage !== language) {
            if (scriptSource === 'custom' && customScript) {
                log('Loading Custom Script from local storage...');
                resolvedScripts = customScript;
            } else {
                const contentSource = typeof getContentSource === 'function'
                    ? getContentSource()
                    : configuredContentSource || 'scripts.json';
                log(`Loading Language Content (${language}): ${contentSource}...`);
                const fetcher = options.fetcher || global.fetch.bind(global);
                const response = await fetcher(contentSource + (contentSource.includes('?') ? '&' : '?') + 'v=' + Date.now());
                if (!response.ok) throw new Error(`Unable to load language content (${response.status})`);
                resolvedScripts = await response.json();
            }
        }

        onResolved(resolvedScripts, language);
        const context = getValidationContext();
        const result = validate(resolvedScripts, context.options);
        if (!result.valid) {
            throw new Error(`Script has missing or invalid required sections: ${result.missing.slice(0, 5).join(', ')}`);
        }
        return { scripts: resolvedScripts, scriptsLanguage: language, context: context.value };
    }

    global.ChakraJourneyContentLoader = Object.freeze({ loadAndValidate });
})(typeof window === 'undefined' ? globalThis : window);
