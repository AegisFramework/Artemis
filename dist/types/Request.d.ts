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
export declare class Request {
    /**
     * Serialize an object of data into a URI encoded format
     *
     * @param data - Key-value object of data to serialize
     * @returns Serialized Data
     */
    static serialize(data: RequestData): string;
    /**
     * Make a GET request to a given URL with the provided data parameters
     * and an optional configuration object for the request.
     *
     * @param url - URL to make the request to
     * @param data - Parameters to send in the URL, represented as a JSON object
     * @param options - Options object for configurations you want to use in the fetch request
     * @returns Resolves to the response of the request
     */
    static get(url: string, data?: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a POST request to a given URL with the provided data and an optional
     * configuration object for the request.
     *
     * @param url - URL to make the request
     * @param data - Set of data to send in the URL, represented as a JSON object
     * @param options - Options object for configurations you want to use in the fetch request
     * @returns Resolves to the response of the request
     */
    static post(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a PUT request to a given URL with the provided data and an optional
     * configuration object for the request.
     *
     * @param url - URL to make the request
     * @param data - Set of data to send in the URL, represented as a JSON object
     * @param options - Options object for configurations you want to use in the fetch request
     * @returns Resolves to the response of the request
     */
    static put(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a DELETE request to a given URL with the provided data and an optional
     * configuration object for the request.
     *
     * @param url - URL to make the request
     * @param data - Parameters to send in the URL, represented as a JSON object
     * @param options - Options object for configurations you want to use in the fetch request
     * @returns Resolves to the response of the request
     */
    static delete(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Request a JSON object from a given URL through a GET request
     *
     * @param url - URL to make the request to
     * @param data - Parameters to send in the URL, represented as a JSON object
     * @param options - Options object for configurations you want to use in the fetch request
     * @returns Resolves to the json object obtained from the request response
     */
    static json<T = unknown>(url: string, data?: RequestData, options?: RequestOptions): Promise<T>;
    /**
     * Request a Blob from a given URL through a GET request
     *
     * @param url - URL to make the request to
     * @param data - Parameters to send in the URL, represented as a JSON object
     * @param options - Options object for configurations you want to use in the fetch request
     * @returns Resolves to the blob obtained from the request response
     */
    static blob(url: string, data?: RequestData, options?: RequestOptions): Promise<Blob>;
}
//# sourceMappingURL=Request.d.ts.map