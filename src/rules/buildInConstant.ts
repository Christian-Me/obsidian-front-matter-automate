import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, Setting, TFile } from "obsidian";
import { MultiPropertySetting } from "../uiMultiPropertySetting";
import { ERROR, LOG, logger } from "../Log";
import { delimiter } from "path";



/**
 * A built-in rule for the Front Matter Automate plugin that returns constant value(s)
 * instead of extracting them from the frontmatter. Supports multiple value types
 * (text, tags, aliases, multitext) and allows configuration of constant values and delimiters.
 *
 * @remarks
 * - The rule can be configured via the plugin's UI to specify one or more constant values.
 * - For 'text' type, values are joined using a configurable delimiter.
 * - For 'tags', 'aliases', and 'multitext', the values are returned as an array.
 * - Maintains backward compatibility with the deprecated `constantValue` option.
 *
 * @extends RulePrototype
 *
 * @example
 * // Usage in rule configuration:
 * {
 *   id: 'constant',
 *   ruleType: 'buildIn',
 *   type: 'tags',
 *   options: {
 *     constantValues: ['tag1', 'tag2'],
 *     delimiter: ',' 
 *   }
 * }
 */
export class RuleBuildInConstant extends RulePrototype {
    constructor() {
        super();
        this.id = 'constant';
        this.ruleType = 'buildIn';
        this.name = 'Constant value(s)';
        this.description = 'Returns a constant value instead of the frontmatter parameter.';
        this.source = "function (app, file, tools) { // do not change this line!\n  const result = tools.getOptionConfig(tools.getRule()?.id,'constantValue');\n  return result; // Return the constant value\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    fx(app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        const constantValues = tools.getOptionConfig(tools.getRule()?.id,'constantValues');
        if (!Array.isArray(constantValues) || constantValues.length === 0) {
            logger.log(LOG, 'RuleBuildInConstant: No constant values configured.');
            return tools.getCurrentContent();
        }
        const values = constantValues.map(value => {
            if (typeof value === 'object' && value !== null && 'name' in value) {
                return value.name;
            }
            return value;
        });
        switch (tools.getCurrentContentType()) {
            case ('text'):
                return values.join(tools.getOptionConfig(this.id, 'delimiter'));
            case ('tags'):
            case ('aliases'):
            case ('multitext'):
                return values;
        }
        return values;
    };
    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the constant value
        that.setOptionConfigDefaults(rule.id, {
            constantValue: '', // deprecated, use constantValues instead
            constantValues: [],
            delimiter: ',',
        })

        const constantValue = that.getOptionConfig(rule.id, 'constantValue');
        const constantValues = that.getOptionConfig(rule.id, 'constantValues') || [];
        if (constantValue && constantValues.length === 0) {
            // If constantValue is set but constantValues is empty, add it to constantValues
            constantValues.push(constantValue);
            that.setOptionConfig(rule.id, 'constantValues', constantValues);
        }
        const multiProp = new MultiPropertySetting(optionEL)
            .setName("Constant Values")
            .setDesc("Input a value or multiple values to be used in the rule.")
            .setValue(that.getOptionConfig(rule.id, 'constantValues') || [])
            .onChange((arr) => {
                that.setOptionConfig(rule.id, 'constantValues', arr);
                that.updatePreview(rule, previewComponent);
            })
            .onRenderRow((setting, value, idx, onChange) => {
                setting.addText(text => {
                    text.setValue(value.name)
                        .onChange(val =>{
                            onChange({id: val, name: val},idx);
                            multiProp.updatePlusButtonState();
                        });
                });
            });
        new Setting(optionEL)
            .setName('Delimiter')
            .setDesc('Character to separate constant values if placed into a text property. If empty, no delimiter is used.')
            .addText(text => text
                .setValue(that.getOptionConfig(rule.id ,'delimiter') || '.')
                .setPlaceholder('e.g. "." or ","')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'delimiter', value);
                }));
    }
}