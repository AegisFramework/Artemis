/**
* ==============================
* Storage
* ==============================
*/

export default class Storage {

	static key (index) {
		return localStorage.key (index);
	}

	static keys () {
		return Object.keys (localStorage);
	}

	static get (key) {
		return localStorage.getItem (key);
	}

	static set (key, value) {
		localStorage.setItem (key, value);
	}

	static remove (key) {
		localStorage.removeItem (key);
	}

	static clear () {
		localStorage.clear ();
	}
}