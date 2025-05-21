import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * RuleBuildInRootFolder is a rule implementation that extracts the root folder name
 * from the path of a given file in an Obsidian vault.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The rule identifies the top-level directory (root folder) where the file is stored.
 * - If the file is at the root of the vault (i.e., not inside any folder), an empty string is returned.
 * - The rule is categorized as a 'buildIn' type and supports multiple output types: 'text', 'tags', 'aliases', and 'multitext'.
 *
 * @example
 * // If file.path is 'Projects/Notes/meeting.md', the rule returns 'Projects'.
 * // If file.path is 'readme.md', the rule returns '' (empty string).
 *
 * @param app - The current Obsidian App instance (may be undefined).
 * @param file - The TFile object representing the file whose root folder is to be determined.
 * @param tools - ScriptingTools utility object for additional operations (not used in this rule).
 *
 * @returns The name of the root folder as a string, or an empty string if the file is in the vault root.
 */
export class RuleBuildInRootFolder extends RulePrototype {
  constructor() {
    super();
    this.id = 'rootFolder';
    this.ruleType = 'buildIn';
    this.name = 'Root folder';
    this.description = 'Returns the root folder where the file is stored.';
    this.source = "";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    // acquire file path
    const path = file.path;
    const parts = path.split('/');
    let result = '';
    if (parts.length > 1) {
      result = parts[0];
    }
    return result;
  }

  configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
      // Configuration tab logic can be added here if needed
  };
    
}