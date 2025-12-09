/**
 * ==============================
 * DOM
 * ==============================
 */

export type DOMSelector = string | Element | Element[] | NodeList | NodeListOf<Element> | HTMLElement[] | DOM | null;

export type StyleProperties = Record<string, string | number>;

export interface DOMOffset {
	top: number;
	left: number;
}

export type EventCallback = (event: Event) => void;
export type ElementCallback = (element: HTMLElement, index: number) => void;

/**
 * Simple DOM manipulation functions
 */
export class DOM {
	public collection: HTMLElement[];
	public length: number;

	constructor(selector: DOMSelector) {
		if (!selector) {
			this.collection = [];
		} else if (typeof selector === 'string') {
			this.collection = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
		} else if (selector instanceof NodeList) {
			this.collection = Array.from(selector) as HTMLElement[];
		} else if (selector instanceof DOM) {
			this.collection = selector.collection;
		} else if (selector instanceof Element) {
			this.collection = [selector as HTMLElement];
		} else if (Array.isArray(selector)) {
			this.collection = selector as HTMLElement[];
		} else {
			this.collection = [];
		}

		this.length = this.collection.length;
	}

	/**
	 * Hide elements by setting display to none
	 */
	hide(): this {
		return this.style('display', 'none');
	}

	/**
	 * Show elements by setting display property
	 *
	 * @param display - Display value (default: 'block')
	 */
	show(display: string = 'block'): this {
		return this.style('display', display);
	}

	/**
	 * Add a class to all elements
	 *
	 * @param newClass - Class name to add
	 */
	addClass(newClass: string): this {
		this.collection.forEach(element => element.classList.add(newClass));
		return this;
	}

	/**
	 * Remove a class or all classes from all elements
	 *
	 * @param oldClass - Class name to remove (if omitted, removes all classes)
	 */
	removeClass(oldClass?: string): this {
		this.collection.forEach(element => {
			if (!oldClass) {
				element.className = '';
			} else {
				element.classList.remove(oldClass);
			}
		});

		return this;
	}

	/**
	 * Toggle one or more classes on all elements
	 *
	 * @param classes - Space-separated class names to toggle
	 */
	toggleClass(classes: string): this {
		const classList = classes.split(' ');

		this.collection.forEach(element => {
			classList.forEach(c => element.classList.toggle(c));
		});

		return this;
	}

	/**
	 * Check if all elements have a given class
	 *
	 * @param classToCheck - Class name to check
	 */
	hasClass(classToCheck: string): boolean {
		return this.collection.every(element => element.classList.contains(classToCheck));
	}

	/**
	 * Get or set the value of form elements
	 */
	value(value: string | number): this;
	value(): string | undefined;
	value(value?: string | number): this | string | undefined {
		if (value !== undefined) {
			const valueString = String(value);
			for (const element of this.collection) {
				if (
					element instanceof HTMLInputElement ||
					element instanceof HTMLTextAreaElement ||
					element instanceof HTMLSelectElement ||
					element instanceof HTMLButtonElement ||
					element instanceof HTMLOptionElement
				) {
					element.value = valueString;
				}
			}

			return this;
		}

		if (this.length === 0) {
			return undefined;
		}

		const first = this.collection[0];

		if (
			first instanceof HTMLInputElement ||
			first instanceof HTMLTextAreaElement ||
			first instanceof HTMLSelectElement ||
			first instanceof HTMLButtonElement ||
			first instanceof HTMLOptionElement
		) {
			return first.value;
		}

		return undefined;
	}

	/**
	 * Focus the first element in the collection
	 */
	focus(): this {
		if (this.length > 0) {
			this.collection[0].focus();
		}

		return this;
	}

	/**
	 * Blur (unfocus) the first element in the collection
	 */
	blur(): this {
		if (this.length > 0) {
			this.collection[0].blur();
		}

		return this;
	}

	/**
	 * Attach a click event handler
	 */
	click(callback: EventCallback): this {
		return this.on('click', callback);
	}

	/**
	 * Attach a keyup event handler
	 */
	keyup(callback: EventCallback): this {
		return this.on('keyup', callback);
	}

	/**
	 * Attach a keydown event handler
	 */
	keydown(callback: EventCallback): this {
		return this.on('keydown', callback);
	}

	/**
	 * Attach a submit event handler
	 */
	submit(callback: EventCallback): this {
		return this.on('submit', callback);
	}

	/**
	 * Attach a change event handler
	 */
	change(callback: EventCallback): this {
		return this.on('change', callback);
	}

	/**
	 * Attach a scroll event handler
	 */
	scroll(callback: EventCallback): this {
		return this.on('scroll', callback);
	}

	/**
	 * Attach an input event handler
	 */
	input(callback: EventCallback): this {
		return this.on('input', callback);
	}

	/**
	 * Attach event handlers to elements
	 *
	 * @param eventNames - Space-separated event names
	 * @param targetOrCallback - Either a selector for delegation or a callback
	 * @param callback - Callback function (required if using delegation)
	 */
	on(eventNames: string, targetOrCallback: string | EventCallback, callback?: EventCallback): this {
		const events = eventNames.split(' ');
		const isDelegation = typeof targetOrCallback === 'string';
		const callbackFunction = isDelegation ? callback : (targetOrCallback as EventCallback);
		const selector = isDelegation ? (targetOrCallback as string) : null;

		if (!callbackFunction) {
			return this;
		}

		this.collection.forEach(element => {
			events.forEach(eventName => {
				element.addEventListener(eventName, (e) => {
					if (isDelegation && selector) {
						const target = e.target;
						if (target instanceof Element) {
							const match = target.closest(selector);

							if (match && element.contains(match)) {
								callbackFunction.call(match, e);
							}
						}
					} else {
						callbackFunction.call(element, e);
					}
				}, false);
			});
		});

		return this;
	}

	/**
	 * Remove event handlers from elements
	 *
	 * @param eventNames - Space-separated event names
	 * @param callback - Callback function to remove
	 */
	off(eventNames: string, callback: EventCallback): this {
		const events = eventNames.split(' ');

		this.collection.forEach(element => {
			events.forEach(eventName => {
				element.removeEventListener(eventName, callback);
			});
		});

		return this;
	}

	/**
	 * Trigger events on elements
	 *
	 * @param eventNames - Space-separated event names
	 * @param detail - Custom event detail data
	 */
	trigger(eventNames: string, detail?: unknown): this {
		const events = eventNames.split(' ');

		this.collection.forEach(element => {
			events.forEach(eventName => {
				const customEvent = detail !== undefined
					? new CustomEvent(eventName, { detail, bubbles: true, cancelable: true })
					: new Event(eventName, { bubbles: true, cancelable: true });

				element.dispatchEvent(customEvent);
			});
		});

		return this;
	}

	/**
	 * Filter elements by a selector
	 *
	 * @param selector - CSS selector to match
	 */
	filter(selector: string): DOM {
		return new DOM(this.collection.filter(element => element.matches(selector)));
	}

	/**
	 * Check if the collection contains any elements
	 */
	exists(): boolean {
		return this.length > 0;
	}

	/**
	 * Get or set data attributes
	 *
	 * @param name - Data attribute name (without 'data-' prefix)
	 * @param value - Value to set (if omitted, returns current value)
	 */
	data(name: string): string | undefined;
	data(name: string, value: string): this;
	data(name: string, value?: string): this | string | undefined {
		if (value !== undefined) {
			this.collection.forEach(element => element.dataset[name] = value);
			return this;
		}

		return this.length > 0 ? this.collection[0].dataset[name] : undefined;
	}

	/**
	 * Remove a data attribute from all elements
	 *
	 * @param name - Data attribute name to remove
	 */
	removeData(name: string): this {
		this.collection.forEach(element => delete element.dataset[name]);
		return this;
	}

	/**
	 * Get or set text content
	 */
	text(value: string | number): this;
	text(): string | undefined;
	text(value?: string | number): this | string | undefined {
		if (value !== undefined) {
			const valueString = String(value);

			for (const element of this.collection) {
				element.textContent = valueString;
			}

			return this;
		}

		if (this.length === 0) {
			return undefined;
		}

		return this.collection[0].textContent || '';
	}

	/**
	 * Get or set HTML content
	 */
	html(value: string | number): this;
	html(): string | undefined;
	html(value?: string | number): this | string | undefined {
		if (value !== undefined) {
			const valueString = String(value);

			for (const element of this.collection) {
				element.innerHTML = valueString;
			}
			return this;
		}

		if (this.length === 0) {
			return undefined;
		}

		return this.collection[0].innerHTML;
	}

	/**
	 * Append content to the end of each element
	 *
	 * @param content - HTML string or Element to append
	 */
	append(content: string | Element): this {
		this.collection.forEach((element, index) => {
			if (typeof content === 'string') {
				element.insertAdjacentHTML('beforeend', content);
			} else {
				// Clone if not the first iteration to allow appending one element to multiple parents
				const node = (index === 0) ? content : content.cloneNode(true);
				element.appendChild(node as Node);
			}
		});

		return this;
	}

	/**
	 * Prepend content to the beginning of each element
	 *
	 * @param content - HTML string or Element to prepend
	 */
	prepend(content: string | Element): this {
		this.collection.forEach((element, index) => {
			if (typeof content === 'string') {
				element.insertAdjacentHTML('afterbegin', content);
			} else {
				const node = (index === 0) ? content : content.cloneNode(true);
				element.prepend(node as Node);
			}
		});

		return this;
	}

	/**
	 * Iterate over each element in the collection
	 *
	 * @param callback - Function to call for each element
	 */
	each(callback: ElementCallback): this {
		this.collection.forEach((element, i) => callback(element, i));
		return this;
	}

	/**
	 * Get an element by index
	 *
	 * @param index - Zero-based index
	 */
	get(index: number): HTMLElement | undefined {
		return this.collection[index];
	}

	/**
	 * Get the first element wrapped in a new DOM instance
	 */
	first(): DOM {
		return new DOM(this.collection[0] ?? null);
	}

	/**
	 * Get the last element wrapped in a new DOM instance
	 */
	last(): DOM {
		return new DOM(this.collection[this.collection.length - 1] ?? null);
	}

	/**
	 * Get element at index wrapped in a new DOM instance
	 *
	 * @param index - Zero-based index (negative counts from end)
	 */
	eq(index: number): DOM {
		const actualIndex = index < 0 ? this.collection.length + index : index;
		return new DOM(this.collection[actualIndex] ?? null);
	}

	/**
	 * Check if any element in the collection is visible
	 */
	isVisible(): boolean {
		return this.collection.some(element =>
			element.style.display !== 'none' && element.offsetWidth > 0 && element.offsetHeight > 0
		);
	}

	/**
	 * Get the parent elements of all elements in the collection
	 */
	parent(): DOM {
		const parents = new Set<HTMLElement>();

		this.collection.forEach(element => {
			if (element.parentElement) {
				parents.add(element.parentElement);
			}
		});

		return new DOM(Array.from(parents));
	}

	/**
	 * Get all parent/ancestor elements up to the document
	 */
	parents(): DOM {
		const ancestors = new Set<HTMLElement>();

		this.collection.forEach(element => {
			let parent = element.parentElement;
			while (parent) {
				ancestors.add(parent);
				parent = parent.parentElement;
			}
		});

		return new DOM(Array.from(ancestors));
	}

	/**
	 * Find descendant elements matching a selector
	 *
	 * @param selector - CSS selector
	 */
	find(selector: string): DOM {
		const found = new Set<HTMLElement>();

		for (const element of this.collection) {
			const results = element.querySelectorAll(selector);

			for (const result of results) {
				found.add(result as HTMLElement);
			}
		}

		return new DOM(Array.from(found));
	}

	/**
	 * Get the offset position of the first element
	 */
	offset(): DOMOffset | undefined {
		if (this.length === 0) {
			return undefined;
		}

		const rect = this.collection[0].getBoundingClientRect();

		return {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX
		};
	}

	/**
	 * Get the width of the first element
	 */
	width(): number {
		if (this.length === 0) {
			return 0;
		}

		return this.collection[0].getBoundingClientRect().width;
	}

	/**
	 * Get the height of the first element
	 */
	height(): number {
		if (this.length === 0) {
			return 0;
		}

		return this.collection[0].getBoundingClientRect().height;
	}

	/**
	 * Get the closest ancestor matching a selector
	 *
	 * @param selector - CSS selector
	 */
	closest(selector: string): DOM {
		const found = new Set<HTMLElement>();

		this.collection.forEach(element => {
			const match = element.closest(selector);

			if (match) {
				found.add(match as HTMLElement);
			}
		});

		return new DOM(Array.from(found));
	}

	/**
	 * Get or set an attribute
	 *
	 * @param attr - Attribute name
	 * @param value - Value to set (if omitted, returns current value)
	 */
	attribute(attr: string): string | null | undefined;
	attribute(attr: string, value: string | number): this;
	attribute(attr: string, value?: string | number): this | string | null | undefined {
		if (value !== undefined) {
			this.collection.forEach(element => element.setAttribute(attr, String(value)));
			return this;
		}

		return this.length > 0 ? this.collection[0].getAttribute(attr) : undefined;
	}

	/**
	 * Remove an attribute from all elements
	 *
	 * @param attr - Attribute name to remove
	 */
	removeAttribute(attr: string): this {
		this.collection.forEach(element => element.removeAttribute(attr));
		return this;
	}

	/**
	 * Check if all elements have a given attribute
	 *
	 * @param attribute - Attribute name
	 */
	hasAttribute(attribute: string): boolean {
		return this.collection.every(element => element.hasAttribute(attribute));
	}

	/**
	 * Insert HTML after each element
	 *
	 * @param content - HTML string to insert
	 */
	after(content: string): this {
		this.collection.forEach(element => element.insertAdjacentHTML('afterend', content));
		return this;
	}

	/**
	 * Insert HTML before each element
	 *
	 * @param content - HTML string to insert
	 */
	before(content: string): this {
		this.collection.forEach(element => element.insertAdjacentHTML('beforebegin', content));
		return this;
	}

	/**
	 * Get or set CSS styles
	 */
	style(prop: string): string;
	style(prop: StyleProperties): this;
	style(prop: string, value: string): this;
	style(properties: string | StyleProperties, value?: string): this | string {
		if (typeof properties === 'string' && value === undefined) {
			return this.length > 0 ? this.collection[0].style.getPropertyValue(properties) : '';
		}

		this.collection.forEach(element => {
			if (typeof properties === 'string' && value !== undefined) {
				element.style.setProperty(properties, value);
			} else if (typeof properties === 'object') {
				Object.entries(properties).forEach(([k, v]) => {
					element.style.setProperty(k, String(v));
				});
			}
		});

		return this;
	}

	/**
	 * Animate elements using the Web Animations API
	 *
	 * @param keyframes - Animation keyframes
	 * @param options - Animation options
	 */
	animate(keyframes: Keyframe[] | PropertyIndexedKeyframes, options: number | KeyframeAnimationOptions): this {
		this.collection.forEach(element => element.animate(keyframes, options));
		return this;
	}

	/**
	 * Fade elements in
	 *
	 * @param duration - Animation duration in ms
	 * @param callback - Function to call after animation completes
	 */
	fadeIn(duration: number = 400, callback?: () => void): this {
		this.collection.forEach((element, index) => {
			if (getComputedStyle(element).display === 'none') {
				element.style.display = 'block';
			}

			const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: duration,
				fill: 'forwards',
			});

			// Trigger callback only once after the last element finishes
			if (callback && index === this.collection.length - 1) {
				animation.onfinish = () => callback();
			}
		});

		return this;
	}

	/**
	 * Fade elements out
	 *
	 * @param duration - Animation duration in ms
	 * @param callback - Function to call after animation completes
	 */
	fadeOut(duration: number = 400, callback?: () => void): this {
		this.collection.forEach((element, index) => {
			const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: duration,
				fill: 'forwards',
			});

			animation.onfinish = () => {
				element.style.display = 'none';
				if (callback && index === this.collection.length - 1) {
					callback();
				}
			};
		});

		return this;
	}

	/**
	 * Check if all elements match a selector
	 *
	 * @param selector - CSS selector
	 */
	matches(selector: string): boolean {
		if (this.length === 0) {
			return false;
		}

		return this.collection.every(element => element.matches(selector));
	}

	/**
	 * Remove all elements from the DOM
	 */
	remove(): this {
		this.collection.forEach(element => element.remove());
		return this;
	}

	/**
	 * Remove all child elements
	 */
	empty(): this {
		this.collection.forEach(element => {
			element.innerHTML = '';
		});

		return this;
	}

	/**
	 * Clone all elements in the collection
	 *
	 * @param deep - Whether to clone child nodes (default: true)
	 */
	clone(deep: boolean = true): DOM {
		const clones = this.collection.map(element => element.cloneNode(deep) as HTMLElement);
		return new DOM(clones);
	}

	/**
	 * Replace elements with new content
	 *
	 * @param newContent - HTML string or Element to replace with
	 */
	replaceWith(newContent: string | Element): this {
		for (let i = this.collection.length - 1; i >= 0; i--) {
			const element = this.collection[i];

			if (typeof newContent === 'string') {
				element.outerHTML = newContent;
			} else {
				const nodeToInsert = (i === 0) ? newContent : newContent.cloneNode(true);
				element.replaceWith(nodeToInsert);
			}
		}

		return this;
	}

	/**
	 * Reset form elements
	 */
	reset(): this {
		this.collection.forEach(element => {
			if (element instanceof HTMLFormElement) {
				element.reset();
			}
		});

		return this;
	}

	/**
	 * Get or set a DOM property
	 *
	 * @param name - Property name
	 * @param value - Value to set (if omitted, returns current value)
	 */
	property<K extends keyof HTMLElement>(name: K, value: HTMLElement[K]): this;
	property<K extends keyof HTMLElement>(name: K): HTMLElement[K] | undefined;
	property<K extends keyof HTMLElement>(name: K, value?: HTMLElement[K]): this | HTMLElement[K] | undefined {
		if (value !== undefined) {
			this.collection.forEach(element => {
				(element as HTMLElement)[name] = value;
			});
			return this;
		}

		if (this.length === 0) {
			return undefined;
		}

		return this.collection[0][name];
	}

	/**
	 * Get sibling elements
	 */
	siblings(): DOM {
		const siblings = new Set<HTMLElement>();

		this.collection.forEach(element => {
			if (element.parentElement) {
				Array.from(element.parentElement.children).forEach(sibling => {
					if (sibling !== element && sibling instanceof HTMLElement) {
						siblings.add(sibling);
					}
				});
			}
		});

		return new DOM(Array.from(siblings));
	}

	/**
	 * Get the next sibling element
	 */
	next(): DOM {
		const nexts = new Set<HTMLElement>();

		this.collection.forEach(element => {
			const next = element.nextElementSibling;
			if (next instanceof HTMLElement) {
				nexts.add(next);
			}
		});

		return new DOM(Array.from(nexts));
	}

	/**
	 * Get the previous sibling element
	 */
	prev(): DOM {
		const prevs = new Set<HTMLElement>();

		this.collection.forEach(element => {
			const prev = element.previousElementSibling;
			if (prev instanceof HTMLElement) {
				prevs.add(prev);
			}
		});

		return new DOM(Array.from(prevs));
	}

	/**
	 * Get all child elements
	 */
	children(): DOM {
		const allChildren = new Set<HTMLElement>();

		this.collection.forEach(element => {
			Array.from(element.children).forEach(child => {
				if (child instanceof HTMLElement) {
					allChildren.add(child);
				}
			});
		});

		return new DOM(Array.from(allChildren));
	}

	/**
	 * Scroll element into view
	 *
	 * @param options - Scroll options
	 */
	scrollIntoView(options?: ScrollIntoViewOptions): this {
		if (this.length > 0) {
			this.collection[0].scrollIntoView(options);
		}
		return this;
	}
}

/**
 * Create a new DOM instance
 *
 * @param selector - CSS selector, Element, or collection
 */
export function $_(selector: DOMSelector): DOM {
	return new DOM(selector);
}

/**
 * Execute a callback when the DOM is ready
 *
 * @param callback - Function to execute
 */
export function $_ready(callback: () => void): void {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', callback);
	} else {
		callback();
	}
}

/**
 * Create a new element
 *
 * @param tagName - HTML tag name
 * @param attributes - Optional attributes to set
 */
export function $_create<K extends keyof HTMLElementTagNameMap>(
	tagName: K,
	attributes?: Record<string, string>
): DOM {
	const element = document.createElement(tagName);

	if (attributes) {
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
	}

	return new DOM(element);
}
