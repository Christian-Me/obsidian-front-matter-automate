
import { Modal, MarkdownRenderer, App } from "obsidian";
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
                        const pluginId = this.plugin.manifest.id;
                        // Remove .obsidian/plugins/${pluginId}/doc/ from sourcePath to get relative dir
                        const docRoot = `.obsidian/plugins/${pluginId}/doc/`;
                        let relativeSource = this.sourcePath.startsWith(docRoot)
                            ? this.sourcePath.slice(docRoot.length)
                            : this.sourcePath;
                        let currentDir = relativeSource.split("/").slice(0, -1).join("/");
                        let resolvedPath = (currentDir ? currentDir + "/" : "") + href;
                        // Normalize: remove any './' or '../'
                        const parts = [];
                        for (const part of resolvedPath.split("/")) {
                            if (part === "..") parts.pop();
                            else if (part !== "." && part !== "") parts.push(part);
                        }
                        resolvedPath = parts.join("/");
                        // Now resolvedPath is relative to docRoot
                        const newMarkdown = await this.readPluginDocFile(resolvedPath);
                        this.markdown = newMarkdown;
                        this.sourcePath = docRoot + resolvedPath;
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
        const pluginId = this.plugin.manifest.id;
        // Ensure no leading slash in filename
        const cleanFilename = filename.replace(/^\/+/, "");
        const filePath = `.obsidian/plugins/${pluginId}/doc/${cleanFilename}`;
        try {
            return await this.app.vault.adapter.read(filePath);
        } catch (error) {
            const message = (error instanceof Error) ? error.message : String(error);
            throw new Error(`Failed to read file '${filePath}': ${message}`);
        }
    }
}
