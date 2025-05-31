[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [suggesters/suggest](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/suggesters/suggest/README.md) / TextInputSuggest

# Class: `abstract` TextInputSuggest\<T\>

Defined in: [src/suggesters/suggest.ts:113](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L113)

## Extended by

- [`FileSuggest`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/suggesters/FileSuggester/classes/FileSuggest.md)
- [`FolderSuggest`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/suggesters/FolderSuggester/classes/FolderSuggest.md)

## Type Parameters

### T

`T`

## Implements

- `ISuggestOwner`\<`T`\>

## Constructors

### Constructor

> **new TextInputSuggest**\<`T`\>(`app`, `inputEl`): `TextInputSuggest`\<`T`\>

Defined in: [src/suggesters/suggest.ts:122](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L122)

#### Parameters

##### app

`App`

##### inputEl

`HTMLInputElement` | `HTMLTextAreaElement`

#### Returns

`TextInputSuggest`\<`T`\>

## Properties

### app

> `protected` **app**: `App`

Defined in: [src/suggesters/suggest.ts:114](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L114)

***

### inputEl

> `protected` **inputEl**: `HTMLInputElement` \| `HTMLTextAreaElement`

Defined in: [src/suggesters/suggest.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L115)

## Methods

### close()

> **close**(): `void`

Defined in: [src/suggesters/suggest.ts:192](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L192)

#### Returns

`void`

***

### getSuggestions()

> `abstract` **getSuggestions**(`inputStr`): `T`[]

Defined in: [src/suggesters/suggest.ts:200](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L200)

#### Parameters

##### inputStr

`string`

#### Returns

`T`[]

***

### onInputChanged()

> **onInputChanged**(): `void`

Defined in: [src/suggesters/suggest.ts:145](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L145)

#### Returns

`void`

***

### open()

> **open**(`container`, `inputEl`): `void`

Defined in: [src/suggesters/suggest.ts:163](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L163)

#### Parameters

##### container

`HTMLElement`

##### inputEl

`HTMLElement`

#### Returns

`void`

***

### renderSuggestion()

> `abstract` **renderSuggestion**(`item`, `el`): `void`

Defined in: [src/suggesters/suggest.ts:201](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L201)

Render the suggestion item into DOM.

#### Parameters

##### item

`T`

##### el

`HTMLElement`

#### Returns

`void`

#### Implementation of

`ISuggestOwner.renderSuggestion`

***

### selectSuggestion()

> `abstract` **selectSuggestion**(`item`): `void`

Defined in: [src/suggesters/suggest.ts:202](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/suggesters/suggest.ts#L202)

Called when the user makes a selection.

#### Parameters

##### item

`T`

#### Returns

`void`

#### Implementation of

`ISuggestOwner.selectSuggestion`
