import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { App, Setting, TFile } from "obsidian";
import { FrontmatterAutomateRuleSettings } from "../types";
import { ERROR, logger, WARNING } from "../Log";

export class RuleRemoveLink extends RulePrototype {
    constructor() {
        super();
        this.id = 'removeLink';
        this.name = 'Remove Links';
        this.description = 'Removes links from the input value.';
        this.ruleType = 'formatter';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    };
    
    fx (app: App | undefined, file: any, tools: ScriptingTools, input:any, extraId: string) { // Default function signature
        const resultType = tools.getOptionConfig(tools.getRule()?.id, 'result', extraId) || 'alias';
        if (!input) {
            return '';
        }
        if (typeof input !== 'string') {
            logger.log(ERROR, `RuleRemoveLink: Input is not a string: ${input}`);
            return input;
        }

        // Remove [[...]] from the input value
        const linkRegex = /\[|\]/g;
        let result = input.replace(linkRegex, '').trim();

        // Return the result based on the selected type
        if (resultType === 'path') {
            return result.split('|')[0].trim(); // Return the path
        } else {
            return result.split('|')[1].trim(); // Return the alias
        }
    };

    configTab(optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any, extraId: string) {
        optionEL.empty();
        // Create a setting for the small words
        that.setOptionConfigDefaults(rule.id, {
            result: 'alias', // result type: 'alias' or 'path'
        }, extraId)

        new Setting(optionEL)
            .setName('Result Type')
            .setDesc('Choose the type of result to return after removing links.')
            .addDropdown(dropdown => dropdown
                .addOption('alias', 'Alias')
                .addOption('path', 'Path')
                .setValue(that.getOptionConfig(rule.id, 'result', extraId) || 'alias')
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id, 'result', value, extraId);
                    that.updatePreview(rule, previewComponent);
                })
            );
    };
}