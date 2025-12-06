/**
 * ==============================
 * Preload
 * ==============================
 */

import { Request } from './Request';

/**
 * A simple class for asset preloading. This class assumes you have a service
 * worker set up that will be caching all requests.
 */
export class Preload {
	/**
	 * Preload an image file
	 *
	 * @param route - Route to the image
	 * @returns Resolves to the image object or gets rejected with the rejection event
	 */
	static image(route: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();

			image.onload = () => {
				resolve(image);
			};

			image.onerror = (e) => {
				reject(e);
			};

			image.src = route;
		});
	}

	/**
	 * Preload any kind of file
	 *
	 * @param route - Route to the file
	 * @returns Resolves or rejects depending on request success
	 */
	static file(route: string): Promise<Blob> {
		return Request.blob(route);
	}
}

