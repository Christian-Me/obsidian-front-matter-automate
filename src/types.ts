import { DirectoryDisplayMode, DirectorySelectionMode } from './directorySelectionModal';
import * as fmTools from './frontmatter-tools';

export const versionString = "0.0.16";

export type ObsidianPropertyTypes = "aliases"|"checkbox"|"date"|"datetime"|"multitext"|"number"|"tags"|"text";
export type FrontmatterAutomateEvents = 'create' | 'rename' | 'active-leaf-change' | 'delete' | 'modify' | 'preview' | 'all';

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
export interface FolderTagSettings {
    tagPrefix: string;
    excludeRootFolder: boolean;
    tagsPropertyName: string;
    spaceReplacement: string;
    specialCharReplacement: string;
    lowercaseTags: boolean;
    knownProperties: PropertyTypeInfo[];
    rules: FolderTagRuleDefinition[];
    liveRules: FolderTagRuleDefinition[];
    useTextArea: boolean;
    exclude: FilterFilesAndFolders;
    include: FilterFilesAndFolders;
    configuredProperties: Array<{ name: string; value: any }>;
}

export const DEFAULT_SETTINGS: FolderTagSettings = {
    tagPrefix: '',
    excludeRootFolder: false,
    tagsPropertyName: 'tags',
    spaceReplacement: '_',
    specialCharReplacement: '_',
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
    configuredProperties: []
};

export interface FolderTagRuleDefinition {
    id: string;
    active: boolean;
    addContent: 'overwrite' | 'start' | 'end';
    asLink: boolean;
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
    lowercaseTags: boolean;
    inputProperty: string;
    onlyModify: boolean;
    useCustomCode: boolean;
    optionConfig?:{};
}

export const DEFAULT_RULE_DEFINITION : FolderTagRuleDefinition = {
    id: '',
    active : true,
    asLink: false,
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
    lowercaseTags: false,
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