/**
 * ==============================
 * Local Storage Adapter
 * ==============================
 */
import type { LocalStorageConfiguration, StorageValue, KeyValueResult, UpgradeCallback, SpaceAdapterInterface } from './types';
/**
 * Error thrown when a key is not found in storage
 */
export declare class KeyNotFoundError extends Error {
    constructor(key: string);
}
/**
 * The Local Storage Adapter provides the Space Class the ability to interact
 * with the localStorage API found in most modern browsers.
 */
export declare class LocalStorage implements SpaceAdapterInterface {
    name: string;
    version: string;
    store: string;
    id: string;
    numericVersion: number;
    upgrades: Record<string, UpgradeCallback<LocalStorage>>;
    storage: Storage | undefined;
    private _openPromise;
    /**
     * Create a new LocalStorage. If no configuration is provided, the LocalStorage
     * global object is used. The LocalStorage Adapter can provide independency
     * by store name and space name.
     *
     * @param configuration - Configuration Object for the Adapter
     */
    constructor({ name, version, store }: LocalStorageConfiguration);
    /**
     * Compute the storage ID based on current name, version, and store
     *
     * @returns The computed ID string
     */
    private computeId;
    /**
     * Modify the configuration
     *
     * @param config - Configuration object to set up
     */
    configuration(config: LocalStorageConfiguration): void;
    /**
     * Open the Storage Object
     *
     * @returns Promise resolving to this adapter
     */
    open(): Promise<this>;
    /**
     * Store a key-value pair
     *
     * @param key - Key with which this value will be saved
     * @param value - Value to save
     * @returns Promise with key and value
     */
    set(key: string, value: StorageValue): Promise<KeyValueResult>;
    /**
     * Update a key-value pair. The update method will use Object.assign()
     * in the case of objects so no value is lost.
     *
     * @param key - Key with which this value will be saved
     * @param value - Value to save
     * @returns Promise with key and value
     */
    update(key: string, value: StorageValue): Promise<KeyValueResult>;
    /**
     * Retrieves a value from storage given its key
     *
     * @param key - Key with which the value was saved
     * @returns Promise resolving to the retrieved value
     */
    get(key: string): Promise<StorageValue>;
    /**
     * Retrieves all the values in the space in a key-value JSON object
     *
     * @returns Promise resolving to all values
     */
    getAll(): Promise<Record<string, StorageValue>>;
    /**
     * Check if the space contains a given key.
     *
     * @param key - Key to look for
     * @returns Promise that resolves if key exists
     */
    contains(key: string): Promise<void>;
    /**
     * Upgrade a Space Version
     *
     * @param oldVersion - The version of the storage to be upgraded
     * @param newVersion - The version to be upgraded to
     * @param callback - Function to transform the old stored values
     * @returns Promise
     */
    upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback<LocalStorage>): Promise<void>;
    /**
     * Rename a Space
     *
     * @param name - New name to be used
     * @returns Promise for the rename operation
     */
    rename(name: string): Promise<void>;
    /**
     * Get the key that corresponds to a given index in the storage.
     * Only considers keys belonging to this space.
     *
     * @param index - Index to get the key from
     * @param full - Whether to return the full key name including space id
     * @returns Promise resolving to the key's name
     */
    key(index: number, full?: boolean): Promise<string>;
    /**
     * Return all keys stored in the space.
     *
     * @param full - Whether to return the full key name including space id
     * @returns Promise resolving to array of keys
     */
    keys(full?: boolean): Promise<string[]>;
    /**
     * Delete a value from the space given its key
     *
     * @param key - Key of the item to delete
     * @returns Promise resolving to the value of the deleted object
     */
    remove(key: string): Promise<StorageValue>;
    /**
     * Clear the entire space
     *
     * @returns Promise for the clear operation
     */
    clear(): Promise<void>;
}
//# sourceMappingURL=LocalStorage.d.ts.map