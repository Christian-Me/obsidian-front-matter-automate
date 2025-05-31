[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [tools](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/tools/README.md) / cleanCodeString

# Function: cleanCodeString()

> **cleanCodeString**(`codeString`): `string`

Defined in: [src/tools.ts:42](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/tools.ts#L42)

Cleans a JavaScript/TypeScript code string by removing comments.
This function handles both single-line comments (`// ...`) and
multi-line comments (`/* ... */`). It also correctly handles
comments within strings and regular expressions.

## Parameters

### codeString

`string`

The code string to clean.

## Returns

`string`

The cleaned code string with comments removed.

## Throws

If the input is not a string.
