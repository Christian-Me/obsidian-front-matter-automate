import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, Setting, TFile } from "obsidian";

/**
 * Represents a built-in rule that returns a constant value instead of extracting a value from the frontmatter.
 *
 * This rule allows users to specify a constant value that will always be returned when the rule is executed.
 * The value can be configured via the plugin's settings UI.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The rule type is set to `'buildIn'`.
 * - The constant value is configured using the `constantValue` option.
 * - The rule supports multiple types: `'text'`, `'tags'`, `'aliases'`, and `'multitext'`.
 *
 * @example
 * ```typescript
 * const rule = new RuleBuildInConstant();
 * const value = rule.fx(app, file, tools); // Returns the configured constant value
 * ```
 */
export class RuleBuildInConstant extends RulePrototype {
    constructor() {
        super();
        this.id = 'constant';
        this.ruleType = 'buildIn';
        this.name = 'Constant value';
        this.description = 'Returns a constant value instead of the frontmatter parameter.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  const result = tools.getOptionConfig(tools.getRule()?.id,'constantValue');\n  return result; // Return the constant value\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    fx(app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        const result = tools.getOptionConfig(tools.getRule()?.id,'constantValue');
        return result; // Return the constant value
    };
    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the constant value
        that.setOptionConfigDefaults(rule.id, {
            constantValue: '',
        })
        // Create a setting for the constant value
        new Setting(optionEL)
            .setName('Constant value')
            .setDesc('Enter a constant value to be used in the rule')
            .addText(text => text
                .setValue(that.getOptionConfig(rule.id ,'constantValue') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'constantValue', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}