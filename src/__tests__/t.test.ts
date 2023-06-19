import { describe, expect, it } from 'vitest';

import { t } from '../t';

describe('t', () => {
  it('should use TS to enforce substitution parameters', () => {
    // @ts-expect-error - Will require a second parameter if necessary
    t('Hello {name}');
    // Will allow an empty second parameter
    t('Hello', {});
    // @ts-expect-error - Will not allow extraneous parameters
    t('Hello {name}', { name: 'x', foo: 'y' });
    // @ts-expect-error - Will require the correct parameter name
    t('Hello {name}', { foo: 1 });
    // @ts-expect-error - Allow empty placeholder, but require second parameter
    t('Hello {}');
    // @ts-expect-error - Require property with empty-string key
    t('Hello {}', {});
    // Allow property with empty-string key
    t('Hello {}', { '': 1 });
    expect(true).toBeTruthy();
  });
});
