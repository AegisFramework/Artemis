/**
 * ==============================
 * Form
 * ==============================
 */

export type FormValue = string | number | boolean | File | null;
export type FormValues = Record<string, FormValue | FormValue[]>;
type NamedFormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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

export class Form {
  private static isNamedControl(element: Element): element is NamedFormControl {
    return (
      (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) &&
      element.name !== '' &&
      !element.disabled
    );
  }

  private static escapeAttributeValue(value: string): string {
    // Escape `\` first so subsequent backslashes aren't double-encoded.
    // Then hex-escape `'` (the string delimiter) and every C0/DEL control
    // character per CSS Syntax Module §4.3.5. We avoid `\'` because some
    // selector parsers (e.g. happy-dom's regex-based one) treat the next
    // `'` as the closing quote regardless of the preceding backslash.
    return value
      .replace(/\\/g, '\\\\')
      .replace(new RegExp("[\\u0000-\\u001F\\u007F']", 'g'), (ch) => `\\${ch.charCodeAt(0).toString(16).toUpperCase()} `);
  }

  private static formSelector(formName: string): string {
    return `form[data-form='${Form.escapeAttributeValue(formName)}']`;
  }

  private static nameSelector(name: string): string {
    return `[name='${Form.escapeAttributeValue(name)}']`;
  }

  /**
   * Fill a form with data.
   *
   * @param formName - The data-form attribute value
   * @param data - Key-value pairs to fill
   */
  static fill(formName: string, data: Record<string, unknown>): void {
    const form = document.querySelector(Form.formSelector(formName)) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return;
    }

    Object.entries(data).forEach(([name, value]) => {
      // Skip nullish values so we don't unset existing state (e.g. uncheck a
      // radio group, write the literal string "null" into a text field).
      if (value === null || value === undefined) return;

      const elements = form.querySelectorAll(Form.nameSelector(name));

      if (elements.length === 0) return;

      const firstElement = elements[0] as HTMLInputElement;
      const type = firstElement.type;
      const valString = String(value);

      switch (type) {
        case 'radio':
          elements.forEach((el) => {
            const input = el as HTMLInputElement;
            input.checked = input.value === valString;
          });
          break;

        case 'checkbox':
          if (elements.length === 1) {
            // Single checkbox: treat as boolean
            (elements[0] as HTMLInputElement).checked = !!value;
          } else if (Array.isArray(value)) {
            // Multiple checkboxes: check those whose value is in the array
            const stringValues = value.map(String);
            elements.forEach((el) => {
              const input = el as HTMLInputElement;
              input.checked = stringValues.includes(input.value);
            });
          }
          break;

        case 'file':
          // File inputs cannot be programmatically filled for security reasons
          break;

        default:
          (elements[0] as HTMLInputElement | HTMLSelectElement).value = valString;
          break;
      }
    });
  }

  /**
   * Get all values from a form.
   *
   * @param formName - The data-form attribute value
   * @param options - Parsing options
   * @returns Form values as a record
   */
  static values(formName: string, options: FormParseOptions = {}): FormValues {
    const { parseNumbers = true, parseBooleans = true } = options;

    const form = document.querySelector(Form.formSelector(formName)) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return {};
    }

    const controls = Array.from(form.elements).filter(Form.isNamedControl);
    const data: FormValues = {};

    const keys = Array.from(new Set(controls.map(control => control.name)));
    // Build FormData once so any `formdata` listeners fire a single time.
    const formData = new FormData(form);

    for (const key of keys) {
      const elements = controls.filter(control => control.name === key);
      const element = elements[0] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined;
      const inputType = element?.type;

      // Handle file inputs
      if (inputType === 'file') {
        const fileInputs = elements.filter((control): control is HTMLInputElement => control instanceof HTMLInputElement);
        const files = fileInputs.flatMap(input => Array.from(input.files ?? []));
        if ((element as HTMLInputElement).multiple || files.length > 1) {
          data[key] = files;
        } else {
          data[key] = files[0] || null;
        }
        continue;
      }

      // Handle checkboxes
      if (inputType === 'checkbox') {
        const checkboxes = elements.filter((control): control is HTMLInputElement => control instanceof HTMLInputElement);
        if (checkboxes.length === 1 && parseBooleans) {
          // Single checkbox: return boolean
          data[key] = checkboxes[0].checked;
          continue;
        }
        // Multiple checkboxes: return array of checked values
        data[key] = checkboxes.filter(input => input.checked).map((input) => input.value);
        continue;
      }

      // Handle radio groups
      if (inputType === 'radio') {
        const checked = elements.find((control) => control instanceof HTMLInputElement && control.checked);
        data[key] = checked ? checked.value : '';
        continue;
      }

      const allValues = formData.getAll(key);

      // Handle number inputs
      if (inputType === 'number' && parseNumbers) {
        if (allValues.length > 1) {
          data[key] = allValues.map((v) => parseFloat(String(v)));
        } else {
          data[key] = parseFloat(String(allValues[0]));
        }
        continue;
      }

      // Handle other inputs (text, select, textarea, etc.)
      if (allValues.length > 1) {
        data[key] = allValues.map((v) => Form.parseValue(String(v), parseNumbers));
      } else {
        data[key] = Form.parseValue(String(allValues[0]), parseNumbers);
      }
    }

    return data;
  }

  /**
   * Parse a string value, optionally converting to number.
   *
   * @param value - String value to parse
   * @param parseNumbers - Whether to parse numeric strings
   */
  private static parseValue(value: string, parseNumbers: boolean): string | number {
    if (parseNumbers && value !== '' && !isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  /**
   * Reset a form to its initial state.
   *
   * @param formName - The data-form attribute value
   */
  static reset(formName: string): void {
    const form = document.querySelector(Form.formSelector(formName)) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return;
    }

    form.reset();
  }

  /**
   * Check if a form is valid according to HTML5 validation.
   *
   * @param formName - The data-form attribute value
   */
  static isValid(formName: string): boolean {
    const form = document.querySelector(Form.formSelector(formName)) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return false;
    }

    return form.checkValidity();
  }

  /**
   * Report validity and show browser validation messages.
   *
   * @param formName - The data-form attribute value
   */
  static reportValidity(formName: string): boolean {
    const form = document.querySelector(Form.formSelector(formName)) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return false;
    }

    return form.reportValidity();
  }
}
