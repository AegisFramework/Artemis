/**
* ==============================
* Request
* ==============================
*/

export class Request {

	static get (url, data, responseType = '') {
		return new Promise(function (resolve, reject) {
			const encodedData = [];
			for (const value in data) {
				encodedData.push(encodeURIComponent(value) + '=' + encodeURIComponent(data[value]));
			}
			const request = new XMLHttpRequest();
			if (encodedData.length > 0) {
				url = url + '?' + encodedData.join('&');
			}
			request.open('GET', url, true);
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

	static post (url, data, responseType = '', contentType = 'application/x-www-form-urlencoded') {
		return new Promise(function (resolve, reject) {
			let formData;
			const request = new XMLHttpRequest();
			request.open('POST', url, true);
			if (contentType == 'application/x-www-form-urlencoded') {
				formData = [];
				for (const value in data) {
					formData.push (encodeURIComponent(value) + '=' + encodeURIComponent(data[value]));
				}
				formData = formData.join('&');
				request.setRequestHeader('Content-type', contentType);
			} else if (contentType == 'multipart/form-data') {
				formData = new FormData ();
				for (const value in data) {
					formData.append (value, data[value]);
				}
			}

			request.responseType = responseType;
			request.onload = function () {
				resolve(request.response);
			};

			request.onerror = function () {
				reject(request);
			};

			request.send(formData);
		});
	}

	static json (url) {
		return new Promise(function (resolve, reject) {
			const request = new XMLHttpRequest();

			request.responseType = 'json';
			request.onload = function () {
				resolve(request.response);
			};

			request.onerror = function () {
				reject(request);
			};

			request.open('GET', url, true);
			request.send();
		});
	}
}