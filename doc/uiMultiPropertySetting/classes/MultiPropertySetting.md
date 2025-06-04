[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [uiMultiPropertySetting](../README.md) / MultiPropertySetting

# Class: MultiPropertySetting

Defined in: [src/uiMultiPropertySetting.ts:4](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L4)

## Constructors

### Constructor

> **new MultiPropertySetting**(`container`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:20](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L20)

#### Parameters

##### container

`HTMLElement`

#### Returns

`MultiPropertySetting`

## Properties

### settingEl

> **settingEl**: `HTMLElement`

Defined in: [src/uiMultiPropertySetting.ts:5](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L5)

## Methods

### addExtraButton()

> **addExtraButton**(`cb`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:56](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L56)

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

Defined in: [src/uiMultiPropertySetting.ts:47](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L47)

#### Parameters

##### cb

(`val`) => `void`

#### Returns

`MultiPropertySetting`

***

### setDesc()

> **setDesc**(`desc`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:30](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L30)

#### Parameters

##### desc

`string`

#### Returns

`MultiPropertySetting`

***

### setName()

> **setName**(`name`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:25](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L25)

#### Parameters

##### name

`string`

#### Returns

`MultiPropertySetting`

***

### setOptions()

> **setOptions**(`options`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:41](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L41)

#### Parameters

##### options

`string`[] | `object`[]

#### Returns

`MultiPropertySetting`

***

### setValue()

> **setValue**(`value`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L35)

#### Parameters

##### value

`string`[]

#### Returns

`MultiPropertySetting`

***

### styleDisabled()

> **styleDisabled**(`el`, `disabled`): `void`

Defined in: [src/uiMultiPropertySetting.ts:62](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiMultiPropertySetting.ts#L62)

#### Parameters

##### el

`ExtraButtonComponent`

##### disabled

`boolean`

#### Returns

`void`
