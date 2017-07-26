/**
* ==============================
* Text
* ==============================
*/

/* exported Text */

class Text {

	static capitalize (text) {
		return text.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	static getSuffix (text, key) {
		var suffix = "";
		var position = text.indexOf(key);
		if (position != -1) {
			position += key.length;
			suffix = text.substr(position, text.length - position);
		}
		return suffix;
	}

	static getPrefix (text, key) {
		var prefix = "";
		var position = text.indexOf(key);
		if (position != -1) {
			prefix = text.substr(0, position);
		}
		return prefix;
	}

	static getSelection () {
		return window.getSelection().toString();
	}

	static buildText (array, wrapper) {
		var result = "";
		if (array[0]) {
			for (const i in array) {
				result += Text.buildText(array[i], wrapper);
			}
			return result;
		} else {
			var string = wrapper;
			for (const i in array) {
				string = string.replace(new RegExp("@" + i, "g"), array[i]);
			}
			return string;
		}
	}

	static removeSpecialCharacters (text) {
		var special = Array("#", ":", "ñ", "í", "ó", "ú", "á", "é", "Í", "Ó", "Ú", "Á", "É", "\(", "\)", "¡", "¿", "\/");
		var common   = Array("", "", "n", "i", "o", "u", "a", "e", "I", "O", "U", "A", "E", "", "", "", "", "");
		for (const character in special) {
			text = text.replace(new RegExp(special[character], "g"), common[character]);
		}
		return text;
	}

	static removePunctuation (text) {
		var special = new Array(";", "," ,".", ":");
		for (const character in special) {
			text = text.replace(new RegExp(special[character], "g"), "");
		}
		return text;
	}

	static toFriendlyUrl (text) {
		var expressions = {
			"[áàâãªä]"   :   "a",
			"[ÁÀÂÃÄ]"    :   "A",
			"[ÍÌÎÏ]"     :   "I",
			"[íìîï]"     :   "i",
			"[éèêë]"     :   "e",
			"[ÉÈÊË]"     :   "E",
			"[óòôõºö]"   :   "o",
			"[ÓÒÔÕÖ]"    :   "O",
			"[úùûü]"     :   "u",
			"[ÚÙÛÜ]"     :   "U",
			"ç"          :   "c",
			"Ç"          :   "C",
			"ñ"          :   "n",
			"Ñ"          :   "N",
			"_"          :   "-",
			"[’‘‹›<>\']" :   "",
			"[“”«»„\"]"  :   "",
			"[\(\)\{\}\[\]]" : "",
			"[?¿!¡#$%&^*´`~\/°\|]" : "",
			"[,.:;]"     : "",
			" "         :   "-"
		};

		for (const regex in expressions) {
			text = text.replace(new RegExp(regex, "g"), expressions[regex]);
		}

		return text;
	}

	static toUrl (text) {
		return encodeURI(text);
	}

}