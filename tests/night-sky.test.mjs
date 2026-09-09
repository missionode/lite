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
const sandbox = vm.createContext({document:{createElement(){const ctx=context();return {getContext:()=>ctx};}}});
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
