/**
 * ==============================
 * Space Adapter Types
 * ==============================
 */

/**
 * Base configuration for all space adapters
 */
export interface SpaceConfiguration {
	name?: string;
	version?: string;
	store?: string;
}

/**
 * LocalStorage/SessionStorage configuration
 */
export type LocalStorageConfiguration = SpaceConfiguration;

/**
 * IndexedDB configuration with additional options
 */
export interface IndexedDBConfiguration extends SpaceConfiguration {
	props?: IDBObjectStoreParameters;
	index?: Record<string, {
		name: string;
		field: string;
		props?: IDBIndexParameters;
	}>;
}

/**
 * RemoteStorage configuration
 */
export interface RemoteStorageConfiguration extends SpaceConfiguration {
	endpoint?: string;
	props?: Record<string, string>;
}

/**
 * Generic storage value type
 */
export type StorageValue = unknown;

/**
 * Key-value result type
 */
export interface KeyValueResult {
	key: string;
	value: StorageValue;
}

/**
 * Upgrade callback function type
 */
export type UpgradeCallback<T = unknown> = (adapter: T, event?: IDBVersionChangeEvent) => Promise<void>;

/**
 * Base interface for all space adapters
 */
export interface SpaceAdapterInterface {
	name: string;
	version: string;
	store: string;

	open(): Promise<this>;
	set(key: string | null, value: StorageValue): Promise<KeyValueResult>;
	update(key: string, value: StorageValue): Promise<KeyValueResult>;
	get(key: string): Promise<StorageValue>;
	getAll(): Promise<Record<string, StorageValue>>;
	contains(key: string): Promise<void>;
	upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback): Promise<void>;
	rename(name: string): Promise<void>;
	key(index: number, full?: boolean): Promise<string>;
	keys(full?: boolean): Promise<string[]>;
	remove(key: string): Promise<StorageValue>;
	clear(): Promise<void>;
	configuration?(config: SpaceConfiguration): void;
}

/**
 * Space adapter constructor type
 */
export type SpaceAdapterConstructor = new (config: SpaceConfiguration) => SpaceAdapterInterface;

