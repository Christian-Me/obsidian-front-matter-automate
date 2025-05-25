import { App, Editor, Plugin, MarkdownView, MarkdownPostProcessor, PluginManifest, TFile, TFolder, Vault, parseFrontMatterTags, Notice} from 'obsidian';
import { FolderTagSettingTab } from './src/settings';
//import { FolderTagSettingTab } from './src/settings-properties';
import { checkIfFileAllowed, executeRuleObject } from './src/rules';
import { parseJSCode, ScriptingTools } from './src/tools';
import { versionString, FrontmatterAutomateSettings, DEFAULT_FRONTMATTER_AUTOMATE_SETTINGS, FrontmatterAutomateRuleSettings, PropertyTypeInfo} from './src/types'
import "./src/rules/index";
import { rulesManager } from './src/rules/rules';
import { DEBUG, INFO, logger } from './src/Log';
import { log } from 'console';
export default class FolderTagPlugin extends Plugin {
    settings!: FrontmatterAutomateSettings;
    private tools!: ScriptingTools;
    fileInProgress: TFile | null = null; // Track the file currently being processed
    //private oldFolderPaths = new Map<string, string | null>();

    async onload() {
        await this.loadSettings();
        logger.log(INFO,`Front Matter Automate ${versionString} loaded with settings: `, this.settings);
        logger.setLevel(this.settings.debugLevel);
        this.tools = new ScriptingTools(this.app, this);
        rulesManager.init(this.app, this, this.tools);
        let noticeMessage = `Front Matter Automate ${versionString}\n loading ...`;
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
                        this.updateFrontmatterParameters('create', file, this.settings.rules);
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
                if (file instanceof TFile && file.extension === 'md') {
                    logger.log(DEBUG,`Event renaming file: `, file.path);
                    this.updateFrontmatterParameters('rename', file, this.settings.rules, oldPath);
                }
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
                if (this.fileInProgress) return; // Ignore if file is in progress
                if (!checkIfFileAllowed(file, this.settings)) {
                    logger.log(DEBUG,`file ${file.path} globally rejected!`)
                    return;
                }
                if (!(file instanceof TFile) || file.extension !== 'md') {
                    logger.log(DEBUG,`Event metadata changed: ${file.path} not a markdown file!`);
                    return;
                }
                logger.groupCollapsed(DEBUG,`Event metadata changed: ${file.path} `);
                if (file) this.updateFrontmatterParameters('metadata-changed', file, this.settings.rules);
                logger.groupEnd();
                /*
                if (cache.frontmatter && Array.isArray(this.settings.liveRules) && this.settings.liveRules.length > 0) {
                    logger.log(DEBUG,`Event metadata changed: ${file.path} ${this.settings.liveRules.length} rules live`);
                    // apply all live rules to frontmatter
                    this.app.fileManager.processFrontMatter(file, async (frontmatter) => {
                        for (const rule of this.settings.liveRules)  {
                            if (checkIfFileAllowed(file, this.settings, rule)){
                                if (rule.onlyModify && !frontmatter.hasOwnProperty(rule.property)) continue; // only modify if property exists
                                let result = executeRuleObject('modify',this.app, this.settings, file, frontmatter[rule.property], rule, frontmatter);
                                if (result) frontmatter[rule.property] = result;
                                logger.log(DEBUG,` Done: rule '${rule.property}'(${rule.content}) File ${file.path} result: `, result, frontmatter[rule.property], frontmatter);
                            } else {
                                logger.log(DEBUG,`file ${file.path} rejected by rule ${rule.content}!`)
                            }
                        }
                    },{'mtime':file.stat.mtime}); // do not change the modify time.
                };
                */
            })
        );
            
        noticeMessage = noticeMessage + '\n initial processing ...';
        loadingNotice.setMessage(noticeMessage);
        this.settings.liveRules = [];
        this.settings.rules.forEach(rule => {
            let ruleFunction = rulesManager.getRuleById(rule.content);
            if (!ruleFunction) return;
            switch (ruleFunction.ruleType) {
                case 'autocomplete.modal':
                case 'buildIn.inputProperty':
                case 'automation':
                    this.settings.liveRules.push(rule);
                    break
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

    updateFrontmatterParameters(eventName: 'create' | 'rename' | 'active-leaf-change' | 'metadata-changed', file: TFile, rules: FrontmatterAutomateRuleSettings[], oldPath?: string) {
        if (!checkIfFileAllowed(file, this.settings)) {
            logger.log(DEBUG,`file ${file.path} globally rejected!`)
            return;
        }
        const currentPathTag = this.formatTagName(this.tools.getFolderFromPath(file.path));
        const oldPathTag = this.formatTagName(this.tools.getFolderFromPath(oldPath))

        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
            // apply all rules to frontmatter
            logger.groupCollapsed(DEBUG,`Event ${eventName}: ${file.path} ${rules.length} rules`,frontmatter);
            for (let rule of rules) {
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
                        result = executeRuleObject(eventName, this.app, this, this.settings, file, frontmatter[rule.property], rule, frontmatter, oldPath);
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
