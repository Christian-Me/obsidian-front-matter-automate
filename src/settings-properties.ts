import { App, Plugin, PluginSettingTab, Setting, DropdownComponent, TextComponent, ButtonComponent, ToggleComponent, setIcon } from 'obsidian';

export type PropertyInfo = {
    name: string;
    type: string;
    count?: number;
};

export class FolderTagSettingTab extends PluginSettingTab {
    plugin: any;
    knownProperties: Record<string, PropertyInfo> = {}; // Cache für gefundene Properties

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // Funktion zum Abrufen und Speichern der bekannten Properties (async)
    async fetchKnownProperties() {
        this.knownProperties = await this.app.metadataCache.getAllPropertyInfos();
        this.knownProperties = Object.fromEntries(
            Object.entries(this.knownProperties).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );
    }

    // Helper zum Rendern EINER Eigenschaftszeile
    renderPropertyRow(containerEl: HTMLElement, propertyConfig: { name: string; value: any }, index: number) {
        // Verwende createDiv statt Setting für volle Layout-Kontrolle und kompakteres Aussehen
        const rowEl = containerEl.createDiv({ cls: 'property-setting-row setting-item' }); // Füge 'setting-item' für Standard-Styling hinzu
        const controlEl = rowEl.createDiv({ cls: 'setting-item-control' }); // Container für alle Controls

        // --- Linker Teil: Icon & Durchsuchbare Eigenschaftsauswahl ---
        const leftContainer = controlEl.createDiv({ cls: 'property-left-container' });
        const iconEl = leftContainer.createSpan({ cls: 'property-icon setting-item-icon' }); // Standard-Icon-Klasse
        setIcon(iconEl, 'hash'); // Standard-Icon

        // Container für das Suchfeld und die Ergebnisliste
        const searchContainer = leftContainer.createDiv({ cls: 'property-search-container' });

        // Textfeld für die Suche/Anzeige des aktuellen Namens
        const nameInput = new TextComponent(searchContainer)
            .setPlaceholder('Eigenschaft suchen...')
            .setValue(propertyConfig.name || '')
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
        const currentPropertyInfo = this.knownProperties[propertyConfig.name];
        if (currentPropertyInfo) {
            this.updatePropertyIcon(iconEl, currentPropertyInfo.type);
        } else if (propertyConfig.name) {
            setIcon(iconEl, 'alert-circle'); // Warn-Icon, falls Name ungültig
        }

        // --- Mittlerer Teil: Werte-Eingabefeld ---
        const valueContainer = controlEl.createDiv({ cls: 'property-value-container' });
        this.renderValueInput(valueContainer, currentPropertyInfo, propertyConfig.value, index);

        // --- Rechter Teil: Löschen-Button ---
        const deleteButtonContainer = controlEl.createDiv({ cls: 'property-delete-button-container' });
        new ButtonComponent(deleteButtonContainer)
            .setIcon('trash-2')
            .setTooltip('Diese Eigenschaft entfernen')
            .setClass('mod-subtle') // Kompakteres Button-Styling
            .onClick(async () => {
                this.plugin.settings.configuredProperties.splice(index, 1);
                await this.plugin.saveSettings();
                this.display(); // Re-render the settings tab
            });

        // Styling / Layout via Flexbox (angewendet auf controlEl)
        controlEl.style.display = 'flex';
        controlEl.style.alignItems = 'center';
        controlEl.style.justifyContent = 'space-between';
        controlEl.style.width = '100%';
        controlEl.style.gap = '10px'; // Abstand zwischen Elementen

        leftContainer.style.display = 'flex';
        leftContainer.style.alignItems = 'center';
        //leftContainer.style.flexGrow = '1'; // Nimmt verfügbaren Platz
        leftContainer.style.minWidth = '200px'; // Mindestbreite für linke Seite
        iconEl.style.marginRight = '8px';

        searchContainer.style.position = 'relative'; // Für absolute Positionierung der Ergebnisse
        searchContainer.style.flexGrow = '1';

        valueContainer.style.flexGrow = '2'; // Nimmt mehr Platz

        deleteButtonContainer.style.marginLeft = 'auto'; // Schiebt Button nach rechts
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
                this.plugin.settings.configuredProperties[rowIndex].name = name;
                // Wert zurücksetzen, da Typ wechseln kann (optional)
                this.plugin.settings.configuredProperties[rowIndex].value = undefined;
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
        containerEl.empty(); // Vorheriges Feld löschen

        if (!propertyInfo) {
             containerEl.setText('');
             containerEl.addClass('text-muted'); // Standard Obsidian Klasse für gedämpften Text
             return;
        }

        const type = propertyInfo.type;

        switch (type) {
            case 'number':
                new TextComponent(containerEl)
                    .setPlaceholder('Zahlenwert')
                    .setValue(currentValue !== undefined && currentValue !== null ? String(currentValue) : '')
                    .onChange(async (value) => {
                        const numValue = value === '' ? undefined : parseFloat(value);
                        this.plugin.settings.configuredProperties[index].value = isNaN(numValue as number) ? undefined : numValue;
                        await this.plugin.saveSettings();
                    })
                    .inputEl.type = 'number';
                break;
            case 'checkbox':
                // Erstelle ein klickbares Div für die Tri-State-Checkbox
                const checkboxEl = containerEl.createDiv({ cls: 'tri-state-checkbox clickable-icon' });
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
                    this.plugin.settings.configuredProperties[index].value = nextState;
                    await this.plugin.saveSettings();

                    // Update Visuals
                    updateCheckboxVisual(nextState);
                });

                break;
            case 'date':
                new TextComponent(containerEl)
                    .setPlaceholder('YYYY-MM-DD')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings.configuredProperties[index].value = value || undefined;
                        await this.plugin.saveSettings();
                    })
                     .inputEl.type = 'date';
                break;
            case 'datetime':
                 new TextComponent(containerEl)
                    .setPlaceholder('YYYY-MM-DDTHH:mm')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings.configuredProperties[index].value = value || undefined;
                        await this.plugin.saveSettings();
                    })
                    .inputEl.type = 'datetime-local';
                break;
            case 'multitext':
                 new TextComponent(containerEl)
                    .setPlaceholder('Werte (kommagetrennt)')
                    .setValue(Array.isArray(currentValue) ? currentValue.join(', ') : (currentValue || ''))
                    .onChange(async (value) => {
                        const arrayValue = value.split(',').map(s => s.trim()).filter(s => s);
                        this.plugin.settings.configuredProperties[index].value = arrayValue.length > 0 ? arrayValue : undefined;
                        await this.plugin.saveSettings();
                    });
                break;
            case 'text':
            default:
                new TextComponent(containerEl)
                    .setPlaceholder('Wert')
                    .setValue(currentValue || '')
                    .onChange(async (value) => {
                        this.plugin.settings.configuredProperties[index].value = value || undefined;
                        await this.plugin.saveSettings();
                    });
                break;
        }
         const input = containerEl.querySelector('input, select, textarea');
         if (input) {
             input.style.width = '100%';
         }
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
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Konfiguration der Eigenschaften' });

        await this.fetchKnownProperties();

        const propertiesListEl = containerEl.createDiv('properties-list');

        this.plugin.settings.configuredProperties.forEach((propConfig, index) => {
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
                this.plugin.settings.configuredProperties.push({ name: defaultName, value: undefined });
                await this.plugin.saveSettings();
                this.display();
            })
            .buttonEl.className='property-plus-button';
    }
}