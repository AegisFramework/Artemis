/**
 * ==============================
 * Platform
 * ==============================
 */
export type DesktopPlatform = 'Windows' | 'macOS' | 'Linux' | 'FreeBSD' | 'Any' | 'ChromeOS';
export type MobilePlatform = 'Android' | 'iOS' | 'iPadOS' | 'WindowsMobile' | 'BlackBerry' | 'Any';
export type Orientation = 'portrait' | 'landscape';
export declare class Platform {
    /**
     * Check if the screen has a high pixel density (Retina)
     */
    static get retina(): boolean;
    /**
     * Check if the device is in portrait orientation.
     * Uses matchMedia to align perfectly with CSS media queries.
     */
    static get portrait(): boolean;
    /**
     * Check if the device is in landscape orientation.
     */
    static get landscape(): boolean;
    /**
     * Get current device orientation as a string.
     */
    static get orientation(): Orientation;
    /**
     * Check if the user prefers Dark Mode
     */
    static get darkMode(): boolean;
    /**
     * Check if the user prefers reduced motion
     */
    static get reducedMotion(): boolean;
    /**
     * Check if the device supports touch events.
     * Useful for distinguishing hybrid laptops from tablets.
     */
    static get touch(): boolean;
    /**
     * Check if the app is running in "Standalone" mode (Installed PWA).
     */
    static get standalone(): boolean;
    /**
     * Check if the app is running inside Electron.
     * Checks both Renderer process and Main process contexts.
     */
    static get electron(): boolean;
    /**
     * Check if the app is running inside Cordova / PhoneGap.
     */
    static get cordova(): boolean;
    /**
     * Internal helper to normalize platform detection
     */
    private static get userAgent();
    /**
     * Check if the app is running on a Desktop platform.
     *
     * @param os - Specific desktop OS to check for, or 'Any' for any desktop
     */
    static desktop(os?: DesktopPlatform): boolean;
    /**
     * Check if the app is running on a Mobile platform.
     *
     * @param os - Specific mobile OS to check for, or 'Any' for any mobile
     */
    static mobile(os?: MobilePlatform): boolean;
    /**
     * Detect iPadOS explicitly.
     * Modern iPads send a "Macintosh" User Agent, but have Touch Points.
     */
    private static isIpadOS;
    /**
     * Check if the platform supports Service Workers.
     * Uses `isSecureContext` to accurately allow localhost/HTTPS.
     */
    static get serviceWorkers(): boolean;
    /**
     * Check if the device has a coarse pointer (touch) as primary input.
     */
    static get coarsePointer(): boolean;
    /**
     * Check if the device has a fine pointer (mouse) as primary input.
     */
    static get finePointer(): boolean;
    /**
     * Check if the device supports hover interactions.
     */
    static get canHover(): boolean;
}
//# sourceMappingURL=Platform.d.ts.map