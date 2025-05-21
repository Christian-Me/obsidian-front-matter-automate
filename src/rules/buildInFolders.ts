import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * A built-in rule that extracts all folders from the path of a given file and returns them as a list.
 *
 * @remarks
 * This rule is intended for use within the Folder-to-Tags Obsidian plugin.
 * It provides a way to retrieve all folder names (as a string array) that a file is stored in,
 * excluding the file name itself.
 *
 * @extends RulePrototype
 *
 * @example
 * // If file.path is 'folder1/folder2/myfile.md', the result will be ['folder1', 'folder2']
 *
 * @property {string} id - The unique identifier for the rule ('folders').
 * @property {string} ruleType - The type of the rule ('buildIn').
 * @property {string} name - The display name of the rule.
 * @property {string} description - A description of what the rule does.
 * @property {string} source - The source of the rule (empty for built-in).
 * @property {string[]} type - The types this rule applies to (e.g., 'tags', 'aliases', 'multitext').
 * @property {any[]} configElements - The configuration elements for this rule.
 *
 * @method fx
 * Returns all folders the file is stored in as a list.
 * @param app - The Obsidian app instance (optional).
 * @param file - The file whose folders are to be extracted.
 * @param tools - Scripting tools provided by the plugin.
 * @returns {string[]} An array of folder names.
 *
 * @method configTab
 * Optional configuration tab logic for the rule.
 * @param optionEL - The HTML element for the configuration tab.
 * @param rule - The rule settings.
 * @param that - The context object.
 * @param previewComponent - The preview component for the configuration UI.
 */
export class RuleBuildInFolders extends RulePrototype {
    constructor() {
      super();
      this.id = 'folders';
      this.ruleType = 'buildIn';
      this.name = 'All folders of the file as a list';
      this.description = 'Returns all folders the file is stored in as a list.';
      this.source = "";
      this.type = ['tags', 'aliases', 'multitext'];
      this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
      // acquire file path
      const path = file.path;
      const result = path.split('/');
      result.pop();
      return result;
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        // Configuration tab logic can be added here if needed
    };
    
}