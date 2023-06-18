import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';

import type { ExtractPlaceholders, ExtractTags, MaybeParam } from '../types';

describe('ExtractPlaceholders', () => {
  it('should handle strings without placeholders', () => {
    type Result = ExtractPlaceholders<'foo'>;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });

  it('should handle strings with a single placeholder', () => {
    expectTypeOf<ExtractPlaceholders<'{foo}'>>().toEqualTypeOf<'foo'>();
    expectTypeOf<ExtractPlaceholders<'a{foo}'>>().toEqualTypeOf<'foo'>();
    expectTypeOf<ExtractPlaceholders<'{foo}b'>>().toEqualTypeOf<'foo'>();
    expectTypeOf<ExtractPlaceholders<'a{foo}b'>>().toEqualTypeOf<'foo'>();
    expectTypeOf<ExtractPlaceholders<'a {foo} b'>>().toEqualTypeOf<'foo'>();
  });

  it('should handle multiple placeholders', () => {
    type Result1 = ExtractPlaceholders<'{foo}{bar}'>;
    expectTypeOf<Result1>().toEqualTypeOf<'foo' | 'bar'>();
    type Result2 = ExtractPlaceholders<'{foo}b{bar}'>;
    expectTypeOf<Result2>().toEqualTypeOf<'foo' | 'bar'>();
    type Result3 = ExtractPlaceholders<'a{foo} {bar}'>;
    expectTypeOf<Result3>().toEqualTypeOf<'foo' | 'bar'>();
    type Result4 = ExtractPlaceholders<'{foo}_{bar}c'>;
    expectTypeOf<Result4>().toEqualTypeOf<'foo' | 'bar'>();
    type Result5 = ExtractPlaceholders<'a{foo}b{bar}c'>;
    expectTypeOf<Result5>().toEqualTypeOf<'foo' | 'bar'>();
  });

  it('should handle strings with duplicate placeholders', () => {
    type Result = ExtractPlaceholders<'a {foo} b {bar} {foo}'>;
    expectTypeOf<Result>().toEqualTypeOf<'foo' | 'bar'>();
  });

  it('should handle placeholder names with spaces and special characters', () => {
    expectTypeOf<ExtractPlaceholders<'{a b}'>>().toEqualTypeOf<'a b'>();
    type Result = ExtractPlaceholders<"{a|[];',./!@#$%^&*()-=_+?<>b}">;
    expectTypeOf<Result>().toEqualTypeOf<"a|[];',./!@#$%^&*()-=_+?<>b">();
  });

  it('should handle placeholder names with underscore', () => {
    type Result = ExtractPlaceholders<'{foo_baz}'>;
    expectTypeOf<Result>().toEqualTypeOf<'foo_baz'>();
  });

  it('should handle empty placeholder', () => {
    expectTypeOf<ExtractPlaceholders<'{}'>>().toEqualTypeOf<''>();
    expectTypeOf<ExtractPlaceholders<'a{}'>>().toEqualTypeOf<''>();
    expectTypeOf<ExtractPlaceholders<'{}b'>>().toEqualTypeOf<''>();
    expectTypeOf<ExtractPlaceholders<'a{}b'>>().toEqualTypeOf<''>();
  });
});

describe('ExtractTags', () => {
  it('should handle plain strings', () => {
    type Result = ExtractTags<'foo'>;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });

  it('should handle only a single tag', () => {
    type Result = ExtractTags<'<foo>hello</foo>'>;
    expectTypeOf<Result>().toEqualTypeOf<'foo'>();
  });

  it('should handle multiple tags with and without text before/after', () => {
    type Result1 = ExtractTags<'<foo>hello</foo><bar>world</bar>'>;
    expectTypeOf<Result1>().toEqualTypeOf<'foo' | 'bar'>();
    type Result2 = ExtractTags<'<foo>hello</foo>b<bar>world</bar>'>;
    expectTypeOf<Result2>().toEqualTypeOf<'foo' | 'bar'>();
    type Result3 = ExtractTags<'a<foo>he llo</foo> <bar>world</bar>'>;
    expectTypeOf<Result3>().toEqualTypeOf<'foo' | 'bar'>();
    type Result4 = ExtractTags<'<foo>hello</foo>_<bar>world</bar>c'>;
    expectTypeOf<Result4>().toEqualTypeOf<'foo' | 'bar'>();
    type Result5 = ExtractTags<'a<foo>hello</foo>b<bar>world</bar>c'>;
    expectTypeOf<Result5>().toEqualTypeOf<'foo' | 'bar'>();
  });

  it('should handle tag names with spaces and special characters', () => {
    expectTypeOf<ExtractTags<'<f_o>hello</f_o>'>>().toEqualTypeOf<'f_o'>();
    expectTypeOf<ExtractTags<'<f o>hello</f o>'>>().toEqualTypeOf<'f o'>();
    expectTypeOf<ExtractTags<'<>hello</>'>>().toEqualTypeOf<''>();
    expectTypeOf<ExtractTags<'< >hello</ >'>>().toEqualTypeOf<' '>();
    type Result =
      ExtractTags<"<a|[];',./!@#$%^&*()-=_+?b>hello</a|[];',./!@#$%^&*()-=_+?b>">;
    expectTypeOf<Result>().toEqualTypeOf<"a|[];',./!@#$%^&*()-=_+?b">();
  });

  it('should ignore non-matching start and end tags', () => {
    expectTypeOf<ExtractTags<'<foo>hello</bar>'>>().toEqualTypeOf<never>();
    expectTypeOf<ExtractTags<'<foo>hello</foo1>'>>().toEqualTypeOf<never>();
  });
});

describe('MaybeParam', () => {
  it('should return empty tuple for objects without properties', () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    type Result1 = MaybeParam<{}>;
    expectTypeOf<Result1>().toEqualTypeOf<[]>();
    type Result2 = MaybeParam<{ [K in never]: string }>;
    expectTypeOf<Result2>().toEqualTypeOf<[]>();
    type Result3 = MaybeParam<Record<never, boolean>>;
    expectTypeOf<Result3>().toEqualTypeOf<[]>();
  });

  it('should return valid tuple for objects with properties', () => {
    type Result1 = MaybeParam<{ foo: number }>;
    expectTypeOf<Result1>().toEqualTypeOf<[{ foo: number }]>();
    type Result2 = MaybeParam<{ foo: number; bar: never }>;
    expectTypeOf<Result2>().toEqualTypeOf<[{ foo: number; bar: never }]>();
    type Result3 = MaybeParam<Record<string, boolean>>;
    expectTypeOf<Result3>().toEqualTypeOf<[Record<string, boolean>]>();
  });
});
