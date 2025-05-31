[**Documentation**](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md)

***

[Documentation](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/README.md) / [rules](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/README.md) / useRuleOption

# Function: useRuleOption()

> **useRuleOption**(`ruleFn`, `option`): `boolean`

Defined in: [src/rules.ts:421](https://github.com/Christian-Me/folder-to-tags-plugin/blob/ea97d76ce7b235ca1e3494401efc98e537acc1fb/src/rules.ts#L421)

Determines whether a specific option is enabled for a given rule function.

## Parameters

### ruleFn

The rule function object, which may be undefined. If defined, it should contain a `configElements` property.

`undefined` | [`RuleFunction`](https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/rules/interfaces/RuleFunction.md)

### option

`string`

The name of the option to check within the `configElements` of the rule function.

## Returns

`boolean`

`true` if the option is undefined in the `configElements` or if the option is explicitly set to `true`.
         Returns `false` if the option is explicitly set to `false`.
