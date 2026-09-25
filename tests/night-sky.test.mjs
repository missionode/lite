import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const context = () => ({
    draws: [], globalAlpha: 1,
    createRadialGradient: () => ({addColorStop(){}}),
    fillRect(){}, clearRect(){}, setTransform(){}, putImageData(){},
    createImageData: (w,h) => ({data:new Uint8ClampedArray(w*h*4)}),
    drawImage(...args){this.draws.push({args,alpha:this.globalAlpha});}
});
const sandbox = vm.createContext({Date, document:{body:{classList:{contains:()=>false}},createElement(){const ctx=context();return {getContext:()=>ctx};}}});
for (const file of ['vendor/astronomy.browser.min.js', 'data/sky-stars.js', 'sky-astronomy.js']) {
    vm.runInContext(readFileSync(file, 'utf8'), sandbox);
}
const positions = vm.runInContext("SkyAstronomy.snapshot(new Date('2026-09-17T18:30:00Z'), {latitude:9.93, longitude:76.27})", sandbox);
vm.runInContext(readFileSync('night-sky.js','utf8')+'\nglobalThis.sky = new NaturalNightSky();',sandbox);
const sky=sandbox.sky;
sky.resize(1440,900,1.5,positions.stars,positions.sunAltitude);
const first=JSON.stringify(sky.stars);
assert.equal(sky.stars.length,positions.stars.filter(s=>s.altitude>=0&&!s.name).length,'Only above-horizon catalogue stars are drawn');
assert.ok(sky.twinklingStars.length>0 && sky.twinklingStars.length<=110);
sky.resize(1440,900,1.5,positions.stars,positions.sunAltitude);
assert.equal(JSON.stringify(sky.stars),first,'Resizing to the same viewport must not shuffle the sky');
const motionBefore=JSON.stringify(sky.stars.map(s=>[s.x,s.y]));
const ctx=context();
sky.draw(ctx,1000,true);
const firstAlpha=ctx.draws.slice(1).map(d=>d.alpha);
assert.equal(ctx.draws.length,sky.twinklingStars.length+1,'One cached field and only the bright subset are redrawn');
ctx.draws=[];
sky.draw(ctx,3700,true);
assert.notDeepEqual(ctx.draws.slice(1).map(d=>d.alpha),firstAlpha,'Bright stars scintillate independently over time');
assert.equal(JSON.stringify(sky.stars.map(s=>[s.x,s.y])),motionBefore,'Stars must not drift like floating particles');
for(const draw of ctx.draws)assert.ok(draw.alpha>=0 && draw.alpha<=1);
ctx.draws=[];
sky.draw(ctx,1000,false);
const staticFrame=JSON.stringify(ctx.draws.map(d=>({alpha:d.alpha,args:d.args.slice(1)})));
ctx.draws=[];
sky.draw(ctx,3700,false);
assert.equal(JSON.stringify(ctx.draws.map(d=>({alpha:d.alpha,args:d.args.slice(1)}))),staticFrame,'Reduced-motion output is time invariant');
sky.resize(390,844,1.5,positions.stars,positions.sunAltitude);
assert.equal(sky.stars.length,positions.stars.filter(s=>s.altitude>=0&&!s.name).length,'Mobile uses the same real stars, not a different generated field');
assert.ok(sky.stars.every(s=>Number.isFinite(s.x) && Number.isFinite(s.y)));
console.log('Natural sky behavior passed: deterministic field, bounded draw work, stationary stars and reduced motion.');

// Exercise the actual lunar renderer without a browser. Its pixel buffer is
// inspectable: a new Moon must paint nothing and quarter phases swap sides.
const app=readFileSync('app.js','utf8');
const particleFieldModule=readFileSync('modules/ambient-particle-field.js','utf8');
const html=readFileSync('index.html','utf8');
const serviceWorker=readFileSync('sw.js','utf8');
assert.ok(html.indexOf('night-sky.js?v=1.1') < html.indexOf('modules/ambient-particle-field.js?v=1.0'));
assert.ok(html.indexOf('modules/ambient-particle-field.js?v=1.0') < html.indexOf('app.js?v=3.98'));
assert.match(serviceWorker,/chakra-v5\.294[\s\S]*?modules\/ambient-particle-field\.js\?v=1\.0/,
    'The sky module must remain available from the exact offline shell cache.');
for (const localeName of ['en', 'ml', 'hi', 'ru']) {
    const locale = JSON.parse(readFileSync(`locales/${localeName}.json`, 'utf8'));
    for (const name of ['Sirius', 'Canopus', 'Capella', 'Rigel', 'Procyon', 'Achernar', 'Aldebaran', 'Spica', 'Antares']) {
        assert.ok(locale.ui[`celestial${name}`], `${localeName} must localize ${name}`);
    }
}
assert.match(particleFieldModule, /deepSkyBlackHoleEnabled && !document\.body\.classList\.contains\('static-decorations'\)[\s\S]*?drawDeepSkyBlackHole[\s\S]*?setDeepSkyBlackHoleEnabled/,
    'The Advanced Features black-hole illustration must be visible on either Lobby/Settings sky, stay off static journey screens and invalidate the cached celestial layer when its shared lock changes.');
for (const [language, earth, sun] of [['en', 'Earth', 'Sun'], ['ml', 'ഭൂമി', 'സൂര്യൻ'], ['hi', 'पृथ्वी', 'सूर्य'], ['ru', 'Земля', 'Солнце']]) {
    const locale = JSON.parse(readFileSync(`locales/${language}.json`, 'utf8'));
    assert.equal(locale.ui.celestialEarth, earth, `${language} must localize the Earth label`);
    assert.equal(locale.ui.celestialSun, sun, `${language} must localize the Sun label`);
    for (const planet of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']) {
        assert.ok(locale.ui[`celestial${planet}`], `${language} must localize ${planet}`);
    }
}
sandbox.window=sandbox;
sandbox.state={displayLanguage:'en'};
sandbox.t=key=>key;
sandbox.CELESTIAL_LABEL_KEYS={Earth:'ui.celestialEarth'};
vm.runInContext(particleFieldModule+'\nglobalThis.field = Object.create(AmbientParticleField.prototype);',sandbox);
const field=sandbox.field;
const frozen=Object.create(Object.getPrototypeOf(field));
frozen.observer={latitude:0,longitude:0};frozen.skySnapshot=positions;
sandbox.document.body.classList.contains=()=>true;
frozen.refreshCelestialBodies(new Date('2030-01-01'));
assert.equal(frozen.skySnapshot,positions,'A journey redraw must not recalculate its sky snapshot');
sandbox.document.body.classList.contains=()=>false;
// Retained visual contract: five visible merged atmosphere volumes and a
// distinct feathered Sun shield. These tests catch removal/fading regressions.
const gradients=[];
field.ctx={save(){},restore(){},fillRect(){},createRadialGradient(...args){
    const gradient={args,stops:[],addColorStop(at,color){this.stops.push([at,color]);}};
    gradients.push(gradient);return gradient;
}};
field.drawEarthAtmosphericLayers(50,50,10);
assert.equal(gradients.length,5,'Keep all five owner-required atmosphere layers');
assert.ok(gradients[0].args[5]>=15,'Inner atmosphere must extend visibly beyond the disc');
assert.equal(gradients[0].stops[0][1],'rgba(112, 232, 244, 0.9)','Preserve the bright cool-aqua 26°C visual theme');
for(const layer of gradients){
    assert.equal(layer.stops.at(-1)[0],1);
    assert.match(layer.stops.at(-1)[1],/, 0\)$/,'Each layer dissolves outward');
}
gradients.length=0;
field.drawSolarProtectionLayer(50,50,10);
assert.equal(gradients.length,2,'Keep both diffuse solar glow and protective ring');
assert.ok(gradients[1].stops.some(([at,color])=>at>0&&at<1&&color.endsWith(', 0.24)')),'Sun shield must retain a visible soft rim');
for(const [width,height] of [[1440,900],[390,844],[844,390]]){
    const earth=field.earthReferenceLayout(width,height);
    assert.ok(earth);
    assert.equal(earth.x,width/2,'Earth stays on the center observer axis');
    assert.ok(earth.bounds.top>height*.88&&earth.bounds.bottom<height);
    const mantra={left:0,right:width,top:height-48,bottom:height};
    const withText=field.earthReferenceLayout(width,height,[mantra]);
    assert.deepEqual(withText,earth,'Foreground movement must not move, resize or hide Earth');
    assert.deepEqual(field.earthReferenceLayout(width,height,[{left:0,right:width,top:height*.88,bottom:height}]),earth,'Earth remains visible even when foreground content crosses its area');
}
const scrollStableField=Object.create(Object.getPrototypeOf(field));
const beforeScroll=scrollStableField.earthReferenceLayout(390,844);
const afterScroll=scrollStableField.earthReferenceLayout(390,844,[{left:0,right:390,top:740,bottom:844}]);
assert.deepEqual(afterScroll,beforeScroll,'Scrolling must keep Earth at the same size and position');
let guideDrawn=false;
field.earthReferencePlacement={x:195,y:796,size:10};
field.ctx={save(){},restore(){},setLineDash(){},beginPath(){},moveTo(){},quadraticCurveTo(){},stroke(){guideDrawn=true;}};
field.drawEarthMoonGuide(260,500,390,844);
assert.ok(guideDrawn,'An above-horizon Moon should receive a subtle observer guide from Earth');
assert.equal(field.moonObserverPlacement.earthX,195);
assert.equal(field.moonObserverPlacement.earthY,785.5);
assert.equal(field.moonObserverPlacement.moonX,260);
assert.equal(field.moonObserverPlacement.moonY,500);
const occupied=[];
for(let i=0;i<9;i++){
    const box=field.placeCelestialLabel(190,620,2,75,390,844,occupied);
    assert.ok(box.left>=0&&box.left+box.width<=390&&box.top+box.height<844*.88);
    for(const other of occupied.slice(0,-1)){
        assert.ok(box.left>=other.left+other.width||box.left+box.width<=other.left||
            box.top>=other.top+other.height||box.top+box.height<=other.top,'Crowded mobile labels must separate without changing sky coordinates');
    }
}
sandbox.performance={now:()=>500};
sandbox.document.getElementById=()=>null;
const failed=Object.create(Object.getPrototypeOf(field));
failed.observer={latitude:0,longitude:0}; failed.sky=sky;
failed.refreshCelestialBodies(new Date(NaN));
assert.equal(failed.lastCelestialRefresh,500,'Failures are throttled, not retried every frame');
assert.equal(failed.skyFailed,true);
assert.equal(failed.celestialBodies.length,0);
assert.equal(sky.stars.length,0,'Failure must not leave old positions on display');
console.log('Sky failure cleanup and crowded mobile-label placement passed.');
let moonPixels, builds=0;
field.sky=sky;
field.moonBuffer={width:128,height:128};
field.cachedMoonPhase=null;
field.moonBufferContext={
    createImageData(w,h){builds++;return {data:new Uint8ClampedArray(w*h*4)};},
    putImageData(pixels){moonPixels=pixels.data;}
};
field.ctx={save(){},restore(){},drawImage(){}};
const lunar=[];
for(const phase of [0,0.25,0.5,0.75]){
    field.drawMoonWithBooleanMask(0,0,14,phase);
    let lit=0,left=0,right=0;
    for(let i=3;i<moonPixels.length;i+=4){if(moonPixels[i]>100){lit++;if(((i-3)/4)%128<64)left++;else right++;}}
    lunar.push({lit,left,right});
}
assert.equal(lunar[0].lit,0,'New Moon must not leave an opaque overlay');
assert.ok(lunar[1].lit>lunar[2].lit*0.4 && lunar[1].lit<lunar[2].lit*0.6,'Quarter Moon must illuminate about half the disc');
assert.ok(lunar[1].right>lunar[1].left && lunar[3].left>lunar[3].right,'Waxing and waning quarters must illuminate opposite sides');
const beforeCache=builds;
field.drawMoonWithBooleanMask(0,0,14,0.75);
assert.equal(builds,beforeCache,'Same lunar phase must reuse cached pixels');
console.log('Lunar rendering passed: transparent new Moon, opposed quarters, phase coverage and texture caching.');

// Stable celestial layers must not repeat font/blur/gradient work per frame.
sandbox.state = {displayLanguage:'en'};
field.canvas = {width:1200,height:800};
field.celestialLayer = {getContext:()=>({setTransform(){}})};
field.celestialBodies = [];
let celestialBuilds = 0;
field.drawCelestialBodies = () => {celestialBuilds++;};
field.drawCachedCelestialBodies(800,533);
for (let i=0;i<100;i++) field.drawCachedCelestialBodies(800,533);
assert.equal(celestialBuilds,1,'100 unchanged frames reuse the cached celestial layer');
sandbox.state.displayLanguage='ml'; field.drawCachedCelestialBodies(800,533);
assert.equal(celestialBuilds,2,'Language changes invalidate translated labels');
field.celestialBodies=[]; field.drawCachedCelestialBodies(800,533);
assert.equal(celestialBuilds,3,'Updated positions invalidate the layer');
field.canvas.width=1000; field.drawCachedCelestialBodies(667,533);
assert.equal(celestialBuilds,4,'Resizing invalidates the layer');

const scheduled = new Map(), frames = new Map(); let id=0;
sandbox.setTimeout=fn=>{scheduled.set(++id,fn);return id;};
sandbox.clearTimeout=key=>scheduled.delete(key);
sandbox.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};
sandbox.cancelAnimationFrame=key=>frames.delete(key);
field.motionPreference={matches:false}; field.draw=()=>{};
field.render(100);
assert.equal(frames.size,0,'Sky sleeps rather than polling every display refresh');
assert.equal(scheduled.size,1);
sandbox.document.hidden=true; field.handleVisibility();
assert.equal(scheduled.size,0,'Hiding cancels pending sky work');
assert.equal(frames.size,0);
sandbox.document.hidden=false; field.handleVisibility();
assert.equal(frames.size,1,'Returning starts exactly one frame loop');
field.handleVisibility(); assert.equal(frames.size,1);
field.motionPreference.matches=true; sandbox.performance={now:()=>200};
field.handleMotionChange();
assert.equal(frames.size,0,'Reduced motion cancels the resumed frame');
console.log('Sky cache and scheduling passed: invalidation, idle waiting, hide/resume and reduced motion.');
field.motionPreference.matches=false;
sandbox.document.body.classList.contains=()=>true;
field.handleMotionChange(); field.render(250);
assert.equal(frames.size,0); assert.equal(scheduled.size,0,'Static screens schedule no sky work');
sandbox.document.hidden=true; field.handleVisibility();
sandbox.document.hidden=false; field.handleVisibility();
assert.equal(frames.size,0,'Returning to a static screen does not restart motion');
sandbox.document.body.classList.contains=()=>false;
field.handleMotionChange(); assert.equal(frames.size,1,'Lobby/Settings restore animation');
field.motionPreference.matches=true; field.handleMotionChange();

let spriteBuilds=0,meteorDraws=0;
sandbox.document.createElement=()=>{spriteBuilds++;return {getContext:()=>({
    createLinearGradient:()=>({addColorStop(){}}),beginPath(){},moveTo(){},lineTo(){},stroke(){}
})};};
field.ctx={save(){},restore(){},translate(){},rotate(){},drawImage(){meteorDraws++;}};
field.meteors=[];field.nextMeteorAt=0;
const sameArray=field.meteors;
field.drawMeteors(0,390,844);
assert.ok(field.nextMeteorAt>=5 && field.nextMeteorAt<=9);
assert.equal(spriteBuilds,0,'Idle sky does not build a meteor sprite');
assert.equal(meteorDraws,0);
const spawnAt=field.nextMeteorAt;
field.drawMeteors(spawnAt,390,844);
assert.equal(field.meteors.length,1);
assert.ok(field.nextMeteorAt-spawnAt>=25 && field.nextMeteorAt-spawnAt<=70);
assert.ok(field.meteors[0].length<=390*.24);
field.drawMeteors(spawnAt+.2,390,844);
assert.equal(spriteBuilds,1,'Active frames reuse a single small sprite');
assert.ok(field.ctx.globalAlpha>0 && field.ctx.globalAlpha<=.75);
field.drawMeteors(spawnAt+field.meteors[0].lifetime+.19,390,844);
assert.equal(field.meteors.length,0,'Residual trail expires and releases the meteor');
assert.equal(field.meteors,sameArray,'No per-frame filtered array allocation');
console.log('Meteor pacing, single-event bound, sprite reuse and trail expiry passed.');
