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
            .setPlaceholder('Eigenschaft suchen...')
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
        if (activeFile) rule.value = executeRule(this.app, this.plugin.settings, activeFile, '', rule);
        let returnComponent = this.renderValueInput(valueContainer, currentPropertyInfo, rule.value, index);

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
                    if (activeFile) {
                        let ruleResult = executeRule(this.app, this.plugin.settings, activeFile, '', rule);
                        console.log(`Rule result "${ruleResult}"`,activeFile,ruleResult);
                        switch (typeof ruleResult) {
                            case 'object':
                                returnComponent.inputEl.value = ruleResult.toString();
                                break;
                            default:
                                returnComponent.inputEl.value = ruleResult;
                                break;

                        }
                    }
                    //ruleOptionsDiv.style.display = `${(rule.content === 'script') ? 'flex' : 'none'}`;
                    //showJsFunctionButton(rule.content);
                    await this.plugin.saveSettings();
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
        new Setting(optionEL)
            .setName('Result as Link')
            .setDesc('Format Result as Link')
            .addToggle(toggle => toggle
                .setValue(rule.asLink)
                .onChange(async (value) => {
                    rule.asLink = value;
                    await this.plugin.saveSettings();
                })
            );
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
                                rule.include=Object.assign({}, DEFAULT_FILTER_FILES_AND_FOLDERS, {
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

    // Helper zum Rendern der Suchergebnisliste
    renderSearchResults(searchContainerEl: HTMLElement, searchTerm: string, rowIndex: number) {
        this.clearSearchResults(searchContainerEl); // Alte Ergebnisse entfernen

        const filteredProperties = Object.entries(this.knownProperties)
            .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filteredProperties.length === 0 && searchTerm) {
            // Optional: Hinweis "Keine Ergebnisse" anzeigen
            return;
        }
        if (filteredProperties.length === 0 && !searchTerm) {
             // Nicht anzeigen wenn Suchfeld leer ist und keine Ergebnisse (z.B. initial)
             return;
        }


        const resultsEl = searchContainerEl.createDiv({ cls: 'property-search-results menu' }); // Verwende 'menu' Klasse für Styling
        resultsEl.style.position = 'absolute';
        resultsEl.style.top = '100%'; // Direkt unter dem Input
        resultsEl.style.left = '0';
        resultsEl.style.width = 'calc(100% + 20px)'; // Etwas breiter für besseres Aussehen
        resultsEl.style.zIndex = '10';
        resultsEl.style.maxHeight = '200px';
        resultsEl.style.overflowY = 'auto';

        filteredProperties.forEach(([name, info]) => {
            const itemEl = resultsEl.createDiv({ cls: 'menu-item' }); // Verwende 'menu-item' Klasse
            const itemIcon = itemEl.createSpan({ cls: 'menu-item-icon' });
            this.updatePropertyIcon(itemIcon, info.type);
            itemEl.createSpan({ text: name });

            itemEl.addEventListener('mousedown', async (e) => {
                e.preventDefault(); // Verhindert Blur-Event des Inputs vor dem Klick
                // Eigenschaft auswählen
                this.plugin.settings[this.settingsParameter][rowIndex].property = name;
                this.plugin.settings[this.settingsParameter][rowIndex].type = info.type;
                // Wert zurücksetzen, da Typ wechseln kann (optional)
                this.plugin.settings[this.settingsParameter][rowIndex].value = undefined;
                await this.plugin.saveSettings();
                this.clearSearchResults(searchContainerEl);
                this.display(); // Neu rendern
            });
        });
    }

    // Helper zum Entfernen der Suchergebnisliste
    clearSearchResults(searchContainerEl: HTMLElement) {
        const resultsEl = searchContainerEl.querySelector('.property-search-results');
        if (resultsEl) {
            resultsEl.remove();
        }
    }


    // Helper zum Rendern des passenden Eingabefelds für den Wert
    renderValueInput(containerEl: HTMLElement, propertyInfo: PropertyInfo | undefined, currentValue: any, index: number) {
        let returnComponent;
        containerEl.empty(); // Vorheriges Feld löschen

        if (!propertyInfo) {
             containerEl.setText('');
             containerEl.addClass('text-muted'); // Standard Obsidian Klasse für gedämpften Text
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
                // Erstelle ein klickbares Div für die Tri-State-Checkbox
                const checkboxEl = containerEl.createDiv({ cls: 'tri-state-checkbox clickable-icon' });
                returnComponent = checkboxEl;
                checkboxEl.setAttribute('aria-label', 'Checkbox Status ändern');
                checkboxEl.setAttribute('role', 'checkbox');

                // Funktion zum Setzen des visuellen Zustands und aria-checked
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
                    // Speichere den aktuellen Zustand im Element für einfachen Zugriff im Click-Handler
                    checkboxEl.dataset.state = String(state);
                };

                // Setze den initialen Zustand
                updateCheckboxVisual(currentValue);

                // Click-Handler zum Durchschalten der Zustände
                checkboxEl.addEventListener('click', async () => {
                    let currentState = checkboxEl.dataset.state;
                    let nextState: boolean | undefined;

                    if (currentState === 'false') {
                        nextState = true; // false -> true
                    } else if (currentState === 'true') {
                        nextState = undefined; // true -> undefined
                    } else { // 'undefined' or potentially other string values
                        nextState = false; // undefined -> false
                    }

                    // Update Plugin Settings
                    this.plugin.settings[this.settingsParameter][index].value = nextState;
                    await this.plugin.saveSettings();

                    // Update Visuals
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

    // Helper zum Aktualisieren des Icons basierend auf dem Typ
    updatePropertyIcon(iconEl: HTMLElement, type: string | undefined) {
        let iconName = 'hash';
        switch (type) {
            case 'text': iconName = 'align-left'; break;
            case 'number': iconName = 'binary'; break;
            case 'multitext': iconName = 'list'; break;
            case 'date': iconName = 'calendar'; break;
            case 'datetime': iconName = 'clock'; break;
            case 'checkbox': iconName = 'check-square'; break; // Icon für die Property-Liste links
            default: iconName = 'help-circle';
        }
        setIcon(iconEl, iconName);
    }


    // display() muss async sein
    async display(): Promise<void> {
        const containerEl = this.container;
        containerEl.empty();

        await this.fetchKnownProperties();

        const propertiesListEl = containerEl.createDiv('properties-list');

        this.plugin.settings.rules.forEach((propConfig, index) => {
            this.renderPropertyRow(propertiesListEl, propConfig, index);
        });

        // Button zum Hinzufügen einer neuen Eigenschaft (jetzt ohne Setting drumherum für Konsistenz)
        const addBtnContainer = containerEl.createDiv({ cls: 'setting-item-control' }); // Wiederverwende Control-Klasse für Styling
        addBtnContainer.style.justifyContent = 'right'; // Zentriere Button
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