import { App, Editor, Plugin, MarkdownView, MarkdownPostProcessor, PluginManifest, TFile, TFolder, Vault, parseFrontMatterTags, Notice} from 'obsidian';
import { FolderTagSettingTab } from './src/settings';
//import { FolderTagSettingTab } from './src/settings-properties';
import { executeRule, removeRule, ruleFunctions } from './src/rules';
import { parseJSCode, ScriptingTools } from './src/tools';
import { versionString, FolderTagSettings, DEFAULT_SETTINGS, FolderTagRuleDefinition, PropertyTypeInfo} from './src/types'

export default class FolderTagPlugin extends Plugin {
    settings: FolderTagSettings;
    private tools: ScriptingTools;
    //private oldFolderPaths = new Map<string, string | null>();

    async onload() {
        await this.loadSettings();
        this.tools = new ScriptingTools(this.settings);
        let noticeMessage = `Front Matter Automate ${versionString}\n loading ...`;
        const loadingNotice = new Notice(noticeMessage,0)

        noticeMessage = noticeMessage + '\n register events ...';
        loadingNotice.setMessage(noticeMessage);
        // File creation handler
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile && file.extension === 'md') {
                    this.updateFrontmatterParameters('create', file, this.settings.rules);
                }
            })
        );

        // File rename/move handler
        this.registerEvent(
            this.app.vault.on('rename', (file, oldPath) => {
                if (file instanceof TFile && file.extension === 'md') {
                    this.updateFrontmatterParameters('rename', file, this.settings.rules, oldPath);
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

        // Metadata changed handler
        this.registerEvent(
            this.app.metadataCache.on('changed', (file, data, cache) => {
                if (cache.frontmatter && Array.isArray(this.settings.liveRules)) {
                    this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                    // apply all live rules to frontmatter
                    this.settings.liveRules.forEach(rule => {
                        if (rule.onlyModify && !frontmatter.hasOwnProperty(rule.property)) return; // only modify if property exists
                        if (cache.frontmatter)
                            frontmatter[rule.property] = executeRule(this.app, this.settings, file, cache.frontmatter[rule.property], rule, cache.frontmatter);
                            console.log(frontmatter[rule.property]);
                        })
                     },{'mtime':file.stat.mtime}); // do not change the modify time.
                };
            })
        );
            
        noticeMessage = noticeMessage + '\n initial processing ...';
        loadingNotice.setMessage(noticeMessage);

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
                if (rule.onlyModify && !frontmatter.hasOwnProperty(rule.property)) return; // only modify if property exists
                frontmatter[rule.property] = executeRule(this.app, this.settings, file, frontmatter[rule.property], rule, frontmatter, oldPath);
            })
        },{'mtime':file.stat.mtime}); // do not change the modify time.
    }
    
    async removeFrontmatterParamsFromAllFiles(rule: FolderTagRuleDefinition){
        let count = {files:0, items: 0}
        this.app.vault.getMarkdownFiles().forEach(file => {
            count.files++;
            this.removeFrontmatterParameter(file, rule, count);
        });
        return count;
    }

    async removeFrontmatterParameter(file: TFile, rule: FolderTagRuleDefinition, count) {
        if (!this.checkIfFileAllowed(file)) return;
        const currentPathTag = this.formatTagName(this.tools.getFoldersFromPath(file.path));
        let content = await this.app.vault.read(file);
        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
            if (Array.isArray(frontmatter[rule.property])) count.items += frontmatter[rule.property].length;
            frontmatter[rule.property] = removeRule(this.app, this.settings, file, frontmatter[rule.property], rule, frontmatter);
            if (Array.isArray(frontmatter[rule.property])) count.items -= frontmatter[rule.property].length;
        },{'mtime':file.stat.mtime}); // do not change the modify time.
        return count;
    }
}
