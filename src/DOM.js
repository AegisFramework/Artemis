/**
 * ==============================
 * DOM
 * ==============================
 */

/**
 * Simple DOM manipulation functions
 *
 * @class
 */
export class DOM {

	/**
	 * Create a new DOM object
	 *
	 * @constructor
	 * @param  {string|Object|array} selector - Selector or DOM element to use
	 * @return {DOM} - New instance of DOM
	 */
	constructor (selector) {

		if (selector === null) {
			this.collection = [];
			this.length = 0;
			return;
		}

		if (typeof selector == 'string') {
			this.collection = document.querySelectorAll (selector);
			this.length = this.collection.length;
			this._selector = selector;
		} else if (selector instanceof NodeList) {
			this.collection = selector;
			this.length = selector.length;
			this._selector = selector;
		} else if (selector instanceof DOM) {
			this.collection = selector.collection;
			this.length = this.collection.length;
			this._selector = selector._selector;
		} else if (selector instanceof HTMLElement) {
			this.collection = [selector];
			this.length = this.collection.length;
			this._selector = selector;
		} else if (typeof selector == 'object') {
			if (selector.length >= 1) {
				this.collection = selector;
			} else {
				this.collection = [selector];
			}
			this.length = this.collection.length;
			this._selector = selector;
		} else {
			return undefined;
		}

	}

	/**
	 * Hide elements by setting their `display` property to 'none'.
	 *
	 * @return {DOM} - Current instance
	 */
	hide () {
		for (const element of this.collection) {
			element.style.display = 'none';
		}

		return this;
	}

	/**
	 * Show elements by setting their `display` property to the given value.
	 *
	 * @param {string} [display='block'] - Display property to set
	 *
	 * @return {DOM} - Current instance
	 */
	show (display = 'block') {
		for (const element of this.collection) {
			element.style.display = display;
		}

		return this;
	}

	/**
	 * Add a class to the classList object
	 *
	 * @param  {string} newClass - Class name to add
	 *
	 * @return {DOM} - Current instance
	 */
	addClass (newClass) {
		for (const element of this.collection) {
			element.classList.add (newClass);
		}

		return this;
	}

	/**
	 * Remove a given class from the classList object
	 *
	 * @param  {string} [oldClass=null] - Class to remove. If it's empty or null,
	 * all classes will be removed
	 *
	 * @return {DOM} - Current instance
	 */
	removeClass (oldClass = null) {
		if (oldClass !== null) {
			for (const element of this.collection) {
				element.classList.remove (oldClass);
			}
		} else {
			for (const element of this.collection) {
				while (element.classList.length > 0) {
					element.classList.remove (element.classList.item (0));
				}
			}
		}

		return this;
	}

	/**
	 * Toggle between two classes
	 *
	 * @param  {string} classes - Space separated class names
	 *
	 * @return {DOM} - Current instance
	 */
	toggleClass (classes) {
		classes = classes.split (' ');
		for (const element of this.collection) {
			for (let j = 0; j < classes.length; j++) {
				element.classList.toggle (classes[j]);
			}
		}

		return this;
	}

	/**
	 * Check if the first element matching the selector has the given class
	 *
	 * @param  {string} classToCheck - Class name to check for
	 *
	 * @return {boolean} - Whether the class is present or not
	 */
	hasClass (classToCheck) {
		for (const element of this.collection) {
			if (!element.classList.contains (classToCheck)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Get or set the value from the first element matching the selector
	 *
	 * @param  {string} value - Value to set to the element.
	 *
	 * @return {string|DOM} - If a value is provided, this returns the current
	 * instance, otherwise it returns the value of the element instead of
	 * setting it
	 */
	value (value) {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.value = value;
			}

			return this;
		} else {
			if (this.length > 0) {
				return this.collection[0].value;
			}
		}
	}

	/**
	 * Focus on the first element matching the selector
	 *
	 * @return {DOM} - Current instance
	 */
	focus () {
		if (this.length > 0) {
			this.collection[0].focus ();
		}

		return this;
	}

	/**
	 * Add a callback for the 'click' event on every element matching the selector
	 *
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	click (callback) {
		for (const element of this.collection) {
			element.addEventListener ('click', callback, false);
		}

		return this;
	}

	/**
	 * Add a callback for the 'keyup' event on every element matching the selector
	 *
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	keyup (callback) {
		for (const element of this.collection) {
			element.addEventListener ('keyup', callback, false);
		}

		return this;
	}

	/**
	 * Add a callback for the 'keydown' event on every element matching the selector
	 *
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	keydown (callback) {
		for (const element of this.collection) {
			element.addEventListener ('keydown', callback, false);
		}

		return this;
	}

	/**
	 * Add a callback for the 'submit' event on every element matching the selector
	 *
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	submit (callback) {
		for (const element of this.collection) {
			element.addEventListener ('submit', callback, false);
		}

		return this;
	}

	/**
	 * Add a callback for the 'change' event on every element matching the selector
	 *
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	change (callback) {
		for (const element of this.collection) {
			element.addEventListener ('change', callback, false);
		}

		return this;
	}

	/**
	 * Add a callback for the 'scroll' event on every element matching the selector
	 *
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	scroll (callback) {
		for (const element of this.collection) {
			element.addEventListener ('scroll', callback, false);
		}

		return this;
	}

	/**
	 * Add a callback function to a given event
	 *
	 * @param  {string} event - Event to add the listener to
	 * @param  {string} target - Target element on which to detect the event
	 * @param  {function} callback - Callback function to run when the event is triggered
	 *
	 * @return {DOM} - Current instance
	 */
	on (event, target, callback) {
		event = event.split(' ');
		for (const element of this.collection) {
			for (let j = 0; j < event.length; j++) {

				// Check if no target was defined and just a function was provided
				if (typeof target === 'function') {
					element.addEventListener(event[j], target, false);
				} else if (typeof target === 'string' && typeof callback === 'function') {
					element.addEventListener(event[j], (e) => {
						if (!e.target) {
							return;
						}

						const targetElement = $_(e.target).closestParent (target, this._selector);

						if (targetElement.exists ()) {
							callback.call (targetElement.get (0), e);
						} else {
							return;
						}
					}, false);
				}
			}
		}

		return this;
	}

	/**
	 * Filter from the current collection to only those matching the new selector
	 *
	 * @param  {string} element - Selector to filter the collection with
	 *
	 * @return {DOM} - New DOM instance with the filtered collection
	 */
	filter (selector) {
		if (this.length > 0) {
			return new DOM (this.collection[0].querySelector (selector));
		}

		return new DOM (null);
	}

	/**
	 * Check if there are any elements that match the selector.
	 *
	 * @return {boolean} - Whether elements matching the selector existed or not
	 */
	exists () {
		return this.length > 0;
	}

	/**
	 * Get or set a `data` property
	 *
	 * @param  {string} name - Name of the data property
	 * @param  {string} [value] - Value of the property
	 *
	 * @return {string|DOM} - If no value is provided, this function returns
	 * the first matching element value, otherwise it returns the current instance
	 */
	data (name, value) {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.dataset[name] = value;
			}

			return this;
		} else {
			if (this.length > 0) {
				return this.collection[0].dataset[name];
			}
		}
	}

	/**
	 * Remove a data property from all the elements on the collection given its
	 * name.
	 *
	 * @param {string} name - Name of the data property to remove
	 *
	 * @return {DOM} - Current instance
	 */
	removeData (name) {
		for (const element of this.collection) {
			delete element.dataset[name];
		}

		return this;
	}

	/**
	 * Get or set the text of the first element matching the selector
	 *
	 * @param  {string} [value] - Value to set the text to
	 *
	 * @return {string|DOM} - If no value is provided, this function returns the
	 * inner text of the first matching element. Otherwise it returns the current
	 * instance.
	 */
	text (value) {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.textContent = value;
			}

			return this;
		} else {
			if (this.length > 0) {
				return this.collection[0].textContent;
			}
		}
	}

	/**
	 * Get or set the inner HTML of the first element matching the selector
	 *
	 * @param  {string} [value] - Value to set the HTML to
	 *
	 * @return {string|DOM} - If no value is provided, this function returns the
	 * first matching element HTML. Otherwise it returns the current instance
	 */
	html (value) {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.innerHTML = value;
			}

			return this;
		} else {
			if (this.length > 0) {
				return this.collection[0].innerHTML;
			}
		}
	}

	/**
	 * Append an element to the first element matching the selector
	 *
	 * @param  {string} element - String representation of the element to add
	 *
	 * @return {DOM} - Current instance
	 */
	append (element) {
		if (this.length > 0) {
			if (typeof element === 'string') {
				const div = document.createElement ('div');
				if (typeof element === 'string') {
					div.innerHTML = element.trim ();
				} else {
					div.innerHTML = element;
				}
				this.collection[0].appendChild (div.firstChild);
			} else {
				this.collection[0].appendChild (element);
			}
		}

		return this;
	}

	/**
	 * Prepend an element to the first element matching the selector
	 *
	 * @param  {string} element - String representation of the element to add
	 *
	 * @return {DOM} - Current instance
	 */
	prepend (element) {
		if (this.length > 0) {
			if (typeof element === 'string') {
				const div = document.createElement ('div');
				if (typeof element === 'string') {
					div.innerHTML = element.trim ();
				} else {
					div.innerHTML = element;
				}
				if (this.collection[0].childNodes.length > 0) {
					this.collection[0].insertBefore (div.firstChild, this.collection[0].childNodes[0]);
				} else {
					this.collection[0].appendChild (div.firstChild);
				}
			} else {
				if (this.collection[0].childNodes.length > 0) {
					this.collection[0].insertBefore (element, this.collection[0].childNodes[0]);
				} else {
					this.collection[0].appendChild (element);
				}
			}
		}

		return this;
	}

	/**
	 * Iterate over the collection of elements matching the selector
	 *
	 * @param  {function} callback - Callback to run for every element
	 *
	 * @return {DOM} - Current instance
	 */
	each (callback) {
		for (const element of this.collection) {
			callback (element);
		}

		return this;
	}

	/**
	 * Get an element from the collection given it's index
	 *
	 * @param  {int} index - Index of the element to retrieve
	 *
	 * @return {HTMLElement} - HTML Element in the position indicated by the index
	 */
	get (index) {
		return this.collection[index];
	}

	/**
	 * Get the first element in the collection
	 *
	 * @return {DOM} - DOM instance with the first element
	 */
	first () {
		if (this.length > 0) {
			return new DOM (this.collection[0]);
		}

		return new DOM (null);
	}

	/**
	 * Get the last element in the collection
	 *
	 * @return {DOM} - DOM instance with the last element
	 */
	last () {
		if (this.length > 0) {
			return new DOM (this.collection[this.collection.length - 1]);
		}

		return new DOM (null);
	}

	/**
	 * Check if the elements in the collection are visible by checking their
	 * display, offsetWidth and offsetHeight properties
	 *
	 * @return {boolean} - Whether the elements are visible or not
	 */
	isVisible () {
		for (const element of this.collection) {
			if (element.display != 'none' && element.offsetWidth > 0 && element.offsetHeight > 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get the parent of the first element matching the selector
	 *
	 * @return {DOM} - DOM instance of the parent element
	 */
	parent () {
		if (this.length > 0) {
			return new DOM (this.collection[0].parentElement);
		}

		return new DOM (null);
	}

	/**
	 * Find an element that matches the given selector in the first element of the collection
	 *
	 * @param  {string} selector - Selector to find the element with
	 *
	 * @return {DOM} - DOM instance with the element if found
	 */
	find (selector) {
		if (this.length > 0) {
			return new DOM (this.collection[0].querySelectorAll (selector));
		}

		return new DOM (null);
	}

	/**
	 * Get the top and left offsets of the first element matching the selector
	 *
	 * @return {object|void} - Object with `top` and `left` offsets
	 */
	offset () {
		if (this.length > 0) {
			const rect = this.collection[0].getBoundingClientRect ();
			return {
				top: rect.top + document.body.scrollTop,
				left: rect.left + document.body.scrollLeft
			};
		}
	}

	/**
	 * Find the closest element matching the given selector. This bubbles up
	 * from the initial object and then follows to its parents.
	 *
	 * @param  {string} selector - Selector to match the closest element with
	 *
	 * @return {DOM} - DOM instance with the closest HTML element matching the selector
	 */
	closest (selector) {
		let found = null;
		let element = this;
		while (element.exists () && found === null) {
			// Check if the current element matches the selector
			const matches = element.matches (selector);

			if (matches === true) {
				return element;
			}

			const search = element.find (selector);
			if (search) {
				if (search.length > 0) {
					found = search;
				}
			}
			element = element.parent ();
		}

		if (found !== null) {
			return found;
		}

		return element;
	}

	/**
	 * Find the closest parent element matching the given selector. This bubbles up
	 * from the initial object and then follows to its parents.
	 *
	 * @param  {string} selector - Selector to match the closest element with
	 * @param  {string} limit - Selector for limit element. If the limit is reached
	 * and no element matching the provided selector was found, it will cause an
	 * early return.
	 *
	 * @return {DOM} - DOM instance with the closest HTML element matching the selector
	 */
	closestParent (selector, limit) {
		let element = this;
		while (element.exists ()) {

			// Check if the current element matches the selector
			const matches = element.matches (selector);

			if (matches === true) {
				return element;
			}

			if (typeof limit === 'string') {
				if (element.matches (limit)) {
					break;
				}
			}

			element = element.parent ();
		}

		return new DOM (null);
	}

	/**
	 * Get or set the value of a given attribute
	 *
	 * @param  {string} attribute - Attribute's name
	 * @param  {string|Number} [value] - Value to set the attribute to
	 *
	 * @return {string|number|DOM} - If no value is provided, this function returns the current
	 * value of the provided attribute
	 */
	attribute (attribute, value) {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.setAttribute (attribute, value);
			}

			return this;
		} else {
			if (this.length > 0) {
				return this.collection[0].getAttribute (attribute);
			}
		}
	}

	/**
	 * Check whether an element has an attribute or not
	 *
	 * @param {string} attribute - The name of the attribute to check existance for
	 *
	 * @returns {boolean} - Whether or not the attribute is present
	 */
	hasAttribute (attribute) {
		for (const element of this.collection) {
			if (!element.hasAttribute (attribute)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Insert content to the `after` property of an element
	 *
	 * @param  {string} content - String representation of the content to add
	 *
	 * @return {DOM} - Current instance
	 */
	after (content) {
		for (const element of this.collection) {
			element.insertAdjacentHTML ('afterend', content);
		}

		return this;
	}

	/**
	 * Insert content to the `before` property of an element
	 *
	 * @param  {string} content - String representation of the content to add
	 *
	 * @return {DOM} - Current instance
	 */
	before (content) {
		for (const element of this.collection) {
			element.insertAdjacentHTML ('beforebegin', content);
		}

		return this;
	}

	/**
	 * Get or modify the `style` properties of the elements matching the selector
	 *
	 * @param  {string|Object} properties - Properties to change or get. Can be
	 * either an individual property or a JSON object with key-value pairs
	 * @param  {string} [value] - Value to set the property to when only changing
	 * one property
	 *
	 * @return {string|DOM} - If a property is given but not a value for it, this
	 * function will return its current value
	 */
	style (properties, value) {
		for (let i = 0; i < this.collection.length; i++) {
			if (typeof properties === 'string' && value !== 'undefined') {
				this.collection[i].style[properties] = value;

				return this;
			} else if (typeof properties === 'string' && value === 'undefined') {
				return this.collection[i].style[properties];
			} else if (typeof properties === 'object') {
				for (const property in properties) {
					this.collection[i].style[property] = properties[property];
				}

				return this;
			}
		}
	}

	/**
	 * Animate the given `style` properties on all elements in the collection in
	 * with a given time duration
	 *
	 * @param  {Object} style - JSON object with the key-value pairs of properties
	 * to animate
	 * @param  {int} time - Time in milliseconds during which the properties will
	 * be animated
	 *
	 * @return {DOM} - Current instance
	 */
	animate (style, time) {
		for (let i = 0; i < this.collection.length; i++) {
			for (const property in style) {

				const start = new Date().getTime();
				const collection = this.collection;
				let timer;
				let initialValue;
				if (typeof this.collection[i].style[property] !== 'undefined') {
					initialValue = this.collection[i].style[property];

					timer = setInterval (() => {
						const step = Math.min (1, (new Date ().getTime () - start) / time);

						collection[i].style[property] = (initialValue + step * (style[property] - initialValue));

						if (step == 1) {
							clearInterval (timer);
						}
					}, 25);
					this.collection[i].style[property] = initialValue;

				} else if (typeof (this.collection[i])[property] !== 'undefined') {
					initialValue = (this.collection[i])[property];

					timer = setInterval(() => {
						const step = Math.min (1, (new Date ().getTime () - start) / time);

						(collection[i])[property] = (initialValue + step * (style[property] - initialValue));

						if (step == 1) {
							clearInterval (timer);
						}
					}, 25);
					(this.collection[i])[property] = initialValue;
				}
			}
		}

		return this;
	}

	/**
	 * Use a fade in animation i the first element matching the selector
	 *
	 * @param  {type} [time=400] - Time duration for the animation
	 * @param  {type} callback - Callback function to run once the animation is over
	 *
	 * @return {DOM} - Current instance
	 */
	fadeIn (time = 400, callback) {
		if (this.length > 0) {
			const element = this.collection[0];
			element.style.opacity = 0;

			let last = +new Date();

			const tick = () => {
				element.style.opacity = +element.style.opacity + (new Date() - last) / time;
				last = +new Date();

				if (+element.style.opacity < 1) {
					(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
				} else {
					if (typeof callback === 'function') {
						callback();
					}
				}
			};

			tick();
		}

		return this;
	}

	/**
	 * Use a fade out animation i the first element matching the selector
	 *
	 * @param  {type} [time=400] - Time duration for the animation
	 * @param  {type} callback - Callback function to run once the animation is over
	 *
	 * @return {DOM} - Current instance
	 */
	fadeOut (time = 400, callback) {
		if (this.length > 0) {
			let last = +new Date ();
			const element = this.collection[0];
			const tick = () => {
				element.style.opacity = +element.style.opacity - (new Date() - last) / time;
				last = +new Date ();

				if (+element.style.opacity > 0) {
					(window.requestAnimationFrame && requestAnimationFrame (tick)) || setTimeout(tick, 16);
				} else {
					if (typeof callback === 'function') {
						callback ();
					}
				}
			};
			tick ();
		}

		return this;
	}

	/**	Check if the first element in the collection matches a given selector
	 *
	 * @param  {string} selector - Selector to match
	 *
	 * @return {boolean} - Whether the element matches the selector or not
	 */
	matches (selector) {
		const check = Element.prototype;
		const polyfill = check.matches || check.webkitMatchesSelector || check.mozMatchesSelector || check.msMatchesSelector || function () {
			return [].indexOf.call (document.querySelectorAll (selector), this) !== -1;
		};

		if (this.length > 0) {
			return polyfill.call (this.collection[0], selector);
		}

		return false;
	}

	/**
	 * Remove all elements in the collection
	 *
	 * @return {DOM} - Current instance
	 */
	remove () {
		for (const element of this.collection) {
			element.parentNode.removeChild (element);
		}

		return this;
	}

	/**
	 * Replace the first element in the collection with a new one
	 *
	 * @return {DOM} - Current instance
	 */
	replaceWith (newElement) {
		let replaceElement = newElement;

		if (typeof newElement === 'string') {
			const div = document.createElement ('div');
			div.innerHTML = newElement;
			replaceElement = div.firstChild;
		}

		for (const element of this.collection) {
			element.parentElement.replaceChild (replaceElement, element);
		}

		return this;
	}

	/**
	 * Reset every element in the collection
	 *
	 * @return {DOM} - Current instance
	 */
	reset () {
		for (const element of this.collection) {
			element.reset ();
		}

		return this;
	}

	/**
	 * Get or set a property for the first element in the collection
	 *
	 * @param  {string} property - Property name to set or get
	 * @param  {string|Number} [value] - Value to set the property to
	 *
	 * @return {string|Number} - If no value is provided, this function will return the
	 * current value of the indicated property
	 */
	property (property, value) {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element[property] = value;
			}

			return this;
		} else {
			if (this.length > 0) {
				return this.collection[0][property];
			}
		}
	}
}

/**
 * Simple wrapper function to use the DOM library
 *
 * @param  {string|Object|array} selector - Selector or DOM element to use
 *
 * @return {DOM} - DOM instance or class if no selector is used
 */
export function $_ (selector) {
	if (typeof selector !== 'undefined') {
		return new DOM (selector);
	} else {
		return DOM;
	}
}

/**
 * Utility function to attach the 'load' listener to the window
 *
 * @param  {function} callback - Callback function to run when the window is ready
 */
export function $_ready (callback) {
	window.addEventListener ('load', callback);
}