[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [rules/rules](../README.md) / Rules

# Class: Rules

Defined in: [src/rules/rules.ts:167](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L167)

The `Rules` class is responsible for managing and organizing a collection of rules.
It provides methods to register new rules and retrieve rules based on their type.

## Remarks

This class is designed to work within the context of an Obsidian plugin and relies on
the `App` and `plugin` instances for its functionality. Rules are stored as an array
of `RulePrototype` objects.

## Example

```typescript
const rulesManager = new Rules(app, plugin);
rulesManager.registerRule({
  id: "example-rule",
  name: "Example Rule",
  ruleType: FrontmatterAutomateRuleTypes.SomeType,
});
const filteredRules = rulesManager.getRulesByType(FrontmatterAutomateRuleTypes.SomeType);
console.log(filteredRules);
```

## Constructors

### Constructor

> **new Rules**(`app?`, `plugin?`): `Rules`

Defined in: [src/rules/rules.ts:173](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L173)

#### Parameters

##### app?

`App`

##### plugin?

`any`

#### Returns

`Rules`

## Properties

### app

> **app**: `undefined` \| `App` = `undefined`

Defined in: [src/rules/rules.ts:168](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L168)

***

### plugin

> **plugin**: `any` = `undefined`

Defined in: [src/rules/rules.ts:169](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L169)

***

### rules

> **rules**: [`RulePrototype`](RulePrototype.md)[]

Defined in: [src/rules/rules.ts:170](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L170)

***

### tools

> **tools**: `undefined` \| [`ScriptingTools`](../../../tools/classes/ScriptingTools.md) = `undefined`

Defined in: [src/rules/rules.ts:171](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L171)

## Methods

### applyFormatOptions()

> **applyFormatOptions**(`value`, `rule`, `activeFile`, `tools`): `any`

Defined in: [src/rules/rules.ts:291](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L291)

#### Parameters

##### value

`any`

##### rule

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### activeFile

`TFile`

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

#### Returns

`any`

***

### buildConfigTab()

> **buildConfigTab**(`id`, `optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/rules.ts:375](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L375)

Builds the configuration tab for a specific rule by its ID.

#### Parameters

##### id

`string`

The unique identifier of the rule for which the configuration tab is being built.

##### optionEL

`HTMLElement`

The HTML element where the configuration tab will be rendered.

##### rule

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

The definition of the rule, containing its properties and settings.

##### that

`any`

A reference to the current context or object, typically used for maintaining scope.

##### previewComponent

`any`

A component used to render a preview of the rule's effect or configuration.

#### Returns

`void`

#### Remarks

If a rule with the specified ID is found, its `configTab` method is invoked to build the configuration tab.
If no rule is found, a warning is logged to the console.

***

### executeRule()

> **executeRule**(`ruleSettings`, `rule`, `app`, `file`, `tools`, `input?`): `null` \| `string`

Defined in: [src/rules/rules.ts:267](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L267)

Executes the `fx` function of a given rule and returns its result.

#### Parameters

##### ruleSettings

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### rule

[`RulePrototype`](RulePrototype.md)

The rule to execute.

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

Optional input for rules that require it.

#### Returns

`null` \| `string`

- The result of the `fx` function, or `null` if the rule is not found.

***

### executeRuleById()

> **executeRuleById**(`id`, `ruleSettings`, `app`, `file`, `tools`, `input?`): `null` \| `string`

Defined in: [src/rules/rules.ts:249](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L249)

Executes the `fx` function of a rule matching the given `id` and returns its result.

#### Parameters

##### id

`string`

The unique identifier of the rule to execute.

##### ruleSettings

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

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

Optional input for rules that require it.

#### Returns

`null` \| `string`

- The result of the `fx` function, or `null` if the rule is not found.

***

### getRuleById()

> **getRuleById**(`id`): `undefined` \| [`RulePrototype`](RulePrototype.md)

Defined in: [src/rules/rules.ts:216](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L216)

Retrieves a rule object by its unique identifier.

#### Parameters

##### id

`string`

The unique identifier of the rule to retrieve.

#### Returns

`undefined` \| [`RulePrototype`](RulePrototype.md)

The rule object matching the provided ID, or `undefined` if no matching rule is found.

#### Throws

Logs a warning to the console if the rule with the specified ID is not found.

***

### getRulesByType()

> **getRulesByType**(`ruleType`, `propertyType?`): `object`[]

Defined in: [src/rules/rules.ts:202](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L202)

Retrieves a list of rules filtered by the specified rule type and property type.

#### Parameters

##### ruleType

[`FrontmatterAutomateRuleTypes`](../type-aliases/FrontmatterAutomateRuleTypes.md)

The type of rule to filter by.

##### propertyType?

[`ObsidianPropertyTypes`](../../../types/type-aliases/ObsidianPropertyTypes.md)

The property type to filter by within the rule's type array.

#### Returns

`object`[]

An array of objects containing the `id` and `name` of each matching rule, sorted alphabetically by name.

***

### getSource()

> **getSource**(`id`): `undefined` \| `string`

Defined in: [src/rules/rules.ts:230](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L230)

Retrieves the source code of a rule by its unique identifier.

#### Parameters

##### id

`string`

The unique identifier of the rule for which to retrieve the source code.

#### Returns

`undefined` \| `string`

The source code of the rule, or `undefined` if the rule is not found.

***

### init()

> **init**(`app`, `plugin`, `tools`): `void`

Defined in: [src/rules/rules.ts:180](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L180)

#### Parameters

##### app

`App`

##### plugin

`any`

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

#### Returns

`void`

***

### mergeResult()

> **mergeResult**(`result`, `oldResult`, `returnResult`, `rule`): `any`

Defined in: [src/rules/rules.ts:321](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L321)

#### Parameters

##### result

`any`

##### oldResult

`any`

##### returnResult

`any`

##### rule

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

#### Returns

`any`

***

### registerRule()

> **registerRule**(`rule`): `void`

Defined in: [src/rules/rules.ts:191](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L191)

Registers a new rule by adding it to the list of existing rules.

#### Parameters

##### rule

[`RulePrototype`](RulePrototype.md)

The rule prototype to be registered. This should conform to the `RulePrototype` interface.

#### Returns

`void`
