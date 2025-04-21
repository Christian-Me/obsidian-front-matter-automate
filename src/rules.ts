import { App, renderResults, TFile } from 'obsidian';
import { ScriptingTools } from './tools'

export interface RuleFunction {
    id:string;
    description:string;
    tooltip?: string;
    source:string;
    fx:Function;
}

export const ruleFunctions:RuleFunction[]=[];
export function getRuleFunctionById (id : string):RuleFunction | undefined {
    return ruleFunctions.find(rule => rule.id === id);
}

ruleFunctions.push({
    id:'default',
    description: 'Pass parameter',
    source: "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}",
    fx: function (app, file, tools:ScriptingTools) { // do not change this line!
        let result = '';
        return result;
      }
});

ruleFunctions.push({
    id:'fullPath',
    description: 'Full path and filename',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const result = file.path;\n  return result;\n}",
    fx: function (app: App, file:TFile, tools:ScriptingTools){
            return `${file.path}`;
        }
});

ruleFunctions.push({
    id:'aliasFromPath',
    description: 'An Alias from every folder of the file Path',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  let pathArray = file.path.split('/');\n  pathArray.pop(); // remove File name with extension\n  pathArray = pathArray.map((dir) => tools.formatUpperCamelCase(dir)); // convert to UpperCamelCase\n  const fileNameParts = file.name.split('.');\n  if (fileNameParts.length > 1) {\n    fileNameParts.pop(); // remove Extension\n  }\n  const fileName = fileNameParts.join('.'); // rebuild file Name\n  pathArray.push(tools.formatUpperCamelCase(fileName)); // add file name without extension and in UpperCamelCase\n  const result = pathArray.join('.') || '';\n  return result;\n}",
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

ruleFunctions.push({
    id:'path',
    description: 'Full Path',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    parts.pop(); // remove file name\n    result = result + parts.join('/');\n  }\n  return result;\n}",
    fx:function (app: App, file:TFile, tools:ScriptingTools){
        let parts = file.path.split('/');
        parts.pop();
        return parts.join('/');
    }
});

ruleFunctions.push({
    id:'folder',
    description: 'Foldername',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file path\n  const path = file.path;\n  const parts = path.split('/');\n  let result = '';\n  if (parts.length > 1) {\n    result = parts[parts.length-2];\n  }\n  return result;\n}",
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
    id:'folders',
    description: 'All folders of the file as a list',
    source: "function (app, file, tools) { // do not change this line!\n  const path = file.path; // acquire file path\n  const result = path.split('/');\n  result.pop(); // remove file name\n  return result;\n}",
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
    description: 'File name',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file name\n  const result = file.name.split('.');\n  result.pop(); // remove extension\n  result.join('.'); // reconstruct the file name\n  return result;\n}",
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
    fx:function (app, file, tools:ScriptingTools) { // do not change this line!
        // acquire file name
        const result = file.name;
        return result;
      }
});

ruleFunctions.push({
    id:'dateTimeCreated',
    description: 'Date (and Time) created', // TODO Check time zones. 
    source: "function (app, file, tools) { // do not change this line!\n  // acquire Date and Timer file created\n  const dateTime = new Date(file.stat.ctime);\n  const result = dateTime.toISOString().split('.')[0];\n  return result; // return you result.\n}",
    fx:function (app: App, file:TFile, tools:ScriptingTools) { 
        // acquire Date and Timer file created
        const dateTime = new Date(file.stat.ctime);
        const result = dateTime.toISOString().split('.')[0];
        return result; // return you result.
      }
});

ruleFunctions.push({
    id:'dateTimeModified',
    description: 'Date (and Time) modified', //FIXME keep Date and time untouched when editing frontmatter properties
    source: "function (app, file, tools) { // do not change this line!\n  // acquire Date and Timer file modified\n  const dateTime = new Date(file.stat.mtime);\n  const result = dateTime.toISOString().split('.')[0];\n  return result; // return you result.\n}",
    fx:function (app: App, file:TFile, tools:ScriptingTools) { 
        // acquire Date and Timer file created
        const dateTime = new Date(file.stat.mtime);
        const result = dateTime.toISOString().split('.')[0];
        return result; // return you result.
      }
});

ruleFunctions.push({
    id:'fileSizeBytes',
    description: 'File size in bytes',
    source: "function (app, file, tools) { // do not change this line!\n  // acquire file size\n  const result = file.stat.size;\n  return result; // return you result.\n}",
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