/**
 * ==============================
 * Form
 * ==============================
 */
/**
 * Form data object type
 */
export type FormData = Record<string, string | File | FileList | undefined>;
/**
 * Utility class that provides simple functions for filling and retrieving values
 * from forms. This class requires the use of the `data-form` attribute.
 */
export declare class Form {
    /**
     * Fill a form's inputs with the given values. Each key in the provided object
     * must match the `name` attribute of the input to fill.
     *
     * @param name - Form name. Must match the `data-form` attribute of the Form.
     * @param data - JSON object with key-value pairs to fill the inputs.
     */
    static fill(name: string, data: Record<string, string>): void;
    /**
     * Get all the values from a form's inputs. The keys are mapped using the
     * `name` attribute of each input.
     *
     * @param name - Form name. Must match the `data-form` attribute of the Form.
     * @returns Key-value JSON object
     */
    static values(name: string): FormData;
}
//# sourceMappingURL=Form.d.ts.map