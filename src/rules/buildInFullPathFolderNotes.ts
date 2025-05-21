import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * A built-in rule for generating a full path compatible with "folder notes" plugin.
 * 
 * This rule processes a file's path such that:
 * - The file name is removed from the path.
 * - If the parent folder has the same name as the file, it is also removed.
 * - The file's base name is appended to the resulting path.
 * 
 * The resulting path is suitable for use cases where folder notes are used, ensuring compatibility.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - The `fx` method implements the core logic for path transformation.
 * - The `configTab` method can be extended to provide a configuration UI.
 * 
 * @example
 * // For a file at "folder1/folder2/note/note.md"
 * // The resulting path will be "folder1/folder2/note"
 * 
 * @property {string} id - Unique identifier for the rule.
 * @property {string} ruleType - Type of the rule, set to 'buildIn'.
 * @property {string} name - Human-readable name for the rule.
 * @property {string} description - Description of the rule's purpose.
 * @property {string} source - Stringified function source for scripting.
 * @property {string[]} type - Supported types for the rule.
 * @property {any[]} configElements - Configuration elements for the rule.
 */
export class RuleBuildInFullPathFolderNotes extends RulePrototype {
    constructor() {
        super();
        this.id = 'fullPathFolderNotes';
        this.ruleType = 'buildIn';
        this.name = 'Full Path (comply with "folder notes")';
        this.description = 'Path compatible compatible with folder notes.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  let parts = file.path.split('/');\n  parts.pop();\n  if (parts[parts.length-1] === file.basename) parts.pop();\n  parts.push(file.basename);\n  return parts.join('/');\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        let parts = file.path.split('/');
        parts.pop(); // remove file name
        if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
        parts.push(file.basename); // add the file name back
        return parts.join('/');
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        // Configuration tab logic can be added here if needed
    };
    
}