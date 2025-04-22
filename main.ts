import { App, Plugin, MarkdownView, PluginManifest, TFile, TFolder, Vault, parseFrontMatterTags, Notice} from 'obsidian';
import * as fmTools from './src/frontmatter-tools';
import { FolderTagSettingTab } from './src/settings';
//import { FolderTagSettingTab } from './src/settings-properties';
import { executeRule, ruleFunctions } from './src/rules';
import { parseJSCode, ScriptingTools } from './src/tools';
import { versionString, FolderTagSettings, DEFAULT_SETTINGS, FolderTagRuleDefinition, PropertyTypeInfo} from './src/types'
import { runInContext } from 'vm';

export default class FolderTagPlugin extends Plugin {
    settings: FolderTagSettings;
    private tools: ScriptingTools;
    //private oldFolderPaths = new Map<string, string | null>();

    async onload() {
        await this.loadSettings();
        this.tools = new ScriptingTools(this.settings);
        let noticeMessage = `Front Matter Automate ${versionString}\n loading ...`;
        const loadingNotice = new Notice(noticeMessage,0)
        /*
        // Store initial folder paths for all files
        this.app.vault.getMarkdownFiles().forEach(file => {
            this.oldFolderPaths.set(file.path, this.getFolderPathForTag(file));
        });
        */
        noticeMessage = noticeMessage + '\n register events ...';
        loadingNotice.setMessage(noticeMessage);
        // File creation handler
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile && file.extension === 'md') {
                    //this.oldFolderPaths.set(file.path, this.getFolderPathForTag(file));
                    //this.updateFileTag(file);
                    this.updateFrontmatterParameters('create', file, this.settings.rules);
                }
            })
        );

        // File rename/move handler
        this.registerEvent(
            this.app.vault.on('rename', (file, oldPath) => {
                if (file instanceof TFile && file.extension === 'md') {
                    //const oldTagPath = this.oldFolderPaths.get(oldPath) ?? null;
                    //const newTagPath = this.getFolderPathForTag(file);
                    //this.oldFolderPaths.set(file.path, newTagPath);
                    this.updateFrontmatterParameters('rename', file, this.settings.rules, oldPath);
                    
                    /*
                    // Always update when moving to/from root folder
                    if (oldTagPath !== newTagPath || 
                        (oldTagPath !== null && newTagPath === null) || 
                        (oldTagPath === null && newTagPath !== null)) {
                        //this.updateFileTag(file, oldTagPath);
                    }
                    */
                }
            })
        );

        // File close handler
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (leaf?.view instanceof MarkdownView) {
                    const activeFile = this.app.workspace.getActiveFile();
                    console.log(`closing file: `, activeFile?.path);
                    if (activeFile) this.updateFrontmatterParameters('active-leaf-change', activeFile, this.settings.rules);
                }
            })
        );

        noticeMessage = noticeMessage + '\n initial processing ...';
        loadingNotice.setMessage(noticeMessage);

        // Initial processing of existing files
        this.app.vault.getMarkdownFiles().forEach(file => {
            //this.updateFileTag(file);
            //this.updateFrontmatterParameters(file, this.settings.rules);
        });

        noticeMessage = noticeMessage + '\ndone!';
        loadingNotice.setMessage(noticeMessage);
        setTimeout(()=>{
            loadingNotice.hide();
        },2000)

        // Add settings tab
        this.addSettingTab(new FolderTagSettingTab(this.app, this));
    }

    async loadSettings() {
        let data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    }
    
    async saveSettings() {
        await this.saveData(this.settings);
    }

    private formatTagName(name: string | null | undefined): string | null | undefined{
        if (name === null) return null;
        if (name === undefined) return undefined;
        
        // First replace spaces according to settings
        let formatted = name.replace(/\s+/g, this.settings.spaceReplacement);
        
        // Then replace special characters (preserving letters with diacritics)
        formatted = formatted.replace(/[^a-zA-Z0-9\-_\/äöüßÄÖÜáéíóúýÁÉÍÓÚÝàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕ]/g, this.settings.specialCharReplacement);
        
        // Convert to lowercase if configured
        if (this.settings.lowercaseTags) {
            formatted = formatted.toLowerCase();
        }
        
        return formatted;
    }

    private async updateFileTag(file: TFile, oldTagPath?: string | null) {
        const newTagPath = this.getFolderPathForTag(file);
        const formattedNewPath = newTagPath ? this.formatTagName(newTagPath) : null;
        
        // If moving to root, newTag will be null
        const newTag = formattedNewPath ? this.settings.tagPrefix + formattedNewPath : null;
        
        // Format the old tag for removal
        let oldTagToRemove: string | undefined;
        if (oldTagPath) {
            const formattedOldPath = this.formatTagName(oldTagPath);
            if (formattedOldPath) {
                oldTagToRemove = this.settings.tagPrefix + formattedOldPath;
            }
        }

        await this.updateFrontmatterTags(file, newTag, oldTagToRemove);
    }

    private getFolderPathForTag(file: TFile): string | null {
        const folder = file.parent;
        if (!folder || folder === this.app.vault.getRoot()) {
            return null;
        }

        let pathParts: string[] = [];
        let currentFolder: TFolder | null = folder;

        while (currentFolder && currentFolder !== this.app.vault.getRoot()) {
            pathParts.unshift(currentFolder.name);
            currentFolder = currentFolder.parent;
        }

        if (this.settings.excludeRootFolder && pathParts.length > 0) {
            pathParts = pathParts.slice(1);
        }

        return pathParts.length > 0 ? pathParts.join('/') : null;
    }

    /**
     * Filters a given file and returns true if it is included in a folder or file list
     * @param file 
     * @param filterMode 'exclude'|'include'
     * @param type 'folders'|'files'
     * @returns 
     */
    filterFile(file: TFile, filterMode: string, type:string):boolean {
        let result = false;
        const filterArray = (type==='folders') ? this.settings[filterMode].selectedFolders : this.settings[filterMode].selectedFiles;
        if (filterArray.length === 0) return (filterMode === 'include')? false : true;
        const filePath = file.path;
        const fileFolder = this.tools.getFoldersFromPath(file.path);
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

    checkIfFileAllowed(file: TFile) {
        let result = false;
        if (this.settings.include.selectedFiles.length>0) { // there are files in the include files list
            result = this.filterFile(file, 'include', 'files');
            if (result === true) return result; // file is in include-list
        }
        if (this.settings.include.selectedFolders.length>0) { // there are folders in the include folders list
            result = this.filterFile(file, 'include', 'folders');
            if (result === true) return result; // file is in a folder inside the include-list
        }
        result = true;
        if (this.settings.exclude.selectedFiles.length>0) { // there are files in the exclude files list.
            result = this.filterFile(file, 'exclude', 'files');
            if (result === false) return result; // file is in exclude-list
        }        
        if (this.settings.exclude.selectedFolders.length>0) { // there are folders in the include folders list.
            result = this.filterFile(file, 'exclude', 'folders');
            if (result === false) return result; // file is in a folder inside the include-list
        }
        return result;
    }

    formatValue(value:any, type:string) {
        switch (type) {
            case 'text':
            case 'tags':
            case 'aliases':
            case 'multitext':
                return this.tools.toYamlSafeString(value);
            case 'date':
            case 'datetime':
                if (typeof value === 'number') {
                    return new Date(value).toISOString()
                } 
                return value.toString();
            case 'checkbox':
                return value ? 'true' : 'false';
            case 'number':
                return Number(value);
            default:
                return this.tools.toYamlSafeString(value);
        }
    }

    async updateFrontmatterParameters(eventName: 'create' | 'rename' | 'active-leaf-change', file: TFile, rules: FolderTagRuleDefinition[], oldPath?: string) {

        if (!this.checkIfFileAllowed(file)) {
            console.log(`file ${file.path} rejected!`)
            return;
        }
        const currentPathTag = this.formatTagName(this.tools.getFoldersFromPath(file.path));
        const oldPathTag = this.formatTagName(this.tools.getFoldersFromPath(oldPath))
        if (oldPathTag) console.log(`update file: "${oldPathTag}" to "${currentPathTag}"`);
        let content = await this.app.vault.read(file);
        const cache = this.app.metadataCache.getFileCache(file);
        //const frontmatter = cache?.frontmatter || {};
        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
           // apply all rules to frontmatter
            rules.forEach(rule => {
                frontmatter[rule.property] = executeRule(this.app, this.settings, file, frontmatter[rule.property], rule, oldPath);
            })

            // update folder tag
            if (eventName === 'create' || eventName === 'rename') {
                if (!frontmatter.hasOwnProperty('tags')) frontmatter.tags = [];
                if (frontmatter.tags === null) frontmatter.tags = [];
                let indexOldPath = frontmatter.tags.indexOf(oldPathTag);
                let indexNewPath = frontmatter.tags.indexOf(currentPathTag);
                if (oldPath) { 
                    if (frontmatter.tags.includes(oldPathTag)) {
                        if (currentPathTag!=='') {
                            frontmatter.tags.splice(indexOldPath,1,currentPathTag); // replace the tag
                            //console.log(`replace Tag "${oldPathTag}" [${indexOldPath}] by "${currentPathTag}"`,frontmatter.tags);
                        } else {
                            frontmatter.tags.splice(indexOldPath,1); // delete the tag
                            //console.log(`delete Tag "${oldPathTag}" [${indexOldPath}]`,frontmatter.tags);
                        }
                    } else {
                        if (currentPathTag!=='' && indexNewPath===-1) {
                            frontmatter.tags.push(currentPathTag); // add the tag
                            //console.log(`add Tag "${currentPathTag}" can't find "${oldPathTag}"`,frontmatter.tags);
                        }
                    }
                } else {
                    if (currentPathTag!=='') {
                        if (indexNewPath<0){ // new path doesn't exist
                            frontmatter.tags.push(currentPathTag); // add the tag
                            //console.log(`add Tag "${currentPathTag}"`,frontmatter.tags);
                        }
                    }
                }
                frontmatter.tags = this.tools.removeDuplicateStrings(frontmatter.tags);
            }
            console.log(`Frontmatter File ${file.path} update`, frontmatter);
        },{'mtime':file.stat.mtime}); // do not change the modify time.
        /*
        // rebuild frontmatter YAML
        let newFrontmatter = '---\n';
        Object.keys(frontmatter).forEach(key => {
            if (typeof frontmatter[key] === 'object') {
                if (Array.isArray(frontmatter[key])) {
                    newFrontmatter += `${this.tools.toYamlSafeString(key)}:\n`;
                    for (let item of frontmatter[key]) {
                        newFrontmatter += `  - ${this.formatValue(item, parameterTypes[key])}\n`;
                    }
                } else {
                    console.error("Can't write objects to YAML",key, frontmatter[key]);
                }
            } else {
                newFrontmatter += `${this.tools.toYamlSafeString(key)}: ${this.formatValue(frontmatter[key], parameterTypes[key])}\n`
            }
        })
        newFrontmatter += '---\n';

        let endOfFrontmatter = content.indexOf('---\n',3);
        content = newFrontmatter + content.slice(endOfFrontmatter+4);
        console.log(`[${eventName}] modifying file ${file.path}`,{'yaml': content});
        await this.app.vault.modify(file, content);
        */
    }

    private async updateFrontmatterTags(file: TFile, newTag: string | null, oldTagToRemove?: string) {
        let content = await this.app.vault.read(file);
        const cache = this.app.metadataCache.getFileCache(file);
        const frontmatter = cache?.frontmatter;
        
        // Get existing tags (handling both array and string formats)
        let existingTags: string[] = [];
        if (frontmatter && frontmatter[this.settings.tagsPropertyName]) {
            const tagsValue = frontmatter[this.settings.tagsPropertyName];
            if (Array.isArray(tagsValue)) {
                existingTags = tagsValue.filter(tag => tag != null).map(tag => String(tag));
            } else if (typeof tagsValue === 'string') {
                existingTags = tagsValue.split(/,\s*/)
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);
            }
        }

        // Remove any existing folder path tags (with current prefix)
        existingTags = existingTags.filter(tag => {
            if (tag == null) return false;
            if (!tag.startsWith(this.settings.tagPrefix)) return true;
            const tagWithoutPrefix = tag.slice(this.settings.tagPrefix.length);
            return !tagWithoutPrefix.includes('/');
        });

        // Specifically remove the old tag if provided
        if (oldTagToRemove) {
            existingTags = existingTags.filter(tag => tag !== oldTagToRemove);
        }

        // Add the new tag if provided and not already present
        if (newTag && !existingTags.includes(newTag)) {
            existingTags.push(newTag);
        }
        
        // Update or create frontmatter
        let newFrontmatter: any = {};
        if (frontmatter) {
            newFrontmatter = {...frontmatter};
            // Remove the old tags property to ensure proper formatting
            delete newFrontmatter[this.settings.tagsPropertyName];
        }
        
        // Reconstruct the frontmatter with proper YAML format
        let newContent = '';
        if (content.startsWith('---')) {
            // Replace existing frontmatter
            const frontmatterEnd = content.indexOf('---', 3) + 3;
            const bodyContent = content.slice(frontmatterEnd);
            
            // Build new frontmatter content
            let frontmatterContent = Object.entries(newFrontmatter)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
            
            // Add tags in proper YAML array format if we have any
            if (existingTags.length > 0) {
                frontmatterContent += `\n${this.settings.tagsPropertyName}:\n` +
                    existingTags.map(tag => `  - ${tag}`).join('\n');
            }
            
            newContent = `---\n${frontmatterContent}\n---${bodyContent}`;
        } else {
            // Only create frontmatter if we have tags to add
            if (existingTags.length > 0) {
                newContent = `---\n${this.settings.tagsPropertyName}:\n` +
                    existingTags.map(tag => `  - ${tag}`).join('\n') +
                    `\n---\n\n${content}`;
            } else {
                // No tags to add, return original content
                return;
            }
        }
        
        await this.app.vault.modify(file, newContent);
    }
}
