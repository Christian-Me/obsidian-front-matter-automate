import { read } from "fs";
import { Modal, MarkdownRenderer, App } from "obsidian";
import * as path from "path";
import { ERROR, logger } from "./Log";

export class MarkdownHelpModal extends Modal {
    markdown: string = "";
    sourcePath: string = "";
    app: App;
    plugin: any;
    constructor(app: App, plugin: any, markdown: string, sourcePath: string) {
        super(app);
        this.app = app;
        this.plugin = plugin;
        this.markdown = markdown;
        this.sourcePath = sourcePath;
    }
    async onOpen() {
        const { contentEl, modalEl } = this;
        modalEl.addClass("FMA-markdown-help-modal--wide");
        try {
            this.markdown = await this.readPluginDocFile(this.sourcePath);
        } catch (error) {
            logger.log(ERROR,"Error loading markdown:", error);
            this.markdown = "Could not load documentation file: " + this.sourcePath;
        }
        contentEl.empty();
        // @ts-ignore
        await MarkdownRenderer.render(this.app, this.markdown, contentEl, this.sourcePath, this);

        contentEl.addEventListener("click", async (evt) => {
            const target = evt.target as HTMLElement;
            if (target.tagName === "A") {
                const href = target.getAttribute("href");
                if (href && href.endsWith(".md") && !href.match(/^https?:\/\//) && !href.startsWith("/")) {
                    evt.preventDefault();
                    try {
                        const currentDir = this.sourcePath ? path.dirname(this.sourcePath) : "";
                        const resolvedPath = path.normalize(path.join(currentDir, href)).replace(/\\/g, "/");
                        const newMarkdown = await this.readPluginDocFile(resolvedPath);
                        this.markdown = newMarkdown;
                        this.sourcePath = resolvedPath;
                        contentEl.empty();
                        // @ts-ignore
                        await MarkdownRenderer.render(this.app, this.markdown, contentEl, this.sourcePath, this);
                    } catch (e) {
                        contentEl.empty();
                        contentEl.createEl("div", { text: "Could not load: " + href });
                    }
                }
            }
        });
    }

    async fetchMarkdownFromGitHub(url: string): Promise<string> {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load file from GitHub");
        return await response.text();
    }

    async readPluginDocFile(filename: string): Promise<string> {
        // const vaultRoot = (this.app.vault.adapter as any).basePath as string;
        const pluginId = this.plugin.manifest.id;
        const filePath = path.posix.join('.obsidian', 'plugins', pluginId, 'doc', filename);
        try {
            return await this.app.vault.adapter.read(filePath);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : String(error);
            throw new Error(`Failed to read file '${filePath}': ${message}`);
        }
    }
}
