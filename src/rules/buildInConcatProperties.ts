import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings, PropertyTypeInfo } from "../types";
import { App, ExtraButtonComponent, Setting, TFile } from "obsidian";
import { delimiter } from "path";

/**
 * Represents a built-in rule for retrieving a property value from the frontmatter of a file.
 * 
 * This rule allows users to select a property (such as text, tags, aliases, or multitext) and retrieve its value
 * from the currently selected file's frontmatter. The rule provides configuration options for selecting the property,
 * and exposes a function (`fx`) that performs the retrieval.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - The rule is identified by the ID 'getProperty' and is categorized as a built-in rule.
 * - The configuration tab allows users to select which property to retrieve.
 * - The `fx` method is the main logic for extracting the property value.
 * 
 * @example
 * // Usage within the plugin's rule system:
 * const rule = new RuleBuildInGetProperty();
 * const value = rule.fx(app, file, tools);
 * 
 * @property {string} id - The unique identifier for the rule ('getProperty').
 * @property {string} ruleType - The type of the rule ('buildIn').
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's purpose.
 * @property {string[]} type - The types of properties this rule can handle.
 * @property {Function} fx - The function that retrieves the property value.
 * @property {Function} configTab - The function that renders the configuration UI for the rule.
 */
export class RuleBuildInConcatProperties extends RulePrototype {
  constructor() {
    super();
    this.id = 'concatProperties';
    this.ruleType = 'buildIn';
    this.name = 'Concat Properties';
    this.description = 'Concatenates multiple properties from the frontmatter.';
    this.source = "function (app, file, tools) { // do not change this line!\n  const propertyIds = tools.getOptionConfig(tools.getRule()?.id,'inputProperties');\n  if (!Array.isArray(propertyIds) || propertyIds.length === 0) {\n    return 'No properties selected';\n  }\n  const delimiter = tools.getOptionConfig(tools.getRule()?.id,'delimiter');\n  const onlyWhenAllPropertiesExist = tools.getOptionConfig(tools.getRule()?.id, 'onlyWhenAllPropertiesExist') || false;\n  if (onlyWhenAllPropertiesExist) {\n    // Check if all properties exist\n    const allExist = propertyIds.every(id => { \n      if (id === undefined || id === null || id === '') {\n        return true; // Skip empty or undefined property IDs\n      }\n      const propertyValue = tools.getFrontmatterProperty(id);\n      const result = propertyValue !== undefined && propertyValue !== null && propertyValue !== '';\n      return result;\n    });\n    if (!allExist) {\n      return '';\n    }\n  }\n  const result = propertyIds.map(id => {\n    let value = tools.getFrontmatterProperty(id);\n    if (value === undefined || value === null || value === '') {\n      return ''; // Skip empty or undefined properties\n    }\n    return value.toString();\n  }).filter(res => res !== undefined).join(delimiter);\n  return result;\n};";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    const propertyIds = tools.getOptionConfig(tools.getRule()?.id,'inputProperties');
    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return 'No properties selected';
    }
    const delimiter = tools.getOptionConfig(tools.getRule()?.id,'delimiter');
    const onlyWhenAllPropertiesExist = tools.getOptionConfig(tools.getRule()?.id, 'onlyWhenAllPropertiesExist') || false;
    if (onlyWhenAllPropertiesExist) {
      // Check if all properties exist
      const allExist = propertyIds.every(id => { 
        if (id === undefined || id === null || id === '') {
          return true; // Skip empty or undefined property IDs
        }
        const propertyValue = tools.getFrontmatterProperty(id);
        const result = propertyValue !== undefined && propertyValue !== null && propertyValue !== '';
        return result;
      });
      if (!allExist) {
        return '';
      }
    }
    const result = propertyIds.map(id => {
      let value = tools.getFrontmatterProperty(id);
      if (value === undefined || value === null || value === '') {
        return ''; // Skip empty or undefined properties
      }
      return value.toString();
    }).filter(res => res !== undefined).join(delimiter);
    return result;
  }

  configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
    that.setOptionConfigDefaults(rule.id, {
        delimiter: ' ', // Default delimiter for concatenation
        inputProperties: [],
        onlyWhenAllPropertiesExist: true, // Default to false
    });

    const styleDisabled = (el: ExtraButtonComponent, disabled: boolean) => {
      if (disabled) {
          el.extraSettingsEl.addClass('mod-disabled');
          el.extraSettingsEl.setAttr('aria-disabled', 'true');
          el.extraSettingsEl.tabIndex = -1;
          // Optionally, remove tooltip if disabled:
          el.extraSettingsEl.removeAttribute('aria-label');
      } else {
          el.extraSettingsEl.removeClass('mod-disabled');
          el.extraSettingsEl.setAttr('aria-disabled', 'false');
      }
    };

    const render = () => {
      optionEL.empty();
      const inputProperties: string[] = that.getOptionConfig(rule.id, 'inputProperties') || [];
      // Remove any empty trailing entries except for the last one
      while (inputProperties.length > 2 && inputProperties[inputProperties.length - 2] === "") {
          inputProperties.pop();
      }
      // Always ensure at least one selection
      if (inputProperties.length === 0) inputProperties.push("");

      inputProperties.forEach((selected, idx) => {
          const setting = new Setting(optionEL)
              .setName(idx === 0 ? "Input Properties" : "")
              .setDesc(idx === 0 ? "Select properties as input. Use 'Space replacement' as delimiter." : "")
              .addDropdown(dd => {
                  Object.keys(that.knownProperties).forEach((key) => {
                      const item = that.knownProperties[key] as PropertyTypeInfo;
                      dd.addOption(item.name, item.name);
                  });
                  dd.setValue(selected || "");
                  dd.onChange(async (value) => {
                      inputProperties[idx] = value;
                      that.setOptionConfig(rule.id, 'inputProperties', inputProperties);
                      that.updatePreview(rule, previewComponent);
                      render();
                  });
              });
          if (idx > 0) {
            setting.settingEl.style.borderTop = 'none'; // Remove border for all but the first item
            setting.settingEl.style.padding = '0 0 0.75em'; // Remove margin for all but the first item
          } else {
            setting.settingEl.style.padding = '0.75em 0'; // Remove margin for all but the first item
          }
          const settingControl= setting.controlEl;
          if (settingControl) {
              settingControl.style.gap = '0.1em'; // Add gap between buttons
          }
          // Move up button (disable for first item)
          setting.addExtraButton(btn => {
              btn.setIcon('arrow-up')
                .setTooltip('Move up')
                .setDisabled(idx === 0) // Disable for the first item
                .onClick(() => {
                    [inputProperties[idx - 1], inputProperties[idx]] = [inputProperties[idx], inputProperties[idx - 1]];
                    that.setOptionConfig(rule.id, 'inputProperties', inputProperties);
                    render();
                });
              styleDisabled(btn, idx === 0); // Style disabled state
          });

          // Move down button (disable for last item)
          setting.addExtraButton(btn => {
              btn.setIcon('arrow-down')
                .setTooltip('Move down')
                .setDisabled(idx === inputProperties.length - 1) // Disable for the last item
                .onClick(() => {
                    [inputProperties[idx], inputProperties[idx + 1]] = [inputProperties[idx + 1], inputProperties[idx]];
                    that.setOptionConfig(rule.id, 'inputProperties', inputProperties);
                    render();
                });
              styleDisabled(btn, idx === inputProperties.length - 1); // Style disabled state
          });
          // Minus button for every row (disable if only one row left)
          setting.addExtraButton(btn => {
              btn.setIcon('minus-circle')
                  .setTooltip('Remove property')
                  .setDisabled(inputProperties.length === 1)
                  .onClick(() => {
                      inputProperties.splice(idx, 1);
                      that.setOptionConfig(rule.id, 'inputProperties', inputProperties);
                      render();
                  });
              styleDisabled(btn, inputProperties.length === 1);
          });
      });
      // Plus button UNDER the last row
      const plusButton = new Setting(optionEL)
        .addExtraButton(btn => {
            btn.setIcon('plus-circle')
                .setTooltip('Add property')
                .setDisabled(inputProperties[inputProperties.length - 1] === "" || !inputProperties[inputProperties.length - 1])
                .onClick(() => {
                    if (inputProperties[inputProperties.length - 1] !== "" && inputProperties[inputProperties.length - 1]) {
                        inputProperties.push("");
                        that.setOptionConfig(rule.id, 'inputProperties', inputProperties);
                        render();
                    }
                });
            styleDisabled(btn, inputProperties[inputProperties.length - 1] === "" || !inputProperties[inputProperties.length - 1]);
        });
      plusButton.settingEl.style.borderTop = 'none'; // Remove border for all but the first item
      plusButton.settingEl.style.padding = '0 0 0.75em'; // Remove margin for all but the first item
      // Create a setting for the constant value
      new Setting(optionEL)
          .setName('Delimiter')
          .setDesc('Specify a delimiter to use when concatenating properties. Default is a space.')
          .addText(text => text
              .setValue(that.getOptionConfig(rule.id ,'delimiter') || '')
              .setPlaceholder('Enter delimiter')
              .onChange(async (value) => {
                  that.setOptionConfig(rule.id,'delimiter', value);
                  that.updatePreview(rule, previewComponent);
              })
          );
      new Setting(optionEL)
          .setName('Only when all properties exist')
          .setDesc('If enabled, the rule will only return a value if all selected properties exist and not empty.')
          .addToggle(toggle => toggle
              .setValue(that.getOptionConfig(rule.id, 'onlyWhenAllPropertiesExist') || true)
              .onChange(async (value) => {
                  that.setOptionConfig(rule.id, 'onlyWhenAllPropertiesExist', value);
                  that.updatePreview(rule, previewComponent);
              })
          );
    };

    render();

  };
}