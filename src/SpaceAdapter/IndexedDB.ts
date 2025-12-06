/**
 * ==============================
 * IndexedDB Adapter
 * ==============================
 */

import type { IndexedDBConfiguration, StorageValue, KeyValueResult, UpgradeCallback } from './types';

/**
 * The IndexedDB Adapter provides the Space Class the ability to interact
 * with the IndexedDB API found in most modern browsers.
 */
export class IndexedDB {
	public name: string;
	public version: string;
	public store: string;
	public props: IDBObjectStoreParameters;
	public index: Record<string, { name: string; field: string; props?: IDBIndexParameters }>;
	public keyPath: string;
	public numericVersion: number;
	public upgrades: Record<string, UpgradeCallback<IndexedDB>>;
	public storage: IDBDatabase | Promise<IDBDatabase> | undefined;

	/**
	 * Create a new IndexedDB. Differently from Local and Session Storages, the
	 * IndexedDB Adapter requires a mandatory name, version and store name.
	 *
	 * @param configuration - Configuration Object for the Adapter
	 */
	constructor({ name = '', version = '', store = '', props = {}, index = {} }: IndexedDBConfiguration) {
		this.name = name;
		this.version = version;
		this.store = store;
		this.props = props || {};
		this.index = index;

		this.keyPath = (props?.keyPath as string) || 'id';
		this.upgrades = {};

		if (this.version === '') {
			this.numericVersion = 0;
		} else {
			this.numericVersion = parseInt(version.replace(/\./g, ''));
		}
	}

	/**
	 * Modify the configuration
	 *
	 * @param config - Configuration object to set up
	 */
	configuration(config: IndexedDBConfiguration): void {
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
		if (this.name === '') {
			console.error('No name has been defined for IndexedDB space.');
			return Promise.reject();
		}

		if (this.store === '') {
			console.error('No store has been defined for IndexedDB space.');
			return Promise.reject();
		}

		if (this.storage instanceof IDBDatabase) {
			return Promise.resolve(this);
		} else if (this.storage instanceof Promise) {
			return this.storage as unknown as Promise<this>;
		} else {
			let upgradeEvent: IDBVersionChangeEvent | undefined;

			const openPromise = new Promise<{ storage: IDBDatabase; upgrades: string[] }>((resolve, reject) => {
				let upgradesToApply: string[] = [];
				const request = window.indexedDB.open(this.name, this.numericVersion);

				request.onerror = (event) => {
					reject(event);
				};

				request.onsuccess = (event) => {
					resolve({ storage: (event.target as IDBOpenDBRequest).result, upgrades: upgradesToApply });
				};

				request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
					upgradeEvent = event;
					const db = (event.target as IDBOpenDBRequest).result;

					if (event.oldVersion < 1) {
						// Create all the needed Stores
						const store = db.createObjectStore(this.store, this.props);
						for (const indexKey of Object.keys(this.index)) {
							const idx = this.index[indexKey];
							store.createIndex(idx.name, idx.field, idx.props);
						}
					} else {
						// Check what upgrade functions have been declared
						const availableUpgrades = Object.keys(this.upgrades).sort();

						const startFrom = availableUpgrades.findIndex((u) => {
							const [old] = u.split('::');
							return parseInt(old) === event.oldVersion;
						});

						if (startFrom > -1) {
							upgradesToApply = availableUpgrades.slice(startFrom).filter((u) => {
								const [old, next] = u.split('::');
								return parseInt(old) < this.numericVersion && parseInt(next) <= this.numericVersion;
							});
						}
					}

					// Once the transaction is done, resolve the storage object
					const transaction = (event.target as IDBOpenDBRequest).transaction;
					if (transaction) {
						transaction.addEventListener('complete', () => {
							resolve({ storage: db, upgrades: upgradesToApply });
						});
					}
				};
			}).then(({ storage, upgrades }) => {
				this.storage = storage;
				return new Promise<this>((resolve) => {
					const res = () => resolve(this);
					this._upgrade(upgrades, res, upgradeEvent);
				});
			});

			this.storage = openPromise as unknown as Promise<IDBDatabase>;
			return openPromise;
		}
	}

	/**
	 * Store a key-value pair. Because of the nature of IndexedDB,
	 * stored values must be JSON objects.
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and value
	 */
	set(key: string | null = null, value: StorageValue): Promise<KeyValueResult> {
		return this.open().then(() => {
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store, 'readwrite')
					.objectStore(this.store);
				let op: IDBRequest;

				if (key !== null) {
					const temp: Record<string, unknown> = {};
					temp[this.keyPath] = key;
					op = transaction.put(Object.assign({}, temp, value as object));
				} else {
					op = transaction.add(value);
				}

				op.addEventListener('success', (event) => {
					resolve({ key: String((event.target as IDBRequest).result), value });
				});
				op.addEventListener('error', (event) => {
					reject(event);
				});
			});
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
			if (typeof currentValue === 'undefined') {
				return this.set(key, value);
			}
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store, 'readwrite')
					.objectStore(this.store);
				const op = transaction.put(Object.assign({}, currentValue as object, value as object));

				op.addEventListener('success', (event) => {
					resolve({ key: String((event.target as IDBRequest).result), value });
				});
				op.addEventListener('error', (event) => {
					reject(event);
				});
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
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store)
					.objectStore(this.store);
				const op = transaction.get(key);

				op.addEventListener('success', (event) => {
					const value = (event.target as IDBRequest).result;
					if (typeof value !== 'undefined' && value !== null) {
						resolve(value);
					} else {
						reject();
					}
				});
				op.addEventListener('error', (event) => {
					reject(event);
				});
			});
		});
	}

	/**
	 * Retrieves all the values in the space in a key-value JSON object
	 *
	 * @returns Promise resolving to all values
	 */
	getAll(): Promise<Record<string, StorageValue>> {
		return this.open().then(() => {
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store)
					.objectStore(this.store);
				const op = transaction.getAll();

				op.addEventListener('success', (event) => {
					const results: Record<string, StorageValue> = {};
					const items = (event.target as IDBRequest).result as Record<string, unknown>[];
					items.forEach((item) => {
						const id = item[this.keyPath] as string;
						delete item[this.keyPath];
						results[id] = item;
					});
					resolve(results);
				});
				op.addEventListener('error', (event) => {
					reject(event);
				});
			});
		});
	}

	/**
	 * Check if the space contains a given key.
	 *
	 * @param key - Key to look for
	 * @returns Promise that resolves if key exists
	 */
	contains(key: string): Promise<void> {
		return this.get(key).then(() => {
			return Promise.resolve();
		});
	}

	/**
	 * Upgrade a Space Version. Upgrades must be declared before the open()
	 * method is executed.
	 *
	 * @param oldVersion - The version to be upgraded
	 * @param newVersion - The version to be upgraded to
	 * @param callback - Function to transform the old stored values
	 * @returns Promise
	 */
	upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback<IndexedDB>): Promise<void> {
		const key = `${parseInt(oldVersion.replace(/\./g, ''))}::${parseInt(newVersion.replace(/\./g, ''))}`;
		this.upgrades[key] = callback;
		return Promise.resolve();
	}

	/**
	 * Helper for the upgrade progress by executing callbacks in order
	 */
	private _upgrade(upgradesToApply: string[], resolve: () => void, event?: IDBVersionChangeEvent): void {
		if (upgradesToApply.length > 0) {
			this.upgrades[upgradesToApply[0]].call(this, this, event).then(() => {
				this._upgrade(upgradesToApply.slice(1), resolve, event);
			}).catch((e) => console.error(e));
		} else {
			resolve();
		}
	}

	/**
	 * Renaming the space is not possible with the IndexedDB adapter therefore
	 * this function always gets rejected.
	 *
	 * @returns Promise rejection
	 */
	rename(): Promise<never> {
		return Promise.reject();
	}

	/**
	 * Getting a key by its index is not possible in this adapter, therefore this
	 * function always gets rejected.
	 *
	 * @returns Promise rejection
	 */
	key(): Promise<never> {
		return Promise.reject();
	}

	/**
	 * Return all keys stored in the space.
	 *
	 * @returns Promise resolving to array of keys
	 */
	keys(): Promise<string[]> {
		return this.open().then(() => {
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store, 'readwrite')
					.objectStore(this.store);
				const op = transaction.getAllKeys();

				op.addEventListener('success', (event) => {
					resolve((event.target as IDBRequest).result.map(String));
				}, false);
				op.addEventListener('error', (event) => {
					reject(event);
				}, false);
			});
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
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store, 'readwrite')
					.objectStore(this.store);
				const op = transaction.delete(key);

				op.addEventListener('success', () => {
					resolve(value);
				}, false);
				op.addEventListener('error', (event) => {
					reject(event);
				}, false);
			});
		});
	}

	/**
	 * Clear the entire space
	 *
	 * @returns Promise for the clear operation
	 */
	clear(): Promise<void> {
		return this.open().then(() => {
			return new Promise((resolve, reject) => {
				const transaction = (this.storage as IDBDatabase)
					.transaction(this.store, 'readwrite')
					.objectStore(this.store);
				const op = transaction.clear();

				op.addEventListener('success', () => {
					resolve();
				}, false);
				op.addEventListener('error', (event) => {
					reject(event);
				}, false);
			});
		});
	}
}

