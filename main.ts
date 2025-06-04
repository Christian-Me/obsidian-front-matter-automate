import { App, Editor, Plugin, MarkdownView, MarkdownPostProcessor, PluginManifest, TFile, TFolder, Vault, parseFrontMatterTags, Notice} from 'obsidian';
import { FolderTagSettingTab } from './src/settings';
//import { FolderTagSettingTab } from './src/settings-properties';
import { checkIfFileAllowed, executeRuleObject } from './src/rules';
import { parseJSCode, ScriptingTools } from './src/tools';
import { versionString, FrontmatterAutomateSettings, DEFAULT_FRONTMATTER_AUTOMATE_SETTINGS, FrontmatterAutomateRuleSettings, PropertyTypeInfo} from './src/types'
import "./src/rules/index";
import { rulesManager } from './src/rules/rules';
import { DEBUG, ERROR, INFO, logger } from './src/Log';
import { log } from 'console';
import { TreeHierarchyData } from './src/uiTreeHierarchySortableSettings';
export default class FolderTagPlugin extends Plugin {
    settings!: FrontmatterAutomateSettings;
    private tools!: ScriptingTools;
    fileInProgress: TFile | null = null; // Track the file currently being processed
    preventOnMetadataChange: boolean = false; // Prevent metadata change events from triggering updates
    //private oldFolderPaths = new Map<string, string | null>();

    async onload() {
        await this.loadSettings();
        logger.log(INFO,`Front Matter Automate ${this.manifest.version} loaded with settings: `, this.settings);
        logger.setLevel(this.settings.debugLevel);
        this.tools = new ScriptingTools(this.app, this);
        rulesManager.init(this.app, this, this.tools);
        let noticeMessage = `Front Matter Automate ${this.manifest.version}\n loading ...`;
        const loadingNotice = new Notice(noticeMessage,0)

        noticeMessage = noticeMessage + '\n register events ...';
        loadingNotice.setMessage(noticeMessage);
        // File creation handler
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                logger.log(DEBUG,`Event creating file: ${file.path} starting in ${this.settings.delayCreateEvent}ms`);
                if (file instanceof TFile && file.extension === 'md') {
                    this.fileInProgress = file; // Set the file in progress
                    setTimeout(() => {
                        logger.log(DEBUG,`Event creating file started: `, file.path);
                        this.preventOnMetadataChange = true; // Prevent further metadata change events
                        this.updateFrontmatterParameters('create', file, this.settings.folderConfig);
                        this.preventOnMetadataChange = false; // Allow further metadata change events
                        this.fileInProgress = null; // Clear the file in progress after processing
                    }
                    , this.settings.delayCreateEvent);
                }
            })
        );

        // File rename/move handler
        this.registerEvent(
            this.app.vault.on('rename', (file, oldPath) => {
                if (this.fileInProgress) return; // Ignore if file is in progress
                this.preventOnMetadataChange = true; // Prevent further metadata change events
                if (file instanceof TFile && file.extension === 'md') {
                    this.updateFrontmatterParameters('rename', file, this.settings.folderConfig, oldPath);
                }
                this.preventOnMetadataChange = false; // Allow further metadata change events
            })
        );

        // File close handler
        /*
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (leaf?.view instanceof MarkdownView) {
                    const activeFile = this.app.workspace.getActiveFile();
                    logger.log(DEBUG,`Event active-leaf-change file: `, activeFile);
                    if (activeFile) this.updateFrontmatterParameters('active-leaf-change', activeFile, this.settings.rules);
                }
            })
        );
        */
        // Metadata changed handler
        this.registerEvent(
            this.app.metadataCache.on('changed', async (file, data, cache) => {
                if (this.preventOnMetadataChange) return; // Prevent processing during metadata changes
                if (this.fileInProgress) return; // Ignore if file is in progress
                if (!checkIfFileAllowed(file, this.settings)) {
                    logger.log(DEBUG,`file ${file.path} globally rejected!`)
                    return;
                }
                if (!(file instanceof TFile) || file.extension !== 'md') {
                    logger.log(DEBUG,`Event metadata changed: ${file.path} not a markdown file!`);
                    return;
                }
                this.preventOnMetadataChange = true; // Prevent further metadata change events
                if (file) this.updateFrontmatterParameters('metadata-changed', file, this.settings.folderConfig);
                this.preventOnMetadataChange = false; // Allow further metadata change events
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
        this.settings = Object.assign({}, DEFAULT_FRONTMATTER_AUTOMATE_SETTINGS, data);
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

    updateFrontmatterParameters(eventName: 'create' | 'rename' | 'active-leaf-change' | 'metadata-changed', file: TFile, ruleSettings: TreeHierarchyData, oldPath?: string) {
        if (!checkIfFileAllowed(file, this.settings)) {
            logger.log(DEBUG,`file ${file.path} globally rejected!`)
            return;
        }
        const currentPathTag = this.formatTagName(this.tools.getFolderFromPath(file.path));
        const oldPathTag = this.formatTagName(this.tools.getFolderFromPath(oldPath))
        const rules = ruleSettings?.rows.flatMap((row) => {
            if (row.folderId) {
                const folder = ruleSettings.folders.find((folder) => folder.id === row.folderId);
                if (!folder) {
                    row.folderId = undefined;
                    logger.log(ERROR,`Event ${eventName}: Folder with id ${row.folderId} not found for rule ${row.payload.content}!`);
                    return [row.payload as FrontmatterAutomateRuleSettings];
                }
                return !folder.disabled ? [row.payload as FrontmatterAutomateRuleSettings] : [];
            }
            return [row.payload as FrontmatterAutomateRuleSettings];
        }) ?? [];
        if (!rules || rules.length === 0) {
            logger.log(DEBUG,`Event ${eventName}: No rules found for file ${file.path}`);
            return; // No rules to apply
        }

        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
            // apply all rules to frontmatter
            logger.groupCollapsed(DEBUG,`Event ${eventName}: "${file.path}" ${rules.length}/${ruleSettings?.rows.length} active rules. Old file: "${oldPath}"`,frontmatter);
            let oldLocationResults: {ruleId: string, result: any}[] = [];

            if (oldPath && oldPath !== file.path) {
                logger.groupCollapsed(DEBUG,`Event ${eventName}: Collecting results for old file path: "${oldPath}"`);
                for (let rule of rules) {
                    if (!rule) continue;
                    let result = executeRuleObject(eventName, this.app, this, this.settings, this.tools.getMockFileFromPath(oldPath), frontmatter[rule.property], rule, frontmatter);
                    oldLocationResults.push({ ruleId: rule.id, result });
                }
                logger.log(DEBUG,`Old file path results:`, oldLocationResults);
                logger.groupEnd();
            }
            for (let rule of rules) {
                if (!rule) continue;
                let result = frontmatter[rule.property];
                logger.groupCollapsed(DEBUG,`Execute Rule: ${rule.property}(${rule.content})`,result, rule);
                if (!checkIfFileAllowed(file, this.settings, rule)) {
                    logger.log(DEBUG,`file ${file.path} rejected by rule (${rule.property}|${rule.content}) settings`);
                    logger.groupEnd();
                    continue; // only modify if file is allowed
                }
                if (rule.onlyModify && !frontmatter.hasOwnProperty(rule.property)) {
                    logger.log(DEBUG,`file "${file.path}" has not "${rule.property}"(Rule:${rule.content}) onlyModify set: skipped`);
                    logger.groupEnd();
                    continue; // only modify if property exists
                }
                switch (rulesManager.getRuleById(rule.content)?.ruleType) {
                    case 'buildIn':
                    case 'script':
                    case 'automation':
                        result = executeRuleObject(eventName, this.app, this, this.settings, file, frontmatter[rule.property], rule, frontmatter, oldLocationResults);
                        break;
                    default:
                }
                frontmatter[rule.property] = result;
                logger.groupEnd();
            }
            logger.log(DEBUG,'Frontmatter updated',frontmatter);
            logger.groupEnd();
        },{'mtime':file.stat.mtime}); // do not change the modify time.
    }
    /*
    async removeFrontmatterParamsFromAllFiles(rule: FrontmatterAutomateRuleSettings){
        let count = {files:0, items: 0}
        this.app.vault.getMarkdownFiles().forEach(file => {
            count.files++;
            this.removeFrontmatterParameter(file, rule, count);
        });
        return count;
    }

    async removeFrontmatterParameter(file: TFile, rule: FrontmatterAutomateRuleSettings, count) {
        if (!checkIfFileAllowed(file, this.settings, rule)) return;
        const currentPathTag = this.formatTagName(this.tools.getFolderFromPath(file.path));
        let content = await this.app.vault.read(file);
        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
            if (Array.isArray(frontmatter[rule.property])) count.items += frontmatter[rule.property].length;
            frontmatter[rule.property] = removeRule(this.app, this.settings, file, frontmatter[rule.property], rule, frontmatter);
            if (Array.isArray(frontmatter[rule.property])) count.items -= frontmatter[rule.property].length;
        },{'mtime':file.stat.mtime}); // do not change the modify time.
        return count;
    }
    */
}
