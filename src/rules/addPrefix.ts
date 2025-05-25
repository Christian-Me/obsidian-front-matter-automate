import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";


/**
 * A rule class that adds a configurable prefix to an input value.
 * 
 * @remarks
 * This rule is intended for use in formatting operations, such as adding a prefix to text, tags, aliases, or multi-text fields.
 * The prefix value is configurable via the plugin's settings UI.
 * 
 * @extends RulePrototype
 * 
 * @example
 * // Usage in a formatting pipeline:
 * const result = ruleAddPrefix.fx(app, file, tools, "example");
 * // If prefix is set to "pre-", result will be "pre-example"
 * 
 * @property {string} id - The unique identifier for the rule ('addPrefix').
 * @property {string} name - The display name for the rule.
 * @property {string} description - A short description of what the rule does.
 * @property {string} ruleType - The type of rule ('formatter').
 * @property {string} source - The source code for the rule as a string.
 * @property {string[]} type - The types of fields this rule can be applied to.
 * @property {any} configElements - The configuration elements for the rule.
 * 
 * @method fx
 * Adds the configured prefix to the provided input value.
 * 
 * @method configTab
 * Renders the configuration UI for setting the prefix value.
 */
export class RuleAddPrefix extends RulePrototype {
    constructor() {
        super();
        this.id = 'addPrefix';
        this.name = 'Add a Prefix';
        this.description = 'Adds a prefix to the input value.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: any, tools: ScriptingTools, input?:any) { // Default function signature
        const prefix = tools.getOptionConfig(tools.getRule()?.id, 'prefix');
        return `${prefix}${input}`; // Return the input with a prefix added
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            prefix : '', // Default prefix
        })

        new Setting(optionEL)
            .setName('Prefix')
            .setDesc('Enter a prefix to be added at the beginning.')
            .addText(text => text
                .setPlaceholder('e.g. "pre-"')
                .setValue(that.getOptionConfig(rule.id ,'prefix') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'prefix', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}