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
	props?: Record<string, unknown>;
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

/**
 * Convert a version string to a numeric value for comparison.
 * Each segment is padded to 5 digits to support versions up to 99999.x.x
 *
 * @param version - Version string (e.g., "1.0.0", "10.2.15")
 * @returns Numeric version for comparison
 */
export function versionToNumber(version: string): number {
	if (version === '') {
		return 0;
	}

	const segments = version.split('.');
	let result = 0;
	const multipliers = [1000000000000, 100000000, 10000]; // Support up to 4 segments

	for (let i = 0; i < Math.min(segments.length, multipliers.length); i++) {
		const segment = parseInt(segments[i], 10) || 0;
		result += segment * multipliers[i];
	}

	return result;
}

/**
 * Compare two version strings
 *
 * @param v1 - First version string
 * @param v2 - Second version string
 * @returns -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
	const n1 = versionToNumber(v1);
	const n2 = versionToNumber(v2);

	if (n1 < n2) return -1;
	if (n1 > n2) return 1;
	return 0;
}

/**
 * Deep clone a value to prevent mutation
 *
 * @param value - Value to clone
 * @returns Cloned value
 */
export function cloneValue<T>(value: T): T {
	if (value === null || typeof value !== 'object') {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map(item => cloneValue(item)) as T;
	}

	const cloned: Record<string, unknown> = {};
	for (const key of Object.keys(value as object)) {
		cloned[key] = cloneValue((value as Record<string, unknown>)[key]);
	}
	return cloned as T;
}

/**
 * Normalize a URL by ensuring proper slash handling
 *
 * @param base - Base URL
 * @param path - Path to append
 * @returns Normalized URL
 */
export function normalizeUrl(base: string, path: string): string {
	const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${normalizedBase}${normalizedPath}`;
}
