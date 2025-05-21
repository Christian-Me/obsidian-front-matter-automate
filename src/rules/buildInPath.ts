import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * Represents a rule that extracts the folder path of a file in Obsidian.
 * This rule is built-in and provides functionality to retrieve the full path
 * of the folder where a file is stored.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The rule is identified by the `id` "path".
 * - It is categorized as a "buildIn" rule type.
 * - The rule supports multiple types: `text`, `tags`, `aliases`, and `multitext`.
 * - The `source` property contains the function definition as a string, which should not be modified.
 * - The `fx` property implements the logic to extract the folder path from the file's path.
 *
 * @example
 * // Example usage of the rule:
 * const rule = new RuleBuildInPath();
 * const folderPath = rule.fx(app, file, tools);
 * console.log(folderPath); // Outputs the folder path of the file
 *
 * @property {string} id - The unique identifier for the rule ("path").
 * @property {string} ruleType - The type of the rule ("buildIn").
 * @property {string} name - The display name of the rule ("Full path").
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} source - The source code of the rule's function as a string.
 * @property {string[]} type - The supported types for the rule.
 * @property {Function} fx - The function that implements the rule's logic.
 * @property {Function} configTab - A placeholder for configuring the rule in the UI.
 */
export class RuleBuildInPath extends RulePrototype {
    constructor() {
        super();
        this.id = 'path';
        this.ruleType = 'buildIn';
        this.name = 'Full path';
        this.description = 'Returns the folder path the file is stored in.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  let parts = file.path.split('/');\n  parts.pop();\n  return parts.join('/');\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };

    fx (app: App | undefined, file: TFile, tools: ScriptingTools) {
        let parts = file.path.split('/');
        parts.pop();
        return parts.join('/');
    };

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        // Configuration tab logic can be added here if needed
    };
}