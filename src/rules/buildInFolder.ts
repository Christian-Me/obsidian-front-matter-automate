import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


/**
 * Represents a built-in rule that extracts the parent folder of a file.
 * This rule is used to determine the folder name that directly contains the file.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - The `fx` method calculates the parent folder by analyzing the file path.
 * - The `source` property contains a default function template for scripting purposes.
 * - The `type` property specifies the supported data types for this rule.
 * - The `configTab` method can be used to define a configuration UI for the rule, if needed.
 * 
 * @example
 * // Example usage of the `fx` method:
 * const parentFolder = rule.fx(app, file, tools);
 * console.log(parentFolder); // Outputs the name of the parent folder
 * 
 * @property {string} id - The unique identifier for the rule, set to 'folder'.
 * @property {string} ruleType - The type of the rule, set to 'buildIn'.
 * @property {string} name - The display name of the rule, set to 'Parent folder'.
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} source - A default function template for scripting.
 * @property {string[]} type - The supported data types for the rule.
 * @property {Function} configElements - A method to define default configuration elements.
 * 
 * @method fx
 * @param {App | undefined} app - The application instance (optional).
 * @param {TFile} file - The file object for which the parent folder is determined.
 * @param {ScriptingTools} tools - Utility tools for scripting.
 * @returns {string} The name of the parent folder, or an empty string if no parent exists.
 * 
 * @method configTab
 * @param {HTMLElement} optionEL - The HTML element for the configuration tab.
 * @param {FrontmatterAutomateRuleSettings} rule - The rule settings object.
 * @param {any} that - A reference to the current context.
 * @param {any} previewComponent - A component for previewing changes.
 */
export class RuleBuildInFolder extends RulePrototype {
  constructor() {
    super();
    this.id = 'folder';
    this.ruleType = 'buildIn';
    this.name = 'Parent folder';
    this.description = 'Returns the parent folder of the file.';
    this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  const input = tools.getCurrentContent(); // Get the current content of property\n  return input; // Return the input unaltered\n};";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    // acquire file path
    const path = file.path;
    const parts = path.split('/');
    let result = '';
    if (parts.length > 1) {
      result = parts[parts.length-2];
    }
    return result;
  }

  configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
    // Configuration tab logic can be added here if needed
  };
    
}