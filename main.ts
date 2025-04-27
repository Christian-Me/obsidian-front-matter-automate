import { App, Editor, Plugin, MarkdownView, MarkdownPostProcessor, PluginManifest, TFile, TFolder, Vault, parseFrontMatterTags, Notice} from 'obsidian';
import { FolderTagSettingTab } from './src/settings';
//import { FolderTagSettingTab } from './src/settings-properties';
import { checkIfFileAllowed, executeRule, getRuleFunctionById, removeRule, ruleFunctions } from './src/rules';
import { parseJSCode, ScriptingTools } from './src/tools';
import { versionString, FolderTagSettings, DEFAULT_SETTINGS, FolderTagRuleDefinition, PropertyTypeInfo} from './src/types'

export default class FolderTagPlugin extends Plugin {
    settings: FolderTagSettings;
    private tools: ScriptingTools;
    //private oldFolderPaths = new Map<string, string | null>();

    async onload() {
        await this.loadSettings();
        this.tools = new ScriptingTools(this.app, this);;
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
                    // console.log(`closing file: `, activeFile?.path);
                    if (activeFile) this.updateFrontmatterParameters('active-leaf-change', activeFile, this.settings.rules);
                }
            })
        );

        // Metadata changed handler
        this.registerEvent(
            this.app.metadataCache.on('changed', (file, data, cache) => {
                console.log(`metadata changed: `, file.path);
                if (cache.frontmatter && Array.isArray(this.settings.liveRules)) {
                    this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                    // apply all live rules to frontmatter
                    this.settings.liveRules.forEach(rule => {
                        if (rule.onlyModify && !frontmatter.hasOwnProperty(rule.property)) return; // only modify if property exists
                        if (cache.frontmatter)
                            frontmatter[rule.property] = executeRule('modify',this.app, this.settings, file, cache.frontmatter[rule.property], rule, cache.frontmatter);
                            //console.log(frontmatter[rule.property]);
                        })
                     },{'mtime':file.stat.mtime}); // do not change the modify time.
                };
            })
        );
            
        noticeMessage = noticeMessage + '\n initial processing ...';
        loadingNotice.setMessage(noticeMessage);
        this.settings.rules.forEach(rule => {
            let ruleFunction = getRuleFunctionById(rule.content);
            if (!ruleFunction) return;
            if (ruleFunction.inputProperty) {
                this.settings.liveRules.push(rule);
            } else if (ruleFunction.ruleType === 'autocomplete.modal') {
                this.settings.liveRules.push(rule);
            }
            
        })
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
        if (!checkIfFileAllowed(file, this.settings)) {
            console.log(`file ${file.path} globally rejected!`)
            return;
        }
        const currentPathTag = this.formatTagName(this.tools.getFoldersFromPath(file.path));
        const oldPathTag = this.formatTagName(this.tools.getFoldersFromPath(oldPath))
        // if (oldPathTag) console.log(`update file: "${oldPathTag}" to "${currentPathTag}"`);
        // let content = await this.app.vault.read(file);
        // const cache = this.app.metadataCache.getFileCache(file);

        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
           // apply all rules to frontmatter
            rules.forEach(rule => {
                if (!checkIfFileAllowed(file, this.settings, rule)) return;
                if (rule.onlyModify && !frontmatter.hasOwnProperty(rule.property)) return; // only modify if property exists
                frontmatter[rule.property] = executeRule(eventName, this.app, this.settings, file, frontmatter[rule.property], rule, frontmatter, oldPath);
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
        if (!checkIfFileAllowed(file, this.settings, rule)) return;
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
