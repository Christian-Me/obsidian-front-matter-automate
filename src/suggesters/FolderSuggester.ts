// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
// and Templater plugin: https://github.com/SilentVoid13/Templater where I got the code for the suggesters

import { App, TAbstractFile, TFolder } from "obsidian";
import { TextInputSuggest } from "./suggest";

export class FolderSuggest extends TextInputSuggest<TFolder> {
    constructor(app: App, inputEl: HTMLInputElement | HTMLTextAreaElement) {
        super(app, inputEl);
    }

    getSuggestions(inputStr: string): TFolder[] {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const folders: TFolder[] = [];
        const lowerCaseInputStr = inputStr.toLowerCase();

        abstractFiles.forEach((folder: TAbstractFile) => {
            if (
                folder instanceof TFolder &&
                folder.path.toLowerCase().contains(lowerCaseInputStr)
            ) {
                folders.push(folder);
            }
        });

        return folders.slice(0, 1000);
    }

    renderSuggestion(file: TFolder, el: HTMLElement): void {
        el.setText(file.path.replace(/^(?!\/)/, "/"));
    }

    selectSuggestion(file: TFolder): void {
        this.inputEl.value = file.path.replace(/^(?!\/)/, "/");
        this.inputEl.trigger("input");
        this.close();
    }
}
