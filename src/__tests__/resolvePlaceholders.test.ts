import { describe, expect, it } from 'vitest';

import { resolvePlaceholders } from '../resolvePlaceholders';

describe('resolvePlaceholders', () => {
  it('should resolve strings without any placeholders', () => {
    const result = resolvePlaceholders('hello world', {});
    expect(result).toEqual('hello world');
  });

  it('should resolve basic placeholders', () => {
    expect(resolvePlaceholders('Hello {x}', { x: 'Foo' })).toBe('Hello Foo');
    expect(resolvePlaceholders('Hello {x}', { x: 123 })).toBe('Hello 123');
    expect(resolvePlaceholders('Hello {x}', { x: true })).toBe('Hello true');
    expect(resolvePlaceholders('Hello {x}', { x: false })).toBe('Hello false');
  });

  it('should ignore null and undefined', () => {
    expect(resolvePlaceholders('Hi {x}', { x: null })).toBe('Hi {x}');
    expect(resolvePlaceholders('Hi {x}', { x: undefined })).toBe('Hi {x}');
    expect(resolvePlaceholders('Hi {x}', {})).toBe('Hi {x}');
  });

  it('should allow empty placeholders', () => {
    expect(resolvePlaceholders('Hi {}', { '': 1 })).toBe('Hi 1');
  });

  it('should allow placeholders with spaces and special characters', () => {
    expect(resolvePlaceholders('Hi { }.', { ' ': 1 })).toBe('Hi 1.');
    expect(resolvePlaceholders('Hi {a b}.', { 'a b': 1 })).toBe('Hi 1.');
    const result = resolvePlaceholders(
      // prettier-ignore
      "Hi {a|[];',./!@#$%^&*()-=_+?<>b}.",
      { "a|[];',./!@#$%^&*()-=_+?<>b": 1 },
    );
    expect(result).toBe('Hi 1.');
  });

  it('should ignore extraneous object properties', () => {
    const result = resolvePlaceholders('hello {x}.', { x: 'Yo', y: '_' });
    expect(result).toEqual('hello Yo.');
  });

  it('should ignore missing placeholders', () => {
    const result = resolvePlaceholders('hello {name}.', { foo: 'bar' });
    expect(result).toEqual('hello {name}.');
  });

  it('should be case sensitive', () => {
    const result = resolvePlaceholders('hello {name}.', { Name: 'bar' });
    expect(result).toEqual('hello {name}.');
  });

  it('should support multiple', () => {
    const result1 = resolvePlaceholders('Hi {name} welcome to {place}', {
      name: 'Tom',
      place: 'Oz',
    });
    expect(result1).toEqual('Hi Tom welcome to Oz');
    const result2 = resolvePlaceholders('Hi {name} welcome to {place}', {
      name: 'Tom',
      place: 'Oz',
    });
    expect(result2).toEqual('Hi Tom welcome to Oz');
    const result3 = resolvePlaceholders('{a}{b}', {
      a: 'Foo',
      b: 'Baz',
    });
    expect(result3).toEqual('FooBaz');
  });
});
