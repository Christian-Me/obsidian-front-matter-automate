
import { App, Modal, Setting, TAbstractFile, TFile, TFolder, Vault, setIcon,ButtonComponent, TextComponent, Constructor } from 'obsidian'; // Added setIcon
//import 'codemirror/mode/javascript/javascript';
import { ObsidianPropertyTypes } from './types';
import { parseJSCode, ScriptingTools } from './tools';
import { updatePropertyIcon } from './settings-properties';
//import { chdir } from 'node:process';
//import { EditorView } from '@codemirror/view';
//import { EditorState } from '@codemirror/state';


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
    private scriptingTools: ScriptingTools;
    private plugin: any;

    // Current state being modified within the modal
    private currentCode: string;
    private expectedType: ObsidianPropertyTypes;
    private currentType: ObsidianPropertyTypes;
    private checkedSuccessfully : boolean;
    private useTextArea : boolean;
    private activeFile: TFile | TFolder | null
    private frontmatter: any; // Frontmatter data for the active file

    // UI Elements
    private editorRootElement: HTMLElement;
    private functionTestButton: ButtonComponent;
    private functionResultTextComponent: TextComponent | undefined;
    private cmEditor: CodeMirror.Editor | null;

    /**
     * Creates an instance of the DirectorySelectionModal.
     * @param app - The Obsidian App instance.
     * @param plugin - The plugin instance.
     * @param initialCode - String with the initial code.
     * @param expectedType - Expected return type.
     * @param activeFile - The currently active file or folder.
     * @param frontmatter - Frontmatter data for the active file.
     * @param okCallback - Function to call when the user clicks "OK". Receives the selection result.
     */
    constructor(
        app: App,
        plugin: any,
        initialCode: string,
        expectedType: ObsidianPropertyTypes,
        activeFile: TFile | TFolder | null,
        frontmatter: any,   
        okCallback: (result: codeEditorModalResult | null) => void
    ) {
        super(app);
        // Store initial state for reset
        this.initialCode = initialCode;
        this.expectedType = expectedType;
        this.useTextArea = false;
        this.checkedSuccessfully = false;
        this.activeFile = activeFile;
        this.frontmatter = frontmatter; // Store frontmatter data
        this.currentType = expectedType; // Initialize current type to expected type
        this.currentCode = initialCode; // Initialize current code to initial code

        this.plugin = plugin;
        this.scriptingTools= new ScriptingTools(app, this.plugin, this.frontmatter);
        this.okCallback = okCallback;

        // Initialize current state from initial state for editing
        this.resetSelectionToInitial(); // Use a method for initialization and reset
    }

    /**
     * Resets the current selection state to the initial state provided at construction.
     */
    private resetSelectionToInitial(): void {
        this.currentCode = this.initialCode;
        this.cmEditor?.setValue(this.currentCode); // Set the initial code in the editor
        if (this.functionResultTextComponent) this.functionResultTextComponent.setValue(''); // Clear the result text component
    }

    /**
     * Resets the current selection state to empty.
     */
    private resetSelectionToEmpty(): void {
        this.currentCode = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.cmEditor?.setValue(this.currentCode); // Set the initial code in the editor
        if (this.functionResultTextComponent) this.functionResultTextComponent.setValue(''); // Clear the result text component 
    }

    loadCodeMirrorMode(mode: string) {
        try {
          // Verwende require (könnte in zukünftigen Versionen weniger zuverlässig sein)
          require(`obsidian/lib/codemirror/mode/${mode}/${mode}.js`);
          console.log(`CodeMirror mode '${mode}' loaded successfully (using require).`);
        } catch (error) {
          console.error(`Failed to load CodeMirror mode '${mode}' (using require):`, error);
        }
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
        contentEl.createEl('h2', { text: 'JavaScript Editor' });    
        contentEl.createEl('body', { text: `Make sure your code results: ${this.expectedType}` }); 

        // --- Tree Container ---
        this.editorRootElement = contentEl.createDiv({ cls: 'codeEditor-container' });
        // Basic styling for the scrollable tree area
        // this.editorRootElement.style.width = '600px';
        this.editorRootElement.style.height = '600px';
        this.editorRootElement.style.overflowY = 'auto';
        //this.editorRootElement.style.border = '1px solid var(--background-modifier-border)';
        this.editorRootElement.style.padding = '10px';
        this.editorRootElement.style.marginTop = '10px';
        this.editorRootElement.style.marginBottom = '10px';

        this.cmEditor = null;

        const ruleOptionsDiv = contentEl.createDiv({ cls: "codeEditor-options" });

        if (this.useTextArea) {
            const ruleOptionsSettings = new Setting(this.editorRootElement)
                .addTextArea(textArea => {
                    textArea.setPlaceholder('ender valid JS Code');
                    textArea.inputEl.setAttribute('style', `height:190px; width:80%;`);
                    textArea.onChange(async (value) => {
                        if (this.functionTestButton) this.functionTestButton.buttonEl.addClass('mod-warning');
                        this.currentCode = value;
                    })
                })
        } else {
            /*
            let view = new EditorView({
                state: EditorState.create({
                  doc: this.currentCode,  // or some string contents
                  extensions: [
                    EditorView.lineWrapping, // Add your extentions here
                    javascript(),
                    // sceneGutter, // or leave empty for basic editor
                  ],
                }),
                parent: this.editorRootElement
              });
            */
            // Initialize CodeMirror 5
            // CodeMirror-Bibliothek abrufen
            const CodeMirror = (window as any).CodeMirror;
            // Sicherstellen, dass CodeMirror geladen ist
            if (CodeMirror) {
                // JavaScript-Modus laden (falls noch nicht geladen)
                if (!CodeMirror.modes.javascript) {
                    await this.loadCodeMirrorMode('javascript');
                    console.log('javaScript support loaded')
                }
            } 
            let jsCode = this.currentCode;
            this.cmEditor = CodeMirror(this.editorRootElement, {
                value: jsCode || "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result; // return you result.\n}",
                mode: "javascript",
                lineNumbers: true,
                theme: "obsidian",
                indentUnit: 4,  
                lineWrapping: false,
                readOnly: false,
                outerHeight: '600px',
            });
            
            if (this.cmEditor) {
                this.cmEditor.on('change', (cmEditor: CodeMirror.Editor) => {
                    if (this.functionTestButton) this.functionTestButton.buttonEl.addClass('mod-warning');
                });
                this.cmEditor.on('blur', (cmEditor: CodeMirror.Editor) => {
                    this.currentCode= cmEditor.getValue();
                });
            };
           
            // Add a button to save the code
            new Setting(ruleOptionsDiv)
                .addButton((button) => {
                    this.functionTestButton = button;
                    button
                    .setWarning()
                    .setButtonText("Run Code")
                    .setTooltip("Run the code and check for errors")
                    .onClick(async () => {
                        if (this.cmEditor) {
                            let jsCode = this.cmEditor.getValue();

                            let userFunction =  parseJSCode(jsCode);
                            if (typeof userFunction === 'string') {
                                let errorHint = "See console for details!";
                                if (userFunction.contains('Unexpected token')) {
                                    errorHint = "Did you missed a semicolon (;)?";
                                }
                                if (this.functionResultTextComponent) this.functionResultTextComponent.setValue(`Syntax error: ${userFunction}! ${errorHint}`);
                                this.checkedSuccessfully = false;
                                button.buttonEl.addClass('mod-warning');
                            } else {
                                if (userFunction) {
                                    try {
                                        const result = userFunction(this.app, this.activeFile, this.scriptingTools)
                                        if (this.functionResultTextComponent) this.functionResultTextComponent.setValue(`'${result.toString()}' (${typeof result})`);
                                        this.updateTypeIcons(result, typesContainer, this.expectedType, this.currentType, this.plugin.settings);
                                        button.buttonEl.removeClass('mod-warning');
                                        this.checkedSuccessfully = true;
                                    }
                                    catch (e) {
                                        if (this.functionResultTextComponent) {
                                            this.functionResultTextComponent.setValue(`Syntax error: ${e.message}! See console for details!`);
                                        }
                                        console.error("Syntax error. ", e, jsCode, userFunction);
                                        this.checkedSuccessfully = false;
                                        button.buttonEl.addClass('mod-warning');    
                                    }
                                } else {
                                    console.error("syntax error");
                                    this.checkedSuccessfully = false;  
                                }
                            }
                        }
                    });
                })
                .addText((text) => {
                    this.functionResultTextComponent = text;
                    text
                    .setPlaceholder('function result')
                    .setDisabled(true)
                    this.functionResultTextComponent.inputEl.style.width = '580px';

                })
                const typesContainer = ruleOptionsDiv.createDiv({ cls: 'property-icons-container' });
        }
        // --- Action Buttons ---
        this.createActionButtons(contentEl); // Create OK and Reset buttons
    }

    updateTypeIcons(value:any, container: HTMLDivElement, expectedType: ObsidianPropertyTypes, currentType: ObsidianPropertyTypes, settings: any) {
        const newType = typeof value;
        const typeIcons: {[key:string]: ObsidianPropertyTypes[]} = {
            'string': ['text', 'tags', 'aliases', 'multitext','date', 'datetime'],
            'number': ['number'],
            'boolean': ['checkbox'],
            'object': ['tags', 'aliases', 'multitext']
        };
        if (newType === 'string') {
            if (!this.scriptingTools.isISOString(value, {withDate: true})) {
                typeIcons[newType].splice(typeIcons[newType].indexOf('date'), 1);
                console.error("Invalid date format:", value);
            }
            if (!this.scriptingTools.isISOString(value, {withDate: true, withTime: true})) {
                typeIcons[newType].splice(typeIcons[newType].indexOf('datetime'), 1); 
                console.error("Invalid date format:", value);
            }
        }
        container.empty(); // Clear the container before adding new icons
        for (let obsidianType of typeIcons[newType]) {
            if (obsidianType) {
                const iconEl = container.createSpan({ cls: 'property-icon setting-item-icon' });
                updatePropertyIcon(iconEl, obsidianType); // Update the icon based on the type
            }
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
    plugin: any,
    initialCode: string,
    expectedType: ObsidianPropertyTypes,
    activeFile: TFile | TFolder | null,
    frontmatter: any,
    okCallback: (result: codeEditorModalResult | null) => void
): void {
    // Create and open the modal instance
    new codeEditorModal(
        app,
        plugin,
        initialCode,
        expectedType,
        activeFile,
        frontmatter,
        okCallback
    ).open();
}