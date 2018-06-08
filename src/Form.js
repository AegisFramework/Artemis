/**
* ==============================
* Form
* ==============================
*/

import { $_ } from './Artemis';

export class Form {

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