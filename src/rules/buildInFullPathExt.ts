import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


/**
 * Represents a built-in rule that returns the full path of a file, including its filename and extension.
 * 
 * This rule is part of the "folder-to-tags-plugin" and is used to generate or manipulate metadata
 * based on the full path of a file. It extends the `RulePrototype` class and provides configuration
 * options, a description, and a function to execute the rule logic.
 * 
 * @class RuleBuildInFullPathExt
 * @extends RulePrototype
 * 
 * @property {string} id - The unique identifier for this rule (`fullPathExt`).
 * @property {string} ruleType - The type of the rule (`buildIn`).
 * @property {string} name - The display name of the rule (`Full path, filename and extension`).
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} source - The source code of the rule's logic as a string.
 * @property {string[]} type - The types of metadata this rule can be applied to (`text`, `tags`, `aliases`, `multitext`).
 * @property {Function} fx - The function that implements the rule logic, returning the full path of the file.
 * @property {Function} configTab - A function to render the configuration tab for this rule.
 * 
 * @method defaultConfigElements - Inherited from `RulePrototype`, used to define default configuration elements.
 */
export class RuleBuildInFullPathExt extends RulePrototype {
    constructor() {
        super();
        this.id = 'fullPathExt';
        this.ruleType = 'buildIn';
        this.name = 'Full path, filename and extension';
        this.description = 'Returns the full path of the file, including its filename and extension.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  return `${file.path}`;\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };

    fx(app: App, file: TFile, tools: ScriptingTools) {
        return `${file.path}`;
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        // Configuration tab logic can be added here if needed
        // For example, you can create settings for the rule here
    };
    
}