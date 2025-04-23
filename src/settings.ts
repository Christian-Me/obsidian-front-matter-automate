import { App, ButtonComponent, DropdownComponent, PluginSettingTab, Setting, TextComponent } from 'obsidian';
import * as fmTools from './frontmatter-tools';
import { parseJSCode, ScriptingTools } from './tools';
import { getRuleFunctionById, ruleFunctions, RuleFunction } from './rules';
import { versionString, FolderTagRuleDefinition, DEFAULT_RULE_DEFINITION, PropertyTypeInfo, ObsidianPropertyTypes} from './types';
import { AlertModal } from './alertBox';
import { openDirectorySelectionModal, DirectorySelectionResult } from './directorySelectionModal';
import { randomUUID } from 'crypto';
import { RulesTable } from './settings-properties';

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
        this.scriptingTools = new ScriptingTools(this.plugin.settings);
    }
    hide(): void {
        this.plugin.settings.liveRules=[];
        this.plugin.settings.rules.forEach(rule => {
            let ruleFunction = getRuleFunctionById(rule.content);
            if (!ruleFunction) return;
            if (ruleFunction.inputProperty) {
                this.plugin.settings.liveRules.push(rule);
            }
        })
        this.plugin.saveSettings();
    }
    display(): void {
        this.knownProperties = fmTools.getPropertiesFromMetadataManager(this.app);
        this.knownTypes = fmTools.getTypesFromMetadataManager(this.app);
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: `Front matter automate V${versionString}` });


        /*
        new Setting(containerEl)
            .setName('Exclude root folder')
            .setDesc('If enabled, the root folder name will be excluded from the tag')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.excludeRootFolder)
                .onChange(async (value) => {
                    this.plugin.settings.excludeRootFolder = value;
                    await this.plugin.saveSettings();
                }));
    
        new Setting(containerEl)
            .setName('Tags property name')
            .setDesc('Frontmatter property name to store tags (default: "tags")')
            .addText(text => text
                .setPlaceholder('tags')
                .setValue(this.plugin.settings.tagsPropertyName)
                .onChange(async (value) => {
                    this.plugin.settings.tagsPropertyName = value || 'tags';
                    await this.plugin.saveSettings();
                }));
        */
        new Setting(containerEl)
        .setName('Exclude Files and Folders')
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
                        this.plugin.settings.exclude.mode || 'exclude',
                        this.plugin.settings.exclude.display || 'folders',
                        false, // include, exclude option hidden
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
        .setName('Include Files and Folders')
        .setDesc(`Currently ${this.plugin.settings.include.selectedFolders.length} folders and ${this.plugin.settings.include.selectedFiles.length} files will be ${this.plugin.settings.include.mode}d even when in excluded Folders.`)
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
                        this.plugin.settings.include.mode || 'include',
                        this.plugin.settings.include.display || 'folders',
                        false, // include, include option hidden
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
        /*

        this.rulesDiv = containerEl.createDiv({ cls: "obsidian-f2t-rule-area" })
        this.rulesControl = containerEl.createDiv({ cls: "obsidian-f2t-rule-controls" })
        this.plugin.settings.rules.forEach(rule => {
            this.addRule(this.rulesDiv,rule.id);
        })

        new Setting(this.rulesControl)
            .addButton(async (button) => {
                button.setIcon('square-plus');
                button.setClass('obsidian-f2t-smallButton');
                button.setTooltip('add a rule')
                button.onClick(async () => {
                    this.addRule(this.rulesDiv);
                });
            })
            /* TODO add clear all rules functionality 
            .addButton(async (button) => { 
                button.setIcon('square-x');
                button.setClass('obsidian-f2t-smallButton');
                button.setTooltip('remove all rules')
                button.onClick(async () => {
                    console.log('removeAllRules');
                });
            });
            */
        
        this.rulesContainer = containerEl.createDiv('properties-list');
        const rulesTable = new RulesTable(this.app, this.plugin,this.rulesContainer,'rules');
        rulesTable.display();
    }

    addRule(divEl: HTMLDivElement, ruleUUID = '') {
        let cmEditor: CodeMirror.Editor | null = null;
        if (ruleUUID === ''){
            ruleUUID = randomUUID().toString();
            this.plugin.settings.rules.push(Object.assign({}, DEFAULT_RULE_DEFINITION, {
                id: ruleUUID,
            }));
        }
        const rule:FolderTagRuleDefinition = this.plugin.settings.rules.find(rule => rule.id === ruleUUID);
        if(!rule) return;
        let propertyNameInput : TextComponent;
        let showFunctionButton : ButtonComponent | undefined;
        let propertyTypeDropdown : DropdownComponent;
        let propertyDevDropdown : DropdownComponent | undefined;
        let functionResultTextComponent: TextComponent | undefined;
        let functionTestButton: ButtonComponent | undefined;
        const rulesDiv = divEl.createDiv({ cls: "obsidian-f2t-ruleLine" });
        rulesDiv.setAttribute('id',ruleUUID)
        const ruleOptionsDiv = divEl.createDiv({ cls: "obsidian-f2t-ruleOptions" });
        //ruleOptionsDiv.style.display= 'none';
        //ruleOptionsDiv.style.width= '700px'
        ruleOptionsDiv.style.height= '350px;';
        ruleOptionsDiv.style.alignItems= 'flex-end';
        if (this.plugin.settings.useTextArea) {
            const ruleOptionsSettings = new Setting(ruleOptionsDiv)
                .addTextArea(textArea => {
                    textArea.setPlaceholder('ender valid JS Code');
                    textArea.inputEl.setAttribute('style', `height:190px; width:80%;`);
                    textArea.onChange(async (value) => {
                        if (functionTestButton) functionTestButton.buttonEl.addClass('mod-warning');
                        rule.jsCode = value;
                        await this.plugin.saveSettings();
                    })
                })
        } else {
            // Initialize CodeMirror 5
            let jsCode = rule.jsCode;
            if (rule.content !== 'script') {
                if (rule.buildInCode === '') {
                    rule.buildInCode = getRuleFunctionById(rule.content)?.source || ruleFunctions[0].source;
                }
                jsCode = rule.buildInCode;
            }
            cmEditor = (window as any).CodeMirror(ruleOptionsDiv, {
                value: jsCode || "function (app, file, tools) { // do not change this line!\n\n  return result; // return you result.\n}",
                mode: "javascript",
                lineNumbers: true,
                // theme: "obsidian",
                indentUnit: 2,  
                lineWrapping: false,
                readOnly: false,  
            });
            if (cmEditor) {
                cmEditor.on('change', (cmEditor: CodeMirror.Editor) => {
                    if (functionTestButton) functionTestButton.buttonEl.addClass('mod-warning');
                });
                cmEditor.on('blur', (cmEditor: CodeMirror.Editor) => {
                    if (rule.content === 'script') {
                        rule.jsCode = cmEditor.getValue();
                    } else {
                        rule.buildInCode = cmEditor.getValue();
                    }
                    this.plugin.saveSettings();
                });
            };
    
            // Add a button to save the code
            new Setting(ruleOptionsDiv)
                .addButton((button) => {
                    functionTestButton = button;
                    button
                    .setWarning()
                    .setButtonText("Save & Test")
                    .onClick(async () => {
                        if (cmEditor) {
                            let jsCode = '';
                            if (rule.content === 'script') {
                                rule.jsCode = cmEditor.getValue();
                                jsCode = rule.jsCode;
                            } else {
                                rule.buildInCode = cmEditor.getValue();
                                jsCode = rule.buildInCode;
                            }

                            await this.plugin.saveSettings();
                            let userFunction =  parseJSCode(jsCode);
                            if (typeof userFunction === 'string') {
                                let errorHint = "See console for details!";
                                if (userFunction.contains('Unexpected token')) {
                                    errorHint = "Did you missed a semicolon (;)?";
                                }
                                if (functionResultTextComponent) functionResultTextComponent.setValue(`Syntax error: ${userFunction}! ${errorHint}`);
                            } else {
                                if (userFunction) {
                                    try {
                                        const files = this.app.vault.getMarkdownFiles();
                                        const result = userFunction(this.app, files[8], this.scriptingTools);
                                        if (functionResultTextComponent) functionResultTextComponent.setValue(result.toString());
                                        button.buttonEl.removeClass('mod-warning');
                                    }
                                    catch (e) {
                                        if (functionResultTextComponent) {
                                            functionResultTextComponent.setValue(`Syntax error: ${e.message}! See console for details!`);
                                        }
                                        console.error("Syntax error. ", e, jsCode, userFunction);
                                    }
                                } else {
                                    console.error("syntax error");
                                }
                            }
                        }
                    });
                })
                .addText((text) => {
                    functionResultTextComponent = text;
                    text
                    .setPlaceholder('function result')
                    .setDisabled(true)
                    functionResultTextComponent.inputEl.style.width = '600px';

                }) 
        }

        function showJsFunctionButton(ruleId:string) {
            const showCodeButton:boolean = 
                (getRuleFunctionById(ruleId)?.source !== '') ||
                (ruleId === 'script');
            if ( showCodeButton ) {
                if (showFunctionButton) showFunctionButton.buttonEl.style.display = "block";
                if (propertyDevDropdown) propertyDevDropdown.selectEl.style.width = "360px";
            } else {
                if (showFunctionButton) showFunctionButton.buttonEl.style.display = "none";
                if (propertyDevDropdown) propertyDevDropdown.selectEl.style.width = "400px";
            }
        }

        const ruleSettings = new Setting(rulesDiv)
            .addButton(button => {
                button.buttonEl.setAttribute('style','width:150px; justify-content: left; ');
                button.setButtonText(rule.property || 'Select Parameter')
                button.onClick(() => {
                    new fmTools.SelectProperty(this.app, this.knownProperties, rule.typeProperty, (result) => {
                        if (result.name !== '') {
                            rule.typeProperty = result;
                            rule.property = result.name;
                            rule.type = result.type;
                            if (this.knownProperties.filter((property) => property.name.toLowerCase().includes(rule.property.toLowerCase())).length === 0) {
                                //propertyTypeDropdown.setDisabled(false);
                            };
                            button.setButtonText(result.name);
                            this.plugin.saveSettings();
                        }
                        propertyTypeDropdown.setValue(result.type);
                        //this.display(); // Refresh the settings tab to show new value
                    }).open();
                })
            })
            .addDropdown((dropdown) => {
                propertyTypeDropdown = dropdown;
                dropdown.selectEl.setAttribute('style','width:110px');
                dropdown.addOption("", "Select a type");
                dropdown.addOption("aliases", "Aliases");
                dropdown.addOption("checkbox", "Checkbox");
                dropdown.addOption("date", "Date");
                dropdown.addOption("datetime", "Date & Time");
                dropdown.addOption("multitext", "List");
                dropdown.addOption("number", "Number");
                dropdown.addOption("tags", "Tags");
                dropdown.addOption("text", "Text");
                if (rule.type) dropdown.setValue(rule.type);
                //dropdown.setDisabled(true);
                dropdown.onChange(async (value) => {
                    if (value !== '') {
                        rule.type = value as ObsidianPropertyTypes;
                        await this.plugin.saveSettings();
                    }
                });
            })
            .addDropdown((dropdown) => {
                propertyDevDropdown = dropdown;
                dropdown.selectEl.setAttribute('style','width:400px');
                dropdown.addOption("", "Select a content");
                for (let rule of ruleFunctions) {
                    dropdown.addOption(rule.id, rule.description);
                }
                dropdown.addOption("script", "JavaScript script");
                dropdown.setValue(rule.content);
                dropdown.onChange(async (value) => {
                    let jsCode = '';
                    if (value !== '') {
                        if (value !== 'script') {
                            let oldOriginalCode = getRuleFunctionById(rule.content)?.source || ruleFunctions[0].source;
                            if ((rule.buildInCode !== '') && (rule.buildInCode !== oldOriginalCode)) {
                                const shouldProceed = await new AlertModal(
                                        this.app,
                                        'Overwrite existing code?',
                                        'I sees like you have custom code for this rule! Should this be overwritten by default code for this parameter?',
                                        'Yes', 'No'
                                    ).openAndGetValue();
                                if (shouldProceed) {
                                    jsCode = rule.buildInCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source; // 
                                } else {
                                    jsCode = rule.buildInCode; // keep the existing code
                                }
                                cmEditor?.setValue(jsCode);
                                //await this.plugin.saveSettings();
                            } else {
                                jsCode = rule.buildInCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source;
                                cmEditor?.setValue(jsCode);
                                //await this.plugin.saveSettings();
                            }
                        } else {
                            cmEditor?.setValue(rule.jsCode!=='' ? rule.jsCode : ruleFunctions[0].source);
                        }
                        rule.content = value;
                        //ruleOptionsDiv.style.display = `${(rule.content === 'script') ? 'flex' : 'none'}`;
                        showJsFunctionButton(rule.content);
                        await this.plugin.saveSettings();
                    }
                });
                ruleOptionsDiv.style.display = `${(rule.content === 'script') && (rule.showContent) ? 'flex' : 'none'}`;
            })
            .addButton(async (button) => {
                showFunctionButton = button;
                button.buttonEl.setAttribute('style','width:30px');
                button.setIcon('square-function');
                button.setClass('obsidian-f2t-smallButton');
                button.setTooltip('show & edit code')
                button.onClick(async () => {
                    rule.showContent = !rule.showContent;
                    ruleOptionsDiv.style.display = `${(rule.showContent) ? 'flex' : 'none'}`;
                })
                showFunctionButton.buttonEl.style.display = "none";
            })
            .addButton(async (button) => {
                button.buttonEl.setAttribute('style','width:30px');
                button.setIcon('square-minus');
                button.setClass('obsidian-f2t-smallButton');
                button.setTooltip('remove this rule')
                button.onClick(async () => {
                    this.plugin.settings.rules.splice(this.plugin.settings.rules.findIndex(value => value.id === ruleUUID));
                    this.removeRule(rulesDiv);
                    await this.plugin.saveSettings();
                });
            });
            showJsFunctionButton(rule.content);
            divEl.style.removeProperty('border-top');
        }
        
    removeRule(rulesDiv: HTMLDivElement) {
        rulesDiv.remove();
    }

}