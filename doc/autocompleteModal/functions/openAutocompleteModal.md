[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [autocompleteModal](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/autocompleteModal/README.md) / openAutocompleteModal

# Function: openAutocompleteModal()

> **openAutocompleteModal**(`app`, `plugin`, `rule`, `options`, `activeFile`, `frontmatter`): `Promise`\<`null` \| [`autocompleteModalResult`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/autocompleteModal/interfaces/autocompleteModalResult.md)\>

Defined in: [src/autocompleteModal.ts:248](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/autocompleteModal.ts#L248)

Opens an autocomplete modal for selecting or entering values based on the provided parameters.

## Parameters

### app

The Obsidian application instance.

`undefined` | `App`

### plugin

`any`

The plugin instance that is invoking the modal.

### rule

[`FrontmatterAutomateRuleSettings`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/interfaces/FrontmatterAutomateRuleSettings.md)

The folder-to-tag rule definition to be used in the modal.

### options

`any`

### activeFile

The currently active file or folder, if any.

`undefined` | `TFile` | `TFolder`

### frontmatter

`any`

The frontmatter data associated with the active file.

## Returns

`Promise`\<`null` \| [`autocompleteModalResult`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/autocompleteModal/interfaces/autocompleteModalResult.md)\>

A promise that resolves to the result of the autocomplete modal, or `null` if no selection was made.
