/**
 * ==============================
 * IndexedDB Adapter
 * ==============================
 */

import type { IndexedDBConfiguration, StorageValue, KeyValueResult, UpgradeCallback, SpaceAdapterInterface } from './types';
import { versionToNumber } from './types';

/**
 * Error thrown when a key is not found in storage
 */
export class KeyNotFoundError extends Error {
  constructor(key: string) {
    super(`Key "${key}" not found in IndexedDB`);
    this.name = 'KeyNotFoundError';
  }
}

/**
 * The IndexedDB Adapter provides the Space Class the ability to interact
 * with the IndexedDB API found in most modern browsers.
 */
export class IndexedDB implements SpaceAdapterInterface {
  public name: string;
  public version: string;
  public store: string;
  public props: IDBObjectStoreParameters;
  public index: Record<string, { name: string; field: string; props?: IDBIndexParameters }>;
  public keyPath: string | null;
  public numericVersion: number;
  public upgrades: Record<string, UpgradeCallback<IndexedDB>>;
  public storage: IDBDatabase | undefined;
  private _openPromise: Promise<this> | undefined;
  private _failedUpgradeError: unknown | undefined;

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

    this.keyPath = typeof props?.keyPath === 'string' ? props.keyPath : null;
    this.upgrades = {};

    this.numericVersion = versionToNumber(version);
  }

  /**
   * Modify the configuration
   *
   * @param config - Configuration object to set up
   */
  configuration(config: IndexedDBConfiguration): void {
    if (config.name !== undefined) {
      this.name = config.name;
    }

    if (config.version !== undefined) {
      this.version = config.version;
      this.numericVersion = versionToNumber(config.version);
    }

    if (config.store !== undefined) {
      this.store = config.store;
    }

    if (config.props !== undefined) {
      const newKeyPath = typeof config.props.keyPath === 'string' ? config.props.keyPath : null;

      if (this.storage instanceof IDBDatabase && newKeyPath !== this.keyPath) {
        // Mutating keyPath after open would silently route writes through the
        // wrong field while the on-disk store still uses the original keyPath.
        // Force the caller to bump the version and migrate via upgrade().
        throw new Error(
          `Cannot change keyPath after the IndexedDB has been opened. ` +
          `The on-disk store still uses keyPath "${this.keyPath ?? '<out-of-line>'}"; ` +
          `bump the version and migrate via upgrade() instead.`
        );
      }
      this.props = config.props;
      this.keyPath = newKeyPath;
    }
  }

  private static isRecord(value: StorageValue): value is Record<string, unknown> {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;
  }

  private valueWithInlineKey(key: string, value: StorageValue): Record<string, unknown> {
    if (!IndexedDB.isRecord(value)) {
      throw new Error(`IndexedDB store "${this.store}" uses keyPath "${this.keyPath}" and requires object values when setting an explicit key.`);
    }

    return { ...value, [this.keyPath as string]: key };
  }

  private mergeValues(currentValue: StorageValue, value: StorageValue): StorageValue {
    if (IndexedDB.isRecord(currentValue) && IndexedDB.isRecord(value)) {
      return { ...currentValue, ...value };
    }

    return value;
  }

  /**
   * Open the Storage Object
   *
   * @returns Promise resolving to this adapter
   */
  async open(): Promise<this> {
    if (this.name === '') {
      throw new Error('IndexedDB requires a name. No name has been defined for this space.');
    }

    if (this.store === '') {
      throw new Error('IndexedDB requires a store name. No store has been defined for this space.');
    }

    if (this.numericVersion < 1) {
      throw new Error('IndexedDB requires a version >= 1. No valid version has been defined for this space.');
    }

    if (this._failedUpgradeError !== undefined) {
      // Async upgrade failure persists across open() calls. The on-disk
      // version was already bumped before the failure surfaced, so re-opening
      // would skip the upgrade and silently use possibly-inconsistent data.
      // The caller must handle recovery (delete the database, ship a new
      // version, or instantiate a fresh adapter).
      throw this._failedUpgradeError;
    }

    if (this.storage instanceof IDBDatabase) {
      return this;
    }

    if (this._openPromise) {
      return this._openPromise;
    }

    this._openPromise = (async () => {
      const asyncUpgradeErrors: unknown[] = [];
      const upgradePromises: Promise<void>[] = [];

      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(this.name, this.numericVersion);
        let upgradeError: unknown;

        request.onerror = (event) => {
          if (upgradeError instanceof Error) {
            reject(upgradeError);
          } else if (upgradeError !== undefined) {
            reject(new Error(`IndexedDB "${this.name}" upgrade failed`, { cause: upgradeError }));
          } else {
            reject(new Error(`Failed to open IndexedDB "${this.name}": ${(event.target as IDBOpenDBRequest).error?.message}`));
          }
        };

        request.onsuccess = (event) => {
          resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          try {
            if (event.oldVersion < 1) {
              // Create all the needed Stores
              const store = db.createObjectStore(this.store, this.props);

              for (const indexKey of Object.keys(this.index)) {
                const idx = this.index[indexKey];
                store.createIndex(idx.name, idx.field, idx.props);
              }
            } else {
              // Check what upgrade functions have been declared
              const availableUpgrades = Object.keys(this.upgrades).sort((a, b) => {
                const [aOld] = a.split('::').map(Number);
                const [bOld] = b.split('::').map(Number);
                return aOld - bOld;
              });

              const startFrom = availableUpgrades.findIndex((u) => {
                const [old] = u.split('::');
                return parseInt(old) === event.oldVersion;
              });

              if (startFrom > -1) {
                const upgradesToApply = availableUpgrades.slice(startFrom).filter((u) => {
                  const [old, next] = u.split('::');
                  return parseInt(old) < this.numericVersion && parseInt(next) <= this.numericVersion;
                });

                for (const upgradeKey of upgradesToApply) {
                  const result = this.upgrades[upgradeKey].call(this, this, event);

                  if (result instanceof Promise) {
                    // Attach the catch handler immediately so the rejection is
                    // never observed as unhandled while we wait for the
                    // version-change transaction to commit. We re-surface the
                    // collected errors after all upgrades settle.
                    upgradePromises.push(result.catch((err) => { asyncUpgradeErrors.push(err); }));
                  }
                }
              }
            }
          } catch (error) {
            upgradeError = error;
            (event.target as IDBOpenDBRequest).transaction?.abort();
          }
        };
      });

      this.storage = db;

      // Wait for any async upgrade work to settle. The IDB version-change
      // transaction commits as soon as `onsuccess` fires, so by the time
      // these settle the version bump is already on disk and we can't roll
      // back. We still surface failures so the caller knows the migration
      // didn't complete and can stop using the potentially-inconsistent
      // data. Upgrades that need transactional safety must run
      // synchronously inside onupgradeneeded.
      await Promise.all(upgradePromises);

      if (asyncUpgradeErrors.length > 0) {
        const error = asyncUpgradeErrors.length === 1
          ? asyncUpgradeErrors[0]
          : new AggregateError(
            asyncUpgradeErrors as Error[],
            `IndexedDB "${this.name}": ${asyncUpgradeErrors.length} async upgrade callback(s) rejected after the version-change transaction committed.`
          );

        // Poison the adapter: close the connection, drop the storage handle,
        // and remember the failure so subsequent open() calls also reject.
        try { db.close(); } catch { /* close() never throws in spec, but be defensive */ }
        this.storage = undefined;
        this._failedUpgradeError = error;
        throw error;
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
   * Store a key-value pair. Because of the nature of IndexedDB,
   * stored values must be JSON objects.
   *
   * @param key - Key with which this value will be saved
   * @param value - Value to save
   * @returns Promise with key and value
   */
  async set(key: string | null = null, value: StorageValue): Promise<KeyValueResult> {
    await this.open();
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readwrite')
        .objectStore(this.store);

      let op: IDBRequest;

      if (key !== null) {
        if (this.keyPath) {
          op = transaction.put(this.valueWithInlineKey(key, value));
        } else {
          op = transaction.put(value, key);
        }
      } else {
        op = transaction.add(value);
      }

      op.addEventListener('success', (event) => {
        resolve({ key: String((event.target as IDBRequest).result), value });
      });

      op.addEventListener('error', (event) => {
        reject(new Error(`Failed to set key "${key}": ${(event.target as IDBRequest).error?.message}`));
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
  async update(key: string, value: StorageValue): Promise<KeyValueResult> {
    try {
      const currentValue = await this.get(key);

      if (typeof currentValue === 'undefined') {
        return this.set(key, value);
      }

      return new Promise((resolve, reject) => {
        const transaction = (this.storage as IDBDatabase)
          .transaction(this.store, 'readwrite')
          .objectStore(this.store);

        const mergedValue = this.mergeValues(currentValue, value);
        const op = this.keyPath
          ? transaction.put(this.valueWithInlineKey(key, mergedValue))
          : transaction.put(mergedValue, key);

        op.addEventListener('success', (event) => {
          resolve({ key: String((event.target as IDBRequest).result), value });
        });

        op.addEventListener('error', (event) => {
          reject(new Error(`Failed to update key "${key}": ${(event.target as IDBRequest).error?.message}`));
        });
      });
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
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readonly')
        .objectStore(this.store);

      const op = transaction.get(key);

      op.addEventListener('success', (event) => {
        const value = (event.target as IDBRequest).result;
        if (typeof value !== 'undefined' && value !== null) {
          resolve(value);
        } else {
          reject(new KeyNotFoundError(key));
        }
      });

      op.addEventListener('error', (event) => {
        reject(new Error(`Failed to get key "${key}": ${(event.target as IDBRequest).error?.message}`));
      });
    });
  }

  /**
   * Retrieves all the values in the space in a key-value JSON object.
   * If the store uses an inline keyPath, the keyPath property is removed from
   * the returned items to match the Space key-value shape.
   *
   * @returns Promise resolving to all values
   */
  async getAll(): Promise<Record<string, StorageValue>> {
    await this.open();
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readonly')
        .objectStore(this.store);

      const op = transaction.openCursor();
      const keyPath = this.keyPath;
      const results: Record<string, StorageValue> = {};

      op.addEventListener('success', (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;

        if (!cursor) {
          resolve(results);
          return;
        }

        const key = String(cursor.key);
        const item = cursor.value;

        if (keyPath && IndexedDB.isRecord(item)) {
          const id = item[keyPath] ?? key;
          // Create a shallow copy to avoid mutating the original item
          const itemCopy = { ...item };
          delete itemCopy[keyPath];
          results[String(id)] = itemCopy;
        } else {
          results[key] = item;
        }

        cursor.continue();
      });

      op.addEventListener('error', (event) => {
        reject(new Error(`Failed to get all items: ${(event.target as IDBRequest).error?.message}`));
      });
    });
  }

  /**
   * Check if the space contains a given key.
   *
   * @param key - Key to look for
   * @returns Promise that resolves if key exists
   */
  async contains(key: string): Promise<void> {
    await this.get(key);
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
  async upgrade(oldVersion: string, newVersion: string, callback: UpgradeCallback<IndexedDB>): Promise<void> {
    const key = `${versionToNumber(oldVersion)}::${versionToNumber(newVersion)}`;
    this.upgrades[key] = callback;
    return Promise.resolve();
  }

  /**
   * Renaming the space is not possible with the IndexedDB adapter therefore
   * this function always gets rejected.
   *
   * @returns Promise rejection
   */
  rename(): Promise<never> {
    return Promise.reject(new Error('IndexedDB does not support renaming databases. Create a new database and migrate data manually.'));
  }

  /**
   * Getting a key by its index is not possible in this adapter, therefore this
   * function always gets rejected.
   *
   * @returns Promise rejection
   */
  key(): Promise<never> {
    return Promise.reject(new Error('IndexedDB does not support getting keys by index. Use keys() to get all keys.'));
  }

  /**
   * Return all keys stored in the space.
   *
   * @returns Promise resolving to array of keys
   */
  async keys(): Promise<string[]> {
    await this.open();
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readonly')
        .objectStore(this.store);

      const op = transaction.getAllKeys();

      op.addEventListener('success', (event) => {
        resolve((event.target as IDBRequest).result.map(String));
      }, false);

      op.addEventListener('error', (event) => {
        reject(new Error(`Failed to get keys: ${(event.target as IDBRequest).error?.message}`));
      }, false);
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
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readwrite')
        .objectStore(this.store);

      const op = transaction.delete(key);

      op.addEventListener('success', () => {
        resolve(value);
      }, false);

      op.addEventListener('error', (event) => {
        reject(new Error(`Failed to delete key "${key}": ${(event.target as IDBRequest).error?.message}`));
      }, false);
    });
  }

  /**
   * Clear the entire space
   *
   * @returns Promise for the clear operation
   */
  async clear(): Promise<void> {
    await this.open();
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readwrite')
        .objectStore(this.store);

      const op = transaction.clear();

      op.addEventListener('success', () => {
        resolve();
      }, false);

      op.addEventListener('error', (event) => {
        reject(new Error(`Failed to clear store: ${(event.target as IDBRequest).error?.message}`));
      }, false);
    });
  }
}
