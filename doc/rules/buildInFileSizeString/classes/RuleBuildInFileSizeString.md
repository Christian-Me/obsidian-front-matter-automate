[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [rules/buildInFileSizeString](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFileSizeString/README.md) / RuleBuildInFileSizeString

# Class: RuleBuildInFileSizeString

Defined in: [src/rules/buildInFileSizeString.ts:26](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/buildInFileSizeString.ts#L26)

Represents a built-in rule that returns the size of a file as a human-readable string.

This rule converts the file size from bytes to KB, MB, or GB as appropriate,
formatting the result with a fixed number of decimal places.

## Remarks

- The rule is identified by the ID `'fileSizeString'`.
- The `fx` method performs the file size conversion and formatting.
- The rule is intended for use within the Folder to Tags plugin for Obsidian.

## Example

```ts
// Returns "512 Bytes" for a 512-byte file
// Returns "1.23 KB" for a file of size 1259 bytes
// Returns "2.34 MB" for a file of size 2,453,123 bytes

@public
```

## Extends

- [`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md)

## Constructors

### Constructor

> **new RuleBuildInFileSizeString**(): `RuleBuildInFileSizeString`

Defined in: [src/rules/buildInFileSizeString.ts:27](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/buildInFileSizeString.ts#L27)

#### Returns

`RuleBuildInFileSizeString`

#### Overrides

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`constructor`](../../rules/classes/RulePrototype.md#constructor)

## Properties

### configElements

> **configElements**: `object` \| [`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md) = `{}`

Defined in: [src/rules/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L39)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`configElements`](../../rules/classes/RulePrototype.md#configelements)

***

### description

> **description**: `string`

Defined in: [src/rules/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L35)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`description`](../../rules/classes/RulePrototype.md#description)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L33)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`id`](../../rules/classes/RulePrototype.md#id)

***

### isLiveRule

> **isLiveRule**: `boolean` = `false`

Defined in: [src/rules/rules.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L37)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`isLiveRule`](../../rules/classes/RulePrototype.md#isliverule)

***

### name

> **name**: `string`

Defined in: [src/rules/rules.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L34)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`name`](../../rules/classes/RulePrototype.md#name)

***

### rulesConfigDiv

> **rulesConfigDiv**: `undefined` \| `HTMLDivElement` = `undefined`

Defined in: [src/rules/rules.ts:31](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L31)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`rulesConfigDiv`](../../rules/classes/RulePrototype.md#rulesconfigdiv)

***

### ruleType

> **ruleType**: [`FrontmatterAutomateRuleTypes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/type-aliases/FrontmatterAutomateRuleTypes.md) = `'buildIn'`

Defined in: [src/rules/rules.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L36)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`ruleType`](../../rules/classes/RulePrototype.md#ruletype)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

Defined in: [src/rules/rules.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L32)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`scriptingTools`](../../rules/classes/RulePrototype.md#scriptingtools)

***

### source

> **source**: `string` = `'function (app, file, tools) { // do not change this line!\n  let result = \'\'\n  return result;\n}'`

Defined in: [src/rules/rules.ts:40](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L40)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`source`](../../rules/classes/RulePrototype.md#source)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L38)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`type`](../../rules/classes/RulePrototype.md#type)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/buildInFileSizeString.ts:57](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/buildInFileSizeString.ts#L57)

Configures the settings tab for a specific rule in the plugin.

#### Parameters

##### optionEL

`HTMLElement`

The HTML element where the configuration options will be rendered.

##### rule

[`FrontmatterAutomateRuleSettings`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/interfaces/FrontmatterAutomateRuleSettings.md)

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

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`configTab`](../../rules/classes/RulePrototype.md#configtab)

***

### defaultConfigElements()

> **defaultConfigElements**(`modifiers`): [`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md)

Defined in: [src/rules/rules.ts:67](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L67)

#### Parameters

##### modifiers

`any`

#### Returns

[`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md)

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`defaultConfigElements`](../../rules/classes/RulePrototype.md#defaultconfigelements)

***

### execute()

> **execute**(`app`, `file`, `tools`, `input?`): `string`

Defined in: [src/rules/rules.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L115)

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

[`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

The scripting tools to pass to the rule's `fx` function.

##### input?

`any`

Optional input for rules that require it (e.g., `buildIn.inputProperty`).

#### Returns

`string`

- The result of the `fx` function.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`execute`](../../rules/classes/RulePrototype.md#execute)

***

### fx()

> **fx**(`app`, `file`, `tools`): `string`

Defined in: [src/rules/buildInFileSizeString.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/buildInFileSizeString.ts#L38)

#### Parameters

##### app

`undefined` | `App`

##### file

`TFile`

##### tools

[`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

#### Returns

`string`

#### Overrides

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`fx`](../../rules/classes/RulePrototype.md#fx)

***

### getSource()

> **getSource**(): `string`

Defined in: [src/rules/rules.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L46)

#### Returns

`string`

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`getSource`](../../rules/classes/RulePrototype.md#getsource)

***

### hasOwnConfigTab()

> **hasOwnConfigTab**(): `boolean`

Defined in: [src/rules/rules.ts:102](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L102)

Checks if the rule has any configuration options.

#### Returns

`boolean`

- Returns true if the rule has options, false otherwise.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`hasOwnConfigTab`](../../rules/classes/RulePrototype.md#hasownconfigtab)

***

### useRuleOption()

> **useRuleOption**(`option`): `boolean`

Defined in: [src/rules/rules.ts:91](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L91)

Checks if a specific rule option is enabled.

#### Parameters

##### option

`string`

The name of the rule option to check.

#### Returns

`boolean`

- Returns true if the option is enabled, false otherwise.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`useRuleOption`](../../rules/classes/RulePrototype.md#useruleoption)
