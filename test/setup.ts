import { Window } from 'happy-dom';
import 'fake-indexeddb/auto';

// Expose a happy-dom DOM on globalThis so Form tests have a real
// document.querySelector that parses CSS selectors.
const win = new Window();

// happy-dom expects a few JS-builtin constructors to live on `window` (it
// uses `new this.window.SyntaxError(...)` internally). Bun's runtime does
// not pre-populate these the way Node's vm context does, so wire them up
// explicitly before running any test code.
const winRecord = win as unknown as Record<string, unknown>;
const builtinsToProxy = [
  'SyntaxError', 'TypeError', 'RangeError', 'ReferenceError', 'Error',
  'URIError', 'EvalError', 'DOMException'
] as const;
for (const name of builtinsToProxy) {
  if (winRecord[name] === undefined) {
    winRecord[name] = (globalThis as unknown as Record<string, unknown>)[name];
  }
}

const dom = [
  'window', 'document', 'navigator', 'location',
  'Element', 'Node', 'NodeList', 'NamedNodeMap', 'HTMLCollection',
  'HTMLElement', 'HTMLFormElement', 'HTMLInputElement',
  'HTMLSelectElement', 'HTMLTextAreaElement', 'HTMLOptionElement',
  'FormData', 'File', 'Blob', 'DOMException'
] as const;

for (const name of dom) {
  const value = winRecord[name];
  if (value === undefined) continue;
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true
  });
}

// `fake-indexeddb/auto` populates `globalThis.indexedDB`, but the IndexedDB
// adapter reaches for `window.indexedDB`. Bridge it.
const globalIndexedDB = (globalThis as unknown as Record<string, unknown>).indexedDB;
if (globalIndexedDB && winRecord.indexedDB === undefined) {
  winRecord.indexedDB = globalIndexedDB;
}

const globalIDBKeyRange = (globalThis as unknown as Record<string, unknown>).IDBKeyRange;
if (globalIDBKeyRange && winRecord.IDBKeyRange === undefined) {
  winRecord.IDBKeyRange = globalIDBKeyRange;
}
// Mirror the IDB constructors to globalThis so `instanceof IDBDatabase`
// checks (used in `open()`) match against the same class objects fake-
// indexeddb returns.
const idbBuiltins = ['IDBDatabase', 'IDBTransaction', 'IDBObjectStore', 'IDBRequest', 'IDBOpenDBRequest', 'IDBCursor', 'IDBCursorWithValue', 'IDBVersionChangeEvent', 'IDBKeyRange', 'IDBIndex'] as const;
for (const name of idbBuiltins) {
  const ctor = (globalThis as unknown as Record<string, unknown>)[name];
  if (ctor !== undefined) {
    winRecord[name] = ctor;
  }
}
