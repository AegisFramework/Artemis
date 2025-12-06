/**
 * ==============================
 * Space
 * ==============================
 */
import { LocalStorage } from './SpaceAdapter/LocalStorage';
import { SessionStorage } from './SpaceAdapter/SessionStorage';
import { IndexedDB } from './SpaceAdapter/IndexedDB';
import { RemoteStorage } from './SpaceAdapter/RemoteStorage';
import type { SpaceConfiguration, StorageValue, KeyValueResult, UpgradeCallback } from './SpaceAdapter/types';
/**
 * List of Adapters Available
 */
export declare const SpaceAdapter: {
    LocalStorage: typeof LocalStorage;
    SessionStorage: typeof SessionStorage;
    IndexedDB: typeof IndexedDB;
    RemoteStorage: typeof RemoteStorage;
};
/**
 * Space adapter type (any of the available adapters)
 */
export type SpaceAdapterType = LocalStorage | SessionStorage | IndexedDB | RemoteStorage;
/**
 * Space adapter constructor type
 */
export type SpaceAdapterConstructor = typeof LocalStorage | typeof SessionStorage | typeof IndexedDB | typeof RemoteStorage;
/**
 * Callback function type for space events
 */
export type SpaceCallback = (key: string, value: StorageValue) => void;
/**
 * Transformation function type
 */
export type TransformationFunction = (key: string, value: StorageValue) => StorageValue;
/**
 * Transformation configuration
 */
export interface Transformation {
    id: string;
    get?: TransformationFunction | null;
    set?: TransformationFunction | null;
}
/**
 * Space provides a simple wrapper for different Storage APIs. It aims to
 * provide data independence through storage namespaces and versioning, allowing
 * transparent data formatting and content modifications through versions.
 */
export declare class Space {
    private _configuration;
    adapter: SpaceAdapterType;
    callbacks: {
        create: SpaceCallback[];
        update: SpaceCallback[];
        delete: SpaceCallback[];
    };
    transformations: Record<string, Transformation>;
    /**
     * Create a new Space Object. If no name and version is defined, the global
     * LocalSpace space is used.
     *
     * @param adapter - Space Adapter to use
     * @param configuration - Configuration object for the space
     */
    constructor(adapter?: SpaceAdapterConstructor, configuration?: SpaceConfiguration);
    /**
     * Modify the space configuration, it will also be passed down to the adapter
     * using its configuration() function.
     *
     * @param object - Configuration object to set up
     * @returns Configuration object if no param was passed
     */
    configuration(object?: SpaceConfiguration | null): SpaceConfiguration | void;
    /**
     * Open the Storage Object to be used depending on the SpaceAdapter
     *
     * @returns Promise resolving to this Space
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
     * Update a key-value pair. In difference with the set() method, the update
     * method will use Object.assign() in the case of objects so no value is lost.
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
     * Iterate over every value in the space
     *
     * @param callback - A callback function receiving the key and value
     * @returns Promise resolving when all callbacks have been resolved
     */
    each(callback: (key: string, value: StorageValue) => unknown): Promise<unknown[]>;
    /**
     * Check if a space contains a given key. Not all adapters may give this information
     *
     * @param key - Key to look for
     * @returns Promise that resolves if key exists
     */
    contains(key: string): Promise<void>;
    /**
     * Upgrade a Space Version. Not all adapters may provide this functionality
     *
     * @param oldVersion - The version of the storage to be upgraded
     * @param newVersion - The version to be upgraded to
     * @param callback - Function to transform the old stored values
     * @returns Promise for the upgrade operation
     */
    upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback): Promise<this>;
    /**
     * Rename a Space. Not all adapters may provide this functionality
     *
     * @param name - New name to be used
     * @returns Promise for the rename operation
     */
    rename(name: string): Promise<void>;
    /**
     * Add a callback function to be run every time a value is created.
     *
     * @param callback - Callback Function. Key and Value pair will be sent as parameters.
     */
    onCreate(callback: SpaceCallback): void;
    /**
     * Add a callback function to be run every time a value is updated.
     *
     * @param callback - Callback Function. Key and Value pair will be sent as parameters.
     */
    onUpdate(callback: SpaceCallback): void;
    /**
     * Add a callback function to be run every time a value is deleted.
     *
     * @param callback - Callback Function. Key and Value pair will be sent as parameters.
     */
    onDelete(callback: SpaceCallback): void;
    /**
     * Add a transformation function to the space.
     *
     * @param transformation - Transformation configuration with id, get, and set functions
     */
    addTransformation({ id, get, set }: Transformation): void;
    /**
     * Remove a transformation function given its id
     *
     * @param id - Name or identifier of the transformation to remove
     */
    removeTransformation(id: string): void;
    /**
     * Get the key that corresponds to a given index in the storage.
     * Not all adapters may provide this functionality
     *
     * @param index - Index to get the key from
     * @param full - Whether to return the full key name including space id
     * @returns Promise resolving to the key's name
     */
    key(index: number, full?: boolean): Promise<string>;
    /**
     * Return all keys stored in the space. Not all adapters may provide this functionality
     *
     * @param full - Whether to return the full key name including space id
     * @returns Promise resolving to array of keys
     */
    keys(full?: boolean): Promise<string[]>;
    /**
     * Delete a value from the space given its key
     *
     * @param key - Key of the item to delete
     * @returns Promise that resolves after deletion
     */
    remove(key: string): Promise<void>;
    /**
     * Clear the entire space
     *
     * @returns Promise for the clear operation
     */
    clear(): Promise<void>;
}
export { LocalStorage } from './SpaceAdapter/LocalStorage';
export { SessionStorage } from './SpaceAdapter/SessionStorage';
export { IndexedDB } from './SpaceAdapter/IndexedDB';
export { RemoteStorage } from './SpaceAdapter/RemoteStorage';
export type { SpaceConfiguration, StorageValue, KeyValueResult, UpgradeCallback } from './SpaceAdapter/types';
//# sourceMappingURL=Space.d.ts.map