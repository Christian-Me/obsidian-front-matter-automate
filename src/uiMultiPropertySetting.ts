import { Setting, ExtraButtonComponent } from "obsidian";
import type { PropertyTypeInfo } from "./types";

export class MultiPropertySetting {
    public settingEl: HTMLElement;
    private name: string = "";
    private desc: string = "";
    private value: string[] = [];
    private onChangeCb: (val: string[]) => void = () => {};
    private options: string[] | Array<{id: string, name: string}> = [];
    private container: HTMLElement;
    private extraButtonCallbacks: ((setting: Setting, idx: number) => void)[] = [];

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

    setValue(value: string[]) {
        this.value = value.length ? [...value] : [""];
        this.render();
        return this;
    }

    setOptions(options: string[] | Array<{id: string, name: string}>) {
        this.options = options;
        this.render();
        return this;
    }

    onChange(cb: (val: string[]) => void) {
        this.onChangeCb = cb;
        return this;
    }

    /**
     * Allows adding extra buttons to each row.
     * The callback receives the Setting and the row index.
     */
    addExtraButton(cb: (setting: Setting, idx: number) => void) {
        this.extraButtonCallbacks.push(cb);
        this.render();
        return this;
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

    private render() {
        this.settingEl.empty();
        const arr = this.value;

        arr.forEach((selected, idx) => {
            const setting = new Setting(this.settingEl)
                .setName(idx === 0 ? this.name : "")
                .setDesc(idx === 0 ? this.desc : "")
                .addDropdown(dd => {
                    this.options.forEach((item) => {
                        if (typeof item === 'string') {
                            dd.addOption(item, item);
                        } else {
                            dd.addOption(item.id, item.name);
                        }
                    });
                    dd.setValue(selected || "");
                    dd.onChange((value) => {
                        arr[idx] = value;
                        this.value = arr;
                        this.onChangeCb([...arr]);
                        this.render();
                    });
                });
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
                        this.value = arr.length ? arr : [""];
                        this.onChangeCb([...this.value]);
                        this.render();
                    });
                this.styleDisabled(btn, arr.length === 1);
            });

            // Call extra button callbacks for this row
            this.extraButtonCallbacks.forEach(cb => cb(setting, idx));
        });

        // Plus button under the last row
        const plusButton = new Setting(this.settingEl)
            .addExtraButton(btn => {
                btn.setIcon('plus-circle')
                    .setTooltip('Add property')
                    .setDisabled(arr[arr.length - 1] === "" || !arr[arr.length - 1])
                    .onClick(() => {
                        if (arr[arr.length - 1] !== "" && arr[arr.length - 1]) {
                            arr.push("");
                            this.value = arr;
                            this.onChangeCb([...arr]);
                            this.render();
                        }
                    });
                this.styleDisabled(btn, arr[arr.length - 1] === "" || !arr[arr.length - 1]);
            });
            
        plusButton.settingEl.style.borderTop = 'none'; // Remove border for all but the first item
        plusButton.settingEl.style.padding = '0 0 0.75em'; // Remove margin for all but the first item
    }
}