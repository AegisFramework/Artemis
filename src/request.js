/**
* ==============================
* Request
* ==============================
*/

/* exported Request */

class Request {

	static get (url, data, responseType = "") {
		return new Promise(function (resolve, reject) {
			var encodedData = [];
			for (var value in data) {
				encodedData.push(encodeURIComponent(value) + "=" + encodeURIComponent(data[value]));
			}
			var request = new XMLHttpRequest();
			if (encodedData.length > 0) {
				url = url + "?" + encodedData.join("&");
			}
			request.open("GET", url, true);
			request.responseType = responseType;

			request.onload = function () {
				resolve(request.response);
			};

			request.onerror = function () {
				reject(request);
			};

			request.send();
		});
	}

	static post (url, data, responseType = "", contentType = "application/x-www-form-urlencoded") {
		return new Promise(function (resolve, reject) {
			var encodedData = [];
			for (var value in data) {
				encodedData.push(encodeURIComponent(value) + "=" + encodeURIComponent(data[value]));
			}
			var request = new XMLHttpRequest();
			request.open("POST", url, true);
			request.responseType = responseType;
			request.onload = function () {
				resolve(request.response);
			};

			request.onerror = function () {
				reject(request);
			};

			request.setRequestHeader("Content-Type", `${contentType}; charset=UTF-8`);
			request.send(encodedData.join("&"));
		});
	}

	static json (url) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();

			request.responseType = "json";
			request.onload = function () {
				resolve(request.response);
			};

			request.onerror = function () {
				reject(request);
			};

			request.open("GET", url, true);
			request.send();
		});
	}
}