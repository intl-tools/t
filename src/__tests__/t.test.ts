import { t } from '../t';

describe('t', () => {
  it('should return a normal string unmodified', () => {
    expect(t('Hello')).toBe('Hello');
  });

  it('should interpolate strings', () => {
    expect(t('Hello {name}', { name: 'World' })).toBe('Hello World');
    expect(t('Hello {name}', { name: 123 })).toBe('Hello 123');
    expect(t('Hello {name}', { name: true })).toBe('Hello true');
  });

  it('should not ignore null and undefined', () => {
    expect(t('Hello {name}', { name: null })).toBe('Hello {name}');
    expect(t('Hello {name}', { name: undefined })).toBe('Hello {name}');
    // @ts-expect-error - TS will require the name parameter
    expect(t('Hello {name}', {})).toBe('Hello {name}');
  });

  it('should use TS to enforce substitution parameters', () => {
    // @ts-expect-error - Will require a second parameter if necessary
    t('Hello {name}');
    // @ts-expect-error - Will not allow a second parameter id not necessary
    t('Hello', {});
    // @ts-expect-error - Will not allow extraneous parameters
    t('Hello {name}', { name: 'x', foo: 'y' });
    // @ts-expect-error - Will require the correct parameter name
    t('Hello {name}', { foo: 1 });
    expect(true).toBeTruthy();
  });
});
