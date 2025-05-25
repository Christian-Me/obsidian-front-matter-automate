import { RulePrototype} from "./rules";
import { ScriptingTools } from "../tools";
import { App, TFile } from "obsidian";

/**
 * A rule that formats input as a simple Obsidian link by wrapping it in double square brackets ([[...]]).
 *
 * @remarks
 * This rule is intended for use in the Folder to Tags plugin for Obsidian. It can be applied to various input types,
 * including text, tags, aliases, and multitext fields. The rule provides both a scripting source template and a direct
 * implementation via the `fx` method.
 *
 * @extends RulePrototype
 *
 * @example
 * // Example usage:
 * const rule = new RuleToLinkSimple();
 * const result = rule.fx(app, file, tools, "MyNote");
 * // result: '[[MyNote]]'
 */
export class RuleToLinkSimple extends RulePrototype {
    constructor() {
        super();
        this.id = 'toSimpleLink';
        this.name = 'to simple link';
        this.description = 'Format as a simple link by adding [[]].';
        this.ruleType = 'linkFormatter';
        this.source = "function (input: any, tools: ScriptingTools) { // do not change this line!\n  input = `[[${input}]]`; // Convert to simple Link\n  return input;\n}"; // Source code template
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any) { // do not change this line!
        input = `[[${input}]]`; // Convert to simple Link
        return input;
    };
}