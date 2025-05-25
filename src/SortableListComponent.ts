import { PluginSettingTab, Setting, TextComponent, ButtonComponent, App } from 'obsidian';
import { logger, TRACE } from './Log';

interface Row {
    id: string;
    content: string;
}

interface group {
    id: string;
    name: string;
    rows: Row[];
    isOpen: boolean;
}

export class SortableListComponent {
    private groups: group[] = [];
    private containerEl: HTMLElement;
    private listContainerEl!: HTMLElement;
    private dragData: any = null;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.createUI();
    }

    private createUI() {
        const headerEl = this.containerEl.createDiv({ cls: 'sortableList-header' });

        new ButtonComponent(headerEl)
            .setButtonText('Add group')
            .onClick(() => this.addGroup());

        new ButtonComponent(headerEl)
            .setButtonText('Collapse All')
            .onClick(() => this.collapseAll());

        this.listContainerEl = this.containerEl.createDiv({ cls: 'sortableList-container' });
        this.renderGroups();
    }

    private renderGroups() {
        this.listContainerEl.empty();
        this.groups.forEach(group => this.renderGroup(group));
    }

    private renderGroup(group: group) {
        // Add a drop indicator above the group
        const dropIndicator = this.listContainerEl.createDiv({ cls: 'sortableList-group-drop-indicator' });

        dropIndicator.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.dragData?.type === 'group') {
                dropIndicator.classList.add('drag-over'); // Highlight the drop indicator
            }
        });
        dropIndicator.addEventListener('dragleave', () => {
            dropIndicator.classList.remove('drag-over');
        });

        dropIndicator.addEventListener('drop', (e) => {
            e.preventDefault();
            dropIndicator.classList.remove('drag-over'); // Remove the highlight
            if (this.dragData.type === 'group') {
                this.moveGroup(this.dragData.id, group.id); // Move the dragged group before this group
            }
        });

        this.listContainerEl.appendChild(dropIndicator); // Add the drop indicator above the group

        const groupEl = this.listContainerEl.createDiv({ cls: 'sortableList-group' });
        groupEl.setAttribute('draggable', 'true');
        groupEl.dataset.groupId = group.id;

        // Drag handle for the group
        const dragHandle = groupEl.createDiv({ cls: 'sortableList-drag-handle' });
        dragHandle.setText('☰');

        // Group name
        const nameEl = groupEl.createDiv({ cls: 'sortableList-group-name' });
        nameEl.setText(group.name);

        // Drag-and-drop events for the group header
        // Drag-and-drop events for the row
        groupEl.addEventListener('dragstart', (e) => {
            this.dragData = { type: 'group', id: group.id };
            groupEl.classList.add('dragging');
        });
        groupEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.dragData.type === 'row') {
                groupEl.classList.add('drag-over');
            } 
        });
        groupEl.addEventListener('dragleave', () => {
            groupEl.classList.remove('drag-over');
        });

        groupEl.addEventListener('drop', (e) => {
            e.preventDefault();
            groupEl.classList.remove('drag-over');
            if (this.dragData.type === 'row') {
                this.moveRowToContainer(this.dragData.rowId, group.id); // Move the row to this group
            }
        });

        // Add Row button
        const addRowButton = groupEl.createEl('button', { text: 'Add Row', cls: 'sortableList-add-row' });
        addRowButton.onclick = () => {
            const newRow: Row = { id: this.generateId(), content: `New Row ${group.rows.length + 1}` };
            group.rows.push(newRow);
            this.renderGroups();
        };

        this.listContainerEl.appendChild(groupEl);

        // Render rows
        const rowsContainer = this.listContainerEl.createDiv({ cls: 'sortableList-rows-container' });
        group.rows.forEach(row => this.renderRow(row, rowsContainer, group.id));
    }

    private renderRow(row: Row, parentEl: HTMLElement, groupId: string) {
        const rowEl = parentEl.createDiv({ cls: 'sortableList-row' });
        rowEl.setAttribute('draggable', 'true');
        rowEl.dataset.rowId = row.id;

        // Drag handle for the row
        const dragHandle = rowEl.createDiv({ cls: 'sortableList-drag-handle' });
        dragHandle.setText('☰');

        // Row content
        const contentEl = rowEl.createDiv({ cls: 'sortableList-row-content' });
        contentEl.setText(row.content);

        // Remove button
        const removeButton = rowEl.createEl('button', { text: 'Remove', cls: 'sortableList-remove-row' });
        removeButton.onclick = () => this.removeRow(row.id);

        // Drag-and-drop events for the row
        rowEl.addEventListener('dragstart', (e) => {
            this.dragData = { type: 'row', id: row.id, groupId };
            rowEl.classList.add('dragging');
        });

        rowEl.addEventListener('dragend', () => {
            rowEl.classList.remove('dragging');
        });

        // Add a drop indicator before the row
        const dropIndicator = parentEl.createDiv({ cls: 'sortableList-row-drop-indicator' });

        dropIndicator.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.dragData?.type === 'row') {
                dropIndicator.classList.add('drag-over'); // Highlight the drop indicator
            }
        });

        dropIndicator.addEventListener('dragleave', () => {
            dropIndicator.classList.remove('drag-over');
        });

        dropIndicator.addEventListener('drop', (e) => {
            e.preventDefault();
            dropIndicator.classList.remove('drag-over');
            logger.log(TRACE,'row dropped on indicator',this.dragData);
            if (this.dragData.type === 'row') {
                this.moveRow(this.dragData.rowId, row.id, groupId); // Move the dragged row before this row
            }
        });

        parentEl.appendChild(dropIndicator); // Add the drop indicator before the row
        parentEl.appendChild(rowEl); // Add the row element
    }

    private addGroup() {
    const newContainer: group = {
        id: this.generateId(),
        name: `New Group ${this.groups.length + 1}`,
        rows: [],
        isOpen: true
    };
    this.groups.push(newContainer);
    this.renderGroups();
}

    private toggleContainer(group: group) {
        group.isOpen = !group.isOpen;
        this.renderGroups();
    }

    private removeRow(rowId: string) {
        this.groups.forEach(group => {
            group.rows = group.rows.filter(row => row.id !== rowId);
        });
        this.renderGroups();
    }

    private collapseAll() {
        this.groups.forEach(group => group.isOpen = false);
        this.renderGroups();
    }
/*
    private filterRows() {
        const searchTerm = this.searchInput.getValue().toLowerCase();
        this.groups.forEach(group => {
            group.rows.forEach(row => {
                const rowEl = this.listContainerEl.querySelector(`.row[data-id="${row.id}"]`);
                if (row.content.toLowerCase().includes(searchTerm)) {
                    if (rowEl instanceof HTMLElement) rowEl.style.display = 'block';
                } else {
                    if (rowEl instanceof HTMLElement) rowEl.style.display = 'none';
                }
            });
        });
    }
*/
    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private moveGroup(sourceId: string, targetId: string | null) {
    const sourceIndex = this.groups.findIndex(group => group.id === sourceId);
    const targetIndex = targetId
        ? this.groups.findIndex(group => group.id === targetId)
        : this.groups.length; // If targetId is null, move to the end

    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        const [movedGroup] = this.groups.splice(sourceIndex, 1);
        this.groups.splice(targetIndex, 0, movedGroup);
        this.renderGroups();
    }
}

    private moveRow(sourceId: string, targetRowId: string, groupId: string) {
    let sourceRow: Row | undefined;

    // Find and remove the source row from its current group
    this.groups.forEach(group => {
        const rowIndex = group.rows.findIndex(row => row.id === sourceId);
        if (rowIndex !== -1) {
            sourceRow = group.rows.splice(rowIndex, 1)[0];
        }
    });

    if (sourceRow) {
        // Find the target group and insert the row before the target row
        this.groups.forEach(group => {
            if (group.id === groupId) {
                const targetRowIndex = group.rows.findIndex(row => row.id === targetRowId);

                // Prevent moving the row to the gap above itself
                if (sourceRow && sourceRow.id === targetRowId) {
                    group.rows.splice(targetRowIndex, 0, sourceRow); // Reinsert the row in its original position
                    return;
                }

                if (targetRowIndex !== -1 && sourceRow) {
                    group.rows.splice(targetRowIndex, 0, sourceRow);
                }
            }
        });

        this.renderGroups();
    }
}

    private moveRowToContainer(rowId: string, groupId: string) {
    let sourceRow: Row | undefined;

    // Find and remove the source row from its current group
    this.groups.forEach(group => {
        const rowIndex = group.rows.findIndex(row => row.id === rowId);
        if (rowIndex !== -1) {
            sourceRow = group.rows.splice(rowIndex, 1)[0];
        }
    });

    // Add the row to the target group
    const targetGroup = this.groups.find(group => group.id === groupId);
    if (sourceRow && targetGroup) {
        targetGroup.rows.push(sourceRow);
        this.renderGroups();
    }
}

    display() {
        this.containerEl.empty();
        this.createUI();
        return this;
    }
    // Add methods for saving and restoring state here
}