import React, { Fragment } from 'react';
import { describe, expect, it } from 'vitest';

import { t } from '../react';

describe('t', () => {
  it('should work with basic (non-tag) placeholders', () => {
    // @ts-expect-error - Will require a second parameter
    t('Hello {name}');
    // Works when second param provided
    const result = t('Hello {name}', { name: 'foo' });
    expect(result).toEqual(
      <Fragment>{[<Fragment key={0}>Hello foo</Fragment>]}</Fragment>,
    );
    // Allows optional `_` param
    t('Hello {name}', { name: 'foo', _: () => null });
    // @ts-expect-error - Does not allow `_` param to be of invalid type
    t('Hello {name}', { name: 'foo', _: 'x' });
  });

  it('should work with tags and placeholders', () => {
    // @ts-expect-error - Will require p
    t('Hello <p>{name}</p>', { name: 'x' });
    // @ts-expect-error - Will require name
    t('Hello <p>{name}</p>', { p: (x) => x });
    // @ts-expect-error - Will enforce tag resolvers be a function
    t('Hello <p>{name}</p>', { name: 'x', p: 'x' });
    // Works when both are provided
    const result = t('Hello <p>{name}</p>', { name: 'x', p: (x) => `[${x}]` });
    expect(result).toEqual(
      <Fragment>
        <Fragment key={0}>{'Hello '}</Fragment>
        <Fragment key={1}>[x]</Fragment>
      </Fragment>,
    );
    // Allows optional `_` param
    t('Hello <p>{name}</p>', { name: 'x', p: (x) => `[${x}]`, _: () => 'x' });
    // @ts-expect-error - Does not allow `_` param to be of invalid type
    t('Hello <p>{name}</p>', { name: 'x', p: (x) => `[${x}]`, _: null });
  });

  it('should replace placeholders before parsing tags', () => {
    // @ts-expect-error - TS parses placeholders and tags in separate steps; expects both to be provided
    t('Hello {a<p>b</p>c}', { 'a<p>b</p>c': 'x' });
    // However the actual runtime implementation replaces placeholders first, so the tag won't be used
    const result = t('Hello {a<p>b</p>c}', { 'a<p>b</p>c': 'x', p: () => 'y' });
    expect(result).toEqual(
      <Fragment>{[<Fragment key={0}>Hello x</Fragment>]}</Fragment>,
    );
  });

  it('should ignore nested tags', () => {
    // TypeScript can't parse this (it encounters `<a><b>x</b>`) so it expects no second param
    const result = t('Hello <a><b>x</b></a>');
    // The runtime impl saw no second param, so it didn't attempt to parse anything
    expect(result).toEqual('Hello <a><b>x</b></a>');
    // @ts-expect-error - If we override TypeScript to provide a second param, we can test the runtime impl
    const result2 = t('Hello <a><b>x</b></a>', { a: (x) => `[${x}]` });
    // The runtime implementation saw `<a><b>x</b>` as the first match, which is
    // invalid (start/end tag don't match) so it is inserted as-is
    expect(result2).toEqual(
      <Fragment>
        <Fragment key={0}>{'Hello '}</Fragment>
        <Fragment key={1}>{'<a><b>x</b>'}</Fragment>
        <Fragment key={2}>{'</a>'}</Fragment>
      </Fragment>,
    );
  });

  it('should ignore invalid tags', () => {
    // TypeScript can't parse this (it encounters `<a>x</b>`) so it expects no second param
    const result = t('Hello <a>x</b>y</a>');
    // The runtime impl saw no second param, so it didn't attempt to parse anything
    expect(result).toEqual('Hello <a>x</b>y</a>');
    // @ts-expect-error - If we override TypeScript to provide a second param, we can test the runtime impl
    const result2 = t('Hello <a>x</b>y</a>', { a: (x) => `[${x}]` });
    // The runtime implementation saw `<a>x</b>` as the first match, which is
    // invalid (start/end tag don't match) so it is inserted as-is
    expect(result2).toEqual(
      <Fragment>
        <Fragment key={0}>{'Hello '}</Fragment>
        <Fragment key={1}>{'<a>x</b>'}</Fragment>
        <Fragment key={2}>{'y</a>'}</Fragment>
      </Fragment>,
    );
  });

  it('should support fallback resolver', () => {
    const result = t('Hello <b>x</b>', {
      b: (x) => <b>{x}</b>,
      _: (x) => <span>{x}</span>,
    });
    expect(result).toEqual(
      <Fragment>
        <Fragment key={0}>
          <span>{'Hello '}</span>
        </Fragment>
        <Fragment key={1}>
          <b>x</b>
        </Fragment>
      </Fragment>,
    );
  });

  it('should also invoke fallback resolver when named resolver returns string', () => {
    const result = t('Hello <b>x</b>', {
      b: (x) => `[${x}]`,
      _: (x) => <span>{x}</span>,
    });
    expect(result).toEqual(
      <Fragment>
        <Fragment key={0}>
          <span>{'Hello '}</span>
        </Fragment>
        <Fragment key={1}>
          <span>[x]</span>
        </Fragment>
      </Fragment>,
    );
  });
});
