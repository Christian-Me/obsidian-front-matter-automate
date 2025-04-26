import { App, renderResults, TFile } from 'obsidian';
import { parseJSCode, ScriptingTools } from './tools';
import { ObsidianPropertyTypes, FolderTagRuleDefinition, FolderTagSettings } from './types';

export interface RuleFunction {
    id:string;
    description:string;
    tooltip?: string;
    inputProperty?: boolean;
    source:string;
    type:ObsidianPropertyTypes[];
    fx:Function;
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

export function executeRule (app, settings, currentFile: TFile, returnResult: any, rule:FolderTagRuleDefinition, frontMatter, oldPath?:string) {
  if (!rule.active) return returnResult;
  const tools = new ScriptingTools(app, settings, frontMatter);
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
    if (rule.content === 'script') {
      const ruleFunction = parseJSCode(rule.jsCode);
      if (typeof ruleFunction !== 'function') return;
      fxResult = applyFormatOptions(ruleFunction(app, currentFile, tools), rule);
      if (oldFile) {
        oldResult = applyFormatOptions(ruleFunction(app, oldFile, tools), rule);
      }
    } else {
        const functionIndex = ruleFunctions.findIndex(fx => fx.id === rule.content);
        if (functionIndex!==-1){
            const ruleFunction = rule.useCustomCode ? parseJSCode(rule.buildInCode) : ruleFunctions[functionIndex].fx;
            if (typeof ruleFunction !== 'function') {
              console.error(`Could not parse custom function for ${rule.content}!`);
              return;
            }
            //console.log(`execute rule for ${rule.property} ${rule.content} for file ${file.path}`);
            if (ruleFunctions[functionIndex].inputProperty) {
              fxResult = applyFormatOptions(ruleFunction(app, currentFile, tools, frontMatter[rule.inputProperty]), rule);
            } else {
              fxResult = applyFormatOptions(ruleFunction(app, currentFile, tools), rule);
            }
            //console.log(rule.content, ruleFunctions[functionIndex] ? fxResult : '');
            if (oldFile) {
                if (ruleFunctions[functionIndex].inputProperty) {
                  oldResult = applyFormatOptions(ruleFunction(app, oldFile, tools, frontMatter[rule.inputProperty]), rule);
                } else {
                  oldResult = applyFormatOptions(ruleFunction(app, oldFile, tools), rule);
                }
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
    const fileFolder = tools.getFoldersFromPath(file.path);
    const fileName = file.basename + '.' + file.extension;
    
    if (type === 'files') {
        result = filterArray.includes(filePath);
    }
    if (type === 'folders') {
        filterArray.forEach(path => {
            result = fileFolder?.startsWith(path.slice(1)) || false; // remove root '/'
            if (result === true) return;
        });
    };
    return (filterMode === 'exclude')? !result : result;
}

export function checkIfFileAllowed(file: TFile, settings?:FolderTagSettings, rule?:FolderTagRuleDefinition):boolean {
      let result = false;
      if (!file) return false;
      if (settings) {
        try {
          //console.log(`check file ${file.path} against settings`, settings.include, settings.exclude);
          if (settings.include.selectedFiles.length>0) { // there are files in the include files list
              result = filterFile(file, settings, 'include', 'files');
          }
          if (settings.include.selectedFolders.length>0) { // there are folders in the include folders list
              result = filterFile(file, settings, 'include', 'folders');
          }
          if (settings.exclude.selectedFiles.length>0) { // there are files in the exclude files list.
              result = filterFile(file, settings, 'exclude', 'files');
          }        
          if (settings.exclude.selectedFolders.length>0) { // there are folders in the include folders list.
              result = filterFile(file, settings,'exclude', 'folders');
          }
        } catch (error) {
          console.error(`Error filtering file ${file.path} globally: ${error}`);
          return false; // default to false if there is an error
        }
      }
      if(rule) {
        try {
          //console.log(`check file ${file.path} against rule`, rule.include, rule.exclude);
          if (rule.include.selectedFiles.length>0) { // there are files in the include files list
              result = filterFile(file, rule, 'include', 'files');
          }
          if (rule.include.selectedFolders.length>0) { // there are folders in the include folders list
              result = filterFile(file, rule, 'include', 'folders');
          }
          if (rule.exclude.selectedFiles.length>0) { // there are files in the exclude files list.
              result = filterFile(file, rule, 'exclude', 'files');
          }        
          if (rule.exclude.selectedFolders.length>0) { // there are folders in the include folders list.
              result = filterFile(file, rule, 'exclude', 'folders');
          }
        } catch (error) {
          console.error(`Error filtering file ${file.path} by rule ${rule.property}|${rule.content}: ${error}`);
          return false; // default to false if there is an error
        }
      }
      return result;
}

ruleFunctions.push({
    id:'default',
    description: 'Pass parameter',
    source: "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}",
    type: ['text'],
    fx: function (app, file, tools:ScriptingTools) { // do not change this line!
        let result = '';
        return result;
      }
});

ruleFunctions.push({
  id:'fullPath',
  description: 'Full path, filename',
  source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
  type: ['text', 'tags', 'aliases','multitext'],
  fx:function (app: App, file:TFile, tools:ScriptingTools){
      let parts = file.path.split('/');
      parts.pop();
      parts.push(file.basename);
      return parts.join('/');
  }
});

ruleFunctions.push({
    id:'fullPathExt',
    description: 'Full path, filename and Extension',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const result = file.path;\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
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
    description: 'Full Path',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        return parts.join('/');
    }
});

ruleFunctions.push({
    id:'linkToFile',
    description: 'Link to file',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases','multitext'],
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop();
        return `[[${parts.join('/')}/${file.basename}|${file.basename}]]`;
    }
});

ruleFunctions.push({
    id:'pathFolderNotes',
    description: 'Path (folder notes)',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases','multitext'],
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        if (parts[parts.length-1] === file.basename) parts.pop(); // remove parent folder if same name as the file
        return parts.join('/');
    }
});

ruleFunctions.push({
  id:'fullPathFolderNotes',
  description: 'Full Path (comply with "folder notes")',
  source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
  type: ['text', 'tags', 'aliases'],
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
    description: 'Full Path with Extension (comply with "folder notes")',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
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
    description: 'File in Root folder',
    source: "function (app, file, tools) { // do not change this line!\n  let parts = file.path.split('/');\n  return parts.length === 1;\n}",
    type: ['checkbox'],
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        return parts.length === 1;
    }
});

ruleFunctions.push({
    id:'folder',
    description: 'Parent Folder',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    result = parts[parts.length-2];\n  }\n  return result;\n}",
    type: ['text', 'tags'],
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
    description: 'Parent Folder (complies with "folder notes")',
    source: "function (app, file, tools) { // do not change this line!\n  const parts = file.path.split('/');\n  let index = parts.length-2; // index of parent folder\n  if (parts[parts.length-2]===file.basename) {\n      index--; // folder note parent is the child\n  }\n  if (index >= 0) {\n    return parts[index]; // file in folder\n  } else {\n    return tools.app?.vault?.getName() || 'Vault'; // file in root = vault\n  }\n}",
    type: ['text', 'tags'],
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
    description: 'All folders of the file as a list',
    source: "function (app, file, tools) { // do not change this line!\n  const path = file.path; // acquire file path\n  const result = path.split('/');\n  result.pop(); // remove file name\n  return result;\n}",
    type: ['multitext','tags','aliases'],
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
    description: 'Root folder',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    result = parts[0];\n  }\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
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
    description: 'File name without extension',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file name\n  const result = file.name.split('.');\n  result.pop(); // remove extension\n  result.join('.'); // reconstruct the file name\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
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
    description: 'File name with extension',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file name\n  const result = file.name;\n  return result;\n}",
    type: ['text', 'tags', 'aliases'],
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file name
        const result = file.name;
        return result;
      }
});

ruleFunctions.push({
    id:'getProperty',
    description: 'Get a property',
    inputProperty: true,
    source: "function (app, file, tools) { // do not change this line!\n  const result = input;\n  return result;\n}",
    type: ['text', 'multitext', 'tags', 'aliases'],
    fx:function (app, file, tools:ScriptingTools, input?) { // do not change this line!
        const result = input;
        return result;
      }
});

ruleFunctions.push({
    id:'dateTimeCreated',
    description: 'Date (and Time) created',
    source: "function (app, file, tools) { // do not change this line!\n  const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000; // get local time offset\n  const result = new Date(file.stat.ctime-timeOffset);\n  return result.toISOString().split('Z')[0]; // remove UTC symbol\n}",
    type: ['date', 'datetime'],
    fx:function (app: App, file:TFile, tools:ScriptingTools) { 
        const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000; // get local time offset
        const result = new Date(file.stat.ctime-timeOffset);
        return result.toISOString().split('Z')[0]; // remove UTC symbol
      }
});

ruleFunctions.push({
    id:'dateTimeModified',
    description: 'Date (and Time) modified',
    source: "function (app, file, tools) { // do not change this line!\n  const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000;\n  const result = new Date(file.stat.mtime-timeOffset); // Apply offset to GMT Timestamp\n  return result.toISOString().split('Z')[0]; // remove UTC symbol\n}",
    type: ['date', 'datetime'],
    fx:function (app: App, file:TFile, tools:ScriptingTools) { 
        const timeOffset = new Date(Date.now()).getTimezoneOffset()*60000;
        const result = new Date(file.stat.mtime-timeOffset); // Apply offset to GMT Timestamp
        return result.toISOString().split('Z')[0]; // remove UTC symbol
      }
});

ruleFunctions.push({
    id:'fileSizeBytes',
    description: 'File size in bytes',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file size\n  const result = file.stat.size;\n  return result; // return you result.\n}",
    type: ['number'],
    fx:function (app: App, file:TFile, tools:ScriptingTools) { // do not change this line!
        // acquire file size
        const result = file.stat.size;
        return result; // return you result.
      }
});

ruleFunctions.push({
    id:'fileSizeString',
    description: 'File size formatted as text',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file size\n  let size =file.stat.size;\n  const precision = 2; // number of decimal places\n  if (size > 1024) {\n    size = size / 1024;\n    if (size > 1024) {\n      size = size / 1024;\n      if (size > 1024) {\n        size = size / 1024;\n        return Number.parseFloat(size).toFixed(precision) + ' GB';\n      } \n      return Number.parseFloat(size).toFixed(precision) + ' MB';\n    }\n    return Number.parseFloat(size).toFixed(precision) + ' KB';\n  }   \n  return size + ' Bytes'; // return you result.\n}",
    type: ['text'],
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