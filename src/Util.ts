/**
 * ==============================
 * Util
 * ==============================
 */

export type Callable<T = unknown> = (...args: unknown[]) => T | Promise<T>;

export class Util {
  /**
   * Calls a function and ensures it returns a Promise.
   *
   * @param callable - The function to run
   * @param context - The `this` context
   * @param args - Arguments to pass
   */
  static async callAsync<T = unknown>(callable: Callable<T>, context: unknown, ...args: unknown[]): Promise<T> {
    try {
      return await callable.apply(context, args);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Generates a UUID v4.
   */
  static uuid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    // Fallback using crypto.getRandomValues
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
        const num = parseInt(c, 10);
        const random = crypto.getRandomValues(new Uint8Array(1))[0];
        const shifted = 15 >> Math.floor(num / 4);
        return (num ^ (random & shifted)).toString(16);
      });
    }

    // Insecure Fallback, pretty sure no current browser should need this
    const generate = (): string => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${generate()}${generate()}-${generate()}-${generate()}-${generate()}-${generate()}${generate()}${generate()}`;
  }

  /**
   * Debounce a function call.
   *
   * @param fn - Function to debounce
   * @param delay - Delay in milliseconds
   */
  static debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>): void => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn(...args);
        timeoutId = null;
      }, delay);
    };
  }

  /**
   * Throttle a function call.
   *
   * @param fn - Function to throttle
   * @param limit - Minimum time between calls in milliseconds
   */
  static throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>): void => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
}
