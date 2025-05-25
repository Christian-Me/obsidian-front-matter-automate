import { DirectoryDisplayMode, DirectorySelectionMode } from './directorySelectionModal';
import { WARNING } from './Log';

export const versionString = "0.0.23";

export type ObsidianPropertyTypes = "aliases"|"checkbox"|"date"|"datetime"|"multitext"|"number"|"tags"|"text";
export type FrontmatterAutomateEvents = 'create' | 'rename' | 'active-leaf-change' | 'metadata-changed' | 'delete' | 'modify' | 'preview' | 'all';

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
    liveRules: FrontmatterAutomateRuleSettings[];
    useTextArea: boolean;
    exclude: FilterFilesAndFolders;
    include: FilterFilesAndFolders;
    configuredProperties: Array<{ name: string; value: any }>;
    debugLevel: number;
    delayCreateEvent: number; // optional delay for create events
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
    liveRules: [],
    useTextArea: false,
    exclude: {
        selectedFolders: [],
        selectedFiles: [],
        mode: 'exclude',
        display: 'folders',
    },
    include: {
        selectedFolders: [],
        selectedFiles: [],
        mode: 'include',
        display: 'folders',
    },
    configuredProperties: [],
    debugLevel: WARNING,
    delayCreateEvent: 0, // default to no delay
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
    exclude: FilterFilesAndFolders;
    include: FilterFilesAndFolders;
    prefix: string;
    spaceReplacement: string;
    specialCharReplacement: string;
    lowercaseTags: boolean; //deprecated
    formatter: string; //deprecated
    formatters: string[]; //added
    linkFormatter: string; //added
    inputProperty: string;
    onlyModify: boolean;
    useCustomCode: boolean;
    optionConfig?:{};
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
    exclude: {
        selectedFolders: [],
        selectedFiles: [],
        mode: 'exclude',
        display: 'folders',
    },
    include: {
        selectedFolders: [],
        selectedFiles: [],
        mode: 'include',
        display: 'folders',
    },
    prefix: '',
    spaceReplacement: '',
    specialCharReplacement: '',
    lowercaseTags: false, //deprecated
    formatter: 'toOriginal', //deprecated
    formatters: ['toOriginal'],
    linkFormatter: 'toOriginalLink',
    inputProperty: '',
    onlyModify: true,
    useCustomCode: false,
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