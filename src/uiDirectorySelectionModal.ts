import exp from 'constants';
import { App, Modal, Setting, TAbstractFile, TFile, TFolder, ToggleComponent, Vault, setIcon } from 'obsidian'; // Added setIcon
import { DEBUG, logger } from './Log';

// Define the structure for tree nodes
interface TreeNode {
    path: string;
    name: string;
    directoryType: DirectorySelectionType; // 'folder' | 'file';
    children?: TreeNode[];
    element: HTMLElement; // Reference to the list item element (li)
    checkbox: HTMLButtonElement | HTMLInputElement; // Reference to the checkbox element
    label: HTMLLabelElement;
    container: HTMLElement; // Reference to the container div holding checkbox and label
}

export type DirectorySelectionMode = 'include' | 'exclude' | 'includeAndExclude';
export type DirectoryDisplayMode = 'folders' | 'files' | 'folder' | 'file'; // Define display modes
export interface uiDirectorySelectionOptions {
    title?: string; // Title of the modal
    selectionMode: DirectorySelectionMode; // 'include' or 'exclude'
    displayMode: DirectoryDisplayMode; // 'folders' or 'files'
    optionSelectionMode: boolean; // Show include/exclude option
    optionShowFiles: boolean; // Show files option
}
// Define the result structure returned by the modal
export type DirectorySelectionState = {path: string, type: DirectorySelectionType, state: DirectorySelectionStateType};
export interface DirectorySelectionResult {
    folders: string[];
    files: string[];
    state: DirectorySelectionState[]; // Array of objects with path, type, and state
    mode: DirectorySelectionMode;
    display: DirectoryDisplayMode;
}

export type DirectorySelectionType = 'folder' | 'file';
export type DirectorySelectionStateType = 'include' | 'exclude' | 'none' | 'inheritedInclude' | 'inheritedExclude'; // State of the item in the selection
export interface DirectorySelectionItem {
    type: DirectorySelectionType; // Type of the item
    state: DirectorySelectionStateType; // State of the item in the selection
    source?: string; // Optional source for the item, e.g., 'inherited' for inherited state
}

/**     
 * Obsidian Modal for selecting directories and files from the vault structure.
 */
export class DirectorySelectionModal extends Modal {
    // Initial state passed to the modal (stored for reset functionality)
    private readonly initialFoldersSnapshot: ReadonlySet<string>;
    private readonly initialFilesSnapshot: ReadonlySet<string>;
    private readonly initialStateSnapshot: ReadonlyMap<string, DirectorySelectionItem>;
    private readonly initialModeSnapshot: DirectorySelectionMode;
    private readonly initialDisplaySnapshot: DirectoryDisplayMode;
    private readonly options: uiDirectorySelectionOptions; // Options for the modal
    private readonly okCallback: (result: DirectorySelectionResult | null) => void;

    // Current state being modified within the modal
    private currentFolders!: Set<string>;
    private currentFiles!: Set<string>;
    private currentState!: Map<string, DirectorySelectionItem>;
    private inheritedState!: Map<string, DirectorySelectionItem>;
    private currentMode!: DirectorySelectionMode;
    private currentDisplay!: DirectoryDisplayMode;
    private includeExcludeSelectable!: boolean;
    private showFiles: boolean = false; // State for showing files in the tree

    // UI Elements
    private treeRootElement!: HTMLElement; // Container for the tree view
    private treeNodes: Map<string, TreeNode> = new Map(); // Map path to node info for quick access
    private modeDropdown: Setting | null = null; // Reference to update dropdown on reset
    private showFilesBtn: ToggleComponent | null = null; // Reference to update show files toggle on reset

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
        initialOptions: uiDirectorySelectionOptions,
        okCallback: (result: DirectorySelectionResult | null) => void,
        initialState: DirectorySelectionState[] = [],
        inheritedState: DirectorySelectionState[] | undefined = undefined,
    ) {
        super(app);
        // Store initial state for reset
        this.initialFoldersSnapshot = new Set(initialFolders);
        this.initialFilesSnapshot = new Set(initialFiles);

        this.initialModeSnapshot = initialOptions.selectionMode;
        this.initialDisplaySnapshot = initialOptions.displayMode;
        this.showFiles = initialOptions.displayMode==='files' || 
            initialOptions.displayMode==='file'|| 
            initialFiles.length>0 || 
            countStateItems(initialState, 'file', 'include') > 0 || 
            countStateItems(initialState, 'file', 'exclude') > 0; 

        this.options = initialOptions;
        this.okCallback = okCallback;

        switch (initialOptions.selectionMode) {
            case 'includeAndExclude':
            case 'include':
                this.addToCurrentState(this.currentState, initialFolders, 'folder', 'include');
                this.addToCurrentState(this.currentState, initialFiles, 'file', 'include');
                break;
            case 'exclude':
                this.addToCurrentState(this.currentState, initialFolders, 'folder', 'exclude');
                this.addToCurrentState(this.currentState, initialFiles, 'file', 'exclude');
                break;
        }
        if (initialOptions.selectionMode === 'includeAndExclude') {
            if (!this.currentState) {
                this.currentState = new Map<string, DirectorySelectionItem>();
            }
            initialState.forEach(item => {
                this.addToCurrentState(this.currentState, item.path, item.type, item.state);
            });
            if (inheritedState) {
                inheritedState.forEach(item => {
                    if (!this.inheritedState) {
                        this.inheritedState = new Map<string, DirectorySelectionItem>();
                    }
                    this.addToCurrentState(this.inheritedState, item.path, item.type, item.state);
                });
            }
        }
        this.initialStateSnapshot = new Map<string, DirectorySelectionItem>(this.currentState);
        // Initialize current state from initial state for editing
        this.resetSelectionToInitial(); // Use a method for initialization and reset
        return this;
    }

    addInheritedState(inheritedState: DirectorySelectionState[], source: string = 'inherited'): void {
        if (!this.inheritedState) {
            this.inheritedState = new Map<string, DirectorySelectionItem>();
        }
        inheritedState.forEach(item => {
            this.addToCurrentState(this.inheritedState, item.path, item.type, item.state, source);
        });
        this.showFiles = this.showFiles ||
            countStateItems(inheritedState, 'file', 'include') > 0 ||
            countStateItems(inheritedState, 'file', 'exclude') > 0;
        if (this.showFilesBtn) {
            this.showFilesBtn.setValue(this.showFiles); // Update the toggle state
        }
        this.renderTree(); // Re-render the tree to reflect inherited state
        this.updateTreeAppearance();
    }

    private addToCurrentState(stateMap: Map<string, DirectorySelectionItem>, pathArray: string[] | string, type: DirectorySelectionType, state: DirectorySelectionStateType, source?: string): void {
        const paths = Array.isArray(pathArray) ? pathArray : [pathArray];
        paths.forEach(path => {
            const item: DirectorySelectionItem = { type, state, source };
            stateMap.set(path, item);
        });
    }

    /**
     * Resets the current selection state to the initial state provided at construction.
     */
    private resetSelectionToInitial(): void {
        this.currentFolders = new Set(this.initialFoldersSnapshot);
        this.currentFiles = new Set(this.initialFilesSnapshot);
        this.currentState = new Map(this.initialStateSnapshot);
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
        this.currentState = new Map<string, DirectorySelectionItem>();
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
            contentEl.createEl('h2', { text: this.options.title || 'Include or Exclude Folders and Files' }); 
        } else {
            contentEl.createEl('h2', { text: this.options.title || `${this.currentMode === 'exclude' ? 'Exclude' : 'Include'} Folders and Files` }); 
        }

        // --- Settings Controls ---
        const controlsEl = contentEl.createDiv({ cls: 'modal-controls' });
        this.createModeSetting(controlsEl); // Create mode dropdown
        this.createShowFilesSetting(controlsEl); // Create file toggle

        // --- Tree Container ---
        this.treeRootElement = contentEl.createDiv({ cls: 'tree-view-container' });
        this.treeRootElement.style.maxHeight = '600px';
        this.treeRootElement.style.overflowY = 'auto';
        this.treeRootElement.style.border = '1px solid var(--background-modifier-border)';
        this.treeRootElement.style.padding = '10px';
        this.treeRootElement.style.marginTop = '10px';
        this.treeRootElement.style.marginBottom = '10px';

        // --- Build and Render Tree ---
        if (!this.treeNodes.size) { // Ensure the tree is only rendered once
            this.buildAndRenderTree(); // Initial rendering based on current state
        }

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
                        .addOption('includeAndExclude', 'include & exclude')
                        .setValue(this.currentMode) // Set initial value
                        .onChange(value => {
                            this.currentMode = value as DirectorySelectionMode; // Update current mode
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
        if (this.options.optionShowFiles) {
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
                    this.showFilesBtn = toggle; // Store reference for reset
                });
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
            // logger.log(DEBUG,"Cancel Clicked - Returning"); // Debug log
            this.okCallback( null ); // Pass the final selection back
            this.close();
        };

        // OK Button
        const okButton = buttonsEl.createEl('button', { text: 'OK', cls: 'mod-cta' });
        okButton.ariaLabel = 'close and save changes'; // Accessibility
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
            path: '/', // Root folder path
            name: this.app.vault.getName() || 'Vault', // Use vault name or default
            directoryType: 'folder',
            children: [],
            // Placeholder elements, will be assigned during rendering
            element: null!,
            checkbox: null!,
            label: null!,
            container: null!,
        };

        const folderNodes = new Map<string, TreeNode>();
        folderNodes.set('/', vaultRootNode); // Add root to the map

        // Use getFiles() to retrieve all TFile objects (Markdown, images, pdf, etc.)
        const allFiles = this.app.vault.getFiles();

        // --- Step 1: Create all folder nodes based on file parent paths ---
        allFiles.forEach(file => {
            const parentFolder = file.parent;
            if (!parentFolder) return;

            let currentPath = '';
            const pathParts = parentFolder.path.split('/').filter(p => p.length > 0);

            let parentNode = vaultRootNode; // Start from vault root
            pathParts.forEach(part => {
                currentPath = currentPath === '/' ? part : `${currentPath}/${part}`;
                if (!folderNodes.has(currentPath)) {
                    const newFolderNode: TreeNode = {
                        path: currentPath,
                        name: part,
                        directoryType: 'folder',
                        children: [],
                        element: null!,
                        checkbox: null!,
                        label: null!,
                        container: null!,
                    };
                    folderNodes.set(currentPath, newFolderNode);
                    if (!parentNode.children) {
                        parentNode.children = [];
                    }
                    parentNode.children!.push(newFolderNode);
                    parentNode = newFolderNode;
                } else {
                    parentNode = folderNodes.get(currentPath)!;
                }
            });
        });

        // --- Step 2: Add file nodes if 'showFiles' is enabled ---
        if (this.showFiles) {
            allFiles.forEach(file => {
                const parentFolder = file.parent;
                let parentPath = "";
                if (parentFolder) {
                    parentPath = "/" + (parentFolder.path=== '/' ? '' : parentFolder.path); // Ensure the path starts with a slash
                } // Ensure the path starts with a slash

                const parentNode = folderNodes.get(parentPath);

                const fileNode: TreeNode = {
                    path: file.path,
                    name: file.name,
                    directoryType: 'file',
                    element: null!,
                    checkbox: null!,
                    label: null!,
                    container: null!,
                };

                if (parentNode) {
                    if (!parentNode.children) {
                        parentNode.children = [];
                    }
                    parentNode.children!.push(fileNode);
                }
            });
        }

        // --- Step 3: Sort children alphabetically (folders first, then files) ---
        const sortNodes = (a: TreeNode, b: TreeNode) => {
            if (a.directoryType === 'folder' && b.directoryType === 'file') return -1;
            if (a.directoryType === 'file' && b.directoryType === 'folder') return 1;
            return a.name.localeCompare(b.name);
        };

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

         // Render the root folder itself
         this.renderTreeNode(treeData, rootUl, 0, this.currentFolders, this.currentFiles); 

         // Render children of the root folder
         /*
         treeData.children?.forEach(childNode => {
             this.renderTreeNode(childNode, rootUl, 1, this.currentFolders, this.currentFiles); // Start rendering at level 1
         });
            */
    }

    /**
     * Recursively renders a single tree node and its children in the DOM.
     * @param node - The TreeNode data to render.
     * @param parentElement - The HTML `ul` element to append this node's `li` to.
     * @param level - The current indentation level.
     */
    private renderTreeNode(node: TreeNode, parentElement: HTMLElement, level: number, selectedPaths: Set<string>, selectedFiles: Set<string>) {
        const li = parentElement.createEl('li');
        li.style.marginLeft = `${level * 20}px`; // Apply indentation based on level
        li.addClass(`tree-node-${node.directoryType}`); // Add class for type (folder/file)

        const container = li.createDiv({ cls: 'tree-node-container' });
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.padding = '2px 0'; // Add some vertical padding

        // --- Toggle Button for Folders ---
        let toggleButton: HTMLElement | null = null;
        let isCollapsed = true; // Default state is collapsed

        if (node.directoryType === 'folder') {
            toggleButton = container.createSpan({ cls: 'tree-toggle-button' });
            toggleButton.textContent = '▶'; // Right-pointing triangle
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.marginRight = '5px';

            // Check if this folder or any of its children are selected
            const shouldExpand = (this.currentMode === 'includeAndExclude') ? this.shouldExpandFolderByState(node, this.currentState, this.inheritedState) : this.shouldExpandFolder(node, selectedPaths, selectedFiles);
            if (shouldExpand) {
                isCollapsed = false;
            }

            toggleButton.onclick = () => {
                isCollapsed = !isCollapsed;
                if (toggleButton) toggleButton.textContent = isCollapsed ? '▶' : '▼'; // Update triangle direction
                if (childrenUl) childrenUl.style.display = isCollapsed ? 'none' : 'block'; // Show/hide children
            };
        }

        // --- Checkbox ---
        let checkbox: HTMLButtonElement | HTMLInputElement;
        if (this.currentMode === 'includeAndExclude') {
            // Determine current state for this node
            const currentState = this.currentState.get(node.path);
            let state: DirectorySelectionStateType = currentState?.state || 'none';

            checkbox = container.createEl('button');
            checkbox.className = 'FMA-tri-state-checkbox';
            this.getTriStateIcon(state, checkbox);

            checkbox.onclick = (event) => {
                const target = event.currentTarget as HTMLButtonElement;
                const path = target.dataset.path!;
                const currentState = this.currentState.get(path);
                const type = currentState?.type || node.directoryType;
                let state = currentState?.state || 'none';
                switch (state) {
                    case 'include':
                        state = 'none'; 
                        const inheritedItem = this.inheritedState?.get(path);
                        // If the item is inherited, toggle to inherited state
                        switch (inheritedItem?.state) {
                            case 'include':
                                state = 'inheritedInclude';
                                break;
                            case 'exclude':
                                state = 'inheritedExclude';
                                break;
                        }
                        break;
                    case 'exclude':
                        state = 'include'; 
                        break;
                    case 'inheritedInclude':
                        state = 'exclude'; 
                        break;
                    case 'inheritedExclude':
                        state = 'exclude'; 
                        break;
                    case 'none':
                        state = 'exclude'; 
                        break;
                    default:
                        state = 'include'; 
                };
                this.currentState.set(path, { type, state });
                this.getTriStateIcon(state, checkbox as HTMLButtonElement);
                this.updateTreeAppearance();
                logger.log(DEBUG, `Checkbox clicked for ${path}, new state: ${state}`);
            };
            // Store reference if needed
            node.checkbox = checkbox as any;
        } else {
            checkbox = container.createEl('input', { type: 'checkbox' });
            checkbox.style.top = '0px'; // Align checkbox vertically
             // --- Add event listener for checkbox changes ---
            checkbox.onchange = (event) => {
                const target = event.target as HTMLInputElement;
                const path = target.dataset.path!;
                const type = target.dataset.type as DirectorySelectionType; // Get type from data attribute

                // Update the current selection sets
                if (target.checked) {
                    if (type === 'folder'){
                        if (this.options.displayMode === 'folder') {
                            this.currentFolders.clear(); // Clear previous selection if only one folder can be selected

                        }
                        this.currentFolders.add(path);
                    } else {
                        if (this.options.displayMode === 'file') {
                            this.currentFiles.clear(); // Clear previous selection if only one file can be selected
                        }
                        this.currentFiles.add(path);
                    }
                } else {
                    if (type === 'folder') this.currentFolders.delete(path);
                    else this.currentFiles.delete(path);
                }
                // Update the visual state of the entire tree after a change
                this.updateTreeAppearance();
            };
        }
        checkbox.id = `tree-cb-${node.path.replace(/[^a-zA-Z0-9]/g, '-')}`; // Create a safe ID
        checkbox.dataset.path = node.path; // Store path in data attribute
        checkbox.dataset.type = node.directoryType; // Store type

        // --- Label ---
        const label = container.createEl('label');
        label.textContent = `${node.directoryType === 'folder' ? '📁' : '📄'} ${node.name}`;
        // label.textContent = node.name;
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
        this.setCheckbox(checkbox,node); // Set checkbox state based on current selection)
        if (node.directoryType === 'folder') {
            //checkbox.checked = this.currentFolders.has(node.path);
        } else { // file
            //checkbox.checked = this.currentFiles.has(node.path);
        }

       

        // --- Render children recursively if it's a folder ---
        let childrenUl: HTMLElement | null = null;
        if (node.directoryType === 'folder' && node.children && node.children.length > 0) {
            childrenUl = li.createEl('ul');
            childrenUl.style.listStyle = 'none';
            childrenUl.style.paddingLeft = '0'; // Reset padding for nested list
            childrenUl.style.marginLeft = '0'; // Prevent double indentation from default UL styles
            childrenUl.style.display = isCollapsed ? 'none' : 'block'; // Show/hide children based on initial state

            node.children.forEach(child => this.renderTreeNode(child, childrenUl!, level + 1, selectedPaths, selectedFiles)); // Increase level for children
        }
    }

    private setCheckbox(checkbox: HTMLButtonElement | HTMLInputElement, node: TreeNode) {
        if (checkbox instanceof HTMLInputElement) {
            if (node.directoryType === 'folder') {
                checkbox.checked = this.currentFolders.has(node.path);
            } else {
                checkbox.checked = this.currentFiles.has(node.path);
            }
        }
    }

    // Helper method to determine if a folder should be expanded
    private shouldExpandFolderByState(node: TreeNode, currentState: Map<string, DirectorySelectionItem>, inheritedState: Map<string, DirectorySelectionItem>): boolean {
        if (currentState.get(node.path)?.state === 'include' || currentState.get(node.path)?.state === 'exclude') {
            return true; 
        }
        if (inheritedState && (inheritedState.get(node.path)?.state === 'include' || inheritedState.get(node.path)?.state === 'exclude')) {
            return true; 
        }

        if (node.children) {
            for (const child of node.children) {
                if (this.shouldExpandFolderByState(child, currentState, inheritedState)) {
                    return true; // A child is selected
                }
            }
        }

        return false; // Neither the folder nor its children are selected
    }
    private shouldExpandFolder(node: TreeNode, selectedPaths: Set<string>, selectedFiles: Set<string>): boolean {
        if (selectedPaths.has(node.path) || selectedFiles.has(node.path)) {
            return true; // The folder itself is selected
        }

        if (node.children) {
            for (const child of node.children) {
                if (this.shouldExpandFolder(child, selectedPaths, selectedFiles)) {
                    return true; // A child is selected
                }
            }
        }

        return false; // Neither the folder nor its children are selected
    }
    /**
     * Checks if a file or folder is effectively included or excluded based on currentState.
     * @param path - The file or folder path to check.
     * @param currentState - The Map<string, DirectorSelectionItem> with state info.
     * @returns true if included, false if excluded or not included.
     */
    private isPathEffectivelyIncludedOrExcluded(
        node: TreeNode,
        currentState: Map<string, DirectorySelectionItem>,
        inheritedState: Map<string, DirectorySelectionItem>
    ): DirectorySelectionStateType {
        let current = node.path;
        let effectiveState: DirectorySelectionStateType = 'none';
        while (true) {
            const stateItem = currentState.get(current);
            if (stateItem) {
                if (stateItem.state === 'exclude' || stateItem.state === 'include') {
                    return stateItem.state; // Return the state if found in currentState
                }
            }
            if (inheritedState) {
                const inheritedItem = inheritedState?.get(current);
                if (inheritedItem) {
                    // If inherited state is set, use it
                    if (inheritedItem.state === 'exclude' && effectiveState !== 'inheritedInclude') effectiveState = 'inheritedExclude';
                    if (inheritedItem.state === 'include') effectiveState = 'inheritedInclude';
                }
            }
            // Move up to parent path
            if (current === '/' || current === '') break;
            let parentPath = current.substring(0, current.lastIndexOf('/')) || '/';
            if (!parentPath.startsWith('/')) {
                // Ensure parent path is always absolute
                parentPath = '/' + parentPath;
            }
            if (parentPath === current) break;
            current = parentPath;
        }
        return effectiveState;
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
            let currentPath = "";
            if (node.directoryType === 'folder') {
                currentPath = node.path;
            } else {
                currentPath = "/" + node.path.substring(0, node.path.lastIndexOf('/'));
                if (currentPath === '/') {
                    if (this.currentFolders.has(currentPath)) {
                        ancestorFolderSelected = true;
                    }
                }
            }

            while (currentPath !== '/') {
                // check if the folder of the file is selected
                if (node.directoryType === 'file' && this.currentFolders.has(currentPath)) {
                    ancestorFolderSelected = true; // If the file itself is selected, no need to check further
                    break;
                }
                 // Check if the parent folder is selected
                 const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
                 if (this.currentFolders.has(parentPath)) {
                     ancestorFolderSelected = true;
                     break;
                 }
                 if (parentPath === currentPath) break; // Safety break at root
                 currentPath = parentPath;
            }

            // Check if the node itself is selected
            const nodeSelected = node.directoryType === 'folder'
                ? this.currentFolders.has(node.path)
                : this.currentFiles.has(node.path);

            // --- Apply Logic Based on Mode ---
            switch (this.currentMode) {
                case 'exclude': {
                    // EXCLUDE Mode: A node is considered excluded if it OR an ancestor FOLDER is selected.
                    // Visually disable (grey out) nodes that are excluded.
                    isEffectivelyExcluded = nodeSelected || ancestorFolderSelected;
                    isDisabled = isEffectivelyExcluded;
                    break;
                }
                case 'include': { // INCLUDE Mode
                    // INCLUDE Mode: A node is considered included if it OR an ancestor FOLDER is selected.
                    // Visually disable (grey out) nodes that are NOT included.
                    if (node.directoryType === 'folder') {
                        isEffectivelyIncluded = nodeSelected || ancestorFolderSelected;
                    } else { // file
                    // File included if selected OR parent path is included
                    const parentPath = node.path.substring(0, node.path.lastIndexOf('/')) || '/';
                    const parentEffectivelyIncluded = this.isPathEffectivelyIncluded('/' + parentPath); // Check parent folder status
                    isEffectivelyIncluded = nodeSelected || parentEffectivelyIncluded;
                    }
                    isDisabled = !isEffectivelyIncluded;
                    break;
                }
                case 'includeAndExclude':
                    let state = this.isPathEffectivelyIncludedOrExcluded(node, this.currentState, this.inheritedState);
                    if (node.checkbox instanceof HTMLButtonElement) {
                        // For tri-state button, update icon based on state
                        // this.getTriStateIcon(this.currentState.get(node.path)?.state || 'none', node.checkbox as HTMLButtonElement);
                        let buttonState: DirectorySelectionStateType = 'none';
                        const inheritedStateItem = this.inheritedState?.get(node.path);
                        if (inheritedStateItem) {
                            // If inherited state is set, use it
                            switch (inheritedStateItem.state) {
                                case 'include':
                                    buttonState = 'inheritedInclude';
                                    break;
                                case 'exclude':
                                    buttonState = 'inheritedExclude';
                                    break;
                            }
                            node.checkbox.ariaLabel = `Inherited from ${inheritedStateItem.source || 'unknown'}`;
                        }
                        switch(this.currentState.get(node.path)?.state) {
                            case 'include':
                                buttonState = 'include';
                                break;
                            case 'exclude':
                                buttonState = 'exclude';
                                break;
                            case 'none':
                                buttonState = 'none';
                                break;
                        }
                        this.getTriStateIcon(buttonState, node.checkbox as HTMLButtonElement);

                    }
                    node.element.classList.remove('is-included', 'is-excluded', 'is-inherited-included', 'is-inherited-excluded');
                    switch (state) {
                        case 'include':
                            node.element.addClass('is-included');
                            break;
                        case 'exclude':
                            node.element.addClass('is-excluded');
                            break;
                        case 'inheritedInclude':
                            node.element.addClass('is-inherited-included');
                            break;
                        case 'inheritedExclude':
                            node.element.addClass('is-inherited-excluded');
                            break;
                    }
                    return;

            }

            // --- Apply Visual Styles ---
            // Checkbox itself should always be clickable to change selection state
            node.checkbox.disabled = false;
            if (node.checkbox instanceof HTMLInputElement) {
                node.checkbox.checked = nodeSelected;
            } else if (node.checkbox instanceof HTMLButtonElement) {
                // For tri-state button, update icon based on state
                this.getTriStateIcon(this.currentState.get(node.path)?.state || 'none', node.checkbox);
            }

            // Apply styling to the container (label, icon) based on disabled state
            if (isDisabled) {
                node.element.addClass('is-disabled');
            } else {
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
        logger.log(DEBUG,'Building and rendering tree...');
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
            state: Array.from(this.currentState.entries()).map(([path, item]) => ({
                path,
                type: item.type,
                state: item.state,
            })).filter(item => item.state !== 'none'), // Filter out 'none' states
            mode: this.currentMode,
            display: this.currentDisplay,
        };
        // logger.log(DEBUG,"OK Clicked - Returning Result:", result); // Debug log
        this.okCallback(result); // Pass the final selection back
        const { contentEl } = this;
        contentEl.empty(); // Clear the modal's content
        this.treeNodes.clear(); // Clear the node map to free memory
        this.modeDropdown = null; // Clear reference
    }

    getTriStateIcon(state: DirectorySelectionStateType, button: HTMLButtonElement): void {
        // Remove previous icon if any
        button.innerHTML = "";
        let icon = "circle";
        let color = "";
        switch (state) {
            case "include":
                icon = "circle-check";
                color = "var(--color-green, #4caf50)";
                break;
            case "exclude":
                icon = "circle-x";
                color = "var(--color-red, #e53935)";
                break;
            case "inheritedInclude":
                icon = "circle-check";
                color = "var(--background-modifier-border, #ccc)";
                break;
            case "inheritedExclude":
                icon = "circle-x";
                color = "var(--background-modifier-border, #ccc)";
                break;
            default:
                icon = "circle";
                color = "var(--background-modifier-border, #ccc)";
        }
        setIcon(button, icon);
        button.style.backgroundColor = color;
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
    options: uiDirectorySelectionOptions,
    okCallback: (result: DirectorySelectionResult | null) => void,
    initialState: DirectorySelectionState[] = [],
    inheritedState: DirectorySelectionState[] | undefined = undefined,
) {
    // Create and open the modal instance
    const modal = new DirectorySelectionModal(
        app,
        initialFolders,
        initialFiles,
        options,
        okCallback,
        initialState,
        inheritedState
    );
    modal.open();
    return modal; // Return the modal instance for further manipulation if needed
}

export function countStateItems(stateArray: DirectorySelectionState[], type: DirectorySelectionType, state: DirectorySelectionStateType): number {
    if (!stateArray || !Array.isArray(stateArray)) {
        return 0; // Return 0 if the stateArray is not valid
    }
    return stateArray.filter(item => item.type === type && item.state === state).length;
}