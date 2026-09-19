import { chromium } from 'playwright';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { graphs } from './atlas-data.mjs';

const browser = await chromium.launch({headless:true});
const screenshotDirectory = await mkdtemp(join(tmpdir(), 'akhil-atlas-'));
try {
const templatePage = await browser.newPage({viewport:{width:900,height:700}});
const templateErrors=[];
templatePage.on('pageerror',e=>templateErrors.push(e.message));
await templatePage.goto(new URL('./atlas-template.html',import.meta.url).href);
assert.equal(await templatePage.locator('#title').innerText(),'Open the generated flow atlas');
assert.equal(await templatePage.locator('#node-routes a').getAttribute('href'),'./index.html');
assert.deepEqual(templateErrors,[]);
await templatePage.close();
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(new URL('./index.html',import.meta.url).href);
await page.waitForFunction(count=>window.atlasQA?.graphs.length===count, graphs.length);
const results=await page.evaluate(()=>{
 const output=[];
 for(const graph of window.atlasQA.graphs){
  window.atlasQA.navigate(graph.id);
  const nodes=[...document.querySelectorAll('#graph .node')];
  if(nodes.length!==graph.rows.flat().length)throw new Error('Node count: '+graph.id);
  if(document.querySelectorAll('#graph .edge').length!==graph.edges.length)throw new Error('Edge count: '+graph.id);
  if(document.querySelectorAll('#connection-rows tr').length!==graph.edges.length)throw new Error('Table count: '+graph.id);
  for(const node of graph.rows.flat()){
   window.atlasQA.selectNode(node[0]);
   if(document.getElementById('node-title').textContent!==node[1])throw new Error('Selection: '+graph.id+'/'+node[0]);
  }
  for(const el of document.querySelectorAll('#graph .node')){
   const rect=el.querySelector('rect').getBBox();
   for(const text of el.querySelectorAll('text')){
    const b=text.getBBox();if(b.x<rect.x||b.x+b.width>rect.x+rect.width||b.y+b.height>rect.y+rect.height)throw new Error('Clipped label: '+graph.id+'/'+text.textContent);
   }
  }
  output.push(graph.id);
 }
 return output;
});
await page.evaluate(()=>window.atlasQA.navigate('overview'));
await page.screenshot({path:join(screenshotDirectory,'overview.png'),fullPage:true});
await page.evaluate(()=>window.atlasQA.navigate('standard'));
await page.screenshot({path:join(screenshotDirectory,'standard.png'),fullPage:true});
await page.locator('#graph .node').first().focus();
await page.keyboard.press('Enter');
assert.equal(await page.locator('#node-title').innerText(),'Press Begin');
await page.setViewportSize({width:390,height:844});
await page.selectOption('#map-select','care');
assert.equal(await page.locator('#title').innerText(),'Intimate Service and massage');
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
assert.equal(overflow,false,'Unexpected whole-page overflow on mobile');
await page.screenshot({path:join(screenshotDirectory,'mobile.png'),fullPage:true});
await page.setViewportSize({width:1440,height:1000});
await page.evaluate(()=>{window.print=()=>{window.printRequested=true;};});
await page.click('#print-all');
assert.equal(await page.locator('.print-page').count(),graphs.length);
assert.equal(await page.evaluate(()=>window.printRequested),true);
// Confirm the export action produces an actual standalone SVG download.
const downloadEvent=page.waitForEvent('download');
await page.click('#export-svg');
const download=await downloadEvent;
assert.equal(download.suggestedFilename(),'chakra-care.svg');
assert.deepEqual(errors,[]);
console.log(JSON.stringify({mapsChecked:results.length,templateFallback:true,allNodeSelections:true,labelBounds:true,mobileOverflow:false,keyboard:true,printMaps:graphs.length,svgDownload:true,pageErrors:errors}));
} finally {
 await browser.close();
 await rm(screenshotDirectory,{recursive:true,force:true});
}
