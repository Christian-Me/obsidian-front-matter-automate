[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [directorySelectionModal](../README.md) / openDirectorySelectionModal

# Function: openDirectorySelectionModal()

> **openDirectorySelectionModal**(`app`, `initialFolders`, `initialFiles`, `options`, `okCallback`): `void`

Defined in: [src/directorySelectionModal.ts:684](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/directorySelectionModal.ts#L684)

Helper function to easily open the Directory Selection Modal.

## Parameters

### app

`App`

The Obsidian App instance.

### initialFolders

`string`[]

Array of initially selected folder paths.

### initialFiles

`string`[]

Array of initially selected file paths.

### options

[`DirectorySelectionOptions`](../interfaces/DirectorySelectionOptions.md)

### okCallback

(`result`) => `void`

Function to call when the user clicks "OK". Receives the selection result.

## Returns

`void`
