import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


/**
 * Represents a rule that generates the full path of a file, including its filename.
 * This rule is built-in and can be used to retrieve the complete file path as a string.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The `fx` function splits the file path, removes the last part (assumed to be the filename),
 *   appends the file's basename, and then joins the parts back together to form the full path.
 * - This rule can be used for multiple property types: `text`, `tags`, `aliases`, and `multitext`.
 *
 * @property {string} id - The unique identifier for the rule (`'fullPath'`).
 * @property {string} ruleType - The type of the rule (`'buildIn'`).
 * @property {string} name - The display name of the rule (`'Full path, filename'`).
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} source - The source code of the rule's function as a string.
 * @property {string[]} type - The property types the rule can be used for.
 * @property {Function} fx - The function that implements the rule's logic.
 * @property {Function} configTab - A placeholder function for configuring the rule in the UI.
 *
 * @example
 * // Example usage of the `fx` function:
 * const fullPath = rule.fx(app, file, tools);
 * console.log(fullPath); // Outputs the full path of the file, including its filename.
 */
export class RuleBuildInFullPath extends RulePrototype {
    constructor() {
        super();
        this.id = 'fullPath';
        this.ruleType = 'buildIn';
        this.name = 'Full path, filename';
        this.description = 'Returns the full path of the file, including the filename.';
        this.source = "function (app, file, tools) { // do not change this line!\n  let parts = file.path.split('/');\n  parts.pop();\n  parts.push(file.basename);\n  return parts.join('/');\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };

    fx (app: App | undefined, file: TFile, tools: ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        parts.push(file.basename);
        return parts.join('/');
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
    };

}