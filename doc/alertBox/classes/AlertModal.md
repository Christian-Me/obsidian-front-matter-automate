[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [alertBox](../README.md) / AlertModal

# Class: AlertModal

Defined in: [src/alertBox.ts:6](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/alertBox.ts#L6)

display an Alert Modal

## Extends

- `Modal`

## Constructors

### Constructor

> **new AlertModal**(`app`, `title`, `description`, `btn1`, `btn2`, `askAgainLabel?`): `AlertModal`

Defined in: [src/alertBox.ts:16](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/alertBox.ts#L16)

#### Parameters

##### app

`App`

##### title

`string`

##### description

`string`

##### btn1

`string`

##### btn2

`string`

##### askAgainLabel?

`string`

#### Returns

`AlertModal`

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

Defined in: [src/alertBox.ts:60](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/alertBox.ts#L60)

#### Returns

`void`

#### Overrides

`Modal.onClose`

***

### onOpen()

> **onOpen**(): `void`

Defined in: [src/alertBox.ts:28](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/alertBox.ts#L28)

#### Returns

`void`

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

### openAndGetValue()

> **openAndGetValue**(): `Promise`\<\{ `data`: `any`; `proceed`: `boolean`; \}\>

Defined in: [src/alertBox.ts:65](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/alertBox.ts#L65)

#### Returns

`Promise`\<\{ `data`: `any`; `proceed`: `boolean`; \}\>

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
