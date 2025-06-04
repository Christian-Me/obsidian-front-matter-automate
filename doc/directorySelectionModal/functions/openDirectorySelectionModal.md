[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [directorySelectionModal](../README.md) / openDirectorySelectionModal

# Function: openDirectorySelectionModal()

> **openDirectorySelectionModal**(`app`, `initialFolders`, `initialFiles`, `options`, `okCallback`): `void`

Defined in: [src/directorySelectionModal.ts:684](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/directorySelectionModal.ts#L684)

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
