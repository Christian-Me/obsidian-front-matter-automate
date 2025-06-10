/**
 * Logging utilities and logger class for Frontmatter Automate.
 * 
 * Provides log levels, colored console output, and integration with Obsidian Notices.
 * Supports grouping, error reporting, and log level filtering.
 */

import { Notice } from "obsidian";
import { ErrorManager } from "./Error";

/**
 * Numeric log levels for easy comparison and usage.
 * 
 * LOG:     0 - Always logs (base level)
 * ALERT:   1 - Critical alerts, always shown
 * ERROR:   2 - Errors, shown in console and as notices
 * WARNING: 3 - Warnings, shown in console and as notices
 * INFO:    4 - Informational messages
 * DEBUG:   5 - Debugging messages
 * TRACE:   6 - Trace-level (very verbose)
 */
export const LOG = 0;
export const ALERT = 1;
export const ERROR = 2;
export const WARNING = 3;
export const INFO = 4;
export const DEBUG = 5;
export const TRACE = 6;

/**
 * Type for allowed log levels.
 */
export type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Enum for log output devices.
 */
export enum LogDevices {
    CONSOLE = "console",
    NOTIFICATION = "notification",
}

/**
 * Show a persistent update notice in Obsidian.
 * @param msg The message to display.
 */
export function logUpdate(msg: string): void {
    const notice = new Notice("", 15000);
    notice.messageEl.innerHTML = `<b>Frontmatter Automate update</b>:<br/>${msg}`;
}

/**
 * Show an error notice in Obsidian and log to console if ErrorManager.
 * @param e The error to display.
 */
export function logError(e: Error | ErrorManager): void {
    const notice = new Notice("", 8000);
    if (e instanceof ErrorManager && e.console_msg) {
        notice.messageEl.innerHTML = `<b>Frontmatter Automate Error</b>:<br/>${e.message}<br/>Check console for more information`;
        console.error(`Frontmatter Error:`, e.message, "\n", e.console_msg);
    } else {
        notice.messageEl.innerHTML = `<b>Frontmatter Automate Error</b>:<br/>${e.message}`;
    }
}

/**
 * Logger class for Frontmatter Automate.
 * 
 * Supports log levels, colored output, grouping, and Obsidian notices.
 */
export class Logger {
    private logLevel: LogLevel = INFO;

    /**
     * Set the log level by name or number.
     * @param level Log level as string or number.
     */
    setLevel(level: string | number) {
        if (typeof level === "number") {
            this.logLevel = level as LogLevel;
            this.log(LOG, `Log level set to ${this.getLevelName(this.logLevel)}`);
        } else {
            const levelName = level.toUpperCase();
            const levelIndex = this.getLevelNames().indexOf(levelName) + 1 as LogLevel;
            if (levelIndex >= 0) {
                this.setLevel(levelIndex);
            } else {
                this.log(WARNING,`Invalid log level name: ${levelName}`);
            }
        }
    }

    /**
     * Get the current log level.
     * @returns The current log level.
     */
    getLevel(): LogLevel {
        return this.logLevel;
    }

    /**
     * Get log level by name.
     * @param levelName The name of the log level.
     * @returns The corresponding LogLevel.
     */
    getLevelByName(levelName: string): LogLevel {
        const levelIndex = this.getLevelNames().indexOf(levelName.toUpperCase()) + 1;
        if (levelIndex >= 0) {
            return levelIndex as LogLevel;
        } else {
            this.log(WARNING,`Invalid log level name: ${levelName}`);
            return INFO; // Default to INFO if invalid
        }
    }

    /**
     * Get log level by index.
     * @param levelIndex The index of the log level.
     * @returns The corresponding LogLevel.
     */
    getLevelByIndex(levelIndex: number): LogLevel {
        if (levelIndex >= ALERT && levelIndex <= TRACE) {
            return levelIndex as LogLevel;
        } else {
            this.log(WARNING,`Invalid log level index: ${levelIndex}`);
            return INFO; // Default to INFO if invalid
        }
    }

    /**
     * Get log level by value.
     * @param levelValue The value of the log level.
     * @returns The corresponding LogLevel.
     */
    getLevelByValue(levelValue: number): LogLevel {
        if (levelValue >= ALERT && levelValue <= TRACE) {
            return levelValue as LogLevel;
        } else {
            this.log(WARNING,`Invalid log level value: ${levelValue}`);
            return INFO; // Default to INFO if invalid
        }
    }

    /**
     * Determine if a message should be logged at the given level.
     * @param level The log level.
     * @returns True if the message should be logged.
     */
    private shouldLog(level: LogLevel): boolean {
        if (level === 0) return true; // Always log level 0
        return level <= this.logLevel;
    }

    /**
     * Get the name of a log level.
     * @param level The log level.
     * @returns The name of the log level.
     */
    getLevelName(level: LogLevel): string {
        switch (level) {
            case ALERT: return "ALERT";
            case ERROR: return "ERROR";
            case WARNING: return "WARNING";
            case INFO: return "INFO";
            case DEBUG: return "DEBUG";
            case TRACE: return "TRACE";
            default: return "LOG";
        }
    }

    /**
     * Get all log level names as an array.
     * @returns Array of log level names.
     */
    getLevelNames(): string[] {
        return ([ALERT, ERROR, WARNING, INFO, DEBUG, TRACE] as LogLevel[]).map(level => this.getLevelName(level));
    }
    
    /**
     * Log a message at a specific log level.
     * Outputs to the console with color and grouping, and shows a notice for ALERT/ERROR.
     * @param level The log level.
     * @param msg The message(s) to log.
     */
    log(level: LogLevel, ...msg: any[]): void {
        if (!this.shouldLog(level)) return;

        const levelName = this.getLevelName(level);
        let color = "";
        switch (level) {
            case ALERT:   color = "background: #d32f2f; color: white; font-weight: bold"; break;
            case ERROR:   color = "color: #d32f2f; font-weight: bold"; break;
            case WARNING: color = "color: #fbc02d; font-weight: bold"; break;
            case INFO:    color = "color: #1976d2; font-weight: bold"; break;
            case DEBUG:   color = "color: #388e3c;"; break;
            case TRACE:   color = "color: #616161;"; break;
            default:      color = ""; break;
        }
        const prefix = `%c[${levelName}]`;

        // Get the caller line (stack line 2)
        const err = new Error();
        let caller = "";
        if (err.stack) {
            const stackLines = err.stack.split("\n");
            if (stackLines.length >= 3) {
                caller = stackLines[2].trim(); // 0:Error, 1:this function, 2:caller
            }
        }

        // Only style the prefix, not the caller
        switch (level) {
            case ALERT:
            case ERROR:
                console.groupCollapsed(prefix, color, ...msg);
                console.log("Caller Stack:", err);
                console.groupEnd();
                break;
            case WARNING:
                console.groupCollapsed(prefix, color, ...msg);
                console.log("Caller Stack:", err);
                console.groupEnd();
                break;
            case INFO:
                console.info(prefix, color, ...msg);
                break;
            case DEBUG:
            case TRACE:
            default:
                console.groupCollapsed(prefix, color, ...msg);
                console.log("Caller Stack:", err);
                console.groupEnd();
                break;
        }
        if (level === ALERT || level === ERROR) {
            new Notice(`<b>Frontmatter Automate ${levelName}</b>:<br/>${msg.join(" ")}`, 8000);
        }
    }

    /**
     * Logs one or more messages with an alert level.
     * @param msg The messages or objects to log as an alert.
     */
    alert(...msg: any[]): void {
        this.log(ALERT, ...msg);
    }

    /**
     * Logs one or more messages with an error level.
     * @param msg The messages or objects to log as an error.
     */
    error(...msg: any[]): void {
        this.log(ERROR, ...msg);
    }

    /**
     * Logs one or more messages with a warning level.
     * @param msg The messages or objects to log as a warning.
     */
    warning(...msg: any[]): void {
        this.log(WARNING, ...msg);
    }

    /**
     * Logs one or more messages with an info level.
     * @param msg The messages or objects to log as info.
     */
    info(...msg: any[]): void {
        this.log(INFO, ...msg);
    }

    /**
     * Logs one or more messages with a debug level.
     * @param msg The messages or objects to log as debug.
     */
    debug(...msg: any[]): void {
        this.log(DEBUG, ...msg);
    }

    /**
     * Logs one or more messages with a trace level.
     * @param msg The messages or objects to log as trace.
     */
    trace(...msg: any[]): void {
        this.log(TRACE, ...msg);
    }

    /**
     * Starts a collapsed console group at the given log level.
     * @param level The log level.
     * @param msg The message(s) for the group.
     */
    groupCollapsed(level: LogLevel, ...msg: any[]): void {
        if (!this.shouldLog(level)) return;
        const levelName = this.getLevelName(level);
        let color = "";
        switch (level) {
            case ALERT:   color = "background: #d32f2f; color: white; font-weight: bold"; break;
            case ERROR:   color = "color: #d32f2f; font-weight: bold"; break;
            case WARNING: color = "color: #fbc02d; font-weight: bold"; break;
            case INFO:    color = "color: #1976d2; font-weight: bold"; break;
            case DEBUG:   color = "color: #388e3c;"; break;
            case TRACE:   color = "color: #616161;"; break;
            default:      color = ""; break;
        }
        const prefix = `%c[${levelName}]`;
        console.groupCollapsed(prefix, color, ...msg);
    }

    /**
     * Ends the current console group.
     */
    groupEnd(): void {
        console.groupEnd();
    }

    /**
     * Show a persistent update notice in Obsidian.
     * @param msg The message to display.
     */
    logUpdate(msg: string): void {
        new Notice(`<b>Frontmatter Automate update</b>:<br/>${msg}`, 15000);
    }

    /**
     * Show an error notice in Obsidian and log to console if ErrorManager.
     * @param e The error to display.
     */
    logError(e: Error | ErrorManager): void {
        const notice = new Notice("", 8000);
        if (e instanceof ErrorManager && e.console_msg) {
            notice.messageEl.innerHTML = `<b>Frontmatter Automate Error</b>:<br/>${e.message}<br/>Check console for more information`;
            logger.log(ERROR,`Frontmatter Error:`, e.message, "\n", e.console_msg);
        } else {
            notice.messageEl.innerHTML = `<b>Frontmatter Automate Error</b>:<br/>${e.message}`;
        }
    }
}

/**
 * Singleton logger instance for use throughout the plugin.
 */
export const logger = new Logger();