import { Notice } from "obsidian";
import { ErrorManager } from "./Error";

// Numeric log levels for easy comparison and usage
export const LOG = 0;
export const ALERT = 1;
export const ERROR = 2;
export const WARNING = 3;
export const INFO = 4;
export const DEBUG = 5;
export const TRACE = 6;

export type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export enum LogDevices {
    CONSOLE = "console",
    NOTIFICATION = "notification",
}

export function logUpdate(msg: string): void {
    const notice = new Notice("", 15000);
    notice.messageEl.innerHTML = `<b>Frontmatter Automate update</b>:<br/>${msg}`;
}

export function logError(e: Error | ErrorManager): void {
    const notice = new Notice("", 8000);
    if (e instanceof ErrorManager && e.console_msg) {
        notice.messageEl.innerHTML = `<b>Frontmatter Automate Error</b>:<br/>${e.message}<br/>Check console for more information`;
        console.error(`Frontmatter Error:`, e.message, "\n", e.console_msg);
    } else {
        notice.messageEl.innerHTML = `<b>Frontmatter Automate Error</b>:<br/>${e.message}`;
    }
}

export class Logger {
    private logLevel: LogLevel = INFO;

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

    getLevel(): LogLevel {
        return this.logLevel;
    }

    getLevelByName(levelName: string): LogLevel {
        const levelIndex = this.getLevelNames().indexOf(levelName.toUpperCase()) + 1;
        if (levelIndex >= 0) {
            return levelIndex as LogLevel;
        } else {
            this.log(WARNING,`Invalid log level name: ${levelName}`);
            return INFO; // Default to INFO if invalid
        }
    }
    getLevelByIndex(levelIndex: number): LogLevel {
        if (levelIndex >= ALERT && levelIndex <= TRACE) {
            return levelIndex as LogLevel;
        } else {
            this.log(WARNING,`Invalid log level index: ${levelIndex}`);
            return INFO; // Default to INFO if invalid
        }
    }

    getLevelByValue(levelValue: number): LogLevel {
        if (levelValue >= ALERT && levelValue <= TRACE) {
            return levelValue as LogLevel;
        } else {
            this.log(WARNING,`Invalid log level value: ${levelValue}`);
            return INFO; // Default to INFO if invalid
        }
    }

    private shouldLog(level: LogLevel): boolean {
        if (level === 0) return true; // Always log level 0
        return level <= this.logLevel;
    }

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

    getLevelNames(): string[] {
        return ([ALERT, ERROR, WARNING, INFO, DEBUG, TRACE] as LogLevel[]).map(level => this.getLevelName(level));
    }
    
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

    groupEnd(): void {
        console.groupEnd();
    }

    logUpdate(msg: string): void {
        new Notice(`<b>Frontmatter Automate update</b>:<br/>${msg}`, 15000);
    }

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

// Export a singleton logger instance and the log level constants
export const logger = new Logger();