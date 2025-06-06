[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [settings-properties](../README.md) / RulesTable

# Class: RulesTable

Defined in: [src/settings-properties.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L17)

## Extends

- `PluginSettingTab`

## Constructors

### Constructor

> **new RulesTable**(`app`, `plugin`, `container`, `settings`): `RulesTable`

Defined in: [src/settings-properties.ts:26](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L26)

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

Defined in: [src/settings-properties.ts:24](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L24)

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

Defined in: [src/settings-properties.ts:20](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L20)

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

Defined in: [src/settings-properties.ts:19](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L19)

***

### plugin

> **plugin**: `any`

Defined in: [src/settings-properties.ts:18](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L18)

***

### propertiesListEl

> **propertiesListEl**: `HTMLDivElement`

Defined in: [src/settings-properties.ts:21](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L21)

***

### settings

> **settings**: [`TreeHierarchyData`](../../uiTreeHierarchySortableSettings/type-aliases/TreeHierarchyData.md)

Defined in: [src/settings-properties.ts:22](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L22)

***

### tools

> **tools**: [`ScriptingTools`](../../tools/classes/ScriptingTools.md)

Defined in: [src/settings-properties.ts:23](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L23)

## Methods

### clearSearchResults()

> **clearSearchResults**(`searchContainerEl`): `void`

Defined in: [src/settings-properties.ts:610](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L610)

#### Parameters

##### searchContainerEl

`HTMLElement`

#### Returns

`void`

***

### display()

> **display**(): `Promise`\<`void`\>

Defined in: [src/settings-properties.ts:779](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L779)

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

Defined in: [src/settings-properties.ts:465](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L465)

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

### getRuleById()

> **getRuleById**(`ruleId`): `undefined` \| [`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

Defined in: [src/settings-properties.ts:481](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L481)

Retrieves a rule from the plugin's settings by its unique identifier.

#### Parameters

##### ruleId

`string`

The unique identifier of the rule to retrieve.

#### Returns

`undefined` \| [`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

The matching [FrontmatterAutomateRuleSettings](../../types/interfaces/FrontmatterAutomateRuleSettings.md) object if found; otherwise, `undefined`.

***

### hasOptionConfig()

> **hasOptionConfig**(`ruleId`): `boolean`

Defined in: [src/settings-properties.ts:509](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L509)

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

Defined in: [src/settings-properties.ts:214](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L214)

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

Defined in: [src/settings-properties.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L38)

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

Defined in: [src/settings-properties.ts:529](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L529)

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

Defined in: [src/settings-properties.ts:617](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L617)

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

Defined in: [src/settings-properties.ts:497](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L497)

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

Defined in: [src/settings-properties.ts:519](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L519)

#### Parameters

##### ruleId

`string`

##### defaults

`any`

#### Returns

`any`

***

### updateKeywords()

> **updateKeywords**(`row`): `void`

Defined in: [src/settings-properties.ts:761](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L761)

#### Parameters

##### row

`undefined` | [`TreeHierarchyRow`](../../uiTreeHierarchySortableSettings/type-aliases/TreeHierarchyRow.md)

#### Returns

`void`

***

### updatePreview()

> **updatePreview**(`rule`, `previewComponent`): `Promise`\<`void`\>

Defined in: [src/settings-properties.ts:740](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/settings-properties.ts#L740)

#### Parameters

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### previewComponent

`any`

#### Returns

`Promise`\<`void`\>
