import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../modules/newcomer-marker-layout.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /new window\.ChakraNewcomerMarkerLayout\([\s\S]*?stage: newcomerMarkerStage[\s\S]*?svg:/);
assert.match(app, /newcomerMarkerLayout\.schedule\(\)/);
assert.match(html, /modules\/newcomer-marker-layout\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.07/);
assert.match(sw, /chakra-v5\.303[\s\S]*?modules\/newcomer-marker-layout\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const Layout = context.ChakraNewcomerMarkerLayout;
assert.equal(typeof Layout, 'function');
assert.deepEqual(JSON.parse(JSON.stringify(Layout.ANCHORS)), {
  crown: [0.5, 0.065], thirdeye: [0.5, 0.123], throat: [0.5, 0.205],
  heart: [0.5, 0.297], solar: [0.5, 0.385], sacral: [0.5, 0.465], root: [0.5, 0.548]
});
assert.throws(() => new Layout({}), /requires its stage, SVG/);

const callbacks = new Map();
const paths = new Map();
const labels = new Map();
const imageListeners = new Map();
let nextFrame = 0;
let observerCallback;
let observed;
let disconnected = false;
const requested = [];
const cancelled = [];
const stageRect = { left: 10, top: 20, width: 600, height: 800 };
const imageRect = { left: 110, top: 60, width: 400, height: 700 };
const stage = {
  querySelector(selector) {
    if (selector === 'img') return image;
    const marker = selector.match(/data-marker="([^"]+)"/)?.[1];
    return labels.get(marker) ?? null;
  },
  getBoundingClientRect: () => stageRect
};
const image = {
  complete: true,
  getBoundingClientRect: () => imageRect,
  addEventListener: (type, callback) => imageListeners.set(type, callback),
  removeEventListener: (type, callback) => {
    if (imageListeners.get(type) === callback) imageListeners.delete(type);
  }
};
const svg = {
  attributes: new Map(),
  setAttribute: (name, value) => svg.attributes.set(name, value),
  querySelector(selector) {
    const marker = selector.match(/data-marker="([^"]+)"/)?.[1];
    return paths.get(marker) ?? null;
  }
};
const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
for (const marker of Object.keys(Layout.ANCHORS)) {
  const leftSide = ['crown', 'throat', 'solar', 'root'].includes(marker);
  labels.set(marker, { getBoundingClientRect: () => rect(leftSide ? 20 : 500, 100, 80, 40) });
  paths.set(marker, { attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value); } });
}
class FakeResizeObserver {
  constructor(callback) { observerCallback = callback; }
  observe(target) { observed = target; }
  disconnect() { disconnected = true; }
}
const layout = new Layout({
  stage,
  svg,
  requestFrame(callback) { requested.push(callback); callbacks.set(++nextFrame, callback); return nextFrame; },
  cancelFrame(id) { cancelled.push(id); callbacks.delete(id); },
  ResizeObserverCtor: FakeResizeObserver
});
assert.equal(observed, stage);
assert.ok(imageListeners.has('load'));

layout.schedule();
layout.schedule();
assert.equal(requested.length, 1, 'Concurrent resize/load events are coalesced into one frame.');
callbacks.get(1)();
assert.equal(svg.attributes.get('viewBox'), '0 0 600 800');
assert.equal(paths.get('crown').attributes.get('d'), 'M 90 85.5 C 178.2 85.5, 211.8 85.5, 300 85.5');
assert.equal(paths.get('thirdEye')?.attributes.get('d'), undefined);
assert.equal(paths.get('thirdeye').attributes.get('d'), 'M 490 120 C 410.2 120, 379.8 126.1, 300 126.1');

image.complete = false;
layout.schedule();
callbacks.get(2)();
assert.equal(paths.get('crown').attributes.get('d'), 'M 90 85.5 C 178.2 85.5, 211.8 85.5, 300 85.5', 'An incomplete image does not overwrite the last valid layout.');
image.complete = true;
imageListeners.get('load')();
observerCallback();
assert.equal(requested.length, 3, 'Image load and observer callbacks share one pending frame.');
layout.destroy();
assert.equal(disconnected, true);
assert.equal(imageListeners.has('load'), false);
assert.deepEqual(cancelled, [3], 'Destroy cancels pending animation work.');

console.log('Newcomer marker geometry lifecycle passed: unchanged normalized anchors and curves, image/resize scheduling, frame coalescing and cleanup.');
