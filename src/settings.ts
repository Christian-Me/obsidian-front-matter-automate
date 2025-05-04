import { App, ButtonComponent, DropdownComponent, PluginSettingTab, Setting, TextComponent } from 'obsidian';
import * as fmTools from './frontmatter-tools';
import { parseJSCode, ScriptingTools } from './tools';
import { getRuleFunctionById, ruleFunctions, RuleFunction } from './rules';
import { versionString, FolderTagRuleDefinition, DEFAULT_RULE_DEFINITION, PropertyTypeInfo, ObsidianPropertyTypes} from './types';
import { AlertModal } from './alertBox';
import { openDirectorySelectionModal, DirectorySelectionResult } from './directorySelectionModal';
import { randomUUID } from 'crypto';
import { RulesTable } from './settings-properties';
import { SortableListComponent } from './SortableListComponent';

export class FolderTagSettingTab extends PluginSettingTab {
    plugin: any; //FolderTagPlugin;
    rulesDiv: HTMLDivElement;
    rulesContainer: HTMLDivElement;
    rulesControl: HTMLDivElement;
    knownProperties: PropertyTypeInfo[];
    knownTypes: any;
    scriptingTools: ScriptingTools;
    
    constructor(app: App, plugin: any /*FolderTagPlugin*/) {
        super(app, plugin);
        this.plugin = plugin;
        this.scriptingTools = new ScriptingTools(app, plugin);
    }
    hide(): void {
        // update the rules to remove the ones that are not live anymore
        this.plugin.settings.liveRules=[];
        this.plugin.settings.rules.forEach(rule => {
            let ruleFunction = getRuleFunctionById(rule.content);
            if (!ruleFunction) return;
            if (ruleFunction.isLiveRule) {
                this.plugin.settings.liveRules.push(rule);
            }
        })
        this.plugin.saveSettings();
        // update active file if it is open
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && activeFile.extension === 'md') {
            this.plugin.updateFrontmatterParameters('active-leaf-change', activeFile, this.plugin.settings.rules);
        }
    }
    display(): void {
        this.knownProperties = fmTools.getPropertiesFromMetadataManager(this.app);
        this.knownTypes = fmTools.getTypesFromMetadataManager(this.app);
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: `Front matter automate V${versionString}` });

        //new SortableListComponent(containerEl).display();
        
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
        .setName('Rules')
        .setDesc('add rules to update selected parameters');

        this.rulesContainer = containerEl.createDiv('properties-list');
        const rulesTable = new RulesTable(this.app, this.plugin,this.rulesContainer,'rules');
        rulesTable.display();
    }
}