import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * Represents a built-in rule for handling folder notes in a path-compatible manner.
 * This rule processes file paths to determine the appropriate folder structure,
 * removing parent folders if they share the same name as the file.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The `fx` method implements the core logic for path manipulation.
 * - The `source` property contains the serialized function logic for external use.
 * - This rule is designed to work with text, tags, aliases, and multitext types.
 *
 * @example
 * // Example usage of the `fx` method:
 * const result = rule.fx(app, file, tools);
 * console.log(result); // Outputs the processed path
 *
 * @property {string} id - The unique identifier for the rule (`pathFolderNotes`).
 * @property {string} ruleType - The type of rule (`buildIn`).
 * @property {string} name - The display name of the rule (`Path (folder notes)`).
 * @property {string} description - A brief description of the rule's purpose.
 * @property {string} source - The serialized function logic for external use.
 * @property {string[]} type - The types of data this rule applies to (`text`, `tags`, `aliases`, `multitext`).
 * @property {Function} configTab - A placeholder for configuration tab logic.
 *
 * @method fx
 * Processes the file path to determine the appropriate folder structure.
 * Removes the parent folder if it shares the same name as the file.
 *
 * @param {App | undefined} app - The application instance (optional).
 * @param {TFile} file - The file object containing path and basename information.
 * @param {ScriptingTools} tools - Utility tools for scripting operations.
 * @returns {string} - The processed path after applying the rule logic.
 *
 * @method configTab
 * Placeholder method for adding configuration tab logic.
 *
 * @constructor
 * Initializes the rule with default properties and configuration elements.
 */
export class RuleBuildInPathFolderNotes extends RulePrototype {
    constructor() {
        super();
        this.id = 'pathFolderNotes';
        this.ruleType = 'buildIn';
        this.name = 'Path (folder notes)';
        this.description = 'Path compatible with folder notes.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  let parts = file.path.split('/');\n  parts.pop();\n  if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file\n  return parts.join('/');\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        let parts = file.path.split('/');
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
        return parts.join('/');
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        // Configuration tab logic can be added here if needed
    };
    
}