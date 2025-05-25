import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * Represents a built-in rule that passes the content of a frontmatter parameter unaltered.
 * This rule is used to return the input content without any modifications.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - The `fx` function and `source` property are designed to process the input content and return it as-is.
 * - This rule supports multiple types including `text`, `tags`, `aliases`, and `multitext`.
 * - The `configTab` method is currently a placeholder for configuration UI elements.
 * 
 * @property {string} id - The unique identifier for the rule, set to `'default'`.
 * @property {string} ruleType - The type of the rule, set to `'buildIn'`.
 * @property {string} name - The display name of the rule, set to `'Pass parameter unaltered'`.
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} source - The source code of the rule as a string, used for scripting purposes.
 * @property {string[]} type - The supported types for this rule, including `text`, `tags`, `aliases`, and `multitext`.
 * @property {Function} fx - The main function that processes the input content and returns it unaltered.
 * @property {Function} configTab - A method for rendering the configuration tab for the rule.
 * 
 * @constructor
 * Initializes a new instance of the `RuleBuildInDefault` class.
 */
export class RuleBuildInDefault extends RulePrototype {
    constructor() {
        super();
        this.id = 'default';
        this.ruleType = 'buildIn';
        this.name = 'Pass parameter unaltered';
        this.description = 'Pass the content of the frontmatter parameter unaltered.';
        this.source = "function (app, file, tools) { // do not change this line!\n  const input = tools.getCurrentContent(); // Get the current content of property\n  return input; // Return the input unaltered\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        const input = tools.getCurrentContent(); // Get the current content of property
        return input; // Return the input unaltered
    };

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        // Configuration tab logic can be added here if needed
    };
    
}