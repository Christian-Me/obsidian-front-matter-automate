[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [rules/toTitleCaseEN](../README.md) / RuleToTitleCaseEN

# Class: RuleToTitleCaseEN

Defined in: [src/rules/toTitleCaseEN.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/toTitleCaseEN.ts#L36)

Represents a rule that converts input values to Title Case with English "small" Words.
This rule can handle various input types including strings, arrays, dates, and objects.
credit https://johnresig.com/blog/title-capitalization-in-javascript/

## Remarks

- For strings, it converts the entire string to Title Case.
- For arrays, it maps each element to its Title Case string representation.
- For dates, it converts the date to an ISO string and applies Title Case.
- For objects, it serializes the object to a JSON string and applies Title Case.
- If the input type is not recognized, it returns the input as is.

## Example

```typescript
const rule = new RuleToTitleCase();
console.log(rule.fx("hello world", tools)); // Outputs: "Hello World"
console.log(rule.fx(["hello", "world"], tools)); // Outputs: ["Hello", "World"]
console.log(rule.fx(new Date("2023-01-01"), tools)); // Outputs: "2023-01-01T00:00:00.000Z"
console.log(rule.fx({ key: "value" }, tools)); // Outputs: '{"Key":"Value"}'
```

## Extends

- [`RulePrototype`](../../rules/classes/RulePrototype.md)

## Constructors

### Constructor

> **new RuleToTitleCaseEN**(): `RuleToTitleCaseEN`

Defined in: [src/rules/toTitleCaseEN.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/toTitleCaseEN.ts#L37)

#### Returns

`RuleToTitleCaseEN`

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

A brief description of the rule's functionality.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`description`](../../rules/classes/RulePrototype.md#description)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L33)

The unique identifier for the rule.

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

The display name of the rule.

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

The type of the rule, which is "formatter".

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

The source code template for the rule.

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`source`](../../rules/classes/RulePrototype.md#source)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L38)

The types of input this rule applies to, e.g., ['text', 'tags', 'aliases', 'multitext'].

#### Inherited from

[`RulePrototype`](../../rules/classes/RulePrototype.md).[`type`](../../rules/classes/RulePrototype.md#type)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/rules.ts:63](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L63)

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

#### Inherited from

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

> **fx**(`app`, `file`, `tools`, `input`): `any`

Defined in: [src/rules/toTitleCaseEN.ts:48](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/toTitleCaseEN.ts#L48)

The function that performs the Title Case transformation.

#### Parameters

##### app

`undefined` | `App`

##### file

`TFile`

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

##### input

`any`

#### Returns

`any`

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

### lower()

> **lower**(`word`): `string`

Defined in: [src/rules/toTitleCaseEN.ts:97](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/toTitleCaseEN.ts#L97)

#### Parameters

##### word

`string`

#### Returns

`string`

***

### titleCaps()

> **titleCaps**(`title`): `string`

Defined in: [src/rules/toTitleCaseEN.ts:68](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/toTitleCaseEN.ts#L68)

#### Parameters

##### title

`string`

#### Returns

`string`

***

### upper()

> **upper**(`word`): `string`

Defined in: [src/rules/toTitleCaseEN.ts:101](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/toTitleCaseEN.ts#L101)

#### Parameters

##### word

`string`

#### Returns

`string`

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
