import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";


/**
 * A rule class for replacing special characters in strings, while preserving letters with diacritics.
 * 
 * This rule is intended for use in formatting text, tags, aliases, and multitext fields. It allows
 * the user to specify a replacement character (suggested: "-") for any character that does not match
 * the allowed set (letters, numbers, dashes, underscores, slashes, and common diacritics).
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - The replacement character can be configured via the settings UI.
 * - The rule preserves letters with diacritics (e.g., ä, ö, ü, á, é, etc.).
 * - The `fx` method performs the replacement using a regular expression.
 * 
 * @example
 * // Replace all special characters in a string with '-'
 * rule.fx(app, file, tools, "hello@world!") // returns "hello-world-"
 * 
 * @property {string} id - Unique identifier for the rule.
 * @property {string} name - Display name for the rule.
 * @property {string} description - Description of the rule's purpose.
 * @property {string} ruleType - Type of the rule (e.g., 'formatter').
 * @property {string} source - Source code for the rule's function.
 * @property {string[]} type - Types of fields the rule applies to.
 * @property {object} configElements - Configuration elements for the rule.
 */
export class RuleReplaceSpecialChars extends RulePrototype {
    constructor() {
        super();
        this.id = 'replaceSpecialChars';
        this.name = 'Replace Special Characters';
        this.description = 'Character to replace special characters (suggested: "-") - preserves letters with diacritics';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };

    fx (app: App | undefined, file: any, tools: ScriptingTools, input?:any, extraId?: string) { // Default function signature
        const specialCharReplacement = tools.getOptionConfig(tools.getRule()?.id, 'specialCharReplacement', extraId);
        return input.replace(/[^a-zA-Z0-9\-_\/äöüßÄÖÜáéíóúýÁÉÍÓÚÝàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕ]/g, specialCharReplacement);
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any, extraId: string) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            specialCharReplacement : '', // Default suffix
        }, extraId)

        new Setting(optionEL)
            .setName('Replace Special Characters')
            .setDesc('Character to replace special characters (suggested: "-") - preserves letters with diacritics')
            .addText(text => text
                .setPlaceholder('will remove special characters')
                .setValue(that.getOptionConfig(rule.id ,'specialCharReplacement', extraId) || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'specialCharReplacement', value, extraId);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}