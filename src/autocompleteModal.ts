
import { App, Modal, Setting, TAbstractFile, TFile, TFolder, Vault, setIcon,ButtonComponent, TextComponent, Constructor } from 'obsidian'; // Added setIcon
import { FolderTagRuleDefinition, ObsidianPropertyTypes, PropertyInfo } from './types';
import { ScriptingTools } from './tools';
import { renderValueInput, updatePropertyIcon } from './uiElements'; // Import the function to render value input


// Define the result structure returned by the modal
export interface autocompleteModalResult {
    values: {};
}

/**
 * Obsidian Modal for selecting directories and files from the vault structure.
 */
export class AutocompleteModal extends Modal {

    
    private resolvePromise!: (result: autocompleteModalResult | null) => void;
    private promise: Promise<autocompleteModalResult | null>;

    // Initial state passed to the modal (stored for reset functionality)
    private readonly okCallback: (result: autocompleteModalResult | null) => void;
    private plugin: any;
    private options: any;
    private tools: ScriptingTools;
    private expectedType: ObsidianPropertyTypes;
    private rule: FolderTagRuleDefinition;
    private knownProperties: Record<string, PropertyInfo> = {};

    // Current state being modified within the modal
    private activeFile: TFile | TFolder | undefined
    private frontmatter: any; // Frontmatter data for the active file

    // UI Elements
    private contentRootElement: HTMLElement;
    private functionTestButton: ButtonComponent;
    private functionResultTextComponent: TextComponent | undefined;
    private result: any = {};

    /**
     * Creates an instance of the DirectorySelectionModal.
     * @param app - The Obsidian App instance.
     * @param plugin - The plugin instance.
     * @param expectedType - Expected return type.
     * @param activeFile - The currently active file or folder.
     * @param frontmatter - Frontmatter data for the active file.
     * @param okCallback - Function to call when the user clicks "OK". Receives the selection result.
     */
    constructor(
        app: App,
        plugin: any,
        rule: FolderTagRuleDefinition,
        options: any,
        activeFile: TFile | TFolder | undefined,
        frontmatter: any,   
        okCallback?: (result: autocompleteModalResult | null) => void
    ) {
        super(app);
        this.app = app;
        // Store initial state for reset
        this.tools= new ScriptingTools(app, this.plugin, this.frontmatter);
        this.activeFile = activeFile;
        this.frontmatter = frontmatter; // Store frontmatter data

        this.plugin = plugin;
        this.rule = rule;
        this.options = options; // Store options for the modal
        this.expectedType = rule.type; // Expected type for the modal

        // Initialize the promise
        this.promise = new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
        if (okCallback) this.okCallback = okCallback;

        // Initialize current state from initial state for editing
        this.resetToInitial(); // Use a method for initialization and reset
    }

    /**
     * Resets the current selection state to the initial state provided at construction.
     */
    private resetToInitial(): void {
    }

    /**
     * Resets the current selection state to empty.
     */
    private resetToEmpty(): void {
    }

    /**
     * Called when the modal is opened. Builds the UI.
     */
    async onOpen() {
        this.knownProperties = await this.tools.fetchKnownProperties(this.app); // Initialize known properties
        const { contentEl } = this;
        if (contentEl.parentElement) contentEl.parentElement.style.width = '900px';
        contentEl.empty(); // Clear previous 
        contentEl.addClass('codeEditor-modal'); 

        // --- Modal Title ---
        contentEl.createEl('h2', { text: 'Please complete the following properties' });    
        contentEl.createEl('body', { text: `File: ${this.activeFile?.path}` }); 

        // --- Tree Container ---
        this.contentRootElement = contentEl.createDiv({ cls: 'codeEditor-container' });
        // Basic styling for the scrollable tree area
        // this.editorRootElement.style.width = '600px';
        // this.contentRootElement.style.height = '600px';
        this.contentRootElement.style.overflowY = 'auto';
        //this.editorRootElement.style.border = '1px solid var(--background-modifier-border)';
        this.contentRootElement.style.padding = '10px';
        this.contentRootElement.style.marginTop = '10px';
        this.contentRootElement.style.marginBottom = '10px';


        const propertyContainerEl = contentEl.createDiv({ cls: "codeEditor-options" });
        propertyContainerEl.style.flexDirection = 'column'; // Stack items vertically

        for (const [key, value] of Object.entries(this.frontmatter)) {
            if (key.startsWith(this.rule.property + this.options.propertyDelimiter)) {
                const rowEl = propertyContainerEl.createDiv({ cls: 'property-setting-row setting-item' });
                rowEl.style.width = '100%'; // Full width

                const controlEl = rowEl.createDiv({ cls: 'setting-item-control' });
                controlEl.style.display = 'flex';
                controlEl.style.alignItems = 'center';
                controlEl.style.justifyContent = 'space-between';
                controlEl.style.width = '100%';
                controlEl.style.gap = '0px'; // Prevent gap from being added to the left side

                const leftContainer = controlEl.createDiv({ cls: 'property-left-container' });
                leftContainer.style.display = 'flex';
                leftContainer.style.alignItems = 'center';
                leftContainer.style.minWidth = '250px'; 

                const iconEl = leftContainer.createSpan({ cls: 'property-icon setting-item-icon' });
                iconEl.style.marginRight = '8px';

                updatePropertyIcon(iconEl, this.knownProperties[key].type); // Update icon based on type
                const searchContainer = leftContainer.createDiv({ cls: 'property-search-container' });
                const nameInput = new TextComponent(searchContainer)
                    .setValue(key)
                    .setPlaceholder('Property name')
                    .setDisabled(true); // Disable the input field
                nameInput.inputEl.style.border = 'none'; // make border invisible
                const middleContainer = controlEl.createDiv({ cls: 'property-middle-container' });
                const valueContainer = middleContainer.createDiv({ cls: 'property-value-container' });
                valueContainer.style.width = '100%'; // Full width for value container
                let previewComponent = renderValueInput(valueContainer, this.knownProperties[key], this.frontmatter[key], this.changeCallback);

                previewComponent.inputEl.style.width = '100%'; // Make the input field take full width
                previewComponent.inputEl.style.backgroundColor = 'transparent'; // make it invisible
                // --- right part ---
                const deleteButtonContainer = controlEl.createDiv({ cls: 'property-right-container' });
                deleteButtonContainer.style.marginLeft = 'auto'; // Push to the right
            }
        }

        // --- Action Buttons ---
        this.createActionButtons(contentEl); // Create OK and Reset buttons
    }

    changeCallback = (propertyInfo: PropertyInfo | undefined, value:any) => {
        // Save the result to the current state
        if (propertyInfo) {
            this.result[propertyInfo.name] = value; // Update the result with the new value
        }
    }   

    /**
     * Creates the "OK" and "Reset" buttons.
     * @param containerEl - The HTML element to append the buttons to.
     */
    private createActionButtons(containerEl: HTMLElement): void {
        const buttonsEl = containerEl.createDiv({ cls: 'modal-buttons' });
        buttonsEl.style.marginTop = '15px';
        buttonsEl.style.display = 'flex'; // Use flex for alignment
        buttonsEl.style.justifyContent = 'flex-end'; // Align buttons to the right
        buttonsEl.style.gap = '10px'; // Space between buttons

        // Reset Button (Undo ↪️)
        const resetButton = buttonsEl.createEl('button');
        // Use Obsidian's setIcon for consistency, or use text
        setIcon(resetButton, 'reset'); // Use a suitable icon like 'reset' or 'undo'
        resetButton.ariaLabel = 'Reset selection'; // Accessibility
        resetButton.onclick = () => {
            this.resetToInitial(); // Reset internal state
        };

        // Clear Button (Clear 🚮)
        const emptyButton = buttonsEl.createEl('button');
        // Use Obsidian's setIcon for consistency, or use text
        setIcon(emptyButton, 'eraser'); // Use a suitable icon like 'reset' or 'undo'
        emptyButton.ariaLabel = 'Clear selection'; // Accessibility
        emptyButton.onclick = () => {
            this.resetToEmpty(); // Clear state
        };

        // cancel Button
        const cancelButton = buttonsEl.createEl('button', { text: 'Cancel' });
        cancelButton.ariaLabel = 'close and discard changes'; // Accessibility
        cancelButton.onclick = () => {
            console.log("Cancel Clicked - Returning"); // Debug log
            this.resolvePromise(null); // Resolve the promise with null
            this.close();
        };

        // OK Button
        const okButton = buttonsEl.createEl('button', { text: 'OK', cls: 'mod-cta' });
        cancelButton.ariaLabel = 'close and save changes'; // Accessibility
        okButton.onclick = () => {
            this.resolvePromise({ values: this.result }); // Resolve the promise with the result
            this.close();
        };

    }


    /**
     * Called when the modal is closed. Cleans up resources.
     */
    onClose() {
        const { contentEl } = this;
        contentEl.empty(); // Clear the modal's content
    }

    openAndGetValues(): Promise<autocompleteModalResult | null> {
        this.open();
        return this.promise; // Return the promise
    }
}


/**
 * Opens an autocomplete modal for selecting or entering values based on the provided parameters.
 *
 * @param app - The Obsidian application instance.
 * @param plugin - The plugin instance that is invoking the modal.
 * @param rule - The folder-to-tag rule definition to be used in the modal.
 * @param activeFile - The currently active file or folder, if any.
 * @param frontmatter - The frontmatter data associated with the active file.
 * @returns A promise that resolves to the result of the autocomplete modal, or `null` if no selection was made.
 */
export async function openAutocompleteModal(
    app: App,
    plugin: any,
    rule: FolderTagRuleDefinition,
    options: any,
    activeFile: TFile | TFolder | undefined,
    frontmatter: any
): Promise<autocompleteModalResult | null> {
    // Create and open the modal instance
    const modal = new AutocompleteModal(app, plugin, rule, options, activeFile, frontmatter);
    return await modal.openAndGetValues(); // Wait for the promise to resolve
}