[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [Log](../README.md) / Logger

# Class: Logger

Defined in: [src/Log.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L35)

## Constructors

### Constructor

> **new Logger**(): `Logger`

#### Returns

`Logger`

## Methods

### getLevel()

> **getLevel**(): [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [src/Log.ts:53](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L53)

#### Returns

[`LogLevel`](../type-aliases/LogLevel.md)

***

### getLevelByIndex()

> **getLevelByIndex**(`levelIndex`): [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [src/Log.ts:66](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L66)

#### Parameters

##### levelIndex

`number`

#### Returns

[`LogLevel`](../type-aliases/LogLevel.md)

***

### getLevelByName()

> **getLevelByName**(`levelName`): [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [src/Log.ts:57](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L57)

#### Parameters

##### levelName

`string`

#### Returns

[`LogLevel`](../type-aliases/LogLevel.md)

***

### getLevelByValue()

> **getLevelByValue**(`levelValue`): [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [src/Log.ts:75](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L75)

#### Parameters

##### levelValue

`number`

#### Returns

[`LogLevel`](../type-aliases/LogLevel.md)

***

### getLevelName()

> **getLevelName**(`level`): `string`

Defined in: [src/Log.ts:89](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L89)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

#### Returns

`string`

***

### getLevelNames()

> **getLevelNames**(): `string`[]

Defined in: [src/Log.ts:101](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L101)

#### Returns

`string`[]

***

### groupCollapsed()

> **groupCollapsed**(`level`, ...`msg`): `void`

Defined in: [src/Log.ts:160](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L160)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### msg

...`any`[]

#### Returns

`void`

***

### groupEnd()

> **groupEnd**(): `void`

Defined in: [src/Log.ts:177](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L177)

#### Returns

`void`

***

### log()

> **log**(`level`, ...`msg`): `void`

Defined in: [src/Log.ts:105](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L105)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### msg

...`any`[]

#### Returns

`void`

***

### logError()

> **logError**(`e`): `void`

Defined in: [src/Log.ts:185](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L185)

#### Parameters

##### e

[`ErrorManager`](../../Error/classes/ErrorManager.md) | `Error`

#### Returns

`void`

***

### logUpdate()

> **logUpdate**(`msg`): `void`

Defined in: [src/Log.ts:181](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L181)

#### Parameters

##### msg

`string`

#### Returns

`void`

***

### setLevel()

> **setLevel**(`level`): `void`

Defined in: [src/Log.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/Log.ts#L38)

#### Parameters

##### level

`string` | `number`

#### Returns

`void`
