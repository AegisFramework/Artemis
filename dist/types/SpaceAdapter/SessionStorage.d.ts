/**
 * ==============================
 * Session Storage Adapter
 * ==============================
 */
import { LocalStorage } from './LocalStorage';
import type { LocalStorageConfiguration } from './types';
/**
 * The Session Storage Adapter provides the Space Class the ability to interact
 * with the sessionStorage API found in most modern browsers. Since this API
 * shares pretty much the same methods as the local storage one, this class
 * inherits from the LocalStorage adapter.
 */
export declare class SessionStorage extends LocalStorage {
    /**
     * Create a new SessionStorage. If no configuration is provided, the SessionStorage
     * global object is used. The SessionStorage Adapter can provide independency
     * by store name and space name.
     *
     * @param configuration - Configuration Object for the Adapter
     */
    constructor({ name, version, store }: LocalStorageConfiguration);
    /**
     * Open the Storage Object
     *
     * @returns Promise resolving to this adapter
     */
    open(): Promise<this>;
}
//# sourceMappingURL=SessionStorage.d.ts.map