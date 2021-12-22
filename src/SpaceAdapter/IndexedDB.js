/**
* ==============================
* IndexedDB Adapter
* ==============================
*/

/**
 * The IndexedDB Adapter provides the Space Class the ability to interact
 * with the IndexedDB API found in most modern browsers.
 *
 * @class
 */
export class IndexedDB {

	/**
	 * Create a new IndexedDB. Differently from Local and Session Storages, the
	 * IndexedDB Adapter requires a mandatory name, version and store name.
	 *
	 * @constructor
	 * @param {Object} [configuration={name = '', version = '', store = '', props = {}, index = {}}] - Configuration Object for the Adapter
	 * @param {string} configuration.name - Name of the Space
	 * @param {string} configuration.version - Version of the Space in Semantic versioning syntax
	 * @param {string} configuration.store - Name of the Object Store to use
	 * @param {Object} configuration.props - Optional Parameters for the Object Store
	 * @param {Object} configuration.index - Object of the indexes to declare for
	 * the  Object Store. Each index is a JSON object with the following properties:
	 * @param {String} configuration.index[...].name - Name for the Index
	 * @param {String} configuration.index[...].field - Field on the store to apply the index to
	 * @param {Object} configuration.index[...].props - Index properties object
	 */
	constructor ({name = '', version = '', store = '', props = {}, index = {}}) {
		this.name = name;
		this.version = version;
		this.store = store;
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
				let upgradesToApply = [];
				const storage = window.indexedDB.open (this.name, this.numericVersion);

				storage.onerror = (event) => {
					reject (event);
				};

				storage.onsuccess = (event) => {
					resolve ({ storage: event.target.result, upgrades: upgradesToApply });
				};

				storage.onupgradeneeded = (event) => {
					// If the previous version is less than one, it means that
					// the database needs to be created first
					if (event.oldVersion < 1) {
						// Create all the needed Stores
						const store = event.target.result.createObjectStore (this.store, this.props);
						for (const index of Object.keys (this.index)) {
							store.createIndex (this.index[index].name, this.index[index].field, this.index[index].props);
						}
					} else {
						// Check what upgrade functions have been declared in their respective order
						const availableUpgrades = Object.keys (this.upgrades).sort ();

						// Find the first update that needs to be applied to the database given
						// the old version it currently has.
						const startFrom = availableUpgrades.findIndex (u => {
							const [old, ] = u.split ('::');
							return parseInt (old) === event.oldVersion;
						});

						if (startFrom > -1) {
							upgradesToApply = availableUpgrades.slice (startFrom).filter ((u) => {
								const [old, next] = u.split ('::');
								return parseInt (old) < this.numericVersion && parseInt (next) <= this.numericVersion;
							});
						}
					}

					// Once the transaction is done, resolve the storage object
					const transaction = event.target.transaction;
					transaction.addEventListener ('success', () => {
						resolve ({ storage: event.target.result, upgrades: upgradesToApply });
					});
				};
			}).then (({ storage, upgrades }) => {
				this.storage = storage;
				return new Promise ((resolve) => {
					const res = () => resolve (storage);
					this._upgrade (upgrades, res, event);
				});
			});
			return this.storage;
		}
	}

	/**
	 * Store a key-value pair. Because of the nature of a IndexedDB Database, the
	 * stored values must be JSON objects.
	 *
	 * @param  {string} key - Key with which this value will be saved
	 * @param  {Object} - Value to save
	 * @return {Promise<Object>} - When resolved, a {key, value} object is handed
	 * down, when it's rejected, the event is handed down.
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
				op.addEventListener ('success', (event) => { resolve ({key: event.target.result, value: value});});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}

	/**
	 * Update a key-value pair. In difference with the set () method, the update
	 * method will use an Object.assign () in the case of objects so no value is
	 * lost.
	 *
	 * @param  {string} key - Key with which this value will be saved
	 * @param  {Object} - Value to save
	 * @return {Promise<Object>} - When resolved, a {key, value} object is handed
	 * down, when it's rejected, the event is handed down.
	 */
	update (key, value) {
		return this.get (key).then ((currentValue) => {
			// If this key did not exist on the storage, then create it using the
			// set method
			if (typeof currentValue === 'undefined') {
				return this.set (key, value);
			}
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				const op = transaction.put (Object.assign ({}, currentValue, value));
				op.addEventListener ('success', (event) => {resolve ({key: event.target.result, value: value});});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}

	/**
	 * Retrieves a value from storage given it's key
	 *
	 * @param  {string} - Key with which the value was saved
	 * @return {Promise<Object>} - Resolves to the retreived value or its rejected
	 * if it doesn't exist
	 */
	get (key) {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store).objectStore (this.store);
				const op = transaction.get (key);

				op.addEventListener ('success', (event) => {
					const value = event.target.result;
					if (typeof value !== 'undefined' && value !== null) {
						resolve (value);
					} else {
						reject ();
					}
				});
				op.addEventListener ('error', (event) => {reject (event);});
			});
		});
	}

	/**
	 * Retrieves all the values in the space in a key-value JSON object
	 *
	 * @return {Promise<Object>} - Resolves to the retreived values
	 */
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
	 * Check if the space contains a given key.
	 *
	 * @param  {string} key - Key to look for.
	 * @return {Promise} - Promise gets resolved if it exists and rejected if it
	 * doesn't
	 */
	contains (key) {
		return this.get (key).then ((keys) => {
			if (keys.includes (key)) {
				Promise.resolve ();
			} else {
				return Promise.reject ();
			}
		});
	}

	/**
	 * Upgrade a Space Version. Upgrades must be declared before the open ()
	 * method is executed.
	 *
	 * @param {string} oldVersion - The version to be upgraded
	 * @param {string} newVersion - The version to be upgraded to
	 * @param {function} callback - Function to transform the old stored values to the new version's format
	 * @returns {Promise}
	 */
	upgrade (oldVersion, newVersion, callback) {
		this.upgrades[`${parseInt (oldVersion.replace (/\./g, ''))}::${parseInt (newVersion.replace (/\./g, ''))}`] = callback;
		return Promise.resolve ();
	}

	// This function acts as a helper for the upgrade progress by executing the
	// needed upgrade callbacks in the correct order and sychronously.
	_upgrade (upgradesToApply, resolve, event) {
		// Check if there are still upgrades to apply
		if (upgradesToApply.length > 0) {
			this.upgrades[upgradesToApply[0]].call (this, this, event).then (() => {
				this._upgrade (upgradesToApply.slice (1), resolve, event);
			}).catch ((e) => console.error (e));
		} else {
			resolve ();
		}
	}

	/**
	 * Renaming the space is not possible with the IndexedDB adapter therefore
	 * this function always gets a rejection.
	 *
	 * @returns {Promise} - Result of the rename operation
	 */
	rename () {
		return Promise.reject ();
	}

	/**
	 * Getting a key by its index is not possible in this adapter, therefore this
	 * function always gets rejected.
	 *
	 * @return {Promise} - Promise Rejection
	 */
	key () {
		return Promise.reject ();
	}

	/**
	 * Return all keys stored in the space.
	 *
	 * @return {Promise<string[]>}  - Array of keys
	 */
	keys () {
		return this.open ().then (() => {
			return new Promise ((resolve, reject) => {
				const transaction = this.storage.transaction (this.store, 'readwrite').objectStore (this.store);
				const op = transaction.getAllKeys ();
				op.addEventListener ('success', (event) => {resolve (event.target.result);}, false);
				op.addEventListener ('error', (event) => {reject (event);}, false);
			});
		});
	}

	/**
	 * Delete a value from the space given its key
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