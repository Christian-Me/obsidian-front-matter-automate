import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, Setting, TFile } from "obsidian";

/**
 * Represents a built-in rule for creating a link to a file in the current vault.
 * This rule can be configured to include or exclude the file extension in the generated link.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The rule generates a link in the format `[[path/to/file|fileName]]`.
 * - The `addExtension` option determines whether the file extension is included in the link.
 *
 * @example
 * // Example output with `addExtension` set to true:
 * [[path/to/file.md|file]]
 *
 * // Example output with `addExtension` set to false:
 * [[path/to/file|file]]
 *
 * @property {string} id - The unique identifier for the rule (`linkToFile`).
 * @property {string} ruleType - The type of the rule (`buildIn`).
 * @property {string} name - The display name of the rule (`Create link to file`).
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} source - The source code of the rule's main function.
 * @property {string[]} type - The types of content this rule applies to (`text`, `tags`, `aliases`, `multitext`).
 * @property {Function} fx - The main function that generates the link to the file.
 * @property {Function} configTab - The configuration UI for the rule, allowing users to toggle the `addExtension` option.
 *
 * @method defaultConfigElements
 * Returns the default configuration elements for the rule.
 *
 * @param {App} app - The Obsidian application instance.
 * @param {TFile} file - The file for which the link is being generated.
 * @param {ScriptingTools} tools - Utility tools for scripting and rule management.
 */
export class RuleBuildInLinkToFile extends RulePrototype {
    constructor() {
        super();
        this.id = 'linkToFile';
        this.ruleType = 'buildIn';
        this.name = 'Create link to file';
        this.description = 'Create a link to the file in the current vault. Can be configured to include the file extension.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  const parts = file.path.split('/');\n  const rule = tools.getRule();\n  if (!rule) return tools.getCurrentContent();\n  const addExtension = tools.getOptionConfig(rule.id,'addExtension') \n  parts.pop();\n  if (parts[parts.length-1] === file.basename) parts.pop();\n  let fileName = addExtension? file.basename + '.' + file.extension : file.basename; \n  return `[[${parts.join('/')}/${fileName}|${file.basename}]]`;\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    fx (app: App, file:TFile, tools:ScriptingTools){
        const parts = file.path.split('/');
        const rule = tools.getRule();
        if (!rule) return tools.getCurrentContent();
        const addExtension = tools.getOptionConfig(rule.id,'addExtension') 
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop();
        let fileName = addExtension? file.basename + '.' + file.extension : file.basename; 
        return `[[${parts.join('/')}/${fileName}|${file.basename}]]`;
    };
    
    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        that.setOptionConfigDefaults(rule.id, {
            addExtension: true
        })
    
        new Setting(optionEL)
            .setName('Include file extension')
            .setDesc('Add file extension to pathname')
            .addToggle(toggle => toggle
                .setValue(that.getOptionConfig(rule.id ,'addExtension') || false)
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'addExtension', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}