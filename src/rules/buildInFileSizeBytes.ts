import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


/**
 * Represents a built-in rule that retrieves the size of a file in bytes.
 *
 * @remarks
 * This rule is intended for use within the Folder to Tags plugin for Obsidian.
 * It extends the {@link RulePrototype} class and provides functionality to return
 * the file size in bytes using the `file.stat.size` property.
 *
 * @example
 * ```typescript
 * const rule = new RuleBuildInFileSizeBytes();
 * const size = rule.fx(app, file, tools); // Returns the file size in bytes
 * ```
 *
 * @extends RulePrototype
 *
 * @public
 */
export class RuleBuildInFileSizeBytes extends RulePrototype {
    constructor() {
        super();
        this.id = 'fileSizeBytes';
        this.ruleType = 'buildIn';
        this.name = 'File Size in Bytes';
        this.description = 'This rule returns the size of the file in bytes.';
        this.source = "function(app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line! \n const result = file.stat.size; \n return result; // return you result. \n }";
        this.type = ['number'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        // acquire file size
        const result = file.stat.size;
        return result; // return you result.
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        // Configuration tab logic can be added here if needed
    };
    
}