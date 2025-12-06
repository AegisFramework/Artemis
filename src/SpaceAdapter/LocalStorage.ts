/**
 * ==============================
 * Local Storage Adapter
 * ==============================
 */

import type { LocalStorageConfiguration, StorageValue, KeyValueResult, UpgradeCallback } from './types';

/**
 * The Local Storage Adapter provides the Space Class the ability to interact
 * with the localStorage API found in most modern browsers.
 */
export class LocalStorage {
	public name: string;
	public version: string;
	public store: string;
	public id: string;
	public numericVersion: number;
	public upgrades: Record<string, UpgradeCallback<LocalStorage>>;
	public storage: Storage | Promise<LocalStorage> | undefined;

	/**
	 * Create a new LocalStorage. If no configuration is provided, the LocalStorage
	 * global object is used. The LocalStorage Adapter can provide independency
	 * by store name and space name.
	 *
	 * @param configuration - Configuration Object for the Adapter
	 */
	constructor({ name = '', version = '', store = '' }: LocalStorageConfiguration) {
		this.name = name;
		this.version = version;
		this.store = store;
		this.upgrades = {};

		if (this.version === '') {
			this.numericVersion = 0;
		} else {
			this.numericVersion = parseInt(version.replace(/\./g, ''));
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
	 * Modify the configuration
	 *
	 * @param config - Configuration object to set up
	 */
	configuration(config: LocalStorageConfiguration): void {
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
		if (this.storage instanceof Storage) {
			return Promise.resolve(this);
		} else if (this.storage instanceof Promise) {
			return this.storage as Promise<this>;
		} else {
			const openPromise: Promise<this> = new Promise<{ upgrades: string[] }>((resolve) => {
				let upgradesToApply: string[] = [];

				// Check if this space is versioned
				if (this.version !== '') {
					// Get the versionless part of the ID
					let versionless = '';
					if (this.name !== '' && this.version !== '' && this.store !== '') {
						versionless = `${this.name}::${this.store}::`;
					} else if (this.name !== '' && this.version !== '') {
						versionless = `${this.name}::`;
					}

					// Get all the currently stored keys that contain the versionless ID
					const storedVersions = Object.keys(window.localStorage).filter((key) => {
						return key.indexOf(versionless) === 0;
					}).map((key) => {
						return key.replace(versionless, '').split('_')[0];
					}).filter((key) => {
						return key.indexOf('::') === -1;
					}).sort();

					if (storedVersions.length > 0) {
						const oldVersion = storedVersions[0];
						const oldVersionNumeric = parseInt(oldVersion.replace(/\./g, ''));

						if (oldVersionNumeric < this.numericVersion) {
							const availableUpgrades = Object.keys(this.upgrades).sort();

							const startFrom = availableUpgrades.findIndex((u) => {
								const [old] = u.split('::');
								return parseInt(old) === oldVersionNumeric;
							});

							if (startFrom > -1) {
								upgradesToApply = availableUpgrades.slice(startFrom).filter((u) => {
									const [old, next] = u.split('::');
									return parseInt(old) < this.numericVersion && parseInt(next) <= this.numericVersion;
								});
							}

							// Get the previous ID using the old version
							let previousId = `${this.name}::${oldVersion}_`;

							if (this.name !== '' && this.version !== '' && this.store !== '') {
								previousId = `${this.name}::${this.store}::${oldVersion}_`;
							} else if (this.name !== '' && this.version !== '') {
								previousId = `${this.name}::${oldVersion}_`;
							}

							// Get all keys from the previous version
							const keys = Object.keys(window.localStorage).filter((key) => {
								return key.indexOf(previousId) === 0;
							}).map((key) => {
								return key.replace(previousId, '');
							});

							for (const key of keys) {
								const previous = window.localStorage.getItem(`${previousId}${key}`);
								if (previous !== null) {
									window.localStorage.setItem(this.id + key, previous);
								}
								window.localStorage.removeItem(`${previousId}${key}`);
							}
						}
					}
				}
				resolve({ upgrades: upgradesToApply });
			}).then(({ upgrades }) => {
				this.storage = window.localStorage;
				return new Promise<this>((resolve) => {
					const res = () => resolve(this);
					this._upgrade(upgrades, res);
				});
			});

			this.storage = openPromise as unknown as Promise<LocalStorage>;
			return openPromise;
		}
	}

	/**
	 * Store a key-value pair
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and value
	 */
	set(key: string, value: StorageValue): Promise<KeyValueResult> {
		return this.open().then(() => {
			if (typeof value === 'object') {
				(this.storage as Storage).setItem(this.id + key, JSON.stringify(value));
			} else {
				(this.storage as Storage).setItem(this.id + key, String(value));
			}
			return Promise.resolve({ key, value });
		});
	}

	/**
	 * Update a key-value pair. The update method will use Object.assign()
	 * in the case of objects so no value is lost.
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and value
	 */
	update(key: string, value: StorageValue): Promise<KeyValueResult> {
		return this.get(key).then((currentValue) => {
			if (typeof currentValue === 'object' && currentValue !== null) {
				if (typeof value === 'object' && value !== null) {
					value = Object.assign({}, currentValue as object, value as object);
				}
				(this.storage as Storage).setItem(this.id + key, JSON.stringify(value));
			} else {
				(this.storage as Storage).setItem(this.id + key, String(value));
			}
			return Promise.resolve({ key, value });
		}).catch(() => {
			return this.set(key, value);
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
			return new Promise((resolve, reject) => {
				let value: StorageValue = (this.storage as Storage).getItem(this.id + key);
				try {
					const o = JSON.parse(value as string);
					if (o && typeof o === 'object') {
						value = o;
					}
				} catch {
					// Unable to parse to JSON
				}

				if (typeof value !== 'undefined' && value !== null) {
					resolve(value);
				} else {
					reject();
				}
			});
		});
	}

	/**
	 * Retrieves all the values in the space in a key-value JSON object
	 *
	 * @returns Promise resolving to all values
	 */
	getAll(): Promise<Record<string, StorageValue>> {
		return this.keys().then((keys) => {
			const values: Record<string, StorageValue> = {};
			const promises: Promise<void>[] = [];
			for (const key of keys) {
				promises.push(this.get(key).then((value) => {
					values[key] = value;
				}));
			}
			return Promise.all(promises).then(() => values);
		});
	}

	/**
	 * Check if the space contains a given key.
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
	 * Upgrade a Space Version
	 *
	 * @param oldVersion - The version of the storage to be upgraded
	 * @param newVersion - The version to be upgraded to
	 * @param callback - Function to transform the old stored values
	 * @returns Promise
	 */
	upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback<LocalStorage>): Promise<void> {
		const key = `${parseInt(oldVersion.replace(/\./g, ''))}::${parseInt(newVersion.replace(/\./g, ''))}`;
		this.upgrades[key] = callback;
		return Promise.resolve();
	}

	/**
	 * Helper for the upgrade progress by executing callbacks in order
	 */
	private _upgrade(upgradesToApply: string[], resolve: () => void): void {
		if (upgradesToApply.length > 0) {
			this.upgrades[upgradesToApply[0]].call(this, this).then(() => {
				this._upgrade(upgradesToApply.slice(1), resolve);
			}).catch((e) => console.error(e));
		} else {
			resolve();
		}
	}

	/**
	 * Rename a Space
	 *
	 * @param name - New name to be used
	 * @returns Promise for the rename operation
	 */
	rename(name: string): Promise<void> {
		if (this.name !== name) {
			return this.keys().then((keys) => {
				const oldId = this.id;
				this.name = name;

				if (this.name !== '' && this.version !== '' && this.store !== '') {
					this.id = `${this.name}::${this.store}::${this.version}_`;
				} else if (this.name !== '' && this.version !== '') {
					this.id = `${this.name}::${this.version}_`;
				} else if (this.name !== '') {
					this.id = `${this.name}::_`;
				} else {
					this.id = '';
				}

				const promises: Promise<void>[] = [];
				for (const key of keys) {
					const value = (this.storage as Storage).getItem(`${oldId}${key}`);
					if (value !== null) {
						promises.push(this.set(key, value).then(() => {
							(this.storage as Storage).removeItem(`${oldId}${key}`);
						}));
					}
				}
				return Promise.all(promises).then(() => {});
			});
		} else {
			return Promise.reject();
		}
	}

	/**
	 * Get the key that corresponds to a given index in the storage
	 *
	 * @param index - Index to get the key from
	 * @param full - Whether to return the full key name including space id
	 * @returns Promise resolving to the key's name
	 */
	key(index: number, full: boolean = false): Promise<string> {
		return this.open().then(() => {
			const keyValue = (this.storage as Storage).key(index);
			if (full === true) {
				return Promise.resolve(keyValue ?? '');
			} else {
				return Promise.resolve((keyValue ?? '').replace(this.id, ''));
			}
		});
	}

	/**
	 * Return all keys stored in the space.
	 *
	 * @param full - Whether to return the full key name including space id
	 * @returns Promise resolving to array of keys
	 */
	keys(full: boolean = false): Promise<string[]> {
		return this.open().then(() => {
			return Promise.resolve(Object.keys(this.storage as Storage).filter((key) => {
				return key.indexOf(this.id) === 0;
			}).map((key) => {
				if (full === true) {
					return key;
				} else {
					return key.replace(this.id, '');
				}
			}));
		});
	}

	/**
	 * Delete a value from the space given its key
	 *
	 * @param key - Key of the item to delete
	 * @returns Promise resolving to the value of the deleted object
	 */
	remove(key: string): Promise<StorageValue> {
		return this.get(key).then((value) => {
			(this.storage as Storage).removeItem(this.id + key);
			return Promise.resolve(value);
		});
	}

	/**
	 * Clear the entire space
	 *
	 * @returns Promise for the clear operation
	 */
	clear(): Promise<void> {
		return this.keys().then((keys) => {
			for (const key of keys) {
				this.remove(key);
			}
			return Promise.resolve();
		});
	}
}

