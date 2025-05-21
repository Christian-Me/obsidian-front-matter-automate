import { RulePrototype} from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * Represents a rule for formatting input as a wiki link.
 * 
 * This class extends the `RulePrototype` and provides functionality to
 * convert input into a wiki link format using the provided scripting tools.
 * 
 * @class RuleToLinkWiki
 * @extends RulePrototype
 * 
 * @constructor
 * Initializes the rule with predefined properties such as ID, name, description,
 * rule type, source code template, applicable types, and configuration elements.
 * 
 * @property {string} id - The unique identifier for the rule (`toWikiLink`).
 * @property {string} name - The display name of the rule (`wiki link`).
 * @property {string} description - A brief description of the rule's purpose.
 * @property {string} ruleType - The type of rule (`linkFormatter`).
 * @property {string} source - The source code template for the rule's functionality.
 * @property {string[]} type - The applicable input types for the rule 
 * (`['text', 'tags', 'aliases', 'multitext']`).
 * @property {Function} fx - The function that applies the rule logic, converting
 * input to a wiki link format using the provided `ScriptingTools`.
 * 
 * @method defaultConfigElements
 * Generates the default configuration elements for the rule.
 * 
 * @example
 * const rule = new RuleToLinkWiki();
 * const formattedInput = rule.fx("example", tools);
 * console.log(formattedInput); // Outputs the input formatted as a wiki link.
 */
export class RuleToLinkWiki extends RulePrototype {
    constructor() {
        super();
        this.id = 'toWikiLink';
        this.name = 'to wiki link';
        this.description = 'Format as a wiki link.';
        this.ruleType = 'linkFormatter';
        this.source = "function (input: any, tools: ScriptingTools) { // do not change this line!\n  input = tools.toWikiLink(input); // Convert to wiki link format\n  return input;\n}"; // Source code template
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any) { // do not change this line!
        input = tools.toWikiLink(input); // Convert to wiki link format
        return input;
    };
}