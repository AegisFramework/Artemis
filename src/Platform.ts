/**
 * ==============================
 * Platform
 * ==============================
 */

export type DesktopPlatform = 'Windows' | 'macOS' | 'Linux' | 'FreeBSD' | 'Any' | 'ChromeOS';
export type MobilePlatform = 'Android' | 'iOS' | 'iPadOS' | 'WindowsMobile' | 'BlackBerry' | 'Any';
export type Orientation = 'portrait' | 'landscape';

interface NavigatorUAData {
  platform: string;
  mobile: boolean;
  brands: { brand: string; version: string }[];
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
  userAgentData?: NavigatorUAData;
}

interface ExtendedWindow extends Window {
  process?: {
    type?: string;
    versions?: { electron?: string };
  };
  cordova?: unknown;
}

export class Platform {
  /**
   * Check if the screen has a high pixel density (Retina)
   */
  static get retina(): boolean {
    return window.devicePixelRatio >= 2;
  }

  /**
   * Check if the device is in portrait orientation.
   * Uses matchMedia to align perfectly with CSS media queries.
   */
  static get portrait(): boolean {
    return window.matchMedia('(orientation: portrait)').matches;
  }

  /**
   * Check if the device is in landscape orientation.
   */
  static get landscape(): boolean {
    return window.matchMedia('(orientation: landscape)').matches;
  }

  /**
   * Get current device orientation as a string.
   */
  static get orientation(): Orientation {
    return Platform.portrait ? 'portrait' : 'landscape';
  }

  /**
   * Check if the user prefers Dark Mode
   */
  static get darkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Check if the user prefers reduced motion
   */
  static get reducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if the device supports touch events.
   * Useful for distinguishing hybrid laptops from tablets.
   */
  static get touch(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }

  /**
   * Check if the app is running in "Standalone" mode (Installed PWA).
   */
  static get standalone(): boolean {
    const nav = navigator as NavigatorWithStandalone;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      nav.standalone === true // iOS fallback
    );
  }

  /**
   * Check if the app is running inside Electron.
   * Checks both Renderer process and Main process contexts.
   */
  static get electron(): boolean {
    const win = window as ExtendedWindow;

    if (navigator.userAgent.toLowerCase().includes(' electron/')) {
      return true;
    }

    if (win.process?.type === 'renderer') {
      return true;
    }

    if (win.process?.versions?.electron) {
      return true;
    }

    return false;
  }

  /**
   * Check if the app is running inside Cordova / PhoneGap.
   */
  static get cordova(): boolean {
    return !!(window as ExtendedWindow).cordova;
  }

  /**
   * Internal helper to normalize platform detection
   */
  private static get userAgent(): string {
    return navigator.userAgent.toLowerCase();
  }

  /**
   * Check if the app is running on a Desktop platform.
   *
   * @param os - Specific desktop OS to check for, or 'Any' for any desktop
   */
  static desktop(os: DesktopPlatform = 'Any'): boolean {
    const nav = navigator as NavigatorWithStandalone;

    if (nav.userAgentData?.mobile === true) {
      return false;
    }

    if (Platform.isIpadOS()) {
      return false;
    }

    const ua = Platform.userAgent;
    const dataPlatform = nav.userAgentData?.platform?.toLowerCase() || '';

    const checks: Record<Exclude<DesktopPlatform, 'Any'>, boolean> = {
      'ChromeOS': dataPlatform.includes('cros') || ua.includes('cros'),
      'Windows': dataPlatform.includes('windows') || ua.includes('windows'),
      'macOS': dataPlatform.includes('macos') || ua.includes('macintosh'),
      'Linux': !ua.includes('android') && (dataPlatform.includes('linux') || ua.includes('linux')),
      'FreeBSD': dataPlatform.includes('freebsd') || ua.includes('freebsd'),
    };

    if (os === 'Any') {
      return Object.values(checks).some(val => val);
    }

    return checks[os] || false;
  }

  /**
   * Check if the app is running on a Mobile platform.
   *
   * @param os - Specific mobile OS to check for, or 'Any' for any mobile
   */
  static mobile(os: MobilePlatform = 'Any'): boolean {
    const nav = navigator as NavigatorWithStandalone;

    if (nav.userAgentData?.mobile === true && os === 'Any') {
      return true;
    }

    const ua = Platform.userAgent;

    const checks: Record<Exclude<MobilePlatform, 'Any'>, boolean> = {
      'Android': ua.includes('android'),
      'iOS': /iphone|ipod/.test(ua),
      'iPadOS': Platform.isIpadOS(),
      'WindowsMobile': /windows phone|iemobile|wpdesktop/.test(ua),
      'BlackBerry': /blackberry|bb10/.test(ua),
    };

    if (os === 'Any') {
      return Object.values(checks).some(val => val);
    }

    return checks[os] || false;
  }

  /**
   * Detect iPadOS explicitly.
   * Modern iPads send a "Macintosh" User Agent, but have Touch Points.
   */
  private static isIpadOS(): boolean {
    const ua = Platform.userAgent;

    if (ua.includes('ipad')) {
      return true;
    }

    if (ua.includes('macintosh') && navigator.maxTouchPoints > 0) {
      return true;
    }

    return false;
  }

  /**
   * Check if the platform supports Service Workers.
   * Uses `isSecureContext` to accurately allow localhost/HTTPS.
   */
  static get serviceWorkers(): boolean {
    return 'serviceWorker' in navigator && window.isSecureContext;
  }

  /**
   * Check if the device has a coarse pointer (touch) as primary input.
   */
  static get coarsePointer(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
  }

  /**
   * Check if the device has a fine pointer (mouse) as primary input.
   */
  static get finePointer(): boolean {
    return window.matchMedia('(pointer: fine)').matches;
  }

  /**
   * Check if the device supports hover interactions.
   */
  static get canHover(): boolean {
    return window.matchMedia('(hover: hover)').matches;
  }
}
