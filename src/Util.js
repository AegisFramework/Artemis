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
}