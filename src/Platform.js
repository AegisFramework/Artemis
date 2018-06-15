/**
* ==============================
* Platform
* ==============================
*/

/**
 * General checks for what kind of platform is the being used to run the app.
 * @class
 */
export class Platform {

	/**
	 * Check if the screen has a retina pixel ratio
	 * @returns {boolean}
	 */
	static retina () {
		return window.devicePixelRatio >= 2;
	}

	/**
	 * Check if the device is on portrait orientation
	 * @returns {boolean}
	 */
	static portrait () {
		return window.innerHeight > window.innerWidth;
	}

	/**
	 * Check if the device is on landscape orientation
	 * @returns {boolean}
	 */
	static landscape () {
		return (window.orientation === 90 || window.orientation === -90);
	}

	/**
	 * Get device Orientation
	 * @returns {string} portrait | landscape
	 */
	static orientation () {
		return Platform.portrait () ? 'portrait' : 'landscape';
	}

	/**
	 * Check if the app is running over Electron
	 * @returns {boolean}
	 */
	static electron () {
		return window && window.process && window.process.type;
	}

	/**
	 * Check if the app is running over Cordova
	 * @returns {boolean}
	 */
	static cordova () {
		return !!window.cordova;
	}

	/**
	 * Check if the app is running in a desktop platform
	 * @returns {boolean}
	 */
	static desktop (platform = 'Any') {
		let match = false;
		switch (platform) {
			case 'Windows':
				match = navigator.platform.includes ('Win');
				break;

			case 'macOS':
				match = navigator.platform.includes ('Mac');
				break;

			case 'Linux':
				match = navigator.platform.includes ('Linux');
				break;

			case 'FreeBSD':
				match = navigator.platform.includes ('FreeBSD');
				break;

			case 'webOS':
				match = navigator.platform.includes ('WebTV');
				break;

			case 'Any':
			default:
				match = navigator.platform.includes ('Win')
						|| navigator.platform.includes ('Mac')
						|| navigator.platform.includes ('Linux')
						|| navigator.platform.includes ('FreeBSD')
						|| navigator.platform.includes ('WebTV');
				break;
		}
		return match;
	}

	/**
	 * Check if the app is running in a mobile platform
	 * @param {string } [platform='Any'] - Check for a specific mobile platform [Android | iOS | Opera | Windows | BlackBerry | Any]
	 * @returns {boolean}
	 */
	static mobile (platform = 'Any') {
		let match = false;
		switch (platform) {
			case 'Android':
				match = /Android/i.test (navigator.userAgent);
				break;

			case 'iOS':
				match = /iPhone|iPad|iPod/i.test (navigator.userAgent);
				break;

			case 'Opera':
				match = /Opera Mini/i.test (navigator.userAgent);
				break;

			case 'Windows':
				match = /Windows Phone|IEMobile|WPDesktop/i.test (navigator.userAgent);
				break;

			case 'BlackBerry':
				match = /BlackBerry|BB10/i.test (navigator.userAgent);
				break;

			case 'Any':
			default:
				match = /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|WPDesktop|BlackBerry|BB10/i.test (navigator.userAgent);
				break;
		}
		return match;
	}

	/**
	 * @static serviceWorkers - Check if the platform allows the use of service
	 * workers
	 *
	 * @return {boolean} - Whether they're supported or not
	 */
	static serviceWorkers () {
		if (typeof navigator !== undefined) {
			if ('serviceWorker' in navigator && location.protocol.indexOf ('http') > -1) {
				return true;
			}
		}
		return false;
	}
}