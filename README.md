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

  // Create new elements
  const div = $_create('div', { class: 'container', id: 'main' });

  // Traversal
  $_('.item').parent().addClass('has-item');
  $_('.item').siblings().removeClass('active');
  $_('.item').next().addClass('following');

  // Animations
  $_('#box').fadeOut(400, () => console.log('Hidden'));
  $_('#box').fadeIn(400, () => console.log('Visible'));
  $_('#box').animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }],
    { duration: 300, fill: 'forwards' }
  );
});
```

#### Key Methods

| Method | Description |
|--------|-------------|
| `addClass(name)` | Add a class |
| `removeClass(name?)` | Remove class(es) |
| `toggleClass(names)` | Toggle space-separated classes |
| `hasClass(name)` | Check if all elements have class |
| `text(value?)` | Get/set text content |
| `html(value?)` | Get/set HTML content |
| `value(value?)` | Get/set form element value |
| `attribute(name, value?)` | Get/set attribute |
| `data(name, value?)` | Get/set data attributes |
| `style(prop, value?)` | Get/set inline styles |
| `on(event, callback)` | Add event listener |
| `off(event, callback)` | Remove event listener |
| `trigger(event, detail?)` | Dispatch custom event |
| `find(selector)` | Find descendants |
| `closest(selector)` | Find closest ancestor |
| `parent()` | Get parent elements |
| `parents()` | Get all ancestors |
| `children()` | Get child elements |
| `siblings()` | Get sibling elements |
| `next()` | Get next sibling |
| `prev()` | Get previous sibling |
| `first()` | Get first element |
| `last()` | Get last element |
| `eq(index)` | Get element at index |
| `append(content)` | Append content |
| `prepend(content)` | Prepend content |
| `remove()` | Remove elements |
| `empty()` | Clear children |
| `clone(deep?)` | Clone elements |
| `fadeIn(duration, callback?)` | Fade in animation |
| `fadeOut(duration, callback?)` | Fade out animation |
| `animate(keyframes, options)` | Web Animations API |

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

// Iterate
await storage.each((key, value) => {
  console.log(key, value);
});

// Check existence
await storage.contains('user'); // Resolves if exists, rejects if not

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
```

#### Adapters

**LocalStorage** - Persistent browser storage
```javascript
new Space(SpaceAdapter.LocalStorage, { name: 'App', version: '1.0.0' });
```

**SessionStorage** - Session-only storage
```javascript
new Space(SpaceAdapter.SessionStorage, { name: 'App', version: '1.0.0' });
```

**IndexedDB** - Large-scale structured storage
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

// HEAD request (check if resource exists)
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
  } else if (error instanceof RequestTimeoutError) {
    console.log('Request timed out');
  }
}

// Serialize data to query string
const query = Request.serialize({ name: 'John', tags: ['a', 'b'] });
```

---

### Form

Form filling and value retrieval utilities.

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
  parseNumbers: true,  // Parse number inputs as numbers
  parseBooleans: true  // Parse single checkboxes as booleans
});
// { username: 'john_doe', email: '...', age: 30, newsletter: true, country: 'us' }

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

Platform and feature detection.

```javascript
import { Platform } from '@aegis-framework/artemis';

// Device type
Platform.desktop();           // true if desktop
Platform.desktop('macOS');    // true if macOS
Platform.desktop('Windows');  // true if Windows
Platform.desktop('Linux');    // true if Linux

Platform.mobile();            // true if any mobile
Platform.mobile('iOS');       // true if iPhone/iPod
Platform.mobile('iPadOS');    // true if iPad
Platform.mobile('Android');   // true if Android

// Display
Platform.orientation;    // 'portrait' | 'landscape'
Platform.portrait;       // true if portrait
Platform.landscape;      // true if landscape
Platform.retina;         // true if high DPI display

// Input
Platform.touch;          // true if touch supported
Platform.canHover;       // true if hover supported
Platform.coarsePointer;  // true if touch is primary
Platform.finePointer;    // true if mouse is primary

// User preferences
Platform.darkMode;       // true if dark mode preferred
Platform.reducedMotion;  // true if reduced motion preferred

// Runtime environment
Platform.electron;       // true if Electron
Platform.cordova;        // true if Cordova/PhoneGap
Platform.standalone;     // true if installed PWA

// Features
Platform.serviceWorkers; // true if service workers supported
```

---

### Text

Text transformation utilities.

```javascript
import { Text } from '@aegis-framework/artemis';

// Capitalize words
Text.capitalize('hello world');                    // 'Hello World'
Text.capitalize('API docs', { preserveCase: true }); // 'API Docs'

// URL-friendly slug
Text.friendly('Hello World!');  // 'hello-world'
Text.friendly('Café Münich');   // 'cafe-munich'

// Truncate with ellipsis
Text.truncate('Long text here', 10);        // 'Long te...'
Text.truncate('Long text', 10, '…');        // 'Long text'

// Extract parts
Text.prefix('@', 'user@example.com');  // 'user'
Text.suffix('@', 'user@example.com');  // 'example.com'

// Check for blank
Text.isBlank('');      // true
Text.isBlank('  ');    // true
Text.isBlank(null);    // true
Text.isBlank('text');  // false

// Get selected text
const selected = Text.selection();
```

---

### FileSystem

File operations and utilities.

```javascript
import { FileSystem } from '@aegis-framework/artemis';

// Read local file
const text = await FileSystem.read(file, 'text');
const base64 = await FileSystem.read(file, 'base64');
const buffer = await FileSystem.read(file, 'buffer');
const binary = await FileSystem.read(file, 'binary');

// Read remote file
const content = await FileSystem.readRemote('https://example.com/file.txt', 'text');

// Create and download file
const file = FileSystem.create('data.json', JSON.stringify(data), 'application/json');
FileSystem.download(file);
FileSystem.download(blob, 'custom-name.txt');

// File type checks
FileSystem.isImage('photo.jpg');   // true
FileSystem.isVideo('movie.mp4');   // true
FileSystem.isAudio('song.mp3');    // true
FileSystem.extension('file.txt');  // 'txt'

// Human-readable size
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

// Throttle (limit call frequency)
const throttledScroll = Util.throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);
```

---

### Debug

Conditional console logging with debug levels.

```javascript
import { Debug, DebugLevel } from '@aegis-framework/artemis';

// Set debug level
Debug.setLevel(DebugLevel.DEBUG);  // Show all logs
Debug.setLevel(DebugLevel.ERROR);  // Only errors
Debug.setLevel(DebugLevel.NONE);   // Silent

// Levels: NONE < ERROR < WARNING < INFO < DEBUG < ALL

// Logging (respects debug level)
Debug.log('General log');      // DEBUG+
Debug.debug('Debug info');     // DEBUG+
Debug.info('Information');     // INFO+
Debug.warning('Warning!');     // WARNING+
Debug.warn('Also warning');    // WARNING+
Debug.error('Error!');         // ERROR+

// Assertions
Debug.assert(value > 0, 'Value must be positive');

// Grouping
Debug.group('Network requests');
Debug.log('Request 1');
Debug.log('Request 2');
Debug.groupEnd();

Debug.groupCollapsed('Collapsed group');
Debug.log('Hidden by default');
Debug.groupEnd();

// Tables
Debug.table([{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]);

// Timing
Debug.time('Operation');
// ... do work ...
Debug.timeLog('Operation', 'still running...');
// ... more work ...
Debug.timeEnd('Operation');  // Logs: Operation: 123.45ms

// Counting
Debug.count('myFunction called');  // myFunction called: 1
Debug.count('myFunction called');  // myFunction called: 2
Debug.countReset('myFunction called');

// Object inspection
Debug.dir(complexObject);
Debug.dirxml(htmlElement);

// Clear console
Debug.clear();

// Check level
if (Debug.isEnabled(DebugLevel.DEBUG)) {
  // Expensive debug operation
}
```

---

### Preload

Asset preloading utilities.

```javascript
import { Preload } from '@aegis-framework/artemis';

// Preload single image
const img = await Preload.image('/assets/hero.jpg');
document.body.appendChild(img);

// Preload multiple images
const images = await Preload.images([
  '/assets/1.jpg',
  '/assets/2.jpg',
  '/assets/3.jpg'
]);

// Preload files with priority hint
await Preload.file('/data/config.json', 'high');
await Preload.files(['/a.js', '/b.js'], 'low');

// Preload specific asset types
await Preload.stylesheet('/styles/main.css');
await Preload.script('/js/vendor.js');
await Preload.font('/fonts/custom.woff2');

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
  $_,
  DOM,
  Space,
  SpaceAdapter,
  Request,
  Platform,
  Text,
  FileSystem,
  Form,
  Util,
  Debug,
  DebugLevel,
  Preload
} from '@aegis-framework/artemis';

import type {
  SpaceConfiguration,
  DesktopPlatform,
  MobilePlatform,
  Orientation,
  FileReadType,
  CapitalizeOptions
} from '@aegis-framework/artemis';

const config: SpaceConfiguration = {
  name: 'MyApp',
  version: '1.0.0'
};

const storage = new Space(SpaceAdapter.LocalStorage, config);
```

## License

MIT License - See [LICENSE](LICENSE) for details.
