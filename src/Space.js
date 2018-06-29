/**
* ==============================
* Space
* ==============================
*/

import { LocalStorage } from './SpaceAdapter/LocalStorage';
import { SessionStorage } from './SpaceAdapter/SessionStorage';
import { IndexedDB } from './SpaceAdapter/IndexedDB';


export const SpaceAdapter = {
	LocalStorage,
	SessionStorage,
	IndexedDB
};

/**
 * Space provides a simple wrapper for different Storage approaches. It aims to
 * provide data independence through storage namespaces and versioning, allowing
 * transparent data formatting and content modifications through versions.
 * @class
 */

export class Space {

	/**
	 * Create a new Space Object. If no name and version is defined, the global LocalSpace space is used.
	 *
	 * @constructor
	 * @param {string} [name=''] - Space Space Name.
	 * @param {string} [version=''] - Space Space Version. Must be a numeric string i.e. '0.1.0'
	 * @param {Space.Type} [type=Space.Type.Local] - Space Space Type. Determines what storage engine will be used.
	 */
	constructor (adapter = SpaceAdapter.LocalStorage, configuration = {}) {
		// Assign the provided configuration to the default one
		this.configuration = Object.assign ({}, {name: '', version: '', store: ''}, configuration);

		// Set up the adapter instance to use
		this.adapter = new adapter (this.configuration);

		// This object stores all the callbacks the user can define for the
		// space operations
		this.callbacks = {
			'create': [],
			'update': [],
			'delete': []
		};

		// A transformation is an object that can contain a set and get functions
		// every transformation will be applied to the val
		this.transformations = {

		};
	}

	/**
	 * Modify the space configuration, it will also be passed down to the adapter
	 * using its configuration () function.
	 *
	 * @param  {object} - Configuration object to set up
	 * @return {object} - Configuration object if no param was passed
	 */
	configuration (object = null) {
		if (object !== null) {
			this.configuration = Object.assign ({}, this.configuration, object);
			this.adapter.configuration (object);
		} else {
			return this.configuration;
		}
	}

	/**
	 * Open the Storage Object to be used depending on the Space.Type
	 *
	 * @param  {function} [create=null] - Callback for database creation when using an Space.Type.Indexed
	 * @return {Promise}
	 */
	open (create = null) {
		return this.adapter.open (create);
	}

	/**
	 * Store a key-value pair
	 *
	 * @param  {string} key - Key with which this value will be saved
	 * @param  {Object|string|Number} - Value to save
	 * @return {Promise}
	 */
	set (key, value) {

		for (const id of Object.keys (this.transformations)) {
			if (typeof this.transformations[id].set === 'function') {
				value = this.transformations[id].set.call (null, key, value);
			}
		}

		return this.adapter.set (key, value).then (() => {
			for (const callback of this.callbacks.create) {
				callback.call (null, key, value);
			}
		});
	}

	update (key, value) {

		for (const id of Object.keys (this.transformations)) {
			if (typeof this.transformations[id].set === 'function') {
				value = this.transformations[id].set.call (null, key, value);
			}
		}

		return this.adapter.update (key, value).then (() => {
			for (const callback of this.callbacks.update) {
				callback.call (null, key, value);
			}
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
		return this.adapter.get (key).then ((value) => {
			for (const id of Object.keys (this.transformations)) {
				if (typeof this.transformations[id].get === 'function') {
					value = this.transformations[id].get.call (null, key, value);
				}
			}
			return value;
		});
	}

	getAll () {
		return this.adapter.getAll ().then ((values) => {
			for (const key of Object.keys (values)) {
				for (const id of Object.keys (this.transformations)) {
					if (typeof this.transformations[id].get === 'function') {
						values[key] = this.transformations[id].get.call (null, key, values[key]);
					}
				}
			}
			return values;
		});
	}

	each (callback) {
		return this.getAll ().then ((values) => {
			const promises = [];
			for (const i of Object.keys (values)) {
				promises.push (callback.call (this, i, values[i]));
			}
			return Promise.all (promises);
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
		return this.adapter.contains (key);
	}

	/**
	 * Upgrade a Space Version
	 * @param oldVersion {string} - The version of the storage to be upgraded
	 * @param newVersion {string} - The version to be upgraded to
	 * @param callback {function} - Function to transform the old stored values to the new version's format
	 * @returns {Promise} Result of the upgrade operation
	 */
	upgrade (oldVersion, newVersion) {
		return this.adapter.upgrade (oldVersion, newVersion).then (() => {
			return Promise.resolve (this);
		});
	}

	/**
	 * Rename a Space
	 * @param name {string} - New name to be used.
	 * @returns {Promise} Result of the rename operation
	 */
	rename (name) {
		return this.adapter.rename (name);
	}

	/**
	 * Set the callback function to be run every time a value is created.
	 *
	 * @param  {function} callback - Callback Function. Key and Value pair will be sent as parameters when run.
	 */
	onCreate (callback) {
		this.callbacks.create.push (callback);
	}

	/**
	 * Set the callback function to be run every time a value is deleted.
	 *
	 * @param  {function} callback - Callback Function. Key and Value pair will be sent as parameters when run.
	 */
	onDelete (callback) {
		this.callbacks.delete.push (callback);
	}

	/**
	 * Add a transformation function to the space.
	 *
	 * @param  {string} id - Unique transformation name or identifier
	 * @param  {function|null} get - Transformation function to apply to the content before
	 * returning the value when using the get () function .
	 * @param  {function|null} set - Transformation function to apply to the content before
	 * saving it when using the set () function befo.
	 */
	addTransformation ({id, get, set}) {
		this.transformations[id] = {
			id,
			get,
			set
		};
	}

	/**
	 * Remove a transformation function given its id
	 *
	 * @param  {string} id - Name or identifier of the transformation to remove
	 */
	removeTransformation (id) {
		delete this.transformations[id];
	}

	/**
	 * Get the key that corresponds to a given index in the storage
	 *
	 * @param  {Number} index - Index to get the key from
	 * @param  {boolean} [full=false] - Whether to return the full key name including space id or just the key name
	 * @return {Promise<string>} - Resolves to the key's name
	 */
	key (index, full = false) {
		return this.adapter.key (index, full);
	}

	/**
	 * Return all keys stored in the space.
	 *
	 * @param {boolean} [full=false] - Whether to return the full key name including space id or just the key name
	 * @return {Promise<string[]>}  - Array of keys
	 */
	keys (full = false) {
		return this.adapter.keys (full);
	}


	/**
	 * Delete a value from the space given it's key
	 *
	 * @param  {string} key - Key of the item to delete
	 * @return {Promise<key, value>} - Resolves to the key and value of the deleted object
	 */
	remove (key) {
		return this.adapter.remove (key).then ((value) => {
			// Run the callback for deletions
			for (const callback of this.callbacks.delete) {
				callback.call (null, key, value);
			}
		});
	}

	/**
	 * Clear the entire space
	 *
	 * @return {Promise} - Result of the clear operation
	 */
	clear () {
		return this.adapter.clear ();
	}
}