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
export declare class IndexedDB {
    name: string;
    version: string;
    store: string;
    props: IDBObjectStoreParameters;
    index: Record<string, {
        name: string;
        field: string;
        props?: IDBIndexParameters;
    }>;
    keyPath: string;
    numericVersion: number;
    upgrades: Record<string, UpgradeCallback<IndexedDB>>;
    storage: IDBDatabase | Promise<IDBDatabase> | undefined;
    /**
     * Create a new IndexedDB. Differently from Local and Session Storages, the
     * IndexedDB Adapter requires a mandatory name, version and store name.
     *
     * @param configuration - Configuration Object for the Adapter
     */
    constructor({ name, version, store, props, index }: IndexedDBConfiguration);
    /**
     * Modify the configuration
     *
     * @param config - Configuration object to set up
     */
    configuration(config: IndexedDBConfiguration): void;
    /**
     * Open the Storage Object
     *
     * @returns Promise resolving to this adapter
     */
    open(): Promise<this>;
    /**
     * Store a key-value pair. Because of the nature of IndexedDB,
     * stored values must be JSON objects.
     *
     * @param key - Key with which this value will be saved
     * @param value - Value to save
     * @returns Promise with key and value
     */
    set(key: string | null | undefined, value: StorageValue): Promise<KeyValueResult>;
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
     * Upgrade a Space Version. Upgrades must be declared before the open()
     * method is executed.
     *
     * @param oldVersion - The version to be upgraded
     * @param newVersion - The version to be upgraded to
     * @param callback - Function to transform the old stored values
     * @returns Promise
     */
    upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback<IndexedDB>): Promise<void>;
    /**
     * Helper for the upgrade progress by executing callbacks in order
     */
    private _upgrade;
    /**
     * Renaming the space is not possible with the IndexedDB adapter therefore
     * this function always gets rejected.
     *
     * @returns Promise rejection
     */
    rename(): Promise<never>;
    /**
     * Getting a key by its index is not possible in this adapter, therefore this
     * function always gets rejected.
     *
     * @returns Promise rejection
     */
    key(): Promise<never>;
    /**
     * Return all keys stored in the space.
     *
     * @returns Promise resolving to array of keys
     */
    keys(): Promise<string[]>;
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
//# sourceMappingURL=IndexedDB.d.ts.map