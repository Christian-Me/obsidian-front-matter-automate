import { Modal, MarkdownRenderer, App } from "obsidian";

export class MarkdownHelpModal extends Modal {
    markdown: string;
    sourcePath: string;
    constructor(app: App, markdown: string, sourcePath: string = "") {
        super(app);
        this.markdown = markdown;
        this.sourcePath = sourcePath;
    }
    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        // @ts-ignore
        await MarkdownRenderer.render(this.app, this.markdown, contentEl, this.sourcePath, this);
    }
}
export async function fetchMarkdownFromGitHub(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not load file from GitHub");
    return await response.text();
}

export async function readPluginDocFile(this: any, filename: string): Promise<string> {
    const filePath = `.obsidian/plugins/folder-to-tags-plugin/doc/${filename}`;
    try {
        return await this.app.vault.adapter.read(filePath);
    } catch (error) {
        const message = (error instanceof Error) ? error.message : String(error);
        throw new Error(`Failed to read file '${filePath}': ${message}`);
    }
}