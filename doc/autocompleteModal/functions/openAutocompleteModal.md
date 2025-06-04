[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [autocompleteModal](../README.md) / openAutocompleteModal

# Function: openAutocompleteModal()

> **openAutocompleteModal**(`app`, `plugin`, `rule`, `options`, `activeFile`, `frontmatter`): `Promise`\<`null` \| [`autocompleteModalResult`](../interfaces/autocompleteModalResult.md)\>

Defined in: [src/autocompleteModal.ts:248](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/autocompleteModal.ts#L248)

Opens an autocomplete modal for selecting or entering values based on the provided parameters.

## Parameters

### app

The Obsidian application instance.

`undefined` | `App`

### plugin

`any`

The plugin instance that is invoking the modal.

### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

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

`Promise`\<`null` \| [`autocompleteModalResult`](../interfaces/autocompleteModalResult.md)\>

A promise that resolves to the result of the autocomplete modal, or `null` if no selection was made.
