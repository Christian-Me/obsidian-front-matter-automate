import { App, Plugin, PluginManifest, TFile, TFolder, Vault, TextComponent, DropdownComponent, Notice} from 'obsidian';
import * as fmTools from './src/frontmatter-tools';
import { FolderTagSettingTab } from './src/settings';
import { ruleFunctions } from './src/rules';
import { parseJSCode, ScriptingTools } from './src/tools';
import { FolderTagSettings, DEFAULT_SETTINGS, FolderTagRuleDefinition, PropertyTypeInfo} from './src/types'
import { runInContext } from 'vm';

export default class FolderTagPlugin extends Plugin {
    settings: FolderTagSettings;
    private oldFolderPaths = new Map<string, string | null>();
    scriptingTools: ScriptingTools;
    
    async onload() {
        await this.loadSettings();
        this.scriptingTools = new ScriptingTools(this.settings);
        let noticeMessage = 'Property Updater Tools\n loading ...';
        const loadingNotice = new Notice(noticeMessage,0)

        // Store initial folder paths for all files
        this.app.vault.getMarkdownFiles().forEach(file => {
            this.oldFolderPaths.set(file.path, this.getFolderPathForTag(file));
        });
        noticeMessage = noticeMessage + '\n register events ...';
        loadingNotice.setMessage(noticeMessage);
        // File creation handler
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile && file.extension === 'md') {
                    this.oldFolderPaths.set(file.path, this.getFolderPathForTag(file));
                    this.updateFileTag(file);
                    this.updateFrontmatterParameters(file, this.settings.rules);
                }
            })
        );

        // File rename/move handler
        this.registerEvent(
            this.app.vault.on('rename', (file, oldPath) => {
                if (file instanceof TFile && file.extension === 'md') {
                    const oldTagPath = this.oldFolderPaths.get(oldPath) ?? null;
                    const newTagPath = this.getFolderPathForTag(file);
                    this.oldFolderPaths.set(file.path, newTagPath);
                    
                    // Always update when moving to/from root folder
                    if (oldTagPath !== newTagPath || 
                        (oldTagPath !== null && newTagPath === null) || 
                        (oldTagPath === null && newTagPath !== null)) {
                        this.updateFileTag(file, oldTagPath);
                        this.updateFrontmatterParameters(file, this.settings.rules);
                    }
                }
            })
        );
        noticeMessage = noticeMessage + '\n initial processing ...';
        loadingNotice.setMessage(noticeMessage);
        // Initial processing of existing files
        this.app.vault.getMarkdownFiles().forEach(file => {
            this.updateFileTag(file);
            this.updateFrontmatterParameters(file, this.settings.rules);
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

    private formatTagName(name: string | null): string | null {
        if (!name) return null;
        
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

    async updateFrontmatterParameters(file: TFile, rules: FolderTagRuleDefinition[]) {
        function formatValue(value:any, type:string) {
            switch (type) {
                case 'text':
                    return `"${value.toString().replaceAll('"',"\u0022")}"`;
                case 'tags':
                    return value.toString();
                case 'aliases':
                    return value.toString();
                case 'date':
                    return value.toString();
                case 'datetime':
                    return value.toString();
                case 'multitext':
                    return `"${value.toString().replaceAll('"',"\u0022")}"`
                case 'checkbox':
                    return value ? 'true' : 'false';
                case 'number':
                    return value;
                default:
                    return value;
            }
        }

        let content = await this.app.vault.read(file);
        const cache = this.app.metadataCache.getFileCache(file);
        const frontmatter = cache?.frontmatter || {};
        let newFrontmatter = '---\n';
        let fxResult:any;
        const parameterTypes = {}

        rules.forEach(rule => {
            if (rule.content === 'script') {
                const ruleFunction = parseJSCode(rule.jsCode);
                if (typeof ruleFunction !== 'function') return;
                fxResult = ruleFunction(this.app, file, this.scriptingTools);
            } else {
                const functionIndex = ruleFunctions.findIndex(fx => fx.id === rule.content);
                if (functionIndex!==-1){
                    //console.log(`execute rule for ${rule.property} ${rule.content} for file ${file.path}`);
                    fxResult = ruleFunctions[functionIndex].fx(this.app, file, this.scriptingTools);
                    //console.log(rule.content, ruleFunctions[functionIndex] ? fxResult : '');
                }
            }
            frontmatter[rule.content] = fxResult; // update or add the new value
            parameterTypes[rule.content] = rule.type;
        })
  
        // rebuild frontmatter YAML
        Object.keys(frontmatter).forEach(key => {
            if (typeof frontmatter[key] === 'object') {
                if (Array.isArray(frontmatter[key])) {
                    newFrontmatter += `${key}:\n`;
                    for (let item of frontmatter[key]) {
                        newFrontmatter += `  - ${formatValue(item, parameterTypes[key])}\n`;
                    }
                }
            } else {
                newFrontmatter += `${key}: ${formatValue(frontmatter[key], parameterTypes[key])}\n`
            }
        })
        newFrontmatter += '---\n';

        let endOfFrontmatter = content.indexOf('---\n',3);
        content = newFrontmatter + content.slice(endOfFrontmatter+4);
        //console.log(content);
        await this.app.vault.modify(file, content);
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
