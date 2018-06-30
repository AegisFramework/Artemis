/**
* ==============================
* Session Storage Adapter
* ==============================
*/

import { LocalStorage } from './LocalStorage';

/**
 * The Session Storage Adapter provides the Space Class the ability to interact
 * with the sessionStorage api found in most modern browsers. Since this API
 * shares pretty much the same methods to the local storage one, this class
 * inherits from the LocalStorage adapter.
 *
 * @class
 */
export class SessionStorage extends LocalStorage {

	/**
	 * Create a new SessionStorage. If no configuration is provided, the SessionStorage
	 * global object is used.The SessionStorage Adapter can provide independency
	 * by store name and space name.
	 *
	 * @constructor
	 * @param {Object} [configuration={name = '', version = '', store = ''}] - Configuration Object for the Adapter
	 * @param {string} configuration.name - Name of the Space
	 * @param {string} configuration.version - Version of the Space in Semantic versioning syntax
	 * @param {string} configuration.store - Name of the Object Store to use
	 *
	 */
	constructor ({name = '', version = '', store = ''}) {
		super ({name, version, store});
	}

	/**
	 * Open the Storage Object

	 * @return {Promise<SessionStorage>}
	 */
	open () {
		if (typeof this.storage === 'undefined') {
			this.storage = window.sessionStorage;
		}
		return Promise.resolve (this);
	}
}