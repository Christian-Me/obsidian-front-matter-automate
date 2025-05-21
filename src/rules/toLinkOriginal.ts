import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * Represents a rule that passes input values unaltered.
 * This rule simply returns the input as is, without any transformation.
 * 
 * @extends RulePrototype
 * 
 * @example
 * ```typescript
 * const rule = new RuleToOriginal();
 * console.log(rule.fx("hello world", tools)); // Outputs: "hello world"
 * console.log(rule.fx(["hello", "world"], tools)); // Outputs: ["hello", "world"]
 * console.log(rule.fx(new Date("2023-01-01"), tools)); // Outputs: Date object
 * console.log(rule.fx({ key: "value" }, tools)); // Outputs: { key: "value" }
 * ```
 * 
 * @property {string} id - The unique identifier for the rule.
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} ruleType - The type of the rule, which is "formatter".
 * @property {string} source - The source code template for the rule.
 * @property {string[]} type - The types of input this rule applies to, e.g., ['text', 'tags', 'aliases', 'multitext'].
 * @property {Function} fx - The function that returns the input unaltered.
 */
export class RuleToLinkOriginal extends RulePrototype {
    constructor() {
        super();
        this.id = 'toOriginalLink';
        this.name = 'no change';
        this.description = 'Pass the input unaltered.';
        this.ruleType = 'linkFormatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any) { // do not change this line!
        return input; // Return the input unaltered
    };
}