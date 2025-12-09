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
  parseNumbers?: boolean; // Whether to parse numeric strings as numbers
  parseBooleans?: boolean; // Whether to parse checkbox values as booleans for single checkboxes
}

export class Form {

  /**
   * Fill a form with data.
   *
   * @param formName - The data-form attribute value
   * @param data - Key-value pairs to fill
   */
  static fill(formName: string, data: Record<string, unknown>): void {
    const form = document.querySelector(`form[data-form='${formName}']`) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return;
    }

    Object.entries(data).forEach(([name, value]) => {
      const elements = form.querySelectorAll(`[name='${name}']`);

      if (elements.length === 0) return;

      const firstElement = elements[0] as HTMLInputElement;
      const type = firstElement.type;
      const valString = String(value);

      switch (type) {
        case 'radio':
          elements.forEach((el) => {
            const input = el as HTMLInputElement;
            if (input.value === valString) {
              input.checked = true;
            }
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

    const form = document.querySelector(`form[data-form='${formName}']`) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return {};
    }

    const formData = new FormData(form);
    const data: FormValues = {};

    const keys = Array.from(new Set(formData.keys()));

    for (const key of keys) {
      const allValues = formData.getAll(key);
      const element = form.querySelector(`[name='${key}']`) as HTMLInputElement | null;
      const inputType = element?.type;

      // Handle file inputs
      if (inputType === 'file') {
        const files = allValues.filter((v): v is File => v instanceof File);
        if (element?.multiple || files.length > 1) {
          data[key] = files;
        } else {
          data[key] = files[0] || null;
        }
        continue;
      }

      // Handle checkboxes
      if (inputType === 'checkbox') {
        const checkboxes = form.querySelectorAll(`[name='${key}']`);
        if (checkboxes.length === 1 && parseBooleans) {
          // Single checkbox: return boolean
          data[key] = (checkboxes[0] as HTMLInputElement).checked;
          continue;
        }
        // Multiple checkboxes: return array of checked values
        data[key] = allValues.map((v) => Form.parseValue(String(v), parseNumbers));
        continue;
      }

      // Handle number inputs
      if (inputType === 'number' && parseNumbers) {
        if (allValues.length > 1) {
          data[key] = allValues.map((v) => parseFloat(String(v)));
        } else {
          data[key] = parseFloat(String(allValues[0]));
        }
        continue;
      }

      // Handle other inputs
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
    const form = document.querySelector(`form[data-form='${formName}']`) as HTMLFormElement;

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
    const form = document.querySelector(`form[data-form='${formName}']`) as HTMLFormElement;

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
    const form = document.querySelector(`form[data-form='${formName}']`) as HTMLFormElement;

    if (!form) {
      console.warn(`Form [data-form='${formName}'] not found.`);
      return false;
    }

    return form.reportValidity();
  }
}
