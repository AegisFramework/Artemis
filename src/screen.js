/**
* ==============================
* Screen
* ==============================
*/

class Screen {

	static isRetina () {
		return window.devicePixelRatio >= 2;
	}

	static isPortrait () {
		return window.innerHeight > window.innerWidth;
	}

	static isLandscape () {
		return (window.orientation === 90 || window.orientation === -90);
	}

	static getOrientation () {
		return this.isPortrait ? "Portrait" : "Landscape";
	}

	static getMaximumWidth () {
		return window.screen.availWidth;
	}

	static getMaximumHeight () {
		return window.screen.availHeight;
	}
}