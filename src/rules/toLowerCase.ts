import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * Represents a rule that converts input values to lower case.
 * This rule can handle various input types including strings, arrays, dates, and objects.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - For strings, it converts the entire string to lower case.
 * - For arrays, it maps each element to its lower case string representation.
 * - For dates, it converts the date to an ISO string in lower case.
 * - For objects, it serializes the object to a JSON string and converts it to lower case.
 * - If the input type is not recognized, it returns the input as is.
 * 
 * @example
 * ```typescript
 * const rule = new RuleToLowerCase();
 * console.log(rule.fx("HELLO", tools)); // Outputs: "hello"
 * console.log(rule.fx(["HELLO", "WORLD"], tools)); // Outputs: ["hello", "world"]
 * console.log(rule.fx(new Date("2023-01-01"), tools)); // Outputs: "2023-01-01t00:00:00.000z"
 * console.log(rule.fx({ KEY: "VALUE" }, tools)); // Outputs: '{"key":"value"}'
 * ```
 * 
 * @property {string} id - The unique identifier for the rule.
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} ruleType - The type of the rule, which is "formatter".
 * @property {string} source - The source code template for the rule.
 * @property {string[]} type - The types of input this rule applies to, e.g., ['text', 'tags', 'aliases', 'multitext'].
 * @property {Function} fx - The function that performs the lower case transformation.
 */
export class RuleToLowerCase extends RulePrototype {
    constructor() {
        super();
        this.id = 'toLowerCase';
        this.name = 'To Lower Case';
        this.description = 'Convert the value to lower case.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any, extraId?: string) { // do not change this line!
        if (String.isString(input)) {
            return input.toLowerCase();
        } else if(Array.isArray(input)) {
            return input.map((item) => String(item).toLowerCase());
        } else if (input instanceof Date) {
            return input.toISOString().toLowerCase();
        } else if (typeof input === 'object') {
            return JSON.stringify(input).toLowerCase();
        }
        return input;
    }
}

//rulesManager.registerRule(new RuleToLowerCase());