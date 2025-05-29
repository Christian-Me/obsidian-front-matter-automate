[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [suggesters/FileSuggester](../README.md) / FileSuggest

# Class: FileSuggest

Defined in: [src/suggesters/FileSuggester.ts:15](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L15)

## Extends

- [`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md)\<`TFile`\>

## Constructors

### Constructor

> **new FileSuggest**(`inputEl`, `plugin`, `folder`): `FileSuggest`

Defined in: [src/suggesters/FileSuggester.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L17)

#### Parameters

##### inputEl

`HTMLInputElement`

##### plugin

`FolderTagPlugin`

##### folder

`string`

#### Returns

`FileSuggest`

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`constructor`](../../suggest/classes/TextInputSuggest.md#constructor)

## Properties

### app

> `protected` **app**: `App`

Defined in: [src/suggesters/suggest.ts:114](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/suggest.ts#L114)

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`app`](../../suggest/classes/TextInputSuggest.md#app)

***

### inputEl

> **inputEl**: `HTMLInputElement`

Defined in: [src/suggesters/FileSuggester.ts:18](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L18)

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`inputEl`](../../suggest/classes/TextInputSuggest.md#inputel)

## Methods

### close()

> **close**(): `void`

Defined in: [src/suggesters/suggest.ts:192](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/suggest.ts#L192)

#### Returns

`void`

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`close`](../../suggest/classes/TextInputSuggest.md#close)

***

### get\_error\_msg()

> **get\_error\_msg**(): `string`

Defined in: [src/suggesters/FileSuggester.ts:25](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L25)

#### Returns

`string`

***

### getSuggestions()

> **getSuggestions**(`input_str`): `TFile`[]

Defined in: [src/suggesters/FileSuggester.ts:29](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L29)

#### Parameters

##### input\_str

`string`

#### Returns

`TFile`[]

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`getSuggestions`](../../suggest/classes/TextInputSuggest.md#getsuggestions)

***

### onInputChanged()

> **onInputChanged**(): `void`

Defined in: [src/suggesters/suggest.ts:145](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/suggest.ts#L145)

#### Returns

`void`

#### Inherited from

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`onInputChanged`](../../suggest/classes/TextInputSuggest.md#oninputchanged)

***

### open()

> **open**(`container`, `inputEl`): `void`

Defined in: [src/suggesters/suggest.ts:163](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/suggest.ts#L163)

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

Defined in: [src/suggesters/FileSuggester.ts:56](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L56)

Render the suggestion item into DOM.

#### Parameters

##### file

`TFile`

##### el

`HTMLElement`

#### Returns

`void`

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`renderSuggestion`](../../suggest/classes/TextInputSuggest.md#rendersuggestion)

***

### selectSuggestion()

> **selectSuggestion**(`file`): `void`

Defined in: [src/suggesters/FileSuggester.ts:60](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/suggesters/FileSuggester.ts#L60)

Called when the user makes a selection.

#### Parameters

##### file

`TFile`

#### Returns

`void`

#### Overrides

[`TextInputSuggest`](../../suggest/classes/TextInputSuggest.md).[`selectSuggestion`](../../suggest/classes/TextInputSuggest.md#selectsuggestion)
