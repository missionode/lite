import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,serviceWorkers:'block',geolocation:{latitude:9.93,longitude:76.27},permissions:['geolocation']});
await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.hostname!=='sky-preview.local')return route.abort();
    const target=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!target.startsWith(root+path.sep))return route.abort();
    try {
        const body=await readFile(target);
        const ext=path.extname(target);
        const type={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg','.mp4':'video/mp4'}[ext]||'application/octet-stream';
        await route.fulfill({status:200,contentType:type,body});
    }catch{return route.fulfill({status:404,body:'Not found'});}
});
await context.addInitScript(()=>{localStorage.setItem('chakra_configured','true');localStorage.setItem('chakra_display_language','en');});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.clock.setFixedTime(new Date('2026-09-17T18:30:00Z'));
await page.goto('https://sky-preview.local/');
await page.waitForFunction(()=>document.getElementById('splash-screen').classList.contains('hidden'));
await page.waitForFunction(()=>particleField.observer?.approximate===false);
await page.screenshot({path:'/private/tmp/natural-sky-lobby.png'});
const metrics=await page.evaluate(()=>{
    const start=performance.now();for(let i=0;i<120;i++)particleField.draw(i*34,true);
    const frameMs=(performance.now()-start)/120;
    const stars=particleField.sky.stars.length;
    const animated=particleField.sky.twinklingStars.length;
    const calculationStart=performance.now();
    for(let i=0;i<10;i++)SkyAstronomy.snapshot(new Date(), particleField.observer);
    const calculationMs=(performance.now()-calculationStart)/10;
    // Inspect Moon alpha directly: new Moon is transparent, quarter Moon is
    // approximately half a full Moon, and the phase mask changes sides.
    const samples=[];
    for(const phase of [0,0.25,0.5,0.75]){
        particleField.drawMoonWithBooleanMask(200,200,30,phase);
        const pixels=particleField.moonBufferContext.getImageData(0,0,128,128).data;
        let lit=0,left=0,right=0;
        for(let i=3;i<pixels.length;i+=4){if(pixels[i]>100){lit++;if(((i-3)/4)%128<64)left++;else right++;}}
        samples.push({phase,lit,left,right});
    }
    particleField.cachedMoonPhase=null;
    const atmospherePixels=[];
    const originalContext=particleField.ctx;
    try {
        const canvas=document.createElement('canvas');canvas.width=canvas.height=96;
        const ctx=canvas.getContext('2d');particleField.ctx=ctx;
        for(const size of [4,10]){
            ctx.clearRect(0,0,96,96);
            particleField.drawEarthAtmosphericLayers(48,48,size);
            const inner=Array.from(ctx.getImageData(Math.round(48+size*1.25),48,1,1).data);
            const outer=Array.from(ctx.getImageData(Math.round(48+size*2.1),48,1,1).data);
            atmospherePixels.push({size,inner,outer});
        }
    } finally { particleField.ctx=originalContext; }
    return {stars,animated,frameMs,calculationMs,samples,atmospherePixels};
});
for(const sample of metrics.atmospherePixels){
    assert.ok(sample.inner[3]>=120,'Atmosphere must remain visible outside even a tiny Earth disc');
    assert.ok(sample.inner[1]>sample.inner[0]&&sample.inner[2]>sample.inner[0],'Inner atmosphere retains cool aqua color');
    assert.ok(sample.outer[3]>8,'Outer atmosphere must remain present while dissolving');
}
assert.equal(metrics.samples[0].lit,0);
assert.ok(metrics.samples[1].lit>metrics.samples[2].lit*0.4 && metrics.samples[1].lit<metrics.samples[2].lit*0.6);
assert.ok(metrics.samples[1].right>metrics.samples[1].left);
assert.ok(metrics.samples[3].left>metrics.samples[3].right);
const skyOnly=await page.addStyleTag({content:'#app,#aura-bg{visibility:hidden!important}'});
await page.evaluate(()=>particleField.invalidateSkyLayout());
await page.waitForFunction(()=>particleField.layoutFrame===0);
const centeredEarth=await page.evaluate(()=>particleField.earthReferencePlacement);
assert.equal(centeredEarth.x,720);
assert.ok(centeredEarth.bounds.top>900*.88);
await page.screenshot({path:'/private/tmp/natural-sky-field.png'});
const protectiveLayers=await page.evaluate(()=>{
    const sun=particleField.drawSolarProtectionLayer,earth=particleField.drawEarthAtmosphericLayers;
    let sunDraws=0,earthDraws=0;
    particleField.drawSolarProtectionLayer=function(...args){sunDraws++;return sun.apply(this,args);};
    particleField.drawEarthAtmosphericLayers=function(...args){earthDraws++;return earth.apply(this,args);};
    particleField.observer={latitude:51.4773207,longitude:0,height:67.0693,approximate:true};
    try {
        particleField.refreshCelestialBodies(new Date('2000-01-01T12:00:00Z'));
        particleField.draw(performance.now(),false);
    } finally {particleField.drawSolarProtectionLayer=sun;particleField.drawEarthAtmosphericLayers=earth;}
    return {sunDraws,earthDraws};
});
assert.ok(protectiveLayers.sunDraws>0&&protectiveLayers.earthDraws>0,'Both protective effects must remain connected to the rendered sky');
assert.equal(await page.evaluate(()=>particleField.celestialBodies.filter(b=>['Sun','Moon'].includes(b.name)&&b.altitude>=0).length),2,'Moon remains present during daylight');
assert.match(await page.locator('#sky-location-status').textContent(),/Greenwich/);
await page.screenshot({path:'/private/tmp/natural-sky-daylight.png'});
await skyOnly.evaluate(el=>el.remove());
await page.emulateMedia({reducedMotion:'reduce'});
// Wait for the media-query change handler itself to settle. A frame id of zero
// alone can occur in the brief gap between animation frames.
await page.waitForFunction(()=>particleField.motionPreference.matches&&particleField.frame===0&&particleField.renderTimer===null);
const before=await page.evaluate(()=>particleField.canvas.toDataURL());
await page.waitForTimeout(150);
assert.equal(await page.evaluate(()=>particleField.canvas.toDataURL()),before);
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'/private/tmp/natural-sky-mobile.png'});
assert.equal(await page.evaluate(()=>particleField.sky.width),390);
const locales={};
for(const lang of ['en','ml','hi','ru']){
    locales[lang]=await page.evaluate(async lang=>{
        state.displayLanguage=lang; applyLocaleUI();
        return {status:document.getElementById('sky-location-status').textContent,note:document.querySelector('[data-i18n="ui.skyChartNote"]').textContent};
    },lang);
    assert.ok(locales[lang].status.length>20&&!locales[lang].status.startsWith('ui.'));
    assert.ok(locales[lang].note.length>20&&!locales[lang].note.startsWith('ui.'));
}
await page.evaluate(()=>{
    showScreen(meditationScreen);
    document.getElementById('mantra-display').textContent='ഓം';
});
await page.waitForFunction(()=>particleField.layoutFrame===0);
const journeyEarth=await page.evaluate(()=>({earth:particleField.earthReferencePlacement,
    mantra:document.getElementById('mantra-display').getBoundingClientRect().toJSON()}));
assert.ok(journeyEarth.earth,'Portrait journey retains a small center reference');
assert.equal(journeyEarth.earth.x,195);
assert.ok(journeyEarth.earth.bounds.bottom<=journeyEarth.mantra.top-5);
await page.screenshot({path:'/private/tmp/natural-sky-journey.png'});
await page.evaluate(()=>{
    document.getElementById('controls').classList.remove('hidden');
});
await page.waitForFunction(()=>journeyVideoPrelude.journeyChromeActive);
const revealZone=await page.locator('#fullscreen-controls-reveal-zone').boundingBox();
// Revealing controls intentionally covers the hot zone; move the pointer
// once instead of retrying hover actionability against that covered element.
await page.mouse.move(revealZone.x+revealZone.width/2,revealZone.y+revealZone.height/2);
await page.waitForFunction(()=>document.body.classList.contains('fullscreen-controls-visible')&&particleField.layoutFrame===0&&getComputedStyle(document.getElementById('controls')).opacity==='1');
const controlClearance=await page.evaluate(()=>({earth:particleField.earthReferencePlacement,
    controls:document.getElementById('controls').getBoundingClientRect().toJSON(),
    controlStyle: ['display','visibility','opacity','transform'].map(k=>[k,getComputedStyle(document.getElementById('controls'))[k]]),
    layoutFrame:particleField.layoutFrame, classes:document.body.className}));
if(controlClearance.earth)assert.ok(controlClearance.earth.bounds.bottom<=controlClearance.controls.top-5,JSON.stringify(controlClearance));
await page.evaluate(()=>{
    document.body.classList.remove('journey-controls-active','fullscreen-controls-visible');
    document.getElementById('controls').classList.add('hidden');
    showScreen(lobbyScreen);
});
await page.emulateMedia({reducedMotion:'no-preference'});
await page.waitForFunction(()=>particleField.frame>0);
assert.deepEqual(errors,[]);
console.log(JSON.stringify({...metrics,reducedMotion:true,mobileResize:true,earthCenterAndTextClearance:true,localizedSkyStatus:Object.keys(locales),pageErrors:errors}));
await browser.close();
