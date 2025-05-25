  import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings, PropertyTypeInfo } from "../types";
import { App, Setting, TFile } from "obsidian";

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
export class RuleBuildInGetProperty extends RulePrototype {
  constructor() {
    super();
    this.id = 'getProperty';
    this.ruleType = 'buildIn';
    this.name = 'Get property';
    this.description = 'Gets a property from selected property.';
    this.source = "function(app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line! \n const propertyId = tools.getOptionConfig(tools.getRule()?.id,'inputProperty'); \n if (propertyId === undefined || propertyId === '') { \n return 'Property not set'; \n } \n const result = tools.getFrontmatterProperty(propertyId); \n if (result === undefined) { \n return 'Property not found'; \n } \n return result; \n }";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    const propertyId = tools.getOptionConfig(tools.getRule()?.id,'inputProperty');
    if (propertyId === undefined || propertyId === '') {
      return 'Property not set';
    }
    const result = tools.getFrontmatterProperty(propertyId);
    if (result === undefined) {
      return 'Property not found';
    }
    return result;
  }

  configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
    // Configuration tab logic can be added here if needed
    // Create a setting for the constant value
    that.setOptionConfigDefaults(rule.id, {
        inputProperty: '',
    })
    let inputPropertiesDropdown:any;
    new Setting(optionEL)
        .setName('Input Property')
        .setDesc('Select a property as input')
        .addDropdown(dropdown => {
            inputPropertiesDropdown = dropdown;
            dropdown
            .setValue(that.getOptionConfig(rule.id ,'inputProperty') || '')
            .onChange(async (value) => {
              if (value !== '') {
                that.setOptionConfig(rule.id,'inputProperty', value);
                that.updatePreview(rule, previewComponent);
              }
            });
        });
    Object.keys(that.knownProperties).forEach((key) => {
        //inputPropertiesDropdown.addOption(item[1].name,item[1].name);
        const item = that.knownProperties[key] as PropertyTypeInfo;
        inputPropertiesDropdown.addOption(item.name, item.name);
    });
  };
}