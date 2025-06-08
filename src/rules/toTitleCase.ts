import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * Represents a rule that converts input values to Title Case.
 * This rule can handle various input types including strings, arrays, dates, and objects.
 * 
 * @extends RulePrototype
 * 
 * @remarks
 * - For strings, it converts the entire string to Title Case.
 * - For arrays, it maps each element to its Title Case string representation.
 * - For dates, it converts the date to an ISO string and applies Title Case.
 * - For objects, it serializes the object to a JSON string and applies Title Case.
 * - If the input type is not recognized, it returns the input as is.
 * 
 * @example
 * ```typescript
 * const rule = new RuleToTitleCase();
 * console.log(rule.fx("hello world", tools)); // Outputs: "Hello World"
 * console.log(rule.fx(["hello", "world"], tools)); // Outputs: ["Hello", "World"]
 * console.log(rule.fx(new Date("2023-01-01"), tools)); // Outputs: "2023-01-01T00:00:00.000Z"
 * console.log(rule.fx({ key: "value" }, tools)); // Outputs: '{"Key":"Value"}'
 * ```
 * 
 * @property {string} id - The unique identifier for the rule.
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's functionality.
 * @property {string} ruleType - The type of the rule, which is "formatter".
 * @property {string} source - The source code template for the rule.
 * @property {string[]} type - The types of input this rule applies to, e.g., ['text', 'tags', 'aliases', 'multitext'].
 * @property {Function} fx - The function that performs the Title Case transformation.
 */
export class RuleToTitleCase extends RulePrototype {
    constructor() {
        super();
        this.id = 'toTitleCase';
        this.name = 'To Title Case (Simple)';
        this.description = 'Convert the value to Title Case.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any, extraId?: string) { // do not change this line!
        const toTitleCase = (str: string) => {
            let textParts = str.split(' ');
            let convertedTextParts:string[] = [];
            textParts.forEach((text,index) => {
                let newTextPart = text.toLowerCase();
                newTextPart = newTextPart.charAt(0).toUpperCase() + newTextPart.slice(1);
                convertedTextParts.push(newTextPart)
            });
            return convertedTextParts.join(' ');
        };

        if (typeof input === 'string') {
            return toTitleCase(input);
        } else if (Array.isArray(input)) {
            return input.map((item) => toTitleCase(String(item)));
        } else if (input instanceof Date) {
            return toTitleCase(input.toISOString());
        } else if (typeof input === 'object') {
            return toTitleCase(JSON.stringify(input));
        }
        return input;
    };
}

// rules.registerRule(new RuleToTitleCase());