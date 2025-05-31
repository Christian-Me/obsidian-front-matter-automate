[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [uiTreeHierarchySortableSettings](../README.md) / TreeHierarchySortableSettings

# Class: TreeHierarchySortableSettings

Defined in: [src/uiTreeHierarchySortableSettings.ts:29](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L29)

## Constructors

### Constructor

> **new TreeHierarchySortableSettings**(`container`, `data`, `rowRenderCb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:44](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L44)

#### Parameters

##### container

`HTMLElement`

##### data

[`TreeHierarchyData`](../type-aliases/TreeHierarchyData.md)

##### rowRenderCb

`RowRenderCallback`

#### Returns

`TreeHierarchySortableSettings`

## Properties

### settingEl

> **settingEl**: `HTMLElement`

Defined in: [src/uiTreeHierarchySortableSettings.ts:30](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L30)

## Methods

### addExtraButtonToHeader()

> **addExtraButtonToHeader**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:61](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L61)

#### Parameters

##### cb

(`btn`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### addFolder()

> **addFolder**(`name`, `parentId?`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:99](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L99)

#### Parameters

##### name

`string`

##### parentId?

`string`

#### Returns

`TreeHierarchySortableSettings`

***

### addRow()

> **addRow**(`folderId`, `keywords`, `payload?`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:70](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L70)

#### Parameters

##### folderId

`undefined` | `string`

##### keywords

`string`[] = `[]`

##### payload?

`any`

#### Returns

`TreeHierarchySortableSettings`

***

### onChange()

> **onChange**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:118](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L118)

#### Parameters

##### cb

(`data`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onDeleteBt()

> **onDeleteBt**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:66](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L66)

#### Parameters

##### cb

() => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRendered()

> **onRendered**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:130](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L130)

#### Parameters

##### cb

() => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRowCreated()

> **onRowCreated**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:122](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L122)

#### Parameters

##### cb

(`row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRowDeleted()

> **onRowDeleted**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:126](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L126)

#### Parameters

##### cb

(`row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### setData()

> **setData**(`data`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:112](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L112)

#### Parameters

##### data

[`TreeHierarchyData`](../type-aliases/TreeHierarchyData.md)

#### Returns

`TreeHierarchySortableSettings`

***

### setDescription()

> **setDescription**(`description`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:56](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L56)

#### Parameters

##### description

`string`

#### Returns

`TreeHierarchySortableSettings`

***

### setTitle()

> **setTitle**(`title`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:51](https://github.com/Christian-Me/folder-to-tags-plugin/blob/324c4975948764581637da1ab1e4cb12dc3f447a/src/uiTreeHierarchySortableSettings.ts#L51)

#### Parameters

##### title

`string`

#### Returns

`TreeHierarchySortableSettings`
