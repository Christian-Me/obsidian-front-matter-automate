import { App, Plugin, PluginSettingTab, Setting, DropdownComponent, TextComponent, ButtonComponent, ToggleComponent, setIcon, apiVersion, TFile } from 'obsidian';
import { openDirectorySelectionModal, DirectorySelectionResult } from './directorySelectionModal';
import { versionString, FrontmatterAutomateRuleSettings, DEFAULT_RULE_DEFINITION, PropertyTypeInfo, ObsidianPropertyTypes, DEFAULT_FILTER_FILES_AND_FOLDERS, PropertyInfo} from './types';
import { checkIfFileAllowed, executeRuleObject } from './rules';
import { AlertModal } from './alertBox';
import { randomUUID } from 'crypto';
import { codeEditorModal, codeEditorModalResult, openCodeEditorModal } from './editorModal';
import { copyFileSync } from 'fs';
import { ScriptingTools } from './tools';
import { updatePropertyIcon } from './uiElements';
import { rulesManager } from './rules/rules';

export class RulesTable extends PluginSettingTab {
    plugin: any;
    knownProperties: Record<string, PropertyInfo> = {}; 
    container: HTMLDivElement;
    propertiesListEl: HTMLDivElement;
    settingsParameter: string;
    tools: ScriptingTools;
    activeFile: TFile | null = null;

    constructor(app: App, plugin: any, container: HTMLDivElement, settingsParameter: string) {
        super(app, plugin);
        this.plugin = plugin;
        this.container = container;
        this.settingsParameter = settingsParameter;
        this.tools = new ScriptingTools(app, plugin);
        this.activeFile = this.app.workspace.getActiveFile();

    }

    // Helper to render one rule

    renderPropertyRow(containerEl: HTMLElement, rule: FrontmatterAutomateRuleSettings, index: number) {
        
        //const activeFile = this.app.workspace.getActiveFile();

        const rowEl = containerEl.createDiv({ cls: 'property-setting-row setting-item' });
        rowEl.id = rule.id;
        const controlEl = rowEl.createDiv({ cls: 'setting-item-control' }); 
        controlEl.style.gap = '0px';
        const leftContainer = controlEl.createDiv({ cls: 'property-left-container' });
        const iconEl = leftContainer.createSpan({ cls: 'property-icon setting-item-icon' }); 
        setIcon(iconEl, 'hash'); // Standard-Icon


        const searchContainer = leftContainer.createDiv({ cls: 'property-search-container' });

        const nameInput = new TextComponent(searchContainer)
            .setPlaceholder('Select property...')
            .setValue(rule.property || '')
            .onChange(async (value) => {
                this.renderSearchResults(searchContainer, value, index);
            })

        nameInput.inputEl.style.border = 'none'; // make it invisible
        nameInput.inputEl.addEventListener('focus', () => {
            this.renderSearchResults(searchContainer, nameInput.getValue(), index);
        });
        nameInput.inputEl.addEventListener('input', () => {
            this.renderSearchResults(searchContainer, nameInput.getValue(), index);
        });
        nameInput.inputEl.addEventListener('blur', (event) => {
            setTimeout(() => {
                const relatedTarget = event.relatedTarget as Node;
                const resultsEl = searchContainer.querySelector('.property-search-results');
                if (!resultsEl || !resultsEl.contains(relatedTarget)) {
                    this.clearSearchResults(searchContainer);
                }
            }, 100);
        });

        const currentPropertyInfo = this.knownProperties[rule.property];
        if (currentPropertyInfo) {
            updatePropertyIcon(iconEl, currentPropertyInfo.type);
        } else if (rule.property) {
            setIcon(iconEl, 'alert-circle'); 
        }

        const middleContainer = controlEl.createDiv({ cls: 'property-middle-container' });
        const valueContainer = middleContainer.createDiv({ cls: 'property-value-container' });
        if (this.activeFile) {
            this.app.fileManager.processFrontMatter(this.activeFile, async (frontmatter) => {
                rule.value = await executeRuleObject('preview',this.app, this.plugin.settings, this.activeFile, '', rule, frontmatter); //TODO: implement using only updatePerview
            },{'mtime':this.activeFile.stat.mtime}); // do not change the modify time.
        }
        const previewComponent = this.renderValueInput(valueContainer, currentPropertyInfo, rule.value, index);
        this.updatePreview(rule, previewComponent);

        const propertyDevDropdown =  new DropdownComponent(middleContainer);
        propertyDevDropdown.selectEl.setAttribute('style','width:35%');
        propertyDevDropdown.addOption("", "Select a content");

        // add rule functions to dropdown
        rulesManager.getRulesByType('buildIn', rule.type).forEach(rule => {
            propertyDevDropdown.addOption(rule.id, rule.name);
        });

        propertyDevDropdown.addOption("script", "JavaScript function (advanced)");
        propertyDevDropdown.setValue(rule.content);
        propertyDevDropdown.onChange(async (value) => {
            if (value !== '') {
                const ruleFunction = rulesManager.getRuleById(value);
                switch (ruleFunction?.ruleType) {
                    case 'script':
                        let oldOriginalCode = rulesManager.getRuleById(value)?.source || rulesManager.getRuleById('default')?.getSource() || '';
                        if ((rule.buildInCode !== '') && (rule.buildInCode !== oldOriginalCode)) {
                            const shouldProceed = await new AlertModal(
                                    this.app,
                                    'Overwrite existing code?',
                                    'I sees like you have custom code for this rule! Should this be overwritten by default code for this parameter?',
                                    'Yes', 'No'
                                ).openAndGetValue();
                            
                            if (shouldProceed.proceed) {
                                rule.buildInCode = rulesManager.getRuleById(value)?.source || rulesManager.getRuleById('default')?.getSource() || '';
                                rule.useCustomCode = false;
                            } else {
                                rule.buildInCode; // keep the existing code
                            }
                            await this.plugin.saveSettings();
                        } else {
                            rule.buildInCode = rulesManager.getRuleById(value)?.source || rulesManager.getRuleById('default')?.getSource() || '';
                            rule.useCustomCode = false;
                            await this.plugin.saveSettings();
                        }
                        break;
                    case 'buildIn.inputProperty':
                    case 'buildIn':
                        rule.buildInCode = rulesManager.getRuleById(value)?.source || rulesManager.getRuleById('default')?.getSource() || '';
                        rule.useCustomCode = false;
                        await this.plugin.saveSettings();
                        break;
                    case 'automation':
                    case 'autocomplete.modal':
                        // rule.isLiveRule = true;
                        break;
                    default:
                }
                rule.content = value;
                //ruleOptionsDiv.style.display = `${(rule.content === 'script') ? 'flex' : 'none'}`;
                //showJsFunctionButton(rule.content);
                await this.plugin.saveSettings();
                this.updatePreview(rule, previewComponent);
                this.renderPropertyOptions(optionEL, rule, previewComponent);
            }
        });

        new ButtonComponent(middleContainer)
        .setIcon('gear')
        .setTooltip('open settings')
        .setClass('property-icon-button')
        .onClick(async () => {
            let settingsContainers = containerEl.getElementsByClassName('property-options-container');
            for (let container of settingsContainers) {
                if (container.getAttribute('id') !== rule.id) container.setAttribute('style','display: none;');
            }
            this.renderPropertyOptions(optionEL, rule, previewComponent);
            optionEL.style.display = optionEL.style.display === 'block' ? 'none' : 'block';
        });

        // --- right part: erase rule ---
        const deleteButtonContainer = controlEl.createDiv({ cls: 'property-delete-button-container' });
        new ButtonComponent(deleteButtonContainer)
            .setIcon('trash-2')
            .setTooltip('remove this rule')
            .setClass('mod-subtle')
            .onClick(async () => {
                this.plugin.settings[this.settingsParameter].splice(index, 1);
                await this.plugin.saveSettings();
                this.display(); // Re-render the settings tab
            });

        controlEl.style.display = 'flex';
        controlEl.style.alignItems = 'center';
        controlEl.style.justifyContent = 'space-between';
        controlEl.style.width = '100%';

        leftContainer.style.display = 'flex';
        leftContainer.style.alignItems = 'center';
        leftContainer.style.minWidth = '150px'; 
        iconEl.style.marginRight = '8px';

        searchContainer.style.position = 'relative'; 
        searchContainer.style.flexGrow = '1';

        valueContainer.style.flexGrow = '2'; 

        deleteButtonContainer.style.marginLeft = 'auto'; 

        const optionEL = containerEl.createDiv({ cls: 'property-options-container' }); // options container
        optionEL.id = rule.id;
        optionEL.style.display = 'none';
    }

    renderPropertyOptions(optionEL: HTMLDivElement, rule: FrontmatterAutomateRuleSettings, previewComponent: TextComponent) {
        optionEL.empty(); // clear previous options
        //const ruleFn = getRuleFunctionById(rule.content);
        const ruleFn = rulesManager.getRuleById(rule.content);
        if (!ruleFn) return;
        if (ruleFn.useRuleOption('removeContent')) {
            const removeContentButton = new Setting(optionEL)
                .setName('Remove content')
                .setDesc(`Before making changes you might consider to remove content generated by this rule`)
                .addButton(button => {
                    button
                        .setWarning()
                        .setButtonText('Remove Content')
                        .setCta() // Makes the button more prominent
                        .onClick(() => {
                            let count = this.plugin.removeFrontmatterParamsFromAllFiles(rule);
                            button.removeCta();
                            button.setDisabled(true);
                            removeContentButton.setDesc(`Removed this rule from ${count.files} files.`);
                        })
                    }
                );
        }
        if (ruleFn.useRuleOption('ruleActive')) {
            new Setting(optionEL)
                .setName('Rule active')
                .setDesc('If enabled, the rule will be executed')
                .addToggle(toggle => toggle
                    .setValue(rule.active)
                    .onChange(async (value) => {
                        rule.active = value;
                        await this.plugin.saveSettings();
                    })
                );
        }
        if (ruleFn.useRuleOption('modifyOnly')) {
            new Setting(optionEL)
            .setName('Modify only')
            .setDesc('Only modify existing properties')
            .addToggle(toggle => toggle
                .setValue(rule.onlyModify)
                .onChange(async (value) => {
                    rule.onlyModify = value;
                    await this.plugin.saveSettings();
                    this.updatePreview(rule, previewComponent);
                }));
        }
        if (rule.type === 'text' || rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
            if (ruleFn.useRuleOption('addPrefix')) {
                if (rule.type === 'tags' || rule.type === 'aliases') {
                    new Setting(optionEL)
                    .setName('Prefix')
                    .setDesc('Optional prefix to add before the content (i.e. "prefix/")')
                    .addText(text => text
                        .setPlaceholder('no prefix')
                        .setValue(rule.prefix)
                        .onChange(async (value) => {
                            rule.prefix = value;
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        }));
                }
            }
            if (ruleFn.useRuleOption('spaceReplacement')) {
                new Setting(optionEL)
                    .setName('Space replacement')
                    .setDesc('Character to replace spaces in folder names (suggested: "_")')
                    .addText(text => text
                        .setPlaceholder('no replacement')
                        .setValue(rule.spaceReplacement)
                        .onChange(async (value) => {
                            rule.spaceReplacement = value;
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        }));
            }
            if (ruleFn.useRuleOption('specialCharacterReplacement')) {
                new Setting(optionEL)
                    .setName('Special character replacement')
                    .setDesc('Character to replace special characters (suggested: "-") - preserves letters with diacritics')
                    .addText(text => text
                        .setPlaceholder('no replacement')
                        .setValue(rule.specialCharReplacement)
                        .onChange(async (value) => {
                            rule.specialCharReplacement = value;
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        }));
            }
            let formatRule = rulesManager.getRuleById(rule.formatter);
            let formatOptionsButton;
            if (ruleFn.useRuleOption('convertToLowerCase')) {
                new Setting(optionEL)
                    .setName('Format output')
                    .setDesc('Format output using selected option')
                    .addDropdown(dropdown => {
                        rulesManager.getRulesByType('formatter').forEach(rule => {
                            dropdown.addOption(rule.id, rule.name);
                        });
                        dropdown.setValue(rule.formatter || 'toOriginal')
                        dropdown.onChange(async (value) => {
                            rule.formatter = value;
                            formatRule = rulesManager.getRuleById(rule.formatter);
                            formatOptionsButton.extraSettingsEl.style.display = !formatRule?.hasOwnConfigTab() ? 'none' : 'block';
                            formatRule?.configTab(converterOptionDiv, rule, this, previewComponent);
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        });
                    })
                    .addExtraButton(button => {
                        formatOptionsButton = button;
                        formatOptionsButton
                            .setIcon('gear')
                            .setTooltip('format options')
                            .onClick(async () => {
                                converterOptionDiv.style.display = converterOptionDiv.style.display === 'block' ? 'none' : 'block';
                            });
                        formatOptionsButton.extraSettingsEl.style.display = !formatRule?.hasOwnConfigTab() ? 'none' : 'block';
                        
                    })
            }
            let converterOptionDiv = optionEL.createDiv({ cls: 'property-converter-option' });
            converterOptionDiv.style.display = 'none';
            converterOptionDiv.style.marginLeft = '20px';
            formatRule?.configTab(converterOptionDiv, rule, this, previewComponent);
            if (ruleFn.useRuleOption('resultAsLink')) {
                new Setting(optionEL)
                    .setName('Result as Link')
                    .setDesc('Format Result as Link')
                    .addDropdown(dropdown => {
                        rulesManager.getRulesByType('linkFormatter').forEach(rule => {
                            dropdown.addOption(rule.id, rule.name);
                        });
                        dropdown.setValue(rule.linkFormatter || 'toOriginalLink')
                        dropdown.onChange(async (value) => {
                            rule.linkFormatter = value;
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        });
                    })
            }
        }
        if (rule.type === 'text' || rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
            if (ruleFn.useRuleOption('addContent')) {
                new Setting(optionEL)
                    .setName('Add content')
                    .setDesc('select how the content should be stored')
                    .addDropdown(dropdown => dropdown
                        .addOption("overwrite", "replace content")
                        .addOption("start", "place on start")
                        .addOption("end", "place on end")
                        .setValue(rule.addContent)
                        .onChange(async (value) => {
                            if (value !== '') {
                                rule.addContent = value === 'overwrite' ? 'overwrite' : value === 'start' ? 'start' : 'end';
                                await this.plugin.saveSettings();
                                this.updatePreview(rule, previewComponent);
                            }
                        })
                    );
            }
        }
        if (ruleFn.useRuleOption('excludeFolders')) {
            const excludeEL = new Setting(optionEL)
                .setName('Exclude Files and Folders from this rule')
                .setDesc(`Currently ${rule.exclude?.selectedFolders.length || 0} folders and ${rule.exclude?.selectedFiles.length || 0} files will be ${rule.exclude?.mode || 'exclude'}d.`)
                .addButton(button => {
                    button
                        .setIcon('folder-x')
                        .setButtonText('Exclude')
                        .setCta() // Makes the button more prominent
                        .onClick(() => {
                            openDirectorySelectionModal(
                                this.app,
                                rule.exclude?.selectedFolders || [],
                                rule.exclude?.selectedFiles || [],
                                { 
                                    selectionMode: 'exclude',
                                    displayMode: rule.exclude?.display || 'folders',
                                    optionSelectionMode: false,
                                    optionShowFiles: true,
                                },
                                (result: DirectorySelectionResult | null) => {
                                    if (!result) return;
                                    if (!rule.exclude) {
                                        rule.exclude=Object.assign({}, DEFAULT_FILTER_FILES_AND_FOLDERS, {
                                            mode : 'exclude'
                                        });
                                    };
                                    rule.exclude.selectedFolders = result.folders;
                                    rule.exclude.selectedFiles = result.files;
                                    rule.exclude.mode = 'exclude';
                                    rule.exclude.display = result.display;
                                    this.plugin.saveSettings();
                                    console.log(rule.exclude);
                                    this.updateFilterIndicator(this.activeFile, this.propertiesListEl);
                                    excludeEL.setDesc(`Currently ${rule.exclude?.selectedFolders.length || 0} folders and ${rule.exclude?.selectedFiles.length || 0} files will be ${rule.exclude?.mode || 'exclude'}d.`)
                                }
                            );
                        });
                });   
        }
        if (ruleFn.useRuleOption('includeFolders')) {
            const includeEL = new Setting(optionEL)
                .setName('Include Files and Folders for this rule ')
                .setDesc(`Currently ${rule.include?.selectedFolders.length || 0} folders and ${rule.include?.selectedFiles.length || 0} files will be ${rule.include?.mode || 'include'}d even if they are excluded globally.`)
                .addButton(button => {button
                    .setIcon('folder-check')
                    .setButtonText('Include')
                    .setCta() // Makes the button more prominent
                    .onClick(() => {
                        openDirectorySelectionModal(
                            this.app,
                            rule.include?.selectedFolders || [],
                            rule.include?.selectedFiles || [],
                            { 
                                selectionMode: 'include',
                                displayMode: rule.include?.display || 'folders',
                                optionSelectionMode: false,
                                optionShowFiles: true,
                            },
                            (result: DirectorySelectionResult | null) => {
                                if (!result) return;
                                if (!rule.include) {
                                    rule.include = Object.assign({}, DEFAULT_FILTER_FILES_AND_FOLDERS, {
                                        mode : 'include',
                                    });
                                };
                                rule.include.selectedFolders = result.folders;
                                rule.include.selectedFiles = result.files;
                                rule.include.mode = 'include';
                                rule.include.display = result.display;
                                this.plugin.saveSettings();
                                console.log(rule.include);
                                this.updateFilterIndicator(this.activeFile, this.propertiesListEl);
                                includeEL.setDesc(`Currently ${rule.include?.selectedFolders.length || 0} folders and ${rule.include?.selectedFiles.length || 0} files will be ${rule.include?.mode || 'include'}d.`)
                            }
                        );
                    });
            }); 
        }      
        if (ruleFn.useRuleOption('script')) {
            new Setting(optionEL)
                .setName('Script')
                .setDesc('edit the script for own modifications')
                .addButton(button => { button
                    .setButtonText('JS Editor')
                    .onClick(() => {
                        openCodeEditorModal(
                            this.app,
                            this.plugin,
                            rule.content === 'script' ? rule.jsCode : rule.buildInCode,
                            rule.typeProperty?.type || 'text',
                            this.activeFile,
                            this.activeFile ? this.app.metadataCache.getFileCache(this.activeFile)?.frontmatter || {} : {},
                            (result: codeEditorModalResult | null) => {
                                if (!result) return;
                                if (rule.content === 'script') {
                                    rule.jsCode = result.code;
                                    rule.useCustomCode = false;
                                } else {
                                    rule.buildInCode = result.code;
                                    rule.useCustomCode = true;
                                    button.setCta();
                                }
                                this.plugin.saveSettings();
                                this.updatePreview(rule, previewComponent);
                            }
                        );
                    });
                    if (rule.useCustomCode) {
                        button.setCta(); // Makes the button more prominent
                    } else {
                        button.removeCta(); // Makes the button less prominent
                    }
                });
        }

        // add custom config
        let ruleOptionDiv = optionEL.createDiv({ cls: 'property-rule-option' });
        ruleOptionDiv.style.marginLeft = '20px';
        rulesManager.buildConfigTab(rule.content, ruleOptionDiv, rule, this, previewComponent);
        
        this.updatePreview(rule, previewComponent);
    }

    /**
     * Retrieves the configuration option for a specific rule and property.
     *
     * @param ruleId - The unique identifier of the rule.
     * @param propertyId - The specific property for which the configuration is being retrieved.
     * @returns The configuration value for the specified property, or undefined if not found.
     */
    getOptionConfig(ruleId:string,propertyId:string){
        const rule = this.plugin.settings.rules.find((rule: FrontmatterAutomateRuleSettings) => rule.id === ruleId);
        if (rule) {
            const optionConfig = rule.optionsConfig[ruleId]
            if (optionConfig[propertyId]) {
                return optionConfig[propertyId];
            }
        }
        return undefined;
    }

    /**
     * Sets the configuration option for a specific rule and property.
     *
     * @param ruleId - The unique identifier of the rule.
     * @param propertyId - The specific property for which the configuration is being set.
     * @param config - The configuration value to be set.
     */
    setOptionConfig(ruleId:string,propertyId:string,config:any){
        const rule = this.plugin.settings.rules.find((rule: FrontmatterAutomateRuleSettings) => rule.id === ruleId);
        if (rule) {
            if (!rule.optionsConfig) rule.optionsConfig = {}
            if (!rule.optionsConfig[ruleId]) rule.optionsConfig[ruleId] = {};

            rule.optionsConfig[ruleId][propertyId] = config;
            this.plugin.saveSettings();
        }
    }

    hasOptionConfig(ruleId:string):boolean{
        const rule = this.plugin.settings.rules.find((rule: FrontmatterAutomateRuleSettings) => rule.id === ruleId);
        if (rule) {
            if (!rule.optionsConfig) rule.optionsConfig = {}
            if (!rule.optionsConfig[ruleId]) rule.optionsConfig[ruleId] = {};
            return Object.keys(rule.optionsConfig[ruleId]).length > 0;
        }
        return false;
    }

    setOptionConfigDefaults(ruleId:string, defaults:any){
        const rule = this.plugin.settings.rules.find((rule: FrontmatterAutomateRuleSettings) => rule.id === ruleId);
        if (rule) {
            if (!rule.optionsConfig) rule.optionsConfig = {}
            rule.optionsConfig[ruleId] = Object.assign({}, defaults, rule.optionsConfig[ruleId] || {});
        }
        return rule.optionsConfig[ruleId];
    }

    renderSearchResults(searchContainerEl: HTMLElement, searchTerm: string, rowIndex: number) {
        
        this.clearSearchResults(searchContainerEl);

        const filteredProperties = Object.entries(this.knownProperties)
            .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filteredProperties.length === 0 && searchTerm) {
            return;
        }
        if (filteredProperties.length === 0 && !searchTerm) {
            return;
        }

        const resultsEl = searchContainerEl.createDiv({ cls: 'property-search-results menu' });
        resultsEl.style.position = 'absolute';
        resultsEl.style.top = '100%';
        resultsEl.style.left = '0';
        resultsEl.style.width = 'calc(100% + 100px)';
        resultsEl.style.zIndex = '10';
        resultsEl.style.maxHeight = '200px';
        resultsEl.style.overflowY = 'auto';

        let activeIndex = -1;

        const updateActiveItem = (newIndex: number) => {
            const items = resultsEl.querySelectorAll('.menu-item');
            items.forEach((item, index) => {
                if (index === newIndex) {
                    item.addClass('property-search-is-active');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.removeClass('property-search-is-active');
                }
            });
            activeIndex = newIndex;
        };

        const selectActiveItem = async () => {
            if (activeIndex >= 0 && activeIndex < filteredProperties.length) {
                const [name, info] = filteredProperties[activeIndex];
                this.plugin.settings[this.settingsParameter][rowIndex].property = name;
                this.plugin.settings[this.settingsParameter][rowIndex].type = info.type;
                this.plugin.settings[this.settingsParameter][rowIndex].value = undefined;
                await this.plugin.saveSettings();
                this.clearSearchResults(searchContainerEl);
                this.display(); // Re-render
            }
        };

        filteredProperties.forEach(([name, info], index) => {
            const itemEl = resultsEl.createDiv({ cls: 'menu-item' });
            const itemIcon = itemEl.createSpan({ cls: 'menu-item-icon' });
            updatePropertyIcon(itemIcon, info.type);
            itemEl.createSpan({ text: name });

            itemEl.addEventListener('mousedown', async (e) => {
                e.preventDefault();
                activeIndex = index;
                await selectActiveItem();
            });
        });

        searchContainerEl.addEventListener('keydown', async (e) => {
            const items = resultsEl.querySelectorAll('.menu-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                updateActiveItem((activeIndex + 1) % items.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                updateActiveItem((activeIndex - 1 + items.length) % items.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                await selectActiveItem();
            }
        });
    }

    clearSearchResults(searchContainerEl: HTMLElement) {
        const resultsEl = searchContainerEl.querySelector('.property-search-results');
        if (resultsEl) {
            resultsEl.remove();
        }
    }

    renderValueInput(containerEl: HTMLElement, propertyInfo: PropertyInfo | undefined, currentValue: any, index: number) {
        let returnComponent;
        containerEl.empty(); 

        if (!propertyInfo) {
             containerEl.setText('');
             containerEl.addClass('text-muted');
             return;
        }

        const type = propertyInfo.type;

        switch (type) {
            case 'number':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('Numeric Value')
                    .setValue(currentValue !== undefined && currentValue !== null ? String(currentValue) : '')
                    .onChange(async (value) => {
                        const numValue = value === '' ? undefined : parseFloat(value);
                        this.plugin.settings[this.settingsParameter][index].value = isNaN(numValue as number) ? undefined : numValue;
                        await this.plugin.saveSettings();
                    })
                    returnComponent.inputEl.type = 'number';
                break;
            case 'checkbox':
                returnComponent = containerEl.createDiv({ cls: 'tri-state-checkbox clickable-icon' });
                returnComponent.setAttribute('aria-label', 'Checkbox change state');
                returnComponent.setAttribute('role', 'checkbox');

                const updateCheckboxVisual = (state: boolean | undefined) => {
                    let iconName: string;
                    let ariaState: 'true' | 'false' | 'mixed';
                    if (state === true) {
                        iconName = 'check-square';
                        ariaState = 'true';
                    } else if (state === false) {
                        iconName = 'square';
                        ariaState = 'false';
                    } else { // undefined or null
                        iconName = 'minus-square';
                        ariaState = 'mixed';
                    }
                    setIcon(returnComponent, iconName);
                    returnComponent.setAttribute('aria-checked', ariaState);
                    returnComponent.dataset.state = String(state);
                };

                updateCheckboxVisual(currentValue);

                returnComponent.addEventListener('click', async () => {
                    let currentState = returnComponent.dataset.state;
                    let nextState: boolean | undefined;

                    if (currentState === 'false') {
                        nextState = true;
                    } else if (currentState === 'true') {
                        nextState = undefined; 
                    } else { 
                        nextState = false; 
                    }

                    this.plugin.settings[this.settingsParameter][index].value = nextState;
                    await this.plugin.saveSettings();

                    updateCheckboxVisual(nextState);
                });

                break;
            case 'date':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('YYYY-MM-DD')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings[this.settingsParameter][index].value = value || undefined;
                        await this.plugin.saveSettings();
                    })
                    returnComponent.inputEl.type = 'date';
                break;
            case 'datetime':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('YYYY-MM-DDTHH:mm')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings[this.settingsParameter][index].value = value || undefined;
                        await this.plugin.saveSettings();
                    })
                    returnComponent.inputEl.type = 'datetime-local';
                break;
            case 'aliases':
            case 'tags':
            case 'multitext':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('values (divided by comma)')
                    .setValue(Array.isArray(currentValue) ? currentValue.join(', ') : (currentValue || ''))
                    .onChange(async (value) => {
                        const arrayValue = value.split(',').map(s => s.trim()).filter(s => s);
                        this.plugin.settings[this.settingsParameter][index].value = arrayValue.length > 0 ? arrayValue : undefined;
                        await this.plugin.saveSettings();
                    });
                break;
            case 'text':
            default:
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('value')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings[this.settingsParameter][index].value = value || undefined;
                        await this.plugin.saveSettings();
                    });
                break;
            }
        if (type !== 'checkbox') {
            returnComponent.inputEl.style.backgroundColor = 'transparent'; // make it invisible
            returnComponent.inputEl.style.width = '100%';
            returnComponent.inputEl.style.border = 'none';
        }
        return returnComponent;
    }

    async updatePreview( rule, previewComponent) {
        if (this.activeFile) {
            let ruleResult;
            await this.app.fileManager.processFrontMatter(this.activeFile, async (frontmatter) => {
                // ruleResult = await executeRule('preview',this.app, this.plugin.settings, this.activeFile, '', rule, frontmatter);
                ruleResult = await executeRuleObject('preview',this.app, this.plugin.settings, this.activeFile, '', rule, frontmatter);
            },{'mtime':this.activeFile.stat.mtime});  

            switch (typeof ruleResult) {
                case 'object':
                    if (Array.isArray(ruleResult)) previewComponent.inputEl.value = ruleResult.toString();
                    break;
                default:
                    previewComponent.inputEl.value = ruleResult;
                    break;

            }
            // componentEl.setTooltip(componentEl.value);
        }
    }


    async display(): Promise<void> {
        const containerEl = this.container;
        containerEl.empty();

        this.knownProperties = await this.tools.fetchKnownProperties(this.app);
        
        this.propertiesListEl = containerEl.createDiv('properties-list');

        this.plugin.settings.rules.forEach((rule, index) => {
            this.renderPropertyRow(this.propertiesListEl, rule, index);
        });

        let activeFile = this.app.workspace.getActiveFile();
        this.updateFilterIndicator(activeFile, this.propertiesListEl);

        const addBtnContainer = containerEl.createDiv({ cls: 'setting-item-control' });
        addBtnContainer.style.justifyContent = 'right';
        new ButtonComponent(addBtnContainer)
            .setButtonText('Add Property')
            .setIcon('plus-circle')
            .setCta()
            .onClick(async () => {
                const defaultName = ''; //Object.keys(this.knownProperties)[0] || '';
                // this.plugin.settings[this.settingsParameter].push({ name: defaultName, value: undefined });
                this.plugin.settings[this.settingsParameter].push(Object.assign({}, DEFAULT_RULE_DEFINITION, {
                    id: randomUUID().toString(),
                }));
                await this.plugin.saveSettings();
                this.display();
            })
            .buttonEl.className='property-plus-button';
    }

    private updateFilterIndicator(activeFile, propertiesListEl: HTMLDivElement) {
        if (activeFile) {
            this.plugin.settings.rules.forEach((rule, index) => {
                const propertyRowEl = propertiesListEl.getElementsByClassName('property-setting-row')[index];
                const propertyLeftDiv = propertyRowEl.querySelector('.property-left-container');
                if (checkIfFileAllowed(activeFile, this.plugin.settings, rule)) {
                    propertyLeftDiv?.addClass('property-left-container-allowed');
                } else {
                    propertyLeftDiv?.removeClass('property-left-container-allowed');
                }
            });
        }
    }
}
