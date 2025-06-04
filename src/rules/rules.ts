import { App, Plugin, TFile } from "obsidian";
import { parseJSCode, ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings, ObsidianPropertyTypes } from "../types";
import { ERROR, logger, WARNING } from "../Log";

export type FrontmatterAutomateRuleTypes = 'buildIn' | 'buildIn.inputProperty' | 'autocomplete.modal' | 'automation' | 'script' | 'formatter' | 'linkFormatter' ;
/**
 * The `RuleConfigElements` interface defines the configuration options for a rule.
 *
 * @export
 * @interface RuleConfigElements
 */
export interface RuleConfigElements {
    [key: string]: boolean; // Allow string keys with boolean values
    removeContent: boolean;
    ruleActive: boolean;
    modifyOnly: boolean;
    inputProperty: boolean;
    addPrefix: boolean;
    spaceReplacement: boolean;
    specialCharacterReplacement: boolean;
    convertToLowerCase: boolean;
    resultAsLink: boolean;
    addContent: boolean;
    excludeFolders: boolean;
    includeFolders: boolean;
    script: boolean;
}

export class RulePrototype {
    rulesConfigDiv: HTMLDivElement | undefined = undefined;
    scriptingTools: ScriptingTools;
    id!: string;
    name!: string;
    description!: string;
    ruleType: FrontmatterAutomateRuleTypes = 'buildIn';
    isLiveRule: boolean = false; // If true, the rule is a live rule and will be executed on file change
    type: string[] = ['text']; // Types that are supported by this rule
    configElements: RuleConfigElements | object = {}; // Elements that are used to configure the rule
    source: string = 'function (app, file, tools) { // do not change this line!\n  let result = \'\'\n  return result;\n}';

    constructor(app?: App | undefined, plugin?: any| undefined) {
        this.scriptingTools = new ScriptingTools(app, plugin);
    };

    getSource(): string {
        return this.source;
    }

    fx (app: App | undefined, file: any, tools: ScriptingTools, input?:any) { // Default function signature
        if (input === undefined || input === null) input = tools.getCurrentContent(); // Get the current content of property
        return input; // Return the input unaltered
    };

    /**
     * Configures the settings tab for a specific rule in the plugin.
     *
     * @param optionEL - The HTML element where the configuration options will be rendered.
     * @param rule - The settings object for the frontmatter automation rule.
     * @param that - The context or reference to the calling object.
     * @param previewComponent - The component used to render a preview of the rule's effect.
     */
    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        optionEL.empty();
    };

    defaultConfigElements(modifiers: RuleConfigElements | any): RuleConfigElements {
        const configElements: RuleConfigElements = {
            removeContent: true,
            ruleActive: true,
            modifyOnly: true,
            inputProperty: false,
            addPrefix: true,
            spaceReplacement: true,
            specialCharacterReplacement: true,
            convertToLowerCase: true,
            resultAsLink: true,
            addContent: true,
            excludeFolders: true,
            includeFolders: true,
            script: true,
        };
        return Object.assign({}, configElements, modifiers);
    }
    /**
     * Checks if a specific rule option is enabled.
     *
     * @param {string} option - The name of the rule option to check.
     * @returns {boolean} - Returns true if the option is enabled, false otherwise.
     */
    useRuleOption(option:string):boolean {
        if ((this.configElements as RuleConfigElements)[option] === undefined) {
            return false;
        }
        return (this.configElements as RuleConfigElements)[option] || false;
    }
    /**
     * Checks if the rule has any configuration options.
     *
     * @returns {boolean} - Returns true if the rule has options, false otherwise.
     */
    hasOwnConfigTab(): boolean {
       return Object.getPrototypeOf(this).configTab !== RulePrototype.prototype.configTab;
    }   
    /**
     * Executes the `fx` function based on the `ruleType`.
     * Handles different function signatures dynamically.
     * 
     * @param {App} app - The Obsidian app instance.
     * @param {any} file - The file to pass to the rule's `fx` function.
     * @param {ScriptingTools} tools - The scripting tools to pass to the rule's `fx` function.
     * @param {any} [input] - Optional input for rules that require it (e.g., `buildIn.inputProperty`).
     * @returns {string} - The result of the `fx` function.
    */
    execute(app: App | undefined, file: any, tools: ScriptingTools, input?: any): string {
        switch (this.ruleType) {
            case 'formatter':
            case 'linkFormatter':
                return this.fx(app, file, tools, input); // `formatter` rules expect (input, tools)

            case 'buildIn.inputProperty':
                return this.fx(app, file, tools, input); // `buildIn.inputProperty` rules expect (app, file, tools, input)

            case 'autocomplete.modal':
            case 'automation':
                // Handle async functions by resolving the Promise synchronously
                let result = '';
                this.fx(app, file, tools)
                    .then((res: any) => {
                        result = res;
                    })
                    .catch((err: any) => {
                        logger.log(ERROR,`Error executing async automation rule: ${err}`);
                    });
                return result; // Return the resolved result as a string

            default:
                return this.fx(app, file, tools); // Default rules expect (app, file, tools)
        }
    }
    
}

/**
 * The `Rules` class is responsible for managing and organizing a collection of rules.
 * It provides methods to register new rules and retrieve rules based on their type.
 *
 * @remarks
 * This class is designed to work within the context of an Obsidian plugin and relies on
 * the `App` and `plugin` instances for its functionality. Rules are stored as an array
 * of `RulePrototype` objects.
 *
 * @example
 * ```typescript
 * const rulesManager = new Rules(app, plugin);
 * rulesManager.registerRule({
 *   id: "example-rule",
 *   name: "Example Rule",
 *   ruleType: FrontmatterAutomateRuleTypes.SomeType,
 * });
 * const filteredRules = rulesManager.getRulesByType(FrontmatterAutomateRuleTypes.SomeType);
 * console.log(filteredRules);
 * ```
 *
 * @public
 */
export class Rules {
    app: App | undefined = undefined;
    plugin: any | undefined = undefined;
    rules: RulePrototype[];
    tools: ScriptingTools | undefined = undefined;

    constructor(app?: App | undefined, plugin?: any) {
        this.plugin = plugin;
        this.app = app;
        this.tools = undefined;
        this.rules = [];
    }
    
    init (app: App, plugin: any, tools: ScriptingTools) {
        this.app = app;
        this.plugin = plugin;
        this.tools = tools;
    }

    /**
     * Registers a new rule by adding it to the list of existing rules.
     *
     * @param rule - The rule prototype to be registered. This should conform to the `RulePrototype` interface.
     */
    registerRule(rule: RulePrototype) {
        this.rules.push(rule);
    }

    /**
     * Retrieves a list of rules filtered by the specified rule type and property type.
     *
     * @param ruleType - The type of rule to filter by.
     * @param propertyType - The property type to filter by within the rule's type array.
     * @returns An array of objects containing the `id` and `name` of each matching rule, sorted alphabetically by name.
     */
    getRulesByType(ruleType: FrontmatterAutomateRuleTypes, propertyType?: ObsidianPropertyTypes): Array<{id: string, name: string}> {
        return this.rules
            .filter(rule => rule.ruleType === ruleType && (!propertyType || rule.type.includes(propertyType))) // Filter rules by ruleType and propertyType
            .map(rule => ({ id: rule.id, name: rule.name })) // Map to {id, name}
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
    }

    /**
     * Retrieves a rule object by its unique identifier.
     *
     * @param id - The unique identifier of the rule to retrieve.
     * @returns The rule object matching the provided ID, or `undefined` if no matching rule is found.
     * @throws Logs a warning to the console if the rule with the specified ID is not found.
     */
    getRuleById(id: string): RulePrototype | undefined {
        const ruleObject = this.rules.find(rule => rule.id === id);
        if (!ruleObject) {
            logger.log(WARNING,`Rule with id "${id}" not found.`);
            return undefined;
        }
        return ruleObject;
    }
    /**
     * Retrieves the source code of a rule by its unique identifier.
     *
     * @param id - The unique identifier of the rule for which to retrieve the source code.
     * @returns The source code of the rule, or `undefined` if the rule is not found.
     */
    getSource(id: string): string | undefined {
        const ruleObject = this.getRuleById(id);
        if (!ruleObject) {
            logger.log(WARNING,`Source for rule with id "${id}" not found.`);
            return undefined;
        }
        return ruleObject.getSource();
    }

    /**
     * Executes the `fx` function of a rule matching the given `id` and returns its result.
     * 
     * @param {string} id - The unique identifier of the rule to execute.
     * @param {App} app - The Obsidian app instance.
     * @param {any} file - The file to pass to the rule's `fx` function.
     * @param {ScriptingTools} tools - The scripting tools to pass to the rule's `fx` function.
     * @param {any} [input] - Optional input for rules that require it.
     * @returns {string | null} - The result of the `fx` function, or `null` if the rule is not found.
    */
    executeRuleById(id: string, ruleSettings: FrontmatterAutomateRuleSettings, app: App | undefined, file: any, tools: ScriptingTools, input?: any): string | null {
        const rule = this.rules.find(rule => rule.id === id);
        if (!rule) {
            logger.log(WARNING,`Rule with id "${id}" not found.`);
            return null;
        }
        return this.executeRule(ruleSettings, rule, app, file, tools, input);
    }
    /**
     * Executes the `fx` function of a given rule and returns its result.
     *
     * @param rule - The rule to execute.
     * @param app - The Obsidian app instance.
     * @param file - The file to pass to the rule's `fx` function.
     * @param tools - The scripting tools to pass to the rule's `fx` function.
     * @param input - Optional input for rules that require it.
     * @returns {string | null} - The result of the `fx` function, or `null` if the rule is not found.
     */
    executeRule(ruleSettings: FrontmatterAutomateRuleSettings, rule: RulePrototype, app: App | undefined, file: any, tools: ScriptingTools, input?: any): string | null {
        switch (rule.ruleType) {
            case 'formatter':
            case 'linkFormatter':
            case 'buildIn.inputProperty':
                return rule.execute(app, file, tools, input);
            case 'automation':
                return rule.execute(app, file, tools);
            default:
                if (ruleSettings.useCustomCode && ruleSettings.buildInCode && ruleSettings.buildInCode !== '') {
                    // If the rule has custom code, execute it
                    const code = parseJSCode(ruleSettings.buildInCode);
                    if (typeof code === 'function') {
                        return code(app, file, tools); // Pass input if available
                    } else {
                        logger.log(ERROR,`Invalid custom code for rule "${ruleSettings.content}": ${ruleSettings.buildInCode}`);
                        return `Invalid custom code for rule "${ruleSettings.id}"`;
                    }
                } else {
                    return rule.execute(app, file, tools, input);
                }
        }
    }

    applyFormatOptions(value:any, rule:FrontmatterAutomateRuleSettings, activeFile: TFile, tools: ScriptingTools ):any {

        if (rule.type === 'number' || rule.type === 'checkbox' || rule.type === 'date' || rule.type === 'datetime') return value; // leave date and dateTime untouched

        switch (typeof value) {
          case 'boolean':
          case 'number':
            return value;
          case 'string':
            //if (rule.spaceReplacement && rule.spaceReplacement !== '') value = value.replace(/\s+/g, rule.spaceReplacement);
            //if (rule.specialCharReplacement && rule.specialCharReplacement !=='') value = value.replace(/[^a-zA-Z0-9\-_\/äöüßÄÖÜáéíóúýÁÉÍÓÚÝàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕ]/g, rule.specialCharReplacement);
            if (rule.formatters && rule.formatters.length > 0) {
              rule.formatters.forEach(formatterId => {
                value = this.executeRuleById(formatterId, rule, this.app, activeFile, tools, value); // execute the formatter rule
              });
            }
            if (rule.linkFormatter && rule.linkFormatter !== '') {
              value = this.executeRuleById(rule.linkFormatter, rule, this.app, activeFile, tools, value); // execute the link formatter rule
            }
            //if (rule.prefix && rule.prefix !== '') value = rule.prefix + value;
            return value
          case 'object':
            if (Array.isArray(value)) {
              return value.map(value => this.applyFormatOptions(value, rule, activeFile, tools)); // pass activeFile and tools
            }
            return value;
        }
        return
    }

    mergeResult(result: any, oldResult: any, returnResult: any, rule: FrontmatterAutomateRuleSettings): any {
        if (!this.tools) {
            console.warn('Tools are not available for merging results.');
            return result; // if tools are not available, return the result as is
        }
        switch (rule.addContent) {
            case 'overwrite':
                returnResult = result; // update or add the new value
                break;
            case 'end':
                if (rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
                    if (!result) result = [];
                    if (typeof result === 'string') result = [result]; // convert string to array 
                    if (!Array.isArray(returnResult)) returnResult = [returnResult];
                    if (!Array.isArray(oldResult)) oldResult = [oldResult];
                    let filtered = returnResult.filter((value:any) => !oldResult.includes(value))
                    returnResult = this.tools.removeDuplicateStrings(filtered.concat(result));
                } else {
                    if (!returnResult) returnResult = '';
                    returnResult = returnResult.replaceAll(returnResult,oldResult);
                    returnResult = returnResult + result;
                }
                break;
            case 'start':
                if (rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
                    if (!result) result = [];
                    if (typeof result === 'string') result = [result]; // convert string to array 
                    if (!Array.isArray(returnResult)) returnResult = [returnResult];
                    if (!Array.isArray(oldResult)) oldResult = [oldResult];
                    let filtered = returnResult.filter((value:any) => !oldResult.includes(value))
                    returnResult = this.tools.removeDuplicateStrings(result.concat(filtered));
                } else {
                    if (!returnResult) returnResult = '';
                    returnResult = returnResult.replaceAll(returnResult,oldResult);
                    returnResult = result + returnResult;
                }
                break;
        }
        return returnResult;
    };
            
    /**
     * Builds the configuration tab for a specific rule by its ID.
     *
     * @param id - The unique identifier of the rule for which the configuration tab is being built.
     * @param optionEL - The HTML element where the configuration tab will be rendered.
     * @param rule - The definition of the rule, containing its properties and settings.
     * @param that - A reference to the current context or object, typically used for maintaining scope.
     * @param previewComponent - A component used to render a preview of the rule's effect or configuration.
     *
     * @remarks
     * If a rule with the specified ID is found, its `configTab` method is invoked to build the configuration tab.
     * If no rule is found, a warning is logged to the console.
     */
    buildConfigTab(id: string, optionEL: HTMLElement, rule: FrontmatterAutomateRuleSettings, that: any, previewComponent: any) {
        const ruleInstance = this.rules.find(rule => rule.id === id);
        if (ruleInstance) {
            ruleInstance.configTab(optionEL, rule, that, previewComponent);
        } else {
            console.warn(`Rule with id "${id}" not found for config tab.`);
        }
    }
}

export const rulesManager = new Rules();