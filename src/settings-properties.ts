import { App, Plugin, PluginSettingTab, Setting, DropdownComponent, TextComponent, ButtonComponent, ToggleComponent, setIcon, apiVersion, TFile } from 'obsidian';
import { openDirectorySelectionModal, DirectorySelectionResult } from './directorySelectionModal';
import { versionString, FolderTagRuleDefinition, DEFAULT_RULE_DEFINITION, PropertyTypeInfo, ObsidianPropertyTypes, DEFAULT_FILTER_FILES_AND_FOLDERS, PropertyInfo} from './types';
import { getRuleFunctionById, useRuleOption, ruleFunctions, RuleFunction, executeRule, checkIfFileAllowed } from './rules';
import { AlertModal } from './alertBox';
import { randomUUID } from 'crypto';
import { codeEditorModal, codeEditorModalResult, openCodeEditorModal } from './editorModal';
import { copyFileSync } from 'fs';
import { ScriptingTools } from './tools';
import { updatePropertyIcon } from './uiElements';

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

    renderPropertyRow(containerEl: HTMLElement, rule: FolderTagRuleDefinition, index: number) {
        
        //const activeFile = this.app.workspace.getActiveFile();
        const ruleFn = getRuleFunctionById(rule.content);

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
                rule.value = await executeRule('preview',this.app, this.plugin.settings, this.activeFile, '', rule, frontmatter);
            },{'mtime':this.activeFile.stat.mtime}); // do not change the modify time.
        }
        const previewComponent = this.renderValueInput(valueContainer, currentPropertyInfo, rule.value, index);

        const propertyDevDropdown =  new DropdownComponent(middleContainer);
        propertyDevDropdown.selectEl.setAttribute('style','width:35%');
        propertyDevDropdown.addOption("", "Select a content");
        for (let ruleFunction of ruleFunctions) {
            if (ruleFunction.type.contains(rule.type)) {
                propertyDevDropdown.addOption(ruleFunction.id, ruleFunction.description);
            }
        }
        propertyDevDropdown.addOption("script", "JavaScript function (advanced)");
        propertyDevDropdown.setValue(rule.content);
        propertyDevDropdown.onChange(async (value) => {
            if (value !== '') {
                const ruleFunction = getRuleFunctionById(value);
                switch (ruleFunction?.ruleType) {
                    case 'script':
                        let oldOriginalCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source;
                        if ((rule.buildInCode !== '') && (rule.buildInCode !== oldOriginalCode)) {
                            const shouldProceed = await new AlertModal(
                                    this.app,
                                    'Overwrite existing code?',
                                    'I sees like you have custom code for this rule! Should this be overwritten by default code for this parameter?',
                                    'Yes', 'No'
                                ).openAndGetValue();
                            
                            if (shouldProceed.proceed) {
                                rule.buildInCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source;
                                rule.useCustomCode = false;
                            } else {
                                rule.buildInCode; // keep the existing code
                            }
                            await this.plugin.saveSettings();
                        } else {
                            rule.buildInCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source;
                            rule.useCustomCode = false;
                            await this.plugin.saveSettings();
                        }
                        break;
                    case 'buildIn.inputProperty':
                    case 'buildIn':
                        rule.buildInCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source;
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

    renderPropertyOptions(optionEL: HTMLDivElement, rule: FolderTagRuleDefinition, previewComponent: TextComponent) {
        optionEL.empty(); // clear previous options
        const ruleFn = getRuleFunctionById(rule.content);
        if (useRuleOption(ruleFn,'removeContent')) {
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
        if (useRuleOption(ruleFn,'ruleActive')) {
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
        if (useRuleOption(ruleFn,'modifyOnly')) {
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
            if (useRuleOption(ruleFn,'inputProperty')) {
                const ruleFunction = ruleFunctions.find(item => item.id === rule.content)
                if (ruleFunction && ruleFunction.inputProperty !== undefined) {
                    let inputPropertiesDropdown;
                    new Setting(optionEL)
                        .setName('Input Property')
                        .setDesc('Select a property as input')
                        .addDropdown(dropdown => {
                            inputPropertiesDropdown = dropdown;
                            dropdown
                            .setValue(rule.addContent)
                            .onChange(async (value) => {
                                if (value !== '') {
                                    rule.inputProperty = value;
                                    await this.plugin.saveSettings();
                                    this.updatePreview(rule, previewComponent);
                                }
                            })
                        });
                    Object.entries(this.knownProperties).forEach(item => {
                        inputPropertiesDropdown.addOption(item[1].name,item[1].name);
                    })
                    inputPropertiesDropdown.setValue(rule.inputProperty);
                }
            }
            if (useRuleOption(ruleFn,'addPrefix')) {
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
            if (useRuleOption(ruleFn,'spaceReplacement')) {
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
            if (useRuleOption(ruleFn,'specialCharacterReplacement')) {
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
            if (useRuleOption(ruleFn,'convertToLowerCase')) {
                new Setting(optionEL)
                    .setName('Convert to lowercase')
                    .setDesc('Convert values to lowercase')
                    .addToggle(toggle => toggle
                        .setValue(rule.lowercaseTags)
                        .onChange(async (value) => {
                            rule.lowercaseTags = value;
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        }));
            }
            if (useRuleOption(ruleFn,'resultAsLink')) {
                new Setting(optionEL)
                    .setName('Result as Link')
                    .setDesc('Format Result as Link')
                    .addToggle(toggle => toggle
                        .setValue(rule.asLink)
                        .onChange(async (value) => {
                            rule.asLink = value;
                            await this.plugin.saveSettings();
                            this.updatePreview(rule, previewComponent);
                        })
                    );
            }
        }
        if (rule.type === 'text' || rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
            if (useRuleOption(ruleFn,'addContent')) {
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
        if (useRuleOption(ruleFn,'excludeFolders')) {
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
        if (useRuleOption(ruleFn,'includeFolders')) {
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
        if (useRuleOption(ruleFn,'script')) {
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
        const ruleFunction = getRuleFunctionById(rule.content);
        if (ruleFunction && typeof ruleFunction.configTab ==='function') {
            ruleFunction.configTab(optionEL, rule, this, previewComponent);
        }
    }

    getOptionConfig(ruleId:string,propertyId:string){
        const rule = this.plugin.settings.rules.find((rule: FolderTagRuleDefinition) => rule.id === ruleId);
        if (rule) {
            const optionConfig = rule.optionsConfig[ruleId]
            if (optionConfig[propertyId]) {
                return optionConfig[propertyId];
            }
        }
        return undefined;
    }

    setOptionConfig(ruleId:string,propertyId:string,config:any){
        const rule = this.plugin.settings.rules.find((rule: FolderTagRuleDefinition) => rule.id === ruleId);
        if (rule) {
            if (!rule.optionsConfig) rule.optionsConfig = {}
            if (!rule.optionsConfig[ruleId]) rule.optionsConfig[ruleId] = {};

            rule.optionsConfig[ruleId][propertyId] = config;
            this.plugin.saveSettings();
        }
    }

    setOptionConfigDefaults(ruleId:string, defaults:any){
        const rule = this.plugin.settings.rules.find((rule: FolderTagRuleDefinition) => rule.id === ruleId);
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
                ruleResult = await executeRule('preview',this.app, this.plugin.settings, this.activeFile, '', rule, frontmatter);
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
