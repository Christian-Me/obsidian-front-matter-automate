[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [suggesters/FolderSuggester](../README.md) / FolderSuggest

# Class: FolderSuggest

Defined in: [src/suggesters/FolderSuggester.ts:7](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/FolderSuggester.ts#L7)

## Extends

- [`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md)\<`TFolder`\>

## Constructors

### Constructor

> **new FolderSuggest**(`app`, `inputEl`): `FolderSuggest`

Defined in: [src/suggesters/FolderSuggester.ts:8](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/FolderSuggester.ts#L8)

#### Parameters

##### app

`App`

##### inputEl

`HTMLInputElement` | `HTMLTextAreaElement`

#### Returns

`FolderSuggest`

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`constructor`](../../suggest/classes/TextInputSuggest.md#constructor)

## Properties

### app

> `protected` **app**: `App`

Defined in: [src/suggesters/suggest.ts:114](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/suggest.ts#L114)

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`app`](../../suggest/classes/TextInputSuggest.md#app)

***

### inputEl

> `protected` **inputEl**: `HTMLInputElement` \| `HTMLTextAreaElement`

Defined in: [src/suggesters/suggest.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/suggest.ts#L115)

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`inputEl`](../../suggest/classes/TextInputSuggest.md#inputel)

## Methods

### close()

> **close**(): `void`

Defined in: [src/suggesters/suggest.ts:192](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/suggest.ts#L192)

#### Returns

`void`

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`close`](../../suggest/classes/TextInputSuggest.md#close)

***

### getSuggestions()

> **getSuggestions**(`inputStr`): `TFolder`[]

Defined in: [src/suggesters/FolderSuggester.ts:12](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/FolderSuggester.ts#L12)

#### Parameters

##### inputStr

`string`

#### Returns

`TFolder`[]

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`getSuggestions`](../../suggest/classes/TextInputSuggest.md#getsuggestions)

***

### onInputChanged()

> **onInputChanged**(): `void`

Defined in: [src/suggesters/suggest.ts:145](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/suggest.ts#L145)

#### Returns

`void`

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`onInputChanged`](../../suggest/classes/TextInputSuggest.md#oninputchanged)

***

### open()

> **open**(`container`, `inputEl`): `void`

Defined in: [src/suggesters/suggest.ts:163](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/suggest.ts#L163)

#### Parameters

##### container

`HTMLElement`

##### inputEl

`HTMLElement`

#### Returns

`void`

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`open`](../../suggest/classes/TextInputSuggest.md#open)

***

### renderSuggestion()

> **renderSuggestion**(`file`, `el`): `void`

Defined in: [src/suggesters/FolderSuggester.ts:29](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/FolderSuggester.ts#L29)

Render the suggestion item into DOM.

#### Parameters

##### file

`TFolder`

##### el

`HTMLElement`

#### Returns

`void`

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`renderSuggestion`](../../suggest/classes/TextInputSuggest.md#rendersuggestion)

***

### selectSuggestion()

> **selectSuggestion**(`file`): `void`

Defined in: [src/suggesters/FolderSuggester.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/suggesters/FolderSuggester.ts#L33)

Called when the user makes a selection.

#### Parameters

##### file

`TFolder`

#### Returns

`void`

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`selectSuggestion`](../../suggest/classes/TextInputSuggest.md#selectsuggestion)
