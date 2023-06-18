import { describe, expect, it } from 'vitest';

import { resolveTags } from '../resolveTags';

describe('resolveTags', () => {
  it('should resolve basic tags', () => {
    const wrap = (input: string) => input;
    const result1 = resolveTags(
      'a <link>b</link> c',
      { link: (content: string) => `[${content}]` },
      wrap,
    );
    expect(result1.join('')).toEqual('a [b] c');
    const result2 = resolveTags(
      'Hello <link>world</link>.',
      { link: (content: string) => `[${content}]` },
      wrap,
    );
    expect(result2.join('')).toEqual('Hello [world].');
    const result3 = resolveTags(
      'Hello <a>Alice</a> and <a>B Bob</a>.',
      { a: (content: string) => `[${content}]` },
      wrap,
    );
    expect(result3.join('')).toEqual('Hello [Alice] and [B Bob].');
    const result4 = resolveTags(
      'Hello <a>Alice</a> and <b>B<Bob</b>.',
      {
        a: (content: string) => `[${content}]`,
        b: (content: string) => `{${content}}`,
      },
      wrap,
    );
    expect(result4.join('')).toEqual('Hello [Alice] and {B<Bob}.');
  });

  it('should allow spaces and symbols in tag names', () => {
    const wrap = (input: string) => input;
    const result1 = resolveTags(
      'a <x y>b</x y> c',
      { 'x y': (content: string) => `[${content}]` },
      wrap,
    );
    expect(result1.join('')).toEqual('a [b] c');
    const result2 = resolveTags(
      'a <a|[];\'",./!@#$%^&*()-=_+?b>b</a|[];\'",./!@#$%^&*()-=_+?b> c',
      { 'a|[];\'",./!@#$%^&*()-=_+?b': (content: string) => `[${content}]` },
      wrap,
    );
    expect(result2.join('')).toEqual('a [b] c');
  });

  it('should allow resolvers and wrap to return non-string', () => {
    type ReactNode = string | { type: string; children: ReactNode };
    const wrap = (input: ReactNode) => ({ type: 'fragment', children: input });
    const result1 = resolveTags(
      'Hello <link>world</link>.',
      { link: (content: string) => ({ type: 'p', children: content }) },
      wrap,
    );
    expect(result1).toEqual([
      { type: 'fragment', children: 'Hello ' },
      { type: 'fragment', children: { type: 'p', children: 'world' } },
      { type: 'fragment', children: '.' },
    ]);
  });
});
