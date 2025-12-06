/**
 * ==============================
 * Remote Storage Adapter
 * ==============================
 */

import { Request } from '../Request';
import type { RequestOptions } from '../Request';
import type { RemoteStorageConfiguration, StorageValue, KeyValueResult } from './types';

/**
 * The Remote Storage Adapter provides the Space Class the ability to interact
 * with a server in order to handle data persistence. The server's implementation
 * is up to the developer but it will need to respond to this adapter's request
 * formatting. This adapter uses the Request class to perform its tasks.
 */
export class RemoteStorage {
	public name: string;
	public version: string;
	public store: string;
	public endpoint: string;
	public props: RequestOptions;
	public storage: typeof Request | undefined;

	/**
	 * Create a new Remote Storage. This adapter requires an endpoint URL where
	 * it will make the requests.
	 *
	 * @param configuration - Configuration Object for the Adapter
	 */
	constructor({ name = '', version = '', store = '', endpoint = '', props = {} }: RemoteStorageConfiguration) {
		this.name = name;
		this.version = version;
		this.store = store;
		this.endpoint = `${endpoint}${store}/`;
		this.props = props;
	}

	/**
	 * Modify the configuration
	 *
	 * @param config - Configuration object to set up
	 */
	configuration(config: RemoteStorageConfiguration): void {
		if (config.name) this.name = config.name;
		if (config.version) this.version = config.version;
		if (config.store) this.store = config.store;
	}

	/**
	 * Open the Storage Object
	 *
	 * @returns Promise resolving to this adapter
	 */
	open(): Promise<this> {
		if (typeof this.storage === 'undefined') {
			this.storage = Request;
		}
		return Promise.resolve(this);
	}

	/**
	 * Store a key-value pair. This function sends a POST request to the server
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and response
	 */
	set(key: string, value: StorageValue): Promise<KeyValueResult> {
		return this.open().then(() => {
			return this.storage!.post(this.endpoint + key, value as Record<string, string | number | boolean>, this.props).then((response) => {
				return Promise.resolve({ key, value: response.json() });
			});
		});
	}

	/**
	 * Update a key-value pair. The update method will use Object.assign()
	 * in the case of objects so no value is lost. This function sends a PUT
	 * request to the server.
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and response
	 */
	update(key: string, value: StorageValue): Promise<KeyValueResult> {
		return this.get(key).then((currentValue) => {
			const merged = Object.assign({}, currentValue as object, value as object);
			return this.storage!.put(this.endpoint + key, merged as Record<string, string | number | boolean>, this.props).then((response) => {
				return Promise.resolve({ key, value: response.json() });
			});
		});
	}

	/**
	 * Retrieves a value from storage given its key
	 *
	 * @param key - Key with which the value was saved
	 * @returns Promise resolving to the retrieved value
	 */
	get(key: string): Promise<StorageValue> {
		return this.open().then(() => {
			return this.storage!.json(this.endpoint + key, {}, this.props);
		});
	}

	/**
	 * Retrieves all the values in the space in a key-value JSON object
	 *
	 * @returns Promise resolving to all values
	 */
	getAll(): Promise<Record<string, StorageValue>> {
		return this.open().then(() => {
			return this.storage!.json(this.endpoint, {}, this.props);
		});
	}

	/**
	 * Check if a space contains a given key.
	 *
	 * @param key - Key to look for
	 * @returns Promise that resolves if key exists
	 */
	contains(key: string): Promise<void> {
		return this.keys().then((keys) => {
			if (keys.includes(key)) {
				return Promise.resolve();
			} else {
				return Promise.reject();
			}
		});
	}

	/**
	 * Upgrading the Storage must be done on the server side, therefore this
	 * function always gets rejected.
	 *
	 * @returns Promise rejection
	 */
	upgrade(): Promise<never> {
		return Promise.reject();
	}

	/**
	 * Renaming the Storage must be done on the server side, therefore this
	 * function always gets rejected.
	 *
	 * @returns Promise rejection
	 */
	rename(): Promise<never> {
		return Promise.reject();
	}

	/**
	 * Getting a key by its index is not possible in this adapter, therefore
	 * this function always gets rejected.
	 *
	 * @returns Promise rejection
	 */
	key(): Promise<never> {
		return Promise.reject();
	}

	/**
	 * Return all keys stored in the space. This makes a GET request to the
	 * full endpoint with a keys query parameter.
	 *
	 * @returns Promise resolving to array of keys
	 */
	keys(): Promise<string[]> {
		return this.open().then(() => {
			return this.storage!.json<string[]>(this.endpoint, { keys: true }, this.props);
		});
	}

	/**
	 * Delete a value from the space given its key. This function sends a
	 * DELETE request to the server.
	 *
	 * @param key - Key of the item to delete
	 * @returns Promise resolving to the key and response
	 */
	remove(key: string): Promise<StorageValue> {
		return this.open().then(() => {
			return this.storage!.delete(this.endpoint + key, {}, this.props).then((response) => {
				return response.json();
			});
		});
	}

	/**
	 * Clear the entire space. This function sends a DELETE request to the server.
	 *
	 * @returns Promise for the clear operation
	 */
	clear(): Promise<void> {
		return this.open().then(() => {
			return this.storage!.delete(this.endpoint, {}, this.props).then(() => {});
		});
	}
}

