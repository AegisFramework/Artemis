/**
 * ==============================
 * Preload
 * ==============================
 */
/**
 * A simple class for asset preloading. This class assumes you have a service
 * worker set up that will be caching all requests.
 */
export declare class Preload {
    /**
     * Preload an image file
     *
     * @param route - Route to the image
     * @returns Resolves to the image object or gets rejected with the rejection event
     */
    static image(route: string): Promise<HTMLImageElement>;
    /**
     * Preload any kind of file
     *
     * @param route - Route to the file
     * @returns Resolves or rejects depending on request success
     */
    static file(route: string): Promise<Blob>;
}
//# sourceMappingURL=Preload.d.ts.map