import { setIcon, TextComponent } from "obsidian";
import { ObsidianPropertyTypes, PropertyInfo } from "./types";

export function renderValueInput(containerEl: HTMLElement, propertyInfo: PropertyInfo | undefined, currentValue: any, changeCallback: (propertyInfo: PropertyInfo | undefined, value: any) => void) {
    let returnComponent:any;
    containerEl.empty(); 

    if (!propertyInfo) {
            containerEl.setText('');
            containerEl.addClass('text-muted');
            return;
    }

    const type = propertyInfo.type;

    switch (type) {
        case 'number':
            returnComponent = new TextComponent(containerEl)
                .setPlaceholder('Numeric Value')
                .setValue(currentValue !== undefined && currentValue !== null ? String(currentValue) : '')
                .onChange(async (value) => {
                    const numValue = value === '' ? undefined : parseFloat(value);
                    changeCallback(propertyInfo, isNaN(numValue as number) ? undefined : numValue);
                })
                returnComponent.inputEl.type = 'number';
            break;
        case 'checkbox':
            returnComponent = containerEl.createDiv({ cls: 'tri-state-checkbox clickable-icon' });
            returnComponent.setAttribute('aria-label', 'Checkbox change state');
            returnComponent.setAttribute('role', 'checkbox');

            const updateCheckboxVisual = (state: boolean | undefined) => {
                let iconName: string;
                let ariaState: 'true' | 'false' | 'mixed';
                if (state === true) {
                    iconName = 'check-square';
                    ariaState = 'true';
                } else if (state === false) {
                    iconName = 'square';
                    ariaState = 'false';
                } else { // undefined or null
                    iconName = 'minus-square';
                    ariaState = 'mixed';
                }
                setIcon(returnComponent, iconName);
                returnComponent.setAttribute('aria-checked', ariaState);
                returnComponent.dataset.state = String(state);
            };

            updateCheckboxVisual(currentValue);

            returnComponent.addEventListener('click', async () => {
                let currentState = returnComponent.dataset.state;
                let nextState: boolean | undefined;

                if (currentState === 'false') {
                    nextState = true;
                } else if (currentState === 'true') {
                    nextState = undefined; 
                } else { 
                    nextState = false; 
                }

                changeCallback(propertyInfo,  nextState);

                updateCheckboxVisual(nextState);
            });

            break;
        case 'date':
            returnComponent = new TextComponent(containerEl)
                .setPlaceholder('YYYY-MM-DD')
                .setValue(currentValue || '')
                .onChange(async (value) => {
                    changeCallback(propertyInfo, value || undefined);
                })
                returnComponent.inputEl.type = 'date';
            break;
        case 'datetime':
            returnComponent = new TextComponent(containerEl)
                .setPlaceholder('YYYY-MM-DDTHH:mm')
                .setValue(currentValue || '')
                .onChange(async (value) => {
                    changeCallback(propertyInfo, value || undefined);
                })
                returnComponent.inputEl.type = 'datetime-local';
            break;
        case 'aliases':
        case 'tags':
        case 'multitext':
            returnComponent = new TextComponent(containerEl)
                .setPlaceholder('values (divided by comma)')
                .setValue(Array.isArray(currentValue) ? currentValue.join(', ') : (currentValue || ''))
                .onChange(async (value) => {
                    const arrayValue = value.split(',').map(s => s.trim()).filter(s => s);
                    changeCallback(propertyInfo, arrayValue.length > 0 ? arrayValue : undefined);
                });
            break;
        case 'text':
        default:
            returnComponent = new TextComponent(containerEl)
                .setPlaceholder('value')
                .setValue(currentValue || '')
                .onChange(async (value) => {
                    changeCallback(propertyInfo, value || undefined);
                });
            break;
        }
    if (type !== 'checkbox') {
        returnComponent.inputEl.style.backgroundColor = 'transparent'; // make it invisible
        returnComponent.inputEl.style.width = '100%';
        returnComponent.inputEl.style.border = 'none';
    }
    return returnComponent;
} 
export function updatePropertyIcon(iconEl: HTMLElement, type: ObsidianPropertyTypes | undefined) {
    let iconName = 'hash';
    switch (type) {
        case 'text': iconName = 'align-left'; break;
        case 'number': iconName = 'binary'; break;
        case 'multitext': iconName = 'list'; break;
        case 'date': iconName = 'calendar'; break;
        case 'datetime': iconName = 'clock'; break;
        case 'checkbox': iconName = 'check-square'; break;
        case 'tags': iconName = 'tags'; break;
        case 'aliases': iconName = 'forward'; break;
 
        default: iconName = 'help-circle';
    }
    setIcon(iconEl, iconName);
}