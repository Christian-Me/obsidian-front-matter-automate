import { Notice } from "obsidian";
import { ErrorManager } from "./Error";

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
