/**
 * ==============================
 * Request
 * ==============================
 */

export type RequestData = Record<string, unknown> | FormData;

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  headers?: Record<string, string>;
  timeout?: number; // Timeout in milliseconds
}

/**
 * Error thrown when a request fails
 */
export class RequestError extends Error {
  public status: number;
  public statusText: string;
  public response: Response;

  constructor(response: Response, message?: string) {
    super(message || `Request failed: ${response.status} ${response.statusText}`);
    this.name = 'RequestError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.response = response;
  }
}

/**
 * Error thrown when a request times out
 */
export class RequestTimeoutError extends Error {
  constructor(url: string, timeout: number) {
    super(`Request to "${url}" timed out after ${timeout}ms`);
    this.name = 'RequestTimeoutError';
  }
}

export class Request {
  /**
   * Serialize data to URL query string
   * Handles nested objects and arrays
   *
   * @param data - Data to serialize
   * @param prefix - Key prefix for nested objects
   */
  static serialize(data: RequestData, prefix?: string): string {
    if (data instanceof FormData) {
      const params = new URLSearchParams();
      data.forEach((value, key) => {
        if (typeof value === 'string') {
          params.append(key, value);
        }
      });
      return params.toString();
    }

    const params: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;

      const paramKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            params.push(Request.serialize(item as Record<string, unknown>, `${paramKey}[${index}]`));
          } else {
            params.push(`${encodeURIComponent(paramKey)}[]=${encodeURIComponent(String(item))}`);
          }
        });
      } else if (typeof value === 'object') {
        params.push(Request.serialize(value as Record<string, unknown>, paramKey));
      } else {
        params.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`);
      }
    }

    return params.filter(Boolean).join('&');
  }

  /**
   * Parse a URL safely
   *
   * @param url - URL to parse
   */
  private static parseUrl(url: string): URL {
    try {
      return new URL(url);
    } catch {
      try {
        return new URL(url, window.location.origin);
      } catch (e) {
        throw new Error(`Invalid URL: "${url}"`);
      }
    }
  }

  /**
   * Create an AbortController with timeout
   *
   * @param timeout - Timeout in milliseconds
   * @param url - URL for error message
   */
  private static createTimeoutController(timeout: number | undefined, url: string): { controller: AbortController; timeoutId?: ReturnType<typeof setTimeout> } {
    const controller = new AbortController();

    if (!timeout) {
      return { controller };
    }

    const timeoutId = setTimeout(() => {
      controller.abort(new RequestTimeoutError(url, timeout));
    }, timeout);

    return { controller, timeoutId };
  }

  private static async send(
    method: string,
    url: string,
    data: RequestData = {},
    options: RequestOptions = {}
  ): Promise<Response> {
    const { timeout, ...fetchOptions } = options;
    const urlObj = Request.parseUrl(url);
    let body: BodyInit | undefined = undefined;
    const headers = { ...fetchOptions.headers };

    if (['GET', 'DELETE', 'HEAD'].includes(method.toUpperCase())) {
      if (data && typeof data === 'object' && !(data instanceof FormData)) {
        Object.entries(data).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            urlObj.searchParams.append(key, String(val));
          }
        });
      }
    } else {
      const contentType = headers['Content-Type'] || headers['content-type'];

      if (data instanceof FormData) {
        // Browser automatically sets Content-Type to multipart/form-data with boundary
        // Removing both cases to let the browser do its job
        delete headers['Content-Type'];
        delete headers['content-type'];
        body = data;
      } else if (contentType === 'application/json') {
        body = JSON.stringify(data);
      } else {
        if (!contentType) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        const params = new URLSearchParams();
        Object.entries(data).forEach(([k, v]) => params.append(k, String(v)));
        body = params;
      }
    }

    const { controller, timeoutId } = Request.createTimeoutController(timeout, url);

    try {
      const response = await fetch(urlObj.toString(), {
        ...fetchOptions,
        method,
        headers,
        body,
        signal: controller.signal
      });

      return response;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Make a GET request
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   */
  static get(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<Response> {
    return Request.send('GET', url, data, options);
  }

  /**
   * Make a POST request
   *
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   */
  static post(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
    return Request.send('POST', url, data, options);
  }

  /**
   * Make a PUT request
   *
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   */
  static put(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
    return Request.send('PUT', url, data, options);
  }

  /**
   * Make a PATCH request
   *
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   */
  static patch(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
    return Request.send('PATCH', url, data, options);
  }

  /**
   * Make a DELETE request
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   */
  static delete(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<Response> {
    return Request.send('DELETE', url, data, options);
  }

  /**
   * Make a HEAD request
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   */
  static head(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<Response> {
    return Request.send('HEAD', url, data, options);
  }

  /**
   * Make a GET request and parse JSON response
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   * @throws {RequestError} If the response is not ok
   */
  static async json<T = unknown>(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<T> {
    const response = await Request.get(url, data, options);

    if (!response.ok) {
      throw new RequestError(response);
    }

    return response.json();
  }

  /**
   * Make a POST request with JSON body and parse JSON response
   *
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   * @throws {RequestError} If the response is not ok
   */
  static async postJson<T = unknown>(url: string, data: RequestData, options: RequestOptions = {}): Promise<T> {
    const headers = { ...options.headers, 'Content-Type': 'application/json' };
    const response = await Request.post(url, data, { ...options, headers });

    if (!response.ok) {
      throw new RequestError(response);
    }

    return response.json();
  }

  /**
   * Make a GET request and return as Blob
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   * @throws {RequestError} If the response is not ok
   */
  static async blob(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<Blob> {
    const response = await Request.get(url, data, options);

    if (!response.ok) {
      throw new RequestError(response);
    }

    return response.blob();
  }

  /**
   * Make a GET request and return as text
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   * @throws {RequestError} If the response is not ok
   */
  static async text(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<string> {
    const response = await Request.get(url, data, options);

    if (!response.ok) {
      throw new RequestError(response);
    }

    return response.text();
  }

  /**
   * Make a GET request and return as ArrayBuffer
   *
   * @param url - Request URL
   * @param data - Query parameters
   * @param options - Request options
   * @throws {RequestError} If the response is not ok
   */
  static async arrayBuffer(url: string, data: RequestData = {}, options: RequestOptions = {}): Promise<ArrayBuffer> {
    const response = await Request.get(url, data, options);

    if (!response.ok) {
      throw new RequestError(response);
    }

    return response.arrayBuffer();
  }

  /**
   * Check if a URL exists (returns 2xx status)
   *
   * @param url - URL to check
   * @param options - Request options
   */
  static async exists(url: string, options: RequestOptions = {}): Promise<boolean> {
    try {
      const response = await Request.head(url, {}, options);
      return response.ok;
    } catch {
      return false;
    }
  }
}
