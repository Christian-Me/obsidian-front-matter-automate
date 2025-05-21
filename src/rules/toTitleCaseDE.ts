import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";

/**
 * Represents a rule that converts input values to Title Case with German "small" Words.
 * This rule can handle various input types including strings, arrays, dates, and objects.
 * german definition of small words: https://copymate.app/de/blog/multi/titel-kapitalisierer
 * list of most german small words: Gemini AI
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
export class RuleToTitleCaseDE extends RulePrototype {
    private verboseLogging = false; // Set to true for verbose logging
    constructor() {
        super();
        this.id = 'toTitleCaseDe';
        this.name = 'To Title Case (German small words)';
        this.description = 'Convert German value to Title Case.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools, input: any) { // do not change this line!
        const toTitleCase = (str: string) => {
            const ruleId = tools.getRule()?.id;
            const doNotCapitalizeSmallWords = tools.getOptionConfig(ruleId, 'doNotCapitalizeSmallWords');
            return this.titleCaps(str, doNotCapitalizeSmallWords ? tools.getOptionConfig(ruleId,'smallWords') : undefined);
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

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            smallWords: 'der|die|das|den|dem|des|einer|eines|deren|ein|eine|einem|einer|eines|einer|und|oder|aber|denn|sondern|sowie|weder|noch|entweder|oder|dass|weil|obwohl|wenn|als|nachdem|bevor|während|bis|damit|um|zu|sobald|solange|da|indem|so|dass|ohne|zu|durch|für|gegen|ohne|um|bis|aus|außer|bei|gegenüber|mit|nach|seit|von|zu|anstatt|aufgrund|außerhalb|innerhalb|trotz|während|wegen|an|auf|hinter|in|neben|über|unter|vor|zwischen',
            doNotCapitalizeSmallWords: true,
        })
        new Setting(optionEL)
            .setName('Do not capitalize small words')
            .setDesc('If enabled, small words will not be capitalized. If disabled, all words will be capitalized.')
            .addToggle(toggle => toggle
                .setValue(that.getOptionConfig(rule.id ,'doNotCapitalizeSmallWords') || false)
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'doNotCapitalizeSmallWords', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
        // Create a setting for the small words
        new Setting(optionEL)
            .setName('List of small words')
            .setDesc('Enter a list of small words to be excluded from capitalization. Use "|" as separator.')
            .addText(text => text
                .setValue(that.getOptionConfig(rule.id ,'smallWords') || '')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'smallWords', value);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
	
	private small = "(der|die|das|den|dem|des|einer|eines|deren|ein|eine|einem|einer|eines|einer|und|oder|aber|denn|sondern|sowie|weder|noch|entweder|oder|dass|weil|obwohl|wenn|als|nachdem|bevor|während|bis|damit|um|zu|sobald|solange|da|indem|so|dass|ohne|zu|durch|für|gegen|ohne|um|bis|aus|außer|bei|gegenüber|mit|nach|seit|von|zu|anstatt|aufgrund|außerhalb|innerhalb|trotz|während|wegen|an|auf|hinter|in|neben|über|unter|vor|zwischen)";
    private punctuation = "\\([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~\\-]*\\)";

    titleCaps(title: string, smallWords: string | undefined) {
        const parts: string[] = [];
        const split = new RegExp(`[:.;?!] |(?: |^)["${this.punctuation}]`, "g");
        let index = 0;

        while (true) {
            const m = split.exec(title);

            const substring = title.substring(index, m ? m.index : title.length);
            if (this.verboseLogging) console.log("Processing substring:", substring);

            let isFirstWord = true;
            parts.push(
                substring.replace(/([\p{L}\p{M}]+(?:\.[\p{L}\p{M}]+)*)/gu, (all) => {
                    if (this.verboseLogging) console.log("Matched word:", all);

                    // Exclude words with mixed capitalization (e.g., "iPhone", "iMac")
                    if (/[a-z][A-Z]|[A-Z][a-z]/.test(all)) {
                        if (this.verboseLogging) console.log(`Excluding mixed capitalization word: ${all}`);
                        isFirstWord = false;
                        return all;
                    }

                    // Exclude fully capitalized words (e.g., "IBM", "DELL")
                    if (/^[A-ZÄÖÜß]+$/.test(all)) {
                        if (this.verboseLogging) console.log(`Excluding fully capitalized word: ${all}`);
                        isFirstWord = false;
                        return all;
                    }

                    // Exclude words with punctuation without spaces (e.g., "google.com")
                    if (/[^\s]+\.[^\s]+/.test(all)) {
                        if (this.verboseLogging) console.log(`Excluding word with punctuation: ${all}`);
                        isFirstWord = false;
                        return all;
                    }

                    const smallRegex = new RegExp(`^(${smallWords})$`, "iu");
                    if (isFirstWord) {
                        if (this.verboseLogging) console.log(`Capitalizing first word of sentence: ${all}`);
                        isFirstWord = false;
                        return this.upperDE(all);
                    } else if (smallRegex.test(all)) {
                        if (this.verboseLogging) console.log(`Skipping capitalization for small word: ${all}`);
                        return this.lowerDE(all);
                    }

                    isFirstWord = false;
                    return this.upperDE(all);
                })
            );

            index = split.lastIndex;

            if (m) parts.push(m[0]);
            else break;
        }

        return parts.join("");
    }

    lowerDE(word: string) {
        if (this.verboseLogging) console.log("Lowering:", word);
        return word.toLocaleLowerCase("de");
    }

    upperDE(word: string) {
        if (this.verboseLogging) console.log("Uppering:", word);
        // Capitalize the first character and leave the rest of the word unchanged
        return word.charAt(0).toLocaleUpperCase("de") + word.slice(1).toLocaleLowerCase("de");
    }
}