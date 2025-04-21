import { App, Modal, Setting, TAbstractFile, TFile, TFolder, Vault, setIcon } from 'obsidian'; // Added setIcon

// Define the structure for tree nodes
interface TreeNode {
    path: string;
    name: string;
    type: 'folder' | 'file';
    children?: TreeNode[];
    element: HTMLElement; // Reference to the list item element (li)
    checkbox: HTMLInputElement;
    label: HTMLLabelElement;
    container: HTMLElement; // Reference to the container div holding checkbox and label
}

// Define the result structure returned by the modal
export interface DirectorySelectionResult {
    folders: string[];
    files: string[];
    mode: 'include' | 'exclude';
    display: 'folders' | 'files';
}

/**
 * Obsidian Modal for selecting directories and files from the vault structure.
 */
export class DirectorySelectionModal extends Modal {
    // Initial state passed to the modal (stored for reset functionality)
    private readonly initialFoldersSnapshot: ReadonlySet<string>;
    private readonly initialFilesSnapshot: ReadonlySet<string>;
    private readonly initialModeSnapshot: 'include' | 'exclude';
    private readonly initialDisplaySnapshot: 'folders' | 'files';
    private readonly okCallback: (result: DirectorySelectionResult | null) => void;

    // Current state being modified within the modal
    private currentFolders: Set<string>;
    private currentFiles: Set<string>;
    private currentMode: 'include' | 'exclude';
    private currentDisplay: 'folders' | 'files';
    private includeExcludeSelectable: boolean;
    private showFiles: boolean = false; // State for showing files in the tree

    // UI Elements
    private treeRootElement: HTMLElement; // Container for the tree view
    private treeNodes: Map<string, TreeNode> = new Map(); // Map path to node info for quick access
    private modeDropdown: Setting | null = null; // Reference to update dropdown on reset

    /**
     * Creates an instance of the DirectorySelectionModal.
     * @param app - The Obsidian App instance.
     * @param initialFolders - Array of initially selected folder paths.
     * @param initialFiles - Array of initially selected file paths.
     * @param initialMode - The initial selection mode ('include' or 'exclude').
     * @param okCallback - Function to call when the user clicks "OK". Receives the selection result.
     */
    constructor(
        app: App,
        initialFolders: string[],
        initialFiles: string[],
        initialMode: 'include' | 'exclude',
        initialDisplay: 'folders' | 'files',
        includeExcludeSelectable: boolean,
        okCallback: (result: DirectorySelectionResult | null) => void
    ) {
        super(app);
        // Store initial state for reset
        this.initialFoldersSnapshot = new Set(initialFolders);
        this.initialFilesSnapshot = new Set(initialFiles);
        this.initialModeSnapshot = initialMode;
        this.initialDisplaySnapshot = initialDisplay;
        this.showFiles = initialDisplay==='files' || initialFiles.length>0;
        this.includeExcludeSelectable = includeExcludeSelectable;
        this.okCallback = okCallback;

        // Initialize current state from initial state for editing
        this.resetSelectionToInitial(); // Use a method for initialization and reset
    }

    /**
     * Resets the current selection state to the initial state provided at construction.
     */
    private resetSelectionToInitial(): void {
        this.currentFolders = new Set(this.initialFoldersSnapshot);
        this.currentFiles = new Set(this.initialFilesSnapshot);
        this.currentMode = this.initialModeSnapshot;
        // Note: showFiles is not reset by this action, user can toggle it independently
    }

    /**
     * Resets the current selection state to empty.
     */
    private resetSelectionToEmpty(): void {
        this.currentFolders = new Set([]);
        this.currentFiles = new Set([]);
        this.currentMode = this.initialModeSnapshot;
        // Note: showFiles is not reset by this action, user can toggle it independently
    }

    /**
     * Called when the modal is opened. Builds the UI.
     */
    onOpen() {
        const { contentEl } = this;
        contentEl.empty(); // Clear previous content
        contentEl.addClass('directory-selection-modal'); 

        // --- Modal Title ---
        if (this.includeExcludeSelectable) {
            contentEl.createEl('h2', { text: 'Include or Exclude Folders and Files' }); 
        } else {
            contentEl.createEl('h2', { text: `${this.currentMode === 'exclude' ? 'Exclude' : 'Include'} Folders and Files` }); 
        }

        // --- Settings Controls ---
        const controlsEl = contentEl.createDiv({ cls: 'modal-controls' });
        this.createModeSetting(controlsEl); // Create mode dropdown
        this.createShowFilesSetting(controlsEl); // Create file toggle

        // --- Tree Container ---
        this.treeRootElement = contentEl.createDiv({ cls: 'tree-view-container' });
        // Basic styling for the scrollable tree area
        this.treeRootElement.style.maxHeight = '600px';
        this.treeRootElement.style.overflowY = 'auto';
        this.treeRootElement.style.border = '1px solid var(--background-modifier-border)';
        this.treeRootElement.style.padding = '10px';
        this.treeRootElement.style.marginTop = '10px';
        this.treeRootElement.style.marginBottom = '10px';

        // --- Build and Render Tree ---
        this.buildAndRenderTree(); // Initial rendering based on current state

        // --- Action Buttons ---
        this.createActionButtons(contentEl); // Create OK and Reset buttons
    }

    /**
     * Creates the dropdown setting for choosing the selection mode.
     * @param containerEl - The HTML element to append the setting to.
     */
    private createModeSetting(containerEl: HTMLElement): void {
        if (this.includeExcludeSelectable) {
            this.modeDropdown = new Setting(containerEl) // Store reference
                .setName('Selection Mode') // Setting Name in German
                .setDesc('Choose if the selected files and folders should be excluded or included.') 
                .addDropdown(dropdown => {
                    dropdown
                        .addOption('exclude', 'exclude')
                        .addOption('include', 'include')
                        .setValue(this.currentMode) // Set initial value
                        .onChange(value => {
                            this.currentMode = value as 'include' | 'exclude';
                            this.updateTreeAppearance(); // Update tree visuals based on new mode
                        });
                });
        }
    }

    /**
     * Updates the mode dropdown UI element to reflect the currentMode state.
     */
    private updateModeDropdown(): void {
        const dropdownComponent = this.modeDropdown?.components[0] as any; // Access dropdown component
        if (dropdownComponent && typeof dropdownComponent.setValue === 'function') {
             dropdownComponent.setValue(this.currentMode);
        }
    }


    /**
     * Creates the toggle setting for showing/hiding files in the tree.
     * @param containerEl - The HTML element to append the setting to.
     */
    private createShowFilesSetting(containerEl: HTMLElement): void {
        new Setting(containerEl)
            .setName('Show Files')
            .setDesc('Show Files within the directory tree.')
            .addToggle(toggle => {
                toggle
                    .setValue(this.showFiles)
                    .onChange(value => {
                        this.showFiles = value;
                        this.buildAndRenderTree();
                    });
            });
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
            this.updateModeDropdown(); // Update dropdown UI
            this.buildAndRenderTree(); // Re-render tree with reset state
        };

        // Clear Button (Clear 🚮)
        const emptyButton = buttonsEl.createEl('button');
        // Use Obsidian's setIcon for consistency, or use text
        setIcon(emptyButton, 'eraser'); // Use a suitable icon like 'reset' or 'undo'
        emptyButton.ariaLabel = 'Clear selection'; // Accessibility
        emptyButton.onclick = () => {
            this.resetSelectionToEmpty(); // Clear state
            this.updateModeDropdown(); // Update dropdown UI
            this.buildAndRenderTree(); // Re-render tree with reset state
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
     * Builds the logical tree structure data from the vault's files and folders.
     * @returns The root node of the tree structure.
     */
    private buildTreeData(): TreeNode {
        // Create a virtual root node representing the vault
        const vaultRootNode: TreeNode = {
             path: '/',
             name: this.app.vault.getName() || 'Vault', // Use vault name or default
             type: 'folder',
             children: [],
             // Placeholder elements, will be assigned during rendering if root is rendered
             element: null!, checkbox: null!, label: null!, container: null!
        };
        const folderNodes = new Map<string, TreeNode>();
        folderNodes.set('/', vaultRootNode); // Add root to the map

        // Use getFiles() to retrieve all TFile objects (Markdown, images, pdf, etc.)
        const allFiles = this.app.vault.getFiles();

        // --- Step 1: Create all folder nodes based on file parent paths ---
        allFiles.forEach(file => {
            // Get the parent folder object for the file
            const parentFolder = file.parent;
            // Ensure parentFolder exists before proceeding (Safety check)
            if (!parentFolder) return;

            let currentPath = '';
            // Split path, filter empty strings (handles root '/')
            const pathParts = parentFolder.path.split('/').filter(p => p.length > 0);

            let parentNode = vaultRootNode; // Start from vault root
            pathParts.forEach(part => {
                // Construct the full path for the current part
                currentPath = currentPath === '/' ? part : `${currentPath}/${part}`;
                if (!folderNodes.has(currentPath)) {
                    // Create new folder node if it doesn't exist
                    const newFolderNode: TreeNode = {
                         path: currentPath,
                         name: part,
                         type: 'folder',
                         children: [],
                         // Placeholders, assigned during rendering
                         element: null!, checkbox: null!, label: null!, container: null!
                    };
                    folderNodes.set(currentPath, newFolderNode);
                    // Ensure parentNode has children array initialized
                    if (!parentNode.children) {
                        parentNode.children = [];
                    }
                    parentNode.children!.push(newFolderNode); // Add to parent's children
                    parentNode = newFolderNode; // Move down the tree
                } else {
                    // Folder node already exists, just move down
                    parentNode = folderNodes.get(currentPath)!;
                }
            });
        });

        // --- Step 2: Add file nodes if 'showFiles' is enabled ---
        if (this.showFiles) {
             allFiles.forEach(file => {
                 // Get parent folder and add safety check for null
                 const parentFolder = file.parent;
                 if (!parentFolder) {
                     // console.warn(`File "${file.path}" seems to have no parent folder. Skipping.`); // Optional warning
                     return; // Skip this file if it has no parent
                 }
                 const parentPath = "/"+parentFolder.path; // Now safe to access .path
                 const parentNode = folderNodes.get(parentPath);

                 // Create the file node
                 const fileNode: TreeNode = {
                     path: file.path,
                     name: file.name,
                     type: 'file',
                     // Files don't have children
                     // Placeholders, assigned during rendering
                     element: null!, checkbox: null!, label: null!, container: null!
                 };

                 if (parentNode) {
                     // Ensure children array exists
                     if (!parentNode.children) {
                        parentNode.children = [];
                     }
                     // Add file to its parent folder's children
                     parentNode.children!.push(fileNode);
                 } else {
                     // This case should ideally not happen if Step 1 worked correctly for all folders
                     // console.warn(`Could not find parent node for path "${parentPath}" while adding file "${file.path}".`); // Optional warning
                 }
             });
        }

        // --- Step 3: Sort children alphabetically (folders first, then files) ---
        const sortNodes = (a: TreeNode, b: TreeNode) => {
            if (a.type === 'folder' && b.type === 'file') return -1; // Folders come first
            if (a.type === 'file' && b.type === 'folder') return 1;  // Files come after
            return a.name.localeCompare(b.name); // Sort alphabetically by name
        };

        // Sort children of every folder node
        folderNodes.forEach(node => node.children?.sort(sortNodes));

        return vaultRootNode; // Return the populated root node
    }


    /**
     * Renders the entire tree structure in the DOM based on the tree data.
     */
    private renderTree() {
         this.treeRootElement.empty(); // Clear existing DOM elements
         this.treeNodes.clear(); // Clear the node map

         const treeData = this.buildTreeData(); // Get the structured data

         // Create the top-level list for the vault contents
         const rootUl = this.treeRootElement.createEl('ul');
         rootUl.addClass('tree-root-ul');
         rootUl.style.listStyle = 'none';
         rootUl.style.paddingLeft = '0'; // Remove default list indentation

         // Render children of the virtual vault root node
         treeData.children?.forEach(childNode => {
             this.renderTreeNode(childNode, rootUl, 0); // Start rendering at level 0
         });
    }

    /**
     * Recursively renders a single tree node and its children in the DOM.
     * @param node - The TreeNode data to render.
     * @param parentElement - The HTML `ul` element to append this node's `li` to.
     * @param level - The current indentation level.
     */
    private renderTreeNode(node: TreeNode, parentElement: HTMLElement, level: number) {
        const li = parentElement.createEl('li');
        li.style.marginLeft = `${level * 20}px`; // Apply indentation based on level
        li.addClass(`tree-node-${node.type}`); // Add class for type (folder/file)

        const container = li.createDiv({ cls: 'tree-node-container' });
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.padding = '2px 0'; // Add some vertical padding

        // --- Checkbox ---
        const checkbox = container.createEl('input', { type: 'checkbox' });
        checkbox.id = `tree-cb-${node.path.replace(/[^a-zA-Z0-9]/g, '-')}`; // Create a safe ID
        checkbox.dataset.path = node.path; // Store path in data attribute
        checkbox.dataset.type = node.type; // Store type

        // --- Label ---
        const label = container.createEl('label');
        // Add icons for visual distinction (optional)
        label.textContent = `${node.type === 'folder' ? '📁' : '📄'} ${node.name}`;
        label.htmlFor = checkbox.id; // Link label to checkbox
        label.style.marginLeft = '5px';
        label.style.cursor = 'pointer';
        label.title = node.path; // Show full path on hover

        // --- Store references in the node object and map ---
        node.element = li;
        node.checkbox = checkbox;
        node.label = label;
        node.container = container; // Store container reference
        this.treeNodes.set(node.path, node);

        // --- Set initial checked state based on current selection ---
        if (node.type === 'folder') {
            checkbox.checked = this.currentFolders.has(node.path);
        } else { // file
            checkbox.checked = this.currentFiles.has(node.path);
        }

        // --- Add event listener for checkbox changes ---
        checkbox.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const path = target.dataset.path!;
            const type = target.dataset.type as 'folder' | 'file';

            // Update the current selection sets
            if (target.checked) {
                if (type === 'folder') this.currentFolders.add(path);
                else this.currentFiles.add(path);
            } else {
                 if (type === 'folder') this.currentFolders.delete(path);
                 else this.currentFiles.delete(path);
            }
            // Update the visual state of the entire tree after a change
            this.updateTreeAppearance();
        };

        // --- Render children recursively if it's a folder ---
        if (node.type === 'folder' && node.children && node.children.length > 0) {
            const childrenUl = li.createEl('ul');
            childrenUl.style.listStyle = 'none';
            childrenUl.style.paddingLeft = '0'; // Reset padding for nested list
            childrenUl.style.marginLeft = '0'; // Prevent double indentation from default UL styles
            node.children.forEach(child => this.renderTreeNode(child, childrenUl, level + 1)); // Increase level for children
        }
    }


    /**
     * Updates the visual appearance (enabled/disabled/styling) of all nodes
     * in the tree based on the current mode and selections.
     */
    private updateTreeAppearance() {
        this.treeNodes.forEach((node) => {
            let isDisabled = false; // Should the node appear disabled (greyed out)?
            let isEffectivelyIncluded = false; // Is the node part of the 'active' set in include mode?
            let isEffectivelyExcluded = false; // Is the node part of the 'inactive' set in exclude mode?

            // Determine if an ancestor FOLDER of this node is selected
            let ancestorFolderSelected = false;
            let currentPath = node.path;
            while (currentPath !== '/') {
                 const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
                 if (this.currentFolders.has(parentPath)) {
                     ancestorFolderSelected = true;
                     break;
                 }
                 if (parentPath === currentPath) break; // Safety break at root
                 currentPath = parentPath;
            }

            // Check if the node itself is selected
            const nodeSelected = node.type === 'folder'
                ? this.currentFolders.has(node.path)
                : this.currentFiles.has(node.path);

            // --- Apply Logic Based on Mode ---
            if (this.currentMode === 'exclude') {
                // EXCLUDE Mode: A node is considered excluded if it OR an ancestor FOLDER is selected.
                // Visually disable (grey out) nodes that are excluded.
                isEffectivelyExcluded = nodeSelected || ancestorFolderSelected;
                isDisabled = isEffectivelyExcluded;
            } else { // INCLUDE Mode
                // INCLUDE Mode: A node is considered included if it OR an ancestor FOLDER is selected.
                // Visually disable (grey out) nodes that are NOT included.
                if (node.type === 'folder') {
                    isEffectivelyIncluded = nodeSelected || ancestorFolderSelected;
                } else { // file
                    // File included if selected OR parent path is included
                    const parentPath = node.path.substring(0, node.path.lastIndexOf('/')) || '/';
                    const parentEffectivelyIncluded = this.isPathEffectivelyIncluded(parentPath); // Check parent folder status
                    isEffectivelyIncluded = nodeSelected || parentEffectivelyIncluded;
                }
                isDisabled = !isEffectivelyIncluded;
            }

            // --- Apply Visual Styles ---
            // Checkbox itself should always be clickable to change selection state
            node.checkbox.disabled = false;

            // Apply styling to the container (label, icon) based on disabled state
            if (isDisabled) {
                node.container.style.opacity = '0.5';
                node.label.style.textDecoration = 'line-through'; // More prominent disabled look
                node.element.addClass('is-disabled');
            } else {
                node.container.style.opacity = '1';
                node.label.style.textDecoration = 'none';
                node.element.removeClass('is-disabled');
            }

            // --- FIX for InvalidCharacterError ---
            // Remove classes individually
            node.element.classList.remove('is-included', 'is-excluded');

            // Add specific classes for styling included/excluded states
            if (this.currentMode === 'include' && isEffectivelyIncluded) {
                node.element.addClass('is-included');
            } else if (this.currentMode === 'exclude' && isEffectivelyExcluded) {
                 // Apply excluded class even if it's just visually disabled
                 // This allows specific styling for excluded items beyond just greyed out
                node.element.addClass('is-excluded');
            }
        });
    }

    /**
     * Helper function to determine if a given path is effectively included
     * in the current selection under 'include' mode.
     * A path is included if it (file or folder) is selected, or if any of its ancestor FOLDERS are selected.
     * @param path - The folder or file path to check.
     * @returns True if the path should be considered included, false otherwise.
     */
    private isPathEffectivelyIncluded(path: string): boolean {
        // This check is primarily for 'include' mode logic.
        if (this.currentMode !== 'include') {
             // In 'exclude' mode, conceptually everything is included unless excluded.
             // For internal checks, we might need the inverse of exclusion.
             return !this.isPathEffectivelyExcluded(path);
        }

        // Check if the path itself is selected (applies to both files and folders)
        if (this.currentFiles.has(path) || this.currentFolders.has(path)) {
            return true;
        }

        // Check if any ancestor FOLDER is selected
        let current = path;
        while (current !== '/') {
            const parentPath = current.substring(0, current.lastIndexOf('/')) || '/';
            if (this.currentFolders.has(parentPath)) {
                return true; // An ancestor folder is selected
            }
            if (parentPath === current) break; // Reached root or error
            current = parentPath;
        }

        return false; // Neither the path nor any ancestor folder is selected
    }

     /**
     * Helper function to determine if a given path is effectively excluded
     * in the current selection under 'exclude' mode.
     * A path is excluded if it (file or folder) is selected, or if any of its ancestor FOLDERS are selected.
     * @param path - The folder or file path to check.
     * @returns True if the path should be considered excluded, false otherwise.
     */
    private isPathEffectivelyExcluded(path: string): boolean {
         // This check is primarily for 'exclude' mode logic.
         if (this.currentMode !== 'exclude') {
             return false;
         }

         // Check if the path itself is selected
         if (this.currentFiles.has(path) || this.currentFolders.has(path)) {
             return true;
         }

         // Check if any ancestor FOLDER is selected
         let current = path;
         while (current !== '/') {
             const parentPath = current.substring(0, current.lastIndexOf('/')) || '/';
             if (this.currentFolders.has(parentPath)) {
                 return true; // An ancestor folder is selected
             }
             if (parentPath === current) break; // Reached root or error
             current = parentPath;
         }

         return false; // Neither the path nor any ancestor folder is selected for exclusion
    }


    /**
     * Combines building the tree data, rendering the DOM, and applying initial appearance.
     */
    private buildAndRenderTree() {
        this.renderTree(); // Build data and render DOM elements
        this.updateTreeAppearance(); // Apply styles based on current mode/selection
    }


    /**
     * Called when the modal is closed. Cleans up resources.
     */
    onClose() {
        // Gather the final state ONLY when OK is clicked
        const result: DirectorySelectionResult = {
            folders: Array.from(this.currentFolders),
            files: Array.from(this.currentFiles),
            mode: this.currentMode,
            display: this.currentDisplay,
        };
        console.log("OK Clicked - Returning Result:", result); // Debug log
        this.okCallback(result); // Pass the final selection back
        const { contentEl } = this;
        contentEl.empty(); // Clear the modal's content
        this.treeNodes.clear(); // Clear the node map to free memory
        this.modeDropdown = null; // Clear reference
    }
}

/**
 * Helper function to easily open the Directory Selection Modal.
 *
 * @param app - The Obsidian App instance.
 * @param initialFolders - Array of initially selected folder paths.
 * @param initialFiles - Array of initially selected file paths.
 * @param initialMode - The initial selection mode ('include' or 'exclude').
 * @param okCallback - Function to call when the user clicks "OK". Receives the selection result.
 */
export function openDirectorySelectionModal(
    app: App,
    initialFolders: string[],
    initialFiles: string[],
    initialMode: 'include' | 'exclude',
    initialDisplay: 'folders' | 'files',
    includeExcludeSelectable: boolean,
    okCallback: (result: DirectorySelectionResult | null) => void
): void {
    // Create and open the modal instance
    new DirectorySelectionModal(
        app,
        initialFolders,
        initialFiles,
        initialMode,
        initialDisplay,
        includeExcludeSelectable,
        okCallback
    ).open();
}

/*
// --- Example Usage in your Plugin's Settings Tab ---
// (Place this in your settings tab file, e.g., settings.ts)

import { App, PluginSettingTab, Setting } from 'obsidian';
import { openDirectorySelectionModal, DirectorySelectionResult } from './DirectorySelectionModal'; // Adjust path as needed
import YourPlugin from './main'; // Adjust path to your main plugin file

// --- Example Plugin Settings Interface (in your main.ts or settings file) ---
export interface YourPluginSettings {
    selectedFolders: string[];
    selectedFiles: string[];
    selectionMode: 'include' | 'exclude';
    // ... other settings for your plugin
}

export const DEFAULT_SETTINGS: YourPluginSettings = {
    selectedFolders: [],
    selectedFiles: [],
    selectionMode: 'exclude', // Default mode is often 'exclude'
    // ... other default settings
}


export class YourPluginSettingsTab extends PluginSettingTab {
    plugin: YourPlugin;

    constructor(app: App, plugin: YourPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Einstellungen für Mein Plugin' }); // Settings Title in German

        // --- Button to Open the Modal ---
        new Setting(containerEl)
            .setName('Verzeichnisse/Dateien konfigurieren') // Setting Name in German
            .setDesc('Klicke auf den Button, um die Auswahl zu bearbeiten.') // Setting Description in German
            .addButton(button => {
                button
                    .setButtonText('Auswahl öffnen') // Button Text in German
                    .setCta() // Makes the button more prominent
                    .onClick(() => {
                        // Retrieve current settings to pre-populate the modal
                        const currentFolders = this.plugin.settings.selectedFolders || [];
                        const currentFiles = this.plugin.settings.selectedFiles || [];
                        const currentMode = this.plugin.settings.selectionMode || 'exclude'; // Use default if not set

                        // Open the modal
                        openDirectorySelectionModal(
                            this.app,
                            currentFolders,
                            currentFiles,
                            currentMode,
                            // This is the okCallback function:
                            (result: DirectorySelectionResult) => {
                                console.log('Auswahl bestätigt:', result); // Log result in German console

                                // --- IMPORTANT: Save the results back to your plugin settings ---
                                this.plugin.settings.selectedFolders = result.folders;
                                this.plugin.settings.selectedFiles = result.files;
                                this.plugin.settings.selectionMode = result.mode;
                                this.plugin.saveSettings(); // Persist the changes

                                // Optionally, re-render the settings tab to show the updated selection
                                this.display(); // Re-render settings tab
                            }
                        );
                    });
            });

         // --- Display Current Selection (Read-only) ---
         const selectionInfoEl = containerEl.createDiv({ cls: 'settings-selection-info' });
         selectionInfoEl.createEl('h4', { text: 'Aktuelle Auswahl:' }); // Section Title in German
         const modeText = `Modus: ${this.plugin.settings.selectionMode || 'Nicht festgelegt'}`; // Text in German
         // Truncate long lists for display if necessary
         const folderText = `Ausgewählte Ordner: ${(this.plugin.settings.selectedFolders?.length || 0)} Stück`; // Text in German
         const fileText = `Ausgewählte Dateien: ${(this.plugin.settings.selectedFiles?.length || 0)} Stück`; // Text in German

         selectionInfoEl.createEl('p', { text: modeText });
         selectionInfoEl.createEl('p', { text: folderText });
         selectionInfoEl.createEl('p', { text: fileText });
         // You could add a small button/link here to view the full list if it's long
    }
}
*/
