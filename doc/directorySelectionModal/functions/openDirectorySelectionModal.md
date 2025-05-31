[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [directorySelectionModal](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/directorySelectionModal/README.md) / openDirectorySelectionModal

# Function: openDirectorySelectionModal()

> **openDirectorySelectionModal**(`app`, `initialFolders`, `initialFiles`, `options`, `okCallback`): `void`

Defined in: [src/directorySelectionModal.ts:684](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/directorySelectionModal.ts#L684)

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

[`DirectorySelectionOptions`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/directorySelectionModal/interfaces/DirectorySelectionOptions.md)

### okCallback

(`result`) => `void`

Function to call when the user clicks "OK". Receives the selection result.

## Returns

`void`
