[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [autocompleteModal](../README.md) / AutocompleteModal

# Class: AutocompleteModal

Defined in: [src/autocompleteModal.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/autocompleteModal.ts#L17)

Obsidian Modal for selecting directories and files from the vault structure.

## Extends

- `Modal`

## Constructors

### Constructor

> **new AutocompleteModal**(`app`, `plugin`, `rule`, `options`, `activeFile`, `frontmatter`, `okCallback?`): `AutocompleteModal`

Defined in: [src/autocompleteModal.ts:51](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/autocompleteModal.ts#L51)

Creates an instance of the DirectorySelectionModal.

#### Parameters

##### app

`App`

The Obsidian App instance.

##### plugin

`any`

The plugin instance.

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### options

`any`

##### activeFile

The currently active file or folder.

`undefined` | `TFile` | `TFolder`

##### frontmatter

`any`

Frontmatter data for the active file.

##### okCallback?

(`result`) => `void`

Function to call when the user clicks "OK". Receives the selection result.

#### Returns

`AutocompleteModal`

#### Overrides

`Modal.constructor`

## Properties

### app

> **app**: `App`

Defined in: node\_modules/obsidian/obsidian.d.ts:2868

#### Inherited from

`Modal.app`

***

### containerEl

> **containerEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2876

#### Inherited from

`Modal.containerEl`

***

### contentEl

> **contentEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2889

#### Inherited from

`Modal.contentEl`

***

### modalEl

> **modalEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2880

#### Inherited from

`Modal.modalEl`

***

### scope

> **scope**: `Scope`

Defined in: node\_modules/obsidian/obsidian.d.ts:2872

#### Inherited from

`Modal.scope`

***

### shouldRestoreSelection

> **shouldRestoreSelection**: `boolean`

Defined in: node\_modules/obsidian/obsidian.d.ts:2894

#### Inherited from

`Modal.shouldRestoreSelection`

***

### titleEl

> **titleEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2885

#### Inherited from

`Modal.titleEl`

## Methods

### changeCallback()

> **changeCallback**(`propertyInfo`, `value`): `void`

Defined in: [src/autocompleteModal.ts:167](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/autocompleteModal.ts#L167)

#### Parameters

##### propertyInfo

`undefined` | [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)

##### value

`any`

#### Returns

`void`

***

### close()

> **close**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2910

Hide the modal.

#### Returns

`void`

#### Inherited from

`Modal.close`

***

### onClose()

> **onClose**(): `void`

Defined in: [src/autocompleteModal.ts:226](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/autocompleteModal.ts#L226)

Called when the modal is closed. Cleans up resources.

#### Returns

`void`

#### Overrides

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `Promise`\<`void`\>

Defined in: [src/autocompleteModal.ts:97](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/autocompleteModal.ts#L97)

Called when the modal is opened. Builds the UI.

#### Returns

`Promise`\<`void`\>

#### Overrides

`Modal.onOpen`

***

### open()

> **open**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2904

Show the modal on the the active window. On mobile, the modal will animate on screen.

#### Returns

`void`

#### Inherited from

`Modal.open`

***

### openAndGetValues()

> **openAndGetValues**(): `Promise`\<`null` \| [`autocompleteModalResult`](../interfaces/autocompleteModalResult.md)\>

Defined in: [src/autocompleteModal.ts:231](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/autocompleteModal.ts#L231)

#### Returns

`Promise`\<`null` \| [`autocompleteModalResult`](../interfaces/autocompleteModalResult.md)\>

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

`Modal.setContent`

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

`Modal.setTitle`
