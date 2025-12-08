/**
 * ==============================
 * DOM
 * ==============================
 */

/**
 * Type for elements that can be used as a selector
 */
export type DOMSelector = string | Element | Element[] | NodeList | NodeListOf<Element> | HTMLElement[] | DOM | null;

/**
 * Type for style properties object
 */
export type StyleProperties = Record<string, string | number>;

/**
 * Type for offset object
 */
export interface DOMOffset {
	top: number;
	left: number;
}

/**
 * Event callback type
 */
export type EventCallback = (event: Event) => void;

/**
 * Element callback type
 */
export type ElementCallback = (element: Element) => void;

/**
 * Simple DOM manipulation functions
 */
export class DOM {
	public collection: Element[] | NodeListOf<Element>;
	public length: number;
	public _selector: DOMSelector;

	/**
	 * Create a new DOM object
	 *
	 * @param selector - Selector or DOM element to use
	 */
	constructor(selector: DOMSelector) {
		if (selector === null) {
			this.collection = [];
			this.length = 0;
			this._selector = null;
			return;
		}

		if (typeof selector === 'string') {
			this.collection = document.querySelectorAll(selector);
			this.length = this.collection.length;
			this._selector = selector;
		} else if (selector instanceof NodeList) {
			this.collection = selector as NodeListOf<Element>;
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
		} else if (Array.isArray(selector)) {
			this.collection = selector;
			this.length = selector.length;
			this._selector = selector;
		} else {
			this.collection = [];
			this.length = 0;
			this._selector = null;
		}
	}

	/**
	 * Hide elements by setting their `display` property to 'none'.
	 *
	 * @returns Current instance
	 */
	hide(): this {
		for (const element of this.collection) {
			(element as HTMLElement).style.display = 'none';
		}
		return this;
	}

	/**
	 * Show elements by setting their `display` property to the given value.
	 *
	 * @param display - Display property to set
	 * @returns Current instance
	 */
	show(display: string = 'block'): this {
		for (const element of this.collection) {
			(element as HTMLElement).style.display = display;
		}
		return this;
	}

	/**
	 * Add a class to the classList object
	 *
	 * @param newClass - Class name to add
	 * @returns Current instance
	 */
	addClass(newClass: string): this {
		for (const element of this.collection) {
			element.classList.add(newClass);
		}
		return this;
	}

	/**
	 * Remove a given class from the classList object
	 *
	 * @param oldClass - Class to remove. If it's empty or null, all classes will be removed
	 * @returns Current instance
	 */
	removeClass(oldClass: string | null = null): this {
		if (oldClass !== null) {
			for (const element of this.collection) {
				element.classList.remove(oldClass);
			}
		} else {
			for (const element of this.collection) {
				while (element.classList.length > 0) {
					const className = element.classList.item(0);
					if (className) {
						element.classList.remove(className);
					}
				}
			}
		}
		return this;
	}

	/**
	 * Toggle between two classes
	 *
	 * @param classes - Space separated class names
	 * @returns Current instance
	 */
	toggleClass(classes: string): this {
		const classList = classes.split(' ');
		for (const element of this.collection) {
			for (const className of classList) {
				element.classList.toggle(className);
			}
		}
		return this;
	}

	/**
	 * Check if ALL elements in the collection have the given class
	 *
	 * @param classToCheck - Class name to check for
	 * @returns Whether all elements have the class
	 */
	hasClass(classToCheck: string): boolean {
		for (const element of this.collection) {
			if (!element.classList.contains(classToCheck)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Get or set the value from the elements
	 *
	 * @param value - Value to set to the elements
	 * @returns If a value is provided, returns current instance. Otherwise returns the value(s) - single value if one element, array if multiple.
	 */
	value(value?: string): this | string | string[] | undefined {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				(element as HTMLInputElement).value = value;
			}
			return this;
		} else {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return (this.collection[0] as HTMLInputElement).value;
			}
			const values: string[] = [];
			for (const element of this.collection) {
				values.push((element as HTMLInputElement).value);
			}
			return values;
		}
	}

	/**
	 * Focus on the first element matching the selector
	 *
	 * @returns Current instance
	 */
	focus(): this {
		if (this.length > 0) {
			(this.collection[0] as HTMLElement).focus();
		}
		return this;
	}

	/**
	 * Add a callback for the 'click' event on every element matching the selector
	 *
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	click(callback: EventCallback): this {
		for (const element of this.collection) {
			element.addEventListener('click', callback, false);
		}
		return this;
	}

	/**
	 * Add a callback for the 'keyup' event on every element matching the selector
	 *
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	keyup(callback: EventCallback): this {
		for (const element of this.collection) {
			element.addEventListener('keyup', callback, false);
		}
		return this;
	}

	/**
	 * Add a callback for the 'keydown' event on every element matching the selector
	 *
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	keydown(callback: EventCallback): this {
		for (const element of this.collection) {
			element.addEventListener('keydown', callback, false);
		}
		return this;
	}

	/**
	 * Add a callback for the 'submit' event on every element matching the selector
	 *
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	submit(callback: EventCallback): this {
		for (const element of this.collection) {
			element.addEventListener('submit', callback, false);
		}
		return this;
	}

	/**
	 * Add a callback for the 'change' event on every element matching the selector
	 *
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	change(callback: EventCallback): this {
		for (const element of this.collection) {
			element.addEventListener('change', callback, false);
		}
		return this;
	}

	/**
	 * Add a callback for the 'scroll' event on every element matching the selector
	 *
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	scroll(callback: EventCallback): this {
		for (const element of this.collection) {
			element.addEventListener('scroll', callback, false);
		}
		return this;
	}

	/**
	 * Add a callback function to a given event
	 *
	 * @param event - Event to add the listener to
	 * @param target - Target element on which to detect the event or callback function
	 * @param callback - Callback function to run when the event is triggered
	 * @returns Current instance
	 */
	on(event: string, target: string | EventCallback, callback?: EventCallback): this {
		const events = event.split(' ');
		for (const element of this.collection) {
			for (const evt of events) {
				// Check if no target was defined and just a function was provided
				if (typeof target === 'function') {
					element.addEventListener(evt, target, false);
				} else if (typeof target === 'string' && typeof callback === 'function') {
					element.addEventListener(evt, (e: Event) => {
						if (!e.target) {
							return;
						}

						const domInstance = new DOM(e.target as Element);
						const targetElement = domInstance.closestParent(target, this._selector as string);

						if (targetElement.exists()) {
							callback.call(targetElement.get(0), e);
						}
					}, false);
				}
			}
		}
		return this;
	}

	/**
	 * Filter from the current collection to only those matching the new selector
	 * Applies to ALL elements in the collection
	 *
	 * @param selector - Selector to filter the collection with
	 * @returns New DOM instance with the filtered collection
	 */
	filter(selector: string): DOM {
		const filtered: HTMLElement[] = [];
		for (const element of this.collection) {
			if (element.matches(selector)) {
				filtered.push(element as HTMLElement);
			}
		}
		return new DOM(filtered.length > 0 ? filtered : null);
	}

	/**
	 * Check if there are any elements that match the selector.
	 *
	 * @returns Whether elements matching the selector existed or not
	 */
	exists(): boolean {
		return this.length > 0;
	}

	/**
	 * Get or set a `data` property
	 *
	 * @param name - Name of the data property
	 * @param value - Value of the property
	 * @returns If no value is provided, returns the value(s) - single value if one element, array if multiple.
	 */
	data(name: string, value?: string): this | string | string[] | undefined {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				(element as HTMLElement).dataset[name] = value;
			}
			return this;
		} else {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return (this.collection[0] as HTMLElement).dataset[name];
			}
			const values: (string | undefined)[] = [];
			for (const element of this.collection) {
				values.push((element as HTMLElement).dataset[name]);
			}
			return values as string[];
		}
	}

	/**
	 * Remove a data property from all the elements on the collection given its name.
	 *
	 * @param name - Name of the data property to remove
	 * @returns Current instance
	 */
	removeData(name: string): this {
		for (const element of this.collection) {
			delete (element as HTMLElement).dataset[name];
		}
		return this;
	}

	/**
	 * Get or set the text of elements
	 *
	 * @param value - Value to set the text to
	 * @returns If no value is provided, returns the text(s) - single value if one element, array if multiple.
	 */
	text(value?: string): this | string | (string | null)[] | null | undefined {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.textContent = value;
			}
			return this;
		} else {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return this.collection[0].textContent;
			}
			const values: (string | null)[] = [];
			for (const element of this.collection) {
				values.push(element.textContent);
			}
			return values;
		}
	}

	/**
	 * Get or set the inner HTML of elements
	 *
	 * @param value - Value to set the HTML to
	 * @returns If no value is provided, returns the HTML(s) - single value if one element, array if multiple.
	 */
	html(value?: string): this | string | string[] | undefined {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.innerHTML = value;
			}
			return this;
		} else {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return this.collection[0].innerHTML;
			}
			const values: string[] = [];
			for (const element of this.collection) {
				values.push(element.innerHTML);
			}
			return values;
		}
	}

	/**
	 * Append an element to ALL elements in the collection
	 *
	 * @param element - String representation of the element to add or an Element
	 * @returns Current instance
	 */
	append(element: string | Element): this {
		let isFirstElement = true;
		for (const el of this.collection) {
			if (typeof element === 'string') {
				const div = document.createElement('div');
				div.innerHTML = element.trim();
				if (div.firstChild) {
					el.appendChild(div.firstChild.cloneNode(true));
				}
			} else {
				// For the first target, append the original element to preserve
				// custom element state/props. For subsequent targets, clone.
				// Note: Cloned custom elements will have their constructor re-run,
				// which may reset state/props to defaults.
				if (isFirstElement) {
					el.appendChild(element);
					isFirstElement = false;
				} else {
					el.appendChild(element.cloneNode(true));
				}
			}
		}
		return this;
	}

	/**
	 * Prepend an element to ALL elements in the collection
	 *
	 * @param element - String representation of the element to add or an Element
	 * @returns Current instance
	 */
	prepend(element: string | Element): this {
		let isFirstElement = true;

		for (const el of this.collection) {
			if (typeof element === 'string') {
				const div = document.createElement('div');
				div.innerHTML = element.trim();
				if (div.firstChild) {
					if (el.childNodes.length > 0) {
						el.insertBefore(div.firstChild.cloneNode(true), el.childNodes[0]);
					} else {
						el.appendChild(div.firstChild.cloneNode(true));
					}
				}
			} else {
				// For the first target, use the original element to preserve
				// custom element state/props. For subsequent targets, clone.
				// Note: Cloned custom elements will have their constructor re-run,
				// which may reset state/props to defaults.
				const nodeToInsert = isFirstElement ? element : element.cloneNode(true);
				if (isFirstElement) {
					isFirstElement = false;
				}

				if (el.childNodes.length > 0) {
					el.insertBefore(nodeToInsert, el.childNodes[0]);
				} else {
					el.appendChild(nodeToInsert);
				}
			}
		}
		return this;
	}

	/**
	 * Iterate over the collection of elements matching the selector
	 *
	 * @param callback - Callback to run for every element
	 * @returns Current instance
	 */
	each(callback: ElementCallback): this {
		for (const element of this.collection) {
			callback(element);
		}
		return this;
	}

	/**
	 * Get an element from the collection given its index
	 *
	 * @param index - Index of the element to retrieve
	 * @returns HTML Element in the position indicated by the index
	 */
	get(index: number): Element | undefined {
		return this.collection[index];
	}

	/**
	 * Get the first element in the collection
	 *
	 * @returns DOM instance with the first element
	 */
	first(): DOM {
		if (this.length > 0) {
			return new DOM(this.collection[0] as HTMLElement);
		}
		return new DOM(null);
	}

	/**
	 * Get the last element in the collection
	 *
	 * @returns DOM instance with the last element
	 */
	last(): DOM {
		if (this.length > 0) {
			return new DOM(this.collection[this.collection.length - 1] as HTMLElement);
		}
		return new DOM(null);
	}

	/**
	 * Check if any element in the collection is visible by checking their
	 * display, offsetWidth and offsetHeight properties
	 *
	 * @returns Whether any element is visible
	 */
	isVisible(): boolean {
		for (const element of this.collection) {
			const el = element as HTMLElement;
			if (el.style.display !== 'none' && el.offsetWidth > 0 && el.offsetHeight > 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get the parents of ALL elements in the collection
	 *
	 * @returns DOM instance of the parent elements
	 */
	parent(): DOM {
		const parents: HTMLElement[] = [];
		for (const element of this.collection) {
			if (element.parentElement && !parents.includes(element.parentElement)) {
				parents.push(element.parentElement);
			}
		}
		return new DOM(parents.length > 0 ? parents : null);
	}

	/**
	 * Find elements that match the given selector in ALL elements of the collection
	 *
	 * @param selector - Selector to find elements with
	 * @returns DOM instance with found elements
	 */
	find(selector: string): DOM {
		const found: HTMLElement[] = [];
		for (const element of this.collection) {
			const results = element.querySelectorAll(selector);
			for (const result of results) {
				if (!found.includes(result as HTMLElement)) {
					found.push(result as HTMLElement);
				}
			}
		}
		return new DOM(found.length > 0 ? found : null);
	}

	/**
	 * Get the top and left offsets of elements in the collection
	 *
	 * @returns Single offset object if one element, array of offset objects if multiple
	 */
	offset(): DOMOffset | DOMOffset[] | undefined {
		if (this.length === 0) {
			return undefined;
		}
		if (this.length === 1) {
			const rect = this.collection[0].getBoundingClientRect();
			return {
				top: rect.top + document.body.scrollTop,
				left: rect.left + document.body.scrollLeft
			};
		}
		const offsets: DOMOffset[] = [];
		for (const element of this.collection) {
			const rect = element.getBoundingClientRect();
			offsets.push({
				top: rect.top + document.body.scrollTop,
				left: rect.left + document.body.scrollLeft
			});
		}
		return offsets;
	}

	/**
	 * Find the closest element matching the given selector for ALL elements.
	 * This bubbles up from the initial object and then follows to its parents.
	 *
	 * @param selector - Selector to match the closest element with
	 * @returns DOM instance with the closest HTML elements matching the selector
	 */
	closest(selector: string): DOM {
		const found: HTMLElement[] = [];
		for (const element of this.collection) {
			const closest = element.closest(selector) as HTMLElement | null;
			if (closest && !found.includes(closest)) {
				found.push(closest);
			}
		}
		return new DOM(found.length > 0 ? found : null);
	}

	/**
	 * Find the closest parent element matching the given selector. This bubbles up
	 * from the initial object and then follows to its parents.
	 *
	 * @param selector - Selector to match the closest element with
	 * @param limit - Selector for limit element. If the limit is reached and no element matching the provided selector was found, it will cause an early return.
	 * @returns DOM instance with the closest HTML element matching the selector
	 */
	closestParent(selector: string, limit?: string): DOM {
		if (this.length === 0) {
			return new DOM(null);
		}

		let current: Element | null = this.collection[0];
		while (current) {
			// Check if the current element matches the selector
			if (current.matches(selector)) {
				return new DOM(current as HTMLElement);
			}

			// Check if we hit the limit
			if (typeof limit === 'string' && current.matches(limit)) {
				break;
			}

			current = current.parentElement;
		}
		return new DOM(null);
	}

	/**
	 * Get or set the value of a given attribute
	 *
	 * @param attribute - Attribute's name
	 * @param value - Value to set the attribute to
	 * @returns If no value is provided, returns the attribute value(s) - single value if one element, array if multiple.
	 */
	attribute(attribute: string, value?: string | number): this | string | (string | null)[] | null | undefined {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				element.setAttribute(attribute, String(value));
			}
			return this;
		} else {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return this.collection[0].getAttribute(attribute);
			}
			const values: (string | null)[] = [];
			for (const element of this.collection) {
				values.push(element.getAttribute(attribute));
			}
			return values;
		}
	}

	/**
	 * Check whether ALL elements have an attribute
	 *
	 * @param attribute - The name of the attribute to check existence for
	 * @returns Whether all elements have the attribute
	 */
	hasAttribute(attribute: string): boolean {
		for (const element of this.collection) {
			if (!element.hasAttribute(attribute)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Insert content after all elements in the collection
	 *
	 * @param content - String representation of the content to add
	 * @returns Current instance
	 */
	after(content: string): this {
		for (const element of this.collection) {
			element.insertAdjacentHTML('afterend', content);
		}
		return this;
	}

	/**
	 * Insert content before all elements in the collection
	 *
	 * @param content - String representation of the content to add
	 * @returns Current instance
	 */
	before(content: string): this {
		for (const element of this.collection) {
			element.insertAdjacentHTML('beforebegin', content);
		}
		return this;
	}

	/**
	 * Get or modify the `style` properties of the elements matching the selector
	 *
	 * @param properties - Properties to change or get. Can be either an individual property or a JSON object with key-value pairs
	 * @param value - Value to set the property to when only changing one property
	 * @returns If a property is given but not a value for it, returns the style value(s) - single value if one element, array if multiple.
	 */
	style(properties: string | StyleProperties, value?: string): this | string | string[] | undefined {
		// Getting a style property
		if (typeof properties === 'string' && typeof value === 'undefined') {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return (this.collection[0] as HTMLElement).style.getPropertyValue(properties);
			}
			const values: string[] = [];
			for (const element of this.collection) {
				values.push((element as HTMLElement).style.getPropertyValue(properties));
			}
			return values;
		}

		// Setting style properties
		for (const element of this.collection) {
			const el = element as HTMLElement;
			if (typeof properties === 'string' && typeof value !== 'undefined') {
				el.style.setProperty(properties, value);
			} else if (typeof properties === 'object') {
				for (const property in properties) {
					el.style.setProperty(property, String(properties[property]));
				}
			}
		}
		return this;
	}

	/**
	 * Animate the given `style` properties on all elements in the collection
	 * with a given time duration
	 *
	 * @param style - JSON object with the key-value pairs of properties to animate
	 * @param time - Time in milliseconds during which the properties will be animated
	 * @returns Current instance
	 */
	animate(style: Record<string, number>, time: number): this {
		for (let i = 0; i < this.collection.length; i++) {
			const element = this.collection[i] as HTMLElement;
			for (const property in style) {
				const start = Date.now();
				let initialValue: number;

				if (typeof element.style.getPropertyValue(property) !== 'undefined' && element.style.getPropertyValue(property) !== '') {
					initialValue = parseFloat(element.style.getPropertyValue(property));

					const timer = setInterval(() => {
						const step = Math.min(1, (Date.now() - start) / time);
						element.style.setProperty(property, String(initialValue + step * (style[property] - initialValue)));

						if (step === 1) {
							clearInterval(timer);
						}
					}, 25);
					element.style.setProperty(property, String(initialValue));
				} else if (typeof (element as unknown as Record<string, number>)[property] !== 'undefined') {
					initialValue = (element as unknown as Record<string, number>)[property];

					const timer = setInterval(() => {
						const step = Math.min(1, (Date.now() - start) / time);
						(element as unknown as Record<string, number>)[property] = initialValue + step * (style[property] - initialValue);

						if (step === 1) {
							clearInterval(timer);
						}
					}, 25);
					(element as unknown as Record<string, number>)[property] = initialValue;
				}
			}
		}
		return this;
	}

	/**
	 * Use a fade in animation on ALL elements in the collection
	 *
	 * @param time - Time duration for the animation
	 * @param callback - Callback function to run once all animations are over
	 * @returns Current instance
	 */
	fadeIn(time: number = 400, callback?: () => void): this {
		let completed = 0;
		const total = this.collection.length;

		for (const el of this.collection) {
			const element = el as HTMLElement;
			element.style.opacity = '0';

			let last = Date.now();

			const tick = (): void => {
				element.style.opacity = String(parseFloat(element.style.opacity) + (Date.now() - last) / time);
				last = Date.now();

				if (parseFloat(element.style.opacity) < 1) {
					requestAnimationFrame(tick);
				} else {
					completed++;
					if (completed === total && typeof callback === 'function') {
						callback();
					}
				}
			};

			tick();
		}

		return this;
	}

	/**
	 * Use a fade out animation on ALL elements in the collection
	 *
	 * @param time - Time duration for the animation
	 * @param callback - Callback function to run once all animations are over
	 * @returns Current instance
	 */
	fadeOut(time: number = 400, callback?: () => void): this {
		let completed = 0;
		const total = this.collection.length;

		for (const el of this.collection) {
			const element = el as HTMLElement;
			let last = Date.now();

			const tick = (): void => {
				element.style.opacity = String(parseFloat(element.style.opacity) - (Date.now() - last) / time);
				last = Date.now();

				if (parseFloat(element.style.opacity) > 0) {
					requestAnimationFrame(tick);
				} else {
					completed++;
					if (completed === total && typeof callback === 'function') {
						callback();
					}
				}
			};

			tick();
		}

		return this;
	}

	/**
	 * Check if ALL elements in the collection match a given selector
	 *
	 * @param selector - Selector to match
	 * @returns Whether all elements match the selector
	 */
	matches(selector: string): boolean {
		if (this.length === 0) {
			return false;
		}

		for (const element of this.collection) {
			if (!element.matches(selector)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Remove all elements in the collection
	 *
	 * @returns Current instance
	 */
	remove(): this {
		for (const element of this.collection) {
			element.parentNode?.removeChild(element);
		}
		return this;
	}

	/**
	 * Replace ALL elements in the collection with a new element
	 *
	 * @param newElement - The replacement element or HTML string
	 * @returns Current instance
	 */
	replaceWith(newElement: string | Element): this {
		for (const element of this.collection) {
			let replaceElement: Element;

			if (typeof newElement === 'string') {
				const div = document.createElement('div');
				div.innerHTML = newElement;
				replaceElement = div.firstChild as Element;
			} else {
				replaceElement = newElement.cloneNode(true) as Element;
			}

			element.parentElement?.replaceChild(replaceElement, element);
		}
		return this;
	}

	/**
	 * Reset every element in the collection (for form elements)
	 *
	 * @returns Current instance
	 */
	reset(): this {
		for (const element of this.collection) {
			if ((element as HTMLFormElement).reset) {
				(element as HTMLFormElement).reset();
			}
		}
		return this;
	}

	/**
	 * Get or set a property for elements in the collection
	 *
	 * @param property - Property name to set or get
	 * @param value - Value to set the property to
	 * @returns If no value is provided, returns the property value(s) - single value if one element, array if multiple.
	 */
	property<T = unknown>(property: string, value?: T): this | T | T[] | undefined {
		if (typeof value !== 'undefined') {
			for (const element of this.collection) {
				(element as unknown as Record<string, T>)[property] = value;
			}
			return this;
		} else {
			if (this.length === 0) {
				return undefined;
			}
			if (this.length === 1) {
				return (this.collection[0] as unknown as Record<string, T>)[property];
			}
			const values: T[] = [];
			for (const element of this.collection) {
				values.push((element as unknown as Record<string, T>)[property]);
			}
			return values;
		}
	}
}

/**
 * Simple wrapper function to use the DOM library
 *
 * @param selector - Selector or DOM element to use
 * @returns DOM instance
 */
export function $_(selector: DOMSelector): DOM {
	return new DOM(selector);
}

/**
 * Utility function to attach the 'load' listener to the window
 *
 * @param callback - Callback function to run when the window is ready
 */
export function $_ready(callback: EventListener): void {
	window.addEventListener('load', callback);
}

