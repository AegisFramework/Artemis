/**
* ==============================
* Request
* ==============================
*/

/**
 * Simple Wrapper for the XMLHttpRequest object. This class will be removed as
 * soon as fetch gets more widely adopted.
 * @class
 */
export class Request {

	/**
	 * @static get - Make a GET request to a given URL with the provided parameters
	 * and responseType header.
	 *
	 * @param  {string} url - URL to make the request
	 * @param  {Object} data - Parameters to send in the URL, represented as a JSON object
	 * @param  {string} [responseType = ''] - Response Type header value
	 * @return {Promise} - Resolves to the data received from the request
	 */
	static get (url, data, responseType = '') {
		return new Promise ((resolve, reject) => {
			const query = Object.keys (data).map ((key) => {
				return encodeURIComponent (key) + '=' + encodeURIComponent (data[key]);
			}).join ('&');

			if (query !== '') {
				url = `${url}?${query}`;
			}

			const request = new XMLHttpRequest ();
			request.open ('GET', url, true);
			request.responseType = responseType;

			request.onload = () => {
				resolve (request.response);
			};

			request.onerror = () => {
				reject (request);
			};

			request.send ();
		});
	}

	/**
	 * @static post - Make a POST request to a given URL with the provided data,
	 * responseType and contentType headers
	 *
	 * @param  {string} url - URL to make the request
	 * @param  {Object} data - Key-value pairs to send in the request
	 * @param  {string} responseType = '' - Response Type header value
	 * @param  {type} contentType = 'application/x-www-form-urlencoded' - Content Type Header value
	 * @return {Promise} - Resolves to the data received from the request
	 */
	static post (url, data, responseType = '', contentType = 'application/x-www-form-urlencoded') {
		return new Promise ((resolve, reject) => {
			let formData;
			const request = new XMLHttpRequest ();

			request.open ('POST', url, true);

			if (contentType == 'application/x-www-form-urlencoded') {

				formData = Object.keys (data).map ((key) => {
					return encodeURIComponent (key) + '=' + encodeURIComponent (data[key]);
				}).join ('&');

				request.setRequestHeader ('Content-type', contentType);
			} else if (contentType == 'multipart/form-data') {
				formData = new FormData ();
				for (const value in data) {
					formData.append (value, data[value]);
				}
			}

			request.responseType = responseType;

			request.onload = () => {
				resolve (request.response);
			};

			request.onerror = () => {
				reject (request);
			};

			request.send (formData);
		});
	}

	/**
	 * @static json - Request a JSON object from a given URL through a GET request
	 *
	 * @param  {string} url - URL to request the JSON from
	 * @return {Promise<Object>} - Resolves to the retrieved JSON
	 */
	static json (url) {
		return Request.get (url, {}, 'json');
	}
}