import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";
import { ERROR, logger, WARNING } from "../Log";


/**
 * A rule class for replacing configurable characters in an input value with a specified text string.
 * Supports both plain text and regular expression replacements.
 * 
 * @remarks
 * - This rule is intended for use in formatting operations, such as replacing spaces or other characters in tags, aliases, or text fields.
 * - The replacement behavior is configurable via the `replace` (search pattern) and `replaceBy` (replacement string) options.
 * - The configuration UI allows users to specify the search pattern (supports regex) and the replacement string.
 * 
 * @extends RulePrototype
 * 
 * @example
 * // Replace all spaces with underscores in a string
 * const rule = new RuleReplaceSpaces();
 * rule.fx(app, file, tools, "my tag name"); // returns "my_tag_name" if configured appropriately
 * 
 * @property {string} id - The unique identifier for the rule.
 * @property {string} name - The display name of the rule.
 * @property {string} description - A description of what the rule does.
 * @property {string} ruleType - The type of rule (e.g., 'formatter').
 * @property {string} source - The source code for the rule's function.
 * @property {string[]} type - The types of fields this rule can be applied to.
 * @property {any} configElements - The configuration elements for the rule.
 * 
 * @method fx
 * Applies the replacement rule to the input value using the configured search pattern and replacement string.
 * 
 * @method configTab
 * Renders the configuration tab UI for setting the search and replacement strings.
 */
export class RuleReplaceChars extends RulePrototype {
    constructor() {
        super();
        this.id = 'replaceChars';
        this.name = 'Replace Characters';
        this.description = 'Replaces configurable characters in the input value with a specified text string. Supports text and regex replacements.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: any, tools: ScriptingTools, input?:any) { // Default function signature
        const replace = tools.getOptionConfig(tools.getRule()?.id, 'replace');
        if (!replace || replace === '') {
            return input;
        }
        const replaceBy = tools.getOptionConfig(tools.getRule()?.id, 'replaceBy');
        try {
            const regex = new RegExp(replace, 'g');
            return input.replace(regex, replaceBy);
        } catch (e) {
            logger.log(ERROR,`Error in RuleReplaceChars: Invalid regex pattern "${replace}"`, e);
            return input;
        }
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            replace: '', // search for this string
            replaceBy: '', // replace with this string
        })

        new Setting(optionEL)
            .setName('search for')
            .setDesc('Character to search for in the input value (Regex supported)')
            .addText(text => text
                .setPlaceholder('search for')
                .setValue(that.getOptionConfig(rule.id ,'replace') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'replace', value);
                    that.updatePreview(rule, previewComponent);
                })
            );

        new Setting(optionEL)
            .setName('replace by')
            .setDesc('Character to replace matches')
            .addText(text => text
                .setPlaceholder('replace by')
                .setValue(that.getOptionConfig(rule.id ,'replaceBy') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'replaceBy', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}