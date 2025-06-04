[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [frontmatter-tools](../README.md) / SelectProperty

# Class: SelectProperty

Defined in: [src/frontmatter-tools.ts:245](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L245)

## Extends

- `SuggestModal`\<[`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)\>

## Constructors

### Constructor

> **new SelectProperty**(`app`, `knownProperties`, `property`, `onSubmit`): `SelectProperty`

Defined in: [src/frontmatter-tools.ts:252](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L252)

#### Parameters

##### app

`App`

##### knownProperties

[`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)[]

##### property

`undefined` | [`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)

##### onSubmit

(`result`) => `void`

#### Returns

`SelectProperty`

#### Overrides

`SuggestModal<PropertyTypeInfo>.constructor`

## Properties

### app

> **app**: `App`

Defined in: node\_modules/obsidian/obsidian.d.ts:2868

#### Inherited from

`SuggestModal.app`

***

### containerEl

> **containerEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2876

#### Inherited from

`SuggestModal.containerEl`

***

### contentEl

> **contentEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2889

#### Inherited from

`SuggestModal.contentEl`

***

### emptyStateText

> **emptyStateText**: `string`

Defined in: node\_modules/obsidian/obsidian.d.ts:4012

#### Inherited from

`SuggestModal.emptyStateText`

***

### inputEl

> **inputEl**: `HTMLInputElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:4017

#### Inherited from

`SuggestModal.inputEl`

***

### knownProperties

> **knownProperties**: [`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)[]

Defined in: [src/frontmatter-tools.ts:248](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L248)

***

### limit

> **limit**: `number`

Defined in: node\_modules/obsidian/obsidian.d.ts:4008

#### Inherited from

`SuggestModal.limit`

***

### modalEl

> **modalEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2880

#### Inherited from

`SuggestModal.modalEl`

***

### newTextFlag

> **newTextFlag**: `Boolean`

Defined in: [src/frontmatter-tools.ts:250](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L250)

***

### property

> **property**: `undefined` \| [`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)

Defined in: [src/frontmatter-tools.ts:247](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L247)

***

### resultContainerEl

> **resultContainerEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:4022

#### Inherited from

`SuggestModal.resultContainerEl`

***

### scope

> **scope**: `Scope`

Defined in: node\_modules/obsidian/obsidian.d.ts:2872

#### Inherited from

`SuggestModal.scope`

***

### shouldRestoreSelection

> **shouldRestoreSelection**: `boolean`

Defined in: node\_modules/obsidian/obsidian.d.ts:2894

#### Inherited from

`SuggestModal.shouldRestoreSelection`

***

### titleEl

> **titleEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2885

#### Inherited from

`SuggestModal.titleEl`

***

### typedText

> **typedText**: `string`

Defined in: [src/frontmatter-tools.ts:249](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L249)

## Methods

### close()

> **close**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2910

Hide the modal.

#### Returns

`void`

#### Inherited from

`SuggestModal.close`

***

### getSuggestions()

> **getSuggestions**(`query`): [`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)[]

Defined in: [src/frontmatter-tools.ts:261](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L261)

#### Parameters

##### query

`string`

#### Returns

[`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)[]

#### Overrides

`SuggestModal.getSuggestions`

***

### onChooseSuggestion()

> **onChooseSuggestion**(`property`, `evt`): `void`

Defined in: [src/frontmatter-tools.ts:289](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L289)

#### Parameters

##### property

[`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)

##### evt

`MouseEvent` | `KeyboardEvent`

#### Returns

`void`

#### Overrides

`SuggestModal.onChooseSuggestion`

***

### onClose()

> **onClose**(): `void`

Defined in: [src/frontmatter-tools.ts:280](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L280)

#### Returns

`void`

#### Overrides

`SuggestModal.onClose`

***

### onNoSuggestion()

> **onNoSuggestion**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:4040

#### Returns

`void`

#### Inherited from

`SuggestModal.onNoSuggestion`

***

### onOpen()

> **onOpen**(): `void`

Defined in: [src/frontmatter-tools.ts:267](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L267)

#### Returns

`void`

#### Overrides

`SuggestModal.onOpen`

***

### open()

> **open**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2904

Show the modal on the the active window. On mobile, the modal will animate on screen.

#### Returns

`void`

#### Inherited from

`SuggestModal.open`

***

### renderSuggestion()

> **renderSuggestion**(`property`, `el`): `void`

Defined in: [src/frontmatter-tools.ts:276](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/frontmatter-tools.ts#L276)

#### Parameters

##### property

[`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)

##### el

`HTMLElement`

#### Returns

`void`

#### Overrides

`SuggestModal.renderSuggestion`

***

### selectActiveSuggestion()

> **selectActiveSuggestion**(`evt`): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:4048

#### Parameters

##### evt

`MouseEvent` | `KeyboardEvent`

#### Returns

`void`

#### Inherited from

`SuggestModal.selectActiveSuggestion`

***

### selectSuggestion()

> **selectSuggestion**(`value`, `evt`): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:4044

#### Parameters

##### value

[`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)

##### evt

`MouseEvent` | `KeyboardEvent`

#### Returns

`void`

#### Inherited from

`SuggestModal.selectSuggestion`

***

### setContent()

> **setContent**(`content`): `this`

Defined in: node\_modules/obsidian/obsidian.d.ts:2927

#### Parameters

##### content

`string` | `DocumentFragment`

#### Returns

`this`

#### Inherited from

`SuggestModal.setContent`

***

### setInstructions()

> **setInstructions**(`instructions`): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:4035

#### Parameters

##### instructions

`Instruction`[]

#### Returns

`void`

#### Inherited from

`SuggestModal.setInstructions`

***

### setPlaceholder()

> **setPlaceholder**(`placeholder`): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:4031

#### Parameters

##### placeholder

`string`

#### Returns

`void`

#### Inherited from

`SuggestModal.setPlaceholder`

***

### setTitle()

> **setTitle**(`title`): `this`

Defined in: node\_modules/obsidian/obsidian.d.ts:2923

#### Parameters

##### title

`string`

#### Returns

`this`

#### Inherited from

`SuggestModal.setTitle`
