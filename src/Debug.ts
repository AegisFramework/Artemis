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
	 * Get the current debug level
	 */
	static get currentLevel(): DebugLevel {
		return this._level;
	}

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
	 * Set the debug level
	 *
	 * @param level - The debug level to set
	 */
	static setLevel(level: DebugLevel): void {
		this._level = level;
	}

	/**
	 * Check if a specific level is enabled
	 *
	 * @param level - The level to check
	 */
	static isEnabled(level: DebugLevel): boolean {
		return this._level >= level;
	}

	/**
	 * Log the given elements.
	 * Logs will only be made if the level is set to DEBUG or above
	 *
	 * @param args - Arguments to log
	 */
	static log(...args: unknown[]): void {
		if (this._level >= DebugLevel.DEBUG) {
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
		if (this._level >= DebugLevel.DEBUG) {
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
		if (this._level >= DebugLevel.INFO) {
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
		if (this._level >= DebugLevel.ERROR) {
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
		if (this._level >= DebugLevel.WARNING) {
			console.warn(...args);
		}
	}

	/**
	 * Alias for warning()
	 *
	 * @param args - Arguments to log
	 */
	static warn(...args: unknown[]): void {
		this.warning(...args);
	}

	/**
	 * Show data as a table
	 * Table will only be made if the level is set to DEBUG or above
	 *
	 * @param data - Data to display as table
	 * @param columns - Optional column names to include
	 */
	static table(data: unknown, columns?: string[]): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.table(data, columns);
		}
	}

	/**
	 * Start an indented group
	 *
	 * @param args - Group label arguments
	 */
	static group(...args: unknown[]): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.group(...args);
		}
	}

	/**
	 * Start an indented group collapsed by default
	 *
	 * @param args - Group label arguments
	 */
	static groupCollapsed(...args: unknown[]): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.groupCollapsed(...args);
		}
	}

	/**
	 * End a previously started group
	 */
	static groupEnd(): void {
		if (this._level >= DebugLevel.DEBUG) {
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
		if (this._level >= DebugLevel.DEBUG) {
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
		if (this._level >= DebugLevel.DEBUG) {
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
		if (this._level >= DebugLevel.DEBUG) {
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
		if (this._level >= DebugLevel.DEBUG) {
			console.trace(...args);
		}
	}

	/**
	 * Log a message if a condition is false
	 * Only logs if the level is set to ERROR or above
	 *
	 * @param condition - Condition to check
	 * @param args - Arguments to log if condition is false
	 */
	static assert(condition: boolean, ...args: unknown[]): void {
		if (this._level >= DebugLevel.ERROR) {
			console.assert(condition, ...args);
		}
	}

	/**
	 * Clear the console
	 * Only clears if the level is set to DEBUG or above
	 */
	static clear(): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.clear();
		}
	}

	/**
	 * Increment a counter with the given label
	 * Only counts if the level is set to DEBUG or above
	 *
	 * @param label - Counter label
	 */
	static count(label?: string): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.count(label);
		}
	}

	/**
	 * Reset a counter with the given label
	 * Only resets if the level is set to DEBUG or above
	 *
	 * @param label - Counter label
	 */
	static countReset(label?: string): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.countReset(label);
		}
	}

	/**
	 * Display an interactive listing of the properties of an object
	 * Only displays if the level is set to DEBUG or above
	 *
	 * @param data - Object to display
	 */
	static dir(data: unknown): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.dir(data);
		}
	}

	/**
	 * Display XML/HTML element representation
	 * Only displays if the level is set to DEBUG or above
	 *
	 * @param data - Element to display
	 */
	static dirxml(data: unknown): void {
		if (this._level >= DebugLevel.DEBUG) {
			console.dirxml(data);
		}
	}

	/**
	 * Create a formatted string with substitution values
	 *
	 * @param format - Format string
	 * @param args - Substitution values
	 */
	static format(format: string, ...args: unknown[]): string {
		let result = format;
		let argIndex = 0;

		result = result.replace(/%[sdioOcj%]/g, (match) => {
			if (match === '%%') return '%';
			if (argIndex >= args.length) return match;

			const arg = args[argIndex++];

			switch (match) {
				case '%s': return String(arg);
				case '%d':
				case '%i': return String(parseInt(String(arg), 10));
				case '%o':
				case '%O': return JSON.stringify(arg);
				case '%c': return ''; // CSS styling not supported in string format
				case '%j': return JSON.stringify(arg);
				default: return match;
			}
		});

		return result;
	}
}
