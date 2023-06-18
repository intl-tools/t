import { resolvePlaceholders } from './resolvePlaceholders';
import { ExtractPlaceholders, MaybeValues } from './types';

/**
 * This function doesn't actually do anything besides a bit of string formatting
 * (see `interpolate` below). Importantly though, it serves as a way to "mark"
 * string literals in the codebase, so they can be statically extracted and
 * translated offline.
 */
export function t<S extends string>(
  text: S,
  ...[values]: MaybeValues<ExtractPlaceholders<S>>
) {
  return values ? resolvePlaceholders(text, values) : text;
}
