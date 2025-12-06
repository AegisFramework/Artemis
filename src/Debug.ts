/**
 * ==============================
 * Debug
 * ==============================
 */


/**
 * Debug level enum
 */
export enum DebugLevel {
	NONE = 0,
	ERROR = 1,
	WARNING = 2,
	INFO = 3,
	DEBUG = 4,
	ALL = 5
}

/**
 * This class acts as a proxy for the console. It shares the same methods as the
 * web console but they are conditioned to a debug level.
 */
export class Debug {
	private static _level: DebugLevel = DebugLevel.NONE;

	/**
	 * Set or get the log level
	 *
	 * @param level - The debug level to use
	 * @returns The current debug level
	 */
	static level(level?: DebugLevel): DebugLevel {
		if (typeof level === 'number') {
			this._level = level;
		}
		return this._level;
	}

	/**
	 * Log the given elements.
	 * Logs will only be made if the level is set to DEBUG or above
	 *
	 * @param args - Arguments to log
	 */
	static log(...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.log(...args);
		}
	}

	/**
	 * Show a debugging log
	 * Logs will only be made if the level is set DEBUG or above
	 *
	 * @param args - Arguments to log
	 */
	static debug(...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.debug(...args);
		}
	}

	/**
	 * Show an info log
	 * Logs will only be made if the level is set to INFO or above
	 *
	 * @param args - Arguments to log
	 */
	static info(...args: unknown[]): void {
		if (this.level() >= DebugLevel.INFO) {
			console.info(...args);
		}
	}

	/**
	 * Show an error log
	 * Logs will only be made if the level is set to ERROR or above
	 *
	 * @param args - Arguments to log
	 */
	static error(...args: unknown[]): void {
		if (this.level() >= DebugLevel.ERROR) {
			console.error(...args);
		}
	}

	/**
	 * Show a warning log
	 * Logs will only be made if the level is set to WARNING or above
	 *
	 * @param args - Arguments to log
	 */
	static warning(...args: unknown[]): void {
		if (this.level() >= DebugLevel.WARNING) {
			console.warn(...args);
		}
	}

	/**
	 * Show data as a table
	 * Table will only be made if the level is set to DEBUG or above
	 *
	 * @param args - Arguments to display as table
	 */
	static table(...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.table(...args);
		}
	}

	/**
	 * Start an indented group
	 *
	 * @param args - Group label arguments
	 */
	static group(...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.group(...args);
		}
	}

	/**
	 * Start an indented group collapsed by default
	 *
	 * @param args - Group label arguments
	 */
	static groupCollapsed(...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.groupCollapsed(...args);
		}
	}

	/**
	 * End a previously started group
	 */
	static groupEnd(): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.groupEnd();
		}
	}

	/**
	 * Start a timer
	 * The timer will only start if the level is set to DEBUG or above
	 *
	 * @param label - Timer label
	 */
	static time(label?: string): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.time(label);
		}
	}

	/**
	 * Log the time a timer has been running for
	 * The time will only be logged if the level is set to DEBUG or above
	 *
	 * @param label - Timer label
	 * @param args - Additional arguments to log
	 */
	static timeLog(label?: string, ...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.timeLog(label, ...args);
		}
	}

	/**
	 * End a timer
	 * The timer will only be available if the level is set to DEBUG or above
	 *
	 * @param label - Timer label
	 */
	static timeEnd(label?: string): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.timeEnd(label);
		}
	}

	/**
	 * Show the stack trace
	 * The stack trace will only be available if the level is set to DEBUG or above
	 *
	 * @param args - Arguments to log with trace
	 */
	static trace(...args: unknown[]): void {
		if (this.level() >= DebugLevel.DEBUG) {
			console.trace(...args);
		}
	}
}

