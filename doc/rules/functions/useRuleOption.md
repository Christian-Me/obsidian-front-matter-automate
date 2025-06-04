[**Documentation**](../../README.md)

***

[Documentation](../../README.md) / [rules](../README.md) / useRuleOption

# Function: useRuleOption()

> **useRuleOption**(`ruleFn`, `option`): `boolean`

Defined in: [src/rules.ts:421](https://github.com/Christian-Me/folder-to-tags-plugin/blob/1b47fd7d007d2f33409aeb5e2ff62bca31adb1cf/src/rules.ts#L421)

Determines whether a specific option is enabled for a given rule function.

## Parameters

### ruleFn

The rule function object, which may be undefined. If defined, it should contain a `configElements` property.

`undefined` | [`RuleFunction`](../interfaces/RuleFunction.md)

### option

`string`

The name of the option to check within the `configElements` of the rule function.

## Returns

`boolean`

`true` if the option is undefined in the `configElements` or if the option is explicitly set to `true`.
         Returns `false` if the option is explicitly set to `false`.
