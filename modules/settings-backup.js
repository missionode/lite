(function installSettingsBackup(global) {
    'use strict';

    const FORMAT = 'chakra-meditation-settings';
    const VERSION = 1;
    const MAX_BYTES = 2 * 1024 * 1024;
    const isManagedSettingKey = (key) => /^chakra_[a-z0-9_]+$/i.test(key);

    function collectManagedSettings(storage = global.localStorage) {
        const settings = {};
        for (let index = 0; index < storage.length; index += 1) {
            const key = storage.key(index);
            if (key && isManagedSettingKey(key)) settings[key] = storage.getItem(key);
        }
        return settings;
    }

    function parseSettingsBackup(text) {
        if (typeof text !== 'string' || new Blob([text]).size > MAX_BYTES) {
            throw new Error('The settings backup is too large.');
        }
        const backup = JSON.parse(text);
        if (!backup || backup.format !== FORMAT || backup.version !== VERSION || !backup.settings || Array.isArray(backup.settings)) {
            throw new Error('This is not a compatible settings backup.');
        }
        const entries = Object.entries(backup.settings);
        if (entries.length > 200 || entries.some(([key, value]) => !isManagedSettingKey(key) || typeof value !== 'string' || value.length > 512 * 1024)) {
            throw new Error('The settings backup contains invalid values.');
        }
        return Object.fromEntries(entries);
    }

    function replaceManagedSettings(settings, storage = global.localStorage) {
        for (let index = storage.length - 1; index >= 0; index -= 1) {
            const key = storage.key(index);
            if (key && isManagedSettingKey(key)) storage.removeItem(key);
        }
        Object.entries(settings).forEach(([key, value]) => storage.setItem(key, value));
    }

    global.ChakraSettingsBackup = Object.freeze({
        FORMAT,
        VERSION,
        MAX_BYTES,
        collectManagedSettings,
        parseSettingsBackup,
        replaceManagedSettings
    });
})(typeof window === 'undefined' ? globalThis : window);
