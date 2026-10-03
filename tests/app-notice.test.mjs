import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/app-notice.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

class Node {
    constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.listeners = {}; this.textContent = ''; this.className = ''; }
    append(...nodes) { nodes.forEach(node => { node.parent = this; this.children.push(node); }); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); }
    setAttribute(key, value) { this.attrs[key] = value; }
    addEventListener(type, fn) { this.listeners[type] = fn; }
    querySelector(selector) { return this.children.find(child => `.${child.className}` === selector) || null; }
    focus() { this.focused = true; }
}
const body = new Node('body');
const document = { body, createElement: tag => new Node(tag) };
const context = vm.createContext({ document });
vm.runInContext(source, context);
const notice = context.ChakraAppNotice;

notice.show('Please choose at least one chakra before you begin.', { okLabel: 'OK' });
assert.equal(body.children.length, 1, 'one calm in-app message is shown');
const box = body.children[0];
assert.equal(box.attrs.role, 'alertdialog', 'screen readers announce it');
assert.equal(box.children[0].textContent, 'Please choose at least one chakra before you begin.');
assert.equal(box.children[1].textContent, 'OK');
assert.equal(box.children[1].focused, true, 'the OK button gets focus');
notice.show('Second message', { okLabel: 'OK', tone: 'error' });
notice.show('Second message', { okLabel: 'OK' });
assert.equal(body.children.length, 1, 'messages wait in a queue, and duplicates are dropped');
box.children[1].listeners.click();
assert.equal(body.children.length, 1);
assert.equal(body.children[0].children[0].textContent, 'Second message');
assert.match(body.children[0].className, /app-notice-error/);
body.children[0].children[1].listeners.click();
assert.equal(body.children.length, 0);
assert.equal(notice.show('   '), false, 'empty messages are ignored');

// No raw browser alert boxes or developer text left in the app shell.
const rawAlerts = (app.match(/(^|[^.\w])alert\(/gm) || []).length;
assert.equal(rawAlerts, 0, 'app.js shows no raw alert() boxes');
assert.doesNotMatch(app, /Check console|App Error:/, 'no developer wording is shown to users');
assert.match(app, /window\.onerror = function[\s\S]*?chakra_last_error[\s\S]*?return false;/, 'crashes are logged quietly on the device');
for (const key of ['noticeSelectChakra', 'noticeSelectYogaPose', 'noticeStartFailed']) assert.match(app, new RegExp(`notify\\(t\\('ui\\.${key}'\\)`), `${key} is shown translated`);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8')).ui;
    for (const key of ['noticeOk', 'noticeSelectChakra', 'noticeSelectYogaPose', 'noticeStartFailed']) assert.ok(ui[key]?.trim(), `${language} has ui.${key}`);
}
assert.ok(html.indexOf('modules/app-notice.js?v=1.0') < html.indexOf('app.js?v='), 'the notice loads before the app');
assert.match(sw, /'\.\/modules\/app-notice\.js\?v=1\.0'/, 'and works offline');
console.log('App notice passed: calm translated in-app messages, queue, focus, no raw alerts or developer text, quiet error log.');
