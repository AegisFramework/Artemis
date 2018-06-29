/**
* ==============================
* Local Storage Adapter
* ==============================
*/

import { Request } from './../Request';

/**
 * The Local Storage Adapter provides the Space Class the ability to interact
 * with the localStorage api found in most modern browsers.
 *
 * @class
 */
export class Server {

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
	constructor ({name = '', version = '', store = '', endpoint = '', headers = {}}) {
		this.name = name;
		this.version = version;
		this.store = store;
		this.endpoint = `${endpoint}${store}/`;
		this.headers = headers;
	}

	/**
	 * Open the Storage Object
	 *
	 * @param  {function} [create=null] - Callback for database creation when using an Space.Type.Indexed
	 * @return {Promise}
	 */
	open () {
		if (typeof this.storage === 'undefined') {
			this.storage = Request;
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
			return this.storage.post (this.endpoint + key, value, this.headers);
		});
	}

	update (key, value) {
		return this.get (key).then ((currentValue) => {

			return this.storage.put (this.endpoint + key, Object.assign ({}, currentValue, value), this.headers).then ((response) => {
				return response.json ();
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
			return this.storage.get (this.endpoint + key, {}, this.headers).then ((response) => {
				return response.json ();
			});
		});
	}

	getAll () {
		return this.open ().then (() => {
			return this.storage.get (this.endpoint, {}, this.headers).then ((response) => {
				return response.json ();
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
	upgrade () {
		return Promise.reject ();
	}

	/**
	 * Rename a Space
	 * @param name {string} - New name to be used.
	 * @returns {Promise} Result of the rename operation
	 */
	rename (name) {
		return Promise.reject ();
	}

	/**
	 * Get the key that corresponds to a given index in the storage
	 *
	 * @param  {Number} index - Index to get the key from
	 * @param  {boolean} [full=false] - Whether to return the full key name including space id or just the key name
	 * @return {Promise<string>} - Resolves to the key's name
	 */
	key () {
		return Promise.reject ();
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
		return this.open ().then (() => {
			return this.storage.delete (this.endpoint + key, {}, this.headers).then ((response) => {
				return response.json ();
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
			return this.storage.delete (this.endpoint, {}, this.headers);
		});
	}
}