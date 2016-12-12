/**
* ==============================
* Request
* ==============================
*/

class Request {

	static get(url, data, events, responseType = ""){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = responseType;

		if(typeof events.onload === "function"){
			request.onload = function(){
				events.onload(request);
			}
		}

		if(typeof events.error === "function"){
			request.error = function(){
				events.error(request);
			}
		}

		request.send(data);
	}

	static post(url, data, events, responseType = "", contentType = 'application/x-www-form-urlencoded'){
		var request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.responseType = responseType;
		if(typeof events.onload === "function"){
			request.onload = function(){
				events.onload(request);
			}
		}

		if(typeof events.error === "function"){
			request.error = function(){
				events.error(request);
			}
		}

		request.setRequestHeader('Content-Type', `${contentType}; charset=UTF-8`);
		request.send(data);
	}

	static json(url, events){
		var request = new XMLHttpRequest();

		request.responseType = "json";

		if(typeof events.onload === "function"){
			request.onload = function(){
				events.onload(request);
			}
		}

		if(typeof events.error === "function"){
			request.error = function(){
				events.error(request);
			}
		}

		request.open('GET', url, true);
		request.send();
	}

}