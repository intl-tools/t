import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';

import type { ExtractPlaceholders, MaybeValues } from '../types';

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

describe('MaybeValues', () => {
  it('should compute object from union of string literals', () => {
    expectTypeOf<MaybeValues<never>>().toEqualTypeOf<[]>();
    expectTypeOf<MaybeValues<'x'>>().toEqualTypeOf<[{ x: unknown }]>();
    expectTypeOf<MaybeValues<'x' | 'foo'>>().toEqualTypeOf<
      [{ x: unknown; foo: unknown }]
    >();
  });
});
