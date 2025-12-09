/**
 * ==============================
 * Preload
 * ==============================
 */

interface RequestInitWithPriority extends RequestInit {
  priority?: 'high' | 'low' | 'auto';
}

export class Preload {
  /**
   * Preload and decode an image. Decoding prevents the image from still having
   * a delay when it is displayed.
   *
   * @param route - URL of the image
   * @returns Promise<HTMLImageElement>
   */
  static async image(route: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = route;

    await img.decode();

    return img;
  }

  /**
   * Preload multiple images in parallel.
   *
   * @param routes - Array of image URLs
   * @returns Promise<HTMLImageElement[]>
   */
  static async images(routes: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(routes.map(route => Preload.image(route)));
  }

  /**
   * Preload a generic file by fetching it.
   *
   * @param route - URL of the file
   * @param priority - Fetch priority hint (default: 'low')
   * @returns Promise<Response>
   */
  static async file(route: string, priority: 'high' | 'low' | 'auto' = 'low'): Promise<Response> {
    const options: RequestInitWithPriority = { priority };
    const response = await fetch(route, options as RequestInit);

    if (!response.ok) {
      throw new Error(`Preload failed for "${route}": ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * Preload multiple files in parallel.
   *
   * @param routes - Array of file URLs
   * @param priority - Fetch priority hint
   * @returns Promise<Response[]>
   */
  static async files(routes: string[], priority: 'high' | 'low' | 'auto' = 'low'): Promise<Response[]> {
    return Promise.all(routes.map(route => Preload.file(route, priority)));
  }

  /**
   * Check if a URL is cached in a specific cache.
   *
   * @param cacheName - Name of the cache to check
   * @param url - URL to look for
   * @returns Whether the URL is cached
   */
  static async isCached(cacheName: string, url: string): Promise<boolean> {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cache = await caches.open(cacheName);
      const match = await cache.match(url);
      return !!match;
    } catch {
      // Cache API may throw in private browsing mode or other restricted contexts
      return false;
    }
  }

  /**
   * Add a URL to a cache.
   *
   * @param cacheName - Name of the cache
   * @param url - URL to cache
   * @returns Promise<void>
   */
  static async addToCache(cacheName: string, url: string): Promise<void> {
    if (!('caches' in window)) {
      throw new Error('Cache API is not supported in this browser');
    }

    try {
      const cache = await caches.open(cacheName);
      await cache.add(url);
    } catch (error) {
      throw new Error(`Failed to cache "${url}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add multiple URLs to a cache.
   *
   * @param cacheName - Name of the cache
   * @param urls - URLs to cache
   * @returns Promise<void>
   */
  static async addAllToCache(cacheName: string, urls: string[]): Promise<void> {
    if (!('caches' in window)) {
      throw new Error('Cache API is not supported in this browser');
    }

    try {
      const cache = await caches.open(cacheName);
      await cache.addAll(urls);
    } catch (error) {
      throw new Error(`Failed to cache URLs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Preload a CSS stylesheet.
   *
   * @param url - URL of the stylesheet
   * @returns Promise<void>
   */
  static async stylesheet(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');

      link.rel = 'preload';
      link.as = 'style';
      link.href = url;

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload stylesheet: ${url}`));

      document.head.appendChild(link);
    });
  }

  /**
   * Preload a JavaScript file.
   *
   * @param url - URL of the script
   * @returns Promise<void>
   */
  static async script(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');

      link.rel = 'preload';
      link.as = 'script';
      link.href = url;

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload script: ${url}`));

      document.head.appendChild(link);
    });
  }

  /**
   * Preload a font file.
   *
   * @param url - URL of the font
   * @param crossOrigin - Whether to use crossorigin attribute (default: true for fonts)
   * @returns Promise<void>
   */
  static async font(url: string, crossOrigin: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');

      link.rel = 'preload';
      link.as = 'font';
      link.href = url;

      if (crossOrigin) {
        link.crossOrigin = 'anonymous';
      }

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload font: ${url}`));

      document.head.appendChild(link);
    });
  }
}
