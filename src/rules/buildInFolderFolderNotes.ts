import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * Represents a built-in rule that returns the parent folder of a file,
 * compatible with the "Folder Notes" convention in Obsidian.
 *
 * This rule determines the parent folder name for a given file, taking into account
 * the special case where the file is a folder note (i.e., its name matches its parent folder).
 * If the file is located in the root directory, the vault name is returned instead.
 *
 * @extends RulePrototype
 *
 * @remarks
 * - The rule is identified by the ID 'folderFolderNotes'.
 * - The rule type is 'buildIn'.
 * - The `fx` method should not have its signature changed, as it is used by the rule engine.
 *
 * @example
 * // For a file at 'Projects/Notes/Notes.md' (where 'Notes' is a folder note):
 * // Returns 'Projects'
 *
 * // For a file at 'Projects/Notes/Meeting.md':
 * // Returns 'Notes'
 *
 * // For a file at the vault root:
 * // Returns the vault name
 *
 * @param app - The Obsidian App instance (may be undefined).
 * @param file - The target TFile for which the parent folder is determined.
 * @param tools - Utility tools, including access to the vault.
 * @returns The name of the parent folder, or the vault name if the file is in the root.
 */
export class RuleBuildInFolderFolderNotes extends RulePrototype {
    constructor() {
      super();
      this.id = 'folderFolderNotes';
      this.ruleType = 'buildIn';
      this.name = 'Parent Folder (complies with "folder notes")';
      this.description = 'Returns the parent folder of the file compatible with Folder Notes.';
      this.source = "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;const parts = file.path.split('/');\n  let index = parts.length-2; // index of parent folder\n  if (parts[parts.length-2]===file.basename) {\n      index--; // folder note parent is the child\n  }\n  if (index >= 0) {\n    return parts[index]; // file in folder\n  } else {\n    return tools.app?.vault?.getName() || 'Vault'; // file in root = vault\n  }\n}";
      this.type = ['text', 'tags', 'aliases', 'multitext'];
      this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
      // acquire file path
      const path = file.path;const parts = file.path.split('/');
      let index = parts.length-2; // index of parent folder
      if (parts[parts.length-2]===file.basename) {
          index--; // folder note parent is the child
      }
      if (index >= 0) {
        return parts[index]; // file in folder
      } else {
        return tools.app?.vault?.getName() || 'Vault'; // file in root = vault
      }
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        // Configuration tab logic can be added here if needed
    };
    
}