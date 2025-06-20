import { RulePrototype, rulesManager } from "./rules";
import { ScriptingTools } from "../tools";
import { FrontmatterAutomateRuleSettings } from "../types";
import { App, SearchComponent, Setting, TFile } from "obsidian";
import { FolderSuggest } from "../suggesters/FolderSuggester";
import { DirectorySelectionResult, openDirectorySelectionModal } from "../uiDirectorySelectionModal";
import { FileSuggest } from "../suggesters/FileSuggester";
import { AlertModal } from "../alertBox";
import { DEBUG, ERROR, logger, TRACE } from "../Log";

export class RuleAutomationAutoLink extends RulePrototype {
    constructor() {
        super();
        this.id = 'autoLink';
        this.name = 'Auto Link (advanced)';
        this.description = 'Checks if a link exists in a specified folder. If not, it creates a new file based on a specified template and adds a link to it.';
        this.ruleType = 'automation';
        this.source = "function (app, file, tools) { // do not change this line!\n  let result = '';\n  return result;\n}";
        this.type = ['text', 'multitext'];
        this.configElements = this.defaultConfigElements({removeContent: false,  inputProperty: false, addPrefix: false, spaceReplacement: false, specialCharacterReplacement: false, convertToLowerCase: false, resultAsLink: false, script: false});
    };

    async createNewFile (app: App, file: TFile, tools: ScriptingTools) {
    }
    /**
     * Function to create a link to a file. If the file does not exist, it creates a new file based on a template.
     * @param app - The Obsidian app instance.
     * @param file - The current file.
     * @param tools - The scripting tools instance.
     * @returns The new content for the frontmatter property.
     */
    fx (app:App, file:TFile, tools:ScriptingTools) { // do not change this line!
        const currentContent = tools.getCurrentContent();
        let newContent = new Array<string>();
        const rule = tools.getRule();
        if (!rule) {
            logger.log(ERROR,`autoLink: rule not found, returning current content ${currentContent}`);
            return currentContent;
        } 
        const options = tools.getOptionConfig(rule.id);
        const filesToCheck = tools.getFilesInVault(options.destinationFolder);
        let links = currentContent || [];
        if (typeof links === 'object' && !Array.isArray(links)) {
            links = []; // convert object to array
        } else if (typeof links === 'string') {
            links = [links]; // convert to array if not already an array
        }
        // logger.log(DEBUG,`autoLink: links to check`, links, filesToCheck);
        
        for (const part of links)  {
            let link = tools.extractLinkParts(part);
            let linkFile = tools.getTFileFromPath(link.path, filesToCheck);
            if (!linkFile) { // create new File
                if (options.askConfirmation) {
                    new AlertModal(app, 'Create new file', `File ${link.path} does not exist. Do you want to create it?`, 'Create', 'Cancel', "Don't ask again.").openAndGetValue()
                        .then(async (result: { proceed: boolean, data: { askConfirmation: boolean } }) => {
                            logger.log(DEBUG,`autoLink: user confirmed to create new file "${link.path}"`, result); 
                            if (!result) return; // user cancelled
                            if (!result.proceed) return; // do not create the file if the user does not confirm
                            options.askConfirmation = !result.data.askConfirmation;
                            link.path = options.destinationFolder + '/' + link.title + '.md'; // add the destination folder to the link path
                            linkFile = await tools.createFileFromPath(link.path, options.addTemplate ? options.templateFile : undefined); // create the file if it does not exist
                            newContent.push(`[[${tools.removeLeadingSlash(link.path)}|${link.title}]]`); // add the file path to the new content
                            logger.log(DEBUG,`autoLink: returning (after askConfirmation) "${newContent}"`);
                            return newContent;
                        });
                };
                link.path = options.destinationFolder + '/' + link.title + '.md'; // add the destination folder to the link path
                logger.log(TRACE,`autoLink: creating new file "${link.path}"`);
                tools.createFileFromPath(link.path, options.addTemplate ? options.templateFile : undefined)
                    .then((newFile) => {
                        newContent.push(`[[${tools.removeLeadingSlash(newFile.path)}|${newFile.name}]]`); // add the file path to the new content
                        logger.log(DEBUG,`autoLink: new file created "${newFile.path}" returning "${newContent}"`);
                        return newContent;
                    });
            }
            if (linkFile) {
                logger.log(DEBUG,`autoLink: creating Link to existing File "${linkFile.path}"`);
                link.path = linkFile.path;
                newContent.push(`[[${tools.removeLeadingSlash(link.path)}|${link.title}]]`); // add the file path to the new content
            }
        }
        logger.log(DEBUG,`autoLink: returning "${newContent}"`);
        return newContent;    
    };

    configTab (optionEL: HTMLElement, rule:FrontmatterAutomateRuleSettings, that:any, previewComponent: any) {
        // Create a setting for the auto link
        that.setOptionConfigDefaults(rule.id, {
            addTemplate: true,
            askConfirmation: true,
            destinationFolder: '/',
            templateFile: '',
        })

        new Setting(optionEL)
            .setName('Add template to new files')
            .setDesc('Automatically add template to new files')
            .addToggle(toggle => toggle
                .setValue(that.getOptionConfig(rule.id ,'addTemplate') || false)
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'addTemplate', value);
                }));

        new Setting(optionEL)
            .setName('Ask for confirmation')
            .setDesc('Ask for confirmation before creating new files')
            .addToggle(toggle => toggle
                .setValue(that.getOptionConfig(rule.id ,'askConfirmation') || false)
                .onChange(async (value) => {
                    that.setOptionConfig(rule.id,'askConfirmation', value);
                }));

        let destinationFolderEl:SearchComponent;  
        new Setting(optionEL)
            .setName('Destination Folder')
            .setDesc('Folder to place new files')
            .addSearch((cb) => {
                destinationFolderEl = cb;
                new FolderSuggest(that.app, cb.inputEl);
                cb.setPlaceholder("enter folder or browse ...")
                    .setValue(that.getOptionConfig(rule.id ,'destinationFolder') || '')
                    .onChange((newFolder) => {
                        newFolder = newFolder.trim()
                        newFolder = newFolder.replace(/\/$/, "");
                        that.setOptionConfig(rule.id,'destinationFolder', newFolder);
                    });
                // @ts-ignore
                cb.containerEl.addClass("frontmatter-automate-search");
            })
            .addExtraButton((button) =>
            button
                .setIcon('folder-tree')
                .setTooltip('Select template folder')
                .onClick(async () => {
                openDirectorySelectionModal(
                    that.app,
                    [that.getOptionConfig(rule.id ,'destinationFolder')],
                    [],
                    { 
                        title: 'Select folder to place new files',
                        selectionMode: 'include',
                        displayMode: 'folder',
                        optionSelectionMode: false,
                        optionShowFiles: false,
                    },
                    (result: DirectorySelectionResult | null) => {
                        if (!result) return;
                        if (result.folders.length === 0 || !result.folders[0] || typeof result.folders[0] !== 'string') return;
                        let selectedFolder = result.folders[0].trim().replace(/\/$/, ""); // remove leading and trailing slashes (/^\/|\/$/g, "")
                        if (selectedFolder === '') selectedFolder = '/'; // if empty, set to root folder
                        if (!selectedFolder) return;
                        destinationFolderEl.setValue(selectedFolder);
                        that.setOptionConfig(rule.id,'destinationFolder', selectedFolder);
                    }
                );
                })
            );
        
        let destinationFileEl:SearchComponent;  
        new Setting(optionEL)
            .setName('Template File')
            .setDesc('Select a template file to add to new files')
            .addSearch((cb) => {
                destinationFileEl = cb;
                new FileSuggest(cb.inputEl, that.plugin, '');
                cb.setPlaceholder("enter folder or browse ...")
                    .setValue(that.getOptionConfig(rule.id ,'templateFile') || '')
                    .onChange((newFile) => {
                        newFile = newFile.trim()
                        newFile = newFile.replace(/\/$/, "");
                        that.setOptionConfig(rule.id,'templateFile', newFile);
                    });
                // @ts-ignore
                cb.containerEl.addClass("frontmatter-automate-search");
            })
            .addExtraButton((button) =>
                button
                .setIcon('folder-tree')
                .setTooltip('Select template file')
                .onClick(async () => {
                openDirectorySelectionModal(
                    that.app,
                    [],
                    [that.getOptionConfig(rule.id,'templateFile')],
                    { 
                        title: 'Select template for new files',
                        selectionMode: 'include',
                        displayMode: 'file',
                        optionSelectionMode: false,
                        optionShowFiles: true,
                    },
                    (result: DirectorySelectionResult | null) => {
                        if (!result) return;
                        if (result.files.length === 0 || !result.files[0] || typeof result.files[0] !== 'string') return;
                        let selectedFile = result.files[0].trim().replace(/\/$/, "");
                        if (!selectedFile) return;
                        destinationFileEl.setValue(selectedFile);
                        that.setOptionConfig(rule.id,'templateFile', selectedFile);
                    }
                );
                })
            );
    }
}
