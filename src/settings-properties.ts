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
import { DEBUG, logger, WARNING } from './Log';
import { MultiPropertySetting } from './uiMultiPropertySetting';
import { TreeHierarchyData, TreeHierarchySortableSettings, ROOT_FOLDER, TreeHierarchyRow } from './uiTreeHierarchySortableSettings';
import { MarkdownHelpModal } from './uiMarkdownHelpModal';

export class RulesTable extends PluginSettingTab {
    plugin: any;
    knownProperties: Record<string, PropertyInfo> = {}; 
    container: HTMLDivElement;
    propertiesListEl!: HTMLDivElement;
    settings: TreeHierarchyData;
    tools: ScriptingTools;
    activeFile: TFile | null = null;

    constructor(app: App, plugin: any, container: HTMLDivElement, settings: TreeHierarchyData) {
        super(app, plugin);
        this.plugin = plugin;
        this.container = container;
        this.settings = settings;
        this.tools = new ScriptingTools(app, plugin);
        this.activeFile = this.app.workspace.getActiveFile();

    }

    // Helper to render one rule

    renderPropertyRow(containerEl: HTMLElement, rule: FrontmatterAutomateRuleSettings ) {
        
        //const activeFile = this.app.workspace.getActiveFile();

        const rowEl = containerEl.createDiv({ cls: 'property-setting-row setting-item' });
        rowEl.style.width = '100%'; // make sure the row takes full width
        rowEl.id = rule.id;
        const controlEl = rowEl.createDiv({ cls: 'setting-item-control' }); 
        controlEl.style.width = '100%';
        controlEl.style.display = 'flex';
        controlEl.style.gap = '0px';
        const leftContainer = controlEl.createDiv({ cls: 'property-left-container' });
        const iconEl = leftContainer.createSpan({ cls: 'property-icon setting-item-icon' }); 
        setIcon(iconEl, 'hash'); // Standard-Icon


        const searchContainer = leftContainer.createDiv({ cls: 'property-search-container' });

        const nameInput = new TextComponent(searchContainer)
            .setPlaceholder('Select property...')
            .setValue(rule.property || '')
            .onChange(async (value) => {
                this.renderSearchResults(searchContainer, value, rule);
            })

        nameInput.inputEl.style.border = 'none'; // make it invisible
        nameInput.inputEl.addEventListener('focus', () => {
            this.renderSearchResults(searchContainer, nameInput.getValue(), rule);
        });
        nameInput.inputEl.addEventListener('input', () => {
            this.renderSearchResults(searchContainer, nameInput.getValue(), rule);
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
        const valueContainer = middleContainer.createDiv({ cls: 'FMA-property-value-container' });
        if (this.activeFile) {
            this.app.fileManager.processFrontMatter(this.activeFile, async (frontmatter) => {
                rule.value = await executeRuleObject('preview',this.app, this, this.plugin.settings, this.activeFile, '', rule, frontmatter); //TODO: implement using only updatePerview
            },{'mtime':this.activeFile.stat.mtime}); // do not change the modify time.
        }
        const previewComponent = this.renderValueInput(valueContainer, currentPropertyInfo, rule.value, rule);
        this.updatePreview(rule, previewComponent);

        const propertyDevDropdown =  new DropdownComponent(middleContainer);
        propertyDevDropdown.selectEl.style.minWidth = '35%'
        propertyDevDropdown.selectEl.style.maxWidth = '50%';
        propertyDevDropdown.addOption("", "Select a content");

        // add rule functions to dropdown
        rulesManager.getRulesByType('buildIn', rule.type).forEach(rule => {
            propertyDevDropdown.addOption(rule.id, rule.name);
        });

        // propertyDevDropdown.addOption("script", "JavaScript function (advanced)");
        propertyDevDropdown.setValue(rule.content);
        propertyDevDropdown.onChange(async (value) => {
            if (value !== '') {
                const ruleFunction = rulesManager.getRuleById(value);
                switch (ruleFunction?.ruleType) {
                    case 'script':
                    case 'buildIn.inputProperty':
                    case 'buildIn':
                        //rule.buildInCode = rulesManager.getSource(value) || rulesManager.getSource('default') || '';
                        let oldOriginalCode = rulesManager.getSource(value) || rulesManager.getSource('default') || '';
                        if ((rule.buildInCode !== '') && (rule.buildInCode !== oldOriginalCode)) {
                            const shouldProceed = await new AlertModal(
                                    this.app,
                                    'Overwrite existing code?',
                                    'I sees like you have custom code for this rule! Should this be overwritten by default code for this parameter?',
                                    'Yes', 'No'
                                ).openAndGetValue();
                            
                            if (shouldProceed.proceed) {
                                rule.buildInCode = rulesManager.getSource(value) || rulesManager.getSource('default') || '';
                                rule.useCustomCode = false;
                            } else {
                                rule.buildInCode; // keep the existing code
                            }
                            await this.plugin.saveSettings();
                        } else {
                            rule.buildInCode = rulesManager.getSource(value) || rulesManager.getSource('default') || '';
                            rule.useCustomCode = false;
                            await this.plugin.saveSettings();
                        }
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
        const leftContainerEl = controlEl.createDiv({ cls: 'FMA-property-right-container' });
        new ButtonComponent(leftContainerEl)
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
        /*
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
        deleteButtonContainer.style.marginLeft = 'auto'; 
        */
        controlEl.style.display = 'flex';
        controlEl.style.alignItems = 'center';
        controlEl.style.justifyContent = 'space-between';
        controlEl.style.width = '100%';

        leftContainer.style.display = 'flex';
        leftContainer.style.alignItems = 'center';
        leftContainer.style.minWidth = '100px'; 
        iconEl.style.marginRight = '8px';

        searchContainer.style.position = 'relative'; 
        //searchContainer.style.flexGrow = '1';

        //valueContainer.style.flexGrow = '4'; 


        let optionEL: HTMLDivElement;
        if (containerEl.parentElement) {
            optionEL = containerEl.parentElement.createDiv({ cls: 'property-options-container' });
            optionEL.id = rule.id;
            optionEL.style.display = 'none';
        } else {
            // fallback: create in containerEl if parentElement is null
            optionEL = containerEl.createDiv({ cls: 'property-options-container' });
            optionEL.id = rule.id;
            optionEL.style.display = 'none';
        }
    }

    renderPropertyOptions(optionEL: HTMLDivElement, rule: FrontmatterAutomateRuleSettings, previewComponent: HTMLDivElement | TextComponent | undefined) {
        if (!(previewComponent instanceof TextComponent)) return;
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
            let formatRule = rulesManager.getRuleById(rule.formatter);
            const formatterRules = rulesManager.getRulesByType('formatter') || [];
            let formatOptionsButton: any;
            if (ruleFn.useRuleOption('convertToLowerCase')) {
                const multiProp = new MultiPropertySetting(optionEL)
                    .setName("Format output")
                    .setDesc("Format output using selected options.")
                    .setOptions(formatterRules)
                    .setValue(rule.formatters || ['toOriginal'])
                    .onChange((formatter) => {
                        rule.formatters = formatter;
                        formatRule = rulesManager.getRuleById(rule.formatter);
                        this.updatePreview(rule, previewComponent);
                    });
                multiProp.addExtraButton((setting, idx) => {
                        setting.addExtraButton(btn => {
                            btn.setIcon('gear')
                            .setTooltip('Options')
                            .setDisabled(!rulesManager.getRuleById(rule?.formatters?.[idx] ?? "toOriginal")?.hasOwnConfigTab() || false)
                            .onClick(() => {
                                converterOptionDiv.style.display = 'block';
                                converterOptionDiv.empty(); // clear previous options
                                formatRule = rulesManager.getRuleById(rule?.formatters?.[idx] ?? "toOriginal");
                                formatRule?.configTab(converterOptionDiv, rule, this, previewComponent);
                            });
                            multiProp.styleDisabled(btn, !rulesManager.getRuleById(rule?.formatters?.[idx] ?? "toOriginal")?.hasOwnConfigTab() || false);
                        });
                    });
            }
            let converterOptionDiv = optionEL.createDiv({ cls: 'property-converter-option' });
            converterOptionDiv.style.display = 'none';
            converterOptionDiv.style.marginLeft = '20px';
            
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
                                    logger.log(DEBUG,rule.exclude);
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
                                logger.log(DEBUG,rule.include);
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
                        logger.log(
                            DEBUG,
                            `Opening code editor for rule ${rule.id} with content ${rule.content}, file: ${this.activeFile?.path}`,
                            this.activeFile,
                            this.activeFile ? this.app.metadataCache.getFileCache(this.activeFile) || {} : {}
                        );
                        openCodeEditorModal(
                            this.app,
                            this.plugin,
                            rule.buildInCode,
                            rule.typeProperty?.type || 'text',
                            this.activeFile,
                            this.activeFile ? this.app.metadataCache.getFileCache(this.activeFile)?.frontmatter || {} : {},
                            (result: codeEditorModalResult | null) => {
                                if (!result) return;
                                rule.buildInCode = result.code;
                                rule.useCustomCode = true;
                                button.setCta();
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

    renderSearchResults(searchContainerEl: HTMLElement, searchTerm: string, payload: any) {
        
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
                payload.property = name;
                payload.type = info.type;
                payload.value = undefined; // Reset value
                //this.plugin.settings[this.settingsParameter][rowIndex].property = name;
                //this.plugin.settings[this.settingsParameter][rowIndex].type = info.type;
                //this.plugin.settings[this.settingsParameter][rowIndex].value = undefined;
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

    renderValueInput(containerEl: HTMLElement, propertyInfo: PropertyInfo | undefined, currentValue: any, payload: any) {
        let returnComponent: any;

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
                        payload.value = isNaN(numValue as number) ? undefined : numValue;
                        //this.plugin.settings[this.settingsParameter][index].value = isNaN(numValue as number) ? undefined : numValue;
                        await this.plugin.saveSettings();
                    })
                    returnComponent.inputEl.type = 'number';
                break;
            case 'checkbox':
                returnComponent = containerEl.createDiv({ cls: 'FMA-tri-state-checkbox' });
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
                    payload.value = nextState;
                    //this.plugin.settings[this.settingsParameter][index].value = nextState;
                    await this.plugin.saveSettings();

                    updateCheckboxVisual(nextState);
                });
                break;
            case 'date':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('YYYY-MM-DD')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        payload.value = value || undefined;
                        //this.plugin.settings[this.settingsParameter][index].value = value || undefined;
                        await this.plugin.saveSettings();
                    })
                    returnComponent.inputEl.type = 'date';
                break;
            case 'datetime':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('YYYY-MM-DDTHH:mm')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        payload.value = value || undefined;
                        //this.plugin.settings[this.settingsParameter][index].value = value || undefined;
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
                        payload.value = arrayValue.length > 0 ? arrayValue : undefined;
                        //this.plugin.settings[this.settingsParameter][index].value = arrayValue.length > 0 ? arrayValue : undefined;
                        await this.plugin.saveSettings();
                    });
                break;
            case 'text':
            default:
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('value')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        payload.value = value || undefined;
                        //this.plugin.settings[this.settingsParameter][index].value = value || undefined;
                        await this.plugin.saveSettings();
                    });
                break;
            }
            if (type !== 'checkbox') {
                returnComponent.inputEl.addClass('FMA-property-value-input');
            } else {
                returnComponent.addClass('FMA-property-value-input');
            }
            return returnComponent;
   
    }

    async updatePreview(rule: FrontmatterAutomateRuleSettings, previewComponent: any) {
        if (this.activeFile) {
            let ruleResult:any;
            await this.app.fileManager.processFrontMatter(this.activeFile, async (frontmatter) => {
                // ruleResult = await executeRule('preview',this.app, this.plugin.settings, this.activeFile, '', rule, frontmatter);
                ruleResult = await executeRuleObject('preview',this.app, this, this.plugin.settings, this.activeFile, '', rule, frontmatter);
            },{'mtime':this.activeFile.stat.mtime});  

            switch (typeof ruleResult) {
                case 'object':
                    if (Array.isArray(ruleResult)) previewComponent.inputEl.value = ruleResult.toString();
                    break;
                default:
                    if (previewComponent?.inputEl) previewComponent.inputEl.value = ruleResult;
                    break;

            }
            // componentEl.setTooltip(componentEl.value);
        }
    }


    async display(): Promise<void> {
        const containerEl = this.container;
        containerEl.empty();

        this.knownProperties = await this.tools.fetchKnownProperties(this.app);
        
        this.propertiesListEl = containerEl; //.createDiv('properties-list');

        //this.plugin.settings.folderConfig.rows = [];
        const folderList = new TreeHierarchySortableSettings(
            containerEl,
            this.plugin.settings.folderConfig,
            (row, rowEl) => {
                // Render row content here
                this.renderPropertyRow(rowEl, row.payload);
            }
            )
            .setTitle('Rules')
            .setDescription('add rules to selected frontmatter properties')
            .onChange((data) => {
                this.plugin.settings.folderConfig = data;
                this.updateFilterIndicator(this.activeFile, this.propertiesListEl);
                this.plugin.saveSettings();
            })
            .onRendered(() => {
                this.updateFilterIndicator(this.activeFile, this.propertiesListEl);
            })
            .onRowCreated(async (row) => {
                const defaultName = ''; //Object.keys(this.knownProperties)[0] || '';
                row.payload = Object.assign({}, DEFAULT_RULE_DEFINITION, {
                    id: randomUUID().toString(),
                });
                await this.plugin.saveSettings();
            })
            .onDeleteBt(async () => {
                const shouldProceed = await new AlertModal(
                    this.app,
                    'Erase all Rules?',
                    'Do you really like to erase ALL rules?',
                    'Yes', 'No'
                ).openAndGetValue();
                            
                if (shouldProceed.proceed) {
                    this.plugin.folderConfig.rows = [];
                    this.plugin.saveSettings();
                }
            })
            .addExtraButtonToHeader((el) => {
                el.addExtraButton(btn => btn
                    .setIcon("circle-help")
                    .onClick(async () => {
                        let markdown = "Could not load help from GitHub.";
                        //markdown = await fetchMarkdownFromGitHub("https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md");
                            //markdown = await readPluginDocFile("README.md");
                        new MarkdownHelpModal(this.app, this.plugin, markdown, "README.md").open();
                    })
                );
            });
        if (this.plugin.settings.folderConfig.rows.length === 0 && this.plugin.settings.rules.length > 0) {
            // If there are rules but no folder config, create default rows
            this.plugin.settings.rules.forEach((rule: FrontmatterAutomateRuleSettings) => {
                const keywords : string[] = [];
                keywords.push(rule.content);
                folderList.addRow(ROOT_FOLDER, [], rule);
            });
        }
        /*
        this.plugin.settings.rules.forEach((rule: FrontmatterAutomateRuleSettings, index: number) => {
            this.renderPropertyRow(this.propertiesListEl, rule, index);
        });
        */
        let activeFile = this.app.workspace.getActiveFile();
        this.updateFilterIndicator(activeFile, this.propertiesListEl);
        /*
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
        */
    }

    private updateFilterIndicator(activeFile:TFile | null, propertiesListEl: HTMLDivElement) {
        if (activeFile) { //TODO: fix for new sortable Table
            this.plugin.settings.folderConfig.rows.forEach((row: TreeHierarchyRow, index: number) => {
                const rule = row.payload as FrontmatterAutomateRuleSettings;
                const propertyRowElements = propertiesListEl.getElementsByClassName('property-setting-row');
                const propertyRowEl = Array.from(propertyRowElements).filter(el => el.id === rule.id)[0] as HTMLDivElement;
                if (!propertyRowEl) {
                    return; // Skip if no row found for this rule
                }
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
