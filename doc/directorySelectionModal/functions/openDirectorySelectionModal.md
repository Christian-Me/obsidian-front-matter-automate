[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [directorySelectionModal](../README.md) / openDirectorySelectionModal

# Function: openDirectorySelectionModal()

> **openDirectorySelectionModal**(`app`, `initialFolders`, `initialFiles`, `options`, `okCallback`): `void`

Defined in: [src/directorySelectionModal.ts:684](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/directorySelectionModal.ts#L684)

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
