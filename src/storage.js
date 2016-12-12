/**
* ==============================
* Storage
* ==============================
*/

class Storage {

	static get(key){
		if(window.localStorage){
			return localStorage.getItem(key);
		}else{
			console.warn("Your browser does not support Local Storage");
		}
	}

	static set(key, value){
		if(window.localStorage){
			localStorage.setItem(key, value);
		}else{
			console.warn("Your browser does not support Local Storage");
		}
	}

	static clear(){
		if(window.localStorage){
			ocalStorage.clear();
		}else{
			console.warn("Your browser does not support Local Storage");
		}
	}
}