/**
 * ==============================
 * Text
 * ==============================
 */
/**
 * Provides utility functions for texts
 */
export declare class Text {
    /**
     * Capitalizes every word in a string
     *
     * @param text - Text string to capitalize
     * @returns Capitalized string
     */
    static capitalize(text: string): string;
    /**
     * Gets the suffix of a string given a key
     *
     * @param key - Key part of the string
     * @param text - Full string to extract the suffix from
     * @returns Suffix
     */
    static suffix(key: string, text: string): string;
    /**
     * Get the currently selected text
     *
     * @returns Text selection
     */
    static selection(): string;
    /**
     * Gets the prefix of a string given a key
     *
     * @param key - Key part of the string
     * @param text - Full string to extract the prefix from
     * @returns Prefix
     */
    static prefix(key: string, text: string): string;
    /**
     * Transforms a given text into a friendly URL string replacing all special characters
     *
     * @param text - The text to build the url from
     * @returns Friendly URL
     */
    static friendly(text: string): string;
}
//# sourceMappingURL=Text.d.ts.map