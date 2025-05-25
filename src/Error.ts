import { logError } from "./Log";

export class ErrorManager extends Error {
    constructor(msg: string, public console_msg?: string) {
        super(msg);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export async function errorWrapper<T>(
    fn: () => Promise<T>,
    msg: string
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (!(e instanceof ErrorManager)) {
            const errorMessage = (e && typeof e === "object" && "message" in e) ? (e as { message: string }).message : String(e);
            logError(new ErrorManager(msg, errorMessage));
        } else {
            logError(e);
        }
        return null as T;
    }
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T {
    try {
        return fn();
    } catch (e) {
        if (e instanceof Error) {
            logError(new ErrorManager(msg, e.message));
        } else {
            logError(new ErrorManager(msg, String(e)));
        }
        return null as T;
    }
}
