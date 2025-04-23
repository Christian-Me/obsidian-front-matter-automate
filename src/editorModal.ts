import { App, Modal, Setting, TAbstractFile, TFile, TFolder, Vault, setIcon } from 'obsidian'; // Added setIcon
import { ObsidianPropertyTypes } from './types';

// Define the result structure returned by the modal
export interface codeEditorModalResult {
    code: string;
    type: ObsidianPropertyTypes;
    checked: boolean;
}

/**
 * Obsidian Modal for selecting directories and files from the vault structure.
 */
export class codeEditorModal extends Modal {
    // Initial state passed to the modal (stored for reset functionality)
    private readonly initialCode: string;
    private readonly okCallback: (result: codeEditorModalResult | null) => void;

    // Current state being modified within the modal
    private currentCode: string;
    private expectedType: ObsidianPropertyTypes;
    private currentType: ObsidianPropertyTypes;
    private checkedSuccessfully : boolean;

    // UI Elements
    private editorRootElement: HTMLElement; // Container for the tree view

    /**
     * Creates an instance of the DirectorySelectionModal.
     * @param app - The Obsidian App instance.
     * @param initialCode - 
     * @param initialFiles - Array of initially selected file paths.
     * @param initialMode - The initial selection mode ('include' or 'exclude').
     * @param okCallback - Function to call when the user clicks "OK". Receives the selection result.
     */
    constructor(
        app: App,
        initialCode: string,
        expectedType: ObsidianPropertyTypes,
        okCallback: (result: codeEditorModalResult | null) => void
    ) {
        super(app);
        // Store initial state for reset
        this.initialCode = initialCode;
        this.expectedType = expectedType;

        this.okCallback = okCallback;

        // Initialize current state from initial state for editing
        this.resetSelectionToInitial(); // Use a method for initialization and reset
    }

    /**
     * Resets the current selection state to the initial state provided at construction.
     */
    private resetSelectionToInitial(): void {
        this.currentCode = this.initialCode;
    }

    /**
     * Resets the current selection state to empty.
     */
    private resetSelectionToEmpty(): void {
        this.currentCode = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
    }

    /**
     * Called when the modal is opened. Builds the UI.
     */
    onOpen() {
        const { contentEl } = this;
        contentEl.empty(); // Clear previous content
        contentEl.addClass('codeEditor-modal'); 

        // --- Modal Title ---
        contentEl.createEl('h2', { text: 'JavaScript Editor' }); 
        contentEl.createEl('h4', { text: `Make sure your code results ${this.expectedType}` }); 

        // --- Tree Container ---
        this.editorRootElement = contentEl.createDiv({ cls: 'codeEditor-container' });
        // Basic styling for the scrollable tree area
        this.editorRootElement.style.maxHeight = '600px';
        this.editorRootElement.style.overflowY = 'auto';
        this.editorRootElement.style.border = '1px solid var(--background-modifier-border)';
        this.editorRootElement.style.padding = '10px';
        this.editorRootElement.style.marginTop = '10px';
        this.editorRootElement.style.marginBottom = '10px';

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
            this.resetSelectionToInitial(); // Reset internal state
        };

        // Clear Button (Clear 🚮)
        const emptyButton = buttonsEl.createEl('button');
        // Use Obsidian's setIcon for consistency, or use text
        setIcon(emptyButton, 'eraser'); // Use a suitable icon like 'reset' or 'undo'
        emptyButton.ariaLabel = 'Clear selection'; // Accessibility
        emptyButton.onclick = () => {
            this.resetSelectionToEmpty(); // Clear state
        };

        // cancel Button
        const cancelButton = buttonsEl.createEl('button', { text: 'Cancel' });
        cancelButton.ariaLabel = 'close and discard changes'; // Accessibility
        cancelButton.onclick = () => {
            console.log("Cancel Clicked - Returning"); // Debug log
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
            code: this.currentCode,
            checked: this.checkedSuccessfully,
            type: 'text',
        };
        console.log("OK Clicked - Returning Result:", result); // Debug log
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
    initialCode: string,
    expectedType: ObsidianPropertyTypes,
    okCallback: (result: codeEditorModalResult | null) => void
): void {
    // Create and open the modal instance
    new codeEditorModal(
        app,
        initialCode,
        expectedType,
        okCallback
    ).open();
}