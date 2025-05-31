[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [rules](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/README.md) / RuleFunction

# Interface: RuleFunction

Defined in: [src/rules.ts:31](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L31)

## Properties

### configElements

> **configElements**: [`ConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/interfaces/ConfigElements.md)

Defined in: [src/rules.ts:41](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L41)

***

### configTab()?

> `optional` **configTab**: (`optionEl`, `rule`, `that`, `previewComponent`) => `void`

Defined in: [src/rules.ts:42](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L42)

#### Parameters

##### optionEl

`HTMLElement`

##### rule

[`FrontmatterAutomateRuleSettings`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/interfaces/FrontmatterAutomateRuleSettings.md)

##### that

`any`

##### previewComponent

`any`

#### Returns

`void`

***

### description

> **description**: `string`

Defined in: [src/rules.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L34)

***

### fx

> **fx**: `Function`

Defined in: [src/rules.ts:40](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L40)

***

### id

> **id**: `string`

Defined in: [src/rules.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L32)

***

### inputProperty?

> `optional` **inputProperty**: `boolean`

Defined in: [src/rules.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L36)

***

### isLiveRule?

> `optional` **isLiveRule**: `boolean`

Defined in: [src/rules.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L37)

***

### ruleType

> **ruleType**: [`FrontmatterAutomateRuleTypes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/type-aliases/FrontmatterAutomateRuleTypes.md)

Defined in: [src/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L33)

***

### source

> **source**: `string`

Defined in: [src/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L38)

***

### tooltip?

> `optional` **tooltip**: `string`

Defined in: [src/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L35)

***

### type

> **type**: [`ObsidianPropertyTypes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/type-aliases/ObsidianPropertyTypes.md)[]

Defined in: [src/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L39)
