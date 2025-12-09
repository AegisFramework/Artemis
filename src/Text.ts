/**
 * ==============================
 * Text
 * ==============================
 */

export interface CapitalizeOptions {
  preserveCase?: boolean; // Wether to preserve the case of letters after the first character
}

export class Text {

  /**
   * Capitalize the first letter of each word.
   *
   * @param text - Text to capitalize
   * @param options - Capitalization options
   * @returns Capitalized text
   */
  static capitalize(text: string, options: CapitalizeOptions = {}): string {
    const { preserveCase = false } = options;

    return text.replace(/\w\S*/g, (word) => {
      const firstChar = word.charAt(0).toUpperCase();
      const rest = preserveCase ? word.substring(1) : word.substring(1).toLowerCase();
      return firstChar + rest;
    });
  }

  /**
   * Get the currently selected text in the document.
   */
  static selection(): string {
    return window.getSelection()?.toString() || '';
  }

  /**
   * Get the text after a given key/substring.
   *
   * @param key - The substring to search for
   * @param text - The text to search in
   * @returns Text after the key, or empty string if not found
   */
  static suffix(key: string, text: string): string {
    const index = text.indexOf(key);

    if (index === -1) {
      return '';
    }

    return text.slice(index + key.length);
  }

  /**
   * Get the text before a given key/substring.
   *
   * @param key - The substring to search for
   * @param text - The text to search in
   * @returns Text before the key, or empty string if not found
   */
  static prefix(key: string, text: string): string {
    const index = text.indexOf(key);

    if (index === -1) {
      return '';
    }

    return text.slice(0, index);
  }

  /**
   * Convert text to a URL-friendly slug.
   *
   * @param text - Text to convert
   * @returns URL-friendly slug
   */
  static friendly(text: string): string {
    return text
      .toString()                     // Ensure it's a string
      .normalize('NFD')               // Split accents from letters (e.g. é -> e + ´)
      .replace(/[\u0300-\u036f]/g, '') // Remove the separated accents
      .toLowerCase()                  // Standardize to lowercase
      .trim()                         // Remove leading/trailing whitespace
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')        // Remove all non-word chars (except -)
      .replace(/--+/g, '-');          // Replace multiple - with single -
  }

  /**
   * Truncate text to a maximum length with ellipsis.
   *
   * @param text - Text to truncate
   * @param maxLength - Maximum length (including ellipsis)
   * @param ellipsis - Ellipsis string to append (default: '...')
   */
  static truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
    if (text.length <= maxLength) {
      return text;
    }

    return text.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
  }

  /**
   * Check if a string is empty or contains only whitespace.
   */
  static isBlank(text: string | null | undefined): boolean {
    return text === null || text === undefined || text.trim() === '';
  }
}
