  import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * A built-in rule that returns the file name with its extension.
 *
 * @remarks
 * This rule is part of the folder-to-tags-plugin and extends the {@link RulePrototype}.
 * It is identified by the ID `'nameExt'` and is categorized as a built-in rule.
 * The rule can be used in contexts requiring the file name including its extension,
 * such as text, tags, aliases, or multitext fields.
 *
 * @example
 * // Returns "example.md" for a file named "example.md"
 * const fileNameWithExt = rule.fx(app, file, tools);
 *
 * @public
 */
export class RuleBuildInNameExt extends RulePrototype {
  constructor() {
    super();
    this.id = 'nameExt';
    this.ruleType = 'buildIn';
    this.name = 'File name with extension';
    this.description = 'Returns the file name with extension.';
    this.source = "function (app, file, tools) { // do not change this line!\n  // acquire file name with extension\n  const result = file.name;\n  return result;\n}";
    this.type = ['text', 'tags', 'aliases', 'multitext'];
    this.configElements = this.defaultConfigElements({});
  }
  
  public fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
    // acquire file name
    const result = file.name;
    return result;
  }

  public configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
    // Configuration tab logic can be added here if needed
  };
    
}