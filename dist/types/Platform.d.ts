/**
 * ==============================
 * Platform
 * ==============================
 */
/**
 * Desktop platform types
 */
export type DesktopPlatform = 'Windows' | 'macOS' | 'Linux' | 'FreeBSD' | 'webOS' | 'Any';
/**
 * Mobile platform types
 */
export type MobilePlatform = 'Android' | 'iOS' | 'Opera' | 'Windows' | 'BlackBerry' | 'Any';
/**
 * Orientation types
 */
export type Orientation = 'portrait' | 'landscape';
/**
 * Extended Navigator interface for userAgentData
 */
interface NavigatorUAData {
    platform?: string;
    brands?: {
        brand: string;
        version: string;
    }[];
    mobile?: boolean;
}
declare global {
    interface Navigator {
        userAgentData?: NavigatorUAData;
    }
}
/**
 * General checks for what kind of platform is being used to run the app.
 */
export declare class Platform {
    /**
     * Check if the screen has a retina pixel ratio
     * @returns Whether the screen is retina
     */
    static retina(): boolean;
    /**
     * Check if the device is on portrait orientation
     * @returns Whether device is in portrait mode
     */
    static portrait(): boolean;
    /**
     * Check if the device is on landscape orientation
     * @returns Whether device is in landscape mode
     */
    static landscape(): boolean;
    /**
     * Get device Orientation
     * @returns 'portrait' or 'landscape'
     */
    static orientation(): Orientation;
    /**
     * Check if the app is running over Electron
     * @returns Whether running in Electron
     */
    static electron(): boolean;
    /**
     * Check if the app is running over Cordova
     * @returns Whether running in Cordova
     */
    static cordova(): boolean;
    /**
     * Get the platform string using modern userAgentData API with fallback
     * @returns Platform string
     */
    private static getPlatformString;
    /**
     * Check if the app is running in a desktop platform
     * @param platform - Check for a specific desktop platform
     * @returns Whether running on specified desktop platform
     */
    static desktop(platform?: DesktopPlatform): boolean;
    /**
     * Check if the app is running in a mobile platform
     * @param platform - Check for a specific mobile platform
     * @returns Whether running on specified mobile platform
     */
    static mobile(platform?: MobilePlatform): boolean;
    /**
     * Check if the platform allows the use of service workers
     *
     * @returns Whether service workers are supported
     */
    static serviceWorkers(): boolean;
}
export {};
//# sourceMappingURL=Platform.d.ts.map