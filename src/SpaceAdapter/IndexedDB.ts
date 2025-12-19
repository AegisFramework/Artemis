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

    this.numericVersion = versionToNumber(version);
  }

  /**
   * Modify the configuration
   *
   * @param config - Configuration object to set up
   */
  configuration(config: IndexedDBConfiguration): void {
    if (config.name !== undefined) this.name = config.name;
    if (config.version !== undefined) {
      this.version = config.version;
      this.numericVersion = versionToNumber(config.version);
    }
    if (config.store !== undefined) this.store = config.store;
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

    if (this.storage instanceof IDBDatabase) {
      return this;
    } else if (this.storage instanceof Promise) {
      return await (this.storage as unknown as Promise<this>);
    } else {
      const openTask = (async () => {
        let upgradeEvent: IDBVersionChangeEvent | undefined;
        let upgradesToApply: string[] = [];

        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = window.indexedDB.open(this.name, this.numericVersion);

          request.onerror = (event) => {
            reject(new Error(`Failed to open IndexedDB "${this.name}": ${(event.target as IDBOpenDBRequest).error?.message}`));
          };

          request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
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
                // Transaction completed
              });
            }
          };
        });

        this.storage = db;

        // Apply upgrades
        for (const upgradeKey of upgradesToApply) {
          try {
            await this.upgrades[upgradeKey].call(this, this, upgradeEvent);
          } catch (e) {
            console.error(e);
          }
        }

        return this;
      })();

      this.storage = openTask as unknown as Promise<IDBDatabase>;
      return await openTask;
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
        const temp: Record<string, unknown> = {};

        temp[this.keyPath] = key;
        op = transaction.put({ ...temp, ...(value as object) });
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

        const op = transaction.put({ ...(currentValue as object), ...(value as object) });

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
   * Note: The keyPath property is preserved in the returned items.
   *
   * @returns Promise resolving to all values
   */
  async getAll(): Promise<Record<string, StorageValue>> {
    await this.open();
    return new Promise((resolve, reject) => {
      const transaction = (this.storage as IDBDatabase)
        .transaction(this.store, 'readonly')
        .objectStore(this.store);

      const op = transaction.getAll();

      op.addEventListener('success', (event) => {
        const results: Record<string, StorageValue> = {};
        const items = (event.target as IDBRequest).result as Record<string, unknown>[];

        items.forEach((item) => {
          const id = item[this.keyPath] as string;
          // Create a shallow copy to avoid mutating the original item
          const itemCopy = { ...item };
          delete itemCopy[this.keyPath];
          results[id] = itemCopy;
        });

        resolve(results);
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
