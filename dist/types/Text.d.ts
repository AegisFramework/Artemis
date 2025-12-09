/**
 * ==============================
 * Text
 * ==============================
 */
export interface CapitalizeOptions {
    preserveCase?: boolean;
}
export declare class Text {
    /**
     * Capitalize the first letter of each word.
     *
     * @param text - Text to capitalize
     * @param options - Capitalization options
     * @returns Capitalized text
     */
    static capitalize(text: string, options?: CapitalizeOptions): string;
    /**
     * Get the currently selected text in the document.
     */
    static selection(): string;
    /**
     * Get the text after a given key/substring.
     *
     * @param key - The substring to search for
     * @param text - The text to search in
     * @returns Text after the key, or empty string if not found
     */
    static suffix(key: string, text: string): string;
    /**
     * Get the text before a given key/substring.
     *
     * @param key - The substring to search for
     * @param text - The text to search in
     * @returns Text before the key, or empty string if not found
     */
    static prefix(key: string, text: string): string;
    /**
     * Convert text to a URL-friendly slug.
     *
     * @param text - Text to convert
     * @returns URL-friendly slug
     */
    static friendly(text: string): string;
    /**
     * Truncate text to a maximum length with ellipsis.
     *
     * @param text - Text to truncate
     * @param maxLength - Maximum length (including ellipsis)
     * @param ellipsis - Ellipsis string to append (default: '...')
     */
    static truncate(text: string, maxLength: number, ellipsis?: string): string;
    /**
     * Check if a string is empty or contains only whitespace.
     */
    static isBlank(text: string | null | undefined): boolean;
}
//# sourceMappingURL=Text.d.ts.map