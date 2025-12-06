/**
 * ==============================
 * Util
 * ==============================
 */

/**
 * Callable function type
 */
export type Callable<T = unknown> = (...args: unknown[]) => T | Promise<T>;

/**
 * Provides diverse utility functions
 */
export class Util {
	/**
	 * Calls any function using promises to keep a standard behavior between
	 * async and sync functions.
	 *
	 * @param callable - The function to run
	 * @param context - The object `this` will be mapped to
	 * @param args - List of parameters to pass to the function when called
	 * @returns A promise that resolves to the result of the function
	 */
	static callAsync<T = unknown>(callable: Callable<T>, context: unknown, ...args: unknown[]): Promise<T> {
		try {
			// Call the provided function using the context and arguments given
			const result = callable.apply(context, args);

			// Check if the function returned a simple value or a Promise
			if (result instanceof Promise) {
				return result;
			} else {
				return Promise.resolve(result);
			}
		} catch (e) {
			return Promise.reject(e);
		}
	}

	/**
	 * Creates a UUID. These UUIDs should not be trusted for uniqueness
	 *
	 * @returns Generated UUID
	 */
	static uuid(): string {
		if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
			return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
				const num = parseInt(c, 10);
				return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
			});
		} else {
			const generate = (): string => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			return generate() + generate() + '-' + generate() + '-' + generate() + '-' +
				generate() + '-' + generate() + generate() + generate();
		}
	}
}

