import { App, Notice, SuggestModal, TFile } from 'obsidian';
import { PropertyTypeInfo, PropertyType} from './types';

export const DEFAULT_PROPERTY_TYPE_INFO: PropertyTypeInfo = {
    name : "",
    type : "",
    isArray: false,
    values: [],
    source: 'registered',
};

/**
 * Gets all available properties with their type information
 * @param app The Obsidian App instance
 * @returns Promise that resolves to an array of PropertyTypeInfo
 */
export async function getAllPropertiesWithTypes(app: App): Promise<PropertyTypeInfo[]> {
    // Try to get registered properties (fallback to empty array if API changed)
    const registeredProps = await getRegisteredPropertiesSafe(app);
    
    // Get additional properties found in notes
    const fileProps = await getPropertiesFromFiles(app);
    
    // Combine results (favor registered properties when duplicates exist)
    const combined = new Map<string, PropertyTypeInfo>();
    
    // Add properties found in files first
    fileProps.forEach(prop => {
        combined.set(prop.name, prop);
    });
    
    // Then override with registered properties (which have more complete type info)
    registeredProps.forEach(prop => {
        combined.set(prop.name, prop);
    });
    
    return Array.from(combined.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get Properties from MetadataManager
 */
export function getPropertiesFromMetadataManager(app: App): PropertyTypeInfo[] {
    try {
        const metadataManager = (app as any).metadataTypeManager;
        console.log("get properties:",metadataManager);
        return Object.values(metadataManager.properties).map( (value:any):PropertyTypeInfo => ({
            name: value.name,
            type: value.type,
            count: value.count,
            source: 'registered'
        })).sort((a, b) => a.name.localeCompare(b.name));

    } catch (e) {
        console.error("Couldn't access properties from Metadata Manager", e);
        return [];
    }
}
/**
 * Get Types from MetadataManager
 */
export function getTypesFromMetadataManager(app: App): any {
    try {
        const metadataManager = (app as any).metadataTypeManager;
        console.log("get types:",metadataManager);
        return Object.values(metadataManager.registeredTypeWidgets).map( (value:any, index, array):PropertyType  => ({
            type: value.type,
            icon: value.icon,
            jsType: '',
        })).sort((a, b) => a.type.localeCompare(b.type));

    } catch (e) {
        console.error("Couldn't access properties from Metadata Manager", e);
        return [];
    }
}
/**
 * Safe method to get registered properties that won't throw if API changes
 */
async function getRegisteredPropertiesSafe(app: App): Promise<PropertyTypeInfo[]> {
    try {
        const metadataManager = (app as any).metadataTypeManager;
        console.log(metadataManager);
        if (!metadataManager) return [];
        
        // Try different ways to get properties based on Obsidian version
        if (typeof metadataManager.getAllFrontmatterTypes === 'function') {
            // Older Obsidian versions
            const frontmatterTypes = metadataManager.getAllFrontmatterTypes();
            return frontmatterTypes.map((name: string) => ({
                name,
                type: 'string', // Default type if we can't get more info
                source: 'registered'
            }));
        } else if (typeof metadataManager.getProperties === 'function') {
            // Newer Obsidian versions might use this
            const properties = metadataManager.getProperties();
            return Object.entries(properties).map(([name, type]: [string, any]) => ({
                name,
                type: typeof type === 'string' ? type : 'string',
                source: 'registered'
            }));
        }
    } catch (e) {
        console.error("Couldn't access registered properties:", e);
    }
    return [];
}

/**
 * Scans files for additional properties with type inference
 */
async function getPropertiesFromFiles(app: App): Promise<PropertyTypeInfo[]> {
    const files = app.vault.getMarkdownFiles();
    const propertyMap = new Map<string, { values: Set<any>, types: Set<string> }>();
    
    for (const file of files.slice(0, 1000)) { // Limit to 1000 files for performance
        try {
            const cache = app.metadataCache.getFileCache(file);
            if (cache?.frontmatter) {
                for (const [key, value] of Object.entries(cache.frontmatter)) {
                    if (key === 'position') continue;
                    
                    if (!propertyMap.has(key)) {
                        propertyMap.set(key, {
                            values: new Set(),
                            types: new Set()
                        });
                    }
                    
                    const propData = propertyMap.get(key)!;
                    propData.values.add(value);
                    propData.types.add(inferTypeFromValue(value));
                }
            }
        } catch (error) {
            console.error(`Error processing file ${file.path}:`, error);
        }
    }
    
    return Array.from(propertyMap.entries()).map(([name, data]) => {
        const type = determinePrimaryType(data.types);
        return {
            name,
            type,
            isArray: data.types.has('array'),
            values: data.values.size > 0 ? Array.from(data.values).map(String) : undefined,
            source: 'inferred'
        };
    });
}

/**
 * Determines the primary type from a Set of observed types
 * @param types Set of observed types for a property
 * @returns The most specific type we can determine
 */
function determinePrimaryType(types: Set<string>): string {
    // Handle empty case (shouldn't happen but TypeScript wants us to check)
    if (types.size === 0) return 'string';
    
    // If only one type observed, use that
    if (types.size === 1) return types.values().next().value;
    
    // Priority order for type resolution
    const typePriority = [
        'date',
        'datetime',
        'boolean',
        'number',
        'array',
        'multitext',
        'string' // fallback
    ];
    
    // Return the highest priority type we find
    for (const type of typePriority) {
        if (types.has(type)) {
            return type;
        }
    }
    
    // Final fallback
    return 'string';
}

/**
 * Enhanced type inference with better date detection
 */
function inferTypeFromValue(value: any): string {
    if (value === null || value === undefined) {
        return 'null';
    }
    
    // Check array first
    if (Array.isArray(value)) {
        if (value.length > 0) {
            // Check array element types
            const elementTypes = new Set(value.map(inferTypeFromValue));
            if (elementTypes.size === 1) {
                return `array<${elementTypes.values().next().value}>`;
            }
        }
        return 'array';
    }
    
    // Check basic types
    switch (typeof value) {
        case 'boolean': return 'boolean';
        case 'number': return 'number';
        case 'object': return 'object'; // for future expansion
    }
    
    // Must be string at this point - check for special string formats
    if (typeof value === 'string') {
        // ISO Date (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return 'date';
        }
        
        // ISO DateTime
        if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(value)) {
            return 'datetime';
        }
        
        // Obsidian tag
        if (value.startsWith('#')) {
            return 'tag';
        }
    }
    
    // Default to string
    return 'string';
}

function value(value: unknown, index: number, array: unknown[]): unknown {
    throw new Error('Function not implemented.');
}

export class SelectProperty extends SuggestModal<PropertyTypeInfo> {
    private onSubmit: (result: PropertyTypeInfo) => void;
    property: PropertyTypeInfo | undefined;
    knownProperties:PropertyTypeInfo[];
    typedText: string;
    newTextFlag: Boolean;

    constructor (app:App, knownProperties:PropertyTypeInfo[], property: PropertyTypeInfo | undefined, onSubmit: (result: PropertyTypeInfo) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.property = property;
        this.typedText = '';
        this.newTextFlag = true;
        this.knownProperties = knownProperties;
    }
    // Returns all available suggestions.
    getSuggestions(query: string): PropertyTypeInfo[] {
        const result = this.knownProperties.filter((property) => property.name.toLowerCase().includes(query.toLowerCase()));
        this.newTextFlag = (result.length === 0);
        this.typedText = query;
        return result;
    }
    onOpen(): void {
        if (this.property) {
            this.setPlaceholder(this.property.name);
        } else {
            this.setPlaceholder('no property selected!');
        }
        this.setTitle('Select or type a property name');
    }
    // Renders each suggestion item.
    renderSuggestion(property: PropertyTypeInfo, el: HTMLElement) {
      el.createEl('div', { text: property.name });
      el.createEl('small', { text: property.type });
    }
    onClose(): void {
        if (this.newTextFlag && this.property) {
            this.property.name = this.typedText;
            this.property.type = 'text';
            this.onSubmit(this.property);
        }
    }

    // Perform action on the selected suggestion.
    onChooseSuggestion(property: PropertyTypeInfo, evt: MouseEvent | KeyboardEvent) {
        if (evt instanceof KeyboardEvent) {
            console.log(`keyboard ${this.typedText} ${this.newTextFlag}`, property)
        }
        console.log('onChooseSuggestion', evt)
        this.onSubmit(property);
    }
  }
