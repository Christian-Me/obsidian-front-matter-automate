import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";

/**
 * A rule class that appends a configurable suffix to the input value.
 * 
 * @remarks
 * This rule is intended for use within the Folder to Tags plugin, allowing users to format text, tags, aliases, or multitext fields by adding a specified suffix.
 * 
 * @extends RulePrototype
 * 
 * @example
 * // Usage in a rule chain
 * const result = ruleAddSuffix.fx(app, file, tools, "note");
 * // If suffix is "_done", result will be "note_done"
 * 
 * @property {string} id - The unique identifier for the rule ("addSuffix").
 * @property {string} name - The display name for the rule.
 * @property {string} description - A brief description of the rule's purpose.
 * @property {string} ruleType - The type of rule ("formatter").
 * @property {string} source - The source code for the rule as a string.
 * @property {string[]} type - The types of fields this rule can be applied to.
 * @property {any} configElements - The configuration elements for the rule.
 * 
 * @method fx
 * Appends the configured suffix to the provided input value.
 * 
 * @method configTab
 * Renders the configuration UI for setting the suffix in the plugin's settings tab.
 * 
 */
export class RuleAddSuffix extends RulePrototype {
    constructor() {
        super();
        this.id = 'addSuffix';
        this.name = 'Add a Suffix';
        this.description = 'Adds a suffix to the input value.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: any, tools: ScriptingTools, input?:any) { // Default function signature
        const suffix = tools.getOptionConfig(tools.getRule()?.id, 'suffix');
        return `${input}${suffix}`; // Return the input with a suffix added
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            suffix : '', // Default suffix
        })

        new Setting(optionEL)
            .setName('Suffix')
            .setDesc('Enter a suffix to be added at the end.')
            .addText(text => text
                .setPlaceholder('e.g. "_done"')
                .setValue(that.getOptionConfig(rule.id ,'suffix') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'suffix', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}