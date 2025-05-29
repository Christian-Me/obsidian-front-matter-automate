[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [editorModal](../README.md) / codeEditorModal

# Class: codeEditorModal

Defined in: [src/editorModal.ts:23](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/editorModal.ts#L23)

Obsidian Modal for selecting directories and files from the vault structure.

## Extends

- `Modal`

## Constructors

### Constructor

> **new codeEditorModal**(`app`, `plugin`, `initialCode`, `expectedType`, `activeFile`, `frontmatter`, `okCallback`): `codeEditorModal`

Defined in: [src/editorModal.ts:55](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/editorModal.ts#L55)

Creates an instance of the DirectorySelectionModal.

#### Parameters

##### app

`App`

The Obsidian App instance.

##### plugin

`any`

The plugin instance.

##### initialCode

`string`

String with the initial code.

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

### loadCodeMirrorMode()

> **loadCodeMirrorMode**(`mode`): `void`

Defined in: [src/editorModal.ts:107](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/editorModal.ts#L107)

#### Parameters

##### mode

`string`

#### Returns

`void`

***

### onClose()

> **onClose**(): `void`

Defined in: [src/editorModal.ts:337](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/editorModal.ts#L337)

Called when the modal is closed. Cleans up resources.

#### Returns

`void`

#### Overrides

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `Promise`\<`void`\>

Defined in: [src/editorModal.ts:119](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/editorModal.ts#L119)

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

***

### updateTypeIcons()

> **updateTypeIcons**(`value`, `container`, `expectedType`, `currentType`, `settings`): `void`

Defined in: [src/editorModal.ts:261](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/editorModal.ts#L261)

#### Parameters

##### value

`any`

##### container

`HTMLDivElement`

##### expectedType

[`ObsidianPropertyTypes`](../../types/type-aliases/ObsidianPropertyTypes.md)

##### currentType

[`ObsidianPropertyTypes`](../../types/type-aliases/ObsidianPropertyTypes.md)

##### settings

`any`

#### Returns

`void`
