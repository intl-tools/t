import { resolvePlaceholders } from './resolvePlaceholders';
import { ExtractPlaceholders, MaybeParam } from './types';

export type Translate = <S extends string>(
  text: S,
  ...[values]: MaybeParam<{ [K in ExtractPlaceholders<S>]: unknown }>
) => string;

/**
 * This function doesn't actually do anything besides a bit of string
 * interpolation. Importantly though, it serves as a way to "mark" user-facing
 * strings in the codebase, so they can be statically extracted and translated
 * offline.
 */
export const t: Translate = (text, ...[values]) => {
  return values ? resolvePlaceholders(text, values) : text;
};
