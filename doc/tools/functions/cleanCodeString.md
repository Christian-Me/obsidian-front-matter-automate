[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [tools](../README.md) / cleanCodeString

# Function: cleanCodeString()

> **cleanCodeString**(`codeString`): `string`

Defined in: [src/tools.ts:43](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/tools.ts#L43)

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
