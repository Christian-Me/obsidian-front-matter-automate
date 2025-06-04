[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [rules/automationAutoLink](../README.md) / RuleAutomationAutoLink

# Class: RuleAutomationAutoLink

Defined in: [src/rules/automationAutoLink.ts:11](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/automationAutoLink.ts#L11)

## Extends

- [`RulePrototype`](../../rules/classes/RulePrototype.md)

## Constructors

### Constructor

> **new RuleAutomationAutoLink**(): `RuleAutomationAutoLink`

Defined in: [src/rules/automationAutoLink.ts:12](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/automationAutoLink.ts#L12)

#### Returns

`RuleAutomationAutoLink`

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

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`description`](../../rules/classes/RulePrototype.md#description)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L33)

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

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`source`](../../rules/classes/RulePrototype.md#source)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L38)

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`type`](../../rules/classes/RulePrototype.md#type)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/automationAutoLink.ts:87](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/automationAutoLink.ts#L87)

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

### createNewFile()

> **createNewFile**(`app`, `file`, `tools`): `Promise`\<`void`\>

Defined in: [src/rules/automationAutoLink.ts:23](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/automationAutoLink.ts#L23)

#### Parameters

##### app

`App`

##### file

`TFile`

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

#### Returns

`Promise`\<`void`\>

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

> **fx**(`app`, `file`, `tools`): `any`

Defined in: [src/rules/automationAutoLink.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/automationAutoLink.ts#L32)

Function to create a link to a file. If the file does not exist, it creates a new file based on a template.

#### Parameters

##### app

`App`

The Obsidian app instance.

##### file

`TFile`

The current file.

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

The scripting tools instance.

#### Returns

`any`

The new content for the frontmatter property.

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
