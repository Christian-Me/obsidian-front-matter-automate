[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [rules/buildInPathFolderNotes](../README.md) / RuleBuildInPathFolderNotes

# Class: RuleBuildInPathFolderNotes

Defined in: [src/rules/buildInPathFolderNotes.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/buildInPathFolderNotes.ts#L46)

Represents a built-in rule for handling folder notes in a path-compatible manner.
This rule processes file paths to determine the appropriate folder structure,
removing parent folders if they share the same name as the file.

## Remarks

- The `fx` method implements the core logic for path manipulation.
- The `source` property contains the serialized function logic for external use.
- This rule is designed to work with text, tags, aliases, and multitext types.

## Example

```ts
// Example usage of the `fx` method:
const result = rule.fx(app, file, tools);
console.log(result); // Outputs the processed path
```

## Method

fx
Processes the file path to determine the appropriate folder structure.
Removes the parent folder if it shares the same name as the file.

## Param

The application instance (optional).

## Param

The file object containing path and basename information.

## Param

Utility tools for scripting operations.

## Method

configTab
Placeholder method for adding configuration tab logic.

## Extends

- [`RulePrototype`](../../rules/classes/RulePrototype.md)

## Constructors

### Constructor

> **new RuleBuildInPathFolderNotes**(): `RuleBuildInPathFolderNotes`

Defined in: [src/rules/buildInPathFolderNotes.ts:47](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/buildInPathFolderNotes.ts#L47)

#### Returns

`RuleBuildInPathFolderNotes`

#### Overrides

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`constructor`](../../rules/classes/RulePrototype.md#constructor)

## Properties

### configElements

> **configElements**: `object` \| [`RuleConfigElements`](../../rules/interfaces/RuleConfigElements.md) = `{}`

Defined in: [src/rules/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L39)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`configElements`](../../rules/classes/RulePrototype.md#configelements)

***

### description

> **description**: `string`

Defined in: [src/rules/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L35)

A brief description of the rule's purpose.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`description`](../../rules/classes/RulePrototype.md#description)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L33)

The unique identifier for the rule (`pathFolderNotes`).

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`id`](../../rules/classes/RulePrototype.md#id)

***

### isLiveRule

> **isLiveRule**: `boolean` = `false`

Defined in: [src/rules/rules.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L37)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`isLiveRule`](../../rules/classes/RulePrototype.md#isliverule)

***

### name

> **name**: `string`

Defined in: [src/rules/rules.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L34)

The display name of the rule (`Path (folder notes)`).

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`name`](../../rules/classes/RulePrototype.md#name)

***

### rulesConfigDiv

> **rulesConfigDiv**: `undefined` \| `HTMLDivElement` = `undefined`

Defined in: [src/rules/rules.ts:31](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L31)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`rulesConfigDiv`](../../rules/classes/RulePrototype.md#rulesconfigdiv)

***

### ruleType

> **ruleType**: [`FrontmatterAutomateRuleTypes`](../../rules/type-aliases/FrontmatterAutomateRuleTypes.md) = `'buildIn'`

Defined in: [src/rules/rules.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L36)

The type of rule (`buildIn`).

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`ruleType`](../../rules/classes/RulePrototype.md#ruletype)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

Defined in: [src/rules/rules.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L32)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`scriptingTools`](../../rules/classes/RulePrototype.md#scriptingtools)

***

### source

> **source**: `string` = `'function (app, file, tools) { // do not change this line!\n  let result = \'\'\n  return result;\n}'`

Defined in: [src/rules/rules.ts:40](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L40)

The serialized function logic for external use.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`source`](../../rules/classes/RulePrototype.md#source)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L38)

The types of data this rule applies to (`text`, `tags`, `aliases`, `multitext`).

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`type`](../../rules/classes/RulePrototype.md#type)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/buildInPathFolderNotes.ts:65](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/buildInPathFolderNotes.ts#L65)

A placeholder for configuration tab logic.

#### Parameters

##### optionEL

`HTMLElement`

##### rule

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### that

`any`

##### previewComponent

`any`

#### Returns

`void`

#### Overrides

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`configTab`](../../rules/classes/RulePrototype.md#configtab)

***

### defaultConfigElements()

> **defaultConfigElements**(`modifiers`): [`RuleConfigElements`](../../rules/interfaces/RuleConfigElements.md)

Defined in: [src/rules/rules.ts:67](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L67)

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

Defined in: [src/rules/rules.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L115)

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

Defined in: [src/rules/buildInPathFolderNotes.ts:58](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/buildInPathFolderNotes.ts#L58)

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

Defined in: [src/rules/rules.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L46)

#### Returns

`string`

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`getSource`](../../rules/classes/RulePrototype.md#getsource)

***

### hasOwnConfigTab()

> **hasOwnConfigTab**(): `boolean`

Defined in: [src/rules/rules.ts:102](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L102)

Checks if the rule has any configuration options.

#### Returns

`boolean`

- Returns true if the rule has options, false otherwise.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`hasOwnConfigTab`](../../rules/classes/RulePrototype.md#hasownconfigtab)

***

### useRuleOption()

> **useRuleOption**(`option`): `boolean`

Defined in: [src/rules/rules.ts:91](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L91)

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
