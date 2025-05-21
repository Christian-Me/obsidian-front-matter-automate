import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * Represents a rule that converts input values to upper case.
 * This rule can handle various input types including strings, arrays, dates, and objects.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - For strings, it converts the entire string to upper case.
 * - For arrays, it maps each element to its upper case string representation.
 * - For dates, it converts the date to an ISO string in upper case.
 * - For objects, it serializes the object to a JSON string and converts it to upper case.
 * - If the input type is not recognized, it returns the input as is.
 * 
 * @example
 * ```typescript
 * const rule = new RuleToUpperCase();
 * console.log(rule.fx("hello", tools)); // Outputs: "HELLO"
 * console.log(rule.fx(["hello", "world"], tools)); // Outputs: ["HELLO", "WORLD"]
 * console.log(rule.fx(new Date("2023-01-01"), tools)); // Outputs: "2023-01-01T00:00:00.000Z"
 * console.log(rule.fx({ key: "value" }, tools)); // Outputs: '{"KEY":"VALUE"}'
 * ```
 * 
 * @property {string} id - The unique identifier for the rule.
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} ruleType - The type of the rule, which is "formatter".
 * @property {string} source - The source code template for the rule.
 * @property {string[]} type - The types of input this rule applies to, e.g., ['text'].
 * @property {Function} fx - The function that performs the upper case transformation.
 */
export class RuleToUpperCase extends RulePrototype {
    constructor() {
        super();
        this.id = 'toUpperCase';
        this.name = 'To Upper Case';
        this.description = 'Convert the value to upper case.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any) { // do not change this line!
        if (String.isString(input)) {
            return input.toUpperCase();
        } else if(Array.isArray(input)) {
            return input.map((item) => String(item).toUpperCase());
        } else if (input instanceof Date) {
            return input.toISOString().toUpperCase();
        } else if (typeof input === 'object') {
            return JSON.stringify(input).toUpperCase();
        }
        return input;
    }
}

//rulesManager.registerRule(new RuleToUpperCase());