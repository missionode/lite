import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('modules/session-item-runner.js'), context);
const events = [];
const runner = context.window.ChakraSessionItemRunner.create({
  onStart: item => events.push(`start:${item.label}`),
  onSkip: item => events.push(`skip:${item.label}`),
  onFinish: (item, state) => events.push(`finish:${item.label}:${state.stale}`)
});
let release;
const pending = runner.run('orientation', () => new Promise(resolve => { release = resolve; }));
assert.equal(runner.skip(), true);
assert.equal(runner.skip(), false, 'one item accepts a single skip');
release();
assert.equal((await pending).skipped, true);
assert.deepEqual(events, ['start:orientation','skip:orientation','finish:orientation:false']);
runner.reset();

const html = read('index.html');
const app = read('app.js');
const sw = read('sw.js');
assert.match(html, /id="skip-meditation"[^>]+data-i18n="ui\.skipCurrentItem"/);
assert.equal((sw.match(/\.\/modules\/session-item-runner\.js\?v=1\.0/g) || []).length, 1);
for (const [file, ids] of [
  ['modules/sleep-journey.js',['Sleep stage','Sleep interval','Sleep ending fade']],
  ['modules/shot-session.js',['Shot ${stageLabel}','Shot interval']],
  ['modules/yoga-session.js',['Yoga pose ${pose.id}','Yoga preparation']],
  ['modules/experiment-session.js',["'Box Breathing'","'Ho’oponopono'"]],
  ['modules/standard-journey-sequence.js',["'Undo & Unlearn'","'Ho’oponopono'"]]
]) {
  const source = read(file);
  for (const label of ids) assert.ok(source.includes('runSessionItem(`' + label) || source.includes(`runSessionItem(${label}`) || source.includes(`runSessionItem('${label}'`), `${file} wraps ${label}`);
}
assert.match(app, /runSessionItem\('newcomer orientation', \(\) => this\.runNewcomerGuidedOrientation\(\)\)/);
assert.match(app, /if \(!this\.isMeditationActive\) return;[\s\S]*?showScreen\(icebreakerScreen\)/, 'skipped newcomer orientation must not show a transient Arriving screen');
assert.match(app, /runSessionItem\(`chakra \$\{key\}`/);
assert.match(app, /sessionItemRunner\.reset\(\)/);
console.log('Session item skip passed: one-shot runner, safe unwind, current-item wrappers, control and offline asset.');
