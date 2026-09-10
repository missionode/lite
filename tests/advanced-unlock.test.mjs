import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('app.js','utf8');
const block=source.slice(source.indexOf('    const intimateServiceToggles = ['),source.indexOf('    function isIntimateServiceToggle('));
function setup(noFrequencyMode=false) {
    let now=0,id=0; const timers=new Map(), elements=new Map();
    const element=()=>({hidden:false,checked:false,disabled:false,textContent:'',listeners:{},setAttribute(){},addEventListener(name,fn){this.listeners[name]=fn;},
        remove(){this.attached=false;},appendChild(child){child.attached=true;},querySelectorAll(){return [];},dispatchEvent(event){this.lastEvent=event.type;}});
    const get=name=>{if(!elements.has(name)) elements.set(name,element());return elements.get(name);};
    const toast=element();
    const document={hidden:false,getElementById:get,createElement:()=>toast,body:{appendChild(){}},addEventListener(){}};
    const state={noFrequencyMode};
    vm.runInNewContext(block,{document,state,Event,performance:{now:()=>now},getChecked:name=>get(name).checked,
        localStorage:{setItem(){}},saveConfigBtn:get('save-config'),shotsToggle:get('shots-toggle'),prepareRepertoryShotFromUrl(){},
        setTimeout(fn,delay){timers.set(++id,{fn,at:now+delay});return id;},clearTimeout:key=>timers.delete(key),
        t:key=>key==='ui.advancedUnlockRemaining'?'{{remaining}} remaining':key,
        updateExperienceModeVisibility(){},updateSessionEstimate(){},updateJourneyRoadmap(){}});
    const advance=ms=>{now+=ms;for(const [key,timer] of [...timers]) if(timer.at<=now){timers.delete(key);timer.fn();}};
    return {get,toast,state,advance,tap:()=>get('app-version-unlock').listeners.click()};
}
const app=setup();
assert.equal(app.get('intimate-service-panel').hidden,true);
assert.equal(app.get('shots-control').hidden,true);
assert.equal(app.get('sound-healing-title').hidden,true);
assert.equal(app.get('shots-toggle').disabled,true);
assert.equal(app.get('advanced-features-control').hidden,true);
assert.equal(app.get('experiment-care-group').attached,false,'Locked care is absent from native activity picker');
assert.equal(app.state.advancedFeaturesUnlocked,false);
for(let i=0;i<4;i++){app.tap();app.advance(100);assert.equal(app.toast.textContent,'');}
app.tap(); assert.equal(app.toast.textContent,'2 remaining');
app.advance(100);app.tap();assert.equal(app.toast.textContent,'1 remaining');
app.advance(100);app.tap();
assert.equal(app.get('intimate-service-panel').hidden,false);
assert.equal(app.get('shots-control').hidden,false);
assert.equal(app.get('sound-healing-title').hidden,false);
assert.equal(app.get('shots-toggle').disabled,false);
app.get('shots-toggle').checked=true;
assert.equal(app.get('advanced-features-toggle').checked,true);
assert.equal(app.get('massage-toggle').disabled,false);
assert.equal(app.get('experiment-care-group').attached,true);
assert.equal(app.get('experiment-care-group').disabled,false);
app.get('experiment-activity').value='perineal';
app.get('massage-toggle').checked=true;app.state.massageEnabled=true;
app.get('advanced-features-toggle').checked=false;
app.get('advanced-features-toggle').listeners.change();
assert.equal(app.get('intimate-service-panel').hidden,true);
assert.equal(app.state.massageEnabled,false);
assert.equal(app.get('shots-control').hidden,true);
assert.equal(app.get('shots-toggle').checked,false);
assert.equal(app.get('shots-toggle').disabled,true);
assert.equal(app.get('massage-toggle').disabled,true);
assert.equal(app.get('experiment-care-group').attached,false);
assert.equal(app.get('experiment-activity').value,'chakra:root','Re-lock clears stale care selection');
assert.equal(app.get('experiment-activity').lastEvent,'change','Duration controls resync after reset');
app.advance(3000);
for(let i=0;i<6;i++){app.tap();app.advance(100);}
app.advance(1600); app.tap();
assert.equal(app.get('intimate-service-panel').hidden,true,'Timeout restarts at tap one');
assert.equal(app.toast.textContent,'','Restarted sequence is silent');
for(let i=0;i<6;i++){app.advance(100);app.tap();}
assert.equal(app.get('intimate-service-panel').hidden,false);
assert.equal(setup().get('intimate-service-panel').hidden,true,'New page locks again');
assert.equal(setup().get('shots-control').hidden,true,'New page locks Shots again');
assert.equal(app.get('intimate-service-panel').listeners.click,undefined,'Panel itself is no longer an unlock target');
assert.match(source,/element.hidden = shots \|\| \(id === 'intimate-service-panel' && !intimateServiceUnlocked\)/,'Mode changes preserve the lock');
for(const locale of ['en','ml','ru','hi']) {
    const ui=JSON.parse(fs.readFileSync(`locales/${locale}.json`,'utf8')).ui;
    for(const key of ['aboutApp','appVersion','advancedFeatures','advancedUnlockRemaining','advancedFeaturesEnabled','advancedFeaturesDisabled']) assert.ok(ui[key]);
}
console.log('Advanced unlock passed: silent taps, countdown, seven taps, timeout, re-lock, reload and translations.');
const experiment=source.slice(source.indexOf('    async startExperiment(activity)'),source.indexOf('    stopExperiment()'));
const controller=vm.runInNewContext('({'+experiment+'})',{state:{advancedFeaturesUnlocked:false}});
for(const activity of ['perineal','bath','assisted-bath']) await controller.startExperiment(activity);
assert.equal(controller.isStarting,undefined,'Locked care cannot start even through a direct call');
console.log('Experiment care follows shared unlock, re-lock and execution guard.');
const shot=source.slice(source.indexOf('    async runShot('),source.indexOf('    finishShot()'));
const lockedShot=vm.runInNewContext('({'+shot+'})',{state:{advancedFeaturesUnlocked:false}});
await lockedShot.runShot('meditation');
assert.equal(lockedShot.isShotActive,undefined,'Locked direct Shot call does not activate audio');
const html=fs.readFileSync('index.html','utf8');
assert.match(html, /id="shots-control"[^>]* hidden/);
assert.match(html, /id="sound-healing-title"[^>]* hidden/);
console.log('Shots shares visibility, reset and direct execution guard.');
const noFrequency=setup(true);
for(let i=0;i<7;i++) noFrequency.tap();
assert.equal(noFrequency.get('shots-control').hidden,false);
assert.equal(noFrequency.get('shots-toggle').disabled,true,'Unlock preserves No Frequency restriction');
const handoff=source.slice(source.indexOf('    function prepareRepertoryShotFromUrl()'),source.indexOf('    [corpsePoseToggle].forEach'));
const handoffState={advancedFeaturesUnlocked:false};
const pending={state:handoffState,URL,window:{location:{href:'https://example.test/?shotSource=repertory&shotFrequency=528'},history:{replaceState(){pending.consumed=true;}}},
    shotsToggle:{checked:false,dispatchEvent(){pending.confirmed=true;}},shotTypeSelect:{},document:{getElementById:()=>({})},
    resetShotDurationForType(){},Event,showScreen(){},lobbyScreen:{},updateExperienceModeVisibility(){},updateSessionEstimate(){}};
pending.window.requestAnimationFrame=()=>{};
vm.createContext(pending);
vm.runInContext(handoff+'; prepareRepertoryShotFromUrl();',pending);
assert.equal(pending.consumed,undefined,'Locked repertory URL remains pending');
assert.equal(pending.confirmed,undefined,'No confirmation before unlock');
handoffState.advancedFeaturesUnlocked=true;
vm.runInContext('prepareRepertoryShotFromUrl()',pending);
assert.equal(pending.consumed,true);
assert.equal(pending.confirmed,true,'Unlocked handoff uses normal confirmation');
assert.equal(pending.shotTypeSelect.value,'custom');
