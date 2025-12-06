/**
 * ==============================
 * Util
 * ==============================
 */
/**
 * Callable function type
 */
export type Callable<T = unknown> = (...args: unknown[]) => T | Promise<T>;
/**
 * Provides diverse utility functions
 */
export declare class Util {
    /**
     * Calls any function using promises to keep a standard behavior between
     * async and sync functions.
     *
     * @param callable - The function to run
     * @param context - The object `this` will be mapped to
     * @param args - List of parameters to pass to the function when called
     * @returns A promise that resolves to the result of the function
     */
    static callAsync<T = unknown>(callable: Callable<T>, context: unknown, ...args: unknown[]): Promise<T>;
    /**
     * Creates a UUID. These UUIDs should not be trusted for uniqueness
     *
     * @returns Generated UUID
     */
    static uuid(): string;
}
//# sourceMappingURL=Util.d.ts.map