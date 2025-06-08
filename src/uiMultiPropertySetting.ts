import { Setting, ExtraButtonComponent } from "obsidian";
import type { PropertyTypeInfo } from "./types";
import { randomUUID } from "crypto";

export interface MultiPropertyItem {
    id: string;
    name: string;
    payload?: any;
}

export class MultiPropertySetting {
    public settingEl: HTMLElement;
    private name: string = "";
    private desc: string = "";
    private value: MultiPropertyItem[] = [];
    private onChangeCb: (val: MultiPropertyItem[]) => void = () => {};
    private options: MultiPropertyItem[] = [];
    private container: HTMLElement;
    private plusButtonComponent?: ExtraButtonComponent;
    private extraButtonCbs: ((setting: Setting, idx: number) => void)[] = [];
    private onRenderRowCb?: (
        setting: Setting,
        value: MultiPropertyItem,
        idx: number,
        onChange: (val: MultiPropertyItem, idx: number) => void,
    ) => void = (setting, value, idx, onChange) => {
        // Default: dropdown
        setting.addDropdown(dd => {
            this.options.forEach((item) => {
                if (typeof item === 'string') {
                    dd.addOption(item, item);
                } else {
                    dd.addOption(item.id, item.name);
                }
            });
            dd.setValue(value.id || "");
            dd.onChange((val: string) => {
                const found = this.options.find(opt => opt.id === val);
                if (!found) return
                let value = this.value[idx];
                if (this.isMultiPropertyItem(value)) {
                    value.id = found ? found.id : val;
                    value.name = found ? found.name : val;
                } else {
                    value = found;
                }
                onChange(value, idx);
                this.updatePlusButtonState();
            });
        });
    };
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.settingEl = container.createDiv();
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    setDesc(desc: string) {
        this.desc = desc;
        return this;
    }

    setValue(value: MultiPropertyItem[]) {
        this.value = value.length ? [...value] : [{ id: "", name: "", payload: {id : randomUUID()} }];
        this.render();
        return this;
    }

    setOptions(options: MultiPropertyItem[]) {
        this.options = options;
        this.render();
        return this;
    }

    onChange(cb: (val: MultiPropertyItem[]) => void) {
        this.onChangeCb = cb;
        return this;
    }
    
    onRenderRow(cb: (
        setting: Setting,
        value: MultiPropertyItem,
        idx: number,
        onChange: (val: MultiPropertyItem, idx: number) => void
    ) => void) {
        this.onRenderRowCb = cb;
        this.render();
        return this;
    }
    /**
     * Allows adding extra buttons to each row.
     * The callback receives the Setting and the row index.
     */
    addExtraButton(cb: (setting: Setting, idx: number) => void) {
        this.extraButtonCbs.push(cb);
        this.render();
        return this;
    }

    getExtraButtons() {
        return this.extraButtonCbs;
    }

    styleDisabled(el: ExtraButtonComponent, disabled: boolean) {
        if (disabled) {
            el.extraSettingsEl.addClass('mod-disabled');
            el.extraSettingsEl.setAttr('aria-disabled', 'true');
            el.extraSettingsEl.tabIndex = -1;
            el.extraSettingsEl.removeAttribute('aria-label');
        } else {
            el.extraSettingsEl.removeClass('mod-disabled');
            el.extraSettingsEl.setAttr('aria-disabled', 'false');
        }
    }
    public updatePlusButtonState() {
        if (this.plusButtonComponent) {
            const arr = this.value;
            const disabled = arr[arr.length - 1].id === "" || !arr[arr.length - 1];
            this.plusButtonComponent.setDisabled(disabled);
            this.styleDisabled(this.plusButtonComponent, disabled);
        }
    }
    render() {
        this.settingEl.empty();
        const arr = this.value || [{ id: "", name: "" }];

        arr.forEach((selected, idx) => {
            const setting = new Setting(this.settingEl)
                .setName(idx === 0 ? this.name : "")
                .setDesc(idx === 0 ? this.desc : "");

            if (this.onRenderRowCb) {
                this.onRenderRowCb(setting, selected, idx, (item) => {
                    arr[idx] = item;
                    this.value = arr;
                    this.onChangeCb([...arr]);
                });
            } /*else {
                // Default: dropdown
                setting.addDropdown(dd => {
                    this.options.forEach((item: any) => {
                        dd.addOption(item.id, item.name);
                    });
                    dd.setValue(selected.id || "");
                    dd.onChange((val) => {
                        const found = (this.options as MultiPropertyItem[]).find(opt => opt.id === val);
                        arr[idx] = found ? { ...found } : { id: val, name: val };
                        this.value = arr;
                        this.onChangeCb([...arr]);
                    });
                });
            }*/
            
            if (idx > 0) {
                setting.settingEl.style.borderTop = 'none'; // Remove border for all but the first item
                setting.settingEl.style.padding = '0 0 0.75em'; // Remove margin for all but the first item
            } else {
                setting.settingEl.style.borderTop = '1px solid var(--background-modifier-border)'; // Add border for the first item
                setting.settingEl.style.padding = '0.75em 0'; // Remove margin for all but the first item
            }
            const settingControl= setting.controlEl;
            if (settingControl) {
                settingControl.style.gap = '0.1em'; // Add gap between buttons
            }
            // Move up
            setting.addExtraButton(btn => {
                btn.setIcon('arrow-up')
                    .setTooltip('Move up')
                    .setDisabled(idx === 0)
                    .onClick(() => {
                        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                        this.value = arr;
                        this.onChangeCb([...arr]);
                        this.render();
                    });
                this.styleDisabled(btn, idx === 0);
            });

            // Move down
            setting.addExtraButton(btn => {
                btn.setIcon('arrow-down')
                    .setTooltip('Move down')
                    .setDisabled(idx === arr.length - 1)
                    .onClick(() => {
                        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                        this.value = arr;
                        this.onChangeCb([...arr]);
                        this.render();
                    });
                this.styleDisabled(btn, idx === arr.length - 1);
            });

            // Minus (always enabled unless only one left)
            setting.addExtraButton(btn => {
                btn.setIcon('minus-circle')
                    .setTooltip('Remove property')
                    .setDisabled(arr.length === 1)
                    .onClick(() => {
                        arr.splice(idx, 1);
                        this.value = arr.length ? arr : [{ id: "", name: "" }];
                        this.onChangeCb([...this.value]);
                        this.render();
                    });
                this.styleDisabled(btn, arr.length === 1);
            });

            // Call extra button callbacks for this row
            this.extraButtonCbs.forEach(cb => cb(setting, idx));
        });

        // Plus button under the last row
        //if (arr.length === 0 || (arr.length === 1 && arr[0].id === "" && arr[0].name === "")) {
        if (arr.length === 0) {
            arr.push({ id: "", name: "", payload: {id : randomUUID()} });
            this.value = arr;
        }
        const plusButton = new Setting(this.settingEl)
            .addExtraButton(btn => {
                btn.setIcon('plus-circle')
                    .setTooltip('Add property')
                    .setDisabled(arr[arr.length - 1].id === "" || arr[arr.length - 1].name === "")
                    .onClick(() => {
                        if (arr[arr.length - 1].id !== "" && arr[arr.length - 1].name !== "") {
                            arr.push({ id: "", name: "", payload: {id : randomUUID()} });
                            this.value = arr;
                            this.onChangeCb([...arr]);
                            this.render();
                        }
                    });
                this.styleDisabled(btn, arr[arr.length - 1].id === "" || arr[arr.length - 1].name === "");
                this.plusButtonComponent = btn;
            });
            
        plusButton.settingEl.style.borderTop = 'none'; // Remove border for all but the first item
        plusButton.settingEl.style.padding = '0 0 0.75em'; // Remove margin for all but the first item
    }
    isMultiPropertyItem(value: any): value is MultiPropertyItem {
        return (
            typeof value === "object" &&
            value !== null &&
            typeof value.id === "string" &&
            typeof value.name === "string"
        );
    }
}