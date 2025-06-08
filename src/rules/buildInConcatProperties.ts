import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings, PropertyTypeInfo } from "../types";
import { App, ExtraButtonComponent, Setting, TFile } from "obsidian";
import { delimiter } from "path";
import { MultiPropertyItem, MultiPropertySetting } from "../uiMultiPropertySetting";

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
      const allExist = propertyIds.every(item => { 
        if (item === undefined || item === null || item.name === '') {
          return true; // Skip empty or undefined property IDs
        }
        const propertyValue = tools.getFrontmatterProperty(item.name);
        const result = propertyValue !== undefined && propertyValue !== null && propertyValue !== '';
        return result;
      });
      if (!allExist) {
        return '';
      }
    }
    const result = propertyIds.map(item => {
      let value = tools.getFrontmatterProperty(item.name);
      if (value === undefined || value === null || value === '') {
        return ''; // Skip empty or undefined properties
      }
      return value.toString();
    }).filter(res => res !== undefined).join(delimiter);
    return result;
  }

  configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
    that.setOptionConfigDefaults(rule.id, {
        delimiter: ',', // Default delimiter for concatenation
        inputProperties: [],
        onlyWhenAllPropertiesExist: true, // Default to false
    });
    
    const multiProp = new MultiPropertySetting(optionEL)
      .setName("Input Properties")
      .setDesc("Select properties as input. Use 'Space replacement' as delimiter.")
      .setOptions(
          Object.keys(that.knownProperties).map((key) => {
            const prop = that.knownProperties[key];
            if (prop.type === 'text' || prop.type === 'tags' || prop.type === 'aliases' || prop.type === 'multitext') {
              return {id:key, name: prop.name} as MultiPropertyItem;
            }
            return null; // Filter out unsupported types
          }).filter((item): item is MultiPropertyItem => item !== null)
        )
      .setValue(that.getOptionConfig(rule.id, 'inputProperties') || [])
      .onChange((arr) => {
          that.setOptionConfig(rule.id, 'inputProperties', arr);
          that.updatePreview(rule, previewComponent);
        });
    
    new Setting(optionEL)
        .setName('Delimiter')
        .setDesc('Specify a delimiter to use when concatenating properties. Default is a comma.')
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
            .setValue(that.getOptionConfig(rule.id, 'onlyWhenAllPropertiesExist'))
            .onChange(async (value) => {
                that.setOptionConfig(rule.id, 'onlyWhenAllPropertiesExist', value);
                that.updatePreview(rule, previewComponent);
            })
        );
  };
}