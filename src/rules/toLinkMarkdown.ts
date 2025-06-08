import { RulePrototype } from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * Represents a rule for formatting input as a markdown link.
 * This class extends the `RulePrototype` and provides functionality
 * to convert input into a markdown link format using the provided tools.
 *
 * @class RuleToLinkMarkdown
 * @extends RulePrototype
 *
 * @constructor
 * Initializes the rule with default properties such as `id`, `name`,
 * `description`, `ruleType`, `source`, `type`, and `configElements`.
 *
 * @property {string} id - The unique identifier for the rule.
 * @property {string} name - The display name of the rule.
 * @property {string} description - A brief description of the rule's purpose.
 * @property {string} ruleType - The type of rule, in this case, a link formatter.
 * @property {string} source - The source code of the rule as a string, used for scripting purposes.
 * @property {string[]} type - The applicable input types for the rule, such as 'text', 'tags', 'aliases', and 'multitext'.
 * @property {Function} fx - The function that performs the markdown link formatting.
 * @property {Function} configElements - A method to retrieve the default configuration elements for the rule.
 *
 * @method fx
 * Converts the input into a markdown link format using the `tools.toMarkdownLink` method.
 *
 * @example
 * const rule = new RuleToLinkMarkdown();
 * const formatted = rule.fx("example", tools);
 * console.log(formatted); // Outputs the input formatted as a markdown link.
 */
export class RuleToLinkMarkdown extends RulePrototype {
    constructor() {
        super();
        this.id = 'toMarkdownLink';
        this.name = 'to markdown link';
        this.description = 'Format as a markdown link.';
        this.ruleType = 'linkFormatter';
        this.source = "function (input: any, tools: ScriptingTools) { // do not change this line!\n  input = tools.toMarkdownLink(input); // Convert to markdown link format\n  return input;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any, extraId?: string) { // do not change this line!
        input = tools.toMarkdownLink(input); // Convert to markdown link format
        return input;
    };
}