import { App, renderResults, SearchComponent, Setting, TFile, TFolder } from 'obsidian';
import { parseJSCode, ScriptingTools } from './tools';
import { ObsidianPropertyTypes, FolderTagRuleDefinition, FolderTagSettings, FrontmatterAutomateEvents } from './types';
import { AutocompleteModal, autocompleteModalResult, openAutocompleteModal } from './autocompleteModal';
import { codeEditorModalResult } from './editorModal';
import { FolderSuggest } from "./suggesters/FolderSuggester";
import { FileSuggest } from "./suggesters/FileSuggester";
import { DirectorySelectionResult, openDirectorySelectionModal } from './directorySelectionModal';
import { testFunktion } from './simpleAlertBox';
import { AlertModal } from './alertBox';

export type FrontmatterAutomateRuleTypes = 'buildIn' | 'buildIn.inputProperty' | 'autocomplete.modal' | 'automation' | 'script';

export interface ConfigElements {
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
    configTab?: (optionEl: HTMLElement, rule:FolderTagRuleDefinition, that:any, previewComponent:any) => void; // function to render the config tab for the rule
}

export const ruleFunctions:RuleFunction[]=[];
export function getRuleFunctionById (id : string):RuleFunction | undefined {
    return ruleFunctions.find(rule => rule.id === id);
}

function applyFormatOptions(value:any, rule:FolderTagRuleDefinition):any {
  if (rule.type === 'date' || rule.type === 'datetime') return value; // leave date and dateTime untouched
  switch (typeof value) {
    case 'boolean':
    case 'number':
      return value;
    case 'string':
      if (rule.spaceReplacement && rule.spaceReplacement !== '') value = value.replace(/\s+/g, rule.spaceReplacement);
      if (rule.specialCharReplacement && rule.specialCharReplacement !=='') value = value.replace(/[^a-zA-Z0-9\-_\/äöüßÄÖÜáéíóúýÁÉÍÓÚÝàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕ]/g, rule.specialCharReplacement);
      if (rule.lowercaseTags) value = value.toLowerCase();
      if (rule.prefix && rule.prefix !== '') value = rule.prefix + value;
      if (rule.asLink) value = `[[${value}]]`;
      return value
    case 'object':
      if (Array.isArray(value)) {
        return value.map(value => applyFormatOptions(value, rule));
      }
      return value;
  }
  return
}

async function getRuleResult(ruleFx: Function, app: App, rule: FolderTagRuleDefinition, ruleFunction: RuleFunction, currentFile: TFile, tools:ScriptingTools, frontMatter:any):Promise<any> {
  let result:any = undefined;
  //console.log('getRuleResult', ruleFx, ruleFunction, currentFile, tools, frontMatter);
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
      console.log('autocomplete modal', ruleFx, ruleFunction, currentFile, tools);
      result = null;
      break;
    case 'automation':
      console.log('automation', ruleFunction, currentFile, tools);
      result = applyFormatOptions(await ruleFx(app, currentFile, tools), rule);
      break;
  }
  return result;
}

export async function executeRule (event: FrontmatterAutomateEvents, app, settings, currentFile: TFile | null, returnResult: any, rule:FolderTagRuleDefinition, frontMatter, oldPath?:string) {
  //console.log(`Event: ${event} for rule ${rule.property}|${rule.content}`, rule);
  if (!rule.active || !currentFile) return returnResult;
  const tools = new ScriptingTools(app, this, settings, rule, frontMatter, currentFile);
  let fxResult:any;
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
    switch (rule.content) {
      case 'script': 
        const ruleFunction = parseJSCode(rule.jsCode);
        if (typeof ruleFunction !== 'function') return;
        fxResult = applyFormatOptions(ruleFunction(app, currentFile, tools), rule);
        if (oldFile) {
          oldResult = applyFormatOptions(ruleFunction(app, oldFile, tools), rule);
        }
        break;
      default:
        const functionIndex = ruleFunctions.findIndex(fx => fx.id === rule.content);
        if (functionIndex!==-1){
            tools.setCurrentContent(frontMatter[rule.property])
            tools.setRule(rule);
            tools.setFrontmatter(frontMatter);
            const ruleFunction = rule.useCustomCode ? parseJSCode(rule.buildInCode) : ruleFunctions[functionIndex].fx;
            if (typeof ruleFunction !== 'function') {
              console.error(`Could not parse custom function for ${rule.content}!`);
              return;
            }

            fxResult = await getRuleResult(ruleFunction, app, rule, ruleFunctions[functionIndex], currentFile, tools, frontMatter);
            if (oldFile) {
                oldResult = await getRuleResult(ruleFunction, app, rule, ruleFunctions[functionIndex], oldFile, tools, frontMatter);
            }

        } else {
            console.error(`Rule function ${rule.content} not found!`);
            return returnResult; // return the original value if the function is not found
        }
    }
  }
  catch (error) {
    console.error(`Error executing rule ${rule.property}|${rule.content} for file ${currentFile.path}: ${error}`);
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

export function removeRule (app, settings, currentFile: TFile, returnResult: any, rule:FolderTagRuleDefinition, frontMatter) {
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
            console.error(`Could not parse custom function for ${rule.content}!`);
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

const  tools = new ScriptingTools();
  /**
   * Filters a given file and returns true if it is included in a folder or file list
   * @param file 
   * @param filterMode 'exclude'|'include'
   * @param type 'folders'|'files'
   * @returns 
   */
export function filterFile(file: TFile, fileList: any, filterMode: string, type:string):boolean {
    let result = false;
    const filterArray = (type==='folders') ? fileList[filterMode].selectedFolders : fileList[filterMode].selectedFiles;
    if (filterArray.length === 0) return (filterMode === 'include')? false : true;
    const filePath = file.path;
    const fileFolder = tools.getFolderFromPath(file.path);
    const fileName = file.basename + '.' + file.extension;
    
    if (type === 'files') {
        result = filterArray.includes(filePath);
    }
    if (type === 'folders') {
        for (let path of filterArray) {
            result = fileFolder?.startsWith(path.slice(1)) || false; // remove root '/'
            if (result === true) return (filterMode === 'exclude')? !result : result;;
        };
    };
    return (filterMode === 'exclude')? !result : result;
}

export function checkIfFileAllowed(file: TFile, settings?:FolderTagSettings, rule?:FolderTagRuleDefinition):boolean {
      let result = false;
      if (!file) return false;
      if (settings) {
        try {
          //console.log(`check file ${file.path} against settings`, settings.include, settings.exclude);
          if (settings.exclude.selectedFiles.length>0) { // there are files in the exclude files list.
              result = filterFile(file, settings, 'exclude', 'files');    
          }        
          if (settings.exclude.selectedFolders.length>0) { // there are folders in the include folders list.
              result = filterFile(file, settings, 'exclude', 'folders');
          }
          if (settings.include.selectedFiles.length>0) { // there are files in the include files list
              result = filterFile(file, settings, 'include', 'files');
          }
          if (settings.include.selectedFolders.length>0) { // there are folders in the include folders list
              result = filterFile(file, settings, 'include', 'folders');
          }
          // if (result === false) return false; // if the file is excluded, return false
        } catch (error) {
          console.error(`Error filtering file ${file.path} globally: ${error}`);
          return false; // default to false if there is an error
        }
      }
      if(rule) {
        try {
          //console.log(`check file ${file.path} against rule`, rule.include, rule.exclude);
          if (rule.exclude.selectedFiles.length>0) { // there are files in the exclude files list.
              result = filterFile(file, rule, 'exclude', 'files');
          }        
          if (rule.exclude.selectedFolders.length>0) { // there are folders in the include folders list.
              result = filterFile(file, rule, 'exclude', 'folders');
          }
          if (rule.include.selectedFiles.length>0) { // there are files in the include files list
              result = filterFile(file, rule, 'include', 'files');
          }
          if (rule.include.selectedFolders.length>0) { // there are folders in the include folders list
              result = filterFile(file, rule, 'include', 'folders');
          }
        } catch (error) {
          console.error(`Error filtering file ${file.path} by rule ${rule.property}|${rule.content}: ${error}`);
          return false; // default to false if there is an error
        }
      }
      return result;
}

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
/*
ruleFunctions.push({
    id:'aliasFromPath',
    description: 'An Alias from every folder of the file Path',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  let pathArray = file.path.split('/');\n  pathArray.pop(); // remove File name with extension\n  pathArray = pathArray.map((dir) => tools.formatUpperCamelCase(dir)); // convert to UpperCamelCase\n  const fileNameParts = file.name.split('.');\n  if (fileNameParts.length > 1) {\n    fileNameParts.pop(); // remove Extension\n  }\n  const fileName = fileNameParts.join('.'); // rebuild file Name\n  pathArray.push(tools.formatUpperCamelCase(fileName)); // add file name without extension and in UpperCamelCase\n  const result = pathArray.join('.') || '';\n  return result;\n}",
    type: ['aliases'],
    fx: function (app, file, tools:ScriptingTools) { // do not change this line!
            // acquire file path
            let pathArray = file.path.split('/');
            pathArray.pop(); // remove File name with extension
            pathArray = pathArray.map((dir) => tools.formatUpperCamelCase(dir)); // convert to upper camelCase
            const fileNameParts = file.name.split('.');
            if (fileNameParts.length > 1) {
            fileNameParts.pop(); // remove Extension
            }
            const fileName = fileNameParts.join('.'); // rebuild file Name
            pathArray.push(tools.formatUpperCamelCase(fileName)); // add file name without extension and in upperCamelCase
            const result = pathArray.join('.') || '';
            return result;
        }
});
*/
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
        const addExtension = tools.getOptionConfig(tools.getRule()?.id,'addExtension') 
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop();
        let fileName = addExtension? file.basename + '.' + file.extension : file.basename; 
        return `[[${parts.join('/')}/${fileName}|${file.basename}]]`;
    },
    configTab: function (optionEL: HTMLElement, rule:FolderTagRuleDefinition, that:any, previewComponent) {

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
    type: ['text', 'tags', 'aliases'],
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
    type: ['text', 'tags', 'aliases'],
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
    type: ['text', 'tags', 'aliases'],
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
    configElements: defaultConfigElements({}),
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
    const result = await openAutocompleteModal(
        this.app,
        this.plugin,
        rule,
        tools.getActiveFile(),
        tools.getFrontmatter()
      );
    console.log('autocomplete modal result', result, tools.getFrontmatter());
    if (result?.values) {
      this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        for (const [key, value] of Object.entries(result.values)) {
          frontmatter[key] = value; // set the frontmatter value
        }
      },{'mtime':file.stat.mtime}); // do not change the modify time.
    }
    return tools.getCurrentContent() || 'autocomplete.modal'; // return current content if not implemented yet
  },
  configTab: function (optionEL: HTMLElement, rule:FolderTagRuleDefinition, that:any, previewComponent) {

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

ruleFunctions.push({
  id: 'autoLink',
  ruleType: 'automation',
  description: 'Auto Link (advanced)',
  isLiveRule: true,
  source: '',
  type: ['text','multitext'],
  configElements: defaultConfigElements({removeContent: false,  inputProperty: false, addPrefix: false, spaceReplacement: false, specialCharacterReplacement: false, convertToLowerCase: false, resultAsLink: false, script: false}),
  fx: async function (app, file, tools:ScriptingTools) { // do not change this line!
    const currentContent = tools.getCurrentContent();
    let newContent = new Array<string>();
    const rule = tools.getRule();
    if (!rule) {
      console.log(`autoLink: rule not found, returning current content ${currentContent}`);
      return currentContent;
    } 
    const options = tools.getOptionConfig(rule.id);
    const filesToCheck = tools.getFilesInVault(options.destinationFolder);
    let links = currentContent || [];
    if (typeof links === 'object' && !Array.isArray(links)) {
      links = []; // convert object to array
    } else if (typeof links === 'string') {
      links = [links]; // convert to array if not already an array
    }
    console.log(`autoLink: links to check`, links, filesToCheck);
  
    for (const part of links)  {
      let link = tools.extractLinkParts(part);
      let linkFile = tools.getFileFromPath(link.path, filesToCheck);
      if (!linkFile) { // create new File
        if (options.askConfirmation) {
          const result = await new AlertModal(app, 'Create new file', `File ${link.path} does not exist. Do you want to create it?`, 'Create', 'Cancel', "Don't ask again.").openAndGetValue();
          if (!result.proceed) return; // do not create the file if the user does not confirm
          options.askConfirmation = !result.data.askConfirmation;
        }
        link.path = options.destinationFolder + '/' + link.title + '.md'; // add the destination folder to the link path
        console.log(`autoLink: creating new file ${link.path}`);
        linkFile = await tools.createFileFromPath(link.path, options.addTemplate ? options.templateFile : undefined); // create the file if it does not exist
        console.log(`autoLink: new file created ${linkFile.path}`);
        tools.updateFrontmatter(rule.property, [`[[${tools.removeLeadingSlash(link.path)}|${link.title}]]`], linkFile); // add location of new path to itself
      } else {
        console.log(`autoLink: creating Link to existing File ${linkFile.path}`);
      }
      if (linkFile) {
        link.path = linkFile.path;
        newContent.push(`[[${tools.removeLeadingSlash(link.path)}|${link.title}]]`); // add the file path to the new content
      }
      console.log(`autoLink: new content`, newContent);
    }
    console.log(`autoLink: write content`, newContent);
    tools.updateFrontmatter(rule.property, newContent); // update the frontmatter with the new content
    return newContent;    
  },
  configTab: function (optionEL: HTMLElement, rule:FolderTagRuleDefinition, that:any, previewComponent) {

    that.setOptionConfigDefaults(rule.id, {
      addTemplate: true,
      askConfirmation: true,
      destinationFolder: '/',
      templateFile: '',
    })

    new Setting(optionEL)
      .setName('Add template to new files')
      .setDesc('Automatically add template to new files')
      .addToggle(toggle => toggle
          .setValue(that.getOptionConfig(rule.id ,'addTemplate') || false)
          .onChange(async (value) => {
              that.setOptionConfig(rule.id,'addTemplate', value);
          }));

    new Setting(optionEL)
      .setName('Ask for confirmation')
      .setDesc('Ask for confirmation before creating new files')
      .addToggle(toggle => toggle
          .setValue(that.getOptionConfig(rule.id ,'askConfirmation') || false)
          .onChange(async (value) => {
              that.setOptionConfig(rule.id,'askConfirmation', value);
          }));

    let destinationFolderEl:SearchComponent;  
    new Setting(optionEL)
      .setName('Destination Folder')
      .setDesc('Folder to place new files')
      .addSearch((cb) => {
          destinationFolderEl = cb;
          new FolderSuggest(that.app, cb.inputEl);
          cb.setPlaceholder("enter folder or browse ...")
              .setValue(that.getOptionConfig(rule.id ,'destinationFolder') || '')
              .onChange((newFolder) => {
                  newFolder = newFolder.trim()
                  newFolder = newFolder.replace(/\/$/, "");
                  that.setOptionConfig(rule.id,'destinationFolder', newFolder);
              });
          // @ts-ignore
          cb.containerEl.addClass("frontmatter-automate-search");
      })
      .addExtraButton((button) =>
        button
          .setIcon('folder-tree')
          .setTooltip('Select template folder')
          .onClick(async () => {
            openDirectorySelectionModal(
              that.app,
              [that.getOptionConfig(rule.id ,'destinationFolder')],
              [],
              { 
                  title: 'Select folder to place new files',
                  selectionMode: 'include',
                  displayMode: 'folder',
                  optionSelectionMode: false,
                  optionShowFiles: false,
              },
              (result: DirectorySelectionResult | null) => {
                  if (!result) return;
                  if (result.folders.length === 0 || !result.folders[0] || typeof result.folders[0] !== 'string') return;
                  let selectedFolder = result.folders[0].trim().replace(/\/$/, ""); // remove leading and trailing slashes (/^\/|\/$/g, "")
                  if (selectedFolder === '') selectedFolder = '/'; // if empty, set to root folder
                  if (!selectedFolder) return;
                  destinationFolderEl.setValue(selectedFolder);
                  that.setOptionConfig(rule.id,'destinationFolder', selectedFolder);
              }
          );
          })
      );
    
    let destinationFileEl:SearchComponent;  
    new Setting(optionEL)
      .setName('Template File')
      .setDesc('Select a template file to add to new files')
      .addSearch((cb) => {
          destinationFileEl = cb;
          new FileSuggest(cb.inputEl, that.plugin, '');
          cb.setPlaceholder("enter folder or browse ...")
              .setValue(that.getOptionConfig(rule.id ,'templateFile') || '')
              .onChange((newFile) => {
                  newFile = newFile.trim()
                  newFile = newFile.replace(/\/$/, "");
                  that.setOptionConfig(rule.id,'templateFile', newFile);
              });
          // @ts-ignore
          cb.containerEl.addClass("frontmatter-automate-search");
      })
      .addExtraButton((button) =>
        button
          .setIcon('folder-tree')
          .setTooltip('Select template file')
          .onClick(async () => {
            openDirectorySelectionModal(
              that.app,
              [],
              [that.getOptionConfig(rule.id,'templateFile')],
              { 
                  title: 'Select template for new files',
                  selectionMode: 'include',
                  displayMode: 'file',
                  optionSelectionMode: false,
                  optionShowFiles: true,
              },
              (result: DirectorySelectionResult | null) => {
                  if (!result) return;
                  if (result.files.length === 0 || !result.files[0] || typeof result.files[0] !== 'string') return;
                  let selectedFile = result.files[0].trim().replace(/\/$/, "");
                  if (!selectedFile) return;
                  destinationFileEl.setValue(selectedFile);
                  that.setOptionConfig(rule.id,'templateFile', selectedFile);
              }
            );
          })
      );
    }
  })