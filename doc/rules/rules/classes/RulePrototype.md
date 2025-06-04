[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [rules/rules](../README.md) / RulePrototype

# Class: RulePrototype

Defined in: [src/rules/rules.ts:30](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L30)

## Extended by

- [`RuleAddPrefix`](../../addPrefix/classes/RuleAddPrefix.md)
- [`RuleAddSuffix`](../../addSuffix/classes/RuleAddSuffix.md)
- [`RuleAutomationAutoLink`](../../automationAutoLink/classes/RuleAutomationAutoLink.md)
- [`RuleBuildInAutoCompleteModal`](../../buildInAutoCompleteModal/classes/RuleBuildInAutoCompleteModal.md)
- [`RuleBuildInConcatProperties`](../../buildInConcatProperties/classes/RuleBuildInConcatProperties.md)
- [`RuleBuildInConstant`](../../buildInConstant/classes/RuleBuildInConstant.md)
- [`RuleBuildInDateTimeCreated`](../../buildInDateTimeCreated/classes/RuleBuildInDateTimeCreated.md)
- [`RuleBuildInDateTimeModified`](../../buildInDateTimeModified/classes/RuleBuildInDateTimeModified.md)
- [`RuleBuildInDefault`](../../buildInDefault/classes/RuleBuildInDefault.md)
- [`RuleBuildInFileSizeBytes`](../../buildInFileSizeBytes/classes/RuleBuildInFileSizeBytes.md)
- [`RuleBuildInFileSizeString`](../../buildInFileSizeString/classes/RuleBuildInFileSizeString.md)
- [`RuleBuildInFolder`](../../buildInFolder/classes/RuleBuildInFolder.md)
- [`RuleBuildInFolderFolderNotes`](../../buildInFolderFolderNotes/classes/RuleBuildInFolderFolderNotes.md)
- [`RuleBuildInFolders`](../../buildInFolders/classes/RuleBuildInFolders.md)
- [`RuleBuildInFullPath`](../../buildInFullPath/classes/RuleBuildInFullPath.md)
- [`RuleBuildInFullPathExt`](../../buildInFullPathExt/classes/RuleBuildInFullPathExt.md)
- [`RuleBuildInFullPathExtFolderNotes`](../../buildInFullPathExtFolderNotes/classes/RuleBuildInFullPathExtFolderNotes.md)
- [`RuleBuildInFullPathFolderNotes`](../../buildInFullPathFolderNotes/classes/RuleBuildInFullPathFolderNotes.md)
- [`RuleBuildInGetProperties`](../../buildInGetProperties/classes/RuleBuildInGetProperties.md)
- [`RuleBuildInGetProperty`](../../buildInGetProperty/classes/RuleBuildInGetProperty.md)
- [`RuleBuildInIsRoot`](../../buildInIsRoot/classes/RuleBuildInIsRoot.md)
- [`RuleBuildInLinkToFile`](../../buildInLinkToFile/classes/RuleBuildInLinkToFile.md)
- [`RuleBuildInName`](../../buildInName/classes/RuleBuildInName.md)
- [`RuleBuildInNameExt`](../../buildInNameExt/classes/RuleBuildInNameExt.md)
- [`RuleBuildInPath`](../../buildInPath/classes/RuleBuildInPath.md)
- [`RuleBuildInPathFolderNotes`](../../buildInPathFolderNotes/classes/RuleBuildInPathFolderNotes.md)
- [`RuleBuildInRootFolder`](../../buildInRootFolder/classes/RuleBuildInRootFolder.md)
- [`RuleBuildInScript`](../../buildInScript/classes/RuleBuildInScript.md)
- [`RuleReplaceChars`](../../replaceChars/classes/RuleReplaceChars.md)
- [`RuleReplaceSpaces`](../../replaceSpaces/classes/RuleReplaceSpaces.md)
- [`RuleReplaceSpecialChars`](../../replaceSpecialChars/classes/RuleReplaceSpecialChars.md)
- [`RuleToCamelCase`](../../toCamelCase/classes/RuleToCamelCase.md)
- [`RuleToLinkMarkdown`](../../toLinkMarkdown/classes/RuleToLinkMarkdown.md)
- [`RuleToLinkOriginal`](../../toLinkOriginal/classes/RuleToLinkOriginal.md)
- [`RuleToLinkSimple`](../../toLinkSimple/classes/RuleToLinkSimple.md)
- [`RuleToLinkWiki`](../../toLinkWiki/classes/RuleToLinkWiki.md)
- [`RuleToLowerCase`](../../toLowerCase/classes/RuleToLowerCase.md)
- [`RuleToOriginal`](../../toOriginal/classes/RuleToOriginal.md)
- [`RuleToPascalCase`](../../toPascalCase/classes/RuleToPascalCase.md)
- [`RuleToTitleCase`](../../toTitleCase/classes/RuleToTitleCase.md)
- [`RuleToTitleCaseDE`](../../toTitleCaseDE/classes/RuleToTitleCaseDE.md)
- [`RuleToTitleCaseEN`](../../toTitleCaseEN/classes/RuleToTitleCaseEN.md)
- [`RuleToUpperCase`](../../toUpperCase/classes/RuleToUpperCase.md)

## Constructors

### Constructor

> **new RulePrototype**(`app?`, `plugin?`): `RulePrototype`

Defined in: [src/rules/rules.ts:42](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L42)

#### Parameters

##### app?

`App`

##### plugin?

`any`

#### Returns

`RulePrototype`

## Properties

### configElements

> **configElements**: `object` \| [`RuleConfigElements`](../interfaces/RuleConfigElements.md) = `{}`

Defined in: [src/rules/rules.ts:39](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L39)

***

### description

> **description**: `string`

Defined in: [src/rules/rules.ts:35](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L35)

***

### id

> **id**: `string`

Defined in: [src/rules/rules.ts:33](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L33)

***

### isLiveRule

> **isLiveRule**: `boolean` = `false`

Defined in: [src/rules/rules.ts:37](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L37)

***

### name

> **name**: `string`

Defined in: [src/rules/rules.ts:34](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L34)

***

### rulesConfigDiv

> **rulesConfigDiv**: `undefined` \| `HTMLDivElement` = `undefined`

Defined in: [src/rules/rules.ts:31](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L31)

***

### ruleType

> **ruleType**: [`FrontmatterAutomateRuleTypes`](../type-aliases/FrontmatterAutomateRuleTypes.md) = `'buildIn'`

Defined in: [src/rules/rules.ts:36](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L36)

***

### scriptingTools

> **scriptingTools**: [`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

Defined in: [src/rules/rules.ts:32](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L32)

***

### source

> **source**: `string` = `'function (app, file, tools) { // do not change this line!\n  let result = \'\'\n  return result;\n}'`

Defined in: [src/rules/rules.ts:40](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L40)

***

### type

> **type**: `string`[]

Defined in: [src/rules/rules.ts:38](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L38)

## Methods

### configTab()

> **configTab**(`optionEL`, `rule`, `that`, `previewComponent`): `void`

Defined in: [src/rules/rules.ts:63](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L63)

Configures the settings tab for a specific rule in the plugin.

#### Parameters

##### optionEL

`HTMLElement`

The HTML element where the configuration options will be rendered.

##### rule

[`FrontmatterAutomateRuleSettings`](../../../types/interfaces/FrontmatterAutomateRuleSettings.md)

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

> **defaultConfigElements**(`modifiers`): [`RuleConfigElements`](../interfaces/RuleConfigElements.md)

Defined in: [src/rules/rules.ts:67](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L67)

#### Parameters

##### modifiers

`any`

#### Returns

[`RuleConfigElements`](../interfaces/RuleConfigElements.md)

***

### execute()

> **execute**(`app`, `file`, `tools`, `input?`): `string`

Defined in: [src/rules/rules.ts:115](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L115)

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

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

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

Defined in: [src/rules/rules.ts:50](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L50)

#### Parameters

##### app

`undefined` | `App`

##### file

`any`

##### tools

[`ScriptingTools`](../../../tools/classes/ScriptingTools.md)

##### input?

`any`

#### Returns

`any`

***

### getSource()

> **getSource**(): `string`

Defined in: [src/rules/rules.ts:46](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L46)

#### Returns

`string`

***

### hasOwnConfigTab()

> **hasOwnConfigTab**(): `boolean`

Defined in: [src/rules/rules.ts:102](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L102)

Checks if the rule has any configuration options.

#### Returns

`boolean`

- Returns true if the rule has options, false otherwise.

***

### useRuleOption()

> **useRuleOption**(`option`): `boolean`

Defined in: [src/rules/rules.ts:91](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules/rules.ts#L91)

Checks if a specific rule option is enabled.

#### Parameters

##### option

`string`

The name of the rule option to check.

#### Returns

`boolean`

- Returns true if the option is enabled, false otherwise.
