/* global require */
const { Text, Util, Debug, DebugLevel } = require('./../dist/artemis.js');

// Enable debug logging
Debug.setLevel(DebugLevel.DEBUG);

Debug.group('Text Tests');
Debug.log('capitalize:', Text.capitalize('hello world'));
Debug.log('capitalize (preserveCase):', Text.capitalize('API docs', { preserveCase: true }));
Debug.log('friendly:', Text.friendly('Hello World!'));
Debug.log('truncate:', Text.truncate('This is a long text', 12));
Debug.log('isBlank(""):', Text.isBlank(''));
Debug.log('isBlank("text"):', Text.isBlank('text'));
Debug.log('prefix:', Text.prefix('@', 'user@example.com'));
Debug.log('suffix:', Text.suffix('@', 'user@example.com'));
Debug.groupEnd();

Debug.group('Util Tests');
Debug.log('uuid:', Util.uuid());
Debug.log('uuid:', Util.uuid());

// Test callAsync
Util.callAsync(() => 'sync result', null).then(result => {
  Debug.log('callAsync (sync):', result);
});

Util.callAsync(async () => 'async result', null).then(result => {
  Debug.log('callAsync (async):', result);
});

// Test debounce exists
Debug.log('debounce exists:', typeof Util.debounce === 'function');
Debug.log('throttle exists:', typeof Util.throttle === 'function');
Debug.groupEnd();

Debug.group('Debug Tests');
Debug.log('This is a log message');
Debug.info('This is an info message');
Debug.warning('This is a warning message');

Debug.time('Timer test');
setTimeout(() => {
  Debug.timeEnd('Timer test');
}, 50);

Debug.count('counter');
Debug.count('counter');
Debug.count('counter');
Debug.log('Count should be 3');

Debug.table([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
]);
Debug.groupEnd();

Debug.log('');
Debug.log('All Node.js tests completed!');
