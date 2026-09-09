import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync('app.js','utf8');
const timers = new Map(); let next = 0;
function node(hidden = false) {
    const classes = new Set(hidden ? ['hidden'] : []);
    return { listeners:{}, hovered:false, focused:false,
        classList:{contains:x=>classes.has(x),add:x=>classes.add(x),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),toggle(x,on){on?classes.add(x):classes.delete(x);}},
        addEventListener(type,fn){this.listeners[type]=fn;}, matches(){return this.hovered;},querySelector(){return this.focused?{}:null;} };
}
const body=node(), controls=node(true), mixer=node(true), zone=node();
const elements={controls,'volume-mixer':mixer,'fullscreen-controls-reveal-zone':zone,app:{}};
const listeners={};
const document={body,hidden:false,fullscreenElement:null,getElementById:id=>elements[id]||null,addEventListener(type,fn){listeners[type]=fn;}};
const Prelude=vm.runInNewContext(source.slice(source.indexOf('class JourneyVideoPrelude {'),source.indexOf('class MeditationController {'))+';JourneyVideoPrelude',{
    document,MutationObserver:class{constructor(fn){this.fn=fn;}observe(){}},
    setTimeout(fn,delay){timers.set(++next,{fn,delay});return next;},clearTimeout(id){timers.delete(id);}
});
const view=new Prelude({});
const fire = id => {const item=timers.get(id);assert.ok(item);timers.delete(id);item.fn();};
controls.classList.remove('hidden');view.syncFullscreenJourneyChrome();
assert.ok(body.classList.contains('journey-controls-active'));
assert.equal(body.classList.contains('fullscreen-controls-visible'),false,'Controls start hidden outside fullscreen');
fire(view.cursorHideTimer);assert.ok(body.classList.contains('journey-cursor-hidden'));
listeners.pointermove({pointerType:'mouse'});assert.equal(body.classList.contains('journey-cursor-hidden'),false);
zone.hovered=true;zone.listeners.pointerenter({pointerType:'mouse'});
assert.ok(body.classList.contains('fullscreen-controls-visible'));
zone.hovered=false;zone.listeners.pointerleave({pointerType:'mouse'});fire(view.fullscreenChromeHideTimer);
assert.equal(body.classList.contains('fullscreen-controls-visible'),false);
controls.focused=true;controls.listeners.focusin();assert.ok(body.classList.contains('fullscreen-controls-visible'));
fire(view.cursorHideTimer);assert.equal(body.classList.contains('journey-cursor-hidden'),false,'Keyboard focus preserves cursor visibility');
controls.focused=false;
zone.hovered=true;zone.listeners.pointerdown({pointerType:'touch',preventDefault(){}});
controls.listeners.focusin();
fire(view.fullscreenChromeHideTimer);assert.equal(body.classList.contains('fullscreen-controls-visible'),false,'Sticky touchscreen hover does not prevent auto-hide');
mixer.classList.remove('hidden');view.syncFullscreenJourneyChrome();
assert.ok(body.classList.contains('fullscreen-controls-visible'));
fire(view.cursorHideTimer);assert.equal(body.classList.contains('journey-cursor-hidden'),false,'Open mixer preserves cursor');
mixer.classList.add('hidden');controls.classList.add('hidden');view.syncFullscreenJourneyChrome();
assert.equal(body.classList.contains('journey-controls-active'),false);
assert.equal(body.classList.contains('journey-cursor-hidden'),false);
assert.equal(timers.size,0,'Session exit clears idle/hide timers');
console.log('Journey chrome passed: idle cursor, hover, keyboard, touch, mixer and exit cleanup.');
const css=fs.readFileSync('style.css','utf8');
assert.doesNotMatch(css,/body\.sleep-mode-active #app\s*\{[^}]*\bfilter\s*:/,'Sleep cannot create a fixed-position containing block');
assert.doesNotMatch(css,/body\.eyes-close-mode\s*\{[^}]*\bfilter\s*:/,'Eyes Close cannot rebase fixed controls either');
assert.match(css,/--sleep-dimming:\s*0\.4/);
assert.match(css,/--eyes-close-dimming:\s*0\.85/);
assert.match(css,/opacity: calc\(var\(--app-brightness, 1\) \* var\(--sleep-dimming, 1\) \* var\(--eyes-close-dimming, 1\)\)/);
assert.doesNotMatch(source,/app(?:'\))?\.style\.opacity\s*=/,'Inline opacity cannot override composed dimming');
