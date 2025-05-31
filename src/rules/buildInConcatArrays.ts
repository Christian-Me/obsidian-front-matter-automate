import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings, PropertyTypeInfo } from "../types";
import { App, ExtraButtonComponent, Setting, TFile } from "obsidian";
import { delimiter } from "path";
import { MultiPropertySetting } from "../uiMultiPropertySetting";

/**
 * RuleBuildInConcatArrays is a built-in rule for concatenating multiple frontmatter array properties
 * (such as text, tags, aliases, or multitext) from a file in Obsidian. It allows users to select
 * which properties to concatenate and optionally requires that all selected properties exist and are non-empty.
 *
 * @remarks
 * - The rule can be configured via a settings tab, allowing users to select input properties and toggle
 *   whether all properties must exist for the rule to return a value.
 * - The concatenation can be customized with a delimiter.
 * - The rule is designed to work with properties of type 'text', 'tags', 'aliases', or 'multitext'.
 *
 * @example
 * // Usage in a rule configuration:
 * {
 *   id: 'concatArrays',
 *   inputProperties: ['tags', 'aliases'],
 *   onlyWhenAllPropertiesExist: true
 * }
 *
 * @extends RulePrototype
 *
 * @public
 */
export class RuleBuildInConcatArrays extends RulePrototype {
  constructor() {
    super();
    this.id = 'concatArrays';
    this.ruleType = 'buildIn';
    this.name = 'Concat Arrays';
    this.description = 'Concatenates multiple Lists (Multitext, Tags, Aliases).';
    this.source = "function (app, file, tools) { // do not change this line!\n  const propertyIds = tools.getOptionConfig(tools.getRule()?.id,'inputProperties');\n  if (!Array.isArray(propertyIds) || propertyIds.length === 0) {\n    return 'No properties selected';\n  }\n  const delimiter = tools.getOptionConfig(tools.getRule()?.id,'delimiter');\n  const onlyWhenAllPropertiesExist = tools.getOptionConfig(tools.getRule()?.id, 'onlyWhenAllPropertiesExist') || false;\n  if (onlyWhenAllPropertiesExist) {\n    // Check if all properties exist\n    const allExist = propertyIds.every(id => { \n      if (id === undefined || id === null || id === '') {\n        return true; // Skip empty or undefined property IDs\n      }\n      const propertyValue = tools.getFrontmatterProperty(id);\n      const result = propertyValue !== undefined && propertyValue !== null && propertyValue !== '';\n      return result;\n    });\n    if (!allExist) {\n      return '';\n    }\n  }\n  const result = propertyIds.map(id => {\n    let value = tools.getFrontmatterProperty(id);\n    if (value === undefined || value === null || value === '') {\n      return ''; // Skip empty or undefined properties\n    }\n    return value.toString();\n  }).filter(res => res !== undefined).join(delimiter);\n  return result;\n};";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    const propertyIds = tools.getOptionConfig(tools.getRule()?.id,'inputProperties');
    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return 'No properties selected';
    }
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
        return [];
      }
    }

    let resultArray: string[] = [];
    propertyIds.forEach(id => {
      let value = tools.getFrontmatterProperty(id);
      if (value === undefined || value === null || value === '') {
        return; // Skip empty or undefined properties
      }
      resultArray = resultArray.concat(Array.isArray(value) ? value : [value.toString()]);
    });
    return resultArray;
  }

  configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
    that.setOptionConfigDefaults(rule.id, {
        inputProperties: [],
        onlyWhenAllPropertiesExist: false, // Default to false
    });
    
    const multiProp = new MultiPropertySetting(optionEL)
      .setName("Input Properties")
      .setDesc("Select properties as input. (text, tags, aliases or multitext)")
      .setOptions(Object.keys(that.knownProperties).map((key) => {
        const prop = that.knownProperties[key];
        if (prop.type === 'text' || prop.type === 'tags' || prop.type === 'aliases' || prop.type === 'multitext') {
          return key;
        }
        return null; // Filter out unsupported types
      }).filter((item): item is string => item !== null))
      .setValue(that.getOptionConfig(rule.id, 'inputProperties') || [])
      .onChange((arr) => {
          that.setOptionConfig(rule.id, 'inputProperties', arr);
          that.updatePreview(rule, previewComponent);
      });
    
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