/**
 * ==============================
 * Remote Storage Adapter
 * ==============================
 */

import { Request, RequestError } from '../Request';
import type { RequestOptions } from '../Request';
import type { RemoteStorageConfiguration, StorageValue, KeyValueResult, SpaceAdapterInterface } from './types';
import { normalizeUrl } from './types';

/**
 * Error thrown when a key is not found in storage
 */
export class KeyNotFoundError extends Error {
  constructor(key: string) {
    super(`Key "${key}" not found in remote storage`);
    this.name = 'KeyNotFoundError';
  }
}

/**
 * Wire-format marker. Request bodies must be JSON objects, but `Space.set`
 * accepts primitives, arrays, and class instances. We wrap those under this
 * sentinel key so a "dumb" storage server that round-trips bodies verbatim
 * can still preserve the original value. `get`/`getAll`/etc. unwrap any
 * single-key object that uses this marker so callers see the original shape.
 */
const REMOTE_VALUE_WRAPPER_KEY = '__artemis_value__';

/**
 * The Remote Storage Adapter provides the Space Class the ability to interact
 * with a server in order to handle data persistence. The server's implementation
 * is up to the developer but it will need to respond to this adapter's request
 * formatting. This adapter uses the Request class to perform its tasks.
 */
export class RemoteStorage implements SpaceAdapterInterface {
  public name: string;
  public version: string;
  public store: string;
  public baseEndpoint: string;
  public endpoint: string;
  public props: RequestOptions;
  public storage: typeof Request | undefined;

  /**
   * Create a new Remote Storage. This adapter requires an endpoint URL where
   * it will make the requests.
   *
   * @param configuration - Configuration Object for the Adapter
   */
  constructor({ name = '', version = '', store = '', endpoint = '', props = {} }: RemoteStorageConfiguration) {
    this.name = name;
    this.version = version;
    this.store = store;
    this.baseEndpoint = endpoint;
    this.endpoint = this.computeEndpoint();
    this.props = props;
  }

  private static isRecord(value: StorageValue): value is Record<string, unknown> {
    if (
      value === null ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      (typeof FormData !== 'undefined' && value instanceof FormData)
    ) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  private static looksLikeWrapper(value: StorageValue): value is Record<string, unknown> {
    return (
      RemoteStorage.isRecord(value) &&
      Object.keys(value).length === 1 &&
      Object.prototype.hasOwnProperty.call(value, REMOTE_VALUE_WRAPPER_KEY)
    );
  }

  private static toRequestData(value: StorageValue): Record<string, unknown> {
    // Wrap non-records so the body is always a JSON object. Also wrap
    // records that already match the wrapper shape (`{ __artemis_value__: X }`
    // with no other keys) so unwrap() can later distinguish "user stored a
    // record that happens to look like a wrapper" from "we wrapped a
    // primitive". Without this, the user's record would be returned as the
    // inner X.
    if (RemoteStorage.isRecord(value) && !RemoteStorage.looksLikeWrapper(value)) {
      return value;
    }
    return { [REMOTE_VALUE_WRAPPER_KEY]: value };
  }

  private static unwrapValue(value: StorageValue): StorageValue {
    if (RemoteStorage.looksLikeWrapper(value)) {
      return value[REMOTE_VALUE_WRAPPER_KEY] as StorageValue;
    }
    return value;
  }

  private static mergeValues(currentValue: StorageValue, value: StorageValue): StorageValue {
    if (RemoteStorage.isRecord(currentValue) && RemoteStorage.isRecord(value)) {
      return { ...currentValue, ...value };
    }

    return value;
  }

  private ensureOk(response: Response, key?: string): void {
    if (response.ok) {
      return;
    }

    if (response.status === 404 && key !== undefined) {
      throw new KeyNotFoundError(key);
    }

    throw new RequestError(response);
  }

  private async readJsonResponse(response: Response, key?: string): Promise<StorageValue> {
    this.ensureOk(response, key);

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text === '' ? null : JSON.parse(text);
  }

  /**
   * Compute the full endpoint URL
   *
   * @returns The computed endpoint URL
   */
  private computeEndpoint(): string {
    if (this.store) {
      return normalizeUrl(this.baseEndpoint, `${this.store}/`);
    }
    return this.baseEndpoint.endsWith('/') ? this.baseEndpoint : `${this.baseEndpoint}/`;
  }

  /**
   * Modify the configuration
   *
   * @param config - Configuration object to set up
   */
  configuration(config: RemoteStorageConfiguration): void {
    if (config.name !== undefined) this.name = config.name;
    if (config.version !== undefined) this.version = config.version;
    if (config.store !== undefined) this.store = config.store;
    if (config.endpoint !== undefined) this.baseEndpoint = config.endpoint;

    // Recalculate the endpoint after configuration changes
    this.endpoint = this.computeEndpoint();
  }

  /**
   * Open the Storage Object
   *
   * @returns Promise resolving to this adapter
   */
  async open(): Promise<this> {
    if (typeof this.storage === 'undefined') {
      this.storage = Request;
    }

    return this;
  }

  /**
   * Store a key-value pair. This function sends a POST request to the server
   *
   * @param key - Key with which this value will be saved
   * @param value - Value to save
   * @returns Promise with key and response
   */
  async set(key: string, value: StorageValue): Promise<KeyValueResult> {
    await this.open();

    const response = await this.storage!.post(this.endpoint + key, RemoteStorage.toRequestData(value), this.props);
    const json = await this.readJsonResponse(response, key);

    return { key, value: RemoteStorage.unwrapValue(json) };
  }

  /**
   * Update a key-value pair. The update method will use Object.assign()
   * in the case of objects so no value is lost. This function sends a PUT
   * request to the server.
   *
   * @param key - Key with which this value will be saved
   * @param value - Value to save
   * @returns Promise with key and response
   */
  async update(key: string, value: StorageValue): Promise<KeyValueResult> {
    await this.open();

    try {
      const currentValue = await this.get(key);
      const merged = RemoteStorage.mergeValues(currentValue, value);
      const response = await this.storage!.put(this.endpoint + key, RemoteStorage.toRequestData(merged), this.props);
      const json = await this.readJsonResponse(response, key);

      return { key, value: RemoteStorage.unwrapValue(json) };
    } catch (error) {
      if (error instanceof KeyNotFoundError) {
        return this.set(key, value);
      }

      throw error;
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

    try {
      const json = await this.storage!.json(this.endpoint + key, {}, this.props);
      return RemoteStorage.unwrapValue(json as StorageValue);
    } catch (error) {
      if (error instanceof RequestError && error.status === 404) {
        throw new KeyNotFoundError(key);
      }

      throw error;
    }
  }

  /**
   * Retrieves all the values in the space in a key-value JSON object
   *
   * @returns Promise resolving to all values
   */
  async getAll(): Promise<Record<string, StorageValue>> {
    await this.open();
    const raw = await this.storage!.json<Record<string, StorageValue>>(this.endpoint, {}, this.props);

    if (raw === null || typeof raw !== 'object') {
      return {};
    }

    const unwrapped: Record<string, StorageValue> = {};

    for (const [key, value] of Object.entries(raw)) {
      unwrapped[key] = RemoteStorage.unwrapValue(value);
    }

    return unwrapped;
  }

  /**
   * Check if a space contains a given key.
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
   * Upgrading the Storage must be done on the server side, therefore this
   * function always gets rejected.
   *
   * @returns Promise rejection
   */
  upgrade(): Promise<never> {
    return Promise.reject(new Error('RemoteStorage cannot be upgraded from the client. Upgrades must be performed server-side.'));
  }

  /**
   * Renaming the Storage must be done on the server side, therefore this
   * function always gets rejected.
   *
   * @returns Promise rejection
   */
  rename(): Promise<never> {
    return Promise.reject(new Error('RemoteStorage cannot be renamed from the client. Renaming must be performed server-side.'));
  }

  /**
   * Getting a key by its index is not possible in this adapter, therefore
   * this function always gets rejected.
   *
   * @returns Promise rejection
   */
  key(): Promise<never> {
    return Promise.reject(new Error('RemoteStorage does not support getting keys by index. Use keys() to get all keys.'));
  }

  /**
   * Return all keys stored in the space. This makes a GET request to the
   * full endpoint with a keys query parameter.
   *
   * @returns Promise resolving to array of keys
   */
  async keys(): Promise<string[]> {
    await this.open();
    return this.storage!.json<string[]>(this.endpoint, { keys: true }, this.props);
  }

  /**
   * Delete a value from the space given its key. This function sends a
   * DELETE request to the server.
   *
   * @param key - Key of the item to delete
   * @returns Promise resolving to the key and response
   */
  async remove(key: string): Promise<StorageValue> {
    await this.open();
    const response = await this.storage!.delete(this.endpoint + key, {}, this.props);
    return RemoteStorage.unwrapValue(await this.readJsonResponse(response, key));
  }

  /**
   * Clear the entire space. This function sends a DELETE request to the server.
   *
   * @returns Promise for the clear operation
   */
  async clear(): Promise<void> {
    await this.open();
    const response = await this.storage!.delete(this.endpoint, {}, this.props);
    this.ensureOk(response);
  }
}
