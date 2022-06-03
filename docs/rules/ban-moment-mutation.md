# Bans unsafe moment mutations (`ban-moment-mutation`)

The core of Moment's APIs mutate the underlying `moment` object which can be
confusing and lead to bugs.

To fix this you could migrate to another library that is immutable, but if your
codebase is large enough, a migration might not be feasible. That's where this
rule comes in!

## Rule Details

This rule bans calling mutating methods without first calling `.clone()`

Specifically the following are flagged as mutating:

- `startOf`
- `endOf`
- `add`
- `subtract`
- `local`
- `utc`
- `set`

### Examples

Examples of **incorrect** code:

```ts
const endsAt = moment()

const later = endsAt.add(1, 'day')
```

Examples of **correct** code:

```ts
const endsAt = moment()
const later = endsAt.clone().add(1, 'day')

moment().add(1, 'day')
```

## When Not To Use It

If you don't mind the risk of `moment` mutations causing bugs in your system or
you don't use `moment`.
