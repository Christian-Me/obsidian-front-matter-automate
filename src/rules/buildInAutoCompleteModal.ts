import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, Setting, TFile } from "obsidian";
import { openAutocompleteModal } from "../autocompleteModal";


export class RuleBuildInAutoCompleteModal extends RulePrototype {
    constructor() {
        super();
        this.id = 'autoCompleteModal';
        this.ruleType = 'autocomplete.modal';
        this.name = 'Auto-Complete Modal';
        this.description = 'Displays an auto-complete modal for the frontmatter parameter.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  const input = tools.getCurrentContent(); // Get the current content of property\n  return input; // Return the input unaltered\n};";
        this.type = ['text', 'tags', 'aliases', 'multitext'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        console.log(`autocomplete modal, work in progress...`);
        const currentContent = tools.getCurrentContent();
        const rule = tools.getRule();
        if (!rule) return currentContent;
        const options = tools.getOptionConfig(rule.id);
        if (!rule) return tools.getCurrentContent() || 'autocomplete.modal'; // return current content if not implemented yet
        const frontmatter = tools.getFrontmatter();
        const hasAutocompleteProperties = Object.keys(frontmatter).some(key => 
            key.startsWith(rule.property + options.propertyDelimiter) &&
            (frontmatter[key] === undefined ||
            frontmatter[key] === null ||
            frontmatter[key] === '')
        );
        if (!hasAutocompleteProperties) return tools.getCurrentContent() || 'autocomplete.modal'; // return current content if not implemented yet
        openAutocompleteModal(
            tools.app,
            tools.plugin,
            rule,
            options,
            tools.getActiveFile(),
            tools.getFrontmatter()
            )
            .then((result) => {
                console.log('autocomplete modal result', result, tools.getFrontmatter());
                if (result?.values) {
                    if (!tools.app) {
                        console.error('App is not defined');
                        return tools.getCurrentContent() || 'autocomplete.modal Error. See console for details.'; // return current content if not implemented yet  
                    }
                    tools.app.fileManager.processFrontMatter(file, (frontmatter) => {
                        for (const [key, value] of Object.entries(result.values)) {
                            frontmatter[key] = value; // set the frontmatter value
                        }
                    }, {'mtime': file.stat.mtime}); // do not change the modify time.
                }
                return tools.getCurrentContent(); // return current content. Frontmatter is already updated.
            })
            .catch((error) => {
                console.error('Error opening autocomplete modal:', error);
                return tools.getCurrentContent() || 'autocomplete.modal Error. See console for details.'; // return current content if not implemented yet
            });
    };

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        optionEL.empty();
        
        that.setOptionConfigDefaults(rule.id, {
            propertyDelimiter: '.',
        })
    
        new Setting(optionEL)
        .setName('Delimiter')
        .setDesc('Character to determine which property should appear in the modal')
        .addText(text => text
            .setValue(that.getOptionConfig(rule.id ,'propertyDelimiter') || '.')
            .onChange(async (value) => {
                that.setOptionConfig(rule.id,'propertyDelimiter', value);
            }));
    };
}