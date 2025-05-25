[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [settings-properties](../README.md) / RulesTable

# Class: RulesTable

Defined in: [src/settings-properties.ts:14](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L14)

## Extends

- `PluginSettingTab`

## Constructors

### Constructor

> **new RulesTable**(`app`, `plugin`, `container`, `settingsParameter`): `RulesTable`

Defined in: [src/settings-properties.ts:23](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L23)

#### Parameters

##### app

`App`

##### plugin

`any`

##### container

`HTMLDivElement`

##### settingsParameter

`string`

#### Returns

`RulesTable`

#### Overrides

`PluginSettingTab.constructor`

## Properties

### activeFile

> **activeFile**: `null` \| `TFile` = `null`

Defined in: [src/settings-properties.ts:21](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L21)

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

Defined in: [src/settings-properties.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L17)

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

Defined in: [src/settings-properties.ts:16](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L16)

***

### plugin

> **plugin**: `any`

Defined in: [src/settings-properties.ts:15](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L15)

***

### propertiesListEl

> **propertiesListEl**: `HTMLDivElement`

Defined in: [src/settings-properties.ts:18](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L18)

***

### settingsParameter

> **settingsParameter**: `string`

Defined in: [src/settings-properties.ts:19](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L19)

***

### tools

> **tools**: [`ScriptingTools`](../../tools/classes/ScriptingTools.md)

Defined in: [src/settings-properties.ts:20](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L20)

## Methods

### clearSearchResults()

> **clearSearchResults**(`searchContainerEl`): `void`

Defined in: [src/settings-properties.ts:616](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L616)

#### Parameters

##### searchContainerEl

`HTMLElement`

#### Returns

`void`

***

### display()

> **display**(): `Promise`\<`void`\>

Defined in: [src/settings-properties.ts:763](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L763)

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

Defined in: [src/settings-properties.ts:490](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L490)

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

Defined in: [src/settings-properties.ts:519](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L519)

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

Defined in: [src/settings-properties.ts:195](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L195)

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

> **renderPropertyRow**(`containerEl`, `rule`, `index`): `void`

Defined in: [src/settings-properties.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L35)

#### Parameters

##### containerEl

`HTMLElement`

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### index

`number`

#### Returns

`void`

***

### renderSearchResults()

> **renderSearchResults**(`searchContainerEl`, `searchTerm`, `rowIndex`): `void`

Defined in: [src/settings-properties.ts:538](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L538)

#### Parameters

##### searchContainerEl

`HTMLElement`

##### searchTerm

`string`

##### rowIndex

`number`

#### Returns

`void`

***

### renderValueInput()

> **renderValueInput**(`containerEl`, `propertyInfo`, `currentValue`, `index`): `any`

Defined in: [src/settings-properties.ts:623](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L623)

#### Parameters

##### containerEl

`HTMLElement`

##### propertyInfo

`undefined` | [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)

##### currentValue

`any`

##### index

`number`

#### Returns

`any`

***

### setOptionConfig()

> **setOptionConfig**(`ruleId`, `propertyId`, `config`): `void`

Defined in: [src/settings-properties.ts:508](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L508)

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

Defined in: [src/settings-properties.ts:529](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L529)

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

Defined in: [src/settings-properties.ts:741](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings-properties.ts#L741)

#### Parameters

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### previewComponent

`any`

#### Returns

`Promise`\<`void`\>
