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
export class LocalStorage {

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
	constructor ({name = '', version = '', store = ''}) {
		this.name = name;
		this.version = version;
		this.store = store;

		if (this.version === '') {
			this.numericVersion = 0;
		} else {
			this.numericVersion = parseInt (version.replace (/\./g, ''));
		}

		if (name !== '' && version !== '' && store !== '') {
			this.id = `${this.name}::${this.store}::${this.version}_`;
		} else if (name !== '' && version !== '') {
			this.id = `${this.name}::${this.version}_`;
		} else if (name !== '') {
			this.id = `${this.name}::_`;
		} else {
			this.id = '';
		}
	}

	/**
	 * Open the Storage Object
	 *
	 * @param  {function} [create=null] - Callback for database creation when using an Space.Type.Indexed
	 * @return {Promise}
	 */
	open () {
		if (typeof this.storage === 'undefined') {
			this.storage = window.localStorage;
		}
		return Promise.resolve (this);
	}

	/**
	 * Store a key-value pair
	 *
	 * @param  {string} key - Key with which this value will be saved
	 * @param  {Object|string|Number} - Value to save
	 * @return {Promise}
	 */
	set (key, value) {
		return this.open ().then (() => {

			if (typeof value === 'object') {
				this.storage.setItem (this.id + key, JSON.stringify (value));
			} else {
				this.storage.setItem (this.id + key, value);
			}

			return Promise.resolve (value);
		});
	}

	update (key, value) {
		return this.get (key).then ((currentValue) => {

			if (typeof currentValue === 'object') {
				this.storage.setItem (this.id + key, Object.assign ({}, currentValue, JSON.stringify (value)));
			} else {
				this.storage.setItem (this.id + key, value);
			}
			return Promise.resolve (value);
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
				let value = null;
				value = this.storage.getItem (this.id + key);
				try {
					const o = JSON.parse (value);
					if (o && typeof o === 'object') {
						value = o;
					}
				} catch (exception) {
					// Unable to parse to JSON
				}

				if (value !== null) {
					resolve (value);
				} else {
					reject ();
				}

			});
		});
	}

	getAll () {
		return this.keys ().then ((keys) => {
			const values = {};
			const promises = [];
			for (const key of keys) {
				promises.push (this.get (key).then ((value) => {
					values[key] = value;
				}));
			}
			return Promise.all (promises).then (() => {
				return values;
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
	upgrade (oldVersion, newVersion) {
		return this.open ().then (() => {

			// Get all keys from the previous version
			const keys = Object.keys (this.storage).filter ((key) => {
				return key.indexOf (`${this.name}::${oldVersion}_`) === 0;
			}).map ((key) => {
				return key.replace (`${this.name}::${oldVersion}_`, '');
			});

			const promises = [];

			for (const key of keys) {
				// Get the value stored with the previous version
				let previous = this.storage.getItem (`${this.name}::${oldVersion}_${key}`);

				// Transform string to JSON object if needed
				try {
					const o = JSON.parse (previous);
					if (o && typeof o === 'object') {
						previous = o;
					}
				} catch (exception) {
					// Unable to parse to JSON
				}

				promises.push (this.set (key, previous).then (() => {
					// Delete the previous element from storage
					return this.storage.removeItem (`${this.name}::${oldVersion}_${key}`);
				}));

				return Promise.all (promises);
			}
			return Promise.reject ();
		});
	}

	/**
	 * Rename a Space
	 * @param name {string} - New name to be used.
	 * @returns {Promise} Result of the rename operation
	 */
	rename (name) {

		// Check if the name is different
		if (this.name !== name) {
			return this.keys ().then ((keys) => {

				// Save the previous Space id
				const oldId = this.id;

				// Set new object properties with the new name
				this.name = name;
				this.id = `${this.name}::${this.version}_`;
				const promises = [];

				for (const key of keys) {
					promises.push (this.set (key, this.storage.getItem (`${oldId}${key}`)).then (() => {
						this.storage.removeItem (`${oldId}${key}`);
					}));
				}
				return Promise.all (promises);
			});
		} else {
			return Promise.reject ();
		}
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
	keys (full = false) {
		return this.open ().then (() => {
			return Promise.resolve (Object.keys (this.storage).filter ((key) => {
				return key.indexOf (this.id) === 0;
			}).map ((key) => {
				if (full === true) {
					return key;
				} else {
					return key.replace (this.id, '');
				}
			}));
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
			this.storage.removeItem (this.id + key);
			return Promise.resolve (key, value);
		});
	}

	/**
	 * Clear the entire space
	 *
	 * @return {Promise} - Result of the clear operation
	 */
	clear () {
		return this.keys ().then ((keys) => {
			for (const key of keys) {
				this.remove (key);
			}
			return Promise.resolve ();
		});
	}
}