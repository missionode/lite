(function installSettingsManagerView(global) {
    'use strict';

    function bind({
        document = global.document,
        window = global,
        configScreen,
        settingsManagerScreen,
        showScreen,
        advancedFeaturesUnlocked = () => false,
        backup = global.ChakraSettingsBackup,
        t = key => key
    } = {}) {
        const managerButton = document.getElementById('open-settings-manager');
        const status = document.getElementById('settings-manager-status');
        const importFileInput = document.getElementById('import-settings-file');
        const setStatus = message => { if (status) status.textContent = message; };

        managerButton?.addEventListener('click', () => {
            setStatus('');
            showScreen(settingsManagerScreen);
        });
        document.getElementById('close-settings-manager')?.addEventListener('click', () => {
            showScreen(configScreen);
        });
        document.getElementById('export-settings')?.addEventListener('click', () => {
            if (!advancedFeaturesUnlocked()) return;
            const serialized = JSON.stringify({
                format: backup.FORMAT,
                version: backup.VERSION,
                exportedAt: new Date().toISOString(),
                settings: backup.collectManagedSettings()
            }, null, 2);
            const url = window.URL.createObjectURL(new window.Blob([serialized], { type: 'application/json' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chakra-meditation-settings.json';
            link.click();
            window.URL.revokeObjectURL(url);
            setStatus(t('ui.settingsExported'));
        });
        document.getElementById('import-settings')?.addEventListener('click', async () => {
            const file = importFileInput?.files?.[0];
            if (!file) {
                setStatus(t('ui.settingsImportChooseFile'));
                return;
            }
            try {
                const settings = backup.parseSettingsBackup(await file.text());
                if (!window.confirm(t('ui.settingsImportConfirm'))) return;
                backup.replaceManagedSettings(settings);
                setStatus(t('ui.settingsImported'));
                window.location.reload();
            } catch (error) {
                setStatus(error.message || t('ui.settingsImportInvalid'));
            }
        });
    }

    global.ChakraSettingsManagerView = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
