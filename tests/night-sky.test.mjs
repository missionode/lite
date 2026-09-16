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
const sandbox = vm.createContext({document:{body:{classList:{contains:()=>false}},createElement(){const ctx=context();return {getContext:()=>ctx};}}});
vm.runInContext(readFileSync('night-sky.js','utf8')+'\nglobalThis.sky = new NaturalNightSky();',sandbox);
const sky=sandbox.sky;
sky.resize(1440,900,1.5);
const first=JSON.stringify(sky.stars);
assert.ok(sky.stars.length>=700 && sky.stars.length<=2400);
assert.ok(sky.twinklingStars.length>0 && sky.twinklingStars.length<=110);
sky.resize(1440,900,1.5);
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
sky.resize(390,844,1.5);
assert.ok(sky.stars.length>=700 && sky.stars.length<=2400);
assert.ok(sky.stars.every(s=>Number.isFinite(s.x) && Number.isFinite(s.y)));
console.log('Natural sky behavior passed: deterministic field, bounded draw work, stationary stars and reduced motion.');

// Exercise the actual lunar renderer without a browser. Its pixel buffer is
// inspectable: a new Moon must paint nothing and quarter phases swap sides.
const app=readFileSync('app.js','utf8');
assert.match(app, /const namedStars = \[[\s\S]*?\['Sirius',[\s\S]*?-1\.44[\s\S]*?\['Canopus',[\s\S]*?\['Capella',[\s\S]*?\['Rigel',[\s\S]*?\['Procyon',[\s\S]*?\['Achernar',[\s\S]*?\['Aldebaran',[\s\S]*?\['Spica',[\s\S]*?\['Antares'/,
    'The named catalogue must retain Sirius at its negative apparent magnitude and cover the principal bright naked-eye stars.');
for (const localeName of ['en', 'ml', 'hi', 'ru']) {
    const locale = JSON.parse(readFileSync(`locales/${localeName}.json`, 'utf8'));
    for (const name of ['Sirius', 'Canopus', 'Capella', 'Rigel', 'Procyon', 'Achernar', 'Aldebaran', 'Spica', 'Antares']) {
        assert.ok(locale.ui[`celestial${name}`], `${localeName} must localize ${name}`);
    }
}
const astronomy = vm.createContext({ Date, Math });
vm.runInContext(app.slice(app.indexOf('const CELESTIAL_DEG'), app.indexOf('// Pleasure ambience')), astronomy);
const indianObserver = { latitude: 9.9312, longitude: 76.2673 };
const sunAltitudeAt = iso => {
    const date = new Date(iso);
    const days = astronomy.celestialJulianDay(date) - 2451543.5;
    const sun = astronomy.celestialSunEquatorial(days, date);
    return astronomy.celestialHorizontal(sun.ra, sun.dec, indianObserver.latitude, indianObserver.longitude, date).altitude;
};
assert.ok(sunAltitudeAt('2026-09-14T12:00:00+05:30') > -6, 'Indian midday must be outside the night-only celestial window');
assert.ok(sunAltitudeAt('2026-09-14T23:00:00+05:30') <= -6, 'Indian night must be inside the civil-twilight celestial window');
assert.match(app, /celestialSunEquatorial\(days, date\)[\s\S]*?observer\.approximate \|\| sunAltitude <= -6[\s\S]*?name: 'Sun', kind: 'sun'[\s\S]*?DAYLIGHT_SOLAR_SYSTEM\.map[\s\S]*?this\.celestialDaylight = false/,
    'Granted-location skies should replace the night bodies with a calculated Sun plus an explicitly thematic full solar-system tableau before civil twilight without turning Equator fallback coordinates into false daylight');
assert.match(app, /DAYLIGHT_SOLAR_SYSTEM[\s\S]*?Mercury[\s\S]*?Venus[\s\S]*?Earth[\s\S]*?Mars[\s\S]*?Jupiter[\s\S]*?Saturn[\s\S]*?Uranus[\s\S]*?Neptune[\s\S]*?if \(this\.celestialDaylight\)[\s\S]*?rgba\(35, 48, 124, 0\.34\)[\s\S]*?body\.kind === 'solar-planet'[\s\S]*?255, 250, 230/,
    'Daylight should retain a cached indigo cosmic wash, a gentle warm Sun, and all eight themed planets rather than switching to an ordinary daytime background');
assert.match(app, /body\.kind === 'sun'\) \{[\s\S]*?drawSolarProtectionLayer\(x, y, size\)[\s\S]*?drawSolarProtectionLayer\(x, y, size\) \{[\s\S]*?size \* 4\.2[\s\S]*?createRadialGradient[\s\S]*?fillRect\(/,
    'The daytime Sun should receive one cached, diffuse containment glow rather than a separate hard ring.');
assert.match(app, /\['Earth', 'earth', \[114, 190, 221\], 1, 5\.1, 14\][\s\S]*?drawEarthAtmosphericLayers\(x, y, size\)[\s\S]*?const layers = \[[\s\S]*?\[1\.28, '101, 213, 255', 0\.28\][\s\S]*?\[4\.00, '211, 225, 255', 0\.075\][\s\S]*?createRadialGradient\(x, y, innerRadius, x, y, radius \* 1\.08\)[\s\S]*?fillRect\(/,
    'The thematic Earth should show five overlapping translucent gradient shells that dissolve outward without extra layer labels.');
assert.doesNotMatch(app, /atmosphereTroposphere|27°C/, 'Only Earth should be named in the compact solar-system tableau.');
assert.match(app, /drawCelestialHorizon\(width, height\);[\s\S]*?body\.altitude < 4[\s\S]*?drawCelestialHorizon\(width, height\) \{[\s\S]*?const horizonY = height \* 0\.88[\s\S]*?quadraticCurveTo/,
    'The celestial view should include a cached curved horizon matching the altitude projection baseline.');
assert.match(app, /deepSkyBlackHoleEnabled && this\.celestialNightVisible && !document\.body\.classList\.contains\('static-decorations'\)[\s\S]*?drawDeepSkyBlackHole[\s\S]*?setDeepSkyBlackHoleEnabled/,
    'The Advanced Features black-hole illustration must stay night-only, off static journey screens and invalidate the cached celestial layer when its shared lock changes.');
for (const [language, earth, sun] of [['en', 'Earth', 'Sun'], ['ml', 'ഭൂമി', 'സൂര്യൻ'], ['hi', 'पृथ्वी', 'सूर्य'], ['ru', 'Земля', 'Солнце']]) {
    const locale = JSON.parse(readFileSync(`locales/${language}.json`, 'utf8'));
    assert.equal(locale.ui.celestialEarth, earth, `${language} must localize the Earth label`);
    assert.equal(locale.ui.celestialSun, sun, `${language} must localize the Sun label`);
    for (const planet of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']) {
        assert.ok(locale.ui[`celestial${planet}`], `${language} must localize ${planet}`);
    }
}
vm.runInContext(app.slice(app.indexOf('class AmbientParticleField {'),app.indexOf('// Visual Engine'))+
    '\nglobalThis.field = Object.create(AmbientParticleField.prototype);',sandbox);
const field=sandbox.field;
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
sandbox.state = {language:'en'};
field.canvas = {width:1200,height:800};
field.celestialLayer = {getContext:()=>({setTransform(){}})};
field.celestialBodies = [];
let celestialBuilds = 0;
field.drawCelestialBodies = () => {celestialBuilds++;};
field.drawCachedCelestialBodies(800,533);
for (let i=0;i<100;i++) field.drawCachedCelestialBodies(800,533);
assert.equal(celestialBuilds,1,'100 unchanged frames reuse the cached celestial layer');
sandbox.state.language='ml'; field.drawCachedCelestialBodies(800,533);
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
