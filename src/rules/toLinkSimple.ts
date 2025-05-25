import { RulePrototype} from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * A rule that formats a given input as a simple Obsidian link by wrapping it in double square brackets ([[...]]).
 * Returns an empty string if the input is `undefined`, `null`, or an empty string.
 *
 * @remarks
 * - Returns an empty string if the input is `undefined`, `null`, or an empty string.
 * - Intended for use as a link formatter within the plugin's rule system.
 *
 * @example
 * ```typescript
 * const rule = new RuleToLinkSimple();
 * rule.fx(app, file, tools, "MyNote"); // returns '[[MyNote]]'
 * rule.fx(app, file, tools, ""); // returns ''
 * ```
 *
 * @extends RulePrototype
 */
export class RuleToLinkSimple extends RulePrototype {
    constructor() {
        super();
        this.id = 'toSimpleLink';
        this.name = 'to simple link';
        this.description = 'Format as a simple link by adding [[]].';
        this.ruleType = 'linkFormatter';
        this.source = "function (app, file, tools, input) { // do not change this line!\n  if (input === undefined || input === null || input === '') {\n    return ''; // Return empty string if input is undefined, null, or empty\n  }\n         input = `[[${input}]]`; // Convert to simple Link\n  return input;\n};"; // Source code template
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any) { // do not change this line!
        if (input === undefined || input === null || input === '') {
            return ''; // Return empty string if input is undefined, null, or empty 
        }
        input = `[[${input}]]`; // Convert to simple Link
        return input;
    };
}