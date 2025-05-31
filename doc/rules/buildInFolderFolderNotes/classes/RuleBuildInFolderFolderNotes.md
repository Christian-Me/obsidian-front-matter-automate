[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [rules/buildInFolderFolderNotes](../README.md) / RuleBuildInFolderFolderNotes

# Class: RuleBuildInFolderFolderNotes

Defined in: [src/rules/buildInFolderFolderNotes.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/buildInFolderFolderNotes.ts#L36)

Represents a built-in rule that returns the parent folder of a file,
compatible with the "Folder Notes" convention in Obsidian.

This rule determines the parent folder name for a given file, taking into account
the special case where the file is a folder note (i.e., its name matches its parent folder).
If the file is located in the root directory, the vault name is returned instead.

## Remarks

- The rule is identified by the ID 'folderFolderNotes'.
- The rule type is 'buildIn'.
- The `fx` method should not have its signature changed, as it is used by the rule engine.

## Example

```ts
// For a file at 'Projects/Notes/Notes.md' (where 'Notes' is a folder note):
// Returns 'Projects'

// For a file at 'Projects/Notes/Meeting.md':
// Returns 'Notes'

// For a file at the vault root:
// Returns the vault name
```

## Param

The Obsidian App instance (may be undefined).

## Param

The target TFile for which the parent folder is determined.

## Param

Utility tools, including access to the vault.

## Extends

- [`RulePrototype`](../../rules/classes/RulePrototype.md)

## Constructors

### Constructor

> **new RuleBuildInFolderFolderNotes**(): `RuleBuildInFolderFolderNotes`

Defined in: [src/rules/buildInFolderFolderNotes.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/buildInFolderFolderNotes.ts#L37)

#### Returns

`RuleBuildInFolderFolderNotes`

#### Overrides

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`constructor`](../../rules/classes/RulePrototype.md#constructor)

## Properties

### configElements

> **configElements**: `object` \| [`RuleConfigElements`](../../rules/interfaces/RuleConfigElements.md) = `{}`

Defined in: [src/rules/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L39)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`configElements`](../../rules/classes/RulePrototype.md#configelements)

***

### description

> **description**: `string`

Defined in: [src/rules/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L35)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`description`](../../rules/classes/RulePrototype.md#description)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L33)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`id`](../../rules/classes/RulePrototype.md#id)

***

### isLiveRule

> **isLiveRule**: `boolean` = `false`

Defined in: [src/rules/rules.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L37)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`isLiveRule`](../../rules/classes/RulePrototype.md#isliverule)

***

### name

> **name**: `string`

Defined in: [src/rules/rules.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L34)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`name`](../../rules/classes/RulePrototype.md#name)

***

### rulesConfigDiv

> **rulesConfigDiv**: `undefined` \| `HTMLDivElement` = `undefined`

Defined in: [src/rules/rules.ts:31](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L31)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`rulesConfigDiv`](../../rules/classes/RulePrototype.md#rulesconfigdiv)

***

### ruleType

> **ruleType**: [`FrontmatterAutomateRuleTypes`](../../rules/type-aliases/FrontmatterAutomateRuleTypes.md) = `'buildIn'`

Defined in: [src/rules/rules.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L36)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`ruleType`](../../rules/classes/RulePrototype.md#ruletype)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

Defined in: [src/rules/rules.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L32)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`scriptingTools`](../../rules/classes/RulePrototype.md#scriptingtools)

***

### source

> **source**: `string` = `'function (app, file, tools) { // do not change this line!\n  let result = \'\'\n  return result;\n}'`

Defined in: [src/rules/rules.ts:40](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L40)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`source`](../../rules/classes/RulePrototype.md#source)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L38)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`type`](../../rules/classes/RulePrototype.md#type)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/buildInFolderFolderNotes.ts:62](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/buildInFolderFolderNotes.ts#L62)

Configures the settings tab for a specific rule in the plugin.

#### Parameters

##### optionEL

`HTMLElement`

The HTML element where the configuration options will be rendered.

##### rule

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

The settings object for the frontmatter automation rule.

##### that

`any`

The context or reference to the calling object.

##### previewComponent

`any`

The component used to render a preview of the rule's effect.

#### Returns

`void`

#### Overrides

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`configTab`](../../rules/classes/RulePrototype.md#configtab)

***

### defaultConfigElements()

> **defaultConfigElements**(`modifiers`): [`RuleConfigElements`](../../rules/interfaces/RuleConfigElements.md)

Defined in: [src/rules/rules.ts:67](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L67)

#### Parameters

##### modifiers

`any`

#### Returns

[`RuleConfigElements`](../../rules/interfaces/RuleConfigElements.md)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`defaultConfigElements`](../../rules/classes/RulePrototype.md#defaultconfigelements)

***

### execute()

> **execute**(`app`, `file`, `tools`, `input?`): `string`

Defined in: [src/rules/rules.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L115)

Executes the `fx` function based on the `ruleType`.
Handles different function signatures dynamically.

#### Parameters

##### app

The Obsidian app instance.

`undefined` | `App`

##### file

`any`

The file to pass to the rule's `fx` function.

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

The scripting tools to pass to the rule's `fx` function.

##### input?

`any`

Optional input for rules that require it (e.g., `buildIn.inputProperty`).

#### Returns

`string`

- The result of the `fx` function.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`execute`](../../rules/classes/RulePrototype.md#execute)

***

### fx()

> **fx**(`app`, `file`, `tools`): `string`

Defined in: [src/rules/buildInFolderFolderNotes.ts:48](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/buildInFolderFolderNotes.ts#L48)

#### Parameters

##### app

`undefined` | `App`

##### file

`TFile`

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

#### Returns

`string`

#### Overrides

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`fx`](../../rules/classes/RulePrototype.md#fx)

***

### getSource()

> **getSource**(): `string`

Defined in: [src/rules/rules.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L46)

#### Returns

`string`

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`getSource`](../../rules/classes/RulePrototype.md#getsource)

***

### hasOwnConfigTab()

> **hasOwnConfigTab**(): `boolean`

Defined in: [src/rules/rules.ts:102](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L102)

Checks if the rule has any configuration options.

#### Returns

`boolean`

- Returns true if the rule has options, false otherwise.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`hasOwnConfigTab`](../../rules/classes/RulePrototype.md#hasownconfigtab)

***

### useRuleOption()

> **useRuleOption**(`option`): `boolean`

Defined in: [src/rules/rules.ts:91](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/rules/rules.ts#L91)

Checks if a specific rule option is enabled.

#### Parameters

##### option

`string`

The name of the rule option to check.

#### Returns

`boolean`

- Returns true if the option is enabled, false otherwise.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`useRuleOption`](../../rules/classes/RulePrototype.md#useruleoption)
