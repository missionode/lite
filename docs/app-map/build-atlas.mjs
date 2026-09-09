import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { graphs, meta } from './atlas-data.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const groupOrder = ['Start here','Journeys','Live session','Systems','Supporting pages'];
graphs.sort((a,b)=>groupOrder.indexOf(a.group)-groupOrder.indexOf(b.group));
const seen = new Set();
for (const graph of graphs) {
  if (seen.has(graph.id)) throw new Error(`Duplicate graph ${graph.id}`);
  seen.add(graph.id);
  const nodes = graph.rows.flat();
  const ids = new Set(nodes.map(node => node[0]));
  if (ids.size !== nodes.length) throw new Error(`Duplicate node in ${graph.id}`);
  for (const edge of graph.edges) {
    if (!ids.has(edge[0]) || !ids.has(edge[1])) throw new Error(`Broken edge ${graph.id}: ${edge}`);
  }
  for (const reference of graph.source.split('; ')) {
    const [file,line] = reference.split(':');
    const source = fs.readFileSync(path.resolve(directory, '../..', file),'utf8');
    if (+line > source.split('\n').length) throw new Error(`Invalid reference ${reference}`);
  }
}
const data = JSON.stringify({meta,graphs}).replaceAll('<','\\u003c');
const template = fs.readFileSync(path.join(directory,'atlas-template.html'),'utf8');
fs.writeFileSync(path.join(directory,'index.html'), template.replace('/* ATLAS_DATA */', `const atlas = ${data};`));

let markdown = `# ${meta.title}\n\nSource snapshot: ${meta.commit} · ${meta.date}.\n\n${meta.scope}\n\nOpen [the interactive atlas](./index.html) for diagrams, node details, source references, SVG export and printing.\n\n`;
markdown += '## Index\n\n' + graphs.map((g,i)=>`${i+1}. [${g.title}](#${g.id})`).join('\n')+'\n\n';
for (const g of graphs) {
  markdown += `<a id="${g.id}"></a>\n\n## ${g.title}\n\n${g.subtitle}\n\nSources: ${g.source.split('; ').map(ref=>{const [file,line]=ref.split(':'); return `[${ref}](/Users/lekshmisyam/Desktop/Ikigai/lite/${file}:${line})`;}).join(', ')}.\n\n`;
  markdown += '```mermaid\nflowchart TD\n';
  for(const [id,label] of g.rows.flat()) markdown += `  ${id}["${label.replaceAll('"',"'")}"]\n`;
  for(const [from,to,label] of g.edges) markdown += `  ${from} -->|"${label.replaceAll('"',"'")}"| ${to}\n`;
  markdown += '```\n\n| Step | Current behavior |\n| --- | --- |\n';
  for(const [,label,detail] of g.rows.flat()) markdown += `| ${label.replaceAll('|','/')} | ${detail.replaceAll('|','/')} |\n`;
  markdown += '\n'+g.notes.map(n=>`- ${n}`).join('\n')+'\n\n';
}
markdown += `## Coverage and limitations\n\nThis atlas represents the reachable branches identified in the main UI/controller, supporting pages and service worker. Repeated stages are loops; independent language, audio, visual and timing choices compose with the journey maps instead of expanding into millions of duplicate diagrams. Timer values are source defaults unless otherwise stated. Imported content can add wording and data variants.\n\nThe atlas follows the source snapshot identified above, including explicitly labeled uncommitted changes. It is source analysis, not device playback or a formal proof of exhaustive state-space coverage. User/browser events can interleave in ways that require runtime tests. The logical audio diagram intentionally groups individual filter and oscillator nodes.\n\nPrior baseline: 21 of 23 non-browser test commands passed. Content-safety and drone-duration checks stop because owner-managed docs/dot.json is absent. New natural-sky behavior has static/unit evidence; browser preview was declined. No listening checks were run.\n`;
fs.writeFileSync(path.join(directory,'FLOW-REFERENCE.md'),markdown);
fs.writeFileSync(path.join(directory,'atlas.json'),JSON.stringify({meta,graphs},null,2)+'\n');
let inventory = '# Screen and control inventory\n\nSource snapshot: '+meta.commit+' · '+meta.date+'.\n\nThis inventories static UI declarations in all three HTML entry pages. Dynamic consultation radio answers/notes, translated option lists, enhanced range-step buttons and controls moved at runtime are described separately below. IDs without a visible text label retain their source identifier; this is a coverage checklist alongside the flow maps, not a new user-facing menu.\n\n';
for (const file of ['index.html','docs/assesment.html','docs/repertory.html']) {
 const html=fs.readFileSync(path.resolve(directory,'../..',file),'utf8');
 inventory += '## '+file+'\n\n| Source | Element | Identifier / label | Choices / bounds / destination |\n| --- | --- | --- | --- |\n';
 const re=/<(input|select|button|a)\b([^>]*?)(?:>([\s\S]*?)<\/\1\s*>|\/?>)/g;
 for(const match of html.matchAll(re)) {
  const [full,tag,attrs,inner='']=match;
  const attr=name=>new RegExp('(?:^|\\s)'+name+'="([^"]*)"').exec(attrs)?.[1]||'';
  const line=html.slice(0,match.index).split('\n').length;
  const text=inner.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const name=attr('id')||attr('name')||attr('aria-label')||text.slice(0,100)||attr('value')||'(generated / unlabeled)';
  const options=tag==='select'?[...inner.matchAll(/<option\b[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g)].map(o=>o[1]+': '+o[2].replace(/<[^>]*>/g,'').trim()).join('; '):'';
  const extra=[attr('type')&&'type='+attr('type'),attr('min')&&'min='+attr('min'),attr('max')&&'max='+attr('max'),attr('step')&&'step='+attr('step'),attr('value')&&'value='+attr('value'),attr('href')&&'href='+attr('href'),attr('data-i18n')&&'label='+attr('data-i18n'),options].filter(Boolean).join(' · ');
  const clean=s=>s.replaceAll('|','/').replaceAll('\n',' ').replaceAll('<','&lt;');
  inventory += `| [${line}](/Users/lekshmisyam/Desktop/Ikigai/lite/${file}:${line}) | ${tag} | ${clean(name)} | ${clean(extra)} |\n`;
 }
 inventory+='\n';
}
inventory += '## Runtime-generated and relocated controls\n\n- Yoga setup is declared in Settings markup, then moved into the Lobby Yoga panel by attachEventListeners.\n- Language/voice selects and Experiment activity choices receive generated options. See content, narration and experiments maps.\n- Range controls receive decrement/increment buttons; source bounds may be overridden by timing configuration, profile or demo.\n- Consultation generates seven cards with five question groups each, response choices and a notes textarea per card. It persists each response immediately.\n- Repertory generates a Prepare Shot anchor for each validated catalog row and filters the rows during search.\n- Guide Continue is one shared control whose label and availability change with care/Yoga stage.\n- Completion Earn link is revealed after a timer only for eligible meditation languages.\n- Narration ticker text, progress dots, fullscreen reveal state and canvas visuals are dynamic output surfaces.\n\n## Screen and overlay inventory\n\nSix switchable application screens: config-screen, experiment-screen, lobby-screen, icebreaker-screen, breathing-screen and meditation-screen. Additional surfaces: splash-screen, settings-help-modal, journey-video-prelude, volume-mixer, completion-modal and session-overlay. Consultation and repertory are separate documents with their own navigation and persistent state.\n';
fs.writeFileSync(path.join(directory,'CONTROL-INVENTORY.md'),inventory);
console.log(JSON.stringify({graphs:graphs.length,nodes:graphs.reduce((n,g)=>n+g.rows.flat().length,0),edges:graphs.reduce((n,g)=>n+g.edges.length,0),output:path.join(directory,'index.html')}));
