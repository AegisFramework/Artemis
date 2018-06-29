/**
* ==============================
* Local Storage Adapter
* ==============================
*/

/**
 * The Local Storage Adapter provides the Space Class the ability to interact
 * with the localStorage api found in most modern browsers.
 *
 * @class
 */
export class IndexedDB {

	/**
	 * Create a new LocalStorage. If no configuration is provided, the LocalStorage
	 * global object is used.
	 *
	 * @constructor
	 * @param {object} [configuration={name = '', version = '', store = ''}] - Configuration Object for the Adapter
	 * @param {string} configuration.name - Name of the Space
	 * @param {string} configuration.version - Version of the Space in Semantic versioning syntax
	 * @param {string} configuration.store - Name of the Object Store to use
	 *
	 */
	constructor ({name = '', version = '', store = '', schema = {}, props = {}, index = {}}) {
		this.name = name;
		this.version = version;
		this.store = store;
		this.schema = schema;
		this.props = props;
		this.index = index;

		this.upgrades = {};

		if (this.version === '') {
			this.numericVersion = 0;
		} else {
			this.numericVersion = parseInt (version.replace (/\./g, ''));
		}
	}

	/**
	 * Open the Storage Object
	 *
	 * @return {Promise}
	 */
	open () {

		if (this.name === '') {
			console.error ('No name has been defined for IndexedDB space.');
			return Promise.reject ();
		}

		if (this.store === '') {
			console.error ('No store has been defined for IndexedDB space.');
			return Promise.reject ();
		}

		if (this.storage instanceof IDBDatabase) {
			return Promise.resolve (this);
		} else if (this.storage instanceof Promise) {
			return this.storage;
		} else {
			this.storage = new Promise ((resolve, reject) => {
				const storage = window.indexedDB.open (this.name, this.numericVersion);

				storage.onerror = (event) => {
					reject (event);
				};

				storage.onsuccess = (event) => {
					resolve (event.target.result);
				};

				storage.onupgradeneeded = (event) => {
					if (event.oldVersion < 1) {
						const store = event.target.result.createObjectStore (this.store, this.props);
						for (const index of Object.keys (this.index)) {
							store.createIndex (this.index[index].name, this.index[index].field, this.index[index].props);
						}
					} else if (typeof this.upgrades[event.newVersion] === 'function') {
						this.upgrades[event.newVersion].call (this, event);
					}
					const transaction = event.target.transaction;
					transaction.addEventListener ('success', () => {
						resolve (event.target.result);
					});
				};
			}).then ((storage) => {
				this.storage = storage;
				return Promise.resolve (this);
			});
			return this.storage;
		}
	}

	/**
	 * Store a key-value pair
	 *
	 * @param  {string} key - Key with which this value will be saved
	 * @param  {Object|string|Number} - Value to save
	 * @return {Promise}
	 */
	set (key = null, value) {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				let op;
				if (key !== null) {
					op = transaction.put (Object.assign ({}, {id: key}, value));
				} else {
					op = transaction.add (value);
				}

				op.addEventListener ('success', () => {resolve (value);});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}

	update (key, value) {
		return this.get (key).then ((currentValue) => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				const op = transaction.put (Object.assign ({}, currentValue, value));
				op.addEventListener ('success', () => {resolve (value);});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}



	/**
	 * Retrieves a value from storage given it's key
	 *
	 * @param  {string} - Key with which the value was saved
	 * @return {Promise<Object>|Promise<string>|Promise<Number>} - Resolves to the retreived value
	 * or its rejected if it doesn't exist
	 */
	get (key) {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store).objectStore (this.store);
				const op = transaction.get (key);

				op.addEventListener ('success', (event) => {resolve (event.target.result);});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}

	getAll () {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store).objectStore (this.store);
				const op = transaction.getAll ();

				op.addEventListener ('success', (event) => {resolve (event.target.result);});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}

	/**
	 * Check if a space contains a given key.
	 *
	 * @param  {string} key - Key to look for.
	 * @return {Promise} Promise gets resolved if it exists and rejected if
	 * doesn't
	 */
	contains (key) {
		return this.keys ().then ((keys) => {
			if (keys.includes (key)) {
				Promise.resolve ();
			} else {
				return Promise.reject ();
			}
		});
	}

	/**
	 * Upgrade a Space Version
	 * @param oldVersion {string} - The version of the storage to be upgraded
	 * @param newVersion {string} - The version to be upgraded to
	 * @param callback {function} - Function to transform the old stored values to the new version's format
	 * @returns {Promise} Result of the upgrade operation
	 */
	upgrade (newVersion, callback) {
		this.upgrades[parseInt (newVersion.replace (/\./g, ''))] = callback;
		return Promise.resolve ();
	}

	/**
	 * Rename a Space
	 * @param name {string} - New name to be used.
	 * @returns {Promise} Result of the rename operation
	 */
	rename () {
		return Promise.reject ();
	}

	/**
	 * Get the key that corresponds to a given index in the storage
	 *
	 * @param  {Number} index - Index to get the key from
	 * @param  {boolean} [full=false] - Whether to return the full key name including space id or just the key name
	 * @return {Promise<string>} - Resolves to the key's name
	 */
	key (index, full = false) {
		return this.open ().then (() => {
			if (full === true) {
				return Promise.resolve (this.storage.key (index));
			} else {
				return Promise.resolve (this.storage.key (index).replace (this.id, ''));
			}
		});
	}

	/**
	 * Return all keys stored in the space.
	 *
	 * @param {boolean} [full=false] - Whether to return the full key name including space id or just the key name
	 * @return {Promise<string[]>}  - Array of keys
	 */
	keys () {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				const op = transaction.keys ();
				op.addEventListener ('success', (event) => {resolve (event.target.result);}, false);
				op.addEventListener ('error', (event) => {reject (event);}, false);
			});
		});
	}


	/**
	 * Delete a value from the space given it's key
	 *
	 * @param  {string} key - Key of the item to delete
	 * @return {Promise<key, value>} - Resolves to the key and value of the deleted object
	 */
	remove (key) {
		return this.get (key).then ((value) => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				const op = transaction.delete (key);
				op.addEventListener ('success', () => {resolve (value);}, false);
				op.addEventListener ('error', (event) => {reject (event);}, false);
			});
		});
	}

	/**
	 * Clear the entire space
	 *
	 * @return {Promise} - Result of the clear operation
	 */
	clear () {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				const op = transaction.clear ();
				op.addEventListener ('success', () => {resolve ();}, false);
				op.addEventListener ('error', (event) => {reject (event);}, false);
			});
		});
	}
}