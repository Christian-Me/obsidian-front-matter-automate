[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [uiMultiPropertySetting](../README.md) / MultiPropertySetting

# Class: MultiPropertySetting

Defined in: [src/uiMultiPropertySetting.ts:4](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L4)

## Constructors

### Constructor

> **new MultiPropertySetting**(`container`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L34)

#### Parameters

##### container

`HTMLElement`

#### Returns

`MultiPropertySetting`

## Properties

### settingEl

> **settingEl**: `HTMLElement`

Defined in: [src/uiMultiPropertySetting.ts:5](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L5)

## Methods

### addExtraButton()

> **addExtraButton**(`cb`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:80](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L80)

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

Defined in: [src/uiMultiPropertySetting.ts:61](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L61)

#### Parameters

##### cb

(`val`) => `void`

#### Returns

`MultiPropertySetting`

***

### onRenderRow()

> **onRenderRow**(`cb`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:66](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L66)

#### Parameters

##### cb

(`setting`, `value`, `idx`, `onChange`) => `void`

#### Returns

`MultiPropertySetting`

***

### setDesc()

> **setDesc**(`desc`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:44](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L44)

#### Parameters

##### desc

`string`

#### Returns

`MultiPropertySetting`

***

### setName()

> **setName**(`name`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L39)

#### Parameters

##### name

`string`

#### Returns

`MultiPropertySetting`

***

### setOptions()

> **setOptions**(`options`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:55](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L55)

#### Parameters

##### options

`string`[] | `object`[]

#### Returns

`MultiPropertySetting`

***

### setValue()

> **setValue**(`value`): `MultiPropertySetting`

Defined in: [src/uiMultiPropertySetting.ts:49](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L49)

#### Parameters

##### value

`string`[]

#### Returns

`MultiPropertySetting`

***

### styleDisabled()

> **styleDisabled**(`el`, `disabled`): `void`

Defined in: [src/uiMultiPropertySetting.ts:86](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L86)

#### Parameters

##### el

`ExtraButtonComponent`

##### disabled

`boolean`

#### Returns

`void`

***

### updatePlusButtonState()

> **updatePlusButtonState**(): `void`

Defined in: [src/uiMultiPropertySetting.ts:97](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/uiMultiPropertySetting.ts#L97)

#### Returns

`void`
