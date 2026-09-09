import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
for(const file of ['app.js','index.html','style.css']) {
    assert.doesNotMatch(fs.readFileSync(file,'utf8'),/narration-scroll|data-narration-text|narrationTickerReadOrder|showNarrationText|refreshNarrationTicker/);
}
assert.match(app,/async narrateWithPiper/);
assert.match(app,/async narrateBrowser/);
assert.match(app,/piperTTS\.playBuffer\(buffer/);
assert.match(app,/speechSynthesis\.speak\(utterance\)/);
assert.match(app,/estimateNarrationDurationSeconds\(text\)/,'Session estimates remain');
assert.match(app,/sessionCountdownTicker/,'Session countdown remains');
console.log('Scrolling narration removed; audio paths and session estimates retained.');
