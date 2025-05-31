[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [uiMultiPropertySetting](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/uiMultiPropertySetting/README.md) / MultiPropertySetting

# Class: MultiPropertySetting

Defined in: [src/uiMultiPropertySetting.ts:4](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L4)

## Constructors

### Constructor

> **new MultiPropertySetting**(`container`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:14](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L14)

#### Parameters

##### container

`HTMLElement`

#### Returns

`MultiPropertySetting`

## Properties

### settingEl

> **settingEl**: `HTMLElement`

Defined in: [src/uiMultiPropertySetting.ts:5](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L5)

## Methods

### addExtraButton()

> **addExtraButton**(`cb`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:50](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L50)

Allows adding extra buttons to each row.
The callback receives the Setting and the row index.

#### Parameters

##### cb

(`setting`, `idx`) => `void`

#### Returns

`MultiPropertySetting`

***

### onChange()

> **onChange**(`cb`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:41](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L41)

#### Parameters

##### cb

(`val`) => `void`

#### Returns

`MultiPropertySetting`

***

### setDesc()

> **setDesc**(`desc`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:24](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L24)

#### Parameters

##### desc

`string`

#### Returns

`MultiPropertySetting`

***

### setName()

> **setName**(`name`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:19](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L19)

#### Parameters

##### name

`string`

#### Returns

`MultiPropertySetting`

***

### setOptions()

> **setOptions**(`options`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L35)

#### Parameters

##### options

`string`[] | `object`[]

#### Returns

`MultiPropertySetting`

***

### setValue()

> **setValue**(`value`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:29](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L29)

#### Parameters

##### value

`string`[]

#### Returns

`MultiPropertySetting`

***

### styleDisabled()

> **styleDisabled**(`el`, `disabled`): `void`

Defined in: [src/uiMultiPropertySetting.ts:56](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/uiMultiPropertySetting.ts#L56)

#### Parameters

##### el

`ExtraButtonComponent`

##### disabled

`boolean`

#### Returns

`void`
