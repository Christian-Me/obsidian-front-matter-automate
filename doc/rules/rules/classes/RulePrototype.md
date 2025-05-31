[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [rules/rules](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/README.md) / RulePrototype

# Class: RulePrototype

Defined in: [src/rules/rules.ts:30](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L30)

## Extended by

- [`RuleAddPrefix`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/addPrefix/classes/RuleAddPrefix.md)
- [`RuleAddSuffix`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/addSuffix/classes/RuleAddSuffix.md)
- [`RuleAutomationAutoLink`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/automationAutoLink/classes/RuleAutomationAutoLink.md)
- [`RuleBuildInAutoCompleteModal`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInAutoCompleteModal/classes/RuleBuildInAutoCompleteModal.md)
- [`RuleBuildInConcatArrays`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInConcatArrays/classes/RuleBuildInConcatArrays.md)
- [`RuleBuildInConcatProperties`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInConcatProperties/classes/RuleBuildInConcatProperties.md)
- [`RuleBuildInConstant`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInConstant/classes/RuleBuildInConstant.md)
- [`RuleBuildInDateTimeCreated`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInDateTimeCreated/classes/RuleBuildInDateTimeCreated.md)
- [`RuleBuildInDateTimeModified`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInDateTimeModified/classes/RuleBuildInDateTimeModified.md)
- [`RuleBuildInDefault`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInDefault/classes/RuleBuildInDefault.md)
- [`RuleBuildInFileSizeBytes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFileSizeBytes/classes/RuleBuildInFileSizeBytes.md)
- [`RuleBuildInFileSizeString`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFileSizeString/classes/RuleBuildInFileSizeString.md)
- [`RuleBuildInFolder`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFolder/classes/RuleBuildInFolder.md)
- [`RuleBuildInFolderFolderNotes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFolderFolderNotes/classes/RuleBuildInFolderFolderNotes.md)
- [`RuleBuildInFolders`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFolders/classes/RuleBuildInFolders.md)
- [`RuleBuildInFullPath`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFullPath/classes/RuleBuildInFullPath.md)
- [`RuleBuildInFullPathExt`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFullPathExt/classes/RuleBuildInFullPathExt.md)
- [`RuleBuildInFullPathExtFolderNotes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFullPathExtFolderNotes/classes/RuleBuildInFullPathExtFolderNotes.md)
- [`RuleBuildInFullPathFolderNotes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInFullPathFolderNotes/classes/RuleBuildInFullPathFolderNotes.md)
- [`RuleBuildInGetProperty`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInGetProperty/classes/RuleBuildInGetProperty.md)
- [`RuleBuildInIsRoot`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInIsRoot/classes/RuleBuildInIsRoot.md)
- [`RuleBuildInLinkToFile`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInLinkToFile/classes/RuleBuildInLinkToFile.md)
- [`RuleBuildInName`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInName/classes/RuleBuildInName.md)
- [`RuleBuildInNameExt`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInNameExt/classes/RuleBuildInNameExt.md)
- [`RuleBuildInPath`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInPath/classes/RuleBuildInPath.md)
- [`RuleBuildInPathFolderNotes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInPathFolderNotes/classes/RuleBuildInPathFolderNotes.md)
- [`RuleBuildInRootFolder`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInRootFolder/classes/RuleBuildInRootFolder.md)
- [`RuleBuildInScript`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/buildInScript/classes/RuleBuildInScript.md)
- [`RuleReplaceChars`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/replaceChars/classes/RuleReplaceChars.md)
- [`RuleReplaceSpaces`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/replaceSpaces/classes/RuleReplaceSpaces.md)
- [`RuleReplaceSpecialChars`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/replaceSpecialChars/classes/RuleReplaceSpecialChars.md)
- [`RuleToCamelCase`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toCamelCase/classes/RuleToCamelCase.md)
- [`RuleToLinkMarkdown`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toLinkMarkdown/classes/RuleToLinkMarkdown.md)
- [`RuleToLinkOriginal`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toLinkOriginal/classes/RuleToLinkOriginal.md)
- [`RuleToLinkSimple`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toLinkSimple/classes/RuleToLinkSimple.md)
- [`RuleToLinkWiki`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toLinkWiki/classes/RuleToLinkWiki.md)
- [`RuleToLowerCase`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toLowerCase/classes/RuleToLowerCase.md)
- [`RuleToOriginal`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toOriginal/classes/RuleToOriginal.md)
- [`RuleToPascalCase`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toPascalCase/classes/RuleToPascalCase.md)
- [`RuleToTitleCase`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toTitleCase/classes/RuleToTitleCase.md)
- [`RuleToTitleCaseDE`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toTitleCaseDE/classes/RuleToTitleCaseDE.md)
- [`RuleToTitleCaseEN`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toTitleCaseEN/classes/RuleToTitleCaseEN.md)
- [`RuleToUpperCase`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/toUpperCase/classes/RuleToUpperCase.md)

## Constructors

### Constructor

> **new RulePrototype**(`app?`, `plugin?`): `RulePrototype`

Defined in: [src/rules/rules.ts:42](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L42)

#### Parameters

##### app?

`App`

##### plugin?

`any`

#### Returns

`RulePrototype`

## Properties

### configElements

> **configElements**: `object` \| [`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md) = `{}`

Defined in: [src/rules/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L39)

***

### description

> **description**: `string`

Defined in: [src/rules/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L35)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L33)

***

### isLiveRule

> **isLiveRule**: `boolean` = `false`

Defined in: [src/rules/rules.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L37)

***

### name

> **name**: `string`

Defined in: [src/rules/rules.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L34)

***

### rulesConfigDiv

> **rulesConfigDiv**: `undefined` \| `HTMLDivElement` = `undefined`

Defined in: [src/rules/rules.ts:31](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L31)

***

### ruleType

> **ruleType**: [`FrontmatterAutomateRuleTypes`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/type-aliases/FrontmatterAutomateRuleTypes.md) = `'buildIn'`

Defined in: [src/rules/rules.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L36)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

Defined in: [src/rules/rules.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L32)

***

### source

> **source**: `string` = `'function (app, file, tools) { // do not change this line!\n  let result = \'\'\n  return result;\n}'`

Defined in: [src/rules/rules.ts:40](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L40)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L38)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/rules.ts:63](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L63)

Configures the settings tab for a specific rule in the plugin.

#### Parameters

##### optionEL

`HTMLElement`

The HTML element where the configuration options will be rendered.

##### rule

[`FrontmatterAutomateRuleSettings`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/types/interfaces/FrontmatterAutomateRuleSettings.md)

The settings object for the frontmatter automation rule.

##### that

`any`

The context or reference to the calling object.

##### previewComponent

`any`

The component used to render a preview of the rule's effect.

#### Returns

`void`

***

### defaultConfigElements()

> **defaultConfigElements**(`modifiers`): [`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md)

Defined in: [src/rules/rules.ts:67](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L67)

#### Parameters

##### modifiers

`any`

#### Returns

[`RuleConfigElements`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/rules/interfaces/RuleConfigElements.md)

***

### execute()

> **execute**(`app`, `file`, `tools`, `input?`): `string`

Defined in: [src/rules/rules.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L115)

Executes the `fx` function based on the `ruleType`.
Handles different function signatures dynamically.

#### Parameters

##### app

The Obsidian app instance.

`undefined` | `App`

##### file

`any`

The file to pass to the rule's `fx` function.

##### tools

[`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

The scripting tools to pass to the rule's `fx` function.

##### input?

`any`

Optional input for rules that require it (e.g., `buildIn.inputProperty`).

#### Returns

`string`

- The result of the `fx` function.

***

### fx()

> **fx**(`app`, `file`, `tools`, `input?`): `any`

Defined in: [src/rules/rules.ts:50](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L50)

#### Parameters

##### app

`undefined` | `App`

##### file

`any`

##### tools

[`ScriptingTools`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/classes/ScriptingTools.md)

##### input?

`any`

#### Returns

`any`

***

### getSource()

> **getSource**(): `string`

Defined in: [src/rules/rules.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L46)

#### Returns

`string`

***

### hasOwnConfigTab()

> **hasOwnConfigTab**(): `boolean`

Defined in: [src/rules/rules.ts:102](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L102)

Checks if the rule has any configuration options.

#### Returns

`boolean`

- Returns true if the rule has options, false otherwise.

***

### useRuleOption()

> **useRuleOption**(`option`): `boolean`

Defined in: [src/rules/rules.ts:91](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules/rules.ts#L91)

Checks if a specific rule option is enabled.

#### Parameters

##### option

`string`

The name of the rule option to check.

#### Returns

`boolean`

- Returns true if the option is enabled, false otherwise.
