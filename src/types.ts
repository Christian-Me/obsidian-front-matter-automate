import * as fmTools from './frontmatter-tools';

export const versionString = "0.0.5";

export interface FolderTagSettings {
    tagPrefix: string;
    excludeRootFolder: boolean;
    tagsPropertyName: string;
    spaceReplacement: string;
    specialCharReplacement: string;
    lowercaseTags: boolean;
    knownProperties: PropertyTypeInfo[];
    rules: FolderTagRuleDefinition[];
    useTextArea: boolean;
    exclude: {
        selectedFolders: string[],
        selectedFiles: string[],
        mode: 'include' | 'exclude',
        display: 'folder' | 'files'
    };
    include: {
        selectedFolders: string[],
        selectedFiles: string[],
        mode: 'include' | 'exclude',
        display: 'folder' | 'files'
    };
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
    useTextArea: false,
    exclude: {
        selectedFolders: [],
        selectedFiles: [],
        mode: 'exclude',
        display: 'folder',
    },
    include: {
        selectedFolders: [],
        selectedFiles: [],
        mode: 'include',
        display: 'folder',
    },
    configuredProperties: [],
};

export interface FolderTagRuleDefinition {
    id: string;
    active: boolean;
    property: string;
    customProperty: string;
    type: string | undefined;
    typeProperty: PropertyTypeInfo | undefined;
    content: string;
    buildInCode: string;
    jsCode: string;
    showContent: boolean;
}

export const DEFAULT_RULE_DEFINITION : FolderTagRuleDefinition = {
    id: '',
    active : true,
    property : '',
    customProperty : '',
    type: 'string',
    typeProperty: {name:'',type:'', source:'registered'},
    content: '',
    buildInCode: '',
    jsCode: '',
    showContent: false,
}

export type PropertyTypeInfo = {
    name: string;
    type: string;
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