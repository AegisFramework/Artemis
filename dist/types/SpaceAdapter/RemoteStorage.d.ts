/**
 * ==============================
 * Remote Storage Adapter
 * ==============================
 */
import { Request } from '../Request';
import type { RequestOptions } from '../Request';
import type { RemoteStorageConfiguration, StorageValue, KeyValueResult, SpaceAdapterInterface } from './types';
/**
 * Error thrown when a key is not found in storage
 */
export declare class KeyNotFoundError extends Error {
    constructor(key: string);
}
/**
 * The Remote Storage Adapter provides the Space Class the ability to interact
 * with a server in order to handle data persistence. The server's implementation
 * is up to the developer but it will need to respond to this adapter's request
 * formatting. This adapter uses the Request class to perform its tasks.
 */
export declare class RemoteStorage implements SpaceAdapterInterface {
    name: string;
    version: string;
    store: string;
    baseEndpoint: string;
    endpoint: string;
    props: RequestOptions;
    storage: typeof Request | undefined;
    /**
     * Create a new Remote Storage. This adapter requires an endpoint URL where
     * it will make the requests.
     *
     * @param configuration - Configuration Object for the Adapter
     */
    constructor({ name, version, store, endpoint, props }: RemoteStorageConfiguration);
    /**
     * Compute the full endpoint URL
     *
     * @returns The computed endpoint URL
     */
    private computeEndpoint;
    /**
     * Modify the configuration
     *
     * @param config - Configuration object to set up
     */
    configuration(config: RemoteStorageConfiguration): void;
    /**
     * Open the Storage Object
     *
     * @returns Promise resolving to this adapter
     */
    open(): Promise<this>;
    /**
     * Store a key-value pair. This function sends a POST request to the server
     *
     * @param key - Key with which this value will be saved
     * @param value - Value to save
     * @returns Promise with key and response
     */
    set(key: string, value: StorageValue): Promise<KeyValueResult>;
    /**
     * Update a key-value pair. The update method will use Object.assign()
     * in the case of objects so no value is lost. This function sends a PUT
     * request to the server.
     *
     * @param key - Key with which this value will be saved
     * @param value - Value to save
     * @returns Promise with key and response
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
     * Check if a space contains a given key.
     *
     * @param key - Key to look for
     * @returns Promise that resolves if key exists
     */
    contains(key: string): Promise<void>;
    /**
     * Upgrading the Storage must be done on the server side, therefore this
     * function always gets rejected.
     *
     * @returns Promise rejection
     */
    upgrade(): Promise<never>;
    /**
     * Renaming the Storage must be done on the server side, therefore this
     * function always gets rejected.
     *
     * @returns Promise rejection
     */
    rename(): Promise<never>;
    /**
     * Getting a key by its index is not possible in this adapter, therefore
     * this function always gets rejected.
     *
     * @returns Promise rejection
     */
    key(): Promise<never>;
    /**
     * Return all keys stored in the space. This makes a GET request to the
     * full endpoint with a keys query parameter.
     *
     * @returns Promise resolving to array of keys
     */
    keys(): Promise<string[]>;
    /**
     * Delete a value from the space given its key. This function sends a
     * DELETE request to the server.
     *
     * @param key - Key of the item to delete
     * @returns Promise resolving to the key and response
     */
    remove(key: string): Promise<StorageValue>;
    /**
     * Clear the entire space. This function sends a DELETE request to the server.
     *
     * @returns Promise for the clear operation
     */
    clear(): Promise<void>;
}
//# sourceMappingURL=RemoteStorage.d.ts.map