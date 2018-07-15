/**
* ==============================
* Util
* ==============================
*/

/**
 * Provides diverse utility functions
 * @class
 */
export class Util {


	/**
	 * @static callAsync - Calls any function using promises to keep a standard
	 * behavior between async and sync functions.
	 *
	 * @param  {funcion} callable - The function to run
	 * @param  {Object} context - The object `this` will be mapped to
	 * @param  {any} ...args - List of parameters to pass to the function when called
	 * @return {Promise} - A promise that resolves to the result of the function
	 */
	static callAsync (callable, context, ...args) {
		// Create our own promise
		return new Promise ((resolve, reject) => {
			// Use a try catch so we can reject the promise in case of an error
			// while running the function
			try {
				// Call the provided function using the context and arguments given
				const result = callable.apply (context, args);

				// Check if the function returned a simple value or a Promise
				if (result instanceof Promise) {
					return result;
				} else {
					resolve (result);
				}
			} catch (e) {
				reject (e);
			}
		});
	}

	/**
	 * @static uuid - Creates a UUID. This UUIDs should not be trusted for uniqueness
	 *
	 * @return {string} - Generated UUID
	 */
	static uuid () {
		if (window.crypto) {
			return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c) =>
				(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString (16)
			);
		} else {
			const generate = () => Math.floor ((1 + Math.random()) * 0x10000).toString (16).substring (1);
			return generate () + generate () + '-' + generate () + '-' + generate () + '-' +
			generate () + '-' + generate () + generate () + generate ();
		}
	}
}