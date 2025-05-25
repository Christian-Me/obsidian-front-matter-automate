import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


/**
 * Represents a built-in rule that returns the date and time when a file was created.
 *
 * @remarks
 * This rule calculates the file creation date and time, adjusted for the local timezone,
 * and returns it as an ISO string without the trailing 'Z' (UTC symbol).
 *
 * @extends RulePrototype
 *
 * @example
 * ```typescript
 * const rule = new RuleBuildInDateTimeCreated();
 * const createdDate = rule.fx(app, file, tools);
 * // createdDate will be a string like "2024-06-01T12:34:56.789"
 * ```
 *
 * @property id - The unique identifier for the rule ('dateTimeCreated').
 * @property ruleType - The type of the rule ('buildIn').
 * @property name - The display name of the rule.
 * @property description - A description of what the rule does.
 * @property source - The source code of the rule's main function as a string.
 * @property type - The types of data returned by the rule (['date', 'datetime']).
 * @property configElements - The configuration elements for the rule.
 *
 * @method fx - Returns the file creation date and time as a local ISO string.
 * @method configTab - (Optional) Adds configuration UI elements for the rule.
 */
export class RuleBuildInDateTimeCreated extends RulePrototype {
    constructor() {
        super();
        this.id = 'dateTimeCreated';
        this.ruleType = 'buildIn';
        this.name = 'Date (and Time) created';
        this.description = 'This rule returns the date and time when the file was created, adjusted for local timezone.';
        this.source = "function(app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line! \n const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000; // get local time offset \n const result = new Date(file.stat.ctime-timeOffset); \n return result.toISOString().split('Z')[0]; // remove UTC symbol \n }";
        this.type = ['date', 'datetime'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000; // get local time offset
        const result = new Date(file.stat.ctime-timeOffset);
        return result.toISOString().split('Z')[0]; // remove UTC symbol
      }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        // Configuration tab logic can be added here if needed
    };
    
}