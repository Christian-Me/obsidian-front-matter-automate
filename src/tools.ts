import { App, normalizePath, TAbstractFile, TFile, TFolder, Vault } from 'obsidian';
import { FolderTagRuleDefinition, FolderTagSettings, PropertyInfo, PropertyTypeInfo } from './types'
import { ErrorManager } from "./Error";
import { AlertModal } from './alertBox';
import { ruleFunctions } from './rules';
/**
 * Parse a JavaScript function, clean comments and define the function 
 *
 * @export
 * @param {string} jsCode
 * @return {*}  {(Function | string | undefined)}
 */
export function parseJSCode(jsCode:string): Function | string | undefined {
    function parseFunction (jsCode: string): Function | string | undefined {
        try {
        jsCode = cleanCodeString(jsCode);
        var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
        var match = funcReg.exec(jsCode.replace(/\n/g, ' '));
        if (!match) return undefined;
        var args = match[1].split(',');
        args.push(match[2]);
        return new Function(...args);
        } catch (error) {
            console.error('error parsing JS function!', error);
            return error.message;
        }
    };
    return parseFunction(jsCode);
}

/**
 * Cleans a JavaScript/TypeScript code string by removing comments.
 * This function handles both single-line comments (`// ...`) and
 * multi-line comments (`/* ... *\/`). It also correctly handles
 * comments within strings and regular expressions.
 *
 * @param {string} codeString The code string to clean.
 * @returns {string} The cleaned code string with comments removed.
 * @throws {TypeError} If the input is not a string.
 */
export function cleanCodeString(codeString: string): string {
    // Ensure the input is a string
    if (typeof codeString !== 'string') {
      throw new TypeError('Input must be a string.');
    }
  
    // Flags to track the current parsing context
    let inMultiLineComment: boolean = false;
    let inSingleLineComment: boolean = false;
    let inString: '"' | "'" | null = null; // Tracks if inside single or double quotes
    let inRegExp: boolean = false; // Tracks if inside a regular expression literal
  
    // The resulting string without comments
    let cleanedCode: string = '';
    // Current index in the input string
    let i: number = 0;
  
    // Iterate through the input string character by character
    while (i < codeString.length) {
      const char: string = codeString[i];
      const nextChar: string | undefined = codeString[i + 1]; // Use undefined for potential end of string
  
      // --- State: Inside a multi-line comment ---
      if (inMultiLineComment) {
        // Check for the end of the multi-line comment '*/'
        if (char === '*' && nextChar === '/') {
          inMultiLineComment = false;
          i += 2; // Skip the '*/'
          continue; // Move to the next iteration
        } else {
          i++; // Skip the character inside the comment
          continue;
        }
      }
  
      // --- State: Inside a single-line comment ---
      if (inSingleLineComment) {
        // Check for the end of the line (newline or carriage return)
        if (char === '\n' || char === '\r') {
          inSingleLineComment = false;
          cleanedCode += char; // Keep the newline character
          i++;
          continue;
        } else {
          i++; // Skip the character inside the comment
          continue;
        }
      }
  
      // --- State: Inside a string literal ---
      if (inString) {
        // Check if the current character closes the string
        if (char === inString) {
          inString = null; // Exit string state
        } else if (char === '\\') {
          // Handle escaped characters within strings (e.g., "it\'s")
          cleanedCode += char; // Add the backslash
          i++; // Move to the next character (the escaped one)
          if (i < codeString.length) {
             cleanedCode += codeString[i]; // Add the escaped character
          }
          i++;
          continue;
        }
        // Add the character to the result if it's part of the string
        cleanedCode += char;
        i++;
        continue;
      }
  
       // --- State: Inside a regular expression literal ---
       if (inRegExp) {
          // Check if the current character closes the regex literal
          // Note: This doesn't handle regex flags perfectly but covers basic cases.
          if (char === '/') {
              inRegExp = false; // Exit regex state
          } else if (char === '\\') {
              // Handle escaped characters within regex (e.g., /\//)
              cleanedCode += char; // Add the backslash
              i++; // Move to the next character
              if (i < codeString.length) {
                 cleanedCode += codeString[i]; // Add the escaped character
              }
              i++;
              continue;
          }
          // Add the character to the result if it's part of the regex
          cleanedCode += char;
          i++;
          continue;
       }
  
      // --- Default State: Check for comment/string/regex starts ---
  
      // Check for the start of a multi-line comment '/*'
      if (char === '/' && nextChar === '*') {
        inMultiLineComment = true;
        i += 2; // Skip the '/*'
        continue;
      }
  
      // Check for the start of a single-line comment '//'
      if (char === '/' && nextChar === '/') {
        inSingleLineComment = true;
        i += 2; // Skip the '//'
        continue;
      }
  
      // Check for the start of a string literal (' or ")
      if (char === '"' || char === "'") {
        inString = char; // Enter string state, remembering the quote type
        cleanedCode += char; // Add the opening quote
        i++;
        continue;
      }
  
      // Check for the start of a regular expression literal '/'
      // Basic check: assumes '/' indicates a regex start if not preceded by operators/keywords
      // A more robust solution would require more complex parsing.
      if (char === '/') {
          // Very basic check to differentiate division from regex start.
          // This might need refinement for complex cases.
          const prevMeaningfulChar = cleanedCode.trim().slice(-1);
          if (prevMeaningfulChar === '' || ['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', ';', '\n', '\r'].includes(prevMeaningfulChar)) {
              inRegExp = true;
              cleanedCode += char;
              i++;
              continue;
          }
      }
  
      // If none of the above, it's regular code; add it to the result
      cleanedCode += char;
      i++;
    }
  
    // Return the accumulated cleaned code string
    return cleanedCode;
  }
  export function resolveFolder(app: App, folder_str: string): TFolder {
    folder_str = normalizePath(folder_str);

    const folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        throw new ErrorManager(`Folder "${folder_str}" doesn't exist`);
    }
    if (!(folder instanceof TFolder)) {
        throw new ErrorManager(`${folder_str} is a file, not a folder`);
    }

    return folder;
}

export function resolveFile(app: App, file_str: string): TFile {
    file_str = normalizePath(file_str);

    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new ErrorManager(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof TFile)) {
        throw new ErrorManager(`${file_str} is a folder, not a file`);
    }

    return file;
}
  export function getFilesFromFolder(
    app: App,
    folder_str: string
  ): Array<TFile> {
    const folder = resolveFolder(app, folder_str);

    const files: Array<TFile> = [];
    Vault.recurseChildren(folder, (file: TAbstractFile) => {
        if (file instanceof TFile) {
            files.push(file);
        }
    });

    files.sort((a, b) => {  
        return a.path.localeCompare(b.path);
    });

    return files;
}
  export class ScriptingTools {
    app: App | undefined;
    plugin: any; //FolderTagPlugin;
    settings: FolderTagSettings | undefined;
    rule: FolderTagRuleDefinition | undefined;
    frontmatter: any;
    currentContent: any;
    activeFile: TFile | undefined;
    knownProperties: Record<string, PropertyInfo>;

    constructor(app?:App, plugin?:any, settings?:FolderTagSettings, rule?: FolderTagRuleDefinition, frontmatter?: any, activeFile?: TFile) {
        this.app = app;
        this.plugin = plugin;
        this.settings = settings
        this.rule = rule;
        this.frontmatter = frontmatter;
        this.activeFile = activeFile;
    }
    getFrontmatter() { 
      return this.frontmatter;
    }
    setFrontmatter(frontmatter:any) {
        this.frontmatter = frontmatter;
    }
    setFrontmatterProperty(key:string, value:any) {
      if (!this.frontmatter) this.frontmatter = {};
      this.frontmatter[key] = value;
    }
    getFrontmatterProperty(key:string) {
      return this.frontmatter[key]
    }
    setActiveFile(file:TFile) {
      this.activeFile = file;
    }
    getActiveFile() {
      return this.activeFile;
    }
    setRule(rule:FolderTagRuleDefinition) {
      this.rule = rule;
    }
    getRule() {
      return this.rule;
    }
    getRuleFunction(rule?:FolderTagRuleDefinition) {
      if (!rule) rule = this.rule;
      if (rule) {
        const functionIndex = ruleFunctions.findIndex(fx => fx.id === rule.content);
          if (functionIndex!==-1){
            return ruleFunctions[functionIndex];
          }
        }
    }
    setCurrentContent(content:any) {
      this.currentContent = content;
    }
    getCurrentContent() {
      return this.currentContent;
    }
    updateFrontmatter(property, newContent, file?:TFile) {
      if (!this.app) return;
      if (!file) file = this.activeFile;
      if (!file) return;
      this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        console.log(`updateFrontmatter '${file.path}' frontmatter '${property}' to '${newContent.toString()}'`);
        if (typeof newContent === 'object' && !Array.isArray(newContent)) {
          console.warn(`updateFrontmatter '${file.path}'|'${property}' object not supported!`);
        } else {
          frontmatter[property] = newContent;
        }
      },{'mtime':file.stat.mtime}); // do not change the modify time.
    }
    async showConfirmDialog(message:string, title:string = 'Confirm', button1:string = 'Yes', button2:string = 'No') {
      const result =  await new AlertModal(this.app!, title, message, button1, button2).openAndGetValue();
      return result.proceed;
    }
    /**
     * * Get the option config for a specific rule. Optional the specific parameter by providing an option ID.
     *
     * @param {string} ruleId
     * @param {string} [optionId]
     * @return {*} 
     * @memberof ScriptingTools
     */
    getOptionConfig(ruleId:string|undefined, optionId?:string){
      if (!ruleId || ruleId === undefined || !this.settings ) return undefined;
      const rule = this.settings.rules.find((rule: FolderTagRuleDefinition) => rule.id === ruleId);
      if (rule && rule.hasOwnProperty('optionsConfig')) {
          //@ts-ignore
          const optionConfig = rule.optionsConfig[ruleId]
          if (optionConfig) {
            if (optionId) {
              return optionConfig[optionId];
            } else {
              return optionConfig;
            }
          }
      }
      return undefined;
    }

    getFilesInVault(matching: string): TFile[] {
        matching = matching.replace(/^\/|\/$/g, "") + '/'; // Ensure it ends with a '/'
        const files = this.app!.vault.getMarkdownFiles(); // Retrieve all markdown files
        const matchingFiles = files.filter(file => file instanceof TFile && file.path.includes(matching));
        return matchingFiles;
    }

    getFileFromPath(path: string, filesCheck: TFile[] | undefined) {
      const files = filesCheck ? filesCheck : this.app!.vault.getMarkdownFiles(); // Retrieve all markdown files
      const matchingFiles = files.filter(file => 
        file instanceof TFile && 
        file.path.toLocaleLowerCase().includes(path.toLocaleLowerCase())
      );
      return matchingFiles.length > 0 ? matchingFiles[0] : undefined;
    }
    async createFileFromPath(fileNameWithPath:string, templateFileWithPath:string) {
        const fileName = fileNameWithPath.replace(/^\/|\/$/g, ""); // Remove leading and trailing slashes
        const templateFile = templateFileWithPath.replace(/^\/|\/$/g, ""); // Remove leading and trailing slashes
        const folderPath = this.getFolderFromPath(fileName);
        const fileNameOnly = fileName.split('/').pop() || fileName; // Get the last part of the path as the file name
        if (!folderPath) {
            throw new ErrorManager(`Invalid folder path: "${folderPath}"`);
        }
        const folder = this.app!.vault.getAbstractFileByPath(folderPath) as TFolder;
        if (!folder) {
            throw new ErrorManager(`Folder "${folderPath}" doesn't exist`);
        }
        if (!(folder instanceof TFolder)) {
            throw new ErrorManager(`${folderPath} is a file, not a folder`);
        }
        const templateContent = await this.app!.vault.read(this.app!.vault.getAbstractFileByPath(templateFile) as TFile);
        const fileExists = this.app!.vault.getAbstractFileByPath(fileNameWithPath) as TFile;
        if (!fileExists) {
          return await this.app!.vault.create(folder.path + '/' + fileNameOnly, templateContent); // create the file from the template
        }
        return fileExists; // return the file if it already exists
    }; // create the file if it does not exist

    /**
     * * Fetches custom property information from all markdown files in the vault.
     *
     * @return {*} 
     */
    fetchCustomPropertyInfos(app:App): Record<string, PropertyInfo> {
        const propertyInfos: Record<string, PropertyInfo> = {};

        const files = app.vault.getMarkdownFiles(); // Retrieve all markdown files
        files.forEach(file => {
            const metadata = app.metadataCache.getFileCache(file);
            if (metadata?.frontmatter) {
                Object.keys(metadata.frontmatter).forEach(key => {
                    if (!propertyInfos[key]) {
                        propertyInfos[key] = { name: key, type: 'text' }; // Default type as 'text'
                    }
                });
            }
        });

        return propertyInfos;
    }
    /**
     * Fetches known properties from the metadata cache.
     * If the method getAllPropertyInfos is not available, it falls back to fetchCustomPropertyInfos.
     * @param app The Obsidian app instance.
     */
    async fetchKnownProperties(app:App) {
      let propertyInfos: Record<string, PropertyInfo> = {};
      // @ts-ignore
      if (typeof app.metadataCache.getAllPropertyInfos === 'function') {
          // @ts-ignore
          propertyInfos = app.metadataCache.getAllPropertyInfos();
      } else {
        propertyInfos = this.fetchCustomPropertyInfos(app);
      }
      // sort the properties by name
      propertyInfos = Object.fromEntries(
          Object.entries(propertyInfos).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      );
      // restore to keep properties to case sensitive
      this.knownProperties = {};
      Object.keys(propertyInfos).forEach(key => {
        this.knownProperties[propertyInfos[key].name] = propertyInfos[key];
      });
      console.log(this.knownProperties);
      return this.knownProperties;
    }
    
    getKnownProperties() {
        if (!this.knownProperties) {
            this.knownProperties = this.fetchCustomPropertyInfos(this.app!);
        }
        return this.knownProperties;
    }
    
    extractLinkParts(link: string): { path: string; title: string } {
      // Remove all square brackets from the string
      const cleanedLink = link.replace(/[\[\]]/g, "");
  
      // Split the string by the "|" character
      const parts = cleanedLink.split("|");
  
      // If only one part exists, use it as both path and title
      const path = parts[0].trim();
      const title = parts.length > 1 ? parts[1].trim() : path;
      //console.log(`extractLinkParts(${link}) -> path: ${path}, title: ${title}`);
      return { path, title };
    }
    removeLeadingSlash(path: string): string {
      return path.replace(/^\/+/, "");
    }
    addLeadingSlash(path: string): string {
      return path.replace(/^(?!\/)/, "/");
    }
    /**
     * Check if a string complies with ISO Standard
     * 
     * @param str Any string
     * @param options Options to look for
     * @returns 
     */
    isISOString(
      str: string,
      options: {
        withMilliseconds?: boolean;
        withTimezone?: boolean;
        withTime?: boolean;
        withDate?: boolean; 
      } = {}
    ): boolean {
      const {
        withMilliseconds = false,
        withTimezone = false,
        withTime = true,
        withDate = true, 
      } = options;
    
      let dateRegexStr = "^(?:\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01]))";
      let timeRegexStr = "(?:T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
    
      if (withMilliseconds) {
        timeRegexStr += "\\.\\d{3}";
      }
    
      if (withTimezone) {
        timeRegexStr += "(?:Z|[+-](?:[01]\\d|2[0-3]):[0-5]\\d)?)?";
      } else {
        timeRegexStr += ")?";
      }
    
      let regexStr = "";
      if (withDate && withTime) {
        regexStr = `${dateRegexStr}${timeRegexStr}$`;
      } else if (withDate) {
        regexStr = `${dateRegexStr}$`;
      } else if (withTime) {
        regexStr = `^${timeRegexStr.slice(4)}$`; 
      } else {
        return false; 
      }
    
      const regex = new RegExp(regexStr);
      return regex.test(str);
    }
    /**
     * Try to convert Any Types to a specific Type
     * @param input 
     * @param typeString 'string' | 'number' | 'boolean' | 'string[]'
     * @returns 
     */
    tryConvert(input: any, typeString: 'string' | 'number' | 'boolean' | 'string[]'): string | number | boolean | string[] | undefined {
      switch (typeString) {
        case 'string':
          if (typeof input === 'string') {
            return input;
          }
          return undefined;
        case 'number':
          const num = Number(input);
          if (!isNaN(num)) {
            return num;
          }
          return undefined;
        case 'boolean':
            if (typeof input === 'boolean') {
              return input;
            }
            if (typeof input === 'string') {
              const lowerValue = input.toLowerCase();
              if (lowerValue === 'true') {
                return true;
              }
              if (lowerValue === 'false') {
                return false;
              }
            }
            if (typeof input === 'number') {
              if (input === 1) {
                return true;
              }
              if (input === 0) {
                return false;
              }
            }
            return undefined;
        case 'string[]':
          if (Array.isArray(input) && input.every(item => typeof item === 'string')) {
            return input;
          }
          return undefined;
        default:
          return undefined;
      }
    }
    
    formatToYAMLSaveString(text:string, replaceBy:string | undefined = undefined):string {
      let replaceString = '-';
      if (!replaceBy && this.settings) {
        replaceString = this.settings.specialCharReplacement || '-';
      } else {
        if (replaceBy) replaceString = replaceBy;
      }
      return text.replace(/[^a-zA-Z0-9\-_\/äöüßÄÖÜáéíóúýÁÉÍÓÚÝàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕ]/g, replaceString);
    };

    /**
     * Converts a string to a YAML-safe format by adding quotes when necessary.
     * @param input The string, boolean, number or array to make YAML-safe
     * @returns The safely quoted string when needed, or the original string if safe
     */
    toYamlSafeString(input: string|number|boolean|string[]): string|number|string[] {
      if (Array.isArray(input)) {
        input.forEach((item, index) => {
          input[index] = this.toYamlSafeString(item).toString();
        })
        return input;
      }
      switch (typeof input) {
        case 'number': return input;
        case 'boolean': return input ? 'true' : 'false';
        case 'string':
          // Trim whitespace first
          const trimmed = input.trim();
          
          // Empty strings need quotes
          if (trimmed === '') return '""';
          
          // Check for special characters/patterns that require quoting
          const needsQuotes = /[:{}\[\],&*#?|<>=!%@`"'\\]|^[-?\n]|[\s\n]|^[yYnN]|^[0-9]|^[+-]|^(true|false|yes|no|on|off)$/i.test(trimmed);
          
          // Check if the string is already properly quoted
          const isAlreadyQuoted = (trimmed.startsWith('"') && trimmed.endsWith('"')) || 
                                (trimmed.startsWith("'") && trimmed.endsWith("'"));
          
          if (!needsQuotes && !isAlreadyQuoted) {
              return trimmed;
          }
          
          // If we get here, we need quotes
          // Use double quotes and escape any existing double quotes
          if (!isAlreadyQuoted) {
              return `"${trimmed.replace(/"/g, '\\"')}"`;
          }
          
          // If already quoted, return as-is
          return trimmed;
        default: 
          console.error(`toYamlSafeString(${input}) if of type '${typeof input}'`);
          return input;
      }
    }

    replaceSpaces(text:string, replaceBy:string | undefined = undefined):string {
      let replaceString = '_';
      if (!replaceBy && this.settings) {
        replaceString = this.settings.spaceReplacement || '_';
      } else {
        if (replaceBy) replaceString = replaceBy;
      }
      return text.replace(/\s+/g, replaceString);
    }

    formatCamelCase(text:string):string {
      let textParts = text.split(' ');
      let convertedTextParts:string[] = [];
      textParts.forEach((text,index) => {
        let newTextPart = text.toLowerCase();
        if (index>0) newTextPart = newTextPart.charAt(0).toUpperCase() + newTextPart.slice(1);
        convertedTextParts.push(newTextPart);
      });
      return convertedTextParts.join('');
    }

    formatUpperCamelCase(text:string):string {
      let textParts = text.split(' ');
      let convertedTextParts:string[] = [];
      textParts.forEach((text,index) => {
        let newTextPart = text.toLowerCase();
        newTextPart = newTextPart.charAt(0).toUpperCase() + newTextPart.slice(1);
        convertedTextParts.push(newTextPart);
      });
      return convertedTextParts.join('');
    }

    /**
     * get the path to a file from a string containing the full parh/name string
     * @param path string
     * @param separator string defaults to '/'
     * @returns string
     */
    getFolderFromPath (path:string|null|undefined, separator = '/') {
        if (path === null) return null;
        if (path === undefined) return undefined;
        const currentPathParts = path.split('/');
        currentPathParts.pop(); // remove File name;
        return currentPathParts.join(separator);
    }
    
    /**
     * removes duplicate strings in an array and deletes empty strings
     * @param stringArray 
     * @returns 
     */
    removeDuplicateStrings(stringArray: string[]): string[] {
      if (!stringArray) return [];
      const uniqueStringsSet = new Set<string>(stringArray);
      uniqueStringsSet.delete(''); // remove empty strings
      return [...uniqueStringsSet];
    }
  }
/**
 * get the path to a file from a string containing the full parh/name string
 * @param path string
 * @param separator string defaults to '/'
 * @returns string
 */
export function getFolderFromPath (path:string|null|undefined, separator = '/') {
    if (path === null) return null;
    if (path === undefined) return undefined;
    const currentPathParts = path.split('/');
    currentPathParts.pop(); // remove File name;
    return currentPathParts.join(separator);
}
    