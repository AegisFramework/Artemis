/**
 * ==============================
 * Session Storage Adapter
 * ==============================
 */

import { LocalStorage } from './LocalStorage';
import type { LocalStorageConfiguration, UpgradeCallback } from './types';

/**
 * The Session Storage Adapter provides the Space Class the ability to interact
 * with the sessionStorage API found in most modern browsers. Since this API
 * shares pretty much the same methods as the local storage one, this class
 * inherits from the LocalStorage adapter.
 *
 * Note: SessionStorage does not support versioning and upgrades because session
 * data is inherently temporary and cleared when the browser session ends.
 * Any declared upgrades will be ignored.
 */
export class SessionStorage extends LocalStorage {
	/**
	 * Create a new SessionStorage. If no configuration is provided, the SessionStorage
	 * global object is used. The SessionStorage Adapter can provide independency
	 * by store name and space name.
	 *
	 * Note: Version is accepted for API compatibility but upgrades are not supported.
	 *
	 * @param configuration - Configuration Object for the Adapter
	 */
	constructor({ name = '', version = '', store = '' }: LocalStorageConfiguration) {
		super({ name, version, store });
	}

	/**
	 * Open the Storage Object.
	 *
	 * Unlike LocalStorage, SessionStorage does not perform upgrade migrations
	 * because session data is temporary and cleared when the session ends.
	 *
	 * @returns Promise resolving to this adapter
	 */
	async open(): Promise<this> {
		if (this.storage instanceof Storage) {
			return this;
		}

		this.storage = window.sessionStorage;
		return this;
	}

	/**
	 * Upgrade is not supported for SessionStorage.
	 * Session data is temporary and should not require migrations.
	 *
	 * @param _oldVersion - Ignored
	 * @param _newVersion - Ignored
	 * @param _callback - Ignored
	 * @returns Promise that resolves immediately (no-op)
	 */
	async upgrade(_oldVersion: string, _newVersion: string, _callback: UpgradeCallback<SessionStorage>): Promise<void> {
		console.warn('SessionStorage.upgrade() is a no-op. Session data is temporary and does not support migrations.');
		return Promise.resolve();
	}
}
