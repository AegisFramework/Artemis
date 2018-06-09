## Classes

<dl>
<dt><a href="#Form">Form</a></dt>
<dd><p>Utility class that provides simple function for filling and retrieving values
from froms. This class requires the use of the <code>data-form</code> attribute.</p>
</dd>
<dt><a href="#Platform">Platform</a></dt>
<dd><p>General checks for what kind of platform is the being used to run the app.</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd><p>Simple Wrapper for the XMLHttpRequest object. This class will be removed as
soon as fetch gets more widely adopted.</p>
</dd>
<dt><a href="#Space">Space</a></dt>
<dd><p>Space provides a simple wrapper for different Storage approaches. It aims to
provide data independence through storage namespaces and versioning, allowing
transparent data formatting and content modifications through versions.</p>
</dd>
<dt><a href="#Text">Text</a></dt>
<dd><p>Provides utility functions for texts</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#$_">$_(selector)</a> ⇒ <code>Artemis</code></dt>
<dd><p>Simple wrapper function to use the Artemis DOM library</p>
</dd>
<dt><a href="#$_ready">$_ready(callback)</a></dt>
<dd><p>Utility function to attach the &#39;load&#39; listener to the window</p>
</dd>
<dt><a href="#$_">$_(selector)</a> ⇒ <code>Artemis</code></dt>
<dd><p>Simple wrapper function to use the Artemis DOM library</p>
</dd>
<dt><a href="#$_ready">$_ready(callback)</a></dt>
<dd><p>Utility function to attach the &#39;load&#39; listener to the window</p>
</dd>
</dl>

<a name="Form"></a>

## Form
Utility class that provides simple function for filling and retrieving values
from froms. This class requires the use of the `data-form` attribute.

**Kind**: global class  

* [Form](#Form)
    * [.fill(name, data)](#Form.fill)
    * [.values(name)](#Form.values) ⇒ <code>Object</code>

<a name="Form.fill"></a>

### Form.fill(name, data)
**Kind**: static method of [<code>Form</code>](#Form)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Form name. Must match the `data-form` attribute of the Form. |
| data | <code>Object</code> | JSON object with key-value pairs to fill the inputs. |

<a name="Form.values"></a>

### Form.values(name) ⇒ <code>Object</code>
**Kind**: static method of [<code>Form</code>](#Form)  
**Returns**: <code>Object</code> - - Key-value JSON object  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Form name. Must match the `data-form` attribute of the Form. |

<a name="Platform"></a>

## Platform
General checks for what kind of platform is the being used to run the app.

**Kind**: global class  

* [Platform](#Platform)
    * [.retina()](#Platform.retina) ⇒ <code>boolean</code>
    * [.portrait()](#Platform.portrait) ⇒ <code>boolean</code>
    * [.landscape()](#Platform.landscape) ⇒ <code>boolean</code>
    * [.orientation()](#Platform.orientation) ⇒ <code>string</code>
    * [.electron()](#Platform.electron) ⇒ <code>boolean</code>
    * [.cordova()](#Platform.cordova) ⇒ <code>boolean</code>
    * [.desktop()](#Platform.desktop) ⇒ <code>boolean</code>
    * [.mobile([platform])](#Platform.mobile) ⇒ <code>boolean</code>

<a name="Platform.retina"></a>

### Platform.retina() ⇒ <code>boolean</code>
Check if the screen has a retina pixel ratio

**Kind**: static method of [<code>Platform</code>](#Platform)  
<a name="Platform.portrait"></a>

### Platform.portrait() ⇒ <code>boolean</code>
Check if the device is on portrait orientation

**Kind**: static method of [<code>Platform</code>](#Platform)  
<a name="Platform.landscape"></a>

### Platform.landscape() ⇒ <code>boolean</code>
Check if the device is on landscape orientation

**Kind**: static method of [<code>Platform</code>](#Platform)  
<a name="Platform.orientation"></a>

### Platform.orientation() ⇒ <code>string</code>
Get device Orientation

**Kind**: static method of [<code>Platform</code>](#Platform)  
**Returns**: <code>string</code> - portrait | landscape  
<a name="Platform.electron"></a>

### Platform.electron() ⇒ <code>boolean</code>
Check if the app is running over Electron

**Kind**: static method of [<code>Platform</code>](#Platform)  
<a name="Platform.cordova"></a>

### Platform.cordova() ⇒ <code>boolean</code>
Check if the app is running over Cordova

**Kind**: static method of [<code>Platform</code>](#Platform)  
<a name="Platform.desktop"></a>

### Platform.desktop() ⇒ <code>boolean</code>
Check if the app is running in a desktop platform

**Kind**: static method of [<code>Platform</code>](#Platform)  
<a name="Platform.mobile"></a>

### Platform.mobile([platform]) ⇒ <code>boolean</code>
Check if the app is running in a mobile platform

**Kind**: static method of [<code>Platform</code>](#Platform)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [platform] | <code>string</code> | <code>&quot;&#x27;Any&#x27;&quot;</code> | Check for a specific mobile platform [Android | iOS | Opera | Windows | BlackBerry | Any] |

<a name="Request"></a>

## Request
Simple Wrapper for the XMLHttpRequest object. This class will be removed as
soon as fetch gets more widely adopted.

**Kind**: global class  

* [Request](#Request)
    * [.get(url, data, [responseType])](#Request.get) ⇒ <code>Promise</code>
    * [.post(url, data, responseType, contentType)](#Request.post) ⇒ <code>Promise</code>
    * [.json(url)](#Request.json) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="Request.get"></a>

### Request.get(url, data, [responseType]) ⇒ <code>Promise</code>
**Kind**: static method of [<code>Request</code>](#Request)  
**Returns**: <code>Promise</code> - - Resolves to the data received from the request  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | URL to make the request |
| data | <code>Object</code> |  | Parameters to send in the URL, represented as a JSON object |
| [responseType] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Response Type header value |

<a name="Request.post"></a>

### Request.post(url, data, responseType, contentType) ⇒ <code>Promise</code>
**Kind**: static method of [<code>Request</code>](#Request)  
**Returns**: <code>Promise</code> - - Resolves to the data received from the request  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | URL to make the request |
| data | <code>Object</code> |  | Key-value pairs to send in the request |
| responseType | <code>string</code> |  | = '' - Response Type header value |
| contentType | <code>type</code> | <code>application/x-www-form-urlencoded</code> | = 'application/x-www-form-urlencoded' - Content Type Header value |

<a name="Request.json"></a>

### Request.json(url) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: static method of [<code>Request</code>](#Request)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the retrieved JSON  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL to request the JSON from |

<a name="Space"></a>

## Space
Space provides a simple wrapper for different Storage approaches. It aims to
provide data independence through storage namespaces and versioning, allowing
transparent data formatting and content modifications through versions.

**Kind**: global class  

* [Space](#Space)
    * [new exports.Space([name], [version], [type])](#new_Space_new)
    * [.open([create])](#Space+open) ⇒ <code>Promise</code>
    * [.set(key, value)](#Space+set) ⇒ <code>Promise</code>
    * [.get(key)](#Space+get) ⇒ <code>Promise.&lt;Object&gt;</code> \| <code>Promise.&lt;string&gt;</code> \| <code>Promise.&lt;Number&gt;</code>
    * [.upgrade(oldVersion, newVersion, callback)](#Space+upgrade) ⇒ <code>Promise</code>
    * [.rename(name)](#Space+rename) ⇒ <code>Promise</code>
    * [.onStore(callback)](#Space+onStore)
    * [.onDelete(callback)](#Space+onDelete)
    * [.key(index, [full])](#Space+key) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.keys([full])](#Space+keys) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.remove(key)](#Space+remove) ⇒ <code>Promise.&lt;key, value&gt;</code>
    * [.clear()](#Space+clear) ⇒ <code>Promise</code>

<a name="new_Space_new"></a>

### new exports.Space([name], [version], [type])
Create a new Space Object. If no name and version is defined, the global LocalSpace space is used.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Space Space Name. If name is empty, the |
| [version] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Space Space Version. Must be a numeric string i.e. '0.1.0' |
| [type] | <code>Space.Type</code> | <code>Space.Type.Local</code> | Space Space Type. Determines what storage engine will be used. |

<a name="Space+open"></a>

### space.open([create]) ⇒ <code>Promise</code>
Open the Storage Object to be used depending on the Space.Type

**Kind**: instance method of [<code>Space</code>](#Space)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [create] | <code>function</code> | <code></code> | Callback for database creation when using an Space.Type.Indexed |

<a name="Space+set"></a>

### space.set(key, value) ⇒ <code>Promise</code>
Store a key-value pair

**Kind**: instance method of [<code>Space</code>](#Space)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key with which this value will be saved |
| value | <code>Object</code> \| <code>string</code> \| <code>Number</code> | Value to save |

<a name="Space+get"></a>

### space.get(key) ⇒ <code>Promise.&lt;Object&gt;</code> \| <code>Promise.&lt;string&gt;</code> \| <code>Promise.&lt;Number&gt;</code>
Retrieves a value from storage given it's key

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise.&lt;Object&gt;</code> \| <code>Promise.&lt;string&gt;</code> \| <code>Promise.&lt;Number&gt;</code> - - Resolves to the retreived value  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key with which the value was saved |

<a name="Space+upgrade"></a>

### space.upgrade(oldVersion, newVersion, callback) ⇒ <code>Promise</code>
Upgrade a Space Version

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise</code> - Result of the upgrade operation  

| Param | Type | Description |
| --- | --- | --- |
| oldVersion | <code>string</code> | The version of the storage to be upgraded |
| newVersion | <code>string</code> | The version to be upgraded to |
| callback | <code>function</code> | Function to transform the old stored values to the new version's format |

<a name="Space+rename"></a>

### space.rename(name) ⇒ <code>Promise</code>
Rename a Space

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise</code> - Result of the rename operation  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | New name to be used. |

<a name="Space+onStore"></a>

### space.onStore(callback)
Set the callback function to be run every time a value is stored.

**Kind**: instance method of [<code>Space</code>](#Space)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback Function. Key and Value pair will be sent as parameters when run. |

<a name="Space+onDelete"></a>

### space.onDelete(callback)
Set the callback function to be run every time a value is deleted.

**Kind**: instance method of [<code>Space</code>](#Space)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback Function. Key and Value pair will be sent as parameters when run. |

<a name="Space+key"></a>

### space.key(index, [full]) ⇒ <code>Promise.&lt;string&gt;</code>
Get the key that corresponds to a given index in the storage

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise.&lt;string&gt;</code> - - Resolves to the key's name  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>Number</code> |  | Index to get the key from |
| [full] | <code>boolean</code> | <code>false</code> | Whether to return the full key name including space id or just the key name |

<a name="Space+keys"></a>

### space.keys([full]) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Return all keys stored in the space.

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - - Array of keys  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [full] | <code>boolean</code> | <code>false</code> | Whether to return the full key name including space id or just the key name |

<a name="Space+remove"></a>

### space.remove(key) ⇒ <code>Promise.&lt;key, value&gt;</code>
Delete a value from the space given it's key

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise.&lt;key, value&gt;</code> - - Resolves to the key and value of the deleted object  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key of the item to delete |

<a name="Space+clear"></a>

### space.clear() ⇒ <code>Promise</code>
Clear the entire space

**Kind**: instance method of [<code>Space</code>](#Space)  
**Returns**: <code>Promise</code> - - Result of the clear operation  
<a name="Text"></a>

## Text
Provides utility functions for texts

**Kind**: global class  

* [Text](#Text)
    * [.capitalize(text)](#Text.capitalize) ⇒ <code>string</code>
    * [.suffix(key, text)](#Text.suffix) ⇒ <code>string</code>
    * [.prefix(key, text)](#Text.prefix) ⇒ <code>string</code>
    * [.friendly(text)](#Text.friendly) ⇒ <code>string</code>

<a name="Text.capitalize"></a>

### Text.capitalize(text) ⇒ <code>string</code>
**Kind**: static method of [<code>Text</code>](#Text)  
**Returns**: <code>string</code> - - Capitalized string  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text string to capitalize |

<a name="Text.suffix"></a>

### Text.suffix(key, text) ⇒ <code>string</code>
**Kind**: static method of [<code>Text</code>](#Text)  
**Returns**: <code>string</code> - - Suffix  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key part of the string |
| text | <code>string</code> | Full string to extract the suffix from |

<a name="Text.prefix"></a>

### Text.prefix(key, text) ⇒ <code>string</code>
**Kind**: static method of [<code>Text</code>](#Text)  
**Returns**: <code>string</code> - - Prefix  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key part of the string |
| text | <code>string</code> | Full string to extract the prefix from |

<a name="Text.friendly"></a>

### Text.friendly(text) ⇒ <code>string</code>
**Kind**: static method of [<code>Text</code>](#Text)  
**Returns**: <code>string</code> - - Friendly URL  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The text to build the url from |

<a name="$_"></a>

## $_(selector) ⇒ <code>Artemis</code>
Simple wrapper function to use the Artemis DOM library

**Kind**: global function  
**Returns**: <code>Artemis</code> - - Artemis instance or class if no selector is used  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> \| <code>Object</code> \| <code>array</code> | Selector or DOM element to use |

<a name="$_ready"></a>

## $_ready(callback)
Utility function to attach the 'load' listener to the window

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function to run when the window is ready |

<a name="$_"></a>

## $_(selector) ⇒ <code>Artemis</code>
Simple wrapper function to use the Artemis DOM library

**Kind**: global function  
**Returns**: <code>Artemis</code> - - Artemis instance or class if no selector is used  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> \| <code>Object</code> \| <code>array</code> | Selector or DOM element to use |

<a name="$_ready"></a>

## $_ready(callback)
Utility function to attach the 'load' listener to the window

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function to run when the window is ready |

