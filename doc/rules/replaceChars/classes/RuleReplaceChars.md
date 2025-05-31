[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [rules/replaceChars](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/replaceChars/README.md) / RuleReplaceChars

# Class: RuleReplaceChars

Defined in: [src/rules/replaceChars.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/replaceChars.ts#L38)

A rule class for replacing configurable characters in an input value with a specified text string.
Supports both plain text and regular expression replacements.

## Remarks

- This rule is intended for use in formatting operations, such as replacing spaces or other characters in tags, aliases, or text fields.
- The replacement behavior is configurable via the `replace` (search pattern) and `replaceBy` (replacement string) options.
- The configuration UI allows users to specify the search pattern (supports regex) and the replacement string.

## Example

```ts
// Replace all spaces with underscores in a string
const rule = new RuleReplaceSpaces();
rule.fx(app, file, tools, "my tag name"); // returns "my_tag_name" if configured appropriately
```

## Method

fx
Applies the replacement rule to the input value using the configured search pattern and replacement string.

## Method

configTab
Renders the configuration tab UI for setting the search and replacement strings.

## Extends

- [`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md)

## Constructors

### Constructor

> **new RuleReplaceChars**(): `RuleReplaceChars`

Defined in: [src/rules/replaceChars.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/replaceChars.ts#L39)

#### Returns

`RuleReplaceChars`

#### Overrides

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`constructor`](../../rules/classes/RulePrototype.md#constructor)

## Properties

### configElements

> **configElements**: `object` \| [`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md) = `{}`

Defined in: [src/rules/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L39)

The configuration elements for the rule.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`configElements`](../../rules/classes/RulePrototype.md#configelements)

***

### description

> **description**: `string`

Defined in: [src/rules/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L35)

A description of what the rule does.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`description`](../../rules/classes/RulePrototype.md#description)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L33)

The unique identifier for the rule.

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

The display name of the rule.

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

The type of rule (e.g., 'formatter').

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

The source code for the rule's function.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`source`](../../rules/classes/RulePrototype.md#source)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L38)

The types of fields this rule can be applied to.

#### Inherited from

[`RulePrototype`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/classes/RulePrototype.md).[`type`](../../rules/classes/RulePrototype.md#type)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/replaceChars.ts:65](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/replaceChars.ts#L65)

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

> **fx**(`app`, `file`, `tools`, `input?`): `any`

Defined in: [src/rules/replaceChars.ts:50](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/replaceChars.ts#L50)

#### Parameters

##### app

`undefined` | `App`

##### file

`any`

##### tools

[`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

##### input?

`any`

#### Returns

`any`

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
