
import { App, Modal, Setting, TAbstractFile, TFile, TFolder, Vault, setIcon,ButtonComponent, TextComponent, Constructor } from 'obsidian'; // Added setIcon
import { ObsidianPropertyTypes } from './types';
import { ScriptingTools } from './tools';
import { DEBUG, logger } from './Log';


// Define the result structure returned by the modal
export interface codeEditorModalResult {
    type: ObsidianPropertyTypes;
}

/**
 * Obsidian Modal for selecting directories and files from the vault structure.
 */
export class codeEditorModal extends Modal {
    // Initial state passed to the modal (stored for reset functionality)
    private readonly okCallback: (result: codeEditorModalResult | null) => void;
    private plugin: any;
    private scriptingTools: ScriptingTools;
    private expectedType!: ObsidianPropertyTypes

    // Current state being modified within the modal
    private activeFile: TFile | TFolder | null
    private frontmatter: any; // Frontmatter data for the active file

    // UI Elements
    private contentRootElement!: HTMLElement;
    private functionTestButton!: ButtonComponent;
    private functionResultTextComponent: TextComponent | undefined;

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
        expectedType: ObsidianPropertyTypes,
        activeFile: TFile | TFolder | null,
        frontmatter: any,   
        okCallback: (result: codeEditorModalResult | null) => void
    ) {
        super(app);
        // Store initial state for reset
        this.activeFile = activeFile;
        this.frontmatter = frontmatter; // Store frontmatter data

        this.plugin = plugin;
        this.scriptingTools= new ScriptingTools(app, this.plugin, this.frontmatter);
        this.okCallback = okCallback;

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
        const { contentEl } = this;
        if (contentEl.parentElement) contentEl.parentElement.style.width = '900px';
        contentEl.empty(); // Clear previous 
        contentEl.addClass('codeEditor-modal'); 

        // --- Modal Title ---
        contentEl.createEl('h2', { text: 'Autocomplete Modal' });    
        contentEl.createEl('body', { text: `Expected result: ${this.expectedType}` }); 

        // --- Tree Container ---
        this.contentRootElement = contentEl.createDiv({ cls: 'codeEditor-container' });
        // Basic styling for the scrollable tree area
        // this.editorRootElement.style.width = '600px';
        this.contentRootElement.style.height = '600px';
        this.contentRootElement.style.overflowY = 'auto';
        //this.editorRootElement.style.border = '1px solid var(--background-modifier-border)';
        this.contentRootElement.style.padding = '10px';
        this.contentRootElement.style.marginTop = '10px';
        this.contentRootElement.style.marginBottom = '10px';


        const ruleOptionsDiv = contentEl.createDiv({ cls: "codeEditor-options" });

        // --- Action Buttons ---
        this.createActionButtons(contentEl); // Create OK and Reset buttons
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
            logger.log(DEBUG,"Cancel Clicked - Returning"); // Debug log
            this.okCallback( null ); // Pass the final selection back
            this.close();
        };

        // OK Button
        const okButton = buttonsEl.createEl('button', { text: 'OK', cls: 'mod-cta' });
        cancelButton.ariaLabel = 'close and save changes'; // Accessibility
        okButton.onclick = () => {
            this.close();
        };

    }


    /**
     * Called when the modal is closed. Cleans up resources.
     */
    onClose() {
        // Gather the final state ONLY when OK is clicked
        const result: codeEditorModalResult = {
            type: 'text',
        };
        logger.log(DEBUG,"OK Clicked - Returning Result:", result); // Debug log
        this.okCallback(result); // Pass the final selection back
        const { contentEl } = this;
        contentEl.empty(); // Clear the modal's content
    }
}

/**
 * Helper function to easily open the Directory Selection Modal.
 *
 * @param app - The Obsidian App instance.
 * @param initialCode - String with the initial code.
 * @param expectedType - Expected return type.
 * @param okCallback - Function to call when the user clicks "OK". Receives the selection result.
 */
export function openCodeEditorModal(
    app: App,
    plugin: any,
    expectedType: ObsidianPropertyTypes,
    activeFile: TFile | TFolder | null,
    frontmatter: any,
    okCallback: (result: codeEditorModalResult | null) => void
): void {
    // Create and open the modal instance
    new codeEditorModal(
        app,
        plugin,
        expectedType,
        activeFile,
        frontmatter,
        okCallback
    ).open();
}