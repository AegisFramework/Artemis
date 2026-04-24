# Artemis

Artemis is a lightweight JavaScript/TypeScript library providing common utilities for web development including DOM manipulation, storage wrappers, HTTP requests, and platform detection.

## Installation

```bash
# Using npm
npm install @aegis-framework/artemis

# Using yarn
yarn add @aegis-framework/artemis

# Using bun
bun add @aegis-framework/artemis
```

### ES Modules

```javascript
import { $_, Text, Space, SpaceAdapter } from '@aegis-framework/artemis';
```

### Browser (Script Tag)

```html
<script src="path/to/artemis.browser.js"></script>
<script>
  const { $_, Text, Space, SpaceAdapter } = Artemis;
</script>
```

---

## Classes

### DOM

jQuery-like DOM manipulation with a modern API.

```javascript
import { $_, $_ready, $_create } from '@aegis-framework/artemis';

$_ready(() => {
  // Select and manipulate elements
  $_('h1').text('Hello World').addClass('title');

  // Chained operations
  $_('.card')
    .addClass('active')
    .style({ 'background-color': '#fff', 'padding': '1rem' })
    .fadeIn(400);

  // Event handling
  $_('button').click((e) => {
    console.log('Button clicked!');
  });

  // Event delegation
  $_('ul').on('click', 'li', (e) => {
    console.log('List item clicked:', e.target);
  });

  // Removing event handlers
  const handler = (e) => console.log('Clicked!');
  $_('button').on('click', handler);
  $_('button').off('click', handler);       // Remove specific handler
  $_('button').off('click');                // Remove all click handlers
  $_('button').off();                       // Remove all handlers

  // Delegated handler removal
  $_('ul').off('click', 'li');              // Remove all delegated 'li' handlers
  $_('ul').off('click', 'li', handler);     // Remove specific delegated handler

  // Create new elements
  const div = $_create('div', { class: 'container', id: 'main' });

  // Traversal
  $_('.item').parent().addClass('has-item');
  $_('.item').parents();                     // All ancestors
  $_('.item').siblings().removeClass('active');
  $_('.item').children();
  $_('.item').next().addClass('following');
  $_('.item').prev().addClass('previous');
  $_('.item').closest('.wrapper');
  $_('.item').find('.child');

  // Visibility
  $_('#box').hide();
  $_('#box').show();         // Default: display 'block'
  $_('#box').show('flex');   // Custom display value
  $_('#box').isVisible();    // true if any element in collection is visible

  // Animations
  $_('#box').fadeOut(400, () => console.log('Hidden'));
  $_('#box').fadeIn(400, () => console.log('Visible'));
  $_('#box').animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }],
    { duration: 300, fill: 'forwards' }
  );

  // Dimensions and position
  const width = $_('#box').width();
  const height = $_('#box').height();
  const pos = $_('#box').offset();   // { top, left } relative to document

  // Scroll
  $_('#section').scrollIntoView({ behavior: 'smooth' });
});
```

#### Methods

| Method | Description |
|--------|-------------|
| `hide()` | Set `display: none` |
| `show(display?)` | Set display (default: `'block'`) |
| `addClass(name)` | Add a class |
| `removeClass(name?)` | Remove class, or all classes if no arg |
| `toggleClass(names)` | Toggle space-separated classes |
| `hasClass(name)` | Check if all elements have class |
| `text(value?)` | Get/set text content |
| `html(value?)` | Get/set HTML content |
| `value(value?)` | Get/set form element value |
| `attribute(name, value?)` | Get/set attribute |
| `removeAttribute(name)` | Remove an attribute |
| `hasAttribute(name)` | Check if all elements have attribute |
| `data(name, value?)` | Get/set data attributes |
| `removeData(name)` | Remove a data attribute |
| `style(prop, value?)` | Get/set inline styles (also accepts object) |
| `property(name, value?)` | Get/set DOM properties |
| `on(event, callback)` | Add event listener |
| `on(event, selector, callback)` | Add delegated event listener |
| `off(event?, selectorOrCallback?, callback?)` | Remove event listener(s) |
| `trigger(event, detail?)` | Dispatch event (CustomEvent if detail provided) |
| `click(callback)` | Shortcut for `on('click', callback)` |
| `keyup(callback)` | Shortcut for `on('keyup', callback)` |
| `keydown(callback)` | Shortcut for `on('keydown', callback)` |
| `submit(callback)` | Shortcut for `on('submit', callback)` |
| `change(callback)` | Shortcut for `on('change', callback)` |
| `scroll(callback)` | Shortcut for `on('scroll', callback)` |
| `input(callback)` | Shortcut for `on('input', callback)` |
| `find(selector)` | Find descendants |
| `closest(selector)` | Find closest ancestor |
| `filter(selector)` | Filter collection by selector |
| `matches(selector)` | Check if all elements match selector |
| `parent()` | Get parent elements |
| `parents()` | Get all ancestors |
| `children()` | Get child elements |
| `siblings()` | Get sibling elements |
| `next()` | Get next sibling |
| `prev()` | Get previous sibling |
| `first()` | Get first element as new DOM instance |
| `last()` | Get last element as new DOM instance |
| `eq(index)` | Get element at index (negative counts from end) |
| `get(index)` | Get raw HTMLElement at index |
| `each(callback)` | Iterate with `(element, index)` callback |
| `exists()` | Check if collection is non-empty |
| `append(content)` | Append HTML string or Element |
| `prepend(content)` | Prepend HTML string or Element |
| `after(content)` | Insert HTML after each element |
| `before(content)` | Insert HTML before each element |
| `remove()` | Remove elements from DOM |
| `empty()` | Remove all children |
| `clone(deep?)` | Clone elements (default: deep) |
| `replaceWith(content)` | Replace elements with HTML string or Element |
| `reset()` | Reset form elements |
| `focus()` | Focus the first element |
| `blur()` | Blur the first element |
| `isVisible()` | Check if any element is visible |
| `offset()` | Get `{ top, left }` relative to document |
| `width()` | Get width of first element |
| `height()` | Get height of first element |
| `fadeIn(duration?, callback?)` | Fade in (default: 400ms) |
| `fadeOut(duration?, callback?)` | Fade out (default: 400ms) |
| `animate(keyframes, options)` | Web Animations API |
| `scrollIntoView(options?)` | Scroll first element into view |

---

### Space

Storage wrapper with namespacing, versioning, and multiple backend adapters.

```javascript
import { Space, SpaceAdapter } from '@aegis-framework/artemis';

// LocalStorage adapter
const storage = new Space(SpaceAdapter.LocalStorage, {
  name: 'MyApp',
  version: '1.0.0'
});

await storage.open();

// Basic operations
await storage.set('user', { name: 'John', age: 30 });
const user = await storage.get('user');
await storage.update('user', { age: 31 }); // Merges with existing
await storage.remove('user');
await storage.clear();

// Get all data
const allData = await storage.getAll();
const keys = await storage.keys();

// Get key by index (LocalStorage/SessionStorage only)
const firstKey = await storage.key(0);

// Iterate
await storage.each((key, value) => {
  console.log(key, value);
});

// Check existence (resolves if exists, rejects if not)
await storage.contains('user');

// Callbacks
storage.onCreate((key, value) => console.log('Created:', key));
storage.onUpdate((key, value) => console.log('Updated:', key));
storage.onDelete((key, value) => console.log('Deleted:', key));

// Transformations (modify data on get/set)
storage.addTransformation({
  id: 'timestamps',
  set: (key, value) => ({ ...value, updatedAt: Date.now() }),
  get: (key, value) => value
});

storage.removeTransformation('timestamps');

// Read/update configuration
const config = storage.configuration();
storage.configuration({ name: 'NewName' });

// Rename the space (LocalStorage/SessionStorage only)
await storage.rename('NewName');
```

#### Adapters

**LocalStorage** - Persistent browser storage
```javascript
new Space(SpaceAdapter.LocalStorage, { name: 'App', version: '1.0.0' });
```

**SessionStorage** - Session-only storage (no version upgrades)
```javascript
new Space(SpaceAdapter.SessionStorage, { name: 'App' });
```

**IndexedDB** - Large-scale structured storage (requires name, version, and store)
```javascript
new Space(SpaceAdapter.IndexedDB, {
  name: 'App',
  version: '1.0.0',
  store: 'users',
  props: { keyPath: 'id', autoIncrement: true },
  index: {
    email: { name: 'Email Index', field: 'email', props: { unique: true } }
  }
});
```

**RemoteStorage** - REST API backend
```javascript
new Space(SpaceAdapter.RemoteStorage, {
  name: 'App',
  version: '1.0.0',
  endpoint: 'https://api.example.com/',
  store: 'users'
});
```

#### Version Upgrades

```javascript
const storage = new Space(SpaceAdapter.LocalStorage, {
  name: 'App',
  version: '2.0.0'
});

// Define upgrades before opening
await storage.upgrade('1.0.0', '2.0.0', async (adapter) => {
  const oldData = await adapter.get('config');
  await adapter.set('config', { ...oldData, newField: 'value' });
});

await storage.open(); // Upgrades run automatically
```

#### Error Handling

```javascript
import {
  LocalStorageKeyNotFoundError,
  IndexedDBKeyNotFoundError,
  RemoteStorageKeyNotFoundError
} from '@aegis-framework/artemis';

try {
  await storage.get('missing-key');
} catch (error) {
  if (error instanceof LocalStorageKeyNotFoundError) {
    console.log('Key not found in LocalStorage');
  }
}
```

---

### Request

HTTP client built on the Fetch API with timeout support and error handling.

```javascript
import { Request, RequestError, RequestTimeoutError } from '@aegis-framework/artemis';

// GET request
const response = await Request.get('https://api.example.com/users', {
  page: 1,
  limit: 10
});

// POST with JSON
const created = await Request.postJson('https://api.example.com/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT, PATCH, DELETE
await Request.put(url, data);
await Request.patch(url, data);
await Request.delete(url);

// HEAD request
const headResponse = await Request.head(url);

// Check if resource exists (HEAD + check status)
const exists = await Request.exists('https://api.example.com/users/1');

// With timeout
const data = await Request.json('https://api.example.com/slow', {}, {
  timeout: 5000 // 5 seconds
});

// Different response types
const json = await Request.json(url);
const text = await Request.text(url);
const blob = await Request.blob(url);
const buffer = await Request.arrayBuffer(url);

// Custom headers
await Request.post(url, data, {
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  }
});

// Error handling
try {
  const data = await Request.json(url);
} catch (error) {
  if (error instanceof RequestError) {
    console.log('HTTP Error:', error.status, error.statusText);
    console.log('Response:', error.response);
  } else if (error instanceof RequestTimeoutError) {
    console.log('Request timed out');
  }
}

// Serialize data to query string
Request.serialize({ name: 'John', tags: ['a', 'b'] });
// 'name=John&tags[]=a&tags[]=b'

Request.serialize({ filter: { status: 'active' } });
// 'filter[status]=active'
```

#### Methods

| Method | Description |
|--------|-------------|
| `get(url, data?, options?)` | GET request (data appended as query params) |
| `post(url, data, options?)` | POST request |
| `put(url, data, options?)` | PUT request |
| `patch(url, data, options?)` | PATCH request |
| `delete(url, data?, options?)` | DELETE request (data as query params) |
| `head(url, data?, options?)` | HEAD request (data as query params) |
| `json<T>(url, data?, options?)` | GET and parse JSON response |
| `postJson<T>(url, data, options?)` | POST with JSON body, parse JSON response |
| `blob(url, data?, options?)` | GET and return as Blob |
| `text(url, data?, options?)` | GET and return as text |
| `arrayBuffer(url, data?, options?)` | GET and return as ArrayBuffer |
| `exists(url, options?)` | Check if URL returns 2xx (HEAD request) |
| `serialize(data, prefix?)` | Serialize object to query string |

---

### Form

Form filling and value retrieval utilities. Forms are identified by their `data-form` attribute.

```html
<form data-form="UserForm">
  <input type="text" name="username">
  <input type="email" name="email">
  <input type="number" name="age">
  <input type="checkbox" name="newsletter">
  <select name="country">
    <option value="us">USA</option>
    <option value="uk">UK</option>
  </select>
</form>
```

```javascript
import { Form } from '@aegis-framework/artemis';

// Fill form with data
Form.fill('UserForm', {
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  newsletter: true,
  country: 'us'
});

// Get form values with type parsing
const values = Form.values('UserForm', {
  parseNumbers: true,  // default: true — see note below
  parseBooleans: true  // Parse single checkboxes as booleans (default: true)
});
// { username: 'john_doe', email: '...', age: 30, newsletter: true, country: 'us' }
//
// `parseNumbers: true` coerces *any* numeric-looking string — not just
// `<input type="number">` values, but also text/select/textarea — into a
// `Number`. That means leading-zero data like ZIP codes, account IDs, or
// phone numbers ("01234") will be returned as `1234`. If your form holds
// such fields, pass `parseNumbers: false` and convert numeric fields
// explicitly at the call site.

// Reset form
Form.reset('UserForm');

// Validation
if (Form.isValid('UserForm')) {
  // Submit form
}

// Show validation messages
Form.reportValidity('UserForm');
```

---

### Platform

Platform and feature detection using `matchMedia` and `NavigatorUAData` where available.

```javascript
import { Platform } from '@aegis-framework/artemis';

// Desktop detection
Platform.desktop();            // true if any desktop
Platform.desktop('macOS');     // true if macOS
Platform.desktop('Windows');   // true if Windows
Platform.desktop('Linux');     // true if Linux (excludes Android)
Platform.desktop('ChromeOS');  // true if ChromeOS
Platform.desktop('FreeBSD');   // true if FreeBSD

// Mobile detection
Platform.mobile();              // true if any mobile
Platform.mobile('iOS');         // true if iPhone/iPod
Platform.mobile('iPadOS');      // true if iPad (detects modern iPads reporting as macOS)
Platform.mobile('Android');     // true if Android
Platform.mobile('WindowsMobile'); // true if Windows Phone
Platform.mobile('BlackBerry');  // true if BlackBerry

// Display
Platform.orientation;    // 'portrait' | 'landscape'
Platform.portrait;       // true if portrait
Platform.landscape;      // true if landscape
Platform.retina;         // true if high DPI display (devicePixelRatio >= 2)

// Input capabilities
Platform.touch;          // true if touch supported
Platform.canHover;       // true if hover supported
Platform.coarsePointer;  // true if touch is primary input
Platform.finePointer;    // true if mouse/trackpad is primary input

// User preferences
Platform.darkMode;       // true if dark mode preferred
Platform.reducedMotion;  // true if reduced motion preferred

// Runtime environment
Platform.standalone;     // true if installed PWA
Platform.electron;       // true if Electron
Platform.electrobun;     // true if Electrobun
Platform.desktopApp;     // true if Electron or Electrobun
Platform.cordova;        // true if Cordova/PhoneGap

// Feature support
Platform.serviceWorkers; // true if service workers available (requires secure context)
```

---

### Text

Text transformation utilities.

```javascript
import { Text } from '@aegis-framework/artemis';

// Capitalize words
Text.capitalize('hello world');                     // 'Hello World'
Text.capitalize('API docs', { preserveCase: true }); // 'API Docs'

// URL-friendly slug
Text.friendly('Hello World!');  // 'hello-world'
Text.friendly('Café Münich');   // 'cafe-munich'

// Truncate with ellipsis
Text.truncate('Long text here', 10);        // 'Long te...'
Text.truncate('Long text', 10, '…');        // 'Long text' (under limit, returned as-is)
Text.truncate('Hello', 2, '...');           // '..' (maxLength < ellipsis, truncates ellipsis)

// Extract parts of a string
Text.prefix('@', 'user@example.com');  // 'user'
Text.suffix('@', 'user@example.com');  // 'example.com'

// Check for blank
Text.isBlank('');      // true
Text.isBlank('  ');    // true
Text.isBlank(null);    // true
Text.isBlank('text');  // false

// Get selected text in the document
const selected = Text.selection();
```

---

### FileSystem

File operations and utilities.

```javascript
import { FileSystem } from '@aegis-framework/artemis';

// Read local file (from file input, drag and drop, etc.)
const text = await FileSystem.read(file, 'text');
const base64 = await FileSystem.read(file, 'base64');   // Returns data URL
const buffer = await FileSystem.read(file, 'buffer');    // Returns ArrayBuffer
const binary = await FileSystem.read(file, 'binary');    // Returns binary string

// Read remote file
const content = await FileSystem.readRemote('https://example.com/file.txt', 'text');

// Create and download files
const newFile = FileSystem.create('data.json', JSON.stringify(data), 'application/json');
FileSystem.download(newFile);
FileSystem.download(blob, 'custom-name.txt');

// File type checks
FileSystem.isImage('photo.jpg');   // true (jpg, jpeg, png, gif, svg, webp, avif, bmp, ico, tiff, heic)
FileSystem.isVideo('movie.mp4');   // true (mp4, webm, ogg, mov, avi, mkv, m4v)
FileSystem.isAudio('song.mp3');    // true (mp3, wav, ogg, flac, aac, m4a, wma)

// File extension
FileSystem.extension('file.txt');              // 'txt'
FileSystem.extension('.gitignore');             // '' (hidden files return empty by default)
FileSystem.extension('.gitignore', true);       // 'gitignore' (allowHiddenFiles)
FileSystem.extension('archive.tar.gz');         // 'gz'

// Human-readable file size
FileSystem.humanSize(1536);     // '1.5 KB'
FileSystem.humanSize(1048576);  // '1 MB'
```

---

### Util

General utilities.

```javascript
import { Util } from '@aegis-framework/artemis';

// Generate UUID v4
const id = Util.uuid();  // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

// Ensure async execution
await Util.callAsync(someFunction, context, arg1, arg2);

// Debounce (delay until quiet period)
const debouncedSearch = Util.debounce((query) => {
  fetch(`/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Throttle (limit call frequency, leading edge only)
const throttledScroll = Util.throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);
```

---

### Debug

Conditional console logging with debug levels. All console methods are gated behind a configurable level so debug output can be silenced in production.

```javascript
import { Debug, DebugLevel } from '@aegis-framework/artemis';

// Set debug level
Debug.setLevel(DebugLevel.DEBUG);  // Show all logs
Debug.setLevel(DebugLevel.ERROR);  // Only errors
Debug.setLevel(DebugLevel.NONE);   // Silent

// Levels: NONE (0) < ERROR (1) < WARNING (2) < INFO (3) < DEBUG (4) < ALL (5)

// Alternative getter/setter
Debug.level(DebugLevel.INFO);     // Set level, returns current
const current = Debug.level();    // Get current level
const level = Debug.currentLevel; // Getter for current level

// Logging (respects debug level)
Debug.log('General log');      // DEBUG+
Debug.debug('Debug info');     // DEBUG+
Debug.info('Information');     // INFO+
Debug.warning('Warning!');     // WARNING+
Debug.warn('Also warning');    // WARNING+ (alias)
Debug.error('Error!');         // ERROR+

// Assertions (ERROR+)
Debug.assert(value > 0, 'Value must be positive');

// Stack trace (DEBUG+)
Debug.trace('Trace point');

// Grouping (DEBUG+)
Debug.group('Network requests');
Debug.log('Request 1');
Debug.log('Request 2');
Debug.groupEnd();

Debug.groupCollapsed('Collapsed group');
Debug.log('Hidden by default');
Debug.groupEnd();

// Tables (DEBUG+)
Debug.table([{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]);

// Timing (DEBUG+)
Debug.time('Operation');
// ... do work ...
Debug.timeLog('Operation', 'still running...');
// ... more work ...
Debug.timeEnd('Operation');  // Logs: Operation: 123.45ms

// Counting (DEBUG+)
Debug.count('myFunction called');  // myFunction called: 1
Debug.count('myFunction called');  // myFunction called: 2
Debug.countReset('myFunction called');

// Object inspection (DEBUG+)
Debug.dir(complexObject);
Debug.dirxml(htmlElement);

// Clear console (DEBUG+)
Debug.clear();

// Check level before expensive operations
if (Debug.isEnabled(DebugLevel.DEBUG)) {
  Debug.log(JSON.stringify(largeObject));
}

// Format strings (no level check, pure utility)
const msg = Debug.format('User %s has %d items: %j', 'Alice', 3, ['a', 'b']);
// 'User Alice has 3 items: ["a","b"]'
// Supports: %s (string), %d/%i (integer), %o/%O (JSON), %j (JSON), %c (ignored), %% (literal %)
```

---

### Preload

Asset preloading utilities for images, audio, fonts, stylesheets, scripts, and generic files.

```javascript
import { Preload } from '@aegis-framework/artemis';

// Preload and decode a single image (ready to render without delay)
const img = await Preload.image('/assets/hero.jpg');
document.body.appendChild(img);

// Preload multiple images in parallel
const images = await Preload.images([
  '/assets/1.jpg',
  '/assets/2.jpg',
  '/assets/3.jpg'
]);

// Preload and decode audio into an AudioBuffer
const audioCtx = new AudioContext();
const buffer = await Preload.audio('/sounds/click.mp3', audioCtx);

// Without providing a context (a temporary one is created and closed automatically)
const buffer2 = await Preload.audio('/sounds/alert.mp3');

// Preload multiple audio files (shares a single AudioContext for efficiency)
const buffers = await Preload.audios(
  ['/sounds/a.mp3', '/sounds/b.mp3'],
  audioCtx
);

// Preload generic files with fetch priority hint
await Preload.file('/data/config.json', 'high');
await Preload.files(['/a.js', '/b.js'], 'low');

// Preload specific asset types (preloads only, does not apply/execute)
await Preload.stylesheet('/styles/main.css');
await Preload.script('/js/vendor.js');
await Preload.font('/fonts/custom.woff2');          // crossOrigin: true by default
await Preload.font('/fonts/local.woff2', false);    // No crossOrigin

// Cache API integration
const isCached = await Preload.isCached('my-cache', '/assets/image.jpg');
await Preload.addToCache('my-cache', '/assets/image.jpg');
await Preload.addAllToCache('my-cache', ['/a.js', '/b.js', '/c.css']);
```

---

## TypeScript Support

Artemis is written in TypeScript and includes full type definitions.

```typescript
import {
  // DOM
  $_, $_ready, $_create,
  DOM,

  // Storage
  Space, SpaceAdapter,
  LocalStorage, SessionStorage, IndexedDB, RemoteStorage,

  // Storage errors
  LocalStorageKeyNotFoundError,
  IndexedDBKeyNotFoundError,
  RemoteStorageKeyNotFoundError,

  // HTTP
  Request, RequestError, RequestTimeoutError,

  // Utilities
  Platform, Text, FileSystem, Form, Util,
  Debug, DebugLevel,
  Preload
} from '@aegis-framework/artemis';

// Type imports
import type {
  // DOM types
  DOMSelector, DOMOffset, StyleProperties,
  EventCallback, ElementCallback,

  // Storage types
  SpaceConfiguration, StorageValue, KeyValueResult,
  UpgradeCallback, SpaceAdapterType, SpaceAdapterConstructor,
  SpaceCallback, Transformation, TransformationFunction,

  // Request types
  RequestData, RequestOptions,

  // Platform types
  DesktopPlatform, MobilePlatform, Orientation,

  // Form types
  FormValue, FormValues, FormParseOptions,

  // FileSystem types
  FileReadType, FileReadResult,

  // Text types
  CapitalizeOptions,

  // Util types
  Callable
} from '@aegis-framework/artemis';
```

## License

MIT License - See [LICENSE](LICENSE) for details.
