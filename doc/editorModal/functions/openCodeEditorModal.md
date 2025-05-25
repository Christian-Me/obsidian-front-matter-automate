[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [editorModal](../README.md) / openCodeEditorModal

# Function: openCodeEditorModal()

> **openCodeEditorModal**(`app`, `plugin`, `initialCode`, `expectedType`, `activeFile`, `frontmatter`, `okCallback`): `void`

Defined in: [src/editorModal.ts:359](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/editorModal.ts#L359)

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

[`ObsidianPropertyTypes`](../../types/type-aliases/ObsidianPropertyTypes.md)

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
