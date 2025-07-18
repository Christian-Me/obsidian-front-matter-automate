import { DirectoryDisplayMode, DirectorySelectionMode, DirectorySelectionState } from './uiDirectorySelectionModal';
import { TreeHierarchyData } from './uiTreeHierarchySortableSettings';
import { WARNING } from './Log';
import { AnyNsRecord } from 'dns';
import { MultiPropertyItem } from './uiMultiPropertySetting';

export const versionString = "0.0.26";

export type ObsidianPropertyTypes = "aliases"|"checkbox"|"date"|"datetime"|"multitext"|"number"|"tags"|"text";
export type FrontmatterAutomateEvents = 'create' | 'rename' | 'active-leaf-change' | 'metadata-changed' | 'delete' | 'modify' | 'preview' | 'all' | 'getOldResults';

export interface FilterFilesAndFolders {
    selectedFolders: string[],
    selectedFiles: string[],
    mode: DirectorySelectionMode,
    display: DirectoryDisplayMode
}

export const DEFAULT_FILTER_FILES_AND_FOLDERS: FilterFilesAndFolders = {
    selectedFolders: [],
    selectedFiles: [],
    mode: 'exclude',
    display: 'folders',
}
export interface FrontmatterAutomateSettings {
    tagPrefix: string;
    excludeRootFolder: boolean;
    tagsPropertyName: string;
    spaceReplacement: string;
    specialCharReplacement: string;
    lowercaseTags: boolean;
    knownProperties: PropertyTypeInfo[];
    rules: FrontmatterAutomateRuleSettings[];
    useTextArea: boolean;
    configuredProperties: Array<{ name: string; value: any }>;
    debugLevel: number;
    delayCreateEvent: number; // optional delay for create events
    folderConfig: TreeHierarchyData;
    stateIncludeExclude: DirectorySelectionState[]; // used to store the state of include/exclude for the settings
    displayIncludeExclude: DirectoryDisplayMode; // used to store the display mode for the rule
}

export const DEFAULT_FRONTMATTER_AUTOMATE_SETTINGS: FrontmatterAutomateSettings = {
    tagPrefix: '',
    excludeRootFolder: false,
    tagsPropertyName: 'tags',
    spaceReplacement: '',
    specialCharReplacement: '',
    lowercaseTags: false,
    knownProperties: [],
    rules: [],
    useTextArea: false,
    configuredProperties: [],
    debugLevel: WARNING,
    delayCreateEvent: 0, // default to no delay
    folderConfig: {folders: [], rows: []},
    stateIncludeExclude: [],
    displayIncludeExclude: 'folders',
};

export interface FrontmatterAutomateRuleSettings {
    id: string;
    active: boolean;
    addContent: 'overwrite' | 'start' | 'end';
    asLink: boolean; //deprecated
    property: string;
    value: string | number | boolean;
    customProperty: string;
    type: ObsidianPropertyTypes;
    typeProperty: PropertyTypeInfo | undefined;
    content: string;
    buildInCode: string;
    jsCode: string;
    showContent: boolean;
    prefix: string;
    spaceReplacement: string;
    specialCharReplacement: string;
    lowercaseTags: boolean; //deprecated
    //formatter: string; //deprecated
    formatters: MultiPropertyItem[]; //added
    linkFormatter: string; //added
    inputProperty: string;
    onlyModify: boolean;
    useCustomCode: boolean;
    optionsConfig: any | undefined; // used for custom code options, can be any type
    stateIncludeExclude: DirectorySelectionState[]; // used to store the state of include/exclude for the rule
    displayIncludeExclude: DirectoryDisplayMode; // used to store the display mode for the rule
}

export const DEFAULT_RULE_DEFINITION : FrontmatterAutomateRuleSettings = {
    id: '',
    active : true,
    asLink: false, //deprecated
    addContent: 'overwrite',
    property : '',
    value: '',
    customProperty : '',
    type: 'text',
    typeProperty: {name:'',type:'text', source:'registered'},
    content: '',
    buildInCode: '',
    jsCode: '',
    showContent: false,
    prefix: '',
    spaceReplacement: '',
    specialCharReplacement: '',
    lowercaseTags: false, //deprecated
    //formatter: 'toOriginal', //deprecated
    formatters: [{id:'toOriginal', name:'toOriginal', payload: {}}],
    linkFormatter: 'toOriginalLink',
    inputProperty: '',
    onlyModify: true,
    useCustomCode: false,
    optionsConfig: undefined,
    stateIncludeExclude: [],
    displayIncludeExclude: 'folders',
}

export type PropertyInfo = {
    name: string;
    type: ObsidianPropertyTypes;
    count?: number;
};

export type PropertyTypeInfo = {
    name: string;
        type: ObsidianPropertyTypes;
    count?: number;
    isArray?: boolean;
    values?: string[];
    source: 'registered' | 'inferred';
};

export type PropertyType = {
    type: string;
    icon: string;
    jsType: string;
};