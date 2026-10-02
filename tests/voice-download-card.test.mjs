import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/voice-download-card.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const lifecycle = fs.readFileSync(new URL('../modules/piper-lifecycle.js', import.meta.url), 'utf8');

// Tiny DOM: enough for the card to render and be inspected.
class Node {
    constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.dataset = {}; this.style = {}; this.hidden = false; this.textContent = ''; this.listeners = {}; }
    append(...nodes) { this.children.push(...nodes); }
    replaceChildren(...nodes) { this.children = [...nodes]; }
    setAttribute(key, value) { this.attrs[key] = value; }
    addEventListener(type, fn) { this.listeners[type] = fn; }
    get text() { return [this.textContent, ...this.children.map(child => child.text)].join(' ').trim(); }
    find(test) { if (test(this)) return this; for (const child of this.children) { const hit = child.find(test); if (hit) return hit; } return null; }
}
function makeDocument() {
    const card = new Node('div'); card.id = 'voice-download-card';
    const body = new Node('body');
    const byId = { 'voice-download-card': card };
    return {
        body, card,
        createElement: tag => new Node(tag),
        getElementById: id => byId[id] || body.children.find(node => node.id === id) || null
    };
}
const t = key => ({
    'ui.voiceDlTitle': 'Voice download',
    'ui.voiceDlNeeded': 'This voice downloads once ({{size}} MB), then works offline. Wi-Fi is best.',
    'ui.voiceDlStored': 'Downloaded. This voice works offline.',
    'ui.voiceDlButton': 'Download now',
    'ui.voiceDlProgress': 'Downloading voice… {{loaded}} of {{total}} MB ({{percent}}%)',
    'ui.voiceDlKeepOpen': 'Keep the app open until it finishes.',
    'ui.voiceDlMobileData': 'You seem to be on mobile data.',
    'ui.voiceDlFailed': 'Download stopped. Check your internet and try again.'
}[key] || key);

function storageWith(files) {
    return { getDirectory: async () => ({ getDirectoryHandle: async name => {
        if (name !== 'piper') throw new Error('missing');
        return { getFileHandle: async file => { if (!(file in files)) throw new Error('missing'); return { getFile: async () => ({ size: files[file] }) }; } };
    } }) };
}

const context = vm.createContext({});
vm.runInContext(source, context);
const api = context.ChakraVoiceDownloadCard;
const definition = { modelPath: 'ml/ml_IN/arjun/medium/ml_IN-arjun-medium.onnx', modelSize: 62950044 };
assert.equal(api.modelFileName(definition), 'ml_IN-arjun-medium.onnx');
assert.equal(api.toMB(62950044), 60);

// Not downloaded: size, offline note, Wi-Fi advice, mobile-data hint, button.
{
    const document = makeDocument();
    let downloads = 0;
    const card = api.create({ document, t, navigator: { storage: storageWith({}), connection: { type: 'cellular' } }, getDefinition: () => definition, onDownload: async () => { downloads += 1; } });
    await card.refresh();
    assert.equal(card.status, 'needed');
    assert.match(document.card.text, /downloads once \(60 MB\), then works offline\. Wi-Fi is best\./);
    assert.match(document.card.text, /mobile data/);
    const button = document.card.find(node => node.dataset.voiceDl === 'download');
    assert.ok(button, 'a Download now button is shown');
    await button.listeners.click();
    assert.equal(downloads, 1);

    // Progress: MB and percent on the card and in the floating pill.
    card.progress(31475022, 62950044);
    assert.equal(card.status, 'downloading');
    assert.match(document.card.text, /30 of 60 MB \(50%\)/);
    assert.match(document.card.text, /Keep the app open/);
    const bar = document.card.find(node => node.attrs.role === 'progressbar');
    assert.equal(bar.attrs['aria-valuenow'], '50');
    const pill = document.getElementById('voice-download-pill');
    assert.equal(pill.hidden, false, 'progress stays visible on any screen');
    assert.match(pill.text, /30 of 60 MB \(50%\)/);

    // Failure shows a clear retry message.
    card.failed();
    assert.equal(card.status, 'failed');
    assert.match(document.card.text, /Download stopped/);
    assert.equal(pill.hidden, true);
}

// Already downloaded: a green "works offline" state, no button, no pill.
{
    const document = makeDocument();
    const card = api.create({ document, t, navigator: { storage: storageWith({ 'ml_IN-arjun-medium.onnx': 62950044 }) }, getDefinition: () => definition, onDownload: async () => {} });
    await card.refresh();
    assert.equal(card.status, 'stored');
    assert.match(document.card.text, /Downloaded\. This voice works offline\./);
    assert.equal(document.card.find(node => node.dataset.voiceDl === 'download'), null);
}

// A half-written file does not count as downloaded; browser voices hide the card.
{
    const document = makeDocument();
    const card = api.create({ document, t, navigator: { storage: storageWith({ 'ml_IN-arjun-medium.onnx': 1000 }) }, getDefinition: () => definition });
    await card.refresh();
    assert.equal(card.status, 'needed');
    const browser = api.create({ document, t, navigator: {}, getDefinition: () => null });
    await browser.refresh();
    assert.equal(document.card.hidden, true);
}

// Wiring: card in Settings, loaded and cached, fed by the Piper worker progress.
assert.match(html, /id="voice-status"[\s\S]*?<div id="voice-download-card" class="voice-dl" hidden><\/div>/);
assert.ok(html.indexOf('modules/voice-download-card.js?v=1.0') < html.indexOf('app.js?v='));
assert.match(sw, /'\.\/modules\/voice-download-card\.js\?v=1\.0'/);
assert.match(lifecycle, /deps\.onDownloadProgress\(loaded, total\)/);
assert.match(lifecycle, /deps\.onVoiceReady\(\)/);
assert.match(app, /onDownloadProgress: \(loaded, total\) => voiceDownloadCard\.progress\(loaded, total\)/);
console.log('Voice download card passed: size and offline note, Wi-Fi and mobile-data hints, button, MB/percent progress, floating pill, failure, stored state.');
