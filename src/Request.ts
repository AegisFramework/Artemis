/**
 * ==============================
 * Request
 * ==============================
 */

/**
 * Type for request data object
 */
export type RequestData = Record<string, string | number | boolean>;

/**
 * Type for request options
 */
export interface RequestOptions extends Omit<RequestInit, 'headers'> {
	headers?: Record<string, string>;
}

/**
 * Simple Wrapper for the fetch API, providing simple functions to handle requests
 */
export class Request {
	/**
	 * Serialize an object of data into a URI encoded format
	 *
	 * @param data - Key-value object of data to serialize
	 * @returns Serialized Data
	 */
	static serialize(data: RequestData): string {
		return Object.keys(data).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(String(data[key]));
		}).join('&');
	}

	/**
	 * Make a GET request to a given URL with the provided data parameters
	 * and an optional configuration object for the request.
	 *
	 * @param url - URL to make the request to
	 * @param data - Parameters to send in the URL, represented as a JSON object
	 * @param options - Options object for configurations you want to use in the fetch request
	 * @returns Resolves to the response of the request
	 */
	static get(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<Response> {
		const query = Request.serialize(data);

		// Check if there is actually any data parameters and join them to the
		// url as query parameters
		if (query !== '') {
			url = `${url}?${query}`;
		}

		return fetch(url, options as RequestInit);
	}

	/**
	 * Make a POST request to a given URL with the provided data and an optional
	 * configuration object for the request.
	 *
	 * @param url - URL to make the request
	 * @param data - Set of data to send in the URL, represented as a JSON object
	 * @param options - Options object for configurations you want to use in the fetch request
	 * @returns Resolves to the response of the request
	 */
	static post(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
		let formData: FormData | string;

		const contentType = options.headers?.['Content-Type'];
		if (contentType !== undefined) {
			if (contentType === 'multipart/form-data') {
				formData = new FormData();
				for (const value in data) {
					formData.append(value, String(data[value]));
				}
			} else if (contentType === 'application/json') {
				formData = JSON.stringify(data);
			} else {
				formData = Request.serialize(data);
			}
		} else {
			formData = Request.serialize(data);
		}

		const headers: Record<string, string> = {
			'Content-Type': 'application/x-www-form-urlencoded',
			...options.headers
		};

		// Delete the explicit multipart/form-data header to allow boundary automatic filling
		if (headers['Content-Type'] === 'multipart/form-data') {
			delete headers['Content-Type'];
		}

		const props: RequestInit = {
			...options,
			method: 'POST',
			headers,
			body: formData
		};

		return fetch(url, props);
	}

	/**
	 * Make a PUT request to a given URL with the provided data and an optional
	 * configuration object for the request.
	 *
	 * @param url - URL to make the request
	 * @param data - Set of data to send in the URL, represented as a JSON object
	 * @param options - Options object for configurations you want to use in the fetch request
	 * @returns Resolves to the response of the request
	 */
	static put(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
		return Request.post(url, data, Object.assign({}, { method: 'PUT' }, options));
	}

	/**
	 * Make a DELETE request to a given URL with the provided data and an optional
	 * configuration object for the request.
	 *
	 * @param url - URL to make the request
	 * @param data - Parameters to send in the URL, represented as a JSON object
	 * @param options - Options object for configurations you want to use in the fetch request
	 * @returns Resolves to the response of the request
	 */
	static delete(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
		return Request.get(url, data, Object.assign({}, { method: 'DELETE' }, options));
	}

	/**
	 * Request a JSON object from a given URL through a GET request
	 *
	 * @param url - URL to make the request to
	 * @param data - Parameters to send in the URL, represented as a JSON object
	 * @param options - Options object for configurations you want to use in the fetch request
	 * @returns Resolves to the json object obtained from the request response
	 */
	static json<T = unknown>(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<T> {
		return Request.get(url, data, options).then((response) => {
			return response.json() as Promise<T>;
		});
	}

	/**
	 * Request a Blob from a given URL through a GET request
	 *
	 * @param url - URL to make the request to
	 * @param data - Parameters to send in the URL, represented as a JSON object
	 * @param options - Options object for configurations you want to use in the fetch request
	 * @returns Resolves to the blob obtained from the request response
	 */
	static blob(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<Blob> {
		return Request.get(url, data, options).then((response) => {
			return response.blob();
		});
	}
}

