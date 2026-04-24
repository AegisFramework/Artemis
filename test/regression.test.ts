import { afterEach, describe, expect, test } from 'bun:test';
import * as Browser from '../src/browser';
import { Form, Text } from '../src';
import { RequestError } from '../src/Request';
import { Space, SpaceAdapter } from '../src/Space';
import { IndexedDB } from '../src/SpaceAdapter/IndexedDB';
import { RemoteStorage, KeyNotFoundError as RemoteStorageKeyNotFoundError } from '../src/SpaceAdapter/RemoteStorage';
import { cloneValue } from '../src/SpaceAdapter/types';

class FakeStorage {
  private readonly data!: Map<string, string>;

  constructor() {
    Object.defineProperty(this, 'data', {
      value: new Map<string, string>(),
      enumerable: false,
      configurable: false,
      writable: false
    });
  }

  get length(): number {
    return this.data.size;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
    Object.defineProperty(this, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }

  removeItem(key: string): void {
    this.data.delete(key);
    delete (this as unknown as Record<string, unknown>)[key];
  }

  clear(): void {
    for (const key of Array.from(this.data.keys())) {
      this.removeItem(key);
    }
  }
}

function withGlobal(name: string, value: unknown): () => void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor);
    } else {
      delete (globalThis as unknown as Record<string, unknown>)[name];
    }
  };
}

const cleanups: Array<() => void> = [];

afterEach(() => {
  while (cleanups.length > 0) {
    cleanups.pop()?.();
  }
});

describe('browser entrypoint', () => {
  test('re-exports the public API', () => {
    expect(Browser.Text).toBe(Text);
  });
});

describe('storage cloning', () => {
  test('preserves structured values when cloning for transformations', () => {
    const date = new Date('2026-04-24T00:00:00.000Z');
    const map = new Map<string, unknown>([['createdAt', date]]);
    const original = { date, map };

    const cloned = cloneValue(original);

    expect(cloned).not.toBe(original);
    expect(cloned.date).toEqual(date);
    expect(cloned.date).not.toBe(date);
    expect(cloned.map).toBeInstanceOf(Map);
    expect(cloned.map.get('createdAt')).toEqual(date);
  });

  test('clones Set independently', () => {
    const original = new Set([1, 2, 3]);
    const cloned = cloneValue(original);
    expect(cloned).not.toBe(original);
    expect(cloned).toBeInstanceOf(Set);
    expect(Array.from(cloned)).toEqual([1, 2, 3]);
    cloned.add(4);
    expect(original.has(4)).toBe(false);
  });

  test('clones RegExp preserving source and flags', () => {
    const original = /foo/giu;
    const cloned = cloneValue(original);
    expect(cloned).not.toBe(original);
    expect(cloned.source).toBe('foo');
    expect(cloned.flags).toBe('giu');
  });

  test('returns class instances by reference', () => {
    class CustomThing {
      constructor(public name: string) {}
      greet() { return `hi ${this.name}`; }
    }
    const original = new CustomThing('Diana');
    const cloned = cloneValue(original);
    // Custom class instances are passed through — preserving methods/identity
    // matters more than isolating mutation.
    expect(cloned).toBe(original);
    expect(cloned.greet()).toBe('hi Diana');
  });

  test('falls back to manual clone when structuredClone is unavailable', () => {
    cleanups.push(withGlobal('structuredClone', undefined));
    const date = new Date('2026-04-24T00:00:00.000Z');
    const cloned = cloneValue({ when: date });
    expect(cloned.when).toBeInstanceOf(Date);
    expect(cloned.when.getTime()).toBe(date.getTime());
    expect(cloned.when).not.toBe(date);
  });
});

describe('LocalStorage upgrades', () => {
  test('rolls back copied data and preserves the old version when an upgrade fails', async () => {
    const storage = new FakeStorage();
    storage.setItem('App::1.0.0_config', JSON.stringify({ enabled: true }));

    cleanups.push(withGlobal('Storage', FakeStorage));
    cleanups.push(withGlobal('window', { localStorage: storage }));

    const space = new Space(SpaceAdapter.LocalStorage, {
      name: 'App',
      version: '2.0.0'
    });

    await space.upgrade('1.0.0', '2.0.0', () => {
      throw new Error('upgrade failed');
    });

    await expect(space.open()).rejects.toThrow('upgrade failed');
    expect(storage.getItem('App::1.0.0_config')).toBe(JSON.stringify({ enabled: true }));
    expect(storage.getItem('App::2.0.0_config')).toBeNull();
  });

  test('removes old-version keys after a successful upgrade', async () => {
    const storage = new FakeStorage();
    storage.setItem('App::1.0.0_config', JSON.stringify({ enabled: true }));

    cleanups.push(withGlobal('Storage', FakeStorage));
    cleanups.push(withGlobal('window', { localStorage: storage }));

    const space = new Space(SpaceAdapter.LocalStorage, {
      name: 'App',
      version: '2.0.0'
    });
    await space.upgrade('1.0.0', '2.0.0', () => { /* identity migration */ });
    await space.open();

    expect(storage.getItem('App::2.0.0_config')).toBe(JSON.stringify({ enabled: true }));
    expect(storage.getItem('App::1.0.0_config')).toBeNull();
  });

  test('selects the previous version numerically rather than lexicographically', async () => {
    // Lexicographic sort would put "10" before "2"; numeric sort must pick
    // 10.0.0 as the immediate predecessor of 11.0.0.
    const storage = new FakeStorage();
    storage.setItem('App::2.0.0_data', JSON.stringify('v2'));
    storage.setItem('App::10.0.0_data', JSON.stringify('v10'));

    cleanups.push(withGlobal('Storage', FakeStorage));
    cleanups.push(withGlobal('window', { localStorage: storage }));

    const upgradesRun: string[] = [];
    const space = new Space(SpaceAdapter.LocalStorage, {
      name: 'App',
      version: '11.0.0'
    });
    await space.upgrade('2.0.0', '3.0.0', () => { upgradesRun.push('2->3'); });
    await space.upgrade('10.0.0', '11.0.0', () => { upgradesRun.push('10->11'); });
    await space.open();

    expect(upgradesRun).toEqual(['10->11']);
    expect(storage.getItem('App::11.0.0_data')).toBe(JSON.stringify('v10'));
    expect(storage.getItem('App::10.0.0_data')).toBeNull();
    // 2.0.0 is older than 10.0.0 and is not part of the active migration chain.
    expect(storage.getItem('App::2.0.0_data')).toBe(JSON.stringify('v2'));
  });

  test('recovers and re-opens after a previously failed upgrade', async () => {
    const storage = new FakeStorage();
    storage.setItem('App::1.0.0_config', JSON.stringify({ enabled: true }));

    cleanups.push(withGlobal('Storage', FakeStorage));
    cleanups.push(withGlobal('window', { localStorage: storage }));

    let shouldFail = true;
    const space = new Space(SpaceAdapter.LocalStorage, {
      name: 'App',
      version: '2.0.0'
    });
    await space.upgrade('1.0.0', '2.0.0', () => {
      if (shouldFail) {
        throw new Error('boom');
      }
    });

    await expect(space.open()).rejects.toThrow('boom');
    expect(storage.getItem('App::1.0.0_config')).toBe(JSON.stringify({ enabled: true }));
    expect(storage.getItem('App::2.0.0_config')).toBeNull();

    shouldFail = false;
    await space.open();

    expect(storage.getItem('App::2.0.0_config')).toBe(JSON.stringify({ enabled: true }));
    expect(storage.getItem('App::1.0.0_config')).toBeNull();
  });
});

describe('RemoteStorage responses', () => {
  test('throws RequestError for failed mutation responses', async () => {
    cleanups.push(withGlobal('fetch', async () => new Response('{"error":"nope"}', {
      status: 500,
      statusText: 'Internal Server Error'
    })));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    await expect(storage.set('item-1', { name: 'One' })).rejects.toBeInstanceOf(RequestError);
  });

  test('maps 404 reads to RemoteStorageKeyNotFoundError', async () => {
    cleanups.push(withGlobal('fetch', async () => new Response('', {
      status: 404,
      statusText: 'Not Found'
    })));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    await expect(storage.get('missing')).rejects.toBeInstanceOf(RemoteStorageKeyNotFoundError);
  });

  test('does not create a record when update fails for reasons other than missing key', async () => {
    const methods: string[] = [];

    cleanups.push(withGlobal('fetch', async (_url: string | URL | Request, init?: RequestInit) => {
      methods.push(init?.method ?? 'GET');
      return new Response('{"error":"down"}', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    }));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    await expect(storage.update('item-1', { name: 'One' })).rejects.toBeInstanceOf(RequestError);
    expect(methods).toEqual(['GET']);
  });

  test('rethrows RequestError when PUT fails after a successful GET', async () => {
    const methods: string[] = [];

    cleanups.push(withGlobal('fetch', async (_url: string | URL | Request, init?: RequestInit) => {
      const method = (init?.method ?? 'GET').toUpperCase();
      methods.push(method);
      if (method === 'GET') {
        return new Response(JSON.stringify({ existing: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('{"error":"down"}', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    }));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    await expect(storage.update('item-1', { name: 'One' })).rejects.toBeInstanceOf(RequestError);
    expect(methods).toEqual(['GET', 'PUT']);
  });

  test('unwraps wrapped primitive values from the wire format', async () => {
    cleanups.push(withGlobal('fetch', async () => new Response(JSON.stringify({
      __artemis_value__: 42
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    expect(await storage.get('answer')).toBe(42);
  });

  test('passes through real records that share neither the marker key nor shape', async () => {
    cleanups.push(withGlobal('fetch', async () => new Response(JSON.stringify({
      name: 'Diana',
      role: 'engineer'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    expect(await storage.get('user')).toEqual({ name: 'Diana', role: 'engineer' });
  });

  test('unwraps wrapped values inside getAll responses', async () => {
    cleanups.push(withGlobal('fetch', async () => new Response(JSON.stringify({
      a: { __artemis_value__: [1, 2, 3] },
      b: { name: 'real' }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items'
    });

    const result = await storage.getAll();
    expect(result.a).toEqual([1, 2, 3]);
    expect(result.b).toEqual({ name: 'real' });
  });

  test('double-wraps records that already match the wrapper shape on set', async () => {
    let sentBody: unknown = null;
    cleanups.push(withGlobal('fetch', async (_url: string | URL | Request, init?: RequestInit) => {
      const body = init?.body;
      sentBody = typeof body === 'string' ? JSON.parse(body) : body;
      return new Response(typeof body === 'string' ? body : 'null', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items',
      props: { headers: { 'Content-Type': 'application/json' } }
    });

    const result = await storage.set('item', { __artemis_value__: 42 });

    // Wire body double-wraps so unwrap can recover the user's record.
    expect(sentBody).toEqual({ __artemis_value__: { __artemis_value__: 42 } });
    // Echoed response unwraps once back to the original record shape.
    expect(result.value).toEqual({ __artemis_value__: 42 });
  });

  test('round-trips a record that matches the wrapper shape', async () => {
    // Server is dumb echo storage: returns the exact body sent.
    let stored: unknown = null;
    cleanups.push(withGlobal('fetch', async (_url: string | URL | Request, init?: RequestInit) => {
      const method = (init?.method ?? 'GET').toUpperCase();
      if (method === 'POST' || method === 'PUT') {
        stored = typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body;
        return new Response(typeof init?.body === 'string' ? init.body : 'null', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(stored), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }));

    const storage = new RemoteStorage({
      endpoint: 'https://api.example.test/',
      store: 'items',
      props: { headers: { 'Content-Type': 'application/json' } }
    });

    const original = { __artemis_value__: 42 };
    await storage.set('item', original);
    expect(await storage.get('item')).toEqual(original);
  });
});

describe('IndexedDB key handling', () => {
  let counter = 0;
  const dbName = (label: string) => `artemis-test-${label}-${++counter}-${Date.now()}`;

  test('stores out-of-line keys when no keyPath is configured', async () => {
    const adapter = new IndexedDB({
      name: dbName('out-of-line'),
      version: '1.0.0',
      store: 'items'
    });
    await adapter.open();

    await adapter.set('alpha', 'just a string');
    await adapter.set('beta', { nested: 'object' });

    expect(await adapter.get('alpha')).toBe('just a string');
    expect(await adapter.get('beta')).toEqual({ nested: 'object' });

    const all = await adapter.getAll();
    expect(all).toEqual({ alpha: 'just a string', beta: { nested: 'object' } });
  });

  test('inlines the key into record values for inline keyPath stores', async () => {
    const adapter = new IndexedDB({
      name: dbName('inline-record'),
      version: '1.0.0',
      store: 'items',
      props: { keyPath: 'id' }
    });
    await adapter.open();

    await adapter.set('alpha', { name: 'Diana' });
    expect(await adapter.get('alpha')).toEqual({ id: 'alpha', name: 'Diana' });

    // getAll strips the keyPath property to match the Space key/value shape.
    const all = await adapter.getAll();
    expect(all).toEqual({ alpha: { name: 'Diana' } });
  });

  test('throws when setting a primitive value against an inline keyPath store', async () => {
    const adapter = new IndexedDB({
      name: dbName('inline-primitive'),
      version: '1.0.0',
      store: 'items',
      props: { keyPath: 'id' }
    });
    await adapter.open();

    await expect(adapter.set('alpha', 'not a record')).rejects.toThrow(/uses keyPath "id"/);
  });

  test('update() merges plain object values', async () => {
    const adapter = new IndexedDB({
      name: dbName('update-merge'),
      version: '1.0.0',
      store: 'items'
    });
    await adapter.open();

    await adapter.set('alpha', { name: 'Diana' });
    await adapter.update('alpha', { age: 30 });

    expect(await adapter.get('alpha')).toEqual({ name: 'Diana', age: 30 });
  });

  test('update() replaces rather than merges when either side is non-record', async () => {
    const adapter = new IndexedDB({
      name: dbName('update-replace'),
      version: '1.0.0',
      store: 'items'
    });
    await adapter.open();

    await adapter.set('alpha', 'first');
    await adapter.update('alpha', 'second');
    expect(await adapter.get('alpha')).toBe('second');

    await adapter.set('beta', { name: 'Diana' });
    await adapter.update('beta', [1, 2, 3]);
    expect(await adapter.get('beta')).toEqual([1, 2, 3]);
  });

  test('rejects open() when a sync upgrade callback throws', async () => {
    const name = dbName('upgrade-throw');

    const v1 = new IndexedDB({ name, version: '1.0.0', store: 'items' });
    await v1.open();
    v1.storage?.close();

    const v2 = new IndexedDB({ name, version: '2.0.0', store: 'items' });
    await v2.upgrade('1.0.0', '2.0.0', () => {
      throw new Error('upgrade boom');
    });

    await expect(v2.open()).rejects.toThrow('upgrade boom');
  });

  test('rejects open() when an async upgrade callback rejects after commit', async () => {
    const name = dbName('upgrade-async');

    const v1 = new IndexedDB({ name, version: '1.0.0', store: 'items' });
    await v1.open();
    v1.storage?.close();

    const v2 = new IndexedDB({ name, version: '2.0.0', store: 'items' });
    // Async rejections happen *after* the version-change transaction commits,
    // so we can't roll back. open() must still surface the failure rather
    // than silently log and resolve.
    await v2.upgrade('1.0.0', '2.0.0', () => Promise.reject(new Error('async upgrade boom')));

    await expect(v2.open()).rejects.toThrow('async upgrade boom');
    // Adapter is poisoned: subsequent open() must also reject. Otherwise the
    // version-bump-with-no-upgrade-applied state would be silently usable.
    expect(v2.storage).toBeUndefined();
    await expect(v2.open()).rejects.toThrow('async upgrade boom');
    // Operations against the poisoned adapter must fail too.
    await expect(v2.set('x', { id: 'x' })).rejects.toThrow('async upgrade boom');
  });

  test('throws when configuration() changes keyPath after open()', async () => {
    const adapter = new IndexedDB({
      name: dbName('cfg-keypath'),
      version: '1.0.0',
      store: 'items',
      props: { keyPath: 'id' }
    });
    await adapter.open();

    expect(() => adapter.configuration({ props: { keyPath: 'uuid' } } as never)).toThrow(/Cannot change keyPath/);
  });
});

describe('Form regression', () => {
  function makeForm(html: string): HTMLFormElement {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    cleanups.push(() => container.remove());
    return container.querySelector('form') as HTMLFormElement;
  }

  test('clears the radio group when the value matches no option', () => {
    makeForm(`
      <form data-form="rad-clear">
        <input type="radio" name="color" value="red" checked>
        <input type="radio" name="color" value="green">
      </form>
    `);

    Form.fill('rad-clear', { color: 'unknown' });

    const checked = document.querySelector('input[name="color"]:checked');
    expect(checked).toBeNull();
  });

  test('preserves radio selection when the data value is null', () => {
    makeForm(`
      <form data-form="rad-keep">
        <input type="radio" name="color" value="red" checked>
        <input type="radio" name="color" value="green">
      </form>
    `);

    Form.fill('rad-keep', { color: null });

    const checked = document.querySelector<HTMLInputElement>('input[name="color"]:checked');
    expect(checked?.value).toBe('red');
  });

  test('parseNumbers converts numeric strings in text inputs (default true)', () => {
    makeForm(`
      <form data-form="t-pn">
        <input type="text" name="age" value="30">
        <input type="text" name="city" value="Paris">
      </form>
    `);

    const values = Form.values('t-pn');
    expect(values.age).toBe(30);
    expect(values.city).toBe('Paris');
  });

  test('parseNumbers=false leaves numeric strings as strings', () => {
    makeForm(`
      <form data-form="t-pn-off">
        <input type="text" name="age" value="30">
      </form>
    `);

    const values = Form.values('t-pn-off', { parseNumbers: false });
    expect(values.age).toBe('30');
  });

  test('handles form names containing apostrophes without crashing the selector', () => {
    makeForm(`<form data-form="it's-tricky"><input name="a" value="1"></form>`);

    expect(() => Form.values("it's-tricky")).not.toThrow();
    expect(Form.values("it's-tricky")).toEqual({ a: 1 });
  });

  test('handles form names containing newlines without throwing SyntaxError', () => {
    const form = makeForm(`<form data-form="weird"><input name="a" value="1"></form>`);
    // Set the attribute imperatively so happy-dom preserves the literal LF
    // (HTML attribute parsing can normalize whitespace in some contexts).
    form.setAttribute('data-form', 'weird\nname');

    expect(() => Form.values('weird\nname')).not.toThrow();
    expect(Form.values('weird\nname')).toEqual({ a: 1 });
  });

  test('handles control characters and backslashes in field names', () => {
    const form = makeForm(`<form data-form="ctrl-test"></form>`);
    const input = document.createElement('input');
    input.setAttribute('name', "weird\\name");
    input.value = 'ok';
    form.appendChild(input);

    expect(() => Form.values('ctrl-test')).not.toThrow();
    expect(Form.values('ctrl-test')).toEqual({ 'weird\\name': 'ok' });
  });
});
