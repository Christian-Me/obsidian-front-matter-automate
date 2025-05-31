import { App, ButtonComponent, DropdownComponent, Notice, PluginSettingTab, Setting, TextComponent, TFile } from 'obsidian';
import * as fmTools from './frontmatter-tools';
import { parseJSCode, ScriptingTools } from './tools';
import { versionString, FrontmatterAutomateRuleSettings, DEFAULT_RULE_DEFINITION, PropertyTypeInfo, ObsidianPropertyTypes} from './types';
import { AlertModal } from './alertBox';
import { openDirectorySelectionModal, DirectorySelectionResult } from './directorySelectionModal';
import { randomUUID } from 'crypto';
import { RulesTable } from './settings-properties';
import { SortableListComponent } from './SortableListComponent';
import { rulesManager } from './rules/rules';
import { logger } from './Log';
import { log } from 'console';
import { MarkdownHelpModal } from './uiMarkdownHelpModal';

export class FolderTagSettingTab extends PluginSettingTab {
    plugin: any; //FolderTagPlugin;
    rulesDiv!: HTMLDivElement;
    rulesContainer!: HTMLDivElement;
    rulesControl!: HTMLDivElement;
    knownProperties!: PropertyTypeInfo[];
    knownTypes!: any;
    scriptingTools!: ScriptingTools;

    constructor(app: App, plugin: any /*FolderTagPlugin*/) {
        super(app, plugin);
        this.plugin = plugin;
        this.scriptingTools = new ScriptingTools(app, plugin);
    }
    hide(): void {
        // update the rules to remove the ones that are not live anymore
        this.plugin.settings.liveRules=[];
        this.plugin.settings.rules.forEach((rule: FrontmatterAutomateRuleSettings) => {
            let ruleFunction = rulesManager.getRuleById(rule.content);
            if (!ruleFunction) return;
            if (ruleFunction.isLiveRule) {
                this.plugin.settings.liveRules.push(rule);
            }
        })
        this.plugin.saveSettings();
        // update active file if it is open
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && activeFile.extension === 'md') {
            this.plugin.updateFrontmatterParameters('active-leaf-change', activeFile, this.plugin.settings.folderConfig);
        }
    }
    display(): void {
        this.knownProperties = fmTools.getPropertiesFromMetadataManager(this.app);
        this.knownTypes = fmTools.getTypesFromMetadataManager(this.app);
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName(`Front matter automate V${versionString}`)
            .setDesc(`This plugin automates the management of front matter in your Obsidian notes. It allows you to set rules for automatically adding, modifying, or removing front matter properties based on various events like file creation, renaming, or active leaf changes.`)
            .addButton(button => button
                .setIcon("circle-help")
                .setTooltip("Online Help")
                .onClick(async () => {
                    let markdown = "Could not load help from GitHub.";
                    new MarkdownHelpModal(this.app, this.plugin, markdown, "readme.md").open();
                })
            );

        new Setting(containerEl)
        .setName('Exclude Files and Folders globally')
        .setDesc(`Currently ${this.plugin.settings.exclude.selectedFolders.length} folders and ${this.plugin.settings.exclude.selectedFiles.length} files will be ${this.plugin.settings.exclude.mode}d.`)
        .addButton(button => {
            button
                .setIcon('folder-x')
                .setButtonText('Exclude')
                .setCta() // Makes the button more prominent
                .onClick(() => {
                    openDirectorySelectionModal(
                        this.app,
                        this.plugin.settings.exclude.selectedFolders || [],
                        this.plugin.settings.exclude.selectedFiles || [],
                        { 
                            selectionMode: this.plugin.settings.exclude.mode || 'exclude',
                            displayMode: this.plugin.settings.exclude.display || 'folders',
                            optionSelectionMode: false,
                            optionShowFiles: true,
                        },
                        (result: DirectorySelectionResult | null) => {
                            if (!result) return;
                            this.plugin.settings.exclude.selectedFolders = result.folders;
                            this.plugin.settings.exclude.selectedFiles = result.files;
                            this.plugin.settings.exclude.mode = result.mode;
                            this.plugin.settings.exclude.display = result.display;
                            this.plugin.saveSettings(); 
                            this.display();
                        }
                    );
                });
        });  

        new Setting(containerEl)
        .setName('Include Files and Folders globally')
        .setDesc(`Currently ${this.plugin.settings.include.selectedFolders.length} folders and ${this.plugin.settings.include.selectedFiles.length} files will be ${this.plugin.settings.include.mode}d even if they are excluded.`)
        .addButton(button => {
            button
                .setIcon('folder-check')
                .setButtonText('Include')
                .setCta() // Makes the button more prominent
                .onClick(() => {
                    openDirectorySelectionModal(
                        this.app,
                        this.plugin.settings.include.selectedFolders || [],
                        this.plugin.settings.include.selectedFiles || [],
                        { 
                            selectionMode: this.plugin.settings.include.mode || 'include',
                            displayMode: this.plugin.settings.include.display || 'folders',
                            optionSelectionMode: false,
                            optionShowFiles: true,
                        },
                        (result: DirectorySelectionResult | null) => {
                            if (!result) return;
                            this.plugin.settings.include.selectedFolders = result.folders;
                            this.plugin.settings.include.selectedFiles = result.files;
                            this.plugin.settings.include.mode = result.mode;
                            this.plugin.settings.include.display = result.display;
                            this.plugin.saveSettings(); 
                            this.display();
                        }
                    );
                });
        });    
        
        new Setting(containerEl)
            .setName('Debug')
            .setDesc('Select the debug level to show in the console')
            .addDropdown((dropdown: DropdownComponent) => {
                dropdown.addOptions(
                    Object.fromEntries(logger.getLevelNames().map(level => [level, level]))
                );
                dropdown.setValue(logger.getLevelName(this.plugin.settings.debugLevel));
                dropdown.onChange((value: string) => {
                    this.plugin.settings.debugLevel = logger.getLevelByName(value);
                    logger.setLevel(this.plugin.settings.debugLevel);
                    this.plugin.saveSettings();
                });
        })
  
        new Setting(containerEl)
            .setName('Delay create event (until better solution is found)') //TODO: remove this setting when a better solution is found
            .setDesc('Set a delay before triggering the create event to allow for file creation to complete. (in milliseconds)')
            .addText(text => {
                text.setValue(this.plugin.settings.delayCreateEvent.toString());
                text.onChange(async (value) => {
                    this.plugin.settings.delayCreateEvent = parseInt(value) || 0; // Ensure it's a number
                    await this.plugin.saveSettings();
                });
        });

        this.rulesContainer = containerEl.createDiv('properties-list');
        const rulesTable = new RulesTable(this.app, this.plugin,this.rulesContainer,this.plugin.settings.folderConfig);
        rulesTable.display();

        // --- Backup and Restore Buttons ---
        new Setting(containerEl)
            .setName("Backup & Restore Configuration")
            .setDesc("Export your current config as a JSON file or restore from a backup.")
            .addButton(btn => {
                btn.setButtonText("Backup")
                    .setIcon("download")
                    .onClick(() => {
                        const dataStr = JSON.stringify(this.plugin.settings, null, 2);
                        const blob = new Blob([dataStr], { type: "application/json" });
                        const url = URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "frontmatter-automate-backup.json";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    });
            })
            .addButton(btn => {
                btn.setButtonText("Restore")
                    .setIcon("upload")
                    .onClick(() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".json,application/json";
                        input.onchange = async () => {
                            if (!input.files || input.files.length === 0) return;
                            const file = input.files[0];
                            const text = await file.text();
                            try {
                                const data = JSON.parse(text);
                                // Optionally validate data here
                                this.plugin.settings = data;
                                await this.plugin.saveSettings();
                                this.display();
                                new Notice("Frontmatter Automate\nConfiguration restored from backup.");
                            } catch (e) {
                                new Notice("Frontmatter Automate\nFailed to restore: Invalid JSON file.",2000);
                            }
                        };
                        input.click();
                    });
            });

    }
}