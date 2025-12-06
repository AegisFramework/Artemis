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
export declare class DOM {
    collection: Element[] | NodeListOf<Element>;
    length: number;
    _selector: DOMSelector;
    /**
     * Create a new DOM object
     *
     * @param selector - Selector or DOM element to use
     */
    constructor(selector: DOMSelector);
    /**
     * Hide elements by setting their `display` property to 'none'.
     *
     * @returns Current instance
     */
    hide(): this;
    /**
     * Show elements by setting their `display` property to the given value.
     *
     * @param display - Display property to set
     * @returns Current instance
     */
    show(display?: string): this;
    /**
     * Add a class to the classList object
     *
     * @param newClass - Class name to add
     * @returns Current instance
     */
    addClass(newClass: string): this;
    /**
     * Remove a given class from the classList object
     *
     * @param oldClass - Class to remove. If it's empty or null, all classes will be removed
     * @returns Current instance
     */
    removeClass(oldClass?: string | null): this;
    /**
     * Toggle between two classes
     *
     * @param classes - Space separated class names
     * @returns Current instance
     */
    toggleClass(classes: string): this;
    /**
     * Check if ALL elements in the collection have the given class
     *
     * @param classToCheck - Class name to check for
     * @returns Whether all elements have the class
     */
    hasClass(classToCheck: string): boolean;
    /**
     * Get or set the value from the elements
     *
     * @param value - Value to set to the elements
     * @returns If a value is provided, returns current instance. Otherwise returns the value(s) - single value if one element, array if multiple.
     */
    value(value?: string): this | string | string[] | undefined;
    /**
     * Focus on the first element matching the selector
     *
     * @returns Current instance
     */
    focus(): this;
    /**
     * Add a callback for the 'click' event on every element matching the selector
     *
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    click(callback: EventCallback): this;
    /**
     * Add a callback for the 'keyup' event on every element matching the selector
     *
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    keyup(callback: EventCallback): this;
    /**
     * Add a callback for the 'keydown' event on every element matching the selector
     *
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    keydown(callback: EventCallback): this;
    /**
     * Add a callback for the 'submit' event on every element matching the selector
     *
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    submit(callback: EventCallback): this;
    /**
     * Add a callback for the 'change' event on every element matching the selector
     *
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    change(callback: EventCallback): this;
    /**
     * Add a callback for the 'scroll' event on every element matching the selector
     *
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    scroll(callback: EventCallback): this;
    /**
     * Add a callback function to a given event
     *
     * @param event - Event to add the listener to
     * @param target - Target element on which to detect the event or callback function
     * @param callback - Callback function to run when the event is triggered
     * @returns Current instance
     */
    on(event: string, target: string | EventCallback, callback?: EventCallback): this;
    /**
     * Filter from the current collection to only those matching the new selector
     * Applies to ALL elements in the collection
     *
     * @param selector - Selector to filter the collection with
     * @returns New DOM instance with the filtered collection
     */
    filter(selector: string): DOM;
    /**
     * Check if there are any elements that match the selector.
     *
     * @returns Whether elements matching the selector existed or not
     */
    exists(): boolean;
    /**
     * Get or set a `data` property
     *
     * @param name - Name of the data property
     * @param value - Value of the property
     * @returns If no value is provided, returns the value(s) - single value if one element, array if multiple.
     */
    data(name: string, value?: string): this | string | string[] | undefined;
    /**
     * Remove a data property from all the elements on the collection given its name.
     *
     * @param name - Name of the data property to remove
     * @returns Current instance
     */
    removeData(name: string): this;
    /**
     * Get or set the text of elements
     *
     * @param value - Value to set the text to
     * @returns If no value is provided, returns the text(s) - single value if one element, array if multiple.
     */
    text(value?: string): this | string | (string | null)[] | null | undefined;
    /**
     * Get or set the inner HTML of elements
     *
     * @param value - Value to set the HTML to
     * @returns If no value is provided, returns the HTML(s) - single value if one element, array if multiple.
     */
    html(value?: string): this | string | string[] | undefined;
    /**
     * Append an element to ALL elements in the collection
     *
     * @param element - String representation of the element to add or an Element
     * @returns Current instance
     */
    append(element: string | Element): this;
    /**
     * Prepend an element to ALL elements in the collection
     *
     * @param element - String representation of the element to add or an Element
     * @returns Current instance
     */
    prepend(element: string | Element): this;
    /**
     * Iterate over the collection of elements matching the selector
     *
     * @param callback - Callback to run for every element
     * @returns Current instance
     */
    each(callback: ElementCallback): this;
    /**
     * Get an element from the collection given its index
     *
     * @param index - Index of the element to retrieve
     * @returns HTML Element in the position indicated by the index
     */
    get(index: number): Element | undefined;
    /**
     * Get the first element in the collection
     *
     * @returns DOM instance with the first element
     */
    first(): DOM;
    /**
     * Get the last element in the collection
     *
     * @returns DOM instance with the last element
     */
    last(): DOM;
    /**
     * Check if any element in the collection is visible by checking their
     * display, offsetWidth and offsetHeight properties
     *
     * @returns Whether any element is visible
     */
    isVisible(): boolean;
    /**
     * Get the parents of ALL elements in the collection
     *
     * @returns DOM instance of the parent elements
     */
    parent(): DOM;
    /**
     * Find elements that match the given selector in ALL elements of the collection
     *
     * @param selector - Selector to find elements with
     * @returns DOM instance with found elements
     */
    find(selector: string): DOM;
    /**
     * Get the top and left offsets of elements in the collection
     *
     * @returns Single offset object if one element, array of offset objects if multiple
     */
    offset(): DOMOffset | DOMOffset[] | undefined;
    /**
     * Find the closest element matching the given selector for ALL elements.
     * This bubbles up from the initial object and then follows to its parents.
     *
     * @param selector - Selector to match the closest element with
     * @returns DOM instance with the closest HTML elements matching the selector
     */
    closest(selector: string): DOM;
    /**
     * Find the closest parent element matching the given selector. This bubbles up
     * from the initial object and then follows to its parents.
     *
     * @param selector - Selector to match the closest element with
     * @param limit - Selector for limit element. If the limit is reached and no element matching the provided selector was found, it will cause an early return.
     * @returns DOM instance with the closest HTML element matching the selector
     */
    closestParent(selector: string, limit?: string): DOM;
    /**
     * Get or set the value of a given attribute
     *
     * @param attribute - Attribute's name
     * @param value - Value to set the attribute to
     * @returns If no value is provided, returns the attribute value(s) - single value if one element, array if multiple.
     */
    attribute(attribute: string, value?: string | number): this | string | (string | null)[] | null | undefined;
    /**
     * Check whether ALL elements have an attribute
     *
     * @param attribute - The name of the attribute to check existence for
     * @returns Whether all elements have the attribute
     */
    hasAttribute(attribute: string): boolean;
    /**
     * Insert content after all elements in the collection
     *
     * @param content - String representation of the content to add
     * @returns Current instance
     */
    after(content: string): this;
    /**
     * Insert content before all elements in the collection
     *
     * @param content - String representation of the content to add
     * @returns Current instance
     */
    before(content: string): this;
    /**
     * Get or modify the `style` properties of the elements matching the selector
     *
     * @param properties - Properties to change or get. Can be either an individual property or a JSON object with key-value pairs
     * @param value - Value to set the property to when only changing one property
     * @returns If a property is given but not a value for it, returns the style value(s) - single value if one element, array if multiple.
     */
    style(properties: string | StyleProperties, value?: string): this | string | string[] | undefined;
    /**
     * Animate the given `style` properties on all elements in the collection
     * with a given time duration
     *
     * @param style - JSON object with the key-value pairs of properties to animate
     * @param time - Time in milliseconds during which the properties will be animated
     * @returns Current instance
     */
    animate(style: Record<string, number>, time: number): this;
    /**
     * Use a fade in animation on ALL elements in the collection
     *
     * @param time - Time duration for the animation
     * @param callback - Callback function to run once all animations are over
     * @returns Current instance
     */
    fadeIn(time?: number, callback?: () => void): this;
    /**
     * Use a fade out animation on ALL elements in the collection
     *
     * @param time - Time duration for the animation
     * @param callback - Callback function to run once all animations are over
     * @returns Current instance
     */
    fadeOut(time?: number, callback?: () => void): this;
    /**
     * Check if ALL elements in the collection match a given selector
     *
     * @param selector - Selector to match
     * @returns Whether all elements match the selector
     */
    matches(selector: string): boolean;
    /**
     * Remove all elements in the collection
     *
     * @returns Current instance
     */
    remove(): this;
    /**
     * Replace ALL elements in the collection with a new element
     *
     * @param newElement - The replacement element or HTML string
     * @returns Current instance
     */
    replaceWith(newElement: string | Element): this;
    /**
     * Reset every element in the collection (for form elements)
     *
     * @returns Current instance
     */
    reset(): this;
    /**
     * Get or set a property for elements in the collection
     *
     * @param property - Property name to set or get
     * @param value - Value to set the property to
     * @returns If no value is provided, returns the property value(s) - single value if one element, array if multiple.
     */
    property<T = unknown>(property: string, value?: T): this | T | T[] | undefined;
}
/**
 * Simple wrapper function to use the DOM library
 *
 * @param selector - Selector or DOM element to use
 * @returns DOM instance
 */
export declare function $_(selector: DOMSelector): DOM;
/**
 * Utility function to attach the 'load' listener to the window
 *
 * @param callback - Callback function to run when the window is ready
 */
export declare function $_ready(callback: EventListener): void;
//# sourceMappingURL=DOM.d.ts.map