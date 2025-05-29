[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [directorySelectionModal](../README.md) / DirectorySelectionModal

# Class: DirectorySelectionModal

Defined in: [src/directorySelectionModal.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/directorySelectionModal.ts#L36)

Obsidian Modal for selecting directories and files from the vault structure.

## Extends

- `Modal`

## Constructors

### Constructor

> **new DirectorySelectionModal**(`app`, `initialFolders`, `initialFiles`, `initialOptions`, `okCallback`): `DirectorySelectionModal`

Defined in: [src/directorySelectionModal.ts:66](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/directorySelectionModal.ts#L66)

Creates an instance of the DirectorySelectionModal.

#### Parameters

##### app

`App`

The Obsidian App instance.

##### initialFolders

`string`[]

Array of initially selected folder paths.

##### initialFiles

`string`[]

Array of initially selected file paths.

##### initialOptions

[`DirectorySelectionOptions`](../interfaces/DirectorySelectionOptions.md)

##### okCallback

(`result`) => `void`

Function to call when the user clicks "OK". Receives the selection result.

#### Returns

`DirectorySelectionModal`

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

Defined in: [src/directorySelectionModal.ts:658](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/directorySelectionModal.ts#L658)

Called when the modal is closed. Cleans up resources.

#### Returns

`void`

#### Overrides

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `void`

Defined in: [src/directorySelectionModal.ts:110](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/directorySelectionModal.ts#L110)

Called when the modal is opened. Builds the UI.

#### Returns

`void`

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
