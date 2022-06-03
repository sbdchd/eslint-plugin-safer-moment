# eslint-plugin-safer-moment [![npm version](https://img.shields.io/npm/v/eslint-plugin-safer-moment.svg)](https://www.npmjs.com/package/eslint-plugin-safer-moment)

> An ESlint plugin to prevent `moment` related bugs

## Installation

Make sure you have TypeScript and [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/parser/README.md) installed:

```console
$ yarn add -D typescript @typescript-eslint/parser
$ npm i --save-dev typescript @typescript-eslint/parser
```

Then install the plugin:

```console
$ yarn add -D eslint-plugin-safer-moment
$ npm i --save-dev eslint-plugin-safer-moment
```

## Usage

Add `@typescript-eslint/parser` to the `parser` field, your `tsconfig.json` relative path to `parserOptions.project`, and `safer-moment` to the plugins section of your `.eslintrc` configuration file, then configure the rules you want to use under the rules section.

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": { "project": "./tsconfig.json" },
  "plugins": ["safer-moment"],
  "rules": {
    "safer-moment/ban-moment-mutation": "error"
  }
}
```

**Note: Make sure to use `eslint --ext .js,.ts` since by [default](https://eslint.org/docs/user-guide/command-line-interface#--ext) `eslint` will only search for `.js` files.**

## Rules

**Key**: :wrench: = fixable, :thought_balloon: = requires type information

| Name                                                                      | Description                     | :wrench: | :thought_balloon: |
| ------------------------------------------------------------------------- | ------------------------------- | -------- | ----------------- |
| [`safer-moment/ban-moment-mutation`](./docs/rules/ban-moment-mutation.md) | Bans mutating `moment` objects. |          | :thought_balloon: |

> Project layout and configuration modified from [`typescript-eslint/eslint-plugin`](https://github.com/typescript-eslint/typescript-eslint/tree/26d71b57fbff013b9c9434c96e2ba98c6c541259/packages/eslint-plugin).
