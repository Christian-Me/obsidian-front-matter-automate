[**front-matter-automate**](../../README.md)

***

[front-matter-automate](../../modules.md) / [rules](../README.md) / useRuleOption

# Function: useRuleOption()

> **useRuleOption**(`ruleFn`, `option`): `boolean`

Defined in: [src/rules.ts:415](https://github.com/Christian-Me/folder-to-tags-plugin/blob/c4f3804089f2bfe27979efdfa349dd5a9da04cc5/src/rules.ts#L415)

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
