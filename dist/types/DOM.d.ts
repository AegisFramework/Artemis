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
export declare class DOM {
    collection: HTMLElement[];
    length: number;
    constructor(selector: DOMSelector);
    /**
     * Hide elements by setting display to none
     */
    hide(): this;
    /**
     * Show elements by setting display property
     *
     * @param display - Display value (default: 'block')
     */
    show(display?: string): this;
    /**
     * Add a class to all elements
     *
     * @param newClass - Class name to add
     */
    addClass(newClass: string): this;
    /**
     * Remove a class or all classes from all elements
     *
     * @param oldClass - Class name to remove (if omitted, removes all classes)
     */
    removeClass(oldClass?: string): this;
    /**
     * Toggle one or more classes on all elements
     *
     * @param classes - Space-separated class names to toggle
     */
    toggleClass(classes: string): this;
    /**
     * Check if all elements have a given class
     *
     * @param classToCheck - Class name to check
     */
    hasClass(classToCheck: string): boolean;
    /**
     * Get or set the value of form elements
     */
    value(value: string | number): this;
    value(): string | undefined;
    /**
     * Focus the first element in the collection
     */
    focus(): this;
    /**
     * Blur (unfocus) the first element in the collection
     */
    blur(): this;
    /**
     * Attach a click event handler
     */
    click(callback: EventCallback): this;
    /**
     * Attach a keyup event handler
     */
    keyup(callback: EventCallback): this;
    /**
     * Attach a keydown event handler
     */
    keydown(callback: EventCallback): this;
    /**
     * Attach a submit event handler
     */
    submit(callback: EventCallback): this;
    /**
     * Attach a change event handler
     */
    change(callback: EventCallback): this;
    /**
     * Attach a scroll event handler
     */
    scroll(callback: EventCallback): this;
    /**
     * Attach an input event handler
     */
    input(callback: EventCallback): this;
    /**
     * Attach event handlers to elements
     *
     * @param eventNames - Space-separated event names
     * @param targetOrCallback - Either a selector for delegation or a callback
     * @param callback - Callback function (required if using delegation)
     */
    on(eventNames: string, targetOrCallback: string | EventCallback, callback?: EventCallback): this;
    /**
     * Remove event handlers from elements
     *
     * @param eventNames - Space-separated event names
     * @param callback - Callback function to remove
     */
    off(eventNames: string, callback: EventCallback): this;
    /**
     * Trigger events on elements
     *
     * @param eventNames - Space-separated event names
     * @param detail - Custom event detail data
     */
    trigger(eventNames: string, detail?: unknown): this;
    /**
     * Filter elements by a selector
     *
     * @param selector - CSS selector to match
     */
    filter(selector: string): DOM;
    /**
     * Check if the collection contains any elements
     */
    exists(): boolean;
    /**
     * Get or set data attributes
     *
     * @param name - Data attribute name (without 'data-' prefix)
     * @param value - Value to set (if omitted, returns current value)
     */
    data(name: string): string | undefined;
    data(name: string, value: string): this;
    /**
     * Remove a data attribute from all elements
     *
     * @param name - Data attribute name to remove
     */
    removeData(name: string): this;
    /**
     * Get or set text content
     */
    text(value: string | number): this;
    text(): string | undefined;
    /**
     * Get or set HTML content
     */
    html(value: string | number): this;
    html(): string | undefined;
    /**
     * Append content to the end of each element
     *
     * @param content - HTML string or Element to append
     */
    append(content: string | Element): this;
    /**
     * Prepend content to the beginning of each element
     *
     * @param content - HTML string or Element to prepend
     */
    prepend(content: string | Element): this;
    /**
     * Iterate over each element in the collection
     *
     * @param callback - Function to call for each element
     */
    each(callback: ElementCallback): this;
    /**
     * Get an element by index
     *
     * @param index - Zero-based index
     */
    get(index: number): HTMLElement | undefined;
    /**
     * Get the first element wrapped in a new DOM instance
     */
    first(): DOM;
    /**
     * Get the last element wrapped in a new DOM instance
     */
    last(): DOM;
    /**
     * Get element at index wrapped in a new DOM instance
     *
     * @param index - Zero-based index (negative counts from end)
     */
    eq(index: number): DOM;
    /**
     * Check if any element in the collection is visible
     */
    isVisible(): boolean;
    /**
     * Get the parent elements of all elements in the collection
     */
    parent(): DOM;
    /**
     * Get all parent/ancestor elements up to the document
     */
    parents(): DOM;
    /**
     * Find descendant elements matching a selector
     *
     * @param selector - CSS selector
     */
    find(selector: string): DOM;
    /**
     * Get the offset position of the first element
     */
    offset(): DOMOffset | undefined;
    /**
     * Get the width of the first element
     */
    width(): number;
    /**
     * Get the height of the first element
     */
    height(): number;
    /**
     * Get the closest ancestor matching a selector
     *
     * @param selector - CSS selector
     */
    closest(selector: string): DOM;
    /**
     * Get or set an attribute
     *
     * @param attr - Attribute name
     * @param value - Value to set (if omitted, returns current value)
     */
    attribute(attr: string): string | null | undefined;
    attribute(attr: string, value: string | number): this;
    /**
     * Remove an attribute from all elements
     *
     * @param attr - Attribute name to remove
     */
    removeAttribute(attr: string): this;
    /**
     * Check if all elements have a given attribute
     *
     * @param attribute - Attribute name
     */
    hasAttribute(attribute: string): boolean;
    /**
     * Insert HTML after each element
     *
     * @param content - HTML string to insert
     */
    after(content: string): this;
    /**
     * Insert HTML before each element
     *
     * @param content - HTML string to insert
     */
    before(content: string): this;
    /**
     * Get or set CSS styles
     */
    style(prop: string): string;
    style(prop: StyleProperties): this;
    style(prop: string, value: string): this;
    /**
     * Animate elements using the Web Animations API
     *
     * @param keyframes - Animation keyframes
     * @param options - Animation options
     */
    animate(keyframes: Keyframe[] | PropertyIndexedKeyframes, options: number | KeyframeAnimationOptions): this;
    /**
     * Fade elements in
     *
     * @param duration - Animation duration in ms
     * @param callback - Function to call after animation completes
     */
    fadeIn(duration?: number, callback?: () => void): this;
    /**
     * Fade elements out
     *
     * @param duration - Animation duration in ms
     * @param callback - Function to call after animation completes
     */
    fadeOut(duration?: number, callback?: () => void): this;
    /**
     * Check if all elements match a selector
     *
     * @param selector - CSS selector
     */
    matches(selector: string): boolean;
    /**
     * Remove all elements from the DOM
     */
    remove(): this;
    /**
     * Remove all child elements
     */
    empty(): this;
    /**
     * Clone all elements in the collection
     *
     * @param deep - Whether to clone child nodes (default: true)
     */
    clone(deep?: boolean): DOM;
    /**
     * Replace elements with new content
     *
     * @param newContent - HTML string or Element to replace with
     */
    replaceWith(newContent: string | Element): this;
    /**
     * Reset form elements
     */
    reset(): this;
    /**
     * Get or set a DOM property
     *
     * @param name - Property name
     * @param value - Value to set (if omitted, returns current value)
     */
    property<K extends keyof HTMLElement>(name: K, value: HTMLElement[K]): this;
    property<K extends keyof HTMLElement>(name: K): HTMLElement[K] | undefined;
    /**
     * Get sibling elements
     */
    siblings(): DOM;
    /**
     * Get the next sibling element
     */
    next(): DOM;
    /**
     * Get the previous sibling element
     */
    prev(): DOM;
    /**
     * Get all child elements
     */
    children(): DOM;
    /**
     * Scroll element into view
     *
     * @param options - Scroll options
     */
    scrollIntoView(options?: ScrollIntoViewOptions): this;
}
/**
 * Create a new DOM instance
 *
 * @param selector - CSS selector, Element, or collection
 */
export declare function $_(selector: DOMSelector): DOM;
/**
 * Execute a callback when the DOM is ready
 *
 * @param callback - Function to execute
 */
export declare function $_ready(callback: () => void): void;
/**
 * Create a new element
 *
 * @param tagName - HTML tag name
 * @param attributes - Optional attributes to set
 */
export declare function $_create<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes?: Record<string, string>): DOM;
//# sourceMappingURL=DOM.d.ts.map