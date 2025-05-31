[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [simpleModal](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/simpleModal/README.md) / openCodeEditorModal

# Function: openCodeEditorModal()

> **openCodeEditorModal**(`app`, `plugin`, `expectedType`, `activeFile`, `frontmatter`, `okCallback`): `void`

Defined in: [src/simpleModal.ts:177](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/simpleModal.ts#L177)

Helper function to easily open the Directory Selection Modal.

## Parameters

### app

`App`

The Obsidian App instance.

### plugin

`any`

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
