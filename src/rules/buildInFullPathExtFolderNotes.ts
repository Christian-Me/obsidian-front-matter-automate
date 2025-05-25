import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * Represents a rule for generating a full path with extensions compatible with "folder notes".
 * This rule modifies the file path to ensure compatibility with folder notes by adjusting
 * the path structure based on the file's basename and parent folder.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - The `source` property contains a stringified function that performs the path transformation.
 * - The `fx` method implements the same logic as the `source` function but is directly executable.
 * - This rule is categorized as a built-in rule (`ruleType: 'buildIn'`).
 * 
 * @property {string} id - Unique identifier for the rule (`fullPathExtFolderNotes`).
 * @property {string} ruleType - Type of the rule (`buildIn`).
 * @property {string} name - Display name of the rule.
 * @property {string} description - Description of the rule's purpose.
 * @property {string} source - Stringified function defining the rule's logic.
 * @property {string[]} type - Applicable types for the rule (`['text', 'tags', 'aliases', 'multitext']`).
 * @property {Function} fx - Function implementing the rule's logic.
 * @property {Function} configTab - Optional configuration tab logic for the rule.
 * 
 * @method fx
 * @param {App | undefined} app - The application instance (optional).
 * @param {TFile} file - The file object containing path and basename information.
 * @param {ScriptingTools} tools - Utility tools for scripting.
 * @returns {string} - The transformed file path.
 * 
 * @method configTab
 * @param {HTMLElement} optionEL - The HTML element for the configuration tab.
 * @param {FrontmatterAutomateRuleSettings} rule - The rule settings object.
 * @param {any} that - Reference to the current context.
 * @param {any} previewComponent - Component for previewing changes.
 */
export class RuleBuildInFullPathExtFolderNotes extends RulePrototype {
    constructor() {
        super();
        this.id = 'fullPathExtFolderNotes';
        this.ruleType = 'buildIn';
        this.name = 'Full Path with Extension (comply with "folder notes")';
        this.description = 'Path with Extensions compatible with folder notes.';
        this.source = "function (app, file, tools) { // do not change this line!\n  let parts = file.path.split('/');\n  parts.pop();\n  if (parts[parts.length-1] === file.basename) parts.pop();\n  parts.push(file.basename);\n  return parts.join('/');\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        let parts = file.path.split('/');
        parts.pop(); // remove file name
        if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
        parts.push(file.name); // add the file name back
        return parts.join('/');
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        // Configuration tab logic can be added here if needed
    };
    
}