/**
 * ==============================
 * Text
 * ==============================
 */

/**
 * Provides utility functions for texts
 */
export class Text {
	/**
	 * Capitalizes every word in a string
	 *
	 * @param text - Text string to capitalize
	 * @returns Capitalized string
	 */
	static capitalize(text: string): string {
		return text.replace(/\w\S*/g, (txt) => {
			return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
		});
	}

	/**
	 * Gets the suffix of a string given a key
	 *
	 * @param key - Key part of the string
	 * @param text - Full string to extract the suffix from
	 * @returns Suffix
	 */
	static suffix(key: string, text: string): string {
		let suffix = '';
		let position = text.indexOf(key);
		if (position !== -1) {
			position += key.length;
			suffix = text.substring(position);
		}
		return suffix;
	}

	/**
	 * Get the currently selected text
	 *
	 * @returns Text selection
	 */
	static selection(): string {
		const selection = window.getSelection();
		if (selection) {
			return selection.toString();
		}
		return '';
	}

	/**
	 * Gets the prefix of a string given a key
	 *
	 * @param key - Key part of the string
	 * @param text - Full string to extract the prefix from
	 * @returns Prefix
	 */
	static prefix(key: string, text: string): string {
		let prefix = '';
		const position = text.indexOf(key);
		if (position !== -1) {
			prefix = text.substring(0, position);
		}
		return prefix;
	}

	/**
	 * Transforms a given text into a friendly URL string replacing all special characters
	 *
	 * @param text - The text to build the url from
	 * @returns Friendly URL
	 */
	static friendly(text: string): string {
		const regex: RegExp[] = [
			/[áàâãªä]/g,
			/[ÁÀÂÃÄ]/g,
			/[ÍÌÎÏ]/g,
			/[íìîï]/g,
			/[éèêë]/g,
			/[ÉÈÊË]/g,
			/[óòôõºö]/g,
			/[ÓÒÔÕÖ]/g,
			/[úùûü]/g,
			/[ÚÙÛÜ]/g,
			/ç/g,
			/Ç/g,
			/ñ/g,
			/Ñ/g,
			/_/g,
			/[''‹›<>']/g,
			/[""«»„"]/g,
			/[(){}[\]]/g,
			/[?¿!¡#$%&^*´`~/°|]/g,
			/[,.:;]/g,
			/ /g
		];

		const replacements: string[] = [
			'a',
			'A',
			'I',
			'i',
			'e',
			'E',
			'o',
			'O',
			'u',
			'U',
			'c',
			'C',
			'n',
			'N',
			'-',
			'',
			'',
			'',
			'',
			'',
			'-'
		];

		let result = text;
		for (let i = 0; i < regex.length; i++) {
			result = result.replace(regex[i], replacements[i]);
		}

		return result;
	}
}

