import { App, Plugin, PluginSettingTab, Setting, DropdownComponent, TextComponent, ButtonComponent, ToggleComponent, setIcon, apiVersion } from 'obsidian';
import { openDirectorySelectionModal, DirectorySelectionResult } from './directorySelectionModal';
import { versionString, FolderTagRuleDefinition, DEFAULT_RULE_DEFINITION, PropertyTypeInfo, DEFAULT_FILTER_FILES_AND_FOLDERS} from './types';
import { getRuleFunctionById, ruleFunctions, RuleFunction, executeRule } from './rules';
import { AlertModal } from './alertBox';
import { randomUUID } from 'crypto';

export type PropertyInfo = {
    name: string;
    type: string;
    count?: number;
};

export class RulesTable extends PluginSettingTab {
    plugin: any;
    knownProperties: Record<string, PropertyInfo> = {}; // Cache für gefundene Properties
    container: HTMLDivElement;
    settingsParameter: string;

    constructor(app: App, plugin: any, container: HTMLDivElement, settingsParameter: string) {
        super(app, plugin);
        this.plugin = plugin;
        this.container = container;
        this.settingsParameter = settingsParameter;
    }

    // Funktion zum Abrufen und Speichern der bekannten Properties (async)
    async fetchKnownProperties() {
        this.knownProperties = await this.app.metadataCache.getAllPropertyInfos();
        this.knownProperties = Object.fromEntries(
            Object.entries(this.knownProperties).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );
        console.log(this.knownProperties);
    }

    // Helper zum Rendern EINER Eigenschaftszeile
    renderPropertyRow(containerEl: HTMLElement, rule: FolderTagRuleDefinition, index: number) {
        
        const activeFile = this.app.workspace.getActiveFile();

        // Verwende createDiv statt Setting für volle Layout-Kontrolle und kompakteres Aussehen
        const rowEl = containerEl.createDiv({ cls: 'property-setting-row setting-item' }); // Füge 'setting-item' für Standard-Styling hinzu
        const controlEl = rowEl.createDiv({ cls: 'setting-item-control' }); // Container für alle Controls
        controlEl.style.gap = '0px';
        // --- Linker Teil: Icon & Durchsuchbare Eigenschaftsauswahl ---
        const leftContainer = controlEl.createDiv({ cls: 'property-left-container' });
        const iconEl = leftContainer.createSpan({ cls: 'property-icon setting-item-icon' }); // Standard-Icon-Klasse
        setIcon(iconEl, 'hash'); // Standard-Icon

        // Container für das Suchfeld und die Ergebnisliste
        const searchContainer = leftContainer.createDiv({ cls: 'property-search-container' });

        // Textfeld für die Suche/Anzeige des aktuellen Namens
        const nameInput = new TextComponent(searchContainer)
            .setPlaceholder('Select property...')
            .setValue(rule.property || '')
            .onChange(async (value) => {
                // Direkte Änderung hier nicht speichern, Auswahl erfolgt über Ergebnisliste
                this.renderSearchResults(searchContainer, value, index);
            });

        // Event Listener für Fokus und Input, um Ergebnisse anzuzeigen/filtern
        nameInput.inputEl.addEventListener('focus', () => {
            this.renderSearchResults(searchContainer, nameInput.getValue(), index);
        });
        nameInput.inputEl.addEventListener('input', () => {
            this.renderSearchResults(searchContainer, nameInput.getValue(), index);
        });
        // Schließe die Ergebnisliste bei Klick außerhalb (vereinfacht)
         nameInput.inputEl.addEventListener('blur', (event) => {
             // Kleine Verzögerung, damit Klick auf Ergebnisliste noch funktioniert
             setTimeout(() => {
                // Prüfen ob das neue Fokus-Element Teil der Ergebnisliste ist
                 const relatedTarget = event.relatedTarget as Node;
                 const resultsEl = searchContainer.querySelector('.property-search-results');
                 if (!resultsEl || !resultsEl.contains(relatedTarget)) {
                     this.clearSearchResults(searchContainer);
                 }
             }, 100);
         });


        // Setze initiales Icon basierend auf gespeichertem Namen
        const currentPropertyInfo = this.knownProperties[rule.property];
        if (currentPropertyInfo) {
            this.updatePropertyIcon(iconEl, currentPropertyInfo.type);
        } else if (rule.property) {
            setIcon(iconEl, 'alert-circle'); // Warn-Icon, falls Name ungültig
        }

        // --- Mittlerer Teil: Werte-Eingabefeld ---
        const middleContainer = controlEl.createDiv({ cls: 'property-middle-container' });
        const valueContainer = middleContainer.createDiv({ cls: 'property-value-container' });
        if (activeFile) {
            this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
                rule.value = executeRule(this.app, this.plugin.settings, activeFile, '', rule, frontmatter);
            },{'mtime':activeFile.stat.mtime}); // do not change the modify time.
        }
        let previewComponent = this.renderValueInput(valueContainer, currentPropertyInfo, rule.value, index);

        const propertyDevDropdown =  new DropdownComponent(middleContainer);
            propertyDevDropdown.selectEl.setAttribute('style','width:50%');
            propertyDevDropdown.addOption("", "Select a content");
            for (let ruleFunction of ruleFunctions) {
                console.log(rule.type);
                if (ruleFunction.type.contains(rule.type)) {
                    propertyDevDropdown.addOption(ruleFunction.id, ruleFunction.description);
                }
            }
            propertyDevDropdown.addOption("script", "JavaScript script");
            propertyDevDropdown.setValue(rule.content);
            propertyDevDropdown.onChange(async (value) => {
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
                            //cmEditor?.setValue(jsCode);
                            await this.plugin.saveSettings();
                        } else {
                            jsCode = rule.buildInCode = getRuleFunctionById(value)?.source || ruleFunctions[0].source;
                            //cmEditor?.setValue(jsCode);
                            await this.plugin.saveSettings();
                        }
                    } else {
                        //cmEditor?.setValue(rule.jsCode!=='' ? rule.jsCode : ruleFunctions[0].source);
                    }
                    rule.content = value;
                    //ruleOptionsDiv.style.display = `${(rule.content === 'script') ? 'flex' : 'none'}`;
                    //showJsFunctionButton(rule.content);
                    await this.plugin.saveSettings();
                    this.updatePreview(activeFile, rule, previewComponent.inputEl);
                }
            });
            //ruleOptionsDiv.style.display = `${(rule.content === 'script') && (rule.showContent) ? 'flex' : 'none'}`;

        new ButtonComponent(middleContainer)
        .setIcon('gear')
        .setTooltip('settings')
        .setClass('property-icon-button')
        .onClick(async () => {
            let settingsContainers = containerEl.getElementsByClassName('property-options-container');
            for (let container of settingsContainers) {
                if (container.getAttribute('id') !== rule.id) container.setAttribute('style','display: none;');
            }
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
        leftContainer.style.minWidth = '200px'; 
        iconEl.style.marginRight = '8px';

        searchContainer.style.position = 'relative'; 
        searchContainer.style.flexGrow = '1';

        valueContainer.style.flexGrow = '2'; 

        deleteButtonContainer.style.marginLeft = 'auto'; 

        const optionEL = containerEl.createDiv({ cls: 'property-options-container' }); // options container
        optionEL.id = rule.id;
        optionEL.style.display = 'none';

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

        if (rule.type === 'text' || rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {

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
                                this.updatePreview(activeFile, rule, previewComponent.inputEl);
                            }
                        })
                    });
                Object.entries(this.knownProperties).forEach(item => {
                    inputPropertiesDropdown.addOption(item[1].name,item[1].name);
                })
                inputPropertiesDropdown.setValue(rule.inputProperty);
            }

            if (rule.type === 'tags' || rule.type === 'aliases') {
                new Setting(optionEL)
                .setName('Prefix')
                .setDesc('Optional prefix to add before the content')
                .addText(text => text
                    .setPlaceholder('prefix/')
                    .setValue(rule.prefix)
                    .onChange(async (value) => {
                        rule.prefix = value;
                        await this.plugin.saveSettings();
                        this.updatePreview(activeFile, rule, previewComponent.inputEl);
                    }));
            }
            
            
            new Setting(optionEL)
            .setName('Space replacement')
            .setDesc('Character to replace spaces in folder names (suggested: "_")')
            .addText(text => text
                .setPlaceholder('_')
                .setValue(rule.spaceReplacement)
                .onChange(async (value) => {
                    rule.spaceReplacement = value;
                    await this.plugin.saveSettings();
                    this.updatePreview(activeFile, rule, previewComponent.inputEl);
                }));

            new Setting(optionEL)
                .setName('Special character replacement')
                .setDesc('Character to replace special characters (suggested: "-") - preserves letters with diacritics')
                .addText(text => text
                    .setPlaceholder('-')
                    .setValue(rule.specialCharReplacement)
                    .onChange(async (value) => {
                        rule.specialCharReplacement = value;
                        await this.plugin.saveSettings();
                        this.updatePreview(activeFile, rule, previewComponent.inputEl);
                    }));

            new Setting(optionEL)
                .setName('Convert to lowercase')
                .setDesc('Convert values to lowercase')
                .addToggle(toggle => toggle
                    .setValue(rule.lowercaseTags)
                    .onChange(async (value) => {
                        rule.lowercaseTags = value;
                        await this.plugin.saveSettings();
                        this.updatePreview(activeFile, rule, previewComponent.inputEl);
                    }));

            new Setting(optionEL)
                .setName('Result as Link')
                .setDesc('Format Result as Link')
                .addToggle(toggle => toggle
                    .setValue(rule.asLink)
                    .onChange(async (value) => {
                        rule.asLink = value;
                        await this.plugin.saveSettings();
                        this.updatePreview(activeFile, rule, previewComponent.inputEl);
                    })
                );
        }
        if (rule.type === 'text' || rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
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
                            this.updatePreview(activeFile, rule, previewComponent.inputEl);
                        }
                    })
                );
        }
        new Setting(optionEL)
        .setName('Exclude Files and Folders from this rule')
        .setDesc(`Currently ${this.plugin.settings.exclude.selectedFolders.length} folders and ${this.plugin.settings.exclude.selectedFiles.length} files will be ${this.plugin.settings.exclude.mode}d.`)
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
                        'exclude',
                        rule.exclude?.display || 'folders',
                        false, // include, exclude option hidden
                        (result: DirectorySelectionResult | null) => {
                            if (!result) return;
                            if (!rule.exclude) {
                                rule.exclude=Object.assign({}, DEFAULT_FILTER_FILES_AND_FOLDERS, {
                                    mode : 'include',
                                });
                            };
                            rule.exclude.selectedFolders = result.folders;
                            rule.exclude.selectedFiles = result.files;
                            rule.exclude.display = result.display;
                            this.plugin.saveSettings(); 
                            //this.display();
                        }
                    );
                });
        });          

        new Setting(optionEL)
        .setName('Include Files and Folders for this rule ')
        .setDesc(`Currently ${this.plugin.settings.include.selectedFolders.length} folders and ${this.plugin.settings.include.selectedFiles.length} files will be ${this.plugin.settings.include.mode}d even when in excluded Folders.`)
        .addButton(button => {
            button
                .setIcon('folder-check')
                .setButtonText('Include')
                .setCta() // Makes the button more prominent
                .onClick(() => {
                    openDirectorySelectionModal(
                        this.app,
                        rule.include?.selectedFolders || [],
                        rule.include?.selectedFiles || [],
                        'include',
                        rule.include?.display || 'folders',
                        false, // include, include option hidden
                        (result: DirectorySelectionResult | null) => {
                            if (!result) return;
                            if (!rule.include) {
                                rule.include = Object.assign({}, DEFAULT_FILTER_FILES_AND_FOLDERS, {
                                    mode : 'include',
                                });
                            };
                            rule.include.selectedFolders = result.folders;
                            rule.include.selectedFiles = result.files;
                            rule.include.display = result.display;
                            this.plugin.saveSettings(); 
                            //this.display();
                        }
                    );
                });
        });
        new Setting(optionEL)
            .setName('Script')
            .setDesc('edit the script for own modifications')
            .addButton(button => button
                .setButtonText('JS Editor')
                .onClick(() => {
                })
            )
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
        resultsEl.style.width = 'calc(100% + 20px)';
        resultsEl.style.zIndex = '10';
        resultsEl.style.maxHeight = '200px';
        resultsEl.style.overflowY = 'auto';

        filteredProperties.forEach(([name, info]) => {
            const itemEl = resultsEl.createDiv({ cls: 'menu-item' });
            const itemIcon = itemEl.createSpan({ cls: 'menu-item-icon' });
            this.updatePropertyIcon(itemIcon, info.type);
            itemEl.createSpan({ text: name });

            itemEl.addEventListener('mousedown', async (e) => {
                e.preventDefault(); 
                this.plugin.settings[this.settingsParameter][rowIndex].property = name;
                this.plugin.settings[this.settingsParameter][rowIndex].type = info.type;
                this.plugin.settings[this.settingsParameter][rowIndex].value = undefined;
                await this.plugin.saveSettings();
                this.clearSearchResults(searchContainerEl);
                this.display(); // Neu rendern
            });
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
                    .setPlaceholder('Zahlenwert')
                    .setValue(currentValue !== undefined && currentValue !== null ? String(currentValue) : '')
                    .onChange(async (value) => {
                        const numValue = value === '' ? undefined : parseFloat(value);
                        this.plugin.settings[this.settingsParameter][index].value = isNaN(numValue as number) ? undefined : numValue;
                        await this.plugin.saveSettings();
                    })
                    returnComponent.inputEl.type = 'number';
                break;
            case 'checkbox':
                const checkboxEl = containerEl.createDiv({ cls: 'tri-state-checkbox clickable-icon' });
                returnComponent = checkboxEl;
                checkboxEl.setAttribute('aria-label', 'Checkbox Status ändern');
                checkboxEl.setAttribute('role', 'checkbox');

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
                    setIcon(checkboxEl, iconName);
                    checkboxEl.setAttribute('aria-checked', ariaState);
                    checkboxEl.dataset.state = String(state);
                };

                updateCheckboxVisual(currentValue);

                checkboxEl.addEventListener('click', async () => {
                    let currentState = checkboxEl.dataset.state;
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
            case 'tags':
            case 'multitext':
                returnComponent = new TextComponent(containerEl)
                    .setPlaceholder('Werte (kommagetrennt)')
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
                    .setPlaceholder('Wert')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings[this.settingsParameter][index].value = value || undefined;
                        await this.plugin.saveSettings();
                    });
                break;
        }
        return returnComponent;
    }

    updatePropertyIcon(iconEl: HTMLElement, type: string | undefined) {
        let iconName = 'hash';
        switch (type) {
            case 'text': iconName = 'align-left'; break;
            case 'number': iconName = 'binary'; break;
            case 'multitext': iconName = 'list'; break;
            case 'date': iconName = 'calendar'; break;
            case 'datetime': iconName = 'clock'; break;
            case 'checkbox': iconName = 'check-square'; break;
            case 'tags': iconName = 'tags'; break;
            case 'aliases': iconName = 'forward'; break;
     
            default: iconName = 'help-circle';
        }
        setIcon(iconEl, iconName);
    }

    async updatePreview(activeFile, rule, componentEl) {
        if (activeFile) {
            let ruleResult;
            await this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
                ruleResult = executeRule(this.app, this.plugin.settings, activeFile, '', rule, frontmatter);
            },{'mtime':activeFile.stat.mtime});  

            switch (typeof ruleResult) {
                case 'object':
                    if (Array.isArray(ruleResult)) componentEl.value = ruleResult.toString();
                    break;
                default:
                    componentEl.value = ruleResult;
                    break;

            }
            // componentEl.setTooltip(componentEl.value);
        }
    }

    async display(): Promise<void> {
        const containerEl = this.container;
        containerEl.empty();

        await this.fetchKnownProperties();

        const propertiesListEl = containerEl.createDiv('properties-list');

        this.plugin.settings.rules.forEach((propConfig, index) => {
            this.renderPropertyRow(propertiesListEl, propConfig, index);
        });

        const addBtnContainer = containerEl.createDiv({ cls: 'setting-item-control' });
        addBtnContainer.style.justifyContent = 'right';
        new ButtonComponent(addBtnContainer)
            .setButtonText('Eigenschaft hinzufügen')
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
}