/**
 * ==============================
 * Util
 * ==============================
 */
export type Callable<T = unknown> = (...args: unknown[]) => T | Promise<T>;
export declare class Util {
    /**
     * Calls a function and ensures it returns a Promise.
     *
     * @param callable - The function to run
     * @param context - The `this` context
     * @param args - Arguments to pass
     */
    static callAsync<T = unknown>(callable: Callable<T>, context: unknown, ...args: unknown[]): Promise<T>;
    /**
     * Generates a UUID v4.
     */
    static uuid(): string;
    /**
     * Debounce a function call.
     *
     * @param fn - Function to debounce
     * @param delay - Delay in milliseconds
     */
    static debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void;
    /**
     * Throttle a function call.
     *
     * @param fn - Function to throttle
     * @param limit - Minimum time between calls in milliseconds
     */
    static throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void;
}
//# sourceMappingURL=Util.d.ts.map