[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [tools](../README.md) / cleanCodeString

# Function: cleanCodeString()

> **cleanCodeString**(`codeString`): `string`

Defined in: [src/tools.ts:43](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/tools.ts#L43)

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
