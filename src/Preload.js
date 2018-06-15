import { Request } from './Request';

/**
 * A simple class for asset preloading. This class assumes you have a service
 * worker set up that will be caching all requests.
 * @class
 */
export class Preload {

	/**
	 * @static image - Preload an image file
	 *
	 * @param  {string} route - Route to the image
	 * @return {Promise} - Resolves to the image object or gets rejected with
	 * the rejection event
	 */
	static image (route) {
		return new Promise((resolve, reject) => {
			const image = new Image ();

			image.onload = () => {
				resolve (image);
			};

			image.onerror = (e) => {
				reject (e);
			};

			image.src = route;
		});
	}

	/**
	 * @static audio - Preload an audio file
	 *
	 * @param  {string} route - Route to the audio file
	 * @return {Promise} - Resolves or rejects depending on request success
	 */
	static audio (route) {
		return Request.get (route, null, 'blob');
	}
}