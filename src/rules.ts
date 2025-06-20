import { App, renderResults, SearchComponent, Setting, TFile, TFolder } from 'obsidian';
import { getFolderFromPath, parseJSCode, ScriptingTools } from './tools';
import { ObsidianPropertyTypes, FrontmatterAutomateRuleSettings, FrontmatterAutomateSettings, FrontmatterAutomateEvents } from './types';
import { AutocompleteModal, autocompleteModalResult, openAutocompleteModal } from './autocompleteModal';
import { codeEditorModalResult } from './editorModal';
import { FolderSuggest } from "./suggesters/FolderSuggester";
import { FileSuggest } from "./suggesters/FileSuggester";
import { DirectorySelectionResult, openDirectorySelectionModal } from './uiDirectorySelectionModal';
import { AlertModal } from './alertBox';
import { rulesManager } from './rules/rules';
import { DEBUG, ERROR, logger, TRACE } from './Log';

export type FrontmatterAutomateRuleTypes = 'buildIn' | 'buildIn.inputProperty' | 'autocomplete.modal' | 'automation' | 'script';

export interface ConfigElements {
    [key: string]: boolean | undefined;
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
export interface RuleFunction {
    id:string;
    ruleType: FrontmatterAutomateRuleTypes;
    description:string;
    tooltip?: string;
    inputProperty?: boolean;
    isLiveRule?: boolean;
    source:string;
    type:ObsidianPropertyTypes[];
    fx:Function;
    configElements: ConfigElements;
    configTab?: (optionEl: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent:any) => void; // function to render the config tab for the rule
}
/*
export const ruleFunctions:RuleFunction[]=[];

export function getRuleFunctionById (id : string):RuleFunction | undefined {
    const ruleFunction = ruleFunctions.find(rule => rule.id === id);
    if (!ruleFunction) {
        logger.log(ERROR,`Rule function ${id} not found!`);
        return undefined;
    }
    return ruleFunction;
}
function applyFormatOptions(this: any, value:any, rule:FrontmatterAutomateRuleSettings):any {
  if (rule.type === 'date' || rule.type === 'datetime') return value; // leave date and dateTime untouched
  switch (typeof value) {
    case 'boolean':
    case 'number':
      return value;
      case 'string':
      if (rule.spaceReplacement && rule.spaceReplacement !== '') value = value.replace(/\s+/g, rule.spaceReplacement);
      if (rule.specialCharReplacement && rule.specialCharReplacement !=='') value = value.replace(/[^a-zA-Z0-9\-_\/äöüßÄÖÜáéíóúýÁÉÍÓÚÝàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕ]/g, rule.specialCharReplacement);
      if (rule.formatter && rule.formatter !== '') {
        value = rulesManager.executeRuleById(rule.formatter, this.app, this.activeFile, this.tools, value); // execute the formatter rule
      }
      if (rule.linkFormatter && rule.linkFormatter !== '') {
        value = rulesManager.executeRuleById(rule.linkFormatter, this.app, this.activeFile, this.tools, value); // execute the link formatter rule
      }
      if (rule.prefix && rule.prefix !== '') value = rule.prefix + value;
      return value
      case 'object':
        if (Array.isArray(value)) {
          return value.map(value => applyFormatOptions(value, rule));
        }
        return value;
      }
      return
    }


function getRuleResult(ruleFx: Function, app: App, rule: FrontmatterAutomateRuleSettings, ruleFunction: RuleFunction, currentFile: TFile, tools:ScriptingTools, frontMatter:any):Promise<any> {
  let result:any = undefined;
  //logger.log(DEBUG,'getRuleResult', ruleFx, ruleFunction, currentFile, tools, frontMatter);
  switch (ruleFunction.ruleType) {
    case 'script':
    case 'buildIn':
      result = applyFormatOptions(ruleFx(app, currentFile, tools), rule);
      break;
    case 'buildIn.inputProperty':
      result = applyFormatOptions(ruleFx(app, currentFile, tools, frontMatter[rule.inputProperty]), rule);
      break
    case 'autocomplete.modal':
      ruleFx(app, currentFile, tools);
      //logger.log(DEBUG,'autocomplete modal', ruleFx, ruleFunction, currentFile, tools);
      result = null;
      break;
    case 'automation':
      //logger.log(DEBUG,'automation', ruleFunction, currentFile, tools);
      result = applyFormatOptions(ruleFx(app, currentFile, tools), rule);
      break;
  }
  return result;
}
  */
export function executeRuleObject (
  event: FrontmatterAutomateEvents,
  app: App,
  plugin: any,
  settings: FrontmatterAutomateSettings, 
  currentFile: TFile | undefined | null, 
  currentContent: any, 
  rule:FrontmatterAutomateRuleSettings, 
  frontMatter: any, 
  oldLocationResults?:{ruleId: string, result: any}[]):any {

  if (!rule) return currentContent;
  if (!rule.active) return currentContent;
  if (!currentFile) return currentContent;
  
  const tools = new ScriptingTools(app, plugin, settings, rule, frontMatter);
  let result = currentContent;
  let oldResult:any = undefined;
  tools.setCurrentContent(frontMatter[rule.property])
  tools.setRule(rule);
  tools.setFrontmatter(frontMatter);
  tools.setActiveFile(currentFile);
  const ruleObject = rulesManager.getRuleById(rule.content);
  if (!ruleObject) return currentContent;

  result = rulesManager.executeRule(rule, ruleObject, app, currentFile, tools, frontMatter); // execute the formatter rule
  result = rulesManager.applyFormatOptions(result, rule, currentFile, tools); // apply format options
  if (oldLocationResults && oldLocationResults.length > 0 && rule.addContent !== 'overwrite') {
    oldResult = oldLocationResults.find(res => res.ruleId === rule.id)?.result;
    if (!oldResult) {
      logger.log(ERROR,`executeRuleObject: Old result for rule ${rule.property}|${rule.content} not found!`, oldLocationResults);
      return result; // return the current result if no old result is found
    }
    oldResult = rulesManager.applyFormatOptions(oldResult, rule, currentFile, tools); // apply format options on the old file location
    logger.log(DEBUG,`executeRuleObject: Merging result for rule ${rule.property}|${rule.content} with old result`, oldResult, result);
    result = rulesManager.mergeResult(result, oldResult, currentContent, rule); // merge the result with the current content. Remove old result if necessary
  } else {
    if (event !== 'getOldResults') {
      result = rulesManager.mergeResult(result, result, currentContent, rule); // merge the result with the current content. Remove old result if necessary
    }
  }
  return result;
}
/*
export function executeRuleOld (event: FrontmatterAutomateEvents, app, settings, currentFile: TFile | null, returnResult: any, rule:FrontmatterAutomateRuleSettings, frontMatter, oldPath?:string) {
  //logger.log(DEBUG,`Event: ${event} for rule ${rule.property}|${rule.content}`, rule);
  if (!rule.active || !currentFile) return returnResult;
  const tools = new ScriptingTools(app, this, settings, rule, frontMatter, currentFile);
  let fxResult = returnResult;
  let oldResult:any;
  let oldFile:TFile | undefined = undefined;
  if (oldPath) {
    let oldFileParts = oldPath.split('/');
    oldFile = {
      path: oldPath,
      extension: oldFileParts[oldFileParts.length-1].split('.')[1],
      name: oldFileParts[oldFileParts.length-1].split('.')[0],
      stat: currentFile.stat,
      basename: currentFile.basename,
      vault: currentFile.vault,
      parent: currentFile.parent
    }
  }
  try {
    const functionIndex = ruleFunctions.findIndex(fx => fx.id === rule.content);
    if (functionIndex===-1){
      logger.log(ERROR,`Rule function ${rule.content} not found!`);
      return returnResult; // return the original value if the function is not found
    }
    const ruleFunctionConfig = ruleFunctions[functionIndex];
    tools.setCurrentContent(frontMatter[rule.property])
    tools.setRule(rule);
    tools.setFrontmatter(frontMatter);
    switch (ruleFunctionConfig.ruleType) {
      case 'script': 
        const customRuleFunction = parseJSCode(rule.jsCode);
        if (typeof customRuleFunction !== 'function') {
          logger.log(ERROR,`Could not parse custom function for ${rule.content}!`);
          return;
        }
        fxResult = applyFormatOptions(customRuleFunction(app, currentFile, tools), rule);
        if (oldFile) {
          oldResult = applyFormatOptions(customRuleFunction(app, oldFile, tools), rule);
        }
        break;
      case 'buildIn.inputProperty':
      case 'buildIn':  
        const ruleFunction = rule.useCustomCode ? parseJSCode(rule.buildInCode) : ruleFunctionConfig.fx;
        if (typeof ruleFunction !== 'function') {
          logger.log(ERROR,`Could not parse custom function for ${rule.content}!`);
          break;
        }
        fxResult = getRuleResult(ruleFunction, app, rule, ruleFunctionConfig, currentFile, tools, frontMatter);
        if (oldFile) {
            oldResult = getRuleResult(ruleFunction, app, rule, ruleFunctionConfig, oldFile, tools, frontMatter);
        }
        logger.log(DEBUG,`  executeRule: ${rule.content} ${rule.property} [${rule.type}]= '${fxResult}'`)

        break;
      case 'autocomplete.modal':
        fxResult = getRuleResult(ruleFunctionConfig.fx, app, rule, ruleFunctionConfig, currentFile, tools, frontMatter);
        break; // handled in the autocomplete modal
      case 'automation':
        // fxResult = getRuleResult(ruleFunctionConfig.fx, app, rule, ruleFunctionConfig, currentFile, tools, frontMatter);
        fxResult = rulesManager.executeRuleById(rule.content, app, currentFile, tools, frontMatter); // execute the formatter rule

        break; // handled in the automation modal
      default:
        break;
    }
  }
  catch (error) {
    logger.log(ERROR,`Error executing rule ${rule.property}|${rule.content} for file ${currentFile.path}: ${error}`);
    return returnResult; // return the original value if there is an error
  }

  if (rule.type === 'number' || rule.type === 'checkbox' || rule.type === 'date' || rule.type === 'datetime') {
      return fxResult;
  }
  switch (rule.addContent) {
      case 'overwrite':
          returnResult = fxResult; // update or add the new value
          break;
      case 'end':
          if (rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
              if (!fxResult) fxResult = [];
              if (typeof fxResult === 'string') fxResult = [fxResult]; // convert string to array 
              if (!Array.isArray(returnResult)) returnResult = [returnResult];
              if (!Array.isArray(oldResult)) oldResult = [oldResult];
              let filtered = returnResult.filter((value) => !oldResult.includes(value))
              returnResult = tools.removeDuplicateStrings(filtered.concat(fxResult));
          } else {
              if (!returnResult) returnResult = '';
              returnResult = returnResult.replaceAll(returnResult,oldResult);
              returnResult = returnResult + fxResult;
          }
          break;
      case 'start':
          if (rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
              if (!fxResult) fxResult = [];
              if (typeof fxResult === 'string') fxResult = [fxResult]; // convert string to array 
              if (!Array.isArray(returnResult)) returnResult = [returnResult];
              if (!Array.isArray(oldResult)) oldResult = [oldResult];
              let filtered = returnResult.filter((value) => !oldResult.includes(value))
              returnResult = tools.removeDuplicateStrings(fxResult.concat(filtered));
          } else {
              if (!returnResult) returnResult = '';
              returnResult = returnResult.replaceAll(returnResult,oldResult);
              returnResult = fxResult + returnResult;
          }
          break;
  }
  return returnResult;

}
*/
export function removeRuleObject (app: App, settings: any, currentFile: TFile, returnResult: any, rule:FrontmatterAutomateRuleSettings, frontMatter: any) {
}
/*
export function removeRule (app, settings, currentFile: TFile, returnResult: any, rule:FrontmatterAutomateRuleSettings, frontMatter) {
  const tools = new ScriptingTools(app, settings, frontMatter);
  let fxResult:any;
  if (rule.content === 'script') {
      const ruleFunction = parseJSCode(rule.jsCode);
      if (typeof ruleFunction !== 'function') return;
      fxResult = ruleFunction(app, currentFile, tools);
  } else {
      const functionIndex = ruleFunctions.findIndex(fx => fx.id === rule.content);
      if (functionIndex!==-1){
          const ruleFunction = rule.useCustomCode ? parseJSCode(rule.buildInCode) : ruleFunctions[functionIndex].fx;
          if (typeof ruleFunction !== 'function') {
            logger.log(ERROR,`Could not parse custom function for ${rule.content}!`);
            return;
          }
          if (ruleFunctions[functionIndex].inputProperty) {
            fxResult = applyFormatOptions(ruleFunction(app, currentFile, tools, frontMatter[rule.inputProperty]), rule);
          } else {
            fxResult = applyFormatOptions(ruleFunction(app, currentFile, tools), rule);
          }
      }
  }
  switch (rule.addContent) {
      case 'overwrite':
          returnResult = fxResult; // update or add the new value
          break;
      case 'end':
          if (rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
              if (!fxResult) fxResult = [];
              if (typeof fxResult === 'string') fxResult = [fxResult]; // convert string to array 
              if (!Array.isArray(returnResult)) returnResult = [returnResult];
              if (!Array.isArray(fxResult)) fxResult = [fxResult];
              let filtered = returnResult.filter((value) => !fxResult.includes(value))
              returnResult = tools.removeDuplicateStrings(filtered);
          } else {
              if (!returnResult) returnResult = '';
              returnResult = returnResult.replaceAll(returnResult,fxResult);
          }
          break;
      case 'start':
          if (rule.type === 'multitext' || rule.type === 'tags' || rule.type === 'aliases') {
              if (!fxResult) fxResult = [];
              if (typeof fxResult === 'string') fxResult = [fxResult]; // convert string to array 
              if (!Array.isArray(returnResult)) returnResult = [returnResult];
              if (!Array.isArray(fxResult)) fxResult = [fxResult];
              let filtered = returnResult.filter((value) => !fxResult.includes(value))
              returnResult = tools.removeDuplicateStrings(filtered);
          } else {
              if (!returnResult) returnResult = '';
              returnResult = returnResult.replaceAll(returnResult,fxResult);
          }
          break;
  }
  return returnResult;

}
*/

function defaultConfigElements(modifiers:ConfigElements | any):ConfigElements {
  const configElements: ConfigElements = {
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
  }
  return Object.assign({}, configElements, modifiers);
}

/**
 * Determines whether a specific option is enabled for a given rule function.
 *
 * @param ruleFn - The rule function object, which may be undefined. If defined, it should contain a `configElements` property.
 * @param option - The name of the option to check within the `configElements` of the rule function.
 * @returns `true` if the option is undefined in the `configElements` or if the option is explicitly set to `true`.
 *          Returns `false` if the option is explicitly set to `false`.
 */
export function useRuleOption(ruleFn : RuleFunction | undefined, option : string): boolean {
  if (ruleFn?.configElements[option] === undefined) return true;
  return ruleFn.configElements[option];
}
/**
ruleFunctions.push({
    id:'default',
    ruleType: 'buildIn',
    description: 'Pass parameter',
    source: "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}",
    type: ['text'],
    configElements: defaultConfigElements({}),
    fx: function (app, file, tools:ScriptingTools) { // do not change this line!
        let result = '';
        return result;
      }
});
*/
/*
ruleFunctions.push({
  id:'constant',
  ruleType: 'buildIn',
  description: 'Constant value',
  source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
  type: ['text', 'tags', 'aliases','multitext'],
  configElements: defaultConfigElements({
    addPrefix: false,
    spaceReplacement: false,
    specialCharacterReplacement: false,
    convertToLowerCase: false,
    resultAsLink: false,}),
  fx:function (app: App, file:TFile, tools:ScriptingTools){
      const result = tools.getOptionConfig(tools.getRule()?.id,'constantValue');
      return result;
  },
  configTab: function (optionEL: HTMLElement, rule:FolderTagRuleDefinition, that:any, previewComponent: any) {

    that.setOptionConfigDefaults(rule.id, {
      constantValue: '',
    })

    new Setting(optionEL)
    .setName('Constant value')
    .setDesc('Enter a constant value to be used in the rule')
    .addText(text => text
        .setValue(that.getOptionConfig(rule.id ,'constantValue') || '')
        .onChange(async (value) => {
          that.setOptionConfig(rule.id,'constantValue', value);
          that.updatePreview(rule, previewComponent);
        }));
  }
});

ruleFunctions.push({
  id:'fullPath',
  ruleType: 'buildIn',
  description: 'Full path, filename',
  source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
  type: ['text', 'tags', 'aliases','multitext'],
  configElements: defaultConfigElements({}),
  fx:function (app: App, file:TFile, tools:ScriptingTools){
      let parts = file.path.split('/');
      parts.pop();
      parts.push(file.basename);
      return parts.join('/');
  }
});

ruleFunctions.push({
    id:'fullPathExt',
    ruleType: 'buildIn',
    description: 'Full path, filename and Extension',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const result = file.path;\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
    configElements: defaultConfigElements({}),
    fx: function (app: App, file:TFile, tools:ScriptingTools){
            return `${file.path}`;
        }
});

ruleFunctions.push({
    id:'path',
    ruleType: 'buildIn',
    description: 'Full Path',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        return parts.join('/');
    }
});

ruleFunctions.push({
    id:'linkToFile',
    ruleType: 'buildIn',
    description: 'Link to file',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases','multitext'],
    configElements: defaultConfigElements({resultAsLink: false}),
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        const parts = file.path.split('/');
        const rule = tools.getRule();
        if (!rule) return tools.getCurrentContent();
        const addExtension = tools.getOptionConfig(rule.id,'addExtension') 
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop();
        let fileName = addExtension? file.basename + '.' + file.extension : file.basename; 
        return `[[${parts.join('/')}/${fileName}|${file.basename}]]`;
    },
    configTab: function (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {

      that.setOptionConfigDefaults(rule.id, {
        addExtension: true
      })
  
      new Setting(optionEL)
        .setName('Include file extension')
        .setDesc('Add file extension to pathname')
        .addToggle(toggle => toggle
            .setValue(that.getOptionConfig(rule.id ,'addExtension') || false)
            .onChange(async (value) => {
                that.setOptionConfig(rule.id,'addExtension', value);
                that.updatePreview(rule, previewComponent);
            })
        );
    }  
});

ruleFunctions.push({
    id:'pathFolderNotes',
    ruleType: 'buildIn',
    description: 'Path (folder notes)',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases','multitext'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
        return parts.join('/');
    }
});

ruleFunctions.push({
  id:'fullPathFolderNotes',
  ruleType: 'buildIn',
  description: 'Full Path (comply with "folder notes")',
  source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
  type: ['text', 'tags', 'aliases'],
  configElements: defaultConfigElements({}),
  fx:function (app: App, file:TFile, tools:ScriptingTools){
      let parts = file.path.split('/');
      parts.pop(); // remove file name
      if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
      parts.push(file.basename); // add the file name back
      return parts.join('/');
  }
});

ruleFunctions.push({
    id:'fullPathExtFolderNotes',
    ruleType: 'buildIn',
    description: 'Full Path with Extension (comply with "folder notes")',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop(); // remove file name
        if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
        parts.push(file.name); // add the file name back
        return parts.join('/');
    }
});

ruleFunctions.push({
    id:'isRoot',
    ruleType: 'buildIn',
    description: 'File in Root folder',
    source: "function (app, file, tools) { // do not change this line!\n  let parts = file.path.split('/');\n  return parts.length === 1;\n}",
    type: ['checkbox'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        return parts.length === 1;
    }
});

ruleFunctions.push({
    id:'folder',
    ruleType: 'buildIn',
    description: 'Parent Folder',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    result = parts[parts.length-2];\n  }\n  return result;\n}",
    type: ['text', 'tags'],
    configElements: defaultConfigElements({}),
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file path
        const path = file.path;
        const parts = path.split('/');
        let result = '';
        if (parts.length > 1) {
          result = parts[parts.length-2];
        }
        return result;
      }
});

ruleFunctions.push({
    id:'folderFolderNotes',
    ruleType: 'buildIn',
    description: 'Parent Folder (complies with "folder notes")',
    source: "function (app, file, tools) { // do not change this line!\n  const parts = file.path.split('/');\n  let index = parts.length-2; // index of parent folder\n  if (parts[parts.length-2]===file.basename) {\n      index--; // folder note parent is the child\n  }\n  if (index >= 0) {\n    return parts[index]; // file in folder\n  } else {\n    return tools.app?.vault?.getName() || 'Vault'; // file in root = vault\n  }\n}",
    type: ['text', 'tags'],
    configElements: defaultConfigElements({}),
    fx:function (app, file, tools) { // do not change this line!
      const parts = file.path.split('/');
      let index = parts.length-2; // index of parent folder
      if (parts[parts.length-2]===file.basename) {
          index--; // folder note parent is the child
      }
      if (index >= 0) {
        return parts[index]; // file in folder
      } else {
        return tools.app?.vault?.getName() || 'Vault'; // file in root = vault
      }
    }
});

ruleFunctions.push({
    id:'folders',
    ruleType: 'buildIn',
    description: 'All folders of the file as a list',
    source: "function (app, file, tools) { // do not change this line!\n  const path = file.path; // acquire file path\n  const result = path.split('/');\n  result.pop(); // remove file name\n  return result;\n}",
    type: ['multitext','tags','aliases'],
    configElements: defaultConfigElements({}),
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file path
        const path = file.path;
        const result = path.split('/');
        result.pop();
        return result;
      }
});

ruleFunctions.push({
    id:'rootFolder',
    ruleType: 'buildIn',
    description: 'Root folder',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    result = parts[0];\n  }\n  return result;\n}",
    type: ['text', 'multitext', 'tags', 'aliases'],
    configElements: defaultConfigElements({}),
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file path
        const path = file.path;
        const parts = path.split('/');
        let result = '';
        if (parts.length > 1) {
          result = parts[0];
        }
        return result;
      }
});

ruleFunctions.push({
    id:'name',
    ruleType: 'buildIn',
    description: 'File name without extension',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file name\n  const result = file.name.split('.');\n  result.pop(); // remove extension\n  result.join('.'); // reconstruct the file name\n  return result;\n}",
    type: ['text', 'multitext', 'tags', 'aliases'],
    configElements: defaultConfigElements({}),
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file name
        const result = file.name.split('.');
        result.pop(); // remove extension
        result.join('.'); // reconstruct the file name
        return result;
      }
});

ruleFunctions.push({
    id:'nameExt',
    ruleType: 'buildIn',
    description: 'File name with extension',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file name\n  const result = file.name;\n  return result;\n}",
    type: ['text', 'multitext', 'tags', 'aliases'],
    configElements: defaultConfigElements({}),
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file name
        const result = file.name;
        return result;
      }
});

ruleFunctions.push({
    id:'getProperty',
    ruleType: 'buildIn.inputProperty',
    description: 'Get a property',
    isLiveRule: true,
    inputProperty: true,
    source: "function (app, file, tools) { // do not change this line!\n  const result = input;\n  return result;\n}",
    type: ['text', 'multitext', 'tags', 'aliases'],
    configElements: defaultConfigElements({inputProperty:true}),
    fx:function (app, file, tools:ScriptingTools, input?) { // do not change this line!
        const result = input;
        return result;
      }
});

ruleFunctions.push({
    id:'dateTimeCreated',
    ruleType: 'buildIn',
    description: 'Date (and Time) created',
    source: "function (app, file, tools) { // do not change this line!\n  const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000; // get local time offset\n  const result = new Date(file.stat.ctime-timeOffset);\n  return result.toISOString().split('Z')[0]; // remove UTC symbol\n}",
    type: ['date', 'datetime'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools) { 
        const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000; // get local time offset
        const result = new Date(file.stat.ctime-timeOffset);
        return result.toISOString().split('Z')[0]; // remove UTC symbol
      }
});

ruleFunctions.push({
    id:'dateTimeModified',
    ruleType: 'buildIn',
    description: 'Date (and Time) modified',
    source: "function (app, file, tools) { // do not change this line!\n  const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000;\n  const result = new Date(file.stat.mtime-timeOffset); // Apply offset to GMT Timestamp\n  return result.toISOString().split('Z')[0]; // remove UTC symbol\n}",
    type: ['date', 'datetime'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools) { 
        const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000;
        const result = new Date(file.stat.mtime-timeOffset); // Apply offset to GMT Timestamp
        return result.toISOString().split('Z')[0]; // remove UTC symbol
      }
});

ruleFunctions.push({
    id:'fileSizeBytes',
    ruleType: 'buildIn',
    description: 'File size in bytes',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file size\n  const result = file.stat.size;\n  return result; // return you result.\n}",
    type: ['number'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!
        // acquire file size
        const result = file.stat.size;
        return result; // return you result.
      }
});

ruleFunctions.push({
    id:'fileSizeString',
    ruleType: 'buildIn',
    description: 'File size formatted as text',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file size\n  let size =file.stat.size;\n  const precision = 2; // number of decimal places\n  if (size > 1024) {\n    size = size / 1024;\n    if (size > 1024) {\n      size = size / 1024;\n      if (size > 1024) {\n        size = size / 1024;\n        return Number.parseFloat(size).toFixed(precision) + ' GB';\n      } \n      return Number.parseFloat(size).toFixed(precision) + ' MB';\n    }\n    return Number.parseFloat(size).toFixed(precision) + ' KB';\n  }   \n  return size + ' Bytes'; // return you result.\n}",
    type: ['text'],
    configElements: defaultConfigElements({}),
    fx:function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!
        // acquire file size
        let size =file.stat.size;
        const precision = 2; // number of decimal places
        if (size > 1024) {
          size = size / 1024;
          if (size > 1024) {
            size = size / 1024;
            if (size > 1024) {
              size = size / 1024;
              return size.toFixed(precision) + ' GB';
            } 
            return size.toFixed(precision) + ' MB';
          }
          return size.toFixed(precision) + ' KB';
        }   
        return size + ' Bytes'; // return you result.
      }
});

ruleFunctions.push({
  id: 'autocomplete.modal',
  ruleType: 'autocomplete.modal',
  description: 'Autocomplete Modal (advanced)',
  isLiveRule: true,
  source: '',
  type: ['text', 'tags', 'aliases','multitext'],
  configElements: defaultConfigElements({removeContent: false,  inputProperty: false, addPrefix: false, spaceReplacement: false, specialCharacterReplacement: false, convertToLowerCase: false, resultAsLink: false, addContent: false, script: false}),
  fx: async function (app, file, tools:ScriptingTools) { // do not change this line!
    logger.log(DEBUG,`autocomplete modal, work in progress...`);
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
    const result = await openAutocompleteModal(
        this.app,
        this.plugin,
        rule,
        options,
        tools.getActiveFile(),
        tools.getFrontmatter()
      );
    logger.log(DEBUG,'autocomplete modal result', result, tools.getFrontmatter());
    if (result?.values) {
      this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        for (const [key, value] of Object.entries(result.values)) {
          frontmatter[key] = value; // set the frontmatter value
        }
      },{'mtime':file.stat.mtime}); // do not change the modify time.
    }
    return tools.getCurrentContent() || 'autocomplete.modal'; // return current content if not implemented yet
  },
  configTab: function (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {

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
  }
})
*/
