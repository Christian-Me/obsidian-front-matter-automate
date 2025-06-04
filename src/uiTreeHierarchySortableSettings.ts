import { Setting, ExtraButtonComponent, TextComponent, SearchComponent } from "obsidian";
import { logger, TRACE } from "./Log";

export type TreeHierarchyFolder = {
    id: string;
    name: string;
    parentId?: string;
    disabled: boolean; // Added to support disabling folders
    collapsed: boolean; // Add this line
};
export type TreeHierarchyRow = {
    id: string;
    folderId?: string;
    keywords: string[];
    disabled: boolean; // Added to support disabling rows
    payload?: any; // Optional payload for custom data
};
type FMAFolderListDragTarget = "folder" | "row" | "root";

export type TreeHierarchyData = {
    folders: TreeHierarchyFolder[];
    rows: TreeHierarchyRow[];
};

export const ROOT_FOLDER = undefined; // Special identifier for root folder

type RowRenderCallback = (row: TreeHierarchyRow, rowEl: HTMLElement) => void;

export class TreeHierarchySortableSettings {
    public settingEl: HTMLElement;
    private container: HTMLElement;
    private data: TreeHierarchyData;
    private title: string = "";
    private description: string = "";
    private filter: string = "";
    private rowRenderCb: RowRenderCallback;
    private onChangeCb: (data: TreeHierarchyData, row?: TreeHierarchyRow | undefined ) => void = () => {};
    private onRowCreatedCb: (row: TreeHierarchyRow) => void = () => {};
    private onRowDeletedCb: (row: TreeHierarchyRow) => void = () => {};
    private onDeleteBtCb: () => void = () => {};
    private onRenderedCb: () => void = () => {};
    private extraButtonCbs: ((btn: Setting) => void)[] = [];
    private rowMatchesFilterFn: (row: TreeHierarchyRow, filter: string) => boolean = (row, filter) => {
        if (!filter) return true;
        return row.keywords.some(k => k.toLowerCase().includes(filter.toLowerCase()));
    };
    
    constructor(container: HTMLElement, data: TreeHierarchyData, rowRenderCb: RowRenderCallback) {
        this.container = container;
        this.settingEl = container.createDiv({ cls: "FMA-folder-list-setting" });
        this.data = data || { folders: [], rows: [] };
        this.rowRenderCb = rowRenderCb;
        this.render();
        this.onRenderedCb = () => {};
    }
    setTitle(title: string) {
        this.title = title;
        this.render();
        return this;
    }
    setDescription(description: string) {
        this.description = description;
        this.render();
        return this;
    }
    addExtraButtonToHeader(cb: (btn: Setting) => void) {
        this.extraButtonCbs.push(cb);
        this.render();
        return this;
    }
    onDeleteBt(cb: () => void) {
        this.onDeleteBtCb = cb;
        return this;
    }
    addRow(folderId: string | undefined, keywords: string[] = [], payload?: any) {
        const newRow: TreeHierarchyRow = {
            id: crypto.randomUUID(),
            folderId,
            keywords,
            disabled: false,
            payload,
        };
        if (!folderId) {
            // If no folderId, add to root (undefined folder)
            this.data.rows.push(newRow);
            this.onRowCreatedCb(newRow);
            this.onChangeCb(this.data, newRow);
            this.render();
            return this;
        }
        // Find the last row with the same folderId
        const lastIdx = this.data.rows.map(r => r.folderId).lastIndexOf(folderId);
        if (lastIdx === -1) {
            // No rows in this folder, insert at the start
            this.data.rows.unshift(newRow);
        } else {
            // Insert after the last row in this folder
            this.data.rows.splice(lastIdx + 1, 0, newRow);
        }
        this.onRowCreatedCb(newRow);
        this.onChangeCb(this.data, newRow);
        this.render();
        return this;
    }
    addFolder(name: string, parentId?: string) {
        const newFolder: TreeHierarchyFolder = {
            id: crypto.randomUUID(),
            name,
            parentId,
            disabled: false, // Default to enabled
            collapsed: false, // Default to expanded
        };
        this.data.folders.push(newFolder);
        this.onChangeCb(this.data);
        this.render();
        return this
    }
    setData(data: TreeHierarchyData) {
        this.data = data;
        this.render();
        return this;
    }

    public onChange(cb: (data: TreeHierarchyData, row: TreeHierarchyRow | undefined) => void) {	
        this.onChangeCb = cb;
        return this;
    }
    public onRowCreated(cb: (row: TreeHierarchyRow) => void) {
        this.onRowCreatedCb = cb;
        return this;
    }
    public onRowDeleted(cb: (row: TreeHierarchyRow) => void) {
        this.onRowDeletedCb = cb;
        return this;
    }
    public onRendered(cb: () => void) {
        this.onRenderedCb = cb;
        return this;
    }
    public onFilter(cb: (row: TreeHierarchyRow, filter: string) => boolean) {
        this.rowMatchesFilterFn = cb;
        return this;
    }
    private moveRow(rowId: string, targetRowId?: string) {
        const fromIdx = this.data.rows.findIndex(r => r.id === rowId);
        if (fromIdx === -1) return;
        if (rowId === targetRowId) return; // Don't move onto itself

        const moved = this.data.rows[fromIdx];
        // Remove from old position
        const row = this.data.rows[fromIdx];
        this.onRowDeletedCb(row);
        logger.log(TRACE,`removing id${rowId} from ${fromIdx}`, this.data.rows);
        this.data.rows.splice(fromIdx, 1);

        let insertIdx: number;
        if (targetRowId) {
            insertIdx = this.data.rows.findIndex(r => r.id === targetRowId);
            if (insertIdx === -1) {
                // targetRowId not found, insert at end
                insertIdx = this.data.rows.length;
            }
            // Set folderId to match the target row
            const targetRow = this.data.rows[insertIdx];
            
            // Only insert after if moving down but only inside a folder
            if (fromIdx <= insertIdx && moved.folderId === targetRow?.folderId) insertIdx++;
            moved.folderId = targetRow?.folderId;
        } else {
            // No targetRowId: insert at end
            insertIdx = this.data.rows.length;
            // Optionally, set folderId to undefined or keep as is
            // moved.folderId = undefined;
        }
        logger.log(TRACE,`Inserting moved row id${rowId} at ${insertIdx}`, this.data.rows);
        this.data.rows.splice(insertIdx, 0, moved);
        this.onChangeCb(this.data);
        this.render();
    }
    private moveRowToFolder(rowId: string, folderId: string | undefined) {
        const fromIdx = this.data.rows.findIndex(r => r.id === rowId);
        if (fromIdx === -1) return;

        const moved = this.data.rows[fromIdx];
        // Remove from old position
        this.data.rows.splice(fromIdx, 1);

        // Set new folderId
        moved.folderId = folderId;

        // Insert at the end of the new folder or root
        this.data.rows.push(moved);
        this.onChangeCb(this.data);
        this.render();
    }
    private moveFolderToFolder(folderId: string, targetFolderId: string | undefined) {
        if (folderId === targetFolderId) return; // Don't move onto itself
        const fromIdx = this.data.folders.findIndex(f => f.id === folderId);
        if (fromIdx === -1) return;
        
        const moved = this.data.folders[fromIdx];
        // Remove from old position
        this.data.folders.splice(fromIdx, 1);

        // Set new parentId
        moved.parentId = targetFolderId;

        // Insert at the end of the new folder or root
        this.data.folders.push(moved);
        this.onChangeCb(this.data);
        this.render();
    }
    private propagateFolderDisabled(folderId: string, disabled: boolean) {
        // Disable all child folders
        for (const folder of this.data.folders) {
            if (folder.parentId === folderId) {
                folder.disabled = disabled;
                this.propagateFolderDisabled(folder.id, disabled);
            }
        }
        // Disable all rows in this folder
        for (const row of this.data.rows) {
            if (row.folderId === folderId) {
                row.disabled = disabled;
            }
        }
    }
    private render() {
        this.data.rows.forEach(row => {
            this.onRowCreatedCb(row);
        });
        this.settingEl.empty();

        // --- Root Header as a Setting Row ---
        const headerSetting = new Setting(this.settingEl)
            .setClass("FMA-folder-list-root-header");

        // Drag handle placeholder (for alignment)
        headerSetting.settingEl.createSpan({ cls: "FMA-folder-list-drag-handle", text: " " });
        headerSetting.settingEl.style.borderTop = "1px solid var(--background-modifier-border)"; // Add bottom border for separation
        headerSetting.settingEl.style.padding = "0.75em 0"; // Add some padding for better spacing

        // Title (could be "Root" or your custom label)
        headerSetting.setName(this.title || "");
        headerSetting.setDesc(this.description || "");

        // Filter input (inline, left of buttons)
        const filterInput = new SearchComponent(headerSetting.controlEl)
           .setPlaceholder("Filter folders/rows...")
           .setValue(this.filter)
           .onChange((val) => {
                this.filter = val;
                // Only re-render the rows/folders, not the whole UI
                this.renderList();
            }); 
        filterInput.inputEl.style.width = "200px";

        // Add row button (right)
        headerSetting.addExtraButton(btn => {
            btn.setIcon("plus-circle")
                .setTooltip("Add row to root")
                .onClick(() => {
                    this.addRow(undefined, []);
                });
        });

        // Add folder button (right)
        headerSetting.addExtraButton(btn => {
            btn.setIcon("folder")
                .setTooltip("Add folder to root")
                .onClick(() => {
                    this.addFolder(this.getNextFolderName(), undefined);
                });
        });
        
        headerSetting.addExtraButton(btn => {
            btn.setIcon("trash")
                .setTooltip("Drop here to delete row or folder")
                .onClick(() => {
                    this.onDeleteBtCb();
                    this.onChangeCb(this.data);
                    this.render();
                });
            const binEl = btn.extraSettingsEl;

            binEl.addEventListener("dragover", (e) => {
                e.preventDefault();
                binEl.classList.add("FMA-bin-drop-target");
            });
            binEl.addEventListener("dragleave", (e) => {
                binEl.classList.remove("FMA-bin-drop-target");
            });
            binEl.addEventListener("drop", (e) => {
                e.preventDefault();
                binEl.classList.remove("FMA-bin-drop-target");
                const data = e.dataTransfer?.getData("text/plain");
                if (!data) return;
                const { type, id } = JSON.parse(data);
                if (type === "row") {
                    this.data.rows = this.data.rows.filter(r => r.id !== id);
                } else if (type === "folder") {
                    this.deleteFolderAndContents(id);
                }
                this.onChangeCb(this.data);
                this.render();
            });
        });

        // Add extra buttons to the header
        this.extraButtonCbs.forEach(cb => {
            cb(headerSetting);
        });

        this.renderList();


    }

    private renderList() {
        // Remove old list (but keep header/filter)
        const oldList = this.settingEl.querySelector(".FMA-folder-list-content");
        if (oldList) oldList.remove();

        const listEl = this.settingEl.createDiv({ cls: "FMA-folder-list-content" });
        this.renderFolder(undefined, listEl, 0);
        this.renderRows(undefined, listEl, 0);

        // Render a drop zone at the end of the folder list
        const dropZone = new Setting(listEl) // <-- CHANGED from this.settingEl to listEl
            .setClass("FMA-folder-list-drop-zone");
        dropZone.settingEl.addEventListener("dragover", (e) => this.onDragOver(e, "root", "folder-dropzone"));
        dropZone.settingEl.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent multiple events
            const data = e.dataTransfer?.getData("text/plain");
            if (!data) return;
            const { type, id } = JSON.parse(data);
            if (type === "row") {
                // Move row to this folder
                this.moveRowToFolder(id, undefined);
            } else if (type === "folder") {
                // Move folder to this folder
                this.moveFolderToFolder(id, undefined);
            }
        });
        dropZone.settingEl.addEventListener("dragenter", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.settingEl.classList.add("FMA-dropzone-target");
        });
        dropZone.settingEl.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.settingEl.classList.remove("FMA-dropzone-target");
        });
        this.onRenderedCb();
    }

    private renderFolder(parentId: string | undefined, parentEl: HTMLElement, depth: number) {
        if (!this.data || !this.data.folders) return;
        const folders = this.data.folders.filter(f => f.parentId === parentId);
        folders.forEach(folder => {
            const setting = new Setting(parentEl)
                .setClass("FMA-folder-list-folder-setting");

            // --- LEFT SIDE: Drag handle + editable name ---
            setting.nameEl.empty();

            // Indent folders by 20px per depth (frame and content)
            setting.settingEl.style.marginLeft = `${depth * 20}px`;

            // Drag handle (left)
            const dragHandle = setting.nameEl.createSpan({ cls: "FMA-folder-list-drag-handle" });
            dragHandle.setText("☰");
            dragHandle.draggable = true;
            dragHandle.style.marginRight = "0.5em";
            dragHandle.addEventListener("dragstart", (e) => this.onDragStart(e, "folder", folder.id));
            dragHandle.addEventListener("dragover", (e) => this.onDragOver(e, "folder", folder.id));
            dragHandle.addEventListener("drop", (e) => this.onDrop(e, "folder", folder.id));

            // Add checkbox for disabling folder
            setting.addToggle(toggle => {
                toggle
                    .setValue(!folder.disabled)
                    .onChange((val) => {
                        folder.disabled = !val;
                        this.propagateFolderDisabled(folder.id, folder.disabled);
                        this.onChangeCb(this.data);
                        this.renderList();
                    });
            }).setTooltip("Disable all rules in this folder and subfolders");

            // Editable folder name
            const nameInput = new TextComponent(setting.nameEl);
            nameInput.setValue(folder.name);
            nameInput.inputEl.style.maxWidth = "100%";
            nameInput.inputEl.style.border = "0"
            nameInput.inputEl.style.marginRight = "0.5em";
            nameInput.onChange((val) => {
                folder.name = val;
                this.onChangeCb(this.data);
            });

            // --- RIGHT SIDE: Action buttons ---
            setting.addExtraButton(btn => {
                btn.setIcon("plus-circle")
                    .setTooltip("Add row to folder")
                    .onClick(() => {
                        this.addRow(folder.id, []);
                    });
            });

            setting.addExtraButton(btn => {
                btn.setIcon("folder")
                    .setTooltip("Add subfolder")
                    .onClick(() => {
                        this.addFolder(this.getNextFolderName(), folder.id);
                    });
            });

            setting.addExtraButton(btn => {
                const isCollapsed = folder.collapsed ?? false;
                btn.setIcon(isCollapsed ? "chevron-right" : "chevron-down")
                    .setTooltip(isCollapsed ? "Expand" : "Collapse")
                    .onClick(() => {
                        folder.collapsed = !isCollapsed;
                        this.onChangeCb(this.data);
                        this.renderList();
                    });
            });

            // In renderFolder, before adding event listeners:
            (setting.settingEl as any)._dragEnterCount = 0;

            setting.settingEl.addEventListener("dragenter", (e) => {
                (setting.settingEl as any)._dragEnterCount++;
                setting.settingEl.classList.add("FMA-drop-target");
            });
            setting.settingEl.addEventListener("dragleave", (e) => {
                (setting.settingEl as any)._dragEnterCount--;
                if ((setting.settingEl as any)._dragEnterCount <= 0) {
                    setting.settingEl.classList.remove("FMA-drop-target");
                    (setting.settingEl as any)._dragEnterCount = 0;
                }
            });
            
            // Drag events for folder row
            setting.settingEl.addEventListener("dragover", (e) => this.onDragOver(e, "folder", folder.id));
            setting.settingEl.addEventListener("drop", (e) => this.onDrop(e, "folder", folder.id));
            setting.settingEl.addEventListener("dragleave", (e) => this.onDragLeave(e));
            
            if (folder.disabled) setting.settingEl.classList.add("FMA-mod-FolderList-disabled");

            // Render rows and subfolders
            if (!folder.collapsed) {
                this.renderFolder(folder.id, parentEl, depth + 1); // subfolders
                this.renderRows(folder.id, parentEl, depth + 1); // rows in this folder
            }
        });
    }

    private renderRows(folderId: string | undefined, parentEl: HTMLElement, depth: number) {
        if (!this.data || !this.data.rows) return;
        if (this.filter) {
            // Apply filtering logic here
            logger.log(TRACE,`Filtering rows with filter: ${this.filter}`, this.data.rows.filter(r => {
                logger.log(TRACE, `Row ${r.id} matches filter: ${this.rowMatchesFilterFn(r,this.filter)}`, r.keywords);
            }));
        }
        const rows = this.data.rows.filter(r => r.folderId === folderId && this.rowMatchesFilterFn(r, this.filter));
        rows.forEach(row => {
            const setting = new Setting(parentEl)
                .setClass("FMA-folder-list-row-setting");

            // --- LEFT SIDE: Drag handle + keywords ---
            setting.nameEl.empty();

            // Indent rows by 20px per depth (frame and content)
            setting.settingEl.style.marginLeft = `${depth * 20}px`;
            if (setting.nameEl.parentElement) {
                setting.nameEl.parentElement.style.marginInlineEnd = "0px";
                setting.nameEl.parentElement.style.width = "100%";
                setting.nameEl.parentElement.style.display = "flex";
                setting.nameEl.parentElement.style.flexDirection = "column";
            }
            setting.nameEl.style.display = "flex";
            setting.nameEl.style.width = "100%";

            // Drag handle (left)
            const dragHandle = setting.nameEl.createSpan({ cls: "FMA-folder-list-drag-handle" });
            dragHandle.setText("≡");
            dragHandle.draggable = true;
            dragHandle.style.marginRight = "0.5em";
            dragHandle.addEventListener("dragstart", (e) => this.onDragStart(e, "row", row.id));
            dragHandle.addEventListener("dragover", (e) => this.onDragOver(e, "row", row.id));
            dragHandle.addEventListener("drop", (e) => this.onDrop(e, "row", row.id));

            if (row.disabled) setting.settingEl.addClass("FMA-mod-FolderList-disabled");
            // Row content (customizable, e.g. keywords)
            this.rowRenderCb(row, setting.nameEl);  

            // Drag events for row
            setting.settingEl.addEventListener("dragover", (e) => this.onDragOver(e, "row", row.id));
            setting.settingEl.addEventListener("drop", (e) => this.onDrop(e, "row", row.id));
            setting.settingEl.addEventListener("dragleave", (e) => this.onDragLeave(e)); // <-- ADD THIS LINE

        });
    }

    // --- Drag & Drop Handlers (simplified, expand as needed) ---
    private onDragStart(e: DragEvent, type: FMAFolderListDragTarget, id: string) {
        e.dataTransfer?.setData("text/plain", JSON.stringify({ type, id }));
    }
    private onDragOver(e: DragEvent, type: FMAFolderListDragTarget, id: string) {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;

        // Prevent dragging folders onto rows
        const data = e.dataTransfer?.getData("text/plain");
        if (type === "row" && data) {
            const { type: dragType } = JSON.parse(data);
            if (dragType === "folder") {
                // Don't allow folder drop on row
                return;
            }
        }

        // Folder highlight
        if (type === "folder") {
            target.classList.add("FMA-drop-target");
        }

        // Row: show above/below indicator
        if (type === "row") {
            target.classList.add("FMA-drop-target");
        }
    }

    private onDragLeave(e: DragEvent) {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("FMA-drop-target");
    }

    private onDrop(e: DragEvent, type: FMAFolderListDragTarget, targetId: string) {
        e.preventDefault();
        e.stopPropagation(); // Prevent multiple events
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("FMA-drop-target");

        const data = e.dataTransfer?.getData("text/plain");
        if (!data) return;
        const { type: dragType, id: dragId } = JSON.parse(data);

        if (dragType === "row") {
            if (type === "folder") {
                // Move row to this folder
                this.moveRowToFolder(dragId, targetId);
                return;
            }
            if (type === "row") {
                this.moveRow(dragId, targetId); // Move row to new position
                return;
            }
            // Dropping on the drop zone at the end
            if (type === "root" && targetId === "row-dropzone") {

                return;
            }
        }
        if (dragType === "folder") {
            if (type === "folder") {
                // Move folder to this folder
                this.moveFolderToFolder(dragId, targetId);
                return;
            }
            // Dropping on the drop zone at the end
            if (type === "root" && targetId === "folder-dropzone") {
                this.moveFolderToFolder(dragId, undefined);
                return;
            }
        }
    }

    private getNextFolderName(): string {
        let i = 1;
        let name : string;
        do {
            name = `Folder ${i++}`;
        } while (this.data.folders.some(f => f.name === name));
        return name;
    }

    private deleteFolderAndContents(folderId: string) {
        // Remove all subfolders and rows recursively
        const subfolders = this.data.folders.filter(f => f.parentId === folderId);
        subfolders.forEach(f => this.deleteFolderAndContents(f.id));

        // Call onRowDeletedCb for each row in this folder
        const rowsToDelete = this.data.rows.filter(r => r.folderId === folderId);
        rowsToDelete.forEach(row => this.onRowDeletedCb(row));

        this.data.folders = this.data.folders.filter(f => f.id !== folderId);
        this.data.rows = this.data.rows.filter(r => r.folderId !== folderId);
    }
}