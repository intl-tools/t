import { resolvePlaceholders } from './resolvePlaceholders';
import { ExtractPlaceholders, MaybeValues } from './types';

/**
 * This function doesn't actually do anything besides a bit of string
 * interpolation. Importantly though, it serves as a way to "mark" user-facing
 * strings in the codebase, so they can be statically extracted and translated
 * offline.
 */
export function t<S extends string>(
  text: S,
  ...[values]: MaybeValues<ExtractPlaceholders<S>>
) {
  return values ? resolvePlaceholders(text, values) : text;
}
