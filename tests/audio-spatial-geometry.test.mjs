import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-spatial-geometry.js', import.meta.url), 'utf8');
const context = vm.createContext({ Math, Object, window: {} });
vm.runInContext(source, context);
const geometry = context.window.ChakraAudioSpatialGeometry;
assert.ok(Object.isFrozen(geometry));

const createParam = value => ({
    value,
    calls: [],
    cancelAndHoldAtTime(time) { this.calls.push(['hold', time]); },
    cancelScheduledValues(time) { this.calls.push(['cancel', time]); },
    setValueAtTime(next, time) { this.value = next; this.calls.push(['set', next, time]); },
    linearRampToValueAtTime(next, time) { this.calls.push(['ramp', next, time]); }
});

const spatial = {
    positionX: createParam(0.5),
    positionY: createParam(0.5),
    positionZ: createParam(-2)
};
geometry.setPosition(spatial, { x: 1, y: -1, z: -4 }, 10);
assert.deepEqual(spatial.positionX.calls.at(-1), ['ramp', 1, 11.2]);
assert.deepEqual(spatial.positionY.calls.at(-1), ['ramp', -1, 11.2]);
assert.deepEqual(spatial.positionZ.calls.at(-1), ['ramp', -4, 11.2]);

const stereo = { pan: createParam(0) };
geometry.setPosition(stereo, { x: 1e100, y: 0, z: -1 }, 20);
assert.deepEqual(stereo.pan.calls.at(-1), ['ramp', 1, 21.2]);
geometry.setPosition(stereo, { x: -1e100, y: 0, z: -1 }, 30);
assert.deepEqual(stereo.pan.calls.at(-1), ['ramp', -1, 31.2]);
geometry.setPosition(null, { x: 0, y: 0, z: -1 }, 0);

let legacyPosition;
const legacyPanner = { setPosition: (...position) => { legacyPosition = position; } };
const ctx = {
    createPanner: () => legacyPanner,
    createStereoPanner: () => ({ fallback: true })
};
assert.equal(geometry.createPanner(ctx), legacyPanner);
assert.deepEqual(legacyPosition, [0, 0, -1]);
assert.equal(legacyPanner.distanceModel, 'inverse');
assert.equal(legacyPanner.refDistance, 1);
assert.equal(legacyPanner.maxDistance, 10000);
assert.equal(legacyPanner.rolloffFactor, 0);
assert.equal(legacyPanner.panningModel, 'equalpower');
const modernPanner = { positionX: createParam(5), positionY: createParam(5), positionZ: createParam(5) };
assert.equal(geometry.createPanner({ createPanner: () => modernPanner }), modernPanner);
assert.deepEqual([modernPanner.positionX.value, modernPanner.positionY.value, modernPanner.positionZ.value], [0, 0, -1]);
assert.deepEqual(geometry.createPanner({ createStereoPanner: () => ({ fallback: true }) }), { fallback: true });

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /audioSpatialGeometry\.createPanner\(this\.ctx\)/);
assert.match(app, /audioSpatialGeometry\.setPosition\(node, position, now\)/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-spatial-geometry.js?v=1.0') < html.indexOf('app.js?v=4.09'));
assert.match(sw, /\.\/modules\/audio-spatial-geometry\.js\?v=1\.0/);

console.log('Audio spatial geometry contract passed: Web Audio panner defaults, legacy API fallback, timed 3D and stereo movement.');
