import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('app.js','utf8');
const visibilityView=fs.readFileSync('modules/lobby-experience-visibility.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const block=source.slice(source.indexOf('    const intimateServiceToggles = ['),source.indexOf('    window.ChakraSettingsManagerView.bind('));
const approvedDigest=Uint8Array.from('5ba583e9f1bc6e5836e2822f5982c8cafeb4390af1f9ed140926dd3326e515a3'.match(/.{2}/g).map(value=>parseInt(value,16))).buffer;
function setup(noFrequencyMode=false,passwordAccepted=true) {
    let now=0,id=0; const timers=new Map(), elements=new Map();
    const element=()=>({hidden:false,checked:false,disabled:false,textContent:'',listeners:{},setAttribute(){},addEventListener(name,fn){this.listeners[name]=fn;},
        remove(){this.attached=false;},appendChild(child){child.attached=true;},querySelectorAll(){return [];},dispatchEvent(event){this.lastEvent=event.type;}});
    const get=name=>{if(!elements.has(name)) elements.set(name,element());return elements.get(name);};
    const toast=element();
    const document={hidden:false,getElementById:get,createElement:()=>toast,body:{appendChild(){}},addEventListener(){}};
    const state={noFrequencyMode};
    const audio={stopped:false,stopPleasureAmbience(){this.stopped=true;}};
    vm.runInNewContext(block,{document,state,Event,TextEncoder,ADVANCED_FEATURES_PASSWORD_HASH:'5ba583e9f1bc6e5836e2822f5982c8cafeb4390af1f9ed140926dd3326e515a3',requestAdvancedPassword:async()=> 'operator-entry',crypto:{subtle:{digest:async()=>passwordAccepted?approvedDigest:new ArrayBuffer(32)}},performance:{now:()=>now},getChecked:name=>get(name).checked,syncChecked:(name,value)=>{get(name).checked=value;},
        localStorage:{setItem(){}},saveConfigBtn:get('save-config'),shotsToggle:get('shots-toggle'),sleepModeToggle:get('sleep-mode-toggle'),yogaExperienceToggle:get('yoga-experience-toggle'),yogaExperienceSetup:get('yoga-experience-setup'),prepareRepertoryShotFromUrl(){},
        audio,particleField:{setDeepSkyBlackHoleEnabled(value){state.deepSkyBlackHoleEnabled=value;}},syncPleasureAmbienceControl(){},
        clearSleepMode(){get('sleep-mode-toggle').checked=false;state.sleepExperienceEnabled=false;state.sleepMode=false;},
        setTimeout(fn,delay){timers.set(++id,{fn,at:now+delay});return id;},clearTimeout:key=>timers.delete(key),
        t:key=>key==='ui.advancedUnlockRemaining'?'{{remaining}} remaining':key,
        updateExperienceModeVisibility(){},updateSessionEstimate(){},updateJourneyRoadmap(){}});
    const advance=ms=>{now+=ms;for(const [key,timer] of [...timers]) if(timer.at<=now){timers.delete(key);timer.fn();}};
    return {get,toast,state,audio,advance,tap:()=>get('app-version-unlock').listeners.click()};
}
const app=setup();
assert.equal(app.get('intimate-service-panel').hidden,true);
assert.equal(app.get('shots-control').hidden,true);
assert.equal(app.get('sound-healing-title').hidden,true);
assert.equal(app.get('shots-toggle').disabled,true);
assert.equal(app.get('sleep-mode-control').hidden,true);
assert.equal(app.get('sleep-mode-toggle').disabled,true);
assert.equal(app.get('yoga-mode-control').hidden,true);
assert.equal(app.get('yoga-experience-toggle').disabled,true);
assert.equal(app.get('advanced-features-control').hidden,true);
assert.equal(app.get('deep-sky-black-hole-toggle').checked,false);
assert.equal(app.get('experiment-care-group').attached,false,'Locked care is absent from native activity picker');
assert.equal(app.state.advancedFeaturesUnlocked,false);
assert.equal(app.audio.stopped,true,'Locked Advanced Features should stop Mood & Relaxation ambience.');
assert.match(source, /if \(isLocked\) \{[\s\S]*?state\.moodRelaxationIntentionEnabled = false;[\s\S]*?audio\.stopPleasureAmbience\(\)/, 'Relocking Advanced Features must disable and stop Mood & Relaxation ambience.');
assert.match(source, /mood-relaxation-intention-toggle'\)\?\.addEventListener\('change', \(e\) => \{[\s\S]*?!state\.advancedFeaturesUnlocked \|\| state\.noFrequencyMode/, 'Mood & Relaxation ambience must reject direct activation while Advanced Features is locked.');
for(let i=0;i<4;i++){app.tap();app.advance(100);assert.equal(app.toast.textContent,'');}
app.tap(); assert.equal(app.toast.textContent,'2 remaining');
app.advance(100);app.tap();assert.equal(app.toast.textContent,'1 remaining');
app.advance(100);await app.tap();
assert.equal(app.get('intimate-service-panel').hidden,false);
assert.equal(app.get('shots-control').hidden,false);
assert.equal(app.get('sound-healing-title').hidden,false);
assert.equal(app.get('shots-toggle').disabled,false);
assert.equal(app.get('sleep-mode-control').hidden,false);
assert.equal(app.get('sleep-mode-toggle').disabled,false);
assert.equal(app.get('yoga-mode-control').hidden,false);
assert.equal(app.get('yoga-experience-toggle').disabled,false);
app.get('sleep-mode-toggle').checked=true; app.state.sleepExperienceEnabled=true; app.state.sleepMode=true;
app.get('yoga-experience-toggle').checked=true; app.state.yogaExperienceEnabled=true;
app.get('shots-toggle').checked=true;
assert.equal(app.get('advanced-features-toggle').checked,true);
assert.equal(app.state.deepSkyBlackHoleEnabled,true,'Deep-sky object appears automatically after the shared unlock.');
assert.match(source, /particleField\.setDeepSkyBlackHoleEnabled\(!isLocked\)/,
    'Deep-sky visibility must follow the shared Advanced Features lock without a separate control.');
assert.equal(app.get('massage-toggle').disabled,false);
assert.equal(app.get('experiment-care-group').attached,true);
assert.equal(app.get('experiment-care-group').disabled,false);
app.get('experiment-activity').value='perineal';
app.get('massage-toggle').checked=true;app.state.massageEnabled=true;
app.get('advanced-features-toggle').checked=false;
app.get('advanced-features-toggle').listeners.change();
assert.equal(app.get('intimate-service-panel').hidden,true);
assert.equal(app.state.deepSkyBlackHoleEnabled,false,'Re-lock clears the session-only deep-sky object.');
assert.equal(app.state.massageEnabled,false);
assert.equal(app.get('shots-control').hidden,true);
assert.equal(app.get('shots-toggle').checked,false);
assert.equal(app.get('shots-toggle').disabled,true);
assert.equal(app.get('sleep-mode-control').hidden,true);
assert.equal(app.get('sleep-mode-toggle').checked,false);
assert.equal(app.get('sleep-mode-toggle').disabled,true);
assert.equal(app.state.sleepExperienceEnabled,false);
assert.equal(app.state.sleepMode,false);
assert.equal(app.get('yoga-mode-control').hidden,true);
assert.equal(app.get('yoga-experience-toggle').checked,false);
assert.equal(app.get('yoga-experience-toggle').disabled,true);
assert.equal(app.state.yogaExperienceEnabled,false);
assert.equal(app.get('massage-toggle').disabled,true);
assert.equal(app.get('experiment-care-group').attached,false);
assert.equal(app.get('experiment-activity').value,'chakra:root','Re-lock clears stale care selection');
assert.equal(app.get('experiment-activity').lastEvent,'change','Duration controls resync after reset');
app.advance(3000);
for(let i=0;i<6;i++){app.tap();app.advance(100);}
app.advance(1600); app.tap();
assert.equal(app.get('intimate-service-panel').hidden,true,'Timeout restarts at tap one');
assert.equal(app.toast.textContent,'','Restarted sequence is silent');
for(let i=0;i<5;i++){app.advance(100);app.tap();}
app.advance(100);await app.tap();
assert.equal(app.get('intimate-service-panel').hidden,false);
assert.equal(setup().get('intimate-service-panel').hidden,true,'New page locks again');
assert.equal(setup().get('shots-control').hidden,true,'New page locks Shots again');
assert.equal(setup().get('sleep-mode-control').hidden,true,'New page locks Sleep Mode again');
assert.equal(setup().get('yoga-mode-control').hidden,true,'New page locks Yoga Experience again');
assert.equal(app.get('intimate-service-panel').listeners.click,undefined,'Panel itself is no longer an unlock target');
assert.match(visibilityView,/element.hidden = shots \|\| \(id === 'intimate-service-panel' && !intimateServiceUnlocked\)/,'Mode changes preserve the lock');
for(const locale of ['en','ml','ru','hi']) {
    const ui=JSON.parse(fs.readFileSync(`locales/${locale}.json`,'utf8')).ui;
    for(const key of ['aboutApp','appVersion','advancedFeatures','advancedUnlockRemaining','advancedFeaturesEnabled','advancedFeaturesDisabled','advancedPasswordPrompt','advancedPasswordIncorrect']) assert.ok(ui[key]);
}
const denied=setup(false,false);
for(let i=0;i<6;i++){denied.tap();denied.advance(100);}
await denied.tap();
assert.equal(denied.get('intimate-service-panel').hidden,true,'Wrong password keeps Advanced Features locked.');
assert.match(source,/globalThis\.crypto\?\.subtle[\s\S]*?digest\('SHA-256'/,'Advanced password verification must use Web Crypto.');
assert.match(html, /id="advanced-password-input" type="password"[\s\S]*?id="advanced-password-reveal"[\s\S]*?Hold to reveal password/, 'The Advanced Features unlock must use a masked password field with a press-and-hold reveal control.');
assert.match(fs.readFileSync('style.css','utf8'), /\.advanced-password-entry input \{[\s\S]*?min-height: 48px;[\s\S]*?border: 1px solid rgba\(251, 191, 36, 0\.46\)[\s\S]*?background: rgba\(4, 8, 24, 0\.84\)[\s\S]*?\.advanced-password-entry input:focus/, 'The password field must have its own visible dark-sky styling and focus treatment.');
console.log('Advanced unlock passed: silent taps, password gate, countdown, timeout, re-lock, reload and translations.');
const experiment=source.slice(source.indexOf('    async startExperiment(activity)'),source.indexOf('    stopExperiment()'));
const controller=vm.runInNewContext('({'+experiment+'})',{state:{advancedFeaturesUnlocked:false}});
for(const activity of ['perineal','bath','assisted-bath']) await controller.startExperiment(activity);
assert.equal(controller.isStarting,undefined,'Locked care cannot start even through a direct call');
console.log('Experiment care follows shared unlock, re-lock and execution guard.');
const shot=source.slice(source.indexOf('    async runShot('),source.indexOf('    finishShot()'));
const lockedShot=vm.runInNewContext('({'+shot+'})',{state:{advancedFeaturesUnlocked:false}});
await lockedShot.runShot('meditation');
assert.equal(lockedShot.isShotActive,undefined,'Locked direct Shot call does not activate audio');
assert.match(html, /id="shots-control"[^>]* hidden/);
assert.match(html, /id="sound-healing-title"[^>]* hidden/);
assert.match(html, /id="sleep-mode-control"[^>]* hidden/);
assert.match(source, /getChecked\('sleep-mode-toggle'\) && !state\.advancedFeaturesUnlocked/, 'Locked direct Sleep start must be rejected');
assert.match(html, /id="yoga-mode-control"[^>]* hidden[\s\S]*?id="yoga-experience-toggle" disabled/, 'Yoga Experience must begin hidden and disabled');
assert.match(source, /yogaExperienceToggle\?\.addEventListener\('change',[\s\S]*?!state\.advancedFeaturesUnlocked[\s\S]*?yogaExperienceToggle\.checked = false/, 'Locked direct Yoga selection must be rejected');
assert.match(source, /getChecked\('yoga-experience-toggle'\) && !state\.advancedFeaturesUnlocked/, 'Locked direct Yoga start must be rejected');
const sleepJourney=source.slice(source.indexOf('    async runSleepJourney()'),source.indexOf('    async runShot('));
const lockedSleep=vm.runInNewContext('({'+sleepJourney+'})',{state:{advancedFeaturesUnlocked:false}});
await lockedSleep.runSleepJourney();
assert.equal(lockedSleep.isStarting,undefined,'Locked direct Sleep journey cannot start');
console.log('Shots shares visibility, reset and direct execution guard.');
const noFrequency=setup(true);
for(let i=0;i<6;i++) noFrequency.tap();
await noFrequency.tap();
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
