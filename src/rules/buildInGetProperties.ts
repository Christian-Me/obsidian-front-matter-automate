import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings, PropertyTypeInfo } from "../types";
import { App, ExtraButtonComponent, Setting, TFile } from "obsidian";
import { delimiter } from "path";
import { MultiPropertySetting } from "../uiMultiPropertySetting";
import { ERROR, logger } from "../Log";


/**
 * A built-in rule for retrieving and concatenating multiple frontmatter properties from a file.
 * 
 * This rule supports properties of type 'text', 'tags', 'aliases', and 'multitext'. It allows users to select
 * multiple properties, optionally require that all selected properties exist, and specify a delimiter for concatenation.
 * 
 * ## Configuration Options
 * - `inputProperties`: Array of property keys to retrieve from the frontmatter.
 * - `onlyWhenAllPropertiesExist`: If true, the rule returns a value only if all selected properties exist and are not empty.
 * - `propertyDelimiter`: String used to separate concatenated values when outputting as text.
 * 
 * ## Behavior
 * - If `onlyWhenAllPropertiesExist` is enabled and any selected property is missing or empty, the rule returns an empty result.
 * - For 'text' type, the selected properties are concatenated using the specified delimiter.
 * - For 'tags', 'aliases', or 'multitext' types, the result is an array of values.
 * 
 * @extends RulePrototype
 * @category Built-in Rules
 * @example
 * // Retrieve 'tags' and 'aliases' properties, concatenated with a comma
 * {
 *   inputProperties: ['tags', 'aliases'],
 *   propertyDelimiter: ',',
 *   onlyWhenAllPropertiesExist: false
 * }
 */
export class RuleBuildInGetProperties extends RulePrototype {
  constructor() {
    super();
    this.id = 'getProperties';
    this.ruleType = 'buildIn';
    this.name = 'Get Properties';
    this.description = 'Retrieves multiple frontmatter properties (Multitext, Tags, Aliases).';
    this.source = "function (app, file, tools) { // do not change this line!\n  const propertyIds = tools.getOptionConfig(tools.getRule()?.id,'inputProperties');\n  if (!Array.isArray(propertyIds) || propertyIds.length === 0) {\n    return 'No properties selected';\n  }\n  const delimiter = tools.getOptionConfig(tools.getRule()?.id,'delimiter');\n  const onlyWhenAllPropertiesExist = tools.getOptionConfig(tools.getRule()?.id, 'onlyWhenAllPropertiesExist') || false;\n  if (onlyWhenAllPropertiesExist) {\n    // Check if all properties exist\n    const allExist = propertyIds.every(id => { \n      if (id === undefined || id === null || id === '') {\n        return true; // Skip empty or undefined property IDs\n      }\n      const propertyValue = tools.getFrontmatterProperty(id);\n      const result = propertyValue !== undefined && propertyValue !== null && propertyValue !== '';\n      return result;\n    });\n    if (!allExist) {\n      return '';\n    }\n  }\n  const result = propertyIds.map(id => {\n    let value = tools.getFrontmatterProperty(id);\n    if (value === undefined || value === null || value === '') {\n      return ''; // Skip empty or undefined properties\n    }\n    return value.toString();\n  }).filter(res => res !== undefined).join(delimiter);\n  return result;\n};";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    const rule = tools.getRule();
    if (!rule) {
      logger.log(ERROR, 'RuleBuildInGetProperties: No rule found.');
      return tools.getCurrentContent();
    }
    const propertyIds = tools.getOptionConfig(rule.id,'inputProperties');
    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return 'No properties selected';
    }
    const onlyWhenAllPropertiesExist = tools.getOptionConfig(rule.id, 'onlyWhenAllPropertiesExist') || false;
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

    switch (rule.type || rule.typeProperty?.type) {
      case ('text'):
        return resultArray.join(tools.getOptionConfig(rule.id, 'delimiter'));
      case ('tags'):
      case ('aliases'):
      case ('multitext'):
        return resultArray;
    }
    return resultArray;
  }

  configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
    that.setOptionConfigDefaults(rule.id, {
        inputProperties: [],
        onlyWhenAllPropertiesExist: false, // Default to false
        delimiter: '',
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
            that.setOptionConfigDefaults(rule.id, {
            propertyDelimiter: '.',
        })
    
    new Setting(optionEL)
      .setName('Delimiter')
      .setDesc('Character to separate concatenated values if placed into a text property. If empty, no delimiter is used.')
      .addText(text => text
          .setValue(that.getOptionConfig(rule.id ,'delimiter') || '.')
          .setPlaceholder('e.g. "." or ","')
          .onChange(async (value) => {
              that.setOptionConfig(rule.id,'delimiter', value);
          }));
  };
}