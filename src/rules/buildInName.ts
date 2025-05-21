import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


/**
 * A rule that extracts the file name without its extension.
 *
 * @remarks
 * This rule is intended for use within the Folder to Tags Obsidian plugin.
 * It provides a way to retrieve the base name of a file, excluding all extensions.
 *
 * @extends RulePrototype
 *
 * @example
 * // Given a file named "example.note.md", the rule will return "example".
 *
 * @property {string} id - The unique identifier for the rule ("name").
 * @property {string} ruleType - The type of the rule ("buildIn").
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's purpose.
 * @property {string} source - The source of the rule (empty for built-in).
 * @property {string[]} type - The types this rule applies to (e.g., text, tags).
 * @property {any[]} configElements - The configuration elements for the rule.
 *
 * @method fx
 * Returns the file name without its extension using the provided scripting tools.
 *
 * @method configTab
 * (Optional) Provides a configuration tab for the rule.
 */
export class RuleBuildInName extends RulePrototype {
  constructor() {
    super();
    this.id = 'name';
    this.ruleType = 'buildIn';
    this.name = 'File name without extension';
    this.description = 'Returns the file name without all extensions. I.e. example.note.md => example';
    this.source = "";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    // acquire file name
    const result = tools.removeAllExtensions(file.name);
    return result;
  }

  configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
    // Configuration tab logic can be added here if needed
  };
    
}