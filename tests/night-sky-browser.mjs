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
await page.goto('http://sky-preview.local/');
await page.waitForFunction(()=>document.getElementById('splash-screen').classList.contains('hidden'));
await page.screenshot({path:'/private/tmp/natural-sky-lobby.png'});
const metrics=await page.evaluate(()=>{
    const start=performance.now();for(let i=0;i<120;i++)particleField.draw(i*34,true);
    const frameMs=(performance.now()-start)/120;
    const stars=particleField.sky.stars.length;
    const animated=particleField.sky.twinklingStars.length;
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
    return {stars,animated,frameMs,samples};
});
assert.equal(metrics.samples[0].lit,0);
assert.ok(metrics.samples[1].lit>metrics.samples[2].lit*0.4 && metrics.samples[1].lit<metrics.samples[2].lit*0.6);
assert.ok(metrics.samples[1].right>metrics.samples[1].left);
assert.ok(metrics.samples[3].left>metrics.samples[3].right);
const skyOnly=await page.addStyleTag({content:'#app,#aura-bg{visibility:hidden!important}'});
await page.screenshot({path:'/private/tmp/natural-sky-field.png'});
await skyOnly.evaluate(el=>el.remove());
await page.emulateMedia({reducedMotion:'reduce'});
await page.waitForFunction(()=>particleField.frame===0);
const before=await page.evaluate(()=>particleField.canvas.toDataURL());
await page.waitForTimeout(150);
assert.equal(await page.evaluate(()=>particleField.canvas.toDataURL()),before);
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'/private/tmp/natural-sky-mobile.png'});
assert.equal(await page.evaluate(()=>particleField.sky.width),390);
await page.emulateMedia({reducedMotion:'no-preference'});
await page.waitForFunction(()=>particleField.frame>0);
assert.deepEqual(errors,[]);
console.log(JSON.stringify({...metrics,reducedMotion:true,mobileResize:true,pageErrors:errors}));
await browser.close();
