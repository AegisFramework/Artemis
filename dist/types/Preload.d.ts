/**
 * ==============================
 * Preload
 * ==============================
 */
export declare class Preload {
    /**
     * Preload and decode an image. Decoding prevents the image from still having
     * a delay when it is displayed.
     *
     * @param route - URL of the image
     * @returns Promise<HTMLImageElement>
     */
    static image(route: string): Promise<HTMLImageElement>;
    /**
     * Preload multiple images in parallel.
     *
     * @param routes - Array of image URLs
     * @returns Promise<HTMLImageElement[]>
     */
    static images(routes: string[]): Promise<HTMLImageElement[]>;
    /**
     * Preload a generic file by fetching it.
     *
     * @param route - URL of the file
     * @param priority - Fetch priority hint (default: 'low')
     * @returns Promise<Response>
     */
    static file(route: string, priority?: 'high' | 'low' | 'auto'): Promise<Response>;
    /**
     * Preload multiple files in parallel.
     *
     * @param routes - Array of file URLs
     * @param priority - Fetch priority hint
     * @returns Promise<Response[]>
     */
    static files(routes: string[], priority?: 'high' | 'low' | 'auto'): Promise<Response[]>;
    /**
     * Check if a URL is cached in a specific cache.
     *
     * @param cacheName - Name of the cache to check
     * @param url - URL to look for
     * @returns Whether the URL is cached
     */
    static isCached(cacheName: string, url: string): Promise<boolean>;
    /**
     * Add a URL to a cache.
     *
     * @param cacheName - Name of the cache
     * @param url - URL to cache
     * @returns Promise<void>
     */
    static addToCache(cacheName: string, url: string): Promise<void>;
    /**
     * Add multiple URLs to a cache.
     *
     * @param cacheName - Name of the cache
     * @param urls - URLs to cache
     * @returns Promise<void>
     */
    static addAllToCache(cacheName: string, urls: string[]): Promise<void>;
    /**
     * Preload a CSS stylesheet.
     *
     * @param url - URL of the stylesheet
     * @returns Promise<void>
     */
    static stylesheet(url: string): Promise<void>;
    /**
     * Preload a JavaScript file.
     *
     * @param url - URL of the script
     * @returns Promise<void>
     */
    static script(url: string): Promise<void>;
    /**
     * Preload a font file.
     *
     * @param url - URL of the font
     * @param crossOrigin - Whether to use crossorigin attribute (default: true for fonts)
     * @returns Promise<void>
     */
    static font(url: string, crossOrigin?: boolean): Promise<void>;
    /**
     * Preload and decode an audio file into an AudioBuffer.
     *
     * @param url - URL of the audio file
     * @param audioContext - Optional AudioContext to use for decoding. If not provided,
     *                       a temporary one will be created. For best results, pass the
     *                       same AudioContext that will be used for playback.
     * @returns Promise<AudioBuffer> - Decoded audio ready for playback
     */
    static audio(url: string, audioContext?: AudioContext): Promise<AudioBuffer>;
    /**
     * Preload and decode multiple audio files in parallel.
     *
     * @param urls - Array of audio file URLs
     * @param audioContext - Optional AudioContext to use for decoding
     * @returns Promise<AudioBuffer[]>
     */
    static audios(urls: string[], audioContext?: AudioContext): Promise<AudioBuffer[]>;
}
//# sourceMappingURL=Preload.d.ts.map