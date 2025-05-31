[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [editorModal](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/editorModal/README.md) / openCodeEditorModal

# Function: openCodeEditorModal()

> **openCodeEditorModal**(`app`, `plugin`, `initialCode`, `expectedType`, `activeFile`, `frontmatter`, `okCallback`): `void`

Defined in: [src/editorModal.ts:359](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/editorModal.ts#L359)

Helper function to easily open the Directory Selection Modal.

## Parameters

### app

`App`

The Obsidian App instance.

### plugin

`any`

### initialCode

`string`

String with the initial code.

### expectedType

[`ObsidianPropertyTypes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/type-aliases/ObsidianPropertyTypes.md)

Expected return type.

### activeFile

`null` | `TFile` | `TFolder`

### frontmatter

`any`

### okCallback

(`result`) => `void`

Function to call when the user clicks "OK". Receives the selection result.

## Returns

`void`
