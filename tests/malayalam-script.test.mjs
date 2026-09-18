import assert from 'node:assert/strict';
import fs from 'node:fs';

const scripts = JSON.parse(fs.readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));
const malayalam = [];

function collect(value, path = '') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    if ((key === 'ml' || key.endsWith('_ml')) && typeof child === 'string') {
      malayalam.push({ path: childPath, text: child });
    }
    collect(child, childPath);
  }
}

collect(scripts);

assert.equal(malayalam.length, 59, 'Production should retain every Malayalam narration field.');
assert.ok(malayalam.every(({ text }) => text.trim()), 'Malayalam narration fields must not be blank.');

const fullText = malayalam.map(({ text }) => text).join('\n');
for (const outdated of [
  'സൌമ്യ',
  'നിശബ്ദ',
  'അടുത്ത ഭാവത്തിലേക്ക്',
  'പിൻവാങ്ങുന്ന ചന്ദ്രൻ',
  'പൂർണ്ണമായി എന്നിൽ ശ്രദ്ധിക്കൂ',
  'മനസ്സിലോ സാവധാനമായോ',
]) {
  assert.doesNotMatch(fullText, new RegExp(outdated, 'u'), `Malayalam narration should not contain: ${outdated}`);
}

assert.equal(scripts.hooponopono.phrases.ml[0], 'എനിക്ക് ഖേദമുണ്ട്', '“I am sorry” must retain its meaning.');
assert.equal(scripts.yoga.next_pose_prompt.ml, 'അടുത്ത ആസനത്തിലേക്ക് സാവധാനം തയ്യാറാകൂ.');
assert.match(scripts.intro.moon.waning_ml, /തേയുന്ന ചന്ദ്രനെ/u);

console.log('Malayalam production narration contract passed.');
