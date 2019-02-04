/**
* ==============================
* Request
* ==============================
*/

/**
 * Simple Wrapper for the fetch API, providing simple functions to handle requests
 *
 * @class
 */
export class Request {

	/**
	 * @static serialize - Serialize an object of data into a URI encoded format
	 *
	 * @param  {Object} data - Key-value object of data to serialize
	 * @return {string} - Serialized Data
	 */
	static serialize (data) {
		return Object.keys (data).map ((key) => {
			return encodeURIComponent (key) + '=' + encodeURIComponent (data[key]);
		}).join ('&');
	}

	/**
	 * @static get - Make a GET request to a given URL with the provided data
	 * parameters and an optional configuration object for the request.
	 *
	 * @param  {string} url - URL to make the request to
	 * @param  {Object} [data = {}] - Parameters to send in the URL, represented
	 * as a JSON object. These parameters will be sent as a query in the URL
	 * @param  {Object} [options = {}] - Options object for configurations you want
	 * to use in the fetch () request made.
	 * @return {Promise<Response>} - Resolves to the response of the request
	 */
	static get (url, data = {}, options = {}) {
		const query = Request.serialize (data);

		// Check if there is actually any data parameters and join them to the
		// url as query parameters
		if (query !== '') {
			url = `${url}?${query}`;
		}

		return fetch (url, options);
	}

	/**
	 * @static post - Make a POST request to a given URL with the provided data
	 * and an optional configuration object for the request.
	 *
	 * @param  {string} url - URL to make the request
	 * @param  {Object} [data = {}] - Set of data to send in the URL, represented
	 * as a JSON object
 	 * @param  {Object} [options = {}] - Options object for configurations you want
	 * to use in the fetch () request made. The Content-Type header is used to
	 * serialize data in the correct format and defaults to application/x-www-form-urlencoded
	 * @return {Promise<Response>} - Resolves to the response of the request
	 */
	static post (url, data, options = {}) {
		let formData;

		if (typeof options.headers !== 'undefined') {
			const contentType = options.headers['Content-Type'];
			if (typeof contentType !== 'undefined') {
				if (contentType == 'multipart/form-data') {
					formData = new FormData ();
					for (const value in data) {
						formData.append (value, data[value]);
					}
				} else if (contentType == 'application/json') {
					formData = JSON.stringify (data);
				} else {
					formData = Request.serialize (data);
				}
			}
		} else {
			formData = Request.serialize (data);
		}

		const props = Object.assign ({}, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData
		}, options);

		// Delete the explicit multipart/form-data header to allow boundary automatic filling
		if (typeof props.headers !== 'undefined') {
			if (props.headers['Content-Type'] === 'multipart/form-data') {
				delete props.headers['Content-Type'];
			}
		}

		return fetch (url, props);
	}

	/**
	 * @static put - Make a PUT request to a given URL with the provided data
	 * and an optional configuration object for the request.
	 *
	 * @param  {string} url - URL to make the request
	 * @param  {Object} [data = {}] - Set of data to send in the URL, represented
	 * as a JSON object
 	 * @param  {Object} [options = {}] - Options object for configurations you want
	 * to use in the fetch () request made. The Content-Type header is used to
	 * serialize data in the correct format and defaults to application/x-www-form-urlencoded
	 * @return {Promise<Response>} - Resolves to the response of the request
	 */
	static put (url, data, options = {}) {
		return Request.post (url, data, Object.assign ({}, {method: 'PUT'}, options));
	}

	/**
	 * @static delete - Make a DELETE request to a given URL with the provided data
	 * and an optional configuration object for the request.
	 *
	 * @param  {string} url - URL to make the request
	 * @param  {Object} [data = {}] - Parameters to send in the URL, represented
	 * as a JSON object. These parameters will be sent as a query in the URL
 	 * @param  {Object} [options = {}] - Options object for configurations you want
	 * to use in the fetch () request made. The Content-Type header is used to
	 * serialize data in the correct format and defaults to application/x-www-form-urlencoded
	 * @return {Promise<Response>} - Resolves to the response of the request
	 */
	static delete (url, data, options = {}) {
		return Request.get (url, data, Object.assign ({}, {method: 'DELETE'}, options));
	}

	/**
 	 * @static json - Request a JSON object from a given URL through a GET request
 	 *
 	 * @param  {string} url - URL to make the request to
 	 * @param  {Object} [data = {}] - Parameters to send in the URL, represented
 	 * as a JSON object. These parameters will be sent as a query in the URL
 	 * @param  {Object} [options = {}] - Options object for configurations you want
 	 * to use in the fetch () request made.
 	 * @return {Promise<Object>} - Resolves to the json object obtained from the request response
 	 */
	static json (url, data = {}, options = {}) {
		return Request.get (url, data, options).then ((response) => {
			return response.json ();
		});
	}

	/**
 	 * @static blob - Request a Blob from a given URL through a GET request
 	 *
 	 * @param  {string} url - URL to make the request to
 	 * @param  {Object} [data = {}] - Parameters to send in the URL, represented
 	 * as a JSON object. These parameters will be sent as a query in the URL
 	 * @param  {Object} [options = {}] - Options object for configurations you want
 	 * to use in the fetch () request made.
 	 * @return {Promise<Blob>} - Resolves to the blob obtained from the request response
 	 */
	static blob (url, data = {}, options = {}) {
		return Request.get (url, data, options).then ((response) => {
			return response.blob ();
		});
	}
}