import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, TFile } from "obsidian";


export class RuleBuildInIsRoot extends RulePrototype {
    constructor() {
        super();
        this.id = 'isRoot';
        this.ruleType = 'buildIn';
        this.name = 'File in Root folder';
        this.description = 'Check if the file is in the root folder.';
        this.source = "function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!\n  let parts = file.path.split('/');\n  return parts.length === 1;\n};";
        this.type = ['checkbox'];
        this.configElements = this.defaultConfigElements({});
    }
    
    fx (app: App | undefined, file: TFile, tools: ScriptingTools) { // do not change this line!
        let parts = file.path.split('/');
        return parts.length === 1;
    }

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent) {
        // Configuration tab logic can be added here if needed
    };
    
}