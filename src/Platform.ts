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
	brands?: { brand: string; version: string }[];
	mobile?: boolean;
}

declare global {
	interface Navigator {
		userAgentData?: NavigatorUAData;
	}
}

/**
 * Extended window interface for process (Electron)
 */
interface ElectronWindow extends Window {
	process?: {
		type?: string;
		versions?: {
			electron?: string;
		};
	};
	cordova?: unknown;
}

/**
 * General checks for what kind of platform is being used to run the app.
 */
export class Platform {
	/**
	 * Check if the screen has a retina pixel ratio
	 * @returns Whether the screen is retina
	 */
	static retina(): boolean {
		return window.devicePixelRatio >= 2;
	}

	/**
	 * Check if the device is on portrait orientation
	 * @returns Whether device is in portrait mode
	 */
	static portrait(): boolean {
		return window.screen.orientation.type === 'portrait-primary' || window.screen.orientation.type === 'portrait-secondary';
	}

	/**
	 * Check if the device is on landscape orientation
	 * @returns Whether device is in landscape mode
	 */
	static landscape(): boolean {
		return window.screen.orientation.type === 'landscape-primary' || window.screen.orientation.type === 'landscape-secondary';
	}

	/**
	 * Get device Orientation
	 * @returns 'portrait' or 'landscape'
	 */
	static orientation(): Orientation {
		return Platform.portrait() ? 'portrait' : 'landscape';
	}

	/**
	 * Check if the app is running over Electron
	 * @returns Whether running in Electron
	 */
	static electron(): boolean {
		const win = window as ElectronWindow;

		// Renderer process
		if (typeof win !== 'undefined' && typeof win.process === 'object' && win.process?.type === 'renderer') {
			return true;
		}

		// Main process (Node.js/Electron environment)
		const nodeProcess = typeof globalThis !== 'undefined' ? (globalThis as { process?: { versions?: { electron?: string } } }).process : undefined;
		if (nodeProcess && typeof nodeProcess.versions === 'object' && !!nodeProcess.versions?.electron) {
			return true;
		}

		// Detect the user agent when the `nodeIntegration` option is set to true
		if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
			return true;
		}

		return false;
	}

	/**
	 * Check if the app is running over Cordova
	 * @returns Whether running in Cordova
	 */
	static cordova(): boolean {
		return !!(window as ElectronWindow).cordova;
	}

	/**
	 * Get the platform string using modern userAgentData API with fallback
	 * @returns Platform string
	 */
	private static getPlatformString(): string {
		// Try modern userAgentData first
		if (navigator.userAgentData?.platform) {
			return navigator.userAgentData.platform;
		}
		// Fallback to userAgent parsing
		const ua = navigator.userAgent;
		if (ua.includes('Win')) return 'Windows';
		if (ua.includes('Mac')) return 'macOS';
		if (ua.includes('Linux')) return 'Linux';
		if (ua.includes('FreeBSD')) return 'FreeBSD';
		if (ua.includes('WebTV')) return 'webOS';
		return '';
	}

	/**
	 * Check if the app is running in a desktop platform
	 * @param platform - Check for a specific desktop platform
	 * @returns Whether running on specified desktop platform
	 */
	static desktop(platform: DesktopPlatform = 'Any'): boolean {
		const platformString = Platform.getPlatformString();

		switch (platform) {
			case 'Windows':
				return platformString === 'Windows' || platformString.includes('Win');

			case 'macOS':
				return platformString === 'macOS' || platformString.includes('Mac');

			case 'Linux':
				return platformString === 'Linux' || platformString.includes('Linux');

			case 'FreeBSD':
				return platformString === 'FreeBSD' || platformString.includes('FreeBSD');

			case 'webOS':
				return platformString === 'webOS' || platformString.includes('WebTV');

			case 'Any':
			default:
				return ['Windows', 'macOS', 'Linux', 'FreeBSD', 'webOS'].some(p =>
					platformString === p || platformString.includes(p.replace('macOS', 'Mac').replace('webOS', 'WebTV'))
				);
		}
	}

	/**
	 * Check if the app is running in a mobile platform
	 * @param platform - Check for a specific mobile platform
	 * @returns Whether running on specified mobile platform
	 */
	static mobile(platform: MobilePlatform = 'Any'): boolean {
		// Try modern userAgentData first for general mobile detection
		if (navigator.userAgentData?.mobile !== undefined && platform === 'Any') {
			return navigator.userAgentData.mobile;
		}

		// Fallback to userAgent for specific platform detection
		const ua = navigator.userAgent;

		switch (platform) {
			case 'Android':
				return /Android/i.test(ua);

			case 'iOS':
				return /iPhone|iPad|iPod/i.test(ua);

			case 'Opera':
				return /Opera Mini/i.test(ua);

			case 'Windows':
				return /Windows Phone|IEMobile|WPDesktop/i.test(ua);

			case 'BlackBerry':
				return /BlackBerry|BB10/i.test(ua);

			case 'Any':
			default:
				return /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|WPDesktop|BlackBerry|BB10/i.test(ua);
		}
	}

	/**
	 * Check if the platform allows the use of service workers
	 *
	 * @returns Whether service workers are supported
	 */
	static serviceWorkers(): boolean {
		if (typeof navigator !== 'undefined') {
			if ('serviceWorker' in navigator && location.protocol.indexOf('http') > -1) {
				return true;
			}
		}
		return false;
	}
}

