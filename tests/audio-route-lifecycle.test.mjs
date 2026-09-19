import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/audio-route-lifecycle.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const service = context.ChakraAudioRouteLifecycle;
assert.ok(Object.isFrozen(service), 'audio route lifecycle should expose a stable API');

const nodes = () => ({
    connections: 1,
    connect() { this.connections++; },
    disconnect() { this.connections--; }
});
const input = nodes();
const convolver = nodes();
const output = nodes();
const deadlines = [];
const owner = {
    ctx: {
        currentTime: 10,
        sampleRate: 48000,
        destination: {},
        createBuffer: () => ({}),
        createBufferSource() {
            const deadline = {
                connect() {}, disconnect() { this.disconnected = true; }, start() {},
                stop(time) { this.endsAt = time; }
            };
            deadlines.push(deadline);
            return deadline;
        }
    }
};

service.setConvolverActive(owner, 'voice', input, convolver, output, false, 3);
assert.equal(deadlines[0].endsAt, 13);
assert.equal(input.connections, 1, 'effect tail remains connected until its audio-clock deadline');
service.setConvolverActive(owner, 'voice', input, convolver, output, true);
assert.equal(deadlines[0].onended, null, 'reactivation cancels stale retirement');
assert.equal(deadlines[0].disconnected, true);
service.setConvolverActive(owner, 'voice', input, convolver, output, false, 3);
deadlines[1].onended();
assert.equal(input.connections, 0);
assert.equal(convolver.connections, 0);
service.setConvolverActive(owner, 'voice', input, convolver, output, true);
service.setConvolverActive(owner, 'voice', input, convolver, output, true);
assert.equal(input.connections, 1, 'repeated activation reconnects exactly once');
service.setConvolverActive(owner, 'voice', input, convolver, output, false, 0);
assert.equal(input.connections, 0, 'zero-tail shutdown disconnects immediately');

const app = fs.readFileSync('app.js', 'utf8');
assert.match(app, /audioRouteLifecycle\.setConvolverActive\(this, key, input, convolver, output, active, tailSeconds\)/, 'AudioEngine should delegate effect-route ownership');

console.log('Audio route lifecycle contract passed: tail deadlines, cancellation, idempotent reconnect and immediate cleanup.');
