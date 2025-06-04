[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [tools](../README.md) / cleanCodeString

# Function: cleanCodeString()

> **cleanCodeString**(`codeString`): `string`

Defined in: [src/tools.ts:43](https://github.com/Christian-Me/folder-to-tags-plugin/blob/bf42295620335492a0928fbbe8ccca5ae986f975/src/tools.ts#L43)

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
