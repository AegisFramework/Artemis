/**
 * ==============================
 * Request
 * ==============================
 */
export type RequestData = Record<string, unknown> | FormData;
export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
    headers?: Record<string, string>;
    timeout?: number;
}
/**
 * Error thrown when a request fails
 */
export declare class RequestError extends Error {
    status: number;
    statusText: string;
    response: Response;
    constructor(response: Response, message?: string);
}
/**
 * Error thrown when a request times out
 */
export declare class RequestTimeoutError extends Error {
    constructor(url: string, timeout: number);
}
export declare class Request {
    /**
     * Serialize data to URL query string
     * Handles nested objects and arrays
     *
     * @param data - Data to serialize
     * @param prefix - Key prefix for nested objects
     */
    static serialize(data: RequestData, prefix?: string): string;
    /**
     * Parse a URL safely
     *
     * @param url - URL to parse
     */
    private static parseUrl;
    /**
     * Create an AbortController with timeout
     *
     * @param timeout - Timeout in milliseconds
     * @param url - URL for error message
     */
    private static createTimeoutController;
    private static send;
    /**
     * Make a GET request
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     */
    static get(url: string, data?: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a POST request
     *
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     */
    static post(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a PUT request
     *
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     */
    static put(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a PATCH request
     *
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     */
    static patch(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a DELETE request
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     */
    static delete(url: string, data?: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a HEAD request
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     */
    static head(url: string, data?: RequestData, options?: RequestOptions): Promise<Response>;
    /**
     * Make a GET request and parse JSON response
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     * @throws {RequestError} If the response is not ok
     */
    static json<T = unknown>(url: string, data?: RequestData, options?: RequestOptions): Promise<T>;
    /**
     * Make a POST request with JSON body and parse JSON response
     *
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     * @throws {RequestError} If the response is not ok
     */
    static postJson<T = unknown>(url: string, data: RequestData, options?: RequestOptions): Promise<T>;
    /**
     * Make a GET request and return as Blob
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     * @throws {RequestError} If the response is not ok
     */
    static blob(url: string, data?: RequestData, options?: RequestOptions): Promise<Blob>;
    /**
     * Make a GET request and return as text
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     * @throws {RequestError} If the response is not ok
     */
    static text(url: string, data?: RequestData, options?: RequestOptions): Promise<string>;
    /**
     * Make a GET request and return as ArrayBuffer
     *
     * @param url - Request URL
     * @param data - Query parameters
     * @param options - Request options
     * @throws {RequestError} If the response is not ok
     */
    static arrayBuffer(url: string, data?: RequestData, options?: RequestOptions): Promise<ArrayBuffer>;
    /**
     * Check if a URL exists (returns 2xx status)
     *
     * @param url - URL to check
     * @param options - Request options
     */
    static exists(url: string, options?: RequestOptions): Promise<boolean>;
}
//# sourceMappingURL=Request.d.ts.map