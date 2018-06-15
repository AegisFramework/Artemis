/**
* ==============================
* Text
* ==============================
*/

/**
 * Provides utility functions for texts
 * @class
 */
export class Text {

	/**
	 * @static capitalize - Capatalizes every word in a string
	 *
	 * @param  {string} text - Text string to capitalize
	 * @return {string} - Capitalized string
	 */
	static capitalize (text) {
		return text.replace (/\w\S*/g, (txt) => {
			return txt.charAt (0).toUpperCase () + txt.substr (1).toLowerCase ();
		});
	}

	/**
	 * @static suffix - Gets the suffix of a string given a key
	 *
	 * @param  {string} key - Key part of the string
	 * @param  {string} text - Full string to extract the suffix from
	 * @return {string} - Suffix
	 */
	static suffix (key, text) {
		let suffix = '';
		let position = text.indexOf (key);
		if (position !== -1) {
			position += key.length;
			suffix = text.substr (position, text.length - position);
		}
		return suffix;
	}

	/**
	 * @static prefix - Gets the prefix of a string given a key
	 *
	 * @param  {string} key - Key part of the string
	 * @param  {string} text - Full string to extract the prefix from
	 * @return {string} - Prefix
	 */
	static prefix (key, text) {
		let prefix = '';
		const position = text.indexOf (key);
		if (position != -1) {
			prefix = text.substr (0, position);
		}
		return prefix;
	}

	/**
	 * @static friendly - Transforms a given text into a friendly URL string replacing all special characters
	 *
	 * @param  {string} text - The text to build the url from
	 * @return {string} - Friendly URL
	 */
	static friendly (text) {
		const regex = [
			/[áàâãªä]/,
			/[ÁÀÂÃÄ]/,
			/[ÍÌÎÏ]/,
			/[íìîï]/,
			/[éèêë]/,
			/[ÉÈÊË]/,
			/[óòôõºö]/,
			/[ÓÒÔÕÖ]/,
			/[úùûü]/,
			/[ÚÙÛÜ]/,
			/ç/,
			/Ç/,
			/ñ/,
			/Ñ/,
			/_/,
			/[’‘‹›<>']/,
			/[“”«»„"]/,
			/[(){}[\]]/,
			/[?¿!¡#$%&^*´`~/°|]/,
			/[,.:;]/,
			/ /
		];

		const replacements = [
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

		for (const index in regex) {
			text = text.replace(new RegExp(regex[index], 'g'), replacements[index]);
		}

		return text;
	}
}