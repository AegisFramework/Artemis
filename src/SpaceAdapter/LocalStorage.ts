/**
 * ==============================
 * Local Storage Adapter
 * ==============================
 */

import type { LocalStorageConfiguration, StorageValue, KeyValueResult, UpgradeCallback, SpaceAdapterInterface } from './types';
import { versionToNumber } from './types';

/**
 * Error thrown when a key is not found in storage
 */
export class KeyNotFoundError extends Error {
	constructor(key: string) {
		super(`Key "${key}" not found in storage`);
		this.name = 'KeyNotFoundError';
	}
}

/**
 * The Local Storage Adapter provides the Space Class the ability to interact
 * with the localStorage API found in most modern browsers.
 */
export class LocalStorage implements SpaceAdapterInterface {
	public name: string;
	public version: string;
	public store: string;
	public id: string;
	public numericVersion: number;
	public upgrades: Record<string, UpgradeCallback<LocalStorage>>;
	public storage: Storage | undefined;
	private _openPromise: Promise<this> | undefined;

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

		this.numericVersion = versionToNumber(version);
		this.id = this.computeId();
	}

	/**
	 * Compute the storage ID based on current name, version, and store
	 *
	 * @returns The computed ID string
	 */
	private computeId(): string {
		if (this.name !== '' && this.version !== '' && this.store !== '') {
			return `${this.name}::${this.store}::${this.version}_`;
		} else if (this.name !== '' && this.version !== '') {
			return `${this.name}::${this.version}_`;
		} else if (this.name !== '') {
			return `${this.name}::_`;
		} else {
			return '';
		}
	}

	/**
	 * Modify the configuration
	 *
	 * @param config - Configuration object to set up
	 */
	configuration(config: LocalStorageConfiguration): void {
		if (config.name !== undefined) this.name = config.name;
		if (config.version !== undefined) {
			this.version = config.version;
			this.numericVersion = versionToNumber(config.version);
		}
		if (config.store !== undefined) this.store = config.store;

		// Recalculate the ID after configuration changes
		this.id = this.computeId();
	}

	/**
	 * Open the Storage Object
	 *
	 * @returns Promise resolving to this adapter
	 */
	async open(): Promise<this> {
		// Already opened
		if (this.storage instanceof Storage) {
			return this;
		}

		// Currently opening - wait for it
		if (this._openPromise) {
			return this._openPromise;
		}

		// Start opening
		this._openPromise = (async () => {
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
					const oldVersionNumeric = versionToNumber(oldVersion);

					if (oldVersionNumeric < this.numericVersion) {
						const availableUpgrades = Object.keys(this.upgrades).sort((a, b) => {
							const [aOld] = a.split('::').map(Number);
							const [bOld] = b.split('::').map(Number);
							return aOld - bOld;
						});

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

			this.storage = window.localStorage;

			// Apply upgrades
			for (const upgradeKey of upgradesToApply) {
				try {
					await this.upgrades[upgradeKey].call(this, this);
				} catch (e) {
					console.error(e);
				}
			}

			return this;
		})();

		try {
			return await this._openPromise;
		} finally {
			this._openPromise = undefined;
		}
	}

	/**
	 * Store a key-value pair
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and value
	 */
	async set(key: string, value: StorageValue): Promise<KeyValueResult> {
		await this.open();
		if (typeof value === 'object') {
			(this.storage as Storage).setItem(this.id + key, JSON.stringify(value));
		} else {
			(this.storage as Storage).setItem(this.id + key, String(value));
		}
		return { key, value };
	}

	/**
	 * Update a key-value pair. The update method will use Object.assign()
	 * in the case of objects so no value is lost.
	 *
	 * @param key - Key with which this value will be saved
	 * @param value - Value to save
	 * @returns Promise with key and value
	 */
	async update(key: string, value: StorageValue): Promise<KeyValueResult> {
		try {
			const currentValue = await this.get(key);
			if (typeof currentValue === 'object' && currentValue !== null) {
				if (typeof value === 'object' && value !== null) {
					value = { ...(currentValue as object), ...(value as object) };
				}
				(this.storage as Storage).setItem(this.id + key, JSON.stringify(value));
			} else {
				(this.storage as Storage).setItem(this.id + key, String(value));
			}
			return { key, value };
		} catch {
			return this.set(key, value);
		}
	}

	/**
	 * Retrieves a value from storage given its key
	 *
	 * @param key - Key with which the value was saved
	 * @returns Promise resolving to the retrieved value
	 */
	async get(key: string): Promise<StorageValue> {
		await this.open();
		const rawValue = (this.storage as Storage).getItem(this.id + key);

		if (rawValue === null) {
			throw new KeyNotFoundError(key);
		}

		try {
			const parsed = JSON.parse(rawValue);
			if (parsed && typeof parsed === 'object') {
				return parsed;
			}
			return rawValue;
		} catch {
			// Unable to parse to JSON, return raw value
			return rawValue;
		}
	}

	/**
	 * Retrieves all the values in the space in a key-value JSON object
	 *
	 * @returns Promise resolving to all values
	 */
	async getAll(): Promise<Record<string, StorageValue>> {
		const keys = await this.keys();
		const values: Record<string, StorageValue> = {};

		for (const key of keys) {
			try {
				values[key] = await this.get(key);
			} catch {
				// Skip keys that fail to retrieve
			}
		}

		return values;
	}

	/**
	 * Check if the space contains a given key.
	 *
	 * @param key - Key to look for
	 * @returns Promise that resolves if key exists
	 */
	async contains(key: string): Promise<void> {
		const keys = await this.keys();
		if (keys.includes(key)) {
			return;
		} else {
			throw new KeyNotFoundError(key);
		}
	}

	/**
	 * Upgrade a Space Version
	 *
	 * @param oldVersion - The version of the storage to be upgraded
	 * @param newVersion - The version to be upgraded to
	 * @param callback - Function to transform the old stored values
	 * @returns Promise
	 */
	async upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback<LocalStorage>): Promise<void> {
		const key = `${versionToNumber(oldVersion)}::${versionToNumber(newVersion)}`;
		this.upgrades[key] = callback;
		return Promise.resolve();
	}

	/**
	 * Rename a Space
	 *
	 * @param name - New name to be used
	 * @returns Promise for the rename operation
	 */
	async rename(name: string): Promise<void> {
		if (this.name === name) {
			throw new Error('Cannot rename: new name is identical to current name');
		}

		const keys = await this.keys();
		const oldId = this.id;
		this.name = name;
		this.id = this.computeId();

		for (const key of keys) {
			const rawValue = (this.storage as Storage).getItem(`${oldId}${key}`);
			if (rawValue !== null) {
				// Directly copy the raw value to avoid double-encoding
				(this.storage as Storage).setItem(this.id + key, rawValue);
				(this.storage as Storage).removeItem(`${oldId}${key}`);
			}
		}
	}

	/**
	 * Get the key that corresponds to a given index in the storage.
	 * Only considers keys belonging to this space.
	 *
	 * @param index - Index to get the key from
	 * @param full - Whether to return the full key name including space id
	 * @returns Promise resolving to the key's name
	 */
	async key(index: number, full: boolean = false): Promise<string> {
		const spaceKeys = await this.keys(full);

		if (index < 0 || index >= spaceKeys.length) {
			throw new Error(`Index ${index} out of bounds. Space has ${spaceKeys.length} keys.`);
		}

		return spaceKeys[index];
	}

	/**
	 * Return all keys stored in the space.
	 *
	 * @param full - Whether to return the full key name including space id
	 * @returns Promise resolving to array of keys
	 */
	async keys(full: boolean = false): Promise<string[]> {
		await this.open();
		return Object.keys(this.storage as Storage).filter((key) => {
			return key.indexOf(this.id) === 0;
		}).map((key) => {
			if (full === true) {
				return key;
			} else {
				return key.replace(this.id, '');
			}
		});
	}

	/**
	 * Delete a value from the space given its key
	 *
	 * @param key - Key of the item to delete
	 * @returns Promise resolving to the value of the deleted object
	 */
	async remove(key: string): Promise<StorageValue> {
		const value = await this.get(key);
		(this.storage as Storage).removeItem(this.id + key);
		return value;
	}

	/**
	 * Clear the entire space
	 *
	 * @returns Promise for the clear operation
	 */
	async clear(): Promise<void> {
		const keys = await this.keys();

		for (const key of keys) {
			(this.storage as Storage).removeItem(this.id + key);
		}
	}
}
