[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [uiMarkdownHelpModal](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/uiMarkdownHelpModal/README.md) / MarkdownHelpModal

# Class: MarkdownHelpModal

Defined in: [src/uiMarkdownHelpModal.ts:3](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMarkdownHelpModal.ts#L3)

## Extends

- `Modal`

## Constructors

### Constructor

> **new MarkdownHelpModal**(`app`, `markdown`, `sourcePath`): `MarkdownHelpModal`

Defined in: [src/uiMarkdownHelpModal.ts:6](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMarkdownHelpModal.ts#L6)

#### Parameters

##### app

`App`

##### markdown

`string`

##### sourcePath

`string` = `""`

#### Returns

`MarkdownHelpModal`

#### Overrides

`Modal.constructor`

## Properties

### app

> **app**: `App`

Defined in: node\_modules/obsidian/obsidian.d.ts:2868

#### Inherited from

`Modal.app`

***

### containerEl

> **containerEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2876

#### Inherited from

`Modal.containerEl`

***

### contentEl

> **contentEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2889

#### Inherited from

`Modal.contentEl`

***

### markdown

> **markdown**: `string`

Defined in: [src/uiMarkdownHelpModal.ts:4](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMarkdownHelpModal.ts#L4)

***

### modalEl

> **modalEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2880

#### Inherited from

`Modal.modalEl`

***

### scope

> **scope**: `Scope`

Defined in: node\_modules/obsidian/obsidian.d.ts:2872

#### Inherited from

`Modal.scope`

***

### shouldRestoreSelection

> **shouldRestoreSelection**: `boolean`

Defined in: node\_modules/obsidian/obsidian.d.ts:2894

#### Inherited from

`Modal.shouldRestoreSelection`

***

### sourcePath

> **sourcePath**: `string`

Defined in: [src/uiMarkdownHelpModal.ts:5](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMarkdownHelpModal.ts#L5)

***

### titleEl

> **titleEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:2885

#### Inherited from

`Modal.titleEl`

## Methods

### close()

> **close**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2910

Hide the modal.

#### Returns

`void`

#### Inherited from

`Modal.close`

***

### onClose()

> **onClose**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2918

#### Returns

`void`

#### Inherited from

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `Promise`\<`void`\>

Defined in: [src/uiMarkdownHelpModal.ts:11](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMarkdownHelpModal.ts#L11)

#### Returns

`Promise`\<`void`\>

#### Overrides

`Modal.onOpen`

***

### open()

> **open**(): `void`

Defined in: node\_modules/obsidian/obsidian.d.ts:2904

Show the modal on the the active window. On mobile, the modal will animate on screen.

#### Returns

`void`

#### Inherited from

`Modal.open`

***

### setContent()

> **setContent**(`content`): `this`

Defined in: node\_modules/obsidian/obsidian.d.ts:2927

#### Parameters

##### content

`string` | `DocumentFragment`

#### Returns

`this`

#### Inherited from

`Modal.setContent`

***

### setTitle()

> **setTitle**(`title`): `this`

Defined in: node\_modules/obsidian/obsidian.d.ts:2923

#### Parameters

##### title

`string`

#### Returns

`this`

#### Inherited from

`Modal.setTitle`
