[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [settings-properties](../README.md) / RulesTable

# Class: RulesTable

Defined in: [src/settings-properties.ts:16](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L16)

## Extends

- `PluginSettingTab`

## Constructors

### Constructor

> **new RulesTable**(`app`, `plugin`, `container`, `settings`): `RulesTable`

Defined in: [src/settings-properties.ts:25](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L25)

#### Parameters

##### app

`App`

##### plugin

`any`

##### container

`HTMLDivElement`

##### settings

[`TreeHierarchyData`](../../uiTreeHierarchySortableSettings/type-aliases/TreeHierarchyData.md)

#### Returns

`RulesTable`

#### Overrides

`PluginSettingTab.constructor`

## Properties

### activeFile

> **activeFile**: `null` \| `TFile` = `null`

Defined in: [src/settings-properties.ts:23](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L23)

***

### app

> **app**: `App`

Defined in: node\_modules/obsidian/obsidian.d.ts:3853

Reference to the app instance.

#### Inherited from

`PluginSettingTab.app`

***

### container

> **container**: `HTMLDivElement`

Defined in: [src/settings-properties.ts:19](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L19)

***

### containerEl

> **containerEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:3859

Outermost HTML element on the setting tab.

#### Inherited from

`PluginSettingTab.containerEl`

***

### knownProperties

> **knownProperties**: `Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\> = `{}`

Defined in: [src/settings-properties.ts:18](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L18)

***

### plugin

> **plugin**: `any`

Defined in: [src/settings-properties.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L17)

***

### propertiesListEl

> **propertiesListEl**: `HTMLDivElement`

Defined in: [src/settings-properties.ts:20](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L20)

***

### settings

> **settings**: [`TreeHierarchyData`](../../uiTreeHierarchySortableSettings/type-aliases/TreeHierarchyData.md)

Defined in: [src/settings-properties.ts:21](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L21)

***

### tools

> **tools**: [`ScriptingTools`](../../tools/classes/ScriptingTools.md)

Defined in: [src/settings-properties.ts:22](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L22)

## Methods

### clearSearchResults()

> **clearSearchResults**(`searchContainerEl`): `void`

Defined in: [src/settings-properties.ts:589](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L589)

#### Parameters

##### searchContainerEl

`HTMLElement`

#### Returns

`void`

***

### display()

> **display**(): `Promise`\<`void`\>

Defined in: [src/settings-properties.ts:741](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L741)

Called when the settings tab should be rendered.

#### Returns

`Promise`\<`void`\>

#### See

[https://docs.obsidian.md/Plugins/User+interface/Settings#Register+a+settings+tab](https://docs.obsidian.md/Plugins/User+interface/Settings#Register+a+settings+tab)

#### Overrides

`PluginSettingTab.display`

***

### getOptionConfig()

> **getOptionConfig**(`ruleId`, `propertyId`): `any`

Defined in: [src/settings-properties.ts:460](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L460)

Retrieves the configuration option for a specific rule and property.

#### Parameters

##### ruleId

`string`

The unique identifier of the rule.

##### propertyId

`string`

The specific property for which the configuration is being retrieved.

#### Returns

`any`

The configuration value for the specified property, or undefined if not found.

***

### hasOptionConfig()

> **hasOptionConfig**(`ruleId`): `boolean`

Defined in: [src/settings-properties.ts:489](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L489)

#### Parameters

##### ruleId

`string`

#### Returns

`boolean`

***

### hide()

> **hide**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:3873

Hides the contents of the setting tab.
Any registered components should be unloaded when the view is hidden.
Override this if you need to perform additional cleanup.

#### Returns

`void`

#### Inherited from

`PluginSettingTab.hide`

***

### renderPropertyOptions()

> **renderPropertyOptions**(`optionEL`, `rule`, `previewComponent`): `void`

Defined in: [src/settings-properties.ts:209](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L209)

#### Parameters

##### optionEL

`HTMLDivElement`

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### previewComponent

`undefined` | `HTMLDivElement` | `TextComponent`

#### Returns

`void`

***

### renderPropertyRow()

> **renderPropertyRow**(`containerEl`, `rule`): `void`

Defined in: [src/settings-properties.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L37)

#### Parameters

##### containerEl

`HTMLElement`

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

#### Returns

`void`

***

### renderSearchResults()

> **renderSearchResults**(`searchContainerEl`, `searchTerm`, `payload`): `void`

Defined in: [src/settings-properties.ts:508](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L508)

#### Parameters

##### searchContainerEl

`HTMLElement`

##### searchTerm

`string`

##### payload

`any`

#### Returns

`void`

***

### renderValueInput()

> **renderValueInput**(`containerEl`, `propertyInfo`, `currentValue`, `payload`): `any`

Defined in: [src/settings-properties.ts:596](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L596)

#### Parameters

##### containerEl

`HTMLElement`

##### propertyInfo

`undefined` | [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)

##### currentValue

`any`

##### payload

`any`

#### Returns

`any`

***

### setOptionConfig()

> **setOptionConfig**(`ruleId`, `propertyId`, `config`): `void`

Defined in: [src/settings-properties.ts:478](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L478)

Sets the configuration option for a specific rule and property.

#### Parameters

##### ruleId

`string`

The unique identifier of the rule.

##### propertyId

`string`

The specific property for which the configuration is being set.

##### config

`any`

The configuration value to be set.

#### Returns

`void`

***

### setOptionConfigDefaults()

> **setOptionConfigDefaults**(`ruleId`, `defaults`): `any`

Defined in: [src/settings-properties.ts:499](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L499)

#### Parameters

##### ruleId

`string`

##### defaults

`any`

#### Returns

`any`

***

### updatePreview()

> **updatePreview**(`rule`, `previewComponent`): `Promise`\<`void`\>

Defined in: [src/settings-properties.ts:719](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/settings-properties.ts#L719)

#### Parameters

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### previewComponent

`any`

#### Returns

`Promise`\<`void`\>
