[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [tools](../README.md) / ScriptingTools

# Class: ScriptingTools

Defined in: [src/tools.ts:227](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L227)

## Constructors

### Constructor

> **new ScriptingTools**(`app?`, `plugin?`, `settings?`, `rule?`, `frontmatter?`, `activeFile?`): `ScriptingTools`

Defined in: [src/tools.ts:237](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L237)

#### Parameters

##### app?

`App`

##### plugin?

`any`

##### settings?

[`FrontmatterAutomateSettings`](../../types/interfaces/FrontmatterAutomateSettings.md)

##### rule?

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

##### frontmatter?

`any`

##### activeFile?

`TFile`

#### Returns

`ScriptingTools`

## Properties

### activeFile

> **activeFile**: `undefined` \| `TFile`

Defined in: [src/tools.ts:234](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L234)

***

### app

> **app**: `undefined` \| `App`

Defined in: [src/tools.ts:228](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L228)

***

### currentContent

> **currentContent**: `any`

Defined in: [src/tools.ts:233](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L233)

***

### frontmatter

> **frontmatter**: `any`

Defined in: [src/tools.ts:232](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L232)

***

### knownProperties

> **knownProperties**: `Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\> = `{}`

Defined in: [src/tools.ts:235](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L235)

***

### plugin

> **plugin**: `any`

Defined in: [src/tools.ts:229](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L229)

***

### rule

> **rule**: `undefined` \| [`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

Defined in: [src/tools.ts:231](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L231)

***

### settings

> **settings**: `undefined` \| [`FrontmatterAutomateSettings`](../../types/interfaces/FrontmatterAutomateSettings.md)

Defined in: [src/tools.ts:230](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L230)

## Methods

### addLeadingSlash()

> **addLeadingSlash**(`path`): `string`

Defined in: [src/tools.ts:618](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L618)

Ensures that the given path string starts with a leading slash ('/').
If the path already begins with a slash, it is returned unchanged.

#### Parameters

##### path

`string`

The input path string to modify.

#### Returns

`string`

The path string guaranteed to start with a leading slash.

***

### createFileFromPath()

> **createFileFromPath**(`fileNameWithPath`, `templateFileWithPath`): `Promise`\<`TFile`\>

Defined in: [src/tools.ts:470](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L470)

Creates a new file at the specified path using the content from a template file.
If the file already exists, returns the existing file instead of creating a new one.

#### Parameters

##### fileNameWithPath

`string`

The full path (including file name) where the new file should be created.

##### templateFileWithPath

`string`

The full path to the template file whose content will be used.

#### Returns

`Promise`\<`TFile`\>

A promise that resolves to the newly created file or the existing file if it already exists.

#### Throws

If the folder path is invalid, does not exist, or is not a folder.

***

### extractLinkParts()

> **extractLinkParts**(`link`): `object`

Defined in: [src/tools.ts:564](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L564)

Extracts the path and title from a given link string.

The input link is expected to be in the format `[[path|title]]` or `[[path]]`.
This function removes square brackets, splits the link by the `|` character,
and determines the path and title. If the title is not provided, the path is
used as the title.

#### Parameters

##### link

`string`

The link string to extract parts from, typically in the format `[[path|title]]` or `[[path]]`.

#### Returns

`object`

An object containing the `path` and `title` extracted from the link.

##### path

> **path**: `string`

##### title

> **title**: `string`

***

### extractPathParts()

> **extractPathParts**(`link`): `object`

Defined in: [src/tools.ts:589](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L589)

Extracts the path, title, and file name from a given file link string.

Splits the input string by the "/" character to separate the file name from its path.
The title is derived from the file name by removing all extensions and trimming whitespace.

#### Parameters

##### link

`string`

The file link string to extract parts from.

#### Returns

`object`

An object containing:
  - `path`: The directory path portion of the link (excluding the file name).
  - `title`: The file name without extensions and trimmed.
  - `fileName`: The full file name (with extensions, if any).

##### fileName

> **fileName**: `string`

##### path

> **path**: `string`

##### title

> **title**: `string`

***

### fetchCustomPropertyInfos()

> **fetchCustomPropertyInfos**(`app`): `Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\>

Defined in: [src/tools.ts:497](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L497)

* Fetches custom property information from all markdown files in the vault.

#### Parameters

##### app

`App`

#### Returns

`Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\>

***

### fetchKnownProperties()

> **fetchKnownProperties**(`app`): `Promise`\<`Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\>\>

Defined in: [src/tools.ts:519](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L519)

Fetches known properties from the metadata cache.
If the method getAllPropertyInfos is not available, it falls back to fetchCustomPropertyInfos.

#### Parameters

##### app

`App`

The Obsidian app instance.

#### Returns

`Promise`\<`Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\>\>

***

### formatToYAMLSaveString()

> **formatToYAMLSaveString**(`text`, `replaceBy`): `string`

Defined in: [src/tools.ts:733](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L733)

Formats a given text string to be safe for use in YAML by replacing special characters.

Replaces all characters that are not alphanumeric, dash, underscore, slash, or certain accented characters
with a specified replacement string. If no replacement string is provided, it uses the value from settings,
or defaults to `'-'`.

#### Parameters

##### text

`string`

The input string to format.

##### replaceBy

Optional. The string to replace special characters with. If not provided, uses the value from settings or `'-'`.

`undefined` | `string`

#### Returns

`string`

The formatted string safe for YAML usage.

***

### formatUpperCamelCase()

> **formatUpperCamelCase**(`text`): `string`

Defined in: [src/tools.ts:889](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L889)

Converts a given string to camelCase format.

Splits the input text by spaces, lowercases the first word,
and capitalizes the first letter of each subsequent word,
then joins them together without spaces.

#### Parameters

##### text

`string`

The input string to be converted.

#### Returns

`string`

The camelCase formatted string.

***

### getActiveFile()

> **getActiveFile**(): `undefined` \| `TFile`

Defined in: [src/tools.ts:293](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L293)

Returns the currently active file.

#### Returns

`undefined` \| `TFile`

The active file object, or `undefined` if no file is active.

***

### getCurrentContent()

> **getCurrentContent**(): `any`

Defined in: [src/tools.ts:338](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L338)

Retrieves the current content stored in the instance.

#### Returns

`any`

The current content.

***

### getFilesInVault()

> **getFilesInVault**(`folderPath`): `TFile`[]

Defined in: [src/tools.ts:411](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L411)

Retrieves all markdown files in the vault whose paths include the specified matching string.

The `matching` parameter is normalized to ensure it ends with a single '/' character,
and is used to filter files whose paths contain this substring.

#### Parameters

##### folderPath

`string`

The folder path or substring to match within file paths.

#### Returns

`TFile`[]

An array of `TFile` objects whose paths include the normalized `matching` string.

***

### getFolderFromPath()

> **getFolderFromPath**(`path`, `separator`): `undefined` \| `null` \| `string`

Defined in: [src/tools.ts:906](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L906)

get the path to a file from a string containing the full parh/name string

#### Parameters

##### path

string

`undefined` | `null` | `string`

##### separator

`string` = `'/'`

string defaults to '/'

#### Returns

`undefined` \| `null` \| `string`

string

***

### getFrontmatter()

> **getFrontmatter**(): `any`

Defined in: [src/tools.ts:250](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L250)

Retrieves the frontmatter object associated with the current instance.

#### Returns

`any`

The frontmatter data.

***

### getFrontmatterProperty()

> **getFrontmatterProperty**(`key`): `any`

Defined in: [src/tools.ts:277](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L277)

Retrieves the value of a specified property from the frontmatter object.

#### Parameters

##### key

`string`

The name of the property to retrieve from the frontmatter.

#### Returns

`any`

The value associated with the specified key in the frontmatter, or `undefined` if the key does not exist.

***

### getKnownProperties()

> **getKnownProperties**(): `Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\>

Defined in: [src/tools.ts:547](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L547)

Retrieves the known properties, initializing them if they have not been loaded yet.
If the properties are not already cached, this method fetches them using `fetchCustomPropertyInfos`
and stores them for future access.

#### Returns

`Record`\<`string`, [`PropertyInfo`](../../types/type-aliases/PropertyInfo.md)\>

The cached or newly fetched known properties.

***

### getMockFileFromPath()

> **getMockFileFromPath**(`path`): `undefined` \| `TFile`

Defined in: [src/tools.ts:428](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L428)

Creates a mock `TFile` object from a given file path string.

This method parses the provided path to construct a `TFile`-like object,
extracting the file name, extension, and base name. The returned object
contains placeholder values for file statistics and parent, as these details
are unknown. If the input path is empty or undefined, the method returns `undefined`.

#### Parameters

##### path

The file path string to generate the mock `TFile` from.

`undefined` | `string`

#### Returns

`undefined` \| `TFile`

A mock `TFile` object representing the file at the given path, or `undefined` if the path is invalid.

***

### getOptionConfig()

> **getOptionConfig**(`ruleId`, `optionId?`): `any`

Defined in: [src/tools.ts:386](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L386)

* Get the option config for a specific rule. Optional the specific parameter by providing an option ID.

#### Parameters

##### ruleId

`undefined` | `string`

##### optionId?

`string`

#### Returns

`any`

***

### getRule()

> **getRule**(): `undefined` \| [`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

Defined in: [src/tools.ts:309](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L309)

Retrieves the current rule associated with this instance.

#### Returns

`undefined` \| [`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

The rule object or value stored in the `rule` property.

***

### getRuleFunction()

> **getRuleFunction**(`rule?`): `undefined` \| [`RulePrototype`](../../rules/rules/classes/RulePrototype.md)

Defined in: [src/tools.ts:319](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L319)

Retrieves a rule function based on the provided rule settings.

#### Parameters

##### rule?

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

Optional. The rule settings to use for retrieving the rule function.
              If not provided, the method uses the instance's default rule.

#### Returns

`undefined` \| [`RulePrototype`](../../rules/rules/classes/RulePrototype.md)

The rule function associated with the specified rule settings, or `undefined` if no rule is found.

***

### getTFileFromPath()

> **getTFileFromPath**(`path`, `filesCheck`): `undefined` \| `TFile`

Defined in: [src/tools.ts:452](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L452)

Retrieves a `TFile` object from a given file path.

#### Parameters

##### path

The file path to search for. If `undefined`, the function returns `undefined`.

`undefined` | `string`

##### filesCheck

An optional array of `TFile` objects to search within. If not provided, all markdown files in the vault are used.

`undefined` | `TFile`[]

#### Returns

`undefined` \| `TFile`

The matching `TFile` if found; otherwise, `undefined`.

***

### isISOString()

> **isISOString**(`str`, `options`): `boolean`

Defined in: [src/tools.ts:628](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L628)

Check if a string complies with ISO Standard

#### Parameters

##### str

`string`

Any string

##### options

Options to look for

###### withDate?

`boolean`

###### withMilliseconds?

`boolean`

###### withTime?

`boolean`

###### withTimezone?

`boolean`

#### Returns

`boolean`

***

### removeAllExtensions()

> **removeAllExtensions**(`fileName`): `string`

Defined in: [src/tools.ts:863](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L863)

Removes the ALL file extension(s) from a given file name.

#### Parameters

##### fileName

`string`

The name of the file, including its extension.

#### Returns

`string`

The file name without its extension.

***

### removeDuplicateStrings()

> **removeDuplicateStrings**(`stringArray`): `string`[]

Defined in: [src/tools.ts:919](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L919)

removes duplicate strings in an array and deletes empty strings

#### Parameters

##### stringArray

`string`[]

#### Returns

`string`[]

***

### removeExtensions()

> **removeExtensions**(`fileName`): `string`

Defined in: [src/tools.ts:872](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L872)

Removes the last file extension(s) from a given file name.

#### Parameters

##### fileName

`string`

The name of the file, including its extension.

#### Returns

`string`

The file name without its extension.

***

### removeLeadingSlash()

> **removeLeadingSlash**(`path`): `string`

Defined in: [src/tools.ts:608](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L608)

Removes one or more leading slashes from the beginning of the given path string.

#### Parameters

##### path

`string`

The input string from which to remove leading slashes.

#### Returns

`string`

The input string without any leading slashes.

***

### replaceSpaces()

> **replaceSpaces**(`text`, `replaceBy`): `string`

Defined in: [src/tools.ts:848](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L848)

Replaces all whitespace characters in the given text with a specified replacement string.

#### Parameters

##### text

`string`

The input string in which spaces will be replaced.

##### replaceBy

Optional. The string to replace spaces with. If not provided, uses the value from `this.settings.spaceReplacement` or defaults to '_'.

`undefined` | `string`

#### Returns

`string`

The modified string with spaces replaced by the specified replacement string.

***

### setActiveFile()

> **setActiveFile**(`file`): `void`

Defined in: [src/tools.ts:285](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L285)

Sets the currently active file.

#### Parameters

##### file

`TFile`

The file to set as active. Must be an instance of `TFile`.

#### Returns

`void`

***

### setCurrentContent()

> **setCurrentContent**(`content`): `void`

Defined in: [src/tools.ts:330](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L330)

Sets the current content to the provided value.

#### Parameters

##### content

`any`

The content to set as the current content. Can be of any type.

#### Returns

`void`

***

### setFrontmatter()

> **setFrontmatter**(`frontmatter`): `void`

Defined in: [src/tools.ts:258](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L258)

Sets the frontmatter property for the current instance.

#### Parameters

##### frontmatter

`any`

The frontmatter object to assign.

#### Returns

`void`

***

### setFrontmatterProperty()

> **setFrontmatterProperty**(`key`, `value`): `void`

Defined in: [src/tools.ts:267](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L267)

Sets a property in the frontmatter object. If the frontmatter does not exist, it initializes it as an empty object.

#### Parameters

##### key

`string`

The property name to set in the frontmatter.

##### value

`any`

The value to assign to the specified property.

#### Returns

`void`

***

### setRule()

> **setRule**(`rule`): `void`

Defined in: [src/tools.ts:301](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L301)

Sets the current rule configuration for the frontmatter automation.

#### Parameters

##### rule

[`FrontmatterAutomateRuleSettings`](../../types/interfaces/FrontmatterAutomateRuleSettings.md)

The rule settings to apply, represented by a `FrontmatterAutomateRuleSettings` object.

#### Returns

`void`

***

### showConfirmDialog()

> **showConfirmDialog**(`message`, `title`, `button1`, `button2`): `Promise`\<`boolean`\>

Defined in: [src/tools.ts:375](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L375)

Displays a confirmation dialog with customizable message, title, and button labels.

#### Parameters

##### message

`string`

The message to display in the confirmation dialog.

##### title

`string` = `'Confirm'`

The title of the dialog window. Defaults to 'Confirm'.

##### button1

`string` = `'Yes'`

The label for the confirmation button. Defaults to 'Yes'.

##### button2

`string` = `'No'`

The label for the cancellation button. Defaults to 'No'.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to a boolean indicating whether the user confirmed (true) or cancelled (false).

***

### toMarkdownLink()

> **toMarkdownLink**(`input`, `replaceSpaces?`): `string` \| `string`[]

Defined in: [src/tools.ts:803](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L803)

Converts an input string or array of strings into a Markdown Link format.

#### Parameters

##### input

`any`

The input to be converted. Can be a string or an array of strings.

##### replaceSpaces?

`string`

Optional parameter to specify a replacement for spaces in the path or title.
                       If provided, spaces will be replaced with this value.

#### Returns

`string` \| `string`[]

A string in Markdown Link format if the input is a single string, or a concatenated string
         of Markdown Links if the input is an array of strings.

The Markdown Link format is `[title](path)`, where:
- `path` is the formatted path of the link.
- `title` is the formatted title of the link.

If the input is an array, each element is converted to a WikiLink and joined with a comma.

***

### toWikiLink()

> **toWikiLink**(`input`, `replaceSpaces`): `string` \| `string`[]

Defined in: [src/tools.ts:829](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L829)

Converts an input string or array of strings into a WikiLink format string or array of strings.

#### Parameters

##### input

`any`

The input to be converted. Can be a string or an array of strings.

##### replaceSpaces

`string` = `' '`

Optional parameter to specify a replacement for spaces in the path or title.
                       If provided, spaces will be replaced with this value.

#### Returns

`string` \| `string`[]

A string in WikiLink format if the input is a single string, or a concatenated string
         of WikiLinks if the input is an array of strings.

The WikiLink format is `[[fileName]]`, where:
- `fileName` is the formatted unique fileName of the link.

If the input is an array, each element is converted to a WikiLink and joined with a comma.

***

### toYamlSafeString()

> **toYamlSafeString**(`input`): `string` \| `number` \| `string`[]

Defined in: [src/tools.ts:747](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L747)

Converts a string to a YAML-safe format by adding quotes when necessary.

#### Parameters

##### input

The string, boolean, number or array to make YAML-safe

`string` | `number` | `boolean` | `string`[]

#### Returns

`string` \| `number` \| `string`[]

The safely quoted string when needed, or the original string if safe

***

### tryConvert()

> **tryConvert**(`input`, `typeString`): `undefined` \| `string` \| `number` \| `boolean` \| `string`[]

Defined in: [src/tools.ts:677](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L677)

Try to convert Any Types to a specific Type

#### Parameters

##### input

`any`

##### typeString

'string' | 'number' | 'boolean' | 'string[]'

`"string"` | `"number"` | `"boolean"` | `"string[]"`

#### Returns

`undefined` \| `string` \| `number` \| `boolean` \| `string`[]

***

### updateFrontmatter()

> **updateFrontmatter**(`property`, `newContent`, `file?`): `void`

Defined in: [src/tools.ts:353](https://github.com/Christian-Me/folder-to-tags-plugin/blob/a733ed2c2245ed051659b6c3e9c71ef47c30835a/src/tools.ts#L353)

Updates the specified frontmatter property of a given file with new content.

If no file is provided, the currently active file is used. If neither is available, the method returns early.
The method logs the update operation and only supports updating properties with primitive values or arrays.
If `newContent` is an object (but not an array), a warning is issued and the update is not performed.
The file's modification time (`mtime`) is preserved and not changed during the update.

#### Parameters

##### property

`string`

The frontmatter property to update.

##### newContent

`any`

The new value to assign to the property. Objects (except arrays) are not supported.

##### file?

`TFile`

(Optional) The file whose frontmatter should be updated. If omitted, the active file is used.

#### Returns

`void`
