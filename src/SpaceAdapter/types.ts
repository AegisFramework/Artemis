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
export type UpgradeCallback<T = unknown> = (adapter: T, event?: IDBVersionChangeEvent) => void | Promise<void>;

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
 * Clone a value to isolate it from later mutation by the caller.
 *
 * Best-effort: `structuredClone` is preferred when available, with manual
 * fallbacks for Date / RegExp / Map / Set / arrays / plain objects.
 * Custom class instances (anything whose prototype is not `Object.prototype`
 * or `null`) are returned **by reference** — preserving methods/identity
 * matters more than isolating mutation, and there is no general way to
 * reconstruct an arbitrary class instance.
 *
 * @param value - Value to clone
 * @returns Cloned value, or the same reference for class instances
 */
export function cloneValue<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Custom class instances pass through by reference. structuredClone would
  // happily clone them but strip the prototype, breaking methods. Returning
  // the original reference preserves identity and behavior; isolating
  // mutation of class state is the caller's responsibility.
  if (
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(value instanceof Map) &&
    !(value instanceof Set)
  ) {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      return value;
    }
  }

  if (typeof globalThis.structuredClone === 'function') {
    try {
      return globalThis.structuredClone(value);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'DataCloneError') {
        throw error;
      }
    }
  }

  if (Array.isArray(value)) {
    return value.map(item => cloneValue(item)) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  if (value instanceof Map) {
    const cloned = cloneCollection(value, () => new Map<unknown, unknown>());

    value.forEach((mapValue, mapKey) => {
      cloned.set(cloneValue(mapKey), cloneValue(mapValue));
    });

    return cloned as T;
  }

  if (value instanceof Set) {
    const cloned = cloneCollection(value, () => new Set<unknown>());

    value.forEach((setValue) => {
      cloned.add(cloneValue(setValue));
    });

    return cloned as T;
  }

  const cloned: Record<string, unknown> = {};

  for (const key of Object.keys(value as object)) {
    cloned[key] = cloneValue((value as Record<string, unknown>)[key]);
  }

  return cloned as T;
}

/**
 * Construct an empty container that preserves the original's subclass when
 * possible. Falls back to the built-in if the subclass constructor needs
 * arguments we don't have.
 */
function cloneCollection<T extends Map<unknown, unknown> | Set<unknown>>(value: T, fallback: () => T): T {
  const Ctor = (value as object).constructor as new () => T;

  try {
    return new Ctor();
  } catch {
    return fallback();
  }
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
