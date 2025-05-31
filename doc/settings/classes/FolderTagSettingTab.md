[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [settings](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/settings/README.md) / FolderTagSettingTab

# Class: FolderTagSettingTab

Defined in: [src/settings.ts:15](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L15)

## Extends

- `PluginSettingTab`

## Constructors

### Constructor

> **new FolderTagSettingTab**(`app`, `plugin`): `FolderTagSettingTab`

Defined in: [src/settings.ts:24](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L24)

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

> **knownProperties**: [`PropertyTypeInfo`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/type-aliases/PropertyTypeInfo.md)[]

Defined in: [src/settings.ts:20](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L20)

***

### knownTypes

> **knownTypes**: `any`

Defined in: [src/settings.ts:21](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L21)

***

### plugin

> **plugin**: `any`

Defined in: [src/settings.ts:16](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L16)

***

### rulesContainer

> **rulesContainer**: `HTMLDivElement`

Defined in: [src/settings.ts:18](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L18)

***

### rulesControl

> **rulesControl**: `HTMLDivElement`

Defined in: [src/settings.ts:19](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L19)

***

### rulesDiv

> **rulesDiv**: `HTMLDivElement`

Defined in: [src/settings.ts:17](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L17)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

Defined in: [src/settings.ts:22](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L22)

## Methods

### display()

> **display**(): `void`

Defined in: [src/settings.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L46)

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

Defined in: [src/settings.ts:29](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/settings.ts#L29)

Hides the contents of the setting tab.
Any registered components should be unloaded when the view is hidden.
Override this if you need to perform additional cleanup.

#### Returns

`void`

#### Overrides

`PluginSettingTab.hide`
