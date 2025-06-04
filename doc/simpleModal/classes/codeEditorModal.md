[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [simpleModal](../README.md) / codeEditorModal

# Class: codeEditorModal

Defined in: [src/simpleModal.ts:16](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/simpleModal.ts#L16)

Obsidian Modal for selecting directories and files from the vault structure.

## Extends

- `Modal`

## Constructors

### Constructor

> **new codeEditorModal**(`app`, `plugin`, `expectedType`, `activeFile`, `frontmatter`, `okCallback`): `codeEditorModal`

Defined in: [src/simpleModal.ts:41](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/simpleModal.ts#L41)

Creates an instance of the DirectorySelectionModal.

#### Parameters

##### app

`App`

The Obsidian App instance.

##### plugin

`any`

The plugin instance.

##### expectedType

[`ObsidianPropertyTypes`](../../types/type-aliases/ObsidianPropertyTypes.md)

Expected return type.

##### activeFile

The currently active file or folder.

`null` | `TFile` | `TFolder`

##### frontmatter

`any`

Frontmatter data for the active file.

##### okCallback

(`result`) => `void`

Function to call when the user clicks "OK". Receives the selection result.

#### Returns

`codeEditorModal`

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

Defined in: [src/simpleModal.ts:157](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/simpleModal.ts#L157)

Called when the modal is closed. Cleans up resources.

#### Returns

`void`

#### Overrides

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `Promise`\<`void`\>

Defined in: [src/simpleModal.ts:77](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/simpleModal.ts#L77)

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
