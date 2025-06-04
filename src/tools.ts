import { App, normalizePath, TAbstractFile, TFile, TFolder, Vault } from 'obsidian';
import { FrontmatterAutomateRuleSettings, FrontmatterAutomateSettings, PropertyInfo, PropertyTypeInfo } from './types'
import { ErrorManager } from "./Error";
import { AlertModal } from './alertBox';
import { delimiter } from 'path';
import { rulesManager } from './rules/rules';
import { DEBUG, ERROR, logger, TRACE, WARNING } from './Log';
import { TreeHierarchyRow } from './uiTreeHierarchySortableSettings';
/**
 * Parse a JavaScript function, clean comments and define the function 
 *
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
            logger.log(ERROR,'error parsing JS function!', error);
            return (error as Error).message;
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
    settings: FrontmatterAutomateSettings | undefined;
    rule: FrontmatterAutomateRuleSettings | undefined;
    frontmatter: any;
    currentContent: any;
    activeFile: TFile | undefined;
    knownProperties: Record<string, PropertyInfo> = {};

    constructor(app?:App, plugin?:any, settings?:FrontmatterAutomateSettings, rule?: FrontmatterAutomateRuleSettings, frontmatter?: any, activeFile?: TFile) {
        this.app = app;
        this.plugin = plugin;
        this.settings = settings
        this.rule = rule;
        this.frontmatter = frontmatter;
        this.activeFile = activeFile;
    }
    /**
     * Retrieves the frontmatter object associated with the current instance.
     *
     * @returns The frontmatter data.
     */
    getFrontmatter() { 
      return this.frontmatter;
    }
    /**
     * Sets the frontmatter property for the current instance.
     *
     * @param frontmatter - The frontmatter object to assign.
     */
    setFrontmatter(frontmatter:any) {
        this.frontmatter = frontmatter;
    }
    /**
     * Sets a property in the frontmatter object. If the frontmatter does not exist, it initializes it as an empty object.
     *
     * @param key - The property name to set in the frontmatter.
     * @param value - The value to assign to the specified property.
     */
    setFrontmatterProperty(key:string, value:any) {
      if (!this.frontmatter) this.frontmatter = {};
      this.frontmatter[key] = value;
    }
    /**
     * Retrieves the value of a specified property from the frontmatter object.
     *
     * @param key - The name of the property to retrieve from the frontmatter.
     * @returns The value associated with the specified key in the frontmatter, or `undefined` if the key does not exist.
     */
    getFrontmatterProperty(key:string) {
      return this.frontmatter[key]
    }
    /**
     * Sets the currently active file.
     *
     * @param file - The file to set as active. Must be an instance of `TFile`.
     */
    setActiveFile(file:TFile) {
      this.activeFile = file;
    }
    /**
     * Returns the currently active file.
     *
     * @returns The active file object, or `undefined` if no file is active.
     */
    getActiveFile() {
      return this.activeFile;
    }
    /**
     * Sets the current rule configuration for the frontmatter automation.
     *
     * @param rule - The rule settings to apply, represented by a `FrontmatterAutomateRuleSettings` object.
     */
    setRule(rule:FrontmatterAutomateRuleSettings) {
      this.rule = rule;
    }
    /**
     * Retrieves the current rule associated with this instance.
     *
     * @returns The rule object or value stored in the `rule` property.
     */
    getRule() {
      return this.rule;
    }
    /**
     * Retrieves a rule function based on the provided rule settings.
     *
     * @param rule - Optional. The rule settings to use for retrieving the rule function.
     *               If not provided, the method uses the instance's default rule.
     * @returns The rule function associated with the specified rule settings, or `undefined` if no rule is found.
     */
    getRuleFunction(rule?:FrontmatterAutomateRuleSettings) {
      if (!rule) rule = this.rule;
      if (rule) {
        return rulesManager.getRuleById(rule.content);
      }
    }
    /**
     * Sets the current content to the provided value.
     *
     * @param content - The content to set as the current content. Can be of any type.
     */
    setCurrentContent(content:any) {
      this.currentContent = content;
    }
    /**
     * Retrieves the current content stored in the instance.
     *
     * @returns The current content.
     */
    getCurrentContent() {
      return this.currentContent;
    }
    /**
     * Retrieves the current content type based on the associated rule.
     *
     * If a rule is present, it returns the `type` property of the rule,
     * or, if not available, the `type` property from the rule's `typeProperty` object.
     * If no rule is defined, it defaults to returning `'text'`.
     *
     * @returns {string} The determined content type, or `'text'` if not specified.
     */
    getCurrentContentType() {
      if (this.rule) {
        return this.rule.type || this.rule.typeProperty?.type;
      }
      return 'text';
    }
    /**
     * Updates the specified frontmatter property of a given file with new content.
     *
     * If no file is provided, the currently active file is used. If neither is available, the method returns early.
     * The method logs the update operation and only supports updating properties with primitive values or arrays.
     * If `newContent` is an object (but not an array), a warning is issued and the update is not performed.
     * The file's modification time (`mtime`) is preserved and not changed during the update.
     *
     * @param property - The frontmatter property to update.
     * @param newContent - The new value to assign to the property. Objects (except arrays) are not supported.
     * @param file - (Optional) The file whose frontmatter should be updated. If omitted, the active file is used.
     */
    updateFrontmatter(property:string, newContent:any, file?:TFile) {
      this.plugin.preventOnMetadataChange = true; // prevent the onMetadataChange event to be triggered
      if (!this.app) return;
      if (!file) file = this.activeFile;
      if (!file) return;
      this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        logger.log(DEBUG,`updateFrontmatter '${file.path}' frontmatter '${property}' to '${newContent.toString()}'`);
        if (typeof newContent === 'object' && !Array.isArray(newContent)) {
          logger.log(WARNING,`updateFrontmatter '${file.path}'|'${property}' object not supported!`);
        } else {
          frontmatter[property] = newContent;
        }
      },{'mtime':file.stat.mtime}); // do not change the modify time.
      this.plugin.preventOnMetadataChange = false; // allow the onMetadataChange event to be triggered again
    }
    /**
     * Displays a confirmation dialog with customizable message, title, and button labels.
     *
     * @param message - The message to display in the confirmation dialog.
     * @param title - The title of the dialog window. Defaults to 'Confirm'.
     * @param button1 - The label for the confirmation button. Defaults to 'Yes'.
     * @param button2 - The label for the cancellation button. Defaults to 'No'.
     * @returns A promise that resolves to a boolean indicating whether the user confirmed (true) or cancelled (false).
     */
    async showConfirmDialog(message:string, title:string = 'Confirm', button1:string = 'Yes', button2:string = 'No') {
      const result =  await new AlertModal(this.app!, title, message, button1, button2).openAndGetValue();
      return result.proceed;
    }
    /**
     * Retrieves a rule from the plugin's settings by its unique identifier.
     *
     * @param ruleId - The unique identifier of the rule to retrieve.
     * @returns The matching {@link FrontmatterAutomateRuleSettings} object if found; otherwise, `undefined`.
     */
    getRuleById(ruleId:string): FrontmatterAutomateRuleSettings | undefined {
        if (!this.settings || !this.settings.folderConfig || !this.settings.folderConfig.rows) return undefined;
        const row = this.settings.folderConfig.rows.find((row:TreeHierarchyRow) => {
            if (row.payload && row.payload.id) {
                return row.payload.id === ruleId;
            }
            return false;
        });
        return row?.payload;
    }
    /**
     * * Get the option config for a specific rule. Optional the specific parameter by providing an option ID.
     *
     * @param {string} ruleId
     * @param {string} [optionId]
     * @return {*} 
     */
    getOptionConfig(ruleId:string|undefined, optionId?:string){
      if (!ruleId || ruleId === undefined || !this.settings ) return undefined;
      const rule = this.getRuleById(ruleId);
      if (rule && rule.hasOwnProperty('optionsConfig')) {
          //@ts-ignore
          const optionConfig = rule.optionsConfig[ruleId]
          if (optionConfig) {
            if (optionId) {
              logger.log(TRACE,`getOptionConfig: ${ruleId} option '${optionId}'`, rule, optionConfig[optionId]);
              return optionConfig[optionId];
            } else {
              return optionConfig;
            }
          }
      }
      return undefined;
    }
    /**
     * Retrieves all markdown files in the vault whose paths include the specified matching string.
     *
     * The `matching` parameter is normalized to ensure it ends with a single '/' character,
     * and is used to filter files whose paths contain this substring.
     *
     * @param folderPath - The folder path or substring to match within file paths.
     * @returns An array of `TFile` objects whose paths include the normalized `matching` string.
     */
    getFilesInVault(folderPath: string): TFile[] {
        folderPath = folderPath.replace(/^\/|\/$/g, "") + '/'; // Ensure it ends with a '/'
        const files = this.app!.vault.getMarkdownFiles(); // Retrieve all markdown files
        const matchingFiles = files.filter(file => file instanceof TFile && file.path.includes(folderPath));
        return matchingFiles;
    }
    /**
     * Creates a mock `TFile` object from a given file path string.
     *
     * This method parses the provided path to construct a `TFile`-like object,
     * extracting the file name, extension, and base name. The returned object
     * contains placeholder values for file statistics and parent, as these details
     * are unknown. If the input path is empty or undefined, the method returns `undefined`.
     *
     * @param path - The file path string to generate the mock `TFile` from.
     * @returns A mock `TFile` object representing the file at the given path, or `undefined` if the path is invalid.
     */
    getMockFileFromPath(path: string|undefined): TFile |undefined {
      if (!path) return undefined;

      let oldFile:TFile;
      let oldFileParts = path.split('/');
      oldFile = {
        path: path,
        extension: oldFileParts[oldFileParts.length-1].split('.')[1],
        name: oldFileParts[oldFileParts.length-1],
        stat: {mtime: 0, ctime: 0, size: 0}, // stats are unknown
        basename: this.removeAllExtensions(oldFileParts[oldFileParts.length-1]),
        vault: this.app!.vault,
        parent: null // parent is unknown
      }

      return oldFile
    }
    /**
     * Retrieves a `TFile` object from a given file path.
     *
     * @param path - The file path to search for. If `undefined`, the function returns `undefined`.
     * @param filesCheck - An optional array of `TFile` objects to search within. If not provided, all markdown files in the vault are used.
     * @returns The matching `TFile` if found; otherwise, `undefined`.
     */
    getTFileFromPath(path: string | undefined, filesCheck: TFile[] | undefined = undefined) {
      if (!path) return undefined;
      const files = filesCheck ? filesCheck : this.app!.vault.getMarkdownFiles(); // Retrieve all markdown files
      const matchingFiles = files.filter(file => 
        file instanceof TFile && 
        file.path.toLocaleLowerCase() === path.toLocaleLowerCase()
      );
      return matchingFiles.length > 0 ? matchingFiles[0] : undefined;
    }
    /**
     * Creates a new file at the specified path using the content from a template file.
     * If the file already exists, returns the existing file instead of creating a new one.
     *
     * @param fileNameWithPath - The full path (including file name) where the new file should be created.
     * @param templateFileWithPath - The full path to the template file whose content will be used.
     * @returns A promise that resolves to the newly created file or the existing file if it already exists.
     * @throws {ErrorManager} If the folder path is invalid, does not exist, or is not a folder.
     */
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
      logger.log(DEBUG,this.knownProperties);
      return this.knownProperties;
    }
    /**
     * Retrieves the known properties, initializing them if they have not been loaded yet.
     * If the properties are not already cached, this method fetches them using `fetchCustomPropertyInfos`
     * and stores them for future access.
     *
     * @returns The cached or newly fetched known properties.
     */
    getKnownProperties() {
        if (!this.knownProperties) {
            this.knownProperties = this.fetchCustomPropertyInfos(this.app!);
        }
        return this.knownProperties;
    }
    /**
     * Extracts the path and title from a given link string.
     *
     * The input link is expected to be in the format `[[path|title]]` or `[[path]]`.
     * This function removes square brackets, splits the link by the `|` character,
     * and determines the path and title. If the title is not provided, the path is
     * used as the title.
     *
     * @param link - The link string to extract parts from, typically in the format `[[path|title]]` or `[[path]]`.
     * @returns An object containing the `path` and `title` extracted from the link.
     */
    extractLinkParts(link: string): { path: string; title: string } {
      // Remove all square brackets from the string
      const cleanedLink = link.replace(/[\[\]]/g, "");
  
      // Split the string by the "|" character
      const parts = cleanedLink.split("|");
  
      // If only one part exists, use it as both path and title
      const path = parts[0].trim();
      const title = parts.length > 1 ? parts[1].trim() : path;
      //logger.log(DEBUG,`extractLinkParts(${link}) -> path: ${path}, title: ${title}`);
      return { path, title };
    }
    /**
     * Extracts the path, title, and file name from a given file link string.
     *
     * Splits the input string by the "/" character to separate the file name from its path.
     * The title is derived from the file name by removing all extensions and trimming whitespace.
     *
     * @param link - The file link string to extract parts from.
     * @returns An object containing:
     *   - `path`: The directory path portion of the link (excluding the file name).
     *   - `title`: The file name without extensions and trimmed.
     *   - `fileName`: The full file name (with extensions, if any).
     */
    extractPathParts(link: string): { path: string; title: string; fileName: string } {
 
      // Split the string by the "/" character
      const parts = link.split("/");
  
      // If only one part exists, use it as both path and title
      const fileName = parts.pop() || "";
      const title = this.removeAllExtensions(fileName).trim();
      const path = parts.join("/").trim();
      //logger.log(DEBUG,`extractLinkParts(${link}) -> path: ${path}, title: ${title}`);
      return { path, title, fileName };
    }

    /**
     * Removes one or more leading slashes from the beginning of the given path string.
     *
     * @param path - The input string from which to remove leading slashes.
     * @returns The input string without any leading slashes.
     */
    removeLeadingSlash(path: string): string {
      return path.replace(/^\/+/, "");
    }
    /**
     * Ensures that the given path string starts with a leading slash ('/').
     * If the path already begins with a slash, it is returned unchanged.
     *
     * @param path - The input path string to modify.
     * @returns The path string guaranteed to start with a leading slash.
     */
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
  
    /**
     * Formats a given text string to be safe for use in YAML by replacing special characters.
     *
     * Replaces all characters that are not alphanumeric, dash, underscore, slash, or certain accented characters
     * with a specified replacement string. If no replacement string is provided, it uses the value from settings,
     * or defaults to `'-'`.
     *
     * @param text - The input string to format.
     * @param replaceBy - Optional. The string to replace special characters with. If not provided, uses the value from settings or `'-'`.
     * @returns The formatted string safe for YAML usage.
     */
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
          logger.log(ERROR,`toYamlSafeString(${input}) if of type '${typeof input}'`);
          return input;
      }
    }
    /**
     * Converts an input string or array of strings into a Markdown Link format.
     * 
     * @param input - The input to be converted. Can be a string or an array of strings.
     * @param replaceSpaces - Optional parameter to specify a replacement for spaces in the path or title.
     *                        If provided, spaces will be replaced with this value.
     * @returns A string in Markdown Link format if the input is a single string, or a concatenated string
     *          of Markdown Links if the input is an array of strings.
     * 
     * The Markdown Link format is `[title](path)`, where:
     * - `path` is the formatted path of the link.
     * - `title` is the formatted title of the link.
     * 
     * If the input is an array, each element is converted to a WikiLink and joined with a comma.
     */
    toMarkdownLink(input: any, replaceSpaces?: string): string | string[] {
      if (Array.isArray(input)) {
        return input.map(item => this.toWikiLink(item)).join(', ');
      }
      if (typeof input === 'string') {
        const { path, title, fileName } = this.extractPathParts(input);
        const formattedPath = this.replaceSpaces(input, replaceSpaces);
        const formattedTitle = this.replaceSpaces(title, replaceSpaces);
        return `[[${formattedPath}|${formattedTitle}]]`;
      }
      return input;
    }
    /**
     * Converts an input string or array of strings into a WikiLink format string or array of strings.
     * 
     * @param input - The input to be converted. Can be a string or an array of strings.
     * @param replaceSpaces - Optional parameter to specify a replacement for spaces in the path or title.
     *                        If provided, spaces will be replaced with this value.
     * @returns A string in WikiLink format if the input is a single string, or a concatenated string
     *          of WikiLinks if the input is an array of strings.
     * 
     * The WikiLink format is `[[fileName]]`, where:
     * - `fileName` is the formatted unique fileName of the link.
     * 
     * If the input is an array, each element is converted to a WikiLink and joined with a comma.
     */
    toWikiLink(input: any, replaceSpaces = ' '): string | string[] {
      if (Array.isArray(input)) {
        return input.flatMap(item => this.toWikiLink(item));
        //return input.map(item => this.toWikiLink(item)).join(', ');
      }
      if (typeof input === 'string') {
        const { path, title } = this.extractLinkParts(input);
        const formattedTitle = this.replaceSpaces(this.removeAllExtensions(title), replaceSpaces);
        return `[[${formattedTitle}]]`;
      }
      return input;
    }
    /**
     * Replaces all whitespace characters in the given text with a specified replacement string.
     *
     * @param text - The input string in which spaces will be replaced.
     * @param replaceBy - Optional. The string to replace spaces with. If not provided, uses the value from `this.settings.spaceReplacement` or defaults to '_'.
     * @returns The modified string with spaces replaced by the specified replacement string.
     */
    replaceSpaces(text:string, replaceBy:string | undefined = undefined):string {
      let replaceString = '_';
      if (!replaceBy && this.settings) {
        replaceString = this.settings.spaceReplacement || '_';
      } else {
        if (replaceBy) replaceString = replaceBy;
      }
      return text.replace(/\s+/g, replaceString);
    }
    /**
     * Removes the ALL file extension(s) from a given file name.
     *
     * @param fileName - The name of the file, including its extension.
     * @returns The file name without its extension.
     */
    removeAllExtensions(fileName: string): string {
        return fileName.split('.')[0];
    }
    /**
     * Removes the last file extension(s) from a given file name.
     *
     * @param fileName - The name of the file, including its extension.
     * @returns The file name without its extension.
     */
    removeExtensions(fileName: string): string {
        const result = fileName.split('.');
        result.pop(); // remove the last part
        if (result.length === 0) return fileName; // no extension
        return result.join('.') || fileName;
    }

    /**
     * Converts a given string to camelCase format.
     *
     * Splits the input text by spaces, lowercases the first word,
     * and capitalizes the first letter of each subsequent word,
     * then joins them together without spaces.
     *
     * @param text - The input string to be converted.
     * @returns The camelCase formatted string.
     */
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
    