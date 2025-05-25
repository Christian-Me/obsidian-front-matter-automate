import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";

/**
 * A rule class that replaces spaces in a given input value with a specified character.
 * 
 * This rule is intended for use in formatting text, tags, aliases, or multitext fields.
 * The replacement character can be configured by the user via the settings UI.
 * 
 * @extends RulePrototype
 * 
 * @example
 * // If the replacement character is set to "_":
 * rule.fx(app, file, tools, "hello world") // returns "hello_world"
 * 
 * @property {string} id - The unique identifier for the rule ("replaceSpaces").
 * @property {string} name - The display name for the rule.
 * @property {string} description - A description of what the rule does.
 * @property {string} ruleType - The type of rule ("formatter").
 * @property {string[]} type - The applicable field types for the rule.
 * @property {any} configElements - The configuration elements for the rule.
 * 
 * @method fx
 * Replaces all spaces in the input value with the configured replacement character.
 * 
 * @method configTab
 * Renders the configuration UI for setting the space replacement character.
 */
export class RuleReplaceSpaces extends RulePrototype {
    constructor() {
        super();
        this.id = 'replaceSpaces';
        this.name = 'Replace Spaces';
        this.description = 'Replaces spaces in the input value with a specified character.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: any, tools: ScriptingTools, input?:any) { // Default function signature
        const spaceReplacement = tools.getOptionConfig(tools.getRule()?.id, 'spaceReplacement');
        return input.replace(/\s+/g, spaceReplacement); // Replace all spaces with the specified character
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            spaceReplacement : '', // Default suffix
        })

        new Setting(optionEL)
            .setName('Space replacement')
            .setDesc('Character to replace spaces (suggested: "_")')
            .addText(text => text
                .setPlaceholder('will remove spaces')
                .setValue(that.getOptionConfig(rule.id ,'spaceReplacement') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'spaceReplacement', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}