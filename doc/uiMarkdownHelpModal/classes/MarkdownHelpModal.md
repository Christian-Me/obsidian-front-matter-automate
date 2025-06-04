[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [uiMarkdownHelpModal](../README.md) / MarkdownHelpModal

# Class: MarkdownHelpModal

Defined in: [src/uiMarkdownHelpModal.ts:5](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L5)

## Extends

- `Modal`

## Constructors

### Constructor

> **new MarkdownHelpModal**(`app`, `plugin`, `markdown`, `sourcePath`): `MarkdownHelpModal`

Defined in: [src/uiMarkdownHelpModal.ts:10](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L10)

#### Parameters

##### app

`App`

##### plugin

`any`

##### markdown

`string`

##### sourcePath

`string`

#### Returns

`MarkdownHelpModal`

#### Overrides

`Modal.constructor`

## Properties

### app

> **app**: `App`

Defined in: [src/uiMarkdownHelpModal.ts:8](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L8)

#### Overrides

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

### markdown

> **markdown**: `string` = `""`

Defined in: [src/uiMarkdownHelpModal.ts:6](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L6)

***

### modalEl

> **modalEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2880

#### Inherited from

`Modal.modalEl`

***

### plugin

> **plugin**: `any`

Defined in: [src/uiMarkdownHelpModal.ts:9](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L9)

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

### sourcePath

> **sourcePath**: `string` = `""`

Defined in: [src/uiMarkdownHelpModal.ts:7](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L7)

***

### titleEl

> **titleEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2885

#### Inherited from

`Modal.titleEl`

## Methods

### close()

> **close**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2910

Hide the modal.

#### Returns

`void`

#### Inherited from

`Modal.close`

***

### fetchMarkdownFromGitHub()

> **fetchMarkdownFromGitHub**(`url`): `Promise`\<`string`\>

Defined in: [src/uiMarkdownHelpModal.ts:68](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L68)

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`string`\>

***

### onClose()

> **onClose**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2918

#### Returns

`void`

#### Inherited from

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `Promise`\<`void`\>

Defined in: [src/uiMarkdownHelpModal.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L17)

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

### readPluginDocFile()

> **readPluginDocFile**(`filename`): `Promise`\<`string`\>

Defined in: [src/uiMarkdownHelpModal.ts:74](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMarkdownHelpModal.ts#L74)

#### Parameters

##### filename

`string`

#### Returns

`Promise`\<`string`\>

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
