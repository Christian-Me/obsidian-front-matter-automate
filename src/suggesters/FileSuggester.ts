// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
// and Templater plugin: https://github.com/SilentVoid13/Templater where I got the code for the suggesters

import { TAbstractFile, TFile } from "obsidian";
import { TextInputSuggest } from "./suggest";
import { getFilesFromFolder } from "../tools";
import FolderTagPlugin from "../../main";
import { errorWrapperSync } from "../Error";

export enum FileSuggestMode {
    TemplateFiles,
    ScriptFiles,
}

export class FileSuggest extends TextInputSuggest<TFile> {

    constructor(
        public inputEl: HTMLInputElement,
        private plugin: FolderTagPlugin,
        private folder: string
    ) {
        super(plugin.app, inputEl);
    }

    get_error_msg(): string {
        return `Folder ${this.folder} doesn't exist`;
    }

    getSuggestions(input_str: string): TFile[] {
        const all_files = errorWrapperSync(
            () => getFilesFromFolder(
                    this.plugin.app,
                    this.folder
                ),
            this.get_error_msg()
        );
        if (!all_files) {
            return [];
        }

        const files: TFile[] = [];
        const lower_input_str = input_str.toLowerCase();

        all_files.forEach((file: TAbstractFile) => {
            if (file instanceof TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lower_input_str))
            {
                files.push(file);
            }
        });

        return files.slice(0, 1000);
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.setText(file.path);
    }

    selectSuggestion(file: TFile): void {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}
