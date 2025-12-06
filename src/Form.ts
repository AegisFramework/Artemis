/**
 * ==============================
 * Form
 * ==============================
 */

import { $_ } from './DOM';

/**
 * Form data object type
 */
export type FormData = Record<string, string | File | FileList | undefined>;

/**
 * Utility class that provides simple functions for filling and retrieving values
 * from forms. This class requires the use of the `data-form` attribute.
 */
export class Form {
	/**
	 * Fill a form's inputs with the given values. Each key in the provided object
	 * must match the `name` attribute of the input to fill.
	 *
	 * @param name - Form name. Must match the `data-form` attribute of the Form.
	 * @param data - JSON object with key-value pairs to fill the inputs.
	 */
	static fill(name: string, data: Record<string, string>): void {
		for (const field in data) {
			const element = $_(`form[data-form='${name}'] [name='${field}']`).get(0) as HTMLInputElement | undefined;
			if (typeof element !== 'undefined') {
				switch (element.type) {
					case 'file':
					case 'file[]':
						// Cannot programmatically set file input values
						break;

					default:
						element.value = data[field];
						break;
				}
			}
		}
	}

	/**
	 * Get all the values from a form's inputs. The keys are mapped using the
	 * `name` attribute of each input.
	 *
	 * @param name - Form name. Must match the `data-form` attribute of the Form.
	 * @returns Key-value JSON object
	 */
	static values(name: string): FormData {
		const data: FormData = {};
		$_(`form[data-form='${name}'] [name]`).each((el: Element) => {
			const element = el as HTMLInputElement;
			let value: string | File | FileList | undefined;
			switch (element.type) {
				case 'file[]':
					value = element.files ?? undefined;
					break;
				case 'file':
					value = element.files?.[0];
					break;
				default:
					value = element.value;
					break;
			}

			if (typeof value !== 'undefined' && value !== null) {
				data[element.name] = value;
			}
		});

		return data;
	}
}

