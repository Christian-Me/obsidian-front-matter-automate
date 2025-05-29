[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [uiTreeHierarchySortableSettings](../README.md) / TreeHierarchySortableSettings

# Class: TreeHierarchySortableSettings

Defined in: src/uiTreeHierarchySortableSettings.ts:29

## Constructors

### Constructor

> **new TreeHierarchySortableSettings**(`container`, `data`, `rowRenderCb`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:43

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

Defined in: src/uiTreeHierarchySortableSettings.ts:30

## Methods

### addFolder()

> **addFolder**(`name`, `parentId?`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:93

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

Defined in: src/uiTreeHierarchySortableSettings.ts:64

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

Defined in: src/uiTreeHierarchySortableSettings.ts:112

#### Parameters

##### cb

(`data`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onDeleteBt()

> **onDeleteBt**(`cb`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:60

#### Parameters

##### cb

() => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRendered()

> **onRendered**(`cb`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:124

#### Parameters

##### cb

() => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRowCreated()

> **onRowCreated**(`cb`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:116

#### Parameters

##### cb

(`row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### onRowDeleted()

> **onRowDeleted**(`cb`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:120

#### Parameters

##### cb

(`row`) => `void`

#### Returns

`TreeHierarchySortableSettings`

***

### setData()

> **setData**(`data`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:106

#### Parameters

##### data

[`TreeHierarchyData`](../type-aliases/TreeHierarchyData.md)

#### Returns

`TreeHierarchySortableSettings`

***

### setDescription()

> **setDescription**(`description`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:55

#### Parameters

##### description

`string`

#### Returns

`TreeHierarchySortableSettings`

***

### setTitle()

> **setTitle**(`title`): `TreeHierarchySortableSettings`

Defined in: src/uiTreeHierarchySortableSettings.ts:50

#### Parameters

##### title

`string`

#### Returns

`TreeHierarchySortableSettings`
