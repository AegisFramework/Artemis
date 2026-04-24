/**
 * ==============================
 * Form
 * ==============================
 */
export type FormValue = string | number | boolean | File | null;
export type FormValues = Record<string, FormValue | FormValue[]>;
/**
 * Options for parsing form values
 */
export interface FormParseOptions {
    /**
     * When true (default), every numeric-looking string returned by the form is
     * coerced to a `Number`. This covers `<input type="number">` *and*
     * text / select / textarea values. Forms that hold leading-zero data such as
     * ZIP codes, account IDs, or phone numbers should pass `false` and convert
     * numeric fields explicitly at the call site.
     */
    parseNumbers?: boolean;
    /** Parse a single checkbox into a boolean instead of an array. Default true. */
    parseBooleans?: boolean;
}
export declare class Form {
    private static isNamedControl;
    private static escapeAttributeValue;
    private static formSelector;
    private static nameSelector;
    /**
     * Fill a form with data.
     *
     * @param formName - The data-form attribute value
     * @param data - Key-value pairs to fill
     */
    static fill(formName: string, data: Record<string, unknown>): void;
    /**
     * Get all values from a form.
     *
     * @param formName - The data-form attribute value
     * @param options - Parsing options
     * @returns Form values as a record
     */
    static values(formName: string, options?: FormParseOptions): FormValues;
    /**
     * Parse a string value, optionally converting to number.
     *
     * @param value - String value to parse
     * @param parseNumbers - Whether to parse numeric strings
     */
    private static parseValue;
    /**
     * Reset a form to its initial state.
     *
     * @param formName - The data-form attribute value
     */
    static reset(formName: string): void;
    /**
     * Check if a form is valid according to HTML5 validation.
     *
     * @param formName - The data-form attribute value
     */
    static isValid(formName: string): boolean;
    /**
     * Report validity and show browser validation messages.
     *
     * @param formName - The data-form attribute value
     */
    static reportValidity(formName: string): boolean;
}
//# sourceMappingURL=Form.d.ts.map