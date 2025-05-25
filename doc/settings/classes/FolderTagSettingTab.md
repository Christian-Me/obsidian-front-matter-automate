[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [settings](../README.md) / FolderTagSettingTab

# Class: FolderTagSettingTab

Defined in: [src/settings.ts:14](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L14)

## Extends

- `PluginSettingTab`

## Constructors

### Constructor

> **new FolderTagSettingTab**(`app`, `plugin`): `FolderTagSettingTab`

Defined in: [src/settings.ts:23](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L23)

#### Parameters

##### app

`App`

##### plugin

`any`

#### Returns

`FolderTagSettingTab`

#### Overrides

`PluginSettingTab.constructor`

## Properties

### app

> **app**: `App`

Defined in: node\_modules/obsidian/obsidian.d.ts:3853

Reference to the app instance.

#### Inherited from

`PluginSettingTab.app`

***

### containerEl

> **containerEl**: `HTMLElement`

Defined in: node\_modules/obsidian/obsidian.d.ts:3859

Outermost HTML element on the setting tab.

#### Inherited from

`PluginSettingTab.containerEl`

***

### knownProperties

> **knownProperties**: [`PropertyTypeInfo`](../../types/type-aliases/PropertyTypeInfo.md)[]

Defined in: [src/settings.ts:19](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L19)

***

### knownTypes

> **knownTypes**: `any`

Defined in: [src/settings.ts:20](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L20)

***

### plugin

> **plugin**: `any`

Defined in: [src/settings.ts:15](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L15)

***

### rulesContainer

> **rulesContainer**: `HTMLDivElement`

Defined in: [src/settings.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L17)

***

### rulesControl

> **rulesControl**: `HTMLDivElement`

Defined in: [src/settings.ts:18](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L18)

***

### rulesDiv

> **rulesDiv**: `HTMLDivElement`

Defined in: [src/settings.ts:16](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L16)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](../../tools/classes/ScriptingTools.md)

Defined in: [src/settings.ts:21](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L21)

## Methods

### display()

> **display**(): `void`

Defined in: [src/settings.ts:45](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L45)

Called when the settings tab should be rendered.

#### Returns

`void`

#### See

[https://docs.obsidian.md/Plugins/User+interface/Settings#Register+a+settings+tab](https://docs.obsidian.md/Plugins/User+interface/Settings#Register+a+settings+tab)

#### Overrides

`PluginSettingTab.display`

***

### hide()

> **hide**(): `void`

Defined in: [src/settings.ts:28](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/settings.ts#L28)

Hides the contents of the setting tab.
Any registered components should be unloaded when the view is hidden.
Override this if you need to perform additional cleanup.

#### Returns

`void`

#### Overrides

`PluginSettingTab.hide`
