# @intl/t

This package provides a function `t()` which serves as a way to mark user-facing strings for translation. These strings are not translated at runtime but can be [statically extracted](https://github.com/gilbsgilbs/babel-plugin-i18next-extract) for translation offline.

The only thing `t()` does at runtime is string interpolation. This is well typed using TypeScript.

The first parameter to `t()` should always be a string literal, it should never be a variable or expression. Protip: Use [eslint-plugin-t](https://www.npmjs.com/package/eslint-plugin-t) to enforce this.

Examples:

```ts
// ✅ Correct Usage
t('Good morning!');

// ✅ Correct Usage
t('Hello {name}!', { name: 'Alice' });

// 🚫 TypeScript Error - Wrong property name
t('Hello {name}!', { firstName: 'Bob' });

// 🚫 TypeScript Error - Missing property `name`
t('Hello {name}!', {});
```

## Installation

1. Install using your favorite package manager

   ```
   npm install @intl/t
   # -- or --
   yarn add @intl/t
   ```

2. Optionally make `t()` a global

   > (TODO: Add instructions for this, including adding to `global.d.ts` and eslint config, jest)

3. Consider installing the eslint plugin [eslint-plugin-t](https://www.npmjs.com/package/eslint-plugin-t)

## React

In React (or React Native) apps you might have special styling that needs to be applied to a portion of a sentence or phrase. You don't want to break up a sentence into multiple `t()` calls [^1] so we provide a special syntax for this.

Examples:

```tsx
// Be sure to import the React version of `t()`
import { t } from '@intl/t/react';

// Wrap spans of text in an html-style tag (of any name), then provide a
// resolver for each tag name
t('Hello <b>world</b>!', {
  b: (content) => <span class="bold">{content}</span>,
});

// You can use value placeholders as well as tags
t('Hello <b>{name}</b>, click <a>here</a> to continue!', {
  name: currentUser.name,
  a: (content) => <a href="/next">{content}</a>,
  b: (content) => <strong>{content}</strong>,
});

// You can use any name for the html-like tags
t('Please <loginLink>login</loginLink> to to continue.', {
  loginLink: (content) => <a href="/login">{content}</a>,
});

// In React Native, all strings must be wrapped in a <Text> element, so we have
// a "fallback resolver" denoted by "_"
t('Hello <b>world</b>!', {
  b: (content) => <Text style={styles.bold}>{content}</Text>,
  _: (content) => <Text>{content}</Text>,
});

// The above is rendered as:
<>
  <Text>Hello </Text>
  <Text style={styles.bold}>world</Text>
  <Text>!</Text>
</>;
```

## Footnotes

[^1]: Breaking up a sentence into multiple `t()` calls will essentially hard-code a specific word order to the sentence, however word order can be different in different languages, so we want to avoid this.
