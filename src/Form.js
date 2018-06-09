/**
* ==============================
* Form
* ==============================
*/

import { $_ } from './Artemis';

/**
 * Utility class that provides simple function for filling and retrieving values
 * from froms. This class requires the use of the `data-form` attribute.
 *
 * @class
 */
export class Form {

	/**
	 * @static fill - Fill a form's inputs with the given values. Each key in the
	 * provided object must match the `name` attribute of the input to fill.
	 *
	 * @param  {string} name - Form name. Must match the `data-form` attribute of the Form.
	 * @param  {Object} data - JSON object with key-value pairs to fill the inputs.
	 */
	static fill (name, data) {
		for (const field in data) {
			const element = $_(`form[data-form='${name}'] [name='${field}']`).get (0);
			if (typeof element != 'undefined') {
				switch (element.type) {

					case 'file':
					case 'file[]':
						break;

					default:
						element.value = data[field];
						break;
				}
			}

		}
	}

	/**
	 * @static values - Get all the values from a form's input. The keys are mapped
	 * using the `name` attribute of each input.
	 *
	 * @param  {string} name - Form name. Must match the `data-form` attribute of the Form.
	 * @return {Object} - Key-value JSON object
	 */
	static values (name) {
		const data = {};
		$_(`form[data-form='${name}'] [name]`).each ((element) => {
			let value;
			switch (element.type) {
				case 'file[]':
					value = element.files;
					break;
				case 'file':
					value = element.files[0];
					break;
				default:
					value = element.value;
					break;
			}

			if (typeof value != 'undefined' && value !== null) {
				data[element.name] = value;
			}
		});

		return data;
	}
}