import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";

/**
 * Represents a built-in rule that returns the size of a file as a human-readable string.
 *
 * This rule converts the file size from bytes to KB, MB, or GB as appropriate,
 * formatting the result with a fixed number of decimal places.
 *
 * @remarks
 * - The rule is identified by the ID `'fileSizeString'`.
 * - The `fx` method performs the file size conversion and formatting.
 * - The rule is intended for use within the Folder to Tags plugin for Obsidian.
 *
 * @extends RulePrototype
 *
 * @example
 * // Returns "512 Bytes" for a 512-byte file
 * // Returns "1.23 KB" for a file of size 1259 bytes
 * // Returns "2.34 MB" for a file of size 2,453,123 bytes
 *
 * @public
 */
export class RuleBuildInFileSizeString extends RulePrototype {
    constructor() {
        super();
        this.id = 'fileSizeString';
        this.ruleType = 'buildIn';
        this.name = 'File Size as String';
        this.description = 'Converts the file size to a human-readable string (e.g., KB, MB, GB) with 2 decimal places precision.';
        this.source = "function(app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line! \n let size =file.stat.size; \n const precision = 2; // number of decimal places \n if (size > 1024) { \n   size = size / 1024; \n   if (size > 1024) { \n     size = size / 1024; \n     if (size > 1024) { \n       size = size / 1024; \n       return size.toFixed(precision) + ' GB'; \n     } \n     return size.toFixed(precision) + ' MB'; \n   } \n   return size.toFixed(precision) + ' KB'; \n }   \n return size + ' Bytes'; // return you result. \n }";
        this.type = ['text'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
       // acquire file size
        let size =file.stat.size;
        const precision = 2; // number of decimal places
        if (size > 1024) {
          size = size / 1024;
          if (size > 1024) {
            size = size / 1024;
            if (size > 1024) {
              size = size / 1024;
              return size.toFixed(precision) + ' GB';
            } 
            return size.toFixed(precision) + ' MB';
          }
          return size.toFixed(precision) + ' KB';
        }   
        return size + ' Bytes'; // return you result.
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        // Configuration tab logic can be added here if needed
    };
    
}