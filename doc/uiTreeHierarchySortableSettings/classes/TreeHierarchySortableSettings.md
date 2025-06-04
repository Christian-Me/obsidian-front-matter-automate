[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [uiTreeHierarchySortableSettings](../README.md) / TreeHierarchySortableSettings

# Class: TreeHierarchySortableSettings

Defined in: [src/uiTreeHierarchySortableSettings.ts:29](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L29)

## Constructors

### Constructor

> **new TreeHierarchySortableSettings**(`container`, `data`, `rowRenderCb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:48](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L48)

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

Defined in: [src/uiTreeHierarchySortableSettings.ts:30](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L30)

## Methods

### addExtraButtonToHeader()

> **addExtraButtonToHeader**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:66](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L66)

#### Parameters

##### cb

(`btn`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### addFolder()

> **addFolder**(`name`, `parentId?`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:105](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L105)

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

Defined in: [src/uiTreeHierarchySortableSettings.ts:75](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L75)

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

Defined in: [src/uiTreeHierarchySortableSettings.ts:124](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L124)

#### Parameters

##### cb

(`data`, `row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onDeleteBt()

> **onDeleteBt**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:71](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L71)

#### Parameters

##### cb

() => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onFilter()

> **onFilter**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:140](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L140)

#### Parameters

##### cb

(`row`, `filter`) => `boolean`

#### Returns

`TreeHierarchySortableSettings`

***

### onRendered()

> **onRendered**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:136](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L136)

#### Parameters

##### cb

() => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRowCreated()

> **onRowCreated**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:128](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L128)

#### Parameters

##### cb

(`row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRowDeleted()

> **onRowDeleted**(`cb`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:132](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L132)

#### Parameters

##### cb

(`row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### setData()

> **setData**(`data`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:118](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L118)

#### Parameters

##### data

[`TreeHierarchyData`](../type-aliases/TreeHierarchyData.md)

#### Returns

`TreeHierarchySortableSettings`

***

### setDescription()

> **setDescription**(`description`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:61](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L61)

#### Parameters

##### description

`string`

#### Returns

`TreeHierarchySortableSettings`

***

### setTitle()

> **setTitle**(`title`): `TreeHierarchySortableSettings`

Defined in: [src/uiTreeHierarchySortableSettings.ts:56](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/uiTreeHierarchySortableSettings.ts#L56)

#### Parameters

##### title

`string`

#### Returns

`TreeHierarchySortableSettings`
