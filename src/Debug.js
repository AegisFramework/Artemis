/**
 * ==============================
 * Debug
 * ==============================
 */

/* eslint no-console: "off" */

/**
 * List of Log Levels available.
 */
export const DebugLevel = {
	NONE: 0,
	ERROR: 1,
	WARNING: 2,
	INFO: 3,
	DEBUG: 4,
	ALL: 5
};

/**
 * This class acts as a proxy for the console. It shares the same methods as the
 * web console but they are conditioned to a debug level.
 *
 * @class
 */
export class Debug {

	/**
	 * @static level - Set the log level
	 *
	 * @param {DebugLevel} level The debug level to use
	 *
	 * @return {void}
	 */
	static level (level) {
		if (typeof level === 'number') {
			this._level = level;
		}
		return this._level;
	}

	/**
	 * @static log - Log the given elements.
	 *
	 * Logs will only be made if the level is set to DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static log (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.log (...args);
		}
	}

	/**
	 * @static debug - Show a debugging log
	 *
	 * Logs will only be made if the level is set DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static debug (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.debug (...args);
		}
	}

	/**
	 * @static info - Show an info log
	 *
	 * Logs will only be made if the level is set to INFO or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static info (...args) {
		if (this.level () >= DebugLevel.INFO) {
			console.info (...args);
		}
	}

	/**
	 * @static error - Show an error log
	 *
	 * Logs will only be made if the level is set to ERROR or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static error (...args) {
		if (this.level () >= DebugLevel.ERROR) {
			console.error (...args);
		}
	}

	/**
	 * @static warning - Show an warning log
	 *
	 * Logs will only be made if the level is set to WARNING or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static warning (...args) {
		if (this.level () >= DebugLevel.WARNING) {
			console.warn (...args);
		}
	}

	/**
	 * @static table - Show data as a table
	 *
	 * Table will only be made if the level is set to DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static table (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.table (...args);
		}
	}

	/**
	 * @static group - Start an indented group
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static group (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.group (...args);
		}
	}

	/**
	 * @static groupCollapsed - Start an indented group collapsed by default
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static groupCollapsed (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.groupCollapsed (...args);
		}
	}

	/**
	 * @static groupEnd - End a previously started group
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static groupEnd (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.groupEnd (...args);
		}
	}

	/**
	 * @static time - Start a timer
	 *
	 * The timer will only start if the level is set to DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static time (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.time (...args);
		}
	}

	/**
	 * @static timeLog - Log the time a timer has been running for
	 *
	 * The time will only be logged if the level is set to DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static timeLog (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.timeLog (...args);
		}
	}

	/**
	 * @static timeEnd - End a timer
	 *
	 * The timer will only be available if the level is set to DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static timeEnd (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.timeEnd (...args);
		}
	}

	/**
	 * @static trace - Show the stack trace
	 *
	 * The stack trace will only be available if the level is set to DEBUG or above
	 *
	 * @param  {...any} args
	 *
	 * @return {void}
	 */
	static trace (...args) {
		if (this.level () >= DebugLevel.DEBUG) {
			console.trace (...args);
		}
	}
}

Debug._level = DebugLevel.NONE;