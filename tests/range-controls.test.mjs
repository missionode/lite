import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/range-controls.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const rangeControls = window\.ChakraRangeControls/);
assert.match(app, /function enhanceRangeControls\(\)\s*\{\s*rangeControls\.enhance\(/);
assert.match(app, /function refreshRangeControlDisplays\(\)\s*\{\s*rangeControls\.refresh\(/);
assert.match(html, /modules\/range-controls\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.84/);
assert.match(serviceWorker, /chakra-v5\.279[\s\S]*?modules\/range-controls\.js\?v=1\.0/);

const context = vm.createContext({ Event: class { constructor(type, options) { this.type = type; this.bubbles = options.bubbles; } } });
vm.runInContext(source, context);
const controls = context.ChakraRangeControls;
assert.ok(Object.isFrozen(controls));

const documentForFormat = { getElementById: id => id === 'shots-toggle' ? { checked: false } : null };
const format = (id, value, step = '1') => controls.formatValue({ id, value, step }, documentForFormat);
assert.equal(format('time-per-chakra', '3.5'), '3.5 mins');
documentForFormat.getElementById = () => ({ checked: true });
assert.equal(format('time-per-chakra', '3.5'), '4 secs');
assert.equal(format('mood-relaxation-ambience-level', '12.34'), '12.3%');
assert.equal(format('pleasure-ambience-blur-level', '12.6'), '13%');
assert.equal(format('time-high-energy', '7'), '7 mins');
assert.equal(format('time-bath', '125'), '2m');
assert.equal(format('time-interval', '8'), '8s');
assert.equal(format('volume', '0.5', '0.1'), '0.50');
assert.equal(format('volume', 'unknown'), 'unknown');

class FakeNode {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.parentElement = null;
        this.dataset = {};
        this.attributes = {};
        this.listeners = new Map();
        this.disabled = false;
        this.textContent = '';
        this.value = '';
        this._className = '';
        this.classList = {
            add: (...names) => { this._className = [...new Set([...this._className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
            contains: name => this._className.split(/\s+/).includes(name)
        };
    }
    set className(value) { this._className = value; }
    get className() { return this._className; }
    appendChild(child) {
        child.parentElement?.removeChild(child);
        this.children.push(child); child.parentElement = this; return child;
    }
    prepend(child) {
        child.parentElement?.removeChild(child);
        this.children.unshift(child); child.parentElement = this;
    }
    insertBefore(child, anchor) {
        const index = this.children.indexOf(anchor);
        if (index < 0) return this.appendChild(child);
        child.parentElement?.removeChild(child);
        this.children.splice(index, 0, child); child.parentElement = this; return child;
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index >= 0) this.children.splice(index, 1);
        child.parentElement = null;
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    addEventListener(type, callback) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(callback); this.listeners.set(type, listeners);
    }
    dispatchEvent(event) { (this.listeners.get(event.type) || []).forEach(callback => callback(event)); return true; }
    matches(selector) {
        if (selector.startsWith(':scope > ')) return this.parentElement && this.parentElement.children.includes(this) && this.matches(selector.slice(9));
        if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
        if (selector === 'input[type="range"]') return this.tagName === 'input' && this.type === 'range';
        return selector === 'span' && this.tagName === 'span';
    }
    querySelector(selector) {
        for (const child of this.children) {
            if (child.matches(selector)) return child;
            const nested = child.querySelector(selector);
            if (nested) return nested;
        }
        return null;
    }
    querySelectorAll(selector) {
        const found = [];
        for (const child of this.children) {
            if (child.matches(selector)) found.push(child);
            found.push(...child.querySelectorAll(selector));
        }
        return found;
    }
}

const container = new FakeNode('div');
container.classList.add('mixer-row');
const input = new FakeNode('input');
Object.assign(input, { type: 'range', id: 'volume', min: '1', max: '2', step: '0.5', value: '1.5' });
input.closest = () => container;
const inlineValue = new FakeNode('span');
container.appendChild(input);
container.appendChild(inlineValue);
const document = {
    getElementById: () => null,
    createElement: tag => new FakeNode(tag),
    querySelectorAll(selector) {
        if (selector === 'input[type="range"]') return [input];
        if (selector === '.range-control') return [container].filter(item => item.classList.contains('range-control'));
        throw new Error(`Unexpected selector: ${selector}`);
    }
};

controls.enhance({ document, EventConstructor: context.Event });
assert.equal(container.dataset.rangeEnhanced, 'true');
assert.equal(container.classList.contains('range-control'), true);
assert.equal(inlineValue.textContent, '1.50');
const meta = container.querySelector(':scope > .range-meta');
assert.ok(meta);
assert.equal(inlineValue.parentElement, meta);
const decrement = meta.querySelector('.range-decrement');
const increment = meta.querySelector('.range-increment');
const minimum = meta.querySelector('.range-min');
const maximum = meta.querySelector('.range-max');
assert.deepEqual([decrement.getAttribute?.('aria-label') ?? decrement.attributes['aria-label'], increment.attributes['aria-label']], ['Decrease value', 'Increase value']);
assert.equal(minimum.textContent, '1');
assert.equal(maximum.textContent, '2');
assert.equal(decrement.disabled, false);
assert.equal(increment.disabled, false);

increment.listeners.get('click')[0]();
assert.equal(input.value, '2.0');
assert.equal(inlineValue.textContent, '2.00');
assert.equal(increment.disabled, true, 'the plus control disables at the maximum');
increment.listeners.get('click')[0]();
assert.equal(input.value, '2.0', 'increment clamps at the configured maximum');
decrement.listeners.get('click')[0]();
assert.equal(input.value, '1.5');
controls.enhance({ document, EventConstructor: context.Event });
assert.equal(container.querySelectorAll('.range-step').length, 2, 'enhancing twice must not duplicate controls');
input.value = '1';
controls.refresh({ document });
assert.equal(inlineValue.textContent, '1.00');
assert.equal(decrement.disabled, false, 'display refresh alone does not change button state');
input.dispatchEvent(new context.Event('input', { bubbles: true }));
assert.equal(decrement.disabled, true, 'input-driven updates retain boundary disabled state');

assert.throws(() => controls.enhance({}), /require a document/);
assert.throws(() => controls.refresh({}), /require a document/);
console.log('Range controls passed: value formatting, step-button bounds, idempotent enhancement, refresh and app/offline delivery contracts.');
